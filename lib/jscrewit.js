//! JScrewIt 1.6.0 – http://jscrew.it
(function ()
{

var FEATURE_INFOS;

var availableFeatureMask;
var featuresFromMask;
var getFeatureMask;
var incompatibleFeatureMasks;

(function ()
{
    'use strict';
    
    function completeFeature(feature, ignoreExcludes)
    {
        var mask = featureMaskMap[feature];
        if (mask == null)
        {
            var info = FEATURE_INFOS[feature];
            if (typeof info === 'string')
            {
                mask = completeFeature(info, ignoreExcludes);
                FEATURE_INFOS[feature] = FEATURE_INFOS[info];
            }
            else
            {
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
            }
            featureMaskMap[feature] = mask;
        }
        return mask;
    }
    
    var bitIndex = 0;
    var featureMaskMap = Object.create(null);
    
    FEATURE_INFOS =
    {
        ARRAY_ITERATOR:
        {
            description:
                'The property that the string representation of Array.prototype.entries() starts ' +
                'with "[object Array" and ends with "]" at index 21 or 22.\n' +
                'This feature is available in Firefox and in Chrome 38, Opera 25, Safari 7.1, ' +
                'Node.js 0.12 and later versions.',
            check: function ()
            {
                return Array.prototype.entries && /^\[object Array.{8,9}]$/.test([].entries());
            },
            includes: ['ENTRIES']
        },
        ATOB:
        {
            description:
                'Existence of the global object functions atob and btoa.\n' +
                'This feature is not available in Internet Explorer versions prior to 11 and ' +
                'Node.js.',
            check: function ()
            {
                return typeof atob === 'function' && typeof btoa === 'function';
            }
        },
        CAPITAL_HTML:
        {
            description:
                'The property that the various string methods returning HTML code such as ' +
                'String.prototype.big or String.prototype.link have both the tag name and ' +
                'attributes written in capital letters.\n' +
                'This feature is only available in Internet Explorer.',
            check: function ()
            {
                var available =
                    ''.big()            === '<BIG></BIG>'               &&
                    ''.fontcolor('')    === '<FONT COLOR=""></FONT>'    &&
                    ''.fontsize('')     === '<FONT SIZE=""></FONT>'     &&
                    ''.link('')         === '<A HREF=""></A>'           &&
                    ''.small()          === '<SMALL></SMALL>'           &&
                    ''.strike()         === '<STRIKE></STRIKE>'         &&
                    ''.sub()            === '<SUB></SUB>'               &&
                    ''.sup()            === '<SUP></SUP>';
                return available;
            }
        },
        DOMWINDOW:
        {
            description:
                'Existence of the global object property self having the string representation ' +
                '"[object DOMWindow]".\n' +
                'Only available in Android Browser versions prior to 4.4.2.',
            check: function ()
            {
                // self + '' throws an error inside a web worker in Safari 8.
                return typeof self !== 'undefined' && self.toString() === '[object DOMWindow]';
            },
            includes: ['SELF'],
            excludes: ['WINDOW']
        },
        DOUBLE_QUOTE_ESC_HTML:
        {
            description:
                'The property that double quote characters in the argument of ' +
                'String.prototype.fontcolor are escaped as "&quot;".\n' +
                'This feature is not available in Internet Explorer.',
            check: function ()
            {
                var available = ''.fontcolor('"').substr(13, 6) === '&quot;';
                return available;
            }
        },
        ENTRIES:
        {
            description:
                'The property that the string representation of Array.prototype.entries() starts ' +
                'with "[object ".\n' +
                'This feature is available in Firefox, in Microsoft Edge and in Chrome 38, Opera ' +
                '25, Safari 7.1, Node.js 0.12 and later versions.',
            check: function ()
            {
                return Array.prototype.entries && /^\[object /.test([].entries());
            }
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
        FILL:
        {
            description:
                'Existence of the native function Array.prototype.fill.\n' +
                'Available in Firefox 31, Safari 7.1 and later versions and in Microsoft Edge.',
            check: function ()
            {
                return Array.prototype.fill;
            }
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
        NO_SAFARI_ARRAY_ITERATOR:
        {
            description:
                'The property that the string representation of Array.prototype.entries() ' +
                'evaluates to "[object Array Iterator]".\n' +
                'Available in Firefox, Chrome 38, Opera 25, Node.js 0.12 and later versions.',
            check: function ()
            {
                return Array.prototype.entries && [].entries() + '' === '[object Array Iterator]';
            },
            includes: ['ARRAY_ITERATOR'],
            excludes: ['SAFARI_ARRAY_ITERATOR']
        },
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
        QUOTE:
        {
            description:
                'Existence of the native function String.prototype.quote.\n' +
                'This feature is deprecated and not available in any engine.\n' +
                'Native support only exists in Firefox versions prior to 37.',
            check: function ()
            {
                return false;
            }
        },
        SAFARI_ARRAY_ITERATOR:
        {
            description:
                'The property that the string representation of Array.prototype.entries() ' +
                'evaluates to "[object ArrayIterator]".\n' +
                'Available in Safari 7.1 and later versions.',
            check: function ()
            {
                return Array.prototype.entries && [].entries() + '' === '[object ArrayIterator]';
            },
            includes: ['ARRAY_ITERATOR'],
            excludes: ['NO_SAFARI_ARRAY_ITERATOR']
        },
        SELF:
        {
            description:
                'Existence of the global object property self whose string representation starts ' +
                'with "[object " and ends with "Window]".\n' +
                'This feature is not available in Node.js. It is also not available inside web ' +
                'workers.',
            check: function ()
            {
                return typeof self !== 'undefined' && /^\[object .*Window]$/.test(self);
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
        V8_SRC:
        {
            description:
                'A string representation of native functions typically found in the V8 ' +
                'JavaScript engine.\n' +
                'V8 is used in Chrome, Opera, Android Browser and Node.js. Microsoft Edge, ' +
                'although not using V8, also has this feature available.\n' +
                'Remarkable traits are the lack of characters in the beginning of the string ' +
                'before "function" and a single whitespace before the "[native code]" sequence.',
            check: function ()
            {
                return /^.{19} \[native code\] \}/.test(Object);
            },
            includes: ['NO_IE_SRC'],
            excludes: ['FF_SAFARI_SRC']
        },
        WINDOW:
        {
            description:
                'Existence of the global object property self having the string representation ' +
                '"[object Window]".\n' +
                'This feature is not available in Android Browser versions prior to 4.4.2 and ' +
                'Node.js. It is also not available inside web workers.',
            check: function ()
            {
                // self + '' throws an error inside a web worker in Safari 8.
                return typeof self !== 'undefined' && self.toString() === '[object Window]';
            },
            includes: ['SELF'],
            excludes: ['DOMWINDOW']
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
            includes: ['ATOB', 'GMT', 'UNDEFINED', 'WINDOW']
        },
        NO_IE:
        {
            description:
                'Features available in all supported engines except Internet Explorer.\n' +
                'Includes features used by JSFuck with the exception of "UNDEFINED", which is ' +
                'not available in older Android Browser versions.',
            includes: ['DOUBLE_QUOTE_ESC_HTML', 'GMT', 'NAME', 'NO_IE_SRC']
        },
        ANDRO400:
        {
            description: 'Features available in Android Browser 4.0 to 4.3.1.',
            includes:
            [
                'ATOB',
                'DOMWINDOW',
                'DOUBLE_QUOTE_ESC_HTML',
                'GMT',
                'NAME',
                'NO_SAFARI_LF',
                'V8_SRC'
            ]
        },
        ANDRO412:
        {
            description: 'Features available in Android Browser 4.1.2 to 4.3.1.',
            includes:
            [
                'ATOB',
                'DOMWINDOW',
                'DOUBLE_QUOTE_ESC_HTML',
                'GMT',
                'NAME',
                'NO_SAFARI_LF',
                'UNDEFINED',
                'V8_SRC'
            ]
        },
        ANDRO442:
        {
            description: 'Features available in Android Browser 4.4.2 or later.',
            includes:
            [
                'ATOB',
                'DOUBLE_QUOTE_ESC_HTML',
                'GMT',
                'NAME',
                'NO_SAFARI_LF',
                'UNDEFINED',
                'V8_SRC',
                'WINDOW'
            ]
        },
        CHROME35:
        {
            description: 'Features available in Chrome 35 and Opera 22 or later.',
            includes:
            [
                'ATOB',
                'DOUBLE_QUOTE_ESC_HTML',
                'GMT',
                'NAME',
                'NO_SAFARI_LF',
                'UNDEFINED',
                'V8_SRC',
                'WINDOW'
            ]
        },
        CHROME38:
        {
            description: 'Features available in Chrome 38 and Opera 25 or later.',
            includes:
            [
                'ATOB',
                'DOUBLE_QUOTE_ESC_HTML',
                'GMT',
                'NAME',
                'NO_SAFARI_ARRAY_ITERATOR',
                'NO_SAFARI_LF',
                'UNDEFINED',
                'V8_SRC',
                'WINDOW'
            ]
        },
        EDGE:
        {
            description: 'Features available in Microsoft Edge.',
            includes:
            [
                'ATOB',
                'DOUBLE_QUOTE_ESC_HTML',
                'ENTRIES',
                'FILL',
                'GMT',
                'NAME',
                'NO_SAFARI_LF',
                'UNDEFINED',
                'V8_SRC',
                'WINDOW'
            ]
        },
        FF30:
        {
            description: 'Features available in Firefox 30 or later.',
            includes:
            [
                'ATOB',
                'DOUBLE_QUOTE_ESC_HTML',
                'FF_SAFARI_SRC',
                'GMT',
                'NAME',
                'NO_SAFARI_ARRAY_ITERATOR',
                'NO_SAFARI_LF',
                'UNDEFINED',
                'WINDOW'
            ]
        },
        FF31:
        {
            description: 'Features available in Firefox 31 or later.',
            includes:
            [
                'ATOB',
                'DOUBLE_QUOTE_ESC_HTML',
                'FF_SAFARI_SRC',
                'FILL',
                'GMT',
                'NAME',
                'NO_SAFARI_ARRAY_ITERATOR',
                'NO_SAFARI_LF',
                'UNDEFINED',
                'WINDOW'
            ]
        },
        IE9:
        {
            description: 'Features available in Internet Explorer 9 or later.',
            includes: ['CAPITAL_HTML', 'IE_SRC', 'NO_SAFARI_LF', 'UNDEFINED', 'WINDOW']
        },
        IE10:
        {
            description: 'Features available in Internet Explorer 10 or later.',
            includes: ['ATOB', 'CAPITAL_HTML', 'IE_SRC', 'NO_SAFARI_LF', 'UNDEFINED', 'WINDOW']
        },
        IE11:
        {
            description: 'Features available in Internet Explorer 11.',
            includes:
            [
                'ATOB',
                'CAPITAL_HTML',
                'GMT',
                'IE_SRC',
                'NO_SAFARI_LF',
                'UNDEFINED',
                'WINDOW'
            ]
        },
        NODE: 'NODE010',
        NODE010:
        {
            description:
                'Features available in Node.js 0.10.26 or later.\n' +
                'Also compatible with Chrome, Opera and Android Browser 4.1.2 or later.',
            includes:
            [
                'DOUBLE_QUOTE_ESC_HTML',
                'GMT',
                'NAME',
                'NO_SAFARI_LF',
                'UNDEFINED',
                'V8_SRC'
            ]
        },
        NODE012:
        {
            description:
                'Features available in Node.js 0.12.\n' +
                'Also compatible with Chrome 38, Opera 25 and Android Browser 4.1.2 and later ' +
                'versions.',
            includes:
            [
                'DOUBLE_QUOTE_ESC_HTML',
                'GMT',
                'NAME',
                'NO_SAFARI_ARRAY_ITERATOR',
                'NO_SAFARI_LF',
                'UNDEFINED',
                'V8_SRC'
            ]
        },
        SAFARI70:
        {
            description: 'Features available in Safari 7.0.',
            includes:
            [
                'ATOB',
                'DOUBLE_QUOTE_ESC_HTML',
                'FF_SAFARI_SRC',
                'GMT',
                'NAME',
                'UNDEFINED',
                'WINDOW'
            ]
        },
        SAFARI71:
        {
            description: 'Features available in Safari 7.1 or later.',
            includes:
            [
                'ATOB',
                'DOUBLE_QUOTE_ESC_HTML',
                'FF_SAFARI_SRC',
                'FILL',
                'GMT',
                'NAME',
                'SAFARI_ARRAY_ITERATOR',
                'UNDEFINED',
                'WINDOW'
            ]
        }
    };
    
    getFeatureMask =
        function (features)
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
                        var mask = featureMaskMap[feature];
                        if (mask == null)
                        {
                            throw new ReferenceError('Unknown feature ' + JSON.stringify(feature));
                        }
                        result |= mask;
                    }
                );
            }
            return result;
        };
    
    featuresFromMask =
        function (mask)
        {
            var result = [];
            for (var feature in featureMaskMap)
            {
                var featureMask = featureMaskMap[feature];
                if ((featureMask & mask) === featureMask)
                {
                    var featureInfo = FEATURE_INFOS[feature];
                    if (featureInfo.check)
                    {
                        result.push(feature);
                    }
                }
            }
            result.sort();
            return result;
        };
    
    incompatibleFeatureMasks = [];
    
    // Assign a bit mask to each checkable feature
    
    var features = Object.keys(FEATURE_INFOS);
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

})();

var createDefinitionEntry;
var define;
var noProto;

(function ()
{
    'use strict';
    
    createDefinitionEntry =
        function (definition, featureArgs, startIndex)
        {
            var features = Array.prototype.slice.call(featureArgs, startIndex);
            var featureMask = getFeatureMask(features);
            var entry = { definition: definition, featureMask: featureMask };
            return entry;
        };
    
    define =
        function (definition)
        {
            var entry = createDefinitionEntry(definition, arguments, 1);
            return entry;
        };
    
    noProto =
        function (obj)
        {
            var result = Object.create(null);
            Object.getOwnPropertyNames(obj).forEach(
                function (name)
                {
                    result[name] = obj[name];
                }
            );
            return result;
        };

})();

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
            define('(RP_3_NO + ARRAY_ITERATOR)[11]', 'ARRAY_ITERATOR')
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
            define(
                '(ARRAY_ITERATOR + [])[2 + [true + !!(ARRAY_ITERATOR + [])["22"]]]',
                'ARRAY_ITERATOR'
            ),
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

var ScrewBuffer;

var getAppendLength;
var hasOuterPlus;

/* global LEVEL_OBJECT, LEVEL_STRING, LEVEL_UNDEFINED */

(function ()
{
    'use strict';
    
    // The solution parameter must already have the outerPlus property set.
    function appendSolution(str, solution)
    {
        if (solution.outerPlus)
        {
            str += '+(' + solution + ')';
        }
        else
        {
            str += '+' + solution;
        }
        return str;
    }
    
    ScrewBuffer =
        function (strongBound, groupThreshold)
        {
            function sequence(offset, count)
            {
                var str;
                var solution0 = solutions[offset];
                var solution1 = solutions[offset + 1];
                if (solution0.level < LEVEL_OBJECT && solution1.level < LEVEL_OBJECT)
                {
                    if (solution1.level > LEVEL_UNDEFINED)
                    {
                        str = solution0 + '+[' + solution1 + ']';
                    }
                    else if (solution0.level > LEVEL_UNDEFINED)
                    {
                        str = '[' + solution0 + ']+' + solution1;
                    }
                    else
                    {
                        str = solution0 + '+[]+' + solution1;
                    }
                }
                else
                {
                    str = appendSolution(solution0, solution1);
                }
                for (var index = 2; index < count; ++index)
                {
                    var solution = solutions[offset + index];
                    str = appendSolution(str, solution);
                }
                return str;
            }
            
            var solutions = [];
            var length = -1;
            var maxSolutionCount = Math.pow(2, groupThreshold - 1);
            
            Object.defineProperties(
                this,
                {
                    'append':
                    {
                        value: function (solution)
                        {
                            if (solutions.length >= maxSolutionCount)
                            {
                                return false;
                            }
                            solutions.push(solution);
                            length += getAppendLength(solution);
                            return true;
                        }
                    },
                    'length':
                    {
                        get: function ()
                        {
                            var result;
                            switch (solutions.length)
                            {
                            case 0:
                                result = strongBound ? 7 : 5;
                                break;
                            case 1:
                                var solution = solutions[0];
                                result =
                                    solution.length +
                                    (solution.level < LEVEL_STRING ? strongBound ? 5 : 3 : 0);
                                break;
                            default:
                                result = length + (strongBound ? 2 : 0);
                            }
                            return result;
                        }
                    },
                    'toString':
                    {
                        value: function ()
                        {
                            function collect(offset, count, maxGroupCount)
                            {
                                if (count <= groupSize + 1)
                                {
                                    str += sequence(offset, count);
                                }
                                else
                                {
                                    maxGroupCount /= 2;
                                    var halfCount = groupSize * maxGroupCount;
                                    var capacity = 2 * halfCount - count;
                                    var leftCount =
                                        Math.max(
                                            halfCount - capacity + capacity % (groupSize - 1),
                                            (maxGroupCount / 2 ^ 0) * (groupSize + 1)
                                        );
                                    collect(offset, leftCount, maxGroupCount);
                                    str += '+(';
                                    collect(offset + leftCount, count - leftCount, maxGroupCount);
                                    str += ')';
                                }
                            }
                            
                            var singlePart;
                            var str;
                            var solutionCount = solutions.length;
                            if (!solutionCount)
                            {
                                str = '[]+[]';
                            }
                            else if (solutionCount === 1)
                            {
                                var solution = solutions[0];
                                // Here we assume that string solutions never have an outer plus.
                                singlePart = solution.level > LEVEL_OBJECT;
                                str = solution + (singlePart ? '' : '+[]');
                            }
                            else if (solutionCount <= groupThreshold)
                            {
                                str = sequence(0, solutionCount);
                            }
                            else
                            {
                                var groupSize = groupThreshold;
                                var maxGroupCount = 2;
                                for (;;)
                                {
                                    --groupSize;
                                    var maxSolutionCountForDepth = groupSize * maxGroupCount;
                                    if (solutionCount <= maxSolutionCountForDepth)
                                    {
                                        break;
                                    }
                                    maxGroupCount *= 2;
                                }
                                str = '';
                                collect(0, solutionCount, maxGroupCount);
                            }
                            if (strongBound && !singlePart)
                            {
                                str = '(' + str + ')';
                            }
                            return str;
                        }
                    }
                }
            );
        };
    
    getAppendLength =
        // This function assumes that only undefined or numeric solutions can have an outer plus.
        function (solution)
        {
            var extraLength = hasOuterPlus(solution) ? 3 : 1;
            var length = solution.length + extraLength;
            return length;
        };
    
    hasOuterPlus =
        // Determine whether the specified solution contains a plus sign out of brackets not
        // preceded by an exclamation mark.
        function (solution)
        {
            var outerPlus = solution.outerPlus;
            if (outerPlus == null)
            {
                var unclosed = 0;
                outerPlus =
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
            }
            return outerPlus;
        };

})();

var CODERS;

var Encoder;

var expandEntries;

(function ()
{
    'use strict';
    
    var AMENDINGS = ['true', 'undefined', 'NaN'];
    
    var BASE64_ALPHABET_HI_2 = ['NaN', 'false', 'undefined', '0'];
    
    var BASE64_ALPHABET_HI_4 =
    [
        [
            define('A'),
            define('C', 'CAPITAL_HTML'),
            define('A', 'ARRAY_ITERATOR')
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
            48
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
        byDictRadix3: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 3, 0, maxLength);
                return output;
            },
            363
        ),
        byDictRadix4: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 4, 0, maxLength);
                return output;
            },
            267
        ),
        byDictRadix4AmendedBy1: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 4, 1, maxLength);
                return output;
            },
            379
        ),
        byDictRadix4AmendedBy2: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 4, 2, maxLength);
                return output;
            },
            706
        ),
        byDictRadix5AmendedBy2: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 5, 2, maxLength);
                return output;
            },
            679
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
    };
    
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
    
    function defineCoder(coder, minInputLength)
    {
        coder.MIN_INPUT_LENGTH = minInputLength;
        return coder;
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
            replacement = replaceDigit(+number[0]) + '';
            var length = number.length;
            for (var index = 1; index < length; ++index)
            {
                replacement += '+[' + replaceDigit(+number[index]) + ']';
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
            var str;
            try
            {
                str = JSON.parse(quotedString);
            }
            catch (e)
            {
                this.throwSyntaxError('Illegal string ' + quotedString);
            }
            var strongBound =
                isPrecededByOperator(expr, offset) ||
                isFollowedByLeftSquareBracket(expr, offset + wholeMatch.length);
            replacement = this.replaceString(str, strongBound);
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
                    SIMPLE[simple] = solution = encoder.resolve(solution);
                }
            );
        }
        return solution;
    }
    
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
        callCoders: function (input, coderNames, codingName)
        {
            var output;
            var inputLength = input.length;
            var codingLog = this.codingLog;
            var perfInfoList = [];
            perfInfoList.name = codingName;
            perfInfoList.inputLength = inputLength;
            codingLog.push(perfInfoList);
            var inputData = Object(input);
            var usedPerfInfo;
            coderNames.forEach(
                function (coderName)
                {
                    var coder = CODERS[coderName];
                    var perfInfo = { coderName: coderName };
                    var perfStatus;
                    if (inputLength < coder.MIN_INPUT_LENGTH)
                    {
                        perfStatus = 'skipped';
                    }
                    else
                    {
                        this.codingLog = perfInfo.codingLog = [];
                        var before = new Date();
                        var maxLength = output != null ? output.length : undefined;
                        var newOutput = coder.call(this, inputData, maxLength);
                        var time = new Date() - before;
                        this.codingLog = codingLog;
                        perfInfo.time = time;
                        if (newOutput != null)
                        {
                            output = newOutput;
                            if (usedPerfInfo)
                            {
                                usedPerfInfo.status = 'superseded';
                            }
                            usedPerfInfo = perfInfo;
                            perfInfo.outputLength = newOutput.length;
                            perfStatus = 'used';
                        }
                        else
                        {
                            perfStatus = 'incomplete';
                        }
                    }
                    perfInfo.status = perfStatus;
                    perfInfoList.push(perfInfo);
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
                    this.replaceExpr(
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
                        this.replaceExpr(
                            '["map"](Function("return String.fromCharCode(arguments[0])"))' +
                            '["join"]([])'
                        );
                }
                else
                {
                    output =
                        this.resolveConstant('Function') + '(' +
                        this.replaceString('return String.fromCharCode(') + '+' + charCodes + '+' +
                        this.replaceString(')') + ')()';
                }
            }
            return output;
        },
        
        createDictEncoding: function (legend, indexes, radix, amendings, coerceToInt)
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
                indexes + this.replaceExpr('["map"]') + '(' + this.replaceExpr(mapper) + '(' +
                legend + '))' + this.replaceExpr('["join"]([])');
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
                        'byDictRadix3',
                        'byDictRadix4',
                        'byDict',
                        'byCharCodesRadix4',
                        'byCharCodes',
                        'plain'
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
                output = this.replaceExpr('Function("return eval")()') + '(' + output + ')';
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
            var legend = this.encodeDictLegend(dictChars.join(''), maxLength - minFreqIndexLength);
            if (legend)
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
                        maxLength - legend.length
                    );
                if (freqIndexes)
                {
                    var output =
                        this.createDictEncoding(legend, freqIndexes, radix, amendings, coerceToInt);
                    if (!(output.length > maxLength))
                    {
                        return output;
                    }
                }
            }
        },
        
        encodeDictLegend: function (input, maxLength)
        {
            if (!(maxLength < 0))
            {
                var output =
                    this.callCoders(input, ['byCharCodesRadix4', 'byCharCodes', 'plain'], 'legend');
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
            for (var entryIndex = entries.length; entryIndex--;)
            {
                var entry = entries[entryIndex];
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
            for (var entryIndex = entries.length; entryIndex--;)
            {
                var entry = entries[entryIndex];
                if (this.hasFeatures(entry.featureMask))
                {
                    var definition = entry.definition;
                    var solution = this.resolve(definition);
                    if (!result || result.length >= solution.length)
                    {
                        result = solution;
                        solution.entryIndex = entryIndex;
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
                var result = replacement + this.replaceExpr('["split"](false)');
                if (!(result.length > maxLength))
                {
                    return result;
                }
            }
        },
        
        replaceString: function (str, strongBound, maxLength)
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
            while (match = regExp.exec(str))
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
            var type = typeof definition;
            if (type === 'function')
            {
                solution = definition.call(this);
            }
            else
            {
                var expr;
                var level;
                if (type === 'object')
                {
                    expr = definition.expr;
                    level = definition.level;
                }
                else
                {
                    expr = definition;
                }
                var replacement = this.replaceExpr(expr);
                solution = createSolution(replacement, level);
            }
            return solution;
        },
        
        resolveCharacter: function (char)
        {
            var solution = this.characterCache[char];
            if (solution === undefined)
            {
                this.callResolver(
                    quoteString(char),
                    function ()
                    {
                        var entries = CHARACTERS[char];
                        if (entries != null)
                        {
                            solution = this.findOptimalSolution(entries);
                        }
                        if (!solution)
                        {
                            var defaultCharacterEncoder =
                                this.findBestDefinition(DEFAULT_CHARACTER_ENCODER);
                            solution = defaultCharacterEncoder.call(this, char);
                        }
                        if (solution.level == null)
                        {
                            solution.level = LEVEL_STRING;
                        }
                        this.characterCache[char] = solution;
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
                                function (char)
                                {
                                    var solution = this.resolveCharacter(char);
                                    discreteLength += getAppendLength(solution);
                                },
                                this
                            );
                            if (discreteLength >= optimalSolution.length)
                            {
                                solution = optimalSolution;
                                solution.level = LEVEL_STRING;
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

var trimJS;

(function ()
{
    'use strict';
    
    var regExp =
        RegExp(
            '[\n\r]+(?:\\s|//(?:(?!\\*/|`)[^\n\r])*(?![^\n\r])|/\\*(?:(?!`)(?:[^*]|\\*[^/' +
            ']))*?\\*/)*$'
        );
    
    trimJS =
        function (str)
        {
            str =
                (str + '').replace(
                    /^(?:\s|\/\/[^\n\r]*(?![^\n\r])|\/\*(?:[^*]|\*[^\/])*?\*\/)*[\n\r]/,
                    ''
                );
            var match = regExp.exec(str);
            if (match)
            {
                var index = match.index;
                if (str[index - 1] !== '\\')
                {
                    str = str.slice(0, index);
                }
            }
            return str;
        };

})();

var JScrewIt;
var describeNoEnum;
var getValidFeatureMask;
var noEnum;
var setUp;

(function ()
{
    'use strict';
    
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
    
    function commonFeaturesOf()
    {
        if (arguments.length)
        {
            var featureMask = ~0;
            Array.prototype.forEach.call(
                arguments,
                function (features)
                {
                    featureMask &= getFeatureMask(features);
                }
            );
            var result = featuresFromMask(featureMask);
            return result;
        }
    }
    
    function encode(input, arg2, arg3)
    {
        var features;
        var wrapWith;
        var perfInfo;
        if (typeof arg2 === 'object')
        {
            features = arg2.features;
            wrapWith = filterWrapWith(arg2.wrapWith);
            if (arg2.trimCode)
            {
                input = trimJS(input);
            }
            perfInfo = arg2.perfInfo;
        }
        else
        {
            features = arg3;
            wrapWith = arg2 ? 'call' : 'none';
        }
        var encoder = getEncoder(features);
        var codingLog = encoder.codingLog = [];
        var output = encoder.encode(input + '', wrapWith);
        if (perfInfo)
        {
            perfInfo.codingLog = codingLog;
        }
        delete encoder.codingLog;
        return output;
    }
    
    function filterWrapWith(wrapWith)
    {
        if (wrapWith === undefined)
        {
            return 'none';
        }
        switch (wrapWith += '')
        {
        case 'none':
        case 'call':
        case 'eval':
            return wrapWith;
        }
        throw new Error('Invalid value for option wrapWith');
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
    
    var encoders = { };
    
    describeNoEnum =
        function (value)
        {
            var descriptor = { configurable: true, value: value, writable: true };
            return descriptor;
        };
    
    noEnum =
        function (obj)
        {
            var result = { };
            Object.keys(obj).forEach(
                function (name)
                {
                    var descriptor = describeNoEnum(obj[name]);
                    Object.defineProperty(result, name, descriptor);
                }
            );
            return result;
        };
    
    JScrewIt = noEnum
    ({
        areFeaturesAvailable:   areFeaturesAvailable,
        areFeaturesCompatible:  areFeaturesCompatible,
        commonFeaturesOf:       commonFeaturesOf,
        encode:                 encode,
        FEATURE_INFOS:          FEATURE_INFOS,
    });
    
    getValidFeatureMask =
        function (features)
        {
            var featureMask = getFeatureMask(features);
            if (!isFeatureMaskCompatible(featureMask))
            {
                throw new ReferenceError('Incompatible features');
            }
            return featureMask;
        };
    
    setUp =
        function (self)
        {
            if (self != null)
            {
                self.JSFuck = self.JScrewIt = JScrewIt;
            }
        };
    
    setUp(typeof self !== 'undefined' ? /* istanbul ignore next */ self : null);
    
    // istanbul ignore else
    if (typeof module !== 'undefined')
    {
        module.exports = JScrewIt;
    }

})();

// istanbul ignore else
if (typeof DEBUG === 'undefined' || /* istanbul ignore next */ DEBUG)
{
    (function ()
    {
        'use strict';
        
        function createEncoder(features)
        {
            var featureMask = getValidFeatureMask(features);
            var encoder = new Encoder(featureMask);
            encoder.codingLog = [];
            return encoder;
        }
        
        function createScrewBuffer(strongBound, groupThreshold)
        {
            var buffer = new ScrewBuffer(strongBound, groupThreshold);
            return buffer;
        }
        
        function defineConstant(encoder, constant, definition)
        {
            constant += '';
            if (!/^[$A-Z_a-z][$0-9A-Z_a-z]*$/.test(constant))
            {
                throw new SyntaxError('Invalid identifier ' + JSON.stringify(constant));
            }
            if (!encoder.hasOwnProperty('constantDefinitions'))
            {
                encoder.constantDefinitions = Object.create(CONSTANTS);
            }
            encoder.constantDefinitions[constant] = definition + '';
        }
        
        function getCharacterEntries(char)
        {
            var result = getEntries(CHARACTERS[char]);
            return result;
        }
        
        function getCoders()
        {
            return CODERS;
        }
        
        function getComplexEntries(complex)
        {
            var result = getEntries(COMPLEX[complex]);
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
        
        Object.defineProperty(
            JScrewIt,
            'debug',
            describeNoEnum(noEnum
                ({
                    createEncoder:          createEncoder,
                    createScrewBuffer:      createScrewBuffer,
                    defineConstant:         defineConstant,
                    featuresFromMask:       featuresFromMask,
                    getCharacterEntries:    getCharacterEntries,
                    getCoders:              getCoders,
                    getComplexEntries:      getComplexEntries,
                    getConstantEntries:     getConstantEntries,
                    hasOuterPlus:           hasOuterPlus,
                    setUp:                  setUp,
                    trimJS:                 trimJS,
                })
            )
        );
    
    })();
}

})();
