/* global EMU_FEATURES, module, require, self */

(function ()
{
    'use strict';
    
    function listFeatures(callback, label, list)
    {
        var count = list.length;
        if (count)
            callback(label + ' ' + (count === 1 ? 'feature' : 'features') + ': ', list);
    }
    
    function showFeatureSupport(callback)
    {
        listFeatures(callback, 'Characteristic', characteristicList);
        listFeatures(callback, 'Compatible', compatibleList);
        listFeatures(callback, 'Available', availableList);
        listFeatures(callback, 'Emulated', emuList);
    }
    
    var availableList;
    var characteristicList;
    var compatibleList;
    var emuList;
    
    (function ()
    {
        var JScrewIt;
        
        if (typeof self !== 'undefined')
        {
            JScrewIt = self.JScrewIt;
            self.showFeatureSupport = showFeatureSupport;
        }
        if (typeof module !== 'undefined')
        {
            JScrewIt = require('../lib/jscrewit.js');
            require('./feature-emulation-helpers.js');
            module.exports = showFeatureSupport;
        }
        var Feature = JScrewIt.Feature;
        var ALL = Feature.ALL;
        var AUTO = Feature.AUTO;
        var COMPACT = Feature.COMPACT;
        var DEFAULT = Feature.DEFAULT;
        availableList = AUTO.elementaryNames;
        characteristicList = [];
        compatibleList = [];
        emuList =
            EMU_FEATURES.filter(
                function (featureName)
                {
                    var result = !AUTO.includes(featureName);
                    return result;
                }
            );
        for (var featureName in ALL)
        {
            var featureObj = ALL[featureName];
            if (
                featureObj.name === featureName &&
                !featureObj.check &&
                featureObj !== AUTO &&
                featureObj !== COMPACT)
            {
                if (Feature.areEqual(featureObj, AUTO))
                    characteristicList.push(featureName);
                else if (featureObj !== DEFAULT && AUTO.includes(featureObj))
                    compatibleList.push(featureName);
            }
        }
        characteristicList.sort();
        compatibleList.sort();
    }
    )();
}
)();
