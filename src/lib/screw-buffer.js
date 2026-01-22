import { APPEND_LENGTH_OF_EMPTY }           from './append-lengths';
import createClusteringPlan                 from './clustering-plan';
import { assignNoEnum }                     from './obj-utils';
import { DynamicSolution, EMPTY_SOLUTION }  from './solution';

export var SCREW_NORMAL             = 0;
export var SCREW_AS_STRING          = 1;
export var SCREW_AS_BONDED_STRING   = 2;

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

export function ScrewBuffer(screwMode, optimizerList)
{
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
        },
        toString:
        function ()
        {
            var screwMode = this._screwMode;
            var bond = screwMode === SCREW_AS_BONDED_STRING;
            var forceString = screwMode !== SCREW_NORMAL;
            var groupSolutions = this._solutions.slice();
            var optimizerList = this._optimizerList;
            if (optimizerList.length)
                optimizeSolutions(optimizerList, groupSolutions, bond, forceString);
            var str = gatherGroup(groupSolutions, bond, forceString);
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
