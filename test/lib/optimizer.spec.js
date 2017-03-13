/* eslint-env mocha */
/* global expect, module, padRight, repeat, require, self */

(function ()
{
    'use strict';
    
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
        var actual = optimizer.optimizeAppendLength(solution);
        expect(actual).toBe(expected);
    }
    
    function createOptimizer(toStringReplacement)
    {
        if (toStringReplacement === undefined)
            toStringReplacement = '"toString"';
        var encoder =
        {
            replaceString: function ()
            {
                return toStringReplacement;
            }
        };
        var optimizer = JScrewIt.debug.createOptimizer(encoder);
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
    
    describe(
        'Optimizer',
        function ()
        {
            describe(
                '#optimizeAppendLength',
                function ()
                {
                    it(
                        'does not optimize statically encoded small letters',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var expected = 123;
                            var solution = { char: 'a', appendLength: expected };
                            var actual = optimizer.optimizeAppendLength(solution);
                            expect(actual).toBe(expected);
                        }
                    );
                    it(
                        'does not optimize non-hexatridecimal digits',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var expected = 123;
                            var solution = { appendLength: expected };
                            var actual = optimizer.optimizeAppendLength(solution);
                            expect(actual).toBe(expected);
                        }
                    );
                    it(
                        'caches lengths',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solution = { char: 'b', appendLength: 5 };
                            optimizer.optimizeAppendLength(solution);
                            solution.appendLength = 10;
                            var actual = optimizer.optimizeAppendLength(solution);
                            expect(actual).toBe(5);
                        }
                    );
                    
                    describe(
                        'optimizes',
                        function ()
                        {
                            function test(char, decimalMinLength, radixMinLength)
                            {
                                it(
                                    '"' + char + '"',
                                    function ()
                                    {
                                        var minRadix = parseInt(char, 36) + 1;
                                        var maxDecimalDigits =
                                            Math.ceil(
                                                Math.log(0x1fffffffffffff) / Math.log(minRadix)
                                            );
                                        // 7 for "+(", ")[", "](" and ")"
                                        var bulkLength = 7 + decimalMinLength + radixMinLength;
                                        var enough =
                                            nextMultipleOf(bulkLength, maxDecimalDigits) +
                                            maxDecimalDigits;
                                        var toStringReplacementLength = enough - bulkLength;
                                        var solution = { char: char, appendLength: Infinity };
                                        checkLength(
                                            toStringReplacementLength,
                                            solution,
                                            enough / maxDecimalDigits
                                        );
                                        checkLength(
                                            toStringReplacementLength - 1,
                                            solution,
                                            enough / maxDecimalDigits - 1
                                        );
                                    }
                                );
                            }
                            
                            test('b', 64, 15);
                            test('c', 64, 15);
                            test('g', 54, 15);
                            test('h', 54, 15);
                            test('j', 54, 15);
                            test('k', 54, 17);
                            test('m', 50, 20);
                            test('o', 50, 20);
                            test('p', 50, 20);
                            test('q', 50, 20);
                            test('v', 48, 26);
                            test('w', 48, 31);
                            test('x', 48, 36);
                            test('z', 48, 46);
                        }
                    );
                }
            );
            
            describe(
                '#optimizeSolutions',
                function ()
                {
                    it(
                        'optimizes an integral cluster without bonding',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solutionB = { appendLength: 35, char: 'b' };
                            optimizer.optimizeAppendLength(solutionB);
                            var solutions = [solutionB, solutionB];
                            optimizer.optimizeSolutions(solutions, false);
                            expect(solutions.length).toBe(1);
                            expect(solutions[0].replacement).toBe(EXPECTED_REPLACEMENT);
                        }
                    );
                    it(
                        'does not optimize an integral cluster',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solutionB = { appendLength: 34, char: 'b' };
                            optimizer.optimizeAppendLength(solutionB);
                            var solutions = [solutionB, solutionB];
                            optimizer.optimizeSolutions(solutions, false);
                            expect(solutions.length).toBe(2);
                        }
                    );
                    it(
                        'optimizes an integral cluster with bonding',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solutionB = { appendLength: 34, char: 'b' };
                            optimizer.optimizeAppendLength(solutionB);
                            var solutions = [solutionB, solutionB];
                            optimizer.optimizeSolutions(solutions, true);
                            expect(solutions.length).toBe(1);
                            expect(solutions[0].replacement).toBe(EXPECTED_REPLACEMENT);
                        }
                    );
                    it(
                        'does not optimize a partial cluster with bonding',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solution0 = { appendLength: 6 };
                            var solutionB = { appendLength: 34, char: 'b' };
                            optimizer.optimizeAppendLength(solutionB);
                            var solutions = [solution0, solutionB, solutionB];
                            optimizer.optimizeSolutions(solutions, true);
                            expect(solutions.length).toBe(3);
                        }
                    );
                    it(
                        'does not optimize a cluster where the first solution is "0"',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solution0 = { appendLength: 6,      char: '0' };
                            var solutionB = { appendLength: 100,    char: 'b' };
                            optimizer.optimizeAppendLength(solutionB);
                            var solutions = [solution0, solutionB];
                            optimizer.optimizeSolutions(solutions, false);
                            expect(solutions.length).toBe(2);
                        }
                    );
                    it(
                        'does not cluster with decimals above MAX_SAFE_INTEGER',
                        function ()
                        {
                            var toStringReplacement = padRight('"toString"', 500);
                            var optimizer = createOptimizer(toStringReplacement);
                            var solutionZ = { appendLength: 100, char: 'z' };
                            optimizer.optimizeAppendLength(solutionZ);
                            var solutions = arrayFilledWith(solutionZ, 11);
                            optimizer.optimizeSolutions(solutions, true);
                            expect(solutions.length).toBe(2);
                        }
                    );
                }
            );
        }
    );
}
)();
