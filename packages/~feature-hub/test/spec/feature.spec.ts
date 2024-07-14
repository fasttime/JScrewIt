import
{
    type CompatibilityInfo,
    type Feature,
    type FeatureConstructor,
    type FeatureElement,
    type FeatureElementOrCompatibleArray,
    createFeatureClass,
    featuresToMask,
}
from '../../src/feature';

import { MASK_EMPTY, type Mask, maskAreEqual, maskIntersection, maskNext, maskUnion }
from '../../src/mask-impl';

import assert       from 'assert';
import type util    from 'util';

/* eslint-disable @typescript-eslint/no-require-imports */

const getNodeUtil = (): typeof util => require('util') as typeof util;

/* eslint-enable @typescript-eslint/no-require-imports */

const noop =
(): void =>
{ };

it
(
    'createFeatureClass',
    (): void =>
    {
        const Feature =
        createFeatureClass
        (
            {
                RED:    { includes: ['RED1', 'RED2'], excludes: ['GREEN'] },
                RED1:   { check: noop },
                RED2:   { check: noop },
                GREEN:  { check: noop, excludes: ['RED'] },
                FOO:
                {
                    includes:   ['RED1', 'GREEN'],
                    attributes: { id: 'foo', foo: null },
                },
                BAR:
                {
                    inherits:   'FOO',
                    includes:   { RED1: false, RED2: true },
                    attributes: { id: 'bar', foo: undefined, bar: null },
                },
            },
        );
        const { RED, RED1, RED2, GREEN, FOO, BAR } = Feature.ALL;
        assert(maskAreEqual(RED.mask, featuresToMask([RED1, RED2])));
        assert(maskAreEqual(maskIntersection(RED1.mask, RED2.mask), MASK_EMPTY));
        assert(!maskAreEqual(RED1.mask, MASK_EMPTY));
        assert(!maskAreEqual(RED2.mask, MASK_EMPTY));
        assert(maskAreEqual(maskIntersection(RED.mask, GREEN.mask), MASK_EMPTY));
        assert(maskAreEqual(FOO.mask, featuresToMask([RED1, GREEN])));
        assert(maskAreEqual(BAR.mask, featuresToMask([RED2, GREEN])));
        assert.strictEqual(RED.elementary, true);
        assert.strictEqual(RED1.elementary, true);
        assert.strictEqual(RED2.elementary, true);
        assert.strictEqual(GREEN.elementary, true);
        assert.strictEqual(FOO.elementary, false);
        assert.strictEqual(BAR.elementary, false);
        assert.deepStrictEqual(RED.canonicalNames, ['RED']);
        assert.deepStrictEqual(RED1.canonicalNames, ['RED1']);
        assert.deepStrictEqual(RED2.canonicalNames, ['RED2']);
        assert.deepStrictEqual(GREEN.canonicalNames, ['GREEN']);
        assert.deepStrictEqual(FOO.canonicalNames, ['GREEN', 'RED1']);
        assert.deepStrictEqual(BAR.canonicalNames, ['GREEN', 'RED2']);
        assert.deepStrictEqual(RED.elementaryNames, ['RED', 'RED1', 'RED2']);
        assert.deepStrictEqual(RED1.elementaryNames, ['RED1']);
        assert.deepStrictEqual(RED2.elementaryNames, ['RED2']);
        assert.deepStrictEqual(GREEN.elementaryNames, ['GREEN']);
        assert.deepStrictEqual(FOO.elementaryNames, ['GREEN', 'RED1']);
        assert.deepStrictEqual(BAR.elementaryNames, ['GREEN', 'RED2']);
        assert.strictEqual(RED.name, 'RED');
        assert.strictEqual(RED1.name, 'RED1');
        assert.strictEqual(RED2.name, 'RED2');
        assert.strictEqual(GREEN.name, 'GREEN');
        assert.strictEqual(FOO.name, 'FOO');
        assert.strictEqual(BAR.name, 'BAR');
        assert.deepStrictEqual(RED.attributes, Object.create(null));
        assert.deepStrictEqual(RED1.attributes, Object.create(null));
        assert.deepStrictEqual(RED2.attributes, Object.create(null));
        assert.deepStrictEqual(GREEN.attributes, Object.create(null));
        {
            const expected = Object.create(null) as { [AttributeName in string]: string | null; };
            expected.id = 'foo';
            expected.foo = null;
            assert.deepStrictEqual(FOO.attributes, expected);
        }
        {
            const expected = Object.create(null) as { [AttributeName in string]: string | null; };
            expected.id = 'bar';
            expected.bar = null;
            assert.deepStrictEqual(BAR.attributes, expected);
        }
    },
);

describe
(
    'Feature constructor',
    (): void =>
    {
        it
        (
            'returns a new feature',
            (): void =>
            {
                const Feature =
                createFeatureClass
                ({ FOO: { check: noop }, BAR: { check: noop }, BAZ: { check: noop } });
                const featureObj = Feature('FOO', 'BAR', 'BAZ');
                const actualMask = featureObj.mask;
                const expectedMask =
                featuresToMask([Feature.ALL.FOO, Feature.ALL.BAR, Feature.ALL.BAZ]);
                assert(maskAreEqual(actualMask, expectedMask));
                assert.strictEqual(featureObj.elementary, false);
                assert.deepStrictEqual(featureObj.canonicalNames, ['BAR', 'BAZ', 'FOO']);
                assert.deepStrictEqual(featureObj.elementaryNames, ['BAR', 'BAZ', 'FOO']);
            },
        );

        it
        (
            'can be invoked with or without the new operator',
            (): void =>
            {
                const Feature = createFeatureClass({ });
                {
                    const featureObj = new Feature();
                    assert(featureObj instanceof Feature);
                }
                {
                    const featureObj = Feature();
                    assert(featureObj instanceof Feature);
                }
            },
        );

        it
        (
            'accepts mixed arguments',
            (): void =>
            {
                const Feature = createFeatureClass({ FOO: { }, BAR: { } });
                const name =
                { toString: (): string => 'BAR', valueOf: (): number => 42 } as unknown as string;
                Feature('FOO', name, [Feature(), 'BAR'], [Feature.ALL.BAR]);
            },
        );
    },
);

describe
(
    'Feature.ALL',
    (): void =>
    {
        it
        (
            'is frozen',
            (): void =>
            {
                const Feature = createFeatureClass({ });
                assert(Object.isFrozen(Feature.ALL));
            },
        );

        it
        (
            'has no inherited properties',
            (): void =>
            {
                const Feature = createFeatureClass({ });
                for (let obj: unknown = Feature.ALL; obj !== null; obj = Object.getPrototypeOf(obj))
                    assert.deepEqual(Object.getOwnPropertyNames(obj), []);
            },
        );
    },
);

describe
(
    'Feature.ELEMENTARY',
    (): void =>
    {
        it
        (
            'is frozen',
            (): void =>
            {
                const Feature = createFeatureClass({ });
                assert(Object.isFrozen(Feature.ELEMENTARY));
            },
        );

        it
        (
            'is sorted by name',
            (): void =>
            {
                const Feature =
                createFeatureClass({ C: { check: noop }, B: { check: noop }, A: { check: noop } });
                assert.strictEqual(Feature.ELEMENTARY[0], Feature.ALL.A);
                assert.strictEqual(Feature.ELEMENTARY[1], Feature.ALL.B);
                assert.strictEqual(Feature.ELEMENTARY[2], Feature.ALL.C);
            },
        );
    },
);

describe
(
    'Feature.ENGINE',
    (): void =>
    {
        it
        (
            'is frozen',
            (): void =>
            {
                const Feature = createFeatureClass({ });
                assert(Object.isFrozen(Feature.ENGINE));
            },
        );

        it
        (
            'is sorted by name',
            (): void =>
            {
                const Feature =
                createFeatureClass
                (
                    {
                        C: { families: [], versions: [] },
                        B: { families: [], versions: [] },
                        A: { families: [], versions: [] },
                    },
                );
                assert.strictEqual(Feature.ENGINE[0], Feature.ALL.A);
                assert.strictEqual(Feature.ENGINE[1], Feature.ALL.B);
                assert.strictEqual(Feature.ENGINE[2], Feature.ALL.C);
            },
        );
    },
);

describe
(
    'Feature.FEATURES',
    (): void =>
    {
        it
        (
            'is frozen',
            (): void =>
            {
                const Feature = createFeatureClass({ });
                assert(Object.isFrozen(Feature.FAMILIES));
            },
        );

        it
        (
            'has no inherited properties',
            (): void =>
            {
                const Feature = createFeatureClass({ });
                for
                (
                    let obj: unknown = Feature.FAMILIES;
                    obj !== null;
                    obj = Object.getPrototypeOf(obj)
                )
                    assert.deepEqual(Object.getOwnPropertyNames(obj), []);
            },
        );

        it
        (
            'contains expected data',
            (): void =>
            {
                const Feature =
                createFeatureClass
                (
                    {
                        FOO_1: { families: ['foo', 'bar'], versions: ['1', 'I'] },
                        FOO_2: { inherits: 'FOO_1', versions: [['2', '3'], ['II', 'III']] },
                        FOO_4: { inherits: 'FOO_2', families: ['foo'], versions: [['4']] },
                    },
                );
                const actualFoo = Feature.FAMILIES.foo;
                const expectedFoo =
                [
                    {
                        family:         'foo',
                        featureName:    'FOO_1',
                        shortTag:       undefined,
                        tag:            undefined,
                        version:        '1',
                    },
                    {
                        family:         'foo',
                        featureName:    'FOO_2',
                        shortTag:       undefined,
                        tag:            undefined,
                        version:        { from: '2', to: '3', dense: true },
                    },
                    {
                        family:         'foo',
                        featureName:    'FOO_4',
                        shortTag:       undefined,
                        tag:            undefined,
                        version:        { from: '4', to: undefined, dense: false },
                    },
                ];
                assert.deepEqual(actualFoo, expectedFoo);
            },
        );
    },
);

describe
(
    'Feature._fromMask',
    (): void =>
    {
        it
        (
            'returns a feature',
            (): void =>
            {
                const Feature = createFeatureClass({ FOO: { check: noop }, BAR: { check: noop } });
                const { mask } = Feature('FOO', 'BAR');
                const featureObj = Feature._fromMask(mask);
                assert(featureObj);
                assert(maskAreEqual(featureObj.mask, mask));
            },
        );

        it
        (
            'returns null',
            (): void =>
            {
                const Feature =
                createFeatureClass
                (
                    {
                        FOO: { check: noop, excludes: ['BAR'] },
                        BAR: { check: noop, excludes: ['FOO'] },
                    },
                );
                {
                    const mask = maskUnion(Feature.ALL.FOO.mask, Feature.ALL.BAR.mask);
                    const actual = Feature._fromMask(mask);
                    assert.strictEqual(actual, null);
                }
                {
                    const mask = maskNext(maskUnion(Feature.ALL.FOO.mask, Feature.ALL.BAR.mask));
                    const actual = Feature._fromMask(mask);
                    assert.strictEqual(actual, null);
                }
            },
        );
    },
);

it
(
    'Feature._getMask',
    (): void =>
    {
        const Feature = createFeatureClass({ FOO: { check: noop }, BAR: { check: noop } });
        {
            const actual = Feature._getMask(undefined);
            assert(maskAreEqual(actual, MASK_EMPTY), `Actual value is:\n${actual as unknown}`);
        }
        {
            const actual = Feature._getMask('FOO');
            assert
            (maskAreEqual(actual, Feature.ALL.FOO.mask), `Actual value is:\n${actual as unknown}`);
        }
        {
            const actual = Feature._getMask(Feature.ALL.FOO);
            assert
            (maskAreEqual(actual, Feature.ALL.FOO.mask), `Actual value is:\n${actual as unknown}`);
        }
        {
            const compatibleFeatureArray = [Feature.ALL.FOO, Feature.ALL.BAR];
            const actual = Feature._getMask(compatibleFeatureArray);
            assert
            (
                maskAreEqual(actual, featuresToMask(compatibleFeatureArray)),
                `Actual value is:\n${actual as unknown}`,
            );
        }
    },
);

describe.per
(
    [
        {
            description: 'regular signature',
            call:
            (Feature: FeatureConstructor, ...features: FeatureElement[]): boolean =>
            Feature.areCompatible(...features),
        },
        {
            description: 'legacy signature',
            call:
            (Feature: FeatureConstructor, ...features: FeatureElement[]): boolean =>
            Feature.areCompatible(features),
        },
    ],
)
(
    'Feature.areCompatible (#.description)',
    ({ call }: { call: (Feature: FeatureConstructor, ...features: FeatureElement[]) => boolean; }):
    void =>
    {
        it
        (
            'returns true',
            (): void =>
            {
                const Feature = createFeatureClass({ FOO: { check: noop } });
                {
                    const actual = call(Feature);
                    assert.equal(actual, true);
                }
                {
                    const actual = call(Feature, 'FOO');
                    assert.equal(actual, true);
                }
                {
                    const actual = call(Feature, 'FOO', 'FOO');
                    assert.equal(actual, true);
                }
                {
                    const actual = call(Feature, 'FOO', Feature());
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
                createFeatureClass
                (
                    {
                        FOO: { check: noop, excludes: ['BAR'] },
                        BAR: { check: noop, excludes: ['FOO'] },
                    },
                );
                const actual = call(Feature, 'FOO', 'BAR');
                assert.strictEqual(actual, false);
            },
        );

        it
        (
            'accepts mixed arguments',
            (): void =>
            {
                const Feature = createFeatureClass({ FOO: { }, BAR: { } });
                const name =
                { toString: (): string => 'BAR', valueOf: (): number => 42 } as unknown as string;
                call(Feature, 'FOO', name, Feature.ALL.BAR);
            },
        );
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
                const Feature =
                createFeatureClass({ FOO: { check: noop }, BAR: { aliasFor: 'FOO' } });
                {
                    const actual = Feature.areEqual();
                    assert.equal(actual, true);
                }
                {
                    const actual = Feature.areEqual('FOO');
                    assert.equal(actual, true);
                }
                {
                    const actual = Feature.areEqual('FOO', 'FOO');
                    assert.equal(actual, true);
                }
                {
                    const actual = Feature.areEqual('FOO', 'BAR');
                    assert.strictEqual(actual, true);
                }
            },
        );

        it
        (
            'returns false',
            (): void =>
            {
                const Feature = createFeatureClass({ FOO: { check: noop }, BAR: { check: noop } });
                const actual = Feature.areEqual('FOO', 'BAR');
                assert.strictEqual(actual, false);
            },
        );

        it
        (
            'accepts mixed arguments',
            (): void =>
            {
                const Feature = createFeatureClass({ FOO: { }, BAR: { } });
                const name =
                { toString: (): string => 'BAR', valueOf: (): number => 42 } as unknown as string;
                Feature.areEqual('FOO', name, [Feature(), 'BAR'], [Feature.ALL.BAR]);
            },
        );
    },
);

describe
(
    'Feature.commonOf',
    (): void =>
    {
        it
        (
            'returns a new feature',
            (): void =>
            {
                const Feature =
                createFeatureClass
                (
                    {
                        FOO: { check: noop, includes: ['BAR'] },
                        BAR: { check: noop },
                        BAZ: { check: noop, includes: { BAR: true } },
                    },
                );
                const featureObj = Feature.commonOf('FOO', 'BAZ');
                const actual = featureObj!.mask;
                const expected = Feature.ALL.BAR.mask;
                assert(maskAreEqual(actual, expected));
            },
        );

        it
        (
            'returns null',
            (): void =>
            {
                const Feature = createFeatureClass({ });
                const featureObj = Feature.commonOf();
                assert.strictEqual(featureObj, null);
            },
        );

        it
        (
            'accepts mixed arguments',
            (): void =>
            {
                const Feature = createFeatureClass({ FOO: { }, BAR: { } });
                const name =
                { toString: (): string => 'BAR', valueOf: (): number => 42 } as unknown as string;
                Feature.commonOf('FOO', name, [Feature(), 'BAR'], [Feature.ALL.BAR]);
            },
        );
    },
);

it
(
    'Feature.descriptionFor',
    (): void =>
    {
        let formatEngineDescriptionCalls = 0;
        const Feature =
        createFeatureClass
        (
            {
                DEBIAN:     { description: 'Debian', families: ['Linux'], versions: ['11'] },
                UBUNTU:     { aliasFor: 'DEBIAN' },
                MX:         { aliasFor: 'DEBIAN', description: 'MX Linux' },
                WINDOWS:    { families: ['Windows'], versions: ['10'] },
            },
            (compatibilities: readonly CompatibilityInfo[]): string =>
            compatibilities
            .map
            (
                ({ family, version }): string =>
                {
                    ++formatEngineDescriptionCalls;
                    const description = `${family} ${typeof version === 'string' ? version : ''}`;
                    return description;
                },
            )
            .join(),
        );
        assert.strictEqual(Feature.descriptionFor('DEBIAN'), 'Debian');
        assert.strictEqual(Feature.descriptionFor('UBUNTU'), 'Debian');
        assert.strictEqual(Feature.descriptionFor('MX'), 'MX Linux');
        assert.strictEqual(Feature.descriptionFor('WINDOWS'), 'Windows 10');
        assert.throws
        (
            // @ts-expect-error
            (): string | undefined => Feature.descriptionFor(),
            (error): boolean =>
            error instanceof Error && error.message === 'Unknown feature "undefined"',
        );
        assert.strictEqual(formatEngineDescriptionCalls, 1);
    },
);

it
(
    'Feature.prototype.check',
    (): void =>
    {
        let actualThis: unknown;
        const expectedThis =
        (function (this: unknown): unknown
        {
            return this;
        }
        )();
        let argCount!: number;
        let checkValue: unknown;
        const check =
        function (this: unknown): unknown
        {
            actualThis = this;
            argCount = arguments.length;
            return checkValue;
        };
        const Feature = createFeatureClass({ FOO: { check }, BAR: { } });
        assert.strictEqual(typeof Feature.ALL.FOO.check, 'function');
        assert.strictEqual(Feature.ALL.BAR.check, null);
        assert(!('check' in Feature('FOO', 'BAR')));
        {
            checkValue = 0;
            const returnValue = Feature.ALL.FOO.check!();
            assert.strictEqual(actualThis, expectedThis);
            assert.strictEqual(argCount, 0);
            assert.strictEqual(returnValue, false);
        }
        {
            checkValue = 'yes';
            const returnValue = Feature.ALL.FOO.check!();
            assert.strictEqual(actualThis, expectedThis);
            assert.strictEqual(argCount, 0);
            assert.strictEqual(returnValue, true);
        }
    },
);

describe
(
    'Feature.prototype.includes',
    (): void =>
    {
        it
        (
            'returns true',
            (): void =>
            {
                const Feature =
                createFeatureClass
                ({ FOO: { check: noop }, BAR: { check: noop, includes: ['FOO'] } });
                {
                    const actual = Feature().includes();
                    assert.equal(actual, true);
                }
                {
                    const actual = Feature.ALL.FOO.includes();
                    assert.equal(actual, true);
                }
                {
                    const actual = Feature.ALL.FOO.includes(Feature());
                    assert.equal(actual, true);
                }
                {
                    const actual = Feature.ALL.FOO.includes('FOO');
                    assert.equal(actual, true);
                }
                {
                    const actual = Feature.ALL.BAR.includes('FOO');
                    assert.equal(actual, true);
                }
            },
        );

        it
        (
            'returns false',
            (): void =>
            {
                const Feature =
                createFeatureClass
                ({ FOO: { check: noop }, BAR: { check: noop }, BAZ: { check: noop } });
                {
                    const actual = Feature().includes('FOO');
                    assert.equal(actual, false);
                }
                {
                    const actual = Feature.ALL.FOO.includes('BAR');
                    assert.equal(actual, false);
                }
                {
                    const actual = Feature('FOO', 'BAR').includes('BAR', 'BAZ');
                    assert.equal(actual, false);
                }
            },
        );

        it
        (
            'accepts mixed arguments',
            (): void =>
            {
                const Feature = createFeatureClass({ FOO: { }, BAR: { } });
                const name =
                { toString: (): string => 'BAR', valueOf: (): number => 42 } as unknown as string;
                Feature().includes('FOO', name, [Feature(), 'BAR'], [Feature.ALL.BAR]);
            },
        );
    },
);

describe.when(typeof module !== 'undefined')
(
    'Feature.prototype.inspect',
    (): void =>
    {
        it
        (
            'can be called without arguments',
            (): void =>
            {
                const Feature = createFeatureClass({ });
                const featureObj = Feature() as Feature & { inspect(): string; };
                const actual = typeof featureObj.inspect();
                assert.strictEqual(actual, 'string');
            },
        );

        it
        (
            'does not exist in browsers',
            (): void =>
            {
                const exports: { inspect?: typeof util.inspect; } = getNodeUtil();
                const inspect = exports.inspect!;
                try
                {
                    delete exports.inspect;
                    const Feature = createFeatureClass({ });
                    assert(!('inspect' in Feature.prototype));
                }
                finally
                {
                    exports.inspect = inspect;
                }
            },
        );

        it
        (
            'exists in old versions of Node.js',
            (): void =>
            {
                const { inspect }: { readonly inspect: { custom?: typeof util.inspect.custom; }; } =
                getNodeUtil();
                const { custom } = inspect;
                try
                {
                    delete inspect.custom;
                    const Feature = createFeatureClass({ });
                    assert('inspect' in Feature.prototype);
                }
                finally
                {
                    if (custom)
                        inspect.custom = custom;
                }
            },
        );
    },
);

it
(
    'Feature.prototype.toString',
    (): void =>
    {
        const Feature =
        createFeatureClass
        (
            {
                NORMAL:     { },
                BIG:        { check: noop },
                BIGGER:     { check: noop, includes: ['BIG'] },
                UNDERLINED: { check: noop },
            },
        );
        const { NORMAL, BIG, BIGGER, UNDERLINED } = Feature.ALL;
        assert.strictEqual(NORMAL.toString(), '[Feature NORMAL]');
        assert.strictEqual(BIG.toString(), '[Feature BIG]');
        assert.strictEqual(BIGGER.toString(), '[Feature BIGGER]');
        assert.strictEqual(UNDERLINED.toString(), '[Feature UNDERLINED]');
        assert.strictEqual(Feature().toString(), '[Feature <>]');
        assert.strictEqual
        (Feature(UNDERLINED, BIG, BIGGER).toString(), '[Feature <BIGGER, UNDERLINED>]');
    },
);

describe.when(typeof module !== 'undefined')
(
    'Feature inspection',
    (): void =>
    {
        it
        (
            'on predefined features',
            (): void =>
            {
                const { inspect } = getNodeUtil();
                const Feature =
                createFeatureClass
                (
                    {
                        FOO: { check: noop },
                        BAR:
                        {
                            check:      noop,
                            attributes: { foo: null, bar: 'Lorem ipsum dolor sit amet' },
                        },
                    },
                );
                {
                    const actual = inspect(Feature.ALL.FOO);
                    assert.strictEqual
                    (actual, '[Feature FOO (elementary) (check) {}]');
                }
                {
                    const actual = inspect(Feature.ALL.BAR);
                    const expected =
                    '[Feature\n' +
                    '  BAR\n' +
                    '  (elementary)\n' +
                    '  (check)\n' +
                    '  { foo: null, bar: \'Lorem ipsum dolor sit amet\' }\n' +
                    ']';
                    assert.strictEqual(actual, expected);
                }
            },
        );

        it
        (
            'on custom features',
            (): void =>
            {
                const { inspect } = getNodeUtil();
                const Feature =
                createFeatureClass
                (
                    {
                        FEATURE1: { check: noop },
                        FEATURE2: { check: noop },
                        FEATURE3: { check: noop },
                        FEATURE4: { check: noop },
                    },
                );
                {
                    const featureObj = Feature();
                    const actual = inspect(featureObj);
                    assert.strictEqual(actual, '[Feature <>]');
                }
                const [, major, minor] = /^v(\d+)\.(\d+)/.exec(process.version)!;
                if (+major > 0 || +minor >= 12)
                {
                    const featureObj =
                    Feature
                    (
                        Feature.ALL.FEATURE1,
                        Feature.ALL.FEATURE2,
                        Feature.ALL.FEATURE3,
                        Feature.ALL.FEATURE4,
                    );
                    {
                        const actual = inspect(featureObj, { breakLength: 42 });
                        const expected =
                        '[Feature\n' +
                        '  <\n' +
                        '    FEATURE1,\n' +
                        '    FEATURE2,\n' +
                        '    FEATURE3,\n' +
                        '    FEATURE4\n' +
                        '  >\n' +
                        ']';
                        assert.strictEqual(actual, expected);
                    }
                    {
                        const actual = inspect(featureObj, { breakLength: 43 });
                        const expected =
                        '[Feature\n' +
                        '  <FEATURE1, FEATURE2, FEATURE3, FEATURE4>\n' +
                        ']';
                        assert.strictEqual(actual, expected);
                    }
                }
            },
        );

        it
        (
            'on features inside another object',
            (): void =>
            {
                const { inspect } = getNodeUtil();
                const Feature =
                createFeatureClass
                (
                    {
                        DEFAULT:
                        {
                            attributes:
                            { foo: null, bar: 'Lorem ipsum dolor sit amet', baz: '1234567890' },
                        },
                    },
                );
                const featureObj = Feature.ALL.DEFAULT;
                const actual = inspect([featureObj]);
                const expected1 =
                '[\n' +
                '  [Feature\n' +
                '    DEFAULT\n' +
                '    { foo: null, bar: \'Lorem ipsum dolor sit amet\', baz: \'1234567890\' }\n' +
                '  ]\n' +
                ']';
                const expected2 =
                '[ [Feature\n' +
                '  DEFAULT\n' +
                '  { foo: null,\n' +
                '      bar: \'Lorem ipsum dolor sit amet\',\n' +
                '      baz: \'1234567890\' }\n' +
                '] ]';
                const expected3 =
                '[ [Feature\n' +
                '    DEFAULT\n' +
                '    { foo: null,\n' +
                '      bar: \'Lorem ipsum dolor sit amet\',\n' +
                '      baz: \'1234567890\' }\n' +
                '  ] ]';
                assert
                (
                    actual === expected1 || actual === expected2 || actual === expected3,
                    `Actual value is:\n${actual}`,
                );
            },
        );

        it
        (
            'with custom options',
            (): void =>
            {
                const { inspect } = getNodeUtil();
                const Feature = createFeatureClass({ FOO: { check: noop } });
                {
                    const featureObj = Feature(Feature.ALL.FOO);
                    const actual = inspect(featureObj, { compact: undefined });
                    assert.strictEqual(actual, '[Feature <FOO>]');
                }
                {
                    const featureObj = Feature();
                    featureObj.name =
                    '69CHARS69CHARS69CHARS69CHARS69CHARS69CHARS69CHARS69CHARS69CHARS69CHAR';
                    {
                        const actual = inspect(featureObj, { breakLength: undefined });
                        assert.strictEqual(actual, `[Feature ${featureObj.name}]`);
                    }
                    featureObj.name =
                    '70CHARS70CHARS70CHARS70CHARS70CHARS70CHARS70CHARS70CHARS70CHARS70CHARS';
                    {
                        const actual = inspect(featureObj, { breakLength: undefined });
                        assert.strictEqual(actual, `[Feature\n  ${featureObj.name}\n]`);
                    }
                }
            },
        );
    },
);

const STRING_TEST_DATA =
[
    {
        description: 'Feature',
        call:
        (Feature: FeatureConstructor, feature: string): Feature => Feature(feature),
    },
    {
        description: 'new Feature',
        call:
        (Feature: FeatureConstructor, feature: string): Feature => new Feature(feature),
    },
    {
        description: 'Feature._getMask',
        call:
        (Feature: FeatureConstructor, feature: string): Mask => Feature._getMask(feature),
    },
    {
        description: 'Feature.areCompatible (regular signature)',
        call:
        (Feature: FeatureConstructor, feature: string): boolean => Feature.areCompatible(feature),
    },
    {
        description: 'Feature.areCompatible (legacy signature)',
        call:
        (Feature: FeatureConstructor, feature: string): boolean => Feature.areCompatible([feature]),
    },
    {
        description: 'Feature.areEqual',
        call:
        (Feature: FeatureConstructor, feature: string): boolean => Feature.areEqual(feature),
    },
    {
        description: 'Feature.commonOf',
        call:
        (Feature: FeatureConstructor, feature: string): Feature | null => Feature.commonOf(feature),
    },
    {
        description: 'Feature.descriptionFor',
        call:
        (Feature: FeatureConstructor, feature: string): string | undefined =>
        Feature.descriptionFor(feature),
    },
    {
        description: 'Feature.prototype.includes',
        call:
        (Feature: FeatureConstructor, feature: string): boolean => Feature().includes(feature),
    },
];

describe
(
    'An argument of an unrecognized type is converted into a string:',
    (): void =>
    {
        it.per(STRING_TEST_DATA)
        (
            '#.description',
            ({ call }: typeof STRING_TEST_DATA[number]): void =>
            {
                const Feature = createFeatureClass({ FOO: { } });
                const name =
                { toString: (): string => 'FOO', valueOf: (): number => 42 } as unknown as string;
                call(Feature, name);
            },
        );
    },
);

describe.when(typeof Symbol !== 'undefined')
(
    'A symbol cannot be converted into a string:',
    (): void =>
    {
        it.per(STRING_TEST_DATA)
        (
            '#.description',
            ({ call }: typeof STRING_TEST_DATA[number]): void =>
            {
                const Feature = createFeatureClass({ });
                const fn = (): unknown => call(Feature, Symbol() as unknown as string);
                assert.throws
                (
                    fn,
                    (error): boolean =>
                    error instanceof TypeError &&
                    error.message === 'Cannot convert a symbol to a string',
                );
            },
        );
    },
);

describe
(
    'Unknown features result in an error:',
    (): void =>
    {
        it.per(STRING_TEST_DATA)
        (
            '#.description',
            ({ call }: typeof STRING_TEST_DATA[number]): void =>
            {
                const Feature = createFeatureClass({ });
                const fn = (): unknown => call(Feature, '???');
                assert.throws
                (
                    fn,
                    (error): boolean =>
                    error instanceof Error && error.message === 'Unknown feature "???"',
                );
            },
        );
    },
);

const COMPATIBLE_ARRAY_TEST_DATA =
[
    {
        description: 'Feature',
        call:
        (Feature: FeatureConstructor, feature: FeatureElementOrCompatibleArray): Feature =>
        Feature(feature),
    },
    {
        description: 'new Feature',
        call:
        (Feature: FeatureConstructor, feature: FeatureElementOrCompatibleArray): Feature =>
        new Feature(feature),
    },
    {
        description: 'Feature.areEqual',
        call:
        (Feature: FeatureConstructor, feature: FeatureElementOrCompatibleArray): boolean =>
        Feature.areEqual(feature),
    },
    {
        description: 'Feature.commonOf',
        call:
        (Feature: FeatureConstructor, feature: FeatureElementOrCompatibleArray): Feature | null =>
        Feature.commonOf(feature),
    },
    {
        description: 'Feature.prototype.includes',
        call:
        (Feature: FeatureConstructor, feature: FeatureElementOrCompatibleArray): boolean =>
        Feature().includes(feature),
    },
];

describe
(
    'Incompatible feature arrays result in an error:',
    (): void =>
    {
        it.per(COMPATIBLE_ARRAY_TEST_DATA)
        (
            '#.description',
            ({ call }: typeof COMPATIBLE_ARRAY_TEST_DATA[number]): void =>
            {
                const Feature =
                createFeatureClass
                (
                    {
                        FOO: { check: noop, excludes: ['BAR'] },
                        BAR: { check: noop, excludes: ['FOO'] },
                    },
                );
                const fn = (): unknown => call(Feature, ['FOO', 'BAR']);
                assert.throws
                (
                    fn,
                    (error): boolean =>
                    error instanceof Error && error.message === 'Incompatible features',
                );
            },
        );
    },
);
