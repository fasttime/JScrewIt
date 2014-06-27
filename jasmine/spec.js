"use strict";

function prettyFormat(char)
{
    var output;
    if (/[\0-\7]/.test(char))
    {
        output = '\\' + char.charCodeAt(0);
    }
    else if (char == '\b')
    {
        output = '\\b';
    }
    else if (char == '\f')
    {
        output = '\\f';
    }
    else if (char == '\n')
    {
        output = '\\n';
    }
    else if (char == '\r')
    {
        output = '\\r';
    }
    else if (char == '\t')
    {
        output = '\\t';
    }
    else if (char == '\v')
    {
        output = '\\v';
    }
    else if (char == '"')
    {
        output = '\\"';
    }
    else if (char == '\\')
    {
        output = '\\\\';
    }
    else if (/[\0-\x1f\x7f-\x9f]/.test(char))
    {
        output = char.charCodeAt(0).toString(16);
        if (output.length < 2) output = '0' + output;
        output = '\\x' + output;
    }
    else
    {
        output = char;
    }
    return output;
}

function testChars(test)
{
    var code;
    for (code = 0; code < 128; ++code)
    {
        test(code);
    }
    for (; code < 0x00010000; code <<= 1)
    {
        test(code + 33);
    }
}

beforeEach(
    function ()
    {
        jasmine.addMatchers(
            {
                toEvaluateTo:
                function ()
                {
                    var result =
                    {
                        compare:
                        function (actual, expected)
                        {
                            var message, pass;
                            var pretty = prettyFormat(expected);
                            try
                            {
                                pass = eval(actual) === expected;
                                message =
                                    pretty + (pass ? " is encoded well." : " is not encoded well.");
                            }
                            catch (e)
                            {
                                pass = false;
                                message = "The encoding of " + pretty + " cannot be evaluated.";
                            }
                            var result = { message: message, pass: pass };
                            return result;
                        }
                    };
                    return result;
                }
            }
        );
    }
);

describe(
    "JScrewIt",
    function()
    {
        it(
            "should encode with DEFAULT compatibility",
            function()
            {
                testChars(
                    function (code)
                    {
                        var char = String.fromCharCode(code);
                        var result = JScrewIt.encode(char);
                        expect(result).toEvaluateTo(char);
                        expect(result).toMatch(/^[!+()[\]]*$/);
                    }
                );
            }
        );
        
        var isIE = /\b(MSIE|Trident)\b/.test(navigator.userAgent);
        if (!isIE)
        {
            it(
                "should encode with NO_IE compatibility",
                function()
                {
                    testChars(
                        function (code)
                        {
                            var char = String.fromCharCode(code);
                            var result = JScrewIt.encode(char, false, "NO_IE");
                            expect(result).toEvaluateTo(char);
                            expect(result).toMatch(/^[!+()[\]]*$/);
                            expect(result.length).not.toBeGreaterThan(JScrewIt.encode(char).length);
                        }
                    );
                }
            );
        }
    }
);
