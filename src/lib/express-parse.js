var expressParse;

(function ()
{
    'use strict';
    
    function evalConstExpr(constExpr)
    {
        var value = Function('return ' + constExpr)();
        return value;
    }
    
    function isValidFunctionName(str)
    {
        var valid = str && UNRETURNABLE_WORDS.indexOf(str) < 0;
        return valid;
    }
    
    function makeRegExp(richPattern)
    {
        var pattern = '^(?:' + replacePattern(richPattern) + ')';
        var regExp = RegExp(pattern);
        return regExp;
    }
    
    function readMore(parseInfo, regExp)
    {
        var str = parseInfo.str;
        var matches = regExp.exec(str);
        if (matches)
        {
            var match = matches[0];
            parseInfo.str = str.slice(match.length);
            return match;
        }
    }
    
    function readUnit(parseInfo)
    {
        var unit;
        var constExpr = readMore(parseInfo, constExprRegExp);
        if (constExpr)
        {
            var value = evalConstExpr(constExpr);
            unit = { value: value };
            return unit;
        }
        var identifier = readMore(parseInfo, identifierRegExp);
        if (isValidFunctionName(identifier))
        {
            unit = { identifier: identifier };
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
        BinaryIntegerLiteral:
            '0[Bb][01]+',
        DecimalLiteral:
            '(?:(?:0|[1-9][0-9]*|0[0-9]*[89][0-9]*)(?:\\.[0-9]*)?|\\.[0-9]+)(?:[Ee][+-]?[0-9]+)?',
        DoubleQuotedString:
            '"(?:#EscapeSequence|(?!["\\\\]).)*"',
        EscapeSequence:
            '\\\\' +
            '(?:u#HexDigit{4}|u\\{#HexDigitsUpTo10FFFF\\}|x#HexDigit{2}|[0-3]?[0-7]{2}|\r\n|[^ux])',
        HexDigit:
            '[0-9A-Fa-f]',
        HexDigitsUpTo10FFFF:
            '0*(?:#HexDigit{1,5}|10#HexDigit{4})',
        HexIntegerLiteral:
            '0[Xx]#HexDigit+',
        NumericLiteral:
            '#DecimalLiteral|' +
            '#BinaryIntegerLiteral|' +
            '#OctalIntegerLiteral|' +
            '#HexIntegerLiteral|' +
            '#LegacyOctalIntegerLiteral',
        LegacyOctalIntegerLiteral:
            '0[0-7]+',
        OctalIntegerLiteral:
            '0[Oo][0-7]+',
        Separator:
            '#SeparatorChar|\\/\\/.*(?!.)|\\/\\*[\\s\\S]*?\\*\\/',
        SeparatorChar:
            '[\\s\uFEFF]', // U+FEFF is missed by /\s/ on Android Browsers < 4.1.x.
        SingleQuotedString:
            '\'(?:#EscapeSequence|(?![\'\\\\]).)*\'',
        StringLiteral:
            '#SingleQuotedString|#DoubleQuotedString',
    };
    
    var tokenCache = Object.create(null);
    
    var UNRETURNABLE_WORDS =
    [
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
        'with'
    ];
    
    var constExprRegExp = makeRegExp('#NumericLiteral|#StringLiteral');
    var identifierRegExp = makeRegExp('[$A-Z_a-z][$0-9A-Z_a-z]*');
    var separatorOrColonRegExp = makeRegExp('(?:#Separator|;)*');
    var separatorRegExp = makeRegExp('(?:#Separator)*');
    
    expressParse =
        function (input)
        {
            var parseInfo = { str: input };
            readMore(parseInfo, separatorOrColonRegExp);
            var parseData = readUnit(parseInfo);
            if (!parseData)
                return;
            var ops = [];
            for (;;)
            {
                readMore(parseInfo, separatorRegExp);
                var op;
                if (readMore(parseInfo, /^\(/))
                {
                    readMore(parseInfo, separatorRegExp);
                    if (readMore(parseInfo, /^\)/))
                        op = { type: 'call' };
                    else
                    {
                        op = readUnit(parseInfo);
                        if (!op)
                            return;
                        readMore(parseInfo, separatorRegExp);
                        if (!readMore(parseInfo, /^\)/))
                            return;
                        op.type = 'param-call';
                    }
                }
                else if (readMore(parseInfo, /^\[/))
                {
                    readMore(parseInfo, separatorRegExp);
                    op = readUnit(parseInfo);
                    if (!op)
                        return;
                    readMore(parseInfo, separatorRegExp);
                    if (!readMore(parseInfo, /^]/))
                        return;
                    op.type = 'get';
                }
                else if (readMore(parseInfo, /^\./))
                {
                    readMore(parseInfo, separatorRegExp);
                    var identifier = readMore(parseInfo, identifierRegExp);
                    if (!identifier)
                        return;
                    op = { type: 'get', value: identifier };
                }
                else
                    break;
                ops.push(op);
            }
            readMore(parseInfo, separatorOrColonRegExp);
            if (parseInfo.str)
                return;
            parseData.ops = ops;
            return parseData;
        };
}
)();
