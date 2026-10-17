import { FROM_CHAR_CODE } from '../definitions';

export default function replaceCharByCharCode(codePoint)
{
    var fromCharCode = codePoint < 0x10000 ? this.findDefinition(FROM_CHAR_CODE) : 'fromCodePoint';
    var fromCharCodeReplacement = this.replaceString(fromCharCode, { optimize: true });
    var arg;
    if (codePoint === 0)
        arg = '[]';
    else if (codePoint === 1)
        arg = 'true';
    else if (codePoint < 10)
        arg = '' + codePoint;
    else
        arg = '"' + codePoint + '"';
    var argReplacement = this.replaceExpr(arg);
    var replacement =
    this.replaceExpr('String') + '[' + fromCharCodeReplacement + '](' + argReplacement + ')';
    return replacement;
}
