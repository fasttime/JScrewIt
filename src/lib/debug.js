/* global DEBUG */

import createClusteringPlan                     from './clustering-plan';
import { define }                               from './definers';
import
{
    BASE64_ALPHABET_HI_4,
    BASE64_ALPHABET_LO_4,
    CHARACTERS,
    COMPLEX,
    CONSTANTS,
    FROM_CHAR_CODE,
    FROM_CHAR_CODE_CALLBACK_FORMATTER,
    MAPPER_FORMATTER,
    OPTIMAL_ARG_NAME,
    OPTIMAL_B,
    OPTIMAL_RETURN_STRING,
}
from './definitions';
import { Encoder }                              from './encoder-base';
import { STRATEGIES, createReindexMap }         from './encoder-ext';
import { featureFromMask, isMaskCompatible }    from './features';
import createFigurator                          from './figurator';
import { JScrewIt, getValidFeatureMask }        from './jscrewit-base';
import
{
    _Array_isArray,
    _JSON_stringify,
    _Object_create,
    _Object_keys,
    _String,
    _SyntaxError,
    assignNoEnum,
    createEmpty,
    esToString,
}
from './obj-utils';
import createCommaOptimizer                     from './optimizers/comma-optimizer';
import createComplexOptimizer                   from './optimizers/complex-optimizer';
import createToStringOptimizer                  from './optimizers/to-string-optimizer';
import { ScrewBuffer, optimizeSolutions }       from './screw-buffer';
import { DynamicSolution, SimpleSolution }      from './solution';
import trimJS                                   from './trim-js';
import { SolutionType, calculateSolutionType }  from 'novem';
import { MaskMap, MaskSet, maskAreEqual, maskIncludes, maskNew, maskNext, maskUnion }
from 'quinquaginta-duo';

if (typeof NO_DEBUG === 'undefined')
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
                    outputEntries = inputEntries.map(clone);
                else
                    outputEntries = [createEntryClone(inputEntries, EMPTY_MASK)];
            }
            return outputEntries;
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
            var entry = { definition: definition, mask: mask };
            return entry;
        }

        function createFeatureFromMask(mask)
        {
            var featureObj = isMaskCompatible(mask) ? featureFromMask(mask) : null;
            return featureObj;
        }

        function createScrewBuffer(screwMode, groupThreshold, optimizerList)
        {
            var buffer = new ScrewBuffer(screwMode, groupThreshold, optimizerList);
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

        function getCharacters()
        {
            var chars = _Object_keys(CHARACTERS).sort();
            return chars;
        }

        function getComplexEntry(complex)
        {
            var entry = clone(COMPLEX[complex]);
            return entry;
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

        function getConstantNames()
        {
            var names = _Object_keys(CONSTANTS).sort();
            return names;
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
        ENTRIES.FROM_CHAR_CODE                                  = FROM_CHAR_CODE;
        ENTRIES['FROM_CHAR_CODE:available']                     = FROM_CHAR_CODE.available;
        ENTRIES.FROM_CHAR_CODE_CALLBACK_FORMATTER               = FROM_CHAR_CODE_CALLBACK_FORMATTER;
        ENTRIES['FROM_CHAR_CODE_CALLBACK_FORMATTER:available']  =
        FROM_CHAR_CODE_CALLBACK_FORMATTER.available;
        ENTRIES.MAPPER_FORMATTER                                = MAPPER_FORMATTER;
        ENTRIES['MAPPER_FORMATTER:available']                   = MAPPER_FORMATTER.available;
        ENTRIES.OPTIMAL_ARG_NAME                                = OPTIMAL_ARG_NAME;
        ENTRIES['OPTIMAL_ARG_NAME:available']                   = OPTIMAL_ARG_NAME.available;
        ENTRIES.OPTIMAL_B                                       = OPTIMAL_B;
        ENTRIES['OPTIMAL_B:available']                          = OPTIMAL_B.available;
        ENTRIES.OPTIMAL_RETURN_STRING                           = OPTIMAL_RETURN_STRING;
        ENTRIES['OPTIMAL_RETURN_STRING:available']              = OPTIMAL_RETURN_STRING.available;

        var debug =
        assignNoEnum
        (
            { },
            {
                DynamicSolution:            DynamicSolution,
                MaskMap:                    MaskMap,
                MaskSet:                    MaskSet,
                Solution:                   SimpleSolution,
                SolutionType:               SolutionType,
                calculateSolutionType:      calculateSolutionType,
                createClusteringPlan:       createClusteringPlan,
                createCommaOptimizer:       createCommaOptimizer,
                createComplexOptimizer:     createComplexOptimizer,
                createEncoder:              createEncoder,
                createFeatureFromMask:      createFeatureFromMask,
                createFigurator:            createFigurator,
                createReindexMap:           createReindexMap,
                createScrewBuffer:          createScrewBuffer,
                createToStringOptimizer:    createToStringOptimizer,
                defineConstant:             defineConstant,
                getCharacterEntries:        getCharacterEntries,
                getCharacters:              getCharacters,
                getComplexEntry:            getComplexEntry,
                getComplexNames:            getComplexNames,
                getConstantEntries:         getConstantEntries,
                getConstantNames:           getConstantNames,
                getEntries:                 getEntries,
                getStrategies:              getStrategies,
                maskAreEqual:               maskAreEqual,
                maskIncludes:               maskIncludes,
                maskNew:                    maskNew,
                maskNext:                   maskNext,
                maskUnion:                  maskUnion,
                optimizeSolutions:          optimizeSolutions,
                trimJS:                     trimJS,
            }
        );

        assignNoEnum(JScrewIt, { debug: debug });
    }
    )();
}
