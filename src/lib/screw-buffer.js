/*
global
APPEND_LENGTH_OF_EMPTY,
LEVEL_NUMERIC,
LEVEL_OBJECT,
LEVEL_STRING,
LEVEL_UNDEFINED,
Solution,
assignNoEnum,
createClusteringPlan,
math_max,
math_pow,
*/

// This implementation assumes that all numeric solutions have an outer plus, and all other
// character solutions have none.

var ScrewBuffer;

var optimizeSolutions;

(function ()
{
    function canSplitRightEndForFree(solutions, lastBridgeIndex)
    {
        var rightEndIndex = lastBridgeIndex + 1;
        var rightEndLength = solutions.length - rightEndIndex;
        var result =
        rightEndLength > 2 || rightEndLength > 1 && !isUnluckyRightEnd(solutions, rightEndIndex);
        return result;
    }

    function findLastBridge(solutions)
    {
        for (var index = solutions.length; index--;)
        {
            var solution = solutions[index];
            if (solution.bridge)
                return index;
        }
    }

    function findNextBridge(solutions, index)
    {
        for (;; ++index)
        {
            var solution = solutions[index];
            if (solution.bridge)
                return index;
        }
    }

    function findSplitIndex(solutions, intrinsicSplitCost, firstBridgeIndex, lastBridgeIndex)
    {
        var index = 1;
        var lastIndex = firstBridgeIndex - 1;
        var optimalSplitCost = getSplitCostAt(solutions, index, true, index === lastIndex);
        var splitIndex = index;
        while (++index < firstBridgeIndex)
        {
            var splitCost = getSplitCostAt(solutions, index, false, index === lastIndex);
            if (splitCost < optimalSplitCost)
            {
                optimalSplitCost = splitCost;
                splitIndex = index;
            }
        }
        if
        (
            optimalSplitCost + intrinsicSplitCost < 0 &&
            !(optimalSplitCost > 0 && canSplitRightEndForFree(solutions, lastBridgeIndex))
        )
            return splitIndex;
    }

    function gatherGroup(solutions, groupBond, groupForceString, bridgeUsed)
    {
        function appendRightGroup(groupCount)
        {
            array.push(sequenceAsString(solutions, index, groupCount, '[[]]'), ')');
        }

        var array;
        var multiPart;
        var notStr;
        var count = solutions.length;
        if (count > 1)
        {
            var lastBridgeIndex;
            if (bridgeUsed)
                lastBridgeIndex = findLastBridge(solutions);
            multiPart = lastBridgeIndex == null;
            if (multiPart)
                array = sequence(solutions, 0, count);
            else
            {
                var bridgeIndex = findNextBridge(solutions, 0);
                var index;
                if (bridgeIndex > 1)
                {
                    var intrinsicSplitCost = groupForceString ? -3 : groupBond ? 2 : 0;
                    index =
                    findSplitIndex(solutions, intrinsicSplitCost, bridgeIndex, lastBridgeIndex);
                }
                multiPart = index != null;
                if (multiPart)
                {
                    // Keep the first solutions out of the concat context to reduce output
                    // length.
                    var preBridgeCount = index;
                    array =
                    preBridgeCount > 1 ? sequence(solutions, 0, preBridgeCount) : [solutions[0]];
                    array.push('+');
                }
                else
                {
                    array = [];
                    index = 0;
                }
                array.push('[', sequenceAsString(solutions, index, bridgeIndex - index, '[]'), ']');
                for (;;)
                {
                    array.push(solutions[bridgeIndex].bridge, '(');
                    index = bridgeIndex + 1;
                    if (bridgeIndex === lastBridgeIndex)
                        break;
                    bridgeIndex = findNextBridge(solutions, index);
                    appendRightGroup(bridgeIndex - index);
                }
                var groupCount;
                var rightEndCount = count - index;
                if (groupForceString && !multiPart && rightEndCount > 1)
                {
                    groupCount = rightEndCount > 2 && isUnluckyRightEnd(solutions, index) ? 2 : 1;
                    multiPart = true;
                }
                else
                    groupCount = rightEndCount;
                appendRightGroup(groupCount);
                index += groupCount - 1;
                while (++index < count)
                    pushSolution(array, solutions[index]);
            }
            notStr = !multiPart;
        }
        else
        {
            var solution = solutions[0];
            array = [solution];
            multiPart = false;
            notStr = solution.level < LEVEL_STRING;
        }
        if (notStr && groupForceString)
        {
            array.push('+[]');
            multiPart = true;
        }
        var str = array.join('');
        if (groupBond && multiPart)
            str = '(' + str + ')';
        return str;
    }

    function getNumericJoinCost(level0, level1)
    {
        var joinCost = level0 > LEVEL_UNDEFINED || level1 > LEVEL_UNDEFINED ? 2 : 3;
        return joinCost;
    }

    function getSplitCostAt(solutions, index, leftmost, rightmost)
    {
        var solutionCenter = solutions[index];
        var levelCenter = solutionCenter.level;
        var levelLeft;
        var levelRight;
        var solutionRight;
        var splitCost =
        (
            rightmost && levelCenter < LEVEL_NUMERIC ?
            3 :
            isNumericJoin
            (
                levelCenter,
                levelRight = (solutionRight = solutions[index + 1]).level
            ) ?
            getNumericJoinCost(levelCenter, levelRight) -
            (solutionRight.hasOuterPlus ? 2 : 0) :
            0
        ) -
        (
            leftmost &&
            isNumericJoin(levelCenter, levelLeft = solutions[index - 1].level) ?
            getNumericJoinCost(levelLeft, levelCenter) :
            solutionCenter.hasOuterPlus ? 2 : 0
        );
        return splitCost;
    }

    function isNumericJoin(level0, level1)
    {
        var result = level0 < LEVEL_OBJECT && level1 < LEVEL_OBJECT;
        return result;
    }

    function isUnluckyRightEnd(solutions, firstIndex)
    {
        var result =
        solutions[firstIndex].level < LEVEL_NUMERIC &&
        solutions[firstIndex + 1].level > LEVEL_UNDEFINED;
        return result;
    }

    function pushSolution(array, solution)
    {
        if (solution.hasOuterPlus)
            array.push('+(', solution, ')');
        else
            array.push('+', solution);
    }

    function sequence(solutions, offset, count)
    {
        var array;
        var solution0 = solutions[offset];
        var solution1 = solutions[offset + 1];
        if (solution0.level < LEVEL_OBJECT && solution1.level < LEVEL_OBJECT)
        {
            if (solution1.level > LEVEL_UNDEFINED)
                array = [solution0, '+[', solution1, ']'];
            else if (solution0.level > LEVEL_UNDEFINED)
                array = ['[', solution0, ']+', solution1];
            else
                array = [solution0, '+[]+', solution1];
        }
        else
        {
            array = [solution0];
            pushSolution(array, solution1);
        }
        for (var index = 2; index < count; ++index)
        {
            var solution = solutions[offset + index];
            pushSolution(array, solution);
        }
        return array;
    }

    function sequenceAsString(solutions, offset, count, emptyReplacement)
    {
        var str;
        if (count)
        {
            if (count > 1)
                str = sequence(solutions, offset, count).join('');
            else
            {
                var solution = solutions[offset];
                str = solution + (solution.level < LEVEL_NUMERIC ? '+[]' : '');
            }
        }
        else
            str = emptyReplacement;
        return str;
    }

    var EMPTY_SOLUTION = new Solution('[]', LEVEL_OBJECT, false);

    ScrewBuffer =
    function (bond, forceString, groupThreshold, optimizerList)
    {
        function gather(offset, count, groupBond, groupForceString)
        {
            var str;
            var end = offset + count;
            var groupSolutions = solutions.slice(offset, end);
            if (optimizerList.length)
                optimizeSolutions(optimizerList, groupSolutions, groupBond, groupForceString);
            str = gatherGroup(groupSolutions, groupBond, groupForceString, bridgeUsed);
            return str;
        }

        var bridgeUsed;
        var length = -APPEND_LENGTH_OF_EMPTY;
        var maxSolutionCount = math_pow(2, groupThreshold - 1);
        var solutions = [];

        assignNoEnum
        (
            this,
            {
                append:
                function (solution)
                {
                    if (solutions.length >= maxSolutionCount)
                        return false;
                    bridgeUsed |= !!solution.bridge;
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
                            math_max
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

                    var multiPart;
                    var str;
                    var solutionCount = solutions.length;
                    if (solutionCount < 2)
                    {
                        var solution = solutions[0] || EMPTY_SOLUTION;
                        multiPart = forceString && solution.level < LEVEL_STRING;
                        str = solution.replacement;
                        if (multiPart)
                            str += '+[]';
                        if
                        (
                            bond &&
                            (multiPart || solution.hasOuterPlus || solution.charAt(0) === '!')
                        )
                            str = '(' + str + ')';
                    }
                    else
                    {
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
