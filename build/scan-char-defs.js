/* global padLeft */
/* jshint node: true */

'use strict';

require('../tools/text-utils.js');

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

function printReport(logLine, char, solutions)
{
    var createFeatureFromMask = require('../lib/jscrewit.js').debug.createFeatureFromMask;
    solutions.forEach(
        function (solution)
        {
            var featureObj = createFeatureFromMask(solution.mask);
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

function requireFs()
{
    var fs = require('fs');
    return fs;
}

function runScan()
{
    var ProgressBar = require('progress');
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
    var CharMap = require('./char-map.js');
    var charMap = CharMap(callback);
    var charMapJSON = CharMap.stringify(charMap);
    requireFs().writeFile(CharMap.FILE_NAME, charMapJSON, Function());
    var notAllDefsUsed = false;
    allPropertyNamesIn(charMap).sort().forEach(
        function (char)
        {
            var solutions = charMap[char];
            if (printReport(logLine, char, solutions))
                notAllDefsUsed = true;
        }
    );
    return notAllDefsUsed;
}

function subRunScan(callback)
{
    var fs = requireFs();
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
