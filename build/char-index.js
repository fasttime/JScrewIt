#!/usr/bin/env node

'use strict';

function doAdd()
{
    function indexCharacters(solutionBookMap)
    {
        const progress = require('./progress');

        progress
        (
            'Scanning character definitions',
            bar =>
            solutionBookMap.index
            (
                charSet,
                char => console.log('Indexing character %s', formatCharacter(char)),
                progress => bar.update(progress),
                char => console.warn('Required character %s not indexed', formatCharacter(char))
            )
        );
    }

    function run()
    {
        const solutionBookMap = getSolutionBookMap(!noLoad);
        for (const char of charSet)
            solutionBookMap.delete(char);
        indexCharacters(solutionBookMap);
        if (!noSave)
            solutionBookMap.save();
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
        }
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
    const solutionBookMap = getSolutionBookMap();
    while (solutionBookMap.size)
    {
        const independentChars = [];
        for (const [char, solutionBook] of solutionBookMap.entries())
        {
            const { usedChars } = solutionBook;
            if (usedChars.every(usedChar => usedChar === char || !solutionBookMap.has(usedChar)))
                independentChars.push(char);
        }
        independentChars.forEach(char => solutionBookMap.delete(char));
        console.log(formatCharacters(independentChars));
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
    const solutionBookMap = getSolutionBookMap();
    const wantedChars = [];
    for (let charCode = 0; charCode <= 0xffff; ++charCode)
    {
        const char = String.fromCharCode(charCode);
        if (isCharacterDefined(char) && !solutionBookMap.has(char))
            wantedChars.push(char);
    }
    console.log(formatCharacters(wantedChars));
}

function formatCharacter(char)
{
    if (' #&\'();<>|~'.includes(char))
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

function isCharacterDefined(char)
{
    const { getCharacterEntries } = require('..').debug;

    const charDefined = Boolean(getCharacterEntries(char));
    return charDefined;
}

function parseArguments(parseSequence)
{
    const charSet = new Set();
    {
        const levels =
        {
            __proto__:  null,
            static:     '+-.0123456789INadefilnrstuy',
            level1:     ' ()[]cov{}',
            level2:     '\n",=AFbgjm',
            level3:     '/<>BOS',
            level4:     'Rhpwxz',
            level5:     '%CD',
            level6:     'P',
            level7:     '\r\x1eGLMUZ^kq\x8a\x8d\x96\x9e£¥§©±¶º»ÇÚÝâéîöø',
            level8:     '\fEHJKQTWXY∞',
            level9:     '\t&:;?V\\',
        };
        Object.values(levels).reduce
        (
            (accumulator, str, index) =>
            {
                accumulator += str;
                levels[`deep${index}`] = accumulator;
                return accumulator;
            }
        );
        for (let index = 3; index < argCount; ++index)
        {
            const arg = argv[index];
            const matches = /^\s*(?:--(.*)|{(.*)}|U\+([\dA-F]{4}))\s*$/i.exec(arg);
            if (matches)
            {
                const [, sequence, level, hexCode] = matches;
                if (sequence != null)
                {
                    if (!parseSequence(sequence))
                    {
                        console.error('Unknown sequence "%s"', sequence);
                        throw ARG_ERROR;
                    }
                }
                else if (level != null)
                {
                    const chars = levels[level];
                    if (!chars)
                    {
                        console.log('Unknown level "%s"', level);
                        throw ARG_ERROR;
                    }
                    for (const char of chars)
                        charSet.add(char);
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
    'char-index uses <chars>\n' +
    'char-index wanted\n' +
    'char-index help\n' +
    '\n' +
    'Characters can be specified in different ways:\n' +
    '• ABC       Characters "A", "B" and "C"\n' +
    '• U+0123    Character with hexadecimal code 123\n' +
    '• {level7}  Characters in the level7 character set';
    console.log(help);
}

const ARG_ERROR = { };

const { argv } = process;
const argCount = argv.length;
if (argCount < 3)
    printHelp();
const [,, command] = argv;
try
{
    switch (command)
    {
    case 'add':
        doAdd();
        break;
    case 'help':
        printHelp();
        break;
    case 'level':
        doLevel();
        break;
    case 'uses':
        doUses();
        break;
    case 'wanted':
        doWanted();
        break;
    default:
        console.error
        ('char-index: \'%s\' is not a valid command. See \'char-index help\'.', command);
        throw ARG_ERROR;
    }
}
catch (error)
{
    if (error !== ARG_ERROR)
        throw error;
    process.exitCode = 1;
}
