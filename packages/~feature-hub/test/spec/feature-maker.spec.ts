import { makeFeatureClass } from '../../src/feature-maker';
import assert               from 'assert';

const noop =
(): void =>
{ };

it
(
    'makeFeatureClass',
    (): void =>
    {
        makeFeatureClass({ });
    },
);

it
(
    'Feature',
    (): void =>
    {
        const Feature = makeFeatureClass({ });

        Feature();
        new Feature();
    },
);

describe
(
    'Feature.areEqual',
    (): void =>
    {
        it
        (
            'returns true',
            (): void =>
            {
                const Feature = makeFeatureClass({ });
                {
                    const actual = Feature.areEqual();
                    assert.equal(actual, true);
                }
                {
                    const featureObj = Feature();
                    const actual = Feature.areEqual(featureObj);
                    assert.equal(actual, true);
                }
                {
                    const featureObj1 = Feature();
                    const featureObj2 = Feature();
                    const actual = Feature.areEqual(featureObj1, featureObj2);
                    assert.strictEqual(actual, true);
                }
            },
        );
        it
        (
            'returns false',
            (): void =>
            {
                const Feature =
                makeFeatureClass
                ({ FOO: { check: noop }, BAR: { check: noop } });
                {
                    const actual = Feature.areEqual(Feature.ALL.FOO, Feature.ALL.BAR);
                    assert.equal(actual, false);
                }
                {
                    const actual = Feature.areEqual(Feature.ALL.FOO, 'BAR');
                    assert.equal(actual, false);
                }
                {
                    const actual = Feature.areEqual('FOO', 'BAR');
                    assert.strictEqual(actual, false);
                }
            },
        );
    },
);
