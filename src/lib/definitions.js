// As of version 2.1.0, definitions are interpreted using JScrewIt's own express parser, which can
// handle and optimize a useful subset of the JavaScript syntax.
// See express-parse.js for details about constructs recognized by express.
// Compared to generic purpose encoding, definition encoding differs mainly in that every identifier
// used must be defined itself, too, in a constant definition.

import { define, defineList, defineWithArrayLike }  from './definers';
import { Feature }                                  from './features';
import { _String, createEmpty, noProto }            from './obj-utils';
import { LazySolution, SimpleSolution }             from './solution';
import { SolutionType }                             from 'novem';

export var AMENDINGS = ['true', 'undefined', 'NaN'];

export var JSFUCK_INFINITY = '1e1000';

export var SIMPLE = createEmpty();

export var FROM_CHAR_CODE;
export var FROM_CHAR_CODE_CALLBACK_FORMATTER;
export var MAPPER_FORMATTER;
export var OPTIMAL_ARG_NAME;
export var OPTIMAL_B;
export var OPTIMAL_RETURN_STRING;

export var BASE64_ALPHABET_HI_2;
export var BASE64_ALPHABET_HI_4;
export var BASE64_ALPHABET_HI_6;
export var BASE64_ALPHABET_LO_2;
export var BASE64_ALPHABET_LO_4;
export var BASE64_ALPHABET_LO_6;

export var CHARACTERS;
export var COMPLEX;
export var CONSTANTS;

var FB_EXPR_INFOS;
var FB_PADDING_INFOS;
var FH_PADDING_INFOS;
var PADDING_ENTRIES_MAP;

function backslashDefinition()
{
    var replacement = this.replaceCharByUnescape(0x5C);
    var solution = new SimpleSolution(undefined, replacement, SolutionType.STRING);
    return solution;
}

function chooseOtherArgName(argName)
{
    var otherArgName = argName !== 'undefined' ? 'undefined' : 'falsefalse';
    return otherArgName;
}

function createCharAtDefinitionFB(offset)
{
    function definitionFB(char)
    {
        var functionDefinition = this.findDefinition(FB_EXPR_INFOS);
        var expr = functionDefinition.expr;
        var index = offset + functionDefinition.shift;
        var paddingEntries = PADDING_ENTRIES_MAP[index];
        var solution = this.resolveExprAt(char, expr, index, paddingEntries, FB_PADDING_INFOS);
        return solution;
    }

    return definitionFB;
}

function createCharAtDefinitionFH(expr, index, entries)
{
    function definitionFH(char)
    {
        var solution = this.resolveExprAt(char, expr, index, entries, FH_PADDING_INFOS);
        return solution;
    }

    return definitionFH;
}

export var initReplaceStaticExpr;

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
    var EXTERNAL                        = Feature.EXTERNAL;
    var FF_SRC                          = Feature.FF_SRC;
    var FILL                            = Feature.FILL;
    var FLAT                            = Feature.FLAT;
    var FROM_CODE_POINT                 = Feature.FROM_CODE_POINT;
    var FUNCTION_19_LF                  = Feature.FUNCTION_19_LF;
    var FUNCTION_22_LF                  = Feature.FUNCTION_22_LF;
    var GLOBAL_UNDEFINED                = Feature.GLOBAL_UNDEFINED;
    var GMT                             = Feature.GMT;
    var HISTORY                         = Feature.HISTORY;
    var HTMLAUDIOELEMENT                = Feature.HTMLAUDIOELEMENT;
    var HTMLDOCUMENT                    = Feature.HTMLDOCUMENT;
    var IE_SRC                          = Feature.IE_SRC;
    var INCR_CHAR                       = Feature.INCR_CHAR;
    var INTL                            = Feature.INTL;
    var LOCALE_INFINITY                 = Feature.LOCALE_INFINITY;
    var LOCALE_NUMERALS                 = Feature.LOCALE_NUMERALS;
    var NAME                            = Feature.NAME;
    var NODECONSTRUCTOR                 = Feature.NODECONSTRUCTOR;
    var NO_FF_SRC                       = Feature.NO_FF_SRC;
    var NO_IE_SRC                       = Feature.NO_IE_SRC;
    var NO_OLD_SAFARI_ARRAY_ITERATOR    = Feature.NO_OLD_SAFARI_ARRAY_ITERATOR;
    var NO_V8_SRC                       = Feature.NO_V8_SRC;
    var OBJECT_UNDEFINED                = Feature.OBJECT_UNDEFINED;
    var PLAIN_INTL                      = Feature.PLAIN_INTL;
    var REGEXP_STRING_ITERATOR          = Feature.REGEXP_STRING_ITERATOR;
    var SELF_OBJ                        = Feature.SELF_OBJ;
    var SHORT_LOCALES                   = Feature.SHORT_LOCALES;
    var STATUS                          = Feature.STATUS;
    var UNDEFINED                       = Feature.UNDEFINED;
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
        'RP_1_WA + FBP_5_S',
        ,
        ,
        'FBP_9_U',
        '[RP_1_WA] + FBP_9_U',
        ,
        '[RP_3_WA] + FBP_9_U',
    ];

    var FB_NO_IE_PADDINGS =
    [
        ,
        ,
        ,
        ,
        ,
        'RP_1_WA + FBEP_4_S',
        ,
        'RP_3_WA + FBEP_4_S',
        ,
        'FBEP_9_U',
        '[RP_1_WA] + FBEP_9_U',
        ,
        '[RP_3_WA] + FBEP_9_U',
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
        'FBP_7_WA',
        'FBP_8_WA',
        ,
        'RP_3_WA + [FBP_7_WA]',
        ,
        'RP_5_A + [FBP_7_WA]',
    ];

    var FH_PADDINGS =
    [
        ,
        ,
        ,
        'FHP_3_WA',
        ,
        'FHP_5_A',
        'FHP_5_A + [RP_1_WA]',
        'FHP_3_WA + [RP_4_A]',
        'FHP_8_S',
        'FHP_5_A + [RP_4_A]',
    ];

    var R_PADDINGS =
    [
        'RP_0_S',
        'RP_1_WA',
        ,
        'RP_3_WA',
        'RP_4_A',
        'RP_5_A',
        'RP_6_S',
    ];

    function createCharDefaultDefinition
    (atobOpt, charCodeOpt, escSeqOpt, unescapeOpt)
    {
        function charDefaultDefinition(char)
        {
            var charCode = char.charCodeAt();
            var solution =
            this.createCharDefaultSolution
            (char, charCode, atobOpt && charCode < 0x100, charCodeOpt, escSeqOpt, unescapeOpt);
            return solution;
        }

        return charDefaultDefinition;
    }

    function createLazySolution(source, expr, type)
    {
        var solution =
        new LazySolution
        (
            source,
            function ()
            {
                var replacement = replaceStaticExpr(expr);
                return replacement;
            },
            type
        );
        return solution;
    }

    function defineCharDefault(opts)
    {
        function checkOpt(optName)
        {
            var opt = !(opts && optName in opts) || opts[optName];
            return opt;
        }

        var atobOpt     = checkOpt('atob');
        var charCodeOpt = checkOpt('charCode');
        var escSeqOpt   = checkOpt('escSeq');
        var unescapeOpt = checkOpt('unescape');
        var definition = createCharDefaultDefinition(atobOpt, charCodeOpt, escSeqOpt, unescapeOpt);
        var entry = defineWithArrayLike(definition, arguments, 2);
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
                define({ block: 'RP_1_WA', indexer: (index + 1) / 10 + ' + FH_SHIFT_1' }),
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
        var definition = createCharAtDefinitionFH(expr, index, entries);
        var entry = defineWithArrayLike(definition, arguments, 2);
        return entry;
    }

    function defineLocalizedNumeral(locale, number, index)
    {
        var expr = '(' + number + ')[TO_LOCALE_STRING](' + locale + ')';
        if (index != null)
            expr += '[' + index + ']';
        var entry = define(expr, LOCALE_NUMERALS);
        return entry;
    }

    function defineLocalizedNumerals(locale, zeroCharCode)
    {
        var fromCharCode = _String.fromCharCode;
        for (var digit = 0; digit <= 9; ++digit)
        {
            var char = fromCharCode(zeroCharCode + digit);
            CHARACTERS[char] =
            [
                defineLocalizedNumeral(locale, digit),
                defineCharDefault(),
            ];
        }
    }

    function defineSimple(simple, expr, type)
    {
        SIMPLE[simple] = createLazySolution(simple, expr, type);
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

    BASE64_ALPHABET_HI_2 = ['NaN', 'false', 'undefined', '0'];

    BASE64_ALPHABET_HI_4 =
    [
        [define('A'), define('C', CAPITAL_HTML), define('A', ARRAY_ITERATOR)],
        'F',
        'Infinity',
        'NaNfalse',
        [define('S'), define('R', CAPITAL_HTML), define('S', ARRAY_ITERATOR)],
        [define('W'), define('U', CAPITAL_HTML)],
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
        [define('0B'), define('0R', CAPITAL_HTML), define('0B', ARRAY_ITERATOR)],
        '0i',
        [define('0j'), define('0T', CAPITAL_HTML), define('0j', ARRAY_ITERATOR)],
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

    CHARACTERS =
    noProto
    ({
        '\t':
        [
            define('Function("return\\"" + ESCAPING_BACKSLASH + "true\\"")()[0]'),
            defineCharDefault({ escSeq: false }),
        ],
        '\n':
        [
            define('(Function() + [])[23]'),
            define('(RP_1_WA + Function())[20]', FUNCTION_19_LF),
            define('(Function() + [])[22]', FUNCTION_22_LF),
            define('(ANY_FUNCTION + [])[0]', IE_SRC),
            defineFHCharAt('FILTER', 19, NO_V8_SRC),
            defineFHCharAt('FILL', 17, FILL, NO_V8_SRC),
            defineFHCharAt('FLAT', 17, FLAT, NO_V8_SRC),
        ],

        '\f':
        [
            define('Function("return\\"" + ESCAPING_BACKSLASH + "false\\"")()[0]'),
            defineCharDefault({ escSeq: false }),
        ],
        '\r':
        [
            define('Function("return\\"" + ESCAPING_BACKSLASH + "r\\"")()'),
            defineCharDefault({ escSeq: false }),
        ],

        '\x1e':
        [
            define('(RP_5_A + atob("NaNfalse"))[10]', ATOB),
        ],

        ' ':
        [
            defineFHCharAt('ANY_FUNCTION', 8),
            define('(RP_3_WA + ARRAY_ITERATOR)[10]', ARRAY_ITERATOR),
            define('(FILTER + [])[20]', FF_SRC),
            define('(+(ANY_FUNCTION + [])[0] + FILTER)[22]', NO_FF_SRC),
            define('(FILTER + [])[21]', NO_V8_SRC),
            define('(RP_1_WA + FILTER)[20]', V8_SRC),
            define('(+(ANY_FUNCTION + [])[0] + FILL)[20]', FILL, NO_FF_SRC),
            define('(RP_5_A + FILL)[20]', FILL, NO_IE_SRC),
            define('(FILL + [])[20]', FILL, NO_V8_SRC),
            define('(+(ANY_FUNCTION + [])[0] + FLAT)[20]', FLAT, NO_FF_SRC),
            define('(RP_5_A + FLAT)[20]', FLAT, NO_IE_SRC),
            define('(FLAT + [])[20]', FLAT, NO_V8_SRC),
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
            define('escape(FLAT)[21]', FLAT),
            define('escape(ANY_FUNCTION)[0]', IE_SRC),
        ],
        '&':
        [
            define('"".fontcolor("".italics())[22]', ESC_HTML_ALL),
            define('"".fontcolor("".sub())[20]', ESC_HTML_ALL),
            define('"".fontcolor("\\"")[13]', ESC_HTML_QUOT),
            define('"".fontcolor("".fontcolor([]))[31]', ESC_HTML_QUOT_ONLY),
            defineCharDefault(),
        ],
        // '\'':   ,
        '(':
        [
            defineFHCharAt('FILTER', 15),
            defineFHCharAt('FILL', 13, FILL),
            defineFHCharAt('FLAT', 13, FLAT),
        ],
        ')':
        [
            defineFHCharAt('FILTER', 16),
            defineFHCharAt('FILL', 14, FILL),
            defineFHCharAt('FLAT', 14, FLAT),
        ],
        // '*':    ,
        '+': '(1e100 + [])[2]',
        ',':
        [
            define('(F_A_L_S_E + [])[1]'),
            define({ expr: '[[]].concat([[]])', solutionType: SolutionType.OBJECT }),
        ],
        '-': '(.0000001 + [])[2]',
        '.': '(11e20 + [])[1]',
        '/':
        [
            define('"0false".italics()[10]'),
            define('"true".sub()[10]'),
        ],
        // '0'…'9':
        ':':
        [
            define('(RegExp() + [])[3]'),
            defineCharDefault(),
        ],
        ';':
        [
            define('"".fontcolor("".italics())[21]', ESC_HTML_ALL),
            define('"".fontcolor(true + "".sub())[20]', ESC_HTML_ALL),
            define('"".fontcolor("NaN\\"")[21]', ESC_HTML_QUOT),
            define('"".fontcolor("".fontcolor())[30]', ESC_HTML_QUOT_ONLY),
            defineCharDefault(),
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
            defineCharDefault(),
        ],
        // '@':    ,
        'A':
        [
            defineFHCharAt('Array', 9),
            define('(RP_3_WA + ARRAY_ITERATOR)[11]', ARRAY_ITERATOR),
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
            define('escape(F_A_L_S_E)[11]'),
            define('atob("00NaNfalse")[1]', ATOB),
            define('(RP_4_A + "".fontcolor())[10]', CAPITAL_HTML),
            define('(RP_3_WA + Function("return console")())[11]', CONSOLE),
            define('(Node + [])[12]', NODECONSTRUCTOR),
        ],
        'D':
        [
            // • The escaped character may be either "]" or "}".
            define('escape((+("1000" + (RP_5_A + FILTER + 0)[40] + 0) + FILTER)[40])[2]'), // *
            define('escape("]")[2]'),
            define('escape("}")[2]'),
            define('(document + [])[SLICE_OR_SUBSTR]("-10")[1]', ANY_DOCUMENT),
            define('btoa("00")[1]', ATOB),
            define('(RP_3_WA + document)[11]', DOCUMENT),
            define // *
            ('escape((RP_3_WA + [+("10" + [(RP_6_S + FILL)[40]] + "000")] + FILL)[40])[2]', FILL),
            define // *
            ('escape((RP_3_WA + [+("10" + [(RP_6_S + FLAT)[40]] + "000")] + FLAT)[40])[2]', FLAT),
            define('(document + [])[12]', HTMLDOCUMENT),
            define('escape(ARRAY_ITERATOR)[30]', NO_OLD_SAFARI_ARRAY_ITERATOR),
            define('escape(FILTER)[50]', V8_SRC),
            define('escape(FILL)[60]', FF_SRC, FILL),
            define('escape(FLAT)[60]', FF_SRC, FLAT),
        ],
        'E':
        [
            defineFHCharAt('RegExp', 12),
            define('btoa("0NaN")[1]', ATOB),
            define('(RP_5_A + "".link())[10]', CAPITAL_HTML),
            define('(RP_3_WA + sidebar)[11]', EXTERNAL),
            define('(RP_3_WA + Audio)[21]', HTMLAUDIOELEMENT),
            define('(REGEXP_STRING_ITERATOR + [])[11]', REGEXP_STRING_ITERATOR),
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
            define('(RP_5_A + Date())[30]', GMT),
        ],
        'H':
        [
            define('btoa(true)[1]', ATOB),
            define('"".link()[3]', CAPITAL_HTML),
            define
            ({ expr: '(RP_3_WA + Function("return history")())[11]', optimize: true }, HISTORY),
            define('(RP_1_WA + Audio)[10]', HTMLAUDIOELEMENT),
            define('(RP_3_WA + document)[11]', HTMLDOCUMENT),
        ],
        'I': '"Infinity"[0]',
        'J':
        [
            define('"j"[TO_UPPER_CASE]()'),
            define('btoa(true)[2]', ATOB),
            defineCharDefault({ atob: false }),
        ],
        'K':
        [
            define('(RP_5_A + "".strike())[10]', CAPITAL_HTML),
            defineCharDefault(),
        ],
        'L':
        [
            define('btoa(".")[0]', ATOB),
            define('(RP_3_WA + "".fontcolor())[11]', CAPITAL_HTML),
            define('(Audio + [])[12]', HTMLAUDIOELEMENT),
            define('(document + [])[11]', HTMLDOCUMENT),
        ],
        'M':
        [
            define('btoa(0)[0]', ATOB),
            define('"".small()[2]', CAPITAL_HTML),
            define('(RP_4_A + Date())[30]', GMT),
            define('(Audio + [])[11]', HTMLAUDIOELEMENT),
            define('(document + [])[10]', HTMLDOCUMENT),
        ],
        'N': '"NaN"[0]',
        'O':
        [
            define('(RP_3_WA + PLAIN_OBJECT)[11]'),
            define('btoa(NaN)[3]', ATOB),
            define('"".fontcolor()[2]', CAPITAL_HTML),
            define('(RP_3_WA + Intl)[11]', PLAIN_INTL),
        ],
        'P':
        [
            define('atob("01A")[1]', ATOB),
            define('btoa("".italics())[0]', ATOB),
            define('(Function("return statusbar")() + [])[11]', BARPROP),
            define('"0".sup()[10]', CAPITAL_HTML),
            defineCharDefault({ atob: false, charCode: false }),
        ],
        'Q':
        [
            define('"q"[TO_UPPER_CASE]()'),
            define('btoa(1)[1]', ATOB),
            defineCharDefault({ atob: false }),
        ],
        'R':
        [
            defineFHCharAt('RegExp', 9),
            define('btoa("0true")[2]', ATOB),
            define('"".fontcolor()[10]', CAPITAL_HTML),
            define('(RP_3_WA + REGEXP_STRING_ITERATOR)[11]', REGEXP_STRING_ITERATOR),
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
                    optimize: true,
                }
            ),
            define('btoa(NaN)[0]', ATOB),
            define('"".fontcolor([])[20]', CAPITAL_HTML),
            define('(RP_3_WA + Date())[30]', GMT),
            define('(Audio + [])[10]', HTMLAUDIOELEMENT),
            define('(RP_1_WA + document)[10]', HTMLDOCUMENT),
            defineCharDefault({ atob: false }),
        ],
        'U':
        [
            define('btoa("1NaN")[1]', ATOB),
            define('"".sub()[2]', CAPITAL_HTML),
            define('(RP_3_WA + Function("return toString")()())[11]', GLOBAL_UNDEFINED),
            define('(RP_3_WA + Function("return{}.toString")()())[11]', OBJECT_UNDEFINED),
            define('(RP_3_WA + PLAIN_OBJECT[TO_STRING].call())[11]', UNDEFINED),
            define('(RP_3_WA + ARRAY_ITERATOR[TO_STRING].call())[11]', ARRAY_ITERATOR, UNDEFINED),
            define('(RP_3_WA + Function("return Intl.toString")()())[11]', INTL, OBJECT_UNDEFINED),
            define('(RP_3_WA + Intl[TO_STRING].call())[11]', INTL, UNDEFINED),
        ],
        'V':
        [
            define('"v"[TO_UPPER_CASE]()'),
            define('(document.createElement("video") + [])[12]', ANY_DOCUMENT),
            define('btoa(undefined)[10]', ATOB),
            defineCharDefault({ atob: false }),
        ],
        'W':
        [
            define('"w"[TO_UPPER_CASE]()'),
            define('(self + RP_4_A)[SLICE_OR_SUBSTR]("-11")[0]', ANY_WINDOW),
            define('btoa(undefined)[1]', ATOB),
            define('(self + [])[11]', DOMWINDOW),
            define('(RP_3_WA + self)[11]', WINDOW),
            defineCharDefault({ atob: false }),
        ],
        'X':
        [
            define('"x"[TO_UPPER_CASE]()'),
            define('btoa("1true")[1]', ATOB),
            defineCharDefault({ atob: false }),
        ],
        'Y':
        [
            define('"y"[TO_UPPER_CASE]()'),
            define('btoa("a")[0]', ATOB),
            defineCharDefault({ atob: false }),
        ],
        'Z':
        [
            define('btoa(false)[0]', ATOB),
            define('(RP_3_WA + "".fontsize())[11]', CAPITAL_HTML),
        ],
        '[':
        [
            defineFBCharAt(14),
            define('(ARRAY_ITERATOR + [])[0]', ARRAY_ITERATOR),
        ],
        '\\':
        [
            define('ESCAPING_BACKSLASH'),
            defineCharDefault({ atob: false, escSeq: false, unescape: false }),
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
            define('(RP_5_A + ARRAY_ITERATOR)[10]', ARRAY_ITERATOR),
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
        'i': '([RP_5_A] + undefined)[10]',
        'j':
        [
            define('(PLAIN_OBJECT + [])[10]'),
            define('(ARRAY_ITERATOR + [])[3]', ARRAY_ITERATOR),
            define('(Intl + [])[3]', INTL),
            define('(Node + [])[3]', NODECONSTRUCTOR),
            define('(Intl + [])[10]', PLAIN_INTL),
            define('(self + [])[3]', SELF_OBJ),
        ],
        'k':
        [
            define('20[TO_STRING]("21")'),
            defineCharDefault(),
        ],
        'l': '"false"[2]',
        'm':
        [
            defineFHCharAt('Number', 11),
            define('(RP_6_S + Function())[20]'),
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
            define('(RP_3_WA + btoa(undefined))[10]', ATOB),
        ],
        'q':
        [
            define('212[TO_STRING]("31")[1]'),
            define('"".fontcolor(0 + "".fontcolor())[30]', ESC_HTML_ALL),
            define('"".fontcolor("0false\\"")[20]', ESC_HTML_QUOT),
            define('"".fontcolor(true + "".fontcolor())[30]', ESC_HTML_QUOT_ONLY),
            defineCharDefault(),
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
            define('(self + [])[SLICE_OR_SUBSTR]("-2")[0]', ANY_WINDOW),
            define('atob("undefined0")[1]', ATOB),
            define('(RP_4_A + self)[20]', DOMWINDOW),
            define('(self + [])[13]', WINDOW),
        ],
        'x':
        [
            define('101[TO_STRING]("34")[1]'),
            define('btoa("falsefalse")[10]', ATOB),
            define('(RP_1_WA + sidebar)[10]', EXTERNAL),
        ],
        'y': '(RP_3_WA + [Infinity])[10]',
        'z':
        [
            define('35[TO_STRING]("36")'),
            define('btoa("falsefalse")[11]', ATOB),
        ],
        '{':
        [
            defineFHCharAt('FILTER', 18),
            defineFHCharAt('FILL', 16, FILL),
            defineFHCharAt('FLAT', 16, FLAT),
        ],
        // '|':    ,
        '}':
        [
            defineFBCharAt(28),
        ],
        // '~':    ,

        '\x8a':
        [
            define('(RP_4_A + atob("NaNundefined"))[10]', ATOB),
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
            define('atob("false0")[1]', ATOB),
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
        'س':
        [
            defineLocalizedNumeral('LOCALE_AR', NaN, 2),
            defineCharDefault(),
        ],
        'ل':
        [
            defineLocalizedNumeral('LOCALE_AR', NaN, 0),
            defineCharDefault(),
        ],
        'ي':
        [
            defineLocalizedNumeral('LOCALE_AR', NaN, 1),
            defineCharDefault(),
        ],
        '٫':
        [
            defineLocalizedNumeral('LOCALE_AR', 0.1, 1),
            defineCharDefault(),
        ],
        '٬':
        [
            defineLocalizedNumeral('"fa"', 1000, 1),
            defineCharDefault(),
        ],
        '∞':
        [
            define('Infinity[TO_LOCALE_STRING]()', LOCALE_INFINITY),
            defineCharDefault(),
        ],
    });

    COMPLEX =
    noProto
    ({
        Number:         define({ expr: 'Number.name', optimize: { complexOpt: false } }, NAME),
        Object:         define({ expr: 'Object.name', optimize: { complexOpt: false } }, NAME),
        RegExp:         define({ expr: 'RegExp.name', optimize: { complexOpt: false } }, NAME),
        String:         define('String.name', NAME),
        fromCharCo:
        define({ expr: '"from3har3o".split(3).join("C")', optimize: { complexOpt: false } }),
        mCh:            define('atob("bUNo")', Feature.ATOB),
    });

    CONSTANTS =
    noProto
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
        Intl:
        [
            define('Function("return Intl")()', INTL),
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
            define('Intl.constructor', INTL),
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
            define({ expr: 'Function("return document")()', optimize: true }, ANY_DOCUMENT),
        ],
        escape:
        [
            define({ expr: 'Function("return escape")()', optimize: true }),
        ],
        self:
        [
            define('Function("return self")()', SELF_OBJ),
        ],
        sidebar:
        [
            define('Function("return sidebar")()', EXTERNAL),
        ],
        unescape:
        [
            define({ expr: 'Function("return unescape")()', optimize: true }),
        ],

        // Custom definitions

        ANY_FUNCTION:
        [
            define('FILTER'),
            define('FILL', FILL),
            define('FLAT', FLAT),
        ],
        ARRAY_ITERATOR:
        [
            define('[].entries()', ARRAY_ITERATOR),
        ],
        ESCAPING_BACKSLASH:
        [
            define(backslashDefinition),
            define({ expr: 'atob("01y")[1]', solutionType: SolutionType.STRING }, ATOB),
            define
            ({ expr: '(RegExp("\\n") + [])[1]', solutionType: SolutionType.STRING }, ESC_REGEXP_LF),
            define
            (
                { expr: '(RP_5_A + RegExp("".italics()))[10]', solutionType: SolutionType.STRING },
                ESC_REGEXP_SLASH
            ),
            define
            (
                { expr: '(RP_3_WA + RegExp("".sub()))[10]', solutionType: SolutionType.STRING },
                ESC_REGEXP_SLASH
            ),
            define
            (
                { expr: '(RegExp(FILTER) + [])[20]', solutionType: SolutionType.STRING },
                ESC_REGEXP_LF,
                FF_SRC
            ),
            define
            (
                { expr: '(RegExp(Function()) + [])[20]', solutionType: SolutionType.STRING },
                ESC_REGEXP_LF,
                FUNCTION_19_LF
            ),
            define
            (
                { expr: '(RP_5_A + RegExp(Function()))[30]', solutionType: SolutionType.STRING },
                ESC_REGEXP_LF,
                FUNCTION_22_LF
            ),
            define
            (
                { expr: '(RegExp(ANY_FUNCTION) + [])[1]', solutionType: SolutionType.STRING },
                ESC_REGEXP_LF,
                IE_SRC
            ),
            define
            (
                {
                    expr: '(+(ANY_FUNCTION + [])[0] + RegExp(FILTER))[23]',
                    solutionType: SolutionType.STRING,
                },
                ESC_REGEXP_LF,
                NO_V8_SRC
            ),
            define
            (
                { expr: '(RP_3_WA + RegExp(FILL))[21]', solutionType: SolutionType.STRING },
                ESC_REGEXP_LF,
                FF_SRC,
                FILL
            ),
            define
            (
                { expr: '(RP_3_WA + RegExp(FLAT))[21]', solutionType: SolutionType.STRING },
                ESC_REGEXP_LF,
                FF_SRC,
                FLAT
            ),
            define
            (
                {
                    expr: '(+(ANY_FUNCTION + [])[0] + RegExp(FILL))[21]',
                    solutionType: SolutionType.STRING,
                },
                ESC_REGEXP_LF,
                FILL,
                NO_V8_SRC
            ),
            define
            (
                {
                    expr: '(+(ANY_FUNCTION + [])[0] + RegExp(FLAT))[21]',
                    solutionType: SolutionType.STRING,
                },
                ESC_REGEXP_LF,
                FLAT,
                NO_V8_SRC
            ),
        ],
        FILL:
        [
            define('[].fill', FILL),
        ],
        FILTER:
        [
            define('[].filter'),
        ],
        FLAT:
        [
            define('[].flat', FLAT),
        ],
        FROM_CHAR_CODE:
        [
            define
            (
                {
                    expr: '"fromCharCode"',
                    optimize: true,
                    solutionType: SolutionType.COMBINED_STRING,
                }
            ),
            define
            (
                {
                    expr: '"fromCodePoint"',
                    optimize: true,
                    solutionType: SolutionType.COMBINED_STRING,
                },
                FROM_CODE_POINT
            ),
        ],
        F_A_L_S_E:
        [
            define('[][SLICE_OR_FLAT].call("false")'),
        ],
        LOCALE_AR:
        [
            define({ expr: '"ar-td"', solutionType: SolutionType.COMBINED_STRING }),
            define({ expr: '"ar"', solutionType: SolutionType.COMBINED_STRING }, SHORT_LOCALES),
        ],
        PLAIN_OBJECT:
        [
            define('Function("return{}")()'),
        ],
        REGEXP_STRING_ITERATOR:
        [
            define({ expr: '"".matchAll()', optimize: true }, REGEXP_STRING_ITERATOR),
        ],
        SLICE_OR_FLAT:
        [
            define({ expr: '"slice"', solutionType: SolutionType.COMBINED_STRING }),
            define({ expr: '"flat"', solutionType: SolutionType.COMBINED_STRING }, FLAT),
        ],
        SLICE_OR_SUBSTR:
        [
            define({ expr: '"slice"', solutionType: SolutionType.COMBINED_STRING }),
            define({ expr: '"substr"', solutionType: SolutionType.COMBINED_STRING }),
        ],
        TO_LOCALE_STRING:
        [
            define
            (
                {
                    expr: '"toLocaleString"',
                    optimize: true,
                    solutionType: SolutionType.COMBINED_STRING,
                }
            ),
        ],
        TO_STRING:
        [
            define
            (
                {
                    expr: '"toString"',
                    optimize: { toStringOpt: false },
                    solutionType: SolutionType.COMBINED_STRING,
                }
            ),
        ],
        TO_UPPER_CASE:
        [
            define
            (
                {
                    expr: '"toUpperCase"',
                    optimize: true,
                    solutionType: SolutionType.COMBINED_STRING,
                }
            ),
        ],

        // Function body extra padding blocks: prepended to a function to align the function's body
        // at the same position in different engines, assuming that the function header is aligned.
        // The number after "FBEP_" is the maximum character overhead.
        // The postfix that follows the maximum character overhead has the same meaning as in
        // regular padding blocks.

        FBEP_4_S:
        [
            define('[[true][+(RP_3_WA + FILTER)[30]]]'),
            define('[[true][+(RP_5_A + FILL)[30]]]', FILL),
            define('[[true][+(RP_5_A + FLAT)[30]]]', FLAT),
        ],
        FBEP_9_U:
        [
            define
            ({ expr: '[false][+(ANY_FUNCTION + [])[20]]', solutionType: SolutionType.UNDEFINED }),
        ],

        // Function body padding blocks: prepended to a function to align the function's body at the
        // same position in different engines.
        // The number after "FBP_" is the maximum character overhead.
        // The postfix that follows the maximum character overhead has the same meaning as in
        // regular padding blocks.

        FBP_5_S:
        [
            define('[[false][+IS_IE_SRC_A]]', NO_FF_SRC),
        ],
        FBP_7_WA:
        [
            define
            (
                {
                    expr: '+("10" + [(RP_4_A + FILTER)[40]] + "00000")',
                    solutionType: SolutionType.WEAK_ALGEBRAIC,
                }
            ),
            define
            (
                {
                    expr: '+("10" + [(RP_6_S + FILL)[40]] + "00000")',
                    solutionType: SolutionType.WEAK_ALGEBRAIC,
                },
                FILL
            ),
            define
            (
                {
                    expr: '+("10" + [(RP_6_S + FLAT)[40]] + "00000")',
                    solutionType: SolutionType.WEAK_ALGEBRAIC,
                },
                FLAT
            ),
        ],
        FBP_8_WA:
        [
            define
            (
                {
                    expr: '+("1000" + (RP_5_A + FILTER + 0)[40] + "000")',
                    solutionType: SolutionType.WEAK_ALGEBRAIC,
                }
            ),
            define
            (
                {
                    expr: '+("1000" + (FILL + 0)[33] + "000")',
                    solutionType: SolutionType.WEAK_ALGEBRAIC,
                },
                FILL
            ),
            define
            (
                {
                    expr: '+("1000" + (FLAT + 0)[33] + "000")',
                    solutionType: SolutionType.WEAK_ALGEBRAIC,
                },
                FLAT
            ),
        ],
        FBP_9_U:
        [
            define
            (
                { expr: '[true][+(ANY_FUNCTION + [])[0]]', solutionType: SolutionType.UNDEFINED },
                NO_FF_SRC
            ),
        ],

        // Function header shift: used to adjust an indexer to make it point to the same position in
        // the string representation of a function's header in different engines.
        // This evaluates to an array containing only the number 𝑛 - 1 or only the number 𝑛, where 𝑛
        // is the number after "FH_SHIFT_".

        FH_SHIFT_1:
        [
            define('[+IS_IE_SRC_A]'),
        ],
        FH_SHIFT_3:
        [
            define('[2 + IS_IE_SRC_A]'),
        ],

        // Function header padding blocks: prepended to a function to align the function's header at
        // the same position in different engines.
        // The number after "FHP_" is the maximum character overhead.
        // The postfix that follows the maximum character overhead has the same meaning as in
        // regular padding blocks.

        FHP_3_WA:
        [
            define
            (
                {
                    expr: '+(1 + [+(ANY_FUNCTION + [])[0]])',
                    solutionType: SolutionType.WEAK_ALGEBRAIC,
                }
            ),
            define
            (
                {
                    expr: '+(++(ANY_FUNCTION + [])[0] + [0])',
                    solutionType: SolutionType.WEAK_ALGEBRAIC,
                },
                INCR_CHAR
            ),
        ],
        FHP_5_A:
        [
            define({ expr: 'IS_IE_SRC_A', solutionType: SolutionType.ALGEBRAIC }),
        ],
        FHP_8_S:
        [
            define({ expr: '[FHP_3_WA] + RP_5_A', solutionType: SolutionType.COMBINED_STRING }),
            define
            (
                { expr: 'FHP_5_A + [RP_3_WA]', solutionType: SolutionType.PREFIXED_STRING },
                INCR_CHAR
            ),
        ],

        // Conditional padding blocks.
        //
        // true if feature IE_SRC is available; false otherwise.
        IS_IE_SRC_A:
        [
            define
            ({ expr: '!!(+(ANY_FUNCTION + [])[0] + true)', solutionType: SolutionType.ALGEBRAIC }),
            define
            (
                { expr: '!!++(ANY_FUNCTION + [])[0]', solutionType: SolutionType.ALGEBRAIC },
                INCR_CHAR
            ),
        ],

        // Regular padding blocks.
        //
        // The number after "RP_" is the character overhead.
        // The postifx that follows it indicates the solution type.
        //
        // • "_U":  environment hybrid undefined and algebraic
        // • "_A":  algebraic
        // • "_WA": weak algebraic
        // • "_S":  object, prefixed string or combined string
        // • "_WS": weak prefixed string

        RP_0_S:     { expr: '[]',       solutionType: SolutionType.OBJECT },
        RP_1_WA:    { expr: '0',        solutionType: SolutionType.WEAK_ALGEBRAIC },
        RP_2_WS:    { expr: '"00"',     solutionType: SolutionType.WEAK_PREFIXED_STRING },
        RP_3_WA:    { expr: 'NaN',      solutionType: SolutionType.WEAK_ALGEBRAIC },
        RP_4_A:     { expr: 'true',     solutionType: SolutionType.ALGEBRAIC },
        RP_5_A:     { expr: 'false',    solutionType: SolutionType.ALGEBRAIC },
        RP_6_S:     { expr: '"0false"', solutionType: SolutionType.COMBINED_STRING },
    });

    FB_EXPR_INFOS =
    [
        define({ expr: 'FILTER', shift: 6 }),
        define({ expr: 'FILL', shift: 4 }, FILL),
        define({ expr: 'FLAT', shift: 4 }, FLAT),
    ];

    FB_PADDING_INFOS =
    [
        define({ blocks: FB_PADDINGS, shift: 0 }),
        define({ blocks: FB_NO_FF_PADDINGS, shift: 0 }, NO_FF_SRC),
        define({ blocks: FB_NO_IE_PADDINGS, shift: 0 }, NO_IE_SRC),
        define(null, NO_V8_SRC),
        define({ blocks: R_PADDINGS, shift: 0 }, V8_SRC),
        define({ blocks: R_PADDINGS, shift: 5 }, IE_SRC),
        define({ blocks: R_PADDINGS, shift: 4 }, FF_SRC),
    ];

    FH_PADDING_INFOS =
    [
        define({ blocks: FH_PADDINGS, shift: 0 }),
        define({ blocks: R_PADDINGS, shift: 0 }, NO_IE_SRC),
        define({ blocks: R_PADDINGS, shift: 1 }, IE_SRC),
    ];

    FROM_CHAR_CODE =
    defineList
    (
        [define('fromCharCode'), define('fromCodePoint', FROM_CODE_POINT)],
        [
            define(0),
            define(1, ATOB),
            define(1, BARPROP),
            define(1, CAPITAL_HTML),
            define(0, ARRAY_ITERATOR, ATOB, CAPITAL_HTML, FROM_CODE_POINT),
        ]
    );

    FROM_CHAR_CODE_CALLBACK_FORMATTER =
    defineList
    (
        [
            define
            (
                function (fromCharCode, arg)
                {
                    var expr =
                    'function(undefined){return String.' + fromCharCode + '(' + arg + ')}';
                    return expr;
                }
            ),
            define
            (
                function (fromCharCode, arg)
                {
                    var expr =
                    'function(undefined){return(isNaN+false).constructor.' + fromCharCode + '(' +
                    arg + ')}';
                    return expr;
                }
            ),
            define
            (
                function (fromCharCode, arg)
                {
                    var expr = 'undefined=>String.' + fromCharCode + '(' + arg + ')';
                    return expr;
                },
                ARROW
            ),
            define
            (
                function (fromCharCode, arg)
                {
                    var expr =
                    'undefined=>(isNaN+false).constructor.' + fromCharCode + '(' + arg + ')';
                    return expr;
                },
                ARROW
            ),
            define
            (
                function (fromCharCode, arg)
                {
                    var expr =
                    'function(undefined){return status.constructor.' + fromCharCode + '(' + arg +
                    ')}';
                    return expr;
                },
                STATUS
            ),
            define
            (
                function (fromCharCode, arg)
                {
                    var expr = 'undefined=>status.constructor.' + fromCharCode + '(' + arg + ')';
                    return expr;
                },
                ARROW,
                STATUS
            ),
        ],
        [
            define(1),
            define(3),
            define(0, ARRAY_ITERATOR, CAPITAL_HTML),
            define(1, ARRAY_ITERATOR, CAPITAL_HTML, FLAT),
            define(0, ARRAY_ITERATOR, CAPITAL_HTML, NO_V8_SRC),
            define(1, ARRAY_ITERATOR, CAPITAL_HTML, FF_SRC, FLAT),
            define(1, ARRAY_ITERATOR, CAPITAL_HTML, FILL, IE_SRC),
            define(1, ARRAY_ITERATOR, CAPITAL_HTML, FILL, NO_IE_SRC),
            define(1, ARRAY_ITERATOR, CAPITAL_HTML, FLAT, IE_SRC),
            define(2, ARRAY_ITERATOR, CAPITAL_HTML),
            define(4),
            define(5),
        ]
    );

    MAPPER_FORMATTER =
    defineList
    (
        [
            define
            (
                function (argName, accessor)
                {
                    var otherArgName = chooseOtherArgName(argName);
                    var mapper =
                    'Function("return function(' + otherArgName + '){return function(' + argName +
                    '){return ' + otherArgName + accessor + '}}")()';
                    return mapper;
                }
            ),
            define
            (
                function (argName, accessor)
                {
                    var mapper =
                    'Function("return function(' + argName + '){return this' + accessor +
                    '}")().bind';
                    return mapper;
                }
            ),
            define
            (
                function (argName, accessor)
                {
                    var otherArgName = chooseOtherArgName(argName);
                    var mapper =
                    'Function("return ' + otherArgName + '=>' + argName + '=>' + otherArgName +
                    accessor + '")()';
                    return mapper;
                },
                ARROW
            ),
        ],
        [
            define(0),
            define(1, ARRAY_ITERATOR, ATOB),
            define(0, NO_FF_SRC),
            define(0, NO_V8_SRC),
            define(1, ARRAY_ITERATOR, CAPITAL_HTML),
            define(0, ARRAY_ITERATOR, ATOB, FILL),
            define(0, ARRAY_ITERATOR, ATOB, FLAT),
            define(0, ARRAY_ITERATOR, ATOB, NO_IE_SRC),
            define(0, ARRAY_ITERATOR, CAPITAL_HTML, FILL),
            define(0, ARRAY_ITERATOR, CAPITAL_HTML, FLAT),
            define(0, ARRAY_ITERATOR, CAPITAL_HTML, IE_SRC),
            define(0, ARRAY_ITERATOR, CAPITAL_HTML, NO_IE_SRC),
            define(2),
        ]
    );

    OPTIMAL_ARG_NAME =
    defineList
    (
        [define('f'), define('undefined')],
        [define(0), define(1, FILL, IE_SRC), define(1, FILL, NO_IE_SRC), define(0, FLAT)]
    );

    OPTIMAL_B = defineList([define('B'), define('b')], [define(0), define(1, ARRAY_ITERATOR)]);

    OPTIMAL_RETURN_STRING =
    defineList
    (
        [
            define('return String'),
            define('return(isNaN+false).constructor'),
            define('return status.constructor', STATUS),
        ],
        [
            define(1),
            define(0, ARRAY_ITERATOR, CAPITAL_HTML),
            define(1, FLAT),
            define(0, ARRAY_ITERATOR, CAPITAL_HTML, NO_V8_SRC),
            define(1, ARRAY_ITERATOR, CAPITAL_HTML, FF_SRC, FLAT),
            define(1, ARRAY_ITERATOR, CAPITAL_HTML, FILL, IE_SRC),
            define(1, ARRAY_ITERATOR, CAPITAL_HTML, FILL, NO_IE_SRC),
            define(1, ARRAY_ITERATOR, CAPITAL_HTML, FLAT, IE_SRC),
            define(2),
        ]
    );

    PADDING_ENTRIES_MAP =
    {
        18:
        [
            define(12),
            define({ block: 'RP_0_S', indexer: '2 + FH_SHIFT_3' }, NO_V8_SRC),
            define(3, V8_SRC),
            define(0, IE_SRC),
            define(0, FF_SRC),
        ],
        20:
        [
            define(10),
            define({ block: 'RP_6_S', indexer: 3 + ' + FH_SHIFT_1' }, NO_V8_SRC),
            define(0, V8_SRC),
            define(5, IE_SRC),
            define(6, FF_SRC),
        ],
        23:
        [
            define(7),
            define(9, NO_FF_SRC),
            define({ block: 'RP_3_WA', indexer: '3 + FH_SHIFT_1' }, NO_V8_SRC),
            define(0, V8_SRC),
            define(3, IE_SRC),
            define(3, FF_SRC),
        ],
        25:
        [
            define(7),
            define(5, NO_FF_SRC),
            define(5, NO_IE_SRC),
            define({ block: 'RP_1_WA', indexer: '3 + FH_SHIFT_1' }, NO_V8_SRC),
            define(0, IE_SRC),
            define(1, FF_SRC),
        ],
        30:
        [
            define(10),
            define({ block: 'RP_6_S', indexer: 4 + ' + FH_SHIFT_1' }, NO_V8_SRC),
            define(0, V8_SRC),
            define(5, IE_SRC),
            define(6, FF_SRC),
        ],
        32:
        [
            define(8),
            define(9, NO_FF_SRC),
            define(9, NO_IE_SRC),
            define({ block: 'RP_4_A', indexer: '4 + FH_SHIFT_1' }, NO_V8_SRC),
            define(0, V8_SRC),
            define(3, IE_SRC),
            define(4, FF_SRC),
        ],
        34:
        [
            define(7),
            define(9, NO_FF_SRC),
            define(6, INCR_CHAR, NO_FF_SRC),
            define(9, NO_IE_SRC),
            define({ block: 'RP_2_WS', indexer: '4 + FH_SHIFT_1' }, NO_V8_SRC),
            define(6, V8_SRC),
            define(1, IE_SRC),
            define(3, FF_SRC),
        ],
    };

    var replaceStaticExpr;

    initReplaceStaticExpr =
    function (value)
    {
        initReplaceStaticExpr = null;
        replaceStaticExpr = value;
    };

    // Create simple constant solutions
    defineSimple('false',       '![]',              SolutionType.ALGEBRAIC);
    defineSimple('true',        '!![]',             SolutionType.ALGEBRAIC);
    defineSimple('undefined',   '[][[]]',           SolutionType.UNDEFINED);
    defineSimple('NaN',         '+[false]',         SolutionType.WEAK_ALGEBRAIC);
    defineSimple('Infinity',    JSFUCK_INFINITY,    SolutionType.WEAK_ALGEBRAIC);

    // Create definitions for digits
    for (var digit = 0; digit <= 9; ++digit)
    {
        var expr = replaceDigit(digit);
        CHARACTERS[digit] = { expr: expr, solutionType: SolutionType.WEAK_ALGEBRAIC };
    }

    // Define localized digits
    defineLocalizedNumerals('LOCALE_AR', 0x0660);
    defineLocalizedNumerals('"fa"', 0x6f0);
}
)();
