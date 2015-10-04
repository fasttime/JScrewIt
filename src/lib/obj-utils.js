var Empty;

var assignNoEnum;
var createConstructor;
var isArray;
var noProto;

(function ()
{
    'use strict';
    
    assignNoEnum =
        function (target, source)
        {
            var descriptors = { };
            Object.keys(source).forEach(
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
    
    isArray = Array.isArray;
    
    noProto =
        function (obj)
        {
            var result = new Empty();
            Object.keys(obj).forEach(
                function (name)
                {
                    result[name] = obj[name];
                }
            );
            return result;
        };
    
    Empty = createConstructor(Object.create(null));
}
)();
