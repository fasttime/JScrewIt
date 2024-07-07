#!/usr/bin/env node

import choose                   from    './internal/choose.mjs';
import Analyzer                 from    './internal/optimized-analyzer.mjs';
import PREDEF_TEST_DATA_MAP_OBJ from    './internal/predef-test-data.js';
import progress                 from    './internal/progress.mjs';
import SolutionBookMap          from    './internal/solution-book-map.mjs';
import STRATEGY_TEST_DATA_LIST  from    './internal/strategy-test-data.js';
import JScrewIt                 from    '../lib/jscrewit.js';
import                                  '../tools/text-utils.js';
import chalk                    from    'chalk';

function checkMinInputLength
(features, createInput, strategies, strategy, minLength, rivalStrategyNames)
{
    function checkOtherStrategies(inputData)
    {
        let tooSmall = false;
        const { length } = strategy.call(encoder, inputData);
        for (const strategyName of rivalStrategyNames)
        {
            const thisStrategy = strategies[strategyName];
            if (thisStrategy === strategy)
                continue;
            let diffStr;
            if (encoder.hasFeatures(thisStrategy.mask))
            {
                const thisLength = thisStrategy.call(encoder, inputData).length;
                const diff = thisLength - length;
                if (diff > 0)
                    diffStr = `+${diff}`;
                else
                {
                    diffStr = chalk.bold(diff);
                    tooSmall = true;
                }
            }
            else
                diffStr = 'N/A';
            console.log('%s%s', strategyName.padEnd(25), diffStr);
        }
        if (tooSmall)
        {
            ok = false;
            logWarn('minInputLength is too small.');
        }
    }

    function findBestStrategy(inputData)
    {
        let bestStrategyName;
        let bestLength = Infinity;
        for (const strategyName of rivalStrategyNames)
        {
            const thisStrategy = strategies[strategyName];
            if (thisStrategy === strategy)
                continue;
            if (encoder.hasFeatures(thisStrategy.mask))
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
    let ok = true;
    checkOtherStrategies(inputDataFit);
    const outputShort = strategy.call(encoder, inputDataShort);
    const bestDataShort = findBestStrategy(inputDataShort);
    if (bestDataShort.length > outputShort.length)
    {
        ok = false;
        logWarn(`minInputLength is too large for ${bestDataShort.strategyName}.`);
    }
    if (ok)
        logOk('minInputLength is ok.');
}

function createAnalyzer(ancestorFeatureObj)
{
    SolutionBookMap.load();
    const analyzer = new Analyzer(ancestorFeatureObj);
    return analyzer;
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

function logOk(str)
{
    console.log(chalk.green(str));
}

function logWarn(str)
{
    console.log(chalk.yellow(str));
}

function mismatchCallback(...args)
{
    args.forEach(logWarn);
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
            const complexSolution = encoder.resolve(definition, complex);
            const options = { optimize: { complexOpt: false } };
            const replacement = encoder.replaceString(complex, options);
            if (complexSolution.length < replacement.length)
                return true;
        }
    }
    return false;
}

function verifyDefinitions
(entries, inputList, mismatchCallback, replaceVariant, formatVariant, ancestorFeatureObj)
{
    let encoder;
    let mismatchCount = 0;
    const analyzer = createAnalyzer(ancestorFeatureObj);
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
                {
                    const { featureObj } = analyzer;
                    const message = `No definition available for ${featureObj}`;
                    throw Error(message);
                }
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
        const
        {
            availableEntries,
            commonFeatureObj,
            formatVariant,
            organizedEntries,
            replaceVariant,
        } =
        PREDEF_TEST_DATA_MAP_OBJ[predefName];
        verifyDefinitions
        (
            organizedEntries,
            availableEntries,
            mismatchCallback,
            replaceVariant,
            formatVariant,
            commonFeatureObj,
        );
    };
    return verify;
}

function verifyStrategy(strategyTestData)
{
    const result =
    () =>
    {
        const { createInput, features, strategyName, rivalStrategyNames } = strategyTestData;
        const strategies = JScrewIt.debug.getStrategies();
        const strategy = strategies[strategyName];
        const minLength = strategy.minInputLength;
        checkMinInputLength
        (features, createInput, strategies, strategy, minLength, rivalStrategyNames);
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

verify.OPTIMAL_ARG_NAME = verifyPredef('OPTIMAL_ARG_NAME');

verify.OPTIMAL_B = verifyPredef('OPTIMAL_B');

verify.OPTIMAL_RETURN_STRING = verifyPredef('OPTIMAL_RETURN_STRING');

for (const strategyTestData of STRATEGY_TEST_DATA_LIST)
    verify[strategyTestData.strategyName] = verifyStrategy(strategyTestData);

{
    const callback =
    routineName =>
    {
        const routine = verify[routineName];
        if (!routine)
            return `Unknown verification routine ${routineName}.`;
        routine();
    };
    const routineNames = Object.keys(verify);
    await choose(callback, 'Routine to verify', routineNames);
}
