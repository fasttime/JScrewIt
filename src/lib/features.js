/*
global
Audio,
Empty,
Node,
assignNoEnum,
console,
create,
defineProperty,
document,
history,
isArray,
keys,
maskAnd,
maskAreEqual,
maskIncludes,
maskNew,
maskOr,
maskUnion,
self,
statusbar
*/

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
                        result = maskAreEqual(otherMask, mask);
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
            var mask = [~0, ~0];
            Array.prototype.forEach.call(
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
                featureObj =
                    createFeature(name, info.description, mask, check, info.attributes);
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
    
    function createFeature(name, description, mask, check, attributes)
    {
        var featureObj =
            create(
                Feature.prototype,
                {
                    attributes: { value: Object.freeze(attributes || { }) },
                    check: { value: check },
                    description: { value: description },
                    mask: { value: Object.freeze(mask) },
                    name: { value: name }
                }
            );
        return featureObj;
    }
    
    function initMask(featureObj, mask)
    {
        defineProperty(featureObj, 'mask', { value: Object.freeze(mask) });
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
        var mask = maskNew();
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
                            var otherMask = maskFromStringOrFeature(arg);
                            maskOr(mask, otherMask);
                        }
                    );
                    validationNeeded |= arg.length > 1;
                }
                else
                {
                    var otherMask = maskFromStringOrFeature(arg);
                    maskOr(mask, otherMask);
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
            },
            attributes: { 'web-worker': 'no-atob-in-web-worker' }
        },
        BARPROP:
        {
            description:
                'Existence of the global object property statusbar having the string ' +
                'representation "[object BarProp]"',
            check: function ()
            {
                return typeof statusbar === 'object' && statusbar + '' === '[object BarProp]';
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
                'Existence of the global object property console having the string ' +
                'representation "[object Console]".\n' +
                'This feature may become unavailable when Firebug or Firebug Lite is open and ' +
                'the console panel is enabled.',
            check: function ()
            {
                return typeof console === 'object' && console + '' === '[object Console]';
            },
            attributes: { 'web-worker': 'no-console-in-web-worker' }
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
        HTMLAUDIOELEMENT:
        {
            description:
                'Existence of the global object property Audio whose string representation ' +
                'starts with "function HTMLAudioElement".',
            check: function ()
            {
                return typeof Audio !== 'undefined' && /^function HTMLAudioElement/.test(Audio);
            },
            includes: ['NO_IE_SRC'],
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
        NODECONSTRUCTOR:
        {
            description:
                'Existence of the global object property Node having the string representation ' +
                '"[object NodeConstructor]".',
            check: function ()
            {
                return typeof Node !== 'undefined' && Node + '' === '[object NodeConstructor]';
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
                return (Function() + '')[22] === '\n';
            }
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
                'CONSOLE',
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
            attributes:
            {
                'no-atob-in-web-worker': null,
                'no-console-in-web-worker': null,
                'safari-bug-21820506': null,
                'web-worker-restriction': null
            }
        },
        ANDRO400:
        {
            description: 'Features available in Android Browser 4.0 to 4.3.1.',
            includes:
            [
                'ATOB',
                'CONSOLE',
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
                'CONSOLE',
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
                'CONSOLE',
                'ESC_HTML_ALL',
                'GMT',
                'HISTORY',
                'HTMLAUDIOELEMENT',
                'HTMLDOCUMENT',
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
        CHROME: 'CHROME45',
        CHROME45:
        {
            description: 'Features available in Chrome 45 and Opera 32 or later.',
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
                'HTMLAUDIOELEMENT',
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
            attributes: { 'no-console-in-web-worker': null, 'web-worker-restriction': null }
        },
        EDGE:
        {
            description: 'Features available in Microsoft Edge.',
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
                'CONSOLE',
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
                'CONSOLE',
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
                'CONSOLE',
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
                'CONSOLE',
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
            description: 'Features available in Safari 7.0 or later.',
            includes:
            [
                'ATOB',
                'BARPROP',
                'CONSOLE',
                'ESC_HTML_QUOT_ONLY',
                'FF_SAFARI_SRC',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'NAME',
                'NODECONSTRUCTOR',
                'UNDEFINED',
                'WINDOW'
            ],
            attributes:
            {
                'no-atob-in-web-worker': null,
                'no-console-in-web-worker': null,
                'web-worker-restriction': null
            }
        },
        SAFARI71:
        {
            description: 'Features available in Safari 7.1 or later.',
            includes:
            [
                'ARRAY_ITERATOR',
                'ATOB',
                'BARPROP',
                'CONSOLE',
                'ESC_HTML_QUOT_ONLY',
                'FF_SAFARI_SRC',
                'FILL',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'NAME',
                'NODECONSTRUCTOR',
                'UNDEFINED',
                'WINDOW'
            ],
            attributes:
            {
                'no-atob-in-web-worker': null,
                'safari-bug-21820506': null,
                'web-worker-restriction': null
            }
        },
        SAFARI80: 'SAFARI71',
        SAFARI90:
        {
            description: 'Features available in Safari 9.0 or later.',
            includes:
            [
                'ATOB',
                'BARPROP',
                'CONSOLE',
                'ESC_HTML_QUOT_ONLY',
                'FF_SAFARI_SRC',
                'FILL',
                'FROM_CODE_POINT',
                'GMT',
                'HISTORY',
                'HTMLDOCUMENT',
                'NAME',
                'NODECONSTRUCTOR',
                'NO_OLD_SAFARI_ARRAY_ITERATOR',
                'NO_OLD_SAFARI_LF',
                'UNDEFINED',
                'WINDOW'
            ],
            attributes:
            {
                'no-atob-in-web-worker': null,
                'safari-bug-21820506': null,
                'web-worker-restriction': null
            }
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
                    var included = maskIncludes(mask, featureObj.mask);
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
                Array.prototype.every.call(
                    arguments,
                    function (arg)
                    {
                        var otherMask = validMaskFromArrayOrStringOrFeature(arg);
                        var included = maskIncludes(mask, otherMask);
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
                        var result = !maskIncludes(mask, incompatibleMask);
                        return result;
                    }
                );
            return result;
        };
    
    maskFromArray =
        function (features)
        {
            var mask = maskNew();
            features.forEach(
                function (arg)
                {
                    var otherMask = maskFromStringOrFeature(arg);
                    maskOr(mask, otherMask);
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
                mask = maskNew();
                arg.forEach(
                    function (arg)
                    {
                        var otherMask = maskFromStringOrFeature(arg);
                        maskOr(mask, otherMask);
                    }
                );
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
    
    var featureNames = keys(FEATURE_INFOS);
    featureNames.forEach(completeFeature);
    elementaryFeatureObjs.sort();
    var autoFeatureObj =
        createFeature('AUTO', 'All features available in the current engine.', autoMask);
    registerFeature('AUTO', autoFeatureObj);
}
)();
