/* global atob, btoa, expect, emuDo, emuEval, EMU_FEATURES, global, module, self */
/* jshint mocha: true, nonstandard: true */

(function (global)
{
    'use strict';
    
    function createAntiRadix4TestString(variety, length)
    {
        // The first 480 numbers between 0 and 65535 ordered by their canonical JSFuck length when
        // printed in base 4 in descending order.
        var CHAR_CODES =
        [
            65535, 65534, 64511, 65279, 65531, 49151, 65471, 61439, 65519, 63487, 57343, 65503,
            65023, 32767, 65533, 65527, 65407, 64510, 65515, 64507, 64495, 45055, 64447, 61438,
            65215, 61183, 64255, 65518, 65263, 65275, 65470, 65278, 65467, 61375, 65530, 48127,
            65455, 49147, 49135, 49087, 61423, 61435, 60415, 49150, 48895, 64767, 53247, 65532,
            65523, 65343, 65487, 62463, 32511, 63231, 65439, 65406, 65403, 47103, 49023, 65391,
            49119, 40959, 49143, 61407, 49149, 65463, 64959, 28671, 63999, 31743, 65529, 65469,
            65277, 65526, 65271, 56319, 61437, 48639, 65247, 63486, 61431, 57087, 32703, 65007,
            64383, 63483, 59391, 32751, 61311, 57279, 65019, 60927, 32763, 32766, 63471, 64479,
            65022, 64503, 65499, 64509, 65502, 63423, 65511, 65151, 57327, 57339, 57342, 65517,
            47871, 64239, 49131, 64251, 64254, 49134, 65451, 61359, 48891, 60159, 48894, 49146,
            65454, 48123, 60414, 65214, 48126, 65211, 61119, 44799, 61434, 65199, 64431, 48063,
            64443, 64446, 60399, 49071, 60351, 65466, 61422, 61374, 64491, 64494, 61371, 44031,
            64506, 49083, 49086, 60411, 48111, 65274, 61182, 64191, 61419, 65514, 45054, 61179,
            45051, 45039, 48879, 48831, 44991, 61167, 65262, 65259, 48383, 63743, 65507, 61436,
            65483, 49148, 65276, 48959, 65342, 61427, 60671, 65267, 64463, 64766, 65339, 65459,
            65516, 64763, 36863, 61247, 65327, 49103, 64499, 52223, 62462, 52991, 64508, 65468,
            46079, 53183, 62459, 65522, 53231, 62447, 64319, 61391, 65231, 65486, 62399, 64751,
            53243, 64703, 53246, 65528, 65087, 65423, 49139, 58367, 62207, 16383, 65375, 57311,
            32765, 32759, 57215, 32735, 32639, 56831, 32255, 64895, 57341, 30719, 62975, 57335,
            64991, 65399, 65405, 24575, 63485, 65015, 63479, 65021, 65525, 65495, 65501, 63455,
            63359, 55295, 40958, 65246, 63227, 49133, 65243, 32495, 63467, 32507, 32510, 63215,
            63470, 57071, 49142, 61430, 57083, 57086, 40955, 49145, 48887, 32687, 32699, 32702,
            61343, 61406, 64367, 65513, 64379, 64382, 48125, 40703, 47615, 48893, 65213, 48638,
            48575, 63167, 32747, 57263, 65207, 32750, 63422, 65453, 57275, 64415, 61310, 57278,
            28415, 48119, 28607, 64439, 28655, 64445, 28667, 61403, 48635, 61307, 32762, 28670,
            63407, 49007, 65183, 63935, 48095, 61295, 64475, 64478, 40943, 65402, 64487, 48767,
            63983, 64493, 47102, 63995, 63998, 64502, 65447, 64505, 47099, 49019, 47087, 31487,
            49022, 65510, 57323, 60863, 31679, 61181, 31727, 65150, 57326, 31739, 65147, 65390,
            31742, 40895, 45053, 49055, 45047, 47039, 61373, 45023, 61175, 57338, 65135, 65387,
            64127, 48623, 56063, 56255, 63482, 44927, 56303, 39935, 47999, 65465, 49079, 59135,
            44543, 59327, 59375, 61151, 61421, 63419, 49085, 65273, 59387, 59390, 65438, 48863,
            59903, 65270, 56315, 56318, 60287, 65498, 65435, 60383, 64943, 32447, 64955, 64958,
            63230, 60407, 61055, 49115, 60413, 65261, 49118, 61433, 65003, 65006, 64223, 57023,
            27647, 65018, 65255, 46847, 61367, 61415, 60926, 64247, 43007, 49127, 60923, 64253,
            65462, 60911, 44795, 65258, 65404, 65020, 65524, 65011, 65521, 49067, 61951, 60410,
            49070, 64975, 43775, 49082, 61103, 60398, 64235, 60395, 60350, 60347, 43967, 61418,
            60335, 44015, 44027, 49130, 44030, 61115, 63439, 65359, 60158, 60155, 60143, 65341,
            64831, 60095, 47867, 65500, 20479, 65335, 65491, 61118, 63475, 51199, 64765, 64238,
            64759, 47870, 65485, 64735, 62461, 63484, 65479, 52735, 61163, 44735, 29695, 44783,
            63295, 65395, 44798, 64639, 48122, 48890, 64250, 44975, 61166, 44987, 53119, 44990,
        ];
        
        var str = String.fromCharCode.apply(null, CHAR_CODES.slice(0, variety));
        str = repeatToFit(str, length);
        return str;
    }
    
    function createDictTestString(variety, length)
    {
        var str = '';
        for (var i = 0; i < variety; ++i)
        {
            str += String.fromCharCode(0xffff - i);
        }
        str = repeatToFit(str, length);
        return str;
    }
    
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
                        content = JScrewIt.encode(input, { features: compatibility }).length;
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
                        JSON.stringify(expression1) + ' (with wrapWith: "call")',
                        function ()
                        {
                            var options = { features: compatibility, wrapWith: 'call' };
                            var output = JScrewIt.encode(expression1, options);
                            var actual = emuEval(emuFeatures, output);
                            expect(actual).toBe(42);
                        }
                    );
                    var expression2 = 'decodeURI(encodeURI("♠♥♦♣"))';
                    it(
                        JSON.stringify(expression2) + ' (with wrapWith: "eval")',
                        function ()
                        {
                            var options = { features: compatibility, wrapWith: 'eval' };
                            var output = JScrewIt.encode(expression2, options);
                            var actual = emuEval(emuFeatures, output);
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
                            var options = { features: compatibility };
                            var output = JScrewIt.encode(expression3, options);
                            var actual = emuEval(emuFeatures, output);
                            expect(actual).toBe(expression3);
                            expect(output).toBe(expectedEncoding3);
                        }
                    );
                    var expression4 = repeat('☺', 20);
                    it(
                        JSON.stringify(expression4) + ' (with wrapWith: "none")',
                        function ()
                        {
                            var options = { features: compatibility, wrapWith: 'none' };
                            var output = JScrewIt.encode(expression4, options);
                            var actual = emuEval(emuFeatures, output);
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
                it(
                    'has no enumerable properties',
                    function ()
                    {
                        expect(JScrewIt).toEqual({ });
                    }
                );
                it(
                    'has no enumerable debug properties',
                    function ()
                    {
                        expect(JScrewIt.debug).toEqual({ });
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
                    'encodes an empty string',
                    function ()
                    {
                        var output = JScrewIt.encode('');
                        var actual = eval(output);
                        expect(actual).toBe('');
                    }
                );
                it(
                    'throws a ReferenceError for incompatible features',
                    function ()
                    {
                        var fn =
                            function ()
                            {
                                var options = { features: ['NO_IE_SRC', 'IE_SRC'] };
                                JScrewIt.encode('', options);
                            };
                        expect(fn).toThrow(ReferenceError('Incompatible features'));
                    }
                );
                it(
                    'throws an error for invalid wrapWith',
                    function ()
                    {
                        var fn =
                            function ()
                            {
                                var options = { wrapWith: null };
                                JScrewIt.encode('', options);
                            };
                        expect(fn).toThrow(Error('Invalid value for option wrapWith'));

                    }
                );
                it(
                    'still supports legacy option parameters',
                    function ()
                    {
                        var input = 'alert(1)';
                        var output = JScrewIt.encode(input, true, 'FF31');
                        var options = { features: 'FF31', wrapWith: 'call' };
                        var expected = JScrewIt.encode(input, options);
                        expect(output).toBe(expected);
                    }
                );
                describe(
                    'with option trimCode',
                    function ()
                    {
                        it(
                            'uses trimJS',
                            function ()
                            {
                                var output = JScrewIt.encode('/* */\nABC\n', { trimCode: true });
                                var actual = eval(output);
                                expect(actual).toBe('ABC');
                            }
                        );
                        it(
                            'encodes a script consisting of only blanks and comments',
                            function ()
                            {
                                var output = JScrewIt.encode('/* */\n', { trimCode: true });
                                var actual = eval(output);
                                expect(actual).toBe('');
                            }
                        );
                        it(
                            'encodes malformed JavaScript',
                            function ()
                            {
                                var output = JScrewIt.encode('/* */"ABC', { trimCode: true });
                                var actual = eval(output);
                                expect(actual).toBe('/* */"ABC');
                            }
                        );
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
            'JScrewIt.commonFeaturesOf',
            function ()
            {
                it(
                    'returns undefined if no arguments are specified',
                    function ()
                    {
                        var actual = JScrewIt.commonFeaturesOf();
                        expect(actual).toBeUndefined();
                    }
                );
                it(
                    'returns an empty array for DEFAULT',
                    function ()
                    {
                        var actual = JScrewIt.commonFeaturesOf('DEFAULT');
                        expect(actual).toEqual([]);
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
                                describe(
                                    feature,
                                    function ()
                                    {
                                        var info = FEATURE_INFOS[feature];
                                        
                                        it(
                                            'is named correctly',
                                            function ()
                                            {
                                                var name = info.name;
                                                expect(name).toBeString();
                                                expect(info).toBe(FEATURE_INFOS[name]);
                                            }
                                        );
                                        it(
                                            'has expected availability',
                                            function ()
                                            {
                                                expect(info.available).toBe(
                                                    JScrewIt.areFeaturesAvailable(feature)
                                                );
                                            }
                                        );
                                        it(
                                            'has includes array',
                                            function ()
                                            {
                                                expect(info.includes).toBeArray();
                                            }
                                        );
                                        it(
                                            'has expected excludes array',
                                            function ()
                                            {
                                                var excludes = info.excludes;
                                                expect(excludes).toBeArray();
                                                excludes.forEach(
                                                    function (exclude)
                                                    {
                                                        var info = FEATURE_INFOS[exclude];
                                                        expect(info.excludes).toContain(feature);
                                                    }
                                                );
                                            }
                                        );
                                        it(
                                            'has description string',
                                            function ()
                                            {
                                                expect(info.description).toBeString();
                                            }
                                        );
                                        it(
                                            'is checkable',
                                            function ()
                                            {
                                                var check = info.check;
                                                if (check)
                                                {
                                                    if (feature in featureSet)
                                                    {
                                                        var emuFeatures =
                                                            featureSet[feature] ? [feature] : [];
                                                        expect(
                                                            function ()
                                                            {
                                                                emuDo(emuFeatures, check);
                                                            }
                                                        ).not.toThrow();
                                                    }
                                                }
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
            'JScrewIt.debug.trimJS',
            function ()
            {
                it(
                    'trims spaces',
                    function ()
                    {
                        var input = '\n \t\ralert(1)\r\t \n';
                        var expected = 'alert(1)';
                        var actual = JScrewIt.debug.trimJS(input);
                        expect(actual).toBe(expected);
                    }
                );
                it(
                    'trims single-line comments',
                    function ()
                    {
                        var input = '// Hello\n//World!\nalert(1)\n//Goodbye\n// World!';
                        var expected = 'alert(1)';
                        var actual = JScrewIt.debug.trimJS(input);
                        expect(actual).toBe(expected);
                    }
                );
                it(
                    'trims multiline comments',
                    function ()
                    {
                        var input = '/*/**//* || pipes\n//slashes */\ralert(1)\r/* and stuff */\n';
                        var expected = 'alert(1)';
                        var actual = JScrewIt.debug.trimJS(input);
                        expect(actual).toBe(expected);
                    }
                );
                it(
                    'trims empty script comments',
                    function ()
                    {
                        var input = '/* Introduction */\n// The end.\n';
                        var expected = '';
                        var actual = JScrewIt.debug.trimJS(input);
                        expect(actual).toBe(expected);
                    }
                );
                it(
                    'does not remove comments between code',
                    function ()
                    {
                        var input = '/*A*/\nalert//B\n(/*C*/1\n//D\n)\n/*E*/';
                        var expected = 'alert//B\n(/*C*/1\n//D\n)';
                        var actual = JScrewIt.debug.trimJS(input);
                        expect(actual).toBe(expected);
                    }
                );
                it(
                    'does not remove false comment in multiline string',
                    function ()
                    {
                        var input = 'x="\\\n//"';
                        var expected = 'x="\\\n//"';
                        var actual = JScrewIt.debug.trimJS(input);
                        expect(actual).toBe(expected);
                    }
                );
                it(
                    'does not remove false comment in template string',
                    function ()
                    {
                        var input = 'x=`\n//`';
                        var expected = 'x=`\n//`';
                        var actual = JScrewIt.debug.trimJS(input);
                        expect(actual).toBe(expected);
                    }
                );
            }
        );
        describe(
            'ScrewBuffer',
            function ()
            {
                function test(buffer, expectedStr, tolerance)
                {
                    var actualLength = buffer.length;
                    var expectedLength = expectedStr.length;
                    expect(actualLength).not.toBeGreaterThan(expectedLength);
                    expect(actualLength).not.toBeLessThan(expectedLength - (tolerance ^ 0));
                    expect(buffer + '').toBe(expectedStr);
                }
                
                var solutionA = Object('[![]+[]][+[]]');
                solutionA.level = 1;
                var solution0 = Object('+[]');
                solution0.level = -1;
                var solutionFalse = Object('![]');
                solutionFalse.level = -1;
                
                (function ()
                {
                    var buffer = JScrewIt.debug.createScrewBuffer(false, 4);
                    it(
                        'encodes a string in a single group',
                        function ()
                        {
                            expect(buffer.append(solutionA)).toBe(true);
                            expect(buffer.append(solution0)).toBe(true);
                            expect(buffer.append(solution0)).toBe(true);
                            expect(buffer.append(solution0)).toBe(true);
                            test(buffer, '[![]+[]][+[]]+(+[])+(+[])+(+[])');
                        }
                    );
                    it(
                        'encodes a string in two groups',
                        function ()
                        {
                            expect(buffer.append(solutionFalse)).toBe(true);
                            expect(buffer.append(solutionFalse)).toBe(true);
                            test(buffer, '[![]+[]][+[]]+(+[])+(+[])+(+[]+[![]]+![])', 2);
                        }
                    );
                    it(
                        'encodes a string in nested groups',
                        function ()
                        {
                            expect(buffer.append(solutionFalse)).toBe(true);
                            test(
                                buffer,
                                '[![]+[]][+[]]+(+[])+(+[])+(+[]+[![]]+(![]+[![]]))',
                                6
                            );
                        }
                    );
                    it(
                        'encodes a string with the largest possible number of elements',
                        function ()
                        {
                            expect(buffer.append(solutionFalse)).toBe(true);
                            test(
                                buffer,
                                '[![]+[]][+[]]+(+[])+(+[]+[+[]])+(![]+[![]]+(![]+[![]]))',
                                8
                            );
                        }
                    );
                    it(
                        'does not encode a string with too many elements',
                        function ()
                        {
                            expect(buffer.append(solutionFalse)).toBe(false);
                            test(
                                buffer,
                                '[![]+[]][+[]]+(+[])+(+[]+[+[]])+(![]+[![]]+(![]+[![]]))',
                                8
                            );
                        }
                    );

                })();
                it(
                    'encodes a string with incomplete groups',
                    function ()
                    {
                        var buffer = JScrewIt.debug.createScrewBuffer(false, 7);
                        for (var index = 0; index < 26; ++index)
                        {
                            var solution = Object(String.fromCharCode(65 + index));
                            solution.level = 0;
                            buffer.append(solution);
                        }
                        test(
                            buffer,
                            'A+B+C+D+E+(F+G+H+I+J)+(K+L+M+N+(O+P+Q+R)+(S+T+U+V+(W+X+Y+Z)))',
                            10
                        );
                    }
                );
                describe(
                    'with weak bound',
                    function ()
                    {
                        it(
                            'encodes an empty string',
                            function ()
                            {
                                var buffer = JScrewIt.debug.createScrewBuffer(false, 10);
                                test(buffer, '[]+[]');
                            }
                        );
                        it(
                            'encodes a single string character',
                            function ()
                            {
                                var buffer = JScrewIt.debug.createScrewBuffer(false, 10);
                                expect(buffer.append(solutionA)).toBe(true);
                                test(buffer, '[![]+[]][+[]]');
                            }
                        );
                        it(
                            'encodes a single nonstring character',
                            function ()
                            {
                                var buffer = JScrewIt.debug.createScrewBuffer(false, 10);
                                expect(buffer.append(solution0)).toBe(true);
                                test(buffer, '+[]+[]');
                            }
                        );
                    }
                );
                describe(
                    'with strong bound',
                    function ()
                    {
                        it(
                            'encodes an empty string',
                            function ()
                            {
                                var buffer = JScrewIt.debug.createScrewBuffer(true, 10);
                                test(buffer, '([]+[])');
                            }
                        );
                        it(
                            'encodes a single string character',
                            function ()
                            {
                                var buffer = JScrewIt.debug.createScrewBuffer(true, 10);
                                expect(buffer.append(solutionA)).toBe(true);
                                test(buffer, '[![]+[]][+[]]');
                            }
                        );
                        it(
                            'encodes a single nonstring character',
                            function ()
                            {
                                var buffer = JScrewIt.debug.createScrewBuffer(true, 10);
                                expect(buffer.append(solution0)).toBe(true);
                                test(buffer, '(+[]+[])');
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
                        encoder.callCoders = function () { };
                        expect(function () { encoder.encode('12345'); }).toThrow(
                            new Error('Encoding failed')
                        );
                    }
                );
            }
        );
        describe(
            'Encoder#encodeByCharCodes',
            function ()
            {
                it(
                    'returns correct JSFuck for long input',
                    function ()
                    {
                        var encoder = JScrewIt.debug.createEncoder();
                        var input = 'Lorem ipsum dolor sit amet';
                        var output = encoder.encodeByCharCodes(input, true);
                        expect(output).toBeJSFuck();
                        expect(eval(output)).toBe(input);
                    }
                );
                it(
                    'returns undefined for too complex input',
                    function ()
                    {
                        var encoder = JScrewIt.debug.createEncoder();
                        encoder.replaceNumberArray = function () { };
                        expect(encoder.encodeByCharCodes('12345')).toBeUndefined();
                    }
                );
            }
        );
        describe(
            'Encoder#encodeByDict',
            function ()
            {
                it(
                    'returns correct JSFuck with integer coercing',
                    function ()
                    {
                        var encoder = JScrewIt.debug.createEncoder();
                        var input =
                            'The thirty-three thieves thought that they thrilled the throne ' +
                            'throughout Thursday.';
                        var output = encoder.encodeByDict(Object(input), 4);
                        expect(output).toBeJSFuck();
                        expect(eval(output)).toBe(input);
                    }
                );
                it(
                    'returns undefined for too complex input',
                    function ()
                    {
                        var encoder = JScrewIt.debug.createEncoder();
                        var output1 =
                            encoder.encodeByDict(Object('12345'), undefined, undefined, 10);
                        expect(output1).toBeUndefined();
                        var output2 =
                            encoder.encodeByDict(Object('12345'), undefined, undefined, 200);
                        expect(output2).toBeUndefined();
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
                        encoder.replaceString = function () { };
                        expect(encoder.replaceNumberArray([])).toBeUndefined();
                    }
                );
            }
        );
        describe(
            'Encoder#replaceString',
            function ()
            {
                it(
                    'returns undefined for too complex input',
                    function ()
                    {
                        var encoder = JScrewIt.debug.createEncoder();
                        encoder.maxGroupThreshold = 2;
                        expect(encoder.replaceString('123')).toBeUndefined();
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
        describe(
            'Encoding',
            function ()
            {
                var encoder = JScrewIt.debug.createEncoder();
                var input = 'Lorem ipsum dolor sit amet';
                var coders = JScrewIt.debug.getCoders();
                Object.keys(coders).forEach(
                    function (coderName)
                    {
                        describe(
                            coderName,
                            function ()
                            {
                                var maxLength = coders[coderName].call(encoder, Object('')).length;
                                it(
                                    'returns correct JSFuck',
                                    function ()
                                    {
                                        var output = coders[coderName].call(encoder, Object(input));
                                        expect(output).toBeJSFuck();
                                        expect(eval(output)).toBe(input);
                                    }
                                );
                                it(
                                    'returns undefined when output length exceeds maxLength',
                                    function ()
                                    {
                                        var output =
                                            coders[coderName].call(
                                                encoder,
                                                Object(''),
                                                maxLength - 1
                                            );
                                        expect(output).toBeUndefined();
                                    }
                                );
                                it(
                                    'returns a string when output length equals maxLength',
                                    function ()
                                    {
                                        var output =
                                            coders[coderName].call(encoder, Object(''), maxLength);
                                        expect(output).toBeString();
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
        describe(
            'MIN_INPUT_LENGTH of',
            function ()
            {
                function test(features, createInput, coderName)
                {
                    function findBestCoder(inputData)
                    {
                        var bestCoderName;
                        var bestLength = Infinity;
                        coderNames.forEach(
                            function (thisCoderName)
                            {
                                if (thisCoderName !== 'simple' && thisCoderName !== coderName)
                                {
                                    var coder = coders[thisCoderName];
                                    var output = coder.call(encoder, inputData);
                                    var length = output.length;
                                    if (length < bestLength)
                                    {
                                        bestCoderName = thisCoderName;
                                        bestLength = length;
                                    }
                                }
                            }
                        );
                        var result = { coderName: bestCoderName, length: bestLength };
                        return result;
                    }
                    
                    var encoder = JScrewIt.debug.createEncoder(features);
                    var coders = JScrewIt.debug.getCoders();
                    var coder = coders[coderName];
                    var minLength = coder.MIN_INPUT_LENGTH;
                    var inputDataShort = Object(createInput(minLength - 1));
                    var inputDataFit = Object(createInput(minLength));
                    var coderNames = Object.keys(coders);
                    it(
                        coderName + ' is suitable',
                        function ()
                        {
                            var outputFit = coder.call(encoder, inputDataFit);
                            var bestDataFit = findBestCoder(inputDataFit);
                            expect(bestDataFit.length).toBeGreaterThan(
                                outputFit.length,
                                'MIN_INPUT_LENGTH is too small for ' + bestDataFit.coderName
                            );
                            var outputShort = coder.call(encoder, inputDataShort);
                            var bestDataShort = findBestCoder(inputDataShort);
                            expect(bestDataShort.length).not.toBeGreaterThan(
                                outputShort.length,
                                'MIN_INPUT_LENGTH is too large for ' + bestDataShort.coderName
                            );
                        }
                    );
                }
                
                test(
                    'CAPITAL_HTML',
                    repeat.bind(null, String.fromCharCode(59999)),
                    'byCharCodes'
                    );
                test(
                    ['ATOB', 'ENTRIES', 'FILL', 'V8_SRC'],
                    function (length)
                    {
                        var CHAR_CODES =
                        [
                            49989, 49988, 59989, 37889, 59988, 37888, 38999, 38998, 29989, 38997,
                            37989, 59969, 58889, 57989, 58898, 58899, 19989
                        ];
                        var str = repeatToFit(String.fromCharCode.apply(null, CHAR_CODES), length);
                        return str;
                    },
                    'byCharCodesRadix4'
                );
                test('ENTRIES', repeat.bind(null, String.fromCharCode(59999)), 'byDict');
                test(
                    ['ATOB', 'ENTRIES', 'FILL', 'V8_SRC'],
                    createDictTestString.bind(null, 122),
                    'byDictRadix3'
                );
                test(
                    ['ATOB', 'ENTRIES', 'FILL', 'V8_SRC'],
                    createDictTestString.bind(null, 100),
                    'byDictRadix4'
                );
                test(
                    ['ATOB', 'ENTRIES', 'FILL', 'V8_SRC'],
                    createDictTestString.bind(null, 129),
                    'byDictRadix4AmendedBy1'
                );
                test(
                    ['ATOB', 'ENTRIES', 'FILL', 'NO_IE_SRC'],
                    createDictTestString.bind(null, 364),
                    'byDictRadix4AmendedBy2'
                );
                test(
                    ['ATOB', 'ENTRIES', 'FILL', 'NO_IE_SRC'],
                    createDictTestString.bind(null, 124),
                    'byDictRadix5AmendedBy2'
                );
                test(
                    ['ENTRIES', 'FILL', 'V8_SRC'],
                    createAntiRadix4TestString.bind(null, 473),
                    'byDictRadix5AmendedBy3'
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
    
    function repeat(str, count)
    {
        var result = Array(count + 1).join(str);
        return result;
    }
    
    function repeatToFit(str, length)
    {
        var result = repeat(str, Math.ceil(length / str.length)).slice(0, length);
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
                    expect(actual).toBe(char);
                }
                
                var entries = JScrewIt.debug.getCharacterEntries(char);
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
                                var output = JScrewIt.encode(char);
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
                            var output = JScrewIt.encode(char);
                            verifyOutput(output);
                        }
                    );
                    if ('ATOB' in featureSet)
                    {
                        it(
                            '(atob)',
                            function ()
                            {
                                var options = { features: 'ATOB' };
                                var output = JScrewIt.encode(char, options);
                                verifyOutput(output, featureSet.ATOB && ['ATOB']);
                                expect(output.length).not.toBeGreaterThan(
                                    JScrewIt.encode(char).length
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
