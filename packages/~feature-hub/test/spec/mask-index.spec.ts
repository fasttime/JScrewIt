import { maskNew }          from '../../src/mask';
import { MaskMap, MaskSet } from '../../src/mask-index';
import assert               from 'assert';

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
                        const mask = maskNew();
                        map.set(mask, 42);
                        const actualValue = map.get(mask);
                        assert.strictEqual(actualValue, 42);
                    },
                );

                it
                (
                    'changes the value of an entry',
                    (): void =>
                    {
                        const map = new MaskMap();
                        const mask = maskNew();
                        map.set(mask, 'foo');
                        map.set(mask, 'bar');
                        const actualValue = map.get(mask);
                        assert.strictEqual(actualValue, 'bar');
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
                const mask = maskNew();
                assert.strictEqual(map.size, 0);
                map.set(mask, true);
                map.set(mask, undefined);
                assert.strictEqual(map.size, 1);
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
                const mask = maskNew();
                set.add(mask);
                const actualValue = set.has(mask);
                assert.strictEqual(actualValue, true);
            },
        );

        it
        (
            'size',
            (): void =>
            {
                const set = new MaskSet();
                const mask = maskNew();
                assert.strictEqual(set.size, 0);
                set.add(mask);
                set.add(mask);
                assert.strictEqual(set.size, 1);
            },
        );
    },
);
