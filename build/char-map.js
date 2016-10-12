/* eslint-env node */

'use strict';

function Interruption(blocker)
{
    this.blocker = blocker;
}

function createEmpty()
{
    var empty = Object.create(null);
    return empty;
}

function createExceptionalCharMap(toDoCharMap)
{
    var exceptionalCharMap = createEmpty();
    for (var char in toDoCharMap)
    {
        var exceptionalChars = createEmpty();
        if (findDependencyLoops(toDoCharMap, char, exceptionalChars, char))
            exceptionalCharMap[char] = exceptionalChars;
    }
    return exceptionalCharMap;
}

function createToDoCharMap()
{
    var getCharacterEntries = requireJScrewIt().debug.getCharacterEntries;
    var toDoCharMap = createEmpty();
    for (var charCode = 0; charCode <= 0xffff; ++charCode)
    {
        var char = String.fromCharCode(charCode);
        var entries = getCharacterEntries(char);
        if (entries)
        {
            var toDoEntry = toDoCharMap[char] = { blockedSet: createEmpty() };
            if (!entries.singleton)
                toDoEntry.definitionCount = entries.length;
        }
    }
    return toDoCharMap;
}

function findDependencyLoops(toDoCharMap, char, exceptionalChars, blocked)
{
    var toDoEntry = toDoCharMap[blocked];
    if (!toDoEntry)
        return;
    var blockedSet = toDoEntry.blockedSet;
    if (char in blockedSet)
        return true;
    var result;
    for (var blockedBlocked in blockedSet)
    {
        if (blockedBlocked in exceptionalChars)
            continue;
        exceptionalChars[blockedBlocked] = null;
        if (findDependencyLoops(toDoCharMap, char, exceptionalChars, blockedBlocked))
            result = true;
        else
            delete exceptionalChars[blockedBlocked];
    }
    return result;
}

function findKnownSolution(solutions, analyzer)
{
    var knownSolution;
    var knownLength = Infinity;
    var encoder = analyzer.encoder;
    solutions.forEach(
        function (solution)
        {
            var mask = solution.mask;
            if (encoder.hasFeatures(mask) && analyzer.doesNotExclude(mask))
            {
                var length = solution.length;
                if (length < knownLength)
                {
                    knownSolution = solution;
                    knownLength = length;
                }
                else if (length === knownLength)
                    knownSolution = null;
            }
        }
    );
    // If you ever get this error you may need to implement the logic to choose the optimal
    // character solution out of two or more with the same length.
    if (knownSolution == null)
        throw new Error('No single determinate solution found.');
    return knownSolution;
}

function multiSolve(char, doneCharMap, exceptionalChars)
{
    function resolveCharacter(char)
    {
        var solutions = doneCharMap[char];
        if (solutions)
        {
            var solution = findKnownSolution(solutions, analyzer);
            return solution;
        }
        if (!(char in exceptionalChars))
            throw new Interruption(char);
    }
    
    var Analyzer = require('./analyzer');
    var analyzer = new Analyzer();
    var maskAnd = requireJScrewIt().debug.maskAnd;
    var entryIndexSet = createEmpty();
    var outputMap = createEmpty();
    for (var encoder; encoder = analyzer.nextEncoder;)
    {
        prepareEncoder(encoder, resolveCharacter);
        var mask = analyzer.featureObj.mask.slice();
        var solution = encoder.resolveCharacter(char);
        var outputSolution = outputMap[solution];
        if (outputSolution)
            maskAnd(outputSolution.mask, mask);
        else
        {
            solution.mask = mask;
            outputMap[solution] = solution;
            var entryIndex = solution.entryIndex;
            if (entryIndex !== void 0)
                entryIndexSet[entryIndex] = null;
        }
    }
    var solutions =
        Object.keys(outputMap).map(
            function (outputKey)
            {
                var solution = outputMap[outputKey];
                return solution;
            }
        );
    solutions.entryIndexCount = Object.keys(entryIndexSet).length;
    return solutions;
}

function parse(json)
{
    function reviver(key, value)
    {
        if (typeof value === 'object' && 'replacement' in value)
        {
            var solution = Object(value.replacement);
            for (var propName in value)
            {
                if (propName !== 'replacement')
                    solution[propName] = value[propName];
            }
            return solution;
        }
        return value;
    }
    
    var charMap = JSON.parse(json, reviver);
    return charMap;
}

function prepareEncoder(encoder, charResolver)
{
    var resolveCharacter = encoder.resolveCharacter;
    encoder.resolveCharacter =
        function (char)
        {
            var solution = charResolver(char);
            if (!solution)
                solution = resolveCharacter.apply(encoder, arguments);
            return solution;
        };
}

function requireJScrewIt()
{
    var JScrewIt = require('../lib/jscrewit');
    return JScrewIt;
}

function stringify(charMap)
{
    function createSolutionProxy(solution)
    {
        function toJSON()
        {
            var json = { replacement: String(solution) };
            var keys = Object.keys(solution);
            for (var index = keys.length; index-- > 0;)
            {
                var key = keys[index];
                if (/^\d/.test(key))
                    return json;
                json[key] = solution[key];
            }
        }
        
        var proxy = { toJSON: toJSON };
        return proxy;
    }
    
    var json = { };
    for (var char in charMap)
    {
        var solutions = charMap[char];
        json[char] = solutions.map(createSolutionProxy);
    }
    
    var str = JSON.stringify(json);
    return str;
}

var CharMap =
    function (callback)
    {
        var toDoCharMap = createToDoCharMap();
        var charCount = Object.keys(toDoCharMap).length;
        var doneCharMap = createEmpty();
        var doneCharCount = 0;
        var exceptionalCharMap = createEmpty();
        var interruptCount = 0;
        for (;;)
        {
            var newDoneCharMap = Object.create(doneCharMap);
            for (var char in toDoCharMap)
            {
                var exceptionalChars = exceptionalCharMap[char] || createEmpty();
                exceptionalChars[char] = null;
                try
                {
                    var solutions =
                        newDoneCharMap[char] = multiSolve(char, doneCharMap, exceptionalChars);
                    solutions.definitionCount = toDoCharMap[char].definitionCount;
                    delete toDoCharMap[char];
                    ++doneCharCount;
                    interruptCount = 0;
                }
                catch (error)
                {
                    if (!(error instanceof Interruption))
                        throw error;
                    var blocker = error.blocker;
                    ++interruptCount;
                    if (!newDoneCharMap[blocker])
                    {
                        var toDoEntry = toDoCharMap[blocker];
                        if (!toDoEntry)
                        {
                            toDoCharMap[blocker] = toDoEntry = { blockedSet: createEmpty() };
                            ++charCount;
                        }
                        toDoEntry.blockedSet[char] = null;
                    }
                }
                if (callback)
                    callback(charCount, doneCharCount + interruptCount / (interruptCount + 1));
            }
            doneCharMap = newDoneCharMap;
            if (charCount === doneCharCount)
                break;
            exceptionalCharMap = createExceptionalCharMap(toDoCharMap);
        }
        return doneCharMap;
    };

CharMap.FILE_NAME           = 'char-map.json';
CharMap.findKnownSolution   = findKnownSolution;
CharMap.parse               = parse;
CharMap.prepareEncoder      = prepareEncoder;
CharMap.stringify           = stringify;
module.exports = CharMap;
