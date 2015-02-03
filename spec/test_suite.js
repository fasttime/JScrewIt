/* global atob, btoa, escape, global, unescape */
/* jshint jasmine: true */

(function (global)
{
    'use strict';
    
    var Base64 =
    {
        // private property
        _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
        
        // public method for encoding
        encode:
        function (input)
        {
            var output = '';
            input += '';
            for (var i = 0; i < input.length;)
            {
                var chr1 = input.charCodeAt(i++);
                var enc1 = chr1 >> 2;
                
                var chr2 = input.charCodeAt(i++);
                var enc2 = (chr1 & 3) << 4 | chr2 >> 4;
                
                var enc3, enc4;
                if (isNaN(chr2))
                {
                    enc3 = enc4 = 64;
                }
                else
                {
                    var chr3 = input.charCodeAt(i++);
                    enc3 = (chr2 & 15) << 2 | chr3 >> 6;
                    if (isNaN(chr3))
                    {
                        enc4 = 64;
                    }
                    else
                    {
                        enc4 = chr3 & 63;
                    }
                }
                
                output +=
                    this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
            }
            
            return output;
        },
        
        // public method for decoding
        decode:
        function (input)
        {
            var output = '';
            input += '';
            for (var i = 0; i < input.length;)
            {
                var enc1 = this._keyStr.indexOf(input.charAt(i++));
                var enc2 = this._keyStr.indexOf(input.charAt(i++));
                var chr1 = (enc1 << 2) | (enc2 >> 4);
                output += String.fromCharCode(chr1);
                
                var pos3 = input.charAt(i++);
                var enc3 = this._keyStr.indexOf(pos3);
                if (!pos3 || enc3 === 64)
                {
                    break;
                }
                var chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                output += String.fromCharCode(chr2);
                
                var pos4 = input.charAt(i++);
                var enc4 = this._keyStr.indexOf(pos4);
                if (!pos4 || enc4 === 64)
                {
                    break;
                }
                var chr3 = ((enc3 & 3) << 6) | enc4;
                output += String.fromCharCode(chr3);
            }
            
            return output;
        },
    };
    
    function createOutput(compatibilities)
    {
        function appendLengths(name, input)
        {
            result += '\n' + padRight(name, 4);
            compatibilities.forEach(
                function (compatibility)
                {
                    var content;
                    try
                    {
                        content = JScrewIt.encode(input, false, compatibility).length;
                    }
                    catch (error)
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
        result += '\n    ' + repeat(' -------', compatibilities.length);
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
        appendLengths('`∟`', '∟');
        appendLengths('`♥`', '♥');
        appendLengths('A…Z', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        return result;
    }
    
    var encoderCache = { };
    
    function decodeEntry(entry)
    {
        var features = JScrewIt.debug.getEntryFeatures(entry);
        var key = features.join();
        var encoder = encoderCache[key];
        if (!encoder)
        {
            encoderCache[key] = encoder = JScrewIt.debug.createEncoder(features);
        }
        var output = encoder.replace(entry.definition);
        return output;
    }
    
    function describeEncodeMethodTest(methodName)
    {
        describe(
            'Encoder#' + methodName,
            function ()
            {
                var encoder = JScrewIt.debug.createEncoder();
                it(
                    'returns undefined when output length exceeds maxLength',
                    function ()
                    {
                        var actual = encoder[methodName]('', 4);
                        expect(actual).toBeUndefined();
                    }
                );
                it(
                    'returns a string when output length equals maxLength',
                    function ()
                    {
                        var actual = encoder[methodName]('', 5);
                        expect(typeof actual).toBe('string');
                    }
                );
                it(
                    'returns a string when maxLength is not specified',
                    function ()
                    {
                        var actual = encoder[methodName]('');
                        expect(typeof actual).toBe('string');
                    }
                );
            }
        );
    }
    
    function describeEncodeTest(compatibility)
    {
        var emuFeatures = getEmuFeatures(getSubFeatures(compatibility));
        if (emuFeatures)
        {
            describe(
                'encodes with ' + compatibility + ' compatibility',
                function ()
                {
                    var expression1 = 'return Math.log(2e18)^0';
                    it(
                        JSON.stringify(expression1) + ' (with wrapWithEval)',
                        function ()
                        {
                            var encoding = JScrewIt.encode(expression1, true, compatibility);
                            var actual = emuEval(emuFeatures, encoding);
                            expect(actual).toBe(42);
                        }
                    );
                    var expression2 = 'return decodeURI(encodeURI("♠♥♦♣"))';
                    it(
                        JSON.stringify(expression2) + ' (with wrapWithEval)',
                        function ()
                        {
                            var encoding = JScrewIt.encode(expression2, true, compatibility);
                            var actual = emuEval(emuFeatures, encoding);
                            expect(actual).toBe('♠♥♦♣');
                        }
                    );
                    var expression3 = 'Boolean true';
                    var encoder = JScrewIt.debug.createEncoder(compatibility);
                    var expectedEncoding3 = encoder.replace('"Boolean" + " " + true');
                    it(
                        JSON.stringify(expression3),
                        function ()
                        {
                            var encoding = JScrewIt.encode(expression3, false, compatibility);
                            var actual = emuEval(emuFeatures, encoding);
                            expect(actual).toBe(expression3);
                            expect(encoding).toBe(expectedEncoding3);
                        }
                    );
                    var expression4 = repeat('☺', 20);
                    it(
                        JSON.stringify(expression4),
                        function ()
                        {
                            var encoding = JScrewIt.encode(expression4, false, compatibility);
                            var actual = emuEval(emuFeatures, encoding);
                            expect(actual).toBe(expression4);
                        }
                    );
                }
            );
        }
    }
    
    function emuDo(emuFeatures, callback)
    {
        var result;
        var context = Object.create(null);
        try
        {
            emuFeatures.forEach(function (feature) { featureSet[feature].setUp.call(context); });
            result = callback();
        }
        finally
        {
            emuFeatures.forEach(function (feature) { featureSet[feature].tearDown.call(context); });
        }
        return result;
    }
    
    function emuEval(emuFeatures, string)
    {
        var result = emuDo(emuFeatures, function () { return eval(string); });
        return result;
    }
    
    function getSubFeatures(feature)
    {
        function branchIn(feature)
        {
            var featureInfo = JScrewIt.FEATURE_INFOS[feature];
            var includes = featureInfo.includes;
            includes.forEach(branchIn);
            if (featureInfo.check)
            {
                atomicSet[feature] = null;
            }
        }
        
        var atomicSet = Object.create(null);
        branchIn(feature);
        return Object.getOwnPropertyNames(atomicSet);
    }
    
    function getEmuFeatures(features)
    {
        if (features.every(function (feature) { return feature in featureSet; }))
        {
            return features.filter(function (feature) { return featureSet[feature]; });
        }
    }
    
    function init(arg)
    {
        JScrewIt = arg || global.JScrewIt;
        for (var feature in featureSet)
        {
            var condition = featureSet[feature].condition;
            if (condition && !condition())
            {
                delete featureSet[feature];
            }
        }
        JScrewIt.FEATURE_INFOS.AUTO.includes.forEach(
            function (feature)
            {
                featureSet[feature] = null;
            }
        );
    }
    
    function isExpected(expected)
    {
        var result =
            function ()
            {
                this.toBe(expected);
            };
        return result;
    }
    
    function listFeatures(available)
    {
        var callback = function (feature) { return !!featureSet[feature] !== available; };
        var result = Object.getOwnPropertyNames(featureSet).filter(callback).sort();
        return result;
    }
    
    function makeEmuFeatureArrayIterator(string, noOverwrite)
    {
        var result =
        {
            setUp: function ()
            {
                if (Array.prototype.entries)
                {
                    if (noOverwrite)
                    {
                        return;
                    }
                }
                else
                {
                    var arrayIterator = this.arrayIterator = { };
                    Object.defineProperty(
                        Array.prototype,
                        'entries',
                        {
                            configurable: true,
                            value: function () { return arrayIterator; }
                        }
                    );
                }
                var context = this;
                registerToStringAdapter(
                    this,
                    'Object',
                    'ArrayIterator',
                    function ()
                    {
                        if (
                            this === context.arrayIterator ||
                            /^\[object Array.?Iterator]$/.test(context.Object.toString.call(this)))
                        {
                            return string;
                        }
                    }
                );
            },
            tearDown: function ()
            {
                unregisterToStringAdapters(this, 'Object');
                if (this.arrayIterator)
                {
                    delete Array.prototype.entries;
                }
            }
        };
        return result;
    }
    
    function makeEmuFeatureFunctionSource(format, noOverwrite)
    {
        var result =
        {
            setUp: function ()
            {
                if (!this.Function || !noOverwrite)
                {
                    var context = this;
                    registerToStringAdapter(
                        this,
                        'Function',
                        'native',
                        function ()
                        {
                            var regExp =
                                /^\s*function ([\w\$]+)\(\)\s*\{\s*\[native code]\s*\}\s*$/;
                            var string = context.Function.toString.call(this);
                            var match = regExp.exec(string);
                            if (match)
                            {
                                var name = match[1];
                                var result = format.replace('?', name);
                                return result;
                            }
                        }
                    );
                }
            },
            tearDown: function ()
            {
                unregisterToStringAdapters(this, 'Function');
            }
        };
        return result;
    }
    
    function makeEmuFeatureWindow(string, noOverwrite)
    {
        var result =
        {
            setUp: function ()
            {
                if (global.self)
                {
                    if (noOverwrite)
                    {
                        return;
                    }
                }
                else
                {
                    global.self = { };
                }
                var valueOf = function () { return string; };
                Object.defineProperty(self, 'valueOf', { configurable: true, value: valueOf });
            },
            tearDown: function ()
            {
                if (global.self === global)
                {
                    delete self.valueOf;
                }
                else
                {
                    delete global.self;
                }
            }
        };
        return result;
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
        var result = repeat(' ', length - str.length) + str;
        return result;
    }
    
    function padRight(str, length)
    {
        str += '';
        var result = str + repeat(' ', length - str.length);
        return result;
    }
    
    function registerJSFuckMatcher()
    {
        beforeEach(
            function()
            {
                function toBeJSFuck(actual)
                {
                    var result = { };
                    var pass = result.pass = /^[!+()[\]]*$/.test(actual);
                    if (!pass)
                    {
                        result.message = 'Expected JSFuck code.';
                    }
                    return result;
                }
                
                if (typeof this.addMatchers === 'function')
                {
                    var matchersV1 = 
                    {
                        toBeJSFuck: function()
                        {
                            var expectation = toBeJSFuck(this.actual);
                            this.message = function () { return expectation.message; };
                            return expectation.pass;
                        }
                    };
                    this.addMatchers(matchersV1);
                }
                else if (typeof jasmine.addMatchers === 'function')
                {
                    var matchersV2 =
                    {
                        toBeJSFuck: function()
                        {
                            var result = { compare: toBeJSFuck };
                            return result;
                        }
                    };
                    jasmine.addMatchers(matchersV2);
                }
            }
        );
    }
    
    function registerToStringAdapter(context, typeName, key, adapter)
    {
        if (!context[typeName])
        {
            var prototype = global[typeName].prototype;
            var toString = prototype.toString;
            var adapters = Object.create(null);
            context[typeName] = { adapters: adapters, toString: toString };
            prototype.toString =
                function ()
                {
                    for (var key in adapters)
                    {
                        var string = adapters[key].call(this);
                        if (string !== void 0)
                        {
                            return string;
                        }
                    }
                    // When no arguments are provided to the call method, IE 9 will use the global
                    // object as this.
                    return toString.call(this === global.self ? void 0 : this);
                };
        }
        context[typeName].adapters[key] = adapter;
    }
    
    function repeat(string, count)
    {
        var result = Array(count + 1).join(string);
        return result;
    }
    
    function run()
    {
        describe(
            'JScrewIt',
            function()
            {
                it(
                    'is set up correctly',
                    function ()
                    {
                        var self = { };
                        JScrewIt.debug.setUp(self);
                        expect(self.JScrewIt).toBe(JScrewIt);
                        expect(self.JSFuck).toBe(JScrewIt);
                    }
                );
            }
        );
        describe(
            'Character definitions of',
            function ()
            {
                registerJSFuckMatcher();
                for (var charCode = 0; charCode < 256; ++charCode)
                {
                    testCharacter(charCode);
                }
                for (; charCode < 0x00010000; charCode <<= 1)
                {
                    testCharacter(charCode + 0x1f);
                }
            }
        );
        describe(
            'Complex definitions of',
            function ()
            {
                registerJSFuckMatcher();
                ['Boolean', 'Number', 'String'].forEach(
                    function (complex)
                    {
                        function verifyOutput(output, emuFeatures)
                        {
                            expect(output).toBeJSFuck();
                            var actual = emuEval(emuFeatures || [], output);
                            expect(actual).toBe(complex);
                        }
                        
                        var desc = JSON.stringify(complex);
                        describe(
                            desc,
                            function ()
                            {
                                var entries = JScrewIt.debug.getComplexEntries(complex);
                                entries.forEach(
                                    function (entry, index)
                                    {
                                        var features = JScrewIt.debug.getEntryFeatures(entry);
                                        var emuFeatures = getEmuFeatures(features);
                                        if (emuFeatures)
                                        {
                                            it(
                                                '(definition ' + index + ')',
                                                function ()
                                                {
                                                    var output = decodeEntry(entry);
                                                    verifyOutput(output, emuFeatures);
                                                }
                                            );
                                        }
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
        describe(
            'Constants definitions of',
            function ()
            {
                registerJSFuckMatcher();
                testConstant('Array', isExpected(Array));
                testConstant('Boolean', isExpected(Boolean));
                testConstant('Date', isExpected(Date));
                testConstant('Function', isExpected(Function));
                testConstant('Number', isExpected(Number));
                testConstant('RegExp', isExpected(RegExp));
                testConstant('String', isExpected(String));
                
                testConstant('atob', function () { this.toBe(atob); });
                testConstant('btoa', function () { this.toBe(btoa); });
                testConstant('escape', isExpected(escape));
                testConstant('self', function () { this.toBe(global.self); });
                testConstant('unescape', isExpected(unescape));
                
                testConstant(
                    'ANY_FUNCTION',
                    function ()
                    {
                        this.toMatch(/^\s*function [\w\$]+\(\)\s*\{\s*\[native code]\s*\}\s*$/);
                    }
                );
                testConstant(
                    'ARRAY_ITERATOR',
                    function ()
                    {
                        var expected =
                            /^\[object Array ?Iterator]$/.test(
                                Object.prototype.toString.call(this.actual)
                            ) ?
                            this.actual : [].entries();
                        this.toBe(expected);
                    }
                );
                testConstant('FILL', function () { this.toBe(Array.prototype.fill); });
                testConstant('FILTER', function () { this.toBe(Array.prototype.filter); });
                testConstant(
                    'PLAIN_OBJECT',
                    function ()
                    {
                        var expected =
                            Object.prototype.toString.call(this.actual) === '[object Object]' ?
                            this.actual : { };
                        this.toBe(expected);
                    }
                );
            }
        );
        describe(
            'JScrewIt.encode',
            function ()
            {
                describeEncodeTest('DEFAULT');
                describeEncodeTest('COMPACT');
                describeEncodeTest('NO_IE');
                describeEncodeTest('AUTO');
                it(
                    'correctly encodes an empty string',
                    function ()
                    {
                        var encoding = JScrewIt.encode('');
                        var actual = eval(encoding);
                        expect(actual).toBe('');
                    }
                );
                it(
                    'throws a ReferenceError for incompatible features',
                    function ()
                    {
                        var fn =
                            function () { JScrewIt.encode('', false, ['NO_IE_SRC', 'IE_SRC']); };
                        expect(fn).toThrow(ReferenceError('Incompatible features'));
                    }
                );
                it(
                    '',
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
                        var compatible = JScrewIt.areFeaturesCompatible(['V8_SRC', 'IE_SRC']);
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
                            'V8_SRC',
                            function ()
                            {
                                var info = JScrewIt.FEATURE_INFOS.V8_SRC;
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
            'JScrewIt.debug.defineConstant',
            function ()
            {
                it(
                    'fails for invalid identifier',
                    function ()
                    {
                        expect(
                            function ()
                            {
                                JScrewIt.debug.defineConstant(null, 'X:X', '0');
                            }
                        ).toThrow(SyntaxError('Invalid identifier "X:X"'));
                    }
                );
            }
        );
        describe(
            'JScrewIt.debug.hasOuterPlus is',
            function ()
            {
                it(
                    'true for leading plus',
                    function ()
                    {
                        var solution = Object('+[]');
                        expect(JScrewIt.debug.hasOuterPlus(solution)).toBe(true);
                        expect(solution.outerPlus).toBe(true);
                    }
                );
                it(
                    'true for middle plus',
                    function ()
                    {
                        var solution = Object('[]+[]');
                        expect(JScrewIt.debug.hasOuterPlus(solution)).toBe(true);
                        expect(solution.outerPlus).toBe(true);
                    }
                );
                it(
                    'false for inner plus',
                    function ()
                    {
                        var solution = Object('(+[])');
                        expect(JScrewIt.debug.hasOuterPlus(solution)).toBe(false);
                        expect(solution.outerPlus).toBe(false);
                    }
                );
                it(
                    'false for leading !+',
                    function ()
                    {
                        var solution = Object('!+[]');
                        expect(JScrewIt.debug.hasOuterPlus(solution)).toBe(false);
                        expect(solution.outerPlus).toBe(false);
                    }
                );
                it(
                    'cached',
                    function ()
                    {
                        var solution = { outerPlus: true };
                        expect(JScrewIt.debug.hasOuterPlus(solution)).toBe(true);
                    }
                );
            }
        );
        describe(
            'ScrewBuffer',
            function ()
            {
                function test(buffer, expectedString)
                {
                    expect(buffer.length).toBe(expectedString.length);
                    expect(buffer + '').toBe(expectedString);
                }
                
                var solutionA = Object('[![]+[]][+[]]');
                solutionA.level = 1;
                var solution0 = Object('+[]');
                solution0.level = -1;
                var solutionFalse = Object('![]');
                solutionFalse.level = -1;
                describe(
                    'with weak bound',
                    function ()
                    {
                        var buffer = JScrewIt.debug.createScrewBuffer(false, 4);
                        it(
                            'encodes an empty string',
                            function ()
                            {
                                test(buffer, '[]+[]');
                            }
                        );
                        it(
                            'encodes a single character',
                            function ()
                            {
                                expect(buffer.append(solutionA)).toBe(true);
                                test(buffer, '[![]+[]][+[]]');
                            }
                        );
                        it(
                            'encodes a string with more elements than the first group threshold',
                            function ()
                            {
                                expect(buffer.append(solution0)).toBe(true);
                                expect(buffer.append(solution0)).toBe(true);
                                expect(buffer.append(solution0)).toBe(true);
                                test(buffer, '[![]+[]][+[]]+(+[])+(+[])+(+[])');
                            }
                        );
                        it(
                            'encodes a string with more elements than the second group threshold',
                            function ()
                            {
                                expect(buffer.append(solutionFalse)).toBe(true);
                                expect(buffer.append(solutionFalse)).toBe(true);
                                test(buffer, '[![]+[]][+[]]+(+[])+(+[])+(+[]+[![]]+![])');
                            }
                        );
                        it(
                            'encodes a string with the largest possible number of elements',
                            function ()
                            {
                                expect(buffer.append(solutionFalse)).toBe(true);
                                test(buffer, '[![]+[]][+[]]+(+[])+(+[])+(+[]+[![]]+(![]+[![]]))');
                            }
                        );
                        it(
                            'does not encode a string with too many elements',
                            function ()
                            {
                                expect(buffer.append(solutionFalse)).toBe(false);
                                test(buffer, '[![]+[]][+[]]+(+[])+(+[])+(+[]+[![]]+(![]+[![]]))');
                            }
                        );
                    }
                );
                describe(
                    'with strong bound',
                    function ()
                    {
                        var buffer = JScrewIt.debug.createScrewBuffer(true, 4);
                        it(
                            'encodes an empty string',
                            function ()
                            {
                                test(buffer, '([]+[])');
                            }
                        );
                        it(
                            'encodes a single character',
                            function ()
                            {
                                expect(buffer.append(solutionA)).toBe(true);
                                test(buffer, '[![]+[]][+[]]');
                            }
                        );
                        it(
                            'encodes a string with more elements than the first group threshold',
                            function ()
                            {
                                expect(buffer.append(solution0)).toBe(true);
                                expect(buffer.append(solution0)).toBe(true);
                                expect(buffer.append(solution0)).toBe(true);
                                test(buffer, '([![]+[]][+[]]+(+[])+(+[])+(+[]))');
                            }
                        );
                        it(
                            'encodes a string with more elements than the second group threshold',
                            function ()
                            {
                                expect(buffer.append(solutionFalse)).toBe(true);
                                expect(buffer.append(solutionFalse)).toBe(true);
                                test(buffer, '([![]+[]][+[]]+(+[])+(+[])+(+[]+[![]]+![]))');
                            }
                        );
                        it(
                            'encodes a string with the largest possible number of elements',
                            function ()
                            {
                                expect(buffer.append(solutionFalse)).toBe(true);
                                test(buffer, '([![]+[]][+[]]+(+[])+(+[])+(+[]+[![]]+(![]+[![]])))');
                            }
                        );
                        it(
                            'does not encode a string with too many elements',
                            function ()
                            {
                                expect(buffer.append(solutionFalse)).toBe(false);
                                test(buffer, '([![]+[]][+[]]+(+[])+(+[])+(+[]+[![]]+(![]+[![]])))');
                            }
                        );
                    }
                );
            }
        );
        describe(
            'Encoder#replace can replace',
            function ()
            {
                var encoder = JScrewIt.debug.createEncoder();
                it(
                    'a number',
                    function ()
                    {
                        var actual = eval(encoder.replace('"" + 2'));
                        expect(actual).toBe('2');
                    }
                );
                it(
                    'NaN',
                    function ()
                    {
                        var actual = eval(encoder.replace('"" + NaN'));
                        expect(actual).toBe('NaN');
                    }
                );
            }
        );
        describe(
            'Encoder#encode',
            function ()
            {
                it(
                    'throws an Error with message "Encoding failed" for too complex input',
                    function ()
                    {
                        var encoder = JScrewIt.debug.createEncoder();
                        encoder.replaceNumberArray = encoder.encodePlain = function () { };
                        expect(function () { encoder.encode('12345'); }).toThrow(
                            new Error('Encoding failed')
                        );
                    }
                );
            }
        );
        describe(
            'Encoder#replaceNumberArray',
            function ()
            {
                it(
                    'returns undefined for too large array',
                    function ()
                    {
                        var encoder = JScrewIt.debug.createEncoder();
                        encoder.replaceString = encoder.encodePlain = function () { };
                        expect(encoder.replaceNumberArray([])).toBeUndefined();
                    }
                );
            }
        );
        describe(
            'Encoder#resolve throws a SyntaxError for',
            function ()
            {
                var encoder = JScrewIt.debug.createEncoder();
                encoder.replaceString = function () { };
                
                function debugReplacer(input)
                {
                    var result = function () { encoder.resolve(input); };
                    return result;
                }
                
                JScrewIt.debug.defineConstant(encoder, 'A', 'B');
                JScrewIt.debug.defineConstant(encoder, 'C', 'D');
                JScrewIt.debug.defineConstant(encoder, 'D', 'C');
                JScrewIt.debug.defineConstant(encoder, 'E', '?');
                JScrewIt.debug.defineConstant(encoder, 'F', '"\\?"');
                JScrewIt.debug.defineConstant(encoder, 'G', '"too complex"');
                
                it(
                    'Circular reference',
                    function ()
                    {
                        expect(debugReplacer('C')).toThrow(
                            SyntaxError('Circular reference detected: C < D < C')
                        );
                    }
                );
                describe(
                    'Undefined literal',
                    function ()
                    {
                        it(
                            'in a definition',
                            function ()
                            {
                                expect(debugReplacer('A')).toThrow(
                                    SyntaxError('Undefined literal B in the definition of A')
                                );
                            }
                        );
                        it(
                            'inline',
                            function ()
                            {
                                expect(debugReplacer('valueOf')).toThrow(
                                    SyntaxError('Undefined literal valueOf')
                                );
                            }
                        );
                    }
                );
                describe(
                    'Unexpected character',
                    function ()
                    {
                        it(
                            'in a definition',
                            function ()
                            {
                                expect(debugReplacer('E')).toThrow(
                                    SyntaxError('Unexpected character "?" in the definition of E')
                                );
                            }
                        );
                        it(
                            'inline',
                            function ()
                            {
                                expect(debugReplacer('?')).toThrow(
                                    SyntaxError('Unexpected character "?"')
                                );
                            }
                        );
                    }
                );
                describe(
                    'Illegal string',
                    function ()
                    {
                        it(
                            'in a definition',
                            function ()
                            {
                                expect(debugReplacer('F')).toThrow(
                                    SyntaxError('Illegal string "\\?" in the definition of F')
                                );
                            }
                        );
                        it(
                            'inline',
                            function ()
                            {
                                expect(debugReplacer('"\\?"')).toThrow(
                                    SyntaxError('Illegal string "\\?"')
                                );
                            }
                        );
                    }
                );
                describe(
                    'String too complex',
                    function ()
                    {
                        it(
                            'in a definition',
                            function ()
                            {
                                expect(debugReplacer('G')).toThrow(
                                    SyntaxError('String too complex in the definition of G')
                                );
                            }
                        );
                        it(
                            'inline',
                            function ()
                            {
                                expect(debugReplacer('"too complex"')).toThrow(
                                    SyntaxError('String too complex')
                                );
                            }
                        );
                    }
                );
                it(
                    'Illegal string',
                    function ()
                    {
                        expect(debugReplacer('F')).toThrow(
                            SyntaxError('Illegal string "\\?" in the definition of F')
                        );
                    }
                );
            }
        );
        describeEncodeMethodTest('encodePlain');
        describeEncodeMethodTest('encodeSimple');
        describe(
            'Encoding',
            function ()
            {
                var encoder = JScrewIt.debug.createEncoder();
                var input = 'Lorem ipsum dolor sit amet';
                it(
                    'plain is ok',
                    function ()
                    {
                        var output = encoder.encodePlain(input);
                        expect(eval(output)).toBe(input);
                    }
                );
                it(
                    'by dictionary is ok',
                    function ()
                    {
                        var output = encoder.encodeByDict(input);
                        expect(eval(output)).toBe(input);
                    }
                );
                it(
                    'by long character code list is ok',
                    function ()
                    {
                        var output = encoder.encodeByCharCodes(input, true);
                        expect(eval(output)).toBe(input);
                    }
                );
                it(
                    'by short character code list is ok',
                    function ()
                    {
                        var output = encoder.encodeByCharCodes(input, false);
                        expect(eval(output)).toBe(input);
                    }
                );
            }
        );
    }
    
    function testCharacter(charCode)
    {
        var char = String.fromCharCode(charCode);
        var desc =
            charCode >= 0x7f && charCode <= 0xa0 || charCode === 0xad ?
            '"\\u00' + charCode.toString(16) + '"' : JSON.stringify(char);
        describe(
            desc,
            function ()
            {
                function verifyOutput(output, emuFeatures)
                {
                    expect(output).toBeJSFuck();
                    var actual = emuEval(emuFeatures || [], output) + '';
                    expect(actual).toBe(character);
                }
                
                var character = char;
                var entries = JScrewIt.debug.getCharacterEntries(character);
                if (entries)
                {
                    var defaultEntryFound = false;
                    entries.forEach(
                        function (entry, index)
                        {
                            var features = JScrewIt.debug.getEntryFeatures(entry);
                            var usingDefaultFeature = !features.length;
                            defaultEntryFound |= usingDefaultFeature;
                            var emuFeatures = getEmuFeatures(features);
                            if (emuFeatures)
                            {
                                it(
                                    '(definition ' + index + ')',
                                    function ()
                                    {
                                        var output = decodeEntry(entry);
                                        verifyOutput(output, emuFeatures);
                                    }
                                );
                            }
                        }
                    );
                    if (!defaultEntryFound)
                    {
                        it(
                            '(default)',
                            function ()
                            {
                                var output = JScrewIt.encode(character, false);
                                verifyOutput(output);
                            }
                        );
                    }
                }
                else
                {
                    it(
                        '(default)',
                        function ()
                        {
                            var output = JScrewIt.encode(character, false);
                            verifyOutput(output);
                        }
                    );
                    if ('ATOB' in featureSet)
                    {
                        it(
                            '(atob)',
                            function ()
                            {
                                var output = JScrewIt.encode(character, false, 'ATOB');
                                verifyOutput(output, featureSet.ATOB && ['ATOB']);
                                expect(output.length).not.toBeGreaterThan(
                                    JScrewIt.encode(character, false).length
                                );
                            }
                        );
                    }
                }
            }
        );
    }
    
    function testConstant(constant, validator)
    {
        describe(
            constant,
            function ()
            {
                var entries = JScrewIt.debug.getConstantEntries(constant);
                entries.forEach(
                    function (entry, index)
                    {
                        var features = JScrewIt.debug.getEntryFeatures(entry);
                        var emuFeatures = getEmuFeatures(features);
                        if (emuFeatures)
                        {
                            it(
                                '(definition ' + index + ')',
                                function ()
                                {
                                    var output = decodeEntry(entry);
                                    expect(output).toBeJSFuck();
                                    emuDo(
                                        emuFeatures,
                                        function ()
                                        {
                                            var actual = eval(output);
                                            validator.call(expect(actual));
                                        }
                                    );
                                }
                            );
                        }
                    }
                );
            }
        );
    }
    
    function unregisterToStringAdapters(context, typeName)
    {
        global[typeName].prototype.toString = context[typeName].toString;
    }
    
    var JScrewIt;
    var featureSet =
    {
        ATOB:
        {
            setUp: function ()
            {
                global.atob =
                    function (value)
                    {
                        return Base64.decode(value);
                    };
                global.btoa =
                    function (value)
                    {
                        return Base64.encode(value);
                    };
            },
            tearDown: function ()
            {
                delete global.atob;
                delete global.btoa;
            }
        },
        DOMWINDOW: makeEmuFeatureWindow('[object DOMWindow]'),
        ENTRIES: makeEmuFeatureArrayIterator('[object Array Iterator]', true),
        FF_SAFARI_SRC: makeEmuFeatureFunctionSource('function ?() {\n    [native code]\n}'),
        FILL:
        {
            setUp: function ()
            {
                var fill = Function();
                fill.toString =
                    function ()
                    {
                        return (Array.prototype.join + '').replace(/\bjoin\b/, 'fill');
                    };
                Object.defineProperty(Array.prototype, 'fill', { configurable: true, value: fill });
            },
            tearDown: function ()
            {
                delete Array.prototype.fill;
            }
        },
        GMT:
        {
            setUp: function ()
            {
                this.Date = Date;
                global.Date = function () { return 'Xxx Xxx 00 0000 00:00:00 GMT+0000 (XXX)'; };
            },
            tearDown: function ()
            {
                global.Date = this.Date;
            }
        },
        IE_SRC: makeEmuFeatureFunctionSource('\nfunction ?() {\n    [native code]\n}\n'),
        LINK_DOUBLE_QUOTE_ESC:
        {
            setUp: function ()
            {
                var prototype = String.prototype;
                var link = this.link = prototype.link;
                prototype.link =
                    function (href)
                    {
                        arguments[0] = (href + '').replace(/"/g, '&quot;');
                        return link.apply(this, arguments);
                    };
            },
            tearDown: function ()
            {
                String.prototype.link = this.link;
            }
        },
        NAME:
        {
            setUp: function ()
            {
                var get =
                    function ()
                    {
                        var result = /^\s*function ([\w\$]+)/.exec(this)[1];
                        return result;
                    };
                Object.defineProperty(Function.prototype, 'name', { configurable: true, get: get });
            },
            tearDown: function ()
            {
                delete Function.prototype.name;
            }
        },
        NO_IE_SRC: makeEmuFeatureFunctionSource('function ?() { [native code] }', true),
        NO_SAFARI_ARRAY_ITERATOR: makeEmuFeatureArrayIterator('[object Array Iterator]'),
        NO_SAFARI_LF:
        {
            setUp: function ()
            {
                var context = this;
                registerToStringAdapter(
                    this,
                    'Function',
                    'anonymous',
                    function ()
                    {
                        var string = context.Function.toString.call(this);
                        if (string === 'function anonymous() { \n}')
                        {
                            return 'function anonymous() {\n\n}';
                        }
                    }
                );
            },
            tearDown: function ()
            {
                unregisterToStringAdapters(this, 'Function');
            }
        },
        QUOTE:
        {
            setUp: function ()
            {
                if (!String.prototype.quote)
                {
                    this.quoteEmulation = true;
                    var quote = function () { return JSON.stringify(this); };
                    Object.defineProperty(
                        String.prototype,
                        'quote',
                        { configurable: true, value: quote }
                    );
                }
            },
            tearDown: function ()
            {
                if (this.quoteEmulation)
                {
                    delete String.prototype.quote;
                }
            }
        },
        SAFARI_ARRAY_ITERATOR: makeEmuFeatureArrayIterator('[object ArrayIterator]'),
        SELF: makeEmuFeatureWindow('[object Window]', true),
        UNDEFINED:
        {
            setUp: function ()
            {
                registerToStringAdapter(
                    this,
                    'Object',
                    'Undefined',
                    function ()
                    {
                        if (this === void 0)
                        {
                            return '[object Undefined]';
                        }
                    }
                );
            },
            tearDown: function ()
            {
                unregisterToStringAdapters(this, 'Object');
            }
        },
        V8_SRC: makeEmuFeatureFunctionSource('function ?() { [native code] }'),
        WINDOW: makeEmuFeatureWindow('[object Window]')
    };
    
    var TestSuite =
    {
        createOutput: createOutput,
        init: init,
        listFeatures: listFeatures,
        run: run
    };
    
    if (global.self)
    {
        self.TestSuite = TestSuite;
    }
    if (typeof module !== 'undefined')
    {
        module.exports = TestSuite;
    }
    
})(typeof self === 'undefined' ? global : self);
