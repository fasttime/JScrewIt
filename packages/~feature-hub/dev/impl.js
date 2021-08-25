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
            src: 'test/**/*.ts',
            envs: ['ebdd/ebdd', 'mocha'],
            parserOptions: { project: 'test/tsconfig.json', sourceType: 'module' },
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
        { src: 'test/*.js', envs: ['node'] },
    );
}

export async function make()
{
    const { makePackage } = await import(PACKAGE_UTILS_URL);
    const pkgURL = new URL('..', import.meta.url);
    await makePackage(pkgURL);
}
