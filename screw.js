#!/usr/bin/env node

'use strict';

var cli = require('./tools/cli.js');

var command;

var argv = process.argv;
try
{
    command = cli.parseCommandLine(argv);
}
catch (error)
{
    var path = require('path');
    
    var basename = path.basename(argv[1]);
    var message =
        basename + ': ' + error.message + '.\nTry "' + basename + ' --help" for more information.';
    console.error(message);
    return;
}
if (command === 'help')
{
    var path = require('path');
    
    var basename = path.basename(argv[1]);
    var message =
        'Usage: ' + basename + ' [OPTION]... [SOURCE [DESTINATION]]\n' +
        'Encodes JavaScript with JScrewIt.\n' +
        '\n' +
        '  -c, --wrap-with-call    wrap output with a function call\n' +
        '  -e, --wrap-with-eval    wrap output with eval\n' +
        '  -d, --diagnostic        print diagnostic report\n' +
        '  -f, --features FEATURES use a list of comma separated fetures\n' +
        '  -t, --trim-code         strip leading and trailing blanks and comments\n' +
        '      --help              display this help and exit\n' +
        '      --version           print version information and exit\n' +
        '\n' +
        'If no destination file is specified, the output is written to the console and\n' +
        'no reports are printed (-d is ignored).\n' +
        'If no source or destination file is specified, the command runs in interactive\n' +
        'mode until interrupted with ^C.';
    console.log(message);
    return;
}
if (command === 'version')
{
    var version = require('./package.json').version;
    console.log('JScrewIt ' + version);
    return;
}

var inputFileName   = command.inputFileName;
var outputFileName  = command.outputFileName;
var options         = command.options;

var JScrewIt = require('./lib/jscrewit.js');

if (inputFileName == null)
{
    var repl = require('repl');
    var stream = require('stream');
    
    console.log('Press ^C at any time to quit.');
    var transform = new stream.Transform();
    transform._transform =
        function (chunk, encoding, callback)
        {
            var lines = chunk.toString().match(/.+/g);
            if (lines)
            {
                lines.forEach(
                    function (line)
                    {
                        var output = JScrewIt.encode(line, options);
                        transform.push(output + '\n');
                    }
                );
            }
            callback();
        };
    repl.start(
        {
            input: transform,
            output: process.stdout,
            prompt: 'SCREW> ',
            useColors: true
        }
    );
    process.stdin.pipe(transform);
}
else
{
    var fs = require('fs');
    
    var input;
    var output;
    var encodingTime;
    var codingLog;
    try
    {
        input = fs.readFileSync(inputFileName);
        var encodingTime =
            cli.timeThis(
                function ()
                {
                    output = JScrewIt.encode(input, options);
                }
            );
        fs.writeFileSync(outputFileName, output);
        var perfInfo = options.perfInfo;
        codingLog = perfInfo && perfInfo.codingLog;
    }
    catch (error)
    {
        console.error(error.message);
        return;
    }
    if (outputFileName)
    {
        if (codingLog)
        {
            var diagnosticReport = cli.createDiagnosticReport(codingLog);
            console.log(diagnosticReport);
        }
        var report = cli.createReport(input.length, output.length, encodingTime);
        console.log(report);
    }
    else
        console.log(output);
}
