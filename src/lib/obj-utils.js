var Empty;

var array_isArray;
var array_prototype_every;
var array_prototype_forEach;
var array_prototype_map;
var array_prototype_push;
var assignNoEnum;
var createConstructor;
var esToString;
var json_parse;
var json_stringify;
var math_abs;
var math_max;
var math_pow;
var noProto;
var noop;
var object_create;
var object_defineProperties;
var object_defineProperty;
var object_freeze;
var object_keys;
var object_getOwnPropertyDescriptor;

(function ()
{
    array_isArray           = Array.isArray;
    array_prototype_every   = Array.prototype.every;
    array_prototype_forEach = Array.prototype.forEach;
    array_prototype_map     = Array.prototype.map;
    array_prototype_push    = Array.prototype.push;

    assignNoEnum =
    function (target, source)
    {
        var descriptors = { };
        var names = object_keys(source);
        names.forEach
        (
            function (name)
            {
                var descriptor = object_getOwnPropertyDescriptor(source, name);
                descriptor.enumerable = false;
                descriptors[name] = descriptor;
            }
        );
        object_defineProperties(target, descriptors);
        return target;
    };

    createConstructor =
    function (prototype)
    {
        var constructor = Function();
        constructor.prototype = prototype;
        return constructor;
    };

    esToString =
    function (arg)
    {
        if (typeof arg === 'symbol')
            throw new TypeError('Cannot convert a symbol to a string');
        var str = String(arg);
        return str;
    };

    json_parse      = JSON.parse;
    json_stringify  = JSON.stringify;

    math_abs    = Math.abs;
    math_max    = Math.max;
    math_pow    = Math.pow;

    noProto =
    function (obj)
    {
        var result = new Empty();
        object_keys(obj).forEach
        (
            function (name)
            {
                result[name] = obj[name];
            }
        );
        return result;
    };

    noop = Function();

    object_create                   = Object.create;
    object_defineProperties         = Object.defineProperties;
    object_defineProperty           = Object.defineProperty;
    object_freeze                   = Object.freeze;
    object_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    object_keys                     = Object.keys;

    Empty = createConstructor(object_freeze(object_create(null)));
}
)();
