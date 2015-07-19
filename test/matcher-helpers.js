/* global expect */

(function ()
{
    'use strict';
    
    var MATCHERS =
    {
        toBeArray: function ()
        {
            var actual = this.value;
            var message = this.generateMessage(actual, this.expr, 'to be an array');
            var pass = Array.isArray(actual);
            if (pass)
            {
                return this.assertions.pass(message);
            }
            this.assertions.fail(message);
        },
        toBeArrayIterator: function ()
        {
            var actual = this.value;
            var message = this.generateMessage(actual, this.expr, 'to be an Array Iterator object');
            var pass = Object.getPrototypeOf(actual) === Object.getPrototypeOf([].entries());
            if (pass)
            {
                return this.assertions.pass(message);
            }
            this.assertions.fail(message);
        },
        toBeBoolean: function ()
        {
            var actual = this.value;
            var message = this.generateMessage(actual, this.expr, 'to be a boolean');
            var pass = typeof actual === 'boolean';
            if (pass)
            {
                return this.assertions.pass(message);
            }
            this.assertions.fail(message);
        },
        toBeJSFuck: function ()
        {
            var actual = this.value;
            var message = this.generateMessage(actual, this.expr, 'to be JSFuck code');
            var pass = /^[!+()[\]]*$/.test(actual);
            if (pass)
            {
                return this.assertions.pass(message);
            }
            this.assertions.fail(message);
        },
        toBeNativeFunction: function ()
        {
            var actual = this.value;
            var message = this.generateMessage(actual, this.expr, 'to be a native function');
            var pass =
                typeof actual === 'function' &&
                /^\s*function [\w\$]+\(\)\s*\{\s*\[native code]\s*\}\s*$/.test(actual);
            if (pass)
            {
                return this.assertions.pass(message);
            }
            this.assertions.fail(message);
        },
        toBePlainObject: function ()
        {
            var actual = this.value;
            var message = this.generateMessage(actual, this.expr, 'to be a plain object');
            var pass = Object.prototype.toString.call(actual) === '[object Object]';
            if (pass)
            {
                return this.assertions.pass(message);
            }
            this.assertions.fail(message);
        },
        toBeString: function ()
        {
            var actual = this.value;
            var message = this.generateMessage(actual, this.expr, 'to be a string');
            var pass = typeof actual === 'string';
            if (pass)
            {
                return this.assertions.pass(message);
            }
            this.assertions.fail(message);
        }
    };
    
    Object.keys(MATCHERS).forEach(
        function (name)
        {
            var matcher = MATCHERS[name];
            expect.addAssertion(name, matcher);
        }
    );
}
)();
