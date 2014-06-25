#!/usr/bin/env node

var stream = require('stream');
var util = require('util');
var lib = require("./jscrewit.js");
var repl = require('repl');

if(process.argv.length !== 3) {

  function Stream() {
    stream.Transform.call(this);
  }
  util.inherits(Stream, stream.Transform);

  Stream.prototype._transform = function (chunk, encoding, callback) {
    var script = lib.JScrewIt.encode(chunk.toString());
    var lines = script.split(/\n+/);
    for (var i = 0; i < lines.length; i++) {
      // ignore empty lines
      if (lines[i] !== '') this.push(lines[i] + '\n');
    }
    callback();
  };

  var fuckScript = new Stream();
  repl.start({
    prompt: "FUCK> ",
    input: fuckScript,
    useColors: true,
    output: process.stdout
  });

  process.stdin.pipe(fuckScript);
} else {
  var data = require("fs").readFileSync(process.argv[2], "utf8");
  var output = lib.JScrewIt.encode(data, false);
  console.log(output);
}
