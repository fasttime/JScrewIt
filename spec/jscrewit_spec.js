'use strict';

var JScrewIt = require('../jscrewit.js');
var TestSuite = require('./test_suite.js');
var fs = require('fs');

TestSuite.init(JScrewIt);
console.log('Available features: ' + TestSuite.getAvailableFeatures().join(', '));
TestSuite.run();

var output =
(function ()
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

fs.writeFile('output.txt', output);
