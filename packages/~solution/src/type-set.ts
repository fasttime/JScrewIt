import type { SolutionType } from './solution-type';

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

export function makeIsAttr(...types: SolutionType[]): (type: SolutionType) => boolean
{
    const typeSet = createTypeSet(...types);
    const is = (type: SolutionType): boolean => includesType(typeSet, type);
    return is;
}
