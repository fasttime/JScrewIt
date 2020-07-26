/* eslint-env ebdd/ebdd */
/* global expect, module, require, self */

'use strict';

(function ()
{
    var JScrewIt = typeof module !== 'undefined' ? require('../node-jscrewit-test') : self.JScrewIt;
    var Solution = JScrewIt.debug.Solution;

    it
    (
        'Solution.name is Solution',
        function ()
        {
            expect(Solution.name).toBe('Solution');
        }
    );
}
)();
