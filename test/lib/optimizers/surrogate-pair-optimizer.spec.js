/* eslint-env ebdd/ebdd */
/* global expect, module, require, self */

'use strict';

(function ()
{
    function createOptimizer(replacement)
    {
        function replaceExpr()
        {
            return replacement;
        }

        if (replacement === undefined)
            replacement = '"🪛"';
        var encoder = JScrewIt.debug.createEncoder();
        encoder.replaceExpr = replaceExpr;
        var optimizer = encoder.createOptimizer('surrogatePair');
        return optimizer;
    }

    var JScrewIt =
    typeof module !== 'undefined' ? require('../../node-jscrewit-test') : self.JScrewIt;

    var Solution        = JScrewIt.debug.Solution;
    var SolutionType    = JScrewIt.debug.SolutionType;

    var HIGH_SURROGATE_SOLUTION =
    new Solution('\ud83e', '"\ud83e"', SolutionType.STRING);
    var LOW_SURROGATE_SOLUTION =
    new Solution('\ude9b', '"\ude9b"', SolutionType.STRING);
    var NON_SURROGATE_SOLUTION =
    new Solution('\uffff', '"\uffff"', SolutionType.STRING);

    describe
    (
        'Surrogate pair optimizer (surrogate-pair-optimizer)',
        function ()
        {
            describe
            (
                '#appendLengthOf',
                function ()
                {
                    it
                    (
                        'optimizes a high surrogate',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var actual = optimizer.appendLengthOf(HIGH_SURROGATE_SOLUTION);
                            expect(actual).toBe(2);
                        }
                    );
                    it
                    (
                        'optimizes a low surrogate',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var actual = optimizer.appendLengthOf(LOW_SURROGATE_SOLUTION);
                            expect(actual).toBe(2);
                        }
                    );
                    it
                    (
                        'does not optimize a solution other than a surrogate',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var actual = optimizer.appendLengthOf(NON_SURROGATE_SOLUTION);
                            expect(actual).toBeUndefined();
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
                        'optimizes a surrogate pair',
                        function ()
                        {
                            var optimizer;
                            var solutions;

                            // OK.
                            optimizer = createOptimizer();
                            solutions = [HIGH_SURROGATE_SOLUTION, LOW_SURROGATE_SOLUTION];
                            optimizeSolutions([optimizer], solutions, false, false);
                            expect(solutions.length).toBe(1);
                            expect(solutions[0].replacement).toBe('"🪛"');
                            expect(solutions[0].type).toBe(SolutionType.STRING);

                            // Surrogates short enough.
                            optimizer = createOptimizer(' "🪛"  ');
                            solutions = [HIGH_SURROGATE_SOLUTION, LOW_SURROGATE_SOLUTION];
                            optimizeSolutions([optimizer], solutions, false, false);
                            expect(solutions.length).toBeGreaterThan(1);
                        }
                    );
                    it
                    (
                        'optimizes a surrogate pair because of bonding',
                        function ()
                        {
                            var expectedReplacement = '( "🪛" )';
                            var optimizer = createOptimizer(expectedReplacement);
                            var solutions;

                            // OK.
                            solutions = [HIGH_SURROGATE_SOLUTION, LOW_SURROGATE_SOLUTION];
                            optimizeSolutions([optimizer], solutions, true, false);
                            expect(solutions.length).toBe(1);
                            expect(solutions[0].replacement).toBe(expectedReplacement);
                            expect(solutions[0].type).toBe(SolutionType.STRING);

                            // No bonding.
                            solutions = [HIGH_SURROGATE_SOLUTION, LOW_SURROGATE_SOLUTION];
                            optimizeSolutions([optimizer], solutions, false, false);
                            expect(solutions.length).toBeGreaterThan(1);

                            // Not a single part: additional leading solution.
                            solutions =
                            [
                                NON_SURROGATE_SOLUTION,
                                HIGH_SURROGATE_SOLUTION,
                                LOW_SURROGATE_SOLUTION,
                            ];
                            optimizeSolutions([optimizer], solutions, true, false);
                            expect(solutions.length).toBeGreaterThan(1);

                            // Not a single part: additional trailing solution.
                            solutions =
                            [
                                HIGH_SURROGATE_SOLUTION,
                                LOW_SURROGATE_SOLUTION,
                                NON_SURROGATE_SOLUTION,
                            ];
                            optimizeSolutions([optimizer], solutions, true, false);
                            expect(solutions.length).toBeGreaterThan(1);
                        }
                    );
                    it
                    (
                        'does not optimize a standalone surrogate',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solutions =
                            [
                                HIGH_SURROGATE_SOLUTION,
                                NON_SURROGATE_SOLUTION,
                                LOW_SURROGATE_SOLUTION,
                            ];
                            optimizeSolutions([optimizer], solutions, false, false);
                            expect(solutions.length).toBe(3);
                        }
                    );
                }
            );
        }
    );
}
)();
