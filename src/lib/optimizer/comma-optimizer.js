// Optimized clusters take the form:
//
// [][SLICE_OR_FLAT].call(X)
//
// X is the coil, a string made of the single characters without the interleaved commas.
// The coil is replaced with all optimizations enabled, so its replacement can be shorter than the
// concatenation of the replacements of its characters.
// In order to determine the exact saving of a candidate cluster, the coil is replaced when the
// cluster is registered rather than in the clusterer, and the solution obtained is reused by the
// clusterer.

import { SCREW_AS_STRING }              from '../screw-buffer';
import { SimpleSolution, SolutionType } from '../solution';

var REPLACE_STRING_OPTIONS = { optimize: true, screwMode: SCREW_AS_STRING };

function appendLengthOf(solution)
{
    if (solution.source === ',')
        return 0;
}

function canStartRun(solutions, index)
{
    // A single character preceded by a comma that is in turn preceded by a single character lies
    // inside a run started earlier.
    var returnValue =
    isSingleCharacterSolution(solutions[index]) &&
    !(
        index > 1 &&
        isCommaSolution(solutions[index - 1]) &&
        isSingleCharacterSolution(solutions[index - 2])
    );
    return returnValue;
}

function countClusterableCommas(solutions, index)
{
    var commaCount = 0;
    if (canStartRun(solutions, index))
    {
        for
        (
            var end = solutions.length - 2;
            index < end &&
            isCommaSolution(solutions[++index]) &&
            isSingleCharacterSolution(solutions[++index]);
        )
            commaCount++;
    }
    return commaCount;
}

function createClusterer(solution)
{
    var clusterer =
    function ()
    {
        return solution;
    };
    return clusterer;
}

export default function createOptimizer(encoder)
{
    function createClusterSolution(solutions, start, commaCount)
    {
        var coilChars = [];
        for (var index = start, limit = start + 2 * commaCount; index <= limit; index += 2)
        {
            var char = solutions[index].source;
            coilChars.push(char);
        }
        var source = coilChars.join();
        var coil = coilChars.join('');
        var coilReplacement = encoder.replaceString(coil, REPLACE_STRING_OPTIONS);
        var replacement = headReplacement + '(' + coilReplacement + ')';
        var solution = new SimpleSolution(source, replacement, SolutionType.OBJECT);
        return solution;
    }

    function optimizeSolutions(plan, solutions)
    {
        function tryCluster(start, commaCount)
        {
            if (commaCount < 1)
                return;
            var clusterLength = 2 * commaCount + 1;
            var discreteAppendLength = 0;
            for (var index = start, end = start + clusterLength; index < end; index++)
                discreteAppendLength += solutions[index].appendLength;
            var clusterSolution = createClusterSolution(solutions, start, commaCount);
            var saving = discreteAppendLength - clusterSolution.appendLength;
            var clusterer = createClusterer(clusterSolution);
            plan.addCluster(start, clusterLength, clusterer, saving, clusterSolution.type);
        }

        var solutionCount = solutions.length;
        var end = solutionCount - 2;
        for (var index = 0; index < end; index++)
        {
            var maxCommaCount = countClusterableCommas(solutions, index);
            if (maxCommaCount)
            {
                // Only the whole run and the runs obtained by dropping the first and/or last
                // character (and its adjacent comma) are considered.
                // A shorter cluster can only be preferable if another cluster competes for the
                // leading or trailing character, which requires a solution before or after the run.
                tryCluster(index, maxCommaCount);
                var dropFirst = index > 0;
                var dropLast = index + 2 * maxCommaCount < solutionCount - 1;
                if (dropLast)
                    tryCluster(index, maxCommaCount - 1);
                if (dropFirst)
                {
                    tryCluster(index + 2, maxCommaCount - 1);
                    if (dropLast)
                        tryCluster(index + 2, maxCommaCount - 2);
                }
            }
        }
    }

    var headReplacement = encoder.replaceExpr('[][SLICE_OR_FLAT].call');
    var optimizer = { appendLengthOf: appendLengthOf, optimizeSolutions: optimizeSolutions };
    return optimizer;
}

function isCommaSolution(solution)
{
    var returnValue = solution.source === ',';
    return returnValue;
}

function isSingleCharacterSolution(solution)
{
    var source = solution.source;
    var returnValue = source && source.length === 1;
    return returnValue;
}

createOptimizer.key = 'comma';
createOptimizer.matches =
function (encoder, str)
{
    var returnValue = /[^],[^]/.test(str);
    return returnValue;
};
