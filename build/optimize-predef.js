#!/usr/bin/env node

'use strict';

const JSCREWIT_PATH = '..';

const PREDEF_TEST_DATA_MAP_OBJ  = require('./common/predef-test-data');
const progress                  = require('./common/progress');

function compareFeatures(feature1, feature2)
{
    const canonicalNames1 = feature1.canonicalNames;
    const canonicalNames2 = feature2.canonicalNames;
    {
        const diff = canonicalNames1.length - canonicalNames2.length;
        if (diff)
            return diff;
    }
    for (let index = 0; ; ++index)
    {
        const name1 = canonicalNames1[index];
        const name2 = canonicalNames2[index];
        if (name1 == null || name2 == null)
        {
            if (name1 != null)
                return 1;
            if (name2 != null)
                return -1;
            return 0;
        }
        if (name1 > name2)
            return 1;
        if (name1 < name2)
            return -1;
    }
}

function countCompatibleSpecializations(varSet, { specializations })
{
    let count = 0;
    for (const specialNode of specializations)
    {
        if (specialNode.varSet.includes(varSet))
            count += 1 + countCompatibleSpecializations(varSet, specialNode);
    }
    return count;
}

function createDefinitions(nodes)
{
    function chooseRoot()
    {
        let root;
        {
            let optimalCount = Infinity;
            for (const node of nodes)
            {
                if (!node.generalizations.size)
                {
                    const count = countCompatibleSpecializations(node.varSet, node);
                    if (count < optimalCount)
                    {
                        optimalCount = count;
                        root = node;
                    }
                }
            }
        }
        return root;
    }

    function unroot(node, varSet)
    {
        nodes.delete(node);
        const { specializations } = node;
        for (const specialNode of specializations)
            specialNode.generalizations.delete(node);
        for (const specialNode of specializations)
        {
            if (!specialNode.generalizations.size && specialNode.varSet.includes(varSet))
                unroot(specialNode, varSet);
        }
    }

    const definitionSets = [];
    let definitionSet;
    while (nodes.size)
    {
        const node = chooseRoot();
        const { feature, varSet } = node;
        let definitionVarSet;
        if
        (
            !definitionSet ||
            (definitionVarSet = definitionSet.varSet.intersectWith(varSet)).isEmpty()
        )
        {
            definitionSet = new Set();
            definitionSet.varSet = varSet;
            definitionSets.push(definitionSet);
        }
        else
            definitionSet.varSet = definitionVarSet;
        definitionSet.add(feature);
        unroot(node, node.varSet);
    }
    return definitionSets;
}

function createVarSet(entries)
{
    const variantToMaskMap = new Map();
    {
        let defMask = 1;
        for (const { definition } of entries)
        {
            variantToMaskMap.set(definition, defMask);
            defMask <<= 1;
        }
    }

    class VarSet
    {
        constructor()
        {
            Object.defineProperty(this, 'mask', { value: 0, writable: true });
        }

        add(variant)
        {
            const defMask = variantToMaskMap.get(variant);
            if (!defMask)
                throw TypeError('Not a valid variant');
            this.mask |= defMask;
        }

        get any()
        {
            const { mask } = this;
            for (const [variant, defMask] of variantToMaskMap)
            {
                if (mask & defMask)
                    return variant;
            }
            return undefined;
        }

        clear()
        {
            this.mask = 0;
        }

        includes({ mask })
        {
            const included = (this.mask & mask) === mask;
            return included;
        }

        intersectWith({ mask })
        {
            const varSet = new VarSet();
            varSet.mask = mask & this.mask;
            return varSet;
        }

        isEmpty()
        {
            return !this.mask;
        }

        get mask()
        {
            throw TypeError('No mask set');
        }

        get variants()
        {
            const variants = [];
            {
                const { mask } = this;
                for (const [variant, defMask] of variantToMaskMap)
                {
                    if (mask & defMask)
                        variants.push(variant);
                }
            }
            return variants;
        }
    }

    Object.seal(VarSet.prototype);
    return VarSet;
}

function dropIndirectSpecializations(node)
{
    const { specializations } = node;
    for (const specialNode0 of specializations)
    {
        const { feature } = specialNode0;
        for (const specialNode1 of specializations)
        {
            if (specialNode0 !== specialNode1 && specialNode1.feature.includes(feature))
            {
                specializations.delete(specialNode1);
                const { generalizations } = specialNode1;
                if (generalizations)
                    generalizations.delete(node);
            }
        }
    }
}

function featureDifference(featureAll, featureSome)
{
    const { Feature } = require(JSCREWIT_PATH);

    const elementaryNames =
    featureAll.elementaryNames.filter
    (
        elementaryName =>
        {
            const result = !featureSome.includes(elementaryName);
            return result;
        },
    );
    const featureComplement = Feature(elementaryNames);
    return featureComplement;
}

function isRedundantNode(node)
{
    const { varSet, generalizations } = node;
    if (!generalizations.size)
        return false;
    for (const generalNode of generalizations)
    {
        if (!varSet.includes(generalNode.varSet))
            return false;
    }
    return true;
}

function optimize(predefTestData)
{
    const nodes = runAnalysis(predefTestData);
    runJoin(nodes);
    const definitionSets = createDefinitions(nodes);
    simplifyDefinitions(definitionSets);
    printDefinitions(definitionSets, predefTestData);
}

function printDefinitions(definitionSets, { indent, formatVariant, variantToMinMaskMap })
{
    const LINE_LENGTH = 100;
    const { Feature, debug: { createFeatureFromMask } } = require(JSCREWIT_PATH);

    const argsList = [];
    for (const definitionSet of definitionSets)
    {
        const variant = definitionSet.varSet.any;
        const minFeature =
        variantToMinMaskMap ?
        createFeatureFromMask(variantToMinMaskMap.get(variant)) :
        Feature.DEFAULT;
        const features = [];
        for (const definitionSetFeature of definitionSet)
        {
            const feature = featureDifference(definitionSetFeature, minFeature);
            features.push(feature);
        }
        const formattedVariant = formatVariant(variant);
        features
        .sort(compareFeatures)
        .forEach
        (
            feature =>
            {
                const args = [formattedVariant, ...feature.canonicalNames];
                argsList.push(args);
            },
        );
    }
    const indentStr = ' '.repeat(indent);
    console.log('\n---\n');
    const str = `[${argsList.map(args => `define(${args.join(', ')})`).join(', ')}]`;
    if (str.length <= LINE_LENGTH - indent)
        console.log('%s%s', indentStr, str);
    else
    {
        console.log('%s[', indentStr);
        for (const args of argsList)
        {
            let str = args.join(', ');
            const restLength = LINE_LENGTH - str.length - indent;
            if (restLength >= 13)
                str = `(${str})`;
            else if (restLength >= 7)
                str = `\n${indentStr}    (${str})`;
            else
            {
                str =
                `\n${indentStr}    (${args.map(arg => `\n${indentStr}        ${arg}`)}` +
                `\n${indentStr}    )`;
            }
            console.log('%s    define%s,', indentStr, str);
        }
        console.log('%s],', indentStr);
    }
    console.log('\n---\n');
    console.log('%d definition(s) listed.', argsList.length);
}

function runAnalysis(predefTestData)
{
    require('./common/solution-book-map').load();
    const Analyzer = require('./common/optimized-analyzer');

    const nodes = new Set();
    const { availableEntries, commonFeatureObj, replaceVariant, useReverseIteration } =
    predefTestData;
    const VarSet = createVarSet(availableEntries);
    progress
    (
        'Scanning definitions',
        bar =>
        {
            const analyzer = new Analyzer(commonFeatureObj, useReverseIteration);
            let encoder;
            while (encoder = analyzer.nextEncoder)
            {
                const varSet = new VarSet();
                {
                    let optimalLength = Infinity;
                    for (const entry of availableEntries)
                    {
                        if (encoder.hasFeatures(entry.mask))
                        {
                            const variant = entry.definition;
                            const { length } = replaceVariant(encoder, variant);
                            if (length <= optimalLength)
                            {
                                if (length < optimalLength)
                                {
                                    optimalLength = length;
                                    varSet.clear();
                                }
                                varSet.add(variant);
                            }
                        }
                    }
                }
                if (varSet.isEmpty())
                {
                    const { featureObj } = analyzer;
                    const message = `No definition available for ${featureObj}`;
                    throw Error(message);
                }
                const node =
                {
                    feature:            analyzer.featureObj,
                    generalizations:    new Set(),
                    specializations:    new Set(),
                    varSet,
                };
                nodes.add(node);
                bar.update(analyzer.progress);
            }
        },
    );
    return nodes;
}

function runJoin(nodes)
{
    const reportStage =
    () => console.log('Stage %d: %d node(s), %d edge(s).', ++stage, nodes.size, edgeCount);

    let edgeCount = 0;
    progress
    (
        'Joining nodes',
        bar =>
        {
            // Join nodes
            const nodeCount = nodes.size;
            let done = 0;
            for (const node0 of nodes)
            {
                const { feature, specializations } = node0;
                for (const node1 of nodes)
                {
                    if (node0 !== node1 && node1.feature.includes(feature))
                        specializations.add(node1);
                }
                dropIndirectSpecializations(node0);
                for (const { generalizations } of specializations)
                    generalizations.add(node0);
                edgeCount += specializations.size;
                ++done;
                bar.update(done / nodeCount);
            }
        },
    );
    let stage = 0;
    reportStage();
    for (;;)
    {
        const updatedNodes = new Set();
        // Remove redundant nodes
        for (const node of nodes)
        {
            if (isRedundantNode(node))
            {
                const { generalizations, specializations } = node;
                edgeCount -= generalizations.size + specializations.size;
                for (const generalNode of generalizations)
                {
                    const generalNodeSpecializations = generalNode.specializations;
                    generalNodeSpecializations.delete(node);
                    edgeCount -= generalNodeSpecializations.size;
                    specializations.forEach(Set.prototype.add.bind(generalNodeSpecializations));
                    edgeCount += generalNodeSpecializations.size;
                    updatedNodes.add(generalNode);
                }
                for (const specialNode of specializations)
                {
                    const specialNodeGeneralizations = specialNode.generalizations;
                    specialNodeGeneralizations.delete(node);
                    generalizations.forEach(Set.prototype.add.bind(specialNodeGeneralizations));
                }
                nodes.delete(node);
            }
        }
        if (!updatedNodes.size)
            break;
        // Drop indirect specializations
        for (const node of updatedNodes)
        {
            const { specializations } = node;
            edgeCount -= specializations.size;
            dropIndirectSpecializations(node);
            edgeCount += specializations.size;
        }
        reportStage();
    }
}

/**

This will simplify definition sets like

```
{ varSet: s1, features: [[A], …X] }
{ varSet: s2, features: [[A, B_1], [A, B_2]…] }
{ varSet: s1, features: [[A, B_1, C], [A, B_2, C]…, …Y] }
```

into

```
{ varSet: s1, features: [[A], …X] }
{ varSet: s2, features: [[A, B_1], [A, B_2]…] }
{ varSet: s1, features: [[A, C], …Y] }
```

*/

function simplifyDefinitions(definitionSets)
{
    function getFeaturesABC(featuresAB, features2, featureC)
    {
        const featuresABC = [];

        loop:
        for (const featureAB of featuresAB)
        {
            for (const feature2 of features2)
            {
                const features = [featureAB, featureC];
                if (Feature.areCompatible(...features))
                {
                    const featureABC = Feature(features);
                    if (Feature.areEqual(feature2, featureABC))
                    {
                        featuresABC.push(feature2);
                        continue loop;
                    }
                }
            }
            return;
        }
        return featuresABC;
    }

    const { Feature } = require(JSCREWIT_PATH);

    for
    (
        let definitionSetIndex = definitionSets.length - 3;
        definitionSetIndex >= 0;
        --definitionSetIndex
    )
    {
        const definitionSet0 = definitionSets[definitionSetIndex];
        const definitions1 = [...definitionSets[definitionSetIndex + 1]];
        const definitionSet2 = definitionSets[definitionSetIndex + 2];
        if (definitionSet0.varSet.includes(definitionSet2.varSet))
        {
            for (const feature0 of definitionSet0)
            {
                if (definitions1.every(feature1 => feature1.includes(feature0)))
                {
                    for (const feature1 of definitions1)
                    {
                        // Iterating over a copy of the set to be modified.
                        for (const feature2 of [...definitionSet2])
                        {
                            if (feature2.includes(feature1))
                            {
                                const featureC = featureDifference(feature2, feature1);
                                const featuresABC =
                                getFeaturesABC(definitions1, definitionSet2, featureC);
                                if (featuresABC)
                                {
                                    const featureAC = Feature([feature0, featureC]);
                                    featuresABC.forEach(Set.prototype.delete.bind(definitionSet2));
                                    definitionSet2.add(featureAC);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

{
    const choose = require('./common/choose');

    const callback =
    predefName =>
    {
        const predefTestData = PREDEF_TEST_DATA_MAP_OBJ[predefName];
        if (!predefTestData)
            return `Unknown predefinitions ${predefName}.`;
        optimize(predefTestData);
    };
    const predefNames = Object.keys(PREDEF_TEST_DATA_MAP_OBJ);
    choose(callback, 'Predefinitions to optimize', predefNames);
}
