import { assignNoEnum, _Object_create, _Object_defineProperty } from './obj-utils';
import { SimpleSolution, SolutionType }                         from 'novem';

export var LEVEL_NUMERIC    = -1;
export var LEVEL_OBJECT     = 0;
export var LEVEL_STRING     = 1;
export var LEVEL_UNDEFINED  = -2;

function getSolutionType(level, hasOuterPlus)
{
    switch (level)
    {
    case LEVEL_UNDEFINED:
        return SolutionType.UNDEFINED;
    case LEVEL_NUMERIC:
        return hasOuterPlus ? SolutionType.WEAK_NUMERIC : SolutionType.NUMERIC;
    case LEVEL_OBJECT:
        return SolutionType.OBJECT;
    case LEVEL_STRING:
        return hasOuterPlus ? SolutionType.WEAK_PREFIXED_STRING : SolutionType.PREFIXED_STRING;
    }
}

function setHasOuterPlus(solution, hasOuterPlus)
{
    _Object_defineProperty(solution, 'hasOuterPlus', { value: hasOuterPlus });
}

export default function Solution(replacement, level, hasOuterPlus)
{
    var type = getSolutionType(level, hasOuterPlus);
    SimpleSolution.call(this, undefined, replacement, type);
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
