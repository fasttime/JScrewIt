import type { Mask } from './mask';

const keyFor = (mask: Mask): string => `_${mask as never as number}`;

class MaskIndex<ValueType>
{
    protected readonly _index = Object.create(null) as Record<string, ValueType>;
    private _size = 0;

    /* The number of entries in the current collection. */
    public get size(): number
    {
        return this._size;
    }

    /** Determines whether the current collection contains an entry for a specified mask. */
    public has(mask: Mask): boolean
    {
        const key = keyFor(mask);
        const returnValue = key in this._index;
        return returnValue;
    }

    protected _setEntry(mask: Mask, value: ValueType): void
    {
        const key = keyFor(mask);
        const { _index } = this;
        if (!(key in _index))
            ++this._size;
        _index[key] = value;
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
        this._setEntry(mask, value);
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
        this._setEntry(mask, undefined);
    }
}
