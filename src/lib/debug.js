/*
global
CHARACTERS,
CODERS,
COMPLEX,
CONSTANTS,
DEBUG,
Encoder,
JScrewIt,
ScrewBuffer,
assignNoEnum,
expandEntries,
featureFromMask,
getValidFeatureMask,
hasOuterPlus,
setUp,
trimJS
*/

// istanbul ignore else
if (typeof DEBUG === 'undefined' || /* istanbul ignore next */ DEBUG)
{
    (function ()
    {
        'use strict';
        
        function createEncoder(features)
        {
            var featureMask = getValidFeatureMask(features);
            var encoder = new Encoder(featureMask);
            encoder.codingLog = [];
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
        
        function getCharacterEntries(char)
        {
            var result = getEntries(CHARACTERS[char]);
            return result;
        }
        
        function getCoders()
        {
            return CODERS;
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
        
        var debug =
            assignNoEnum(
                { },
                {
                    createEncoder:          createEncoder,
                    createScrewBuffer:      createScrewBuffer,
                    defineConstant:         defineConstant,
                    featureFromMask:        featureFromMask,
                    getCharacterEntries:    getCharacterEntries,
                    getCoders:              getCoders,
                    getComplexEntries:      getComplexEntries,
                    getConstantEntries:     getConstantEntries,
                    hasOuterPlus:           hasOuterPlus,
                    setUp:                  setUp,
                    trimJS:                 trimJS,
                }
            );
        assignNoEnum(JScrewIt, { debug: debug });
    }
    )();
}
