/* global padLeft */
/* jshint node: true */

'use strict';

require('../tools/text-utils.js');
var Analyzer = require('./analyzer.js');
var JScrewIt = require('../lib/jscrewit.js');
var ProgressBar = require('progress');
var fs = require('fs');

function formatChar(char)
{
    var charCode = char.charCodeAt(0);
    var str =
        charCode >= 0x7f && charCode <= 0xa0 || charCode === 0xad ?
        '"\\u00' + charCode.toString(16) + '"' : JSON.stringify(char);
    return str;
}

function formatFeatures(featureNames)
{
    var str = featureNames.length ? featureNames.join(', ') : 'DEFAULT';
    return str;
}

function processOutputMap(outputMap, entryCount, logLine)
{
    var entryIndexSet = Object.create(null);
    for (var output in outputMap)
    {
        var outputData = outputMap[output];
        var featureMask = outputData.featureMask;
        var featureNames = JScrewIt.debug.createFeatureFromMask(featureMask).canonicalNames;
        outputData.featureNames = featureNames;
        var entryIndex = outputData.entryIndex;
        if (entryIndex != null)
        {
            entryIndexSet[entryIndex] = null;
        }
    }
    var notAllDefsUsed = Object.keys(entryIndexSet).length !== entryCount;
    if (notAllDefsUsed)
    {
        logLine('Not all definitions used!');
    }
    var outputs = Object.keys(outputMap);
    outputs.sort(
        function (output1, output2)
        {
            var outputData1 = outputMap[output1];
            var outputData2 = outputMap[output2];
            var features1 = outputData1.featureNames;
            var features2 = outputData2.featureNames;
            for (var index = 0;; ++index)
            {
                var feature1 = features1[index] || '';
                var feature2 = features2[index] || '';
                if (!feature1 && !feature2)
                {
                    return 0;
                }
                if (feature1 < feature2)
                {
                    return -1;
                }
                if (feature1 > feature2)
                {
                    return 1;
                }
            }
        }
    );
    outputs.forEach(
        function (output)
        {
            var outputData = outputMap[output];
            var featureNames = outputData.featureNames;
            var outputLength = output.length;
            var entryIndex = outputData.entryIndex;
            var line =
                padLeft(outputLength, 5) + ' | ' + (entryIndex == null ? '-' : entryIndex) + ' | ' +
                formatFeatures(featureNames);
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
    var defsUnused = false;
    scanAllChars(
        function (char, allCharCount, charDoneCount, notAllDefsUsed)
        {
            defsUnused |= notAllDefsUsed;
            bar.update(charDoneCount / allCharCount);
        }
    );
    return defsUnused;
}

function scanAllChars(callback)
{
    var chars = [];
    for (var charCode = 0; charCode <= 0xffff; ++charCode)
    {
        var char = String.fromCharCode(charCode);
        var entries = JScrewIt.debug.getCharacterEntries(char);
        if (entries)
        {
            chars.push(char);
        }
    }
    var allCharCount = chars.length;
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
        chars.forEach(
            function (char, index)
            {
                var entries = JScrewIt.debug.getCharacterEntries(char);
                var entryCount = Array.isArray(entries) ? entries.length : 0;
                var notAllDefsUsed =
                    scanChar(char, entryCount, logLine, allCharCount, index, callback);
                if (callback)
                {
                    callback(char, allCharCount, index + 1, notAllDefsUsed);
                }
            }
        );
    }
    finally
    {
        fs.closeSync(fd);
    }
}

function scanChar(char, entryCount, logLine, allCharCount, charDoneCount, callback)
{
    var desc = formatChar(char);
    logLine('\nCharacter ' + desc);
    var analyzer = new Analyzer();
    var outputMap = Object.create(null);
    var encoder;
    while (encoder = analyzer.nextEncoder)
    {
        var output = encoder.resolveCharacter(char);
        var outputData = outputMap[output];
        var featureMask = analyzer.featureObj.mask;
        if (outputData)
        {
            outputData.featureMask &= featureMask;
        }
        else
        {
            outputMap[output] = { featureMask: featureMask, entryIndex: output.entryIndex };
        }
        if (callback)
        {
            var progress = analyzer.progress;
            callback(char, allCharCount, charDoneCount + progress);
        }
    }
    var notAllDefsUsed = processOutputMap(outputMap, entryCount, logLine);
    return notAllDefsUsed;
}

module.exports = runScan;
