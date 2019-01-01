/* eslint-env mocha */
/*
global
Symbol,
emuEval,
emuIt,
evalJSFuck,
expect,
getEmuFeatureNames,
maybeIt,
module,
repeat,
require,
self,
*/

'use strict';

(function ()
{
    function describeEncodeTest(compatibility)
    {
        var featureObj = Feature[compatibility];
        var emuFeatures = getEmuFeatureNames(featureObj);
        if (emuFeatures)
        {
            describe
            (
                'encodes with ' + compatibility + ' compatibility',
                function ()
                {
                    var expression1 = ' ; escape (\t"Hello, World!" ) ;';
                    it
                    (
                        JSON.stringify(expression1) + ' (with runAs: "express-call")',
                        function ()
                        {
                            var perfInfo = { };
                            var options =
                            { features: compatibility, perfInfo: perfInfo, runAs: 'express' };
                            var output = encode(expression1, options);
                            var actual = emuEval(emuFeatures, output);
                            expect(actual).toBe('Hello%2C%20World%21');
                            expect(perfInfo.perfLog).toBeArray();
                        }
                    );
                    var expression2 = 'Array.prototype.slice.call(["", ""])';
                    it
                    (
                        JSON.stringify(expression2) + ' (with runAs: "eval")',
                        function ()
                        {
                            var perfInfo = { };
                            var options =
                            { features: compatibility, perfInfo: perfInfo, runAs: 'eval' };
                            var output = encode(expression2, options);
                            var actual = emuEval(emuFeatures, output);
                            expect(actual).toEqual(['', '']);
                            expect(perfInfo.perfLog).toBeArray();
                        }
                    );
                    var expression3 = 'Boolean true';
                    it
                    (
                        JSON.stringify(expression3),
                        function ()
                        {
                            var perfInfo = { };
                            var options =
                            { features: compatibility, perfInfo: perfInfo, runAs: 'none' };
                            var output = encode(expression3, options);
                            var actual = emuEval(emuFeatures, output);
                            expect(actual).toBe(expression3);
                            expect(perfInfo.perfLog).toBeArray();
                        }
                    );
                    var expression4 = repeat('☺', 20);
                    it
                    (
                        JSON.stringify(expression4) + ' (with runAs: "none")',
                        function ()
                        {
                            var perfInfo = { };
                            var options =
                            { features: compatibility, perfInfo: perfInfo, runAs: 'none' };
                            var output = encode(expression4, options);
                            var actual = emuEval(emuFeatures, output);
                            expect(actual).toBe(expression4);
                            expect(perfInfo.perfLog).toBeArray();
                        }
                    );
                }
            );
        }
    }

    function nestedBrackets(count)
    {
        var str = repeat('[', count) + repeat(']', count);
        return str;
    }

    var JScrewIt = typeof module !== 'undefined' ? require('../node-jscrewit-test') : self.JScrewIt;
    var Feature = JScrewIt.Feature;
    var encode = JScrewIt.encode;

    describe
    (
        'JScrewIt.encode',
        function ()
        {
            describeEncodeTest('DEFAULT');
            describeEncodeTest('BROWSER');
            describeEncodeTest('COMPACT');
            describeEncodeTest('AUTO');
            describe
            (
                'encodes an empty string with runAs',
                function ()
                {
                    function test(runAs, regExp)
                    {
                        it
                        (
                            runAs,
                            function ()
                            {
                                var output = encode('', { runAs: runAs });
                                expect(output).toMatch(regExp);
                            }
                        );
                    }

                    test('none', /^\[]\+\[]$/);
                    test('call', /\(\)\(\)$/);
                    test('eval', /\(\)$/);
                    test('express-call', /^$/);
                    test('express-eval', /^$/);
                }
            );
            describe
            (
                'encodes a single digit with runAs',
                function ()
                {
                    function test(runAs, regExp)
                    {
                        it
                        (
                            runAs,
                            function ()
                            {
                                var output = encode(2, { runAs: runAs });
                                expect(output).toMatch(regExp);
                            }
                        );
                    }

                    it
                    (
                        'none',
                        function ()
                        {
                            var output = encode(2, { runAs: 'none' });
                            expect(output).toBe('!![]+!![]+[]');
                        }
                    );
                    test('call', /\(!!\[]\+!!\[]\)\(\)$/);
                    test('eval', /\(!!\[]\+!!\[]\+\[]\)$/);
                    test('express', /^!!\[]\+!!\[]$/);
                }
            );
            describe
            (
                'with runAs express',
                function ()
                {
                    describe
                    (
                        'encodes',
                        function ()
                        {
                            function twoToNineReplacer(digit)
                            {
                                var replacement = '!![]' + repeat('+!![]', digit - 1);
                                return replacement;
                            }

                            function test(description, input, expectedPattern, expectedValue)
                            {
                                it
                                (
                                    description,
                                    function ()
                                    {
                                        var actual = encode(input, { runAs: 'express' });
                                        var regExpPattern =
                                        '^' +
                                        expectedPattern
                                        .replace(/0/g, '+[]')
                                        .replace(/1/g, '+!![]')
                                        .replace(/[2-9]/g, twoToNineReplacer)
                                        .replace(/(?=[^!*])/g, '\\')
                                        .replace(/\*/g, ASTERISK_REPLACEMENT) +
                                        '$';
                                        var expectedRegExp = RegExp(regExpPattern);
                                        expect(actual).toMatch(expectedRegExp);
                                        if (expectedValue !== undefined)
                                            expect(evalJSFuck(actual)).toBe(expectedValue);
                                    }
                                );
                            }

                            var ASTERISK_REPLACEMENT =
                            (function ()
                            {
                                var DEPTH = 13;

                                var replacement =
                                repeat('(?:[+!]|[([]', DEPTH) + '[+!]*' + repeat('[)\\]])*', DEPTH);
                                return replacement;
                            }
                            )();

                            // General
                            test('an empty script', ';\n', '');
                            test
                            (
                                'all separators',
                                '\t\n\v\f\r \xa0\u1680\u2000\u2001\u2002\u2003\u2004\u2005' +
                                '\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000' +
                                '\ufeff/*lorem\n/*///ipsum\n0',
                                '+[]'
                            );
                            test('identifiers', 'String', '*(*)()', String);
                            test
                            (
                                'escaped identifiers',
                                '\\u0053\\u0074\\u0072\\u0069\\u006e\\u0067',
                                '*(*)()',
                                \u0053\u0074\u0072\u0069\u006e\u0067
                            );
                            test('unsigned numbers', '4.25E-7', '+(*)', 4.25e-7);
                            test('double-quoted strings', '"He\\x6c\\u006Co!"', '*', 'Hello!');
                            test('single-quoted strings', '\'Hel\\\r\nlo\\0\'', '*', 'Hello\0');
                            test('empty arrays', '[]', '[]');
                            test('singleton arrays', '[0]', '[0]');
                            test('sums', '1+1', '1+(1)');

                            // Boolean and undefined literals
                            test('false', 'false', '![]');
                            test('true', 'true', '!![]');
                            test('undefined', 'undefined', '[][[]]');

                            // Numeric expressions
                            test('Infinity', 'Infinity', '+(*)', Infinity);
                            test('NaN', 'NaN', '+[![]]');
                            test('hexadecimal literals', '0x1Fa', '+(*)', 506);
                            test('signed numbers', '+42', '+(*)', 42);
                            test
                            (
                                'numbers with absolute value part starting with "0."',
                                '-0.9',
                                '+((*)[*]+(*)[*]+(9))',
                                -0.9
                            );
                            test
                            (
                                'numbers with 9 trailing zeros',
                                '1000000000',
                                '+(1+[0]+(0)+(0)+(0)+(0)+(0)+(0)+(0)+(0))',
                                1000000000
                            );
                            test
                            (
                                'numbers with 10 trailing zeros',
                                '10000000000',
                                '+(*+(1)+(0))',
                                10000000000
                            );
                            test
                            (
                                'numbers with dot above 1',
                                '12.12',
                                '+(1+[2]+*+(1)+(2))',
                                12.12
                            );
                            test
                            (
                                'numbers with dot below 1',
                                '0.123',
                                '+(*+(1)+(2)+(3))',
                                0.123
                            );
                            test
                            (
                                'numbers below 0.1 represented with a dot',
                                '123e-21',
                                '+(*+(1)+(2)+(3))',
                                123e-21
                            );
                            test
                            (
                                'numbers below 0.1 represented in expontential notation',
                                '123e-22',
                                '+(1+[2]+(3)+*+(2)+(2))',
                                123e-22
                            );
                            test
                            (
                                'numbers represented with a power of 10 exponent',
                                '1e-37',
                                '+(1+[0]+*+(4)+(0))',
                                1e-37
                            );
                            test
                            (
                                'numbers represented with a non power of 10 exponent',
                                '1e-36',
                                '+(1+(*)[*]+*+(3)+(6))',
                                1e-36
                            );
                            test
                            (
                                'numbers represented with a power of 100 exponent',
                                '1e-293',
                                '+(1+[0]+*+(3)+(0)+(0))',
                                1e-293
                            );
                            test
                            (
                                'numbers represented with a non power of 100 exponent',
                                '1e-292',
                                '+(1+(*)[*]+*+(2)+(9)+(2))',
                                1e-292
                            );
                            test
                            (
                                'numbers with decrementable last digit',
                                '5e-324',
                                '+(3+(*)[*]+*+(3)+(2)+(4))',
                                5e-324
                            );
                            test('-Infinity', '-Infinity', '+(*)', -Infinity);
                            test('-0', '-0', '+(*+(0))', -0);
                            test('-NaN', '-NaN', '+[![]]');

                            // Arrays
                            test('nested arrays', '[[0]]', '[[0]]');

                            // Operations
                            test('indexers', 'false[+x]', '(![])[+*]');
                            test('undefined indexers', '0[undefined]', '(0)[[][[]]]');
                            test('array of undefined indexers', '0[[undefined]]', '(0)[[]]');
                            test('dot properties', 'Array.isArray', '*(*)()[*]', Array.isArray);
                            test
                            (
                                'dot properties with constant-like names',
                                'self.undefined',
                                '*[[][[]]]'
                            );
                            test('calls without parameters', 'Number()', '*(*)()()', 0);
                            test
                            (
                                'calls with parameters',
                                'encodeURI("%^")',
                                '*(*)()(*)',
                                '%25%5E'
                            );

                            // Modifiers
                            test('modified constants', '!-0', '!![]');
                            test('modified strings', '+"false"', '+(![]+[])');
                            test
                            (
                                'outer modifiers in call expressions on constants',
                                '+undefined()',
                                '+[][[]]()'
                            );
                            test
                            (
                                'inner modifiers in composite expressions',
                                '(!x)()',
                                '(!*)()'
                            );
                            test('redundant modifiers on constants', '-+ +-!!!+!!42', '0');
                            test
                            (
                                'redundant modifiers on non-constants',
                                '-+ +-!!!-!!+ ++!+""[0]++',
                                '+!++!([]+[])[0]++'
                            );

                            // Groupings
                            test
                            (
                                'superfluous grouping parentheses',
                                '(((a)())([([])])[(+(1)-(+2))].b)',
                                '*(*)()()([[]])[1+(+*)][*]'
                            );

                            // Separators
                            test
                            (
                                'superfluous separators',
                                ';a ( ) ( ( [ [ ] ] ) ) [ + 1 - + 2 ] . b;',
                                '*(*)()()([[]])[1+(+*)][*]'
                            );

                            // Concatenations
                            test
                            (
                                'concatenations of a modified concatenation',
                                '+([]+[])+[]',
                                '+([]+[])+[]',
                                '0'
                            );
                            test
                            (
                                'concatenations of properties of a concatenation',
                                '(![]+[])[0]+[]',
                                '(![]+[])[0]+[]',
                                'f'
                            );

                            // Sums
                            test('dissociable sums', '(0+1)+2', '0+(1)+(2)');
                            test('undissociable sums', '0+(1+2)', '0+(1+(2))');
                            test('sums of modified sums', '0+(+(1+2))', '0+(+(1+(2)))');

                            // Subtractions
                            test('string minuhends', '"false" - - 1', '+(![]+[])+(1)');
                            test('', '1+1-(-1)', '1+(1)+(1)');

                            // Pre-increments
                            test('pre-incremented call expression', '++false()', '++(![])()');
                            test('pre-incremented left-hand expression', '++[][0]', '++[][0]');

                            // Post-increments
                            test('post-increments', '[0][0]++', '[0][0]++');
                            test
                            (
                                'post-increments separated by a space',
                                '[0][0] ++',
                                '[0][0]++'
                            );
                            test
                            (
                                'post-increments separated by a one-line multi-line comment',
                                '[0][0]/**/++',
                                '[0][0]++'
                            );
                            test
                            (
                                'modified grouped post-increments',
                                '!([0][0]++)',
                                '![0][0]++'
                            );
                            test
                            (
                                'grouped post-increments with operators',
                                '([0].a++)[0]',
                                '([0][(![]+[])[+!![]]]++)[0]'
                            );
                            test
                            (
                                'Post-increment arithmetic subtraction',
                                '[0][0]++ - 1',
                                '[0][0]+++*',
                                -1
                            );

                            // Limits
                            var str = nestedBrackets(1000);
                            test('deep nestings', str, str);
                        }
                    );
                    describe
                    (
                        'does not encode',
                        function ()
                        {
                            function test(description, input)
                            {
                                it
                                (
                                    description,
                                    function ()
                                    {
                                        var fn = encode.bind(null, input, { runAs: 'express' });
                                        expect(fn).toThrowStrictly(Error, 'Encoding failed');
                                    }
                                );
                            }

                            test('the Mongolian vowel separator', '\u180e');
                            test('missing dots in properties of decimal literals', '0.f');
                            test('octal literals', '0o42');
                            test('binary literals', '0b101010');
                            test('octal escape sequences', '"\\1"');
                            test('extended Unicode escape sequences', '"\\u{1}"');
                            test('the unescaped character U+2028 in a string literal', '"\u2028"');
                            test('the unescaped character U+2029 in a string literal', '"\u2029"');
                            test('legacy octal literals', '010');
                            test('legacy octal-like literals', '09');
                            test('illegal identifiers with escape sequences', 'f\\u0020o');
                            test('inescapable literals with escape sequences', 'f\\u0061lse');
                            test('object literal parameters', 'doSomething({})');
                            test('object literal indexers', 'array[{}]');
                            test('more than one parameter', 'parseInt("10", 2)');
                            test('keywords', 'debugger');
                            test('pre-decrements', '--i');
                            test('pre-increments on number', '++0');
                            test('pre-increments on array', '++[]');
                            test('pre-increments on indetifier', '++a');
                            test('post-incremented arrays', '[]++');
                            test('post-incremented indetifiers', 'a++');
                            test('post-increments followed by an operation', '[0][0]++[0]');
                            test
                            (
                                'post-increments separated by a line terminator',
                                '[0][0]\n++'
                            );
                            test
                            (
                                'post-increments separated by a single-line comment',
                                '[0][0]//\u2028++'
                            );
                            test
                            (
                                'post-increments separated by a multi-line comment',
                                '[0][0]/*\u2029*/++'
                            );
                            test('double post-increments', '([0][0]++)++');
                            test
                            (
                                'unmodified unmatched grouping parentheses around constant',
                                '(0'
                            );
                            test('modified unmatched grouping parentheses', '-(1');
                            test('unclosed parenthesis after expression', 'alert((""');
                            test('unclosed empty array square bracket', '[');
                            test('unclosed singleton array square bracket', '[0');
                            test('unclosed indexer square bracket', '0[0');
                            test('unrecognized tokens', 'a...');
                            test('too deep nestings', nestedBrackets(1001));
                            test('minus signed standalone strings', '-""');
                            test('modified minus signed strings', '++-""');
                            test('minus signed strings as first terms in a sum', '-"" + ""');
                            test('minus signed arrays', '-[]');
                            test('operations on minus signed arrays', '(-[])()');
                            test('string subtrahends', '1 - ""');
                            test('grouped string subtrahend subtractions', '(1 - "")');
                            test('array subtrahends', '1 - []');
                            test('empty parentheses', '()');
                            test('multiple statements', '1;2');
                        }
                    );
                }
            );
            describe
            (
                'with option trimCode',
                function ()
                {
                    it
                    (
                        'uses trimJS',
                        function ()
                        {
                            var output = encode('/* */\nABC\n', { runAs: 'none', trimCode: true });
                            var actual = evalJSFuck(output);
                            expect(actual).toBe('ABC');
                        }
                    );
                    it
                    (
                        'encodes a script consisting of only blanks and comments',
                        function ()
                        {
                            var output = encode('/* */\n', { runAs: 'none', trimCode: true });
                            var actual = evalJSFuck(output);
                            expect(actual).toBe('');
                        }
                    );
                    it
                    (
                        'encodes malformed JavaScript',
                        function ()
                        {
                            var output = encode('/* */"ABC', { runAs: 'none', trimCode: true });
                            var actual = evalJSFuck(output);
                            expect(actual).toBe('/* */"ABC');
                        }
                    );
                }
            );
            it
            (
                'encodes undefined for missing parameter',
                function ()
                {
                    var output = encode();
                    expect(output).toBe('[][[]]');
                }
            );
            it
            (
                'encodes an object',
                function ()
                {
                    var obj =
                    {
                        toString:
                        function ()
                        {
                            return '1';
                        },
                        valueOf:
                        function ()
                        {
                            return '0';
                        },
                    };
                    var output = encode(obj);
                    expect(output).toBe('+!![]');
                }
            );
            it
            (
                'throws an Error for incompatible features',
                function ()
                {
                    var fn =
                    function ()
                    {
                        encode('', { features: ['NO_IE_SRC', 'IE_SRC'] });
                    };
                    expect(fn).toThrowStrictly(Error, 'Incompatible features');
                }
            );
            it
            (
                'throws an error for invalid runAs',
                function ()
                {
                    var fn =
                    function ()
                    {
                        encode('', { runAs: null });
                    };
                    expect(fn).toThrowStrictly(Error, 'Invalid value for option runAs');
                }
            );
            it
            (
                'still supports option wrapWith',
                function ()
                {
                    var input = 'alert(1)';
                    var actual = encode(input, { wrapWith: 'call' });
                    var expected = encode(input, { runAs: 'call' });
                    expect(actual).toBe(expected);
                }
            );
            it
            (
                'throws an error for invalid wrapWith',
                function ()
                {
                    var fn =
                    function ()
                    {
                        encode('', { wrapWith: true });
                    };
                    expect(fn).toThrowStrictly(Error, 'Invalid value for option wrapWith');
                }
            );
            maybeIt
            (
                typeof Symbol !== 'undefined',
                'throws a TypeError when the first argument is a symbol',
                function ()
                {
                    var fn = encode.bind(null, Symbol());
                    expect(fn).toThrowStrictly(TypeError, 'Cannot convert a symbol to a string');
                }
            );
        }
    );
}
)();
