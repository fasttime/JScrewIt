/* eslint-env mocha */
/* global expect, module, require, self */

(function ()
{
    'use strict';
    
    var LEVEL_NUMERIC   = -1;
    var LEVEL_OBJECT    = 0;
    var LEVEL_STRING    = 1;
    
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
            
            function test(buffer, expectedStr, tolerance)
            {
                var actualLength = buffer.length;
                var expectedLength = expectedStr.length;
                expect(actualLength).not.toBeGreaterThan(expectedLength);
                expect(actualLength).not.toBeLessThan(expectedLength - (tolerance ^ 0));
                expect(buffer + '').toBe(expectedStr);
            }
            
            function testShortEncodings(
                description,
                bond,
                forceString,
                expected0,
                expected1,
                expected2)
            {
                describe(
                    description,
                    function ()
                    {
                        it(
                            'encodes an empty string',
                            function ()
                            {
                                var buffer = createScrewBuffer(bond, forceString, 10);
                                test(buffer, expected0);
                            }
                        );
                        it(
                            'encodes a single string character',
                            function ()
                            {
                                var buffer = createScrewBuffer(bond, forceString, 10);
                                expect(buffer.append(solutionA)).toBe(true);
                                test(buffer, expected1);
                            }
                        );
                        it(
                            'encodes a single nonstring character',
                            function ()
                            {
                                var buffer = createScrewBuffer(bond, forceString, 10);
                                expect(buffer.append(solution0)).toBe(true);
                                test(buffer, expected2);
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
            
            describe(
                'length does not exceed string length when joining solutions with outer plus',
                function ()
                {
                    it(
                        'without a bridge',
                        function ()
                        {
                            var buffer = createScrewBuffer(false, false, 4);
                            buffer.append(solution0);
                            buffer.append(solution0);
                            expect(buffer.length).not.toBeGreaterThan(buffer.toString().length);
                        }
                    );
                    it(
                        'with a bridge',
                        function ()
                        {
                            var buffer = createScrewBuffer(true, false, 4);
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
                '+[]'
            );
            
            testShortEncodings(
                'with no bond and string forcing',
                false,
                true,
                '[]+[]',
                '[![]+[]][+[]]',
                '+[]+[]'
            );
            
            testShortEncodings(
                'with bond and no string forcing',
                true,
                false,
                '[]',
                '[![]+[]][+[]]',
                '+[]'
            );
            
            testShortEncodings(
                'with bond and string forcing',
                true,
                true,
                '([]+[])',
                '[![]+[]][+[]]',
                '(+[]+[])'
            );
             
            (function ()
            {
                var buffer = JScrewIt.debug.createScrewBuffer(false, true, 4);
                
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
                'encodes a string with incomplete groups',
                function ()
                {
                    var buffer = createScrewBuffer(false, true, 7);
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
                    var optimizer =
                    {
                        optimizeAppendLength: function (solution)
                        {
                            return solution.appendLength;
                        },
                        optimizeSolutions: function ()
                        { }
                    };
                    var buffer = createScrewBuffer(false, true, 4, optimizer);
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
        }
    );
}
)();
