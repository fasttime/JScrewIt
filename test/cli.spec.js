/* eslint-env ebdd/ebdd, node */

'use strict';

const cli       = require('../tools/cli');
const assert    = require('node:assert/strict');

function doAssert(actual, expected)
{
    if (expected instanceof RegExp)
        assert.match(actual, expected);
    else
        assert.strictEqual(actual, expected);
}

describe
(
    'screw.js',
    () =>
    {
        const childProcessExports   = require('node:child_process');
        const fs                    = require('node:fs');
        const os                    = require('node:os');
        const path                  = require('node:path');

        function createOutputFileName()
        {
            let outputFileName;
            const tmpDir = os.tmpdir();
            do
            {
                let fileName = '';
                do
                    fileName += (Math.random() * 36 | 0).toString(36);
                while (fileName.length < 10);
                outputFileName = path.join(tmpDir, fileName);
            }
            while (fs.existsSync(outputFileName));
            return outputFileName;
        }

        const options = { cwd: path.dirname(__dirname) };
        const outputFileName1 = createOutputFileName();
        const expectedFiles1 = { };
        expectedFiles1[outputFileName1] = '+[]';
        const outputFileName2 = createOutputFileName();
        const expectedFiles2 = { };
        expectedFiles2[outputFileName2] = '+[]';
        const paramDataList =
        [
            {
                description:            'shows the help message with option "--help"',
                screwArgs:              ['--help'],
                expectedStdout:         /^Usage: screw\.js .*\n$/s,
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
                'screw.js: Unknown option \'--foo\'. To specify a positional argument starting ' +
                'with a \'-\', place it at the end of the command after \'--\', as in \'-- ' +
                '"--foo".\n' +
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
                childProcessHandler(childProcess)
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
                childProcessHandler(childProcess)
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
                childProcessHandler(childProcess)
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
                screwArgs:              ['test/fixtures/0.txt'],
                expectedStdout:         '+[]\n',
                expectedStderr:         '',
                expectedExitCode:       0,
            },
            {
                description:            'encodes a file and writes the output to a file',
                screwArgs:              ['test/fixtures/0.txt', outputFileName1],
                expectedStdout:
                /^Original size: .*\nScrewed size: .*\nExpansion factor: .*\nEncoding time: .*\n$/,
                expectedStderr:         '',
                expectedFiles:          expectedFiles1,
                expectedExitCode:       0,
            },
            {
                description:
                'encodes a file, writes the output to a file and prints a diagnostic report',
                screwArgs:              ['-d', 'test/fixtures/0.txt', outputFileName2],
                expectedStdout:
                RegExp
                (
                    '\n\n' +
                    'Original size: +1 byte\n' +
                    'Screwed size: +\\d+ bytes\n' +
                    'Expansion factor: .*\n' +
                    'Encoding time: .*\n' +
                    '$',
                ),
                expectedStderr:         '',
                expectedFiles:          expectedFiles2,
                expectedExitCode:       0,
            },
            {
                descriptions:           'shows the number of bytes in the input as original size',
                screwArgs:              ['-d', 'test/fixtures/∞.txt', createOutputFileName()],
                expectedStdout:
                RegExp
                (
                    '\n\n' +
                    'Original size: +3 bytes\n' +
                    'Screwed size: +\\d+ bytes\n' +
                    'Expansion factor: .*\n' +
                    'Encoding time: .*\n' +
                    '$',
                ),
                expectedStderr:         '',
                expectedExitCode:       0,
            },
        ];

        it.per(paramDataList)
        (
            '#.description',
            (paramData, done) =>
            {
                const { screwArgs } = paramData;
                const { childProcessHandler } = paramData;
                const { expectedStdout } = paramData;
                const { expectedStderr } = paramData;
                const { expectedFiles } = paramData;
                const { expectedExitCode } = paramData;
                let actualExitCode;
                const args = ['./screw.js'].concat(screwArgs);
                const childProcess =
                childProcessExports.execFile
                (
                    process.execPath,
                    args,
                    options,
                    (error, stdout, stderr) =>
                    {
                        try
                        {
                            doAssert(stdout, expectedStdout);
                            doAssert(stderr, expectedStderr);
                            for (const filePath in expectedFiles)
                            {
                                const actualContent = fs.readFileSync(filePath).toString();
                                const expectedContent = expectedFiles[filePath];
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
                    },
                )
                .on
                (
                    'exit',
                    exitCode =>
                    {
                        actualExitCode = exitCode;
                    },
                );
                if (childProcessHandler)
                    childProcessHandler(childProcess);
            },
        )
        .timeout(5000);
    },
);

describe
(
    'parseCommandLine returns expected results with params',
    () =>
    {
        function test(params, expectedResult)
        {
            const argv = [null, '../screw.js'].concat(params);
            const actualResult = cli.parseCommandLine(argv);
            assert.deepEqual(actualResult, expectedResult);
        }

        function testError(params, expectedErrorMsg)
        {
            if
            (
                expectedErrorMsg !== undefined &&
                typeof expectedErrorMsg !== 'string' &&
                !(expectedErrorMsg instanceof RegExp)
            )
                throw Error('Invalid value for argument expectedErrorMsg');
            const argv = [null, '../screw.js'].concat(params);
            try
            {
                cli.parseCommandLine(argv);
            }
            catch (error)
            {
                assert(error instanceof Error);
                if (expectedErrorMsg !== undefined)
                {
                    const actualErrorMsg = error.message;
                    doAssert(actualErrorMsg, expectedErrorMsg);
                }
                return;
            }
            assert.fail('Error expected');
        }

        const paramDataList =
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
                params: ['-f', 'AT,WINDOW'],
                expectedResult:
                {
                    inputFileName:  undefined,
                    outputFileName: undefined,
                    options:        { features: ['AT', 'WINDOW'] },
                },
            },
            {
                params: ['--features', 'AT,WINDOW'],
                expectedResult:
                {
                    inputFileName:  undefined,
                    outputFileName: undefined,
                    options:        { features: ['AT', 'WINDOW'] },
                },
            },
            {
                params:             ['-f'],
                expectedErrorMsg:   'Option \'-f, --features <value>\' argument missing',
            },
            {
                params:             ['--features'],
                expectedErrorMsg:   'Option \'-f, --features <value>\' argument missing',
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
                expectedErrorMsg:   'Option \'-r, --run-as <value>\' argument missing',
            },
            {
                params:             ['--run-as'],
                expectedErrorMsg:   'Option \'-r, --run-as <value>\' argument missing',
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
                expectedErrorMsg:   /^Unknown option '-y'/,
            },
            {
                params:             ['--allyourbasearebelongtous'],
                expectedErrorMsg:   /^Unknown option '--allyourbasearebelongtous'/,
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
                expectedErrorMsg:   /^Unexpected argument "etc."/,
            },
        ];

        it.per
        (
            paramDataList,
            paramData => ({ description: `"${paramData.params.join(' ')}"`, ...paramData }),
        )
        (
            '#.description',
            paramData =>
            {
                const { params } = paramData;
                if ('expectedResult' in paramData)
                {
                    const { expectedResult } = paramData;
                    test(params, expectedResult);
                }
                else
                {
                    const { expectedErrorMsg } = paramData;
                    testError(params, expectedErrorMsg);
                }
            },
        );
    },
);

describe
(
    'createReport',
    () =>
    {
        it
        (
            'when screwed size is larger than original size',
            () =>
            {
                const actual = cli.createReport(90, 2345, 0.987);
                const expected =
                'Original size:      90 bytes\n' +
                'Screwed size:     2345 bytes\n' +
                'Expansion factor: 26.06\n' +
                'Encoding time:    0.99 s';
                assert.strictEqual(actual, expected);
            },
        );
        it
        (
            'when screwed size is smaller than original size',
            () =>
            {
                const actual = cli.createReport(100, 99, 0.005);
                const expected =
                'Original size:    100 bytes\n' +
                'Screwed size:      99 bytes\n' +
                'Expansion factor: 0.99\n' +
                'Encoding time:    0.01 s';
                assert.strictEqual(actual, expected);
            },
        );
        it
        (
            'when original size is 1',
            () =>
            {
                const actual = cli.createReport(1, 6, 0.004);
                const expected =
                'Original size:    1 byte\n' +
                'Screwed size:     6 bytes\n' +
                'Expansion factor: 6.00\n' +
                'Encoding time:    < 0.01 s';
                assert.strictEqual(actual, expected);
            },
        );
        it
        (
            'when original size is 0',
            () =>
            {
                const actual = cli.createReport(0, 0, 0);
                const expected =
                'Original size:    0 bytes\n' +
                'Screwed size:     0 bytes\n' +
                'Expansion factor: -\n' +
                'Encoding time:    < 0.01 s';
                assert.strictEqual(actual, expected);
            },
        );
    },
);

describe
(
    'createDiagnosticReport',
    () =>
    {
        function makePerfInfoList(name, ...perfInfoList)
        {
            perfInfoList.name = name;
            return perfInfoList;
        }

        it
        (
            'works as expected',
            () =>
            {
                const actual =
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
                                        },
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
                                                    },
                                                ),
                                            ],
                                        },
                                    ),
                                ],
                            },
                            { strategyName: 'strategyB', status: 'skipped' },
                        ),
                    ],
                );
                const expected =
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
            },
        );
    },
);
