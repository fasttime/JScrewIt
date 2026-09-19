import { APPEND_LENGTH_OF_EMPTY }   from '../append-lengths';
import { SCREW_AS_STRING }          from '../screw-buffer';
import { SimpleSolution }           from '../solution';
import { SolutionType }             from '~solution';

function appendLengthOf(solution)
{
    if (solution.source === ',')
        return 0;
}

function countClusterableCommas(solutions, index)
{
    var commaCount = 0;
    if (isSingleCharacterSolution(solutions[index]))
    {
        for
        (
            var end = solutions.length - 2;
            index < end &&
            solutions[++index].source === ',' &&
            isSingleCharacterSolution(solutions[++index]);
        )
            ++commaCount;
    }
    return commaCount;
}

function isSingleCharacterSolution(solution)
{
    var source = solution.source;
    var returnValue = source && source.length === 1;
    return returnValue;
}

export default function (encoder)
{
    function createClusterer(solutions, index, commaCount)
    {
        var bridgeSolutions = [];
        for (var limit = index + 2 * commaCount; index <= limit; index += 2)
        {
            var solution = solutions[index];
            bridgeSolutions.push(solution);
        }
        var clusterer =
        function ()
        {
            var bridgeChars =
            bridgeSolutions.map
            (
                function (solution)
                {
                    return solution.source;
                }
            );
            var source = bridgeChars.join();
            var bridge = bridgeChars.join('');
            var bridgeReplacement =
            encoder.replaceString(bridge, { optimize: true, screwMode: SCREW_AS_STRING });
            var replacement = rampReplacement + '(' + bridgeReplacement + ')';
            var solution = new SimpleSolution(source, replacement, SolutionType.OBJECT);
            return solution;
        };
        return clusterer;
    }

    function optimizeSolutions(plan, solutions, bond, forceString)
    {
        var solutionCount = solutions.length;
        var end = solutionCount - 2;
        for (var index = 0; index < end; index++)
        {
            var maxCommaCount = countClusterableCommas(solutions, index);
            var commaAppendLength = 0;
            for (var commaCount = 1; commaCount <= maxCommaCount; commaCount++)
            {
                var clusterLength = 2 * commaCount + 1;
                var charSolution = solutions[index + clusterLength - 2];
                commaAppendLength += charSolution.appendLength;
                var saving = commaAppendLength - extraLength;
                var singlePart = !index && clusterLength >= solutionCount;
                if (singlePart)
                {
                    if (forceString)
                        saving -= APPEND_LENGTH_OF_EMPTY; // "+[]"
                    else if (bond)
                        saving += 2; // "(" + ")"
                }
                if (index && solutions[index].isWeak)
                    saving += 2; // Save a pair of parentheses.
                if (saving > 0)
                {
                    var clusterer = createClusterer(solutions, index, commaCount);
                    plan.addCluster(index, clusterLength, clusterer, saving);
                }
            }
        }
    }

    var rampReplacement = encoder.replaceExpr('[][SLICE_OR_FLAT].call');
    // Adding 2 for "(" and ")" around the bridge.
    var extraLength = rampReplacement.length + 2;
    var optimizer = { appendLengthOf: appendLengthOf, optimizeSolutions: optimizeSolutions };
    return optimizer;
}
