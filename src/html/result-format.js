(function (root)
{
    'use strict';
    
    function formatItem(value)
    {
        var text;
        if (typeof value === 'string')
            text = '"' + value + '"';
        else if (value === 0 && 1 / value < 0)
            text = '-0';
        else if (Array.isArray(value))
        {
            try
            {
                text = value.length ? '[…]' : '[]';
            }
            catch (error)
            { }
        }
        else
        {
            try
            {
                text = String(value);
            }
            catch (error)
            { }
        }
        return text;
    }
    
    function getStringTag(value)
    {
        var str;
        try
        {
            str = Object.prototype.toString.call(value);
        }
        catch (error)
        {
            return;
        }
        var strTag = str.slice(8, -1);
        return strTag;
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
                switch (typeof value)
                {
                case 'function':
                    valueType = 'a function';
                    break;
                case 'object':
                case 'undefined': // document.all
                    var strTag = getStringTag(value);
                    switch (strTag)
                    {
                    case 'Array':
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
                        break;
                    case 'Date':
                        valueType = 'a date';
                        break;
                    case 'RegExp':
                        valueType = 'a regular expression';
                        break;
                    default:
                        valueType = 'an object';
                        break;
                    }
                    break;
                }
            }
            return valueType;
        };
}
)(this);
