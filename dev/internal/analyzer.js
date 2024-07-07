/* global self */

'use strict';

(() =>
{
    let JScrewIt;

    class Analyzer
    {
        constructor(ancestorFeatureObj = JScrewIt.Feature.DEFAULT)
        {
            this.featureObj = ancestorFeatureObj;
            this.staticStrCache = new Map();
            this.ancestorMask = ancestorFeatureObj.mask;
        }

        doesNotExclude(mask)
        {
            const { featureQueries } = this;
            for (let index = featureQueries.length; index--;)
            {
                const featureQuery = featureQueries[index];
                if (!featureQuery.included && maskIncludes(mask, featureQuery.mask))
                    return false;
            }
            return true;
        }

        next()
        {
            const encoder = this.nextEncoder;
            const result = encoder ? { value: encoder } : { done: true };
            return result;
        }

        get nextEncoder()
        {
            if (!getNewFeatureData(this))
                return null;
            const featureQueries = this.featureQueries = [];
            const encoder =
            this.encoder =
            createModifiedEncoder
            (this.featureObj, featureQueries, this.staticStrCache, this.ancestorMask);
            return encoder;
        }

        get progress()
        {
            const { featureQueries } = this;
            const progress = featureQueries ? getProgress(featureQueries) : 0;
            return progress;
        }

        stopCapture()
        {
            const { encoder } = this;
            if (encoder)
                delete encoder.hasFeatures;
        }
    }

    function FeatureQueryInfo(mask, included, ancestorMask)
    {
        this.mask = mask;
        this.included = included;
        this.ancestorMask = ancestorMask;
    }

    function createModifiedEncoder
    (featureObj, featureQueries, staticStrCache, ancestorMask)
    {
        const encoder = createEncoder(featureObj);
        {
            const maskSet = new MaskSet();
            encoder.hasFeatures =
            function (mask)
            {
                const included = maskIncludes(encoder.mask, mask);
                if (!maskIncludes(ancestorMask, mask))
                {
                    if (!maskSet.has(mask))
                    {
                        maskSet.add(mask);
                        const featureQuery = new FeatureQueryInfo(mask, included, ancestorMask);
                        featureQueries.push(featureQuery);
                    }
                }
                if (included)
                    ancestorMask = maskUnion(mask, ancestorMask);
                return included;
            };
        }
        {
            const { replaceJoinedArrayString } = encoder;
            encoder.replaceJoinedArrayString =
            function (str, maxLength)
            {
                let replacement = staticStrCache.get(str);
                if (replacement)
                {
                    if (!(replacement.length > maxLength))
                        return replacement;
                }
                else
                {
                    replacement = replaceJoinedArrayString.call(this, str, maxLength);
                    if (replacement)
                    {
                        staticStrCache.set(str, replacement);
                        return replacement;
                    }
                }
            };
        }
        return encoder;
    }

    function getNewFeatureData(analyzer)
    {
        const { featureQueries } = analyzer;
        if (!featureQueries)
            return true;
        for (let featureQuery; featureQuery = featureQueries.pop();)
        {
            if (!featureQuery.included)
            {
                const mask = maskUnion(featureQuery.mask, featureQuery.ancestorMask);
                if (analyzer.doesNotExclude(mask))
                {
                    const featureObj = featureFromMask(mask);
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
        let step = 1;
        let progress = 0;
        featureQueries.some
        (
            featureQuery =>
            {
                step /= 2;
                const newProgress = progress + step;
                if (newProgress === progress)
                    return true;
                if (featureQuery.included)
                    progress = newProgress;
            },
        );
        progress += step;
        return progress;
    }

    if (typeof self !== 'undefined')
    {
        ({ JScrewIt } = self);
        self.Analyzer = Analyzer;
    }

    if (typeof module !== 'undefined')
    {
        JScrewIt = require('../..');
        module.exports = Analyzer;
    }

    const { MaskSet, createEncoder, featureFromMask, maskIncludes, maskUnion } = JScrewIt.debug;
}
)();
