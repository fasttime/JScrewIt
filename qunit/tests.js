// Test cases for art.js

(
function ()
{
    function assertOk(key, compatibility)
    {
        var encoded = JSFuck.encode(key, false, compatibility);
        var alphabetOk = /^[\[\]\(\)\+!]*$/.test(encoded);
        if (!alphabetOk) throw Error();
        var output = key;
        if (/[\0-\7]/.test(key))
        {
            output = '\\' + key.charCodeAt(0);
        }
        else if (key == '\b')
        {
            output = '\\b';
        }
        else if (key == '\f')
        {
            output = '\\f';
        }
        else if (key == '\n')
        {
            output = '\\n';
        }
        else if (key == '\r')
        {
            output = '\\r';
        }
        else if (key == '\t')
        {
            output = '\\t';
        }
        else if (key == '\v')
        {
            output = '\\v';
        }
        else if (key == '"')
        {
            output = '\\"';
        }
        else if (key == '\\')
        {
            output = '\\\\';
        }
        else if (/[\0-\x1f\x7f-\x9f]/.test(key))
        {
            output = key.charCodeAt(0).toString(16);
            if (output.length < 2) output = '0' + output;
            output = '\\x' + output;
        }
        strictEqual(
            eval(encoded),
            key,
            'Mapping for "' +  output + '": ' + encoded.length + ' chars'
            );
    }
    
    test(
        'Character mappings DEFAULT',
        function ()
        {
            for (var i = 0; i < 512; ++i)
            {
                var key = String.fromCharCode(i);
                assertOk(key, 'DEFAULT');
            }
        }
        );
    
    var isIE = /\b(MSIE|Trident)\b/.test(navigator.userAgent);
    if (!isIE)
    {
        test(
            'Character mappings NO_IE',
            function ()
            {
                for (var i = 0; i < 512; ++i)
                {
                    var key = String.fromCharCode(i);
                    assertOk(key, 'NO_IE');
                }
            }
            );
    }
}
)();
