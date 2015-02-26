var trimJS;

(function ()
{
    'use strict';
    
    function expand(pattern, replacementMap)
    {
        function replaceCode(_, code)
        {
            var replacement = replacementMap[code];
            return replacement;
        }
        
        var result = pattern.replace(/%([A-Z]+)/g, replaceCode);
        return result;
    }
    
    var pattern =
        expand(
            '^%NCS(?:(%PCS(?:%NCS%PCS)*)%NCS)?$',
            {
                NCS:
                    expand(
                        '(?:%SLC|%MLC|%WHS)*',
                        {
                            SLC: '//[^\\n\\r]*(?![^\\n\\r])',
                            MLC: '/\\*[^]*?\\*/',
                            WHS: '\\s+',
                        }
                    ),
                PCS:
                    expand(
                        '(?:%DQS|%SQS|%MLS|%COD)',
                        {
                            DQS: '"(?:[^"]|\\")*"',
                            SQS: '\'(?:[^\']|\\\')*\'',
                            MLS: '`(?:[^`]|\\`)*`',
                            COD: '(?:[^\\s"\'`/]|/[^/\*])+'
                        }
                    ),
            }
        );
    
    var regExp = RegExp(pattern);
    
    trimJS =
        function (input)
        {
            var match = regExp.exec(input);
            if (match)
            {
                var output = match[1] || '';
                return output;
            }
        };

})();
