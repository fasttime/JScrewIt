**[JScrewIt](../README.md)**

# Interface: PredefinedFeature

## Hierarchy

* [Feature](_jscrewit_.customfeature.md#feature)

  ↳ **PredefinedFeature**

  ↳↳ [ElementaryFeature](_jscrewit_.elementaryfeature.md)

## Index

### Properties

* [Feature](_jscrewit_.predefinedfeature.md#feature)
* [canonicalNames](_jscrewit_.predefinedfeature.md#canonicalnames)
* [elementary](_jscrewit_.predefinedfeature.md#elementary)
* [elementaryNames](_jscrewit_.predefinedfeature.md#elementarynames)
* [name](_jscrewit_.predefinedfeature.md#name)

### Methods

* [includes](_jscrewit_.predefinedfeature.md#includes)
* [restrict](_jscrewit_.predefinedfeature.md#restrict)

## Properties

### Feature

•  **Feature**: [FeatureConstructor](_jscrewit_.featureconstructor.md)

___

### canonicalNames

• `Readonly` **canonicalNames**: [ElementaryFeatureName](../modules/_jscrewit_.md#elementaryfeaturename)[]

*Inherited from [CustomFeature](_jscrewit_.customfeature.md).[canonicalNames](_jscrewit_.customfeature.md#canonicalnames)*

An array of all elementary feature names included in this feature object, without aliases
and implied features.

___

### elementary

• `Readonly` **elementary**: boolean

*Inherited from [Feature](_jscrewit_.feature.md).[elementary](_jscrewit_.feature.md#elementary)*

A boolean value indicating whether this is an elementary feature object.

___

### elementaryNames

• `Readonly` **elementaryNames**: [ElementaryFeatureName](../modules/_jscrewit_.md#elementaryfeaturename)[]

*Inherited from [CustomFeature](_jscrewit_.customfeature.md).[elementaryNames](_jscrewit_.customfeature.md#elementarynames)*

An array of all elementary feature names included in this feature object, without
aliases.

___

### name

• `Readonly` **name**: [PredefinedFeatureName](../modules/_jscrewit_.md#predefinedfeaturename)

*Overrides [CustomFeature](_jscrewit_.customfeature.md).[name](_jscrewit_.customfeature.md#name)*

## Methods

### includes

▸ **includes**(...`features`: ([FeatureElement](../modules/_jscrewit_.md#featureelement) \| [CompatibleFeatureArray](../modules/_jscrewit_.md#compatiblefeaturearray))[]): boolean

*Inherited from [CustomFeature](_jscrewit_.customfeature.md).[includes](_jscrewit_.customfeature.md#includes)*

Determines whether this feature object includes all of the specified features.

#### Parameters:

Name | Type |
------ | ------ |
`...features` | ([FeatureElement](../modules/_jscrewit_.md#featureelement) \| [CompatibleFeatureArray](../modules/_jscrewit_.md#compatiblefeaturearray))[] |

**Returns:** boolean

`true` if this feature object includes all of the specified features; otherwise, `false`.
If no arguments are specified, the return value is `true`.

___

### restrict

▸ **restrict**(`environment`: \"forced-strict-mode\" \| \"web-worker\", `engineFeatureObjs?`: readonly [PredefinedFeature](_jscrewit_.predefinedfeature.md)[]): [CustomFeature](_jscrewit_.customfeature.md)

*Inherited from [CustomFeature](_jscrewit_.customfeature.md).[restrict](_jscrewit_.customfeature.md#restrict)*

Creates a new feature object from this feature by removing elementary features that are
not available inside a particular environment.

This method is useful to selectively exclude features that are not available inside a web
worker.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`environment` | \"forced-strict-mode\" \| \"web-worker\" |   The environment to which this feature should be restricted. Two environments are currently supported.  <dl>  <dt><code>"forced-strict-mode"</code></dt> <dd> Removes features that are not available in environments that require strict mode code. </dd>  <dt><code>"web-worker"</code></dt> <dd>Removes features that are not available inside web workers.</dd>  </dl>  |
`engineFeatureObjs?` | readonly [PredefinedFeature](_jscrewit_.predefinedfeature.md)[] |   An array of predefined feature objects, each corresponding to a particular engine in which the restriction should be enacted. If this parameter is omitted, the restriction is enacted in all engines.  |

**Returns:** [CustomFeature](_jscrewit_.customfeature.md)
