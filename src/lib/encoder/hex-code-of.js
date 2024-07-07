import { OPTIMAL_B }        from '../definitions';
import { extraZeros }       from './encoder-utils';
import { EMPTY_SOLUTION }   from '~solution';

var REPLACE_OPTIONS = { firstSolution: EMPTY_SOLUTION };

var REPLACE_SMALL_B_OPTIONS =
{ firstSolution: EMPTY_SOLUTION, optimize: { default: false, toStringOpt: true } };

export default function hexCodeOf(encoder, charCode, hexDigitCount)
{
    var optimalB = encoder.findDefinition(OPTIMAL_B);
    var charCodeStr = charCode.toString(16);
    var hexCodeSmallB;
    if (hexDigitCount)
    {
        var extraZeroCount = hexDigitCount - charCodeStr.length;
        hexCodeSmallB = extraZeros(extraZeroCount) + charCodeStr.replace(/fa?$/, 'false');
    }
    else
        hexCodeSmallB = charCodeStr;
    var hexCode = hexCodeSmallB.replace(/b/g, optimalB);
    if (optimalB !== 'b' && /(?=.*b.*b)(?=.*c)|(?=.*b.*b.*b)/.test(charCodeStr))
    {
        // optimalB is not "b", but the character code is a candidate for toString clustering, which
        // only works with "b".
        var replacementSmallB = encoder.replaceString(hexCodeSmallB, REPLACE_SMALL_B_OPTIONS);
        var replacement = encoder.replaceString(hexCode, REPLACE_OPTIONS);
        if (replacementSmallB.length < replacement.length)
            hexCode = hexCodeSmallB;
    }
    return hexCode;
}
