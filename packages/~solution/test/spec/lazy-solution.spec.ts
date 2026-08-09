import assert                           from 'node:assert/strict';
import { LazySolution, SolutionType }   from '../../src/index';

describe
(
    'LazySolution',
    (): void =>
    {
        it
        (
            'has expected properties',
            (): void =>
            {
                const source = 'NaN';
                const replacement = '[][[]]++';
                const createReplacement = (): string => replacement;
                const type = SolutionType.ALGEBRAIC;
                const solution = new LazySolution(source, createReplacement, type);
                assert.equal(solution.source,       source);
                assert.equal(solution.replacement,  replacement);
                assert.equal(solution.type,         type);
            },
        );
        it
        (
            'calls createReplacement',
            (): void =>
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
                assert.equal(callCount, 0);
                assert.throws((): void => void solution.replacement);
                assert.equal(callCount, 1);
                assert.throws((): void => void solution.replacement);
                assert.equal(callCount, 2);
            },
        );
    },
);
