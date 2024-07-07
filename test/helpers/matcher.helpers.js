/* global expect */

'use strict';

(function ()
{
    var MATCHERS =
    {
        toBeArray:
        function ()
        {
            var actual = this.value;
            var message = this.generateMessage(actual, this.expr, 'to be an array');
            var pass = Array.isArray(actual);
            if (pass)
                return this.assertions.pass(message);
            this.assertions.fail(message);
        },
        toBeBoolean:
        function ()
        {
            var actual = this.value;
            var message = this.generateMessage(actual, this.expr, 'to be a boolean');
            var pass = typeof actual === 'boolean';
            if (pass)
                return this.assertions.pass(message);
            this.assertions.fail(message);
        },
        toBeJSFuck:
        function ()
        {
            var actual = this.value;
            var message = this.generateMessage(actual, this.expr, 'to be JSFuck code');
            var pass = /^[!+()[\]]*$/.test(actual);
            if (pass)
                return this.assertions.pass(message);
            this.assertions.fail(message);
        },
        toBeNativeFunction:
        function ()
        {
            var actual = this.value;
            var message = this.generateMessage(actual, this.expr, 'to be a native function');
            var pass =
            typeof actual === 'function' &&
            /^\s*function [\w$]+\(\)\s*\{\s*\[native code]\s*\}\s*$/.test(actual);
            if (pass)
                return this.assertions.pass(message);
            this.assertions.fail(message);
        },
        toBePlainObject:
        function ()
        {
            var actual = this.value;
            var message = this.generateMessage(actual, this.expr, 'to be a plain object');
            var pass = Object.prototype.toString.call(actual) === '[object Object]';
            if (pass)
                return this.assertions.pass(message);
            this.assertions.fail(message);
        },
        toBeString:
        function ()
        {
            var actual = this.value;
            var message = this.generateMessage(actual, this.expr, 'to be a string');
            var pass = typeof actual === 'string';
            if (pass)
                return this.assertions.pass(message);
            this.assertions.fail(message);
        },
        toEndWith:
        function (str)
        {
            var actual = this.value;
            var message = this.generateMessage(actual, this.expr, 'to end with', str);
            var pass = actual.slice(-str.length) === str;
            if (pass)
                return this.assertions.pass(message);
            this.assertions.fail(message);
        },
        toHavePrototype:
        function (prototype)
        {
            var actual = Object.getPrototypeOf(this.value);
            var message = this.generateMessage(actual, this.expr, 'to have prototype', prototype);
            var pass = actual === prototype;
            if (pass)
                return this.assertions.pass(message);
            this.assertions.fail(message);
        },
        toStartWith:
        function (str)
        {
            var actual = this.value;
            var message = this.generateMessage(actual, this.expr, 'to start with', str);
            var pass = actual.slice(0, str.length) === str;
            if (pass)
                return this.assertions.pass(message);
            this.assertions.fail(message);
        },
        toThrowStrictly:
        function ()
        {
            var error;
            var fn = this.value;
            try
            {
                fn();
            }
            catch (newError)
            {
                error = newError;
            }
            if (error == null)
            {
                var message = this.generateMessage(fn, this.expr, 'to throw an error');
                this.assertions.fail(message);
            }
            Array.prototype.forEach.call
            (
                arguments,
                function (arg)
                {
                    var message;
                    var type = typeof arg;
                    switch (type)
                    {
                    case 'function':
                        var prototype = arg.prototype;
                        if (Object.getPrototypeOf(error) === prototype)
                            break;
                        throw error;
                    case 'string':
                        if (error.message === arg)
                            break;
                        message =
                        this.generateMessage(fn, this.expr, 'to throw an error with message', arg);
                        this.assertions.fail(message);
                        return;
                    default:
                        throw new TypeError('Unsupported argument type ' + type);
                    }
                },
                this
            );
            return this.assertions.pass();
        },
    };

    Object.keys(MATCHERS).forEach
    (
        function (name)
        {
            var matcher = MATCHERS[name];
            expect.addAssertion(name, matcher);
        }
    );
}
)();
