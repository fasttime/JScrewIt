import { evalExpr, tryEvalExpr } from './eval';

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
                isWeak(replacement, value) ? SolutionType.WEAK_ALGEBRAIC : SolutionType.ALGEBRAIC;
                return type;
            }
        case 'object':
        case 'function':
            return SolutionType.OBJECT;
        case 'string':
            {
                const type =
                isCombined(replacement, value) ?
                isPrefixed(replacement, value) ?
                isWeak(replacement, value) ?
                SolutionType.WEAK_PREFIXED_STRING :
                SolutionType.PREFIXED_STRING :
                SolutionType.COMBINED_STRING :
                SolutionType.STRING;
                return type;
            }
    }
};

const isCombined =
(replacement: string, value: unknown): boolean => !value !== tryEvalExpr(`!${replacement}`);

const isPrefixed =
(replacement: string, value: unknown): boolean => `0${value}` !== tryEvalExpr(`0+${replacement}`);

const isWeak =
(replacement: string, value: unknown): boolean => `${value}` !== tryEvalExpr(`""+${replacement}`);
