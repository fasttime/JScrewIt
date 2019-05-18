[JScrewIt](../README.md) > ["jscrewit"](../modules/_jscrewit_.md) > [FeatureConstructor](../interfaces/_jscrewit_.featureconstructor.md)

# Interface: FeatureConstructor

## Hierarchy

 [FeatureAll](_jscrewit_.featureall.md)

**↳ FeatureConstructor**

## Callable
▸ **__call**(...features: *([Feature](_jscrewit_.feature.md) \| "ANDRO_4_0" \| "ANDRO_4_1" \| "ANDRO_4_4" \| "ANY_DOCUMENT" \| "ANY_WINDOW" \| "ARRAY_ITERATOR" \| "ARROW" \| "ATOB" \| "AUTO" \| "BARPROP" \| "BROWSER" \| "CAPITAL_HTML" \| "CHROME_73" \| "COMPACT" \| "CONSOLE" \| "DEFAULT" \| "DOCUMENT" \| "DOMWINDOW" \| "EDGE_40" \| "ESC_HTML_ALL" \| "ESC_HTML_QUOT" \| "ESC_HTML_QUOT_ONLY" \| "ESC_REGEXP_LF" \| "ESC_REGEXP_SLASH" \| "EXTERNAL" \| "FF_54" \| "FF_62" \| "FF_SRC" \| "FILL" \| "FLAT" \| "FROM_CODE_POINT" \| "FUNCTION_19_LF" \| "FUNCTION_22_LF" \| "GMT" \| "HISTORY" \| "HTMLAUDIOELEMENT" \| "HTMLDOCUMENT" \| "IE_10" \| "IE_11" \| "IE_11_WIN_10" \| "IE_9" \| "IE_SRC" \| "INCR_CHAR" \| "INTL" \| "LOCALE_INFINITY" \| "NAME" \| "NODECONSTRUCTOR" \| "NODE_0_10" \| "NODE_0_12" \| "NODE_10" \| "NODE_11" \| "NODE_12" \| "NODE_4" \| "NODE_5" \| "NO_FF_SRC" \| "NO_IE_SRC" \| "NO_OLD_SAFARI_ARRAY_ITERATOR" \| "NO_V8_SRC" \| "SAFARI_10" \| "SAFARI_12" \| "SAFARI_7_0" \| "SAFARI_7_1" \| "SAFARI_9" \| "SELF_OBJ" \| "STATUS" \| "UNDEFINED" \| "UNEVAL" \| "V8_SRC" \| "WINDOW" \| "CHROME" \| "CHROME_PREV" \| "EDGE" \| "EDGE_PREV" \| "FF" \| "FF_ESR" \| "SAFARI" \| "SAFARI_8" \| "SELF" \| `ReadonlyArray`<[Feature](_jscrewit_.feature.md) \| "ANDRO_4_0" \| "ANDRO_4_1" \| "ANDRO_4_4" \| "ANY_DOCUMENT" \| "ANY_WINDOW" \| "ARRAY_ITERATOR" \| "ARROW" \| "ATOB" \| "AUTO" \| "BARPROP" \| "BROWSER" \| "CAPITAL_HTML" \| "CHROME_73" \| "COMPACT" \| "CONSOLE" \| "DEFAULT" \| "DOCUMENT" \| "DOMWINDOW" \| "EDGE_40" \| "ESC_HTML_ALL" \| "ESC_HTML_QUOT" \| "ESC_HTML_QUOT_ONLY" \| "ESC_REGEXP_LF" \| "ESC_REGEXP_SLASH" \| "EXTERNAL" \| "FF_54" \| "FF_62" \| "FF_SRC" \| "FILL" \| "FLAT" \| "FROM_CODE_POINT" \| "FUNCTION_19_LF" \| "FUNCTION_22_LF" \| "GMT" \| "HISTORY" \| "HTMLAUDIOELEMENT" \| "HTMLDOCUMENT" \| "IE_10" \| "IE_11" \| "IE_11_WIN_10" \| "IE_9" \| "IE_SRC" \| "INCR_CHAR" \| "INTL" \| "LOCALE_INFINITY" \| "NAME" \| "NODECONSTRUCTOR" \| "NODE_0_10" \| "NODE_0_12" \| "NODE_10" \| "NODE_11" \| "NODE_12" \| "NODE_4" \| "NODE_5" \| "NO_FF_SRC" \| "NO_IE_SRC" \| "NO_OLD_SAFARI_ARRAY_ITERATOR" \| "NO_V8_SRC" \| "SAFARI_10" \| "SAFARI_12" \| "SAFARI_7_0" \| "SAFARI_7_1" \| "SAFARI_9" \| "SELF_OBJ" \| "STATUS" \| "UNDEFINED" \| "UNEVAL" \| "V8_SRC" \| "WINDOW" \| "CHROME" \| "CHROME_PREV" \| "EDGE" \| "EDGE_PREV" \| "FF" \| "FF_ESR" \| "SAFARI" \| "SAFARI_8" \| "SELF">)[]*): [CustomFeature](_jscrewit_.customfeature.md)

*Defined in [feature.d.ts:183](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature.d.ts#L183)*

Creates a new feature object from the union of the specified features.

The constructor can be used with or without the `new` operator, e.g. `new JScrewIt.Feature(feature1, feature2)` or `JScrewIt.Feature(feature1, feature2)`. If no arguments are specified, the new feature object will be equivalent to [`DEFAULT`](_jscrewit_.featureall.md#DEFAULT).

*__example__*: The following statements are equivalent, and will all construct a new feature object including both [`ANY_DOCUMENT`](_jscrewit_.featureall.md#ANY_DOCUMENT) and [`ANY_WINDOW`](_jscrewit_.featureall.md#ANY_WINDOW).

```js
new JScrewIt.Feature("ANY_DOCUMENT", "ANY_WINDOW");
```

```js
new JScrewIt.Feature(JScrewIt.Feature.ANY_DOCUMENT, JScrewIt.Feature.ANY_WINDOW);
```

```js
new JScrewIt.Feature([JScrewIt.Feature.ANY_DOCUMENT, JScrewIt.Feature.ANY_WINDOW]);
```

*__throws__*: An error is thrown if any of the specified features are not mutually compatible.

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` features | ([Feature](_jscrewit_.feature.md) \| "ANDRO_4_0" \| "ANDRO_4_1" \| "ANDRO_4_4" \| "ANY_DOCUMENT" \| "ANY_WINDOW" \| "ARRAY_ITERATOR" \| "ARROW" \| "ATOB" \| "AUTO" \| "BARPROP" \| "BROWSER" \| "CAPITAL_HTML" \| "CHROME_73" \| "COMPACT" \| "CONSOLE" \| "DEFAULT" \| "DOCUMENT" \| "DOMWINDOW" \| "EDGE_40" \| "ESC_HTML_ALL" \| "ESC_HTML_QUOT" \| "ESC_HTML_QUOT_ONLY" \| "ESC_REGEXP_LF" \| "ESC_REGEXP_SLASH" \| "EXTERNAL" \| "FF_54" \| "FF_62" \| "FF_SRC" \| "FILL" \| "FLAT" \| "FROM_CODE_POINT" \| "FUNCTION_19_LF" \| "FUNCTION_22_LF" \| "GMT" \| "HISTORY" \| "HTMLAUDIOELEMENT" \| "HTMLDOCUMENT" \| "IE_10" \| "IE_11" \| "IE_11_WIN_10" \| "IE_9" \| "IE_SRC" \| "INCR_CHAR" \| "INTL" \| "LOCALE_INFINITY" \| "NAME" \| "NODECONSTRUCTOR" \| "NODE_0_10" \| "NODE_0_12" \| "NODE_10" \| "NODE_11" \| "NODE_12" \| "NODE_4" \| "NODE_5" \| "NO_FF_SRC" \| "NO_IE_SRC" \| "NO_OLD_SAFARI_ARRAY_ITERATOR" \| "NO_V8_SRC" \| "SAFARI_10" \| "SAFARI_12" \| "SAFARI_7_0" \| "SAFARI_7_1" \| "SAFARI_9" \| "SELF_OBJ" \| "STATUS" \| "UNDEFINED" \| "UNEVAL" \| "V8_SRC" \| "WINDOW" \| "CHROME" \| "CHROME_PREV" \| "EDGE" \| "EDGE_PREV" \| "FF" \| "FF_ESR" \| "SAFARI" \| "SAFARI_8" \| "SELF" \| `ReadonlyArray`<[Feature](_jscrewit_.feature.md) \| "ANDRO_4_0" \| "ANDRO_4_1" \| "ANDRO_4_4" \| "ANY_DOCUMENT" \| "ANY_WINDOW" \| "ARRAY_ITERATOR" \| "ARROW" \| "ATOB" \| "AUTO" \| "BARPROP" \| "BROWSER" \| "CAPITAL_HTML" \| "CHROME_73" \| "COMPACT" \| "CONSOLE" \| "DEFAULT" \| "DOCUMENT" \| "DOMWINDOW" \| "EDGE_40" \| "ESC_HTML_ALL" \| "ESC_HTML_QUOT" \| "ESC_HTML_QUOT_ONLY" \| "ESC_REGEXP_LF" \| "ESC_REGEXP_SLASH" \| "EXTERNAL" \| "FF_54" \| "FF_62" \| "FF_SRC" \| "FILL" \| "FLAT" \| "FROM_CODE_POINT" \| "FUNCTION_19_LF" \| "FUNCTION_22_LF" \| "GMT" \| "HISTORY" \| "HTMLAUDIOELEMENT" \| "HTMLDOCUMENT" \| "IE_10" \| "IE_11" \| "IE_11_WIN_10" \| "IE_9" \| "IE_SRC" \| "INCR_CHAR" \| "INTL" \| "LOCALE_INFINITY" \| "NAME" \| "NODECONSTRUCTOR" \| "NODE_0_10" \| "NODE_0_12" \| "NODE_10" \| "NODE_11" \| "NODE_12" \| "NODE_4" \| "NODE_5" \| "NO_FF_SRC" \| "NO_IE_SRC" \| "NO_OLD_SAFARI_ARRAY_ITERATOR" \| "NO_V8_SRC" \| "SAFARI_10" \| "SAFARI_12" \| "SAFARI_7_0" \| "SAFARI_7_1" \| "SAFARI_9" \| "SELF_OBJ" \| "STATUS" \| "UNDEFINED" \| "UNEVAL" \| "V8_SRC" \| "WINDOW" \| "CHROME" \| "CHROME_PREV" \| "EDGE" \| "EDGE_PREV" \| "FF" \| "FF_ESR" \| "SAFARI" \| "SAFARI_8" \| "SELF">)[] |

**Returns:** [CustomFeature](_jscrewit_.customfeature.md)

## Index

### Constructors

* [constructor](_jscrewit_.featureconstructor.md#constructor)

### Properties

* [ALL](_jscrewit_.featureconstructor.md#all)
* [ANDRO_4_0](_jscrewit_.featureconstructor.md#andro_4_0)
* [ANDRO_4_1](_jscrewit_.featureconstructor.md#andro_4_1)
* [ANDRO_4_4](_jscrewit_.featureconstructor.md#andro_4_4)
* [ANY_DOCUMENT](_jscrewit_.featureconstructor.md#any_document)
* [ANY_WINDOW](_jscrewit_.featureconstructor.md#any_window)
* [ARRAY_ITERATOR](_jscrewit_.featureconstructor.md#array_iterator)
* [ARROW](_jscrewit_.featureconstructor.md#arrow)
* [ATOB](_jscrewit_.featureconstructor.md#atob)
* [AUTO](_jscrewit_.featureconstructor.md#auto)
* [BARPROP](_jscrewit_.featureconstructor.md#barprop)
* [BROWSER](_jscrewit_.featureconstructor.md#browser)
* [CAPITAL_HTML](_jscrewit_.featureconstructor.md#capital_html)
* [CHROME](_jscrewit_.featureconstructor.md#chrome)
* [CHROME_73](_jscrewit_.featureconstructor.md#chrome_73)
* [CHROME_PREV](_jscrewit_.featureconstructor.md#chrome_prev)
* [COMPACT](_jscrewit_.featureconstructor.md#compact)
* [CONSOLE](_jscrewit_.featureconstructor.md#console)
* [DEFAULT](_jscrewit_.featureconstructor.md#default)
* [DOCUMENT](_jscrewit_.featureconstructor.md#document)
* [DOMWINDOW](_jscrewit_.featureconstructor.md#domwindow)
* [EDGE](_jscrewit_.featureconstructor.md#edge)
* [EDGE_40](_jscrewit_.featureconstructor.md#edge_40)
* [EDGE_PREV](_jscrewit_.featureconstructor.md#edge_prev)
* [ELEMENTARY](_jscrewit_.featureconstructor.md#elementary)
* [ESC_HTML_ALL](_jscrewit_.featureconstructor.md#esc_html_all)
* [ESC_HTML_QUOT](_jscrewit_.featureconstructor.md#esc_html_quot)
* [ESC_HTML_QUOT_ONLY](_jscrewit_.featureconstructor.md#esc_html_quot_only)
* [ESC_REGEXP_LF](_jscrewit_.featureconstructor.md#esc_regexp_lf)
* [ESC_REGEXP_SLASH](_jscrewit_.featureconstructor.md#esc_regexp_slash)
* [EXTERNAL](_jscrewit_.featureconstructor.md#external)
* [FF](_jscrewit_.featureconstructor.md#ff)
* [FF_54](_jscrewit_.featureconstructor.md#ff_54)
* [FF_62](_jscrewit_.featureconstructor.md#ff_62)
* [FF_ESR](_jscrewit_.featureconstructor.md#ff_esr)
* [FF_SRC](_jscrewit_.featureconstructor.md#ff_src)
* [FILL](_jscrewit_.featureconstructor.md#fill)
* [FLAT](_jscrewit_.featureconstructor.md#flat)
* [FROM_CODE_POINT](_jscrewit_.featureconstructor.md#from_code_point)
* [FUNCTION_19_LF](_jscrewit_.featureconstructor.md#function_19_lf)
* [FUNCTION_22_LF](_jscrewit_.featureconstructor.md#function_22_lf)
* [GMT](_jscrewit_.featureconstructor.md#gmt)
* [HISTORY](_jscrewit_.featureconstructor.md#history)
* [HTMLAUDIOELEMENT](_jscrewit_.featureconstructor.md#htmlaudioelement)
* [HTMLDOCUMENT](_jscrewit_.featureconstructor.md#htmldocument)
* [IE_10](_jscrewit_.featureconstructor.md#ie_10)
* [IE_11](_jscrewit_.featureconstructor.md#ie_11)
* [IE_11_WIN_10](_jscrewit_.featureconstructor.md#ie_11_win_10)
* [IE_9](_jscrewit_.featureconstructor.md#ie_9)
* [IE_SRC](_jscrewit_.featureconstructor.md#ie_src)
* [INCR_CHAR](_jscrewit_.featureconstructor.md#incr_char)
* [INTL](_jscrewit_.featureconstructor.md#intl)
* [LOCALE_INFINITY](_jscrewit_.featureconstructor.md#locale_infinity)
* [NAME](_jscrewit_.featureconstructor.md#name)
* [NODECONSTRUCTOR](_jscrewit_.featureconstructor.md#nodeconstructor)
* [NODE_0_10](_jscrewit_.featureconstructor.md#node_0_10)
* [NODE_0_12](_jscrewit_.featureconstructor.md#node_0_12)
* [NODE_10](_jscrewit_.featureconstructor.md#node_10)
* [NODE_11](_jscrewit_.featureconstructor.md#node_11)
* [NODE_12](_jscrewit_.featureconstructor.md#node_12)
* [NODE_4](_jscrewit_.featureconstructor.md#node_4)
* [NODE_5](_jscrewit_.featureconstructor.md#node_5)
* [NO_FF_SRC](_jscrewit_.featureconstructor.md#no_ff_src)
* [NO_IE_SRC](_jscrewit_.featureconstructor.md#no_ie_src)
* [NO_OLD_SAFARI_ARRAY_ITERATOR](_jscrewit_.featureconstructor.md#no_old_safari_array_iterator)
* [NO_V8_SRC](_jscrewit_.featureconstructor.md#no_v8_src)
* [SAFARI](_jscrewit_.featureconstructor.md#safari)
* [SAFARI_10](_jscrewit_.featureconstructor.md#safari_10)
* [SAFARI_12](_jscrewit_.featureconstructor.md#safari_12)
* [SAFARI_7_0](_jscrewit_.featureconstructor.md#safari_7_0)
* [SAFARI_7_1](_jscrewit_.featureconstructor.md#safari_7_1)
* [SAFARI_8](_jscrewit_.featureconstructor.md#safari_8)
* [SAFARI_9](_jscrewit_.featureconstructor.md#safari_9)
* [SELF](_jscrewit_.featureconstructor.md#self)
* [SELF_OBJ](_jscrewit_.featureconstructor.md#self_obj)
* [STATUS](_jscrewit_.featureconstructor.md#status)
* [UNDEFINED](_jscrewit_.featureconstructor.md#undefined)
* [UNEVAL](_jscrewit_.featureconstructor.md#uneval)
* [V8_SRC](_jscrewit_.featureconstructor.md#v8_src)
* [WINDOW](_jscrewit_.featureconstructor.md#window)

### Methods

* [areCompatible](_jscrewit_.featureconstructor.md#arecompatible)
* [areEqual](_jscrewit_.featureconstructor.md#areequal)
* [commonOf](_jscrewit_.featureconstructor.md#commonof)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new FeatureConstructor**(...features: *([Feature](_jscrewit_.feature.md) \| "ANDRO_4_0" \| "ANDRO_4_1" \| "ANDRO_4_4" \| "ANY_DOCUMENT" \| "ANY_WINDOW" \| "ARRAY_ITERATOR" \| "ARROW" \| "ATOB" \| "AUTO" \| "BARPROP" \| "BROWSER" \| "CAPITAL_HTML" \| "CHROME_73" \| "COMPACT" \| "CONSOLE" \| "DEFAULT" \| "DOCUMENT" \| "DOMWINDOW" \| "EDGE_40" \| "ESC_HTML_ALL" \| "ESC_HTML_QUOT" \| "ESC_HTML_QUOT_ONLY" \| "ESC_REGEXP_LF" \| "ESC_REGEXP_SLASH" \| "EXTERNAL" \| "FF_54" \| "FF_62" \| "FF_SRC" \| "FILL" \| "FLAT" \| "FROM_CODE_POINT" \| "FUNCTION_19_LF" \| "FUNCTION_22_LF" \| "GMT" \| "HISTORY" \| "HTMLAUDIOELEMENT" \| "HTMLDOCUMENT" \| "IE_10" \| "IE_11" \| "IE_11_WIN_10" \| "IE_9" \| "IE_SRC" \| "INCR_CHAR" \| "INTL" \| "LOCALE_INFINITY" \| "NAME" \| "NODECONSTRUCTOR" \| "NODE_0_10" \| "NODE_0_12" \| "NODE_10" \| "NODE_11" \| "NODE_12" \| "NODE_4" \| "NODE_5" \| "NO_FF_SRC" \| "NO_IE_SRC" \| "NO_OLD_SAFARI_ARRAY_ITERATOR" \| "NO_V8_SRC" \| "SAFARI_10" \| "SAFARI_12" \| "SAFARI_7_0" \| "SAFARI_7_1" \| "SAFARI_9" \| "SELF_OBJ" \| "STATUS" \| "UNDEFINED" \| "UNEVAL" \| "V8_SRC" \| "WINDOW" \| "CHROME" \| "CHROME_PREV" \| "EDGE" \| "EDGE_PREV" \| "FF" \| "FF_ESR" \| "SAFARI" \| "SAFARI_8" \| "SELF" \| `ReadonlyArray`<[Feature](_jscrewit_.feature.md) \| "ANDRO_4_0" \| "ANDRO_4_1" \| "ANDRO_4_4" \| "ANY_DOCUMENT" \| "ANY_WINDOW" \| "ARRAY_ITERATOR" \| "ARROW" \| "ATOB" \| "AUTO" \| "BARPROP" \| "BROWSER" \| "CAPITAL_HTML" \| "CHROME_73" \| "COMPACT" \| "CONSOLE" \| "DEFAULT" \| "DOCUMENT" \| "DOMWINDOW" \| "EDGE_40" \| "ESC_HTML_ALL" \| "ESC_HTML_QUOT" \| "ESC_HTML_QUOT_ONLY" \| "ESC_REGEXP_LF" \| "ESC_REGEXP_SLASH" \| "EXTERNAL" \| "FF_54" \| "FF_62" \| "FF_SRC" \| "FILL" \| "FLAT" \| "FROM_CODE_POINT" \| "FUNCTION_19_LF" \| "FUNCTION_22_LF" \| "GMT" \| "HISTORY" \| "HTMLAUDIOELEMENT" \| "HTMLDOCUMENT" \| "IE_10" \| "IE_11" \| "IE_11_WIN_10" \| "IE_9" \| "IE_SRC" \| "INCR_CHAR" \| "INTL" \| "LOCALE_INFINITY" \| "NAME" \| "NODECONSTRUCTOR" \| "NODE_0_10" \| "NODE_0_12" \| "NODE_10" \| "NODE_11" \| "NODE_12" \| "NODE_4" \| "NODE_5" \| "NO_FF_SRC" \| "NO_IE_SRC" \| "NO_OLD_SAFARI_ARRAY_ITERATOR" \| "NO_V8_SRC" \| "SAFARI_10" \| "SAFARI_12" \| "SAFARI_7_0" \| "SAFARI_7_1" \| "SAFARI_9" \| "SELF_OBJ" \| "STATUS" \| "UNDEFINED" \| "UNEVAL" \| "V8_SRC" \| "WINDOW" \| "CHROME" \| "CHROME_PREV" \| "EDGE" \| "EDGE_PREV" \| "FF" \| "FF_ESR" \| "SAFARI" \| "SAFARI_8" \| "SELF">)[]*): [CustomFeature](_jscrewit_.customfeature.md)

*Defined in [feature.d.ts:151](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature.d.ts#L151)*

Creates a new feature object from the union of the specified features.

The constructor can be used with or without the `new` operator, e.g. `new JScrewIt.Feature(feature1, feature2)` or `JScrewIt.Feature(feature1, feature2)`. If no arguments are specified, the new feature object will be equivalent to [`DEFAULT`](_jscrewit_.featureall.md#DEFAULT).

*__example__*: The following statements are equivalent, and will all construct a new feature object including both [`ANY_DOCUMENT`](_jscrewit_.featureall.md#ANY_DOCUMENT) and [`ANY_WINDOW`](_jscrewit_.featureall.md#ANY_WINDOW).

```js
JScrewIt.Feature("ANY_DOCUMENT", "ANY_WINDOW");
```

```js
JScrewIt.Feature(JScrewIt.Feature.ANY_DOCUMENT, JScrewIt.Feature.ANY_WINDOW);
```

```js
JScrewIt.Feature([JScrewIt.Feature.ANY_DOCUMENT, JScrewIt.Feature.ANY_WINDOW]);
```

*__throws__*: An error is thrown if any of the specified features are not mutually compatible.

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` features | ([Feature](_jscrewit_.feature.md) \| "ANDRO_4_0" \| "ANDRO_4_1" \| "ANDRO_4_4" \| "ANY_DOCUMENT" \| "ANY_WINDOW" \| "ARRAY_ITERATOR" \| "ARROW" \| "ATOB" \| "AUTO" \| "BARPROP" \| "BROWSER" \| "CAPITAL_HTML" \| "CHROME_73" \| "COMPACT" \| "CONSOLE" \| "DEFAULT" \| "DOCUMENT" \| "DOMWINDOW" \| "EDGE_40" \| "ESC_HTML_ALL" \| "ESC_HTML_QUOT" \| "ESC_HTML_QUOT_ONLY" \| "ESC_REGEXP_LF" \| "ESC_REGEXP_SLASH" \| "EXTERNAL" \| "FF_54" \| "FF_62" \| "FF_SRC" \| "FILL" \| "FLAT" \| "FROM_CODE_POINT" \| "FUNCTION_19_LF" \| "FUNCTION_22_LF" \| "GMT" \| "HISTORY" \| "HTMLAUDIOELEMENT" \| "HTMLDOCUMENT" \| "IE_10" \| "IE_11" \| "IE_11_WIN_10" \| "IE_9" \| "IE_SRC" \| "INCR_CHAR" \| "INTL" \| "LOCALE_INFINITY" \| "NAME" \| "NODECONSTRUCTOR" \| "NODE_0_10" \| "NODE_0_12" \| "NODE_10" \| "NODE_11" \| "NODE_12" \| "NODE_4" \| "NODE_5" \| "NO_FF_SRC" \| "NO_IE_SRC" \| "NO_OLD_SAFARI_ARRAY_ITERATOR" \| "NO_V8_SRC" \| "SAFARI_10" \| "SAFARI_12" \| "SAFARI_7_0" \| "SAFARI_7_1" \| "SAFARI_9" \| "SELF_OBJ" \| "STATUS" \| "UNDEFINED" \| "UNEVAL" \| "V8_SRC" \| "WINDOW" \| "CHROME" \| "CHROME_PREV" \| "EDGE" \| "EDGE_PREV" \| "FF" \| "FF_ESR" \| "SAFARI" \| "SAFARI_8" \| "SELF" \| `ReadonlyArray`<[Feature](_jscrewit_.feature.md) \| "ANDRO_4_0" \| "ANDRO_4_1" \| "ANDRO_4_4" \| "ANY_DOCUMENT" \| "ANY_WINDOW" \| "ARRAY_ITERATOR" \| "ARROW" \| "ATOB" \| "AUTO" \| "BARPROP" \| "BROWSER" \| "CAPITAL_HTML" \| "CHROME_73" \| "COMPACT" \| "CONSOLE" \| "DEFAULT" \| "DOCUMENT" \| "DOMWINDOW" \| "EDGE_40" \| "ESC_HTML_ALL" \| "ESC_HTML_QUOT" \| "ESC_HTML_QUOT_ONLY" \| "ESC_REGEXP_LF" \| "ESC_REGEXP_SLASH" \| "EXTERNAL" \| "FF_54" \| "FF_62" \| "FF_SRC" \| "FILL" \| "FLAT" \| "FROM_CODE_POINT" \| "FUNCTION_19_LF" \| "FUNCTION_22_LF" \| "GMT" \| "HISTORY" \| "HTMLAUDIOELEMENT" \| "HTMLDOCUMENT" \| "IE_10" \| "IE_11" \| "IE_11_WIN_10" \| "IE_9" \| "IE_SRC" \| "INCR_CHAR" \| "INTL" \| "LOCALE_INFINITY" \| "NAME" \| "NODECONSTRUCTOR" \| "NODE_0_10" \| "NODE_0_12" \| "NODE_10" \| "NODE_11" \| "NODE_12" \| "NODE_4" \| "NODE_5" \| "NO_FF_SRC" \| "NO_IE_SRC" \| "NO_OLD_SAFARI_ARRAY_ITERATOR" \| "NO_V8_SRC" \| "SAFARI_10" \| "SAFARI_12" \| "SAFARI_7_0" \| "SAFARI_7_1" \| "SAFARI_9" \| "SELF_OBJ" \| "STATUS" \| "UNDEFINED" \| "UNEVAL" \| "V8_SRC" \| "WINDOW" \| "CHROME" \| "CHROME_PREV" \| "EDGE" \| "EDGE_PREV" \| "FF" \| "FF_ESR" \| "SAFARI" \| "SAFARI_8" \| "SELF">)[] |

**Returns:** [CustomFeature](_jscrewit_.customfeature.md)

___

## Properties

<a id="all"></a>

###  ALL

**● ALL**: *[FeatureAll](_jscrewit_.featureall.md)*

*Defined in [feature.d.ts:148](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature.d.ts#L148)*

An immutable mapping of all predefined feature objects accessed by name or alias.

*__example__*: This will produce an array with the names and aliases of all predefined features.

```js
Object.keys(JScrewIt.Feature.ALL)
```

This will determine if a particular feature object is predefined or not.

```js
featureObj === JScrewIt.Feature.ALL[featureObj.name]
```

___
<a id="andro_4_0"></a>

###  ANDRO_4_0

**● ANDRO_4_0**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ANDRO_4_0](_jscrewit_.featureall.md#andro_4_0)*

*Defined in [feature-all.d.ts:10](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L10)*

Features available in Android Browser 4.0.

___
<a id="andro_4_1"></a>

###  ANDRO_4_1

**● ANDRO_4_1**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ANDRO_4_1](_jscrewit_.featureall.md#andro_4_1)*

*Defined in [feature-all.d.ts:15](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L15)*

Features available in Android Browser 4.1 to 4.3.

___
<a id="andro_4_4"></a>

###  ANDRO_4_4

**● ANDRO_4_4**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ANDRO_4_4](_jscrewit_.featureall.md#andro_4_4)*

*Defined in [feature-all.d.ts:20](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L20)*

Features available in Android Browser 4.4.

___
<a id="any_document"></a>

###  ANY_DOCUMENT

**● ANY_DOCUMENT**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ANY_DOCUMENT](_jscrewit_.featureall.md#any_document)*

*Defined in [feature-all.d.ts:29](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L29)*

Existence of the global object document whose string representation starts with "\[object " and ends with "Document\]".

*__reamarks__*: Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers.

___
<a id="any_window"></a>

###  ANY_WINDOW

**● ANY_WINDOW**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ANY_WINDOW](_jscrewit_.featureall.md#any_window)*

*Defined in [feature-all.d.ts:38](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L38)*

Existence of the global object self whose string representation starts with "\[object " and ends with "Window\]".

*__reamarks__*: Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers.

___
<a id="array_iterator"></a>

###  ARRAY_ITERATOR

**● ARRAY_ITERATOR**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ARRAY_ITERATOR](_jscrewit_.featureall.md#array_iterator)*

*Defined in [feature-all.d.ts:47](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L47)*

The property that the string representation of Array.prototype.entries() starts with "\[object Array" and ends with "\]" at index 21 or 22.

*__reamarks__*: Available in Chrome, Edge, Firefox, Safari 7.1+, Opera and Node.js 0.12+.

___
<a id="arrow"></a>

###  ARROW

**● ARROW**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ARROW](_jscrewit_.featureall.md#arrow)*

*Defined in [feature-all.d.ts:56](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L56)*

Support for arrow functions.

*__reamarks__*: Available in Chrome, Edge, Firefox, Safari 10+, Opera and Node.js 4+.

___
<a id="atob"></a>

###  ATOB

**● ATOB**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ATOB](_jscrewit_.featureall.md#atob)*

*Defined in [feature-all.d.ts:65](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L65)*

Existence of the global functions atob and btoa.

*__reamarks__*: Available in Chrome, Edge, Firefox, Internet Explorer 10+, Safari, Opera and Android Browser. This feature is not available inside web workers in Safari before 10.

___
<a id="auto"></a>

###  AUTO

**● AUTO**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[AUTO](_jscrewit_.featureall.md#auto)*

*Defined in [feature-all.d.ts:70](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L70)*

All features available in the current engine.

___
<a id="barprop"></a>

###  BARPROP

**● BARPROP**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[BARPROP](_jscrewit_.featureall.md#barprop)*

*Defined in [feature-all.d.ts:79](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L79)*

Existence of the global object statusbar having the string representation "\[object BarProp\]".

*__reamarks__*: Available in Chrome, Edge, Firefox, Safari, Opera and Android Browser 4.4. This feature is not available inside web workers.

___
<a id="browser"></a>

###  BROWSER

**● BROWSER**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[BROWSER](_jscrewit_.featureall.md#browser)*

*Defined in [feature-all.d.ts:86](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L86)*

Features available in all browsers.

No support for Node.js.

___
<a id="capital_html"></a>

###  CAPITAL_HTML

**● CAPITAL_HTML**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[CAPITAL_HTML](_jscrewit_.featureall.md#capital_html)*

*Defined in [feature-all.d.ts:95](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L95)*

The property that the various string methods returning HTML code such as String.prototype.big or String.prototype.link have both the tag name and attributes written in capital letters.

*__reamarks__*: Available in Internet Explorer.

___
<a id="chrome"></a>

###  CHROME

**● CHROME**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[CHROME](_jscrewit_.featureall.md#chrome)*

*Defined in [feature-all.d.ts:98](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L98)*

An alias for `CHROME_73`.

___
<a id="chrome_73"></a>

###  CHROME_73

**● CHROME_73**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[CHROME_73](_jscrewit_.featureall.md#chrome_73)*

*Defined in [feature-all.d.ts:103](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L103)*

Features available in Chrome 73 and Opera 60 or later.

___
<a id="chrome_prev"></a>

###  CHROME_PREV

**● CHROME_PREV**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[CHROME_PREV](_jscrewit_.featureall.md#chrome_prev)*

*Defined in [feature-all.d.ts:106](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L106)*

An alias for `CHROME_73`.

___
<a id="compact"></a>

###  COMPACT

**● COMPACT**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[COMPACT](_jscrewit_.featureall.md#compact)*

*Defined in [feature-all.d.ts:113](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L113)*

All new browsers' features.

No support for Node.js and older browsers like Internet Explorer, Safari 9 or Android Browser.

___
<a id="console"></a>

###  CONSOLE

**● CONSOLE**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[CONSOLE](_jscrewit_.featureall.md#console)*

*Defined in [feature-all.d.ts:124](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L124)*

Existence of the global object console having the string representation "\[object Console\]".

This feature may become unavailable when certain browser extensions are active.

*__reamarks__*: Available in Firefox, Internet Explorer 10+, Safari and Android Browser. This feature is not available inside web workers in Safari before 7.1 and Android Browser 4.4.

___
<a id="default"></a>

###  DEFAULT

**● DEFAULT**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[DEFAULT](_jscrewit_.featureall.md#default)*

*Defined in [feature-all.d.ts:129](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L129)*

Minimum feature level, compatible with all supported engines in all environments.

___
<a id="document"></a>

###  DOCUMENT

**● DOCUMENT**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[DOCUMENT](_jscrewit_.featureall.md#document)*

*Defined in [feature-all.d.ts:138](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L138)*

Existence of the global object document having the string representation "\[object Document\]".

*__reamarks__*: Available in Internet Explorer before 11. This feature is not available inside web workers.

___
<a id="domwindow"></a>

###  DOMWINDOW

**● DOMWINDOW**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[DOMWINDOW](_jscrewit_.featureall.md#domwindow)*

*Defined in [feature-all.d.ts:147](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L147)*

Existence of the global object self having the string representation "\[object DOMWindow\]".

*__reamarks__*: Available in Android Browser before 4.4. This feature is not available inside web workers.

___
<a id="edge"></a>

###  EDGE

**● EDGE**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[EDGE](_jscrewit_.featureall.md#edge)*

*Defined in [feature-all.d.ts:150](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L150)*

An alias for `EDGE_40`.

___
<a id="edge_40"></a>

###  EDGE_40

**● EDGE_40**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[EDGE_40](_jscrewit_.featureall.md#edge_40)*

*Defined in [feature-all.d.ts:155](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L155)*

Features available in Edge 40 or later.

___
<a id="edge_prev"></a>

###  EDGE_PREV

**● EDGE_PREV**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[EDGE_PREV](_jscrewit_.featureall.md#edge_prev)*

*Defined in [feature-all.d.ts:158](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L158)*

An alias for `EDGE_40`.

___
<a id="elementary"></a>

###  ELEMENTARY

**● ELEMENTARY**: *`ReadonlyArray`<[PredefinedFeature](_jscrewit_.predefinedfeature.md)>*

*Defined in [feature.d.ts:151](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature.d.ts#L151)*

An immutable array of all elementary feature objects ordered by name.

___
<a id="esc_html_all"></a>

###  ESC_HTML_ALL

**● ESC_HTML_ALL**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ESC_HTML_ALL](_jscrewit_.featureall.md#esc_html_all)*

*Defined in [feature-all.d.ts:167](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L167)*

The property that double quotation mark, less than and greater than characters in the argument of String.prototype.fontcolor are escaped into their respective HTML entities.

*__reamarks__*: Available in Android Browser and Node.js before 0.12.

___
<a id="esc_html_quot"></a>

###  ESC_HTML_QUOT

**● ESC_HTML_QUOT**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ESC_HTML_QUOT](_jscrewit_.featureall.md#esc_html_quot)*

*Defined in [feature-all.d.ts:176](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L176)*

The property that double quotation marks in the argument of String.prototype.fontcolor are escaped as """.

*__reamarks__*: Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser and Node.js.

___
<a id="esc_html_quot_only"></a>

###  ESC_HTML_QUOT_ONLY

**● ESC_HTML_QUOT_ONLY**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ESC_HTML_QUOT_ONLY](_jscrewit_.featureall.md#esc_html_quot_only)*

*Defined in [feature-all.d.ts:185](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L185)*

The property that only double quotation marks and no other characters in the argument of String.prototype.fontcolor are escaped into HTML entities.

*__reamarks__*: Available in Chrome, Edge, Firefox, Safari, Opera and Node.js 0.12+.

___
<a id="esc_regexp_lf"></a>

###  ESC_REGEXP_LF

**● ESC_REGEXP_LF**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ESC_REGEXP_LF](_jscrewit_.featureall.md#esc_regexp_lf)*

*Defined in [feature-all.d.ts:194](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L194)*

Having regular expressions created with the RegExp constructor use escape sequences starting with a backslash to format line feed characters ("\\n") in their string representation.

*__reamarks__*: Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Node.js 12+.

___
<a id="esc_regexp_slash"></a>

###  ESC_REGEXP_SLASH

**● ESC_REGEXP_SLASH**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ESC_REGEXP_SLASH](_jscrewit_.featureall.md#esc_regexp_slash)*

*Defined in [feature-all.d.ts:203](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L203)*

Having regular expressions created with the RegExp constructor use escape sequences starting with a backslash to format slashes ("/") in their string representation.

*__reamarks__*: Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Node.js 4+.

___
<a id="external"></a>

###  EXTERNAL

**● EXTERNAL**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[EXTERNAL](_jscrewit_.featureall.md#external)*

*Defined in [feature-all.d.ts:212](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L212)*

Existence of the global object sidebar having the string representation "\[object External\]".

*__reamarks__*: Available in Firefox. This feature is not available inside web workers.

___
<a id="ff"></a>

###  FF

**● FF**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[FF](_jscrewit_.featureall.md#ff)*

*Defined in [feature-all.d.ts:215](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L215)*

An alias for `FF_62`.

___
<a id="ff_54"></a>

###  FF_54

**● FF_54**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[FF_54](_jscrewit_.featureall.md#ff_54)*

*Defined in [feature-all.d.ts:220](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L220)*

Features available in Firefox 54 or later.

___
<a id="ff_62"></a>

###  FF_62

**● FF_62**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[FF_62](_jscrewit_.featureall.md#ff_62)*

*Defined in [feature-all.d.ts:225](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L225)*

Features available in Firefox 62 or later.

___
<a id="ff_esr"></a>

###  FF_ESR

**● FF_ESR**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[FF_ESR](_jscrewit_.featureall.md#ff_esr)*

*Defined in [feature-all.d.ts:228](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L228)*

An alias for `FF_54`.

___
<a id="ff_src"></a>

###  FF_SRC

**● FF_SRC**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[FF_SRC](_jscrewit_.featureall.md#ff_src)*

*Defined in [feature-all.d.ts:239](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L239)*

A string representation of native functions typical for Firefox and Safari.

Remarkable traits are the lack of line feed characters at the beginning and at the end of the string and the presence of a line feed followed by four whitespaces ("\\n ") before the "\[native code\]" sequence.

*__reamarks__*: Available in Firefox and Safari.

___
<a id="fill"></a>

###  FILL

**● FILL**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[FILL](_jscrewit_.featureall.md#fill)*

*Defined in [feature-all.d.ts:248](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L248)*

Existence of the native function Array.prototype.fill.

*__reamarks__*: Available in Chrome, Edge, Firefox, Safari 7.1+, Opera and Node.js 4+.

___
<a id="flat"></a>

###  FLAT

**● FLAT**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[FLAT](_jscrewit_.featureall.md#flat)*

*Defined in [feature-all.d.ts:257](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L257)*

Existence of the native function Array.prototype.flat.

*__reamarks__*: Available in Chrome, Firefox 62+, Safari 12+, Opera and Node.js 11+.

___
<a id="from_code_point"></a>

###  FROM_CODE_POINT

**● FROM_CODE_POINT**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[FROM_CODE_POINT](_jscrewit_.featureall.md#from_code_point)*

*Defined in [feature-all.d.ts:266](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L266)*

Existence of the function String.fromCodePoint.

*__reamarks__*: Available in Chrome, Edge, Firefox, Safari 9+, Opera and Node.js 4+.

___
<a id="function_19_lf"></a>

###  FUNCTION_19_LF

**● FUNCTION_19_LF**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[FUNCTION_19_LF](_jscrewit_.featureall.md#function_19_lf)*

*Defined in [feature-all.d.ts:275](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L275)*

A string representation of dynamically generated functions where the character at index 19 is a line feed ("\\n").

*__reamarks__*: Available in Chrome, Edge, Firefox, Opera and Node.js 10+.

___
<a id="function_22_lf"></a>

###  FUNCTION_22_LF

**● FUNCTION_22_LF**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[FUNCTION_22_LF](_jscrewit_.featureall.md#function_22_lf)*

*Defined in [feature-all.d.ts:284](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L284)*

A string representation of dynamically generated functions where the character at index 22 is a line feed ("\\n").

*__reamarks__*: Available in Internet Explorer, Safari 9+, Android Browser and Node.js before 10.

___
<a id="gmt"></a>

###  GMT

**● GMT**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[GMT](_jscrewit_.featureall.md#gmt)*

*Defined in [feature-all.d.ts:295](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L295)*

Presence of the text "GMT" after the first 25 characters in the string returned by Date().

The string representation of dates is implementation dependent, but most engines use a similar format, making this feature available in all supported engines except Internet Explorer 9 and 10.

*__reamarks__*: Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari, Opera, Android Browser and Node.js.

___
<a id="history"></a>

###  HISTORY

**● HISTORY**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[HISTORY](_jscrewit_.featureall.md#history)*

*Defined in [feature-all.d.ts:304](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L304)*

Existence of the global object history having the string representation "\[object History\]".

*__reamarks__*: Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers.

___
<a id="htmlaudioelement"></a>

###  HTMLAUDIOELEMENT

**● HTMLAUDIOELEMENT**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[HTMLAUDIOELEMENT](_jscrewit_.featureall.md#htmlaudioelement)*

*Defined in [feature-all.d.ts:313](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L313)*

Existence of the global object Audio whose string representation starts with "function HTMLAudioElement".

*__reamarks__*: Available in Android Browser 4.4. This feature is not available inside web workers.

___
<a id="htmldocument"></a>

###  HTMLDOCUMENT

**● HTMLDOCUMENT**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[HTMLDOCUMENT](_jscrewit_.featureall.md#htmldocument)*

*Defined in [feature-all.d.ts:322](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L322)*

Existence of the global object document having the string representation "\[object HTMLDocument\]".

*__reamarks__*: Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari, Opera and Android Browser. This feature is not available inside web workers.

___
<a id="ie_10"></a>

###  IE_10

**● IE_10**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[IE_10](_jscrewit_.featureall.md#ie_10)*

*Defined in [feature-all.d.ts:327](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L327)*

Features available in Internet Explorer 10.

___
<a id="ie_11"></a>

###  IE_11

**● IE_11**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[IE_11](_jscrewit_.featureall.md#ie_11)*

*Defined in [feature-all.d.ts:332](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L332)*

Features available in Internet Explorer 11.

___
<a id="ie_11_win_10"></a>

###  IE_11_WIN_10

**● IE_11_WIN_10**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[IE_11_WIN_10](_jscrewit_.featureall.md#ie_11_win_10)*

*Defined in [feature-all.d.ts:337](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L337)*

Features available in Internet Explorer 11 on Windows 10.

___
<a id="ie_9"></a>

###  IE_9

**● IE_9**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[IE_9](_jscrewit_.featureall.md#ie_9)*

*Defined in [feature-all.d.ts:342](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L342)*

Features available in Internet Explorer 9.

___
<a id="ie_src"></a>

###  IE_SRC

**● IE_SRC**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[IE_SRC](_jscrewit_.featureall.md#ie_src)*

*Defined in [feature-all.d.ts:353](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L353)*

A string representation of native functions typical for Internet Explorer.

Remarkable traits are the presence of a line feed character ("\\n") at the beginning and at the end of the string and a line feed followed by four whitespaces ("\\n ") before the "\[native code\]" sequence.

*__reamarks__*: Available in Internet Explorer.

___
<a id="incr_char"></a>

###  INCR_CHAR

**● INCR_CHAR**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[INCR_CHAR](_jscrewit_.featureall.md#incr_char)*

*Defined in [feature-all.d.ts:362](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L362)*

The ability to use unary increment operators with string characters, like in ( ++"some string"\[0\] ): this will result in a TypeError in strict mode in ECMAScript compliant engines.

*__reamarks__*: Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, Android Browser and Node.js. This feature is not available when strict mode is enforced in Chrome, Edge, Firefox, Internet Explorer 10+, Safari, Opera and Node.js 5+.

___
<a id="intl"></a>

###  INTL

**● INTL**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[INTL](_jscrewit_.featureall.md#intl)*

*Defined in [feature-all.d.ts:371](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L371)*

Existence of the global object Intl.

*__reamarks__*: Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari 10+, Opera, Android Browser 4.4 and Node.js 0.12+.

___
<a id="locale_infinity"></a>

###  LOCALE_INFINITY

**● LOCALE_INFINITY**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[LOCALE_INFINITY](_jscrewit_.featureall.md#locale_infinity)*

*Defined in [feature-all.d.ts:380](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L380)*

Language sensitive string representation of Infinity as "∞".

*__reamarks__*: Available in Chrome, Edge, Firefox, Internet Explorer 11 on Windows 10, Safari 10+, Opera, Android Browser 4.4 and Node.js 0.12+.

___
<a id="name"></a>

###  NAME

**● NAME**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NAME](_jscrewit_.featureall.md#name)*

*Defined in [feature-all.d.ts:389](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L389)*

Existence of the name property for functions.

*__reamarks__*: Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser and Node.js.

___
<a id="nodeconstructor"></a>

###  NODECONSTRUCTOR

**● NODECONSTRUCTOR**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NODECONSTRUCTOR](_jscrewit_.featureall.md#nodeconstructor)*

*Defined in [feature-all.d.ts:398](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L398)*

Existence of the global object Node having the string representation "\[object NodeConstructor\]".

*__reamarks__*: Available in Safari before 10. This feature is not available inside web workers.

___
<a id="node_0_10"></a>

###  NODE_0_10

**● NODE_0_10**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NODE_0_10](_jscrewit_.featureall.md#node_0_10)*

*Defined in [feature-all.d.ts:403](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L403)*

Features available in Node.js 0.10.

___
<a id="node_0_12"></a>

###  NODE_0_12

**● NODE_0_12**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NODE_0_12](_jscrewit_.featureall.md#node_0_12)*

*Defined in [feature-all.d.ts:408](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L408)*

Features available in Node.js 0.12.

___
<a id="node_10"></a>

###  NODE_10

**● NODE_10**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NODE_10](_jscrewit_.featureall.md#node_10)*

*Defined in [feature-all.d.ts:413](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L413)*

Features available in Node.js 10.

___
<a id="node_11"></a>

###  NODE_11

**● NODE_11**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NODE_11](_jscrewit_.featureall.md#node_11)*

*Defined in [feature-all.d.ts:418](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L418)*

Features available in Node.js 11.

___
<a id="node_12"></a>

###  NODE_12

**● NODE_12**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NODE_12](_jscrewit_.featureall.md#node_12)*

*Defined in [feature-all.d.ts:423](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L423)*

Features available in Node.js 12 or later.

___
<a id="node_4"></a>

###  NODE_4

**● NODE_4**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NODE_4](_jscrewit_.featureall.md#node_4)*

*Defined in [feature-all.d.ts:428](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L428)*

Features available in Node.js 4.

___
<a id="node_5"></a>

###  NODE_5

**● NODE_5**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NODE_5](_jscrewit_.featureall.md#node_5)*

*Defined in [feature-all.d.ts:433](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L433)*

Features available in Node.js 5 to 9.

___
<a id="no_ff_src"></a>

###  NO_FF_SRC

**● NO_FF_SRC**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NO_FF_SRC](_jscrewit_.featureall.md#no_ff_src)*

*Defined in [feature-all.d.ts:442](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L442)*

A string representation of native functions typical for V8 and Edge or for Internet Explorer but not for Firefox and Safari.

*__reamarks__*: Available in Chrome, Edge, Internet Explorer, Opera, Android Browser and Node.js.

___
<a id="no_ie_src"></a>

###  NO_IE_SRC

**● NO_IE_SRC**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NO_IE_SRC](_jscrewit_.featureall.md#no_ie_src)*

*Defined in [feature-all.d.ts:453](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L453)*

A string representation of native functions typical for most engines with the notable exception of Internet Explorer.

A remarkable trait of this feature is the lack of line feed characters at the beginning and at the end of the string.

*__reamarks__*: Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser and Node.js.

___
<a id="no_old_safari_array_iterator"></a>

###  NO_OLD_SAFARI_ARRAY_ITERATOR

**● NO_OLD_SAFARI_ARRAY_ITERATOR**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NO_OLD_SAFARI_ARRAY_ITERATOR](_jscrewit_.featureall.md#no_old_safari_array_iterator)*

*Defined in [feature-all.d.ts:462](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L462)*

The property that the string representation of Array.prototype.entries() evaluates to "\[object Array Iterator\]".

*__reamarks__*: Available in Chrome, Edge, Firefox, Safari 9+, Opera and Node.js 0.12+.

___
<a id="no_v8_src"></a>

###  NO_V8_SRC

**● NO_V8_SRC**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NO_V8_SRC](_jscrewit_.featureall.md#no_v8_src)*

*Defined in [feature-all.d.ts:473](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L473)*

A string representation of native functions typical for Firefox, Internet Explorer and Safari.

A most remarkable trait of this feature is the presence of a line feed followed by four whitespaces ("\\n ") before the "\[native code\]" sequence.

*__reamarks__*: Available in Firefox, Internet Explorer and Safari.

___
<a id="safari"></a>

###  SAFARI

**● SAFARI**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[SAFARI](_jscrewit_.featureall.md#safari)*

*Defined in [feature-all.d.ts:476](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L476)*

An alias for `SAFARI_12`.

___
<a id="safari_10"></a>

###  SAFARI_10

**● SAFARI_10**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[SAFARI_10](_jscrewit_.featureall.md#safari_10)*

*Defined in [feature-all.d.ts:481](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L481)*

Features available in Safari 10 or later.

___
<a id="safari_12"></a>

###  SAFARI_12

**● SAFARI_12**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[SAFARI_12](_jscrewit_.featureall.md#safari_12)*

*Defined in [feature-all.d.ts:486](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L486)*

Features available in Safari 12 or later.

___
<a id="safari_7_0"></a>

###  SAFARI_7_0

**● SAFARI_7_0**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[SAFARI_7_0](_jscrewit_.featureall.md#safari_7_0)*

*Defined in [feature-all.d.ts:491](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L491)*

Features available in Safari 7.0.

___
<a id="safari_7_1"></a>

###  SAFARI_7_1

**● SAFARI_7_1**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[SAFARI_7_1](_jscrewit_.featureall.md#safari_7_1)*

*Defined in [feature-all.d.ts:496](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L496)*

Features available in Safari 7.1 and Safari 8.

___
<a id="safari_8"></a>

###  SAFARI_8

**● SAFARI_8**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[SAFARI_8](_jscrewit_.featureall.md#safari_8)*

*Defined in [feature-all.d.ts:499](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L499)*

An alias for `SAFARI_7_1`.

___
<a id="safari_9"></a>

###  SAFARI_9

**● SAFARI_9**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[SAFARI_9](_jscrewit_.featureall.md#safari_9)*

*Defined in [feature-all.d.ts:504](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L504)*

Features available in Safari 9.

___
<a id="self"></a>

###  SELF

**● SELF**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[SELF](_jscrewit_.featureall.md#self)*

*Defined in [feature-all.d.ts:507](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L507)*

An alias for `ANY_WINDOW`.

___
<a id="self_obj"></a>

###  SELF_OBJ

**● SELF_OBJ**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[SELF_OBJ](_jscrewit_.featureall.md#self_obj)*

*Defined in [feature-all.d.ts:516](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L516)*

Existence of the global object self whose string representation starts with "\[object ".

*__reamarks__*: Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers in Safari 7.1+ before 10.

___
<a id="status"></a>

###  STATUS

**● STATUS**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[STATUS](_jscrewit_.featureall.md#status)*

*Defined in [feature-all.d.ts:525](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L525)*

Existence of the global string status.

*__reamarks__*: Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers.

___
<a id="undefined"></a>

###  UNDEFINED

**● UNDEFINED**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[UNDEFINED](_jscrewit_.featureall.md#undefined)*

*Defined in [feature-all.d.ts:536](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L536)*

The property that Object.prototype.toString.call() evaluates to "\[object Undefined\]".

This behavior is specified by ECMAScript, and is enforced by all engines except Android Browser versions prior to 4.1.2, where this feature is not available.

*__reamarks__*: Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, Android Browser 4.1+ and Node.js.

___
<a id="uneval"></a>

###  UNEVAL

**● UNEVAL**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[UNEVAL](_jscrewit_.featureall.md#uneval)*

*Defined in [feature-all.d.ts:545](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L545)*

Existence of the global function uneval.

*__reamarks__*: Available in Firefox.

___
<a id="v8_src"></a>

###  V8_SRC

**● V8_SRC**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[V8_SRC](_jscrewit_.featureall.md#v8_src)*

*Defined in [feature-all.d.ts:556](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L556)*

A string representation of native functions typical for the V8 engine, but also found in Edge.

Remarkable traits are the lack of line feed characters at the beginning and at the end of the string and the presence of a single whitespace before the "\[native code\]" sequence.

*__reamarks__*: Available in Chrome, Edge, Opera, Android Browser and Node.js.

___
<a id="window"></a>

###  WINDOW

**● WINDOW**: *[PredefinedFeature](_jscrewit_.predefinedfeature.md)*

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[WINDOW](_jscrewit_.featureall.md#window)*

*Defined in [feature-all.d.ts:565](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature-all.d.ts#L565)*

Existence of the global object self having the string representation "\[object Window\]".

*__reamarks__*: Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser 4.4. This feature is not available inside web workers.

___

## Methods

<a id="arecompatible"></a>

###  areCompatible

▸ **areCompatible**(...features: *[FeatureElement](../modules/_jscrewit_.md#featureelement)[]*): `boolean`

*Defined in [feature.d.ts:237](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature.d.ts#L237)*

Determines whether the specified features are mutually compatible.

*__example__*: ```js
// false: only one of "V8_SRC" or "IE_SRC" may be available.
JScrewIt.Feature.areCompatible("V8_SRC", "IE_SRC")
```

```js
// true
JScrewIt.Feature.areCompatible(JScrewIt.Feature.DEFAULT, JScrewIt.Feature.FILL)
```

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` features | [FeatureElement](../modules/_jscrewit_.md#featureelement)[] |

**Returns:** `boolean`
`true` if the specified features are mutually compatible; otherwise, `false`. If less than two features are specified, the return value is `true`.

___
<a id="areequal"></a>

###  areEqual

▸ **areEqual**(...features: *([Feature](_jscrewit_.feature.md) \| "ANDRO_4_0" \| "ANDRO_4_1" \| "ANDRO_4_4" \| "ANY_DOCUMENT" \| "ANY_WINDOW" \| "ARRAY_ITERATOR" \| "ARROW" \| "ATOB" \| "AUTO" \| "BARPROP" \| "BROWSER" \| "CAPITAL_HTML" \| "CHROME_73" \| "COMPACT" \| "CONSOLE" \| "DEFAULT" \| "DOCUMENT" \| "DOMWINDOW" \| "EDGE_40" \| "ESC_HTML_ALL" \| "ESC_HTML_QUOT" \| "ESC_HTML_QUOT_ONLY" \| "ESC_REGEXP_LF" \| "ESC_REGEXP_SLASH" \| "EXTERNAL" \| "FF_54" \| "FF_62" \| "FF_SRC" \| "FILL" \| "FLAT" \| "FROM_CODE_POINT" \| "FUNCTION_19_LF" \| "FUNCTION_22_LF" \| "GMT" \| "HISTORY" \| "HTMLAUDIOELEMENT" \| "HTMLDOCUMENT" \| "IE_10" \| "IE_11" \| "IE_11_WIN_10" \| "IE_9" \| "IE_SRC" \| "INCR_CHAR" \| "INTL" \| "LOCALE_INFINITY" \| "NAME" \| "NODECONSTRUCTOR" \| "NODE_0_10" \| "NODE_0_12" \| "NODE_10" \| "NODE_11" \| "NODE_12" \| "NODE_4" \| "NODE_5" \| "NO_FF_SRC" \| "NO_IE_SRC" \| "NO_OLD_SAFARI_ARRAY_ITERATOR" \| "NO_V8_SRC" \| "SAFARI_10" \| "SAFARI_12" \| "SAFARI_7_0" \| "SAFARI_7_1" \| "SAFARI_9" \| "SELF_OBJ" \| "STATUS" \| "UNDEFINED" \| "UNEVAL" \| "V8_SRC" \| "WINDOW" \| "CHROME" \| "CHROME_PREV" \| "EDGE" \| "EDGE_PREV" \| "FF" \| "FF_ESR" \| "SAFARI" \| "SAFARI_8" \| "SELF" \| `ReadonlyArray`<[Feature](_jscrewit_.feature.md) \| "ANDRO_4_0" \| "ANDRO_4_1" \| "ANDRO_4_4" \| "ANY_DOCUMENT" \| "ANY_WINDOW" \| "ARRAY_ITERATOR" \| "ARROW" \| "ATOB" \| "AUTO" \| "BARPROP" \| "BROWSER" \| "CAPITAL_HTML" \| "CHROME_73" \| "COMPACT" \| "CONSOLE" \| "DEFAULT" \| "DOCUMENT" \| "DOMWINDOW" \| "EDGE_40" \| "ESC_HTML_ALL" \| "ESC_HTML_QUOT" \| "ESC_HTML_QUOT_ONLY" \| "ESC_REGEXP_LF" \| "ESC_REGEXP_SLASH" \| "EXTERNAL" \| "FF_54" \| "FF_62" \| "FF_SRC" \| "FILL" \| "FLAT" \| "FROM_CODE_POINT" \| "FUNCTION_19_LF" \| "FUNCTION_22_LF" \| "GMT" \| "HISTORY" \| "HTMLAUDIOELEMENT" \| "HTMLDOCUMENT" \| "IE_10" \| "IE_11" \| "IE_11_WIN_10" \| "IE_9" \| "IE_SRC" \| "INCR_CHAR" \| "INTL" \| "LOCALE_INFINITY" \| "NAME" \| "NODECONSTRUCTOR" \| "NODE_0_10" \| "NODE_0_12" \| "NODE_10" \| "NODE_11" \| "NODE_12" \| "NODE_4" \| "NODE_5" \| "NO_FF_SRC" \| "NO_IE_SRC" \| "NO_OLD_SAFARI_ARRAY_ITERATOR" \| "NO_V8_SRC" \| "SAFARI_10" \| "SAFARI_12" \| "SAFARI_7_0" \| "SAFARI_7_1" \| "SAFARI_9" \| "SELF_OBJ" \| "STATUS" \| "UNDEFINED" \| "UNEVAL" \| "V8_SRC" \| "WINDOW" \| "CHROME" \| "CHROME_PREV" \| "EDGE" \| "EDGE_PREV" \| "FF" \| "FF_ESR" \| "SAFARI" \| "SAFARI_8" \| "SELF">)[]*): `boolean`

*Defined in [feature.d.ts:262](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature.d.ts#L262)*

Determines whether all of the specified features are equivalent.

Different features are considered equivalent if they include the same set of elementary features, regardless of any other difference.

*__example__*: ```js
// false
JScrewIt.Feature.areEqual(JScrewIt.Feature.CHROME, JScrewIt.Feature.FIREFOX)
```

```js
// true
JScrewIt.Feature.areEqual("DEFAULT", [])
```

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` features | ([Feature](_jscrewit_.feature.md) \| "ANDRO_4_0" \| "ANDRO_4_1" \| "ANDRO_4_4" \| "ANY_DOCUMENT" \| "ANY_WINDOW" \| "ARRAY_ITERATOR" \| "ARROW" \| "ATOB" \| "AUTO" \| "BARPROP" \| "BROWSER" \| "CAPITAL_HTML" \| "CHROME_73" \| "COMPACT" \| "CONSOLE" \| "DEFAULT" \| "DOCUMENT" \| "DOMWINDOW" \| "EDGE_40" \| "ESC_HTML_ALL" \| "ESC_HTML_QUOT" \| "ESC_HTML_QUOT_ONLY" \| "ESC_REGEXP_LF" \| "ESC_REGEXP_SLASH" \| "EXTERNAL" \| "FF_54" \| "FF_62" \| "FF_SRC" \| "FILL" \| "FLAT" \| "FROM_CODE_POINT" \| "FUNCTION_19_LF" \| "FUNCTION_22_LF" \| "GMT" \| "HISTORY" \| "HTMLAUDIOELEMENT" \| "HTMLDOCUMENT" \| "IE_10" \| "IE_11" \| "IE_11_WIN_10" \| "IE_9" \| "IE_SRC" \| "INCR_CHAR" \| "INTL" \| "LOCALE_INFINITY" \| "NAME" \| "NODECONSTRUCTOR" \| "NODE_0_10" \| "NODE_0_12" \| "NODE_10" \| "NODE_11" \| "NODE_12" \| "NODE_4" \| "NODE_5" \| "NO_FF_SRC" \| "NO_IE_SRC" \| "NO_OLD_SAFARI_ARRAY_ITERATOR" \| "NO_V8_SRC" \| "SAFARI_10" \| "SAFARI_12" \| "SAFARI_7_0" \| "SAFARI_7_1" \| "SAFARI_9" \| "SELF_OBJ" \| "STATUS" \| "UNDEFINED" \| "UNEVAL" \| "V8_SRC" \| "WINDOW" \| "CHROME" \| "CHROME_PREV" \| "EDGE" \| "EDGE_PREV" \| "FF" \| "FF_ESR" \| "SAFARI" \| "SAFARI_8" \| "SELF" \| `ReadonlyArray`<[Feature](_jscrewit_.feature.md) \| "ANDRO_4_0" \| "ANDRO_4_1" \| "ANDRO_4_4" \| "ANY_DOCUMENT" \| "ANY_WINDOW" \| "ARRAY_ITERATOR" \| "ARROW" \| "ATOB" \| "AUTO" \| "BARPROP" \| "BROWSER" \| "CAPITAL_HTML" \| "CHROME_73" \| "COMPACT" \| "CONSOLE" \| "DEFAULT" \| "DOCUMENT" \| "DOMWINDOW" \| "EDGE_40" \| "ESC_HTML_ALL" \| "ESC_HTML_QUOT" \| "ESC_HTML_QUOT_ONLY" \| "ESC_REGEXP_LF" \| "ESC_REGEXP_SLASH" \| "EXTERNAL" \| "FF_54" \| "FF_62" \| "FF_SRC" \| "FILL" \| "FLAT" \| "FROM_CODE_POINT" \| "FUNCTION_19_LF" \| "FUNCTION_22_LF" \| "GMT" \| "HISTORY" \| "HTMLAUDIOELEMENT" \| "HTMLDOCUMENT" \| "IE_10" \| "IE_11" \| "IE_11_WIN_10" \| "IE_9" \| "IE_SRC" \| "INCR_CHAR" \| "INTL" \| "LOCALE_INFINITY" \| "NAME" \| "NODECONSTRUCTOR" \| "NODE_0_10" \| "NODE_0_12" \| "NODE_10" \| "NODE_11" \| "NODE_12" \| "NODE_4" \| "NODE_5" \| "NO_FF_SRC" \| "NO_IE_SRC" \| "NO_OLD_SAFARI_ARRAY_ITERATOR" \| "NO_V8_SRC" \| "SAFARI_10" \| "SAFARI_12" \| "SAFARI_7_0" \| "SAFARI_7_1" \| "SAFARI_9" \| "SELF_OBJ" \| "STATUS" \| "UNDEFINED" \| "UNEVAL" \| "V8_SRC" \| "WINDOW" \| "CHROME" \| "CHROME_PREV" \| "EDGE" \| "EDGE_PREV" \| "FF" \| "FF_ESR" \| "SAFARI" \| "SAFARI_8" \| "SELF">)[] |

**Returns:** `boolean`
`true` if all of the specified features are equivalent; otherwise, `false`. If less than two arguments are specified, the return value is `true`.

___
<a id="commonof"></a>

###  commonOf

▸ **commonOf**(...features: *([Feature](_jscrewit_.feature.md) \| "ANDRO_4_0" \| "ANDRO_4_1" \| "ANDRO_4_4" \| "ANY_DOCUMENT" \| "ANY_WINDOW" \| "ARRAY_ITERATOR" \| "ARROW" \| "ATOB" \| "AUTO" \| "BARPROP" \| "BROWSER" \| "CAPITAL_HTML" \| "CHROME_73" \| "COMPACT" \| "CONSOLE" \| "DEFAULT" \| "DOCUMENT" \| "DOMWINDOW" \| "EDGE_40" \| "ESC_HTML_ALL" \| "ESC_HTML_QUOT" \| "ESC_HTML_QUOT_ONLY" \| "ESC_REGEXP_LF" \| "ESC_REGEXP_SLASH" \| "EXTERNAL" \| "FF_54" \| "FF_62" \| "FF_SRC" \| "FILL" \| "FLAT" \| "FROM_CODE_POINT" \| "FUNCTION_19_LF" \| "FUNCTION_22_LF" \| "GMT" \| "HISTORY" \| "HTMLAUDIOELEMENT" \| "HTMLDOCUMENT" \| "IE_10" \| "IE_11" \| "IE_11_WIN_10" \| "IE_9" \| "IE_SRC" \| "INCR_CHAR" \| "INTL" \| "LOCALE_INFINITY" \| "NAME" \| "NODECONSTRUCTOR" \| "NODE_0_10" \| "NODE_0_12" \| "NODE_10" \| "NODE_11" \| "NODE_12" \| "NODE_4" \| "NODE_5" \| "NO_FF_SRC" \| "NO_IE_SRC" \| "NO_OLD_SAFARI_ARRAY_ITERATOR" \| "NO_V8_SRC" \| "SAFARI_10" \| "SAFARI_12" \| "SAFARI_7_0" \| "SAFARI_7_1" \| "SAFARI_9" \| "SELF_OBJ" \| "STATUS" \| "UNDEFINED" \| "UNEVAL" \| "V8_SRC" \| "WINDOW" \| "CHROME" \| "CHROME_PREV" \| "EDGE" \| "EDGE_PREV" \| "FF" \| "FF_ESR" \| "SAFARI" \| "SAFARI_8" \| "SELF" \| `ReadonlyArray`<[Feature](_jscrewit_.feature.md) \| "ANDRO_4_0" \| "ANDRO_4_1" \| "ANDRO_4_4" \| "ANY_DOCUMENT" \| "ANY_WINDOW" \| "ARRAY_ITERATOR" \| "ARROW" \| "ATOB" \| "AUTO" \| "BARPROP" \| "BROWSER" \| "CAPITAL_HTML" \| "CHROME_73" \| "COMPACT" \| "CONSOLE" \| "DEFAULT" \| "DOCUMENT" \| "DOMWINDOW" \| "EDGE_40" \| "ESC_HTML_ALL" \| "ESC_HTML_QUOT" \| "ESC_HTML_QUOT_ONLY" \| "ESC_REGEXP_LF" \| "ESC_REGEXP_SLASH" \| "EXTERNAL" \| "FF_54" \| "FF_62" \| "FF_SRC" \| "FILL" \| "FLAT" \| "FROM_CODE_POINT" \| "FUNCTION_19_LF" \| "FUNCTION_22_LF" \| "GMT" \| "HISTORY" \| "HTMLAUDIOELEMENT" \| "HTMLDOCUMENT" \| "IE_10" \| "IE_11" \| "IE_11_WIN_10" \| "IE_9" \| "IE_SRC" \| "INCR_CHAR" \| "INTL" \| "LOCALE_INFINITY" \| "NAME" \| "NODECONSTRUCTOR" \| "NODE_0_10" \| "NODE_0_12" \| "NODE_10" \| "NODE_11" \| "NODE_12" \| "NODE_4" \| "NODE_5" \| "NO_FF_SRC" \| "NO_IE_SRC" \| "NO_OLD_SAFARI_ARRAY_ITERATOR" \| "NO_V8_SRC" \| "SAFARI_10" \| "SAFARI_12" \| "SAFARI_7_0" \| "SAFARI_7_1" \| "SAFARI_9" \| "SELF_OBJ" \| "STATUS" \| "UNDEFINED" \| "UNEVAL" \| "V8_SRC" \| "WINDOW" \| "CHROME" \| "CHROME_PREV" \| "EDGE" \| "EDGE_PREV" \| "FF" \| "FF_ESR" \| "SAFARI" \| "SAFARI_8" \| "SELF">)[]*): [CustomFeature](_jscrewit_.customfeature.md) \| `null`

*Defined in [feature.d.ts:290](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/feature.d.ts#L290)*

Creates a new feature object equivalent to the intersection of the specified features.

*__example__*: This will create a new feature object equivalent to [`NAME`](_jscrewit_.featureall.md#NAME).

```js
const newFeature = JScrewIt.Feature.commonOf(["ATOB", "NAME"], ["NAME", "SELF"]);
```

This will create a new feature object equivalent to [`ANY_DOCUMENT`](_jscrewit_.featureall.md#ANY_DOCUMENT). This is because both [`HTMLDOCUMENT`](_jscrewit_.featureall.md#HTMLDOCUMENT) and [`DOCUMENT`](_jscrewit_.featureall.md#DOCUMENT) imply [`ANY_DOCUMENT`](_jscrewit_.featureall.md#ANY_DOCUMENT).

```js
const newFeature = JScrewIt.Feature.commonOf("HTMLDOCUMENT", "DOCUMENT");
```

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` features | ([Feature](_jscrewit_.feature.md) \| "ANDRO_4_0" \| "ANDRO_4_1" \| "ANDRO_4_4" \| "ANY_DOCUMENT" \| "ANY_WINDOW" \| "ARRAY_ITERATOR" \| "ARROW" \| "ATOB" \| "AUTO" \| "BARPROP" \| "BROWSER" \| "CAPITAL_HTML" \| "CHROME_73" \| "COMPACT" \| "CONSOLE" \| "DEFAULT" \| "DOCUMENT" \| "DOMWINDOW" \| "EDGE_40" \| "ESC_HTML_ALL" \| "ESC_HTML_QUOT" \| "ESC_HTML_QUOT_ONLY" \| "ESC_REGEXP_LF" \| "ESC_REGEXP_SLASH" \| "EXTERNAL" \| "FF_54" \| "FF_62" \| "FF_SRC" \| "FILL" \| "FLAT" \| "FROM_CODE_POINT" \| "FUNCTION_19_LF" \| "FUNCTION_22_LF" \| "GMT" \| "HISTORY" \| "HTMLAUDIOELEMENT" \| "HTMLDOCUMENT" \| "IE_10" \| "IE_11" \| "IE_11_WIN_10" \| "IE_9" \| "IE_SRC" \| "INCR_CHAR" \| "INTL" \| "LOCALE_INFINITY" \| "NAME" \| "NODECONSTRUCTOR" \| "NODE_0_10" \| "NODE_0_12" \| "NODE_10" \| "NODE_11" \| "NODE_12" \| "NODE_4" \| "NODE_5" \| "NO_FF_SRC" \| "NO_IE_SRC" \| "NO_OLD_SAFARI_ARRAY_ITERATOR" \| "NO_V8_SRC" \| "SAFARI_10" \| "SAFARI_12" \| "SAFARI_7_0" \| "SAFARI_7_1" \| "SAFARI_9" \| "SELF_OBJ" \| "STATUS" \| "UNDEFINED" \| "UNEVAL" \| "V8_SRC" \| "WINDOW" \| "CHROME" \| "CHROME_PREV" \| "EDGE" \| "EDGE_PREV" \| "FF" \| "FF_ESR" \| "SAFARI" \| "SAFARI_8" \| "SELF" \| `ReadonlyArray`<[Feature](_jscrewit_.feature.md) \| "ANDRO_4_0" \| "ANDRO_4_1" \| "ANDRO_4_4" \| "ANY_DOCUMENT" \| "ANY_WINDOW" \| "ARRAY_ITERATOR" \| "ARROW" \| "ATOB" \| "AUTO" \| "BARPROP" \| "BROWSER" \| "CAPITAL_HTML" \| "CHROME_73" \| "COMPACT" \| "CONSOLE" \| "DEFAULT" \| "DOCUMENT" \| "DOMWINDOW" \| "EDGE_40" \| "ESC_HTML_ALL" \| "ESC_HTML_QUOT" \| "ESC_HTML_QUOT_ONLY" \| "ESC_REGEXP_LF" \| "ESC_REGEXP_SLASH" \| "EXTERNAL" \| "FF_54" \| "FF_62" \| "FF_SRC" \| "FILL" \| "FLAT" \| "FROM_CODE_POINT" \| "FUNCTION_19_LF" \| "FUNCTION_22_LF" \| "GMT" \| "HISTORY" \| "HTMLAUDIOELEMENT" \| "HTMLDOCUMENT" \| "IE_10" \| "IE_11" \| "IE_11_WIN_10" \| "IE_9" \| "IE_SRC" \| "INCR_CHAR" \| "INTL" \| "LOCALE_INFINITY" \| "NAME" \| "NODECONSTRUCTOR" \| "NODE_0_10" \| "NODE_0_12" \| "NODE_10" \| "NODE_11" \| "NODE_12" \| "NODE_4" \| "NODE_5" \| "NO_FF_SRC" \| "NO_IE_SRC" \| "NO_OLD_SAFARI_ARRAY_ITERATOR" \| "NO_V8_SRC" \| "SAFARI_10" \| "SAFARI_12" \| "SAFARI_7_0" \| "SAFARI_7_1" \| "SAFARI_9" \| "SELF_OBJ" \| "STATUS" \| "UNDEFINED" \| "UNEVAL" \| "V8_SRC" \| "WINDOW" \| "CHROME" \| "CHROME_PREV" \| "EDGE" \| "EDGE_PREV" \| "FF" \| "FF_ESR" \| "SAFARI" \| "SAFARI_8" \| "SELF">)[] |

**Returns:** [CustomFeature](_jscrewit_.customfeature.md) \| `null`
A feature object, or `null` if no arguments are specified.

___

