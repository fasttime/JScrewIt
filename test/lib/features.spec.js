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
                throw Error('Actual value must be a feature object');
            if (!(expected instanceof Feature))
                throw Error('Expected value must be a feature object');
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
                'names',
                function ()
                {
                    it
                    (
                        'are set correctly',
                        function ()
                        {
                            var featureNames = Object.keys(Feature).sort();
                            var featureAllNames = Object.keys(Feature.ALL).sort();
                            expect(featureNames).toEqual(featureAllNames);
                        }
                    );

                    var featureNames = Object.keys(Feature).sort();

                    describe.per(featureNames)
                    (
                        '#',
                        function (featureName)
                        {
                            it
                            (
                                'has the expected format',
                                function ()
                                {
                                    expect(featureName).toBeString();
                                    expect(featureName).toMatch(/^[A-Z][\dA-Z_]*$/);
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
                                'refers to a predefined feature',
                                function ()
                                {
                                    var expected = Feature[featureName];
                                    var actual = Feature[expected.name];
                                    expect(actual).toBe(expected);
                                }
                            );
                        }
                    );
                }
            );

            describe
            (
                'values',
                function ()
                {
                    var featureObjs = [];
                    for (var featureName in Feature.ALL)
                    {
                        var featureObj = Feature[featureName];
                        if (featureObj.name === featureName)
                            featureObjs.push(featureObj);
                    }
                    featureObjs.sort();

                    describe.per(featureObjs)
                    (
                        '#.name',
                        function (featureObj)
                        {
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
                                    'CHROME_PREV',
                                    'FF_ESR',
                                    'IE_11',
                                    'IE_11_WIN_10',
                                    'SAFARI_PRE_PREV',
                                    'SAFARI',
                                ],
                            },
                            {
                                actualFeatureName:      'COMPACT',
                                expectedFeatureNames:   ['CHROME', 'FF', 'SAFARI'],
                            },
                        ]
                    )
                    (
                        '#.actualFeatureName',
                        function (paramData)
                        {
                            function verifyFeature(actualFeature, expectedFeature)
                            {
                                expect(Feature.areEqual(actualFeature, expectedFeature))
                                .toBeTruthy();
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
                'SHORT_LOCALES check returns false',
                function ()
                {
                    var prototype = Number.prototype;
                    var toLocaleString = prototype.toLocaleString;
                    prototype.toLocaleString =
                    function ()
                    {
                        return String(this);
                    };
                    try
                    {
                        var check = Feature.SHORT_LOCALES.check;
                        var available = check();
                        expect(available).toBe(false);
                    }
                    finally
                    {
                        prototype.toLocaleString = toLocaleString;
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
                            expect(featureObj).toEqualFeature(Feature.SELF);
                        }
                    );
                    it
                    (
                        'restricts a feature in a particular engine',
                        function ()
                        {
                            var featureObj = Feature.WINDOW.restrict('web-worker', [Feature.IE_11]);
                            expect(featureObj).toEqualFeature(Feature.OBJECT_W_SELF);
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

            describe.per(Feature.ENGINE)
            (
                'engine feature #.name',
                function (featureObj)
                {
                    it
                    (
                        'is not checkable',
                        function ()
                        {
                            expect(featureObj.check).toBeNull();
                        }
                    );
                    it
                    (
                        'has expected description',
                        function ()
                        {
                            var description = Feature.descriptionFor(featureObj.name);
                            expect(description).toMatch(/^Features available in .+\.$/);
                        }
                    );
                }
            );
        }
    );
}
)(typeof self === 'undefined' ? global : self);
