/*
global
EMU_FEATURES,
atob,
btoa,
document,
emuDo,
emuEval,
expect,
global,
module,
repeat,
self
*/
/* jshint mocha: true, nonstandard: true */

(function (global)
{
    'use strict';
    
    function decodeEntry(entry)
    {
        var featureObj = getEntryFeature(entry);
        var key = featureObj.canonicalNames.join('+');
        var encoder = encoderCache[key];
        if (!encoder)
            encoderCache[key] = encoder = JScrewIt.debug.createEncoder(featureObj);
        var output = encoder.resolve(entry.definition) + '';
        return output;
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
                    var expression1 = 'return[Math.log(2e18)]^0';
                    it(
                        JSON.stringify(expression1) + ' (with wrapWith: "call")',
                        function ()
                        {
                            var perfInfo = { };
                            var options =
                                { features: compatibility, perfInfo: perfInfo, wrapWith: 'call' };
                            var output = JScrewIt.encode(expression1, options);
                            var actual = emuEval(emuFeatures, output);
                            expect(actual).toBe(42);
                            expect(perfInfo.codingLog).toBeArray();
                        }
                    );
                    var expression2 = 'decodeURI(encodeURI("♠♥♦♣"))';
                    it(
                        JSON.stringify(expression2) + ' (with wrapWith: "eval")',
                        function ()
                        {
                            var perfInfo = { };
                            var options =
                                { features: compatibility, perfInfo: perfInfo, wrapWith: 'eval' };
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
                            var options = { features: compatibility, perfInfo: perfInfo };
                            var output = JScrewIt.encode(expression3, options);
                            var actual = emuEval(emuFeatures, output);
                            expect(actual).toBe(expression3);
                            expect(output).toBe(expectedEncoding3);
                            expect(perfInfo.codingLog).toBeArray();
                        }
                    );
                    var expression4 = repeat('☺', 20);
                    it(
                        JSON.stringify(expression4) + ' (with wrapWith: "none")',
                        function ()
                        {
                            var perfInfo = { };
                            var options =
                                { features: compatibility, perfInfo: perfInfo, wrapWith: 'none' };
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
                        expect(self.JSFuck).toBe(JScrewIt);
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
                ['Number', 'Object', 'RegExp', 'String'].forEach(
                    function (complex)
                    {
                        function verifyOutput(output, emuFeatures)
                        {
                            expect(output).toBeJSFuck();
                            var actual = emuEval(emuFeatures || [], output);
                            expect(actual).toBe(complex);
                        }
                        
                        var desc = JSON.stringify(complex);
                        describe(
                            desc,
                            function ()
                            {
                                var entries = JScrewIt.debug.getComplexEntries(complex);
                                entries.forEach(
                                    function (entry, index)
                                    {
                                        if (entry.definition)
                                        {
                                            var featureObj = getEntryFeature(entry);
                                            var emuFeatures = getEmuFeatureNames(featureObj);
                                            if (emuFeatures)
                                            {
                                                it(
                                                    '(definition ' + index + ')',
                                                    function ()
                                                    {
                                                        var output = decodeEntry(entry);
                                                        verifyOutput(output, emuFeatures);
                                                    }
                                                );
                                            }
                                        }
                                    }
                                );
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
                testConstant('Boolean', isExpected(Boolean));
                testConstant('Date', isExpected(Date));
                testConstant('Function', isExpected(Function));
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
                    'encodes an empty string with wrapWith',
                    function ()
                    {
                        it(
                            'none',
                            function ()
                            {
                                var output = JScrewIt.encode('', { wrapWith: 'none' });
                                expect(output).toBe('[]+[]');
                            }
                        );
                        it(
                            'call',
                            function ()
                            {
                                var output = JScrewIt.encode('', { wrapWith: 'call' });
                                expect(output).toMatch(/\(\)\(\)$/);
                            }
                        );
                        it(
                            'eval',
                            function ()
                            {
                                var output = JScrewIt.encode('', { wrapWith: 'eval' });
                                expect(output).toMatch(/\(\)$/);
                            }
                        );
                    }
                );
                describe(
                    'encodes a single digit with wrapWith',
                    function ()
                    {
                        it(
                            'none',
                            function ()
                            {
                                var output = JScrewIt.encode('2');
                                expect(output).toBe('!![]+!![]+[]');
                            }
                        );
                        it(
                            'call',
                            function ()
                            {
                                var output = JScrewIt.encode('2', { wrapWith: 'call' });
                                expect(output).toMatch(/\(!!\[]\+!!\[]\)\(\)$/);
                            }
                        );
                        it(
                            'eval',
                            function ()
                            {
                                var output = JScrewIt.encode('2', { wrapWith: 'eval' });
                                expect(output).toMatch(/\(!!\[]\+!!\[]\)$/);
                            }
                        );
                    }
                );
                it(
                    'throws a ReferenceError for incompatible features',
                    function ()
                    {
                        var fn =
                            function ()
                            {
                                var options = { features: ['NO_IE_SRC', 'IE_SRC'] };
                                JScrewIt.encode('', options);
                            };
                        expect(fn).toThrow(ReferenceError('Incompatible features'));
                    }
                );
                it(
                    'throws an error for invalid wrapWith',
                    function ()
                    {
                        var fn =
                            function ()
                            {
                                var options = { wrapWith: null };
                                JScrewIt.encode('', options);
                            };
                        expect(fn).toThrow(Error('Invalid value for option wrapWith'));
                    }
                );
                it(
                    'still supports legacy option parameters',
                    function ()
                    {
                        var input = 'alert(1)';
                        var output = JScrewIt.encode(input, true, 'FF31');
                        var options = { features: 'FF31', wrapWith: 'call' };
                        var expected = JScrewIt.encode(input, options);
                        expect(output).toBe(expected);
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
                                var output = JScrewIt.encode('/* */\nABC\n', { trimCode: true });
                                var actual = eval(output);
                                expect(actual).toBe('ABC');
                            }
                        );
                        it(
                            'encodes a script consisting of only blanks and comments',
                            function ()
                            {
                                var output = JScrewIt.encode('/* */\n', { trimCode: true });
                                var actual = eval(output);
                                expect(actual).toBe('');
                            }
                        );
                        it(
                            'encodes malformed JavaScript',
                            function ()
                            {
                                var output = JScrewIt.encode('/* */"ABC', { trimCode: true });
                                var actual = eval(output);
                                expect(actual).toBe('/* */"ABC');
                            }
                        );
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
                                var feature =
                                    Feature(
                                        ['NAME', Feature.WINDOW],
                                        'HTMLDOCUMENT',
                                        Feature.NO_IE_SRC,
                                        []
                                    );
                                expect(feature.mask).toBe(
                                    Feature.NAME.mask |
                                    Feature.WINDOW.mask |
                                    Feature.HTMLDOCUMENT.mask |
                                    Feature.NO_IE_SRC.mask
                                );
                            }
                        );
                        it(
                            'throws a ReferenceError for unknown features',
                            function ()
                            {
                                var fn = Feature.bind(Feature, '???');
                                expect(fn).toThrow(ReferenceError('Unknown feature "???"'));
                            }
                        );
                        it(
                            'throws a ReferenceError for incompatible feature arrays',
                            function ()
                            {
                                var fn = Feature.bind(Feature, ['IE_SRC', 'NO_IE_SRC']);
                                expect(fn).toThrow(ReferenceError('Incompatible features'));
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
                            'throws a ReferenceError for incompatible features',
                            function ()
                            {
                                var fn =
                                    Feature.bind(
                                        Feature,
                                        'ENTRIES_PLAIN',
                                        'OLD_SAFARI_ARRAY_ITERATOR'
                                    );
                                expect(fn).toThrow(ReferenceError('Incompatible features'));
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
                                expect(featureObj.mask).toBe(0);
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
                                expect(featureObj.mask).toBe(expectedFeature.mask);
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
                                expect(featureObj.mask).not.toBe(0);
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
                            'throws a ReferenceError for unknown features',
                            function ()
                            {
                                var fn = Feature.prototype.includes.bind(Feature.DEFAULT, '???');
                                expect(fn).toThrow(ReferenceError('Unknown feature "???"'));
                            }
                        );
                        it(
                            'throws a ReferenceError for incompatible feature arrays',
                            function ()
                            {
                                var fn =
                                    Feature.prototype.includes.bind(
                                        Feature.DEFAULT,
                                        ['IE_SRC', 'NO_IE_SRC']
                                    );
                                expect(fn).toThrow(ReferenceError('Incompatible features'));
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
                                expect(featureObj.mask).toBe(Feature.DEFAULT.mask);
                            }
                        );
                        it(
                            'restricts a feature in a particular engine',
                            function ()
                            {
                                var featureObj =
                                    Feature.WINDOW.restrict('web-worker', [Feature.FF31]);
                                expect(featureObj.mask).toBe(Feature.SELF_OBJ.mask);
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
                                    /^\[Feature \{[0-9A-Z_]+(, [0-9A-Z_]+)*\}\]$/
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
                            'throws a ReferenceError for unknown features',
                            function ()
                            {
                                var fn = Feature.areEqual.bind(null, '???');
                                expect(fn).toThrow(ReferenceError('Unknown feature "???"'));
                            }
                        );
                        it(
                            'throws a ReferenceError for incompatible feature arrays',
                            function ()
                            {
                                var fn = Feature.areEqual.bind(null, ['IE_SRC', 'NO_IE_SRC']);
                                expect(fn).toThrow(ReferenceError('Incompatible features'));
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
                                expect(featureObj.mask).toBe(0);
                            }
                        );
                        it(
                            'throws a ReferenceError for unknown features',
                            function ()
                            {
                                var fn = Feature.commonOf.bind(null, '???');
                                expect(fn).toThrow(ReferenceError('Unknown feature "???"'));
                            }
                        );
                        it(
                            'throws a ReferenceError for incompatible feature arrays',
                            function ()
                            {
                                var fn = Feature.commonOf.bind(null, ['IE_SRC', 'NO_IE_SRC']);
                                expect(fn).toThrow(ReferenceError('Incompatible features'));
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
                            'throws a ReferenceError for incompatible feature arrays',
                            function ()
                            {
                                var fn =
                                    Feature.commonOf.bind(
                                        null,
                                        'ANY_WINDOW',
                                        ['WINDOW', 'DOMWINDOW']
                                    );
                                expect(fn).toThrow(ReferenceError('Incompatible features'));
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
                        var featureMask = Feature.NO_IE_SRC.mask | Feature.IE_SRC.mask;
                        var featureObj = JScrewIt.debug.createFeatureFromMask(featureMask);
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
                        var input = '\n \t\ralert(1)\r\t \n';
                        var expected = 'alert(1)';
                        var actual = JScrewIt.debug.trimJS(input);
                        expect(actual).toBe(expected);
                    }
                );
                it(
                    'trims single-line comments',
                    function ()
                    {
                        var input = '// Hello\n//World!\nalert(1)\n//Goodbye\n// World!';
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
                    var block = '["concat"]';
                    var replacement = '[[]]' + block + '([[]])';
                    var solution = Object(replacement);
                    solution.level = 1;
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
                solutionA.level = 1;
                var solution0 = Object('+[]');
                solution0.level = -1;
                var solutionFalse = Object('![]');
                solutionFalse.level = -1;
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
                            solution.level = 0;
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
                            '[[]]["concat"]([[]])["concat"]([[]])["concat"]([[]])+' +
                            '[[]]["concat"]([[]])["concat"]([[]])',
                            47
                        );
                    }
                );
                
                function testShortEncodings(
                    description,
                    strongBound,
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
                                    var buffer = createScrewBuffer(strongBound, forceString, 10);
                                    test(buffer, expected0);
                                }
                            );
                            it(
                                'encodes a single string character',
                                function ()
                                {
                                    var buffer = createScrewBuffer(strongBound, forceString, 10);
                                    expect(buffer.append(solutionA)).toBe(true);
                                    test(buffer, expected1);
                                }
                            );
                            it(
                                'encodes a single nonstring character',
                                function ()
                                {
                                    var buffer = createScrewBuffer(strongBound, forceString, 10);
                                    expect(buffer.append(solution0)).toBe(true);
                                    test(buffer, expected2);
                                }
                            );
                        }
                    );
                }
                
                testShortEncodings(
                    'with weak bound and no string forcing',
                    false,
                    false,
                    '',
                    '[![]+[]][+[]]',
                    '+[]'
                );
                
                testShortEncodings(
                    'with weak bound and string forcing',
                    false,
                    true,
                    '[]+[]',
                    '[![]+[]][+[]]',
                    '+[]+[]'
                );
                
                testShortEncodings(
                    'with strong bound and no string forcing',
                    true,
                    false,
                    '',
                    '[![]+[]][+[]]',
                    '+[]'
                );
                
                testShortEncodings(
                    'with strong bound and string forcing',
                    true,
                    true,
                    '([]+[])',
                    '[![]+[]][+[]]',
                    '(+[]+[])'
                );
            }
        );
        describe(
            'Encoder#replaceExpr can replace',
            function ()
            {
                var encoder = JScrewIt.debug.createEncoder();
                it(
                    'a number',
                    function ()
                    {
                        var actual = eval(encoder.replaceExpr('"" + 2'));
                        expect(actual).toBe('2');
                    }
                );
                it(
                    'NaN',
                    function ()
                    {
                        var actual = eval(encoder.replaceExpr('"" + NaN'));
                        expect(actual).toBe('NaN');
                    }
                );
            }
        );
        describe(
            'Encoder#encode',
            function ()
            {
                it(
                    'throws an Error with message "Encoding failed" for too complex input',
                    function ()
                    {
                        var encoder = JScrewIt.debug.createEncoder();
                        encoder.callCoders = Function();
                        expect(
                            function ()
                            {
                                encoder.encode('12345');
                            }
                        ).toThrow(
                            new Error('Encoding failed')
                        );
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
                            var emuFeatures = getEmuFeatureNames(featureObj);
                            if (emuFeatures)
                            {
                                it(
                                    createParseIntArgName,
                                    function ()
                                    {
                                        var encoder = JScrewIt.debug.createEncoder(featureObj);
                                        var output = encoder.encodeByDict(inputData, 5, 3);
                                        expect(emuEval(emuFeatures, output)).toBe(input);
                                    }
                                );
                            }
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
                                    'with weak bound and no string forcing',
                                    function ()
                                    {
                                        var output = encoder.replaceString(expr, false, false);
                                        expect(output).toStartWith(start0);
                                        expect(output).toEndWith(end0);
                                    }
                                );
                                it(
                                    'with strong bound and no string forcing',
                                    function ()
                                    {
                                        var output = encoder.replaceString(expr, true, false);
                                        expect(output).toStartWith(startSB);
                                        expect(output).toEndWith(endSB);
                                    }
                                );
                                it(
                                    'with weak bound and string forcing',
                                    function ()
                                    {
                                        var output = encoder.replaceString(expr, false, true);
                                        expect(output).toStartWith(startFS);
                                        expect(output).toEndWith(endFS);
                                    }
                                );
                                it(
                                    'with strong bound and string forcing',
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
                        
                        test('Number', 'NAME');
                        test('Object', 'NAME');
                        test('RegExp', 'NAME');
                        test('String', 'NAME');
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
                JScrewIt.debug.defineConstant(encoder, 'E', '"\\?"');
                JScrewIt.debug.defineConstant(encoder, 'F', '"too complex"');
                
                it(
                    'Circular reference',
                    function ()
                    {
                        expect(debugReplacer('B')).toThrow(
                            SyntaxError('Circular reference detected: B < C < B')
                        );
                    }
                );
                describe(
                    'Undefined literal',
                    function ()
                    {
                        it(
                            'in a definition',
                            function ()
                            {
                                expect(debugReplacer('A')).toThrow(
                                    SyntaxError('Undefined literal FILL in the definition of A')
                                );
                            }
                        );
                        it(
                            'inline',
                            function ()
                            {
                                expect(debugReplacer('valueOf')).toThrow(
                                    SyntaxError('Undefined literal valueOf')
                                );
                            }
                        );
                    }
                );
                describe(
                    'Unexpected character',
                    function ()
                    {
                        it(
                            'in a definition',
                            function ()
                            {
                                expect(debugReplacer('D')).toThrow(
                                    SyntaxError('Unexpected character "?" in the definition of D')
                                );
                            }
                        );
                        it(
                            'inline',
                            function ()
                            {
                                expect(debugReplacer('?')).toThrow(
                                    SyntaxError('Unexpected character "?"')
                                );
                            }
                        );
                    }
                );
                describe(
                    'Illegal string',
                    function ()
                    {
                        it(
                            'in a definition',
                            function ()
                            {
                                expect(debugReplacer('E')).toThrow(
                                    SyntaxError('Illegal string "\\?" in the definition of E')
                                );
                            }
                        );
                        it(
                            'inline',
                            function ()
                            {
                                expect(debugReplacer('"\\?"')).toThrow(
                                    SyntaxError('Illegal string "\\?"')
                                );
                            }
                        );
                    }
                );
                describe(
                    'String too complex',
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
                                encoder.resolveExprAt('', 42, undefined, []);
                            }
                        ).toThrow(SyntaxError('Missing padding entries for index 42'));
                    }
                );
            }
        );
        describe(
            'Encoder#getPadding throws a SyntaxError for',
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
                var input = 'Lorem ipsum dolor sit amet';
                var coders = JScrewIt.debug.getCoders();
                Object.keys(coders).forEach(
                    function (coderName)
                    {
                        describe(
                            coderName,
                            function ()
                            {
                                var maxLength = coders[coderName].call(encoder, Object('')).length;
                                it(
                                    'returns correct JSFuck',
                                    function ()
                                    {
                                        var output = coders[coderName].call(encoder, Object(input));
                                        expect(output).toBeJSFuck();
                                        expect(eval(output)).toBe(input);
                                    }
                                );
                                it(
                                    'returns undefined when output length exceeds maxLength',
                                    function ()
                                    {
                                        var output =
                                            coders[coderName].call(
                                                encoder,
                                                Object(''),
                                                maxLength - 1
                                            );
                                        expect(output).toBeUndefined();
                                    }
                                );
                                it(
                                    'returns a string when output length equals maxLength',
                                    function ()
                                    {
                                        var output =
                                            coders[coderName].call(encoder, Object(''), maxLength);
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
        var featureObj = JScrewIt.debug.createFeatureFromMask(entry.featureMask);
        return featureObj;
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
        var char = String.fromCharCode(charCode);
        var desc =
            charCode >= 0x7f && charCode <= 0xa0 || charCode === 0xad ?
            '"\\u00' + charCode.toString(16) + '"' : JSON.stringify(char);
        describe(
            desc,
            function ()
            {
                function verifyOutput(output, emuFeatures)
                {
                    expect(output).toBeJSFuck();
                    var actual = emuEval(emuFeatures || [], output) + '';
                    expect(actual).toBe(char);
                }
                
                var testDefault =
                    it.bind(
                        null,
                        '(default)',
                        function ()
                        {
                            var output = JScrewIt.encode(char);
                            verifyOutput(output);
                        }
                    );
                var entries = JScrewIt.debug.getCharacterEntries(char);
                if (entries)
                {
                    var defaultEntryFound = false;
                    if (entries)
                    {
                        entries.forEach(
                            function (entry, index)
                            {
                                if (entry.definition)
                                {
                                    var featureObj = getEntryFeature(entry);
                                    var usingDefaultFeature = Feature.DEFAULT.includes(featureObj);
                                    defaultEntryFound |= usingDefaultFeature;
                                    var emuFeatures = getEmuFeatureNames(featureObj);
                                    if (emuFeatures)
                                    {
                                        it(
                                            '(definition ' + index + ')',
                                            function ()
                                            {
                                                var output = decodeEntry(entry);
                                                verifyOutput(output, emuFeatures);
                                            }
                                        );
                                    }
                                }
                            }
                        );
                    }
                    if (!defaultEntryFound)
                        testDefault();
                }
                else
                {
                    testDefault();
                    if ('ATOB' in featureSet)
                    {
                        it(
                            '(atob)',
                            function ()
                            {
                                var options = { features: 'ATOB' };
                                var output = JScrewIt.encode(char, options);
                                verifyOutput(output, featureSet.ATOB && ['ATOB']);
                                expect(output.length).not.toBeGreaterThan(
                                    JScrewIt.encode(char).length
                                );
                            }
                        );
                    }
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
                        var emuFeatures = getEmuFeatureNames(featureObj);
                        if (emuFeatures)
                        {
                            it(
                                '(definition ' + index + ')',
                                function ()
                                {
                                    var output = decodeEntry(entry);
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
                    'has 32-bit integer mask',
                    function ()
                    {
                        expect(featureObj.mask).toBeInt32();
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
                var emuFeatures = getEmuFeatureNames(featureObj);
                if (emuFeatures)
                {
                    it(
                        'is checkable',
                        function ()
                        {
                            var check = featureObj.check;
                            if (check)
                                expect(emuDo(emuFeatures, check)).toBeTruthy();
                        }
                    );
                }
            }
        );
    }
    
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
