/* global module, require, self */

(function ()
{
    'use strict';
    
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
        {
            inputList = getExprList(entries);
        }
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
    
    if (typeof self !== 'undefined')
    {
        Analyzer = self.Analyzer;
        JScrewIt = self.JScrewIt;
        self.define             = define;
        self.verifyDefinitions  = verifyDefinitions;
    }
    
    if (typeof module !== 'undefined')
    {
        Analyzer = require('./analyzer.js');
        JScrewIt = require('../lib/jscrewit.js');
        module.exports = { define: define, verifyDefinitions: verifyDefinitions };
    }
}
)();
