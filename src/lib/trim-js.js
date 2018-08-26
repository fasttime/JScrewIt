var trimJS;

(function ()
{
    var regExp =
        RegExp(
            '(?:(?!.)\\s)+(?:\\s|\uFEFF|//(?:(?!\\*/|`).)*(?!.)|/\\*(?:(?!`)(?:[^*]|\\*[^/]))*?\\' +
            '*/)*$'
        );

    trimJS =
        function (str)
        {
            str = str.replace(/^(?:\s|\uFEFF|\/\/.*(?!.)|\/\*[\s\S]*?\*\/)*(?!.)\s/, '');
            var match = regExp.exec(str);
            if (match)
            {
                var index = match.index;
                if (str[index - 1] !== '\\')
                    str = str.slice(0, index);
            }
            return str;
        };
}
)();
