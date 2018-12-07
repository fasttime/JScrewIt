/* eslint-env mocha */
/* global expect, module, require, self */

'use strict';

(function ()
{
    var JScrewIt = typeof module !== 'undefined' ? require('../node-jscrewit-test') : self.JScrewIt;

    describe
    (
        'JScrewIt.debug.trimJS',
        function ()
        {
            it
            (
                'trims spaces',
                function ()
                {
                    var input = '\n \uFEFF\t\ralert(1)\r\t \uFEFF\n';
                    var expected = 'alert(1)';
                    var actual = JScrewIt.debug.trimJS(input);
                    expect(actual).toBe(expected);
                }
            );
            it
            (
                'trims single-line comments',
                function ()
                {
                    var input = '// Hello\u2028//World!\nalert(1)\n//Goodbye\u2029// World!';
                    var expected = 'alert(1)';
                    var actual = JScrewIt.debug.trimJS(input);
                    expect(actual).toBe(expected);
                }
            );
            it
            (
                'trims multiline comments',
                function ()
                {
                    var input = '/*/**//* || pipes\n//slashes */\ralert(1)\r/* and stuff */\n';
                    var expected = 'alert(1)';
                    var actual = JScrewIt.debug.trimJS(input);
                    expect(actual).toBe(expected);
                }
            );
            it
            (
                'trims empty script comments',
                function ()
                {
                    var input = '/* Introduction */\n// The end.\n';
                    var expected = '';
                    var actual = JScrewIt.debug.trimJS(input);
                    expect(actual).toBe(expected);
                }
            );
            it
            (
                'does not remove comments between code',
                function ()
                {
                    var input = '/*A*/\nalert//B\n(/*C*/1\n//D\n)\n/*E*/';
                    var expected = 'alert//B\n(/*C*/1\n//D\n)';
                    var actual = JScrewIt.debug.trimJS(input);
                    expect(actual).toBe(expected);
                }
            );
            it
            (
                'does not remove false comment in multiline string',
                function ()
                {
                    var input = 'x="\\\n//"';
                    var expected = 'x="\\\n//"';
                    var actual = JScrewIt.debug.trimJS(input);
                    expect(actual).toBe(expected);
                }
            );
            it
            (
                'does not remove false comment in template string',
                function ()
                {
                    var input = 'x=`\n//`';
                    var expected = 'x=`\n//`';
                    var actual = JScrewIt.debug.trimJS(input);
                    expect(actual).toBe(expected);
                }
            );
        }
    );
}
)();
