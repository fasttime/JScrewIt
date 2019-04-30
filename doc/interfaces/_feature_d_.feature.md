[JScrewIt](../README.md) > ["feature.d"](../modules/_feature_d_.md) > [Feature](../interfaces/_feature_d_.feature.md)

# Interface: Feature

Objects of this type indicate which of the capabilities that JScrewIt can use to minimize the length of its output are available in a particular JavaScript engine.

JScrewIt comes with a set of predefined feature objects exposed as property values of [JScrewIt.Feature](_feature_d_.jscrewit.md#feature) or `JScrewIt.Feature.ALL`, where the property name is the feature's name or an alias thereof.

Besides these predefined features, it is possible to construct custom features from the union or intersection of other features.

Among the predefined features, there are some special ones called _elementary_ features. Elementary features either cannot be expressed as a union of any number of other features, or they are different from such a union in that they exclude some other feature not excluded by their elementary components. All other features, called _composite_ features, can be constructed as a union of zero or more elementary features. Two of the predefined composite features are particularly important: [`DEFAULT`](_feature_d_.featureall.md#DEFAULT) is the empty feature, indicating that no elementary feature is available at all; [`AUTO`](_feature_d_.featureall.md#AUTO) is the union of all elementary features available in the current engine.

Not all features can be available at the same time: some features are necessarily incompatible, meaning that they mutually exclude each other, and thus their union cannot be constructed.

## Hierarchy

**Feature**

## Index

### Properties

* [canonicalNames](_feature_d_.feature.md#canonicalnames)
* [description](_feature_d_.feature.md#description)
* [elementary](_feature_d_.feature.md#elementary)
* [elementaryNames](_feature_d_.feature.md#elementarynames)
* [name](_feature_d_.feature.md#name)

### Methods

* [includes](_feature_d_.feature.md#includes)
* [restrict](_feature_d_.feature.md#restrict)

---

## Properties

<a id="canonicalnames"></a>

###  canonicalNames

**● canonicalNames**: *`string`[]*

*Defined in feature.d.ts:44*

An array of all elementary feature names included in this feature object, without aliases and implied features.

___
<a id="description"></a>

### `<Optional>` description

**● description**: *`string`*

*Defined in feature.d.ts:52*

A short description of this feature object in plain English.

All predefined features have a description. If desired, custom features may be assigned a description, too.

___
<a id="elementary"></a>

###  elementary

**● elementary**: *`boolean`*

*Defined in feature.d.ts:55*

A boolean value indicating whether this is an elementary feature object.

___
<a id="elementarynames"></a>

###  elementaryNames

**● elementaryNames**: *`string`[]*

*Defined in feature.d.ts:60*

An array of all elementary feature names included in this feature object, without aliases.

___
<a id="name"></a>

### `<Optional>` name

**● name**: *`string`*

*Defined in feature.d.ts:68*

The primary name of this feature object, useful for identification purpose.

All predefined features have a name. If desired, custom features may be assigned a name, too.

___

## Methods

<a id="includes"></a>

###  includes

▸ **includes**(...features: *(`string` \| [Feature](_feature_d_.feature.md) \| (`string` \| [Feature](_feature_d_.feature.md))[])[]*): `boolean`

*Defined in feature.d.ts:78*

Determines whether this feature object includes all of the specified features.

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` features | (`string` \| [Feature](_feature_d_.feature.md) \| (`string` \| [Feature](_feature_d_.feature.md))[])[] |

**Returns:** `boolean`

`true` if this feature object includes all of the specified features; otherwise, `false`.
If no arguments are specified, the return value is `true`.

___
<a id="restrict"></a>

###  restrict

▸ **restrict**(environment: *`string`*, engineFeatureObjs: *[Feature](_feature_d_.feature.md)[]*): [Feature](_feature_d_.feature.md)

*Defined in feature.d.ts:109*

Creates a new feature object from this feature by removing elementary features that are not available inside a particular environment.

This method is useful to selectively exclude features that are not available inside a web worker.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| environment | `string` |  <br><br>The environment to which this feature should be restricted. Two environments are currently supported.<br><br><dl><br><br><dt><code>"forced-strict-mode"</code></dt> <dd> Removes features that are not available in environments that require strict mode code.</dd><br><br><dt><code>"web-worker"</code></dt> <dd>Removes features that are not available inside web workers.</dd><br><br></dl> |
| engineFeatureObjs | [Feature](_feature_d_.feature.md)[] |  <br><br>An array of predefined feature objects, each corresponding to a particular engine in which the restriction should be enacted. If this parameter is omitted, the restriction is enacted in all engines. |

**Returns:** [Feature](_feature_d_.feature.md)

___

