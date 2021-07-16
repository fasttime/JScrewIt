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

### Type aliases

- [CompatibleFeatureArray](README.md#compatiblefeaturearray)
- [ElementaryFeatureName](README.md#elementaryfeaturename)
- [FeatureElement](README.md#featureelement)
- [PredefinedFeatureName](README.md#predefinedfeaturename)

### Variables

- [Feature](README.md#feature)
- [default](README.md#default)
- [encode](README.md#encode)

## Type aliases

### CompatibleFeatureArray

Ƭ **CompatibleFeatureArray**: readonly [`FeatureElement`](README.md#featureelement)[]

An array containing any number of feature objects or names or aliases of predefined features, in
no particular order.

All of the specified features need to be compatible, so that their union can be constructed.

**`remarks`**

Methods that accept parameters of this type throw an error if the specified features are not
mutually compatible.

___

### ElementaryFeatureName

Ƭ **ElementaryFeatureName**: ``"ANY_DOCUMENT"`` \| ``"ANY_WINDOW"`` \| ``"ARRAY_ITERATOR"`` \| ``"ARROW"`` \| ``"AT"`` \| ``"ATOB"`` \| ``"BARPROP"`` \| ``"CAPITAL_HTML"`` \| ``"CONSOLE"`` \| ``"DOCUMENT"`` \| ``"DOMWINDOW"`` \| ``"ESC_HTML_ALL"`` \| ``"ESC_HTML_QUOT"`` \| ``"ESC_HTML_QUOT_ONLY"`` \| ``"ESC_REGEXP_LF"`` \| ``"ESC_REGEXP_SLASH"`` \| ``"EXTERNAL"`` \| ``"FF_SRC"`` \| ``"FILL"`` \| ``"FLAT"`` \| ``"FROM_CODE_POINT"`` \| ``"FUNCTION_19_LF"`` \| ``"FUNCTION_22_LF"`` \| ``"GENERIC_ARRAY_TO_STRING"`` \| ``"GLOBAL_UNDEFINED"`` \| ``"GMT"`` \| ``"HISTORY"`` \| ``"HTMLAUDIOELEMENT"`` \| ``"HTMLDOCUMENT"`` \| ``"IE_SRC"`` \| ``"INCR_CHAR"`` \| ``"INTL"`` \| ``"LOCALE_INFINITY"`` \| ``"LOCALE_NUMERALS"`` \| ``"LOCALE_NUMERALS_EXT"`` \| ``"LOCATION"`` \| ``"NAME"`` \| ``"NODECONSTRUCTOR"`` \| ``"NO_FF_SRC"`` \| ``"NO_IE_SRC"`` \| ``"NO_OLD_SAFARI_ARRAY_ITERATOR"`` \| ``"NO_V8_SRC"`` \| ``"OBJECT_UNDEFINED"`` \| ``"PLAIN_INTL"`` \| ``"REGEXP_STRING_ITERATOR"`` \| ``"SELF_OBJ"`` \| ``"SHORT_LOCALES"`` \| ``"STATUS"`` \| ``"UNDEFINED"`` \| ``"V8_SRC"`` \| ``"WINDOW"``

Name of an elementary feature.

___

### FeatureElement

Ƭ **FeatureElement**: [`Feature`](README.md#feature) \| keyof [`FeatureAll`](interfaces/FeatureAll.md)

A feature object or a name or alias of a predefined feature.

**`remarks`**

Methods that accept parameters of this type throw an error if the specified value is neither a
feature object nor a name or alias of a predefined feature.

___

### PredefinedFeatureName

Ƭ **PredefinedFeatureName**: [`ElementaryFeatureName`](README.md#elementaryfeaturename) \| ``"ANDRO_4_0"`` \| ``"ANDRO_4_1"`` \| ``"ANDRO_4_4"`` \| ``"AUTO"`` \| ``"BROWSER"`` \| ``"CHROME_86"`` \| ``"COMPACT"`` \| ``"DEFAULT"`` \| ``"FF_78"`` \| ``"FF_83"`` \| ``"FF_90"`` \| ``"IE_10"`` \| ``"IE_11"`` \| ``"IE_11_WIN_10"`` \| ``"IE_9"`` \| ``"NODE_0_10"`` \| ``"NODE_0_12"`` \| ``"NODE_10"`` \| ``"NODE_11"`` \| ``"NODE_12"`` \| ``"NODE_13"`` \| ``"NODE_15"`` \| ``"NODE_16"`` \| ``"NODE_4"`` \| ``"NODE_5"`` \| ``"SAFARI_10"`` \| ``"SAFARI_12"`` \| ``"SAFARI_13"`` \| ``"SAFARI_14_0_1"`` \| ``"SAFARI_14_1"`` \| ``"SAFARI_7_0"`` \| ``"SAFARI_7_1"`` \| ``"SAFARI_9"``

Name of a predefined feature.

## Variables

### Feature

• **Feature**: [`FeatureConstructor`](interfaces/FeatureConstructor.md)

___

### default

• **default**: [`default`](README.md#default)

JScrewIt object, available in Node.js.

___

### encode

• **encode**: [`encode`](README.md#encode)
