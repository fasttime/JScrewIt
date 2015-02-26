/*
global
FEATURE_INFOS,
Encoder,
availableFeatureMask,
getFeatureMask,
incompatibleFeatureMasks,
module,
self,
trimJS
*/

var JScrewIt;
var getValidFeatureMask;
var setUp;

(function ()
{
    'use strict';
    
    function areFeaturesAvailable(features)
    {
        var featureMask = getFeatureMask(features);
        return (featureMask & availableFeatureMask) === featureMask;
    }
    
    function areFeaturesCompatible(features)
    {
        var featureMask = getFeatureMask(features);
        var result = isFeatureMaskCompatible(featureMask);
        return result;
    }
    
    function encode(input, arg2, arg3)
    {
        var features;
        var wrapWithEval;
        if (typeof arg2 === 'object')
        {
            features = arg2.features;
            wrapWithEval = arg2.wrapWithEval;
            if (arg2.trimCode)
            {
                var trimmedInput = trimJS(input);
                // Note that trimJS returns an empty string if the input consists of only blanks
                // and comments.
                if (trimmedInput != null)
                {
                    input = trimmedInput;
                }
            }
        }
        else
        {
            features = arg3;
            wrapWithEval = arg2;
        }
        var encoder = getEncoder(features);
        var output = encoder.encode(input + '', wrapWithEval);
        return output;
    }
    
    function getEncoder(features)
    {
        var featureMask = getValidFeatureMask(features);
        var encoder = encoders[featureMask];
        if (!encoder)
        {
            encoders[featureMask] = encoder = new Encoder(featureMask);
        }
        return encoder;
    }
    
    function isFeatureMaskCompatible(featureMask)
    {
        var result =
            incompatibleFeatureMasks.every(
                function (incompatibleFeatureMask)
                {
                    var result =
                        (incompatibleFeatureMask & featureMask) !== incompatibleFeatureMask;
                    return result;
                }
            );
        return result;
    }
    
    var encoders = { };
    
    JScrewIt =
    {
        areFeaturesAvailable:   areFeaturesAvailable,
        areFeaturesCompatible:  areFeaturesCompatible,
        encode:                 encode,
        FEATURE_INFOS:          FEATURE_INFOS,
    };
    
    getValidFeatureMask =
        function (features)
        {
            var featureMask = getFeatureMask(features);
            if (!isFeatureMaskCompatible(featureMask))
            {
                throw new ReferenceError('Incompatible features');
            }
            return featureMask;
        };
    
    setUp =
        function (self)
        {
            if (self != null)
            {
                self.JSFuck = self.JScrewIt = JScrewIt;
            }
        };
    
    setUp(typeof self !== 'undefined' ? self : null);
    
    if (typeof module !== 'undefined')
    {
        module.exports = JScrewIt;
    }

})();
