export async function clean()
{
    const { cleanPackage } = await importPackageUtils();
    const pkgURL = new URL('..', import.meta.url);
    await
    cleanPackage(pkgURL, '.nyc_output', '.tmp-out', 'coverage', 'lib', 'test/node-legacy');
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
            files:              ['src/**/*.ts'],
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

export async function make()
{
    const { doMakeLib } = await importPackageUtils();
    const pkgURL = new URL('..', import.meta.url);
    await doMakeLib(pkgURL, ['index.d.ts', 'solution.d.ts', 'solution-type.d.ts']);
}
