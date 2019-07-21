/* eslint-env mocha */
/* global global, self */

'use strict';

(function (global)
{
    var maybeDescribe =
    function (condition, description, fn)
    {
        (condition ? describe : describe.skip)(description, fn);
    };

    maybeDescribe.only =
    function (condition, description, fn)
    {
        (condition ? describe.only : describe.skip)(description, fn);
    };

    maybeDescribe.skip =
    function (condition, description, fn)
    {
        describe.skip(description, fn);
    };

    var maybeIt =
    function (condition, description, fn)
    {
        (condition ? it : it.skip)(description, fn);
    };

    maybeIt.only =
    function (condition, description, fn)
    {
        (condition ? it.only : it.skip)(description, fn);
    };

    maybeIt.skip =
    function (condition, description, fn)
    {
        it.skip(description, fn);
    };

    global.maybeDescribe    = maybeDescribe;
    global.maybeIt          = maybeIt;
}
)(typeof self === 'undefined' ? global : self);
