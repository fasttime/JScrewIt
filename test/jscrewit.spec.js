/* eslint-env node */

'use strict';

var JScrewIt = require('../lib/jscrewit');
require('expectations');
require('../tools/text-utils');
require('./feature-emulation-helpers');
require('./matcher-helpers');
var TestSuite = require('./test-suite');

TestSuite.init(JScrewIt);
