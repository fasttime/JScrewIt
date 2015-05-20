var ScrewBuffer;

var getAppendLength;
var hasOuterPlus;

/* global LEVEL_OBJECT, LEVEL_STRING, LEVEL_UNDEFINED */

(function ()
{
    'use strict';
    
    function appendSolution(string, solution)
    {
        if (hasOuterPlus(solution))
        {
            string += '+(' + solution + ')';
        }
        else
        {
            string += '+' + solution;
        }
        return string;
    }
    
    function sequence(solutions, start, count)
    {
        var string;
        var solution0 = solutions[start];
        var solution1 = solutions[start + 1];
        if (solution0.level < LEVEL_OBJECT && solution1.level < LEVEL_OBJECT)
        {
            if (solution1.level > LEVEL_UNDEFINED)
            {
                string = solution0 + '+[' + solution1 + ']';
            }
            else if (solution0.level > LEVEL_UNDEFINED)
            {
                string = '[' + solution0 + ']+' + solution1;
            }
            else
            {
                string = solution0 + '+[]+' + solution1;
            }
        }
        else
        {
            string = appendSolution(solution0, solution1);
        }
        for (var index = 2; index < count; ++index)
        {
            var solution = solutions[start + index];
            string = appendSolution(string, solution);
        }
        return string;
    }
    
    ScrewBuffer =
        function (strongBound, groupThreshold)
        {
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
                                    (strongBound && solution.level < LEVEL_STRING ? 2 : 0);
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
                            function collect(start, count, maxGroupCount)
                            {
                                var result;
                                if (count <= groupSize + 1)
                                {
                                    result = sequence(solutions, start, count);
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
                                    result =
                                        collect(start, leftCount, maxGroupCount) +
                                        '+(' +
                                        collect(
                                            start + leftCount,
                                            count - leftCount,
                                            maxGroupCount) +
                                        ')';
                                }
                                return result;
                            }
                            
                            var singlePart;
                            var result;
                            var solutionCount = solutions.length;
                            if (!solutionCount)
                            {
                                result = '[]+[]';
                            }
                            else if (solutionCount === 1)
                            {
                                var solution = solutions[0];
                                singlePart = solution.level > LEVEL_OBJECT;
                                result = solution + (singlePart ? '' : '+[]');
                            }
                            else if (solutionCount <= groupThreshold)
                            {
                                result = sequence(solutions, 0, solutionCount);
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
                                result = collect(0, solutionCount, maxGroupCount);
                            }
                            if (strongBound && !singlePart)
                            {
                                result = '(' + result + ')';
                            }
                            return result;
                        }
                    }
                }
            );
        };
    
    getAppendLength =
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
            if (solution.outerPlus != null)
            {
                return solution.outerPlus;
            }
            var unclosed = 0;
            var outerPlus =
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
            return outerPlus;
        };

})();
