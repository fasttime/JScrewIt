#!/usr/bin/env node

import make from './make-impl.js';

(async () =>
{
    try
    {
        await make();
    }
    catch (error)
    {
        console.error(error);
        process.exitCode = 1;
    }
}
)();
