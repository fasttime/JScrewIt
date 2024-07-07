function formatItem(value: unknown): string | undefined
{
    let text;
    const type = typeof value;
    try
    {
        if (type === 'string')
            text = `"${value}"`;
        else if (value === 0 && 1 / value < 0)
            text = '-0';
        else if (Array.isArray(value))
            text = value.length ? '[…]' : '[]';
        else if (type === 'bigint')
            text = `${value}n`;
        // In Node.js 0.12, calling String with a symbol argument throws a TypeError.
        // Since this script is only used in browsers this is not a true problem, but still.
        else if (type !== 'symbol')
            text = String(value);
        else
            text = (value as symbol).toString();
    }
    catch
    { }
    return text;
}

export function formatValue(value: unknown): string | undefined
{
    let text;
    if (Array.isArray(value))
    {
        try
        {
            text = `[${value.map(formatItem).join(', ')}]`;
        }
        catch
        { }
    }
    else
        text = formatItem(value);
    return text;
}

export function formatValueType(value: unknown): string | undefined
{
    let valueType;
    if (value !== null)
    {
        const type = typeof value;
        // document.all has type "undefined".
        if  (type === 'function' || type === 'object' || type === 'undefined')
        {
            const prototype = Object.getPrototypeOf(value) as unknown;
            if (prototype === Array.prototype)
            {
                switch ((value as unknown[]).length)
                {
                case 0:
                    valueType = 'an empty array';
                    break;
                case 1:
                    valueType = 'a one element array';
                    break;
                default:
                    valueType = 'an array';
                    break;
                }
            }
            else if (prototype === Date.prototype)
                valueType = 'a date';
            else if (prototype === RegExp.prototype)
                valueType = 'a regular expression';
            else if (type === 'function')
                valueType = 'a function';
            else
                valueType = 'an object';
        }
    }
    return valueType;
}
