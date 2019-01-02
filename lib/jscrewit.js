// JScrewIt 2.9.2 – https://jscrew.it

(function () {

'use strict';

var _Array;
var _Array_isArray;
var _Array_prototype;
var _Array_prototype_every;
var _Array_prototype_forEach;
var _Array_prototype_map;
var _Array_prototype_push;
var _Date;
var _Error;
var _Function;
var _JSON_parse;
var _JSON_stringify;
var _Math_abs;
var _Math_max;
var _Math_pow;
var _Object;
var _Object_create;
var _Object_defineProperties;
var _Object_defineProperty;
var _Object_freeze;
var _Object_keys;
var _Object_getOwnPropertyDescriptor;
var _RegExp;
var _String;
var _SyntaxError;
var _parseInt;
var assignNoEnum;
var createEmpty;
var esToString;
var noProto;
var noop;

(function ()
{
    var _TypeError;

    _Array                              = Array;
    _Array_isArray                      = _Array.isArray;
    _Array_prototype                    = _Array.prototype;
    _Array_prototype_every              = _Array_prototype.every;
    _Array_prototype_forEach            = _Array_prototype.forEach;
    _Array_prototype_map                = _Array_prototype.map;
    _Array_prototype_push               = _Array_prototype.push;

    _Date                               = Date;

    _Error                              = Error;

    _Function                           = Function;

    _JSON_parse                         = JSON.parse;
    _JSON_stringify                     = JSON.stringify;

    _Math_abs                           = Math.abs;
    _Math_max                           = Math.max;
    _Math_pow                           = Math.pow;

    _Object                             = Object;
    _Object_create                      = _Object.create;
    _Object_defineProperties            = _Object.defineProperties;
    _Object_defineProperty              = _Object.defineProperty;
    _Object_freeze                      = _Object.freeze;
    _Object_getOwnPropertyDescriptor    = _Object.getOwnPropertyDescriptor;
    _Object_keys                        = _Object.keys;

    _RegExp                             = RegExp;

    _String                             = String;

    _SyntaxError                        = SyntaxError;

    _TypeError                          = TypeError;

    _parseInt                           = parseInt;

    assignNoEnum =
    function (target, source)
    {
        var descriptors = { };
        var names = _Object_keys(source);
        names.forEach
        (
            function (name)
            {
                var descriptor = _Object_getOwnPropertyDescriptor(source, name);
                descriptor.enumerable = false;
                descriptors[name] = descriptor;
            }
        );
        _Object_defineProperties(target, descriptors);
        return target;
    };

    createEmpty = _Object_create.bind(null, null);

    esToString =
    function (arg)
    {
        if (typeof arg === 'symbol')
            throw new _TypeError('Cannot convert a symbol to a string');
        var str = _String(arg);
        return str;
    };

    noProto =
    function (obj)
    {
        var result = createEmpty();
        _Object_keys(obj).forEach
        (
            function (name)
            {
                result[name] = obj[name];
            }
        );
        return result;
    };

    noop = _Function();
}
)();

var maskAreEqual;
var maskIncludes;
var maskIntersection;
var maskIsEmpty;
var maskNew;
var maskNewInverted;
var maskUnion;
var maskWithBit;

(function ()
{
    maskAreEqual =
    function (mask1, mask2)
    {
        var equal = mask1[0] === mask2[0] && mask1[1] === mask2[1];
        return equal;
    };

    maskIncludes =
    function (includingMask, includedMask)
    {
        var part0;
        var part1;
        var included =
        ((part0 = includedMask[0]) & includingMask[0]) === part0 &&
        ((part1 = includedMask[1]) & includingMask[1]) === part1;
        return included;
    };

    maskIntersection =
    function (mask1, mask2)
    {
        var mask = [mask1[0] & mask2[0], mask1[1] & mask2[1]];
        return mask;
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

    maskUnion =
    function (mask1, mask2)
    {
        var mask = [mask1[0] | mask2[0], mask1[1] | mask2[1]];
        return mask;
    };

    maskWithBit =
    function (bitIndex)
    {
        var mask = [0, 0];
        mask[bitIndex >> 5] |= 1 << bitIndex;
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
        _Array_prototype_every.call
        (
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
            var mask;
            _Array_prototype_forEach.call
            (
                arguments,
                function (arg)
                {
                    var otherMask = validMaskFromArrayOrStringOrFeature(arg);
                    if (mask != null)
                        mask = maskIntersection(mask, otherMask);
                    else
                        mask = otherMask;
                }
            );
            result = featureFromMask(mask);
        }
        else
            result = null;
        return result;
    }

    function completeExclusions(name)
    {
        var info = FEATURE_INFOS[name];
        var excludes = info.excludes;
        if (excludes)
        {
            var featureObj = ALL[name];
            var mask = featureObj.mask;
            excludes.forEach
            (
                function (exclude)
                {
                    var excludeMask = completeFeature(exclude);
                    var incompatibleMask = maskUnion(mask, excludeMask);
                    incompatibleMaskMap[incompatibleMask] = incompatibleMask;
                }
            );
        }
    }

    function completeFeature(name)
    {
        var mask;
        var featureObj = ALL[name];
        if (featureObj)
            mask = featureObj.mask;
        else
        {
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
                    mask = maskWithBit(bitIndex++);
                    if (check())
                        autoMask = maskUnion(autoMask, mask);
                    check = wrapCheck(check);
                }
                else
                    mask = maskNew();
                var includes = includesMap[name] = info.includes || [];
                includes.forEach
                (
                    function (include)
                    {
                        var includeMask = completeFeature(include);
                        mask = maskUnion(mask, includeMask);
                    }
                );
                var description;
                var engine = info.engine;
                if (engine == null)
                    description = info.description;
                else
                    description = createEngineFeatureDescription(engine);
                var elementary = check || info.excludes;
                featureObj =
                createFeature(name, description, mask, check, engine, info.attributes, elementary);
                if (elementary)
                    ELEMENTARY.push(featureObj);
            }
            registerFeature(name, featureObj);
        }
        return mask;
    }

    function createEngineFeatureDescription(engine)
    {
        var description = 'Features available in ' + engine + '.';
        return description;
    }

    function createFeature(name, description, mask, check, engine, attributes, elementary)
    {
        attributes = _Object_freeze(attributes || { });
        var descriptors =
        {
            attributes:     { value: attributes },
            check:          { value: check },
            description:    { value: description },
            engine:         { value: engine },
            name:           { value: name },
        };
        if (elementary)
            descriptors.elementary = { value: true };
        var featureObj = _Object_create(Feature.prototype, descriptors);
        initMask(featureObj, mask);
        return featureObj;
    }

    function featureArrayToMask(array)
    {
        var mask = maskNew();
        array.forEach
        (
            function (feature)
            {
                var otherMask = maskFromStringOrFeature(feature);
                mask = maskUnion(mask, otherMask);
            }
        );
        return mask;
    }

    function initMask(featureObj, mask)
    {
        _Object_defineProperty(featureObj, 'mask', { value: _Object_freeze(mask) });
    }

    function isExcludingAttribute(attributeCache, attributeName, featureObjs)
    {
        var result = attributeCache[attributeName];
        if (result === undefined)
        {
            attributeCache[attributeName] =
            result =
            featureObjs.some
            (
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
                throw new _Error('Unknown feature ' + _JSON_stringify(name));
            mask = featureObj.mask;
        }
        return mask;
    }

    function registerFeature(name, featureObj)
    {
        var descriptor = { enumerable: true, value: featureObj };
        _Object_defineProperty(Feature, name, descriptor);
        ALL[name] = featureObj;
    }

    function validateMask(mask)
    {
        if (!isMaskCompatible(mask))
            throw new _Error('Incompatible features');
    }

    function validMaskFromArguments(args)
    {
        var mask = maskNew();
        var validationNeeded = false;
        _Array_prototype_forEach.call
        (
            args,
            function (arg)
            {
                var otherMask;
                if (_Array_isArray(arg))
                {
                    otherMask = featureArrayToMask(arg);
                    validationNeeded |= arg.length > 1;
                }
                else
                    otherMask = maskFromStringOrFeature(arg);
                mask = maskUnion(mask, otherMask);
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

    var ALL = createEmpty();
    var ELEMENTARY = [];

    var FEATURE_INFOS =
    {
        ANY_DOCUMENT:
        {
            description:
            'Existence of the global object document whose string representation starts with ' +
            '"[object " and ends with "Document]".',
            check:
            function ()
            {
                var available =
                typeof document === 'object' && /^\[object .*Document]$/.test(document + '');
                return available;
            },
            attributes: { 'web-worker': 'web-worker-restriction' },
        },
        ANY_WINDOW:
        {
            description:
            'Existence of the global object self whose string representation starts with ' +
            '"[object " and ends with "Window]".',
            check:
            checkSelfFeature.bind
            (
                function (str)
                {
                    var available = /^\[object .*Window]$/.test(str);
                    return available;
                }
            ),
            includes: ['SELF_OBJ'],
            attributes: { 'web-worker': 'web-worker-restriction' },
        },
        ARRAY_ITERATOR:
        {
            description:
            'The property that the string representation of Array.prototype.entries() starts ' +
            'with "[object Array" and ends with "]" at index 21 or 22.',
            check:
            function ()
            {
                var available =
                Array.prototype.entries && /^\[object Array.{8,9}]$/.test([].entries());
                return available;
            },
        },
        ARROW:
        {
            description: 'Support for arrow functions.',
            check:
            function ()
            {
                try
                {
                    Function('()=>{}')();
                    return true;
                }
                catch (error)
                { }
            },
        },
        ATOB:
        {
            description: 'Existence of the global functions atob and btoa.',
            check:
            function ()
            {
                var available = typeof atob === 'function' && typeof btoa === 'function';
                return available;
            },
            attributes: { 'web-worker': 'no-atob-in-web-worker' },
        },
        BARPROP:
        {
            description:
            'Existence of the global object statusbar having the string representation "[object ' +
            'BarProp]".',
            check:
            function ()
            {
                var available =
                typeof statusbar === 'object' && statusbar + '' === '[object BarProp]';
                return available;
            },
            attributes: { 'web-worker': 'web-worker-restriction' },
        },
        CAPITAL_HTML:
        {
            description:
            'The property that the various string methods returning HTML code such as ' +
            'String.prototype.big or String.prototype.link have both the tag name and attributes ' +
            'written in capital letters.',
            check:
            function ()
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
            },
        },
        CONSOLE:
        {
            description:
            'Existence of the global object console having the string representation "[object ' +
            'Console]".\n' +
            'This feature may become unavailable when certain browser extensions are active.',
            check:
            function ()
            {
                var available = typeof console === 'object' && console + '' === '[object Console]';
                return available;
            },
            attributes: { 'web-worker': 'no-console-in-web-worker' },
        },
        DOCUMENT:
        {
            description:
            'Existence of the global object document having the string representation "[object ' +
            'Document]".',
            check:
            function ()
            {
                var available =
                typeof document === 'object' && document + '' === '[object Document]';
                return available;
            },
            includes: ['ANY_DOCUMENT'],
            excludes: ['HTMLDOCUMENT'],
            attributes: { 'web-worker': 'web-worker-restriction' },
        },
        DOMWINDOW:
        {
            description:
            'Existence of the global object self having the string representation "[object ' +
            'DOMWindow]".',
            check:
            checkSelfFeature.bind
            (
                function (str)
                {
                    var available = str === '[object DOMWindow]';
                    return available;
                }
            ),
            includes: ['ANY_WINDOW'],
            excludes: ['WINDOW'],
            attributes: { 'web-worker': 'web-worker-restriction' },
        },
        ESC_HTML_ALL:
        {
            description:
            'The property that double quotation mark, less than and greater than characters in ' +
            'the argument of String.prototype.fontcolor are escaped into their respective HTML ' +
            'entities.',
            check:
            function ()
            {
                var available = ~''.fontcolor('"<>').indexOf('&quot;&lt;&gt;');
                return available;
            },
            includes: ['ESC_HTML_QUOT'],
            excludes: ['ESC_HTML_QUOT_ONLY'],
        },
        ESC_HTML_QUOT:
        {
            description:
            'The property that double quotation marks in the argument of ' +
            'String.prototype.fontcolor are escaped as "&quot;".',
            check:
            function ()
            {
                var available = ~''.fontcolor('"').indexOf('&quot;');
                return available;
            },
        },
        ESC_HTML_QUOT_ONLY:
        {
            description:
            'The property that only double quotation marks and no other characters in the ' +
            'argument of String.prototype.fontcolor are escaped into HTML entities.',
            check:
            function ()
            {
                var available = ~''.fontcolor('"<>').indexOf('&quot;<>');
                return available;
            },
            includes: ['ESC_HTML_QUOT'],
            excludes: ['ESC_HTML_ALL'],
        },
        ESC_REGEXP_LF:
        {
            description:
            'Having regular expressions created with the RegExp constructor use escape sequences ' +
            'starting with a backslash to format line feed characters ("\\n") in their string ' +
            'representation.',
            check:
            function ()
            {
                var available = (RegExp('\n') + '')[1] === '\\';
                return available;
            },
        },
        ESC_REGEXP_SLASH:
        {
            description:
            'Having regular expressions created with the RegExp constructor use escape sequences ' +
            'starting with a backslash to format slashes ("/") in their string representation.',
            check:
            function ()
            {
                var available = (RegExp('/') + '')[1] === '\\';
                return available;
            },
        },
        EXTERNAL:
        {
            description:
            'Existence of the global object sidebar having the string representation "[object ' +
            'External]".',
            check:
            function ()
            {
                var available = typeof sidebar === 'object' && sidebar + '' === '[object External]';
                return available;
            },
            attributes: { 'web-worker': 'web-worker-restriction' },
        },
        FF_SRC:
        {
            description:
            'A string representation of native functions typical for Firefox and Safari.\n' +
            'Remarkable traits are the lack of line feed characters at the beginning and at the ' +
            'end of the string and the presence of a line feed followed by four whitespaces ' +
            '("\\n    ") before the "[native code]" sequence.',
            includes: ['NO_IE_SRC', 'NO_V8_SRC'],
            excludes: ['NO_FF_SRC'],
        },
        FILL:
        {
            description: 'Existence of the native function Array.prototype.fill.',
            check:
            function ()
            {
                var available = Array.prototype.fill;
                return available;
            },
        },
        FLAT:
        {
            description: 'Existence of the native function Array.prototype.flat.',
            check:
            function ()
            {
                var available = Array.prototype.flat;
                return available;
            },
        },
        FROM_CODE_POINT:
        {
            description: 'Existence of the function String.fromCodePoint.',
            check:
            function ()
            {
                var available = String.fromCodePoint;
                return available;
            },
        },
        FUNCTION_19_LF:
        {
            description:
            'A string representation of dynamically generated functions where the character at ' +
            'index 19 is a line feed ("\\n").',
            check:
            function ()
            {
                var available = (Function() + '')[19] === '\n';
                return available;
            },
        },
        FUNCTION_22_LF:
        {
            description:
            'A string representation of dynamically generated functions where the character at ' +
            'index 22 is a line feed ("\\n").',
            check:
            function ()
            {
                var available = (Function() + '')[22] === '\n';
                return available;
            },
        },
        GMT:
        {
            description:
            'Presence of the text "GMT" after the first 25 characters in the string returned by ' +
            'Date().\n' +
            'The string representation of dates is implementation dependent, but most engines ' +
            'use a similar format, making this feature available in all supported engines except ' +
            'Internet Explorer 9 and 10.',
            check:
            function ()
            {
                var available = /^.{25}GMT/.test(Date());
                return available;
            },
        },
        HISTORY:
        {
            description:
            'Existence of the global object history having the string representation "[object ' +
            'History]".',
            check:
            function ()
            {
                var available = typeof history === 'object' && history + '' === '[object History]';
                return available;
            },
            attributes: { 'web-worker': 'web-worker-restriction' },
        },
        HTMLAUDIOELEMENT:
        {
            description:
            'Existence of the global object Audio whose string representation starts with ' +
            '"function HTMLAudioElement".',
            check:
            function ()
            {
                var available =
                typeof Audio !== 'undefined' && /^function HTMLAudioElement/.test(Audio);
                return available;
            },
            includes: ['NO_IE_SRC'],
            attributes: { 'web-worker': 'web-worker-restriction' },
        },
        HTMLDOCUMENT:
        {
            description:
            'Existence of the global object document having the string representation "[object ' +
            'HTMLDocument]".',
            check:
            function ()
            {
                var available =
                typeof document === 'object' && document + '' === '[object HTMLDocument]';
                return available;
            },
            includes: ['ANY_DOCUMENT'],
            excludes: ['DOCUMENT'],
            attributes: { 'web-worker': 'web-worker-restriction' },
        },
        IE_SRC:
        {
            description:
            'A string representation of native functions typical for Internet Explorer.\n' +
            'Remarkable traits are the presence of a line feed character ("\\n") at the ' +
            'beginning and at the end of the string and a line feed followed by four whitespaces ' +
            '("\\n    ") before the "[native code]" sequence.',
            includes: ['NO_FF_SRC', 'NO_V8_SRC'],
            excludes: ['NO_IE_SRC'],
        },
        INCR_CHAR:
        {
            description:
            'The ability to use unary increment operators with string characters, like in ( ' +
            '++"some string"[0] ): this will result in a TypeError in strict mode in ECMAScript ' +
            'compliant engines.',
            check:
            function ()
            {
                return true;
            },
            attributes: { 'forced-strict-mode': 'char-increment-restriction' },
        },
        INTL:
        {
            description: 'Existence of the global object Intl.',
            check:
            function ()
            {
                var available = typeof Intl === 'object';
                return available;
            },
        },
        LOCALE_INFINITY:
        {
            description: 'Language sensitive string representation of Infinity as "∞".',
            check:
            function ()
            {
                var available = Infinity.toLocaleString() === '∞';
                return available;
            },
        },
        NAME:
        {
            description: 'Existence of the name property for functions.',
            check:
            function ()
            {
                var available = 'name' in Function();
                return available;
            },
        },
        NODECONSTRUCTOR:
        {
            description:
            'Existence of the global object Node having the string representation "[object ' +
            'NodeConstructor]".',
            check:
            function ()
            {
                var available =
                typeof Node !== 'undefined' && Node + '' === '[object NodeConstructor]';
                return available;
            },
            attributes: { 'web-worker': 'web-worker-restriction' },
        },
        NO_FF_SRC:
        {
            description:
            'A string representation of native functions typical for V8 and Edge or for Internet ' +
            'Explorer but not for Firefox and Safari.',
            check:
            function ()
            {
                var available = /^(\n?)function Object\(\) \{\1 +\[native code]\s\}/.test(Object);
                return available;
            },
            excludes: ['FF_SRC'],
        },
        NO_IE_SRC:
        {
            description:
            'A string representation of native functions typical for most engines with the ' +
            'notable exception of Internet Explorer.\n' +
            'A remarkable trait of this feature is the lack of line feed characters at the ' +
            'beginning and at the end of the string.',
            check:
            function ()
            {
                var available = /^function Object\(\) \{(\n   )? \[native code]\s\}/.test(Object);
                return available;
            },
            excludes: ['IE_SRC'],
        },
        NO_OLD_SAFARI_ARRAY_ITERATOR:
        {
            description:
            'The property that the string representation of Array.prototype.entries() evaluates ' +
            'to "[object Array Iterator]".',
            check:
            function ()
            {
                var available =
                Array.prototype.entries && [].entries() + '' === '[object Array Iterator]';
                return available;
            },
            includes: ['ARRAY_ITERATOR'],
        },
        NO_V8_SRC:
        {
            description:
            'A string representation of native functions typical for Firefox, Internet Explorer ' +
            'and Safari.\n' +
            'A most remarkable trait of this feature is the presence of a line feed followed by ' +
            'four whitespaces ("\\n    ") before the "[native code]" sequence.',
            check:
            function ()
            {
                var available = /^\n?function Object\(\) \{\n    \[native code]\s\}/.test(Object);
                return available;
            },
            excludes: ['V8_SRC'],
        },
        SELF: 'ANY_WINDOW',
        SELF_OBJ:
        {
            description:
            'Existence of the global object self whose string representation starts with ' +
            '"[object ".',
            check:
            checkSelfFeature.bind
            (
                function (str)
                {
                    var available = /^\[object /.test(str);
                    return available;
                }
            ),
            attributes: { 'web-worker': 'safari-bug-21820506' },
        },
        STATUS:
        {
            description: 'Existence of the global string status.',
            check:
            function ()
            {
                var available = typeof status === 'string';
                return available;
            },
            attributes: { 'web-worker': 'web-worker-restriction' },
        },
        UNDEFINED:
        {
            description:
            'The property that Object.prototype.toString.call() evaluates to "[object ' +
            'Undefined]".\n' +
            'This behavior is specified by ECMAScript, and is enforced by all engines except ' +
            'Android Browser versions prior to 4.1.2, where this feature is not available.',
            check:
            function ()
            {
                var available = Object.prototype.toString.call() === '[object Undefined]';
                return available;
            },
        },
        UNEVAL:
        {
            description: 'Existence of the global function uneval.',
            check:
            function ()
            {
                var available = typeof uneval !== 'undefined';
                return available;
            },
        },
        V8_SRC:
        {
            description:
            'A string representation of native functions typical for the V8 engine, but also ' +
            'found in Edge.\n' +
            'Remarkable traits are the lack of line feed characters at the beginning and at the ' +
            'end of the string and the presence of a single whitespace before the "[native ' +
            'code]" sequence.',
            includes: ['NO_FF_SRC', 'NO_IE_SRC'],
            excludes: ['NO_V8_SRC'],
        },
        WINDOW:
        {
            description:
            'Existence of the global object self having the string representation "[object ' +
            'Window]".',
            check:
            checkSelfFeature.bind
            (
                function (str)
                {
                    var available = str === '[object Window]';
                    return available;
                }
            ),
            includes: ['ANY_WINDOW'],
            excludes: ['DOMWINDOW'],
            attributes: { 'web-worker': 'web-worker-restriction' },
        },

        DEFAULT:
        {
            description:
            'Minimum feature level, compatible with all supported engines in all environments.',
        },
        BROWSER:
        {
            description:
            'Features available in all browsers.\n' +
            'No support for Node.js.',
            includes: ['ANY_DOCUMENT', 'ANY_WINDOW', 'HISTORY', 'INCR_CHAR', 'STATUS'],
            attributes:
            {
                'char-increment-restriction': null,
                'safari-bug-21820506': null,
                'web-worker-restriction': null,
            },
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
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_SLASH',
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
                'STATUS',
                'UNDEFINED',
                'WINDOW',
            ],
            attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
        },
        ANDRO_4_0:
        {
            engine: 'Android Browser 4.0',
            includes:
            [
                'ATOB',
                'CONSOLE',
                'DOMWINDOW',
                'ESC_HTML_ALL',
                'FUNCTION_22_LF',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'NAME',
                'STATUS',
                'V8_SRC',
            ],
        },
        ANDRO_4_1:
        {
            engine: 'Android Browser 4.1 to 4.3',
            includes:
            [
                'ATOB',
                'CONSOLE',
                'DOMWINDOW',
                'ESC_HTML_ALL',
                'FUNCTION_22_LF',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'NAME',
                'STATUS',
                'UNDEFINED',
                'V8_SRC',
            ],
        },
        ANDRO_4_4:
        {
            engine: 'Android Browser 4.4',
            includes:
            [
                'ATOB',
                'BARPROP',
                'CONSOLE',
                'ESC_HTML_ALL',
                'FUNCTION_22_LF',
                'GMT',
                'HISTORY',
                'HTMLAUDIOELEMENT',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'STATUS',
                'UNDEFINED',
                'V8_SRC',
                'WINDOW',
            ],
            attributes: { 'no-console-in-web-worker': null, 'web-worker-restriction': null },
        },
        CHROME: 'CHROME_69',
        CHROME_69:
        {
            engine: 'Chrome 69 and Opera 56 or later',
            includes:
            [
                'ARROW',
                'ATOB',
                'BARPROP',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_SLASH',
                'FILL',
                'FLAT',
                'FROM_CODE_POINT',
                'FUNCTION_19_LF',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'STATUS',
                'UNDEFINED',
                'V8_SRC',
                'WINDOW',
            ],
            attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
        },
        EDGE: 'EDGE_40',
        EDGE_40:
        {
            engine: 'Edge 40 or later',
            includes:
            [
                'ARROW',
                'ATOB',
                'BARPROP',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'FILL',
                'FROM_CODE_POINT',
                'FUNCTION_19_LF',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'STATUS',
                'UNDEFINED',
                'V8_SRC',
                'WINDOW',
            ],
            attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
        },
        FF_ESR: 'FF_54',
        FF_54:
        {
            engine: 'Firefox 54 or later',
            includes:
            [
                'ARROW',
                'ATOB',
                'BARPROP',
                'CONSOLE',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'EXTERNAL',
                'FF_SRC',
                'FILL',
                'FROM_CODE_POINT',
                'FUNCTION_19_LF',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'STATUS',
                'UNDEFINED',
                'UNEVAL',
                'WINDOW',
            ],
            attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
        },
        FF: 'FF_62',
        FF_62:
        {
            engine: 'Firefox 62 or later',
            includes:
            [
                'ARROW',
                'ATOB',
                'BARPROP',
                'CONSOLE',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'EXTERNAL',
                'FF_SRC',
                'FILL',
                'FLAT',
                'FROM_CODE_POINT',
                'FUNCTION_19_LF',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'STATUS',
                'UNDEFINED',
                'UNEVAL',
                'WINDOW',
            ],
            attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
        },
        IE_9:
        {
            engine: 'Internet Explorer 9',
            includes:
            [
                'CAPITAL_HTML',
                'DOCUMENT',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'FUNCTION_22_LF',
                'HISTORY',
                'IE_SRC',
                'INCR_CHAR',
                'STATUS',
                'UNDEFINED',
                'WINDOW',
            ],
        },
        IE_10:
        {
            engine: 'Internet Explorer 10',
            includes:
            [
                'ATOB',
                'CAPITAL_HTML',
                'CONSOLE',
                'DOCUMENT',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'FUNCTION_22_LF',
                'HISTORY',
                'IE_SRC',
                'INCR_CHAR',
                'STATUS',
                'UNDEFINED',
                'WINDOW',
            ],
            attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
        },
        IE_11:
        {
            engine: 'Internet Explorer 11',
            includes:
            [
                'ATOB',
                'CAPITAL_HTML',
                'CONSOLE',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'FUNCTION_22_LF',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'IE_SRC',
                'INCR_CHAR',
                'INTL',
                'STATUS',
                'UNDEFINED',
                'WINDOW',
            ],
            attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
        },
        IE_11_WIN_10:
        {
            engine: 'Internet Explorer 11 on Windows 10',
            includes:
            [
                'ATOB',
                'CAPITAL_HTML',
                'CONSOLE',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'FUNCTION_22_LF',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'IE_SRC',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'STATUS',
                'UNDEFINED',
                'WINDOW',
            ],
            attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
        },
        NODE_0_10:
        {
            engine: 'Node.js 0.10',
            includes:
            [
                'ESC_HTML_ALL',
                'FUNCTION_22_LF',
                'GMT',
                'INCR_CHAR',
                'NAME',
                'UNDEFINED',
                'V8_SRC',
            ],
        },
        NODE_0_12:
        {
            engine: 'Node.js 0.12',
            includes:
            [
                'ESC_HTML_QUOT_ONLY',
                'FUNCTION_22_LF',
                'GMT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'UNDEFINED',
                'V8_SRC',
            ],
        },
        NODE_4:
        {
            engine: 'Node.js 4',
            includes:
            [
                'ARROW',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_SLASH',
                'FILL',
                'FROM_CODE_POINT',
                'FUNCTION_22_LF',
                'GMT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'UNDEFINED',
                'V8_SRC',
            ],
        },
        NODE_5:
        {
            engine: 'Node.js 5 to 9',
            includes:
            [
                'ARROW',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_SLASH',
                'FILL',
                'FROM_CODE_POINT',
                'FUNCTION_22_LF',
                'GMT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'UNDEFINED',
                'V8_SRC',
            ],
            attributes: { 'char-increment-restriction': null },
        },
        NODE_10:
        {
            engine: 'Node.js 10',
            includes:
            [
                'ARROW',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_SLASH',
                'FILL',
                'FROM_CODE_POINT',
                'FUNCTION_19_LF',
                'GMT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'UNDEFINED',
                'V8_SRC',
            ],
            attributes: { 'char-increment-restriction': null },
        },
        NODE_11:
        {
            engine: 'Node.js 11 or later',
            includes:
            [
                'ARROW',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_SLASH',
                'FILL',
                'FLAT',
                'FROM_CODE_POINT',
                'FUNCTION_19_LF',
                'GMT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'UNDEFINED',
                'V8_SRC',
            ],
            attributes: { 'char-increment-restriction': null },
        },
        SAFARI_7_0:
        {
            engine: 'Safari 7.0',
            includes:
            [
                'ATOB',
                'BARPROP',
                'CONSOLE',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'FF_SRC',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'NAME',
                'NODECONSTRUCTOR',
                'STATUS',
                'UNDEFINED',
                'WINDOW',
            ],
            attributes:
            {
                'char-increment-restriction': null,
                'no-atob-in-web-worker': null,
                'no-console-in-web-worker': null,
                'web-worker-restriction': null,
            },
        },
        SAFARI_7_1:
        {
            engine: 'Safari 7.1 and Safari 8',
            includes:
            [
                'ARRAY_ITERATOR',
                'ATOB',
                'BARPROP',
                'CONSOLE',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'FF_SRC',
                'FILL',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'NAME',
                'NODECONSTRUCTOR',
                'STATUS',
                'UNDEFINED',
                'WINDOW',
            ],
            attributes:
            {
                'char-increment-restriction': null,
                'no-atob-in-web-worker': null,
                'safari-bug-21820506': null,
                'web-worker-restriction': null,
            },
        },
        SAFARI_8: 'SAFARI_7_1',
        SAFARI_9:
        {
            engine: 'Safari 9',
            includes:
            [
                'ATOB',
                'BARPROP',
                'CONSOLE',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'FF_SRC',
                'FILL',
                'FROM_CODE_POINT',
                'FUNCTION_22_LF',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'NAME',
                'NODECONSTRUCTOR',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'STATUS',
                'UNDEFINED',
                'WINDOW',
            ],
            attributes:
            {
                'char-increment-restriction': null,
                'no-atob-in-web-worker': null,
                'safari-bug-21820506': null,
                'web-worker-restriction': null,
            },
        },
        SAFARI_10:
        {
            engine: 'Safari 10 or later',
            includes:
            [
                'ARROW',
                'ATOB',
                'BARPROP',
                'CONSOLE',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'FF_SRC',
                'FILL',
                'FROM_CODE_POINT',
                'FUNCTION_22_LF',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'STATUS',
                'UNDEFINED',
                'WINDOW',
            ],
            attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
        },
        SAFARI: 'SAFARI_12',
        SAFARI_12:
        {
            engine: 'Safari 12 or later',
            includes:
            [
                'ARROW',
                'ATOB',
                'BARPROP',
                'CONSOLE',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'FF_SRC',
                'FILL',
                'FLAT',
                'FROM_CODE_POINT',
                'FUNCTION_22_LF',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'STATUS',
                'UNDEFINED',
                'WINDOW',
            ],
            attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
        },
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
     * Among the predefined features, there are some special ones called *elementary* features.
     * Elementary features either cannot be expressed as a union of any number of other features, or
     * they are different from such a union in that they exclude some other feature not excluded by
     * their elementary components.
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
        var featureObj = this instanceof Feature ? this : _Object_create(Feature.prototype);
        initMask(featureObj, mask);
        return featureObj;
    };

    var FEATURE_PROPS =
    {
        /**
         * An immutable mapping of all predefined feature objects accessed by name or alias.
         *
         * For an exhaustive list of all features, see the [Feature Reference](Features.md).
         *
         * @member {object} JScrewIt.Feature.ALL
         *
         * @example
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
         * An immutable array of all elementary feature objects ordered by name.
         *
         * @member {object} JScrewIt.Feature.ELEMENTARY
         */

        ELEMENTARY: ELEMENTARY,

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

        commonOf: commonOf,
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
            var featureNameSet = createEmpty();
            var allIncludes = [];
            ELEMENTARY.forEach
            (
                function (featureObj)
                {
                    var included = maskIncludes(mask, featureObj.mask);
                    if (included)
                    {
                        var name = featureObj.name;
                        featureNameSet[name] = null;
                        var includes = includesMap[name];
                        _Array_prototype_push.apply(allIncludes, includes);
                    }
                }
            );
            allIncludes.forEach
            (
                function (name)
                {
                    delete featureNameSet[name];
                }
            );
            var names = _Object_keys(featureNameSet).sort();
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
         * A boolean value indicating whether this is an elementary feature object.
         *
         * @member {boolean} JScrewIt.Feature#elementary
         */

        elementary: false,

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
            ELEMENTARY.forEach
            (
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

        includes:
        function ()
        {
            var mask = this.mask;
            var included =
            _Array_prototype_every.call
            (
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

        // Called by Node.js to format features for output to the console.
        inspect:
        function (recurseTimes, ctx)
        {
            var str = this.toString();
            var result = ctx.stylize(str, 'jscrewit-feature');
            return result;
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
         * @param {JScrewIt.Feature[]} [engineFeatureObjs]
         * An array of predefined feature objects, each corresponding to a particular engine in
         * which the restriction should be enacted.
         * If this parameter is omitted, the restriction is enacted in all engines.
         *
         * @returns {JScrewIt.Feature}
         * A feature object.
         */

        restrict:
        function (environment, engineFeatureObjs)
        {
            var resultMask = maskNew();
            var thisMask = this.mask;
            var attributeCache = createEmpty();
            ELEMENTARY.forEach
            (
                function (featureObj)
                {
                    var otherMask = featureObj.mask;
                    var included = maskIncludes(thisMask, otherMask);
                    if (included)
                    {
                        var attributeValue = featureObj.attributes[environment];
                        if
                        (
                            attributeValue === undefined ||
                            engineFeatureObjs !== undefined &&
                            !isExcludingAttribute(attributeCache, attributeValue, engineFeatureObjs)
                        )
                            resultMask = maskUnion(resultMask, otherMask);
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

        toString:
        function ()
        {
            var name = this.name;
            if (name === undefined)
                name = '{' + this.canonicalNames.join(', ') + '}';
            var str = '[Feature ' + name + ']';
            return str;
        },
    };
    assignNoEnum(Feature.prototype, FEATURE_PROTO_PROPS);

    featureFromMask =
    function (mask)
    {
        var featureObj = _Object_create(Feature.prototype);
        initMask(featureObj, mask);
        return featureObj;
    };

    featuresToMask =
    function (featureObjs)
    {
        var mask = maskNew();
        featureObjs.forEach
        (
            function (featureObj)
            {
                mask = maskUnion(mask, featureObj.mask);
            }
        );
        return mask;
    };

    isMaskCompatible =
    function (mask)
    {
        var compatible =
        incompatibleMaskList.every
        (
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
        if (_Array_isArray(arg))
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
    var includesMap = createEmpty();
    var incompatibleMaskMap = createEmpty();

    var featureNames = _Object_keys(FEATURE_INFOS);
    featureNames.forEach(completeFeature);
    featureNames.forEach(completeExclusions);
    var incompatibleMaskList =
    _Object_keys(incompatibleMaskMap).map
    (
        function (key)
        {
            var mask = incompatibleMaskMap[key];
            return mask;
        }
    );
    ELEMENTARY.sort
    (
        function (feature1, feature2)
        {
            var result = feature1.name < feature2.name ? -1 : 1;
            return result;
        }
    );
    _Object_freeze(ELEMENTARY);
    var autoFeatureObj =
    createFeature('AUTO', 'All features available in the current engine.', autoMask);
    registerFeature('AUTO', autoFeatureObj);
    _Object_freeze(ALL);
}
)();

var define;
var defineList;
var defineWithArrayLike;

(function ()
{
    function createDefinitionEntry(definition, mask)
    {
        var entry = { definition: definition, mask: mask };
        return entry;
    }

    define =
    function (definition)
    {
        var entry = defineWithArrayLike(definition, arguments, 1);
        return entry;
    };

    defineList =
    function (availableEntries, indexEntries)
    {
        var effectiveEntries =
        indexEntries.map
        (
            function (indexEntry)
            {
                var availableEntry = availableEntries[indexEntry.definition];
                var definition = availableEntry.definition;
                var mask = maskUnion(indexEntry.mask, availableEntry.mask);
                var effectiveEntry = createDefinitionEntry(definition, mask);
                return effectiveEntry;
            }
        );
        effectiveEntries.available = availableEntries;
        return effectiveEntries;
    };

    defineWithArrayLike =
    function (definition, featureArgs, startIndex)
    {
        var features = _Array_prototype.slice.call(featureArgs, startIndex);
        var mask = featuresToMask(features);
        var entry = createDefinitionEntry(definition, mask);
        return entry;
    };
}
)();

var LEVEL_NUMERIC   = -1;
var LEVEL_OBJECT    = 0;
var LEVEL_STRING    = 1;
var LEVEL_UNDEFINED = -2;

var Solution;

(function ()
{
    function setHasOuterPlus(solution, hasOuterPlus)
    {
        _Object_defineProperty(solution, 'hasOuterPlus', { value: hasOuterPlus });
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
            _Object_defineProperty(this, 'appendLength', { enumerable: true, value: appendLength });
        },
        charAt:
        function (index)
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
        toString:
        function ()
        {
            return this.replacement;
        },
    };

    Solution =
    function (replacement, level, hasOuterPlus)
    {
        this.replacement    = replacement;
        this.level          = level;
        if (hasOuterPlus !== undefined)
            setHasOuterPlus(this, hasOuterPlus);
    };
    assignNoEnum(Solution.prototype, solutionProtoSource);
}
)();

// As of version 2.1.0, definitions are interpreted using JScrewIt's own express parser, which can
// handle and optimize a useful subset of the JavaScript syntax.
// See express-parse.js for details about constructs recognized by express.
// Compared to generic purpose encoding, definition encoding differs mainly in that every identifier
// used must be defined itself, too, in a constant definition.

var AMENDINGS;
var CREATE_PARSE_INT_ARG;
var FROM_CHAR_CODE;
var FROM_CHAR_CODE_CALLBACK_FORMATTER;
var MAPPER_FORMATTER;
var OPTIMAL_B;
var OPTIMAL_RETURN_STRING;

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
    var NO_FF_SRC                       = Feature.NO_FF_SRC;
    var NO_IE_SRC                       = Feature.NO_IE_SRC;
    var NO_OLD_SAFARI_ARRAY_ITERATOR    = Feature.NO_OLD_SAFARI_ARRAY_ITERATOR;
    var NO_V8_SRC                       = Feature.NO_V8_SRC;
    var SELF_OBJ                        = Feature.SELF_OBJ;
    var STATUS                          = Feature.STATUS;
    var UNDEFINED                       = Feature.UNDEFINED;
    var UNEVAL                          = Feature.UNEVAL;
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
        'RP_1_NO + FBP_5_S',
        ,
        ,
        'FBP_9_U',
        '[RP_1_NO] + FBP_9_U',
        ,
        '[RP_3_NO] + FBP_9_U',
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
        define({ expr: 'FILL', shift: 4 }, FILL),
        define({ expr: 'FLAT', shift: 4 }, FLAT),
    ];

    var FB_PADDING_INFOS =
    [
        define({ blocks: FB_PADDINGS, shift: 0 }),
        define({ blocks: FB_NO_FF_PADDINGS, shift: 0 }, NO_FF_SRC),
        define({ blocks: FB_NO_IE_PADDINGS, shift: 0 }, NO_IE_SRC),
        define(null, NO_V8_SRC),
        define({ blocks: R_PADDINGS, shift: 0 }, V8_SRC),
        define({ blocks: R_PADDINGS, shift: 5 }, IE_SRC),
        define({ blocks: R_PADDINGS, shift: 4 }, FF_SRC),
    ];

    var FH_PADDING_INFOS =
    [
        define({ blocks: FH_PADDINGS, shift: 0 }),
        define({ blocks: R_PADDINGS, shift: 0 }, NO_IE_SRC),
        define({ blocks: R_PADDINGS, shift: 1 }, IE_SRC),
    ];

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
                    define(0, FF_SRC),
                ];
                break;
            case 20:
            case 30:
                paddingEntries =
                [
                    define(10),
                    define
                    ({ block: 'RP_6_SO', indexer: 1 + index / 10 + ' + FH_SHIFT_1' }, NO_V8_SRC),
                    define(0, V8_SRC),
                    define(5, IE_SRC),
                    define(6, FF_SRC),
                ];
                break;
            case 23:
                paddingEntries =
                [
                    define(7),
                    define(9, NO_FF_SRC),
                    define({ block: 'RP_3_NO', indexer: '3 + FH_SHIFT_1' }, NO_V8_SRC),
                    define(0, V8_SRC),
                    define(3, IE_SRC),
                    define(3, FF_SRC),
                ];
                break;
            case 25:
                paddingEntries =
                [
                    define(7),
                    define(5, NO_FF_SRC),
                    define(5, NO_IE_SRC),
                    define({ block: 'RP_1_NO', indexer: '3 + FH_SHIFT_1' }, NO_V8_SRC),
                    define(0, IE_SRC),
                    define(1, FF_SRC),
                ];
                break;
            case 32:
                paddingEntries =
                [
                    define(8),
                    define(9, NO_FF_SRC),
                    define(9, NO_IE_SRC),
                    define({ block: 'RP_4_N', indexer: '4 + FH_SHIFT_1' }, NO_V8_SRC),
                    define(0, V8_SRC),
                    define(3, IE_SRC),
                    define(4, FF_SRC),
                ];
                break;
            case 34:
                paddingEntries =
                [
                    define(7),
                    define(9, NO_FF_SRC),
                    define(6, INCR_CHAR, NO_FF_SRC),
                    define(9, NO_IE_SRC),
                    define({ block: 'RP_2_SO', indexer: '4 + FH_SHIFT_1' }, NO_V8_SRC),
                    define(6, V8_SRC),
                    define(1, IE_SRC),
                    define(3, FF_SRC),
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

    function createCharDefaultDefinition(charCode, atobOpt, charCodeOpt, escSeqOpt, unescapeOpt)
    {
        function charDefaultDefinition()
        {
            var solution =
            this.createCharDefaultSolution(charCode, atobOpt, charCodeOpt, escSeqOpt, unescapeOpt);
            return solution;
        }

        return charDefaultDefinition;
    }

    function createCreateParseIntArgByReduce(amendings, reducerStr)
    {
        var parseIntArg =
        '[' +
        AMENDINGS.slice(0, amendings).map
        (
            function (amending)
            {
                return '/' + amending + '/g';
            }
        )
        .join() +
        '].reduce(' + reducerStr + ',undefined)';
        return parseIntArg;
    }

    function defineCharDefault(char, opts)
    {
        function checkOpt(optName, defaultOpt)
        {
            var opt = opts && optName in opts ? opts[optName] : defaultOpt;
            return opt;
        }

        var charCode    = char.charCodeAt();
        var atobOpt     = checkOpt('atob', charCode < 0x100);
        var charCodeOpt = checkOpt('charCode', true);
        var escSeqOpt   = checkOpt('escSeq', true);
        var unescapeOpt = checkOpt('unescape', true);
        var definition =
        createCharDefaultDefinition(charCode, atobOpt, charCodeOpt, escSeqOpt, unescapeOpt);
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
                define({ block: 'RP_1_NO', indexer: (index + 1) / 10 + ' + FH_SHIFT_1' }),
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
        var definition = createCharAtDefinitionFH(expr, index, entries, FH_PADDING_INFOS);
        var entry = defineWithArrayLike(definition, arguments, 2);
        return entry;
    }

    function defineSimple(simple, expr, level)
    {
        function get()
        {
            var definition = { expr: expr, level: level };
            var solution = resolveSimple(simple, definition);
            _Object_defineProperty(SIMPLE, simple, { value: solution });
            return solution;
        }

        _Object_defineProperty(SIMPLE, simple, { configurable: true, enumerable: true, get: get });
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
            define('A', ARRAY_ITERATOR),
        ],
        'F',
        'Infinity',
        'NaNfalse',
        [
            define('S'),
            define('R', CAPITAL_HTML),
            define('S', ARRAY_ITERATOR),
        ],
        [
            define('U'),
            define('X', ESC_REGEXP_LF),
            define('X', ESC_REGEXP_SLASH),
            define('X', UNEVAL),
            define('U', ESC_REGEXP_SLASH, UNDEFINED),
            define('U', UNDEFINED, UNEVAL),
            define('W', ATOB),
            define('U', ATOB, CAPITAL_HTML),
            define('U', CAPITAL_HTML, ESC_REGEXP_LF),
            define('U', CAPITAL_HTML, ESC_REGEXP_SLASH),
            define('U', CAPITAL_HTML, UNEVAL),
            define('V', ANY_DOCUMENT),
            define('U', ANY_DOCUMENT, ARRAY_ITERATOR, INCR_CHAR, NAME, NO_V8_SRC),
            define('V', ANY_DOCUMENT, EXTERNAL),
            define('V', ANY_DOCUMENT, FILL),
            define('V', ANY_DOCUMENT, FLAT),
            define
            ('X', ANY_DOCUMENT, ARRAY_ITERATOR, ESC_REGEXP_LF, EXTERNAL, FLAT, FUNCTION_19_LF),
            define
            (
                'X',
                ANY_DOCUMENT,
                ARRAY_ITERATOR,
                ESC_REGEXP_LF,
                EXTERNAL,
                FILL,
                FUNCTION_19_LF,
                NO_FF_SRC
            ),
            define
            (
                'V',
                ANY_DOCUMENT,
                ARRAY_ITERATOR,
                ESC_REGEXP_LF,
                EXTERNAL,
                FLAT,
                FUNCTION_19_LF,
                NO_FF_SRC
            ),
            define
            (
                'X',
                ANY_DOCUMENT,
                ARRAY_ITERATOR,
                ESC_REGEXP_LF,
                EXTERNAL,
                FLAT,
                FUNCTION_22_LF,
                INCR_CHAR
            ),
            define
            (
                'V',
                ANY_DOCUMENT,
                ARRAY_ITERATOR,
                ESC_REGEXP_LF,
                EXTERNAL,
                FLAT,
                FUNCTION_22_LF,
                INCR_CHAR,
                NO_FF_SRC
            ),
            define
            ('X', ANY_DOCUMENT, ARRAY_ITERATOR, ESC_REGEXP_LF, FUNCTION_22_LF, HTMLAUDIOELEMENT),
            define
            (
                'V',
                ANY_DOCUMENT,
                ARRAY_ITERATOR,
                ESC_REGEXP_LF,
                FUNCTION_22_LF,
                HTMLAUDIOELEMENT,
                V8_SRC
            ),
            define
            ('X', ANY_DOCUMENT, ARRAY_ITERATOR, ESC_REGEXP_LF, FUNCTION_19_LF, HTMLAUDIOELEMENT),
            define
            (
                'V',
                ANY_DOCUMENT,
                ARRAY_ITERATOR,
                ESC_REGEXP_LF,
                FUNCTION_19_LF,
                HTMLAUDIOELEMENT,
                V8_SRC
            ),
            define('U', ANY_DOCUMENT, BARPROP, CONSOLE, EXTERNAL, FF_SRC, FILL, FROM_CODE_POINT),
            define('U', ANY_DOCUMENT, BARPROP, CONSOLE, EXTERNAL, FILL, FROM_CODE_POINT, IE_SRC),
            define('U', ANY_DOCUMENT, BARPROP, CONSOLE, EXTERNAL, FILL, FROM_CODE_POINT, V8_SRC),
            define
            (
                'V',
                ANY_DOCUMENT,
                ARRAY_ITERATOR,
                ESC_REGEXP_LF,
                EXTERNAL,
                FILL,
                FUNCTION_19_LF,
                V8_SRC
            ),
            define
            (
                'V',
                ANY_DOCUMENT,
                ARRAY_ITERATOR,
                ESC_REGEXP_LF,
                EXTERNAL,
                FLAT,
                FUNCTION_19_LF,
                NO_IE_SRC
            ),
            define('U', ANY_DOCUMENT, UNDEFINED),
            define('U', ESC_REGEXP_LF, UNDEFINED),
            define('W', ANY_WINDOW),
            define('U', ANY_WINDOW, CAPITAL_HTML),
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
            define('0B', ARRAY_ITERATOR),
        ],
        '0i',
        [
            define('0j'),
            define('0T', CAPITAL_HTML),
            define('0j', ARRAY_ITERATOR),
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

    CHARACTERS =
    noProto
    ({
        '\t':
        [
            define('Function("return\\"" + ESCAPING_BACKSLASH + "true\\"")()[0]'),
            defineCharDefault('\t', { escSeq: false }),
        ],
        '\n':
        [
            define('(Function() + [])[23]'),
            define('(RP_1_NO + Function())[20]', FUNCTION_19_LF),
            define('(Function() + [])[22]', FUNCTION_22_LF),
            define('(ANY_FUNCTION + [])[0]', IE_SRC),
            defineFHCharAt('FILTER', 19, NO_V8_SRC),
            defineFHCharAt('FILL', 17, FILL, NO_V8_SRC),
            defineFHCharAt('FLAT', 17, FLAT, NO_V8_SRC),
        ],

        '\f':
        [
            define('Function("return\\"" + ESCAPING_BACKSLASH + "false\\"")()[0]'),
            defineCharDefault('\f', { escSeq: false }),
        ],
        '\r':
        [
            define('Function("return\\"" + ESCAPING_BACKSLASH + "r\\"")()'),
            defineCharDefault('\r', { escSeq: false }),
        ],

        '\x1e':
        [
            define('(RP_5_N + atob("NaNfalse"))[10]', ATOB),
        ],

        ' ':
        [
            defineFHCharAt('ANY_FUNCTION', 8),
            define('(RP_3_NO + ARRAY_ITERATOR)[10]', ARRAY_ITERATOR),
            define('(FILTER + [])[20]', FF_SRC),
            define('(+(ANY_FUNCTION + [])[0] + FILTER)[22]', NO_FF_SRC),
            define('(FILTER + [])[21]', NO_V8_SRC),
            define('(RP_1_NO + FILTER)[20]', V8_SRC),
            define('(+(ANY_FUNCTION + [])[0] + FILL)[20]', FILL, NO_FF_SRC),
            define('(RP_5_N + FILL)[20]', FILL, NO_IE_SRC),
            define('(FILL + [])[20]', FILL, NO_V8_SRC),
            define('(+(ANY_FUNCTION + [])[0] + FLAT)[20]', FLAT, NO_FF_SRC),
            define('(RP_5_N + FLAT)[20]', FLAT, NO_IE_SRC),
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
            defineCharDefault('&'),
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
            define(commaDefinition),
        ],
        '-': '(+".0000001" + [])[2]',
        '.': '(+"11e20" + [])[1]',
        '/':
        [
            define('"0false".italics()[10]'),
            define('"true".sub()[10]'),
        ],
        // '0'...'9':
        ':':
        [
            define('(RegExp() + [])[3]'),
            defineCharDefault(':'),
        ],
        ';':
        [
            define('"".fontcolor("".italics())[21]', ESC_HTML_ALL),
            define('"".fontcolor(true + "".sub())[20]', ESC_HTML_ALL),
            define('"".fontcolor("NaN\\"")[21]', ESC_HTML_QUOT),
            define('"".fontcolor("".fontcolor())[30]', ESC_HTML_QUOT_ONLY),
            defineCharDefault(';'),
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
            defineCharDefault('?'),
        ],
        // '@':    ,
        'A':
        [
            defineFHCharAt('Array', 9),
            define('(RP_3_NO + ARRAY_ITERATOR)[11]', ARRAY_ITERATOR),
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
            define('atob("00NaNfalse")[1]', ATOB),
            define('(RP_4_N + "".fontcolor())[10]', CAPITAL_HTML),
            define('(RP_3_NO + Function("return console")())[11]', CONSOLE),
            define('(Node + [])[12]', NODECONSTRUCTOR),
        ],
        'D':
        [
            // * The escaped character may be either "]" or "}".
            define('escape((+("1000" + (RP_5_N + FILTER + 0)[40] + 0) + FILTER)[40])[2]'), // *
            define('escape("]")[2]'),
            define('escape("}")[2]'),
            define('(document + [])[SUBSTR]("-10")[1]', ANY_DOCUMENT),
            define('btoa("00")[1]', ATOB),
            define('(RP_3_NO + document)[11]', DOCUMENT),
            define // *
            ('escape((RP_3_NO + [+("10" + [(RP_6_SO + FILL)[40]] + "000")] + FILL)[40])[2]', FILL),
            define // *
            ('escape((RP_3_NO + [+("10" + [(RP_6_SO + FLAT)[40]] + "000")] + FLAT)[40])[2]', FLAT),
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
            define('(RP_5_N + "".link())[10]', CAPITAL_HTML),
            define('(RP_3_NO + sidebar)[11]', EXTERNAL),
            define('(RP_3_NO + Audio)[21]', HTMLAUDIOELEMENT),
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
            define('(RP_5_N + Date())[30]', GMT),
        ],
        'H':
        [
            define('btoa(true)[1]', ATOB),
            define('"".link()[3]', CAPITAL_HTML),
            define
            ({ expr: '(RP_3_NO + Function("return history")())[11]', optimize: true }, HISTORY),
            define('(RP_1_NO + Audio)[10]', HTMLAUDIOELEMENT),
            define('(RP_3_NO + document)[11]', HTMLDOCUMENT),
        ],
        'I': '"Infinity"[0]',
        'J':
        [
            define('"j"[TO_UPPER_CASE]()'),
            define('btoa(true)[2]', ATOB),
            defineCharDefault('J', { atob: false }),
        ],
        'K':
        [
            define('(RP_5_N + "".strike())[10]', CAPITAL_HTML),
        ],
        'L':
        [
            define('btoa(".")[0]', ATOB),
            define('(RP_3_NO + "".fontcolor())[11]', CAPITAL_HTML),
            define('(Audio + [])[12]', HTMLAUDIOELEMENT),
            define('(document + [])[11]', HTMLDOCUMENT),
        ],
        'M':
        [
            define('btoa(0)[0]', ATOB),
            define('"".small()[2]', CAPITAL_HTML),
            define('(RP_4_N + Date())[30]', GMT),
            define('(Audio + [])[11]', HTMLAUDIOELEMENT),
            define('(document + [])[10]', HTMLDOCUMENT),
        ],
        'N': '"NaN"[0]',
        'O':
        [
            define('(RP_3_NO + PLAIN_OBJECT)[11]'),
            define('btoa(NaN)[3]', ATOB),
            define('"".fontcolor()[2]', CAPITAL_HTML),
        ],
        'P':
        [
            define('Function("return\\"" + ESCAPING_BACKSLASH + "120\\"")()'),
            define('atob("01A")[1]', ATOB),
            define('btoa("".italics())[0]', ATOB),
            define('(Function("return statusbar")() + [])[11]', BARPROP),
            define('"0".sup()[10]', CAPITAL_HTML),
            defineCharDefault('P', { atob: false, charCode: false, escSeq: false }),
        ],
        'Q':
        [
            define('"q"[TO_UPPER_CASE]()'),
            define('btoa(1)[1]', ATOB),
            defineCharDefault('Q', { atob: false }),
        ],
        'R':
        [
            defineFHCharAt('RegExp', 9),
            define('btoa("0true")[2]', ATOB),
            define('"".fontcolor()[10]', CAPITAL_HTML),
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
            define('(RP_3_NO + Date())[30]', GMT),
            define('(Audio + [])[10]', HTMLAUDIOELEMENT),
            define('(RP_1_NO + document)[10]', HTMLDOCUMENT),
            defineCharDefault('T', { atob: false }),
        ],
        'U':
        [
            define('btoa("1NaN")[1]', ATOB),
            define('"".sub()[2]', CAPITAL_HTML),
            define('(RP_3_NO + PLAIN_OBJECT[TO_STRING].call())[11]', UNDEFINED),
            define('(RP_3_NO + ARRAY_ITERATOR[TO_STRING].call())[11]', ARRAY_ITERATOR, UNDEFINED),
        ],
        'V':
        [
            define('"v"[TO_UPPER_CASE]()'),
            define('(document.createElement("video") + [])[12]', ANY_DOCUMENT),
            define('btoa(undefined)[10]', ATOB),
            defineCharDefault('V', { atob: false }),
        ],
        'W':
        [
            define('"w"[TO_UPPER_CASE]()'),
            define('(self + RP_4_N)[SUBSTR]("-11")[0]', ANY_WINDOW),
            define('btoa(undefined)[1]', ATOB),
            define('(self + [])[11]', DOMWINDOW),
            define('(RP_3_NO + self)[11]', WINDOW),
            defineCharDefault('W', { atob: false }),
        ],
        'X':
        [
            define('"x"[TO_UPPER_CASE]()'),
            define('btoa("1true")[1]', ATOB),
            defineCharDefault('X', { atob: false }),
        ],
        'Y':
        [
            define('"y"[TO_UPPER_CASE]()'),
            define('btoa("a")[0]', ATOB),
            defineCharDefault('Y', { atob: false }),
        ],
        'Z':
        [
            define('btoa(false)[0]', ATOB),
            define('(RP_3_NO + "".fontsize())[11]', CAPITAL_HTML),
        ],
        '[':
        [
            defineFBCharAt(14),
            define('(ARRAY_ITERATOR + [])[0]', ARRAY_ITERATOR),
        ],
        '\\':
        [
            define('ESCAPING_BACKSLASH'),
            defineCharDefault('\\', { atob: false, escSeq: false, unescape: false }),
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
            define('(RP_5_N + ARRAY_ITERATOR)[10]', ARRAY_ITERATOR),
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
        'i': '([RP_5_N] + undefined)[10]',
        'j':
        [
            define('(PLAIN_OBJECT + [])[10]'),
            define('(ARRAY_ITERATOR + [])[3]', ARRAY_ITERATOR),
            define('(Node + [])[3]', NODECONSTRUCTOR),
            define('(self + [])[3]', SELF_OBJ),
        ],
        'k':
        [
            define('20[TO_STRING]("21")'),
            defineCharDefault('k'),
        ],
        'l': '"false"[2]',
        'm':
        [
            defineFHCharAt('Number', 11),
            define('(RP_6_SO + Function())[20]'),
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
            define('(RP_3_NO + btoa(undefined))[10]', ATOB),
        ],
        'q':
        [
            define('212[TO_STRING]("31")[1]'),
            define('"".fontcolor(0 + "".fontcolor())[30]', ESC_HTML_ALL),
            define('"".fontcolor("0false\\"")[20]', ESC_HTML_QUOT),
            define('"".fontcolor(true + "".fontcolor())[30]', ESC_HTML_QUOT_ONLY),
            defineCharDefault('q'),
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
            define('(self + [])[SUBSTR]("-2")[0]', ANY_WINDOW),
            define('atob("undefined0")[1]', ATOB),
            define('(RP_4_N + self)[20]', DOMWINDOW),
            define('(self + [])[13]', WINDOW),
        ],
        'x':
        [
            define('101[TO_STRING]("34")[1]'),
            define('btoa("falsefalse")[10]', ATOB),
            define('(RP_1_NO + sidebar)[10]', EXTERNAL),
        ],
        'y': '(RP_3_NO + [Infinity])[10]',
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
            define('(RP_4_N + atob("NaNundefined"))[10]', ATOB),
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
            define
            (
                { expr: 'Infinity.toLocaleString()', optimize: { complexOpt: true } },
                LOCALE_INFINITY
            ),
            defineCharDefault('∞'),
        ],
    });

    COMPLEX =
    noProto
    ({
        Number:         define({ expr: 'Number.name', optimize: { toStringOpt: true } }, NAME),
        Object:         define({ expr: 'Object.name', optimize: { toStringOpt: true } }, NAME),
        RegExp:         define({ expr: 'RegExp.name', optimize: { toStringOpt: true } }, NAME),
        String:         define('String.name', NAME),
        'f,a,l,s,e':    define({ expr: 'F_A_L_S_E', level: LEVEL_OBJECT }),
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
            define
            (
                { expr: 'Function("return document")()', optimize: { toStringOpt: true } },
                ANY_DOCUMENT
            ),
        ],
        escape:
        [
            define({ expr: 'Function("return escape")()', optimize: { toStringOpt: true } }),
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
            define({ expr: 'Function("return unescape")()', optimize: { toStringOpt: true } }),
        ],
        uneval:
        [
            define('Function("return uneval")()', UNEVAL),
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
            define('atob("01y")[1]', ATOB),
            define('(RegExp("\\n") + [])[1]', ESC_REGEXP_LF),
            define('(RP_5_N + RegExp("".italics()))[10]', ESC_REGEXP_SLASH),
            define('(RP_3_NO + RegExp("".sub()))[10]', ESC_REGEXP_SLASH),
            define('uneval("".fontcolor(false))[20]', UNEVAL),
            define('(RegExp(FILTER) + [])[20]', ESC_REGEXP_LF, FF_SRC),
            define('(RegExp(Function()) + [])[20]', ESC_REGEXP_LF, FUNCTION_19_LF),
            define('(RP_5_N + RegExp(Function()))[30]', ESC_REGEXP_LF, FUNCTION_22_LF),
            define('(RegExp(ANY_FUNCTION) + [])[1]', ESC_REGEXP_LF, IE_SRC),
            define('(+(ANY_FUNCTION + [])[0] + RegExp(FILTER))[23]', ESC_REGEXP_LF, NO_V8_SRC),
            define('uneval(FILTER + [])[20]', FF_SRC, UNEVAL),
            define('uneval(ANY_FUNCTION + [])[1]', IE_SRC, UNEVAL),
            define('uneval(+(ANY_FUNCTION + [])[0] + FILTER)[23]', NO_V8_SRC, UNEVAL),
            define('(RP_3_NO + RegExp(FILL))[21]', ESC_REGEXP_LF, FF_SRC, FILL),
            define('(RP_3_NO + RegExp(FLAT))[21]', ESC_REGEXP_LF, FF_SRC, FLAT),
            define('(+(ANY_FUNCTION + [])[0] + RegExp(FILL))[21]', ESC_REGEXP_LF, FILL, NO_V8_SRC),
            define('(+(ANY_FUNCTION + [])[0] + RegExp(FLAT))[21]', ESC_REGEXP_LF, FLAT, NO_V8_SRC),
            define('uneval(RP_3_NO + FILL)[21]', FF_SRC, FILL, UNEVAL),
            define('uneval(RP_3_NO + FLAT)[21]', FF_SRC, FLAT, UNEVAL),
            define('uneval(+(ANY_FUNCTION + [])[0] + FILL)[21]', FILL, NO_V8_SRC, UNEVAL),
            define('uneval(+(ANY_FUNCTION + [])[0] + FLAT)[21]', FLAT, NO_V8_SRC, UNEVAL),
            defineCharDefault('\\', { atob: false, charCode: false, escSeq: false }),
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
            define({ expr: '"fromCharCode"', optimize: true }),
            define({ expr: '"fromCodePoint"', optimize: { toStringOpt: true } }, FROM_CODE_POINT),
        ],
        F_A_L_S_E:
        [
            define('[].slice.call("false")'),
            define('[].flat.call("false")', FLAT),
        ],
        PLAIN_OBJECT:
        [
            define('Function("return{}")()'),
            define('Function("return Intl")()', INTL),
        ],
        SUBSTR:
        [
            define('"slice"'),
            define('"substr"'),
        ],
        TO_STRING:
        [
            define({ expr: '"toString"', optimize: { complexOpt: true } }),
        ],
        TO_UPPER_CASE:
        [
            define({ expr: '"toUpperCase"', optimize: { toStringOpt: true } }),
        ],

        // Function body extra padding blocks: prepended to a function to align the function's body
        // at the same position in different engines, assuming that the function header is aligned.
        // The number after "FBEP_" is the maximum character overhead. The letters after the last
        // underscore have the same meaning as in regular padding blocks.

        FBEP_4_S:
        [
            define('[[true][+(RP_3_NO + FILTER)[30]]]'),
            define('[[true][+(RP_5_N + FILL)[30]]]', FILL),
            define('[[true][+(RP_5_N + FLAT)[30]]]', FLAT),
        ],
        FBEP_9_U:
        [
            define('[false][+(ANY_FUNCTION + [])[20]]'),
        ],

        // Function body padding blocks: prepended to a function to align the function's body at the
        // same position in different engines.
        // The number after "FBP_" is the maximum character overhead. The letters after the last
        // underscore have the same meaning as in regular padding blocks.

        FBP_5_S:
        [
            define('[[false][+IS_IE_SRC_N]]', NO_FF_SRC),
        ],
        FBP_7_NO:
        [
            define('+("10" + [(RP_4_N + FILTER)[40]] + "00000")'),
            define('+("10" + [(RP_6_SO + FILL)[40]] + "00000")', FILL),
            define('+("10" + [(RP_6_SO + FLAT)[40]] + "00000")', FLAT),
        ],
        FBP_8_NO:
        [
            define('+("1000" + (RP_5_N + FILTER + 0)[40] + "000")'),
            define('+("1000" + (FILL + 0)[33] + "000")', FILL),
            define('+("1000" + (FLAT + 0)[33] + "000")', FLAT),
        ],
        FBP_9_U:
        [
            define('[true][+(ANY_FUNCTION + [])[0]]', NO_FF_SRC),
        ],

        // Function header shift: used to adjust an indexer to make it point to the same position in
        // the string representation of a function's header in different engines.
        // This evaluates to an array containing only the number 𝑛 - 1 or only the number 𝑛, where 𝑛
        // is the number after "FH_SHIFT_".

        FH_SHIFT_1:
        [
            define('[+IS_IE_SRC_N]'),
        ],
        FH_SHIFT_3:
        [
            define('[2 + IS_IE_SRC_N]'),
        ],

        // Function header padding blocks: prepended to a function to align the function's header at
        // the same position in different engines.
        // The number after "FHP_" is the maximum character overhead.
        // The letters after the last underscore have the same meaning as in regular padding blocks.

        FHP_3_NO:
        [
            define('+(1 + [+(ANY_FUNCTION + [])[0]])'),
            define('+(++(ANY_FUNCTION + [])[0] + [0])', INCR_CHAR),
        ],
        FHP_5_N:
        [
            define('IS_IE_SRC_N'),
        ],
        FHP_8_S:
        [
            define('[FHP_3_NO] + RP_5_N'),
            define('FHP_5_N + [RP_3_NO]', INCR_CHAR),
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
            define('!!++(ANY_FUNCTION + [])[0]', INCR_CHAR),
        ],
    });

    createBridgeSolution =
    function (bridge)
    {
        var replacement = '[[]]' + bridge + '([[]])';
        var solution = new Solution(replacement, LEVEL_OBJECT, false);
        var appendLength = bridge.length - 1;
        solution.appendLength = appendLength;
        solution.bridge = bridge;
        return solution;
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
    defineList
    (
        [
            define(createParseIntArgDefault),
            define
            (
                function (amendings, firstDigit)
                {
                    var parseIntArg =
                    createCreateParseIntArgByReduce
                    (amendings, 'function(f,a,l,s,e){return f.replace(a,' + firstDigit + '+l)}');
                    return parseIntArg;
                }
            ),
            define
            (
                function (amendings, firstDigit)
                {
                    var parseIntArg =
                    createCreateParseIntArgByReduce
                    (amendings, '(f,a,l,s,e)=>f.replace(a,' + firstDigit + '+l)');
                    return parseIntArg;
                },
                ARROW
            ),
        ],
        [
            define(1),
            define(0, ARRAY_ITERATOR, CAPITAL_HTML, NO_IE_SRC),
            define(1, FF_SRC),
            define(1, FILL),
            define(1, FLAT),
            define(1, NO_OLD_SAFARI_ARRAY_ITERATOR),
            define(1, V8_SRC),
            define(2),
            define(1, ARROW, NO_FF_SRC),
            define(1, ARROW, NO_V8_SRC),
            define(2, ARRAY_ITERATOR),
            define(1, ARRAY_ITERATOR, ARROW, FF_SRC, FILL),
            define(1, ARRAY_ITERATOR, ARROW, FILL, IE_SRC),
            define(1, ARRAY_ITERATOR, ARROW, FILL, V8_SRC),
            define(1, ARRAY_ITERATOR, ARROW, FLAT, NO_V8_SRC),
            define(1, ARRAY_ITERATOR, ARROW, FLAT, V8_SRC),
        ]
    );

    FROM_CHAR_CODE =
    defineList
    (
        [define('fromCharCode'), define('fromCodePoint', FROM_CODE_POINT)],
        [
            define(0),
            define(1, BARPROP),
            define(1, ESC_REGEXP_SLASH),
            define(1, UNEVAL),
            define(1, ESC_REGEXP_LF, NO_V8_SRC),
            define(0, CONSOLE, FROM_CODE_POINT, UNEVAL),
            define(0, FROM_CODE_POINT, NODECONSTRUCTOR, UNEVAL),
            define(1, CAPITAL_HTML),
            define(0, ESC_REGEXP_SLASH, FROM_CODE_POINT, IE_SRC),
            define(1, ARRAY_ITERATOR, ESC_REGEXP_SLASH, IE_SRC),
            define(0, ESC_REGEXP_SLASH, FROM_CODE_POINT, NO_IE_SRC),
            define(1, ARRAY_ITERATOR, ESC_REGEXP_SLASH, NO_IE_SRC),
            define(0, ESC_REGEXP_SLASH, FLAT, FROM_CODE_POINT, NO_IE_SRC),
            define(0, ARRAY_ITERATOR, ESC_REGEXP_SLASH, FILL, FROM_CODE_POINT, IE_SRC),
            define(0, ARRAY_ITERATOR, ESC_REGEXP_SLASH, FLAT, FROM_CODE_POINT, IE_SRC),
            define(1, ATOB),
            define(0, ESC_REGEXP_SLASH, FROM_CODE_POINT, NAME, NO_V8_SRC),
            define(1, ARRAY_ITERATOR, ESC_REGEXP_SLASH, NAME, NO_V8_SRC),
            define(0, ESC_REGEXP_LF, FF_SRC, FROM_CODE_POINT, NAME),
            define(0, ESC_REGEXP_SLASH, FROM_CODE_POINT, IE_SRC, NAME),
            define(1, ARRAY_ITERATOR, ESC_REGEXP_LF, FF_SRC, NAME),
            define(1, ESC_REGEXP_LF, FF_SRC, FILL, NAME),
            define(1, ESC_REGEXP_LF, FF_SRC, FLAT, NAME),
            define(0, CONSOLE, ESC_REGEXP_SLASH, FROM_CODE_POINT),
            define(0, ESC_REGEXP_SLASH, FROM_CODE_POINT, NODECONSTRUCTOR),
            define(0, ARRAY_ITERATOR, ATOB, CAPITAL_HTML, FROM_CODE_POINT),
            define(0, CONSOLE, ESC_REGEXP_LF, FROM_CODE_POINT, NO_V8_SRC),
            define(0, ESC_REGEXP_LF, FROM_CODE_POINT, NODECONSTRUCTOR, NO_V8_SRC),
            define(0, ARRAY_ITERATOR, ESC_REGEXP_SLASH, FROM_CODE_POINT, NAME, NO_IE_SRC),
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
                ARROW, STATUS
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

    JSFUCK_INFINITY = '1e1000';

    MAPPER_FORMATTER =
    defineList
    (
        [
            define
            (
                function (arg)
                {
                    var mapper =
                    'Function("return function(undefined){return this' + arg + '}")().bind';
                    return mapper;
                }
            ),
            define
            (
                function (arg)
                {
                    var mapper =
                    'Function("return falsefalse=>undefined=>falsefalse' + arg + '")()';
                    return mapper;
                },
                ARROW
            ),
        ],
        [define(0), define(1)]
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

    SIMPLE = createEmpty();

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
            startLinks: createEmpty(),
        };
        return plan;
    };
}
)();

// This implementation assumes that all numeric solutions have an outer plus, and all other
// character solutions have none.

var ScrewBuffer;

var optimizeSolutions;

(function ()
{
    function canSplitRightEndForFree(solutions, lastBridgeIndex)
    {
        var rightEndIndex = lastBridgeIndex + 1;
        var rightEndLength = solutions.length - rightEndIndex;
        var result =
        rightEndLength > 2 || rightEndLength > 1 && !isUnluckyRightEnd(solutions, rightEndIndex);
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
        if
        (
            optimalSplitCost + intrinsicSplitCost < 0 &&
            !(optimalSplitCost > 0 && canSplitRightEndForFree(solutions, lastBridgeIndex))
        )
            return splitIndex;
    }

    function gatherGroup(solutions, groupBond, groupForceString, bridgeUsed)
    {
        function appendRightGroup(groupCount)
        {
            array.push(sequenceAsString(solutions, index, groupCount, '[[]]'), ')');
        }

        var array;
        var multiPart;
        var notStr;
        var count = solutions.length;
        if (count > 1)
        {
            var lastBridgeIndex;
            if (bridgeUsed)
                lastBridgeIndex = findLastBridge(solutions);
            multiPart = lastBridgeIndex == null;
            if (multiPart)
                array = sequence(solutions, 0, count);
            else
            {
                var bridgeIndex = findNextBridge(solutions, 0);
                var index;
                if (bridgeIndex > 1)
                {
                    var intrinsicSplitCost = groupForceString ? -3 : groupBond ? 2 : 0;
                    index =
                    findSplitIndex(solutions, intrinsicSplitCost, bridgeIndex, lastBridgeIndex);
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
            }
            notStr = !multiPart;
        }
        else
        {
            var solution = solutions[0];
            array = [solution];
            multiPart = false;
            notStr = solution.level < LEVEL_STRING;
        }
        if (notStr && groupForceString)
        {
            array.push('+[]');
            multiPart = true;
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
            isNumericJoin
            (
                levelCenter,
                levelRight = (solutionRight = solutions[index + 1]).level
            ) ?
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

    var EMPTY_SOLUTION = new Solution('[]', LEVEL_OBJECT, false);

    ScrewBuffer =
    function (bond, forceString, groupThreshold, optimizerList)
    {
        function gather(offset, count, groupBond, groupForceString)
        {
            var str;
            var end = offset + count;
            var groupSolutions = solutions.slice(offset, end);
            if (optimizerList.length)
                optimizeSolutions(optimizerList, groupSolutions, groupBond, groupForceString);
            str = gatherGroup(groupSolutions, groupBond, groupForceString, bridgeUsed);
            return str;
        }

        var bridgeUsed;
        var length = -APPEND_LENGTH_OF_EMPTY;
        var maxSolutionCount = _Math_pow(2, groupThreshold - 1);
        var solutions = [];

        assignNoEnum
        (
            this,
            {
                append:
                function (solution)
                {
                    if (solutions.length >= maxSolutionCount)
                        return false;
                    if (solution.bridge)
                        bridgeUsed = true;
                    solutions.push(solution);
                    var appendLength = solution.appendLength;
                    optimizerList.forEach
                    (
                        function (optimizer)
                        {
                            var currentAppendLength = optimizer.appendLengthOf(solution);
                            if (currentAppendLength < appendLength)
                                appendLength = currentAppendLength;
                        }
                    );
                    length += appendLength;
                    return true;
                },
                get length()
                {
                    return length;
                },
                toString:
                function ()
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
                            _Math_max
                            (
                                halfCount - capacity + capacity % (groupSize - 1),
                                (maxGroupCount / 2 ^ 0) * (groupSize + 1)
                            );
                            str =
                            collectOut(offset, leftEndCount, maxGroupCount) +
                            '+' +
                            collectOut
                            (offset + leftEndCount, count - leftEndCount, maxGroupCount, true);
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
                        var solution = solutions[0] || EMPTY_SOLUTION;
                        multiPart = forceString && solution.level < LEVEL_STRING;
                        str = solution.replacement;
                        if (multiPart)
                            str += '+[]';
                        if
                        (
                            bond &&
                            (multiPart || solution.hasOuterPlus || solution.charAt(0) === '!')
                        )
                            str = '(' + str + ')';
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
                },
            }
        );
    };

    optimizeSolutions =
    function (optimizerList, solutions, bond, forceString)
    {
        var plan = createClusteringPlan();
        optimizerList.forEach
        (
            function (optimizer)
            {
                optimizer.optimizeSolutions(plan, solutions, bond, forceString);
            }
        );
        var clusters = plan.conclude();
        clusters.forEach
        (
            function (cluster)
            {
                var clusterer = cluster.data;
                var solution = clusterer();
                solutions.splice(cluster.start, cluster.length, solution);
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
            var identifier = _JSON_parse('"' + rawIdentifier + '"');
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
        var value = _Function('return ' + expr)();
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
        var regExp = _RegExp(pattern);
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
            if (!_Array_isArray(value))
                return value == null && inArray ? '' : _String(value);
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
        // U+180E is recognized as a separator in older browsers.
        // U+FEFF is missed by /\s/ in Android Browser < 4.1.x.
        '(?!\u180E)[\\s\uFEFF]',
        SingleQuotedString:
        '\'(?:#EscapeSequence|(?![\'\\\\]).)*\'',
        UnicodeEscapeSequence:
        '\\\\u#HexDigit{4}',
    };

    var tokenCache = createEmpty();

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
            unitStack: [],
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
var APPEND_LENGTH_OF_EMPTY;
var APPEND_LENGTH_OF_PLUS_SIGN;
var APPEND_LENGTH_OF_SMALL_E;

var Encoder;

var replaceMultiDigitNumber;
var resolveSimple;

(function ()
{
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
            else if (exp % 100 === 99 && (exp > 99 || mantissa[1]))
                str = mantissa.replace(/.$/, '.$&e') + (exp + 1);
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
        var extraZeros = _Array(count + 1).join('0');
        return extraZeros;
    }

    function getMultiDigitLength(str)
    {
        var appendLength = 0;
        _Array_prototype_forEach.call
        (
            str,
            function (digit)
            {
                var digitAppendLength = APPEND_LENGTH_OF_DIGITS[digit];
                appendLength += digitAppendLength;
            }
        );
        return appendLength;
    }

    function getReplacers(optimize)
    {
        var replaceString =
        function (encoder, str, options)
        {
            options.optimize = optimize;
            var replacement = encoder.replaceString(str, options);
            if (!replacement)
                encoder.throwSyntaxError('String too complex');
            return replacement;
        };
        var strReplacer =
        function (encoder, str, bond, forceString)
        {
            var options = { bond: bond, forceString: forceString };
            var replacement = replaceString(encoder, str, options);
            return replacement;
        };
        var strAppender =
        function (encoder, str, firstSolution)
        {
            var options = { firstSolution: firstSolution, forceString: true };
            var replacement = replaceString(encoder, str, options);
            return replacement;
        };
        var replacers =
        { appendString: strAppender, identifier: replaceIdentifier, string: strReplacer };
        return replacers;
    }

    function isStringUnit(unit)
    {
        var strUnit = typeof unit.value === 'string' && !unit.mod && !unit.pmod && !unit.ops.length;
        return strUnit;
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

    function replaceIndexer(index)
    {
        var replacement = '[' + STATIC_ENCODER.replaceString(index) + ']';
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
        getMultiDigitLength(_String(-exp));
        if (extraLength < rivalExtraLength)
        {
            var str = mantissa + 'e' + exp;
            return str;
        }
    }

    function shortestOf(objs)
    {
        var shortestObj;
        var shortestLength = Infinity;
        objs.forEach
        (
            function (obj)
            {
                var length = obj.length;
                if (length < shortestLength)
                {
                    shortestObj = obj;
                    shortestLength = length;
                }
            }
        );
        return shortestObj;
    }

    var STATIC_CHAR_CACHE = createEmpty();
    var STATIC_CONST_CACHE = createEmpty();

    var quoteString = _JSON_stringify;

    APPEND_LENGTH_OF_DIGIT_0    = 6;
    APPEND_LENGTH_OF_EMPTY      = 3; // Append length of the empty array
    APPEND_LENGTH_OF_PLUS_SIGN  = 71;
    APPEND_LENGTH_OF_SMALL_E    = 26;

    APPEND_LENGTH_OF_DIGITS     = [APPEND_LENGTH_OF_DIGIT_0, 8, 12, 17, 22, 27, 32, 37, 42, 47];

    Encoder =
    function (mask)
    {
        this.mask       = mask;
        this.charCache  = _Object_create(STATIC_CHAR_CACHE);
        this.constCache = _Object_create(STATIC_CONST_CACHE);
        this.optimizers = createEmpty();
        this.stack      = [];
    };

    var encoderProtoSource =
    {
        callResolver:
        function (stackName, resolver)
        {
            var stack = this.stack;
            var stackIndex = stack.indexOf(stackName);
            stack.push(stackName);
            try
            {
                if (~stackIndex)
                {
                    var chain = stack.slice(stackIndex);
                    var feature = featureFromMask(this.mask);
                    var message =
                    'Circular reference detected: ' + chain.join(' < ') + ' – ' + feature;
                    var error = new _SyntaxError(message);
                    assignNoEnum(error, { chain: chain, feature: feature });
                    throw error;
                }
                resolver.call(this);
            }
            finally
            {
                stack.pop();
            }
        },

        constantDefinitions: CONSTANTS,

        createCharDefaultSolution:
        function (charCode, atobOpt, charCodeOpt, escSeqOpt, unescapeOpt)
        {
            var replacement;
            if (atobOpt && this.findDefinition(CONSTANTS.atob))
                replacement = this.replaceCharByAtob(charCode);
            else
            {
                var replacements = [];
                if (charCodeOpt)
                {
                    replacement = this.replaceCharByCharCode(charCode);
                    replacements.push(replacement);
                }
                if (escSeqOpt)
                {
                    replacement = this.replaceCharByEscSeq(charCode);
                    replacements.push(replacement);
                }
                if (unescapeOpt)
                {
                    replacement = this.replaceCharByUnescape(charCode);
                    replacements.push(replacement);
                }
                replacement = shortestOf(replacements);
            }
            var solution = new Solution(replacement, LEVEL_STRING, false);
            return solution;
        },

        defaultResolveCharacter:
        function (char)
        {
            var charCode = char.charCodeAt();
            var atobOpt = charCode < 0x100;
            var solution = this.createCharDefaultSolution(charCode, atobOpt, true, true, true);
            return solution;
        },

        expressParse:
        function (expr)
        {
            var unit = expressParse(expr);
            return unit;
        },

        findBase64AlphabetDefinition:
        function (element)
        {
            var definition;
            if (_Array_isArray(element))
                definition = this.findDefinition(element);
            else
                definition = element;
            return definition;
        },

        findDefinition:
        function (entries)
        {
            for (var entryIndex = entries.length; entryIndex--;)
            {
                var entry = entries[entryIndex];
                if (this.hasFeatures(entry.mask))
                    return entry.definition;
            }
        },

        findOptimalSolution:
        function (entries)
        {
            var result;
            entries.forEach
            (
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

        getPaddingBlock:
        function (paddingInfo, length)
        {
            var paddingBlock = paddingInfo.blocks[length];
            if (paddingBlock !== undefined)
                return paddingBlock;
            this.throwSyntaxError('Undefined padding block with length ' + length);
        },

        hasFeatures:
        function (mask)
        {
            var included = maskIncludes(this.mask, mask);
            return included;
        },

        hexCodeOf:
        function (charCode, hexDigitCount)
        {
            var optimalB = this.findDefinition(OPTIMAL_B);
            var charCodeStr = charCode.toString(16);
            var hexCodeSmallB =
            getExtraZeros(hexDigitCount - charCodeStr.length) +
            charCodeStr.replace(/fa?$/, 'false');
            var hexCode = hexCodeSmallB.replace(/b/g, optimalB);
            if (optimalB !== 'b' && /(?=.*b.*b)(?=.*c)|(?=.*b.*b.*b)/.test(charCodeStr))
            {
                // optimalB is not "b", but the character code is a candidate for toString
                // clustering, which only works with "b".
                var replacementSmallB = this.replaceString('f' + hexCodeSmallB, { optimize: true });
                var replacement = this.replaceString('f' + hexCode);
                if (replacementSmallB.length < replacement.length)
                    hexCode = hexCodeSmallB;
            }
            return hexCode;
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

        replaceCharByAtob:
        function (charCode)
        {
            var param1 =
            BASE64_ALPHABET_LO_6[charCode >> 2] + BASE64_ALPHABET_HI_2[charCode & 0x03];
            var postfix1 = '(' + this.replaceString(param1) + ')';
            if (param1.length > 2)
                postfix1 += replaceIndexer(0);

            var param2Left = this.findBase64AlphabetDefinition(BASE64_ALPHABET_LO_4[charCode >> 4]);
            var param2Right =
            this.findBase64AlphabetDefinition(BASE64_ALPHABET_HI_4[charCode & 0x0f]);
            var param2 = param2Left + param2Right;
            var index2 = 1 + (param2Left.length - 2) / 4 * 3;
            var indexer2 = replaceIndexer(index2);
            var postfix2 = '(' + this.replaceString(param2) + ')' + indexer2;

            var param3Left = BASE64_ALPHABET_LO_2[charCode >> 6];
            var param3 = param3Left + BASE64_ALPHABET_HI_6[charCode & 0x3f];
            var index3 = 2 + (param3Left.length - 3) / 4 * 3;
            var indexer3 = replaceIndexer(index3);
            var postfix3 = '(' + this.replaceString(param3) + ')' + indexer3;

            var postfix = shortestOf([postfix1, postfix2, postfix3]);
            var replacement = this.resolveConstant('atob') + postfix;
            return replacement;
        },

        replaceCharByCharCode:
        function (charCode)
        {
            var arg =
            charCode < 2 ? ['[]', 'true'][charCode] :
            charCode < 10 ? charCode :
            '"' + charCode + '"';
            var replacement = this.replaceExpr('String[FROM_CHAR_CODE](' + arg + ')');
            return replacement;
        },

        replaceCharByEscSeq:
        function (charCode)
        {
            var escCode;
            var appendIndexer;
            var optimize;
            if (charCode >= 0xfd || charCode in LOW_UNICODE_ESC_SEQ_CODES)
            {
                escCode = 'u' + this.hexCodeOf(charCode, 4);
                appendIndexer = escCode.length > 5;
                optimize = true;
            }
            else
            {
                escCode = charCode.toString(8);
                appendIndexer = false;
                optimize = false;
            }
            var expr = 'Function("return\\"" + ESCAPING_BACKSLASH + "' + escCode + '\\"")()';
            if (appendIndexer)
                expr += '[0]';
            var replacement = this.replaceExpr(expr, { toStringOpt: optimize });
            return replacement;
        },

        replaceCharByUnescape:
        function (charCode)
        {
            var hexCode;
            var appendIndexer;
            var optimize;
            if (charCode < 0x100)
            {
                hexCode = this.hexCodeOf(charCode, 2);
                appendIndexer = hexCode.length > 2;
                optimize = false;
            }
            else
            {
                hexCode = 'u' + this.hexCodeOf(charCode, 4);
                appendIndexer = hexCode.length > 5;
                optimize = true;
            }
            var expr = 'unescape("%' + hexCode + '")';
            if (appendIndexer)
                expr += '[0]';
            var replacement = this.replaceExpr(expr, { toStringOpt: optimize });
            return replacement;
        },

        replaceExpr:
        function (expr, optimize)
        {
            var unit = this.expressParse(expr);
            if (!unit)
                this.throwSyntaxError('Syntax error');
            var replacers = getReplacers(optimize);
            var replacement = this.replaceExpressUnit(unit, false, [], NaN, replacers);
            return replacement;
        },

        replaceExpressUnit:
        function (unit, bond, unitIndices, maxLength, replacers)
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
            this.replacePrimaryExpr
            (unit, primaryExprBondStrength, unitIndices, maxCoreLength, replacers);
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
                            this.replaceExpressUnit
                            (op, false, opUnitIndices, maxOpLength, replacers);
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

        replacePrimaryExpr:
        function (unit, bondStrength, unitIndices, maxLength, replacers)
        {
            var MIN_APPEND_LENGTH = 3;

            var output;
            var terms;
            var identifier;
            var strAppender = replacers.appendString;
            if (terms = unit.terms)
            {
                var count = terms.length;
                var maxCoreLength = maxLength - (bondStrength ? 2 : 0);
                var minOutputLevel = LEVEL_UNDEFINED;
                for (var index = 0; index < count; ++index)
                {
                    var term = terms[index];
                    var termUnitIndices = count > 1 ? unitIndices.concat(index) : unitIndices;
                    if (strAppender && isStringUnit(term))
                    {
                        var firstSolution =
                        output ? new Solution(output, minOutputLevel) : undefined;
                        output = strAppender(this, term.value, firstSolution);
                        minOutputLevel = LEVEL_STRING;
                    }
                    else
                    {
                        var maxTermLength =
                        maxCoreLength - (output ? output.length + 1 : 0) -
                        MIN_APPEND_LENGTH * (count - index - 1);
                        var termOutput =
                        this.replaceExpressUnit
                        (term, index, termUnitIndices, maxTermLength, replacers);
                        if (!termOutput)
                            return;
                        if (output)
                        {
                            output += '+' + termOutput;
                            minOutputLevel = _Math_max(minOutputLevel, LEVEL_NUMERIC);
                        }
                        else
                            output = termOutput;
                    }
                }
                if (bondStrength)
                    output = '(' + output + ')';
            }
            else if (identifier = unit.identifier)
            {
                var identifierReplacer = replacers.identifier;
                output = identifierReplacer(this, identifier, bondStrength, unitIndices, maxLength);
            }
            else
            {
                var value = unit.value;
                if (typeof value === 'string')
                {
                    var strReplacer = replacers.string;
                    output = strReplacer(this, value, bondStrength, true, unitIndices, maxLength);
                }
                else if (_Array_isArray(value))
                {
                    if (value.length)
                    {
                        var replacement =
                        this.replaceExpressUnit
                        (value[0], false, unitIndices, maxLength - 2, replacers);
                        if (replacement)
                            output = '[' + replacement + ']';
                    }
                    else if (!(maxLength < 2))
                        output = '[]';
                }
                else
                {
                    if (typeof value === 'number' && value === value)
                    {
                        var abs = _Math_abs(value);
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
                        output = replaceIdentifier(STATIC_ENCODER, _String(value), bondStrength);
                    if (output.length > maxLength)
                        return;
                }
            }
            return output;
        },

        replaceStaticString:
        function (str, maxLength)
        {
            var options = { bond: true, forceString: true, maxLength: maxLength };
            var replacement = STATIC_ENCODER.replaceString(str, options);
            return replacement;
        },

        /**
         * Replace a given string with equivalent JSFuck code.
         *
         * @param {string} str The string to replace.
         *
         * @param {object} [options={ }] An optional object specifying replacement options.
         *
         * @param {boolean} [options.bond=false]
         * <p>
         * Indicates whether the replacement expression should be bonded.</p>
         * <p>
         * An expression is bonded if it can be treated as a single unit by any valid operators
         * placed immediately before or after it.
         * E.g. `[][[]]` is bonded but `![]` is not, because `![][[]]` is different from
         * `(![])[[]]`.
         * More exactly, a bonded expression does not contain an outer plus and does not start
         * with `!`.</p>
         * <p>
         * Any expression becomes bonded when enclosed into parentheses.</p>
         *
         * @param {Solution} [options.firstSolution]
         * An optional solution to be prepended to the replacement string.
         *
         * @param {boolean} [options.forceString=false]
         * <p>
         * Indicates whether the replacement expression should evaluate to a string.</p>
         * <p>
         * Any expression can be converted into a string by appending `+[]`.</p>
         *
         * @param {number} [options.maxLength=(NaN)]
         * <p>
         * The maximum length of the replacement expression.</p>
         * <p>
         * If the replacement expression exceeds the specified length, the return value is
         * `undefined`.</p>
         * <p>
         * If this parameter is `NaN`, then no length limit is imposed.</p>
         *
         * @param {boolean|object<string, boolean|*>} [options.optimize=false]
         * <p>
         * Specifies which optimizations should be attempted.</p>
         * <p>
         * Optimizations may reduce the length of the replacement string, but they also reduce the
         * performance and may lead to unwanted circular dependencies when resolving
         * definitions.</p>
         * <p>
         * This parameter can be set to a boolean value in order to turn all optimizations on
         * (`true`) or off (`false`).
         * In order to turn specific optimizations on or off, specify an object that maps
         * optimization names with the suffix "Opt" to booleans, or to any other optimization
         * specific kind of data.</p>
         *
         * @returns {string} The replacement string.
         */

        replaceString:
        function (str, options)
        {
            options = options || { };
            var optimize = options.optimize;
            var optimizerList = [];
            if (optimize)
            {
                var optimizeComplex;
                var optimizeToString;
                if (typeof optimize === 'object')
                {
                    optimizeComplex     = !!optimize.complexOpt;
                    optimizeToString    = !!optimize.toStringOpt;
                }
                else
                    optimizeComplex = optimizeToString = true;
                var optimizers = this.optimizers;
                var optimizer;
                if (optimizeComplex)
                {
                    var complexOptimizers = optimizers.complex;
                    if (!complexOptimizers)
                        complexOptimizers = optimizers.complex = createEmpty();
                    for (var complex in COMPLEX)
                    {
                        var entry = COMPLEX[complex];
                        if (this.hasFeatures(entry.mask) && str.indexOf(complex) >= 0)
                        {
                            optimizer =
                            complexOptimizers[complex] ||
                            (
                                complexOptimizers[complex] =
                                getComplexOptimizer(this, complex, entry.definition)
                            );
                            optimizerList.push(optimizer);
                        }
                    }
                }
                if (optimizeToString)
                {
                    optimizer =
                    optimizers.toString || (optimizers.toString = getToStringOptimizer(this));
                    optimizerList.push(optimizer);
                }
            }
            var buffer =
            new ScrewBuffer
            (options.bond, options.forceString, this.maxGroupThreshold, optimizerList);
            var firstSolution = options.firstSolution;
            var maxLength = options.maxLength;
            if (firstSolution)
            {
                buffer.append(firstSolution);
                if (buffer.length > maxLength)
                    return;
            }
            var match;
            var regExp = _RegExp(STR_TOKEN_PATTERN, 'g');
            while (match = regExp.exec(str))
            {
                var token;
                var solution;
                if (token = match[2])
                    solution = this.resolveCharacter(token);
                else
                {
                    token = match[1];
                    solution = SIMPLE[token];
                }
                if (!buffer.append(solution) || buffer.length > maxLength)
                    return;
            }
            var result = _String(buffer);
            if (!(result.length > maxLength))
                return result;
        },

        resolve:
        function (definition)
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
                solution = new Solution(replacement, level);
            }
            return solution;
        },

        resolveCharacter:
        function (char)
        {
            var solution = this.charCache[char];
            if (solution === undefined)
            {
                this.callResolver
                (
                    quoteString(char),
                    function ()
                    {
                        var charCache;
                        var entries = CHARACTERS[char];
                        if (!entries || _Array_isArray(entries))
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
                            solution.entryIndex = 'static';
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

        resolveConstant:
        function (constant)
        {
            var solution = this.constCache[constant];
            if (solution === undefined)
            {
                this.callResolver
                (
                    constant,
                    function ()
                    {
                        var constCache;
                        var entries = this.constantDefinitions[constant];
                        if (_Array_isArray(entries))
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

        resolveExprAt:
        function (expr, index, entries, paddingInfos)
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
            var solution = new Solution(replacement, LEVEL_STRING, false);
            return solution;
        },

        throwSyntaxError:
        function (message)
        {
            var stack = this.stack;
            var stackLength = stack.length;
            if (stackLength)
                message += ' in the definition of ' + stack[stackLength - 1];
            throw new _SyntaxError(message);
        },
    };

    assignNoEnum(Encoder.prototype, encoderProtoSource);

    var APPEND_LENGTH_OF_DOT    = 73;
    var APPEND_LENGTH_OF_MINUS  = 136;

    var BOND_STRENGTH_NONE      = 0;
    var BOND_STRENGTH_WEAK      = 1;
    var BOND_STRENGTH_STRONG    = 2;

    var LOW_UNICODE_ESC_SEQ_CODES = createEmpty();

    [
        0x0f, 0x1f, 0x2f, 0x3f, 0x6f, 0x7f, 0xaf, 0xdf, 0xef,
        0xf0, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xfa,
    ]
    .forEach
    (
        function (charCode)
        {
            LOW_UNICODE_ESC_SEQ_CODES[charCode] = null;
        }
    );

    var STATIC_ENCODER = new Encoder(maskNew());

    var STR_TOKEN_PATTERN = '(' + _Object_keys(SIMPLE).join('|') + ')|([\\s\\S])';

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
        STATIC_ENCODER.callResolver
        (
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
        var figure = _Object(value);
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
                _Array_prototype_push.apply(figures, newFigures);
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
            oldFigures.forEach
            (
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
    var usedValueSet = createEmpty();
    var appendableParts =
    PARTS.filter
    (
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

var getComplexOptimizer;

(function ()
{
    var BOND_EXTRA_LENGTH = 2; // Extra length of bonding parentheses "(" and ")"
    var NOOP_OPTIMIZER = { appendLengthOf: noop, optimizeSolutions: noop };

    function createOptimizer
    (complex, complexSolution, charSet, optimizedCharAppendLength, appendLengthDiff)
    {
        function appendLengthOf(solution)
        {
            var char = solution.char;
            if (char != null && char in charSet)
                return optimizedCharAppendLength;
        }

        function clusterer()
        {
            return complexSolution;
        }

        function matchComplex(solutions, start)
        {
            for (var index = 0; index < complexLength; ++index)
            {
                var solutionIndex = start + index;
                var solution = solutions[solutionIndex];
                var complexChar = complex[index];
                if (solution.char !== complexChar)
                    return false;
            }
            return true;
        }

        function optimizeSolutions(plan, solutions, bond, forceString)
        {
            for (var index = 0, limit = solutions.length - complexLength; index <= limit; ++index)
            {
                if (matchComplex(solutions, index))
                {
                    var saving = appendLengthDiff;
                    if (!limit)
                    {
                        if (forceString && complexSolution.level < LEVEL_STRING)
                            saving -= APPEND_LENGTH_OF_EMPTY;
                        else if (bond)
                            saving += BOND_EXTRA_LENGTH;
                    }
                    if (saving > 0)
                        plan.addCluster(index, complexLength, clusterer, saving);
                }
            }
        }

        var complexLength = complex.length;
        var optimizer = { appendLengthOf: appendLengthOf, optimizeSolutions: optimizeSolutions };
        return optimizer;
    }

    function createCharSet(charInfos, index)
    {
        var charSet = createEmpty();
        var charInfo;
        while (charInfo = charInfos[index++])
            charSet[charInfo.char] = null;
        return charSet;
    }

    getComplexOptimizer =
    function (encoder, complex, definition)
    {
        var optimizer;
        var discreteAppendLength = 0;
        var charMap = createEmpty();
        var charInfos = [];
        _Array_prototype_forEach.call
        (
            complex,
            function (char)
            {
                var charSolution = encoder.resolveCharacter(char);
                var charAppendLength = charSolution.appendLength;
                discreteAppendLength += charAppendLength;
                var charInfo = charMap[char];
                if (charInfo)
                    ++charInfo.count;
                else
                {
                    charInfo = charMap[char] =
                    { appendLength: charAppendLength, char: char, count: 1 };
                    charInfos.push(charInfo);
                }
            }
        );
        var complexSolution = encoder.resolve(definition);
        if (complexSolution.level == null)
            complexSolution.level = LEVEL_STRING;
        var solutionAppendLength = complexSolution.appendLength;
        var appendLengthDiff = discreteAppendLength - solutionAppendLength;
        if (appendLengthDiff + BOND_EXTRA_LENGTH > 0)
        {
            charInfos.sort
            (
                function (charInfo1, charInfo2)
                {
                    var result = charInfo1.appendLength - charInfo2.appendLength;
                    return result;
                }
            );
            var restLength = solutionAppendLength;
            var restCount = complex.length;
            for (var index = 0; restCount; ++index)
            {
                var charInfo = charInfos[index];
                var charAppendLength = charInfo.appendLength;
                if (charAppendLength * restCount > restLength)
                    break;
                var count = charInfo.count;
                restLength -= charAppendLength * count;
                restCount -= count;
            }
            var optimizedCharAppendLength = restLength / restCount | 0;
            var charSet = createCharSet(charInfos, index);
            optimizer =
            createOptimizer
            (complex, complexSolution, charSet, optimizedCharAppendLength, appendLengthDiff);
        }
        else
            optimizer = NOOP_OPTIMIZER;
        return optimizer;
    };
}
)();

var getToStringOptimizer;

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

    var BOND_EXTRA_LENGTH = 2; // Extra length of bonding parentheses "(" and ")"
    var CLUSTER_EXTRA_LENGTHS = [];
    var DECIMAL_DIGIT_MAX_COUNTS = [];
    var MAX_RADIX = 36;
    var MAX_SAFE_INTEGER = 0x1fffffffffffff;
    var MIN_SOLUTION_SPAN = 2;
    var RADIX_REPLACEMENTS = [];

    function createOptimizer(toStringReplacement)
    {
        function appendLengthOf(solution)
        {
            var char = solution.char;
            if (char != null && /[bcghjkmopqvwxz]/.test(char))
            {
                var appendLength = appendLengthCache[char];
                if (appendLength == null)
                {
                    var minRadix = getMinRadix(char);
                    var clusterExtraLength = CLUSTER_EXTRA_LENGTHS[minRadix];
                    var decimalDigitMaxCount = DECIMAL_DIGIT_MAX_COUNTS[minRadix];
                    appendLength =
                    appendLengthCache[char] =
                    (clusterBaseLength + clusterExtraLength) / decimalDigitMaxCount | 0;
                }
                return appendLength;
            }
        }

        function createClusterer(decimalReplacement, radixReplacement)
        {
            var clusterer =
            function ()
            {
                var replacement =
                '(+(' + decimalReplacement + '))[' + toStringReplacement + '](' + radixReplacement +
                ')';
                var solution = new Solution(replacement, LEVEL_STRING, false);
                return solution;
            };
            return clusterer;
        }

        function isExpensive(solution)
        {
            var char = solution.char;
            var expensive = appendLengthCache[char] <= solution.appendLength;
            return expensive;
        }

        function optimizeCluster(plan, start, radix, discreteAppendLength, chars)
        {
            do
            {
                var decimal = _parseInt(chars, radix);
                if (decimal > MAX_SAFE_INTEGER)
                    return clusterAppendLength == null;
                var decimalReplacement = replaceMultiDigitNumber(decimal);
                // Adding 3 for leading "+(" and trailing ")".
                var decimalLength = decimalReplacement.length + 3;
                var radixReplacement = RADIX_REPLACEMENTS[radix];
                var radixLength = radixReplacement.length;
                var clusterAppendLength = clusterBaseLength + decimalLength + radixLength;
                var saving = discreteAppendLength - clusterAppendLength;
                if (saving > 0)
                {
                    var clusterer = createClusterer(decimalReplacement, radixReplacement);
                    plan.addCluster(start, chars.length, clusterer, saving);
                }
            }
            while (++radix <= MAX_RADIX);
        }

        function optimizeClusters(plan, solutions, start, maxSolutionSpan, bond)
        {
            var maxDigitChar = '';
            var discreteAppendLength = 0;
            var chars = '';
            var solutionSpan = 0;
            do
            {
                var solution = solutions[start + solutionSpan];
                discreteAppendLength += solution.appendLength;
                var char = solution.char;
                if (maxDigitChar < char)
                    maxDigitChar = char;
                chars += char;
                if (++solutionSpan >= MIN_SOLUTION_SPAN && discreteAppendLength > clusterBaseLength)
                {
                    var minRadix = getMinRadix(maxDigitChar);
                    // If a bonding is required, an integral cluster can save two additional
                    // characters by omitting a pair of parentheses.
                    if (bond && !start && solutionSpan === maxSolutionSpan)
                        discreteAppendLength += BOND_EXTRA_LENGTH;
                    var clusterTooLong =
                    optimizeCluster(plan, start, minRadix, discreteAppendLength, chars);
                    if (clusterTooLong)
                        break;
                }
            }
            while (solutionSpan < maxSolutionSpan);
        }

        function optimizeSequence(plan, solutions, start, end, bond)
        {
            for (;; ++start)
            {
                var maxSolutionSpan = end - start;
                if (solutions[start].char !== '0')
                    optimizeClusters(plan, solutions, start, maxSolutionSpan, bond);
                if (maxSolutionSpan <= MIN_SOLUTION_SPAN)
                    break;
            }
        }

        function optimizeSolutions(plan, solutions, bond)
        {
            var end;
            var expensive;
            for (var start = solutions.length; start > 0;)
            {
                var solution = solutions[--start];
                if (isClusterable(solution))
                {
                    if (!end)
                    {
                        end = start + 1;
                        expensive = false;
                    }
                    if (!expensive)
                        expensive = isExpensive(solution);
                    if (expensive && end - start >= MIN_SOLUTION_SPAN)
                        optimizeSequence(plan, solutions, start, end, bond);
                }
                else
                    end = undefined;
            }
        }

        // Adding 7 for "+(", ")[", "](" and ")"
        var clusterBaseLength = toStringReplacement.length + 7;
        var appendLengthCache = createEmpty();
        var optimizer = { appendLengthOf: appendLengthOf, optimizeSolutions: optimizeSolutions };
        return optimizer;
    }

    function getMinRadix(char)
    {
        var minRadix = _parseInt(char, MAX_RADIX) + 1;
        return minRadix;
    }

    function isClusterable(solution)
    {
        var char = solution.char;
        var clusterable = char != null && /[\da-z]/.test(char);
        return clusterable;
    }

    getToStringOptimizer =
    function (encoder)
    {
        var toStringReplacement = _String(encoder.resolveConstant('TO_STRING'));
        var optimizer = createOptimizer(toStringReplacement);
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

var STRATEGIES;

var wrapWithCall;
var wrapWithEval;

(function ()
{
    function createReindexMap(count, radix, amendings, coerceToInt)
    {
        function getSortLength()
        {
            var length = 0;
            _Array_prototype_forEach.call
            (
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
            regExp = _RegExp(pattern, 'g');
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
            var reindex = range[index] = _Object(reindexStr);
            reindex.sortLength = getSortLength();
            reindex.index = index;
        }
        range.sort
        (
            function (reindex1, reindex2)
            {
                var result =
                reindex1.sortLength - reindex2.sortLength || reindex1.index - reindex2.index;
                return result;
            }
        );
        return range;
    }

    function defineStrategy(strategy, minInputLength)
    {
        strategy.MIN_INPUT_LENGTH = minInputLength;
        return strategy;
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
            var charMap = createEmpty();
            _Array_prototype_forEach.call
            (
                inputData,
                function (char)
                {
                    (
                        charMap[char] ||
                        (charMap[char] = { char: char, charCode: char.charCodeAt(), count: 0 })
                    )
                    .count++;
                }
            );
            var charList = _Object_keys(charMap);
            inputData.freqList =
            freqList =
            charList.map
            (
                function (char)
                {
                    var freq = charMap[char];
                    return freq;
                }
            )
            .sort
            (
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

    // The unit path consists of the string of colon-separated unit indices.
    function getUnitPath(unitIndices)
    {
        var unitPath = unitIndices.length ? unitIndices.join(':') : '0';
        return unitPath;
    }

    function initMinFalseFreeCharIndexArrayStrLength(input)
    {
        var minCharIndexArrayStrLength =
        _Math_max((input.length - 1) * (SIMPLE.false.length + 1) - 3, 0);
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

    STRATEGIES =
    {
        byCharCodes:
        defineStrategy
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
        byCharCodesRadix4:
        defineStrategy
        (
            function (inputData, maxLength)
            {
                var input = inputData.valueOf();
                var output = this.encodeByCharCodes(input, undefined, 4, maxLength);
                return output;
            },
            31
        ),
        byDenseFigures:
        defineStrategy
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDenseFigures(inputData, maxLength);
                return output;
            },
            2224
        ),
        byDict:
        defineStrategy
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, undefined, undefined, maxLength);
                return output;
            },
            3
        ),
        byDictRadix3:
        defineStrategy
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 3, 0, maxLength);
                return output;
            },
            240
        ),
        byDictRadix4:
        defineStrategy
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 4, 0, maxLength);
                return output;
            },
            177
        ),
        byDictRadix4AmendedBy1:
        defineStrategy
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 4, 1, maxLength);
                return output;
            },
            312
        ),
        byDictRadix4AmendedBy2:
        defineStrategy
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 4, 2, maxLength);
                return output;
            },
            560
        ),
        byDictRadix5AmendedBy2:
        defineStrategy
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 5, 2, maxLength);
                return output;
            },
            756
        ),
        byDictRadix5AmendedBy3:
        defineStrategy
        (
            function (inputData, maxLength)
            {
                var output = this.encodeByDict(inputData, 5, 3, maxLength);
                return output;
            },
            742
        ),
        bySparseFigures:
        defineStrategy
        (
            function (inputData, maxLength)
            {
                var output = this.encodeBySparseFigures(inputData, maxLength);
                return output;
            },
            328
        ),
        express:
        defineStrategy
        (
            function (inputData, maxLength)
            {
                var input = inputData.valueOf();
                var output = this.encodeExpress(input, maxLength);
                return output;
            }
        ),
        plain:
        defineStrategy
        (
            function (inputData, maxLength)
            {
                var input = inputData.valueOf();
                var options =
                {
                    bond:           inputData.bond,
                    forceString:    inputData.forceString,
                    maxLength:      maxLength,
                    optimize:       true,
                };
                var output = this.replaceString(input, options);
                return output;
            }
        ),
        text:
        defineStrategy
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
        callGetFigureLegendDelimiters:
        function (getFigureLegendDelimiters, figurator, figures)
        {
            var figureLegendDelimiters = getFigureLegendDelimiters(figurator, figures);
            return figureLegendDelimiters;
        },

        callStrategies:
        function (input, options, strategyNames, unitPath)
        {
            var output;
            var inputLength = input.length;
            var perfLog = this.perfLog;
            var perfInfoList = [];
            perfInfoList.name = unitPath;
            perfInfoList.inputLength = inputLength;
            perfLog.push(perfInfoList);
            var inputData = _Object(input);
            _Object_keys(options).forEach
            (
                function (optName)
                {
                    inputData[optName] = options[optName];
                }
            );
            var usedPerfInfo;
            strategyNames.forEach
            (
                function (strategyName)
                {
                    var strategy = STRATEGIES[strategyName];
                    var perfInfo = { strategyName: strategyName };
                    var perfStatus;
                    if (inputLength < strategy.MIN_INPUT_LENGTH)
                        perfStatus = 'skipped';
                    else
                    {
                        this.perfLog = perfInfo.perfLog = [];
                        var before = new _Date();
                        var maxLength = output != null ? output.length : NaN;
                        var newOutput = strategy.call(this, inputData, maxLength);
                        var time = new _Date() - before;
                        this.perfLog = perfLog;
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

        createCharCodesEncoding:
        function (charCodeArrayStr, long, radix)
        {
            var output;
            var fromCharCode = this.findDefinition(FROM_CHAR_CODE);
            if (radix)
            {
                output =
                this.createLongCharCodesOutput
                (charCodeArrayStr, fromCharCode, 'parseInt(undefined,' + radix + ')');
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
                    var returnString = this.findDefinition(OPTIMAL_RETURN_STRING);
                    var str = returnString + '.' + fromCharCode + '(';
                    output =
                    this.resolveConstant('Function') +
                    '(' +
                    this.replaceString(str, { optimize: true }) +
                    '+' +
                    charCodeArrayStr +
                    '+' +
                    this.resolveCharacter(')') +
                    ')()';
                }
            }
            return output;
        },

        createCharKeyArrayString:
        function (input, charMap, maxLength, delimiters)
        {
            var charKeyArray =
            _Array_prototype_map.call
            (
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

        createDictEncoding:
        function (legend, charIndexArrayStr, maxLength, radix, amendings, coerceToInt)
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

        createJSFuckArrayMapping:
        function (arrayStr, mapper, legend)
        {
            var result =
            arrayStr + '[' + this.replaceString('map', { optimize: true }) + '](' +
            this.replaceExpr(mapper, true) + '(' + legend + '))';
            return result;
        },

        createLongCharCodesOutput:
        function (charCodeArrayStr, fromCharCode, arg)
        {
            var formatter = this.findDefinition(FROM_CHAR_CODE_CALLBACK_FORMATTER);
            var formatterExpr = formatter(fromCharCode, arg);
            var output =
            charCodeArrayStr + '[' + this.replaceString('map', { optimize: true }) + '](' +
            this.replaceExpr('Function("return ' + formatterExpr + '")()', true) + ')[' +
            this.replaceString('join') + ']([])';
            return output;
        },

        encodeAndWrapText:
        function (input, wrapper, unitPath, maxLength)
        {
            var output;
            if (!wrapper || input)
            {
                var forceString = !wrapper || wrapper.forceString;
                output = this.encodeText(input, false, forceString, unitPath, maxLength);
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

        encodeByCharCodes:
        function (input, long, radix, maxLength)
        {
            var cache = createEmpty();
            var charCodeArray =
            _Array_prototype_map.call
            (
                input,
                function (char)
                {
                    var charCode = cache[char] || (cache[char] = char.charCodeAt().toString(radix));
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

        encodeByDblDict:
        function
        (
            initMinCharIndexArrayStrLength,
            figurator,
            getFigureLegendDelimiters,
            keyFigureArrayDelimiters,
            inputData,
            maxLength
        )
        {
            var input = inputData.valueOf();
            var freqList = getFrequencyList(inputData);
            var charMap = createEmpty();
            var minCharIndexArrayStrLength = initMinCharIndexArrayStrLength(input);
            var figures =
            freqList.map
            (
                function (freq, index)
                {
                    var figure = figurator(index);
                    charMap[freq.char] = figure;
                    minCharIndexArrayStrLength += freq.count * figure.sortLength;
                    return figure;
                }
            );
            var dictChars =
            freqList.map
            (
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
            this.replaceStringArray
            (figures, figureLegendDelimiters, figureMaxLength - minCharIndexArrayStrLength);
            if (!figureLegend)
                return;
            var keyFigureArrayStr =
            this.createCharKeyArrayString
            (input, charMap, figureMaxLength - figureLegend.length, keyFigureArrayDelimiters);
            if (!keyFigureArrayStr)
                return;
            var formatter = this.findDefinition(MAPPER_FORMATTER);
            var mapper = formatter('.indexOf(undefined)');
            var charIndexArrayStr =
            this.createJSFuckArrayMapping(keyFigureArrayStr, mapper, figureLegend);
            var output = this.createDictEncoding(legend, charIndexArrayStr, maxLength);
            return output;
        },

        encodeByDenseFigures:
        function (inputData, maxLength)
        {
            var output =
            this.encodeByDblDict
            (
                initMinFalseTrueCharIndexArrayStrLength,
                falseTrueFigurator,
                getDenseFigureLegendDelimiters,
                [FALSE_TRUE_DELIMITER],
                inputData,
                maxLength
            );
            return output;
        },

        encodeByDict:
        function (inputData, radix, amendings, maxLength)
        {
            var input = inputData.valueOf();
            var freqList = getFrequencyList(inputData);
            var coerceToInt =
            freqList.length &&
            freqList[0].count * APPEND_LENGTH_OF_DIGIT_0 > APPEND_LENGTH_OF_PLUS_SIGN;
            var reindexMap = createReindexMap(freqList.length, radix, amendings, coerceToInt);
            var charMap = createEmpty();
            var minCharIndexArrayStrLength = initMinFalseFreeCharIndexArrayStrLength(input);
            var dictChars = [];
            freqList.forEach
            (
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
            this.createCharKeyArrayString
            (input, charMap, maxLength - legend.length, [FALSE_FREE_DELIMITER]);
            if (!charIndexArrayStr)
                return;
            var output =
            this.createDictEncoding
            (legend, charIndexArrayStr, maxLength, radix, amendings, coerceToInt);
            return output;
        },

        encodeBySparseFigures:
        function (inputData, maxLength)
        {
            var output =
            this.encodeByDblDict
            (
                initMinFalseFreeCharIndexArrayStrLength,
                falseFreeFigurator,
                getSparseFigureLegendDelimiters,
                [FALSE_FREE_DELIMITER],
                inputData,
                maxLength
            );
            return output;
        },

        encodeDictLegend:
        function (dictChars, maxLength)
        {
            if (!(maxLength < 0))
            {
                var input = dictChars.join('');
                var output =
                this.callStrategies
                (
                    input,
                    { forceString: true },
                    ['byCharCodesRadix4', 'byCharCodes', 'plain'],
                    'legend'
                );
                if (output && !(output.length > maxLength))
                    return output;
            }
        },

        encodeExpress:
        function (input, maxLength)
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

        encodeText:
        function (input, bond, forceString, unitPath, maxLength)
        {
            var output =
            this.callStrategies
            (
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
                    'plain',
                ],
                unitPath
            );
            if (output != null && !(output.length > maxLength))
                return output;
        },

        exec:
        function (input, wrapper, strategyNames, perfInfo)
        {
            var perfLog = this.perfLog = [];
            var output = this.callStrategies(input, { wrapper: wrapper }, strategyNames);
            if (perfInfo)
                perfInfo.perfLog = perfLog;
            delete this.perfLog;
            if (output == null)
                throw new _Error('Encoding failed');
            return output;
        },

        replaceFalseFreeArray: replaceFalseFreeArray,

        replaceStringArray:
        function (array, delimiters, maxLength)
        {
            var splitExpr = this.replaceString('split', { maxLength: maxLength, optimize: true });
            if (splitExpr)
            {
                maxLength -= splitExpr.length + 4;
                var optimalReplacement;
                var optimalSeparatorExpr;
                delimiters.forEach
                (
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
        },
    };

    assignNoEnum(Encoder.prototype, encoderProtoSource);

    var FALSE_FREE_DELIMITER = { joiner: 'false', separator: 'false' };

    var FALSE_TRUE_DELIMITER = { joiner: '', separator: 'Function("return/(?=false|true)/")()' };

    var REPLACERS =
    {
        identifier:
        function (encoder, identifier, bondStrength, unitIndices, maxLength)
        {
            var unitPath = getUnitPath(unitIndices);
            var replacement =
            encoder.encodeAndWrapText('return ' + identifier, wrapWithCall, unitPath, maxLength);
            return replacement;
        },
        string:
        function (encoder, str, bond, forceString, unitIndices, maxLength)
        {
            var unitPath = getUnitPath(unitIndices);
            var replacement = encoder.encodeText(str, bond, forceString, unitPath, maxLength);
            return replacement;
        },
    };

    var falseFreeFigurator = createFigurator([''], 'false');
    var falseTrueFigurator = createFigurator(['false', 'true'], '');

    wrapWithCall =
    function (str)
    {
        var output = this.resolveConstant('Function') + '(' + str + ')()';
        return output;
    };
    wrapWithCall.forceString = false;

    wrapWithEval =
    function (str)
    {
        var output = this.replaceExpr('Function("return eval")()') + '(' + str + ')';
        return output;
    };
    wrapWithEval.forceString = true;
}
)();

var trimJS;

(function ()
{
    var regExp =
    _RegExp
    ('(?:(?!.)\\s)+(?:\\s|\uFEFF|//(?:(?!\\*/|`).)*(?!.)|/\\*(?:(?!`)(?:[^*]|\\*[^/]))*?\\*/)*$');

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
     * <dt><code>"express-eval"</code> (default)</dt>
     * <dd>
     * Applies the code generation process of both <code>"express"</code> and <code>"eval"</code>
     * and returns the shortest output.</dd>
     *
     * <dt><code>"none"</code></dt>
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
        var strategyNames = runAsData[1];
        if (options.trimCode)
            input = trimJS(input);
        var perfInfo = options.perfInfo;
        var encoder = getEncoder(features);
        var output = encoder.exec(input, wrapper, strategyNames, perfInfo);
        return output;
    }

    function filterRunAs(input, name)
    {
        var STRATEGY_NAMES_BOTH     = ['text', 'express'];
        var STRATEGY_NAMES_EXPRESS  = ['express'];
        var STRATEGY_NAMES_TEXT     = ['text'];

        if (input === undefined)
            return [wrapWithEval, STRATEGY_NAMES_BOTH];
        switch (_String(input))
        {
        case 'call':
            return [wrapWithCall, STRATEGY_NAMES_TEXT];
        case 'eval':
            return [wrapWithEval, STRATEGY_NAMES_TEXT];
        case 'express':
            return [, STRATEGY_NAMES_EXPRESS];
        case 'express-call':
            return [wrapWithCall, STRATEGY_NAMES_BOTH];
        case 'express-eval':
            return [wrapWithEval, STRATEGY_NAMES_BOTH];
        case 'none':
            return [, STRATEGY_NAMES_TEXT];
        }
        throw new _Error('Invalid value for option ' + name);
    }

    function getEncoder(features)
    {
        var mask = getValidFeatureMask(features);
        var encoder = encoders[mask];
        if (!encoder)
            encoders[mask] = encoder = new Encoder(mask);
        return encoder;
    }

    var encoders = createEmpty();

    /** @namespace JScrewIt */
    JScrewIt = assignNoEnum({ }, { Feature: Feature, encode: encode });

    getValidFeatureMask =
    function (features)
    {
        var mask =
        features !== undefined ? validMaskFromArrayOrStringOrFeature(features) : maskNew();
        return mask;
    };

    if (typeof self !== 'undefined')
        self.JScrewIt = JScrewIt;

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
        function clone(obj)
        {
            if (typeof obj === 'object')
            {
                var target = { };
                var names = _Object_keys(obj);
                names.forEach
                (
                    function (name)
                    {
                        var value = clone(obj[name]);
                        target[name] = value;
                    }
                );
                return target;
            }
            return obj;
        }

        function cloneEntries(inputEntries)
        {
            var outputEntries;
            if (inputEntries)
            {
                if (_Array_isArray(inputEntries))
                    outputEntries = inputEntries.map(cloneEntry);
                else
                    outputEntries = [createEntryClone(inputEntries, EMPTY_MASK)];
            }
            return outputEntries;
        }

        function cloneEntry(entry)
        {
            entry = createEntryClone(entry.definition, entry.mask);
            return entry;
        }

        function createEncoder(features)
        {
            var mask = getValidFeatureMask(features);
            var encoder = new Encoder(mask);
            encoder.perfLog = [];
            return encoder;
        }

        function createEntryClone(definition, mask)
        {
            definition = clone(definition);
            var entry = { definition: definition, mask: _Object_freeze(mask) };
            return entry;
        }

        function createFeatureFromMask(mask)
        {
            var featureObj = isMaskCompatible(mask) ? featureFromMask(mask) : null;
            return featureObj;
        }

        function createScrewBuffer(bond, forceString, groupThreshold, optimizerList)
        {
            var buffer = new ScrewBuffer(bond, forceString, groupThreshold, optimizerList);
            return buffer;
        }

        function defineConstant(encoder, constant, definition)
        {
            constant = _String(constant);
            if (!/^[$A-Z_a-z][$\w]*$/.test(constant))
                throw new _SyntaxError('Invalid identifier ' + _JSON_stringify(constant));
            if (!encoder.hasOwnProperty('constantDefinitions'))
                encoder.constantDefinitions = _Object_create(CONSTANTS);
            var entries = [define(esToString(definition))];
            encoder.constantDefinitions[constant] = entries;
        }

        function getCharacterEntries(char)
        {
            var entries = cloneEntries(CHARACTERS[char]);
            return entries;
        }

        function getComplexEntry(complex)
        {
            var entries = cloneEntry(COMPLEX[complex]);
            return entries;
        }

        function getComplexNames()
        {
            var names = _Object_keys(COMPLEX).sort();
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

        function getStrategies()
        {
            return STRATEGIES;
        }

        var EMPTY_MASK = maskNew();

        // Miscellaneous entries
        var ENTRIES = createEmpty();
        ENTRIES['BASE64_ALPHABET_HI_4:0']                       = BASE64_ALPHABET_HI_4[0];
        ENTRIES['BASE64_ALPHABET_HI_4:4']                       = BASE64_ALPHABET_HI_4[4];
        ENTRIES['BASE64_ALPHABET_HI_4:5']                       = BASE64_ALPHABET_HI_4[5];
        ENTRIES['BASE64_ALPHABET_LO_4:1']                       = BASE64_ALPHABET_LO_4[1];
        ENTRIES['BASE64_ALPHABET_LO_4:3']                       = BASE64_ALPHABET_LO_4[3];
        ENTRIES.CREATE_PARSE_INT_ARG                            = CREATE_PARSE_INT_ARG;
        ENTRIES['CREATE_PARSE_INT_ARG:available']               = CREATE_PARSE_INT_ARG.available;
        ENTRIES.FROM_CHAR_CODE                                  = FROM_CHAR_CODE;
        ENTRIES['FROM_CHAR_CODE:available']                     = FROM_CHAR_CODE.available;
        ENTRIES.FROM_CHAR_CODE_CALLBACK_FORMATTER               = FROM_CHAR_CODE_CALLBACK_FORMATTER;
        ENTRIES['FROM_CHAR_CODE_CALLBACK_FORMATTER:available']  =
        FROM_CHAR_CODE_CALLBACK_FORMATTER.available;
        ENTRIES.MAPPER_FORMATTER                                = MAPPER_FORMATTER;
        ENTRIES['MAPPER_FORMATTER:available']                   = MAPPER_FORMATTER.available;
        ENTRIES.OPTIMAL_B                                       = OPTIMAL_B;
        ENTRIES['OPTIMAL_B:available']                          = OPTIMAL_B.available;
        ENTRIES.OPTIMAL_RETURN_STRING                           = OPTIMAL_RETURN_STRING;
        ENTRIES['OPTIMAL_RETURN_STRING:available']              = OPTIMAL_RETURN_STRING.available;

        var debug =
        assignNoEnum
        (
            { },
            {
                Solution:               Solution,
                createBridgeSolution:   createBridgeSolution,
                createClusteringPlan:   createClusteringPlan,
                createEncoder:          createEncoder,
                createFeatureFromMask:  createFeatureFromMask,
                createFigurator:        createFigurator,
                createScrewBuffer:      createScrewBuffer,
                defineConstant:         defineConstant,
                getCharacterEntries:    getCharacterEntries,
                getComplexEntry:        getComplexEntry,
                getComplexNames:        getComplexNames,
                getComplexOptimizer:    getComplexOptimizer,
                getConstantEntries:     getConstantEntries,
                getEntries:             getEntries,
                getStrategies:          getStrategies,
                getToStringOptimizer:   getToStringOptimizer,
                maskIncludes:           maskIncludes,
                maskIsEmpty:            maskIsEmpty,
                maskNew:                maskNew,
                maskUnion:              maskUnion,
                optimizeSolutions:      optimizeSolutions,
                trimJS:                 trimJS,
            }
        );
        assignNoEnum(JScrewIt, { debug: debug });
    }
    )();
}

})();
