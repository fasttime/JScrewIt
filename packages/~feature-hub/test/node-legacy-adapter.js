'use strict';

var assert = require('assert');

if (!('deepStrictEqual' in assert))
    assert.deepStrictEqual = assert.deepEqual;
