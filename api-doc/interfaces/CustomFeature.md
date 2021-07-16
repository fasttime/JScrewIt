# Interface: CustomFeature

## Hierarchy

- [`Feature`](../README.md#feature)

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

Feature.canonicalNames

___

### elementary

• `Readonly` **elementary**: ``false``

#### Overrides

Feature.elementary

___

### elementaryNames

• `Readonly` **elementaryNames**: [`ElementaryFeatureName`](../README.md#elementaryfeaturename)[]

An array of all elementary feature names included in this feature object, without aliases.

#### Inherited from

Feature.elementaryNames

___

### name

• `Optional` **name**: `string`

The primary name of this feature object, useful for identification purpose.

All predefined features have a name; custom features may be optionally assigned a name, too.
If a name is assigned, it will be used when the feature is converted into a string.

#### Inherited from

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

This method is useful to selectively exclude features that are not available inside a web
worker.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `environment` | ``"forced-strict-mode"`` \| ``"web-worker"`` | The environment to which this feature should be restricted. Two environments are currently supported.  <dl>  <dt><code>"forced-strict-mode"</code></dt> <dd> Removes features that are not available in environments that require strict mode code. </dd>  <dt><code>"web-worker"</code></dt> <dd>Removes features that are not available inside web workers.</dd>  </dl> |
| `engineFeatureObjs?` | readonly [`PredefinedFeature`](PredefinedFeature.md)[] | An array of predefined feature objects, each corresponding to a particular engine in which the restriction should be enacted. If this parameter is omitted, the restriction is enacted in all engines. |

#### Returns

[`CustomFeature`](CustomFeature.md)

#### Inherited from

Feature.restrict
