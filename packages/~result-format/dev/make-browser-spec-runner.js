#!/usr/bin/env node

import { makeBrowserSpecRunner } from './make-impl.js';

(async () =>
{
    try
    {
        await makeBrowserSpecRunner();
    }
    catch (error)
    {
        console.error(error);
        process.exitCode = 1;
    }
}
)();
