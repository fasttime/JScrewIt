#!/usr/bin/env node

// Patch Rollup to prevent it from trimming blocks of multiple single-line comments before import
// statements at the beginning of a module (See for instance "src/lib/definitions.js" or
// "src/lib/optimizers/to-string-optimizer.js").

import { readFile, writeFile }  from 'fs/promises';
import { createRequire }        from 'module';
import { join }                 from 'path';

const SEARCH_LINE =
'            start + findFirstLineBreakOutsideComment(code.original.slice(start, nextNode.start))' +
'[1];\n';
const REPLACEMENT_LINE =
'            start + code.original.slice(start, nextNode.start).search(/\\n\\s*$/) + 1;\n';

const require = createRequire(import.meta.url);
const rollupPath = join(require.resolve('rollup'), '../shared/rollup.js');
const input = await readFile(rollupPath, 'utf8');
const index = input.indexOf(SEARCH_LINE);
if (index === 0 || index > 0 && input[index - 1] === '\n')
{
    const output =
    input.slice(0, index) + REPLACEMENT_LINE + input.slice(index + SEARCH_LINE.length);
    await writeFile(rollupPath, output);
    console.log('Patching rollup.');
}
else
    console.log('Nothing to patch in rollup.');
