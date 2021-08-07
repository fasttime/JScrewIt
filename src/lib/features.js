/*
global
Audio,
Intl,
Node,
console,
document,
history,
location,
require,
self,
statusbar,
*/

import
{
    _Array_isArray,
    _Array_prototype_every_call,
    _Array_prototype_forEach_call,
    _Array_prototype_push_apply,
    _Error,
    _JSON_stringify,
    _Object_create,
    _Object_defineProperty,
    _Object_freeze,
    _Object_keys,
    assignNoEnum,
    createEmpty,
    esToString,
}
from './obj-utils';
import { MaskSet, maskAreEqual, maskIncludes, maskIntersection, maskNew, maskNext, maskUnion }
from '~mask';

var ALL                     = createEmpty();
var DESCRIPTION_MAP         = createEmpty();
var ELEMENTARY              = [];
var FEATURE_PROTOTYPE       = Feature.prototype;
var INCLUDES_MAP            = createEmpty();
var INCOMPATIBLE_MASK_LIST  = [];

export function Feature()
{
    var mask = validMaskFromArguments(arguments);
    var featureObj = this instanceof Feature ? this : _Object_create(FEATURE_PROTOTYPE);
    initMask(featureObj, mask);
    return featureObj;
}

function areCompatible()
{
    var arg0;
    var features =
    arguments.length === 1 && _Array_isArray(arg0 = arguments[0]) ? arg0 : arguments;
    var compatible;
    if (features.length > 1)
    {
        var mask = featureArrayLikeToMask(features);
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
    _Array_prototype_every_call
    (
        arguments,
        function (arg, index)
        {
            var returnValue;
            var otherMask = validMaskFromArrayOrStringOrFeature(arg);
            if (index)
                returnValue = maskAreEqual(otherMask, mask);
            else
            {
                mask = otherMask;
                returnValue = true;
            }
            return returnValue;
        }
    );
    return equal;
}

function checkLocaleNumeral(locale, number, regExp)
{
    var localizedNumeral = number.toLocaleString(locale);
    var returnValue = regExp.test(localizedNumeral);
    return returnValue;
}

function checkSelfFeature()
{
    // self + '' throws an error inside a web worker in Safari 8 and 9.
    try
    {
        var str = self + '';
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
    var returnValue;
    if (arguments.length)
    {
        var mask;
        _Array_prototype_forEach_call
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
        returnValue = featureFromMask(mask);
    }
    else
        returnValue = null;
    return returnValue;
}

function descriptionFor(name)
{
    name = esToString(name);
    var description = DESCRIPTION_MAP[name];
    if (description == null)
        throw new _Error('Unknown feature ' + _JSON_stringify(name));
    return description;
}

function featureArrayLikeToMask(arrayLike)
{
    var mask = maskNew();
    _Array_prototype_forEach_call
    (
        arrayLike,
        function (feature)
        {
            var otherMask = maskFromStringOrFeature(feature);
            mask = maskUnion(mask, otherMask);
        }
    );
    return mask;
}

export function featureFromMask(mask)
{
    var featureObj = _Object_create(FEATURE_PROTOTYPE);
    initMask(featureObj, mask);
    return featureObj;
}

export function featuresToMask(featureObjs)
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
}

function initMask(featureObj, mask)
{
    _Object_defineProperty(featureObj, 'mask', { value: mask });
}

/**
 * Node.js custom inspection function.
 * Set on `Feature.prototype` with name `"inspect"` for Node.js ≤ 8.6.x and with symbol
 * `Symbol.for("nodejs.util.inspect.custom")` for Node.js ≥ 6.6.x.
 *
 * @function inspect
 *
 * @see
 * {@link https://tiny.cc/j4wz9y|Custom inspection functions on Objects} for further information.
 */
function inspect(depth, opts)
{
    var returnValue;
    var str = this.toString();
    if (opts !== undefined) // opts can be undefined in Node.js 0.10.0.
        returnValue = opts.stylize(str, 'jscrewit-feature');
    else
        returnValue = str;
    return returnValue;
}

function isExcludingAttribute(attributeCache, attributeName, featureObjs)
{
    var returnValue = attributeCache[attributeName];
    if (returnValue === undefined)
    {
        attributeCache[attributeName] =
        returnValue =
        featureObjs.some
        (
            function (featureObj)
            {
                return attributeName in featureObj.attributes;
            }
        );
    }
    return returnValue;
}

export function isMaskCompatible(mask)
{
    var compatible =
    INCOMPATIBLE_MASK_LIST.every
    (
        function (incompatibleMask)
        {
            var returnValue = !maskIncludes(mask, incompatibleMask);
            return returnValue;
        }
    );
    return compatible;
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

function validateMask(mask)
{
    if (!isMaskCompatible(mask))
        throw new _Error('Incompatible features');
}

export function validMaskFromArguments(args)
{
    var mask = maskNew();
    var validationNeeded = 0;
    _Array_prototype_forEach_call
    (
        args,
        function (arg)
        {
            var otherMask;
            if (_Array_isArray(arg))
            {
                otherMask = featureArrayLikeToMask(arg);
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

export function validMaskFromArrayOrStringOrFeature(arg)
{
    var mask;
    if (_Array_isArray(arg))
    {
        mask = featureArrayLikeToMask(arg);
        if (arg.length > 1)
            validateMask(mask);
    }
    else
        mask = maskFromStringOrFeature(arg);
    return mask;
}

function wrapCheck(check)
{
    var returnValue =
    function ()
    {
        var available = !!check();
        return available;
    };
    return returnValue;
}

assignNoEnum
(
    FEATURE_PROTOTYPE,
    {
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
                        var includes = INCLUDES_MAP[name];
                        _Array_prototype_push_apply(allIncludes, includes);
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

        elementary: false,

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

        includes:
        function ()
        {
            var mask = this.mask;
            var included =
            _Array_prototype_every_call
            (
                arguments,
                function (arg)
                {
                    var otherMask = validMaskFromArrayOrStringOrFeature(arg);
                    var returnValue = maskIncludes(mask, otherMask);
                    return returnValue;
                }
            );
            return included;
        },

        inspect: inspect,

        name: undefined,

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
            var returnValue = featureFromMask(resultMask);
            return returnValue;
        },

        toString:
        function ()
        {
            var name = this.name;
            if (name === undefined)
                name = '{' + this.canonicalNames.join(', ') + '}';
            var str = '[Feature ' + name + ']';
            return str;
        },
    }
);

(function (featureInfos)
{
    function completeExclusions()
    {
        var incompatibleMaskSet = new MaskSet();
        featureNames.forEach
        (
            function (name)
            {
                var info = featureInfos[name];
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
                            if (!incompatibleMaskSet.has(incompatibleMask))
                            {
                                INCOMPATIBLE_MASK_LIST.push(incompatibleMask);
                                incompatibleMaskSet.add(incompatibleMask);
                            }
                        }
                    );
                }
            }
        );
    }

    function completeFeature(name)
    {
        var mask;
        var featureObj = ALL[name];
        if (featureObj)
            mask = featureObj.mask;
        else
        {
            var description;
            var info = featureInfos[name];
            var engine = info.engine;
            if (engine == null)
                description = info.description;
            else
                description = createEngineFeatureDescription(engine);
            var aliasFor = info.aliasFor;
            if (aliasFor != null)
            {
                mask = completeFeature(aliasFor);
                featureObj = ALL[aliasFor];
                if (description == null)
                    description = DESCRIPTION_MAP[aliasFor];
            }
            else
            {
                var check = info.check;
                if (check)
                {
                    mask = maskNext(unionMask);
                    unionMask = maskUnion(unionMask, mask);
                    if (check())
                        autoMask = maskUnion(autoMask, mask);
                    check = wrapCheck(check);
                }
                else
                    mask = maskNew();
                var includes = INCLUDES_MAP[name] = info.includes || [];
                includes.forEach
                (
                    function (include)
                    {
                        var includeMask = completeFeature(include);
                        mask = maskUnion(mask, includeMask);
                    }
                );
                var elementary = check || info.excludes;
                featureObj = createFeature(name, mask, check, engine, info.attributes, elementary);
                if (elementary)
                    ELEMENTARY.push(featureObj);
            }
            registerFeature(name, description, featureObj);
        }
        return mask;
    }

    function createEngineFeatureDescription(engine)
    {
        var description = 'Features available in ' + engine + '.';
        return description;
    }

    function createFeature(name, mask, check, engine, attributes, elementary)
    {
        attributes = _Object_freeze(attributes || { });
        var descriptors =
        {
            attributes:     { value: attributes },
            check:          { value: check },
            engine:         { value: engine },
            name:           { value: name },
        };
        if (elementary)
            descriptors.elementary = { value: true };
        var featureObj = _Object_create(FEATURE_PROTOTYPE, descriptors);
        initMask(featureObj, mask);
        return featureObj;
    }

    function registerFeature(name, description, featureObj)
    {
        var descriptor = { enumerable: true, value: featureObj };
        _Object_defineProperty(Feature, name, descriptor);
        ALL[name] = featureObj;
        DESCRIPTION_MAP[name] = description;
    }

    var constructorSource =
    {
        ALL:            ALL,
        ELEMENTARY:     ELEMENTARY,
        areCompatible:  areCompatible,
        areEqual:       areEqual,
        commonOf:       commonOf,
        descriptionFor: descriptionFor,
    };
    assignNoEnum(Feature, constructorSource);

    try
    {
        var inspectKey = require('util').inspect.custom;
    }
    catch (error)
    { }
    if (inspectKey)
    {
        _Object_defineProperty
        (FEATURE_PROTOTYPE, inspectKey, { configurable: true, value: inspect, writable: true });
    }

    var autoMask = maskNew();
    var unionMask = maskNew();

    var featureNames = _Object_keys(featureInfos);
    featureNames.forEach(completeFeature);
    completeExclusions();
    ELEMENTARY.sort
    (
        function (feature1, feature2)
        {
            var returnValue = feature1.name < feature2.name ? -1 : 1;
            return returnValue;
        }
    );
    _Object_freeze(ELEMENTARY);
    var autoFeatureObj = createFeature('AUTO', autoMask);
    registerFeature('AUTO', 'All features available in the current engine.', autoFeatureObj);
    _Object_freeze(ALL);
})
(
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
                typeof document === 'object' && /^\[object [\S\s]*Document]$/.test(document + '');
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
                    var available = /^\[object [\S\s]*Window]$/.test(str);
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
                Array.prototype.entries && /^\[object Array[\S\s]{8,9}]$/.test([].entries());
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
        AT:
        {
            description: 'Existence of the native function Array.prototype.at.',
            check:
            function ()
            {
                var available = Array.prototype.at;
                return available;
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
            attributes: { 'web-worker': 'old-safari-restriction' },
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
        GENERIC_ARRAY_TO_STRING:
        {
            description: 'Ability to call Array.prototype.toString with a non-array binding.',
            check:
            function ()
            {
                try
                {
                    Array.prototype.toString.call({ });
                    return true;
                }
                catch (error)
                { }
            },
        },
        GLOBAL_UNDEFINED:
        {
            description:
            'Having the global function toString return the string "[object Undefined]" when ' +
            'invoked without a binding.',
            check:
            function ()
            {
                var getToString = Function('return toString');
                var available = getToString()() === '[object Undefined]';
                return available;
            },
            includes: ['OBJECT_UNDEFINED'],
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
        LOCALE_NUMERALS:
        {
            description:
            'Features shared by all engines capable of localized number formatting, including ' +
            'output of Arabic digits, the Arabic decimal separator "٫", the letters in the first ' +
            'word of the Arabic string representation of NaN ("ليس"), Persian digits and the ' +
            'Persian digit group separator "٬".',
            check:
            function ()
            {
                var available =
                Number.prototype.toLocaleString &&
                checkLocaleNumeral('ar', NaN, /^ليس/) &&
                checkLocaleNumeral('ar-td', 234567890.1, /^٢٣٤٬?٥٦٧٬?٨٩٠٫١/) &&
                checkLocaleNumeral('fa', 1234567890, /^۱٬۲۳۴٬۵۶۷٬۸۹۰/);
                return available;
            },
        },
        LOCALE_NUMERALS_EXT:
        {
            description:
            'Extended localized number formatting.\n' +
            'This includes all features of LOCALE_NUMERALS plus the output of the first three ' +
            'letters in the second word of the Arabic string representation of NaN ("رقم"), ' +
            'Bengali digits, the letters in the Russian string representation of NaN ("не\xa0' +
            'число") and the letters in the Persian string representation of NaN ("ناعدد").',
            check:
            function ()
            {
                var available =
                Number.prototype.toLocaleString &&
                checkLocaleNumeral('ar', NaN, /^ليس.رقم/) &&
                checkLocaleNumeral('ar-td', 234567890.1, /^٢٣٤٬?٥٦٧٬?٨٩٠٫١/) &&
                checkLocaleNumeral('bn', 1234567890, /^১,২৩,৪৫,৬৭,৮৯০/) &&
                checkLocaleNumeral('fa', 1234567890, /^۱٬۲۳۴٬۵۶۷٬۸۹۰/) &&
                checkLocaleNumeral('fa', NaN, /^ناعد/) &&
                checkLocaleNumeral('ru', NaN, /^не.число/);
                return available;
            },
            includes: ['LOCALE_NUMERALS'],
        },
        LOCATION:
        {
            description:
            'Existence of the global object location with the property that ' +
            'Object.prototype.toString.call(location) evaluates to a string that starts with ' +
            '"[object " and ends with "Location]".',
            check:
            function ()
            {
                var available =
                typeof location === 'object' &&
                /^\[object [\S\s]*Location]$/.test(Object.prototype.toString.call(location));
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
            'A string representation of native functions typical for V8 or for Internet Explorer ' +
            'but not for Firefox and Safari.',
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
            'to "[object Array Iterator]" and that Array.prototype.entries().constructor is the ' +
            'global function Object.',
            check:
            function ()
            {
                if (Array.prototype.entries)
                {
                    var arrayIterator = [].entries();
                    var available =
                    arrayIterator + '' === '[object Array Iterator]' &&
                    arrayIterator.constructor === Object;
                    return available;
                }
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
        OBJECT_L_LOCATION_CTOR:
        {
            description:
            'Existence of the global function location.constructor whose string representation ' +
            'starts with "[object L"',
            check:
            function ()
            {
                var available =
                typeof location === 'object' && /^\[object L/.test(location.constructor);
                return available;
            },
            attributes: { 'web-worker': 'web-worker-restriction' },
        },
        OBJECT_UNDEFINED:
        {
            description:
            'Having the function Object.prototype.toString return the string "[object ' +
            'Undefined]" when invoked without a binding.',
            check:
            function ()
            {
                var toString = Object.prototype.toString;
                var available = toString() === '[object Undefined]';
                return available;
            },
            includes: ['UNDEFINED'],
        },
        OBJECT_W_CTOR:
        {
            description:
            'The property that the string representation of the global object constructor starts ' +
            'with "[object W"',
            check:
            function ()
            {
                var available = /^\[object W/.test(constructor);
                return available;
            },
            attributes: { 'web-worker': 'old-safari-restriction' },
        },
        OLD_SAFARI_LOCATION_CTOR:
        {
            description:
            'Existence of the global object location.constructor whose string representation ' +
            'starts with "[object " and ends with "LocationConstructor]"',
            check:
            function ()
            {
                var available =
                typeof location === 'object' &&
                /^\[object [\S\s]*LocationConstructor]$/.test(location.constructor);
                return available;
            },
        },
        PLAIN_INTL:
        {
            description:
            'Existence of the global object Intl having the string representation "[object ' +
            'Object]"',
            check:
            function ()
            {
                var available = typeof Intl === 'object' && Intl + '' === '[object Object]';
                return available;
            },
            includes: ['INTL'],
        },
        REGEXP_STRING_ITERATOR:
        {
            description:
            'The property that the string representation of String.prototype.matchAll() ' +
            'evaluates to "[object RegExp String Iterator]".',
            check:
            function ()
            {
                var available =
                String.prototype.matchAll &&
                ''.matchAll() + '' === '[object RegExp String Iterator]';
                return available;
            },
        },
        SELF: { aliasFor: 'ANY_WINDOW' },
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
        SHORT_LOCALES:
        {
            description:
            'Support for the two-letter locale name "ar" to format decimal numbers as Arabic ' +
            'numerals.',
            check:
            function ()
            {
                var NUMBER = 9876430.125;

                var localizedNumeral = NUMBER.toLocaleString('ar');
                var available =
                localizedNumeral === NUMBER.toLocaleString('ar-td') &&
                localizedNumeral !== NUMBER.toLocaleString('en');
                return available;
            },
            includes: ['LOCALE_NUMERALS'],
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
        V8_SRC:
        {
            description:
            'A string representation of native functions typical for the V8 engine.\n' +
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
                'char-increment-restriction':   null,
                'safari-bug-21820506':          null,
                'web-worker-restriction':       null,
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
                'FLAT',
                'FROM_CODE_POINT',
                'GENERIC_ARRAY_TO_STRING',
                'GLOBAL_UNDEFINED',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'LOCALE_NUMERALS_EXT',
                'LOCATION',
                'NAME',
                'NO_IE_SRC',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'REGEXP_STRING_ITERATOR',
                'STATUS',
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
                'LOCATION',
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
                'GENERIC_ARRAY_TO_STRING',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'LOCATION',
                'NAME',
                'OBJECT_UNDEFINED',
                'STATUS',
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
                'GENERIC_ARRAY_TO_STRING',
                'GMT',
                'HISTORY',
                'HTMLAUDIOELEMENT',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'LOCALE_INFINITY',
                'LOCALE_NUMERALS_EXT',
                'LOCATION',
                'NAME',
                'OBJECT_UNDEFINED',
                'PLAIN_INTL',
                'SHORT_LOCALES',
                'STATUS',
                'V8_SRC',
                'WINDOW',
            ],
            attributes: { 'no-console-in-web-worker': null, 'web-worker-restriction': null },
        },
        CHROME_PREV:
        {
            engine: 'the previous to current versions of Chrome and Edge',
            aliasFor: 'CHROME_86',
        },
        CHROME_86:
        {
            engine: 'Chrome 86 to 91, Edge 86 to 91 and Opera 72 to 77',
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
                'GENERIC_ARRAY_TO_STRING',
                'GLOBAL_UNDEFINED',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'LOCALE_NUMERALS_EXT',
                'LOCATION',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'REGEXP_STRING_ITERATOR',
                'STATUS',
                'V8_SRC',
                'WINDOW',
            ],
            attributes:
            {
                'char-increment-restriction':   null,
                'unstable':                     null,
                'web-worker-restriction':       null,
            },
        },
        CHROME:
        {
            engine: 'the current stable versions of Chrome, Edge and Opera',
            aliasFor: 'CHROME_92',
        },
        CHROME_92:
        {
            engine: 'Chrome 92, Edge 92 and Opera 78 or later',
            includes:
            [
                'ARROW',
                'AT',
                'ATOB',
                'BARPROP',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'FILL',
                'FLAT',
                'FROM_CODE_POINT',
                'FUNCTION_19_LF',
                'GENERIC_ARRAY_TO_STRING',
                'GLOBAL_UNDEFINED',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'LOCALE_NUMERALS_EXT',
                'LOCATION',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'REGEXP_STRING_ITERATOR',
                'STATUS',
                'V8_SRC',
                'WINDOW',
            ],
            attributes:
            {
                'char-increment-restriction':   null,
                'unstable':                     null,
                'web-worker-restriction':       null,
            },
        },
        FF_ESR:
        {
            engine: 'the current version of Firefox ESR',
            aliasFor: 'FF_78',
        },
        FF_78:
        {
            engine: 'Firefox 78 to 82',
            includes:
            [
                'ARROW',
                'ATOB',
                'BARPROP',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'FF_SRC',
                'FILL',
                'FLAT',
                'FROM_CODE_POINT',
                'FUNCTION_19_LF',
                'GENERIC_ARRAY_TO_STRING',
                'GLOBAL_UNDEFINED',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'LOCALE_INFINITY',
                'LOCALE_NUMERALS_EXT',
                'LOCATION',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'PLAIN_INTL',
                'REGEXP_STRING_ITERATOR',
                'SHORT_LOCALES',
                'STATUS',
                'WINDOW',
            ],
            attributes:
            {
                'char-increment-restriction':   null,
                'unstable':                     null,
                'web-worker-restriction':       null,
            },
        },
        FF_PREV:
        {
            engine: 'the previous to current version of Firefox',
            aliasFor: 'FF_83',
        },
        FF_83:
        {
            engine: 'Firefox 83 to 89',
            includes:
            [
                'ARROW',
                'ATOB',
                'BARPROP',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'FF_SRC',
                'FILL',
                'FLAT',
                'FROM_CODE_POINT',
                'FUNCTION_19_LF',
                'GENERIC_ARRAY_TO_STRING',
                'GLOBAL_UNDEFINED',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'LOCALE_NUMERALS_EXT',
                'LOCATION',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'REGEXP_STRING_ITERATOR',
                'SHORT_LOCALES',
                'STATUS',
                'WINDOW',
            ],
            attributes:
            {
                'char-increment-restriction':   null,
                'unstable':                     null,
                'web-worker-restriction':       null,
            },
        },
        FF:
        {
            engine: 'the current stable version of Firefox',
            aliasFor: 'FF_90',
        },
        FF_90:
        {
            engine: 'Firefox 90 or later',
            includes:
            [
                'ARROW',
                'AT',
                'ATOB',
                'BARPROP',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'FF_SRC',
                'FILL',
                'FLAT',
                'FROM_CODE_POINT',
                'FUNCTION_19_LF',
                'GENERIC_ARRAY_TO_STRING',
                'GLOBAL_UNDEFINED',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'LOCALE_NUMERALS_EXT',
                'LOCATION',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'REGEXP_STRING_ITERATOR',
                'SHORT_LOCALES',
                'STATUS',
                'WINDOW',
            ],
            attributes:
            {
                'char-increment-restriction':   null,
                'unstable':                     null,
                'web-worker-restriction':       null,
            },
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
                'GENERIC_ARRAY_TO_STRING',
                'HISTORY',
                'IE_SRC',
                'INCR_CHAR',
                'OBJECT_L_LOCATION_CTOR',
                'OBJECT_W_CTOR',
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
                'GENERIC_ARRAY_TO_STRING',
                'HISTORY',
                'IE_SRC',
                'INCR_CHAR',
                'OBJECT_L_LOCATION_CTOR',
                'OBJECT_UNDEFINED',
                'OBJECT_W_CTOR',
                'STATUS',
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
                'GENERIC_ARRAY_TO_STRING',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'IE_SRC',
                'INCR_CHAR',
                'LOCALE_NUMERALS',
                'OBJECT_L_LOCATION_CTOR',
                'OBJECT_UNDEFINED',
                'OBJECT_W_CTOR',
                'PLAIN_INTL',
                'SHORT_LOCALES',
                'STATUS',
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
                'GENERIC_ARRAY_TO_STRING',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'IE_SRC',
                'INCR_CHAR',
                'LOCALE_INFINITY',
                'LOCALE_NUMERALS_EXT',
                'OBJECT_L_LOCATION_CTOR',
                'OBJECT_UNDEFINED',
                'OBJECT_W_CTOR',
                'PLAIN_INTL',
                'SHORT_LOCALES',
                'STATUS',
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
                'GENERIC_ARRAY_TO_STRING',
                'GLOBAL_UNDEFINED',
                'GMT',
                'INCR_CHAR',
                'NAME',
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
                'GENERIC_ARRAY_TO_STRING',
                'GLOBAL_UNDEFINED',
                'GMT',
                'INCR_CHAR',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'PLAIN_INTL',
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
                'GENERIC_ARRAY_TO_STRING',
                'GLOBAL_UNDEFINED',
                'GMT',
                'INCR_CHAR',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'PLAIN_INTL',
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
                'GENERIC_ARRAY_TO_STRING',
                'GLOBAL_UNDEFINED',
                'GMT',
                'INCR_CHAR',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'PLAIN_INTL',
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
                'GENERIC_ARRAY_TO_STRING',
                'GLOBAL_UNDEFINED',
                'GMT',
                'INCR_CHAR',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'PLAIN_INTL',
                'V8_SRC',
            ],
            attributes: { 'char-increment-restriction': null },
        },
        NODE_11:
        {
            engine: 'Node.js 11',
            includes:
            [
                'ARROW',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_SLASH',
                'FILL',
                'FLAT',
                'FROM_CODE_POINT',
                'FUNCTION_19_LF',
                'GENERIC_ARRAY_TO_STRING',
                'GLOBAL_UNDEFINED',
                'GMT',
                'INCR_CHAR',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'PLAIN_INTL',
                'V8_SRC',
            ],
            attributes: { 'char-increment-restriction': null },
        },
        NODE_12:
        {
            engine: 'Node.js 12',
            includes:
            [
                'ARROW',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'FILL',
                'FLAT',
                'FROM_CODE_POINT',
                'FUNCTION_19_LF',
                'GENERIC_ARRAY_TO_STRING',
                'GLOBAL_UNDEFINED',
                'GMT',
                'INCR_CHAR',
                'LOCALE_INFINITY',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'PLAIN_INTL',
                'REGEXP_STRING_ITERATOR',
                'V8_SRC',
            ],
            attributes: { 'char-increment-restriction': null },
        },
        NODE_13:
        {
            engine: 'Node.js 13 and Node.js 14',
            includes:
            [
                'ARROW',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'FILL',
                'FLAT',
                'FROM_CODE_POINT',
                'FUNCTION_19_LF',
                'GENERIC_ARRAY_TO_STRING',
                'GLOBAL_UNDEFINED',
                'GMT',
                'INCR_CHAR',
                'LOCALE_INFINITY',
                'LOCALE_NUMERALS_EXT',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'PLAIN_INTL',
                'REGEXP_STRING_ITERATOR',
                'SHORT_LOCALES',
                'V8_SRC',
            ],
            attributes: { 'char-increment-restriction': null },
        },
        NODE_15:
        {
            engine: 'Node.js 15',
            includes:
            [
                'ARROW',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'FILL',
                'FLAT',
                'FROM_CODE_POINT',
                'FUNCTION_19_LF',
                'GENERIC_ARRAY_TO_STRING',
                'GLOBAL_UNDEFINED',
                'GMT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'LOCALE_NUMERALS_EXT',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'REGEXP_STRING_ITERATOR',
                'SHORT_LOCALES',
                'V8_SRC',
            ],
            attributes: { 'char-increment-restriction': null },
        },
        NODE_16:
        {
            engine: 'Node.js 16 or later',
            includes:
            [
                'ARROW',
                'ATOB',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'FILL',
                'FLAT',
                'FROM_CODE_POINT',
                'FUNCTION_19_LF',
                'GENERIC_ARRAY_TO_STRING',
                'GLOBAL_UNDEFINED',
                'GMT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'LOCALE_NUMERALS_EXT',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'REGEXP_STRING_ITERATOR',
                'SHORT_LOCALES',
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
                'GENERIC_ARRAY_TO_STRING',
                'GLOBAL_UNDEFINED',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'LOCATION',
                'NAME',
                'NODECONSTRUCTOR',
                'OBJECT_L_LOCATION_CTOR',
                'OBJECT_W_CTOR',
                'OLD_SAFARI_LOCATION_CTOR',
                'STATUS',
                'WINDOW',
            ],
            attributes:
            {
                'char-increment-restriction':   null,
                'no-console-in-web-worker':     null,
                'old-safari-restriction':       null,
                'web-worker-restriction':       null,
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
                'GENERIC_ARRAY_TO_STRING',
                'GLOBAL_UNDEFINED',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'LOCATION',
                'NAME',
                'NODECONSTRUCTOR',
                'OBJECT_L_LOCATION_CTOR',
                'OBJECT_W_CTOR',
                'OLD_SAFARI_LOCATION_CTOR',
                'STATUS',
                'WINDOW',
            ],
            attributes:
            {
                'char-increment-restriction':   null,
                'old-safari-restriction':       null,
                'safari-bug-21820506':          null,
                'web-worker-restriction':       null,
            },
        },
        SAFARI_8: { aliasFor: 'SAFARI_7_1' },
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
                'GENERIC_ARRAY_TO_STRING',
                'GLOBAL_UNDEFINED',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'LOCATION',
                'NAME',
                'NODECONSTRUCTOR',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'OBJECT_L_LOCATION_CTOR',
                'OBJECT_W_CTOR',
                'OLD_SAFARI_LOCATION_CTOR',
                'STATUS',
                'WINDOW',
            ],
            attributes:
            {
                'char-increment-restriction':   null,
                'old-safari-restriction':       null,
                'safari-bug-21820506':          null,
                'web-worker-restriction':       null,
            },
        },
        SAFARI_10:
        {
            engine: 'Safari 10 and Safari 11',
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
                'GENERIC_ARRAY_TO_STRING',
                'GLOBAL_UNDEFINED',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'LOCALE_INFINITY',
                'LOCALE_NUMERALS_EXT',
                'LOCATION',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'PLAIN_INTL',
                'SHORT_LOCALES',
                'STATUS',
                'WINDOW',
            ],
            attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
        },
        SAFARI_12:
        {
            engine: 'Safari 12',
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
                'GENERIC_ARRAY_TO_STRING',
                'GLOBAL_UNDEFINED',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'LOCALE_INFINITY',
                'LOCALE_NUMERALS_EXT',
                'LOCATION',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'PLAIN_INTL',
                'SHORT_LOCALES',
                'STATUS',
                'WINDOW',
            ],
            attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
        },
        SAFARI_13:
        {
            engine: 'Safari 13 and Safari 14.0.0',
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
                'GENERIC_ARRAY_TO_STRING',
                'GLOBAL_UNDEFINED',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'LOCALE_INFINITY',
                'LOCALE_NUMERALS_EXT',
                'LOCATION',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'PLAIN_INTL',
                'REGEXP_STRING_ITERATOR',
                'SHORT_LOCALES',
                'STATUS',
                'WINDOW',
            ],
            attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
        },
        SAFARI_14_0_1:
        {
            engine: 'Safari 14.0.1 to 14.0.3',
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
                'GENERIC_ARRAY_TO_STRING',
                'GLOBAL_UNDEFINED',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'LOCALE_NUMERALS_EXT',
                'LOCATION',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'REGEXP_STRING_ITERATOR',
                'SHORT_LOCALES',
                'STATUS',
                'WINDOW',
            ],
            attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
        },
        SAFARI:
        {
            engine: 'the current stable version of Safari',
            aliasFor: 'SAFARI_14_1',
        },
        SAFARI_14_1:
        {
            engine: 'Safari 14.1 or later',
            includes:
            [
                'ARROW',
                'ATOB',
                'BARPROP',
                'ESC_HTML_QUOT_ONLY',
                'ESC_REGEXP_LF',
                'ESC_REGEXP_SLASH',
                'FF_SRC',
                'FILL',
                'FLAT',
                'FROM_CODE_POINT',
                'FUNCTION_22_LF',
                'GENERIC_ARRAY_TO_STRING',
                'GLOBAL_UNDEFINED',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'INCR_CHAR',
                'INTL',
                'LOCALE_INFINITY',
                'LOCALE_NUMERALS_EXT',
                'LOCATION',
                'NAME',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'REGEXP_STRING_ITERATOR',
                'SHORT_LOCALES',
                'STATUS',
                'WINDOW',
            ],
            attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
        },
    }
);
