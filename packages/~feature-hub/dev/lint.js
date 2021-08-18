#!/usr/bin/env node

import { lint }             from './impl.js';
import { fileURLToPath }    from 'url';

const pkgPath = fileURLToPath(new URL('..', import.meta.url));
process.chdir(pkgPath);
await lint();
