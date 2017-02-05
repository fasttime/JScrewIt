/*
global
DIGIT_APPEND_LENGTHS,
LEVEL_STRING,
Empty,
array_prototype_forEach,
createClusteringPlan,
createSolution,
math_min,
replaceMultiDigitString,
*/

var createOptimizer;

(function ()
{
    var MAX_SAFE_INTEGER = 0x1fffffffffffff;
    var MIN_CLUSTER_LENGTH = 2;
    
    function findLastSolution(solutions, optimizable, index)
    {
        while (index > 0)
        {
            var char = solutions[--index].char;
            var actualOptimizable = char != null && /[\da-z]/.test(char);
            if (actualOptimizable === optimizable)
                return index;
        }
        return -1;
    }
    
    function getMultiDigitLength(str)
    {
        var appendLength = -3;
        array_prototype_forEach.call(
            str,
            function (digit)
            {
                var digitAppendLength = DIGIT_APPEND_LENGTHS[digit];
                appendLength += digitAppendLength;
            }
        );
        return appendLength;
    }
    
    function getMinRadix(char)
    {
        var minRadix = parseInt(char, 36) + 1;
        return minRadix;
    }
    
    function subCreateOptimizer(toStringReplacement)
    {
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
                    var maxDigits = MAX_SAFE_INTEGER.toString(minRadix).length;
                    var partLength = (clusterBaseLength + (15 - 1)) / maxDigits + 6 | 0;
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
                var decimalStr = decimal + '';
                var radixStr = radix + '';
                var decimalLength = getMultiDigitLength(decimalStr);
                var radixLength = getMultiDigitLength(radixStr);
                var clusterAppendLength = clusterBaseLength + decimalLength + radixLength;
                var saving = discreteAppendLength - clusterAppendLength;
                if (saving >= 0)
                {
                    var data = { decimal: decimalStr, radix: radixStr };
                    plan.addCluster(start, chars.length, data, saving);
                }
            }
            while (++radix <= 36);
        }
        
        function optimizeClusters(plan, solutions, start, maxClusterLength)
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
                    var clusterTooLong =
                        optimizeCluster(plan, start, minRadix, discreteAppendLength, chars);
                    if (clusterTooLong)
                        break;
                }
            }
            while (clusterLength < maxClusterLength);
        }
        
        function optimizeSequence(solutions, start, end)
        {
            var plan = createClusteringPlan();
            for (;; ++start)
            {
                var maxLength = end - start;
                if (solutions[start].char !== '0')
                    optimizeClusters(plan, solutions, start, maxLength);
                if (maxLength <= MIN_CLUSTER_LENGTH)
                    break;
            }
            var clusters = plan.conclude();
            clusters.forEach(
                function (cluster)
                {
                    var data = cluster.data;
                    var replacement =
                        '(' + replaceMultiDigitString(data.decimal) + ')[' + toStringReplacement +
                        '](' + replaceMultiDigitString(data.radix) + ')';
                    var solution = createSolution(replacement, LEVEL_STRING, false);
                    solutions.splice(cluster.start, cluster.length, solution);
                }
            );
        }
        
        function optimizeSolutions(solutions)
        {
            var start = solutions.length;
            var end;
            for (;;)
            {
                end = findLastSolution(solutions, true, start);
                if (end < 0)
                    break;
                start = findLastSolution(solutions, false, end);
                if (end - start >= MIN_CLUSTER_LENGTH)
                    optimizeSequence(solutions, start + 1, end + 1);
            }
        }
        
        // Optimized clusters take the form:
        //
        // +(+(X))["toString"](Y)
        //
        // X takes at least 5 chars for the first digit and 6 for other digits.
        // Y takes at least 15 chars for "20".
        var clusterBaseLength = toStringReplacement.length + 10;
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
}
)();
