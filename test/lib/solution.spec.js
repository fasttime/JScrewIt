/* eslint-env ebdd/ebdd */
/* global expect, module, require, self */

'use strict';

(function ()
{
    var JScrewIt = typeof module !== 'undefined' ? require('../node-jscrewit-test') : self.JScrewIt;
    var Solution = JScrewIt.debug.Solution;
    var SolutionType = JScrewIt.debug.SolutionType;

    it
    (
        'Solution#constructor is Solution',
        function ()
        {
            expect(Solution.prototype.constructor).toBe(Solution);
        }
    );

    describe
    (
        'Solution#hasOuterPlus is',
        function ()
        {
            it
            (
                'true for leading plus',
                function ()
                {
                    var solution = new Solution('0', '+[]', SolutionType.WEAK_NUMERIC);
                    expect(solution.hasOuterPlus).toBe(true);
                }
            );
            it
            (
                'true for middle plus',
                function ()
                {
                    var solution = new Solution('', '[]+[]', SolutionType.STRING);
                    expect(solution.hasOuterPlus).toBe(true);
                }
            );
            it
            (
                'true for trailing double plus',
                function ()
                {
                    var solution = new Solution('', '[][[]]++', SolutionType.NUMERIC);
                    expect(solution.hasOuterPlus).toBe(true);
                }
            );
            it
            (
                'false for inner plus',
                function ()
                {
                    var solution = new Solution('0', '(+[])', SolutionType.NUMERIC);
                    expect(solution.hasOuterPlus).toBe(false);
                }
            );
            it
            (
                'false for leading !+',
                function ()
                {
                    var solution = new Solution('true', '!+[]', SolutionType.NUMERIC);
                    expect(solution.hasOuterPlus).toBe(false);
                }
            );
            it
            (
                'false for leading !!+',
                function ()
                {
                    var solution =
                    new Solution('false', '!!+[]', SolutionType.NUMERIC);
                    expect(solution.hasOuterPlus).toBe(false);
                }
            );
            it
            (
                'cached upon first access',
                function ()
                {
                    var solution = new Solution(undefined, '+');
                    expect(solution.hasOwnProperty('hasOuterPlus')).toBeFalsy();
                    void solution.hasOuterPlus;
                    expect(solution.hasOwnProperty('hasOuterPlus')).toBeTruthy();
                    expect(solution.hasOuterPlus).toBe(true);
                }
            );
        }
    );
}
)();
