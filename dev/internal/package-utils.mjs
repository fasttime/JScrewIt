import { rm }                                   from 'node:fs/promises';
import { createRequire }                        from 'node:module';
import { isAbsolute, join, relative, resolve }  from 'node:path';
import { fileURLToPath }                        from 'node:url';

async function bundle(inputOptions, outputOptions)
{
    const { rollup } = await import('rollup');

    const bundle = await rollup(inputOptions);
    const { output: [{ code }] } = await bundle.write(outputOptions);
    return code;
}

async function bundleLib(pkgPath)
{
    const { default: rollupPluginCleanup } = await import('rollup-plugin-cleanup');

    const pkgConfigPath = join(pkgPath, 'package.json');
    const require = createRequire(pkgConfigPath);
    const { homepage, name } = require(pkgConfigPath);
    const inputPath = join(pkgPath, '.tmp-out/index.js');
    const inputOptions =
    {
        external:   ['tslib'],
        input:      inputPath,
        plugins:    [rollupPluginCleanup({ comments: /^(?!\/\s*(?:@ts-|eslint-))/ })],
    };
    const outputPath = join(pkgPath, 'lib/index.js');
    const outputOptions =
    {
        banner: `// ${name} – ${homepage}\n`,
        file:   outputPath,
        footer: `\n// End of module ${name}`,
        format: 'esm',
    };
    await bundle(inputOptions, outputOptions);
}

export async function cleanPackage(pkgURL, ...paths)
{
    const pkgPath = fileURLToPath(pkgURL);
    const options = { force: true, recursive: true };
    const cleanPath =
    async path =>
    {
        const resolvedPath = resolve(pkgPath, path);
        await rm(resolvedPath, options);
    };
    const promises = paths.map(cleanPath);
    await Promise.all(promises);
}

async function compileLib(pkgPath, dTsFilter)
{
    const { default: ts } = await import('typescript');

    const declarationDir = join(pkgPath, 'lib');
    const newOptions =
    {
        declaration:    true,
        declarationDir,
        importHelpers:  true,
        outDir:         join(pkgPath, '.tmp-out'),
        rootDir:        join(pkgPath, 'src'),
        types:          ['node'],
    };
    const writeFile = getWriteFile(ts.sys.writeFile, declarationDir, dTsFilter);
    await compileTS(pkgPath, 'src/**/*.ts', newOptions, writeFile);
}

async function compileTS(pkgPath, source, newOptions, writeFile)
{
    const [{ glob }, { default: ts }] = await Promise.all([import('glob'), import('typescript')]);

    const { sys } = ts;
    const program =
    await
    (async () =>
    {
        const fileNames = await glob(source, { absolute: true, cwd: pkgPath });
        const tsConfigPath = join(pkgPath, 'tsconfig.json');
        const tsConfig = ts.readConfigFile(tsConfigPath, sys.readFile);
        const { options } = ts.parseJsonConfigFileContent(tsConfig.config, sys, pkgPath);
        Object.assign(options, { module: ts.ModuleKind.ES2020 }, newOptions);
        const program = ts.createProgram(fileNames, options);
        return program;
    }
    )();
    const emitResult = program.emit(undefined, writeFile);
    const diagnostics =
    [
        ...ts.getPreEmitDiagnostics(program).filter(({ code }) => code !== 2343),
        ...emitResult.diagnostics,
    ];
    if (diagnostics.length)
    {
        const reporter = ts.createDiagnosticReporter(sys, true);
        diagnostics.forEach(reporter);
    }
    if (emitResult.emitSkipped)
        throw Error('TypeScript compilation failed');
}

export async function doMakeBrowserSpecRunner(pkgURL)
{
    const { default: rollupPluginPolyfillNode } = await import('rollup-plugin-polyfill-node');
    const pkgPath = fileURLToPath(pkgURL);
    {
        const outDir = join(pkgPath, '.tmp-out');
        const rootDir = join(pkgPath, '.');
        const newOptions = { outDir, rootDir };
        await compileTS(pkgPath, '{src,test}/**/*.ts', newOptions);
    }
    {
        const inputPath = join(pkgPath, '.tmp-out/test/browser-spec-runner.js');
        const onwarn =
        warning =>
        {
            if (warning.code !== 'THIS_IS_UNDEFINED')
                console.error(warning.message);
        };
        const plugins = [rollupPluginPolyfillNode()];
        const inputOptions = { input: inputPath, onwarn, plugins };
        const outputPath = join(pkgPath, 'test/browser-spec-runner.js');
        const outputOptions = { esModule: false, file: outputPath, format: 'iife' };
        await bundle(inputOptions, outputOptions);
    }
}

export async function doMakeLib(pkgURL, dTsFilter)
{
    const pkgPath = fileURLToPath(pkgURL);
    await compileLib(pkgPath, dTsFilter);
    await bundleLib(pkgPath);
}

function getWriteFile(sysWriteFile, declarationDir, dTsFilter)
{
    const writeFile =
    dTsFilter === undefined ?
    sysWriteFile :
    (path, data, writeByteOrderMark) =>
    {
        const relativePath = relative(declarationDir, path);
        if
        (
            relativePath.startsWith('..') ||
            isAbsolute(relativePath) ||
            dTsFilter.includes(relativePath)
        )
            sysWriteFile(path, data, writeByteOrderMark);
    };
    return writeFile;
}

export async function lintPackage(...configData)
{
    const { createConfig }              = await import('@origin-1/eslint-config');
    const { default: { FlatESLint } }   = await import('eslint/use-at-your-own-risk');

    const overrideConfig = await createConfig(...configData);
    const eslint    = new FlatESLint({ overrideConfig, overrideConfigFile: true });
    const files     = configData.map(({ files }) => files).flat();
    const results   = await eslint.lintFiles(files);
    const formatter = await eslint.loadFormatter('compact');
    const output = await formatter.format(results);
    if (output)
    {
        console.error(output);
        const error = 'Lint failed.';
        throw error;
    }
}
