/* eslint-env node */

'use strict';

const { createRequire } = require('module');

const MARKER_LINES =
{
    __proto__: null,
    '    var extendStatics = function(d, b) {\n': 5,
    '    function __extends(d, b) {\n': 6,
};

const c8Require = createRequire(require.resolve('c8'));
const CovLine = c8Require('v8-to-istanbul/lib/line');
const CovSource = c8Require('v8-to-istanbul/lib/source');
CovSource.prototype._buildLines =
function (source)
{
    const ignoredRanges = [];
    const ignoreRange = (from, to) => ignoredRanges.push({ from, to });
    const { lines } = this;
    let position = 0;
    for (const [index, lineStr] of source.split(/(?<=\r?\n)/).entries())
    {
        const line = new CovLine(index + 1, position, lineStr);
        const testIgnoreNextLines =
        lineStr.match(/^\s*\/\* c8 ignore next (?:(?<count>[0-9]+) )\*\/\s*$/);
        if (testIgnoreNextLines)
        {
            const countStr = testIgnoreNextLines.groups.count;
            const count = countStr ? +countStr : 1;
            ignoreRange(index, index + count);
        }
        else if (/\/\* c8 ignore next \*\//.test(lineStr))
            ignoreRange(index, index);
        else
        {
            const count = MARKER_LINES[lineStr];
            if (count != null)
                ignoreRange(index, index + count);
        }
        lines.push(line);
        position += lineStr.length;
    }
    for (const { from, to } of ignoredRanges)
    {
        for (let index = from; index <= to; ++index)
            lines[index].ignore = true;
    }
};
