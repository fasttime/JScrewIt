#!/usr/bin/env node

'use strict';

var stream = require('stream');
var util = require('util');
var JScrewIt = require('./jscrewit.js');
var repl = require('repl');

if (process.argv.length !== 3)
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
                    var output = JScrewIt.encode(line);
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
    var data = require('fs').readFileSync(process.argv[2]);
    var output = JScrewIt.encode(data);
    console.log(output);
}
