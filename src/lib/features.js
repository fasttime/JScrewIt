/* global Iterator, console, document, self, statusbar */

import { _Object_defineProperty, _Object_keys, assignNoEnum, createEmpty }  from './obj-utils';
import { createFeatureClass, featuresToMask }                               from '~feature-hub';

var ELEMENTARY;
var Feature;

function checkLocaleNumeral(locale, number, regExp)
{
    var localizedNumeral = number.toLocaleString(locale);
    var returnValue = regExp.test(localizedNumeral);
    return returnValue;
}

function describeEngine(engine)
{
    var description = 'Features available in ' + engine + '.';
    return description;
}

function isExcludingAttribute(restrictionCache, restrictionName, featureObjs)
{
    var returnValue = restrictionCache[restrictionName];
    if (returnValue === undefined)
    {
        restrictionCache[restrictionName] =
        returnValue =
        featureObjs.some
        (
            function (featureObj)
            {
                var returnValue = restrictionName in featureObj.attributes;
                return returnValue;
            }
        );
    }
    return returnValue;
}

function makeSelfFeatureCheck(regExp)
{
    function check()
    {
        var available = typeof self !== 'undefined' && regExp.test(self + '');
        return available;
    }

    return check;
}

function restrict(environment, engineFeatureObjs)
{
    var restrictionCache = createEmpty();
    var elementaryFeatureObjs =
    ELEMENTARY.filter
    (
        function (elementaryFeatureObj)
        {
            var included = this.includes(elementaryFeatureObj);
            if (included)
            {
                var attributes = elementaryFeatureObj.attributes;
                included =
                !(
                    environment in attributes &&
                    (
                        engineFeatureObjs === undefined ||
                        isExcludingAttribute
                        (restrictionCache, attributes[environment], engineFeatureObjs)
                    )
                );
            }
            return included;
        },
        this
    );
    var restrictedFeatureObj = Feature(elementaryFeatureObjs);
    return restrictedFeatureObj;
}

var featureInfos =
{
    ARRAY_ITERATOR:
    {
        description:
        'The property that the string representation of Array.prototype.entries() evaluates to ' +
        '"[object Array Iterator]".',
        check:
        function ()
        {
            if (Array.prototype.entries)
            {
                var available = [].entries() + '' === '[object Array Iterator]';
                return available;
            }
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
    BARPROP:
    {
        description:
        'Existence of the global object statusbar having the string representation "[object ' +
        'BarProp]".',
        check:
        function ()
        {
            var available = typeof statusbar === 'object' && statusbar + '' === '[object BarProp]';
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
    },
    DOCUMENT:
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
    ESC_HTML_QUOT:
    {
        description:
        'The property that double quotation marks in the argument of String.prototype.fontcolor ' +
        'are escaped as "&quot;".',
        check:
        function ()
        {
            var available = ~''.fontcolor('"').indexOf('&quot;');
            return available;
        },
    },
    FF_SRC:
    {
        description:
        'A string representation of native functions typical for Firefox and Safari.\n' +
        'Remarkable traits are the lack of line feed characters at the beginning and at the end ' +
        'of the string and the presence of a line feed followed by four whitespaces ("\\n    ") ' +
        'before the "[native code]" sequence.',
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
        'A string representation of dynamically generated functions where the character at index ' +
        '19 is a line feed ("\\n").',
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
        'A string representation of dynamically generated functions where the character at index ' +
        '22 is a line feed ("\\n").',
        check:
        function ()
        {
            var available = (Function() + '')[22] === '\n';
            return available;
        },
    },
    IE_SRC:
    {
        description:
        'A string representation of native functions typical for Internet Explorer.\n' +
        'Remarkable traits are the presence of a line feed character ("\\n") at the beginning ' +
        'and at the end of the string and a line feed followed by four whitespaces ("\\n    ") ' +
        'before the "[native code]" sequence.',
        includes: ['NO_FF_SRC', 'NO_V8_SRC'],
        excludes: ['NO_IE_SRC'],
    },
    INCR_CHAR:
    {
        description:
        'The ability to use unary increment operators with string characters, like in ( ++"some ' +
        'string"[0] ): this will result in a TypeError in strict mode in ECMAScript compliant ' +
        'engines.',
        check:
        function ()
        {
            return true;
        },
        attributes: { 'forced-strict-mode': 'char-increment-restriction' },
    },
    ITERATOR_HELPER:
    {
        description: 'Availability of iterator helpers.',
        check:
        function ()
        {
            var available = typeof Iterator === 'function';
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
    LOCALE_NUMERALS_BN:
    {
        description: 'Localized number formatting for Bengali.',
        check:
        function ()
        {
            var available = checkLocaleNumeral('bn', 1234567890, /^১,২৩,৪৫,৬৭,৮৯০/);
            return available;
        },
    },
    LOCALE_NUMERALS_EXT:
    {
        description:
        'Extended localized number formatting.\n' +
        'Localized number formatting including the output of the first three letters in the ' +
        'second word of the Arabic string representation of NaN ("رقم"), the letters in the ' +
        'Russian string representation of NaN ("не\xa0число") and the letters in the Persian ' +
        'string representation of NaN ("ناعدد").',
        check:
        function ()
        {
            var available =
            checkLocaleNumeral('ar', NaN, /^ليس.رقم/) &&
            checkLocaleNumeral('fa', NaN, /^ناعد/) &&
            checkLocaleNumeral('ru', NaN, /^не.число/);
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
    NO_FF_SRC:
    {
        description:
        'A string representation of native functions typical for V8 or for Internet Explorer but ' +
        'not for Firefox and Safari.',
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
        'A string representation of native functions typical for most engines with the notable ' +
        'exception of Internet Explorer.\n' +
        'A remarkable trait of this feature is the lack of line feed characters at the beginning ' +
        'and at the end of the string.',
        check:
        function ()
        {
            var available = /^function Object\(\) \{(\n   )? \[native code]\s\}/.test(Object);
            return available;
        },
        excludes: ['IE_SRC'],
    },
    NO_V8_SRC:
    {
        description:
        'A string representation of native functions typical for Firefox, Internet Explorer and ' +
        'Safari.\n' +
        'A most remarkable trait of this feature is the presence of a line feed followed by four ' +
        'whitespaces ("\\n    ") before the "[native code]" sequence.',
        check:
        function ()
        {
            var available = /^\n?function Object\(\) \{\n    \[native code]\s\}/.test(Object);
            return available;
        },
        excludes: ['V8_SRC'],
    },
    OBJECT_ARRAY_ENTRIES_CTOR:
    {
        description:
        'The property that the Array.prototype.entries().constructor is the Object constructor.',
        check:
        function ()
        {
            var available = Array.prototype.entries && [].entries().constructor === Object;
            return available;
        },
    },
    OBJECT_W_SELF:
    {
        description:
        'The property that the string representation of the global object self starts ' +
        'with "[object W".',
        check:      makeSelfFeatureCheck(/^\[object W/),
        includes:   ['SELF'],
        attributes: { 'web-worker': 'non-ie-restriction' },
    },
    PLAIN_INTL:
    {
        description:
        'Existence of the global object Intl having the string representation "[object Object]".',
        check:
        function ()
        {
            var available = typeof Intl === 'object' && Intl + '' === '[object Object]';
            return available;
        },
    },
    REGEXP_STRING_ITERATOR:
    {
        description:
        'The property that the string representation of String.prototype.matchAll() evaluates to ' +
        '"[object RegExp String Iterator]".',
        check:
        function ()
        {
            var available =
            String.prototype.matchAll && ''.matchAll() + '' === '[object RegExp String Iterator]';
            return available;
        },
    },
    SELF:
    {
        description:
        'Existence of the global object self whose string representation starts with "[object ".',
        check: makeSelfFeatureCheck(/^\[object /),
    },
    SHORT_LOCALES:
    {
        description:
        'Support for the two-letter locale name "ar" to format decimal numbers as Arabic numerals.',
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
    },
    STATUS:
    {
        description:    'Existence of the global string status.',
        check:
        function ()
        {
            var available = typeof status === 'string';
            return available;
        },
        attributes:     { 'web-worker': 'web-worker-restriction' },
    },
    V8_SRC:
    {
        description:
        'A string representation of native functions typical for the V8 engine.\n' +
        'Remarkable traits are the lack of line feed characters at the beginning and at the end ' +
        'of the string and the presence of a single whitespace before the "[native code]" ' +
        'sequence.',
        includes: ['NO_FF_SRC', 'NO_IE_SRC'],
        excludes: ['NO_V8_SRC'],
    },
    WINDOW:
    {
        description:
        'Existence of the global object self having the string representation "[object Window]".',
        check:      makeSelfFeatureCheck(/^\[object Window]$/),
        includes:   ['OBJECT_W_SELF'],
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
        includes: ['DOCUMENT', 'INCR_CHAR', 'STATUS', 'WINDOW'],
        attributes:
        {
            'char-increment-restriction':   null,
            'non-ie-restriction':           null,
            'web-worker-restriction':       null,
        },
    },
    COMPACT:
    {
        description:
        'All new browsers\' features.\n' +
        'Not compatible with Node.js, Internet Explorer, and old versions of supported browsers.',
        includes:
        [
            'ARRAY_ITERATOR',
            'ARROW',
            'AT',
            'BARPROP',
            'DOCUMENT',
            'ESC_HTML_QUOT',
            'FILL',
            'FLAT',
            'FROM_CODE_POINT',
            'FUNCTION_19_LF',
            'INCR_CHAR',
            'ITERATOR_HELPER',
            'LOCALE_INFINITY',
            'LOCALE_NUMERALS_EXT',
            'NAME',
            'NO_IE_SRC',
            'REGEXP_STRING_ITERATOR',
            'STATUS',
            'WINDOW',
        ],
        attributes:
        {
            'char-increment-restriction':   null,
            'non-ie-restriction':           null,
            'web-worker-restriction':       null,
        },
    },
    CHROME_PREV:
    {
        description:    describeEngine('the previous to current versions of Chrome and Edge'),
        aliasFor:       'CHROME_122',
    },
    CHROME:
    {
        description:    describeEngine('the current stable versions of Chrome, Edge and Opera'),
        aliasFor:       'CHROME_122',
    },
    CHROME_122:
    {
        families: ['Chrome', 'Edge', 'Opera'],
        versions: ['122-', '122-', '108-'],
        includes:
        [
            'ARRAY_ITERATOR',
            'ARROW',
            'AT',
            'BARPROP',
            'DOCUMENT',
            'ESC_HTML_QUOT',
            'FILL',
            'FLAT',
            'FROM_CODE_POINT',
            'FUNCTION_19_LF',
            'INCR_CHAR',
            'ITERATOR_HELPER',
            'LOCALE_INFINITY',
            'LOCALE_NUMERALS_BN',
            'LOCALE_NUMERALS_EXT',
            'NAME',
            'REGEXP_STRING_ITERATOR',
            'STATUS',
            'V8_SRC',
            'WINDOW',
        ],
        attributes:
        {
            'char-increment-restriction':   null,
            'non-ie-restriction':           null,
            'unstable':                     null,
            'web-worker-restriction':       null,
        },
    },
    FF_ESR:
    {
        description:    describeEngine('the current version of Firefox ESR'),
        aliasFor:       'FF_90',
    },
    FF_PREV:
    {
        description:    describeEngine('the previous to current version of Firefox'),
        aliasFor:       'FF_134',
    },
    FF:
    {
        description:    describeEngine('the current stable version of Firefox'),
        aliasFor:       'FF_134',
    },
    FF_90:
    {
        families: ['Firefox'],
        versions: ['90-130'],
        includes:
        [
            'ARRAY_ITERATOR',
            'ARROW',
            'AT',
            'BARPROP',
            'DOCUMENT',
            'ESC_HTML_QUOT',
            'FF_SRC',
            'FILL',
            'FLAT',
            'FROM_CODE_POINT',
            'FUNCTION_19_LF',
            'INCR_CHAR',
            'LOCALE_INFINITY',
            'LOCALE_NUMERALS_BN',
            'LOCALE_NUMERALS_EXT',
            'NAME',
            'OBJECT_ARRAY_ENTRIES_CTOR',
            'REGEXP_STRING_ITERATOR',
            'SHORT_LOCALES',
            'STATUS',
            'WINDOW',
        ],
        attributes:
        {
            'char-increment-restriction':   null,
            'non-ie-restriction':           null,
            'unstable':                     null,
            'web-worker-restriction':       null,
        },
    },
    FF_131:
    {
        inherits:   'FF_90',
        versions:   ['131-133'],
        includes:   { ITERATOR_HELPER: true, OBJECT_ARRAY_ENTRIES_CTOR: false },
    },
    FF_134:
    {
        inherits:   'FF_131',
        versions:   ['134-'],
        includes:   { SHORT_LOCALES: false },
    },
    IE_11:
    {
        families:   ['Internet Explorer'],
        versions:   ['11'],
        includes:
        [
            'CAPITAL_HTML',
            'CONSOLE',
            'DOCUMENT',
            'FUNCTION_22_LF',
            'IE_SRC',
            'INCR_CHAR',
            'PLAIN_INTL',
            'SHORT_LOCALES',
            'STATUS',
            'WINDOW',
        ],
        attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
    },
    IE_11_WIN_10:
    {
        inherits:               'IE_11',
        versions:               ['11'],
        compatibilityTag:       'on Windows 10',
        compatibilityShortTag:  'W10',
        includes:
        {
            LOCALE_INFINITY:        true,
            LOCALE_NUMERALS_BN:     true,
            LOCALE_NUMERALS_EXT:    true,
        },
    },
    NODE_20:
    {
        families:   ['Node.js'],
        versions:   ['20-21'],
        includes:
        [
            'ARRAY_ITERATOR',
            'ARROW',
            'AT',
            'ESC_HTML_QUOT',
            'FILL',
            'FLAT',
            'FROM_CODE_POINT',
            'FUNCTION_19_LF',
            'INCR_CHAR',
            'LOCALE_INFINITY',
            'LOCALE_NUMERALS_BN',
            'LOCALE_NUMERALS_EXT',
            'NAME',
            'OBJECT_ARRAY_ENTRIES_CTOR',
            'REGEXP_STRING_ITERATOR',
            'SHORT_LOCALES',
            'V8_SRC',
        ],
        attributes: { 'char-increment-restriction': null },
    },
    NODE_22:
    {
        inherits: 'NODE_20',
        versions: ['22.0-22.11|23.0-23.2'],
        includes: { ITERATOR_HELPER: true, OBJECT_ARRAY_ENTRIES_CTOR: false },
    },
    NODE_22_12:
    {
        inherits: 'NODE_22',
        versions: ['22.12-22.14|23.3-'],
        includes: { SHORT_LOCALES: false },
    },
    SAFARI_PRE_PREV:
    {
        description:    describeEngine('the previous to previous version of Safari'),
        aliasFor:       'SAFARI_17_4',
    },
    SAFARI_17_4:
    {
        families: ['Safari'],
        versions: ['17.4-17.6'],
        includes:
        [
            'ARRAY_ITERATOR',
            'ARROW',
            'AT',
            'BARPROP',
            'DOCUMENT',
            'ESC_HTML_QUOT',
            'FF_SRC',
            'FILL',
            'FLAT',
            'FROM_CODE_POINT',
            'FUNCTION_19_LF',
            'INCR_CHAR',
            'LOCALE_INFINITY',
            'LOCALE_NUMERALS_BN',
            'LOCALE_NUMERALS_EXT',
            'NAME',
            'OBJECT_ARRAY_ENTRIES_CTOR',
            'REGEXP_STRING_ITERATOR',
            'SHORT_LOCALES',
            'STATUS',
            'WINDOW',
        ],
        attributes:
        {
            'char-increment-restriction':       null,
            'non-ie-restriction':               null,
            'unstable':                         null,
            'web-worker-restriction':           null,
        },
    },
    SAFARI_18_0:
    {
        inherits: 'SAFARI_17_4',
        versions: ['18.0-18.3'],
        includes: { SHORT_LOCALES: false },
    },
    SAFARI_PREV:
    {
        description:    describeEngine('the previous to current version of Safari'),
        aliasFor:       'SAFARI_18_4',
    },
    SAFARI:
    {
        description:    describeEngine('the current stable version of Safari'),
        aliasFor:       'SAFARI_18_4',
    },
    SAFARI_18_4:
    {
        inherits:   'SAFARI_18_0',
        versions:   ['18.4-'],
        includes:
        { ITERATOR_HELPER: true, LOCALE_NUMERALS_BN: false, OBJECT_ARRAY_ENTRIES_CTOR: false },
    },
};
(function ()
{
    function formatEngineDescription(compatibilities)
    {
        var appendix = '';
        var parts =
        compatibilities.map
        (
            function (compatibility)
            {
                var family = compatibility.family;
                var versions = compatibility.versions;
                var part =
                versions.map
                (
                    function (version)
                    {
                        var versionText;
                        if (typeof version === 'string')
                            versionText = version;
                        else
                        {
                            var from    = version.from;
                            var to      = version.to;
                            if (to != null)
                                versionText = from + ' to ' + to;
                            else
                            {
                                versionText = from;
                                appendix = ' or later';
                            }
                        }
                        return family + ' ' + versionText;
                    }
                )
                .join(' and ');
                var tag = compatibility.tag;
                if (tag != null)
                    part += ' ' + tag;
                return part;
            }
        );
        var lastPart = parts.pop();
        var engine = (parts.length ? parts.join(', ') + ' and ' + lastPart : lastPart) + appendix;
        var description = describeEngine(engine);
        return description;
    }

    var autoIncludes =
    _Object_keys(featureInfos).filter
    (
        function (featureName)
        {
            var featureInfo = featureInfos[featureName];
            var check = featureInfo.check;
            var returnValue = check && check();
            return returnValue;
        }
    );
    featureInfos.AUTO =
    {
        description:    describeEngine('the current environment'),
        includes:       autoIncludes,
    };
    Feature = createFeatureClass(featureInfos, formatEngineDescription);
    ELEMENTARY = Feature.ELEMENTARY;
    featureInfos = null;
    assignNoEnum(Feature.prototype, { restrict: restrict });
    var ALL = Feature.ALL;
    var descriptor = { enumerable: true };
    for (var featureName in ALL)
    {
        var featureObj = ALL[featureName];
        descriptor.value = featureObj;
        _Object_defineProperty(Feature, featureName, descriptor);
    }
}
)();

export { Feature, featuresToMask };
