/* eslint-env ebdd/ebdd */
/*
global
Symbol,
emuEval,
evalJSFuck,
expect,
getEmuFeatureNames,
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
                    var paramDataList =
                    [
                        ['none', /^\[]\+\[]$/],
                        ['call', /\(\)\(\)$/],
                        ['eval', /\(\)$/],
                        ['express-call', /^$/],
                        ['express-eval', /^$/],
                    ];

                    it.per(paramDataList)
                    (
                        '#[0]',
                        function (paramData)
                        {
                            var runAs   = paramData[0];
                            var regExp  = paramData[1];
                            var output = encode('', { runAs: runAs });
                            expect(output).toMatch(regExp);
                        }
                    );
                }
            );
            describe
            (
                'encodes a single digit with runAs',
                function ()
                {
                    it
                    (
                        'none',
                        function ()
                        {
                            var output = encode(2, { runAs: 'none' });
                            expect(output).toBe('!![]+!![]+[]');
                        }
                    );
                    it.per
                    (
                        [
                            ['call', /\(!!\[]\+!!\[]\)\(\)$/],
                            ['eval', /\(!!\[]\+!!\[]\+\[]\)$/],
                            ['express', /^!!\[]\+!!\[]$/],
                        ]
                    )
                    (
                        '#[0]',
                        function (paramData)
                        {
                            var runAs   = paramData[0];
                            var regExp  = paramData[1];
                            var output = encode(2, { runAs: runAs });
                            expect(output).toMatch(regExp);
                        }
                    );
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

                            var ASTERISK_REPLACEMENT =
                            (function ()
                            {
                                var DEPTH = 14;

                                var replacement =
                                repeat('(?:[+!]|[([]', DEPTH) + '[+!]*' + repeat('[)\\]])*', DEPTH);
                                return replacement;
                            }
                            )();

                            var nestedBracketsStr = nestedBrackets(1000);
                            var paramDataList =
                            [
                                // General
                                ['an empty script', ';\n', ''],
                                [
                                    'all separators',
                                    '\t\n\v\f\r \xa0\u1680\u2000\u2001\u2002\u2003\u2004\u2005' +
                                    '\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000' +
                                    '\ufeff/*lorem\n/*///ipsum\n0',
                                    '+[]',
                                ],
                                ['identifiers', 'String', '*(*)()', String],
                                [
                                    'escaped identifiers',
                                    '\\u0053\\u0074\\u0072\\u0069\\u006e\\u0067',
                                    '*(*)()',
                                    \u0053\u0074\u0072\u0069\u006e\u0067,
                                ],
                                ['unsigned numbers', '4.25E-7', '+(*)', 4.25e-7],
                                ['double-quoted strings', '"He\\x6c\\u006Co!"', '*', 'Hello!'],
                                ['single-quoted strings', '\'Hel\\\r\nlo\\0\'', '*', 'Hello\0'],
                                ['empty arrays', '[]', '[]'],
                                ['singleton arrays', '[0]', '[0]'],
                                ['sums', '1+1', '1+(1)'],

                                // Boolean and undefined literals
                                ['false', 'false', '![]'],
                                ['true', 'true', '!![]'],
                                ['undefined', 'undefined', '[][[]]'],

                                // Numeric expressions
                                ['Infinity', 'Infinity', '+(*)', Infinity],
                                ['NaN', 'NaN', '+[![]]'],
                                ['hexadecimal literals', '0x1Fa', '+(*)', 506],
                                ['signed numbers', '+42', '+(*)', 42],
                                [
                                    'numbers with absolute value part starting with "0."',
                                    '-0.9',
                                    '+((*)[*]+(*)[*]+(9))',
                                    -0.9,
                                ],
                                [
                                    'numbers with 9 trailing zeros',
                                    '1000000000',
                                    '+(1+[0]+(0)+(0)+(0)+(0)+(0)+(0)+(0)+(0))',
                                    1000000000,
                                ],
                                [
                                    'numbers with 10 trailing zeros',
                                    '10000000000',
                                    '+(*+"e"+(1)+(0))',
                                    10000000000,
                                ],
                                [
                                    'numbers with dot above 1',
                                    '12.12',
                                    '+(1+[2]+*+(1)+(2))',
                                    12.12,
                                ],
                                [
                                    'numbers with dot below 1',
                                    '0.123',
                                    '+(*+(1)+(2)+(3))',
                                    0.123,
                                ],
                                [
                                    'numbers below 0.1 represented with a dot',
                                    '123e-21',
                                    '+(*+(1)+(2)+(3))',
                                    123e-21,
                                ],
                                [
                                    'numbers below 0.1 represented in expontential notation',
                                    '123e-22',
                                    '+(1+[2]+(3)+"e"+*+(2)+(2))',
                                    123e-22,
                                ],
                                [
                                    'numbers with positive exponent ending in 99 and single ' +
                                    'digit mantissa',
                                    '1e99',
                                    '+(1+"e"+(9)+(9))',
                                    1e99,
                                ],
                                [
                                    'numbers with positive exponent ending in 99 and multiple ' +
                                    'digit mantissa',
                                    '12e99',
                                    '+(1+*+(2)+"e"+(1)+(0)+(0))',
                                    12e99,
                                ],
                                [
                                    'numbers with positive 3-digit exponent ending in 99',
                                    '1e199',
                                    '+(*+(1)+"e"+(2)+(0)+(0))',
                                    1e199,
                                ],
                                [
                                    'numbers represented with a negative multiple of 10 exponent',
                                    '1e-37',
                                    '+(1+*+"e"+*+(4)+(0))',
                                    1e-37,
                                ],
                                [
                                    'numbers represented with a negative non-multiple of 10 ' +
                                    'exponent',
                                    '1e-36',
                                    '+(1+"e"+*+(3)+(6))',
                                    1e-36,
                                ],
                                [
                                    'numbers represented with a negative multiple of 100 exponent',
                                    '1e-293',
                                    '+(1+*+"e"+*+(3)+(0)+(0))',
                                    1e-293,
                                ],
                                [
                                    'numbers represented with a negative non-multiple of 100 ' +
                                    'exponent',
                                    '1e-292',
                                    '+(1+"e"+*+(2)+(9)+(2))',
                                    1e-292,
                                ],
                                [
                                    'numbers with decrementable last digit',
                                    '5e-324',
                                    '+(3+"e"+*+(3)+(2)+(4))',
                                    5e-324,
                                ],
                                ['-Infinity', '-Infinity', '+(*)', -Infinity],
                                ['-0', '-0', '+(*+(0))', -0],
                                ['-NaN', '-NaN', '+[![]]'],

                                // Arrays
                                ['nested arrays', '[[0]]', '[[0]]'],

                                // Operations
                                ['indexers', 'false[+x]', '(![])[+*]'],
                                ['undefined indexers', '0[undefined]', '(0)[[][[]]]'],
                                ['array of undefined indexers', '0[[undefined]]', '(0)[[]]'],
                                ['dot properties', 'Array.isArray', '*(*)()[*]', Array.isArray],
                                [
                                    'dot properties with constant-like names',
                                    'self.undefined',
                                    '*[[][[]]]',
                                ],
                                ['calls without parameters', 'Number()', '*(*)()()', 0],
                                [
                                    'calls with parameters',
                                    'encodeURI("%^")',
                                    '*(*)()(*)',
                                    '%25%5E',
                                ],

                                // Modifiers
                                ['modified constants', '!-0', '!![]'],
                                ['modified strings', '+"false"', '+(![]+[])'],
                                [
                                    'outer modifiers in call expressions on constants',
                                    '+undefined()',
                                    '+[][[]]()',
                                ],
                                ['inner modifiers in composite expressions', '(!x)()', '(!*)()'],
                                ['redundant modifiers on constants', '-+ +-!!!+!!42', '0'],
                                [
                                    'redundant modifiers on non-constants',
                                    '-+ +-!!!-!!+ ++!+""[0]++',
                                    '+!++!([]+[])[0]++',
                                ],

                                // Groupings
                                [
                                    'superfluous grouping parentheses',
                                    '(((a)())([([])])[(+(1)-(+2))].b)',
                                    '*(*)()()([[]])[1+(+*)][*]',
                                ],

                                // Separators
                                [
                                    'superfluous separators',
                                    ';a ( ) ( ( [ [ ] ] ) ) [ + 1 - + 2 ] . b;',
                                    '*(*)()()([[]])[1+(+*)][*]',
                                ],

                                // Concatenations
                                [
                                    'concatenations of a modified concatenation',
                                    '+([]+[])+[]',
                                    '+([]+[])+[]',
                                    '0',
                                ],
                                [
                                    'concatenations of properties of a concatenation',
                                    '(![]+[])[0]+[]',
                                    '(![]+[])[0]+[]',
                                    'f',
                                ],

                                // Sums
                                ['dissociable sums', '(0+1)+2', '0+(1)+(2)'],
                                ['undissociable sums', '0+(1+2)', '0+(1+(2))'],
                                ['sums of modified sums', '0+(+(1+2))', '0+(+(1+(2)))'],

                                // Subtractions
                                ['string minuhends', '"false" - - 1', '+(![]+[])+(1)'],
                                ['composite minuhends', '1+1-(-1)', '1+(1)+(1)'],

                                // Pre-increments
                                ['pre-incremented call expression', '++false()', '++(![])()'],
                                ['pre-incremented left-hand expression', '++[][0]', '++[][0]'],

                                // Post-increments
                                ['post-increments', '[0][0]++', '[0][0]++'],
                                ['post-increments separated by a space', '[0][0] ++', '[0][0]++'],
                                [
                                    'post-increments separated by a one-line multi-line comment',
                                    '[0][0]/**/++',
                                    '[0][0]++',
                                ],
                                ['modified grouped post-increments', '!([0][0]++)', '![0][0]++'],
                                [
                                    'grouped post-increments with operators',
                                    '([0].a++)[0]',
                                    '([0][(![]+[])[+!![]]]++)[0]',
                                ],
                                [
                                    'post-increment arithmetic subtraction',
                                    '[0][0]++ - 1',
                                    '[0][0]+++*',
                                    -1,
                                ],

                                // Limits
                                ['deep nestings', nestedBracketsStr, nestedBracketsStr],
                            ];

                            it.per(paramDataList)
                            (
                                '#[0]',
                                function (paramData)
                                {
                                    var input           = paramData[1];
                                    var expectedPattern = paramData[2];
                                    var expectedValue   = paramData[3];
                                    var actual = encode(input, { runAs: 'express' });
                                    var regExpPattern =
                                    '^' +
                                    expectedPattern
                                    .replace(/0/g, '+[]')
                                    .replace(/1/g, '+!![]')
                                    .replace(/[2-9]/g, twoToNineReplacer)
                                    .replace(/"e"/g, '(!![]+[])[!![]+!![]+!![]]')
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
                    );
                    describe
                    (
                        'does not encode',
                        function ()
                        {
                            var paramDataList =
                            [
                                ['the Mongolian vowel separator', '\u180e'],
                                ['missing dots in properties of decimal literals', '0.f'],
                                ['octal literals', '0o42'],
                                ['binary literals', '0b101010'],
                                ['octal escape sequences', '"\\1"'],
                                ['extended Unicode escape sequences', '"\\u{1}"'],
                                ['the unescaped character U+2028 in a string literal', '"\u2028"'],
                                ['the unescaped character U+2029 in a string literal', '"\u2029"'],
                                ['legacy octal literals', '010'],
                                ['legacy octal-like literals', '09'],
                                ['illegal identifiers with escape sequences', 'f\\u0020o'],
                                ['inescapable literals with escape sequences', 'f\\u0061lse'],
                                ['object literal parameters', 'doSomething({})'],
                                ['object literal indexers', 'array[{}]'],
                                ['more than one parameter', 'parseInt("10", 2)'],
                                ['keywords', 'debugger'],
                                ['pre-decrements', '--i'],
                                ['pre-increments on number', '++0'],
                                ['pre-increments on array', '++[]'],
                                ['pre-increments on indetifier', '++a'],
                                ['post-incremented arrays', '[]++'],
                                ['post-incremented indetifiers', 'a++'],
                                ['post-increments followed by an operation', '[0][0]++[0]'],
                                ['post-increments separated by a line terminator', '[0][0]\n++'],
                                [
                                    'post-increments separated by a single-line comment',
                                    '[0][0]//\u2028++',
                                ],
                                [
                                    'post-increments separated by a multi-line comment',
                                    '[0][0]/*\u2029*/++',
                                ],
                                ['double post-increments', '([0][0]++)++'],
                                ['unmodified unmatched grouping parentheses around constant', '(0'],
                                ['modified unmatched grouping parentheses', '-(1'],
                                ['unclosed parenthesis after expression', 'alert((""'],
                                ['unclosed empty array square bracket', '['],
                                ['unclosed singleton array square bracket', '[0'],
                                ['unclosed indexer square bracket', '0[0'],
                                ['unrecognized tokens', 'a...'],
                                ['too deep nestings', nestedBrackets(1001)],
                                ['minus signed standalone strings', '-""'],
                                ['modified minus signed strings', '++-""'],
                                ['minus signed strings as first terms in a sum', '-"" + ""'],
                                ['minus signed arrays', '-[]'],
                                ['operations on minus signed arrays', '(-[])()'],
                                ['string subtrahends', '1 - ""'],
                                ['grouped string subtrahend subtractions', '(1 - "")'],
                                ['array subtrahends', '1 - []'],
                                ['empty parentheses', '()'],
                                ['multiple statements', '1;2'],
                            ];

                            it.per(paramDataList)
                            (
                                '#[0]',
                                function (paramData)
                                {
                                    var input = paramData[1];
                                    var fn = encode.bind(null, input, { runAs: 'express' });
                                    expect(fn).toThrowStrictly(Error, 'Encoding failed');
                                }
                            );
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
            it.when(typeof Symbol !== 'undefined')
            (
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
