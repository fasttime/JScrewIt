#!/usr/bin/env node

import { lint }             from './impl.js';
import { fileURLToPath }    from 'url';

(async () =>
{
    try
    {
        const pkgPath = fileURLToPath(new URL('..', import.meta.url));
        process.chdir(pkgPath);
        await lint();
    }
    catch (error)
    {
        console.error(error);
        process.exitCode = 1;
    }
}
)();
