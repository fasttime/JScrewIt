/* eslint-env mocha */
/* global emuDo, expect, global, module, reloadJScrewIt, require, self */

'use strict';

(function ()
{
    function testFeatureObj(featureObj)
    {
        it
        (
            'is named correctly',
            function ()
            {
                var name = featureObj.name;
                expect(name).toBeString();
                expect(featureObj).toBe(Feature[name]);
                expect(featureObj).toBe(Feature.ALL[name]);
            }
        );
        it
        (
            'has description string property',
            function ()
            {
                expect(featureObj.description).toBeString();
            }
        );
        it
        (
            'has elementary boolean property',
            function ()
            {
                expect(featureObj.elementary).toBeBoolean();
            }
        );
        it
        (
            'has a mask consisting of two 32-bit integers',
            function ()
            {
                var mask = featureObj.mask;
                expect(mask).toBeArray();
                expect(Object.isFrozen(mask)).toBeTruthy();
                expect(mask.length).toBe(2);
                expect(mask[0]).toBeInt32();
                expect(mask[1]).toBeInt32();
            }
        );
        it
        (
            'has elementaryNames string array',
            function ()
            {
                var elementaryNames = featureObj.elementaryNames;
                expect(elementaryNames).toBeArray();
                elementaryNames.forEach
                (
                    function (name)
                    {
                        expect(name).toBeString();
                    }
                );
            }
        );
        it
        (
            'has canonicalNames string array',
            function ()
            {
                var canonicalNames = featureObj.canonicalNames;
                expect(canonicalNames).toBeArray();
                var elementaryNames = featureObj.elementaryNames;
                expect(elementaryNames).toBeArray();
                canonicalNames.forEach
                (
                    function (name)
                    {
                        expect(elementaryNames).toContain(name);
                    }
                );
            }
        );
        if (featureObj.elementary)
        {
            it
            (
                'has a nonempty mask',
                function ()
                {
                    expect(JScrewIt.debug.maskIsEmpty(featureObj.mask)).toBe(false);
                }
            );
        }
        var check = featureObj.check;
        if (check)
        {
            it
            (
                'is checkable',
                function ()
                {
                    var available = check();
                    expect(available).toBeBoolean();
                    if (!available)
                    {
                        available = emuDo([featureObj.name], check);
                        expect(available).toBe(true, 'Emulation doesn\'t work');
                    }
                }
            );
        }
        var engine = featureObj.engine;
        if (engine !== undefined)
        {
            it
            (
                'has engine string',
                function ()
                {
                    expect(engine).toBeString();
                }
            );
            it
            (
                'is not checkable',
                function ()
                {
                    expect(check).toBeUndefined();
                }
            );
        }
    }

    var JScrewIt = typeof module !== 'undefined' ? require('../node-jscrewit-test') : self.JScrewIt;
    var Feature = JScrewIt.Feature;

    describe
    (
        'JScrewIt.Feature',
        function ()
        {
            describe
            (
                'constructor',
                function ()
                {
                    it
                    (
                        'accepts mixed arguments',
                        function ()
                        {
                            var maskUnion = JScrewIt.debug.maskUnion;
                            var feature =
                            Feature
                            (
                                ['NAME', Feature.WINDOW],
                                {
                                    toString:
                                    function ()
                                    {
                                        return 'HTMLDOCUMENT';
                                    },
                                    valueOf:
                                    function ()
                                    {
                                        return 42;
                                    },
                                },
                                Feature.NO_IE_SRC,
                                []
                            );
                            var expectedMask =
                            maskUnion
                            (
                                maskUnion
                                (
                                    maskUnion(Feature.NAME.mask, Feature.WINDOW.mask),
                                    Feature.HTMLDOCUMENT.mask
                                ),
                                Feature.NO_IE_SRC.mask
                            );
                            expect(feature.mask).toEqual(expectedMask);
                        }
                    );
                    it
                    (
                        'throws an Error for unknown features',
                        function ()
                        {
                            var fn = Feature.bind(Feature, '???');
                            expect(fn).toThrowStrictly(Error, 'Unknown feature "???"');
                        }
                    );
                    it
                    (
                        'throws an Error for incompatible feature arrays',
                        function ()
                        {
                            var fn = Feature.bind(Feature, ['IE_SRC', 'NO_IE_SRC']);
                            expect(fn).toThrowStrictly(Error, 'Incompatible features');
                        }
                    );
                    it
                    (
                        'can be invoked with the new operator',
                        function ()
                        {
                            var featureObj = new Feature();
                            expect(featureObj.constructor).toBe(Feature);
                        }
                    );
                    it
                    (
                        'throws an Error for incompatible features',
                        function ()
                        {
                            var fn = Feature.bind(Feature, 'DOMWINDOW', 'WINDOW');
                            expect(fn).toThrowStrictly(Error, 'Incompatible features');
                        }
                    );
                }
            );
            describe
            (
                'contains only well-formed obejcts:',
                function ()
                {
                    var featureNames = Object.keys(Feature).sort();

                    describe.per(featureNames)
                    (
                        '#',
                        function (featureName)
                        {
                            var featureObj = Feature[featureName];
                            testFeatureObj(featureObj);
                        }
                    );
                }
            );
            describe
            (
                'contains correct information for the feature',
                function ()
                {
                    function verifyExpectations(actualFeature, expectedFeature)
                    {
                        var actualElementaryNames = actualFeature.elementaryNames;
                        var expectedElementaryNames = expectedFeature.elementaryNames;
                        expect(actualElementaryNames).toEqual(expectedElementaryNames);
                        var actualCanonicalNames = expectedFeature.canonicalNames;
                        var expectedCanonicalNames = actualFeature.canonicalNames;
                        expect(actualCanonicalNames).toEqual(expectedCanonicalNames);
                        expect(actualFeature.mask).toEqual(expectedFeature.mask);
                    }

                    it
                    (
                        'DEFAULT',
                        function ()
                        {
                            var featureObj = Feature.DEFAULT;
                            expect(featureObj.canonicalNames).toEqual([]);
                            expect(featureObj.elementaryNames).toEqual([]);
                            expect(featureObj.mask).toEqual([0, 0]);
                        }
                    );
                    it.per
                    (
                        [
                            {
                                actualFeatureName: 'BROWSER',
                                expectedFeatureNames:
                                [
                                    'ANDRO_4_0',
                                    'ANDRO_4_4',
                                    'CHROME_PREV',
                                    'EDGE_PREV',
                                    'FF_ESR',
                                    'IE_9',
                                    'IE_11',
                                    'SAFARI_7_0',
                                    'SAFARI_10',
                                ],
                            },
                            {
                                actualFeatureName: 'COMPACT',
                                expectedFeatureNames: ['CHROME', 'EDGE', 'FF', 'SAFARI'],
                            },
                        ]
                    )
                    (
                        '#.actualFeatureName',
                        function (paramData)
                        {
                            var actualFeatureName       = paramData.actualFeatureName;
                            var expectedFeatureNames    = paramData.expectedFeatureNames;

                            // Default environemnt
                            var actualFeature = Feature.ALL[actualFeatureName];
                            var featureNames =
                            Feature.commonOf.apply(null, expectedFeatureNames);
                            var expectedFeature = Feature(featureNames);
                            verifyExpectations(actualFeature, expectedFeature);

                            // Web Worker
                            var actualFeatureWW = actualFeature.restrict('web-worker');
                            var restrictedFeatures =
                            expectedFeatureNames.map
                            (
                                function (featureName)
                                {
                                    var feature = Feature.ALL[featureName];
                                    var restrictedFeature = feature.restrict('web-worker');
                                    return restrictedFeature;
                                }
                            );
                            var expectedFeatureWW =
                            Feature.commonOf.apply(null, restrictedFeatures);
                            verifyExpectations(actualFeatureWW, expectedFeatureWW);
                        }
                    );
                    it
                    (
                        'AUTO',
                        function ()
                        {
                            var featureObj = Feature.AUTO;
                            var canonicalNameCount = featureObj.canonicalNames.length;
                            var elementaryNameCount = featureObj.elementaryNames.length;
                            expect(canonicalNameCount).toBeGreaterThan(0);
                            expect(elementaryNameCount).not.toBeLessThan(canonicalNameCount);
                            expect(featureObj.mask).not.toEqual([0, 0]);
                        }
                    );
                }
            );
            it
            (
                '#canonicalNames works as expected',
                function ()
                {
                    var feature = Feature('HTMLDOCUMENT', 'NO_IE_SRC', 'NO_V8_SRC');
                    expect(feature.canonicalNames).toEqual(['FF_SRC', 'HTMLDOCUMENT']);
                }
            );
            describe
            (
                '#includes',
                function ()
                {
                    it
                    (
                        'accepts mixed arguments',
                        function ()
                        {
                            var actual =
                            Feature.COMPACT.includes
                            (['NAME', Feature.WINDOW], 'HTMLDOCUMENT', Feature.NO_IE_SRC, []);
                            expect(actual).toBe(true);
                        }
                    );
                    it
                    (
                        'returns true if no arguments are specified',
                        function ()
                        {
                            var actual = Feature.AUTO.includes();
                            expect(actual).toBe(true);
                        }
                    );
                    it
                    (
                        'throws an Error for unknown features',
                        function ()
                        {
                            var fn = Feature.prototype.includes.bind(Feature.DEFAULT, '???');
                            expect(fn).toThrowStrictly(Error, 'Unknown feature "???"');
                        }
                    );
                    it
                    (
                        'throws an Error for incompatible feature arrays',
                        function ()
                        {
                            var fn =
                            Feature.prototype.includes.bind
                            (Feature.DEFAULT, ['IE_SRC', 'NO_IE_SRC']);
                            expect(fn).toThrowStrictly(Error, 'Incompatible features');
                        }
                    );
                }
            );
            it
            (
                '#inspect can be called with only one argument',
                function ()
                {
                    var actual = Feature.GMT.inspect(0);
                    expect(actual).toBe('[Feature GMT]');
                }
            );
            describe
            (
                '#restrict',
                function ()
                {
                    it
                    (
                        'restricts a feature in all engines',
                        function ()
                        {
                            var featureObj = Feature.WINDOW.restrict('web-worker');
                            expect(featureObj.mask).toEqual(Feature.DEFAULT.mask);
                        }
                    );
                    it
                    (
                        'restricts a feature in a particular engine',
                        function ()
                        {
                            var featureObj = Feature.WINDOW.restrict('web-worker', [Feature.FF_54]);
                            expect(featureObj.mask).toEqual(Feature.SELF_OBJ.mask);
                        }
                    );
                }
            );
            describe
            (
                '#toString',
                function ()
                {
                    it
                    (
                        'works for predefined features',
                        function ()
                        {
                            expect(Feature.DEFAULT.toString()).toBe('[Feature DEFAULT]');
                            expect(Feature.NODE_0_10.toString()).toBe('[Feature NODE_0_10]');
                            expect(Feature.ATOB.toString()).toBe('[Feature ATOB]');
                        }
                    );
                    it
                    (
                        'works for custom features',
                        function ()
                        {
                            expect(Feature('DEFAULT').toString()).toBe('[Feature {}]');
                            expect(Feature('NODE_0_10').toString()).toMatch
                            (/^\[Feature \{[\dA-Z_]+(, [\dA-Z_]+)*\}]$/);
                            expect(Feature('ATOB').toString()).toBe('[Feature {ATOB}]');
                        }
                    );
                }
            );
            describe
            (
                '.ALL',
                function ()
                {
                    it
                    (
                        'is frozen',
                        function ()
                        {
                            expect(Object.isFrozen(Feature.ALL)).toBeTruthy();
                        }
                    );
                    it
                    (
                        'has no inherited properties',
                        function ()
                        {
                            var obj = Feature.ALL;
                            while ((obj = Object.getPrototypeOf(obj)) !== null)
                                expect(Object.getOwnPropertyNames(obj)).toEqual([]);
                        }
                    );
                }
            );
            describe
            (
                '.ELEMENTARY',
                function ()
                {
                    it
                    (
                        'is frozen',
                        function ()
                        {
                            expect(Object.isFrozen(Feature.ELEMENTARY)).toBeTruthy();
                        }
                    );
                    it
                    (
                        'is sorted by name',
                        function ()
                        {
                            Feature.ELEMENTARY.reduce
                            (
                                function (prevFeature, nextFeature)
                                {
                                    var prevName = prevFeature.name;
                                    var nextName = nextFeature.name;
                                    expect(prevName < nextName).toBeTruthy
                                    ('"' + prevName + '" and "' + nextName + '" are not in order');
                                    return nextFeature;
                                }
                            );
                        }
                    );
                }
            );
            describe
            (
                '.areCompatible',
                function ()
                {
                    it
                    (
                        'returns true if no arguments are specified',
                        function ()
                        {
                            var compatible = Feature.areCompatible();
                            expect(compatible).toBe(true);
                        }
                    );
                    it
                    (
                        'returns true for any single feature',
                        function ()
                        {
                            var compatible = Feature.areCompatible(Feature.AUTO);
                            expect(compatible).toBe(true);
                        }
                    );
                    it
                    (
                        'returns true for compatible features',
                        function ()
                        {
                            var compatible = Feature.areCompatible('FILL', 'SELF');
                            expect(compatible).toBe(true);
                        }
                    );
                    it
                    (
                        'returns false for incompatible features',
                        function ()
                        {
                            var compatible = Feature.areCompatible('V8_SRC', 'IE_SRC');
                            expect(compatible).toBe(false);
                        }
                    );
                }
            );
            describe
            (
                '.areCompatible (legacy usage)',
                function ()
                {
                    it
                    (
                        'returns true if no arguments are specified',
                        function ()
                        {
                            var compatible = Feature.areCompatible([]);
                            expect(compatible).toBe(true);
                        }
                    );
                    it
                    (
                        'returns true for any single feature',
                        function ()
                        {
                            var compatible = Feature.areCompatible([Feature.AUTO]);
                            expect(compatible).toBe(true);
                        }
                    );
                    it
                    (
                        'returns true for compatible features',
                        function ()
                        {
                            var compatible = Feature.areCompatible(['FILL', 'SELF']);
                            expect(compatible).toBe(true);
                        }
                    );
                    it
                    (
                        'returns false for incompatible features',
                        function ()
                        {
                            var compatible = Feature.areCompatible(['V8_SRC', 'IE_SRC']);
                            expect(compatible).toBe(false);
                        }
                    );
                }
            );
            describe
            (
                '.areEqual',
                function ()
                {
                    it
                    (
                        'accepts mixed arguments',
                        function ()
                        {
                            var actual =
                            Feature.areEqual
                            (['NAME', Feature.WINDOW], 'HTMLDOCUMENT', Feature.NO_IE_SRC, []);
                            expect(actual).toBe(false);
                        }
                    );
                    it
                    (
                        'throws an Error for unknown features',
                        function ()
                        {
                            var fn = Feature.areEqual.bind(null, '???');
                            expect(fn).toThrowStrictly(Error, 'Unknown feature "???"');
                        }
                    );
                    it
                    (
                        'throws an Error for incompatible feature arrays',
                        function ()
                        {
                            var fn = Feature.areEqual.bind(null, ['IE_SRC', 'NO_IE_SRC']);
                            expect(fn).toThrowStrictly(Error, 'Incompatible features');
                        }
                    );
                    it
                    (
                        'returns true if no arguments are specified',
                        function ()
                        {
                            var equal = Feature.areEqual([]);
                            expect(equal).toBe(true);
                        }
                    );
                    it
                    (
                        'returns true for any single feature',
                        function ()
                        {
                            var equal = Feature.areEqual([Feature.AUTO]);
                            expect(equal).toBe(true);
                        }
                    );
                    it
                    (
                        'returns true for equal features',
                        function ()
                        {
                            var equal = Feature.areEqual(['FILL'], Feature.FILL);
                            expect(equal).toBe(true);
                        }
                    );
                    it
                    (
                        'returns false for unequal features',
                        function ()
                        {
                            var equal = Feature.areEqual('V8_SRC', 'IE_SRC');
                            expect(equal).toBe(false);
                        }
                    );
                }
            );
            describe
            (
                '.commonOf',
                function ()
                {
                    it
                    (
                        'accepts mixed arguments',
                        function ()
                        {
                            var featureObj =
                            Feature.commonOf
                            (['NAME', Feature.WINDOW], 'HTMLDOCUMENT', Feature.NO_IE_SRC, []);
                            expect(featureObj.mask).toEqual([0, 0]);
                        }
                    );
                    it
                    (
                        'throws an Error for unknown features',
                        function ()
                        {
                            var fn = Feature.commonOf.bind(null, '???');
                            expect(fn).toThrowStrictly(Error, 'Unknown feature "???"');
                        }
                    );
                    it
                    (
                        'throws an Error for incompatible feature arrays',
                        function ()
                        {
                            var fn = Feature.commonOf.bind(null, ['IE_SRC', 'NO_IE_SRC']);
                            expect(fn).toThrowStrictly(Error, 'Incompatible features');
                        }
                    );
                    it
                    (
                        'returns null if no arguments are specified',
                        function ()
                        {
                            var featureObj = Feature.commonOf();
                            expect(featureObj).toBeNull();
                        }
                    );
                    it
                    (
                        'returns a feature with expected mask',
                        function ()
                        {
                            var featureObj = Feature.commonOf(Feature.AUTO);
                            expect(featureObj.mask).toEqual(Feature.AUTO.mask);
                        }
                    );
                    it
                    (
                        'throws an Error for incompatible feature arrays',
                        function ()
                        {
                            var fn =
                            Feature.commonOf.bind(null, 'ANY_WINDOW', ['WINDOW', 'DOMWINDOW']);
                            expect(fn).toThrowStrictly(Error, 'Incompatible features');
                        }
                    );
                }
            );
            it.when(typeof module !== 'undefined')
            (
                'inspection works as expected',
                function ()
                {
                    var util = require('util');

                    var actual = util.inspect(Feature.DEFAULT);
                    expect(actual).toBe('[Feature DEFAULT]');
                }
            );
            it.when(typeof module !== 'undefined')
            (
                'util.inspect.custom is not required',
                function ()
                {
                    var inspect = require('util').inspect;

                    var inspectKey = inspect.custom;
                    inspect.custom = undefined;
                    try
                    {
                        reloadJScrewIt();
                    }
                    finally
                    {
                        inspect.custom = inspectKey;
                    }
                }
            );
        }
    );
}
)();
