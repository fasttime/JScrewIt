import { assignNoEnum, _Object_create, _Object_defineProperty } from './obj-utils';
import { SimpleSolution }                                       from 'novem';

function setHasOuterPlus(solution, hasOuterPlus)
{
    _Object_defineProperty(solution, 'hasOuterPlus', { value: hasOuterPlus });
}

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
    charAt:
    function (index)
    {
        return this.replacement[index];
    },
    constructor: Solution,
    // Determine whether the specified solution contains a plus sign out of brackets not preceded by
    // an exclamation mark or by another plus sign.
    get hasOuterPlus()
    {
        var str = this.replacement;
        for (;;)
        {
            var newStr = str.replace(/\([^()]*\)|\[[^[\]]*]/g, '.');
            if (newStr.length === str.length)
                break;
            str = newStr;
        }
        var hasOuterPlus = /(^|[^!+])\+/.test(str);
        setHasOuterPlus(this, hasOuterPlus);
        return hasOuterPlus;
    },
    toString:
    function ()
    {
        return this.replacement;
    },
};

var prototype = Solution.prototype = _Object_create(SimpleSolution.prototype);
assignNoEnum(prototype, protoSource);
