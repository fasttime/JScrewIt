import { _Object_defineProperty, assignNoEnum } from './obj-utils';
import { AbstractSolution }                     from '~solution';

assignNoEnum
(
    AbstractSolution.prototype,
    {
        get appendLength()
        {
            var extraLength = this.isWeak ? 3 : 1;
            var appendLength = this.length + extraLength;
            return appendLength;
        },
        set appendLength(appendLength)
        {
            _Object_defineProperty(this, 'appendLength', { enumerable: true, value: appendLength });
        },
    }
);

export { DynamicSolution, EMPTY_SOLUTION, LazySolution, SimpleSolution } from '~solution';
