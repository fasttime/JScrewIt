import { SCREW_AS_STRING }  from '../screw-buffer';
import Solution             from '../solution';
import { SolutionType }     from 'novem';

function appendLengthOf(solution)
{
    if (solution.source === ',')
        return 0;
}

function countClusterableCommas(solutions, index)
{
    var commaCount = 0;
    if (solutions[index].source.length === 1)
    {
        for
        (
            var end = solutions.length - 2;
            index < end &&
            solutions[++index].source === ',' &&
            solutions[++index].source.length === 1;
        )
            ++commaCount;
    }
    return commaCount;
}

export default function createCommaOptimizer(encoder)
{
    function createClusterer(solutions, index, commaCount)
    {
        var bridgeChars = [];
        for (var limit = index + 2 * commaCount; index <= limit; index += 2)
        {
            var solution = solutions[index];
            bridgeChars.push(solution.source);
        }
        var clusterer =
        function ()
        {
            var source = bridgeChars.join(',');
            var bridge = bridgeChars.join('');
            var bridgeReplacement =
            encoder.replaceString(bridge, { optimize: true, screwMode: SCREW_AS_STRING });
            var replacement = rampReplacement + '(' + bridgeReplacement + ')';
            var solution = new Solution(source, replacement, SolutionType.OBJECT);
            return solution;
        };
        return clusterer;
    }

    function optimizeSolutions(plan, solutions, bond, forceString)
    {
        var solutionCount = solutions.length;
        for (var index = 0, end = solutionCount - 2; index < end;)
        {
            var commaCount = countClusterableCommas(solutions, index);
            if (commaCount)
            {
                var clusterLength = 2 * commaCount + 1;
                var saving = commaCount * commaAppendLength - extraLength;
                var singlePart = !index && clusterLength === solutionCount;
                if (singlePart)
                {
                    if (forceString)
                        saving -= 3; // "+[]"
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
                index += clusterLength;
            }
            else
                ++index;
        }
    }

    var commaAppendLength = encoder.resolveCharacter(',').appendLength;
    var rampReplacement = encoder.replaceExpr('[][SLICE_OR_FLAT].call');
    // Adding 2 for "(" and ")" around the bridge.
    var extraLength = rampReplacement.length + 2;
    var optimizer = { appendLengthOf: appendLengthOf, optimizeSolutions: optimizeSolutions };
    return optimizer;
}
