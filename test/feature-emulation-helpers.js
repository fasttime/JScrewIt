/* global global, self */

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
                function (feature) { EMU_FEATURE_INFOS[feature].setUp.call(context); }
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
        var result = emuDo(emuFeatures, function () { return eval(str); });
        return result;
    }
    
    function makeEmuFeatureArrayIterator(str, noOverwrite)
    {
        var result =
        {
            setUp: function ()
            {
                if (Array.prototype.entries && /^\[object Array/.test([].entries()))
                {
                    if (noOverwrite)
                    {
                        return;
                    }
                }
                else
                {
                    var arrayIterator = this.arrayIterator = { };
                    var entries = function () { return arrayIterator; };
                    override(this, 'Array.prototype.entries', { value: entries });
                }
                var context = this;
                registerToStringAdapter(
                    this,
                    'Object',
                    function ()
                    {
                        if (
                            this === context.arrayIterator ||
                            /^\[object Array.?Iterator]$/.test(context.Object.toString.call(this)))
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
    
    function makeEmuFeatureWindow(str, noOverwrite)
    {
        var result =
        {
            setUp: function ()
            {
                if (global.self)
                {
                    if (noOverwrite)
                    {
                        return;
                    }
                }
                else
                {
                    override(this, 'self', { value: { } });
                }
                var valueOf = function () { return str; };
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
        var obj = components.reduce(function (obj, name) { return obj[name]; }, global);
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
        ARRAY_ITERATOR: makeEmuFeatureArrayIterator('[object Array Iterator]', true),
        ATOB:
        {
            setUp: function ()
            {
                var atob = function (value) { return Base64.decode(value); };
                var btoa = function (value) { return Base64.encode(value); };
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
                                function (match) { return match.toUpperCase(); }
                            );
                        return result;
                    };
                return result;
            }
        ),
        DOMWINDOW: makeEmuFeatureWindow('[object DOMWindow]'),
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
        GMT:
        {
            setUp: function ()
            {
                var Date = function () { return 'Xxx Xxx 00 0000 00:00:00 GMT+0000 (XXX)'; };
                override(this, 'Date', { value: Date });
            }
        },
        IE_SRC: makeEmuFeatureFunctionSource('\nfunction ?() {\n    [native code]\n}\n'),
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
        NO_SAFARI_ARRAY_ITERATOR: makeEmuFeatureArrayIterator('[object Array Iterator]'),
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
        QUOTE:
        {
            setUp: function ()
            {
                if (!String.prototype.quote)
                {
                    var quote = function () { return JSON.stringify(this); };
                    override(this, 'String.prototype.quote', { value: quote });
                }
            }
        },
        SAFARI_ARRAY_ITERATOR: makeEmuFeatureArrayIterator('[object ArrayIterator]'),
        SELF: makeEmuFeatureWindow('[object Window]', true),
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
        WINDOW: makeEmuFeatureWindow('[object Window]')
    };
    
    var EMU_FEATURES = [];
    Object.getOwnPropertyNames(EMU_FEATURE_INFOS).forEach(
        function (feature)
        {
            var condition = EMU_FEATURE_INFOS[feature].condition;
            if (!condition || condition())
            {
                EMU_FEATURES.push(feature);
            }
        }
    );
    
    var exports =
    {
        emuDo:          emuDo,
        emuEval:        emuEval,
        EMU_FEATURES:   EMU_FEATURES,
    };
    
    Object.getOwnPropertyNames(exports).forEach(function (name) { global[name] = exports[name]; });

})(typeof self === 'undefined' ? global : self);
