#!/usr/bin/env node

import { fileURLToPath }    from 'node:url';
import { lint }             from './impl.js';

const pkgPath = fileURLToPath(new URL('..', import.meta.url));
process.chdir(pkgPath);
await lint();
