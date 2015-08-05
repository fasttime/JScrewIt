/*
global
FEATURE_INFOS,
Empty,
Encoder,
Feature,
assignNoEnum,
availableFeatureMask,
featuresFromMask,
getFeatureMask,
isFeatureMaskCompatible,
module,
self,
trimJS,
validateFeatureMask,
validMaskFromArrayOrStringOrFeature
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
    
    function commonFeaturesOf()
    {
        if (arguments.length)
        {
            var featureMask = ~0;
            Array.prototype.forEach.call(
                arguments,
                function (arg)
                {
                    featureMask &= validMaskFromArrayOrStringOrFeature(arg);
                }
            );
            var result = featuresFromMask(featureMask);
            return result;
        }
    }
    
    function encode(input, arg2, arg3)
    {
        var features;
        var wrapWith;
        var perfInfo;
        if (typeof arg2 === 'object')
        {
            features = arg2.features;
            wrapWith = filterWrapWith(arg2.wrapWith);
            if (arg2.trimCode)
            {
                input = trimJS(input);
            }
            perfInfo = arg2.perfInfo;
        }
        else
        {
            features = arg3;
            wrapWith = arg2 ? 'call' : 'none';
        }
        var encoder = getEncoder(features);
        var codingLog = encoder.codingLog = [];
        var output = encoder.encode(input + '', wrapWith);
        if (perfInfo)
        {
            perfInfo.codingLog = codingLog;
        }
        delete encoder.codingLog;
        return output;
    }
    
    function filterWrapWith(wrapWith)
    {
        if (wrapWith === undefined)
        {
            return 'none';
        }
        switch (wrapWith += '')
        {
        case 'none':
        case 'call':
        case 'eval':
            return wrapWith;
        }
        throw new Error('Invalid value for option wrapWith');
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
    
    var encoders = new Empty();
    
    JScrewIt =
        assignNoEnum(
            { },
            {
                FEATURE_INFOS:          FEATURE_INFOS,
                Feature:                Feature,
                areFeaturesAvailable:   areFeaturesAvailable,
                areFeaturesCompatible:  areFeaturesCompatible,
                commonFeaturesOf:       commonFeaturesOf,
                encode:                 encode,
            }
        );
    
    getValidFeatureMask =
        function (features)
        {
            var featureMask = getFeatureMask(features);
            validateFeatureMask(featureMask);
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
    
    setUp(typeof self !== 'undefined' ? /* istanbul ignore next */ self : null);
    
    // istanbul ignore else
    if (typeof module !== 'undefined')
    {
        module.exports = JScrewIt;
    }
}
)();
