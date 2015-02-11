/* global global, module, self */

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
                    var chr1 = (enc1 << 2) | (enc2 >> 4);
                    output += String.fromCharCode(chr1);
                    
                    var pos3 = input.charAt(i++);
                    var enc3 = this._keyStr.indexOf(pos3);
                    if (!pos3 || enc3 === 64)
                    {
                        break;
                    }
                    var chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    output += String.fromCharCode(chr2);
                    
                    var pos4 = input.charAt(i++);
                    var enc4 = this._keyStr.indexOf(pos4);
                    if (!pos4 || enc4 === 64)
                    {
                        break;
                    }
                    var chr3 = ((enc3 & 3) << 6) | enc4;
                    output += String.fromCharCode(chr3);
                }
                
                return output;
            },
        };
    
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
            emuFeatures.forEach(
                function (feature) { EMU_FEATURE_INFOS[feature].tearDown.call(context); }
            );
        }
        return result;
    }
    
    function emuEval(emuFeatures, string)
    {
        var result = emuDo(emuFeatures, function () { return eval(string); });
        return result;
    }
    
    function makeEmuFeatureArrayIterator(string, noOverwrite)
    {
        var result =
        {
            setUp: function ()
            {
                if (Array.prototype.entries)
                {
                    if (noOverwrite)
                    {
                        return;
                    }
                }
                else
                {
                    var arrayIterator = this.arrayIterator = { };
                    Object.defineProperty(
                        Array.prototype,
                        'entries',
                        {
                            configurable: true,
                            value: function () { return arrayIterator; }
                        }
                    );
                }
                var context = this;
                registerToStringAdapter(
                    this,
                    'Object',
                    'ArrayIterator',
                    function ()
                    {
                        if (
                            this === context.arrayIterator ||
                            /^\[object Array.?Iterator]$/.test(context.Object.toString.call(this)))
                        {
                            return string;
                        }
                    }
                );
            },
            tearDown: function ()
            {
                unregisterToStringAdapters(this, 'Object');
                if (this.arrayIterator)
                {
                    delete Array.prototype.entries;
                }
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
                        'native',
                        function ()
                        {
                            var regExp =
                                /^\s*function ([\w\$]+)\(\)\s*\{\s*\[native code]\s*\}\s*$/;
                            var string = context.Function.toString.call(this);
                            var match = regExp.exec(string);
                            if (match)
                            {
                                var name = match[1];
                                var result = format.replace('?', name);
                                return result;
                            }
                        }
                    );
                }
            },
            tearDown: function ()
            {
                unregisterToStringAdapters(this, 'Function');
            }
        };
        return result;
    }
    
    function makeEmuFeatureWindow(string, noOverwrite)
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
                    global.self = { };
                }
                var valueOf = function () { return string; };
                Object.defineProperty(self, 'valueOf', { configurable: true, value: valueOf });
            },
            tearDown: function ()
            {
                if (global.self === global)
                {
                    delete self.valueOf;
                }
                else
                {
                    delete global.self;
                }
            }
        };
        return result;
    }
    
    function registerToStringAdapter(context, typeName, key, adapter)
    {
        if (!context[typeName])
        {
            var prototype = global[typeName].prototype;
            var toString = prototype.toString;
            var adapters = Object.create(null);
            context[typeName] = { adapters: adapters, toString: toString };
            prototype.toString =
                function ()
                {
                    for (var key in adapters)
                    {
                        var string = adapters[key].call(this);
                        if (string !== void 0)
                        {
                            return string;
                        }
                    }
                    // When no arguments are provided to the call method, IE 9 will use the global
                    // object as this.
                    return toString.call(this === global.self ? void 0 : this);
                };
        }
        context[typeName].adapters[key] = adapter;
    }
    
    function unregisterToStringAdapters(context, typeName)
    {
        global[typeName].prototype.toString = context[typeName].toString;
    }
    
    var DOUBLE_QUOTE_ESC_METHODS = ['anchor', 'fontcolor', 'fontsize', 'link'];
    
    var EMU_FEATURE_INFOS =
        {
            ATOB:
            {
                setUp: function ()
                {
                    global.atob =
                        function (value)
                        {
                            return Base64.decode(value);
                        };
                    global.btoa =
                        function (value)
                        {
                            return Base64.encode(value);
                        };
                },
                tearDown: function ()
                {
                    delete global.atob;
                    delete global.btoa;
                }
            },
            DOMWINDOW: makeEmuFeatureWindow('[object DOMWindow]'),
            DOUBLE_QUOTE_ESC_HTML:
            {
                setUp: function ()
                {
                    var prototype = String.prototype;
                    DOUBLE_QUOTE_ESC_METHODS.forEach(
                        function (name)
                        {
                            var method = this[name] = prototype[name];
                            prototype[name] =
                                function (value)
                                {
                                    arguments[0] = (value + '').replace(/"/g, '&quot;');
                                    var result = method.apply(this, arguments);
                                    return result;
                                };
                        },
                        this
                    );
                },
                tearDown: function ()
                {
                    var prototype = String.prototype;
                    DOUBLE_QUOTE_ESC_METHODS.forEach(
                        function (name) { prototype[name] = this[name]; },
                        this
                    );
                }
            },
            ENTRIES: makeEmuFeatureArrayIterator('[object Array Iterator]', true),
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
                    Object.defineProperty(
                        Array.prototype,
                        'fill',
                        { configurable: true, value: fill }
                    );
                },
                tearDown: function ()
                {
                    delete Array.prototype.fill;
                }
            },
            GMT:
            {
                setUp: function ()
                {
                    this.Date = Date;
                    global.Date = function () { return 'Xxx Xxx 00 0000 00:00:00 GMT+0000 (XXX)'; };
                },
                tearDown: function ()
                {
                    global.Date = this.Date;
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
                    Object.defineProperty(
                        Function.prototype,
                        'name',
                        { configurable: true, get: get }
                    );
                },
                tearDown: function ()
                {
                    delete Function.prototype.name;
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
                        'anonymous',
                        function ()
                        {
                            var string = context.Function.toString.call(this);
                            if (string === 'function anonymous() { \n}')
                            {
                                return 'function anonymous() {\n\n}';
                            }
                        }
                    );
                },
                tearDown: function ()
                {
                    unregisterToStringAdapters(this, 'Function');
                }
            },
            QUOTE:
            {
                setUp: function ()
                {
                    if (!String.prototype.quote)
                    {
                        this.quoteEmulation = true;
                        var quote = function () { return JSON.stringify(this); };
                        Object.defineProperty(
                            String.prototype,
                            'quote',
                            { configurable: true, value: quote }
                        );
                    }
                },
                tearDown: function ()
                {
                    if (this.quoteEmulation)
                    {
                        delete String.prototype.quote;
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
                        'Undefined',
                        function ()
                        {
                            if (this === void 0)
                            {
                                return '[object Undefined]';
                            }
                        }
                    );
                },
                tearDown: function ()
                {
                    unregisterToStringAdapters(this, 'Object');
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
    
    if (global.self)
    {
        Object.getOwnPropertyNames(exports).forEach(
            function (name) { self[name] = exports[name]; }
        );
    }
    if (typeof module !== 'undefined')
    {
        module.exports = exports;
    }

})(typeof self === 'undefined' ? global : self);
