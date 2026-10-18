import
{
    CHARACTERS,
    CONSTANTS,
    JSFUCK_INFINITY,
    NATIVE_FUNCTION_INFOS,
    R_PADDINGS,
    SHORTCUTS,
    SIMPLE,
}
from '../definitions';
import { shortestOf }                               from '../encoding-utils';
import expressParseCached                           from '../express-parse-cached';
import { Feature }                                  from '../features';
import findDefinition                               from '../find-definition';
import formatPositiveNumber                         from '../format-positive-number';
import
{
    _Array_isArray,
    _Error,
    _JSON_stringify,
    _Math_abs,
    _Object_create,
    _Object_keys,
    _String,
    _SyntaxError,
    assignNoEnum,
    createEmpty,
    esToString,
    noop,
    tryCreateRegExp,
}
from '../obj-utils';
import
{ SCREW_AS_BONDED_STRING, SCREW_AS_STRING, SCREW_NORMAL, ScrewBuffer }
from '../screw-buffer';
import { SimpleSolution, SolutionType }             from '../solution';
import { initStaticEncoder, replaceStaticString }   from '../static-encoder';
import replaceCharByAtob                            from './replace-char-by-atob';
import replaceCharByCharCode                        from './replace-char-by-char-code';
import replaceCharByEscSeq                          from './replace-char-by-esc-seq';
import replaceCharByUnescape                        from './replace-char-by-unescape';
import { MASK_EMPTY, maskIncludes }                 from '~feature-hub';

/** @typedef {import('../solution').AbstractSolution} AbstractSolution */

var BOND_STRENGTH_NONE      = 0;
var BOND_STRENGTH_WEAK      = 1;
var BOND_STRENGTH_STRONG    = 2;

var RESOLVERS =
{
    __proto__:      null,
    charCommon:     resolveCharByCommonMethod,
    charInFn:       resolveCharInExpr,
    charInFnBody:   resolveCharInNativeFunction,
    charInFnHead:   resolveCharInNativeFunction,
};

var STATIC_CHAR_CACHE   = createEmpty();
var STATIC_CONST_CACHE  = createEmpty();
var STATIC_ENCODER      = new Encoder(MASK_EMPTY);

var featureFromMask = Feature._fromMask;

/** @class Encoder */
export default function Encoder(mask)
{
    this.mask               = mask;
    this._charCache         = _Object_create(STATIC_CHAR_CACHE);
    this._constCache        = _Object_create(STATIC_CONST_CACHE);
    this._definitionCache   = new WeakMap();
    this._optimizers        = createEmpty();
    this._shortcutCache     = createEmpty();
    this._stack             = [];
}

function callResolver(encoder, stackName, resolver)
{
    var stack = encoder._stack;
    var stackIndex = stack.indexOf(stackName);
    stack.push(stackName);
    try
    {
        if (~stackIndex)
        {
            var chain = stack.slice(stackIndex);
            var feature = featureFromMask(encoder.mask);
            var message = 'Circular reference detected: ' + chain.join(' < ') + ' – ' + feature;
            var error = _SyntaxError(message);
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
        }
    );
    return optimalSolution;
}

function getReplacers(optimize)
{
    var replaceString =
    function (encoder, str, options)
    {
        options.optimize = optimize;
        var replacement = encoder.replaceString(str, options);
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

function replacePrimaryExpr(encoder, unit, bondStrength, unitIndices, maxLength, replacers)
{
    var MIN_APPEND_LENGTH = 3;

    var output;
    var terms;
    var identifier;
    var strAppender = replacers.appendString;
    if (unit.ops.length)
        unitIndices = unitIndices.concat(0);
    if (terms = unit.terms)
    {
        var count = terms.length;
        var maxCoreLength = maxLength - (bondStrength ? 2 : 0);
        var canAppendString = false;
        for (var index = 0; index < count; index++)
        {
            var term = terms[index];
            var termUnitIndices = unitIndices.concat(index);
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
                    str = formatPositiveNumber(abs, negative);
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

/**
 * Replaces a given string with equivalent JSFuck code.
 *
 * @function Encoder#replaceString
 *
 * @param {string} str
 * The string to replace.
 *
 * @param {object} [options = { }]
 * An optional object specifying replacement options.
 *
 * @param {AbstractSolution} [options.firstSolution]
 * An optional solution to be prepended to the replacement string.
 *
 * @param {number} [options.maxLength = NaN]
 * The maximum length of the replacement expression.
 *
 * If the replacement expression exceeds the specified length, the return value is `undefined`.
 *
 * If this parameter is `NaN`, then no length limit is imposed.
 *
 * @param {boolean | object<string, boolean>} [options.optimize = false]
 * Specifies which optimizations should be attempted.
 *
 * Optimizations may reduce the length of the replacement string, but they also reduce the
 * performance and may lead to unwanted circular dependencies when resolving definitions.
 *
 * This parameter can be set to a boolean value in order to turn all optimizations on (`true`) or
 * off (`false`).
 * In order to turn specific optimizations on or off, specify an object that maps optimization names
 * with the suffix "Opt" to a boolean setting.
 * Currently supported settings are `atobOpt`, `btoaOpt`, `commaOpt`, `shortcutOpt`,
 * `surrogatePairOpt`, `toStringOpt` and `default`.
 * When an object is specified, undefined optimization settings have the value specified by
 * `default`, or `true` if `default` is not specified.
 *
 * @param {number} [options.screwMode = SCREW_NORMAL]
 * Specifies how the replacement will be used.
 *
 * <dl>
 *
 * <dt><code>SCREW_NORMAL</code></dt>
 * <dd>
 * Generates code suitable for being used as a function argument or indexer.
 * The generated replacement is not guaranteed to evaluate to a string but will have the string
 * representation specified by the input string.
 * </dd>
 *
 * <dt><code>SCREW_AS_STRING</code></dt>
 * <dd>
 * Generates code suitable for being used as a standalone string or as the start of a concatenated
 * string or as an argument to a function that expects a string.
 * </dd>
 *
 * <dt><code>SCREW_AS_BONDED_STRING</code></dt>
 * <dd>
 * Generates code suitable for being used with any unary operators, as a property access target, or
 * in concatenation with any expression.
 * </dd>
 *
 * </dl>
 *
 * @returns {string | undefined}
 * The replacement string or `undefined`.
 */
function replaceString(str, options)
{
    options = options || { };
    var optimizerList = this._getOptimizerList(str, options.optimize);
    var screwMode = options.screwMode || SCREW_NORMAL;
    var buffer = new ScrewBuffer(screwMode, optimizerList);
    var firstSolution = options.firstSolution;
    var maxLength = options.maxLength;
    if (firstSolution)
        buffer.append(firstSolution);
    if (buffer.length > maxLength)
        return;
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
        buffer.append(solution);
        if (buffer.length > maxLength)
            return;
    }
    var replacement = _String(buffer);
    if (!(replacement.length > maxLength))
        return replacement;
}

function resolveCharByCommonMethod(char)
{
    var charCode = char.charCodeAt();
    var atobOpt = charCode < 0x100;
    var stdOpt = !atobOpt;
    var solution = this._createCharCommonSolution(char, charCode, atobOpt, stdOpt, stdOpt, stdOpt);
    return solution;
}

function resolveCharByDefaultMethod(encoder, char, charCode, replaceChar, entryCode)
{
    var replacement = replaceChar.call(encoder, charCode);
    var solution = new SimpleSolution(char, replacement, SolutionType.STRING);
    solution.entryCode = entryCode;
    return solution;
}

function resolveCharInExpr(char, expr, index, paddingEntries, paddingShifts)
{
    if (!paddingEntries)
        throwSyntaxError(this, 'Missing padding entries for index ' + index);
    var padding = this.findDefinition(paddingEntries);
    var paddingBlock;
    var shiftedIndex;
    if (typeof padding === 'number')
    {
        var paddingShift = this.findDefinition(paddingShifts);
        paddingBlock = R_PADDINGS[padding];
        if (!paddingBlock)
            throwSyntaxError(this, 'Undefined regular padding block with length ' + padding);
        shiftedIndex = index + padding + paddingShift;
    }
    else
    {
        paddingBlock = padding.block;
        shiftedIndex = padding.shiftedIndex;
    }
    var fullExpr = '(' + paddingBlock + ' + ' + expr + ')[' + shiftedIndex + ']';
    var replacement = this.replaceExpr(fullExpr);
    var solution = new SimpleSolution(char, replacement, SolutionType.STRING);
    return solution;
}

function resolveCharInNativeFunction(char, offset, getPaddingEntries, paddingShifts)
{
    var nativeFunctionInfo = this.findDefinition(NATIVE_FUNCTION_INFOS);
    var expr = nativeFunctionInfo.expr;
    var index = offset + nativeFunctionInfo.shift;
    var paddingEntries = getPaddingEntries(index);
    var solution = this._resolveCharInExpr(char, expr, index, paddingEntries, paddingShifts);
    return solution;
}

/**
 * Resolves a character to a solution.
 *
 * The solution is cached, so that subsequent calls with the same character on the same encoder
 * return the same solution.
 *
 * @function Encoder#resolveCharacter
 *
 * @param {string} char
 * The character to resolve: a string consisting of exactly one UTF-16 code unit.
 *
 * If this parameter is not a string of length 1, an error is thrown.
 *
 * @returns {AbstractSolution}
 * The solution of the shortest definition of the character supported by the features of this
 * encoder, or a solution obtained by a default method if no such definition exists.
 */
function resolveCharacter(char)
{
    char = esToString(char);
    if (char.length !== 1)
        throw _Error('Invalid character ' + _JSON_stringify(char));
    var charCache = this._charCache;
    var solution = charCache[char];
    if (solution === undefined)
    {
        var charName = _JSON_stringify(char);
        callResolver
        (
            this,
            charName,
            function ()
            {
                var entries = CHARACTERS[char];
                if (!entries || _Array_isArray(entries))
                {
                    this._guardResolution(charName);
                    if (entries)
                        solution = findOptimalSolution(this, char, entries);
                    if (!solution)
                        solution = this._resolveCharByCommonMethod(char);
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
}

/**
 * Resolves a constant to a solution.
 *
 * The solution is cached, so that subsequent calls with the same constant on the same encoder
 * return the same solution.
 *
 * @function Encoder#resolveConstant
 *
 * @param {string} constant
 * The name of the constant to resolve.
 *
 * If no constant with the specified name is defined, an error is thrown.
 *
 * @returns {AbstractSolution | undefined}
 * The solution of the shortest definition of the constant supported by the features of this
 * encoder, or `undefined` if no such definition exists.
 */
function resolveConstant(constant)
{
    constant = esToString(constant);
    var constCache = this._constCache;
    var solution = constCache[constant];
    if (solution === undefined)
    {
        var entries = this.constantDefinitions[constant];
        if (entries == null)
            throw _Error('Undefined constant ' + constant);
        callResolver
        (
            this,
            constant,
            function ()
            {
                if (_Array_isArray(entries))
                {
                    this._guardResolution(constant);
                    solution = findOptimalSolution(this, constant, entries, SolutionType.OBJECT);
                }
                else
                {
                    solution = STATIC_ENCODER.resolve(entries, undefined, SolutionType.OBJECT);
                    constCache = STATIC_CONST_CACHE;
                }
                constCache[constant] = solution;
            }
        );
    }
    return solution;
}

/**
 * Resolves a shortcut to a solution.
 *
 * A shortcut is a string of multiple characters with its own definition, which the `shortcut`
 * optimizer uses to replace occurrences of the string as a whole rather than character by
 * character.
 *
 * The solution is cached, so that subsequent calls with the same shortcut on the same encoder
 * return the same solution.
 *
 * @function Encoder#resolveShortcut
 *
 * @param {string} shortcut
 * The shortcut to resolve.
 *
 * If no shortcut with the specified name is defined, an error is thrown.
 *
 * @returns {AbstractSolution | undefined}
 * The solution of the definition of the shortcut, or `undefined` if the definition is not
 * supported by the features of this encoder.
 */
function resolveShortcut(shortcut)
{
    shortcut = esToString(shortcut);
    var shortcutCache = this._shortcutCache;
    var solution = shortcutCache[shortcut];
    if (solution === undefined)
    {
        var entry = SHORTCUTS[shortcut];
        var shortcutName = _JSON_stringify(shortcut);
        if (entry == null)
            throw _Error('Undefined shortcut ' + shortcutName);
        callResolver
        (
            this,
            shortcutName,
            function ()
            {
                this._guardResolution(shortcutName);
                if (this.hasFeatures(entry.mask))
                    solution = this.resolve(entry.definition, shortcut);
                shortcutCache[shortcut] = solution;
            }
        );
    }
    return solution;
}

function throwSyntaxError(encoder, message)
{
    var stack = encoder._stack;
    var stackLength = stack.length;
    if (stackLength)
        message += ' in the definition of ' + stack[stackLength - 1];
    throw _SyntaxError(message);
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
            var match = regExp.exec(str);
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
        _createCharCommonSolution:
        function (char, charCode, atobOpt, charCodeOpt, escSeqOpt, unescapeOpt)
        {
            var solution;
            var solutions = [];
            if (atobOpt)
            {
                solution =
                resolveCharByDefaultMethod(this, char, charCode, replaceCharByAtob, 'atob');
                solutions.push(solution);
            }
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
                resolveCharByDefaultMethod(this, char, charCode, replaceCharByEscSeq, 'esc-seq');
                solutions.push(solution);
            }
            if (unescapeOpt)
            {
                solution =
                resolveCharByDefaultMethod(this, char, charCode, replaceCharByUnescape, 'unescape');
                solutions.push(solution);
            }
            solution = shortestOf.apply(null, solutions);
            return solution;
        },

        _guardResolution:           noop,

        _replaceCharByAtob:         replaceCharByAtob,

        _replaceCharByCharCode:     replaceCharByCharCode,

        _resolveCharByCommonMethod: resolveCharByCommonMethod,

        _replaceCharByEscSeq:       replaceCharByEscSeq,

        _replaceCharByUnescape:     replaceCharByUnescape,

        _resolveCharInExpr:         resolveCharInExpr,

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
                for (var index = 0; index < opCount; index++)
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

        constantDefinitions:        CONSTANTS,

        findDefinition:             findDefinition,

        hasFeatures:
        function (mask)
        {
            var included = maskIncludes(this.mask, mask);
            return included;
        },

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

        replaceString:              replaceString,

        resolve:
        function (definition, source, defaultSolutionType)
        {
            var solution;
            var type = typeof definition;
            if (type === 'function')
            {
                var resolverName = definition.resolverName;
                var resolver = RESOLVERS[resolverName].bind(this);
                solution = definition.call(resolver, source);
            }
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

        resolveCharacter:           resolveCharacter,

        resolveConstant:            resolveConstant,

        resolveShortcut:            resolveShortcut,
    }
);

STATIC_ENCODER._guardResolution =
function (name)
{
    throw _Error('Unable to resolve ' + name + ' statically');
};

initStaticEncoder(STATIC_ENCODER);
