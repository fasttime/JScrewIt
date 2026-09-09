#!/usr/bin/env node

import { styleText }                                    from 'node:util';
import JScrewIt                                         from '#jscrewit';
import choose                                           from './internal/choose.mjs';
import Analyzer                                         from './internal/optimized-analyzer.mjs';
import { PredefEntry, analyzeCells, createCellChecker } from './internal/predef-cells.mjs';
import PREDEF_TEST_DATA_MAP_OBJ                         from './internal/predef-test-data.mjs';
import progress                                         from './internal/progress.mjs';
import SolutionBookMap                                  from './internal/solution-book-map.mjs';
import STRATEGY_TEST_DATA_LIST                          from './internal/strategy-test-data.mjs';

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
                    diffStr = styleText('bold', `${diff}`);
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

function createAnalyzer()
{
    SolutionBookMap.load();
    const analyzer = new Analyzer();
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
    console.log(styleText('green', str));
}

function logWarn(str)
{
    console.log(styleText('yellow', str));
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

function verifyDefinitions(predefTestData)
{
    const { availableEntries, formatVariant, organizedEntries, replaceVariant } = predefTestData;
    SolutionBookMap.load();
    let cells;
    progress
    (
        'Scanning definitions',
        bar =>
        {
            cells = analyzeCells(predefTestData, bar);
        },
    );
    const { validate } = createCellChecker(cells);
    const entries =
    organizedEntries.map(({ definition, mask }) => new PredefEntry(mask, [definition]));
    let mismatchCount = 0;
    const report =
    (cellIndex, entryIndex) =>
    {
        const cell = cells[cellIndex];
        if (entryIndex == null)
        {
            const featureObj = featureFromMask(cell.mask);
            const message = `No definition available for ${featureObj}`;
            throw Error(message);
        }
        // A feature combination in the cell for which the offending entry is the last match.
        const featureObj = featureFromMask(maskUnion(cell.mask, entries[entryIndex].mask));
        const encoder = new Analyzer(featureObj).nextEncoder;
        const { lengthMap, optimalDefinitions, optimalLength } =
        getOptimalityInfo(encoder, availableEntries, replaceVariant);
        const actualDefinition = encoder.findDefinition(organizedEntries);
        optimalDefinitions.sort();
        mismatchCallback
        (
            `${++mismatchCount}.`,
            featureObj.canonicalNames.join(', '),
            formatVariant(actualDefinition),
            `(${lengthMap[actualDefinition]})`,
            optimalDefinitions.map(formatVariant),
            `(${optimalLength})`,
            '\x1e',
        );
    };
    validate(entries, report);
    if (!mismatchCount)
        logOk('Ok.');
}

function verifyPredef(predefName)
{
    const verify =
    () =>
    {
        const predefTestData = PREDEF_TEST_DATA_MAP_OBJ[predefName];
        verifyDefinitions(predefTestData);
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

const { featureFromMask, maskUnion } = JScrewIt.debug;

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

verify['BASE64_ALPHABET_HI_4:1'] = verifyPredef('BASE64_ALPHABET_HI_4:1');

verify['BASE64_ALPHABET_HI_4:4'] = verifyPredef('BASE64_ALPHABET_HI_4:4');

verify['BASE64_ALPHABET_HI_4:5'] = verifyPredef('BASE64_ALPHABET_HI_4:5');

verify['BASE64_ALPHABET_LO_4:1'] = verifyPredef('BASE64_ALPHABET_LO_4:1');

verify['BASE64_ALPHABET_LO_4:3'] = verifyPredef('BASE64_ALPHABET_LO_4:3');

verify.FORMAT_MAPPER_LONG = verifyPredef('FORMAT_MAPPER_LONG');

verify.FORMAT_MAPPER_SHORT = verifyPredef('FORMAT_MAPPER_SHORT');

verify.FROM_CHAR_CODE = verifyPredef('FROM_CHAR_CODE');

verify.FROM_CHAR_CODE_CALLBACK_FORMATTER = verifyPredef('FROM_CHAR_CODE_CALLBACK_FORMATTER');

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
