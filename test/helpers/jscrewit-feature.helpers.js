/* eslint-env ebdd/ebdd */
/* global EMU_FEATURES, global, require, self */

'use strict';

(function (global)
{
    function emuItWhen(condition)
    {
        function emuIt(description, featureObj, fn)
        {
            var conditionalIt = condition ? it : it.when;
            var test = conditionalIt(description, fn);
            var emuFeatureNames = getEmuFeatureNames(featureObj);
            if (!emuFeatureNames)
            {
                test.fn = null;
                test.pending = true;
            }
            else
                test.emuFeatureNames = emuFeatureNames;
            return test;
        }

        return emuIt;
    }

    function getEmuFeatureNames(featureObj)
    {
        init();
        if
        (
            !featureObj.elementaryNames.every
            (
                function (featureName)
                {
                    var supportable = featureName in featureSet;
                    return supportable;
                }
            )
        )
            return; // There are unsupportable features.
        var emuFeatureNames =
        EMU_FEATURES.filter
        (
            function (featureName)
            {
                var emulated = featureSet[featureName] && featureObj.includes(featureName);
                return emulated;
            }
        );
        return emuFeatureNames;
    }

    function init()
    {
        if (featureSet)
            return;
        var JScrewIt = typeof module !== 'undefined' ? require('../..') : self.JScrewIt;
        featureSet = Object.create(null);
        EMU_FEATURES.forEach
        (
            function (featureName)
            {
                featureSet[featureName] = true;
            }
        );
        JScrewIt.Feature.AUTO.elementaryNames.forEach
        (
            function (featureName)
            {
                featureSet[featureName] = false;
            }
        );
    }

    var featureSet;

    var emuIt = emuItWhen(true);
    emuIt.when = emuItWhen;
    global.emuIt                = emuIt;
    global.getEmuFeatureNames   = getEmuFeatureNames;
}
)(typeof self === 'undefined' ? global : self);
