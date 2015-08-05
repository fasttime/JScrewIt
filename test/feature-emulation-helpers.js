/* global document, global, self */

(function (global)
{
    'use strict';
    
    var Base64 =
    {
        // private property
        _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
        
        // public method for encoding
        encode:
        function (input)
        {
            var output = '';
            input += '';
            for (var i = 0; i < input.length;)
            {
                var chr1 = input.charCodeAt(i++);
                var enc1 = chr1 >> 2;
                
                var chr2 = input.charCodeAt(i++);
                var enc2 = (chr1 & 3) << 4 | chr2 >> 4;
                
                var enc3, enc4;
                if (isNaN(chr2))
                {
                    enc3 = enc4 = 64;
                }
                else
                {
                    var chr3 = input.charCodeAt(i++);
                    enc3 = (chr2 & 15) << 2 | chr3 >> 6;
                    if (isNaN(chr3))
                    {
                        enc4 = 64;
                    }
                    else
                    {
                        enc4 = chr3 & 63;
                    }
                }
                
                output +=
                    this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
            }
            
            return output;
        },
        
        // public method for decoding
        decode:
        function (input)
        {
            var output = '';
            input += '';
            for (var i = 0; i < input.length;)
            {
                var enc1 = this._keyStr.indexOf(input.charAt(i++));
                var enc2 = this._keyStr.indexOf(input.charAt(i++));
                var chr1 = enc1 << 2 | enc2 >> 4;
                output += String.fromCharCode(chr1);
                
                var pos3 = input.charAt(i++);
                var enc3 = this._keyStr.indexOf(pos3);
                if (!pos3 || enc3 === 64)
                {
                    break;
                }
                var chr2 = (enc2 & 15) << 4 | enc3 >> 2;
                output += String.fromCharCode(chr2);
                
                var pos4 = input.charAt(i++);
                var enc4 = this._keyStr.indexOf(pos4);
                if (!pos4 || enc4 === 64)
                {
                    break;
                }
                var chr3 = (enc3 & 3) << 6 | enc4;
                output += String.fromCharCode(chr3);
            }
            
            return output;
        },
    };
    
    function createBackupMap()
    {
        var backupMap = Object.create(null);
        return backupMap;
    }
    
    function emuDo(emuFeatures, callback)
    {
        var result;
        var context = Object.create(null);
        try
        {
            emuFeatures.forEach(
                function (featureName)
                {
                    EMU_FEATURE_INFOS[featureName].setUp.call(context);
                }
            );
            result = callback();
        }
        finally
        {
            var backupMap = context.BACKUP;
            if (backupMap)
            {
                restoreAll(backupMap, global);
            }
        }
        return result;
    }
    
    function emuEval(emuFeatures, str)
    {
        var result =
            emuDo(
                emuFeatures,
                function ()
                {
                    return eval(str);
                }
            );
        return result;
    }
    
    function fromCodePoint()
    {
        var codeUnits = [];
        Array.prototype.forEach.call(
            arguments,
            function (arg)
            {
                var codePoint = Number(arg);
                if ((codePoint & 0x1fffff) !== codePoint || codePoint > 0x10ffff)
                {
                    throw RangeError(codePoint + ' is not a valid code point');
                }
                if (codePoint <= 0xffff)
                {
                    codeUnits.push(codePoint);
                }
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
    
    function makeEmuFeatureDocument(str, regExp)
    {
        var result =
        {
            setUp: function ()
            {
                if (global.document)
                {
                    if (regExp.test(document + ''))
                    {
                        return;
                    }
                }
                else
                {
                    override(this, 'document', { value: { } });
                }
                var valueOf =
                    function ()
                    {
                        return str;
                    };
                override(this, 'document.valueOf', { value: valueOf });
            }
        };
        return result;
    }
    
    function makeEmuFeatureEntries(str, regExp)
    {
        var result =
        {
            setUp: function ()
            {
                if (Array.prototype.entries && regExp.test([].entries()))
                {
                    return;
                }
                else
                {
                    var arrayIteratorProto = this.arrayIteratorProto = { };
                    var arrayIterator = Object.create(arrayIteratorProto);
                    var entries =
                        function ()
                        {
                            return arrayIterator;
                        };
                    override(this, 'Array.prototype.entries', { value: entries });
                }
                var context = this;
                registerToStringAdapter(
                    this,
                    'Object',
                    function ()
                    {
                        if (
                            this instanceof Object &&
                            Object.getPrototypeOf(this) === context.arrayIteratorProto)
                        {
                            return str;
                        }
                    }
                );
            }
        };
        return result;
    }
    
    function makeEmuFeatureFunctionSource(format, noOverwrite)
    {
        var result =
        {
            setUp: function ()
            {
                if (!this.Function || !noOverwrite)
                {
                    var context = this;
                    registerToStringAdapter(
                        this,
                        'Function',
                        function ()
                        {
                            var regExp =
                                /^\s*function ([\w\$]+)\(\)\s*\{\s*\[native code]\s*\}\s*$/;
                            var str = context.Function.toString.call(this);
                            var match = regExp.exec(str);
                            if (match)
                            {
                                var name = match[1];
                                var result = format.replace('?', name);
                                return result;
                            }
                        }
                    );
                }
            }
        };
        return result;
    }
    
    function makeEmuFeatureHtml(methodNames, adapter)
    {
        var result =
        {
            setUp: function ()
            {
                var prototype = String.prototype;
                methodNames.forEach(
                    function (name)
                    {
                        var method = prototype[name];
                        var value = adapter(method);
                        override(this, 'String.prototype.' + name, { value: value });
                    },
                    this
                );
            }
        };
        return result;
    }
    
    function makeEmuFeatureSelf(str, regExp)
    {
        var result =
        {
            setUp: function ()
            {
                if (global.self)
                {
                    if (regExp.test(self + ''))
                    {
                        return;
                    }
                }
                else
                {
                    override(this, 'self', { value: { } });
                }
                var valueOf =
                    function ()
                    {
                        return str;
                    };
                override(this, 'self.valueOf', { value: valueOf });
            }
        };
        return result;
    }
    
    function override(context, path, descriptor)
    {
        var backupMap = context.BACKUP || (context.BACKUP = createBackupMap());
        var components = path.split('.');
        var backup =
            components.every(
                function (name)
                {
                    backupMap = backupMap[name] || (backupMap[name] = createBackupMap());
                    var backup = !('' in backupMap);
                    return backup;
                }
            );
        var name = components.pop();
        var obj =
            components.reduce(
                function (obj, name)
                {
                    return obj[name];
                },
                global
            );
        if (backup)
        {
            var oldDescriptor = Object.getOwnPropertyDescriptor(obj, name);
            Object.defineProperty(backupMap, '', { value: oldDescriptor });
        }
        descriptor.configurable = true;
        Object.defineProperty(obj, name, descriptor);
    }
    
    function registerToStringAdapter(context, typeName, adapter)
    {
        if (!context[typeName])
        {
            var toString = global[typeName].prototype.toString;
            var adapters = [];
            context[typeName] = { adapters: adapters, toString: toString };
            var value =
                function ()
                {
                    for (var index = adapters.length; index-- > 0;)
                    {
                        var adapter = adapters[index];
                        var str = adapter.call(this);
                        if (str !== void 0)
                        {
                            return str;
                        }
                    }
                    // When no arguments are provided to the call method, IE 9 will use the global
                    // object as this.
                    return toString.call(this === global.self ? void 0 : this);
                };
            override(context, typeName + '.prototype.toString', { value: value });
        }
        context[typeName].adapters.push(adapter);
    }
    
    function restoreAll(backupMap, obj)
    {
        for (var name in backupMap)
        {
            var subBackupMap = backupMap[name];
            if ('' in subBackupMap)
            {
                var descriptor = subBackupMap[''];
                if (descriptor)
                {
                    Object.defineProperty(obj, name, descriptor);
                }
                else
                {
                    delete obj[name];
                    continue;
                }
            }
            restoreAll(subBackupMap, obj[name]);
        }
    }
    
    var EMU_FEATURE_INFOS =
    {
        ANY_DOCUMENT: makeEmuFeatureDocument('[object Document]', /^\[object .*Document]$/),
        ANY_WINDOW: makeEmuFeatureSelf('[object Window]', /^\[object .*Window]$/),
        ARRAY_ITERATOR: makeEmuFeatureEntries('[object Array Iterator]', /^\[object Array.{8,9}]$/),
        ATOB:
        {
            setUp: function ()
            {
                var atob =
                    function (value)
                    {
                        return Base64.decode(value);
                    };
                var btoa =
                    function (value)
                    {
                        return Base64.encode(value);
                    };
                override(this, 'atob', { value: atob });
                override(this, 'btoa', { value: btoa });
            }
        },
        CAPITAL_HTML: makeEmuFeatureHtml(
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
                'sup'
            ],
            function (method)
            {
                var result =
                    function ()
                    {
                        var result =
                            method.apply(this, arguments).replace(
                                /^<[\w ]+|[\w ]+>$/g,
                                function (match)
                                {
                                    return match.toUpperCase();
                                }
                            );
                        return result;
                    };
                return result;
            }
        ),
        DOCUMENT: makeEmuFeatureDocument('[object Document]', /^\[object Document]$/),
        DOMWINDOW: makeEmuFeatureSelf('[object DOMWindow]', /^\[object DOMWindow]$/),
        DOUBLE_QUOTE_ESC_HTML: makeEmuFeatureHtml(
            ['anchor', 'fontcolor', 'fontsize', 'link'],
            function (method)
            {
                var result =
                    function (value)
                    {
                        arguments[0] = (value + '').replace(/"/g, '&quot;');
                        var result = method.apply(this, arguments);
                        return result;
                    };
                return result;
            }
        ),
        ENTRIES_OBJ: makeEmuFeatureEntries('[object Object]', /^\[object /),
        ENTRIES_PLAIN: makeEmuFeatureEntries('[object Object]', /^\[object Object]$/),
        FF_SAFARI_SRC: makeEmuFeatureFunctionSource('function ?() {\n    [native code]\n}'),
        FILL:
        {
            setUp: function ()
            {
                var fill = Function();
                fill.toString =
                    function ()
                    {
                        return (Array.prototype.join + '').replace(/\bjoin\b/, 'fill');
                    };
                override(this, 'Array.prototype.fill', { value: fill });
            }
        },
        FROM_CODE_POINT:
        {
            setUp: function ()
            {
                override(this, 'String.fromCodePoint', { value: fromCodePoint });
            }
        },
        GMT:
        {
            setUp: function ()
            {
                var Date =
                    function ()
                    {
                        return 'Xxx Xxx 00 0000 00:00:00 GMT+0000 (XXX)';
                    };
                override(this, 'Date', { value: Date });
            }
        },
        HTMLDOCUMENT: makeEmuFeatureDocument('[object HTMLDocument]', /^\[object HTMLDocument]$/),
        IE_SRC: makeEmuFeatureFunctionSource('\nfunction ?() {\n    [native code]\n}\n'),
        LOCALE_INFINITY:
        {
            setUp: function ()
            {
                var toLocaleString = Number.prototype.toLocaleString;
                var value =
                    function ()
                    {
                        var result;
                        switch (this)
                        {
                        case Infinity:
                            result = '∞';
                            break;
                        case -Infinity:
                            result = '-∞';
                            break;
                        default:
                            result = toLocaleString.apply(this, arguments);
                            break;
                        }
                        return result;
                    };
                override(this, 'Number.prototype.toLocaleString', { value: value });
            }
        },
        NAME:
        {
            setUp: function ()
            {
                var get =
                    function ()
                    {
                        var result = /^\s*function ([\w\$]+)/.exec(this)[1];
                        return result;
                    };
                override(this, 'Function.prototype.name', { get: get });
            }
        },
        NO_IE_SRC: makeEmuFeatureFunctionSource('function ?() { [native code] }', true),
        NO_SAFARI_ARRAY_ITERATOR: makeEmuFeatureEntries(
            '[object Array Iterator]',
            /^\[object Array Iterator]$/
        ),
        NO_SAFARI_LF:
        {
            setUp: function ()
            {
                var context = this;
                registerToStringAdapter(
                    this,
                    'Function',
                    function ()
                    {
                        var str = context.Function.toString.call(this);
                        if (str === 'function anonymous() { \n}')
                        {
                            return 'function anonymous() {\n\n}';
                        }
                    }
                );
            }
        },
        SAFARI_ARRAY_ITERATOR: makeEmuFeatureEntries(
            '[object ArrayIterator]',
            /^\[object ArrayIterator]$/
        ),
        SELF_OBJ: makeEmuFeatureSelf('[object Object]', /^\[object /),
        UNDEFINED:
        {
            setUp: function ()
            {
                registerToStringAdapter(
                    this,
                    'Object',
                    function ()
                    {
                        if (this === void 0)
                        {
                            return '[object Undefined]';
                        }
                    }
                );
            }
        },
        V8_SRC: makeEmuFeatureFunctionSource('function ?() { [native code] }'),
        WINDOW: makeEmuFeatureSelf('[object Window]', /^\[object Window]$/)
    };
    
    var EMU_FEATURES = [];
    Object.keys(EMU_FEATURE_INFOS).forEach(
        function (featureName)
        {
            var condition = EMU_FEATURE_INFOS[featureName].condition;
            if (!condition || condition())
            {
                EMU_FEATURES.push(featureName);
            }
        }
    );
    
    var exports =
    {
        emuDo:          emuDo,
        emuEval:        emuEval,
        EMU_FEATURES:   EMU_FEATURES,
    };
    
    Object.keys(exports).forEach(
        function (name)
        {
            global[name] = exports[name];
        }
    );
}
)(typeof self === 'undefined' ? global : self);
