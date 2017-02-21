/* eslint-env mocha */
/* global expect, module, require, self */

(function ()
{
    'use strict';
    
    function createOptimizer()
    {
        var encoder =
        {
            replaceString: function ()
            {
                return '"toString"';
            }
        };
        var optimizer = JScrewIt.debug.createOptimizer(encoder);
        return optimizer;
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
                        'optimizes a non-statically encoded small letter',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solution = { char: 'b', appendLength: 10 };
                            var actual = optimizer.optimizeAppendLength(solution);
                            expect(actual).toBe(8);
                        }
                    );
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
                }
            );
        }
    );
}
)();
