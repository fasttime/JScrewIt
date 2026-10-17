import { _Array, _Array_prototype_forEach_call, _Array_prototype_slice_call } from './obj-utils';

export function codePointFromSurrogatePair(highSurrogateCharCode, lowSurrogateCharCode)
{
    // 0x2400 = 0x10000 - 0xdc00
    var codePoint = (highSurrogateCharCode - 0xd800 << 10) + lowSurrogateCharCode + 0x2400;
    return codePoint;
}

export function extraZeros(count)
{
    var extraZeros = _Array(count + 1).join('0');
    return extraZeros;
}

export function joinWithMaxLength(maxLength)
{
    for (var index = arguments.length; ;)
    {
        if (maxLength < 0)
            return;
        if (--index < 1)
            break;
        var str = arguments[index];
        maxLength -= str.length;
    }
    var array = _Array_prototype_slice_call(arguments, 1);
    var result = array.join('');
    return result;
}

export function shortestOf()
{
    var shortestObj;
    var shortestLength = Infinity;
    _Array_prototype_forEach_call
    (
        arguments,
        function (obj)
        {
            var length = obj.length;
            if (length < shortestLength)
            {
                shortestObj = obj;
                shortestLength = length;
            }
        }
    );
    return shortestObj;
}
