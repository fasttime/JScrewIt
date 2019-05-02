[JScrewIt](../README.md) > [Feature](../interfaces/feature.md)

# Interface: Feature

Objects of this type indicate which of the capabilities that JScrewIt can use to minimize the length of its output are available in a particular JavaScript engine.

JScrewIt comes with a set of predefined feature objects exposed as property values of [`JScrewIt.Feature`](jscrewit.md#feature) or [`JScrewIt.Feature.ALL`](featureconstructor.md#all), where the property name is the feature's name or an alias thereof.

Besides these predefined features, it is possible to construct custom features from the union or intersection of other features.

Among the predefined features, there are some special ones called _elementary_ features. Elementary features either cannot be expressed as a union of any number of other features, or they are different from such a union in that they exclude some other feature not excluded by their elementary components. All other features, called _composite_ features, can be constructed as a union of zero or more elementary features. Two of the predefined composite features are particularly important: [`DEFAULT`](featureall.md#DEFAULT) is the empty feature, indicating that no elementary feature is available at all; [`AUTO`](featureall.md#AUTO) is the union of all elementary features available in the current engine.

Not all features can be available at the same time: some features are necessarily incompatible, meaning that they mutually exclude each other, and thus their union cannot be constructed.

## Hierarchy

**Feature**

## Index

### Properties

* [canonicalNames](feature.md#canonicalnames)
* [description](feature.md#description)
* [elementary](feature.md#elementary)
* [elementaryNames](feature.md#elementarynames)
* [name](feature.md#name)

### Methods

* [includes](feature.md#includes)
* [restrict](feature.md#restrict)

---

## Properties

<a id="canonicalnames"></a>

###  canonicalNames

**● canonicalNames**: *`string`[]*

*Defined in [feature.d.ts:47](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature.d.ts#L47)*

An array of all elementary feature names included in this feature object, without aliases and implied features.

___
<a id="description"></a>

### `<Optional>` description

**● description**: *`string`*

*Defined in [feature.d.ts:55](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature.d.ts#L55)*

A short description of this feature object in plain English.

All predefined features have a description. If desired, custom features may be assigned a description, too.

___
<a id="elementary"></a>

###  elementary

**● elementary**: *`boolean`*

*Defined in [feature.d.ts:58](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature.d.ts#L58)*

A boolean value indicating whether this is an elementary feature object.

___
<a id="elementarynames"></a>

###  elementaryNames

**● elementaryNames**: *`string`[]*

*Defined in [feature.d.ts:63](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature.d.ts#L63)*

An array of all elementary feature names included in this feature object, without aliases.

___
<a id="name"></a>

### `<Optional>` name

**● name**: *`string`*

*Defined in [feature.d.ts:71](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature.d.ts#L71)*

The primary name of this feature object, useful for identification purpose.

All predefined features have a name. If desired, custom features may be assigned a name, too.

___

## Methods

<a id="includes"></a>

###  includes

▸ **includes**(...features: *([Feature](feature.md) \| "ANDRO_4_0" \| "ANDRO_4_1" \| "ANDRO_4_4" \| "ANY_DOCUMENT" \| "ANY_WINDOW" \| "ARRAY_ITERATOR" \| "ARROW" \| "ATOB" \| "AUTO" \| "BARPROP" \| "BROWSER" \| "CAPITAL_HTML" \| "CHROME" \| "CHROME_73" \| "CHROME_PREV" \| "COMPACT" \| "CONSOLE" \| "DEFAULT" \| "DOCUMENT" \| "DOMWINDOW" \| "EDGE" \| "EDGE_40" \| "EDGE_PREV" \| "ESC_HTML_ALL" \| "ESC_HTML_QUOT" \| "ESC_HTML_QUOT_ONLY" \| "ESC_REGEXP_LF" \| "ESC_REGEXP_SLASH" \| "EXTERNAL" \| "FF" \| "FF_54" \| "FF_62" \| "FF_ESR" \| "FF_SRC" \| "FILL" \| "FLAT" \| "FROM_CODE_POINT" \| "FUNCTION_19_LF" \| "FUNCTION_22_LF" \| "GMT" \| "HISTORY" \| "HTMLAUDIOELEMENT" \| "HTMLDOCUMENT" \| "IE_10" \| "IE_11" \| "IE_11_WIN_10" \| "IE_9" \| "IE_SRC" \| "INCR_CHAR" \| "INTL" \| "LOCALE_INFINITY" \| "NAME" \| "NODECONSTRUCTOR" \| "NODE_0_10" \| "NODE_0_12" \| "NODE_10" \| "NODE_11" \| "NODE_12" \| "NODE_4" \| "NODE_5" \| "NO_FF_SRC" \| "NO_IE_SRC" \| "NO_OLD_SAFARI_ARRAY_ITERATOR" \| "NO_V8_SRC" \| "SAFARI" \| "SAFARI_10" \| "SAFARI_12" \| "SAFARI_7_0" \| "SAFARI_7_1" \| "SAFARI_8" \| "SAFARI_9" \| "SELF" \| "SELF_OBJ" \| "STATUS" \| "UNDEFINED" \| "UNEVAL" \| "V8_SRC" \| "WINDOW" \| ([Feature](feature.md) \| "ANDRO_4_0" \| "ANDRO_4_1" \| "ANDRO_4_4" \| "ANY_DOCUMENT" \| "ANY_WINDOW" \| "ARRAY_ITERATOR" \| "ARROW" \| "ATOB" \| "AUTO" \| "BARPROP" \| "BROWSER" \| "CAPITAL_HTML" \| "CHROME" \| "CHROME_73" \| "CHROME_PREV" \| "COMPACT" \| "CONSOLE" \| "DEFAULT" \| "DOCUMENT" \| "DOMWINDOW" \| "EDGE" \| "EDGE_40" \| "EDGE_PREV" \| "ESC_HTML_ALL" \| "ESC_HTML_QUOT" \| "ESC_HTML_QUOT_ONLY" \| "ESC_REGEXP_LF" \| "ESC_REGEXP_SLASH" \| "EXTERNAL" \| "FF" \| "FF_54" \| "FF_62" \| "FF_ESR" \| "FF_SRC" \| "FILL" \| "FLAT" \| "FROM_CODE_POINT" \| "FUNCTION_19_LF" \| "FUNCTION_22_LF" \| "GMT" \| "HISTORY" \| "HTMLAUDIOELEMENT" \| "HTMLDOCUMENT" \| "IE_10" \| "IE_11" \| "IE_11_WIN_10" \| "IE_9" \| "IE_SRC" \| "INCR_CHAR" \| "INTL" \| "LOCALE_INFINITY" \| "NAME" \| "NODECONSTRUCTOR" \| "NODE_0_10" \| "NODE_0_12" \| "NODE_10" \| "NODE_11" \| "NODE_12" \| "NODE_4" \| "NODE_5" \| "NO_FF_SRC" \| "NO_IE_SRC" \| "NO_OLD_SAFARI_ARRAY_ITERATOR" \| "NO_V8_SRC" \| "SAFARI" \| "SAFARI_10" \| "SAFARI_12" \| "SAFARI_7_0" \| "SAFARI_7_1" \| "SAFARI_8" \| "SAFARI_9" \| "SELF" \| "SELF_OBJ" \| "STATUS" \| "UNDEFINED" \| "UNEVAL" \| "V8_SRC" \| "WINDOW")[])[]*): `boolean`

*Defined in [feature.d.ts:81](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature.d.ts#L81)*

Determines whether this feature object includes all of the specified features.

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` features | ([Feature](feature.md) \| "ANDRO_4_0" \| "ANDRO_4_1" \| "ANDRO_4_4" \| "ANY_DOCUMENT" \| "ANY_WINDOW" \| "ARRAY_ITERATOR" \| "ARROW" \| "ATOB" \| "AUTO" \| "BARPROP" \| "BROWSER" \| "CAPITAL_HTML" \| "CHROME" \| "CHROME_73" \| "CHROME_PREV" \| "COMPACT" \| "CONSOLE" \| "DEFAULT" \| "DOCUMENT" \| "DOMWINDOW" \| "EDGE" \| "EDGE_40" \| "EDGE_PREV" \| "ESC_HTML_ALL" \| "ESC_HTML_QUOT" \| "ESC_HTML_QUOT_ONLY" \| "ESC_REGEXP_LF" \| "ESC_REGEXP_SLASH" \| "EXTERNAL" \| "FF" \| "FF_54" \| "FF_62" \| "FF_ESR" \| "FF_SRC" \| "FILL" \| "FLAT" \| "FROM_CODE_POINT" \| "FUNCTION_19_LF" \| "FUNCTION_22_LF" \| "GMT" \| "HISTORY" \| "HTMLAUDIOELEMENT" \| "HTMLDOCUMENT" \| "IE_10" \| "IE_11" \| "IE_11_WIN_10" \| "IE_9" \| "IE_SRC" \| "INCR_CHAR" \| "INTL" \| "LOCALE_INFINITY" \| "NAME" \| "NODECONSTRUCTOR" \| "NODE_0_10" \| "NODE_0_12" \| "NODE_10" \| "NODE_11" \| "NODE_12" \| "NODE_4" \| "NODE_5" \| "NO_FF_SRC" \| "NO_IE_SRC" \| "NO_OLD_SAFARI_ARRAY_ITERATOR" \| "NO_V8_SRC" \| "SAFARI" \| "SAFARI_10" \| "SAFARI_12" \| "SAFARI_7_0" \| "SAFARI_7_1" \| "SAFARI_8" \| "SAFARI_9" \| "SELF" \| "SELF_OBJ" \| "STATUS" \| "UNDEFINED" \| "UNEVAL" \| "V8_SRC" \| "WINDOW" \| ([Feature](feature.md) \| "ANDRO_4_0" \| "ANDRO_4_1" \| "ANDRO_4_4" \| "ANY_DOCUMENT" \| "ANY_WINDOW" \| "ARRAY_ITERATOR" \| "ARROW" \| "ATOB" \| "AUTO" \| "BARPROP" \| "BROWSER" \| "CAPITAL_HTML" \| "CHROME" \| "CHROME_73" \| "CHROME_PREV" \| "COMPACT" \| "CONSOLE" \| "DEFAULT" \| "DOCUMENT" \| "DOMWINDOW" \| "EDGE" \| "EDGE_40" \| "EDGE_PREV" \| "ESC_HTML_ALL" \| "ESC_HTML_QUOT" \| "ESC_HTML_QUOT_ONLY" \| "ESC_REGEXP_LF" \| "ESC_REGEXP_SLASH" \| "EXTERNAL" \| "FF" \| "FF_54" \| "FF_62" \| "FF_ESR" \| "FF_SRC" \| "FILL" \| "FLAT" \| "FROM_CODE_POINT" \| "FUNCTION_19_LF" \| "FUNCTION_22_LF" \| "GMT" \| "HISTORY" \| "HTMLAUDIOELEMENT" \| "HTMLDOCUMENT" \| "IE_10" \| "IE_11" \| "IE_11_WIN_10" \| "IE_9" \| "IE_SRC" \| "INCR_CHAR" \| "INTL" \| "LOCALE_INFINITY" \| "NAME" \| "NODECONSTRUCTOR" \| "NODE_0_10" \| "NODE_0_12" \| "NODE_10" \| "NODE_11" \| "NODE_12" \| "NODE_4" \| "NODE_5" \| "NO_FF_SRC" \| "NO_IE_SRC" \| "NO_OLD_SAFARI_ARRAY_ITERATOR" \| "NO_V8_SRC" \| "SAFARI" \| "SAFARI_10" \| "SAFARI_12" \| "SAFARI_7_0" \| "SAFARI_7_1" \| "SAFARI_8" \| "SAFARI_9" \| "SELF" \| "SELF_OBJ" \| "STATUS" \| "UNDEFINED" \| "UNEVAL" \| "V8_SRC" \| "WINDOW")[])[] |

**Returns:** `boolean`

`true` if this feature object includes all of the specified features; otherwise, `false`.
If no arguments are specified, the return value is `true`.

___
<a id="restrict"></a>

###  restrict

▸ **restrict**(environment: *`string`*, engineFeatureObjs: *[Feature](feature.md)[]*): [Feature](feature.md)

*Defined in [feature.d.ts:112](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature.d.ts#L112)*

Creates a new feature object from this feature by removing elementary features that are not available inside a particular environment.

This method is useful to selectively exclude features that are not available inside a web worker.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| environment | `string` |  <br><br>The environment to which this feature should be restricted. Two environments are currently supported.<br><br><dl><br><br><dt><code>"forced-strict-mode"</code></dt> <dd> Removes features that are not available in environments that require strict mode code.</dd><br><br><dt><code>"web-worker"</code></dt> <dd>Removes features that are not available inside web workers.</dd><br><br></dl> |
| engineFeatureObjs | [Feature](feature.md)[] |  <br><br>An array of predefined feature objects, each corresponding to a particular engine in which the restriction should be enacted. If this parameter is omitted, the restriction is enacted in all engines. |

**Returns:** [Feature](feature.md)

___

