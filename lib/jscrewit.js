// JScrewIt 1.9.4 – http://jscrew.it
(function ()
{

var Empty;

var assignNoEnum;
var create;
var createConstructor;
var defineProperty;
var isArray;
var keys;
var noProto;

(function ()
{
    'use strict';
    
    assignNoEnum =
        function (target, source)
        {
            var descriptors = { };
            keys(source).forEach(
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
    
    create = Object.create;
    
    createConstructor =
        function (prototype)
        {
            var constructor = Function();
            constructor.prototype = prototype;
            return constructor;
        };
    
    defineProperty = Object.defineProperty;
    
    isArray = Array.isArray;
    
    keys = Object.keys;
    
    noProto =
        function (obj)
        {
            var result = new Empty();
            keys(obj).forEach(
                function (name)
                {
                    result[name] = obj[name];
                }
            );
            return result;
        };
    
    Empty = createConstructor(create(null));
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
            compatible = true;
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
                        result = otherMask === mask;
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
            result = null;
        return result;
    }
    
    function completeFeature(name)
    {
        var mask;
        var featureObj = ALL[name];
        if (featureObj)
            mask = featureObj.mask;
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
                        autoMask |= mask;
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
                featureObj = createFeature(name, info.description, mask, check, info.attributes);
                if (check)
                    elementaryFeatureObjs.push(featureObj);
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
    
    function createFeature(name, description, mask, check, attributes)
    {
        var featureObj =
            create(
                Feature.prototype,
                {
                    attributes: { value: Object.freeze(attributes || { }) },
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
        defineProperty(featureObj, 'mask', { value: mask });
    }
    
    function isExcludingAttribute(attributeCache, attributeName, featureObjs)
    {
        var result = attributeCache[attributeName];
        if (result === undefined)
        {
            attributeCache[attributeName] =
                result =
                featureObjs.some(
                    function (featureObj)
                    {
                        return attributeName in featureObj.attributes;
                    }
                );
        }
        return result;
    }
    
    function maskFromStringOrFeature(arg)
    {
        var mask;
        if (arg instanceof Feature)
            mask = arg.mask;
        else
        {
            var name = arg + '';
            var featureObj = ALL[name];
            if (!featureObj)
                throw new ReferenceError('Unknown feature ' + JSON.stringify(name));
            mask = featureObj.mask;
        }
        return mask;
    }
    
    function registerFeature(name, featureObj)
    {
        var descriptor = { enumerable: true, value: featureObj };
        defineProperty(Feature, name, descriptor);
        defineProperty(ALL, name, descriptor);
    }
    
    function validateMask(mask)
    {
        if (!isMaskCompatible(mask))
            throw new ReferenceError('Incompatible features');
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
            validateMask(mask);
        return mask;
    }
    
    var ALL = new Empty();
    
    var FEATURE_INFOS =
    {
        ANY_DOCUMENT:
        {
            description:
                'Existence of the global object property document whose string representation ' +
                'starts with "[object " and ends with "Document]".',
            check: function ()
            {
                return typeof document === 'object' && /^\[object .*Document]$/.test(document + '');
            },
            attributes: { 'web-worker': 'web-worker-restriction' }
        },
        ANY_WINDOW:
        {
            description:
                'Existence of the global object property self whose string representation starts ' +
                'with "[object " and ends with "Window]".',
            check: checkSelfFeature.bind(
                function (str)
                {
                    return /^\[object .*Window]$/.test(str);
                }
            ),
            includes: ['SELF_OBJ'],
            attributes: { 'web-worker': 'web-worker-restriction' }
        },
        ARRAY_ITERATOR:
        {
            description:
                'The property that the string representation of Array.prototype.entries() starts ' +
                'with "[object Array" and ends with "]" at index 21 or 22.',
            check: function ()
            {
                return Array.prototype.entries && /^\[object Array.{8,9}]$/.test([].entries());
            },
            excludes: ['ENTRIES_PLAIN'],
            includes: ['ENTRIES_OBJ']
        },
        ARROW:
        {
            description: 'Support for arrow functions.',
            check: function ()
            {
                try
                {
                    Function('()=>{}')();
                    return true;
                }
                catch (error)
                { }
            }
        },
        ATOB:
        {
            description: 'Existence of the global object functions atob and btoa.',
            check: function ()
            {
                return typeof atob === 'function' && typeof btoa === 'function';
            }
        },
        BARPROP:
        {
            description:
                'Existence of the global object property toolbar having the string ' +
                'representation "[object BarProp]"',
            check: function ()
            {
                return typeof toolbar === 'object' && toolbar + '' === '[object BarProp]';
            },
            attributes: { 'web-worker': 'web-worker-restriction' }
        },
        CAPITAL_HTML:
        {
            description:
                'The property that the various string methods returning HTML code such as ' +
                'String.prototype.big or String.prototype.link have both the tag name and ' +
                'attributes written in capital letters.',
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
                'representation "[object Document]".',
            check: function ()
            {
                return typeof document === 'object' && document + '' === '[object Document]';
            },
            excludes: ['HTMLDOCUMENT'],
            includes: ['ANY_DOCUMENT'],
            attributes: { 'web-worker': 'web-worker-restriction' }
        },
        DOMWINDOW:
        {
            description:
                'Existence of the global object property self having the string representation ' +
                '"[object DOMWindow]".',
            check: checkSelfFeature.bind(
                function (str)
                {
                    return str + '' === '[object DOMWindow]';
                }
            ),
            includes: ['ANY_WINDOW'],
            excludes: ['WINDOW'],
            attributes: { 'web-worker': 'web-worker-restriction' }
        },
        ENTRIES_OBJ:
        {
            description:
                'The property that the string representation of Array.prototype.entries() starts ' +
                'with "[object ".',
            check: function ()
            {
                return Array.prototype.entries && /^\[object /.test([].entries());
            }
        },
        ENTRIES_PLAIN:
        {
            description:
                'The property that the string representation of Array.prototype.entries() ' +
                'evaluates to "[object Object]".',
            check: function ()
            {
                return Array.prototype.entries && [].entries() + '' === '[object Object]';
            },
            excludes: ['ARRAY_ITERATOR'],
            includes: ['ENTRIES_OBJ']
        },
        ESC_HTML_ALL:
        {
            description:
                'The property that double quotation mark, less than and greater than characters ' +
                'in the argument of String.prototype.fontcolor are escaped into their respective ' +
                'HTML entities.',
            check: function ()
            {
                var available = ''.fontcolor('"<>').indexOf('&quot;&lt;&gt;') >= 0;
                return available;
            },
            excludes: ['ESC_HTML_QUOT_ONLY'],
            includes: ['ESC_HTML_QUOT']
        },
        ESC_HTML_QUOT:
        {
            description:
                'The property that double quotation marks in the argument of ' +
                'String.prototype.fontcolor are escaped as "&quot;".',
            check: function ()
            {
                var available = ''.fontcolor('"').indexOf('&quot;') >= 0;
                return available;
            }
        },
        ESC_HTML_QUOT_ONLY:
        {
            description:
                'The property that only double quotation marks and no other characters in the ' +
                'argument of String.prototype.fontcolor are escaped into HTML entities.',
            check: function ()
            {
                var available = ''.fontcolor('"<>').indexOf('&quot;<>') >= 0;
                return available;
            },
            excludes: ['ESC_HTML_ALL'],
            includes: ['ESC_HTML_QUOT']
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
            description: 'Existence of the native function Array.prototype.fill.',
            check: function ()
            {
                return Array.prototype.fill;
            }
        },
        FROM_CODE_POINT:
        {
            description: 'Existence of the function String.fromCodePoint.',
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
        HISTORY:
        {
            description:
                'Existence of the global object property history having the string ' +
                'representation "[object History]"',
            check: function ()
            {
                return typeof history === 'object' && history + '' === '[object History]';
            },
            attributes: { 'web-worker': 'web-worker-restriction' }
        },
        HTMLDOCUMENT:
        {
            description:
                'Existence of the global object property document having the string ' +
                'representation "[object HTMLDocument]".',
            check: function ()
            {
                return typeof document === 'object' && document + '' === '[object HTMLDocument]';
            },
            excludes: ['DOCUMENT'],
            includes: ['ANY_DOCUMENT'],
            attributes: { 'web-worker': 'web-worker-restriction' }
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
        INTL:
        {
            description: 'Existence of the global object property Intl.',
            check: function ()
            {
                return typeof Intl === 'object';
            }
        },
        LOCALE_INFINITY:
        {
            description: 'Language sensitive string representation of Infinity as "∞".',
            check: function ()
            {
                return Infinity.toLocaleString() === '∞';
            }
        },
        NAME:
        {
            description: 'Existence of the name property for functions.',
            check: function ()
            {
                return 'name' in Function();
            }
        },
        NO_IE_SRC:
        {
            description:
                'A string representation of native functions typical for most engines with the ' +
                'notable exception of Internet Explorer.\n' +
                'A remarkable trait of this feature is the lack of extra characters in the ' +
                'beginning of the string before "function".',
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
                'evaluates to "[object Array Iterator]".',
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
                'engines with the notable exception of Safari versions prior to 9.\n' +
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
                'evaluates to "[object ArrayIterator]".',
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
                'with "[object ".',
            check: checkSelfFeature.bind(
                function (str)
                {
                    return /^\[object /.test(str);
                }
            ),
            attributes: { 'web-worker': 'safari-bug-21820506' }
        },
        UNDEFINED:
        {
            description:
                'The property that Object.prototype.toString.call() evaluates to "[object ' +
                'Undefined]".\n' +
                'This behavior is specified by ECMAScript, and is supported by all engines ' +
                'except Android Browser versions prior to 4.1.2, where this feature is not ' +
                'available.',
            check: function ()
            {
                return Object.prototype.toString.call() === '[object Undefined]';
            }
        },
        V8_SRC:
        {
            description:
                'A string representation of native functions typical for the V8 engine, but also ' +
                'found in Microsoft Edge.\n' +
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
                '"[object Window]".',
            check: checkSelfFeature.bind(
                function (str)
                {
                    return str === '[object Window]';
                }
            ),
            includes: ['ANY_WINDOW'],
            excludes: ['DOMWINDOW'],
            attributes: { 'web-worker': 'web-worker-restriction' }
        },
        
        DEFAULT:
        {
            description: 'Minimun feature level, compatible with all supported engines.'
        },
        COMPACT:
        {
            description:
                'All new browsers\' features.\n' +
                'No support for Node.js and older browsers like Internet Explorer, Safari 8 or ' +
                'Android Browser',
            includes:
            [
                'ATOB',
                'BARPROP',
                'ENTRIES_OBJ',
                'ESC_HTML_QUOT_ONLY',
                'FILL',
                'FROM_CODE_POINT',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'NAME',
                'NO_IE_SRC',
                'NO_OLD_SAFARI_LF',
                'UNDEFINED',
                'WINDOW'
            ],
            attributes: { 'safari-bug-21820506': null, 'web-worker-restriction': null }
        },
        ANDRO400:
        {
            description: 'Features available in Android Browser 4.0 to 4.3.1.',
            includes:
            [
                'ATOB',
                'DOMWINDOW',
                'ESC_HTML_ALL',
                'GMT',
                'HISTORY',
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
                'ESC_HTML_ALL',
                'GMT',
                'HISTORY',
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
                'BARPROP',
                'ESC_HTML_ALL',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_LF',
                'UNDEFINED',
                'V8_SRC',
                'WINDOW'
            ],
            attributes: { 'web-worker-restriction': null }
        },
        CHROME: 'CHROME45',
        CHROME45:
        {
            description: 'Features available in Chrome 45 and Opera 32 or later.',
            includes:
            [
                'ARROW',
                'ATOB',
                'BARPROP',
                'ESC_HTML_QUOT_ONLY',
                'FILL',
                'FROM_CODE_POINT',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'NO_OLD_SAFARI_LF',
                'UNDEFINED',
                'V8_SRC',
                'WINDOW'
            ],
            attributes: { 'web-worker-restriction': null }
        },
        EDGE:
        {
            description: 'Features available in Microsoft Edge.',
            includes:
            [
                'ARROW',
                'ATOB',
                'BARPROP',
                'ESC_HTML_QUOT_ONLY',
                'ENTRIES_PLAIN',
                'FILL',
                'FROM_CODE_POINT',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_LF',
                'UNDEFINED',
                'V8_SRC',
                'WINDOW'
            ],
            attributes: { 'web-worker-restriction': null }
        },
        FF: 'FF31',
        FF31:
        {
            description: 'Features available in Firefox 31 or later.',
            includes:
            [
                'ARROW',
                'ATOB',
                'BARPROP',
                'ESC_HTML_QUOT_ONLY',
                'FF_SAFARI_SRC',
                'FILL',
                'FROM_CODE_POINT',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'NO_OLD_SAFARI_LF',
                'UNDEFINED',
                'WINDOW'
            ],
            attributes: { 'web-worker-restriction': null }
        },
        IE9:
        {
            description: 'Features available in Internet Explorer 9 or later.',
            includes:
            [
                'CAPITAL_HTML',
                'DOCUMENT',
                'HISTORY',
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
                'HISTORY',
                'IE_SRC',
                'NO_OLD_SAFARI_LF',
                'UNDEFINED',
                'WINDOW'
            ],
            attributes: { 'web-worker-restriction': null }
        },
        IE11:
        {
            description: 'Features available in Internet Explorer 11.',
            includes:
            [
                'ATOB',
                'CAPITAL_HTML',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'IE_SRC',
                'INTL',
                'NO_OLD_SAFARI_LF',
                'UNDEFINED',
                'WINDOW'
            ],
            attributes: { 'web-worker-restriction': null }
        },
        IE11_WIN10:
        {
            description: 'Features available in Internet Explorer 11 on Windows 10.',
            includes:
            [
                'ATOB',
                'CAPITAL_HTML',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'IE_SRC',
                'INTL',
                'LOCALE_INFINITY',
                'NO_OLD_SAFARI_LF',
                'UNDEFINED',
                'WINDOW'
            ],
            attributes: { 'web-worker-restriction': null }
        },
        NODE010:
        {
            description: 'Features available in Node.js 0.10.',
            includes:
            [
                'ESC_HTML_ALL',
                'GMT',
                'NAME',
                'NO_OLD_SAFARI_LF',
                'UNDEFINED',
                'V8_SRC'
            ]
        },
        NODE012:
        {
            description: 'Features available in Node.js 0.12 or later.',
            includes:
            [
                'ESC_HTML_QUOT_ONLY',
                'GMT',
                'INTL',
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
            description: 'Features available in Node.js 4.0 or later.',
            includes:
            [
                'ARROW',
                'ESC_HTML_QUOT_ONLY',
                'FILL',
                'FROM_CODE_POINT',
                'GMT',
                'INTL',
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
                'BARPROP',
                'ESC_HTML_QUOT_ONLY',
                'FF_SAFARI_SRC',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'NAME',
                'UNDEFINED',
                'WINDOW'
            ],
            attributes: { 'web-worker-restriction': null }
        },
        SAFARI71:
        {
            description: 'Features available in Safari 7.1.',
            includes:
            [
                'ATOB',
                'BARPROP',
                'ESC_HTML_QUOT_ONLY',
                'FF_SAFARI_SRC',
                'FILL',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'NAME',
                'OLD_SAFARI_ARRAY_ITERATOR',
                'UNDEFINED',
                'WINDOW'
            ],
            attributes: { 'web-worker-restriction': null }
        },
        SAFARI80:
        {
            description: 'Features available in Safari 8.0.',
            includes:
            [
                'ATOB',
                'BARPROP',
                'ESC_HTML_QUOT_ONLY',
                'FF_SAFARI_SRC',
                'FILL',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'NAME',
                'OLD_SAFARI_ARRAY_ITERATOR',
                'UNDEFINED',
                'WINDOW'
            ],
            attributes: { 'safari-bug-21820506': null, 'web-worker-restriction': null }
        },
        SAFARI90:
        {
            description: 'Features available in Safari 9.0 or later.',
            includes:
            [
                'ATOB',
                'BARPROP',
                'ESC_HTML_QUOT_ONLY',
                'FF_SAFARI_SRC',
                'FILL',
                'FROM_CODE_POINT',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'NO_OLD_SAFARI_LF',
                'UNDEFINED',
                'WINDOW'
            ],
            attributes: { 'safari-bug-21820506': null, 'web-worker-restriction': null }
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
            var featureObj = this instanceof Feature ? this : create(Feature.prototype);
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
            var names = keys(featureNameSet).sort();
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
                        names.push(featureObj.name);
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
         * Creates a new feature object from this feature by removing elementary features that are
         * not available inside a particular environment.
         *
         * This method is useful to selectively exclude features that are available inside a web
         * worker.
         *
         * @function JScrewIt.Feature#restrict
         *
         * @param {string} environment
         * The environment to which this feature should be restricted.
         * The only environment currently supported is `"web-worker"`.
         *
         * @param {JScrewIt.Feature[]} [referenceFeatureObjs]
         * An array of predefined feature objects, each corresponding to a particular engine in
         * which the restriction should be enacted.
         * If this parameter is omitted, the restriction is enacted in all engines.
         *
         * @returns {JScrewIt.Feature}
         * A feature object.
         */
        
        restrict: function (environment, referenceFeatureObjs)
        {
            var resultMask = 0;
            var thisMask = this.mask;
            var attributeCache = new Empty();
            elementaryFeatureObjs.forEach(
                function (featureObj)
                {
                    var otherMask = featureObj.mask;
                    var included = (otherMask & thisMask) === otherMask;
                    if (included)
                    {
                        var attributeValue = featureObj.attributes[environment];
                        if (
                            attributeValue === undefined ||
                            referenceFeatureObjs !== undefined &&
                            !isExcludingAttribute(
                                attributeCache,
                                attributeValue,
                                referenceFeatureObjs))
                            resultMask |= otherMask;
                    }
                }
            );
            var result = featureFromMask(resultMask);
            return result;
        },
        
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
                name = '{' + this.canonicalNames.join(', ') + '}';
            var str = '[Feature ' + name + ']';
            return str;
        }
    };
    assignNoEnum(Feature.prototype, FEATURE_PROTO_PROPS);
    
    featureFromMask =
        function (mask)
        {
            var featureObj = create(Feature.prototype);
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
                    validateMask(mask);
            }
            else
                mask = maskFromStringOrFeature(arg);
            return mask;
        };
    
    var autoMask = 0;
    var bitIndex = 0;
    var elementaryFeatureObjs = [];
    var includesMap = new Empty();
    var incompatibleMasks = [];
    
    var featureNames = keys(FEATURE_INFOS);
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
            define('btoa(3)[1]', 'ATOB'),
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
            define('(RP_4_N + ""["fontcolor"]())["10"]', 'CAPITAL_HTML'),
            define()
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
            define('btoa(1)[1]', 'ATOB')
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
            define('btoa(undefined)["10"]', 'ATOB')
        ],
        'W':
        [
            define('(self + RP_4_N)[SUBSTR]("-11")[0]', 'ANY_WINDOW'),
            define('btoa(undefined)[1]', 'ATOB'),
            define('(self + [])["11"]', 'DOMWINDOW'),
            define('(RP_3_NO + self)["11"]', 'WINDOW')
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
            define('(RP_1_NO + FILTER)["20"]', 'V8_SRC'),
            define('(RP_5_N + FILL)["20"]', 'NO_IE_SRC', 'FILL'),
            define('(FILTER + [])["20"]', 'FF_SAFARI_SRC'),
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
            define(undefined, 'ATOB')
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

var getFigure;

(function ()
{
    'use strict';
    
    function createFigure(value, sortLength)
    {
        var figure = Object(value);
        figure.sortLength = sortLength;
        return figure;
    }
    
    function growFigure(figure)
    {
        var baseValue = figure.valueOf();
        var baseSortLength = figure.sortLength;
        UNITS.forEach(
            function (unit)
            {
                var value = baseValue + unit;
                if (!(value in usedNameSet))
                {
                    usedNameSet[value] = null;
                    var sortLength = baseSortLength + unit.sortLength;
                    var figure = createFigure(value, sortLength);
                    pushFigure(figure);
                }
            }
        );
    }
    
    function pushFigure(figure)
    {
        var sortLength = figure.sortLength;
        var figures = figureList[sortLength] || (figureList[sortLength] = []);
        figures.push(figure);
    }
    
    function useFigure(figure)
    {
        figures.push(figure);
    }
    
    var EMPTY_FIGURE = createFigure('', 0);
    
    var MIN_CHAIN_LENGTH = 5;
    
    var UNITS =
    [
        createFigure('true', 5),
        createFigure('0', 6),
        createFigure('undefined', 7),
        createFigure('1', 8),
        createFigure('NaN', 9),
        createFigure('2', 12),
        createFigure('f', 14),
        createFigure('t', 15),
        createFigure('a', 16),
        createFigure('3', 17),
        createFigure('N', 17),
        createFigure('r', 17),
        createFigure('u', 17),
        createFigure('n', 19),
        createFigure('l', 20),
        createFigure('4', 22),
        createFigure('d', 23),
        createFigure('s', 25),
        createFigure('e', 26),
        createFigure('5', 27),
        createFigure('i', 28),
        createFigure('6', 32),
        createFigure('7', 37),
        createFigure('8', 42),
    ];
    
    var figureIndex = 0;
    var figureList = [[EMPTY_FIGURE]];
    var figures = [EMPTY_FIGURE];
    var usedNameSet = new Empty();
    UNITS.forEach(
        function (unit)
        {
            usedNameSet[unit] = null;
            pushFigure(unit);
        }
    );
    
    getFigure =
        function (index)
        {
            while (figures.length <= index)
            {
                var usedFigures = figureList[figureIndex];
                if (usedFigures)
                {
                    usedFigures.forEach(growFigure);
                    delete figureList[figureIndex];
                }
                var newFigures = figureList[figureIndex + MIN_CHAIN_LENGTH];
                newFigures.forEach(useFigure);
                ++figureIndex;
            }
            var figure = figures[index];
            return figure;
        };
}
)();

// This implementation assumes that all numeric solutions have an outer plus, and all other
// character solutions have none.

var ScrewBuffer;

var getAppendLength;
var hasOuterPlus;

(function ()
{
    'use strict';
    
    function getNumericJoinCost(level0, level1)
    {
        var joinCost = level0 > LEVEL_UNDEFINED || level1 > LEVEL_UNDEFINED ? 2 : 3;
        return joinCost;
    }
    
    function isNumericJoin(level0, level1)
    {
        var result = level0 < LEVEL_OBJECT && level1 < LEVEL_OBJECT;
        return result;
    }
    
    // The solution parameter must already have the outerPlus property set.
    function pushSolution(array, solution)
    {
        if (solution.outerPlus)
            array.push('+(', solution, ')');
        else
            array.push('+', solution);
    }
    
    ScrewBuffer =
        function (strongBound, forceString, groupThreshold)
        {
            function canSplitRightEndForFree(lastBridgeIndex, limit)
            {
                var rightEndIndex = lastBridgeIndex + 1;
                var rightEndLength = limit - rightEndIndex;
                var result =
                    rightEndLength > 2 ||
                    rightEndLength > 1 && !isUnluckyRightEnd(rightEndIndex);
                return result;
            }
            
            function findLastBridge(offset, limit)
            {
                for (var index = limit; index-- > offset;)
                {
                    var solution = solutions[index];
                    if (solution.bridge)
                        return index;
                }
            }
            
            function findNextBridge(index)
            {
                for (;; ++index)
                {
                    var solution = solutions[index];
                    if (solution.bridge)
                        return index;
                }
            }
            
            function findSplitIndex(
                offset,
                limit,
                intrinsicSplitCost,
                firstBridgeIndex,
                lastBridgeIndex)
            {
                var index = offset + 1;
                var lastIndex = firstBridgeIndex - 1;
                var optimalSplitCost = getSplitCostAt(index, true, index === lastIndex);
                var splitIndex = index;
                while (++index < firstBridgeIndex)
                {
                    var splitCost = getSplitCostAt(index, false, index === lastIndex);
                    if (splitCost < optimalSplitCost)
                    {
                        optimalSplitCost = splitCost;
                        splitIndex = index;
                    }
                }
                if (
                    optimalSplitCost + intrinsicSplitCost < 0 &&
                    !(optimalSplitCost > 0 && canSplitRightEndForFree(lastBridgeIndex, limit)))
                    return splitIndex;
            }
            
            function gather(offset, count, localStrongBound, localForceString)
            {
                function appendRightGroup(groupCount)
                {
                    array.push(sequenceAsString(index, groupCount, '[[]]'), ')');
                }
                
                var limit;
                var lastBridgeIndex;
                if (bridgeUsed)
                {
                    limit = offset + count;
                    lastBridgeIndex = findLastBridge(offset, limit);
                }
                var array;
                var multiPart = lastBridgeIndex == null;
                if (multiPart)
                    array = sequence(offset, count);
                else
                {
                    var bridgeIndex = findNextBridge(offset);
                    var index;
                    if (bridgeIndex - offset > 1)
                    {
                        var intrinsicSplitCost = localForceString ? -3 : localStrongBound ? 2 : 0;
                        index =
                            findSplitIndex(
                                offset,
                                limit,
                                intrinsicSplitCost,
                                bridgeIndex,
                                lastBridgeIndex
                            );
                    }
                    multiPart = index != null;
                    if (multiPart)
                    {
                        // Keep the first solutions out of the concat context to reduce output
                        // length.
                        var preBridgeCount = index - offset;
                        array =
                            preBridgeCount > 1 ?
                            sequence(offset, preBridgeCount) : [solutions[offset]];
                        array.push('+');
                    }
                    else
                    {
                        array = [];
                        index = offset;
                    }
                    array.push('[', sequenceAsString(index, bridgeIndex - index, '[]'), ']');
                    for (;;)
                    {
                        array.push(solutions[bridgeIndex].bridge.block, '(');
                        index = bridgeIndex + 1;
                        if (bridgeIndex === lastBridgeIndex)
                            break;
                        bridgeIndex = findNextBridge(index);
                        appendRightGroup(bridgeIndex - index);
                    }
                    var groupCount;
                    var rightEndCount = limit - index;
                    if (localForceString && !multiPart && rightEndCount > 1)
                    {
                        groupCount = rightEndCount > 2 && isUnluckyRightEnd(index) ? 2 : 1;
                        multiPart = true;
                    }
                    else
                        groupCount = rightEndCount;
                    appendRightGroup(groupCount);
                    index += groupCount - 1;
                    while (++index < limit)
                        pushSolution(array, solutions[index]);
                    if (!multiPart && localForceString)
                    {
                        array.push('+[]');
                        multiPart = true;
                    }
                }
                var str = array.join('');
                if (localStrongBound && multiPart)
                    str = '(' + str + ')';
                return str;
            }
            
            function getSplitCostAt(index, leftmost, rightmost)
            {
                var solutionCenter = solutions[index];
                var levelCenter = solutionCenter.level;
                var levelLeft;
                var levelRight;
                var solutionRight;
                var splitCost =
                (
                    rightmost && levelCenter < LEVEL_NUMERIC ?
                    3 :
                    isNumericJoin(
                        levelCenter,
                        levelRight = (solutionRight = solutions[index + 1]).level) ?
                    getNumericJoinCost(levelCenter, levelRight) -
                    (solutionRight.outerPlus ? 2 : 0) :
                    0
                ) -
                (
                    leftmost &&
                    isNumericJoin(levelCenter, levelLeft = solutions[index - 1].level) ?
                    getNumericJoinCost(levelLeft, levelCenter) :
                    solutionCenter.outerPlus ? 2 : 0
                );
                return splitCost;
            }
            
            function isUnluckyRightEnd(firstIndex)
            {
                var result =
                    solutions[firstIndex].level < LEVEL_NUMERIC &&
                    solutions[firstIndex + 1].level > LEVEL_UNDEFINED;
                return result;
            }
            
            function sequence(offset, count)
            {
                var array;
                var solution0 = solutions[offset];
                var solution1 = solutions[offset + 1];
                if (solution0.level < LEVEL_OBJECT && solution1.level < LEVEL_OBJECT)
                {
                    if (solution1.level > LEVEL_UNDEFINED)
                        array = [solution0, '+[', solution1, ']'];
                    else if (solution0.level > LEVEL_UNDEFINED)
                        array = ['[', solution0, ']+', solution1];
                    else
                        array = [solution0, '+[]+', solution1];
                }
                else
                {
                    array = [solution0];
                    pushSolution(array, solution1);
                }
                for (var index = 2; index < count; ++index)
                {
                    var solution = solutions[offset + index];
                    pushSolution(array, solution);
                }
                return array;
            }
            
            function sequenceAsString(offset, count, emptyReplacement)
            {
                var str;
                if (count)
                {
                    if (count > 1)
                        str = sequence(offset, count).join('');
                    else
                    {
                        var solution = solutions[offset];
                        str = solution + (solution.level < LEVEL_NUMERIC ? '+[]' : '');
                    }
                }
                else
                    str = emptyReplacement;
                return str;
            }
            
            var bridgeUsed;
            var length = strongBound ? -1 : -3;
            var maxSolutionCount = Math.pow(2, groupThreshold - 1);
            var solutions = [];
            
            assignNoEnum(
                this,
                {
                    append: function (solution)
                    {
                        if (solutions.length >= maxSolutionCount)
                            return false;
                        bridgeUsed |= !!solution.bridge;
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
                            result = length;
                            break;
                        }
                        return result;
                    },
                    toString: function ()
                    {
                        function collectOut(offset, count, maxGroupCount, localStrongBound)
                        {
                            var str;
                            if (count <= groupSize + 1)
                                str = gather(offset, count, localStrongBound);
                            else
                            {
                                maxGroupCount /= 2;
                                var halfCount = groupSize * maxGroupCount;
                                var capacity = 2 * halfCount - count;
                                var leftEndCount =
                                    Math.max(
                                        halfCount - capacity + capacity % (groupSize - 1),
                                        (maxGroupCount / 2 ^ 0) * (groupSize + 1)
                                    );
                                str =
                                    collectOut(offset, leftEndCount, maxGroupCount) +
                                    '+' +
                                    collectOut(
                                        offset + leftEndCount,
                                        count - leftEndCount,
                                        maxGroupCount,
                                        true
                                    );
                                if (localStrongBound)
                                    str = '(' + str + ')';
                            }
                            return str;
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
                            singlePart = !forceString || solution.level > LEVEL_OBJECT;
                            str = solution + (singlePart ? '' : '+[]');
                        }
                        else if (solutionCount <= groupThreshold)
                        {
                            str = gather(0, solutionCount, strongBound, forceString);
                            singlePart = strongBound;
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
                                    break;
                                maxGroupCount *= 2;
                            }
                            str = collectOut(0, solutionCount, maxGroupCount, strongBound);
                            singlePart = strongBound;
                        }
                        if (strongBound && !singlePart)
                            str = '(' + str + ')';
                        return str;
                    }
                }
            );
        };
    
    getAppendLength =
        // This function assumes that only undefined or numeric solutions can have an outer plus.
        function (solution)
        {
            var length;
            var bridge = solution.bridge;
            if (bridge)
                length = bridge.appendLength;
            else
            {
                var extraLength = hasOuterPlus(solution) ? 3 : 1;
                length = solution.length + extraLength;
            }
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

var replaceIndexer;
var resolveSimple;

(function ()
{
    'use strict';
    
    var STATIC_CHAR_CACHE = new Empty();
    var STATIC_CONST_CACHE = new Empty();
    
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
            45
        ),
        byDblDict: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDblDict(inputData, maxLength);
                return output;
            },
            411
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
            349
        ),
        byDictRadix4: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 4, 0, maxLength);
                return output;
            },
            258
        ),
        byDictRadix4AmendedBy1: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 4, 1, maxLength);
                return output;
            },
            358
        ),
        byDictRadix4AmendedBy2: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 4, 2, maxLength);
                return output;
            },
            676
        ),
        byDictRadix5AmendedBy3: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 5, 3, maxLength);
                return output;
            },
            845
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
    
    var quoteString = JSON.stringify;
    
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
                digitLengths[digit] = getAppendLength(SIMPLE[AMENDINGS[index]]);
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
                var result =
                    reindex1.sortLength - reindex2.sortLength ||
                    reindex1.index - reindex2.index;
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
    
    function getFrequencyList(inputData)
    {
        var freqList = inputData.freqList;
        if (!freqList)
        {
            var charMap = new Empty();
            Array.prototype.forEach.call(
                inputData,
                function (char)
                {
                    ++(
                        charMap[char] ||
                        (charMap[char] = { char: char, charCode: char.charCodeAt(), count: 0 })
                    ).count;
                }
            );
            var charList = keys(charMap);
            inputData.freqList = freqList =
                charList.map(
                    function (char)
                    {
                        var freq = charMap[char];
                        return freq;
                    }
                ).sort(
                    function (freq1, freq2)
                    {
                        var diff = freq2.count - freq1.count || freq1.charCode - freq2.charCode;
                        return diff;
                    }
                );
        }
        return freqList;
    }
    
    function initMinCharIndexArrayStrLength(input)
    {
        var minCharIndexArrayStrLength =
            Math.max((input.length - 1) * (SIMPLE['false'].length + 1) - 3, 0);
        return minCharIndexArrayStrLength;
    }
    
    function isFollowedByLeftSquareBracket(expr, offset)
    {
        for (;;)
        {
            var char = expr[offset++];
            if (char === '[')
                return true;
            if (char !== ' ')
                return false;
        }
    }
    
    function isPrecededByOperator(expr, offset)
    {
        for (;;)
        {
            var char = expr[--offset];
            if (char === '+' || char === '!')
                return true;
            if (char !== ' ')
                return false;
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
                replacement += '+[' + replaceDigit(+number[index]) + ']';
            if (length > 1)
                replacement = '+(' + replacement + ')';
            if (isStrongBoundRequired(expr, offset, wholeMatch))
                replacement = '(' + replacement + ')';
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
                this.throwSyntaxError('String too complex');
        }
        else if (space)
            replacement = '';
        else if (literal)
        {
            var solution;
            if (literal in this.constantDefinitions)
                solution = this.resolveConstant(literal);
            else if (literal in SIMPLE)
                solution = SIMPLE[literal];
            if (!solution)
                this.throwSyntaxError('Undefined literal ' + literal);
            var groupingRequired;
            if (isFollowedByLeftSquareBracket(expr, offset + wholeMatch.length))
                groupingRequired = solution[0] === '!' || hasOuterPlus(solution);
            else if (isPrecededByOperator(expr, offset))
                groupingRequired = hasOuterPlus(solution);
            else
                groupingRequired = false;
            replacement = groupingRequired ? '(' + solution + ')' : solution + '';
        }
        else
            this.throwSyntaxError('Unexpected character ' + quoteString(wholeMatch));
        return replacement;
    }
    
    var CharCache = createConstructor(STATIC_CHAR_CACHE);
    var ConstCache = createConstructor(STATIC_CONST_CACHE);
    
    Encoder =
        function (featureMask)
        {
            this.featureMask = featureMask;
            this.charCache = new CharCache();
            this.complexCache = new Empty();
            this.constCache = new ConstCache();
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
                        perfStatus = 'skipped';
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
                                usedPerfInfo.status = 'superseded';
                            usedPerfInfo = perfInfo;
                            perfInfo.outputLength = newOutput.length;
                            perfStatus = 'used';
                        }
                        else
                            perfStatus = 'incomplete';
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
        
        createCharCodesEncoding: function (charCodeArrayStr, long, radix)
        {
            var output;
            var fromCharCode = this.findBestDefinition(FROM_CHAR_CODE);
            if (radix)
            {
                output =
                    charCodeArrayStr +
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
                        charCodeArrayStr +
                        this.replaceExpr(
                            '["map"](Function("return String.' + fromCharCode +
                            '(arguments[0])"))["join"]([])'
                        );
                }
                else
                {
                    output =
                        this.replaceExpr('Function("return String.' + fromCharCode + '(" +') +
                        charCodeArrayStr + this.replaceExpr('+ ")")()');
                }
            }
            return output;
        },
        
        createCharKeyArrayString: function (input, charMap, maxLength)
        {
            var charKeyArray =
                Array.prototype.map.call(
                    input,
                    function (char)
                    {
                        var charKey = charMap[char];
                        return charKey;
                    }
                );
            var charKeyArrayStr = this.replaceFalseFreeArray(charKeyArray, maxLength);
            return charKeyArrayStr;
        },
        
        createDictEncoding: function (
            legend,
            charIndexArrayStr,
            maxLength,
            radix,
            amendings,
            coerceToInt)
        {
            var mapper;
            if (radix)
            {
                var parseIntArg;
                if (amendings)
                {
                    var firstDigit = radix - amendings;
                    var createParseIntArg;
                    if (amendings > 2)
                        createParseIntArg = this.findBestDefinition(CREATE_PARSE_INT_ARG);
                    else
                        createParseIntArg = createParseIntArgDefault;
                    parseIntArg = createParseIntArg(amendings, firstDigit);
                }
                else
                    parseIntArg = 'arguments[0]';
                if (coerceToInt)
                    parseIntArg = '+' + parseIntArg;
                mapper =
                    'Function("return this[parseInt(' + parseIntArg + ',' + radix + ')]")["bind"]';
            }
            else
                mapper = '""["charAt"]["bind"]';
            var output =
                this.createJSFuckArrayMapping(charIndexArrayStr, mapper, legend) +
                this.replaceExpr('["join"]([])');
            if (!(output.length > maxLength))
                return output;
        },
        
        createJSFuckArrayMapping: function (arrayStr, mapper, legend)
        {
            var result =
                arrayStr + this.replaceExpr('["map"]') + '(' + this.replaceExpr(mapper) + '(' +
                legend + '))';
            return result;
        },
        
        createStringTokenPattern: function ()
        {
            function filterCallback(complex)
            {
                var entries = COMPLEX[complex];
                var definition = this.findBestDefinition(entries);
                return definition;
            }
            
            function mapCallback(complex)
            {
                var str = complex + '|';
                return str;
            }
            
            var stringTokenPattern =
                '(' + keys(SIMPLE).join('|') + ')|' +
                keys(COMPLEX).filter(filterCallback, this).map(mapCallback).join('') +
                '([^])';
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
                        'byDblDict',
                        'byDictRadix5AmendedBy3',
                        'byDictRadix4AmendedBy2',
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
                throw new Error('Encoding failed');
            if (wrapWith === 'call')
                output = this.resolveConstant('Function') + '(' + output + ')()';
            else if (wrapWith === 'eval')
                output = this.replaceExpr('Function("return eval")()') + '(' + output + ')';
            return output;
        },
        
        encodeByCharCodes: function (input, long, radix, maxLength)
        {
            var cache = new Empty();
            var charCodeArray =
                Array.prototype.map.call(
                    input,
                    function (char)
                    {
                        var charCode =
                            cache[char] || (cache[char] = char.charCodeAt().toString(radix));
                        return charCode;
                    }
                );
            var charCodeArrayStr = this.replaceFalseFreeArray(charCodeArray, maxLength);
            if (charCodeArrayStr)
            {
                var output = this.createCharCodesEncoding(charCodeArrayStr, long, radix);
                if (!(output.length > maxLength))
                    return output;
            }
        },
        
        encodeByDblDict: function (inputData, maxLength)
        {
            var input = inputData.valueOf();
            var freqList = getFrequencyList(inputData);
            var charMap = new Empty();
            var minCharIndexArrayStrLength = initMinCharIndexArrayStrLength(input);
            var figures =
                freqList.map(
                    function (freq, index)
                    {
                        var figure = getFigure(index);
                        charMap[freq.char] = figure;
                        minCharIndexArrayStrLength += freq.count * figure.sortLength;
                        return figure;
                    }
                );
            var dictChars =
                freqList.map(
                    function (freq)
                    {
                        return freq.char;
                    }
                );
            var legend = this.encodeDictLegend(dictChars, maxLength - minCharIndexArrayStrLength);
            if (!legend)
                return;
            var figureMaxLength = maxLength - legend.length;
            var figureLegend =
                this.replaceFalseFreeArray(figures, figureMaxLength - minCharIndexArrayStrLength);
            if (!figureLegend)
                return;
            var keyFigureArrayStr =
                this.createCharKeyArrayString(
                    input,
                    charMap,
                    figureMaxLength - figureLegend.length
                );
            if (!keyFigureArrayStr)
                return;
            var charIndexArrayStr =
                this.createJSFuckArrayMapping(
                    keyFigureArrayStr,
                    'Function("return this.indexOf(arguments[0])")["bind"]',
                    figureLegend
                );
            var output = this.createDictEncoding(legend, charIndexArrayStr, maxLength);
            return output;
        },
        
        encodeByDict: function (inputData, radix, amendings, maxLength)
        {
            var input = inputData.valueOf();
            var freqList = getFrequencyList(inputData);
            var coerceToInt =
                freqList.length &&
                freqList[0].count * 6 > getAppendLength(STATIC_ENCODER.resolveCharacter('+'));
            var reindexMap = createReindexMap(freqList.length, radix, amendings, coerceToInt);
            var charMap = new Empty();
            var minCharIndexArrayStrLength = initMinCharIndexArrayStrLength(input);
            var dictChars = [];
            freqList.forEach(
                function (freq, index)
                {
                    var reindex = reindexMap[index];
                    var char = freq.char;
                    charMap[char] = reindex;
                    minCharIndexArrayStrLength += freq.count * reindex.sortLength;
                    dictChars[reindex.index] = char;
                }
            );
            var legend = this.encodeDictLegend(dictChars, maxLength - minCharIndexArrayStrLength);
            if (!legend)
                return;
            var charIndexArrayStr =
                this.createCharKeyArrayString(input, charMap, maxLength - legend.length);
            if (!charIndexArrayStr)
                return;
            var output =
                this.createDictEncoding(
                    legend,
                    charIndexArrayStr,
                    maxLength,
                    radix,
                    amendings,
                    coerceToInt
                );
            return output;
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
                    return output;
            }
        },
        
        findBase64AlphabetDefinition: function (element)
        {
            var definition;
            if (isArray(element))
                definition = this.findBestDefinition(element);
            else
                definition = element;
            return definition;
        },
        
        findBestDefinition: function (entries)
        {
            for (var entryIndex = entries.length; entryIndex--;)
            {
                var entry = entries[entryIndex];
                if (this.hasFeatures(entry.featureMask))
                    return entry.definition;
            }
        },
        
        findOptimalSolution: function (entries, defaultResolver)
        {
            var result;
            entries.forEach(
                function (entry, entryIndex)
                {
                    if (this.hasFeatures(entry.featureMask))
                    {
                        var definition = entry.definition;
                        var solution = definition ? this.resolve(definition) : defaultResolver();
                        if (!result || result.length > solution.length)
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
        
        getPaddingBlock: function (paddingInfo, length)
        {
            var paddingBlock = paddingInfo.blocks[length];
            if (paddingBlock !== undefined)
                return paddingBlock;
            this.throwSyntaxError('Undefined padding block with length ' + length);
        },
        
        hasFeatures: function (featureMask)
        {
            return (featureMask & this.featureMask) === featureMask;
        },
        
        hexCodeOf: function (charCode, length)
        {
            var optimalB = this.findBestDefinition(OPTIMAL_B);
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
        
        // Replaces a JavaScript array with a JSFuck array or strings.
        // Array elements may not contain "false" in their string representations, because the value
        // false is used as a separator for the encoding.
        replaceFalseFreeArray: function (array, maxLength)
        {
            var str = array.join(false);
            var replacement = this.replaceString(str, true, true, maxLength);
            if (replacement)
            {
                var result = replacement + this.replaceExpr('["split"](false)');
                if (!(result.length > maxLength))
                    return result;
            }
        },
        
        replaceString: function (str, strongBound, forceString, maxLength)
        {
            var buffer = new ScrewBuffer(strongBound, forceString, this.maxGroupThreshold);
            var stringTokenPattern = this.stringTokenPattern || this.createStringTokenPattern();
            var match;
            var regExp = RegExp(stringTokenPattern, 'g');
            while (match = regExp.exec(str))
            {
                if (buffer.length > maxLength)
                    return;
                var token;
                var solution;
                if (token = match[2])
                    solution = this.resolveCharacter(token);
                else if (token = match[1])
                    solution = SIMPLE[token];
                else
                {
                    token = match[0];
                    solution = this.resolveComplex(token);
                }
                if (!buffer.append(solution))
                    return;
            }
            var result = buffer + '';
            if (!(result.length > maxLength))
                return result;
        },
        
        resolve: function (definition)
        {
            var solution;
            var type = typeof definition;
            if (type === 'function')
                solution = definition.call(this);
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
                    expr = definition;
                var replacement = this.replaceExpr(expr);
                solution = createSolution(replacement, level);
            }
            return solution;
        },
        
        resolveCharacter: function (char)
        {
            var solution = this.charCache[char];
            if (solution === undefined)
            {
                this.callResolver(
                    quoteString(char),
                    function ()
                    {
                        var charCache;
                        var entries = CHARACTERS[char];
                        if (!entries || isArray(entries))
                        {
                            var defaultResolver = defaultResolveCharacter.bind(this, char);
                            if (entries)
                                solution = this.findOptimalSolution(entries, defaultResolver);
                            if (!solution)
                                solution = defaultResolver();
                            charCache = this.charCache;
                        }
                        else
                        {
                            solution = STATIC_ENCODER.resolve(entries);
                            charCache = STATIC_CHAR_CACHE;
                        }
                        if (solution.level == null)
                            solution.level = LEVEL_STRING;
                        charCache[char] = solution;
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
                        var entries = COMPLEX[complex];
                        var definition = this.findBestDefinition(entries);
                        solution = this.resolve(definition);
                        solution.level = LEVEL_STRING;
                        this.complexCache[complex] = solution;
                    }
                );
            }
            return solution;
        },
        
        resolveConstant: function (constant)
        {
            var solution = this.constCache[constant];
            if (solution === undefined)
            {
                this.callResolver(
                    constant,
                    function ()
                    {
                        var constCache;
                        var entries = this.constantDefinitions[constant];
                        if (isArray(entries))
                        {
                            solution = this.findOptimalSolution(entries);
                            constCache = this.constCache;
                        }
                        else
                        {
                            solution = STATIC_ENCODER.resolve(entries);
                            constCache = STATIC_CONST_CACHE;
                        }
                        constCache[constant] = solution;
                    }
                );
            }
            return solution;
        },
        
        resolveExprAt: function (expr, index, entries, paddingInfos)
        {
            if (!entries)
                this.throwSyntaxError('Missing padding entries for index ' + index);
            var paddingDefinition = this.findBestDefinition(entries);
            var paddingBlock;
            var indexer;
            if (typeof paddingDefinition === 'number')
            {
                var paddingInfo = this.findBestDefinition(paddingInfos);
                paddingBlock = this.getPaddingBlock(paddingInfo, paddingDefinition);
                indexer = replaceIndexer(index + paddingDefinition + paddingInfo.shift);
            }
            else
            {
                paddingBlock = paddingDefinition.block;
                indexer = '[' + this.replaceExpr(paddingDefinition.indexer) + ']';
            }
            var fullExpr = '(' + paddingBlock + '+' + expr + ')';
            var replacement = this.replaceExpr(fullExpr) + indexer;
            var solution = createSolution(replacement, LEVEL_STRING, false);
            return solution;
        },
        
        throwSyntaxError: function (message)
        {
            var stack = this.stack;
            var stackLength = stack.length;
            if (stackLength)
                message += ' in the definition of ' + stack[stackLength - 1];
            throw new SyntaxError(message);
        }
    };
    
    assignNoEnum(Encoder.prototype, encoderProtoSource);
    
    var STATIC_ENCODER = new Encoder(0);
    
    replaceIndexer =
        function (index)
        {
            var replacement =
                '[' + STATIC_ENCODER.replaceExpr(index > 9 ? '"' + index + '"' : index + '') + ']';
            return replacement;
        };
    
    resolveSimple =
        function (simple, definition)
        {
            var solution;
            STATIC_ENCODER.callResolver(
                simple,
                function ()
                {
                    solution = STATIC_ENCODER.resolve(definition);
                }
            );
            return solution;
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
                    str = str.slice(0, index);
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
                input = trimJS(input);
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
            perfInfo.codingLog = codingLog;
        delete encoder.codingLog;
        return output;
    }
    
    function filterWrapWith(wrapWith)
    {
        if (wrapWith === undefined)
            return 'none';
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
            encoders[featureMask] = encoder = new Encoder(featureMask);
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
                self.JSFuck = self.JScrewIt = JScrewIt;
        };
    
    setUp(typeof self !== 'undefined' ? /* istanbul ignore next */ self : null);
    
    // istanbul ignore else
    if (typeof module !== 'undefined')
        module.exports = JScrewIt;
}
)();

// istanbul ignore else
if (typeof DEBUG === 'undefined' || /* istanbul ignore next */ DEBUG)
{
    (function ()
    {
        'use strict';
        
        function cloneEntries(entries)
        {
            if (entries)
            {
                var singleton = !isArray(entries);
                if (singleton)
                    entries = [createEntryClone(entries, 0)];
                else
                {
                    entries =
                        entries.map(
                            function (entry)
                            {
                                entry = createEntryClone(entry.definition, entry.featureMask);
                                return entry;
                            }
                        );
                }
                entries.singleton = singleton;
            }
            return entries;
        }
        
        function createEncoder(features)
        {
            var featureMask = getValidFeatureMask(features);
            var encoder = new Encoder(featureMask);
            encoder.codingLog = [];
            return encoder;
        }
        
        function createEntryClone(definition, featureMask)
        {
            if (typeof definition === 'object')
                definition = Object.freeze(definition);
            var entry = { definition: definition, featureMask: featureMask };
            return entry;
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
                throw new SyntaxError('Invalid identifier ' + JSON.stringify(constant));
            if (!encoder.hasOwnProperty('constantDefinitions'))
                encoder.constantDefinitions = create(CONSTANTS);
            var entries = [define(definition + '')];
            encoder.constantDefinitions[constant] = entries;
        }
        
        function getCharacterEntries(char)
        {
            var entries = cloneEntries(CHARACTERS[char]);
            return entries;
        }
        
        function getCoders()
        {
            return CODERS;
        }
        
        function getComplexEntries(complex)
        {
            var entries = cloneEntries(COMPLEX[complex]);
            return entries;
        }
        
        function getConstantEntries(constant)
        {
            var entries = cloneEntries(CONSTANTS[constant]);
            return entries;
        }
        
        function getEntries(name)
        {
            var entries = cloneEntries(ENTRIES[name]);
            return entries;
        }
        
        var ENTRIES = new Empty();
        ENTRIES['BASE64_ALPHABET_HI_4:0']   = BASE64_ALPHABET_HI_4[0];
        ENTRIES['BASE64_ALPHABET_HI_4:4']   = BASE64_ALPHABET_HI_4[4];
        ENTRIES['BASE64_ALPHABET_HI_4:5']   = BASE64_ALPHABET_HI_4[5];
        ENTRIES['BASE64_ALPHABET_LO_4:1']   = BASE64_ALPHABET_LO_4[1];
        ENTRIES['BASE64_ALPHABET_LO_4:3']   = BASE64_ALPHABET_LO_4[3];
        ENTRIES.CREATE_PARSE_INT_ARG        = CREATE_PARSE_INT_ARG;
        ENTRIES.FROM_CHAR_CODE              = FROM_CHAR_CODE;
        ENTRIES.OPTIMAL_B                   = OPTIMAL_B;
        
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
                    getEntries:             getEntries,
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
