/* eslint-env node */

'use strict';

function createDictTestString(variety, length)
{
    let str = '';
    for (let index = variety; index > 0;)
        str += String.fromCharCode(0xffff - --index);
    str = repeatToFit(str, length);
    return str;
}

function createInvertedDictTestString(variety, length)
{
    let str = '';
    for (let index = 0; index < variety; ++index)
        str += String.fromCharCode(0xffff - index);
    str = repeatToFit(str, length);
    return str;
}

function data(features, createInput, coderName)
{
    const result = { coderName, createInput, features };
    return result;
}

function getAppendLength(int, appendLengths)
{
    let appendLength = 0;
    const str = int.toString(appendLengths.length);
    [...str].forEach(char => appendLength += appendLengths[char]);
    return appendLength;
}

function getCharCodeOf({ charCode })
{
    return charCode;
}

function repeatToFit(str, length)
{
    const result = str.repeat(Math.ceil(length / str.length)).slice(0, length);
    return result;
}

let createAntiRadix4TestString;

{
    function initAntiRadix4CharCodes()
    {
        const RADIX_4_APPEND_LENGTHS = [6, 8, 12, 17];

        const infos = Array(0x10000);
        for (let charCode = 0; charCode < 0x10000; ++charCode)
        {
            const appendLength = getAppendLength(charCode, RADIX_4_APPEND_LENGTHS);
            const info = { appendLength, charCode };
            infos[charCode] = info;
        }
        infos.sort
        (
            (info1, info2) =>
            {
                const diff =
                info2.appendLength - info1.appendLength || info1.charCode - info2.charCode;
                return diff;
            }
        );
        antiRadix4CharCodes = infos.map(getCharCodeOf);
    }

    let antiRadix4CharCodes;

    createAntiRadix4TestString =
    (variety, length) =>
    {
        if (!antiRadix4CharCodes)
            initAntiRadix4CharCodes();
        let str = String.fromCharCode(...antiRadix4CharCodes.slice(0, variety));
        str = repeatToFit(str, length);
        return str;
    };
}

module.exports =
[
    data
    (
        ['ARRAY_ITERATOR', 'ATOB', 'CAPITAL_HTML', 'FILL', 'NO_IE_SRC', 'NO_V8_SRC', 'STATUS'],
        length => String.fromCharCode(59999).repeat(length),
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
        length =>
        {
            const CHAR_CODES =
            [49989, 49988, 59989, 37889, 59988, 37888, 38999, 38998, 29989, 38997, 37989];
            const str = repeatToFit(String.fromCharCode(...CHAR_CODES), length);
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
        length =>
        {
            const prefix = repeatToFit('01234567', 176);
            const str = prefix + createDictTestString(2, length - prefix.length);
            return str;
        },
        'byDenseFigures'
    ),
    data
    (
        ['ARRAY_ITERATOR', 'ATOB', 'FILL', 'NAME', 'NO_IE_SRC', 'NO_V8_SRC', 'UNEVAL'],
        length => String.fromCharCode(59999).repeat(length),
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
