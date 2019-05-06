#!/usr/bin/env node

'use strict';

const STRATEGY_TEST_DATA_LIST = require('./strategy-test-data');

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

function printHelpMessage()
{
    console.error
    (
        [
            'Please, specify one of the following strategies:',
            ...STRATEGY_TEST_DATA_LIST.map(({ strategyName }) => `• ${strategyName}`),
        ]
        .join('\n'),
    );
}

function run(strategyTestData)
{
    const
    {
        Feature,
        Feature: { DEFAULT, ELEMENTARY, areCompatible, areEqual, commonOf },
        debug: { createEncoder, getStrategies },
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

    function createDiffList({ createInput, strategyName }, featureObj)
    {
        const diffList = [];
        const encoder = createEncoder(featureObj);
        const strategies = getStrategies();
        const strategy = strategies[strategyName];
        const inputLength = strategy.MIN_INPUT_LENGTH;
        const inputData = Object(createInput(inputLength));
        const { length } = strategy.call(encoder, inputData);
        for (const { strategyName: thisStrategyName } of STRATEGY_TEST_DATA_LIST)
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
    let optimalDiffList = createDiffList(strategyTestData, optimalFeatureObj);
    const iterable = createFeatureIterable();
    for (const featureObj of iterable)
    {
        let newFeatureObj;
        if (optimalFeatureObj.includes(featureObj))
            newFeatureObj = subtractFeature(optimalFeatureObj, featureObj);
        else
            newFeatureObj = addFeature(optimalFeatureObj, featureObj);
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
    const [,, strategyName] = process.argv;
    if (strategyName != null)
    {
        const strategyTestData =
        STRATEGY_TEST_DATA_LIST.find
        (({ strategyName: thisStrategyName }) => thisStrategyName === strategyName);
        if (strategyTestData)
        {
            const { formatDuration, timeThis } = require('../tools/time-utils');

            const duration = timeThis(() => run(strategyTestData));
            const durationStr = formatDuration(duration);
            console.log('%s elapsed.', durationStr);
            return;
        }
    }
    printHelpMessage();
}
