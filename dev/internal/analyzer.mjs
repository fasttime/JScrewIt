/* ---------------------------------------------------------------------------------------------- *\

Feature analyzer: enumerates the feature combinations that are relevant to an encoding.

An `Analyzer` produces a sequence of encoders, each configured with a different feature combination,
through the `nextEncoder` getter or the iterator-like `next()` method.
Enumerating all possible feature combinations would be unfeasible; instead, the analyzer discovers
the relevant ones by observing which features an encoding actually queries.

The first encoder is created with an ancestor feature, by default `Feature.DEFAULT`.
Its `hasFeatures()` method is instrumented to record every group of features whose availability is
queried and not already implied by the features of the current encoder.
When the next encoder is requested, the analyzer backtracks to the most recent query that returned
false and creates a new encoder whose features additionally include the queried ones, so that the
same encoding can be repeated with those features available.
The result is a depth-first traversal of a tree of feature combinations, bifurcating at every group
of features explicitly queried with `Encoder#hasFeatures()`.

A branch is skipped when the features to be added are incompatible with the current ones, or when
they include a group of features that an earlier query in the same encoding found unavailable,
because such a combination is reached, if at all, by branching at that earlier query.

Callers are expected to perform the same encoding with every encoder returned by the analyzer, e.g.

```js
const analyzer = new Analyzer();
let encoder;
while (encoder = analyzer.nextEncoder)
{
    // Encode something with the encoder here.
    // `analyzer.featureObj` is the feature of the current encoder.
    // `analyzer.progress` estimates the fraction of the tree visited so far, from 0 to 1.
}
```

`stopCapture()` stops recording queries made through the current encoder, so that subsequent calls
to `hasFeatures()` do not create new branches.

After an encoding, `featureQueries` lists the queries recorded for the current encoder.
The queries that returned false delimit the feature combinations for which the encoding behaves as
it does with the current encoder: any combination that includes the current feature and none of
those queried groups.

`OptimizedAnalyzer` in `dev/internal/optimized-analyzer.mjs` extends this class to resolve
characters from a precomputed solution book in order to speed up the analysis.

\* ---------------------------------------------------------------------------------------------- */

import JScrewIt from '#jscrewit';

export default class Analyzer
{
    constructor(ancestorFeatureObj = JScrewIt.Feature.DEFAULT)
    {
        this.featureObj = ancestorFeatureObj;
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
        createInstrumentedEncoder(this.featureObj, featureQueries, this.ancestorMask);
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

function createInstrumentedEncoder(featureObj, featureQueries, ancestorMask)
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

const { MaskSet, createEncoder, featureFromMask, maskIncludes, maskUnion } = JScrewIt.debug;
