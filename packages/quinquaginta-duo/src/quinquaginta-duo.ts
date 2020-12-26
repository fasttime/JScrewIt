declare const MaskSymbol: unique symbol;

let EMPTY_MASK: Mask;

export default interface Mask
{
    [MaskSymbol]: never;
}

export const maskAreEqual = (mask1: Mask, mask2: Mask): boolean => mask1 === mask2;

export let maskIncludes: (includingMask: Mask, includedMask: Mask) => boolean;

export let maskIntersection: (mask1: Mask, mask2: Mask) => Mask;

export const maskNew = (): Mask => EMPTY_MASK;

export let maskNext: (mask: Mask) => Mask;

export let maskUnion: (mask1: Mask, mask2: Mask) => Mask;

export const maskValue =
(mask: Mask): string | number | bigint | boolean | undefined | symbol => mask as never;

if (typeof BigInt === 'function')
{
    const BIG_INT_1 = BigInt(1);

    EMPTY_MASK = BigInt(0) as unknown as Mask;

    maskIncludes =
    (includingMask: Mask, includedMask: Mask): boolean =>
    ((includingMask as never) & (includedMask as never)) === includedMask as never;

    maskIntersection =
    (mask1: Mask, mask2: Mask): Mask => ((mask1 as never) & (mask2 as never)) as unknown as Mask;

    maskNext = (mask: Mask): Mask =>
    {
        let nextValue = BIG_INT_1;
        while ((mask as never) & nextValue)
            nextValue <<= BIG_INT_1;
        return nextValue as unknown as Mask;
    };

    maskUnion =
    (mask1: Mask, mask2: Mask): Mask => ((mask1 as never) | (mask2 as never)) as unknown as Mask;
}
else
{
    const BIN_POW_31 = 0x80000000;
    const BIN_POW_32 = 0x100000000;
    const BIT_MASK_31 = 0x7fffffff;

    EMPTY_MASK = 0 as unknown as Mask;

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
    ) as unknown as Mask;

    maskNext = (mask: Mask): Mask =>
    {
        let nextValue = 1;
        for (let checkValue: number = mask as never; checkValue & 1; checkValue /= 2)
            nextValue *= 2;
        return nextValue as unknown as Mask;
    };

    maskUnion =
    (mask1: Mask, mask2: Mask): Mask =>
    (
        (((mask1 as never) | (mask2 as never)) & BIT_MASK_31) +
        ((mask1 as never) / BIN_POW_31 | (mask2 as never) / BIN_POW_31) * BIN_POW_31
    ) as unknown as Mask;
}
