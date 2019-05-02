
#  JScrewIt

## Index

### Interfaces

* [EncodeOptions](interfaces/encodeoptions.md)
* [Feature](interfaces/feature.md)
* [FeatureAll](interfaces/featureall.md)
* [FeatureConstructor](interfaces/featureconstructor.md)
* [JScrewIt](interfaces/jscrewit.md)

### Type aliases

* [CompatibleFeatureArray](#compatiblefeaturearray)
* [FeatureElement](#featureelement)
* [PredefinedFeatureName](#predefinedfeaturename)

---

## Type aliases

<a id="compatiblefeaturearray"></a>

###  CompatibleFeatureArray

**Ƭ CompatibleFeatureArray**: *`Readonly`<[FeatureElement](#featureelement)[]>*

*Defined in [feature.d.ts:14](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature.d.ts#L14)*

An array containing any number of feature objects or names or aliases of predefined features, in no particular order.

All of the specified features need to be compatible, so that their union can be constructed.

*__remarks__*: Methods that accept parameters of this type throw an error if the specified features are not mutually compatible.

___
<a id="featureelement"></a>

###  FeatureElement

**Ƭ FeatureElement**: *[Feature](interfaces/feature.md) \| [PredefinedFeatureName](#predefinedfeaturename)*

*Defined in [feature.d.ts:285](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature.d.ts#L285)*

A feature object or name or alias of a predefined feature.

*__remarks__*: Methods that accept parameters of this type throw an error if the specified value is neither a feature object nor a name or alias of a predefined feature.

___
<a id="predefinedfeaturename"></a>

###  PredefinedFeatureName

**Ƭ PredefinedFeatureName**: *`keyof FeatureAll`*

*Defined in [feature.d.ts:290](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature.d.ts#L290)*

Name or alias of a predefined feature.

___

