'use strict';

const JScrewIt = require('..');

const { Feature, debug: { getEntries } } = JScrewIt;

const rawDefSystems =
{
    'BASE64_ALPHABET_HI_4:0': 'ABCD',
    'BASE64_ALPHABET_HI_4:4': 'QRST',
    'BASE64_ALPHABET_HI_4:5': 'UVWX',
    'BASE64_ALPHABET_LO_4:1': ['0B', '0R', '0h', '0x'],
    'BASE64_ALPHABET_LO_4:3': ['0D', '0T', '0j', '0z'],
    CREATE_PARSE_INT_ARG:
    (encoder, createParseIntArg) =>
    {
        const str = createParseIntArg(3, 2);
        const replacement = encoder.replaceString(str, { optimize: true });
        return replacement;
    },
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
        const expr = mapperFormatter('[undefined]');
        const replacement = encoder.replaceExpr(expr);
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

function getDefSystem(defSystemName)
{
    let defSystem;
    {
        let availableEntries;
        let replaceVariant;
        let formatVariant;
        let variantToMinMaskMap;
        const rawDefSystem = rawDefSystems[defSystemName];
        if (rawDefSystem[Symbol.iterator])
        {
            if (Array.isArray(rawDefSystem))
            {
                availableEntries =
                rawDefSystem.map(entry => typeof entry === 'object' ? entry : define(entry));
                replaceVariant = (encoder, str) => encoder.replaceString(str);
            }
            else
            {
                availableEntries = [...rawDefSystem].map(char => define(char));
                replaceVariant = (encoder, char) => encoder.resolveCharacter(char).replacement;
            }
            formatVariant = variant => `'${variant}'`;
        }
        else
        {
            availableEntries = getEntries(`${defSystemName}:available`);
            replaceVariant = rawDefSystem;
            formatVariant = createFormatVariantByIndex(availableEntries);
            variantToMinMaskMap = new Map();
            availableEntries.forEach
            (({ definition, mask }) => variantToMinMaskMap.set(definition, mask));
        }
        defSystem = { availableEntries, formatVariant, replaceVariant, variantToMinMaskMap };
    }
    defSystem.indent = 8;
    defSystem.organizedEntries = getEntries(defSystemName);
    return defSystem;
}

{
    const defSystems = { __proto__: null };
    for (const defSystemName in rawDefSystems)
    {
        Object.defineProperty
        (
            defSystems,
            defSystemName,
            { enumerable: true, get: getDefSystem.bind(null, defSystemName) },
        );
    }
    module.exports = defSystems;
}
