(function (root)
{
    'use strict';

    function formatItem(value)
    {
        var text;
        var type = typeof value;
        try
        {
            if (type === 'string')
                text = '"' + value + '"';
            else if (value === 0 && 1 / value < 0)
                text = '-0';
            else if (Array.isArray(value))
                text = value.length ? '[…]' : '[]';
            else if (type === 'bigint')
                text = value + 'n';
            // In Node.js 0.12, calling String with a symbol argument throws a TypeError.
            // Since this script is only used in browsers this is not a true problem, but still.
            else if (type !== 'symbol')
                text = String(value);
            else
                text = value.toString();
        }
        catch (error)
        { }
        return text;
    }

    root.formatValue =
    function (value)
    {
        var text;
        if (Array.isArray(value))
        {
            try
            {
                text = '[' + value.map(formatItem).join(', ') + ']';
            }
            catch (error)
            { }
        }
        else
            text = formatItem(value);
        return text;
    };

    root.formatValueType =
    function (value)
    {
        var valueType;
        if (value !== null)
        {
            var type = typeof value;
            // document.all has type "undefined".
            if  (type === 'function' || type === 'object' || type === 'undefined')
            {
                var prototype = Object.getPrototypeOf(value);
                if (prototype === Array.prototype)
                {
                    switch (value.length)
                    {
                    case 0:
                        valueType = 'an empty array';
                        break;
                    case 1:
                        valueType = 'a one element array';
                        break;
                    default:
                        valueType = 'an array';
                        break;
                    }
                }
                else if (prototype === Date.prototype)
                    valueType = 'a date';
                else if (prototype === RegExp.prototype)
                    valueType = 'a regular expression';
                else if (type === 'function')
                    valueType = 'a function';
                else
                    valueType = 'an object';
            }
        }
        return valueType;
    };
}
)(this);
