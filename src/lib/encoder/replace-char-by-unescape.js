import hexCodeOf from './hex-code-of';

export default function replaceCharByUnescape(charCode)
{
    var hexCode;
    var appendIndexer;
    var toStringOpt;
    if (charCode < 0x100)
    {
        hexCode = hexCodeOf(this, charCode, 2);
        appendIndexer = hexCode.length > 2;
        toStringOpt = false;
    }
    else
    {
        hexCode = 'u' + hexCodeOf(this, charCode, 4);
        appendIndexer = hexCode.length > 5;
        toStringOpt = true;
    }
    var expr = 'unescape("%' + hexCode + '")';
    if (appendIndexer)
        expr += '[0]';
    var replacement = this.replaceExpr(expr, { default: false, toStringOpt: toStringOpt });
    return replacement;
}
