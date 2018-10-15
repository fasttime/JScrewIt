/* eslint-env mocha */
/*
global
Audio,
Node,
atob,
btoa,
document,
emuDo,
emuEval,
emuIt,
evalJSFuck,
expect,
getEmuFeatureNames,
module,
require,
self,
sidebar,
uneval,
*/

'use strict';

(function ()
{
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
            if (charCode < 0x100)
            {
                emuIt
                (
                    '(atob)',
                    Feature.ATOB,
                    function (emuFeatures)
                    {
                        var encoder = getPoolEncoder(Feature.ATOB);
                        var solution =
                        encoder.createCharDefaultSolution(charCode, true, false, false, false);
                        verifySolution(solution, char, emuFeatures);
                        expect(solution.length).not.toBeGreaterThan
                        (
                            getPoolEncoder(Feature.DEFAULT).resolveCharacter(char).length
                        );
                    }
                );
            }
        }

        function testDefault()
        {
            it
            (
                '(charCode)',
                function ()
                {
                    var encoder = getPoolEncoder(Feature.DEFAULT);
                    var solution =
                    encoder.createCharDefaultSolution(charCode, false, true, false, false);
                    verifySolution(solution, char);
                }
            );
            it
            (
                '(escSeq)',
                function ()
                {
                    var encoder = getPoolEncoder(Feature.DEFAULT);
                    var solution =
                    encoder.createCharDefaultSolution(charCode, false, false, true, false);
                    verifySolution(solution, char);
                }
            );
            it
            (
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
            dispositions.forEach
            (
                function (additionalFeatureNames)
                {
                    var solutionFeatureObj = Feature(entryFeatureObj, additionalFeatureNames);
                    var solution = decodeEntryWithFeature(entry, solutionFeatureObj);
                    varieties.forEach
                    (
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
            ['FILL'],
            ['FLAT'],
            ['IE_SRC'],
            ['INCR_CHAR'],
            ['NO_FF_SRC'],
            ['NO_IE_SRC'],
            ['NO_V8_SRC'],
            ['V8_SRC'],
            ['FF_SRC', 'FILL'],
            ['FF_SRC', 'FLAT'],
            ['FILL', 'IE_SRC'],
            ['FILL', 'INCR_CHAR'],
            ['FILL', 'NO_FF_SRC'],
            ['FILL', 'NO_IE_SRC'],
            ['FILL', 'NO_V8_SRC'],
            ['FILL', 'V8_SRC'],
            ['FLAT', 'IE_SRC'],
            ['FLAT', 'INCR_CHAR'],
            ['FLAT', 'NO_FF_SRC'],
            ['FLAT', 'NO_IE_SRC'],
            ['FLAT', 'NO_V8_SRC'],
            ['FLAT', 'V8_SRC'],
            ['INCR_CHAR', 'NO_FF_SRC'],
            ['INCR_CHAR', 'NO_V8_SRC'],
            ['FILL', 'INCR_CHAR', 'NO_FF_SRC'],
            ['FILL', 'INCR_CHAR', 'NO_V8_SRC'],
            ['FLAT', 'INCR_CHAR', 'NO_FF_SRC'],
            ['FLAT', 'INCR_CHAR', 'NO_V8_SRC'],
        ];

        var FB_VARIETIES = [['FF_SRC'], ['IE_SRC'], ['V8_SRC']];

        var FH_DISPOSITIONS =
        [
            [],
            ['FILL'],
            ['FLAT'],
            ['IE_SRC'],
            ['INCR_CHAR'],
            ['NO_IE_SRC'],
            ['FILL', 'IE_SRC'],
            ['FILL', 'INCR_CHAR'],
            ['FILL', 'NO_IE_SRC'],
            ['FLAT', 'IE_SRC'],
            ['FLAT', 'INCR_CHAR'],
            ['FLAT', 'NO_IE_SRC'],
        ];

        var FH_VARIETIES = [['IE_SRC'], ['NO_IE_SRC']];

        var char = String.fromCharCode(charCode);
        var desc =
        charCode >= 0x7f && charCode <= 0xa0 || charCode === 0xad ?
        '"\\u00' + charCode.toString(16) + '"' : JSON.stringify(char);
        describe
        (
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
                    emuIt
                    (
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
                                    expect().fail
                                    (
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

    function testComplex(complex)
    {
        var desc = JSON.stringify(complex);
        var entry = JScrewIt.debug.getComplexEntry(complex);
        var featureObj = getEntryFeature(entry);
        emuIt
        (
            desc,
            featureObj,
            function (emuFeatures)
            {
                var encoder = getPoolEncoder(featureObj);
                var definition = entry.definition;
                var solution = encoder.resolve(definition);
                expect(solution.level).toBe(definition.level, 'Solution level mismatch');
                verifySolution(solution, complex, emuFeatures);
            }
        );
    }

    function testConstant(constant, validator)
    {
        describe
        (
            constant,
            function ()
            {
                var entries = JScrewIt.debug.getConstantEntries(constant);
                entries.forEach
                (
                    function (entry, index)
                    {
                        var featureObj = getEntryFeature(entry);
                        emuIt
                        (
                            '(definition ' + index + ')',
                            featureObj,
                            function (emuFeatures)
                            {
                                var output = String(decodeEntry(entry));
                                expect(output).toBeJSFuck();
                                emuDo
                                (
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

    var JScrewIt = typeof module !== 'undefined' ? require('../node-jscrewit-test') : self.JScrewIt;
    var Feature = JScrewIt.Feature;
    var encoderCache = Object.create(null);

    describe
    (
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
    describe
    (
        'Complex definitions of',
        function ()
        {
            JScrewIt.debug.getComplexNames().forEach(testComplex);
        }
    );
    describe
    (
        'Constant definitions of',
        function ()
        {
            testConstant('Array', isExpected(Array));
            testConstant
            (
                'Audio',
                function ()
                {
                    this.toBe(Audio);
                }
            );
            testConstant('Boolean', isExpected(Boolean));
            testConstant('Date', isExpected(Date));
            testConstant('Function', isExpected(Function));
            testConstant
            (
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
            testConstant
            (
                'atob',
                function ()
                {
                    this.toBe(atob);
                }
            );
            testConstant
            (
                'btoa',
                function ()
                {
                    this.toBe(btoa);
                }
            );
            testConstant
            (
                'document',
                function ()
                {
                    this.toBe(document);
                }
            );
            testConstant('escape', isExpected(escape));
            testConstant
            (
                'self',
                function ()
                {
                    this.toBe(self);
                }
            );
            testConstant
            (
                'sidebar',
                function ()
                {
                    this.toBe(sidebar);
                }
            );
            testConstant('unescape', isExpected(unescape));
            testConstant
            (
                'uneval',
                function ()
                {
                    this.toBe(uneval);
                }
            );
            testConstant
            (
                'ANY_FUNCTION',
                function ()
                {
                    this.toBeNativeFunction();
                }
            );
            testConstant
            (
                'ARRAY_ITERATOR',
                function ()
                {
                    var arrayIteratorPrototype = Object.getPrototypeOf([].entries());
                    this.toHavePrototype(arrayIteratorPrototype);
                }
            );
            testConstant
            (
                'ESCAPING_BACKSLASH',
                function ()
                {
                    this.toBe('\\');
                }
            );
            testConstant
            (
                'FILL',
                function ()
                {
                    this.toBe(Array.prototype.fill);
                }
            );
            testConstant
            (
                'FILTER',
                function ()
                {
                    this.toBe(Array.prototype.filter);
                }
            );
            testConstant
            (
                'FLAT',
                function ()
                {
                    this.toBe(Array.prototype.flat);
                }
            );
            testConstant
            (
                'FROM_CHAR_CODE',
                function ()
                {
                    this.toMatch(/^from(?:CharCode|CodePoint)$/);
                }
            );
            testConstant
            (
                'PLAIN_OBJECT',
                function ()
                {
                    this.toBePlainObject();
                }
            );
            testConstant
            (
                'SUBSTR',
                function ()
                {
                    this.toMatch(/^(?:slice|substr)$/);
                }
            );
            testConstant
            (
                'TO_STRING',
                function ()
                {
                    this.toBe('toString');
                }
            );
            testConstant
            (
                'TO_UPPER_CASE',
                function ()
                {
                    this.toBe('toUpperCase');
                }
            );
        }
    );
    describe
    (
        'Definitions of FROM_CHAR_CODE_CALLBACK_FORMATTER',
        function ()
        {
            function testFormatter(entry, index)
            {
                var formatter = entry.definition;
                emuIt
                (
                    String(index),
                    getEntryFeature(entry),
                    function (emuFeatures)
                    {
                        var formatterExpr = formatter('fromCharCode', '1,16,256,4096');
                        var actual =
                        emuDo
                        (
                            emuFeatures || [],
                            function ()
                            {
                                var actual = Function('return ' + formatterExpr)()();
                                return actual;
                            }
                        );
                        expect(actual).toBe('\x01\x10\u0100\u1000');
                    }
                );
            }

            var entries = JScrewIt.debug.getEntries('FROM_CHAR_CODE_CALLBACK_FORMATTER:available');
            entries.forEach(testFormatter);
        }
    );
}
)();
