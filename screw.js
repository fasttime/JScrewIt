#!/usr/bin/env node

/* eslint-env node */

'use strict';

function getBasename()
{
    var path = require('path');
    var basename = path.basename(process.argv[1]);
    return basename;
}

function printErrorMessage(errorMessage)
{
    var basename = getBasename();
    var message =
        basename + ': ' + errorMessage + '.\nTry "' + basename + ' --help" for more information.';
    console.error(message);
}

function printHelpMessage()
{
    var message =
        'Usage: ' + getBasename() + ' [OPTION]... [SOURCE [DESTINATION]]\n' +
        'Encodes JavaScript with JScrewIt.\n' +
        '\n' +
        '  -d, --diagnostic        print diagnostic report\n' +
        '  -f, --features FEATURES use a list of comma separated features\n' +
        '  -t, --trim-code         strip leading and trailing blanks and comments\n' +
        '  -r, --run-as METHOD     make output runnable with the specified method\n' +
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
        '  express-call (default)  -xc, -xw\n' +
        '  express-eval            -xe\n' +
        '  none                    (none available)\n' +
        '\n' +
        'See the JScrewIt feature documentation for a list of all supported features.\n';
    console.log(message);
}

function printVersion()
{
    var version = require('./package.json').version;
    console.log('JScrewIt ' + version);
}

function prompt()
{
    process.stdin.resume();
    process.stdout.write('SCREW> ');
}

(function ()
{
    var cli = require('./tools/cli.js');
    
    var command;
    try
    {
        command = cli.parseCommandLine(process.argv);
    }
    catch (error)
    {
        printErrorMessage(error.message);
        return;
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
    
    var inputFileName   = command.inputFileName;
    var outputFileName  = command.outputFileName;
    var options         = command.options;
    
    var JScrewIt = require('./lib/jscrewit.js');
    
    if (inputFileName == null)
    {
        try
        {
            JScrewIt.encode('', options); // validate options
        }
        catch (error)
        {
            console.error(error.message);
            return;
        }
        process.stdin.on(
            'data',
            function (input)
            {
                var lines = (input + '').match(/.+/g);
                if (lines)
                {
                    lines.forEach(
                        function (line)
                        {
                            var output = JScrewIt.encode(line, options);
                            process.stdout.write(output + '\n');
                        }
                    );
                }
                prompt();
            }
        );
        prompt();
    }
    else
    {
        var fs = require('fs');
        
        var input;
        var output;
        var encodingTime;
        try
        {
            input = fs.readFileSync(inputFileName);
            encodingTime =
                cli.timeThis(
                    function ()
                    {
                        output = JScrewIt.encode(input, options);
                    }
                );
            if (outputFileName != null)
                fs.writeFileSync(outputFileName, output);
            else
                console.log(output);
        }
        catch (error)
        {
            console.error(error.message);
            return;
        }
        if (outputFileName)
        {
            var perfInfo = options.perfInfo;
            var codingLog = perfInfo && perfInfo.codingLog;
            if (codingLog)
            {
                var diagnosticReport = cli.createDiagnosticReport(codingLog);
                console.log(diagnosticReport);
            }
            var report = cli.createReport(input.length, output.length, encodingTime);
            console.log(report);
        }
    }
})();
