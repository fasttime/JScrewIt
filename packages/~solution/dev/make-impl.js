const PACKAGE_UTILS_URL = '../../../dev/internal/package-utils.mjs';

export default async function make()
{
    const { makePackage } = await import(PACKAGE_UTILS_URL);
    const pkgURL = new URL('..', import.meta.url);
    await makePackage(pkgURL);
}
