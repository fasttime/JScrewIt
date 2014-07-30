/* global describe, expect, it */
'use strict';

(function (self)
{
    function createOutput(compatibilities)
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
            'JScrewIt.encode',
            function()
            {
                describeTest('DEFAULT');
                if (JScrewIt.isAvailable('COMPACT'))
                {
                    describeTest('COMPACT');
                }
                if (JScrewIt.isAvailable('NO_IE'))
                {
                    describeTest('NO_IE');
                }
                describeTest('AUTO');
            }
        );
        describe(
            'JScrewIt.getSubFeatures',
            function()
            {
                it(
                    'returns an empty array for the DEFAULT feature',
                    function ()
                    {
                        var subFeatures = JScrewIt.getSubFeatures('DEFAULT');
                        expect(subFeatures.length).toBe(0);
                    }
                );
                it(
                    'returns a non-empty array for the AUTO feature',
                    function ()
                    {
                        var subFeatures = JScrewIt.getSubFeatures('AUTO');
                        expect(subFeatures.length).toBeGreaterThan(0);
                    }
                );
                it(
                    'returns an array containing NO_IE_SRC for the CHROME_SRC feature',
                    function ()
                    {
                        var subFeatures = JScrewIt.getSubFeatures('CHROME_SRC');
                        expect(subFeatures).toContain('NO_IE_SRC');
                    }
                );
                it(
                    'returns each time a new array',
                    function ()
                    {
                        var subFeatures1 = JScrewIt.getSubFeatures('AUTO');
                        var subFeatures2 = JScrewIt.getSubFeatures('AUTO');
                        expect(subFeatures1).not.toBe(subFeatures2);
                    }
                );
                it(
                    'throws a ReferenceError for a nonexisting feature',
                    function ()
                    {
                        var fn = function () { JScrewIt.getSubFeatures('xyz'); };
                        expect(fn).toThrow(new ReferenceError('Unknown feature "xyz"'));
                    }
                );
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
    
    var JScrewIt;
    
    self.TestSuite = { createOutput: createOutput, init: init, run: run };
    
})(typeof(exports) === 'undefined' ? window : exports);
