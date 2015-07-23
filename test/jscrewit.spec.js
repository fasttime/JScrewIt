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
require('./feature-emulation-helpers.js');
require('./matcher-helpers.js');
require('../tools/text-utils.js');
var TestSuite = require('./test-suite.js');

TestSuite.init(JScrewIt);

listFeatures('Available features: ', TestSuite.listFeatures(true));
listFeatures('Emulated features: ', TestSuite.listFeatures(false));
