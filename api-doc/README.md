# JScrewIt

## Index

### Interfaces

* [CustomFeature](interfaces/customfeature.md)
* [ElementaryFeature](interfaces/elementaryfeature.md)
* [EncodeOptions](interfaces/encodeoptions.md)
* [Feature](interfaces/feature.md)
* [FeatureAll](interfaces/featureall.md)
* [FeatureConstructor](interfaces/featureconstructor.md)
* [PredefinedFeature](interfaces/predefinedfeature.md)
* [default](interfaces/default.md)

### Type aliases

* [CompatibleFeatureArray](README.md#compatiblefeaturearray)
* [ElementaryFeatureName](README.md#elementaryfeaturename)
* [FeatureElement](README.md#featureelement)
* [PredefinedFeatureName](README.md#predefinedfeaturename)

### Variables

* [Feature](README.md#feature)
* [default](README.md#default)

### Functions

* [encode](README.md#encode)

## Type aliases

### CompatibleFeatureArray

Ƭ **CompatibleFeatureArray**: readonly [*FeatureElement*](README.md#featureelement)[]

An array containing any number of feature objects or names or aliases of predefined features, in
no particular order.

All of the specified features need to be compatible, so that their union can be constructed.

**`remarks`** 

Methods that accept parameters of this type throw an error if the specified features are not
mutually compatible.

___

### ElementaryFeatureName

Ƭ **ElementaryFeatureName**: *ANY_DOCUMENT* \| *ANY_WINDOW* \| *ARRAY_ITERATOR* \| *ARROW* \| *ATOB* \| *BARPROP* \| *CAPITAL_HTML* \| *CONSOLE* \| *DOCUMENT* \| *DOMWINDOW* \| *ESC_HTML_ALL* \| *ESC_HTML_QUOT* \| *ESC_HTML_QUOT_ONLY* \| *ESC_REGEXP_LF* \| *ESC_REGEXP_SLASH* \| *EXTERNAL* \| *FF_SRC* \| *FILL* \| *FLAT* \| *FROM_CODE_POINT* \| *FUNCTION_19_LF* \| *FUNCTION_22_LF* \| *GLOBAL_UNDEFINED* \| *GMT* \| *HISTORY* \| *HTMLAUDIOELEMENT* \| *HTMLDOCUMENT* \| *IE_SRC* \| *INCR_CHAR* \| *INTL* \| *LOCALE_INFINITY* \| *LOCALE_NUMERALS* \| *LOCALE_NUMERALS_EXT* \| *NAME* \| *NODECONSTRUCTOR* \| *NO_FF_SRC* \| *NO_IE_SRC* \| *NO_OLD_SAFARI_ARRAY_ITERATOR* \| *NO_V8_SRC* \| *OBJECT_UNDEFINED* \| *PLAIN_INTL* \| *REGEXP_STRING_ITERATOR* \| *SELF_OBJ* \| *SHORT_LOCALES* \| *STATUS* \| *UNDEFINED* \| *V8_SRC* \| *WINDOW*

Name of an elementary feature.

___

### FeatureElement

Ƭ **FeatureElement**: [*Feature*](README.md#feature) \| keyof [*FeatureAll*](interfaces/featureall.md)

A feature object or a name or alias of a predefined feature.

**`remarks`** 

Methods that accept parameters of this type throw an error if the specified value is neither a
feature object nor a name or alias of a predefined feature.

___

### PredefinedFeatureName

Ƭ **PredefinedFeatureName**: [*ElementaryFeatureName*](README.md#elementaryfeaturename) \| *ANDRO_4_0* \| *ANDRO_4_1* \| *ANDRO_4_4* \| *AUTO* \| *BROWSER* \| *CHROME_86* \| *COMPACT* \| *DEFAULT* \| *FF_78* \| *FF_83* \| *IE_10* \| *IE_11* \| *IE_11_WIN_10* \| *IE_9* \| *NODE_0_10* \| *NODE_0_12* \| *NODE_10* \| *NODE_11* \| *NODE_12* \| *NODE_13* \| *NODE_15* \| *NODE_4* \| *NODE_5* \| *SAFARI_10* \| *SAFARI_12* \| *SAFARI_13* \| *SAFARI_14_0_1* \| *SAFARI_7_0* \| *SAFARI_7_1* \| *SAFARI_9*

Name of a predefined feature.

## Variables

### Feature

• `Let` **Feature**: [*FeatureConstructor*](interfaces/featureconstructor.md)

___

### default

• `Let` **default**: [*default*](README.md#default)

## Functions

### encode

▸ **encode**(`input`: *string*, `options?`: [*EncodeOptions*](interfaces/encodeoptions.md)): *string*

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
------ | ------ | ------ |
`input` | *string* |   The string to encode.    |
`options?` | [*EncodeOptions*](interfaces/encodeoptions.md) |   An optional object specifying encoding options.    |

**Returns:** *string*

The encoded string.
