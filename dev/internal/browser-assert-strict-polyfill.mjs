import assert   from 'assert';

export *        from 'assert';

export default function strict()
{
    return assert.apply(this, arguments);
}

for (var key in assert) strict[key] = assert[key];

export var deepEqual      = strict.deepEqual    = assert.deepStrictEqual;
export var equal          = strict.equal        = assert.strictEqual;
export var notDeepEqual   = strict.notDeepEqual = assert.notDeepStrictEqual;
export var notEqual       = strict.notEqual     = assert.notStrictEqual;
