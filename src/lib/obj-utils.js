var Empty;

var assignNoEnum;
var create;
var createConstructor;
var defineProperty;
var isArray;
var keys;
var noProto;

(function ()
{
    'use strict';
    
    assignNoEnum =
        function (target, source)
        {
            var descriptors = { };
            keys(source).forEach(
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
    
    create = Object.create;
    
    createConstructor =
        function (prototype)
        {
            var constructor = Function();
            constructor.prototype = prototype;
            return constructor;
        };
    
    defineProperty = Object.defineProperty;
    
    isArray = Array.isArray;
    
    keys = Object.keys;
    
    noProto =
        function (obj)
        {
            var result = new Empty();
            keys(obj).forEach(
                function (name)
                {
                    result[name] = obj[name];
                }
            );
            return result;
        };
    
    Empty = createConstructor(create(null));
}
)();
