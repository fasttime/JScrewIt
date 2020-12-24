import { SolutionType, calculateSolutionType }  from '../../src/solution-type';
import assert                                   from 'assert';

it('calculateSolutionType', () => assert.throws(() => calculateSolutionType(''), SyntaxError));

it('SolutionType is frozen', () => assert(Object.isFrozen(SolutionType)));
