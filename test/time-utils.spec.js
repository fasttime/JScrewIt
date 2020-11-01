/* eslint-env ebdd/ebdd, node */
/* global Promise */

'use strict';

var assert      = require('assert');
var timeUtils   = require('../tools/time-utils');

it.when(typeof Promise === 'function')
(
    'timeThisAsync executes the function and returns a non-negative duration',
    function (done)
    {
        var fnCalled = false;
        timeUtils.timeThisAsync
        (
            function ()
            {
                fnCalled = true;
                return Promise.resolve();
            }
        )
        .then
        (
            function (actual)
            {
                assert(fnCalled);
                assert(isFinite(actual) && actual >= 0);
                done();
            }
        )
        .catch(done);
    }
);

it
(
    'timeThis executes the function and returns a non-negative duration',
    function ()
    {
        var fnCalled = false;
        var actual =
        timeUtils.timeThis
        (
            function ()
            {
                fnCalled = true;
            }
        );
        assert(fnCalled);
        assert(isFinite(actual) && actual >= 0);
    }
);

describe
(
    'formatDuration',
    function ()
    {
        it
        (
            'formats durations shorter than 0.005 s',
            function ()
            {
                var actual = timeUtils.formatDuration(0.004);
                assert.strictEqual(actual, '< 0.01 s');
            }
        );
        it
        (
            'formats durations of 0.005 s',
            function ()
            {
                var actual = timeUtils.formatDuration(0.005);
                assert.strictEqual(actual, '0.01 s');
            }
        );
        it
        (
            'formats durations longer than 0.005 s',
            function ()
            {
                var actual = timeUtils.formatDuration(9.999);
                assert.strictEqual(actual, '10.00 s');
            }
        );
    }
);
