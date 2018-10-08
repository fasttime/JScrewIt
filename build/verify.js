#!/usr/bin/env node

/* eslint-env node */

'use strict';

const JScrewIt      = require('..');
const chalk         = require('chalk');
const defSystems    = require('./def-systems');
const kit           = require('./es5/verifier-kit');

const { findOptimalFeatures, verifyComplex, verifyDefinitions } = kit;
require('../tools/text-utils');
const timeUtils = require('../tools/time-utils');

function checkCoderFeatureOptimality(createInput, coders, coder, minLength, progressCallback)
{
    const input = createInput(minLength);
    const replacer =
    encoder =>
    {
        const inputData = Object(input);
        const output = coder.call(encoder, inputData);
        return output;
    };
    const rivalReplacer =
    (encoder, maxLength) =>
    {
        const inputData = Object(input);
        for (const coderName in coders)
        {
            if (isRivalCoderName(coderName))
            {
                const rivalCoder = coders[coderName];
                if (rivalCoder !== coder)
                {
                    const output = rivalCoder.call(encoder, inputData, maxLength);
                    if (output !== undefined)
                        return output;
                }
            }
        }
    };
    const optimalFeatureObjs = findOptimalFeatures(replacer, rivalReplacer, progressCallback);
    return optimalFeatureObjs;
}

function checkMinInputLength(features, createInput, coders, coder, minLength)
{
    function findBestCoder(inputData)
    {
        let bestCoderName;
        let bestLength = Infinity;
        coderNames.forEach
        (
            coderName =>
            {
                const thisCoder = coders[coderName];
                if (thisCoder !== coder)
                {
                    const { length } = thisCoder.call(encoder, inputData);
                    if (length < bestLength)
                    {
                        bestCoderName = coderName;
                        bestLength = length;
                    }
                }
            }
        );
        const result = { coderName: bestCoderName, length: bestLength };
        return result;
    }

    const encoder = JScrewIt.debug.createEncoder(features);
    const inputDataShort = Object(createInput(minLength - 1));
    const inputDataFit = Object(createInput(minLength));
    const coderNames = Object.keys(coders).filter(isRivalCoderName);
    let ok = true;
    const outputFit = coder.call(encoder, inputDataFit);
    const bestDataFit = findBestCoder(inputDataFit);
    if (bestDataFit.length <= outputFit.length)
    {
        ok = false;
        logWarn(`MIN_INPUT_LENGTH is too small for ${bestDataFit.coderName}.`);
    }
    const outputShort = coder.call(encoder, inputDataShort);
    const bestDataShort = findBestCoder(inputDataShort);
    if (bestDataShort.length > outputShort.length)
    {
        ok = false;
        logWarn(`MIN_INPUT_LENGTH is too large for ${bestDataShort.coderName}.`);
    }
    if (ok)
        logOk('MIN_INPUT_LENGTH is ok.');
}

function compareRoutineNames(name1, name2)
{
    const result = isCapital(name2) - isCapital(name1);
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
    const CODER_TEST_DATA_LIST = require('./es5/coder-test-data');

    const coderTestData =
    CODER_TEST_DATA_LIST.find(coderTestData => coderTestData.coderName === coderName);
    return coderTestData;
}

function isCapital(name)
{
    const capital = name.toUpperCase() === name;
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
    const [,, routineName] = process.argv;
    if (routineName != null)
    {
        const routine = verify[routineName];
        if (routine)
        {
            const duration = timeUtils.timeThis(routine);
            const durationStr = timeUtils.formatDuration(duration);
            console.log(`${durationStr} elapsed.`);
            return;
        }
    }
    printHelpMessage();
}

function mismatchCallback(...args)
{
    args.forEach(logWarn);
}

function printHelpMessage()
{
    console.error
    (
        Object.keys(verify).sort(compareRoutineNames).reduce
        (
            (str, routineName) => `${str}\n* ${routineName}`,
            'Please, specify one of the implemented verification routines:'
        )
    );
}

function printOptimalFeatureReport(features, optimalFeatureObjs)
{
    if (optimalFeatureObjs)
    {
        const featureObj = JScrewIt.Feature(features);
        const featureMatches =
        optimalFeatureObj => JScrewIt.Feature.areEqual(optimalFeatureObj, featureObj);
        if (optimalFeatureObjs.some(featureMatches))
            logOk('Preset features are optimal.');
        else
        {
            const output = 'Preset features are suboptimal. Optimal features are:';
            for (const optimalFeatureObj of optimalFeatureObjs)
                output += `\n${optimalFeatureObj}`;
            logWarn(output);
        }
    }
    else
        logWarn('No optimal features found.');
}

function verifyCoder(coderName)
{
    const result =
    () =>
    {
        const coderTestData = findCoderTestData(coderName);
        const { createInput, features } = coderTestData;
        const coders = JScrewIt.debug.getCoders();
        const coder = coders[coderName];
        const minLength = coder.MIN_INPUT_LENGTH;
        checkMinInputLength(features, createInput, coders, coder, minLength);
        const progress = require('./progress');
        let optimalFeatureObjs;
        progress
        (
            'Scanning preset features',
            bar =>
            {
                const progressCallback = progress => bar.update(progress);
                optimalFeatureObjs =
                checkCoderFeatureOptimality
                (createInput, coders, coder, minLength, progressCallback);
            }
        );
        printOptimalFeatureReport(features, optimalFeatureObjs);
    };
    return result;
}

function verifyDefSystem(defSystemName)
{
    const defSystem = defSystems[defSystemName];
    const { availableEntries, formatVariant, organizedEntries, replaceVariant } = defSystem;
    const verify =
    () =>
    {
        verifyDefinitions
        (organizedEntries, availableEntries, mismatchCallback, replaceVariant, formatVariant);
    };
    return verify;
}

const verify = { __proto__: null };

JScrewIt.debug.getComplexNames().forEach
(
    complex =>
    {
        if (!verify[complex])
        {
            const entry = JScrewIt.debug.getComplexEntry(complex);
            verify[complex] =
            () =>
            {
                const ok = verifyComplex(complex, entry);
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
    coderName =>
    {
        verify[coderName] = verifyCoder(coderName);
    }
);

main();
