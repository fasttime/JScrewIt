# Interface: default

JScrewIt object, available in Node.js.

## Table of contents

### Properties

- [Feature](default.md#feature)
- [encode](default.md#encode)

## Properties

### Feature

• **Feature**: [*FeatureConstructor*](featureconstructor.md)

___

### encode

• **encode**: (`input`: *string*, `options?`: [*EncodeOptions*](encodeoptions.md)) => *string*

#### Type declaration:

▸ (`input`: *string*, `options?`: [*EncodeOptions*](encodeoptions.md)): *string*

Encodes a given string into JSFuck.

**`throws`** 

An `Error` is thrown under the following circumstances.
 - The specified string cannot be encoded with the specified options.
 - Some unknown features were specified.
 - A combination of mutually incompatible features was specified.
 - The option `runAs` (or `wrapWith`) was specified with an invalid value.

Also, an out of memory condition may occur when processing very large data.

#### Parameters:

Name | Type | Description |
:------ | :------ | :------ |
`input` | *string* |   The string to encode.    |
`options?` | [*EncodeOptions*](encodeoptions.md) |   An optional object specifying encoding options.    |

**Returns:** *string*

The encoded string.
