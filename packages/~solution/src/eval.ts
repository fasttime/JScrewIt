export const INVALID_EXPR = { };

export function evalExpr(expr: string): unknown
{
    const value = tryEvalExpr(expr);
    if (value === INVALID_EXPR)
        throw SyntaxError(`Invalid expression ${expr}`);
    return value;
}

export function tryEvalExpr(expr: string): unknown
{
    let fn: () => unknown;
    try
    {
        fn = Function(`return(${expr});`) as () => unknown;
    }
    catch
    {
        return INVALID_EXPR;
    }
    const value: unknown = fn();
    return value;
}
