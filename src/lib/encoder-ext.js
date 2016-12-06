/*
global
AMENDINGS,
CREATE_PARSE_INT_ARG,
FROM_CHAR_CODE,
FROM_CHAR_CODE_CALLBACK_FORMATTER,
MAPPER_FORMATTER,
SIMPLE,
Empty,
Encoder,
array_prototype_forEach,
array_prototype_map,
assignNoEnum,
createParseIntArgDefault,
expressParse,
getAppendLength,
getFigure,
math_max,
object_keys,
*/

var CODERS;

var wrapWithCall;
var wrapWithEval;

(function ()
{
    function createReindexMap(count, radix, amendings, coerceToInt)
    {
        function getSortLength()
        {
            var length = 0;
            array_prototype_forEach.call(
                str,
                function (digit)
                {
                    length += digitLengths[digit];
                }
            );
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
                digitLengths[digit] = getAppendLength(SIMPLE[AMENDINGS[index]]);
                pattern += digit;
            }
            pattern += ']';
            regExp = RegExp(pattern, 'g');
            replacer =
                function (match)
                {
                    return AMENDINGS[match - firstDigit];
                };
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
                var result =
                    reindex1.sortLength - reindex2.sortLength || reindex1.index - reindex2.index;
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
    
    function getCodingName(unitIndices)
    {
        var codingName = unitIndices.length ? unitIndices.join(':') : '0';
        return codingName;
    }
    
    function getFrequencyList(inputData)
    {
        var freqList = inputData.freqList;
        if (!freqList)
        {
            var charMap = new Empty();
            array_prototype_forEach.call(
                inputData,
                function (char)
                {
                    ++(
                        charMap[char] ||
                        (charMap[char] = { char: char, charCode: char.charCodeAt(), count: 0 })
                    ).count;
                }
            );
            var charList = object_keys(charMap);
            inputData.freqList = freqList =
                charList.map(
                    function (char)
                    {
                        var freq = charMap[char];
                        return freq;
                    }
                ).sort(
                    function (freq1, freq2)
                    {
                        var diff = freq2.count - freq1.count || freq1.charCode - freq2.charCode;
                        return diff;
                    }
                );
        }
        return freqList;
    }
    
    function initMinCharIndexArrayStrLength(input)
    {
        var minCharIndexArrayStrLength =
            math_max((input.length - 1) * (SIMPLE.false.length + 1) - 3, 0);
        return minCharIndexArrayStrLength;
    }
    
    CODERS =
    {
        byCharCodes: defineCoder
        (
            function (inputData, maxLength)
            {
                var MAX_DECODABLE_ARGS = 65533; // limit imposed by Internet Explorer
                
                var input = inputData.valueOf();
                var long = input.length > MAX_DECODABLE_ARGS;
                var output = this.encodeByCharCodes(input, long, void 0, maxLength);
                return output;
            },
            2
        ),
        byCharCodesRadix4: defineCoder
        (
            function (inputData, maxLength)
            {
                var input = inputData.valueOf();
                var output = this.encodeByCharCodes(input, void 0, 4, maxLength);
                return output;
            },
            39
        ),
        byDblDict: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDblDict(inputData, maxLength);
                return output;
            },
            410
        ),
        byDict: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, void 0, void 0, maxLength);
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
            349
        ),
        byDictRadix4: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 4, 0, maxLength);
                return output;
            },
            195
        ),
        byDictRadix4AmendedBy1: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 4, 1, maxLength);
                return output;
            },
            358
        ),
        byDictRadix4AmendedBy2: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 4, 2, maxLength);
                return output;
            },
            676
        ),
        byDictRadix5AmendedBy3: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 5, 3, maxLength);
                return output;
            },
            783
        ),
        express: defineCoder
        (
            function (inputData, maxLength)
            {
                var input = inputData.valueOf();
                var output = this.encodeExpress(input, maxLength);
                return output;
            }
        ),
        plain: defineCoder
        (
            function (inputData, maxLength)
            {
                var input = inputData.valueOf();
                var bond = inputData.bond;
                var output = this.replaceString(input, bond, inputData.forceString, maxLength);
                return output;
            }
        ),
        text: defineCoder
        (
            function (inputData, maxLength)
            {
                var input = inputData.valueOf();
                var wrapper = inputData.wrapper;
                var output = this.encodeAndWrapText(input, wrapper, void 0, maxLength);
                return output;
            }
        ),
    };
    
    var encoderProtoSource =
    {
        callCoders: function (input, options, coderNames, codingName)
        {
            var output;
            var inputLength = input.length;
            var codingLog = this.codingLog;
            var perfInfoList = [];
            perfInfoList.name = codingName;
            perfInfoList.inputLength = inputLength;
            codingLog.push(perfInfoList);
            var inputData = Object(input);
            object_keys(options).forEach(
                function (optName)
                {
                    inputData[optName] = options[optName];
                }
            );
            var usedPerfInfo;
            coderNames.forEach(
                function (coderName)
                {
                    var coder = CODERS[coderName];
                    var perfInfo = { coderName: coderName };
                    var perfStatus;
                    if (inputLength < coder.MIN_INPUT_LENGTH)
                        perfStatus = 'skipped';
                    else
                    {
                        this.codingLog = perfInfo.codingLog = [];
                        var before = new Date();
                        var maxLength = output != null ? output.length : void 0;
                        var newOutput = coder.call(this, inputData, maxLength);
                        var time = new Date() - before;
                        this.codingLog = codingLog;
                        perfInfo.time = time;
                        if (newOutput != null)
                        {
                            output = newOutput;
                            if (usedPerfInfo)
                                usedPerfInfo.status = 'superseded';
                            usedPerfInfo = perfInfo;
                            perfInfo.outputLength = newOutput.length;
                            perfStatus = 'used';
                        }
                        else
                            perfStatus = 'incomplete';
                    }
                    perfInfo.status = perfStatus;
                    perfInfoList.push(perfInfo);
                },
                this
            );
            return output;
        },
        
        createCharCodesEncoding: function (charCodeArrayStr, long, radix)
        {
            var output;
            var fromCharCode = this.findDefinition(FROM_CHAR_CODE);
            if (radix)
            {
                output =
                    this.createLongCharCodesOutput(
                        charCodeArrayStr,
                        fromCharCode,
                        'parseInt(undefined,' + radix + ')'
                    );
            }
            else
            {
                if (long)
                {
                    output =
                        this.createLongCharCodesOutput(charCodeArrayStr, fromCharCode, 'undefined');
                }
                else
                {
                    output =
                        this.resolveConstant('Function') +
                        '(' +
                        this.replaceString('return String.' + fromCharCode + '(') +
                        '+' +
                        charCodeArrayStr +
                        '+' +
                        this.replaceString(')') +
                        ')()';
                }
            }
            return output;
        },
        
        createCharKeyArrayString: function (input, charMap, maxLength)
        {
            var charKeyArray =
                array_prototype_map.call(
                    input,
                    function (char)
                    {
                        var charKey = charMap[char];
                        return charKey;
                    }
                );
            var charKeyArrayStr = this.replaceFalseFreeArray(charKeyArray, maxLength);
            return charKeyArrayStr;
        },
        
        createDictEncoding: function (
            legend,
            charIndexArrayStr,
            maxLength,
            radix,
            amendings,
            coerceToInt)
        {
            var mapper;
            if (radix)
            {
                var parseIntArg;
                if (amendings)
                {
                    var firstDigit = radix - amendings;
                    var createParseIntArg;
                    if (amendings > 2)
                        createParseIntArg = this.findDefinition(CREATE_PARSE_INT_ARG);
                    else
                        createParseIntArg = createParseIntArgDefault;
                    parseIntArg = createParseIntArg(amendings, firstDigit);
                }
                else
                    parseIntArg = 'undefined';
                if (coerceToInt)
                    parseIntArg = '+' + parseIntArg;
                var formatter = this.findDefinition(MAPPER_FORMATTER);
                mapper = formatter('[parseInt(' + parseIntArg + ',' + radix + ')]');
            }
            else
                mapper = '"".charAt.bind';
            var output =
                this.createJSFuckArrayMapping(charIndexArrayStr, mapper, legend) + '[' +
                this.replaceString('join') + ']([])';
            if (!(output.length > maxLength))
                return output;
        },
        
        createJSFuckArrayMapping: function (arrayStr, mapper, legend)
        {
            var result =
                arrayStr + '[' + this.replaceString('map') + '](' + this.replaceExpr(mapper) + '(' +
                legend + '))';
            return result;
        },
        
        createLongCharCodesOutput: function (charCodeArrayStr, fromCharCode, arg)
        {
            var formatter = this.findDefinition(FROM_CHAR_CODE_CALLBACK_FORMATTER);
            var callback = formatter(fromCharCode, arg);
            var output =
                charCodeArrayStr + '[' + this.replaceString('map') + '](' +
                this.replaceExpr('Function("return ' + callback + '")()') + ')[' +
                this.replaceString('join') + ']([])';
            return output;
        },
        
        encodeAndWrapText: function (input, wrapper, codingName, maxLength)
        {
            var output;
            if (!wrapper || input)
            {
                output = this.encodeText(input, false, !wrapper, codingName, maxLength);
                if (output == null)
                    return;
            }
            else
                output = '';
            if (wrapper)
                output = wrapper.call(this, output);
            if (!(output.length > maxLength))
                return output;
        },
        
        encodeByCharCodes: function (input, long, radix, maxLength)
        {
            var cache = new Empty();
            var charCodeArray =
                array_prototype_map.call(
                    input,
                    function (char)
                    {
                        var charCode =
                            cache[char] || (cache[char] = char.charCodeAt().toString(radix));
                        return charCode;
                    }
                );
            var charCodeArrayStr = this.replaceFalseFreeArray(charCodeArray, maxLength);
            if (charCodeArrayStr)
            {
                var output = this.createCharCodesEncoding(charCodeArrayStr, long, radix);
                if (!(output.length > maxLength))
                    return output;
            }
        },
        
        encodeByDblDict: function (inputData, maxLength)
        {
            var input = inputData.valueOf();
            var freqList = getFrequencyList(inputData);
            var charMap = new Empty();
            var minCharIndexArrayStrLength = initMinCharIndexArrayStrLength(input);
            var figures =
                freqList.map(
                    function (freq, index)
                    {
                        var figure = getFigure(index);
                        charMap[freq.char] = figure;
                        minCharIndexArrayStrLength += freq.count * figure.sortLength;
                        return figure;
                    }
                );
            var dictChars =
                freqList.map(
                    function (freq)
                    {
                        return freq.char;
                    }
                );
            var legend = this.encodeDictLegend(dictChars, maxLength - minCharIndexArrayStrLength);
            if (!legend)
                return;
            var figureMaxLength = maxLength - legend.length;
            var figureLegend =
                this.replaceFalseFreeArray(figures, figureMaxLength - minCharIndexArrayStrLength);
            if (!figureLegend)
                return;
            var keyFigureArrayStr =
                this.createCharKeyArrayString(
                    input,
                    charMap,
                    figureMaxLength - figureLegend.length
                );
            if (!keyFigureArrayStr)
                return;
            var formatter = this.findDefinition(MAPPER_FORMATTER);
            var mapper = formatter('.indexOf(undefined)');
            var charIndexArrayStr =
                this.createJSFuckArrayMapping(keyFigureArrayStr, mapper, figureLegend);
            var output = this.createDictEncoding(legend, charIndexArrayStr, maxLength);
            return output;
        },
        
        encodeByDict: function (inputData, radix, amendings, maxLength)
        {
            var APPEND_LENGTH_OF_DIGIT_ZERO = 6;
            var APPEND_LENGTH_OF_PLUS_SIGN = 71;
            
            var input = inputData.valueOf();
            var freqList = getFrequencyList(inputData);
            var coerceToInt =
                freqList.length &&
                freqList[0].count * APPEND_LENGTH_OF_DIGIT_ZERO > APPEND_LENGTH_OF_PLUS_SIGN;
            var reindexMap = createReindexMap(freqList.length, radix, amendings, coerceToInt);
            var charMap = new Empty();
            var minCharIndexArrayStrLength = initMinCharIndexArrayStrLength(input);
            var dictChars = [];
            freqList.forEach(
                function (freq, index)
                {
                    var reindex = reindexMap[index];
                    var char = freq.char;
                    charMap[char] = reindex;
                    minCharIndexArrayStrLength += freq.count * reindex.sortLength;
                    dictChars[reindex.index] = char;
                }
            );
            var legend = this.encodeDictLegend(dictChars, maxLength - minCharIndexArrayStrLength);
            if (!legend)
                return;
            var charIndexArrayStr =
                this.createCharKeyArrayString(input, charMap, maxLength - legend.length);
            if (!charIndexArrayStr)
                return;
            var output =
                this.createDictEncoding(
                    legend,
                    charIndexArrayStr,
                    maxLength,
                    radix,
                    amendings,
                    coerceToInt
                );
            return output;
        },
        
        encodeDictLegend: function (dictChars, maxLength)
        {
            if (!(maxLength < 0))
            {
                var input = dictChars.join('');
                var output =
                    this.callCoders(
                        input,
                        { forceString: true },
                        ['byCharCodesRadix4', 'byCharCodes', 'plain'],
                        'legend'
                    );
                if (output && !(output.length > maxLength))
                    return output;
            }
        },
        
        encodeExpress: function (input, maxLength)
        {
            var unit = expressParse(input);
            if (unit)
            {
                var output;
                if (unit === true)
                {
                    if (!(maxLength < 0))
                        output = '';
                }
                else
                    output = this.replaceExpressUnit(unit, false, [], maxLength, REPLACERS);
                return output;
            }
        },
        
        encodeText: function (input, bond, forceString, codingName, maxLength)
        {
            var output =
                this.callCoders(
                    input,
                    { forceString: forceString, bond: bond },
                    [
                        'byDblDict',
                        'byDictRadix5AmendedBy3',
                        'byDictRadix4AmendedBy2',
                        'byDictRadix4AmendedBy1',
                        'byDictRadix3',
                        'byDictRadix4',
                        'byDict',
                        'byCharCodesRadix4',
                        'byCharCodes',
                        'plain'
                    ],
                    codingName
                );
            if (output != null && !(output.length > maxLength))
                return output;
        },
        
        exec: function (input, wrapper, coderNames, perfInfo)
        {
            var codingLog = this.codingLog = [];
            var output = this.callCoders(input, { wrapper: wrapper }, coderNames);
            if (perfInfo)
                perfInfo.codingLog = codingLog;
            delete this.codingLog;
            if (output == null)
                throw new Error('Encoding failed');
            return output;
        },
        
        // Replaces a JavaScript array with a JSFuck array of strings.
        // Array elements may only contain characters with static definitions in their string
        // representations and may not contain the substring "false", because the value false is
        // used as a separator in the encoding.
        replaceFalseFreeArray: function (array, maxLength)
        {
            var str = array.join(false);
            var replacement = this.replaceStaticString(str, maxLength);
            if (replacement)
            {
                var result =
                    replacement + '[' + this.replaceString('split') + '](' +
                    this.replaceExpr('false') + ')';
                if (!(result.length > maxLength))
                    return result;
            }
        },
    };
    
    assignNoEnum(Encoder.prototype, encoderProtoSource);
    
    var REPLACERS =
    {
        identifier:
        function (encoder, identifier, bondStrength, unitIndices, maxLength)
        {
            var codingName = getCodingName(unitIndices);
            var replacement =
                encoder.encodeAndWrapText(
                    'return ' + identifier,
                    wrapWithCall,
                    codingName,
                    maxLength
                );
            return replacement;
        },
        string:
        function (encoder, str, bond, forceString, unitIndices, maxLength)
        {
            var codingName = getCodingName(unitIndices);
            var replacement = encoder.encodeText(str, bond, forceString, codingName, maxLength);
            return replacement;
        }
    };
    
    wrapWithCall =
        function (str)
        {
            return this.resolveConstant('Function') + '(' + str + ')()';
        };
    
    wrapWithEval =
        function (str)
        {
            return this.replaceExpr('Function("return eval")()') + '(' + str + ')';
        };
}
)();
