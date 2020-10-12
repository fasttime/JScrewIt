import createClusteringPlan                     from './clustering-plan';
import { _Math_max, _Math_pow, assignNoEnum }   from './obj-utils';
import { EMPTY_SOLUTION, DynamicSolution }      from 'novem';

export var APPEND_LENGTH_OF_DIGIT_0     = 6;
export var APPEND_LENGTH_OF_DOT         = 73;
export var APPEND_LENGTH_OF_FALSE       = 4;
export var APPEND_LENGTH_OF_EMPTY       = 3; // Append length of the empty array.
export var APPEND_LENGTH_OF_MINUS       = 136;
export var APPEND_LENGTH_OF_PLUS_SIGN   = 71;
export var APPEND_LENGTH_OF_SMALL_E     = 26;

export var APPEND_LENGTH_OF_DIGITS = [APPEND_LENGTH_OF_DIGIT_0, 8, 12, 17, 22, 27, 32, 37, 42, 47];

export var SCREW_NORMAL             = 0;
export var SCREW_AS_STRING          = 1;
export var SCREW_AS_BONDED_STRING   = 2;

export var ScrewBuffer;

export var optimizeSolutions;

(function ()
{
    function gatherGroup(solutions, bond, forceString)
    {
        var solution = new DynamicSolution();
        var count = solutions.length;
        if (count)
        {
            var index = 0;
            do
            {
                var subSolution = solutions[index];
                solution.append(subSolution);
            }
            while (++index < count);
        }
        else
            solution.append(EMPTY_SOLUTION);
        if (!solution.isString && forceString)
            solution.append(EMPTY_SOLUTION);
        var str = solution.replacement;
        if (bond && solution.isLoose)
            str = '(' + str + ')';
        return str;
    }

    ScrewBuffer =
    function (screwMode, groupThreshold, optimizerList)
    {
        function gather(offset, count, groupBond, groupForceString)
        {
            var end = offset + count;
            var groupSolutions = solutions.slice(offset, end);
            if (optimizerList.length)
                optimizeSolutions(optimizerList, groupSolutions, groupBond, groupForceString);
            var str = gatherGroup(groupSolutions, groupBond, groupForceString);
            return str;
        }

        var length = -APPEND_LENGTH_OF_EMPTY;
        var maxSolutionCount = _Math_pow(2, groupThreshold - 1);
        var solutions = [];
        var bond = screwMode === SCREW_AS_BONDED_STRING;
        var forceString = screwMode !== SCREW_NORMAL;

        assignNoEnum
        (
            this,
            {
                append:
                function (solution)
                {
                    if (solutions.length >= maxSolutionCount)
                        return false;
                    solutions.push(solution);
                    var appendLength = solution.appendLength;
                    optimizerList.forEach
                    (
                        function (optimizer)
                        {
                            var currentAppendLength = optimizer.appendLengthOf(solution);
                            if (currentAppendLength < appendLength)
                                appendLength = currentAppendLength;
                        }
                    );
                    length += appendLength;
                    return true;
                },
                get length()
                {
                    return length;
                },
                toString:
                function ()
                {
                    function collectOut(offset, count, maxGroupCount, groupBond)
                    {
                        var str;
                        if (count <= groupSize + 1)
                            str = gather(offset, count, groupBond);
                        else
                        {
                            maxGroupCount /= 2;
                            var halfCount = groupSize * maxGroupCount;
                            var capacity = 2 * halfCount - count;
                            var leftEndCount =
                            _Math_max
                            (
                                halfCount - capacity + capacity % (groupSize - 1),
                                (maxGroupCount / 2 ^ 0) * (groupSize + 1)
                            );
                            str =
                            collectOut(offset, leftEndCount, maxGroupCount) +
                            '+' +
                            collectOut
                            (offset + leftEndCount, count - leftEndCount, maxGroupCount, true);
                            if (groupBond)
                                str = '(' + str + ')';
                        }
                        return str;
                    }

                    var str;
                    var solutionCount = solutions.length;
                    if (solutionCount <= groupThreshold)
                        str = gather(0, solutionCount, bond, forceString);
                    else
                    {
                        var groupSize = groupThreshold;
                        var maxGroupCount = 2;
                        for (;;)
                        {
                            --groupSize;
                            var maxSolutionCountForDepth = groupSize * maxGroupCount;
                            if (solutionCount <= maxSolutionCountForDepth)
                                break;
                            maxGroupCount *= 2;
                        }
                        str = collectOut(0, solutionCount, maxGroupCount, bond);
                    }
                    return str;
                },
            }
        );
    };

    optimizeSolutions =
    function (optimizerList, solutions, bond, forceString)
    {
        var plan = createClusteringPlan();
        optimizerList.forEach
        (
            function (optimizer)
            {
                optimizer.optimizeSolutions(plan, solutions, bond, forceString);
            }
        );
        var clusters = plan.conclude();
        clusters.forEach
        (
            function (cluster)
            {
                var clusterer = cluster.data;
                var solution = clusterer();
                solutions.splice(cluster.start, cluster.length, solution);
            }
        );
    };
}
)();
