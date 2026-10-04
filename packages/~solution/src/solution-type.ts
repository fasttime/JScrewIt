import { evalExpr, tryEvalExpr }    from './eval';
import { makeIsAttr }               from './type-set';

export enum SolutionType
{
    UNDEFINED               = 0b1,
    ALGEBRAIC               = 0b10,
    WEAK_ALGEBRAIC          = 0b100,
    OBJECT                  = 0b1000,
    STRING                  = 0b10000,
    PREFIXED_STRING         = 0b100000,
    WEAK_PREFIXED_STRING    = 0b1000000,
    COMBINED_STRING         = 0b10000000,
}

/* istanbul ignore next */
export namespace SolutionType
{
    export const isLoose =
    makeIsAttr
    (
        SolutionType.WEAK_ALGEBRAIC,
        SolutionType.PREFIXED_STRING,
        SolutionType.WEAK_PREFIXED_STRING,
        SolutionType.COMBINED_STRING,
    );

    export const isString =
    makeIsAttr
    (
        SolutionType.STRING,
        SolutionType.PREFIXED_STRING,
        SolutionType.WEAK_PREFIXED_STRING,
        SolutionType.COMBINED_STRING,
    );

    export const isWeak =
    makeIsAttr(SolutionType.WEAK_ALGEBRAIC, SolutionType.WEAK_PREFIXED_STRING);
}

Object.freeze(SolutionType);

export const calculateSolutionType =
(replacement: string): SolutionType | undefined =>
{
    const value = evalExpr(replacement);
    if (value === undefined || value ===  null)
        return SolutionType.UNDEFINED;
    switch (typeof value as string)
    {
    case 'boolean':
        return SolutionType.ALGEBRAIC;
    case 'number':
        {
            const type =
            isJSFuckWeak(replacement, value) ? SolutionType.WEAK_ALGEBRAIC : SolutionType.ALGEBRAIC;
            return type;
        }
    case 'object':
    case 'function':
        return SolutionType.OBJECT;
    case 'string':
        {
            const type =
            isJSFuckCombined(replacement, value) ?
            isJSFuckPrefixed(replacement, value) ?
            isJSFuckWeak(replacement, value) ?
            SolutionType.WEAK_PREFIXED_STRING :
            SolutionType.PREFIXED_STRING :
            SolutionType.COMBINED_STRING :
            SolutionType.STRING;
            return type;
        }
    }
};

const isJSFuckCombined =
(replacement: string, value: unknown): boolean => !value !== tryEvalExpr(`!${replacement}`);

const isJSFuckPrefixed =
(replacement: string, value: unknown): boolean => `0${value}` !== tryEvalExpr(`0+${replacement}`);

const isJSFuckWeak =
(replacement: string, value: unknown): boolean => `${value}` !== tryEvalExpr(`""+${replacement}`);
