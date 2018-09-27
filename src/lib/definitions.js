/*
global
LEVEL_NUMERIC,
LEVEL_OBJECT,
LEVEL_STRING,
LEVEL_UNDEFINED,
Empty,
Feature,
Solution,
createDefinitionEntry,
define,
noProto,
object_defineProperty,
resolveSimple,
*/

// As of version 2.1.0, definitions are interpreted using JScrewIt's own express parser, which can
// handle and optimize a useful subset of the JavaScript syntax.
// See express-parse.js for details about constructs recognized by express.
// Compared to generic purpose encoding, definition encoding differs mainly in that every identifier
// used must be defined itself, too, in a constant definition.

var AMENDINGS;
var CREATE_PARSE_INT_ARG;
var FROM_CHAR_CODE;
var FROM_CHAR_CODE_CALLBACK_FORMATTER;
var MAPPER_FORMATTER;
var OPTIMAL_B;
var OPTIMAL_RETURN_STRING;

var BASE64_ALPHABET_HI_2;
var BASE64_ALPHABET_HI_4;
var BASE64_ALPHABET_HI_6;
var BASE64_ALPHABET_LO_2;
var BASE64_ALPHABET_LO_4;
var BASE64_ALPHABET_LO_6;

var CHARACTERS;
var COMPLEX;
var CONSTANTS;
var SIMPLE;

var JSFUCK_INFINITY;

var createBridgeSolution;
var createParseIntArgByReduce;
var createParseIntArgByReduceArrow;
var createParseIntArgDefault;
var fromCharCodeCallbackFormatterArrow;
var fromCharCodeCallbackFormatterDefault;

var mapperFormatterDblArrow;
var mapperFormatterDefault;

(function ()
{
    var ANY_DOCUMENT                    = Feature.ANY_DOCUMENT;
    var ANY_WINDOW                      = Feature.ANY_WINDOW;
    var ARRAY_ITERATOR                  = Feature.ARRAY_ITERATOR;
    var ARROW                           = Feature.ARROW;
    var ATOB                            = Feature.ATOB;
    var BARPROP                         = Feature.BARPROP;
    var CAPITAL_HTML                    = Feature.CAPITAL_HTML;
    var CONSOLE                         = Feature.CONSOLE;
    var DOCUMENT                        = Feature.DOCUMENT;
    var DOMWINDOW                       = Feature.DOMWINDOW;
    var ESC_HTML_ALL                    = Feature.ESC_HTML_ALL;
    var ESC_HTML_QUOT                   = Feature.ESC_HTML_QUOT;
    var ESC_HTML_QUOT_ONLY              = Feature.ESC_HTML_QUOT_ONLY;
    var ESC_REGEXP_LF                   = Feature.ESC_REGEXP_LF;
    var ESC_REGEXP_SLASH                = Feature.ESC_REGEXP_SLASH;
    var FF_SRC                          = Feature.FF_SRC;
    var FILL                            = Feature.FILL;
    var FROM_CODE_POINT                 = Feature.FROM_CODE_POINT;
    var FUNCTION_19_LF                  = Feature.FUNCTION_19_LF;
    var FUNCTION_22_LF                  = Feature.FUNCTION_22_LF;
    var GMT                             = Feature.GMT;
    var HISTORY                         = Feature.HISTORY;
    var HTMLAUDIOELEMENT                = Feature.HTMLAUDIOELEMENT;
    var HTMLDOCUMENT                    = Feature.HTMLDOCUMENT;
    var IE_SRC                          = Feature.IE_SRC;
    var INCR_CHAR                       = Feature.INCR_CHAR;
    var INTL                            = Feature.INTL;
    var LOCALE_INFINITY                 = Feature.LOCALE_INFINITY;
    var NAME                            = Feature.NAME;
    var NODECONSTRUCTOR                 = Feature.NODECONSTRUCTOR;
    var NO_FF_SRC                       = Feature.NO_FF_SRC;
    var NO_IE_SRC                       = Feature.NO_IE_SRC;
    var NO_OLD_SAFARI_ARRAY_ITERATOR    = Feature.NO_OLD_SAFARI_ARRAY_ITERATOR;
    var NO_V8_SRC                       = Feature.NO_V8_SRC;
    var SELF_OBJ                        = Feature.SELF_OBJ;
    var STATUS                          = Feature.STATUS;
    var UNDEFINED                       = Feature.UNDEFINED;
    var UNEVAL                          = Feature.UNEVAL;
    var V8_SRC                          = Feature.V8_SRC;
    var WINDOW                          = Feature.WINDOW;

    var FB_NO_FF_PADDINGS =
    [
        ,
        ,
        ,
        ,
        ,
        'FBP_5_S',
        'RP_1_NO + FBP_5_S',
        ,
        ,
        'FBP_9_U',
        '[RP_1_NO] + FBP_9_U',
        ,
        '[RP_3_NO] + FBP_9_U',
    ];

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
        'FBP_8_NO',
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
        'FHP_8_S',
        'FHP_5_N + [RP_4_N]',
    ];

    var R_PADDINGS =
    [
        'RP_0_S',
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
        define({ expr: 'FILL', shift: 4 }, FILL),
    ];

    var FB_PADDING_INFOS =
    [
        define({ blocks: FB_PADDINGS, shift: 0 }),
        define({ blocks: FB_NO_FF_PADDINGS, shift: 0 }, NO_FF_SRC),
        define({ blocks: FB_NO_IE_PADDINGS, shift: 0 }, NO_IE_SRC),
        define(null, NO_V8_SRC),
        define({ blocks: R_PADDINGS, shift: 0 }, V8_SRC),
        define({ blocks: R_PADDINGS, shift: 5 }, IE_SRC),
        define({ blocks: R_PADDINGS, shift: 4 }, FF_SRC),
    ];

    var FH_PADDING_INFOS =
    [
        define({ blocks: FH_PADDINGS, shift: 0 }),
        define({ blocks: R_PADDINGS, shift: 0 }, NO_IE_SRC),
        define({ blocks: R_PADDINGS, shift: 1 }, IE_SRC),
    ];

    function commaDefinition()
    {
        var bridge = '[' + this.replaceString('concat') + ']';
        var solution = createBridgeSolution(bridge);
        return solution;
    }

    function createCharAtDefinitionFB(offset)
    {
        function definitionFB()
        {
            var functionDefinition = this.findDefinition(FB_EXPR_INFOS);
            var expr = functionDefinition.expr;
            var index = offset + functionDefinition.shift;
            var paddingEntries;
            switch (index)
            {
            case 18:
                paddingEntries =
                [
                    define(12),
                    define({ block: 'RP_0_S', indexer: '2 + FH_SHIFT_3' }, NO_V8_SRC),
                    define(3, V8_SRC),
                    define(0, IE_SRC),
                    define(0, FF_SRC),
                ];
                break;
            case 20:
            case 30:
                paddingEntries =
                [
                    define(10),
                    define
                    ({ block: 'RP_6_SO', indexer: 1 + index / 10 + ' + FH_SHIFT_1' }, NO_V8_SRC),
                    define(0, V8_SRC),
                    define(5, IE_SRC),
                    define(6, FF_SRC),
                ];
                break;
            case 23:
                paddingEntries =
                [
                    define(7),
                    define(9, NO_FF_SRC),
                    define({ block: 'RP_3_NO', indexer: '3 + FH_SHIFT_1' }, NO_V8_SRC),
                    define(0, V8_SRC),
                    define(3, IE_SRC),
                    define(3, FF_SRC),
                ];
                break;
            case 25:
                paddingEntries =
                [
                    define(7),
                    define(5, NO_FF_SRC),
                    define(5, NO_IE_SRC),
                    define({ block: 'RP_1_NO', indexer: '3 + FH_SHIFT_1' }, NO_V8_SRC),
                    define(0, IE_SRC),
                    define(1, FF_SRC),
                ];
                break;
            case 32:
                paddingEntries =
                [
                    define(8),
                    define(9, NO_FF_SRC),
                    define(9, NO_IE_SRC),
                    define({ block: 'RP_4_N', indexer: '4 + FH_SHIFT_1' }, NO_V8_SRC),
                    define(0, V8_SRC),
                    define(3, IE_SRC),
                    define(4, FF_SRC),
                ];
                break;
            case 34:
                paddingEntries =
                [
                    define(7),
                    define(9, NO_FF_SRC),
                    define(6, INCR_CHAR, NO_FF_SRC),
                    define(9, NO_IE_SRC),
                    define({ block: 'RP_2_SO', indexer: '4 + FH_SHIFT_1' }, NO_V8_SRC),
                    define(6, V8_SRC),
                    define(1, IE_SRC),
                    define(3, FF_SRC),
                ];
                break;
            }
            var solution = this.resolveExprAt(expr, index, paddingEntries, FB_PADDING_INFOS);
            return solution;
        }

        return definitionFB;
    }

    function createCharAtDefinitionFH(expr, index, entries, paddingInfos)
    {
        function definitionFH()
        {
            var solution = this.resolveExprAt(expr, index, entries, paddingInfos);
            return solution;
        }

        return definitionFH;
    }

    function createCharDefaultDefinition(charCode, atobOpt, charCodeOpt, escSeqOpt, unescapeOpt)
    {
        function charDefaultDefinition()
        {
            var solution =
            this.createCharDefaultSolution(charCode, atobOpt, charCodeOpt, escSeqOpt, unescapeOpt);
            return solution;
        }

        return charDefaultDefinition;
    }

    function defineCharDefault(char, opts)
    {
        function checkOpt(optName, defaultOpt)
        {
            var opt = opts && optName in opts ? opts[optName] : defaultOpt;
            return opt;
        }

        var charCode    = char.charCodeAt();
        var atobOpt     = checkOpt('atob', charCode < 0x100);
        var charCodeOpt = checkOpt('charCode', true);
        var escSeqOpt   = checkOpt('escSeq', true);
        var unescapeOpt = checkOpt('unescape', true);
        var definition =
        createCharDefaultDefinition(charCode, atobOpt, charCodeOpt, escSeqOpt, unescapeOpt);
        var entry = createDefinitionEntry(definition, arguments, 2);
        return entry;
    }

    function defineFBCharAt(offset)
    {
        var definition = createCharAtDefinitionFB(offset);
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
                define(0, NO_IE_SRC),
                define(6, IE_SRC),
            ];
            break;
        case 6:
        case 16:
            entries =
            [
                define(5),
                define(4, NO_IE_SRC),
                define(3, IE_SRC),
            ];
            break;
        case 8:
        case 18:
            entries =
            [
                define(3),
                define(1, IE_SRC),
            ];
            break;
        case 9:
        case 19:
            entries =
            [
                define({ block: 'RP_1_NO', indexer: (index + 1) / 10 + ' + FH_SHIFT_1' }),
                define(1, NO_IE_SRC),
                define(0, IE_SRC),
            ];
            break;
        case 11:
            entries =
            [
                define(9),
                define(0, NO_IE_SRC),
                define(0, IE_SRC),
            ];
            break;
        case 12:
            entries =
            [
                define(8),
                define(0, NO_IE_SRC),
                define(0, IE_SRC),
            ];
            break;
        case 14:
            entries =
            [
                define(6),
                define(5, IE_SRC),
            ];
            break;
        case 15:
            entries =
            [
                define(5),
                define(4, IE_SRC),
            ];
            break;
        case 17:
            entries =
            [
                define(3),
            ];
            break;
        }
        var definition = createCharAtDefinitionFH(expr, index, entries, FH_PADDING_INFOS);
        var entry = createDefinitionEntry(definition, arguments, 2);
        return entry;
    }

    function defineSimple(simple, expr, level)
    {
        function get()
        {
            var definition = { expr: expr, level: level };
            var solution = resolveSimple(simple, definition);
            object_defineProperty(SIMPLE, simple, { value: solution });
            return solution;
        }

        object_defineProperty(SIMPLE, simple, { configurable: true, enumerable: true, get: get });
    }

    function replaceDigit(digit)
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
    }

    AMENDINGS = ['true', 'undefined', 'NaN'];

    BASE64_ALPHABET_HI_2 = ['NaN', 'false', 'undefined', '0'];

    BASE64_ALPHABET_HI_4 =
    [
        [
            define('A'),
            define('C', CAPITAL_HTML),
            define('A', ARRAY_ITERATOR),
        ],
        'F',
        'Infinity',
        'NaNfalse',
        [
            define('S'),
            define('R', CAPITAL_HTML),
            define('S', ARRAY_ITERATOR),
        ],
        [
            define('U'),
            define('X', ESC_REGEXP_LF),
            define('X', ESC_REGEXP_SLASH),
            define('X', UNEVAL),
            define('U', UNDEFINED),
            define('W', ATOB),
            define('U', ATOB, CAPITAL_HTML),
            define('V', ANY_DOCUMENT),
            define('U', ANY_DOCUMENT, ARRAY_ITERATOR, INCR_CHAR, NAME, NO_V8_SRC),
            define('V', ANY_DOCUMENT, FILL),
            define
            ('X', ANY_DOCUMENT, ARRAY_ITERATOR, ESC_REGEXP_LF, FUNCTION_19_LF, HTMLAUDIOELEMENT),
            define
            ('X', ANY_DOCUMENT, ARRAY_ITERATOR, ESC_REGEXP_LF, FUNCTION_22_LF, HTMLAUDIOELEMENT),
            define
            (
                'V',
                ANY_DOCUMENT,
                ARRAY_ITERATOR,
                ESC_REGEXP_LF,
                FUNCTION_19_LF,
                HTMLAUDIOELEMENT,
                NO_FF_SRC
            ),
            define
            (
                'V',
                ANY_DOCUMENT,
                ARRAY_ITERATOR,
                ESC_REGEXP_LF,
                FUNCTION_22_LF,
                HTMLAUDIOELEMENT,
                NO_FF_SRC
            ),
            define('U', ANY_DOCUMENT, UNDEFINED),
            define('U', CAPITAL_HTML, ESC_REGEXP_LF),
            define('U', CAPITAL_HTML, ESC_REGEXP_SLASH),
            define('U', CAPITAL_HTML, UNEVAL),
            define('U', ESC_REGEXP_LF, UNDEFINED),
            define('W', ANY_WINDOW),
            define('U', ANY_WINDOW, CAPITAL_HTML),
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
            define('0R', CAPITAL_HTML),
            define('0B', ARRAY_ITERATOR),
        ],
        '0i',
        [
            define('0j'),
            define('0T', CAPITAL_HTML),
            define('0j', ARRAY_ITERATOR),
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
        '\t':
        [
            define('Function("return\\"" + ESCAPING_BACKSLASH + "true\\"")()[0]'),
            defineCharDefault('\t', { escSeq: false }),
        ],
        '\n':
        [
            define('(Function() + [])[23]'),
            define('(RP_1_NO + Function())[20]', FUNCTION_19_LF),
            define('(Function() + [])[22]', FUNCTION_22_LF),
            define('(ANY_FUNCTION + [])[0]', IE_SRC),
            defineFHCharAt('FILTER', 19, NO_V8_SRC),
            defineFHCharAt('FILL', 17, FILL, NO_V8_SRC),
        ],

        '\f':
        [
            define('Function("return\\"" + ESCAPING_BACKSLASH + "false\\"")()[0]'),
            defineCharDefault('\f', { escSeq: false }),
        ],
        '\r':
        [
            define('Function("return\\"" + ESCAPING_BACKSLASH + "r\\"")()'),
            defineCharDefault('\r', { escSeq: false }),
        ],

        '\x1e':
        [
            define('(RP_5_N + atob("NaNfalse"))[10]', ATOB),
        ],

        ' ':
        [
            defineFHCharAt('ANY_FUNCTION', 8),
            define('(RP_3_NO + ARRAY_ITERATOR)[10]', ARRAY_ITERATOR),
            define('(FILTER + [])[20]', FF_SRC),
            define('(+(ANY_FUNCTION + [])[0] + FILTER)[22]', NO_FF_SRC),
            define('(FILTER + [])[21]', NO_V8_SRC),
            define('(RP_1_NO + FILTER)[20]', V8_SRC),
            define('(+(ANY_FUNCTION + [])[0] + FILL)[20]', FILL, NO_FF_SRC),
            define('(RP_5_N + FILL)[20]', FILL, NO_IE_SRC),
            define('(FILL + [])[20]', FILL, NO_V8_SRC),
        ],
        // '!':    ,
        '"':
        [
            define('"".fontcolor()[12]'),
        ],
        // '#':    ,
        // '$':    ,
        '%':
        [
            define('escape(FILTER)[20]'),
            define('atob("000l")[2]', ATOB),
            define('escape(FILL)[21]', FILL),
            define('escape(ANY_FUNCTION)[0]', IE_SRC),
        ],
        '&':
        [
            define('"".fontcolor("".italics())[22]', ESC_HTML_ALL),
            define('"".fontcolor("".sub())[20]', ESC_HTML_ALL),
            define('"".fontcolor("\\"")[13]', ESC_HTML_QUOT),
            define('"".fontcolor("".fontcolor([]))[31]', ESC_HTML_QUOT_ONLY),
            defineCharDefault('&'),
        ],
        // '\'':   ,
        '(':
        [
            defineFHCharAt('FILTER', 15),
            defineFHCharAt('FILL', 13, FILL),
        ],
        ')':
        [
            defineFHCharAt('FILTER', 16),
            defineFHCharAt('FILL', 14, FILL),
        ],
        // '*':    ,
        '+': '(1e100 + [])[2]',
        ',':
        [
            define('([].slice.call("false") + [])[1]'),
            define(commaDefinition),
        ],
        '-': '(+".0000001" + [])[2]',
        '.': '(+"11e20" + [])[1]',
        '/':
        [
            define('"0false".italics()[10]'),
            define('"true".sub()[10]'),
        ],
        // '0'...'9':
        ':':
        [
            define('(RegExp() + [])[3]'),
            defineCharDefault(':'),
        ],
        ';':
        [
            define('"".fontcolor("".italics())[21]', ESC_HTML_ALL),
            define('"".fontcolor(true + "".sub())[20]', ESC_HTML_ALL),
            define('"".fontcolor("NaN\\"")[21]', ESC_HTML_QUOT),
            define('"".fontcolor("".fontcolor())[30]', ESC_HTML_QUOT_ONLY),
            defineCharDefault(';'),
        ],
        '<':
        [
            define('"".italics()[0]'),
            define('"".sub()[0]'),
        ],
        '=':
        [
            define('"".fontcolor()[11]'),
        ],
        '>':
        [
            define('"".italics()[2]'),
            define('"".sub()[10]'),
        ],
        '?':
        [
            define('(RegExp() + [])[2]'),
            defineCharDefault('?'),
        ],
        // '@':    ,
        'A':
        [
            defineFHCharAt('Array', 9),
            define('(RP_3_NO + ARRAY_ITERATOR)[11]', ARRAY_ITERATOR),
        ],
        'B':
        [
            defineFHCharAt('Boolean', 9),
            define('"".sub()[3]', CAPITAL_HTML),
        ],
        'C':
        [
            define('escape("".italics())[2]'),
            define('escape("".sub())[2]'),
            define('atob("00NaNfalse")[1]', ATOB),
            define('(RP_4_N + "".fontcolor())[10]', CAPITAL_HTML),
            define('(RP_3_NO + Function("return console")())[11]', CONSOLE),
            define('(Node + [])[12]', NODECONSTRUCTOR),
        ],
        'D':
        [
            // * The escaped character may be either "]" or "}".
            define('escape((+("1000" + (RP_5_N + FILTER + 0)[40] + 0) + FILTER)[40])[2]'), // *
            define('escape("]")[2]'),
            define('escape("}")[2]'),
            define('(document + [])[SUBSTR]("-10")[1]', ANY_DOCUMENT),
            define('btoa("00")[1]', ATOB),
            define('(RP_3_NO + document)[11]', DOCUMENT),
            define // *
            ('escape((RP_3_NO + [+("10" + [(RP_6_SO + FILL)[40]] + "000")] + FILL)[40])[2]', FILL),
            define('(document + [])[12]', HTMLDOCUMENT),
            define('escape(ARRAY_ITERATOR)[30]', NO_OLD_SAFARI_ARRAY_ITERATOR),
            define('escape(FILTER)[50]', V8_SRC),
            define('escape(FILL)[60]', FF_SRC, FILL),
        ],
        'E':
        [
            defineFHCharAt('RegExp', 12),
            define('btoa("0NaN")[1]', ATOB),
            define('(RP_5_N + "".link())[10]', CAPITAL_HTML),
            define('(RP_3_NO + Audio)[21]', HTMLAUDIOELEMENT),
        ],
        'F':
        [
            defineFHCharAt('Function', 9),
            define('"".fontcolor()[1]', CAPITAL_HTML),
        ],
        'G':
        [
            define('btoa("0false")[1]', ATOB),
            define('"0".big()[10]', CAPITAL_HTML),
            define('(RP_5_N + Date())[30]', GMT),
        ],
        'H':
        [
            define('btoa(true)[1]', ATOB),
            define('"".link()[3]', CAPITAL_HTML),
            define
            ({ expr: '(RP_3_NO + Function("return history")())[11]', optimize: true }, HISTORY),
            define('(RP_1_NO + Audio)[10]', HTMLAUDIOELEMENT),
            define('(RP_3_NO + document)[11]', HTMLDOCUMENT),
        ],
        'I': '"Infinity"[0]',
        'J':
        [
            define('"j"[TO_UPPER_CASE]()'),
            define('btoa(true)[2]', ATOB),
            defineCharDefault('J', { atob: false }),
        ],
        'K':
        [
            define('(RP_5_N + "".strike())[10]', CAPITAL_HTML),
        ],
        'L':
        [
            define('btoa(".")[0]', ATOB),
            define('(RP_3_NO + "".fontcolor())[11]', CAPITAL_HTML),
            define('(Audio + [])[12]', HTMLAUDIOELEMENT),
            define('(document + [])[11]', HTMLDOCUMENT),
        ],
        'M':
        [
            define('btoa(0)[0]', ATOB),
            define('"".small()[2]', CAPITAL_HTML),
            define('(RP_4_N + Date())[30]', GMT),
            define('(Audio + [])[11]', HTMLAUDIOELEMENT),
            define('(document + [])[10]', HTMLDOCUMENT),
        ],
        'N': '"NaN"[0]',
        'O':
        [
            define('(RP_3_NO + PLAIN_OBJECT)[11]'),
            define('btoa(NaN)[3]', ATOB),
            define('"".fontcolor()[2]', CAPITAL_HTML),
        ],
        'P':
        [
            define('Function("return\\"" + ESCAPING_BACKSLASH + "120\\"")()'),
            define('atob("01A")[1]', ATOB),
            define('btoa("".italics())[0]', ATOB),
            define('(Function("return statusbar")() + [])[11]', BARPROP),
            define('"0".sup()[10]', CAPITAL_HTML),
            defineCharDefault('P', { atob: false, charCode: false, escSeq: false }),
        ],
        'Q':
        [
            define('"q"[TO_UPPER_CASE]()'),
            define('btoa(1)[1]', ATOB),
            defineCharDefault('Q', { atob: false }),
        ],
        'R':
        [
            defineFHCharAt('RegExp', 9),
            define('btoa("0true")[2]', ATOB),
            define('"".fontcolor()[10]', CAPITAL_HTML),
        ],
        'S':
        [
            defineFHCharAt('String', 9),
            define('"".sub()[1]', CAPITAL_HTML),
        ],
        'T':
        [
            define
            (
                {
                    expr:
                    '(Function("try{undefined.false}catch(undefined){return undefined}")() + ' +
                    '[])[0]',
                    optimize: true
                }
            ),
            define('btoa(NaN)[0]', ATOB),
            define('"".fontcolor([])[20]', CAPITAL_HTML),
            define('(RP_3_NO + Date())[30]', GMT),
            define('(Audio + [])[10]', HTMLAUDIOELEMENT),
            define('(RP_1_NO + document)[10]', HTMLDOCUMENT),
            defineCharDefault('T', { atob: false }),
        ],
        'U':
        [
            define('btoa("1NaN")[1]', ATOB),
            define('"".sub()[2]', CAPITAL_HTML),
            define('(RP_3_NO + PLAIN_OBJECT[TO_STRING].call())[11]', UNDEFINED),
            define('(RP_3_NO + ARRAY_ITERATOR[TO_STRING].call())[11]', ARRAY_ITERATOR, UNDEFINED),
        ],
        'V':
        [
            define('"v"[TO_UPPER_CASE]()'),
            define('(document.createElement("video") + [])[12]', ANY_DOCUMENT),
            define('btoa(undefined)[10]', ATOB),
            defineCharDefault('V', { atob: false }),
        ],
        'W':
        [
            define('"w"[TO_UPPER_CASE]()'),
            define('(self + RP_4_N)[SUBSTR]("-11")[0]', ANY_WINDOW),
            define('btoa(undefined)[1]', ATOB),
            define('(self + [])[11]', DOMWINDOW),
            define('(RP_3_NO + self)[11]', WINDOW),
            defineCharDefault('W', { atob: false }),
        ],
        'X':
        [
            define('"x"[TO_UPPER_CASE]()'),
            define('btoa("1true")[1]', ATOB),
            defineCharDefault('X', { atob: false }),
        ],
        'Y':
        [
            define('"y"[TO_UPPER_CASE]()'),
            define('btoa("a")[0]', ATOB),
            defineCharDefault('Y', { atob: false }),
        ],
        'Z':
        [
            define('btoa(false)[0]', ATOB),
            define('(RP_3_NO + "".fontsize())[11]', CAPITAL_HTML),
        ],
        '[':
        [
            defineFBCharAt(14),
            define('(ARRAY_ITERATOR + [])[0]', ARRAY_ITERATOR),
        ],
        '\\':
        [
            define('ESCAPING_BACKSLASH'),
            defineCharDefault('\\', { escSeq: false, unescape: false }),
        ],
        ']':
        [
            defineFBCharAt(26),
            define('(ARRAY_ITERATOR + [])[22]', NO_OLD_SAFARI_ARRAY_ITERATOR),
        ],
        '^':
        [
            define('atob("undefined0")[2]', ATOB),
        ],
        // '_':    ,
        // '`':    ,
        'a': '"false"[1]',
        'b':
        [
            defineFHCharAt('Number', 12),
            define('(ARRAY_ITERATOR + [])[2]', ARRAY_ITERATOR),
        ],
        'c':
        [
            defineFHCharAt('ANY_FUNCTION', 3),
            define('(RP_5_N + ARRAY_ITERATOR)[10]', ARRAY_ITERATOR),
        ],
        'd': '"undefined"[2]',
        'e': '"true"[3]',
        'f': '"false"[0]',
        'g':
        [
            defineFHCharAt('String', 14),
        ],
        'h':
        [
            define('101[TO_STRING]("21")[1]'),
            define('btoa("0false")[3]', ATOB),
        ],
        'i': '([RP_5_N] + undefined)[10]',
        'j':
        [
            define('(PLAIN_OBJECT + [])[10]'),
            define('(ARRAY_ITERATOR + [])[3]', ARRAY_ITERATOR),
            define('(Node + [])[3]', NODECONSTRUCTOR),
            define('(self + [])[3]', SELF_OBJ),
        ],
        'k':
        [
            define('20[TO_STRING]("21")'),
            defineCharDefault('k'),
        ],
        'l': '"false"[2]',
        'm':
        [
            defineFHCharAt('Number', 11),
            define('(RP_6_SO + Function())[20]'),
        ],
        'n': '"undefined"[1]',
        'o':
        [
            defineFHCharAt('ANY_FUNCTION', 6),
            define('(ARRAY_ITERATOR + [])[1]', ARRAY_ITERATOR),
        ],
        'p':
        [
            define('211[TO_STRING]("31")[1]'),
            define('(RP_3_NO + btoa(undefined))[10]', ATOB),
        ],
        'q':
        [
            define('212[TO_STRING]("31")[1]'),
            define('"".fontcolor(0 + "".fontcolor())[30]', ESC_HTML_ALL),
            define('"".fontcolor("0false\\"")[20]', ESC_HTML_QUOT),
            define('"".fontcolor(true + "".fontcolor())[30]', ESC_HTML_QUOT_ONLY),
            defineCharDefault('q'),
        ],
        'r': '"true"[1]',
        's': '"false"[3]',
        't': '"true"[0]',
        'u': '"undefined"[0]',
        'v':
        [
            defineFBCharAt(19),
        ],
        'w':
        [
            define('32[TO_STRING]("33")'),
            define('(self + [])[SUBSTR]("-2")[0]', ANY_WINDOW),
            define('atob("undefined0")[1]', ATOB),
            define('(RP_4_N + self)[20]', DOMWINDOW),
            define('(self + [])[13]', WINDOW),
        ],
        'x':
        [
            define('101[TO_STRING]("34")[1]'),
            define('btoa("falsefalse")[10]', ATOB),
        ],
        'y': '(RP_3_NO + [Infinity])[10]',
        'z':
        [
            define('35[TO_STRING]("36")'),
            define('btoa("falsefalse")[11]', ATOB),
        ],
        '{':
        [
            defineFHCharAt('FILTER', 18),
            defineFHCharAt('FILL', 16, FILL),
        ],
        // '|':    ,
        '}':
        [
            defineFBCharAt(28),
        ],
        // '~':    ,

        '\x8a':
        [
            define('(RP_4_N + atob("NaNundefined"))[10]', ATOB),
        ],
        '\x8d':
        [
            define('atob("0NaN")[2]', ATOB),
        ],
        '\x96':
        [
            define('atob("00false")[3]', ATOB),
        ],
        '\x9e':
        [
            define('atob(true)[2]', ATOB),
        ],
        '£':
        [
            define('atob(NaN)[1]', ATOB),
        ],
        '¥':
        [
            define('atob("0false")[2]', ATOB),
        ],
        '§':
        [
            define('atob("00undefined")[2]', ATOB),
        ],
        '©':
        [
            define('atob("falsefalse")[1]', ATOB),
        ],
        '±':
        [
            define('atob("0false")[3]', ATOB),
        ],
        '¶':
        [
            define('atob(true)[0]', ATOB),
        ],
        'º':
        [
            define('atob("undefined0")[0]', ATOB),
        ],
        '»':
        [
            define('atob(true)[1]', ATOB),
        ],
        'Ç':
        [
            define('atob("falsefalsefalse")[10]', ATOB),
        ],
        'Ú':
        [
            define('atob("0truefalse")[1]', ATOB),
        ],
        'Ý':
        [
            define('atob("0undefined")[2]', ATOB),
        ],
        'â':
        [
            define('atob("falsefalseundefined")[11]', ATOB),
        ],
        'é':
        [
            define('atob("0undefined")[1]', ATOB),
        ],
        'î':
        [
            define('atob("0truefalse")[2]', ATOB),
        ],
        'ö':
        [
            define('atob("0false")[1]', ATOB),
        ],
        'ø':
        [
            define('atob("undefinedundefined")[10]', ATOB),
        ],
        '∞':
        [
            define
            (
                { expr: 'Infinity.toLocaleString()', optimize: { complexOpt: true } },
                LOCALE_INFINITY
            ),
            defineCharDefault('∞'),
        ],
    });

    COMPLEX = noProto
    ({
        Number:         define({ expr: 'Number.name', optimize: { toStringOpt: true } }, NAME),
        Object:         define({ expr: 'Object.name', optimize: { toStringOpt: true } }, NAME),
        RegExp:         define({ expr: 'RegExp.name', optimize: { toStringOpt: true } }, NAME),
        String:         define('String.name', NAME),
        'f,a,l,s,e':    define({ expr: '[].slice.call("false")', level: LEVEL_OBJECT }),
        mCh:            define('atob("bUNo")', Feature.ATOB),
    });

    CONSTANTS = noProto
    ({
        // JavaScript globals

        Array:
        [
            define('[].constructor'),
        ],
        Audio:
        [
            define('Function("return Audio")()', HTMLAUDIOELEMENT),
        ],
        Boolean:
        [
            define('false.constructor'),
        ],
        Date:
        [
            define('Function("return Date")()'),
        ],
        Function:
        [
            define('ANY_FUNCTION.constructor'),
        ],
        Node:
        [
            define('Function("return Node")()', NODECONSTRUCTOR),
        ],
        Number:
        [
            define('0..constructor'),
        ],
        Object:
        [
            define('PLAIN_OBJECT.constructor'),
        ],
        RegExp:
        [
            define('Function("return/false/")().constructor'),
        ],
        String:
        [
            define('"".constructor'),
        ],
        atob:
        [
            define('Function("return atob")()', ATOB),
        ],
        btoa:
        [
            define('Function("return btoa")()', ATOB),
        ],
        document:
        [
            define
            (
                { expr: 'Function("return document")()', optimize: { toStringOpt: true } },
                ANY_DOCUMENT
            ),
        ],
        escape:
        [
            define({ expr: 'Function("return escape")()', optimize: { toStringOpt: true } }),
        ],
        self:
        [
            define('Function("return self")()', SELF_OBJ),
        ],
        unescape:
        [
            define({ expr: 'Function("return unescape")()', optimize: { toStringOpt: true } }),
        ],
        uneval:
        [
            define('Function("return uneval")()', UNEVAL),
        ],

        // Custom definitions

        ANY_FUNCTION:
        [
            define('FILTER'),
            define('FILL', FILL),
        ],
        ARRAY_ITERATOR:
        [
            define('[].entries()', ARRAY_ITERATOR),
        ],
        ESCAPING_BACKSLASH:
        [
            define('(RegExp("\\n") + [])[1]', ESC_REGEXP_LF),
            define('(RP_5_N + RegExp("".italics()))[10]', ESC_REGEXP_SLASH),
            define('(RP_3_NO + RegExp("".sub()))[10]', ESC_REGEXP_SLASH),
            define('uneval("".fontcolor(false))[20]', UNEVAL),
            define('(RegExp(FILTER) + [])[20]', ESC_REGEXP_LF, FF_SRC),
            define('(RegExp(Function()) + [])[20]', ESC_REGEXP_LF, FUNCTION_19_LF),
            define('(RP_5_N + RegExp(Function()))[30]', ESC_REGEXP_LF, FUNCTION_22_LF),
            define('(RegExp(ANY_FUNCTION) + [])[1]', ESC_REGEXP_LF, IE_SRC),
            define('(+(ANY_FUNCTION + [])[0] + RegExp(FILTER))[23]', ESC_REGEXP_LF, NO_V8_SRC),
            define('uneval(FILTER + [])[20]', FF_SRC, UNEVAL),
            define('uneval(ANY_FUNCTION + [])[1]', IE_SRC, UNEVAL),
            define('uneval(+(ANY_FUNCTION + [])[0] + FILTER)[23]', NO_V8_SRC, UNEVAL),
            define('(RP_3_NO + RegExp(FILL))[21]', ESC_REGEXP_LF, FF_SRC, FILL),
            define('(+(ANY_FUNCTION + [])[0] + RegExp(FILL))[21]', ESC_REGEXP_LF, FILL, NO_V8_SRC),
            define('uneval(RP_3_NO + FILL)[21]', FF_SRC, FILL, UNEVAL),
            define('uneval(+(ANY_FUNCTION + [])[0] + FILL)[21]', FILL, NO_V8_SRC, UNEVAL),
            defineCharDefault('\\', { atob: false, charCode: false, escSeq: false }),
        ],
        FILL:
        [
            define('[].fill', FILL),
        ],
        FILTER:
        [
            define('[].filter'),
        ],
        FROM_CHAR_CODE:
        [
            define({ expr: '"fromCharCode"', optimize: true }),
            define({ expr: '"fromCodePoint"', optimize: { toStringOpt: true } }, FROM_CODE_POINT),
        ],
        PLAIN_OBJECT:
        [
            define('Function("return{}")()'),
            define('Function("return Intl")()', INTL),
        ],
        SUBSTR:
        [
            define('"slice"'),
            define('"substr"'),
        ],
        TO_STRING:
        [
            define({ expr: '"toString"', optimize: { complexOpt: true } }),
        ],
        TO_UPPER_CASE:
        [
            define({ expr: '"toUpperCase"', optimize: { toStringOpt: true } }),
        ],

        // Function body extra padding blocks: prepended to a function to align the function's body
        // at the same position in different engines, assuming that the function header is aligned.
        // The number after "FBEP_" is the maximum character overhead. The letters after the last
        // underscore have the same meaning as in regular padding blocks.

        FBEP_4_S:
        [
            define('[[true][+(RP_3_NO + FILTER)[30]]]'),
            define('[[true][+(RP_5_N + FILL)[30]]]', FILL),
        ],
        FBEP_9_U:
        [
            define('[false][+(ANY_FUNCTION + [])[20]]'),
        ],

        // Function body padding blocks: prepended to a function to align the function's body at the
        // same position in different engines.
        // The number after "FBP_" is the maximum character overhead. The letters after the last
        // underscore have the same meaning as in regular padding blocks.

        FBP_5_S:
        [
            define('[[false][+IS_IE_SRC_N]]', NO_FF_SRC),
        ],
        FBP_7_NO:
        [
            define('+("10" + [(RP_4_N + FILTER)[40]] + "00000")'),
            define('+("10" + [(RP_6_SO + FILL)[40]] + "00000")', FILL),
        ],
        FBP_8_NO:
        [
            define('+("1000" + (RP_5_N + FILTER + 0)[40] + "000")'),
            define('+("1000" + (FILL + 0)[33] + "000")', FILL),
        ],
        FBP_9_U:
        [
            define('[true][+(ANY_FUNCTION + [])[0]]', NO_FF_SRC),
        ],

        // Function header shift: used to adjust an indexer to make it point to the same position in
        // the string representation of a function's header in different engines.
        // This evaluates to an array containing only the number 𝑛 - 1 or only the number 𝑛, where 𝑛
        // is the number after "FH_SHIFT_".

        FH_SHIFT_1:
        [
            define('[+IS_IE_SRC_N]'),
        ],
        FH_SHIFT_3:
        [
            define('[2 + IS_IE_SRC_N]'),
        ],

        // Function header padding blocks: prepended to a function to align the function's header at
        // the same position in different engines.
        // The number after "FHP_" is the maximum character overhead.
        // The letters after the last underscore have the same meaning as in regular padding blocks.

        FHP_3_NO:
        [
            define('+(1 + [+(ANY_FUNCTION + [])[0]])'),
            define('+(++(ANY_FUNCTION + [])[0] + [0])', INCR_CHAR),
        ],
        FHP_5_N:
        [
            define('IS_IE_SRC_N'),
        ],
        FHP_8_S:
        [
            define('[FHP_3_NO] + RP_5_N'),
            define('FHP_5_N + [RP_3_NO]', INCR_CHAR),
        ],

        // Regular padding blocks.
        //
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

        RP_0_S:     '[]',
        RP_1_NO:    '0',
        RP_2_SO:    '"00"',
        RP_3_NO:    'NaN',
        RP_4_N:     'true',
        RP_5_N:     'false',
        RP_6_SO:    '"0false"',

        // Conditional padding blocks.
        //
        // true if feature IE_SRC is available; false otherwise.
        IS_IE_SRC_N:
        [
            define('!!(+(ANY_FUNCTION + [])[0] + true)'),
            define('!!++(ANY_FUNCTION + [])[0]', INCR_CHAR),
        ],
    });

    createBridgeSolution =
    function (bridge)
    {
        var replacement = '[[]]' + bridge + '([[]])';
        var solution = new Solution(replacement, LEVEL_OBJECT, false);
        var appendLength = bridge.length - 1;
        solution.appendLength = appendLength;
        solution.bridge = bridge;
        return solution;
    };

    function createParseIntArg(amendings, reducerStr)
    {
        var parseIntArg =
        '[' +
        AMENDINGS.slice(0, amendings).map
        (
            function (amending)
            {
                return '/' + amending + '/g';
            }
        )
        .join() +
        '].reduce(' + reducerStr + ',undefined)';
        return parseIntArg;
    }

    createParseIntArgByReduce =
    function (amendings, firstDigit)
    {
        var parseIntArg =
        createParseIntArg
        (amendings, 'function(f,a,l,s,e){return f.replace(a,' + firstDigit + '+l)}');
        return parseIntArg;
    };

    createParseIntArgByReduceArrow =
    function (amendings, firstDigit)
    {
        var parseIntArg =
        createParseIntArg(amendings, '(f,a,l,s,e)=>f.replace(a,' + firstDigit + '+l)');
        return parseIntArg;
    };

    createParseIntArgDefault =
    function (amendings, firstDigit)
    {
        var parseIntArg = 'undefined';
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
        define(createParseIntArgDefault, ARRAY_ITERATOR, CAPITAL_HTML, NO_IE_SRC),
        define(createParseIntArgByReduce, FILL),
        define(createParseIntArgByReduce, NO_FF_SRC),
        define(createParseIntArgByReduce, NO_V8_SRC),
        define(createParseIntArgByReduce, CAPITAL_HTML, NO_IE_SRC, NO_OLD_SAFARI_ARRAY_ITERATOR),
        define(createParseIntArgByReduceArrow, ARROW),
        define(createParseIntArgByReduce, ARROW, NO_FF_SRC),
        define(createParseIntArgByReduce, ARROW, NO_V8_SRC),
        define(createParseIntArgByReduceArrow, ARRAY_ITERATOR, ARROW),
        define(createParseIntArgByReduce, ARRAY_ITERATOR, ARROW, FILL, FF_SRC),
        define(createParseIntArgByReduce, ARRAY_ITERATOR, ARROW, FILL, IE_SRC),
        define(createParseIntArgByReduce, ARRAY_ITERATOR, ARROW, FILL, V8_SRC),
    ];

    FROM_CHAR_CODE =
    [
        define('fromCharCode'),
        define('fromCodePoint', BARPROP, FROM_CODE_POINT),
        define('fromCodePoint', CAPITAL_HTML, FROM_CODE_POINT),
        define('fromCodePoint', ATOB, FROM_CODE_POINT),
        define('fromCharCode', ARRAY_ITERATOR, ATOB, CAPITAL_HTML, FROM_CODE_POINT),
    ];

    fromCharCodeCallbackFormatterArrow =
    function (fromCharCode, arg)
    {
        return 'undefined=>String.' + fromCharCode + '(' + arg + ')';
    };

    fromCharCodeCallbackFormatterDefault =
    function (fromCharCode, arg)
    {
        return 'function(undefined){return String.' + fromCharCode + '(' + arg + ')}';
    };

    FROM_CHAR_CODE_CALLBACK_FORMATTER =
    [
        define(fromCharCodeCallbackFormatterDefault),
        define(fromCharCodeCallbackFormatterArrow, ARROW),
    ];

    JSFUCK_INFINITY = '1e1000';

    mapperFormatterDblArrow =
    function (arg)
    {
        var mapper = 'Function("return falsefalse=>undefined=>falsefalse' + arg + '")()';
        return mapper;
    };

    mapperFormatterDefault =
    function (arg)
    {
        var mapper = 'Function("return function(undefined){return this' + arg + '}")().bind';
        return mapper;
    };

    MAPPER_FORMATTER = [define(mapperFormatterDefault), define(mapperFormatterDblArrow, ARROW)];

    OPTIMAL_B = [define('B'), define('b', ARRAY_ITERATOR)];

    OPTIMAL_RETURN_STRING =
    [
        define('return(isNaN+false).constructor'),
        define('return String', ARRAY_ITERATOR, CAPITAL_HTML),
        define('return(isNaN+false).constructor', FILL, IE_SRC),
        define('return(isNaN+false).constructor', FILL, NO_IE_SRC),
        define('return status.constructor', STATUS),
    ];

    SIMPLE = new Empty();

    // Create definitions for digits
    for (var digit = 0; digit <= 9; ++digit)
    {
        var expr = replaceDigit(digit);
        CHARACTERS[digit] = { expr: expr, level: LEVEL_NUMERIC };
    }

    defineSimple('false',       '![]',              LEVEL_NUMERIC);
    defineSimple('true',        '!![]',             LEVEL_NUMERIC);
    defineSimple('undefined',   '[][[]]',           LEVEL_UNDEFINED);
    defineSimple('NaN',         '+[false]',         LEVEL_NUMERIC);
    defineSimple('Infinity',    JSFUCK_INFINITY,    LEVEL_NUMERIC);
}
)();
