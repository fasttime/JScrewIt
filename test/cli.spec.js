/* eslint-env mocha, node */

'use strict';

var assert = require('assert');
var cli = require('../tools/cli');

describe(
    'screw.js',
    function ()
    {
        var exec = require('child_process').exec;
        
        function doAssert(actual, expected)
        {
            if (expected instanceof RegExp)
                assert(expected.test(actual), 'expected "' + actual + '" to match ' + expected);
            else
                assert.strictEqual(actual, expected);
        }
        
        function test(description, command, expectedStdout, expectedStderr)
        {
            it(
                description,
                function (done)
                {
                    exec(
                        command,
                        null,
                        function (error, stdout, stderr)
                        {
                            doAssert(stdout, expectedStdout);
                            doAssert(stderr, expectedStderr);
                            done(error);
                        }
                    );
                }
            );
        }
        
        test(
            'shows the help message with option "--help"',
            'node ./screw.js --help',
            /^Usage: screw.js [^]*\n$/,
            ''
        );
        test(
            'shows an error message with an invalid option',
            'node ./screw.js --foo',
            '',
            'screw.js: unrecognized option "--foo".\nTry "screw.js --help" for more information.\n'
        );
        test(
            'shows an error message when an invalid feature is specified',
            'node ./screw.js -f FOO',
            '',
            'Unknown feature "FOO"\n'
        );
        test(
            'shows an error message when the input file does not exist',
            'node ./screw.js ""',
            '',
            /^ENOENT\b. no such file or directory\b.* ''\n$/
        );
    }
);

describe(
    'parseCommandLine returns expected results with params',
    function ()
    {
        function test(params, expected)
        {
            it(
                '"' + params.join(' ') + '"',
                function ()
                {
                    var argv = [null, '../screw.js'].concat(params);
                    var actual = cli.parseCommandLine(argv);
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
                    assert.throws(
                        function ()
                        {
                            cli.parseCommandLine(argv);
                        },
                        error
                    );
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
                options: { runAs: 'call' }
            }
        );
        test(
            ['-w'],
            {
                inputFileName: undefined,
                outputFileName: undefined,
                options: { runAs: 'call' }
            }
        );
        test(
            ['-e'],
            {
                inputFileName: undefined,
                outputFileName: undefined,
                options: { runAs: 'eval' }
            }
        );
        test(
            ['-d'],
            {
                inputFileName: undefined,
                outputFileName: undefined,
                options: { perfInfo: { } }
            }
        );
        test(
            ['--diagnostic'],
            {
                inputFileName: undefined,
                outputFileName: undefined,
                options: { perfInfo: { } }
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
            ['-r', 'express'],
            {
                inputFileName: undefined,
                outputFileName: undefined,
                options: { runAs: 'express' }
            }
        );
        test(
            ['--run-as', 'express'],
            {
                inputFileName: undefined,
                outputFileName: undefined,
                options: { runAs: 'express' }
            }
        );
        testError(['-r'], 'option "-r" requires an argument');
        testError(['--run-as'], 'option "--run-as" requires an argument');
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
            ['-x'],
            {
                inputFileName: undefined,
                outputFileName: undefined,
                options: { runAs: 'express' }
            }
        );
        test(
            ['-ctx'],
            {
                inputFileName: undefined,
                outputFileName: undefined,
                options: { trimCode: true, runAs: 'express-call' }
            }
        );
        testError(['-y'], /unrecognized flag "y"/);
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
                options: { features: ['FF31'], trimCode: true, runAs: 'call' }
            }
        );
        testError(['infile', 'outfile', 'etc.'], /unexpected argument "etc."/);
    }
);

describe(
    'createReport',
    function ()
    {
        it(
            'when screwed size is larger than original size',
            function ()
            {
                var actual = cli.createReport(90, 2345, 0.987);
                var expected =
                    'Original size:      90 bytes\n' +
                    'Screwed size:     2345 bytes\n' +
                    'Expansion factor: 26.06\n' +
                    'Encoding time:    0.99 s';
                assert.strictEqual(actual, expected);
            }
        );
        it(
            'when screwed size is smaller than original size',
            function ()
            {
                var actual = cli.createReport(100, 99, 0.005);
                var expected =
                    'Original size:    100 bytes\n' +
                    'Screwed size:      99 bytes\n' +
                    'Expansion factor: 0.99\n' +
                    'Encoding time:    0.01 s';
                assert.strictEqual(actual, expected);
            }
        );
        it(
            'when original size is 1',
            function ()
            {
                var actual = cli.createReport(1, 6, 0.004);
                var expected =
                    'Original size:    1 byte\n' +
                    'Screwed size:     6 bytes\n' +
                    'Expansion factor: 6.00\n' +
                    'Encoding time:    < 0.01 s';
                assert.strictEqual(actual, expected);
            }
        );
        it(
            'when original size is 0',
            function ()
            {
                var actual = cli.createReport(0, 0, 0);
                var expected =
                    'Original size:    0 bytes\n' +
                    'Screwed size:     0 bytes\n' +
                    'Expansion factor: -\n' +
                    'Encoding time:    < 0.01 s';
                assert.strictEqual(actual, expected);
            }
        );
    }
);

describe(
    'createDiagnosticReport',
    function ()
    {
        function makePerfInfoList(name)
        {
            var perfInfoList = Array.prototype.slice.call(arguments, 1);
            perfInfoList.name = name;
            return perfInfoList;
        }
        
        it(
            'works as expected',
            function ()
            {
                var actual =
                    cli.createDiagnosticReport(
                        [
                            makePerfInfoList(
                                null,
                                {
                                    coderName: 'coderA',
                                    status: 'used',
                                    outputLength: 100,
                                    time: 123,
                                    codingLog:
                                    [
                                        makePerfInfoList(
                                            'lorem',
                                            {
                                                coderName: 'coderA1',
                                                status: 'used',
                                                outputLength: 50,
                                                time: 45
                                            }
                                        ),
                                        makePerfInfoList(
                                            'ipsum',
                                            {
                                                coderName: 'coderA2',
                                                status: 'used',
                                                outputLength: 25,
                                                time: 67,
                                                codingLog:
                                                [
                                                    makePerfInfoList(
                                                        'dolor',
                                                        {
                                                            coderName: 'coderA2_extra',
                                                            status: 'used',
                                                            outputLength: 22,
                                                            time: 66
                                                        }
                                                    )
                                                ]
                                            }
                                        )
                                    ]
                                },
                                { coderName: 'coderB', status: 'skipped' }
                            )
                        ]
                    );
                var expected =
                    '\n' +
                    'Coder                       Status         Length  Time (ms)\n' +
                    '────────────────────────────────────────────────────────────\n' +
                    '(default)\n' +
                    '├coderA                     used              100        123\n' +
                    '│├lorem\n' +
                    '││└coderA1                  used               50         45\n' +
                    '│└ipsum\n' +
                    '│ └coderA2                  used               25         67\n' +
                    '│  └dolor\n' +
                    '│   └coderA2_extra          used               22         66\n' +
                    '│\n' +
                    '└coderB                     skipped             -          -\n';
                assert.strictEqual(actual, expected);
            }
        );
    }
);
