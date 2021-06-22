import { _Array, _Array_prototype_forEach_call } from '../obj-utils';

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

export function initStaticEncoder(encoder)
{
    staticEncoder = encoder;
}

export function replaceStaticExpr(expr)
{
    var solution = staticEncoder.replaceExpr(expr);
    return solution;
}

export function replaceStaticString(str, options)
{
    var replacement = staticEncoder.replaceString(str, options);
    return replacement;
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

var staticEncoder;
