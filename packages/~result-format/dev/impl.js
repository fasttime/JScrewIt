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
    const [{ lintPackage }, { globals: ebddGlobals }, { default: globals }] =
    await Promise.all([importPackageUtils(), import('eslint-plugin-ebdd'), import('globals')]);
    await
    lintPackage
    (
        {
            files:              ['src/**/*.ts', 'test/*.ts'],
            tsVersion:          'latest',
            languageOptions:    { parserOptions: { project: 'tsconfig.json' } },
        },
        {
            files:              ['test/spec/**/*.ts'],
            tsVersion:          'latest',
            languageOptions:
            {
                globals:        { ...ebddGlobals, ...globals.node },
                parserOptions:  { project: 'tsconfig.json' },
            },
            rules:              { 'n/prefer-node-protocol': 'off' },
        },
        {
            files:              ['*.js', 'dev/**/*.js'],
            jsVersion:          2022,
            languageOptions:    { globals: globals.node },
        },
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
