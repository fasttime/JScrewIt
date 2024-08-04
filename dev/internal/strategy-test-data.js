'use strict';

let proRadix4AntiRadix10Elements;
let supplProRadix4AntiRadix10Elements;

const rivalStrategyNames = ['plain'];

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
    proRadix4AntiRadix10Elements ??= getProRadix4AntiRadix10Elements(0xffff);
    const str = String.fromCharCode(...proRadix4AntiRadix10Elements.slice(0, length));
    return str;
}

function createTestStringSupplProRadix4AntiRadix10(length)
{
    supplProRadix4AntiRadix10Elements ??= getProRadix4AntiRadix10Elements(0x10ffff);
    const str = String.fromCodePoint(...supplProRadix4AntiRadix10Elements.slice(0, length));
    return str;
}

function data(features, createInput, strategyName)
{
    rivalStrategyNames.push(strategyName);
    const data =
    {
        strategyName,
        createInput,
        features,
        get rivalStrategyNames()
        {
            const strategyNames =
            rivalStrategyNames.filter(thisStrategyName => thisStrategyName !== strategyName);
            return strategyNames;
        },
    };
    return data;
}

function getProRadix4AntiRadix10Elements(to)
{
    const proRadix4AntiRadix10Elements = [];
    {
        const { createEncoder } = require('../..').debug;
        const encoder = createEncoder();
        for (let charCode = 0; charCode <= to; ++charCode)
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
    return proRadix4AntiRadix10Elements;
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
        ['ARRAY_ITERATOR', 'ATOB', 'CAPITAL_HTML', 'FILL', 'NO_V8_SRC', 'STATUS'],
        length => String.fromCharCode(59999).repeat(length),
        'byCharCodes',
    ),
    data
    (
        [
            'ARRAY_ITERATOR',
            'ARROW',
            'AT',
            'ATOB',
            'CAPITAL_HTML',
            'CONSOLE',
            'FLAT',
            'NODECONSTRUCTOR',
            'STATUS',
            'V8_SRC',
        ],
        length =>
        {
            let str = createTestStringProRadix4AntiRadix10(6);
            str = repeatToFit(str, length);
            return str;
        },
        'byCharCodesRadix4',
    ),
    data
    (
        ['CAPITAL_HTML', 'FROM_CODE_POINT', 'NO_V8_SRC', 'STATUS'],
        length => repeatToFit(String.fromCharCode(55999, 56999), length),
        'byCodePoints',
    ),
    data
    (
        [
            'ARRAY_ITERATOR',
            'ARROW',
            'AT',
            'CAPITAL_HTML',
            'CONSOLE',
            'FLAT',
            'FROM_CODE_POINT',
            'ITERATOR_HELPER',
            'NODECONSTRUCTOR',
            'NO_IE_SRC',
            'STATUS',
        ],
        length =>
        {
            let str = createTestStringSupplProRadix4AntiRadix10(16);
            str = repeatToFit(str, length);
            return str;
        },
        'byCodePointsRadix4',
    ),
    data
    (
        ['ARRAY_ITERATOR', 'ARROW', 'AT', 'ATOB', 'CAPITAL_HTML', 'V8_SRC'],
        length =>
        {
            const postfix = repeatToFit('012345678', 422);
            const str = createDictTestString(2, length - postfix.length) + postfix;
            return str;
        },
        'byDenseFigures',
    ),
    data
    (
        ['ARRAY_ITERATOR', 'NAME', 'NO_V8_SRC'],
        length => String.fromCharCode(59999).repeat(length),
        'byDict',
    ),
    data
    (
        [
            'ARRAY_ITERATOR',
            'ARROW',
            'AT',
            'CONSOLE',
            'FF_SRC',
            'FLAT',
            'FROM_CODE_POINT',
            'ITERATOR_HELPER',
            'NODECONSTRUCTOR',
        ],
        createDictTestString.bind(null, 76),
        'byDictRadix3AmendedBy1',
    ),
    data
    (
        [
            'ARRAY_ITERATOR',
            'ARROW',
            'AT',
            'CONSOLE',
            'FLAT',
            'IE_SRC',
            'NODECONSTRUCTOR',
            'SELF_OBJ',
        ],
        createDictTestString.bind(null, 78),
        'byDictRadix4',
    ),
    data
    (
        ['ARRAY_ITERATOR', 'ARROW', 'AT', 'ATOB', 'CAPITAL_HTML', 'CONSOLE', 'FF_SRC', 'FLAT'],
        createDictTestString.bind(null, 120),
        'byDictRadix4AmendedBy1',
    ),
    data
    (
        [
            'ARRAY_ITERATOR',
            'ARROW',
            'AT',
            'FF_SRC',
            'FLAT',
            'FROM_CODE_POINT',
            'ITERATOR_HELPER',
            'NAME',
            'NODECONSTRUCTOR',
        ],
        createDictTestString.bind(null, 156),
        'byDictRadix4AmendedBy2',
    ),
    data
    (
        ['ARROW', 'CONSOLE', 'FLAT', 'NODECONSTRUCTOR', 'V8_SRC'],
        createDictTestString.bind(null, 63),
        'byDictRadix5',
    ),
    data
    (
        [
            'ARRAY_ITERATOR',
            'ARROW',
            'ASYNC_FUNCTION',
            'AT',
            'ATOB',
            'CONSOLE',
            'FF_SRC',
            'FLAT',
            'FROM_CODE_POINT',
            'ITERATOR_HELPER',
            'NODECONSTRUCTOR',
            'STATUS',
        ],
        createDictTestString.bind(null, 374),
        'byDictRadix5AmendedBy3',
    ),
    data
    (
        ['ARRAY_ITERATOR', 'ARROW', 'AT', 'CAPITAL_HTML', 'NAME', 'NO_IE_SRC'],
        createDictTestString.bind(null, 42),
        'bySparseFigures',
    ),
];
