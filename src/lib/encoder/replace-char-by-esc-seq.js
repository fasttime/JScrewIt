import { createEmpty }  from '../obj-utils';
import hexCodeOf        from './hex-code-of';

var LOW_UNICODE_ESC_SEQ_CODES;

export default function replaceCharByEscSeq(charCode)
{
    var escCode;
    var appendIndexer;
    var toStringOpt;
    if (charCode >= 0x10000)
    {
        escCode = 'u{' + hexCodeOf(this, charCode) + '}';
        appendIndexer = false;
        toStringOpt = true;
    }
    else if (charCode >= 0xfd || charCode in LOW_UNICODE_ESC_SEQ_CODES)
    {
        escCode = 'u' + hexCodeOf(this, charCode, 4);
        appendIndexer = escCode.length > 5;
        toStringOpt = true;
    }
    else
    {
        escCode = charCode.toString(8);
        appendIndexer = false;
        toStringOpt = false;
    }
    var expr = 'Function("return\\"\\\\' + escCode + '\\"")()';
    if (appendIndexer)
        expr += '[0]';
    var replacement = this.replaceExpr(expr, { default: false, toStringOpt: toStringOpt });
    return replacement;
}

LOW_UNICODE_ESC_SEQ_CODES = createEmpty();

[
    0x0f, 0x1f, 0x2f, 0x3f, 0x6f, 0x7f, 0xaf, 0xdf, 0xef,
    0xf0, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xfa,
]
.forEach
(
    function (charCode)
    {
        LOW_UNICODE_ESC_SEQ_CODES[charCode] = null;
    }
);
