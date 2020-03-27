/* eslint-env mocha */
/* global EMU_FEATURES, global, maybeIt, require, self */

'use strict';

(function (global)
{
    function emuIt(description, featureObj, fn)
    {
        var emuFeatures = getEmuFeatureNames(featureObj);
        maybeIt
        (
            emuFeatures,
            description,
            function ()
            {
                fn.call(this, emuFeatures);
            }
        );
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

    global.emuIt                = emuIt;
    global.getEmuFeatureNames   = getEmuFeatureNames;
}
)(typeof self === 'undefined' ? global : self);
