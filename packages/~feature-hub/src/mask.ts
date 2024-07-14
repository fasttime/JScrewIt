/** A vector of boolean elements, intended for efficient bulk operations. */
export interface Mask
{
    [MaskSymbol]: never;
}

declare const MaskSymbol: unique symbol;
