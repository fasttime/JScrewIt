#!/usr/bin/env node

import featureInfo from '../test/feature-info.js';

let output = '\n';
let anyMarked;
const { forcedStrictModeFeatureObj } = featureInfo;
featureInfo.showFeatureSupport
(
    (label, featureNames, isCategoryMarked) =>
    {
        function formatFeatureName(featureName)
        {
            const marked =
            isCategoryMarked(featureName, 'forced-strict-mode', forcedStrictModeFeatureObj);
            if (marked)
                featureName += '¹';
            anyMarked |= marked;
            return featureName;
        }

        const boldLabel = `\x1b[1m${label}\x1b[0m`;
        output += `${boldLabel}${featureNames.map(formatFeatureName).join(', ')}\n`;
    },
);
if (anyMarked)
    output += '(¹) Feature excluded when strict mode is enforced.\n';
output += '\n';
process.stdout.write(output);
