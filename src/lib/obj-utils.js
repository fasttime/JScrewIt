var Empty;

var _Array;
var _Array_isArray;
var _Array_prototype_every;
var _Array_prototype_forEach;
var _Array_prototype_map;
var _Array_prototype_push;
var _Error;
var _Function;
var _JSON_parse;
var _JSON_stringify;
var _Math_abs;
var _Math_max;
var _Math_pow;
var _Object;
var _Object_create;
var _Object_defineProperties;
var _Object_defineProperty;
var _Object_freeze;
var _Object_keys;
var _Object_getOwnPropertyDescriptor;
var _String;
var _SyntaxError;
var assignNoEnum;
var createConstructor;
var esToString;
var noProto;
var noop;

(function ()
{
    var _Array_prototype;
    var _TypeError;

    _Array                              = Array;
    _Array_isArray                      = _Array.isArray;
    _Array_prototype                    = _Array.prototype;
    _Array_prototype_every              = _Array_prototype.every;
    _Array_prototype_forEach            = _Array_prototype.forEach;
    _Array_prototype_map                = _Array_prototype.map;
    _Array_prototype_push               = _Array_prototype.push;

    _Error                              = Error;

    _Function                           = Function;

    _JSON_parse                         = JSON.parse;
    _JSON_stringify                     = JSON.stringify;

    _Math_abs                           = Math.abs;
    _Math_max                           = Math.max;
    _Math_pow                           = Math.pow;

    _Object                             = Object;
    _Object_create                      = _Object.create;
    _Object_defineProperties            = _Object.defineProperties;
    _Object_defineProperty              = _Object.defineProperty;
    _Object_freeze                      = _Object.freeze;
    _Object_getOwnPropertyDescriptor    = _Object.getOwnPropertyDescriptor;
    _Object_keys                        = _Object.keys;

    _String                             = String;

    _SyntaxError                        = SyntaxError;

    _TypeError                          = TypeError;

    assignNoEnum =
    function (target, source)
    {
        var descriptors = { };
        var names = _Object_keys(source);
        names.forEach
        (
            function (name)
            {
                var descriptor = _Object_getOwnPropertyDescriptor(source, name);
                descriptor.enumerable = false;
                descriptors[name] = descriptor;
            }
        );
        _Object_defineProperties(target, descriptors);
        return target;
    };

    createConstructor =
    function (prototype)
    {
        var constructor = _Function();
        constructor.prototype = prototype;
        return constructor;
    };

    esToString =
    function (arg)
    {
        if (typeof arg === 'symbol')
            throw new _TypeError('Cannot convert a symbol to a string');
        var str = _String(arg);
        return str;
    };

    noProto =
    function (obj)
    {
        var result = new Empty();
        _Object_keys(obj).forEach
        (
            function (name)
            {
                result[name] = obj[name];
            }
        );
        return result;
    };

    noop = _Function();

    Empty = createConstructor(_Object_freeze(_Object_create(null)));
}
)();
