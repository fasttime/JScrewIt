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
            Object.keys(source).forEach(
                function (name)
                {
                    var value = source[name];
                    Object.defineProperty(
                        target,
                        name,
                        { configurable: true, value: value, writable: true }
                    );
                }
            );
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
