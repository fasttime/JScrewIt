/*
global
LEVEL_NUMERIC,
LEVEL_OBJECT,
LEVEL_STRING,
LEVEL_UNDEFINED,
ScrewBuffer,
createSolution,
define,
defineCharacterByAtob,
defineFBCharAt,
defineFHCharAt,
getAppendLength,
hasOuterPlus,
noProto
*/

var CHARACTERS;
var CODERS;
var COMPLEX;
var CONSTANTS;

var Encoder;

var expandEntries;

(function ()
{
    'use strict';
    
    function defineCoder(coder, minInputLength)
    {
        coder.MIN_INPUT_LENGTH = minInputLength;
        return coder;
    }
    
    var AMENDINGS = ['true', 'undefined', 'NaN'];
    
    var BASE64_ALPHABET_HI_2 = ['NaN', 'false', 'truefalse', '0'];
    
    var BASE64_ALPHABET_HI_4 =
    [
        [
            define('A'),
            define('C', 'CAPITAL_HTML'),
            define('A', 'ENTRIES')
        ],
        'F',
        'Infinity',
        'NaNfalse',
        [
            define('S'),
            define('R', 'CAPITAL_HTML')
        ],
        [
            define('W'),
            define('U', 'CAPITAL_HTML')
        ],
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
        [
            define('0B'),
            define('0R', 'CAPITAL_HTML')
        ],
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
    
    var BASE64_ALPHABET_LO_6 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    
    CHARACTERS = noProto
    ({
        'a':            '"false"[1]',
        'b':
        [
            defineFHCharAt('Number', 12),
            define('(ARRAY_ITERATOR + [])[2]', 'ENTRIES')
        ],
        'c':
        [
            defineFHCharAt('ANY_FUNCTION', 3),
            define('(RP_5_N + ARRAY_ITERATOR)["10"]', 'ENTRIES')
        ],
        'd':            '"undefined"[2]',
        'e':            '"true"[3]',
        'f':            '"false"[0]',
        'g':
        [
            defineFHCharAt('String', 14)
        ],
        'h':
        [
            define('(101)["toString"]("21")[1]'),
            defineCharacterByAtob('h')
        ],
        'i':            '([RP_5_N] + undefined)["10"]',
        'j':
        [
            define('(PLAIN_OBJECT + [])["10"]'),
            define('(self + [])[3]', 'SELF'),
            define('(ARRAY_ITERATOR + [])[3]', 'ENTRIES')
        ],
        'k':
        [
            define('(20)["toString"]("21")'),
            defineCharacterByAtob('k')
        ],
        'l':            '"false"[2]',
        'm':
        [
            define('(RP_6_SO + Function())["20"]'),
            defineFHCharAt('Number', 11, 'NO_IE_SRC'),
            defineFHCharAt('Number', 11, 'IE_SRC')
        ],
        'n':            '"undefined"[1]',
        'o':
        [
            defineFHCharAt('ANY_FUNCTION', 6),
            define('(ARRAY_ITERATOR + [])[1]', 'ENTRIES')
        ],
        'p':
        [
            define('(211)["toString"]("31")[1]'),
            define('atob("cNaN")[0]', 'ATOB', 'ENTRIES')
        ],
        'q':
        [
            define('(212)["toString"]("31")[1]'),
            defineCharacterByAtob('q')
        ],
        'r':            '"true"[1]',
        's':            '"false"[3]',
        't':            '"true"[0]',
        'u':            '"undefined"[0]',
        'v':
        [
            defineFBCharAt(19)
        ],
        'w':
        [
            define('(32)["toString"]("33")'),
            define('(self + [])["slice"]("-2")[0]', 'SELF'),
            define('(self + [])["13"]', 'WINDOW'),
            define('(RP_4_N + self)["20"]', 'DOMWINDOW'),
            defineCharacterByAtob('w')
        ],
        'x':
        [
            define('(101)["toString"]("34")[1]'),
            defineCharacterByAtob('x')
        ],
        'y':            '(RP_3_NO + [Infinity])["10"]',
        'z':
        [
            define('(35)["toString"]("36")'),
            defineCharacterByAtob('z')
        ],
        
        'A':
        [
            defineFHCharAt('Array', 9),
            define('(RP_3_NO + ARRAY_ITERATOR)[11]', 'ENTRIES')
        ],
        'B':
        [
            defineFHCharAt('Boolean', 9)
        ],
        'C':
        [
            define('escape(""["italics"]())[2]'),
            define('escape(""["sub"]())[2]'),
            define('(RP_4_N + ""["fontcolor"]())["10"]', 'CAPITAL_HTML'),
            defineCharacterByAtob('C')
        ],
        'D':
        [
            define('escape("]")[2]'),
            define('btoa("00")[1]', 'ATOB')
        ],
        'E':
        [
            define('btoa("01")[2]', 'ATOB'),
            define('(RP_5_N + ""["link"]())["10"]', 'CAPITAL_HTML'),
            defineFHCharAt('RegExp', 12)
        ],
        'F':
        [
            define('""["fontcolor"]()[1]', 'CAPITAL_HTML'),
            defineFHCharAt('Function', 9)
        ],
        'G':
        [
            define('btoa("0false")[1]', 'ATOB'),
            define('"0"["big"]()["10"]', 'CAPITAL_HTML'),
            define('(RP_5_N + Date())["30"]', 'GMT')
        ],
        'H':
        [
            define('btoa(true)[1]', 'ATOB'),
            define('""["link"]()[3]', 'CAPITAL_HTML')
        ],
        'I':            '"Infinity"[0]',
        'J':
        [
            define('btoa(true)[2]', 'ATOB')
        ],
        'K':
        [
            define('(RP_5_N + ""["strike"]())["10"]', 'CAPITAL_HTML'),
            defineCharacterByAtob('K')
        ],
        'L':
        [
            define('btoa(".")[0]', 'ATOB'),
            define('(RP_3_NO + ""["fontcolor"]())["11"]', 'CAPITAL_HTML')
        ],
        'M':
        [
            define('btoa(0)[0]', 'ATOB'),
            define('""["small"]()[2]', 'CAPITAL_HTML'),
            define('(RP_4_N + Date())["30"]', 'GMT')
        ],
        'N':            '"NaN"[0]',
        'O':
        [
            define('(RP_3_NO + PLAIN_OBJECT)["11"]'),
            define('""["fontcolor"]()[2]', 'CAPITAL_HTML')
        ],
        'P':
        [
            define('btoa(""["italics"]())[0]', 'ATOB'),
            define('"0"["sup"]()["10"]', 'CAPITAL_HTML'),
            defineCharacterByAtob('P')
        ],
        'Q':
        [
            define('btoa(1)[1]', 'ATOB')
        ],
        'R':
        [
            define('btoa("0true")[2]', 'ATOB'),
            define('""["fontcolor"]()["10"]', 'CAPITAL_HTML'),
            defineFHCharAt('RegExp', 9),
        ],
        'S':
        [
            defineFHCharAt('String', 9)
        ],
        'T':
        [
            define('btoa(NaN)[0]', 'ATOB'),
            define('""["fontcolor"]([])["20"]', 'CAPITAL_HTML'),
            define('(RP_3_NO + Date())["30"]', 'GMT')
        ],
        'U':
        [
            define('(RP_4_N + btoa(false))["10"]', 'ATOB'),
            define('""["sub"]()[2]', 'CAPITAL_HTML'),
            define(
                '(RP_3_NO + ARRAY_ITERATOR["toString"]["call"]())["11"]',
                'ENTRIES',
                'UNDEFINED'
            ),
            define('(RP_3_NO + PLAIN_OBJECT["toString"]["call"]())["11"]', 'UNDEFINED')
        ],
        'V':
        [
            define('btoa(undefined)["10"]', 'ATOB')
        ],
        'W':
        [
            define('(self + RP_3_NO)["slice"]("-10")[0]', 'SELF'),
            define('(RP_3_NO + self)["11"]', 'WINDOW'),
            define('(self + [])["11"]', 'DOMWINDOW')
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
            define('btoa(false)[0]', 'ATOB'),
            define('(RP_3_NO + ""["fontsize"]())["11"]', 'CAPITAL_HTML')
        ],
        
        '\n':
        [
            define('(Function() + [])["23"]'),
            define('(Function() + [])["22"]', 'NO_SAFARI_LF'),
            define('(RP_1_NO + FILTER)["20"]', 'FF_SAFARI_SRC'),
            define('(RP_3_NO + FILL)["20"]', 'FF_SAFARI_SRC', 'FILL'),
            define('(ANY_FUNCTION + [])[0]', 'IE_SRC')
        ],
        '\x1e':
        [
            define('(RP_5_N + atob("NaNfalse"))["10"]', 'ATOB')
        ],
        ' ':
        [
            defineFHCharAt('ANY_FUNCTION', 8),
            define('(RP_3_NO + ARRAY_ITERATOR)["10"]', 'ENTRIES'),
            define('(RP_1_NO + FILTER)["20"]', 'V8_SRC'),
            define('(RP_3_NO + FILL)["20"]', 'V8_SRC', 'FILL'),
            define('(FILTER + [])["20"]', 'FF_SAFARI_SRC'),
            define('(RP_3_NO + FILL)["21"]', 'FF_SAFARI_SRC', 'FILL')
        ],
        // '!':    ,
        '"':            '""["fontcolor"]()["12"]',
        // '#':    ,
        // '$':    ,
        '%':
        [
            define('escape(FILTER)["20"]'),
            define('escape(false + FILL)["20"]', 'NO_IE_SRC', 'FILL'),
            define('escape(ANY_FUNCTION)[0]', 'IE_SRC'),
            defineCharacterByAtob('%')
        ],
        '&':
        [
            define('""["fontcolor"]("\\"")["13"]', 'DOUBLE_QUOTE_ESC_HTML'),
            defineCharacterByAtob('&')
        ],
        // '\'':   ,
        '(':
        [
            defineFHCharAt('FILTER', 15),
            defineFHCharAt('FILL', 13, 'FILL')
        ],
        ')':
        [
            defineFHCharAt('FILTER', 16),
            defineFHCharAt('FILL', 14, 'FILL')
        ],
        // '*':    ,
        '+':            '(+"1e100" + [])[2]',
        ',':
        [
            define('([]["slice"]["call"]("false") + [])[1]'),
            define(
                function ()
                {
                    var replacement = this.replaceExpr('[[]]["concat"]([[]])');
                    var solution = createSolution(replacement, LEVEL_OBJECT);
                    return solution;
                }
            )
        ],
        '-':            '(+".0000000001" + [])[2]',
        '.':            '(+"11e20" + [])[1]',
        '/':
        [
            define('"0false"["italics"]()["10"]'),
            define('"true"["sub"]()["10"]')
        ],
        ':':
        [
            define('(RegExp() + [])[3]'),
            defineCharacterByAtob(':')
        ],
        ';':
        [
            define('""["fontcolor"]("NaN\\"")["21"]', 'DOUBLE_QUOTE_ESC_HTML'),
            defineCharacterByAtob(';')
        ],
        '<':
        [
            define('""["italics"]()[0]'),
            define('""["sub"]()[0]')
        ],
        '=':
        [
            define('""["fontcolor"]()["11"]'),
            define('btoa(0)[2]', 'ATOB')
        ],
        '>':
        [
            define('""["italics"]()[2]'),
            define('""["sub"]()["10"]')
        ],
        '?':
        [
            define('(RegExp() + [])[2]'),
            defineCharacterByAtob('?')
        ],
        // '@':    ,
        '[':
        [
            defineFBCharAt(14),
            define('(ARRAY_ITERATOR + [])[0]', 'ENTRIES')
        ],
        '\\':
        [
            define('""["fontcolor"]()["quote"]()["13"]', 'QUOTE'),
            define('(ANY_FUNCTION + [])["quote"]()[1]', 'IE_SRC', 'QUOTE'),
            define('(FILTER + [])["quote"]()["20"]', 'FF_SAFARI_SRC', 'QUOTE'),
            define('(RP_3_NO + FILL)["quote"]()["21"]', 'FF_SAFARI_SRC', 'FILL', 'QUOTE'),
            defineCharacterByAtob('\\')
        ],
        ']':
        [
            defineFBCharAt(26),
            define('(ARRAY_ITERATOR + [])[2 + [true + !!(ARRAY_ITERATOR + [])["22"]]]', 'ENTRIES'),
            define('(ARRAY_ITERATOR + [])["22"]', 'NO_SAFARI_ARRAY_ITERATOR'),
            define('(ARRAY_ITERATOR + [])["21"]', 'SAFARI_ARRAY_ITERATOR')
        ],
        '^':
        [
            define('atob("undefinedfalse")[2]', 'ATOB')
        ],
        // '_':    ,
        // '`':    ,
        '{':
        [
            defineFHCharAt('FILTER', 18),
            defineFHCharAt('FILL', 16, 'FILL')
        ],
        // '|':    ,
        '}':
        [
            defineFBCharAt(28),
        ],
        // '~':    ,
        
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
    });
    
    CODERS =
    {
        byCharCodes: defineCoder
        (
            function (inputData, maxLength)
            {
                var MAX_DECODABLE_ARGS = 65533; // limit imposed by Internet Explorer
                
                var input = inputData.valueOf();
                var long = input.length > MAX_DECODABLE_ARGS;
                var output = this.encodeByCharCodes(input, long, undefined, maxLength);
                return output;
            },
            2
        ),
        byCharCodesRadix4: defineCoder
        (
            function (inputData, maxLength)
            {
                var input = inputData.valueOf();
                var output = this.encodeByCharCodes(input, undefined, 4, maxLength);
                return output;
            },
            49
        ),
        byDict: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, undefined, undefined, maxLength);
                return output;
            },
            3
        ),
        byDictRadix4: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 4, 0, maxLength);
                return output;
            },
            284
        ),
        byDictRadix4AmendedBy1: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 4, 1, maxLength);
                return output;
            },
            378
        ),
        byDictRadix4AmendedBy2: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 4, 2, maxLength);
                return output;
            },
            710
        ),
        byDictRadix5AmendedBy2: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 5, 2, maxLength);
                return output;
            },
            686
        ),
        byDictRadix5AmendedBy3: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 5, 3, maxLength);
                return output;
            },
            854
        ),
        plain: defineCoder
        (
            function (inputData, maxLength)
            {
                var input = inputData.valueOf();
                var output = this.replaceString(input, false, maxLength);
                return output;
            }
        ),
        simple: defineCoder
        (
            function (inputData, maxLength)
            {
                var input = inputData.valueOf();
                var output = this.encodeSimple(input, maxLength);
                return output;
            }
        ),
    };
    
    COMPLEX = noProto
    ({
        Boolean:
        [
            define('Boolean["name"]', 'NAME')
        ],
        Number:
        [
            define('Number["name"]', 'NAME')
        ],
        String:
        [
            define('String["name"]', 'NAME')
        ],
    });
    
    CONSTANTS = noProto
    ({
        // JavaScript globals
        
        Array:          '[]["constructor"]',
        Boolean:        '(false)["constructor"]',
        Date:           'Function("return Date")()',
        Function:       'ANY_FUNCTION["constructor"]',
        Number:         '(0)["constructor"]',
        RegExp:         'Function("return/false/")()["constructor"]',
        String:         '("")["constructor"]',
        
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
        
        ANY_FUNCTION:
        [
            define('FILTER'),
            define('FILL', 'FILL')
        ],
        ARRAY_ITERATOR:
        [
            define('[]["entries"]()', 'ENTRIES')
        ],
        FILL:
        [
            define('[]["fill"]', 'FILL')
        ],
        FILTER:         '[]["filter"]',
        PLAIN_OBJECT:   'Function("return{}")()',
        
        // Function body extra padding blocks: prepended to a function to align the function's body
        // at the same position on different browsers.
        // The number after "FBEP_" is the maximum character overhead. The letters after the last
        // underscore have the same meaning as in regular padding blocks.
        FBEP_4_S:       '[[true][+!!(RP_5_N + ANY_FUNCTION)["40"]]]',
        FBEP_9_U:       '[false][+!(RP_5_N + ANY_FUNCTION)["40"]]',
        
        // Function header shift: used to adjust an indexer to make it point to the same position in
        // the string representation of a function's header on different browsers.
        // This evaluates to an array containing only the number 0 or only the number 1.
        FH_SHIFT:       '[+!!(+(ANY_FUNCTION + [])[0] + true)]',
        
        // Function header padding blocks: prepended to a function to align the function's header
        // at the same position on different browsers.
        // The number after "FBP_" is the maximum character overhead. The letters after the last
        // underscore have the same meaning as in regular padding blocks.
        // Unused:
        // FHP_1_S:        '[[0][+!!(+(ANY_FUNCTION + [])[0] + true)]]',
        // FHP_2_NO:       '+(+!(+(ANY_FUNCTION + [])[0] + true)+[0])',
        FHP_3_NO:       '+(1 + [+(ANY_FUNCTION + [])[0]])',
        FHP_5_N:        '!!(+(ANY_FUNCTION + [])[0] + true)',
                
        // Regular padding blocks.
        // The number after "RP_" is the character overhead.
        // The postifx "_S" in the name indicates that the constant always evaluates to a string or
        // an array.
        // The postfix "_N" in the name indicates that the constant does not always evaluate to a
        // string or an array, but it never evaluates to undefined.
        // The postfix "_U" in the name indicates that the constant can evaluate to undefined.
        // A trailing "O" as in "_NO" and "_SO" is appended to the name if the constant resolves to
        // an expression containing a plus sign ("+") out of brackets not preceded by an exclamation
        // mark ("!"). When concatenating such a constant with other expressions, the outer plus
        // constant should be placed in the beginning whenever possible in order to save an extra
        // pair of brackets in the resolved expressions.
        RP_1_NO:        '0',
        RP_3_NO:        'NaN',
        RP_4_N:         'true',
        RP_5_N:         'false',
        RP_6_SO:        '"0false"',
    });
    
    var DEFAULT_CHARACTER_ENCODER =
    [
        define(
            function (char)
            {
                var charCode = char.charCodeAt(0);
                var encoder = charCode < 0x100 ? charEncodeByUnescape8 : charEncodeByUnescape16;
                var result = createSolution(encoder.call(this, charCode), LEVEL_STRING, false);
                return result;
            }
        ),
        define(
            function (char)
            {
                var charCode = char.charCodeAt(0);
                var encoder = charCode < 0x100 ? charEncodeByAtob : charEncodeByEval;
                var result = createSolution(encoder.call(this, charCode), LEVEL_STRING, false);
                return result;
            },
            'ATOB'
        )
    ];
    
    var SIMPLE = noProto
    ({
        'false':        { expr: '![]', level: LEVEL_NUMERIC },
        'true':         { expr: '!![]', level: LEVEL_NUMERIC },
        'undefined':    { expr: '[][[]]', level: LEVEL_UNDEFINED },
        'NaN':          { expr: '+[false]', level: LEVEL_NUMERIC },
        'Infinity':     { expr: '+"1e1000"', level: LEVEL_NUMERIC }
    });
    
    var quoteString = JSON.stringify;
    
    function charEncodeByAtob(charCode)
    {
        var param1 = BASE64_ALPHABET_LO_6[charCode >> 2] + BASE64_ALPHABET_HI_2[charCode & 0x03];
        var postfix1 = '(' + this.replaceString(param1) + ')';
        if (param1.length > 2)
        {
            postfix1 += this.replaceExpr('[0]');
        }
        var length1 = postfix1.length;
        
        var param2Left = this.findBase64AlphabetDefinition(BASE64_ALPHABET_LO_4[charCode >> 4]);
        var param2Right = this.findBase64AlphabetDefinition(BASE64_ALPHABET_HI_4[charCode & 0x0f]);
        var param2 = param2Left + param2Right;
        var index2 = 1 + (param2Left.length - 2) / 4 * 3;
        if (index2 > 9)
        {
            index2 = '"' + index2 + '"';
        }
        var postfix2 =
            '(' + this.replaceString(param2) + ')' + this.replaceExpr('[' + index2 + ']');
        var length2 = postfix2.length;
        
        var param3Left = BASE64_ALPHABET_LO_2[charCode >> 6];
        var param3 = param3Left + BASE64_ALPHABET_HI_6[charCode & 0x3f];
        var index3 = 2 + (param3Left.length - 3) / 4 * 3;
        if (index3 > 9)
        {
            index3 = '"' + index3 + '"';
        }
        var postfix3 =
            '(' + this.replaceString(param3) + ')' + this.replaceExpr('[' + index3 + ']');
        var length3 = postfix3.length;
        
        var postfix =
            length1 <= length2 && length1 <= length3 ?
            postfix1 :
            length2 <= length3 ? postfix2 : postfix3;
        var result = this.resolveConstant('atob') + postfix;
        return result;
    }
    
    function charEncodeByEval(charCode)
    {
        var hexCode = this.hexCodeOf(charCode, 4);
        var result =
            this.resolveConstant('Function') + '(' +
            this.replaceString('return"\\u' + hexCode + '"') + ')()';
        if (hexCode.length > 4)
        {
            result += this.replaceExpr('[0]');
        }
        return result;
    }
    
    function charEncodeByUnescape16(charCode)
    {
        var hexCode = this.hexCodeOf(charCode, 4);
        var result =
            this.resolveConstant('unescape') + '(' + this.replaceString('%u' + hexCode) + ')';
        if (hexCode.length > 4)
        {
            result += this.replaceExpr('[0]');
        }
        return result;
    }
    
    function charEncodeByUnescape8(charCode)
    {
        var hexCode = this.hexCodeOf(charCode, 2);
        var result =
            this.resolveConstant('unescape') + '(' + this.replaceString('%' + hexCode) + ')';
        if (hexCode.length > 2)
        {
            result += this.replaceExpr('[0]');
        }
        return result;
    }
    
    function createDigitDefinition(digit)
    {
        function definition()
        {
            var result = createSolution(encodeDigit(digit), LEVEL_NUMERIC);
            return result;
        }
        
        return definition;
    }
    
    function createFrequencyList(input)
    {
        var charMap = Object.create(null);
        Array.prototype.forEach.call(
            input,
            function (char)
            {
                ++(charMap[char] || (charMap[char] = { char: char, count: 0 })).count;
            }
        );
        var freqList =
            Object.keys(charMap).map(
                function (char) { return charMap[char]; }
            ).sort(
                function (freq1, freq2) { return freq2.count - freq1.count; }
            );
        return freqList;
    }
    
    function createReindexMap(count, radix, amendings, coerceToInt)
    {
        function getSortLength()
        {
            var length = 0;
            Array.prototype.forEach.call(str, function (digit) { length += digitLengths[digit]; });
            return length;
        }
        
        var index;
        var digitLengths = [6, 8, 12, 17, 22, 27, 32, 37, 42, 47].slice(0, radix || 10);
        var regExp;
        var replacer;
        if (amendings)
        {
            var firstDigit = radix - amendings;
            var pattern = '[';
            for (index = 0; index < amendings; ++index)
            {
                var digit = firstDigit + index;
                digitLengths[digit] = getAppendLength(resolveSimple(AMENDINGS[index]));
                pattern += digit;
            }
            pattern += ']';
            regExp = new RegExp(pattern, 'g');
            replacer = function (match) { return AMENDINGS[match - firstDigit]; };
        }
        var range = [];
        for (index = 0; index < count; ++index)
        {
            var str = coerceToInt && !index ? '' : index.toString(radix);
            var reindexStr = amendings ? str.replace(regExp, replacer) : str;
            var reindex = range[index] = Object(reindexStr);
            reindex.sortLength = getSortLength();
            reindex.index = index;
        }
        range.sort(
            function (reindex1, reindex2)
            {
                var result = reindex1.sortLength - reindex2.sortLength;
                return result;
            }
        );
        return range;
    }
    
    function encodeDigit(digit)
    {
        switch (digit)
        {
        case 0:
            return '+[]';
        case 1:
            return '+!![]';
        default:
            var result = '!![]';
            do { result += '+!![]'; } while (--digit > 1);
            return result;
        }
    }
    
    function isFollowedByLeftSquareBracket(expr, offset)
    {
        for (;;)
        {
            var char = expr[offset++];
            if (char === '[')
            {
                return true;
            }
            if (char !== ' ')
            {
                return false;
            }
        }
    }
    
    function isPrecededByOperator(expr, offset)
    {
        for (;;)
        {
            var char = expr[--offset];
            if (char === '+' || char === '!')
            {
                return true;
            }
            if (char !== ' ')
            {
                return false;
            }
        }
    }
    
    function replaceToken(wholeMatch, number, quotedString, space, literal, offset, expr)
    {
        var replacement;
        if (number)
        {
            replacement = encodeDigit(+number[0]) + '';
            var length = number.length;
            for (var index = 1; index < length; ++index)
            {
                replacement += '+[' + encodeDigit(+number[index]) + ']';
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
            var string;
            try
            {
                string = JSON.parse(quotedString);
            }
            catch (e)
            {
                this.throwSyntaxError('Illegal string ' + quotedString);
            }
            var strongBound =
                isPrecededByOperator(expr, offset) ||
                isFollowedByLeftSquareBracket(expr, offset + wholeMatch.length);
            replacement = this.replaceString(string, strongBound);
            if (!replacement)
            {
                this.throwSyntaxError('String too complex');
            }
        }
        else if (space)
        {
            replacement = '';
        }
        else if (literal)
        {
            var solution;
            if (literal in this.constantDefinitions)
            {
                solution = this.resolveConstant(literal);
            }
            else if (literal in SIMPLE)
            {
                solution = resolveSimple(literal);
            }
            else
            {
                this.throwSyntaxError('Undefined literal ' + literal);
            }
            replacement =
                isPrecededByOperator(expr, offset) && hasOuterPlus(solution) ?
                '(' + solution + ')' : solution + '';
        }
        else
        {
            this.throwSyntaxError('Unexpected character ' + quoteString(wholeMatch));
        }
        return replacement;
    }
    
    function resolveSimple(simple)
    {
        var solution = SIMPLE[simple];
        if (typeof solution.valueOf() === 'object')
        {
            var encoder = new Encoder();
            encoder.callResolver(
                simple,
                function ()
                {
                    SIMPLE[simple] = solution =
                        createSolution(encoder.replaceExpr(solution.expr), solution.level);
                }
            );
        }
        return solution;
    }
    
    // Create definitions for digits
    (function ()
    {
        for (var digit = 0; digit <= 9; ++digit)
        {
            CHARACTERS[digit] = createDigitDefinition(digit);
        }
    
    })();
    
    Encoder =
        function (featureMask)
        {
            this.featureMask = featureMask;
            this.characterCache = { };
            this.complexCache = { };
            this.constantCache = { };
            this.stack = [];
        };
    
    Encoder.prototype =
    {
        callCoders: function (input, coderNames)
        {
            var output;
            var inputLength = input.length;
            var inputData = Object(input);
            coderNames.forEach(
                function (coderName)
                {
                    var coder = CODERS[coderName];
                    if (!(inputLength < coder.MIN_INPUT_LENGTH))
                    {
                        var maxLength = output != null ? output.length : undefined;
                        var newOutput = coder.call(this, inputData, maxLength);
                        if (newOutput != null)
                        {
                            output = newOutput;
                        }
                    }
                },
                this
            );
            return output;
        },
        
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
        
        charEncodeByAtob: function (charCode)
        {
            var result = charEncodeByAtob.call(this, charCode);
            return result;
        },
        
        constantDefinitions: CONSTANTS,
        
        createCharCodesEncoding: function (charCodes, long, radix)
        {
            var output;
            if (radix)
            {
                output =
                    charCodes +
                    this.replace(
                        '["map"](Function("return String.fromCharCode(parseInt(arguments[0],' +
                        radix + '))"))["join"]([])'
                    );
            }
            else
            {
                if (long)
                {
                    output =
                        charCodes +
                        this.replace(
                            '["map"](Function("return String.fromCharCode(arguments[0])"))' +
                            '["join"]([])'
                        );
                }
                else
                {
                    output =
                        this.resolveConstant('Function') + '(' +
                        this.replaceString('return String.fromCharCode(') + '+' + charCodes +
                        '+' + this.replaceString(')') + ')()';
                }
            }
            return output;
        },
        
        createDictEncoding: function (dict, indexes, radix, amendings, coerceToInt)
        {
            var mapper;
            if (radix)
            {
                var parseIntArg;
                if (amendings)
                {
                    var firstDigit = radix - amendings;
                    if (amendings > 2)
                    {
                        parseIntArg =
                            '[' +
                            AMENDINGS.slice(0, amendings).map(
                                function (amending) { return '/' + amending + '/g'; }
                            ).join() +
                            '].reduce(function(falsefalse,falsetrue,truefalse){return falsefalse.' +
                            'replace(falsetrue,truefalse+' + firstDigit + ')},arguments[0])';
                    }
                    else
                    {
                        parseIntArg = 'arguments[0]';
                        for (var index = 0; index < amendings; ++index)
                        {
                            var digit = firstDigit + index;
                            parseIntArg += '.replace(/' + AMENDINGS[index] + '/g,' + digit + ')';
                        }
                    }
                }
                else
                {
                    parseIntArg = 'arguments[0]';
                }
                if (coerceToInt)
                {
                    parseIntArg = '+' + parseIntArg;
                }
                mapper =
                    'Function("return this[parseInt(' + parseIntArg + ',' + radix + ')]")["bind"]';
            }
            else
            {
                mapper = '""["charAt"]["bind"]';
            }
            var output =
                indexes + this.replace('["map"]') + '(' + this.replace(mapper) + '(' + dict + '))' +
                this.replace('["join"]([])');
            return output;
        },
        
        createStringTokenPattern: function ()
        {
            function callback(complex)
            {
                var result = this.complexCache[complex] !== null;
                return result;
            }
            
            var stringTokenPattern =
                Object.keys(SIMPLE).concat(Object.keys(COMPLEX).filter(callback, this)).join('|') +
                '|[^]';
            this.stringTokenPattern = stringTokenPattern;
            return stringTokenPattern;
        },
        
        encode: function (input, wrapWith)
        {
            var output =
                this.callCoders(
                    input,
                    [
                        'byDictRadix5AmendedBy3',
                        'byDictRadix4AmendedBy2',
                        'byDictRadix5AmendedBy2',
                        'byDictRadix4AmendedBy1',
                        'byDictRadix4',
                        'byDict',
                        'simple'
                    ]
                );
            if (!output)
            {
                throw new Error('Encoding failed');
            }
            if (wrapWith === 'call')
            {
                output = this.resolveConstant('Function') + '(' + output + ')()';
            }
            else if (wrapWith === 'eval')
            {
                output = this.replace('Function("return eval")()') + '(' + output + ')';
            }
            return output;
        },
        
        encodeByCharCodes: function (input, long, radix, maxLength)
        {
            var charCodes =
                this.replaceNumberArray(
                    Array.prototype.map.call(
                        input,
                        function (char) { return char.charCodeAt().toString(radix); }
                    ),
                    maxLength
                );
            if (charCodes)
            {
                var output = this.createCharCodesEncoding(charCodes, long, radix);
                if (!(output.length > maxLength))
                {
                    return output;
                }
            }
        },
        
        encodeByDict: function (inputData, radix, amendings, maxLength)
        {
            var input = inputData.valueOf();
            var freqList = inputData.freqList || (inputData.freqList = createFrequencyList(input));
            var coerceToInt =
                freqList.length &&
                freqList[0].count * 6 > getAppendLength(this.resolveCharacter('+'));
            var reindexMap = createReindexMap(freqList.length, radix, amendings, coerceToInt);
            var charMap = Object.create(null);
            var minFreqIndexLength =
                Math.max((input.length - 1) * (resolveSimple('false').length + 1) - 3, 0);
            var dictChars = [];
            freqList.forEach(
                function (freq, index)
                {
                    var reindex = reindexMap[index];
                    var char = freq.char;
                    charMap[char] = reindex;
                    minFreqIndexLength += freq.count * reindex.sortLength;
                    dictChars[reindex.index] = char;
                }
            );
            var dict = this.encodeSimple(dictChars.join(''), maxLength - minFreqIndexLength);
            if (dict)
            {
                var freqIndexes =
                    this.replaceNumberArray(
                        Array.prototype.map.call(
                            input,
                            function (char)
                            {
                                var index = charMap[char];
                                return index;
                            }
                        ),
                        maxLength - dict.length
                    );
                if (freqIndexes)
                {
                    var output =
                        this.createDictEncoding(
                            dict,
                            freqIndexes,
                            radix,
                            amendings,
                            coerceToInt
                        );
                    if (!(output.length > maxLength))
                    {
                        return output;
                    }
                }
            }
        },
        
        encodeSimple: function (input, maxLength)
        {
            if (!(maxLength < 0))
            {
                var output = this.callCoders(input, ['byCharCodesRadix4', 'byCharCodes', 'plain']);
                if (output && !(output.length > maxLength))
                {
                    return output;
                }
            }
        },
        
        findBase64AlphabetDefinition: function (element)
        {
            var definition;
            if (Array.isArray(element))
            {
                definition = this.findBestDefinition(element);
            }
            else
            {
                definition = element;
            }
            return definition;
        },
        
        findBestDefinition: function (entries)
        {
            for (var index = entries.length; index--;)
            {
                var entry = entries[index];
                if (this.hasFeatures(entry.featureMask))
                {
                    return entry.definition;
                }
            }
        },
        
        findOptimalSolution: function (entries)
        {
            var result;
            entries = expandEntries(entries);
            for (var index = entries.length; index--;)
            {
                var entry = entries[index];
                if (this.hasFeatures(entry.featureMask))
                {
                    var definition = entry.definition;
                    var solution = this.resolve(definition);
                    if (!result || result.length >= solution.length)
                    {
                        result = solution;
                    }
                }
            }
            return result;
        },
        
        hasFeatures: function (featureMask)
        {
            return (featureMask & this.featureMask) === featureMask;
        },
        
        hexCodeOf: function (charCode, length)
        {
            var optimalB = this.findBestDefinition([define('B'), define('b', 'ENTRIES')]);
            var result = charCode.toString(16).replace(/b/g, optimalB);
            result = Array(length - result.length + 1).join(0) + result.replace(/fa?$/, 'false');
            return result;
        },
        
        // The maximum value that can be safely used as the first group threshold of a ScrewBuffer.
        // "Safely" means such that the extreme decoding test is passed in all engines.
        // This value is typically limited by the free memory available on the stack, and since the
        // memory layout of the stack changes at runtime in an unstable way, the maximum safe value
        // cannot be determined exactly.
        // The lowest recorded value so far is 1844, measured in an Android Browser 4.2.2 running
        // on an Intel Atom emulator.
        // Internet Explorer on Windows Phone occasionally failed the extreme decoding test in a
        // non-reproducible manner, although the issue seems to be related to the output size rather
        // than the grouping threshold setting.
        
        maxGroupThreshold: 1800,
        
        replace: function (definition)
        {
            var result = this.resolve(definition) + '';
            return result;
        },
        
        replaceExpr: function (expr)
        {
            var result =
                expr.replace(
                    /([0-9]+)|("(?:\\.|(?!").)*")|( +)|([$A-Z_a-z][$0-9A-Z_a-z]*)|[^!()+[\]]/g,
                    this.replaceToken || (this.replaceToken = replaceToken.bind(this))
                );
            return result;
        },
        
        replaceNumberArray: function (array, maxLength)
        {
            var replacement = this.replaceString(array.join(false), true, maxLength);
            if (replacement)
            {
                var result = replacement + this.replace('["split"](false)');
                if (!(result.length > maxLength))
                {
                    return result;
                }
            }
        },
        
        replaceString: function (string, strongBound, maxLength)
        {
            function makeRegExp()
            {
                regExp = new RegExp(stringTokenPattern, 'g');
            }
            
            var buffer = new ScrewBuffer(strongBound, this.maxGroupThreshold);
            var stringTokenPattern = this.stringTokenPattern || this.createStringTokenPattern();
            var match;
            var regExp;
            makeRegExp();
            while (match = regExp.exec(string))
            {
                if (buffer.length > maxLength)
                {
                    return;
                }
                var token = match[0];
                var solution;
                if (token in SIMPLE)
                {
                    solution = resolveSimple(token);
                }
                else if (token in COMPLEX)
                {
                    solution = this.resolveComplex(token);
                    if (!solution)
                    {
                        stringTokenPattern = this.createStringTokenPattern();
                        var lastIndex = regExp.lastIndex - token.length;
                        makeRegExp();
                        regExp.lastIndex = lastIndex;
                        continue;
                    }
                }
                else
                {
                    solution = this.resolveCharacter(token);
                }
                if (!buffer.append(solution))
                {
                    return;
                }
            }
            var result = buffer + '';
            if (!(result.length > maxLength))
            {
                return result;
            }
        },
        
        resolve: function (definition)
        {
            var solution;
            if (definition instanceof Function)
            {
                solution = definition.call(this);
            }
            else
            {
                var replacement = this.replaceExpr(definition);
                solution = createSolution(replacement, LEVEL_STRING);
            }
            return solution;
        },
        
        resolveCharacter: function (character)
        {
            var solution = this.characterCache[character];
            if (solution === undefined)
            {
                this.callResolver(
                    quoteString(character),
                    function ()
                    {
                        var entries = CHARACTERS[character];
                        if (entries != null)
                        {
                            solution = this.findOptimalSolution(entries);
                        }
                        if (!solution)
                        {
                            var defaultCharacterEncoder =
                                this.findBestDefinition(DEFAULT_CHARACTER_ENCODER);
                            solution = defaultCharacterEncoder.call(this, character);
                        }
                        this.characterCache[character] = solution;
                    }
                );
            }
            return solution;
        },
        
        resolveComplex: function (complex)
        {
            var solution = this.complexCache[complex];
            if (solution === undefined)
            {
                this.callResolver(
                    quoteString(complex),
                    function ()
                    {
                        var solution = null;
                        var entries = COMPLEX[complex];
                        var optimalSolution = this.findOptimalSolution(entries);
                        if (optimalSolution)
                        {
                            var discreteLength = -1;
                            Array.prototype.forEach.call(
                                complex,
                                function (character)
                                {
                                    var solution = this.resolveCharacter(character);
                                    discreteLength += getAppendLength(solution);
                                },
                                this
                            );
                            if (discreteLength >= optimalSolution.length)
                            {
                                solution = optimalSolution;
                            }
                        }
                        this.complexCache[complex] = solution;
                    }
                );
            }
            return solution;
        },
        
        resolveConstant: function (constant)
        {
            var solution = this.constantCache[constant];
            if (solution === undefined)
            {
                this.callResolver(
                    constant,
                    function ()
                    {
                        var entries = this.constantDefinitions[constant];
                        solution = this.findOptimalSolution(entries);
                        this.constantCache[constant] = solution;
                    }
                );
            }
            return solution;
        },
        
        throwSyntaxError: function (message)
        {
            var stack = this.stack;
            var stackLength = stack.length;
            if (stackLength)
            {
                message += ' in the definition of ' + stack[stackLength - 1];
            }
            throw new SyntaxError(message);
        }
    };
    
    expandEntries =
        function (entries)
        {
            if (!Array.isArray(entries))
            {
                entries = [define(entries)];
            }
            return entries;
        };

})();
