var Empty;

var noProto;

(function ()
{
    'use strict';
    
    Empty = function () { };
    Empty.prototype = Object.create(null);
    
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
