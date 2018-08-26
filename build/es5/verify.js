#!/usr/bin/env node

/* eslint-env node */

'use strict';

var JScrewIt = require('../..');
var chalk = require('chalk');
var defSystems = require('../def-systems');
var kit = require('./verifier-kit');

var findOptimalFeatures = kit.findOptimalFeatures;
var verifyComplex       = kit.verifyComplex;
var verifyDefinitions   = kit.verifyDefinitions;
require('../../tools/text-utils');
var timeUtils = require('../../tools/time-utils');

function checkCoderFeatureOptimality(
    createInput,
    coders,
    coder,
    minLength,
    progressCallback
)
{
    var input = createInput(minLength);
    var replacer =
    function (encoder)
    {
        var inputData = Object(input);
        var output = coder.call(encoder, inputData);
        return output;
    };
    var rivalReplacer =
    function (encoder, maxLength)
    {
        var inputData = Object(input);
        for (var coderName in coders)
        {
            if (isRivalCoderName(coderName))
            {
                var rivalCoder = coders[coderName];
                if (rivalCoder !== coder)
                {
                    var output = rivalCoder.call(encoder, inputData, maxLength);
                    if (output !== undefined)
                        return output;
                }
            }
        }
    };
    var optimalFeatureObjs = findOptimalFeatures(replacer, rivalReplacer, progressCallback);
    return optimalFeatureObjs;
}

function checkMinInputLength(features, createInput, coders, coder, minLength)
{
    function findBestCoder(inputData)
    {
        var bestCoderName;
        var bestLength = Infinity;
        coderNames.forEach
        (
            function (coderName)
            {
                var thisCoder = coders[coderName];
                if (thisCoder !== coder)
                {
                    var output = thisCoder.call(encoder, inputData);
                    var length = output.length;
                    if (length < bestLength)
                    {
                        bestCoderName = coderName;
                        bestLength = length;
                    }
                }
            }
        );
        var result = { coderName: bestCoderName, length: bestLength };
        return result;
    }

    var encoder = JScrewIt.debug.createEncoder(features);
    var inputDataShort = Object(createInput(minLength - 1));
    var inputDataFit = Object(createInput(minLength));
    var coderNames = Object.keys(coders).filter(isRivalCoderName);
    var ok = true;
    var outputFit = coder.call(encoder, inputDataFit);
    var bestDataFit = findBestCoder(inputDataFit);
    if (bestDataFit.length <= outputFit.length)
    {
        ok = false;
        logWarn('MIN_INPUT_LENGTH is too small for ' + bestDataFit.coderName + '.');
    }
    var outputShort = coder.call(encoder, inputDataShort);
    var bestDataShort = findBestCoder(inputDataShort);
    if (bestDataShort.length > outputShort.length)
    {
        ok = false;
        logWarn('MIN_INPUT_LENGTH is too large for ' + bestDataShort.coderName + '.');
    }
    if (ok)
        logOk('MIN_INPUT_LENGTH is ok.');
}

function compareRoutineNames(name1, name2)
{
    var result = isCapital(name2) - isCapital(name1);
    if (result)
        return result;
    if (name1 > name2)
        return 1;
    if (name1 < name2)
        return -1;
    return 0;
}

function findCoderTestData(coderName)
{
    var CODER_TEST_DATA_LIST = require('./coder-test-data');

    for (var index = 0; ; ++index)
    {
        var coderTestData = CODER_TEST_DATA_LIST[index];
        if (coderTestData.coderName === coderName)
            return coderTestData;
    }
}

function isCapital(name)
{
    var capital = name.toUpperCase() === name;
    return capital;
}

function isRivalCoderName(coderName)
{
    return coderName !== 'express' && coderName !== 'text';
}

function logOk(str)
{
    console.log(chalk.green(str));
}

function logWarn(str)
{
    console.log(chalk.yellow(str));
}

function main()
{
    var routineName = process.argv[2];
    if (routineName != null)
    {
        var routine = verify[routineName];
        if (routine)
        {
            var duration = timeUtils.timeThis(routine);
            var durationStr = timeUtils.formatDuration(duration);
            console.log(durationStr + ' elapsed.');
            return;
        }
    }
    printHelpMessage();
}

function mismatchCallback()
{
    Array.prototype.forEach.call
    (
        arguments,
        function (arg)
        {
            logWarn(arg);
        }
    );
}

function printHelpMessage()
{
    console.error
    (
        Object.keys(verify).sort(compareRoutineNames).reduce
        (
            function (str, routineName)
            {
                return str + '\n* ' + routineName;
            },
            'Please, specify one of the implemented verification routines:'
        )
    );
}

function printOptimalFeatureReport(features, optimalFeatureObjs)
{
    if (optimalFeatureObjs)
    {
        var featureObj = JScrewIt.Feature(features);
        var featureMatches =
            function (optimalFeatureObj)
            {
                return JScrewIt.Feature.areEqual(optimalFeatureObj, featureObj);
            };
        if (optimalFeatureObjs.some(featureMatches))
            logOk('Preset features are optimal.');
        else
        {
            var output = 'Preset features are suboptimal. Optimal features are:';
            optimalFeatureObjs.forEach
            (
                function (optimalFeatureObj)
                {
                    output += '\n' + String(optimalFeatureObj);
                }
            );
            logWarn(output);
        }
    }
    else
        logWarn('No optimal features found.');
}

function verifyCoder(coderName)
{
    var result =
    function ()
    {
        var coderTestData = findCoderTestData(coderName);
        var features = coderTestData.features;
        var createInput = coderTestData.createInput;
        var coders = JScrewIt.debug.getCoders();
        var coder = coders[coderName];
        var minLength = coder.MIN_INPUT_LENGTH;
        checkMinInputLength(features, createInput, coders, coder, minLength);

        var progress = require('../progress');

        var optimalFeatureObjs;
        progress
        (
            'Scanning preset features',
            function (bar)
            {
                var progressCallback =
                function (progress)
                {
                    bar.update(progress);
                };
                optimalFeatureObjs =
                checkCoderFeatureOptimality
                (
                    createInput,
                    coders,
                    coder,
                    minLength,
                    progressCallback
                );
            }
        );
        printOptimalFeatureReport(features, optimalFeatureObjs);
    };
    return result;
}

function verifyDefSystem(defSystemName)
{
    var defSystem = defSystems[defSystemName];
    var organizedEntries = defSystem.organizedEntries;
    var availableEntries = defSystem.availableEntries;
    var replaceVariant = defSystem.replaceVariant;
    var formatVariant = defSystem.formatVariant;

    function verify()
    {
        verifyDefinitions
        (organizedEntries, availableEntries, mismatchCallback, replaceVariant, formatVariant);
    }

    return verify;
}

var verify = Object.create(null);

JScrewIt.debug.getComplexNames().forEach
(
    function (complex)
    {
        if (!verify[complex])
        {
            var entry = JScrewIt.debug.getComplexEntry(complex);
            verify[complex] =
                function ()
                {
                    var ok = verifyComplex(complex, entry);
                    if (ok)
                        logOk('Ok.');
                    else
                        logWarn('Not useful.');
                };
        }
    }
);

verify['BASE64_ALPHABET_HI_4:0'] = verifyDefSystem('BASE64_ALPHABET_HI_4:0');

verify['BASE64_ALPHABET_HI_4:4'] = verifyDefSystem('BASE64_ALPHABET_HI_4:4');

verify['BASE64_ALPHABET_HI_4:5'] = verifyDefSystem('BASE64_ALPHABET_HI_4:5');

verify['BASE64_ALPHABET_LO_4:1'] = verifyDefSystem('BASE64_ALPHABET_LO_4:1');

verify['BASE64_ALPHABET_LO_4:3'] = verifyDefSystem('BASE64_ALPHABET_LO_4:3');

verify.CREATE_PARSE_INT_ARG = verifyDefSystem('CREATE_PARSE_INT_ARG');

verify.FROM_CHAR_CODE = verifyDefSystem('FROM_CHAR_CODE');

verify.FROM_CHAR_CODE_CALLBACK_FORMATTER = verifyDefSystem('FROM_CHAR_CODE_CALLBACK_FORMATTER');

verify.MAPPER_FORMATTER = verifyDefSystem('MAPPER_FORMATTER');

verify.OPTIMAL_B = verifyDefSystem('OPTIMAL_B');

verify.OPTIMAL_RETURN_STRING = verifyDefSystem('OPTIMAL_RETURN_STRING');

[
    'byCharCodes',
    'byCharCodesRadix4',
    'byDenseFigures',
    'byDict',
    'byDictRadix3',
    'byDictRadix4',
    'byDictRadix4AmendedBy1',
    'byDictRadix4AmendedBy2',
    'byDictRadix5AmendedBy2',
    'byDictRadix5AmendedBy3',
    'bySparseFigures',
]
.forEach
(
    function (coderName)
    {
        verify[coderName] = verifyCoder(coderName);
    }
);

main();
