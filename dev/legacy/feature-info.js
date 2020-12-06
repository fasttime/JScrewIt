#!/usr/bin/env node

/* eslint-env node */

'use strict';

var featureInfo = require('../../test/feature-info');

var output = '\n';
var anyMarked;
var forcedStrictModeFeatureObj = featureInfo.forcedStrictModeFeatureObj;
featureInfo.showFeatureSupport
(
    function (label, featureNames, isCategoryMarked)
    {
        function formatFeatureName(featureName)
        {
            var marked =
            isCategoryMarked(featureName, 'forced-strict-mode', forcedStrictModeFeatureObj);
            if (marked)
                featureName += '¹';
            anyMarked |= marked;
            return featureName;
        }

        var boldLabel = '\x1b[1m' + label + '\x1b[0m';
        output += boldLabel + featureNames.map(formatFeatureName).join(', ') + '\n';
    }
);
if (anyMarked)
    output += '(¹) Feature excluded when strict mode is enforced.\n';
output += '\n';
process.stdout.write(output);
