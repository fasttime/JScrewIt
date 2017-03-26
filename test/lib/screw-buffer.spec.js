/* eslint-env mocha */
/* global expect, module, require, self */

(function ()
{
    'use strict';
    
    function createTestOptimizer(solution)
    {
        var clusterer =
            function ()
            {
                return solution;
            };
        var optimizer =
        {
            appendLengthOf: function ()
            {
                return 0;
            },
            optimizeSolutions: function (plan)
            {
                plan.addCluster(0, 2, clusterer, 1);
            }
        };
        return optimizer;
    }
    
    function test(buffer, expectedStr, tolerance)
    {
        var actualLength = buffer.length;
        var expectedLength = expectedStr.length;
        expect(actualLength).not.toBeGreaterThan(expectedLength);
        expect(actualLength).toBe(expectedLength - tolerance);
        expect(buffer + '').toBe(expectedStr);
    }
    
    var EMPTY_APPEND_LENGTH = 3;
    
    var LEVEL_NUMERIC   = -1;
    var LEVEL_OBJECT    = 0;
    var LEVEL_STRING    = 1;
    var LEVEL_UNDEFINED = -2;
    
    var JScrewIt = typeof module !== 'undefined' ? require('../node-jscrewit-test') : self.JScrewIt;
    
    describe(
        'ScrewBuffer',
        function ()
        {
            function createCommaSolution()
            {
                var solution = JScrewIt.debug.createBridgeSolution('.concat');
                return solution;
            }
            
            function testShortEncodings(
                description,
                bond,
                forceString,
                expected0,
                expected1,
                expected2,
                expected3,
                expected4)
            {
                describe(
                    description,
                    function ()
                    {
                        it(
                            'encodes an empty string',
                            function ()
                            {
                                var buffer = createScrewBuffer(bond, forceString, 10, []);
                                expect(buffer.length).toBe(-EMPTY_APPEND_LENGTH);
                                expect(buffer + '').toBe(expected0);
                            }
                        );
                        it(
                            'encodes a single string character',
                            function ()
                            {
                                var buffer = createScrewBuffer(bond, forceString, 10, []);
                                expect(buffer.append(solutionA)).toBe(true);
                                expect(buffer.length)
                                    .toBe(solutionA.appendLength - EMPTY_APPEND_LENGTH);
                                expect(buffer + '').toBe(expected1);
                            }
                        );
                        it(
                            'encodes a single nonstring character',
                            function ()
                            {
                                var buffer = createScrewBuffer(bond, forceString, 10, []);
                                expect(buffer.append(solution0)).toBe(true);
                                expect(buffer.length)
                                    .toBe(solution0.appendLength - EMPTY_APPEND_LENGTH);
                                expect(buffer + '').toBe(expected2);
                            }
                        );
                        it(
                            'encodes a string cluster',
                            function ()
                            {
                                var buffer =
                                    createScrewBuffer(bond, forceString, 10, [strTestOptimizer]);
                                expect(buffer.append(solutionA)).toBe(true);
                                expect(buffer.append(solutionA)).toBe(true);
                                expect(buffer.length).toBe(-EMPTY_APPEND_LENGTH);
                                expect(buffer + '').toBe(expected3);
                            }
                        );
                        it(
                            'encodes a nonstring cluster',
                            function ()
                            {
                                var buffer =
                                    createScrewBuffer(bond, forceString, 10, [objTestOptimizer]);
                                expect(buffer.append(solutionA)).toBe(true);
                                expect(buffer.append(solutionA)).toBe(true);
                                expect(buffer.length).toBe(-EMPTY_APPEND_LENGTH);
                                expect(buffer + '').toBe(expected4);
                            }
                        );
                    }
                );
            }
            
            var createScrewBuffer = JScrewIt.debug.createScrewBuffer;
            var solutionA = JScrewIt.debug.createSolution('[![]+[]][+[]]', LEVEL_STRING);
            var solution0 = JScrewIt.debug.createSolution('+[]', LEVEL_NUMERIC);
            var solutionFalse = JScrewIt.debug.createSolution('![]', LEVEL_NUMERIC);
            var solutionComma = createCommaSolution();
            var solutionUndefined = JScrewIt.debug.createSolution('[][[]]', LEVEL_UNDEFINED);
            var strTestOptimizer =
                createTestOptimizer(JScrewIt.debug.createSolution('""', LEVEL_STRING));
            var objTestOptimizer =
                createTestOptimizer(JScrewIt.debug.createSolution('{}', LEVEL_OBJECT));
            
            describe(
                'length does not exceed string length when joining solutions with outer plus',
                function ()
                {
                    it(
                        'without a bridge',
                        function ()
                        {
                            var buffer = createScrewBuffer(false, false, 4, []);
                            buffer.append(solution0);
                            buffer.append(solution0);
                            expect(buffer.length).not.toBeGreaterThan(buffer.toString().length);
                        }
                    );
                    it(
                        'with a bridge',
                        function ()
                        {
                            var buffer = createScrewBuffer(true, false, 4, []);
                            buffer.append(solution0);
                            buffer.append(solutionComma);
                            buffer.append(solution0);
                            expect(buffer.length).not.toBeGreaterThan(buffer.toString().length);
                        }
                    );
                }
            );
            
            testShortEncodings(
                'with no bond and no string forcing',
                false,
                false,
                '[]',
                '[![]+[]][+[]]',
                '+[]',
                '""',
                '{}'
            );
            
            testShortEncodings(
                'with no bond and string forcing',
                false,
                true,
                '[]+[]',
                '[![]+[]][+[]]',
                '+[]+[]',
                '""',
                '{}+[]'
            );
            
            testShortEncodings(
                'with bond and no string forcing',
                true,
                false,
                '[]',
                '[![]+[]][+[]]',
                '+[]',
                '""',
                '{}'
            );
            
            testShortEncodings(
                'with bond and string forcing',
                true,
                true,
                '([]+[])',
                '[![]+[]][+[]]',
                '(+[]+[])',
                '""',
                '({}+[])'
            );
            
            (function ()
            {
                var buffer = JScrewIt.debug.createScrewBuffer(false, true, 4, []);
                
                it(
                    'encodes a string in a single group',
                    function ()
                    {
                        expect(buffer.append(solutionA)).toBe(true);
                        expect(buffer.append(solution0)).toBe(true);
                        expect(buffer.append(solution0)).toBe(true);
                        expect(buffer.append(solution0)).toBe(true);
                        test(buffer, '[![]+[]][+[]]+(+[])+(+[])+(+[])', 2);
                    }
                );
                it(
                    'encodes a string in two groups',
                    function ()
                    {
                        expect(buffer.append(solutionFalse)).toBe(true);
                        expect(buffer.append(solutionFalse)).toBe(true);
                        test(buffer, '[![]+[]][+[]]+(+[])+(+[])+(+[]+[![]]+![])', 4);
                    }
                );
                it(
                    'encodes a string in nested groups',
                    function ()
                    {
                        expect(buffer.append(solutionFalse)).toBe(true);
                        test(
                            buffer,
                            '[![]+[]][+[]]+(+[])+(+[])+(+[]+[![]]+(![]+[![]]))',
                            8
                        );
                    }
                );
                it(
                    'encodes a string with the largest possible number of elements',
                    function ()
                    {
                        expect(buffer.append(solutionFalse)).toBe(true);
                        test(
                            buffer,
                            '[![]+[]][+[]]+(+[])+(+[]+[+[]])+(![]+[![]]+(![]+[![]]))',
                            10
                        );
                    }
                );
                it(
                    'does not encode a string with too many elements',
                    function ()
                    {
                        expect(buffer.append(solutionFalse)).toBe(false);
                        test(
                            buffer,
                            '[![]+[]][+[]]+(+[])+(+[]+[+[]])+(![]+[![]]+(![]+[![]]))',
                            10
                        );
                    }
                );
            })();
            it(
                'encodes a numeric level solution with an undefined level solution',
                function ()
                {
                    var buffer = createScrewBuffer(false, false, 4, []);
                    buffer.append(solution0);
                    buffer.append(solutionUndefined);
                    expect(buffer.length)
                        .toBe(
                            solution0.appendLength + solutionUndefined.appendLength -
                            EMPTY_APPEND_LENGTH
                        );
                    expect(buffer + '').toBe('[+[]]+[][[]]');
                }
            );
            it(
                'encodes two undefined level solutions',
                function ()
                {
                    var buffer = createScrewBuffer(false, false, 4, []);
                    buffer.append(solutionUndefined);
                    buffer.append(solutionUndefined);
                    expect(buffer.length)
                        .toBe(2 * solutionUndefined.appendLength - EMPTY_APPEND_LENGTH);
                    expect(buffer + '').toBe('[][[]]+[]+[][[]]');
                }
            );
            it(
                'encodes a string with incomplete groups',
                function ()
                {
                    var buffer = createScrewBuffer(false, true, 7, []);
                    for (var index = 0; index < 26; ++index)
                    {
                        var solution =
                            JScrewIt.debug.createSolution(
                                String.fromCharCode(65 + index),
                                LEVEL_OBJECT
                            );
                        buffer.append(solution);
                    }
                    test(
                        buffer,
                        'A+B+C+D+E+(F+G+H+I+J)+(K+L+M+N+(O+P+Q+R)+(S+T+U+V+(W+X+Y+Z)))',
                        12
                    );
                }
            );
            it(
                'encodes a string with multiple bridges',
                function ()
                {
                    var buffer = createScrewBuffer(false, true, 4, []);
                    for (var index = 0; index < 5; ++index)
                        buffer.append(solutionComma);
                    test(
                        buffer,
                        '[[]].concat([[]]).concat([[]]).concat([[]])+' +
                        '[[]].concat([[]]).concat([[]])',
                        47
                    );
                }
            );
            it(
                'considers the lowest append length when solutions are appended',
                function ()
                {
                    var optimizer =
                    {
                        appendLengthOf: function ()
                        {
                            return solutionA.appendLength + 1;
                        }
                    };
                    var buffer = createScrewBuffer(false, false, 10, [optimizer]);
                    buffer.append(solutionA);
                    expect(buffer.length).toBe(solutionA.appendLength - EMPTY_APPEND_LENGTH);
                }
            );
        }
    );
}
)();
