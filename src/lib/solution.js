import { assignNoEnum, _Object_defineProperty } from './obj-utils';
import { SimpleSolution }                       from 'novem';

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

assignNoEnum(SimpleSolution.prototype, protoSource);

export default SimpleSolution;
