/*
global
AMENDINGS,
CHARACTERS,
COMPLEX,
CONSTANTS,
CREATE_PARSE_INT_ARG,
DEFAULT_CHARACTER_ENCODER,
FROM_CHAR_CODE,
FROM_CHAR_CODE_CALLBACK_FORMATTER,
JSFUCK_INFINITY,
LEVEL_STRING,
MAPPER_FORMATTER,
OPTIMAL_B,
SIMPLE,
Empty,
ScrewBuffer,
array_isArray,
array_prototype_forEach,
array_prototype_map,
assignNoEnum,
createConstructor,
createParseIntArgDefault,
createSolution,
expressParse,
getAppendLength,
getFigure,
hasOuterPlus,
maskIncludes,
object_keys
*/

var CODERS;

var Encoder;

var replaceIndexer;
var resolveSimple;
var wrapWithCall;
var wrapWithEval;

(function ()
{
    var STATIC_CHAR_CACHE = new Empty();
    var STATIC_CONST_CACHE = new Empty();
    
    var quoteString = JSON.stringify;
    
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
            Math.max((input.length - 1) * (SIMPLE.false.length + 1) - 3, 0);
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
    
    var CharCache = createConstructor(STATIC_CHAR_CACHE);
    var ConstCache = createConstructor(STATIC_CONST_CACHE);
    
    Encoder =
        function (mask)
        {
            this.mask = mask;
            this.charCache = new CharCache();
            this.complexCache = new Empty();
            this.constCache = new ConstCache();
            this.stack = [];
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
            Object.keys(options).forEach(
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
        
        callResolver: function (stackName, resolver)
        {
            var stack = this.stack;
            var stackIndex = stack.indexOf(stackName);
            stack.push(stackName);
            try
            {
                if (~stackIndex)
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
        
        createCharCodesEncoding: function (charCodeArrayStr, long, radix)
        {
            var output;
            var fromCharCode = this.findBestDefinition(FROM_CHAR_CODE);
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
                        this.replaceIdentifier('Function') +
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
                        createParseIntArg = this.findBestDefinition(CREATE_PARSE_INT_ARG);
                    else
                        createParseIntArg = createParseIntArgDefault;
                    parseIntArg = createParseIntArg(amendings, firstDigit);
                }
                else
                    parseIntArg = 'undefined';
                if (coerceToInt)
                    parseIntArg = '+' + parseIntArg;
                var formatter = this.findBestDefinition(MAPPER_FORMATTER);
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
            var formatter = this.findBestDefinition(FROM_CHAR_CODE_CALLBACK_FORMATTER);
            var callback = formatter(fromCharCode, arg);
            var output =
                charCodeArrayStr + '[' + this.replaceString('map') + '](' +
                this.replaceExpr('Function("return ' + callback + '")()') + ')[' +
                this.replaceString('join') + ']([])';
            return output;
        },
        
        createStringTokenPattern: function ()
        {
            function filterCallback(complex)
            {
                var entries = COMPLEX[complex];
                var definition = this.findBestDefinition(entries);
                return definition;
            }
            
            function mapCallback(complex)
            {
                var str = complex + '|';
                return str;
            }
            
            var strTokenPattern =
                '(' + object_keys(SIMPLE).join('|') + ')|' +
                object_keys(COMPLEX).filter(filterCallback, this).map(mapCallback).join('') +
                '([\\s\\S])';
            this.strTokenPattern = strTokenPattern;
            return strTokenPattern;
        },
        
        defaultResolveCharacter: function (char)
        {
            var defaultCharacterEncoder = this.findBestDefinition(DEFAULT_CHARACTER_ENCODER);
            var solution = defaultCharacterEncoder.call(this, char);
            return solution;
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
            var formatter = this.findBestDefinition(MAPPER_FORMATTER);
            var mapper = formatter('.indexOf(undefined)');
            var charIndexArrayStr =
                this.createJSFuckArrayMapping(keyFigureArrayStr, mapper, figureLegend);
            var output = this.createDictEncoding(legend, charIndexArrayStr, maxLength);
            return output;
        },
        
        encodeByDict: function (inputData, radix, amendings, maxLength)
        {
            var input = inputData.valueOf();
            var freqList = getFrequencyList(inputData);
            var coerceToInt =
                freqList.length &&
                freqList[0].count * 6 > getAppendLength(STATIC_ENCODER.resolveCharacter('+'));
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
                    output = this.replaceExpressUnit(unit, false, [], maxLength, INPUT_REPLACERS);
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
        
        findBase64AlphabetDefinition: function (element)
        {
            var definition;
            if (array_isArray(element))
                definition = this.findBestDefinition(element);
            else
                definition = element;
            return definition;
        },
        
        findBestDefinition: function (entries)
        {
            for (var entryIndex = entries.length; entryIndex--;)
            {
                var entry = entries[entryIndex];
                if (this.hasFeatures(entry.mask))
                    return entry.definition;
            }
        },
        
        findOptimalSolution: function (entries)
        {
            var result;
            entries.forEach(
                function (entry, entryIndex)
                {
                    if (this.hasFeatures(entry.mask))
                    {
                        var solution = this.resolve(entry.definition);
                        if (!result || result.length > solution.length)
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
        
        getPaddingBlock: function (paddingInfo, length)
        {
            var paddingBlock = paddingInfo.blocks[length];
            if (paddingBlock !== void 0)
                return paddingBlock;
            this.throwSyntaxError('Undefined padding block with length ' + length);
        },
        
        hasFeatures: function (mask)
        {
            var included = maskIncludes(this.mask, mask);
            return included;
        },
        
        hexCodeOf: function (charCode, length)
        {
            var optimalB = this.findBestDefinition(OPTIMAL_B);
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
            var unit = expressParse(expr);
            if (!unit)
                this.throwSyntaxError('Syntax error');
            var replacement = this.replaceExpressUnit(unit, false, [], NaN, DEFINITION_REPLACERS);
            return replacement;
        },
        
        replaceExpressUnit: function (unit, bond, unitIndices, maxLength, replacers)
        {
            var mods = unit.mods || '';
            var groupingRequired = bond && mods[0] === '+';
            var maxCoreLength = maxLength - (mods ? (groupingRequired ? 2 : 0) + mods.length : 0);
            var ops = unit.ops || [];
            var opCount = ops.length;
            var primaryExprBondStrength =
                opCount ?
                BOND_STRENGTH_STRONG : bond || mods ? BOND_STRENGTH_WEAK : BOND_STRENGTH_NONE;
            var output =
                this.replacePrimaryExpr(
                    unit,
                    primaryExprBondStrength,
                    unitIndices,
                    maxCoreLength,
                    replacers
                );
            if (output)
            {
                for (var index = 0; index < opCount; ++index)
                {
                    var op = ops[index];
                    var type = op.type;
                    if (type === 'call')
                    {
                        output += '()';
                        if (output.length > maxCoreLength)
                            return;
                    }
                    else
                    {
                        var opOutput;
                        var opUnitIndices = unitIndices.concat(index + 1);
                        var maxOpLength = maxCoreLength - output.length - 2;
                        var str = op.str;
                        if (str != null)
                        {
                            var strReplacer = replacers.string;
                            opOutput =
                                strReplacer(this, str, false, false, opUnitIndices, maxOpLength);
                        }
                        else
                        {
                            opOutput =
                                this.replaceExpressUnit(
                                    op,
                                    false,
                                    opUnitIndices,
                                    maxOpLength,
                                    replacers
                                );
                        }
                        if (!opOutput)
                            return;
                        if (type === 'get')
                            output += '[' + opOutput + ']';
                        else
                            output += '(' + opOutput + ')';
                    }
                }
                if (mods)
                {
                    output = mods + output;
                    if (groupingRequired)
                        output = '(' + output + ')';
                }
            }
            return output;
        },
        
        // Replaces a JavaScript array with a JSFuck array of strings.
        // Array elements may not contain "false" in their string representations, because the value
        // false is used as a separator for the encoding.
        replaceFalseFreeArray: function (array, maxLength)
        {
            var str = array.join(false);
            var replacement = this.replaceString(str, true, true, maxLength);
            if (replacement)
            {
                var result =
                    replacement + '[' + this.replaceString('split') + '](' +
                    this.replaceExpr('false') + ')';
                if (!(result.length > maxLength))
                    return result;
            }
        },
        
        replaceIdentifier: function (identifier, bondStrength)
        {
            var solution;
            if (identifier in this.constantDefinitions)
                solution = this.resolveConstant(identifier);
            else if (identifier in SIMPLE)
                solution = SIMPLE[identifier];
            if (!solution)
                this.throwSyntaxError('Undefined identifier ' + identifier);
            var groupingRequired =
                bondStrength && hasOuterPlus(solution) ||
                bondStrength > BOND_STRENGTH_WEAK && solution[0] === '!';
            var replacement = groupingRequired ? '(' + solution + ')' : solution + '';
            return replacement;
        },
        
        replacePrimaryExpr: function (unit, bondStrength, unitIndices, maxLength, replacers)
        {
            var output;
            var terms;
            var identifier;
            if (terms = unit.terms)
            {
                var count = terms.length;
                var maxCoreLength = maxLength - (bondStrength ? 2 : 0);
                for (var index = 0; index < count; ++index)
                {
                    var term = terms[index];
                    var termUnitIndices = count > 1 ? unitIndices.concat(index) : unitIndices;
                    var maxTermLength = maxCoreLength - 3 * (count - index - 1);
                    var termOutput =
                        this.replaceExpressUnit(
                            term,
                            index,
                            termUnitIndices,
                            maxTermLength,
                            replacers
                        );
                    if (!termOutput)
                        return;
                    output = index ? output + '+' + termOutput : termOutput;
                    maxCoreLength -= termOutput.length + 1;
                }
                if (bondStrength)
                    output = '(' + output + ')';
            }
            else if (identifier = unit.identifier)
            {
                var identifierReplacer = replacers.identifier;
                output =
                    identifierReplacer(this, identifier, bondStrength, unitIndices, maxLength);
            }
            else
            {
                var value = unit.value;
                if (typeof value === 'string')
                {
                    var strReplacer = replacers.string;
                    output = strReplacer(this, value, bondStrength, true, unitIndices, maxLength);
                }
                else if (array_isArray(value))
                {
                    if (value.length)
                    {
                        var replacement =
                            this.replaceExpressUnit(
                                value[0],
                                false,
                                unitIndices,
                                maxLength - 2,
                                replacers
                            );
                        if (replacement)
                            output = '[' + replacement + ']';
                    }
                    else if (!(maxLength < 2))
                        output = '[]';
                }
                else
                {
                    if (typeof value === 'number' && !isNaN(value))
                    {
                        var negative = value < 0 || 1 / value < 0;
                        var str;
                        var abs = Math.abs(value);
                        if (abs === Infinity)
                            str = JSFUCK_INFINITY;
                        else
                            str = (abs + '').replace(/^0(?=\.)|\+/g, '');
                        if (negative)
                            str = '-' + str;
                        if (/^\d$/.test(str))
                            output = STATIC_ENCODER.resolveCharacter(str) + '';
                        else
                            output = '+(' + STATIC_ENCODER.replaceString(str) + ')';
                        if (bondStrength)
                            output = '(' + output + ')';
                    }
                    else
                        output = STATIC_ENCODER.replaceIdentifier(value + '', bondStrength);
                    if (output.length > maxLength)
                        return;
                }
            }
            return output;
        },
        
        replaceString: function (str, bond, forceString, maxLength)
        {
            var buffer = new ScrewBuffer(bond, forceString, this.maxGroupThreshold);
            var strTokenPattern = this.strTokenPattern || this.createStringTokenPattern();
            var match;
            var regExp = RegExp(strTokenPattern, 'g');
            while (match = regExp.exec(str))
            {
                if (buffer.length > maxLength)
                    return;
                var token;
                var solution;
                if (token = match[2])
                    solution = this.resolveCharacter(token);
                else if (token = match[1])
                    solution = SIMPLE[token];
                else
                {
                    token = match[0];
                    solution = this.resolveComplex(token);
                }
                if (!buffer.append(solution))
                    return;
            }
            var result = buffer + '';
            if (!(result.length > maxLength))
                return result;
        },
        
        resolve: function (definition)
        {
            var solution;
            var type = typeof definition;
            if (type === 'function')
                solution = definition.call(this);
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
                    expr = definition;
                var replacement = this.replaceExpr(expr);
                solution = createSolution(replacement, level);
            }
            return solution;
        },
        
        resolveCharacter: function (char)
        {
            var solution = this.charCache[char];
            if (solution === void 0)
            {
                this.callResolver(
                    quoteString(char),
                    function ()
                    {
                        var charCache;
                        var entries = CHARACTERS[char];
                        if (!entries || array_isArray(entries))
                        {
                            if (entries)
                                solution = this.findOptimalSolution(entries);
                            if (!solution)
                                solution = this.defaultResolveCharacter(char);
                            charCache = this.charCache;
                        }
                        else
                        {
                            solution = STATIC_ENCODER.resolve(entries);
                            charCache = STATIC_CHAR_CACHE;
                        }
                        if (solution.level == null)
                            solution.level = LEVEL_STRING;
                        charCache[char] = solution;
                    }
                );
            }
            return solution;
        },
        
        resolveComplex: function (complex)
        {
            var solution = this.complexCache[complex];
            if (solution === void 0)
            {
                this.callResolver(
                    quoteString(complex),
                    function ()
                    {
                        var entries = COMPLEX[complex];
                        var definition = this.findBestDefinition(entries);
                        solution = this.resolve(definition);
                        if (solution.level == null)
                            solution.level = LEVEL_STRING;
                        this.complexCache[complex] = solution;
                    }
                );
            }
            return solution;
        },
        
        resolveConstant: function (constant)
        {
            var solution = this.constCache[constant];
            if (solution === void 0)
            {
                this.callResolver(
                    constant,
                    function ()
                    {
                        var constCache;
                        var entries = this.constantDefinitions[constant];
                        if (array_isArray(entries))
                        {
                            solution = this.findOptimalSolution(entries);
                            constCache = this.constCache;
                        }
                        else
                        {
                            solution = STATIC_ENCODER.resolve(entries);
                            constCache = STATIC_CONST_CACHE;
                        }
                        constCache[constant] = solution;
                    }
                );
            }
            return solution;
        },
        
        resolveExprAt: function (expr, index, entries, paddingInfos)
        {
            if (!entries)
                this.throwSyntaxError('Missing padding entries for index ' + index);
            var paddingDefinition = this.findBestDefinition(entries);
            var paddingBlock;
            var indexer;
            if (typeof paddingDefinition === 'number')
            {
                var paddingInfo = this.findBestDefinition(paddingInfos);
                paddingBlock = this.getPaddingBlock(paddingInfo, paddingDefinition);
                indexer = index + paddingDefinition + paddingInfo.shift;
            }
            else
            {
                paddingBlock = paddingDefinition.block;
                indexer = paddingDefinition.indexer;
            }
            var fullExpr = '(' + paddingBlock + '+' + expr + ')[' + indexer + ']';
            var replacement = this.replaceExpr(fullExpr);
            var solution = createSolution(replacement, LEVEL_STRING, false);
            return solution;
        },
        
        throwSyntaxError: function (message)
        {
            var stack = this.stack;
            var stackLength = stack.length;
            if (stackLength)
                message += ' in the definition of ' + stack[stackLength - 1];
            throw new SyntaxError(message);
        }
    };
    
    assignNoEnum(Encoder.prototype, encoderProtoSource);
    
    var BOND_STRENGTH_NONE      = 0;
    var BOND_STRENGTH_WEAK      = 1;
    var BOND_STRENGTH_STRONG    = 2;
    
    var DEFINITION_REPLACERS =
    {
        identifier: function (encoder, identifier, bondStrength)
        {
            var replacement = encoder.replaceIdentifier(identifier, bondStrength);
            return replacement;
        },
        string: function (encoder, str, bond, forceString)
        {
            var replacement = encoder.replaceString(str, bond, forceString);
            if (!replacement)
                encoder.throwSyntaxError('String too complex');
            return replacement;
        }
    };
    
    var INPUT_REPLACERS =
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
    
    var STATIC_ENCODER = new Encoder([0, 0]);
    
    replaceIndexer =
        function (index)
        {
            var replacement = '[' + STATIC_ENCODER.replaceString(index) + ']';
            return replacement;
        };
    
    resolveSimple =
        function (simple, definition)
        {
            var solution;
            STATIC_ENCODER.callResolver(
                simple,
                function ()
                {
                    solution = STATIC_ENCODER.resolve(definition);
                }
            );
            return solution;
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
