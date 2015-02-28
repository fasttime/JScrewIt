/* jshint mocha: true, node: true */

'use strict';

var assert = require('assert');

var parseCommandLine = require('../bin/parse-command-line.js');
describe(
    'parse-command-line.js returns expected results with params',
    function ()
    {
        function test(params, expected)
        {
            it(
                '"' + params.join(' ') + '"',
                function ()
                {
                    var argv = [null, '../screw.js'].concat(params);
                    var actual = parseCommandLine(argv);
                    assert.deepEqual(actual, expected);
                }
            );
        }
        
        function testError(params, error)
        {
            it(
                '"' + params.join(' ') + '"',
                function ()
                {
                    var argv = [null, '../screw.js'].concat(params);
                    assert.throws(function () { parseCommandLine(argv); }, error);
                }
            );
        }
        
        test(
            [],
            {
                inputFileName: undefined,
                outputFileName: undefined,
                options: { }
            }
        );
        test(['--help'], 'help');
        test(['--version'], 'version');
        test(
            ['-c'],
            {
                inputFileName: undefined,
                outputFileName: undefined,
                options: { wrapWith: 'call' }
            }
        );
        test(
            ['--wrap-with-call'],
            {
                inputFileName: undefined,
                outputFileName: undefined,
                options: { wrapWith: 'call' }
            }
        );
        test(
            ['-e'],
            {
                inputFileName: undefined,
                outputFileName: undefined,
                options: { wrapWith: 'eval' }
            }
        );
        test(
            ['--wrap-with-eval'],
            {
                inputFileName: undefined,
                outputFileName: undefined,
                options: { wrapWith: 'eval' }
            }
        );
        test(
            ['-f', 'ATOB,SELF'],
            {
                inputFileName: undefined,
                outputFileName: undefined,
                options: { features: ['ATOB', 'SELF'] }
            }
        );
        test(
            ['--features', 'ATOB,SELF'],
            {
                inputFileName: undefined,
                outputFileName: undefined,
                options: { features: ['ATOB', 'SELF'] }
            }
        );
        testError(['-f'], 'option "-f" requires an argument');
        testError(['--features'], 'option "--features" requires an argument');
        test(
            ['-t'],
            {
                inputFileName: undefined,
                outputFileName: undefined,
                options: { trimCode: true }
            }
        );
        test(
            ['--trim-code'],
            {
                inputFileName: undefined,
                outputFileName: undefined,
                options: { trimCode: true }
            }
        );
        test(
            ['-ct'],
            {
                inputFileName: undefined,
                outputFileName: undefined,
                options: { trimCode: true, wrapWith: 'call' }
            }
        );
        testError(['-x'], /unrecognized flag "x"/);
        testError(
            ['--allyourbasearebelongtous'],
            /unrecognized option "--allyourbasearebelongtous"/
        );
        test(
            ['infile'],
            {
                inputFileName: 'infile',
                outputFileName: undefined,
                options: { }
            }
        );
        test(
            ['infile', 'outfile'],
            {
                inputFileName: 'infile',
                outputFileName: 'outfile',
                options: { }
            }
        );
        test(
            ['-ct', 'infile', '--features', 'FF31', 'outfile'],
            {
                inputFileName: 'infile',
                outputFileName: 'outfile',
                options: { features: ['FF31'], trimCode: true, wrapWith: 'call' }
            }
        );
        testError(['infile', 'outfile', 'etc.'], /unexpected argument "etc."/);
    }
);
