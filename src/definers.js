/* global getFeatureMask */

var createDefinitionEntry;
var define;
var noProto;

(function ()
{
    'use strict';
    
    createDefinitionEntry =
        function (definition, featureArgs, startIndex)
        {
            var features = Array.prototype.slice.call(featureArgs, startIndex);
            var featureMask = getFeatureMask(features);
            var entry = { definition: definition, featureMask: featureMask };
            return entry;
        };
    
    define =
        function (definition)
        {
            var entry = createDefinitionEntry(definition, arguments, 1);
            return entry;
        };
    
    noProto =
        function (obj)
        {
            var result = Object.create(null);
            Object.getOwnPropertyNames(obj).forEach(
                function (name)
                {
                    result[name] = obj[name];
                }
            );
            return result;
        };

})();
