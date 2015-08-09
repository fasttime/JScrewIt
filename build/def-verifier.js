/* global module, require, self */

(function ()
{
    'use strict';
    
    function verifyDefinitions(entries, inputList, mismatchCallback)
    {
        function considerInput(input)
        {
            var solution = encoder.replaceString(input);
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
                var featureNames = analyzer.featureNames;
                var expectedDefinitions = Object.keys(optimalInputs).sort();
                mismatchCallback(featureNames, actualDefinition, expectedDefinitions);
            }
        }
    }
    
    var Analyzer;
    
    if (typeof self !== 'undefined')
    {
        Analyzer = self.Analyzer;
        self.verifyDefinitions = verifyDefinitions;
    }
    
    if (typeof module !== 'undefined')
    {
        Analyzer = require('./analyzer.js');
        module.exports = verifyDefinitions;
    }
}
)();
