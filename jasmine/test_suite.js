/* global describe, expect, it, navigator */
'use strict';

(function (self)
{
    function createOutput()
    {
        function appendLengths(char)
        {
            compatibilities.forEach(
                function (compatibility)
                {
                    var content;
                    try
                    {
                        content = JScrewIt.encode(char, false, compatibility).length;
                    }
                    catch (e)
                    {
                        content = 'ERROR';
                    }
                    result += padLeft(content, 8);
                }
            );
        }
        
        var result = '   ';
        var compatibilities = ['DEFAULT'];
        if (!isIE)
        {
            compatibilities.push('NO_IE');
        }
        compatibilities.push('NO_NODE');
        compatibilities.forEach(
            function (compatibility)
            {
                result += padBoth(compatibility, 8);
            }
        );
        result = result.replace(/ +$/, '');
        result += '\n   ' + new Array(compatibilities.length + 1).join(' -------');
        result += '\nNL ';
        appendLengths('\n');
        var MIN = 32, MAX = 127;
        for (var code = MIN; code < MAX; ++code)
        {
            var char = String.fromCharCode(code);
            result += '\n`' + char + '`';
            appendLengths(char);
        }
        result += '\n`©`';
        appendLengths('©');
        result += '\n`♥`';
        appendLengths('♥');
        return result;
    }
    
    function createOutputNodeJs()
    {
        try
        {
            global.atob =
                function (value)
                {
                    return new Buffer(value + '', 'base64').toString('binary');
                };
            global.btoa =
                function (value)
                {
                    return new Buffer(value + '', 'binary').toString('base64');
                };
            global.self = self;
            return createOutput();
        }
        finally
        {
            delete global.atob;
            delete global.btoa;
            delete global.self;
        }
    }
    
    function describeTest(compatibility)
    {
        describe(
            'encodes with ' + compatibility + ' compatibility',
            function ()
            {
                var code;
                for (code = 0; code < 128; ++code)
                {
                    test(code, compatibility);
                }
                for (; code < 0x00010000; code <<= 1)
                {
                    test(code + 33, compatibility);
                }
            }
        );
    }
    
    function init(env)
    {
        JScrewIt = (env || self).JScrewIt;
    }
    
    function padBoth(str, length)
    {
        str += '';
        var result = padLeft(padRight(str, length + str.length >> 1), length);
        return result;
    }
    
    function padLeft(str, length)
    {
        str += '';
        var result = new Array(length - str.length + 1).join(' ') + str;
        return result;
    }
    
    function padRight(str, length)
    {
        str += '';
        var result = str + new Array(length - str.length + 1).join(' ');
        return result;
    }
    
    function run()
    {
        describe(
            'JScrewIt',
            function()
            {
                describeTest('DEFAULT');
                if (!isIE)
                {
                    describeTest('NO_IE');
                }
                if (!isNodeJs)
                {
                    describeTest('NO_NODE');
                }
            }
        );
    }
    
    function test(code, compatibility)
    {
        var char = String.fromCharCode(code);
        var desc = char === '\x7f' ? '"\\u007f"' : JSON.stringify(char);
        it(
            desc,
            function ()
            {
                var encoding = JScrewIt.encode(char, false, compatibility);
                expect(eval(encoding)).toBe(char);
                expect(encoding).toMatch(/^[!+()[\]]*$/);
                if (compatibility !== 'DEFAULT')
                {
                    expect(encoding.length).not.toBeGreaterThan(JScrewIt.encode(char).length);
                }
            }
        );
    }
    
    var isIE = typeof navigator !== 'undefined' && /\b(MSIE|Trident)\b/.test(navigator.userAgent);
    var isNodeJs = typeof module !== 'undefined' && !!module.exports;
    var JScrewIt;
    
    self.TestSuite =
    {
        createOutput: isNodeJs ? createOutputNodeJs : createOutput,
        init: init,
        run: run
    };
    
})(typeof(exports) === 'undefined' ? window : exports);
