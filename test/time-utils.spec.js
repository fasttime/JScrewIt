/* eslint-env mocha, node */

'use strict';

var assert = require('assert');
var proxyquire = require('proxyquire').noPreserveCache();

var modulePath = '../tools/time-utils';

describe(
    'timeThis executes the callback and returns a non-negative duration',
    function ()
    {
        it(
            'when process module is available',
            function ()
            {
                var timeUtils = proxyquire(modulePath, { });
                var callbackCalled = false;
                var actual =
                    timeUtils.timeThis(
                        function ()
                        {
                            callbackCalled = true;
                        }
                    );
                assert(callbackCalled);
                assert(isFinite(actual) && actual >= 0);
            }
        );
        it(
            'when process module is not available',
            function ()
            {
                var timeUtils = proxyquire(modulePath, { process: null });
                var callbackCalled = false;
                var actual =
                    timeUtils.timeThis(
                        function ()
                        {
                            callbackCalled = true;
                        }
                    );
                assert(callbackCalled);
                assert(isFinite(actual) && actual >= 0);
            }
        );
    }
);

describe(
    'formatDuration',
    function ()
    {
        var timeUtils = proxyquire(modulePath, { });
        
        it(
            'formats durations shorter than 0.005 s',
            function ()
            {
                var actual = timeUtils.formatDuration(0.004);
                assert.strictEqual(actual, '< 0.01 s');
            }
        );
        it(
            'formats durations of 0.005 s',
            function ()
            {
                var actual = timeUtils.formatDuration(0.005);
                assert.strictEqual(actual, '0.01 s');
            }
        );
        it(
            'formats durations longer than 0.005 s',
            function ()
            {
                var actual = timeUtils.formatDuration(9.999);
                assert.strictEqual(actual, '10.00 s');
            }
        );
    }
);
