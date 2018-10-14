#!/usr/bin/env node

/* eslint-env node */

'use strict';

const JScrewIt      = require('..');
const chalk         = require('chalk');
const defSystems    = require('./def-systems');

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
        for (const coderName of coderNames)
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

function createAnalyzer()
{
    require('./solution-book-map').load();
    const Analyzer = require('./optimized-analyzer');

    const analyzer = new Analyzer();
    return analyzer;
}

function createOptimalFeatureObjMap(replacer, rivalReplacer, progressCallback)
{
    function callProgressCallback()
    {
        if (progressCallback)
            progressCallback(analyzer.progress);
    }

    let optimalFeatureObjMap;
    let optimalLength = Infinity;
    const analyzer = createAnalyzer();
    callProgressCallback();
    let encoder;
    while (encoder = analyzer.nextEncoder)
    {
        const output = replacer(encoder);
        callProgressCallback();
        if (output === undefined)
            continue;
        const { length } = output;
        if (length <= optimalLength)
        {
            analyzer.stopCapture();
            const rivalOutput = rivalReplacer(encoder, length);
            if (rivalOutput !== undefined)
                continue;
            if (length < optimalLength)
            {
                optimalFeatureObjMap = { __proto__: null };
                optimalLength = length;
            }
            const optimalFeatureObjs =
            optimalFeatureObjMap[output] || (optimalFeatureObjMap[output] = []);
            optimalFeatureObjs.push(analyzer.featureObj);
        }
    }
    callProgressCallback();
    return optimalFeatureObjMap;
}

function findCoderTestData(coderName)
{
    const CODER_TEST_DATA_LIST = require('./coder-test-data');

    const coderTestData =
    CODER_TEST_DATA_LIST.find(coderTestData => coderTestData.coderName === coderName);
    return coderTestData;
}

function findOptimalFeatures(replacer, rivalReplacer, progressCallback)
{
    const optimalFeatureObjMap =
    createOptimalFeatureObjMap(replacer, rivalReplacer, progressCallback);
    if (optimalFeatureObjMap)
    {
        const result =
        Object.keys(optimalFeatureObjMap).map
        (
            output =>
            {
                const optimalFeatureObjs = optimalFeatureObjMap[output];
                const featureObj =
                optimalFeatureObjs.reduce
                (
                    (previousFeatureObj, currentFeatureObj) =>
                    {
                        const nextFeatureObj =
                        JScrewIt.Feature.commonOf(previousFeatureObj, currentFeatureObj);
                        return nextFeatureObj;
                    }
                );
                return featureObj;
            }
        );
        return result;
    }
}

function getOptimalityInfo(encoder, inputList, replaceVariant)
{
    function considerInput(entry)
    {
        if (!encoder.hasFeatures(entry.mask))
            return;
        const { definition } = entry;
        const solution = replaceVariant(encoder, definition);
        const { length } = solution;
        if (length <= optimalLength)
        {
            if (length < optimalLength)
            {
                optimalDefinitions = [];
                optimalLength = length;
            }
            optimalDefinitions.push(definition);
        }
        lengthMap[definition] = length;
    }

    let optimalDefinitions;
    const lengthMap = { __proto__: null };
    let optimalLength = Infinity;
    inputList.forEach(considerInput);
    const optimalityInfo = { lengthMap, optimalDefinitions, optimalLength };
    return optimalityInfo;
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
            console.log('%s elapsed.', durationStr);
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
            (str, routineName) => `${str}\n• ${routineName}`,
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

function verifyComplex(complex, entry)
{
    let encoder;
    const analyzer = createAnalyzer();
    const entryMask = entry.mask;
    const { definition } = entry;
    while (encoder = analyzer.nextEncoder)
    {
        if (encoder.hasFeatures(entryMask))
        {
            const complexSolution = encoder.resolve(definition);
            const options = { bond: true, optimize: { toStringOpt: true } };
            const replacement = encoder.replaceString(complex, options);
            if (complexSolution.length < replacement.length)
                return true;
        }
    }
    return false;
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

function verifyDefinitions(entries, inputList, mismatchCallback, replaceVariant, formatVariant)
{
    let mismatchCount = 0;
    const analyzer = createAnalyzer();
    let encoder;
    if (formatVariant == null)
        formatVariant = String;
    while (encoder = analyzer.nextEncoder)
    {
        const optimalityInfo = getOptimalityInfo(encoder, inputList, replaceVariant);
        analyzer.stopCapture();
        const { lengthMap } = optimalityInfo;
        const actualDefinition = encoder.findDefinition(entries);
        const actualLength = lengthMap[actualDefinition];
        if (actualLength == null)
            throw Error('No available definition matches');
        const { optimalLength } = optimalityInfo;
        if (lengthMap[actualDefinition] > optimalLength)
        {
            const featureNames = analyzer.featureObj.canonicalNames;
            const { optimalDefinitions } = optimalityInfo;
            optimalDefinitions.sort();
            mismatchCallback
            (
                `${++mismatchCount}.`,
                featureNames.join(', '),
                formatVariant(actualDefinition),
                `(${lengthMap[actualDefinition]})`,
                optimalDefinitions.map(formatVariant),
                `(${optimalLength})`,
                '\x1e'
            );
        }
    }
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
