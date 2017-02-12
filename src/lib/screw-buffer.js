/*
global
LEVEL_NUMERIC,
LEVEL_OBJECT,
LEVEL_STRING,
LEVEL_UNDEFINED,
assignNoEnum,
math_max,
math_pow,
*/

// This implementation assumes that all numeric solutions have an outer plus, and all other
// character solutions have none.

var ScrewBuffer;

(function ()
{
    function canSplitRightEndForFree(solutions, lastBridgeIndex)
    {
        var rightEndIndex = lastBridgeIndex + 1;
        var rightEndLength = solutions.length - rightEndIndex;
        var result =
            rightEndLength > 2 ||
            rightEndLength > 1 && !isUnluckyRightEnd(solutions, rightEndIndex);
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
        if (
            optimalSplitCost + intrinsicSplitCost < 0 &&
            !(optimalSplitCost > 0 && canSplitRightEndForFree(solutions, lastBridgeIndex)))
            return splitIndex;
    }
    
    function gatherGroup(solutions, localBond, localForceString, bridgeUsed)
    {
        function appendRightGroup(groupCount)
        {
            array.push(sequenceAsString(solutions, index, groupCount, '[[]]'), ')');
        }
        
        var count = solutions.length;
        var lastBridgeIndex;
        if (bridgeUsed)
            lastBridgeIndex = findLastBridge(solutions);
        var array;
        var multiPart = lastBridgeIndex == null;
        if (multiPart)
            array = sequence(solutions, 0, count);
        else
        {
            var bridgeIndex = findNextBridge(solutions, 0);
            var index;
            if (bridgeIndex > 1)
            {
                var intrinsicSplitCost = localForceString ? -3 : localBond ? 2 : 0;
                index = findSplitIndex(solutions, intrinsicSplitCost, bridgeIndex, lastBridgeIndex);
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
            if (localForceString && !multiPart && rightEndCount > 1)
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
            if (!multiPart && localForceString)
            {
                array.push('+[]');
                multiPart = true;
            }
        }
        var str = array.join('');
        if (localBond && multiPart)
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
            isNumericJoin(
                levelCenter,
                levelRight = (solutionRight = solutions[index + 1]).level) ?
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
    
    ScrewBuffer =
        function (bond, forceString, groupThreshold, optimizer)
        {
            function gather(offset, count, localBond, localForceString)
            {
                var str;
                if (optimizer)
                {
                    var end = offset + count;
                    var groupSolutions = solutions.slice(offset, end);
                    if (optimizer)
                        optimizer.optimizeSolutions(groupSolutions);
                    str =
                        groupSolutions.length > 1 ?
                        gatherGroup(groupSolutions, localBond, localForceString, bridgeUsed) :
                        groupSolutions[0] + '';
                }
                else
                {
                    var array = sequence(solutions, offset, count);
                    str = array.join('');
                    if (localBond)
                        str = '(' + str + ')';
                }
                return str;
            }
            
            var bridgeUsed;
            var length = bond ? -1 : -3;
            var maxSolutionCount = math_pow(2, groupThreshold - 1);
            var solutions = [];
            
            assignNoEnum(
                this,
                {
                    append: function (solution)
                    {
                        if (solutions.length >= maxSolutionCount)
                            return false;
                        bridgeUsed |= !!solution.bridge;
                        solutions.push(solution);
                        length +=
                            optimizer ?
                            optimizer.optimizeAppendLength(solution) :
                            solution.appendLength;
                        return true;
                    },
                    get length()
                    {
                        var result;
                        switch (solutions.length)
                        {
                        case 0:
                            result = forceString ? bond ? 7 : 5 : 2;
                            break;
                        case 1:
                            var solution = solutions[0];
                            result =
                                solution.length +
                                (forceString && solution.level < LEVEL_STRING ? bond ? 5 : 3 : 0);
                            break;
                        default:
                            result = length;
                            break;
                        }
                        return result;
                    },
                    toString: function ()
                    {
                        function collectOut(offset, count, maxGroupCount, localBond)
                        {
                            var str;
                            if (count <= groupSize + 1)
                                str = gather(offset, count, localBond);
                            else
                            {
                                maxGroupCount /= 2;
                                var halfCount = groupSize * maxGroupCount;
                                var capacity = 2 * halfCount - count;
                                var leftEndCount =
                                    math_max(
                                        halfCount - capacity + capacity % (groupSize - 1),
                                        (maxGroupCount / 2 ^ 0) * (groupSize + 1)
                                    );
                                str =
                                    collectOut(offset, leftEndCount, maxGroupCount) +
                                    '+' +
                                    collectOut(
                                        offset + leftEndCount,
                                        count - leftEndCount,
                                        maxGroupCount,
                                        true
                                    );
                                if (localBond)
                                    str = '(' + str + ')';
                            }
                            return str;
                        }
                        
                        var multiPart;
                        var str;
                        var solutionCount = solutions.length;
                        if (solutionCount < 2)
                        {
                            if (solutionCount)
                            {
                                var solution = solutions[0];
                                multiPart = forceString && solution.level < LEVEL_STRING;
                                str = solution.replacement;
                            }
                            else
                            {
                                multiPart = forceString;
                                str = '[]';
                            }
                            if (multiPart)
                            {
                                str += '+[]';
                                if (bond)
                                    str = '(' + str + ')';
                            }
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
                    }
                }
            );
        };
}
)();
