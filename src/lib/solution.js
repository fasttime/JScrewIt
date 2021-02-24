import { assignNoEnum, _Object_defineProperty } from './obj-utils';
import { AbstractSolution }                     from 'novem';

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

export { DynamicSolution, EMPTY_SOLUTION, LazySolution, SimpleSolution } from 'novem';
