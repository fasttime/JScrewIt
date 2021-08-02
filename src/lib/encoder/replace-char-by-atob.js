import
{
    BASE64_ALPHABET_HI_2,
    BASE64_ALPHABET_HI_4,
    BASE64_ALPHABET_HI_6,
    BASE64_ALPHABET_LO_2,
    BASE64_ALPHABET_LO_4,
    BASE64_ALPHABET_LO_6,
}
from '../definitions';
import { _Array_isArray, _String }          from '../obj-utils';
import { replaceStaticString, shortestOf }  from './encoder-utils';

function findBase64AlphabetDefinition(encoder, element)
{
    var definition;
    if (_Array_isArray(element))
        definition = encoder.findDefinition(element);
    else
        definition = element;
    return definition;
}

export default function replaceCharByAtob(charCode)
{
    var param1 = BASE64_ALPHABET_LO_6[charCode >> 2] + BASE64_ALPHABET_HI_2[charCode & 0x03];
    var postfix1 = '(' + this.replaceString(param1) + ')';
    if (param1.length > 2)
        postfix1 += replaceIndexer(0);

    var param2Left = findBase64AlphabetDefinition(this, BASE64_ALPHABET_LO_4[charCode >> 4]);
    var param2Right = findBase64AlphabetDefinition(this, BASE64_ALPHABET_HI_4[charCode & 0x0f]);
    var param2 = param2Left + param2Right;
    var index2 = 1 + (param2Left.length - 2) / 4 * 3;
    var indexer2 = replaceIndexer(index2);
    var postfix2 = '(' + this.replaceString(param2) + ')' + indexer2;

    var param3Left = BASE64_ALPHABET_LO_2[charCode >> 6];
    var param3 = param3Left + BASE64_ALPHABET_HI_6[charCode & 0x3f];
    var index3 = 2 + (param3Left.length - 3) / 4 * 3;
    var indexer3 = replaceIndexer(index3);
    var postfix3 = '(' + this.replaceString(param3) + ')' + indexer3;

    var postfix = shortestOf(postfix1, postfix2, postfix3);
    var replacement = this.resolveConstant('atob').replacement + postfix;
    return replacement;
}

function replaceIndexer(index)
{
    var indexStr = _String(index);
    var replacement = '[' + replaceStaticString(indexStr) + ']';
    return replacement;
}
