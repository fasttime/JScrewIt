import { assignNoEnum, _Object_create, _Object_defineProperty } from './obj-utils';
import { SimpleSolution, SolutionType }                         from 'novem';

export var LEVEL_NUMERIC    = -1;
export var LEVEL_OBJECT     = 0;
export var LEVEL_STRING     = 1;
export var LEVEL_UNDEFINED  = -2;

function getSolutionType(solution)
{
    var type;
    switch (solution.level)
    {
    case LEVEL_UNDEFINED:
        type = SolutionType.UNDEFINED;
        break;
    case LEVEL_NUMERIC:
        type = solution.hasOuterPlus ? SolutionType.WEAK_NUMERIC : SolutionType.NUMERIC;
        break;
    case LEVEL_OBJECT:
        type = SolutionType.OBJECT;
        break;
    case LEVEL_STRING:
        type =
        solution.hasOuterPlus ? SolutionType.WEAK_PREFIXED_STRING : SolutionType.PREFIXED_STRING;
        break;
    }
    return type;
}

function setHasOuterPlus(solution, hasOuterPlus)
{
    _Object_defineProperty(solution, 'hasOuterPlus', { value: hasOuterPlus });
}

export default function Solution(source, replacement, level, hasOuterPlus)
{
    this.replacement    = replacement;
    this.level          = level;
    if (hasOuterPlus !== undefined)
        setHasOuterPlus(this, hasOuterPlus);
    var type = getSolutionType(this);
    SimpleSolution.call(this, source, replacement, type);
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
