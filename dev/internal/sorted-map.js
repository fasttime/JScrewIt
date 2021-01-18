'use strict';

module.exports =
class SortedMap extends Map
{
    * entries()
    {
        const keys = this.keys();
        for (const key of keys)
        {
            const value = this.get(key);
            const entry = [key, value];
            yield entry;
        }
    }

    forEach(callback, thisArg)
    {
        if (typeof callback !== 'function')
            throw TypeError('First argument must be a function');
        for (const [key, value] of this)
            callback.call(thisArg, value, key, this);
    }

    * keys()
    {
        const keyIterator = super.keys();
        const keys = [...keyIterator].sort();
        for (const key of keys)
            yield key;
    }

    * values()
    {
        const keys = this.keys();
        for (const key of keys)
        {
            const value = this.get(key);
            yield value;
        }
    }

    [Symbol.iterator]()
    {
        const entryIterator = this.entries();
        return entryIterator;
    }
};
