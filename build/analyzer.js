/* global module, require, self */

(function ()
{
    'use strict';
    
    function FeatureQueryInfo(featureMask, included, ancestorFeatureMask)
    {
        this.featureMask = featureMask;
        this.included = included;
        this.ancestorFeatureMask = ancestorFeatureMask;
    }
    
    function createModifiedEncoder(featureNames, featureQueries)
    {
        function hasFeatures(featureMask)
        {
            var included = (featureMask & this.featureMask) === featureMask;
            if (featureMask)
            {
                if (!featureMaskSet[featureMask])
                {
                    featureMaskSet[featureMask] = true;
                    var featureQuery =
                        new FeatureQueryInfo(featureMask, included, ancestorFeatureMask);
                    featureQueries.push(featureQuery);
                }
            }
            if (included)
            {
                ancestorFeatureMask |= featureMask;
            }
            return included;
        }
        
        var featureMaskSet = Object.create(null);
        var ancestorFeatureMask = 0;
        var encoder = JScrewIt.debug.createEncoder(featureNames);
        encoder.hasFeatures = hasFeatures;
        return encoder;
    }
    
    function getNewFeatureData(analyzer)
    {
        var featureQueries = analyzer.featureQueries;
        if (!featureQueries)
        {
            return true;
        }
        for (var index = featureQueries.length; index--;)
        {
            var featureQuery = featureQueries[index];
            if (!featureQuery.included)
            {
                var featureMask = featureQuery.featureMask | featureQuery.ancestorFeatureMask;
                if (isIndependentFeatureMask(featureQueries, index, featureMask))
                {
                    var featureNames = JScrewIt.debug.featureFromMask(featureMask).canonicalNames;
                    if (JScrewIt.Feature.areCompatible(featureNames))
                    {
                        analyzer.featureNames = featureNames;
                        analyzer.featureMask = featureMask;
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
                {
                    progress += step;
                }
            }
        );
        progress += step;
        return progress;
    }
    
    function isIndependentFeatureMask(featureQueries, index, newFeatureMask)
    {
        while (index--)
        {
            var featureQuery = featureQueries[index];
            if (!featureQuery.included)
            {
                var featureMask = featureQuery.featureMask;
                if ((featureMask & newFeatureMask) === featureMask)
                {
                    return false;
                }
            }
        }
        return true;
    }
    
    function Analyzer()
    {
        this.featureNames = [];
        this.featureMask = 0;
    }
    
    var JScrewIt;
    
    Object.defineProperties(
        Analyzer.prototype,
        {
            'nextEncoder':
            {
                configurable: true,
                get: function ()
                {
                    if (!getNewFeatureData(this))
                    {
                        return null;
                    }
                    var featureQueries = this.featureQueries = [];
                    var encoder = this.encoder =
                        createModifiedEncoder(this.featureNames, featureQueries);
                    return encoder;
                }
            },
            'progress':
            {
                configurable: true,
                get: function ()
                {
                    var featureQueries = this.featureQueries;
                    var progress = featureQueries ? getProgress(featureQueries) : 0;
                    return progress;
                }
            },
            'stopCapture':
            {
                configurable: true,
                value: function ()
                {
                    var encoder = this.encoder;
                    if (encoder)
                    {
                        delete encoder.hasFeatures;
                    }
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
        JScrewIt = require('../lib/jscrewit.js');
        module.exports = Analyzer;
    }
}
)();
