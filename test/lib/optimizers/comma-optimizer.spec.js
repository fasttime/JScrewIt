/* eslint-env ebdd/ebdd */
/* global expect, module, require, self */

'use strict';

(function ()
{
    function createOptimizer(replaceCoil)
    {
        function replaceExpr()
        {
            return '[].slice.call';
        }

        function replaceString(str, options)
        {
            expect(options.optimize).toBe(true);
            if (replaceCoil)
            {
                var replacement = replaceCoil(str);
                if (replacement != null)
                    return replacement;
            }
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
        var optimizer = encoder._getOptimizer('comma');
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

        D:
        new Solution
        ('D',       '"D"',                                  SolutionType.STRING),

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
        '`comma` optimizer',
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
                    it
                    (
                        'optimizes a subcluster when the longest cluster is discarded',
                        function ()
                        {
                            var CD_SOLUTION = new Solution('CD', '"CD"', SolutionType.STRING);
                            var cdOptimizer =
                            {
                                appendLengthOf:
                                function ()
                                { },
                                optimizeSolutions:
                                function (plan)
                                {
                                    var clusterer =
                                    function ()
                                    {
                                        return CD_SOLUTION;
                                    };
                                    plan.addCluster(4, 2, clusterer, 1000);
                                },
                            };
                            var optimizer = createOptimizer();
                            var solutions =
                            [
                                SOLUTIONS.A,
                                SOLUTIONS[','],
                                SOLUTIONS.B,
                                SOLUTIONS[','],
                                SOLUTIONS.C,
                                SOLUTIONS.D,
                            ];
                            optimizeSolutions([optimizer, cdOptimizer], solutions, false, false);
                            expect(solutions.length).toBe(3);
                            expect(solutions[0].replacement).toBe('[].slice.call("A"+"B")');
                            expect(solutions[0].type).toBe(SolutionType.OBJECT);
                            expect(solutions[1]).toBe(SOLUTIONS[',']);
                            expect(solutions[2]).toBe(CD_SOLUTION);
                        }
                    );
                    it
                    (
                        'does not optimize a comma in a single part because of string forcing',
                        function ()
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
                            optimizeSolutions([optimizer], solutions, false, true);
                            expect(solutions.length).toBe(3);

                            // No string forcing.
                            initSolutions();
                            optimizeSolutions([optimizer], solutions, false, false);
                            expect(solutions.length).toBeLessThan(3);

                            // Comma too long.
                            initSolutions();
                            solutions[1] = LONG_COMMA_SOLUTION;
                            optimizeSolutions([optimizer], solutions, false, true);
                            expect(solutions.length).toBeLessThan(3);
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

                            // Comma short enough.
                            initSolutions();
                            solutions[1] = SHORT_COMMA_SOLUTION;
                            optimizeSolutions([optimizer], solutions, true, false);
                            expect(solutions.length).toBeGreaterThan(1);
                        }
                    );
                    it
                    (
                        'optimizes a comma preceded by a digit',
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

                            // Comma short enough.
                            initSolutions();
                            solutions[1] = SHORT_COMMA_SOLUTION;
                            optimizeSolutions([optimizer], solutions);
                            expect(solutions.length).toBeGreaterThan(2);
                        }
                    );
                    it
                    (
                        'optimizes a run of commas preceded by a comma',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solutions =
                            [SOLUTIONS[','], SOLUTIONS.A, SOLUTIONS[','], SOLUTIONS.B];
                            optimizeSolutions([optimizer], solutions, false, false);
                            expect(solutions.length).toBe(2);
                            expect(solutions[0]).toBe(SOLUTIONS[',']);
                            expect(solutions[1].replacement).toBe('[].slice.call("A"+"B")');
                            expect(solutions[1].type).toBe(SolutionType.OBJECT);
                        }
                    );
                    it
                    (
                        'accounts for the optimization of the coil',
                        function ()
                        {
                            var COMMA_SOLUTION =
                            new Solution(',', '/* 17 */      ","', SolutionType.STRING);

                            var replaceCoil =
                            function (str)
                            {
                                if (str === 'AB')
                                    return '"AB"';
                            };
                            var optimizer;
                            var solutions;
                            var initSolutions =
                            function ()
                            {
                                solutions = [SOLUTIONS.A, COMMA_SOLUTION, SOLUTIONS.B];
                            };

                            // OK.
                            optimizer = createOptimizer(replaceCoil);
                            initSolutions();
                            optimizeSolutions([optimizer], solutions, false, true);
                            expect(solutions.length).toBe(1);
                            expect(solutions[0].replacement).toBe('[].slice.call("AB")');
                            expect(solutions[0].type).toBe(SolutionType.OBJECT);

                            // Coil not optimized.
                            optimizer = createOptimizer();
                            initSolutions();
                            optimizeSolutions([optimizer], solutions, false, true);
                            expect(solutions.length).toBe(3);
                        }
                    );
                    it
                    (
                        'replaces the coil of a candidate cluster only once',
                        function ()
                        {
                            var coils = [];
                            var replaceCoil =
                            function (str)
                            {
                                coils.push(str);
                            };
                            var optimizer = createOptimizer(replaceCoil);
                            var solutions =
                            [
                                SOLUTIONS.false,
                                SOLUTIONS.A,
                                SOLUTIONS[','],
                                SOLUTIONS.B,
                                SOLUTIONS[','],
                                SOLUTIONS.C,
                                SOLUTIONS.false,
                            ];
                            optimizeSolutions([optimizer], solutions, false, false);
                            expect(solutions.length).toBe(3);
                            expect(solutions[1].replacement).toBe('[].slice.call("A"+"B"+"C")');
                            expect(coils).toEqual(['ABC', 'AB', 'BC']);
                        }
                    );
                    it
                    (
                        'does not drop the first or last characters of a run at the start or at ' +
                        'the end of a group',
                        function ()
                        {
                            function test(solutions, expectedCoils)
                            {
                                var coils = [];
                                var replaceCoil =
                                function (str)
                                {
                                    coils.push(str);
                                };
                                var optimizer = createOptimizer(replaceCoil);
                                optimizeSolutions([optimizer], solutions, false, false);
                                expect(coils.sort()).toEqual(expectedCoils);
                            }

                            var solutions =
                            [
                                SOLUTIONS.A,
                                SOLUTIONS[','],
                                SOLUTIONS.B,
                                SOLUTIONS[','],
                                SOLUTIONS.C,
                            ];
                            // Run spanning the whole group.
                            test(solutions.slice(), ['ABC']);
                            // Run at the start of the group.
                            test(solutions.concat(SOLUTIONS.false), ['AB', 'ABC']);
                            // Run at the end of the group.
                            test([SOLUTIONS.false].concat(solutions), ['ABC', 'BC']);
                        }
                    );
                }
            );
        }
    );
}
)();
