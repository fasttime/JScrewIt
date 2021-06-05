#!/usr/bin/env node

'use strict';

const STRATEGY_TEST_DATA_LIST = require('./internal/strategy-test-data');

function compareDiffLists(diffList1, diffList2)
{
    for (let index = 0; ; ++index)
    {
        const diff1 = diffList1[index];
        const diff2 = diffList2[index];
        const diff = diff1 - diff2;
        if (diff)
            return diff;
        if (diff1 === undefined || diff2 === undefined)
            return 0;
    }
}

function findTestData(strategyName)
{
    const strategyTestData =
    STRATEGY_TEST_DATA_LIST.find
    (({ strategyName: thisStrategyName }) => thisStrategyName === strategyName);
    return strategyTestData;
}

function optimize(strategyTestData)
{
    const
    {
        Feature,
        Feature: { DEFAULT, ELEMENTARY, areCompatible, areEqual, commonOf },
        debug: { createEncoder, getStrategies, maskIncludes },
    } =
    require('..');
    const chalk = require('chalk');

    function addFeature(featureObjA, featureObjB)
    {
        const excludedFeatureNameSet = new Set();
        for (const featureObj of ELEMENTARY)
        {
            if (!areCompatible(featureObj, featureObjB))
            {
                for (const featureName of featureObj.elementaryNames)
                    excludedFeatureNameSet.add(featureName);
            }
        }
        const elementaryFeatureObjs =
        ELEMENTARY.filter
        (
            elementaryFeatureObj =>
            featureObjA.includes(elementaryFeatureObj) &&
            !excludedFeatureNameSet.has(elementaryFeatureObj.name),
        );
        const newFeatureObj = Feature(...elementaryFeatureObjs, featureObjB);
        return newFeatureObj;
    }

    function createDiffList({ createInput, rivalStrategyNames }, featureObj)
    {
        const diffList = [];
        const encoder = createEncoder(featureObj);
        const inputLength = strategy.minInputLength;
        const inputData = Object(createInput(inputLength));
        const { length } = strategy.call(encoder, inputData);
        for (const thisStrategyName of rivalStrategyNames)
        {
            const thisStrategy = strategies[thisStrategyName];
            if (thisStrategy !== strategy)
            {
                const thisLength = thisStrategy.call(encoder, inputData).length;
                const diff = thisLength - length;
                diffList.push(diff);
            }
        }
        diffList.sort((diff1, diff2) => diff1 - diff2);
        return diffList;
    }

    function createFeatureIterable()
    {
        const iterable =
        {
            end: null,

            * [Symbol.iterator]()
            {
                for (;;)
                {
                    for (const featureObj of ELEMENTARY)
                    {
                        const { end } = this;
                        if (featureObj === end)
                            return;
                        if (!end)
                            this.end = featureObj;
                        yield featureObj;
                    }
                }
            },
        };
        return iterable;
    }

    function subtractFeature(featureObjA, featureObjB)
    {
        const elementaryFeatureObjs =
        ELEMENTARY.filter
        (
            elementaryFeatureObj =>
            featureObjA.includes(elementaryFeatureObj) &&
            areEqual(commonOf(featureObjB, elementaryFeatureObj), DEFAULT),
        );
        const newFeatureObj = Feature(...elementaryFeatureObjs);
        return newFeatureObj;
    }

    let dirty = false;
    let optimalFeatureObj = Feature(...strategyTestData.features);
    const strategies = getStrategies();
    const strategy = strategies[strategyTestData.strategyName];
    let optimalDiffList = createDiffList(strategyTestData, optimalFeatureObj);
    const iterable = createFeatureIterable();
    const requiredMask = strategy.mask;
    for (const featureObj of iterable)
    {
        let newFeatureObj;
        if (optimalFeatureObj.includes(featureObj))
            newFeatureObj = subtractFeature(optimalFeatureObj, featureObj);
        else
            newFeatureObj = addFeature(optimalFeatureObj, featureObj);
        if (!maskIncludes(newFeatureObj.mask, requiredMask))
            continue;
        const newDiffList = createDiffList(strategyTestData, newFeatureObj);
        if (compareDiffLists(newDiffList, optimalDiffList) > 0)
        {
            iterable.end = featureObj;
            optimalFeatureObj = newFeatureObj;
            optimalDiffList = newDiffList;
            dirty = true;
        }
    }
    if (dirty)
    {
        console.log
        (chalk.yellow(['Optimal features:', ...optimalFeatureObj.canonicalNames].join('\n')));
    }
    else
        console.log(chalk.green('The configured features are already optimal.'));
}

{
    const choose = require('./internal/choose');

    const callback =
    strategyName =>
    {
        const strategyTestData = findTestData(strategyName);
        if (!strategyTestData)
            return `Unknown strategy ${strategyName}.`;
        optimize(strategyTestData);
    };
    const strategyNames = STRATEGY_TEST_DATA_LIST.map(({ strategyName }) => strategyName);
    choose(callback, 'Strategy to optimize', strategyNames);
}
