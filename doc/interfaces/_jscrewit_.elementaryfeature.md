[JScrewIt](../README.md) › ["jscrewit"](../modules/_jscrewit_.md) › [ElementaryFeature](_jscrewit_.elementaryfeature.md)

# Interface: ElementaryFeature

## Hierarchy

  ↳ [PredefinedFeature](_jscrewit_.predefinedfeature.md)

  ↳ **ElementaryFeature**

## Index

### Properties

* [canonicalNames](_jscrewit_.elementaryfeature.md#canonicalnames)
* [description](_jscrewit_.elementaryfeature.md#description)
* [elementary](_jscrewit_.elementaryfeature.md#elementary)
* [elementaryNames](_jscrewit_.elementaryfeature.md#elementarynames)
* [name](_jscrewit_.elementaryfeature.md#name)

### Methods

* [includes](_jscrewit_.elementaryfeature.md#includes)
* [restrict](_jscrewit_.elementaryfeature.md#restrict)

## Properties

###  canonicalNames

• **canonicalNames**: *[ElementaryFeatureName](../modules/_jscrewit_.md#elementaryfeaturename)[]*

*Inherited from [Feature](_jscrewit_.feature.md).[canonicalNames](_jscrewit_.feature.md#canonicalnames)*

*Defined in [feature.d.ts:61](https://github.com/fasttime/JScrewIt/blob/2.10.1/lib/feature.d.ts#L61)*

An array of all elementary feature names included in this feature object, without aliases
and implied features.

___

###  description

• **description**: *string*

*Inherited from [PredefinedFeature](_jscrewit_.predefinedfeature.md).[description](_jscrewit_.predefinedfeature.md#description)*

*Overrides [Feature](_jscrewit_.feature.md).[description](_jscrewit_.feature.md#optional-description)*

*Defined in [feature.d.ts:310](https://github.com/fasttime/JScrewIt/blob/2.10.1/lib/feature.d.ts#L310)*

___

###  elementary

• **elementary**: *true*

*Overrides [Feature](_jscrewit_.feature.md).[elementary](_jscrewit_.feature.md#elementary)*

*Defined in [feature.d.ts:25](https://github.com/fasttime/JScrewIt/blob/2.10.1/lib/feature.d.ts#L25)*

___

###  elementaryNames

• **elementaryNames**: *[ElementaryFeatureName](../modules/_jscrewit_.md#elementaryfeaturename)[]*

*Inherited from [Feature](_jscrewit_.feature.md).[elementaryNames](_jscrewit_.feature.md#elementarynames)*

*Defined in [feature.d.ts:78](https://github.com/fasttime/JScrewIt/blob/2.10.1/lib/feature.d.ts#L78)*

An array of all elementary feature names included in this feature object, without
aliases.

___

###  name

• **name**: *[ElementaryFeatureName](../modules/_jscrewit_.md#elementaryfeaturename)*

*Overrides [PredefinedFeature](_jscrewit_.predefinedfeature.md).[name](_jscrewit_.predefinedfeature.md#name)*

*Defined in [feature.d.ts:26](https://github.com/fasttime/JScrewIt/blob/2.10.1/lib/feature.d.ts#L26)*

## Methods

###  includes

▸ **includes**(...`features`: [Feature](_jscrewit_.feature.md) | "ANY_DOCUMENT" | "ANY_WINDOW" | "ARRAY_ITERATOR" | "ARROW" | "ATOB" | "BARPROP" | "CAPITAL_HTML" | "CONSOLE" | "DOCUMENT" | "DOMWINDOW" | "ESC_HTML_ALL" | "ESC_HTML_QUOT" | "ESC_HTML_QUOT_ONLY" | "ESC_REGEXP_LF" | "ESC_REGEXP_SLASH" | "EXTERNAL" | "FF_SRC" | "FILL" | "FLAT" | "FROM_CODE_POINT" | "FUNCTION_19_LF" | "FUNCTION_22_LF" | "GMT" | "HISTORY" | "HTMLAUDIOELEMENT" | "HTMLDOCUMENT" | "IE_SRC" | "INCR_CHAR" | "INTL" | "LOCALE_INFINITY" | "NAME" | "NODECONSTRUCTOR" | "NO_FF_SRC" | "NO_IE_SRC" | "NO_OLD_SAFARI_ARRAY_ITERATOR" | "NO_V8_SRC" | "SELF_OBJ" | "STATUS" | "UNDEFINED" | "UNEVAL" | "V8_SRC" | "WINDOW" | "ANDRO_4_0" | "ANDRO_4_1" | "ANDRO_4_4" | "AUTO" | "BROWSER" | "CHROME_73" | "COMPACT" | "DEFAULT" | "EDGE_40" | "FF_54" | "FF_62" | "IE_10" | "IE_11" | "IE_11_WIN_10" | "IE_9" | "NODE_0_10" | "NODE_0_12" | "NODE_10" | "NODE_11" | "NODE_12" | "NODE_4" | "NODE_5" | "SAFARI_10" | "SAFARI_12" | "SAFARI_7_0" | "SAFARI_7_1" | "SAFARI_9" | "CHROME" | "CHROME_PREV" | "EDGE" | "EDGE_PREV" | "FF" | "FF_ESR" | "SAFARI" | "SAFARI_8" | "SELF" | ReadonlyArray‹[Feature](_jscrewit_.feature.md) | "ANY_DOCUMENT" | "ANY_WINDOW" | "ARRAY_ITERATOR" | "ARROW" | "ATOB" | "BARPROP" | "CAPITAL_HTML" | "CONSOLE" | "DOCUMENT" | "DOMWINDOW" | "ESC_HTML_ALL" | "ESC_HTML_QUOT" | "ESC_HTML_QUOT_ONLY" | "ESC_REGEXP_LF" | "ESC_REGEXP_SLASH" | "EXTERNAL" | "FF_SRC" | "FILL" | "FLAT" | "FROM_CODE_POINT" | "FUNCTION_19_LF" | "FUNCTION_22_LF" | "GMT" | "HISTORY" | "HTMLAUDIOELEMENT" | "HTMLDOCUMENT" | "IE_SRC" | "INCR_CHAR" | "INTL" | "LOCALE_INFINITY" | "NAME" | "NODECONSTRUCTOR" | "NO_FF_SRC" | "NO_IE_SRC" | "NO_OLD_SAFARI_ARRAY_ITERATOR" | "NO_V8_SRC" | "SELF_OBJ" | "STATUS" | "UNDEFINED" | "UNEVAL" | "V8_SRC" | "WINDOW" | "ANDRO_4_0" | "ANDRO_4_1" | "ANDRO_4_4" | "AUTO" | "BROWSER" | "CHROME_73" | "COMPACT" | "DEFAULT" | "EDGE_40" | "FF_54" | "FF_62" | "IE_10" | "IE_11" | "IE_11_WIN_10" | "IE_9" | "NODE_0_10" | "NODE_0_12" | "NODE_10" | "NODE_11" | "NODE_12" | "NODE_4" | "NODE_5" | "SAFARI_10" | "SAFARI_12" | "SAFARI_7_0" | "SAFARI_7_1" | "SAFARI_9" | "CHROME" | "CHROME_PREV" | "EDGE" | "EDGE_PREV" | "FF" | "FF_ESR" | "SAFARI" | "SAFARI_8" | "SELF"›[]): *boolean*

*Inherited from [Feature](_jscrewit_.feature.md).[includes](_jscrewit_.feature.md#includes)*

*Defined in [feature.d.ts:96](https://github.com/fasttime/JScrewIt/blob/2.10.1/lib/feature.d.ts#L96)*

Determines whether this feature object includes all of the specified features.

**Parameters:**

Name | Type |
------ | ------ |
`...features` | [Feature](_jscrewit_.feature.md) &#124; "ANY_DOCUMENT" &#124; "ANY_WINDOW" &#124; "ARRAY_ITERATOR" &#124; "ARROW" &#124; "ATOB" &#124; "BARPROP" &#124; "CAPITAL_HTML" &#124; "CONSOLE" &#124; "DOCUMENT" &#124; "DOMWINDOW" &#124; "ESC_HTML_ALL" &#124; "ESC_HTML_QUOT" &#124; "ESC_HTML_QUOT_ONLY" &#124; "ESC_REGEXP_LF" &#124; "ESC_REGEXP_SLASH" &#124; "EXTERNAL" &#124; "FF_SRC" &#124; "FILL" &#124; "FLAT" &#124; "FROM_CODE_POINT" &#124; "FUNCTION_19_LF" &#124; "FUNCTION_22_LF" &#124; "GMT" &#124; "HISTORY" &#124; "HTMLAUDIOELEMENT" &#124; "HTMLDOCUMENT" &#124; "IE_SRC" &#124; "INCR_CHAR" &#124; "INTL" &#124; "LOCALE_INFINITY" &#124; "NAME" &#124; "NODECONSTRUCTOR" &#124; "NO_FF_SRC" &#124; "NO_IE_SRC" &#124; "NO_OLD_SAFARI_ARRAY_ITERATOR" &#124; "NO_V8_SRC" &#124; "SELF_OBJ" &#124; "STATUS" &#124; "UNDEFINED" &#124; "UNEVAL" &#124; "V8_SRC" &#124; "WINDOW" &#124; "ANDRO_4_0" &#124; "ANDRO_4_1" &#124; "ANDRO_4_4" &#124; "AUTO" &#124; "BROWSER" &#124; "CHROME_73" &#124; "COMPACT" &#124; "DEFAULT" &#124; "EDGE_40" &#124; "FF_54" &#124; "FF_62" &#124; "IE_10" &#124; "IE_11" &#124; "IE_11_WIN_10" &#124; "IE_9" &#124; "NODE_0_10" &#124; "NODE_0_12" &#124; "NODE_10" &#124; "NODE_11" &#124; "NODE_12" &#124; "NODE_4" &#124; "NODE_5" &#124; "SAFARI_10" &#124; "SAFARI_12" &#124; "SAFARI_7_0" &#124; "SAFARI_7_1" &#124; "SAFARI_9" &#124; "CHROME" &#124; "CHROME_PREV" &#124; "EDGE" &#124; "EDGE_PREV" &#124; "FF" &#124; "FF_ESR" &#124; "SAFARI" &#124; "SAFARI_8" &#124; "SELF" &#124; ReadonlyArray‹[Feature](_jscrewit_.feature.md) &#124; "ANY_DOCUMENT" &#124; "ANY_WINDOW" &#124; "ARRAY_ITERATOR" &#124; "ARROW" &#124; "ATOB" &#124; "BARPROP" &#124; "CAPITAL_HTML" &#124; "CONSOLE" &#124; "DOCUMENT" &#124; "DOMWINDOW" &#124; "ESC_HTML_ALL" &#124; "ESC_HTML_QUOT" &#124; "ESC_HTML_QUOT_ONLY" &#124; "ESC_REGEXP_LF" &#124; "ESC_REGEXP_SLASH" &#124; "EXTERNAL" &#124; "FF_SRC" &#124; "FILL" &#124; "FLAT" &#124; "FROM_CODE_POINT" &#124; "FUNCTION_19_LF" &#124; "FUNCTION_22_LF" &#124; "GMT" &#124; "HISTORY" &#124; "HTMLAUDIOELEMENT" &#124; "HTMLDOCUMENT" &#124; "IE_SRC" &#124; "INCR_CHAR" &#124; "INTL" &#124; "LOCALE_INFINITY" &#124; "NAME" &#124; "NODECONSTRUCTOR" &#124; "NO_FF_SRC" &#124; "NO_IE_SRC" &#124; "NO_OLD_SAFARI_ARRAY_ITERATOR" &#124; "NO_V8_SRC" &#124; "SELF_OBJ" &#124; "STATUS" &#124; "UNDEFINED" &#124; "UNEVAL" &#124; "V8_SRC" &#124; "WINDOW" &#124; "ANDRO_4_0" &#124; "ANDRO_4_1" &#124; "ANDRO_4_4" &#124; "AUTO" &#124; "BROWSER" &#124; "CHROME_73" &#124; "COMPACT" &#124; "DEFAULT" &#124; "EDGE_40" &#124; "FF_54" &#124; "FF_62" &#124; "IE_10" &#124; "IE_11" &#124; "IE_11_WIN_10" &#124; "IE_9" &#124; "NODE_0_10" &#124; "NODE_0_12" &#124; "NODE_10" &#124; "NODE_11" &#124; "NODE_12" &#124; "NODE_4" &#124; "NODE_5" &#124; "SAFARI_10" &#124; "SAFARI_12" &#124; "SAFARI_7_0" &#124; "SAFARI_7_1" &#124; "SAFARI_9" &#124; "CHROME" &#124; "CHROME_PREV" &#124; "EDGE" &#124; "EDGE_PREV" &#124; "FF" &#124; "FF_ESR" &#124; "SAFARI" &#124; "SAFARI_8" &#124; "SELF"›[] |

**Returns:** *boolean*

`true` if this feature object includes all of the specified features; otherwise, `false`.
If no arguments are specified, the return value is `true`.

___

###  restrict

▸ **restrict**(`environment`: "forced-strict-mode" | "web-worker", `engineFeatureObjs?`: keyof PredefinedFeature[]): *[CustomFeature](_jscrewit_.customfeature.md)*

*Inherited from [Feature](_jscrewit_.feature.md).[restrict](_jscrewit_.feature.md#restrict)*

*Defined in [feature.d.ts:128](https://github.com/fasttime/JScrewIt/blob/2.10.1/lib/feature.d.ts#L128)*

Creates a new feature object from this feature by removing elementary features that are
not available inside a particular environment.

This method is useful to selectively exclude features that are not available inside a web
worker.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`environment` | "forced-strict-mode" &#124; "web-worker" |   The environment to which this feature should be restricted. Two environments are currently supported.  <dl>  <dt><code>"forced-strict-mode"</code></dt> <dd> Removes features that are not available in environments that require strict mode code. </dd>  <dt><code>"web-worker"</code></dt> <dd>Removes features that are not available inside web workers.</dd>  </dl>  |
`engineFeatureObjs?` | keyof PredefinedFeature[] |   An array of predefined feature objects, each corresponding to a particular engine in which the restriction should be enacted. If this parameter is omitted, the restriction is enacted in all engines.  |

**Returns:** *[CustomFeature](_jscrewit_.customfeature.md)*
