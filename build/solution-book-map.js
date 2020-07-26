'use strict';

const JSCREWIT_PATH         = '..';
const TYPE_KEY              = '__type';
const TYPE_VALUE_SOLUTION   = 'Solution';

const JScrewIt = require(JSCREWIT_PATH);
const charMapRoot = require('path').resolve(__dirname, '../novem.char-map.json');
const { debug } = JScrewIt;
const solutionBookMap = module.exports = new Map();

Object.assign
(
    solutionBookMap,
    {
        clear:              clearSolutionBookMap,
        entries:            entryIterator,
        forEach,
        index:              indexChar,
        keys:               charIterator,
        load:               loadSolutionBookMap,
        loadTime:           undefined,
        save:               saveSolutionBookMap,
        [Symbol.iterator]:  entryIterator,
    },
);

function charIterator()
{
    const iterator = [...Map.prototype.keys.call(solutionBookMap)].sort()[Symbol.iterator]();
    return iterator;
}

function compareSolutions(solution1, solution2)
{
    let diff = solution1.length - solution2.length;
    if (!diff)
        diff = solution1.entryIndex - solution2.entryIndex;
    return diff;
}

function clearSolutionBookMap()
{
    Map.prototype.clear.call(solutionBookMap);
    solutionBookMap.loadTime = undefined;
}

function createParseReviver()
{
    const { Feature } = JScrewIt;
    const { Solution, SolutionType } = debug;
    const parseReviverMap =
    new Map([[Map.name, jsonParseMap], [TYPE_VALUE_SOLUTION, jsonParseSolution]]);
    return parseReviver;

    function jsonParseMap(obj)
    {
        const entries = Object.entries(obj);
        entries.forEach
        (
            entry =>
            {
                entry[0] = entry[0].replace(/^___/, '__');
            },
        );
        const map = new Map(entries);
        return map;
    }

    function jsonParseSolution(obj)
    {
        const solution = new Solution(obj.source, obj.replacement, obj.type);
        for (const [key, value] of Object.entries(obj))
        {
            if (!solution.hasOwnProperty(key) && key !== 'type' && key !== 'features')
                solution[key] = value;
        }
        solution.type = SolutionType[obj.type];
        solution.masks = obj.features.map(featureNames => new Feature(featureNames).mask);
        return solution;
    }

    function parseReviver(key, value)
    {
        if (typeof value === 'object')
        {
            const type = value[TYPE_KEY];
            delete value[TYPE_KEY];
            const reviver = parseReviverMap.get(type);
            if (reviver)
                value = reviver(value);
        }
        return value;
    }
}

function createStringifyReplacer()
{
    const { Solution, SolutionType, createFeatureFromMask } = debug;
    const stringifyReplacerMap = new Map([[Map, jsonReplaceMap], [Solution, jsonReplaceSolution]]);
    return stringifyReplacer;

    function jsonReplaceMap(map)
    {
        const obj = { __proto__: null, [TYPE_KEY]: Map.name };
        const keys = [];
        for (let key of map.keys())
        {
            key = key.replace(/^__/, '___');
            obj[key] = map.get(key);
            keys.push(key);
        }
        const proxy = new Proxy(obj, { ownKeys: () => [TYPE_KEY, ...keys] });
        return proxy;
    }

    function jsonReplaceSolution(solution)
    {
        const obj = { __proto__: null };
        obj[TYPE_KEY] = TYPE_VALUE_SOLUTION;
        for (const [key, value] of Object.entries(solution))
        {
            if (key !== 'type' && key !== 'masks')
                obj[key] = value;
        }
        obj.type = SolutionType[solution.type];
        obj.features = solution.masks.map(mask => createFeatureFromMask(mask).canonicalNames);
        return obj;
    }

    function stringifyReplacer(key, value)
    {
        if (value != null)
        {
            const { constructor } = value;
            if (constructor)
            {
                const replacer = stringifyReplacerMap.get(constructor);
                if (replacer)
                    value = replacer(value);
            }
        }
        return value;
    }
}

function entryIterator()
{
    const compareEntries = ([char1], [char2]) => char1.charCodeAt() - char2.charCodeAt();
    const iterator =
    [...Map.prototype.entries.call(solutionBookMap)].sort(compareEntries)[Symbol.iterator]();
    return iterator;
}

function forEach(callback, thisArg)
{
    if (typeof callback !== 'function')
        throw TypeError('First argument must be a function');
    for (const [key, value] of solutionBookMap)
        callback.call(thisArg, value, key, solutionBookMap);
}

function indexChar(char, updateProgress, missingCharacter)
{
    const Analyzer = require('./optimized-analyzer');
    const { getCharacterEntries, maskIncludes } = debug;
    {
        const fs = requireFS();
        const path = require.resolve(JSCREWIT_PATH);
        const { mtime } = fs.statSync(path);
        const jscrewitTimestamp = Date.parse(mtime);
        const definitionCount = getCharacterEntries(char).length;
        const solutionIndex = new Map();
        const usedCharSet = fillSolutionIndex(solutionIndex, char);
        const usedChars = [...usedCharSet].sort();
        const solutions = [...solutionIndex.values()];
        solutions.sort(compareSolutions);
        const solutionBook = { jscrewitTimestamp, definitionCount, usedChars, solutions };
        solutionBookMap.set(char, solutionBook);
    }

    function addMask({ masks }, mask)
    {
        for (const currentMask of masks)
        {
            if (maskIncludes(mask, currentMask))
                return;
        }
        for (let index = masks.length; index-- > 0;)
        {
            const currentMask = masks[index];
            if (maskIncludes(currentMask, mask))
                masks.splice(index, 1);
        }
        masks.push(mask);
    }

    function addSolutionToIndex(map, solution, { mask })
    {
        const key = solution.replacement;
        let currentSolution = map.get(key);
        if (!currentSolution)
        {
            map.set(key, currentSolution = solution);
            currentSolution.masks = [];
        }
        addMask(currentSolution, mask);
    }

    function fillSolutionIndex(solutionIndex, char)
    {
        const analyzer = new Analyzer();
        const ignoredCharSet = new Set(char);
        analyzer.missingCharacter =
        char =>
        {
            if (!ignoredCharSet.has(char))
            {
                missingCharacter(char);
                ignoredCharSet.add(char);
            }
        };
        for (let encoder; encoder = analyzer.nextEncoder;)
        {
            const output = encoder.resolveCharacter(char);
            addSolutionToIndex(solutionIndex, output, analyzer.featureObj);
            updateProgress(analyzer.progress);
        }
        const { usedCharSet } = analyzer;
        return usedCharSet;
    }
}

function loadSolutionBookMap(reload)
{
    if (reload || !solutionBookMap.loadTime)
    {
        const fs = requireFS();
        try
        {
            const jsonString = fs.readFileSync(charMapRoot);
            const parseReviver = createParseReviver();
            const tmpMap = JSON.parse(jsonString, parseReviver);
            solutionBookMap.clear();
            for (const [key, value] of tmpMap.entries())
                solutionBookMap.set(key, value);
            solutionBookMap.loadTime = new Date();
        }
        catch (error)
        {
            if (error.code !== 'ENOENT')
                throw error;
            solutionBookMap.clear();
        }
    }
    return solutionBookMap;
}

function requireFS()
{
    const fs = require('fs');
    return fs;
}

function saveSolutionBookMap()
{
    const stringifyReplacer = createStringifyReplacer();
    const jsonString = JSON.stringify(solutionBookMap, stringifyReplacer, 4);
    const fs = requireFS();
    fs.writeFileSync(charMapRoot, jsonString);
}
