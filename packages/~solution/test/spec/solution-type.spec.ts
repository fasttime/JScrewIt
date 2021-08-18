import { SolutionType, calculateSolutionType }  from '../../src/solution-type';
import assert                                   from 'assert';

it
(
    'calculateSolutionType',
    (): void => assert.throws((): unknown => calculateSolutionType(''), SyntaxError),
);

it('SolutionType is frozen', (): void => assert(Object.isFrozen(SolutionType)));
