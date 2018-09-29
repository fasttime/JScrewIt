/* eslint-env node */
/* global repeat */

'use strict';

function createDictTestString(variety, length)
{
    var str = '';
    for (var index = variety; index > 0;)
        str += String.fromCharCode(0xffff - --index);
    str = repeatToFit(str, length);
    return str;
}

function createInvertedDictTestString(variety, length)
{
    var str = '';
    for (var index = 0; index < variety; ++index)
        str += String.fromCharCode(0xffff - index);
    str = repeatToFit(str, length);
    return str;
}

function data(features, createInput, coderName)
{
    var result = { features: features, createInput: createInput, coderName: coderName };
    return result;
}

function getAppendLength(int, appendLengths)
{
    var appendLength = 0;
    var str = int.toString(appendLengths.length);
    Array.prototype.forEach.call
    (
        str,
        function (char)
        {
            appendLength += appendLengths[char];
        }
    );
    return appendLength;
}

function getCharCodeOf(info)
{
    return info.charCode;
}

function repeatToFit(str, length)
{
    var result = repeat(str, Math.ceil(length / str.length)).slice(0, length);
    return result;
}

var createAntiRadix4TestString;

(function ()
{
    function initAntiRadix4CharCodes()
    {
        var RADIX_4_APPEND_LENGTHS = [6, 8, 12, 17];

        var infos = Array(0x10000);
        for (var charCode = 0; charCode < 0x10000; ++charCode)
        {
            var appendLength = getAppendLength(charCode, RADIX_4_APPEND_LENGTHS);
            var info = { appendLength: appendLength, charCode: charCode };
            infos[charCode] = info;
        }
        infos.sort
        (
            function (info1, info2)
            {
                var diff =
                info2.appendLength - info1.appendLength || info1.charCode - info2.charCode;
                return diff;
            }
        );
        antiRadix4CharCodes = infos.map(getCharCodeOf);
    }

    var antiRadix4CharCodes;

    createAntiRadix4TestString =
        function (variety, length)
        {
            if (!antiRadix4CharCodes)
                initAntiRadix4CharCodes();
            var str = String.fromCharCode.apply(null, antiRadix4CharCodes.slice(0, variety));
            str = repeatToFit(str, length);
            return str;
        };
}
)();

module.exports =
[
    data
    (
        ['ARRAY_ITERATOR', 'ATOB', 'CAPITAL_HTML', 'FILL', 'NO_IE_SRC', 'NO_V8_SRC', 'STATUS'],
        repeat.bind(null, String.fromCharCode(59999)),
        'byCharCodes'
    ),
    data
    (
        [
            'ARRAY_ITERATOR',
            'ARROW',
            'ATOB',
            'CAPITAL_HTML',
            'FILL',
            'NO_IE_SRC',
            'NO_V8_SRC',
            'STATUS',
        ],
        function (length)
        {
            var CHAR_CODES =
            [49989, 49988, 59989, 37889, 59988, 37888, 38999, 38998, 29989, 38997, 37989];
            var str = repeatToFit(String.fromCharCode.apply(null, CHAR_CODES), length);
            return str;
        },
        'byCharCodesRadix4'
    ),
    data
    (
        [
            'ARRAY_ITERATOR',
            'ARROW',
            'ATOB',
            'CAPITAL_HTML',
            'FILL',
            'NO_IE_SRC',
            'NO_V8_SRC',
            'STATUS',
        ],
        function (length)
        {
            var prefix = repeatToFit('01234567', 176);
            var str = prefix + createDictTestString(2, length - prefix.length);
            return str;
        },
        'byDenseFigures'
    ),
    data
    (
        ['ARRAY_ITERATOR', 'ATOB', 'FILL', 'NAME', 'NO_IE_SRC', 'NO_V8_SRC', 'UNEVAL'],
        repeat.bind(null, String.fromCharCode(59999)),
        'byDict'
    ),
    data
    (
        [
            'ARRAY_ITERATOR',
            'ARROW',
            'ATOB',
            'CAPITAL_HTML',
            'FILL',
            'NO_FF_SRC',
            'NO_IE_SRC',
            'STATUS',
        ],
        createDictTestString.bind(null, 121),
        'byDictRadix3'
    ),
    data
    (
        [
            'ARROW',
            'CAPITAL_HTML',
            'FILL',
            'FROM_CODE_POINT',
            'NAME',
            'NO_FF_SRC',
            'NO_IE_SRC',
            'SELF_OBJ',
            'STATUS',
        ],
        createDictTestString.bind(null, 82),
        'byDictRadix4'
    ),
    data
    (
        [
            'ARRAY_ITERATOR',
            'ARROW',
            'ATOB',
            'CAPITAL_HTML',
            'FILL',
            'NO_FF_SRC',
            'NO_IE_SRC',
            'STATUS',
        ],
        createDictTestString.bind(null, 129),
        'byDictRadix4AmendedBy1'
    ),
    data
    (
        ['ARRAY_ITERATOR', 'ARROW', 'ATOB', 'CAPITAL_HTML', 'FILL', 'NO_FF_SRC', 'NO_IE_SRC'],
        createInvertedDictTestString.bind(null, 367),
        'byDictRadix4AmendedBy2'
    ),
    data
    (
        [
            'ARRAY_ITERATOR',
            'ARROW',
            'ATOB',
            'CAPITAL_HTML',
            'FILL',
            'NO_FF_SRC',
            'NO_IE_SRC',
            'STATUS',
        ],
        createAntiRadix4TestString.bind(null, 479),
        'byDictRadix5AmendedBy2'
    ),
    data
    (
        [
            'ARRAY_ITERATOR',
            'ARROW',
            'BARPROP',
            'FILL',
            'FROM_CODE_POINT',
            'NAME',
            'NODECONSTRUCTOR',
            'NO_FF_SRC',
            'NO_IE_SRC',
            'STATUS',
        ],
        createAntiRadix4TestString.bind(null, 473),
        'byDictRadix5AmendedBy3'
    ),
    data
    (
        [
            'ARRAY_ITERATOR',
            'ARROW',
            'ATOB',
            'CAPITAL_HTML',
            'FILL',
            'NO_IE_SRC',
            'NO_V8_SRC',
            'STATUS',
        ],
        createDictTestString.bind(null, 57),
        'bySparseFigures'
    ),
];
