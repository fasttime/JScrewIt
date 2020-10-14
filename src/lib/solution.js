import { assignNoEnum, _Object_defineProperty } from './obj-utils';
import { AbstractSolution }                     from 'novem';

var protoSource =
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
};

assignNoEnum(AbstractSolution.prototype, protoSource);

export { DynamicSolution, EMPTY_SOLUTION, LazySolution, SimpleSolution } from 'novem';
