import
{
    APPEND_LENGTH_OF_DIGITS,
    APPEND_LENGTH_OF_DIGIT_0,
    APPEND_LENGTH_OF_DOT,
    APPEND_LENGTH_OF_MINUS,
    APPEND_LENGTH_OF_SMALL_E,
}
from '../append-lengths';
import { _Array_prototype_forEach_call, _String }   from '../obj-utils';
import { extraZeros }                               from './encoder-utils';

function evalNumber(preMantissa, lastDigit, exp)
{
    var value = +(preMantissa + lastDigit + 'e' + exp);
    return value;
}

export default function formatPositiveNumber(number)
{
    function getMantissa()
    {
        var lastDigitIndex = usefulDigits - 1;
        var preMantissa = digits.slice(0, lastDigitIndex);
        var lastDigit = +digits[lastDigitIndex];
        var value = evalNumber(preMantissa, lastDigit, exp);
        for (;;)
        {
            var decreasedLastDigit = lastDigit - 1;
            var newValue = evalNumber(preMantissa, decreasedLastDigit, exp);
            if (newValue !== value)
                break;
            lastDigit = decreasedLastDigit;
        }
        var mantissa = preMantissa + lastDigit;
        return mantissa;
    }

    var str;
    var match = /^(\d+)(?:\.(\d+))?(?:e(.+))?$/.exec(number);
    var digitsAfterDot = match[2] || '';
    var digits = (match[1] + digitsAfterDot).replace(/^0+/, '');
    var usefulDigits = digits.search(/0*$/);
    var exp = (match[3] | 0) - digitsAfterDot.length + digits.length - usefulDigits;
    var mantissa = getMantissa();
    if (exp >= 0)
    {
        if (exp < 10)
            str = mantissa + extraZeros(exp);
        else if (exp % 100 === 99 && (exp > 99 || mantissa[1]))
            str = mantissa.replace(/.$/, '.$&e') + (exp + 1);
        else
            str = mantissa + 'e' + exp;
    }
    else
    {
        if (exp >= -mantissa.length)
            str = mantissa.slice(0, exp) + '.' + mantissa.slice(exp);
        else
        {
            var extraZeroCount = -mantissa.length - exp;
            var extraLength = APPEND_LENGTH_OF_DOT + APPEND_LENGTH_OF_DIGIT_0 * extraZeroCount;
            str =
            replaceNegativeExponential(mantissa, exp, extraLength) ||
            '.' + extraZeros(extraZeroCount) + mantissa;
        }
    }
    return str;
}

function getMultiDigitLength(str)
{
    var appendLength = 0;
    _Array_prototype_forEach_call
    (
        str,
        function (digit)
        {
            var digitAppendLength = APPEND_LENGTH_OF_DIGITS[digit];
            appendLength += digitAppendLength;
        }
    );
    return appendLength;
}

function replaceNegativeExponential(mantissa, exp, rivalExtraLength)
{
    var extraZeroCount;
    if (exp % 100 > 7 - 100)
    {
        if (exp % 10 > -7)
            extraZeroCount = 0;
        else
            extraZeroCount = 10 + exp % 10;
    }
    else
        extraZeroCount = 100 + exp % 100;
    mantissa += extraZeros(extraZeroCount);
    exp -= extraZeroCount;
    var extraLength =
    APPEND_LENGTH_OF_DIGIT_0 * extraZeroCount +
    APPEND_LENGTH_OF_SMALL_E +
    APPEND_LENGTH_OF_MINUS +
    getMultiDigitLength(_String(-exp));
    if (extraLength < rivalExtraLength)
    {
        var str = mantissa + 'e' + exp;
        return str;
    }
}
