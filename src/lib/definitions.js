/*
global
Empty,
createDefinitionEntry,
define,
defineProperty,
noProto,
replaceIndexer,
resolveSimple
*/

var AMENDINGS;
var CREATE_PARSE_INT_ARG;
var DEFAULT_CHARACTER_ENCODER;
var FROM_CHAR_CODE;
var OPTIMAL_B;

var BASE64_ALPHABET_HI_2;
var BASE64_ALPHABET_HI_4;
var BASE64_ALPHABET_HI_6;
var BASE64_ALPHABET_LO_2;
var BASE64_ALPHABET_LO_4;
var BASE64_ALPHABET_LO_6;

// Definition syntax has been changed to match JavaScript more closely. The main differences from
// JSFuck are:
// * Support for constant literals like "ANY_FUNCTION", "FHP_3_NO", etc. improves readability and
//   simplifies maintenance.
// * 10 evaluates to a number, while "10" evaluates to a string. This can make a difference in
//   certain expressions and may affect the mapping length.
// * String literals must be always double quoted.

var CHARACTERS;
var COMPLEX;
var CONSTANTS;
var SIMPLE;

var LEVEL_NUMERIC;
var LEVEL_OBJECT;
var LEVEL_STRING;
var LEVEL_UNDEFINED;

var createParseIntArgDefault;
var createSolution;
var replaceDigit;

(function ()
{
    'use strict';
    
    var FB_NO_IE_PADDINGS =
    [
        ,
        ,
        ,
        ,
        ,
        'RP_1_NO + FBEP_4_S',
        ,
        'RP_3_NO + FBEP_4_S',
        ,
        'FBEP_9_U',
        '[RP_1_NO] + FBEP_9_U',
        ,
        '[RP_3_NO] + FBEP_9_U',
    ];
    
    var FB_PADDINGS =
    [
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        'FBP_7_NO',
        'RP_1_NO + [FBP_7_NO]',
        ,
        'RP_3_NO + [FBP_7_NO]',
        ,
        'RP_5_N + [FBP_7_NO]',
    ];
    
    var FH_PADDINGS =
    [
        ,
        ,
        ,
        'FHP_3_NO',
        ,
        'FHP_5_N',
        'FHP_5_N + [RP_1_NO]',
        'FHP_3_NO + [RP_4_N]',
        'FHP_3_NO + [RP_5_N]',
    ];
    
    var R_PADDINGS =
    [
        '[]',
        'RP_1_NO',
        ,
        'RP_3_NO',
        'RP_4_N',
        'RP_5_N',
        'RP_6_SO',
    ];
    
    var FB_EXPR_INFOS =
    [
        define({ expr: 'FILTER', shift: 6 }),
        define({ expr: 'FILL', shift: 4 }, 'FILL')
    ];
    
    var FB_PADDING_INFOS =
    [
        define({ blocks: FB_PADDINGS, shift: 0 }),
        define({ blocks: FB_NO_IE_PADDINGS, shift: 0 }, 'NO_IE_SRC'),
        define({ blocks: R_PADDINGS, shift: 0 }, 'V8_SRC'),
        define({ blocks: R_PADDINGS, shift: 4 }, 'FF_SAFARI_SRC'),
        define({ blocks: R_PADDINGS, shift: 5 }, 'IE_SRC')
    ];
    
    var FH_PADDING_INFOS =
    [
        define({ blocks: FH_PADDINGS, shift: 0 }),
        define({ blocks: R_PADDINGS, shift: 0 }, 'NO_IE_SRC'),
        define({ blocks: R_PADDINGS, shift: 1 }, 'IE_SRC')
    ];
    
    function charEncodeByAtob(charCode)
    {
        var param1 = BASE64_ALPHABET_LO_6[charCode >> 2] + BASE64_ALPHABET_HI_2[charCode & 0x03];
        var postfix1 = '(' + this.replaceString(param1) + ')';
        if (param1.length > 2)
            postfix1 += replaceIndexer(0);
        var length1 = postfix1.length;
        
        var param2Left = this.findBase64AlphabetDefinition(BASE64_ALPHABET_LO_4[charCode >> 4]);
        var param2Right = this.findBase64AlphabetDefinition(BASE64_ALPHABET_HI_4[charCode & 0x0f]);
        var param2 = param2Left + param2Right;
        var index2 = 1 + (param2Left.length - 2) / 4 * 3;
        var indexer2 = replaceIndexer(index2);
        var postfix2 = '(' + this.replaceString(param2) + ')' + indexer2;
        var length2 = postfix2.length;
        
        var param3Left = BASE64_ALPHABET_LO_2[charCode >> 6];
        var param3 = param3Left + BASE64_ALPHABET_HI_6[charCode & 0x3f];
        var index3 = 2 + (param3Left.length - 3) / 4 * 3;
        var indexer3 = replaceIndexer(index3);
        var postfix3 = '(' + this.replaceString(param3) + ')' + indexer3;
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
            result += replaceIndexer(0);
        return result;
    }
    
    function charEncodeByUnescape16(charCode)
    {
        var hexCode = this.hexCodeOf(charCode, 4);
        var result =
            this.resolveConstant('unescape') + '(' + this.replaceString('%u' + hexCode) + ')';
        if (hexCode.length > 4)
            result += replaceIndexer(0);
        return result;
    }
    
    function charEncodeByUnescape8(charCode)
    {
        var hexCode = this.hexCodeOf(charCode, 2);
        var result =
            this.resolveConstant('unescape') + '(' + this.replaceString('%' + hexCode) + ')';
        if (hexCode.length > 2)
            result += replaceIndexer(0);
        return result;
    }
    
    function createCharAtDefinition(expr, index, entries, paddingInfos)
    {
        function definition()
        {
            var solution = this.resolveExprAt(expr, index, entries, paddingInfos);
            return solution;
        }
        
        return definition;
    }
    
    function createCommaSolution()
    {
        var block = this.replaceExpr('["concat"]');
        var replacement = '[[]]' + block + '([[]])';
        var solution = createSolution(replacement, LEVEL_OBJECT, false);
        var appendLength = block.length - 1;
        solution.bridge = { block: block, appendLength: appendLength };
        return solution;
    }
    
    function createFBCharAtDefinition(offset)
    {
        function definition()
        {
            var functionDefinition = this.findBestDefinition(FB_EXPR_INFOS);
            var expr = functionDefinition.expr;
            var index = offset + functionDefinition.shift;
            var paddingEntries;
            switch (index)
            {
            case 18:
                paddingEntries =
                [
                    define(12),
                    define(3, 'V8_SRC'),
                    define(0, 'FF_SAFARI_SRC'),
                    define(0, 'IE_SRC')
                ];
                break;
            case 20:
            case 30:
                paddingEntries =
                [
                    define(10),
                    define(10, 'NO_IE_SRC'),
                    define(0, 'V8_SRC'),
                    define(6, 'FF_SAFARI_SRC'),
                    define(5, 'IE_SRC')
                ];
                break;
            case 23:
                paddingEntries =
                [
                    define(7),
                    define(0, 'V8_SRC'),
                    define(3, 'FF_SAFARI_SRC'),
                    define(3, 'IE_SRC')
                ];
                break;
            case 25:
                paddingEntries =
                [
                    define(7),
                    define(5, 'NO_IE_SRC'),
                    define(1, 'FF_SAFARI_SRC'),
                    define(0, 'IE_SRC')
                ];
                break;
            case 32:
                paddingEntries =
                [
                    define(8),
                    define(9, 'NO_IE_SRC'),
                    define(0, 'V8_SRC'),
                    define(4, 'FF_SAFARI_SRC'),
                    define(3, 'IE_SRC')
                ];
                break;
            case 34:
                paddingEntries =
                [
                    define(7),
                    define(9, 'NO_IE_SRC'),
                    define(6, 'V8_SRC'),
                    define(3, 'FF_SAFARI_SRC'),
                    define(1, 'IE_SRC')
                ];
                break;
            }
            var solution = this.resolveExprAt(expr, index, paddingEntries, FB_PADDING_INFOS);
            return solution;
        }
        
        return definition;
    }
    
    function defineFBCharAt(offset)
    {
        var definition = createFBCharAtDefinition(offset);
        var entry = define(definition);
        return entry;
    }
    
    function defineFHCharAt(expr, index)
    {
        var entries;
        switch (index)
        {
        case 3:
        case 13:
            entries =
            [
                define(7),
                define(0, 'NO_IE_SRC'),
                define(6, 'IE_SRC')
            ];
            break;
        case 6:
        case 16:
            entries =
            [
                define(5),
                define(4, 'NO_IE_SRC'),
                define(3, 'IE_SRC')
            ];
            break;
        case 8:
        case 18:
            entries =
            [
                define(3),
                define(1, 'IE_SRC')
            ];
            break;
        case 9:
            entries =
            [
                define({ block: 'RP_1_NO', indexer: '1 + FH_SHIFT_1' }),
                define(1, 'NO_IE_SRC'),
                define(0, 'IE_SRC')
            ];
            break;
        case 11:
            entries =
            [
                define(0, 'NO_IE_SRC'),
                define(0, 'IE_SRC')
            ];
            break;
        case 12:
            entries =
            [
                define(8),
                define(0, 'NO_IE_SRC'),
                define(0, 'IE_SRC')
            ];
            break;
        case 14:
            entries =
            [
                define(6),
                define(5, 'IE_SRC')
            ];
            break;
        case 15:
            entries =
            [
                define(5),
                define(4, 'IE_SRC')
            ];
            break;
        }
        var definition = createCharAtDefinition(expr, index, entries, FH_PADDING_INFOS);
        var entry = createDefinitionEntry(definition, arguments, 2);
        return entry;
    }
    
    function defineSimple(simple, expr, level)
    {
        function get()
        {
            var definition = { expr: expr, level: level };
            var solution = resolveSimple(simple, definition);
            defineProperty(SIMPLE, simple, { value: solution });
            return solution;
        }
        
        defineProperty(SIMPLE, simple, { configurable: true, enumerable: true, get: get });
    }
    
    AMENDINGS = ['true', 'undefined', 'NaN'];
    
    BASE64_ALPHABET_HI_2 = ['NaN', 'false', 'undefined', '0'];
    
    BASE64_ALPHABET_HI_4 =
    [
        [
            define('A'),
            define('C', 'CAPITAL_HTML'),
            define('B', 'CAPITAL_HTML', 'ENTRIES_OBJ'),
            define('A', 'ARRAY_ITERATOR')
        ],
        'F',
        'Infinity',
        'NaNfalse',
        [
            define('S'),
            define('R', 'CAPITAL_HTML'),
            define('S', 'ENTRIES_OBJ')
        ],
        [
            define('U'),
            define('W', 'ANY_WINDOW'),
            define('W', 'ATOB'),
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
    
    BASE64_ALPHABET_HI_6 =
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
    
    BASE64_ALPHABET_LO_2 = ['000', 'NaN', 'falsefalsefalse', '00f'];
    
    BASE64_ALPHABET_LO_4 =
    [
        '0A',
        [
            define('0B'),
            define('0R', 'CAPITAL_HTML'),
            define('0B', 'ENTRIES_OBJ')
        ],
        '0i',
        [
            define('0j'),
            define('0T', 'CAPITAL_HTML'),
            define('0j', 'ENTRIES_OBJ')
        ],
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
    
    BASE64_ALPHABET_LO_6 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    
    CHARACTERS = noProto
    ({
        'a': '"false"[1]',
        'b':
        [
            defineFHCharAt('Number', 12),
            define('(ARRAY_ITERATOR + [])[2]', 'ENTRIES_OBJ')
        ],
        'c':
        [
            defineFHCharAt('ANY_FUNCTION', 3),
            define('(RP_5_N + ARRAY_ITERATOR)["10"]', 'ENTRIES_OBJ')
        ],
        'd': '"undefined"[2]',
        'e': '"true"[3]',
        'f': '"false"[0]',
        'g':
        [
            defineFHCharAt('String', 14)
        ],
        'h':
        [
            define('101["toString"]("21")[1]'),
            define('btoa("0false")[3]', 'ATOB')
        ],
        'i': '([RP_5_N] + undefined)["10"]',
        'j':
        [
            define('(PLAIN_OBJECT + [])["10"]'),
            define('(ARRAY_ITERATOR + [])[3]', 'ENTRIES_OBJ'),
            define('(self + [])[3]', 'SELF_OBJ')
        ],
        'k':
        [
            define('20["toString"]("21")'),
            define()
        ],
        'l': '"false"[2]',
        'm':
        [
            define('(RP_6_SO + Function())["20"]'),
            defineFHCharAt('Number', 11, 'IE_SRC'),
            defineFHCharAt('Number', 11, 'NO_IE_SRC')
        ],
        'n': '"undefined"[1]',
        'o':
        [
            defineFHCharAt('ANY_FUNCTION', 6),
            define('(ARRAY_ITERATOR + [])[1]', 'ENTRIES_OBJ')
        ],
        'p':
        [
            define('211["toString"]("31")[1]'),
            define('(RP_3_NO + btoa(undefined))["10"]', 'ATOB')
        ],
        'q':
        [
            define('212["toString"]("31")[1]'),
            define()
        ],
        'r': '"true"[1]',
        's': '"false"[3]',
        't': '"true"[0]',
        'u': '"undefined"[0]',
        'v':
        [
            defineFBCharAt(19)
        ],
        'w':
        [
            define('32["toString"]("33")'),
            define('(self + [])[SUBSTR]("-2")[0]', 'ANY_WINDOW'),
            define('atob("undefined0")[1]', 'ATOB'),
            define('(RP_4_N + self)["20"]', 'DOMWINDOW'),
            define('(self + [])["13"]', 'WINDOW')
        ],
        'x':
        [
            define('101["toString"]("34")[1]'),
            define('btoa("falsefalse")["10"]', 'ATOB')
        ],
        'y': '(RP_3_NO + [Infinity])["10"]',
        'z':
        [
            define('35["toString"]("36")'),
            define('btoa("falsefalse")["11"]', 'ATOB')
        ],
        
        'A':
        [
            defineFHCharAt('Array', 9),
            define('(RP_3_NO + ARRAY_ITERATOR)["11"]', 'ARRAY_ITERATOR')
        ],
        'B':
        [
            defineFHCharAt('Boolean', 9),
            define('""["sub"]()[3]', 'CAPITAL_HTML')
        ],
        'C':
        [
            define('escape(""["italics"]())[2]'),
            define('escape(""["sub"]())[2]'),
            define('atob("00NaNfalse")[1]', 'ATOB'),
            define('(RP_4_N + ""["fontcolor"]())["10"]', 'CAPITAL_HTML')
        ],
        'D':
        [
            define('escape("]")[2]'),
            define('escape("}")[2]'),
            define('escape(PLAIN_OBJECT)["20"]'),
            define('(document + RP_1_NO)[SUBSTR]("-10")[0]', 'ANY_DOCUMENT'),
            define('btoa("00")[1]', 'ATOB'),
            define('(RP_3_NO + document)["11"]', 'DOCUMENT'),
            define('(document + [])["12"]', 'HTMLDOCUMENT'),
            define('escape(ARRAY_ITERATOR)["30"]', 'NO_OLD_SAFARI_ARRAY_ITERATOR'),
            define('escape(NaN + ARRAY_ITERATOR)["30"]', 'OLD_SAFARI_ARRAY_ITERATOR'),
            define('escape(FILTER)["50"]', 'V8_SRC'),
            define('escape(FILL)["60"]', 'FF_SAFARI_SRC', 'FILL')
        ],
        'E':
        [
            defineFHCharAt('RegExp', 12),
            define('btoa("0NaN")[1]', 'ATOB'),
            define('(RP_5_N + ""["link"]())["10"]', 'CAPITAL_HTML')
        ],
        'F':
        [
            defineFHCharAt('Function', 9),
            define('""["fontcolor"]()[1]', 'CAPITAL_HTML')
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
            define('""["link"]()[3]', 'CAPITAL_HTML'),
            define('(RP_3_NO + Function("return history")())["11"]', 'HISTORY'),
            define('(RP_3_NO + document)["11"]', 'HTMLDOCUMENT')
        ],
        'I': '"Infinity"[0]',
        'J':
        [
            define('"j"["toUpperCase"]()'),
            define('btoa(true)[2]', 'ATOB'),
            define()
        ],
        'K':
        [
            define('(RP_5_N + ""["strike"]())["10"]', 'CAPITAL_HTML')
        ],
        'L':
        [
            define('btoa(".")[0]', 'ATOB'),
            define('(RP_3_NO + ""["fontcolor"]())["11"]', 'CAPITAL_HTML'),
            define('(document + [])["11"]', 'HTMLDOCUMENT')
        ],
        'M':
        [
            define('btoa(0)[0]', 'ATOB'),
            define('""["small"]()[2]', 'CAPITAL_HTML'),
            define('(RP_4_N + Date())["30"]', 'GMT'),
            define('(document + [])["10"]', 'HTMLDOCUMENT')
        ],
        'N': '"NaN"[0]',
        'O':
        [
            define('(RP_3_NO + PLAIN_OBJECT)["11"]'),
            define('btoa(NaN)[3]', 'ATOB'),
            define('""["fontcolor"]()[2]', 'CAPITAL_HTML')
        ],
        'P':
        [
            define('btoa(""["italics"]())[0]', 'ATOB'),
            define('btoa(""["sub"]())[0]', 'ATOB'),
            define('(RP_3_NO + btoa("falseO"))["10"]', 'ATOB'),
            define('(Function("return toolbar")() + [])["11"]', 'BARPROP'),
            define('"0"["sup"]()["10"]', 'CAPITAL_HTML'),
            define()
        ],
        'Q':
        [
            define('"q"["toUpperCase"]()'),
            define('btoa(1)[1]', 'ATOB'),
            define()
        ],
        'R':
        [
            defineFHCharAt('RegExp', 9),
            define('btoa("0true")[2]', 'ATOB'),
            define('""["fontcolor"]()["10"]', 'CAPITAL_HTML')
        ],
        'S':
        [
            defineFHCharAt('String', 9),
            define('""["sub"]()[1]', 'CAPITAL_HTML')
        ],
        'T':
        [
            define('(Function("try{undefined.false}catch(undefined){return undefined}")()+[])[0]'),
            define('btoa(NaN)[0]', 'ATOB'),
            define('""["fontcolor"]([])["20"]', 'CAPITAL_HTML'),
            define('(RP_3_NO + Date())["30"]', 'GMT'),
            define('(RP_1_NO + document)["10"]', 'HTMLDOCUMENT')
        ],
        'U':
        [
            define('btoa("1NaN")[1]', 'ATOB'),
            define('""["sub"]()[2]', 'CAPITAL_HTML'),
            define('(RP_3_NO + PLAIN_OBJECT["toString"]["call"]())["11"]', 'UNDEFINED'),
            define(
                '(RP_3_NO + ARRAY_ITERATOR["toString"]["call"]())["11"]',
                'ENTRIES_OBJ',
                'UNDEFINED'
            )
        ],
        'V':
        [
            define('unescape("%56")'),
            define('"v"["toUpperCase"]()'),
            define('btoa(undefined)["10"]', 'ATOB')
        ],
        'W':
        [
            define('unescape("%57")'),
            define('"w"["toUpperCase"]()'),
            define('(self + RP_4_N)[SUBSTR]("-11")[0]', 'ANY_WINDOW'),
            define('btoa(undefined)[1]', 'ATOB'),
            define('(self + [])["11"]', 'DOMWINDOW'),
            define('(RP_3_NO + self)["11"]', 'WINDOW')
        ],
        'X':
        [
            define('"x"["toUpperCase"]()'),
            define('btoa("1true")[1]', 'ATOB'),
            define()
        ],
        'Y':
        [
            define('"y"["toUpperCase"]()'),
            define('btoa("a")[0]', 'ATOB'),
            define()
        ],
        'Z':
        [
            define('btoa(false)[0]', 'ATOB'),
            define('(RP_3_NO + ""["fontsize"]())["11"]', 'CAPITAL_HTML')
        ],
        
        '\n':
        [
            define('(Function() + [])["23"]'),
            define('(Function() + [])["22"]', 'NO_OLD_SAFARI_LF'),
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
            define('(RP_3_NO + ARRAY_ITERATOR)["10"]', 'ENTRIES_OBJ'),
            define('(FILTER + [])["20"]', 'FF_SAFARI_SRC'),
            define('(RP_1_NO + FILTER)["20"]', 'V8_SRC'),
            define('(RP_5_N + FILL)["20"]', 'NO_IE_SRC', 'FILL'),
            define('(FILL + [])["20"]', 'FF_SAFARI_SRC', 'FILL')
        ],
        // '!':    ,
        '"':
        [
            define('""["fontcolor"]()["12"]')
        ],
        // '#':    ,
        // '$':    ,
        '%':
        [
            define('escape(FILTER)["20"]'),
            define('escape(ANY_FUNCTION)[0]', 'IE_SRC'),
            define('escape(false + FILL)["20"]', 'NO_IE_SRC', 'FILL'),
            define('atob("000l")[2]', 'ATOB')
        ],
        '&':
        [
            define('""["fontcolor"](""["fontcolor"]())["13"]', 'ESC_HTML_ALL'),
            define('""["fontcolor"](""["sub"]())["20"]', 'ESC_HTML_ALL'),
            define('""["fontcolor"]("\\"")["13"]', 'ESC_HTML_QUOT'),
            define('""["fontcolor"](""["fontcolor"]([]))["31"]', 'ESC_HTML_QUOT_ONLY'),
            define()
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
        '+': '(+"1e100" + [])[2]',
        ',':
        [
            define('([]["slice"]["call"]("false") + [])[1]'),
            define(createCommaSolution)
        ],
        '-': '(+".0000000001" + [])[2]',
        '.': '(+"11e20" + [])[1]',
        '/':
        [
            define('"0false"["italics"]()["10"]'),
            define('"true"["sub"]()["10"]')
        ],
        ':':
        [
            define('(RegExp() + [])[3]'),
            define()
        ],
        ';':
        [
            define('""["fontcolor"](true + ""["fontcolor"]())["20"]', 'ESC_HTML_ALL'),
            define('""["fontcolor"](true + ""["sub"]())["20"]', 'ESC_HTML_ALL'),
            define('""["fontcolor"]("NaN\\"")["21"]', 'ESC_HTML_QUOT'),
            define('""["fontcolor"](""["fontcolor"]())["30"]', 'ESC_HTML_QUOT_ONLY'),
            define()
        ],
        '<':
        [
            define('""["italics"]()[0]'),
            define('""["sub"]()[0]')
        ],
        '=':
        [
            define('""["fontcolor"]()["11"]')
        ],
        '>':
        [
            define('""["italics"]()[2]'),
            define('""["sub"]()["10"]')
        ],
        '?':
        [
            define('(RegExp() + [])[2]'),
            define()
        ],
        // '@':    ,
        '[':
        [
            defineFBCharAt(14),
            define('(ARRAY_ITERATOR + [])[0]', 'ENTRIES_OBJ')
        ],
        // '\\':   ,
        ']':
        [
            defineFBCharAt(26),
            define('(RP_6_SO + PLAIN_OBJECT)["20"]'),
            define('(ARRAY_ITERATOR + [])["22"]', 'NO_OLD_SAFARI_ARRAY_ITERATOR'),
            define('(ARRAY_ITERATOR + [])["21"]', 'OLD_SAFARI_ARRAY_ITERATOR')
        ],
        '^':
        [
            define('atob("undefined0")[2]', 'ATOB')
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
            defineFBCharAt(28)
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
            define('atob("undefined0")[0]', 'ATOB')
        ],
        '»':
        [
            define('atob(true)[1]', 'ATOB')
        ],
        'Ç':
        [
            define('atob("falsefalsefalse")["10"]', 'ATOB')
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
        '∞':
        [
            define('Infinity["toLocaleString"]()', 'LOCALE_INFINITY'),
            define()
        ]
    });
    
    COMPLEX = noProto
    ({
        Number:
        [
            define('Number["name"]', 'NAME'),
            define(undefined, 'ENTRIES_OBJ')
        ],
        Object:
        [
            define('Object["name"]', 'NAME'),
            define(undefined, 'CAPITAL_HTML', 'NO_IE_SRC', 'SELF_OBJ'),
            define('Object["name"]', 'FF_SAFARI_SRC', 'NAME'),
            define('Object["name"]', 'INTL', 'NAME'),
            define('Object["name"]', 'NAME', 'V8_SRC'),
            define(undefined, 'ENTRIES_OBJ')
        ],
        RegExp:
        [
            define('RegExp["name"]', 'NAME')
        ],
        String:
        [
            define('String["name"]', 'NAME'),
            define(undefined, 'CAPITAL_HTML', 'ENTRIES_OBJ')
        ],
    });
    
    CONSTANTS = noProto
    ({
        // JavaScript globals
        
        Array:
        [
            define('[]["constructor"]')
        ],
        Boolean:
        [
            define('false["constructor"]')
        ],
        Date:
        [
            define('Function("return Date")()')
        ],
        Function:
        [
            define('ANY_FUNCTION["constructor"]')
        ],
        Number:
        [
            define('0["constructor"]')
        ],
        Object:
        [
            define('PLAIN_OBJECT["constructor"]')
        ],
        RegExp:
        [
            define('Function("return/false/")()["constructor"]')
        ],
        String:
        [
            define('""["constructor"]')
        ],
        
        atob:
        [
            define('Function("return atob")()', 'ATOB')
        ],
        btoa:
        [
            define('Function("return btoa")()', 'ATOB')
        ],
        document:
        [
            define('Function("return document")()', 'ANY_DOCUMENT')
        ],
        escape:
        [
            define('Function("return escape")()')
        ],
        self:
        [
            define('Function("return self")()', 'SELF_OBJ')
        ],
        unescape:
        [
            define('Function("return unescape")()')
        ],
        
        // Custom definitions
        
        ANY_FUNCTION:
        [
            define('FILTER'),
            define('FILL', 'FILL')
        ],
        ARRAY_ITERATOR:
        [
            define('[]["entries"]()', 'ENTRIES_OBJ')
        ],
        FILL:
        [
            define('[]["fill"]', 'FILL')
        ],
        FILTER:
        [
            define('[]["filter"]')
        ],
        PLAIN_OBJECT:
        [
            define('Function("return{}")()'),
            define('ARRAY_ITERATOR', 'ENTRIES_PLAIN'),
            define('Function("return Intl")()', 'INTL')
        ],
        SUBSTR:
        [
            define('"slice"'),
            define('"substr"')
        ],
        
        // Function body extra padding blocks: prepended to a function to align the function's body
        // at the same position on different browsers, assuming that the function header is aligned.
        // The number after "FBEP_" is the maximum character overhead. The letters after the last
        // underscore have the same meaning as in regular padding blocks.
        
        FBEP_4_S:
        [
            define('[[true][+(RP_3_NO + FILTER)["30"]]]'),
            define('[[true][+(RP_5_N + FILL)["30"]]]', 'FILL')
        ],
        FBEP_9_U:
        [
            define('[false][+(ANY_FUNCTION + [])["20"]]')
        ],
        
        // Function body padding blocks: prepended to a function to align the function's body at the
        // same position on different browsers.
        // The number after "FBP_" is the maximum character overhead. The letters after the last
        // underscore have the same meaning as in regular padding blocks.
        
        FBP_7_NO:
        [
            define('+(1 + [(RP_4_N + FILTER)["40"]] + 0 + 0 + 0 + 0 + 0 + 1)'),
            define('+(1 + [(RP_6_SO + FILL)["40"]] + 0 + 0 + 0 + 0 + 0 + 1)', 'FILL'),
        ],
        
        // Function header shift: used to adjust an indexer to make it point to the same position in
        // the string representation of a function's header on different browsers.
        // This evaluates to an array containing only the number n - 1 or only the number n, where n
        // is the number after "FH_SHIFT_".
        
        FH_SHIFT_1:
        [
            define('[+!!(+(ANY_FUNCTION + [])[0] + true)]')
        ],
        
        // Function header padding blocks: prepended to a function to align the function's header
        // at the same position on different browsers.
        // The number after "FHP_" is the maximum character overhead.
        // The letters after the last underscore have the same meaning as in regular padding blocks.
        
        // Unused:
        // FHP_1_S:
        // [
        //     define('[[0][+!!(+(ANY_FUNCTION + [])[0] + true)]]')
        // ],
        FHP_3_NO:
        [
            define('+(1 + [+(ANY_FUNCTION + [])[0]])')
        ],
        FHP_5_N:
        [
            define('!!(+(ANY_FUNCTION + [])[0] + true)')
        ],
        
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
        RP_9_U:         'undefined',
    });
    
    var createParseIntArgByReduce =
        function (amendings, firstDigit)
        {
            var parseIntArg =
                '[' +
                AMENDINGS.slice(0, amendings).map(
                    function (amending)
                    {
                        return '/' + amending + '/g';
                    }
                ).join() +
                '].reduce(function(falsefalse,NaN,undefined){return falsefalse.replace(NaN,' +
                firstDigit + '+undefined)},arguments[0])';
            return parseIntArg;
        };
    
    var createParseIntArgByReduceArrow =
        function (amendings, firstDigit)
        {
            var parseIntArg =
                '[' +
                AMENDINGS.slice(0, amendings).map(
                    function (amending)
                    {
                        return '/' + amending + '/g';
                    }
                ).join() +
                '].reduce((falsefalse,NaN,undefined)=>falsefalse.replace(NaN,' + firstDigit +
                '+undefined),arguments[0])';
            return parseIntArg;
        };
    
    createParseIntArgDefault =
        function (amendings, firstDigit)
        {
            var parseIntArg = 'arguments[0]';
            for (var index = 0; index < amendings; ++index)
            {
                var digit = firstDigit + index;
                parseIntArg += '.replace(/' + AMENDINGS[index] + '/g,' + digit + ')';
            }
            return parseIntArg;
        };
    
    CREATE_PARSE_INT_ARG =
    [
        define(createParseIntArgByReduce),
        define(createParseIntArgDefault, 'CAPITAL_HTML', 'ENTRIES_OBJ'),
        define(createParseIntArgByReduce, 'CAPITAL_HTML', 'ENTRIES_PLAIN'),
        define(createParseIntArgByReduce, 'CAPITAL_HTML', 'NO_OLD_SAFARI_ARRAY_ITERATOR'),
        define(createParseIntArgByReduce, 'CAPITAL_HTML', 'OLD_SAFARI_ARRAY_ITERATOR'),
        define(createParseIntArgDefault, 'CAPITAL_HTML', 'ENTRIES_PLAIN', 'NO_IE_SRC'),
        define(
            createParseIntArgDefault,
            'CAPITAL_HTML',
            'NO_IE_SRC',
            'NO_OLD_SAFARI_ARRAY_ITERATOR'
        ),
        define(createParseIntArgDefault, 'CAPITAL_HTML', 'NO_IE_SRC', 'OLD_SAFARI_ARRAY_ITERATOR'),
        define(createParseIntArgByReduce, 'ENTRIES_PLAIN', 'FILL'),
        define(createParseIntArgByReduce, 'FILL', 'NO_OLD_SAFARI_ARRAY_ITERATOR'),
        define(createParseIntArgByReduce, 'FILL', 'OLD_SAFARI_ARRAY_ITERATOR'),
        define(createParseIntArgByReduceArrow, 'ARROW'),
        define(createParseIntArgByReduce, 'FF_SAFARI_SRC'),
        define(createParseIntArgByReduce, 'IE_SRC'),
        define(createParseIntArgByReduce, 'V8_SRC'),
        define(createParseIntArgByReduceArrow, 'ARROW', 'ENTRIES_OBJ'),
        define(createParseIntArgDefault, 'ARROW', 'CAPITAL_HTML', 'ENTRIES_OBJ', 'NO_IE_SRC'),
        define(createParseIntArgByReduceArrow, 'ARROW', 'ENTRIES_PLAIN'),
        define(createParseIntArgByReduceArrow, 'ARROW', 'FILL'),
        define(createParseIntArgByReduceArrow, 'ARROW', 'NO_OLD_SAFARI_ARRAY_ITERATOR'),
        define(createParseIntArgByReduceArrow, 'ARROW', 'OLD_SAFARI_ARRAY_ITERATOR'),
        define(createParseIntArgByReduceArrow, 'ARROW', 'ENTRIES_OBJ', 'FF_SAFARI_SRC'),
        define(createParseIntArgByReduceArrow, 'ARROW', 'ENTRIES_OBJ', 'V8_SRC'),
        define(createParseIntArgByReduce, 'FILL', 'FF_SAFARI_SRC'),
        define(createParseIntArgByReduce, 'FILL', 'IE_SRC'),
        define(createParseIntArgByReduce, 'FILL', 'V8_SRC')
    ];
    
    DEFAULT_CHARACTER_ENCODER =
    [
        define(
            function (char)
            {
                var charCode = char.charCodeAt();
                var encoder = charCode < 0x100 ? charEncodeByUnescape8 : charEncodeByUnescape16;
                var result = createSolution(encoder.call(this, charCode), LEVEL_STRING, false);
                return result;
            }
        ),
        define(
            function (char)
            {
                var charCode = char.charCodeAt();
                var encoder = charCode < 0x100 ? charEncodeByAtob : charEncodeByEval;
                var result = createSolution(encoder.call(this, charCode), LEVEL_STRING, false);
                return result;
            },
            'ATOB'
        )
    ];
    
    FROM_CHAR_CODE =
    [
        define('fromCharCode'),
        define('fromCodePoint', 'ATOB', 'FROM_CODE_POINT'),
        define('fromCodePoint', 'BARPROP', 'FROM_CODE_POINT'),
        define('fromCodePoint', 'CAPITAL_HTML', 'FROM_CODE_POINT')
    ];
    
    LEVEL_STRING    = 1;
    LEVEL_OBJECT    = 0;
    LEVEL_NUMERIC   = -1;
    LEVEL_UNDEFINED = -2;
    
    OPTIMAL_B = [define('B'), define('b', 'ENTRIES_OBJ')];
    
    SIMPLE = new Empty();
    
    createSolution =
        function (replacement, level, outerPlus)
        {
            var result = Object(replacement);
            result.level = level;
            result.outerPlus = outerPlus;
            return result;
        };
    
    replaceDigit =
        function (digit)
        {
            switch (digit)
            {
            case 0:
                return '+[]';
            case 1:
                return '+!![]';
            default:
                var replacement = '!![]';
                do
                    replacement += '+!![]';
                while (--digit > 1);
                return replacement;
            }
        };
    
    // Create definitions for digits
    for (var digit = 0; digit <= 9; ++digit)
    {
        var expr = replaceDigit(digit);
        CHARACTERS[digit] = { expr: expr, level: LEVEL_NUMERIC };
    }
    
    defineSimple('false',       '![]',          LEVEL_NUMERIC);
    defineSimple('true',        '!![]',         LEVEL_NUMERIC);
    defineSimple('undefined',   '[][[]]',       LEVEL_UNDEFINED);
    defineSimple('NaN',         '+[false]',     LEVEL_NUMERIC);
    defineSimple('Infinity',    '+"1e1000"',    LEVEL_NUMERIC);
}
)();
