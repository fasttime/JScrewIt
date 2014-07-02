'use strict';

var exports = require('../jscrewit.js');
var TestSuite = require('./test_suite.js').TestSuite;
var fs = require('fs');

TestSuite.init(exports);
TestSuite.run();

var file = fs.openSync('output.txt', 'w+');
var output = TestSuite.createOutput();
fs.writeSync(file, output);
fs.closeSync(file);
