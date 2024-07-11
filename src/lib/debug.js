/* global DEBUG */

import createClusteringPlan                                         from './clustering-plan';
import { define }                                                   from './definers';
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
import { Encoder }                                                  from './encoder/encoder-base';
import { STRATEGIES, createReindexMap }                             from './encoder/encoder-ext';
import { Feature }                                                  from './features';
import createFigurator                                              from './figurator';
import { JScrewIt, isEncoderInCache }                               from './jscrewit-base';
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
import { ScrewBuffer, optimizeSolutions }                           from './screw-buffer';
import { DynamicSolution, SimpleSolution }                          from './solution';
import trimJS                                                       from './trim-js';
import { MASK_EMPTY, MaskMap, MaskSet, maskIncludes, maskUnion }    from '~feature-hub';
import { SolutionType, calculateSolutionType }                      from '~solution';

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
                    outputEntries = inputEntries.map(cloneEntry);
                else
                    outputEntries = [createEntryClone(inputEntries, MASK_EMPTY)];
            }
            return outputEntries;
        }

        function cloneEntry(inputEntry)
        {
            var outputEntry = createEntryClone(inputEntry.definition, inputEntry.mask);
            return outputEntry;
        }

        function createEncoder(features)
        {
            var mask = getFeatureMask(features);
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
            var entry = cloneEntry(COMPLEX[complex]);
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
            entries.cacheKey = name;
            return entries;
        }

        function getStrategies()
        {
            return STRATEGIES;
        }

        // Miscellaneous entries
        var ENTRIES = createEmpty();
        ENTRIES['BASE64_ALPHABET_HI_4:0']                       = BASE64_ALPHABET_HI_4[0];
        ENTRIES['BASE64_ALPHABET_HI_4:4']                       = BASE64_ALPHABET_HI_4[4];
        ENTRIES['BASE64_ALPHABET_HI_4:5']                       = BASE64_ALPHABET_HI_4[5];
        ENTRIES['BASE64_ALPHABET_LO_4:1']                       = BASE64_ALPHABET_LO_4[1];
        ENTRIES['BASE64_ALPHABET_LO_4:3']                       = BASE64_ALPHABET_LO_4[3];

        var featureFromMask = Feature._fromMask;
        var getFeatureMask = Feature._getMask;

        (function ()
        {
            function exposeEntries(name, entries)
            {
                ENTRIES[name] = entries;
                ENTRIES[name + ':available'] = entries.available;
            }

            exposeEntries('FROM_CHAR_CODE',                     FROM_CHAR_CODE);
            exposeEntries('FROM_CHAR_CODE_CALLBACK_FORMATTER',  FROM_CHAR_CODE_CALLBACK_FORMATTER);
            exposeEntries('MAPPER_FORMATTER',                   MAPPER_FORMATTER);
            exposeEntries('OPTIMAL_ARG_NAME',                   OPTIMAL_ARG_NAME);
            exposeEntries('OPTIMAL_B',                          OPTIMAL_B);
            exposeEntries('OPTIMAL_RETURN_STRING',              OPTIMAL_RETURN_STRING);
        }
        )();

        var debug =
        assignNoEnum
        (
            { },
            {
                DynamicSolution:        DynamicSolution,
                MaskMap:                MaskMap,
                MaskSet:                MaskSet,
                Solution:               SimpleSolution,
                SolutionType:           SolutionType,
                calculateSolutionType:  calculateSolutionType,
                createClusteringPlan:   createClusteringPlan,
                createEncoder:          createEncoder,
                createFigurator:        createFigurator,
                createReindexMap:       createReindexMap,
                createScrewBuffer:      createScrewBuffer,
                defineConstant:         defineConstant,
                featureFromMask:        featureFromMask,
                getCharacterEntries:    getCharacterEntries,
                getCharacters:          getCharacters,
                getComplexEntry:        getComplexEntry,
                getComplexNames:        getComplexNames,
                getConstantEntries:     getConstantEntries,
                getConstantNames:       getConstantNames,
                getEntries:             getEntries,
                getStrategies:          getStrategies,
                isEncoderInCache:       isEncoderInCache,
                maskIncludes:           maskIncludes,
                maskUnion:              maskUnion,
                optimizeSolutions:      optimizeSolutions,
                trimJS:                 trimJS,
            }
        );

        assignNoEnum(JScrewIt, { debug: debug });
    }
    )();
}
