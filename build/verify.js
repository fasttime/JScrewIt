#!/usr/bin/env node

'use strict';

const JScrewIt  = require('..');
const chalk     = require('chalk');

require('../tools/text-utils');
const timeUtils = require('../tools/time-utils');

function checkMinInputLength(features, createInput, strategies, strategy, minLength)
{
    function findBestStrategy(inputData)
    {
        let bestStrategyName;
        let bestLength = Infinity;
        for (const strategyName of strategyNames)
        {
            const thisStrategy = strategies[strategyName];
            if (thisStrategy !== strategy)
            {
                const { length } = thisStrategy.call(encoder, inputData);
                if (length < bestLength)
                {
                    bestStrategyName = strategyName;
                    bestLength = length;
                }
            }
        }
        const result = { strategyName: bestStrategyName, length: bestLength };
        return result;
    }

    const encoder = JScrewIt.debug.createEncoder(features);
    const inputDataShort = Object(createInput(minLength - 1));
    const inputDataFit = Object(createInput(minLength));
    const strategyNames = Object.keys(strategies).filter(isRivalStrategyName);
    let ok = true;
    const outputFit = strategy.call(encoder, inputDataFit);
    const bestDataFit = findBestStrategy(inputDataFit);
    if (bestDataFit.length <= outputFit.length)
    {
        ok = false;
        logWarn(`MIN_INPUT_LENGTH is too small for ${bestDataFit.strategyName}.`);
    }
    const outputShort = strategy.call(encoder, inputDataShort);
    const bestDataShort = findBestStrategy(inputDataShort);
    if (bestDataShort.length > outputShort.length)
    {
        ok = false;
        logWarn(`MIN_INPUT_LENGTH is too large for ${bestDataShort.strategyName}.`);
    }
    if (ok)
        logOk('MIN_INPUT_LENGTH is ok.');
}

function checkStrategyFeatureOptimality
(createInput, strategies, strategy, minLength, progressCallback)
{
    const input = createInput(minLength);
    const replacer =
    encoder =>
    {
        const inputData = Object(input);
        const output = strategy.call(encoder, inputData);
        return output;
    };
    const rivalReplacer =
    (encoder, maxLength) =>
    {
        const inputData = Object(input);
        for (const strategyName in strategies)
        {
            if (isRivalStrategyName(strategyName))
            {
                const rivalStrategy = strategies[strategyName];
                if (rivalStrategy !== strategy)
                {
                    const output = rivalStrategy.call(encoder, inputData, maxLength);
                    if (output !== undefined)
                        return output;
                }
            }
        }
    };
    const optimalFeatureObjs = findOptimalFeatures(replacer, rivalReplacer, progressCallback);
    return optimalFeatureObjs;
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
                    },
                );
                return featureObj;
            },
        );
        return result;
    }
}

function findStrategyTestData(strategyName)
{
    const STRATEGY_TEST_DATA_LIST = require('./strategy-test-data');

    const strategyTestData =
    STRATEGY_TEST_DATA_LIST.find
    (strategyTestData => strategyTestData.strategyName === strategyName);
    return strategyTestData;
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

function isRivalStrategyName(strategyName)
{
    return strategyName !== 'express' && strategyName !== 'text';
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
            'Please, specify one of the implemented verification routines:',
        ),
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
            let output = 'Preset features are suboptimal. Optimal features are:';
            for (const optimalFeatureObj of optimalFeatureObjs)
                output += `\n${optimalFeatureObj}`;
            logWarn(output);
        }
    }
    else
        logWarn('No optimal features found.');
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

function verifyDefinitions
(entries, inputList, mismatchCallback, replaceVariant, formatVariant)
{
    const progress = require('./progress');

    let encoder;
    let mismatchCount = 0;
    const analyzer = createAnalyzer();
    progress
    (
        'Scanning definitions',
        bar =>
        {
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
                        '\x1e',
                    );
                }
                bar.update(analyzer.progress);
            }
        },
    );
}

function verifyPredef(predefName)
{
    const verify =
    () =>
    {
        const PREDEF_TEST_DATA_MAP_OBJ = require('./predef-test-data');

        const { availableEntries, formatVariant, organizedEntries, replaceVariant } =
        PREDEF_TEST_DATA_MAP_OBJ[predefName];
        verifyDefinitions
        (organizedEntries, availableEntries, mismatchCallback, replaceVariant, formatVariant);
    };
    return verify;
}

function verifyStrategy(strategyName)
{
    const result =
    () =>
    {
        const strategyTestData = findStrategyTestData(strategyName);
        const { createInput, features } = strategyTestData;
        const strategies = JScrewIt.debug.getStrategies();
        const strategy = strategies[strategyName];
        const minLength = strategy.MIN_INPUT_LENGTH;
        checkMinInputLength(features, createInput, strategies, strategy, minLength);
        const progress = require('./progress');
        let optimalFeatureObjs;
        progress
        (
            'Scanning preset features',
            bar =>
            {
                const progressCallback = progress => bar.update(progress);
                optimalFeatureObjs =
                checkStrategyFeatureOptimality
                (createInput, strategies, strategy, minLength, progressCallback);
            },
        );
        printOptimalFeatureReport(features, optimalFeatureObjs);
    };
    return result;
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
    },
);

verify['BASE64_ALPHABET_HI_4:0'] = verifyPredef('BASE64_ALPHABET_HI_4:0');

verify['BASE64_ALPHABET_HI_4:4'] = verifyPredef('BASE64_ALPHABET_HI_4:4');

verify['BASE64_ALPHABET_HI_4:5'] = verifyPredef('BASE64_ALPHABET_HI_4:5');

verify['BASE64_ALPHABET_LO_4:1'] = verifyPredef('BASE64_ALPHABET_LO_4:1');

verify['BASE64_ALPHABET_LO_4:3'] = verifyPredef('BASE64_ALPHABET_LO_4:3');

verify.FROM_CHAR_CODE = verifyPredef('FROM_CHAR_CODE');

verify.FROM_CHAR_CODE_CALLBACK_FORMATTER = verifyPredef('FROM_CHAR_CODE_CALLBACK_FORMATTER');

verify.MAPPER_FORMATTER = verifyPredef('MAPPER_FORMATTER');

verify.OPTIMAL_B = verifyPredef('OPTIMAL_B');

verify.OPTIMAL_RETURN_STRING = verifyPredef('OPTIMAL_RETURN_STRING');

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
    strategyName =>
    {
        verify[strategyName] = verifyStrategy(strategyName);
    },
);

main();
