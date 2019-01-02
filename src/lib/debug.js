/*
global
BASE64_ALPHABET_HI_4,
BASE64_ALPHABET_LO_4,
CHARACTERS,
COMPLEX,
CONSTANTS,
CREATE_PARSE_INT_ARG,
DEBUG,
FROM_CHAR_CODE,
FROM_CHAR_CODE_CALLBACK_FORMATTER,
MAPPER_FORMATTER,
OPTIMAL_B,
OPTIMAL_RETURN_STRING,
STRATEGIES,
Encoder,
JScrewIt,
ScrewBuffer,
Solution,
_Array_isArray,
_JSON_stringify,
_Object_create,
_Object_freeze,
_Object_keys,
_String,
_SyntaxError,
assignNoEnum,
createBridgeSolution,
createClusteringPlan,
createEmpty,
createFigurator,
define,
esToString,
featureFromMask,
getComplexOptimizer,
getToStringOptimizer,
getValidFeatureMask,
isMaskCompatible,
maskIncludes,
maskIsEmpty,
maskNew,
maskUnion,
optimizeSolutions,
trimJS,
*/

// istanbul ignore else
if (typeof DEBUG === 'undefined' || /* istanbul ignore next */ DEBUG)
{
    (function ()
    {
        function clone(obj)
        {
            if (typeof obj === 'object')
            {
                var target = { };
                var names = _Object_keys(obj);
                names.forEach
                (
                    function (name)
                    {
                        var value = clone(obj[name]);
                        target[name] = value;
                    }
                );
                return target;
            }
            return obj;
        }

        function cloneEntries(inputEntries)
        {
            var outputEntries;
            if (inputEntries)
            {
                if (_Array_isArray(inputEntries))
                    outputEntries = inputEntries.map(cloneEntry);
                else
                    outputEntries = [createEntryClone(inputEntries, EMPTY_MASK)];
            }
            return outputEntries;
        }

        function cloneEntry(entry)
        {
            entry = createEntryClone(entry.definition, entry.mask);
            return entry;
        }

        function createEncoder(features)
        {
            var mask = getValidFeatureMask(features);
            var encoder = new Encoder(mask);
            encoder.perfLog = [];
            return encoder;
        }

        function createEntryClone(definition, mask)
        {
            definition = clone(definition);
            var entry = { definition: definition, mask: _Object_freeze(mask) };
            return entry;
        }

        function createFeatureFromMask(mask)
        {
            var featureObj = isMaskCompatible(mask) ? featureFromMask(mask) : null;
            return featureObj;
        }

        function createScrewBuffer(bond, forceString, groupThreshold, optimizerList)
        {
            var buffer = new ScrewBuffer(bond, forceString, groupThreshold, optimizerList);
            return buffer;
        }

        function defineConstant(encoder, constant, definition)
        {
            constant = _String(constant);
            if (!/^[$A-Z_a-z][$\w]*$/.test(constant))
                throw new _SyntaxError('Invalid identifier ' + _JSON_stringify(constant));
            if (!encoder.hasOwnProperty('constantDefinitions'))
                encoder.constantDefinitions = _Object_create(CONSTANTS);
            var entries = [define(esToString(definition))];
            encoder.constantDefinitions[constant] = entries;
        }

        function getCharacterEntries(char)
        {
            var entries = cloneEntries(CHARACTERS[char]);
            return entries;
        }

        function getComplexEntry(complex)
        {
            var entries = cloneEntry(COMPLEX[complex]);
            return entries;
        }

        function getComplexNames()
        {
            var names = _Object_keys(COMPLEX).sort();
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

        function getStrategies()
        {
            return STRATEGIES;
        }

        var EMPTY_MASK = maskNew();

        // Miscellaneous entries
        var ENTRIES = createEmpty();
        ENTRIES['BASE64_ALPHABET_HI_4:0']                       = BASE64_ALPHABET_HI_4[0];
        ENTRIES['BASE64_ALPHABET_HI_4:4']                       = BASE64_ALPHABET_HI_4[4];
        ENTRIES['BASE64_ALPHABET_HI_4:5']                       = BASE64_ALPHABET_HI_4[5];
        ENTRIES['BASE64_ALPHABET_LO_4:1']                       = BASE64_ALPHABET_LO_4[1];
        ENTRIES['BASE64_ALPHABET_LO_4:3']                       = BASE64_ALPHABET_LO_4[3];
        ENTRIES.CREATE_PARSE_INT_ARG                            = CREATE_PARSE_INT_ARG;
        ENTRIES['CREATE_PARSE_INT_ARG:available']               = CREATE_PARSE_INT_ARG.available;
        ENTRIES.FROM_CHAR_CODE                                  = FROM_CHAR_CODE;
        ENTRIES['FROM_CHAR_CODE:available']                     = FROM_CHAR_CODE.available;
        ENTRIES.FROM_CHAR_CODE_CALLBACK_FORMATTER               = FROM_CHAR_CODE_CALLBACK_FORMATTER;
        ENTRIES['FROM_CHAR_CODE_CALLBACK_FORMATTER:available']  =
        FROM_CHAR_CODE_CALLBACK_FORMATTER.available;
        ENTRIES.MAPPER_FORMATTER                                = MAPPER_FORMATTER;
        ENTRIES['MAPPER_FORMATTER:available']                   = MAPPER_FORMATTER.available;
        ENTRIES.OPTIMAL_B                                       = OPTIMAL_B;
        ENTRIES['OPTIMAL_B:available']                          = OPTIMAL_B.available;
        ENTRIES.OPTIMAL_RETURN_STRING                           = OPTIMAL_RETURN_STRING;
        ENTRIES['OPTIMAL_RETURN_STRING:available']              = OPTIMAL_RETURN_STRING.available;

        var debug =
        assignNoEnum
        (
            { },
            {
                Solution:               Solution,
                createBridgeSolution:   createBridgeSolution,
                createClusteringPlan:   createClusteringPlan,
                createEncoder:          createEncoder,
                createFeatureFromMask:  createFeatureFromMask,
                createFigurator:        createFigurator,
                createScrewBuffer:      createScrewBuffer,
                defineConstant:         defineConstant,
                getCharacterEntries:    getCharacterEntries,
                getComplexEntry:        getComplexEntry,
                getComplexNames:        getComplexNames,
                getComplexOptimizer:    getComplexOptimizer,
                getConstantEntries:     getConstantEntries,
                getEntries:             getEntries,
                getStrategies:          getStrategies,
                getToStringOptimizer:   getToStringOptimizer,
                maskIncludes:           maskIncludes,
                maskIsEmpty:            maskIsEmpty,
                maskNew:                maskNew,
                maskUnion:              maskUnion,
                optimizeSolutions:      optimizeSolutions,
                trimJS:                 trimJS,
            }
        );
        assignNoEnum(JScrewIt, { debug: debug });
    }
    )();
}
