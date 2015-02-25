/* global atob, btoa, expect, emuDo, emuEval, EMU_FEATURES, global, module, self, sinon */
/* jshint mocha: true, nonstandard: true */

(function (global)
{
    'use strict';
    
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
                        expect(actual).toBeString();
                    }
                );
                it(
                    'returns a string when maxLength is not specified',
                    function ()
                    {
                        var actual = encoder[methodName]('');
                        expect(actual).toBeString();
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
    
    function describeTests()
    {
        describe(
            'JScrewIt',
            function ()
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
                testConstant('self', function () { this.toBe(self); });
                testConstant('unescape', isExpected(unescape));
                
                testConstant('ANY_FUNCTION', function () { this.toBeNativeFunction(); });
                testConstant('ARRAY_ITERATOR', function () { this.toBeArrayIterator(); });
                testConstant('FILL', function () { this.toBe(Array.prototype.fill); });
                testConstant('FILTER', function () { this.toBe(Array.prototype.filter); });
                testConstant('PLAIN_OBJECT', function () { this.toBePlainObject(); });
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
            }
        );
        describe(
            'JScrewIt.areFeaturesCompatible',
            function ()
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
            function ()
            {
                var FEATURE_INFOS = JScrewIt.FEATURE_INFOS;
                
                describe(
                    'contains correct information for the feature',
                    function ()
                    {
                        it(
                            'DEFAULT',
                            function ()
                            {
                                var info = FEATURE_INFOS.DEFAULT;
                                expect(info.available).toBe(true);
                                expect(info.includes.length).toBe(0);
                                expect(info.excludes.length).toBe(0);
                            }
                        );
                        it(
                            'AUTO',
                            function ()
                            {
                                var info = FEATURE_INFOS.AUTO;
                                expect(info.available).toBe(true);
                                expect(info.includes.length).toBeGreaterThan(0);
                                expect(info.excludes.length).toBe(0);
                            }
                        );
                        it(
                            'V8_SRC',
                            function ()
                            {
                                var info = FEATURE_INFOS.V8_SRC;
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
                        var features = Object.keys(FEATURE_INFOS).sort();
                        features.forEach(
                            function (feature)
                            {
                                it(
                                    feature,
                                    function ()
                                    {
                                        var info = FEATURE_INFOS[feature];
                                        var name = info.name;
                                        expect(name).toBeString();
                                        expect(info).toBe(FEATURE_INFOS[name]);
                                        expect(info.available).toBe(
                                            JScrewIt.areFeaturesAvailable(feature)
                                        );
                                        expect(info.includes).toBeArray();
                                        var excludes = info.excludes;
                                        expect(excludes).toBeArray();
                                        excludes.forEach(
                                            function (exclude)
                                            {
                                                var info = FEATURE_INFOS[exclude];
                                                expect(info.excludes).toContain(feature);
                                            }
                                        );
                                        expect(info.description).toBeString();
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
                    'does not call encodeByDict for insufficiently long input',
                    function ()
                    {
                        var input = repeat('0', 2);
                        var encoder = JScrewIt.debug.createEncoder();
                        var encodeByDict = sinon.stub(encoder, 'encodeByDict');
                        sinon.stub(encoder, 'encodeSimple').returns('ABC');
                        var output = encoder.encode(input);
                        
                        sinon.assert.notCalled(encodeByDict);
                        expect(output).toBe('ABC');
                    }
                );
                it(
                    'calls encodeByDict without radix for sufficiently long input',
                    function ()
                    {
                        var input = repeat('0', 3);
                        var encoder = JScrewIt.debug.createEncoder();
                        var encodeByDict = sinon.stub(encoder, 'encodeByDict');
                        encodeByDict.returns('AB');
                        sinon.stub(encoder, 'encodeSimple');
                        var output = encoder.encode(input);
                        
                        sinon.assert.calledOnce(encodeByDict);
                        sinon.assert.calledWith(encodeByDict, input, undefined);
                        expect(output).toBe('AB');
                    }
                );
                it(
                    'calls encodeByDict with and without radix for sufficiently long input',
                    function ()
                    {
                        var input = repeat('0', 185);
                        
                        function test(radixOutput, expectedOutput)
                        {
                            var encoder = JScrewIt.debug.createEncoder();
                            var encodeByDict = sinon.stub(encoder, 'encodeByDict');
                            encodeByDict.withArgs(input, undefined).returns('AB');
                            encodeByDict.withArgs(input, 4).returns(radixOutput);
                            sinon.stub(encoder, 'encodeSimple');
                            var output = encoder.encode(input);
                            
                            sinon.assert.calledTwice(encodeByDict);
                            sinon.assert.calledWith(encodeByDict, input, undefined);
                            sinon.assert.calledWith(encodeByDict, input, 4);
                            expect(output).toBe(expectedOutput);
                        }
                        
                        test('A', 'A');
                        test('ABC', 'AB');
                    }
                );
                it(
                    'throws an Error with message "Encoding failed" for too complex input',
                    function ()
                    {
                        var encoder = JScrewIt.debug.createEncoder();
                        sinon.stub(encoder, 'encodePlain');
                        sinon.stub(encoder, 'replaceNumberArray');
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
                        sinon.stub(encoder, 'encodePlain');
                        sinon.stub(encoder, 'replaceString');
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
                sinon.stub(encoder, 'replaceString');
                
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
                    'by dictionary with radix is ok',
                    function ()
                    {
                        var output = encoder.encodeByDict(input, 7);
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
                it(
                    'by character code list with radix is ok',
                    function ()
                    {
                        var output = encoder.encodeByCharCodes(input, undefined, 7);
                        expect(eval(output)).toBe(input);
                    }
                );
            }
        );
    }
    
    function getEmuFeatures(features)
    {
        if (features.every(function (feature) { return feature in featureSet; }))
        {
            return features.filter(function (feature) { return featureSet[feature]; });
        }
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
        var result = Object.keys(atomicSet);
        return result;
    }
    
    function init(arg)
    {
        JScrewIt = arg || global.JScrewIt;
        featureSet = Object.create(null);
        EMU_FEATURES.forEach(
            function (feature) { featureSet[feature] = true; }
        );
        JScrewIt.FEATURE_INFOS.AUTO.includes.forEach(
            function (feature) { featureSet[feature] = false; }
        );
        describeTests();
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
        var result = Object.keys(featureSet).filter(callback).sort();
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
    
    function repeat(string, count)
    {
        var result = Array(count + 1).join(string);
        return result;
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
    
    var encoderCache = { };
    var featureSet;
    var JScrewIt;
    
    var TestSuite =
    {
        createOutput: createOutput,
        init: init,
        listFeatures: listFeatures
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
