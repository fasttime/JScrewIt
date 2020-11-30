/* eslint-env ebdd/ebdd */
/*
global
Audio,
Intl,
Node,
atob,
btoa,
document,
emuDo,
emuIt,
evalJSFuck,
expect,
getEmuFeatureNames,
module,
require,
self,
sidebar,
*/

'use strict';

(function ()
{
    function decodeEntry(entry, source, defaultSolutionType)
    {
        var featureObj = getEntryFeature(entry);
        var solution = decodeEntryWithFeature(entry, source, defaultSolutionType, featureObj);
        return solution;
    }

    function decodeEntryWithFeature(entry, source, defaultSolutionType, featureObj)
    {
        var encoder = getPoolEncoder(featureObj);
        var solution = encoder.resolve(entry.definition, source, defaultSolutionType);
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
                    function ()
                    {
                        var encoder = getPoolEncoder(Feature.ATOB);
                        var solution =
                        encoder.createCharDefaultSolution
                        (char, charCode, true, false, false, false);
                        verifyStringSolution(solution, char, this.test.emuFeatureNames);
                        var defaultSolutionLength =
                        getPoolEncoder(Feature.DEFAULT).resolveCharacter(char).length;
                        expect(solution.length).not.toBeGreaterThan(defaultSolutionLength);
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
                    encoder.createCharDefaultSolution(char, charCode, false, true, false, false);
                    verifyStringSolution(solution, char);
                }
            );
            it
            (
                '(escSeq)',
                function ()
                {
                    var encoder = getPoolEncoder(Feature.DEFAULT);
                    var solution =
                    encoder.createCharDefaultSolution(char, charCode, false, false, true, false);
                    verifyStringSolution(solution, char);
                }
            );
            it
            (
                '(unescape)',
                function ()
                {
                    var encoder = getPoolEncoder(Feature.DEFAULT);
                    var solution =
                    encoder.createCharDefaultSolution(char, charCode, false, false, false, true);
                    verifyStringSolution(solution, char);
                }
            );
        }

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
                function ()
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
                                    var message = 'Unexpected definition function name ' + name;
                                    return message;
                                }
                            );
                        }
                    }
                    var solution = decodeEntry(entry, char);
                    verifyStringSolution(solution, char, this.test.emuFeatureNames);
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
                    var solution =
                    decodeEntryWithFeature(entry, char, undefined, solutionFeatureObj);
                    varieties.forEach
                    (
                        function (varietyFeatureNames)
                        {
                            var varietyFeatureObj = Feature(varietyFeatureNames);
                            if (Feature.areCompatible(varietyFeatureObj, solutionFeatureObj))
                            {
                                var testableFeatureObj =
                                Feature(varietyFeatureObj, solutionFeatureObj);
                                var emuFeatures = getEmuFeatureNames(testableFeatureObj);
                                if (emuFeatures)
                                    verifyStringSolution(solution, char, emuFeatures);
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

        var SPECIAL_CASES_MAP =
        {
            'K':
            {
                'complete':
                function ()
                {
                    var featureNames = ['ARRAY_ITERATOR', 'ATOB', 'CAPITAL_HTML'];
                    var featureObj = Feature(featureNames);
                    var encoder = getPoolEncoder(featureObj);
                    var actualLength = encoder.resolveCharacter('K').length;
                    var defaultLength = encoder.defaultResolveCharacter('K').length;
                    expect(actualLength).not.toBeGreaterThan(defaultLength);
                },
            },
        };

        var char = String.fromCharCode(charCode);
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
        if (SPECIAL_CASES_MAP.hasOwnProperty(char))
        {
            var specialCases = SPECIAL_CASES_MAP[char];
            var descriptions = Object.keys(specialCases);
            descriptions.forEach
            (
                function (description)
                {
                    var specialCase = specialCases[description];
                    it(description, specialCase);
                }
            );
        }
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
            function ()
            {
                var encoder = getPoolEncoder(featureObj);
                var solution = encoder.resolve(entry.definition, complex);
                verifyStringSolution(solution, complex, this.test.emuFeatureNames);
            }
        );
    }

    function testConstant(constant, validator, expectedSolutionTypes)
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
                    function ()
                    {
                        var solution = decodeEntry(entry, undefined, SolutionType.OBJECT);
                        expect(typeof solution).toBe('object');
                        var replacement = solution.replacement;
                        expect(replacement).toBeJSFuck();
                        expect(solution.source).toBeUndefined();
                        var currentExpectedSolutionTypes;
                        if (expectedSolutionTypes)
                        {
                            expect(expectedSolutionTypes).toContain(solution.type);
                            currentExpectedSolutionTypes = expectedSolutionTypes;
                        }
                        else
                            currentExpectedSolutionTypes = [solution.type];
                        emuDo
                        (
                            this.test.emuFeatureNames,
                            function ()
                            {
                                var actual = evalJSFuck(replacement);
                                if (validator)
                                    validator.call(expect(actual));
                                var computedSolutionType =
                                JScrewIt.debug.calculateSolutionType(replacement);
                                expect(currentExpectedSolutionTypes)
                                .toContain(computedSolutionType, 'Solution type mismatch');
                            }
                        );
                    }
                );
            }
        );
    }

    function verifyStringSolution(solution, expected, emuFeatures)
    {
        expect(typeof solution).toBe('object');
        var replacement = solution.replacement;
        expect(replacement).toBeJSFuck();
        expect(solution.source).toBe(expected);
        emuDo
        (
            emuFeatures || [],
            function ()
            {
                var actual = String(evalJSFuck(replacement));
                expect(actual).toBe(expected);
                var computedSolutionType = JScrewIt.debug.calculateSolutionType(replacement);
                expect(solution.type).toBe(computedSolutionType, 'Solution type mismatch');
            }
        );
    }

    var JScrewIt = typeof module !== 'undefined' ? require('../node-jscrewit-test') : self.JScrewIt;
    var Feature = JScrewIt.Feature;
    var SolutionType = JScrewIt.debug.SolutionType;
    var encoderCache = Object.create(null);

    describe
    (
        'Character definitions of',
        function ()
        {
            var charCodeSet = Object.create(null);
            for (var charCode = 0; charCode < 256; ++charCode)
                charCodeSet[charCode] = null;
            JScrewIt.debug.getCharacters().forEach
            (
                function (char)
                {
                    var charCode = char.charCodeAt();
                    charCodeSet[charCode] = null;
                }
            );
            charCodeSet[0x010f] = null;  // hex code ending in "f"
            charCodeSet[0x01fa] = null;  // hex code ending in "fa"
            charCodeSet[0x0bbc] = null;  // candidate for toString clustering encoded with "B"
            charCodeSet[0xbbbb] = null;  // candidate for toString clustering encoded with "b"
            var charCodes = Object.keys(charCodeSet);

            describe.per
            (
                charCodes,
                function (charCode)
                {
                    charCode = Number(charCode);
                    var title =
                    charCode >= 0x7f && charCode <= 0xa0 || charCode === 0xad ?
                    '"\\u00' + charCode.toString(16) + '"' :
                    JSON.stringify(String.fromCharCode(charCode));
                    var info = { charCode: charCode, title: title };
                    return info;
                }
            )
            (
                '#.title',
                function (info)
                {
                    testCharacter(info.charCode);
                }
            );
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
            var paramDataMap =
            {
                Array: isExpected(Array),
                Audio:
                function ()
                {
                    this.toBe(Audio);
                },
                Boolean: isExpected(Boolean),
                Date: isExpected(Date),
                Function: isExpected(Function),
                Intl:
                function ()
                {
                    this.toBe(Intl);
                },
                Node:
                function ()
                {
                    this.toBe(Node);
                },
                Number: isExpected(Number),
                Object: isExpected(Object),
                RegExp: isExpected(RegExp),
                String: isExpected(String),
                atob:
                function ()
                {
                    this.toBe(atob);
                },
                btoa:
                function ()
                {
                    this.toBe(btoa);
                },
                document:
                function ()
                {
                    this.toBe(document);
                },
                escape: isExpected(escape),
                self:
                function ()
                {
                    this.toBe(self);
                },
                sidebar:
                function ()
                {
                    this.toBe(sidebar);
                },
                unescape: isExpected(unescape),
                ANY_FUNCTION:
                function ()
                {
                    this.toBeNativeFunction();
                },
                ARRAY_ITERATOR:
                function ()
                {
                    var arrayIteratorPrototype = Object.getPrototypeOf([].entries());
                    this.toHavePrototype(arrayIteratorPrototype);
                },
                ESCAPING_BACKSLASH:
                function ()
                {
                    this.toBe('\\');
                },
                FILL:
                function ()
                {
                    this.toBe(Array.prototype.fill);
                },
                FILTER:
                function ()
                {
                    this.toBe(Array.prototype.filter);
                },
                FLAT:
                function ()
                {
                    this.toBe(Array.prototype.flat);
                },
                FROM_CHAR_CODE:
                function ()
                {
                    this.toMatch(/^from(?:CharCode|CodePoint)$/);
                },
                F_A_L_S_E:
                function ()
                {
                    this.toEqual(['f', 'a', 'l', 's', 'e']);
                },
                LOCALE_AR:
                function ()
                {
                    this.toMatch(/^ar(-td)?$/);
                },
                PLAIN_OBJECT:
                function ()
                {
                    this.toBePlainObject();
                },
                SLICE_OR_FLAT:
                function ()
                {
                    this.toMatch(/^(?:slice|flat)$/);
                },
                SLICE_OR_SUBSTR:
                function ()
                {
                    this.toMatch(/^(?:slice|substr)$/);
                },
                TO_STRING:
                function ()
                {
                    this.toBe('toString');
                },
                TO_UPPER_CASE:
                function ()
                {
                    this.toBe('toUpperCase');
                },
            };
            var paramDataList =
            JScrewIt.debug.getConstantNames().map
            (
                function (constant)
                {
                    var validator =
                    paramDataMap.hasOwnProperty(constant) && paramDataMap[constant] || null;
                    var paramData = { constant: constant, validator: validator };
                    return paramData;
                }
            );
            describe.per(paramDataList)
            (
                '#.constant',
                function (paramData)
                {
                    var constant = paramData.constant;
                    var expectedSolutionTypes;
                    if (/_U$/.test(constant))
                        expectedSolutionTypes = [SolutionType.UNDEFINED, SolutionType.ALGEBRAIC];
                    else if (/_A$/.test(constant))
                        expectedSolutionTypes = [SolutionType.ALGEBRAIC];
                    else if (/_WA$/.test(constant))
                        expectedSolutionTypes = [SolutionType.WEAK_ALGEBRAIC];
                    else if (/_S$/.test(constant))
                    {
                        expectedSolutionTypes =
                        [
                            SolutionType.OBJECT,
                            SolutionType.PREFIXED_STRING,
                            SolutionType.COMBINED_STRING,
                        ];
                    }
                    else if (/_WS$/.test(constant))
                        expectedSolutionTypes = [SolutionType.WEAK_PREFIXED_STRING];
                    testConstant(constant, paramData.validator, expectedSolutionTypes);
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
                    function ()
                    {
                        var formatterExpr = formatter('fromCharCode', '1,16,256,4096');
                        var actual =
                        emuDo
                        (
                            this.test.emuFeatureNames,
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
