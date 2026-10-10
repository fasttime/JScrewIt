// Optimized clusters take the form:
//
// atob(X)
//
// X is a base64 string that decodes to the clustered characters, two to MAX_CLUSTER_LENGTH of them.
// Each clustered character must lie in the range U+0000 to U+00FF so that it can be represented as
// a single byte in the decoded output.
// Every three bytes are encoded by four base64 characters; one or two trailing bytes are encoded by
// two or three base64 characters respectively.
// A cluster is at least as long as the atob replacement with its enclosing parentheses, so the
// base64 argument is only resolved for runs of characters whose discrete append length could be
// beaten by such a cluster.
//
// The base64 argument is replaced without optimizations.

import { BASE64_ALPHABET_HI_2_CHARS, BASE64_ALPHABET_HI_4 } from '../definitions';
import findBase64AlphabetDefinition
from '../find-base64-alphabet-definition';
import { _Math_min, createEmpty }                           from '../obj-utils';
import { SimpleSolution, SolutionType }                     from '../solution';

var BASE64_ALPHABET =
'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

var BOND_EXTRA_LENGTH = 2; // Extra length of bonding parentheses "(" and ")".
var CLUSTER_EXTRA_LENGTH = 3; // Length "(" and ")" around the base64 argument plus the leading "+".

// The minimum and maximum number of single characters replaced by a cluster.
// Longer runs of characters are encoded more efficiently by strategies other than the plain
// strategy.
var MIN_CLUSTER_LENGTH = 2;
var MAX_CLUSTER_LENGTH = 8;

function encodeBase64(encoder, source)
{
    var base64 = '';
    var length = source.length;
    var bits;
    var index = 0;
    for (; index + 3 <= length; index += 3)
    {
        bits =
        source.charCodeAt(index) << 16 | source.charCodeAt(index + 1) << 8 |
        source.charCodeAt(index + 2);
        base64 +=
        BASE64_ALPHABET[bits >> 18 & 0x3f] +
        BASE64_ALPHABET[bits >> 12 & 0x3f] +
        BASE64_ALPHABET[bits >> 6 & 0x3f] +
        BASE64_ALPHABET[bits & 0x3f];
    }
    var lastCharCode = source.charCodeAt(length - 1);
    if (index + 1 === length)
    {
        base64 +=
        BASE64_ALPHABET[lastCharCode >> 2] + BASE64_ALPHABET_HI_2_CHARS[lastCharCode & 0x03];
    }
    else if (index + 2 === length)
    {
        bits = source.charCodeAt(index) << 8 | lastCharCode;
        var entry = BASE64_ALPHABET_HI_4[lastCharCode & 0x0f];
        var definition = findBase64AlphabetDefinition(encoder, entry);
        base64 +=
        BASE64_ALPHABET[bits >> 10 & 0x3f] + BASE64_ALPHABET[bits >> 4 & 0x3f] + definition[0];
    }
    return base64;
}

function isClusterable(solution)
{
    var source = solution.source;
    var returnValue = source && source.length === 1 && source.charCodeAt() < 0x100;
    return returnValue;
}

export default function createOptimizer(encoder)
{
    function appendLengthOf(solution)
    {
        if (isClusterable(solution))
            return minAtobCharAppendLength;
    }

    function optimizeSolutions(plan, solutions)
    {
        var solutionCount = solutions.length;
        for (var index = 0, end = solutionCount - MIN_CLUSTER_LENGTH; index <= end; index++)
        {
            var source = '';
            var discreteAppendLength = 0;
            var limit = _Math_min(index + MAX_CLUSTER_LENGTH, solutionCount);
            for (var subIndex = index; subIndex < limit; subIndex++)
            {
                var solution = solutions[subIndex];
                if (!isClusterable(solution))
                    break;
                source += solution.source;
                discreteAppendLength += solution.appendLength;
                if (source.length >= MIN_CLUSTER_LENGTH)
                    tryCluster(plan, index, source, discreteAppendLength);
            }
        }
    }

    function createClusterer(source, base64)
    {
        var clusterer =
        function ()
        {
            var replacement = atobReplacement + '(' + encoder.replaceString(base64) + ')';
            var solution = new SimpleSolution(source, replacement, SolutionType.STRING);
            return solution;
        };
        return clusterer;
    }

    function tryCluster(plan, start, source, discreteAppendLength)
    {
        // The saving of a cluster can exceed the difference between the append lengths by at most
        // the length of the bonding parentheses.
        if (discreteAppendLength + BOND_EXTRA_LENGTH <= minClusterAppendLength)
            return;
        var base64 = encodeBase64(encoder, source);
        // The replacement lengths of base64 strings are cached for the optimizer lifetime.
        var argLength = argLengths[base64];
        if (argLength == null)
            argLength = argLengths[base64] = encoder.replaceString(base64).length;
        var saving = discreteAppendLength - minClusterAppendLength - argLength;
        var clusterer = createClusterer(source, base64);
        plan.addCluster(start, source.length, clusterer, saving, SolutionType.STRING);
    }

    var argLengths = createEmpty();
    var atobReplacement = encoder.resolveConstant('atob').replacement;
    var minClusterAppendLength = atobReplacement.length + CLUSTER_EXTRA_LENGTH;
    var minAtobCharAppendLength = minClusterAppendLength / MAX_CLUSTER_LENGTH | 0;
    var optimizer = { appendLengthOf: appendLengthOf, optimizeSolutions: optimizeSolutions };
    return optimizer;
}

createOptimizer.key = 'atob';
createOptimizer.matches =
function (encoder, str)
{
    var returnValue = /[\0-\xff]{2}/.test(str);
    return returnValue;
};
