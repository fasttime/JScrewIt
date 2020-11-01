#!/usr/bin/env node

'use strict';

const { createFeatureFromMask } = require('..').debug;

function compareCanonicalNames(solution1, solution2)
{
    const canonicalNames1 = solution1.canonicalNames;
    const canonicalNames2 = solution2.canonicalNames;
    for (let index = 0; ; ++index)
    {
        const name1 = canonicalNames1[index] || '';
        const name2 = canonicalNames2[index] || '';
        if (!name1 && !name2)
            throwFeatureCollisionError();
        if (name1 < name2)
            return -1;
        if (name1 > name2)
            return 1;
    }
}

function createOutputReport()
{
    const { closeSync, openSync, writeSync } = require('fs');
    const path = require('path').resolve(__dirname, '../output.txt');
    const fd = openSync(path, 'w');
    const logLine = line => writeSync(fd, `${line}\n`);
    try
    {
        logLine
        (
            'This is a report of all character encodings produced by JScrewIt using different\n' +
            'features.\n' +
            'The lines after a character headline contain encoding length, definition entry\n' +
            'index and minimal feature list for each encoding of that character.\n' +
            'Only characters with explicit definitions are listed.',
        );
        const notAllDefsUsed = scanCharDefs(logLine);
        return notAllDefsUsed;
    }
    finally
    {
        closeSync(fd);
    }
}

function formatChar(char)
{
    const charCode = char.charCodeAt();
    const str =
    charCode >= 0x7f && charCode <= 0xa0 || charCode === 0xad ?
    `"\\u00${charCode.toString(16)}"` : JSON.stringify(char);
    return str;
}

function formatFeatureNames(featureNames)
{
    const str = featureNames.length ? featureNames.join(', ') : 'DEFAULT';
    return str;
}

function printCharacterReport(logLine, char, definitionCount, solutions)
{
    const namedSolutions = [];
    const entryIndexSet = new Set();
    for (const solution of solutions)
    {
        for (const mask of solution.masks)
        {
            const namedSolution = Object.create(solution);
            namedSolution.canonicalNames = createFeatureFromMask(mask).canonicalNames;
            namedSolutions.push(namedSolution);
        }
        const { entryIndex } = solution;
        if (entryIndex != null)
            entryIndexSet.add(entryIndex);
    }
    namedSolutions.sort(compareCanonicalNames);
    const desc = formatChar(char);
    const notAllDefsUsed = definitionCount > entryIndexSet.size;
    logLine(`\nCharacter ${desc}`);
    if (notAllDefsUsed)
        logLine('Not all definitions used!');
    namedSolutions.forEach
    (
        ({ canonicalNames, entryIndex, length }) =>
        {
            const lengthStr = String(length).padStart(5);
            const entryIndexStr =
            (typeof entryIndex === 'number' ? String(entryIndex) : '-').padStart(2);
            const featureStr = formatFeatureNames(canonicalNames);
            const line = `${lengthStr} | ${entryIndexStr} | ${featureStr}`;
            logLine(line);
        },
    );
    return notAllDefsUsed;
}

function scanCharDefs(logLine)
{
    const solutionBookMap = require('./internal/solution-book-map');

    solutionBookMap.load();
    let notAllDefsUsed = false;
    solutionBookMap.forEach
    (
        ({ definitionCount, solutions }, char) =>
        {
            if (printCharacterReport(logLine, char, definitionCount, solutions))
                notAllDefsUsed = true;
        },
    );
    return notAllDefsUsed;
}

function throwFeatureCollisionError()
{
    // If you get this error, it's because more distinct solutions share the same minimal common
    // feature.
    // In this case, the minimal common feature may not be characteristic for the set of features
    // generating the solution, and a new characterization may be necessary.
    throw Error('Feature collision');
}

{
    const chalk = require('chalk');

    const notAllDefsUsed = createOutputReport();
    const message =
    notAllDefsUsed ?
    chalk.yellow('There are unused character definitions. See output.txt for details.') :
    chalk.green('All character definitions used.');
    console.log(message);
}
