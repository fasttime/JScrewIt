//! JScrewIt 1.7.0 – http://jscrew.it
(function ()
{

var Empty;

var assignNoEnum;
var noProto;

(function ()
{
    'use strict';
    
    Empty = Function();
    Empty.prototype = Object.create(null);
    
    assignNoEnum =
        function (target, source)
        {
            var descriptors = { };
            Object.keys(source).forEach(
                function (name)
                {
                    var descriptor = Object.getOwnPropertyDescriptor(source, name);
                    descriptor.enumerable = false;
                    descriptors[name] = descriptor;
                }
            );
            Object.defineProperties(target, descriptors);
            return target;
        };
    
    noProto =
        function (obj)
        {
            var result = new Empty();
            Object.keys(obj).forEach(
                function (name)
                {
                    result[name] = obj[name];
                }
            );
            return result;
        };
}
)();

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
        // self + '' throws an error inside a web worker in Safari 8.0.
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
                if (Array.isArray(arg))
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
                'Available in Firefox, Microsoft Edge, and in Safari 7.1 and later versions.',
            check: function ()
            {
                return Array.prototype.fill;
            }
        },
        FROM_CODE_POINT:
        {
            description:
                'Existence of the function String.fromCodePoint.\n' +
                'Available in Firefox, Chrome, Opera and Microsoft Edge.',
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
        NO_SAFARI_ARRAY_ITERATOR:
        {
            description:
                'The property that the string representation of Array.prototype.entries() ' +
                'evaluates to "[object Array Iterator]".\n' +
                'Available in Firefox, Chrome, Opera, and in Node.js 0.12 and later versions.',
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
        SELF: 'ANY_WINDOW',
        SELF_OBJ:
        {
            description:
                'Existence of the global object property self whose string representation starts ' +
                'with "[object ".\n' +
                'This feature is not available in Node.js. It is also not available inside web ' +
                'workers in Safari 8.0.',
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
                'GMT',
                'HTMLDOCUMENT',
                'NAME',
                'NO_IE_SRC',
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
                'HTMLDOCUMENT',
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
                'HTMLDOCUMENT',
                'LOCALE_INFINITY',
                'NAME',
                'NO_SAFARI_LF',
                'UNDEFINED',
                'V8_SRC',
                'WINDOW'
            ]
        },
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
                'ENTRIES_PLAIN',
                'FILL',
                'FROM_CODE_POINT',
                'GMT',
                'HTMLDOCUMENT',
                'LOCALE_INFINITY',
                'NAME',
                'NO_SAFARI_LF',
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
                'NO_SAFARI_ARRAY_ITERATOR',
                'NO_SAFARI_LF',
                'UNDEFINED',
                'WINDOW'
            ]
        },
        IE9:
        {
            description: 'Features available in Internet Explorer 9 or later.',
            includes: ['CAPITAL_HTML', 'DOCUMENT', 'IE_SRC', 'NO_SAFARI_LF', 'UNDEFINED', 'WINDOW']
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
                'NO_SAFARI_LF',
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
                'LOCALE_INFINITY',
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
                'HTMLDOCUMENT',
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
                'HTMLDOCUMENT',
                'NAME',
                'SAFARI_ARRAY_ITERATOR',
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
            featureObj.mask = mask;
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
            var featureObj = Object.create(Feature.prototype, { mask: { value: mask } });
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
            if (Array.isArray(arg))
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

var createDefinitionEntry;
var define;

(function ()
{
    'use strict';
    
    createDefinitionEntry =
        function (definition, featureArgs, startIndex)
        {
            var features = Array.prototype.slice.call(featureArgs, startIndex);
            var featureMask = maskFromArray(features);
            var entry = { definition: definition, featureMask: featureMask };
            return entry;
        };
    
    define =
        function (definition)
        {
            var entry = createDefinitionEntry(definition, arguments, 1);
            return entry;
        };
}
)();

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
            define()
        ],
        'i': '([RP_5_N] + undefined)["10"]',
        'j':
        [
            define('(PLAIN_OBJECT + [])["10"]'),
            define('(self + [])[3]', 'SELF_OBJ'),
            define('(ARRAY_ITERATOR + [])[3]', 'ENTRIES_OBJ')
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
            defineFHCharAt('Number', 11, 'NO_IE_SRC'),
            defineFHCharAt('Number', 11, 'IE_SRC')
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
            define('(RP_3_NO + btoa(Infinity))["10"]', 'ATOB')
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
            define('(self + [])["slice"]("-2")[0]', 'SELF'),
            define('(self + [])["13"]', 'WINDOW'),
            define('(RP_4_N + self)["20"]', 'DOMWINDOW'),
            define()
        ],
        'x':
        [
            define('101["toString"]("34")[1]'),
            define()
        ],
        'y': '(RP_3_NO + [Infinity])["10"]',
        'z':
        [
            define('35["toString"]("36")'),
            define()
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
            define()
        ],
        'D':
        [
            define('escape("]")[2]'),
            define('btoa("00")[1]', 'ATOB'),
            define('(document + 0)["slice"]("-10")[0]', 'ANY_DOCUMENT'),
            define('(RP_3_NO + document)["11"]', 'DOCUMENT'),
            define('(document + [])["12"]', 'HTMLDOCUMENT')
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
            define('""["link"]()[3]', 'CAPITAL_HTML'),
            define('(RP_3_NO + document)["11"]', 'HTMLDOCUMENT')
        ],
        'I': '"Infinity"[0]',
        'J':
        [
            define('btoa(true)[2]', 'ATOB')
        ],
        'K':
        [
            define('(RP_5_N + ""["strike"]())["10"]', 'CAPITAL_HTML'),
            define()
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
            define('""["fontcolor"]()[2]', 'CAPITAL_HTML'),
            define()
        ],
        'P':
        [
            define('btoa(""["italics"]())[0]', 'ATOB'),
            define('"0"["sup"]()["10"]', 'CAPITAL_HTML'),
            define()
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
            define('(RP_3_NO + Date())["30"]', 'GMT'),
            define('(RP_1_NO + document)["10"]', 'HTMLDOCUMENT')
        ],
        'U':
        [
            define('(RP_4_N + btoa(false))["10"]', 'ATOB'),
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
            define('(RP_3_NO + ARRAY_ITERATOR)["10"]', 'ENTRIES_OBJ'),
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
            define('escape(ANY_FUNCTION)[0]', 'IE_SRC'),
            define('escape(false + FILL)["20"]', 'NO_IE_SRC', 'FILL'),
            define(undefined, 'ATOB')
        ],
        '&':
        [
            define('""["fontcolor"]("\\"")["13"]', 'DOUBLE_QUOTE_ESC_HTML'),
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
            define()
        ],
        ';':
        [
            define('""["fontcolor"]("NaN\\"")["21"]', 'DOUBLE_QUOTE_ESC_HTML'),
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
        ],
        '∞':
        [
            define('Infinity["toLocaleString"]()', 'LOCALE_INFINITY'),
            define()
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
        Number:         '0["constructor"]',
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
        document:
        [
            define('Function("return document")()', 'ANY_DOCUMENT')
        ],
        escape:         'Function("return escape")()',
        self:
        [
            define('Function("return self")()', 'SELF_OBJ')
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
            define('[]["entries"]()', 'ENTRIES_OBJ')
        ],
        FILL:
        [
            define('[]["fill"]', 'FILL')
        ],
        FILTER:         '[]["filter"]',
        PLAIN_OBJECT:
        [
            define('Function("return{}")()'),
            define('ARRAY_ITERATOR', 'ENTRIES_PLAIN')
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
                do
                {
                    replacement += '+!![]';
                }
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
}
)();

var ScrewBuffer;

var getAppendLength;
var hasOuterPlus;

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
        function (strongBound, forceString, groupThreshold)
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
            
            assignNoEnum(
                this,
                {
                    append: function (solution)
                    {
                        if (solutions.length >= maxSolutionCount)
                        {
                            return false;
                        }
                        solutions.push(solution);
                        length += getAppendLength(solution);
                        return true;
                    },
                    get length ()
                    {
                        var result;
                        switch (solutions.length)
                        {
                        case 0:
                            result = forceString ? strongBound ? 7 : 5 : 0;
                            break;
                        case 1:
                            var solution = solutions[0];
                            result =
                                solution.length +
                                (
                                    forceString && solution.level < LEVEL_STRING ?
                                    strongBound ? 5 : 3 : 0
                                );
                            break;
                        default:
                            result = length + (strongBound ? 2 : 0);
                        }
                        return result;
                    },
                    toString: function ()
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
                            singlePart = !forceString;
                            str = singlePart ? '' : '[]+[]';
                        }
                        else if (solutionCount === 1)
                        {
                            var solution = solutions[0];
                            // Here we assume that string solutions never have an outer plus.
                            singlePart = !forceString || solution.level > LEVEL_OBJECT;
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
}
)();

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
            define('B', 'CAPITAL_HTML', 'ENTRIES_OBJ'),
            define('A', 'ARRAY_ITERATOR')
        ],
        'F',
        'Infinity',
        'NaNfalse',
        [
            define('S'),
            define('R', 'CAPITAL_HTML'),
            define('S', 'CAPITAL_HTML', 'ENTRIES_OBJ')
        ],
        [
            define('U'),
            define('V', 'ATOB'),
            define('W', 'ANY_WINDOW'),
            define('V', 'ATOB', 'ENTRIES_OBJ'),
            define('W', 'ATOB', 'DOMWINDOW', 'ENTRIES_OBJ'),
            define('W', 'ATOB', 'ENTRIES_OBJ', 'WINDOW'),
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
    
    var BASE64_ALPHABET_LO_6 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    
    var FROM_CHAR_CODE =
    [
        define('fromCharCode'),
        define('fromCodePoint', 'ATOB', 'FROM_CODE_POINT'),
        define('fromCodePoint', 'CAPITAL_HTML', 'FROM_CODE_POINT')
    ];
    
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
                var output = this.replaceString(input, false, inputData.forceString, maxLength);
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
        var charMap = new Empty();
        Array.prototype.forEach.call(
            input,
            function (char)
            {
                ++(charMap[char] || (charMap[char] = { char: char, count: 0 })).count;
            }
        );
        var freqList =
            Object.keys(charMap).map(
                function (char)
                {
                    return charMap[char];
                }
            ).sort(
                function (freq1, freq2)
                {
                    return freq2.count - freq1.count;
                }
            );
        return freqList;
    }
    
    function createReindexMap(count, radix, amendings, coerceToInt)
    {
        function getSortLength()
        {
            var length = 0;
            Array.prototype.forEach.call(
                str,
                function (digit)
                {
                    length += digitLengths[digit];
                }
            );
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
            regExp = RegExp(pattern, 'g');
            replacer =
                function (match)
                {
                    return AMENDINGS[match - firstDigit];
                };
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
    
    function defaultResolveCharacter(char)
    {
        var defaultCharacterEncoder = this.findBestDefinition(DEFAULT_CHARACTER_ENCODER);
        var solution = defaultCharacterEncoder.call(this, char);
        return solution;
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
    
    function isStrongBoundRequired(expr, offset, wholeMatch)
    {
        var strongBound =
            isPrecededByOperator(expr, offset) ||
            isFollowedByLeftSquareBracket(expr, offset + wholeMatch.length);
        return strongBound;
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
            if (isStrongBoundRequired(expr, offset, wholeMatch))
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
            var strongBound = isStrongBoundRequired(expr, offset, wholeMatch);
            replacement = this.replaceString(str, strongBound, true);
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
                isStrongBoundRequired(expr, offset, wholeMatch) && hasOuterPlus(solution) ?
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
            this.characterCache = new Empty();
            this.complexCache = new Empty();
            this.constantCache = new Empty();
            this.stack = [];
        };
    
    var encoderProtoSource =
    {
        callCoders: function (input, forceString, coderNames, codingName)
        {
            var output;
            var inputLength = input.length;
            var codingLog = this.codingLog;
            var perfInfoList = [];
            perfInfoList.name = codingName;
            perfInfoList.inputLength = inputLength;
            codingLog.push(perfInfoList);
            var inputData = Object(input);
            inputData.forceString = forceString;
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
        
        constantDefinitions: CONSTANTS,
        
        createCharCodesEncoding: function (charCodes, long, radix)
        {
            var output;
            var fromCharCode = this.findBestDefinition(FROM_CHAR_CODE);
            if (radix)
            {
                output =
                    charCodes +
                    this.replaceExpr(
                        '["map"](Function("return String.' + fromCharCode +
                        '(parseInt(arguments[0],' + radix + '))"))["join"]([])'
                    );
            }
            else
            {
                if (long)
                {
                    output =
                        charCodes +
                        this.replaceExpr(
                            '["map"](Function("return String.' + fromCharCode +
                            '(arguments[0])"))["join"]([])'
                        );
                }
                else
                {
                    output =
                        this.replaceExpr('Function("return String.' + fromCharCode + '(" +') +
                        charCodes + this.replaceExpr('+ ")")()');
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
                                function (amending)
                                {
                                    return '/' + amending + '/g';
                                }
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
                '(' + Object.keys(SIMPLE).join('|') + ')' +
                '|(' + Object.keys(COMPLEX).filter(callback, this).join('|') + ')' +
                '|([^])';
            this.stringTokenPattern = stringTokenPattern;
            return stringTokenPattern;
        },
        
        encode: function (input, wrapWith)
        {
            var output =
                this.callCoders(
                    input,
                    wrapWith === 'none',
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
            if (output == null)
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
            var cache = new Empty();
            var charCodes =
                this.replaceNumberArray(
                    Array.prototype.map.call(
                        input,
                        function (char)
                        {
                            var charCode =
                                cache[char] || (cache[char] = char.charCodeAt().toString(radix));
                            return charCode;
                        }
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
            var charMap = new Empty();
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
            var legend = this.encodeDictLegend(dictChars, maxLength - minFreqIndexLength);
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
        
        encodeDictLegend: function (dictChars, maxLength)
        {
            if (!(maxLength < 0))
            {
                var input = dictChars.join('');
                var output =
                    this.callCoders(
                        input,
                        true,
                        ['byCharCodesRadix4', 'byCharCodes', 'plain'],
                        'legend'
                    );
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
        
        findOptimalSolution: function (entries, defaultResolver)
        {
            var result;
            entries = expandEntries(entries);
            entries.forEach(
                function (entry, entryIndex)
                {
                    if (this.hasFeatures(entry.featureMask))
                    {
                        var definition = entry.definition;
                        var solution = definition ? this.resolve(definition) : defaultResolver();
                        if (!result || result.length >= solution.length)
                        {
                            result = solution;
                            solution.entryIndex = entryIndex;
                        }
                    }
                },
                this
            );
            return result;
        },
        
        hasFeatures: function (featureMask)
        {
            return (featureMask & this.featureMask) === featureMask;
        },
        
        hexCodeOf: function (charCode, length)
        {
            var optimalB = this.findBestDefinition([define('B'), define('b', 'ENTRIES_OBJ')]);
            var result = charCode.toString(16).replace(/b/g, optimalB);
            result = Array(length - result.length + 1).join(0) + result.replace(/fa?$/, 'false');
            return result;
        },
        
        // The maximum value that can be safely used as the first group threshold of a ScrewBuffer.
        // "Safely" means such that the extreme decoding test is passed in all engines.
        // This value is typically limited by the free memory available on the stack, and since the
        // memory layout of the stack changes at runtime in an unstable way, the maximum safe value
        // cannot be determined exactly.
        // The lowest recorded value so far is 1844, measured in an Android Browser 4.2.2 running on
        // an Intel Atom emulator.
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
            var str = array.join(false);
            var replacement = this.replaceString(str, true, true, maxLength);
            if (replacement)
            {
                var result = replacement + this.replaceExpr('["split"](false)');
                if (!(result.length > maxLength))
                {
                    return result;
                }
            }
        },
        
        replaceString: function (str, strongBound, forceString, maxLength)
        {
            function makeRegExp()
            {
                regExp = new RegExp(stringTokenPattern, 'g');
            }
            
            var buffer = new ScrewBuffer(strongBound, forceString, this.maxGroupThreshold);
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
                var token;
                var solution;
                if (token = match[1])
                {
                    solution = resolveSimple(token);
                }
                else if (token = match[2])
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
                    token = match[3];
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
                        var defaultResolver = defaultResolveCharacter.bind(this, char);
                        solution = this.findOptimalSolution(entries, defaultResolver);
                        if (!solution)
                        {
                            solution = defaultResolver();
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
    
    assignNoEnum(Encoder.prototype, encoderProtoSource);
    
    expandEntries =
        function (entries)
        {
            if (!Array.isArray(entries))
            {
                entries = [define(entries)];
            }
            return entries;
        };
}
)();

var trimJS;

(function ()
{
    'use strict';
    
    var regExp =
        RegExp(
            '[\n\r]+(?:\\s|//(?:(?!\\*/|`)[^\n\r])*(?![^\n\r])|/\\*(?:(?!`)(?:[^*]|\\*[^/]))*?\\*' +
            '/)*$'
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
}
)();

var JScrewIt;
var getValidFeatureMask;
var setUp;

(function ()
{
    'use strict';
    
    /**
     * Encodes a given string into JSFuck.
     *
     * @function JScrewIt.encode
     *
     * @param {string} input The string to encode.
     *
     * @param {object} [options={ }] An optional object specifying encoding options.
     *
     * @param {FeatureElement|CompatibleFeatureArray} [options.features=JScrewIt.Feature.DEFAULT]
     * Specifies the features available on the engines that evaluate the encoded output.
     *
     * If this parameter is unspecified, [`JScrewIt.Feature.DEFAULT`](Features.md#DEFAULT) is
     * assumed: this ensures maximum compatibility but also generates the largest code.
     * To generate shorter code, specify all features available on all target engines explicitly.
     *
     * @param {boolean} [options.trimCode=false]
     * If this parameter is truthy, lines in the beginning and in the end of the file containing
     * nothing but space characters and JavaScript comments are removed from the generated output.
     * A newline terminator in the last preserved line is also removed.
     *
     * This option is especially useful to strip banner comments and trailing newline characters
     * which are sometimes found in minified scripts.
     *
     * Using this option may produce unexpected results if the input is not well-formed JavaScript
     * code.
     *
     * @param {string} [options.wrapWith=none]
     * This option controls the type of code generated from the given input.
     * Allowed values are listed below.
     *
     * <dl>
     *
     * <dt><code>"none"</code> (default)</dt>
     * <dd>
     * Produces a string evaluating to the specified input string (except for trimmed parts when
     * used in conjunction with the option <code>trimCode</code>).</dd>
     *
     * <dt><code>"call"</code></dt>
     * <dd>
     * Produces code evaluating to a call to a function whose body contains the specified input
     * string.</dd>
     *
     * <dt><code>"eval"</code></dt>
     * <dd>
     * Produces code evaluating to the result of invoking <code>eval</code> with the specified
     * input string as parameter.</dd>
     *
     * </dl>
     *
     * @returns {string} The encoded string.
     *
     * @throws
     * In the hypothetical case that the input string is too complex to be encoded, this function
     * throws an `Error` with the message "Encoding failed".
     * Also, an out of memory condition may occur when processing very large data.
     *
     * If some unknown features are specified, a `ReferenceError` is thrown.
     *
     * If the option `wrapWith` is specified with an invalid value, an `Error` with the message
     * "Invalid value for option wrapWith" is thrown.
     */
    
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
    
    var encoders = new Empty();
    
    /** @namespace JScrewIt */
    JScrewIt = assignNoEnum({ }, { Feature: Feature, encode: encode });
    
    getValidFeatureMask =
        function (features)
        {
            var mask = features !== undefined ? validMaskFromArrayOrStringOrFeature(features) : 0;
            return mask;
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
}
)();

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
        
        function createFeatureFromMask(mask)
        {
            var featureObj = isMaskCompatible(mask) ? featureFromMask(mask) : null;
            return featureObj;
        }
        
        function createScrewBuffer(strongBound, forceString, groupThreshold)
        {
            var buffer = new ScrewBuffer(strongBound, forceString, groupThreshold);
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
        
        var debug =
            assignNoEnum(
                { },
                {
                    createEncoder:          createEncoder,
                    createFeatureFromMask:  createFeatureFromMask,
                    createScrewBuffer:      createScrewBuffer,
                    defineConstant:         defineConstant,
                    getCharacterEntries:    getCharacterEntries,
                    getCoders:              getCoders,
                    getComplexEntries:      getComplexEntries,
                    getConstantEntries:     getConstantEntries,
                    hasOuterPlus:           hasOuterPlus,
                    setUp:                  setUp,
                    trimJS:                 trimJS,
                }
            );
        assignNoEnum(JScrewIt, { debug: debug });
    }
    )();
}

})();
