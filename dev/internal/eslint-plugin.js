'use strict';

function compareFeatureNames(featureNames1, featureNames2)
{
    const length1 = featureNames1.length;
    const length2 = featureNames2.length;
    if (length1 !== length2) return NaN;
    for (let index = 0; index < length1; ++index)
    {
        const featureName1 = featureNames1[index];
        const featureName2 = featureNames2[index];
        if (featureName1 < featureName2) return -1;
        if (featureName1 > featureName2) return 1;
    }
    return 0;
}

module.exports =
{
    rules:
    {
        'sorted-definitions':
        {
            meta:
            {
                type:       'suggestion',
                docs:       { description: 'Enforce sorted definitions' },
                fixable:    'code',
                messages:
                {
                    'feature-count-mismatch':
                    'Definitions with {{featureCount}} features should appear before those with ' +
                    'more features.',
                    'feature-name-mismatch':
                    '{{featureCount}}-feature definitions should be sorted alphabetically.',
                },
            },
            create(context)
            {
                const listeners =
                {
                    'ObjectExpression>Property>ArrayExpression.value'(node)
                    {
                        let lastFeatureNames = [];
                        for (const element of node.elements)
                        {
                            if (element.type !== 'CallExpression') continue;
                            const { callee } = element;
                            if (callee.type === 'Identifier' && callee.name === 'define')
                            {
                                const featureArgs = element.arguments.slice(1);
                                const featureNames = [];
                                for (const arg of featureArgs)
                                {
                                    if (arg.type === 'Identifier')
                                    {
                                        const featureName = arg.name;
                                        if (typeof featureName === 'string')
                                            featureNames.push(featureName);
                                    }
                                }
                                featureNames.sort();
                                let lastFeatureName;
                                for (let index = featureNames.length; index > 0;)
                                {
                                    const featureName = featureNames[--index];
                                    if (featureName === lastFeatureName)
                                        featureNames.splice(index, 1);
                                    lastFeatureName = featureName;
                                }
                                const featureCount = featureNames.length;
                                if (featureCount < lastFeatureNames.length)
                                {
                                    context.report
                                    (
                                        {
                                            node:       element,
                                            messageId:  'feature-count-mismatch',
                                            data:       { featureCount },
                                        },
                                    );
                                    return;
                                }
                                if (compareFeatureNames(featureNames, lastFeatureNames) < 0)
                                {
                                    context.report
                                    (
                                        {
                                            node:       element,
                                            messageId:  'feature-name-mismatch',
                                            data:       { featureCount },
                                        },
                                    );
                                    return;
                                }
                                lastFeatureNames = featureNames;
                            }
                        }
                    },
                };
                return listeners;
            },
        },
    },
};
