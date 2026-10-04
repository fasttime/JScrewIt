/* eslint-env ebdd/ebdd */
/* global expect, module, require, self */

'use strict';

(function ()
{
    function createOptimizer(appendLength, solutionType)
    {
        function resolve()
        {
            var solution =
            createSolution(appendLength, undefined, EXPECTED_REPLACEMENT, solutionType);
            return solution;
        }

        if (appendLength === undefined)
            appendLength = 60;
        var encoder = JScrewIt.debug.createEncoder();
        encoder.resolve             = resolve;
        encoder.resolveCharacter    = resolveCharacter;
        var optimizer = encoder._getOptimizer('complex', COMPLEX);
        return optimizer;
    }

    function createSolution(appendLength, source, replacement, type)
    {
        var solution = new JScrewIt.debug.Solution(source, replacement, type);
        solution.appendLength = appendLength;
        return solution;
    }

    function resolveCharacter(char)
    {
        var solution = SOLUTIONS[char];
        return solution;
    }

    var JScrewIt =
    typeof module !== 'undefined' ? require('../../node-jscrewit-test') : self.JScrewIt;
    var SolutionType = JScrewIt.debug.SolutionType;

    var COMPLEX = 'mCh';
    var EXPECTED_REPLACEMENT = '"mCh"';

    var SOLUTIONS =
    {
        C: createSolution(40, 'C', undefined, SolutionType.STRING),
        h: createSolution(15, 'h', undefined, SolutionType.STRING),
        m: createSolution(14, 'm', undefined, SolutionType.STRING),
        u: createSolution(17, 'u', undefined, SolutionType.STRING),
    };

    describe
    (
        '`complex` optimizer',
        function ()
        {
            it
            (
                'resolves the definition of the complex',
                function ()
                {
                    var resolveArgs;
                    var encoder = JScrewIt.debug.createEncoder();
                    encoder.resolve =
                    function ()
                    {
                        resolveArgs = arguments;
                        var solution =
                        createSolution(60, undefined, EXPECTED_REPLACEMENT, SolutionType.STRING);
                        return solution;
                    };
                    encoder.resolveCharacter = resolveCharacter;
                    encoder._getOptimizer('complex', COMPLEX);
                    var definition = JScrewIt.debug.getComplexEntry(COMPLEX).definition;
                    expect(resolveArgs.length).toBe(2);
                    expect(resolveArgs[0]).toBe(definition);
                    expect(resolveArgs[1]).toBe(COMPLEX);
                }
            );
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
                            expect(optimizer.appendLengthOf(SOLUTIONS.C)).toBe(31);
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
                            expect(optimizer.appendLengthOf(SOLUTIONS.h)).toBeUndefined();
                        }
                    );
                }
            );
            describe
            (
                '#optimizeSolutions',
                function ()
                {
                    var paramDataList =
                    [
                        [
                            'a string integral cluster without bonding or string forcing',
                            { complexAppendLength: 68 },
                        ],
                        [
                            'an object integral cluster without bonding or string forcing',
                            { complexAppendLength: 68, complexSolutionType: SolutionType.OBJECT },
                        ],
                        [
                            'an integral cluster with bonding',
                            { bond: true, complexAppendLength: 70 },
                        ],
                        [
                            'an integral object cluster with string forcing',
                            {
                                complexAppendLength:    65,
                                complexSolutionType:    SolutionType.OBJECT,
                                forceString:            true,
                            },
                        ],
                    ];
                    it.per(paramDataList)
                    (
                        'optimizes #[0]',
                        function (paramData)
                        {
                            var opt = paramData[1];
                            var complexAppendLength = opt.complexAppendLength;
                            var complexSolutionType = opt.complexSolutionType;
                            if (complexSolutionType == null)
                                complexSolutionType = SolutionType.STRING;
                            var solutions = [SOLUTIONS.m, SOLUTIONS.C, SOLUTIONS.h];
                            var bond = opt.bond;
                            var forceString = opt.forceString;
                            var optimizer =
                            createOptimizer(complexAppendLength, complexSolutionType);
                            solutions.forEach
                            (
                                function (solution)
                                {
                                    optimizer.appendLengthOf(solution);
                                }
                            );
                            JScrewIt.debug.optimizeSolutions
                            ([optimizer], solutions, bond, forceString);
                            expect(solutions.length).toBe(1);
                            expect(solutions[0].replacement).toBe(EXPECTED_REPLACEMENT);
                        }
                    );
                    it.per(paramDataList)
                    (
                        'does not optimize #[0]',
                        function (paramData)
                        {
                            var opt = paramData[1];
                            var complexAppendLength = (opt.complexAppendLength | 0) + 1;
                            var complexSolutionType = opt.complexSolutionType;
                            if (complexSolutionType == null)
                                complexSolutionType = SolutionType.STRING;
                            var solutions = [SOLUTIONS.m, SOLUTIONS.C, SOLUTIONS.h];
                            var bond = opt.bond;
                            var forceString = opt.forceString;
                            var optimizer =
                            createOptimizer(complexAppendLength, complexSolutionType);
                            solutions.forEach
                            (
                                function (solution)
                                {
                                    optimizer.appendLengthOf(solution);
                                }
                            );
                            JScrewIt.debug.optimizeSolutions
                            ([optimizer], solutions, bond, forceString);
                            expect(solutions.length).toBe(3);
                        }
                    );
                }
            );
        }
    );
}
)();
