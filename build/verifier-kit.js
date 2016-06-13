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
    
    function decomplex(encoder, complex)
    {
        encoder.stringTokenPattern = JScrewIt.debug.createEncoder().createStringTokenPattern();
        var str = encoder.replaceString(complex);
        return str;
    }
    
    function define(definition)
    {
        var features = Array.prototype.slice.call(arguments, 1);
        var mask = JScrewIt.Feature(features).mask;
        var entry = { definition: definition, mask: mask };
        return entry;
    }
    
    function findOptimalFeatures(replacer, rivalReplacer)
    {
        var optimalFeatureObjMap;
        var optimalLength = Infinity;
        var analyzer = createAnalyzer();
        var encoder;
        while (encoder = analyzer.nextEncoder)
        {
            var output = replacer(encoder);
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
        if (optimalFeatureObjMap)
        {
            var result =
                Object.keys(optimalFeatureObjMap).map(
                    function (output)
                    {
                        var optimalFeatureObjs = optimalFeatureObjMap[output];
                        var featureObj = optimalFeatureObjs.reduce(
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
        var actualEntries = JScrewIt.debug.getComplexEntries(complex);
        var analyzer = createAnalyzer();
        var encoder;
        while (encoder = analyzer.nextEncoder)
        {
            var definition = encoder.findBestDefinition(actualEntries);
            var solution;
            var replacement;
            var featureNames;
            if (definition)
            {
                solution = encoder.resolve(definition);
                replacement = decomplex(encoder, complex);
                if (solution.length > replacement.length)
                {
                    featureNames = analyzer.featureObj.canonicalNames;
                    mismatchCallback(featureNames);
                }
            }
            else
            {
                definition = encoder.findBestDefinition(inputEntries);
                if (definition)
                {
                    solution = encoder.resolve(definition);
                    replacement = decomplex(encoder, complex);
                    if (solution.length < replacement.length)
                    {
                        featureNames = analyzer.featureObj.canonicalNames;
                        mismatchCallback(featureNames);
                    }
                }
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
            var actualDefinition = encoder.findBestDefinition(entries);
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
        Analyzer = require('./analyzer.js');
        CharMap = require('./char-map.js');
        JScrewIt = require('../lib/jscrewit.js');
        module.exports = exports;
    }
}
)();
