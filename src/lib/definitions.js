// As of version 2.1.0, definitions are interpreted using JScrewIt's own express parser, which can
// handle and optimize a useful subset of the JavaScript syntax.
// See express-parse.js for details about constructs recognized by express.
// Compared to generic purpose encoding, definition encoding differs mainly in that every identifier
// used must be defined itself, too, in a constant definition.

import { define, defineList, makeCallableWithFeatures } from './definers';
import { replaceStaticExpr }                            from './encoder/encoder-utils';
import { Feature }                                      from './features';
import { _String, createEmpty, noProto }                from './obj-utils';
import { LazySolution, SimpleSolution }                 from './solution';
import { SolutionType }                                 from 'novem';

export var AMENDINGS = ['true', 'undefined', 'NaN'];

export var JSFUCK_INFINITY = '1e1000';

export var R_PADDINGS =
[
    'RP_0_S',
    'RP_1_WA',
    ,
    'RP_3_WA',
    'RP_4_A',
    'RP_5_A',
    'RP_6_S',
];

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
export var NATIVE_FUNCTION_INFOS;

var FB_PADDING_ENTRIES_MAP = createEmpty();
var FH_PADDING_ENTRIES_MAP = createEmpty();

var FB_R_PADDING_SHIFTS;
var FH_R_PADDING_SHIFTS;

function backslashDefinition()
{
    var replacement = this._replaceCharByUnescape(0x5C);
    var solution = new SimpleSolution(undefined, replacement, SolutionType.STRING);
    return solution;
}

function chooseOtherArgName(argName)
{
    var otherArgName = argName !== 'undefined' ? 'undefined' : 'falsefalse';
    return otherArgName;
}

function createCharAtFnPosDefinition(expr, index, paddingEntries)
{
    function definitionFX(char)
    {
        var solution =
        this._resolveCharInExpr(char, expr, index, paddingEntries, FH_R_PADDING_SHIFTS);
        return solution;
    }

    return definitionFX;
}

function createCharInFBDefinition(offset)
{
    function definitionFB(char)
    {
        var solution =
        this._resolveCharInNativeFunction(char, offset, getFBPaddingEntries, FB_R_PADDING_SHIFTS);
        return solution;
    }

    return definitionFB;
}

function createCharInFHDefinition(offset)
{
    function definitionFH(char)
    {
        var solution =
        this._resolveCharInNativeFunction(char, offset, getFHPaddingEntries, FH_R_PADDING_SHIFTS);
        return solution;
    }

    return definitionFH;
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

function definePadding(block, shiftedIndex)
{
    var padding = { block: block, shiftedIndex: shiftedIndex };
    var paddingEntry = define._callWithFeatures(padding, arguments, 2);
    return paddingEntry;
}

function getFBPaddingEntries(index)
{
    var paddingEntries = FB_PADDING_ENTRIES_MAP[index];
    if (!paddingEntries)
    {
        var AT          = Feature.AT;
        var FF_SRC      = Feature.FF_SRC;
        var IE_SRC      = Feature.IE_SRC;
        var NO_FF_SRC   = Feature.NO_FF_SRC;
        var NO_IE_SRC   = Feature.NO_IE_SRC;
        var NO_V8_SRC   = Feature.NO_V8_SRC;
        var V8_SRC      = Feature.V8_SRC;

        switch (index)
        {
        case 16:
            paddingEntries =
            [
                definePadding('FBEP_4_S', '2 + FH_SHIFT_1'),
                definePadding('FBP_5_S', 21, NO_FF_SRC),
                definePadding('FBEP_4_S', 20, NO_IE_SRC),
                definePadding('RP_0_S', '2 + FH_SHIFT_1', NO_V8_SRC),
                define(0, FF_SRC),
                define(0, IE_SRC),
                define(4, V8_SRC),
            ];
            break;
        case 18:
        case 28:
            paddingEntries =
            [
                definePadding('RP_5_A + [FBP_7_WA]', index + 12),
                definePadding('RP_4_A + [FBP_8_WA]', index + 12, AT),
                definePadding('[RP_3_WA] + FBP_9_U', index + 12, NO_FF_SRC),
                definePadding('[RP_3_WA] + FBEP_9_U', index + 12, NO_IE_SRC),
                definePadding('FBEP_4_S', index + 4, Feature.INCR_CHAR, NO_IE_SRC),
                definePadding('RP_0_S', (index + 2) / 10 + ' + FH_SHIFT_3', NO_V8_SRC),
                define(0, FF_SRC),
                define(0, IE_SRC),
                define(3, V8_SRC),
            ];
            break;
        case 20:
        case 30:
            paddingEntries =
            [
                definePadding('RP_3_WA + [FBP_7_WA]', index + 10),
                definePadding('FBEP_10_S', (index + 10) / 10 + ' + FH_SHIFT_1', AT),
                definePadding('[RP_1_WA] + FBP_9_U', index + 10, NO_FF_SRC),
                definePadding('FBEP_10_S', index + 10, NO_IE_SRC),
                definePadding('RP_6_S', (index + 10) / 10 + ' + FH_SHIFT_1', NO_V8_SRC),
                define(6, FF_SRC),
                define(5, IE_SRC),
                define(0, V8_SRC),
            ];
            break;
        case 21:
            paddingEntries =
            [
                definePadding('FBEP_9_U', '3 + FH_SHIFT_1'),
                definePadding('FBP_9_U', 30, NO_FF_SRC),
                definePadding('FBEP_9_U', 30, NO_IE_SRC),
                definePadding('RP_5_A', '3 + FH_SHIFT_1', NO_V8_SRC),
                define(5, FF_SRC),
                define(4, IE_SRC),
                define(0, V8_SRC),
            ];
            break;
        case 23:
            paddingEntries =
            [
                definePadding('FBP_7_WA', 30),
                definePadding('FBP_9_U', 32, NO_FF_SRC),
                definePadding('FBEP_9_U', 32, NO_IE_SRC),
                definePadding('RP_3_WA', '3 + FH_SHIFT_1', NO_V8_SRC),
                define(3, FF_SRC),
                define(3, IE_SRC),
                define(0, V8_SRC),
            ];
            break;
        case 25:
            paddingEntries =
            [
                definePadding('FBP_7_WA', 32),
                definePadding('FBP_5_S', 30, NO_FF_SRC),
                definePadding('RP_1_WA + FBEP_4_S', 30, NO_IE_SRC),
                definePadding('RP_1_WA', '3 + FH_SHIFT_1', NO_V8_SRC),
                define(1, FF_SRC),
                define(0, IE_SRC),
                define(5, V8_SRC),
            ];
            break;
        case 32:
            paddingEntries =
            [
                definePadding('FBP_8_WA', 40),
                definePadding('FBP_9_U', 41, NO_FF_SRC),
                definePadding('FBEP_9_U', 41, NO_IE_SRC),
                definePadding('RP_4_A', '4 + FH_SHIFT_1', NO_V8_SRC),
                define(4, FF_SRC),
                define(3, IE_SRC),
                define(0, V8_SRC),
            ];
            break;
        case 34:
            paddingEntries =
            [
                definePadding('FBP_7_WA', 41),
                definePadding('RP_1_WA + FBP_5_S', 40, NO_FF_SRC),
                definePadding('FBEP_9_U', 43, NO_IE_SRC),
                definePadding('RP_2_WS', '4 + FH_SHIFT_1', NO_V8_SRC),
                define(3, FF_SRC),
                define(1, IE_SRC),
                define(6, V8_SRC),
            ];
            break;
        }
        paddingEntries.cacheKey = 'FBP:' + index;
        FB_PADDING_ENTRIES_MAP[index] = paddingEntries;
    }
    return paddingEntries;
}

function getFHPaddingEntries(index)
{
    var paddingEntries = FH_PADDING_ENTRIES_MAP[index];
    if (!paddingEntries)
    {
        var IE_SRC      = Feature.IE_SRC;
        var INCR_CHAR   = Feature.INCR_CHAR;
        var NO_IE_SRC   = Feature.NO_IE_SRC;

        switch (index)
        {
        case 3:
        case 13:
            paddingEntries =
            [
                definePadding('RP_4_A + [FHP_3_WA]', index + 7),
                definePadding('FHP_8_S', index + 8, INCR_CHAR),
                define(6, IE_SRC),
                define(0, NO_IE_SRC),
            ];
            break;
        case 6:
        case 16:
            paddingEntries =
            [
                definePadding('FHP_5_A', index + 5),
                define(3, IE_SRC),
                define(4, NO_IE_SRC),
            ];
            break;
        case 8:
        case 18:
            paddingEntries =
            [
                definePadding('FHP_3_WA', index + 3),
                definePadding('RP_2_WS', (index + 2) / 10 + ' + FH_SHIFT_1', INCR_CHAR),
                define(1, IE_SRC),
                define(3, NO_IE_SRC),
            ];
            break;
        case 9:
        case 19:
            paddingEntries =
            [
                definePadding('RP_1_WA', (index + 1) / 10 + ' + FH_SHIFT_1'),
                define(0, IE_SRC),
                define(1, NO_IE_SRC),
            ];
            break;
        case 11:
            paddingEntries =
            [
                definePadding('RP_0_S', '1 + FH_SHIFT_2'),
                define(0, IE_SRC),
                define(0, NO_IE_SRC),
            ];
            break;
        case 12:
            paddingEntries =
            [
                definePadding('FHP_8_S', 20),
                define(0, IE_SRC),
                define(0, NO_IE_SRC),
            ];
            break;
        case 14:
            paddingEntries =
            [
                definePadding('[RP_1_WA] + FHP_5_A', 20),
                define(5, IE_SRC),
                define(6, NO_IE_SRC),
            ];
            break;
        case 15:
            paddingEntries =
            [
                definePadding('FHP_5_A', 20),
                define(4, IE_SRC),
                define(5, NO_IE_SRC),
            ];
            break;
        case 17:
            paddingEntries =
            [
                definePadding('FHP_3_WA', 20),
                definePadding('RP_3_WA', 2 + ' + FH_SHIFT_1', INCR_CHAR),
                define(3, IE_SRC),
                define(3, NO_IE_SRC),
            ];
            break;
        }
        paddingEntries.cacheKey = 'FHP:' + index;
        FH_PADDING_ENTRIES_MAP[index] = paddingEntries;
    }
    return paddingEntries;
}

(function ()
{
    var ANY_DOCUMENT                    = Feature.ANY_DOCUMENT;
    var ANY_WINDOW                      = Feature.ANY_WINDOW;
    var ARRAY_ITERATOR                  = Feature.ARRAY_ITERATOR;
    var ARROW                           = Feature.ARROW;
    var AT                              = Feature.AT;
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
    var GENERIC_ARRAY_TO_STRING         = Feature.GENERIC_ARRAY_TO_STRING;
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
    var LOCALE_NUMERALS_EXT             = Feature.LOCALE_NUMERALS_EXT;
    var LOCATION                        = Feature.LOCATION;
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

    function createCharDefaultDefinition
    (atobOpt, charCodeOpt, escSeqOpt, unescapeOpt)
    {
        function charDefaultDefinition(char)
        {
            var charCode = char.charCodeAt();
            var solution =
            this._createCharDefaultSolution
            (char, charCode, atobOpt && charCode < 0x100, charCodeOpt, escSeqOpt, unescapeOpt);
            return solution;
        }

        return charDefaultDefinition;
    }

    function defineCharAtFnPos(expr, index)
    {
        var paddingEntries = getFHPaddingEntries(index);
        var definition = createCharAtFnPosDefinition(expr, index, paddingEntries);
        var entry = define._callWithFeatures(definition, arguments, 2);
        return entry;
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
        var entry = define(definition);
        return entry;
    }

    function defineCharInFB(offset)
    {
        var definition = createCharInFBDefinition(offset);
        var entry = define(definition);
        return entry;
    }

    function defineCharInFH(offset)
    {
        var definition = createCharInFHDefinition(offset);
        var entry = define._callWithFeatures(definition, arguments, 1);
        return entry;
    }

    function defineLocalizedNumeral(locale, number, index)
    {
        var expr = '(' + number + ')[TO_LOCALE_STRING](' + locale + ')';
        if (index != null)
            expr += '[' + index + ']';
        var entry = define._callWithFeatures(expr, LOCALE_NUMERALS, arguments, 3);
        return entry;
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

    function useLocaleNumeralDefinition(char, locale, number, index)
    {
        CHARACTERS[char] =
        [
            defineLocalizedNumeral._callWithFeatures(locale, number, index, arguments, 4),
            defineCharDefault(),
        ];
    }

    function useLocaleNumeralDigitDefinitions(locale, zeroCharCode)
    {
        var fromCharCode = _String.fromCharCode;
        for (var digit = 0; digit <= 9; ++digit)
        {
            var char = fromCharCode(zeroCharCode + digit);
            useLocaleNumeralDefinition
            ._callWithFeatures(char, locale, digit, undefined, arguments, 2);
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
            define('(RP_0_S + Function())[23]'),
            define('(RP_1_WA + Function())[20]', FUNCTION_19_LF),
            define('(RP_0_S + Function())[22]', FUNCTION_22_LF),
            define('(RP_0_S + ANY_FUNCTION)[0]', IE_SRC),
            defineCharInFH(13, NO_V8_SRC),
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
            defineCharAtFnPos('ANY_FUNCTION', 8),
            define('(RP_3_WA + ARRAY_ITERATOR)[10]', ARRAY_ITERATOR),
            define('(RP_0_S + FILTER)[20]', FF_SRC),
            define('(+(RP_0_S + FILTER)[0] + FILTER)[22]', NO_FF_SRC),
            define('(RP_0_S + FILTER)[21]', NO_V8_SRC),
            define('(RP_1_WA + FILTER)[20]', V8_SRC),
            define('(RP_1_WA + AT)[20]', AT, NO_V8_SRC),
            define('(RP_5_A + AT)[20]', AT, V8_SRC),
            define('(+(RP_0_S + FILL)[0] + FILL)[20]', FILL, NO_FF_SRC),
            define('(RP_5_A + FILL)[20]', FILL, NO_IE_SRC),
            define('(RP_0_S + FILL)[20]', FILL, NO_V8_SRC),
            define('(+(RP_0_S + FLAT)[0] + FLAT)[20]', FLAT, NO_FF_SRC),
            define('(RP_5_A + FLAT)[20]', FLAT, NO_IE_SRC),
            define('(RP_0_S + FLAT)[20]', FLAT, NO_V8_SRC),
        ],
        // '!':    ,
        '"':
        [
            define('"".fontcolor()[12]'),
        ],
        '#':
        [
            define('document.nodeName[0]', ANY_DOCUMENT),
            defineCharDefault(),
        ],
        // '$':    ,
        '%':
        [
            define('escape(FILTER)[20]'),
            define('escape(0 + AT)[20]', AT),
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
            defineCharInFH(9),
        ],
        ')':
        [
            defineCharInFH(10),
        ],
        // '*':    ,
        '+': '(1e100 + [])[2]',
        ',':
        [
            define('(RP_0_S + F_A_L_S_E)[1]'),
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
            define('(RP_0_S + RegExp())[3]'),
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
            define('(RP_0_S + RegExp())[2]'),
            defineCharDefault(),
        ],
        // '@':    ,
        'A':
        [
            defineCharAtFnPos('Array', 9),
            define('(RP_3_WA + ARRAY_ITERATOR)[11]', ARRAY_ITERATOR),
        ],
        'B':
        [
            defineCharAtFnPos('Boolean', 9),
            define('"0".sub()[10]', CAPITAL_HTML),
        ],
        'C':
        [
            define('escape("".italics())[2]'),
            define('escape("".sub())[2]'),
            define('escape(F_A_L_S_E)[11]'),
            define('atob("00NaNfalse")[1]', ATOB),
            define('(RP_4_A + "".fontcolor())[10]', CAPITAL_HTML),
            define('(RP_3_WA + Function("return console")())[11]', CONSOLE),
            define('(RP_0_S + Node)[12]', NODECONSTRUCTOR),
        ],
        'D':
        [
            // • The escaped character may be either "]" or "}".
            define('escape((+("1000" + (RP_5_A + FILTER + 0)[40] + 0) + FILTER)[40])[2]'), // *
            define('escape("]")[2]'),
            define('escape("}")[2]'),
            define('(document + RP_0_S)[SLICE_OR_SUBSTR]("-10")[1]', ANY_DOCUMENT),
            define('escape((RP_4_A + [+("1000" + (AT + 0)[31] + 0)] + AT)[40])[2]', AT), // *
            define('btoa("00")[1]', ATOB),
            define('(RP_3_WA + document)[11]', DOCUMENT),
            define('(RP_3_WA + self)[11]', DOMWINDOW),
            define // *
            ('escape((NaN + [+("10" + [(RP_6_S + FILL)[40]] + "000")] + FILL)[40])[2]', FILL),
            define // *
            ('escape((NaN + [+("10" + [(RP_6_S + FLAT)[40]] + "000")] + FLAT)[40])[2]', FLAT),
            define('(RP_0_S + document)[12]', HTMLDOCUMENT),
            define('escape(ARRAY_ITERATOR)[30]', NO_OLD_SAFARI_ARRAY_ITERATOR),
            define('escape(FILTER)[50]', V8_SRC),
            define('(document + [RP_1_WA]).at("-10")', ANY_DOCUMENT, AT),
            define('escape(AT)[61]', AT, IE_SRC),
            define('escape([[]][+(RP_0_S + AT)[0]] + AT)[61]', AT, NO_FF_SRC), // *
            define('escape([NaN][+(RP_1_WA + AT)[20]] + AT)[61]', AT, NO_IE_SRC), // *
            define('escape(true + AT)[50]', AT, V8_SRC),
            define('escape(FILL)[60]', FF_SRC, FILL),
            define('escape(FLAT)[60]', FF_SRC, FLAT),
        ],
        'E':
        [
            defineCharAtFnPos('RegExp', 12),
            define('btoa("0NaN")[1]', ATOB),
            define('(RP_5_A + "".link())[10]', CAPITAL_HTML),
            define('(RP_3_WA + sidebar)[11]', EXTERNAL),
            define('(RP_3_WA + Audio)[21]', HTMLAUDIOELEMENT),
            define('(RP_0_S + REGEXP_STRING_ITERATOR)[11]', REGEXP_STRING_ITERATOR),
        ],
        'F':
        [
            defineCharAtFnPos('Function', 9),
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
            define('(RP_0_S + Audio)[12]', HTMLAUDIOELEMENT),
            define('(RP_0_S + document)[11]', HTMLDOCUMENT),
            define
            (
                {
                    expr: 'Function("return toString.call(location)")()[SLICE_OR_SUBSTR]("-10")[1]',
                    optimize: true,
                },
                LOCATION
            ),
            define
            (
                {
                    expr: '(Function("return toString.call(location)")() + RP_1_WA).at("-10")',
                    optimize: true,
                },
                AT,
                LOCATION
            ),
            define
            (
                '[][TO_STRING].call(location)[SLICE_OR_SUBSTR]("-10")[1]',
                GENERIC_ARRAY_TO_STRING,
                LOCATION
            ),
            define
            (
                '([][TO_STRING].call(location) + RP_1_WA).at("-10")',
                AT,
                GENERIC_ARRAY_TO_STRING,
                LOCATION
            ),
        ],
        'M':
        [
            define('btoa(0)[0]', ATOB),
            define('"".small()[2]', CAPITAL_HTML),
            define('(RP_0_S + self)[10]', DOMWINDOW),
            define('(RP_4_A + Date())[30]', GMT),
            define('(RP_0_S + Audio)[11]', HTMLAUDIOELEMENT),
            define('(RP_0_S + document)[10]', HTMLDOCUMENT),
        ],
        'N': '"NaN"[0]',
        'O':
        [
            defineCharAtFnPos('Object', 9),
            define('(RP_3_WA + PLAIN_OBJECT)[11]'),
            define('btoa(NaN)[3]', ATOB),
            define('"".fontcolor()[2]', CAPITAL_HTML),
            define('(RP_1_WA + self)[10]', DOMWINDOW),
            define('(RP_3_WA + Intl)[11]', PLAIN_INTL),
        ],
        'P':
        [
            define('String.fromCharCode("80")'),
            define('atob("01A")[1]', ATOB),
            define('btoa("".italics())[0]', ATOB),
            define('(RP_0_S + Function("return statusbar")())[11]', BARPROP),
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
            defineCharAtFnPos('RegExp', 9),
            define('btoa("0true")[2]', ATOB),
            define('"".fontcolor()[10]', CAPITAL_HTML),
            define('(RP_3_WA + REGEXP_STRING_ITERATOR)[11]', REGEXP_STRING_ITERATOR),
        ],
        'S':
        [
            defineCharAtFnPos('String', 9),
            define('"".sub()[1]', CAPITAL_HTML),
        ],
        'T':
        [
            define
            (
                {
                    expr:
                    '(RP_0_S + ' +
                    'Function("try{undefined.false}catch(undefined){return undefined}")())[0]',
                    optimize: true,
                }
            ),
            define('btoa(NaN)[0]', ATOB),
            define('"".fontcolor([])[20]', CAPITAL_HTML),
            define('(RP_3_WA + Date())[30]', GMT),
            define('(RP_0_S + Audio)[10]', HTMLAUDIOELEMENT),
            define('(RP_1_WA + document)[10]', HTMLDOCUMENT),
            defineCharDefault({ atob: false }),
        ],
        'U':
        [
            define('btoa("1NaN")[1]', ATOB),
            define('"".sub()[2]', CAPITAL_HTML),
            define
            (
                {
                    expr: '(RP_3_WA + Function("return toString")()())[11]',
                    optimize: true,
                },
                GLOBAL_UNDEFINED
            ),
            define
            (
                {
                    expr: '(RP_3_WA + Function("return{}.toString")()())[11]',
                    optimize: true,
                },
                OBJECT_UNDEFINED
            ),
            define('(RP_3_WA + PLAIN_OBJECT[TO_STRING].call())[11]', UNDEFINED),
            define('(RP_3_WA + ARRAY_ITERATOR[TO_STRING].call())[11]', ARRAY_ITERATOR, UNDEFINED),
            define
            (
                {
                    expr: '(RP_3_WA + Function("return Intl.toString")()())[11]',
                    optimize: true,
                },
                INTL,
                OBJECT_UNDEFINED
            ),
            define('(RP_3_WA + Intl[TO_STRING].call())[11]', INTL, UNDEFINED),
        ],
        'V':
        [
            define('"v"[TO_UPPER_CASE]()'),
            define('(RP_0_S + document.createElement("video"))[12]', ANY_DOCUMENT),
            define('btoa(undefined)[10]', ATOB),
            defineCharDefault({ atob: false }),
        ],
        'W':
        [
            define('"w"[TO_UPPER_CASE]()'),
            define('(self + RP_4_A)[SLICE_OR_SUBSTR]("-11")[0]', ANY_WINDOW),
            define('btoa(undefined)[1]', ATOB),
            define('(RP_0_S + self)[11]', DOMWINDOW),
            define('(RP_3_WA + self)[11]', WINDOW),
            define('(self + RP_4_A).at("-11")', ANY_WINDOW, AT),
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
            defineCharInFB(14),
            define('(RP_0_S + ARRAY_ITERATOR)[0]', ARRAY_ITERATOR),
        ],
        '\\':
        [
            define('ESCAPING_BACKSLASH'),
            defineCharDefault({ atob: false, escSeq: false, unescape: false }),
        ],
        ']':
        [
            defineCharInFB(26),
            define('(RP_0_S + ARRAY_ITERATOR)[22]', NO_OLD_SAFARI_ARRAY_ITERATOR),
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
            defineCharAtFnPos('Number', 12),
            define('(RP_0_S + ARRAY_ITERATOR)[2]', ARRAY_ITERATOR),
        ],
        'c':
        [
            defineCharAtFnPos('ANY_FUNCTION', 3),
            define('(RP_5_A + ARRAY_ITERATOR)[10]', ARRAY_ITERATOR),
        ],
        'd': '"undefined"[2]',
        'e': '"true"[3]',
        'f': '"false"[0]',
        'g':
        [
            defineCharAtFnPos('String', 14),
        ],
        'h':
        [
            define('101[TO_STRING]("21")[1]'),
            define('btoa("0false")[3]', ATOB),
        ],
        'i': '([RP_5_A] + undefined)[10]',
        'j':
        [
            define('(RP_0_S + PLAIN_OBJECT)[10]'),
            define('(RP_0_S + ARRAY_ITERATOR)[3]', ARRAY_ITERATOR),
            define('(RP_0_S + Intl)[3]', INTL),
            define('(RP_0_S + Node)[3]', NODECONSTRUCTOR),
            define('(RP_0_S + Intl)[10]', PLAIN_INTL),
            define('(RP_0_S + self)[3]', SELF_OBJ),
        ],
        'k':
        [
            define('20[TO_STRING]("21")'),
            defineCharDefault(),
        ],
        'l': '"false"[2]',
        'm':
        [
            defineCharAtFnPos('Number', 11),
            define('(RP_6_S + Function())[20]'),
        ],
        'n': '"undefined"[1]',
        'o':
        [
            defineCharAtFnPos('ANY_FUNCTION', 6),
            define('(RP_0_S + ARRAY_ITERATOR)[1]', ARRAY_ITERATOR),
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
            defineCharInFB(19),
        ],
        'w':
        [
            define('32[TO_STRING]("33")'),
            define('(self + RP_0_S)[SLICE_OR_SUBSTR]("-2")[0]', ANY_WINDOW),
            define('atob("undefined0")[1]', ATOB),
            define('(RP_4_A + self)[20]', DOMWINDOW),
            define('(RP_0_S + self)[13]', WINDOW),
            define('(self + RP_0_S).at("-2")', ANY_WINDOW, AT),
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
            defineCharInFH(12),
        ],
        // '|':    ,
        '}':
        [
            defineCharInFB(28),
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
            define('[].entries().constructor', NO_OLD_SAFARI_ARRAY_ITERATOR),
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
        location:
        [
            define('Function("return location")()', LOCATION),
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
            define('AT', AT),
            define('FILL', FILL),
            define('FLAT', FLAT),
        ],
        ARRAY_ITERATOR:
        [
            define('[].entries()', ARRAY_ITERATOR),
        ],
        AT:
        [
            define('[].at', AT),
        ],
        ESCAPING_BACKSLASH:
        [
            define(backslashDefinition),
            define({ expr: 'atob("01y")[1]', solutionType: SolutionType.STRING }, ATOB),
            define
            (
                { expr: '(RP_0_S + RegExp("\\n"))[1]', solutionType: SolutionType.STRING },
                ESC_REGEXP_LF
            ),
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
                { expr: '(RP_0_S + RegExp(FILTER))[20]', solutionType: SolutionType.STRING },
                ESC_REGEXP_LF,
                FF_SRC
            ),
            define
            (
                { expr: '(RP_0_S + RegExp(Function()))[20]', solutionType: SolutionType.STRING },
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
                { expr: '(RP_0_S + RegExp(ANY_FUNCTION))[1]', solutionType: SolutionType.STRING },
                ESC_REGEXP_LF,
                IE_SRC
            ),
            define
            (
                {
                    expr: '(+(RP_0_S + FILTER)[0] + RegExp(FILTER))[23]',
                    solutionType: SolutionType.STRING,
                },
                ESC_REGEXP_LF,
                NO_V8_SRC
            ),
            define
            (
                { expr: '(RP_4_A + RegExp(AT))[20]', solutionType: SolutionType.STRING },
                AT,
                ESC_REGEXP_LF,
                FF_SRC
            ),
            define
            (
                {
                    expr: '(RP_1_WA + [+(RP_0_S + AT)[0]] + RegExp(AT))[20]',
                    solutionType: SolutionType.STRING,
                },
                AT,
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
                    expr: '(+(RP_0_S + FILL)[0] + RegExp(FILL))[21]',
                    solutionType: SolutionType.STRING,
                },
                ESC_REGEXP_LF,
                FILL,
                NO_V8_SRC
            ),
            define
            (
                {
                    expr: '(+(RP_0_S + FLAT)[0] + RegExp(FLAT))[21]',
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
            define('[[true][+(RP_1_WA + AT)[30]]]', AT),
            define('[[true][+(RP_5_A + FILL)[30]]]', FILL),
            define('[[true][+(RP_5_A + FLAT)[30]]]', FLAT),
            define('[[true][+!!++(RP_0_S + FILTER)[20]]]', INCR_CHAR),
            define('[[true][+!!++(RP_1_WA + AT)[20]]]', AT, INCR_CHAR),
            define('[[true][+!!++(RP_0_S + FILL)[20]]]', FILL, INCR_CHAR),
            define('[[true][+!!++(RP_0_S + FLAT)[20]]]', FLAT, INCR_CHAR),
        ],
        FBEP_9_U:
        [
            define
            ({ expr: '[false][+(RP_0_S + FILTER)[20]]', solutionType: SolutionType.UNDEFINED }),
            define
            ({ expr: '[false][+(RP_1_WA + AT)[20]]', solutionType: SolutionType.UNDEFINED }, AT),
            define
            ({ expr: '[false][+(RP_0_S + FILL)[20]]', solutionType: SolutionType.UNDEFINED }, FILL),
            define
            ({ expr: '[false][+(RP_0_S + FLAT)[20]]', solutionType: SolutionType.UNDEFINED }, FLAT),
        ],
        FBEP_10_S:
        [
            define({ expr: '[RP_1_WA] + FBEP_9_U', solutionType: SolutionType.COMBINED_STRING }),
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
                    expr: '+("10" + [(RP_0_S + AT)[32]] + "00000")',
                    solutionType: SolutionType.WEAK_ALGEBRAIC,
                },
                AT
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
                    expr: '+("1000" + (AT + 0)[31] + "000")',
                    solutionType: SolutionType.WEAK_ALGEBRAIC,
                },
                AT
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
                {
                    expr: '[true][+(RP_0_S + ANY_FUNCTION)[0]]',
                    solutionType: SolutionType.UNDEFINED,
                },
                NO_FF_SRC
            ),
        ],

        // Function header shift: used to adjust an index to make it point to the same position in
        // the string representation of a function's header in different engines.
        // This evaluates to an array containing only the number 𝑛 - 1 or only the number 𝑛, where 𝑛
        // is the number after "FH_SHIFT_".

        FH_SHIFT_1:
        [
            define('[+IS_IE_SRC_A]'),
        ],
        FH_SHIFT_2:
        [
            define('[true + IS_IE_SRC_A]'),
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
                    expr: '+(1 + [+(RP_0_S + ANY_FUNCTION)[0]])',
                    solutionType: SolutionType.WEAK_ALGEBRAIC,
                }
            ),
            define
            (
                {
                    expr: '+(++(RP_0_S + ANY_FUNCTION)[0] + [0])',
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
            define({ expr: '[RP_3_WA] + FHP_5_A', solutionType: SolutionType.COMBINED_STRING }),
        ],

        // Conditional padding blocks.
        //
        // true if feature IE_SRC is available; false otherwise.
        IS_IE_SRC_A:
        [
            define
            (
                {
                    expr: '!![[]][+(RP_0_S + ANY_FUNCTION)[0]]',
                    solutionType: SolutionType.ALGEBRAIC,
                }
            ),
            define
            (
                { expr: '!!++(RP_0_S + ANY_FUNCTION)[0]', solutionType: SolutionType.ALGEBRAIC },
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

    FB_R_PADDING_SHIFTS = [define(4, FF_SRC), define(5, IE_SRC), define(0, V8_SRC)];

    FH_R_PADDING_SHIFTS = [define(1, IE_SRC), define(0, NO_IE_SRC)];

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
            define(1, ARRAY_ITERATOR, AT, CAPITAL_HTML),
            define(1, ARRAY_ITERATOR, CAPITAL_HTML, FF_SRC, FLAT),
            define(1, ARRAY_ITERATOR, CAPITAL_HTML, FILL, IE_SRC),
            define(1, ARRAY_ITERATOR, CAPITAL_HTML, FILL, NO_IE_SRC),
            define(1, ARRAY_ITERATOR, CAPITAL_HTML, FLAT, IE_SRC),
            define(2, ARRAY_ITERATOR, CAPITAL_HTML),
            define(3, ARRAY_ITERATOR, AT, CAPITAL_HTML, IE_SRC),
            define(3, ARRAY_ITERATOR, AT, CAPITAL_HTML, NO_IE_SRC),
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
            define(0, ARRAY_ITERATOR, AT, ATOB),
            define(0, ARRAY_ITERATOR, AT, CAPITAL_HTML),
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

    NATIVE_FUNCTION_INFOS =
    [
        define({ expr: 'FILTER', shift: 6 }),
        define({ expr: 'FILL', shift: 4 }, FILL),
        define({ expr: 'FLAT', shift: 4 }, FLAT),
        define({ expr: 'AT', shift: 2 }, AT),
    ];

    OPTIMAL_ARG_NAME =
    defineList
    (
        [define('f'), define('undefined')],
        [
            define(0),
            define(1, AT),
            define(1, FILL, IE_SRC),
            define(1, FILL, NO_IE_SRC),
            define(0, FLAT),
        ]
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
            define(1, ARRAY_ITERATOR, AT, CAPITAL_HTML),
            define(1, ARRAY_ITERATOR, CAPITAL_HTML, FF_SRC, FLAT),
            define(1, ARRAY_ITERATOR, CAPITAL_HTML, FILL, IE_SRC),
            define(1, ARRAY_ITERATOR, CAPITAL_HTML, FILL, NO_IE_SRC),
            define(1, ARRAY_ITERATOR, CAPITAL_HTML, FLAT, IE_SRC),
            define(2),
        ]
    );

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

    makeCallableWithFeatures(defineLocalizedNumeral);
    makeCallableWithFeatures(useLocaleNumeralDefinition);

    // Localized numeral definitions
    useLocaleNumeralDigitDefinitions('LOCALE_AR', 0x0660);
    useLocaleNumeralDefinition('٫', 'LOCALE_AR', 0.1, 1);
    useLocaleNumeralDefinition('ل', '"ar"', NaN, 0);
    useLocaleNumeralDefinition('ي', '"ar"', NaN, 1);
    useLocaleNumeralDefinition('س', '"ar"', NaN, 2);
    useLocaleNumeralDefinition('ر', '"ar"', NaN, 4, LOCALE_NUMERALS_EXT);
    useLocaleNumeralDefinition('ق', '"ar"', NaN, 5, LOCALE_NUMERALS_EXT);
    useLocaleNumeralDefinition('م', '"ar"', NaN, 6, LOCALE_NUMERALS_EXT);
    useLocaleNumeralDigitDefinitions('"bn"', 0x09e6, LOCALE_NUMERALS_EXT);
    useLocaleNumeralDigitDefinitions('"fa"', 0x06f0);
    useLocaleNumeralDefinition('٬', '"fa"', 1000, 1);
    useLocaleNumeralDefinition('ن', '"fa"', NaN, 0, LOCALE_NUMERALS_EXT);
    useLocaleNumeralDefinition('ا', '"fa"', NaN, 1, LOCALE_NUMERALS_EXT);
    useLocaleNumeralDefinition('ع', '"fa"', NaN, 2, LOCALE_NUMERALS_EXT);
    useLocaleNumeralDefinition('د', '"fa"', NaN, 3, LOCALE_NUMERALS_EXT);
    useLocaleNumeralDefinition('н', '"ru"', NaN, 0, LOCALE_NUMERALS_EXT);
    useLocaleNumeralDefinition('е', '"ru"', NaN, 1, LOCALE_NUMERALS_EXT);
    useLocaleNumeralDefinition('ч', '"ru"', NaN, 3, LOCALE_NUMERALS_EXT);
    useLocaleNumeralDefinition('и', '"ru"', NaN, 4, LOCALE_NUMERALS_EXT);
    useLocaleNumeralDefinition('с', '"ru"', NaN, 5, LOCALE_NUMERALS_EXT);
    useLocaleNumeralDefinition('л', '"ru"', NaN, 6, LOCALE_NUMERALS_EXT);
    useLocaleNumeralDefinition('о', '"ru"', NaN, 7, LOCALE_NUMERALS_EXT);
}
)();
