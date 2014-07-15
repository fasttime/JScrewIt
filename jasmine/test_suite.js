/* global describe, expect, it, navigator */
'use strict';

(function (self)
{
    function createOutput()
    {
        function appendLengths(name, char)
        {
            result += '\n' + padRight(name, 4);
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
        
        function appendLengthsRange(min, max, namer)
        {
            namer = namer || function () { return '`' + String.fromCharCode(charCode) + '`'; };
            for (var charCode = min; charCode <= max; ++charCode)
            {
                var name = namer(charCode);
                var char = String.fromCharCode(charCode);
                appendLengths(name, char);
            }
        }
        
        var result = '    ';
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
        result += '\n    ' + new Array(compatibilities.length + 1).join(' -------');
        var C0_CONTROL_CODE_NAMES =
        [
            'NUL',  'SOH',  'STX',  'ETX',  'EOT',  'ENQ',  'ACK',  'BEL',
            'BS',   'HT',   'LF',   'VT',   'FF',   'CR',   'SO',   'SI',
            'DLE',  'DC1',  'DC2',  'DC3',  'DC4',  'NAK',  'SYN',  'ETB',
            'CAN',  'EM',   'SUB',  'ESC',  'FS',   'GS',   'RS',   'US'
        ];
        appendLengthsRange(0, 31, function (charCode) { return C0_CONTROL_CODE_NAMES[charCode]; });
        appendLengthsRange(32, 126);
        appendLengths('DEL', '\x7f');
        var C1_CONTROL_CODE_NAMES =
        [
            'PAD',  'HOP',  'BPH',  'NBH',  'IND',  'NEL',  'SSA',  'ESA',
            'HTS',  'HTJ',  'VTS',  'PLD',  'PLU',  'RI',   'SS2',  'SS3',
            'DCS',  'PU1',  'PU2',  'STS',  'CCH',  'MW',   'SPA',  'EPA',
            'SOS',  'SGCI', 'SCI',  'CSI',  'ST',   'OSC',  'PM',   'APC'
        ];
        appendLengthsRange(
            128,
            159,
            function (charCode) { return C1_CONTROL_CODE_NAMES[charCode - 0x80]; }
        );
        appendLengths('NBSP', '\xa0');
        appendLengthsRange(161, 172);
        appendLengths('SHY', '\xad');
        appendLengthsRange(174, 255);
        appendLengths('`♥`', '♥');
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
                for (code = 0; code < 256; ++code)
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
    
    function test(charCode, compatibility)
    {
        var char = String.fromCharCode(charCode);
        var desc =
            charCode >= 0x7f && charCode <= 0xa0 || charCode === 0xad ?
            '"\\u00' + charCode.toString(16) + '"' : JSON.stringify(char);
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
