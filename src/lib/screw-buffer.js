import { APPEND_LENGTH_OF_EMPTY }               from './append-lengths';
import createClusteringPlan                     from './clustering-plan';
import { _Math_max, _Math_pow, assignNoEnum }   from './obj-utils';
import { DynamicSolution, EMPTY_SOLUTION }      from './solution';

export var SCREW_NORMAL             = 0;
export var SCREW_AS_STRING          = 1;
export var SCREW_AS_BONDED_STRING   = 2;

function gather(buffer, offset, count, groupBond, groupForceString)
{
    var end = offset + count;
    var groupSolutions = buffer._solutions.slice(offset, end);
    var optimizerList = buffer._optimizerList;
    if (optimizerList.length)
        optimizeSolutions(optimizerList, groupSolutions, groupBond, groupForceString);
    var str = gatherGroup(groupSolutions, groupBond, groupForceString);
    return str;
}

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

export function ScrewBuffer(screwMode, groupThreshold, optimizerList)
{
    this._groupThreshold = groupThreshold;
    this._maxSolutionCount = _Math_pow(2, groupThreshold - 1);
    this._optimizerList = optimizerList;
    this._screwMode = screwMode;
    this._solutions = [];
    this._length = -APPEND_LENGTH_OF_EMPTY;
}

assignNoEnum
(
    ScrewBuffer.prototype,
    {
        get length()
        {
            return this._length;
        },
        append:
        function (solution)
        {
            var solutions = this._solutions;
            if (solutions.length >= this._maxSolutionCount)
                return false;
            solutions.push(solution);
            var appendLength = solution.appendLength;
            this._optimizerList.forEach
            (
                function (optimizer)
                {
                    var currentAppendLength = optimizer.appendLengthOf(solution);
                    if (currentAppendLength < appendLength)
                        appendLength = currentAppendLength;
                }
            );
            this._length += appendLength;
            return true;
        },
        toString:
        function ()
        {
            function collectOut(offset, count, maxGroupCount, groupBond)
            {
                var str;
                if (count <= groupSize + 1)
                    str = gather(buffer, offset, count, groupBond);
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
                    collectOut(offset + leftEndCount, count - leftEndCount, maxGroupCount, true);
                    if (groupBond)
                        str = '(' + str + ')';
                }
                return str;
            }

            var str;
            var solutionCount = this._solutions.length;
            var groupThreshold = this._groupThreshold;
            var screwMode = this._screwMode;
            var bond = screwMode === SCREW_AS_BONDED_STRING;
            if (solutionCount <= groupThreshold)
            {
                var forceString = screwMode !== SCREW_NORMAL;
                str = gather(this, 0, solutionCount, bond, forceString);
            }
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
                var buffer = this;
                str = collectOut(0, solutionCount, maxGroupCount, bond);
            }
            return str;
        },
    }
);

export function optimizeSolutions(optimizerList, solutions, bond, forceString)
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
}
