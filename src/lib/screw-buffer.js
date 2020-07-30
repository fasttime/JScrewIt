import createClusteringPlan                                 from './clustering-plan';
import { _Math_max, _Math_pow, assignNoEnum }               from './obj-utils';
import Solution                                             from './solution';
import { EMPTY_SOLUTION, DynamicSolution, SolutionType }    from 'novem';

// This implementation assumes that all numeric solutions have an outer plus, and all other
// character solutions have none.

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
    function gatherGroup(solutions, bond, forceString, bridgeUsed)
    {
        function appendRightBridgedParts(count)
        {
            var str = sequenceAsString(index, count, '[[]]');
            bridgedPartArray.push(str, ')');
        }

        function appendSolutions(solution, offset, count)
        {
            for (var end = offset + count; offset < end; ++offset)
            {
                var subSolution = solutions[offset];
                solution.append(subSolution);
            }
        }

        function canSplitRightEndForFree(lastBridgeIndex)
        {
            var rightEndIndex = lastBridgeIndex + 1;
            var rightEndLength = solutions.length - rightEndIndex;
            var returnValue =
            rightEndLength > 2 || rightEndLength > 1 && !isUnluckyRightEnd(rightEndIndex);
            return returnValue;
        }

        function findLastBridge()
        {
            for (var index = solutions.length; index--;)
            {
                var solution = solutions[index];
                if (solution.bridge)
                    return index;
            }
        }

        function findNextBridge(index)
        {
            for (;; ++index)
            {
                var solution = solutions[index];
                if (solution.bridge)
                    return index;
            }
        }

        function findSplitIndex(intrinsicSplitCost, firstBridgeIndex, lastBridgeIndex)
        {
            var index = 1;
            var lastIndex = firstBridgeIndex - 1;
            var optimalSplitCost = getSplitCostAt(index, true, index === lastIndex);
            var splitIndex = index;
            while (++index < firstBridgeIndex)
            {
                var splitCost = getSplitCostAt(index, false, index === lastIndex);
                if (splitCost < optimalSplitCost)
                {
                    optimalSplitCost = splitCost;
                    splitIndex = index;
                }
            }
            if
            (
                optimalSplitCost + intrinsicSplitCost < 0 &&
                !(optimalSplitCost > 0 && canSplitRightEndForFree(lastBridgeIndex))
            )
                return splitIndex;
        }

        function getSplitCostAt(index, leftmost, rightmost)
        {
            var solutionCenter = solutions[index];
            var solutionLeft;
            var solutionRight;
            var splitCost =
            (
                rightmost && solutionCenter.isUndefined ?
                3 :
                isArithmeticJoin(solutionCenter, solutionRight = solutions[index + 1]) ?
                getArithmeticJoinCost(solutionCenter, solutionRight) -
                (solutionRight.isWeak ? 2 : 0) :
                0
            ) -
            (
                leftmost &&
                isArithmeticJoin(solutionCenter, solutionLeft = solutions[index - 1]) ?
                getArithmeticJoinCost(solutionLeft, solutionCenter) :
                solutionCenter.isWeak ? 2 : 0
            );
            return splitCost;
        }

        function isUnluckyRightEnd(firstIndex)
        {
            var returnValue =
            solutions[firstIndex].isUndefined && !solutions[firstIndex + 1].isUndefined;
            return returnValue;
        }

        function sequenceAsString(offset, count, emptyReplacement)
        {
            var str;
            if (count)
            {
                var solution = new DynamicSolution();
                appendSolutions(solution, offset, count);
                if (solution.isUndefined)
                    solution.prepend(EMPTY_SOLUTION);
                str = solution.replacement;
            }
            else
                str = emptyReplacement;
            return str;
        }

        var solution = new DynamicSolution();
        var count = solutions.length;
        if (count > 1)
        {
            var lastBridgeIndex;
            if (bridgeUsed)
                lastBridgeIndex = findLastBridge();
            if (lastBridgeIndex == null)
                appendSolutions(solution, 0, count);
            else
            {
                var bridgeIndex = findNextBridge(0);
                var index;
                if (bridgeIndex > 1)
                {
                    var intrinsicSplitCost = forceString ? -3 : bond ? 2 : 0;
                    index = findSplitIndex(intrinsicSplitCost, bridgeIndex, lastBridgeIndex);
                }
                var singlePart = index == null;
                if (singlePart)
                    index = 0;
                else
                {
                    // Keep the first solutions out of the bridged context to reduce output length.
                    appendSolutions(solution, 0, index);
                }
                var bridgedPartArray =
                ['[', sequenceAsString(index, bridgeIndex - index, '[]'), ']'];
                for (;;)
                {
                    bridgedPartArray.push(solutions[bridgeIndex].bridge, '(');
                    index = bridgeIndex + 1;
                    if (bridgeIndex === lastBridgeIndex)
                        break;
                    bridgeIndex = findNextBridge(index);
                    appendRightBridgedParts(bridgeIndex - index);
                }
                var groupCount;
                var rightEndCount = count - index;
                if (forceString && singlePart && rightEndCount > 1)
                    groupCount = rightEndCount > 2 && isUnluckyRightEnd(index) ? 2 : 1;
                else
                    groupCount = rightEndCount;
                appendRightBridgedParts(groupCount);
                var bridgedReplacement = bridgedPartArray.join('');
                var bridgedSolution =
                new Solution(undefined, bridgedReplacement, SolutionType.OBJECT);
                solution.append(bridgedSolution);
                index += groupCount;
                appendSolutions(solution, index, count - index);
            }
        }
        else
            solution.append(solutions[0]);
        if (!solution.isString && forceString)
            solution.append(EMPTY_SOLUTION);
        var str = solution.replacement;
        if (bond && solution.isLoose)
            str = '(' + str + ')';
        return str;
    }

    function getArithmeticJoinCost(solution0, solution1)
    {
        var joinCost = solution0.isUndefined && solution1.isUndefined ? 3 : 2;
        return joinCost;
    }

    function isArithmeticJoin(solution0, solution1)
    {
        var returnValue = solution0.isArithmetic && solution1.isArithmetic;
        return returnValue;
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
            var str = gatherGroup(groupSolutions, groupBond, groupForceString, bridgeUsed);
            return str;
        }

        var bridgeUsed;
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
                    if (solution.bridge)
                        bridgeUsed = true;
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

                    if (!solutions.length)
                        solutions.push(EMPTY_SOLUTION);
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
