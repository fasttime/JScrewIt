import { maskNew, maskNext }    from '../../src/mask';
import { MaskMap, MaskSet }     from '../../src/mask-index';
import assert                   from 'assert';

describe
(
    'MaskMap',
    () =>
    {
        describe
        (
            'set',
            () =>
            {
                it
                (
                    'adds a new entry',
                    () =>
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
                    () =>
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
    },
);

describe
(
    'MaskSet',
    () =>
    {
        it
        (
            'add',
            () =>
            {
                const set = new MaskSet();
                const mask = maskNew();
                set.add(mask);
                const actualValue = set.has(mask);
                assert.strictEqual(actualValue, true);
            },
        );
    },
);
