
# Interface: CustomFeature

## Hierarchy

* [Feature](_jscrewit_.customfeature.md#feature)

  ↳ **CustomFeature**

## Index

### Properties

* [Feature](_jscrewit_.customfeature.md#feature)
* [canonicalNames](_jscrewit_.customfeature.md#readonly-canonicalnames)
* [description](_jscrewit_.customfeature.md#optional-description)
* [elementary](_jscrewit_.customfeature.md#readonly-elementary)
* [elementaryNames](_jscrewit_.customfeature.md#readonly-elementarynames)
* [name](_jscrewit_.customfeature.md#optional-name)

### Methods

* [includes](_jscrewit_.customfeature.md#includes)
* [restrict](_jscrewit_.customfeature.md#restrict)

## Properties

###  Feature

• **Feature**: *[FeatureConstructor](_jscrewit_.featureconstructor.md)*

___

### `Readonly` canonicalNames

• **canonicalNames**: *[ElementaryFeatureName](../modules/_jscrewit_.md#elementaryfeaturename)[]*

*Inherited from [CustomFeature](_jscrewit_.customfeature.md).[canonicalNames](_jscrewit_.customfeature.md#readonly-canonicalnames)*

An array of all elementary feature names included in this feature object, without aliases
and implied features.

___

### `Optional` description

• **description**? : *undefined | string*

*Inherited from [CustomFeature](_jscrewit_.customfeature.md).[description](_jscrewit_.customfeature.md#optional-description)*

A short description of this feature object in plain English.

All predefined features have a description.
If desired, custom features may be assigned a description, too.

___

### `Readonly` elementary

• **elementary**: *false*

*Overrides [Feature](_jscrewit_.feature.md).[elementary](_jscrewit_.feature.md#readonly-elementary)*

___

### `Readonly` elementaryNames

• **elementaryNames**: *[ElementaryFeatureName](../modules/_jscrewit_.md#elementaryfeaturename)[]*

*Inherited from [CustomFeature](_jscrewit_.customfeature.md).[elementaryNames](_jscrewit_.customfeature.md#readonly-elementarynames)*

An array of all elementary feature names included in this feature object, without
aliases.

___

### `Optional` name

• **name**? : *undefined | string*

*Inherited from [CustomFeature](_jscrewit_.customfeature.md).[name](_jscrewit_.customfeature.md#optional-name)*

The primary name of this feature object, useful for identification purpose.

All predefined features have a name.
If desired, custom features may be assigned a name, too.

## Methods

###  includes

▸ **includes**(...`features`: [Feature](_jscrewit_.customfeature.md#feature) | "ANY_DOCUMENT" | "ANY_WINDOW" | "ARRAY_ITERATOR" | "ARROW" | "ATOB" | "BARPROP" | "CAPITAL_HTML" | "CONSOLE" | "DOCUMENT" | "DOMWINDOW" | "ESC_HTML_ALL" | "ESC_HTML_QUOT" | "ESC_HTML_QUOT_ONLY" | "ESC_REGEXP_LF" | "ESC_REGEXP_SLASH" | "EXTERNAL" | "FF_SRC" | "FILL" | "FLAT" | "FROM_CODE_POINT" | "FUNCTION_19_LF" | "FUNCTION_22_LF" | "GMT" | "HISTORY" | "HTMLAUDIOELEMENT" | "HTMLDOCUMENT" | "IE_SRC" | "INCR_CHAR" | "INTL" | "LOCALE_INFINITY" | "NAME" | "NODECONSTRUCTOR" | "NO_FF_SRC" | "NO_IE_SRC" | "NO_OLD_SAFARI_ARRAY_ITERATOR" | "NO_V8_SRC" | "SELF_OBJ" | "STATUS" | "UNDEFINED" | "UNEVAL" | "V8_SRC" | "WINDOW" | "ANDRO_4_0" | "ANDRO_4_1" | "ANDRO_4_4" | "AUTO" | "BROWSER" | "CHROME_73" | "COMPACT" | "DEFAULT" | "FF_62" | "FF_74" | "FF_78" | "IE_10" | "IE_11" | "IE_11_WIN_10" | "IE_9" | "NODE_0_10" | "NODE_0_12" | "NODE_10" | "NODE_11" | "NODE_12" | "NODE_4" | "NODE_5" | "SAFARI_10" | "SAFARI_12" | "SAFARI_7_0" | "SAFARI_7_1" | "SAFARI_9" | "CHROME" | "CHROME_PREV" | "FF" | "FF_ESR" | "FF_PREV" | "SAFARI" | "SAFARI_8" | "SELF" | ReadonlyArray‹[Feature](_jscrewit_.customfeature.md#feature) | "ANY_DOCUMENT" | "ANY_WINDOW" | "ARRAY_ITERATOR" | "ARROW" | "ATOB" | "BARPROP" | "CAPITAL_HTML" | "CONSOLE" | "DOCUMENT" | "DOMWINDOW" | "ESC_HTML_ALL" | "ESC_HTML_QUOT" | "ESC_HTML_QUOT_ONLY" | "ESC_REGEXP_LF" | "ESC_REGEXP_SLASH" | "EXTERNAL" | "FF_SRC" | "FILL" | "FLAT" | "FROM_CODE_POINT" | "FUNCTION_19_LF" | "FUNCTION_22_LF" | "GMT" | "HISTORY" | "HTMLAUDIOELEMENT" | "HTMLDOCUMENT" | "IE_SRC" | "INCR_CHAR" | "INTL" | "LOCALE_INFINITY" | "NAME" | "NODECONSTRUCTOR" | "NO_FF_SRC" | "NO_IE_SRC" | "NO_OLD_SAFARI_ARRAY_ITERATOR" | "NO_V8_SRC" | "SELF_OBJ" | "STATUS" | "UNDEFINED" | "UNEVAL" | "V8_SRC" | "WINDOW" | "ANDRO_4_0" | "ANDRO_4_1" | "ANDRO_4_4" | "AUTO" | "BROWSER" | "CHROME_73" | "COMPACT" | "DEFAULT" | "FF_62" | "FF_74" | "FF_78" | "IE_10" | "IE_11" | "IE_11_WIN_10" | "IE_9" | "NODE_0_10" | "NODE_0_12" | "NODE_10" | "NODE_11" | "NODE_12" | "NODE_4" | "NODE_5" | "SAFARI_10" | "SAFARI_12" | "SAFARI_7_0" | "SAFARI_7_1" | "SAFARI_9" | "CHROME" | "CHROME_PREV" | "FF" | "FF_ESR" | "FF_PREV" | "SAFARI" | "SAFARI_8" | "SELF"›[]): *boolean*

*Inherited from [CustomFeature](_jscrewit_.customfeature.md).[includes](_jscrewit_.customfeature.md#includes)*

Determines whether this feature object includes all of the specified features.

**Parameters:**

Name | Type |
------ | ------ |
`...features` | [Feature](_jscrewit_.customfeature.md#feature) &#124; "ANY_DOCUMENT" &#124; "ANY_WINDOW" &#124; "ARRAY_ITERATOR" &#124; "ARROW" &#124; "ATOB" &#124; "BARPROP" &#124; "CAPITAL_HTML" &#124; "CONSOLE" &#124; "DOCUMENT" &#124; "DOMWINDOW" &#124; "ESC_HTML_ALL" &#124; "ESC_HTML_QUOT" &#124; "ESC_HTML_QUOT_ONLY" &#124; "ESC_REGEXP_LF" &#124; "ESC_REGEXP_SLASH" &#124; "EXTERNAL" &#124; "FF_SRC" &#124; "FILL" &#124; "FLAT" &#124; "FROM_CODE_POINT" &#124; "FUNCTION_19_LF" &#124; "FUNCTION_22_LF" &#124; "GMT" &#124; "HISTORY" &#124; "HTMLAUDIOELEMENT" &#124; "HTMLDOCUMENT" &#124; "IE_SRC" &#124; "INCR_CHAR" &#124; "INTL" &#124; "LOCALE_INFINITY" &#124; "NAME" &#124; "NODECONSTRUCTOR" &#124; "NO_FF_SRC" &#124; "NO_IE_SRC" &#124; "NO_OLD_SAFARI_ARRAY_ITERATOR" &#124; "NO_V8_SRC" &#124; "SELF_OBJ" &#124; "STATUS" &#124; "UNDEFINED" &#124; "UNEVAL" &#124; "V8_SRC" &#124; "WINDOW" &#124; "ANDRO_4_0" &#124; "ANDRO_4_1" &#124; "ANDRO_4_4" &#124; "AUTO" &#124; "BROWSER" &#124; "CHROME_73" &#124; "COMPACT" &#124; "DEFAULT" &#124; "FF_62" &#124; "FF_74" &#124; "FF_78" &#124; "IE_10" &#124; "IE_11" &#124; "IE_11_WIN_10" &#124; "IE_9" &#124; "NODE_0_10" &#124; "NODE_0_12" &#124; "NODE_10" &#124; "NODE_11" &#124; "NODE_12" &#124; "NODE_4" &#124; "NODE_5" &#124; "SAFARI_10" &#124; "SAFARI_12" &#124; "SAFARI_7_0" &#124; "SAFARI_7_1" &#124; "SAFARI_9" &#124; "CHROME" &#124; "CHROME_PREV" &#124; "FF" &#124; "FF_ESR" &#124; "FF_PREV" &#124; "SAFARI" &#124; "SAFARI_8" &#124; "SELF" &#124; ReadonlyArray‹[Feature](_jscrewit_.customfeature.md#feature) &#124; "ANY_DOCUMENT" &#124; "ANY_WINDOW" &#124; "ARRAY_ITERATOR" &#124; "ARROW" &#124; "ATOB" &#124; "BARPROP" &#124; "CAPITAL_HTML" &#124; "CONSOLE" &#124; "DOCUMENT" &#124; "DOMWINDOW" &#124; "ESC_HTML_ALL" &#124; "ESC_HTML_QUOT" &#124; "ESC_HTML_QUOT_ONLY" &#124; "ESC_REGEXP_LF" &#124; "ESC_REGEXP_SLASH" &#124; "EXTERNAL" &#124; "FF_SRC" &#124; "FILL" &#124; "FLAT" &#124; "FROM_CODE_POINT" &#124; "FUNCTION_19_LF" &#124; "FUNCTION_22_LF" &#124; "GMT" &#124; "HISTORY" &#124; "HTMLAUDIOELEMENT" &#124; "HTMLDOCUMENT" &#124; "IE_SRC" &#124; "INCR_CHAR" &#124; "INTL" &#124; "LOCALE_INFINITY" &#124; "NAME" &#124; "NODECONSTRUCTOR" &#124; "NO_FF_SRC" &#124; "NO_IE_SRC" &#124; "NO_OLD_SAFARI_ARRAY_ITERATOR" &#124; "NO_V8_SRC" &#124; "SELF_OBJ" &#124; "STATUS" &#124; "UNDEFINED" &#124; "UNEVAL" &#124; "V8_SRC" &#124; "WINDOW" &#124; "ANDRO_4_0" &#124; "ANDRO_4_1" &#124; "ANDRO_4_4" &#124; "AUTO" &#124; "BROWSER" &#124; "CHROME_73" &#124; "COMPACT" &#124; "DEFAULT" &#124; "FF_62" &#124; "FF_74" &#124; "FF_78" &#124; "IE_10" &#124; "IE_11" &#124; "IE_11_WIN_10" &#124; "IE_9" &#124; "NODE_0_10" &#124; "NODE_0_12" &#124; "NODE_10" &#124; "NODE_11" &#124; "NODE_12" &#124; "NODE_4" &#124; "NODE_5" &#124; "SAFARI_10" &#124; "SAFARI_12" &#124; "SAFARI_7_0" &#124; "SAFARI_7_1" &#124; "SAFARI_9" &#124; "CHROME" &#124; "CHROME_PREV" &#124; "FF" &#124; "FF_ESR" &#124; "FF_PREV" &#124; "SAFARI" &#124; "SAFARI_8" &#124; "SELF"›[] |

**Returns:** *boolean*

`true` if this feature object includes all of the specified features; otherwise, `false`.
If no arguments are specified, the return value is `true`.

___

###  restrict

▸ **restrict**(`environment`: "forced-strict-mode" | "web-worker", `engineFeatureObjs?`: keyof PredefinedFeature[]): *[CustomFeature](_jscrewit_.customfeature.md)*

*Inherited from [CustomFeature](_jscrewit_.customfeature.md).[restrict](_jscrewit_.customfeature.md#restrict)*

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
