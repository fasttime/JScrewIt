var ScrewBuffer;

var getAppendLength;
var hasOuterPlus;

/* global LEVEL_OBJECT, LEVEL_STRING, LEVEL_UNDEFINED */

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
    
    ScrewBuffer =
        function (strongBound, groupThreshold)
        {
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
            
            var solutions = [];
            var length = -1;
            var maxSolutionCount = Math.pow(2, groupThreshold - 1);
            
            Object.defineProperties(
                this,
                {
                    'append':
                    {
                        value: function (solution)
                        {
                            if (solutions.length >= maxSolutionCount)
                            {
                                return false;
                            }
                            solutions.push(solution);
                            length += getAppendLength(solution);
                            return true;
                        }
                    },
                    'length':
                    {
                        get: function ()
                        {
                            var result;
                            switch (solutions.length)
                            {
                            case 0:
                                result = strongBound ? 7 : 5;
                                break;
                            case 1:
                                var solution = solutions[0];
                                result =
                                    solution.length +
                                    (solution.level < LEVEL_STRING ? strongBound ? 5 : 3 : 0);
                                break;
                            default:
                                result = length + (strongBound ? 2 : 0);
                            }
                            return result;
                        }
                    },
                    'toString':
                    {
                        value: function ()
                        {
                            function collect(offset, count, maxGroupCount)
                            {
                                if (count <= groupSize + 1)
                                {
                                    str += sequence(offset, count);
                                }
                                else
                                {
                                    maxGroupCount /= 2;
                                    var halfCount = groupSize * maxGroupCount;
                                    var capacity = 2 * halfCount - count;
                                    var leftCount =
                                        Math.max(
                                            halfCount - capacity + capacity % (groupSize - 1),
                                            (maxGroupCount / 2 ^ 0) * (groupSize + 1)
                                        );
                                    collect(offset, leftCount, maxGroupCount);
                                    str += '+(';
                                    collect(offset + leftCount, count - leftCount, maxGroupCount);
                                    str += ')';
                                }
                            }
                            
                            var singlePart;
                            var str;
                            var solutionCount = solutions.length;
                            if (!solutionCount)
                            {
                                str = '[]+[]';
                            }
                            else if (solutionCount === 1)
                            {
                                var solution = solutions[0];
                                // Here we assume that string solutions never have an outer plus.
                                singlePart = solution.level > LEVEL_OBJECT;
                                str = solution + (singlePart ? '' : '+[]');
                            }
                            else if (solutionCount <= groupThreshold)
                            {
                                str = sequence(0, solutionCount);
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
                                str = '';
                                collect(0, solutionCount, maxGroupCount);
                            }
                            if (strongBound && !singlePart)
                            {
                                str = '(' + str + ')';
                            }
                            return str;
                        }
                    }
                }
            );
        };
    
    getAppendLength =
        // This function assumes that only undefined or numeric solutions can have an outer plus.
        function (solution)
        {
            var extraLength = hasOuterPlus(solution) ? 3 : 1;
            var length = solution.length + extraLength;
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
    
})();
