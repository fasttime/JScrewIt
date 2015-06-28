/* global createDefinitionEntry, define, noProto */

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
        '[RP_3_NO] + FBEP_9_U'
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
        'FHP_3_NO + FBEP_4_S',
        ,
        'FHP_5_N + FBEP_4_S',
        , // Unused: 'FHP_1_S + FBEP_9_U'
        ,
        '[FHP_3_NO] + FBEP_9_U',
        // Unused
        // Unused
        // Unused: 'FHP_5_N + [RP_1_NO] + FBEP_9_U'
    ];
    
    var FH_PADDINGS =
    [
        ,
        , // Unused: 'FHP_1_S'
        ,
        'FHP_3_NO',
        ,
        'FHP_5_N',
        'FHP_5_N + [RP_1_NO]',
        'FHP_3_NO + [RP_4_N]',
        'FHP_3_NO + [RP_5_N]',
        // Unused: 'FHP_5_N + [RP_4_N]'
    ];
    
    var R_PADDINGS =
    [
        '[]',
        'RP_1_NO',
        ,
        'RP_3_NO',
        'RP_4_N',
        'RP_5_N',
        'RP_6_SO'
    ];
    
    var FB_EXPR_INFOS =
    [
        define({ expr: 'FILTER', shift: 6 }),
        define({ expr: 'FILL', shift: 4 }, 'FILL')
    ];
    
    var FB_PADDING_INFOS =
    [
        define({ paddings: FB_PADDINGS, shift: 0 }),
        define({ paddings: FB_NO_IE_PADDINGS, shift: 0 }, 'NO_IE_SRC'),
        define({ paddings: R_PADDINGS, shift: 0 }, 'V8_SRC'),
        define({ paddings: R_PADDINGS, shift: 4 }, 'FF_SAFARI_SRC'),
        define({ paddings: R_PADDINGS, shift: 5 }, 'IE_SRC')
    ];
    
    var FH_PADDING_INFOS =
    [
        define({ paddings: FH_PADDINGS, shift: 0 }),
        define({ paddings: R_PADDINGS, shift: 0 }, 'NO_IE_SRC'),
        define({ paddings: R_PADDINGS, shift: 1 }, 'IE_SRC')
    ];
    
    function createCharAtDefinition(expr, index, entries, paddingInfos)
    {
        function definition()
        {
            var solution = createCharAtSolution.call(this, expr, index, entries, paddingInfos);
            return solution;
        }
        
        return definition;
    }
    
    function createCharAtSolution(expr, index, entries, paddingInfos)
    {
        var paddingDefinition = this.findBestDefinition(entries);
        var padding, indexer;
        if (typeof paddingDefinition === 'number')
        {
            var paddingInfo = this.findBestDefinition(paddingInfos);
            padding = paddingInfo.paddings[paddingDefinition];
            indexer = index + paddingDefinition + paddingInfo.shift;
            if (indexer > 9)
            {
                indexer = '"' + indexer + '"';
            }
        }
        else
        {
            padding = paddingDefinition.padding;
            indexer = paddingDefinition.indexer;
        }
        var fullExpr = '(' + padding + '+' + expr + ')[' + indexer + ']';
        var replacement = this.replaceExpr(fullExpr);
        var solution = createSolution(replacement, LEVEL_STRING, false);
        return solution;
    }
    
    function createCharByAtobDefinition(charCode)
    {
        function definition()
        {
            var replacement = this.charEncodeByAtob(charCode);
            var solution = createSolution(replacement, LEVEL_STRING, false);
            return solution;
        }
        
        return definition;
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
                    define(
                        { padding: '[RP_1_NO] + FBEP_9_U', indexer: index / 10 + 1 + ' + FH_SHIFT' }
                    ),
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
                    define({ padding: 'RP_1_NO + FBEP_4_S', indexer: '3 + FH_SHIFT' }),
                    define(5, 'NO_IE_SRC'),
                    define(1, 'FF_SAFARI_SRC'),
                    define(0, 'IE_SRC')
                ];
                break;
            case 32:
                paddingEntries =
                [
                    define(9),
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
            var solution =
                createCharAtSolution.call(this, expr, index, paddingEntries, FB_PADDING_INFOS);
            return solution;
        }
        
        return definition;
    }
    
    function defineCharByAtob(char)
    {
        var charCode = char.charCodeAt(0);
        var definition = createCharByAtobDefinition(charCode);
        var entry = define(definition, 'ATOB');
        return entry;
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
                define({ padding: 'RP_1_NO', indexer: '1 + FH_SHIFT' }),
                define(1, 'NO_IE_SRC'),
                define(0, 'IE_SRC')
            ];
            break;
        case 11:
            entries =
            [
                // Unused:
                // define(9),
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
    
    LEVEL_STRING    = 1;
    LEVEL_OBJECT    = 0;
    LEVEL_NUMERIC   = -1;
    LEVEL_UNDEFINED = -2;
    
    CHARACTERS = noProto
    ({
        'a': '"false"[1]',
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
        'd': '"undefined"[2]',
        'e': '"true"[3]',
        'f': '"false"[0]',
        'g':
        [
            defineFHCharAt('String', 14)
        ],
        'h':
        [
            define('(101)["toString"]("21")[1]'),
            defineCharByAtob('h')
        ],
        'i': '([RP_5_N] + undefined)["10"]',
        'j':
        [
            define('(PLAIN_OBJECT + [])["10"]'),
            define('(self + [])[3]', 'SELF'),
            define('(ARRAY_ITERATOR + [])[3]', 'ENTRIES')
        ],
        'k':
        [
            define('(20)["toString"]("21")'),
            defineCharByAtob('k')
        ],
        'l': '"false"[2]',
        'm':
        [
            define('(RP_6_SO + Function())["20"]'),
            defineFHCharAt('Number', 11, 'NO_IE_SRC'),
            defineFHCharAt('Number', 11, 'IE_SRC')
        ],
        'n': '"undefined"[1]',
        'o':
        [
            defineFHCharAt('ANY_FUNCTION', 6),
            define('(ARRAY_ITERATOR + [])[1]', 'ENTRIES')
        ],
        'p':
        [
            define('(211)["toString"]("31")[1]'),
            define('(RP_3_NO + btoa(Infinity))["10"]', 'ATOB')
        ],
        'q':
        [
            define('(212)["toString"]("31")[1]'),
            defineCharByAtob('q')
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
            define('(32)["toString"]("33")'),
            define('(self + [])["slice"]("-2")[0]', 'SELF'),
            define('(self + [])["13"]', 'WINDOW'),
            define('(RP_4_N + self)["20"]', 'DOMWINDOW'),
            defineCharByAtob('w')
        ],
        'x':
        [
            define('(101)["toString"]("34")[1]'),
            defineCharByAtob('x')
        ],
        'y': '(RP_3_NO + [Infinity])["10"]',
        'z':
        [
            define('(35)["toString"]("36")'),
            defineCharByAtob('z')
        ],
        
        'A':
        [
            defineFHCharAt('Array', 9),
            define('(RP_3_NO + ARRAY_ITERATOR)[11]', 'ENTRIES')
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
            define('(RP_4_N + ""["fontcolor"]())["10"]', 'CAPITAL_HTML'),
            defineCharByAtob('C')
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
        'I': '"Infinity"[0]',
        'J':
        [
            define('btoa(true)[2]', 'ATOB')
        ],
        'K':
        [
            define('(RP_5_N + ""["strike"]())["10"]', 'CAPITAL_HTML'),
            defineCharByAtob('K')
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
        'N': '"NaN"[0]',
        'O':
        [
            define('(RP_3_NO + PLAIN_OBJECT)["11"]'),
            define('""["fontcolor"]()[2]', 'CAPITAL_HTML'),
            defineCharByAtob('O')
        ],
        'P':
        [
            define('btoa(""["italics"]())[0]', 'ATOB'),
            define('"0"["sup"]()["10"]', 'CAPITAL_HTML'),
            defineCharByAtob('P')
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
            defineFHCharAt('String', 9),
            define('""["sub"]()[1]', 'CAPITAL_HTML')
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
            define('(FILTER + [])["20"]', 'FF_SAFARI_SRC')
        ],
        // '!':    ,
        '"': '""["fontcolor"]()["12"]',
        // '#':    ,
        // '$':    ,
        '%':
        [
            define('escape(FILTER)["20"]'),
            define('escape(false + FILL)["20"]', 'NO_IE_SRC', 'FILL'),
            define('escape(ANY_FUNCTION)[0]', 'IE_SRC'),
            defineCharByAtob('%')
        ],
        '&':
        [
            define('""["fontcolor"]("\\"")["13"]', 'DOUBLE_QUOTE_ESC_HTML'),
            defineCharByAtob('&')
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
            define({ expr: '[[]]["concat"]([[]])', level: LEVEL_OBJECT })
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
            defineCharByAtob(':')
        ],
        ';':
        [
            define('""["fontcolor"]("NaN\\"")["21"]', 'DOUBLE_QUOTE_ESC_HTML'),
            defineCharByAtob(';')
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
            defineCharByAtob('?')
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
            defineCharByAtob('\\')
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
        ]
    });
    
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
    
    SIMPLE = noProto
    ({
        'false':        { expr: '![]', level: LEVEL_NUMERIC },
        'true':         { expr: '!![]', level: LEVEL_NUMERIC },
        'undefined':    { expr: '[][[]]', level: LEVEL_UNDEFINED },
        'NaN':          { expr: '+[false]', level: LEVEL_NUMERIC },
        'Infinity':     { expr: '+"1e1000"', level: LEVEL_NUMERIC }
    });
    
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
                do { replacement += '+!![]'; } while (--digit > 1);
                return replacement;
            }
        };
    
    // Create definitions for digits
    (function ()
    {
        for (var digit = 0; digit <= 9; ++digit)
        {
            var expr = replaceDigit(digit);
            CHARACTERS[digit] = { expr: expr, level: LEVEL_NUMERIC };
        }
    
    })();

})();
