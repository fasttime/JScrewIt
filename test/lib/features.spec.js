/* eslint-env ebdd/ebdd */
/* global emuDo, emuIt, expect, global, module, require, self */

'use strict';

(function (global)
{
    var JScrewIt = typeof module !== 'undefined' ? require('../node-jscrewit-test') : self.JScrewIt;
    var Feature = JScrewIt.Feature;

    expect.addAssertion
    (
        'toEqualFeature',
        function (expected)
        {
            var actual = this.value;
            if (!(actual instanceof Feature))
                throw new Error('Actual value must be a feature object');
            if (!(expected instanceof Feature))
                throw new Error('Expected value must be a feature object');
            var message =
            this.generateMessage(actual, this.expr, 'to be equal to feature', expected);
            var pass = Feature.areEqual(actual, expected);
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
                            if (featureObj.elementary)
                            {
                                it
                                (
                                    'is not a default feature',
                                    function ()
                                    {
                                        expect(featureObj).not.toEqualFeature(Feature.DEFAULT);
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
                                        check();
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
                                    'is not checkable',
                                    function ()
                                    {
                                        expect(check).toBeNull();
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
                            var featureObj = Feature.DEFAULT;
                            expect(featureObj.elementaryNames).toEqual([]);
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
                            function verifyFeature(actualFeature, expectedFeature)
                            {
                                expect(Feature.areEqual(actualFeature, expectedFeature));
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
                                    verifyFeature(actualFeature, expectedFeature);
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
                                    verifyFeature(actualFeature, expectedFeature);
                                }
                            );
                        }
                    );

                    it
                    (
                        'AUTO',
                        function ()
                        {
                            var featureObj = Feature.AUTO;
                            var canonicalNameCount = featureObj.canonicalNames.length;
                            expect(canonicalNameCount).toBeGreaterThan(0);
                            expect(featureObj).not.toEqualFeature(Feature.DEFAULT);
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
                '#restrict',
                function ()
                {
                    it
                    (
                        'restricts a feature in all engines',
                        function ()
                        {
                            var featureObj = Feature.WINDOW.restrict('web-worker');
                            expect(featureObj).toEqualFeature(Feature.DEFAULT);
                        }
                    );
                    it
                    (
                        'restricts a feature in a particular engine',
                        function ()
                        {
                            var featureObj = Feature.WINDOW.restrict('web-worker', [Feature.FF_78]);
                            expect(featureObj).toEqualFeature(Feature.SELF_OBJ);
                        }
                    );
                    it
                    (
                        'does not restrict a feature with an unknown environment',
                        function ()
                        {
                            var featureObj = Feature.WINDOW.restrict('?');
                            expect(featureObj).toEqualFeature(Feature.WINDOW);
                        }
                    );
                }
            );
        }
    );
}
)(typeof self === 'undefined' ? global : self);
