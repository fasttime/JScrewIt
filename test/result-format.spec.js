/* eslint-env mocha */
/* global BigInt, Symbol, document, expect, require, self */

'use strict';

(function ()
{
    function describeTests()
    {
        describe
        (
            'Given',
            function ()
            {
                var sparseArray = [];
                sparseArray[5] = 'foo';
                var sparseSingletonArray = [];
                sparseSingletonArray.length = 1;
                var badObj = { toString: throwError };

                test('a number', 1, '1');
                test('0', 0, '0');
                test('-0', -0, '-0');
                test('NaN', NaN, 'NaN');
                test('Infinity', Infinity, 'Infinity');
                test('an empty string', '', '""');
                test('a string', 'foo', '"foo"');
                test('a multiline string', 'foo\nbar', '"foo\nbar"');
                test('null', null, 'null');
                if (typeof Symbol !== 'undefined')
                    test('a symbol', Symbol('foo'), 'Symbol(foo)');
                if (typeof BigInt !== 'undefined')
                    test('a bigint', BigInt(1), '1n');
                test('an empty array', [], '[]', 'an empty array');
                test('a one element array', [''], '[""]', 'a one element array');
                test('an array with more elements', [1, 2], '[1, 2]', 'an array');
                test('a nesting of arrays', [[], [{ }]], '[[], […]]', 'an array');
                test('a sparse array', sparseArray, '[, , , , , "foo"]', 'an array');
                test('a sparse singleton array', sparseSingletonArray, '[]', 'a one element array');
                if (typeof document !== 'undefined')
                    test('document.all', document.all, undefined, 'an object');
                test('a plain object', { }, '[object Object]', 'an object');
                test('a function', Function(), undefined, 'a function');
                test('a regular expression', /./, '/./', 'a regular expression');
                test('a date', new Date(), undefined, 'a date');
                test('an object that throws errors', badObj, undefined, 'an object');
                testTypeUnknownObj();
            }
        );
    }

    function test(description, input, expectedValue, expectedValueType, doBefore, doAfter)
    {
        describe
        (
            description,
            function ()
            {
                if (doBefore)
                    before(doBefore);
                if (doAfter)
                    after(doAfter);
                if (expectedValue != null)
                {
                    it
                    (
                        'formatValue returns the expected result',
                        function ()
                        {
                            var actualValue = formatValue(input);
                            expect(actualValue).toBe(expectedValue);
                        }
                    );
                }
                it
                (
                    'formatValueType returns the expected result',
                    function ()
                    {
                        var actualValueType = formatValueType(input);
                        expect(actualValueType).toBe(expectedValueType);
                    }
                );
            }
        );
    }

    function testTypeUnknownObj()
    {
        function callTest(doBefore, doAfter)
        {
            test('a strange object', obj, 'foo', 'an object', doBefore, doAfter);
        }

        var obj = new Date();
        obj.toString =
        function ()
        {
            return 'foo';
        };
        if (typeof Symbol !== 'undefined')
        {
            var toStringTag = Symbol.toStringTag;
            if (toStringTag)
            {
                Object.defineProperty(obj, toStringTag, { get: throwError });
                callTest();
                return;
            }
        }
        var toString = Object.prototype.toString;
        callTest
        (
            function ()
            {
                toString.call =
                function (arg)
                {
                    if (arg !== obj)
                        return Function.prototype.call.call(toString, null, arg);
                    throwError();
                };
            },
            function ()
            {
                delete toString.call;
            }
        );
    }

    function throwError()
    {
        throw Error();
    }

    var formatValue;
    var formatValueType;

    if (typeof module !== 'undefined')
    {
        require('expectations');
        var resultFormat = require('../src/html/result-format');
        formatValue = resultFormat.formatValue;
        formatValueType = resultFormat.formatValueType;
    }
    else
    {
        formatValue = self.formatValue;
        formatValueType = self.formatValueType;
    }
    describeTests();
}
)();
