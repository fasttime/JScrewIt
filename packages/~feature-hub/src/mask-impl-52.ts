import type { Mask } from './mask';

const BIN_POW_31    = 0x8000_0000;
const BIN_POW_32    = 0x1_0000_0000;
const BIN_POW_51    = 0x8_0000_0000_0000;
const BIT_MASK_31   = 0x7fff_ffff;

const EMPTY_MASK: Mask = 0 as never;

/** The maximum number of disjoint, non-empty masks supported by this implementation. */
export const MASK_MAX_SIZE = 52 as number;

/** Determines whether two specified masks are equal. */
export function maskAreEqual(mask1: Mask, mask2: Mask): boolean
{
    return mask1 === mask2;
}

/** Determines whether a specified mask includes another one. */
export function maskIncludes(includingMask: Mask, includedMask: Mask): boolean
{
    let includedLoValue: number;
    let includedHiValue: number;
    const returnValue =
    (
        (includingMask as never) &
        (includedLoValue = (includedMask as never) | 0)
    ) ===
    includedLoValue &&
    (
        includingMask as never / BIN_POW_32 &
        (includedHiValue = includedMask as never / BIN_POW_32 | 0)
    ) ===
    includedHiValue;
    return returnValue;
}

/** Returns a new mask that is the intersection of two specified masks. */
export function maskIntersection(mask1: Mask, mask2: Mask): Mask
{
    const intersectionMask: Mask =
    (
        ((mask1 as unknown as number) & (mask2 as unknown as number) & BIT_MASK_31) +
        ((mask1 as never) / BIN_POW_31 & (mask2 as never) / BIN_POW_31) * BIN_POW_31
    ) as never;
    return intersectionMask;
}

/** Returns a new empty mask. */
export function maskNew(): Mask
{
    return EMPTY_MASK;
}

/**
 * Returns a new non-empty mask that does not intersect the specified mask.
 *
 * @throws If the specified mask is full, a `RangeError` is thrown.
 */
export function maskNext(mask: Mask): Mask
{
    let nextValue = 1;
    for (let checkValue: number = mask as never; checkValue & 1; checkValue /= 2)
        nextValue *= 2;
    if (nextValue > BIN_POW_51)
        throw RangeError('Mask full');
    return nextValue as never;
}

/** Returns a new mask that is the union of two specified masks. */
export function maskUnion(mask1: Mask, mask2: Mask): Mask
{
    const unionMask: Mask =
    (
        (((mask1 as unknown as number) | (mask2 as unknown as number)) & BIT_MASK_31) +
        ((mask1 as never) / BIN_POW_31 | (mask2 as never) / BIN_POW_31) * BIN_POW_31
    ) as never;
    return unionMask;
}
