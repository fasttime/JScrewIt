(function (self)
{
    'use strict';
    
    // Mapping syntax has been changed to match Javascript more closely. The main differences from
    // JSFuck are:
    // * Support for constant literals like "ANY_FUNCTION", "FHP_3_NS", etc. improves readability
    //   and simplifies maintenance.
    // * 10 evaluates to a number, while "10" evaluates to a string. This can make a difference in
    //   certain expressions and may affect the mapping length.
    // * String literals must be always double quoted.
    
    var CONSTANTS =
    {
        ANY_FUNCTION:   '[]["filter"]',
        
        btoa:
        {
            NO_NODE:    'Function("return btoa")()'
        },
        
        // Function boby padding constants: prepended to a function to align the body at the same
        // position on different browsers. The number after "FBP_" is the maximum character
        // overhead; the suffix "_NS" indicates that the constant does not evaluate to a string or
        // an array.
        FBP_9_NS:       '[false][+!(false + ANY_FUNCTION)["40"]]',
        FBP_10:
        {
            NO_IE:      '[0] + FBP_9_NS'
        },
        FBP_15:         'FHP_5_NS + [0] + FBP_9_NS',
        FBP_16:         'FHP_3_NS + [true] + FBP_9_NS',
        FBP_18:         'FHP_5_NS + [true] + FBP_9_NS',
        FBP_20:         'FHP_5_NS + [0] + false + FBP_9_NS',

        // Function header padding constants: prepended to a function to align the header at the
        // same position on different browsers. The number after "FHP_" is the maximum character
        // overhead; the suffix "_NS" indicates that the constant does not evaluate to a string or
        // an array.
        FHP_3_NS:
        {
            DEFAULT:    '+((ANY_FUNCTION + [])[0] + "10")',
            NO_IE:      'NaN'
        },
        FHP_5_NS:
        {
            DEFAULT:    '!!+((ANY_FUNCTION + [])[0] + 1)',
            NO_IE:      'false'
        },
        FHP_7:          'FHP_3_NS + [true]',
        FHP_8:          'FHP_5_NS + [NaN]',
        
        // Regular padding constants: The number after "RP_" is the character overhead; the suffix
        // "_NS" indicates that the constant does not evaluate to a string or an array.
        RP_1_NS:        '0',
        RP_3_NS:        'NaN',
        RP_4_NS:        'true',
        RP_5:           '[false]',
        RP_5_NS:        'false',
        RP_6:           '"0false"',
    };
    
    var CONSTRUCTORS =
    {
        Array:      '[]',
        Boolean:    '(false)',
        Function:   'ANY_FUNCTION',
        Number:     '(0)',
        RegExp:     'Function("return/false/")()',
        String:     '("")',
    };
    
    var CHARACTERS =
    {
        'a':            '"false"[1]',
        'b':
        {
            DEFAULT:    '(FHP_8 + Number)["20"]',
            NO_IE:      '(Number + [])["12"]'
        },
        'c':
        {
            DEFAULT:    '(FHP_7 + ANY_FUNCTION)["10"]',
            NO_IE:      '(ANY_FUNCTION + [])[3]'
        },
        'd':            '"undefined"[2]',
        'e':            '"true"[3]',
        'f':            '"false"[0]',
        'g':
        {
            DEFAULT:    '(FHP_7 + String)["21"]',
            NO_IE:      '(RP_6 + String)["20"]'
        },
        'h':            '(101)["toString"]("21")[1]',
        'i':            '(RP_5 + undefined)["10"]',
        'j':            '(Function("return{}")() + [])["10"]',
        'k':            '(20)["toString"]("21")',
        'l':            '"false"[2]',
        'm':            '(RP_6 + Function())["20"]',
        'n':            '"undefined"[1]',
        'o':
        {
            DEFAULT:    '(FHP_5_NS + ANY_FUNCTION)["11"]',
            NO_IE:      '(RP_4_NS + ANY_FUNCTION)["10"]'
        },
        'p':            '(211)["toString"]("31")[1]',
        'q':            '(212)["toString"]("31")[1]',
        'r':            '"true"[1]',
        's':            '"false"[3]',
        't':            '"true"[0]',
        'u':            '"undefined"[0]',
        'v':            '(FBP_15 + ANY_FUNCTION)["40"]',
        'w':            '(32)["toString"]("33")',
        'x':            '(101)["toString"]("34")[1]',
        'y':            '(RP_3_NS + [Infinity])["10"]',
        'z':            '(35)["toString"]("36")',

        'A':
        {
            DEFAULT:    '(FHP_3_NS + Array)["12"]',
            NO_IE:      '(RP_1_NS + Array)["10"]'
        },
        'B':
        {
            DEFAULT:    '(FHP_3_NS + Boolean)["12"]',
            NO_IE:      '(RP_1_NS + Boolean)["10"]'
        },
        'C':
        {
            DEFAULT:    'Function("return escape")()(""["italics"]())[2]',
            NO_NODE:    'btoa("0+")[1]'
        },
        'D':
        {
            DEFAULT:    'Function("return escape")()("}")[2]',
            NO_NODE:    'btoa(40)[1]'
        },
        'E':
        {
            DEFAULT:    '(FHP_8 + RegExp)["20"]',
            NO_IE:      '(RegExp + [])["12"]',
            NO_NODE:    'btoa(11)[2]'
        },
        'F':
        {
            DEFAULT:    '(FHP_3_NS + Function)["12"]',
            NO_IE:      '(RP_1_NS + Function)["10"]'
        },
        'G':
        {
            NO_IE:      '(RP_5_NS + Function("return Date")()())["30"]', // not for IE ≤ 10
            NO_NODE:    'btoa("0false")[1]'
        },
        'H':
        {
            NO_NODE:    'btoa(true)[1]'
        },
        'I':            '"Infinity"[0]',
        'J':
        {
            NO_NODE:    'btoa(true)[2]'
        },
        'K':
        {
            NO_NODE:    'btoa("+")[0]'
        },
        'L':
        {
            NO_NODE:    'btoa(".")[0]'
        },
        'M':
        {
            NO_IE:      '(RP_4_NS + Function("return Date")()())["30"]', // not for IE ≤ 10
            NO_NODE:    'btoa(0)[0]'
        },
        'N':            '"NaN"[0]',
        'O':            '(RP_3_NS + Function("return{}")())["11"]',
        'P':
        {
            NO_NODE:    'btoa(""["italics"]())[0]'
        },
        'Q':
        {
            NO_NODE:    'btoa(1)[1]'
        },
        'R':
        {
            DEFAULT:    '(FHP_3_NS + RegExp)["12"]',
            NO_IE:      '(RP_1_NS + RegExp)["10"]',
            NO_NODE:    'btoa("0true")[2]'
        },
        'S':
        {
            DEFAULT:    '(FHP_3_NS + String)["12"]',
            NO_IE:      '(RP_1_NS + String)["10"]'
        },
        'T':
        {
            NO_IE:      '(RP_3_NS + Function("return Date")()())["30"]', // not for IE ≤ 10
            NO_NODE:    'btoa(NaN)[0]'
        },
        'U':
        {
            DEFAULT:    '(RP_3_NS + Function("return{}")()["toString"]["call"]())["11"]',
            NO_NODE:    '(RP_4_NS + btoa(false))["10"]'
        },
        'V':
        {
            NO_NODE:    'btoa(undefined)["10"]'
        },
        'W':
        {
            NO_NODE:    'btoa(undefined)[1]'
        },
        'X':
        {
            NO_NODE:    'btoa("1true")[1]'
        },
        'Y':
        {
            NO_NODE:    'btoa("a")[0]'
        },
        'Z':
        {
            NO_NODE:    'btoa(false)[0]'
        },

        '\n':           '(Function() + [])["23"]',
        ' ':            '(FHP_3_NS + ANY_FUNCTION)["11"]',
    //  '!':    ,
        '"':            '""["fontcolor"]()["12"]',
    //  '#':    ,
    //  '$':    ,
        '%':            'Function("return escape")()(ANY_FUNCTION)["20"]',
    //  '&':    ,
    //  '\'':   ,
        '(':            '(FHP_5_NS + ANY_FUNCTION)["20"]',
        ')':
        {
            DEFAULT:    '(FHP_5_NS + ANY_FUNCTION)["21"]',
            NO_IE:      '(RP_4_NS + ANY_FUNCTION)["20"]'
        },
    //  '*':    ,
        '+':            '(+"1e100" + [])[2]',
        ',':            '([]["slice"]["call"]("false") + [])[1]',
        '-':            '(+".0000000001" + [])[2]',
        '.':            '(+"11e20" + [])[1]',
        '/':            '"0false"["italics"]()["10"]',
        ':':            '(RegExp() + [])[3]',
    //  ';':    ,
        '<':            '""["italics"]()[0]',
        '=':            '""["fontcolor"]()["11"]',
        '>':            '""["italics"]()[2]',
        '?':            '(RegExp() + [])[2]',
    //  '@':    ,
        '[':
        {
            DEFAULT:    '(FBP_20 + ANY_FUNCTION)["40"]',
            NO_IE:      '(FBP_10 + ANY_FUNCTION)["30"]'
        },
    //  '\\':   ,
        ']':
        {
            DEFAULT:    '(FBP_18 + ANY_FUNCTION)["50"]',
            NO_IE:      '(FBP_9_NS + ANY_FUNCTION)["41"]'
        },
    //  '^':    ,
    //  '_':    ,
    //  '`':    ,
        '{':            '(FHP_3_NS + ANY_FUNCTION)["21"]',
    //  '|':    ,
        '}':
        {
            DEFAULT:    '(FBP_16 + ANY_FUNCTION)["50"]',
            NO_IE:      '(FBP_9_NS + ANY_FUNCTION)["43"]'
        },
    //  '~':    ,
    };
    
    var DEFAULT_CHARACTER_ENCODER =
    {
        DEFAULT:
        function (character)
        {
            var charCode = character.charCodeAt(0);
            var encoder = charCode < 0x100 ? unescapeCharacterEncoder8 : unescapeCharacterEncoder16;
            var result = encoder.call(this, charCode);
            return result;
        },
        NO_NODE:
        function (character)
        {
            var charCode = character.charCodeAt(0);
            var encoder = charCode < 0x100 ? atobCharacterEncoder : unescapeCharacterEncoder16;
            var result = encoder.call(this, charCode);
            return result;
        }
    };
    
    var SIMPLE =
    {
        'false':        '![]',
        'true':         '!![]',
        'undefined':    '[][[]]',
        'NaN':          '+[![]]',
        'Infinity':     '+"1e1000"',
    };
    
    var simplePattern;
    
    function Encoder(compatibility)
    {
        this.compatibility = compatibility;
        this.characterCache = { };
        this.constantCache = { };
        this.constructorCache = { };
        this.expressionCache = { };
        this.stack = [];
    }
    
    Encoder.prototype =
    {
        callResolver: function (stackName, expr, resolver)
        {
            if (expr === undefined)
            {
                throw new SyntaxError('Undefined symbol: ' + stackName);
            }
            var stackIndex = this.stack.indexOf(stackName);
            this.stack.push(stackName);
            try
            {
                if (stackIndex >= 0)
                {
                    var chain = this.stack.slice(stackIndex);
                    throw new SyntaxError('Circular reference detected: ' + chain.join(' < '));
                }
                resolver.call(this, expr);
            }
            finally
            {
                this.stack.pop();
            }
        },
        
        encode: function (input, wrapWithEval)
        {
            var output = this.resolveString(input);
            if (wrapWithEval)
            {
                output = this.replaceAndCache('Function') + '(' + output + ')()';
            }
            return output;
        },
        
        getCompatibleExpr: function (value)
        {
            var result = value instanceof Object ? this.getCompatibleObject(value) : value;
            return result;
        },
        
        getCompatibleObject: function (value)
        {
            var result = value[this.compatibility] || value.DEFAULT;
            return result;
        },
        
        replace: function (expr)
        {
            var replacement =
                expr.replace(
                /([0-9]+)|("(.*?)")|( +)|([$A-Z_a-z][$0-9A-Z_a-z]*)|[^!()+[\]]/g,
                this.replaceToken || (this.replaceToken = replaceToken.bind(this))
                );
            return replacement;
        },
    
        replaceAndCache: function (expr)
        {
            var replacement = this.expressionCache[expr];
            if (replacement === undefined)
            {
                this.expressionCache[expr] = replacement = this.replace(expr);
            }
            return replacement;
        },
        
        resolveCharacter: function (character)
        {
            var value = this.characterCache[character];
            if (value === undefined)
            {
                this.callResolver(
                    '"' + character + '"',
                    this.getCompatibleExpr(CHARACTERS[character]) || null,
                    function (expr)
                    {
                        if (expr == null)
                        {
                            var defaultCharacterEncoder =
                                this.getCompatibleObject(DEFAULT_CHARACTER_ENCODER);
                            expr = defaultCharacterEncoder.call(this, character);
                        }
                        this.characterCache[character] = value = Object(this.replace(expr));
                    }
                    );
            }
            return value;
        },
        
        resolveConstant: function (constant)
        {
            var value = this.constantCache[constant];
            if (value === undefined)
            {
                this.callResolver(
                    constant,
                    this.getCompatibleExpr(CONSTANTS[constant]),
                    function (expr)
                    {
                        this.constantCache[constant] = value = Object(this.replace(expr));
                    }
                    );
            }
            return value;
        },
        
        resolveConstructor: function (constructor)
        {
            var value = this.constructorCache[constructor];
            if (value === undefined)
            {
                this.callResolver(
                    constructor,
                    CONSTRUCTORS[constructor],
                    function (expr)
                    {
                        this.constructorCache[constructor] = value =
                            Object(this.replace(expr) + this.replaceAndCache('["constructor"]'));
                    }
                    );
            }
            return value;
        },
        
        resolveSimple: function (simple)
        {
            var value = SIMPLE[simple];
            if (!(value instanceof Object))
            {
                this.callResolver(
                    simple,
                    value,
                    function (expr)
                    {
                        SIMPLE[simple] = value = Object(this.replace(expr));
                    }
                    );
            }
            return value;
        },
        
        resolveString: function (string, strongBound)
        {
            var result;
            var multipart = false;
            var fullLevel;
            if (string)
            {
                if (!simplePattern)
                {
                    simplePattern = Object.keys(SIMPLE).join('|') + '|[^]';
                }
                var regExp = new RegExp(simplePattern, 'g');
                var match;
                while (match = regExp.exec(string))
                {
                    var token = match[0];
                    var tokenValue;
                    if (token in SIMPLE)
                    {
                        tokenValue = this.resolveSimple(token);
                    }
                    else
                    {
                        tokenValue = this.resolveCharacter(token);
                    }
                    var level = tokenValue.level;
                    if (tokenValue.level === undefined)
                    {
                        var type = typeof(eval(tokenValue + ''));
                        switch (type)
                        {
                        case 'string':
                            level = 1;
                            break;
                        case 'array':
                            level = 0;
                            break;
                        case 'undefined':
                            level = -2;
                            break;
                        default:
                            level = -1;
                            break;
                        }
                        tokenValue.level = level;
                    }
                    if (result && (fullLevel < 0 && level < 0 || hasOuterPlus(tokenValue)))
                    {
                        if (level !== -2)
                        {
                            tokenValue = '[' + tokenValue + ']';
                        }
                        else if (fullLevel !== -2)
                        {
                            result = '[' + result + ']';
                        }
                        else
                        {
                            result += '+[]';
                        }
                    }
                    if (result)
                    {
                        multipart = true;
                        fullLevel = 1;
                        result += '+' + tokenValue;
                    }
                    else
                    {
                        fullLevel = level;
                        result = tokenValue + '';
                    }
                }
            }
            else
            {
                fullLevel = 0;
                result = '[]';
            }
            if (fullLevel <= 0)
            {
                multipart = true;
                result += '+[]';
            }
            if (multipart && strongBound)
            {
                result = '(' + result + ')';
            }
            return result;
        }
    };
    
    function atobCharacterEncoder(charCode)
    {
        var BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        var BASE64_ALPHABET_HI_2 = 'Nft0';
        var BASE64_ALPHABET_HI_4 = 'AFINSWafinrty048';
        var BASE64_ALPHABET_LO_2 = '012f';
        var BASE64_ALPHABET_LO_4 = 'ABij012345arstuf';
        
        var param1 = BASE64_ALPHABET[charCode >> 2] + BASE64_ALPHABET_HI_2[charCode & 0x03];
        var postfix1 = '(' + this.resolveString(param1) + ')';
        var length1 = postfix1.length;
        
        var param2 =
            '0' + BASE64_ALPHABET_LO_4[charCode >> 4] + BASE64_ALPHABET_HI_4[charCode & 0x0f];
        var postfix2 = '(' + this.resolveString(param2) + ')' + this.replace('[1]');
        var length2 = postfix2.length;
        
        var param3 = '00' + BASE64_ALPHABET_LO_2[charCode >> 6] + BASE64_ALPHABET[charCode & 0x3f];
        var postfix3 = '(' + this.resolveString(param3) + ')' + this.replace('[2]');
        var length3 = postfix3.length;
        
        var postfix =
            length1 <= length2 && length1 <= length3 ?
            postfix1 :
            length2 <= length3 ? postfix2 : postfix3;
        var result = this.replaceAndCache('Function("return atob")') + '()' + postfix;
        return result;
    }
    
    function encodeDigit(digit)
    {
        switch (digit)
        {
        case '0':
            return '+[]';
        case '1':
            return '+!![]';
        default:
            var result = '!![]';
            do { result += '+!![]'; } while (--digit > 1);
            return result;
        }
    }
    
    function fillMissingDigits()
    {
        for (var number = 0; number < 10; ++number)
        {
            var digit = number + '';
            CHARACTERS[digit] = encodeDigit(digit);
        }
    }
    
    function hasOuterPlus(expr)
    {
        if (expr.outerPlus != null)
        {
            return expr.outerPlus;
        }
        var unclosed = 0;
        var regExp = /".*?"|!\+|[+([)\]]/g;
        var match;
        while (match = regExp.exec(expr))
        {
            switch (match[0])
            {
            case '+':
                if (!unclosed)
                {
                    expr.outerPlus = true;
                    return true;
                }
                break;
            case '(':
            case '[':
                ++unclosed;
                break;
            case ')':
            case ']':
                --unclosed;
                break;
            }
        }
        expr.outerPlus = false;
        return false;
    }
    
    function isFollowedByLeftSquareBracket(expr, offset)
    {
        for (;;)
        {
            var character = expr[offset++];
            if (character === '[')
            {
                return true;
            }
            if (character !== ' ')
            {
                return false;
            }
        }
    }
    
    function isPrecededByOperator(expr, offset)
    {
        for (;;)
        {
            var character = expr[--offset];
            if (character === '+' || character === '!')
            {
                return true;
            }
            if (character !== ' ')
            {
                return false;
            }
        }
    }
    
    function replaceToken(wholeMatch, number, quotedString, string, space, literal, offset, expr)
    {
        var replacement;
        if (number)
        {
            replacement = encodeDigit(number[0]);
            var length = number.length;
            for (var index = 1; index < length; ++index)
            {
                replacement += '+[' + encodeDigit(number[index]) + ']';
            }
            if (length > 1)
            {
                replacement = '+(' + replacement + ')';
            }
            if (isPrecededByOperator(expr, offset))
            {
                replacement = '(' + replacement + ')';
            }
        }
        else if (quotedString)
        {
            replacement =
                this.resolveString(
                string,
                isPrecededByOperator(expr, offset) ||
                isFollowedByLeftSquareBracket(expr, offset + wholeMatch.length)
                );
        }
        else if (space)
        {
            replacement = '';
        }
        else if (literal)
        {
            if (literal in CONSTANTS)
            {
                replacement = this.resolveConstant(literal);
            }
            else if (literal in CONSTRUCTORS)
            {
                replacement = this.resolveConstructor(literal);
            }
            else if (literal in SIMPLE)
            {
                replacement = this.resolveSimple(literal);
            }
            else
            {
                throw new SyntaxError('Undefined literal ' + literal);
            }
            if (isPrecededByOperator(expr, offset) && hasOuterPlus(replacement))
            {
                replacement = '(' + replacement + ')';
            }
        }
        else
        {
            throw new SyntaxError('Unexpected character ' + wholeMatch);
        }
        return replacement;
    }
    
    function unescapeCharacterEncoder16(charCode)
    {
        var param = '%u' + ('000' + charCode.toString(16).replace(/b/g, 'B')).slice(-4);
        var result =
            this.replaceAndCache('Function("return unescape")') +
            '()(' + this.resolveString(param) + ')';
        return result;
    }
    
    function unescapeCharacterEncoder8(charCode)
    {
        var param = '%' + ('0' + charCode.toString(16).replace(/b/g, 'B')).slice(-2);
        var result =
            this.replaceAndCache('Function("return unescape")') +
            '()(' + this.resolveString(param) + ')';
        return result;
    }
    
    fillMissingDigits();
    var encoders = { };
    
    function encode(input, wrapWithEval, compatibility)
    {
        compatibility = compatibility === undefined ? 'DEFAULT' : compatibility + '';
        var encoder = encoders[compatibility];
        if (!encoder)
        {
            encoders[compatibility] = encoder = new Encoder(compatibility);
        }
        var output = encoder.encode(input, wrapWithEval);
        return output;
    }
    
    self.JSFuck = self.JScrewIt =
    {
        encode: encode
    };
    
})(typeof(exports) === 'undefined' ? window : exports);
