/* global padLeft */
/* jshint node: true */

'use strict';

var Analyzer = require('./analyzer.js');
var JScrewIt = require('../lib/jscrewit.js');
var ProgressBar = require('progress');
var fs = require('fs');
require('../tools/text-utils.js');

function Interruption(blocker)
{
    this.blocker = blocker;
}

function allPropertyNamesIn(obj)
{
    var propertyNames = [];
    for (var propertyName in obj)
        propertyNames.push(propertyName);
    return propertyNames;
}

function compareCanonicalNames(solution1, solution2)
{
    var canonicalNames1 = solution1.canonicalNames;
    var canonicalNames2 = solution2.canonicalNames;
    for (var index = 0;; ++index)
    {
        var name1 = canonicalNames1[index] || '';
        var name2 = canonicalNames2[index] || '';
        if (!name1 && !name2)
        {
            // If you get this error, it's because more distinct solutions share the same minimal
            // common feature. In this case, the minimal common feature may not be characteristic
            // for the set of features generating the solution, and a new characterization may be
            // necessary.
            throw new Error('Feature collision');
        }
        if (name1 < name2)
            return -1;
        if (name1 > name2)
            return 1;
    }
}

function createEmpty()
{
    var empty = Object.create(null);
    return empty;
}

function createExceptionalCharMap(toDoCharMap)
{
    var exceptionalCharMap = createEmpty();
    for (var char in toDoCharMap)
    {
        var exceptionalChars = createEmpty();
        if (findDependencyLoops(toDoCharMap, char, exceptionalChars, char))
            exceptionalCharMap[char] = exceptionalChars;
    }
    return exceptionalCharMap;
}

function createToDoCharMap()
{
    var toDoCharMap = createEmpty();
    for (var charCode = 0; charCode <= 0xffff; ++charCode)
    {
        var char = String.fromCharCode(charCode);
        var entries = JScrewIt.debug.getCharacterEntries(char);
        if (entries)
        {
            var toDoEntry = toDoCharMap[char] = { blockedSet: createEmpty() };
            if (!entries.singleton)
                toDoEntry.definitionCount = entries.length;
        }
    }
    return toDoCharMap;
}

function findDependencyLoops(toDoCharMap, char, exceptionalChars, blocked)
{
    var toDoEntry = toDoCharMap[blocked];
    if (!toDoEntry)
        return;
    var blockedSet = toDoEntry.blockedSet;
    if (char in blockedSet)
        return true;
    var result;
    for (var blockedBlocked in blockedSet)
    {
        if (blockedBlocked in exceptionalChars)
            continue;
        exceptionalChars[blockedBlocked] = null;
        if (findDependencyLoops(toDoCharMap, char, exceptionalChars, blockedBlocked))
            result = true;
        else
            delete exceptionalChars[blockedBlocked];
    }
    return result;
}

function findKnownSolution(solutions, encoder, analyzer)
{
    var knownSolution;
    var knownLength = Infinity;
    solutions.forEach(
        function (solution)
        {
            var featureMask = solution.featureMask;
            if (encoder.hasFeatures(featureMask) && analyzer.doesNotExclude(featureMask))
            {
                var length = solution.length;
                if (length < knownLength)
                {
                    knownSolution = solution;
                    knownLength = length;
                }
                else if (length === knownLength)
                    knownSolution = null;
            }
        }
    );
    return knownSolution;
}

function formatChar(char)
{
    var charCode = char.charCodeAt(0);
    var str =
        charCode >= 0x7f && charCode <= 0xa0 || charCode === 0xad ?
        '"\\u00' + charCode.toString(16) + '"' : JSON.stringify(char);
    return str;
}

function formatFeatureNames(featureNames)
{
    var str = featureNames.length ? featureNames.join(', ') : 'DEFAULT';
    return str;
}

function multiSolve(char, doneCharMap, exceptionalChars)
{
    function newResolveCharacter(char)
    {
        var solutions = doneCharMap[char];
        if (solutions)
        {
            var solution = findKnownSolution(solutions, encoder, analyzer);
            // If you ever get this error you may need to implement the logic to choose the optimal
            // character solution out of two or more with the same length.
            if (solution == null)
                throw new Error('No single determinate solution found.');
            return solution;
        }
        if (char in exceptionalChars)
            return oldResolveCharacter.apply(encoder, arguments);
        throw new Interruption(char);
    }
    
    var entryIndexSet = createEmpty();
    var outputMap = createEmpty();
    var analyzer = new Analyzer();
    for (var encoder; encoder = analyzer.nextEncoder;)
    {
        var featureMask = analyzer.featureObj.mask;
        var oldResolveCharacter = encoder.resolveCharacter;
        encoder.resolveCharacter = newResolveCharacter;
        var solution = encoder.resolveCharacter(char);
        var outputSolution = outputMap[solution];
        if (outputSolution)
            outputSolution.featureMask &= featureMask;
        else
        {
            solution.featureMask = featureMask;
            outputMap[solution] = solution;
            var entryIndex = solution.entryIndex;
            if (entryIndex !== undefined)
                entryIndexSet[entryIndex] = null;
        }
    }
    var solutions =
        Object.keys(outputMap).map(
            function (outputKey)
            {
                var solution = outputMap[outputKey];
                return solution;
            }
        );
    solutions.entryIndexCount = Object.keys(entryIndexSet).length;
    return solutions;
}

function printReport(logLine, char, solutions)
{
    solutions.forEach(
        function (solution)
        {
            var featureObj = JScrewIt.debug.createFeatureFromMask(solution.featureMask);
            var canonicalNames = featureObj.canonicalNames;
            solution.canonicalNames = canonicalNames;
        }
    );
    solutions.sort(compareCanonicalNames);
    var desc = formatChar(char);
    var notAllDefsUsed = solutions.definitionCount > solutions.entryIndexCount;
    logLine('\nCharacter ' + desc);
    if (notAllDefsUsed)
        logLine('Not all definitions used!');
    solutions.forEach(
        function (solution)
        {
            var canonicalNames = solution.canonicalNames;
            var length = solution.length;
            var entryIndex = solution.entryIndex;
            var line =
                padLeft(length, 5) + ' | ' +
                padLeft(entryIndex == null ? '-' : entryIndex, 2) + ' | ' +
                formatFeatureNames(canonicalNames);
            logLine(line);
        }
    );
    return notAllDefsUsed;
}

function runScan()
{
    var bar =
        new ProgressBar(
            'scanning character definitions [:bar] :percent :etas',
            {
                complete:   '=',
                incomplete: ' ',
                width:      20,
                total:      100
            }
        );
    try
    {
        var notAllDefsUsed =
            subRunScan(
                function (charCount, doneCharCount)
                {
                    bar.update(doneCharCount / charCount);
                }
            );
        return notAllDefsUsed;
    }
    finally
    {
        bar.terminate();
    }
}

function scanCharDefs(logLine, callback)
{
    var toDoCharMap = createToDoCharMap();
    var charCount = Object.keys(toDoCharMap).length;
    var doneCharMap = createEmpty();
    var doneCharCount = 0;
    var exceptionalCharMap = createEmpty();
    var interruptCount = 0;
    for (;;)
    {
        var newDoneCharMap = Object.create(doneCharMap);
        for (var char in toDoCharMap)
        {
            var exceptionalChars = exceptionalCharMap[char] || createEmpty();
            exceptionalChars[char] = null;
            try
            {
                var solutions =
                    newDoneCharMap[char] = multiSolve(char, doneCharMap, exceptionalChars);
                solutions.definitionCount = toDoCharMap[char].definitionCount;
                delete toDoCharMap[char];
                ++doneCharCount;
                interruptCount = 0;
            }
            catch (error)
            {
                if (!(error instanceof Interruption))
                    throw error;
                var blocker = error.blocker;
                ++interruptCount;
                if (!newDoneCharMap[blocker])
                {
                    var toDoEntry = toDoCharMap[blocker];
                    if (!toDoEntry)
                    {
                        toDoCharMap[blocker] = toDoEntry = { blockedSet: createEmpty() };
                        ++charCount;
                    }
                    toDoEntry.blockedSet[char] = null;
                }
            }
            callback(charCount, doneCharCount + interruptCount / (interruptCount + 1));
        }
        doneCharMap = newDoneCharMap;
        if (charCount === doneCharCount)
            break;
        exceptionalCharMap = createExceptionalCharMap(toDoCharMap);
    }
    var notAllDefsUsed = false;
    allPropertyNamesIn(doneCharMap).sort().forEach(
        function (char)
        {
            var solutions = doneCharMap[char];
            if (printReport(logLine, char, solutions))
                notAllDefsUsed = true;
        }
    );
    return notAllDefsUsed;
}

function subRunScan(callback)
{
    var fd = fs.openSync('output.txt', 'w');
    var logLine =
        function (line)
        {
            fs.writeSync(fd, line + '\n');
        };
    try
    {
        logLine(
            'This is a report of all character encodings produced by JScrewIt using different\n' +
            'features.\n' +
            'The lines after a character headline contain encoding length, definition entry\n' +
            'index and minimal feature list for each encoding of that character.\n' +
            'Only characters with explicit definitions are listed.'
        );
        var notAllDefsUsed = scanCharDefs(logLine, callback);
        return notAllDefsUsed;
    }
    finally
    {
        fs.closeSync(fd);
    }
}

module.exports = runScan;
