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
        var optimizer = encoder._getOptimizer('shortcut', SHORTCUT);
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

    var EXPECTED_REPLACEMENT = '"mCh"';
    var SHORTCUT = 'mCh';

    var SOLUTIONS =
    {
        C: createSolution(40, 'C', undefined, SolutionType.STRING),
        h: createSolution(15, 'h', undefined, SolutionType.STRING),
        m: createSolution(14, 'm', undefined, SolutionType.STRING),
        u: createSolution(17, 'u', undefined, SolutionType.STRING),
    };

    describe
    (
        '`shortcut` optimizer',
        function ()
        {
            it
            (
                'resolves the definition of the shortcut',
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
                    encoder._getOptimizer('shortcut', SHORTCUT);
                    var definition = JScrewIt.debug.getShortcutEntry(SHORTCUT).definition;
                    expect(resolveArgs.length).toBe(2);
                    expect(resolveArgs[0]).toBe(definition);
                    expect(resolveArgs[1]).toBe(SHORTCUT);
                }
            );
            describe
            (
                '#appendLengthOf',
                function ()
                {
                    it
                    (
                        'optimizes characters that are part of the shortcut',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            expect(optimizer.appendLengthOf(SOLUTIONS.C)).toBe(31);
                        }
                    );
                    it
                    (
                        'does not optimize characters that are not part of the shortcut',
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
                            { shortcutAppendLength: 68 },
                        ],
                        [
                            'an object integral cluster without bonding or string forcing',
                            { shortcutAppendLength: 68, shortcutSolutionType: SolutionType.OBJECT },
                        ],
                        [
                            'an integral cluster with bonding',
                            { bond: true, shortcutAppendLength: 70 },
                        ],
                        [
                            'an integral object cluster with string forcing',
                            {
                                shortcutAppendLength:   65,
                                shortcutSolutionType:   SolutionType.OBJECT,
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
                            var shortcutAppendLength = opt.shortcutAppendLength;
                            var shortcutSolutionType = opt.shortcutSolutionType;
                            if (shortcutSolutionType == null)
                                shortcutSolutionType = SolutionType.STRING;
                            var solutions = [SOLUTIONS.m, SOLUTIONS.C, SOLUTIONS.h];
                            var bond = opt.bond;
                            var forceString = opt.forceString;
                            var optimizer =
                            createOptimizer(shortcutAppendLength, shortcutSolutionType);
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
                            var shortcutAppendLength = (opt.shortcutAppendLength | 0) + 1;
                            var shortcutSolutionType = opt.shortcutSolutionType;
                            if (shortcutSolutionType == null)
                                shortcutSolutionType = SolutionType.STRING;
                            var solutions = [SOLUTIONS.m, SOLUTIONS.C, SOLUTIONS.h];
                            var bond = opt.bond;
                            var forceString = opt.forceString;
                            var optimizer =
                            createOptimizer(shortcutAppendLength, shortcutSolutionType);
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
