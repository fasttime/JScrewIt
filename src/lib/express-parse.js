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
// * The unary operators "!", "+", pre-increment "++" and to a limited extent "-"
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
            var ret = popRet(parseInfo);
            if (ret.allowInexpressibleUnit || finalizeUnit(unit))
            {
                var postParser = ret.postParser;
                return postParser(parseInfo, unit);
            }
            return;
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
    
    function finalizeUnit(unit)
    {
        var mod = unit.mod || '';
        if (mod[0] !== '-')
        {
            unit.mod = unescapeMod(mod);
            return true;
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
    
    function parse(parseInfo)
    {
        for (var next = parseUnit; typeof next === 'function'; next = next(parseInfo));
        return next;
    }
    
    function parseArrayElement(parseInfo, unit)
    {
        if (readSquareBracketRight(parseInfo))
        {
            parseInfo.composite = false;
            pushUnit(parseInfo, { value: [unit] });
            return parseOps;
        }
    }
    
    function parseGroup(parseInfo, unit)
    {
        if (readParenthesisRight(parseInfo))
        {
            pushUnit(parseInfo, unit);
            return parseOps;
        }
    }
    
    function parseIndexer(parseInfo, op)
    {
        if (op && readSquareBracketRight(parseInfo))
        {
            var str = stringifyUnit(op);
            if (str != null)
                op.str = str;
            op.type = 'get';
            appendOp(parseInfo, op);
            return parseNextOp;
        }
    }
    
    function parseOps(parseInfo)
    {
        pushOps(parseInfo, []);
        var next = parseNextOp(parseInfo);
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
            pushRet(parseInfo, parseParamCall);
            return parseUnit;
        }
        else if (readSquareBracketLeft(parseInfo))
        {
            pushRet(parseInfo, parseIndexer);
            return parseUnit;
        }
        else if (read(parseInfo, /^\./))
        {
            var identifier = read(parseInfo, identifierRegExp);
            if (!identifier)
                return;
            appendOp(parseInfo, { type: 'get', value: identifier });
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
    
    function parseParamCall(parseInfo, op)
    {
        if (op && readParenthesisRight(parseInfo))
        {
            op.type = 'param-call';
            appendOp(parseInfo, op);
            return parseNextOp;
        }
    }
    
    function parsePrimaryExpr(parseInfo)
    {
        var strExpr = read(parseInfo, strRegExp);
        if (strExpr)
        {
            var str = evalExpr(strExpr);
            pushUnit(parseInfo, { value: str });
            return parseOps;
        }
        var constValueExpr = read(parseInfo, constValueRegExp);
        if (constValueExpr)
        {
            var value = evalExpr(constValueExpr);
            pushUnit(parseInfo, { arithmetic: true, value: value });
            return parseOps;
        }
        if (readSquareBracketLeft(parseInfo))
        {
            if (readSquareBracketRight(parseInfo))
            {
                pushUnit(parseInfo, { value: [] });
                return parseOps;
            }
            pushRet(parseInfo, parseArrayElement);
            return parseUnit;
        }
        if (readParenthesisLeft(parseInfo))
        {
            pushRet(parseInfo, parseGroup, true);
            return parseUnit;
        }
        var identifier = read(parseInfo, identifierRegExp);
        if (identifier && isReturnableIdentifier(identifier))
        {
            pushUnit(parseInfo, { identifier: identifier });
            return parseOps;
        }
    }
    
    function parseUnit(parseInfo)
    {
        if (parseInfo.retStack.length <= 1000)
        {
            var mod = readMod(parseInfo, '');
            pushMod(parseInfo, mod);
            pushUnit(parseInfo);
            return parsePrimaryExpr;
        }
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
    
    function popRet(parseInfo)
    {
        var ret = parseInfo.retStack.pop();
        return ret;
    }
    
    function popUnit(parseInfo)
    {
        var unit = parseInfo.unitStack.pop();
        return unit;
    }
    
    function pushMod(parseInfo, mod)
    {
        parseInfo.modStack.push(mod);
    }
    
    function pushOps(parseInfo, ops)
    {
        parseInfo.opsStack.push(ops);
    }
    
    function pushRet(parseInfo, postParser, allowInexpressibleUnit)
    {
        parseInfo.retStack.push(
            { postParser: postParser, allowInexpressibleUnit: allowInexpressibleUnit }
        );
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
    
    function returnUnit(parseInfo, unit)
    {
        return unit;
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
                retStack: [{ postParser: returnUnit }],
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
