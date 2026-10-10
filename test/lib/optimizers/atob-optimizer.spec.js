/* eslint-env ebdd/ebdd */
/* global expect, module, require, self */

'use strict';

(function ()
{
    function createOptimizer(replaceString)
    {
        var encoder = JScrewIt.debug.createEncoder();
        encoder.resolveConstant =
        function (constant)
        {
            expect(constant).toBe('atob');
            var solution = createSolution(undefined, ATOB_REPLACEMENT, SolutionType.OBJECT);
            return solution;
        };
        encoder.replaceString = replaceString || quoteString;
        var optimizer = encoder._getOptimizer('atob');
        return optimizer;
    }

    function createSolution(source, replacement, type, appendLength)
    {
        var solution = new JScrewIt.debug.Solution(source, replacement, type);
        if (appendLength !== undefined)
            solution.appendLength = appendLength;
        return solution;
    }

    // Creates solutions for the characters U+0080, U+0081, ... with the specified append lengths.
    function createSolutions()
    {
        var solutions = [];
        for (var index = 0; index < arguments.length; index++)
        {
            var source = String.fromCharCode(0x80 + index);
            var solution =
            createSolution(source, undefined, SolutionType.STRING, arguments[index]);
            solutions.push(solution);
        }
        return solutions;
    }

    function quoteString(str)
    {
        var replacement = '"' + str + '"';
        return replacement;
    }

    var JScrewIt =
    typeof module !== 'undefined' ? require('../../node-jscrewit-test') : self.JScrewIt;

    var SolutionType = JScrewIt.debug.SolutionType;

    // A 26-character replacement.
    // The shortest conceivable cluster has an append length of 26 + 3 = 29, so the estimated append
    // length of a clusterable character is 29 / 8 | 0 = 3.
    var ATOB_REPLACEMENT = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var MIN_ATOB_CHAR_APPEND_LENGTH = 3;

    // The bytes 0x80, 0x81 and 0x82 encode to the base64 string "gIGC"; with the stubbed string
    // replacement, a cluster of these three characters has an append length of 26 + 1 + 6 + 1 + 1 =
    // 35.
    // The bytes 0x80 and 0x81 encode to any of the base64 strings "gIE", "gIF", "gIG" and "gIH":
    // the preoptimized definition for the last character yields "gIF".
    // A cluster of these two characters has an append length of 26 + 1 + 5 + 1 + 1 = 34.
    var EXPECTED_TRIPLE_REPLACEMENT   = ATOB_REPLACEMENT + '("gIGC")';
    var EXPECTED_PAIR_REPLACEMENT     = ATOB_REPLACEMENT + '("gIF")';

    // A character out of the atob-replaceable range.
    var SOLUTION_HIGH = createSolution('Ā', undefined, SolutionType.STRING, 20);

    describe
    (
        '`atob` optimizer',
        function ()
        {
            describe
            (
                '#appendLengthOf',
                function ()
                {
                    it
                    (
                        'optimizes a character in the range U+0000 to U+00FF',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solution = createSolutions(20)[0];
                            var actual = optimizer.appendLengthOf(solution);
                            expect(actual).toBe(MIN_ATOB_CHAR_APPEND_LENGTH);
                        }
                    );
                    it
                    (
                        'does not optimize a character out of the range U+0000 to U+00FF',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var actual = optimizer.appendLengthOf(SOLUTION_HIGH);
                            expect(actual).toBeUndefined();
                        }
                    );
                    it
                    (
                        'does not optimize a solution without a single-character source',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solution = createSolution('ab', undefined, SolutionType.STRING);
                            var actual = optimizer.appendLengthOf(solution);
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
                        'optimizes three atob-replaceable characters',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solutions = createSolutions(20, 20, 20);
                            optimizeSolutions([optimizer], solutions, false, false);
                            expect(solutions.length).toBe(1);
                            expect(solutions[0].replacement).toBe(EXPECTED_TRIPLE_REPLACEMENT);
                            expect(solutions[0].type).toBe(SolutionType.STRING);
                        }
                    );
                    it
                    (
                        'optimizes two atob-replaceable characters',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solutions = createSolutions(20, 20);
                            optimizeSolutions([optimizer], solutions, false, false);
                            expect(solutions.length).toBe(1);
                            expect(solutions[0].replacement).toBe(EXPECTED_PAIR_REPLACEMENT);
                            expect(solutions[0].type).toBe(SolutionType.STRING);
                        }
                    );
                    it
                    (
                        'uses only the first character of a longer preoptimized definition',
                        function ()
                        {
                            // The low nibble of 0x87 selects the definition "false", of which only
                            // the "f" is used: the bytes 0x80 and 0x87 encode to "gIf".
                            var optimizer = createOptimizer();
                            var solutions = createSolutions(20);
                            solutions.push
                            (createSolution('\x87', undefined, SolutionType.STRING, 20));
                            optimizeSolutions([optimizer], solutions, false, false);
                            expect(solutions.length).toBe(1);
                            expect(solutions[0].replacement).toBe(ATOB_REPLACEMENT + '("gIf")');
                        }
                    );
                    it
                    (
                        'optimizes four atob-replaceable characters',
                        function ()
                        {
                            // The trailing byte 0x83 is encoded by "g" and a character whose four
                            // lowest bits are ignored: "0" is the cheapest one.
                            var optimizer = createOptimizer();
                            var solutions = createSolutions(20, 20, 20, 20);
                            optimizeSolutions([optimizer], solutions, false, false);
                            expect(solutions.length).toBe(1);
                            expect(solutions[0].replacement).toBe(ATOB_REPLACEMENT + '("gIGCg0")');
                        }
                    );
                    it
                    (
                        'uses the cheapest character for a single trailing byte',
                        function ()
                        {
                            // The two highest bits of 0x82 select "t".
                            var optimizer = createOptimizer();
                            var solutions = createSolutions(20, 20, 20);
                            solutions.push
                            (createSolution('\x82', undefined, SolutionType.STRING, 20));
                            optimizeSolutions([optimizer], solutions, false, false);
                            expect(solutions.length).toBe(1);
                            expect(solutions[0].replacement).toBe(ATOB_REPLACEMENT + '("gIGCgt")');
                        }
                    );
                    it
                    (
                        'optimizes up to eight characters at a time',
                        function ()
                        {
                            // Nine characters cannot be clustered together: the best selection is a
                            // cluster of eight followed by the single character, which is the
                            // cheapest one to leave out.
                            var optimizer = createOptimizer();
                            var solutions = createSolutions(20, 20, 20, 20, 20, 20, 20, 20, 10);
                            optimizeSolutions([optimizer], solutions, false, false);
                            expect(solutions.length).toBe(2);
                            expect(solutions[0].replacement)
                            .toBe(ATOB_REPLACEMENT + '("gIGCg4SFhof")');
                            expect(solutions[1].source).toBe('\x88');
                        }
                    );
                    it
                    (
                        'optimizes two characters when the cluster of three is not shorter',
                        function ()
                        {
                            // Four-character base64 strings get a long replacement, so that the
                            // cluster of three characters is not worth applying.
                            var optimizer =
                            createOptimizer
                            (
                                function (str)
                                {
                                    var replacement = quoteString(str);
                                    if (str.length === 4)
                                        replacement += '+[]+[]+[]+[]+[]+[]+[]+[]';
                                    return replacement;
                                }
                            );
                            var solutions = createSolutions(20, 20, 5);
                            optimizeSolutions([optimizer], solutions, false, false);
                            expect(solutions.length).toBe(2);
                            expect(solutions[0].replacement).toBe(EXPECTED_PAIR_REPLACEMENT);
                            expect(solutions[1].source).toBe('\x82');
                        }
                    );
                    it
                    (
                        'does not optimize when the cluster is not shorter',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            // The discrete append length of 30 is enough to resolve the cluster of
                            // three characters, which turns out to be longer.
                            var solutions = createSolutions(10, 10, 10);
                            optimizeSolutions([optimizer], solutions, false, false);
                            expect(solutions.length).toBe(3);
                        }
                    );
                    it
                    (
                        'resolves the base64 argument only when the cluster could be shorter',
                        function ()
                        {
                            var replaceStringCalls;
                            var optimizer =
                            createOptimizer
                            (
                                function (str)
                                {
                                    replaceStringCalls++;
                                    var replacement = quoteString(str);
                                    return replacement;
                                }
                            );
                            var solutions;

                            // A discrete append length of 27 cannot beat the shortest conceivable
                            // cluster of 29, even with the bonding bonus of 2.
                            replaceStringCalls = 0;
                            solutions = createSolutions(9, 9, 9);
                            optimizeSolutions([optimizer], solutions, false, false);
                            expect(replaceStringCalls).toBe(0);
                            expect(solutions.length).toBe(3);

                            // A discrete append length of 28 could beat it with the bonding bonus:
                            // only the cluster of three characters is resolved.
                            replaceStringCalls = 0;
                            solutions = createSolutions(9, 9, 10);
                            optimizeSolutions([optimizer], solutions, false, false);
                            expect(replaceStringCalls).toBe(1);
                            expect(solutions.length).toBe(3);

                            // The same applies to clusters of two characters.
                            replaceStringCalls = 0;
                            solutions = createSolutions(13, 14);
                            optimizeSolutions([optimizer], solutions, false, false);
                            expect(replaceStringCalls).toBe(0);
                            expect(solutions.length).toBe(2);

                            replaceStringCalls = 0;
                            solutions = createSolutions(14, 14);
                            optimizeSolutions([optimizer], solutions, false, false);
                            expect(replaceStringCalls).toBe(1);
                            expect(solutions.length).toBe(2);
                        }
                    );
                    it
                    (
                        'caches the length of the base64 argument across groups',
                        function ()
                        {
                            var replaceStringCalls = 0;
                            var optimizer =
                            createOptimizer
                            (
                                function (str)
                                {
                                    replaceStringCalls++;
                                    var replacement = quoteString(str);
                                    return replacement;
                                }
                            );
                            // The same two characters are considered in two groups, but only
                            // resolved once, since they are not clustered.
                            optimizeSolutions([optimizer], createSolutions(14, 14), false, false);
                            optimizeSolutions([optimizer], createSolutions(14, 14), false, false);
                            expect(replaceStringCalls).toBe(1);
                        }
                    );
                    it
                    (
                        'builds the replacement of a cluster only when it is retained',
                        function ()
                        {
                            var replaceStringCalls = 0;
                            var optimizer =
                            createOptimizer
                            (
                                function (str)
                                {
                                    replaceStringCalls++;
                                    var replacement = quoteString(str);
                                    return replacement;
                                }
                            );
                            // Two candidates are resolved to compute their savings; only the
                            // retained cluster of three characters is resolved once more to build
                            // its replacement.
                            var solutions = createSolutions(20, 20, 20);
                            optimizeSolutions([optimizer], solutions, false, false);
                            expect(solutions.length).toBe(1);
                            expect(replaceStringCalls).toBe(4);
                        }
                    );
                    it
                    (
                        'does not optimize a character out of the range U+0000 to U+00FF',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solutions = createSolutions(20, 20, 20);
                            solutions[1] = SOLUTION_HIGH;
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
