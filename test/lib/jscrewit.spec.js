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
                            var newJScrewIt = reloadJScrewIt();
                            expect(self.JScrewIt).toBe(newJScrewIt);
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
        'JScrewIt.debug.createFeatureFromMask',
        function ()
        {
            it
            (
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
        'JScrewIt.debug.getEntries',
        function ()
        {
            it
            (
                'does not throw',
                function ()
                {
                    JScrewIt.debug.getEntries('');
                }
            );
        }
    );
    describe
    (
        'Encoder#encodeByCharCodes',
        function ()
        {
            it
            (
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
            emuIt
            (
                'returns correct JSFuck with feature ARROW',
                Feature.ARROW,
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder(Feature.ARROW);
                    var input = 'Lorem ipsum dolor sit amet';
                    var output = encoder.encodeByCharCodes(input, false, 4);
                    expect(output).toBeJSFuck();
                    expect(emuEval(this.test.emuFeatureNames, output)).toBe(input);
                }
            );
            it
            (
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
    describe
    (
        'Encoder#encodeByDenseFigures',
        function ()
        {
            it
            (
                'returns correct JSFuck',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var input =
                    'The thirty-three thieves thought that they thrilled the throne throughout ' +
                    'Thursday.';
                    var output = encoder.encodeByDenseFigures(Object(input));
                    expect(output).toBeJSFuck();
                    expect(evalJSFuck(output)).toBe(input);
                }
            );
            it
            (
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
            it
            (
                'uses an ad-hoc insertion for the figure legend',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var figureLegendInsertions;
                    encoder.callGetFigureLegendInsertions =
                    function (getFigureLegendInsertions, figurator, figures)
                    {
                        figureLegendInsertions = getFigureLegendInsertions(figurator, figures);
                        return figureLegendInsertions;
                    };
                    var inputData = Object('foo');
                    encoder.encodeByDenseFigures(inputData);
                    expect(figureLegendInsertions[1]).toEqual({ joiner: '0', separator: '0' });
                }
            );
            it
            (
                'uses no ad-hoc insertion for the figure legend',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var figureLegendInsertions;
                    encoder.callGetFigureLegendInsertions =
                    function (getFigureLegendInsertions, figurator, figures)
                    {
                        figurator =
                        function ()
                        {
                            return Object('');
                        };
                        figureLegendInsertions = getFigureLegendInsertions(figurator, figures);
                        return figureLegendInsertions;
                    };
                    var inputData = Object('foo');
                    encoder.encodeByDenseFigures(inputData);
                    expect(figureLegendInsertions.length).toBe(1);
                }
            );
        }
    );
    describe
    (
        'Encoder#encodeByDict',
        function ()
        {
            it
            (
                'returns correct JSFuck with radix for short numeric input',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var input = '9';
                    var output = encoder.encodeByDict(Object(input), 4);
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
                    var output = encoder.encodeByDict(Object(input), 4);
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
                    var input = 'Lorem ipsum dolor sit amet';
                    var output = encoder.encodeByDict(Object(input), 4);
                    expect(output).toBeJSFuck();
                    expect(emuEval(this.test.emuFeatureNames, output)).toBe(input);
                }
            );
            it
            (
                'returns undefined for too complex input',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var output1 = encoder.encodeByDict(Object('12345'), undefined, undefined, 10);
                    expect(output1).toBeUndefined();
                    var output2 = encoder.encodeByDict(Object('12345'), undefined, undefined, 78);
                    expect(output2).toBeUndefined();
                    var output3 = encoder.encodeByDict(Object('12345'), undefined, undefined, 200);
                    expect(output3).toBeUndefined();
                }
            );
        }
    );
    describe
    (
        'Encoder#encodeBySparseFigures',
        function ()
        {
            it
            (
                'returns correct JSFuck',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var input =
                    'The thirty-three thieves thought that they thrilled the throne throughout ' +
                    'Thursday.';
                    var output = encoder.encodeBySparseFigures(Object(input));
                    expect(output).toBeJSFuck();
                    expect(evalJSFuck(output)).toBe(input);
                }
            );
            it
            (
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
    describe
    (
        'Encoder#encodeExpress',
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
                            var output = encoder.encodeExpress(input);
                            var length = output.length;
                            var perfLogLength = encoder.perfLog.length;
                            output = encoder.encodeExpress(input, length);
                            expect(output).not.toBeUndefined();
                            encoder.perfLog = [];
                            output = encoder.encodeExpress(input, length - 1);
                            expect(output).toBeUndefined();
                            var expectedCodingLogLength = Math.max(perfLogLength, 0);
                            expect(encoder.perfLog.length).toBe(expectedCodingLogLength);
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
                    var actual = encoder.encodeExpress('"xx".ww');
                    var expected =
                    encoder.replaceExpr('(1221..toString("36"))[1120..toString("34")]');
                    expect(actual).toBe(expected);
                }
            );
            it
            (
                'writes into perfLog',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    encoder.encodeExpress('"A"()("B1" + "B2")["C"].D');
                    var perfLog = encoder.perfLog;
                    expect(perfLog.length).toBe(5);
                    expect(perfLog[0].name).toBe('0');
                    expect(perfLog[1].name).toBe('2:0');
                    expect(perfLog[2].name).toBe('2:1');
                    expect(perfLog[3].name).toBe('3');
                    expect(perfLog[4].name).toBe('4');
                }
            );
        }
    );
    describe
    (
        'Encoder#exec',
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
                            encoder.exec('{}', undefined, ['express']);
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
        'Encoder#getPaddingBlock throws a SyntaxError for',
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
                            encoder.getPaddingBlock({ blocks: [] }, -1);
                        }
                    )
                    .toThrowStrictly(SyntaxError, 'Undefined padding block with length -1');
                }
            );
        }
    );
    describe
    (
        'Encoder#replaceFalseFreeArray',
        function ()
        {
            it
            (
                'returns undefined for too large array',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    encoder.replaceString = Function();
                    expect(encoder.replaceFalseFreeArray([1, 2])).toBeUndefined();
                }
            );
        }
    );
    describe
    (
        'Encoder#replaceString',
        function ()
        {
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
            it
            (
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
                'replaces element "" without string forcing',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var output = encoder.replaceStringArray(['', ''], [], null, false);
                    expect(evalJSFuck(output)).toEqual([[], []]);
                }
            );
            it
            (
                'replaces element "" with string forcing',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var output = encoder.replaceStringArray([''], [], null, true);
                    expect(output).toBe('[[]+[]]');
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
                'does not replace "split" and "concat" when maxLength is low',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var output =
                    encoder.replaceStringArray
                    (['', '', '', ''], [{ separator: 'false', joiner: 'false' }], null, false, 0);
                    expect(output).toBeUndefined();
                }
            );
            it
            (
                'does not replace "join" when maxLength is low',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var output =
                    encoder.replaceStringArray
                    (
                        [''],
                        [{ separator: 'false', joiner: 'false' }],
                        [{ separator: '0', joiner: '1' }],
                        false,
                        7000
                    );
                    expect(output).toBeUndefined();
                }
            );
            it
            (
                'does not replace a joined string when maxLength is low',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var output =
                    encoder.replaceStringArray
                    (repeat('0', 50).split(''), [{ separator: '[]', joiner: '' }], [], false, 3500);
                    expect(output).toBeUndefined();
                }
            );
            it
            (
                'does not replace a single element with the concat approach when maxLength is low',
                function ()
                {
                    var encoder = JScrewIt.debug.createEncoder();
                    var output = encoder.replaceStringArray([''], [], null, false, 0);
                    expect(output).toBeUndefined();
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

            JScrewIt.debug.defineConstant(encoder, 'A', 'FILL');
            JScrewIt.debug.defineConstant(encoder, 'B', 'C');
            JScrewIt.debug.defineConstant(encoder, 'C', 'B');
            JScrewIt.debug.defineConstant(encoder, 'D', '?');
            JScrewIt.debug.defineConstant(encoder, 'E', '"\\xx"');
            JScrewIt.debug.defineConstant(encoder, 'F', '"too complex"');

            it
            (
                'circular reference',
                function ()
                {
                    expect(debugReplacer('B')).toThrowStrictly
                    (SyntaxError, 'Circular reference detected: B < C < B – [Feature {}]');
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
                            (SyntaxError, 'Undefined identifier FILL in the definition of A');
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
        }
    );
    describe
    (
        'Encoder#resolveExprAt throws a SyntaxError for',
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
                            encoder.resolveExprAt('', '', 42, undefined, []);
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
            var encoder = JScrewIt.debug.createEncoder();
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
                            scope.maxLength = maxLength =
                            strategy.call(encoder, Object('0')).length;
                        }
                        return maxLength;
                    }

                    var strategy = strategies[strategyName];
                    it
                    (
                        'returns correct JSFuck',
                        function ()
                        {
                            var input = strategyName !== 'express' ? text : JSON.stringify(text);
                            var output = strategy.call(encoder, Object(input));
                            expect(output).toBeJSFuck();
                            expect(evalJSFuck(output)).toBe(text);
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
                    description: 'encodeByDenseFigures',
                    fn:
                    function (inputData)
                    {
                        this.encodeByDenseFigures(inputData, 0);
                    },
                },
                {
                    description: 'encodeByDict',
                    fn:
                    function (inputData)
                    {
                        this.encodeByDict(inputData, undefined, undefined, 0);
                    },
                },
                {
                    description: 'encodeBySparseFigures',
                    fn:
                    function (inputData)
                    {
                        this.encodeBySparseFigures(inputData, 0);
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
                'works with a strong numeric expression',
                function ()
                {
                    expect(JScrewIt.debug.calculateSolutionType('[+[]][+[]]'))
                    .toBe(JScrewIt.debug.SolutionType.NUMERIC);
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
            it
            (
                '#source is unknown',
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
            it
            (
                '#replacement is idempotent',
                function ()
                {
                    var solution = new JScrewIt.debug.DynamicSolution();
                    expect(solution.replacement).toBe(solution.replacement);
                }
            );
        }
    );
}
)();
