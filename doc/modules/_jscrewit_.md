> ## [JScrewIt](../README.md)

["jscrewit"](_jscrewit_.md) /

# Module: "jscrewit"

### Index

#### Interfaces

* [CustomFeature](../interfaces/_jscrewit_.customfeature.md)
* [EncodeOptions](../interfaces/_jscrewit_.encodeoptions.md)
* [Feature](../interfaces/_jscrewit_.feature.md)
* [FeatureAll](../interfaces/_jscrewit_.featureall.md)
* [FeatureConstructor](../interfaces/_jscrewit_.featureconstructor.md)
* [PredefinedFeature](../interfaces/_jscrewit_.predefinedfeature.md)

#### Type aliases

* [CompatibleFeatureArray](_jscrewit_.md#compatiblefeaturearray)
* [FeatureElement](_jscrewit_.md#featureelement)
* [PredefinedFeatureName](_jscrewit_.md#predefinedfeaturename)

#### Functions

* [encode](_jscrewit_.md#encode)

## Type aliases

###  CompatibleFeatureArray

Ƭ **CompatibleFeatureArray**: *`ReadonlyArray<FeatureElement>`*

*Defined in [feature.d.ts:16](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature.d.ts#L16)*

An array containing any number of feature objects or names or aliases of predefined features,
in no particular order.

All of the specified features need to be compatible, so that their union can be constructed.

**`remarks`** 

Methods that accept parameters of this type throw an error if the specified features are not
mutually compatible.

___

###  FeatureElement

Ƭ **FeatureElement**: *[Feature](../interfaces/_jscrewit_.feature.md) | keyof FeatureAll*

*Defined in [feature.d.ts:297](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature.d.ts#L297)*

A feature object or a name or alias of a predefined feature.

**`remarks`** 

Methods that accept parameters of this type throw an error if the specified value is neither
a feature object nor a name or alias of a predefined feature.

___

###  PredefinedFeatureName

Ƭ **PredefinedFeatureName**: *"ANDRO_4_0" | "ANDRO_4_1" | "ANDRO_4_4" | "ANY_DOCUMENT" | "ANY_WINDOW" | "ARRAY_ITERATOR" | "ARROW" | "ATOB" | "AUTO" | "BARPROP" | "BROWSER" | "CAPITAL_HTML" | "CHROME_73" | "COMPACT" | "CONSOLE" | "DEFAULT" | "DOCUMENT" | "DOMWINDOW" | "EDGE_40" | "ESC_HTML_ALL" | "ESC_HTML_QUOT" | "ESC_HTML_QUOT_ONLY" | "ESC_REGEXP_LF" | "ESC_REGEXP_SLASH" | "EXTERNAL" | "FF_54" | "FF_62" | "FF_SRC" | "FILL" | "FLAT" | "FROM_CODE_POINT" | "FUNCTION_19_LF" | "FUNCTION_22_LF" | "GMT" | "HISTORY" | "HTMLAUDIOELEMENT" | "HTMLDOCUMENT" | "IE_10" | "IE_11" | "IE_11_WIN_10" | "IE_9" | "IE_SRC" | "INCR_CHAR" | "INTL" | "LOCALE_INFINITY" | "NAME" | "NODECONSTRUCTOR" | "NODE_0_10" | "NODE_0_12" | "NODE_10" | "NODE_11" | "NODE_12" | "NODE_4" | "NODE_5" | "NO_FF_SRC" | "NO_IE_SRC" | "NO_OLD_SAFARI_ARRAY_ITERATOR" | "NO_V8_SRC" | "SAFARI_10" | "SAFARI_12" | "SAFARI_7_0" | "SAFARI_7_1" | "SAFARI_9" | "SELF_OBJ" | "STATUS" | "UNDEFINED" | "UNEVAL" | "V8_SRC" | "WINDOW"*

*Defined in [feature-all.d.ts:569](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L569)*

Name of a predefined feature.

___

## Functions

###  encode

▸ **encode**(`input`: string, `options?`: [EncodeOptions](../interfaces/_jscrewit_.encodeoptions.md)): *string*

*Defined in [encode.d.ts:110](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/encode.d.ts#L110)*

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

___