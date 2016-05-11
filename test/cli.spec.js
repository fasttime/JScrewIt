/* jshint mocha: true, node: true */

'use strict';

var assert = require('assert');
var cli = require('../tools/cli.js');

var isInteger =
    Number.isInteger ||
    function (value)
    {
        return Number.isFinite(value) && Math.floor(value) === value;
    };

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
                options: { wrapWith: 'call' }
            }
        );
        test(
            ['-w'],
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

describe(
    'createReport',
    function ()
    {
        it(
            'when screwed size is larger than original size',
            function ()
            {
                var actual = cli.createReport(90, 2345, 987);
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
                var actual = cli.createReport(100, 99, 5);
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
                var actual = cli.createReport(1, 6, 4);
                var expected =
                    'Original size:    1 byte\n' +
                    'Screwed size:     6 bytes\n' +
                    'Expansion factor: 6.00\n' +
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
                                    coderName: 'lorem',
                                    status: 'used',
                                    outputLength: 100,
                                    time: 123,
                                    codingLog:
                                    [
                                        makePerfInfoList(
                                            'ipsum',
                                            {
                                                coderName: 'dolor',
                                                status: 'used',
                                                outputLength: 50,
                                                time: 45
                                            }
                                        ),
                                        makePerfInfoList(
                                            'sit',
                                            {
                                                coderName: 'amet',
                                                status: 'used',
                                                outputLength: 25,
                                                time: 67
                                            }
                                        )
                                    ]
                                },
                                { coderName: 'consetetur', status: 'skipped' }
                            )
                        ]
                    );
                var expected =
                    '\n' +
                    'Coder                       Status         Length  Time (ms)\n' +
                    '────────────────────────────────────────────────────────────\n' +
                    '(default)\n' +
                    '├lorem                      used              100        123\n' +
                    '│├ipsum\n' +
                    '││└dolor                    used               50         45\n' +
                    '│└sit\n' +
                    '│ └amet                     used               25         67\n' +
                    '│\n' +
                    '└consetetur                 skipped             -          -\n';
                assert.strictEqual(actual, expected);
            }
        );
    }
);

describe(
    'timeThis',
    function ()
    {
        it(
            'executes the callback and returns a non-negative integer',
            function ()
            {
                var callbackCalled = false;
                var actual =
                    cli.timeThis(
                        function ()
                        {
                            callbackCalled = true;
                        }
                    );
                assert(callbackCalled);
                assert(isInteger(actual) && actual >= 0);
            }
        );
    }
);
