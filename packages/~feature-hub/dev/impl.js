import { join }                 from 'path';
import rollupPluginNodeBuiltins from 'rollup-plugin-node-builtins';
import rollupPluginNodeGlobals  from 'rollup-plugin-node-globals';
import { fileURLToPath }        from 'url';

const PACKAGE_UTILS_URL = '../../../dev/internal/package-utils.mjs';

export async function clean()
{
    const { cleanPackage } = await importPackageUtils();
    const pkgURL = new URL('..', import.meta.url);
    await
    cleanPackage(pkgURL, '.nyc_output', '.tmp-out', 'coverage', 'lib', 'test/node-legacy');
}

const importPackageUtils = () => import(PACKAGE_UTILS_URL);

export async function lint()
{
    const { lintPackage } = await importPackageUtils();
    await
    lintPackage
    (
        {
            src: 'src/**/*.ts',
            parserOptions: { project: 'tsconfig.json', sourceType: 'module' },
        },
        {
            src: 'test/spec/**/*.ts',
            envs: ['ebdd/ebdd', 'mocha'],
            parserOptions: { project: 'tsconfig.json', sourceType: 'module' },
            plugins: ['ebdd'],
        },
        {
            src: ['*.js', 'dev/**/*.js'],
            envs: ['node'],
            parser: '@babel/eslint-parser',
            parserOptions:
            {
                babelOptions: { plugins: ['@babel/plugin-syntax-top-level-await'] },
                ecmaVersion: 2021,
                requireConfigFile: false,
            },
        },
        { src: 'test/node-legacy-adapter.js', envs: ['node'] },
    );
}

export async function makeBrowserSpecRunner()
{
    const { bundleJS, compileTS } = await import(PACKAGE_UTILS_URL);
    const pkgURL = new URL('..', import.meta.url);
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
        const plugins = [rollupPluginNodeBuiltins(), rollupPluginNodeGlobals({ buffer: false })];
        const inputOptions = { input: inputPath, onwarn, plugins };
        const outputPath = join(pkgPath, 'test/browser-spec-runner.js');
        const outputOptions = { esModule: false, file: outputPath, format: 'iife' };
        await bundleJS(inputOptions, outputOptions);
    }
}

export async function makeLib()
{
    const { makePackage } = await import(PACKAGE_UTILS_URL);
    const pkgURL = new URL('..', import.meta.url);
    await makePackage(pkgURL);
}
