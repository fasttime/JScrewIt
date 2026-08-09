import assert               from 'node:assert/strict';
import { MASK_EMPTY }       from '../../src/mask-impl';
import { MaskMap, MaskSet } from '../../src/mask-index';

describe
(
    'MaskMap',
    (): void =>
    {
        describe
        (
            'set',
            (): void =>
            {
                it
                (
                    'adds a new entry',
                    (): void =>
                    {
                        const map = new MaskMap();
                        const mask = MASK_EMPTY;
                        map.set(mask, 42);
                        const actualValue = map.get(mask);
                        assert.equal(actualValue, 42);
                    },
                );

                it
                (
                    'changes the value of an entry',
                    (): void =>
                    {
                        const map = new MaskMap();
                        const mask = MASK_EMPTY;
                        map.set(mask, 'foo');
                        map.set(mask, 'bar');
                        const actualValue = map.get(mask);
                        assert.equal(actualValue, 'bar');
                    },
                );
            },
        );

        it
        (
            'size',
            (): void =>
            {
                const map = new MaskMap();
                const mask = MASK_EMPTY;
                assert.equal(map.size, 0);
                map.set(mask, true);
                map.set(mask, undefined);
                assert.equal(map.size, 1);
            },
        );
    },
);

describe
(
    'MaskSet',
    (): void =>
    {
        it
        (
            'add',
            (): void =>
            {
                const set = new MaskSet();
                const mask = MASK_EMPTY;
                set.add(mask);
                const actualValue = set.has(mask);
                assert.equal(actualValue, true);
            },
        );

        it
        (
            'size',
            (): void =>
            {
                const set = new MaskSet();
                const mask = MASK_EMPTY;
                assert.equal(set.size, 0);
                set.add(mask);
                set.add(mask);
                assert.equal(set.size, 1);
            },
        );
    },
);
