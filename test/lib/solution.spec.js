/* eslint-env ebdd/ebdd */
/* global expect, module, require, self */

'use strict';

(function ()
{
    var JScrewIt = typeof module !== 'undefined' ? require('../node-jscrewit-test') : self.JScrewIt;
    var Solution = JScrewIt.debug.Solution;

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
                    var solution = new Solution('0', '+[]');
                    expect(solution.hasOuterPlus).toBe(true);
                }
            );
            it
            (
                'true for middle plus',
                function ()
                {
                    var solution = new Solution('', '[]+[]');
                    expect(solution.hasOuterPlus).toBe(true);
                }
            );
            it
            (
                'false for inner plus',
                function ()
                {
                    var solution = new Solution('0', '(+[])');
                    expect(solution.hasOuterPlus).toBe(false);
                }
            );
            it
            (
                'false for leading !+',
                function ()
                {
                    var solution = new Solution('true', '!+[]');
                    expect(solution.hasOuterPlus).toBe(false);
                }
            );
            it
            (
                'cached upon creation',
                function ()
                {
                    var solution = new Solution('', '', undefined, true);
                    expect(solution.hasOwnProperty('hasOuterPlus')).toBeTruthy();
                    expect(solution.hasOuterPlus).toBe(true);
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
