/* global LEVEL_STRING, Empty, createSolution, replaceMultiDigitNumber */

var getToStringOptimizer;

(function ()
{
    // Optimized clusters take the form:
    //
    // +(X)["toString"](Y)
    //
    // X is a JSFuck integer between 23 and MAX_SAFE_INTEGER.
    //
    // Y takes at least 15 charactes for "20" and at most 46 characters for "36".
    //
    // The leading append plus is omitted when the optimized cluster is the first element of a
    // group.
    
    var BOND_EXTRA_LENGTH = 2; // Extra length of bonding parentheses "(" and ")"
    var CLUSTER_EXTRA_LENGTHS = [];
    var DECIMAL_DIGIT_MAX_COUNTS = [];
    var MAX_RADIX = 36;
    var MAX_SAFE_INTEGER = 0x1fffffffffffff;
    var MIN_SOLUTION_SPAN = 2;
    var RADIX_REPLACEMENTS = [];
    
    function createOptimizer(toStringReplacement)
    {
        function appendLengthOf(solution)
        {
            var char = solution.char;
            if (char != null && /[bcghjkmopqvwxz]/.test(char))
            {
                var appendLength = appendLengthCache[char];
                if (appendLength == null)
                {
                    var minRadix = getMinRadix(char);
                    var clusterExtraLength = CLUSTER_EXTRA_LENGTHS[minRadix];
                    var decimalDigitMaxCount = DECIMAL_DIGIT_MAX_COUNTS[minRadix];
                    appendLength =
                        appendLengthCache[char] =
                        (clusterBaseLength + clusterExtraLength) / decimalDigitMaxCount | 0;
                }
                return appendLength;
            }
        }
        
        function createClusterer(decimalReplacement, radixReplacement)
        {
            var clusterer =
                function ()
                {
                    var replacement =
                        '(+(' + decimalReplacement + '))[' + toStringReplacement + '](' +
                        radixReplacement + ')';
                    var solution = createSolution(replacement, LEVEL_STRING, false);
                    return solution;
                };
            return clusterer;
        }
        
        function isExpensive(solution)
        {
            var char = solution.char;
            var expensive = appendLengthCache[char] <= solution.appendLength;
            return expensive;
        }
        
        function optimizeCluster(plan, start, radix, discreteAppendLength, chars)
        {
            do
            {
                var decimal = parseInt(chars, radix);
                if (decimal > MAX_SAFE_INTEGER)
                    return clusterAppendLength == null;
                var decimalReplacement = replaceMultiDigitNumber(decimal);
                // Adding 3 for leading "+(" and trailing ")".
                var decimalLength = decimalReplacement.length + 3;
                var radixReplacement = RADIX_REPLACEMENTS[radix];
                var radixLength = radixReplacement.length;
                var clusterAppendLength = clusterBaseLength + decimalLength + radixLength;
                var saving = discreteAppendLength - clusterAppendLength;
                if (saving > 0)
                {
                    var clusterer = createClusterer(decimalReplacement, radixReplacement);
                    plan.addCluster(start, chars.length, clusterer, saving);
                }
            }
            while (++radix <= MAX_RADIX);
        }
        
        function optimizeClusters(plan, solutions, start, maxSolutionSpan, bond)
        {
            var maxDigitChar = '';
            var discreteAppendLength = 0;
            var chars = '';
            var solutionSpan = 0;
            do
            {
                var solution = solutions[start + solutionSpan];
                discreteAppendLength += solution.appendLength;
                var char = solution.char;
                if (maxDigitChar < char)
                    maxDigitChar = char;
                chars += char;
                if (++solutionSpan >= MIN_SOLUTION_SPAN && discreteAppendLength > clusterBaseLength)
                {
                    var minRadix = getMinRadix(maxDigitChar);
                    // If a bonding is required, an integral cluster can save two additional
                    // characters by omitting a pair of parentheses.
                    if (bond && !start && solutionSpan === maxSolutionSpan)
                        discreteAppendLength += BOND_EXTRA_LENGTH;
                    var clusterTooLong =
                        optimizeCluster(plan, start, minRadix, discreteAppendLength, chars);
                    if (clusterTooLong)
                        break;
                }
            }
            while (solutionSpan < maxSolutionSpan);
        }
        
        function optimizeSequence(plan, solutions, start, end, bond)
        {
            for (;; ++start)
            {
                var maxSolutionSpan = end - start;
                if (solutions[start].char !== '0')
                    optimizeClusters(plan, solutions, start, maxSolutionSpan, bond);
                if (maxSolutionSpan <= MIN_SOLUTION_SPAN)
                    break;
            }
        }
        
        function optimizeSolutions(plan, solutions, bond)
        {
            var end;
            var expensive;
            for (var start = solutions.length; start > 0;)
            {
                var solution = solutions[--start];
                if (isClusterable(solution))
                {
                    if (!end)
                    {
                        end = start + 1;
                        expensive = false;
                    }
                    if (!expensive)
                        expensive = isExpensive(solution);
                    if (expensive && end - start >= MIN_SOLUTION_SPAN)
                        optimizeSequence(plan, solutions, start, end, bond);
                }
                else
                    end = undefined;
            }
        }
        
        // Adding 7 for "+(", ")[", "](" and ")"
        var clusterBaseLength = toStringReplacement.length + 7;
        var appendLengthCache = new Empty();
        var optimizer = { appendLengthOf: appendLengthOf, optimizeSolutions: optimizeSolutions };
        return optimizer;
    }
    
    function getMinRadix(char)
    {
        var minRadix = parseInt(char, MAX_RADIX) + 1;
        return minRadix;
    }
    
    function isClusterable(solution)
    {
        var char = solution.char;
        var clusterable = char != null && /[\da-z]/.test(char);
        return clusterable;
    }
    
    getToStringOptimizer =
        function (encoder)
        {
            var toStringReplacement = encoder.resolveConstant('TO_STRING') + '';
            var optimizer = createOptimizer(toStringReplacement);
            return optimizer;
        };
    
    (function ()
    {
        // DECIMAL_MIN_LENGTHS is indexed by decimalDigitMaxCount (the number of digits used to
        // write MAX_SAFE_INTEGER in base radix).
        // decimalDigitMaxCount may only range from 11 (for radix 36) to 15 (for radix 12).
        var DECIMAL_MIN_LENGTHS =
        [
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            48, // 1e10
            50, // 1e11
            54, // 1e12
            ,
            64, // 1e14
        ];
        
        var minLength = Infinity;
        for (var radix = MAX_RADIX; radix >= 12; --radix)
        {
            var replacement = replaceMultiDigitNumber(radix);
            var length = replacement.length;
            if (length < minLength)
                minLength = length;
            RADIX_REPLACEMENTS[radix] = replacement;
            var decimalDigitMaxCount = DECIMAL_DIGIT_MAX_COUNTS[radix] =
                MAX_SAFE_INTEGER.toString(radix).length;
            CLUSTER_EXTRA_LENGTHS[radix] = DECIMAL_MIN_LENGTHS[decimalDigitMaxCount] + minLength;
        }
    }
    )();
}
)();
