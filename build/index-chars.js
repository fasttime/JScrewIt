#!/usr/bin/env node

'use strict';

function doAdd()
{
    function indexChars(solutionBookMap)
    {
        const progress = require('./progress');

        progress
        (
            'Scanning character definitions',
            bar =>
            solutionBookMap.index
            (
                chars,
                char => console.log('Indexing character %s', JSON.stringify(char)),
                progress => bar.update(progress),
                char => console.warn('Required character %s not indexed', JSON.stringify(char))
            )
        );
    }

    function run()
    {
        const solutionBookMap = require('./solution-book-map');

        if (!noLoad)
        {
            solutionBookMap.load();
            for (const char of chars)
                solutionBookMap.delete(char);
        }
        indexChars(solutionBookMap);
        if (!noSave)
            solutionBookMap.save();
    }

    let noLoad = false;
    let noSave = false;
    const chars = new Set();
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
            level7:     '\r\x1e\\GLMUZ^kq\x8a\x8d\x96\x9e£¥§©±¶º»ÇÚÝâéîöø',
            level8:     '\fEHJKQTWXY∞',
            level9:     '\t&:;?V',
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
            const matches = /^\s*(?:--(.+)|U\+([\dA-F]{4}))\s*$/i.exec(arg);
            if (matches)
            {
                const [, sequence, hexCode] = matches;
                if (sequence)
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
                        {
                            const level = levels[sequence];
                            if (!level)
                            {
                                console.error('Unknown sequence "%s"', sequence);
                                process.exitCode = 1;
                                return;
                            }
                            for (const char of level)
                                chars.add(char);
                        }
                        break;
                    }
                }
                else
                {
                    const charCode = parseInt(hexCode, 16);
                    const char = String.fromCharCode(charCode);
                    chars.add(char);
                }
            }
            else
            {
                for (const char of arg)
                    chars.add(char);
            }
        }
    }
    {
        const { getCharacterEntries } = require('..').debug;

        const unindexableChars = [...chars].filter(char => !getCharacterEntries(char));
        if (unindexableChars.length)
        {
            console.error
            (
                'Unindexable characters specified: %s',
                unindexableChars.map(JSON.stringify).join(', ')
            );
            process.exitCode = 1;
            return;
        }
    }
    {
        const timeUtils = require('../tools/time-utils');

        const duration = timeUtils.timeThis(run);
        const durationStr = timeUtils.formatDuration(duration);
        console.log('%s elapsed.', durationStr);
    }
}

function doLevel()
{
    const solutionBookMap = require('./solution-book-map');
    solutionBookMap.load();
    while (solutionBookMap.size)
    {
        const independentChars = [];
        for (const [char, solutionBook] of solutionBookMap.entries())
        {
            const { usedChars } = solutionBook;
            if
            (
                !usedChars ||
                usedChars.every(usedChar => usedChar === char || !solutionBookMap.has(usedChar))
            )
                independentChars.push(char);
        }
        independentChars.forEach(char => solutionBookMap.delete(char));
        console.log(JSON.stringify(independentChars.join('')));
    }
}

function printHelp()
{
    const help =
    'index-chars add [--new] [--test] [--static] [--level<n>] [--deep<n>] <chars>\n' +
    'index-chars level\n' +
    'index-chars help';
    console.log(help);
}

const { argv } = process;
const argCount = argv.length;
if (argCount < 3)
    printHelp();
const [,, command] = argv;
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
default:
    console.error('index-chars: \'%s\' is not a valid command. See \'index-chars help\'.', command);
    break;
}
