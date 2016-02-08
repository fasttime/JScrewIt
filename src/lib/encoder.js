/*
global
AMENDINGS,
CHARACTERS,
COMPLEX,
CONSTANTS,
CREATE_PARSE_INT_ARG,
DEFAULT_CHARACTER_ENCODER,
FROM_CHAR_CODE,
LEVEL_STRING,
OPTIMAL_B,
SIMPLE,
Empty,
ScrewBuffer,
assignNoEnum,
createConstructor,
createParseIntArgDefault,
createSolution,
getAppendLength,
getFigure,
hasOuterPlus,
isArray,
keys,
replaceDigit
*/

var CODERS;

var Encoder;

var replaceIndexer;
var resolveSimple;

(function ()
{
    'use strict';
    
    var STATIC_CHAR_CACHE = new Empty();
    var STATIC_CONST_CACHE = new Empty();
    
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
            45
        ),
        byDblDict: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDblDict(inputData, maxLength);
                return output;
            },
            411
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
            349
        ),
        byDictRadix4: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 4, 0, maxLength);
                return output;
            },
            258
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
            845
        ),
        plain: defineCoder
        (
            function (inputData, maxLength)
            {
                var input = inputData.valueOf();
                var output = this.replaceString(input, false, inputData.forceString, maxLength);
                return output;
            }
        ),
    };
    
    var quoteString = JSON.stringify;
    
    function createReindexMap(count, radix, amendings, coerceToInt)
    {
        function getSortLength()
        {
            var length = 0;
            Array.prototype.forEach.call(
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
                    reindex1.sortLength - reindex2.sortLength ||
                    reindex1.index - reindex2.index;
                return result;
            }
        );
        return range;
    }
    
    function defaultResolveCharacter(char)
    {
        var defaultCharacterEncoder = this.findBestDefinition(DEFAULT_CHARACTER_ENCODER);
        var solution = defaultCharacterEncoder.call(this, char);
        return solution;
    }
    
    function defineCoder(coder, minInputLength)
    {
        coder.MIN_INPUT_LENGTH = minInputLength;
        return coder;
    }
    
    function getFrequencyList(inputData)
    {
        var freqList = inputData.freqList;
        if (!freqList)
        {
            var charMap = new Empty();
            Array.prototype.forEach.call(
                inputData,
                function (char)
                {
                    ++(
                        charMap[char] ||
                        (charMap[char] = { char: char, charCode: char.charCodeAt(), count: 0 })
                    ).count;
                }
            );
            var charList = keys(charMap);
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
            Math.max((input.length - 1) * (SIMPLE['false'].length + 1) - 3, 0);
        return minCharIndexArrayStrLength;
    }
    
    function isFollowedByLeftSquareBracket(expr, offset)
    {
        for (;;)
        {
            var char = expr[offset++];
            if (char === '[')
                return true;
            if (char !== ' ')
                return false;
        }
    }
    
    function isPrecededByOperator(expr, offset)
    {
        for (;;)
        {
            var char = expr[--offset];
            if (char === '+' || char === '!')
                return true;
            if (char !== ' ')
                return false;
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
                replacement += '+[' + replaceDigit(+number[index]) + ']';
            if (length > 1)
                replacement = '+(' + replacement + ')';
            if (isStrongBoundRequired(expr, offset, wholeMatch))
                replacement = '(' + replacement + ')';
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
            replacement = this.replaceString(str, strongBound, true);
            if (!replacement)
                this.throwSyntaxError('String too complex');
        }
        else if (space)
            replacement = '';
        else if (literal)
        {
            var solution;
            if (literal in this.constantDefinitions)
                solution = this.resolveConstant(literal);
            else if (literal in SIMPLE)
                solution = SIMPLE[literal];
            if (!solution)
                this.throwSyntaxError('Undefined literal ' + literal);
            replacement =
                isStrongBoundRequired(expr, offset, wholeMatch) && hasOuterPlus(solution) ?
                '(' + solution + ')' : solution + '';
        }
        else
            this.throwSyntaxError('Unexpected character ' + quoteString(wholeMatch));
        return replacement;
    }
    
    var CharCache = createConstructor(STATIC_CHAR_CACHE);
    var ConstCache = createConstructor(STATIC_CONST_CACHE);
    
    Encoder =
        function (featureMask)
        {
            this.featureMask = featureMask;
            this.charCache = new CharCache();
            this.complexCache = new Empty();
            this.constCache = new ConstCache();
            this.stack = [];
        };
    
    var encoderProtoSource =
    {
        callCoders: function (input, forceString, coderNames, codingName)
        {
            var output;
            var inputLength = input.length;
            var codingLog = this.codingLog;
            var perfInfoList = [];
            perfInfoList.name = codingName;
            perfInfoList.inputLength = inputLength;
            codingLog.push(perfInfoList);
            var inputData = Object(input);
            inputData.forceString = forceString;
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
                        var maxLength = output != null ? output.length : undefined;
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
        
        createCharCodesEncoding: function (charCodeArrayStr, long, radix)
        {
            var output;
            var fromCharCode = this.findBestDefinition(FROM_CHAR_CODE);
            if (radix)
            {
                output =
                    charCodeArrayStr +
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
                        charCodeArrayStr +
                        this.replaceExpr(
                            '["map"](Function("return String.' + fromCharCode +
                            '(arguments[0])"))["join"]([])'
                        );
                }
                else
                {
                    output =
                        this.replaceExpr('Function("return String.' + fromCharCode + '(" +') +
                        charCodeArrayStr + this.replaceExpr('+ ")")()');
                }
            }
            return output;
        },
        
        createCharKeyArrayString: function (input, charMap, maxLength)
        {
            var charKeyArray =
                Array.prototype.map.call(
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
                    if (!createParseIntArg)
                        createParseIntArg = createParseIntArgDefault;
                    parseIntArg = createParseIntArg(amendings, firstDigit);
                }
                else
                    parseIntArg = 'arguments[0]';
                if (coerceToInt)
                    parseIntArg = '+' + parseIntArg;
                mapper =
                    'Function("return this[parseInt(' + parseIntArg + ',' + radix + ')]")["bind"]';
            }
            else
                mapper = '""["charAt"]["bind"]';
            var output =
                this.createJSFuckArrayMapping(charIndexArrayStr, mapper, legend) +
                this.replaceExpr('["join"]([])');
            if (!(output.length > maxLength))
                return output;
        },
        
        createJSFuckArrayMapping: function (arrayStr, mapper, legend)
        {
            var result =
                arrayStr + this.replaceExpr('["map"]') + '(' + this.replaceExpr(mapper) + '(' +
                legend + '))';
            return result;
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
            
            var stringTokenPattern =
                '(' + keys(SIMPLE).join('|') + ')|' +
                keys(COMPLEX).filter(filterCallback, this).map(mapCallback).join('') +
                '([^])';
            this.stringTokenPattern = stringTokenPattern;
            return stringTokenPattern;
        },
        
        encode: function (input, wrapWith)
        {
            var output =
                this.callCoders(
                    input,
                    wrapWith === 'none',
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
                    ]
                );
            if (output == null)
                throw new Error('Encoding failed');
            if (wrapWith === 'call')
                output = this.resolveConstant('Function') + '(' + output + ')()';
            else if (wrapWith === 'eval')
                output = this.replaceExpr('Function("return eval")()') + '(' + output + ')';
            return output;
        },
        
        encodeByCharCodes: function (input, long, radix, maxLength)
        {
            var cache = new Empty();
            var charCodeArray =
                Array.prototype.map.call(
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
            var charIndexArrayStr =
                this.createJSFuckArrayMapping(
                    keyFigureArrayStr,
                    'Function("return this.indexOf(arguments[0])")["bind"]',
                    figureLegend
                );
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
                        true,
                        ['byCharCodesRadix4', 'byCharCodes', 'plain'],
                        'legend'
                    );
                if (output && !(output.length > maxLength))
                    return output;
            }
        },
        
        findBase64AlphabetDefinition: function (element)
        {
            var definition;
            if (isArray(element))
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
                if (this.hasFeatures(entry.featureMask))
                    return entry.definition;
            }
        },
        
        findOptimalSolution: function (entries, defaultResolver)
        {
            var result;
            entries.forEach(
                function (entry, entryIndex)
                {
                    if (this.hasFeatures(entry.featureMask))
                    {
                        var definition = entry.definition;
                        var solution = definition ? this.resolve(definition) : defaultResolver();
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
            if (paddingBlock !== undefined)
                return paddingBlock;
            this.throwSyntaxError('Undefined padding block with length ' + length);
        },
        
        hasFeatures: function (featureMask)
        {
            return (featureMask & this.featureMask) === featureMask;
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
            var result =
                expr.replace(
                    /([0-9]+)|("(?:\\.|(?!").)*")|( +)|([$A-Z_a-z][$0-9A-Z_a-z]*)|[^!()+[\]]/g,
                    this.replaceToken || (this.replaceToken = replaceToken.bind(this))
                );
            return result;
        },
        
        // Replaces a JavaScript array with a JSFuck array or strings.
        // Array elements may not contain "false" in their string representations, because the value
        // false is used as a separator for the encoding.
        replaceFalseFreeArray: function (array, maxLength)
        {
            var str = array.join(false);
            var replacement = this.replaceString(str, true, true, maxLength);
            if (replacement)
            {
                var result = replacement + this.replaceExpr('["split"](false)');
                if (!(result.length > maxLength))
                    return result;
            }
        },
        
        replaceString: function (str, strongBound, forceString, maxLength)
        {
            var buffer = new ScrewBuffer(strongBound, forceString, this.maxGroupThreshold);
            var stringTokenPattern = this.stringTokenPattern || this.createStringTokenPattern();
            var match;
            var regExp = RegExp(stringTokenPattern, 'g');
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
            if (solution === undefined)
            {
                this.callResolver(
                    quoteString(char),
                    function ()
                    {
                        var charCache;
                        var entries = CHARACTERS[char];
                        if (!entries || isArray(entries))
                        {
                            var defaultResolver = defaultResolveCharacter.bind(this, char);
                            if (entries)
                                solution = this.findOptimalSolution(entries, defaultResolver);
                            if (!solution)
                                solution = defaultResolver();
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
            if (solution === undefined)
            {
                this.callResolver(
                    quoteString(complex),
                    function ()
                    {
                        var entries = COMPLEX[complex];
                        var definition = this.findBestDefinition(entries);
                        solution = this.resolve(definition);
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
            if (solution === undefined)
            {
                this.callResolver(
                    constant,
                    function ()
                    {
                        var constCache;
                        var entries = this.constantDefinitions[constant];
                        if (isArray(entries))
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
                indexer = replaceIndexer(index + paddingDefinition + paddingInfo.shift);
            }
            else
            {
                paddingBlock = paddingDefinition.block;
                indexer = '[' + this.replaceExpr(paddingDefinition.indexer) + ']';
            }
            var fullExpr = '(' + paddingBlock + '+' + expr + ')';
            var replacement = this.replaceExpr(fullExpr) + indexer;
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
    
    var STATIC_ENCODER = new Encoder();
    
    replaceIndexer =
        function (index)
        {
            var replacement =
                '[' + STATIC_ENCODER.replaceExpr(index > 9 ? '"' + index + '"' : index + '') + ']';
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
}
)();
