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
        
        var result = '     ';
        compatibilities.forEach(
            function (compatibility)
            {
                result += padBoth(compatibility, 8);
            }
        );
        result = result.replace(/ +$/, '');
        result += '\n    ' + Array(compatibilities.length + 1).join(' -------');
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
                    test(code + 0x3f, compatibility);
                }
                var expression = 'return Math.log(2e18)^0';
                it(
                    JSON.stringify(expression) + ' (with wrapWithEval)',
                    function ()
                    {
                        var encoding = JScrewIt.encode(expression, true, compatibility);
                        expect(eval(encoding)).toBe(42);
                    }
                );
            }
        );
    }
    
    function getAvailableFeatures()
    {
        var result = JScrewIt.FEATURE_INFOS.AUTO.includes;
        return result;
    }
    
    function init(arg)
    {
        JScrewIt = arg || self.JScrewIt;
    }
    
    function padBoth(str, length)
    {
        str += '';
        var result = padRight(padLeft(str, length + str.length >> 1), length);
        return result;
    }
    
    function padLeft(str, length)
    {
        str += '';
        var result = Array(length - str.length + 1).join(' ') + str;
        return result;
    }
    
    function padRight(str, length)
    {
        str += '';
        var result = str + Array(length - str.length + 1).join(' ');
        return result;
    }
    
    function run()
    {
        describe(
            'JScrewIt.encode',
            function()
            {
                describeTest('DEFAULT');
                if (JScrewIt.areFeaturesAvailable('COMPACT'))
                {
                    describeTest('COMPACT');
                }
                if (JScrewIt.areFeaturesAvailable('NO_IE'))
                {
                    describeTest('NO_IE');
                }
                describeTest('AUTO');
                it(
                    'throws a ReferenceError for incompatible features',
                    function ()
                    {
                        var fn =
                            function () { JScrewIt.encode('', false, ['NO_IE_SRC', 'IE_SRC']); };
                        expect(fn).toThrow(ReferenceError('Incompatible features'));
                    }
                );
            }
        );
        describe(
            'JScrewIt.areFeaturesCompatible',
            function()
            {
                it(
                    'returns true for compatible features',
                    function ()
                    {
                        var compatible = JScrewIt.areFeaturesCompatible(['FILL', 'SELF']);
                        expect(compatible).toBe(true);
                    }
                );
                it(
                    'returns false for incompatible features',
                    function ()
                    {
                        var compatible = JScrewIt.areFeaturesCompatible(['CHROME_SRC', 'IE_SRC']);
                        expect(compatible).toBe(false);
                    }
                );
                it(
                    'throws a ReferenceError for unknown features',
                    function ()
                    {
                        var fn = function () { JScrewIt.areFeaturesCompatible(['???']); };
                        expect(fn).toThrow(ReferenceError('Unknown feature "???"'));
                    }
                );
            }
        );
        describe(
            'JScrewIt.FEATURE_INFOS',
            function()
            {
                describe(
                    'contains correct information for the feature',
                    function ()
                    {
                        it(
                            'DEFAULT',
                            function ()
                            {
                                var info = JScrewIt.FEATURE_INFOS.DEFAULT;
                                expect(info.available).toBe(true);
                                expect(info.includes.length).toBe(0);
                                expect(info.excludes.length).toBe(0);
                            }
                        );
                        it(
                            'AUTO',
                            function ()
                            {
                                var info = JScrewIt.FEATURE_INFOS.AUTO;
                                expect(info.available).toBe(true);
                                expect(info.includes.length).toBeGreaterThan(0);
                                expect(info.excludes.length).toBe(0);
                            }
                        );
                        it(
                            'CHROME_SRC',
                            function ()
                            {
                                var info = JScrewIt.FEATURE_INFOS.CHROME_SRC;
                                expect(info.includes).toContain('NO_IE_SRC');
                                expect(info.excludes).toContain('FF_SAFARI_SRC');
                            }
                        );
                    }
                );
                describe(
                    'contains only well-formed obejcts:',
                    function ()
                    {
                        var features = Object.getOwnPropertyNames(JScrewIt.FEATURE_INFOS);
                        features.forEach(
                            function (feature)
                            {
                                it(
                                    feature,
                                    function ()
                                    {
                                        var info = JScrewIt.FEATURE_INFOS[feature];
                                        expect(typeof info).toBe('object');
                                        expect(info.name).toBe(feature);
                                        var available = info.available;
                                        expect(typeof available).toBe('boolean');
                                        expect(available).toBe(
                                            JScrewIt.areFeaturesAvailable(feature)
                                        );
                                        expect(Array.isArray(info.includes)).toBeTruthy();
                                        var excludes = info.excludes;
                                        expect(Array.isArray(excludes)).toBeTruthy();
                                        expect(typeof info.description).toBe('string');
                                        excludes.forEach(
                                            function (exclude)
                                            {
                                                var info = JScrewIt.FEATURE_INFOS[exclude];
                                                expect(info.excludes).toContain(feature);
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
        describe(
            'JScrewIt.debug.defineConstant fails for',
            function ()
            {
                it(
                    'invalid identifier',
                    function ()
                    {
                        expect(
                            function ()
                            {
                                JScrewIt.debug.defineConstant('X:X', '0');
                            }
                        ).toThrow(SyntaxError('Invalid identifier "X:X"'));
                    }
                );
                it(
                    'identifier already defined',
                    function ()
                    {
                        expect(
                            function ()
                            {
                                JScrewIt.debug.defineConstant('Array', '0');
                            }
                        ).toThrow(ReferenceError('Array already defined'));
                    }
                );
            }
        );
        describe(
            'JScrewIt.debug.replace can replace',
            function ()
            {
                it(
                    'a number',
                    function ()
                    {
                        var actual = eval(JScrewIt.debug.replace('""+2'));
                        expect(actual).toBe('2');
                    }
                );
                it(
                    'NaN',
                    function ()
                    {
                        var actual = eval(JScrewIt.debug.replace('""+NaN'));
                        expect(actual).toBe('NaN');
                    }
                );
            }
        );
        describe(
            'SyntaxError thrown for',
            function ()
            {
                function debugReplacer(input)
                {
                    var result = function () { JScrewIt.debug.replace(input); };
                    return result;
                }
                
                JScrewIt.debug.defineConstant('A', 'B');
                JScrewIt.debug.defineConstant('C', 'D');
                JScrewIt.debug.defineConstant('D', 'C');
                JScrewIt.debug.defineConstant('E', '?');
                
                it(
                    'Undefined literal',
                    function ()
                    {
                        expect(debugReplacer('A')).toThrow(
                            SyntaxError('Undefined literal B in the definition of A')
                        );
                    }
                );
                it(
                    'Circular reference',
                    function ()
                    {
                        expect(debugReplacer('C')).toThrow(
                            SyntaxError('Circular reference detected: C < D < C')
                        );
                    }
                );
                it(
                    'Unexpected character',
                    function ()
                    {
                        expect(debugReplacer('E')).toThrow(
                            SyntaxError('Unexpected character "?" in the definition of E')
                        );
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
    
    var TestSuite =
    {
        createOutput: createOutput,
        getAvailableFeatures: getAvailableFeatures,
        init: init,
        run: run
    };
    
    if (self)
    {
        self.TestSuite = TestSuite;
    }
    if (typeof module !== 'undefined')
    {
        module.exports = TestSuite;
    }
    
})(typeof self === 'undefined' ? null : self);
