/*
global
FEATURE_INFOS,
Encoder,
availableFeatureMask,
getFeatureMask,
getFeatures,
incompatibleFeatureMasks,
module,
self,
trimJS
*/

var JScrewIt;
var describeNoEnum;
var getValidFeatureMask;
var noEnum;
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
                function (features)
                {
                    featureMask &= getFeatureMask(features);
                }
            );
            var result = getFeatures(featureMask);
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
    
    describeNoEnum =
        function (value)
        {
            var descriptor = { configurable: true, value: value, writable: true };
            return descriptor;
        };
    
    noEnum =
        function (obj)
        {
            var result = { };
            Object.keys(obj).forEach(
                function (name)
                {
                    var descriptor = describeNoEnum(obj[name]);
                    Object.defineProperty(result, name, descriptor);
                }
            );
            return result;
        };
    
    JScrewIt = noEnum
    ({
        areFeaturesAvailable:   areFeaturesAvailable,
        areFeaturesCompatible:  areFeaturesCompatible,
        commonFeaturesOf:       commonFeaturesOf,
        encode:                 encode,
        FEATURE_INFOS:          FEATURE_INFOS,
    });
    
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
    
    setUp(typeof self !== 'undefined' ? /* istanbul ignore next */ self : null);
    
    // istanbul ignore else
    if (typeof module !== 'undefined')
    {
        module.exports = JScrewIt;
    }

})();
