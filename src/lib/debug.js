/*
global
BASE64_ALPHABET_HI_2,
BASE64_ALPHABET_HI_4,
BASE64_ALPHABET_HI_6,
BASE64_ALPHABET_LO_2,
BASE64_ALPHABET_LO_4,
BASE64_ALPHABET_LO_6,
CHARACTERS,
CODERS,
COMPLEX,
CONSTANTS,
CREATE_PARSE_INT_ARG,
DEBUG,
Encoder,
JScrewIt,
ScrewBuffer,
assignNoEnum,
create,
createParseIntArgByReduce,
createParseIntArgByReduceArrow,
createParseIntArgDefault,
define,
featureFromMask,
getValidFeatureMask,
hasOuterPlus,
isMaskCompatible,
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
        
        function createFeatureFromMask(mask)
        {
            var featureObj = isMaskCompatible(mask) ? featureFromMask(mask) : null;
            return featureObj;
        }
        
        function createScrewBuffer(strongBound, forceString, groupThreshold)
        {
            var buffer = new ScrewBuffer(strongBound, forceString, groupThreshold);
            return buffer;
        }
        
        function defineConstant(encoder, constant, definition)
        {
            constant += '';
            if (!/^[$A-Z_a-z][$0-9A-Z_a-z]*$/.test(constant))
                throw new SyntaxError('Invalid identifier ' + JSON.stringify(constant));
            if (!encoder.hasOwnProperty('constantDefinitions'))
                encoder.constantDefinitions = create(CONSTANTS);
            var entries = [define(definition + '')];
            encoder.constantDefinitions[constant] = entries;
        }
        
        function getCharacterEntries(char)
        {
            var entries = CHARACTERS[char];
            return entries;
        }
        
        function getCoders()
        {
            return CODERS;
        }
        
        function getComplexEntries(complex)
        {
            var entries = COMPLEX[complex];
            return entries;
        }
        
        function getConstantEntries(constant)
        {
            var entries = CONSTANTS[constant];
            return entries;
        }
        
        var debug =
            assignNoEnum(
                { },
                {
                    BASE64_ALPHABET_HI_2:           BASE64_ALPHABET_HI_2,
                    BASE64_ALPHABET_HI_4:           BASE64_ALPHABET_HI_4,
                    BASE64_ALPHABET_HI_6:           BASE64_ALPHABET_HI_6,
                    BASE64_ALPHABET_LO_2:           BASE64_ALPHABET_LO_2,
                    BASE64_ALPHABET_LO_4:           BASE64_ALPHABET_LO_4,
                    BASE64_ALPHABET_LO_6:           BASE64_ALPHABET_LO_6,
                    CREATE_PARSE_INT_ARG:           CREATE_PARSE_INT_ARG,
                    createEncoder:                  createEncoder,
                    createFeatureFromMask:          createFeatureFromMask,
                    createParseIntArgByReduce:      createParseIntArgByReduce,
                    createParseIntArgByReduceArrow: createParseIntArgByReduceArrow,
                    createParseIntArgDefault:       createParseIntArgDefault,
                    createScrewBuffer:              createScrewBuffer,
                    defineConstant:                 defineConstant,
                    getCharacterEntries:            getCharacterEntries,
                    getCoders:                      getCoders,
                    getComplexEntries:              getComplexEntries,
                    getConstantEntries:             getConstantEntries,
                    hasOuterPlus:                   hasOuterPlus,
                    setUp:                          setUp,
                    trimJS:                         trimJS,
                }
            );
        assignNoEnum(JScrewIt, { debug: debug });
    }
    )();
}
