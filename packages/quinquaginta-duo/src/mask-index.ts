import type { Mask } from './mask';

const keyFor = (mask: Mask): string => `_${mask as never as number}`;

const setEntry =
<ValueType>(map: { [KeyType in string]?: ValueType; }, mask: Mask, value: ValueType): void =>
{
    const key = keyFor(mask);
    map[key] = value;
};

class MaskIndex<ValueType>
{
    protected readonly _index = Object.create(null) as { [KeyType in string]?: ValueType; };

    /* Determines whether the current collection is empty. */
    public get isEmpty(): boolean
    {
        for (const mask in this._index) // eslint-disable-line no-unreachable-loop
            return false;
        return true;
    }
}

/** A data structure that maps masks to arbitrary values. */
export class MaskMap<ValueType> extends MaskIndex<ValueType>
{
    /**
     * Retrieves the value associated with a specified mask, or `undefined` if the mask has not been
     * set.
     */
    public get(mask: Mask): ValueType | undefined
    {
        const key = keyFor(mask);
        const value = this._index[key];
        return value;
    }

    /**
     * Associates a specified value with a specified mask.
     * If the mask has already been set, the previous value will be overwritten.
     */
    public set(mask: Mask, value: ValueType): void
    {
        setEntry(this._index, mask, value);
    }
}

/** A data structure that stores unique masks. */
export class MaskSet extends MaskIndex<void>
{
    /**
     * Adds a specified mask to the current `MaskSet` object.
     * If the mask has already been added, nothing is done.
     */
    public add(mask: Mask): void
    {
        setEntry(this._index, mask, null);
    }

    /** Determines whether a specified mask has been added to the current `MaskSet` object. */
    public has(mask: Mask): boolean
    {
        const key = keyFor(mask);
        const returnValue = key in this._index;
        return returnValue;
    }
}
