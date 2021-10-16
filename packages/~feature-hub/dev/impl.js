export async function clean()
{
    const { cleanPackage } = await importPackageUtils();
    const pkgURL = new URL('..', import.meta.url);
    await
    cleanPackage
    (
        pkgURL,
        '.nyc_output',
        '.tmp-out',
        'coverage',
        'lib',
        'test/browser-spec-runner.js',
        'test/node-legacy',
    );
}

const importPackageUtils = () => import('../../../dev/internal/package-utils.mjs');

export async function lint()
{
    const { lintPackage } = await importPackageUtils();
    await
    lintPackage
    (
        {
            src: ['src/**/*.ts', 'test/*.ts'],
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
            envs: 'node',
            parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
        },
        { src: 'test/node-legacy-adapter.js', envs: 'node' },
    );
}

export async function makeBrowserSpecRunner()
{
    const { doMakeBrowserSpecRunner } = await importPackageUtils();
    const pkgURL = new URL('..', import.meta.url);
    await doMakeBrowserSpecRunner(pkgURL);
}

export async function makeLib()
{
    const { doMakeLib } = await importPackageUtils();
    const pkgURL = new URL('..', import.meta.url);
    await doMakeLib(pkgURL);
}
