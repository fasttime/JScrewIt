'use strict';

var JScrewIt = require('../jscrewit.js');
var TestSuite = require('./test_suite.js');
var fs = require('fs');

TestSuite.init(JScrewIt);
console.log('Available features: ' + TestSuite.getAvailableFeatures().join(', '));
TestSuite.run();

var output = TestSuite.createOutput(['DEFAULT', 'COMPACT', 'NO_IE', 'FF31', 'IE11', 'NODE']);
fs.writeFile('output.txt', output);
