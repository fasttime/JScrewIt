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
            expect(constant).toBe('btoa');
            var solution = createSolution(undefined, BTOA_REPLACEMENT, SolutionType.OBJECT);
            return solution;
        };
        encoder.replaceString = replaceString || escapeString;
        var optimizer = encoder._getOptimizer('btoa');
        return optimizer;
    }

    function createSolution(source, replacement, type, appendLength)
    {
        var solution = new JScrewIt.debug.Solution(source, replacement, type);
        if (appendLength !== undefined)
            solution.appendLength = appendLength;
        return solution;
    }

    // Creates a solution for each character in the specified string.
    // The append lengths can be specified as a single number for all solutions or as an array with
    // one element for each solution.
    function createSolutions(chars, appendLengths)
    {
        var solutions = [];
        for (var index = 0; index < chars.length; index++)
        {
            var appendLength =
            typeof appendLengths === 'number' ? appendLengths : appendLengths[index];
            var solution =
            createSolution(chars[index], undefined, SolutionType.STRING, appendLength);
            solutions.push(solution);
        }
        return solutions;
    }

    // Quotes a string, escaping characters outside the printable ASCII range in the form "\xHH".
    function escapeString(str)
    {
        var replacement =
        '"' +
        str.replace
        (
            /[^ -~]/g,
            function (char)
            {
                var hex = ('0' + char.charCodeAt().toString(16)).slice(-2);
                return '\\x' + hex;
            }
        ) +
        '"';
        return replacement;
    }

    var JScrewIt =
    typeof module !== 'undefined' ? require('../../node-jscrewit-test') : self.JScrewIt;

    var SolutionType = JScrewIt.debug.SolutionType;

    // A 26-character replacement.
    // The shortest possible cluster has an append length of 26 + 3 = 29, so the estimated append
    // length of a clusterable character is 29 / 8 | 0 = 3.
    var BTOA_REPLACEMENT = 'Function("return btoa;")()';
    var MIN_BTOA_CHAR_APPEND_LENGTH = 3;

    describe
    (
        '`btoa` optimizer',
        function ()
        {
            describe
            (
                '#appendLengthOf',
                function ()
                {
                    it.per(['A', 'z', '0', '+', '/'])
                    (
                        'optimizes the base64 alphabet character #',
                        function (char)
                        {
                            var optimizer = createOptimizer();
                            var solution = createSolutions(char, 20)[0];
                            var actual = optimizer.appendLengthOf(solution);
                            expect(actual).toBe(MIN_BTOA_CHAR_APPEND_LENGTH);
                        }
                    );
                    it.per(['-', '=', ' ', 'Ā'])
                    (
                        'does not optimize the character #',
                        function (char)
                        {
                            var optimizer = createOptimizer();
                            var solution = createSolutions(char, 20)[0];
                            var actual = optimizer.appendLengthOf(solution);
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
                        ['four',    'SQRT',     BTOA_REPLACEMENT + '("I\\x04S")'],
                        ['eight',   'YWJjZGVm', BTOA_REPLACEMENT + '("abcdef")'],
                    ];
                    it.per(paramDataList)
                    (
                        'optimizes #[0] base64 alphabet characters',
                        function (paramData)
                        {
                            var chars = paramData[1];
                            var expectedReplacement = paramData[2];
                            var optimizer = createOptimizer();
                            var solutions = createSolutions(chars, 20);
                            optimizeSolutions([optimizer], solutions);
                            expect(solutions.length).toBe(1);
                            expect(solutions[0].source).toBe(chars);
                            expect(solutions[0].replacement).toBe(expectedReplacement);
                            expect(solutions[0].type).toBe(SolutionType.STRING);
                        }
                    );
                    it
                    (
                        'optimizes the characters "+" and "/"',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solutions = createSolutions('++//', 20);
                            optimizeSolutions([optimizer], solutions);
                            expect(solutions.length).toBe(1);
                            expect(solutions[0].replacement)
                            .toBe(BTOA_REPLACEMENT + '("\\xfb\\xef\\xff")');
                        }
                    );
                    it
                    (
                        'optimizes up to eight characters at a time',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solutions = createSolutions('YWJjZGVmA', 20);
                            optimizeSolutions([optimizer], solutions);
                            expect(solutions.length).toBe(2);
                            expect(solutions[0].replacement).toBe(BTOA_REPLACEMENT + '("abcdef")');
                            expect(solutions[1].source).toBe('A');
                        }
                    );
                    it
                    (
                        'does not optimize fewer than four characters',
                        function ()
                        {
                            var replaceStringCalls = 0;
                            var optimizer =
                            createOptimizer
                            (
                                function (str)
                                {
                                    replaceStringCalls++;
                                    var replacement = escapeString(str);
                                    return replacement;
                                }
                            );
                            var solutions = createSolutions('SQR', 20);
                            optimizeSolutions([optimizer], solutions);
                            expect(replaceStringCalls).toBe(0);
                            expect(solutions.length).toBe(3);
                        }
                    );
                    it
                    (
                        'optimizes only runs of four or eight characters',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solutions = createSolutions('SQRTUVW', 20);
                            optimizeSolutions([optimizer], solutions);
                            expect(solutions.length).toBe(4);
                        }
                    );
                    it
                    (
                        'resolves the argument only when the cluster could be shorter',
                        function ()
                        {
                            var replaceStringCalls;
                            var optimizer =
                            createOptimizer
                            (
                                function (str)
                                {
                                    replaceStringCalls++;
                                    var replacement = escapeString(str);
                                    return replacement;
                                }
                            );
                            var solutions;

                            replaceStringCalls = 0;
                            solutions = createSolutions('SQRT', [6, 7, 7, 7]);
                            optimizeSolutions([optimizer], solutions);
                            expect(replaceStringCalls).toBe(0);
                            expect(solutions.length).toBe(4);

                            replaceStringCalls = 0;
                            solutions = createSolutions('SQRT', [7, 7, 7, 7]);
                            optimizeSolutions([optimizer], solutions);
                            expect(replaceStringCalls).toBe(1);
                            expect(solutions.length).toBe(4);
                        }
                    );
                    it
                    (
                        'caches the length of the argument across groups',
                        function ()
                        {
                            var replaceStringCalls = 0;
                            var optimizer =
                            createOptimizer
                            (
                                function (str)
                                {
                                    replaceStringCalls++;
                                    var replacement = escapeString(str);
                                    return replacement;
                                }
                            );
                            optimizeSolutions([optimizer], createSolutions('SQRT', 7));
                            optimizeSolutions([optimizer], createSolutions('SQRT', 7));
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
                                    var replacement = escapeString(str);
                                    return replacement;
                                }
                            );
                            // Two candidates of four characters are resolved to compute their
                            // savings; only the retained one is resolved once more to build its
                            // replacement.
                            var solutions = createSolutions('SQRTU', 20);
                            optimizeSolutions([optimizer], solutions);
                            expect(solutions.length).toBe(2);
                            expect(replaceStringCalls).toBe(3);
                        }
                    );
                    it
                    (
                        'does not optimize a character out of the base64 alphabet',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solutions = createSolutions('SQ-T', 20);
                            optimizeSolutions([optimizer], solutions);
                            expect(solutions.length).toBe(4);
                        }
                    );
                    it
                    (
                        'does not optimize a solution without a single-character source',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solutions = createSolutions('SQR', 20);
                            solutions.push
                            (createSolution('true', undefined, SolutionType.STRING, 20));
                            optimizeSolutions([optimizer], solutions);
                            expect(solutions.length).toBe(4);
                        }
                    );
                }
            );
        }
    );
}
)();
