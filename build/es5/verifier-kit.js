/* global module, require, self */

(function ()
{
    'use strict';

    function createAnalyzer()
    {
        require('../solution-book-map').load();
        var Analyzer = require('../optimized-analyzer');

        var analyzer = new Analyzer();
        return analyzer;
    }

    function createOptimalFeatureObjMap(replacer, rivalReplacer, progressCallback)
    {
        function callProgressCallback()
        {
            if (progressCallback)
                progressCallback(analyzer.progress);
        }

        var optimalFeatureObjMap;
        var optimalLength = Infinity;
        var analyzer = createAnalyzer();
        callProgressCallback();
        var encoder;
        while (encoder = analyzer.nextEncoder)
        {
            var output = replacer(encoder);
            callProgressCallback();
            if (output === undefined)
                continue;
            var length = output.length;
            if (length <= optimalLength)
            {
                analyzer.stopCapture();
                var rivalOutput = rivalReplacer(encoder, length);
                if (rivalOutput !== undefined)
                    continue;
                if (length < optimalLength)
                {
                    optimalFeatureObjMap = Object.create(null);
                    optimalLength = length;
                }
                var optimalFeatureObjs =
                    optimalFeatureObjMap[output] || (optimalFeatureObjMap[output] = []);
                optimalFeatureObjs.push(analyzer.featureObj);
            }
        }
        callProgressCallback();
        return optimalFeatureObjMap;
    }

    function findOptimalFeatures(replacer, rivalReplacer, progressCallback)
    {
        var optimalFeatureObjMap =
            createOptimalFeatureObjMap(replacer, rivalReplacer, progressCallback);
        if (optimalFeatureObjMap)
        {
            var result =
                Object.keys(optimalFeatureObjMap).map(
                    function (output)
                    {
                        var optimalFeatureObjs = optimalFeatureObjMap[output];
                        var featureObj =
                            optimalFeatureObjs.reduce(
                                function (previousFeatureObj, currentFeatureObj)
                                {
                                    var nextFeatureObj =
                                        JScrewIt.Feature.commonOf(
                                            previousFeatureObj,
                                            currentFeatureObj
                                        );
                                    return nextFeatureObj;
                                }
                            );
                        return featureObj;
                    }
                );
            return result;
        }
    }

    function getOptimalityInfo(encoder, inputList, replaceVariant)
    {
        function considerInput(entry)
        {
            if (!encoder.hasFeatures(entry.mask))
                return;
            var definition = entry.definition;
            var solution = replaceVariant(encoder, definition);
            var length = solution.length;
            if (length <= optimalLength)
            {
                if (length < optimalLength)
                {
                    optimalDefinitions = [];
                    optimalLength = length;
                }
                optimalDefinitions.push(definition);
            }
            lengthMap[definition] = length;
        }

        var optimalDefinitions;
        var lengthMap = Object.create(null);
        var optimalLength = Infinity;
        inputList.forEach(considerInput);
        var optimalityInfo =
        {
            optimalDefinitions: optimalDefinitions,
            optimalLength: optimalLength,
            lengthMap: lengthMap
        };
        return optimalityInfo;
    }

    function verifyComplex(complex, entry)
    {
        var encoder;
        var analyzer = createAnalyzer();
        var entryMask = entry.mask;
        var definition = entry.definition;
        while (encoder = analyzer.nextEncoder)
        {
            if (encoder.hasFeatures(entryMask))
            {
                var complexSolution = encoder.resolve(definition);
                var options = { bond: true, optimize: { toStringOpt: true } };
                var replacement = encoder.replaceString(complex, options);
                if (complexSolution.length < replacement.length)
                    return true;
            }
        }
        return false;
    }

    function verifyDefinitions(entries, inputList, mismatchCallback, replaceVariant, formatVariant)
    {
        var mismatchCount = 0;
        var analyzer = createAnalyzer();
        var encoder;
        if (formatVariant == null)
            formatVariant = String;
        while (encoder = analyzer.nextEncoder)
        {
            var optimalityInfo = getOptimalityInfo(encoder, inputList, replaceVariant);
            analyzer.stopCapture();
            var lengthMap = optimalityInfo.lengthMap;
            var actualDefinition = encoder.findDefinition(entries);
            var actualLength = lengthMap[actualDefinition];
            if (actualLength == null)
                throw Error('No available definition matches');
            var optimalLength = optimalityInfo.optimalLength;
            if (lengthMap[actualDefinition] > optimalLength)
            {
                var featureNames = analyzer.featureObj.canonicalNames;
                var optimalDefinitions = optimalityInfo.optimalDefinitions;
                optimalDefinitions.sort();
                mismatchCallback(
                    ++mismatchCount + '.',
                    featureNames,
                    formatVariant(actualDefinition),
                    '(' + lengthMap[actualDefinition] + ')',
                    optimalDefinitions.map(formatVariant),
                    '(' + optimalLength + ')'
                );
            }
        }
    }

    var JScrewIt;
    var exports =
    {
        findOptimalFeatures:    findOptimalFeatures,
        verifyComplex:          verifyComplex,
        verifyDefinitions:      verifyDefinitions
    };
    if (typeof self !== 'undefined')
    {
        JScrewIt = self.JScrewIt;
        Object.keys(exports).forEach(
            function (propName)
            {
                self[propName] = exports[propName];
            }
        );
    }
    if (typeof module !== 'undefined')
    {
        JScrewIt = require('../..');
        module.exports = exports;
    }
}
)();
