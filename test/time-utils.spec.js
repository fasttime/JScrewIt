/* eslint-env mocha, node */

'use strict';

var assert      = require('assert');
var timeUtils   = require('../tools/time-utils');

it
(
    'timeThis executes the callback and returns a non-negative duration',
    function ()
    {
        var callbackCalled = false;
        var actual =
        timeUtils.timeThis
        (
            function ()
            {
                callbackCalled = true;
            }
        );
        assert(callbackCalled);
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
