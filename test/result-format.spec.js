/* eslint-env mocha */
/* global BigInt, Symbol, document, expect, global, require, self, when */

'use strict';

(function ()
{
    function createSparseArray()
    {
        var sparseArray = [];
        sparseArray[5] = 'foo';
        return sparseArray;
    }

    function createSparseSingletonArray()
    {
        var sparseSingletonArray = [];
        sparseSingletonArray.length = 1;
        return sparseSingletonArray;
    }

    function createTypeUnknownObjParamData()
    {
        var obj = Object.create(new Date());
        obj.toString =
        function ()
        {
            return 'foo';
        };
        var paramData = ['a strange object', obj, 'foo', 'an object'];
        if (typeof Symbol !== 'undefined')
        {
            var toStringTag = Symbol.toStringTag;
            if (toStringTag)
            {
                Object.defineProperty(obj, toStringTag, { get: throwError });
                return paramData;
            }
        }
        var toString = Object.prototype.toString;
        paramData.doBefore =
        function ()
        {
            toString.call =
            function (arg)
            {
                if (arg !== obj)
                    return Function.prototype.call.call(toString, null, arg);
                throwError();
            };
        };
        paramData.doAfter =
        function ()
        {
            delete toString.call;
        };
        return paramData;
    }

    function throwError()
    {
        throw Error();
    }

    var formatValue;
    var formatValueType;

    if (typeof self === 'undefined')
    {
        require('expectations');
        global.self = { };
        require('../src/ui/result-format');
        formatValue = self.formatValue;
        formatValueType = self.formatValueType;
        delete global.self;
    }
    else
    {
        formatValue = self.formatValue;
        formatValueType = self.formatValueType;
    }

    describe
    (
        'Given',
        function ()
        {
            var paramDataList =
            [
                ['a number', 1, '1'],
                ['0', 0, '0'],
                ['-0', -0, '-0'],
                ['NaN', NaN, 'NaN'],
                ['Infinity', Infinity, 'Infinity'],
                ['an empty string', '', '""'],
                ['a string', 'foo', '"foo"'],
                ['a multiline string', 'foo\nbar', '"foo\nbar"'],
                ['null', null, 'null'],
                when
                (
                    typeof Symbol !== 'undefined',
                    ['a symbol', typeof Symbol !== 'undefined' && Symbol('foo'), 'Symbol(foo)']
                ),
                when
                (
                    typeof BigInt !== 'undefined',
                    ['a bigint', typeof BigInt !== 'undefined' && BigInt(1), '1n']
                ),
                ['an empty array', [], '[]', 'an empty array'],
                ['a one element array', [''], '[""]', 'a one element array'],
                ['an array with more elements', [1, 2], '[1, 2]', 'an array'],
                ['a nesting of arrays', [[], [{ }]], '[[], […]]', 'an array'],
                ['a sparse array', createSparseArray(), '[, , , , , "foo"]', 'an array'],
                [
                    'a sparse singleton array',
                    createSparseSingletonArray(),
                    '[]',
                    'a one element array',
                ],
                when
                (
                    typeof document !== 'undefined',
                    ['document.all', typeof document !== 'undefined' && document.all, , 'an object']
                ),
                ['a plain object', { }, '[object Object]', 'an object'],
                ['a function', Function(), , 'a function'],
                ['a regular expression', /./, '/./', 'a regular expression'],
                ['a date', new Date(), , 'a date'],
                ['an object that throws errors', { toString: throwError }, , 'an object'],
                createTypeUnknownObjParamData(),
            ];

            describe.per(paramDataList)
            (
                '#[0]',
                function (paramData)
                {
                    var input               = paramData[1];
                    var expectedValue       = paramData[2];
                    var expectedValueType   = paramData[3];
                    var doBefore            = paramData.doBefore;
                    var doAfter             = paramData.doAfter;

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
    );
}
)();
