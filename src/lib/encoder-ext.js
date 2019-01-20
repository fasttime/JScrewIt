/*
global
AMENDINGS,
APPEND_LENGTH_OF_DIGITS,
APPEND_LENGTH_OF_DIGIT_0,
APPEND_LENGTH_OF_PLUS_SIGN,
CREATE_PARSE_INT_ARG,
FROM_CHAR_CODE,
FROM_CHAR_CODE_CALLBACK_FORMATTER,
MAPPER_FORMATTER,
OPTIMAL_RETURN_STRING,
SIMPLE,
Encoder,
_Array_prototype_forEach,
_Array_prototype_map,
_Date,
_Error,
_Math_max,
_Object,
_Object_keys,
_RegExp,
assignNoEnum,
createEmpty,
createFigurator,
createParseIntArgDefault,
expressParse,
replaceStaticString,
*/

var STRATEGIES;

var wrapWithCall;
var wrapWithEval;

(function ()
{
    function createReindexMap(count, radix, amendings, coerceToInt)
    {
        function getSortLength()
        {
            var length = 0;
            _Array_prototype_forEach.call
            (
                str,
                function (digit)
                {
                    length += digitAppendLengths[digit];
                }
            );
            return length;
        }

        var index;
        var digitAppendLengths = APPEND_LENGTH_OF_DIGITS.slice(0, radix || 10);
        var regExp;
        var replacer;
        if (amendings)
        {
            var firstDigit = radix - amendings;
            var pattern = '[';
            for (index = 0; index < amendings; ++index)
            {
                var digit = firstDigit + index;
                digitAppendLengths[digit] = SIMPLE[AMENDINGS[index]].appendLength;
                pattern += digit;
            }
            pattern += ']';
            regExp = _RegExp(pattern, 'g');
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
            var reindex = range[index] = _Object(reindexStr);
            reindex.sortLength = getSortLength();
            reindex.index = index;
        }
        range.sort
        (
            function (reindex1, reindex2)
            {
                var result =
                reindex1.sortLength - reindex2.sortLength || reindex1.index - reindex2.index;
                return result;
            }
        );
        return range;
    }

    function defineStrategy(strategy, minInputLength)
    {
        strategy.MIN_INPUT_LENGTH = minInputLength;
        return strategy;
    }

    function getDenseFigureLegendDelimiters(figurator, figures)
    {
        var delimiters = [FALSE_TRUE_DELIMITER];
        var lastFigure = figurator(figures.length - 1);
        var joiner = lastFigure.joiner;
        if (joiner != null)
            delimiters.push({ joiner: joiner, separator: joiner });
        return delimiters;
    }

    function getFrequencyList(inputData)
    {
        var freqList = inputData.freqList;
        if (!freqList)
        {
            var charMap = createEmpty();
            _Array_prototype_forEach.call
            (
                inputData,
                function (char)
                {
                    (
                        charMap[char] ||
                        (charMap[char] = { char: char, charCode: char.charCodeAt(), count: 0 })
                    )
                    .count++;
                }
            );
            var charList = _Object_keys(charMap);
            inputData.freqList =
            freqList =
            charList.map
            (
                function (char)
                {
                    var freq = charMap[char];
                    return freq;
                }
            )
            .sort
            (
                function (freq1, freq2)
                {
                    var diff = freq2.count - freq1.count || freq1.charCode - freq2.charCode;
                    return diff;
                }
            );
        }
        return freqList;
    }

    function getSparseFigureLegendDelimiters()
    {
        var delimiters = [FALSE_FREE_DELIMITER];
        return delimiters;
    }

    // The unit path consists of the string of colon-separated unit indices.
    function getUnitPath(unitIndices)
    {
        var unitPath = unitIndices.length ? unitIndices.join(':') : '0';
        return unitPath;
    }

    function initMinFalseFreeCharIndexArrayStrLength(input)
    {
        var minCharIndexArrayStrLength =
        _Math_max((input.length - 1) * (SIMPLE.false.length + 1) - 3, 0);
        return minCharIndexArrayStrLength;
    }

    function initMinFalseTrueCharIndexArrayStrLength()
    {
        return -1;
    }

    STRATEGIES =
    {
        /* -------------------------------------------------------------------------------------- *\

        Encodes "NINE" as:

        Function("return String.fromCharCode(" + [78, 73, 78, 69] + ")")()

        (short version)

        Or:

        [78, 73, 78, 69].map(Function(
        "return function(undefined){return String.fromCharCode(undefined)}")()).join([])

        (long version)

        \* -------------------------------------------------------------------------------------- */

        byCharCodes:
        defineStrategy
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

        /* -------------------------------------------------------------------------------------- *\

        Encodes "NINE" as:

        [1032, 1021, 1032, 1011].map(Function(
        "return function(undefined){return String.fromCharCode(parseInt(undefined,4))}")()).join([])

        \* -------------------------------------------------------------------------------------- */

        byCharCodesRadix4:
        defineStrategy
        (
            function (inputData, maxLength)
            {
                var input = inputData.valueOf();
                var output = this.encodeByCharCodes(input, undefined, 4, maxLength);
                return output;
            },
            31
        ),

        /* -------------------------------------------------------------------------------------- *\

        Encodes "NINE" as:

        ["false", "false0", "false", "true"].map(Function(
        "return function(undefined){return this.indexOf(undefined)}")().bind(["false", "true",
        "false0"])).map("".charAt.bind("NEI")).join([])

        \* -------------------------------------------------------------------------------------- */

        byDenseFigures:
        defineStrategy
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDenseFigures(inputData, maxLength);
                return output;
            },
            2224
        ),

        /* -------------------------------------------------------------------------------------- *\

        Encodes "NINE" as:

        [0, 2, 0, 1].map("".charAt.bind("NEI")).join([])

        \* -------------------------------------------------------------------------------------- */

        byDict:
        defineStrategy
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, undefined, undefined, maxLength);
                return output;
            },
            3
        ),

        /* -------------------------------------------------------------------------------------- *\

        Encodes "THREE" as:

        [10, 1, 2, 0, 0].map(Function(
        "return function(undefined){return this[parseInt(undefined,3)]}")().bind("EHRT")).join([])

        (simple)

        Or:

        [10, 1, 2, [], []].map(Function(
        "return function(undefined){return this[parseInt(+undefined,3)]}")().bind("EHRT")).join([])

        (with coercion)

        \* -------------------------------------------------------------------------------------- */

        byDictRadix3:
        defineStrategy
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 3, 0, maxLength);
                return output;
            },
            240
        ),

        /* -------------------------------------------------------------------------------------- *\

        Encodes "TWELVE" as:

        [2, 3, 0, 1, 10, 0].map(Function(
        "return function(undefined){return this[parseInt(undefined,4)]}")().bind("ELTWV")).join([])

        (simple)

        Or:

        [2, 3, [], 1, 10, []].map(Function(
        "return function(undefined){return this[parseInt(+undefined,4)]}")().bind("ELTWV")).join([])

        (with coercion)

        \* -------------------------------------------------------------------------------------- */

        byDictRadix4:
        defineStrategy
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 4, 0, maxLength);
                return output;
            },
            177
        ),

        /* -------------------------------------------------------------------------------------- *\

        Encodes "TWELVE" as:

        ["1", "10", "true", "0", "2", "true"].map(Function(
        "return function(undefined){return this[parseInt(undefined.replace(/true/g,3),4)]}")().bind(
        "LTVEW")).join([])

        (simple)

        Or:

        ["1", "10", "", "true", "2", ""].map(Function(
        "return function(undefined){return this[parseInt(+undefined.replace(/true/g,3),4)]}")().bind
        ("ETVLW")).join([])

        (with coercion)

        \* -------------------------------------------------------------------------------------- */

        byDictRadix4AmendedBy1:
        defineStrategy
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 4, 1, maxLength);
                return output;
            },
            312
        ),

        /* -------------------------------------------------------------------------------------- *\

        Encodes "TWELVE" as:

        ["undefined", "10", "true", "0", "1", "true"].map(Function(
        "return function(undefined){return this[parseInt(undefined.replace(/true/g,2).replace(/un" +
        "defined/g,3),4)]}")().bind("LVETW")).join([])

        (simple)

        Or:

        ["undefined", "10", "", "true", "1", ""].map(Function(
        "return function(undefined){return this[parseInt(+undefined.replace(/true/g,2).replace(/u" +
        "ndefined/g,3),4)]}")().bind("EVLTW")).join([])

        (with coercion)

        \* -------------------------------------------------------------------------------------- */

        byDictRadix4AmendedBy2:
        defineStrategy
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 4, 2, maxLength);
                return output;
            },
            560
        ),

        /* -------------------------------------------------------------------------------------- *\

        Encodes "SIXTEEN" as:

        ["1", "0", "10", "2", "true", "true", "undefined"].map(Function(
        "return function(undefined){return this[parseInt(undefined.replace(/true/g,3).replace(/un" +
        "defined/g,4),5)]}")().bind("ISTENX")).join([])

        (simple)

        Or:

        ["1", "true", "10", "2", "", "", "undefined"].map(Function(
        "return function(undefined){return this[parseInt(+undefined.replace(/true/g,3).replace(/u" +
        "ndefined/g,4),5)]}")().bind("ESTINX")).join([])

        (with coercion)

        \* -------------------------------------------------------------------------------------- */

        byDictRadix5AmendedBy2:
        defineStrategy
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 5, 2, maxLength);
                return output;
            },
            756
        ),

        /* -------------------------------------------------------------------------------------- *\

        Encodes "SIXTEEN" as:

        ["1", "0", "10", "NaN", "true", "true", "undefined"].map(Function(
        "return function(undefined){return this[parseInt([/true/g,/undefined/g,/NaN/g].reduce(fun" +
        "ction(f,a,l,s,e){return f.replace(a,2+l)},undefined),5)]}")().bind("ISENTX")).join([])

        (simple)

        Or:

        ["1", "true", "10", "NaN", "", "", "undefined"].map(Function(
        "return function(undefined){return this[parseInt(+[/true/g,/undefined/g,/NaN/g].reduce(fu" +
        "nction(f,a,l,s,e){return f.replace(a,2+l)},undefined),5)]}")().bind("ESINTX")).join([])

        (with coercion)

        \* -------------------------------------------------------------------------------------- */

        byDictRadix5AmendedBy3:
        defineStrategy
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 5, 3, maxLength);
                return output;
            },
            742
        ),

        /* -------------------------------------------------------------------------------------- *\

        Encodes "NINE" as:

        ["", "0", "", "true"].map(Function(
        "return function(undefined){return this.indexOf(undefined)}")().bind(["", "true", "0"])).map
        ("".charAt.bind("NEI")).join([])

        \* -------------------------------------------------------------------------------------- */

        bySparseFigures:
        defineStrategy
        (
            function (inputData, maxLength)
            {
                var output = this.encodeBySparseFigures(inputData, maxLength);
                return output;
            },
            328
        ),

        /* -------------------------------------------------------------------------------------- *\

        Encodes any JavaScript expression recognized by the express parser.

        \* -------------------------------------------------------------------------------------- */

        express:
        defineStrategy
        (
            function (inputData, maxLength)
            {
                var input = inputData.valueOf();
                var output = this.encodeExpress(input, maxLength);
                return output;
            }
        ),

        /* -------------------------------------------------------------------------------------- *\

        Encodes any text as a string using only the mininal set of optimizations.

        \* -------------------------------------------------------------------------------------- */

        plain:
        defineStrategy
        (
            function (inputData, maxLength)
            {
                var input = inputData.valueOf();
                var options =
                {
                    bond:           inputData.bond,
                    forceString:    inputData.forceString,
                    maxLength:      maxLength,
                    optimize:       true,
                };
                var output = this.replaceString(input, options);
                return output;
            }
        ),

        /* -------------------------------------------------------------------------------------- *\

        Encodes any text by trying out all plausible strategies.

        \* -------------------------------------------------------------------------------------- */

        text:
        defineStrategy
        (
            function (inputData, maxLength)
            {
                var input = inputData.valueOf();
                var wrapper = inputData.wrapper;
                var output = this.encodeAndWrapText(input, wrapper, undefined, maxLength);
                return output;
            }
        ),
    };

    var protoSource =
    {
        callGetFigureLegendDelimiters:
        function (getFigureLegendDelimiters, figurator, figures)
        {
            var figureLegendDelimiters = getFigureLegendDelimiters(figurator, figures);
            return figureLegendDelimiters;
        },

        callStrategies:
        function (input, options, strategyNames, unitPath)
        {
            var output;
            var inputLength = input.length;
            var perfLog = this.perfLog;
            var perfInfoList = [];
            perfInfoList.name = unitPath;
            perfInfoList.inputLength = inputLength;
            perfLog.push(perfInfoList);
            var inputData = _Object(input);
            _Object_keys(options).forEach
            (
                function (optName)
                {
                    inputData[optName] = options[optName];
                }
            );
            var usedPerfInfo;
            strategyNames.forEach
            (
                function (strategyName)
                {
                    var strategy = STRATEGIES[strategyName];
                    var perfInfo = { strategyName: strategyName };
                    var perfStatus;
                    if (inputLength < strategy.MIN_INPUT_LENGTH)
                        perfStatus = 'skipped';
                    else
                    {
                        this.perfLog = perfInfo.perfLog = [];
                        var before = new _Date();
                        var maxLength = output != null ? output.length : NaN;
                        var newOutput = strategy.call(this, inputData, maxLength);
                        var time = new _Date() - before;
                        this.perfLog = perfLog;
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

        createCharCodesEncoding:
        function (charCodeArrayStr, long, radix)
        {
            var output;
            var fromCharCode = this.findDefinition(FROM_CHAR_CODE);
            if (radix)
            {
                output =
                this.createLongCharCodesOutput
                (charCodeArrayStr, fromCharCode, 'parseInt(undefined,' + radix + ')');
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
                    var returnString = this.findDefinition(OPTIMAL_RETURN_STRING);
                    var str = returnString + '.' + fromCharCode + '(';
                    output =
                    this.resolveConstant('Function') +
                    '(' +
                    this.replaceString(str, { optimize: true }) +
                    '+' +
                    charCodeArrayStr +
                    '+' +
                    this.resolveCharacter(')') +
                    ')()';
                }
            }
            return output;
        },

        createCharKeyArrayString:
        function (input, charMap, delimiters, forceString, maxLength)
        {
            var charKeyArray =
            _Array_prototype_map.call
            (
                input,
                function (char)
                {
                    var charKey = charMap[char];
                    return charKey;
                }
            );
            var charKeyArrayStr =
            this.replaceStringArray(charKeyArray, delimiters, forceString, maxLength);
            return charKeyArrayStr;
        },

        createDictEncoding:
        function (legend, charIndexArrayStr, maxLength, radix, amendings, coerceToInt)
        {
            var mapper;
            if (radix)
            {
                var parseIntArg;
                if (amendings)
                {
                    var firstDigit = radix - amendings;
                    var createParseIntArg =
                    createParseIntArg = this.getCreateParseIntArg(amendings);
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

        createJSFuckArrayMapping:
        function (arrayStr, mapper, legend)
        {
            var result =
            arrayStr + '[' + this.replaceString('map', { optimize: true }) + '](' +
            this.replaceExpr(mapper, true) + '(' + legend + '))';
            return result;
        },

        createLongCharCodesOutput:
        function (charCodeArrayStr, fromCharCode, arg)
        {
            var formatter = this.findDefinition(FROM_CHAR_CODE_CALLBACK_FORMATTER);
            var formatterExpr = formatter(fromCharCode, arg);
            var output =
            charCodeArrayStr + '[' + this.replaceString('map', { optimize: true }) + '](' +
            this.replaceExpr('Function("return ' + formatterExpr + '")()', true) + ')[' +
            this.replaceString('join') + ']([])';
            return output;
        },

        encodeAndWrapText:
        function (input, wrapper, unitPath, maxLength)
        {
            var output;
            if (!wrapper || input)
            {
                var forceString = !wrapper || wrapper.forceString;
                output = this.encodeText(input, false, forceString, unitPath, maxLength);
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

        encodeByCharCodes:
        function (input, long, radix, maxLength)
        {
            var cache = createEmpty();
            var charCodeArray =
            _Array_prototype_map.call
            (
                input,
                function (char)
                {
                    var charCode = cache[char] || (cache[char] = char.charCodeAt().toString(radix));
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

        encodeByDblDict:
        function
        (
            initMinCharIndexArrayStrLength,
            figurator,
            getFigureLegendDelimiters,
            keyFigureArrayDelimiters,
            inputData,
            maxLength
        )
        {
            var input = inputData.valueOf();
            var freqList = getFrequencyList(inputData);
            var charMap = createEmpty();
            var minCharIndexArrayStrLength = initMinCharIndexArrayStrLength(input);
            var figures =
            freqList.map
            (
                function (freq, index)
                {
                    var figure = figurator(index);
                    charMap[freq.char] = figure;
                    minCharIndexArrayStrLength += freq.count * figure.sortLength;
                    return figure;
                }
            );
            var dictChars =
            freqList.map
            (
                function (freq)
                {
                    return freq.char;
                }
            );
            var legend = this.encodeDictLegend(dictChars, maxLength - minCharIndexArrayStrLength);
            if (!legend)
                return;
            var figureLegendDelimiters =
            this.callGetFigureLegendDelimiters(getFigureLegendDelimiters, figurator, figures);
            var figureMaxLength = maxLength - legend.length;
            var figureLegend =
            this.replaceStringArray
            (figures, figureLegendDelimiters, true, figureMaxLength - minCharIndexArrayStrLength);
            if (!figureLegend)
                return;
            var keyFigureArrayStr =
            this.createCharKeyArrayString
            (input, charMap, keyFigureArrayDelimiters, true, figureMaxLength - figureLegend.length);
            if (!keyFigureArrayStr)
                return;
            var formatter = this.findDefinition(MAPPER_FORMATTER);
            var mapper = formatter('.indexOf(undefined)');
            var charIndexArrayStr =
            this.createJSFuckArrayMapping(keyFigureArrayStr, mapper, figureLegend);
            var output = this.createDictEncoding(legend, charIndexArrayStr, maxLength);
            return output;
        },

        encodeByDenseFigures:
        function (inputData, maxLength)
        {
            var output =
            this.encodeByDblDict
            (
                initMinFalseTrueCharIndexArrayStrLength,
                falseTrueFigurator,
                getDenseFigureLegendDelimiters,
                [FALSE_TRUE_DELIMITER],
                inputData,
                maxLength
            );
            return output;
        },

        encodeByDict:
        function (inputData, radix, amendings, maxLength)
        {
            var input = inputData.valueOf();
            var freqList = getFrequencyList(inputData);
            var freqListLength = freqList.length;
            var coerceToInt =
            freqListLength &&
            freqList[0].count * APPEND_LENGTH_OF_DIGIT_0 > APPEND_LENGTH_OF_PLUS_SIGN;
            var reindexMap = createReindexMap(freqListLength, radix, amendings, coerceToInt);
            var charMap = createEmpty();
            var minCharIndexArrayStrLength = initMinFalseFreeCharIndexArrayStrLength(input);
            var dictChars = [];
            freqList.forEach
            (
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
            this.createCharKeyArrayString
            (input, charMap, [FALSE_FREE_DELIMITER], amendings, maxLength - legend.length);
            if (!charIndexArrayStr)
                return;
            var output =
            this.createDictEncoding
            (legend, charIndexArrayStr, maxLength, radix, amendings, coerceToInt);
            return output;
        },

        encodeBySparseFigures:
        function (inputData, maxLength)
        {
            var output =
            this.encodeByDblDict
            (
                initMinFalseFreeCharIndexArrayStrLength,
                falseFreeFigurator,
                getSparseFigureLegendDelimiters,
                [FALSE_FREE_DELIMITER],
                inputData,
                maxLength
            );
            return output;
        },

        encodeDictLegend:
        function (dictChars, maxLength)
        {
            if (!(maxLength < 0))
            {
                var input = dictChars.join('');
                var output =
                this.callStrategies
                (
                    input,
                    { forceString: true },
                    ['byCharCodesRadix4', 'byCharCodes', 'plain'],
                    'legend'
                );
                if (output && !(output.length > maxLength))
                    return output;
            }
        },

        encodeExpress:
        function (input, maxLength)
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

        encodeText:
        function (input, bond, forceString, unitPath, maxLength)
        {
            var output =
            this.callStrategies
            (
                input,
                { forceString: forceString, bond: bond },
                [
                    'byDenseFigures',
                    'bySparseFigures',
                    'byDictRadix5AmendedBy3',
                    'byDictRadix5AmendedBy2',
                    'byDictRadix4AmendedBy2',
                    'byDictRadix4AmendedBy1',
                    'byDictRadix3',
                    'byDictRadix4',
                    'byDict',
                    'byCharCodesRadix4',
                    'byCharCodes',
                    'plain',
                ],
                unitPath
            );
            if (output != null && !(output.length > maxLength))
                return output;
        },

        exec:
        function (input, wrapper, strategyNames, perfInfo)
        {
            var perfLog = this.perfLog = [];
            var output = this.callStrategies(input, { wrapper: wrapper }, strategyNames);
            if (perfInfo)
                perfInfo.perfLog = perfLog;
            delete this.perfLog;
            if (output == null)
                throw new _Error('Encoding failed');
            return output;
        },

        getCreateParseIntArg:
        function (amendings)
        {
            var createParseIntArg;
            if (amendings > 2)
                createParseIntArg = this.findDefinition(CREATE_PARSE_INT_ARG);
            else
                createParseIntArg = createParseIntArgDefault;
            return createParseIntArg;
        },

        // Array elements may not contain the substring "false", because the value false could
        // be used as a separator in the encoding.
        replaceFalseFreeArray:
        function (array, maxLength)
        {
            var result = this.replaceStringArray(array, [FALSE_FREE_DELIMITER], false, maxLength);
            return result;
        },

        replaceJoinedArrayString:
        function (str, maxLength)
        {
            var options = { bond: true, forceString: true, maxLength: maxLength };
            var replacement = replaceStaticString(str, options);
            return replacement;
        },

        /**
         * Replaces a given array of strings with equivalent JSFuck code.
         *
         * Array elements may only contain characters with static definitions in their string
         * representations.
         *
         * @function Encoder#replaceStringArray
         *
         * @param {string[]} array
         * The string array to replace. Empty arrays are not supported.
         *
         * @param {object[]} delimiters
         * An array of delimiters.
         *
         * Each delimiter has two string properties: a `joiner` and a `separator`.
         *
         * The encoder can insert a joiner between any two adjacent elements to mark the boundary
         * between them. The splitter is an express-parsable expression used to split the
         * concatenated string back into its elements. It can be any expression evaluating to the
         * same value as the joiner, or to a regular expression.
         *
         * At most one delimiter will be used.
         *
         * @param {boolean} [forceString=false]
         * Indicates whether the elements in the replacement expression should evaluate to strings.
         *
         * If this argument is falsy, the elements in the replacement expression may not be equal
         * to those in the input array, but will have the same string representation. Also, the
         * string representation of value of the whole replacement expression will be the same as
         * the string representation of the input string.
         *
         * @param {number} [maxLength=(NaN)]
         * The maximum length of the replacement expression.
         *
         * If the replacement expression exceeds the specified length, the return value is
         * `undefined`.
         *
         * If this parameter is `NaN`, then no length limit is imposed.
         *
         * @returns {string|undefined}
         * The replacement string or `undefined`.
         */

        replaceStringArray:
        function (array, delimiters, forceString, maxLength)
        {
            var replacement;
            var count = array.length;
            if (count > 1)
            {
                if (count > 3) // Don't even try the split strategy for 3 or less elements.
                {
                    var splitReplacement =
                    this.replaceString('split', { maxLength: maxLength, optimize: true });
                }
                var concatReplacement =
                this.replaceString('concat', { maxLength: maxLength, optimize: true });
            }
            if (splitReplacement)
            // Strategy 1: (array[0] + joiner + array[1] + joiner + array[2]...).split(separator)
            {
                // 4 is for the additional overhead of "[" + "](" + ")".
                var maxBulkLength = maxLength - (splitReplacement.length + 4);
                var optimalReplacement;
                var optimalSeparatorExpr;
                delimiters.forEach
                (
                    function (delimiter)
                    {
                        var str = array.join(delimiter.joiner);
                        var strReplacement = this.replaceJoinedArrayString(str, maxBulkLength);
                        if (strReplacement)
                        {
                            var separatorExpr = this.replaceExpr(delimiter.separator);
                            var bulkLength = strReplacement.length + separatorExpr.length;
                            if (!(bulkLength > maxBulkLength))
                            {
                                maxBulkLength = bulkLength;
                                optimalReplacement = strReplacement;
                                optimalSeparatorExpr = separatorExpr;
                            }
                        }
                    },
                    this
                );
                if (optimalReplacement)
                {
                    replacement =
                    optimalReplacement + '[' + splitReplacement + '](' + optimalSeparatorExpr + ')';
                    maxLength = replacement.length;
                }
            }
            if
            (
                count <= 1 ||
                concatReplacement &&
                // 4 is the length of the shortest possible replacement "[[]]".
                // 7 is the length of the shortest possible additional overhead for each following
                // array element, as in "[" + "](+[])" or "[" + "](![])".
                (!replacement || 4 + (concatReplacement.length + 7) * (count - 1) < maxLength)
            )
            // Strategy 2: [array[0]].concat(array[1]).concat(array[2])...
            {
                var arrayReplacement;
                var options = { forceString: forceString };
                if
                (
                    !array.some
                    (
                        function (element)
                        {
                            var elementReplacement = replaceStaticString(element, options);
                            if (elementReplacement === '[][[]]')
                                elementReplacement += '+[]';
                            if (arrayReplacement)
                            {
                                if (elementReplacement === '[]')
                                    elementReplacement = '[[]]';
                                arrayReplacement +=
                                '[' + concatReplacement + '](' + elementReplacement + ')';
                            }
                            else
                                arrayReplacement = '[' + elementReplacement + ']';
                            var result = arrayReplacement.length > maxLength;
                            return result;
                        }
                    )
                )
                    replacement = arrayReplacement;
            }
            return replacement;
        },
    };

    assignNoEnum(Encoder.prototype, protoSource);

    var FALSE_FREE_DELIMITER = { joiner: 'false', separator: 'false' };

    var FALSE_TRUE_DELIMITER = { joiner: '', separator: 'Function("return/(?=false|true)/")()' };

    var REPLACERS =
    {
        identifier:
        function (encoder, identifier, bondStrength, unitIndices, maxLength)
        {
            var unitPath = getUnitPath(unitIndices);
            var replacement =
            encoder.encodeAndWrapText('return ' + identifier, wrapWithCall, unitPath, maxLength);
            return replacement;
        },
        string:
        function (encoder, str, bond, forceString, unitIndices, maxLength)
        {
            var unitPath = getUnitPath(unitIndices);
            var replacement = encoder.encodeText(str, bond, forceString, unitPath, maxLength);
            return replacement;
        },
    };

    var falseFreeFigurator = createFigurator([''], 'false');
    var falseTrueFigurator = createFigurator(['false', 'true'], '');

    wrapWithCall =
    function (str)
    {
        var output = this.resolveConstant('Function') + '(' + str + ')()';
        return output;
    };
    wrapWithCall.forceString = false;

    wrapWithEval =
    function (str)
    {
        var output = this.replaceExpr('Function("return eval")()') + '(' + str + ')';
        return output;
    };
    wrapWithEval.forceString = true;
}
)();
