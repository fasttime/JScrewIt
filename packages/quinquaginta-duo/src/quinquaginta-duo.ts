declare const MaskSymbol: unique symbol;

let EMPTY_MASK: Mask;
let FULL_MASK: Mask;

/** A vector of boolean elements, intended for efficient bulk operations. */
export default interface Mask
{
    [MaskSymbol]: never;
}

/** Determines whether two specified masks are equal. */
export const maskAreEqual = (mask1: Mask, mask2: Mask): boolean => mask1 === mask2;

/** Determines whether a specified mask includes another one. */
export let maskIncludes: (includingMask: Mask, includedMask: Mask) => boolean;

/** Returns a new mask that is the intersection of two specified masks. */
export let maskIntersection: (mask1: Mask, mask2: Mask) => Mask;

/** Returns a new empty mask. */
export const maskNew = (): Mask => EMPTY_MASK;

/**
 * Returns a new non-empty mask that does not intersect the specified mask.
 *
 * @throws If the specified mask is full, a `RangeError` is thrown.
 */
export let maskNext: (mask: Mask) => Mask;

/** Returns a new mask that is the union of two specified masks. */
export let maskUnion: (mask1: Mask, mask2: Mask) => Mask;

/** Returns a primitive value uniquely associated with the specified mask. */
export const maskValue = (mask: Mask): unknown => mask;

function ensureMaskNotFull(mask: Mask): void
{
    if (mask === FULL_MASK)
        throw RangeError('Mask full');
}

if (typeof BigInt === 'function')
{
    const BIG_INT_1 = BigInt(1);

    EMPTY_MASK  = BigInt(0) as never;
    FULL_MASK   = BigInt(0xfffffffffffff) as never;

    maskIncludes =
    (includingMask: Mask, includedMask: Mask): boolean =>
    ((includingMask as never) & (includedMask as never)) === includedMask as never;

    maskIntersection =
    (mask1: Mask, mask2: Mask): Mask => ((mask1 as never) & (mask2 as never)) as never;

    maskNext = (mask: Mask): Mask =>
    {
        ensureMaskNotFull(mask);
        let nextValue = BIG_INT_1;
        while ((mask as never) & nextValue)
            nextValue <<= BIG_INT_1;
        return nextValue as never;
    };

    maskUnion =
    (mask1: Mask, mask2: Mask): Mask => ((mask1 as never) | (mask2 as never)) as never;
}
else
{
    const BIN_POW_31 = 0x80000000;
    const BIN_POW_32 = 0x100000000;
    const BIT_MASK_31 = 0x7fffffff;

    EMPTY_MASK  = 0 as never;
    FULL_MASK   = 0xfffffffffffff as never;

    maskIncludes =
    (includingMask: Mask, includedMask: Mask): boolean =>
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
    };

    maskIntersection =
    (mask1: Mask, mask2: Mask): Mask =>
    (
        ((mask1 as never) & (mask2 as never) & BIT_MASK_31) +
        ((mask1 as never) / BIN_POW_31 & (mask2 as never) / BIN_POW_31) * BIN_POW_31
    ) as never;

    maskNext = (mask: Mask): Mask =>
    {
        ensureMaskNotFull(mask);
        let nextValue = 1;
        for (let checkValue: number = mask as never; checkValue & 1; checkValue /= 2)
            nextValue *= 2;
        return nextValue as never;
    };

    maskUnion =
    (mask1: Mask, mask2: Mask): Mask =>
    (
        (((mask1 as never) | (mask2 as never)) & BIT_MASK_31) +
        ((mask1 as never) / BIN_POW_31 | (mask2 as never) / BIN_POW_31) * BIN_POW_31
    ) as never;
}
