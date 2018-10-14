/* global module, require, self */

'use strict';

(() =>
{
    let JScrewIt;

    class Analyzer
    {
        constructor()
        {
            this.featureObj = JScrewIt.Feature.DEFAULT;
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
            this.encoder = createModifiedEncoder(this.featureObj, featureQueries);
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

    function createModifiedEncoder(featureObj, featureQueries)
    {
        const maskSet = new Set();
        let ancestorMask = maskNew();
        const encoder = createEncoder(featureObj);
        encoder.hasFeatures =
        function (mask)
        {
            const included = maskIncludes(encoder.mask, mask);
            if (!maskIsEmpty(mask))
            {
                const key = getMaskKey(mask);
                if (!maskSet.has(key))
                {
                    maskSet.add(key);
                    const featureQuery = new FeatureQueryInfo(mask, included, ancestorMask);
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
        const key = String(mask);
        return key;
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
                    const featureObj = createFeatureFromMask(mask);
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
            }
        );
        progress += step;
        return progress;
    }

    function replaceStaticString(str, maxLength)
    {
        let replacement = staticStrCache[str];
        if (replacement)
        {
            if (!(replacement.length > maxLength))
                return replacement;
        }
        else
        {
            const options = { bond: true, forceString: true, maxLength };
            replacement = this.replaceString(str, options);
            if (replacement)
            {
                staticStrCache[str] = replacement;
                return replacement;
            }
        }
    }

    if (typeof self !== 'undefined')
    {
        ({ JScrewIt } = self);
        self.Analyzer = Analyzer;
    }

    if (typeof module !== 'undefined')
    {
        JScrewIt = require('..');
        module.exports = Analyzer;
    }

    const staticStrCache = { __proto__: null };

    const { createEncoder, createFeatureFromMask, maskIncludes, maskIsEmpty, maskNew, maskUnion } =
    JScrewIt.debug;
}
)();
