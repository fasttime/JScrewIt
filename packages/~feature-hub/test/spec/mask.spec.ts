import
{ type Mask, maskAreEqual, maskIncludes, maskIntersection, maskNew, maskNext, maskUnion }
from '../../src/mask';

import assert, { AssertionError } from 'assert';

function assertFail
(message: string, stackStartFn: (...args: never) => unknown, actual?: unknown, expected?: unknown):
never
{
    const options = { message, actual, expected, stackStartFn, stackStartFunction: stackStartFn };
    const error = new AssertionError(options);
    throw error;
}

function assertMaskEmpty(actual: Mask): void
{
    const expected = maskNew();
    if (!maskAreEqual(actual, expected))
    {
        const message = `Expected ${formatMask(actual)} to be empty`;
        assertFail(message, assertMaskEmpty, actual, expected);
    }
}

function assertMaskEqual(actual: Mask, expected: Mask): void
{
    if (!maskAreEqual(actual, expected))
    {
        const message = `Expected ${formatMask(actual)} to be equal to ${formatMask(expected)}`;
        assertFail(message, assertMaskEqual, actual, expected);
    }
}

function assertMaskInclude(actual: Mask, includedMask: Mask): void
{
    if (!maskIncludes(actual, includedMask))
    {
        const message = `Expected ${formatMask(actual)} to include ${formatMask(includedMask)}`;
        assertFail(message, assertMaskInclude, actual);
    }
}

function assertMaskNotEmpty(actual: Mask): void
{
    const expected = maskNew();
    if (maskAreEqual(actual, expected))
    {
        const message = `Expected ${formatMask(actual)} to be non-empty`;
        assertFail(message, assertMaskNotEmpty, actual);
    }
}

function formatMask(mask: Mask): string
{
    const str = `mask ${String(mask)}`;
    return str;
}

it
(
    'maskNew',
    (): void =>
    {
        const newMask = maskNew();
        assertMaskEmpty(newMask);
    },
);

it
(
    'maskNext',
    (): void =>
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
        assert.throws((): Mask => maskNext(prevMask), RangeError);
    },
);

it
(
    'maskUnion',
    (): void =>
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
    (): void =>
    {
        const mask0 = maskNew();
        let prevHighMask = mask0;
        let lowMask = maskNext(mask0);
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
