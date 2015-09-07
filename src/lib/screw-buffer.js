/* global LEVEL_OBJECT, LEVEL_NUMERIC, LEVEL_STRING, LEVEL_UNDEFINED, assignNoEnum */

// This implementation assumes that all numeric solutions have an outer plus, and all other
// character solutions have none.

var ScrewBuffer;

var getAppendLength;
var hasOuterPlus;

(function ()
{
    'use strict';
    
    // The solution parameter must already have the outerPlus property set.
    function appendSolution(str, solution)
    {
        if (solution.outerPlus)
        {
            str += '+(' + solution + ')';
        }
        else
        {
            str += '+' + solution;
        }
        return str;
    }
    
    function getNumericJoinCost(level0, level1)
    {
        var joinCost = level0 > LEVEL_UNDEFINED || level1 > LEVEL_UNDEFINED ? 2 : 3;
        return joinCost;
    }
    
    function getSingleArrayItemExpr(solution)
    {
        var str = solution + (solution.level < LEVEL_NUMERIC ? '+[]' : '');
        return str;
    }
    
    function isNumericJoin(level0, level1)
    {
        var result = level0 < LEVEL_OBJECT && level1 < LEVEL_OBJECT;
        return result;
    }
    
    ScrewBuffer =
        function (strongBound, forceString, groupThreshold)
        {
            function canSplitRightEndForFree(lastBridgeIndex, limit)
            {
                var sideLength = limit - lastBridgeIndex;
                var result =
                    sideLength > 3 || sideLength > 2 && !isUnluckyRightEnd(lastBridgeIndex + 1);
                return result;
            }
            
            function findLastBridge(offset, limit)
            {
                for (var index = limit; index-- > offset;)
                {
                    var solution = solutions[index];
                    if (solution.bridge)
                    {
                        return index;
                    }
                }
            }
            
            function findNextBridge(index)
            {
                for (;; ++index)
                {
                    var solution = solutions[index];
                    if (solution.bridge)
                    {
                        return index;
                    }
                }
            }
            
            function findSplitIndex(
                offset,
                limit,
                intrinsicSplitCost,
                firstBridgeIndex,
                lastBridgeIndex)
            {
                var index = offset + 1;
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
                if (
                    optimalSplitCost + intrinsicSplitCost < 0 &&
                    !(optimalSplitCost > 0 && canSplitRightEndForFree(lastBridgeIndex, limit)))
                {
                    return splitIndex;
                }
            }
            
            function gather(offset, count, localStrongBound, localForceString)
            {
                function appendGroup(groupCount)
                {
                    str += sequence0(groupIndex, groupCount, '[[]]') + ')';
                }
                
                var str;
                var multiPart;
                var limit;
                var lastBridgeIndex;
                if (bridgeUsed)
                {
                    limit = offset + count;
                    lastBridgeIndex = findLastBridge(offset, limit);
                }
                if (lastBridgeIndex == null)
                {
                    str = sequence(offset, count);
                    multiPart = true;
                }
                else
                {
                    var bridgeIndex = findNextBridge(offset);
                    var groupIndex;
                    if (bridgeIndex - offset > 1)
                    {
                        var intrinsicSplitCost = localForceString ? -3 : localStrongBound ? 2 : 0;
                        groupIndex =
                            findSplitIndex(
                                offset,
                                limit,
                                intrinsicSplitCost,
                                bridgeIndex,
                                lastBridgeIndex
                            );
                    }
                    multiPart = groupIndex != null;
                    if (multiPart)
                    {
                        // Keep the first solutions out of the concat context to reduce output
                        // length.
                        var leftEndCount = groupIndex - offset;
                        str =
                            (
                                leftEndCount > 1 ?
                                sequence(offset, leftEndCount) : solutions[offset]
                            ) +
                            '+';
                    }
                    else
                    {
                        str = '';
                        groupIndex = offset;
                    }
                    str += '[' + sequence0(groupIndex, bridgeIndex - groupIndex, '[]') + ']';
                    for (;;)
                    {
                        str += solutions[bridgeIndex].bridge.block + '(';
                        groupIndex = bridgeIndex + 1;
                        if (bridgeIndex === lastBridgeIndex)
                        {
                            break;
                        }
                        bridgeIndex = findNextBridge(groupIndex);
                        appendGroup(bridgeIndex - groupIndex);
                    }
                    var rightEndCount = limit - groupIndex;
                    if (localForceString && !multiPart && rightEndCount > 1)
                    {
                        if (rightEndCount > 2 && isUnluckyRightEnd(groupIndex))
                        {
                            str += sequence(groupIndex, 2);
                            ++groupIndex;
                        }
                        else
                        {
                            var solution = solutions[groupIndex];
                            str += getSingleArrayItemExpr(solution);
                        }
                        str += ')';
                        while (++groupIndex < limit)
                        {
                            str = appendSolution(str, solutions[groupIndex]);
                        }
                        multiPart = true;
                    }
                    else
                    {
                        appendGroup(rightEndCount);
                    }
                    if (!multiPart && localForceString)
                    {
                        str += '+[]';
                        multiPart = true;
                    }
                }
                if (localStrongBound && multiPart)
                {
                    str = '(' + str + ')';
                }
                return str;
            }
            
            function getSplitCostAt(index, leftmost, rightmost)
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
                    (solutionRight.outerPlus ? 2 : 0) :
                    0
                ) -
                (
                    leftmost &&
                    isNumericJoin(levelCenter, levelLeft = solutions[index - 1].level) ?
                    getNumericJoinCost(levelLeft, levelCenter) :
                    solutionCenter.outerPlus ? 2 : 0
                );
                return splitCost;
            }
            
            function isUnluckyRightEnd(firstIndex)
            {
                var result =
                    solutions[firstIndex].level < LEVEL_NUMERIC &&
                    solutions[firstIndex + 1].level > LEVEL_UNDEFINED;
                return result;
            }
            
            function sequence(offset, count)
            {
                var str;
                var solution0 = solutions[offset];
                var solution1 = solutions[offset + 1];
                if (solution0.level < LEVEL_OBJECT && solution1.level < LEVEL_OBJECT)
                {
                    if (solution1.level > LEVEL_UNDEFINED)
                    {
                        str = solution0 + '+[' + solution1 + ']';
                    }
                    else if (solution0.level > LEVEL_UNDEFINED)
                    {
                        str = '[' + solution0 + ']+' + solution1;
                    }
                    else
                    {
                        str = solution0 + '+[]+' + solution1;
                    }
                }
                else
                {
                    str = appendSolution(solution0, solution1);
                }
                for (var index = 2; index < count; ++index)
                {
                    var solution = solutions[offset + index];
                    str = appendSolution(str, solution);
                }
                return str;
            }
            
            function sequence0(offset, count, emptyReplacement)
            {
                var str;
                if (count)
                {
                    if (count > 1)
                    {
                        str = sequence(offset, count);
                    }
                    else
                    {
                        var solution = solutions[offset];
                        str = getSingleArrayItemExpr(solution);
                    }
                }
                else
                {
                    str = emptyReplacement;
                }
                return str;
            }
            
            var solutions = [];
            var length = strongBound ? -1 : -3;
            var maxSolutionCount = Math.pow(2, groupThreshold - 1);
            var bridgeUsed;
            
            assignNoEnum(
                this,
                {
                    append: function (solution)
                    {
                        if (solutions.length >= maxSolutionCount)
                        {
                            return false;
                        }
                        if (solution.bridge)
                        {
                            bridgeUsed = true;
                        }
                        solutions.push(solution);
                        length += getAppendLength(solution);
                        return true;
                    },
                    get length ()
                    {
                        var result;
                        switch (solutions.length)
                        {
                        case 0:
                            result = forceString ? strongBound ? 7 : 5 : 0;
                            break;
                        case 1:
                            var solution = solutions[0];
                            result =
                                solution.length +
                                (
                                    forceString && solution.level < LEVEL_STRING ?
                                    strongBound ? 5 : 3 : 0
                                );
                            break;
                        default:
                            result = length;
                            break;
                        }
                        return result;
                    },
                    toString: function ()
                    {
                        function collectOut(offset, count, maxGroupCount, localStrongBound)
                        {
                            var str;
                            if (count <= groupSize + 1)
                            {
                                str = gather(offset, count, localStrongBound);
                            }
                            else
                            {
                                maxGroupCount /= 2;
                                var halfCount = groupSize * maxGroupCount;
                                var capacity = 2 * halfCount - count;
                                var leftEndCount =
                                    Math.max(
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
                                if (localStrongBound)
                                {
                                    str = '(' + str + ')';
                                }
                            }
                            return str;
                        }
                        
                        var singlePart;
                        var str;
                        var solutionCount = solutions.length;
                        if (!solutionCount)
                        {
                            singlePart = !forceString;
                            str = singlePart ? '' : '[]+[]';
                        }
                        else if (solutionCount === 1)
                        {
                            var solution = solutions[0];
                            singlePart = !forceString || solution.level > LEVEL_OBJECT;
                            str = solution + (singlePart ? '' : '+[]');
                        }
                        else if (solutionCount <= groupThreshold)
                        {
                            str = gather(0, solutionCount, strongBound, forceString);
                            singlePart = strongBound;
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
                                {
                                    break;
                                }
                                maxGroupCount *= 2;
                            }
                            str = collectOut(0, solutionCount, maxGroupCount, strongBound);
                            singlePart = strongBound;
                        }
                        if (strongBound && !singlePart)
                        {
                            str = '(' + str + ')';
                        }
                        return str;
                    }
                }
            );
        };
    
    getAppendLength =
        // This function assumes that only undefined or numeric solutions can have an outer plus.
        function (solution)
        {
            var length;
            var bridge = solution.bridge;
            if (bridge)
            {
                length = bridge.appendLength;
            }
            else
            {
                var extraLength = hasOuterPlus(solution) ? 3 : 1;
                length = solution.length + extraLength;
            }
            return length;
        };
    
    hasOuterPlus =
        // Determine whether the specified solution contains a plus sign out of brackets not
        // preceded by an exclamation mark.
        function (solution)
        {
            var outerPlus = solution.outerPlus;
            if (outerPlus == null)
            {
                var unclosed = 0;
                outerPlus =
                    solution.match(/!\+|./g).some(
                        function (match)
                        {
                            switch (match)
                            {
                            case '+':
                                return !unclosed;
                            case '(':
                            case '[':
                                ++unclosed;
                                break;
                            case ')':
                            case ']':
                                --unclosed;
                                break;
                            }
                            return false;
                        }
                    );
                solution.outerPlus = outerPlus;
            }
            return outerPlus;
        };
}
)();
