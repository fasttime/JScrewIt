// Optimized clusters take the form:
//
// btoa(X)
//
// X is a string of three or six bytes that encodes to the clustered characters, four or eight of
// them.
// Each clustered character must be in the base64 alphabet.
// Every three bytes are encoded by four base64 characters, so only runs of four or eight characters
// are clustered: the base64 encoding of a string whose length is not a multiple of three would end
// with padding characters.
// A cluster is at least as long as the btoa replacement with its enclosing parentheses, so the
// argument is only resolved for runs of characters whose discrete append length could be beaten by
// such a cluster.
//
// The argument is replaced without optimizations.

import { _Math_min, createEmpty }       from '../obj-utils';
import { SimpleSolution, SolutionType } from '../solution';

var BOND_EXTRA_LENGTH = 2; // Extra length of bonding parentheses "(" and ")".
var CLUSTER_EXTRA_LENGTH = 3; // Length "(" and ")" around the argument plus the leading "+".

// The minimum and maximum number of single characters replaced by a cluster.
// The number of clustered characters is always a multiple of MIN_CLUSTER_LENGTH.
// Longer runs of characters are encoded more efficiently by strategies other than the plain
// strategy.
var MIN_CLUSTER_LENGTH = 4;
var MAX_CLUSTER_LENGTH = 8;

function isClusterable(solution)
{
    var source = solution.source;
    var returnValue = source != null && /^[+/\dA-Za-z]$/.test(source);
    return returnValue;
}

export default function createOptimizer(encoder)
{
    function appendLengthOf(solution)
    {
        if (isClusterable(solution))
            return minBtoaCharAppendLength;
    }

    function createClusterer(base64)
    {
        var clusterer =
        function ()
        {
            var replacement = btoaReplacement + '(' + replaceArg(base64) + ')';
            var solution = new SimpleSolution(base64, replacement, SolutionType.STRING);
            return solution;
        };
        return clusterer;
    }

    function optimizeSolutions(plan, solutions)
    {
        var solutionCount = solutions.length;
        for (var index = 0, end = solutionCount - MIN_CLUSTER_LENGTH; index <= end; index++)
        {
            var base64 = '';
            var discreteAppendLength = 0;
            var limit = _Math_min(index + MAX_CLUSTER_LENGTH, solutionCount);
            for (var subIndex = index; subIndex < limit; subIndex++)
            {
                var solution = solutions[subIndex];
                if (!isClusterable(solution))
                    break;
                base64 += solution.source;
                discreteAppendLength += solution.appendLength;
                if (!(base64.length % MIN_CLUSTER_LENGTH))
                    tryCluster(plan, index, base64, discreteAppendLength);
            }
        }
    }

    function replaceArg(base64)
    {
        var arg = atob(base64);
        var replacement = encoder.replaceString(arg);
        return replacement;
    }

    function tryCluster(plan, start, base64, discreteAppendLength)
    {
        // The saving of a cluster can exceed the difference between the append lengths by at most
        // the length of the bonding parentheses.
        if (discreteAppendLength + BOND_EXTRA_LENGTH <= minClusterAppendLength)
            return;
        // The replacement lengths of the arguments are cached for the optimizer lifetime.
        var argLength = argLengths[base64];
        if (argLength == null)
            argLength = argLengths[base64] = replaceArg(base64).length;
        var saving = discreteAppendLength - minClusterAppendLength - argLength;
        var clusterer = createClusterer(base64);
        plan.addCluster(start, base64.length, clusterer, saving, SolutionType.STRING);
    }

    var argLengths = createEmpty();
    var btoaReplacement = encoder.resolveConstant('btoa').replacement;
    var minClusterAppendLength = btoaReplacement.length + CLUSTER_EXTRA_LENGTH;
    var minBtoaCharAppendLength = minClusterAppendLength / MAX_CLUSTER_LENGTH | 0;
    var optimizer = { appendLengthOf: appendLengthOf, optimizeSolutions: optimizeSolutions };
    return optimizer;
}

createOptimizer.key = 'btoa';
createOptimizer.matches =
function (encoder, str)
{
    var returnValue = /[+/\dA-Za-z]{4}/.test(str);
    return returnValue;
};
