#!/usr/bin/env node

'use strict';

var JScrewIt = require('./lib/jscrewit.js');
var parseCommandLine = require('./bin/parse-command-line.js');

function widthOf(size)
{
    return (size + '').length;
}

function byteCount(size, width)
{
    /* jshint singleGroups: false */
    var string =
        Array(width - widthOf(size) + 1).join(' ') + (size === 1 ? '1 byte' : size + ' bytes');
    return string;
}

var command;

var argv = process.argv;
try
{
    command = parseCommandLine(argv);
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
if (!command)
{
    var path = require('path');
    
    var basename = path.basename(argv[1]);
    var message =
        'Usage: ' + basename + ' [OPTION]... [SOURCE [DESTINATION]]\n' +
        'Encodes JavaScript with JScrewIt.\n' +
        '\n' +
        '  -c, --wrap-with-call    wrap output with a function call\n' +
        '  -e, --wrap-with-eval    wrap output with eval\n' +
        '  -f, --features FEATURES use a list of comma separated fetures\n' +
        '  -t, --trim-code         strip leading and trailing blanks and comments\n' +
        '      --help              display this help and exit\n' +
        '\n' +
        'If no destination file is specified, the output is written to the console.\n' +
        'If no source or destination file is specified, the command runs in interactive\n' +
        'mode until interrupted with ^C.';
    console.log(message);
    return;
}

var inputFileName   = command.inputFileName;
var outputFileName  = command.outputFileName;
var options         = command.options;

if (inputFileName == null)
{
    var repl = require('repl');
    var stream = require('stream');
    var util = require('util');
    
    var Stream = function Stream() { stream.Transform.call(this); };
    util.inherits(Stream, stream.Transform);
    Stream.prototype._transform =
        function (chunk, encoding, callback)
        {
            var lines = chunk.toString().match(/.+/g);
            if (lines)
            {
                lines.forEach(
                    function (line)
                    {
                        var output = JScrewIt.encode(line, options);
                        this.push(output + '\n');
                    },
                    this
                );
            }
            callback();
        };
    console.log('Press ^C at any time to quit.');
    var script = new Stream();
    repl.start(
        {
            input: script,
            output: process.stdout,
            prompt: 'SCREW> ',
            useColors: true
        }
    );
    process.stdin.pipe(script);
}
else
{
    var fs = require('fs');
    
    var input = fs.readFileSync(inputFileName);
    var output;
    try
    {
        output = JScrewIt.encode(input, options);
    }
    catch (error)
    {
        console.error(error.message);
        return;
    }
    if (outputFileName)
    {
        fs.writeFile(outputFileName, output);
        var originalSize = input.length;
        var screwedSize = output.length;
        var width = Math.max(widthOf(originalSize), widthOf(screwedSize));
        var message =
            'Original size: ' + byteCount(input.length, width) +
            '\nScrewed size:  ' + byteCount(screwedSize, width) +
            '\nExpansion factor: ' + (screwedSize / originalSize).toFixed(2);
        console.log(message);
    }
    else
    {
        console.log(output);
    }
}
