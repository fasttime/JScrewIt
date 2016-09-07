/* global module, require, self */

(function ()
{
    'use strict';
    
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
        featureQueries.forEach(
            function (featureQuery)
            {
                step /= 2;
                if (featureQuery.included)
                    progress += step;
            }
        );
        progress += step;
        return progress;
    }
    
    Object.defineProperties(
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
                }
            },
            nextEncoder:
            {
                configurable: true,
                get: function ()
                {
                    if (!getNewFeatureData(this))
                        return null;
                    var featureQueries = this.featureQueries = [];
                    var encoder = this.encoder =
                        createModifiedEncoder(this.featureObj, featureQueries);
                    return encoder;
                }
            },
            progress:
            {
                configurable: true,
                get: function ()
                {
                    var featureQueries = this.featureQueries;
                    var progress = featureQueries ? getProgress(featureQueries) : 0;
                    return progress;
                }
            },
            stopCapture:
            {
                configurable: true,
                value: function ()
                {
                    var encoder = this.encoder;
                    if (encoder)
                        delete encoder.hasFeatures;
                }
            }
        }
    );
    
    if (typeof self !== 'undefined')
    {
        JScrewIt = self.JScrewIt;
        self.Analyzer = Analyzer;
    }
    
    if (typeof module !== 'undefined')
    {
        JScrewIt = require('../lib/jscrewit');
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
