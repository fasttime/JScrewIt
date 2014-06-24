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
        
        // Function boby padding constants: prepended to a function to align the body at the same
        // position on different browsers. The number after "FBP_" is the maximum character
        // overhead; the suffix "_NS" indicates that the constant does not evaluate to a string or
        // an array.
        FBP_9_NS:       '[false][+!(false+ANY_FUNCTION)["40"]]',
        FBP_10:
        {
            NO_IE:      '[0]+FBP_9_NS'
        },
        FBP_15:         'FHP_5_NS+[0]+FBP_9_NS',
        FBP_16:         'FHP_3_NS+[true]+FBP_9_NS',
        FBP_18:         'FHP_5_NS+[true]+FBP_9_NS',
        FBP_20:         'FHP_5_NS+[0]+false+FBP_9_NS',

        // Function header padding constants: prepended to a function to align the header at the
        // same position on different browsers. The number after "FHP_" is the maximum character
        // overhead; the suffix "_NS" indicates that the constant does not evaluate to a string or
        // an array.
        FHP_3_NS:
        {
            DEFAULT:    '+((ANY_FUNCTION+[])[0]+"10")',
            NO_IE:      'NaN'
        },
        FHP_5_NS:
        {
            DEFAULT:    '!!+((ANY_FUNCTION+[])[0]+1)',
            NO_IE:      'false'
        },
        FHP_7:          'FHP_3_NS+[true]',
        FHP_8:          'FHP_5_NS+[NaN]',
        
        // Regular padding constants: The number after "RP_" is the character overhead; the suffix
        // "_NS" indicates that the constant does not evaluate to a string or an array.
        RP_1_NS:        '0',
        RP_3_NS:        'NaN',
        RP_4_NS:        'true',
        RP_5:           '[false]',
        RP_5_NS:        'false',
        RP_6:           '"0false"',
        
        // Zero padding constant: used to convert an adjacent expression into a string.
        ZP:             '[]'
    };
    
    var CONSTRUCTORS =
    {
        Array:      '[]',
        Boolean:    '(false)',
        Function:   'ANY_FUNCTION',
        Number:     '(0)',
        RegExp:     'Function("return/false/")()',
        String:     '("")'
    };
    
    var CHARACTERS =
    {
        'a':            '"false"[1]',
        'b':
        {
            DEFAULT:    '(FHP_8+Number)["20"]',
            NO_IE:      '(ZP+Number)["12"]'
        },
        'c':
        {
            DEFAULT:    '(FHP_7+ANY_FUNCTION)["10"]',
            NO_IE:      '(ZP+ANY_FUNCTION)[3]'
        },
        'd':            '"undefined"[2]',
        'e':            '"true"[3]',
        'f':            '"false"[0]',
        'g':
        {
            DEFAULT:    '(FHP_7+String)["21"]',
            NO_IE:      '(RP_6+String)["20"]'
        },
        'h':            '(101)["toString"]("21")[1]',
        'i':            '(RP_5+undefined)["10"]',
        'j':            '(Function("return{}")()+[])["10"]',
        'k':            '(20)["toString"]("21")',
        'l':            '"false"[2]',
        'm':            '(RP_6+Function())["20"]',
        'n':            '"undefined"[1]',
        'o':
        {
            DEFAULT:    '(FHP_5_NS+ANY_FUNCTION)["11"]',
            NO_IE:      '(RP_4_NS+ANY_FUNCTION)["10"]'
        },
        'p':            '(211)["toString"]("31")[1]',
        'q':            '(212)["toString"]("31")[1]',
        'r':            '"true"[1]',
        's':            '"false"[3]',
        't':            '"true"[0]',
        'u':            '"undefined"[0]',
        'v':            '(FBP_15+ANY_FUNCTION)["40"]',
        'w':            '(32)["toString"]("33")',
        'x':            '(101)["toString"]("34")[1]',
        'y':            '(RP_3_NS+[Infinity])["10"]',
        'z':            '(35)["toString"]("36")',

        'A':
        {
            DEFAULT:    '(FHP_3_NS+Array)["12"]',
            NO_IE:      '(RP_1_NS+Array)["10"]'
        },
        'B':
        {
            DEFAULT:    '(FHP_3_NS+Boolean)["12"]',
            NO_IE:      '(RP_1_NS+Boolean)["10"]'
        },
        'C':            'Function("return escape")()(""["italics"]())[2]',
        'D':            'Function("return escape")()("}")[2]',
        'E':
        {
            DEFAULT:    '(FHP_8+RegExp)["20"]',
            NO_IE:      '(ZP+RegExp)["12"]'
        },
        'F':
        {
            DEFAULT:    '(FHP_3_NS+Function)["12"]',
            NO_IE:      '(RP_1_NS+Function)["10"]'
        },
        'G':            '(RP_5_NS+Function("return Date")()())["30"]',
    //  'H':    ,
        'I':            '"Infinity"[0]',
    //  'J':    ,
    //  'K':    ,
    //  'L':    ,
        'M':            '(RP_4_NS+Function("return Date")()())["30"]',
        'N':            '"NaN"[0]',
        'O':            '(RP_3_NS+Function("return{}")())["11"]',
    //  'P':    ,
    //  'Q':    ,
        'R':
        {
            DEFAULT:    '(FHP_3_NS+RegExp)["12"]',
            NO_IE:      '(RP_1_NS+RegExp)["10"]'
        },
        'S':
        {
            DEFAULT:    '(FHP_3_NS+String)["12"]',
            NO_IE:      '(RP_1_NS+String)["10"]'
        },
        'T':            '(RP_3_NS+Function("return Date")()())["30"]',
        'U':            '(RP_3_NS+Function("return{}")()["toString"]["call"]())["11"]',
    //  'V':    ,
    //  'W':    ,
    //  'X':    ,
    //  'Y':    ,
    //  'Z':    ,

        '\n':           '(ZP+Function())["23"]',
        ' ':            '(FHP_3_NS+ANY_FUNCTION)["11"]',
    //  '!':    ,
        '"':            '""["fontcolor"]()["12"]',
    //  '#':    ,
    //  '$':    ,
        '%':            'Function("return escape")()(ANY_FUNCTION)["20"]',
    //  '&':    ,
    //  '\'':   ,
        '(':            '(FHP_5_NS+ANY_FUNCTION)["20"]',
        ')':
        {
            DEFAULT:    '(FHP_5_NS+ANY_FUNCTION)["21"]',
            NO_IE:      '(RP_4_NS+ANY_FUNCTION)["20"]'
        },
    //  '*':    ,
        '+':            '(+"1e100"+[])[2]',
        ',':            '([]["slice"]["call"]("false")+[])[1]',
        '-':            '(+".0000000001"+[])[2]',
        '.':            '(+"11e20"+[])[1]',
        '/':            '"0false"["italics"]()["10"]',
        ':':            '(ZP+RegExp())[3]',
    //  ';':    ,
        '<':            '""["italics"]()[0]',
        '=':            '""["fontcolor"]()["11"]',
        '>':            '""["italics"]()[2]',
        '?':            '(ZP+RegExp())[2]',
    //  '@':    ,
        '[':
        {
            DEFAULT:    '(FBP_20+ANY_FUNCTION)["40"]',
            NO_IE:      '(FBP_10+ANY_FUNCTION)["30"]'
        },
    //  '\\':   ,
        ']':
        {
            DEFAULT:    '(FBP_18+ANY_FUNCTION)["50"]',
            NO_IE:      '(FBP_9_NS+ANY_FUNCTION)["41"]'
        },
    //  '^':    ,
    //  '_':    ,
    //  '`':    ,
        '{':            '(FHP_3_NS+ANY_FUNCTION)["21"]',
    //  '|':    ,
        '}':
        {
            DEFAULT:    '(FBP_16+ANY_FUNCTION)["50"]',
            NO_IE:      '(FBP_9_NS+ANY_FUNCTION)["43"]'
        },
    //  '~':
    };
    
    var SIMPLE =
    {
        'false':        '![]',
        'true':         '!![]',
        'undefined':    '[][[]]',
        'NaN':          '+[![]]',
        'Infinity':     '+"1e1000"'
    };
    
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
        callResolver: function (stackName, value, resolver)
        {
            var expr = value instanceof Object ? value[this.compatibility] || value.DEFAULT : value;
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
                
        replace: function (expr)
        {
            expr = expr.replace(/"(.*?)"/g, stringReplacer.bind(this));
            expr = expr.replace(/[\$A-Z_a-z][\$0-9A-Z_a-z]*/g, literalReplacer.bind(this));
            expr = expr.replace(/[0-9]+/g, numberReplacer);
            return expr;
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
                    CHARACTERS[character] || null,
                    function (expr)
                    {
                        if (expr == null)
                        {
                            var charCode = character.charCodeAt(0);
                            if (charCode < 0x100)
                            {
                                expr =
                                    this.replaceAndCache('Function("return unescape")') +
                                    '()(' +
                                    this.resolveString(
                                    '%' + ('0' + charCode.toString(16).replace(/b/g, 'B')).slice(-2)
                                    ) +
                                    ')';
                            }
                            else
                            {
                                expr =
                                    this.replaceAndCache('String["fromCharCode"]') +
                                    '(' + charCode + ')';
                            }
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
                    CONSTANTS[constant],
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
            var CONSTRUCTOR_POSTFIX = '["constructor"]';
            var value = this.constructorCache[constructor];
            if (value === undefined)
            {
                this.callResolver(
                    constructor,
                    CONSTRUCTORS[constructor],
                    function (expr)
                    {
                        this.constructorCache[constructor] = value =
                            Object(this.replace(expr) + this.replaceAndCache(CONSTRUCTOR_POSTFIX));
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
                    null,
                    function ()
                    {
                        SIMPLE[simple] = value = Object(this.replace(value));
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
                var regExp = new RegExp(Object.keys(SIMPLE).join('|') + '|[^]', 'g');
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
                        var type = typeof(eval(String(tokenValue)));
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
                        result = String(tokenValue);
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
            var digit = String(number);
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
    
    function literalReplacer(literal, offset, total)
    {
        var replacement;
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
        if (total[offset - 1] === '+' && hasOuterPlus(replacement))
        {
            replacement = '(' + replacement + ')';
        }
        return replacement;
    }
    
    function numberReplacer(number, offset, total)
    {
        var replacement = encodeDigit(number[0]);
        var length = number.length;
        for (var index = 1; index < length; ++index)
        {
            replacement += '+[' + encodeDigit(number[index]) + ']';
        }
        if (length > 1)
        {
            replacement = '+(' + replacement + ')';
        }
        if (total[offset - 1] === '+')
        {
            replacement = '(' + replacement + ')';
        }
        return replacement;
    }
    
    function stringReplacer(quotedString, string, offset, total)
    {
        var result =
            this.resolveString(
            string,
            /[+!]/.test(total[offset - 1]) || total[offset + quotedString.length] === '['
            );
        return result;
    }
    
    fillMissingDigits();
    var encoders = { };
    
    function encode(input, wrapWithEval, compatibility)
    {
        compatibility = compatibility === undefined ? 'DEFAULT' : String(compatibility);
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
