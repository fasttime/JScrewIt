#!/usr/bin/env node

import JScrewIt         from '../lib/jscrewit.js';
import timeUtils        from '../tools/time-utils.js';
import progress         from './internal/progress.js';
import solutionBookMap  from './internal/solution-book-map.js';
import { promises }     from 'fs';
import { cpus }         from 'os';
import { Worker }       from 'worker_threads';

async function doAdd()
{
    function * generateQueue(indicator, solutionBookMap)
    {
        const queue = new Set();
        for (const char of charSet)
        {
            const promise =
            (
                async noSave =>
                {
                    const formattedCharacter = formatCharacter(char);
                    const bar = indicator.newBar(`Indexing ${formattedCharacter.padEnd(6)}`);
                    const serializedSolutionBook = await runWorker(solutionBookMap, bar, char);
                    bar.hide();
                    const solutionBook = solutionBookMap.deserialize(serializedSolutionBook);
                    solutionBookMap.set(char, solutionBook);
                    console.log('Character %s indexed', formattedCharacter);
                    if (!noSave)
                        solutionBookMap.save();
                    queue.delete(promise);
                }
            )
            (noSave);
            queue.add(promise);
            if (queue.size >= concurrency)
                yield queue;
        }
        while (queue.size)
            yield queue;
    }

    async function indexCharacters()
    {
        const solutionBookMap = getSolutionBookMap(!noLoad);
        await progress
        (
            async indicator =>
            {
                const generator = generateQueue(indicator, solutionBookMap);
                for (const queue of generator)
                    await Promise.race(queue);
            },
        );
    }

    function runWorker(solutionBookMap, bar, char)
    {
        const executor =
        (resolve, reject) =>
        {
            const workerURL = new URL('internal/char-index-worker.js', import.meta.url);
            const serializedSolutionBookMap = solutionBookMap.serialize(solutionBookMap);
            const worker =
            new Worker(workerURL, { workerData: { char, serializedSolutionBookMap } });
            worker.on
            (
                'message',
                ({ progress, missingChar, serializedSolutionBook }) =>
                {
                    if (progress != null)
                        bar.update(progress);
                    if (missingChar != null)
                    {
                        console.warn
                        (
                            'Character %s required by %s is not indexed',
                            formatCharacter(missingChar),
                            formatCharacter(char),
                        );
                    }
                    if (serializedSolutionBook != null)
                        resolve(serializedSolutionBook);
                },
            );
            worker.on('error', reject);
            worker.on
            (
                'exit',
                code => reject(new Error(`Worker stopped unexpectedly with exit code ${code}`)),
            );
        };
        const promise = new Promise(executor);
        return promise;
    }

    let noLoad = false;
    let noSave = false;
    let concurrency;
    const charSet =
    parseArguments
    (
        sequence =>
        {
            const match = /concurrency(?:=(?<concurrency>.*))?/.exec(sequence);
            if (match)
            {
                concurrency = Number(match.groups.concurrency);
                if (concurrency !== Math.floor(concurrency) || concurrency < 1 || concurrency > 10)
                    fail('Concurrency must specify an integer between 1 and 10', sequence);
            }
            else
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
            }
            return true;
        },
    );
    if (!concurrency)
    {
        const cpuCount = cpus().length;
        if (cpuCount < 3)
            concurrency = cpuCount;
        else
            concurrency = Math.min(Math.ceil(cpuCount / 2), 10);
    }
    {
        const duration = await timeUtils.timeThisAsync(indexCharacters);
        const durationStr = timeUtils.formatDuration(duration);
        console.log('%s elapsed.', durationStr);
    }
}

async function doLevel()
{
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
        const { writeFile } = promises;
        const outputURL = new URL('../.char-index-level', import.meta.url);
        await writeFile(outputURL, output);
    }
}

function doSort()
{
    function parseCounter()
    {
        let counter;
        const [,,, arg] = argv;
        if (arg == null)
            fail('Missing required argument');
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
            fail('Unexpected argument "%s"', arg);
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

function fail(message, ...optionalParams)
{
    console.error(message, ...optionalParams);
    throw ARG_ERROR;
}

function formatCharacter(char)
{
    if (' #&\'(),;<=>?[]{|}~'.includes(char))
        return `"${char}"`;
    if (char === '\\' || char === '`')
        return `"\\${char}"`;
    const charCode = char.charCodeAt();
    if
    (
        charCode >= 0x20 && charCode <= 0x7e && charCode !== 0x22 ||
        charCode >= 0xa0 && !/(?=\p{L})(?=\p{sc=Arab})/u.test(char)
    )
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
    if (load)
        solutionBookMap.load();
    return solutionBookMap;
}

function getWantedCharacters()
{
    const { getCharacters } = JScrewIt.debug;
    const solutionBookMap = getSolutionBookMap();
    const wantedChars = getCharacters().filter(char => !solutionBookMap.has(char));
    return wantedChars;
}

function isCharacterDefined(char)
{
    const { getCharacterEntries } = JScrewIt.debug;
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
            /^\s*(?:--(?<sequence>.*)|:(?<logicalSet>.*):|U\+(?<hexCode>[\dA-F]{4}))\s*$/i
            .exec(arg);
            if (matches)
            {
                const { sequence, logicalSet, hexCode } = matches.groups;
                if (sequence != null)
                {
                    if (!parseSequence(sequence))
                        fail('Unknown sequence "%s"', sequence);
                }
                else if (logicalSet != null)
                {
                    const charsProvider = LOGICAL_SETS[logicalSet];
                    if (!charsProvider)
                        fail('Unknown logical set "%s"', logicalSet);
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
    if (!charSet.size)
        fail('No characters specified');
    {
        const unindexableChars = [...charSet].filter(char => !isCharacterDefined(char));
        if (unindexableChars.length)
        {
            const formattedCharacters = formatCharacters(unindexableChars);
            fail('Unindexable characters specified: %s', formattedCharacters);
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
    '• :static:  Characters in the static set\n' +
    '• :wanted:  Characters defined by JScrewIt but not indexed yet';
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
    (async () =>
    {
        try
        {
            if (!commandCall)
            {
                fail
                ('char-index: \'%s\' is not a valid command. See \'char-index help\'.', command);
            }
            await commandCall();
        }
        catch (error)
        {
            if (error !== ARG_ERROR)
                throw error;
            process.exitCode = 1;
        }
    }
    )();
}
