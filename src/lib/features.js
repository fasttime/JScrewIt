/* global Empty, assignNoEnum, document, isArray, self */

var Feature;

var featureFromMask;
var isMaskCompatible;
var maskFromArray;
var validMaskFromArrayOrStringOrFeature;

(function ()
{
    'use strict';
    
    function areCompatible(features)
    {
        var compatible;
        if (features.length > 1)
        {
            var mask = maskFromArray(features);
            compatible = isMaskCompatible(mask);
        }
        else
        {
            compatible = true;
        }
        return compatible;
    }
    
    function areEqual()
    {
        var mask;
        var result =
            Array.prototype.every.call(
                arguments,
                function (arg, index)
                {
                    var result;
                    var otherMask = validMaskFromArrayOrStringOrFeature(arg);
                    if (index)
                    {
                        result = otherMask === mask;
                    }
                    else
                    {
                        mask = otherMask;
                        result = true;
                    }
                    return result;
                }
            );
        return result;
    }
    
    function checkSelfFeature()
    {
        // self + '' throws an error inside a web worker in Safari 8 and 9.
        var str;
        try
        {
            str = self + '';
        }
        catch (error)
        {
            return false;
        }
        var available = this(str);
        return available;
    }
    
    function commonOf()
    {
        var result;
        if (arguments.length)
        {
            var mask = ~0;
            Array.prototype.forEach.call(
                arguments,
                function (arg)
                {
                    mask &= validMaskFromArrayOrStringOrFeature(arg);
                }
            );
            result = featureFromMask(mask);
        }
        else
        {
            result = null;
        }
        return result;
    }
    
    function completeFeature(name)
    {
        var mask;
        var featureObj = ALL[name];
        if (featureObj)
        {
            mask = featureObj.mask;
        }
        else
        {
            var excludes;
            var info = FEATURE_INFOS[name];
            if (typeof info === 'string')
            {
                mask = completeFeature(info);
                featureObj = ALL[info];
            }
            else
            {
                var check = info.check;
                if (check)
                {
                    mask = 1 << bitIndex++;
                    if (check())
                    {
                        autoMask |= mask;
                    }
                }
                mask ^= 0;
                var includes = includesMap[name] = info.includes || [];
                includes.forEach(
                    function (include)
                    {
                        var includeMask = completeFeature(include);
                        mask |= includeMask;
                    }
                );
                excludes = info.excludes;
                featureObj = createFeature(name, info.description, mask, check);
                if (check)
                {
                    elementaryFeatureObjs.push(featureObj);
                }
            }
            registerFeature(name, featureObj);
            if (excludes)
            {
                excludes.forEach(
                    function (exclude)
                    {
                        var excludeMask = completeFeature(exclude);
                        var incompatibleMask = mask | excludeMask;
                        incompatibleMasks.push(incompatibleMask);
                    }
                );
            }
        }
        return mask;
    }
    
    function createFeature(name, description, mask, check)
    {
        var featureObj =
            Object.create(
                Feature.prototype,
                {
                    check: { value: check },
                    description: { value: description },
                    mask: { value: mask },
                    name: { value: name }
                }
            );
        return featureObj;
    }
    
    function initMask(featureObj, mask)
    {
        Object.defineProperty(featureObj, 'mask', { value: mask });
    }
    
    function maskFromStringOrFeature(arg)
    {
        var mask;
        if (arg instanceof Feature)
        {
            mask = arg.mask;
        }
        else
        {
            var name = arg + '';
            var featureObj = ALL[name];
            if (!featureObj)
            {
                throw new ReferenceError('Unknown feature ' + JSON.stringify(name));
            }
            mask = featureObj.mask;
        }
        return mask;
    }
    
    function registerFeature(name, featureObj)
    {
        var descriptor = { enumerable: true, value: featureObj };
        Object.defineProperty(Feature, name, descriptor);
        Object.defineProperty(ALL, name, descriptor);
    }
    
    function validateMask(mask)
    {
        if (!isMaskCompatible(mask))
        {
            throw new ReferenceError('Incompatible features');
        }
    }
    
    function validMaskFromArguments(args)
    {
        var mask = 0;
        var validationNeeded = false;
        Array.prototype.forEach.call(
            args,
            function (arg)
            {
                if (isArray(arg))
                {
                    arg.forEach(
                        function (arg)
                        {
                            mask |= maskFromStringOrFeature(arg);
                        }
                    );
                    validationNeeded |= arg.length > 1;
                }
                else
                {
                    mask |= maskFromStringOrFeature(arg);
                }
            }
        );
        validationNeeded |= args.length > 1;
        if (validationNeeded)
        {
            validateMask(mask);
        }
        return mask;
    }
    
    var ALL = new Empty();
    
    var FEATURE_INFOS =
    {
        ANY_DOCUMENT:
        {
            description:
                'Existence of the global object property document whose string representation ' +
                'starts with "[object " and ends with "Document]".\n' +
                'This feature is not available in Node.js. It is also not available inside web ' +
                'workers.',
            check: function ()
            {
                return typeof document === 'object' && /^\[object .*Document]$/.test(document + '');
            }
        },
        ANY_WINDOW:
        {
            description:
                'Existence of the global object property self whose string representation starts ' +
                'with "[object " and ends with "Window]".\n' +
                'This feature is not available in Node.js. It is also not available inside web ' +
                'workers.',
            check: checkSelfFeature.bind(
                function (str)
                {
                    return /^\[object .*Window]$/.test(str);
                }
            ),
            includes: ['SELF_OBJ']
        },
        ARRAY_ITERATOR:
        {
            description:
                'The property that the string representation of Array.prototype.entries() starts ' +
                'with "[object Array" and ends with "]" at index 21 or 22.\n' +
                'This feature is available in Firefox, Chrome, Opera, and in Safari 7.1, Node.js ' +
                '0.12 and later versions.',
            check: function ()
            {
                return Array.prototype.entries && /^\[object Array.{8,9}]$/.test([].entries());
            },
            excludes: ['ENTRIES_PLAIN'],
            includes: ['ENTRIES_OBJ']
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
        DOCUMENT:
        {
            description:
                'Existence of the global object property document having the string ' +
                'representation "[object Document]".\n' +
                'This feature is only available in Internet Explorer 9 and 10. It is not ' +
                'available inside web workers.',
            check: function ()
            {
                return typeof document === 'object' && document + '' === '[object Document]';
            },
            excludes: ['HTMLDOCUMENT'],
            includes: ['ANY_DOCUMENT']
        },
        DOMWINDOW:
        {
            description:
                'Existence of the global object property self having the string representation ' +
                '"[object DOMWindow]".\n' +
                'Only available in Android Browser versions prior to 4.4.2.',
            check: checkSelfFeature.bind(
                function (str)
                {
                    return str + '' === '[object DOMWindow]';
                }
            ),
            includes: ['ANY_WINDOW'],
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
        ENTRIES_OBJ:
        {
            description:
                'The property that the string representation of Array.prototype.entries() starts ' +
                'with "[object ".\n' +
                'This feature is available in Firefox, Chrome, Opera, Microsoft Edge, and in ' +
                'Safari 7.1, Node.js 0.12 and later versions.',
            check: function ()
            {
                return Array.prototype.entries && /^\[object /.test([].entries());
            }
        },
        ENTRIES_PLAIN:
        {
            description:
                'The property that the string representation of Array.prototype.entries() ' +
                'evaluates to "[object Object]".\n' +
                'This feature is only available in Microsoft Edge.',
            check: function ()
            {
                return Array.prototype.entries && [].entries() + '' === '[object Object]';
            },
            excludes: ['ARRAY_ITERATOR'],
            includes: ['ENTRIES_OBJ']
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
                'Available in Firefox, Microsoft Edge, and in Chrome 45, Safari 7.1, Opera 32, ' +
                'Node.js 4.0 and later versions.',
            check: function ()
            {
                return Array.prototype.fill;
            }
        },
        FROM_CODE_POINT:
        {
            description:
                'Existence of the function String.fromCodePoint.\n' +
                'Not available in Internet Explorer, Android Browser, Safari versions prior to 9 ' +
                'and Node.js versions prior to 4.0.',
            check: function ()
            {
                return String.fromCodePoint;
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
        HTMLDOCUMENT:
        {
            description:
                'Existence of the global object property document having the string ' +
                'representation "[object HTMLDocument]".\n' +
                'This feature is not available in Internet Explorer versions prior to 11 and ' +
                'Node.js. It is also not available inside web workers.',
            check: function ()
            {
                return typeof document === 'object' && document + '' === '[object HTMLDocument]';
            },
            excludes: ['DOCUMENT'],
            includes: ['ANY_DOCUMENT']
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
        LOCALE_INFINITY:
        {
            description:
                'Language sensitive string representation of Infinity as "∞".\n' +
                'Available in Firefox, Chrome, Opera, Microsoft Edge, and in Android Browser ' +
                '4.4.2, Node.js 0.12 and later versions.',
            check: function ()
            {
                return Infinity.toLocaleString() === '∞';
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
        NO_OLD_SAFARI_ARRAY_ITERATOR:
        {
            description:
                'The property that the string representation of Array.prototype.entries() ' +
                'evaluates to "[object Array Iterator]".\n' +
                'Available in Firefox, Chrome, Opera, and in Safari 9 and Node.js 0.12 and later ' +
                'versions.',
            check: function ()
            {
                return Array.prototype.entries && [].entries() + '' === '[object Array Iterator]';
            },
            includes: ['ARRAY_ITERATOR'],
            excludes: ['OLD_SAFARI_ARRAY_ITERATOR']
        },
        NO_OLD_SAFARI_LF:
        {
            description:
                'A string representation of dynamically generated functions typical for most ' +
                'browsers with the notable exception of Safari versions prior to 9.\n' +
                'More specifically, in this representation, the character at index 22 is a line ' +
                'feed ("\\n").',
            check: function ()
            {
                return (Function() + '')[22] === '\n';
            }
        },
        OLD_SAFARI_ARRAY_ITERATOR:
        {
            description:
                'The property that the string representation of Array.prototype.entries() ' +
                'evaluates to "[object ArrayIterator]".\n' +
                'Available in Safari versions from 7.1 up to 8.0.8.',
            check: function ()
            {
                return Array.prototype.entries && [].entries() + '' === '[object ArrayIterator]';
            },
            includes: ['ARRAY_ITERATOR'],
            excludes: ['NO_OLD_SAFARI_ARRAY_ITERATOR']
        },
        SELF: 'ANY_WINDOW',
        SELF_OBJ:
        {
            description:
                'Existence of the global object property self whose string representation starts ' +
                'with "[object ".\n' +
                'This feature is not available in Node.js. It is also not available inside web ' +
                'workers in Safari 8 and 9.',
            check: checkSelfFeature.bind(
                function (str)
                {
                    return /^\[object /.test(str);
                }
            )
        },
        UNDEFINED:
        {
            description:
                'The property that Object.prototype.toString.call() evaluates to "[object ' +
                'Undefined]".\n' +
                'This behavior is defined by ECMAScript, and is supported by all engines except ' +
                'Android Browser versions prior to 4.1.2, where this feature is not available.',
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
            check: checkSelfFeature.bind(
                function (str)
                {
                    return str === '[object Window]';
                }
            ),
            includes: ['ANY_WINDOW'],
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
                'No support for Node.js and older browsers like Internet Explorer, Safari 7.0 or ' +
                'Android Browser',
            includes:
            [
                'ATOB',
                'DOUBLE_QUOTE_ESC_HTML',
                'ENTRIES_OBJ',
                'FROM_CODE_POINT',
                'GMT',
                'HTMLDOCUMENT',
                'NAME',
                'NO_IE_SRC',
                'NO_OLD_SAFARI_LF',
                'UNDEFINED',
                'WINDOW'
            ]
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
                'HTMLDOCUMENT',
                'NAME',
                'NO_OLD_SAFARI_LF',
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
                'HTMLDOCUMENT',
                'NAME',
                'NO_OLD_SAFARI_LF',
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
                'HTMLDOCUMENT',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_LF',
                'UNDEFINED',
                'V8_SRC',
                'WINDOW'
            ]
        },
        CHROME: 'CHROME41',
        CHROME41:
        {
            description: 'Features available in Chrome 41 and Opera 28 or later.',
            includes:
            [
                'ATOB',
                'DOUBLE_QUOTE_ESC_HTML',
                'FROM_CODE_POINT',
                'GMT',
                'HTMLDOCUMENT',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'NO_OLD_SAFARI_LF',
                'UNDEFINED',
                'V8_SRC',
                'WINDOW'
            ]
        },
        CHROME45:
        {
            description: 'Features available in Chrome 45 and Opera 32 or later.',
            includes:
            [
                'ATOB',
                'DOUBLE_QUOTE_ESC_HTML',
                'FILL',
                'FROM_CODE_POINT',
                'GMT',
                'HTMLDOCUMENT',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'NO_OLD_SAFARI_LF',
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
                'ENTRIES_PLAIN',
                'FILL',
                'FROM_CODE_POINT',
                'GMT',
                'HTMLDOCUMENT',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_LF',
                'UNDEFINED',
                'V8_SRC',
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
                'FROM_CODE_POINT',
                'GMT',
                'HTMLDOCUMENT',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'NO_OLD_SAFARI_LF',
                'UNDEFINED',
                'WINDOW'
            ]
        },
        IE9:
        {
            description: 'Features available in Internet Explorer 9 or later.',
            includes:
            [
                'CAPITAL_HTML',
                'DOCUMENT',
                'IE_SRC',
                'NO_OLD_SAFARI_LF',
                'UNDEFINED',
                'WINDOW'
            ]
        },
        IE10:
        {
            description: 'Features available in Internet Explorer 10 or later.',
            includes:
            [
                'ATOB',
                'CAPITAL_HTML',
                'DOCUMENT',
                'IE_SRC',
                'NO_OLD_SAFARI_LF',
                'UNDEFINED',
                'WINDOW'
            ]
        },
        IE11:
        {
            description: 'Features available in Internet Explorer 11.',
            includes:
            [
                'ATOB',
                'CAPITAL_HTML',
                'GMT',
                'HTMLDOCUMENT',
                'IE_SRC',
                'NO_OLD_SAFARI_LF',
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
                'NO_OLD_SAFARI_LF',
                'UNDEFINED',
                'V8_SRC'
            ]
        },
        NODE012:
        {
            description:
                'Features available in Node.js 0.12 or later.\n' +
                'Also compatible with Chrome 38, Opera 25 and Android Browser 4.1.2 or later.',
            includes:
            [
                'DOUBLE_QUOTE_ESC_HTML',
                'GMT',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'NO_OLD_SAFARI_LF',
                'UNDEFINED',
                'V8_SRC'
            ]
        },
        NODE40:
        {
            description:
                'Features available in Node.js 4.0 or later.\n' +
                'Also compatible with Chrome 45 and Opera 32 or later.',
            includes:
            [
                'DOUBLE_QUOTE_ESC_HTML',
                'FILL',
                'FROM_CODE_POINT',
                'GMT',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'NO_OLD_SAFARI_LF',
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
                'HTMLDOCUMENT',
                'NAME',
                'UNDEFINED',
                'WINDOW'
            ]
        },
        SAFARI71:
        {
            description: 'Features available in Safari 7.1 to 8.0.8.',
            includes:
            [
                'ATOB',
                'DOUBLE_QUOTE_ESC_HTML',
                'FF_SAFARI_SRC',
                'FILL',
                'GMT',
                'HTMLDOCUMENT',
                'NAME',
                'OLD_SAFARI_ARRAY_ITERATOR',
                'UNDEFINED',
                'WINDOW'
            ]
        },
        SAFARI90:
        {
            description: 'Features available in Safari 9.0 or later.',
            includes:
            [
                'ATOB',
                'DOUBLE_QUOTE_ESC_HTML',
                'FF_SAFARI_SRC',
                'FILL',
                'FROM_CODE_POINT',
                'GMT',
                'HTMLDOCUMENT',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'NO_OLD_SAFARI_LF',
                'UNDEFINED',
                'WINDOW'
            ]
        }
    };
    
    /**
     * A feature object or name or alias of a predefined feature.
     *
     * @typedef {JScrewIt.Feature|string} FeatureElement
     *
     * @throws {ReferenceError}
     * The specified value is neither a feature object nor a name or alias of a predefined feature.
     */
    
    /**
     * An array containing any number of feature objects or names or aliases of predefined features,
     * in no particular order.
     *
     * All of the specified features need to be compatible, so that their union can be constructed.
     *
     * @typedef {FeatureElement[]} CompatibleFeatureArray
     *
     * @throws {ReferenceError} The specified features are not compatible with each other.
     */
    
    /**
     * Creates a new feature object from the union of the specified features.
     *
     * The constructor can be used with or without the `new` operator, e.g.
     * `new JScrewIt.Feature(feature1, feature2)` or `JScrewIt.Feature(feature1, feature2)`.
     * If no arguments are specified, the new feature object will be equivalent to
     * [`DEFAULT`](Features.md#DEFAULT).
     *
     * @class JScrewIt.Feature
     *
     * @param {...(FeatureElement|CompatibleFeatureArray)} [feature]
     *
     * @throws {ReferenceError} The specified features are not compatible with each other.
     *
     * @example
     * The following statements are equivalent, and will all construct a new feature object
     * including both [`ANY_DOCUMENT`](Features.md#ANY_DOCUMENT) and
     * [`ANY_WINDOW`](Features.md#ANY_WINDOW).
     *
     * ```js
     * new JScrewIt.Feature("ANY_DOCUMENT", "ANY_WINDOW");
     * ```
     *
     * ```js
     * new JScrewIt.Feature(JScrewIt.Feature.ANY_DOCUMENT, JScrewIt.Feature.ANY_WINDOW);
     * ```
     *
     * ```js
     * new JScrewIt.Feature([JScrewIt.Feature.ANY_DOCUMENT, JScrewIt.Feature.ANY_WINDOW]);
     * ```
     *
     * @classdesc
     * Objects of this type indicate which of the capabilities that JScrewIt can use to minimize the
     * length of its output are available in a particular JavaScript engine.
     *
     * JScrewIt comes with a set of predefined feature objects exposed as property values of
     * `JScrewIt.Feature` or [`JScrewIt.Feature.ALL`](#JScrewIt.Feature.ALL), where the property
     * name is the feature's name or an alias thereof.
     *
     * Besides these predefined features, it is possible to construct custom features from the union
     * or intersection of other features.
     *
     * Among the predefined features, there are some special ones called *elementary* features that
     * cannot be expressed as a union of any number of other elementary features.
     * All other features, called *composite* features, can be constructed as a union of zero or
     * more elementary features.
     * Two of the predefined composite features are particularly important:
     * [`DEFAULT`](Features.md#DEFAULT) is the empty feature, indicating that no elementary feature
     * is available at all; [`AUTO`](Features.md#AUTO) is the union of all elementary features
     * available in the current engine.
     *
     * Not all features can be available at the same time: some features are necessarily
     * incompatible, meaning that they mutually exclude each other, and thus their union cannot be
     * constructed.
     */
    
    Feature =
        function ()
        {
            var mask = validMaskFromArguments(arguments);
            var featureObj = this instanceof Feature ? this : Object.create(Feature.prototype);
            initMask(featureObj, mask);
            return featureObj;
        };
    
    var FEATURE_PROPS =
    {
        /**
         * A map of predefined feature objects accessed by name or alias.
         *
         * For an exhaustive list of all features, see the [Feature Reference](Features.md).
         *
         * @member {object} JScrewIt.Feature.ALL
         *
         * @example
         *
         * This will produce an array with the names and aliases of all predefined features.
         *
         * ```js
         * Object.keys(JScrewIt.Feature.ALL)
         * ```
         *
         * This will determine if a particular feature object is predefined or not.
         *
         * ```js
         * featureObj === JScrewIt.Feature.ALL[featureObj.name]
         * ```
         */
        ALL: ALL,
        
        /**
         * Determines whether the specified features are compatible with each other.
         *
         * @function JScrewIt.Feature.areCompatible
         *
         * @param {FeatureElement[]} [features]
         *
         * @returns {boolean}
         * `true` if the specified features are compatible with each other; otherwise, `false`.
         * If the array argument contains less than two features, the return value is `true`.
         *
         * @example
         *
         * ```js
         * // false: only one of "V8_SRC" or "IE_SRC" may be available.
         * JScrewIt.Feature.areCompatible(["V8_SRC", "IE_SRC"])
         * ```
         *
         * ```js
         * // true
         * JScrewIt.Feature.areCompatible([JScrewIt.Feature.DEFAULT, JScrewIt.Feature.FILL])
         * ```
         */
        
        areCompatible: areCompatible,
        
        /**
         * Determines whether all of the specified features are equivalent.
         *
         * @function JScrewIt.Feature.areEqual
         *
         * @param {...(FeatureElement|CompatibleFeatureArray)} [feature]
         *
         * @returns {boolean}
         * `true` if all of the specified features are equivalent; otherwise, `false`.
         * If less than two arguments are specified, the return value is `true`.
         *
         * @example
         *
         * ```js
         * // false
         * JScrewIt.Feature.areEqual(JScrewIt.Feature.CHROME, JScrewIt.Feature.FIREFOX)
         * ```
         *
         * ```js
         * // true
         * JScrewIt.Feature.areEqual("DEFAULT", [])
         * ```
         */
        
        areEqual: areEqual,
        
        /**
         * Creates a new feature object equivalent to the intersection of the specified features.
         *
         * @function JScrewIt.Feature.commonOf
         *
         * @param {...(FeatureElement|CompatibleFeatureArray)} [feature]
         *
         * @returns {JScrewIt.Feature|null}
         * A feature object, or `null` if no arguments are specified.
         *
         * @example
         *
         * This will create a new feature object equivalent to [`NAME`](Features.md#NAME).
         *
         * ```js
         * var newFeature = JScrewIt.Feature.commonOf(["ATOB", "NAME"], ["NAME", "SELF"]);
         * ```
         *
         * This will create a new feature object equivalent to
         * [`ANY_DOCUMENT`](Features.md#ANY_DOCUMENT).
         * This is because both [`HTMLDOCUMENT`](Features.md#HTMLDOCUMENT) and
         * [`DOCUMENT`](Features.md#DOCUMENT) imply [`ANY_DOCUMENT`](Features.md#ANY_DOCUMENT).
         *
         * ```js
         * var newFeature = JScrewIt.Feature.commonOf("HTMLDOCUMENT", "DOCUMENT");
         * ```
         */
        
        commonOf: commonOf
    };
    assignNoEnum(Feature, FEATURE_PROPS);
    
    var FEATURE_PROTO_PROPS =
    {
        /**
         * An array of all elementary feature names included in this feature object, without aliases
         * and implied features.
         *
         * @member {string[]} JScrewIt.Feature#canonicalNames
         */
        
        get canonicalNames()
        {
            var mask = this.mask;
            var featureNameSet = new Empty();
            var allIncludes = [];
            elementaryFeatureObjs.forEach(
                function (featureObj)
                {
                    var otherMask = featureObj.mask;
                    var included = (otherMask & mask) === otherMask;
                    if (included)
                    {
                        var name = featureObj.name;
                        featureNameSet[name] = null;
                        var includes = includesMap[name];
                        Array.prototype.push.apply(allIncludes, includes);
                    }
                }
            );
            allIncludes.forEach(
                function (name)
                {
                    delete featureNameSet[name];
                }
            );
            var names = Object.keys(featureNameSet).sort();
            return names;
        },
        
        /**
         * A short description of this feature object in plain English.
         *
         * All predefined features have a description.
         * If desired, custom features may be assigned a description, too.
         *
         * @member {string|undefined} JScrewIt.Feature#description
         */
        
        description: undefined,
        
        /**
         * An array of all elementary feature names included in this feature object, without
         * aliases.
         *
         * @member {string[]} JScrewIt.Feature#elementaryNames
         */
        
        get elementaryNames()
        {
            var names = [];
            var mask = this.mask;
            elementaryFeatureObjs.forEach(
                function (featureObj)
                {
                    var otherMask = featureObj.mask;
                    var included = (otherMask & mask) === otherMask;
                    if (included)
                    {
                        names.push(featureObj.name);
                    }
                }
            );
            return names;
        },
        
        /**
         * Determines whether this feature object includes all of the specified features.
         *
         * @function JScrewIt.Feature#includes
         *
         * @param {...(FeatureElement|CompatibleFeatureArray)} [feature]
         *
         * @returns {boolean}
         * `true` if this feature object includes all of the specified features; otherwise, `false`.
         * If no arguments are specified, the return value is `true`.
         */
        
        includes: function ()
        {
            var mask = this.mask;
            var included =
                Array.prototype.every.call(
                    arguments,
                    function (arg)
                    {
                        var otherMask = validMaskFromArrayOrStringOrFeature(arg);
                        var included = (otherMask & mask) === otherMask;
                        return included;
                    }
                );
            return included;
        },
        
        /**
         * The primary name of this feature object, useful for identification purpose.
         *
         * All predefined features have a name.
         * If desired, custom features may be assigned a name, too.
         *
         * @member {string|undefined} JScrewIt.Feature#name
         */
        
        name: undefined,
        
        /**
         * Returns a string representation of this feature object.
         *
         * @function JScrewIt.Feature#toString
         *
         * @returns {string} A string representation of this feature object.
         */
        
        toString: function ()
        {
            var name = this.name;
            if (name === undefined)
            {
                name = '{' + this.canonicalNames.join(', ') + '}';
            }
            var str = '[Feature ' + name + ']';
            return str;
        }
    };
    assignNoEnum(Feature.prototype, FEATURE_PROTO_PROPS);
    
    featureFromMask =
        function (mask)
        {
            var featureObj = Object.create(Feature.prototype);
            initMask(featureObj, mask);
            return featureObj;
        };
    
    isMaskCompatible =
        function (mask)
        {
            var result =
                incompatibleMasks.every(
                    function (incompatibleMask)
                    {
                        var result = (incompatibleMask & mask) !== incompatibleMask;
                        return result;
                    }
                );
            return result;
        };
    
    maskFromArray =
        function (features)
        {
            var mask = 0;
            features.forEach(
                function (arg)
                {
                    mask |= maskFromStringOrFeature(arg);
                }
            );
            return mask;
        };
    
    validMaskFromArrayOrStringOrFeature =
        function (arg)
        {
            var mask;
            if (isArray(arg))
            {
                mask = 0;
                arg.forEach(
                    function (arg)
                    {
                        mask |= maskFromStringOrFeature(arg);
                    }
                );
                if (arg.length > 1)
                {
                    validateMask(mask);
                }
            }
            else
            {
                mask = maskFromStringOrFeature(arg);
            }
            return mask;
        };
    
    var autoMask = 0;
    var bitIndex = 0;
    var elementaryFeatureObjs = [];
    var includesMap = new Empty();
    var incompatibleMasks = [];
    
    var featureNames = Object.keys(FEATURE_INFOS);
    featureNames.forEach(completeFeature);
    elementaryFeatureObjs.sort();
    var autoFeatureObj =
        createFeature('AUTO', 'All features available in the current engine.', autoMask);
    registerFeature('AUTO', autoFeatureObj);
}
)();
