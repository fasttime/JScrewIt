import JScrewIt from '#jscrewit';

const { createEncoder, getStrategies } = JScrewIt.debug;

// Element pools
//
// Every pool is an ordered list of Unicode characters, including supplementary characters, with the
// best elements first.
// Pools are computed lazily because ranking all characters takes a few seconds.

// BMP characters from U+0100 upwards with the shortest decimal encoding of their character codes.
// Characters below U+0100 are excluded because their plain encoding can use the `atob`-based
// encoding, which is shorter than an encoding based on character codes.
// From U+0100 upwards, the plain encoding of a character is based on its character code, so the
// encoded length is the same for plain and for `byCharCodes`: `byCharCodes` is more efficient for
// inputs consisting of multiple UTF-16 code units because it adds the overhead of
// `String.fromCharCode` only once for the entire input.
const CHEAP_CHAR_CODE_CHARS = () => rankCodePoints(0x100, 0xffff, code => -base10Cost(code));

// BMP characters ranked by the shorter of the decimal and base 4 encodings of their character
// codes.
// The plain encoding of these characters is very long, and the encoding of their character codes is
// long both in base 10 and in base 4, so that a dictionary of them is cheaper than the character
// codes of all their occurrences.
// Cyclic repetitions of these characters are used to test the dictionary-based and figure-based
// strategies.
const DICT_CHARS =
() => rankCodePoints(0x80, 0xffff, code => Math.min(base10Cost(code), base4Cost(code)));

// BMP characters with the longest decimal encoding of their character codes.
// The plain encoding of these characters is very long, and their character codes are expensive for
// byCharCodes, which is the closest rival of byDict.
const EXPENSIVE_DECIMAL_CHARS = () => rankCodePoints(0x80, 0xffff, code => base10Cost(code));

// Supplementary characters whose surrogate pairs are much longer when encoded as two decimal
// character codes than as one decimal code point.
const PRO_CODE_POINTS =
() =>
rankCodePoints
(
    0x10000,
    0x10ffff,
    code =>
    {
        const str = String.fromCodePoint(code);
        const score =
        base10Cost(str.charCodeAt(0)) + base10Cost(str.charCodeAt(1)) - base10Cost(code);
        return score;
    },
);

// BMP characters whose character codes are much shorter when encoded in base 4 than in base 10.
const PRO_RADIX4_CHARS =
() => rankCodePoints(0x80, 0xffff, code => base10Cost(code) - base4Cost(code));

// Unicode characters whose code points are much shorter when encoded in base 4 than in base 10.
const PRO_RADIX4_CODE_POINTS =
() => rankCodePoints(0x80, 0x10ffff, code => base10Cost(code) - base4Cost(code));

function base4Cost(code)
{
    return cost(code.toString(4));
}

function base10Cost(code)
{
    return cost(String(code));
}

function cost(str)
{
    const { length } = digitEncoder.replaceString(str);
    return length;
}

/**
 * Builds a string of the specified length by cyclically repeating the first `count` elements of a
 * pool.
 * The requested length is measured in UTF-16 code units: if the pool contains supplementary
 * characters, the last one may be truncated to a lone surrogate.
 */
function cycle(elements, count, length)
{
    let str = '';
    for (let index = 0; str.length < length; index++)
        str += elements[index % count];
    str = str.slice(0, length);
    return str;
}

function data(features, elementSupplier, strategyName)
{
    rivalStrategyNames.push(strategyName);
    const inputCache = new Map();
    let evaluate;
    const createEvaluate =
    () =>
    {
        const encoder = createEncoder(features);
        const strategies = getStrategies();
        const strategy = strategies[strategyName];
        const rivals =
        data.rivalStrategyNames
        .map(rivalStrategyName => strategies[rivalStrategyName])
        .filter(rival => encoder.hasFeatures(rival.mask));
        const evaluate =
        input =>
        {
            const inputData = Object(input);
            const { length } = strategy.call(encoder, inputData);
            let margin = Infinity;
            for (const rival of rivals)
            {
                const rivalLength = rival.call(encoder, inputData).length;
                const diff = rivalLength - length;
                if (diff < margin)
                    margin = diff;
            }
            return margin;
        };
        return evaluate;
    };
    const createInput =
    length =>
    {
        let input = inputCache.get(length);
        if (input == null)
        {
            evaluate ??= createEvaluate();
            const elements = elementSupplier.value ??= elementSupplier();
            input = findBestInput(length, elements, evaluate);
            inputCache.set(length, input);
        }
        return input;
    };
    const data =
    {
        strategyName,
        createInput,
        features,
        get rivalStrategyNames()
        {
            const strategyNames =
            rivalStrategyNames.filter(thisStrategyName => thisStrategyName !== strategyName);
            return strategyNames;
        },
    };
    return data;
}

const COUNT_FACTOR = 1.2;

/**
 * Returns candidate counts of distinct elements for an input of the specified length.
 * The counts follow an approximately geometric progression with a small ratio to reduce the chance
 * of skipping a narrow optimum.
 */
function * elementCounts(length)
{
    for
    (let count = 1; count <= length; count = Math.max(count + 1, Math.floor(count * COUNT_FACTOR)))
        yield count;
}

/**
 * Finds the input of the specified length, built from a pool, that maximizes the strategy's output
 * length advantage over its rivals.
 * The margin of an input is the difference between the length of the shortest output produced by
 * any rival strategy and the length of the output produced by the strategy under test.
 */
function findBestInput(length, elements, evaluate)
{
    const margins = new Map();
    let bestMargin = -Infinity;
    let bestInput;
    let bestCount;
    const consider =
    (count, reverse) =>
    {
        const key = reverse ? -count : count;
        if (margins.has(key))
            return;
        const pool = reverse ? elements.slice(0, count).reverse() : elements;
        const input = cycle(pool, count, length);
        const margin = evaluate(input);
        margins.set(key, margin);
        if (margin > bestMargin)
        {
            bestMargin = margin;
            bestInput = input;
            bestCount = count;
        }
    };
    for (const count of elementCounts(length))
    {
        consider(count, false);
        consider(count, true);
    }
    // Refine around the best count until it stabilizes.
    let lastBestCount;
    do
    {
        lastBestCount = bestCount;
        for (let exp = -1; exp <= 1; exp += 1 / 10)
        {
            const factor = COUNT_FACTOR ** exp;
            const count = Math.round(lastBestCount * factor);
            consider(count, false);
            consider(count, true);
        }
    }
    while (lastBestCount !== bestCount);
    return bestInput;
}

function isSurrogate(code)
{
    const surrogate = code >= 0xd800 && code <= 0xdfff;
    return surrogate;
}

/**
 * Returns all Unicode characters from `from` to `to`, excluding surrogates, sorted by descending
 * score.
 * Characters with equal scores keep their natural order.
 */
function rankCodePoints(from, to, score)
{
    const entries = [];
    for (let code = from; code <= to; code++)
    {
        if (!isSurrogate(code))
            entries.push({ code, score: score(code) });
    }
    entries.sort((entry1, entry2) => entry2.score - entry1.score);
    const elements = entries.map(({ code }) => String.fromCodePoint(code));
    return elements;
}

const digitEncoder = createEncoder();

const rivalStrategyNames = ['plain'];

// Each entry in this list describes a test for one encoding strategy: the features under which the
// strategy is expected to perform best, and a function `createInput` that returns, for a given
// input length, an input that the strategy should encode more compactly than any rival strategy.
// The inputs are used to verify the strategy's `minInputLength` and to optimize its features.
//
// The purpose of `createInput` is to produce an input that lets the strategy win at the shortest
// possible length, so that `minInputLength` can be set as low as possible without excluding the
// strategy from an input for which it would be optimal.
//
// All inputs share the same structure: the first elements of an ordered pool are repeated until the
// requested length is reached. The number of distinct elements is the key parameter, and it depends
// on the input length. Therefore, `createInput` searches for the number of distinct elements that
// maximizes the strategy's advantage over its rivals at the requested length and with the
// configured features.

export default
[
    data
    (
        ['ARRAY_ITERATOR', 'CAPITAL_HTML', 'NO_V8_SRC', 'STATUS'],
        CHEAP_CHAR_CODE_CHARS,
        'byCharCodes',
    ),
    data
    (
        [
            'ARRAY_ITERATOR',
            'ARROW',
            'AT',
            'CAPITAL_HTML',
            'CONSOLE',
            'FLAT',
            'STATUS',
            'V8_SRC',
        ],
        PRO_RADIX4_CHARS,
        'byCharCodesRadix4',
    ),
    data
    (
        ['BARPROP', 'CAPITAL_HTML', 'FROM_CODE_POINT', 'STATUS'],
        PRO_CODE_POINTS,
        'byCodePoints',
    ),
    data
    (
        [
            'ARRAY_ITERATOR',
            'ARROW',
            'AT',
            'BARPROP',
            'CONSOLE',
            'FLAT',
            'FROM_CODE_POINT',
            'ITERATOR_HELPER',
            'NO_IE_SRC',
            'STATUS',
        ],
        PRO_RADIX4_CODE_POINTS,
        'byCodePointsRadix4',
    ),
    data
    (
        ['ARRAY_ITERATOR', 'ARROW', 'AT', 'CAPITAL_HTML', 'FF_SRC'],
        DICT_CHARS,
        'byDenseFigures',
    ),
    data
    (
        ['ARRAY_ITERATOR', 'ITERATOR_HELPER', 'NO_V8_SRC'],
        EXPENSIVE_DECIMAL_CHARS,
        'byDict',
    ),
    data
    (
        [
            'ARRAY_ITERATOR',
            'ARROW',
            'AT',
            'BARPROP',
            'CONSOLE',
            'FF_SRC',
            'FLAT',
            'FROM_CODE_POINT',
            'ITERATOR_HELPER',
        ],
        DICT_CHARS,
        'byDictRadix3AmendedBy1',
    ),
    data
    (
        [
            'ARROW',
            'AT',
            'BARPROP',
            'CONSOLE',
            'FF_SRC',
            'FLAT',
            'FROM_CODE_POINT',
            'INCR_CHAR',
            'ITERATOR_HELPER',
            'OBJECT_W_SELF',
        ],
        DICT_CHARS,
        'byDictRadix4',
    ),
    data
    (
        [
            'ARRAY_ITERATOR',
            'ARROW',
            'AT',
            'BARPROP',
            'CONSOLE',
            'FF_SRC',
            'FLAT',
            'FROM_CODE_POINT',
            'INCR_CHAR',
            'ITERATOR_HELPER',
        ],
        DICT_CHARS,
        'byDictRadix4AmendedBy1',
    ),
    data
    (
        [
            'ARRAY_ITERATOR',
            'ARROW',
            'AT',
            'BARPROP',
            'CONSOLE',
            'FF_SRC',
            'FLAT',
            'FROM_CODE_POINT',
            'ITERATOR_HELPER',
            'NAME',
        ],
        DICT_CHARS,
        'byDictRadix4AmendedBy2',
    ),
    data
    (
        ['ARROW', 'AT', 'CONSOLE', 'FF_SRC', 'FLAT', 'FROM_CODE_POINT', 'INCR_CHAR'],
        DICT_CHARS,
        'byDictRadix5',
    ),
    data
    (
        [
            'ARRAY_ITERATOR',
            'ARROW',
            'AT',
            'BARPROP',
            'CONSOLE',
            'FF_SRC',
            'FLAT',
            'FROM_CODE_POINT',
            'ITERATOR_HELPER',
        ],
        DICT_CHARS,
        'byDictRadix5AmendedBy2',
    ),
    data
    (
        [
            'ARRAY_ITERATOR',
            'ARROW',
            'AT',
            'BARPROP',
            'CONSOLE',
            'FLAT',
            'FROM_CODE_POINT',
            'ITERATOR_HELPER',
            'NO_IE_SRC',
        ],
        DICT_CHARS,
        'byDictRadix5AmendedBy3',
    ),
    data
    (
        ['ARROW', 'AT', 'CAPITAL_HTML', 'FF_SRC', 'FROM_CODE_POINT', 'NAME'],
        DICT_CHARS,
        'bySparseFigures',
    ),
];
