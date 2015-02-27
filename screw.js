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

try
{
    command = parseCommandLine(process.argv);
}
catch (error)
{
    console.error(error.message);
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
