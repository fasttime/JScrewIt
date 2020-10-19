'use strict';

const JScrewIt = require('..');

const { Feature, debug: { getEntries } } = JScrewIt;

const RAW_PREDEFS =
{
    __proto__: null,
    'BASE64_ALPHABET_HI_4:0': 'ABCD',
    'BASE64_ALPHABET_HI_4:4': 'QRST',
    'BASE64_ALPHABET_HI_4:5': 'UVWX',
    'BASE64_ALPHABET_LO_4:1': ['0B', '0R', '0h', '0x'],
    'BASE64_ALPHABET_LO_4:3': ['0D', '0T', '0j', '0z'],
    FROM_CHAR_CODE: (encoder, str) => encoder.replaceString(str, { optimize: true }),
    FROM_CHAR_CODE_CALLBACK_FORMATTER:
    (encoder, fromCharCodeCallbackFormatter) =>
    {
        const str = fromCharCodeCallbackFormatter('0');
        const replacement = encoder.replaceString(str, { optimize: true });
        return replacement;
    },
    MAPPER_FORMATTER:
    (encoder, mapperFormatter) =>
    {
        const expr = mapperFormatter('undefined', '[undefined]');
        const replacement = encoder.replaceExpr(expr);
        return replacement;
    },
    OPTIMAL_ARG_NAME: (encoder, argName) =>
    {
        const str = `function(${argName}){return this[parseInt(${argName},3)]}`;
        const replacement = encoder.replaceString(str, { optimize: true });
        return replacement;
    },
    OPTIMAL_B: (encoder, char) => encoder.resolveCharacter(char).replacement,
    OPTIMAL_RETURN_STRING: (encoder, str) => encoder.replaceString(str, { optimize: true }),
};

function createFormatVariantByIndex(availableEntries)
{
    const map = new Map();
    availableEntries.forEach(({ definition }, index) => map.set(definition, index));
    const formatVariant = Map.prototype.get.bind(map);
    return formatVariant;
}

function define(definition, ...features)
{
    const { mask } = Feature(features);
    const entry = { definition, mask };
    return entry;
}

function getPredef(predefName)
{
    let predef;
    {
        let availableEntries;
        let replaceVariant;
        let formatVariant;
        let variantToMinMaskMap;
        const rawPredef = RAW_PREDEFS[predefName];
        if (rawPredef[Symbol.iterator])
        {
            if (Array.isArray(rawPredef))
            {
                availableEntries =
                rawPredef.map(entry => typeof entry === 'object' ? entry : define(entry));
                replaceVariant = (encoder, str) => encoder.replaceString(str);
            }
            else
            {
                availableEntries = [...rawPredef].map(char => define(char));
                replaceVariant = (encoder, char) => encoder.resolveCharacter(char).replacement;
            }
            formatVariant = variant => `'${variant}'`;
        }
        else
        {
            availableEntries = getEntries(`${predefName}:available`);
            replaceVariant = rawPredef;
            formatVariant = createFormatVariantByIndex(availableEntries);
            variantToMinMaskMap = new Map();
            availableEntries.forEach
            (({ definition, mask }) => variantToMinMaskMap.set(definition, mask));
        }
        predef = { availableEntries, formatVariant, replaceVariant, variantToMinMaskMap };
    }
    predef.indent = 8;
    predef.organizedEntries = getEntries(predefName);
    return predef;
}

{
    const PREDEF_TEST_DATA_MAP_OBJ = module.exports = { __proto__: null };
    for (const predefName in RAW_PREDEFS)
    {
        Object.defineProperty
        (
            PREDEF_TEST_DATA_MAP_OBJ,
            predefName,
            { enumerable: true, get: getPredef.bind(null, predefName) },
        );
    }
}
