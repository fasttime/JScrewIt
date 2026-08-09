export async function clean()
{
    const { cleanPackage } = await importPackageUtils();
    const pkgURL = new URL('..', import.meta.url);
    await cleanPackage(pkgURL, '.nyc_output', '.tmp-out', 'coverage', 'lib');
}

const importPackageUtils = () => import('../../../dev/internal/package-utils.mjs');

export async function lint()
{
    const
    [{ lintPackage }, { default: origin1 }, { globals: ebddGlobals }, { default: globals }] =
    await Promise.all
    (
        [
            importPackageUtils(),
            import('@origin-1/eslint-plugin'),
            import('eslint-plugin-ebdd'),
            import('globals'),
        ],
    );
    await
    lintPackage
    (
        {
            files:              ['src/**/*.ts'],
            tsVersion:          '6.0.0',
        },
        {
            files:              ['test/spec/**/*.ts'],
            tsVersion:          '6.0.0',
            languageOptions:    { globals: { ...ebddGlobals, ...globals.nodeBuiltin } },
        },
        {
            files:              ['*.js', 'dev/**/*.js'],
            jsVersion:          2022,
            languageOptions:    { globals: globals.nodeBuiltin },
        },
        {
            files:              ['package.json'],
            jsonVersion:        'standard',
            plugins:            { '@origin-1': origin1 },
            rules:              { '@origin-1/package-json-fields': 'error' },
        },
    );
}

export async function make()
{
    const { doMakeLib } = await importPackageUtils();
    const pkgURL = new URL('..', import.meta.url);
    await doMakeLib(pkgURL, ['index.d.ts', 'solution.d.ts', 'solution-type.d.ts']);
}
