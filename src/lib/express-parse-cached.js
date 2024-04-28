/* global FinalizationRegistry, WeakRef */

import expressParse from './express-parse';

var expressParseCached;

if (typeof WeakRef !== 'function')
    expressParseCached = expressParse;
else
{
    var cache = new Map();
    var cleanup =
    new FinalizationRegistry
    (
        function (input)
        {
            var ref = cache.get(input);
            if (ref && !ref.deref())
                cache.delete(input);
        }
    );
    expressParseCached =
    function (input)
    {
        var unit;
        var ref = cache.get(input);
        if (ref)
            unit = ref.deref();
        if (!unit)
        {
            unit = expressParse(input);
            if (unit && unit !== true)
            {
                ref = new WeakRef(unit);
                cache.set(input, ref);
                cleanup.register(unit, input);
            }
        }
        return unit;
    };
}

export default expressParseCached;
