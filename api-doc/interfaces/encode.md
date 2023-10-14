# Interface: encode

## Callable

### encode

▸ **encode**(`input`, `options?`): `string`

Encodes a given string into JSFuck.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `string` | The string to encode. |
| `options?` | [`EncodeOptions`](EncodeOptions.md) | An optional object specifying encoding options. |

#### Returns

`string`

The encoded string.

**`Throws`**

An `Error` is thrown under the following circumstances.
 - The specified string cannot be encoded with the specified options.
 - Some unknown features were specified.
 - A combination of mutually incompatible features was specified.
 - The option `runAs` (or `wrapWith`) was specified with an invalid value.

Also, an out of memory condition may occur when processing very large data.

## Table of contents

### Properties

- [permanentCaching](encode.md#permanentcaching)

## Properties

### permanentCaching

• **permanentCaching**: `boolean`

Determines whether all created encoders are cached permanently.

An encoder is a structure used internally by JScrewIt to remember the result of certain
time-consuming operations performed when `encode` is called with some particular features.
Keeping encoders in the cache allows them to be reused when `encode` is called again later
with the same features, which can greatly improve performance.

Whenever `encode` is called with new features, a new encoder is created.
If `encode` is called again with the same features specified in the very last call, the last
used encoder is reused.
By default, only the last used encoder is retained in the cache permanently, while other
encoders used in earlier calls to `encode` may be eventually discarded to free up memory, at
the discretion of JScrewIt.

```js
const r1 = encode("1", { features: "V8_SRC" }); // Encoder for feature "V8_SRC" is created.
const r2 = encode("2"); // Encoder for default feature is created.
const r3 = encode("3"); // Last used encoder is reused.
doSomething();
// Encoder for feature "V8_SRC" will be reused if still cached;
// otherwise, a new one will be created.
const r4 = encode("4", { features: "V8_SRC" });
```

By setting `encode.permanentCaching` to `true` it is possible to enforce that all created
encoders are kept in the cache, thus improving performance in certain situations, for example
when multiple calls to `encode` with the same features are alternated with calls to `encode`
where other features are specified.

If you change this setting to `true`, don't forget to switch it back to `false` again when
you are finished encoding in order to allow the memory used by the encoders to be released.

Unless you have a reason to change this setting, such as when `encode` is called repeatedly
with alternating features, it is recommended to keep the default setting of `false`.
