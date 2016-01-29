/* global module, require, self */

(function ()
{
    'use strict';
    
    function decomplex(encoder, complex)
    {
        encoder.stringTokenPattern = JScrewIt.debug.createEncoder().createStringTokenPattern();
        var str = encoder.replaceString(complex);
        return str;
    }
    
    function define(definition)
    {
        var features = Array.prototype.slice.call(arguments, 1);
        var featureMask = JScrewIt.Feature(features).mask;
        var entry = { definition: definition, featureMask: featureMask };
        return entry;
    }
    
    function getExprList(entries)
    {
        var exprSet = Object.create(null);
        entries.forEach(
            function (entry)
            {
                var definition = entry.definition;
                var type = typeof definition;
                var expr = type === 'object' ? definition.expr :  definition;
                exprSet[expr] = null;
            }
        );
        var exprList = Object.keys(exprSet).sort();
        return exprList;
    }
    
    function findOptimalFeatures(replacer)
    {
        var optimalFeatureObjMap;
        var optimalLength = Infinity;
        var analyzer = new Analyzer();
        var encoder;
        while (encoder = analyzer.nextEncoder)
        {
            var output = replacer(encoder);
            var length = output !== undefined ? output.length : NaN;
            if (length <= optimalLength)
            {
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
    
    function verifyComplex(complex, inputEntries, mismatchCallback)
    {
        var actualEntries = JScrewIt.debug.getComplexEntries(complex);
        var analyzer = new Analyzer();
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
    
    function verifyDefinitions(entries, inputList, mismatchCallback, replacerName)
    {
        function considerInput(input)
        {
            var solution = encoder[replacerName](input);
            var length = solution.length;
            if (length <= optimalLength)
            {
                if (length < optimalLength)
                {
                    optimalInputs = Object.create(null);
                    optimalLength = length;
                }
                optimalInputs[input] = true;
            }
        }
        
        if (!inputList)
            inputList = getExprList(entries);
        var analyzer = new Analyzer();
        var encoder;
        while (encoder = analyzer.nextEncoder)
        {
            var optimalInputs = null;
            var optimalLength = Infinity;
            inputList.forEach(considerInput);
            analyzer.stopCapture();
            var actualDefinition = encoder.findBestDefinition(entries);
            if (!optimalInputs[actualDefinition])
            {
                var featureNames = analyzer.featureObj.canonicalNames;
                var expectedDefinitions = Object.keys(optimalInputs).sort();
                mismatchCallback(featureNames, actualDefinition, expectedDefinitions);
            }
        }
    }
    
    var Analyzer;
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
        JScrewIt = require('../lib/jscrewit.js');
        module.exports = exports;
    }
}
)();
