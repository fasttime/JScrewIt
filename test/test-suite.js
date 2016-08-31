/* eslint-env mocha */
/*
global
EMU_FEATURES,
Audio,
Node,
atob,
btoa,
document,
emuDo,
emuEval,
expect,
global,
module,
repeat,
self,
uneval
*/

(function (global)
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
                testCharacter(8734); // ∞
                for (; charCode <= 0xffff; charCode <<= 1)
                    testCharacter(charCode + 0x1f);
            }
        );
        describe(
            'Complex definitions of',
            function ()
            {
                JScrewIt.debug.getComplexNames().forEach(
                    function (complex)
                    {
                        function testEntry(entry, index)
                        {
                            var definition = entry.definition;
                            if (definition)
                            {
                                var featureObj = getEntryFeature(entry);
                                emuIt(
                                    '(definition ' + index + ')',
                                    featureObj,
                                    function (emuFeatures)
                                    {
                                        var encoder = getPoolEncoder(featureObj);
                                        var solution = encoder.resolveComplex(complex);
                                        verifySolution(solution, complex, emuFeatures);
                                        var expectedLevel = definition.level;
                                        if (expectedLevel == null)
                                            expectedLevel = LEVEL_STRING;
                                        expect(solution.level)
                                            .toBe(expectedLevel, 'Solution level mismatch');
                                    }
                                );
                            }
                        }
                        
                        var desc = JSON.stringify(complex);
                        describe(
                            desc,
                            function ()
                            {
                                var entries = JScrewIt.debug.getComplexEntries(complex);
                                entries.forEach(testEntry);
                            }
                        );
                    }
                );
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
                        this.toBeArrayIterator();
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
                        this.toMatch(/^slice|substr$/);
                    }
                );
            }
        );
        describe(
            'JScrewIt.encode',
            function ()
            {
                describeEncodeTest('DEFAULT');
                describeEncodeTest('COMPACT');
                describeEncodeTest('FF31');
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
                                                .replace(/(?=[^!\*])/g, '\\')
                                                .replace(/(?=\*)/g, '.') +
                                                '$';
                                            var expectedRegExp = RegExp(regExpPattern);
                                            expect(actual).toMatch(expectedRegExp);
                                            if (expectedValue !== void 0)
                                                expect(eval(actual)).toBe(expectedValue);
                                        }
                                    );
                                }
                                
                                // General
                                test('an empty script', ';\n', '');
                                test(
                                    'all separators',
                                    '\t\n\v\f\r \xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004' +
                                    '\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f' +
                                    '\u3000\ufeff/*lorem\n/*///ipsum\n0',
                                    '+[]'
                                );
                                test('identifiers', 'String', '*(*)()', String);
                                test('unsigned numbers', '4.25E-7', '+(*)', 4.25e-7);
                                test('double-quoted strings', '"He\\x6c\\u006Co!"', '*', 'Hello!');
                                test('single-quoted strings', '\'Hel\\\r\nlo\\0\'', '*', 'Hello\0');
                                test('empty arrays', '[]', '[]');
                                test('singleton arrays', '[0]', '[+[]]');
                                test('sums', '1+1', '+!![]+(+!![])');
                                
                                // Numbers and constants
                                test('Infinity', 'Infinity', '+(*)', Infinity);
                                test('NaN', 'NaN', '+[![]]');
                                test('false', 'false', '![]');
                                test('true', 'true', '!![]');
                                test('undefined', 'undefined', '[][[]]');
                                test('hexadecimal literals', '0x1Fa', '+(*)', 506);
                                test('signed numbers', '+42', '+(*)', 42);
                                test(
                                    'numbers with absolute value part starting with "0."',
                                    '-0.9',
                                    '+((*)[*]+(*)[*]+*)',
                                    -0.9
                                );
                                test(
                                    'numbers with a positive exponent',
                                    '1e+100',
                                    '+(+!![]+(!![]+[])[!![]+!![]+!![]]+(+!![])+(+[])+(+[]))',
                                    1e+100
                                );
                                test('-Infinity', '-Infinity', '+(*)', -Infinity);
                                test('-0', '-0', '+(*)', -0);
                                test('-NaN', '-NaN', '+[![]]');
                                
                                // Arrays
                                test('nested arrays', '[[0]]', '[[+[]]]');
                                
                                // Operations
                                test('indexers', 'false[+x]', '(![])[+*]');
                                test('undefined indexers', '0[undefined]', '(+[])[[][[]]]');
                                test('array of undefined indexers', '0[[undefined]]', '(+[])[[]]');
                                test('dot properties', 'Array.isArray', '*(*)()[*]', Array.isArray);
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
                                    'outer modifiers in constant-based composite expressions',
                                    '+undefined()',
                                    '+[][[]]()'
                                );
                                test(
                                    'inner modifiers in composite expressions',
                                    '(!x)()',
                                    '(!*)()'
                                );
                                test('redundant modifiers on constants', '-+ +-!!!+!!42', '+[]');
                                test(
                                    'redundant modifiers on non-constants',
                                    '-+ +-!!!-!!+ ++""',
                                    '+!++([]+[])'
                                );
                                
                                // Groupings
                                test(
                                    'superfluous grouping parentheses',
                                    '(((a)())([([])])[(+(1)-(+2))].b)',
                                    '*(*)()()([[]])[+!![]+(+*)][*]'
                                );
                                
                                // Separators
                                test(
                                    'superfluous separators',
                                    ';a ( ) ( ( [ [ ] ] ) ) [ + 1 - + 2 ] . b;',
                                    '*(*)()()([[]])[+!![]+(+*)][*]'
                                );
                                
                                // Sums
                                test('dissociable sums', '(0+1)+2', '+[]+(+!![])+(!![]+!![])');
                                test('undissociable sums', '0+(1+2)', '+[]+(+!![]+(!![]+!![]))');
                                test(
                                    'sums of modified sums',
                                    '0+(+(1+2))',
                                    '+[]+(+(+!![]+(!![]+!![])))'
                                );
                                
                                // Subtractions
                                test('string minuhends', '"false" - - 1', '+(![]+[])+(+!![])');
                                test('', '1+1-(-1)', '+!![]+(+!![])+(+!![])');
                                
                                // Pre-increments
                                test('pre-incremented constant', '++0', '++(+[])');
                                test('pre-incremented non-constant', '++[][0]', '++[][+[]]');
                                
                                // Limits
                                var str = repeat('[', 1000) + repeat(']', 1000);
                                test('deep nestings', str, str);
                            }
                        );
                        describe(
                            'does not parse',
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
                                            expect(fn).toThrow(Error('Encoding failed'));
                                        }
                                    );
                                }
                                
                                test('octal literals', '0o42');
                                test('binary literals', '0b101010');
                                test('octal escape sequences', '"\\1"');
                                test('extended Unicode escape sequences', '"\\u{1}"');
                                test('legacy octal literals', '010');
                                test('legacy octal-like literals', '09');
                                test('object literal parameters', 'doSomething({})');
                                test('object literal indexers', 'array[{}]');
                                test('more than one parameter', 'parseInt("10", 2)');
                                test('keywords', 'debugger');
                                test('post-increments', 'i++');
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
                                test('too deep nestings', repeat('[', 1001) + repeat(']', 1001));
                                test('minus signed standalone strings', '-""');
                                test('minus signed strings as first terms in a sum', '-"" + ""');
                                test('minus signed arrays', '-[]');
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
                                var actual = eval(output);
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
                                var actual = eval(output);
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
                                var actual = eval(output);
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
                        expect(fn).toThrow(Error('Incompatible features'));
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
                        expect(fn).toThrow(Error('Invalid value for option runAs'));
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
                        expect(fn).toThrow(Error('Invalid value for option wrapWith'));
                    }
                );
            }
        );
        describe(
            'JScrewIt.Feature',
            function ()
            {
                describe(
                    'constructor',
                    function ()
                    {
                        it(
                            'accepts mixed arguments',
                            function ()
                            {
                                var maskUnion = JScrewIt.debug.maskUnion;
                                var feature =
                                    Feature(
                                        ['NAME', Feature.WINDOW],
                                        {
                                            toString: function ()
                                            {
                                                return 'HTMLDOCUMENT';
                                            },
                                            valueOf: function ()
                                            {
                                                return 42;
                                            }
                                        },
                                        Feature.NO_IE_SRC,
                                        []
                                    );
                                var expectedMask =
                                    maskUnion(
                                        maskUnion(
                                            maskUnion(Feature.NAME.mask, Feature.WINDOW.mask),
                                            Feature.HTMLDOCUMENT.mask
                                        ),
                                        Feature.NO_IE_SRC.mask
                                    );
                                expect(feature.mask).toEqual(expectedMask);
                            }
                        );
                        it(
                            'throws an Error for unknown features',
                            function ()
                            {
                                var fn = Feature.bind(Feature, '???');
                                expect(fn).toThrow(Error('Unknown feature "???"'));
                            }
                        );
                        it(
                            'throws an Error for incompatible feature arrays',
                            function ()
                            {
                                var fn = Feature.bind(Feature, ['IE_SRC', 'NO_IE_SRC']);
                                expect(fn).toThrow(Error('Incompatible features'));
                            }
                        );
                        it(
                            'can be invoked with the new operator',
                            function ()
                            {
                                var featureObj = new Feature();
                                expect(featureObj.constructor).toBe(Feature);
                            }
                        );
                        it(
                            'throws an Error for incompatible features',
                            function ()
                            {
                                var fn =
                                    Feature.bind(
                                        Feature,
                                        'ENTRIES_PLAIN',
                                        'NO_OLD_SAFARI_ARRAY_ITERATOR'
                                    );
                                expect(fn).toThrow(Error('Incompatible features'));
                            }
                        );
                    }
                );
                describe(
                    'contains only well-formed obejcts:',
                    function ()
                    {
                        var featureNames = Object.keys(Feature).sort();
                        featureNames.forEach(testFeatureObj);
                    }
                );
                describe(
                    'contains correct information for the feature',
                    function ()
                    {
                        it(
                            'DEFAULT',
                            function ()
                            {
                                var featureObj = Feature.DEFAULT;
                                expect(featureObj.canonicalNames).toEqual([]);
                                expect(featureObj.elementaryNames).toEqual([]);
                                expect(featureObj.mask).toEqual([0, 0]);
                            }
                        );
                        it(
                            'COMPACT',
                            function ()
                            {
                                var featureObj = Feature.COMPACT;
                                var featureNames =
                                    Feature.commonOf('CHROME45', 'EDGE', 'FF31', 'SAFARI90');
                                var expectedFeature = Feature(featureNames);
                                var actualElementaryNames = featureObj.elementaryNames;
                                var expectedElementaryNames = expectedFeature.elementaryNames;
                                expect(actualElementaryNames).toEqual(expectedElementaryNames);
                                var actualCanonicalNames = expectedFeature.canonicalNames;
                                var expectedCanonicalNames = featureObj.canonicalNames;
                                expect(actualCanonicalNames).toEqual(expectedCanonicalNames);
                                expect(featureObj.mask).toEqual(expectedFeature.mask);
                            }
                        );
                        it(
                            'AUTO',
                            function ()
                            {
                                var featureObj = Feature.AUTO;
                                var canonicalNameCount = featureObj.canonicalNames.length;
                                var elementaryNameCount = featureObj.elementaryNames.length;
                                expect(canonicalNameCount).toBeGreaterThan(0);
                                expect(elementaryNameCount).not.toBeLessThan(canonicalNameCount);
                                expect(featureObj.mask).not.toEqual([0, 0]);
                            }
                        );
                    }
                );
                describe(
                    '#includes',
                    function ()
                    {
                        it(
                            'accepts mixed arguments',
                            function ()
                            {
                                var actual =
                                    Feature.COMPACT.includes(
                                        ['NAME', Feature.WINDOW],
                                        'HTMLDOCUMENT',
                                        Feature.NO_IE_SRC,
                                        []
                                    );
                                expect(actual).toBe(true);
                            }
                        );
                        it(
                            'returns true if no arguments are specified',
                            function ()
                            {
                                var actual = Feature.AUTO.includes();
                                expect(actual).toBe(true);
                            }
                        );
                        it(
                            'throws an Error for unknown features',
                            function ()
                            {
                                var fn = Feature.prototype.includes.bind(Feature.DEFAULT, '???');
                                expect(fn).toThrow(Error('Unknown feature "???"'));
                            }
                        );
                        it(
                            'throws an Error for incompatible feature arrays',
                            function ()
                            {
                                var fn =
                                    Feature.prototype.includes.bind(
                                        Feature.DEFAULT,
                                        ['IE_SRC', 'NO_IE_SRC']
                                    );
                                expect(fn).toThrow(Error('Incompatible features'));
                            }
                        );
                    }
                );
                describe(
                    '#restrict',
                    function ()
                    {
                        it(
                            'restricts a feature in all engines',
                            function ()
                            {
                                var featureObj = Feature.WINDOW.restrict('web-worker');
                                expect(featureObj.mask).toEqual(Feature.DEFAULT.mask);
                            }
                        );
                        it(
                            'restricts a feature in a particular engine',
                            function ()
                            {
                                var featureObj =
                                    Feature.WINDOW.restrict('web-worker', [Feature.FF31]);
                                expect(featureObj.mask).toEqual(Feature.SELF_OBJ.mask);
                            }
                        );
                    }
                );
                describe(
                    '#toString',
                    function ()
                    {
                        it(
                            'works for predefined features',
                            function ()
                            {
                                expect(Feature.DEFAULT.toString()).toBe('[Feature DEFAULT]');
                                expect(Feature.NODE010.toString()).toBe('[Feature NODE010]');
                                expect(Feature.ATOB.toString()).toBe('[Feature ATOB]');
                            }
                        );
                        it(
                            'works for custom features',
                            function ()
                            {
                                expect(Feature('DEFAULT').toString()).toBe('[Feature {}]');
                                expect(Feature('NODE010').toString()).toMatch(
                                    /^\[Feature \{[0-9A-Z_]+(, [0-9A-Z_]+)*\}]$/
                                );
                                expect(Feature('ATOB').toString()).toBe('[Feature {ATOB}]');
                            }
                        );
                    }
                );
                describe(
                    '.areCompatible',
                    function ()
                    {
                        it(
                            'returns true if no arguments are specified',
                            function ()
                            {
                                var compatible = Feature.areCompatible([]);
                                expect(compatible).toBe(true);
                            }
                        );
                        it(
                            'returns true for any single feature',
                            function ()
                            {
                                var compatible = Feature.areCompatible([Feature.AUTO]);
                                expect(compatible).toBe(true);
                            }
                        );
                        it(
                            'returns true for compatible features',
                            function ()
                            {
                                var compatible = Feature.areCompatible(['FILL', 'SELF']);
                                expect(compatible).toBe(true);
                            }
                        );
                        it(
                            'returns false for incompatible features',
                            function ()
                            {
                                var compatible = Feature.areCompatible(['V8_SRC', 'IE_SRC']);
                                expect(compatible).toBe(false);
                            }
                        );
                    }
                );
                describe(
                    '.areEqual',
                    function ()
                    {
                        it(
                            'accepts mixed arguments',
                            function ()
                            {
                                var actual =
                                    Feature.areEqual(
                                        ['NAME', Feature.WINDOW],
                                        'HTMLDOCUMENT',
                                        Feature.NO_IE_SRC,
                                        []
                                    );
                                expect(actual).toBe(false);
                            }
                        );
                        it(
                            'throws an Error for unknown features',
                            function ()
                            {
                                var fn = Feature.areEqual.bind(null, '???');
                                expect(fn).toThrow(Error('Unknown feature "???"'));
                            }
                        );
                        it(
                            'throws an Error for incompatible feature arrays',
                            function ()
                            {
                                var fn = Feature.areEqual.bind(null, ['IE_SRC', 'NO_IE_SRC']);
                                expect(fn).toThrow(Error('Incompatible features'));
                            }
                        );
                        it(
                            'returns true if no arguments are specified',
                            function ()
                            {
                                var equal = Feature.areEqual([]);
                                expect(equal).toBe(true);
                            }
                        );
                        it(
                            'returns true for any single feature',
                            function ()
                            {
                                var equal = Feature.areEqual([Feature.AUTO]);
                                expect(equal).toBe(true);
                            }
                        );
                        it(
                            'returns true for equal features',
                            function ()
                            {
                                var equal = Feature.areEqual(['FILL'], Feature.FILL);
                                expect(equal).toBe(true);
                            }
                        );
                        it(
                            'returns false for unequal features',
                            function ()
                            {
                                var equal = Feature.areEqual('V8_SRC', 'IE_SRC');
                                expect(equal).toBe(false);
                            }
                        );
                    }
                );
                describe(
                    '.commonOf',
                    function ()
                    {
                        it(
                            'accepts mixed arguments',
                            function ()
                            {
                                var featureObj =
                                    Feature.commonOf(
                                        ['NAME', Feature.WINDOW],
                                        'HTMLDOCUMENT',
                                        Feature.NO_IE_SRC,
                                        []
                                    );
                                expect(featureObj.mask).toEqual([0, 0]);
                            }
                        );
                        it(
                            'throws an Error for unknown features',
                            function ()
                            {
                                var fn = Feature.commonOf.bind(null, '???');
                                expect(fn).toThrow(Error('Unknown feature "???"'));
                            }
                        );
                        it(
                            'throws an Error for incompatible feature arrays',
                            function ()
                            {
                                var fn = Feature.commonOf.bind(null, ['IE_SRC', 'NO_IE_SRC']);
                                expect(fn).toThrow(Error('Incompatible features'));
                            }
                        );
                        it(
                            'returns null if no arguments are specified',
                            function ()
                            {
                                var featureObj = Feature.commonOf();
                                expect(featureObj).toBeNull();
                            }
                        );
                        it(
                            'returns a feature with expected mask',
                            function ()
                            {
                                var featureObj = Feature.commonOf(Feature.AUTO);
                                expect(featureObj.mask).toEqual(Feature.AUTO.mask);
                            }
                        );
                        it(
                            'throws an Error for incompatible feature arrays',
                            function ()
                            {
                                var fn =
                                    Feature.commonOf.bind(
                                        null,
                                        'ANY_WINDOW',
                                        ['WINDOW', 'DOMWINDOW']
                                    );
                                expect(fn).toThrow(Error('Incompatible features'));
                            }
                        );
                    }
                );
            }
        );
        describe(
            'JScrewIt.debug.createFeatureFromMask',
            function ()
            {
                it(
                    'returns null for an incompatible mask',
                    function ()
                    {
                        var mask =
                            JScrewIt.debug.maskUnion(Feature.NO_IE_SRC.mask, Feature.IE_SRC.mask);
                        var featureObj = JScrewIt.debug.createFeatureFromMask(mask);
                        expect(featureObj).toBeNull();
                    }
                );
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
                        expect(fn).toThrow(SyntaxError('Invalid identifier "X:X"'));
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
            'JScrewIt.debug.hasOuterPlus is',
            function ()
            {
                it(
                    'true for leading plus',
                    function ()
                    {
                        var solution = Object('+[]');
                        expect(JScrewIt.debug.hasOuterPlus(solution)).toBe(true);
                        expect(solution.outerPlus).toBe(true);
                    }
                );
                it(
                    'true for middle plus',
                    function ()
                    {
                        var solution = Object('[]+[]');
                        expect(JScrewIt.debug.hasOuterPlus(solution)).toBe(true);
                        expect(solution.outerPlus).toBe(true);
                    }
                );
                it(
                    'false for inner plus',
                    function ()
                    {
                        var solution = Object('(+[])');
                        expect(JScrewIt.debug.hasOuterPlus(solution)).toBe(false);
                        expect(solution.outerPlus).toBe(false);
                    }
                );
                it(
                    'false for leading !+',
                    function ()
                    {
                        var solution = Object('!+[]');
                        expect(JScrewIt.debug.hasOuterPlus(solution)).toBe(false);
                        expect(solution.outerPlus).toBe(false);
                    }
                );
                it(
                    'cached',
                    function ()
                    {
                        var solution = { outerPlus: true };
                        expect(JScrewIt.debug.hasOuterPlus(solution)).toBe(true);
                    }
                );
            }
        );
        describe(
            'JScrewIt.debug.trimJS',
            function ()
            {
                it(
                    'trims spaces',
                    function ()
                    {
                        var input = '\n \uFEFF\t\ralert(1)\r\t \uFEFF\n';
                        var expected = 'alert(1)';
                        var actual = JScrewIt.debug.trimJS(input);
                        expect(actual).toBe(expected);
                    }
                );
                it(
                    'trims single-line comments',
                    function ()
                    {
                        var input = '// Hello\u2028//World!\nalert(1)\n//Goodbye\u2029// World!';
                        var expected = 'alert(1)';
                        var actual = JScrewIt.debug.trimJS(input);
                        expect(actual).toBe(expected);
                    }
                );
                it(
                    'trims multiline comments',
                    function ()
                    {
                        var input = '/*/**//* || pipes\n//slashes */\ralert(1)\r/* and stuff */\n';
                        var expected = 'alert(1)';
                        var actual = JScrewIt.debug.trimJS(input);
                        expect(actual).toBe(expected);
                    }
                );
                it(
                    'trims empty script comments',
                    function ()
                    {
                        var input = '/* Introduction */\n// The end.\n';
                        var expected = '';
                        var actual = JScrewIt.debug.trimJS(input);
                        expect(actual).toBe(expected);
                    }
                );
                it(
                    'does not remove comments between code',
                    function ()
                    {
                        var input = '/*A*/\nalert//B\n(/*C*/1\n//D\n)\n/*E*/';
                        var expected = 'alert//B\n(/*C*/1\n//D\n)';
                        var actual = JScrewIt.debug.trimJS(input);
                        expect(actual).toBe(expected);
                    }
                );
                it(
                    'does not remove false comment in multiline string',
                    function ()
                    {
                        var input = 'x="\\\n//"';
                        var expected = 'x="\\\n//"';
                        var actual = JScrewIt.debug.trimJS(input);
                        expect(actual).toBe(expected);
                    }
                );
                it(
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
        describe(
            'ScrewBuffer',
            function ()
            {
                function createCommaSolution()
                {
                    var block = '.concat';
                    var replacement = '[[]]' + block + '([[]])';
                    var solution = Object(replacement);
                    solution.level = LEVEL_STRING;
                    solution.outerPlus = false;
                    var appendLength = block.length - 1;
                    solution.bridge = { block: block, appendLength: appendLength };
                    return solution;
                }
                
                function test(buffer, expectedStr, tolerance)
                {
                    var actualLength = buffer.length;
                    var expectedLength = expectedStr.length;
                    expect(actualLength).not.toBeGreaterThan(expectedLength);
                    expect(actualLength).not.toBeLessThan(expectedLength - (tolerance ^ 0));
                    expect(buffer + '').toBe(expectedStr);
                }
                
                var solutionA = Object('[![]+[]][+[]]');
                solutionA.level = LEVEL_STRING;
                var solution0 = Object('+[]');
                solution0.level = LEVEL_NUMERIC;
                var solutionFalse = Object('![]');
                solutionFalse.level = LEVEL_NUMERIC;
                var solutionComma = createCommaSolution();
                
                describe(
                    'buffer length does not exceed string length when joining solutions with ' +
                    'outer plus',
                    function ()
                    {
                        it(
                            'without a bridge',
                            function ()
                            {
                                var buffer = JScrewIt.debug.createScrewBuffer(false, false, 4);
                                buffer.append(solution0);
                                buffer.append(solution0);
                                expect(buffer.length).not.toBeGreaterThan(buffer.toString().length);
                            }
                        );
                        it(
                            'with a bridge',
                            function ()
                            {
                                var buffer = JScrewIt.debug.createScrewBuffer(true, false, 4);
                                buffer.append(solution0);
                                buffer.append(solutionComma);
                                buffer.append(solution0);
                                expect(buffer.length).not.toBeGreaterThan(buffer.toString().length);
                            }
                        );
                    }
                );
                
                (function ()
                {
                    var buffer = JScrewIt.debug.createScrewBuffer(false, true, 4);
                    it(
                        'encodes a string in a single group',
                        function ()
                        {
                            expect(buffer.append(solutionA)).toBe(true);
                            expect(buffer.append(solution0)).toBe(true);
                            expect(buffer.append(solution0)).toBe(true);
                            expect(buffer.append(solution0)).toBe(true);
                            test(buffer, '[![]+[]][+[]]+(+[])+(+[])+(+[])', 2);
                        }
                    );
                    it(
                        'encodes a string in two groups',
                        function ()
                        {
                            expect(buffer.append(solutionFalse)).toBe(true);
                            expect(buffer.append(solutionFalse)).toBe(true);
                            test(buffer, '[![]+[]][+[]]+(+[])+(+[])+(+[]+[![]]+![])', 4);
                        }
                    );
                    it(
                        'encodes a string in nested groups',
                        function ()
                        {
                            expect(buffer.append(solutionFalse)).toBe(true);
                            test(
                                buffer,
                                '[![]+[]][+[]]+(+[])+(+[])+(+[]+[![]]+(![]+[![]]))',
                                8
                            );
                        }
                    );
                    it(
                        'encodes a string with the largest possible number of elements',
                        function ()
                        {
                            expect(buffer.append(solutionFalse)).toBe(true);
                            test(
                                buffer,
                                '[![]+[]][+[]]+(+[])+(+[]+[+[]])+(![]+[![]]+(![]+[![]]))',
                                10
                            );
                        }
                    );
                    it(
                        'does not encode a string with too many elements',
                        function ()
                        {
                            expect(buffer.append(solutionFalse)).toBe(false);
                            test(
                                buffer,
                                '[![]+[]][+[]]+(+[])+(+[]+[+[]])+(![]+[![]]+(![]+[![]]))',
                                10
                            );
                        }
                    );
                })();
                
                it(
                    'encodes a string with incomplete groups',
                    function ()
                    {
                        var buffer = JScrewIt.debug.createScrewBuffer(false, true, 7);
                        for (var index = 0; index < 26; ++index)
                        {
                            var solution = Object(String.fromCharCode(65 + index));
                            solution.level = LEVEL_OBJECT;
                            buffer.append(solution);
                        }
                        test(
                            buffer,
                            'A+B+C+D+E+(F+G+H+I+J)+(K+L+M+N+(O+P+Q+R)+(S+T+U+V+(W+X+Y+Z)))',
                            12
                        );
                    }
                );
                it(
                    'encodes a string with multiple bridges',
                    function ()
                    {
                        var buffer = JScrewIt.debug.createScrewBuffer(false, true, 4);
                        for (var index = 0; index < 5; ++index)
                            buffer.append(solutionComma);
                        test(
                            buffer,
                            '[[]].concat([[]]).concat([[]]).concat([[]])+' +
                            '[[]].concat([[]]).concat([[]])',
                            47
                        );
                    }
                );
                
                function testShortEncodings(
                    description,
                    bond,
                    forceString,
                    expected0,
                    expected1,
                    expected2)
                {
                    var createScrewBuffer = JScrewIt.debug.createScrewBuffer;
                    
                    describe(
                        description,
                        function ()
                        {
                            it(
                                'encodes an empty string',
                                function ()
                                {
                                    var buffer = createScrewBuffer(bond, forceString, 10);
                                    test(buffer, expected0);
                                }
                            );
                            it(
                                'encodes a single string character',
                                function ()
                                {
                                    var buffer = createScrewBuffer(bond, forceString, 10);
                                    expect(buffer.append(solutionA)).toBe(true);
                                    test(buffer, expected1);
                                }
                            );
                            it(
                                'encodes a single nonstring character',
                                function ()
                                {
                                    var buffer = createScrewBuffer(bond, forceString, 10);
                                    expect(buffer.append(solution0)).toBe(true);
                                    test(buffer, expected2);
                                }
                            );
                        }
                    );
                }
                
                testShortEncodings(
                    'with no bond and no string forcing',
                    false,
                    false,
                    '[]',
                    '[![]+[]][+[]]',
                    '+[]'
                );
                
                testShortEncodings(
                    'with no bond and string forcing',
                    false,
                    true,
                    '[]+[]',
                    '[![]+[]][+[]]',
                    '+[]+[]'
                );
                
                testShortEncodings(
                    'with bond and no string forcing',
                    true,
                    false,
                    '[]',
                    '[![]+[]][+[]]',
                    '+[]'
                );
                
                testShortEncodings(
                    'with bond and string forcing',
                    true,
                    true,
                    '([]+[])',
                    '[![]+[]][+[]]',
                    '(+[]+[])'
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
                                encoder.exec('{}', void 0, ['express']);
                            }
                        ).toThrow(
                            new Error('Encoding failed')
                        );
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
                        expect(eval(output)).toBe(input);
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
            'Encoder#encodeByDblDict',
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
                        var output = encoder.encodeByDblDict(Object(input));
                        expect(output).toBeJSFuck();
                        expect(eval(output)).toBe(input);
                    }
                );
                it(
                    'returns undefined for too complex input',
                    function ()
                    {
                        var encoder = JScrewIt.debug.createEncoder();
                        var output1 = encoder.encodeByDblDict(Object('12345'), 10);
                        expect(output1).toBeUndefined();
                        var output2 = encoder.encodeByDblDict(Object('12345'), 125);
                        expect(output2).toBeUndefined();
                        var output3 = encoder.encodeByDblDict(Object('12345'), 3700);
                        expect(output3).toBeUndefined();
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
                        expect(eval(output)).toBe(input);
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
                        var output1 = encoder.encodeByDict(Object('12345'), void 0, void 0, 10);
                        expect(output1).toBeUndefined();
                        var output2 = encoder.encodeByDict(Object('12345'), void 0, void 0, 78);
                        expect(output2).toBeUndefined();
                        var output3 = encoder.encodeByDict(Object('12345'), void 0, void 0, 200);
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
                        test('createParseIntArgDefault', ['ATOB', 'ENTRIES_OBJ']);
                        test('createParseIntArgByReduce', 'DEFAULT');
                        test('createParseIntArgByReduceArrow', ['ARROW', 'ENTRIES_OBJ']);
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
                        test('with an empty array', '""([])');
                        test('with a singleton array', '""([0])');
                        test('with a sum', '1+1');
                        test('with a sum of modified sums', 'a+(+(b+c))');
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
                        encoder.replaceString = Function();
                        expect(encoder.replaceFalseFreeArray([])).toBeUndefined();
                    }
                );
            }
        );
        describe(
            'Encoder#replaceString',
            function ()
            {
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
                            endSBFS)
                        {
                            function fn()
                            {
                                it(
                                    'with no bond and no string forcing',
                                    function ()
                                    {
                                        var output = encoder.replaceString(expr, false, false);
                                        expect(output).toStartWith(start0);
                                        expect(output).toEndWith(end0);
                                    }
                                );
                                it(
                                    'with bond and no string forcing',
                                    function ()
                                    {
                                        var output = encoder.replaceString(expr, true, false);
                                        expect(output).toStartWith(startSB);
                                        expect(output).toEndWith(endSB);
                                    }
                                );
                                it(
                                    'with no bond and string forcing',
                                    function ()
                                    {
                                        var output = encoder.replaceString(expr, false, true);
                                        expect(output).toStartWith(startFS);
                                        expect(output).toEndWith(endFS);
                                    }
                                );
                                it(
                                    'with bond and string forcing',
                                    function ()
                                    {
                                        var output = encoder.replaceString(expr, true, true);
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
                
                describe(
                    'replaces complex input for',
                    function ()
                    {
                        function findFirstDefinedEntry(entries)
                        {
                            var entry;
                            while (entry = entries.shift())
                            {
                                if (entry.definition)
                                    return entry;
                            }
                        }
                        
                        function test(complex, features)
                        {
                            it(
                                complex,
                                function ()
                                {
                                    var encoder = JScrewIt.debug.createEncoder(features);
                                    var expectedOutput = encoder.resolveComplex(complex) + '';
                                    var actualOutput = encoder.replaceString(complex);
                                    expect(actualOutput).toBe(
                                        expectedOutput,
                                        'expected ' + expectedOutput.length + ' chars but found ' +
                                        actualOutput.length
                                    );
                                }
                            );
                        }
                        
                        JScrewIt.debug.getComplexNames().forEach(
                            function (complexName)
                            {
                                var entries = JScrewIt.debug.getComplexEntries(complexName);
                                var firstDefinedEntry = findFirstDefinedEntry(entries);
                                var mask = firstDefinedEntry.mask;
                                var featureObj = JScrewIt.debug.createFeatureFromMask(mask);
                                test(complexName, featureObj);
                            }
                        );
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
                        expect(debugReplacer('B')).toThrow(
                            SyntaxError('Circular reference detected: B < C < B')
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
                                expect(debugReplacer('A')).toThrow(
                                    SyntaxError('Undefined identifier FILL in the definition of A')
                                );
                            }
                        );
                        it(
                            'inline',
                            function ()
                            {
                                expect(debugReplacer('valueOf')).toThrow(
                                    SyntaxError('Undefined identifier valueOf')
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
                                expect(debugReplacer('D')).toThrow(
                                    SyntaxError('Syntax error in the definition of D')
                                );
                            }
                        );
                        it(
                            'inline',
                            function ()
                            {
                                expect(debugReplacer('?')).toThrow(
                                    SyntaxError('Syntax error')
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
                                expect(debugReplacer('E')).toThrow(
                                    SyntaxError('Syntax error in the definition of E')
                                );
                            }
                        );
                        it(
                            'inline',
                            function ()
                            {
                                expect(debugReplacer('"\\xx"')).toThrow(
                                    SyntaxError('Syntax error')
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
                                expect(debugReplacer('F')).toThrow(
                                    SyntaxError('String too complex in the definition of F')
                                );
                            }
                        );
                        it(
                            'inline',
                            function ()
                            {
                                expect(debugReplacer('"too complex"')).toThrow(
                                    SyntaxError('String too complex')
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
                                encoder.resolveExprAt('', 42, void 0, []);
                            }
                        ).toThrow(SyntaxError('Missing padding entries for index 42'));
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
                        ).toThrow(SyntaxError('Undefined padding block with length -1'));
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
                                    if (maxLength === void 0)
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
                                        expect(eval(output)).toBe(text);
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
        var featureNames = featureObj.elementaryNames;
        if (
            featureNames.every(
                function (featureName)
                {
                    return featureName in featureSet;
                }
            )
        )
        {
            return featureNames.filter(
                function (featureName)
                {
                    return featureSet[featureName];
                }
            );
        }
    }
    
    function getEntryFeature(entry)
    {
        var featureObj = JScrewIt.debug.createFeatureFromMask(entry.mask);
        return featureObj;
    }
    
    function getFunctionName(fn)
    {
        var name = fn.name;
        if (name === void 0)
            name = /^\s*function ([\w\$]+)/.exec(fn)[1];
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
    
    function init(arg)
    {
        JScrewIt = arg || global.JScrewIt;
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
    
    function testCharacter(charCode)
    {
        function testAtob()
        {
            if ('ATOB' in featureSet)
            {
                it(
                    '(atob)',
                    function ()
                    {
                        var encoder = getPoolEncoder(Feature.ATOB);
                        var solution = encoder.defaultResolveCharacter(char);
                        verifySolution(solution, char, featureSet.ATOB && ['ATOB']);
                        expect(solution.length).not.toBeGreaterThan(
                            getPoolEncoder(Feature.DEFAULT).resolveCharacter(char).length
                        );
                    }
                );
            }
        }
        
        function testFEntry(entry, dispositions, varieties)
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
                                var testFeatureObj =
                                    Feature(varietyFeatureObj, solutionFeatureObj);
                                var emuFeatures = getEmuFeatureNames(testFeatureObj);
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
            ['IE_SRC'],
            ['V8_SRC'],
            ['NO_IE_SRC'],
            ['NO_V8_SRC'],
            ['NO_IE_SRC', 'NO_V8_SRC'],
            ['FILL'],
            ['FILL', 'IE_SRC'],
            ['FILL', 'V8_SRC'],
            ['FILL', 'NO_IE_SRC'],
            ['FILL', 'NO_V8_SRC'],
            ['FILL', 'NO_IE_SRC', 'NO_V8_SRC'],
        ];
        
        var FB_VARIETIES = [['IE_SRC'], ['V8_SRC'], ['NO_IE_SRC', 'NO_V8_SRC']];
        
        var FH_DISPOSITIONS =
        [
            [],
            ['IE_SRC'],
            ['NO_IE_SRC'],
            ['FILL'],
            ['FILL', 'IE_SRC'],
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
                    var usingDefaultFeature = Feature.DEFAULT.includes(featureObj);
                    defaultEntryFound |= usingDefaultFeature;
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
                                case 'defaultCharDefinition':
                                    break;
                                case 'definitionFB':
                                    testFEntry(entry, FB_DISPOSITIONS, FB_VARIETIES);
                                    return;
                                case 'definitionFH':
                                    testFEntry(entry, FH_DISPOSITIONS, FH_VARIETIES);
                                    return;
                                default:
                                    throw Error(
                                        'Unexpected definition function name ' + name
                                    );
                                }
                            }
                            var solution = decodeEntry(entry);
                            verifySolution(solution, char, emuFeatures);
                        }
                    );
                }
                
                var testDefault =
                    it.bind(
                        null,
                        '(default)',
                        function ()
                        {
                            var encoder = getPoolEncoder(Feature.DEFAULT);
                            var solution = encoder.defaultResolveCharacter(char);
                            verifySolution(solution, char);
                        }
                    );
                var entries = JScrewIt.debug.getCharacterEntries(char);
                if (entries)
                {
                    var defaultEntryFound = false;
                    if (entries)
                        entries.forEach(testEntry);
                    if (!defaultEntryFound)
                    {
                        testDefault();
                        testAtob();
                    }
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
                                        var actual = eval(output);
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
    
    function testFeatureObj(featureName)
    {
        var featureObj = Feature[featureName];
        
        describe(
            featureName,
            function ()
            {
                it(
                    'is named correctly',
                    function ()
                    {
                        var name = featureObj.name;
                        expect(name).toBeString();
                        expect(featureObj).toBe(Feature[name]);
                        expect(featureObj).toBe(Feature.ALL[name]);
                    }
                );
                it(
                    'has description string',
                    function ()
                    {
                        expect(featureObj.description).toBeString();
                    }
                );
                it(
                    'has a mask consisting of two 32-bit integers',
                    function ()
                    {
                        var mask = featureObj.mask;
                        expect(mask).toBeArray();
                        expect(Object.isFrozen(mask)).toBeTruthy();
                        expect(mask.length).toBe(2);
                        expect(mask[0]).toBeInt32();
                        expect(mask[1]).toBeInt32();
                    }
                );
                it(
                    'has elementaryNames string array',
                    function ()
                    {
                        var elementaryNames = featureObj.elementaryNames;
                        expect(elementaryNames).toBeArray();
                        elementaryNames.forEach(
                            function (name)
                            {
                                expect(name).toBeString();
                            }
                        );
                    }
                );
                it(
                    'has canonicalNames string array',
                    function ()
                    {
                        var canonicalNames = featureObj.canonicalNames;
                        expect(canonicalNames).toBeArray();
                        var elementaryNames = featureObj.elementaryNames;
                        expect(elementaryNames).toBeArray();
                        canonicalNames.forEach(
                            function (name)
                            {
                                expect(elementaryNames).toContain(name);
                            }
                        );
                    }
                );
                var check = featureObj.check;
                if (check)
                {
                    it(
                        'has a nonempty mask',
                        function ()
                        {
                            expect(JScrewIt.debug.maskIsEmpty(featureObj.mask)).toBe(false);
                        }
                    );
                    emuIt(
                        'is checkable',
                        featureObj,
                        function (emuFeatures)
                        {
                            expect(emuDo(emuFeatures, check)).toBeTruthy();
                        }
                    );
                }
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
    
    var LEVEL_NUMERIC   = -1;
    var LEVEL_OBJECT    = 0;
    var LEVEL_STRING    = 1;
    
    var Feature;
    var JScrewIt;
    var encoderCache = Object.create(null);
    var featureSet;
    
    var TestSuite = { init: init };
    
    if (global.self)
        self.TestSuite = TestSuite;
    if (typeof module !== 'undefined')
        module.exports = TestSuite;
}
)(typeof self === 'undefined' ? global : self);
