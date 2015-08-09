/* global Empty, assignNoEnum, document, self */

var Feature;

var featureFromMask;
var getFeatureMask;
var validateFeatureMask;
var validMaskFromArrayOrStringOrFeature;

(function ()
{
    'use strict';
    
    function areCompatible(features)
    {
        var compatible;
        if (features.length > 1)
        {
            var mask;
            features.forEach(
                function (arg)
                {
                    mask |= maskFromStringOrFeature(arg);
                }
            );
            compatible = isMaskCompatible(mask);
        }
        else
        {
            compatible = true;
        }
        return compatible;
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
    
    function completeFeature(name, ignoreExcludes)
    {
        var mask;
        var featureObj = ALL[name];
        if (featureObj)
        {
            mask = featureObj.mask;
        }
        else
        {
            var info = FEATURE_INFOS[name];
            if (typeof info === 'string')
            {
                mask = completeFeature(info, ignoreExcludes);
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
                        autoIncludes.push(name);
                    }
                    individualNames.push(name);
                }
                mask ^= 0;
                var includes = info.includes || (info.includes = []);
                includes.forEach(
                    function (include)
                    {
                        var includeMask = completeFeature(include);
                        mask |= includeMask;
                    }
                );
                var excludes = info.excludes;
                if (excludes && ignoreExcludes !== true)
                {
                    excludes.forEach(
                        function (exclude)
                        {
                            var excludeMask = completeFeature(exclude, true);
                            var incompatibleMask = mask | excludeMask;
                            incompatibleFeatureMasks.push(incompatibleMask);
                        }
                    );
                }
                featureObj = createFeature(name, info.description, mask, check);
            }
            registerFeature(name, featureObj);
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
    
    function isMaskCompatible(mask)
    {
        var result =
            incompatibleFeatureMasks.every(
                function (incompatibleFeatureMask)
                {
                    var result = (incompatibleFeatureMask & mask) !== incompatibleFeatureMask;
                    return result;
                }
            );
        return result;
    }
    
    function maskFromArrayOrStringOrFeature(arg)
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
        }
        else
        {
            mask = maskFromStringOrFeature(arg);
        }
        return mask;
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
            validateFeatureMask(mask);
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
    
    Feature =
        function Feature()
        {
            var mask = validMaskFromArguments(arguments);
            var featureObj = this instanceof Feature ? this : Object.create(Feature.prototype);
            featureObj.mask = mask;
            return featureObj;
        };
    
    assignNoEnum(Feature, { ALL: ALL, areCompatible: areCompatible });
    Object.defineProperties(
        Feature.prototype,
        {
            canonicalNames:
            {
                configurable: true,
                get: function ()
                {
                    var featureNameSet = new Empty();
                    var includes = [];
                    var mask = this.mask;
                    individualNames.forEach(
                        function (name)
                        {
                            var featureObj = ALL[name];
                            var otherMask = featureObj.mask;
                            var included = (otherMask & mask) === otherMask;
                            if (included)
                            {
                                var info = FEATURE_INFOS[name];
                                featureNameSet[name] = null;
                                Array.prototype.push.apply(includes, info.includes);
                            }
                        }
                    );
                    includes.forEach(
                        function (name)
                        {
                            delete featureNameSet[name];
                        }
                    );
                    var names = Object.keys(featureNameSet).sort();
                    return names;
                }
            },
            includes:
            {
                configurable: true,
                value: function ()
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
                }
            },
            individualNames:
            {
                configurable: true,
                get: function ()
                {
                    var names = [];
                    var mask = this.mask;
                    individuals.forEach(
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
                }
            }
        }
    );
    
    featureFromMask =
        function (mask)
        {
            var featureObj = Object.create(Feature.prototype, { mask: { value: mask } });
            return featureObj;
        };
    
    getFeatureMask =
        function (features)
        {
            var mask = features !== undefined ? maskFromArrayOrStringOrFeature(features) : 0;
            return mask;
        };
    
    validateFeatureMask =
        function (mask)
        {
            if (!isMaskCompatible(mask))
            {
                throw new ReferenceError('Incompatible features');
            }
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
                    validateFeatureMask(mask);
                }
            }
            else
            {
                mask = maskFromStringOrFeature(arg);
            }
            return mask;
        };
    
    // Assign a bit mask to each checkable feature
    
    var autoIncludes = [];
    var autoMask = 0;
    var bitIndex = 0;
    var features = Object.keys(FEATURE_INFOS);
    var incompatibleFeatureMasks = [];
    var individualNames = [];
    features.forEach(completeFeature);
    var individuals =
        individualNames.sort().map(
            function (name)
            {
                return ALL[name];
            }
        );
    
    var autoFeatureObj =
        createFeature('AUTO', 'All features available in the current engine.', autoMask);
    registerFeature('AUTO', autoFeatureObj);
}
)();
