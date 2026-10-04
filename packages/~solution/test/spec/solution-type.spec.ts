import assert                                       from 'node:assert/strict';
import { SolutionType, calculateSolutionType }      from '../../src/solution-type';
import { IS_TYPE_TEST_INFOS, type IsAttrTestInfo }  from './is-attr-test-infos';

it
(
    'calculateSolutionType',
    (): void => assert.throws((): unknown => calculateSolutionType(''), SyntaxError),
);

describe
(
    'SolutionType',
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
            '.#.isAttrName(#.solutionTypeName)',
            ({ isAttrName, solutionType, expectedValue }: IsAttrTestInfo): void =>
            {
                const actualValue = SolutionType[isAttrName](solutionType);
                assert.equal(actualValue, expectedValue);
            },
        );

        it('is frozen', (): void => assert(Object.isFrozen(SolutionType)));
    },
);
