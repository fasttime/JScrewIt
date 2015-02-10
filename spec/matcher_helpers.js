/* jshint jasmine: true */
(function ()
{
    'use strict';
    
    var MATCHERS =
    {
        toBeArray: function (actual)
        {
            var pass = Array.isArray(actual);
            var result = { message: 'Expected a boolean.', pass: pass };
            return result;
        },
        toBeArrayIterator: function (actual)
        {
            var pass =
                /^\[object Array ?Iterator]$/.test(
                    Object.prototype.toString.call(actual)
                );
            var result = { message: 'Expected an Array Iterator object.', pass: pass };
            return result;
        },
        toBeJSFuck: function (actual)
        {
            var pass = /^[!+()[\]]*$/.test(actual);
            var result = { message: 'Expected JSFuck code.', pass: pass };
            return result;
        },
        toBeNativeFunction: function (actual)
        {
            var pass =
                typeof actual === 'function' &&
                /^\s*function [\w\$]+\(\)\s*\{\s*\[native code]\s*\}\s*$/.test(actual);
            var result = { message: 'Expected a native function.', pass: pass };
            return result;            
        },
        toBePlainObject: function (actual)
        {
            var pass = Object.prototype.toString.call(actual) === '[object Object]';
            var result = { message: 'Expected a plain object.', pass: pass };
            return result;
        },
        toBeString: function (actual)
        {
            var pass = typeof actual === 'string';
            var result = { message: 'Expected a string.', pass: pass };
            return result;
        }
    };
    
    function createMatchers(callback)
    {
        var matchers = { };
        Object.getOwnPropertyNames(MATCHERS).forEach(
            function (name)
            {
                var compare = MATCHERS[name];
                matchers[name] = callback(compare);
            }
        );
        return matchers;
    }
    
    var matchersV1, matchersV2;
    
    beforeEach(
        function ()
        {
            if (typeof this.addMatchers === 'function')
            {
                if (!matchersV1)
                {
                    matchersV1 =
                        createMatchers(
                            function (compare)
                            {
                                var result =
                                    function ()
                                    {
                                        var expectation = compare(this.actual);
                                        this.message = function () { return expectation.message; };
                                        return expectation.pass;
                                    };
                                return result;
                            }
                        );
                }
                this.addMatchers(matchersV1);
            }
            else if (typeof jasmine.addMatchers === 'function')
            {
                if (!matchersV2)
                {
                    matchersV2 =
                        createMatchers(
                            function (compare)
                            {
                                var result =
                                    function()
                                    {
                                        var result = { compare: compare };
                                        return result;
                                    };
                                return result;
                            }
                        );
                }
                jasmine.addMatchers(matchersV2);
            }
        }
    );
})();
