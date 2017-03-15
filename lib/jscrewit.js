// JScrewIt 2.6.1 – http://jscrew.it
(function ()
{
'use strict';

var Empty;

var array_isArray;
var array_prototype_every;
var array_prototype_forEach;
var array_prototype_map;
var array_prototype_push;
var assignNoEnum;
var createConstructor;
var esToString;
var json_parse;
var json_stringify;
var math_abs;
var math_max;
var math_min;
var math_pow;
var noProto;
var noop;
var object_create;
var object_defineProperties;
var object_defineProperty;
var object_freeze;
var object_keys;
var object_getOwnPropertyDescriptor;

(function ()
{
    array_isArray           = Array.isArray;
    array_prototype_every   = Array.prototype.every;
    array_prototype_forEach = Array.prototype.forEach;
    array_prototype_map     = Array.prototype.map;
    array_prototype_push    = Array.prototype.push;
    
    assignNoEnum =
        function (target, source)
        {
            var descriptors = { };
            object_keys(source).forEach(
                function (name)
                {
                    var descriptor = object_getOwnPropertyDescriptor(source, name);
                    descriptor.enumerable = false;
                    descriptors[name] = descriptor;
                }
            );
            object_defineProperties(target, descriptors);
            return target;
        };
    
    createConstructor =
        function (prototype)
        {
            var constructor = Function();
            constructor.prototype = prototype;
            return constructor;
        };
    
    esToString =
        function (arg)
        {
            if (typeof arg === 'symbol')
                throw new TypeError('Cannot convert a symbol to a string');
            var str = String(arg);
            return str;
        };
    
    json_parse      = JSON.parse;
    json_stringify  = JSON.stringify;
    
    math_abs    = Math.abs;
    math_max    = Math.max;
    math_min    = Math.min;
    math_pow    = Math.pow;
    
    noProto =
        function (obj)
        {
            var result = new Empty();
            object_keys(obj).forEach(
                function (name)
                {
                    result[name] = obj[name];
                }
            );
            return result;
        };
    
    noop = Function();
    
    object_create                   = Object.create;
    object_defineProperties         = Object.defineProperties;
    object_defineProperty           = Object.defineProperty;
    object_freeze                   = Object.freeze;
    object_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    object_keys                     = Object.keys;
    
    Empty = createConstructor(object_create(null));
}
)();

var maskAnd;
var maskAreEqual;
var maskIncludes;
var maskIsEmpty;
var maskNew;
var maskOr;
var maskUnion;

(function ()
{
    maskAnd =
        function (thisMask, mask)
        {
            thisMask[0] &= mask[0];
            thisMask[1] &= mask[1];
        };
    
    maskAreEqual =
        function (mask1, mask2)
        {
            var equal = mask1[0] === mask2[0] && mask1[1] === mask2[1];
            return equal;
        };
    
    maskIncludes =
        function (thisMask, mask)
        {
            var mask0;
            var mask1;
            var included =
                ((mask0 = mask[0]) & thisMask[0]) === mask0 &&
                ((mask1 = mask[1]) & thisMask[1]) === mask1;
            return included;
        };
    
    maskIsEmpty =
        function (mask)
        {
            var empty = !(mask[0] | mask[1]);
            return empty;
        };
    
    maskNew =
        function ()
        {
            var mask = [0, 0];
            return mask;
        };
    
    maskOr =
        function (thisMask, mask)
        {
            thisMask[0] |= mask[0];
            thisMask[1] |= mask[1];
        };
    
    maskUnion =
        function (mask1, mask2)
        {
            var mask = [mask1[0] | mask2[0], mask1[1] | mask2[1]];
            return mask;
        };
}
)();

var Feature;

var featureFromMask;
var featuresToMask;
var isMaskCompatible;
var validMaskFromArrayOrStringOrFeature;

(function ()
{
    function areCompatible(features)
    {
        var compatible;
        if (features.length > 1)
        {
            var mask = featureArrayToMask(features);
            compatible = isMaskCompatible(mask);
        }
        else
            compatible = true;
        return compatible;
    }
    
    function areEqual()
    {
        var mask;
        var equal =
            array_prototype_every.call(
                arguments,
                function (arg, index)
                {
                    var result;
                    var otherMask = validMaskFromArrayOrStringOrFeature(arg);
                    if (index)
                        result = maskAreEqual(otherMask, mask);
                    else
                    {
                        mask = otherMask;
                        result = true;
                    }
                    return result;
                }
            );
        return equal;
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
            var mask = [~0, ~0];
            array_prototype_forEach.call(
                arguments,
                function (arg)
                {
                    var otherMask = validMaskFromArrayOrStringOrFeature(arg);
                    maskAnd(mask, otherMask);
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
                mask = maskNew();
                var check = info.check;
                if (check)
                {
                    mask[bitIndex >> 5] = 1 << bitIndex++;
                    if (check())
                        maskOr(autoMask, mask);
                    check = wrapCheck(check);
                }
                var includes = includesMap[name] = info.includes || [];
                includes.forEach(
                    function (include)
                    {
                        var includeMask = completeFeature(include);
                        maskOr(mask, includeMask);
                    }
                );
                excludes = info.excludes;
                var description;
                var engine = info.engine;
                if (engine == null)
                    description = info.description;
                else
                    description = createEngineFeatureDescription(engine);
                featureObj =
                    createFeature(name, description, mask, check, engine, info.attributes);
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
                        var incompatibleMask = maskUnion(mask, excludeMask);
                        incompatibleMasks.push(incompatibleMask);
                    }
                );
            }
        }
        return mask;
    }
    
    function createEngineFeatureDescription(engine)
    {
        var description = 'Features available in ' + engine + '.';
        return description;
    }
    
    function createFeature(name, description, mask, check, engine, attributes)
    {
        attributes = object_freeze(attributes || { });
        var featureObj =
            object_create(
                Feature.prototype,
                {
                    attributes:     { value: attributes },
                    check:          { value: check },
                    description:    { value: description },
                    engine:         { value: engine },
                    name:           { value: name }
                }
            );
        initMask(featureObj, mask);
        return featureObj;
    }
    
    function featureArrayToMask(array)
    {
        var mask = maskNew();
        array.forEach(
            function (feature)
            {
                var otherMask = maskFromStringOrFeature(feature);
                maskOr(mask, otherMask);
            }
        );
        return mask;
    }
    
    function initMask(featureObj, mask)
    {
        object_defineProperty(featureObj, 'mask', { value: object_freeze(mask) });
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
            var name = esToString(arg);
            var featureObj = ALL[name];
            if (!featureObj)
                throw new Error('Unknown feature ' + json_stringify(name));
            mask = featureObj.mask;
        }
        return mask;
    }
    
    function registerFeature(name, featureObj)
    {
        var descriptor = { enumerable: true, value: featureObj };
        object_defineProperty(Feature, name, descriptor);
        object_defineProperty(ALL, name, descriptor);
    }
    
    function validateMask(mask)
    {
        if (!isMaskCompatible(mask))
            throw new Error('Incompatible features');
    }
    
    function validMaskFromArguments(args)
    {
        var mask = maskNew();
        var validationNeeded = false;
        array_prototype_forEach.call(
            args,
            function (arg)
            {
                var otherMask;
                if (array_isArray(arg))
                {
                    otherMask = featureArrayToMask(arg);
                    validationNeeded |= arg.length > 1;
                }
                else
                    otherMask = maskFromStringOrFeature(arg);
                maskOr(mask, otherMask);
            }
        );
        validationNeeded |= args.length > 1;
        if (validationNeeded)
            validateMask(mask);
        return mask;
    }
    
    function wrapCheck(check)
    {
        var result =
            function ()
            {
                var available = !!check();
                return available;
            };
        return result;
    }
    
    var ALL = new Empty();
    
    var FEATURE_INFOS =
    {
        ANY_DOCUMENT:
        {
            description:
                'Existence of the global object document whose string representation starts with ' +
                '"[object " and ends with "Document]".',
            check: function ()
            {
                var available =
                    typeof document === 'object' && /^\[object .*Document]$/.test(document + '');
                return available;
            },
            attributes: { 'web-worker': 'web-worker-restriction' }
        },
        ANY_WINDOW:
        {
            description:
                'Existence of the global object self whose string representation starts with ' +
                '"[object " and ends with "Window]".',
            check: checkSelfFeature.bind(
                function (str)
                {
                    var available = /^\[object .*Window]$/.test(str);
                    return available;
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
                var available =
                    Array.prototype.entries && /^\[object Array.{8,9}]$/.test([].entries());
                return available;
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
            description: 'Existence of the global functions atob and btoa.',
            check: function ()
            {
                var available = typeof atob === 'function' && typeof btoa === 'function';
                return available;
            },
            attributes: { 'web-worker': 'no-atob-in-web-worker' }
        },
        BARPROP:
        {
            description:
                'Existence of the global object statusbar having the string representation ' +
                '"[object BarProp]".',
            check: function ()
            {
                var available =
                    typeof statusbar === 'object' && statusbar + '' === '[object BarProp]';
                return available;
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
        CONSOLE:
        {
            description:
                'Existence of the global object console having the string representation ' +
                '"[object Console]".\n' +
                'This feature may become unavailable when Firebug or Firebug Lite is open and ' +
                'the console panel is enabled.',
            check: function ()
            {
                var available = typeof console === 'object' && console + '' === '[object Console]';
                return available;
            },
            attributes: { 'web-worker': 'no-console-in-web-worker' }
        },
        DOCUMENT:
        {
            description:
                'Existence of the global object document having the string representation ' +
                '"[object Document]".',
            check: function ()
            {
                var available =
                    typeof document === 'object' && document + '' === '[object Document]';
                return available;
            },
            excludes: ['HTMLDOCUMENT'],
            includes: ['ANY_DOCUMENT'],
            attributes: { 'web-worker': 'web-worker-restriction' }
        },
        DOMWINDOW:
        {
            description:
                'Existence of the global object self having the string representation "[object ' +
                'DOMWindow]".',
            check: checkSelfFeature.bind(
                function (str)
                {
                    var available = str + '' === '[object DOMWindow]';
                    return available;
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
                var available = Array.prototype.entries && /^\[object /.test([].entries());
                return available;
            }
        },
        ENTRIES_PLAIN:
        {
            description:
                'The property that the string representation of Array.prototype.entries() ' +
                'evaluates to "[object Object]".',
            check: function ()
            {
                var available = Array.prototype.entries && [].entries() + '' === '[object Object]';
                return available;
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
                var available = ~''.fontcolor('"<>').indexOf('&quot;&lt;&gt;');
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
                var available = ~''.fontcolor('"').indexOf('&quot;');
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
                var available = ~''.fontcolor('"<>').indexOf('&quot;<>');
                return available;
            },
            excludes: ['ESC_HTML_ALL'],
            includes: ['ESC_HTML_QUOT']
        },
        FILL:
        {
            description: 'Existence of the native function Array.prototype.fill.',
            check: function ()
            {
                var available = Array.prototype.fill;
                return available;
            }
        },
        FROM_CODE_POINT:
        {
            description: 'Existence of the function String.fromCodePoint.',
            check: function ()
            {
                var available = String.fromCodePoint;
                return available;
            }
        },
        GMT:
        {
            description:
                'Presence of the text "GMT" after the first 25 characters in the string returned ' +
                'by Date().\n' +
                'The string representation of dates is implementation dependent, but most ' +
                'engines use a similar format, making this feature available in all supported ' +
                'engines except Internet Explorer 9 and 10.',
            check: function ()
            {
                var available = /^.{25}GMT/.test(Date());
                return available;
            }
        },
        HISTORY:
        {
            description:
                'Existence of the global object history having the string representation ' +
                '"[object History]".',
            check: function ()
            {
                var available = typeof history === 'object' && history + '' === '[object History]';
                return available;
            },
            attributes: { 'web-worker': 'web-worker-restriction' }
        },
        HTMLAUDIOELEMENT:
        {
            description:
                'Existence of the global object Audio whose string representation starts with ' +
                '"function HTMLAudioElement".',
            check: function ()
            {
                var available =
                    typeof Audio !== 'undefined' && /^function HTMLAudioElement/.test(Audio);
                return available;
            },
            includes: ['NO_IE_SRC'],
            attributes: { 'web-worker': 'web-worker-restriction' }
        },
        HTMLDOCUMENT:
        {
            description:
                'Existence of the global object document having the string representation ' +
                '"[object HTMLDocument]".',
            check: function ()
            {
                var available =
                    typeof document === 'object' && document + '' === '[object HTMLDocument]';
                return available;
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
                var available = /^\nfunction Object\(\) \{\n    \[native code]\n\}/.test(Object);
                return available;
            },
            includes: ['NO_V8_SRC'],
            excludes: ['NODECONSTRUCTOR', 'NO_IE_SRC']
        },
        INCR_CHAR:
        {
            description:
                'The ability to use unary increment operators with string characters, like in ' +
                '( ++"some string"[0] ): this will result in a TypeError in strict mode in ' +
                'ECMAScript compliant engines.',
            check: function ()
            {
                return true;
            },
            attributes: { 'forced-strict-mode': 'char-increment-restriction' }
        },
        INTL:
        {
            description: 'Existence of the global object Intl.',
            check: function ()
            {
                var available = typeof Intl === 'object';
                return available;
            }
        },
        LOCALE_INFINITY:
        {
            description: 'Language sensitive string representation of Infinity as "∞".',
            check: function ()
            {
                var available = Infinity.toLocaleString() === '∞';
                return available;
            }
        },
        NAME:
        {
            description: 'Existence of the name property for functions.',
            check: function ()
            {
                var available = 'name' in Function();
                return available;
            }
        },
        NODECONSTRUCTOR:
        {
            description:
                'Existence of the global object Node having the string representation "[object ' +
                'NodeConstructor]".',
            check: function ()
            {
                var available =
                    typeof Node !== 'undefined' && Node + '' === '[object NodeConstructor]';
                return available;
            },
            excludes: ['IE_SRC'],
            attributes: { 'web-worker': 'web-worker-restriction' }
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
                var available = /^function Object\(\) \{(\n   )? \[native code]\s\}/.test(Object);
                return available;
            },
            excludes: ['IE_SRC']
        },
        NO_V8_SRC:
        {
            description:
                'A string representation of native functions typical for most engines except ' +
                'V8.\n' +
                'A most remarkable trait of this feature is the presence of a line feed followed ' +
                'by four whitespaces ("\\n    ") before the "[native code]" sequence.',
            check: function ()
            {
                var available = /^\n?function Object\(\) \{\n    \[native code]\s\}/.test(Object);
                return available;
            },
            excludes: ['V8_SRC']
        },
        NO_OLD_SAFARI_ARRAY_ITERATOR:
        {
            description:
                'The property that the string representation of Array.prototype.entries() ' +
                'evaluates to "[object Array Iterator]".',
            check: function ()
            {
                var available =
                    Array.prototype.entries && [].entries() + '' === '[object Array Iterator]';
                return available;
            },
            includes: ['ARRAY_ITERATOR']
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
                var available = (Function() + '')[22] === '\n';
                return available;
            }
        },
        SELF: 'ANY_WINDOW',
        SELF_OBJ:
        {
            description:
                'Existence of the global object self whose string representation starts with ' +
                '"[object ".',
            check: checkSelfFeature.bind(
                function (str)
                {
                    var available = /^\[object /.test(str);
                    return available;
                }
            ),
            attributes: { 'web-worker': 'safari-bug-21820506' }
        },
        UNDEFINED:
        {
            description:
                'The property that Object.prototype.toString.call() evaluates to "[object ' +
                'Undefined]".\n' +
                'This behavior is specified by ECMAScript, and is enforced by all engines except ' +
                'Android Browser versions prior to 4.1.2, where this feature is not available.',
            check: function ()
            {
                var available = Object.prototype.toString.call() === '[object Undefined]';
                return available;
            }
        },
        UNEVAL:
        {
            description: 'Existence of the global function uneval.',
            check: function ()
            {
                var available = typeof uneval !== 'undefined';
                return available;
            }
        },
        V8_SRC:
        {
            description:
                'A string representation of native functions typical for the V8 engine, but also ' +
                'found in Edge.\n' +
                'Remarkable traits are the lack of characters in the beginning of the string ' +
                'before "function" and a single whitespace before the "[native code]" sequence.',
            check: function ()
            {
                var available = /^.{19} \[native code] \}/.test(Object);
                return available;
            },
            includes: ['NO_IE_SRC'],
            excludes: ['NO_V8_SRC']
        },
        WINDOW:
        {
            description:
                'Existence of the global object self having the string representation "[object ' +
                'Window]".',
            check: checkSelfFeature.bind(
                function (str)
                {
                    var available = str === '[object Window]';
                    return available;
                }
            ),
            includes: ['ANY_WINDOW'],
            excludes: ['DOMWINDOW'],
            attributes: { 'web-worker': 'web-worker-restriction' }
        },
        
        DEFAULT:
        {
            description:
                'Minimum feature level, compatible with all supported engines in all environments.'
        },
        BROWSER:
        {
            description:
                'Features available in all browsers.\n' +
                'No support for Node.js.',
            includes: ['ANY_DOCUMENT', 'ANY_WINDOW', 'HISTORY', 'INCR_CHAR'],
            attributes:
            {
                'char-increment-restriction': null,
                'safari-bug-21820506': null,
                'web-worker-restriction': null
            }
        },
        COMPACT:
        {
            description:
                'All new browsers\' features.\n' +
                'No support for Node.js and older browsers like Internet Explorer, Safari 9 or ' +
                'Android Browser.',
            includes:
            [
                'ARROW',
                'ATOB',
                'BARPROP',
                'ENTRIES_OBJ',
                'ESC_HTML_QUOT_ONLY',
                'FILL',
                'FROM_CODE_POINT',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'NAME',
                'NO_IE_SRC',
                'NO_OLD_SAFARI_LF',
                'UNDEFINED',
                'WINDOW'
            ],
            attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null }
        },
        ANDRO40:
        {
            engine: 'Android Browser 4.0 to 4.3',
            includes:
            [
                'ATOB',
                'CONSOLE',
                'DOMWINDOW',
                'ESC_HTML_ALL',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'NAME',
                'NO_OLD_SAFARI_LF',
                'V8_SRC'
            ]
        },
        ANDRO41:
        {
            engine: 'Android Browser 4.1 to 4.3',
            includes:
            [
                'ATOB',
                'CONSOLE',
                'DOMWINDOW',
                'ESC_HTML_ALL',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'NAME',
                'NO_OLD_SAFARI_LF',
                'UNDEFINED',
                'V8_SRC'
            ]
        },
        ANDRO44:
        {
            engine: 'Android Browser 4.4 or later',
            includes:
            [
                'ATOB',
                'BARPROP',
                'CONSOLE',
                'ESC_HTML_ALL',
                'GMT',
                'HISTORY',
                'HTMLAUDIOELEMENT',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_LF',
                'UNDEFINED',
                'V8_SRC',
                'WINDOW'
            ],
            attributes: { 'no-console-in-web-worker': null, 'web-worker-restriction': null }
        },
        CHROME: 'CHROME52',
        CHROME52:
        {
            engine: 'Chrome 52 and Opera 39 or later',
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
                'HTMLAUDIOELEMENT',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'NO_OLD_SAFARI_LF',
                'UNDEFINED',
                'V8_SRC',
                'WINDOW'
            ],
            attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null }
        },
        EDGE:
        {
            engine: 'Edge',
            includes:
            [
                'ARROW',
                'ATOB',
                'BARPROP',
                'CONSOLE',
                'ESC_HTML_QUOT_ONLY',
                'ENTRIES_PLAIN',
                'FILL',
                'FROM_CODE_POINT',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_LF',
                'UNDEFINED',
                'V8_SRC',
                'WINDOW'
            ],
            attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null }
        },
        FF: 'FF31',
        FF31:
        {
            engine: 'Firefox 31 or later',
            includes:
            [
                'ARROW',
                'ATOB',
                'BARPROP',
                'CONSOLE',
                'ESC_HTML_QUOT_ONLY',
                'FILL',
                'FROM_CODE_POINT',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'NO_IE_SRC',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'NO_OLD_SAFARI_LF',
                'NO_V8_SRC',
                'UNDEFINED',
                'UNEVAL',
                'WINDOW'
            ],
            attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null }
        },
        IE9:
        {
            engine: 'Internet Explorer 9 or later',
            includes:
            [
                'CAPITAL_HTML',
                'DOCUMENT',
                'HISTORY',
                'IE_SRC',
                'INCR_CHAR',
                'NO_OLD_SAFARI_LF',
                'UNDEFINED',
                'WINDOW'
            ]
        },
        IE10:
        {
            engine: 'Internet Explorer 10 or later',
            includes:
            [
                'ATOB',
                'CAPITAL_HTML',
                'CONSOLE',
                'DOCUMENT',
                'HISTORY',
                'IE_SRC',
                'INCR_CHAR',
                'NO_OLD_SAFARI_LF',
                'UNDEFINED',
                'WINDOW'
            ],
            attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null }
        },
        IE11:
        {
            engine: 'Internet Explorer 11',
            includes:
            [
                'ATOB',
                'CAPITAL_HTML',
                'CONSOLE',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'IE_SRC',
                'INCR_CHAR',
                'INTL',
                'NO_OLD_SAFARI_LF',
                'UNDEFINED',
                'WINDOW'
            ],
            attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null }
        },
        IE11_WIN10:
        {
            engine: 'Internet Explorer 11 on Windows 10',
            includes:
            [
                'ATOB',
                'CAPITAL_HTML',
                'CONSOLE',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'IE_SRC',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'NO_OLD_SAFARI_LF',
                'UNDEFINED',
                'WINDOW'
            ],
            attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null }
        },
        NODE010:
        {
            engine: 'Node.js 0.10',
            includes:
            [
                'ESC_HTML_ALL',
                'GMT',
                'INCR_CHAR',
                'NAME',
                'NO_OLD_SAFARI_LF',
                'UNDEFINED',
                'V8_SRC'
            ]
        },
        NODE012:
        {
            engine: 'Node.js 0.12 or later',
            includes:
            [
                'ESC_HTML_QUOT_ONLY',
                'GMT',
                'INCR_CHAR',
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
            engine: 'Node.js 4.0 or later',
            includes:
            [
                'ARROW',
                'ESC_HTML_QUOT_ONLY',
                'FILL',
                'FROM_CODE_POINT',
                'GMT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'NO_OLD_SAFARI_LF',
                'UNDEFINED',
                'V8_SRC'
            ]
        },
        NODE50:
        {
            engine: 'Node.js 5.0 or later',
            includes:
            [
                'ARROW',
                'ESC_HTML_QUOT_ONLY',
                'FILL',
                'FROM_CODE_POINT',
                'GMT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'NO_OLD_SAFARI_LF',
                'UNDEFINED',
                'V8_SRC'
            ],
            attributes: { 'char-increment-restriction': null }
        },
        SAFARI70:
        {
            engine: 'Safari 7.0',
            includes:
            [
                'ATOB',
                'BARPROP',
                'CONSOLE',
                'ESC_HTML_QUOT_ONLY',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'NAME',
                'NODECONSTRUCTOR',
                'NO_IE_SRC',
                'NO_V8_SRC',
                'UNDEFINED',
                'WINDOW'
            ],
            attributes:
            {
                'char-increment-restriction': null,
                'no-atob-in-web-worker': null,
                'no-console-in-web-worker': null,
                'web-worker-restriction': null
            }
        },
        SAFARI71:
        {
            engine: 'Safari 7.1 and Safari 8',
            includes:
            [
                'ARRAY_ITERATOR',
                'ATOB',
                'BARPROP',
                'CONSOLE',
                'ESC_HTML_QUOT_ONLY',
                'FILL',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'NAME',
                'NODECONSTRUCTOR',
                'NO_IE_SRC',
                'NO_V8_SRC',
                'UNDEFINED',
                'WINDOW'
            ],
            attributes:
            {
                'char-increment-restriction': null,
                'no-atob-in-web-worker': null,
                'safari-bug-21820506': null,
                'web-worker-restriction': null
            }
        },
        SAFARI80: 'SAFARI71',
        SAFARI90:
        {
            engine: 'Safari 9',
            includes:
            [
                'ATOB',
                'BARPROP',
                'CONSOLE',
                'ESC_HTML_QUOT_ONLY',
                'FILL',
                'FROM_CODE_POINT',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'NAME',
                'NODECONSTRUCTOR',
                'NO_IE_SRC',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'NO_OLD_SAFARI_LF',
                'NO_V8_SRC',
                'UNDEFINED',
                'WINDOW'
            ],
            attributes:
            {
                'char-increment-restriction': null,
                'no-atob-in-web-worker': null,
                'safari-bug-21820506': null,
                'web-worker-restriction': null
            }
        },
        SAFARI100:
        {
            engine: 'Safari 10',
            includes:
            [
                'ARROW',
                'ATOB',
                'BARPROP',
                'CONSOLE',
                'ESC_HTML_QUOT_ONLY',
                'FILL',
                'FROM_CODE_POINT',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'NAME',
                'NO_IE_SRC',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'NO_OLD_SAFARI_LF',
                'NO_V8_SRC',
                'UNDEFINED',
                'WINDOW'
            ],
            attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null }
        }
    };
    
    /**
     * A feature object or name or alias of a predefined feature.
     *
     * @typedef {JScrewIt.Feature|string} FeatureElement
     *
     * @throws {Error}
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
     * @throws {Error} The specified features are not compatible with each other.
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
     * @throws {Error} The specified features are not compatible with each other.
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
            var featureObj = this instanceof Feature ? this : object_create(Feature.prototype);
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
         * Different features are considered equivalent if they include the same set of elementary
         * features, regardless of any other difference.
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
                    var included = maskIncludes(mask, featureObj.mask);
                    if (included)
                    {
                        var name = featureObj.name;
                        featureNameSet[name] = null;
                        var includes = includesMap[name];
                        array_prototype_push.apply(allIncludes, includes);
                    }
                }
            );
            allIncludes.forEach(
                function (name)
                {
                    delete featureNameSet[name];
                }
            );
            var names = object_keys(featureNameSet).sort();
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
                    var included = maskIncludes(mask, featureObj.mask);
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
                array_prototype_every.call(
                    arguments,
                    function (arg)
                    {
                        var otherMask = validMaskFromArrayOrStringOrFeature(arg);
                        var result = maskIncludes(mask, otherMask);
                        return result;
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
         * Two environments are currently supported.
         *
         * <dl>
         *
         * <dt><code>"forced-strict-mode"</code></dt>
         * <dd>
         * Removes features that are not available in environments that require strict mode
         * code.</dd>
         *
         * <dt><code>"web-worker"</code></dt>
         * <dd>Removes features that are not available inside web workers.</dd>
         *
         * </dl>
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
            var resultMask = maskNew();
            var thisMask = this.mask;
            var attributeCache = new Empty();
            elementaryFeatureObjs.forEach(
                function (featureObj)
                {
                    var otherMask = featureObj.mask;
                    var included = maskIncludes(thisMask, otherMask);
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
                            maskOr(resultMask, otherMask);
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
            var featureObj = object_create(Feature.prototype);
            initMask(featureObj, mask);
            return featureObj;
        };
    
    featuresToMask =
        function (featureObjs)
        {
            var mask = maskNew();
            featureObjs.forEach(
                function (featureObj)
                {
                    maskOr(mask, featureObj.mask);
                }
            );
            return mask;
        };
    
    isMaskCompatible =
        function (mask)
        {
            var compatible =
                incompatibleMasks.every(
                    function (incompatibleMask)
                    {
                        var result = !maskIncludes(mask, incompatibleMask);
                        return result;
                    }
                );
            return compatible;
        };
    
    validMaskFromArrayOrStringOrFeature =
        function (arg)
        {
            var mask;
            if (array_isArray(arg))
            {
                mask = featureArrayToMask(arg);
                if (arg.length > 1)
                    validateMask(mask);
            }
            else
                mask = maskFromStringOrFeature(arg);
            return mask;
        };
    
    var autoMask = maskNew();
    var bitIndex = 0;
    var elementaryFeatureObjs = [];
    var includesMap = new Empty();
    var incompatibleMasks = [];
    
    var featureNames = object_keys(FEATURE_INFOS);
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
    createDefinitionEntry =
        function (definition, featureArgs, startIndex)
        {
            var features = Array.prototype.slice.call(featureArgs, startIndex);
            var mask = featuresToMask(features);
            var entry = { definition: definition, mask: mask };
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

var LEVEL_NUMERIC   = -1;
var LEVEL_OBJECT    = 0;
var LEVEL_STRING    = 1;
var LEVEL_UNDEFINED = -2;

var createSolution;

(function ()
{
    function Solution(replacement, level, hasOuterPlus)
    {
        this.replacement    = replacement;
        this.level          = level;
        if (hasOuterPlus !== undefined)
            setHasOuterPlus(this, hasOuterPlus);
    }
    
    function setHasOuterPlus(solution, hasOuterPlus)
    {
        object_defineProperty(solution, 'hasOuterPlus', { value: hasOuterPlus });
    }
    
    var solutionProtoSource =
    {
        get appendLength()
        {
            var extraLength = this.hasOuterPlus ? 3 : 1;
            var appendLength = this.length + extraLength;
            return appendLength;
        },
        set appendLength(appendLength)
        {
            object_defineProperty(this, 'appendLength', { enumerable: true, value: appendLength });
        },
        charAt: function (index)
        {
            return this.replacement[index];
        },
        // Determine whether the specified solution contains a plus sign out of brackets not
        // preceded by an exclamation mark or by another plus sign.
        get hasOuterPlus()
        {
            var str = this.replacement;
            for (;;)
            {
                var newStr = str.replace(/\([^()]*\)|\[[^[\]]*]/g, '.');
                if (newStr.length === str.length)
                    break;
                str = newStr;
            }
            var hasOuterPlus = /(^|[^!+])\+/.test(str);
            setHasOuterPlus(this, hasOuterPlus);
            return hasOuterPlus;
        },
        get length()
        {
            return this.replacement.length;
        },
        toString: function ()
        {
            return this.replacement;
        }
    };
    
    assignNoEnum(Solution.prototype, solutionProtoSource);
    
    createSolution =
        function (replacement, level, hasOuterPlus)
        {
            var solution = new Solution(replacement, level, hasOuterPlus);
            return solution;
        };
}
)();

// As of version 2.1.0, definitions are interpreted using JScrewIt's own express parser, which can
// handle and optimize a useful subset of the JavaScript syntax.
// See express-parse.js for details about constructs recognized by express.
// Compared to generic purpose encoding, definition encoding differs mainly in that every identifier
// used must be defined itself, too, in a constant definition.

var AMENDINGS;
var CREATE_PARSE_INT_ARG;
var DEFAULT_16_BIT_CHARACTER_ENCODER;
var DEFAULT_8_BIT_CHARACTER_ENCODER;
var FROM_CHAR_CODE;
var FROM_CHAR_CODE_CALLBACK_FORMATTER;
var MAPPER_FORMATTER;
var OPTIMAL_B;

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
    var ENTRIES_OBJ                     = Feature.ENTRIES_OBJ;
    var ENTRIES_PLAIN                   = Feature.ENTRIES_PLAIN;
    var ESC_HTML_ALL                    = Feature.ESC_HTML_ALL;
    var ESC_HTML_QUOT                   = Feature.ESC_HTML_QUOT;
    var ESC_HTML_QUOT_ONLY              = Feature.ESC_HTML_QUOT_ONLY;
    var FILL                            = Feature.FILL;
    var FROM_CODE_POINT                 = Feature.FROM_CODE_POINT;
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
    var NO_IE_SRC                       = Feature.NO_IE_SRC;
    var NO_OLD_SAFARI_ARRAY_ITERATOR    = Feature.NO_OLD_SAFARI_ARRAY_ITERATOR;
    var NO_OLD_SAFARI_LF                = Feature.NO_OLD_SAFARI_LF;
    var NO_V8_SRC                       = Feature.NO_V8_SRC;
    var SELF_OBJ                        = Feature.SELF_OBJ;
    var UNDEFINED                       = Feature.UNDEFINED;
    var UNEVAL                          = Feature.UNEVAL;
    var V8_SRC                          = Feature.V8_SRC;
    var WINDOW                          = Feature.WINDOW;
    
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
        define({ expr: 'FILL', shift: 4 }, FILL)
    ];
    
    var FB_PADDING_INFOS =
    [
        define({ blocks: FB_PADDINGS, shift: 0 }),
        define({ blocks: FB_NO_IE_PADDINGS, shift: 0 }, NO_IE_SRC),
        define(null, NO_V8_SRC),
        define({ blocks: R_PADDINGS, shift: 0 }, V8_SRC),
        define({ blocks: R_PADDINGS, shift: 5 }, IE_SRC),
        define({ blocks: R_PADDINGS, shift: 4 }, NO_IE_SRC, NO_V8_SRC)
    ];
    
    var FH_PADDING_INFOS =
    [
        define({ blocks: FH_PADDINGS, shift: 0 }),
        define({ blocks: R_PADDINGS, shift: 0 }, NO_IE_SRC),
        define({ blocks: R_PADDINGS, shift: 1 }, IE_SRC)
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
        var expr = 'Function("return\\"\\\\u' + hexCode + '\\"")()';
        if (hexCode.length > 4)
            expr += '[0]';
        var result = this.replaceExpr(expr);
        return result;
    }
    
    function charEncodeByUnescape16(charCode)
    {
        var hexCode = this.hexCodeOf(charCode, 4);
        var expr = 'unescape("%u' + hexCode + '")';
        if (hexCode.length > 4)
            expr += '[0]';
        var result = this.replaceExpr(expr, true);
        return result;
    }
    
    function charEncodeByUnescape8(charCode)
    {
        var hexCode = this.hexCodeOf(charCode, 2);
        var expr = 'unescape("%' + hexCode + '")';
        if (hexCode.length > 2)
            expr += '[0]';
        var result = this.replaceExpr(expr, true);
        return result;
    }
    
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
                    define(0, NO_IE_SRC, NO_V8_SRC)
                ];
                break;
            case 20:
            case 30:
                paddingEntries =
                [
                    define(10),
                    define(
                        { block: 'RP_6_SO', indexer: 1 + index / 10 + ' + FH_SHIFT_1' },
                        NO_V8_SRC
                    ),
                    define(0, V8_SRC),
                    define(5, IE_SRC),
                    define(6, NO_IE_SRC, NO_V8_SRC)
                ];
                break;
            case 23:
                paddingEntries =
                [
                    define(7),
                    define({ block: 'RP_3_NO', indexer: '3 + FH_SHIFT_1' }, NO_V8_SRC),
                    define(0, V8_SRC),
                    define(3, IE_SRC),
                    define(3, NO_IE_SRC, NO_V8_SRC)
                ];
                break;
            case 25:
                paddingEntries =
                [
                    define(7),
                    define(5, NO_IE_SRC),
                    define({ block: 'RP_1_NO', indexer: '3 + FH_SHIFT_1' }, NO_V8_SRC),
                    define(0, IE_SRC),
                    define(1, NO_IE_SRC, NO_V8_SRC)
                ];
                break;
            case 32:
                paddingEntries =
                [
                    define(8),
                    define(9, NO_IE_SRC),
                    define({ block: 'RP_4_N', indexer: '4 + FH_SHIFT_1' }, NO_V8_SRC),
                    define(0, V8_SRC),
                    define(3, IE_SRC),
                    define(4, NO_IE_SRC, NO_V8_SRC)
                ];
                break;
            case 34:
                paddingEntries =
                [
                    define(7),
                    define(9, NO_IE_SRC),
                    define({ block: 'RP_2_SO', indexer: '4 + FH_SHIFT_1' }, NO_V8_SRC),
                    define(6, V8_SRC),
                    define(1, IE_SRC),
                    define(3, NO_IE_SRC, NO_V8_SRC)
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
    
    function createDefaultCharDefinition(char)
    {
        function defaultCharDefinition()
        {
            var solution = this.defaultResolveCharacter(char);
            return solution;
        }
        
        return defaultCharDefinition;
    }
    
    function defineDefaultChar(char)
    {
        var definition = createDefaultCharDefinition(char);
        var entry = define(definition);
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
                define(6, IE_SRC)
            ];
            break;
        case 6:
        case 16:
            entries =
            [
                define(5),
                define(4, NO_IE_SRC),
                define(3, IE_SRC)
            ];
            break;
        case 8:
        case 18:
            entries =
            [
                define(3),
                define(1, IE_SRC)
            ];
            break;
        case 9:
        case 19:
            entries =
            [
                define({ block: 'RP_1_NO', indexer: (index + 1) / 10 + ' + FH_SHIFT_1' }),
                define(1, NO_IE_SRC),
                define(0, IE_SRC)
            ];
            break;
        case 11:
            entries =
            [
                define(9),
                define(0, NO_IE_SRC),
                define(0, IE_SRC)
            ];
            break;
        case 12:
            entries =
            [
                define(8),
                define(0, NO_IE_SRC),
                define(0, IE_SRC)
            ];
            break;
        case 14:
            entries =
            [
                define(6),
                define(5, IE_SRC)
            ];
            break;
        case 15:
            entries =
            [
                define(5),
                define(4, IE_SRC)
            ];
            break;
        case 17:
            entries =
            [
                define(3)
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
    
    function fromCharCodeCallbackFormatterArrow(fromCharCode, arg)
    {
        return 'undefined=>String.' + fromCharCode + '(' + arg + ')';
    }
    
    function fromCharCodeCallbackFormatterDefault(fromCharCode, arg)
    {
        return 'function(undefined){return String.' + fromCharCode + '(' + arg + ')}';
    }
    
    function mapperFormatterDblArrow(arg)
    {
        var mapper = 'Function("return falsefalse=>undefined=>falsefalse' + arg + '")()';
        return mapper;
    }
    
    function mapperFormatterDefault(arg)
    {
        var mapper = 'Function("return function(undefined){return this' + arg + '}")().bind';
        return mapper;
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
            define('B', CAPITAL_HTML, ENTRIES_OBJ),
            define('A', ARRAY_ITERATOR)
        ],
        'F',
        'Infinity',
        'NaNfalse',
        [
            define('S'),
            define('R', CAPITAL_HTML),
            define('S', ENTRIES_OBJ)
        ],
        [
            define('U'),
            define('V', ANY_DOCUMENT),
            define('U', NAME),
            define('V', ANY_DOCUMENT, ENTRIES_OBJ, FILL, NAME),
            define('V', ANY_DOCUMENT, ENTRIES_OBJ, NAME, NO_IE_SRC),
            define('U', FILL, NAME, NO_IE_SRC),
            define('V', ANY_DOCUMENT, IE_SRC, NAME),
            define('V', ANY_DOCUMENT, NAME, V8_SRC),
            define('V', ANY_DOCUMENT, HTMLAUDIOELEMENT, NAME),
            define('V', ANY_DOCUMENT, NAME, NO_IE_SRC, NO_V8_SRC),
            define('U', UNDEFINED),
            define('W', ANY_WINDOW),
            define('W', ATOB),
            define('U', CAPITAL_HTML)
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
            define('0B', ENTRIES_OBJ)
        ],
        '0i',
        [
            define('0j'),
            define('0T', CAPITAL_HTML),
            define('0j', ENTRIES_OBJ)
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
        '\n':
        [
            define('(Function() + [])[23]'),
            define('(ANY_FUNCTION + [])[0]', IE_SRC),
            define('(Function() + [])[22]', NO_OLD_SAFARI_LF),
            defineFHCharAt('FILTER', 19, NO_V8_SRC),
            defineFHCharAt('FILL', 17, FILL, NO_V8_SRC)
        ],
        
        '\x1e':
        [
            define('(RP_5_N + atob("NaNfalse"))[10]', ATOB)
        ],
        
        ' ':
        [
            defineFHCharAt('ANY_FUNCTION', 8),
            define('(RP_3_NO + ARRAY_ITERATOR)[10]', ENTRIES_OBJ),
            define('(FILTER + [])[21]', NO_V8_SRC),
            define('(RP_1_NO + FILTER)[20]', V8_SRC),
            define('(RP_5_N + FILL)[20]', FILL, NO_IE_SRC),
            define('(FILL + [])[20]', FILL, NO_V8_SRC),
            define('(FILTER + [])[20]', NO_IE_SRC, NO_V8_SRC)
        ],
        // '!':    ,
        '"':
        [
            define('"".fontcolor()[12]')
        ],
        // '#':    ,
        // '$':    ,
        '%':
        [
            define('escape(FILTER)[20]'),
            define('atob("000l")[2]', ATOB),
            define('escape(FILL)[21]', FILL),
            define('escape(ANY_FUNCTION)[0]', IE_SRC)
        ],
        '&':
        [
            define('"".fontcolor("".fontcolor())[13]', ESC_HTML_ALL),
            define('"".fontcolor("".sub())[20]', ESC_HTML_ALL),
            define('"".fontcolor("\\"")[13]', ESC_HTML_QUOT),
            define('"".fontcolor("".fontcolor([]))[31]', ESC_HTML_QUOT_ONLY),
            defineDefaultChar('&')
        ],
        // '\'':   ,
        '(':
        [
            defineFHCharAt('FILTER', 15),
            defineFHCharAt('FILL', 13, FILL)
        ],
        ')':
        [
            defineFHCharAt('FILTER', 16),
            defineFHCharAt('FILL', 14, FILL)
        ],
        // '*':    ,
        '+': '(1e100 + [])[2]',
        ',':
        [
            define('"f,a,l,s,e"[1]'),
            define(commaDefinition)
        ],
        '-': '(+".0000000001" + [])[2]',
        '.': '(+"11e20" + [])[1]',
        '/':
        [
            define('"0false".italics()[10]'),
            define('"true".sub()[10]')
        ],
        // '0'...'9':
        ':':
        [
            define('(RegExp() + [])[3]'),
            defineDefaultChar(':')
        ],
        ';':
        [
            define('"".fontcolor(true + "".fontcolor())[20]', ESC_HTML_ALL),
            define('"".fontcolor(true + "".sub())[20]', ESC_HTML_ALL),
            define('"".fontcolor("NaN\\"")[21]', ESC_HTML_QUOT),
            define('"".fontcolor("".fontcolor())[30]', ESC_HTML_QUOT_ONLY),
            defineDefaultChar(';')
        ],
        '<':
        [
            define('"".italics()[0]'),
            define('"".sub()[0]')
        ],
        '=':
        [
            define('"".fontcolor()[11]')
        ],
        '>':
        [
            define('"".italics()[2]'),
            define('"".sub()[10]')
        ],
        '?':
        [
            define('(RegExp() + [])[2]'),
            defineDefaultChar('?')
        ],
        // '@':    ,
        'A':
        [
            defineFHCharAt('Array', 9),
            define('(RP_3_NO + ARRAY_ITERATOR)[11]', ARRAY_ITERATOR)
        ],
        'B':
        [
            defineFHCharAt('Boolean', 9),
            define('"".sub()[3]', CAPITAL_HTML)
        ],
        'C':
        [
            define('escape("".italics())[2]'),
            define('escape("".sub())[2]'),
            define('atob("00NaNfalse")[1]', ATOB),
            define('(RP_4_N + "".fontcolor())[10]', CAPITAL_HTML),
            define('(RP_3_NO + Function("return console")())[11]', CONSOLE),
            define('(Node + [])[12]', NODECONSTRUCTOR)
        ],
        'D':
        [
            // * The escaped character may be either "]" or "}".
            define('escape((+("1000" + (RP_5_N + FILTER + 0)[40] + 0) + FILTER)[40])[2]'), // *
            define('escape("]")[2]'),
            define('escape("}")[2]'),
            define('escape(PLAIN_OBJECT)[20]'),
            define('(document + RP_1_NO)[SUBSTR]("-10")[0]', ANY_DOCUMENT),
            define('btoa("00")[1]', ATOB),
            define('(RP_3_NO + document)[11]', DOCUMENT),
            define( // *
                'escape((RP_3_NO + [+("10" + [(RP_6_SO + FILL)[40]] + 0 + 0 + 0)] + FILL)[40])[2]',
                FILL
            ),
            define('(document + [])[12]', HTMLDOCUMENT),
            define('escape(ARRAY_ITERATOR)[30]', NO_OLD_SAFARI_ARRAY_ITERATOR),
            define('escape(FILTER)[50]', V8_SRC),
            define('escape(FILL)[60]', FILL, NO_IE_SRC, NO_V8_SRC)
        ],
        'E':
        [
            defineFHCharAt('RegExp', 12),
            define('btoa("0NaN")[1]', ATOB),
            define('(RP_5_N + "".link())[10]', CAPITAL_HTML),
            define('(RP_3_NO + Audio)[21]', HTMLAUDIOELEMENT)
        ],
        'F':
        [
            defineFHCharAt('Function', 9),
            define('"".fontcolor()[1]', CAPITAL_HTML)
        ],
        'G':
        [
            define('btoa("0false")[1]', ATOB),
            define('"0".big()[10]', CAPITAL_HTML),
            define('(RP_5_N + Date())[30]', GMT)
        ],
        'H':
        [
            define('btoa(true)[1]', ATOB),
            define('"".link()[3]', CAPITAL_HTML),
            define(
                { expr: '(RP_3_NO + Function("return history")())[11]', optimize: true },
                HISTORY
            ),
            define('(RP_1_NO + Audio)[10]', HTMLAUDIOELEMENT),
            define('(RP_3_NO + document)[11]', HTMLDOCUMENT)
        ],
        'I': '"Infinity"[0]',
        'J':
        [
            define('"j"[TO_UPPER_CASE]()'),
            define('btoa(true)[2]', ATOB),
            defineDefaultChar('J')
        ],
        'K':
        [
            define('(RP_5_N + "".strike())[10]', CAPITAL_HTML)
        ],
        'L':
        [
            define('btoa(".")[0]', ATOB),
            define('(RP_3_NO + "".fontcolor())[11]', CAPITAL_HTML),
            define('(Audio + [])[12]', HTMLAUDIOELEMENT),
            define('(document + [])[11]', HTMLDOCUMENT)
        ],
        'M':
        [
            define('btoa(0)[0]', ATOB),
            define('"".small()[2]', CAPITAL_HTML),
            define('(RP_4_N + Date())[30]', GMT),
            define('(Audio + [])[11]', HTMLAUDIOELEMENT),
            define('(document + [])[10]', HTMLDOCUMENT)
        ],
        'N': '"NaN"[0]',
        'O':
        [
            define('(RP_3_NO + PLAIN_OBJECT)[11]'),
            define('btoa(NaN)[3]', ATOB),
            define('"".fontcolor()[2]', CAPITAL_HTML)
        ],
        'P':
        [
            define('btoa("".italics())[0]', ATOB),
            define('btoa("".sub())[0]', ATOB),
            define('btoa(PLAIN_OBJECT)[11]', ATOB),
            define('(Function("return statusbar")() + [])[11]', BARPROP),
            define('"0".sup()[10]', CAPITAL_HTML),
            defineDefaultChar('P')
        ],
        'Q':
        [
            define('"q"[TO_UPPER_CASE]()'),
            define('btoa(1)[1]', ATOB),
            defineDefaultChar('Q')
        ],
        'R':
        [
            defineFHCharAt('RegExp', 9),
            define('btoa("0true")[2]', ATOB),
            define('"".fontcolor()[10]', CAPITAL_HTML)
        ],
        'S':
        [
            defineFHCharAt('String', 9),
            define('"".sub()[1]', CAPITAL_HTML)
        ],
        'T':
        [
            define(
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
            define('(RP_1_NO + document)[10]', HTMLDOCUMENT)
        ],
        'U':
        [
            define('btoa("1NaN")[1]', ATOB),
            define('"".sub()[2]', CAPITAL_HTML),
            define('(RP_3_NO + PLAIN_OBJECT.toString.call())[11]', UNDEFINED),
            define('(RP_3_NO + ARRAY_ITERATOR.toString.call())[11]', ENTRIES_OBJ, UNDEFINED)
        ],
        'V':
        [
            define('unescape("%56")'),
            define('"v"[TO_UPPER_CASE]()'),
            define('(document.createElement("video") + [])[12]', ANY_DOCUMENT),
            define('btoa(undefined)[10]', ATOB),
        ],
        'W':
        [
            define('unescape("%57")'),
            define('"w"[TO_UPPER_CASE]()'),
            define('(self + RP_4_N)[SUBSTR]("-11")[0]', ANY_WINDOW),
            define('btoa(undefined)[1]', ATOB),
            define('(self + [])[11]', DOMWINDOW),
            define('(RP_3_NO + self)[11]', WINDOW)
        ],
        'X':
        [
            define('"x"[TO_UPPER_CASE]()'),
            define('btoa("1true")[1]', ATOB),
            defineDefaultChar('X')
        ],
        'Y':
        [
            define('"y"[TO_UPPER_CASE]()'),
            define('btoa("a")[0]', ATOB),
            defineDefaultChar('Y')
        ],
        'Z':
        [
            define('btoa(false)[0]', ATOB),
            define('(RP_3_NO + "".fontsize())[11]', CAPITAL_HTML)
        ],
        '[':
        [
            defineFBCharAt(14),
            define('(ARRAY_ITERATOR + [])[0]', ENTRIES_OBJ)
        ],
        '\\':
        [
            define('uneval("".fontcolor(false))[20]', UNEVAL),
            define('uneval(ANY_FUNCTION + [])[1]', IE_SRC, UNEVAL),
            define('uneval(+(ANY_FUNCTION + [])[0] + FILTER)[23]', NO_V8_SRC, UNEVAL),
            define('uneval(+(ANY_FUNCTION + [])[0] + FILL)[21]', FILL, NO_V8_SRC, UNEVAL),
            define('uneval(FILTER + [])[20]', NO_IE_SRC, NO_V8_SRC, UNEVAL),
            define('uneval(RP_3_NO + FILL)[21]', FILL, NO_IE_SRC, NO_V8_SRC, UNEVAL)
        ],
        ']':
        [
            defineFBCharAt(26),
            define('(RP_6_SO + PLAIN_OBJECT)[20]'),
            define('(ARRAY_ITERATOR + [])[22]', NO_OLD_SAFARI_ARRAY_ITERATOR)
        ],
        '^':
        [
            define('atob("undefined0")[2]', ATOB)
        ],
        // '_':    ,
        // '`':    ,
        'a': '"false"[1]',
        'b':
        [
            defineFHCharAt('Number', 12),
            define('(ARRAY_ITERATOR + [])[2]', ENTRIES_OBJ)
        ],
        'c':
        [
            defineFHCharAt('ANY_FUNCTION', 3),
            define('(RP_5_N + ARRAY_ITERATOR)[10]', ENTRIES_OBJ)
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
            define('101..toString("21")[1]'),
            define('btoa("0false")[3]', ATOB)
        ],
        'i': '([RP_5_N] + undefined)[10]',
        'j':
        [
            define('(PLAIN_OBJECT + [])[10]'),
            define('(ARRAY_ITERATOR + [])[3]', ENTRIES_OBJ),
            define('(Node + [])[3]', NODECONSTRUCTOR),
            define('(self + [])[3]', SELF_OBJ)
        ],
        'k':
        [
            define('20..toString("21")'),
            defineDefaultChar('k')
        ],
        'l': '"false"[2]',
        'm':
        [
            defineFHCharAt('Number', 11),
            define('(RP_6_SO + Function())[20]')
        ],
        'n': '"undefined"[1]',
        'o':
        [
            defineFHCharAt('ANY_FUNCTION', 6),
            define('(ARRAY_ITERATOR + [])[1]', ENTRIES_OBJ)
        ],
        'p':
        [
            define('211..toString("31")[1]'),
            define('(RP_3_NO + btoa(undefined))[10]', ATOB)
        ],
        'q':
        [
            define('212..toString("31")[1]'),
            defineDefaultChar('q')
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
            define('32..toString("33")'),
            define('(self + [])[SUBSTR]("-2")[0]', ANY_WINDOW),
            define('atob("undefined0")[1]', ATOB),
            define('(RP_4_N + self)[20]', DOMWINDOW),
            define('(self + [])[13]', WINDOW)
        ],
        'x':
        [
            define('101..toString("34")[1]'),
            define('btoa("falsefalse")[10]', ATOB)
        ],
        'y': '(RP_3_NO + [Infinity])[10]',
        'z':
        [
            define('35..toString("36")'),
            define('btoa("falsefalse")[11]', ATOB)
        ],
        '{':
        [
            defineFHCharAt('FILTER', 18),
            defineFHCharAt('FILL', 16, FILL)
        ],
        // '|':    ,
        '}':
        [
            defineFBCharAt(28)
        ],
        // '~':    ,
        
        '\x8a':
        [
            define('(RP_4_N + atob("NaNundefined"))[10]', ATOB)
        ],
        '\x8d':
        [
            define('atob("0NaN")[2]', ATOB)
        ],
        '\x96':
        [
            define('atob("00false")[3]', ATOB)
        ],
        '\x9e':
        [
            define('atob(true)[2]', ATOB)
        ],
        '£':
        [
            define('atob(NaN)[1]', ATOB)
        ],
        '¥':
        [
            define('atob("0false")[2]', ATOB)
        ],
        '§':
        [
            define('atob("00undefined")[2]', ATOB)
        ],
        '©':
        [
            define('atob("falsefalse")[1]', ATOB)
        ],
        '±':
        [
            define('atob("0false")[3]', ATOB)
        ],
        '¶':
        [
            define('atob(true)[0]', ATOB)
        ],
        'º':
        [
            define('atob("undefined0")[0]', ATOB)
        ],
        '»':
        [
            define('atob(true)[1]', ATOB)
        ],
        'Ç':
        [
            define('atob("falsefalsefalse")[10]', ATOB)
        ],
        'Ú':
        [
            define('atob("0truefalse")[1]', ATOB)
        ],
        'Ý':
        [
            define('atob("0undefined")[2]', ATOB)
        ],
        'â':
        [
            define('atob("falsefalseundefined")[11]', ATOB)
        ],
        'é':
        [
            define('atob("0undefined")[1]', ATOB)
        ],
        'î':
        [
            define('atob("0truefalse")[2]', ATOB)
        ],
        'ö':
        [
            define('atob("0false")[1]', ATOB)
        ],
        'ø':
        [
            define('atob("undefinedundefined")[10]', ATOB)
        ],
        '∞':
        [
            define('Infinity.toLocaleString()', LOCALE_INFINITY),
            defineDefaultChar('∞')
        ]
    });
    
    COMPLEX = noProto
    ({
        Number:
        [
            define({ expr: 'Number.name', optimize: true }, NAME),
            define(undefined, ENTRIES_OBJ),
        ],
        Object:
        [
            define({ expr: 'Object.name', optimize: true }, NAME),
            define(undefined, CAPITAL_HTML),
            define(undefined, ENTRIES_OBJ),
        ],
        RegExp:
        [
            define({ expr: 'RegExp.name', optimize: true }, NAME),
        ],
        String:
        [
            define('String.name', NAME),
            define(undefined, CAPITAL_HTML, ENTRIES_OBJ),
        ],
        'f,a,l,s,e':
        [
            define({ expr: '[].slice.call("false")', level: LEVEL_OBJECT }),
        ],
        mCh:
        [
            define('atob("bUNo")', ATOB, ENTRIES_OBJ),
        ]
    });
    
    CONSTANTS = noProto
    ({
        // JavaScript globals
        
        Array:
        [
            define('[].constructor')
        ],
        Audio:
        [
            define('Function("return Audio")()', HTMLAUDIOELEMENT)
        ],
        Boolean:
        [
            define('false.constructor')
        ],
        Date:
        [
            define('Function("return Date")()')
        ],
        Function:
        [
            define('ANY_FUNCTION.constructor')
        ],
        Node:
        [
            define('Function("return Node")()', NODECONSTRUCTOR)
        ],
        Number:
        [
            define('0..constructor')
        ],
        Object:
        [
            define('PLAIN_OBJECT.constructor')
        ],
        RegExp:
        [
            define('Function("return/false/")().constructor')
        ],
        String:
        [
            define('"".constructor')
        ],
        atob:
        [
            define('Function("return atob")()', ATOB)
        ],
        btoa:
        [
            define('Function("return btoa")()', ATOB)
        ],
        document:
        [
            define({ expr: 'Function("return document")()', optimize: true }, ANY_DOCUMENT)
        ],
        escape:
        [
            define({ expr: 'Function("return escape")()', optimize: true })
        ],
        self:
        [
            define('Function("return self")()', SELF_OBJ)
        ],
        unescape:
        [
            define({ expr: 'Function("return unescape")()', optimize: true })
        ],
        uneval:
        [
            define('Function("return uneval")()', UNEVAL)
        ],
        
        // Custom definitions
        
        ANY_FUNCTION:
        [
            define('FILTER'),
            define('FILL', FILL)
        ],
        ARRAY_ITERATOR:
        [
            define('[].entries()', ENTRIES_OBJ)
        ],
        FILL:
        [
            define('[].fill', FILL)
        ],
        FILTER:
        [
            define('[].filter')
        ],
        PLAIN_OBJECT:
        [
            define('Function("return{}")()'),
            define('ARRAY_ITERATOR', ENTRIES_PLAIN),
            define('Function("return Intl")()', INTL)
        ],
        SUBSTR:
        [
            define('"slice"'),
            define('"substr"')
        ],
        TO_UPPER_CASE:
        [
            define({ expr: '"toUpperCase"', optimize: true })
        ],
        
        // Function body extra padding blocks: prepended to a function to align the function's body
        // at the same position in different engines, assuming that the function header is aligned.
        // The number after "FBEP_" is the maximum character overhead. The letters after the last
        // underscore have the same meaning as in regular padding blocks.
        
        FBEP_4_S:
        [
            define('[[true][+(RP_3_NO + FILTER)[30]]]'),
            define('[[true][+(RP_5_N + FILL)[30]]]', FILL)
        ],
        FBEP_9_U:
        [
            define('[false][+(ANY_FUNCTION + [])[20]]')
        ],
        
        // Function body padding blocks: prepended to a function to align the function's body at the
        // same position in different engines.
        // The number after "FBP_" is the maximum character overhead. The letters after the last
        // underscore have the same meaning as in regular padding blocks.
        
        FBP_7_NO:
        [
            define('+("10" + [(RP_4_N + FILTER)[40]] + 0 + 0 + 0 + 0 + 0)'),
            define('+("10" + [(RP_6_SO + FILL)[40]] + 0 + 0 + 0 + 0 + 0)', FILL),
        ],
        FBP_8_NO:
        [
            define('+("1000" + (RP_5_N + FILTER + 0)[40] + 0 + 0 + 0)'),
            define('+("1000" + (FILL + 0)[33] + 0 + 0 + 0)', FILL),
        ],
        
        // Function header shift: used to adjust an indexer to make it point to the same position in
        // the string representation of a function's header in different engines.
        // This evaluates to an array containing only the number n - 1 or only the number n, where n
        // is the number after "FH_SHIFT_".
        
        FH_SHIFT_1:
        [
            define('[+IS_IE_SRC_N]')
        ],
        FH_SHIFT_3:
        [
            define('[2 + IS_IE_SRC_N]')
        ],
        
        // Function header padding blocks: prepended to a function to align the function's header
        // at the same position in different engines.
        // The number after "FHP_" is the maximum character overhead.
        // The letters after the last underscore have the same meaning as in regular padding blocks.
        
        FHP_3_NO:
        [
            define('+(1 + [+(ANY_FUNCTION + [])[0]])')
        ],
        FHP_5_N:
        [
            define('IS_IE_SRC_N')
        ],
        FHP_8_S:
        [
            define('[FHP_3_NO] + RP_5_N'),
            define('FHP_5_N + [RP_3_NO]', INCR_CHAR)
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
            define('!!++(ANY_FUNCTION + [])[0]', INCR_CHAR)
        ],
    });
    
    createBridgeSolution =
        function (bridge)
        {
            var replacement = '[[]]' + bridge + '([[]])';
            var solution = createSolution(replacement, LEVEL_OBJECT, false);
            var appendLength = bridge.length - 1;
            solution.appendLength = appendLength;
            solution.bridge = bridge;
            return solution;
        };
    
    createParseIntArgByReduce =
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
                '].reduce(function(f,a,l,s,e){return f.replace(a,' + firstDigit + '+l)},undefined)';
            return parseIntArg;
        };
    
    createParseIntArgByReduceArrow =
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
                '].reduce((f,a,l,s,e)=>f.replace(a,' + firstDigit + '+l),undefined)';
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
        define(createParseIntArgDefault, CAPITAL_HTML, ENTRIES_OBJ, NO_IE_SRC),
        define(createParseIntArgByReduce, ENTRIES_PLAIN),
        define(createParseIntArgByReduce, FILL),
        define(createParseIntArgByReduce, NO_OLD_SAFARI_ARRAY_ITERATOR),
        define(createParseIntArgByReduceArrow, ARROW),
        define(createParseIntArgByReduce, NO_V8_SRC),
        define(createParseIntArgByReduce, V8_SRC),
        define(createParseIntArgByReduceArrow, ARROW, ENTRIES_OBJ),
        define(createParseIntArgByReduce, FILL, IE_SRC),
        define(createParseIntArgByReduce, FILL, V8_SRC),
        define(createParseIntArgByReduce, FILL, NO_IE_SRC, NO_V8_SRC),
    ];
    
    DEFAULT_16_BIT_CHARACTER_ENCODER =
    [
        define(charEncodeByUnescape16),
        define(charEncodeByEval, ATOB),
        define(charEncodeByEval, UNEVAL)
    ];
    
    DEFAULT_8_BIT_CHARACTER_ENCODER =
    [
        define(charEncodeByUnescape8),
        define(charEncodeByAtob, ATOB)
    ];
    
    FROM_CHAR_CODE =
    [
        define('fromCharCode'),
        define('fromCodePoint', ATOB, FROM_CODE_POINT),
        define('fromCodePoint', BARPROP, FROM_CODE_POINT),
        define('fromCodePoint', CAPITAL_HTML, FROM_CODE_POINT),
        define('fromCharCode', ATOB, CAPITAL_HTML, ENTRIES_OBJ)
    ];
    
    FROM_CHAR_CODE_CALLBACK_FORMATTER =
    [
        define(fromCharCodeCallbackFormatterDefault),
        define(fromCharCodeCallbackFormatterArrow, ARROW)
    ];
    
    JSFUCK_INFINITY = '1e1000';
    
    MAPPER_FORMATTER = [define(mapperFormatterDefault), define(mapperFormatterDblArrow, ARROW)];
    
    OPTIMAL_B = [define('B'), define('b', ENTRIES_OBJ)];
    
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

var createClusteringPlan;

(function ()
{
    function addCluster(start, length, data, saving)
    {
        var startLink = getOrCreateStartLink(this.startLinks, start);
        var cluster = startLink[length];
        if (cluster)
        {
            if (cluster.saving < saving)
            {
                cluster.data    = data;
                cluster.saving  = saving;
            }
        }
        else
        {
            cluster =
                startLink[length] = { start: start, length: length, data: data, saving: saving };
            this.clusters.push(cluster);
        }
        if (this.maxLength < length)
            this.maxLength = length;
    }
    
    function compareClustersByQuality(cluster1, cluster2)
    {
        var diff =
            cluster1.saving - cluster2.saving ||
            cluster2.length - cluster1.length ||
            compareClustersByStart(cluster2, cluster1);
        return diff;
    }
    
    function compareClustersByStart(cluster1, cluster2)
    {
        var diff = cluster2.start - cluster1.start;
        return diff;
    }
    
    function conclude()
    {
        var clusters    = this.clusters.sort(compareClustersByQuality);
        var maxLength   = this.maxLength;
        var startLinks  = this.startLinks;
        var bestClusters = [];
        var cluster;
        while (cluster = pickBestCluster(startLinks, clusters, maxLength))
            bestClusters.push(cluster);
        bestClusters.sort(compareClustersByStart);
        return bestClusters;
    }
    
    function getOrCreateStartLink(startLinks, start)
    {
        var startLink = startLinks[start] || (startLinks[start] = []);
        return startLink;
    }
    
    function pickBestCluster(startLinks, clusters, maxLength)
    {
        var cluster;
        while (cluster = clusters.pop())
        {
            if (cluster.saving != null)
            {
                unlinkClusters(startLinks, maxLength, cluster);
                return cluster;
            }
        }
    }
    
    function unlinkClusters(startLinks, maxLength, cluster)
    {
        var startLink;
        var start = cluster.start;
        var index = start;
        var end = start + cluster.length;
        do
        {
            startLink = startLinks[index];
            if (startLink)
            {
                unlinkClustersFromLength(startLink, 0);
                delete startLinks[index];
            }
        }
        while (++index < end);
        for (var length = 1; length < maxLength;)
        {
            startLink = startLinks[start - length++];
            if (startLink)
            {
                unlinkClustersFromLength(startLink, length);
                startLink.length = length;
            }
        }
    }
    
    function unlinkClustersFromLength(startLink, fromLength)
    {
        for (var length = startLink.length; length-- > fromLength;)
        {
            var cluster = startLink[length];
            if (cluster)
                delete cluster.saving;
        }
    }
    
    createClusteringPlan =
        function ()
        {
            var plan =
            {
                addCluster: addCluster,
                clusters:   [],
                conclude:   conclude,
                maxLength:  0,
                startLinks: new Empty(),
            };
            return plan;
        };
}
)();

// This implementation assumes that all numeric solutions have an outer plus, and all other
// character solutions have none.

var ScrewBuffer;

(function ()
{
    function canSplitRightEndForFree(solutions, lastBridgeIndex)
    {
        var rightEndIndex = lastBridgeIndex + 1;
        var rightEndLength = solutions.length - rightEndIndex;
        var result =
            rightEndLength > 2 ||
            rightEndLength > 1 && !isUnluckyRightEnd(solutions, rightEndIndex);
        return result;
    }
    
    function findLastBridge(solutions)
    {
        for (var index = solutions.length; index--;)
        {
            var solution = solutions[index];
            if (solution.bridge)
                return index;
        }
    }
    
    function findNextBridge(solutions, index)
    {
        for (;; ++index)
        {
            var solution = solutions[index];
            if (solution.bridge)
                return index;
        }
    }
    
    function findSplitIndex(solutions, intrinsicSplitCost, firstBridgeIndex, lastBridgeIndex)
    {
        var index = 1;
        var lastIndex = firstBridgeIndex - 1;
        var optimalSplitCost = getSplitCostAt(solutions, index, true, index === lastIndex);
        var splitIndex = index;
        while (++index < firstBridgeIndex)
        {
            var splitCost = getSplitCostAt(solutions, index, false, index === lastIndex);
            if (splitCost < optimalSplitCost)
            {
                optimalSplitCost = splitCost;
                splitIndex = index;
            }
        }
        if (
            optimalSplitCost + intrinsicSplitCost < 0 &&
            !(optimalSplitCost > 0 && canSplitRightEndForFree(solutions, lastBridgeIndex)))
            return splitIndex;
    }
    
    function gatherGroup(solutions, groupBond, groupForceString, bridgeUsed)
    {
        function appendRightGroup(groupCount)
        {
            array.push(sequenceAsString(solutions, index, groupCount, '[[]]'), ')');
        }
        
        var count = solutions.length;
        var lastBridgeIndex;
        if (bridgeUsed)
            lastBridgeIndex = findLastBridge(solutions);
        var array;
        var multiPart = lastBridgeIndex == null;
        if (multiPart)
            array = sequence(solutions, 0, count);
        else
        {
            var bridgeIndex = findNextBridge(solutions, 0);
            var index;
            if (bridgeIndex > 1)
            {
                var intrinsicSplitCost = groupForceString ? -3 : groupBond ? 2 : 0;
                index = findSplitIndex(solutions, intrinsicSplitCost, bridgeIndex, lastBridgeIndex);
            }
            multiPart = index != null;
            if (multiPart)
            {
                // Keep the first solutions out of the concat context to reduce output
                // length.
                var preBridgeCount = index;
                array =
                    preBridgeCount > 1 ? sequence(solutions, 0, preBridgeCount) : [solutions[0]];
                array.push('+');
            }
            else
            {
                array = [];
                index = 0;
            }
            array.push('[', sequenceAsString(solutions, index, bridgeIndex - index, '[]'), ']');
            for (;;)
            {
                array.push(solutions[bridgeIndex].bridge, '(');
                index = bridgeIndex + 1;
                if (bridgeIndex === lastBridgeIndex)
                    break;
                bridgeIndex = findNextBridge(solutions, index);
                appendRightGroup(bridgeIndex - index);
            }
            var groupCount;
            var rightEndCount = count - index;
            if (groupForceString && !multiPart && rightEndCount > 1)
            {
                groupCount = rightEndCount > 2 && isUnluckyRightEnd(solutions, index) ? 2 : 1;
                multiPart = true;
            }
            else
                groupCount = rightEndCount;
            appendRightGroup(groupCount);
            index += groupCount - 1;
            while (++index < count)
                pushSolution(array, solutions[index]);
            if (!multiPart && groupForceString)
            {
                array.push('+[]');
                multiPart = true;
            }
        }
        var str = array.join('');
        if (groupBond && multiPart)
            str = '(' + str + ')';
        return str;
    }
    
    function getNumericJoinCost(level0, level1)
    {
        var joinCost = level0 > LEVEL_UNDEFINED || level1 > LEVEL_UNDEFINED ? 2 : 3;
        return joinCost;
    }
    
    function getSplitCostAt(solutions, index, leftmost, rightmost)
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
            (solutionRight.hasOuterPlus ? 2 : 0) :
            0
        ) -
        (
            leftmost &&
            isNumericJoin(levelCenter, levelLeft = solutions[index - 1].level) ?
            getNumericJoinCost(levelLeft, levelCenter) :
            solutionCenter.hasOuterPlus ? 2 : 0
        );
        return splitCost;
    }
    
    function isNumericJoin(level0, level1)
    {
        var result = level0 < LEVEL_OBJECT && level1 < LEVEL_OBJECT;
        return result;
    }
    
    function isUnluckyRightEnd(solutions, firstIndex)
    {
        var result =
            solutions[firstIndex].level < LEVEL_NUMERIC &&
            solutions[firstIndex + 1].level > LEVEL_UNDEFINED;
        return result;
    }
    
    function pushSolution(array, solution)
    {
        if (solution.hasOuterPlus)
            array.push('+(', solution, ')');
        else
            array.push('+', solution);
    }
    
    function sequence(solutions, offset, count)
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
    
    function sequenceAsString(solutions, offset, count, emptyReplacement)
    {
        var str;
        if (count)
        {
            if (count > 1)
                str = sequence(solutions, offset, count).join('');
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
    
    ScrewBuffer =
        function (bond, forceString, groupThreshold, optimizer)
        {
            function gather(offset, count, groupBond, groupForceString)
            {
                var str;
                if (optimizer)
                {
                    var end = offset + count;
                    var groupSolutions = solutions.slice(offset, end);
                    optimizer.optimizeSolutions(groupSolutions, groupBond);
                    str =
                        groupSolutions.length > 1 ?
                        gatherGroup(groupSolutions, groupBond, groupForceString, bridgeUsed) :
                        groupSolutions[0] + '';
                }
                else
                {
                    var array = sequence(solutions, offset, count);
                    str = array.join('');
                    if (groupBond)
                        str = '(' + str + ')';
                }
                return str;
            }
            
            var bridgeUsed;
            var length = bond ? -1 : -3;
            var maxSolutionCount = math_pow(2, groupThreshold - 1);
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
                        length +=
                            optimizer ?
                            optimizer.optimizeAppendLength(solution) :
                            solution.appendLength;
                        return true;
                    },
                    get length()
                    {
                        var result;
                        switch (solutions.length)
                        {
                        case 0:
                            result = forceString ? bond ? 7 : 5 : 2;
                            break;
                        case 1:
                            var solution = solutions[0];
                            result =
                                solution.length +
                                (forceString && solution.level < LEVEL_STRING ? bond ? 5 : 3 : 0);
                            break;
                        default:
                            result = length;
                            break;
                        }
                        return result;
                    },
                    toString: function ()
                    {
                        function collectOut(offset, count, maxGroupCount, groupBond)
                        {
                            var str;
                            if (count <= groupSize + 1)
                                str = gather(offset, count, groupBond);
                            else
                            {
                                maxGroupCount /= 2;
                                var halfCount = groupSize * maxGroupCount;
                                var capacity = 2 * halfCount - count;
                                var leftEndCount =
                                    math_max(
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
                                if (groupBond)
                                    str = '(' + str + ')';
                            }
                            return str;
                        }
                        
                        var multiPart;
                        var str;
                        var solutionCount = solutions.length;
                        if (solutionCount < 2)
                        {
                            if (solutionCount)
                            {
                                var solution = solutions[0];
                                multiPart = forceString && solution.level < LEVEL_STRING;
                                str = solution.replacement;
                            }
                            else
                            {
                                multiPart = forceString;
                                str = '[]';
                            }
                            if (multiPart)
                            {
                                str += '+[]';
                                if (bond)
                                    str = '(' + str + ')';
                            }
                        }
                        else
                        {
                            if (solutionCount <= groupThreshold)
                                str = gather(0, solutionCount, bond, forceString);
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
                                str = collectOut(0, solutionCount, maxGroupCount, bond);
                            }
                        }
                        return str;
                    }
                }
            );
        };
}
)();

// Recognized syntax elements include:
//
// * The boolean literals "true" and "false"
// * The pseudoconstant literals "undefined", "NaN" and "Infinity"
// * ES5 strict mode numeric literals
// * ES5 strict mode string literals with the line continuation extension
// * Empty and singleton array literals
// * ASCII identifiers
// * ASCII property getters in dot notation
// * Property getters in bracket notation
// * Function calls without parameters and with one parameter
// * The unary operators "!", "+", and to a limited extent "-" and "++" (prefix and postfix
//   increment)
// * The binary operators "+" and to a limited extent "-"
// * Grouping parentheses
// * White spaces and line terminators
// * Semicolons
// * Comments

var expressParse;

(function ()
{
    function appendGetOp(parseInfo, op)
    {
        var str = stringifyUnit(op);
        if (str != null)
            op.str = str;
        op.type = 'get';
        appendOp(parseInfo, op);
    }
    
    function appendOp(parseInfo, op)
    {
        var opsStack = parseInfo.opsStack;
        var ops = opsStack[opsStack.length - 1];
        ops.push(op);
    }
    
    function appendTerm(parseInfo, term)
    {
        var unit = popUnit(parseInfo);
        var mod = popMod(parseInfo);
        applyMod(term, mod);
        if (unit)
        {
            if (!finalizeUnit(term))
                return;
            var terms = unit.terms;
            if (terms && isUndecoratedUnit(unit))
            {
                terms.push(term);
                if (!term.arithmetic)
                    unit.arithmetic = false;
            }
            else
            {
                if (!finalizeUnit(unit))
                    return;
                var arithmetic = unit.arithmetic && term.arithmetic;
                unit = { arithmetic: arithmetic, ops: [], terms: [unit, term] };
            }
        }
        else
            unit = term;
        var binSign = read(parseInfo, /^(?:\+(?!\+)|-(?!-))/);
        if (!binSign)
        {
            var finalizer = popFinalizer(parseInfo);
            return finalizer(unit, parseInfo);
        }
        if (binSign === '-' && !unit.arithmetic)
            applyMod(unit, '+');
        mod = readMod(parseInfo, binSign === '+' ? '' : binSign);
        pushMod(parseInfo, mod);
        pushUnit(parseInfo, unit);
        return parsePrimaryExpr;
    }
    
    function applyMod(unit, mod)
    {
        if (!unit.mod && 'value' in unit && unit.arithmetic && !unit.pmod)
        {
            var value = unit.value;
            loop:
            for (var index = mod.length; index--;)
            {
                var thisMod = mod[index];
                switch (thisMod)
                {
                case '!':
                    value = !value;
                    break;
                case '+':
                    value = +value;
                    break;
                case '-':
                    value = -value;
                    break;
                case '#':
                    break loop;
                }
            }
            unit.value = value;
            mod = mod.slice(0, index + 1);
        }
        if (mod)
        {
            mod = joinMods(mod, unit.mod || '', unit.pmod);
            unit.mod = mod;
            unit.arithmetic = true;
        }
    }
    
    function defaultReadIdentifierData(parseInfo)
    {
        var rawIdentifier = read(parseInfo, rawIdentifierRegExp);
        if (rawIdentifier)
        {
            var identifier = json_parse('"' + rawIdentifier + '"');
            if (/^[$A-Z_a-z][$\w]*$/.test(identifier))
            {
                var escaped = identifier.length < rawIdentifier.length;
                return { escaped: escaped, identifier: identifier };
            }
        }
    }
    
    function escapeMod(mod)
    {
        var escapedMod = mod.replace(/\+\+/g, '#');
        return escapedMod;
    }
    
    function evalExpr(expr)
    {
        var value = Function('return ' + expr)();
        return value;
    }
    
    function finalizeArrayElement(unit, parseInfo)
    {
        if (finalizeUnit(unit) && readSquareBracketRight(parseInfo))
        {
            newOps(parseInfo, { value: [unit] });
            return parseNextOp;
        }
    }
    
    function finalizeGroup(unit, parseInfo)
    {
        if (readParenthesisRight(parseInfo))
        {
            newOps(parseInfo, unit);
            return parseNextOp;
        }
    }
    
    function finalizeIndexer(op, parseInfo)
    {
        if (finalizeUnit(op) && readSquareBracketRight(parseInfo))
        {
            appendGetOp(parseInfo, op);
            return parseNextOp;
        }
    }
    
    function finalizeParamCall(op, parseInfo)
    {
        if (finalizeUnit(op) && readParenthesisRight(parseInfo))
        {
            op.type = 'param-call';
            appendOp(parseInfo, op);
            return parseNextOp;
        }
    }
    
    function finalizeUnit(unit)
    {
        var mod = unit.mod || '';
        if (!/-/.test(mod) && (!/#$/.test(mod) || unit.ops.length))
        {
            unit.mod = unescapeMod(mod);
            return unit;
        }
    }
    
    function isReturnableIdentifier(identifier, escaped)
    {
        var returnable =
            UNRETURNABLE_WORDS.indexOf(identifier) < 0 &&
            (!escaped || INESCAPABLE_WORDS.indexOf(identifier) < 0);
        return returnable;
    }
    
    function isUndecoratedUnit(unit)
    {
        var undecorated = !(unit.mod || unit.ops.length);
        return undecorated;
    }
    
    function joinMods(mod1, mod2, trimTrailingPlus)
    {
        var mod =
            (mod1 + mod2)
            .replace(/\+\+|--/, '+')
            .replace(/\+-|-\+/, '-')
            .replace(/!-/, '!+')
            .replace(/\+#/, '#')
            .replace(/!\+!/, '!!')
            .replace('!!!', '!');
        if (trimTrailingPlus)
            mod = mod.replace(/\+$/, '');
        return mod;
    }
    
    function makeRegExp(richPattern)
    {
        var pattern = '^(?:' + replacePattern(richPattern) + ')';
        var regExp = RegExp(pattern);
        return regExp;
    }
    
    function newOps(parseInfo, unit)
    {
        pushNewOps(parseInfo);
        pushUnit(parseInfo, unit);
    }
    
    function parse(parseInfo)
    {
        for (var next = parseUnit; typeof next === 'function'; next = next(parseInfo));
        return next;
    }
    
    function parseNextOp(parseInfo)
    {
        if (readParenthesisLeft(parseInfo))
        {
            if (readParenthesisRight(parseInfo))
            {
                appendOp(parseInfo, { type: 'call' });
                return parseNextOp;
            }
            pushFinalizer(parseInfo, finalizeParamCall);
            return parseUnit;
        }
        if (readSquareBracketLeft(parseInfo))
        {
            pushFinalizer(parseInfo, finalizeIndexer);
            return parseUnit;
        }
        if (read(parseInfo, /^\./))
        {
            var identifierData = defaultReadIdentifierData(parseInfo);
            if (!identifierData)
                return;
            appendGetOp(parseInfo, { ops: [], value: identifierData.identifier });
            return parseNextOp;
        }
        var unit = popUnit(parseInfo);
        var ops = popOps(parseInfo);
        if (ops.length)
        {
            unit.arithmetic = false;
            if (unit.mod || unit.pmod)
            {
                if (!finalizeUnit(unit))
                    return;
                unit = { terms: [unit] };
            }
        }
        unit.ops = ops = (unit.ops || []).concat(ops);
        if (ops.length && !unit.mod && !unit.pmod)
        {
            if (/^.*$/.test(parseInfo.separator))
            {
                var pmod = read(parseInfo, /^\+\+/);
                if (pmod)
                {
                    unit.pmod = pmod;
                    unit.arithmetic = true;
                }
            }
        }
        var next = appendTerm(parseInfo, unit);
        return next;
    }
    
    function parsePrimaryExpr(parseInfo)
    {
        var strExpr = read(parseInfo, strRegExp);
        if (strExpr)
        {
            var str = evalExpr(strExpr);
            newOps(parseInfo, { value: str });
            return parseNextOp;
        }
        var constValueExpr = read(parseInfo, constValueRegExp);
        if (constValueExpr)
        {
            var constValue = evalExpr(constValueExpr);
            newOps(parseInfo, { arithmetic: true, value: constValue });
            return parseNextOp;
        }
        if (readSquareBracketLeft(parseInfo))
        {
            if (readSquareBracketRight(parseInfo))
            {
                newOps(parseInfo, { value: [] });
                return parseNextOp;
            }
            pushFinalizer(parseInfo, finalizeArrayElement);
            return parseUnit;
        }
        if (readParenthesisLeft(parseInfo))
        {
            pushFinalizer(parseInfo, finalizeGroup);
            return parseUnit;
        }
        var identifierData = defaultReadIdentifierData(parseInfo);
        if (identifierData)
        {
            var identifier = identifierData.identifier;
            if (isReturnableIdentifier(identifier, identifierData.escaped))
            {
                newOps(parseInfo, { identifier: identifier });
                return parseNextOp;
            }
        }
    }
    
    function parseUnit(parseInfo)
    {
        var MAX_PARSABLE_NESTINGS = 1000;
        
        if (parseInfo.finalizerStack.length <= MAX_PARSABLE_NESTINGS)
        {
            var mod = readMod(parseInfo, '');
            pushMod(parseInfo, mod);
            pushUnit(parseInfo);
            return parsePrimaryExpr;
        }
    }
    
    function popFinalizer(parseInfo)
    {
        var ret = parseInfo.finalizerStack.pop();
        return ret;
    }
    
    function popMod(parseInfo)
    {
        var mod = parseInfo.modStack.pop();
        return mod;
    }
    
    function popOps(parseInfo)
    {
        var ops = parseInfo.opsStack.pop();
        return ops;
    }
    
    function popUnit(parseInfo)
    {
        var unit = parseInfo.unitStack.pop();
        return unit;
    }
    
    function pushFinalizer(parseInfo, finalizer)
    {
        parseInfo.finalizerStack.push(finalizer);
    }
    
    function pushMod(parseInfo, mod)
    {
        parseInfo.modStack.push(mod);
    }
    
    function pushNewOps(parseInfo)
    {
        parseInfo.opsStack.push([]);
    }
    
    function pushUnit(parseInfo, unit)
    {
        parseInfo.unitStack.push(unit);
    }
    
    function read(parseInfo, regExp)
    {
        var data = parseInfo.data;
        var matches = regExp.exec(data);
        if (matches)
        {
            var match = matches[0];
            data = data.slice(match.length);
            var separator = separatorRegExp.exec(data)[0];
            if (separator)
                data = data.slice(separator.length);
            parseInfo.data = data;
            parseInfo.separator = separator;
            return match;
        }
    }
    
    function readMod(parseInfo, mod)
    {
        var newMod;
        while (newMod = read(parseInfo, /^(?:!|\+\+?|-(?!-))/))
            mod = joinMods(mod, escapeMod(newMod));
        return mod;
    }
    
    function readParenthesisLeft(parseInfo)
    {
        var match = read(parseInfo, /^\(/);
        return match;
    }
    
    function readParenthesisRight(parseInfo)
    {
        var match = read(parseInfo, /^\)/);
        return match;
    }
    
    function readSeparatorOrColon(parseInfo)
    {
        parseInfo.data = parseInfo.data.replace(separatorOrColonRegExp, '');
    }
    
    function readSquareBracketLeft(parseInfo)
    {
        var match = read(parseInfo, /^\[/);
        return match;
    }
    
    function readSquareBracketRight(parseInfo)
    {
        var match = read(parseInfo, /^]/);
        return match;
    }
    
    function replaceAndGroupToken(unused, tokenName)
    {
        var replacement = '(?:' + replaceToken(tokenName) + ')';
        return replacement;
    }
    
    function replacePattern(richPattern)
    {
        var pattern = richPattern.replace(/#(\w+)/g, replaceAndGroupToken);
        return pattern;
    }
    
    function replaceToken(tokenName)
    {
        var replacement = tokenCache[tokenName];
        if (replacement == null)
        {
            var richPattern = tokens[tokenName];
            tokenCache[tokenName] = replacement = replacePattern(richPattern);
        }
        return replacement;
    }
    
    function stringifyUnit(unit)
    {
        var inArray = false;
        while ('value' in unit && isUndecoratedUnit(unit))
        {
            var value = unit.value;
            if (!array_isArray(value))
                return value == null && inArray ? '' : value + '';
            unit = value[0];
            if (!unit)
                return '';
            inArray = true;
        }
    }
    
    function unescapeMod(mod)
    {
        var unescapedMod = mod.replace(/#/g, '++');
        return unescapedMod;
    }
    
    var tokens =
    {
        ConstIdentifier:
            'Infinity|NaN|false|true|undefined',
        DecimalLiteral:
            '(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:[Ee][+-]?\\d+)?',
        DoubleQuotedString:
            '"(?:#EscapeSequence|(?!["\\\\]).)*"',
        EscapeSequence:
            '\\\\(?:u#HexDigit{4}|x#HexDigit{2}|0(?![0-7])|\r\n|[^0-7ux])',
        HexDigit:
            '[0-9A-Fa-f]',
        HexIntegerLiteral:
            '0[Xx]#HexDigit+',
        NumericLiteral:
            '#HexIntegerLiteral|#DecimalLiteral',
        Separator:
            '#SeparatorChar|//.*(?!.)|/\\*[\\s\\S]*?\\*/',
        SeparatorChar:
            '[\\s\uFEFF]', // U+FEFF is missed by /\s/ in Android Browser < 4.1.x.
        SingleQuotedString:
            '\'(?:#EscapeSequence|(?![\'\\\\]).)*\'',
        UnicodeEscapeSequence:
            '\\\\u#HexDigit{4}',
    };
    
    var tokenCache = new Empty();
    
    // Reserved words and that cannot be written with escape sequences.
    var INESCAPABLE_WORDS = ['false', 'null', 'true'];
    
    // This list includes reserved words and identifiers that would cause a change in a script's
    // behavior when placed after a return statement inside a Function invocation.
    // Unwanted changes include producing a syntax error where none is expected or a difference in
    // evaluation.
    var UNRETURNABLE_WORDS =
    [
        'arguments',    // shadowed in function body
        'debugger',     // : debugger;
        'delete',       // : delete(x);
        'if',           // : if(x);
        'let',          // may be an identifier in non-strict mode
        'new',          // : new(x);
        'return',       // : return;
        'this',         // shadowed in function body
        'throw',        // : throw(x);
        'typeof',       // : typeof(x);
        'void',         // : void(x);
        'while',        // : while(x);
        'with',         // : with(x);
        'yield',        // may be an identifier in non-strict mode
    ];
    
    var constValueRegExp        = makeRegExp('(?:#NumericLiteral|#ConstIdentifier)');
    var rawIdentifierRegExp     = makeRegExp('(?:[$\\w]|#UnicodeEscapeSequence)+');
    var separatorOrColonRegExp  = makeRegExp('(?:#Separator|;)*');
    var separatorRegExp         = makeRegExp('#Separator*');
    var strRegExp               = makeRegExp('#SingleQuotedString|#DoubleQuotedString');
    
    expressParse =
        function (input)
        {
            var parseInfo =
            {
                data: input,
                modStack: [],
                opsStack: [],
                finalizerStack: [finalizeUnit],
                unitStack: []
            };
            readSeparatorOrColon(parseInfo);
            if (!parseInfo.data)
                return true;
            var unit = parse(parseInfo);
            if (unit)
            {
                readSeparatorOrColon(parseInfo);
                if (!parseInfo.data)
                    return unit;
            }
        };
}
)();

var APPEND_LENGTH_OF_DIGITS;
var APPEND_LENGTH_OF_DIGIT_0;
var APPEND_LENGTH_OF_PLUS_SIGN;
var APPEND_LENGTH_OF_SMALL_E;

var Encoder;

var replaceIndexer;
var replaceMultiDigitNumber;
var resolveSimple;

(function ()
{
    function createReplaceString(optimize)
    {
        function replaceString(encoder, str, bond, forceString)
        {
            var replacement = encoder.replaceString(str, optimize, bond, forceString);
            if (!replacement)
                encoder.throwSyntaxError('String too complex');
            return replacement;
        }
        
        return replaceString;
    }
    
    function evalNumber(preMantissa, lastDigit, exp)
    {
        var value = +(preMantissa + lastDigit + 'e' + exp);
        return value;
    }
    
    function formatPositiveNumber(number)
    {
        function getMantissa()
        {
            var lastDigitIndex = usefulDigits - 1;
            var preMantissa = digits.slice(0, lastDigitIndex);
            var lastDigit = +digits[lastDigitIndex];
            var value = evalNumber(preMantissa, lastDigit, exp);
            for (;;)
            {
                var decreasedLastDigit = lastDigit - 1;
                var newValue = evalNumber(preMantissa, decreasedLastDigit, exp);
                if (newValue !== value)
                    break;
                lastDigit = decreasedLastDigit;
            }
            var mantissa = preMantissa + lastDigit;
            return mantissa;
        }
        
        var str;
        var match = /^(\d+)(?:\.(\d+))?(?:e(.+))?$/.exec(number);
        var digitsAfterDot = match[2] || '';
        var digits = (match[1] + digitsAfterDot).replace(/^0+/, '');
        var usefulDigits = digits.search(/0*$/);
        var exp = (match[3] | 0) - digitsAfterDot.length + digits.length - usefulDigits;
        var mantissa = getMantissa();
        if (exp >= 0)
        {
            if (exp < 10)
                str = mantissa + getExtraZeros(exp);
            else
                str = mantissa + 'e' + exp;
        }
        else
        {
            if (exp >= -mantissa.length)
                str = mantissa.slice(0, exp) + '.' + mantissa.slice(exp);
            else
            {
                var extraZeroCount = -mantissa.length - exp;
                var extraLength = APPEND_LENGTH_OF_DOT + APPEND_LENGTH_OF_DIGIT_0 * extraZeroCount;
                str =
                    replaceNegativeExponential(mantissa, exp, extraLength) ||
                    '.' + getExtraZeros(extraZeroCount) + mantissa;
            }
        }
        return str;
    }
    
    function getExtraZeros(count)
    {
        var extraZeros = Array(count + 1).join('0');
        return extraZeros;
    }
    
    function getMultiDigitLength(str)
    {
        var appendLength = 0;
        array_prototype_forEach.call(
            str,
            function (digit)
            {
                var digitAppendLength = APPEND_LENGTH_OF_DIGITS[digit];
                appendLength += digitAppendLength;
            }
        );
        return appendLength;
    }
    
    function replaceIdentifier(encoder, identifier, bondStrength)
    {
        var solution;
        if (identifier in encoder.constantDefinitions)
            solution = encoder.resolveConstant(identifier);
        else if (identifier in SIMPLE)
            solution = SIMPLE[identifier];
        if (!solution)
            encoder.throwSyntaxError('Undefined identifier ' + identifier);
        var groupingRequired =
            bondStrength && solution.hasOuterPlus ||
            bondStrength > BOND_STRENGTH_WEAK && solution.charAt(0) === '!';
        var replacement = solution.replacement;
        if (groupingRequired)
            replacement = '(' + replacement + ')';
        return replacement;
    }
    
    function replaceNegativeExponential(mantissa, exp, rivalExtraLength)
    {
        var extraZeroCount;
        if (exp % 100 > 7 - 100)
        {
            if (exp % 10 > -7)
                extraZeroCount = 0;
            else
                extraZeroCount = 10 + exp % 10;
        }
        else
            extraZeroCount = 100 + exp % 100;
        mantissa += getExtraZeros(extraZeroCount);
        exp -= extraZeroCount;
        var extraLength =
            APPEND_LENGTH_OF_DIGIT_0 * extraZeroCount +
            APPEND_LENGTH_OF_SMALL_E +
            APPEND_LENGTH_OF_MINUS +
            getMultiDigitLength(-exp + '');
        if (extraLength < rivalExtraLength)
        {
            var str = mantissa + 'e' + exp;
            return str;
        }
    }
    
    var STATIC_CHAR_CACHE = new Empty();
    var STATIC_CONST_CACHE = new Empty();
    
    var CharCache = createConstructor(STATIC_CHAR_CACHE);
    var ConstCache = createConstructor(STATIC_CONST_CACHE);
    
    var quoteString = json_stringify;
    
    APPEND_LENGTH_OF_DIGIT_0    = 6;
    APPEND_LENGTH_OF_PLUS_SIGN  = 71;
    APPEND_LENGTH_OF_SMALL_E    = 26;
    
    APPEND_LENGTH_OF_DIGITS     = [APPEND_LENGTH_OF_DIGIT_0, 8, 12, 17, 22, 27, 32, 37, 42, 47];
    
    Encoder =
        function (mask)
        {
            this.mask           = mask;
            this.charCache      = new CharCache();
            this.complexCache   = new Empty();
            this.constCache     = new ConstCache();
            this.stack          = [];
        };
    
    var encoderProtoSource =
    {
        callResolver: function (stackName, resolver)
        {
            var stack = this.stack;
            var stackIndex = stack.indexOf(stackName);
            stack.push(stackName);
            try
            {
                if (~stackIndex)
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
        
        complexFilterCallback: function (complex)
        {
            var result = this.complexCache[complex] !== null;
            return result;
        },
        
        constantDefinitions: CONSTANTS,
        
        createStringTokenRegExp: function ()
        {
            var regExp = RegExp(this.strTokenPattern, 'g');
            return regExp;
        },
        
        defaultResolveCharacter: function (char)
        {
            var charCode = char.charCodeAt();
            var entries;
            if (charCode < 0x100)
                entries = DEFAULT_8_BIT_CHARACTER_ENCODER;
            else
                entries = DEFAULT_16_BIT_CHARACTER_ENCODER;
            var defaultCharacterEncoder = this.findDefinition(entries);
            var replacement = defaultCharacterEncoder.call(this, charCode);
            var solution = createSolution(replacement, LEVEL_STRING, false);
            return solution;
        },
        
        findBase64AlphabetDefinition: function (element)
        {
            var definition;
            if (array_isArray(element))
                definition = this.findDefinition(element);
            else
                definition = element;
            return definition;
        },
        
        findDefinition: function (entries)
        {
            for (var entryIndex = entries.length; entryIndex--;)
            {
                var entry = entries[entryIndex];
                if (this.hasFeatures(entry.mask))
                    return entry.definition;
            }
        },
        
        findOptimalSolution: function (entries)
        {
            var result;
            entries.forEach(
                function (entry, entryIndex)
                {
                    if (this.hasFeatures(entry.mask))
                    {
                        var solution = this.resolve(entry.definition);
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
        
        hasFeatures: function (mask)
        {
            var included = maskIncludes(this.mask, mask);
            return included;
        },
        
        hexCodeOf: function (charCode, length)
        {
            var optimalB = this.findDefinition(OPTIMAL_B);
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
        
        optimizeComplexCache: function (str)
        {
            if (str.length >= 100)
            {
                for (var complex in COMPLEX)
                {
                    if (!(complex in this.complexCache))
                    {
                        var entries = COMPLEX[complex];
                        var definition = this.findDefinition(entries);
                        if (!definition)
                            this.complexCache[complex] = null;
                    }
                }
                this.optimizeComplexCache = noop;
            }
        },
        
        replaceExpr: function (expr, optimize)
        {
            var unit = expressParse(expr);
            if (!unit)
                this.throwSyntaxError('Syntax error');
            var replacers = optimize ? OPTIMIZING_REPLACERS : REPLACERS;
            var replacement = this.replaceExpressUnit(unit, false, [], NaN, replacers);
            return replacement;
        },
        
        replaceExpressUnit: function (unit, bond, unitIndices, maxLength, replacers)
        {
            var mod = unit.mod || '';
            var pmod = unit.pmod || '';
            var groupingRequired = bond && mod[0] === '+';
            var maxCoreLength =
                maxLength - (mod ? (groupingRequired ? 2 : 0) + mod.length : 0) - pmod.length;
            var ops = unit.ops;
            var opCount = ops.length;
            var primaryExprBondStrength =
                opCount || pmod ?
                BOND_STRENGTH_STRONG : bond || mod ? BOND_STRENGTH_WEAK : BOND_STRENGTH_NONE;
            var output =
                this.replacePrimaryExpr(
                    unit,
                    primaryExprBondStrength,
                    unitIndices,
                    maxCoreLength,
                    replacers
                );
            if (output)
            {
                for (var index = 0; index < opCount; ++index)
                {
                    var op = ops[index];
                    var type = op.type;
                    if (type === 'call')
                    {
                        output += '()';
                        if (output.length > maxCoreLength)
                            return;
                    }
                    else
                    {
                        var opOutput;
                        var opUnitIndices = unitIndices.concat(index + 1);
                        var maxOpLength = maxCoreLength - output.length - 2;
                        var str = op.str;
                        if (str != null)
                        {
                            var strReplacer = replacers.string;
                            opOutput =
                                strReplacer(this, str, false, false, opUnitIndices, maxOpLength);
                        }
                        else
                        {
                            opOutput =
                                this.replaceExpressUnit(
                                    op,
                                    false,
                                    opUnitIndices,
                                    maxOpLength,
                                    replacers
                                );
                        }
                        if (!opOutput)
                            return;
                        if (type === 'get')
                            output += '[' + opOutput + ']';
                        else
                            output += '(' + opOutput + ')';
                    }
                }
                output += pmod;
                if (mod)
                {
                    output = mod + output;
                    if (groupingRequired)
                        output = '(' + output + ')';
                }
            }
            return output;
        },
        
        replacePrimaryExpr: function (unit, bondStrength, unitIndices, maxLength, replacers)
        {
            var output;
            var terms;
            var identifier;
            if (terms = unit.terms)
            {
                var count = terms.length;
                var maxCoreLength = maxLength - (bondStrength ? 2 : 0);
                for (var index = 0; index < count; ++index)
                {
                    var term = terms[index];
                    var termUnitIndices = count > 1 ? unitIndices.concat(index) : unitIndices;
                    var maxTermLength = maxCoreLength - 3 * (count - index - 1);
                    var termOutput =
                        this.replaceExpressUnit(
                            term,
                            index,
                            termUnitIndices,
                            maxTermLength,
                            replacers
                        );
                    if (!termOutput)
                        return;
                    output = index ? output + '+' + termOutput : termOutput;
                    maxCoreLength -= termOutput.length + 1;
                }
                if (bondStrength)
                    output = '(' + output + ')';
            }
            else if (identifier = unit.identifier)
            {
                var identifierReplacer = replacers.identifier;
                output =
                    identifierReplacer(this, identifier, bondStrength, unitIndices, maxLength);
            }
            else
            {
                var value = unit.value;
                if (typeof value === 'string')
                {
                    var strReplacer = replacers.string;
                    output = strReplacer(this, value, bondStrength, true, unitIndices, maxLength);
                }
                else if (array_isArray(value))
                {
                    if (value.length)
                    {
                        var replacement =
                            this.replaceExpressUnit(
                                value[0],
                                false,
                                unitIndices,
                                maxLength - 2,
                                replacers
                            );
                        if (replacement)
                            output = '[' + replacement + ']';
                    }
                    else if (!(maxLength < 2))
                        output = '[]';
                }
                else
                {
                    if (typeof value === 'number' && !isNaN(value))
                    {
                        var abs = math_abs(value);
                        var negative = value < 0 || 1 / value < 0;
                        var str;
                        if (abs === 0)
                            str = '0';
                        else if (abs === Infinity)
                            str = JSFUCK_INFINITY;
                        else
                            str = formatPositiveNumber(abs);
                        if (negative)
                            str = '-' + str;
                        output = STATIC_ENCODER.replaceString(str);
                        if (str.length > 1)
                            output = '+(' + output + ')';
                        if (bondStrength)
                            output = '(' + output + ')';
                    }
                    else
                        output = replaceIdentifier(STATIC_ENCODER, value + '', bondStrength);
                    if (output.length > maxLength)
                        return;
                }
            }
            return output;
        },
        
        replaceStaticString: function (str, maxLength)
        {
            var replacement = STATIC_ENCODER.replaceString(str, false, true, true, maxLength);
            return replacement;
        },
        
        replaceString: function (str, optimize, bond, forceString, maxLength)
        {
            var optimizer =
                optimize && (this.optimizer || (this.optimizer = createOptimizer(this)));
            var buffer = new ScrewBuffer(bond, forceString, this.maxGroupThreshold, optimizer);
            var match;
            this.optimizeComplexCache(str);
            if (!this.strTokenPattern)
                this.updateStringTokenPattern();
            var regExp = this.createStringTokenRegExp();
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
                    if (!solution)
                    {
                        var lastIndex = regExp.lastIndex - token.length;
                        this.updateStringTokenPattern();
                        regExp = this.createStringTokenRegExp();
                        regExp.lastIndex = lastIndex;
                        continue;
                    }
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
                var optimize;
                if (type === 'object')
                {
                    expr        = definition.expr;
                    level       = definition.level;
                    optimize    = definition.optimize;
                }
                else
                    expr = definition;
                var replacement = this.replaceExpr(expr, optimize);
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
                        if (!entries || array_isArray(entries))
                        {
                            if (entries)
                                solution = this.findOptimalSolution(entries);
                            if (!solution)
                                solution = this.defaultResolveCharacter(char);
                            charCache = this.charCache;
                        }
                        else
                        {
                            solution = STATIC_ENCODER.resolve(entries);
                            charCache = STATIC_CHAR_CACHE;
                        }
                        solution.char = char;
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
                        var definition = this.findDefinition(entries);
                        if (definition)
                        {
                            solution = this.resolve(definition);
                            if (solution.level == null)
                                solution.level = LEVEL_STRING;
                        }
                        else
                            solution = null;
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
                        if (array_isArray(entries))
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
            var paddingDefinition = this.findDefinition(entries);
            var paddingBlock;
            var indexer;
            if (typeof paddingDefinition === 'number')
            {
                var paddingInfo = this.findDefinition(paddingInfos);
                paddingBlock = this.getPaddingBlock(paddingInfo, paddingDefinition);
                indexer = index + paddingDefinition + paddingInfo.shift;
            }
            else
            {
                paddingBlock = paddingDefinition.block;
                indexer = paddingDefinition.indexer;
            }
            var fullExpr = '(' + paddingBlock + '+' + expr + ')[' + indexer + ']';
            var replacement = this.replaceExpr(fullExpr);
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
        },
        
        updateStringTokenPattern: function ()
        {
            function mapCallback(complex)
            {
                var str = complex + '|';
                return str;
            }
            
            var strTokenPattern =
                '(' + object_keys(SIMPLE).join('|') + ')|' +
                object_keys(COMPLEX)
                .filter(this.complexFilterCallback, this)
                .map(mapCallback).join('') +
                '([\\s\\S])';
            this.strTokenPattern = strTokenPattern;
        },
    };
    
    assignNoEnum(Encoder.prototype, encoderProtoSource);
    
    var APPEND_LENGTH_OF_DOT    = 73;
    var APPEND_LENGTH_OF_MINUS  = 154;
    
    var BOND_STRENGTH_NONE      = 0;
    var BOND_STRENGTH_WEAK      = 1;
    var BOND_STRENGTH_STRONG    = 2;
    
    var OPTIMIZING_REPLACERS = { identifier: replaceIdentifier, string: createReplaceString(true) };
    
    var REPLACERS = { identifier: replaceIdentifier, string: createReplaceString(false) };
    
    var STATIC_ENCODER = new Encoder([0, 0]);
    
    replaceIndexer =
        function (index)
        {
            var replacement = '[' + STATIC_ENCODER.replaceString(index) + ']';
            return replacement;
        };
    
    replaceMultiDigitNumber =
        function (number)
        {
            var str = formatPositiveNumber(number);
            var replacement = STATIC_ENCODER.replaceString(str);
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

function createFigurator(startValues, joiner)
{
    function createFigure(value, sortLength)
    {
        var figure = Object(value);
        figure.sortLength = sortLength;
        return figure;
    }
    
    function createPart(value, sortLength, isJoiner)
    {
        var part = createFigure(value, sortLength);
        part.isJoiner = isJoiner;
        return part;
    }
    
    function figurator(index)
    {
        while (figures.length <= index)
        {
            appendableParts.forEach(growFigures);
            var newFigures = figureList[currentSortLength++];
            if (newFigures)
                array_prototype_push.apply(figures, newFigures);
        }
        var figure = figures[index];
        return figure;
    }
    
    function growFigures(part)
    {
        var oldFigureSortLength = currentSortLength - part.sortLength;
        var oldFigures = figureList[oldFigureSortLength];
        if (oldFigures)
        {
            oldFigures.forEach(
                function (oldFigure)
                {
                    var newValue = oldFigure + part;
                    pushFigure(newValue, currentSortLength, part);
                }
            );
        }
    }
    
    function pushFigure(value, sortLength, part)
    {
        if (!(value in usedValueSet))
        {
            usedValueSet[value] = null;
            var figures = figureList[sortLength] || (figureList[sortLength] = []);
            var figure = createFigure(value, sortLength);
            figures.push(figure);
            part.isJoiner = false;
            for (; ; ++joinerIndex)
            {
                var joinerPart = PARTS[joinerIndex];
                if (!joinerPart)
                    break;
                if (joinerPart.isJoiner)
                {
                    figure.joiner = joinerPart.valueOf();
                    break;
                }
            }
        }
    }
    
    var PARTS =
    [
        createPart('',          0,                          false),
        createPart('false',     4,                          true),
        createPart('true',      5,                          true),
        createPart('0',         APPEND_LENGTH_OF_DIGIT_0,   true),
        createPart('undefined', 7,                          true),
        createPart('1',         8,                          true),
        createPart('NaN',       9,                          true),
        createPart('2',         12,                         true),
        createPart('f',         14,                         false),
        createPart('t',         15,                         false),
        createPart('a',         16,                         false),
        createPart('3',         17,                         true),
        createPart('N',         17,                         false),
        createPart('r',         17,                         false),
        createPart('u',         17,                         false),
        createPart('n',         19,                         false),
        createPart('l',         20,                         false),
        createPart('4',         22,                         true),
        createPart('d',         23,                         false),
        createPart('s',         25,                         false),
        createPart('e',         APPEND_LENGTH_OF_SMALL_E,   false),
        createPart('5',         27,                         true),
        createPart('i',         28,                         false),
        createPart('6',         32,                         true),
        createPart('7',         37,                         true),
        createPart('8',         42,                         true),
        createPart('9',         47,                         true),
    ];
    
    var currentSortLength = 0;
    var figureList = [];
    var figures = [];
    var joinerIndex = 0;
    var usedValueSet = new Empty();
    var appendableParts =
        PARTS.filter(
            function (part)
            {
                var value = part.valueOf();
                if (startValues.indexOf(value) >= 0)
                    pushFigure(value, part.sortLength, part);
                else if (value !== joiner)
                    return true;
            }
        );
    
    return figurator;
}

var createOptimizer;

(function ()
{
    // Optimized clusters take the form:
    //
    // +(X)["toString"](Y)
    //
    // X is a JSFuck integer between 23 and MAX_SAFE_INTEGER.
    //
    // Y takes at least 15 charactes for "20" and at most 46 characters for "36".
    //
    // The leading append plus is omitted when the optimized cluster is the first element of a
    // group.
    
    var CLUSTER_EXTRA_LENGTHS = [];
    var DECIMAL_DIGIT_MAX_COUNTS = [];
    var MAX_RADIX = 36;
    var MAX_SAFE_INTEGER = 0x1fffffffffffff;
    var MIN_CLUSTER_LENGTH = 2;
    var RADIX_REPLACEMENTS = [];
    
    function getMinRadix(char)
    {
        var minRadix = parseInt(char, MAX_RADIX) + 1;
        return minRadix;
    }
    
    function isClusterable(solution)
    {
        var char = solution.char;
        var clusterable = char != null && /[\da-z]/.test(char);
        return clusterable;
    }
    
    function subCreateOptimizer(toStringReplacement)
    {
        function applyPlan(plan, solutions)
        {
            var clusters = plan.conclude();
            clusters.forEach(
                function (cluster)
                {
                    var data = cluster.data;
                    var replacement =
                        '(+(' + data.decimalReplacement + '))[' + toStringReplacement + '](' +
                        data.radixReplacement + ')';
                    var solution = createSolution(replacement, LEVEL_STRING, false);
                    solutions.splice(cluster.start, cluster.length, solution);
                }
            );
        }
        
        function isSaving(solution)
        {
            var char = solution.char;
            var saving = optimizedLengthCache[char] <= solution.appendLength;
            return saving;
        }
        
        function optimizeAppendLength(solution)
        {
            var appendLength = solution.appendLength;
            var char = solution.char;
            if (char != null && /[bcghjkmopqvwxz]/.test(char))
            {
                var optimizedLength = optimizedLengthCache[char];
                if (optimizedLength == null)
                {
                    var minRadix = getMinRadix(char);
                    var clusterExtraLength = CLUSTER_EXTRA_LENGTHS[minRadix];
                    var decimalDigitMaxCount = DECIMAL_DIGIT_MAX_COUNTS[minRadix];
                    var partLength =
                        (clusterBaseLength + clusterExtraLength) / decimalDigitMaxCount | 0;
                    optimizedLengthCache[char] = optimizedLength =
                        math_min(appendLength, partLength);
                }
                appendLength = optimizedLength;
            }
            return appendLength;
        }
        
        function optimizeCluster(plan, start, radix, discreteAppendLength, chars)
        {
            do
            {
                var decimal = parseInt(chars, radix);
                if (decimal > MAX_SAFE_INTEGER)
                    return clusterAppendLength == null;
                var decimalReplacement = replaceMultiDigitNumber(decimal);
                // Adding 3 for leading "+(" and trailing ")".
                var decimalLength = decimalReplacement.length + 3;
                var radixReplacement = RADIX_REPLACEMENTS[radix];
                var radixLength = radixReplacement.length;
                var clusterAppendLength = clusterBaseLength + decimalLength + radixLength;
                var saving = discreteAppendLength - clusterAppendLength;
                if (saving >= 0)
                {
                    var data =
                    {
                        decimalReplacement: decimalReplacement,
                        radixReplacement:   radixReplacement
                    };
                    plan.addCluster(start, chars.length, data, saving);
                }
            }
            while (++radix <= MAX_RADIX);
        }
        
        function optimizeClusters(plan, solutions, start, maxClusterLength, bond)
        {
            var maxDigitChar = '';
            var discreteAppendLength = 0;
            var chars = '';
            var clusterLength = 0;
            do
            {
                var solution = solutions[start + clusterLength];
                discreteAppendLength += solution.appendLength;
                var char = solution.char;
                if (maxDigitChar < char)
                    maxDigitChar = char;
                chars += char;
                if (
                    ++clusterLength >= MIN_CLUSTER_LENGTH &&
                    discreteAppendLength > clusterBaseLength)
                {
                    var minRadix = getMinRadix(maxDigitChar);
                    // If a bonding is required, an integral cluster can save two additional
                    // characters by omitting a pair of parentheses.
                    if (bond && !start && clusterLength === maxClusterLength)
                        discreteAppendLength += 2;
                    var clusterTooLong =
                        optimizeCluster(plan, start, minRadix, discreteAppendLength, chars);
                    if (clusterTooLong)
                        break;
                }
            }
            while (clusterLength < maxClusterLength);
        }
        
        function optimizeSequence(plan, solutions, start, end, bond)
        {
            for (;; ++start)
            {
                var maxLength = end - start;
                if (solutions[start].char !== '0')
                    optimizeClusters(plan, solutions, start, maxLength, bond);
                if (maxLength <= MIN_CLUSTER_LENGTH)
                    break;
            }
        }
        
        function optimizeSolutions(solutions, bond)
        {
            var plan = createClusteringPlan();
            var end;
            var saving;
            for (var start = solutions.length; start > 0;)
            {
                var solution = solutions[--start];
                if (isClusterable(solution))
                {
                    if (!end)
                    {
                        end = start + 1;
                        saving = false;
                    }
                    if (!saving)
                        saving = isSaving(solution);
                    if (saving && end - start >= MIN_CLUSTER_LENGTH)
                        optimizeSequence(plan, solutions, start, end, bond);
                }
                else
                    end = undefined;
            }
            applyPlan(plan, solutions);
        }
        
        // Adding 7 for "+(", ")[", "](" and ")"
        var clusterBaseLength = toStringReplacement.length + 7;
        var optimizedLengthCache = new Empty();
        var optimizer =
            { optimizeAppendLength: optimizeAppendLength, optimizeSolutions: optimizeSolutions };
        return optimizer;
    }
    
    createOptimizer =
        function (encoder)
        {
            var toStringReplacement = encoder.replaceString('toString');
            var optimizer = subCreateOptimizer(toStringReplacement);
            return optimizer;
        };
    
    (function ()
    {
        // DECIMAL_MIN_LENGTHS is indexed by decimalDigitMaxCount (the number of digits used to
        // write MAX_SAFE_INTEGER in base radix).
        // decimalDigitMaxCount may only range from 11 (for radix 36) to 15 (for radix 12).
        var DECIMAL_MIN_LENGTHS =
        [
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            48, // 1e10
            50, // 1e11
            54, // 1e12
            ,
            64, // 1e14
        ];
        
        var minLength = Infinity;
        for (var radix = MAX_RADIX; radix >= 12; --radix)
        {
            var replacement = replaceMultiDigitNumber(radix);
            var length = replacement.length;
            if (length < minLength)
                minLength = length;
            RADIX_REPLACEMENTS[radix] = replacement;
            var decimalDigitMaxCount = DECIMAL_DIGIT_MAX_COUNTS[radix] =
                MAX_SAFE_INTEGER.toString(radix).length;
            CLUSTER_EXTRA_LENGTHS[radix] = DECIMAL_MIN_LENGTHS[decimalDigitMaxCount] + minLength;
        }
    }
    )();
}
)();

var CODERS;

var wrapWithCall;
var wrapWithEval;

(function ()
{
    function createReindexMap(count, radix, amendings, coerceToInt)
    {
        function getSortLength()
        {
            var length = 0;
            array_prototype_forEach.call(
                str,
                function (digit)
                {
                    length += digitAppendLengths[digit];
                }
            );
            return length;
        }
        
        var index;
        var digitAppendLengths = APPEND_LENGTH_OF_DIGITS.slice(0, radix || 10);
        var regExp;
        var replacer;
        if (amendings)
        {
            var firstDigit = radix - amendings;
            var pattern = '[';
            for (index = 0; index < amendings; ++index)
            {
                var digit = firstDigit + index;
                digitAppendLengths[digit] = SIMPLE[AMENDINGS[index]].appendLength;
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
                    reindex1.sortLength - reindex2.sortLength || reindex1.index - reindex2.index;
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
    
    function getCodingName(unitIndices)
    {
        var codingName = unitIndices.length ? unitIndices.join(':') : '0';
        return codingName;
    }
    
    function getDenseFigureLegendDelimiters(figurator, figures)
    {
        var delimiters = [FALSE_TRUE_DELIMITER];
        var lastFigure = figurator(figures.length - 1);
        var joiner = lastFigure.joiner;
        if (joiner != null)
            delimiters.push({ joiner: joiner, separator: joiner });
        return delimiters;
    }
    
    function getFrequencyList(inputData)
    {
        var freqList = inputData.freqList;
        if (!freqList)
        {
            var charMap = new Empty();
            array_prototype_forEach.call(
                inputData,
                function (char)
                {
                    ++(
                        charMap[char] ||
                        (charMap[char] = { char: char, charCode: char.charCodeAt(), count: 0 })
                    ).count;
                }
            );
            var charList = object_keys(charMap);
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
    
    function getSparseFigureLegendDelimiters()
    {
        var delimiters = [FALSE_FREE_DELIMITER];
        return delimiters;
    }
    
    function initMinFalseFreeCharIndexArrayStrLength(input)
    {
        var minCharIndexArrayStrLength =
            math_max((input.length - 1) * (SIMPLE.false.length + 1) - 3, 0);
        return minCharIndexArrayStrLength;
    }
    
    function initMinFalseTrueCharIndexArrayStrLength()
    {
        return -1;
    }
    
    // Replaces a non-empty JavaScript array with a JSFuck array of strings.
    // Array elements may only contain characters with static definitions in their string
    // representations and may not contain the substring "false", because the value false is used as
    // a separator in the encoding.
    function replaceFalseFreeArray(array, maxLength)
    {
        var result = this.replaceStringArray(array, [FALSE_FREE_DELIMITER], maxLength);
        return result;
    }
    
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
            34
        ),
        byDenseFigures: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDenseFigures(inputData, maxLength);
                return output;
            },
            2434
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
            245
        ),
        byDictRadix4: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 4, 0, maxLength);
                return output;
            },
            190
        ),
        byDictRadix4AmendedBy1: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 4, 1, maxLength);
                return output;
            },
            346
        ),
        byDictRadix4AmendedBy2: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 4, 2, maxLength);
                return output;
            },
            655
        ),
        byDictRadix5AmendedBy2: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 5, 2, maxLength);
                return output;
            },
            767
        ),
        byDictRadix5AmendedBy3: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 5, 3, maxLength);
                return output;
            },
            805
        ),
        bySparseFigures: defineCoder
        (
            function (inputData, maxLength)
            {
                var output = this.encodeBySparseFigures(inputData, maxLength);
                return output;
            },
            339
        ),
        express: defineCoder
        (
            function (inputData, maxLength)
            {
                var input = inputData.valueOf();
                var output = this.encodeExpress(input, maxLength);
                return output;
            }
        ),
        plain: defineCoder
        (
            function (inputData, maxLength)
            {
                var input = inputData.valueOf();
                var bond = inputData.bond;
                var output =
                    this.replaceString(input, true, bond, inputData.forceString, maxLength);
                return output;
            }
        ),
        text: defineCoder
        (
            function (inputData, maxLength)
            {
                var input = inputData.valueOf();
                var wrapper = inputData.wrapper;
                var output = this.encodeAndWrapText(input, wrapper, undefined, maxLength);
                return output;
            }
        ),
    };
    
    var encoderProtoSource =
    {
        callCoders: function (input, options, coderNames, codingName)
        {
            var output;
            var inputLength = input.length;
            var codingLog = this.codingLog;
            var perfInfoList = [];
            perfInfoList.name = codingName;
            perfInfoList.inputLength = inputLength;
            codingLog.push(perfInfoList);
            var inputData = Object(input);
            object_keys(options).forEach(
                function (optName)
                {
                    inputData[optName] = options[optName];
                }
            );
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
                        var maxLength = output != null ? output.length : NaN;
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
        
        callGetFigureLegendDelimiters: function (getFigureLegendDelimiters, figurator, figures)
        {
            var figureLegendDelimiters = getFigureLegendDelimiters(figurator, figures);
            return figureLegendDelimiters;
        },
        
        createCharCodesEncoding: function (charCodeArrayStr, long, radix)
        {
            var output;
            var fromCharCode = this.findDefinition(FROM_CHAR_CODE);
            if (radix)
            {
                output =
                    this.createLongCharCodesOutput(
                        charCodeArrayStr,
                        fromCharCode,
                        'parseInt(undefined,' + radix + ')'
                    );
            }
            else
            {
                if (long)
                {
                    output =
                        this.createLongCharCodesOutput(charCodeArrayStr, fromCharCode, 'undefined');
                }
                else
                {
                    output =
                        this.resolveConstant('Function') +
                        '(' +
                        this.replaceString('return String.' + fromCharCode + '(', true) +
                        '+' +
                        charCodeArrayStr +
                        '+' +
                        this.replaceString(')') +
                        ')()';
                }
            }
            return output;
        },
        
        createCharKeyArrayString: function (input, charMap, maxLength, delimiters)
        {
            var charKeyArray =
                array_prototype_map.call(
                    input,
                    function (char)
                    {
                        var charKey = charMap[char];
                        return charKey;
                    }
                );
            var charKeyArrayStr = this.replaceStringArray(charKeyArray, delimiters, maxLength);
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
                        createParseIntArg = this.findDefinition(CREATE_PARSE_INT_ARG);
                    else
                        createParseIntArg = createParseIntArgDefault;
                    parseIntArg = createParseIntArg(amendings, firstDigit);
                }
                else
                    parseIntArg = 'undefined';
                if (coerceToInt)
                    parseIntArg = '+' + parseIntArg;
                var formatter = this.findDefinition(MAPPER_FORMATTER);
                mapper = formatter('[parseInt(' + parseIntArg + ',' + radix + ')]');
            }
            else
                mapper = '"".charAt.bind';
            var output =
                this.createJSFuckArrayMapping(charIndexArrayStr, mapper, legend) + '[' +
                this.replaceString('join') + ']([])';
            if (!(output.length > maxLength))
                return output;
        },
        
        createJSFuckArrayMapping: function (arrayStr, mapper, legend)
        {
            var result =
                arrayStr + '[' + this.replaceString('map', true) + '](' +
                this.replaceExpr(mapper, true) + '(' + legend + '))';
            return result;
        },
        
        createLongCharCodesOutput: function (charCodeArrayStr, fromCharCode, arg)
        {
            var formatter = this.findDefinition(FROM_CHAR_CODE_CALLBACK_FORMATTER);
            var callback = formatter(fromCharCode, arg);
            var output =
                charCodeArrayStr + '[' + this.replaceString('map', true) + '](' +
                this.replaceExpr('Function("return ' + callback + '")()', true) + ')[' +
                this.replaceString('join') + ']([])';
            return output;
        },
        
        encodeAndWrapText: function (input, wrapper, codingName, maxLength)
        {
            var output;
            if (!wrapper || input)
            {
                output = this.encodeText(input, false, !wrapper, codingName, maxLength);
                if (output == null)
                    return;
            }
            else
                output = '';
            if (wrapper)
                output = wrapper.call(this, output);
            if (!(output.length > maxLength))
                return output;
        },
        
        encodeByCharCodes: function (input, long, radix, maxLength)
        {
            var cache = new Empty();
            var charCodeArray =
                array_prototype_map.call(
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
        
        encodeByDblDict: function (
            initMinCharIndexArrayStrLength,
            figurator,
            getFigureLegendDelimiters,
            keyFigureArrayDelimiters,
            inputData,
            maxLength)
        {
            var input = inputData.valueOf();
            var freqList = getFrequencyList(inputData);
            var charMap = new Empty();
            var minCharIndexArrayStrLength = initMinCharIndexArrayStrLength(input);
            var figures =
                freqList.map(
                    function (freq, index)
                    {
                        var figure = figurator(index);
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
            var figureLegendDelimiters =
                this.callGetFigureLegendDelimiters(getFigureLegendDelimiters, figurator, figures);
            var figureMaxLength = maxLength - legend.length;
            var figureLegend =
                this.replaceStringArray(
                    figures,
                    figureLegendDelimiters,
                    figureMaxLength - minCharIndexArrayStrLength
                );
            if (!figureLegend)
                return;
            var keyFigureArrayStr =
                this.createCharKeyArrayString(
                    input,
                    charMap,
                    figureMaxLength - figureLegend.length,
                    keyFigureArrayDelimiters
                );
            if (!keyFigureArrayStr)
                return;
            var formatter = this.findDefinition(MAPPER_FORMATTER);
            var mapper = formatter('.indexOf(undefined)');
            var charIndexArrayStr =
                this.createJSFuckArrayMapping(keyFigureArrayStr, mapper, figureLegend);
            var output = this.createDictEncoding(legend, charIndexArrayStr, maxLength);
            return output;
        },
        
        encodeByDenseFigures: function (inputData, maxLength)
        {
            var output =
                this.encodeByDblDict(
                    initMinFalseTrueCharIndexArrayStrLength,
                    falseTrueFigurator,
                    getDenseFigureLegendDelimiters,
                    [FALSE_TRUE_DELIMITER],
                    inputData,
                    maxLength
                );
            return output;
        },
        
        encodeByDict: function (inputData, radix, amendings, maxLength)
        {
            var input = inputData.valueOf();
            var freqList = getFrequencyList(inputData);
            var coerceToInt =
                freqList.length &&
                freqList[0].count * APPEND_LENGTH_OF_DIGIT_0 > APPEND_LENGTH_OF_PLUS_SIGN;
            var reindexMap = createReindexMap(freqList.length, radix, amendings, coerceToInt);
            var charMap = new Empty();
            var minCharIndexArrayStrLength = initMinFalseFreeCharIndexArrayStrLength(input);
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
                this.createCharKeyArrayString(
                    input,
                    charMap,
                    maxLength - legend.length,
                    [FALSE_FREE_DELIMITER]
                );
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
        
        encodeBySparseFigures: function (inputData, maxLength)
        {
            var output =
                this.encodeByDblDict(
                    initMinFalseFreeCharIndexArrayStrLength,
                    falseFreeFigurator,
                    getSparseFigureLegendDelimiters,
                    [FALSE_FREE_DELIMITER],
                    inputData,
                    maxLength
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
                        { forceString: true },
                        ['byCharCodesRadix4', 'byCharCodes', 'plain'],
                        'legend'
                    );
                if (output && !(output.length > maxLength))
                    return output;
            }
        },
        
        encodeExpress: function (input, maxLength)
        {
            var unit = expressParse(input);
            if (unit)
            {
                var output;
                if (unit === true)
                {
                    if (!(maxLength < 0))
                        output = '';
                }
                else
                    output = this.replaceExpressUnit(unit, false, [], maxLength, REPLACERS);
                return output;
            }
        },
        
        encodeText: function (input, bond, forceString, codingName, maxLength)
        {
            var output =
                this.callCoders(
                    input,
                    { forceString: forceString, bond: bond },
                    [
                        'byDenseFigures',
                        'bySparseFigures',
                        'byDictRadix5AmendedBy3',
                        'byDictRadix5AmendedBy2',
                        'byDictRadix4AmendedBy2',
                        'byDictRadix4AmendedBy1',
                        'byDictRadix3',
                        'byDictRadix4',
                        'byDict',
                        'byCharCodesRadix4',
                        'byCharCodes',
                        'plain'
                    ],
                    codingName
                );
            if (output != null && !(output.length > maxLength))
                return output;
        },
        
        exec: function (input, wrapper, coderNames, perfInfo)
        {
            var codingLog = this.codingLog = [];
            var output = this.callCoders(input, { wrapper: wrapper }, coderNames);
            if (perfInfo)
                perfInfo.codingLog = codingLog;
            delete this.codingLog;
            if (output == null)
                throw new Error('Encoding failed');
            return output;
        },
        
        replaceFalseFreeArray: replaceFalseFreeArray,
        
        replaceStringArray: function (array, delimiters, maxLength)
        {
            var splitExpr = this.replaceString('split', true, false, false, maxLength);
            if (splitExpr)
            {
                maxLength -= splitExpr.length + 4;
                var optimalReplacement;
                var optimalSeparatorExpr;
                delimiters.forEach(
                    function (delimiter)
                    {
                        var str = array.join(delimiter.joiner);
                        var replacement = this.replaceStaticString(str, maxLength);
                        if (replacement)
                        {
                            var separatorExpr = this.replaceExpr(delimiter.separator);
                            var bulkLength = replacement.length + separatorExpr.length;
                            if (!(bulkLength > maxLength))
                            {
                                maxLength = bulkLength;
                                optimalReplacement = replacement;
                                optimalSeparatorExpr = separatorExpr;
                            }
                        }
                    },
                    this
                );
                if (optimalReplacement)
                {
                    var result =
                        optimalReplacement + '[' + splitExpr + '](' + optimalSeparatorExpr + ')';
                    return result;
                }
            }
        }
    };
    
    assignNoEnum(Encoder.prototype, encoderProtoSource);
    
    var FALSE_FREE_DELIMITER = { joiner: 'false', separator: 'false' };
    
    var FALSE_TRUE_DELIMITER = { joiner: '', separator: 'Function("return/(?=false|true)/")()' };
    
    var REPLACERS =
    {
        identifier:
        function (encoder, identifier, bondStrength, unitIndices, maxLength)
        {
            var codingName = getCodingName(unitIndices);
            var replacement =
                encoder.encodeAndWrapText(
                    'return ' + identifier,
                    wrapWithCall,
                    codingName,
                    maxLength
                );
            return replacement;
        },
        string:
        function (encoder, str, bond, forceString, unitIndices, maxLength)
        {
            var codingName = getCodingName(unitIndices);
            var replacement = encoder.encodeText(str, bond, forceString, codingName, maxLength);
            return replacement;
        }
    };
    
    var falseFreeFigurator = createFigurator([''], 'false');
    var falseTrueFigurator = createFigurator(['false', 'true'], '');
    
    wrapWithCall =
        function (str)
        {
            return this.resolveConstant('Function') + '(' + str + ')()';
        };
    
    wrapWithEval =
        function (str)
        {
            return this.replaceExpr('Function("return eval")()') + '(' + str + ')';
        };
}
)();

var trimJS;

(function ()
{
    var regExp =
        RegExp(
            '(?:(?!.)\\s)+(?:\\s|\uFEFF|//(?:(?!\\*/|`).)*(?!.)|/\\*(?:(?!`)(?:[^*]|\\*[^/]))*?\\' +
            '*/)*$'
        );
    
    trimJS =
        function (str)
        {
            str = str.replace(/^(?:\s|\uFEFF|\/\/.*(?!.)|\/\*[\s\S]*?\*\/)*(?!.)\s/, '');
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
     * <p>
     * Specifies the features available in the engines that evaluate the encoded output.</p>
     * <p>
     * If this parameter is unspecified, [`JScrewIt.Feature.DEFAULT`](Features.md#DEFAULT) is
     * assumed: this ensures maximum compatibility but also generates the largest code.
     * To generate shorter code, specify all features available in all target engines
     * explicitly.</p>
     *
     * @param {string} [options.runAs=express-eval]
     * This option controls the type of code generated from the given input.
     * Allowed values are listed below.
     *
     * <dl>
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
     * <dt><code>"express"</code></dt>
     * <dd>
     * Attempts to interpret the specified string as JavaScript code and produce functionally
     * equivalent JSFuck code.
     * Fails if the specified string cannot be expressed as JavaScript, or if no functionally
     * equivalent JSFuck code can be generated.</dd>
     *
     * <dt><code>"express-call"</code></dt>
     * <dd>
     * Applies the code generation process of both <code>"express"</code> and <code>"call"</code>
     * and returns the shortest output.</dd>
     *
     * <dt><code>"express-eval"</code></dt>
     * <dd>
     * Applies the code generation process of both <code>"express"</code> and <code>"eval"</code>
     * and returns the shortest output.</dd>
     *
     * <dt><code>"none"</code> (default)</dt>
     * <dd>
     * Produces JSFuck code that translates to the specified input string (except for trimmed parts
     * when used in conjunction with the option <code>trimCode</code>).
     * Unlike other methods, <code>"none"</code> does not generate executable code but just a plain
     * string.
     * </dd>
     *
     * </dl>
     *
     * @param {boolean} [options.trimCode=false]
     * <p>
     * If this parameter is truthy, lines in the beginning and in the end of the file containing
     * nothing but space characters and JavaScript comments are removed from the generated output.
     * A newline terminator in the last preserved line is also removed.</p>
     * <p>
     * This option is especially useful to strip banner comments and trailing newline characters
     * which are sometimes found in minified scripts.</p>
     * <p>
     * Using this option may produce unexpected results if the input is not well-formed JavaScript
     * code.</p>
     *
     * @param {string} [options.wrapWith=express-eval] An alias for `runAs`.
     *
     * @returns {string} The encoded string.
     *
     * @throws
     *
     * An `Error` is thrown under the following circumstances.
     *  - The specified string cannot be encoded with the specified options.
     *  - Some unknown features were specified.
     *  - A combination of mutually incompatible features was specified.
     *  - The option `runAs` (or `wrapWith`) was specified with an invalid value.
     *
     * Also, an out of memory condition may occur when processing very large data.
     */
    
    function encode(input, options)
    {
        input = esToString(input);
        options = options || { };
        var features = options.features;
        var runAsData;
        var runAs = options.runAs;
        if (runAs !== undefined)
            runAsData = filterRunAs(runAs, 'runAs');
        else
            runAsData = filterRunAs(options.wrapWith, 'wrapWith');
        var wrapper = runAsData[0];
        var coderNames = runAsData[1];
        if (options.trimCode)
            input = trimJS(input);
        var perfInfo = options.perfInfo;
        var encoder = getEncoder(features);
        var output = encoder.exec(input, wrapper, coderNames, perfInfo);
        return output;
    }
    
    function filterRunAs(input, name)
    {
        var CODER_NAMES_BOTH    = ['text', 'express'];
        var CODER_NAMES_EXPRESS = ['express'];
        var CODER_NAMES_TEXT    = ['text'];
        
        if (input === undefined)
            return [wrapWithEval, CODER_NAMES_BOTH];
        switch (input += '')
        {
        case 'call':
            return [wrapWithCall, CODER_NAMES_TEXT];
        case 'eval':
            return [wrapWithEval, CODER_NAMES_TEXT];
        case 'express':
            return [, CODER_NAMES_EXPRESS];
        case 'express-call':
            return [wrapWithCall, CODER_NAMES_BOTH];
        case 'express-eval':
            return [wrapWithEval, CODER_NAMES_BOTH];
        case 'none':
            return [, CODER_NAMES_TEXT];
        }
        throw new Error('Invalid value for option ' + name);
    }
    
    function getEncoder(features)
    {
        var mask = getValidFeatureMask(features);
        var encoder = encoders[mask];
        if (!encoder)
            encoders[mask] = encoder = new Encoder(mask);
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
                self.JScrewIt = JScrewIt;
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
        function cloneEntries(inputEntries)
        {
            var outputEntries;
            if (inputEntries)
            {
                var singleton = !array_isArray(inputEntries);
                if (singleton)
                    outputEntries = [createEntryClone(inputEntries, [0, 0])];
                else
                {
                    outputEntries =
                        inputEntries.map(
                            function (entry)
                            {
                                entry = createEntryClone(entry.definition, entry.mask);
                                return entry;
                            }
                        );
                }
                outputEntries.singleton = singleton;
            }
            return outputEntries;
        }
        
        function createEncoder(features)
        {
            var mask = getValidFeatureMask(features);
            var encoder = new Encoder(mask);
            encoder.codingLog = [];
            return encoder;
        }
        
        function createEntryClone(definition, mask)
        {
            if (typeof definition === 'object')
                definition = object_freeze(definition);
            mask = mask.slice();
            var entry = { definition: definition, mask: mask };
            return entry;
        }
        
        function createFeatureFromMask(mask)
        {
            var featureObj = isMaskCompatible(mask) ? featureFromMask(mask) : null;
            return featureObj;
        }
        
        function createScrewBuffer(bond, forceString, groupThreshold, optimizer)
        {
            var buffer = new ScrewBuffer(bond, forceString, groupThreshold, optimizer);
            return buffer;
        }
        
        function defineConstant(encoder, constant, definition)
        {
            constant += '';
            if (!/^[$A-Z_a-z][$\w]*$/.test(constant))
                throw new SyntaxError('Invalid identifier ' + json_stringify(constant));
            if (!encoder.hasOwnProperty('constantDefinitions'))
                encoder.constantDefinitions = object_create(CONSTANTS);
            var entries = [define(esToString(definition))];
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
        
        function getComplexNames()
        {
            var names = object_keys(COMPLEX).sort();
            return names;
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
        
        var CREATE_PARSE_INT_ARG_AVAILABLE =
        [
            define(createParseIntArgDefault),
            define(createParseIntArgByReduce),
            define(createParseIntArgByReduceArrow, Feature.ARROW)
        ];
        
        // Exported entries
        var ENTRIES = new Empty();
        ENTRIES['BASE64_ALPHABET_HI_4:0']           = BASE64_ALPHABET_HI_4[0];
        ENTRIES['BASE64_ALPHABET_HI_4:4']           = BASE64_ALPHABET_HI_4[4];
        ENTRIES['BASE64_ALPHABET_HI_4:5']           = BASE64_ALPHABET_HI_4[5];
        ENTRIES['BASE64_ALPHABET_LO_4:1']           = BASE64_ALPHABET_LO_4[1];
        ENTRIES['BASE64_ALPHABET_LO_4:3']           = BASE64_ALPHABET_LO_4[3];
        ENTRIES.CREATE_PARSE_INT_ARG                = CREATE_PARSE_INT_ARG;
        ENTRIES['CREATE_PARSE_INT_ARG:available']   = CREATE_PARSE_INT_ARG_AVAILABLE;
        ENTRIES.FROM_CHAR_CODE                      = FROM_CHAR_CODE;
        ENTRIES.FROM_CHAR_CODE_CALLBACK_FORMATTER   = FROM_CHAR_CODE_CALLBACK_FORMATTER;
        ENTRIES.MAPPER_FORMATTER                    = MAPPER_FORMATTER;
        ENTRIES.OPTIMAL_B                           = OPTIMAL_B;
        
        var debug =
            assignNoEnum(
                { },
                {
                    createBridgeSolution:   createBridgeSolution,
                    createClusteringPlan:   createClusteringPlan,
                    createEncoder:          createEncoder,
                    createFeatureFromMask:  createFeatureFromMask,
                    createFigurator:        createFigurator,
                    createOptimizer:        createOptimizer,
                    createScrewBuffer:      createScrewBuffer,
                    createSolution:         createSolution,
                    defineConstant:         defineConstant,
                    getCharacterEntries:    getCharacterEntries,
                    getCoders:              getCoders,
                    getComplexEntries:      getComplexEntries,
                    getComplexNames:        getComplexNames,
                    getConstantEntries:     getConstantEntries,
                    getEntries:             getEntries,
                    maskAnd:                maskAnd,
                    maskIncludes:           maskIncludes,
                    maskIsEmpty:            maskIsEmpty,
                    maskNew:                maskNew,
                    maskUnion:              maskUnion,
                    setUp:                  setUp,
                    trimJS:                 trimJS,
                }
            );
        assignNoEnum(JScrewIt, { debug: debug });
    }
    )();
}

})();
