'use strict';

var JScrewIt = require('../jscrewit.js').JScrewIt;
var fs = require('fs');

function createTest(input)
{
    exports['encode_tests']['encode "' + input + '"'] = testEncode.bind(undefined, input);
}

function testEncode(value, test)
{
    var encoded;
    
    encoded = JScrewIt.encode(value);
    var unencodedDefault = eval(encoded);
    test.strictEqual(
        value,
        unencodedDefault,
        'encoding "' + value + '" with compatibility DEFAULT failed'
        );
    
    encoded = JScrewIt.encode(value, false, 'NO_IE');
    var unencodedNoIE = eval(encoded);
    test.strictEqual(
        value,
        unencodedNoIE,
        'encoding "' + value + '" with compatibility NO_IE failed'
        );
    test.ok(
        unencodedNoIE.length <= unencodedDefault.length,
        'encoding "' + value + '" with compatibility NO_IE is suboptimal'
        );
    
    test.done();
}

var MIN = 32, MAX = 127;

exports['integration'] =
{
    'test': function (test)
    {
        var file = fs.openSync('output.txt', 'w+');

        fs.writeSync(file, '    DEFAULT  NO_IE\n    ------- -------\n');
        for (var i = MIN; i < MAX; ++i)
        {
            var c = String.fromCharCode(i);
            var encodedDefault = JScrewIt.encode(c, false, 'DEFAULT');
            var encodedNoIE = JScrewIt.encode(c, false, 'NO_IE');
            fs.writeSync(
                file,
                '`' + c + '`' +
                ('        ' + encodedDefault.length).slice(-8) +
                ('        ' + encodedNoIE.length).slice(-8) +
                '\n'
                );
        }


        fs.closeSync(file);
        test.done();
    }
};

exports['encode_tests'] = { };

createTest('false');
createTest('falsefalsetrue');
createTest('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
createTest('abcdefghijklmnopqrstuvwxyz');

for (var i = MIN; i < MAX; ++i)
{
    createTest(String.fromCharCode(i));
}
