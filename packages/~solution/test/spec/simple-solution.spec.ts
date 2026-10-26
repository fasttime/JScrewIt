import assert                                                   from 'node:assert/strict';
import { DynamicSolution, SimpleSolution, SolutionType }        from '../../src/index';

describe
(
    'SimpleSolution',
    (): void =>
    {
        it
        (
            'has expected properties',
            (): void =>
            {
                const source = 'f';
                const replacement = '(![]+[])[+[]]';
                const type = SolutionType.STRING;
                const solution = new SimpleSolution(source, replacement, type);
                assert.equal(solution.source,       source);
                assert.equal(solution.replacement,  replacement);
                assert.equal(solution.type,         type);
            },
        );
        describe
        (
            'from',
            (): void =>
            {
                it
                (
                    'returns a SimpleSolution with the same properties',
                    (): void =>
                    {
                        const dynamicSolution = new DynamicSolution();
                        dynamicSolution.append
                        (new SimpleSolution('false', '![]', SolutionType.ALGEBRAIC));
                        dynamicSolution.append
                        (new SimpleSolution('0', '[+[]]', SolutionType.OBJECT));
                        const solution = SimpleSolution.from(dynamicSolution);
                        assert(solution instanceof SimpleSolution);
                        assert.equal(solution.source,       'false0');
                        assert.equal(solution.replacement,  '![]+[+[]]');
                        assert.equal(solution.type,         SolutionType.PREFIXED_STRING);
                    },
                );
                it
                (
                    'preserves an undefined source',
                    (): void =>
                    {
                        const original =
                        new SimpleSolution(undefined, '[][[]]', SolutionType.UNDEFINED);
                        const solution = SimpleSolution.from(original);
                        assert.equal(solution.source, undefined);
                    },
                );
                it
                (
                    'returns a new object',
                    (): void =>
                    {
                        const original = new SimpleSolution('', '[]', SolutionType.OBJECT);
                        const solution = SimpleSolution.from(original);
                        assert.notEqual(solution, original);
                        assert.deepEqual(solution, original);
                    },
                );
            },
        );
    },
);
