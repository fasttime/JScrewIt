/* global EMU_FEATURES, module, require, self */

'use strict';

(function (root)
{
    function isAvailableMarked(featureName, environment, environmentFeatureObj)
    {
        var featureObj = Feature[featureName];
        var restricted = !environmentFeatureObj.includes(featureObj);
        return restricted;
    }

    function isCharacteristicMarked(featureName, environment, environmentFeatureObj)
    {
        var featureObj = Feature[featureName];
        var restrictedFeatureObj = Feature.AUTO.restrict(environment, [featureObj]);
        var restricted = !environmentFeatureObj.includes(restrictedFeatureObj);
        return restricted;
    }

    function isCompatibleMarked(featureName, environment, environmentFeatureObj)
    {
        var featureObj = Feature[featureName];
        var restrictedFeatureObj = Feature.AUTO.restrict(environment, [featureObj]);
        var restricted = !environmentFeatureObj.includes(restrictedFeatureObj);
        return restricted;
    }

    function isEmuMarked()
    {
        return false;
    }

    function listFeatures(callback, label, featureNames, isCategoryMarked)
    {
        var count = featureNames.length;
        if (count)
        {
            callback
            (
                label + ' ' + (count === 1 ? 'feature' : 'features') + ': ',
                featureNames,
                isCategoryMarked
            );
        }
    }

    function showFeatureSupport(callback)
    {
        listFeatures(callback, 'Characteristic', characteristicList, isCharacteristicMarked);
        listFeatures(callback, 'Compatible', compatibleList, isCompatibleMarked);
        listFeatures(callback, 'Available', availableList, isAvailableMarked);
        listFeatures(callback, 'Emulated', emuList, isEmuMarked);
    }

    var Feature;

    var availableList;
    var characteristicList;
    var compatibleList;
    var emuList;

    (function ()
    {
        function getForcedStrictModeFeatureObj()
        {
            var forcedStrictModeFeatureObj;
            if (testCharIncrement())
                forcedStrictModeFeatureObj = AUTO;
            else
            {
                var forcedStrictModeFeatureNames =
                AUTO.elementaryNames.filter
                (
                    function (featureName)
                    {
                        var result = featureName !== 'INCR_CHAR';
                        return result;
                    }
                );
                forcedStrictModeFeatureObj = Feature(forcedStrictModeFeatureNames);
            }
            return forcedStrictModeFeatureObj;
        }

        function testCharIncrement()
        {
            try
            {
                ++'.'[0];
            }
            catch (error)
            {
                return false;
            }
            return true;
        }

        var JScrewIt;
        if (typeof self !== 'undefined')
            JScrewIt = self.JScrewIt;
        if (typeof module !== 'undefined')
        {
            JScrewIt = require('..');
            require('./helpers/feature-emulation.helpers');
        }
        Feature = JScrewIt.Feature;
        var ENGINE = Feature.ENGINE;
        var AUTO = Feature.AUTO;
        root.forcedStrictModeFeatureObj = getForcedStrictModeFeatureObj();
        root.showFeatureSupport = showFeatureSupport;
        availableList = AUTO.elementaryNames;
        characteristicList = [];
        compatibleList = [];
        emuList =
        EMU_FEATURES.filter
        (
            function (featureName)
            {
                var result = !AUTO.includes(featureName);
                return result;
            }
        );
        ENGINE.forEach
        (
            function (featureObj)
            {
                if (Feature.areEqual(AUTO, featureObj))
                    characteristicList.push(featureObj.name);
                else if (AUTO.includes(featureObj))
                    compatibleList.push(featureObj.name);
            }
        );
        characteristicList.sort();
        compatibleList.sort();
    }
    )();
}
)(this);
