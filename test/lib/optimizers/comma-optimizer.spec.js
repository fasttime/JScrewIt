/* eslint-env ebdd/ebdd */
/* global expect, module, require, self */

'use strict';

(function ()
{
    function createOptimizer()
    {
        function replaceExpr()
        {
            return '[].slice.call';
        }

        function replaceString(str, options)
        {
            expect(options.optimize).toBe(true);
            var solution = new DynamicSolution();
            Array.prototype.forEach.call
            (
                str,
                function (char)
                {
                    var subSolution = SOLUTIONS[char];
                    solution.append(subSolution);
                }
            );
            return solution.replacement;
        }

        var encoder = JScrewIt.debug.createEncoder();
        encoder.replaceExpr     = replaceExpr;
        encoder.replaceString   = replaceString;
        var optimizer = encoder._createOptimizer('comma');
        return optimizer;
    }

    var JScrewIt =
    typeof module !== 'undefined' ? require('../../node-jscrewit-test') : self.JScrewIt;

    var DynamicSolution = JScrewIt.debug.DynamicSolution;
    var Solution        = JScrewIt.debug.Solution;
    var SolutionType    = JScrewIt.debug.SolutionType;

    var SOLUTIONS =
    {
        A:
        new Solution
        ('A',       '"A"',                                  SolutionType.STRING),

        B:
        new Solution
        ('B',       '"B"',                                  SolutionType.STRING),

        C:
        new Solution
        ('C',       '"C"',                                  SolutionType.STRING),

        ',':
        new Solution
        (',',       '([].slice.call(![]+[])+[])[+!![]]',    SolutionType.STRING),

        0:
        new Solution
        ('0',       '+![]',                                 SolutionType.WEAK_ALGEBRAIC),

        false:
        new Solution
        ('false',   '![]',                                  SolutionType.ALGEBRAIC),
    };

    describe
    (
        'Comma optimizer (comma-optimizer)',
        function ()
        {
            describe
            (
                '#appendLengthOf',
                function ()
                {
                    it
                    (
                        'optimizes a comma',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var actual = optimizer.appendLengthOf(SOLUTIONS[',']);
                            expect(actual).toBe(0);
                        }
                    );
                    it
                    (
                        'does not optimize a solution other than a comma',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var actual = optimizer.appendLengthOf(SOLUTIONS.A);
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
                        'optimizes a comma between single characters',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solutions;
                            var initSolutions =
                            function ()
                            {
                                solutions = [SOLUTIONS.A, SOLUTIONS[','], SOLUTIONS.B];
                            };

                            // OK.
                            initSolutions();
                            optimizeSolutions([optimizer], solutions, false, false);
                            expect(solutions.length).toBe(1);
                            expect(solutions[0].replacement).toBe('[].slice.call("A"+"B")');
                            expect(solutions[0].type).toBe(SolutionType.OBJECT);

                            // Solution before comma is not a single character.
                            initSolutions();
                            solutions[0] = SOLUTIONS.false;
                            optimizeSolutions([optimizer], solutions, false, false);
                            expect(solutions.length).toBeGreaterThan(1);

                            // Solution after comma is not a single character.
                            initSolutions();
                            solutions[2] = SOLUTIONS.false;
                            optimizeSolutions([optimizer], solutions, false, false);
                            expect(solutions.length).toBeGreaterThan(1);

                            // No solution before comma.
                            initSolutions();
                            solutions.shift();
                            optimizeSolutions([optimizer], solutions, false, false);
                            expect(solutions.length).toBeGreaterThan(1);

                            // No solution after comma.
                            initSolutions();
                            solutions.pop();
                            optimizeSolutions([optimizer], solutions, false, false);
                            expect(solutions.length).toBeGreaterThan(1);
                        }
                    );
                    it
                    (
                        'optimizes multiple commas between single characters',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solutions;
                            var initSolutions =
                            function ()
                            {
                                solutions =
                                [
                                    SOLUTIONS.A,
                                    SOLUTIONS[','],
                                    SOLUTIONS.B,
                                    SOLUTIONS[','],
                                    SOLUTIONS.C,
                                ];
                            };

                            // OK.
                            initSolutions();
                            optimizeSolutions([optimizer], solutions, false, false);
                            expect(solutions.length).toBe(1);
                            expect(solutions[0].replacement).toBe('[].slice.call("A"+"B"+"C")');
                            expect(solutions[0].type).toBe(SolutionType.OBJECT);

                            // Solution between commas is not a single character.
                            initSolutions();
                            solutions[2] = SOLUTIONS.false;
                            optimizeSolutions([optimizer], solutions, false, false);
                            expect(solutions.length).toBeGreaterThan(1);

                            // No solution between commas.
                            initSolutions();
                            solutions.splice(2, 1);
                            optimizeSolutions([optimizer], solutions, false, false);
                            expect(solutions.length).toBeGreaterThan(1);
                        }
                    );
                    it
                    (
                        'optimizes adjacent commas',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solutions;
                            var initSolutions =
                            function ()
                            {
                                solutions =
                                [
                                    SOLUTIONS.A,
                                    SOLUTIONS[','],
                                    SOLUTIONS[','],
                                    SOLUTIONS.B,
                                    SOLUTIONS[','],
                                    SOLUTIONS.C,
                                ];
                            };

                            // OK.
                            initSolutions();
                            optimizeSolutions([optimizer], solutions, false, false);
                            expect(solutions.length).toBe(2);
                            expect(solutions[1].replacement)
                            .toBe('[].slice.call(' + SOLUTIONS[','].replacement + '+"B"+"C")');
                            expect(solutions[1].type).toBe(SolutionType.OBJECT);
                        }
                    );
                    describe
                    (
                        'does not optimize a comma in a single part because of string forcing',
                        function ()
                        {
                            function test(bond)
                            {
                                var COMMA_SOLUTION =
                                new Solution(',', '/* 17 */      ","', SolutionType.STRING);

                                var LONG_COMMA_SOLUTION =
                                new Solution(',', '/* 18 */       ","', SolutionType.STRING);

                                var optimizer = createOptimizer();
                                var solutions;
                                var initSolutions =
                                function ()
                                {
                                    solutions = [SOLUTIONS.A, COMMA_SOLUTION, SOLUTIONS.B];
                                };

                                // OK.
                                initSolutions();
                                optimizeSolutions([optimizer], solutions, bond, true);
                                expect(solutions.length).toBe(3);

                                // No string forcing.
                                initSolutions();
                                optimizeSolutions([optimizer], solutions, bond, false);
                                expect(solutions.length).toBeLessThan(3);

                                // Comma too long.
                                initSolutions();
                                solutions[1] = LONG_COMMA_SOLUTION;
                                optimizeSolutions([optimizer], solutions, bond, true);
                                expect(solutions.length).toBeLessThan(3);

                                // Not a single part: additional leading solution.
                                initSolutions();
                                solutions.unshift(SOLUTIONS.A);
                                optimizeSolutions([optimizer], solutions, bond, true);
                                expect(solutions.length).toBeLessThan(3);

                                // Not a single part: additional trailing solution.
                                initSolutions();
                                solutions.push(SOLUTIONS.B);
                                optimizeSolutions([optimizer], solutions, bond, true);
                                expect(solutions.length).toBeLessThan(3);

                                // Multiple commas.
                                initSolutions();
                                solutions.push(COMMA_SOLUTION);
                                solutions.push(SOLUTIONS.C);
                                optimizeSolutions([optimizer], solutions, bond, true);
                                expect(solutions.length).toBeLessThan(3);
                            }

                            it('without bonding', test.bind(null, false));
                            it('with bonding', test.bind(null, true));
                        }
                    );
                    it
                    (
                        'optimizes a comma in a single part because of bonding',
                        function ()
                        {
                            var COMMA_SOLUTION =
                            new Solution(',', '/* 13 */  ","', SolutionType.STRING);

                            var SHORT_COMMA_SOLUTION =
                            new Solution(',', '/* 12 */ ","', SolutionType.STRING);

                            var optimizer = createOptimizer();
                            var solutions;
                            var initSolutions =
                            function ()
                            {
                                solutions = [SOLUTIONS.A, COMMA_SOLUTION, SOLUTIONS.B];
                            };

                            // OK.
                            initSolutions();
                            optimizeSolutions([optimizer], solutions, true, false);
                            expect(solutions.length).toBe(1);
                            expect(solutions[0].replacement).toBe('[].slice.call("A"+"B")');
                            expect(solutions[0].type).toBe(SolutionType.OBJECT);

                            // No bonding.
                            initSolutions();
                            optimizeSolutions([optimizer], solutions, false, false);
                            expect(solutions.length).toBeGreaterThan(1);

                            // String forcing.
                            initSolutions();
                            optimizeSolutions([optimizer], solutions, true, true);
                            expect(solutions.length).toBeGreaterThan(1);

                            // Comma short enough.
                            initSolutions();
                            solutions[1] = SHORT_COMMA_SOLUTION;
                            optimizeSolutions([optimizer], solutions, true, false);
                            expect(solutions.length).toBeGreaterThan(1);

                            // Not a single part: additional leading solution.
                            initSolutions();
                            solutions.unshift(SOLUTIONS.A);
                            optimizeSolutions([optimizer], solutions, true, false);
                            expect(solutions.length).toBeGreaterThan(1);

                            // Not a single part: additional trailing solution.
                            initSolutions();
                            solutions.push(SOLUTIONS.B);
                            optimizeSolutions([optimizer], solutions, true, false);
                            expect(solutions.length).toBeGreaterThan(1);
                        }
                    );
                    it
                    (
                        'optimizes a comma because it is preceded by a digit that is not the ' +
                        'first character in the group',
                        function ()
                        {
                            var COMMA_SOLUTION =
                            new Solution(',', '/* 13 */  ","', SolutionType.STRING);

                            var SHORT_COMMA_SOLUTION =
                            new Solution(',', '/* 12 */ ","', SolutionType.STRING);

                            var optimizer = createOptimizer();
                            var solutions;
                            var initSolutions =
                            function ()
                            {
                                solutions =
                                [SOLUTIONS.false, SOLUTIONS[0], COMMA_SOLUTION, SOLUTIONS.A];
                            };

                            // OK.
                            initSolutions();
                            optimizeSolutions([optimizer], solutions);
                            expect(solutions.length).toBe(2);
                            expect(solutions[1].replacement).toBe('[].slice.call(+![]+"A")');
                            expect(solutions[1].type).toBe(SolutionType.OBJECT);

                            // Comma not preceded by a digit.
                            initSolutions();
                            solutions[1] = SOLUTIONS.A;
                            optimizeSolutions([optimizer], solutions);
                            expect(solutions.length).toBeGreaterThan(2);

                            // Digit before comma is the first character in the group.
                            initSolutions();
                            solutions.push(solutions.shift());
                            optimizeSolutions([optimizer], solutions);
                            expect(solutions.length).toBeGreaterThan(2);

                            // Comma short enough.
                            initSolutions();
                            solutions[1] = SHORT_COMMA_SOLUTION;
                            optimizeSolutions([optimizer], solutions);
                            expect(solutions.length).toBeGreaterThan(2);
                        }
                    );
                }
            );
        }
    );
}
)();
