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
// * The unary operators "!", "+", "++" (pre- and post-increment) and to a limited extent "-"
// * The binary operators "+" and to a limited extent "-"
// * Grouping parentheses
// * White spaces and line terminators
// * Semicolons
// * Comments

var expressParse;

(function ()
{
    function appendOp(parseInfo, op)
    {
        var ops = parseInfo.opsStack.slice(-1)[0];
        ops.push(op);
    }
    
    function appendTerm(parseInfo, term)
    {
        var unit = popUnit(parseInfo);
        var mod = popMod(parseInfo);
        applyMod(term, mod);
        if (unit)
        {
            if (!finalizeUnit(term))
                return;
            var terms = unit.terms;
            if (terms && !unit.mod)
            {
                terms.push(term);
                if (!term.arithmetic)
                    delete unit.arithmetic;
            }
            else
            {
                if (!finalizeUnit(unit))
                    return;
                var arithmetic = unit.arithmetic && term.arithmetic;
                unit = { ops: [], terms: [unit, term] };
                if (arithmetic)
                    unit.arithmetic = true;
            }
        }
        else
            unit = term;
        var binSign = read(parseInfo, /^(?:\+(?!\+)|-(?!-))/);
        if (!binSign)
        {
            var finalizer = popFinalizer(parseInfo);
            return finalizer(unit, parseInfo);
        }
        if (binSign === '-' && !unit.arithmetic)
            applyMod(unit, '+');
        mod = readMod(parseInfo, binSign === '+' ? '' : binSign);
        pushMod(parseInfo, mod);
        pushUnit(parseInfo, unit);
        return parsePrimaryExpr;
    }
    
    function applyMod(unit, mod)
    {
        if (!unit.mod && 'value' in unit && unit.arithmetic)
        {
            var value = unit.value;
            loop:
            for (var index = mod.length; index--;)
            {
                var thisMod = mod[index];
                switch (thisMod)
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
                case '#':
                    break loop;
                }
            }
            unit.value = value;
            mod = mod.slice(0, index + 1);
        }
        if (mod)
        {
            unit.mod = joinMods(mod, unit.mod || '');
            unit.arithmetic = true;
        }
    }
    
    function escapeMod(mod)
    {
        var escapedMod = mod.replace(/\+\+/g, '#');
        return escapedMod;
    }
    
    function evalExpr(expr)
    {
        var value = Function('return ' + expr)();
        return value;
    }
    
    function finalizeArrayElement(unit, parseInfo)
    {
        if (finalizeUnit(unit) && readSquareBracketRight(parseInfo))
        {
            newOps(parseInfo, { value: [unit] });
            return parseNextOp;
        }
    }
    
    function finalizeGroup(unit, parseInfo)
    {
        if (readParenthesisRight(parseInfo))
        {
            newOps(parseInfo, unit);
            return parseNextOp;
        }
    }
    
    function finalizeIndexer(op, parseInfo)
    {
        if (finalizeUnit(op) && readSquareBracketRight(parseInfo))
        {
            var str = stringifyUnit(op);
            if (str != null)
                op.str = str;
            op.type = 'get';
            appendOp(parseInfo, op);
            return parseNextOp;
        }
    }
    
    function finalizeParamCall(op, parseInfo)
    {
        if (finalizeUnit(op) && readParenthesisRight(parseInfo))
        {
            op.type = 'param-call';
            appendOp(parseInfo, op);
            return parseNextOp;
        }
    }
    
    function finalizeUnit(unit)
    {
        var mod = unit.mod || '';
        if (!/-/.test(mod))
        {
            unit.mod = unescapeMod(mod);
            return unit;
        }
    }
    
    function isReturnableIdentifier(identifier)
    {
        var returnable = UNRETURNABLE_WORDS.indexOf(identifier) < 0;
        return returnable;
    }
    
    function joinMods(mod1, mod2)
    {
        var mod =
            (mod1 + mod2)
            .replace(/\+\+|--/, '+')
            .replace(/\+-|-\+/, '-')
            .replace(/!-/, '!+')
            .replace(/\+#/, '#')
            .replace(/!\+!/, '!!')
            .replace('!!!', '!');
        return mod;
    }
    
    function makeRegExp(richPattern)
    {
        var pattern = '^(?:' + replacePattern(richPattern) + ')';
        var regExp = RegExp(pattern);
        return regExp;
    }
    
    function newOps(parseInfo, unit)
    {
        pushNewOps(parseInfo);
        pushUnit(parseInfo, unit);
    }
    
    function parse(parseInfo)
    {
        for (var next = parseUnit; typeof next === 'function'; next = next(parseInfo));
        return next;
    }
    
    function parseNextOp(parseInfo)
    {
        if (readParenthesisLeft(parseInfo))
        {
            if (readParenthesisRight(parseInfo))
            {
                appendOp(parseInfo, { type: 'call' });
                return parseNextOp;
            }
            pushFinalizer(parseInfo, finalizeParamCall);
            return parseUnit;
        }
        if (readSquareBracketLeft(parseInfo))
        {
            pushFinalizer(parseInfo, finalizeIndexer);
            return parseUnit;
        }
        if (read(parseInfo, /^\./))
        {
            var identifier = read(parseInfo, identifierRegExp);
            if (!identifier)
                return;
            appendOp(parseInfo, { type: 'get', value: identifier });
            return parseNextOp;
        }
        if (read(parseInfo, /^\+\+/))
        {
            appendOp(parseInfo, { type: 'post-increment' });
            return parseNextOp;
        }
        var unit = popUnit(parseInfo);
        var ops = popOps(parseInfo);
        if (ops.length)
        {
            delete unit.arithmetic;
            if (unit.mod)
                unit = { terms: [unit] };
        }
        unit.ops = (unit.ops || []).concat(ops);
        var next = appendTerm(parseInfo, unit);
        return next;
    }
    
    function parsePrimaryExpr(parseInfo)
    {
        var strExpr = read(parseInfo, strRegExp);
        if (strExpr)
        {
            var str = evalExpr(strExpr);
            newOps(parseInfo, { value: str });
            return parseNextOp;
        }
        var constValueExpr = read(parseInfo, constValueRegExp);
        if (constValueExpr)
        {
            var constValue = evalExpr(constValueExpr);
            newOps(parseInfo, { arithmetic: true, value: constValue });
            return parseNextOp;
        }
        if (readSquareBracketLeft(parseInfo))
        {
            if (readSquareBracketRight(parseInfo))
            {
                newOps(parseInfo, { value: [] });
                return parseNextOp;
            }
            pushFinalizer(parseInfo, finalizeArrayElement);
            return parseUnit;
        }
        if (readParenthesisLeft(parseInfo))
        {
            pushFinalizer(parseInfo, finalizeGroup);
            return parseUnit;
        }
        var identifier = read(parseInfo, identifierRegExp);
        if (identifier && isReturnableIdentifier(identifier))
        {
            newOps(parseInfo, { identifier: identifier });
            return parseNextOp;
        }
    }
    
    function parseUnit(parseInfo)
    {
        var MAX_PARSABLE_NESTINGS = 1000;
        
        if (parseInfo.finalizerStack.length <= MAX_PARSABLE_NESTINGS)
        {
            var mod = readMod(parseInfo, '');
            pushMod(parseInfo, mod);
            pushUnit(parseInfo);
            return parsePrimaryExpr;
        }
    }
    
    function popFinalizer(parseInfo)
    {
        var ret = parseInfo.finalizerStack.pop();
        return ret;
    }
    
    function popMod(parseInfo)
    {
        var mod = parseInfo.modStack.pop();
        return mod;
    }
    
    function popOps(parseInfo)
    {
        var ops = parseInfo.opsStack.pop();
        return ops;
    }
    
    function popUnit(parseInfo)
    {
        var unit = parseInfo.unitStack.pop();
        return unit;
    }
    
    function pushFinalizer(parseInfo, finalizer)
    {
        parseInfo.finalizerStack.push(finalizer);
    }
    
    function pushMod(parseInfo, mod)
    {
        parseInfo.modStack.push(mod);
    }
    
    function pushNewOps(parseInfo)
    {
        parseInfo.opsStack.push([]);
    }
    
    function pushUnit(parseInfo, unit)
    {
        parseInfo.unitStack.push(unit);
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
    
    function readMod(parseInfo, mod)
    {
        var newMod;
        while (newMod = read(parseInfo, /^(?:!|\+\+?|-(?!-))/))
            mod = joinMods(mod, escapeMod(newMod));
        return mod;
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
        while (!unit.mod && !unit.ops.length && 'value' in unit)
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
    
    function unescapeMod(mod)
    {
        var unescapedMod = mod.replace(/#/g, '++');
        return unescapedMod;
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
            var parseInfo =
            {
                data: input,
                modStack: [],
                opsStack: [],
                finalizerStack: [finalizeUnit],
                unitStack: []
            };
            readSeparatorOrColon(parseInfo);
            if (!parseInfo.data)
                return true;
            var unit = parse(parseInfo);
            if (unit)
            {
                readSeparatorOrColon(parseInfo);
                if (!parseInfo.data)
                    return unit;
            }
        };
}
)();
