import type { Mask } from './mask';

const LO_INDEX = 0;
const HI_INDEX = 1;

type LoHi = readonly [number, number];

const freezeMask = (_LoHi: LoHi): Mask => Object.freeze(_LoHi) as unknown as Mask;

/** The maximum number of disjoint, non-empty masks supported by this implementation. */
export const MASK_MAX_SIZE = 64 as number;

/** Determines whether two specified masks are equal. */
export function maskAreEqual(mask1: Mask, mask2: Mask): boolean
{
    const _LoHi1 = mask1 as unknown as LoHi;
    const _LoHi2 = mask2 as unknown as LoHi;
    return _LoHi1[LO_INDEX] === _LoHi2[LO_INDEX] && _LoHi1[HI_INDEX] === _LoHi2[HI_INDEX];
}

/** Determines whether a specified mask includes another one. */
export function maskIncludes(includingMask: Mask, includedMask: Mask): boolean
{
    const includingLoHi = includingMask as unknown as LoHi;
    const includedLoHi  = includedMask  as unknown as LoHi;
    let includedLoValue: number;
    let includedHiValue: number;
    const returnValue =
    (includedLoValue = includedLoHi[LO_INDEX]) === (includedLoValue & includingLoHi[LO_INDEX]) &&
    (includedHiValue = includedLoHi[HI_INDEX]) === (includedHiValue & includingLoHi[HI_INDEX]);
    return returnValue;
}

/** Returns a new mask that is the intersection of two specified masks. */
export function maskIntersection(mask1: Mask, mask2: Mask): Mask
{
    const _LoHi1 = mask1 as unknown as LoHi;
    const _LoHi2 = mask2 as unknown as LoHi;
    const intersectionLo = _LoHi1[LO_INDEX] & _LoHi2[LO_INDEX];
    const intersectionHi = _LoHi1[HI_INDEX] & _LoHi2[HI_INDEX];
    const intersectionLoHi: LoHi = [intersectionLo, intersectionHi];
    return freezeMask(intersectionLoHi);
}

/** Returns a new empty mask. */
export function maskNew(): Mask
{
    return freezeMask([0, 0]);
}

/**
 * Returns a new non-empty mask that does not intersect the specified mask.
 *
 * @throws If the specified mask is full, a `RangeError` is thrown.
 */
export function maskNext(mask: Mask): Mask
{
    const _LoHi = mask as unknown as LoHi;
    let bitIndex = 0;
    for (; _LoHi[bitIndex >> 5] & 1 << (bitIndex & 0x1F); bitIndex++)
    {
        if (bitIndex === 63)
            throw RangeError('Mask full');
    }
    const nextLoHi: [number, number] = [0, 0];
    nextLoHi[bitIndex >> 5] = 1 << (bitIndex & 0x1F);
    return freezeMask(nextLoHi);
}

/** Returns a new mask that is the union of two specified masks. */
export function maskUnion(mask1: Mask, mask2: Mask): Mask
{
    const _LoHi1 = mask1 as unknown as LoHi;
    const _LoHi2 = mask2 as unknown as LoHi;
    const unionLo = _LoHi1[LO_INDEX] | _LoHi2[LO_INDEX];
    const unionHi = _LoHi1[HI_INDEX] | _LoHi2[HI_INDEX];
    const unionLoHi: LoHi = [unionLo, unionHi];
    return freezeMask(unionLoHi);
}
