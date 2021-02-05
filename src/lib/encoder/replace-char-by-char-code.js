export default function replaceCharByCharCode(charCode)
{
    var arg;
    if (charCode === 0)
        arg = '[]';
    else if (charCode === 1)
        arg = 'true';
    else if (charCode < 10)
        arg = charCode;
    else
        arg = '"' + charCode + '"';
    var replacement = this.replaceExpr('String[FROM_CHAR_CODE](' + arg + ')');
    return replacement;
}
