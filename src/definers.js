/* global getFeatureMask */

// Definition syntax has been changed to match JavaScript more closely. The main differences from
// JSFuck are:
// * Support for constant literals like "ANY_FUNCTION", "FHP_3_NO", etc. improves readability and
//   simplifies maintenance.
// * 10 evaluates to a number, while "10" evaluates to a string. This can make a difference in
//   certain expressions and may affect the mapping length.
// * String literals must be always double quoted.

var LEVEL_STRING;
var LEVEL_OBJECT;
var LEVEL_NUMERIC;
var LEVEL_UNDEFINED;

var createSolution;
var define;
var defineCharacterByAtob;
var defineFBCharAt;
var defineFHCharAt;
var noProto;

(function ()
{
    'use strict';
    
    define =
        function (definition)
        {
            var result = createDefinitionEntry(definition, arguments, 1);
            return result;
        };
    
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
    
    LEVEL_STRING    = 1;
    LEVEL_OBJECT    = 0;
    LEVEL_NUMERIC   = -1;
    LEVEL_UNDEFINED = -2;
    
    createSolution =
        function (replacement, level, outerPlus)
        {
            var result = Object(replacement);
            result.level = level;
            result.outerPlus = outerPlus;
            return result;
        };
    
    defineCharacterByAtob =
        function (char)
        {
            var charCode = char.charCodeAt(0);
            var result =
                define(
                    function ()
                    {
                        var result =
                            createSolution(this.charEncodeByAtob(charCode), LEVEL_STRING, false);
                        return result;
                    },
                    'ATOB'
                );
            return result;
        };
    
    defineFBCharAt =
        function (offset)
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
        };
    
    defineFHCharAt =
        function (expr, index)
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
