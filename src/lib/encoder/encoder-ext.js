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
    FORMAT_MAPPER_LONG,
    FORMAT_MAPPER_SHORT,
    FROM_CHAR_CODE,
    FROM_CHAR_CODE_CALLBACK_FORMATTER,
    OPTIMAL_RETURN_STRING,
    SIMPLE,
}
from '../definitions';
import expressParse                         from '../express-parse';
import { Feature }                          from '../features';
import createFigurator                      from '../figurator';
import joinWithMaxLength                    from '../join-with-max-length';
import
{
    _Array_prototype_forEach_call,
    _Array_prototype_map_call,
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
import { SCREW_AS_STRING, SCREW_NORMAL }    from '../screw-buffer';
import { Encoder }                          from './encoder-base';
import { codePointFromSurrogatePair }       from './encoder-utils';
import replaceStringArray                   from './replace-string-array';

var ENCODING_TYPE_COMBINED      = 'combined';
var ENCODING_TYPE_EXPRESSION    = 'expression';
var ENCODING_TYPE_TEXT          = 'text';

var FALSE_FREE_DELIMITER = { joiner: 'false', separator: 'false' };
var FALSE_TRUE_DELIMITER = { joiner: '', separator: 'Function("return/(?=false|true)/")()' };

// Underestimated minimum length of the joining: "[" + joinReplacement + "]([])".
var JOINING_MIN_LENGTH      = 8;

// Underestimated minimum overhead of the mapping: "[" + "](" + mapperReplacement + ")".
var MAPPING_MIN_OVERHEAD    = 12;

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
(encoder, input, charMap, insertions, substitutions, areKeysFigures, maxLength)
{
    var charKeyArray =
    _Array_prototype_map_call
    (
        input,
        function (char)
        {
            var charKey = charMap[char];
            return charKey;
        }
    );
    var charKeyArrayStr =
    encoder.replaceStringArray
    (charKeyArray, insertions, substitutions, !areKeysFigures, areKeysFigures, maxLength);
    return charKeyArrayStr;
}

function createLongStrCodesOutput(encoder, arrayReplacement, fromCharCode, arg, maxLength)
{
    var mapReplacement = encoder.resolveConstant('MAP').replacement;
    var maxCharArrayLength = maxLength - JOINING_MIN_LENGTH;
    var maxMapReplacementLength =
    maxCharArrayLength - arrayReplacement.length - MAPPING_MIN_OVERHEAD;
    if (mapReplacement.length > maxMapReplacementLength)
        return;
    var formatter = encoder.findDefinition(FROM_CHAR_CODE_CALLBACK_FORMATTER);
    var formatterExpr = formatter(fromCharCode, arg);
    var mapper = 'Function("return ' + formatterExpr + '")()';
    var mapperReplacement = encoder._replaceMapper(mapper);
    var charArrayReplacement =
    joinWithMaxLength
    (
        maxCharArrayLength,
        arrayReplacement,
        '[',
        mapReplacement,
        '](',
        mapperReplacement,
        ')'
    );
    if (!charArrayReplacement)
        return;
    var replacement = encoder._joinCharArray(charArrayReplacement, maxLength);
    return replacement;
}

function createMappedArrayEncoding(encoder, arrayReplacement, mapper, legend, maxLength)
{
    var mapReplacement = encoder.resolveConstant('MAP').replacement;
    var maxCharArrayLength = maxLength - JOINING_MIN_LENGTH;
    var maxMapReplacementLength =
    // 2 is for the calling parentheses around the legend replacement.
    maxCharArrayLength - arrayReplacement.length - MAPPING_MIN_OVERHEAD - legend.length - 2;
    if (mapReplacement.length > maxMapReplacementLength)
        return;
    var mapperReplacement = encoder._replaceMapper(mapper);
    var charArrayReplacement =
    joinWithMaxLength
    (
        maxCharArrayLength,
        arrayReplacement,
        '[',
        mapReplacement,
        '](',
        mapperReplacement,
        '(',
        legend,
        '))'
    );
    if (!charArrayReplacement)
        return;
    var replacement = encoder._joinCharArray(charArrayReplacement, maxLength);
    return replacement;
}

export function createReindexMap(count, radix, amendingCount, coerceToInt)
{
    function getSortLength()
    {
        var length = 0;
        _Array_prototype_forEach_call
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
    var strCodeArrayStr =
    encoder.replaceStringArray(strCodeArray, [FALSE_FREE_DELIMITER], null, false, false, maxLength);
    if (strCodeArrayStr)
    {
        var replacement;
        if (radix)
        {
            replacement =
            createLongStrCodesOutput
            (
                encoder,
                strCodeArrayStr,
                fromCharCode,
                'parseInt(undefined,' + radix + ')',
                maxLength
            );
        }
        else
        {
            var long = strCodeArray.length > encoder._maxDecodableArgs;
            if (long)
            {
                replacement =
                createLongStrCodesOutput
                (
                    encoder,
                    strCodeArrayStr,
                    fromCharCode,
                    'undefined',
                    maxLength
                );
            }
            else
            {
                var returnString = encoder.findDefinition(OPTIMAL_RETURN_STRING);
                var str = returnString + '.' + fromCharCode + '(';
                replacement =
                joinWithMaxLength
                (
                    maxLength,
                    encoder.resolveConstant('Function').replacement,
                    '(',
                    encoder.replaceString(str, { optimize: true }),
                    '+',
                    strCodeArrayStr,
                    '+',
                    encoder.resolveCharacter(')').replacement,
                    ')()'
                );
            }
        }
        return replacement;
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
    var figureLegendInsertions = getFigureLegendInsertions(figurator, figures);
    var figureMaxLength = maxLength - legend.length;
    var figureLegend =
    encoder.replaceStringArray
    (
        figures,
        figureLegendInsertions,
        null,
        false,
        true,
        figureMaxLength - minCharIndexArrayStrLength
    );
    if (!figureLegend)
        return;
    var charIndexFigureArrayStr =
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
    if (!charIndexFigureArrayStr)
        return;
    var formatMapper = encoder._findFormatMapperShort();
    var output =
    encoder._createDblDictEncoding
    (formatMapper, charIndexFigureArrayStr, figureLegend, legend, maxLength);
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
    callStrategies(encoder, input, { screwMode: screwMode }, TEXT_STRATEGY_NAMES, unitPath);
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
        _Array_prototype_forEach_call
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
    function defineStrategy(strategy, encodingType, minInputLength, featureObj)
    {
        strategy.encodingType = encodingType;
        strategy.minInputLength = minInputLength;
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
                var output = this._encodeByCharCodes(inputData, undefined, maxLength);
                return output;
            },
            ENCODING_TYPE_TEXT,
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
                var output = this._encodeByCharCodes(inputData, 4, maxLength);
                return output;
            },
            ENCODING_TYPE_TEXT,
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
                var output = this._encodeByCodePoints(inputData, undefined, maxLength);
                return output;
            },
            ENCODING_TYPE_TEXT,
            3,
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
                var output = this._encodeByCodePoints(inputData, 4, maxLength);
                return output;
            },
            ENCODING_TYPE_TEXT,
            29,
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
                var output = this._encodeByDenseFigures(inputData, maxLength);
                return output;
            },
            ENCODING_TYPE_TEXT,
            1712
        ),

        /* -------------------------------------------------------------------------------------- *\

        Encodes "FIFTY" as:

        "false1falsefalse2false3".split(false).map("".charAt.bind("FITY")).join([])

        (split strategy)

        Or:

        [[]].concat(1).concat(0).concat(2).concat(3).map("".charAt.bind("FITY")).join([])

        (concat strategy)

        \* -------------------------------------------------------------------------------------- */

        byDict:
        defineStrategy
        (
            function (inputData, maxLength)
            {
                var output = this._encodeByDict(inputData, undefined, undefined, maxLength);
                return output;
            },
            ENCODING_TYPE_TEXT,
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
                var output = this._encodeByDict(inputData, 3, 1, maxLength);
                return output;
            },
            ENCODING_TYPE_TEXT,
            134
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
                var output = this._encodeByDict(inputData, 4, 0, maxLength);
                return output;
            },
            ENCODING_TYPE_TEXT,
            106
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
                var output = this._encodeByDict(inputData, 4, 1, maxLength);
                return output;
            },
            ENCODING_TYPE_TEXT,
            118
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
                var output = this._encodeByDict(inputData, 4, 2, maxLength);
                return output;
            },
            ENCODING_TYPE_TEXT,
            178
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
                var output = this._encodeByDict(inputData, 5, 0, maxLength);
                return output;
            },
            ENCODING_TYPE_TEXT,
            172
        ),

        /* -------------------------------------------------------------------------------------- *\

        Encodes "SIXTEEN" as:

        "1false0false10false2falsetruefalsetruefalseundefined".split(true).join(3).split("undefined"
        ).join(4).split(false).map(Function(
        "return function(undefined){return this[parseInt(undefined,5)]}")().bind("ISTENX")).join([])

        (simple)

        Or:

        "1falsetruefalse10false2falsefalsefalseundefined".split(true).join(3).split("undefined").
        join(4).split(false).map(Function(
        "return function(undefined){return this[parseInt(+undefined,5)]}")().bind("ESTINX")).join([]
        )

        (with coercion)

        \* -------------------------------------------------------------------------------------- */

        byDictRadix5AmendedBy2:
        defineStrategy
        (
            function (inputData, maxLength)
            {
                var output = this._encodeByDict(inputData, 5, 2, maxLength);
                return output;
            },
            ENCODING_TYPE_TEXT,
            194
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
                var output = this._encodeByDict(inputData, 5, 3, maxLength);
                return output;
            },
            ENCODING_TYPE_TEXT,
            506
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
                var output = this._encodeBySparseFigures(inputData, maxLength);
                return output;
            },
            ENCODING_TYPE_TEXT,
            183
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
                var output = this._encodeExpress(input, maxLength);
                return output;
            },
            ENCODING_TYPE_EXPRESSION,
            0
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
            },
            ENCODING_TYPE_TEXT,
            0
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
            },
            ENCODING_TYPE_COMBINED,
            0
        ),
    };
}
)();

var TEXT_STRATEGY_NAMES =
_Object_keys(STRATEGIES).filter
(
    function (strategyName)
    {
        var returnValue = STRATEGIES[strategyName].encodingType === ENCODING_TYPE_TEXT;
        return returnValue;
    }
)
.sort
(
    function (strategyName1, strategyName2)
    {
        var minInputLength1 = STRATEGIES[strategyName1].minInputLength;
        var minInputLength2 = STRATEGIES[strategyName2].minInputLength;
        var diff = minInputLength2 - minInputLength1;
        return diff;
    }
);

assignNoEnum
(
    Encoder.prototype,
    {
        _createDblDictEncoding:
        function (formatMapper, charIndexFigureArrayStr, figureLegend, legend, maxLength)
        {
            var argName = formatMapper.argName;
            var accessor = '.indexOf(' + argName + ')';
            var mapper = formatMapper(accessor);
            var concatReplacement = this.resolveConstant('CONCAT').replacement;
            var maxCombinedLegendLength = maxLength - charIndexFigureArrayStr.length - 10;
            var combinedLegend =
            joinWithMaxLength
            (
                maxCombinedLegendLength,
                '[',
                figureLegend,
                '][',
                concatReplacement,
                '](',
                legend,
                ')'
            );
            if (!combinedLegend)
                return;
            var replacement =
            createMappedArrayEncoding
            (this, charIndexFigureArrayStr, mapper, combinedLegend, maxLength);
            return replacement;
        },

        _createDictEncoding:
        function (charIndexArrayStr, legend, radix, coerceToInt, maxLength)
        {
            var mapper;
            if (radix)
            {
                var formatMapper = this.findDefinition(FORMAT_MAPPER_LONG);
                var argName = formatMapper.argName;
                var parseIntArg = (coerceToInt ? '+' : '') + argName;
                var accessor = '[parseInt(' + parseIntArg + ',' + radix + ')]';
                mapper = formatMapper(accessor);
            }
            else
                mapper = '"".charAt.bind';
            var replacement =
            createMappedArrayEncoding(this, charIndexArrayStr, mapper, legend, maxLength);
            return replacement;
        },

        _encodeByCharCodes:
        function (inputData, radix, maxLength)
        {
            var fromCharCode = this.findDefinition(FROM_CHAR_CODE);
            var output =
            createStrCodesEncoding
            (this, inputData, fromCharCode, splitIntoCharCodes, radix, maxLength);
            return output;
        },

        _encodeByCodePoints:
        function (inputData, radix, maxLength)
        {
            var output =
            createStrCodesEncoding
            (this, inputData, 'fromCodePoint', splitIntoCodePoints, radix, maxLength);
            return output;
        },

        _encodeByDenseFigures:
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

        _encodeByDict:
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
            this._createDictEncoding(charIndexArrayStr, legend, radix, coerceToInt, maxLength);
            return output;
        },

        _encodeBySparseFigures:
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

        _encodeExpress:
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

        _exec:
        function (input, wrapper, strategyNames, perfInfo)
        {
            var perfLog = this.perfLog = [];
            var output = callStrategies(this, input, { wrapper: wrapper }, strategyNames);
            if (perfInfo)
                perfInfo.perfLog = perfLog;
            delete this.perfLog;
            if (output == null)
                throw _Error('Encoding failed');
            return output;
        },

        _findFormatMapperShort:
        function ()
        {
            var formatMapper = this.findDefinition(FORMAT_MAPPER_SHORT);
            return formatMapper;
        },

        _joinCharArray:
        function (charArrayReplacement, maxLength)
        {
            var joinReplacement = this.resolveConstant('JOIN').replacement;
            var replacement =
            joinWithMaxLength(maxLength, charArrayReplacement, '[', joinReplacement, ']([])');
            return replacement;
        },

        _maxDecodableArgs:  65533, // Limit imposed by Internet Explorer.

        _replaceMapper:
        function (mapper)
        {
            var mapperReplacement = this.replaceExpr(mapper, true);
            return mapperReplacement;
        },

        replaceStringArray: replaceStringArray,
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
        var highSurrogateCharCode   = char.charCodeAt(0);
        var lowSurrogateCharCode    = char.charCodeAt(1);
        codePoint = codePointFromSurrogatePair(highSurrogateCharCode, lowSurrogateCharCode);
    }
    return codePoint;
};
