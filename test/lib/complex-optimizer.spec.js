/* eslint-env mocha */
/* global expect, module, require, self */

'use strict';

(function ()
{
    function createOptimizer(appendLength, level)
    {
        if (appendLength === undefined)
            appendLength = 60;
        var encoder =
        {
            resolve:
            function ()
            {
                var solution =
                { appendLength: appendLength, level: level, replacement: EXPECTED_REPLACEMENT };
                solution.appendLength = appendLength;
                return solution;
            },
            resolveCharacter:
            function (char)
            {
                var solution = SOLUTIONS[char];
                return solution;
            },
        };
        var optimizer = JScrewIt.debug.createComplexOptimizer(encoder, 'feet');
        return optimizer;
    }

    var EXPECTED_REPLACEMENT = '"feet"';
    var LEVEL_OBJECT = 0;
    var SOLUTIONS =
    {
        e: { appendLength: 26, char: 'e' },
        f: { appendLength: 14, char: 'f' },
        t: { appendLength: 15, char: 't' },
        u: { appendLength: 17, char: 'u' },
    };

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
                        'optimizes characters that are part of the complex',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            expect(optimizer.appendLengthOf(SOLUTIONS.e)).toBe(15);
                        }
                    );
                    it
                    (
                        'does not optimize characters that are not part of the complex',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            expect(optimizer.appendLengthOf(SOLUTIONS.u)).toBeUndefined();
                        }
                    );
                    it
                    (
                        'does not optimize sufficiently short characters',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            expect(optimizer.appendLengthOf(SOLUTIONS.t)).toBeUndefined();
                        }
                    );
                }
            );

            describe
            (
                '#optimizeSolutions',
                function ()
                {
                    function test(description, opt)
                    {
                        testDo(description, opt);
                        testDont(description, opt);
                    }

                    function testDo(description, opt)
                    {
                        it
                        (
                            'optimizes ' + description,
                            function ()
                            {
                                var complexAppendLength = opt.complexAppendLength;
                                var complexLevel = opt.complexLevel;
                                var solutions =
                                opt.solutions ||
                                [SOLUTIONS.f, SOLUTIONS.e, SOLUTIONS.e, SOLUTIONS.t];
                                var bond = opt.bond;
                                var forceString = opt.forceString;
                                var verify =
                                opt.verifyDo ||
                                function ()
                                {
                                    expect(solutions.length).toBe(1);
                                    expect(solutions[0].replacement).toBe(EXPECTED_REPLACEMENT);
                                };
                                var optimizer = createOptimizer(complexAppendLength, complexLevel);
                                solutions.forEach
                                (
                                    function (solution)
                                    {
                                        optimizer.appendLengthOf(solution);
                                    }
                                );
                                JScrewIt.debug.optimizeSolutions
                                ([optimizer], solutions, bond, forceString);
                                verify(solutions);
                            }
                        );
                    }

                    function testDont(description, opt)
                    {
                        it
                        (
                            'does not optimize ' + description,
                            function ()
                            {
                                var complexAppendLength = (opt.complexAppendLength | 0) + 1;
                                var complexLevel = opt.complexLevel;
                                var solutions =
                                opt.solutions ||
                                [SOLUTIONS.f, SOLUTIONS.e, SOLUTIONS.e, SOLUTIONS.t];
                                var bond = opt.bond;
                                var forceString = opt.forceString;
                                var expectedSolutionCount = solutions.length;
                                var optimizer = createOptimizer(complexAppendLength, complexLevel);
                                solutions.forEach
                                (
                                    function (solution)
                                    {
                                        optimizer.appendLengthOf(solution);
                                    }
                                );
                                JScrewIt.debug.optimizeSolutions
                                ([optimizer], solutions, bond, forceString);
                                expect(solutions.length).toBe(expectedSolutionCount);
                            }
                        );
                    }

                    test
                    (
                        'a string integral cluster without bonding or string forcing',
                        { complexAppendLength: 80 }
                    );
                    test
                    (
                        'an object integral cluster without bonding or string forcing',
                        { complexAppendLength: 80, complexLevel: LEVEL_OBJECT }
                    );
                    test
                    (
                        'an integral cluster with bonding',
                        { bond: true, complexAppendLength: 82 }
                    );
                    test
                    (
                        'an integral string cluster with string forcing',
                        { complexAppendLength: 80, forceString: true }
                    );
                    test
                    (
                        'an integral object cluster with string forcing',
                        { complexAppendLength: 77, complexLevel: LEVEL_OBJECT, forceString: true }
                    );
                    test
                    (
                        'a partial cluster with bonding',
                        {
                            bond:                   true,
                            complexAppendLength:    80,
                            solutions:
                            [SOLUTIONS.u, SOLUTIONS.f, SOLUTIONS.e, SOLUTIONS.e, SOLUTIONS.t],
                            verifyDo:
                            function (solutions)
                            {
                                expect(solutions.length).toBe(2);
                                expect(solutions[0]).toBe(SOLUTIONS.u);
                                expect(solutions[1].replacement).toBe(EXPECTED_REPLACEMENT);
                            },
                        }
                    );
                    test
                    (
                        'a partial object cluster with string forcing',
                        {
                            complexAppendLength:    80,
                            complexLevel:           LEVEL_OBJECT,
                            forceString:            true,
                            solutions:
                            [SOLUTIONS.u, SOLUTIONS.f, SOLUTIONS.e, SOLUTIONS.e, SOLUTIONS.t],
                            verifyDo:
                            function (solutions)
                            {
                                expect(solutions.length).toBe(2);
                                expect(solutions[0]).toBe(SOLUTIONS.u);
                                expect(solutions[1].replacement).toBe(EXPECTED_REPLACEMENT);
                            },
                        }
                    );
                }
            );
        }
    );
}
)();
