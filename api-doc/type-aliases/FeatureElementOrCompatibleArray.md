[**JScrewIt**](../README.md)

***

# Type Alias: FeatureElementOrCompatibleArray

> **FeatureElementOrCompatibleArray**: [`FeatureElement`](FeatureElement.md) \| readonly [`FeatureElement`](FeatureElement.md)[]

A feature object, a name or alias of a predefined feature, or an array of such values that
defines a union of mutually compatible features.

## Remarks

Methods that accept parameters of this type throw an error if the specified value is neither a
feature object nor a name or alias of a predefined feature, or if it is an array of values that
does not define a union of mutually compatible features.
