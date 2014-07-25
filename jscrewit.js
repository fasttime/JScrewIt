(function (self)
{
    'use strict';
    
    // BEGIN: Features /////////////////
    
    var FEATURES =
    {
        NO_SAFARI:
        {
            check: function ()
            {
                return (new Function() + '')[22] === '\n';
            }
        },
        NO_IE:
        {
            check: function ()
            {
                return /^function Object\(\) \{(\n   )? \[native code\][^]\}/.test(Object);
            }
        },
        CHROME:
        {
            check: function ()
            {
                return /^.{19} \[native code\] \}/.test(Object);
            }
        },
        FF_SAFARI:
        {
            check: function ()
            {
                return /^.{19}\n    \[native code\]\n\}/.test(Object);
            }
        },
        IE:
        {
            check: function ()
            {
                return /^\nfunction Object\(\) \{\n    \[native code\]\n\}/.test(Object);
            }
        },
        GMT: // not for IE < 11
        {
            check: function ()
            {
                return /^.{25}GMT/.test(Date());
            }
        },
        SELF: // not for Node.js
        {
            check: function ()
            {
                return 'self' in self;
            }
        },
        ATOB: // not for IE < 10 and Node.js
        {
            check: function ()
            {
                return 'atob' in self && 'btoa' in self;
            }
        },
        NAME: // not for IE
        {
            check: function ()
            {
                return 'name' in new Function();
            }
        },
    };
    
    var arraySlice = Array.prototype.slice;
    
    function define(definition)
    {
        var features = getFeatures(arraySlice.call(arguments, 1));
        var result = { definition: definition, features: features };
        return result;
    }
    
    function getFeatures(featureNames)
    {
        var features = 0;
        for (var index = featureNames.length; index > 0;)
        {
            features |= FEATURES[featureNames[--index]].value;
        }
        return features;
    }
    
    // Assign a power of 2 value to each feature
    (
    function ()
    {
        var featureNames = Object.getOwnPropertyNames(FEATURES);
        var length = featureNames.length;
        for (var index = 0; index < length; ++index)
        {
            var featureName = featureNames[index];
            var feature = FEATURES[featureName];
            feature.value = 1 << index;
        }
    }
    )();
    
    // END: Features ///////////////////
    
    // BEGIN: Compatibilities //////////
    
    function getAutoFeatureNames()
    {
        var result = [];
        var featureNames = Object.getOwnPropertyNames(FEATURES);
        var length = featureNames.length;
        for (var index = 0; index < length; ++index)
        {
            var featureName = featureNames[index];
            var feature = FEATURES[featureName];
            var available = feature.check();
            feature.available = available;
            if (available)
            {
                result.push(featureName);
            }
        }
        return result;
    }
    
    var COMPATIBILITIES =
    {
        DEFAULT:    [],
        NO_IE:      ['NO_IE', 'GMT', 'NAME'],
        NO_NODE:    ['SELF', 'ATOB'],
        AUTO:       getAutoFeatureNames()
    };
    
    // END: Compatibilities ////////////
    
    // BEGIN: Encoder //////////////////
    
    // Definition syntax has been changed to match Javascript more closely. The main differences
    // from JSFuck are:
    // * Support for constant literals like "ANY_FUNCTION", "FHP_3_NO", etc. improves readability
    //   and simplifies maintenance.
    // * 10 evaluates to a number, while "10" evaluates to a string. This can make a difference in
    //   certain expressions and may affect the mapping length.
    // * String literals must be always double quoted.
    
    var CHARACTERS =
    {
        'a':            '"false"[1]',
        'b':
        [
            define('(FHP_8 + Number)["20"]'),
            define('(Number + [])["12"]', 'NO_IE'),
            define('(Number + [])["13"]', 'IE')
        ],
        'c':
        [
            define('(FHP_7 + ANY_FUNCTION)["10"]'),
            define('(ANY_FUNCTION + [])[3]', 'NO_IE')
        ],
        'd':            '"undefined"[2]',
        'e':            '"true"[3]',
        'f':            '"false"[0]',
        'g':            '(FHP_6 + String)["20"]',
        'h':            '(101)[TO_STRING]("21")[1]',
        'i':            '(RP_5_S + undefined)["10"]',
        'j':
        [
            define('(Function("return{}")() + [])["10"]'),
            define('(self + [])[3]', 'SELF')
        ],
        'k':            '(20)[TO_STRING]("21")',
        'l':            '"false"[2]',
        'm':
        [
            define('(RP_6_SO + Function())["20"]'),
            define('(Number + [])["11"]', 'NO_IE'),
            define('(Number + [])["12"]', 'IE')
        ],
        'n':            '"undefined"[1]',
        'o':
        [
            define('(FHP_5 + ANY_FUNCTION)["11"]'),
            define('(RP_4_N + ANY_FUNCTION)["10"]', 'NO_IE'),
            define('(RP_3_NO + ANY_FUNCTION)["10"]', 'IE')
        ],
        'p':            '(211)[TO_STRING]("31")[1]',
        'q':            '(212)[TO_STRING]("31")[1]',
        'r':            '"true"[1]',
        's':            '"false"[3]',
        't':            '"true"[0]',
        'u':            '"undefined"[0]',
        'v':
        [
            define('(FBP_15 + FILTER)["40"]'),
            define('(FBP_5 + FILTER)["30"]', 'NO_IE'),
            define('(FILTER + [])["30"]', 'IE')
        ],
        'w':            '(32)[TO_STRING]("33")',
        'x':            '(101)[TO_STRING]("34")[1]',
        'y':            '(RP_3_NO + [Infinity])["10"]',
        'z':            '(35)[TO_STRING]("36")',

        'A':            '(FHP_1 + Array)["10"]',
        'B':            '(FHP_1 + Boolean)["10"]',
        'C':
        [
            define('escape(""["italics"]())[2]'),
            define(null, 'ATOB')
        ],
        'D':
        [
            define('escape("]")[2]'),
            define('btoa("00")[1]', 'ATOB')
        ],
        'E':
        [
            define('(FHP_8 + RegExp)["20"]'),
            define('(RegExp + [])["12"]', 'NO_IE'),
            define('(RegExp + [])["13"]', 'IE'),
            define('btoa("01")[2]', 'ATOB')
        ],
        'F':            '(FHP_1 + Function)["10"]',
        'G':
        [
            define('(RP_5_N + Date())["30"]', 'GMT'),
            define('btoa("0false")[1]', 'ATOB')
        ],
        'H':
        [
            define('btoa(true)[1]', 'ATOB')
        ],
        'I':            '"Infinity"[0]',
        'J':
        [
            define('btoa(true)[2]', 'ATOB')
        ],
     // 'K':    ,
        'L':
        [
            define('btoa(".")[0]', 'ATOB')
        ],
        'M':
        [
            define('(RP_4_N + Date())["30"]', 'GMT'),
            define('btoa(0)[0]', 'ATOB')
        ],
        'N':            '"NaN"[0]',
        'O':            '(RP_3_NO + Function("return{}")())["11"]',
        'P':
        [
            define('btoa(""["italics"]())[0]', 'ATOB')
        ],
        'Q':
        [
            define('btoa(1)[1]', 'ATOB')
        ],
        'R':
        [
            define('(FHP_1 + RegExp)["10"]'),
            define('btoa("0true")[2]', 'ATOB')
        ],
        'S':            '(FHP_1 + String)["10"]',
        'T':
        [
            define('(RP_3_NO + Date())["30"]', 'GMT'),
            define('btoa(NaN)[0]', 'ATOB')
        ],
        'U':
        [
            define('(RP_3_NO + Function("return{}")()[TO_STRING]["call"]())["11"]'),
            define('(RP_4_N + btoa(false))["10"]', 'ATOB')
        ],
        'V':
        [
            define('btoa(undefined)["10"]', 'ATOB')
        ],
        'W':
        [
            // self + '' is '[object DOMWindow]' in Android Browser 4.1.2 and '[object Window]' in
            // other browsers.
            define('(self + RP_3_NO)["slice"]("-10")[0]', 'SELF')
        ],
        'X':
        [
            define('btoa("1true")[1]', 'ATOB')
        ],
        'Y':
        [
            define('btoa("a")[0]', 'ATOB')
        ],
        'Z':
        [
            define('btoa(false)[0]', 'ATOB')
        ],

        '\n':
        [
            define('(Function() + [])["23"]'),
            define('(Function() + [])["22"]', 'NO_SAFARI'),
            define('(RP_1_NO + FILTER)["20"]', 'FF_SAFARI'),
            define('(ANY_FUNCTION + [])[0]', 'IE')
        ],
        '\x1e':
        [
            define('(RP_5_N + atob("NaNfalse"))["10"]', 'ATOB')
        ],
        ' ':
        [
            define('(FHP_3 + ANY_FUNCTION)["11"]'),
            define('(RP_1_NO + FILTER)["20"]', 'CHROME'),
            define('(FILTER + [])["20"]', 'FF_SAFARI'),
            define('(RP_1_NO + ANY_FUNCTION)["10"]', 'IE')
        ],
    //  '!':    ,
        '"':            '""["fontcolor"]()["12"]',
    //  '#':    ,
    //  '$':    ,
        '%':
        [
            define('escape(FILTER)["20"]'),
            define('escape(FILTER)[0]', 'IE'),
            define(null, 'ATOB'),
        ],
    //  '&':    ,
    //  '\'':   ,
        '(':            '(FHP_5 + FILTER)["20"]',
        ')':
        [
            define('(FHP_5 + FILTER)["21"]'),
            define('(RP_4_N + FILTER)["20"]', 'NO_IE'),
            define('(RP_3_NO + FILTER)["20"]', 'IE')
        ],
    //  '*':    ,
        '+':            '(+"1e100" + [])[2]',
        ',':            '([]["slice"]["call"]("false") + [])[1]',
        '-':            '(+".0000000001" + [])[2]',
        '.':            '(+"11e20" + [])[1]',
        '/':            '"0false"["italics"]()["10"]',
        ':':
        [
            define('(RegExp() + [])[3]'),
            define(null, 'ATOB')
        ],
    //  ';':    ,
        '<':            '""["italics"]()[0]',
        '=':            '""["fontcolor"]()["11"]',
        '>':            '""["italics"]()[2]',
        '?':            '(RegExp() + [])[2]',
    //  '@':    ,
        '[':
        [
            define('(FBP_10 + FILTER)["30"]'),
            define('(FILTER + [])["20"]', 'CHROME')
        ],
    //  '\\':   ,
        ']':
        [
            define('(FBP_9 + FILTER)["41"]'),
            define('(FILTER + [])["32"]', 'CHROME'),
            define('(RP_4_N + FILTER)["40"]', 'FF_SAFARI'),
            define('(RP_3_NO + FILTER)["40"]', 'IE')
        ],
        '^':
        [
            define('atob("undefinedfalse")[2]', 'ATOB')
        ],
    //  '_':    ,
    //  '`':    ,
        '{':
        [
            define('(FHP_3 + FILTER)["21"]'),
            define('(RP_1_NO + FILTER)["20"]', 'IE')
        ],
    //  '|':    ,
        '}':
        [
            define('(FBP_7 + FILTER)["41"]'),
            define('(FBP_9 + FILTER)["43"]', 'NO_IE'),
            define('(RP_6_SO + FILTER)["40"]', 'CHROME'),
            define('(RP_3_NO + FILTER)["41"]', 'FF_SAFARI'),
            define('(RP_1_NO + FILTER)["40"]', 'IE')
        ],
    //  '~':    ,
        
        '\x8a':
        [
            define('(RP_4_N + atob("NaNundefined"))["10"]', 'ATOB')
        ],
        '\x8d':
        [
            define('atob("0NaN")[2]', 'ATOB')
        ],
        '\x96':
        [
            define('atob("00false")[3]', 'ATOB')
        ],
        '\x9e':
        [
            define('atob(true)[2]', 'ATOB')
        ],
        '£':
        [
            define('atob(NaN)[1]', 'ATOB')
        ],
        '¥':
        [
            define('atob("0false")[2]', 'ATOB')
        ],
        '§':
        [
            define('atob("00undefined")[2]', 'ATOB')
        ],
        '©':
        [
            define('atob("falsefalse")[1]', 'ATOB')
        ],
        '®':
        [
            define('atob("NaNtrue")[3]', 'ATOB')
        ],
        '±':
        [
            define('atob("0false")[3]', 'ATOB')
        ],
        '¶':
        [
            define('atob(true)[0]', 'ATOB')
        ],
        'º':
        [
            define('atob("undefinedfalse")[0]', 'ATOB')
        ],
        '»':
        [
            define('atob(true)[1]', 'ATOB')
        ],
        'Ö':
        [
            define('atob("0NaN")[1]', 'ATOB')
        ],
        'Ú':
        [
            define('atob("0truefalse")[1]', 'ATOB')
        ],
        'Ý':
        [
            define('atob("0undefined")[2]', 'ATOB')
        ],
        'â':
        [
            define('atob("falsefalseundefined")["11"]', 'ATOB')
        ],
        'é':
        [
            define('atob("0undefined")[1]', 'ATOB')
        ],
        'î':
        [
            define('atob("0truefalse")[2]', 'ATOB')
        ],
        'ö':
        [
            define('atob("0false")[1]', 'ATOB')
        ],
        'ø':
        [
            define('atob("undefinedundefined")["10"]', 'ATOB')
        ],
    };
    
    var CONSTANTS =
    {
        // Javascript globals
        
        Array:          '[][CONSTRUCTOR]',
        Boolean:        '(false)[CONSTRUCTOR]',
        Date:           'Function("return Date")()',
        Function:       'ANY_FUNCTION[CONSTRUCTOR]',
        Number:         '(0)[CONSTRUCTOR]',
        RegExp:         'Function("return/false/")()[CONSTRUCTOR]',
        String:         '("")[CONSTRUCTOR]',
        
        atob:
        [
            define('Function("return atob")()', 'ATOB')
        ],
        btoa:
        [
            define('Function("return btoa")()', 'ATOB')
        ],
        escape:         'Function("return escape")()',
        self:
        [
            define('Function("return self")()', 'SELF')
        ],
        unescape:       'Function("return unescape")()',
        
        // Custom definitions
        
        ANY_FUNCTION:   'FILTER',
        
        CONSTRUCTOR:    '"constructor"',
        
        FILTER:         '[]["filter"]',
        
        TO_STRING:
        [
            define('"toString"'),
            define('"to" + String["name"]', 'NAME')
        ],
        
        // Function body extra padding blocks. The number after "FBEP_" is the maximum character
        // overhead. The letters after the last underscore have the same meaning as in regular
        // padding blocks.
        FBEP_4_S:       '[[true][+!!(RP_5_N + ANY_FUNCTION)["40"]]]',
        FBEP_9_N:       '[false][+!(RP_5_N + ANY_FUNCTION)["40"]]',
        
        // Function body padding constants: prepended to a function to align the body at the same
        // position on different browsers. The number after "FBP_" is the maximum character
        // overhead.
        FBP_5:
        [
            // Unused:
            // define('FHP_1_S + FBEP_4_S'),
            define('RP_1_NO + FBEP_4_S', 'NO_IE'),
            define('RP_5_N', 'CHROME'),
            define('RP_1_NO', 'FF_SAFARI')
        ],
        FBP_7:
        [
            define('FHP_3_NO + FBEP_4_S'),
            // Unused:
            // define('RP_3_NO + FBEP_4_S', 'NO_IE')
        ],
        FBP_9:
        [
            define('FHP_5_N + FBEP_4_S'),
            define('FBEP_9_N', 'NO_IE')
        ],
        FBP_10:
        [
            define('FHP_1_S + FBEP_9_N'),
            define('RP_1_S + FBEP_9_N', 'NO_IE'),
            define('RP_6_SO', 'FF_SAFARI'),
            define('RP_5_N', 'IE')
        ],
        FBP_15:
        [
            define('FHP_5_N + RP_1_S + FBEP_9_N'),
            // Unused:
            // define('RP_6_SO + FBEP_9_N', 'NO_IE')
        ],

        // Function header padding blocks. The number after "FBP_" is the maximum character
        // overhead. The letters after the last underscore have the same meaning as in regular
        // padding blocks.
        FHP_1_S:        '[[0][+!!(+(ANY_FUNCTION + [])[0] + true)]]',
        // Unused:
        // FHP_2_NO:       '+(+!(+(ANY_FUNCTION + [])[0] + true)+[0])',
        FHP_3_NO:       '+(1 + [+(ANY_FUNCTION + [])[0]])',
        FHP_5_N:        '!!(+(ANY_FUNCTION + [])[0] + true)',
        
        // Function header padding constants: prepended to a function to align the header at the
        // same position on different browsers. The number after "FHP_" is the maximum character
        // overhead.
        FHP_1:
        [
            define('FHP_1_S'),
            define('RP_1_NO', 'NO_IE'),
            define('[]', 'IE')
        ],
        FHP_3:
        [
            define('FHP_3_NO'),
            define('RP_3_NO', 'NO_IE')
        ],
        FHP_5:
        [
            define('FHP_5_N'),
            define('RP_5_N', 'NO_IE'),
            define('RP_4_N', 'IE')
        ],
        FHP_6:
        [
            define('FHP_5_N + RP_1_S'),
            define('RP_6_SO', 'NO_IE'),
            define('RP_5_N', 'IE')
        ],
        FHP_7:
        [
            define('FHP_3_NO + RP_4_S'),
            define('RP_6_SO', 'IE')
        ],
        FHP_8:          'FHP_3_NO + RP_5_S',
        FHP_9:          'FHP_5_N + RP_4_S',
        
        // Regular padding blocks. The number after "RP_" is the character overhead. The postfix
        // "_N" in the name indicates that the constant does not evaluate to a string or array. The
        // postifx "_S" in the name indicates that the constant does evaluate to a string or array.
        // A trailing "O" as in "_NO" and "_SO" is appended to the name if the constant resolves to
        // an expression containing a plus sign ("+") out of brackets (PSOOB). When concatenating
        // such a constant with other expressions, the PSOOB constant should be placed in the
        // beginning whenever possible in order to save an extra pair of brackets in the resolved
        // expressions.
        RP_1_NO:        '0',
        RP_1_S:         '[0]',
        RP_3_NO:        'NaN',
        RP_4_N:         'true',
        RP_4_S:         '[true]',
        RP_5_N:         'false',
        RP_5_S:         '[false]',
        RP_6_SO:        '"0false"',
    };
    
    var DEFAULT_CHARACTER_ENCODER =
    [
        define(
            function (character)
            {
                var charCode = character.charCodeAt(0);
                var encoder =
                    charCode < 0x100 ? unescapeCharacterEncoder8 : unescapeCharacterEncoder16;
                var result = encoder.call(this, charCode);
                return result;
            }
        ),
        define(
            function (character)
            {
                var charCode = character.charCodeAt(0);
                var encoder = charCode < 0x100 ? atobCharacterEncoder : unescapeCharacterEncoder16;
                var result = encoder.call(this, charCode);
                return result;
            },
            'ATOB'
        )
    ];
    
    var SIMPLE =
    {
        'false':        '![]',
        'true':         '!![]',
        'undefined':    '[][[]]',
        'NaN':          '+[![]]',
        'Infinity':     '+"1e1000"',
    };
    
    var quoteCharacter = JSON.stringify;
    var simplePattern;
    
    function atobCharacterEncoder(charCode)
    {
        var BASE64_ALPHABET_HI_2 = ['NaN', 'false', 'truefalse', '0'];
        var BASE64_ALPHABET_HI_4 =
        [
            'A',
            'F',
            'Infinity',
            'NaNfalse',
            'S',
            'W',
            'a',
            'false',
            'i',
            'n',
            'r',
            'true',
            'y',
            '0',
            '4',
            '8',
        ];
        var BASE64_ALPHABET_HI_6 =
        [
            'A',
            'B',
            'C',
            'D',
            'E',
            'F',
            'G',
            'H',
            'Infinity',
            'J',
            'K',
            'L',
            'M',
            'NaN',
            'O',
            'P',
            'Q',
            'R',
            'S',
            'T',
            'U',
            'V',
            'W',
            'X',
            'Y',
            'Z',
            'a',
            'b',
            'c',
            'd',
            'e',
            'false',
            'g',
            'h',
            'i',
            'j',
            'k',
            'l',
            'm',
            'n',
            'o',
            'p',
            'q',
            'r',
            's',
            'true',
            'undefined',
            'v',
            'w',
            'x',
            'y',
            'z',
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '+',
            '/',
        ];
        var BASE64_ALPHABET_LO_2 = ['000', 'NaN', 'falsefalsefalse', '00f'];
        var BASE64_ALPHABET_LO_4 =
        [
            '0A',
            '0B',
            '0i',
            '0j',
            '00',
            '01',
            '02',
            '03',
            '04',
            '05',
            '0a',
            '0r',
            '0s',
            '0t',
            'undefinedfalse',
            '0f',
        ];
        var BASE64_ALPHABET_LO_6 =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        
        var param1 = BASE64_ALPHABET_LO_6[charCode >> 2] + BASE64_ALPHABET_HI_2[charCode & 0x03];
        var postfix1 = '(' + this.resolveString(param1) + ')';
        if (param1.length > 2)
        {
            postfix1 += this.replace('[0]');
        }
        var length1 = postfix1.length;
        
        var param2Left = BASE64_ALPHABET_LO_4[charCode >> 4];
        var param2 = param2Left + BASE64_ALPHABET_HI_4[charCode & 0x0f];
        var index2 = 1 + (param2Left.length - 2) / 4 * 3;
        if (index2 > 9)
        {
            index2 = '"' + index2 + '"';
        }
        var postfix2 = '(' + this.resolveString(param2) + ')' + this.replace('[' + index2 + ']');
        var length2 = postfix2.length;
        
        var param3Left = BASE64_ALPHABET_LO_2[charCode >> 6];
        var param3 = param3Left + BASE64_ALPHABET_HI_6[charCode & 0x3f];
        var index3 = 2 + (param3Left.length - 3) / 4 * 3;
        if (index3 > 9)
        {
            index3 = '"' + index3 + '"';
        }
        var postfix3 = '(' + this.resolveString(param3) + ')' + this.replace('[' + index3 + ']');
        var length3 = postfix3.length;
        
        var postfix =
            length1 <= length2 && length1 <= length3 ?
            postfix1 :
            length2 <= length3 ? postfix2 : postfix3;
        var result = this.resolveConstant('atob') + postfix;
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
    
    // Determine whether the specified expression contains a plus sign out of brackets.
    function hasPsoob(expr)
    {
        if (expr.psoob != null)
        {
            return expr.psoob;
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
                    expr.psoob = true;
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
        expr.psoob = false;
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
            else if (literal in SIMPLE)
            {
                replacement = this.resolveSimple(literal);
            }
            else
            {
                throw new SyntaxError(
                    'Undefined literal ' + literal + ' in the definition of ' +
                    this.peekLastFromStack()
                    );
            }
            if (isPrecededByOperator(expr, offset) && hasPsoob(replacement))
            {
                replacement = '(' + replacement + ')';
            }
        }
        else
        {
            throw new SyntaxError(
                'Unexpected character ' + quoteCharacter(wholeMatch) + ' in the definition of ' +
                this.peekLastFromStack()
                );
        }
        return replacement;
    }
    
    function unescapeCharacterEncoder16(charCode)
    {
        var param =
            '%u' +
            ('000' + charCode.toString(16).replace(/b/g, 'B')).slice(-4).replace(/fa?$/, 'false');
        var result = this.resolveConstant('unescape') + '(' + this.resolveString(param) + ')';
        if (param.length > 6)
        {
            result += this.replace('[0]');
        }
        return result;
    }
    
    function unescapeCharacterEncoder8(charCode)
    {
        var param =
            '%' +
            ('0' + charCode.toString(16).replace(/b/g, 'B')).slice(-2).replace(/fa?$/, 'false');
        var result = this.resolveConstant('unescape') + '(' + this.resolveString(param) + ')';
        if (param.length > 3)
        {
            result += this.replace('[0]');
        }
        return result;
    }
    
    function Encoder(compatibility)
    {
        this.features = getFeatures(COMPATIBILITIES[compatibility]);
        this.characterCache = { };
        this.constantCache = { };
        this.stack = [];
    }
    
    Encoder.prototype =
    {
        callResolver: function (stackName, resolver)
        {
            var stack = this.stack;
            var stackIndex = stack.indexOf(stackName);
            stack.push(stackName);
            try
            {
                if (stackIndex >= 0)
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
        
        encode: function (input, wrapWithEval)
        {
            var output = this.resolveString(input);
            if (wrapWithEval)
            {
                output = this.resolveConstant('Function') + '(' + output + ')()';
            }
            return output;
        },
        
        findBestDefinition: function (entries)
        {
            for (var index = entries.length; index-- > 0;)
            {
                var entry = entries[index];
                var entryFeatures = entry.features;
                if ((entryFeatures & this.features) === entryFeatures)
                {
                    return entry.definition;
                }
            }
        },
                
        peekLastFromStack: function ()
        {
            var stack = this.stack;
            var result = stack[stack.length - 1];
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
        
        resolveCharacter: function (character)
        {
            var value = this.characterCache[character];
            if (value === undefined)
            {
                this.callResolver(
                    quoteCharacter(character),
                    function ()
                    {
                        var expr;
                        var entries = CHARACTERS[character];
                        if (Array.isArray(entries))
                        {
                            expr = this.findBestDefinition(entries);
                        }
                        else
                        {
                            expr = entries;
                        }
                        if (expr == null)
                        {
                            var defaultCharacterEncoder =
                                this.findBestDefinition(DEFAULT_CHARACTER_ENCODER);
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
                    function ()
                    {
                        var expr;
                        var entries = CONSTANTS[constant];
                        if (Array.isArray(entries))
                        {
                            expr = this.findBestDefinition(entries);
                        }
                        else
                        {
                            expr = entries;
                        }
                        this.constantCache[constant] = value = Object(this.replace(expr));
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
                    if (result && (fullLevel < 0 && level < 0 || hasPsoob(tokenValue)))
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
    
    // Create definitions for digits
    (
    function ()
    {
        for (var number = 0; number < 10; ++number)
        {
            var digit = number + '';
            CHARACTERS[digit] = encodeDigit(digit);
        }
    }
    )();
    
    // END: Encoder ////////////////////
    
    // BEGIN: JScrewIt /////////////////
    
    function encode(input, wrapWithEval, compatibility)
    {
        var encoder = getEncoder(compatibility);
        var output = encoder.encode(input, wrapWithEval);
        return output;
    }
    
    function fixCompatibility(compatibility)
    {
        if (compatibility != null)
        {
            compatibility += '';
            if (compatibility in COMPATIBILITIES)
            {
                return compatibility;
            }
        }
        return 'DEFAULT';
    }
    
    function getEncoder(compatibility)
    {
        compatibility = fixCompatibility(compatibility);
        var encoder = encoders[compatibility];
        if (!encoder)
        {
            encoders[compatibility] = encoder = new Encoder(compatibility);
        }
        return encoder;
    }
    
    function getFeatureNames(compatibility)
    {
        compatibility = fixCompatibility(compatibility);
        var featureNames = COMPATIBILITIES[compatibility];
        var result = featureNames.slice();
        return result;
    }
    
    function isAvailable(compatibility)
    {
        var featureNames = COMPATIBILITIES[compatibility];
        var result =
            featureNames &&
            featureNames.every(
                function (featureName)
                {
                    return FEATURES[featureName].available;
                }
            );
        return result;
    }
    
    var encoders = { };
    
    var JScrewIt =
    {
        encode:             encode,
        getFeatureNames:    getFeatureNames,
        isAvailable:        isAvailable
    };
    
    self.JSFuck = self.JScrewIt = JScrewIt;
    
    // END: JScrewIt ///////////////////
    
    // BEGIN: Debug only ///////////////
    
    function debugReplace(input, compatibility)
    {
        var encoder = getEncoder(compatibility);
        var output = encoder.replace(input);
        return output;
    }
    
    JScrewIt.debugReplace = debugReplace;
    
    // END: Debug only /////////////////
    
})(typeof(exports) === 'undefined' ? window : exports);
