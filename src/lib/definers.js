import { featuresToMask }                           from './features';
import { _Array_prototype, _Array_prototype_push }  from './obj-utils';
import { maskUnion }                                from 'quinquaginta-duo';

function callWithFeatures()
{
    var args = arguments;
    var featureArgsIndex = args.length - 2;
    var featureArgs = args[featureArgsIndex];
    var featureStartIndex = args[featureArgsIndex + 1];
    var defineFnArgs = sliceArgs(args, 0, featureArgsIndex);
    var features = sliceArgs(featureArgs, featureStartIndex);
    _Array_prototype_push.apply(defineFnArgs, features);
    var entry = this.apply(null, defineFnArgs);
    return entry;
}

function createDefinitionEntry(definition, mask)
{
    var entry = { definition: definition, mask: mask };
    return entry;
}

export function define(definition)
{
    var features = sliceArgs(arguments, 1);
    var mask = featuresToMask(features);
    var entry = createDefinitionEntry(definition, mask);
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

export function makeCallableWithFeatures(fn)
{
    fn.$callWithFeatures = callWithFeatures;
}

function sliceArgs(args, startIndex, endIndex)
{
    var array = _Array_prototype.slice.call(args, startIndex, endIndex);
    return array;
}

makeCallableWithFeatures(define);
