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

var staticEncoder;
