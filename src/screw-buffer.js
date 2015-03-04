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
    
    ScrewBuffer =
        function (strongBound, groupThreshold)
        {
            var head = '';
            var tail = '';
            var lastSolution;
            var groupSize;
            
            Object.defineProperties(
                this,
                {
                    'append':
                    {
                        value: function (solution)
                        {
                            if (lastSolution)
                            {
                                if (groupSize)
                                {
                                    head += '+(';
                                    tail += ')';
                                }
                                else if (strongBound)
                                {
                                    head = '(';
                                    tail = ')';
                                }
                                if (
                                    lastSolution.level < LEVEL_OBJECT &&
                                    solution.level < LEVEL_OBJECT)
                                {
                                    if (solution.level > LEVEL_UNDEFINED)
                                    {
                                        head += lastSolution + '+[' + solution + ']';
                                    }
                                    else if (lastSolution.level > LEVEL_UNDEFINED)
                                    {
                                        head += '[' + lastSolution + ']+' + solution;
                                    }
                                    else
                                    {
                                        head += lastSolution + '+[]+' + solution;
                                    }
                                }
                                else
                                {
                                    head += appendSolution(lastSolution, solution);
                                }
                                groupSize = 2;
                                lastSolution = null;
                            }
                            else
                            {
                                if (!groupSize || groupSize >= groupThreshold)
                                {
                                    --groupThreshold;
                                    if (groupThreshold <= 0)
                                    {
                                        return false;
                                    }
                                    lastSolution = solution;
                                }
                                else
                                {
                                    head = appendSolution(head, solution);
                                    ++groupSize;
                                }
                            }
                            return true;
                        }
                    },
                    'length':
                    {
                        get: function ()
                        {
                            var length;
                            if (head)
                            {
                                length = head.length + tail.length;
                                if (lastSolution)
                                {
                                    length += getAppendLength(lastSolution);
                                }
                            }
                            else
                            {
                                var stringify;
                                if (lastSolution)
                                {
                                    length = lastSolution.length;
                                    stringify = lastSolution.level < LEVEL_STRING;
                                }
                                else
                                {
                                    length = 2;
                                    stringify = true;
                                }
                                if (stringify)
                                {
                                    length += strongBound ? 5 : 3;
                                }
                            }
                            return length;
                        }
                    },
                    'toString':
                    {
                        value: function ()
                        {
                            var result;
                            if (head)
                            {
                                if (lastSolution)
                                {
                                    result = appendSolution(head, lastSolution);
                                }
                                else
                                {
                                    result = head;
                                }
                                result += tail;
                            }
                            else
                            {
                                var solution;
                                var stringify;
                                if (lastSolution)
                                {
                                    solution = lastSolution;
                                    stringify = lastSolution.level < LEVEL_STRING;
                                }
                                else
                                {
                                    solution = '[]';
                                    stringify = true;
                                }
                                if (stringify)
                                {
                                    result = solution + '+[]';
                                    if (strongBound)
                                    {
                                        result = '(' + result + ')';
                                    }
                                }
                                else
                                {
                                    result = lastSolution + '';
                                }
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
