import { lint as lintImpl } from '@fasttime/lint';

const PACKAGE_UTILS_URL = '../../../dev/internal/package-utils.mjs';

export async function lint()
{
    await
    lintImpl
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
            parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
        },
    );
}

export async function make()
{
    const { makePackage } = await import(PACKAGE_UTILS_URL);
    const pkgURL = new URL('..', import.meta.url);
    await makePackage(pkgURL);
}
