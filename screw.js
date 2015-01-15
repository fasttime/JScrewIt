#!/usr/bin/env node

'use strict';

var stream = require('stream');
var util = require('util');
var JScrewIt = require('./lib/jscrewit.js');
var repl = require('repl');

var wrapWithEval;
var inputFileName;
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
            inputFileName = arg;
        }
    }
}

if (inputFileName == null)
{
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
    var data = require('fs').readFileSync(inputFileName);
    var output = JScrewIt.encode(data, wrapWithEval, features);
    process.stdout.write(output);
}
