#!/usr/bin/env node

'use strict';

var JScrewIt = require('./lib/jscrewit.js');

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

var wrapWithEval;
var inputFileName;
var outputFileName;
var features;

var argv = process.argv;
for (var index = 2; index < argv.length; ++index)
{
    var arg = argv[index];
    if (index > 2 && argv[index - 1] === '-f')
    {
        features = arg.split(/[ ,]g/);
    }
    else
    {
        if (arg === '-w')
        {
            wrapWithEval = true;
        }
        else if (arg !== '-f')
        {
            if (inputFileName)
            {
                outputFileName = arg;
            }
            else
            {
                inputFileName = arg;
            }
        }
    }
}

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
                        var output = JScrewIt.encode(line, wrapWithEval, features);
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
        output = JScrewIt.encode(input, wrapWithEval, features);
    }
    catch (error)
    {
        console.error(error.message);
        return;
    }
    var outputStream;
    if (outputFileName)
    {
        outputStream = fs.createWriteStream(outputFileName);
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
        outputStream = process.stdout;
    }
    outputStream.write(output);
}
