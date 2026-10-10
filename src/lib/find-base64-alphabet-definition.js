import { _Array_isArray } from './obj-utils';

export default function findBase64AlphabetDefinition(encoder, element)
{
    var definition;
    if (_Array_isArray(element))
        definition = encoder.findDefinition(element);
    else
        definition = element;
    return definition;
}
