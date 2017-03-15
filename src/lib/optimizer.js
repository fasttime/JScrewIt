/* global Empty, math_min, replaceMultiDigitNumber */

var createOptimizer;

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
    
    var CLUSTER_EXTRA_LENGTHS = [];
    var DECIMAL_DIGIT_MAX_COUNTS = [];
    var MAX_RADIX = 36;
    var MAX_SAFE_INTEGER = 0x1fffffffffffff;
    var MIN_CLUSTER_LENGTH = 2;
    var RADIX_REPLACEMENTS = [];
    
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
    
    function subCreateOptimizer(toStringReplacement)
    {
        function createClusterer(decimalReplacement, radixReplacement)
        {
            var clusterer =
                function ()
                {
                    var replacement =
                        '(+(' + decimalReplacement + '))[' + toStringReplacement + '](' +
                        radixReplacement + ')';
                    return replacement;
                };
            return clusterer;
        }
        
        function isSaving(solution)
        {
            var char = solution.char;
            var saving = optimizedLengthCache[char] <= solution.appendLength;
            return saving;
        }
        
        function optimizeAppendLength(solution)
        {
            var appendLength = solution.appendLength;
            var char = solution.char;
            if (char != null && /[bcghjkmopqvwxz]/.test(char))
            {
                var optimizedLength = optimizedLengthCache[char];
                if (optimizedLength == null)
                {
                    var minRadix = getMinRadix(char);
                    var clusterExtraLength = CLUSTER_EXTRA_LENGTHS[minRadix];
                    var decimalDigitMaxCount = DECIMAL_DIGIT_MAX_COUNTS[minRadix];
                    var partLength =
                        (clusterBaseLength + clusterExtraLength) / decimalDigitMaxCount | 0;
                    optimizedLengthCache[char] = optimizedLength =
                        math_min(appendLength, partLength);
                }
                appendLength = optimizedLength;
            }
            return appendLength;
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
                if (saving >= 0)
                {
                    var clusterer = createClusterer(decimalReplacement, radixReplacement);
                    plan.addCluster(start, chars.length, clusterer, saving);
                }
            }
            while (++radix <= MAX_RADIX);
        }
        
        function optimizeClusters(plan, solutions, start, maxClusterLength, bond)
        {
            var maxDigitChar = '';
            var discreteAppendLength = 0;
            var chars = '';
            var clusterLength = 0;
            do
            {
                var solution = solutions[start + clusterLength];
                discreteAppendLength += solution.appendLength;
                var char = solution.char;
                if (maxDigitChar < char)
                    maxDigitChar = char;
                chars += char;
                if (
                    ++clusterLength >= MIN_CLUSTER_LENGTH &&
                    discreteAppendLength > clusterBaseLength)
                {
                    var minRadix = getMinRadix(maxDigitChar);
                    // If a bonding is required, an integral cluster can save two additional
                    // characters by omitting a pair of parentheses.
                    if (bond && !start && clusterLength === maxClusterLength)
                        discreteAppendLength += 2;
                    var clusterTooLong =
                        optimizeCluster(plan, start, minRadix, discreteAppendLength, chars);
                    if (clusterTooLong)
                        break;
                }
            }
            while (clusterLength < maxClusterLength);
        }
        
        function optimizeSequence(plan, solutions, start, end, bond)
        {
            for (;; ++start)
            {
                var maxLength = end - start;
                if (solutions[start].char !== '0')
                    optimizeClusters(plan, solutions, start, maxLength, bond);
                if (maxLength <= MIN_CLUSTER_LENGTH)
                    break;
            }
        }
        
        function optimizeSolutions(plan, solutions, bond)
        {
            var end;
            var saving;
            for (var start = solutions.length; start > 0;)
            {
                var solution = solutions[--start];
                if (isClusterable(solution))
                {
                    if (!end)
                    {
                        end = start + 1;
                        saving = false;
                    }
                    if (!saving)
                        saving = isSaving(solution);
                    if (saving && end - start >= MIN_CLUSTER_LENGTH)
                        optimizeSequence(plan, solutions, start, end, bond);
                }
                else
                    end = undefined;
            }
        }
        
        // Adding 7 for "+(", ")[", "](" and ")"
        var clusterBaseLength = toStringReplacement.length + 7;
        var optimizedLengthCache = new Empty();
        var optimizer =
            { optimizeAppendLength: optimizeAppendLength, optimizeSolutions: optimizeSolutions };
        return optimizer;
    }
    
    createOptimizer =
        function (encoder)
        {
            var toStringReplacement = encoder.replaceString('toString');
            var optimizer = subCreateOptimizer(toStringReplacement);
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
