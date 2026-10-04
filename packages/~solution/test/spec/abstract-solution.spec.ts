import assert                                       from 'node:assert/strict';
import { SimpleSolution }                           from '../../src/solution';
import { SolutionType }                             from '../../src/solution-type';
import { IS_TYPE_TEST_INFOS, type IsAttrTestInfo }  from './is-attr-test-infos';

describe
(
    'AbstractSolution',
    (): void =>
    {
        it
        .per
        (
            IS_TYPE_TEST_INFOS,
            (info: IsAttrTestInfo): IsAttrTestInfo =>
            {
                const solutionTypeName = SolutionType[info.solutionType];
                const returnValue = { ...info, solutionTypeName };
                return returnValue;
            },
        )
        (
            '#.isAttrName with type #.solutionTypeName',
            ({ isAttrName, solutionType, expectedValue }: IsAttrTestInfo): void =>
            {
                const solution = new SimpleSolution(undefined, '', solutionType);
                assert.equal(solution[isAttrName], expectedValue);
            },
        );
    },
);
