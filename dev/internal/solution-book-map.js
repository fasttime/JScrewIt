'use strict';

const JSCREWIT_PATH         = '../..';
const NICKNAME              = 'atai';
const TYPE_KEY              = '__type';
const TYPE_VALUE_SOLUTION   = 'Solution';

const JScrewIt      = require(JSCREWIT_PATH);
const SortedMap     = require('./sorted-map');

const charMapRoot   = require('path').resolve(__dirname, `../../.${NICKNAME}.char-map.json`);
const { debug } = JScrewIt;
const solutionBookMap = module.exports = new SortedMap();

module.exports.NICKNAME = NICKNAME;

Object.assign
(
    solutionBookMap,
    {
        clear:              clearSolutionBookMap,
        compareSolutions,
        importBook,
        index:              indexChar,
        load:               loadSolutionBookMap,
        loadTime:           undefined,
        save:               saveSolutionBookMap,
    },
);

function compareSolutions(solution1, solution2)
{
    let diff = solution1.length - solution2.length;
    if (!diff)
    {
        const entryCode1 = solution1.entryCode;
        const entryCode2 = solution2.entryCode;
        {
            const entryIndex1 = typeof entryCode1 === 'number' ? entryCode1 : -1;
            const entryIndex2 = typeof entryCode2 === 'number' ? entryCode2 : -1;
            diff = entryIndex1 - entryIndex2;
            if (!diff)
            {
                if (entryCode1 < entryCode2)
                    diff = -1;
                else if (entryCode1 > entryCode2)
                    diff = 1;
            }
        }
    }
    return diff;
}

function clearSolutionBookMap()
{
    SortedMap.prototype.clear.call(solutionBookMap);
    solutionBookMap.loadTime = undefined;
}

function createParseReviver()
{
    const { Feature } = JScrewIt;
    const { Solution, SolutionType } = debug;
    const parseReviverMap =
    new Map([[TYPE_VALUE_SOLUTION, jsonParseSolution], [SortedMap.name, jsonParseSortedMap]]);
    return parseReviver;

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

    function jsonParseSortedMap(obj)
    {
        const entries = Object.entries(obj);
        entries.forEach
        (
            entry =>
            {
                entry[0] = entry[0].replace(/^___/, '__');
            },
        );
        const map = new SortedMap(entries);
        return map;
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
    const { Solution, SolutionType } = debug;
    const featureFromMask = JScrewIt.Feature.fromMask;
    const stringifyReplacerMap =
    new SortedMap([[Solution, jsonReplaceSolution], [SortedMap, jsonReplaceSortedMap]]);
    return stringifyReplacer;

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
        obj.features = solution.masks.map(mask => featureFromMask(mask).canonicalNames);
        return obj;
    }

    function jsonReplaceSortedMap(map)
    {
        const obj = { __proto__: null, [TYPE_KEY]: SortedMap.name };
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

async function indexChar(char, updateProgress, missingCharacter)
{
    const Analyzer = require('./optimized-analyzer');

    const { maskIncludes } = debug;
    {
        const fs = requireFS();
        const path = require.resolve(JSCREWIT_PATH);
        const { mtime } = fs.statSync(path);
        const jscrewitTimestamp = Date.parse(mtime);
        const solutionIndex = new Map();
        const usedCharSet = await fillSolutionIndex(solutionIndex, char);
        const usedChars = [...usedCharSet].sort();
        const solutions = [...solutionIndex.values()];
        solutions.sort(compareSolutions);
        const solutionBook = { jscrewitTimestamp, usedChars, solutions };
        solutionBookMap.set(char, solutionBook);
        return solutionBook;
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

    async function fillSolutionIndex(solutionIndex, char)
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
        const executor =
        (resolve, reject) =>
        {
            try
            {
                const encoder = analyzer.nextEncoder;
                if (!encoder)
                    resolve();
                else
                {
                    const output = encoder.resolveCharacter(char);
                    addSolutionToIndex(solutionIndex, output, analyzer.featureObj);
                    updateProgress(analyzer.progress);
                    setImmediate(executor, resolve, reject);
                }
            }
            catch (error)
            {
                reject(error);
            }
        };
        await new Promise(executor);
        const { usedCharSet } = analyzer;
        return usedCharSet;
    }
}

function importBook(char, solutionBook)
{
    const { setPrototypeOf } = Object;
    const { Solution: { prototype: solutionPrototype } } = debug;

    const { solutions } = solutionBook;
    for (const solution of solutions)
        setPrototypeOf(solution, solutionPrototype);
    solutionBookMap.set(char, solutionBook);
}

function loadNewSolutionBookMap()
{
    const fs = requireFS();

    let jsonString;
    try
    {
        jsonString = fs.readFileSync(charMapRoot);
    }
    catch (error)
    {
        if (error.code !== 'ENOENT')
            throw error;
        const newMap = new SortedMap();
        return newMap;
    }
    const parseReviver = createParseReviver();
    const newMap = JSON.parse(jsonString, parseReviver);
    return newMap;
}

function loadSolutionBookMap()
{
    if (!solutionBookMap.loadTime)
    {
        const newMap = loadNewSolutionBookMap();
        solutionBookMap.clear();
        for (const [key, value] of newMap)
            solutionBookMap.set(key, value);
        solutionBookMap.loadTime = new Date();
    }
    return solutionBookMap;
}

function requireFS()
{
    const fs = require('fs');
    return fs;
}

async function saveSolutionBookMap()
{
    const stringifyReplacer = createStringifyReplacer();
    const jsonString = JSON.stringify(solutionBookMap, stringifyReplacer, 4);
    const fs = requireFS();
    await fs.promises.writeFile(charMapRoot, jsonString);
}
