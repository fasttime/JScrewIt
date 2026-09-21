import { SCREW_AS_BONDED_STRING, SCREW_AS_STRING, SCREW_NORMAL }    from '../screw-buffer';
import { replaceStaticString }                                      from './encoder-utils';

// Length of the shortest possible concat head replacement "[]".
var CONCAT_HEAD_MIN_LENGTH      = 2;

// The overhead of "[" + "]" plus the minimum concat head replacement length.
var CONCAT_HEAD_MIN_OVERHEAD    = 2 + CONCAT_HEAD_MIN_LENGTH;

// Length of the shortest possible concat part replacements "+[]" and "![]".
var CONCAT_PART_MIN_LENGTH      = 3;

// The overhead of "[" + "](" + ")" plus the minimum concat part replacement length.
var CONCAT_PART_MIN_OVERHEAD    = 4 + CONCAT_PART_MIN_LENGTH;

// Length of the shortest possible joiner replacement "[]".
var JOINER_MIN_LENGTH           = 2;

// The overhead of "[" + "](" + ")" plus the minimum joiner replacement length.
var JOINING_MIN_OVERHEAD        = 4 + JOINER_MIN_LENGTH;

// Length of the shortest possible separator replacement "[]".
var SEPARATOR_MIN_LENGTH        = 2;

// The overhead of "[" + "](" + ")" plus the minimum separator replacement length.
var SEPARATION_MIN_OVERHEAD     = 4 + SEPARATOR_MIN_LENGTH;

// Length of the shortest possible sequence replacement "([]+[])".
var SEQUENCE_MIN_LENGTH         = 7;

/**
 * An object that exposes properties used to split a string into an array of strings or to join
 * array elements into a string.
 *
 * @typedef Delimiter
 *
 * @property {string} separator
 * An express-parsable expression used as an argument for `String.prototype.split` to split a string
 * into an array of strings.
 *
 * @property {string} joiner
 * The joiner can be any string. A joiner is inserted between adjacent strings in an array in order
 * to join them into a single string.
 */

function createConcatenationReplacement
(encoder, array, allowZeroForEmptyElements, forceString, maxLength)
{
    var concatReplacement = encoder.resolveConstant('CONCAT').replacement;
    var concatCount = array.length - 1;
    maxLength -=
    CONCAT_HEAD_MIN_OVERHEAD + concatCount * (concatReplacement.length + CONCAT_PART_MIN_OVERHEAD);
    if (maxLength < 0)
        return;
    var options = { screwMode: forceString ? SCREW_AS_STRING : SCREW_NORMAL };
    var replacements = [];
    for (var index = 0; index <= concatCount; index++)
    {
        var element = array[index];
        var elementReplacement = undefinedAsString(replaceStaticString(element, options));
        var minLength = index ? CONCAT_PART_MIN_LENGTH : CONCAT_HEAD_MIN_LENGTH;
        if (index)
        {
            if (elementReplacement === '[]')
                elementReplacement = allowZeroForEmptyElements ? '+[]' : '[[]]';
            replacements.push('[', concatReplacement, '](', elementReplacement, ')');
        }
        else
            replacements.push('[', elementReplacement, ']');
        maxLength -= elementReplacement.length - minLength;
        if (maxLength < 0)
            return;
    }
    var concatenationReplacement = replacements.join('');
    return concatenationReplacement;
}

function createSubstitutionsReplacement(encoder, substitutions, maxLength)
{
    var substitutionCount = substitutions ? substitutions.length : 0;
    if (!substitutionCount)
        return '';
    var splitReplacement = encoder.resolveConstant('SPLIT').replacement;
    var joinReplacement = encoder.resolveConstant('JOIN').replacement;
    maxLength -=
    substitutionCount *
    (
        splitReplacement.length + SEPARATION_MIN_OVERHEAD +
        joinReplacement.length + JOINING_MIN_OVERHEAD
    );
    if (maxLength < 0)
        return;
    var replacements = [];
    for (var index = 0; index < substitutionCount; index++)
    {
        var substitution = substitutions[index];
        var separatorReplacement = undefinedAsString(encoder.replaceExpr(substitution.separator));
        var joinerReplacement = undefinedAsString(encoder.replaceString(substitution.joiner));
        maxLength -=
        separatorReplacement.length - SEPARATOR_MIN_LENGTH +
        joinerReplacement.length - JOINER_MIN_LENGTH;
        if (maxLength < 0)
            return;
        replacements.push
        (
            '[',
            splitReplacement,
            '](',
            separatorReplacement,
            ')[',
            joinReplacement,
            '](',
            joinerReplacement,
            ')'
        );
    }
    var substitutionsReplacement = replacements.join('');
    return substitutionsReplacement;
}

function replaceJoinedArrayString(array, joiner, maxLength)
{
    var str = array.join(joiner);
    var options = { maxLength: maxLength, screwMode: SCREW_AS_BONDED_STRING };
    var replacement = replaceStaticString(str, options);
    return replacement;
}

/**
 * Replaces a given array of statically replaceable strings with equivalent JSFuck code.
 *
 * @function Encoder#replaceStringArray
 *
 * @param {string[]} array
 * The string array to replace. Empty arrays are not supported.
 *
 * @param {Delimiter[]} insertions
 * An array of delimiters of which at most one will be used to compose a joined string and split it
 * into an array of strings. Every joiner in the insertions must be a statically replaceable string.
 *
 * The encoder can pick an insertion and insert a joiner between any two adjacent elements to mark
 * the boundary between them. The separator is then used to split the concatenated string back into
 * its elements.
 *
 * @param {Delimiter[] | null} [substitutions]
 * An array of delimiters, specifying substitutions to be applied to the input elements.
 *
 * All substitutions are applied on each element of the input array, in the order they are
 * specified.
 *
 * Substitutions are expensive in two ways: they create additional overhead and prevent certain
 * optimizations for short arrays to be made. To allow all optimizations to be performed, omit this
 * argument or set it to null instead of specifying an empty array.
 *
 * @param {boolean} [allowZeroForEmptyElements = false]
 * Indicates whether empty string elements in the input array may be replaced with zeros.
 *
 * @param {boolean} [forceString = false]
 * Indicates whether the elements in the replacement expression should evaluate to strings.
 *
 * If this argument is falsy, the elements in the replacement expression may not be equal to those
 * in the input array, but will have the same string representation.
 *
 * Regardless of this argument, the string representation of the value of the whole replacement
 * expression will be always the same as the string representation of the input array after applying
 * substitutions (including optional empty string to zero replacements) to its elements.
 *
 * @param {number} [maxLength = NaN]
 * The maximum length of the replacement expression.
 *
 * If the replacement expression exceeds the specified length, the return value is `undefined`.
 *
 * If this parameter is `NaN`, then no length limit is imposed.
 *
 * @returns {string | undefined}
 * The replacement string or `undefined`.
 */
export default function replaceStringArray
(array, insertions, substitutions, allowZeroForEmptyElements, forceString, maxLength)
{
    var replacement;
    var count = array.length;
    // Don't even try the split approach for two or less elements if the concat approach can be
    // applied.
    if (substitutions || count > 2)
    {
        var splitReplacement = this.resolveConstant('SPLIT').replacement;
        var maxSubstitutionsReplacementLength =
        maxLength -
        SEQUENCE_MIN_LENGTH -
        splitReplacement.length -
        SEPARATION_MIN_OVERHEAD;
        var substitutionsReplacement =
        createSubstitutionsReplacement(this, substitutions, maxSubstitutionsReplacementLength);
    }
    if (substitutionsReplacement != null)
    // Approach 1: (array[0] + joiner + array[1] + joiner + array[2]...).split(separator)
    {
        var maxBulkLength =
        maxLength - substitutionsReplacement.length - splitReplacement.length -
        SEPARATION_MIN_OVERHEAD + SEPARATOR_MIN_LENGTH;
        var optimalSeqReplacement;
        var optimalSeparatorReplacement;
        insertions.forEach
        (
            function (insertion)
            {
                var seqReplacement =
                replaceJoinedArrayString(array, insertion.joiner, maxBulkLength);
                if (!seqReplacement)
                    return;
                var separatorReplacement = undefinedAsString(this.replaceExpr(insertion.separator));
                var bulkLength = seqReplacement.length + separatorReplacement.length;
                if (!(bulkLength > maxBulkLength))
                {
                    maxBulkLength = bulkLength;
                    optimalSeqReplacement = seqReplacement;
                    optimalSeparatorReplacement = separatorReplacement;
                }
            },
            this
        );
        if (optimalSeqReplacement)
        {
            replacement =
            optimalSeqReplacement + substitutionsReplacement + '[' + splitReplacement + '](' +
            optimalSeparatorReplacement + ')';
            maxLength = replacement.length - 1;
        }
    }
    if (!substitutions)
    // Approach 2: [array[0]].concat(array[1]).concat(array[2])...
    {
        var arrayReplacement =
        createConcatenationReplacement
        (this, array, allowZeroForEmptyElements, forceString, maxLength);
        if (arrayReplacement)
            replacement = arrayReplacement;
    }
    return replacement;
}

function undefinedAsString(replacement)
{
    if (replacement === '[][[]]')
        replacement += '+[]';
    return replacement;
}
