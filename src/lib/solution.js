import { assignNoEnum, _Object_defineProperty } from './obj-utils';

export var LEVEL_NUMERIC    = -1;
export var LEVEL_OBJECT     = 0;
export var LEVEL_STRING     = 1;
export var LEVEL_UNDEFINED  = -2;

function setHasOuterPlus(solution, hasOuterPlus)
{
    _Object_defineProperty(solution, 'hasOuterPlus', { value: hasOuterPlus });
}

export default function Solution(replacement, level, hasOuterPlus)
{
    this.replacement    = replacement;
    this.level          = level;
    if (hasOuterPlus !== undefined)
        setHasOuterPlus(this, hasOuterPlus);
}

var protoSource =
{
    get appendLength()
    {
        var extraLength = this.hasOuterPlus ? 3 : 1;
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
    get length()
    {
        return this.replacement.length;
    },
    toString:
    function ()
    {
        return this.replacement;
    },
};

assignNoEnum(Solution.prototype, protoSource);
