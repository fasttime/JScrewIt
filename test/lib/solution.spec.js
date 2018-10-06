/* eslint-env mocha */
/* global expect, module, require, self */

'use strict';

(function ()
{
    var JScrewIt = typeof module !== 'undefined' ? require('../node-jscrewit-test') : self.JScrewIt;
    var Solution = JScrewIt.debug.Solution;

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
                    var solution = new Solution('+[]');
                    expect(solution.hasOuterPlus).toBe(true);
                }
            );
            it
            (
                'true for middle plus',
                function ()
                {
                    var solution = new Solution('[]+[]');
                    expect(solution.hasOuterPlus).toBe(true);
                }
            );
            it
            (
                'false for inner plus',
                function ()
                {
                    var solution = new Solution('(+[])');
                    expect(solution.hasOuterPlus).toBe(false);
                }
            );
            it
            (
                'false for leading !+',
                function ()
                {
                    var solution = new Solution('!+[]');
                    expect(solution.hasOuterPlus).toBe(false);
                }
            );
            it
            (
                'cached upon creation',
                function ()
                {
                    var solution = new Solution('', undefined, true);
                    expect(solution.hasOwnProperty('hasOuterPlus')).toBeTruthy();
                    expect(solution.hasOuterPlus).toBe(true);
                }
            );
            it
            (
                'cached upon first access',
                function ()
                {
                    var solution = new Solution('+');
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
