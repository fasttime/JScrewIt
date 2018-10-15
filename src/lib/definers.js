/* global featuresToMask, maskUnion */

var define;
var defineList;
var defineWithArrayLike;

(function ()
{
    function createDefinitionEntry(definition, mask)
    {
        var entry = { definition: definition, mask: mask };
        return entry;
    }

    define =
    function (definition)
    {
        var entry = defineWithArrayLike(definition, arguments, 1);
        return entry;
    };

    defineList =
    function (availableEntries, indexEntries)
    {
        var effectiveEntries =
        indexEntries.map
        (
            function (indexEntry)
            {
                var availableEntry = availableEntries[indexEntry.definition];
                var definition = availableEntry.definition;
                var mask = maskUnion(indexEntry.mask, availableEntry.mask);
                var effectiveEntry = createDefinitionEntry(definition, mask);
                return effectiveEntry;
            }
        );
        effectiveEntries.available = availableEntries;
        return effectiveEntries;
    };

    defineWithArrayLike =
    function (definition, featureArgs, startIndex)
    {
        var features = Array.prototype.slice.call(featureArgs, startIndex);
        var mask = featuresToMask(features);
        var entry = createDefinitionEntry(definition, mask);
        return entry;
    };
}
)();
