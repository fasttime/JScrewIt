import { SolutionType } from './solution-type';

export type TypeSet = number;

export function createTypeSet(...types: SolutionType[]): TypeSet
{
    let typeSet: TypeSet = 0;
    for (const type of types)
        typeSet |= type;
    return typeSet;
}

export const includesType =
(typeSet: TypeSet, type: SolutionType): boolean => (typeSet & type) !== 0;

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

function makeIsAttr(...types: SolutionType[]): (type: SolutionType) => boolean
{
    const typeSet = createTypeSet(...types);
    const is = (type: SolutionType): boolean => includesType(typeSet, type);
    return is;
}
