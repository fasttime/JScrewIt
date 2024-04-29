# JScrewIt

## Table of contents

### Interfaces

- [CustomFeature](interfaces/CustomFeature.md)
- [ElementaryFeature](interfaces/ElementaryFeature.md)
- [EncodeOptions](interfaces/EncodeOptions.md)
- [Feature](interfaces/Feature.md)
- [FeatureAll](interfaces/FeatureAll.md)
- [FeatureConstructor](interfaces/FeatureConstructor.md)
- [PredefinedFeature](interfaces/PredefinedFeature.md)
- [default](interfaces/default.md)
- [encode](interfaces/encode.md)

### Type Aliases

- [ElementaryFeatureName](README.md#elementaryfeaturename)
- [FeatureElement](README.md#featureelement)
- [FeatureElementOrCompatibleArray](README.md#featureelementorcompatiblearray)
- [PredefinedFeatureName](README.md#predefinedfeaturename)
- [RunAs](README.md#runas)

### Variables

- [Feature](README.md#feature)
- [default](README.md#default)

### Functions

- [encode](README.md#encode)

## Type Aliases

### ElementaryFeatureName

Ƭ **ElementaryFeatureName**: ``"ANY_DOCUMENT"`` \| ``"ANY_WINDOW"`` \| ``"ARRAY_ITERATOR"`` \| ``"ARROW"`` \| ``"AT"`` \| ``"ATOB"`` \| ``"BARPROP"`` \| ``"CAPITAL_HTML"`` \| ``"CONSOLE"`` \| ``"DOCUMENT"`` \| ``"DOMWINDOW"`` \| ``"ESC_HTML_ALL"`` \| ``"ESC_HTML_QUOT"`` \| ``"ESC_HTML_QUOT_ONLY"`` \| ``"ESC_REGEXP_LF"`` \| ``"ESC_REGEXP_SLASH"`` \| ``"FF_SRC"`` \| ``"FILL"`` \| ``"FLAT"`` \| ``"FROM_CODE_POINT"`` \| ``"FUNCTION_19_LF"`` \| ``"FUNCTION_22_LF"`` \| ``"GENERIC_ARRAY_TO_STRING"`` \| ``"GLOBAL_UNDEFINED"`` \| ``"GMT"`` \| ``"HISTORY"`` \| ``"HTMLAUDIOELEMENT"`` \| ``"HTMLDOCUMENT"`` \| ``"IE_SRC"`` \| ``"INCR_CHAR"`` \| ``"INTL"`` \| ``"LOCALE_INFINITY"`` \| ``"LOCALE_NUMERALS"`` \| ``"LOCALE_NUMERALS_EXT"`` \| ``"LOCATION"`` \| ``"NAME"`` \| ``"NODECONSTRUCTOR"`` \| ``"NO_FF_SRC"`` \| ``"NO_IE_SRC"`` \| ``"NO_OLD_SAFARI_ARRAY_ITERATOR"`` \| ``"NO_V8_SRC"`` \| ``"OBJECT_ARRAY_ENTRIES_CTOR"`` \| ``"OBJECT_L_LOCATION_CTOR"`` \| ``"OBJECT_UNDEFINED"`` \| ``"OBJECT_W_CTOR"`` \| ``"OLD_SAFARI_LOCATION_CTOR"`` \| ``"PLAIN_INTL"`` \| ``"REGEXP_STRING_ITERATOR"`` \| ``"SELF_OBJ"`` \| ``"SHORT_LOCALES"`` \| ``"STATUS"`` \| ``"UNDEFINED"`` \| ``"V8_SRC"`` \| ``"WINDOW"``

Name of an elementary feature.

___

### FeatureElement

Ƭ **FeatureElement**: [`Feature`](interfaces/Feature.md) \| keyof [`FeatureAll`](interfaces/FeatureAll.md)

A feature object or a name or alias of a predefined feature.

**`Remarks`**

Methods that accept parameters of this type throw an error if the specified value is neither a
feature object nor a name or alias of a predefined feature.

___

### FeatureElementOrCompatibleArray

Ƭ **FeatureElementOrCompatibleArray**: [`FeatureElement`](README.md#featureelement) \| readonly [`FeatureElement`](README.md#featureelement)[]

A feature object, a name or alias of a predefined feature, or an array of such values that
defines a union of mutually compatible features.

**`Remarks`**

Methods that accept parameters of this type throw an error if the specified value is neither a
feature object nor a name or alias of a predefined feature, or if it is an array of values that
does not define a union of mutually compatible features.

___

### PredefinedFeatureName

Ƭ **PredefinedFeatureName**: [`ElementaryFeatureName`](README.md#elementaryfeaturename) \| ``"ANDRO_4_0"`` \| ``"ANDRO_4_1"`` \| ``"ANDRO_4_4"`` \| ``"AUTO"`` \| ``"BROWSER"`` \| ``"CHROME_122"`` \| ``"COMPACT"`` \| ``"DEFAULT"`` \| ``"FF_90"`` \| ``"IE_10"`` \| ``"IE_11"`` \| ``"IE_11_WIN_10"`` \| ``"IE_9"`` \| ``"NODE_0_10"`` \| ``"NODE_0_12"`` \| ``"NODE_10"`` \| ``"NODE_11"`` \| ``"NODE_12"`` \| ``"NODE_13"`` \| ``"NODE_15"`` \| ``"NODE_16_0"`` \| ``"NODE_16_6"`` \| ``"NODE_22"`` \| ``"NODE_4"`` \| ``"NODE_5"`` \| ``"SAFARI_10"`` \| ``"SAFARI_12"`` \| ``"SAFARI_13"`` \| ``"SAFARI_14_0_1"`` \| ``"SAFARI_14_1"`` \| ``"SAFARI_15_4"`` \| ``"SAFARI_17_4"`` \| ``"SAFARI_7_0"`` \| ``"SAFARI_7_1"`` \| ``"SAFARI_9"``

Name of a predefined feature.

___

### RunAs

Ƭ **RunAs**: ``"call"`` \| ``"eval"`` \| ``"express"`` \| ``"express-call"`` \| ``"express-eval"`` \| ``"none"``

Values of this type control the type of code generated from a given input.
See [`EncodeOptions.runAs`](interfaces/EncodeOptions.md#runas) for the meaning of each possible value.

## Variables

### Feature

• **Feature**: [`FeatureConstructor`](interfaces/FeatureConstructor.md)

___

### default

• **default**: [`default`](interfaces/default.md)

## Functions

### encode

▸ **encode**(`input`, `options?`): `string`

Encodes a given string into JSFuck.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `string` | The string to encode. |
| `options?` | [`EncodeOptions`](interfaces/EncodeOptions.md) | An optional object specifying encoding options. |

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
