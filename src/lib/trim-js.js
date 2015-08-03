var trimJS;

(function ()
{
    'use strict';
    
    var regExp =
        RegExp(
            '[\n\r]+(?:\\s|//(?:(?!\\*/|`)[^\n\r])*(?![^\n\r])|/\\*(?:(?!`)(?:[^*]|\\*[^/]))*?\\*' +
            '/)*$'
        );
    
    trimJS =
        function (str)
        {
            str =
                (str + '').replace(
                    /^(?:\s|\/\/[^\n\r]*(?![^\n\r])|\/\*(?:[^*]|\*[^\/])*?\*\/)*[\n\r]/,
                    ''
                );
            var match = regExp.exec(str);
            if (match)
            {
                var index = match.index;
                if (str[index - 1] !== '\\')
                {
                    str = str.slice(0, index);
                }
            }
            return str;
        };
}
)();
