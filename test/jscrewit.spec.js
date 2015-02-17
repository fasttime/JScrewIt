/* jshint node: true */

'use strict';

function listFeatures(label, features)
{
    if (features)
    {
        console.log(label + features.join(', '));
    }
}

var JScrewIt = require('../lib/jscrewit.js');
require('expectations');
require('./feature_emulation_helpers.js');
require('./matcher_helpers.js');
var TestSuite = require('./test_suite.js');
var fs = require('fs');

TestSuite.init(JScrewIt);

listFeatures('Available features: ', TestSuite.listFeatures(true));
listFeatures('Emulated features: ', TestSuite.listFeatures(false));

var output = TestSuite.createOutput(['DEFAULT', 'COMPACT', 'NO_IE', 'FF31', 'IE11', 'NODE']);
fs.writeFile('output.txt', output);
