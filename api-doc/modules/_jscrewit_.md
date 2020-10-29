**[JScrewIt](../README.md)**

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

* [Feature](_jscrewit_.md#feature)

### Functions

* [encode](_jscrewit_.md#encode)

## Type aliases

### CompatibleFeatureArray

Ƭ  **CompatibleFeatureArray**: readonly [FeatureElement](_jscrewit_.md#featureelement)[]

An array containing any number of feature objects or names or aliases of predefined features,
in no particular order.

All of the specified features need to be compatible, so that their union can be constructed.

**`remarks`** 

Methods that accept parameters of this type throw an error if the specified features are not
mutually compatible.

___

### ElementaryFeatureName

Ƭ  **ElementaryFeatureName**: \"ANY\_DOCUMENT\" \| \"ANY\_WINDOW\" \| \"ARRAY\_ITERATOR\" \| \"ARROW\" \| \"ATOB\" \| \"BARPROP\" \| \"CAPITAL\_HTML\" \| \"CONSOLE\" \| \"DOCUMENT\" \| \"DOMWINDOW\" \| \"ESC\_HTML\_ALL\" \| \"ESC\_HTML\_QUOT\" \| \"ESC\_HTML\_QUOT\_ONLY\" \| \"ESC\_REGEXP\_LF\" \| \"ESC\_REGEXP\_SLASH\" \| \"EXTERNAL\" \| \"FF\_SRC\" \| \"FILL\" \| \"FLAT\" \| \"FROM\_CODE\_POINT\" \| \"FUNCTION\_19\_LF\" \| \"FUNCTION\_22\_LF\" \| \"GMT\" \| \"HISTORY\" \| \"HTMLAUDIOELEMENT\" \| \"HTMLDOCUMENT\" \| \"IE\_SRC\" \| \"INCR\_CHAR\" \| \"INTL\" \| \"LOCALE\_INFINITY\" \| \"NAME\" \| \"NODECONSTRUCTOR\" \| \"NO\_FF\_SRC\" \| \"NO\_IE\_SRC\" \| \"NO\_OLD\_SAFARI\_ARRAY\_ITERATOR\" \| \"NO\_V8\_SRC\" \| \"PLAIN\_INTL\" \| \"SELF\_OBJ\" \| \"STATUS\" \| \"UNDEFINED\" \| \"V8\_SRC\" \| \"WINDOW\"

Name of an elementary feature.

___

### FeatureElement

Ƭ  **FeatureElement**: [Feature](../interfaces/_jscrewit_.customfeature.md#feature) \| keyof [FeatureAll](../interfaces/_jscrewit_.featureall.md)

A feature object or a name or alias of a predefined feature.

**`remarks`** 

Methods that accept parameters of this type throw an error if the specified value is neither
a feature object nor a name or alias of a predefined feature.

___

### PredefinedFeatureName

Ƭ  **PredefinedFeatureName**: [ElementaryFeatureName](_jscrewit_.md#elementaryfeaturename) \| \"ANDRO\_4\_0\" \| \"ANDRO\_4\_1\" \| \"ANDRO\_4\_4\" \| \"AUTO\" \| \"BROWSER\" \| \"CHROME\_73\" \| \"CHROME\_86\" \| \"COMPACT\" \| \"DEFAULT\" \| \"FF\_78\" \| \"IE\_10\" \| \"IE\_11\" \| \"IE\_11\_WIN\_10\" \| \"IE\_9\" \| \"NODE\_0\_10\" \| \"NODE\_0\_12\" \| \"NODE\_10\" \| \"NODE\_11\" \| \"NODE\_12\" \| \"NODE\_15\" \| \"NODE\_4\" \| \"NODE\_5\" \| \"SAFARI\_10\" \| \"SAFARI\_12\" \| \"SAFARI\_7\_0\" \| \"SAFARI\_7\_1\" \| \"SAFARI\_9\"

Name of a predefined feature.

## Variables

### Feature

• `Const` **Feature**: [FeatureConstructor](../interfaces/_jscrewit_.featureconstructor.md)

## Functions

### encode

▸ **encode**(`input`: string, `options?`: [EncodeOptions](../interfaces/_jscrewit_.encodeoptions.md)): string

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
`input` | string |   The string to encode.  |
`options?` | [EncodeOptions](../interfaces/_jscrewit_.encodeoptions.md) |   An optional object specifying encoding options.  |

**Returns:** string

The encoded string.
