import assert                                   from 'node:assert/strict';
import { SolutionType, calculateSolutionType }  from '../../src/solution-type';

it
(
    'calculateSolutionType',
    (): void => assert.throws((): unknown => calculateSolutionType(''), SyntaxError),
);

it('SolutionType is frozen', (): void => assert(Object.isFrozen(SolutionType)));
