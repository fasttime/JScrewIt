#!/usr/bin/env node

import { makeLib } from './impl.js';

(async () =>
{
    try
    {
        await makeLib();
    }
    catch (error)
    {
        console.error(error);
        process.exitCode = 1;
    }
}
)();
