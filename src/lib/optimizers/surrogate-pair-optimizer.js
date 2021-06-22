import { codePointFromSurrogatePair, shortestOf }   from '../encoder/encoder-utils';
import { _Math_min }                                from '../obj-utils';
import { SimpleSolution, SolutionType }             from 'novem';

function calculateMinSurrogateAppendLength(encoder)
{
    var minLengthByCharCode = encoder.$replaceCharByCharCode(100000).length;
    var minLengthByEscSeq   = encoder.$replaceCharByEscSeq(0x10000).length;
    var minSurrogateAppendLength = _Math_min(minLengthByCharCode, minLengthByEscSeq) + 1 >> 1;
    return minSurrogateAppendLength;
}

function createClusterer(source, replacement)
{
    function clusterer()
    {
        var solution = new SimpleSolution(source, replacement, SolutionType.STRING);
        return solution;
    }

    return clusterer;
}

function getCharCodeInRange(source, from, to)
{
    if (source && source.length === 1)
    {
        var charCode = source.charCodeAt();
        if (charCode >= from && charCode <= to)
            return charCode;
    }
}

export default function (encoder)
{
    var minSurrogateAppendLength = calculateMinSurrogateAppendLength(encoder);
    var appendLengthOf =
    function (solution)
    {
        var source = solution.source;
        if (source && source.length === 1)
        {
            var charCode = source.charCodeAt();
            if (charCode >= 0xd800 && charCode <= 0xdfff)
                return minSurrogateAppendLength;
        }
    };
    var optimizeSolutions =
    function (plan, solutions, bond)
    {
        for (var index = solutions.length - 1; index--;)
        {
            var solution1 = solutions[index];
            var source1 = solution1.source;
            var charCode1 = getCharCodeInRange(source1, 0xd800, 0xdbff);
            if (!charCode1)
                continue;
            var solution2 = solutions[index + 1];
            var source2 = solution2.source;
            var charCode2 = getCharCodeInRange(source2, 0xdc00, 0xdfff);
            if (!charCode2)
                continue;
            var codePoint = codePointFromSurrogatePair(charCode1, charCode2);
            var replacementByCharCode   = encoder.$replaceCharByCharCode(codePoint);
            var replacementByEscSeq     = encoder.$replaceCharByEscSeq(codePoint);
            var replacement = shortestOf(replacementByCharCode, replacementByEscSeq);
            var length = replacement.length;
            var saving = solution1.length + 1 + solution2.length - length;
            if (solutions.length === 2 && bond)
                saving += 2; // "(" + ")"
            if (saving > 0)
            {
                var source = source1 + source2;
                var clusterer = createClusterer(source, replacement);
                plan.addCluster(index, 2, clusterer, saving);
            }
        }
    };
    var optimizer = { appendLengthOf: appendLengthOf, optimizeSolutions: optimizeSolutions };
    return optimizer;
}
