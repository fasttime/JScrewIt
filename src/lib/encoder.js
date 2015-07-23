/*
global
CHARACTERS,
COMPLEX,
CONSTANTS,
LEVEL_STRING,
SIMPLE,
ScrewBuffer,
createSolution,
define,
getAppendLength,
hasOuterPlus,
replaceDigit
*/

var CODERS;

var Encoder;

var expandEntries;

(function ()
{
    'use strict';
    
    var AMENDINGS = ['true', 'undefined', 'NaN'];
    
    var BASE64_ALPHABET_HI_2 = ['NaN', 'false', 'undefined', '0'];
    
    var BASE64_ALPHABET_HI_4 =
    [
        [
            define('A'),
            define('C', 'CAPITAL_HTML'),
            define('B', 'CAPITAL_HTML', 'ENTRIES'),
            define('A', 'ARRAY_ITERATOR')
        ],
        'F',
        'Infinity',
        'NaNfalse',
        [
            define('S'),
            define('R', 'CAPITAL_HTML'),
            define('S', 'CAPITAL_HTML', 'ENTRIES')
        ],
        [
            define('U'),
            define('V', 'ATOB'),
            define('U', 'ATOB', 'CAPITAL_HTML')
        ],
        'a',
        'false',
        'i',
        'n',
        'r',
        'true',
        'y',
        '0',
        '4',
        '8',
    ];
    
    var BASE64_ALPHABET_HI_6 =
    [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'Infinity',
        'J',
        'K',
        'L',
        'M',
        'NaN',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
        'a',
        'b',
        'c',
        'd',
        'e',
        'false',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        'true',
        'undefined',
        'v',
        'w',
        'x',
        'y',
        'z',
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '+',
        '/',
    ];
    
    var BASE64_ALPHABET_LO_2 = ['000', 'NaN', 'falsefalsefalse', '00f'];
    
    var BASE64_ALPHABET_LO_4 =
    [
        '0A',
        [
            define('0B'),
            define('0R', 'CAPITAL_HTML'),
            define('0B', 'ENTRIES')
        ],
        '0i',
        '0j',
        '00',
        '01',
        '02',
        '03',
        '04',
        '05',
        '0a',
        '0r',
        '0s',
        '0t',
        'undefinedfalse',
        '0f',
    ];
    
    var BASE64_ALPHABET_LO_6 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    
    var FROM_CHAR_CODE =
    [
        define('fromCharCode'),
        define('fromCodePoint', 'ATOB', 'FROM_CODE_POINT'),
        define('fromCodePoint', 'CAPITAL_HTML', 'FROM_CODE_POINT')
    ];
    
    CODERS =
    {
        byCharCodes: defineCoder
        (
            function (inputData, maxLength)
            {
                var MAX_DECODABLE_ARGS = 65533; // limit imposed by Internet Explorer
                
                var input = inputData.valueOf();
                var long = input.length > MAX_DECODABLE_ARGS;
                var output = this.encodeByCharCodes(input, long, undefined, maxLength);
                return output;
            },
            2
        ),
        byCharCodesRadix4: defineCoder
        (
            function (inputData, maxLength)
            {
                var input = inputData.valueOf();
                var output = this.encodeByCharCodes(input, undefined, 4, maxLength);
                return output;
            },
            48
        ),
        byDict: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, undefined, undefined, maxLength);
                return output;
            },
            3
        ),
        byDictRadix3: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 3, 0, maxLength);
                return output;
            },
            363
        ),
        byDictRadix4: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 4, 0, maxLength);
                return output;
            },
            267
        ),
        byDictRadix4AmendedBy1: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 4, 1, maxLength);
                return output;
            },
            379
        ),
        byDictRadix4AmendedBy2: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 4, 2, maxLength);
                return output;
            },
            706
        ),
        byDictRadix5AmendedBy2: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 5, 2, maxLength);
                return output;
            },
            679
        ),
        byDictRadix5AmendedBy3: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 5, 3, maxLength);
                return output;
            },
            854
        ),
        plain: defineCoder
        (
            function (inputData, maxLength)
            {
                var input = inputData.valueOf();
                var output = this.replaceString(input, false, maxLength);
                return output;
            }
        ),
    };
    
    var DEFAULT_CHARACTER_ENCODER =
    [
        define(
            function (char)
            {
                var charCode = char.charCodeAt(0);
                var encoder = charCode < 0x100 ? charEncodeByUnescape8 : charEncodeByUnescape16;
                var result = createSolution(encoder.call(this, charCode), LEVEL_STRING, false);
                return result;
            }
        ),
        define(
            function (char)
            {
                var charCode = char.charCodeAt(0);
                var encoder = charCode < 0x100 ? charEncodeByAtob : charEncodeByEval;
                var result = createSolution(encoder.call(this, charCode), LEVEL_STRING, false);
                return result;
            },
            'ATOB'
        )
    ];
    
    var quoteString = JSON.stringify;
    
    function charEncodeByAtob(charCode)
    {
        var param1 = BASE64_ALPHABET_LO_6[charCode >> 2] + BASE64_ALPHABET_HI_2[charCode & 0x03];
        var postfix1 = '(' + this.replaceString(param1) + ')';
        if (param1.length > 2)
        {
            postfix1 += this.replaceExpr('[0]');
        }
        var length1 = postfix1.length;
        
        var param2Left = this.findBase64AlphabetDefinition(BASE64_ALPHABET_LO_4[charCode >> 4]);
        var param2Right = this.findBase64AlphabetDefinition(BASE64_ALPHABET_HI_4[charCode & 0x0f]);
        var param2 = param2Left + param2Right;
        var index2 = 1 + (param2Left.length - 2) / 4 * 3;
        if (index2 > 9)
        {
            index2 = '"' + index2 + '"';
        }
        var postfix2 =
            '(' + this.replaceString(param2) + ')' + this.replaceExpr('[' + index2 + ']');
        var length2 = postfix2.length;
        
        var param3Left = BASE64_ALPHABET_LO_2[charCode >> 6];
        var param3 = param3Left + BASE64_ALPHABET_HI_6[charCode & 0x3f];
        var index3 = 2 + (param3Left.length - 3) / 4 * 3;
        if (index3 > 9)
        {
            index3 = '"' + index3 + '"';
        }
        var postfix3 =
            '(' + this.replaceString(param3) + ')' + this.replaceExpr('[' + index3 + ']');
        var length3 = postfix3.length;
        
        var postfix =
            length1 <= length2 && length1 <= length3 ?
            postfix1 :
            length2 <= length3 ? postfix2 : postfix3;
        var result = this.resolveConstant('atob') + postfix;
        return result;
    }
    
    function charEncodeByEval(charCode)
    {
        var hexCode = this.hexCodeOf(charCode, 4);
        var result =
            this.resolveConstant('Function') + '(' +
            this.replaceString('return"\\u' + hexCode + '"') + ')()';
        if (hexCode.length > 4)
        {
            result += this.replaceExpr('[0]');
        }
        return result;
    }
    
    function charEncodeByUnescape16(charCode)
    {
        var hexCode = this.hexCodeOf(charCode, 4);
        var result =
            this.resolveConstant('unescape') + '(' + this.replaceString('%u' + hexCode) + ')';
        if (hexCode.length > 4)
        {
            result += this.replaceExpr('[0]');
        }
        return result;
    }
    
    function charEncodeByUnescape8(charCode)
    {
        var hexCode = this.hexCodeOf(charCode, 2);
        var result =
            this.resolveConstant('unescape') + '(' + this.replaceString('%' + hexCode) + ')';
        if (hexCode.length > 2)
        {
            result += this.replaceExpr('[0]');
        }
        return result;
    }
    
    function createFrequencyList(input)
    {
        var charMap = Object.create(null);
        Array.prototype.forEach.call(
            input,
            function (char)
            {
                ++(charMap[char] || (charMap[char] = { char: char, count: 0 })).count;
            }
        );
        var freqList =
            Object.keys(charMap).map(
                function (char) { return charMap[char]; }
            ).sort(
                function (freq1, freq2) { return freq2.count - freq1.count; }
            );
        return freqList;
    }
    
    function createReindexMap(count, radix, amendings, coerceToInt)
    {
        function getSortLength()
        {
            var length = 0;
            Array.prototype.forEach.call(str, function (digit) { length += digitLengths[digit]; });
            return length;
        }
        
        var index;
        var digitLengths = [6, 8, 12, 17, 22, 27, 32, 37, 42, 47].slice(0, radix || 10);
        var regExp;
        var replacer;
        if (amendings)
        {
            var firstDigit = radix - amendings;
            var pattern = '[';
            for (index = 0; index < amendings; ++index)
            {
                var digit = firstDigit + index;
                digitLengths[digit] = getAppendLength(resolveSimple(AMENDINGS[index]));
                pattern += digit;
            }
            pattern += ']';
            regExp = new RegExp(pattern, 'g');
            replacer = function (match) { return AMENDINGS[match - firstDigit]; };
        }
        var range = [];
        for (index = 0; index < count; ++index)
        {
            var str = coerceToInt && !index ? '' : index.toString(radix);
            var reindexStr = amendings ? str.replace(regExp, replacer) : str;
            var reindex = range[index] = Object(reindexStr);
            reindex.sortLength = getSortLength();
            reindex.index = index;
        }
        range.sort(
            function (reindex1, reindex2)
            {
                var result = reindex1.sortLength - reindex2.sortLength;
                return result;
            }
        );
        return range;
    }
    
    function defineCoder(coder, minInputLength)
    {
        coder.MIN_INPUT_LENGTH = minInputLength;
        return coder;
    }
    
    function isFollowedByLeftSquareBracket(expr, offset)
    {
        for (;;)
        {
            var char = expr[offset++];
            if (char === '[')
            {
                return true;
            }
            if (char !== ' ')
            {
                return false;
            }
        }
    }
    
    function isPrecededByOperator(expr, offset)
    {
        for (;;)
        {
            var char = expr[--offset];
            if (char === '+' || char === '!')
            {
                return true;
            }
            if (char !== ' ')
            {
                return false;
            }
        }
    }
    
    function isStrongBoundRequired(expr, offset, wholeMatch)
    {
        var strongBound =
            isPrecededByOperator(expr, offset) ||
            isFollowedByLeftSquareBracket(expr, offset + wholeMatch.length);
        return strongBound;
    }
    
    function replaceToken(wholeMatch, number, quotedString, space, literal, offset, expr)
    {
        var replacement;
        if (number)
        {
            replacement = replaceDigit(+number[0]) + '';
            var length = number.length;
            for (var index = 1; index < length; ++index)
            {
                replacement += '+[' + replaceDigit(+number[index]) + ']';
            }
            if (length > 1)
            {
                replacement = '+(' + replacement + ')';
            }
            if (isStrongBoundRequired(expr, offset, wholeMatch))
            {
                replacement = '(' + replacement + ')';
            }
        }
        else if (quotedString)
        {
            var str;
            try
            {
                str = JSON.parse(quotedString);
            }
            catch (e)
            {
                this.throwSyntaxError('Illegal string ' + quotedString);
            }
            var strongBound = isStrongBoundRequired(expr, offset, wholeMatch);
            replacement = this.replaceString(str, strongBound);
            if (!replacement)
            {
                this.throwSyntaxError('String too complex');
            }
        }
        else if (space)
        {
            replacement = '';
        }
        else if (literal)
        {
            var solution;
            if (literal in this.constantDefinitions)
            {
                solution = this.resolveConstant(literal);
            }
            else if (literal in SIMPLE)
            {
                solution = resolveSimple(literal);
            }
            else
            {
                this.throwSyntaxError('Undefined literal ' + literal);
            }
            replacement =
                isStrongBoundRequired(expr, offset, wholeMatch) && hasOuterPlus(solution) ?
                '(' + solution + ')' : solution + '';
        }
        else
        {
            this.throwSyntaxError('Unexpected character ' + quoteString(wholeMatch));
        }
        return replacement;
    }
    
    function resolveSimple(simple)
    {
        var solution = SIMPLE[simple];
        if (typeof solution.valueOf() === 'object')
        {
            var encoder = new Encoder();
            encoder.callResolver(
                simple,
                function ()
                {
                    SIMPLE[simple] = solution = encoder.resolve(solution);
                }
            );
        }
        return solution;
    }
    
    Encoder =
        function (featureMask)
        {
            this.featureMask = featureMask;
            this.characterCache = { };
            this.complexCache = { };
            this.constantCache = { };
            this.stack = [];
        };
    
    Encoder.prototype =
    {
        callCoders: function (input, coderNames, codingName)
        {
            var output;
            var inputLength = input.length;
            var codingLog = this.codingLog;
            var perfInfoList = [];
            perfInfoList.name = codingName;
            perfInfoList.inputLength = inputLength;
            codingLog.push(perfInfoList);
            var inputData = Object(input);
            var usedPerfInfo;
            coderNames.forEach(
                function (coderName)
                {
                    var coder = CODERS[coderName];
                    var perfInfo = { coderName: coderName };
                    var perfStatus;
                    if (inputLength < coder.MIN_INPUT_LENGTH)
                    {
                        perfStatus = 'skipped';
                    }
                    else
                    {
                        this.codingLog = perfInfo.codingLog = [];
                        var before = new Date();
                        var maxLength = output != null ? output.length : undefined;
                        var newOutput = coder.call(this, inputData, maxLength);
                        var time = new Date() - before;
                        this.codingLog = codingLog;
                        perfInfo.time = time;
                        if (newOutput != null)
                        {
                            output = newOutput;
                            if (usedPerfInfo)
                            {
                                usedPerfInfo.status = 'superseded';
                            }
                            usedPerfInfo = perfInfo;
                            perfInfo.outputLength = newOutput.length;
                            perfStatus = 'used';
                        }
                        else
                        {
                            perfStatus = 'incomplete';
                        }
                    }
                    perfInfo.status = perfStatus;
                    perfInfoList.push(perfInfo);
                },
                this
            );
            return output;
        },
        
        callResolver: function (stackName, resolver)
        {
            var stack = this.stack;
            var stackIndex = stack.indexOf(stackName);
            stack.push(stackName);
            try
            {
                if (stackIndex >= 0)
                {
                    var chain = stack.slice(stackIndex);
                    throw new SyntaxError('Circular reference detected: ' + chain.join(' < '));
                }
                resolver.call(this);
            }
            finally
            {
                stack.pop();
            }
        },
        
        constantDefinitions: CONSTANTS,
        
        createCharCodesEncoding: function (charCodes, long, radix)
        {
            var output;
            var fromCharCode = this.findBestDefinition(FROM_CHAR_CODE);
            if (radix)
            {
                output =
                    charCodes +
                    this.replaceExpr(
                        '["map"](Function("return String.' + fromCharCode +
                        '(parseInt(arguments[0],' + radix + '))"))["join"]([])'
                    );
            }
            else
            {
                if (long)
                {
                    output =
                        charCodes +
                        this.replaceExpr(
                            '["map"](Function("return String.' + fromCharCode +
                            '(arguments[0])"))["join"]([])'
                        );
                }
                else
                {
                    output =
                        this.replaceExpr('Function("return String.' + fromCharCode + '(" +') +
                        charCodes + this.replaceExpr('+ ")")()');
                }
            }
            return output;
        },
        
        createDictEncoding: function (legend, indexes, radix, amendings, coerceToInt)
        {
            var mapper;
            if (radix)
            {
                var parseIntArg;
                if (amendings)
                {
                    var firstDigit = radix - amendings;
                    if (amendings > 2)
                    {
                        parseIntArg =
                            '[' +
                            AMENDINGS.slice(0, amendings).map(
                                function (amending) { return '/' + amending + '/g'; }
                            ).join() +
                            '].reduce(function(falsefalse,falsetrue,truefalse){return falsefalse.' +
                            'replace(falsetrue,truefalse+' + firstDigit + ')},arguments[0])';
                    }
                    else
                    {
                        parseIntArg = 'arguments[0]';
                        for (var index = 0; index < amendings; ++index)
                        {
                            var digit = firstDigit + index;
                            parseIntArg += '.replace(/' + AMENDINGS[index] + '/g,' + digit + ')';
                        }
                    }
                }
                else
                {
                    parseIntArg = 'arguments[0]';
                }
                if (coerceToInt)
                {
                    parseIntArg = '+' + parseIntArg;
                }
                mapper =
                    'Function("return this[parseInt(' + parseIntArg + ',' + radix + ')]")["bind"]';
            }
            else
            {
                mapper = '""["charAt"]["bind"]';
            }
            var output =
                indexes + this.replaceExpr('["map"]') + '(' + this.replaceExpr(mapper) + '(' +
                legend + '))' + this.replaceExpr('["join"]([])');
            return output;
        },
        
        createStringTokenPattern: function ()
        {
            function callback(complex)
            {
                var result = this.complexCache[complex] !== null;
                return result;
            }
            
            var stringTokenPattern =
                '(' + Object.keys(SIMPLE).join('|') + ')' +
                '|(' + Object.keys(COMPLEX).filter(callback, this).join('|') + ')' +
                '|([^])';
            this.stringTokenPattern = stringTokenPattern;
            return stringTokenPattern;
        },
        
        encode: function (input, wrapWith)
        {
            var output =
                this.callCoders(
                    input,
                    [
                        'byDictRadix5AmendedBy3',
                        'byDictRadix4AmendedBy2',
                        'byDictRadix5AmendedBy2',
                        'byDictRadix4AmendedBy1',
                        'byDictRadix3',
                        'byDictRadix4',
                        'byDict',
                        'byCharCodesRadix4',
                        'byCharCodes',
                        'plain'
                    ]
                );
            if (!output)
            {
                throw new Error('Encoding failed');
            }
            if (wrapWith === 'call')
            {
                output = this.resolveConstant('Function') + '(' + output + ')()';
            }
            else if (wrapWith === 'eval')
            {
                output = this.replaceExpr('Function("return eval")()') + '(' + output + ')';
            }
            return output;
        },
        
        encodeByCharCodes: function (input, long, radix, maxLength)
        {
            var cache = Object.create(null);
            var charCodes =
                this.replaceNumberArray(
                    Array.prototype.map.call(
                        input,
                        function (char)
                        {
                            var charCode =
                                cache[char] || (cache[char] = char.charCodeAt().toString(radix));
                            return charCode;
                        }
                    ),
                    maxLength
                );
            if (charCodes)
            {
                var output = this.createCharCodesEncoding(charCodes, long, radix);
                if (!(output.length > maxLength))
                {
                    return output;
                }
            }
        },
        
        encodeByDict: function (inputData, radix, amendings, maxLength)
        {
            var input = inputData.valueOf();
            var freqList = inputData.freqList || (inputData.freqList = createFrequencyList(input));
            var coerceToInt =
                freqList.length &&
                freqList[0].count * 6 > getAppendLength(this.resolveCharacter('+'));
            var reindexMap = createReindexMap(freqList.length, radix, amendings, coerceToInt);
            var charMap = Object.create(null);
            var minFreqIndexLength =
                Math.max((input.length - 1) * (resolveSimple('false').length + 1) - 3, 0);
            var dictChars = [];
            freqList.forEach(
                function (freq, index)
                {
                    var reindex = reindexMap[index];
                    var char = freq.char;
                    charMap[char] = reindex;
                    minFreqIndexLength += freq.count * reindex.sortLength;
                    dictChars[reindex.index] = char;
                }
            );
            var legend = this.encodeDictLegend(dictChars.join(''), maxLength - minFreqIndexLength);
            if (legend)
            {
                var freqIndexes =
                    this.replaceNumberArray(
                        Array.prototype.map.call(
                            input,
                            function (char)
                            {
                                var index = charMap[char];
                                return index;
                            }
                        ),
                        maxLength - legend.length
                    );
                if (freqIndexes)
                {
                    var output =
                        this.createDictEncoding(legend, freqIndexes, radix, amendings, coerceToInt);
                    if (!(output.length > maxLength))
                    {
                        return output;
                    }
                }
            }
        },
        
        encodeDictLegend: function (input, maxLength)
        {
            if (!(maxLength < 0))
            {
                var output =
                    this.callCoders(input, ['byCharCodesRadix4', 'byCharCodes', 'plain'], 'legend');
                if (output && !(output.length > maxLength))
                {
                    return output;
                }
            }
        },
        
        findBase64AlphabetDefinition: function (element)
        {
            var definition;
            if (Array.isArray(element))
            {
                definition = this.findBestDefinition(element);
            }
            else
            {
                definition = element;
            }
            return definition;
        },
        
        findBestDefinition: function (entries)
        {
            for (var entryIndex = entries.length; entryIndex--;)
            {
                var entry = entries[entryIndex];
                if (this.hasFeatures(entry.featureMask))
                {
                    return entry.definition;
                }
            }
        },
        
        findOptimalSolution: function (entries, defaultResolver)
        {
            var result;
            entries = expandEntries(entries);
            entries.forEach(
                function (entry, entryIndex)
                {
                    if (this.hasFeatures(entry.featureMask))
                    {
                        var definition = entry.definition;
                        var solution = definition ? this.resolve(definition) : defaultResolver();
                        if (!result || result.length >= solution.length)
                        {
                            result = solution;
                            solution.entryIndex = entryIndex;
                        }
                    }
                },
                this
            );
            return result;
        },
        
        hasFeatures: function (featureMask)
        {
            return (featureMask & this.featureMask) === featureMask;
        },
        
        hexCodeOf: function (charCode, length)
        {
            var optimalB = this.findBestDefinition([define('B'), define('b', 'ENTRIES')]);
            var result = charCode.toString(16).replace(/b/g, optimalB);
            result = Array(length - result.length + 1).join(0) + result.replace(/fa?$/, 'false');
            return result;
        },
        
        // The maximum value that can be safely used as the first group threshold of a ScrewBuffer.
        // "Safely" means such that the extreme decoding test is passed in all engines.
        // This value is typically limited by the free memory available on the stack, and since the
        // memory layout of the stack changes at runtime in an unstable way, the maximum safe value
        // cannot be determined exactly.
        // The lowest recorded value so far is 1844, measured in an Android Browser 4.2.2 running on
        // an Intel Atom emulator.
        // Internet Explorer on Windows Phone occasionally failed the extreme decoding test in a
        // non-reproducible manner, although the issue seems to be related to the output size rather
        // than the grouping threshold setting.
        maxGroupThreshold: 1800,
        
        replaceExpr: function (expr)
        {
            var result =
                expr.replace(
                    /([0-9]+)|("(?:\\.|(?!").)*")|( +)|([$A-Z_a-z][$0-9A-Z_a-z]*)|[^!()+[\]]/g,
                    this.replaceToken || (this.replaceToken = replaceToken.bind(this))
                );
            return result;
        },
        
        replaceNumberArray: function (array, maxLength)
        {
            var replacement = this.replaceString(array.join(false), true, maxLength);
            if (replacement)
            {
                var result = replacement + this.replaceExpr('["split"](false)');
                if (!(result.length > maxLength))
                {
                    return result;
                }
            }
        },
        
        replaceString: function (str, strongBound, maxLength)
        {
            function makeRegExp()
            {
                regExp = new RegExp(stringTokenPattern, 'g');
            }
            
            var buffer = new ScrewBuffer(strongBound, this.maxGroupThreshold);
            var stringTokenPattern = this.stringTokenPattern || this.createStringTokenPattern();
            var match;
            var regExp;
            makeRegExp();
            while (match = regExp.exec(str))
            {
                if (buffer.length > maxLength)
                {
                    return;
                }
                var token;
                var solution;
                if (token = match[1])
                {
                    solution = resolveSimple(token);
                }
                else if (token = match[2])
                {
                    solution = this.resolveComplex(token);
                    if (!solution)
                    {
                        stringTokenPattern = this.createStringTokenPattern();
                        var lastIndex = regExp.lastIndex - token.length;
                        makeRegExp();
                        regExp.lastIndex = lastIndex;
                        continue;
                    }
                }
                else
                {
                    token = match[3];
                    solution = this.resolveCharacter(token);
                }
                if (!buffer.append(solution))
                {
                    return;
                }
            }
            var result = buffer + '';
            if (!(result.length > maxLength))
            {
                return result;
            }
        },
        
        resolve: function (definition)
        {
            var solution;
            var type = typeof definition;
            if (type === 'function')
            {
                solution = definition.call(this);
            }
            else
            {
                var expr;
                var level;
                if (type === 'object')
                {
                    expr = definition.expr;
                    level = definition.level;
                }
                else
                {
                    expr = definition;
                }
                var replacement = this.replaceExpr(expr);
                solution = createSolution(replacement, level);
            }
            return solution;
        },
        
        resolveCharacter: function (char)
        {
            var solution = this.characterCache[char];
            if (solution === undefined)
            {
                this.callResolver(
                    quoteString(char),
                    function ()
                    {
                        var entries = CHARACTERS[char];
                        var defaultCharacterEncoder =
                            this.findBestDefinition(DEFAULT_CHARACTER_ENCODER);
                        var defaultResolver = defaultCharacterEncoder.bind(this, char);
                        solution = this.findOptimalSolution(entries, defaultResolver);
                        if (!solution)
                        {
                            solution = defaultResolver();
                        }
                        if (solution.level == null)
                        {
                            solution.level = LEVEL_STRING;
                        }
                        this.characterCache[char] = solution;
                    }
                );
            }
            return solution;
        },
        
        resolveComplex: function (complex)
        {
            var solution = this.complexCache[complex];
            if (solution === undefined)
            {
                this.callResolver(
                    quoteString(complex),
                    function ()
                    {
                        var solution = null;
                        var entries = COMPLEX[complex];
                        var optimalSolution = this.findOptimalSolution(entries);
                        if (optimalSolution)
                        {
                            var discreteLength = -1;
                            Array.prototype.forEach.call(
                                complex,
                                function (char)
                                {
                                    var solution = this.resolveCharacter(char);
                                    discreteLength += getAppendLength(solution);
                                },
                                this
                            );
                            if (discreteLength >= optimalSolution.length)
                            {
                                solution = optimalSolution;
                                solution.level = LEVEL_STRING;
                            }
                        }
                        this.complexCache[complex] = solution;
                    }
                );
            }
            return solution;
        },
        
        resolveConstant: function (constant)
        {
            var solution = this.constantCache[constant];
            if (solution === undefined)
            {
                this.callResolver(
                    constant,
                    function ()
                    {
                        var entries = this.constantDefinitions[constant];
                        solution = this.findOptimalSolution(entries);
                        this.constantCache[constant] = solution;
                    }
                );
            }
            return solution;
        },
        
        throwSyntaxError: function (message)
        {
            var stack = this.stack;
            var stackLength = stack.length;
            if (stackLength)
            {
                message += ' in the definition of ' + stack[stackLength - 1];
            }
            throw new SyntaxError(message);
        }
    };
    
    expandEntries =
        function (entries)
        {
            if (!Array.isArray(entries))
            {
                entries = [define(entries)];
            }
            return entries;
        };
}
)();
