/*
global
BASE64_ALPHABET_HI_4,
BASE64_ALPHABET_LO_4,
CHARACTERS,
CODERS,
COMPLEX,
CONSTANTS,
CREATE_PARSE_INT_ARG,
DEBUG,
FROM_CHAR_CODE,
OPTIMAL_B,
Empty,
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
        
        function getEntries(name)
        {
            var entries = ENTRIES[name];
            return entries;
        }
        
        var ENTRIES = new Empty();
        ENTRIES['BASE64_ALPHABET_HI_4:0']   = BASE64_ALPHABET_HI_4[0];
        ENTRIES['BASE64_ALPHABET_HI_4:4']   = BASE64_ALPHABET_HI_4[4];
        ENTRIES['BASE64_ALPHABET_HI_4:5']   = BASE64_ALPHABET_HI_4[5];
        ENTRIES['BASE64_ALPHABET_LO_4:1']   = BASE64_ALPHABET_LO_4[1];
        ENTRIES['BASE64_ALPHABET_LO_4:3']   = BASE64_ALPHABET_LO_4[3];
        ENTRIES.CREATE_PARSE_INT_ARG        = CREATE_PARSE_INT_ARG;
        ENTRIES.FROM_CHAR_CODE              = FROM_CHAR_CODE;
        ENTRIES.OPTIMAL_B                   = OPTIMAL_B;
        
        var debug =
            assignNoEnum(
                { },
                {
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
                    getEntries:                     getEntries,
                    hasOuterPlus:                   hasOuterPlus,
                    setUp:                          setUp,
                    trimJS:                         trimJS,
                }
            );
        assignNoEnum(JScrewIt, { debug: debug });
    }
    )();
}
