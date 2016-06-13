/* eslint-env node */

'use strict';

var JScrewIt = require('../lib/jscrewit.js');
require('expectations');
require('../tools/text-utils.js');
require('./feature-emulation-helpers.js');
require('./matcher-helpers.js');
var TestSuite = require('./test-suite.js');

TestSuite.init(JScrewIt);
