import fastGlob                         from 'fast-glob';
import { createRequire }                from 'module';
import { isAbsolute, join, relative }   from 'path';
import { rollup }                       from 'rollup';
import rollupPluginCleanup              from 'rollup-plugin-cleanup';
import ts                               from 'typescript';
import { fileURLToPath }                from 'url';

async function bundle(pkgPath)
{
    const pkgConfigPath = join(pkgPath, 'package.json');
    const require = createRequire(pkgConfigPath);
    const { homepage, name } = require(pkgConfigPath);
    const inputPath = join(pkgPath, '.tmp-out/index.js');
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
    const outputPath = join(pkgPath, 'lib/index.js');
    const outputOptions =
    { banner: `// ${name} – ${homepage}\n`, file: outputPath, format: 'esm' };
    const bundle = await rollup(inputOptions);
    await bundle.write(outputOptions);
}

async function compile(pkgPath)
{
    const { sys } = ts;
    const declarationDir = join(pkgPath, 'lib');
    const program =
    await
    (async () =>
    {
        const fileNames = await fastGlob('src/**/*.ts', { absolute: true, cwd: pkgPath });
        const tsConfigPath = join(pkgPath, 'tsconfig.json');
        const tsConfig = ts.readConfigFile(tsConfigPath, sys.readFile);
        const { options } = ts.parseJsonConfigFileContent(tsConfig.config, sys, pkgPath);
        options.declaration     = true;
        options.declarationDir  = declarationDir;
        options.importHelpers   = true;
        options.module          = ts.ModuleKind.ES2020;
        options.outDir          = join(pkgPath, '.tmp-out');
        options.rootDir         = join(pkgPath, 'src');
        options.types           = [];
        const program = ts.createProgram(fileNames, options);
        return program;
    }
    )();
    const condition = ['index.d.ts', 'solution.d.ts', 'solution-type.d.ts'];
    const writeFile =
    (path, data, writeByteOrderMark) =>
    {
        const relativePath = relative(declarationDir, path);
        if
        (
            relativePath.startsWith('..') ||
            isAbsolute(relativePath) ||
            condition.includes(relativePath)
        )
            sys.writeFile(path, data, writeByteOrderMark);
    };
    const emitResult = program.emit(undefined, writeFile);
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
