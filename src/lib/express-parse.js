/* global Empty, array_isArray */

// Recognized syntax elements include:
//
// * The boolean literals "true" and "false"
// * The pseudoconstant literals "undefined", "NaN" and "Infinity"
// * ES5 strict mode numeric literals
// * ES5 strict mode string literals with the line continuation extension
// * Empty and singleton array literals
// * ASCII identifiers
// * ASCII property getters in dot notation
// * Property getters in bracket notation
// * Function calls without parameters and with one parameter
// * The unary operators "!", "+" and to a limited extent "-"
// * The binary operators "+" and to a limited extent "-"
// * Grouping parentheses
// * White spaces and line terminators
// * Semicolons
// * Comments

var expressParse;

(function ()
{
    function applyMods(unit, mods)
    {
        if (!unit.mods && 'value' in unit && unit.arithmetic)
        {
            var value = unit.value;
            for (var index = mods.length; index--;)
            {
                var mod = mods[index];
                switch (mod)
                {
                case '!':
                    value = !value;
                    break;
                case '+':
                    value = +value;
                    break;
                case '-':
                    value = -value;
                    break;
                }
            }
            unit.value = value;
        }
        else
        {
            if (mods)
            {
                unit.mods = joinMods(mods, unit.mods || '');
                unit.arithmetic = true;
            }
        }
    }
    
    function evalExpr(expr)
    {
        var value = Function('return ' + expr)();
        return value;
    }
    
    function isInexpressibleUnit(unit)
    {
        var inexpressible = (unit.mods || '')[0] === '-';
        return inexpressible;
    }
    
    function isReturnableIdentifier(identifier)
    {
        var returnable = UNRETURNABLE_WORDS.indexOf(identifier) < 0;
        return returnable;
    }
    
    function joinMods(mod1, mod2)
    {
        var mods =
            (mod1 + mod2)
            .replace(/\+\+|--/, '+')
            .replace(/\+-|-\+/, '-')
            .replace(/!-/, '!+')
            .replace(/!\+!/, '!!')
            .replace('!!!', '!');
        return mods;
    }
    
    function makeRegExp(richPattern)
    {
        var pattern = '^(?:' + replacePattern(richPattern) + ')';
        var regExp = RegExp(pattern);
        return regExp;
    }
    
    function read(parseInfo, regExp)
    {
        var data = parseInfo.data;
        var matches = regExp.exec(data);
        if (matches)
        {
            var match = matches[0];
            parseInfo.data = data.slice(match.length).replace(separatorRegExp, '');
            return match;
        }
    }
    
    function readMods(parseInfo, mods)
    {
        var mod;
        while (mod = read(parseInfo, /^(?:!|\+(?!\+)|-(?!-))/))
            mods = joinMods(mods, mod);
        return mods;
    }
    
    function readParenthesisLeft(parseInfo)
    {
        var match = read(parseInfo, /^\(/);
        return match;
    }
    
    function readParenthesisRight(parseInfo)
    {
        var match = read(parseInfo, /^\)/);
        return match;
    }
    
    function readPrimaryExpr(parseInfo)
    {
        var unit;
        var strExpr = read(parseInfo, strRegExp);
        if (strExpr)
        {
            var str = evalExpr(strExpr);
            unit = { value: str };
            return unit;
        }
        var constValueExpr = read(parseInfo, constValueRegExp);
        if (constValueExpr)
        {
            var value = evalExpr(constValueExpr);
            unit = { arithmetic: true, value: value };
            return unit;
        }
        if (readSquareBracketLeft(parseInfo))
        {
            if (readSquareBracketRight(parseInfo))
                unit = { value: [] };
            else
            {
                var op = readUnit(parseInfo);
                if (op)
                {
                    if (readSquareBracketRight(parseInfo))
                    {
                        unit = { value: [op] };
                        parseInfo.composite = false;
                    }
                }
            }
            return unit;
        }
        if (readParenthesisLeft(parseInfo))
        {
            unit = readUnit(parseInfo, true);
            if (!unit || !readParenthesisRight(parseInfo))
                return;
            return unit;
        }
        var identifier = read(parseInfo, identifierRegExp);
        if (identifier && isReturnableIdentifier(identifier))
        {
            unit = { identifier: identifier };
            return unit;
        }
    }
    
    function readSeparatorOrColon(parseInfo)
    {
        parseInfo.data = parseInfo.data.replace(separatorOrColonRegExp, '');
    }
    
    function readSquareBracketLeft(parseInfo)
    {
        var match = read(parseInfo, /^\[/);
        return match;
    }
    
    function readSquareBracketRight(parseInfo)
    {
        var match = read(parseInfo, /^]/);
        return match;
    }
    
    function readUnit(parseInfo, allowInexpressibleUnit)
    {
        if (parseInfo.height--)
        {
            var unit;
            for (;;)
            {
                var binSign;
                if (unit)
                {
                    binSign = read(parseInfo, /^(?:\+(?!\+)|-(?!-))/);
                    if (!binSign)
                    {
                        ++parseInfo.height;
                        if (!allowInexpressibleUnit && isInexpressibleUnit(unit))
                            return;
                        return unit;
                    }
                    if (binSign === '-' && !unit.arithmetic)
                        applyMods(unit, '+');
                }
                else
                    binSign = '';
                var mods = readMods(parseInfo, binSign === '+' ? '' : binSign);
                var term = readUnitCore(parseInfo);
                if (!term)
                    return;
                applyMods(term, mods);
                if (unit)
                {
                    if (isInexpressibleUnit(term))
                        return;
                    var terms = unit.terms;
                    if (terms && !unit.mods)
                    {
                        terms.push(term);
                        if (!term.arithmetic)
                            delete unit.arithmetic;
                    }
                    else
                    {
                        if (isInexpressibleUnit(unit))
                            return;
                        var arithmetic = unit.arithmetic && term.arithmetic;
                        unit = { ops: [], terms: [unit, term] };
                        if (arithmetic)
                            unit.arithmetic = true;
                    }
                }
                else
                    unit = term;
            }
        }
    }
    
    function readUnitCore(parseInfo)
    {
        var unit = readPrimaryExpr(parseInfo);
        if (unit)
        {
            var ops = [];
            for (;;)
            {
                var op;
                if (readParenthesisLeft(parseInfo))
                {
                    if (readParenthesisRight(parseInfo))
                        op = { type: 'call' };
                    else
                    {
                        op = readUnit(parseInfo);
                        if (!op || !readParenthesisRight(parseInfo))
                            return;
                        op.type = 'param-call';
                    }
                }
                else if (readSquareBracketLeft(parseInfo))
                {
                    op = readUnit(parseInfo);
                    if (!op || !readSquareBracketRight(parseInfo))
                        return;
                    var str = stringifyUnit(op);
                    if (str != null)
                        op.str = str;
                    op.type = 'get';
                }
                else if (read(parseInfo, /^\./))
                {
                    var identifier = read(parseInfo, identifierRegExp);
                    if (!identifier)
                        return;
                    op = { type: 'get', value: identifier };
                }
                else
                    break;
                ops.push(op);
                delete unit.arithmetic;
            }
            if (ops.length && unit.mods)
                unit = { terms: [unit] };
            else
            {
                var unitOps = unit.ops;
                if (unitOps)
                    ops = unitOps.concat(ops);
            }
            unit.ops = ops;
            return unit;
        }
    }
    
    function replaceAndGroupToken(unused, tokenName)
    {
        var replacement = '(?:' + replaceToken(tokenName) + ')';
        return replacement;
    }
    
    function replacePattern(richPattern)
    {
        var pattern = richPattern.replace(/#(\w+)/g, replaceAndGroupToken);
        return pattern;
    }
    
    function replaceToken(tokenName)
    {
        var replacement = tokenCache[tokenName];
        if (replacement == null)
        {
            var richPattern = tokens[tokenName];
            tokenCache[tokenName] = replacement = replacePattern(richPattern);
        }
        return replacement;
    }
    
    function stringifyUnit(unit)
    {
        var inArray = false;
        while (!unit.mods && !unit.ops.length && 'value' in unit)
        {
            var value = unit.value;
            if (!array_isArray(value))
                return value == null && inArray ? '' : value + '';
            unit = value[0];
            if (!unit)
                return '';
            inArray = true;
        }
    }
    
    var tokens =
    {
        ConstIdentifier:
            'Infinity|NaN|false|true|undefined',
        DecimalLiteral:
            '(?:(?:0|[1-9][0-9]*)(?:\\.[0-9]*)?|\\.[0-9]+)(?:[Ee][+-]?[0-9]+)?',
        DoubleQuotedString:
            '"(?:#EscapeSequence|(?!["\\\\]).)*"',
        EscapeSequence:
            '\\\\(?:u#HexDigit{4}|x#HexDigit{2}|0(?![0-7])|\r\n|[^0-7ux])',
        HexDigit:
            '[0-9A-Fa-f]',
        HexIntegerLiteral:
            '0[Xx]#HexDigit+',
        NumericLiteral:
            '#DecimalLiteral|#HexIntegerLiteral',
        Separator:
            '#SeparatorChar|\\/\\/.*(?!.)|\\/\\*[\\s\\S]*?\\*\\/',
        SeparatorChar:
            '[\\s\uFEFF]', // U+FEFF is missed by /\s/ on Android Browsers < 4.1.x.
        SingleQuotedString:
            '\'(?:#EscapeSequence|(?![\'\\\\]).)*\'',
    };
    
    var tokenCache = new Empty();
    
    // This list includes reserved words and identifiers that would cause a change in a script's
    // behavior when placed after a return statement inside a Function invocation.
    // Unwanted changes include producing a syntax error where none is expected or a difference in
    // evaluation.
    var UNRETURNABLE_WORDS =
    [
        'arguments',
        'debugger',
        'delete',
        'if',
        'new',
        'return',
        'this',
        'throw',
        'typeof',
        'void',
        'while',
        'with',
    ];
    
    var constValueRegExp        = makeRegExp('(?:#NumericLiteral|#ConstIdentifier)(?![\\w$])');
    var identifierRegExp        = makeRegExp('[$A-Z_a-z][$0-9A-Z_a-z]*');
    var separatorOrColonRegExp  = makeRegExp('(?:#Separator|;)*');
    var separatorRegExp         = makeRegExp('#Separator*');
    var strRegExp               = makeRegExp('#SingleQuotedString|#DoubleQuotedString');
    
    expressParse =
        function (input)
        {
            var parseInfo = { data: input, height: 1000 };
            readSeparatorOrColon(parseInfo);
            if (!parseInfo.data)
                return true;
            var unit = readUnit(parseInfo);
            if (unit)
            {
                readSeparatorOrColon(parseInfo);
                if (!parseInfo.data)
                    return unit;
            }
        };
}
)();
