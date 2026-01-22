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
            return toString;
        }

        function toString()
        {
            var str = callAdapters(adapterList, this, arguments);
            return str;
        }

        var descriptor = { get: get };
        return descriptor;
    }

    function emuDo(emuFeatures, callback)
    {
        var context = Object.create(null);
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

    function formatLocaleNumeral(number, charCode0, intReplacer, dotReplacement)
    {
        var parts = String(number).match(/(-?)(\d*)(\.?)(.*)/);
        parts.shift();
        var int = rebaseDigits(parts[1], charCode0);
        if (intReplacer)
            int = intReplacer(int);
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
                    throw RangeError(codePoint + ' is not a valid code point');
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
                document =
                {
                    createElement:  createElement,
                    forms:          '[object HTMLCollection]',
                    nodeName:       '#document',
                };
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
                override(this, 'self', { value: global });
            var toString =
            function ()
            {
                var returnValue = this === global ? str : this.toString();
                return returnValue;
            };
            override(this, 'self.toString', { value: toString });
            var valueOf =
            function ()
            {
                var returnValue = this === global ? str : this.valueOf();
                return returnValue;
            };
            override(this, 'self.valueOf', { value: valueOf });
        };
        return setUp;
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

    function separate2CharGroupsByComma(str)
    {
        var returnValue = str.replace(/(?=(..)+.$)/g, ',$&');
        return returnValue;
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
        ARRAY_ITERATOR:
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
        BARPROP:
        function ()
        {
            var toString =
            function ()
            {
                return '[object BarProp]';
            };
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
            var toString = createStaticSupplier('[object Console]');
            override(this, 'console.toString', { value: toString });
        },
        DOCUMENT:
        makeEmuFeatureDocument('[object Document]', /^\[object [\S\s]*Document]$/),
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
        IE_SRC:                 makeEmuFeatureNativeFunctionSource(NATIVE_FUNCTION_SOURCE_INFO_IE),
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
        LOCALE_INFINITY:
        function ()
        {
            registerNumberToLocaleStringAdapter
            (
                this,
                function ()
                {
                    switch (this)
                    {
                    case Infinity:
                        return '∞';
                    case -Infinity:
                        return '-∞';
                    }
                }
            );
        },
        LOCALE_NUMERALS_BN:
        function ()
        {
            registerNumberToLocaleStringAdapter
            (
                this,
                function (locale)
                {
                    if (locale === 'bn')
                    {
                        var number = Number(this);
                        if (!isNaN(number))
                        {
                            var returnValue =
                            formatLocaleNumeral(number, 0x09e6, separate2CharGroupsByComma);
                            return returnValue;
                        }
                    }
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
        NO_FF_SRC:
        makeEmuFeatureNativeFunctionSource
        (NATIVE_FUNCTION_SOURCE_INFO_IE, NATIVE_FUNCTION_SOURCE_INFO_V8),
        NO_IE_SRC:
        makeEmuFeatureNativeFunctionSource
        (NATIVE_FUNCTION_SOURCE_INFO_FF, NATIVE_FUNCTION_SOURCE_INFO_V8),
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
        OBJECT_W_SELF:          makeEmuFeatureSelf('[object WorkerGlobalScope]', /^\[object W/),
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
        SELF:                   makeEmuFeatureSelf('[object Object]', /^\[object /),
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
                            var returnValue = formatLocaleNumeral(number, 0x660, undefined, '٫');
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
