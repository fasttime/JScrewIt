/* eslint-env mocha */
/*
global
EMU_FEATURES,
Audio,
Node,
Symbol,
atob,
btoa,
document,
emuDo,
emuEval,
evalJSFuck,
expect,
module,
repeat,
require,
self,
uneval,
*/

(function ()
{
    'use strict';

    function decodeEntry(entry)
    {
        var featureObj = getEntryFeature(entry);
        var solution = decodeEntryWithFeature(entry, featureObj);
        return solution;
    }

    function decodeEntryWithFeature(entry, featureObj)
    {
        var encoder = getPoolEncoder(featureObj);
        var solution = encoder.resolve(entry.definition);
        return solution;
    }

    function describeEncodeTest(compatibility)
    {
        var featureObj = Feature[compatibility];
        var emuFeatures = getEmuFeatureNames(featureObj);
        if (emuFeatures)
        {
            describe(
                'encodes with ' + compatibility + ' compatibility',
                function ()
                {
                    var expression1 = ' ; escape (\t"Hello, World!" ) ;';
                    it(
                        JSON.stringify(expression1) + ' (with runAs: "express-call")',
                        function ()
                        {
                            var perfInfo = { };
                            var options =
                                { features: compatibility, perfInfo: perfInfo, runAs: 'express' };
                            var output = JScrewIt.encode(expression1, options);
                            var actual = emuEval(emuFeatures, output);
                            expect(actual).toBe('Hello%2C%20World%21');
                            expect(perfInfo.codingLog).toBeArray();
                        }
                    );
                    var expression2 = 'decodeURI(encodeURI("♠♥♦♣"))';
                    it(
                        JSON.stringify(expression2) + ' (with runAs: "eval")',
                        function ()
                        {
                            var perfInfo = { };
                            var options =
                                { features: compatibility, perfInfo: perfInfo, runAs: 'eval' };
                            var output = JScrewIt.encode(expression2, options);
                            var actual = emuEval(emuFeatures, output);
                            expect(actual).toBe('♠♥♦♣');
                            expect(perfInfo.codingLog).toBeArray();
                        }
                    );
                    var expression3 = 'Boolean true';
                    var encoder = JScrewIt.debug.createEncoder(compatibility);
                    var expectedEncoding3 = encoder.replaceExpr('"Boolean" + " " + true');
                    it(
                        JSON.stringify(expression3),
                        function ()
                        {
                            var perfInfo = { };
                            var options =
                                { features: compatibility, perfInfo: perfInfo, runAs: 'none' };
                            var output = JScrewIt.encode(expression3, options);
                            var actual = emuEval(emuFeatures, output);
                            expect(actual).toBe(expression3);
                            expect(output).toBe(expectedEncoding3);
                            expect(perfInfo.codingLog).toBeArray();
                        }
                    );
                    var expression4 = repeat('☺', 20);
                    it(
                        JSON.stringify(expression4) + ' (with runAs: "none")',
                        function ()
                        {
                            var perfInfo = { };
                            var options =
                                { features: compatibility, perfInfo: perfInfo, runAs: 'none' };
                            var output = JScrewIt.encode(expression4, options);
                            var actual = emuEval(emuFeatures, output);
                            expect(actual).toBe(expression4);
                            expect(perfInfo.codingLog).toBeArray();
                        }
                    );
                }
            );
        }
    }

    function describeTests()
    {
        describe(
            'JScrewIt',
            function ()
            {
                it(
                    'is set up correctly',
                    function ()
                    {
                        var self = { };
                        JScrewIt.debug.setUp(self);
                        expect(self.JScrewIt).toBe(JScrewIt);
                        expect(Object.getOwnPropertyNames(self)).toEqual(['JScrewIt']);
                    }
                );
                it(
                    'has no enumerable properties',
                    function ()
                    {
                        expect(JScrewIt).toEqual({ });
                    }
                );
                it(
                    'has no enumerable debug properties',
                    function ()
                    {
                        expect(JScrewIt.debug).toEqual({ });
                    }
                );
            }
        );
        describe(
            'Character definitions of',
            function ()
            {
                var charCode;
                for (charCode = 0; charCode < 256; ++charCode)
                    testCharacter(charCode);
                testCharacter(8734);    // ∞
                testCharacter(0x010f);  // hex code ending in "f"
                testCharacter(0x01fa);  // hex code ending in "fa"
                testCharacter(0x0bbc);  // candidate for toString clustering encoded with "B"
                testCharacter(0xbbbb);  // candidate for toString clustering encoded with "b"
            }
        );
        describe(
            'Complex definitions of',
            function ()
            {
                function test(complex)
                {
                    var desc = JSON.stringify(complex);
                    var entry = JScrewIt.debug.getComplexEntry(complex);
                    var featureObj = getEntryFeature(entry);
                    emuIt(
                        desc,
                        featureObj,
                        function (emuFeatures)
                        {
                            var encoder = getPoolEncoder(featureObj);
                            var definition = entry.definition;
                            var solution = encoder.resolve(definition);
                            expect(solution.level)
                            .toBe(definition.level, 'Solution level mismatch');
                            verifySolution(solution, complex, emuFeatures);
                        }
                    );
                }

                JScrewIt.debug.getComplexNames().forEach(test);
            }
        );
        describe(
            'Constant definitions of',
            function ()
            {
                testConstant('Array', isExpected(Array));
                testConstant(
                    'Audio',
                    function ()
                    {
                        this.toBe(Audio);
                    }
                );
                testConstant('Boolean', isExpected(Boolean));
                testConstant('Date', isExpected(Date));
                testConstant('Function', isExpected(Function));
                testConstant(
                    'Node',
                    function ()
                    {
                        this.toBe(Node);
                    }
                );
                testConstant('Number', isExpected(Number));
                testConstant('Object', isExpected(Object));
                testConstant('RegExp', isExpected(RegExp));
                testConstant('String', isExpected(String));
                testConstant(
                    'atob',
                    function ()
                    {
                        this.toBe(atob);
                    }
                );
                testConstant(
                    'btoa',
                    function ()
                    {
                        this.toBe(btoa);
                    }
                );
                testConstant(
                    'document',
                    function ()
                    {
                        this.toBe(document);
                    }
                );
                testConstant('escape', isExpected(escape));
                testConstant(
                    'self',
                    function ()
                    {
                        this.toBe(self);
                    }
                );
                testConstant('unescape', isExpected(unescape));
                testConstant(
                    'uneval',
                    function ()
                    {
                        this.toBe(uneval);
                    }
                );

                testConstant(
                    'ANY_FUNCTION',
                    function ()
                    {
                        this.toBeNativeFunction();
                    }
                );
                testConstant(
                    'ARRAY_ITERATOR',
                    function ()
                    {
                        var arrayIteratorPrototype = Object.getPrototypeOf([].entries());
                        this.toHavePrototype(arrayIteratorPrototype);
                    }
                );
                testConstant(
                    'FILL',
                    function ()
                    {
                        this.toBe(Array.prototype.fill);
                    }
                );
                testConstant(
                    'FILTER',
                    function ()
                    {
                        this.toBe(Array.prototype.filter);
                    }
                );
                testConstant(
                    'FROM_CHAR_CODE',
                    function ()
                    {
                        this.toMatch(/^from(?:CharCode|CodePoint)$/);
                    }
                );
                testConstant(
                    'PLAIN_OBJECT',
                    function ()
                    {
                        this.toBePlainObject();
                    }
                );
                testConstant(
                    'SUBSTR',
                    function ()
                    {
                        this.toMatch(/^(?:slice|substr)$/);
                    }
                );
                testConstant(
                    'TO_STRING',
                    function ()
                    {
                        this.toBe('toString');
                    }
                );
                testConstant(
                    'TO_UPPER_CASE',
                    function ()
                    {
                        this.toBe('toUpperCase');
                    }
                );
            }
        );
        describe(
            'JScrewIt.encode',
            function ()
            {
                describeEncodeTest('DEFAULT');
                describeEncodeTest('BROWSER');
                describeEncodeTest('COMPACT');
                describeEncodeTest('AUTO');
                describe(
                    'encodes an empty string with runAs',
                    function ()
                    {
                        function test(runAs, regExp)
                        {
                            it(
                                runAs,
                                function ()
                                {
                                    var output = JScrewIt.encode('', { runAs: runAs });
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
                describe(
                    'encodes a single digit with runAs',
                    function ()
                    {
                        function test(runAs, regExp)
                        {
                            it(
                                runAs,
                                function ()
                                {
                                    var output = JScrewIt.encode(2, { runAs: runAs });
                                    expect(output).toMatch(regExp);
                                }
                            );
                        }

                        it(
                            'none',
                            function ()
                            {
                                var output = JScrewIt.encode(2, { runAs: 'none' });
                                expect(output).toBe('!![]+!![]+[]');
                            }
                        );
                        test('call', /\(!!\[]\+!!\[]\)\(\)$/);
                        test('eval', /\(!!\[]\+!!\[]\)$/);
                        test('express', /^!!\[]\+!!\[]$/);
                    }
                );
                describe(
                    'with runAs express',
                    function ()
                    {
                        describe(
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
                                    it(
                                        description,
                                        function ()
                                        {
                                            var actual =
                                                JScrewIt.encode(input, { runAs: 'express' });
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
                                            repeat('(?:[+!]|[([]', DEPTH) +
                                            '[+!]*' +
                                            repeat('[)\\]])*', DEPTH);
                                        return replacement;
                                    }
                                    )();

                                // General
                                test('an empty script', ';\n', '');
                                test(
                                    'all separators',
                                    '\t\n\v\f\r \xa0\u1680\u2000\u2001\u2002\u2003\u2004\u2005' +
                                    '\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000' +
                                    '\ufeff/*lorem\n/*///ipsum\n0',
                                    '+[]'
                                );
                                test('identifiers', 'String', '*(*)()', String);
                                test(
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
                                test(
                                    'numbers with absolute value part starting with "0."',
                                    '-0.9',
                                    '+((*)[*]+(*)[*]+(9))',
                                    -0.9
                                );
                                test(
                                    'numbers with 9 trailing zeros',
                                    '1000000000',
                                    '+(1+[0]+(0)+(0)+(0)+(0)+(0)+(0)+(0)+(0))',
                                    1000000000
                                );
                                test(
                                    'numbers with 10 trailing zeros',
                                    '10000000000',
                                    '+(*+(1)+(0))',
                                    10000000000
                                );
                                test(
                                    'numbers with dot above 1',
                                    '12.12',
                                    '+(1+[2]+*+(1)+(2))',
                                    12.12
                                );
                                test(
                                    'numbers with dot below 1',
                                    '0.123',
                                    '+(*+(1)+(2)+(3))',
                                    0.123
                                );
                                test(
                                    'numbers below 0.1 represented with a dot',
                                    '123e-21',
                                    '+(*+(1)+(2)+(3))',
                                    123e-21
                                );
                                test(
                                    'numbers below 0.1 represented in expontential notation',
                                    '123e-22',
                                    '+(1+[2]+(3)+*+(2)+(2))',
                                    123e-22
                                );
                                test(
                                    'numbers represented with a power of 10 exponent',
                                    '1e-37',
                                    '+(1+[0]+*+(4)+(0))',
                                    1e-37
                                );
                                test(
                                    'numbers represented with a non power of 10 exponent',
                                    '1e-36',
                                    '+(1+(*)[*]+*+(3)+(6))',
                                    1e-36
                                );
                                test(
                                    'numbers represented with a power of 100 exponent',
                                    '1e-293',
                                    '+(1+[0]+*+(3)+(0)+(0))',
                                    1e-293
                                );
                                test(
                                    'numbers represented with a non power of 100 exponent',
                                    '1e-292',
                                    '+(1+(*)[*]+*+(2)+(9)+(2))',
                                    1e-292
                                );
                                test(
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
                                test(
                                    'dot properties with constant-like names',
                                    'self.undefined',
                                    '*[[][[]]]'
                                );
                                test('calls without parameters', 'Number()', '*(*)()()', 0);
                                test(
                                    'calls with parameters',
                                    'encodeURI("%^")',
                                    '*(*)()(*)',
                                    '%25%5E'
                                );

                                // Modifiers
                                test('modified constants', '!-0', '!![]');
                                test('modified strings', '+"false"', '+(![]+[])');
                                test(
                                    'outer modifiers in call expressions on constants',
                                    '+undefined()',
                                    '+[][[]]()'
                                );
                                test(
                                    'inner modifiers in composite expressions',
                                    '(!x)()',
                                    '(!*)()'
                                );
                                test('redundant modifiers on constants', '-+ +-!!!+!!42', '0');
                                test(
                                    'redundant modifiers on non-constants',
                                    '-+ +-!!!-!!+ ++!+""[0]++',
                                    '+!++!([]+[])[0]++'
                                );

                                // Groupings
                                test(
                                    'superfluous grouping parentheses',
                                    '(((a)())([([])])[(+(1)-(+2))].b)',
                                    '*(*)()()([[]])[1+(+*)][*]'
                                );

                                // Separators
                                test(
                                    'superfluous separators',
                                    ';a ( ) ( ( [ [ ] ] ) ) [ + 1 - + 2 ] . b;',
                                    '*(*)()()([[]])[1+(+*)][*]'
                                );

                                // Concatenations
                                test(
                                    'concatenations of a modified concatenation',
                                    '+([]+[])+[]',
                                    '+([]+[])+[]',
                                    '0'
                                );
                                test(
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
                                test(
                                    'post-increments separated by a space',
                                    '[0][0] ++',
                                    '[0][0]++'
                                );
                                test(
                                    'post-increments separated by a one-line multi-line comment',
                                    '[0][0]/**/++',
                                    '[0][0]++'
                                );
                                test(
                                    'modified grouped post-increments',
                                    '!([0][0]++)',
                                    '![0][0]++'
                                );
                                test(
                                    'grouped post-increments with operators',
                                    '([0].a++)[0]',
                                    '([0][(![]+[])[+!![]]]++)[0]'
                                );
                                test(
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
                        describe(
                            'does not encode',
                            function ()
                            {
                                function test(description, input)
                                {
                                    it(
                                        description,
                                        function ()
                                        {
                                            var fn =
                                                JScrewIt.encode.bind(
                                                    null,
                                                    input,
                                                    { runAs: 'express' }
                                                );
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
                                test(
                                    'post-increments separated by a line terminator',
                                    '[0][0]\n++'
                                );
                                test(
                                    'post-increments separated by a single-line comment',
                                    '[0][0]//\u2028++'
                                );
                                test(
                                    'post-increments separated by a multi-line comment',
                                    '[0][0]/*\u2029*/++'
                                );
                                test('double post-increments', '([0][0]++)++');
                                test(
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
                describe(
                    'with option trimCode',
                    function ()
                    {
                        it(
                            'uses trimJS',
                            function ()
                            {
                                var output =
                                    JScrewIt.encode(
                                        '/* */\nABC\n',
                                        { runAs: 'none', trimCode: true }
                                    );
                                var actual = evalJSFuck(output);
                                expect(actual).toBe('ABC');
                            }
                        );
                        it(
                            'encodes a script consisting of only blanks and comments',
                            function ()
                            {
                                var output =
                                    JScrewIt.encode(
                                        '/* */\n',
                                        { runAs: 'none', trimCode: true }
                                    );
                                var actual = evalJSFuck(output);
                                expect(actual).toBe('');
                            }
                        );
                        it(
                            'encodes malformed JavaScript',
                            function ()
                            {
                                var output =
                                    JScrewIt.encode(
                                        '/* */"ABC',
                                        { runAs: 'none', trimCode: true }
                                    );
                                var actual = evalJSFuck(output);
                                expect(actual).toBe('/* */"ABC');
                            }
                        );
                    }
                );

                it(
                    'encodes undefined for missing parameter',
                    function ()
                    {
                        var output = JScrewIt.encode();
                        expect(output).toBe('[][[]]');
                    }
                );
                it(
                    'encodes an object',
                    function ()
                    {
                        var obj =
                        {
                            toString: function ()
                            {
                                return '1';
                            },
                            valueOf: function ()
                            {
                                return '0';
                            }
                        };
                        var output = JScrewIt.encode(obj);
                        expect(output).toBe('+!![]');
                    }
                );
                it(
                    'throws an Error for incompatible features',
                    function ()
                    {
                        var fn =
                            function ()
                            {
                                JScrewIt.encode('', { features: ['NO_IE_SRC', 'IE_SRC'] });
                            };
                        expect(fn).toThrowStrictly(Error, 'Incompatible features');
                    }
                );
                it(
                    'throws an error for invalid runAs',
                    function ()
                    {
                        var fn =
                            function ()
                            {
                                JScrewIt.encode('', { runAs: null });
                            };
                        expect(fn).toThrowStrictly(Error, 'Invalid value for option runAs');
                    }
                );
                it(
                    'still supports option wrapWith',
                    function ()
                    {
                        var input = 'alert(1)';
                        var actual = JScrewIt.encode(input, { wrapWith: 'call' });
                        var expected = JScrewIt.encode(input, { runAs: 'call' });
                        expect(actual).toBe(expected);
                    }
                );
                it(
                    'throws an error for invalid wrapWith',
                    function ()
                    {
                        var fn =
                            function ()
                            {
                                JScrewIt.encode('', { wrapWith: true });
                            };
                        expect(fn).toThrowStrictly(Error, 'Invalid value for option wrapWith');
                    }
                );
                if (typeof Symbol !== 'undefined')
                {
                    it(
                        'throws a TypeError when the first argument is a symbol',
                        function ()
                        {
                            var fn = JScrewIt.encode.bind(null, Symbol());
                            expect(fn).toThrowStrictly(
                                TypeError,
                                'Cannot convert a symbol to a string'
                            );
                        }
                    );
                }
            }
        );
        describe(
            'JScrewIt.debug.defineConstant',
            function ()
            {
                it(
                    'fails for invalid identifier',
                    function ()
                    {
                        var fn = JScrewIt.debug.defineConstant.bind(null, null, 'X:X', '0');
                        expect(fn).toThrowStrictly(SyntaxError, 'Invalid identifier "X:X"');
                    }
                );
            }
        );
        describe(
            'JScrewIt.debug.getEntries',
            function ()
            {
                it(
                    'does not throw',
                    function ()
                    {
                        JScrewIt.debug.getEntries('');
                    }
                );
            }
        );
        describe(
            'Encoder#exec',
            function ()
            {
                it(
                    'gently fails for unencodable input',
                    function ()
                    {
                        var encoder = JScrewIt.debug.createEncoder();
                        expect(
                            function ()
                            {
                                encoder.exec('{}', undefined, ['express']);
                            }
                        ).toThrowStrictly(Error, 'Encoding failed');
                        expect('codingLog' in encoder).toBeFalsy();
                    }
                );
            }
        );
        describe(
            'Encoder#encodeByCharCodes',
            function ()
            {
                it(
                    'returns correct JSFuck for long input',
                    function ()
                    {
                        var encoder = JScrewIt.debug.createEncoder();
                        var input = 'Lorem ipsum dolor sit amet';
                        var output = encoder.encodeByCharCodes(input, true);
                        expect(output).toBeJSFuck();
                        expect(evalJSFuck(output)).toBe(input);
                    }
                );
                emuIt(
                    'returns correct JSFuck with feature ARROW',
                    Feature.ARROW,
                    function (emuFeatures)
                    {
                        var encoder = JScrewIt.debug.createEncoder(Feature.ARROW);
                        var input = 'Lorem ipsum dolor sit amet';
                        var output = encoder.encodeByCharCodes(input, false, 4);
                        expect(output).toBeJSFuck();
                        expect(emuEval(emuFeatures, output)).toBe(input);
                    }
                );
                it(
                    'returns undefined for too complex input',
                    function ()
                    {
                        var encoder = JScrewIt.debug.createEncoder();
                        encoder.replaceFalseFreeArray = Function();
                        expect(encoder.encodeByCharCodes('12345')).toBeUndefined();
                    }
                );
            }
        );
        describe(
            'Encoder#encodeBySparseFigures',
            function ()
            {
                it(
                    'returns correct JSFuck',
                    function ()
                    {
                        var encoder = JScrewIt.debug.createEncoder();
                        var input =
                            'The thirty-three thieves thought that they thrilled the throne ' +
                            'throughout Thursday.';
                        var output = encoder.encodeBySparseFigures(Object(input));
                        expect(output).toBeJSFuck();
                        expect(evalJSFuck(output)).toBe(input);
                    }
                );
                it(
                    'returns undefined for too complex input',
                    function ()
                    {
                        var encoder = JScrewIt.debug.createEncoder();
                        var output1 = encoder.encodeBySparseFigures(Object('12345'), 10);
                        expect(output1).toBeUndefined();
                        var output2 = encoder.encodeBySparseFigures(Object('12345'), 125);
                        expect(output2).toBeUndefined();
                        var output3 = encoder.encodeBySparseFigures(Object('12345'), 3700);
                        expect(output3).toBeUndefined();
                    }
                );
            }
        );
        describe(
            'Encoder#encodeByDenseFigures',
            function ()
            {
                it(
                    'returns correct JSFuck',
                    function ()
                    {
                        var encoder = JScrewIt.debug.createEncoder();
                        var input =
                            'The thirty-three thieves thought that they thrilled the throne ' +
                            'throughout Thursday.';
                        var output = encoder.encodeByDenseFigures(Object(input));
                        expect(output).toBeJSFuck();
                        expect(evalJSFuck(output)).toBe(input);
                    }
                );
                it(
                    'returns undefined for too complex input',
                    function ()
                    {
                        var encoder = JScrewIt.debug.createEncoder();
                        var output1 = encoder.encodeByDenseFigures(Object('12345'), 10);
                        expect(output1).toBeUndefined();
                        var output2 = encoder.encodeByDenseFigures(Object('12345'), 125);
                        expect(output2).toBeUndefined();
                        var output3 = encoder.encodeByDenseFigures(Object('12345'), 23500);
                        expect(output3).toBeUndefined();
                    }
                );
                it(
                    'uses an ad-hoc delimiter for the figure legend',
                    function ()
                    {
                        var encoder = JScrewIt.debug.createEncoder();
                        var figureLegendDelimiters;
                        encoder.callGetFigureLegendDelimiters =
                            function (getFigureLegendDelimiters, figurator, figures)
                            {
                                figureLegendDelimiters =
                                    getFigureLegendDelimiters(figurator, figures);
                                return figureLegendDelimiters;
                            };
                        var inputData = Object('foo');
                        encoder.encodeByDenseFigures(inputData);
                        expect(figureLegendDelimiters[1]).toEqual({ joiner: '0', separator: '0' });
                    }
                );
                it(
                    'uses no ad-hoc delimiter for the figure legend',
                    function ()
                    {
                        var encoder = JScrewIt.debug.createEncoder();
                        var figureLegendDelimiters;
                        encoder.callGetFigureLegendDelimiters =
                            function (getFigureLegendDelimiters, figurator, figures)
                            {
                                figurator =
                                    function ()
                                    {
                                        return Object('');
                                    };
                                figureLegendDelimiters =
                                    getFigureLegendDelimiters(figurator, figures);
                                return figureLegendDelimiters;
                            };
                        var inputData = Object('foo');
                        encoder.encodeByDenseFigures(inputData);
                        expect(figureLegendDelimiters.length).toBe(1);
                    }
                );
            }
        );
        describe(
            'Encoder#encodeByDict',
            function ()
            {
                it(
                    'returns correct JSFuck with integer coercing',
                    function ()
                    {
                        var encoder = JScrewIt.debug.createEncoder();
                        var input =
                            'The thirty-three thieves thought that they thrilled the throne ' +
                            'throughout Thursday.';
                        var output = encoder.encodeByDict(Object(input), 4);
                        expect(output).toBeJSFuck();
                        expect(evalJSFuck(output)).toBe(input);
                    }
                );
                emuIt(
                    'returns correct JSFuck with feature ARROW',
                    Feature.ARROW,
                    function (emuFeatures)
                    {
                        var encoder = JScrewIt.debug.createEncoder(Feature.ARROW);
                        var input = 'Lorem ipsum dolor sit amet';
                        var output = encoder.encodeByDict(Object(input), 4);
                        expect(output).toBeJSFuck();
                        expect(emuEval(emuFeatures, output)).toBe(input);
                    }
                );
                it(
                    'returns undefined for too complex input',
                    function ()
                    {
                        var encoder = JScrewIt.debug.createEncoder();
                        var output1 =
                            encoder.encodeByDict(Object('12345'), undefined, undefined, 10);
                        expect(output1).toBeUndefined();
                        var output2 =
                            encoder.encodeByDict(Object('12345'), undefined, undefined, 78);
                        expect(output2).toBeUndefined();
                        var output3 =
                            encoder.encodeByDict(Object('12345'), undefined, undefined, 200);
                        expect(output3).toBeUndefined();
                    }
                );

                describe(
                    'returns correct JSFuck with',
                    function ()
                    {
                        function test(createParseIntArgName, features)
                        {
                            var featureObj = Feature(features);
                            emuIt(
                                createParseIntArgName,
                                featureObj,
                                function (emuFeatures)
                                {
                                    var encoder = JScrewIt.debug.createEncoder(featureObj);
                                    var output = encoder.encodeByDict(inputData, 5, 3);
                                    expect(emuEval(emuFeatures, output)).toBe(input);
                                }
                            );
                        }

                        var input = 'ABC';
                        var inputData = Object(input);
                        test('createParseIntArgDefault', ['ARRAY_ITERATOR', 'ATOB']);
                        test('createParseIntArgByReduce', 'DEFAULT');
                        test('createParseIntArgByReduceArrow', ['ARRAY_ITERATOR', 'ARROW']);
                    }
                );
            }
        );
        describe(
            'Encoder#encodeExpress',
            function ()
            {
                describe(
                    'respects the maxLength limit',
                    function ()
                    {
                        function test(description, input)
                        {
                            it(
                                description,
                                function ()
                                {
                                    var encoder = JScrewIt.debug.createEncoder();
                                    var output = encoder.encodeExpress(input);
                                    var length = output.length;
                                    var codingLogLength = encoder.codingLog.length;
                                    output = encoder.encodeExpress(input, length);
                                    expect(output).not.toBeUndefined();
                                    encoder.codingLog = [];
                                    output = encoder.encodeExpress(input, length - 1);
                                    expect(output).toBeUndefined();
                                    var expectedCodingLogLength = Math.max(codingLogLength, 0);
                                    expect(encoder.codingLog.length).toBe(expectedCodingLogLength);
                                }
                            );
                        }

                        test('with an empty script', '');
                        test('with a call operation', '""[0]()');
                        test('with a param-call operation', '""(0)[""]');
                        test('with a get operation', '""[0][""]');
                        test('with a post-increment', '[0][0]++');
                        test('with an empty array', '""([])');
                        test('with a singleton array', '""([0])');
                        test('with a sum', '1+1');
                        test('with a sum of modified sums', 'a+(+(b+c))');
                    }
                );

                it(
                    'optimizes clusters',
                    function ()
                    {
                        var encoder = JScrewIt.debug.createEncoder();
                        var actual = encoder.encodeExpress('"xx".ww');
                        var expected =
                            encoder.replaceExpr('(1221..toString("36"))[1120..toString("34")]');
                        expect(actual).toBe(expected);
                    }
                );
                it(
                    'writes into codingLog',
                    function ()
                    {
                        var encoder = JScrewIt.debug.createEncoder();
                        encoder.encodeExpress('"A"()("B1" + "B2")["C"].D');
                        var codingLog = encoder.codingLog;
                        expect(codingLog.length).toBe(5);
                        expect(codingLog[0].name).toBe('0');
                        expect(codingLog[1].name).toBe('2:0');
                        expect(codingLog[2].name).toBe('2:1');
                        expect(codingLog[3].name).toBe('3');
                        expect(codingLog[4].name).toBe('4');
                    }
                );
            }
        );
        describe(
            'Encoder#replaceFalseFreeArray',
            function ()
            {
                it(
                    'returns undefined for too large array',
                    function ()
                    {
                        var encoder = JScrewIt.debug.createEncoder();
                        encoder.replaceStaticString = Function();
                        expect(encoder.replaceFalseFreeArray([])).toBeUndefined();
                    }
                );
            }
        );
        describe(
            'Encoder#replaceString',
            function ()
            {
                it(
                    'supports toString clustering',
                    function ()
                    {
                        var encoder = JScrewIt.debug.createEncoder();
                        var actual = encoder.replaceString('zz', { optimize: true });
                        var expected = encoder.replaceExpr('1295..toString("36")');
                        expect(actual).toBe(expected);
                    }
                );
                it(
                    'respects the maxLength limit on the first solution',
                    function ()
                    {
                        var encoder = JScrewIt.debug.createEncoder();
                        var firstSolution = encoder.resolveCharacter('1');
                        var options = { firstSolution: firstSolution, maxLength: 0 };
                        var actual = encoder.replaceString('', options);
                        expect(actual).toBeUndefined();
                    }
                );
                it(
                    'respects the maxLength limit after the last solution',
                    function ()
                    {
                        var encoder = JScrewIt.debug.createEncoder();
                        var options = { maxLength: 12 };
                        var actual = encoder.replaceString('f', options);
                        expect(actual).toBeUndefined();
                    }
                );

                describe(
                    'supports bridging',
                    function ()
                    {
                        function test(
                            expr,
                            start0,
                            end0,
                            startSB,
                            endSB,
                            startFS,
                            endFS,
                            startSBFS,
                            endSBFS
                        )
                        {
                            function fn()
                            {
                                it(
                                    'without bonding or string forcing',
                                    function ()
                                    {
                                        var options =
                                        { bond: false, forceString: false, optimize: true };
                                        var output = encoder.replaceString(expr, options);
                                        expect(output).toStartWith(start0);
                                        expect(output).toEndWith(end0);
                                    }
                                );
                                it(
                                    'with bonding',
                                    function ()
                                    {
                                        var options =
                                        { bond: true, forceString: false, optimize: true };
                                        var output = encoder.replaceString(expr, options);
                                        expect(output).toStartWith(startSB);
                                        expect(output).toEndWith(endSB);
                                    }
                                );
                                it(
                                    'with string forcing',
                                    function ()
                                    {
                                        var options =
                                        { bond: false, forceString: true, optimize: true };
                                        var output = encoder.replaceString(expr, options);
                                        expect(output).toStartWith(startFS);
                                        expect(output).toEndWith(endFS);
                                    }
                                );
                                it(
                                    'with bonding and string forcing',
                                    function ()
                                    {
                                        var options =
                                        { bond: true, forceString: true, optimize: true };
                                        var output = encoder.replaceString(expr, options);
                                        expect(output).toStartWith(startSBFS);
                                        expect(output).toEndWith(endSBFS);
                                    }
                                );
                            }

                            describe('with "' + expr + '"', fn);
                        }

                        var encoder = JScrewIt.debug.createEncoder(['FILL', 'NO_IE_SRC']);
                        test(
                            ',0',
                            '[[]][', '](+[])',
                            '[[]][', '](+[])',
                            '[[]][', '](+[])+[]',
                            '([[]][', '](+[])+[])'
                        );
                        test(
                            '0,',
                            '[+[]][', ']([[]])',
                            '[+[]][', ']([[]])',
                            '[+[]][', ']([[]])+[]',
                            '([+[]][', ']([[]])+[])'
                        );
                        test(
                            ',',
                            '[[]][', ']([[]])',
                            '[[]][', ']([[]])',
                            '[[]][', ']([[]])+[]',
                            '([[]][', ']([[]])+[])'
                        );
                        test(
                            '0,0',
                            '[+[]][', '](+[])',
                            '[+[]][', '](+[])',
                            '[+[]][', '](+[])+[]',
                            '([+[]][', '](+[])+[])'
                        );
                        test(
                            '00,0',
                            '+[]+[+[]][', '](+[])',
                            '[+[]+[+[]]][', '](+[])',
                            '+[]+[+[]][', '](+[])',
                            '(+[]+[+[]][', '](+[]))'
                        );
                        test(
                            '0a0f,0',
                            '+[]+(![]+[])[+!![]]+[+[]+(![]+[])[+[]]][', '](+[])',
                            '[+[]+(![]+[])[+!![]]+(+[])+(![]+[])[+[]]][', '](+[])',
                            '+[]+(![]+[])[+!![]]+[+[]+(![]+[])[+[]]][', '](+[])',
                            '(+[]+(![]+[])[+!![]]+[+[]+(![]+[])[+[]]][', '](+[]))'
                        );
                        test(
                            '0undefinedundefined,0',
                            '[[+[]]+[][[]]+[][[]]][', '](+[])',
                            '[[+[]]+[][[]]+[][[]]][', '](+[])',
                            '+[]+[[][[]]+[]+[][[]]][', '](+[])',
                            '(+[]+[[][[]]+[]+[][[]]][', '](+[]))'
                        );
                        test(
                            '0undefinedundefined,00',
                            '[[+[]]+[][[]]+[][[]]][', '](+[]+[+[]])',
                            '[[+[]]+[][[]]+[][[]]][', '](+[]+[+[]])',
                            '[[+[]]+[][[]]+[][[]]][', '](+[])+(+[])',
                            '([[+[]]+[][[]]+[][[]]][', '](+[])+(+[]))'
                        );
                        test(
                            '0undefinedundefined,undefined00',
                            '[[+[]]+[][[]]+[][[]]][', ']([][[]]+[+[]]+(+[]))',
                            '[[+[]]+[][[]]+[][[]]][', ']([][[]]+[+[]]+(+[]))',
                            '[[+[]]+[][[]]+[][[]]][', ']([][[]]+[+[]])+(+[])',
                            '([[+[]]+[][[]]+[][[]]][', ']([][[]]+[+[]])+(+[]))'
                        );
                        test(
                            '0undefinedundefined,undefinedundefined',
                            '[[+[]]+[][[]]+[][[]]][', ']([][[]]+[]+[][[]])',
                            '[[+[]]+[][[]]+[][[]]][', ']([][[]]+[]+[][[]])',
                            '[[+[]]+[][[]]+[][[]]][', ']([][[]]+[])+[][[]]',
                            '([[+[]]+[][[]]+[][[]]][', ']([][[]]+[])+[][[]])'
                        );
                        test(
                            'undefinedundefined0,0',
                            '[][[]]+[[][[]]+[+[]]][', '](+[])',
                            '([][[]]+[[][[]]+[+[]]][', '](+[]))',
                            '[][[]]+[[][[]]+[+[]]][', '](+[])',
                            '([][[]]+[[][[]]+[+[]]][', '](+[]))'
                        );
                        test(
                            '0,00',
                            '[+[]][', '](+[]+[+[]])',
                            '[+[]][', '](+[]+[+[]])',
                            '[+[]][', '](+[])+(+[])',
                            '([+[]][', '](+[])+(+[]))'
                        );
                    }
                );

                it(
                    'returns undefined for too complex input',
                    function ()
                    {
                        var encoder = JScrewIt.debug.createEncoder();
                        encoder.maxGroupThreshold = 2;
                        expect(encoder.replaceString('123')).toBeUndefined();
                    }
                );
            }
        );
        describe(
            'Encoder#resolve throws a SyntaxError for',
            function ()
            {
                var encoder = JScrewIt.debug.createEncoder();
                encoder.replaceString = Function();

                function debugReplacer(input)
                {
                    var result =
                        function ()
                        {
                            encoder.resolve(input);
                        };
                    return result;
                }

                JScrewIt.debug.defineConstant(encoder, 'A', 'FILL');
                JScrewIt.debug.defineConstant(encoder, 'B', 'C');
                JScrewIt.debug.defineConstant(encoder, 'C', 'B');
                JScrewIt.debug.defineConstant(encoder, 'D', '?');
                JScrewIt.debug.defineConstant(encoder, 'E', '"\\xx"');
                JScrewIt.debug.defineConstant(encoder, 'F', '"too complex"');

                it(
                    'circular reference',
                    function ()
                    {
                        expect(debugReplacer('B')).toThrowStrictly(
                            SyntaxError,
                            'Circular reference detected: B < C < B – [Feature {}]'
                        );
                    }
                );
                describe(
                    'undefined identifier',
                    function ()
                    {
                        it(
                            'in a definition',
                            function ()
                            {
                                expect(debugReplacer('A')).toThrowStrictly(
                                    SyntaxError,
                                    'Undefined identifier FILL in the definition of A'
                                );
                            }
                        );
                        it(
                            'inline',
                            function ()
                            {
                                expect(debugReplacer('valueOf')).toThrowStrictly(
                                    SyntaxError,
                                    'Undefined identifier valueOf'
                                );
                            }
                        );
                    }
                );
                describe(
                    'unexpected character',
                    function ()
                    {
                        it(
                            'in a definition',
                            function ()
                            {
                                expect(debugReplacer('D')).toThrowStrictly(
                                    SyntaxError,
                                    'Syntax error in the definition of D'
                                );
                            }
                        );
                        it(
                            'inline',
                            function ()
                            {
                                expect(debugReplacer('?')).toThrowStrictly(
                                    SyntaxError,
                                    'Syntax error'
                                );
                            }
                        );
                    }
                );
                describe(
                    'illegal string',
                    function ()
                    {
                        it(
                            'in a definition',
                            function ()
                            {
                                expect(debugReplacer('E')).toThrowStrictly(
                                    SyntaxError,
                                    'Syntax error in the definition of E'
                                );
                            }
                        );
                        it(
                            'inline',
                            function ()
                            {
                                expect(debugReplacer('"\\xx"')).toThrowStrictly(
                                    SyntaxError,
                                    'Syntax error'
                                );
                            }
                        );
                    }
                );
                describe(
                    'string too complex',
                    function ()
                    {
                        it(
                            'in a definition',
                            function ()
                            {
                                expect(debugReplacer('F')).toThrowStrictly(
                                    SyntaxError,
                                    'String too complex in the definition of F'
                                );
                            }
                        );
                        it(
                            'inline',
                            function ()
                            {
                                expect(debugReplacer('"too complex"')).toThrowStrictly(
                                    SyntaxError,
                                    'String too complex'
                                );
                            }
                        );
                    }
                );
            }
        );
        describe(
            'Encoder#resolveExprAt throws a SyntaxError for',
            function ()
            {
                it(
                    'missing padding entries',
                    function ()
                    {
                        var encoder = JScrewIt.debug.createEncoder();
                        expect(
                            function ()
                            {
                                encoder.resolveExprAt('', 42, undefined, []);
                            }
                        ).toThrowStrictly(SyntaxError, 'Missing padding entries for index 42');
                    }
                );
            }
        );
        describe(
            'Encoder#getPaddingBlock throws a SyntaxError for',
            function ()
            {
                it(
                    'undefined padding',
                    function ()
                    {
                        var encoder = JScrewIt.debug.createEncoder();
                        expect(
                            function ()
                            {
                                encoder.getPaddingBlock({ blocks: [] }, -1);
                            }
                        ).toThrowStrictly(SyntaxError, 'Undefined padding block with length -1');
                    }
                );
            }
        );
        describe(
            'Encoding',
            function ()
            {
                var encoder = JScrewIt.debug.createEncoder();
                var text = 'Lorem ipsum dolor sit amet';
                var coders = JScrewIt.debug.getCoders();
                var coderNames = Object.keys(coders);
                coderNames.forEach(
                    function (coderName)
                    {
                        var coder = coders[coderName];
                        describe(
                            coderName,
                            function ()
                            {
                                function getMaxLength(scope)
                                {
                                    var maxLength = scope.maxLength;
                                    if (maxLength === undefined)
                                    {
                                        scope.maxLength = maxLength =
                                            coder.call(encoder, Object('0')).length;
                                    }
                                    return maxLength;
                                }

                                it(
                                    'returns correct JSFuck',
                                    function ()
                                    {
                                        var input =
                                            coderName !== 'express' ? text : JSON.stringify(text);
                                        var output = coder.call(encoder, Object(input));
                                        expect(output).toBeJSFuck();
                                        expect(evalJSFuck(output)).toBe(text);
                                    }
                                );
                                it(
                                    'returns undefined when output length exceeds maxLength',
                                    function ()
                                    {
                                        var maxLength = getMaxLength(this);
                                        var output =
                                            coder.call(encoder, Object('0'), maxLength - 1);
                                        expect(output).toBeUndefined();
                                    }
                                );
                                it(
                                    'returns a string when output length equals maxLength',
                                    function ()
                                    {
                                        var maxLength = getMaxLength(this);
                                        var output = coder.call(encoder, Object('0'), maxLength);
                                        expect(output).toBeString();
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
    }

    function emuIt(description, featureObj, fn)
    {
        var emuFeatures = getEmuFeatureNames(featureObj);
        if (emuFeatures)
            it(description, fn.bind(null, emuFeatures));
    }

    function getEmuFeatureNames(featureObj)
    {
        if (
            !featureObj.elementaryNames.every(
                function (featureName)
                {
                    var supportable = featureName in featureSet;
                    return supportable;
                }
            )
        )
            return; // There are unsupportable features.
        var emuFeatureNames =
            EMU_FEATURES.filter(
                function (featureName)
                {
                    var emulated = featureSet[featureName] && featureObj.includes(featureName);
                    return emulated;
                }
            );
        return emuFeatureNames;
    }

    function getEntryFeature(entry)
    {
        var featureObj = JScrewIt.debug.createFeatureFromMask(entry.mask);
        return featureObj;
    }

    function getFunctionName(fn)
    {
        var name = fn.name;
        if (name === undefined)
            name = /^\s*function ([\w$]+)/.exec(fn)[1];
        return name;
    }

    function getPoolEncoder(featureObj)
    {
        var key = featureObj.canonicalNames.join('+');
        var encoder = encoderCache[key];
        if (!encoder)
            encoderCache[key] = encoder = JScrewIt.debug.createEncoder(featureObj);
        return encoder;
    }

    function init()
    {
        Feature = JScrewIt.Feature;
        featureSet = Object.create(null);
        EMU_FEATURES.forEach(
            function (featureName)
            {
                featureSet[featureName] = true;
            }
        );
        Feature.AUTO.elementaryNames.forEach(
            function (featureName)
            {
                featureSet[featureName] = false;
            }
        );
        describeTests();
    }

    function isExpected(expected)
    {
        var result =
            function ()
            {
                this.toBe(expected);
            };
        return result;
    }

    function nestedBrackets(count)
    {
        var str = repeat('[', count) + repeat(']', count);
        return str;
    }

    function testCharacter(charCode)
    {
        function testAtob()
        {
            if (charCode < 0x100 && 'ATOB' in featureSet)
            {
                it(
                    '(atob)',
                    function ()
                    {
                        var encoder = getPoolEncoder(Feature.ATOB);
                        var solution =
                            encoder.createCharDefaultSolution(charCode, true, false, false, false);
                        verifySolution(solution, char, featureSet.ATOB && ['ATOB']);
                        expect(solution.length).not.toBeGreaterThan(
                            getPoolEncoder(Feature.DEFAULT).resolveCharacter(char).length
                        );
                    }
                );
            }
        }

        function testDefault()
        {
            it(
                '(charCode)',
                function ()
                {
                    var encoder = getPoolEncoder(Feature.DEFAULT);
                    var solution =
                        encoder.createCharDefaultSolution(charCode, false, true, false, false);
                    verifySolution(solution, char);
                }
            );
            it(
                '(escSeq)',
                function ()
                {
                    var encoder = getPoolEncoder(Feature.DEFAULT);
                    var solution =
                        encoder.createCharDefaultSolution(charCode, false, false, true, false);
                    verifySolution(solution, char);
                }
            );
            it(
                '(unescape)',
                function ()
                {
                    var encoder = getPoolEncoder(Feature.DEFAULT);
                    var solution =
                        encoder.createCharDefaultSolution(charCode, false, false, false, true);
                    verifySolution(solution, char);
                }
            );
        }

        function verifyFEntry(entry, dispositions, varieties)
        {
            var entryFeatureObj = getEntryFeature(entry);
            dispositions.forEach(
                function (additionalFeatureNames)
                {
                    var solutionFeatureObj = Feature(entryFeatureObj, additionalFeatureNames);
                    var solution = decodeEntryWithFeature(entry, solutionFeatureObj);
                    varieties.forEach(
                        function (varietyFeatureNames)
                        {
                            var varietyFeatureObj = Feature(varietyFeatureNames);
                            if (Feature.areCompatible([varietyFeatureObj, solutionFeatureObj]))
                            {
                                var testableFeatureObj =
                                    Feature(varietyFeatureObj, solutionFeatureObj);
                                var emuFeatures = getEmuFeatureNames(testableFeatureObj);
                                if (emuFeatures)
                                    verifySolution(solution, char, emuFeatures);
                            }
                        }
                    );
                }
            );
        }

        var FB_DISPOSITIONS =
        [
            [],
            ['FF_SRC'],
            ['IE_SRC'],
            ['INCR_CHAR'],
            ['V8_SRC'],
            ['NO_FF_SRC'],
            ['NO_IE_SRC'],
            ['NO_V8_SRC'],
            ['FILL'],
            ['FILL', 'FF_SRC'],
            ['FILL', 'IE_SRC'],
            ['FILL', 'INCR_CHAR'],
            ['FILL', 'V8_SRC'],
            ['FILL', 'NO_FF_SRC'],
            ['FILL', 'NO_IE_SRC'],
            ['FILL', 'NO_V8_SRC'],
            ['INCR_CHAR', 'NO_FF_SRC'],
            ['INCR_CHAR', 'NO_V8_SRC'],
            ['FILL', 'INCR_CHAR', 'NO_FF_SRC'],
            ['FILL', 'INCR_CHAR', 'NO_V8_SRC'],
        ];

        var FB_VARIETIES = [['FF_SRC'], ['IE_SRC'], ['V8_SRC']];

        var FH_DISPOSITIONS =
        [
            [],
            ['IE_SRC'],
            ['INCR_CHAR'],
            ['NO_IE_SRC'],
            ['FILL'],
            ['FILL', 'IE_SRC'],
            ['FILL', 'INCR_CHAR'],
            ['FILL', 'NO_IE_SRC'],
        ];

        var FH_VARIETIES = [['IE_SRC'], ['NO_IE_SRC']];

        var char = String.fromCharCode(charCode);
        var desc =
            charCode >= 0x7f && charCode <= 0xa0 || charCode === 0xad ?
            '"\\u00' + charCode.toString(16) + '"' : JSON.stringify(char);
        describe(
            desc,
            function ()
            {
                function testEntry(entry, index)
                {
                    var featureObj = getEntryFeature(entry);
                    if (Feature.DEFAULT.includes(featureObj))
                        defaultEntryFound = true;
                    if (Feature.ATOB.includes(featureObj))
                        atobEntryFound = true;
                    emuIt(
                        '(definition ' + index + ')',
                        featureObj,
                        function (emuFeatures)
                        {
                            var definition = entry.definition;
                            if (typeof definition === 'function')
                            {
                                var name = getFunctionName(definition);
                                switch (name)
                                {
                                case 'commaDefinition':
                                case 'charDefaultDefinition':
                                    break;
                                case 'definitionFB':
                                    verifyFEntry(entry, FB_DISPOSITIONS, FB_VARIETIES);
                                    return;
                                case 'definitionFH':
                                    verifyFEntry(entry, FH_DISPOSITIONS, FH_VARIETIES);
                                    return;
                                default:
                                    expect().fail(
                                        function ()
                                        {
                                            var message =
                                                'Unexpected definition function name ' + name;
                                            return message;
                                        }
                                    );
                                }
                            }
                            var solution = decodeEntry(entry);
                            verifySolution(solution, char, emuFeatures);
                        }
                    );
                }

                var entries = JScrewIt.debug.getCharacterEntries(char);
                if (entries)
                {
                    var defaultEntryFound = false;
                    var atobEntryFound = false;
                    if (entries)
                        entries.forEach(testEntry);
                    if (!defaultEntryFound)
                        testDefault();
                    if (!atobEntryFound)
                        testAtob();
                }
                else
                {
                    testDefault();
                    testAtob();
                }
            }
        );
    }

    function testConstant(constant, validator)
    {
        describe(
            constant,
            function ()
            {
                var entries = JScrewIt.debug.getConstantEntries(constant);
                entries.forEach(
                    function (entry, index)
                    {
                        var featureObj = getEntryFeature(entry);
                        emuIt(
                            '(definition ' + index + ')',
                            featureObj,
                            function (emuFeatures)
                            {
                                var output = String(decodeEntry(entry));
                                expect(output).toBeJSFuck();
                                emuDo(
                                    emuFeatures,
                                    function ()
                                    {
                                        var actual = evalJSFuck(output);
                                        validator.call(expect(actual));
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
    }

    function verifySolution(solution, expected, emuFeatures)
    {
        expect(typeof solution).toBe('object');
        var output = String(solution);
        expect(output).toBeJSFuck();
        var actual = emuEval(emuFeatures || [], output) + '';
        expect(actual).toBe(expected);
    }

    var Feature;
    var encoderCache = Object.create(null);
    var featureSet;
    var JScrewIt = typeof module !== 'undefined' ? require('../node-jscrewit-test') : self.JScrewIt;
    init();
}
)();
