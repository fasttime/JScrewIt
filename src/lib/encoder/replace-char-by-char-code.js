import { FROM_CHAR_CODE } from '../definitions';

export default function replaceCharByCharCode(charCode)
{
    var fromCharCode = charCode < 0x10000 ? this.findDefinition(FROM_CHAR_CODE) : 'fromCodePoint';
    var fromCharCodeReplacement = this.replaceString(fromCharCode, { optimize: true });
    var arg;
    if (charCode === 0)
        arg = '[]';
    else if (charCode === 1)
        arg = 'true';
    else if (charCode < 10)
        arg = '' + charCode;
    else
        arg = '"' + charCode + '"';
    var argReplacement = this.replaceExpr(arg);
    var replacement =
    this.replaceExpr('String') + '[' + fromCharCodeReplacement + '](' + argReplacement + ')';
    return replacement;
}
