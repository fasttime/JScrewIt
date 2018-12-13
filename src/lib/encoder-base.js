/*
global
BASE64_ALPHABET_HI_2,
BASE64_ALPHABET_HI_4,
BASE64_ALPHABET_HI_6,
BASE64_ALPHABET_LO_2,
BASE64_ALPHABET_LO_4,
BASE64_ALPHABET_LO_6,
CHARACTERS,
COMPLEX,
CONSTANTS,
JSFUCK_INFINITY,
LEVEL_NUMERIC,
LEVEL_STRING,
LEVEL_UNDEFINED,
OPTIMAL_B,
SIMPLE,
ScrewBuffer,
Solution,
_Array,
_Array_isArray,
_Array_prototype_forEach,
_JSON_stringify,
_Math_abs,
_Math_max,
_Object_keys,
_RegExp,
_String,
_SyntaxError,
assignNoEnum,
createConstructor,
createEmpty,
expressParse,
featureFromMask,
getComplexOptimizer,
getToStringOptimizer,
maskIncludes,
maskNew,
*/

var APPEND_LENGTH_OF_DIGITS;
var APPEND_LENGTH_OF_DIGIT_0;
var APPEND_LENGTH_OF_EMPTY;
var APPEND_LENGTH_OF_PLUS_SIGN;
var APPEND_LENGTH_OF_SMALL_E;

var Encoder;

var replaceMultiDigitNumber;
var resolveSimple;

(function ()
{
    function evalNumber(preMantissa, lastDigit, exp)
    {
        var value = +(preMantissa + lastDigit + 'e' + exp);
        return value;
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
                str = mantissa + getExtraZeros(exp);
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
                '.' + getExtraZeros(extraZeroCount) + mantissa;
            }
        }
        return str;
    }

    function getExtraZeros(count)
    {
        var extraZeros = _Array(count + 1).join('0');
        return extraZeros;
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
                encoder.throwSyntaxError('String too complex');
            return replacement;
        };
        var strReplacer =
        function (encoder, str, bond, forceString)
        {
            var options = { bond: bond, forceString: forceString };
            var replacement = replaceString(encoder, str, options);
            return replacement;
        };
        var strAppender =
        function (encoder, str, firstSolution)
        {
            var options = { firstSolution: firstSolution, forceString: true };
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
        else if (identifier in SIMPLE)
            solution = SIMPLE[identifier];
        if (!solution)
            encoder.throwSyntaxError('Undefined identifier ' + identifier);
        var groupingRequired =
        bondStrength && solution.hasOuterPlus ||
        bondStrength > BOND_STRENGTH_WEAK && solution.charAt(0) === '!';
        var replacement = solution.replacement;
        if (groupingRequired)
            replacement = '(' + replacement + ')';
        return replacement;
    }

    function replaceIndexer(index)
    {
        var replacement = '[' + STATIC_ENCODER.replaceString(index) + ']';
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
        mantissa += getExtraZeros(extraZeroCount);
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

    function shortestOf(objs)
    {
        var shortestObj;
        var shortestLength = Infinity;
        objs.forEach
        (
            function (obj)
            {
                var length = obj.length;
                if (length < shortestLength)
                {
                    shortestObj = obj;
                    shortestLength = length;
                }
            }
        );
        return shortestObj;
    }

    var STATIC_CHAR_CACHE = createEmpty();
    var STATIC_CONST_CACHE = createEmpty();

    var CharCache = createConstructor(STATIC_CHAR_CACHE);
    var ConstCache = createConstructor(STATIC_CONST_CACHE);

    var quoteString = _JSON_stringify;

    APPEND_LENGTH_OF_DIGIT_0    = 6;
    APPEND_LENGTH_OF_EMPTY      = 3; // Append length of the empty array
    APPEND_LENGTH_OF_PLUS_SIGN  = 71;
    APPEND_LENGTH_OF_SMALL_E    = 26;

    APPEND_LENGTH_OF_DIGITS     = [APPEND_LENGTH_OF_DIGIT_0, 8, 12, 17, 22, 27, 32, 37, 42, 47];

    Encoder =
    function (mask)
    {
        this.mask       = mask;
        this.charCache  = new CharCache();
        this.constCache = new ConstCache();
        this.optimizers = createEmpty();
        this.stack      = [];
    };

    var encoderProtoSource =
    {
        callResolver:
        function (stackName, resolver)
        {
            var stack = this.stack;
            var stackIndex = stack.indexOf(stackName);
            stack.push(stackName);
            try
            {
                if (~stackIndex)
                {
                    var chain = stack.slice(stackIndex);
                    var feature = featureFromMask(this.mask);
                    var message =
                    'Circular reference detected: ' + chain.join(' < ') + ' – ' + feature;
                    var error = new _SyntaxError(message);
                    assignNoEnum(error, { chain: chain, feature: feature });
                    throw error;
                }
                resolver.call(this);
            }
            finally
            {
                stack.pop();
            }
        },

        constantDefinitions: CONSTANTS,

        createCharDefaultSolution:
        function (charCode, atobOpt, charCodeOpt, escSeqOpt, unescapeOpt)
        {
            var replacement;
            if (atobOpt && this.findDefinition(CONSTANTS.atob))
                replacement = this.replaceCharByAtob(charCode);
            else
            {
                var replacements = [];
                if (charCodeOpt)
                {
                    replacement = this.replaceCharByCharCode(charCode);
                    replacements.push(replacement);
                }
                if (escSeqOpt)
                {
                    replacement = this.replaceCharByEscSeq(charCode);
                    replacements.push(replacement);
                }
                if (unescapeOpt)
                {
                    replacement = this.replaceCharByUnescape(charCode);
                    replacements.push(replacement);
                }
                replacement = shortestOf(replacements);
            }
            var solution = new Solution(replacement, LEVEL_STRING, false);
            return solution;
        },

        defaultResolveCharacter:
        function (char)
        {
            var charCode = char.charCodeAt();
            var atobOpt = charCode < 0x100;
            var solution = this.createCharDefaultSolution(charCode, atobOpt, true, true, true);
            return solution;
        },

        expressParse:
        function (expr)
        {
            var unit = expressParse(expr);
            return unit;
        },

        findBase64AlphabetDefinition:
        function (element)
        {
            var definition;
            if (_Array_isArray(element))
                definition = this.findDefinition(element);
            else
                definition = element;
            return definition;
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

        findOptimalSolution:
        function (entries)
        {
            var result;
            entries.forEach
            (
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

        getPaddingBlock:
        function (paddingInfo, length)
        {
            var paddingBlock = paddingInfo.blocks[length];
            if (paddingBlock !== undefined)
                return paddingBlock;
            this.throwSyntaxError('Undefined padding block with length ' + length);
        },

        hasFeatures:
        function (mask)
        {
            var included = maskIncludes(this.mask, mask);
            return included;
        },

        hexCodeOf:
        function (charCode, hexDigitCount)
        {
            var optimalB = this.findDefinition(OPTIMAL_B);
            var charCodeStr = charCode.toString(16);
            var hexCodeSmallB =
            getExtraZeros(hexDigitCount - charCodeStr.length) +
            charCodeStr.replace(/fa?$/, 'false');
            var hexCode = hexCodeSmallB.replace(/b/g, optimalB);
            if (optimalB !== 'b' && /(?=.*b.*b)(?=.*c)|(?=.*b.*b.*b)/.test(charCodeStr))
            {
                // optimalB is not "b", but the character code is a candidate for toString
                // clustering, which only works with "b".
                var replacementSmallB = this.replaceString('f' + hexCodeSmallB, { optimize: true });
                var replacement = this.replaceString('f' + hexCode);
                if (replacementSmallB.length < replacement.length)
                    hexCode = hexCodeSmallB;
            }
            return hexCode;
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

        replaceCharByAtob:
        function (charCode)
        {
            var param1 =
            BASE64_ALPHABET_LO_6[charCode >> 2] + BASE64_ALPHABET_HI_2[charCode & 0x03];
            var postfix1 = '(' + this.replaceString(param1) + ')';
            if (param1.length > 2)
                postfix1 += replaceIndexer(0);

            var param2Left = this.findBase64AlphabetDefinition(BASE64_ALPHABET_LO_4[charCode >> 4]);
            var param2Right =
            this.findBase64AlphabetDefinition(BASE64_ALPHABET_HI_4[charCode & 0x0f]);
            var param2 = param2Left + param2Right;
            var index2 = 1 + (param2Left.length - 2) / 4 * 3;
            var indexer2 = replaceIndexer(index2);
            var postfix2 = '(' + this.replaceString(param2) + ')' + indexer2;

            var param3Left = BASE64_ALPHABET_LO_2[charCode >> 6];
            var param3 = param3Left + BASE64_ALPHABET_HI_6[charCode & 0x3f];
            var index3 = 2 + (param3Left.length - 3) / 4 * 3;
            var indexer3 = replaceIndexer(index3);
            var postfix3 = '(' + this.replaceString(param3) + ')' + indexer3;

            var postfix = shortestOf([postfix1, postfix2, postfix3]);
            var replacement = this.resolveConstant('atob') + postfix;
            return replacement;
        },

        replaceCharByCharCode:
        function (charCode)
        {
            var arg =
            charCode < 2 ? ['[]', 'true'][charCode] :
            charCode < 10 ? charCode :
            '"' + charCode + '"';
            var replacement = this.replaceExpr('String[FROM_CHAR_CODE](' + arg + ')');
            return replacement;
        },

        replaceCharByEscSeq:
        function (charCode)
        {
            var escCode;
            var appendIndexer;
            var optimize;
            if (charCode >= 0xfd || charCode in LOW_UNICODE_ESC_SEQ_CODES)
            {
                escCode = 'u' + this.hexCodeOf(charCode, 4);
                appendIndexer = escCode.length > 5;
                optimize = true;
            }
            else
            {
                escCode = charCode.toString(8);
                appendIndexer = false;
                optimize = false;
            }
            var expr = 'Function("return\\"" + ESCAPING_BACKSLASH + "' + escCode + '\\"")()';
            if (appendIndexer)
                expr += '[0]';
            var replacement = this.replaceExpr(expr, { toStringOpt: optimize });
            return replacement;
        },

        replaceCharByUnescape:
        function (charCode)
        {
            var hexCode;
            var appendIndexer;
            var optimize;
            if (charCode < 0x100)
            {
                hexCode = this.hexCodeOf(charCode, 2);
                appendIndexer = hexCode.length > 2;
                optimize = false;
            }
            else
            {
                hexCode = 'u' + this.hexCodeOf(charCode, 4);
                appendIndexer = hexCode.length > 5;
                optimize = true;
            }
            var expr = 'unescape("%' + hexCode + '")';
            if (appendIndexer)
                expr += '[0]';
            var replacement = this.replaceExpr(expr, { toStringOpt: optimize });
            return replacement;
        },

        replaceExpr:
        function (expr, optimize)
        {
            var unit = this.expressParse(expr);
            if (!unit)
                this.throwSyntaxError('Syntax error');
            var replacers = getReplacers(optimize);
            var replacement = this.replaceExpressUnit(unit, false, [], NaN, replacers);
            return replacement;
        },

        replaceExpressUnit:
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
            this.replacePrimaryExpr
            (unit, primaryExprBondStrength, unitIndices, maxCoreLength, replacers);
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
                            this.replaceExpressUnit
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

        replacePrimaryExpr:
        function (unit, bondStrength, unitIndices, maxLength, replacers)
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
                var minOutputLevel = LEVEL_UNDEFINED;
                for (var index = 0; index < count; ++index)
                {
                    var term = terms[index];
                    var termUnitIndices = count > 1 ? unitIndices.concat(index) : unitIndices;
                    if (strAppender && isStringUnit(term))
                    {
                        var firstSolution =
                        output ? new Solution(output, minOutputLevel) : undefined;
                        output = strAppender(this, term.value, firstSolution);
                        minOutputLevel = LEVEL_STRING;
                    }
                    else
                    {
                        var maxTermLength =
                        maxCoreLength - (output ? output.length + 1 : 0) -
                        MIN_APPEND_LENGTH * (count - index - 1);
                        var termOutput =
                        this.replaceExpressUnit
                        (term, index, termUnitIndices, maxTermLength, replacers);
                        if (!termOutput)
                            return;
                        if (output)
                        {
                            output += '+' + termOutput;
                            minOutputLevel = _Math_max(minOutputLevel, LEVEL_NUMERIC);
                        }
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
                output = identifierReplacer(this, identifier, bondStrength, unitIndices, maxLength);
            }
            else
            {
                var value = unit.value;
                if (typeof value === 'string')
                {
                    var strReplacer = replacers.string;
                    output = strReplacer(this, value, bondStrength, true, unitIndices, maxLength);
                }
                else if (_Array_isArray(value))
                {
                    if (value.length)
                    {
                        var replacement =
                        this.replaceExpressUnit
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
                        output = STATIC_ENCODER.replaceString(str);
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
        },

        replaceStaticString:
        function (str, maxLength)
        {
            var options = { bond: true, forceString: true, maxLength: maxLength };
            var replacement = STATIC_ENCODER.replaceString(str, options);
            return replacement;
        },

        /**
         * Replace a given string with equivalent JSFuck code.
         *
         * @param {string} str The string to replace.
         *
         * @param {object} [options={ }] An optional object specifying replacement options.
         *
         * @param {boolean} [options.bond=false]
         * <p>
         * Indicates whether the replacement expression should be bonded.</p>
         * <p>
         * An expression is bonded if it can be treated as a single unit by any valid operators
         * placed immediately before or after it.
         * E.g. `[][[]]` is bonded but `![]` is not, because `![][[]]` is different from
         * `(![])[[]]`.
         * More exactly, a bonded expression does not contain an outer plus and does not start
         * with `!`.</p>
         * <p>
         * Any expression becomes bonded when enclosed into parentheses.</p>
         *
         * @param {Solution} [options.firstSolution]
         * An optional solution to be prepended to the replacement string.
         *
         * @param {boolean} [options.forceString=false]
         * <p>
         * Indicates whether the replacement expression should evaluate to a string.</p>
         * <p>
         * Any expression can be converted into a string by appending `+[]`.</p>
         *
         * @param {number} [options.maxLength=(NaN)]
         * <p>
         * The maximum length of the replacement expression.</p>
         * <p>
         * If the replacement expression exceeds the specified length, the return value is
         * `undefined`.</p>
         * <p>
         * If this parameter is `NaN`, then no length limit is imposed.</p>
         *
         * @param {boolean|object<string, boolean|*>} [options.optimize=false]
         * <p>
         * Specifies which optimizations should be attempted.</p>
         * <p>
         * Optimizations may reduce the length of the replacement string, but they also reduce the
         * performance and may lead to unwanted circular dependencies when resolving
         * definitions.</p>
         * <p>
         * This parameter can be set to a boolean value in order to turn all optimizations on
         * (`true`) or off (`false`).
         * In order to turn specific optimizations on or off, specify an object that maps
         * optimization names with the suffix "Opt" to booleans, or to any other optimization
         * specific kind of data.</p>
         *
         * @returns {string} The replacement string.
         */

        replaceString:
        function (str, options)
        {
            options = options || { };
            var optimize = options.optimize;
            var optimizerList = [];
            if (optimize)
            {
                var optimizeComplex;
                var optimizeToString;
                if (typeof optimize === 'object')
                {
                    optimizeComplex     = !!optimize.complexOpt;
                    optimizeToString    = !!optimize.toStringOpt;
                }
                else
                    optimizeComplex = optimizeToString = true;
                var optimizers = this.optimizers;
                var optimizer;
                if (optimizeComplex)
                {
                    var complexOptimizers = optimizers.complex;
                    if (!complexOptimizers)
                        complexOptimizers = optimizers.complex = createEmpty();
                    for (var complex in COMPLEX)
                    {
                        var entry = COMPLEX[complex];
                        if (this.hasFeatures(entry.mask) && str.indexOf(complex) >= 0)
                        {
                            optimizer =
                            complexOptimizers[complex] ||
                            (
                                complexOptimizers[complex] =
                                getComplexOptimizer(this, complex, entry.definition)
                            );
                            optimizerList.push(optimizer);
                        }
                    }
                }
                if (optimizeToString)
                {
                    optimizer =
                    optimizers.toString || (optimizers.toString = getToStringOptimizer(this));
                    optimizerList.push(optimizer);
                }
            }
            var buffer =
            new ScrewBuffer
            (options.bond, options.forceString, this.maxGroupThreshold, optimizerList);
            var firstSolution = options.firstSolution;
            var maxLength = options.maxLength;
            if (firstSolution)
            {
                buffer.append(firstSolution);
                if (buffer.length > maxLength)
                    return;
            }
            var match;
            var regExp = _RegExp(STR_TOKEN_PATTERN, 'g');
            while (match = regExp.exec(str))
            {
                var token;
                var solution;
                if (token = match[2])
                    solution = this.resolveCharacter(token);
                else
                {
                    token = match[1];
                    solution = SIMPLE[token];
                }
                if (!buffer.append(solution) || buffer.length > maxLength)
                    return;
            }
            var result = _String(buffer);
            if (!(result.length > maxLength))
                return result;
        },

        resolve:
        function (definition)
        {
            var solution;
            var type = typeof definition;
            if (type === 'function')
                solution = definition.call(this);
            else
            {
                var expr;
                var level;
                var optimize;
                if (type === 'object')
                {
                    expr        = definition.expr;
                    level       = definition.level;
                    optimize    = definition.optimize;
                }
                else
                    expr = definition;
                var replacement = this.replaceExpr(expr, optimize);
                solution = new Solution(replacement, level);
            }
            return solution;
        },

        resolveCharacter:
        function (char)
        {
            var solution = this.charCache[char];
            if (solution === undefined)
            {
                this.callResolver
                (
                    quoteString(char),
                    function ()
                    {
                        var charCache;
                        var entries = CHARACTERS[char];
                        if (!entries || _Array_isArray(entries))
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
                            solution.entryIndex = 'static';
                            charCache = STATIC_CHAR_CACHE;
                        }
                        solution.char = char;
                        if (solution.level == null)
                            solution.level = LEVEL_STRING;
                        charCache[char] = solution;
                    }
                );
            }
            return solution;
        },

        resolveConstant:
        function (constant)
        {
            var solution = this.constCache[constant];
            if (solution === undefined)
            {
                this.callResolver
                (
                    constant,
                    function ()
                    {
                        var constCache;
                        var entries = this.constantDefinitions[constant];
                        if (_Array_isArray(entries))
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

        resolveExprAt:
        function (expr, index, entries, paddingInfos)
        {
            if (!entries)
                this.throwSyntaxError('Missing padding entries for index ' + index);
            var paddingDefinition = this.findDefinition(entries);
            var paddingBlock;
            var indexer;
            if (typeof paddingDefinition === 'number')
            {
                var paddingInfo = this.findDefinition(paddingInfos);
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
            var solution = new Solution(replacement, LEVEL_STRING, false);
            return solution;
        },

        throwSyntaxError:
        function (message)
        {
            var stack = this.stack;
            var stackLength = stack.length;
            if (stackLength)
                message += ' in the definition of ' + stack[stackLength - 1];
            throw new _SyntaxError(message);
        },
    };

    assignNoEnum(Encoder.prototype, encoderProtoSource);

    var APPEND_LENGTH_OF_DOT    = 73;
    var APPEND_LENGTH_OF_MINUS  = 136;

    var BOND_STRENGTH_NONE      = 0;
    var BOND_STRENGTH_WEAK      = 1;
    var BOND_STRENGTH_STRONG    = 2;

    var LOW_UNICODE_ESC_SEQ_CODES = createEmpty();

    [
        0x0f, 0x1f, 0x2f, 0x3f, 0x6f, 0x7f, 0xaf, 0xdf, 0xef,
        0xf0, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xfa,
    ]
    .forEach
    (
        function (charCode)
        {
            LOW_UNICODE_ESC_SEQ_CODES[charCode] = null;
        }
    );

    var STATIC_ENCODER = new Encoder(maskNew());

    var STR_TOKEN_PATTERN = '(' + _Object_keys(SIMPLE).join('|') + ')|([\\s\\S])';

    replaceMultiDigitNumber =
    function (number)
    {
        var str = formatPositiveNumber(number);
        var replacement = STATIC_ENCODER.replaceString(str);
        return replacement;
    };

    resolveSimple =
    function (simple, definition)
    {
        var solution;
        STATIC_ENCODER.callResolver
        (
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
