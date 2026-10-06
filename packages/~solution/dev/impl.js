import { dirname } from 'node:path';

export async function clean()
{
    const { cleanPackage } = await importPackageUtils();
    const pkgURL = new URL('..', import.meta.url);
    await cleanPackage(pkgURL, '.nyc_output', '.tmp-out', 'coverage', 'lib');
}

const importPackageUtils = () => import('../../../dev/internal/package-utils.mjs');

export async function lint()
{
    const { lintPackage } = await importPackageUtils();

    const pkgPath = dirname(import.meta.dirname);
    await lintPackage(pkgPath);
}

export async function make()
{
    const { doMakeLib } = await importPackageUtils();
    const pkgURL = new URL('..', import.meta.url);
    await doMakeLib(pkgURL, ['index.d.ts', 'solution.d.ts', 'solution-type.d.ts']);
}
