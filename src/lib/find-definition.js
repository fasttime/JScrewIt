export default function findDefinition(entries)
{
    var definitionCache = this._definitionCache;
    var definition = definitionCache.get(entries);
    if (definition === undefined && !definitionCache.has(entries))
    {
        for (var entryIndex = entries.length; entryIndex--;)
        {
            var entry = entries[entryIndex];
            if (this.hasFeatures(entry.mask))
            {
                definition = entry.definition;
                break;
            }
        }
        definitionCache.set(entries, definition);
    }
    return definition;
}
