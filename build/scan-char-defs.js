/* global padLeft */
/* jshint node: true */

'use strict';

require('../text-utils.js');
var JScrewIt = require('../lib/jscrewit.js');
var ProgressBar = require('progress');
var fs = require('fs');

function FeatureQueryInfo(featureMask, included, ancestorFeatureMask)
{
    this.featureMask = featureMask;
    this.included = included;
    this.ancestorFeatureMask = ancestorFeatureMask;
}

function createModifiedEncoder(features, featureQueries)
{
    function hasFeatures(featureMask)
    {
        var included = (featureMask & this.featureMask) === featureMask;
        if (featureMask)
        {
            if (!featureMaskSet[featureMask])
            {
                featureMaskSet[featureMask] = true;
                var featureQuery = new FeatureQueryInfo(featureMask, included, ancestorFeatureMask);
                featureQueries.push(featureQuery);
            }
        }
        if (included)
        {
            ancestorFeatureMask |= featureMask;
        }
        return included;
    }
    
    var featureMaskSet = { };
    var ancestorFeatureMask = 0;
    var encoder = JScrewIt.debug.createEncoder(features);
    encoder.hasFeatures = hasFeatures;
    return encoder;
}

function formatChar(char)
{
    var charCode = char.charCodeAt(0);
    var str =
        charCode >= 0x7f && charCode <= 0xa0 || charCode === 0xad ?
        '"\\u00' + charCode.toString(16) + '"' : JSON.stringify(char);
    return str;
}

function formatFeatures(features)
{
    var str = features.length ? features.join(', ') : 'DEFAULT';
    return str;
}

function getNewFeatureData(featureQueries)
{
    for (var index = featureQueries.length; index--;)
    {
        var featureQuery = featureQueries[index];
        if (!featureQuery.included)
        {
            var featureMask = featureQuery.featureMask | featureQuery.ancestorFeatureMask;
            if (isIndependentFeatureMask(featureQueries, index, featureMask))
            {
                var features = JScrewIt.debug.featuresFromMask(featureMask);
                if (JScrewIt.areFeaturesCompatible(features))
                {
                    var featureData = { features: features, featureMask: featureMask };
                    return featureData;
                }
            }
        }
    }
}

function getProgress(featureQueries)
{
    var step = 1;
    var progress = 0;
    featureQueries.forEach(
        function (featureQuery)
        {
            step /= 2;
            if (featureQuery.included)
            {
                progress += step;
            }
        }
    );
    progress += step;
    return progress;
}

function isIndependentFeatureMask(featureQueries, index, newFeatureMask)
{
    while (index--)
    {
        var featureQuery = featureQueries[index];
        if (!featureQuery.included)
        {
            var featureMask = featureQuery.featureMask;
            if ((featureMask & newFeatureMask) === featureMask)
            {
                return false;
            }
        }
    }
    return true;
}

function processOutputMap(outputMap, entryCount, logLine)
{
    var entryIndexSet = { };
    for (var output in outputMap)
    {
        var outputData = outputMap[output];
        var featureMask = outputData.featureMask;
        var features = JScrewIt.debug.featuresFromMask(featureMask);
        outputData.features = features;
        var entryIndex = outputData.entryIndex;
        if (entryIndex != null)
        {
            entryIndexSet[entryIndex] = true;
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
            var features1 = outputData1.features;
            var features2 = outputData2.features;
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
            var features = outputData.features;
            var outputLength = output.length;
            var entryIndex = outputData.entryIndex;
            var line =
                padLeft(outputLength, 5) + ' | ' + (entryIndex == null ? '-' : entryIndex) + ' | ' +
                formatFeatures(features);
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
    for (var charCode = 0; charCode < 256; ++charCode)
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
    var logLine = function (line) { fs.writeSync(fd, line + '\n'); };
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
                var notAllDefsUsed =
                    scanChar(char, entries.length, logLine, allCharCount, index, callback);
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
    var features = [];
    var featureMask = 0;
    var outputMap = { };
    for (;;)
    {
        var featureQueries = [];
        var encoder = createModifiedEncoder(features, featureQueries);
        var output = encoder.resolveCharacter(char);
        var outputData = outputMap[output];
        if (outputData)
        {
            outputData.featureMask &= featureMask;
        }
        else
        {
            outputMap[output] = { featureMask: featureMask, entryIndex: output.entryIndex };
        }
        var featureData = getNewFeatureData(featureQueries);
        if (!featureData)
        {
            break;
        }
        features = featureData.features;
        featureMask = featureData.featureMask;
        if (callback)
        {
            var progress = getProgress(featureQueries);
            callback(char, allCharCount, charDoneCount + progress);
        }
    }
    var notAllDefsUsed = processOutputMap(outputMap, entryCount, logLine);
    return notAllDefsUsed;
}

module.exports = runScan;
