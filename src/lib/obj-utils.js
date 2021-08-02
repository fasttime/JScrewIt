/* global setTimeout */

export var _Array                           = Array;
export var _Array_isArray                   = _Array.isArray;
export var _Array_prototype_every_call;
export var _Array_prototype_forEach_call;
export var _Array_prototype_map_call;
export var _Array_prototype_push_apply;
export var _Array_prototype_slice_call;

export var _Date                            = Date;

export var _Error                           = Error;

export var _Function                        = Function;

export var _JSON_parse                      = JSON.parse;
export var _JSON_stringify                  = JSON.stringify;

export var _Math_abs                        = Math.abs;
export var _Math_max                        = Math.max;
export var _Math_min                        = Math.min;
export var _Math_pow                        = Math.pow;

export var _Object                          = Object;
export var _Object_create                   = _Object.create;
export var _Object_defineProperty           = _Object.defineProperty;
export var _Object_freeze                   = _Object.freeze;
export var _Object_getOwnPropertyDescriptor = _Object.getOwnPropertyDescriptor;
export var _Object_keys                     = _Object.keys;

export var _RegExp                          = RegExp;

export var _String                          = String;

export var _SyntaxError                     = SyntaxError;

export var _TypeError                       = TypeError;

export var _parseInt                        = parseInt;

export var _setTimeout                      = setTimeout;

export function assignNoEnum(target, source)
{
    var names = _Object_keys(source);
    names.forEach
    (
        function (name)
        {
            var descriptor = _Object_getOwnPropertyDescriptor(source, name);
            descriptor.enumerable = false;
            _Object_defineProperty(target, name, descriptor);
        }
    );
    return target;
}

export var createEmpty = _Object_create.bind(null, null, undefined);

export function esToString(arg)
{
    if (typeof arg === 'symbol')
        throw new _TypeError('Cannot convert a symbol to a string');
    var str = _String(arg);
    return str;
}

export function noProto(obj)
{
    var result = createEmpty();
    _Object_keys(obj).forEach
    (
        function (name)
        {
            result[name] = obj[name];
        }
    );
    return result;
}

export function tryCreateRegExp(pattern, flags)
{
    try
    {
        var regExp = _RegExp(pattern, flags);
        // In Android Browser 4.0, the RegExp constructor ignores unrecognized flags instead of
        // throwing a SyntaxError.
        if (regExp.flags === flags)
            return regExp;
    }
    catch (error)
    { }
}

export var noop = _Function();

(function ()
{
    var _Array_prototype            = _Array.prototype;
    var _Function_prototype         = _Function.prototype;
    var _Function_prototype_apply   = _Function_prototype.apply;
    var _Function_prototype_call    = _Function_prototype.call;

    _Array_prototype_every_call     = _Function_prototype_call.bind(_Array_prototype.every);
    _Array_prototype_forEach_call   = _Function_prototype_call.bind(_Array_prototype.forEach);
    _Array_prototype_map_call       = _Function_prototype_call.bind(_Array_prototype.map);
    _Array_prototype_slice_call     = _Function_prototype_call.bind(_Array_prototype.slice);
    _Array_prototype_push_apply     = _Function_prototype_apply.bind(_Array_prototype.push);
}
)();
