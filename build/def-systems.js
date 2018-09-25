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
    {
        availableEntries: getEntries('CREATE_PARSE_INT_ARG:available'),
        formatVariant: ({ name }) => name,
        replaceVariant:
        (encoder, createParseIntArg) =>
        {
            const str = createParseIntArg(3, 2);
            const replacement = encoder.replaceString(str, { optimize: true });
            return replacement;
        },
    },
    FROM_CHAR_CODE:
    {
        availableEntries: getEntries('FROM_CHAR_CODE:available'),
        replaceVariant: (encoder, str) => encoder.replaceString(str, { optimize: true }),
    },
    FROM_CHAR_CODE_CALLBACK_FORMATTER:
    {
        availableEntries: getEntries('FROM_CHAR_CODE_CALLBACK_FORMATTER:available'),
        formatVariant: ({ name }) => name,
        replaceVariant:
        (encoder, fromCharCodeCallbackFormatter) =>
        {
            const str = fromCharCodeCallbackFormatter('0');
            const replacement = encoder.replaceString(str, { optimize: true });
            return replacement;
        },
    },
    MAPPER_FORMATTER:
    {
        availableEntries: getEntries('MAPPER_FORMATTER:available'),
        formatVariant: ({ name }) => name,
        replaceVariant:
        (encoder, mapperFormatter) =>
        {
            const expr = mapperFormatter('[undefined]');
            const replacement = encoder.replaceExpr(expr);
            return replacement;
        },
    },
    OPTIMAL_B: 'Bb',
    OPTIMAL_RETURN_STRING:
    {
        availableEntries:
        [
            define('return(isNaN+false).constructor'),
            define('return String'),
            define('return status.constructor', 'STATUS'),
        ],
        replaceVariant: (encoder, str) => encoder.replaceString(str, { optimize: true }),
    },
};

function define(definition, ...features)
{
    const { mask } = Feature(features);
    const entry = { definition, mask };
    return entry;
}

function getDefSystem(defSystemName)
{
    const rawDefSystem = rawDefSystems[defSystemName];
    let defSystem;
    if (rawDefSystem[Symbol.iterator])
    {
        let availableEntries;
        let replaceVariant;
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
        defSystem = { availableEntries, replaceVariant };
    }
    else
        defSystem = rawDefSystem;
    defSystem.organizedEntries = getEntries(defSystemName);
    if (!defSystem.formatVariant)
        defSystem.formatVariant = variant => `'${variant}'`;
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
            { enumerable: true, get: getDefSystem.bind(null, defSystemName) }
        );
    }
    module.exports = defSystems;
}
