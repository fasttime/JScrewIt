/* eslint-env ebdd/ebdd */
/* global expect, module, require, self */

'use strict';

(function ()
{
    function createCommaSolution()
    {
        var solution = JScrewIt.debug.createBridgeSolution('.concat');
        return solution;
    }

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
                bond,
                forceString,
                expectedStr0,
                expectedStr1,
                expectedStr2,
                expectedStr3,
                expectedStr4,
                expectedStr5
            )
            {
                it
                (
                    'encodes an empty string',
                    function ()
                    {
                        var buffer = createScrewBuffer(bond, forceString, 10, []);
                        verifyBuffer(buffer, expectedStr0, INITIAL_APPEND_LENGTH);
                    }
                );
                it
                (
                    'encodes a single string character',
                    function ()
                    {
                        var buffer = createScrewBuffer(bond, forceString, 10, []);
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
                        var buffer = createScrewBuffer(bond, forceString, 10, []);
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
                        var buffer = createScrewBuffer(bond, forceString, 10, []);
                        expect(buffer.append(solutionUndefined)).toBe(true);
                        var expectedLength = INITIAL_APPEND_LENGTH + solutionUndefined.appendLength;
                        verifyBuffer(buffer, expectedStr3, expectedLength);
                    }
                );
                it
                (
                    'encodes a string cluster',
                    function ()
                    {
                        var buffer = createScrewBuffer(bond, forceString, 10, [strTestOptimizer]);
                        expect(buffer.append(solutionA)).toBe(true);
                        expect(buffer.append(solutionA)).toBe(true);
                        verifyBuffer(buffer, expectedStr4, INITIAL_APPEND_LENGTH);
                    }
                );
                it
                (
                    'encodes a nonstring cluster',
                    function ()
                    {
                        var buffer = createScrewBuffer(bond, forceString, 10, [objTestOptimizer]);
                        expect(buffer.append(solutionA)).toBe(true);
                        expect(buffer.append(solutionA)).toBe(true);
                        verifyBuffer(buffer, expectedStr5, INITIAL_APPEND_LENGTH);
                    }
                );
            }

            var createScrewBuffer = JScrewIt.debug.createScrewBuffer;
            var Solution = JScrewIt.debug.Solution;
            var SolutionType = JScrewIt.debug.SolutionType;
            var solutionA = new Solution('a', '(![]+[])[+!![]]', SolutionType.STRING);
            var solution0 = new Solution('0', '+[]', SolutionType.WEAK_NUMERIC);
            var solutionFalse = new Solution('false', '![]', SolutionType.NUMERIC);
            var solutionComma = createCommaSolution();
            var solutionUndefined = new Solution('undefined', '[][[]]', SolutionType.UNDEFINED);
            var strTestOptimizer =
            createTestOptimizer(new Solution(undefined, '""', SolutionType.STRING));
            var objTestOptimizer =
            createTestOptimizer(new Solution(undefined, '{}', SolutionType.OBJECT));
            var paramDataList =
            [
                [
                    'without bonding or string forcing',
                    false,
                    false,
                    '[]',
                    '(![]+[])[+!![]]',
                    '+[]',
                    '[][[]]',
                    '""',
                    '{}',
                ],
                [
                    'with string forcing',
                    false,
                    true,
                    '[]+[]',
                    '(![]+[])[+!![]]',
                    '+[]+[]',
                    '[][[]]+[]',
                    '""',
                    '{}+[]',
                ],
                [
                    'with bonding',
                    true,
                    false,
                    '[]',
                    '(![]+[])[+!![]]',
                    '(+[])',
                    '[][[]]',
                    '""',
                    '{}',
                ],
                [
                    'with bonding and string forcing',
                    true,
                    true,
                    '([]+[])',
                    '(![]+[])[+!![]]',
                    '(+[]+[])',
                    '([][[]]+[])',
                    '""',
                    '({}+[])',
                ],
            ];

            describe.per(paramDataList)
            (
                '#[0]',
                function (paramData)
                {
                    testShortEncodings.apply(null, paramData);
                }
            );

            (function ()
            {
                var buffer = JScrewIt.debug.createScrewBuffer(false, true, 4, []);
                var expectedLength = INITIAL_APPEND_LENGTH;

                it
                (
                    'encodes a string in a single group',
                    function ()
                    {
                        expect(buffer.append(solutionA)).toBe(true);
                        expect(buffer.append(solution0)).toBe(true);
                        expect(buffer.append(solution0)).toBe(true);
                        expect(buffer.append(solution0)).toBe(true);
                        expectedLength += solutionA.appendLength + 3 * solution0.appendLength;
                        verifyBuffer(buffer, '(![]+[])[+!![]]+(+[])+(+[])+(+[])', expectedLength);
                    }
                );
                it
                (
                    'encodes a string in two groups',
                    function ()
                    {
                        expect(buffer.append(solutionFalse)).toBe(true);
                        expect(buffer.append(solutionFalse)).toBe(true);
                        expectedLength += 2 * solutionFalse.appendLength;
                        verifyBuffer
                        (
                            buffer,
                            '(![]+[])[+!![]]+(+[])+(+[])+(+[]+[![]]+![])',
                            expectedLength
                        );
                    }
                );
                it
                (
                    'encodes a string in nested groups',
                    function ()
                    {
                        expect(buffer.append(solutionFalse)).toBe(true);
                        expectedLength += solutionFalse.appendLength;
                        verifyBuffer
                        (
                            buffer,
                            '(![]+[])[+!![]]+(+[])+(+[])+(+[]+[![]]+(![]+[![]]))',
                            expectedLength
                        );
                    }
                );
                it
                (
                    'encodes a string with the largest possible number of elements',
                    function ()
                    {
                        expect(buffer.append(solutionFalse)).toBe(true);
                        expectedLength += solutionFalse.appendLength;
                        verifyBuffer
                        (
                            buffer,
                            '(![]+[])[+!![]]+(+[])+(+[]+[+[]])+(![]+[![]]+(![]+[![]]))',
                            expectedLength
                        );
                    }
                );
                it
                (
                    'does not encode a string with too many elements',
                    function ()
                    {
                        expect(buffer.append(solutionFalse)).toBe(false);
                        verifyBuffer
                        (
                            buffer,
                            '(![]+[])[+!![]]+(+[])+(+[]+[+[]])+(![]+[![]]+(![]+[![]]))',
                            expectedLength
                        );
                    }
                );
            }
            )();

            it
            (
                'encodes a weak numeric type solution with an undefined type solution',
                function ()
                {
                    var buffer = createScrewBuffer(false, false, 4, []);
                    buffer.append(solution0);
                    buffer.append(solutionUndefined);
                    var expectedLength =
                    INITIAL_APPEND_LENGTH + solution0.appendLength + solutionUndefined.appendLength;
                    verifyBuffer(buffer, '[+[]]+[][[]]', expectedLength);
                }
            );
            it
            (
                'encodes two undefined type solutions',
                function ()
                {
                    var buffer = createScrewBuffer(false, false, 4, []);
                    buffer.append(solutionUndefined);
                    buffer.append(solutionUndefined);
                    var expectedLength = INITIAL_APPEND_LENGTH + 2 * solutionUndefined.appendLength;
                    verifyBuffer(buffer, '[][[]]+[]+[][[]]', expectedLength);
                }
            );
            it
            (
                'encodes a string with incomplete groups',
                function ()
                {
                    var buffer = createScrewBuffer(false, true, 7, []);
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
                'encodes a string with multiple bridges',
                function ()
                {
                    var buffer = createScrewBuffer(false, true, 4, []);
                    for (var index = 0; index < 5; ++index)
                        buffer.append(solutionComma);
                    var expectedLength = INITIAL_APPEND_LENGTH + 5 * solutionComma.appendLength;
                    verifyBuffer
                    (
                        buffer,
                        '[[]].concat([[]]).concat([[]]).concat([[]])+' +
                        '[[]].concat([[]]).concat([[]])',
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
                    var buffer = createScrewBuffer(false, false, 10, [optimizer]);
                    buffer.append(solutionA);
                    expect(buffer.length).toBe(INITIAL_APPEND_LENGTH + solutionA.appendLength);
                }
            );
            describe
            (
                'length does not exceed string length when joining solutions with outer plus',
                function ()
                {
                    it
                    (
                        'without a bridge',
                        function ()
                        {
                            var buffer = createScrewBuffer(false, false, 4, []);
                            buffer.append(solution0);
                            buffer.append(solution0);
                            expect(buffer.length).not.toBeGreaterThan(buffer.toString().length);
                        }
                    );
                    it
                    (
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
        }
    );
}
)();
