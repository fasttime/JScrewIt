/* eslint-env ebdd/ebdd */
/* global expect, module, padRight, repeat, require, self */

'use strict';

(function ()
{
    function arrayFilledWith(element, length)
    {
        var array = Array(length);
        while (length) array[--length] = element;
        return array;
    }

    function checkLength(toStringReplacementLength, solution, expected)
    {
        var toStringReplacement = repeat('*', toStringReplacementLength);
        var optimizer = createOptimizer(toStringReplacement);
        var actual = optimizer.appendLengthOf(solution);
        expect(actual).toBe(expected);
    }

    function createOptimizer(toStringReplacement)
    {
        if (toStringReplacement === undefined)
            toStringReplacement = '"toString"';
        var encoder =
        {
            resolveConstant:
            function ()
            {
                return Object(toStringReplacement);
            },
        };
        var optimizer = JScrewIt.debug.createToStringOptimizer(encoder);
        return optimizer;
    }

    function nextMultipleOf(minValue, divisor)
    {
        var nextMultiple = Math.ceil(minValue / divisor) * divisor;
        return nextMultiple;
    }

    var EXPECTED_REPLACEMENT =
    '(+(!![]+!![]+[!![]+!![]+!![]]+(+!![])))["toString"](!![]+!![]+[+[]])';

    var JScrewIt = typeof module !== 'undefined' ? require('../node-jscrewit-test') : self.JScrewIt;

    describe
    (
        'Optimizer',
        function ()
        {
            describe
            (
                '#appendLengthOf',
                function ()
                {
                    it
                    (
                        'does not optimize statically encoded small letters',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solution = { appendLength: 123, source: 'a' };
                            var actual = optimizer.appendLengthOf(solution);
                            expect(actual).toBeUndefined();
                        }
                    );
                    it
                    (
                        'does not optimize non-hexatridecimal digits',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solution = { appendLength: 123 };
                            var actual = optimizer.appendLengthOf(solution);
                            expect(actual).toBeUndefined();
                        }
                    );

                    describe
                    (
                        'optimizes',
                        function ()
                        {
                            var paramDataList =
                            [
                                { char: 'b', decimalMinLength: 64, radixMinLength: 15 },
                                { char: 'c', decimalMinLength: 64, radixMinLength: 15 },
                                { char: 'g', decimalMinLength: 54, radixMinLength: 15 },
                                { char: 'h', decimalMinLength: 54, radixMinLength: 15 },
                                { char: 'j', decimalMinLength: 54, radixMinLength: 15 },
                                { char: 'k', decimalMinLength: 54, radixMinLength: 17 },
                                { char: 'm', decimalMinLength: 50, radixMinLength: 20 },
                                { char: 'o', decimalMinLength: 50, radixMinLength: 20 },
                                { char: 'p', decimalMinLength: 50, radixMinLength: 20 },
                                { char: 'q', decimalMinLength: 50, radixMinLength: 20 },
                                { char: 'v', decimalMinLength: 48, radixMinLength: 26 },
                                { char: 'w', decimalMinLength: 48, radixMinLength: 31 },
                                { char: 'x', decimalMinLength: 48, radixMinLength: 36 },
                                { char: 'z', decimalMinLength: 48, radixMinLength: 46 },
                            ];

                            it.per(paramDataList)
                            (
                                '"#.char"',
                                function (paramData)
                                {
                                    var char                = paramData.char;
                                    var decimalMinLength    = paramData.decimalMinLength;
                                    var radixMinLength      = paramData.radixMinLength;
                                    var minRadix = parseInt(char, 36) + 1;
                                    var maxDecimalDigits =
                                    Math.ceil(Math.log(0x1fffffffffffff) / Math.log(minRadix));
                                    // 7 for "+(", ")[", "](" and ")"
                                    var bulkLength = 7 + decimalMinLength + radixMinLength;
                                    var enough =
                                    nextMultipleOf(bulkLength, maxDecimalDigits) + maxDecimalDigits;
                                    var toStringReplacementLength = enough - bulkLength;
                                    var solution = { source: char, appendLength: Infinity };
                                    checkLength
                                    (
                                        toStringReplacementLength,
                                        solution,
                                        enough / maxDecimalDigits
                                    );
                                    checkLength
                                    (
                                        toStringReplacementLength - 1,
                                        solution,
                                        enough / maxDecimalDigits - 1
                                    );
                                }
                            );
                        }
                    );
                }
            );

            describe
            (
                '#optimizeSolutions',
                function ()
                {
                    var optimizeSolutions = JScrewIt.debug.optimizeSolutions;

                    it
                    (
                        'optimizes an integral cluster without bonding',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solutionB = { appendLength: 35, source: 'b' };
                            optimizer.appendLengthOf(solutionB);
                            var solutions = [solutionB, solutionB];
                            optimizeSolutions([optimizer], solutions, false);
                            expect(solutions.length).toBe(1);
                            expect(solutions[0].replacement).toBe(EXPECTED_REPLACEMENT);
                        }
                    );
                    it
                    (
                        'does not optimize an integral cluster without bonding',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solutionB = { appendLength: 34, source: 'b' };
                            optimizer.appendLengthOf(solutionB);
                            var solutions = [solutionB, solutionB];
                            optimizeSolutions([optimizer], solutions, false);
                            expect(solutions.length).toBe(2);
                        }
                    );
                    it
                    (
                        'optimizes an integral cluster with bonding',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solutionB = { appendLength: 34, source: 'b' };
                            optimizer.appendLengthOf(solutionB);
                            var solutions = [solutionB, solutionB];
                            optimizeSolutions([optimizer], solutions, true);
                            expect(solutions.length).toBe(1);
                            expect(solutions[0].replacement).toBe(EXPECTED_REPLACEMENT);
                        }
                    );
                    it
                    (
                        'does not optimize a partial cluster with bonding',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solution0 = { appendLength: 6 };
                            var solutionB = { appendLength: 34, source: 'b' };
                            optimizer.appendLengthOf(solutionB);
                            var solutions = [solution0, solutionB, solutionB];
                            optimizeSolutions([optimizer], solutions, true);
                            expect(solutions.length).toBe(3);
                        }
                    );
                    it
                    (
                        'does not optimize a cluster where the first solution is "0"',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solution0 = { appendLength: 6,      source: '0' };
                            var solutionB = { appendLength: 100,    source: 'b' };
                            optimizer.appendLengthOf(solutionB);
                            var solutions = [solution0, solutionB];
                            optimizeSolutions([optimizer], solutions, false);
                            expect(solutions.length).toBe(2);
                        }
                    );
                    it
                    (
                        'does not cluster with decimals above MAX_SAFE_INTEGER',
                        function ()
                        {
                            var toStringReplacement = padRight('"toString"', 500);
                            var optimizer = createOptimizer(toStringReplacement);
                            var solutionZ = { appendLength: 100, source: 'z' };
                            optimizer.appendLengthOf(solutionZ);
                            var solutions = arrayFilledWith(solutionZ, 11);
                            optimizeSolutions([optimizer], solutions, true);
                            expect(solutions.length).toBe(2);
                        }
                    );
                }
            );
        }
    );
}
)();
