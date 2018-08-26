/* global featuresToMask */

var createDefinitionEntry;
var define;

(function ()
{
    createDefinitionEntry =
        function (definition, featureArgs, startIndex)
        {
            var features = Array.prototype.slice.call(featureArgs, startIndex);
            var mask = featuresToMask(features);
            var entry = { definition: definition, mask: mask };
            return entry;
        };

    define =
        function (definition)
        {
            var entry = createDefinitionEntry(definition, arguments, 1);
            return entry;
        };
}
)();
