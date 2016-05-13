var preparse;

(function ()
{
    'use strict';
    
    function isValidFunctionName(functionName)
    {
        var valid = UNRETURNABLE_WORDS.indexOf(functionName) < 0;
        return valid;
    }
    
    function parseParam(str)
    {
        switch (str)
        {
        case 'false':
            return false;
        case 'true':
            return true;
        case 'Infinity':
            return Infinity;
        case 'NaN':
            return NaN;
        case 'undefined':
            return;
        }
        var value;
        if (/^0|[1-9]\d*$/.test(str))
        {
            value = +str;
            if (value <= MAX_SAFE_INTEGER)
                return value;
        }
        else if (/^"[\s\S]*"|'[\s\S]*$'/.test(str))
        {
            try
            {
                value = JSON.parse(str);
            }
            catch (error)
            { }
            return value;
        }
        return null;
    }
    
    var MAX_SAFE_INTEGER = 9007199254740991;
    
    var UNRETURNABLE_WORDS =
        ['delete', 'if', 'new', 'this', 'throw', 'typeof', 'void', 'while', 'with'];
    
    preparse =
        function (input)
        {
            var matches = /^[\s;]*([$A-Z_a-z][$\w]*)\s*\(\s*(.*?)\s*\)[\s;]*$/.exec(input);
            if (matches)
            {
                var functionName = matches[1];
                if (isValidFunctionName(functionName))
                {
                    var param;
                    var paramStr = matches[2];
                    if (paramStr)
                    {
                        var paramValue = parseParam(paramStr);
                        if (paramValue === null)
                            return;
                        param = { value: paramValue };
                    }
                    var paramData = { functionName: functionName, param: param };
                    return paramData;
                }
            }
        };
}
)();
