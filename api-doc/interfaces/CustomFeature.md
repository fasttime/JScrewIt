# Interface: CustomFeature

Objects of this type indicate which of the capabilities that JScrewIt can use to minimize the
length of its output are available in a particular JavaScript engine.

JScrewIt comes with a set of predefined feature objects exposed as property values of
`JScrewIt.Feature` or [`JScrewIt.Feature.ALL`](FeatureConstructor.md#all), where the property
name is the feature's name or alias.

Besides these predefined features, it is possible to construct custom features from the union or
intersection of other features.

Among the predefined features, there are some special ones called *elementary* features.
Elementary features either cannot be expressed as a union of any number of other features, or
they are different from such a union in that they exclude some other feature not excluded by
their elementary components.
All other features, called *composite* features, can be constructed as a union of zero or more
elementary features.
Two of the predefined composite features are particularly important: [`DEFAULT`](FeatureConstructor.md#default) is the empty feature, indicating that no elementary
feature is available at all; [`AUTO`](FeatureAll.md#auto) is the union of all
elementary features available in the current environment.

Not all features can be available at the same time: some features are necessarily incompatible,
meaning that they mutually exclude each other, and thus their union cannot be constructed.

## Hierarchy

- [`Feature`](Feature.md)

  ↳ **`CustomFeature`**

## Table of contents

### Properties

- [canonicalNames](CustomFeature.md#canonicalnames)
- [elementary](CustomFeature.md#elementary)
- [elementaryNames](CustomFeature.md#elementarynames)
- [name](CustomFeature.md#name)

### Methods

- [includes](CustomFeature.md#includes)
- [restrict](CustomFeature.md#restrict)

## Properties

### canonicalNames

• `Readonly` **canonicalNames**: [`ElementaryFeatureName`](../README.md#elementaryfeaturename)[]

An array of all elementary feature names included in this feature object, without aliases and
implied features.

#### Inherited from

[Feature](Feature.md).[canonicalNames](Feature.md#canonicalnames)

___

### elementary

• `Readonly` **elementary**: ``false``

A boolean value indicating whether this is an elementary feature object.

#### Overrides

[Feature](Feature.md).[elementary](Feature.md#elementary)

___

### elementaryNames

• `Readonly` **elementaryNames**: [`ElementaryFeatureName`](../README.md#elementaryfeaturename)[]

An array of all elementary feature names included in this feature object, without aliases.

#### Inherited from

[Feature](Feature.md).[elementaryNames](Feature.md#elementarynames)

___

### name

• `Optional` **name**: `string`

The primary name of this feature object, useful for identification purpose.

All predefined features have a name; custom features may be optionally assigned a name, too.
If a name is assigned, it will be used when the feature is converted into a string.

#### Inherited from

[Feature](Feature.md).[name](Feature.md#name)

## Methods

### includes

▸ **includes**(`...features`): `boolean`

Determines whether this feature object includes all of the specified features.

#### Parameters

| Name | Type |
| :------ | :------ |
| `...features` | [`FeatureElementOrCompatibleArray`](../README.md#featureelementorcompatiblearray)[] |

#### Returns

`boolean`

`true` if this feature object includes all of the specified features; otherwise, `false`.
If no arguments are specified, the return value is `true`.

#### Inherited from

[Feature](Feature.md).[includes](Feature.md#includes)

___

### restrict

▸ **restrict**(`environment`, `engineFeatureObjs?`): [`CustomFeature`](CustomFeature.md)

Creates a new feature object from this feature by removing elementary features that are not
available inside a particular environment.

This method is useful to selectively exclude features that are not available in environments
that require strict mode code, or inside web workers.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `environment` | ``"forced-strict-mode"`` \| ``"web-worker"`` | The environment to which this feature should be restricted. Two environments are currently supported. <dl> <dt><code>"forced-strict-mode"</code></dt> <dd> Removes features that are not available in environments that require strict mode code. </dd> <dt><code>"web-worker"</code></dt> <dd>Removes features that are not available inside web workers.</dd> </dl> |
| `engineFeatureObjs?` | readonly [`PredefinedFeature`](PredefinedFeature.md)[] | An array of predefined feature objects, each corresponding to a particular engine in which the restriction should be enacted. If this parameter is omitted, the restriction is enacted in all engines. |

#### Returns

[`CustomFeature`](CustomFeature.md)

#### Inherited from

[Feature](Feature.md).[restrict](Feature.md#restrict)
