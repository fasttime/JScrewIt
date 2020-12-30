import { featuresToMask }   from './features';
import { _Array_prototype } from './obj-utils';
import { maskUnion }        from 'quinquaginta-duo';

function createDefinitionEntry(definition, mask)
{
    var entry = { definition: definition, mask: mask };
    return entry;
}

export function define(definition)
{
    var entry = defineWithArrayLike(definition, arguments, 1);
    return entry;
}

export function defineList(availableEntries, indexEntries)
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
}

export function defineWithArrayLike(definition, featureArgs, startIndex)
{
    var features = _Array_prototype.slice.call(featureArgs, startIndex);
    var mask = featuresToMask(features);
    var entry = createDefinitionEntry(definition, mask);
    return entry;
}
