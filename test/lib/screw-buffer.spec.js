/* eslint-env ebdd/ebdd */
/* global expect, module, require, self */

'use strict';

(function ()
{
    var SCREW_NORMAL             = 0;
    var SCREW_AS_STRING          = 1;
    var SCREW_AS_BONDED_STRING   = 2;

    function createTestOptimizer(solution)
    {
        var clusterer =
        function ()
        {
            return solution;
        };
        var optimizer =
        {
            appendLengthOf:
            function ()
            {
                return 0;
            },
            optimizeSolutions:
            function (plan)
            {
                plan.addCluster(0, 2, clusterer, 1);
            },
        };
        return optimizer;
    }

    function verifyBuffer(buffer, expectedStr, expectedLength)
    {
        var actualLength = buffer.length;
        expect(actualLength).toBe(expectedLength);
        expect(String(buffer)).toBe(expectedStr);
    }

    var INITIAL_APPEND_LENGTH = -3;

    var JScrewIt = typeof module !== 'undefined' ? require('../node-jscrewit-test') : self.JScrewIt;

    describe
    (
        'ScrewBuffer',
        function ()
        {
            function testShortEncodings
            (
                description,
                screwMode,
                expectedStr0,
                expectedStr1,
                expectedStr2,
                expectedStr3,
                expectedStr4,
                expectedStr5,
                expectedStr6
            )
            {
                it
                (
                    'encodes an empty string',
                    function ()
                    {
                        var buffer = createScrewBuffer(screwMode, 10, []);
                        verifyBuffer(buffer, expectedStr0, INITIAL_APPEND_LENGTH);
                    }
                );
                it
                (
                    'encodes a single string character',
                    function ()
                    {
                        var buffer = createScrewBuffer(screwMode, 10, []);
                        expect(buffer.append(solutionA)).toBe(true);
                        var expectedLength = INITIAL_APPEND_LENGTH + solutionA.appendLength;
                        verifyBuffer(buffer, expectedStr1, expectedLength);
                    }
                );
                it
                (
                    'encodes a single nonstring character',
                    function ()
                    {
                        var buffer = createScrewBuffer(screwMode, 10, []);
                        expect(buffer.append(solution0)).toBe(true);
                        var expectedLength = INITIAL_APPEND_LENGTH + solution0.appendLength;
                        verifyBuffer(buffer, expectedStr2, expectedLength);
                    }
                );
                it
                (
                    'encodes undefined',
                    function ()
                    {
                        var buffer = createScrewBuffer(screwMode, 10, []);
                        expect(buffer.append(solutionUndefined)).toBe(true);
                        var expectedLength = INITIAL_APPEND_LENGTH + solutionUndefined.appendLength;
                        verifyBuffer(buffer, expectedStr3, expectedLength);
                    }
                );
                it
                (
                    'encodes a loose string',
                    function ()
                    {
                        var buffer = createScrewBuffer(screwMode, 10, []);
                        expect(buffer.append(solution0False)).toBe(true);
                        var expectedLength = INITIAL_APPEND_LENGTH + solution0False.appendLength;
                        verifyBuffer(buffer, expectedStr4, expectedLength);
                    }
                );
                it
                (
                    'encodes a string cluster',
                    function ()
                    {
                        var buffer = createScrewBuffer(screwMode, 10, [strTestOptimizer]);
                        expect(buffer.append(solutionA)).toBe(true);
                        expect(buffer.append(solutionA)).toBe(true);
                        verifyBuffer(buffer, expectedStr5, INITIAL_APPEND_LENGTH);
                    }
                );
                it
                (
                    'encodes a nonstring cluster',
                    function ()
                    {
                        var buffer = createScrewBuffer(screwMode, 10, [objTestOptimizer]);
                        expect(buffer.append(solutionA)).toBe(true);
                        expect(buffer.append(solutionA)).toBe(true);
                        verifyBuffer(buffer, expectedStr6, INITIAL_APPEND_LENGTH);
                    }
                );
            }

            var createScrewBuffer = JScrewIt.debug.createScrewBuffer;
            var Solution = JScrewIt.debug.Solution;
            var SolutionType = JScrewIt.debug.SolutionType;
            var solutionA = new Solution('a', '(![]+[])[+!![]]', SolutionType.STRING);
            var solution0 = new Solution('0', '+[]', SolutionType.WEAK_NUMERIC);
            var solution00 = new Solution('00', '+[]+[+[]]', SolutionType.WEAK_PREFIXED_STRING);
            var solution0False = new Solution('0false', '[+[]]+![]', SolutionType.COMBINED_STRING);
            var solutionFalse = new Solution('false', '![]', SolutionType.NUMERIC);
            var solutionFalse0 = new Solution('false0', '![]+[+[]]', SolutionType.PREFIXED_STRING);
            var solutionUndefined = new Solution('undefined', '[][[]]', SolutionType.UNDEFINED);
            var strTestOptimizer =
            createTestOptimizer(new Solution(undefined, '""', SolutionType.STRING));
            var objTestOptimizer =
            createTestOptimizer(new Solution(undefined, '{}', SolutionType.OBJECT));

            var shortEncodingsParamDataList =
            [
                [
                    'in normal mode',
                    SCREW_NORMAL,
                    '[]',
                    '(![]+[])[+!![]]',
                    '+[]',
                    '[][[]]',
                    '[+[]]+![]',
                    '""',
                    '{}',
                ],
                [
                    'in force string mode',
                    SCREW_AS_STRING,
                    '[]+[]',
                    '(![]+[])[+!![]]',
                    '+[]+[]',
                    '[][[]]+[]',
                    '[+[]]+![]',
                    '""',
                    '{}+[]',
                ],
                [
                    'in force bonded string mode',
                    SCREW_AS_BONDED_STRING,
                    '([]+[])',
                    '(![]+[])[+!![]]',
                    '(+[]+[])',
                    '([][[]]+[])',
                    '([+[]]+![])',
                    '""',
                    '({}+[])',
                ],
            ];
            describe.per(shortEncodingsParamDataList)
            (
                '#[0]',
                function (paramData)
                {
                    testShortEncodings.apply(null, paramData);
                }
            );

            (function ()
            {
                function appendSolutions(index)
                {
                    while (nextIndex <= index)
                    {
                        switch (nextIndex++)
                        {
                        case 0:
                            expect(buffer.append(solutionA)).toBe(true);
                            expect(buffer.append(solution0)).toBe(true);
                            expect(buffer.append(solution0)).toBe(true);
                            expect(buffer.append(solution0)).toBe(true);
                            expectedLength += solutionA.appendLength + 3 * solution0.appendLength;
                            break;
                        case 1:
                            expect(buffer.append(solutionFalse)).toBe(true);
                            expect(buffer.append(solutionFalse)).toBe(true);
                            expectedLength += 2 * solutionFalse.appendLength;
                            break;
                        case 2:
                        case 3:
                            expect(buffer.append(solutionFalse)).toBe(true);
                            expectedLength += solutionFalse.appendLength;
                            break;
                        case 4:
                            expect(buffer.append(solutionFalse)).toBe(false);
                            break;
                        }
                    }
                }

                var buffer = JScrewIt.debug.createScrewBuffer(SCREW_AS_STRING, 4, []);
                var expectedLength = INITIAL_APPEND_LENGTH;
                var nextIndex = 0;

                it
                (
                    'encodes a string in a single group',
                    function ()
                    {
                        appendSolutions(0);
                        verifyBuffer(buffer, '(![]+[])[+!![]]+(+[])+(+[])+(+[])', expectedLength);
                    }
                );
                it
                (
                    'encodes a string in two groups',
                    function ()
                    {
                        appendSolutions(1);
                        verifyBuffer
                        (
                            buffer,
                            '(![]+[])[+!![]]+(+[])+(+[])+([+[]]+![]+![])',
                            expectedLength
                        );
                    }
                );
                it
                (
                    'encodes a string in nested groups',
                    function ()
                    {
                        appendSolutions(2);
                        verifyBuffer
                        (
                            buffer,
                            '(![]+[])[+!![]]+(+[])+(+[])+([+[]]+![]+([![]]+![]))',
                            expectedLength
                        );
                    }
                );
                it
                (
                    'encodes a string with the largest possible number of elements',
                    function ()
                    {
                        appendSolutions(3);
                        verifyBuffer
                        (
                            buffer,
                            '(![]+[])[+!![]]+(+[])+(+[]+[+[]])+([![]]+![]+([![]]+![]))',
                            expectedLength
                        );
                    }
                );
                it
                (
                    'does not encode a string with too many elements',
                    function ()
                    {
                        appendSolutions(4);
                        verifyBuffer
                        (
                            buffer,
                            '(![]+[])[+!![]]+(+[])+(+[]+[+[]])+([![]]+![]+([![]]+![]))',
                            expectedLength
                        );
                    }
                );
            }
            )();

            var concatParamDataList =
            [
                {
                    title:
                    'encodes a weak numeric type solution followed by an undefined type solution',
                    solutions: [solution0, solutionUndefined],
                    expectedReplacement: '[+[]]+[][[]]',
                },
                {
                    title: 'encodes two undefined type solutions',
                    solutions: [solutionUndefined, solutionUndefined],
                    expectedReplacement: '[]+[][[]]+[][[]]',
                },
                {
                    title:
                    'encodes an undefined type solution followed by a prefixed string type ' +
                    'solution',
                    solutions: [solutionUndefined, solutionFalse0],
                    expectedReplacement: '[][[]]+(![]+[+[]])',
                },
                {
                    title:
                    'encodes a numeric type solution followed by a string type solution',
                    solutions: [solutionFalse, solutionA],
                    expectedReplacement: '![]+(![]+[])[+!![]]',
                },
                {
                    title:
                    'encodes two undefined type solutions followed by a weak numeric type solution',
                    solutions: [solutionUndefined, solutionUndefined, solution0],
                    expectedReplacement: '[][[]]+([][[]]+[+[]])',
                },
                {
                    title:
                    'encodes two undefined type solutions followed by a string type solution',
                    solutions: [solutionUndefined, solutionUndefined, solutionA],
                    expectedReplacement: '[][[]]+([][[]]+(![]+[])[+!![]])',
                },
                {
                    title:
                    'encodes two undefined type solutions followed by a weak prefixed string ' +
                    'type solution',
                    solutions: [solutionUndefined, solutionUndefined, solution00],
                    expectedReplacement: '[][[]]+([][[]]+(+[]+[+[]]))',
                },
            ];
            it.per(concatParamDataList)
            (
                '#.title',
                function (paramData)
                {
                    var buffer = createScrewBuffer(SCREW_NORMAL, 4, []);
                    var expectedLength = INITIAL_APPEND_LENGTH;
                    paramData.solutions.forEach
                    (
                        function (solution)
                        {
                            buffer.append(solution);
                            expectedLength += solution.appendLength;
                        }
                    );
                    verifyBuffer(buffer, paramData.expectedReplacement, expectedLength);
                }
            );
            it
            (
                'encodes a string with incomplete groups',
                function ()
                {
                    var buffer = createScrewBuffer(SCREW_AS_STRING, 7, []);
                    for (var index = 0; index < 26; ++index)
                    {
                        var solution =
                        new Solution
                        (undefined, String.fromCharCode(65 + index), SolutionType.OBJECT);
                        buffer.append(solution);
                    }
                    var expectedLength = INITIAL_APPEND_LENGTH + 26 * 2;
                    verifyBuffer
                    (
                        buffer,
                        'A+B+C+D+E+(F+G+H+I+J)+(K+L+M+N+(O+P+Q+R)+(S+T+U+V+(W+X+Y+Z)))',
                        expectedLength
                    );
                }
            );
            it
            (
                'considers the lowest append length when solutions are appended',
                function ()
                {
                    var optimizer =
                    {
                        appendLengthOf:
                        function ()
                        {
                            return solutionA.appendLength + 1;
                        },
                    };
                    var buffer = createScrewBuffer(SCREW_NORMAL, 10, [optimizer]);
                    buffer.append(solutionA);
                    expect(buffer.length).toBe(INITIAL_APPEND_LENGTH + solutionA.appendLength);
                }
            );
            it
            (
                'length does not exceed string length when joining solutions with outer plus',
                function ()
                {
                    var buffer = createScrewBuffer(SCREW_NORMAL, 4, []);
                    buffer.append(solution0);
                    buffer.append(solution0);
                    expect(buffer.length).not.toBeGreaterThan(buffer.toString().length);
                }
            );
            it
            (
                '#toString does not modify an empty screw buffer',
                function ()
                {
                    var buffer1 = createScrewBuffer(SCREW_NORMAL, 10, []);
                    var buffer2 = createScrewBuffer(SCREW_NORMAL, 10, []);
                    buffer1.toString();
                    buffer1.append(solution0);
                    buffer2.append(solution0);
                    expect(buffer1.toString()).toBe(buffer2.toString());
                }
            );
        }
    );
}
)();
