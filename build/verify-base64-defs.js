/* jshint node: true */

'use strict';

var defVerifier = require('./def-verifier.js');
var define = defVerifier.define;
var verifyDefinitions = defVerifier.verifyDefinitions;

var entries =
[
    define('A'),
    define('C', 'CAPITAL_HTML'),
    define('B', 'CAPITAL_HTML', 'ENTRIES_OBJ'),
    define('A', 'ARRAY_ITERATOR')
];

var inputList = ['A', 'B', 'C', 'D'];

/*
var entries =
[
    define('S'),
    define('R', 'CAPITAL_HTML'),
    define('S', 'CAPITAL_HTML', 'ENTRIES_OBJ')
];

var inputList = ['Q', 'R', 'S', 'T'];
*/

/*
var entries =
[
    define('U'),
    define('V', 'ATOB'),
    define('W', 'ANY_WINDOW'),
    define('V', 'ATOB', 'ENTRIES_OBJ'),
    define('W', 'ATOB', 'DOMWINDOW', 'ENTRIES_OBJ'),
    define('W', 'ATOB', 'ENTRIES_OBJ', 'WINDOW'),
    define('U', 'CAPITAL_HTML')
];

var inputList = ['U', 'V', 'W', 'X'];
*/

/*
var entries =
[
    define('0B'),
    define('0R', 'CAPITAL_HTML'),
    define('0B', 'ENTRIES_OBJ')
];

var inputList = ['0B', '0R', '0h', '0x'];
*/

/*
var entries =
[
    define('0j'),
    define('0T', 'CAPITAL_HTML'),
    define('0j', 'ENTRIES_OBJ')
];

var inputList = ['0D', '0T', '0j', '0z'];
*/

var mismatchCallback =
    function ()
    {
        console.log.apply(console, arguments);
    };

var replacerName = 'replaceString';

verifyDefinitions(entries, inputList, mismatchCallback, replacerName);
