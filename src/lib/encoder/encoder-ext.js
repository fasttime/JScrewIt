import
{
    APPEND_LENGTH_OF_DIGITS,
    APPEND_LENGTH_OF_DIGIT_0,
    APPEND_LENGTH_OF_FALSE,
    APPEND_LENGTH_OF_PLUS_SIGN,
}
from '../append-lengths';
import
{
    AMENDINGS,
    FROM_CHAR_CODE,
    FROM_CHAR_CODE_CALLBACK_FORMATTER,
    MAPPER_FORMATTER,
    OPTIMAL_ARG_NAME,
    OPTIMAL_RETURN_STRING,
    SIMPLE,
}
from '../definitions';
import expressParse                                                 from '../express-parse';
import { Feature }                                                  from '../features';
import createFigurator                                              from '../figurator';
import
{
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
    tryCreateRegExp,
}
from '../obj-utils';
import { SCREW_AS_BONDED_STRING, SCREW_AS_STRING, SCREW_NORMAL }    from '../screw-buffer';
import { Encoder }                                                  from './encoder-base';
import { replaceStaticString }                                      from './encoder-utils';

var FALSE_FREE_DELIMITER = { joiner: 'false', separator: 'false' };
var FALSE_TRUE_DELIMITER = { joiner: '', separator: 'Function("return/(?=false|true)/")()' };

var REPLACERS =
{
    identifier:
    function (encoder, identifier, bondStrength, unitIndices, maxLength)
    {
        var unitPath = getUnitPath(unitIndices);
        var replacement =
        encodeAndWrapText(encoder, 'return ' + identifier, wrapWithCall, unitPath, maxLength);
        return replacement;
    },
    string:
    function (encoder, str, screwMode, unitIndices, maxLength)
    {
        var unitPath = getUnitPath(unitIndices);
        var replacement = encodeText(encoder, str, screwMode, unitPath, maxLength);
        return replacement;
    },
};

export var STRATEGIES;

function callStrategies(encoder, input, options, strategyNames, unitPath)
{
    var output;
    var inputLength = input.length;
    var perfLog = encoder.perfLog;
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
            if (inputLength < strategy.minInputLength)
                perfStatus = 'skipped';
            else if (!encoder.hasFeatures(strategy.mask))
                perfStatus = 'unsuited';
            else
            {
                encoder.perfLog = perfInfo.perfLog = [];
                var before = new _Date();
                var maxLength = output != null ? output.length : NaN;
                var newOutput = strategy.call(encoder, inputData, maxLength);
                var time = new _Date() - before;
                encoder.perfLog = perfLog;
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
        }
    );
    return output;
}

function createCharKeyArrayString
(encoder, input, charMap, insertions, substitutions, forceString, maxLength)
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
    encoder.replaceStringArray(charKeyArray, insertions, substitutions, forceString, maxLength);
    return charKeyArrayStr;
}

function createJSFuckArrayMapping(encoder, arrayStr, mapper, legend)
{
    var result =
    arrayStr + '[' + encoder.replaceString('map', { optimize: true }) + '](' +
    encoder.replaceExpr(mapper, true) + '(' + legend + '))';
    return result;
}

function createLongStrCodesOutput(encoder, strCodeArrayStr, fromCharCode, arg)
{
    var formatter = encoder.findDefinition(FROM_CHAR_CODE_CALLBACK_FORMATTER);
    var formatterExpr = formatter(fromCharCode, arg);
    var output =
    strCodeArrayStr + '[' + encoder.replaceString('map', { optimize: true }) + '](' +
    encoder.replaceExpr('Function("return ' + formatterExpr + '")()', true) + ')[' +
    encoder.replaceString('join') + ']([])';
    return output;
}

export function createReindexMap(count, radix, amendingCount, coerceToInt)
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
    if (amendingCount)
    {
        var firstDigit = radix - amendingCount;
        var pattern = '[';
        for (index = 0; index < amendingCount; ++index)
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
        var reindexStr = amendingCount ? str.replace(regExp, replacer) : str;
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

function createStrCodesEncoding(encoder, inputData, fromCharCode, splitter, radix, maxLength)
{
    var input = inputData.valueOf();
    var strCodeCacheKey = 'strCodeCache' + (radix ? 'Radix' + radix : '');
    var cache = inputData[strCodeCacheKey] || (inputData[strCodeCacheKey] = createEmpty());
    var strCodeArray = splitter(input, radix, cache);
    var strCodeArrayStr = encoder.replaceFalseFreeArray(strCodeArray, maxLength);
    if (strCodeArrayStr)
    {
        var output;
        if (radix)
        {
            output =
            createLongStrCodesOutput
            (encoder, strCodeArrayStr, fromCharCode, 'parseInt(undefined,' + radix + ')');
        }
        else
        {
            var long = strCodeArray.length > encoder.maxDecodableArgs;
            if (long)
            {
                output =
                createLongStrCodesOutput(encoder, strCodeArrayStr, fromCharCode, 'undefined');
            }
            else
            {
                var returnString = encoder.findDefinition(OPTIMAL_RETURN_STRING);
                var str = returnString + '.' + fromCharCode + '(';
                output =
                encoder.resolveConstant('Function').replacement +
                '(' +
                encoder.replaceString(str, { optimize: true }) +
                '+' +
                strCodeArrayStr +
                '+' +
                encoder.resolveCharacter(')').replacement +
                ')()';
            }
        }
        if (!(output.length > maxLength))
            return output;
    }
}

function encodeAndWrapText(encoder, input, wrapper, unitPath, maxLength)
{
    var output;
    if (!wrapper || input)
    {
        var screwMode = !wrapper || wrapper.forceString ? SCREW_AS_STRING : SCREW_NORMAL;
        output = encodeText(encoder, input, screwMode, unitPath, maxLength);
        if (output == null)
            return;
    }
    else
        output = '';
    if (wrapper)
        output = wrapper.call(encoder, output);
    if (!(output.length > maxLength))
        return output;
}

function encodeByDblDict
(
    encoder,
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
    var legend = encodeDictLegend(encoder, dictChars, maxLength - minCharIndexArrayStrLength);
    if (!legend)
        return;
    var figureLegendInsertions =
    encoder.callGetFigureLegendInsertions(getFigureLegendInsertions, figurator, figures);
    var figureMaxLength = maxLength - legend.length;
    var figureLegend =
    encoder.replaceStringArray
    (figures, figureLegendInsertions, null, true, figureMaxLength - minCharIndexArrayStrLength);
    if (!figureLegend)
        return;
    var keyFigureArrayStr =
    createCharKeyArrayString
    (
        encoder,
        input,
        charMap,
        keyFigureArrayInsertions,
        null,
        true,
        figureMaxLength - figureLegend.length
    );
    if (!keyFigureArrayStr)
        return;
    var formatter = encoder.findDefinition(MAPPER_FORMATTER);
    var argName = 'undefined';
    var accessor = '.indexOf(' + argName + ')';
    var mapper = formatter(argName, accessor);
    var charIndexArrayStr =
    createJSFuckArrayMapping(encoder, keyFigureArrayStr, mapper, figureLegend);
    var output = encoder.createDictEncoding(legend, charIndexArrayStr, maxLength);
    return output;
}

function encodeDictLegend(encoder, dictChars, maxLength)
{
    if (!(maxLength < 0))
    {
        var input = dictChars.join('');
        var output =
        callStrategies
        (
            encoder,
            input,
            { screwMode: SCREW_AS_STRING },
            ['byCodePointsRadix4', 'byCharCodesRadix4', 'byCodePoints', 'byCharCodes', 'plain'],
            'legend'
        );
        if (output && !(output.length > maxLength))
            return output;
    }
}

function encodeText(encoder, input, screwMode, unitPath, maxLength)
{
    var output =
    callStrategies
    (
        encoder,
        input,
        { screwMode: screwMode },
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
            'byCodePointsRadix4',
            'byCharCodesRadix4',
            'byCodePoints',
            'byCharCodes',
            'plain',
        ],
        unitPath
    );
    if (output != null && !(output.length > maxLength))
        return output;
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
    var minCharIndexArrayStrLength = _Math_max((input.length - 1) * APPEND_LENGTH_OF_FALSE - 3, 0);
    return minCharIndexArrayStrLength;
}

function initMinFalseTrueCharIndexArrayStrLength()
{
    return -1;
}

function splitIntoCharCodes(str, radix, cache)
{
    var strCodes = [];
    var regExp = /[^]/g;
    for (var match; match = regExp.exec(str);)
    {
        var char = match[0];
        var strCode = cache[char];
        if (strCode == null)
            strCode = cache[char] = char.charCodeAt().toString(radix);
        strCodes.push(strCode);
    }
    return strCodes;
}

function splitIntoCodePoints(str, radix, cache)
{
    var strCodes = [];
    var regExp = tryCreateRegExp('.', 'gsu') || /[\ud800-\udbff][\udc00-\udfff]|[^]/g;
    for (var match; match = regExp.exec(str);)
    {
        var char = match[0];
        var strCode = cache[char];
        if (strCode == null)
            strCode = cache[char] = codePointOf(char).toString(radix);
        strCodes.push(strCode);
    }
    return strCodes;
}

function undefinedAsString(replacement)
{
    if (replacement === '[][[]]')
        replacement += '+[]';
    return replacement;
}

export function wrapWithCall(str)
{
    var output = this.resolveConstant('Function').replacement + '(' + str + ')()';
    return output;
}

wrapWithCall.forceString = false;

export function wrapWithEval(str)
{
    var output = this.replaceExpr('Function("return eval")()') + '(' + str + ')';
    return output;
}

wrapWithEval.forceString = true;

var falseFreeFigurator = createFigurator([''], 'false');
var falseTrueFigurator = createFigurator(['false', 'true'], '');

(function ()
{
    function defineStrategy(strategy, minInputLength, expressionMode, featureObj)
    {
        strategy.minInputLength = minInputLength;
        if (expressionMode === undefined)
            expressionMode = false;
        strategy.expressionMode = expressionMode;
        if (featureObj === undefined)
            featureObj = Feature.DEFAULT;
        strategy.mask = featureObj.mask;
        return strategy;
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
                var output = this.encodeByCharCodes(inputData, undefined, maxLength);
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
                var output = this.encodeByCharCodes(inputData, 4, maxLength);
                return output;
            },
            25
        ),

        /* -------------------------------------------------------------------------------------- *\

        Like byCharCodes, but uses String.fromCodePoint instead of String.fromCharCode and treats
        surrogate pairs as one character.
        Requires feature FROM_CODE_POINT.

        \* -------------------------------------------------------------------------------------- */

        byCodePoints:
        defineStrategy
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByCodePoints(inputData, undefined, maxLength);
                return output;
            },
            2,
            undefined,
            Feature.FROM_CODE_POINT
        ),

        /* -------------------------------------------------------------------------------------- *\

        Like byCharCodesRadix4, but uses String.fromCodePoint instead of String.fromCharCode and
        treats surrogate pairs as one character.
        Requires feature FROM_CODE_POINT.

        \* -------------------------------------------------------------------------------------- */

        byCodePointsRadix4:
        defineStrategy
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByCodePoints(inputData, 4, maxLength);
                return output;
            },
            38,
            undefined,
            Feature.FROM_CODE_POINT
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
            1888
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
            2
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
            153
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
            160
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
            218
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
            279
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
            223
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
            602
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
            347
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
            },
            undefined,
            true
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
                { maxLength: maxLength, optimize: true, screwMode: inputData.screwMode };
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
                var output = encodeAndWrapText(this, input, wrapper, undefined, maxLength);
                return output;
            }
        ),
    };
}
)();

assignNoEnum
(
    Encoder.prototype,
    {
        callGetFigureLegendInsertions:
        function (getFigureLegendInsertions, figurator, figures)
        {
            var figureLegendInsertions = getFigureLegendInsertions(figurator, figures);
            return figureLegendInsertions;
        },

        createDictEncoding:
        function (legend, charIndexArrayStr, maxLength, radix, coerceToInt)
        {
            var mapper;
            if (radix)
            {
                var formatter = this.findDefinition(MAPPER_FORMATTER);
                var argName = this.findDefinition(OPTIMAL_ARG_NAME);
                var parseIntArg = (coerceToInt ? '+' : '') + argName;
                var accessor = '[parseInt(' + parseIntArg + ',' + radix + ')]';
                mapper = formatter(argName, accessor);
            }
            else
                mapper = '"".charAt.bind';
            var output =
            createJSFuckArrayMapping(this, charIndexArrayStr, mapper, legend) + '[' +
            this.replaceString('join') + ']([])';
            if (!(output.length > maxLength))
                return output;
        },

        encodeByCharCodes:
        function (inputData, radix, maxLength)
        {
            var fromCharCode = this.findDefinition(FROM_CHAR_CODE);
            var output =
            createStrCodesEncoding
            (this, inputData, fromCharCode, splitIntoCharCodes, radix, maxLength);
            return output;
        },

        encodeByCodePoints:
        function (inputData, radix, maxLength)
        {
            var output =
            createStrCodesEncoding
            (this, inputData, 'fromCodePoint', splitIntoCodePoints, radix, maxLength);
            return output;
        },

        encodeByDenseFigures:
        function (inputData, maxLength)
        {
            var output =
            encodeByDblDict
            (
                this,
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
        function (inputData, radix, amendingCount, maxLength)
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
            var reindexMap = createReindexMap(freqListLength, radixNum, amendingCount, coerceToInt);
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
            var legend = encodeDictLegend(this, dictChars, maxLength - minCharIndexArrayStrLength);
            if (!legend)
                return;
            if (amendingCount)
            {
                var substitutions = [];
                var firstDigit = radixNum - amendingCount;
                for (var index = 0; index < amendingCount; ++index)
                {
                    var separator = AMENDINGS[index];
                    var digit = firstDigit + index;
                    var joiner = _String(digit);
                    var substitution = { separator: separator, joiner: joiner };
                    substitutions.push(substitution);
                }
            }
            var charIndexArrayStr =
            createCharKeyArrayString
            (
                this,
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
            encodeByDblDict
            (
                this,
                initMinFalseFreeCharIndexArrayStrLength,
                falseFreeFigurator,
                getSparseFigureLegendInsertions,
                [FALSE_FREE_DELIMITER],
                inputData,
                maxLength
            );
            return output;
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
                    output = this._replaceExpressUnit(unit, false, [], maxLength, REPLACERS);
                return output;
            }
        },

        exec:
        function (input, wrapper, strategyNames, perfInfo)
        {
            var perfLog = this.perfLog = [];
            var output = callStrategies(this, input, { wrapper: wrapper }, strategyNames);
            if (perfInfo)
                perfInfo.perfLog = perfLog;
            delete this.perfLog;
            if (output == null)
                throw new _Error('Encoding failed');
            return output;
        },

        maxDecodableArgs: 65533, // Limit imposed by Internet Explorer.

        // Array elements may not contain the substring "false", because the value false could be
        // used as a separator in the encoding.
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
            var options = { maxLength: maxLength, screwMode: SCREW_AS_BONDED_STRING };
            var replacement = replaceStaticString(str, options);
            return replacement;
        },

        /**
         * An object that exposes properties used to split a string into an array of strings or to
         * join array elements into a string.
         *
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
         * If this argument is falsy, the elements in the replacement expression may not be equal to
         * those in the input array, but will have the same string representation.
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
                var options = { screwMode: forceString ? SCREW_AS_STRING : SCREW_NORMAL };
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
    }
);

var codePointOf =
_String.prototype.codePointAt ?
function (char)
{
    var codePoint = char.codePointAt();
    return codePoint;
} :
function (char)
{
    var codePoint;
    if (char.length < 2)
        codePoint = char.charCodeAt();
    else
    {
        var highSurrogatePart   = char.charCodeAt(0) - 0xd800 << 10;
        var lowSurrogatePart    = char.charCodeAt(1) - 0xdc00;
        codePoint = highSurrogatePart + lowSurrogatePart + 0x10000;
    }
    return codePoint;
};
