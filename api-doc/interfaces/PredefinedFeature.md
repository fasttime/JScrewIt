# Interface: PredefinedFeature

## Hierarchy

- [`Feature`](../README.md#feature)

  ↳ **`PredefinedFeature`**

  ↳↳ [`ElementaryFeature`](ElementaryFeature.md)

## Table of contents

### Properties

- [canonicalNames](PredefinedFeature.md#canonicalnames)
- [elementary](PredefinedFeature.md#elementary)
- [elementaryNames](PredefinedFeature.md#elementarynames)
- [name](PredefinedFeature.md#name)

### Methods

- [includes](PredefinedFeature.md#includes)
- [restrict](PredefinedFeature.md#restrict)

## Properties

### canonicalNames

• `Readonly` **canonicalNames**: [`ElementaryFeatureName`](../README.md#elementaryfeaturename)[]

An array of all elementary feature names included in this feature object, without aliases and
implied features.

#### Inherited from

Feature.canonicalNames

___

### elementary

• `Readonly` **elementary**: `boolean`

A boolean value indicating whether this is an elementary feature object.

#### Inherited from

Feature.elementary

___

### elementaryNames

• `Readonly` **elementaryNames**: [`ElementaryFeatureName`](../README.md#elementaryfeaturename)[]

An array of all elementary feature names included in this feature object, without aliases.

#### Inherited from

Feature.elementaryNames

___

### name

• `Readonly` **name**: [`PredefinedFeatureName`](../README.md#predefinedfeaturename)

#### Overrides

Feature.name

## Methods

### includes

▸ **includes**(...`features`): `boolean`

Determines whether this feature object includes all of the specified features.

#### Parameters

| Name | Type |
| :------ | :------ |
| `...features` | ([`FeatureElement`](../README.md#featureelement) \| [`CompatibleFeatureArray`](../README.md#compatiblefeaturearray))[] |

#### Returns

`boolean`

`true` if this feature object includes all of the specified features; otherwise, `false`.
If no arguments are specified, the return value is `true`.

#### Inherited from

Feature.includes

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
| `environment` | ``"forced-strict-mode"`` \| ``"web-worker"`` | The environment to which this feature should be restricted. Two environments are currently supported.  <dl>  <dt><code>"forced-strict-mode"</code></dt> <dd> Removes features that are not available in environments that require strict mode code. </dd>  <dt><code>"web-worker"</code></dt> <dd>Removes features that are not available inside web workers.</dd>  </dl> |
| `engineFeatureObjs?` | readonly [`PredefinedFeature`](PredefinedFeature.md)[] | An array of predefined feature objects, each corresponding to a particular engine in which the restriction should be enacted. If this parameter is omitted, the restriction is enacted in all engines. |

#### Returns

[`CustomFeature`](CustomFeature.md)

#### Inherited from

Feature.restrict
