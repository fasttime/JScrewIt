#!/usr/bin/env node

'use strict';

function doAdd()
{
    function indexCharacters(solutionBookMap)
    {
        const progress = require('./progress');

        for (const char of charSet)
        {
            const formattedCharacter = formatCharacter(char);
            solutionBookMap.delete(char);
            progress
            (
                `Indexing character ${formattedCharacter}`,
                bar =>
                solutionBookMap.index
                (
                    char,
                    progress => bar.update(progress),
                    char =>
                    console.warn('Required character %s not indexed', formatCharacter(char)),
                ),
            );
            console.log('Character %s indexed', formattedCharacter);
            if (!noSave)
                solutionBookMap.save();
        }
    }

    function run()
    {
        const solutionBookMap = getSolutionBookMap(!noLoad);
        indexCharacters(solutionBookMap);
    }

    let noLoad = false;
    let noSave = false;
    const charSet =
    parseArguments
    (
        sequence =>
        {
            switch (sequence)
            {
            case 'new':
                noLoad = true;
                break;
            case 'test':
                noSave = true;
                break;
            default:
                return false;
            }
            return true;
        },
    );
    {
        const timeUtils = require('../tools/time-utils');

        const duration = timeUtils.timeThis(run);
        const durationStr = timeUtils.formatDuration(duration);
        console.log('%s elapsed.', durationStr);
    }
}

function doLevel()
{
    const fs = require('fs');
    const path = require('path');

    let output = '';
    for (const solutionBookMap = getSolutionBookMap(); solutionBookMap.size;)
    {
        const independentChars = [];
        for (const [char, solutionBook] of solutionBookMap.entries())
        {
            const { usedChars } = solutionBook;
            if (usedChars.every(usedChar => usedChar === char || !solutionBookMap.has(usedChar)))
                independentChars.push(char);
        }
        independentChars.forEach(char => solutionBookMap.delete(char));
        output += `${formatCharacters(independentChars)}\n`;
    }
    process.stdout.write(output);
    {
        const outputFileName = path.join(__dirname, '..', '.char-index-level');
        fs.writeFileSync(outputFileName, output);
    }
}

function doSort()
{
    function parseCounter()
    {
        let counter;
        const [,,, arg] = argv;
        switch (arg)
        {
        case 'jscrewit-timestamp':
            counter = ({ jscrewitTimestamp }) => jscrewitTimestamp;
            break;
        case 'max-length':
            counter = ({ solutions }) => Math.max(...solutions.map(({ length }) => length));
            break;
        case 'min-length':
            counter = ({ solutions }) => Math.min(...solutions.map(({ length }) => length));
            break;
        case 'solutions':
            counter = ({ solutions: { length } }) => length;
            break;
        default:
            console.error('Unexpected argument "%s"', arg);
            throw ARG_ERROR;
        }
        return counter;
    }

    const entries = [];
    {
        const counter = parseCounter();
        const solutionBookMap = getSolutionBookMap();
        for (const [char, solutionBook] of solutionBookMap.entries())
        {
            const count = counter(solutionBook);
            const entry = { char, count };
            entries.push(entry);
        }
    }
    entries.sort(({ count: count1 }, { count: count2 }) => count1 - count2);
    const maxCountLength = String(entries[entries.length - 1].count).length;
    for (const { char, count } of entries)
    {
        const formattedChar = formatCharacter(char).padEnd(6);
        const formattedCount = String(count).padStart(maxCountLength);
        console.log('%s %s', formattedChar, formattedCount);
    }
}

function doUses()
{
    const charSet = parseArguments(() => false);
    const solutionBookMap = getSolutionBookMap();
    const dependentChars = [];
    for (const [char, solutionBook] of solutionBookMap)
    {
        if (solutionBook.usedChars.some(char => charSet.has(char)))
            dependentChars.push(char);
    }
    console.log(formatCharacters(dependentChars));
}

function doWanted()
{
    const wantedChars = getWantedCharacters();
    console.log(formatCharacters(wantedChars));
}

function formatCharacter(char)
{
    if (' #&\'();<=>?[]{|}~'.includes(char))
        return `"${char}"`;
    if (char === '"' || char === '\\' || char === '`')
        return `"\\${char}"`;
    const charCode = char.charCodeAt();
    if (charCode >= 0x20 && charCode <= 0x7e || charCode >= 0xa0)
        return char;
    return `U+${charCode.toString(16).toUpperCase().padStart(4, '0')}`;
}

function formatCharacters(chars)
{
    let str = '';
    let prevCharLong;
    for (const char of chars)
    {
        const formattedChar = formatCharacter(char);
        const charLong = formattedChar.length > 1;
        if (str && (prevCharLong || charLong))
            str += ' ';
        str += formattedChar;
        prevCharLong = charLong;
    }
    return str;
}

function getSolutionBookMap(load = true)
{
    const solutionBookMap = require('./solution-book-map');

    if (load)
        solutionBookMap.load();
    return solutionBookMap;
}

function getWantedCharacters()
{
    const solutionBookMap = getSolutionBookMap();
    const wantedChars = [];
    for (let charCode = 0; charCode <= 0xffff; ++charCode)
    {
        const char = String.fromCharCode(charCode);
        if (isCharacterDefined(char) && !solutionBookMap.has(char))
            wantedChars.push(char);
    }
    return wantedChars;
}

function isCharacterDefined(char)
{
    const { getCharacterEntries } = require('..').debug;

    const charDefined = !!getCharacterEntries(char);
    return charDefined;
}

function parseArguments(parseSequence)
{
    const charSet = new Set();
    {
        const LOGICAL_SETS =
        {
            __proto__:  null,
            static:     () => '+-.0123456789INadefilnrstuy',
            wanted:     getWantedCharacters,
        };
        for (let index = 3; index < argCount; ++index)
        {
            const arg = argv[index];
            const matches =
            /^\s*(?:--(?<sequence>.*)|{(?<logicalSet>.*)}|U\+(?<hexCode>[\dA-F]{4}))\s*$/i
            .exec(arg);
            if (matches)
            {
                const { sequence, logicalSet, hexCode } = matches.groups;
                if (sequence != null)
                {
                    if (!parseSequence(sequence))
                    {
                        console.error('Unknown sequence "%s"', sequence);
                        throw ARG_ERROR;
                    }
                }
                else if (logicalSet != null)
                {
                    const charsProvider = LOGICAL_SETS[logicalSet];
                    if (!charsProvider)
                    {
                        console.error('Unknown logical set "%s"', logicalSet);
                        throw ARG_ERROR;
                    }
                    {
                        const chars = charsProvider();
                        for (const char of chars)
                            charSet.add(char);
                    }
                }
                else
                {
                    const charCode = parseInt(hexCode, 16);
                    const char = String.fromCharCode(charCode);
                    charSet.add(char);
                }
            }
            else
            {
                for (const char of arg)
                    charSet.add(char);
            }
        }
    }
    {
        const unindexableChars = [...charSet].filter(char => !isCharacterDefined(char));
        if (unindexableChars.length)
        {
            console.error
            ('Unindexable characters specified: %s', formatCharacters(unindexableChars));
            throw ARG_ERROR;
        }
    }
    return charSet;
}

function printHelp()
{
    const help =
    'char-index add [--new] [--test] <chars>\n' +
    'char-index level\n' +
    'char-index sort [jscrewit-timestamp|max-length|min-length|solutions]\n' +
    'char-index uses <chars>\n' +
    'char-index wanted\n' +
    'char-index help\n' +
    '\n' +
    'Characters can be specified in different ways:\n' +
    '• ABC       Characters "A", "B" and "C"\n' +
    '• U+0123    Character with hexadecimal code 123\n' +
    '• {static}  Characters in the static set\n' +
    '• {wanted}  Characters defined by JScrewIt but not indexed yet';
    console.log(help);
}

const ARG_ERROR = { };

const { argv } = process;
const argCount = argv.length;
if (argCount < 3)
    printHelp();
else
{
    const COMMANDS =
    {
        __proto__:  null,
        add:        doAdd,
        help:       printHelp,
        level:      doLevel,
        sort:       doSort,
        uses:       doUses,
        wanted:     doWanted,
    };

    const [,, command] = argv;
    const commandCall = COMMANDS[command];
    try
    {
        if (!commandCall)
        {
            console.error
            ('char-index: \'%s\' is not a valid command. See \'char-index help\'.', command);
            throw ARG_ERROR;
        }
        commandCall();
    }
    catch (error)
    {
        if (error !== ARG_ERROR)
            throw error;
        process.exitCode = 1;
    }
}
