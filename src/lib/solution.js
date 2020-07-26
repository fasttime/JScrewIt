import { assignNoEnum, _Object_create, _Object_defineProperty } from './obj-utils';
import { SimpleSolution }                                       from 'novem';

export default function Solution(source, replacement, type)
{
    SimpleSolution.call(this, source, replacement, type);
}

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
    constructor: Solution,
};

var prototype = Solution.prototype = _Object_create(SimpleSolution.prototype);
assignNoEnum(prototype, protoSource);
