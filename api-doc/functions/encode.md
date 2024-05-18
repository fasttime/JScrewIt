[**JScrewIt**](../README.md) • **Docs**

***

# Function: encode()

> **encode**(`input`, `options`?): `string`

Encodes a given string into JSFuck.

## Parameters

• **input**: `string`

The string to encode.

• **options?**: [`EncodeOptions`](../interfaces/EncodeOptions.md)

An optional object specifying encoding options.

## Returns

`string`

The encoded string.

## Throws

An `Error` is thrown under the following circumstances.
 - The specified string cannot be encoded with the specified options.
 - Some unknown features were specified.
 - A combination of mutually incompatible features was specified.
 - The option `runAs` (or `wrapWith`) was specified with an invalid value.

Also, an out of memory condition may occur when processing very large data.
