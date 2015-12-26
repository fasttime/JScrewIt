/* jshint node: true */

'use strict';

var JScrewIt = require('../lib/jscrewit.js');
require('expectations');
require('./coder-test-helpers.js');
require('./feature-emulation-helpers.js');
require('./matcher-helpers.js');
require('../tools/text-utils.js');
var TestSuite = require('./test-suite.js');

TestSuite.init(JScrewIt);
