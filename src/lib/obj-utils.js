var Empty;

var assignNoEnum;
var noProto;

(function ()
{
    'use strict';
    
    Empty = Function();
    Empty.prototype = Object.create(null);
    
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
}
)();
