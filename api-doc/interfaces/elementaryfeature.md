# Interface: ElementaryFeature

## Hierarchy

* [*PredefinedFeature*](predefinedfeature.md)

  ↳ **ElementaryFeature**

## Table of contents

### Properties

- [canonicalNames](elementaryfeature.md#canonicalnames)
- [elementary](elementaryfeature.md#elementary)
- [elementaryNames](elementaryfeature.md#elementarynames)
- [name](elementaryfeature.md#name)

### Methods

- [includes](elementaryfeature.md#includes)
- [restrict](elementaryfeature.md#restrict)

## Properties

### canonicalNames

• `Readonly` **canonicalNames**: [*ElementaryFeatureName*](../README.md#elementaryfeaturename)[]

An array of all elementary feature names included in this feature object, without aliases and
implied features.

Inherited from: [PredefinedFeature](predefinedfeature.md).[canonicalNames](predefinedfeature.md#canonicalnames)

___

### elementary

• `Readonly` **elementary**: ``true``

A boolean value indicating whether this is an elementary feature object.

Overrides: [PredefinedFeature](predefinedfeature.md).[elementary](predefinedfeature.md#elementary)

___

### elementaryNames

• `Readonly` **elementaryNames**: [*ElementaryFeatureName*](../README.md#elementaryfeaturename)[]

An array of all elementary feature names included in this feature object, without aliases.

Inherited from: [PredefinedFeature](predefinedfeature.md).[elementaryNames](predefinedfeature.md#elementarynames)

___

### name

• `Readonly` **name**: [*ElementaryFeatureName*](../README.md#elementaryfeaturename)

Overrides: [PredefinedFeature](predefinedfeature.md).[name](predefinedfeature.md#name)

## Methods

### includes

▸ **includes**(...`features`: ([*FeatureElement*](../README.md#featureelement) \| [*CompatibleFeatureArray*](../README.md#compatiblefeaturearray))[]): *boolean*

Determines whether this feature object includes all of the specified features.

#### Parameters:

| Name | Type |
| :------ | :------ |
| `...features` | ([*FeatureElement*](../README.md#featureelement) \| [*CompatibleFeatureArray*](../README.md#compatiblefeaturearray))[] |

**Returns:** *boolean*

`true` if this feature object includes all of the specified features; otherwise, `false`.
If no arguments are specified, the return value is `true`.

Inherited from: [PredefinedFeature](predefinedfeature.md)

___

### restrict

▸ **restrict**(`environment`: ``"forced-strict-mode"`` \| ``"web-worker"``, `engineFeatureObjs?`: readonly [*PredefinedFeature*](predefinedfeature.md)[]): [*CustomFeature*](customfeature.md)

Creates a new feature object from this feature by removing elementary features that are not
available inside a particular environment.

This method is useful to selectively exclude features that are not available inside a web
worker.

#### Parameters:

| Name | Type | Description |
| :------ | :------ | :------ |
| `environment` | ``"forced-strict-mode"`` \| ``"web-worker"`` | The environment to which this feature should be restricted. Two environments are currently supported.  <dl>  <dt><code>"forced-strict-mode"</code></dt> <dd> Removes features that are not available in environments that require strict mode code. </dd>  <dt><code>"web-worker"</code></dt> <dd>Removes features that are not available inside web workers.</dd>  </dl> |
| `engineFeatureObjs?` | readonly [*PredefinedFeature*](predefinedfeature.md)[] | An array of predefined feature objects, each corresponding to a particular engine in which the restriction should be enacted. If this parameter is omitted, the restriction is enacted in all engines. |

**Returns:** [*CustomFeature*](customfeature.md)

Inherited from: [PredefinedFeature](predefinedfeature.md)
