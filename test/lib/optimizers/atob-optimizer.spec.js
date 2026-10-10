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
    // The shortest possible cluster has an append length of 26 + 3 = 29, so the estimated append
    // length of a clusterable character is 29 / 8 | 0 = 3.
    var ATOB_REPLACEMENT = 'Function("return atob;")()';
    var MIN_ATOB_CHAR_APPEND_LENGTH = 3;

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

                    var paramDataList =
                    [
                        ['two',     [20, 20],           ATOB_REPLACEMENT + '("gIF")'],
                        ['three',   [20, 20, 20],       ATOB_REPLACEMENT + '("gIGC")'],
                        ['four',    [20, 20, 20, 20],   ATOB_REPLACEMENT + '("gIGCg0")'],
                    ];
                    it.per(paramDataList)
                    (
                        'optimizes #[0] atob-replaceable characters',
                        function (paramData)
                        {
                            var appendLengths = paramData[1];
                            var expectedReplacement = paramData[2];
                            var optimizer = createOptimizer();
                            var solutions = createSolutions.apply(null, appendLengths);
                            optimizeSolutions([optimizer], solutions);
                            expect(solutions.length).toBe(1);
                            expect(solutions[0].replacement).toBe(expectedReplacement);
                            expect(solutions[0].type).toBe(SolutionType.STRING);
                        }
                    );
                    it
                    (
                        'uses only the first character of a longer preoptimized definition',
                        function ()
                        {
                            // The low nibble of 0x87 selects the definition "false", of which only
                            // the first letter "f" is used.
                            var optimizer = createOptimizer();
                            var solutions = createSolutions(20);
                            solutions.push
                            (createSolution('\x87', undefined, SolutionType.STRING, 20));
                            optimizeSolutions([optimizer], solutions);
                            expect(solutions.length).toBe(1);
                            expect(solutions[0].replacement).toBe(ATOB_REPLACEMENT + '("gIf")');
                        }
                    );
                    it
                    (
                        'uses the most convenient character for a single trailing byte',
                        function ()
                        {
                            // The two highest bits of 0x82 select "t".
                            var optimizer = createOptimizer();
                            var solutions = createSolutions(20, 20, 20);
                            solutions.push
                            (createSolution('\x82', undefined, SolutionType.STRING, 20));
                            optimizeSolutions([optimizer], solutions);
                            expect(solutions.length).toBe(1);
                            expect(solutions[0].replacement).toBe(ATOB_REPLACEMENT + '("gIGCgt")');
                        }
                    );
                    it
                    (
                        'optimizes up to eight characters at a time',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solutions = createSolutions(20, 20, 20, 20, 20, 20, 20, 20, 10);
                            optimizeSolutions([optimizer], solutions);
                            expect(solutions.length).toBe(2);
                            expect(solutions[0].replacement)
                            .toBe(ATOB_REPLACEMENT + '("gIGCg4SFhof")');
                            expect(solutions[1].source).toBe('\x88');
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

                            replaceStringCalls = 0;
                            solutions = createSolutions(9, 9, 9);
                            optimizeSolutions([optimizer], solutions);
                            expect(replaceStringCalls).toBe(0);
                            expect(solutions.length).toBe(3);

                            replaceStringCalls = 0;
                            solutions = createSolutions(9, 9, 10);
                            optimizeSolutions([optimizer], solutions);
                            expect(replaceStringCalls).toBe(1);
                            expect(solutions.length).toBe(3);

                            replaceStringCalls = 0;
                            solutions = createSolutions(13, 14);
                            optimizeSolutions([optimizer], solutions);
                            expect(replaceStringCalls).toBe(0);
                            expect(solutions.length).toBe(2);

                            replaceStringCalls = 0;
                            solutions = createSolutions(14, 14);
                            optimizeSolutions([optimizer], solutions);
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
                            optimizeSolutions([optimizer], createSolutions(14, 14));
                            optimizeSolutions([optimizer], createSolutions(14, 14));
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
                            // Three candidates are resolved to compute their savings: two
                            // clusters of two characters and one of three; only the retained
                            // cluster of three characters is resolved once more to build its
                            // replacement.
                            var solutions = createSolutions(20, 20, 20);
                            optimizeSolutions([optimizer], solutions);
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
                            optimizeSolutions([optimizer], solutions);
                            expect(solutions.length).toBe(3);
                        }
                    );
                }
            );
        }
    );
}
)();
