import type * as QuinquagintaDuo    from '../../src/quinquaginta-duo';
import assert                       from 'assert';
import postrequire                  from 'postrequire';

const EMPTY_OBJ = Object.create(null) as { };

type Mask = QuinquagintaDuo.default;

let { maskAreEqual, maskIncludes, maskIntersection, maskNew, maskNext, maskUnion, maskValue } =
clear<typeof QuinquagintaDuo>();

function assertMaskEmpty(actual: Mask): void
{
    const expected = maskNew();
    if (!maskAreEqual(actual, expected))
    {
        assert.fail
        (
            Number(actual),
            Number(expected),
            `Expected ${formatMask(actual)} to be empty`,
            undefined,
            assertMaskEmpty,
        );
    }
}

function assertMaskEqual(actual: Mask, expected: Mask): void
{
    if (!maskAreEqual(actual, expected))
    {
        assert.fail
        (
            Number(actual),
            Number(expected),
            `Expected ${formatMask(actual)} to be equal to ${formatMask(expected)}`,
            undefined,
            assertMaskEqual,
        );
    }
}

function assertMaskInclude(actual: Mask, includedMask: Mask): void
{
    if (!maskIncludes(actual, includedMask))
    {
        assert.fail
        (
            Number(actual),
            undefined,
            `Expected ${formatMask(actual)} to include ${formatMask(includedMask)}`,
            undefined,
            assertMaskInclude,
        );
    }
}

function assertMaskNotEmpty(actual: Mask): void
{
    const expected = maskNew();
    if (maskAreEqual(actual, expected))
    {
        assert.fail
        (
            Number(actual),
            Number(expected),
            `Expected ${formatMask(actual)} to be non-empty`,
            undefined,
            assertMaskNotEmpty,
        );
    }
}

function clear<T extends { }>(): T
{
    return EMPTY_OBJ as T;
}

function formatMask(mask: Mask): string
{
    const str = `mask ${String(maskValue(mask))}`;
    return str;
}

function loadQuinquagintaDuo(): void
{
    (
        { maskAreEqual, maskIncludes, maskIntersection, maskNew, maskNext, maskUnion, maskValue } =
        postrequire('../../src/quinquaginta-duo') as typeof QuinquagintaDuo
    );
}

function loadQuinquagintaDuoWithoutBigInt(): void
{
    if (typeof BigInt === 'function')
    {
        const { BigInt } = global;
        global.BigInt = undefined as unknown as BigIntConstructor;
        try
        {
            loadQuinquagintaDuo();
        }
        finally
        {
            global.BigInt = BigInt;
        }
    }
    else
        loadQuinquagintaDuo();
}

function unloadQuinquagintaDuo(): void
{
    (
        { maskAreEqual, maskIncludes, maskIntersection, maskNew, maskNext, maskUnion, maskValue } =
        clear()
    );
}

describe.per
(
    [
        when
        (
            typeof BigInt === 'function',
            { title: 'when bigint is available', beforeHook: loadQuinquagintaDuo },
        ),
        { title: 'when bigint is not available', beforeHook: loadQuinquagintaDuoWithoutBigInt },
    ],
)
(
    '#.title',
    ({ beforeHook }) =>
    {
        before(beforeHook);

        after(unloadQuinquagintaDuo);

        it
        (
            'maskNew',
            () =>
            {
                const newMask = maskNew();
                assertMaskEmpty(newMask);
            },
        );

        it
        (
            'maskNext',
            () =>
            {
                let prevMask = maskNew();
                for (let count = 0; count < 52; ++count)
                {
                    const nextMask = maskNext(prevMask);
                    assertMaskNotEmpty(nextMask);
                    const intersectionMask = maskIntersection(nextMask, prevMask);
                    assertMaskEmpty(intersectionMask);
                    const unionMask = maskUnion(nextMask, prevMask);
                    prevMask = unionMask;
                }
            },
        );

        it
        (
            'maskUnion',
            () =>
            {
                let prevMask = maskNew();
                for (let count = 0; count < 52; ++count)
                {
                    const nextMask = maskNext(prevMask);
                    const unionMask = maskUnion(nextMask, prevMask);
                    assertMaskInclude(unionMask, prevMask);
                    assertMaskInclude(unionMask, nextMask);
                    prevMask = unionMask;
                }
            },
        );

        it
        (
            'maskIntersection',
            () =>
            {
                const mask0 = maskNew();
                let prevHighMask = mask0;
                let lowMask = maskNext(prevHighMask);
                for (let count = 0; count < 51; ++count)
                {
                    const topMask = maskNext(lowMask);
                    const nextHighMask = maskUnion(prevHighMask, topMask);
                    {
                        const intersectionMask = maskIntersection(lowMask, nextHighMask);
                        assertMaskEqual(intersectionMask, prevHighMask);
                    }
                    {
                        const intersectionMask = maskIntersection(prevHighMask, mask0);
                        assertMaskEmpty(intersectionMask);
                    }
                    prevHighMask = nextHighMask;
                    lowMask = maskUnion(lowMask, topMask);
                }
            },
        );

        it
        (
            'maskValue',
            () =>
            {
                const valueSet: { [Key in PropertyKey]: unknown; } = { __proto__: null };
                let prevMask = maskNew();
                for (let count = 0; count < 52; ++count)
                {
                    const prevValue = maskValue(prevMask);
                    const nextMask = maskNext(prevMask);
                    const nextValue = maskValue(nextMask);
                    valueSet[prevValue as never] = null;
                    if (nextValue as never in valueSet)
                    {
                        assert.fail
                        (`Expected mask value ${String(nextValue)} to be unique but it is not`);
                    }
                    valueSet[nextValue as never] = null;
                    const unionMask = maskUnion(nextMask, prevMask);
                    prevMask = unionMask;
                }
            },
        );
    },
);
