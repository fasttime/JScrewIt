/* eslint-env ebdd/ebdd */
/*
global
emuEval,
emuIt,
evalJSFuck,
expect,
global,
module,
reloadJScrewIt,
repeat,
require,
self,
*/

'use strict';

(function ()
{
    var JScrewIt = typeof module !== 'undefined' ? require('../node-jscrewit-test') : self.JScrewIt;
    var Feature = JScrewIt.Feature;

    describe
    (
        'JScrewIt',
        function ()
        {
            it
            (
                'is set up correctly in the browser',
                function ()
                {
                    try
                    {
                        if (typeof module !== 'undefined')
                        {
                            global.self = { };
                            reloadJScrewIt({ module: undefined, require: undefined });
                        }
                        expect(self.hasOwnProperty('JScrewIt')).toBeTruthy();
                    }
                    finally
                    {
                        if (typeof module !== 'undefined')
                            delete global.self;
                    }
                }
            );
            it
            (
                'has no enumerable properties',
                function ()
                {
                    expect(JScrewIt).toEqual({ });
                }
            );
            it
            (
                'has no enumerable debug properties',
                function ()
                {
                    expect(JScrewIt.debug).toEqual({ });
                }
            );
        }
    );
    describe
    (
        'JScrewIt.debug.createReindexMap',
        function ()
        {
            it
            (
                'works without integer coercion',
                function ()
                {
                    var reindexMap = JScrewIt.debug.createReindexMap(5, 5, 3, false);
                    expect(reindexMap).toEqual(['true', '0', 'undefined', '1', 'NaN']);
                }
            );
            it
            (
                'works with integer coercion',
                function ()
                {
                    var reindexMap = JScrewIt.debug.createReindexMap(5, 5, 3, true);
                    expect(reindexMap).toEqual(['', 'true', 'undefined', '1', 'NaN']);
                }
            );
        }
    );
    describe
    (
        'JScrewIt.debug.defineConstant',
        function ()
        {
            it
            (
                'fails for invalid identifier',
                function ()
                {
                    var fn = JScrewIt.debug.defineConstant.bind(null, null, 'X:X', '0');
                    expect(fn).toThrowStrictly(SyntaxError, 'Invalid identifier "X:X"');
                }
            );
        }
    );
    describe
    (
        'Encoder#_encodeByCharCodes',
        function ()
        {
            it
            (
                'returns correct JSFuck for long input',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    encoder._maxDecodableArgs = 0;
                    var input = 'Lorem ipsum dolor sit amet';
                    var output = encoder._encodeByCharCodes(Object(input));
                    expect(output).toBeJSFuck();
                    expect(evalJSFuck(output)).toBe(input);
                }
            );
            emuIt
            (
                'returns correct JSFuck with feature ARROW',
                Feature.ARROW,
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder(Feature.ARROW);
                    encoder._maxDecodableArgs = Infinity;
                    var input = 'Lorem ipsum dolor sit amet';
                    var output = encoder._encodeByCharCodes(Object(input), 4);
                    expect(output).toBeJSFuck();
                    expect(emuEval(this.test.emuFeatureNames, output)).toBe(input);
                }
            );
            it
            (
                'does not replace the mapper when maxLength is too small',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var _replaceMapper = encoder._replaceMapper;
                    var replaceMapperCalled;
                    encoder._replaceMapper =
                    function ()
                    {
                        replaceMapperCalled = true;
                        return _replaceMapper.apply(this, arguments);
                    };
                    var inputData = Object('12345');
                    var maxLength = 7002;
                    replaceMapperCalled = false;
                    var output = encoder._encodeByCharCodes(inputData, 4, maxLength);
                    if (replaceMapperCalled)
                        expect(_replaceMapper).fail('not to be called');
                    expect(output).toBeUndefined();
                    replaceMapperCalled = false;
                    encoder._encodeByCharCodes(inputData, 4, maxLength + 1);
                    if (!replaceMapperCalled)
                        expect(_replaceMapper).fail('to be called');
                }
            );
            it
            (
                'does not replace the character array joining when maxLength is too small',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var _joinCharArray = encoder._joinCharArray;
                    var joinCharArrayCalled;
                    encoder._joinCharArray =
                    function ()
                    {
                        joinCharArrayCalled = true;
                        return _joinCharArray.apply(this, arguments);
                    };
                    var inputData = Object('12345');
                    var maxLength = 31082;
                    joinCharArrayCalled = false;
                    var output = encoder._encodeByCharCodes(inputData, 4, maxLength);
                    if (joinCharArrayCalled)
                        expect(_joinCharArray).fail('not to be called');
                    expect(output).toBeUndefined();
                    joinCharArrayCalled = false;
                    encoder._encodeByCharCodes(inputData, 4, maxLength + 1);
                    if (!joinCharArrayCalled)
                        expect(_joinCharArray).fail('to be called');
                }
            );
        }
    );
    describe
    (
        'Encoder#_encodeByCodePoints',
        function ()
        {
            function isUnicodeRegExpSupported()
            {
                try
                {
                    RegExp('', 'u');
                }
                catch (error)
                {
                    return false;
                }
                return true;
            }

            emuIt
            (
                'returns correct JSFuck for long input',
                Feature.FROM_CODE_POINT,
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder('FROM_CODE_POINT');
                    encoder._maxDecodableArgs = 0;
                    var input = '🔴🟥🟠🟧🟡🟨🟢🟩🔵🟦🟣🟪⚫️⬛️⚪️⬜️🟤🟫';
                    var output = encoder._encodeByCodePoints(Object(input));
                    expect(output).toBeJSFuck();
                    expect(emuEval(this.test.emuFeatureNames, output)).toBe(input);
                }
            );
            emuIt.when
            (
                typeof module !== 'undefined' &&
                (isUnicodeRegExpSupported() || String.prototype.codePointAt)
            )
            (
                'works well in legacy mode',
                Feature.FROM_CODE_POINT,
                function ()
                {
                    var RegExp = global.RegExp;
                    global.RegExp =
                    function (pattern, flags)
                    {
                        if (flags && /u/.test(flags))
                            throw SyntaxError();
                        var regExp = RegExp(pattern, flags);
                        return regExp;
                    };
                    var prototype = String.prototype;
                    var codePointAt = prototype.codePointAt;
                    prototype.codePointAt = undefined;
                    try
                    {
                        var newJScrewIt = reloadJScrewIt();
                        var encoder = newJScrewIt.debug.createEncoder('FROM_CODE_POINT');
                        var input = '"🅐\n🅩"';
                        var output = encoder._encodeByCodePoints(Object(input));
                        expect(output).toBeJSFuck();
                        expect(emuEval(this.test.emuFeatureNames, output)).toBe(input);
                    }
                    finally
                    {
                        global.RegExp = RegExp;
                        prototype.codePointAt = codePointAt;
                    }
                }
            );
        }
    );
    describe
    (
        'Encoder#_encodeByDenseFigures',
        function ()
        {
            describe
            (
                'with FORMAT_MAPPER_SHORT',
                function ()
                {
                    function testEntry(entry, index)
                    {
                        var featureObj = JScrewIt.debug.featureFromMask(entry.mask);
                        emuIt
                        (
                            '(definition ' + index + ')',
                            featureObj,
                            function ()
                            {
                                var encoder = JScrewIt.debug.createEncoder(featureObj);
                                var formatMapper = entry.definition;
                                encoder._findFormatMapperShort =
                                function () { return formatMapper; };
                                var input =
                                'const pick = (arr, i) => arr[(i % arr.length + arr.length) % ' +
                                'arr.length];';
                                var output = encoder._encodeByDenseFigures(Object(input));
                                expect(output).toBeJSFuck();
                                expect(emuEval(this.test.emuFeatureNames, output)).toBe(input);
                            }
                        );
                    }

                    var entries = JScrewIt.debug.getEntries('FORMAT_MAPPER_SHORT:available');
                    entries.forEach(testEntry);
                }
            );
            it
            (
                'returns undefined when maxLength is too small',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var input = 'aabbcc';
                    var replaceStringArray = encoder.replaceStringArray;
                    var replaceStringArrayCalled;
                    encoder.replaceStringArray =
                    function (array)
                    {
                        if (array.length === input.length)
                            replaceStringArrayCalled = true;
                        return replaceStringArray.apply(this, arguments);
                    };
                    var maxLength = 3664;
                    replaceStringArrayCalled = false;
                    var output = encoder._encodeByDenseFigures(Object(input), maxLength);
                    if (replaceStringArrayCalled)
                    {
                        expect(replaceStringArray)
                        .fail('not to be called with the input character figures');
                    }
                    expect(output).toBeUndefined();
                    replaceStringArrayCalled = false;
                    encoder._encodeByDenseFigures(Object(input), maxLength + 1);
                    if (!replaceStringArrayCalled)
                    {
                        expect(replaceStringArray)
                        .fail('to be called with the input character figures');
                    }
                }
            );
        }
    );
    describe
    (
        'Encoder#_encodeByDict',
        function ()
        {
            it
            (
                'returns correct JSFuck with radix for short numeric input',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var input = '9';
                    var output = encoder._encodeByDict(Object(input), 4);
                    expect(output).toBeJSFuck();
                    expect(evalJSFuck(output)).toBe(input);
                }
            );
            it
            (
                'returns correct JSFuck with integer coercion',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var input =
                    'The thirty-three thieves thought that they thrilled the throne throughout ' +
                    'Thursday.';
                    var output = encoder._encodeByDict(Object(input), 4);
                    expect(output).toBeJSFuck();
                    expect(evalJSFuck(output)).toBe(input);
                }
            );
            emuIt
            (
                'returns correct JSFuck with feature ARRAY_ITERATOR',
                Feature.ARRAY_ITERATOR,
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder(Feature.ARRAY_ITERATOR);
                    var input = 'The quick brown fox jumps over the lazy dog';
                    var output = encoder._encodeByDict(Object(input), 4);
                    expect(output).toBeJSFuck();
                    expect(emuEval(this.test.emuFeatureNames, output)).toBe(input);
                }
            );
            emuIt
            (
                'returns correct JSFuck with feature ARROW',
                Feature.ARROW,
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder(Feature.ARROW);
                    var input = 'Lorem ipsum dolor sit amet';
                    var output = encoder._encodeByDict(Object(input), 4);
                    expect(output).toBeJSFuck();
                    expect(emuEval(this.test.emuFeatureNames, output)).toBe(input);
                }
            );
            emuIt
            (
                'returns correct JSFuck with feature ARROW, FLAT and NO_IE_SRC',
                Feature('ARROW', 'FLAT', 'NO_IE_SRC'),
                function ()
                {
                    var encoder =
                    JScrewIt.debug.createEncoder(Feature('ARROW', 'FLAT', 'NO_IE_SRC'));
                    var input = 'Never gonna give you up / Never gonna let you down';
                    var output = encoder._encodeByDict(Object(input), 4);
                    expect(output).toBeJSFuck();
                    expect(emuEval(this.test.emuFeatureNames, output)).toBe(input);
                }
            );
            it.per
            (
                [
                    ['does not coerce to integer', 4, 0, 11, 1, false],
                    ['coerces to integer', 4, 0, 12, 1, true],
                    ['does not coerce to integer', 3, 1, 12, 11, false],
                    ['coerces to integer', 3, 1, 12, 12, true],
                    ['does not coerce to integer', 3, 1, 14, 1, false],
                    ['coerces to integer', 3, 1, 14, 2, true],
                ]
            )
            (
                '#[0] with radix #[1] amended by #[2] when the most frequent characters occur ' +
                '#[3] and #[4] times',
                function (paramData)
                {
                    var radix = paramData[1];
                    var amendingCount = paramData[2];
                    var count0 = paramData[3];
                    var count1 = paramData[4];
                    var expectedCoerceToInt = paramData[5];
                    var encoder = JScrewIt.debug.createEncoder();
                    var actualCoerceToInt;
                    encoder._createDictEncoding =
                    function (charIndexArrayStr, legend, radix, coerceToInt)
                    {
                        actualCoerceToInt = coerceToInt;
                    };
                    var input = repeat('a', count0) + repeat('b', count1) + 'c';
                    encoder._encodeByDict(Object(input), radix, amendingCount);
                    expect(actualCoerceToInt).toBe(expectedCoerceToInt);
                }
            );
            it
            (
                'does not create a mapping when maxLength is too small',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var resolveConstant = encoder.resolveConstant;
                    var mapConstantResolved;
                    encoder.resolveConstant =
                    function (constant)
                    {
                        if (constant === 'MAP')
                            mapConstantResolved = true;
                        return resolveConstant.apply(this, arguments);
                    };
                    var inputData = Object('12345');
                    var maxLength = 3589;
                    mapConstantResolved = false;
                    var output = encoder._encodeByDict(inputData, undefined, undefined, maxLength);
                    if (mapConstantResolved)
                        expect(resolveConstant).fail('not to be called with argument "MAP"');
                    expect(output).toBeUndefined();
                    mapConstantResolved = false;
                    encoder._encodeByDict(inputData, undefined, undefined, maxLength + 1);
                    if (!mapConstantResolved)
                        expect(resolveConstant).fail('to be called with argument "MAP"');
                }
            );
            it
            (
                'does not replace the mapper when maxLength is too small',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var _replaceMapper = encoder._replaceMapper;
                    var replaceMapperCalled;
                    encoder._replaceMapper =
                    function ()
                    {
                        replaceMapperCalled = true;
                        return _replaceMapper.apply(this, arguments);
                    };
                    var inputData = Object('12345');
                    var maxLength = 6978;
                    replaceMapperCalled = false;
                    var output = encoder._encodeByDict(inputData, undefined, undefined, maxLength);
                    if (replaceMapperCalled)
                        expect(_replaceMapper).fail('not to be called');
                    expect(output).toBeUndefined();
                    replaceMapperCalled = false;
                    encoder._encodeByDict(inputData, undefined, undefined, maxLength + 1);
                    if (!replaceMapperCalled)
                        expect(_replaceMapper).fail('to be called');
                }
            );
        }
    );
    describe
    (
        'Encoder#_encodeBySparseFigures',
        function ()
        {
            describe
            (
                'with FORMAT_MAPPER_SHORT',
                function ()
                {
                    function testEntry(entry, index)
                    {
                        var featureObj = JScrewIt.debug.featureFromMask(entry.mask);
                        emuIt
                        (
                            '(definition ' + index + ')',
                            featureObj,
                            function ()
                            {
                                var encoder = JScrewIt.debug.createEncoder(featureObj);
                                var formatMapper = entry.definition;
                                encoder._findFormatMapperShort =
                                function () { return formatMapper; };
                                var input =
                                'const pick = (arr, i) => arr[(i % arr.length + arr.length) % ' +
                                'arr.length];';
                                var output = encoder._encodeBySparseFigures(Object(input));
                                expect(output).toBeJSFuck();
                                expect(emuEval(this.test.emuFeatureNames, output)).toBe(input);
                            }
                        );
                    }

                    var entries = JScrewIt.debug.getEntries('FORMAT_MAPPER_SHORT:available');
                    entries.forEach(testEntry);
                }
            );
            it
            (
                'does not resolve a mapper when maxLength is too small',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var _findFormatMapperShort = encoder._findFormatMapperShort;
                    var findFormatMapperShortCalled;
                    encoder._findFormatMapperShort =
                    function ()
                    {
                        findFormatMapperShortCalled = true;
                        return _findFormatMapperShort.apply(this, arguments);
                    };
                    var maxLength = 7034;
                    findFormatMapperShortCalled = false;
                    var output = encoder._encodeBySparseFigures(Object('12345'), maxLength);
                    if (findFormatMapperShortCalled)
                        expect(_findFormatMapperShort).fail('not to be called');
                    expect(output).toBeUndefined();
                    findFormatMapperShortCalled = false;
                    encoder._encodeBySparseFigures(Object('12345'), maxLength + 1);
                    if (!findFormatMapperShortCalled)
                        expect(_findFormatMapperShort).fail('to be called');
                }
            );
            it
            (
                'does not create a mapping when the combined legend does not fit',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var resolveConstant = encoder.resolveConstant;
                    var mapConstantResolved;
                    encoder.resolveConstant =
                    function (constant)
                    {
                        if (constant === 'MAP')
                            mapConstantResolved = true;
                        return resolveConstant.apply(this, arguments);
                    };
                    var maxLength = 7979;
                    mapConstantResolved = false;
                    var output = encoder._encodeBySparseFigures(Object('12345'), maxLength);
                    if (mapConstantResolved)
                        expect(resolveConstant).fail('not to be called with argument "MAP"');
                    expect(output).toBeUndefined();
                    mapConstantResolved = false;
                    encoder._encodeBySparseFigures(Object('12345'), maxLength + 1);
                    if (!mapConstantResolved)
                        expect(resolveConstant).fail('to be called with argument "MAP"');
                }
            );
        }
    );
    describe
    (
        'Encoder#_encodeExpress',
        function ()
        {
            describe
            (
                'respects the maxLength limit',
                function ()
                {
                    var paramDataList =
                    [
                        ['with an empty script', ''],
                        ['with a call operation', '""[0]()'],
                        ['with a param-call operation', '""(0)[""]'],
                        ['with a get operation', '""[0][""]'],
                        ['with a post-increment', '[0][0]++'],
                        ['with an empty array', '""([])'],
                        ['with a singleton array', '""([0])'],
                        ['with a sum', '1+1'],
                        ['with a sum of modified sums', 'a+(+("b"+[c]))'],
                    ];

                    it.per(paramDataList)
                    (
                        '#[0]',
                        function (paramData)
                        {
                            var input = paramData[1];
                            var encoder = JScrewIt.debug.createEncoder();
                            var output = encoder._encodeExpress(input);
                            var length = output.length;
                            var perfLogLength = encoder.perfLog.length;
                            output = encoder._encodeExpress(input, length);
                            expect(output).toBeString();
                            encoder.perfLog = [];
                            output = encoder._encodeExpress(input, length - 1);
                            expect(output).toBeUndefined();
                            var expectedCodingLogLength = Math.max(perfLogLength, 0);
                            expect(encoder.perfLog.length).toBe(expectedCodingLogLength);
                        }
                    );
                }
            );
            it
            (
                'passes the maxLength limit to all strategies',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var input = '"abc"';
                    var output = encoder._encodeExpress(input);
                    var maxLength = output.length;
                    encoder.perfLog = [];
                    encoder._encodeExpress(input, maxLength);
                    var perfInfoList = encoder.perfLog[0];
                    var statuses = { };
                    perfInfoList.forEach
                    (
                        function (perfInfo)
                        {
                            statuses[perfInfo.strategyName] = perfInfo.status;
                            if (perfInfo.outputLength != null)
                                expect(perfInfo.outputLength).not.toBeGreaterThan(maxLength);
                        }
                    );
                    expect(statuses.byCharCodes).toBe('incomplete');
                    expect(statuses.plain).toBe('used');
                }
            );
            it
            (
                'passes the maxLength limit to all strategies with wrapped text',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var input = 'abc';
                    var output = encoder._encodeExpress(input);
                    var length = output.length;
                    encoder.perfLog = [];
                    output = encoder._encodeExpress(input, length - 1);
                    expect(output).toBeUndefined();
                    var perfInfoList = encoder.perfLog[0];
                    perfInfoList.forEach
                    (
                        function (perfInfo)
                        {
                            expect(perfInfo.status).not.toBe('used');
                        }
                    );
                    encoder.perfLog = [];
                    output = encoder._encodeExpress(input, length);
                    expect(output).toBeString();
                }
            );
            describe
            (
                'generates correct perfLog paths',
                function ()
                {
                    var paramDataList =
                    [
                        ['"A"', ['0']],
                        ['"A"()("B1" + "B2")["C"].D', ['0', '2:0', '2:1', '3', '4']],
                        ['["A1" + "A2"]("B")', ['0:0', '0:1', '1']],
                        ['("A1" + "A2")["B"]', ['0:0', '0:1', '1']],
                        ['["A".B][C]', ['0:0', '0:1', '1']],
                        ['[[[x]]][y]', ['0', '1']],
                    ];
                    it.per(paramDataList)
                    (
                        'with `#[0]`',
                        function (paramData)
                        {
                            var input = paramData[0];
                            var expectedPerfLogNames = paramData[1];
                            var encoder = JScrewIt.debug.createEncoder();
                            encoder._encodeExpress(input);
                            var perfLog = encoder.perfLog;
                            expect(perfLog.length).toBe(expectedPerfLogNames.length);
                            for (var index = 0; index < expectedPerfLogNames.length; index++)
                            {
                                var actualName = perfLog[index].name;
                                var expectedName = expectedPerfLogNames[index];
                                expect(actualName).toBe(expectedName);
                            }
                        }
                    );
                }
            );
            it
            (
                'optimizes clusters',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var actual = encoder._encodeExpress('"xx".ww');
                    var expected =
                    encoder.replaceExpr('(1221..toString("36"))[1120..toString("34")]');
                    expect(actual).toBe(expected);
                }
            );
        }
    );
    describe
    (
        'Encoder#_exec',
        function ()
        {
            it
            (
                'gently fails for unencodable input',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    expect
                    (
                        function ()
                        {
                            encoder._exec('{}', undefined, ['express']);
                        }
                    )
                    .toThrowStrictly(Error, 'Encoding failed');
                    expect('perfLog' in encoder).toBeFalsy();
                }
            );
        }
    );
    describe
    (
        'Encoder#_getPaddingBlock throws a SyntaxError for',
        function ()
        {
            it
            (
                'undefined padding',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    expect
                    (
                        function ()
                        {
                            encoder._getPaddingBlock(2);
                        }
                    )
                    .toThrowStrictly(SyntaxError, 'Undefined regular padding block with length 2');
                }
            );
        }
    );
    describe
    (
        'Encoder#findDefinition',
        function ()
        {
            it
            (
                'Adds a cache key to the entry list',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var entries1 = [];
                    var entries2 = [];
                    encoder.findDefinition(entries1);
                    expect(entries1.cacheKey).toBeDefined();
                    encoder.findDefinition(entries2);
                    expect(entries2.cacheKey).toBeDefined();
                    expect(entries2.cacheKey).toNotEqual(entries1.cacheKey);
                }
            );
            it
            (
                'Caches an existing definition',
                function ()
                {
                    var EXPECTED_DEFINITION = 42;

                    var encoder = JScrewIt.debug.createEncoder();
                    var entries = [{ definition: EXPECTED_DEFINITION, mask: Feature.DEFAULT.mask }];
                    var actualDefinition1 = encoder.findDefinition(entries);
                    expect(actualDefinition1).toBe(EXPECTED_DEFINITION);
                    entries[0] = null;
                    var actualDefinition2 = encoder.findDefinition(entries);
                    expect(actualDefinition2).toBe(EXPECTED_DEFINITION);
                }
            );
            it
            (
                'Caches a missing definition',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var entries = [];
                    var actualDefinition1 = encoder.findDefinition(entries);
                    expect(actualDefinition1).toBeUndefined();
                    entries.push({ definition: 'foo', mask: Feature.DEFAULT.mask });
                    var actualDefinition2 = encoder.findDefinition(entries);
                    expect(actualDefinition2).toBeUndefined();
                }
            );
        }
    );
    describe
    (
        'Encoder#replaceExpr',
        function ()
        {
            it.when(typeof module !== 'undefined' && global.WeakRef)
            (
                'works well when weak references are not supported',
                function ()
                {
                    var WeakRef = global.WeakRef;
                    global.WeakRef = undefined;
                    try
                    {
                        var newJScrewIt = reloadJScrewIt();
                        var encoder = newJScrewIt.debug.createEncoder();
                        var replacement = encoder.replaceExpr('true');
                        expect(replacement).toBe('!![]');
                    }
                    finally
                    {
                        global.WeakRef = WeakRef;
                    }
                }
            );
        }
    );
    describe
    (
        'Encoder#replaceString',
        function ()
        {
            function isStickyRegExpSupported()
            {
                try
                {
                    RegExp('', 'y');
                }
                catch (error)
                {
                    return false;
                }
                return true;
            }

            it
            (
                'supports toString clustering',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var actual = encoder.replaceString('zz', { optimize: true });
                    var expected = encoder.replaceExpr('1295..toString("36")');
                    expect(actual).toBe(expected);
                }
            );
            it
            (
                'supports surrogate pair clustering',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder(Feature.FROM_CODE_POINT);
                    var actual = encoder.replaceString('😊', { optimize: true });
                    var expected = encoder.replaceExpr('Function("return\\"\\\\u{1f60a}\\"")()');
                    expect(actual).toBe(expected);
                }
            );
            it
            (
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
            it
            (
                'respects the maxLength limit after the last solution',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var options = { maxLength: 12 };
                    var actual = encoder.replaceString('f', options);
                    expect(actual).toBeUndefined();
                }
            );
            it.when(typeof module !== 'undefined' && isStickyRegExpSupported())
            (
                'works well in legacy mode',
                function ()
                {
                    var RegExp = global.RegExp;
                    global.RegExp =
                    function (pattern, flags)
                    {
                        if (flags && /y/.test(flags))
                            throw SyntaxError();
                        var regExp = RegExp(pattern, flags);
                        return regExp;
                    };
                    try
                    {
                        var newJScrewIt = reloadJScrewIt();
                        var encoder = newJScrewIt.debug.createEncoder();
                        expect(encoder.replaceString('00NaNfalse')).toBe('+[]+[+[]]+(+[![]])+![]');
                    }
                    finally
                    {
                        global.RegExp = RegExp;
                    }
                }
            );
        }
    );
    describe
    (
        'Encoder#replaceStringArray',
        function ()
        {
            it
            (
                'replaces element "undefined"',
                function ()
                {
                    var array = ['undefined', 'undefined'];
                    var encoder = JScrewIt.debug.createEncoder();
                    var output = encoder.replaceStringArray(array, []);
                    expect(evalJSFuck(output)).toEqual(array);
                }
            );
            it
            (
                'replaces an empty string element without string forcing',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var output = encoder.replaceStringArray(['', ''], [], null, false, false);
                    expect(evalJSFuck(output)).toEqual([[], []]);
                }
            );
            it
            (
                'replaces an empty string element with string forcing',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var output = encoder.replaceStringArray([''], [], null, false, true);
                    expect(output).toBe('[[]+[]]');
                }
            );
            it
            (
                'replaces empty string elements with the concat approach',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var output = encoder.replaceStringArray(['', '', ''], [], null, true, false);
                    expect(evalJSFuck(output)).toEqual([[], 0, 0]);
                }
            );
            it
            (
                'replaces all static characters',
                function ()
                {
                    var array =
                    [
                        '+', '-', '.', '0', '1', '2', '3', '4', '5', '6',
                        '7', '8', '9', 'I', 'N', 'a', 'd', 'e', 'f', 'i',
                        'l', 'n', 'r', 's', 't', 'u', 'y',
                    ];
                    var encoder = JScrewIt.debug.createEncoder();
                    var output =
                    encoder.replaceStringArray(array, [{ joiner: '', separator: '[]' }]);
                    expect(evalJSFuck(output)).toEqual(array);
                }
            );
            it
            (
                'applies substitutions',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    encoder.getConcatReplacement = Function();
                    var output =
                    encoder.replaceStringArray
                    (
                        ['102', '30', '04', '0', 'true'],
                        [{ separator: 'false', joiner: 'false' }],
                        [
                            { separator: '0', joiner: 'undefined' },
                            { separator: 'true', joiner: '+' },
                        ]
                    );
                    expect(evalJSFuck(output))
                    .toEqual(['1undefined2', '3undefined', 'undefined4', 'undefined', '+']);
                }
            );
            it
            (
                'does not replace the input with the split approach when maxLength is less than ' +
                'the replacement length',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var replacement =
                    encoder.replaceStringArray
                    (
                        ['1', '2', '3', '4', '5'],
                        [{ separator: 'false', joiner: 'false' }],
                        [{ separator: '1', joiner: '0' }],
                        false,
                        false
                    );
                    expect(evalJSFuck(replacement)).toEqual(['0', '2', '3', '4', '5']);
                    var replacement0 =
                    encoder.replaceStringArray
                    (
                        ['1', '2', '3', '4', '5'],
                        [{ separator: 'false', joiner: 'false' }],
                        [{ separator: '1', joiner: '0' }],
                        false,
                        false,
                        replacement.length - 1
                    );
                    expect(replacement0).toBeUndefined();
                    var replacement1 =
                    encoder.replaceStringArray
                    (
                        ['1', '2', '3', '4', '5'],
                        [{ separator: 'false', joiner: 'false' }],
                        [{ separator: '1', joiner: '0' }],
                        false,
                        false,
                        replacement.length
                    );
                    expect(replacement1).toBe(replacement);
                }
            );
            it
            (
                'does not replace the input with the concat approach when maxLength is less than ' +
                'the replacement length',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var replacement =
                    encoder.replaceStringArray
                    (
                        ['1', '2'],
                        [{ separator: 'false', joiner: 'false' }],
                        null,
                        false,
                        false
                    );
                    expect(evalJSFuck(replacement)).toEqual([1, 2]);
                    var replacement0 =
                    encoder.replaceStringArray
                    (
                        ['1', '2'],
                        [{ separator: 'false', joiner: 'false' }],
                        null,
                        false,
                        false,
                        replacement.length - 1
                    );
                    expect(replacement0).toBeUndefined();
                    var replacement1 =
                    encoder.replaceStringArray
                    (
                        ['1', '2'],
                        [{ separator: 'false', joiner: 'false' }],
                        null,
                        false,
                        false,
                        replacement.length
                    );
                    expect(replacement1).toBe(replacement);
                }
            );
            it
            (
                'does not replace substitutions when maxLength is too small',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    encoder.replaceStringArray
                    (
                        ['UNREPLACEABLE'],
                        [{ separator: 'UNDEFINED', joiner: 'UNREPLACEABLE' }],
                        [{ separator: 'UNDEFINED', joiner: '' }],
                        false,
                        false,
                        9000
                    );
                }
            );
            it
            (
                'does not replace the input with the split approach with substitutions when ' +
                'maxLength is too small',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    encoder.replaceStringArray
                    (
                        ['UNREPLACEABLE'],
                        [{ separator: 'UNDEFINED', joiner: 'UNREPLACEABLE' }],
                        [{ separator: '0', joiner: 'y' }],
                        false,
                        false,
                        9200
                    );
                }
            );
            it
            (
                'does not replace the input with the split approach without substitutions when ' +
                'maxLength is too small',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var output =
                    encoder.replaceStringArray
                    (
                        ['UNREPLACEABLE'],
                        [{ separator: 'UNDEFINED', joiner: 'UNREPLACEABLE' }],
                        [],
                        false,
                        false,
                        1000
                    );
                    expect(output).toBeUndefined();
                }
            );
            it
            (
                'does not replace a single element with the concat approach when maxLength is ' +
                'too small',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var output = encoder.replaceStringArray([''], [], null, false, false, 0);
                    expect(output).toBeUndefined();
                }
            );
            it
            (
                'throws an error for an array with non-statically replaceable elements',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    expect
                    (
                        function ()
                        {
                            encoder.replaceStringArray
                            (['UNREPLACEABLE'], [{ separator: '[]', joiner: '' }], null);
                        }
                    )
                    .toThrowStrictly(Error, 'Unable to resolve "U" statically');
                }
            );
        }
    );
    describe
    (
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

            JScrewIt.debug.defineConstant(encoder, 'A', 'FLAT');
            JScrewIt.debug.defineConstant(encoder, 'B', 'C');
            JScrewIt.debug.defineConstant(encoder, 'C', 'B');
            JScrewIt.debug.defineConstant(encoder, 'D', '?');
            JScrewIt.debug.defineConstant(encoder, 'E', '"\\xx"');
            JScrewIt.debug.defineConstant(encoder, 'F', '"too complex"');
            JScrewIt.debug.defineConstant(encoder, 'G', '');
            JScrewIt.debug.defineConstant(encoder, 'H', '0 + ""');

            it
            (
                'empty definition',
                function ()
                {
                    expect(debugReplacer('G')).toThrowStrictly
                    (SyntaxError, 'Syntax error in the definition of G');
                }
            );
            it
            (
                'circular reference',
                function ()
                {
                    expect(debugReplacer('B')).toThrowStrictly
                    (SyntaxError, 'Circular reference detected: B < C < B – [Feature <>]');
                }
            );
            describe
            (
                'undefined identifier',
                function ()
                {
                    it
                    (
                        'in a definition',
                        function ()
                        {
                            expect(debugReplacer('A')).toThrowStrictly
                            (SyntaxError, 'Undefined identifier FLAT in the definition of A');
                        }
                    );
                    it
                    (
                        'inline',
                        function ()
                        {
                            expect(debugReplacer('valueOf')).toThrowStrictly
                            (SyntaxError, 'Undefined identifier valueOf');
                        }
                    );
                }
            );
            describe
            (
                'unexpected character',
                function ()
                {
                    it
                    (
                        'in a definition',
                        function ()
                        {
                            expect(debugReplacer('D')).toThrowStrictly
                            (SyntaxError, 'Syntax error in the definition of D');
                        }
                    );
                    it
                    (
                        'inline',
                        function ()
                        {
                            expect(debugReplacer('?')).toThrowStrictly(SyntaxError, 'Syntax error');
                        }
                    );
                }
            );
            describe
            (
                'illegal string',
                function ()
                {
                    it
                    (
                        'in a definition',
                        function ()
                        {
                            expect(debugReplacer('E')).toThrowStrictly
                            (SyntaxError, 'Syntax error in the definition of E');
                        }
                    );
                    it
                    (
                        'inline',
                        function ()
                        {
                            expect(debugReplacer('"\\xx"')).toThrowStrictly
                            (SyntaxError, 'Syntax error');
                        }
                    );
                }
            );
            describe
            (
                'string too complex',
                function ()
                {
                    it
                    (
                        'in a definition',
                        function ()
                        {
                            expect(debugReplacer('F')).toThrowStrictly
                            (SyntaxError, 'String too complex in the definition of F');
                        }
                    );
                    it
                    (
                        'inline',
                        function ()
                        {
                            expect(debugReplacer('"too complex"')).toThrowStrictly
                            (SyntaxError, 'String too complex');
                        }
                    );
                }
            );
            describe
            (
                'string to non-string concatenation',
                function ()
                {
                    it
                    (
                        'in a definition',
                        function ()
                        {
                            expect(debugReplacer('H')).toThrowStrictly
                            (
                                SyntaxError,
                                'Unsupported concatenation of a string to a potentially ' +
                                'non-string expression in the definition of H'
                            );
                        }
                    );
                    it
                    (
                        'inline',
                        function ()
                        {
                            expect(debugReplacer('0 + ""')).toThrowStrictly
                            (
                                SyntaxError,
                                'Unsupported concatenation of a string to a potentially ' +
                                'non-string expression'
                            );
                        }
                    );
                }
            );
        }
    );
    describe
    (
        'Encoder#resolveCharInExpr throws a SyntaxError for',
        function ()
        {
            it
            (
                'missing padding entries',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    expect
                    (
                        function ()
                        {
                            encoder._resolveCharInExpr('', '', 42, undefined, []);
                        }
                    )
                    .toThrowStrictly(SyntaxError, 'Missing padding entries for index 42');
                }
            );
        }
    );
    describe
    (
        'Strategy',
        function ()
        {
            var text = 'Lorem ipsum dolor sit amet';
            var strategies = JScrewIt.debug.getStrategies();
            var strategyNames = Object.keys(strategies);
            describe.per(strategyNames)
            (
                '#',
                function (strategyName)
                {
                    function getMaxLength(scope)
                    {
                        var maxLength = scope.maxLength;
                        if (maxLength === undefined)
                        {
                            scope.maxLength =
                            maxLength =
                            strategy.call(encoder, Object('0')).length;
                        }
                        return maxLength;
                    }

                    var strategy = strategies[strategyName];
                    var featureObj = JScrewIt.debug.featureFromMask(strategy.mask);
                    var encoder = JScrewIt.debug.createEncoder(featureObj);
                    emuIt
                    (
                        'returns correct JSFuck',
                        featureObj,
                        function ()
                        {
                            var input =
                            strategy.encodingType === 'expression' ? JSON.stringify(text) : text;
                            var output = strategy.call(encoder, Object(input));
                            expect(output).toBeJSFuck();
                            expect(emuEval(this.test.emuFeatureNames, output)).toBe(text);
                        }
                    );
                    it
                    (
                        'returns undefined when output length exceeds maxLength',
                        function ()
                        {
                            var maxLength = getMaxLength(this);
                            var output = strategy.call(encoder, Object('0'), maxLength - 1);
                            expect(output).toBeUndefined();
                        }
                    );
                    it
                    (
                        'returns a string when output length equals maxLength',
                        function ()
                        {
                            var maxLength = getMaxLength(this);
                            var output = strategy.call(encoder, Object('0'), maxLength);
                            expect(output).toBeString();
                        }
                    );
                }
            );
        }
    );
    describe
    (
        'freqList is cached',
        function ()
        {
            var paramDataList =
            [
                {
                    description: '_encodeByDenseFigures',
                    fn:
                    function (inputData)
                    {
                        this._encodeByDenseFigures(inputData, 0);
                    },
                },
                {
                    description: '_encodeByDict',
                    fn:
                    function (inputData)
                    {
                        this._encodeByDict(inputData, undefined, undefined, 0);
                    },
                },
                {
                    description: '_encodeBySparseFigures',
                    fn:
                    function (inputData)
                    {
                        this._encodeBySparseFigures(inputData, 0);
                    },
                },
            ];
            it.per(paramDataList)
            (
                'with #.description',
                function (paramData)
                {
                    var fn = paramData.fn;
                    var encoder = JScrewIt.debug.createEncoder();
                    var inputData = Object('');
                    fn.call(encoder, inputData);
                    var freqList = inputData.freqList;
                    expect(freqList).toBeArray();
                    fn.call(encoder, inputData);
                    expect(inputData.freqList).toBe(freqList);
                }
            );
        }
    );
    describe
    (
        'calculateSolutionType',
        function ()
        {
            it
            (
                'works with a strong algebraic expression',
                function ()
                {
                    expect(JScrewIt.debug.calculateSolutionType('[+[]][+[]]'))
                    .toBe(JScrewIt.debug.SolutionType.ALGEBRAIC);
                }
            );
            it
            (
                'works with a prefixed string expression',
                function ()
                {
                    expect(JScrewIt.debug.calculateSolutionType('![]+[+[]]'))
                    .toBe(JScrewIt.debug.SolutionType.PREFIXED_STRING);
                }
            );
            it
            (
                'calculateSolutionType fails for an illegal expression',
                function ()
                {
                    expect(JScrewIt.debug.calculateSolutionType.bind(null, ']'))
                    .toThrowStrictly(SyntaxError);
                }
            );
        }
    );
    describe
    (
        'DynamicSolution',
        function ()
        {
            it
            (
                'is initially empty',
                function ()
                {
                    var solution = new JScrewIt.debug.DynamicSolution();
                    expect(solution.source).toBe('');
                    expect(solution.replacement).toBe('[]');
                    expect(solution.type).toBe(JScrewIt.debug.SolutionType.OBJECT);
                }
            );
            describe
            (
                '#source',
                function ()
                {
                    it
                    (
                        'is unknown',
                        function ()
                        {
                            var solution = new JScrewIt.debug.DynamicSolution();
                            solution.prepend
                            (
                                new JScrewIt.debug.Solution
                                (
                                    '',
                                    '[]',
                                    JScrewIt.debug.SolutionType.OBJECT
                                )
                            );
                            solution.append
                            (
                                new JScrewIt.debug.Solution
                                (
                                    undefined,
                                    '[]',
                                    JScrewIt.debug.SolutionType.OBJECT
                                )
                            );
                            expect(solution.source).toBeUndefined();
                        }
                    );
                }
            );
            describe
            (
                '#replacement',
                function ()
                {
                    it
                    (
                        'is idempotent',
                        function ()
                        {
                            var solution = new JScrewIt.debug.DynamicSolution();
                            expect(solution.replacement).toBe(solution.replacement);
                        }
                    );
                }
            );
        }
    );
}
)();
