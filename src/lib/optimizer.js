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
    
    function getMinRadix(char)
    {
        var minRadix = parseInt(char, 36) + 1;
        return minRadix;
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
    
    function isClusterable(solution)
    {
        var char = solution.char;
        var clusterable = char != null && /[\da-z]/.test(char);
        return clusterable;
    }
    
    function subCreateOptimizer(toStringReplacement)
    {
        function applyPlan(plan, solutions)
        {
            var clusters = plan.conclude();
            clusters.forEach(
                function (cluster)
                {
                    var data = cluster.data;
                    var replacement =
                        '(+(' + replaceMultiDigitString(data.decimal) + '))[' +
                        toStringReplacement + '](' + replaceMultiDigitString(data.radix) + ')';
                    var solution = createSolution(replacement, LEVEL_STRING, false);
                    solutions.splice(cluster.start, cluster.length, solution);
                }
            );
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
        
        function optimizeSolutions(solutions, bond)
        {
            var plan = createClusteringPlan();
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
            applyPlan(plan, solutions);
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
