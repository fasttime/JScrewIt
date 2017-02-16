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
FROM_CHAR_CODE_CALLBACK_FORMATTER,
MAPPER_FORMATTER,
OPTIMAL_B,
Empty,
Encoder,
Feature,
JScrewIt,
ScrewBuffer,
array_isArray,
assignNoEnum,
createBridgeSolution,
createClusteringPlan,
createFigurator,
createParseIntArgByReduce,
createParseIntArgByReduceArrow,
createParseIntArgDefault,
createSolution,
define,
esToString,
featureFromMask,
getValidFeatureMask,
isMaskCompatible,
json_stringify,
maskAnd,
maskIncludes,
maskIsEmpty,
maskNew,
maskUnion,
object_create,
object_freeze,
object_keys,
setUp,
trimJS,
*/

// istanbul ignore else
if (typeof DEBUG === 'undefined' || /* istanbul ignore next */ DEBUG)
{
    (function ()
    {
        function cloneEntries(inputEntries)
        {
            var outputEntries;
            if (inputEntries)
            {
                var singleton = !array_isArray(inputEntries);
                if (singleton)
                    outputEntries = [createEntryClone(inputEntries, [0, 0])];
                else
                {
                    outputEntries =
                        inputEntries.map(
                            function (entry)
                            {
                                entry = createEntryClone(entry.definition, entry.mask);
                                return entry;
                            }
                        );
                }
                outputEntries.singleton = singleton;
            }
            return outputEntries;
        }
        
        function createEncoder(features)
        {
            var mask = getValidFeatureMask(features);
            var encoder = new Encoder(mask);
            encoder.codingLog = [];
            return encoder;
        }
        
        function createEntryClone(definition, mask)
        {
            if (typeof definition === 'object')
                definition = object_freeze(definition);
            mask = mask.slice();
            var entry = { definition: definition, mask: mask };
            return entry;
        }
        
        function createFeatureFromMask(mask)
        {
            var featureObj = isMaskCompatible(mask) ? featureFromMask(mask) : null;
            return featureObj;
        }
        
        function createScrewBuffer(bond, forceString, groupThreshold, optimizer)
        {
            var buffer = new ScrewBuffer(bond, forceString, groupThreshold, optimizer);
            return buffer;
        }
        
        function defineConstant(encoder, constant, definition)
        {
            constant += '';
            if (!/^[$A-Z_a-z][$\w]*$/.test(constant))
                throw new SyntaxError('Invalid identifier ' + json_stringify(constant));
            if (!encoder.hasOwnProperty('constantDefinitions'))
                encoder.constantDefinitions = object_create(CONSTANTS);
            var entries = [define(esToString(definition))];
            encoder.constantDefinitions[constant] = entries;
        }
        
        function getCharacterEntries(char)
        {
            var entries = cloneEntries(CHARACTERS[char]);
            return entries;
        }
        
        function getCoders()
        {
            return CODERS;
        }
        
        function getComplexEntries(complex)
        {
            var entries = cloneEntries(COMPLEX[complex]);
            return entries;
        }
        
        function getComplexNames()
        {
            var names = object_keys(COMPLEX).sort();
            return names;
        }
        
        function getConstantEntries(constant)
        {
            var entries = cloneEntries(CONSTANTS[constant]);
            return entries;
        }
        
        function getEntries(name)
        {
            var entries = cloneEntries(ENTRIES[name]);
            return entries;
        }
        
        var CREATE_PARSE_INT_ARG_AVAILABLE =
        [
            define(createParseIntArgDefault),
            define(createParseIntArgByReduce),
            define(createParseIntArgByReduceArrow, Feature.ARROW)
        ];
        
        // Exported entries
        var ENTRIES = new Empty();
        ENTRIES['BASE64_ALPHABET_HI_4:0']           = BASE64_ALPHABET_HI_4[0];
        ENTRIES['BASE64_ALPHABET_HI_4:4']           = BASE64_ALPHABET_HI_4[4];
        ENTRIES['BASE64_ALPHABET_HI_4:5']           = BASE64_ALPHABET_HI_4[5];
        ENTRIES['BASE64_ALPHABET_LO_4:1']           = BASE64_ALPHABET_LO_4[1];
        ENTRIES['BASE64_ALPHABET_LO_4:3']           = BASE64_ALPHABET_LO_4[3];
        ENTRIES.CREATE_PARSE_INT_ARG                = CREATE_PARSE_INT_ARG;
        ENTRIES['CREATE_PARSE_INT_ARG:available']   = CREATE_PARSE_INT_ARG_AVAILABLE;
        ENTRIES.FROM_CHAR_CODE                      = FROM_CHAR_CODE;
        ENTRIES.FROM_CHAR_CODE_CALLBACK_FORMATTER   = FROM_CHAR_CODE_CALLBACK_FORMATTER;
        ENTRIES.MAPPER_FORMATTER                    = MAPPER_FORMATTER;
        ENTRIES.OPTIMAL_B                           = OPTIMAL_B;
        
        var debug =
            assignNoEnum(
                { },
                {
                    createBridgeSolution:   createBridgeSolution,
                    createClusteringPlan:   createClusteringPlan,
                    createEncoder:          createEncoder,
                    createFeatureFromMask:  createFeatureFromMask,
                    createFigurator:        createFigurator,
                    createScrewBuffer:      createScrewBuffer,
                    createSolution:         createSolution,
                    defineConstant:         defineConstant,
                    getCharacterEntries:    getCharacterEntries,
                    getCoders:              getCoders,
                    getComplexEntries:      getComplexEntries,
                    getComplexNames:        getComplexNames,
                    getConstantEntries:     getConstantEntries,
                    getEntries:             getEntries,
                    maskAnd:                maskAnd,
                    maskIncludes:           maskIncludes,
                    maskIsEmpty:            maskIsEmpty,
                    maskNew:                maskNew,
                    maskUnion:              maskUnion,
                    setUp:                  setUp,
                    trimJS:                 trimJS,
                }
            );
        assignNoEnum(JScrewIt, { debug: debug });
    }
    )();
}
