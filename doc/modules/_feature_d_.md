[JScrewIt](../README.md) > ["feature.d"](../modules/_feature_d_.md)

# External module: "feature.d"

## Index

### Interfaces

* [Feature](../interfaces/_feature_d_.feature.md)
* [FeatureConstructor](../interfaces/_feature_d_.featureconstructor.md)
* [JScrewIt](../interfaces/_feature_d_.jscrewit.md)

### Type aliases

* [CompatibleFeatureArray](_feature_d_.md#compatiblefeaturearray)
* [FeatureElement](_feature_d_.md#featureelement)

---

## Type aliases

<a id="compatiblefeaturearray"></a>

###  CompatibleFeatureArray

**Ƭ CompatibleFeatureArray**: *`Readonly`<[FeatureElement](_feature_d_.md#featureelement)[]>*

*Defined in feature.d.ts:11*

An array containing any number of feature objects or names or aliases of predefined features, in no particular order.

All of the specified features need to be compatible, so that their union can be constructed.

*__remarks__*: An error is thrown if the specified features are not mutually compatible.

___
<a id="featureelement"></a>

###  FeatureElement

**Ƭ FeatureElement**: *[Feature](../interfaces/_feature_d_.feature.md) \| `string`*

*Defined in feature.d.ts:288*

A feature object or name or alias of a predefined feature.

*__remarks__*: An error is thrown if the specified value is neither a feature object nor a name or alias of a predefined feature.

___

