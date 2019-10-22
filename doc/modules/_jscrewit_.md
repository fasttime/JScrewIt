[JScrewIt](../README.md) › ["jscrewit"](_jscrewit_.md)

# Module: "jscrewit"

## Index

### Interfaces

* [CustomFeature](../interfaces/_jscrewit_.customfeature.md)
* [ElementaryFeature](../interfaces/_jscrewit_.elementaryfeature.md)
* [EncodeOptions](../interfaces/_jscrewit_.encodeoptions.md)
* [Feature](../interfaces/_jscrewit_.feature.md)
* [FeatureAll](../interfaces/_jscrewit_.featureall.md)
* [FeatureConstructor](../interfaces/_jscrewit_.featureconstructor.md)
* [PredefinedFeature](../interfaces/_jscrewit_.predefinedfeature.md)

### Type aliases

* [CompatibleFeatureArray](_jscrewit_.md#compatiblefeaturearray)
* [ElementaryFeatureName](_jscrewit_.md#elementaryfeaturename)
* [FeatureElement](_jscrewit_.md#featureelement)
* [PredefinedFeatureName](_jscrewit_.md#predefinedfeaturename)

### Variables

* [Feature](_jscrewit_.md#const-feature)

### Functions

* [encode](_jscrewit_.md#encode)

## Type aliases

###  CompatibleFeatureArray

Ƭ **CompatibleFeatureArray**: *keyof FeatureElement[]*

*Defined in [feature.d.ts:16](https://github.com/fasttime/JScrewIt/blob/2.11.0/lib/feature.d.ts#L16)*

An array containing any number of feature objects or names or aliases of predefined features,
in no particular order.

All of the specified features need to be compatible, so that their union can be constructed.

**`remarks`** 

Methods that accept parameters of this type throw an error if the specified features are not
mutually compatible.

___

###  ElementaryFeatureName

Ƭ **ElementaryFeatureName**: *"ANY_DOCUMENT" | "ANY_WINDOW" | "ARRAY_ITERATOR" | "ARROW" | "ATOB" | "BARPROP" | "CAPITAL_HTML" | "CONSOLE" | "DOCUMENT" | "DOMWINDOW" | "ESC_HTML_ALL" | "ESC_HTML_QUOT" | "ESC_HTML_QUOT_ONLY" | "ESC_REGEXP_LF" | "ESC_REGEXP_SLASH" | "EXTERNAL" | "FF_SRC" | "FILL" | "FLAT" | "FROM_CODE_POINT" | "FUNCTION_19_LF" | "FUNCTION_22_LF" | "GMT" | "HISTORY" | "HTMLAUDIOELEMENT" | "HTMLDOCUMENT" | "IE_SRC" | "INCR_CHAR" | "INTL" | "LOCALE_INFINITY" | "NAME" | "NODECONSTRUCTOR" | "NO_FF_SRC" | "NO_IE_SRC" | "NO_OLD_SAFARI_ARRAY_ITERATOR" | "NO_V8_SRC" | "SELF_OBJ" | "STATUS" | "UNDEFINED" | "UNEVAL" | "V8_SRC" | "WINDOW"*

*Defined in [feature-all.d.ts:564](https://github.com/fasttime/JScrewIt/blob/2.11.0/lib/feature-all.d.ts#L564)*

Name of an elementary feature.

___

###  FeatureElement

Ƭ **FeatureElement**: *[Feature](../interfaces/_jscrewit_.feature.md) | keyof FeatureAll*

*Defined in [feature.d.ts:306](https://github.com/fasttime/JScrewIt/blob/2.11.0/lib/feature.d.ts#L306)*

A feature object or a name or alias of a predefined feature.

**`remarks`** 

Methods that accept parameters of this type throw an error if the specified value is neither
a feature object nor a name or alias of a predefined feature.

___

###  PredefinedFeatureName

Ƭ **PredefinedFeatureName**: *[ElementaryFeatureName](_jscrewit_.md#elementaryfeaturename) | "ANDRO_4_0" | "ANDRO_4_1" | "ANDRO_4_4" | "AUTO" | "BROWSER" | "CHROME_73" | "COMPACT" | "DEFAULT" | "EDGE_40" | "FF_62" | "IE_10" | "IE_11" | "IE_11_WIN_10" | "IE_9" | "NODE_0_10" | "NODE_0_12" | "NODE_10" | "NODE_11" | "NODE_12" | "NODE_4" | "NODE_5" | "SAFARI_10" | "SAFARI_12" | "SAFARI_7_0" | "SAFARI_7_1" | "SAFARI_9"*

*Defined in [feature-all.d.ts:610](https://github.com/fasttime/JScrewIt/blob/2.11.0/lib/feature-all.d.ts#L610)*

Name of a predefined feature.

## Variables

### `Const` Feature

• **Feature**: *[FeatureConstructor](../interfaces/_jscrewit_.featureconstructor.md)*

*Defined in [feature.d.ts:136](https://github.com/fasttime/JScrewIt/blob/2.11.0/lib/feature.d.ts#L136)*

## Functions

###  encode

▸ **encode**(`input`: string, `options?`: [EncodeOptions](../interfaces/_jscrewit_.encodeoptions.md)): *string*

*Defined in [encode.d.ts:110](https://github.com/fasttime/JScrewIt/blob/2.11.0/lib/encode.d.ts#L110)*

Encodes a given string into JSFuck.

**`throws`** 

An `Error` is thrown under the following circumstances.
 - The specified string cannot be encoded with the specified options.
 - Some unknown features were specified.
 - A combination of mutually incompatible features was specified.
 - The option `runAs` (or `wrapWith`) was specified with an invalid value.

Also, an out of memory condition may occur when processing very large data.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`input` | string |   The string to encode.  |
`options?` | [EncodeOptions](../interfaces/_jscrewit_.encodeoptions.md) |   An optional object specifying encoding options.  |

**Returns:** *string*

The encoded string.
