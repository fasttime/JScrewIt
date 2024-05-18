import { formatValue, formatValueType } from '../../src/result-format';
import * as assert                      from 'assert';
import type { ParamOrParamInfo }        from 'ebdd';

interface ParamData
{
    0:          string;
    1:          unknown;
    2:          string | undefined;
    3?:         string;
    doBefore?:  () => void;
    doAfter?:   () => void;
}

function createSparseArray(): unknown[]
{
    const sparseArray = [];
    sparseArray[5] = 'foo';
    return sparseArray;
}

function createSparseSingletonArray(): unknown[]
{
    const sparseSingletonArray: unknown[] = [];
    sparseSingletonArray.length = 1;
    return sparseSingletonArray;
}

function createTypeUnknownObjParamData(): ParamData
{
    const obj = Object.create(new Date()) as object;
    obj.toString = (): string => 'foo';
    const paramData: ParamData = ['a strange object', obj, 'foo', 'an object'];
    if (typeof Symbol !== 'undefined')
    {
        if ('toStringTag' in Symbol)
        {
            Object.defineProperty(obj, Symbol.toStringTag, { get: throwError });
            return paramData;
        }
    }
    const { toString } = Object.prototype;
    paramData.doBefore =
    (): void =>
    {
        const toStringCall =
        (arg: unknown): string =>
        {
            if (arg !== obj)
            {
                const str = Function.prototype.call.call(toString, arg) as string;
                return str;
            }
            throwError();
        };
        toString.call = toStringCall as typeof toString.call;
    };
    paramData.doAfter =
    (): void =>
    {
        // @ts-expect-error
        delete toString.call;
    };

    return paramData;
}

function createUnmappableArray(): Omit<unknown[], 'map'>
{
    const unmappableArray = [] as Omit<unknown[], 'map'> & { map: unknown; };
    unmappableArray.map = undefined;
    return unmappableArray;
}

function throwError(): never
{
    throw Error();
}

const paramDataList: ParamOrParamInfo<Readonly<ParamData>>[] =
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
        ['a symbol', typeof Symbol !== 'undefined' && Symbol('foo'), 'Symbol(foo)'],
    ),
    when
    (
        typeof BigInt !== 'undefined',
        [
            'a bigint',
            typeof (BigInt as (BigIntConstructor | undefined)) !== 'undefined' && BigInt(1),
            '1n',
        ],
    ),
    ['an empty array', [], '[]', 'an empty array'],
    ['a one element array', [''], '[""]', 'a one element array'],
    ['an array with more elements', [1, 2], '[1, 2]', 'an array'],
    ['a nesting of arrays', [[], [{ }]], '[[], […]]', 'an array'],
    ['a sparse array', createSparseArray(), '[, , , , , "foo"]', 'an array'],
    ['a sparse singleton array', createSparseSingletonArray(), '[]', 'a one element array'],
    ['an unmappable array', createUnmappableArray(), undefined, 'an empty array'],
    when
    (
        typeof document !== 'undefined',
        [
            'document.all',
            typeof (document as (Document | undefined)) !== 'undefined' && document.all,
            ,
            'an object',
        ],
    ),
    ['a plain object', { }, '[object Object]', 'an object'],
    ['a function', Function(), , 'a function'],
    ['a regular expression', /./, '/./', 'a regular expression'],
    ['a date', new Date(), , 'a date'],
    ['an object that throws errors', { toString: throwError }, undefined, 'an object'],
    createTypeUnknownObjParamData(),
];

describe.per(paramDataList)
(
    'Given #[0]',
    (paramData): void =>
    {
        const { 1: input, 2: expectedValue, 3: expectedValueType, doBefore, doAfter } = paramData;
        const expectedValueProvided = 2 in paramData;
        if (doBefore)
            before(doBefore);
        if (doAfter)
            after(doAfter);
        if (expectedValueProvided)
        {
            it
            (
                'formatValue returns the expected result',
                (): void =>
                {
                    const actualValue = formatValue(input);
                    assert.strictEqual(actualValue, expectedValue);
                },
            );
        }
        it
        (
            'formatValueType returns the expected result',
            (): void =>
            {
                const actualValueType = formatValueType(input);
                assert.strictEqual(actualValueType, expectedValueType);
            },
        );
    },
);
