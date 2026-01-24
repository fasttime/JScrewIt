import type { Mask } from './mask';

/** An empty mask. */
export const MASK_EMPTY: Mask = 0 as never;

/** The maximum number of disjoint, non-empty masks supported by this implementation. */
export const MASK_MAX_SIZE = 32 as number;

/** Determines whether two specified masks are equal. */
export function maskAreEqual(mask1: Mask, mask2: Mask): boolean
{
    return mask1 === mask2;
}

/** Determines whether a specified mask includes another one. */
export function maskIncludes(includingMask: Mask, includedMask: Mask): boolean
{
    const returnValue =
    ((includingMask as never) & (includedMask as never)) === includedMask as never;
    return returnValue;
}

/** Returns a new mask that is the intersection of two specified masks. */
export function maskIntersection(mask1: Mask, mask2: Mask): Mask
{
    const intersectionMask: Mask = ((mask1 as never) & (mask2 as never)) as never;
    return intersectionMask;
}

/**
 * Returns a new non-empty mask that does not intersect the specified mask.
 *
 * @throws If the specified mask is full, a `RangeError` is thrown.
 */
export function maskNext(mask: Mask): Mask
{
    const nextValue = mask as never + 1 & ~mask;
    if (!nextValue)
        throw RangeError('Mask full');
    return nextValue as never;
}

/** Returns a new mask that is the union of two specified masks. */
export function maskUnion(mask1: Mask, mask2: Mask): Mask
{
    const unionMask: Mask = ((mask1 as never) | (mask2 as never)) as never;
    return unionMask;
}
