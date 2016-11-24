/*
global
CHARACTERS,
COMPLEX,
CONSTANTS,
DEFAULT_16_BIT_CHARACTER_ENCODER,
DEFAULT_8_BIT_CHARACTER_ENCODER,
JSFUCK_INFINITY,
LEVEL_STRING,
OPTIMAL_B,
SIMPLE,
Empty,
ScrewBuffer,
array_isArray,
assignNoEnum,
createConstructor,
createSolution,
expressParse,
hasOuterPlus,
json_stringify,
maskIncludes,
math_abs,
object_keys
*/

var Encoder;

var replaceIndexer;
var resolveSimple;

(function ()
{
    var STATIC_CHAR_CACHE = new Empty();
    var STATIC_CONST_CACHE = new Empty();
    
    var CharCache = createConstructor(STATIC_CHAR_CACHE);
    var ConstCache = createConstructor(STATIC_CONST_CACHE);
    
    var quoteString = json_stringify;
    
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
        
        createStringTokenPattern: function ()
        {
            function filterCallback(complex)
            {
                var entries = COMPLEX[complex];
                var definition = this.findDefinition(entries);
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
            var charCode = char.charCodeAt();
            var entries;
            if (charCode < 0x100)
                entries = DEFAULT_8_BIT_CHARACTER_ENCODER;
            else
                entries = DEFAULT_16_BIT_CHARACTER_ENCODER;
            var defaultCharacterEncoder = this.findDefinition(entries);
            var replacement = defaultCharacterEncoder.call(this, charCode);
            var solution = createSolution(replacement, LEVEL_STRING, false);
            return solution;
        },
        
        findBase64AlphabetDefinition: function (element)
        {
            var definition;
            if (array_isArray(element))
                definition = this.findDefinition(element);
            else
                definition = element;
            return definition;
        },
        
        findDefinition: function (entries)
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
            var optimalB = this.findDefinition(OPTIMAL_B);
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
            var replacement = this.replaceExpressUnit(unit, false, [], NaN, REPLACERS);
            return replacement;
        },
        
        replaceExpressUnit: function (unit, bond, unitIndices, maxLength, replacers)
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
                        var abs = math_abs(value);
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
                        var definition = this.findDefinition(entries);
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
        },
    };
    
    assignNoEnum(Encoder.prototype, encoderProtoSource);
    
    var BOND_STRENGTH_NONE      = 0;
    var BOND_STRENGTH_WEAK      = 1;
    var BOND_STRENGTH_STRONG    = 2;
    
    var REPLACERS =
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
}
)();
