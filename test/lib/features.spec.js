/* eslint-env ebdd/ebdd */
/* global Symbol, emuDo, emuIt, expect, global, module, reloadJScrewIt, require, self */

'use strict';

(function (global)
{
    var JScrewIt = typeof module !== 'undefined' ? require('../node-jscrewit-test') : self.JScrewIt;
    var Feature = JScrewIt.Feature;

    expect.addAssertion
    (
        'toHaveMask',
        function (mask)
        {
            var featureObj = this.value;
            var message = this.generateMessage(featureObj, this.expr, 'to have mask', mask);
            var pass = JScrewIt.debug.maskAreEqual(featureObj.mask, mask);
            if (pass)
                return this.assertions.pass(message);
            this.assertions.fail(message);
        }
    );

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
                        'can be invoked with the new operator',
                        function ()
                        {
                            var featureObj = new Feature();
                            expect(featureObj.constructor).toBe(Feature);
                        }
                    );
                    it.when(typeof Symbol !== 'undefined')
                    (
                        'throws a TypeError when an argument is a symbol',
                        function ()
                        {
                            var fn = Feature.bind(Feature, Symbol());
                            expect(fn)
                            .toThrowStrictly(TypeError, 'Cannot convert a symbol to a string');
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
                            it
                            (
                                'is named correctly',
                                function ()
                                {
                                    var name = featureObj.name;
                                    expect(name).toBeString();
                                    expect(name).toMatch(/^[A-Z][\dA-Z_]*$/);
                                    expect(featureObj).toBe(Feature[name]);
                                    expect(featureObj).toBe(Feature.ALL[name]);
                                }
                            );
                            it
                            (
                                'has a description string associated',
                                function ()
                                {
                                    var description = Feature.descriptionFor(featureName);
                                    expect(description).toBeString();
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
                                'has a valid mask',
                                function ()
                                {
                                    var mask = featureObj.mask;
                                    expect(mask).toBeInt52();
                                }
                            );
                            if (featureObj.elementary)
                            {
                                it
                                (
                                    'has a nonempty mask',
                                    function ()
                                    {
                                        var newMask = JScrewIt.debug.maskNew();
                                        expect
                                        (JScrewIt.debug.maskAreEqual(featureObj.mask, newMask))
                                        .toBe(false);
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
                                    }
                                );
                                emuIt
                                (
                                    'is emulatable',
                                    featureObj,
                                    function ()
                                    {
                                        var available = emuDo(this.test.emuFeatureNames, check);
                                        expect(available).toBe(true, 'Emulation doesn\'t work');
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
                    );
                }
            );
            describe
            (
                'contains correct information for the feature',
                function ()
                {
                    it
                    (
                        'DEFAULT',
                        function ()
                        {
                            var newMask = JScrewIt.debug.maskNew();
                            var featureObj = Feature.DEFAULT;
                            expect(featureObj.canonicalNames).toEqual([]);
                            expect(featureObj.elementaryNames).toEqual([]);
                            expect(featureObj).toHaveMask(newMask);
                        }
                    );

                    describe.per
                    (
                        [
                            {
                                actualFeatureName: 'BROWSER',
                                expectedFeatureNames:
                                [
                                    'ANDRO_4_0',
                                    'ANDRO_4_4',
                                    'CHROME_PREV',
                                    'FF_ESR',
                                    'IE_9',
                                    'IE_11',
                                    'SAFARI_7_0',
                                    'SAFARI_14_1',
                                ],
                            },
                            {
                                actualFeatureName: 'COMPACT',
                                expectedFeatureNames: ['CHROME', 'FF', 'SAFARI'],
                            },
                        ]
                    )
                    (
                        '#.actualFeatureName',
                        function (paramData)
                        {
                            function verifyExpectations(actualFeature, expectedFeature)
                            {
                                var actualElementaryNames = actualFeature.elementaryNames;
                                var expectedElementaryNames = expectedFeature.elementaryNames;
                                expect(actualElementaryNames).toEqual(expectedElementaryNames);
                                var actualCanonicalNames = expectedFeature.canonicalNames;
                                var expectedCanonicalNames = actualFeature.canonicalNames;
                                expect(actualCanonicalNames).toEqual(expectedCanonicalNames);
                                expect(actualFeature).toHaveMask(expectedFeature.mask);
                            }

                            var actualFeatureName       = paramData.actualFeatureName;
                            var expectedFeatureNames    = paramData.expectedFeatureNames;

                            it
                            (
                                'in the default environment',
                                function ()
                                {
                                    var actualFeature = Feature.ALL[actualFeatureName];
                                    var expectedFeature =
                                    Feature.commonOf.apply(null, expectedFeatureNames);
                                    verifyExpectations(actualFeature, expectedFeature);
                                }
                            );
                            it.per(['web-worker', 'forced-strict-mode'])
                            (
                                'in the # environment',
                                function (environment)
                                {
                                    var actualFeature =
                                    Feature.ALL[actualFeatureName].restrict(environment);
                                    var restrictedFeatures =
                                    expectedFeatureNames.map
                                    (
                                        function (featureName)
                                        {
                                            var feature = Feature.ALL[featureName];
                                            var restrictedFeature = feature.restrict(environment);
                                            return restrictedFeature;
                                        }
                                    );
                                    var expectedFeature =
                                    Feature.commonOf.apply(null, restrictedFeatures);
                                    verifyExpectations(actualFeature, expectedFeature);
                                }
                            );
                        }
                    );

                    it
                    (
                        'AUTO',
                        function ()
                        {
                            var newMask = JScrewIt.debug.maskNew();
                            var featureObj = Feature.AUTO;
                            var canonicalNameCount = featureObj.canonicalNames.length;
                            var elementaryNameCount = featureObj.elementaryNames.length;
                            expect(canonicalNameCount).toBeGreaterThan(0);
                            expect(elementaryNameCount).not.toBeLessThan(canonicalNameCount);
                            expect(featureObj).not.toHaveMask(newMask);
                        }
                    );
                }
            );
            it
            (
                'ARROW check returns false',
                function ()
                {
                    var Function = global.Function;
                    global.Function =
                    function ()
                    {
                        throw SyntaxError();
                    };
                    try
                    {
                        var check = Feature.ARROW.check;
                        var available = check();
                        expect(available).toBe(false);
                    }
                    finally
                    {
                        global.Function = Function;
                    }
                }
            );
            it
            (
                'GENERIC_ARRAY_TO_STRING check returns false',
                function ()
                {
                    var prototype = Array.prototype;
                    var toString = prototype.toString;
                    prototype.toString =
                    function ()
                    {
                        throw TypeError();
                    };
                    try
                    {
                        var check = Feature.GENERIC_ARRAY_TO_STRING.check;
                        var available = check();
                        expect(available).toBe(false);
                    }
                    finally
                    {
                        prototype.toString = toString;
                    }
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
                            (
                                ['NAME', Feature.WINDOW],
                                Object('HTMLDOCUMENT'),
                                Feature.NO_IE_SRC,
                                []
                            );
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
            describe
            (
                '#inspect',
                function ()
                {
                    it
                    (
                        'can be called with only one argument',
                        function ()
                        {
                            var actual = Feature.GMT.inspect(0);
                            expect(actual)
                            .toBe('[Feature GMT (elementary) (check) { attributes: {} }]');
                        }
                    );
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
                            expect(featureObj).toHaveMask(Feature.DEFAULT.mask);
                        }
                    );
                    it
                    (
                        'restricts a feature in a particular engine',
                        function ()
                        {
                            var featureObj = Feature.WINDOW.restrict('web-worker', [Feature.FF_78]);
                            expect(featureObj).toHaveMask(Feature.SELF_OBJ.mask);
                        }
                    );
                    it
                    (
                        'does not restrict a feature with an unknown environment',
                        function ()
                        {
                            var featureObj = Feature.WINDOW.restrict('?');
                            expect(featureObj).toHaveMask(Feature.WINDOW.mask);
                        }
                    );
                }
            );
            it
            (
                '.areCompatible can be called without arguments',
                function ()
                {
                    Feature.areCompatible();
                    Feature.areCompatible([]);
                }
            );
            it
            (
                '.areEqual returns true for aliases',
                function ()
                {
                    var equal = Feature.areEqual('ANY_WINDOW', 'SELF');
                    expect(equal).toBe(true);
                }
            );
            it
            (
                '.commonOf returns null when called without arguments',
                function ()
                {
                    var actual = Feature.commonOf();
                    expect(actual).toBeNull();
                }
            );
            describe
            (
                '.descriptionFor',
                function ()
                {
                    it
                    (
                        'throws an error when called without an argument',
                        function ()
                        {
                            var fn = Feature.descriptionFor.bind(null);
                            expect(fn).toThrowStrictly(Error, 'Unknown feature "undefined"');
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
                    expect(actual).toBe('[Feature DEFAULT { attributes: {} }]');
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
)(typeof self === 'undefined' ? global : self);
