import { _Array_prototype_forEach, createEmpty, noop }  from './obj-utils';
import { APPEND_LENGTH_OF_EMPTY }                       from './screw-buffer';
import { LEVEL_STRING }                                 from './solution';

var createComplexOptimizer;

(function ()
{
    var BOND_EXTRA_LENGTH = 2; // Extra length of bonding parentheses "(" and ")".
    var NOOP_OPTIMIZER = { appendLengthOf: noop, optimizeSolutions: noop };

    function createOptimizer
    (complex, complexSolution, charSet, optimizedCharAppendLength, appendLengthDiff)
    {
        function appendLengthOf(solution)
        {
            var char = solution.char;
            if (char != null && char in charSet)
                return optimizedCharAppendLength;
        }

        function clusterer()
        {
            return complexSolution;
        }

        function matchComplex(solutions, start)
        {
            for (var index = 0; index < complexLength; ++index)
            {
                var solutionIndex = start + index;
                var solution = solutions[solutionIndex];
                var complexChar = complex[index];
                if (solution.char !== complexChar)
                    return false;
            }
            return true;
        }

        function optimizeSolutions(plan, solutions, bond, forceString)
        {
            for (var index = 0, limit = solutions.length - complexLength; index <= limit; ++index)
            {
                if (matchComplex(solutions, index))
                {
                    var saving = appendLengthDiff;
                    if (!limit)
                    {
                        if (forceString && complexSolution.level < LEVEL_STRING)
                            saving -= APPEND_LENGTH_OF_EMPTY;
                        else if (bond)
                            saving += BOND_EXTRA_LENGTH;
                    }
                    if (saving > 0)
                        plan.addCluster(index, complexLength, clusterer, saving);
                }
            }
        }

        var complexLength = complex.length;
        var optimizer = { appendLengthOf: appendLengthOf, optimizeSolutions: optimizeSolutions };
        return optimizer;
    }

    function createCharSet(charInfos, index)
    {
        var charSet = createEmpty();
        var charInfo;
        while (charInfo = charInfos[index++])
            charSet[charInfo.char] = null;
        return charSet;
    }

    createComplexOptimizer =
    function (encoder, complex, definition)
    {
        var optimizer;
        var discreteAppendLength = 0;
        var charMap = createEmpty();
        var charInfos = [];
        _Array_prototype_forEach.call
        (
            complex,
            function (char)
            {
                var charSolution = encoder.resolveCharacter(char);
                var charAppendLength = charSolution.appendLength;
                discreteAppendLength += charAppendLength;
                var charInfo = charMap[char];
                if (charInfo)
                    ++charInfo.count;
                else
                {
                    charInfo = charMap[char] =
                    { appendLength: charAppendLength, char: char, count: 1 };
                    charInfos.push(charInfo);
                }
            }
        );
        var complexSolution = encoder.resolve(definition);
        if (complexSolution.level == null)
            complexSolution.level = LEVEL_STRING;
        var solutionAppendLength = complexSolution.appendLength;
        var appendLengthDiff = discreteAppendLength - solutionAppendLength;
        if (appendLengthDiff + BOND_EXTRA_LENGTH > 0)
        {
            charInfos.sort
            (
                function (charInfo1, charInfo2)
                {
                    var result = charInfo1.appendLength - charInfo2.appendLength;
                    return result;
                }
            );
            var restLength = solutionAppendLength;
            var restCount = complex.length;
            for (var index = 0; restCount; ++index)
            {
                var charInfo = charInfos[index];
                var charAppendLength = charInfo.appendLength;
                if (charAppendLength * restCount > restLength)
                    break;
                var count = charInfo.count;
                restLength -= charAppendLength * count;
                restCount -= count;
            }
            var optimizedCharAppendLength = restLength / restCount | 0;
            var charSet = createCharSet(charInfos, index);
            optimizer =
            createOptimizer
            (complex, complexSolution, charSet, optimizedCharAppendLength, appendLengthDiff);
        }
        else
            optimizer = NOOP_OPTIMIZER;
        return optimizer;
    };
}
)();

export default createComplexOptimizer;
