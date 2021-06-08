import
{
    APPEND_LENGTH_OF_DIGITS,
    APPEND_LENGTH_OF_DIGIT_0,
    APPEND_LENGTH_OF_DOT,
    APPEND_LENGTH_OF_MINUS,
    APPEND_LENGTH_OF_SMALL_E,
}
from '../append-lengths';
import
{
    CHARACTERS,
    CONSTANTS,
    JSFUCK_INFINITY,
    NATIVE_FUNCTION_INFOS,
    R_PADDINGS,
    SIMPLE,
}
from '../definitions';
import expressParseCached           from '../express-parse-cached';
import { featureFromMask }          from '../features';
import
{
    _Array_isArray,
    _Array_prototype_forEach,
    _JSON_stringify,
    _Math_abs,
    _Object_create,
    _Object_keys,
    _String,
    _SyntaxError,
    assignNoEnum,
    createEmpty,
    tryCreateRegExp,
}
from '../obj-utils';
import
{ SCREW_AS_STRING, SCREW_AS_BONDED_STRING, SCREW_NORMAL, ScrewBuffer }
from '../screw-buffer';
import { SimpleSolution }           from '../solution';
import { extraZeros, initStaticEncoder, replaceStaticString, shortestOf }
from './encoder-utils';
import replaceCharByAtob            from './replace-char-by-atob';
import replaceCharByCharCode        from './replace-char-by-char-code';
import replaceCharByEscSeq          from './replace-char-by-esc-seq';
import replaceCharByUnescape        from './replace-char-by-unescape';
import { SolutionType }             from 'novem';
import { maskIncludes, maskNew }    from 'quinquaginta-duo';

var STATIC_CHAR_CACHE   = createEmpty();
var STATIC_CONST_CACHE  = createEmpty();
var STATIC_ENCODER      = new Encoder(maskNew());

var BOND_STRENGTH_NONE      = 0;
var BOND_STRENGTH_WEAK      = 1;
var BOND_STRENGTH_STRONG    = 2;

/** @class Encoder */

export function Encoder(mask)
{
    this.mask       = mask;
    this.charCache  = _Object_create(STATIC_CHAR_CACHE);
    this.constCache = _Object_create(STATIC_CONST_CACHE);
    this.optimizers = createEmpty();
    this.stack      = [];
}

function callResolver(encoder, stackName, resolver)
{
    var stack = encoder.stack;
    var stackIndex = stack.indexOf(stackName);
    stack.push(stackName);
    try
    {
        if (~stackIndex)
        {
            var chain = stack.slice(stackIndex);
            var feature = featureFromMask(encoder.mask);
            var message = 'Circular reference detected: ' + chain.join(' < ') + ' – ' + feature;
            var error = new _SyntaxError(message);
            assignNoEnum(error, { chain: chain, feature: feature });
            throw error;
        }
        resolver.call(encoder);
    }
    finally
    {
        stack.pop();
    }
}

function defaultResolveCharacter(encoder, char)
{
    var charCode = char.charCodeAt();
    var atobOpt = charCode < 0x100;
    var solution = encoder.createCharDefaultSolution(char, charCode, atobOpt, true, true, true);
    return solution;
}

function evalNumber(preMantissa, lastDigit, exp)
{
    var value = +(preMantissa + lastDigit + 'e' + exp);
    return value;
}

function findOptimalSolution(encoder, source, entries, defaultSolutionType)
{
    var optimalSolution;
    entries.forEach
    (
        function (entry, entryIndex)
        {
            if (encoder.hasFeatures(entry.mask))
            {
                var solution = encoder.resolve(entry.definition, source, defaultSolutionType);
                if (!optimalSolution || optimalSolution.length > solution.length)
                {
                    optimalSolution = solution;
                    if (optimalSolution.entryCode == null)
                        optimalSolution.entryCode = entryIndex;
                }
            }
        },
        encoder
    );
    return optimalSolution;
}

function formatPositiveNumber(number)
{
    function getMantissa()
    {
        var lastDigitIndex = usefulDigits - 1;
        var preMantissa = digits.slice(0, lastDigitIndex);
        var lastDigit = +digits[lastDigitIndex];
        var value = evalNumber(preMantissa, lastDigit, exp);
        for (;;)
        {
            var decreasedLastDigit = lastDigit - 1;
            var newValue = evalNumber(preMantissa, decreasedLastDigit, exp);
            if (newValue !== value)
                break;
            lastDigit = decreasedLastDigit;
        }
        var mantissa = preMantissa + lastDigit;
        return mantissa;
    }

    var str;
    var match = /^(\d+)(?:\.(\d+))?(?:e(.+))?$/.exec(number);
    var digitsAfterDot = match[2] || '';
    var digits = (match[1] + digitsAfterDot).replace(/^0+/, '');
    var usefulDigits = digits.search(/0*$/);
    var exp = (match[3] | 0) - digitsAfterDot.length + digits.length - usefulDigits;
    var mantissa = getMantissa();
    if (exp >= 0)
    {
        if (exp < 10)
            str = mantissa + extraZeros(exp);
        else if (exp % 100 === 99 && (exp > 99 || mantissa[1]))
            str = mantissa.replace(/.$/, '.$&e') + (exp + 1);
        else
            str = mantissa + 'e' + exp;
    }
    else
    {
        if (exp >= -mantissa.length)
            str = mantissa.slice(0, exp) + '.' + mantissa.slice(exp);
        else
        {
            var extraZeroCount = -mantissa.length - exp;
            var extraLength = APPEND_LENGTH_OF_DOT + APPEND_LENGTH_OF_DIGIT_0 * extraZeroCount;
            str =
            replaceNegativeExponential(mantissa, exp, extraLength) ||
            '.' + extraZeros(extraZeroCount) + mantissa;
        }
    }
    return str;
}

function getMultiDigitLength(str)
{
    var appendLength = 0;
    _Array_prototype_forEach.call
    (
        str,
        function (digit)
        {
            var digitAppendLength = APPEND_LENGTH_OF_DIGITS[digit];
            appendLength += digitAppendLength;
        }
    );
    return appendLength;
}

function getReplacers(optimize)
{
    var replaceString =
    function (encoder, str, options)
    {
        options.optimize = optimize;
        var replacement = encoder.replaceString(str, options);
        if (!replacement)
            throwSyntaxError(encoder, 'String too complex');
        return replacement;
    };
    var strReplacer =
    function (encoder, str, screwMode)
    {
        var options = { screwMode: screwMode };
        var replacement = replaceString(encoder, str, options);
        return replacement;
    };
    var strAppender =
    function (encoder, str, firstSolution)
    {
        var options = { firstSolution: firstSolution, screwMode: SCREW_AS_STRING };
        var replacement = replaceString(encoder, str, options);
        return replacement;
    };
    var replacers =
    { appendString: strAppender, identifier: replaceIdentifier, string: strReplacer };
    return replacers;
}

function isStringUnit(unit)
{
    var strUnit = typeof unit.value === 'string' && !unit.mod && !unit.pmod && !unit.ops.length;
    return strUnit;
}

function replaceIdentifier(encoder, identifier, bondStrength)
{
    var solution;
    if (identifier in encoder.constantDefinitions)
        solution = encoder.resolveConstant(identifier);
    else
        solution = SIMPLE[identifier];
    if (!solution)
        throwSyntaxError(encoder, 'Undefined identifier ' + identifier);
    var groupingRequired =
    bondStrength && solution.isLoose ||
    bondStrength > BOND_STRENGTH_WEAK && solution.replacement[0] === '!';
    var replacement = solution.replacement;
    if (groupingRequired)
        replacement = '(' + replacement + ')';
    return replacement;
}

export function replaceMultiDigitNumber(number)
{
    var str = formatPositiveNumber(number);
    var replacement = replaceStaticString(str);
    return replacement;
}

function replaceNegativeExponential(mantissa, exp, rivalExtraLength)
{
    var extraZeroCount;
    if (exp % 100 > 7 - 100)
    {
        if (exp % 10 > -7)
            extraZeroCount = 0;
        else
            extraZeroCount = 10 + exp % 10;
    }
    else
        extraZeroCount = 100 + exp % 100;
    mantissa += extraZeros(extraZeroCount);
    exp -= extraZeroCount;
    var extraLength =
    APPEND_LENGTH_OF_DIGIT_0 * extraZeroCount +
    APPEND_LENGTH_OF_SMALL_E +
    APPEND_LENGTH_OF_MINUS +
    getMultiDigitLength(_String(-exp));
    if (extraLength < rivalExtraLength)
    {
        var str = mantissa + 'e' + exp;
        return str;
    }
}

function replacePrimaryExpr(encoder, unit, bondStrength, unitIndices, maxLength, replacers)
{
    var MIN_APPEND_LENGTH = 3;

    var output;
    var terms;
    var identifier;
    var strAppender = replacers.appendString;
    if (terms = unit.terms)
    {
        var count = terms.length;
        var maxCoreLength = maxLength - (bondStrength ? 2 : 0);
        var canAppendString = false;
        for (var index = 0; index < count; ++index)
        {
            var term = terms[index];
            var termUnitIndices = count > 1 ? unitIndices.concat(index) : unitIndices;
            if (strAppender && isStringUnit(term))
            {
                var firstSolution;
                if (output)
                {
                    if (!canAppendString)
                    {
                        throwSyntaxError
                        (
                            encoder,
                            'Unsupported concatenation of a string to a potentially non-string ' +
                            'expression'
                        );
                    }
                    firstSolution =
                    new SimpleSolution(undefined, output, SolutionType.WEAK_PREFIXED_STRING);
                }
                else
                {
                    firstSolution = undefined;
                    canAppendString = true;
                }
                output = strAppender(encoder, term.value, firstSolution);
            }
            else
            {
                var maxTermLength =
                maxCoreLength - (output ? output.length + 1 : 0) -
                MIN_APPEND_LENGTH * (count - index - 1);
                var termOutput =
                encoder._replaceExpressUnit(term, index, termUnitIndices, maxTermLength, replacers);
                if (!termOutput)
                    return;
                if (output)
                    output += '+' + termOutput;
                else
                    output = termOutput;
            }
        }
        if (bondStrength)
            output = '(' + output + ')';
    }
    else if (identifier = unit.identifier)
    {
        var identifierReplacer = replacers.identifier;
        output = identifierReplacer(encoder, identifier, bondStrength, unitIndices, maxLength);
    }
    else
    {
        var value = unit.value;
        if (typeof value === 'string')
        {
            var strReplacer = replacers.string;
            var screwMode = bondStrength ? SCREW_AS_BONDED_STRING : SCREW_AS_STRING;
            output = strReplacer(encoder, value, screwMode, unitIndices, maxLength);
        }
        else if (_Array_isArray(value))
        {
            if (value.length)
            {
                var replacement =
                encoder._replaceExpressUnit
                (value[0], false, unitIndices, maxLength - 2, replacers);
                if (replacement)
                    output = '[' + replacement + ']';
            }
            else if (!(maxLength < 2))
                output = '[]';
        }
        else
        {
            if (typeof value === 'number' && value === value)
            {
                var abs = _Math_abs(value);
                var negative = value < 0 || 1 / value < 0;
                var str;
                if (abs === 0)
                    str = '0';
                else if (abs === Infinity)
                    str = JSFUCK_INFINITY;
                else
                    str = formatPositiveNumber(abs);
                if (negative)
                    str = '-' + str;
                output = replaceStaticString(str);
                if (str.length > 1)
                    output = '+(' + output + ')';
                if (bondStrength)
                    output = '(' + output + ')';
            }
            else
                output = replaceIdentifier(STATIC_ENCODER, _String(value), bondStrength);
            if (output.length > maxLength)
                return;
        }
    }
    return output;
}

function resolveCharByDefaultMethod(encoder, char, charCode, replaceChar, entryCode)
{
    var replacement = replaceChar.call(encoder, charCode);
    var solution = new SimpleSolution(char, replacement, SolutionType.STRING);
    solution.entryCode = entryCode;
    return solution;
}

function throwSyntaxError(encoder, message)
{
    var stack = encoder.stack;
    var stackLength = stack.length;
    if (stackLength)
        message += ' in the definition of ' + stack[stackLength - 1];
    throw new _SyntaxError(message);
}

var matchSimpleAt =
(function ()
{
    var matchSimpleAt;
    var pattern = _Object_keys(SIMPLE).join('|');
    var regExp = tryCreateRegExp(pattern, 'y');
    if (regExp)
    {
        matchSimpleAt =
        function (str, index)
        {
            regExp.lastIndex = index;
            var match = str.match(regExp);
            if (match)
                return match[0];
        };
    }
    else
    {
        matchSimpleAt =
        function (str, index)
        {
            for (var simple in SIMPLE)
            {
                var substr = str.substr(index, simple.length);
                if (substr === simple)
                    return simple;
            }
        };
    }
    return matchSimpleAt;
}
)();

assignNoEnum
(
    Encoder.prototype,
    {
        $replaceCharByAtob: replaceCharByAtob,

        $replaceCharByCharCode: replaceCharByCharCode,

        $replaceCharByEscSeq: replaceCharByEscSeq,

        $replaceCharByUnescape: replaceCharByUnescape,

        $resolveCharInNativeFunction:
        function (char, offset, getPaddingEntries, paddingShifts)
        {
            var nativeFunctionInfo = this.nativeFunctionInfo;
            if (!nativeFunctionInfo)
            {
                nativeFunctionInfo = this.findDefinition(NATIVE_FUNCTION_INFOS);
                this.nativeFunctionInfo = nativeFunctionInfo;
            }
            var expr = nativeFunctionInfo.expr;
            var index = offset + nativeFunctionInfo.shift;
            var paddingEntries = getPaddingEntries(index);
            var solution = this.resolveCharInExpr(char, expr, index, paddingEntries, paddingShifts);
            return solution;
        },

        _replaceExpressUnit:
        function (unit, bond, unitIndices, maxLength, replacers)
        {
            var mod = unit.mod || '';
            var pmod = unit.pmod || '';
            var groupingRequired = bond && mod[0] === '+';
            var maxCoreLength =
            maxLength - (mod ? (groupingRequired ? 2 : 0) + mod.length : 0) - pmod.length;
            var ops = unit.ops;
            var opCount = ops.length;
            var primaryExprBondStrength =
            opCount || pmod ?
            BOND_STRENGTH_STRONG : bond || mod ? BOND_STRENGTH_WEAK : BOND_STRENGTH_NONE;
            var output =
            replacePrimaryExpr
            (this, unit, primaryExprBondStrength, unitIndices, maxCoreLength, replacers);
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
                            strReplacer(this, str, SCREW_NORMAL, opUnitIndices, maxOpLength);
                        }
                        else
                        {
                            opOutput =
                            this._replaceExpressUnit
                            (op, false, opUnitIndices, maxOpLength, replacers);
                        }
                        if (!opOutput)
                            return;
                        if (type === 'get')
                            output += '[' + opOutput + ']';
                        else
                            output += '(' + opOutput + ')';
                    }
                }
                output += pmod;
                if (mod)
                {
                    output = mod + output;
                    if (groupingRequired)
                        output = '(' + output + ')';
                }
            }
            return output;
        },

        constantDefinitions: CONSTANTS,

        createCharDefaultSolution:
        function (char, charCode, atobOpt, charCodeOpt, escSeqOpt, unescapeOpt)
        {
            var solution;
            if (atobOpt && this.findDefinition(CONSTANTS.atob))
            {
                solution =
                resolveCharByDefaultMethod(this, char, charCode, replaceCharByAtob, 'atob');
            }
            else
            {
                var solutions = [];
                if (charCodeOpt)
                {
                    solution =
                    resolveCharByDefaultMethod
                    (this, char, charCode, replaceCharByCharCode, 'char-code');
                    solutions.push(solution);
                }
                if (escSeqOpt)
                {
                    solution =
                    resolveCharByDefaultMethod
                    (this, char, charCode, replaceCharByEscSeq, 'esc-seq');
                    solutions.push(solution);
                }
                if (unescapeOpt)
                {
                    solution =
                    resolveCharByDefaultMethod
                    (this, char, charCode, replaceCharByUnescape, 'unescape');
                    solutions.push(solution);
                }
                solution = shortestOf(solutions);
            }
            return solution;
        },

        findDefinition:
        function (entries)
        {
            for (var entryIndex = entries.length; entryIndex--;)
            {
                var entry = entries[entryIndex];
                if (this.hasFeatures(entry.mask))
                    return entry.definition;
            }
        },

        getPaddingBlock:
        function (length)
        {
            var paddingBlock = R_PADDINGS[length];
            if (paddingBlock !== undefined)
                return paddingBlock;
            throwSyntaxError(this, 'Undefined regular padding block with length ' + length);
        },

        hasFeatures:
        function (mask)
        {
            var included = maskIncludes(this.mask, mask);
            return included;
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

        replaceExpr:
        function (expr, optimize)
        {
            var unit = expressParseCached(expr);
            if (!unit || unit === true)
                throwSyntaxError(this, 'Syntax error');
            var replacers = getReplacers(optimize);
            var replacement = this._replaceExpressUnit(unit, false, [], NaN, replacers);
            return replacement;
        },

        /**
         * Replaces a given string with equivalent JSFuck code.
         *
         * @function Encoder#replaceString
         *
         * @param {string} str
         * The string to replace.
         *
         * @param {object} [options={ }]
         * An optional object specifying replacement options.
         *
         * @param {SimpleSolution} [options.firstSolution]
         * An optional solution to be prepended to the replacement string.
         *
         * @param {number} [options.maxLength=(NaN)]
         * The maximum length of the replacement expression.
         *
         * If the replacement expression exceeds the specified length, the return value is
         * `undefined`.
         *
         * If this parameter is `NaN`, then no length limit is imposed.
         *
         * @param {boolean|object<string, boolean>} [options.optimize=false]
         * Specifies which optimizations should be attempted.
         *
         * Optimizations may reduce the length of the replacement string, but they also reduce the
         * performance and may lead to unwanted circular dependencies when resolving definitions.
         *
         * This parameter can be set to a boolean value in order to turn all optimizations on
         * (`true`) or off (`false`).
         * In order to turn specific optimizations on or off, specify an object that maps
         * optimization names with the suffix "Opt" to a boolean setting.
         * Currently supported settings are `commaOpt`, `complexOpt` and `toStringOpt`.
         * When an object is specified, undefined optimization settings default to `true`.
         *
         * @param {number} [options.screwMode=SCREW_NORMAL]
         * Specifies how the replacement will be used.
         *
         * <dl>
         *
         * <dt><code>SCREW_NORMAL</code></dt>
         * <dd>
         * Generates code suitable for being used as a function argument or indexer.
         * The generated replacement is not guaranteed to evaluate to a string but will have the
         * string representation specified by the input string.
         * </dd>
         *
         * <dt><code>SCREW_AS_STRING</code></dt>
         * <dd>
         * Generates code suitable for being used as a standalone string or as the start of a
         * concatenated string or as an argument to a function that expects a string.
         * </dd>
         *
         * <dt><code>SCREW_AS_BONDED_STRING</code></dt>
         * <dd>
         * Generates code suitable for being used with any unary operators, as a property access
         * target, or in concatenation with any expression.
         * </dd>
         *
         * </dl>
         *
         * @returns {string|undefined}
         * The replacement string or `undefined`.
         */

        replaceString:
        function (str, options)
        {
            options = options || { };
            var optimizerList = this.getOptimizerList(str, options.optimize);
            var screwMode = options.screwMode || SCREW_NORMAL;
            var buffer = new ScrewBuffer(screwMode, this.maxGroupThreshold, optimizerList);
            var firstSolution = options.firstSolution;
            var maxLength = options.maxLength;
            if (firstSolution)
            {
                buffer.append(firstSolution);
                if (buffer.length > maxLength)
                    return;
            }
            var length = str.length;
            for (var index = 0; index < length;)
            {
                var solution;
                var simple = matchSimpleAt(str, index);
                if (simple)
                {
                    index += simple.length;
                    solution = SIMPLE[simple];
                }
                else
                {
                    var char = str[index++];
                    solution = this.resolveCharacter(char);
                }
                if (!buffer.append(solution) || buffer.length > maxLength)
                    return;
            }
            var replacement = _String(buffer);
            if (!(replacement.length > maxLength))
                return replacement;
        },

        resolve:
        function (definition, source, defaultSolutionType)
        {
            var solution;
            var type = typeof definition;
            if (type === 'function')
                solution = definition.call(this, source);
            else
            {
                var expr;
                var solutionType;
                var optimize;
                if (type === 'object')
                {
                    expr            = definition.expr;
                    solutionType    = definition.solutionType;
                    optimize        = definition.optimize;
                }
                else
                    expr = definition;
                var replacement = this.replaceExpr(expr, optimize);
                if (solutionType == null)
                {
                    solutionType =
                    defaultSolutionType != null ? defaultSolutionType : SolutionType.STRING;
                }
                solution = new SimpleSolution(source, replacement, solutionType);
            }
            return solution;
        },

        resolveCharInExpr:
        function (char, expr, index, paddingEntries, paddingShifts)
        {
            if (!paddingEntries)
                throwSyntaxError(this, 'Missing padding entries for index ' + index);
            var padding = this.findDefinition(paddingEntries);
            var paddingBlock;
            var shiftedIndex;
            if (typeof padding === 'number')
            {
                var paddingShift = this.findDefinition(paddingShifts);
                paddingBlock = this.getPaddingBlock(padding);
                shiftedIndex = index + padding + paddingShift;
            }
            else
            {
                paddingBlock = padding.block;
                shiftedIndex = padding.shiftedIndex;
            }
            var fullExpr = '(' + paddingBlock + '+' + expr + ')[' + shiftedIndex + ']';
            var replacement = this.replaceExpr(fullExpr);
            var solution = new SimpleSolution(char, replacement, SolutionType.STRING);
            return solution;
        },

        resolveCharacter:
        function (char)
        {
            var charCache = this.charCache;
            var solution = charCache[char];
            if (solution === undefined)
            {
                callResolver
                (
                    this,
                    _JSON_stringify(char),
                    function ()
                    {
                        var entries = CHARACTERS[char];
                        if (!entries || _Array_isArray(entries))
                        {
                            if (entries)
                                solution = findOptimalSolution(this, char, entries);
                            if (!solution)
                                solution = defaultResolveCharacter(this, char);
                        }
                        else
                        {
                            solution = STATIC_ENCODER.resolve(entries, char);
                            solution.entryCode = 'static';
                            charCache = STATIC_CHAR_CACHE;
                        }
                        charCache[char] = solution;
                    }
                );
            }
            return solution;
        },

        resolveConstant:
        function (constant)
        {
            var constCache = this.constCache;
            var solution = constCache[constant];
            if (solution === undefined)
            {
                callResolver
                (
                    this,
                    constant,
                    function ()
                    {
                        var entries = this.constantDefinitions[constant];
                        if (_Array_isArray(entries))
                        {
                            solution =
                            findOptimalSolution(this, constant, entries, SolutionType.OBJECT);
                        }
                        else
                        {
                            solution =
                            STATIC_ENCODER.resolve(entries, undefined, SolutionType.OBJECT);
                            constCache = STATIC_CONST_CACHE;
                        }
                        constCache[constant] = solution;
                    }
                );
            }
            return solution;
        },
    }
);

initStaticEncoder(STATIC_ENCODER);
