export default function findDefinition(entries)
{
    var cacheKey = entries.cacheKey;
    if (cacheKey === undefined)
        entries.cacheKey = cacheKey = ++lastCacheKey;
    var definitionCache = this._definitionCache;
    if (cacheKey in definitionCache)
        return definitionCache[cacheKey];
    var definition;
    for (var entryIndex = entries.length; entryIndex--;)
    {
        var entry = entries[entryIndex];
        if (this.hasFeatures(entry.mask))
        {
            definition = entry.definition;
            break;
        }
    }
    definitionCache[cacheKey] = definition;
    return definition;
}

var lastCacheKey = 0;
