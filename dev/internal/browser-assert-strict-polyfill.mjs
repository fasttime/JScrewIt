/* eslint-disable n/prefer-node-protocol */

import assert   from 'assert';

export *        from 'assert';

/* eslint-enable n/prefer-node-protocol */

export default function strict()
{
    // eslint-disable-next-line prefer-rest-params
    return assert.apply(this, arguments);
}

for (var key in assert) strict[key] = assert[key];

export var deepEqual      = strict.deepEqual    = assert.deepStrictEqual;
export var equal          = strict.equal        = assert.strictEqual;
export var notDeepEqual   = strict.notDeepEqual = assert.notDeepStrictEqual;
export var notEqual       = strict.notEqual     = assert.notStrictEqual;
