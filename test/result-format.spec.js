/* eslint-env mocha */
/* global Symbol, document, expect, require, self */

(function ()
{
    'use strict';
    
    function describeTests()
    {
        describe(
            'Given',
            function ()
            {
                function test(description, input, expectedValue, expectedValueType)
                {
                    describe(
                        description,
                        function ()
                        {
                            if (expectedValue != null)
                            {
                                it(
                                    'formatValue returns the expected result',
                                    function ()
                                    {
                                        var actualValue = formatValue(input);
                                        expect(actualValue).toBe(expectedValue);
                                    }
                                );
                            }
                            it(
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
                
                function throwError()
                {
                    throw Error();
                }
                
                var sparseArray = [];
                sparseArray[5] = 'foo';
                var sparseSingletonArray = [];
                sparseSingletonArray.length = 1;
                var badObj = { toString: throwError };
                var untypedObj;
                if (typeof Symbol !== 'undefined')
                {
                    untypedObj =
                    {
                        toString: function ()
                        {
                            return 'foo';
                        }
                    };
                    Object.defineProperty(untypedObj, Symbol.toStringTag, { get: throwError });
                }
                
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
                test('an empty array', [], '[]', 'an empty array');
                test('a one element array', [''], '[""]', 'a one element array');
                test('an array with more elements', [1, 2], '[1, 2]', 'an array');
                test('a nesting of arrays', [[], [{ }]], '[[], […]]', 'an array');
                test('a sparse array', sparseArray, '[, , , , , "foo"]', 'an array');
                test('a sparse singleton array', sparseSingletonArray, '[]', 'a one element array');
                if (typeof document !== 'undefined')
                    test('document.all', document.all, void 0, 'an object');
                test('a plain object', { }, '[object Object]', 'an object');
                test('a function', Function(), void 0, 'a function');
                test('a regular expression', /./, '/./', 'a regular expression');
                test('a date', new Date(), void 0, 'a date');
                test('an object that throws errors', badObj, void 0, 'an object');
                if (untypedObj)
                    test('a strange object', untypedObj, 'foo', 'an object');
            }
        );
    }
    
    var formatValue;
    var formatValueType;
    
    if (typeof module !== 'undefined')
    {
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
