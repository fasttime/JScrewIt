[JScrewIt](../README.md) > [JScrewIt](../interfaces/jscrewit.md)

# Interface: JScrewIt

## Hierarchy

**JScrewIt**

## Index

### Properties

* [Feature](jscrewit.md#feature)

### Methods

* [encode](jscrewit.md#encode)

---

## Properties

<a id="feature"></a>

###  Feature

**● Feature**: *[FeatureConstructor](featureconstructor.md)*

*Defined in [feature.d.ts:287](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature.d.ts#L287)*

___

## Methods

<a id="encode"></a>

###  encode

▸ **encode**(input: *`string`*, options?: *[EncodeOptions](encodeoptions.md)*): `string`

*Defined in [encode.d.ts:104](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/encode.d.ts#L104)*

Encodes a given string into JSFuck.

*__throws__*: An `Error` is thrown under the following circumstances.

*   The specified string cannot be encoded with the specified options.
*   Some unknown features were specified.
*   A combination of mutually incompatible features was specified.
*   The option `runAs` (or `wrapWith`) was specified with an invalid value.

Also, an out of memory condition may occur when processing very large data.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| input | `string` |  <br><br>The string to encode. |
| `Optional` options | [EncodeOptions](encodeoptions.md) |  <br><br>An optional object specifying encoding options. |

**Returns:** `string`

The encoded string.

___

