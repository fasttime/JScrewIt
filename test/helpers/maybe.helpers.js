/* eslint-env mocha */
/* global global, self */

'use strict';

(function (global)
{
    function maybeDescribe(condition, description, fn)
    {
        (condition ? describe : describe.skip)(description, fn);
    }

    function maybeIt(condition, description, fn)
    {
        (condition ? it : it.skip)(description, fn);
    }

    global.maybeDescribe    = maybeDescribe;
    global.maybeIt          = maybeIt;
}
)(typeof self === 'undefined' ? global : self);
