> **[JScrewIt](../README.md)**

["jscrewit"](../modules/_jscrewit_.md) / [PredefinedFeature](_jscrewit_.predefinedfeature.md) /

# Interface: PredefinedFeature

## Hierarchy

* [Feature](_jscrewit_.feature.md)

  * **PredefinedFeature**

## Index

### Properties

* [Feature](_jscrewit_.predefinedfeature.md#feature)
* [canonicalNames](_jscrewit_.predefinedfeature.md#canonicalnames)
* [description](_jscrewit_.predefinedfeature.md#description)
* [elementary](_jscrewit_.predefinedfeature.md#elementary)
* [elementaryNames](_jscrewit_.predefinedfeature.md#elementarynames)
* [name](_jscrewit_.predefinedfeature.md#name)

### Methods

* [includes](_jscrewit_.predefinedfeature.md#includes)
* [restrict](_jscrewit_.predefinedfeature.md#restrict)

## Properties

###  Feature

• **Feature**: *[FeatureConstructor](_jscrewit_.featureconstructor.md)*

*Defined in [feature.d.ts:127](https://github.com/fasttime/JScrewIt/blob/2.10.1/lib/feature.d.ts#L127)*

___

###  canonicalNames

• **canonicalNames**: *string[]*

*Inherited from [Feature](_jscrewit_.feature.md).[canonicalNames](_jscrewit_.feature.md#canonicalnames)*

*Defined in [feature.d.ts:52](https://github.com/fasttime/JScrewIt/blob/2.10.1/lib/feature.d.ts#L52)*

An array of all elementary feature names included in this feature object, without aliases
and implied features.

___

###  description

• **description**: *string*

*Overrides [Feature](_jscrewit_.feature.md).[description](_jscrewit_.feature.md#optional-description)*

*Defined in [feature.d.ts:301](https://github.com/fasttime/JScrewIt/blob/2.10.1/lib/feature.d.ts#L301)*

___

###  elementary

• **elementary**: *boolean*

*Inherited from [Feature](_jscrewit_.feature.md).[elementary](_jscrewit_.feature.md#elementary)*

*Defined in [feature.d.ts:63](https://github.com/fasttime/JScrewIt/blob/2.10.1/lib/feature.d.ts#L63)*

A boolean value indicating whether this is an elementary feature object.

___

###  elementaryNames

• **elementaryNames**: *string[]*

*Inherited from [Feature](_jscrewit_.feature.md).[elementaryNames](_jscrewit_.feature.md#elementarynames)*

*Defined in [feature.d.ts:69](https://github.com/fasttime/JScrewIt/blob/2.10.1/lib/feature.d.ts#L69)*

An array of all elementary feature names included in this feature object, without
aliases.

___

###  name

• **name**: *[PredefinedFeatureName](../modules/_jscrewit_.md#predefinedfeaturename)*

*Overrides [Feature](_jscrewit_.feature.md).[name](_jscrewit_.feature.md#optional-name)*

*Defined in [feature.d.ts:302](https://github.com/fasttime/JScrewIt/blob/2.10.1/lib/feature.d.ts#L302)*

## Methods

###  includes

▸ **includes**(...`features`: [Feature](_jscrewit_.feature.md) | "ANDRO_4_0" | "ANDRO_4_1" | "ANDRO_4_4" | "ANY_DOCUMENT" | "ANY_WINDOW" | "ARRAY_ITERATOR" | "ARROW" | "ATOB" | "AUTO" | "BARPROP" | "BROWSER" | "CAPITAL_HTML" | "CHROME_73" | "COMPACT" | "CONSOLE" | "DEFAULT" | "DOCUMENT" | "DOMWINDOW" | "EDGE_40" | "ESC_HTML_ALL" | "ESC_HTML_QUOT" | "ESC_HTML_QUOT_ONLY" | "ESC_REGEXP_LF" | "ESC_REGEXP_SLASH" | "EXTERNAL" | "FF_54" | "FF_62" | "FF_SRC" | "FILL" | "FLAT" | "FROM_CODE_POINT" | "FUNCTION_19_LF" | "FUNCTION_22_LF" | "GMT" | "HISTORY" | "HTMLAUDIOELEMENT" | "HTMLDOCUMENT" | "IE_10" | "IE_11" | "IE_11_WIN_10" | "IE_9" | "IE_SRC" | "INCR_CHAR" | "INTL" | "LOCALE_INFINITY" | "NAME" | "NODECONSTRUCTOR" | "NODE_0_10" | "NODE_0_12" | "NODE_10" | "NODE_11" | "NODE_12" | "NODE_4" | "NODE_5" | "NO_FF_SRC" | "NO_IE_SRC" | "NO_OLD_SAFARI_ARRAY_ITERATOR" | "NO_V8_SRC" | "SAFARI_10" | "SAFARI_12" | "SAFARI_7_0" | "SAFARI_7_1" | "SAFARI_9" | "SELF_OBJ" | "STATUS" | "UNDEFINED" | "UNEVAL" | "V8_SRC" | "WINDOW" | "CHROME" | "CHROME_PREV" | "EDGE" | "EDGE_PREV" | "FF" | "FF_ESR" | "SAFARI" | "SAFARI_8" | "SELF" | `ReadonlyArray<Feature | "ANDRO_4_0" | "ANDRO_4_1" | "ANDRO_4_4" | "ANY_DOCUMENT" | "ANY_WINDOW" | "ARRAY_ITERATOR" | "ARROW" | "ATOB" | "AUTO" | "BARPROP" | "BROWSER" | "CAPITAL_HTML" | "CHROME_73" | "COMPACT" | "CONSOLE" | "DEFAULT" | "DOCUMENT" | "DOMWINDOW" | "EDGE_40" | "ESC_HTML_ALL" | "ESC_HTML_QUOT" | "ESC_HTML_QUOT_ONLY" | "ESC_REGEXP_LF" | "ESC_REGEXP_SLASH" | "EXTERNAL" | "FF_54" | "FF_62" | "FF_SRC" | "FILL" | "FLAT" | "FROM_CODE_POINT" | "FUNCTION_19_LF" | "FUNCTION_22_LF" | "GMT" | "HISTORY" | "HTMLAUDIOELEMENT" | "HTMLDOCUMENT" | "IE_10" | "IE_11" | "IE_11_WIN_10" | "IE_9" | "IE_SRC" | "INCR_CHAR" | "INTL" | "LOCALE_INFINITY" | "NAME" | "NODECONSTRUCTOR" | "NODE_0_10" | "NODE_0_12" | "NODE_10" | "NODE_11" | "NODE_12" | "NODE_4" | "NODE_5" | "NO_FF_SRC" | "NO_IE_SRC" | "NO_OLD_SAFARI_ARRAY_ITERATOR" | "NO_V8_SRC" | "SAFARI_10" | "SAFARI_12" | "SAFARI_7_0" | "SAFARI_7_1" | "SAFARI_9" | "SELF_OBJ" | "STATUS" | "UNDEFINED" | "UNEVAL" | "V8_SRC" | "WINDOW" | "CHROME" | "CHROME_PREV" | "EDGE" | "EDGE_PREV" | "FF" | "FF_ESR" | "SAFARI" | "SAFARI_8" | "SELF">`[]): *boolean*

*Inherited from [Feature](_jscrewit_.feature.md).[includes](_jscrewit_.feature.md#includes)*

*Defined in [feature.d.ts:87](https://github.com/fasttime/JScrewIt/blob/2.10.1/lib/feature.d.ts#L87)*

Determines whether this feature object includes all of the specified features.

**Parameters:**

Name | Type |
------ | ------ |
`...features` | [Feature](_jscrewit_.feature.md) \| "ANDRO_4_0" \| "ANDRO_4_1" \| "ANDRO_4_4" \| "ANY_DOCUMENT" \| "ANY_WINDOW" \| "ARRAY_ITERATOR" \| "ARROW" \| "ATOB" \| "AUTO" \| "BARPROP" \| "BROWSER" \| "CAPITAL_HTML" \| "CHROME_73" \| "COMPACT" \| "CONSOLE" \| "DEFAULT" \| "DOCUMENT" \| "DOMWINDOW" \| "EDGE_40" \| "ESC_HTML_ALL" \| "ESC_HTML_QUOT" \| "ESC_HTML_QUOT_ONLY" \| "ESC_REGEXP_LF" \| "ESC_REGEXP_SLASH" \| "EXTERNAL" \| "FF_54" \| "FF_62" \| "FF_SRC" \| "FILL" \| "FLAT" \| "FROM_CODE_POINT" \| "FUNCTION_19_LF" \| "FUNCTION_22_LF" \| "GMT" \| "HISTORY" \| "HTMLAUDIOELEMENT" \| "HTMLDOCUMENT" \| "IE_10" \| "IE_11" \| "IE_11_WIN_10" \| "IE_9" \| "IE_SRC" \| "INCR_CHAR" \| "INTL" \| "LOCALE_INFINITY" \| "NAME" \| "NODECONSTRUCTOR" \| "NODE_0_10" \| "NODE_0_12" \| "NODE_10" \| "NODE_11" \| "NODE_12" \| "NODE_4" \| "NODE_5" \| "NO_FF_SRC" \| "NO_IE_SRC" \| "NO_OLD_SAFARI_ARRAY_ITERATOR" \| "NO_V8_SRC" \| "SAFARI_10" \| "SAFARI_12" \| "SAFARI_7_0" \| "SAFARI_7_1" \| "SAFARI_9" \| "SELF_OBJ" \| "STATUS" \| "UNDEFINED" \| "UNEVAL" \| "V8_SRC" \| "WINDOW" \| "CHROME" \| "CHROME_PREV" \| "EDGE" \| "EDGE_PREV" \| "FF" \| "FF_ESR" \| "SAFARI" \| "SAFARI_8" \| "SELF" \| `ReadonlyArray<Feature \| "ANDRO_4_0" \| "ANDRO_4_1" \| "ANDRO_4_4" \| "ANY_DOCUMENT" \| "ANY_WINDOW" \| "ARRAY_ITERATOR" \| "ARROW" \| "ATOB" \| "AUTO" \| "BARPROP" \| "BROWSER" \| "CAPITAL_HTML" \| "CHROME_73" \| "COMPACT" \| "CONSOLE" \| "DEFAULT" \| "DOCUMENT" \| "DOMWINDOW" \| "EDGE_40" \| "ESC_HTML_ALL" \| "ESC_HTML_QUOT" \| "ESC_HTML_QUOT_ONLY" \| "ESC_REGEXP_LF" \| "ESC_REGEXP_SLASH" \| "EXTERNAL" \| "FF_54" \| "FF_62" \| "FF_SRC" \| "FILL" \| "FLAT" \| "FROM_CODE_POINT" \| "FUNCTION_19_LF" \| "FUNCTION_22_LF" \| "GMT" \| "HISTORY" \| "HTMLAUDIOELEMENT" \| "HTMLDOCUMENT" \| "IE_10" \| "IE_11" \| "IE_11_WIN_10" \| "IE_9" \| "IE_SRC" \| "INCR_CHAR" \| "INTL" \| "LOCALE_INFINITY" \| "NAME" \| "NODECONSTRUCTOR" \| "NODE_0_10" \| "NODE_0_12" \| "NODE_10" \| "NODE_11" \| "NODE_12" \| "NODE_4" \| "NODE_5" \| "NO_FF_SRC" \| "NO_IE_SRC" \| "NO_OLD_SAFARI_ARRAY_ITERATOR" \| "NO_V8_SRC" \| "SAFARI_10" \| "SAFARI_12" \| "SAFARI_7_0" \| "SAFARI_7_1" \| "SAFARI_9" \| "SELF_OBJ" \| "STATUS" \| "UNDEFINED" \| "UNEVAL" \| "V8_SRC" \| "WINDOW" \| "CHROME" \| "CHROME_PREV" \| "EDGE" \| "EDGE_PREV" \| "FF" \| "FF_ESR" \| "SAFARI" \| "SAFARI_8" \| "SELF">`[] |

**Returns:** *boolean*

`true` if this feature object includes all of the specified features; otherwise, `false`.
If no arguments are specified, the return value is `true`.

___

###  restrict

▸ **restrict**(`environment`: "forced-strict-mode" | "web-worker", `engineFeatureObjs?`: `ReadonlyArray<PredefinedFeature>`): *[CustomFeature](_jscrewit_.customfeature.md)*

*Inherited from [Feature](_jscrewit_.feature.md).[restrict](_jscrewit_.feature.md#restrict)*

*Defined in [feature.d.ts:119](https://github.com/fasttime/JScrewIt/blob/2.10.1/lib/feature.d.ts#L119)*

Creates a new feature object from this feature by removing elementary features that are
not available inside a particular environment.

This method is useful to selectively exclude features that are not available inside a web
worker.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`environment` | "forced-strict-mode" \| "web-worker" |   The environment to which this feature should be restricted. Two environments are currently supported.  <dl>  <dt><code>"forced-strict-mode"</code></dt> <dd> Removes features that are not available in environments that require strict mode code. </dd>  <dt><code>"web-worker"</code></dt> <dd>Removes features that are not available inside web workers.</dd>  </dl>  |
`engineFeatureObjs?` | `ReadonlyArray<PredefinedFeature>` |   An array of predefined feature objects, each corresponding to a particular engine in which the restriction should be enacted. If this parameter is omitted, the restriction is enacted in all engines.  |

**Returns:** *[CustomFeature](_jscrewit_.customfeature.md)*