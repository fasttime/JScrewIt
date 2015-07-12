/* jshint browser: true */

(function ()
{
    'use strict';
    
    function art(tag)
    {
        var node;
        if (tag instanceof Node)
        {
            node = tag;
        }
        else if (typeof tag === 'function')
        {
            node = tag.call(art);
        }
        else
        {
            node = document.createElement(tag);
        }
        var argCount = arguments.length;
        for (var index = 1; index < argCount; ++index)
        {
            var arg = arguments[index];
            if (arg instanceof Node)
            {
                node.appendChild(arg);
            }
            else if (arg != null)
            {
                var type = typeof arg;
                if (type === 'object')
                {
                    deepAssign(node, arg);
                }
                else if (type === 'function')
                {
                    arg.call(art, node);
                }
                else
                {
                    node.appendChild(document.createTextNode(arg));
                }
            }
        }
        return node;
    }
    
    function deepAssign(target, source)
    {
        for (var name in source)
        {
            var value = source[name];
            if (name in target && typeof value === 'object')
            {
                deepAssign(target[name], value);
            }
            else
            {
                target[name] = value;
            }
        }
    }
    
    art.on =
        function (type, listener, useCapture)
        {
            function addEventListener(target)
            {
                target.addEventListener(type, listener, useCapture);
            }
            
            return addEventListener;
        };
    
    window.art = art;

})();
