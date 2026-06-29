/* eslint-env ebdd/ebdd, node */

'use strict';

const cli       = require('../tools/cli');
const assert    = require('node:assert/strict');

function doAssert(actual, expected)
{
    if (expected instanceof RegExp)
        assert.match(actual, expected);
    else
        assert.equal(actual, expected);
}

describe
(
    'screw.js',
    () =>
    {
        const { execFile }      = require('node:child_process');
        const { randomUUID }    = require('node:crypto');
        const { readFileSync }  = require('node:fs');
        const { tmpdir }        = require('node:os');
        const { dirname, join } = require('node:path');

        function createOutputFileName()
        {
            const tmpDir = tmpdir();
            const fileName = randomUUID();
            const outputFileName = join(tmpDir, fileName);
            return outputFileName;
        }

        const options = { cwd: dirname(__dirname) };
        const outputFileName1 = createOutputFileName();
        const expectedFiles1 = { __proto__: null, [outputFileName1]: '+[]' };
        const outputFileName2 = createOutputFileName();
        const expectedFiles2 = { __proto__: null, [outputFileName2]: '+[]' };
        const paramDataList =
        [
            {
                description:        'shows the help message with option "--help"',
                screwArgs:          ['--help'],
                expectedStdout:     /^Usage: screw\.js .*\n$/s,
                expectedStderr:     '',
                expectedExitCode:   0,
            },
            {
                description:        'shows the version number with option "--version"',
                screwArgs:          ['--version'],
                expectedStdout:     /^JScrewIt \d+\.\d+\.\d+\n$/,
                expectedStderr:     '',
                expectedExitCode:   0,
            },
            {
                description:        'shows an error message with an invalid option',
                screwArgs:          ['--foo'],
                expectedStdout:     '',
                expectedStderr:
                'screw.js: Unknown option \'--foo\'. To specify a positional argument starting ' +
                'with a \'-\', place it at the end of the command after \'--\', as in \'-- ' +
                '"--foo".\n' +
                'Try "screw.js --help" for more information.\n',
                expectedExitCode:   1,
            },
            {
                description:        'shows an error message when an invalid feature is specified',
                screwArgs:          ['-f', 'FOO'],
                expectedStdout:     '',
                expectedStderr:     'Unknown feature "FOO"\n',
                expectedExitCode:   1,
            },
            {
                description:        'shows an error message when the input file does not exist',
                screwArgs:          ['""'],
                expectedStdout:     '',
                expectedStderr:     /^ENOENT\b. no such file or directory\b.*\n$/,
                expectedExitCode:   1,
            },
            {
                description:        'prints the encoded input interactively',
                screwArgs:          [],
                stdin:              '10\n"a"\n',
                expectedStdout:     'SCREW> +(+!![]+[+[]])\nSCREW> (![]+[])[+!![]]\nSCREW> ',
                expectedStderr:     '',
                expectedExitCode:   0,
            },
            {
                description:        'prints an error message interactively',
                screwArgs:          ['-x'],
                stdin:              '?\n',
                expectedStdout:     'SCREW> SCREW> ',
                expectedStderr:     'Encoding failed\n',
                expectedExitCode:   0,
            },
            {
                description:        'ignores empty input interactively',
                screwArgs:          [],
                stdin:              '\n',
                expectedStdout:     'SCREW> SCREW> ',
                expectedStderr:     '',
                expectedExitCode:   0,
            },
            {
                description:        'encodes a file and shows the output',
                screwArgs:          ['test/fixtures/0.txt'],
                expectedStdout:     '+[]\n',
                expectedStderr:     '',
                expectedExitCode:   0,
            },
            {
                description:        'encodes a file and writes the output to a file',
                screwArgs:          ['test/fixtures/0.txt', outputFileName1],
                expectedStdout:
                /^Original size: .*\nScrewed size: .*\nExpansion factor: .*\nEncoding time: .*\n$/,
                expectedStderr:     '',
                expectedFiles:      expectedFiles1,
                expectedExitCode:   0,
            },
            {
                description:
                'encodes a file, writes the output to a file and prints a diagnostic report',
                screwArgs:          ['-d', 'test/fixtures/0.txt', outputFileName2],
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
                expectedStderr:     '',
                expectedFiles:      expectedFiles2,
                expectedExitCode:   0,
            },
            {
                description:        'shows the number of bytes in the input as original size',
                screwArgs:          ['-d', 'test/fixtures/∞.txt', createOutputFileName()],
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
                expectedStderr:     '',
                expectedExitCode:   0,
            },
        ];

        it.per(paramDataList)
        (
            '#.description',
            (
                {
                    screwArgs,
                    stdin,
                    expectedStdout,
                    expectedStderr,
                    expectedFiles,
                    expectedExitCode,
                },
                done,
            ) =>
            {
                let actualExitCode;
                const args = ['./screw.js', ...screwArgs];
                const childProcess =
                execFile
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
                                const actualContent = readFileSync(filePath, 'utf-8');
                                const expectedContent = expectedFiles[filePath];
                                assert.equal(actualContent, expectedContent);
                            }
                            assert.equal(actualExitCode, expectedExitCode);
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
                if (stdin !== undefined)
                {
                    childProcess.stdin.write(stdin);
                    childProcess.stdin.end();
                }
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
            const argv = [null, '../screw.js', ...params];
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
            const argv = [null, '../screw.js', ...params];
            assert.throws
            (
                () => cli.parseCommandLine(argv),
                error =>
                {
                    if (!(error instanceof Error))
                        assert.fail('Error expected');
                    if (expectedErrorMsg !== undefined)
                    {
                        const actualErrorMsg = error.message;
                        doAssert(actualErrorMsg, expectedErrorMsg);
                    }
                    return true;
                },
            );
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
                assert.equal(actual, expected);
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
                assert.equal(actual, expected);
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
                assert.equal(actual, expected);
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
                assert.equal(actual, expected);
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
                assert.equal(actual, expected);
            },
        );
    },
);
