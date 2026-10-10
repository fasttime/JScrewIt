/* eslint-env ebdd/ebdd */
/* global expect, module, padRight, repeat, require, self */

'use strict';

(function ()
{
    function arrayFilledWith(element, length)
    {
        var array = Array(length);
        while (length) array[--length] = element;
        return array;
    }

    function checkLength(toStringReplacementLength, solution, expected)
    {
        var toStringReplacement = repeat('*', toStringReplacementLength);
        var optimizer = createOptimizer(toStringReplacement);
        var actual = optimizer.appendLengthOf(solution);
        expect(actual).toBe(expected);
    }

    function createOptimizer(toStringReplacement)
    {
        function resolveConstant()
        {
            return toStringSolution;
        }

        if (toStringReplacement === undefined)
            toStringReplacement = '"toString"';
        var toStringSolution = { replacement: toStringReplacement };
        var encoder = JScrewIt.debug.createEncoder();
        encoder.resolveConstant = resolveConstant;
        var optimizer = encoder._getOptimizer('toString');
        return optimizer;
    }

    function getIncompatibleFeatureSets()
    {
        var incompatibleFeatureSets = { __proto__: null };
        var elementaryFeatureObjs = Feature.ELEMENTARY;
        for (var index1 = elementaryFeatureObjs.length; --index1 >= 0;)
        {
            var elementaryFeatureObj1 = elementaryFeatureObjs[index1];
            for (var index2 = elementaryFeatureObjs.length; --index2 > index1;)
            {
                var elementaryFeatureObj2 = elementaryFeatureObjs[index2];
                if (Feature.areCompatible(elementaryFeatureObj1, elementaryFeatureObj2))
                    continue;
                var feature1 = elementaryFeatureObj1.name;
                var feature2 = elementaryFeatureObj2.name;
                var incompatibleFeatureSet1 =
                incompatibleFeatureSets[feature1] ||
                (incompatibleFeatureSets[feature1] = { __proto__: null });
                incompatibleFeatureSet1[feature2] = elementaryFeatureObj2;
                var incompatibleFeatureSet2 =
                incompatibleFeatureSets[feature2] ||
                (incompatibleFeatureSets[feature2] = { __proto__: null });
                incompatibleFeatureSet2[feature1] = elementaryFeatureObj1;
            }
        }
        return incompatibleFeatureSets;
    }

    // Returns a list of feature objects covering all maximal combinations of compatible features,
    // i.e. combinations to which no elementary feature can be added.
    function getMaximalFeatureObjs()
    {
        function maximizeFeature(featureObj)
        {
            var newFeatureObj;
            for (var featureName in incompatibleFeatureSets)
            {
                if (featureObj.includes(featureName))
                    continue;
                if (!Feature.areCompatible(featureObj, featureName))
                    continue;
                newFeatureObj = Feature(featureObj, featureName);
                maximizeFeature(newFeatureObj);
            }
            if (!newFeatureObj)
            {
                var mask = featureObj.mask;
                if (!maximalFeatureMasks.has(mask))
                {
                    maximalFeatureMasks.add(mask);
                    maximalFeatureObjs.push(featureObj);
                }
            }
        }

        var maximalFeatureObjs = [];
        var incompatibleFeatureSets = getIncompatibleFeatureSets();
        var compatibleFeatureNames =
        Feature.ELEMENTARY.filter
        (
            function (elementaryFeatureObj)
            {
                return !incompatibleFeatureSets[elementaryFeatureObj.name];
            }
        );
        var compatibleFeatureObj = Feature(compatibleFeatureNames);
        var maximalFeatureMasks = new JScrewIt.debug.MaskSet();
        maximizeFeature(compatibleFeatureObj);
        return maximalFeatureObjs;
    }

    function nextMultipleOf(minValue, divisor)
    {
        var nextMultiple = Math.ceil(minValue / divisor) * divisor;
        return nextMultiple;
    }

    var EXPECTED_REPLACEMENT =
    '(+(!![]+!![]+[!![]+!![]+!![]]+(+!![])))["toString"](!![]+!![]+[+[]])';

    var JScrewIt =
    typeof module !== 'undefined' ? require('../../node-jscrewit-test') : self.JScrewIt;
    var Feature = JScrewIt.Feature;

    describe
    (
        '`toString` optimizer',
        function ()
        {
            describe
            (
                '#appendLengthOf',
                function ()
                {
                    it
                    (
                        'does not optimize statically encoded small letters',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solution = { appendLength: 123, source: 'a' };
                            var actual = optimizer.appendLengthOf(solution);
                            expect(actual).toBeUndefined();
                        }
                    );
                    it
                    (
                        'does not optimize non-hexatridecimal digits',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solution = { appendLength: 123 };
                            var actual = optimizer.appendLengthOf(solution);
                            expect(actual).toBeUndefined();
                        }
                    );
                    it.per
                    (
                        [
                            { char: 'b', decimalMinLength: 64, radixMinLength: 15 },
                            { char: 'c', decimalMinLength: 64, radixMinLength: 15 },
                            { char: 'g', decimalMinLength: 54, radixMinLength: 15 },
                            { char: 'h', decimalMinLength: 54, radixMinLength: 15 },
                            { char: 'j', decimalMinLength: 54, radixMinLength: 15 },
                            { char: 'k', decimalMinLength: 54, radixMinLength: 17 },
                            { char: 'm', decimalMinLength: 50, radixMinLength: 20 },
                            { char: 'o', decimalMinLength: 50, radixMinLength: 20 },
                            { char: 'p', decimalMinLength: 50, radixMinLength: 20 },
                            { char: 'q', decimalMinLength: 50, radixMinLength: 20 },
                            { char: 'v', decimalMinLength: 48, radixMinLength: 26 },
                            { char: 'w', decimalMinLength: 48, radixMinLength: 31 },
                            { char: 'x', decimalMinLength: 48, radixMinLength: 36 },
                            { char: 'z', decimalMinLength: 48, radixMinLength: 46 },
                        ]
                    )
                    (
                        'optimizes "#.char"',
                        function (paramData)
                        {
                            var char                = paramData.char;
                            var decimalMinLength    = paramData.decimalMinLength;
                            var radixMinLength      = paramData.radixMinLength;
                            var minRadix = parseInt(char, 36) + 1;
                            var maxDecimalDigits =
                            Math.ceil(Math.log(0x1fffffffffffff) / Math.log(minRadix));
                            // 7 for "+(", ")[", "](" and ")"
                            var bulkLength = 7 + decimalMinLength + radixMinLength;
                            var enough =
                            nextMultipleOf(bulkLength, maxDecimalDigits) + maxDecimalDigits;
                            var toStringReplacementLength = enough - bulkLength;
                            var solution = { source: char, appendLength: Infinity };
                            checkLength
                            (
                                toStringReplacementLength,
                                solution,
                                enough / maxDecimalDigits
                            );
                            checkLength
                            (
                                toStringReplacementLength - 1,
                                solution,
                                enough / maxDecimalDigits - 1
                            );
                        }
                    );
                }
            );
            describe
            (
                '#optimizeSolutions',
                function ()
                {
                    var optimizeSolutions = JScrewIt.debug.optimizeSolutions;

                    it
                    (
                        'optimizes an integral cluster without bonding',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solutionB = { appendLength: 35, source: 'b' };
                            optimizer.appendLengthOf(solutionB);
                            var solutions = [solutionB, solutionB];
                            optimizeSolutions([optimizer], solutions, false);
                            expect(solutions.length).toBe(1);
                            expect(solutions[0].source).toBe('bb');
                            expect(solutions[0].replacement).toBe(EXPECTED_REPLACEMENT);
                        }
                    );
                    it
                    (
                        'does not optimize an integral cluster without bonding',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solutionB = { appendLength: 34, source: 'b' };
                            optimizer.appendLengthOf(solutionB);
                            var solutions = [solutionB, solutionB];
                            optimizeSolutions([optimizer], solutions, false);
                            expect(solutions.length).toBe(2);
                        }
                    );
                    it
                    (
                        'optimizes an integral cluster with bonding',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solutionB = { appendLength: 34, source: 'b' };
                            optimizer.appendLengthOf(solutionB);
                            var solutions = [solutionB, solutionB];
                            optimizeSolutions([optimizer], solutions, true);
                            expect(solutions.length).toBe(1);
                            expect(solutions[0].source).toBe('bb');
                            expect(solutions[0].replacement).toBe(EXPECTED_REPLACEMENT);
                        }
                    );
                    it
                    (
                        'optimizes an integral cluster starting with a weak solution',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solution1 = { appendLength: 25, isWeak: true,   source: '1' };
                            var solutionB = { appendLength: 35,                 source: 'b' };
                            optimizer.appendLengthOf(solution1);
                            optimizer.appendLengthOf(solutionB);
                            var solutions = [solution1, solutionB];
                            optimizeSolutions([optimizer], solutions, false);
                            expect(solutions.length).toBe(1);
                            expect(solutions[0].source).toBe('1b');
                            expect(solutions[0].replacement)
                            .toBe('(+(!![]+!![]+!![]+[+!![]]))["toString"](!![]+!![]+[+[]])');
                        }
                    );
                    it
                    (
                        'does not optimize an integral cluster starting with a weak solution',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solution1 = { appendLength: 24, isWeak: true,   source: '1' };
                            var solutionB = { appendLength: 35,                 source: 'b' };
                            optimizer.appendLengthOf(solution1);
                            optimizer.appendLengthOf(solutionB);
                            var solutions = [solution1, solutionB];
                            optimizeSolutions([optimizer], solutions, false);
                            expect(solutions.length).toBe(2);
                        }
                    );
                    it
                    (
                        'does not optimize a cluster where the first solution is "0"',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solution0 = { appendLength: 6,      source: '0' };
                            var solutionB = { appendLength: 100,    source: 'b' };
                            optimizer.appendLengthOf(solution0);
                            optimizer.appendLengthOf(solutionB);
                            var solutions = [solution0, solutionB];
                            optimizeSolutions([optimizer], solutions, false);
                            expect(solutions.length).toBe(2);
                        }
                    );
                    it
                    (
                        'does not optimize a cluster with a multicharacter solution',
                        function ()
                        {
                            var optimizer = createOptimizer();
                            var solutionTrue    = { appendLength: 4,    source: 'true' };
                            var solutionB       = { appendLength: 100,  source: 'b' };
                            optimizer.appendLengthOf(solutionTrue);
                            optimizer.appendLengthOf(solutionB);
                            var solutions = [solutionTrue, solutionB];
                            optimizeSolutions([optimizer], solutions, false);
                            expect(solutions.length).toBe(2);
                        }
                    );
                    it
                    (
                        'uses exponential optimization',
                        function ()
                        {
                            var toStringReplacement = padRight('"toString"', 100);
                            var optimizer = createOptimizer(toStringReplacement);
                            var chars = 1e10.toString(30);
                            var solutions =
                            Array.prototype.map.call
                            (
                                chars,
                                function (char)
                                {
                                    var solution = { appendLength: 50, source: char };
                                    optimizer.appendLengthOf(solution);
                                    return solution;
                                }
                            );
                            optimizeSolutions([optimizer], solutions, false);
                            expect(solutions.length).toBe(1);
                            expect(solutions[0].source).toBe(chars);
                            expect(solutions[0].replacement)
                            // (+"1e10")[padRight('"toString"', 100)]("30")
                            .toMatch(/^\(.{48}\)\[.{100}\]\(.{20}\)$/);
                        }
                    );
                    it
                    (
                        'does not cluster with decimals above MAX_SAFE_INTEGER',
                        function ()
                        {
                            var toStringReplacement = padRight('"toString"', 500);
                            var optimizer = createOptimizer(toStringReplacement);
                            var solutionZ = { appendLength: 100, source: 'z' };
                            optimizer.appendLengthOf(solutionZ);
                            var solutions = arrayFilledWith(solutionZ, 11);
                            optimizeSolutions([optimizer], solutions, true);
                            expect(solutions.length).toBe(2);
                            expect(solutions[0]).toBe(solutionZ);
                            expect(solutions[1].source).toBe('zzzzzzzzzz');
                        }
                    );
                    it
                    (
                        'does not create clusters below base 12',
                        function ()
                        {
                            // With any combination of features, the replacement of "toString" is
                            // longer than the total append length of any string of digits below 12
                            // that fits in a safe integer, the most expensive being
                            // "8999999999999999", so no such string is ever clustered.
                            // The trailing "b" makes the sequence eligible for optimization.
                            var DIGITS = '8999999999999999';
                            getMaximalFeatureObjs().forEach
                            (
                                function (featureObj)
                                {
                                    var encoder = JScrewIt.debug.createEncoder(featureObj);
                                    var optimizer = encoder._getOptimizer('toString');
                                    var solutionB = { appendLength: Infinity, source: 'b' };
                                    optimizer.appendLengthOf(solutionB);
                                    var solutions =
                                    Array.prototype.map.call
                                    (
                                        DIGITS,
                                        function (char)
                                        {
                                            var solution = encoder.resolveCharacter(char);
                                            return solution;
                                        }
                                    );
                                    solutions.push(solutionB);
                                    var clusterSources = [];
                                    var plan =
                                    {
                                        addCluster:
                                        function (start, length, clusterer)
                                        {
                                            var source = clusterer().source;
                                            clusterSources.push(source);
                                        },
                                    };
                                    optimizer.optimizeSolutions(plan, solutions);
                                    expect(clusterSources.length).toBeGreaterThan(0);
                                    clusterSources.forEach
                                    (
                                        function (source)
                                        {
                                            expect(source).toMatch(/[b-z]/);
                                        }
                                    );
                                }
                            );
                        }
                    );
                }
            );
        }
    );
}
)();
