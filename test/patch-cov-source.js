/* eslint-env node */

'use strict';

const { createRequire } = require('node:module');

const SUPPRESSED_ERROR_LINE =
'    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, ' +
'message) {\n';

const MARKER_LINES =
{
    __proto__:                                      null,
    '    var extendStatics = function(d, b) {\n':   5,
    '    function __extends(d, b) {\n':             6,
    '    var __assign = function() {\n':            9,
    [SUPPRESSED_ERROR_LINE]:                        3,
};

const c8jsRequire = createRequire(require.resolve('c8js'));
const c8Require = createRequire(c8jsRequire.resolve('c8'));
const { prototype: covSourcePrototype } = c8Require('v8-to-istanbul/lib/source');
const { _parseIgnore } = covSourcePrototype;
covSourcePrototype._parseIgnore =
function (lineStr)
{
    let ignoreToken = _parseIgnore.call(this, lineStr);
    if (ignoreToken)
        return ignoreToken;
    const count = MARKER_LINES[lineStr];
    if (count != null)
    {
        ignoreToken = { count };
        return ignoreToken;
    }
    {
        const match = /^\s*\/\/ ([-\d\w~]+) – https:\/\/github\.com\/fasttime\/.*/.exec(lineStr);
        if (match?.[1] === '~feature-hub')
        {
            ignoreToken = { start: true, stop: false };
            return ignoreToken;
        }
    }
    {
        const match = /^\s*\/\/ End of module ([-\d\w~]+)\s*$/.exec(lineStr);
        if (match?.[1] === '~feature-hub')
        {
            ignoreToken = { start: false, stop: true };
            return ignoreToken;
        }
    }
};
