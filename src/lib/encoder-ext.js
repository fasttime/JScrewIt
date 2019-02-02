/*
global
AMENDINGS,
APPEND_LENGTH_OF_DIGITS,
APPEND_LENGTH_OF_DIGIT_0,
APPEND_LENGTH_OF_FALSE,
APPEND_LENGTH_OF_PLUS_SIGN,
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
_String,
assignNoEnum,
createEmpty,
createFigurator,
expressParse,
replaceStaticString,
*/

var STRATEGIES;

var createReindexMap;
var wrapWithCall;
var wrapWithEval;

(function ()
{
    function defineStrategy(strategy, minInputLength)
    {
        strategy.MIN_INPUT_LENGTH = minInputLength;
        return strategy;
    }

    function getDenseFigureLegendInsertions(figurator, figures)
    {
        var insertions = [FALSE_TRUE_DELIMITER];
        var lastFigure = figurator(figures.length - 1);
        var joiner = lastFigure.joiner;
        if (joiner != null)
            insertions.push({ joiner: joiner, separator: joiner });
        return insertions;
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

    function getSparseFigureLegendInsertions()
    {
        var insertions = [FALSE_FREE_DELIMITER];
        return insertions;
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
        _Math_max((input.length - 1) * APPEND_LENGTH_OF_FALSE - 3, 0);
        return minCharIndexArrayStrLength;
    }

    function initMinFalseTrueCharIndexArrayStrLength()
    {
        return -1;
    }

    function undefinedAsString(replacement)
    {
        if (replacement === '[][[]]')
            replacement += '+[]';
        return replacement;
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
            2369
        ),

        /* -------------------------------------------------------------------------------------- *\

        Encodes "NINE" as:

        "false2falsefalse1".split(false).map("".charAt.bind("NEI")).join([])

        (split strategy)

        Or:

        [0].concat(2).concat(0).concat(1).map("".charAt.bind("NEI")).join([])

        (concat strategy)

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

        "10false0false1falsetruefalsetrue".split(true).join(2).split(false).map(Function(
        "return function(undefined){return this[parseInt(undefined,3)]}")().bind("HRET")).join([])

        (simple)

        Or:

        "10falsetruefalse1falsefalse".split(true).join(2).split(false).map(Function(
        "return function(undefined){return this[parseInt(+undefined,3)]}")().bind("ERHT")).join([])

        (with coercion)

        \* -------------------------------------------------------------------------------------- */

        byDictRadix3AmendedBy1:
        defineStrategy
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 3, 1, maxLength);
                return output;
            },
            182
        ),

        /* -------------------------------------------------------------------------------------- *\

        Encodes "TWELVE" as:

        "2false3false0false1false10false0".split(false).map(Function(
        "return function(undefined){return this[parseInt(undefined,4)]}")().bind("ELTWV")).join([])

        (split strategy)

        Or:

        "2false3falsefalse1false10falsefalse".split(false).map(Function(
        "return function(undefined){return this[parseInt(+undefined,4)]}")().bind("ELTWV")).join([])

        (split strategy, with coercion)

        Or:

        [2].concat(3).concat(0).concat(1).concat("10").concat(0).map(Function(
        "return function(undefined){return this[parseInt(undefined,4)]}")().bind("ELTWV")).join([])

        (concat strategy)

        \* -------------------------------------------------------------------------------------- */

        byDictRadix4:
        defineStrategy
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 4, 0, maxLength);
                return output;
            },
            178
        ),

        /* -------------------------------------------------------------------------------------- *\

        Encodes "TWELVE" as:

        "1false10falsetruefalse0false2falsetrue".split(true).join(3).split(false).map(Function(
        "return function(undefined){return this[parseInt(undefined,4)]}")().bind("LTVEW")).join([])

        (simple)

        Or:

        "1false10falsefalsetruefalse2false".split(true).join(3).split(false).map(Function(
        "return function(undefined){return this[parseInt(+undefined,4)]}")().bind("ETVLW")).join([])

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
            229
        ),

        /* -------------------------------------------------------------------------------------- *\

        Encodes "TWELVE" as:

        "undefinedfalse10falsetruefalse0false1falsetrue".split(true).join(2).split("undefined").join
        (3).split(false).map(Function(
        "return function(undefined){return this[parseInt(undefined,4)]}")().bind("LVETW")).join([])

        (simple)

        Or:

        "undefinedfalse10falsefalsetruefalse1false".split(true).join(2).split("undefined").join(3).
        split(false).map(Function("return function(undefined){return this[parseInt(+undefined,4)]}")
        ().bind("EVLTW")).join([])

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
            305
        ),

        /* -------------------------------------------------------------------------------------- *\

        Encodes "SIXTEEN" as:

        "10false1false4false3false0false0false2".split(false).map(Function(
        "return function(undefined){return this[parseInt(undefined,5)]}")().bind("EINTXS")).join([])

        (split strategy)

        Or:

        "10false1false4false3falsefalsefalse2".split(false).map(Function(
        "return function(undefined){return this[parseInt(+undefined,5)]}")().bind("EINTXS")).join([]
        )

        (split strategy, with coercion)

        Or:

        ["10"].concat(1).concat(4).concat(3).concat(0).concat(0).concat(2).map(Function(
        "return function(undefined){return this[parseInt(undefined,5)]}")().bind("EINTXS")).join([])

        (concat strategy)

        \* -------------------------------------------------------------------------------------- */

        byDictRadix5:
        defineStrategy
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 5, 0, maxLength);
                return output;
            },
            224
        ),

        /* -------------------------------------------------------------------------------------- *\

        Encodes "SIXTEEN" as:

        "1false0false10falseNaNfalsetruefalsetruefalseundefined".split(true).join(2).split(
        "undefined").join(3).split(NaN).join(4).split(false).map(Function(
        "return function(undefined){return this[parseInt(undefined,5)]}")().bind("ISENTX")).join([])

        (simple)

        Or:

        "1falsetruefalse10falseNaNfalsefalsefalseundefined".split(true).join(2).split("undefined").
        join(3).split(NaN).join(4).split(false).map(Function(
        "return function(undefined){return this[parseInt(+undefined,5)]}")().bind("ESINTX")).join([]
        )

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
            646
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
            391
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
        callGetFigureLegendInsertions:
        function (getFigureLegendInsertions, figurator, figures)
        {
            var figureLegendInsertions = getFigureLegendInsertions(figurator, figures);
            return figureLegendInsertions;
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
        function (input, charMap, insertions, substitutions, forceString, maxLength)
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
            this.replaceStringArray
            (charKeyArray, insertions, substitutions, forceString, maxLength);
            return charKeyArrayStr;
        },

        createDictEncoding:
        function (legend, charIndexArrayStr, maxLength, radix, coerceToInt)
        {
            var mapper;
            if (radix)
            {
                var parseIntArg = (coerceToInt ? '+' : '') + 'undefined';
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
            getFigureLegendInsertions,
            keyFigureArrayInsertions,
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
            var figureLegendInsertions =
            this.callGetFigureLegendInsertions(getFigureLegendInsertions, figurator, figures);
            var figureMaxLength = maxLength - legend.length;
            var figureLegend =
            this.replaceStringArray
            (
                figures,
                figureLegendInsertions,
                null,
                true,
                figureMaxLength - minCharIndexArrayStrLength
            );
            if (!figureLegend)
                return;
            var keyFigureArrayStr =
            this.createCharKeyArrayString
            (
                input,
                charMap,
                keyFigureArrayInsertions,
                null,
                true,
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

        encodeByDenseFigures:
        function (inputData, maxLength)
        {
            var output =
            this.encodeByDblDict
            (
                initMinFalseTrueCharIndexArrayStrLength,
                falseTrueFigurator,
                getDenseFigureLegendInsertions,
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
            // Integer coercion is for free without a radix, otherwise it costs a replaced plus
            // sign.
            var coerceToInt =
            !radix ||
            freqListLength &&
            freqList[0].count * APPEND_LENGTH_OF_DIGIT_0 > APPEND_LENGTH_OF_PLUS_SIGN;
            var radixNum = radix || 10;
            var reindexMap = createReindexMap(freqListLength, radixNum, amendings, coerceToInt);
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
            if (amendings)
            {
                var substitutions = [];
                var firstDigit = radixNum - amendings;
                for (var index = 0; index < amendings; ++index)
                {
                    var separator = AMENDINGS[index];
                    var digit = firstDigit + index;
                    var joiner = _String(digit);
                    var substitution = { separator: separator, joiner: joiner };
                    substitutions.push(substitution);
                }
            }
            var charIndexArrayStr =
            this.createCharKeyArrayString
            (
                input,
                charMap,
                [FALSE_FREE_DELIMITER],
                substitutions,
                false,
                maxLength - legend.length
            );
            if (!charIndexArrayStr)
                return;
            var output =
            this.createDictEncoding(legend, charIndexArrayStr, maxLength, radix, coerceToInt);
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
                getSparseFigureLegendInsertions,
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
                    'byDictRadix4AmendedBy2',
                    'byDictRadix4AmendedBy1',
                    'byDictRadix5',
                    'byDictRadix3AmendedBy1',
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

        // Array elements may not contain the substring "false", because the value false could
        // be used as a separator in the encoding.
        replaceFalseFreeArray:
        function (array, maxLength)
        {
            var result =
            this.replaceStringArray(array, [FALSE_FREE_DELIMITER], null, false, maxLength);
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
         * An object that exposes properties used to split a string into an array of strings or to
         * join array elements into a string.
         *
         * @private
         * @typedef Delimiter
         *
         * @property {string} separator
         * An express-parsable expression used as an argument for `String.prototype.split` to split
         * a string into an array of strings.
         *
         * @property {number} joiner
         * The joiner can be any string. A joiner is inserted between adjacent strings in an array
         * in order to join them into a single string.
         */

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
         * @param {Delimiter[]} insertions
         * An array of delimiters of which at most one will be used to compose a joined string and
         * split it into an array of strings.
         *
         * The encoder can pick an insertion and insert a joiner between any two adjacent elements
         * to mark the boundary between them. The separator is then used to split the concatenated
         * string back into its elements.
         *
         * @param {Delimiter[]|null} [substitutions]
         * An array of delimiters, specifying substitutions to be applied to the input elements.
         *
         * All substitutions are applied on each element of the input array, in the order they are
         * specified.
         *
         * Substitutions are expensive in two ways: they create additional overhead and prevent
         * certain optimizations for short arrays to be made. To allow all optimizations to be
         * performed, omit this argument or set it to null instead of specifying an empty array.
         *
         * @param {boolean} [forceString=false]
         * Indicates whether the elements in the replacement expression should evaluate to strings.
         *
         * If this argument is falsy, the elements in the replacement expression may not be equal
         * to those in the input array, but will have the same string representation.
         *
         * Regardless of this argument, the string representation of the value of the whole
         * replacement expression will be always the same as the string representation of the input
         * array.
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
        function (array, insertions, substitutions, forceString, maxLength)
        {
            var replacement;
            var count = array.length;
            // Don't even try the split approach for 3 or less elements if the concat approach can
            // be applied.
            if (substitutions || count > 3)
            {
                var preReplacement =
                function ()
                {
                    // Length of the shortest string replacement "([]+[])".
                    var STRING_REPLACEMENT_MIN_LENGTH = 7;

                    // This is for the overhead of "[" + "](" + ")" plus the length of the shortest
                    // separator replacement "[]".
                    var SEPARATOR_MIN_OVERHEAD = 6;

                    // This is for the overhead of "[" + "](" + ")" plus the length of the shortest
                    // joiner replacement "[]".
                    var JOINER_MIN_OVERHEAD = 6;

                    var joinCount = substitutions ? substitutions.length : 0;
                    var splitCount = joinCount + 1;
                    var maxSplitReplacementLength =
                    (maxLength - STRING_REPLACEMENT_MIN_LENGTH) / splitCount -
                    SEPARATOR_MIN_OVERHEAD;
                    var splitReplacement =
                    this.replaceString
                    ('split', { maxLength: maxSplitReplacementLength, optimize: true });
                    if (!splitReplacement)
                        return;
                    var preReplacement = '';
                    if (joinCount)
                    {
                        var maxJoinReplacementLength =
                        (
                            maxLength - STRING_REPLACEMENT_MIN_LENGTH -
                            splitCount * (splitReplacement.length + SEPARATOR_MIN_OVERHEAD)
                        ) /
                        joinCount -
                        JOINER_MIN_OVERHEAD;
                        var joinReplacement =
                        this.replaceString('join', { maxLength: maxJoinReplacementLength });
                        if (!joinReplacement)
                            return;
                        substitutions.forEach
                        (
                            function (substitution)
                            {
                                var separatorReplacement =
                                undefinedAsString(this.replaceExpr(substitution.separator));
                                var joinerReplacement =
                                undefinedAsString(this.replaceString(substitution.joiner));
                                preReplacement +=
                                '[' + splitReplacement + '](' + separatorReplacement + ')[' +
                                joinReplacement + '](' + joinerReplacement + ')';
                            },
                            this
                        );
                    }
                    preReplacement += '[' + splitReplacement + ']';
                    return preReplacement;
                }
                .call(this);
            }
            if (!substitutions && count > 1)
            {
                var concatReplacement =
                this.replaceString('concat', { maxLength: maxLength, optimize: true });
            }
            if (preReplacement)
            // Approach 1: (array[0] + joiner + array[1] + joiner + array[2]...).split(separator)
            {
                // 2 is for the additional overhead of "(" + ")".
                var maxBulkLength = maxLength - (preReplacement.length + 2);
                var optimalStrReplacement;
                var optimalSeparatorReplacement;
                insertions.forEach
                (
                    function (insertion)
                    {
                        var str = array.join(insertion.joiner);
                        var strReplacement = this.replaceJoinedArrayString(str, maxBulkLength);
                        if (!strReplacement)
                            return;
                        var separatorReplacement =
                        undefinedAsString(this.replaceExpr(insertion.separator));
                        var bulkLength = strReplacement.length + separatorReplacement.length;
                        if (!(bulkLength > maxBulkLength))
                        {
                            maxBulkLength = bulkLength;
                            optimalStrReplacement = strReplacement;
                            optimalSeparatorReplacement = separatorReplacement;
                        }
                    },
                    this
                );
                if (optimalStrReplacement)
                {
                    replacement =
                    optimalStrReplacement + preReplacement + '(' + optimalSeparatorReplacement +
                    ')';
                    maxLength = replacement.length - 1;
                }
            }
            if
            (
                !substitutions &&
                (
                    count <= 1 ||
                    concatReplacement &&
                    // 4 is the length of the shortest possible replacement "[[]]".
                    // 7 is the length of the shortest possible additional overhead for each
                    // following array element, as in "[" + "](+[])" or "[" + "](![])".
                    !(4 + (concatReplacement.length + 7) * (count - 1) > maxLength)
                )
            )
            // Approach 2: [array[0]].concat(array[1]).concat(array[2])...
            {
                var arrayReplacement;
                var options = { forceString: forceString };
                if
                (
                    !array.some
                    (
                        function (element)
                        {
                            var elementReplacement =
                            undefinedAsString(replaceStaticString(element, options));
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

    createReindexMap =
    function (count, radix, amendings, coerceToInt)
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
        var digitAppendLengths = APPEND_LENGTH_OF_DIGITS.slice(0, radix);
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
    };

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
