/* global module, require, self */

'use strict';

(function ()
{
    var JScrewIt;

    function Analyzer()
    {
        this.featureObj = JScrewIt.Feature.DEFAULT;
    }

    function FeatureQueryInfo(mask, included, ancestorMask)
    {
        this.mask = mask;
        this.included = included;
        this.ancestorMask = ancestorMask;
    }

    function createModifiedEncoder(featureObj, featureQueries)
    {
        var maskSet = Object.create(null);
        var ancestorMask = maskNew();
        var encoder = createEncoder(featureObj);
        encoder.hasFeatures =
        function (mask)
        {
            var included = maskIncludes(encoder.mask, mask);
            if (!maskIsEmpty(mask))
            {
                var key = getMaskKey(mask);
                if (!maskSet[key])
                {
                    maskSet[key] = true;
                    var featureQuery = new FeatureQueryInfo(mask, included, ancestorMask);
                    featureQueries.push(featureQuery);
                }
            }
            if (included)
                ancestorMask = maskUnion(mask, ancestorMask);
            return included;
        };
        encoder.replaceStaticString = replaceStaticString;
        return encoder;
    }

    function getMaskKey(mask)
    {
        var key = mask + '';
        return key;
    }

    function getNewFeatureData(analyzer)
    {
        var featureQueries = analyzer.featureQueries;
        if (!featureQueries)
            return true;
        for (var featureQuery; featureQuery = featureQueries.pop();)
        {
            if (!featureQuery.included)
            {
                var mask = maskUnion(featureQuery.mask, featureQuery.ancestorMask);
                if (analyzer.doesNotExclude(mask))
                {
                    var featureObj = createFeatureFromMask(mask);
                    if (featureObj)
                    {
                        analyzer.featureObj = featureObj;
                        return true;
                    }
                }
            }
        }
    }

    function getProgress(featureQueries)
    {
        var step = 1;
        var progress = 0;
        featureQueries.some
        (
            function (featureQuery)
            {
                step /= 2;
                var newProgress = progress + step;
                if (newProgress === progress)
                    return true;
                if (featureQuery.included)
                    progress = newProgress;
            }
        );
        progress += step;
        return progress;
    }

    function replaceStaticString(str, maxLength)
    {
        var replacement = staticStrCache[str];
        if (replacement)
        {
            if (!(replacement.length > maxLength))
                return replacement;
        }
        else
        {
            var options = { bond: true, forceString: true, maxLength: maxLength };
            replacement = this.replaceString(str, options);
            if (replacement)
            {
                staticStrCache[str] = replacement;
                return replacement;
            }
        }
    }

    var staticStrCache = Object.create(null);

    Object.defineProperties
    (
        Analyzer.prototype,
        {
            doesNotExclude:
            {
                configurable: true,
                value: function (mask)
                {
                    var featureQueries = this.featureQueries;
                    for (var index = featureQueries.length; index--;)
                    {
                        var featureQuery = featureQueries[index];
                        if (!featureQuery.included && maskIncludes(mask, featureQuery.mask))
                            return false;
                    }
                    return true;
                },
            },
            next:
            {
                configurable: true,
                next: function ()
                {
                    var encoder = this.nextEncoder;
                    var result = encoder ? { value: encoder } : { done: true };
                    return result;
                },
            },
            nextEncoder:
            {
                configurable: true,
                get: function ()
                {
                    if (!getNewFeatureData(this))
                        return null;
                    var featureQueries = this.featureQueries = [];
                    var encoder =
                    this.encoder = createModifiedEncoder(this.featureObj, featureQueries);
                    return encoder;
                },
            },
            progress:
            {
                configurable: true,
                get: function ()
                {
                    var featureQueries = this.featureQueries;
                    var progress = featureQueries ? getProgress(featureQueries) : 0;
                    return progress;
                },
            },
            stopCapture:
            {
                configurable: true,
                value: function ()
                {
                    var encoder = this.encoder;
                    if (encoder)
                        delete encoder.hasFeatures;
                },
            },
        }
    );

    if (typeof self !== 'undefined')
    {
        JScrewIt = self.JScrewIt;
        self.Analyzer = Analyzer;
    }

    if (typeof module !== 'undefined')
    {
        JScrewIt = require('../..');
        module.exports = Analyzer;
    }

    var createEncoder = JScrewIt.debug.createEncoder;
    var createFeatureFromMask = JScrewIt.debug.createFeatureFromMask;
    var maskIncludes = JScrewIt.debug.maskIncludes;
    var maskIsEmpty = JScrewIt.debug.maskIsEmpty;
    var maskNew = JScrewIt.debug.maskNew;
    var maskUnion = JScrewIt.debug.maskUnion;
}
)();
