var Empty;

var array_isArray;
var array_prototype_every;
var array_prototype_forEach;
var array_prototype_map;
var assignNoEnum;
var createConstructor;
var noProto;
var object_create;
var object_defineProperty;
var object_freeze;
var object_keys;

(function ()
{
    'use strict';
    
    array_isArray = Array.isArray;
    
    array_prototype_every = Array.prototype.every;
    
    array_prototype_forEach = Array.prototype.forEach;
    
    array_prototype_map = Array.prototype.map;
    
    assignNoEnum =
        function (target, source)
        {
            var descriptors = { };
            object_keys(source).forEach(
                function (name)
                {
                    var descriptor = Object.getOwnPropertyDescriptor(source, name);
                    descriptor.enumerable = false;
                    descriptors[name] = descriptor;
                }
            );
            Object.defineProperties(target, descriptors);
            return target;
        };
    
    createConstructor =
        function (prototype)
        {
            var constructor = Function();
            constructor.prototype = prototype;
            return constructor;
        };
    
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
    
    object_create = Object.create;
    
    object_defineProperty = Object.defineProperty;
    
    object_freeze = Object.freeze;
    
    object_keys = Object.keys;
    
    Empty = createConstructor(object_create(null));
}
)();
