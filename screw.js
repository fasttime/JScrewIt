#!/usr/bin/env node

'use strict';

const cli = require('#tools/cli');

function fail()
{
    process.exit(1);
}

function getBasename()
{
    const path = require('node:path');
    const basename = path.basename(process.argv[1]);
    return basename;
}

function printErrorMessage(errorMessage)
{
    const basename = getBasename();
    console.error
    ('%s: %s.\nTry "%s --help" for more information.', basename, errorMessage, basename);
}

function printHelpMessage()
{
    const message =
    'Usage: %s [OPTION]... [SOURCE [DESTINATION]]\n' +
    'Encodes JavaScript with JScrewIt.\n' +
    '\n' +
    '  -d, --diagnostic        print diagnostic report\n' +
    '  -f, --features FEATURES use a list of comma separated features\n' +
    '  -t, --trim-code         strip leading and trailing blanks and comments\n' +
    '  -r, --run-as METHOD     control generated code type\n' +
    '      --help              display this help and exit\n' +
    '      --version           print version information and exit\n' +
    '\n' +
    'If no destination file is specified, the output is written to the console and\n' +
    'no reports are printed (-d is ignored).\n' +
    'If no source or destination file is specified, the command runs in interactive\n' +
    'mode until interrupted with ^C.\n' +
    '\n' +
    '--run-as expects an argument out of the values for the option runAs described\n' +
    'in the documentation of JScrewIt.encode.\n' +
    'Most of these methods also have a short flag syntax associated.\n' +
    '\n' +
    '  RunAs Method            Short Flags\n' +
    '  ──────────────────────  ────────────────\n' +
    '  call                    -c, -w\n' +
    '  eval                    -e\n' +
    '  express                 -x\n' +
    '  express-call            -xc, -xw\n' +
    '  express-eval (default)  -xe\n' +
    '  none                    (none available)\n' +
    '\n' +
    'See the JScrewIt feature documentation for a list of all supported features.\n';
    const basename = getBasename();
    console.log(message, basename);
}

function printVersion()
{
    const { version } = require('./package.json');
    console.log(`JScrewIt ${version}`);
}

function prompt()
{
    process.stdout.write('SCREW> ');
}

let command;
try
{
    command = cli.parseCommandLine(process.argv);
}
catch (error)
{
    printErrorMessage(error.message);
    fail();
}
if (command === 'help')
{
    printHelpMessage();
    return;
}
if (command === 'version')
{
    printVersion();
    return;
}

const { inputFileName, outputFileName, options } = command;
const JScrewIt = require('#jscrewit');

if (inputFileName == null)
{
    const tryEncode =
    input =>
    {
        let output;
        try
        {
            output = JScrewIt.encode(input, options);
        }
        catch (error)
        {
            console.error('%s', error.message);
        }
        return output;
    };
    if (tryEncode('') == null) // validate options
        fail();
    const { createInterface } = require('node:readline');
    const rl = createInterface({ input: process.stdin, terminal: false });
    rl.on
    (
        'line',
        input =>
        {
            if (input)
            {
                const output = tryEncode(input);
                if (output != null)
                    console.log(output);
            }
            prompt();
        },
    );
    prompt();
}
else
{
    const fs = require('node:fs');
    const timeUtils = require('#tools/time-utils');

    let input;
    let output;
    let encodingTime;
    try
    {
        input = fs.readFileSync(inputFileName);
        encodingTime =
        timeUtils.timeThis(() => { output = JScrewIt.encode(input, options); });
        if (outputFileName != null)
            fs.writeFileSync(outputFileName, output);
        else
            console.log(output);
    }
    catch (error)
    {
        console.error('%s', error.message);
        fail();
    }
    if (outputFileName != null)
    {
        const perfLog = options.perfInfo?.perfLog;
        if (perfLog)
        {
            const diagnosticReport = cli.createDiagnosticReport(perfLog);
            console.log(diagnosticReport);
        }
        const report = cli.createReport(input.length, output.length, encodingTime);
        console.log(report);
    }
}
