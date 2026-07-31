'use strict';

const assert    = require('node:assert');
const timeUtils = require('#tools/time-utils');

it
(
    'timeThisAsync executes the function and returns a non-negative duration',
    done =>
    {
        let fnCalled = false;
        timeUtils.timeThisAsync
        (
            () =>
            {
                fnCalled = true;
                return Promise.resolve();
            },
        )
        .then
        (
            actual =>
            {
                assert(fnCalled);
                assert(isFinite(actual) && actual >= 0);
                done();
            },
        )
        .catch(done);
    },
);

it
(
    'timeThis executes the function and returns a non-negative duration',
    () =>
    {
        let fnCalled = false;
        const actual =
        timeUtils.timeThis(() => { fnCalled = true; });
        assert(fnCalled);
        assert(isFinite(actual) && actual >= 0);
    },
);

describe
(
    'formatDuration',
    () =>
    {
        it
        (
            'formats durations shorter than 0.005 s',
            () =>
            {
                const actual = timeUtils.formatDuration(0.004);
                assert.strictEqual(actual, '< 0.01 s');
            },
        );
        it
        (
            'formats durations of 0.005 s',
            () =>
            {
                const actual = timeUtils.formatDuration(0.005);
                assert.strictEqual(actual, '0.01 s');
            },
        );
        it
        (
            'formats durations longer than 0.005 s',
            () =>
            {
                const actual = timeUtils.formatDuration(9.999);
                assert.strictEqual(actual, '10.00 s');
            },
        );
    },
);
