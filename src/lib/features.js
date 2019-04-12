/*
global
Audio,
Node,
_Array_isArray,
_Array_prototype_every,
_Array_prototype_forEach,
_Array_prototype_push,
_Error,
_JSON_stringify,
_Object_create,
_Object_defineProperty,
_Object_freeze,
_Object_keys,
assignNoEnum,
console,
createEmpty,
document,
esToString,
history,
maskAreEqual,
maskIncludes,
maskIntersection,
maskNew,
maskUnion,
maskWithBit,
self,
sidebar,
statusbar,
*/

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
                'ESC_REGEXP_LF',
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
        CHROME_PREV: 'CHROME_69',
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
        CHROME: 'CHROME_73',
        CHROME_73:
        {
            engine: 'Chrome 73 and Opera 60 or later',
            includes:
            [
                'ARROW',
                'ATOB',
                'BARPROP',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_LF',
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
        EDGE_PREV: 'EDGE_40',
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

    var constructorSource =
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
    assignNoEnum(Feature, constructorSource);

    var protoSource =
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
         * @returns {string}
         * A string representation of this feature object.
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
    assignNoEnum(Feature.prototype, protoSource);

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
