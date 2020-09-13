'use strict';

let proRadix4AntiRadix10Elements;

function createDictTestString(variety, length)
{
    let str = '';
    for (let index = variety; index > 0;)
        str += String.fromCharCode(0xffff - --index);
    str = repeatToFit(str, length);
    return str;
}

function createTestStringProRadix4AntiRadix10(length)
{
    if (!proRadix4AntiRadix10Elements)
    {
        proRadix4AntiRadix10Elements = [];
        {
            const { createEncoder } = require('..').debug;
            const encoder = createEncoder();
            for (let charCode = 0; charCode <= 0xffff; ++charCode)
            {
                const base4Str = charCode.toString(4);
                const base10Str = charCode.toString();
                const base4Length = encoder.replaceString(base4Str).length;
                const base10Length = encoder.replaceString(base10Str).length;
                const element = Object(charCode);
                element.score = base10Length - base4Length;
                proRadix4AntiRadix10Elements.push(element);
            }
        }
        proRadix4AntiRadix10Elements.sort
        (({ score: score1 }, { score: score2 }) => score2 - score1);
    }
    const str = String.fromCharCode(...proRadix4AntiRadix10Elements.slice(0, length));
    return str;
}

function data(features, createInput, strategyName)
{
    const result = { strategyName, createInput, features };
    return result;
}

function repeatToFit(str, length)
{
    const result = str.repeat(Math.ceil(length / str.length)).slice(0, length);
    return result;
}

module.exports =
[
    data
    (
        ['CAPITAL_HTML', 'NO_V8_SRC', 'STATUS'],
        length => String.fromCharCode(59999).repeat(length),
        'byCharCodes',
    ),
    data
    (
        ['ARRAY_ITERATOR', 'ARROW', 'CAPITAL_HTML', 'FLAT', 'NO_IE_SRC', 'STATUS'],
        length =>
        {
            let str = createTestStringProRadix4AntiRadix10(8);
            str = repeatToFit(str, length);
            return str;
        },
        'byCharCodesRadix4',
    ),
    data
    (
        ['ARRAY_ITERATOR', 'ARROW', 'ATOB', 'CAPITAL_HTML', 'FLAT', 'NO_IE_SRC'],
        length =>
        {
            const prefix = repeatToFit('012345678', 463);
            const str = prefix + createDictTestString(2, length - prefix.length);
            return str;
        },
        'byDenseFigures',
    ),
    data
    (
        ['ARRAY_ITERATOR', 'NO_V8_SRC'],
        length => String.fromCharCode(59999).repeat(length),
        'byDict',
    ),
    data
    (
        ['ARRAY_ITERATOR', 'ARROW', 'CAPITAL_HTML', 'FLAT', 'V8_SRC'],
        createDictTestString.bind(null, 88),
        'byDictRadix3AmendedBy1',
    ),
    data
    (
        ['ARROW', 'FLAT', 'NAME', 'SELF_OBJ', 'V8_SRC'],
        createDictTestString.bind(null, 78),
        'byDictRadix4',
    ),
    data
    (
        ['ARRAY_ITERATOR', 'ARROW', 'CAPITAL_HTML', 'FLAT', 'V8_SRC'],
        createDictTestString.bind(null, 120),
        'byDictRadix4AmendedBy1',
    ),
    data
    (
        ['ARRAY_ITERATOR', 'ARROW', 'CAPITAL_HTML', 'FLAT', 'V8_SRC'],
        createDictTestString.bind(null, 156),
        'byDictRadix4AmendedBy2',
    ),
    data
    (
        ['ARROW', 'FLAT', 'V8_SRC'],
        createDictTestString.bind(null, 63),
        'byDictRadix5',
    ),
    data
    (
        ['ARRAY_ITERATOR', 'ARROW', 'CAPITAL_HTML', 'FLAT', 'STATUS', 'V8_SRC'],
        createDictTestString.bind(null, 388),
        'byDictRadix5AmendedBy3',
    ),
    data
    (
        ['ARRAY_ITERATOR', 'ARROW', 'CAPITAL_HTML', 'FLAT', 'NO_IE_SRC'],
        createDictTestString.bind(null, 42),
        'bySparseFigures',
    ),
];
