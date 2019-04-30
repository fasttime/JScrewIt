[JScrewIt](../README.md) > ["encode.d"](../modules/_encode_d_.md) > [JScrewIt](../interfaces/_encode_d_.jscrewit.md)

# Interface: JScrewIt

## Hierarchy

**JScrewIt**

## Index

### Methods

* [encode](_encode_d_.jscrewit.md#encode)

---

## Methods

<a id="encode"></a>

###  encode

▸ **encode**(input: *`string`*, options?: *[EncodeOptions](_encode_d_.encodeoptions.md)*): `string`

*Defined in encode.d.ts:102*

Encodes a given string into JSFuck.

*__remarks__*: An `Error` is thrown under the following circumstances.

*   The specified string cannot be encoded with the specified options.
*   Some unknown features were specified.
*   A combination of mutually incompatible features was specified.
*   The option `runAs` (or `wrapWith`) was specified with an invalid value.

Also, an out of memory condition may occur when processing very large data.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| input | `string` |  <br><br>The string to encode. |
| `Optional` options | [EncodeOptions](_encode_d_.encodeoptions.md) |  <br><br>An optional object specifying encoding options. |

**Returns:** `string`

The encoded string.

___

