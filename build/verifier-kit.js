/* global module, require, self */

(function ()
{
    'use strict';
    
    function createAnalyzer()
    {
        var analyzer = new Analyzer();
        if (!CharMap)
            return analyzer;
        var fs = require('fs');
        var charMapJSON = fs.readFileSync(CharMap.FILE_NAME);
        var charMap = CharMap.parse(charMapJSON);
        var findKnownSolution = CharMap.findKnownSolution;
        var prepareEncoder = CharMap.prepareEncoder;
        var resolveCharacter =
            function (char)
            {
                var solutions = charMap[char];
                if (solutions)
                {
                    var solution = findKnownSolution(solutions, analyzer);
                    return solution;
                }
            };
        var newAnalyzer =
            Object.create(
                analyzer,
                {
                    nextEncoder:
                    {
                        get: function ()
                        {
                            var encoder = analyzer.nextEncoder;
                            if (encoder)
                                prepareEncoder(encoder, resolveCharacter);
                            return encoder;
                        }
                    }
                }
            );
        return newAnalyzer;
    }
    
    function createOptimalFeatureObjMap(replacer, rivalReplacer, progressCallback)
    {
        function callProgressCallback()
        {
            if (progressCallback)
                progressCallback(analyzer.progress);
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
                replacement = this.replaceString(str, true, true, maxLength);
                if (replacement)
                {
                    staticStrCache[str] = replacement;
                    return replacement;
                }
            }
        }
        
        var staticStrCache = Object.create(null);
        var optimalFeatureObjMap;
        var optimalLength = Infinity;
        var analyzer = createAnalyzer();
        callProgressCallback();
        var encoder;
        while (encoder = analyzer.nextEncoder)
        {
            encoder.replaceStaticString = replaceStaticString;
            var output = replacer(encoder);
            callProgressCallback();
            if (output === void 0)
                continue;
            var length = output.length;
            if (length <= optimalLength)
            {
                analyzer.stopCapture();
                var rivalOutput = rivalReplacer(encoder, length);
                if (rivalOutput !== void 0)
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
    
    function decomplex(encoder, complex)
    {
        encoder.complexCache[complex] = null;
        delete encoder.stringTokenPattern;
        var str = encoder.replaceString(complex);
        delete encoder.complexCache[complex];
        delete encoder.stringTokenPattern;
        return str;
    }
    
    function define(definition)
    {
        var features = Array.prototype.slice.call(arguments, 1);
        var mask = JScrewIt.Feature(features).mask;
        var entry = { definition: definition, mask: mask };
        return entry;
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
    
    function getOptimalityInfo(encoder, inputList, replacer)
    {
        function considerInput(entry)
        {
            var input; // definition or expression
            if (typeof entry === 'object')
            {
                if (!encoder.hasFeatures(entry.mask))
                    return;
                input = entry.definition;
            }
            else
                input = entry;
            var solution =
                typeof replacer === 'function' ?
                replacer.call(encoder, input) : encoder[replacer](input);
            var length = solution.length;
            if (length <= optimalLength)
            {
                if (length < optimalLength)
                {
                    optimalDefinitions = [];
                    optimalLength = length;
                }
                optimalDefinitions.push(String(input));
            }
            lengthMap[input] = length;
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
    
    function verifyComplex(complex, inputEntries, mismatchCallback)
    {
        function checkEntry(entry)
        {
            if (encoder.hasFeatures(entry.mask))
            {
                var definition = entry.definition;
                var solution = encoder.resolve(definition);
                var length = solution.length;
                if (length < optimalLength)
                {
                    optimalDefinition = definition;
                    optimalLength = length;
                }
            }
        }
        
        var actualEntries = JScrewIt.debug.getComplexEntries(complex);
        var analyzer = createAnalyzer();
        var encoder;
        while (encoder = analyzer.nextEncoder)
        {
            var optimalDefinition = null;
            var replacement = decomplex(encoder, complex);
            var optimalLength = replacement.length;
            inputEntries.forEach(checkEntry);
            var actualDefinition = encoder.findDefinition(actualEntries) || null;
            if (actualDefinition !== optimalDefinition)
            {
                var featureNames = analyzer.featureObj.canonicalNames;
                mismatchCallback(featureNames);
            }
        }
    }
    
    function verifyDefinitions(entries, inputList, mismatchCallback, replacer)
    {
        var mismatchCount = 0;
        var analyzer = createAnalyzer();
        var encoder;
        while (encoder = analyzer.nextEncoder)
        {
            var optimalityInfo = getOptimalityInfo(encoder, inputList, replacer);
            analyzer.stopCapture();
            var actualDefinition = encoder.findDefinition(entries);
            var lengthMap = optimalityInfo.lengthMap;
            var optimalLength = optimalityInfo.optimalLength;
            if (lengthMap[actualDefinition] > optimalLength)
            {
                var featureNames = analyzer.featureObj.canonicalNames;
                var optimalDefinitions = optimalityInfo.optimalDefinitions;
                optimalDefinitions.sort();
                mismatchCallback(
                    ++mismatchCount + '.',
                    featureNames,
                    String(actualDefinition),
                    '(' + lengthMap[actualDefinition] + ')',
                    optimalDefinitions,
                    '(' + optimalLength + ')'
                );
            }
        }
    }
    
    var Analyzer;
    var CharMap;
    var JScrewIt;
    var exports =
    {
        define:                 define,
        findOptimalFeatures:    findOptimalFeatures,
        verifyComplex:          verifyComplex,
        verifyDefinitions:      verifyDefinitions
    };
    if (typeof self !== 'undefined')
    {
        Analyzer = self.Analyzer;
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
        Analyzer = require('./analyzer');
        CharMap = require('./char-map');
        JScrewIt = require('../lib/jscrewit');
        module.exports = exports;
    }
}
)();
