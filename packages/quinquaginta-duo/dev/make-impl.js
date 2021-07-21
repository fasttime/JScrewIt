import fastGlob             from 'fast-glob';
import { createRequire }    from 'module';
import { join }             from 'path';
import { rollup }           from 'rollup';
import rollupPluginCleanup  from 'rollup-plugin-cleanup';
import ts                   from 'typescript';
import { fileURLToPath }    from 'url';

async function bundle(pkgPath)
{
    const pkgConfigPath = join(pkgPath, 'package.json');
    const require = createRequire(pkgConfigPath);
    const { homepage, name } = require(pkgConfigPath);
    const inputPath = join(pkgPath, '.tmp-out/quinquaginta-duo.js');
    const inputOptions =
    {
        external: ['tslib'],
        input: inputPath,
        onwarn(warning)
        {
            if (warning.code !== 'THIS_IS_UNDEFINED')
                console.error(warning.message);
        },
        plugins: [rollupPluginCleanup({ comments: /^(?!\/ *(?:@ts-|eslint-disable-line ))/ })],
    };
    const outputPath = join(pkgPath, 'lib/quinquaginta-duo.js');
    const outputOptions =
    { banner: `// ${name} – ${homepage}\n`, file: outputPath, format: 'esm' };
    const bundle = await rollup(inputOptions);
    await bundle.write(outputOptions);
}

async function compile(pkgPath)
{
    const { sys } = ts;
    const libDirPath = join(pkgPath, 'lib');
    const program =
    await
    (async () =>
    {
        const fileNames = await fastGlob('src/**/*.ts', { absolute: true, cwd: pkgPath });
        const tsConfigPath = join(pkgPath, 'tsconfig.json');
        const tsConfig = ts.readConfigFile(tsConfigPath, sys.readFile);
        const parsed = ts.parseJsonConfigFileContent(tsConfig.config, sys, pkgPath);
        const compilerOptions = parsed.options;
        compilerOptions.declarationDir  = libDirPath;
        compilerOptions.outDir          = join(pkgPath, '.tmp-out');
        compilerOptions.rootDir         = join(pkgPath, 'src');
        const program = ts.createProgram(fileNames, compilerOptions);
        return program;
    }
    )();
    const emitResult = program.emit();
    const diagnostics = [...ts.getPreEmitDiagnostics(program), ...emitResult.diagnostics];
    if (diagnostics.length)
    {
        const reporter = ts.createDiagnosticReporter(sys, true);
        diagnostics.forEach(reporter);
    }
    if (emitResult.emitSkipped)
        throw Error('TypeScript compilation failed');
}

export default async function make()
{
    const pkgURL = new URL('..', import.meta.url);
    const pkgPath = fileURLToPath(pkgURL);
    await compile(pkgPath);
    await bundle(pkgPath);
}
