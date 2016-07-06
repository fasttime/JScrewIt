/* global Empty */

var expressParse;

(function ()
{
    function evalExpr(expr)
    {
        var value = Function('return ' + expr)();
        return value;
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
            .replace(/![+-]!/, '!!')
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
            parseInfo.data = data.slice(match.length);
            return match;
        }
    }
    
    function readMods(parseInfo, mods)
    {
        var mod;
        while (mod = read(parseInfo, /^(?:!|\+(?!\+)|-(?!-))/))
        {
            mods = joinMods(mods, mod);
            readSeparators(parseInfo);
        }
        return mods;
    }
    
    function readParenthesisLeft(parseInfo)
    {
        return read(parseInfo, /^\(/);
    }
    
    function readParenthesisRight(parseInfo)
    {
        return read(parseInfo, /^\)/);
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
            unit = { value: value };
            return unit;
        }
        if (readSquareBracketLeft(parseInfo))
        {
            readSeparators(parseInfo);
            if (readSquareBracketRight(parseInfo))
                unit = { value: [] };
            else
            {
                var op = readUnit(parseInfo);
                if (op)
                {
                    readSeparators(parseInfo);
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
            readSeparators(parseInfo);
            unit = readUnit(parseInfo, true);
            if (unit)
            {
                readSeparators(parseInfo);
                if (!readParenthesisRight(parseInfo))
                    return;
            }
            return unit;
        }
        var identifier = read(parseInfo, identifierRegExp);
        if (identifier && isReturnableIdentifier(identifier))
        {
            unit = { identifier: identifier };
            return unit;
        }
    }
    
    function readSeparators(parseInfo)
    {
        read(parseInfo, separatorRegExp);
    }
    
    function readSquareBracketLeft(parseInfo)
    {
        return read(parseInfo, /^\[/);
    }
    
    function readSquareBracketRight(parseInfo)
    {
        return read(parseInfo, /^]/);
    }
    
    function readUnit(parseInfo, allowInexpressibleUnits)
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
                        return unit;
                    }
                    readSeparators(parseInfo);
                }
                else
                    binSign = '';
                var mods = readMods(parseInfo, binSign === '+' ? '' : binSign);
                var term = readUnitCore(parseInfo);
                if (!term)
                    return;
                if (
                    'value' in term &&
                    ~['boolean', 'number', 'undefined'].indexOf(typeof term.value) &&
                    !term.ops.length)
                {
                    var value = term.value;
                    var mod;
                    while (mod = mods.slice(-1))
                    {
                        mods = mods.slice(0, -1);
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
                    term.value = value;
                }
                else
                {
                    mods = joinMods(mods, term.mods || '');
                    if (!allowInexpressibleUnits && /-/.test(mods))
                        return;
                }
                term.mods = mods;
                if (unit)
                {
                    var terms = unit.terms;
                    if (terms && !unit.mods)
                        terms.push(term);
                    else
                        unit = { terms: [unit, term] };
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
                readSeparators(parseInfo);
                var op;
                if (readParenthesisLeft(parseInfo))
                {
                    readSeparators(parseInfo);
                    if (readParenthesisRight(parseInfo))
                        op = { type: 'call' };
                    else
                    {
                        op = readUnit(parseInfo);
                        if (!op)
                            return;
                        readSeparators(parseInfo);
                        if (!readParenthesisRight(parseInfo))
                            return;
                        op.type = 'param-call';
                    }
                }
                else if (readSquareBracketLeft(parseInfo))
                {
                    readSeparators(parseInfo);
                    op = readUnit(parseInfo);
                    if (!op)
                        return;
                    readSeparators(parseInfo);
                    if (!readSquareBracketRight(parseInfo))
                        return;
                    op.type = 'get';
                }
                else if (read(parseInfo, /^\./))
                {
                    readSeparators(parseInfo);
                    var identifier = read(parseInfo, identifierRegExp);
                    if (!identifier)
                        return;
                    op = { type: 'get', value: identifier };
                }
                else
                    break;
                ops.push(op);
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
            read(parseInfo, separatorOrColonRegExp);
            if (!parseInfo.data)
                return true;
            var unit = readUnit(parseInfo);
            read(parseInfo, separatorOrColonRegExp);
            if (parseInfo.data)
                return;
            return unit;
        };
}
)();
