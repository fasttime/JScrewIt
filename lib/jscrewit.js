/* global DEBUG */
(function (self)
{
    'use strict';
    
    // BEGIN: Features /////////////////
    
    var FEATURE_INFOS =
    {
        NO_SAFARI_LF:
        {
            description:
                'A string representation of dynamically generated functions typical for most ' +
                'browsers with the notable exception of Safari.\n' +
                'More specifically, in this representation, the character at index 22 is a line ' +
                'feed ("\\n").',
            check: function ()
            {
                return (Function() + '')[22] === '\n';
            }
        },
        NO_IE_SRC:
        {
            description:
                'A string representation of native functions typical for most browsers with the ' +
                'notable exception of Internet Explorer.\n' +
                'A remarkable trait for this feature is the lack of characters in the beginning ' +
                'of the string before "function".',
            check: function ()
            {
                return /^function Object\(\) \{(\n   )? \[native code\][^]\}/.test(Object);
            },
            excludes: ['IE_SRC']
        },
        V8_SRC:
        {
            description:
                'A string representation of native functions found in the V8 JavaScript engine.\n' +
                'V8 is used among others in Chrome, Opera, Android Browser and Node.js.\n' +
                'Remarkable traits are the lack of characters in the beginning of the string ' +
                'before "function" and a single whitespace before the "[native code]" sequence.',
            check: function ()
            {
                return /^.{19} \[native code\] \}/.test(Object);
            },
            includes: ['NO_IE_SRC'],
            excludes: ['FF_SAFARI_SRC']
        },
        FF_SAFARI_SRC:
        {
            description:
                'A string representation of native functions typically found in Firefox and ' +
                'Safari.\n' +
                'Remarkable traits are the lack of characters in the beginning of the string ' +
                'before "function" and a line feed with four whitespaces ("\\n    ") before the ' +
                '"[native code]" sequence.',
            check: function ()
            {
                return /^.{19}\n    \[native code\]\n\}/.test(Object);
            },
            includes: ['NO_IE_SRC'],
            excludes: ['V8_SRC']
        },
        IE_SRC:
        {
            description:
                'A string representation of native functions typical for Internet Explorer.\n' +
                'Remarkable traits are the presence of a line feed character ("\\n") in the ' +
                'beginning of the string before "function" and a line feed with four whitespaces ' +
                '("\\n    ") before the "[native code]" sequence.',
            check: function ()
            {
                return /^\nfunction Object\(\) \{\n    \[native code\]\n\}/.test(Object);
            },
            excludes: ['NO_IE_SRC']
        },
        GMT:
        {
            description:
                'Presence of the text "GMT" after the first 25 characters in the string returned ' +
                'by Date().\n' +
                'Although ECMAScript states that string representation of dates is ' +
                'implementation dependent, most engines align to the same format, making this ' +
                'feature available in all supported engines except Internet Explorer 9 and 10.',
            check: function ()
            {
                return /^.{25}GMT/.test(Date());
            }
        },
        SELF:
        {
            description:
                'Existence of the global object property self whose string representation starts '+
                'with "[object " and ends with "Window]"\n' +
                'This feature is not available in Node.js.',
            check: function ()
            {
                return /^\[object .*Window]$/.test(self);
            }
        },
        WINDOW:
        {
            description:
                'The property that the string representation of the global object evaluates to ' +
                '"[object Window]".\n' +
                'Not available in Android Browser versions prior to 4.4.2 and Node.js.',
            check: function ()
            {
                return (self + '') === '[object Window]';
            },
            includes: ['SELF'],
            excludes: ['DOMWINDOW']
        },
        DOMWINDOW:
        {
            description:
                'The property that the string representation of the global object evaluates to ' +
                '"[object DOMWindow]".\n' +
                'Only available in Android Browser versions prior to 4.4.2.',
            check: function ()
            {
                return (self + '') === '[object DOMWindow]';
            },
            includes: ['SELF'],
            excludes: ['WINDOW']
        },
        ATOB:
        {
            description:
                'Existence of the global object functions atob and btoa.\n' +
                'This feature is not available in Internet Explorer versions prior to 11 and ' +
                'Node.js.',
            check: function ()
            {
                return self != null && 'atob' in self && 'btoa' in self;
            }
        },
        NAME:
        {
            description:
                'Existence of the name property for functions.\n' +
                'This feature is not available in Internet Explorer.',
            check: function ()
            {
                return 'name' in Function();
            }
        },
        UNDEFINED:
        {
            description:
                'The property that Object.prototype.toString.call() evaluates to "[object ' +
                'Undefined]".\n' +
                'This behavior is defined by ECMAScript, but Android Browser prior to 4.1.2 does ' +
                'not comply with the specification and so this feature is not available in that ' +
                'browser.',
            check: function ()
            {
                return Object.prototype.toString.call() === '[object Undefined]';
            }
        },
        FILL:
        {
            description:
                'Existence of the native function Array.prototype.fill.\n' +
                'Currently only available in Firefox 31, Safari 7.1 and later versions.',
            check: function ()
            {
                return Array.prototype.fill;
            }
        },
        QUOTE:
        {
            description:
                'Existence of the native function String.prototype.quote.\n' +
                'Only available in Firefox.',
            check: function ()
            {
                return String.prototype.quote;
            }
        },
        ENTRIES:
        {
            description:
                'The property that the string representation of Array.prototype.entries() starts ' +
                'with "[object Array".\n' +
                'This feature is available in Firefox, Chrome 38, Opera 25, Safari 7.1 and later ' +
                'versions.',
            check: function ()
            {
                return Array.prototype.entries && /^\[object Array/.test([].entries());
            }
        },
        NO_SAFARI_ARRAY_ITERATOR:
        {
            description:
                'The property that the string representation of Array.prototype.entries() ' +
                'evaluates to "[object Array Iterator]".\n' +
                'Available in Firefox, Chrome 38, Opera 25 and later versions.',
            check: function ()
            {
                return Array.prototype.entries && ([].entries() + '')[22] === ']';
            },
            includes: ['ENTRIES'],
            excludes: ['SAFARI_ARRAY_ITERATOR']
        },
        SAFARI_ARRAY_ITERATOR:
        {
            description:
                'The property that the string representation of Array.prototype.entries() ' +
                'evaluates to "[object ArrayIterator]".\n' +
                'Available in Safari 7.1 and later versions.',
            check: function ()
            {
                return Array.prototype.entries && ([].entries() + '')[21] === ']';
            },
            includes: ['ENTRIES'],
            excludes: ['NO_SAFARI_ARRAY_ITERATOR']
        },
        LINK_DOUBLE_QUOTE_ESC:
        {
            description:
                'The property that double quote characters in the argument of ' +
                'String.prototype.link are escaped as "&quot;".\n' +
                'This feature is not available in Internet Explorer.',
            check: function ()
            {
                return String.prototype.link('"').substr(9, 6) === '&quot;';
            }
        },
        
        DEFAULT:
        {
            description: 'Minimun feature level, compatible with all supported engines.'
        },
        COMPACT:
        {
            description:
                'All new browsers\' features.\n' +
                'No support for Node.js and older browsers like Internet Explorer 10 or Android ' +
                'Browser 4.1.2.',
            includes: ['ATOB', 'GMT', 'SELF', 'UNDEFINED', 'WINDOW']
        },
        NO_IE:
        {
            description:
                'Features available in all supported engines except Internet Explorer.\n' +
                'Includes features used by JSfuck with the exception of "UNDEFINED", which is ' +
                'not available in older Android Browser versions.',
            includes: ['GMT', 'LINK_DOUBLE_QUOTE_ESC', 'NAME', 'NO_IE_SRC']
        },
        FF31:
        {
            description: 'Features available in Firefox 31 and later versions.',
            includes:
            [
                'ATOB',
                'ENTRIES',
                'FF_SAFARI_SRC',
                'FILL',
                'GMT',
                'NAME',
                'LINK_DOUBLE_QUOTE_ESC',
                'NO_SAFARI_ARRAY_ITERATOR',
                'NO_SAFARI_LF',
                'QUOTE',
                'SELF',
                'UNDEFINED',
                'WINDOW'
            ]
        },
        IE9:
        {
            description:
                'Features available in Internet Explorer 9.\n' +
                'Compatible with Internet Explorer 10, 11 and possibly later versions.',
            includes: ['IE_SRC', 'NO_SAFARI_LF', 'SELF', 'UNDEFINED', 'WINDOW']
        },
        IE10:
        {
            description:
                'Features available in Internet Explorer 10.\n' +
                'Compatible with Internet Explorer 11 and possibly later versions.',
            includes: ['ATOB', 'IE_SRC', 'NO_SAFARI_LF', 'SELF', 'UNDEFINED', 'WINDOW']
        },
        IE11:
        {
            description:
                'Features available in Internet Explorer 11.\n' +
                'Possibly compatible with later versions.',
            includes: ['ATOB', 'GMT', 'IE_SRC', 'NO_SAFARI_LF', 'SELF', 'UNDEFINED', 'WINDOW']
        },
        NODE:
        {
            description:
                'Features available in Node.js.\n' +
                'Also compatible with Chrome, Opera and Android Browser 4.1.2 or later.',
            includes:
            [
                'GMT',
                'LINK_DOUBLE_QUOTE_ESC',
                'NAME',
                'NO_SAFARI_LF',
                'UNDEFINED',
                'V8_SRC'
            ]
        },
    };
    
    function getFeatureMask(features)
    {
        var result = 0;
        if (features !== undefined)
        {
            if (!Array.isArray(features))
            {
                features = [features];
            }
            features.forEach(
                function (feature)
                {
                    feature += '';
                    if (!featureMaskMap.hasOwnProperty(feature))
                    {
                        throw new ReferenceError('Unknown feature ' + JSON.stringify(feature));
                    }
                    var mask = featureMaskMap[feature];
                    result |= mask;
                }
            );
        }
        return result;
    }
    
    var featureMaskMap = { };
    var availableFeatureMask;
    var incompatibleFeatureMasks = [];
    
    // Assign a bit mask to each checkable feature
    (
    function ()
    {
        function completeFeature(feature, ignoreExcludes)
        {
            var mask = featureMaskMap[feature];
            if (mask == null)
            {
                var info = FEATURE_INFOS[feature];
                if (info.check)
                {
                    mask = 1 << bitIndex++;
                    if (info.check())
                    {
                        availableFeatureMask |= mask;
                        autoIncludes.push(feature);
                    }
                }
                mask ^= 0;
                var includes = info.includes || (info.includes = []);
                includes.forEach(
                    function (include)
                    {
                        var includeMask = completeFeature(include);
                        mask |= includeMask;
                    }
                );
                var excludes = info.excludes || (info.excludes = []);
                if (ignoreExcludes !== true)
                {
                    excludes.forEach(
                        function (exclude)
                        {
                            var excludeMask = completeFeature(exclude, true);
                            var incompatibleMask = mask | excludeMask;
                            incompatibleFeatureMasks.push(incompatibleMask);
                        }
                    );
                }
                info.name = feature;
                var available = (mask & availableFeatureMask) === mask;
                info.available = available;
                featureMaskMap[feature] = mask;
            }
            return mask;
        }
        
        var bitIndex = 0;
        var features = Object.getOwnPropertyNames(FEATURE_INFOS);
        var autoIncludes = [];
        features.forEach(completeFeature);
        FEATURE_INFOS.AUTO =
        {
            description: 'All features available in the current engine.',
            includes: autoIncludes.sort(),
            excludes: [],
            name: 'AUTO',
            available: true
        };
        featureMaskMap.AUTO = availableFeatureMask;
    }
    )();
    
    // END: Features ///////////////////
    
    // BEGIN: Definers /////////////////
    
    function define(definition)
    {
        var result = createDefinitionEntry(definition, arguments, 1);
        return result;
    }
    
    var FB_EXPR_INFOS =
    [
        define({ expr: 'FILTER', shift: 6 }),
        define({ expr: 'FILL', shift: 4 }, 'FILL')
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
    
    var FH_PADDING_INFOS =
    [
        define({ paddings: FH_PADDINGS, shift: 0 }),
        define({ paddings: R_PADDINGS, shift: 0 }, 'NO_IE_SRC'),
        define({ paddings: R_PADDINGS, shift: 1 }, 'IE_SRC')
    ];
    
    var LEVEL_STRING    = 1;
    var LEVEL_OBJECT    = 0;
    var LEVEL_NUMERIC   = -1;
    var LEVEL_UNDEFINED = -2;
    
    var FB_PADDING_INFOS =
    [
        define({ paddings: FB_PADDINGS, shift: 0 }),
        define({ paddings: FB_NO_IE_PADDINGS, shift: 0 }, 'NO_IE_SRC'),
        define({ paddings: R_PADDINGS, shift: 0 }, 'V8_SRC'),
        define({ paddings: R_PADDINGS, shift: 4 }, 'FF_SAFARI_SRC'),
        define({ paddings: R_PADDINGS, shift: 5 }, 'IE_SRC')
    ];
    
    function createCharAtDefinition(expr, index, entries, paddingInfos)
    {
        function definition()
        {
            var result = createCharAtSolution.call(this, expr, index, entries, paddingInfos);
            return result;
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
        var result = createSolution(this.replaceExpr(fullExpr), LEVEL_STRING, false);
        return result;
    }
    
    function createDefinitionEntry(definition, featureArgs, startIndex)
    {
        var features = Array.prototype.slice.call(featureArgs, startIndex);
        var featureMask = getFeatureMask(features);
        var entry = { definition: definition, featureMask: featureMask };
        return entry;
    }
    
    function createSolution(replacement, level, outerPlus)
    {
        var result = Object(replacement);
        result.level = level;
        result.outerPlus = outerPlus;
        return result;
    }
    
    function defineCharacterByAtob(character)
    {
        var charCode = character.charCodeAt(0);
        var result =
            define(
                function ()
                {
                    var result =
                        createSolution(this.encodeCharacterByAtob(charCode), LEVEL_STRING, false);
                    return result;
                },
                'ATOB'
            );
        return result;
    }
    
    function defineFBCharAt(offset)
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
                        {
                            padding: '[RP_1_NO] + FBEP_9_U',
                            indexer: index / 10 + 1 + ' + FH_SHIFT'
                        }
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
            var result =
                createCharAtSolution.call(this, expr, index, paddingEntries, FB_PADDING_INFOS);
            return result;
        }
        
        var result = define(definition);
        return result;
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
        var result = createDefinitionEntry(definition, arguments, 2);
        return result;
    }
    
    function noProto(object)
    {
        var result = Object.create(null);
        for (var name in object)
        {
            result[name] = object[name];
        }
        return result;
    }
    
    // END: Definers ///////////////////
    
    // BEGIN: Encoder //////////////////
    
    // Definition syntax has been changed to match JavaScript more closely. The main differences
    // from JSFuck are:
    // * Support for constant literals like "ANY_FUNCTION", "FHP_3_NO", etc. improves readability
    //   and simplifies maintenance.
    // * 10 evaluates to a number, while "10" evaluates to a string. This can make a difference in
    //   certain expressions and may affect the mapping length.
    // * String literals must be always double quoted.
    
    var CHARACTERS = noProto
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
            define('(101)[TO_STRING]("21")[1]'),
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
            define('(20)[TO_STRING]("21")'),
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
            define('(211)[TO_STRING]("31")[1]'),
            defineCharacterByAtob('p')
        ],
        'q':
        [
            define('(212)[TO_STRING]("31")[1]'),
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
            define('(32)[TO_STRING]("33")'),
            define('(self + [])["slice"]("-2")[0]', 'SELF'),
            define('(self + [])["13"]', 'WINDOW'),
            define('(RP_4_N + self)["20"]', 'DOMWINDOW'),
            defineCharacterByAtob('w')
        ],
        'x':
        [
            define('(101)[TO_STRING]("34")[1]'),
            defineCharacterByAtob('x')
        ],
        'y':            '(RP_3_NO + [Infinity])["10"]',
        'z':
        [
            define('(35)[TO_STRING]("36")'),
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
            defineCharacterByAtob('C')
        ],
        'D':
        [
            define('escape("]")[2]'),
            define('btoa("00")[1]', 'ATOB')
        ],
        'E':
        [
            defineFHCharAt('RegExp', 12),
            define('btoa("01")[2]', 'ATOB')
        ],
        'F':
        [
            defineFHCharAt('Function', 9)
        ],
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
        'O':            '(RP_3_NO + PLAIN_OBJECT)["11"]',
        'P':
        [
            define('btoa(""["italics"]())[0]', 'ATOB'),
            defineCharacterByAtob('P')
        ],
        'Q':
        [
            define('btoa(1)[1]', 'ATOB')
        ],
        'R':
        [
            defineFHCharAt('RegExp', 9),
            define('btoa("0true")[2]', 'ATOB')
        ],
        'S':
        [
            defineFHCharAt('String', 9)
        ],
        'T':
        [
            define('(RP_3_NO + Date())["30"]', 'GMT'),
            define('btoa(NaN)[0]', 'ATOB')
        ],
        'U':
        [
            define('(RP_3_NO + PLAIN_OBJECT[TO_STRING]["call"]())["11"]', 'UNDEFINED'),
            define('(RP_3_NO + ARRAY_ITERATOR[TO_STRING]["call"]())["11"]', 'UNDEFINED', 'ENTRIES'),
            define('(RP_4_N + btoa(false))["10"]', 'ATOB')
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
            define('btoa(false)[0]', 'ATOB')
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
    //  '!':    ,
        '"':            '""["fontcolor"]()["12"]',
    //  '#':    ,
    //  '$':    ,
        '%':
        [
            define('escape(FILTER)["20"]'),
            define('escape(false + FILL)["20"]', 'NO_IE_SRC', 'FILL'),
            define('escape(ANY_FUNCTION)[0]', 'IE_SRC'),
            defineCharacterByAtob('%')
        ],
        '&':
        [
            define('""["link"]("0\\"")["10"]', 'LINK_DOUBLE_QUOTE_ESC'),
            defineCharacterByAtob('&')
        ],
    //  '\'':   ,
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
    //  '*':    ,
        '+':            '(+"1e100" + [])[2]',
        ',':            '([]["slice"]["call"]("false") + [])[1]',
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
            define('""["link"]("0false\\"")["20"]', 'LINK_DOUBLE_QUOTE_ESC'),
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
    //  '@':    ,
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
    //  '_':    ,
    //  '`':    ,
        '{':
        [
            defineFHCharAt('FILTER', 18),
            defineFHCharAt('FILL', 16, 'FILL')
        ],
    //  '|':    ,
        '}':
        [
            defineFBCharAt(28),
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
    });
    
    var CONSTANTS = noProto
    ({
        // JavaScript globals
        
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
        
        ANY_FUNCTION:
        [
            define('FILTER'),
            define('FILL', 'FILL')
        ],
        ARRAY_ITERATOR:
        [
            define('[]["entries"]()', 'ENTRIES')
        ],
        CONSTRUCTOR:    '"constructor"',
        FILL:
        [
            define('[]["fill"]', 'FILL')
        ],
        FILTER:         '[]["filter"]',
        PLAIN_OBJECT:   'Function("return{}")()',
        STRING:
        [
            define('"String"'),
            define('String["name"]', 'NAME')
        ],
        TO_STRING:
        [
            define('"toString"'),
            define('"to" + String["name"]', 'NAME')
        ],
        
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
            function (character)
            {
                var charCode = character.charCodeAt(0);
                var encoder =
                    charCode < 0x100 ? encodeCharacterByUnescape8 : encodeCharacterByUnescape16;
                var result = createSolution(encoder.call(this, charCode), LEVEL_STRING, false);
                return result;
            }
        ),
        define(
            function (character)
            {
                var charCode = character.charCodeAt(0);
                var encoder = charCode < 0x100 ? encodeCharacterByAtob : encodeCharacterByEval;
                var result = createSolution(encoder.call(this, charCode), LEVEL_STRING, false);
                return result;
            },
            'ATOB'
        )
    ];
    
    var SIMPLE = noProto
    ({
        'false':        '![]',
        'true':         '!![]',
        'undefined':    '[][[]]',
        'NaN':          '+[![]]',
        'Infinity':     '+"1e1000"',
    });
    
    var quoteCharacter = JSON.stringify;
    var simplePattern;
    
    function createDigitDefinition(digit)
    {
        function definition()
        {
            var result = createSolution(encodeDigit(digit), LEVEL_NUMERIC);
            return result;
        }
        
        return definition;
    }
        
    function createReindexMap(count)
    {
        var range = [];
        for (var index = 0; index < count; ++index)
        {
            range[index] = index;
        }
        range.sort(
            function (number1, number2)
            {
                var result = getNumberLength(number1) - getNumberLength(number2);
                return result;
            }
        );
        return range;
    }
    
    function encodeCharacterByAtob(charCode)
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
        var postfix1 = '(' + this.replaceString(param1) + ')';
        if (param1.length > 2)
        {
            postfix1 += this.replaceExpr('[0]');
        }
        var length1 = postfix1.length;
        
        var param2Left = BASE64_ALPHABET_LO_4[charCode >> 4];
        var param2 = param2Left + BASE64_ALPHABET_HI_4[charCode & 0x0f];
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
    
    function encodeCharacterByEval(charCode)
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
    
    function encodeCharacterByUnescape16(charCode)
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
    
    function encodeCharacterByUnescape8(charCode)
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
    
    function expandEntries(entries)
    {
        if (!Array.isArray(entries))
        {
            entries = [define(entries)];
        }
        return entries;
    }
    
    function getNumberLength(number)
    {
        var DIGIT_LENGTHS = [3, 5, 9, 14, 19, 24, 29, 34, 39, 44];
        
        var string = number + '';
        var length = 3 * (string.length - 1);
        Array.prototype.forEach.call(string, function (digit) { length += DIGIT_LENGTHS[digit]; });
        return length;
    }
    
    // Determine whether the specified solution contains a plus sign out of brackets not preceded by
    // an exclamation mark.
    function hasOuterPlus(solution)
    {
        if (solution.outerPlus != null)
        {
            return solution.outerPlus;
        }
        var unclosed = 0;
        var outerPlus =
            solution.match(/!\+|./g).some(
                function (match)
                {
                    switch (match)
                    {
                    case '+':
                        return !unclosed;
                    case '(':
                    case '[':
                        ++unclosed;
                        break;
                    case ')':
                    case ']':
                        --unclosed;
                        break;
                    }
                    return false;
                }
            );
        solution.outerPlus = outerPlus;
        return outerPlus;
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
    
    function replaceToken(wholeMatch, number, quotedString, space, literal, offset, expr)
    {
        var replacement;
        if (number)
        {
            replacement = encodeDigit(number[0]) + '';
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
            this.throwSyntaxError('Unexpected character ' + quoteCharacter(wholeMatch));
        }
        return replacement;
    }
    
    function resolveSimple(simple)
    {
        var solution = SIMPLE[simple];
        if (!(solution instanceof Object))
        {
            var encoder = new Encoder();
            encoder.callResolver(
                simple,
                function ()
                {
                    SIMPLE[simple] = solution = createSolution(encoder.replaceExpr(solution));
                }
            );
        }
        return solution;
    }
    
    function Encoder(featureMask)
    {
        this.featureMask = featureMask;
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
        
        constantDefinitions: CONSTANTS,
        
        encode: function (input, wrapWithEval)
        {
            var MIN_DICT_ENCODABLE_LENGTH = 3;
            
            var output;
            if (input.length >= MIN_DICT_ENCODABLE_LENGTH)
            {
                output = this.encodeByDict(input);
            }
            output = this.encodeSimple(input, output && output.length) || output;
            if (wrapWithEval)
            {
                output = this.resolveConstant('Function') + '(' + output + ')()';
            }
            return output;
        },
        
        encodeByCharCodes: function (input, long)
        {
            var output;
            var charCodes =
                this.replaceNumberArray(
                    Array.prototype.map.call(input, function (char) { return char.charCodeAt(); })
                );
            if (long)
            {
                output =
                    charCodes + this.replace('["map"]') + '(' +
                    this.resolveConstant('Function') + '(' + this.replaceString('return ') +
                    '+' + this.resolveConstant('STRING') + '+' +
                    this.replaceString('.fromCharCode(arguments[0])') + '))' +
                    this.replace('["join"]([])');
            }
            else
            {
                output =
                    this.resolveConstant('Function') + '(' + this.replaceString('return ') +
                    '+' + this.resolveConstant('STRING') + '+' +
                    this.replaceString('.fromCharCode(') + '+' + charCodes + '+' +
                    this.replaceString(')') + ')()';
            }
            return output;
        },
        
        encodeByDict: function (input)
        {
            var freqs = Object.create(null);
            Array.prototype.forEach.call(
                input,
                function (char)
                {
                    ++(freqs[char] || (freqs[char] = { char: char, count: 0 })).count;
                }
            );
            var freqList = Object.keys(freqs).map(function (char) { return freqs[char]; });
            var dictChars = [];
            var reindexMap = createReindexMap(freqList.length);
            freqList.sort(function (freq1, freq2) { return freq2.count - freq1.count; })
                .forEach(
                    function (freq, index)
                    {
                        var reindex = reindexMap[index];
                        freq.index = reindex;
                        dictChars[reindex] = freq.char;
                    }
                );
            var output =
                this.replaceNumberArray(
                    Array.prototype.map.call(input, function (char) { return freqs[char].index; })
                ) + this.replace('["map"]') + '(' + this.replace('""["charAt"]["bind"]') +
                '(' + this.encodeSimple(dictChars.join('')) + '))' +
                this.replace('["join"]([])');
            return output;
        },
        
        encodeCharacterByAtob: function (charCode)
        {
            var result = encodeCharacterByAtob.call(this, charCode);
            return result;
        },
        
        encodePlain: function (input, maxLength)
        {
            var output = this.replaceString(input, false, maxLength);
            return output;
        },
        
        encodeSimple: function (input, maxLength)
        {
            var MAX_DECODABLE_ARGS = 65533;
            var MIN_SUBENCODABLE_LENGTH = 3;
            
            var output;
            var inputLength = input.length;
            if (inputLength >= MIN_SUBENCODABLE_LENGTH)
            {
                var outputByCharCodes =
                    this.encodeByCharCodes(input, inputLength > MAX_DECODABLE_ARGS);
                var outputByCharCodesLength = outputByCharCodes.length;
                if (!(outputByCharCodesLength > maxLength))
                {
                    output = outputByCharCodes;
                    maxLength = outputByCharCodesLength;
                }
            }
            output = this.encodePlain(input, maxLength) || output;
            if (output && !(output.length > maxLength))
            {
                return output;
            }
        },
        
        findBestDefinition: function (entries)
        {
            for (var index = entries.length; index-- > 0;)
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
            for (var index = entries.length; index-- > 0;)
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
            var result = charCode.toString(16);
            if (!this.hasFeatures(featureMaskMap.ENTRIES))
            {
                result = result.replace(/b/g, 'B');
            }
            result = Array(length - result.length + 1).join(0) + result.replace(/fa?$/, 'false');
            return result;
        },
        
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
        
        replaceNumberArray: function (array)
        {
            var result =
                this.replaceString(array.join(false), true) + this.replace('["split"](false)');
            return result;
        },
        
        replaceString: function (string, strongBound, maxLength)
        {
            var MAX_CONCAT_TOKENS = 4096;
            
            var tokens = [];
            var fullLevel;
            var fullLength;
            if (string)
            {
                if (!simplePattern)
                {
                    simplePattern = Object.keys(SIMPLE).join('|') + '|[^]';
                }
                var regExp = new RegExp(simplePattern, 'g');
                var match;
                fullLength = -1;
                while (match = regExp.exec(string))
                {
                    var token = match[0];
                    var solution;
                    var level;
                    if (token in SIMPLE)
                    {
                        solution = resolveSimple(token);
                        level = solution.level;
                        if (level === undefined)
                        {
                            var value = eval(solution + '');
                            solution.level =
                                level =
                                value === undefined ? LEVEL_UNDEFINED : LEVEL_NUMERIC;
                        }
                    }
                    else
                    {
                        solution = this.resolveCharacter(token);
                        level = solution.level;
                    }
                    if (
                        tokens.length &&
                        (fullLevel < LEVEL_OBJECT && level < LEVEL_OBJECT ||
                        hasOuterPlus(solution)))
                    {
                        if (level > LEVEL_UNDEFINED)
                        {
                            solution = '[' + solution + ']';
                        }
                        else if (fullLevel > LEVEL_UNDEFINED)
                        {
                            tokens = ['[' + tokens + ']'];
                            fullLength += 2;
                        }
                        else
                        {
                            tokens.push('[]');
                            fullLength += 3;
                        }
                    }
                    fullLevel = tokens.length ? LEVEL_STRING : level;
                    tokens.push(solution);
                    fullLength += solution.length + 1;
                    if (fullLength > maxLength)
                    {
                        return;
                    }
                }
            }
            else
            {
                fullLevel = LEVEL_OBJECT;
                tokens = ['[]'];
                fullLength = 2;
            }
            if (fullLevel < LEVEL_STRING)
            {
                tokens.push('[]');
                fullLength += 3;
            }
            var tokenCount = tokens.length;
            fullLength += (tokenCount - 2) / (MAX_CONCAT_TOKENS - 1) << 1;
            var enclosure = tokenCount > 1 && strongBound;
            if (enclosure)
            {
                fullLength += 2;
            }
            if (fullLength > maxLength)
            {
                return;
            }
            while (tokens.length > MAX_CONCAT_TOKENS)
            {
                tokens.push('(' + tokens.splice(-MAX_CONCAT_TOKENS).join('+') + ')');
            }
            var result = tokens.join('+');
            if (enclosure)
            {
                result = '(' + result + ')';
            }
            return result;
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
                solution = createSolution(replacement);
            }
            return solution;
        },
        
        resolveCharacter: function (character)
        {
            var solution = this.characterCache[character];
            if (solution === undefined)
            {
                this.callResolver(
                    quoteCharacter(character),
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
    
    // Create definitions for digits
    (function ()
    {
        for (var number = 0; number < 10; ++number)
        {
            var digit = number + '';
            CHARACTERS[digit] = createDigitDefinition(digit);
        }
    }
    )();
    
    // END: Encoder ////////////////////
    
    // BEGIN: JScrewIt /////////////////
    
    function areFeaturesAvailable(features)
    {
        var featureMask = getFeatureMask(features);
        return (featureMask & availableFeatureMask) === featureMask;
    }
    
    function areFeaturesCompatible(features)
    {
        var featureMask = getFeatureMask(features);
        var result = isFeatureMaskCompatible(featureMask);
        return result;
    }
    
    function encode(input, wrapWithEval, features)
    {
        var encoder = getEncoder(features);
        var output = encoder.encode(input + '', wrapWithEval);
        return output;
    }
    
    function getEncoder(features)
    {
        var featureMask = getValidFeatureMask(features);
        var encoder = encoders[featureMask];
        if (!encoder)
        {
            encoders[featureMask] = encoder = new Encoder(featureMask);
        }
        return encoder;
    }
    
    function getValidFeatureMask(features)
    {
        var featureMask = getFeatureMask(features);
        if (!isFeatureMaskCompatible(featureMask))
        {
            throw new ReferenceError('Incompatible features');
        }
        return featureMask;
    }
    
    function isFeatureMaskCompatible(featureMask)
    {
        var result =
            incompatibleFeatureMasks.every(
                function (incompatibleFeatureMask)
                {
                    var result =
                        (incompatibleFeatureMask & featureMask) !== incompatibleFeatureMask;
                    return result;
                }
            );
        return result;
    }
    
    function setUp(self)
    {
        if (self != null)
        {
            self.JSFuck = self.JScrewIt = JScrewIt;
        }
    }
    
    var encoders = { };
    
    var JScrewIt =
    {
        areFeaturesAvailable:   areFeaturesAvailable,
        areFeaturesCompatible:  areFeaturesCompatible,
        encode:                 encode,
        FEATURE_INFOS:          FEATURE_INFOS,
    };
    
    setUp(self);
    
    if (typeof module !== 'undefined')
    {
        module.exports = JScrewIt;
    }
    
    // END: JScrewIt ///////////////////
    
    // BEGIN: Debug only ///////////////
    
    if (typeof DEBUG === 'undefined' || DEBUG)
    {
        (function ()
        {
            function createEncoder(features)
            {
                var featureMask = getValidFeatureMask(features);
                var encoder = new Encoder(featureMask);
                return encoder;
            }
            
            function defineConstant(encoder, constant, definition)
            {
                constant += '';
                if (!/^[$A-Z_a-z][$0-9A-Z_a-z]*$/.test(constant))
                {
                    throw new SyntaxError('Invalid identifier ' + JSON.stringify(constant));
                }
                if (!(encoder.hasOwnProperty('constantDefinitions')))
                {
                    encoder.constantDefinitions = Object.create(CONSTANTS);
                }
                encoder.constantDefinitions[constant] = definition + '';
            }
            
            function getCharacterEntries(character)
            {
                var result = getEntries(CHARACTERS[character]);
                return result;
            }
            
            function getConstantEntries(constant)
            {
                var result = getEntries(CONSTANTS[constant]);
                return result;
            }
            
            function getEntries(entries)
            {
                if (entries != null)
                {
                    var result = expandEntries(entries);
                    return result;
                }
            }
            
            function getEntryFeatures(entry)
            {
                var result = [];
                var entryMask = entry.featureMask;
                Object.getOwnPropertyNames(featureMaskMap).forEach(
                    function (feature)
                    {
                        var featureMask = featureMaskMap[feature];
                        if ((featureMask & entryMask) === featureMask)
                        {
                            var featureInfo = FEATURE_INFOS[feature];
                            if (featureInfo.check)
                            {
                                result.push(feature);
                            }
                        }
                    }
                );
                return result;
            }
            
            JScrewIt.debug =
            {
                createEncoder:          createEncoder,
                defineConstant:         defineConstant,
                getCharacterEntries:    getCharacterEntries,
                getConstantEntries:     getConstantEntries,
                getEntryFeatures:       getEntryFeatures,
                hasOuterPlus:           hasOuterPlus,
                setUp:                  setUp
            };
        })();
    }
    
    // END: Debug only /////////////////

})(typeof self === 'undefined' ? null : self);
