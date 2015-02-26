/*
global
CHARACTERS,
COMPLEX,
CONSTANTS,
DEBUG,
FEATURE_INFOS,
Encoder,
JScrewIt,
ScrewBuffer,
expandEntries,
featureMaskMap,
getValidFeatureMask,
hasOuterPlus,
setUp,
trimJS
*/

if (typeof DEBUG === 'undefined' || DEBUG)
{
    (function ()
    {
        'use strict';
        
        function createEncoder(features)
        {
            var featureMask = getValidFeatureMask(features);
            var encoder = new Encoder(featureMask);
            return encoder;
        }
        
        function createScrewBuffer(strongBound, groupThreshold)
        {
            var buffer = new ScrewBuffer(strongBound, groupThreshold);
            return buffer;
        }
        
        function defineConstant(encoder, constant, definition)
        {
            constant += '';
            if (!/^[$A-Z_a-z][$0-9A-Z_a-z]*$/.test(constant))
            {
                throw new SyntaxError('Invalid identifier ' + JSON.stringify(constant));
            }
            if (!encoder.hasOwnProperty('constantDefinitions'))
            {
                encoder.constantDefinitions = Object.create(CONSTANTS);
            }
            encoder.constantDefinitions[constant] = definition + '';
        }
        
        function getCharacterEntries(character)
        {
            var result = getEntries(CHARACTERS[character]);
            return result;
        }
        
        function getComplexEntries(complex)
        {
            var result = getEntries(COMPLEX[complex]);
            return result;
        }
        
        function getConstantEntries(constant)
        {
            var result = getEntries(CONSTANTS[constant]);
            return result;
        }
        
        function getEntries(entries)
        {
            if (entries != null)
            {
                var result = expandEntries(entries);
                return result;
            }
        }
        
        function getEntryFeatures(entry)
        {
            var result = [];
            var entryMask = entry.featureMask;
            for (var feature in featureMaskMap)
            {
                var featureMask = featureMaskMap[feature];
                if ((featureMask & entryMask) === featureMask)
                {
                    var featureInfo = FEATURE_INFOS[feature];
                    if (featureInfo.check)
                    {
                        result.push(feature);
                    }
                }
            }
            return result;
        }
        
        JScrewIt.debug =
        {
            createEncoder:          createEncoder,
            createScrewBuffer:      createScrewBuffer,
            defineConstant:         defineConstant,
            getCharacterEntries:    getCharacterEntries,
            getComplexEntries:      getComplexEntries,
            getConstantEntries:     getConstantEntries,
            getEntryFeatures:       getEntryFeatures,
            hasOuterPlus:           hasOuterPlus,
            setUp:                  setUp,
            trimJS:                 trimJS,
        };
    
    })();
}
