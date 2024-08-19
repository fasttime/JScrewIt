/* global global, self */

'use strict';

(function (global)
{
    function callAdapters(adapterList, thisValue, args)
    {
        var returnValue;
        for (var index = adapterList.length; index-- > 0;)
        {
            var adapter = adapterList[index];
            returnValue = adapter.apply(thisValue, args);
            if (returnValue !== undefined)
                return returnValue;
        }
        var fn = adapterList.function;
        returnValue = fn.apply(thisValue, args);
        return returnValue;
    }

    function createDefaultInterceptorDescriptor(adapterList)
    {
        function value()
        {
            var returnValue = callAdapters(adapterList, this, arguments);
            return returnValue;
        }

        var descriptor = { value: value, writable: true };
        return descriptor;
    }

    function createStaticSupplier(value)
    {
        function supplier()
        {
            return value;
        }

        return supplier;
    }

    function createToStringDescriptor(adapterList)
    {
        function get()
        {
            var returnValue = this === global ? toString : toStringNoGlobal;
            return returnValue;
        }

        function toString()
        {
            var str = callAdapters(adapterList, this, arguments);
            return str;
        }

        function toStringNoGlobal()
        {
            // Some old browsers set the global object instead of undefined as this.
            var thisValue = this === global ? undefined : this;
            var str = callAdapters(adapterList, thisValue, arguments);
            return str;
        }

        var descriptor = { get: get };
        return descriptor;
    }

    function emuDo(emuFeatures, callback)
    {
        // In Android Browser, some objects without a prototype don't work well with arbitrary
        // property names; objects with an empty prototype are fine.
        var context = Object.create(Object.create(null));
        try
        {
            emuFeatures.forEach
            (
                function (featureName)
                {
                    EMU_FEATURE_INFOS[featureName].call(context);
                }
            );
            var result = callback();
            return result;
        }
        finally
        {
            var backupList = context.BACKUP;
            if (backupList)
                restoreAll(backupList);
        }
    }

    function emuEval(emuFeatures, jsFuck)
    {
        var result =
        emuDo
        (
            emuFeatures,
            function ()
            {
                return evalJSFuck(jsFuck);
            }
        );
        return result;
    }

    function evalJSFuck(jsFuck)
    {
        var body = 'return ' + String(jsFuck);
        var result = Function(body)();
        return result;
    }

    function formatLocaleNumeral(number, charCode0, groupLength, separator, dotReplacement)
    {
        var parts = String(number).match(/(-?)(\d*)(\.?)(.*)/);
        parts.shift();
        var int = rebaseDigits(parts[1], charCode0);
        var regExp;
        switch (groupLength)
        {
        case 2:
            regExp = /(?=(..)+.$)/g;
            break;
        case 3:
            regExp = /(?=(...)+$)/g;
            break;
        }
        if (regExp)
        {
            var replacement = (separator || ',') + '$&';
            int = int.replace(regExp, replacement);
        }
        parts[1] = int;
        if (dotReplacement)
            parts[2] = parts[2] && dotReplacement;
        parts[3] = rebaseDigits(parts[3], charCode0);
        var returnValue = parts.join('');
        return returnValue;
    }

    function fromCodePoint()
    {
        var codeUnits = [];
        Array.prototype.forEach.call
        (
            arguments,
            function (arg)
            {
                var codePoint = +arg;
                if ((codePoint & 0x1fffff) !== codePoint || codePoint > 0x10ffff)
                    throw new RangeError(codePoint + ' is not a valid code point');
                if (codePoint <= 0xffff)
                    codeUnits.push(codePoint);
                else
                {
                    var highSurrogate = (codePoint - 0x10000 >> 10) + 0xd800;
                    var lowSurrogate = (codePoint & 0x3ff) + 0xdc00;
                    codeUnits.push(highSurrogate, lowSurrogate);
                }
            }
        );
        var result = String.fromCharCode.apply(null, codeUnits);
        return result;
    }

    function intercept(context, interceptor, adapter)
    {
        var adapterListMap =
        context.ADAPTERS || (context.ADAPTERS = Object.create(Object.create(null)));
        var path = interceptor.path;
        var adapterList = adapterListMap[path];
        if (!adapterList)
        {
            var createDescriptor = interceptor.createDescriptor;
            adapterList = [];
            adapterListMap[path] = adapterList;
            var newDescriptor = createDescriptor(adapterList, context);
            var oldDescriptor = override(context, path, newDescriptor);
            adapterList.function = oldDescriptor.value;
        }
        adapterList.push(adapter);
    }

    function makeEmuFeatureArrayPrototypeFunction(name, fn)
    {
        var setUp =
        function ()
        {
            fn.toString =
            function ()
            {
                var str = String(Array.prototype.join).replace(/\bjoin\b/, name);
                return str;
            };
            override(this, 'Array.prototype.' + name, { value: fn });
        };
        return setUp;
    }

    function makeEmuFeatureDocument(str, regExp)
    {
        var setUp =
        function ()
        {
            var document = global.document;
            if (document)
            {
                if (regExp.test(document))
                    return;
            }
            else
            {
                var createElement =
                function (tagName)
                {
                    var elementStr =
                    String(tagName).toLowerCase() === 'video' ?
                    '[object HTMLVideoElement]' : '[object HTMLUnknownElement]';
                    return elementStr;
                };
                document = { createElement: createElement, nodeName: '#document' };
                override(this, 'document', { value: document });
            }
            var valueOf = createStaticSupplier(str);
            override(this, 'document.valueOf', { value: valueOf });
        };
        return setUp;
    }

    function makeEmuFeatureEscHtml(replacer, regExp)
    {
        var setUp =
        makeEmuFeatureHtml
        (
            ['anchor', 'fontcolor', 'fontsize', 'link'],
            function (method)
            {
                function adaptedMethod(value)
                {
                    var str = method.call(this, '');
                    value = replacer(String(value));
                    var index = str.lastIndexOf('"');
                    str = str.slice(0, index) + value + str.slice(index);
                    return str;
                }

                return adaptedMethod;
            },
            regExp
        );
        return setUp;
    }

    function makeEmuFeatureEscRegExp(char, escSeq)
    {
        var setUp =
        function ()
        {
            if ((RegExp(char) + '')[1] !== '\\')
            {
                var newRegExp =
                (function (oldRegExp)
                {
                    function RegExp(pattern, flags)
                    {
                        if (pattern !== undefined)
                            pattern = String(pattern).replace(charRegExp, escSeq);
                        var obj = oldRegExp(pattern, flags);
                        return obj;
                    }

                    var charRegExp = oldRegExp(char, 'g');
                    RegExp.prototype = oldRegExp.prototype;
                    return RegExp;
                }
                )(RegExp);
                override(this, 'RegExp.prototype.constructor', { value: newRegExp });
                override(this, 'RegExp', { value: newRegExp });
            }
        };
        return setUp;
    }

    function makeEmuFeatureFunctionLF(replacement)
    {
        var setUp =
        function ()
        {
            var context = this;
            registerFunctionToStringAdapter
            (
                this,
                function ()
                {
                    var fn = context.ADAPTERS['Function.prototype.toString'].function;
                    var str = fn.call(this);
                    if (/function anonymous\(\n?\) {\s+}/.test(str))
                        return replacement;
                }
            );
        };
        return setUp;
    }

    function makeEmuFeatureHtml(methodNames, adapter, regExp)
    {
        var setUp =
        function ()
        {
            var prototype = String.prototype;
            methodNames.forEach
            (
                function (methodName)
                {
                    var method = prototype[methodName];
                    if (regExp && regExp.test(''[methodName]('"<>')))
                        return;
                    var adaptedMethod = adapter(method);
                    override(this, 'String.prototype.' + methodName, { value: adaptedMethod });
                },
                this
            );
        };
        return setUp;
    }

    function makeEmuFeatureMatchAll()
    {
        var str = '[object RegExp String Iterator]';
        var setUp =
        function ()
        {
            if (String.prototype.matchAll && ''.matchAll() + '' === str)
                return;
            registerObjectFactory(this, 'String.prototype.matchAll', str, Object.prototype);
        };
        return setUp;
    }

    function makeEmuFeatureNativeFunctionSource()
    {
        var args = Array.prototype.slice.call(arguments);
        var setUp =
        function ()
        {
            var nativeFunctionSourceInfos = this.nativeFunctionSourceInfos;
            if (nativeFunctionSourceInfos)
            {
                this.nativeFunctionSourceInfos =
                nativeFunctionSourceInfos.filter
                (
                    function (nativeFunctionSourceInfo)
                    {
                        var keep = args.indexOf(nativeFunctionSourceInfo) >= 0;
                        return keep;
                    }
                );
            }
            else
            {
                this.nativeFunctionSourceInfos = args;
                var context = this;
                var adapter =
                function ()
                {
                    var fn = context.ADAPTERS['Function.prototype.toString'].function;
                    var str = fn.call(this);
                    var match = /^\n?(function \w+\(\) \{)\s+\[native code]\s+}\n?$/.exec(str);
                    if (match)
                    {
                        var nativeFunctionSourceInfo = context.nativeFunctionSourceInfos[0];
                        var body = nativeFunctionSourceInfo.body;
                        var delimiter = nativeFunctionSourceInfo.delimiter;
                        str = delimiter + match[1] + body + '}' + delimiter;
                        return str;
                    }
                };
                registerFunctionToStringAdapter(this, adapter);
            }
        };
        return setUp;
    }

    function makeEmuFeatureSelf(str, regExp)
    {
        var setUp =
        function ()
        {
            if (global.self)
            {
                if (regExp.test(self + ''))
                    return;
            }
            else
                override(this, 'self', { value: { } });
            var valueOf = createStaticSupplier(str);
            override(this, 'self.valueOf', { value: valueOf });
        };
        return setUp;
    }

    function mockLocation(context)
    {
        var location = global.location;
        if (!location)
        {
            location = { constructor: { } };
            override(context, 'location', { value: location });
        }
        return location;
    }

    function override(context, path, descriptor)
    {
        var backupList = context.BACKUP || (context.BACKUP = []);
        var components = path.split('.');
        var name = components.pop();
        var obj =
        components.reduce
        (
            function (parent, childName)
            {
                return parent[childName];
            },
            global
        );
        var oldDescriptor = Object.getOwnPropertyDescriptor(obj, name);
        var backupData = { obj: obj, name: name, descriptor: oldDescriptor };
        backupList.push(backupData);
        if (descriptor)
        {
            descriptor.configurable = true;
            Object.defineProperty(obj, name, descriptor);
        }
        else
            delete obj[name];
        return oldDescriptor;
    }

    function patchGlobalToString(context)
    {
        registerFunctionAdapter
        (
            context,
            function (body)
            {
                if (arguments.length !== 1)
                    return;
                if (typeof body === 'string')
                {
                    body =
                    body.replace(/^return toString\b/, 'return Object.prototype.toString');
                    var fn = context.ADAPTERS.Function.function;
                    var fnObj = fn(body);
                    return fnObj;
                }
            }
        );
    }

    function rebaseDigits(digits, charCode0)
    {
        var returnValue =
        digits.replace
        (
            /\d/g,
            function (digit)
            {
                var charCode = +digit + charCode0;
                var char = String.fromCharCode(charCode);
                return char;
            }
        );
        return returnValue;
    }

    function registerDefaultToStringAdapter(context, value, str)
    {
        var adapter =
        function ()
        {
            if (this === value)
                return str;
        };
        intercept(context, OBJECT_TO_STRING_INTERCEPTOR, adapter);
        if (isArrayToStringGeneric)
            intercept(context, ARRAY_TO_STRING_INTERCEPTOR, adapter);
    }

    function registerFunctionAdapter(context, adapter)
    {
        intercept(context, FUNCTION_INTERCEPTOR, adapter);
    }

    function registerFunctionToStringAdapter(context, adapter)
    {
        intercept(context, FUNCTION_TO_STRING_INTERCEPTOR, adapter);
    }

    function registerNumberToLocaleStringAdapter(context, adapter)
    {
        intercept(context, NUMBER_TO_LOCALE_STRING_INTERCEPTOR, adapter);
    }

    function registerObjectFactory(context, path, str, prototype)
    {
        var obj = Object.create(prototype);
        var factory = createStaticSupplier(obj);
        override(context, path, { value: factory });
        registerDefaultToStringAdapter(context, obj, str);
    }

    function replaceArrowFunctions(expr)
    {
        expr =
        expr.replace
        (
            ARROW_REGEXP,
            function (match, capture1, capture2)
            {
                var replacement1 = /^\([\S\s]*\)$/.test(capture1) ? capture1 : '(' + capture1 + ')';
                var innerExpr = replaceArrowFunctions(capture2);
                var replacement2 =
                /^\{[\s\S]*\}$/.test(capture2) ? innerExpr : '{return(' + innerExpr + ')}';
                var replacement = '(function' + replacement1 + replacement2 + ')';
                return replacement;
            }
        );
        return expr;
    }

    function replaceAsyncFunctions(expr)
    {
        if (expr === 'return async function(){}')
            return 'return function(){return"[object Promise]"}';
        return expr;
    }

    function restoreAll(backupList)
    {
        var backupData;
        while (backupData = backupList.pop())
        {
            var obj = backupData.obj;
            var name = backupData.name;
            var descriptor = backupData.descriptor;
            if (descriptor)
                Object.defineProperty(obj, name, descriptor);
            else
                delete obj[name];
        }
    }

    var ARRAY_TO_STRING_INTERCEPTOR =
    { path: 'Array.prototype.toString', createDescriptor: createToStringDescriptor };

    var FUNCTION_INTERCEPTOR =
    {
        path: 'Function',
        createDescriptor:
        function (adapterList, context)
        {
            function Function()
            {
                var fn = callAdapters(adapterList, this, arguments);
                return fn;
            }

            Function.prototype = global.Function.prototype;
            var descriptor = { value: Function, writable: true };
            override(context, 'Function.prototype.constructor', descriptor);
            return descriptor;
        },
    };

    var FUNCTION_TO_STRING_INTERCEPTOR =
    {
        path:               'Function.prototype.toString',
        createDescriptor:   createDefaultInterceptorDescriptor,
    };

    var NUMBER_TO_LOCALE_STRING_INTERCEPTOR =
    {
        path:               'Number.prototype.toLocaleString',
        createDescriptor:   createDefaultInterceptorDescriptor,
    };

    var OBJECT_TO_STRING_INTERCEPTOR =
    { path: 'Object.prototype.toString', createDescriptor: createToStringDescriptor };

    var ARROW_REGEXP =
    /(\([^(]*\)|[\w$]+)=>(\{.*?\}|(?:\((?:[^()]|\((?:[^()]|\([^()]*\))*\))*\)|[^,()])*)/g;

    var NATIVE_FUNCTION_SOURCE_INFO_FF = { body: '\n    [native code]\n',    delimiter: ''   };
    var NATIVE_FUNCTION_SOURCE_INFO_IE = { body: '\n    [native code]\n',    delimiter: '\n' };
    var NATIVE_FUNCTION_SOURCE_INFO_V8 = { body: ' [native code] ',          delimiter: ''   };

    var EMU_FEATURE_INFOS =
    {
        ANY_DOCUMENT:
        makeEmuFeatureDocument('[object Document]', /^\[object [\S\s]*Document]$/),
        ANY_WINDOW:             makeEmuFeatureSelf('[object Window]', /^\[object [\S\s]*Window]$/),
        ARRAY_ITERATOR:
        function ()
        {
            if (Array.prototype.entries)
            {
                var arrayIterator = [].entries();
                if (/^\[object Array[\S\s]{8,9}]$/.test(arrayIterator))
                    return;
            }
            var prototype =
            arrayIterator ? Object.getPrototypeOf(arrayIterator) : function () { }.prototype;
            registerObjectFactory
            (this, 'Array.prototype.entries', '[object ArrayIterator]', prototype);
        },
        ARROW:
        function ()
        {
            var context = this;
            registerFunctionAdapter
            (
                this,
                function ()
                {
                    var bodyIndex = arguments.length - 1;
                    if (bodyIndex < 0)
                        return;
                    var oldBody = arguments[bodyIndex];
                    if (typeof oldBody !== 'string')
                        return;
                    var newBody = replaceArrowFunctions(oldBody);
                    if (newBody === oldBody)
                        return;
                    var fn = context.ADAPTERS.Function.function;
                    arguments[bodyIndex] = newBody;
                    var fnObj = fn.apply(this, arguments);
                    return fnObj;
                }
            );
        },
        ASYNC_FUNCTION:
        function ()
        {
            var context = this;
            registerFunctionAdapter
            (
                this,
                function ()
                {
                    var bodyIndex = arguments.length - 1;
                    if (bodyIndex < 0)
                        return;
                    var oldBody = arguments[bodyIndex];
                    if (typeof oldBody !== 'string')
                        return;
                    var newBody = replaceAsyncFunctions(oldBody);
                    if (newBody === oldBody)
                        return;
                    var fn = context.ADAPTERS.Function.function;
                    arguments[bodyIndex] = newBody;
                    var fnObj = fn.apply(this, arguments);
                    return fnObj;
                }
            );
        },
        AT:
        function ()
        {
            var name = 'at';
            var fn =
            function (index)
            {
                index |= 0;
                if (index < 0)
                    index += this.length;
                var element = this[index];
                return element;
            };
            fn.toString =
            function ()
            {
                var str = String(Array.prototype.join).replace(/\bjoin\b/, name);
                return str;
            };
            var descriptor = { value: fn };
            override(this, 'Array.prototype.' + name, descriptor);
            override(this, 'String.prototype.' + name, descriptor);
        },
        ATOB:
        function ()
        {
            var BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

            function btoa(input)
            {
                var output = '';
                input = String(input);
                for (var index = 0; index < input.length;)
                {
                    var chr1 = input.charCodeAt(index++);
                    var enc1 = chr1 >> 2;
                    var chr2 = input.charCodeAt(index++);
                    var enc2 = (chr1 & 3) << 4 | chr2 >> 4;
                    var enc3;
                    var enc4;
                    if (isNaN(chr2))
                        enc3 = enc4 = 64;
                    else
                    {
                        var chr3 = input.charCodeAt(index++);
                        enc3 = (chr2 & 15) << 2 | chr3 >> 6;
                        if (isNaN(chr3))
                            enc4 = 64;
                        else
                            enc4 = chr3 & 63;
                    }
                    output +=
                    BASE64_CHARS.charAt(enc1) + BASE64_CHARS.charAt(enc2) +
                    BASE64_CHARS.charAt(enc3) + BASE64_CHARS.charAt(enc4);
                }
                return output;
            }

            function atob(input)
            {
                var output = '';
                input = String(input);
                for (var index = 0; index < input.length;)
                {
                    var enc1 = BASE64_CHARS.indexOf(input.charAt(index++));
                    var enc2 = BASE64_CHARS.indexOf(input.charAt(index++));
                    var chr1 = enc1 << 2 | enc2 >> 4;
                    output += String.fromCharCode(chr1);
                    var pos3 = input.charAt(index++);
                    var enc3 = BASE64_CHARS.indexOf(pos3);
                    if (!pos3 || enc3 === 64)
                        break;
                    var chr2 = (enc2 & 15) << 4 | enc3 >> 2;
                    output += String.fromCharCode(chr2);
                    var pos4 = input.charAt(index++);
                    var enc4 = BASE64_CHARS.indexOf(pos4);
                    if (!pos4 || enc4 === 64)
                        break;
                    var chr3 = (enc3 & 3) << 6 | enc4;
                    output += String.fromCharCode(chr3);
                }
                return output;
            }

            override(this, 'atob', { value: atob });
            override(this, 'btoa', { value: btoa });
        },
        BARPROP:
        function ()
        {
            var toString =
            function ()
            {
                return '[object BarProp]';
            };
            // In Android Browser versions prior to 4.4, Object.defineProperty doesn't replace
            // the statusbar correctly despite the configurable attribute set.
            // As a workaround, we'll simply set a custom toString function.
            if (global.statusbar)
                override(this, 'statusbar.toString', { value: toString });
            else
                override(this, 'statusbar', { value: { toString: toString } });
        },
        CAPITAL_HTML:
        makeEmuFeatureHtml
        (
            [
                'anchor',
                'big',
                'blink',
                'bold',
                'fixed',
                'fontcolor',
                'fontsize',
                'italics',
                'link',
                'small',
                'strike',
                'sub',
                'sup',
            ],
            function (method)
            {
                function adaptedMethod()
                {
                    var str =
                    method.apply(this, arguments).replace
                    (
                        /^<[\w ]+|[\w ]+>$/g,
                        function (match)
                        {
                            return match.toUpperCase();
                        }
                    );
                    return str;
                }

                return adaptedMethod;
            }
        ),
        CONSOLE:
        function ()
        {
            // Workaround for Internet Explorer 9...
            var console = global.console;
            if (!console || !Object.getPrototypeOf(console))
                override(this, 'console', { value: Object.create(console || null) });
            // ...end of the workaround.
            var toString = createStaticSupplier('[object Console]');
            override(this, 'console.toString', { value: toString });
        },
        DOCUMENT:               makeEmuFeatureDocument('[object Document]', /^\[object Document]$/),
        DOMWINDOW:              makeEmuFeatureSelf('[object DOMWindow]', /^\[object DOMWindow]$/),
        ESC_HTML_ALL:
        makeEmuFeatureEscHtml
        (
            function (str)
            {
                str = str.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                return str;
            },
            /&quot;&lt;&gt;/
        ),
        ESC_HTML_QUOT:
        makeEmuFeatureEscHtml
        (
            function (str)
            {
                str = str.replace(/"/g, '&quot;');
                return str;
            },
            /&quot;/
        ),
        ESC_HTML_QUOT_ONLY:
        makeEmuFeatureEscHtml
        (
            function (str)
            {
                str = str.replace(/"/g, '&quot;');
                return str;
            },
            /&quot;<>/
        ),
        ESC_REGEXP_LF:          makeEmuFeatureEscRegExp('\n', '\\n'),
        ESC_REGEXP_SLASH:       makeEmuFeatureEscRegExp('/', '\\/'),
        FF_SRC:                 makeEmuFeatureNativeFunctionSource(NATIVE_FUNCTION_SOURCE_INFO_FF),
        FILL:                   makeEmuFeatureArrayPrototypeFunction('fill', Function()),
        FLAT:
        makeEmuFeatureArrayPrototypeFunction
        (
            'flat',
            function ()
            {
                var array = [];
                Array.prototype.forEach.call
                (
                    this,
                    function (element)
                    {
                        array = array.concat(element);
                    }
                );
                return array;
            }
        ),
        FROM_CODE_POINT:
        function ()
        {
            override(this, 'String.fromCodePoint', { value: fromCodePoint });
        },
        FUNCTION_19_LF:         makeEmuFeatureFunctionLF('function anonymous(\n) {\n\n}'),
        FUNCTION_22_LF:         makeEmuFeatureFunctionLF('function anonymous() {\n\n}'),
        GENERIC_ARRAY_TO_STRING:
        function ()
        {
            if (isArrayToStringGeneric)
                return;
            var originalFn = Array.prototype.toString;
            var toString =
            function ()
            {
                var fn = Array.isArray(this) ? originalFn : Object.prototype.toString;
                var str = fn.apply(this, arguments);
                return str;
            };
            override(this, 'Array.prototype.toString', { value: toString });
        },
        GLOBAL_UNDEFINED:
        function ()
        {
            if (Object.prototype.toString.call() !== '[object Undefined]')
                registerDefaultToStringAdapter(this, undefined, '[object Undefined]');
            patchGlobalToString(this);
        },
        GMT:
        function ()
        {
            var Date = createStaticSupplier('Xxx Xxx 00 0000 00:00:00 GMT+0000 (XXX)');
            override(this, 'Date', { value: Date });
        },
        HISTORY:
        function ()
        {
            var toString = createStaticSupplier('[object History]');
            override(this, 'history', { value: { toString: toString } });
        },
        HTMLAUDIOELEMENT:
        function ()
        {
            if (!global.Audio)
                override(this, 'Audio', { value: { } });
            var toString = createStaticSupplier('function HTMLAudioElement');
            override(this, 'Audio.toString', { value: toString });
        },
        IE_SRC:                 makeEmuFeatureNativeFunctionSource(NATIVE_FUNCTION_SOURCE_INFO_IE),
        INTL:
        function ()
        {
            if (!global.Intl)
                override(this, 'Intl', { value: { } });
        },
        ITERATOR_HELPER:
        function ()
        {
            if (global.Iterator)
                return;
            var Iterator = function () { };
            var arrayIterator;
            if (Array.prototype.entries)
            {
                arrayIterator = [].entries();
                Iterator.prototype = Object.getPrototypeOf(arrayIterator);
            }
            else
            {
                arrayIterator = new Iterator();
                var entries = createStaticSupplier(arrayIterator);
                override(this, 'Array.prototype.entries', { value: entries });
            }
            override(this, 'Iterator', { value: Iterator });
            var filter = createStaticSupplier('[object Iterator Helper]');
            override(this, 'Iterator.prototype.filter', { value: filter });
        },
        JAPANESE_INFINITY:
        function ()
        {
            registerNumberToLocaleStringAdapter
            (
                this,
                function (locale)
                {
                    if (locale === 'ja')
                    {
                        switch (+this) // In Internet Explorer 9, +this is different from this.
                        {
                        case Infinity:
                            return '+∞';
                        case -Infinity:
                            return '-∞';
                        }
                    }
                }
            );
        },
        LOCALE_INFINITY:
        function ()
        {
            registerNumberToLocaleStringAdapter
            (
                this,
                function ()
                {
                    switch (+this) // In Internet Explorer 9, +this is different from this.
                    {
                    case Infinity:
                        return '∞';
                    case -Infinity:
                        return '-∞';
                    }
                }
            );
        },
        LOCALE_NUMERALS:
        function ()
        {
            var context = this;
            registerNumberToLocaleStringAdapter
            (
                this,
                function (locale)
                {
                    var returnValue;
                    var number;
                    switch (locale)
                    {
                    case 'ar':
                        number = Number(this);
                        if (isNaN(number))
                            returnValue = context.arabicNaNString || 'ليس';
                        else if (context.shortLocales)
                        {
                            returnValue =
                            formatLocaleNumeral(number, 0x0660, undefined, undefined, '٫');
                        }
                        break;
                    case 'ar-td':
                        number = Number(this);
                        if (isNaN(number))
                            returnValue = context.arabicNaNString || 'ليس';
                        else
                        {
                            returnValue =
                            formatLocaleNumeral(number, 0x0660, undefined, undefined, '٫');
                        }
                        break;
                    case 'fa':
                        number = Number(this);
                        if (!isNaN(number))
                            returnValue = formatLocaleNumeral(number, 0x06f0, 3, '٬');
                        break;
                    }
                    return returnValue;
                }
            );
        },
        LOCALE_NUMERALS_IE11_WIN7:
        function ()
        {
            this.arabicNaNString = 'ليس\xa0برقم';
            registerNumberToLocaleStringAdapter
            (
                this,
                function (locale)
                {
                    var returnValue;
                    switch (locale)
                    {
                    case 'lv':
                        switch (+this) // In Internet Explorer 9, +this is different from this.
                        {
                        case Infinity:
                            return 'bezgalība';
                        case -Infinity:
                            return '-bezgalība';
                        }
                        break;
                    case 'ru':
                        switch (+this) // In Internet Explorer 9, +this is different from this.
                        {
                        case Infinity:
                            return 'бесконечность';
                        case -Infinity:
                            return '-бесконечность';
                        }
                        break;
                    }
                    return returnValue;
                }
            );
        },
        LOCALE_NUMERALS_IE11_WIN7_8:
        function ()
        {
            this.arabicNaNString = 'ليس\xa0برقم';
            registerNumberToLocaleStringAdapter
            (
                this,
                function (locale)
                {
                    var returnValue;
                    var number;
                    switch (locale)
                    {
                    case 'ar':
                    case 'ar-td':
                        number = Number(this);
                        if (isNaN(number))
                            returnValue = 'ليس\xa0برقم';
                        else
                        {
                            switch (+this) // In Internet Explorer 9, +this is different from this.
                            {
                            case Infinity:
                                return '+لا\xa0نهاية';
                            case -Infinity:
                                return '-لا\xa0نهاية';
                            }
                        }
                        break;
                    case 'cz':
                        number = Number(this);
                        if (isNaN(number))
                            returnValue = 'Není\xa0číslo';
                        break;
                    case 'el':
                        number = Number(this);
                        if (isNaN(number))
                            returnValue = 'μη\xa0αριθμός';
                        else
                        {
                            switch (+this) // In Internet Explorer 9, +this is different from this.
                            {
                            case Infinity:
                                return 'Άπειρο';
                            case -Infinity:
                                return '-Άπειρο';
                            }
                        }
                        break;
                    case 'he':
                        number = Number(this);
                        if (isNaN(number))
                            returnValue = 'לא\xa0מספר';
                        break;
                    case 'ja':
                        number = Number(this);
                        if (isNaN(number))
                            returnValue = 'NaN\xa0(非数値)';
                        else
                        {
                            switch (+this) // In Internet Explorer 9, +this is different from this.
                            {
                            case Infinity:
                                return '+∞';
                            case -Infinity:
                                return '-∞';
                            }
                        }
                        break;
                    case 'lt':
                        switch (+this) // In Internet Explorer 9, +this is different from this.
                        {
                        case Infinity:
                            return 'begalybė';
                        case -Infinity:
                            return '-begalybė';
                        }
                        break;
                    case 'pl':
                        switch (+this) // In Internet Explorer 9, +this is different from this.
                        {
                        case Infinity:
                            return '+nieskończoność';
                        case -Infinity:
                            return '-nieskończoność';
                        }
                        break;
                    case 'ru':
                        switch (+this) // In Internet Explorer 9, +this is different from this.
                        {
                        case Infinity:
                            return 'бесконечность';
                        case -Infinity:
                            return '-бесконечность';
                        }
                        break;
                    case 'zh':
                        switch (+this) // In Internet Explorer 9, +this is different from this.
                        {
                        case Infinity:
                            return '正无穷大';
                        case -Infinity:
                            return '负无穷大';
                        }
                        break;
                    case 'zh-cn':
                        number = Number(this);
                        if (isNaN(number))
                            returnValue = '非数字';
                        break;
                    }
                    return returnValue;
                }
            );
        },
        LOCALE_NUMERALS_IE11_WIN8:
        function ()
        {
            this.arabicNaNString = 'ليس\xa0برقم';
            registerNumberToLocaleStringAdapter
            (
                this,
                function (locale)
                {
                    var returnValue;
                    switch (locale)
                    {
                    case 'lv':
                        switch (+this) // In Internet Explorer 9, +this is different from this.
                        {
                        case Infinity:
                            return '∞';
                        case -Infinity:
                            return '-∞';
                        }
                        break;
                    case 'ru':
                        switch (+this) // In Internet Explorer 9, +this is different from this.
                        {
                        case Infinity:
                            return '∞';
                        case -Infinity:
                            return '-∞';
                        }
                        break;
                    }
                    return returnValue;
                }
            );
        },
        LOCALE_NUMERALS_EXT:
        function ()
        {
            this.arabicNaNString = 'ليس\xa0رقم';
            registerNumberToLocaleStringAdapter
            (
                this,
                function (locale)
                {
                    var returnValue;
                    var number;
                    switch (locale)
                    {
                    case 'ar':
                    case 'ar-td':
                        number = Number(this);
                        if (isNaN(number))
                            returnValue = 'ليس\xa0رقم';
                        break;
                    case 'bn':
                        number = Number(this);
                        if (!isNaN(number))
                            returnValue = formatLocaleNumeral(number, 0x09e6, 2);
                        break;
                    case 'fa':
                        number = Number(this);
                        if (isNaN(number))
                            returnValue = 'ناعدد';
                        break;
                    case 'ru':
                        number = Number(this);
                        if (isNaN(number))
                            returnValue = 'не\xa0число';
                        break;
                    }
                    return returnValue;
                }
            );
        },
        LOCATION:
        function ()
        {
            var location = mockLocation(this);
            if (!/^\[object [\S\s]*Location]$/.test(Object.prototype.toString.call(location)))
                registerDefaultToStringAdapter(this, location, '[object Location]');
            patchGlobalToString(this);
        },
        MOZILLA:
        function ()
        {
            var navigator = { userAgent: 'Mozilla/5.0' };
            override(this, 'navigator', { value: navigator });
        },
        NAME:
        function ()
        {
            var get =
            function ()
            {
                var result = /^\s*function ([\w$]+)/.exec(this)[1];
                return result;
            };
            override(this, 'Function.prototype.name', { get: get });
        },
        NODECONSTRUCTOR:
        function ()
        {
            if (!global.Node)
                override(this, 'Node', { value: { } });
            var toString = createStaticSupplier('[object NodeConstructor]');
            override(this, 'Node.toString', { value: toString });
        },
        NO_FF_SRC:
        makeEmuFeatureNativeFunctionSource
        (NATIVE_FUNCTION_SOURCE_INFO_IE, NATIVE_FUNCTION_SOURCE_INFO_V8),
        NO_IE_SRC:
        makeEmuFeatureNativeFunctionSource
        (NATIVE_FUNCTION_SOURCE_INFO_FF, NATIVE_FUNCTION_SOURCE_INFO_V8),
        NO_OLD_SAFARI_ARRAY_ITERATOR:
        function ()
        {
            if (Array.prototype.entries)
            {
                var arrayIterator = [].entries();
                if (/^\[object Array Iterator]$/.test(arrayIterator))
                    return;
            }
            var prototype =
            arrayIterator ? Object.getPrototypeOf(arrayIterator) : function () { }.prototype;
            registerObjectFactory
            (this, 'Array.prototype.entries', '[object Array Iterator]', prototype);
        },
        NO_V8_SRC:
        makeEmuFeatureNativeFunctionSource
        (NATIVE_FUNCTION_SOURCE_INFO_FF, NATIVE_FUNCTION_SOURCE_INFO_IE),
        OBJECT_ARRAY_ENTRIES_CTOR:
        function ()
        {
            if (Array.prototype.entries)
            {
                var arrayIterator = [].entries();
                if (arrayIterator.constructor === Object)
                    return;
            }
            var str = arrayIterator ? arrayIterator + '' : '[object Object]';
            registerObjectFactory(this, 'Array.prototype.entries', str, Object.prototype);
        },
        OBJECT_L_LOCATION_CTOR:
        function ()
        {
            var location = mockLocation(this);
            var str = location.constructor + '';
            if (!/^\[object L/.test(str))
            {
                str = '[object L' + str;
                var toString = createStaticSupplier(str);
                override(this, 'location.constructor.toString', { value: toString });
            }
        },
        OBJECT_UNDEFINED:
        function ()
        {
            var toString = Object.prototype.toString;
            if (toString() !== '[object Undefined]')
                registerDefaultToStringAdapter(this, undefined, '[object Undefined]');
        },
        OBJECT_W_SELF:          makeEmuFeatureSelf('[object WorkerGlobalScope]', /^\[object W/),
        OLD_SAFARI_LOCATION_CTOR:
        function ()
        {
            var location = mockLocation(this);
            var oldStr = location.constructor + '';
            var newStr = oldStr;
            if (!/^\[object /.test(oldStr))
                newStr = '[object ' + newStr;
            if (!/LocationConstructor]$/.test(oldStr))
                newStr += 'LocationConstructor]';
            if (newStr !== oldStr)
            {
                var toString = createStaticSupplier(newStr);
                override(this, 'location.constructor.toString', { value: toString });
                override(this, 'location.constructor.valueOf', { value: toString });
            }
        },
        PLAIN_INTL:
        function ()
        {
            var Intl = global.Intl;
            if (!Intl)
            {
                Intl = { };
                override(this, 'Intl', { value: Intl });
            }
            if (Intl + '' !== '[object Object]')
                registerDefaultToStringAdapter(this, Intl, '[object Object]');
        },
        REGEXP_STRING_ITERATOR: makeEmuFeatureMatchAll(),
        SELF_OBJ:               makeEmuFeatureSelf('[object Object]', /^\[object /),
        SHORT_LOCALES:
        function ()
        {
            this.shortLocales = true;
            registerNumberToLocaleStringAdapter
            (
                this,
                function (locale)
                {
                    if (locale === 'ar' || locale === 'ar-td')
                    {
                        var number = Number(this);
                        if (!isNaN(number))
                        {
                            var returnValue =
                            formatLocaleNumeral(number, 0x660, undefined, undefined, '٫');
                            return returnValue;
                        }
                    }
                }
            );
        },
        STATUS:
        function ()
        {
            override(this, 'status', { value: '' });
        },
        UNDEFINED:
        function ()
        {
            if (Object.prototype.toString.call() !== '[object Undefined]')
                registerDefaultToStringAdapter(this, undefined, '[object Undefined]');
        },
        V8_SRC:                 makeEmuFeatureNativeFunctionSource(NATIVE_FUNCTION_SOURCE_INFO_V8),
        WINDOW:                 makeEmuFeatureSelf('[object Window]', /^\[object Window]$/),
    };

    var EMU_FEATURES =
    Object.keys(EMU_FEATURE_INFOS).filter
    (
        function (featureName)
        {
            var condition = EMU_FEATURE_INFOS[featureName].condition;
            var result = !condition || condition();
            return result;
        }
    );

    var isArrayToStringGeneric;
    try
    {
        Array.prototype.toString.call({ });
        isArrayToStringGeneric = true;
    }
    catch (error)
    {
        isArrayToStringGeneric = false;
    }

    var exports =
    {
        EMU_FEATURES:   EMU_FEATURES,
        emuDo:          emuDo,
        emuEval:        emuEval,
        evalJSFuck:     evalJSFuck,
    };

    Object.keys(exports).forEach
    (
        function (name)
        {
            global[name] = exports[name];
        }
    );
}
)(typeof self === 'undefined' ? global : self);
