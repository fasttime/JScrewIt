import { LazySolution, SolutionType }   from '../../src/novem';
import assert                           from 'assert';

describe
(
    'LazySolution',
    () =>
    {
        it
        (
            'has expected properties',
            () =>
            {
                const source = 'NaN';
                const replacement = '[][[]]++';
                const createReplacement = (): string => replacement;
                const type = SolutionType.ALGEBRAIC;
                const solution = new LazySolution(source, createReplacement, type);
                assert.strictEqual(solution.source,         source);
                assert.strictEqual(solution.replacement,    replacement);
                assert.strictEqual(solution.type,           type);
            },
        );
        it
        (
            'calls createReplacement',
            () =>
            {
                let callCount = 0;
                const createReplacement =
                (): never =>
                {
                    ++callCount;
                    throw Error();
                };
                const solution =
                new LazySolution(undefined, createReplacement, SolutionType.UNDEFINED);
                assert.strictEqual(callCount, 0);
                assert.throws(() => void solution.replacement);
                assert.strictEqual(callCount, 1);
                assert.throws(() => void solution.replacement);
                assert.strictEqual(callCount, 2);
            },
        );
    },
);
