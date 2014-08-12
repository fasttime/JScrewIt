'use strict';

var exports = require('../jscrewit.js');
var TestSuite = require('./test_suite.js').TestSuite;
var fs = require('fs');

TestSuite.init(exports);
console.log('Available features: ' + TestSuite.getAvailableFeatures().join(', '));
TestSuite.run();

var file = fs.openSync('output.txt', 'w+');
var output =
    (
    function ()
    {
        try
        {
            global.atob =
                function (value)
                {
                    return new Buffer(value + '', 'base64').toString('binary');
                };
            global.btoa =
                function (value)
                {
                    return new Buffer(value + '', 'binary').toString('base64');
                };
            global.self =
                {
                    toString: function () { return '[object Window]'; }
                };
            var result =
                TestSuite.createOutput(['DEFAULT', 'COMPACT', 'NO_IE', 'FF31', 'IE11', 'NODE']);
            return result;
        }
        finally
        {
            delete global.atob;
            delete global.btoa;
            delete global.self;
        }
    }
    )();

fs.writeSync(file, output);
fs.closeSync(file);
