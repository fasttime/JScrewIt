import { SHORTCUTS }                                                        from '../definitions';
import { _Array_prototype_forEach_call, _Object_keys, createEmpty, noop }   from '../obj-utils';

var BOND_EXTRA_LENGTH = 2; // Extra length of bonding parentheses "(" and ")".
var NOOP_OPTIMIZER = { appendLengthOf: noop, optimizeSolutions: noop };

function createCharSet(charInfos, index)
{
    var charSet = createEmpty();
    var charInfo;
    while (charInfo = charInfos[index++])
        charSet[charInfo.char] = null;
    return charSet;
}

export default function createOptimizer(encoder, shortcut)
{
    var optimizer;
    var discreteAppendLength = 0;
    var charMap = createEmpty();
    var charInfos = [];
    _Array_prototype_forEach_call
    (
        shortcut,
        function (char)
        {
            var charSolution = encoder.resolveCharacter(char);
            var charAppendLength = charSolution.appendLength;
            discreteAppendLength += charAppendLength;
            var charInfo = charMap[char];
            if (charInfo)
                charInfo.count++;
            else
            {
                charInfo =
                charMap[char] =
                { appendLength: charAppendLength, char: char, count: 1 };
                charInfos.push(charInfo);
            }
        }
    );
    var definition = SHORTCUTS[shortcut].definition;
    var shortcutSolution = encoder.resolve(definition, shortcut);
    var solutionAppendLength = shortcutSolution.appendLength;
    var appendLengthDiff = discreteAppendLength - solutionAppendLength;
    // The saving of a cluster can exceed the difference between the append lengths by at most the
    // length of the bonding parentheses.
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
        var restCount = shortcut.length;
        for (var index = 0; restCount; index++)
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
        makeOptimizer
        (shortcut, shortcutSolution, charSet, optimizedCharAppendLength, appendLengthDiff);
    }
    else
        optimizer = NOOP_OPTIMIZER;
    return optimizer;
}

function makeOptimizer
(shortcut, shortcutSolution, charSet, optimizedCharAppendLength, appendLengthDiff)
{
    function appendLengthOf(solution)
    {
        var source = solution.source;
        if (source != null && source in charSet)
            return optimizedCharAppendLength;
    }

    function clusterer()
    {
        return shortcutSolution;
    }

    function matchShortcut(solutions, start)
    {
        for (var index = 0; index < shortcutLength; index++)
        {
            var solutionIndex = start + index;
            var solution = solutions[solutionIndex];
            var shortcutChar = shortcut[index];
            if (solution.source !== shortcutChar)
                return false;
        }
        return true;
    }

    function optimizeSolutions(plan, solutions)
    {
        for (var index = 0, limit = solutions.length - shortcutLength; index <= limit; index++)
        {
            if (matchShortcut(solutions, index))
                plan.addCluster(index, shortcutLength, clusterer, appendLengthDiff, solutionType);
        }
    }

    var shortcutLength = shortcut.length;
    var solutionType = shortcutSolution.type;
    var optimizer = { appendLengthOf: appendLengthOf, optimizeSolutions: optimizeSolutions };
    return optimizer;
}

createOptimizer.key = 'shortcut';
createOptimizer.subKeys = _Object_keys(SHORTCUTS);
createOptimizer.matches =
function (encoder, str, shortcut)
{
    var entry = SHORTCUTS[shortcut];
    var returnValue = encoder.hasFeatures(entry.mask) && str.indexOf(shortcut) >= 0;
    return returnValue;
};
