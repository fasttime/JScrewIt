var Empty;

var array_isArray;
var array_prototype_every;
var array_prototype_forEach;
var array_prototype_map;
var array_prototype_push;
var assignNoEnum;
var createConstructor;
var json_parse;
var math_abs;
var math_max;
var math_pow;
var noProto;
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
            object_keys(source).forEach(
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
    
    json_parse = JSON.parse;
    
    math_abs    = Math.abs;
    math_max    = Math.max;
    math_pow    = Math.pow;
    
    noProto =
        function (obj)
        {
            var result = new Empty();
            object_keys(obj).forEach(
                function (name)
                {
                    result[name] = obj[name];
                }
            );
            return result;
        };
    
    object_create                   = Object.create;
    object_defineProperties         = Object.defineProperties;
    object_defineProperty           = Object.defineProperty;
    object_freeze                   = Object.freeze;
    object_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    object_keys                     = Object.keys;
    
    Empty = createConstructor(object_create(null));
}
)();
