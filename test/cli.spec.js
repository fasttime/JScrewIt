/* eslint-env ebdd/ebdd, node */

'use strict';

var cli     = require('../tools/cli');
var assert  = require('assert');

describe
(
    'screw.js',
    function ()
    {
        var childProcessExports = require('child_process');
        var fs                  = require('fs');
        var os                  = require('os');
        var path                = require('path');

        function createOutputFileName()
        {
            var tmpDir = os.tmpdir();
            do
            {
                var fileName = '';
                do
                    fileName += (Math.random() * 36 | 0).toString(36);
                while (fileName.length < 10);
                var outputFileName = path.join(tmpDir, fileName);
            }
            while (fs.existsSync(outputFileName));
            return outputFileName;
        }

        function doAssert(actual, expected)
        {
            if (expected instanceof RegExp)
                assert(expected.test(actual), 'expected "' + actual + '" to match ' + expected);
            else
                assert.strictEqual(actual, expected);
        }

        var options = { cwd: path.dirname(__dirname) };
        var outputFileName1 = createOutputFileName();
        var expectedFiles1 = { };
        expectedFiles1[outputFileName1] = '+[]';
        var outputFileName2 = createOutputFileName();
        var expectedFiles2 = { };
        expectedFiles2[outputFileName2] = '+[]';
        var paramDataList =
        [
            {
                description:            'shows the help message with option "--help"',
                screwArgs:              ['--help'],
                expectedStdout:         /^Usage: screw.js [^]*\n$/,
                expectedStderr:         '',
                expectedExitCode:       0,
            },
            {
                description:            'shows the version number with option "--version"',
                screwArgs:              ['--version'],
                expectedStdout:         /^JScrewIt \d+\.\d+\.\d+\n$/,
                expectedStderr:         '',
                expectedExitCode:       0,
            },
            {
                description:            'shows an error message with an invalid option',
                screwArgs:              ['--foo'],
                expectedStdout:         '',
                expectedStderr:
                'screw.js: unrecognized option "--foo".\n' +
                'Try "screw.js --help" for more information.\n',
                expectedExitCode:       1,
            },
            {
                description:
                'shows an error message when an invalid feature is specified',
                screwArgs:              ['-f', 'FOO'],
                expectedStdout:         '',
                expectedStderr:         'Unknown feature "FOO"\n',
                expectedExitCode:       1,
            },
            {
                description:            'shows an error message when the input file does not exist',
                screwArgs:              ['""'],
                expectedStdout:         '',
                expectedStderr:         /^ENOENT\b. no such file or directory\b.*\n$/,
                expectedExitCode:       1,
            },
            {
                description:            'prints the encoded input interactively',
                screwArgs:              [],
                childProcessHandler:
                function (childProcess)
                {
                    childProcess.stdin.write('10\n');
                    childProcess.stdin.end();
                },
                expectedStdout:         'SCREW> +(+!![]+[+[]])\nSCREW> ',
                expectedStderr:         '',
                expectedExitCode:       0,
            },
            {
                description:            'prints an error message interactively',
                screwArgs:              ['-x'],
                childProcessHandler:
                function (childProcess)
                {
                    childProcess.stdin.write('?\n');
                    childProcess.stdin.end();
                },
                expectedStdout:         'SCREW> SCREW> ',
                expectedStderr:         'Encoding failed\n',
                expectedExitCode:       0,
            },
            {
                description:            'ignores empty input interactively',
                screwArgs:              [],
                childProcessHandler:
                function (childProcess)
                {
                    childProcess.stdin.write('\n');
                    childProcess.stdin.end();
                },
                expectedStdout:         'SCREW> SCREW> ',
                expectedStderr:         '',
                expectedExitCode:       0,
            },
            {
                description:            'encodes a file and shows the output',
                screwArgs:              ['test/fixture.txt'],
                expectedStdout:         '+[]\n',
                expectedStderr:         '',
                expectedExitCode:       0,
            },
            {
                description:            'encodes a file and writes the output to a file',
                screwArgs:              ['test/fixture.txt', outputFileName1],
                expectedStdout:
                /^Original size: .*\nScrewed size: .*\nExpansion factor: .*\nEncoding time: .*\n$/,
                expectedStderr:         '',
                expectedFiles:          expectedFiles1,
                expectedExitCode:       0,
            },
            {
                description:
                'encodes a file, writes the output to a file and prints a diagnostic report',
                screwArgs:              ['-d', 'test/fixture.txt', outputFileName2],
                expectedStdout:
                RegExp
                (
                    '\n\n' +
                    'Original size: .*\n' +
                    'Screwed size: .*\n' +
                    'Expansion factor: .*\n' +
                    'Encoding time: .*\n' +
                    '$'
                ),
                expectedStderr:         '',
                expectedFiles:          expectedFiles2,
                expectedExitCode:       0,
            },
        ];

        it.per(paramDataList)
        (
            '#.description',
            function (paramData, done)
            {
                var screwArgs           = paramData.screwArgs;
                var childProcessHandler = paramData.childProcessHandler;
                var expectedStdout      = paramData.expectedStdout;
                var expectedStderr      = paramData.expectedStderr;
                var expectedFiles       = paramData.expectedFiles;
                var expectedExitCode    = paramData.expectedExitCode;
                var actualExitCode;
                var args = ['./screw.js'].concat(screwArgs);
                var childProcess =
                childProcessExports.execFile
                (
                    process.execPath,
                    args,
                    options,
                    function (error, stdout, stderr)
                    {
                        stderr =
                        stderr.replace
                        (
                            RegExp
                            (
                                '^(' +
                                'Debugger listening on .*\n' +
                                'For help, see: https://nodejs\\.org/en/docs/inspector\n|' +
                                'Debugger attached\\.\n|' +
                                'Waiting for the debugger to disconnect\\.\\.\\.\n' +
                                ')',
                                'gm'
                            ),
                            ''
                        );
                        try
                        {
                            doAssert(stdout, expectedStdout);
                            doAssert(stderr, expectedStderr);
                            for (var filePath in expectedFiles)
                            {
                                var actualContent = fs.readFileSync(filePath).toString();
                                var expectedContent = expectedFiles[filePath];
                                assert.strictEqual(actualContent, expectedContent);
                            }
                            assert.strictEqual(actualExitCode, expectedExitCode);
                        }
                        catch (error)
                        {
                            done(error);
                            return;
                        }
                        done();
                    }
                )
                .on
                (
                    'exit',
                    function (exitCode)
                    {
                        actualExitCode = exitCode;
                    }
                );
                if (childProcessHandler)
                    childProcessHandler(childProcess);
            }
        )
        .timeout(5000);
    }
);

describe
(
    'parseCommandLine returns expected results with params',
    function ()
    {
        function test(params, expectedResult)
        {
            var argv = [null, '../screw.js'].concat(params);
            var actualResult = cli.parseCommandLine(argv);
            assert.deepEqual(actualResult, expectedResult);
        }

        function testError(params, expectedErrorMsg)
        {
            var argv = [null, '../screw.js'].concat(params);
            try
            {
                cli.parseCommandLine(argv);
            }
            catch (error)
            {
                assert.strictEqual(Object.getPrototypeOf(error), Error.prototype);
                if (expectedErrorMsg !== undefined)
                {
                    var actualErrorMsg = error.message;
                    if (expectedErrorMsg instanceof RegExp)
                    {
                        assert
                        (
                            expectedErrorMsg.test(actualErrorMsg),
                            'Expecting error message to match ' + expectedErrorMsg
                        );
                    }
                    else if (typeof expectedErrorMsg === 'string')
                        assert.strictEqual(actualErrorMsg, expectedErrorMsg);
                    else
                        throw Error('Invalid value for argument expectedErrorMsg');
                }
                return;
            }
            assert.fail('Error expected');
        }

        var paramDataList =
        [
            {
                params: [],
                expectedResult:
                {
                    inputFileName:  undefined,
                    outputFileName: undefined,
                    options:        { },
                },
            },
            {
                params:         ['--help'],
                expectedResult: 'help',
            },
            {
                params:         ['--version'],
                expectedResult: 'version',
            },
            {
                params: ['-c'],
                expectedResult:
                {
                    inputFileName:  undefined,
                    outputFileName: undefined,
                    options:        { runAs: 'call' },
                },
            },
            {
                params: ['-w'],
                expectedResult:
                {
                    inputFileName:  undefined,
                    outputFileName: undefined,
                    options:        { runAs: 'call' },
                },
            },
            {
                params: ['-e'],
                expectedResult:
                {
                    inputFileName:  undefined,
                    outputFileName: undefined,
                    options:        { runAs: 'eval' },
                },
            },
            {
                params: ['-d'],
                expectedResult:
                {
                    inputFileName:  undefined,
                    outputFileName: undefined,
                    options:        { perfInfo: { } },
                },
            },
            {
                params: ['--diagnostic'],
                expectedResult:
                {
                    inputFileName:  undefined,
                    outputFileName: undefined,
                    options:        { perfInfo: { } },
                },
            },
            {
                params: ['-f', 'ATOB,SELF'],
                expectedResult:
                {
                    inputFileName:  undefined,
                    outputFileName: undefined,
                    options:        { features: ['ATOB', 'SELF'] },
                },
            },
            {
                params: ['--features', 'ATOB,SELF'],
                expectedResult:
                {
                    inputFileName:  undefined,
                    outputFileName: undefined,
                    options:        { features: ['ATOB', 'SELF'] },
                },
            },
            {
                params:             ['-f'],
                expectedErrorMsg:   'option "-f" requires an argument',
            },
            {
                params:             ['--features'],
                expectedErrorMsg:   'option "--features" requires an argument',
            },
            {
                params: ['-r', 'express'],
                expectedResult:
                {
                    inputFileName:  undefined,
                    outputFileName: undefined,
                    options:        { runAs: 'express' },
                },
            },
            {
                params: ['--run-as', 'express'],
                expectedResult:
                {
                    inputFileName:  undefined,
                    outputFileName: undefined,
                    options:        { runAs: 'express' },
                },
            },
            {
                params:             ['-r'],
                expectedErrorMsg:   'option "-r" requires an argument',
            },
            {
                params:             ['--run-as'],
                expectedErrorMsg:   'option "--run-as" requires an argument',
            },
            {
                params: ['-t'],
                expectedResult:
                {
                    inputFileName:  undefined,
                    outputFileName: undefined,
                    options:        { trimCode: true },
                },
            },
            {
                params: ['--trim-code'],
                expectedResult:
                {
                    inputFileName:  undefined,
                    outputFileName: undefined,
                    options:        { trimCode: true },
                },
            },
            {
                params: ['-x'],
                expectedResult:
                {
                    inputFileName:  undefined,
                    outputFileName: undefined,
                    options:        { runAs: 'express' },
                },
            },
            {
                params: ['-ctx'],
                expectedResult:
                {
                    inputFileName:  undefined,
                    outputFileName: undefined,
                    options:        { trimCode: true, runAs: 'express-call' },
                },
            },
            {
                params:             ['-y'],
                expectedErrorMsg:   /unrecognized flag "y"/,
            },
            {
                params:             ['--allyourbasearebelongtous'],
                expectedErrorMsg:   /unrecognized option "--allyourbasearebelongtous"/,
            },
            {
                params: ['infile'],
                expectedResult:
                {
                    inputFileName:  'infile',
                    outputFileName: undefined,
                    options:        { },
                },
            },
            {
                params: ['infile', 'outfile'],
                expectedResult:
                {
                    inputFileName:  'infile',
                    outputFileName: 'outfile',
                    options:        { },
                },
            },
            {
                params: ['-ct', 'infile', '--features', 'FF', 'outfile'],
                expectedResult:
                {
                    inputFileName:  'infile',
                    outputFileName: 'outfile',
                    options:        { features: ['FF'], trimCode: true, runAs: 'call' },
                },
            },
            {
                params:             ['infile', 'outfile', 'etc.'],
                expectedErrorMsg:   /unexpected argument "etc."/,
            },
        ];
        paramDataList.forEach
        (
            function (paramData)
            {
                paramData.description = '"' + paramData.params.join(' ') + '"';
            }
        );

        it.per(paramDataList)
        (
            '#.description',
            function (paramData)
            {
                var params = paramData.params;
                if ('expectedResult' in paramData)
                {
                    var expectedResult = paramData.expectedResult;
                    test(params, expectedResult);
                }
                else
                {
                    var expectedErrorMsg = paramData.expectedErrorMsg;
                    testError(params, expectedErrorMsg);
                }
            }
        );
    }
);

describe
(
    'createReport',
    function ()
    {
        it
        (
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
        it
        (
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
        it
        (
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
        it
        (
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

describe
(
    'createDiagnosticReport',
    function ()
    {
        function makePerfInfoList(name)
        {
            var perfInfoList = Array.prototype.slice.call(arguments, 1);
            perfInfoList.name = name;
            return perfInfoList;
        }

        it
        (
            'works as expected',
            function ()
            {
                var actual =
                cli.createDiagnosticReport
                (
                    [
                        makePerfInfoList
                        (
                            null,
                            {
                                strategyName:   'strategyA',
                                status:         'used',
                                outputLength:   100,
                                time:           123,
                                perfLog:
                                [
                                    makePerfInfoList
                                    (
                                        'lorem',
                                        {
                                            strategyName:   'strategyA1',
                                            status:         'used',
                                            outputLength:   50,
                                            time:           45,
                                        }
                                    ),
                                    makePerfInfoList
                                    (
                                        'ipsum',
                                        {
                                            strategyName:   'strategyA2',
                                            status:         'used',
                                            outputLength:   25,
                                            time:           67,
                                            perfLog:
                                            [
                                                makePerfInfoList
                                                (
                                                    'dolor',
                                                    {
                                                        strategyName:   'strategyA2_extra',
                                                        status:         'used',
                                                        outputLength:   22,
                                                        time:           66,
                                                    }
                                                ),
                                            ],
                                        }
                                    ),
                                ],
                            },
                            { strategyName: 'strategyB', status: 'skipped' }
                        ),
                    ]
                );
                var expected =
                '\n' +
                'Strategy                    Status         Length  Time (ms)\n' +
                '────────────────────────────────────────────────────────────\n' +
                '(default)\n' +
                '├strategyA                  used              100        123\n' +
                '│├lorem\n' +
                '││└strategyA1               used               50         45\n' +
                '│└ipsum\n' +
                '│ └strategyA2               used               25         67\n' +
                '│  └dolor\n' +
                '│   └strategyA2_extra       used               22         66\n' +
                '│\n' +
                '└strategyB                  skipped             -          -\n';
                assert.strictEqual(actual, expected);
            }
        );
    }
);
