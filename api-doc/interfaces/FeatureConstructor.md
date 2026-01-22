[**JScrewIt**](../README.md)

***

# Interface: FeatureConstructor()

## Extends

- [`FeatureAll`](FeatureAll.md)

> **FeatureConstructor**(...`features`): [`CustomFeature`](CustomFeature.md)

Creates a new feature object from the union of the specified features.

The constructor can be used with or without the `new` operator, e.g.
`new JScrewIt.Feature(feature1, feature2)` or `JScrewIt.Feature(feature1, feature2)`.
If no arguments are specified, the new feature object will be equivalent to
[\`DEFAULT\`](#default).

## Parameters

### features

...[`FeatureElementOrCompatibleArray`](../type-aliases/FeatureElementOrCompatibleArray.md)[]

## Returns

[`CustomFeature`](CustomFeature.md)

## Example

The following statements are equivalent, and will all construct a new feature object
including both [\`DOCUMENT\`](#document) and [\`WINDOW\`](#window).

```js
new JScrewIt.Feature("DOCUMENT", "WINDOW");
```

```js
new JScrewIt.Feature(JScrewIt.Feature.DOCUMENT, JScrewIt.Feature.WINDOW);
```

```js
new JScrewIt.Feature([JScrewIt.Feature.DOCUMENT, JScrewIt.Feature.WINDOW]);
```

## Throws

An error is thrown if any of the specified features are not mutually compatible.

## Constructors

### Constructor

> **new FeatureConstructor**(...`features`): [`CustomFeature`](CustomFeature.md)

Creates a new feature object from the union of the specified features.

The constructor can be used with or without the `new` operator, e.g.
`new JScrewIt.Feature(feature1, feature2)` or `JScrewIt.Feature(feature1, feature2)`.
If no arguments are specified, the new feature object will be equivalent to
[\`DEFAULT\`](#default).

#### Parameters

##### features

...[`FeatureElementOrCompatibleArray`](../type-aliases/FeatureElementOrCompatibleArray.md)[]

#### Returns

[`CustomFeature`](CustomFeature.md)

#### Example

The following statements are equivalent, and will all construct a new feature object
including both [\`DOCUMENT\`](#document) and [\`WINDOW\`](#window).

```js
JScrewIt.Feature("DOCUMENT", "WINDOW");
```

```js
JScrewIt.Feature(JScrewIt.Feature.DOCUMENT, JScrewIt.Feature.WINDOW);
```

```js
JScrewIt.Feature([JScrewIt.Feature.DOCUMENT, JScrewIt.Feature.WINDOW]);
```

#### Throws

An error is thrown if any of the specified features are not mutually compatible.

#### Inherited from

`FeatureAll.constructor`

## Properties

### ALL

> `readonly` **ALL**: [`FeatureAll`](FeatureAll.md)

An immutable mapping of all predefined feature objects accessed by name or alias.

#### Example

This will produce an array with the names and aliases of all predefined features.

```js
Object.keys(JScrewIt.Feature.ALL)
```

This will determine if a particular feature object is predefined or not.

```js
featureObj === JScrewIt.Feature.ALL[featureObj.name]
```

***

### ARRAY\_ITERATOR

> **ARRAY\_ITERATOR**: [`ElementaryFeature`](ElementaryFeature.md)

The property that the string representation of Array.prototype.entries\(\) evaluates to "\[object Array Iterator\]".

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`ARRAY_ITERATOR`](FeatureAll.md#array_iterator)

***

### ARROW

> **ARROW**: [`ElementaryFeature`](ElementaryFeature.md)

Support for arrow functions.

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`ARROW`](FeatureAll.md#arrow)

***

### AT

> **AT**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the native function Array.prototype.at.

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`AT`](FeatureAll.md#at)

***

### AUTO

> **AUTO**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in the current environment.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`AUTO`](FeatureAll.md#auto)

***

### BARPROP

> **BARPROP**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object statusbar having the string representation "\[object BarProp\]".

#### Remarks

Available in Chrome, Edge, Firefox, Safari, and Opera. This feature is not available inside web workers.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`BARPROP`](FeatureAll.md#barprop)

***

### BROWSER

> **BROWSER**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in all browsers.

No support for Node.js.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`BROWSER`](FeatureAll.md#browser)

***

### CAPITAL\_HTML

> **CAPITAL\_HTML**: [`ElementaryFeature`](ElementaryFeature.md)

The property that the various string methods returning HTML code such as String.prototype.big or String.prototype.link have both the tag name and attributes written in capital letters.

#### Remarks

Available in Internet Explorer.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`CAPITAL_HTML`](FeatureAll.md#capital_html)

***

### CHROME

> **CHROME**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in the current stable versions of Chrome, Edge and Opera.

An alias for `CHROME_122`.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`CHROME`](FeatureAll.md#chrome)

***

### CHROME\_122

> **CHROME\_122**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Chrome 122, Edge 122 and Opera 108 or later.

#### Remarks

This feature may be replaced or removed in the near future when current browser versions become obsolete. Use `CHROME` or `CHROME_PREV` instead of `CHROME_122` for long term support.

#### See

[Engine Support Policy](https://github.com/fasttime/JScrewIt#engine-support-policy)

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`CHROME_122`](FeatureAll.md#chrome_122)

***

### CHROME\_PREV

> **CHROME\_PREV**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in the previous to current versions of Chrome and Edge.

An alias for `CHROME_122`.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`CHROME_PREV`](FeatureAll.md#chrome_prev)

***

### COMPACT

> **COMPACT**: [`PredefinedFeature`](PredefinedFeature.md)

All new browsers' features.

Not compatible with Node.js, Internet Explorer, and old versions of supported browsers.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`COMPACT`](FeatureAll.md#compact)

***

### CONSOLE

> **CONSOLE**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object console having the string representation "\[object Console\]".

This feature may become unavailable when certain browser extensions are active.

#### Remarks

Available in Internet Explorer.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`CONSOLE`](FeatureAll.md#console)

***

### DEFAULT

> **DEFAULT**: [`PredefinedFeature`](PredefinedFeature.md)

Minimum feature level, compatible with all supported engines in all environments.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`DEFAULT`](FeatureAll.md#default)

***

### DOCUMENT

> **DOCUMENT**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object document whose string representation starts with "\[object " and ends with "Document\]".

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, and Opera. This feature is not available inside web workers.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`DOCUMENT`](FeatureAll.md#document)

***

### ELEMENTARY

> `readonly` **ELEMENTARY**: readonly [`ElementaryFeature`](ElementaryFeature.md)[]

An immutable array of all elementary feature objects ordered by name.

***

### ESC\_HTML\_QUOT

> **ESC\_HTML\_QUOT**: [`ElementaryFeature`](ElementaryFeature.md)

The property that double quotation marks in the argument of String.prototype.fontcolor are escaped as "\&quot;".

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`ESC_HTML_QUOT`](FeatureAll.md#esc_html_quot)

***

### FF

> **FF**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in the current stable version of Firefox.

An alias for `FF_134`.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`FF`](FeatureAll.md#ff)

***

### FF\_131

> **FF\_131**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Firefox 131 to 133.

#### Remarks

This feature may be replaced or removed in the near future when current browser versions become obsolete.

#### See

[Engine Support Policy](https://github.com/fasttime/JScrewIt#engine-support-policy)

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`FF_131`](FeatureAll.md#ff_131)

***

### FF\_134

> **FF\_134**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Firefox 134 or later.

#### Remarks

This feature may be replaced or removed in the near future when current browser versions become obsolete. Use `FF` or `FF_PREV` instead of `FF_134` for long term support.

#### See

[Engine Support Policy](https://github.com/fasttime/JScrewIt#engine-support-policy)

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`FF_134`](FeatureAll.md#ff_134)

***

### FF\_90

> **FF\_90**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Firefox 90 to 130.

#### Remarks

This feature may be replaced or removed in the near future when current browser versions become obsolete. Use `FF_ESR` instead of `FF_90` for long term support.

#### See

[Engine Support Policy](https://github.com/fasttime/JScrewIt#engine-support-policy)

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`FF_90`](FeatureAll.md#ff_90)

***

### FF\_ESR

> **FF\_ESR**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in the current version of Firefox ESR.

An alias for `FF_90`.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`FF_ESR`](FeatureAll.md#ff_esr)

***

### FF\_PREV

> **FF\_PREV**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in the previous to current version of Firefox.

An alias for `FF_134`.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`FF_PREV`](FeatureAll.md#ff_prev)

***

### FF\_SRC

> **FF\_SRC**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of native functions typical for Firefox and Safari.

Remarkable traits are the lack of line feed characters at the beginning and at the end of the string and the presence of a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.

#### Remarks

Available in Firefox and Safari.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`FF_SRC`](FeatureAll.md#ff_src)

***

### FILL

> **FILL**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the native function Array.prototype.fill.

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`FILL`](FeatureAll.md#fill)

***

### FLAT

> **FLAT**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the native function Array.prototype.flat.

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`FLAT`](FeatureAll.md#flat)

***

### FROM\_CODE\_POINT

> **FROM\_CODE\_POINT**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the function String.fromCodePoint.

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`FROM_CODE_POINT`](FeatureAll.md#from_code_point)

***

### FUNCTION\_19\_LF

> **FUNCTION\_19\_LF**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of dynamically generated functions where the character at index 19 is a line feed \("\\n"\).

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`FUNCTION_19_LF`](FeatureAll.md#function_19_lf)

***

### FUNCTION\_22\_LF

> **FUNCTION\_22\_LF**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of dynamically generated functions where the character at index 22 is a line feed \("\\n"\).

#### Remarks

Available in Internet Explorer.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`FUNCTION_22_LF`](FeatureAll.md#function_22_lf)

***

### IE\_11

> **IE\_11**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Internet Explorer 11.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`IE_11`](FeatureAll.md#ie_11)

***

### IE\_11\_WIN\_10

> **IE\_11\_WIN\_10**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Internet Explorer 11 on Windows 10.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`IE_11_WIN_10`](FeatureAll.md#ie_11_win_10)

***

### IE\_SRC

> **IE\_SRC**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of native functions typical for Internet Explorer.

Remarkable traits are the presence of a line feed character \("\\n"\) at the beginning and at the end of the string and a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.

#### Remarks

Available in Internet Explorer.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`IE_SRC`](FeatureAll.md#ie_src)

***

### INCR\_CHAR

> **INCR\_CHAR**: [`ElementaryFeature`](ElementaryFeature.md)

The ability to use unary increment operators with string characters, like in \( ++"some string"\[0\] \): this will result in a TypeError in strict mode in ECMAScript compliant engines.

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Node.js. This feature is not available when strict mode is enforced in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Node.js.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`INCR_CHAR`](FeatureAll.md#incr_char)

***

### ITERATOR\_HELPER

> **ITERATOR\_HELPER**: [`ElementaryFeature`](ElementaryFeature.md)

Availability of iterator helpers.

#### Remarks

Available in Chrome, Edge, Firefox 131+, Safari 18.4+, Opera, and Node.js 22.0+.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`ITERATOR_HELPER`](FeatureAll.md#iterator_helper)

***

### LOCALE\_INFINITY

> **LOCALE\_INFINITY**: [`ElementaryFeature`](ElementaryFeature.md)

Language sensitive string representation of Infinity as "∞".

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer 11 on Windows 10, Safari, Opera, and Node.js.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`LOCALE_INFINITY`](FeatureAll.md#locale_infinity)

***

### LOCALE\_NUMERALS\_BN

> **LOCALE\_NUMERALS\_BN**: [`ElementaryFeature`](ElementaryFeature.md)

Localized number formatting for Bengali.

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer 11 on Windows 10, Safari before 18.4, Opera, and Node.js.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`LOCALE_NUMERALS_BN`](FeatureAll.md#locale_numerals_bn)

***

### LOCALE\_NUMERALS\_EXT

> **LOCALE\_NUMERALS\_EXT**: [`ElementaryFeature`](ElementaryFeature.md)

Extended localized number formatting.

Localized number formatting including the output of the first three letters in the second word of the Arabic string representation of NaN \("رقم"\), the letters in the Russian string representation of NaN \("не число"\) and the letters in the Persian string representation of NaN \("ناعدد"\).

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer 11 on Windows 10, Safari, Opera, and Node.js.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`LOCALE_NUMERALS_EXT`](FeatureAll.md#locale_numerals_ext)

***

### NAME

> **NAME**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the name property for functions.

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`NAME`](FeatureAll.md#name)

***

### NO\_FF\_SRC

> **NO\_FF\_SRC**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of native functions typical for V8 or for Internet Explorer but not for Firefox and Safari.

#### Remarks

Available in Chrome, Edge, Internet Explorer, Opera, and Node.js.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`NO_FF_SRC`](FeatureAll.md#no_ff_src)

***

### NO\_IE\_SRC

> **NO\_IE\_SRC**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of native functions typical for most engines with the notable exception of Internet Explorer.

A remarkable trait of this feature is the lack of line feed characters at the beginning and at the end of the string.

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`NO_IE_SRC`](FeatureAll.md#no_ie_src)

***

### NO\_V8\_SRC

> **NO\_V8\_SRC**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of native functions typical for Firefox, Internet Explorer and Safari.

A most remarkable trait of this feature is the presence of a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.

#### Remarks

Available in Firefox, Internet Explorer, and Safari.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`NO_V8_SRC`](FeatureAll.md#no_v8_src)

***

### NODE\_20

> **NODE\_20**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 20 to 21.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`NODE_20`](FeatureAll.md#node_20)

***

### NODE\_22

> **NODE\_22**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 22.0 to 22.11 and Node.js 23.0 to 23.2.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`NODE_22`](FeatureAll.md#node_22)

***

### NODE\_22\_12

> **NODE\_22\_12**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 22.12 to 22.14 and Node.js 23.3 or later.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`NODE_22_12`](FeatureAll.md#node_22_12)

***

### OBJECT\_ARRAY\_ENTRIES\_CTOR

> **OBJECT\_ARRAY\_ENTRIES\_CTOR**: [`ElementaryFeature`](ElementaryFeature.md)

The property that the Array.prototype.entries\(\).constructor is the Object constructor.

#### Remarks

Available in Firefox before 131, Safari before 18.4, and Node.js before 22.0.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`OBJECT_ARRAY_ENTRIES_CTOR`](FeatureAll.md#object_array_entries_ctor)

***

### OBJECT\_W\_SELF

> **OBJECT\_W\_SELF**: [`ElementaryFeature`](ElementaryFeature.md)

The property that the string representation of the global object self starts with "\[object W".

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, and Opera. This feature is not available inside web workers in Chrome, Edge, Firefox, Safari, and Opera.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`OBJECT_W_SELF`](FeatureAll.md#object_w_self)

***

### PLAIN\_INTL

> **PLAIN\_INTL**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object Intl having the string representation "\[object Object\]".

#### Remarks

Available in Internet Explorer.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`PLAIN_INTL`](FeatureAll.md#plain_intl)

***

### REGEXP\_STRING\_ITERATOR

> **REGEXP\_STRING\_ITERATOR**: [`ElementaryFeature`](ElementaryFeature.md)

The property that the string representation of String.prototype.matchAll\(\) evaluates to "\[object RegExp String Iterator\]".

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`REGEXP_STRING_ITERATOR`](FeatureAll.md#regexp_string_iterator)

***

### SAFARI

> **SAFARI**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in the current stable version of Safari.

An alias for `SAFARI_18_4`.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`SAFARI`](FeatureAll.md#safari)

***

### SAFARI\_17\_4

> **SAFARI\_17\_4**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 17.4 to 17.6.

#### Remarks

This feature may be replaced or removed in the near future when current browser versions become obsolete. Use `SAFARI_PRE_PREV` instead of `SAFARI_17_4` for long term support.

#### See

[Engine Support Policy](https://github.com/fasttime/JScrewIt#engine-support-policy)

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`SAFARI_17_4`](FeatureAll.md#safari_17_4)

***

### SAFARI\_18\_0

> **SAFARI\_18\_0**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 18.0 to 18.3.

#### Remarks

This feature may be replaced or removed in the near future when current browser versions become obsolete.

#### See

[Engine Support Policy](https://github.com/fasttime/JScrewIt#engine-support-policy)

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`SAFARI_18_0`](FeatureAll.md#safari_18_0)

***

### SAFARI\_18\_4

> **SAFARI\_18\_4**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 18.4 or later.

#### Remarks

This feature may be replaced or removed in the near future when current browser versions become obsolete. Use `SAFARI` or `SAFARI_PREV` instead of `SAFARI_18_4` for long term support.

#### See

[Engine Support Policy](https://github.com/fasttime/JScrewIt#engine-support-policy)

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`SAFARI_18_4`](FeatureAll.md#safari_18_4)

***

### SAFARI\_PRE\_PREV

> **SAFARI\_PRE\_PREV**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in the previous to previous version of Safari.

An alias for `SAFARI_17_4`.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`SAFARI_PRE_PREV`](FeatureAll.md#safari_pre_prev)

***

### SAFARI\_PREV

> **SAFARI\_PREV**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in the previous to current version of Safari.

An alias for `SAFARI_18_4`.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`SAFARI_PREV`](FeatureAll.md#safari_prev)

***

### SELF

> **SELF**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object self whose string representation starts with "\[object ".

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, and Opera.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`SELF`](FeatureAll.md#self)

***

### SHORT\_LOCALES

> **SHORT\_LOCALES**: [`ElementaryFeature`](ElementaryFeature.md)

Support for the two-letter locale name "ar" to format decimal numbers as Arabic numerals.

#### Remarks

Available in Firefox before 134, Internet Explorer, Safari before 18.0, and Node.js before 22.12–22.14 and 23.3.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`SHORT_LOCALES`](FeatureAll.md#short_locales)

***

### STATUS

> **STATUS**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global string status.

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, and Opera. This feature is not available inside web workers.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`STATUS`](FeatureAll.md#status)

***

### V8\_SRC

> **V8\_SRC**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of native functions typical for the V8 engine.

Remarkable traits are the lack of line feed characters at the beginning and at the end of the string and the presence of a single whitespace before the "\[native code\]" sequence.

#### Remarks

Available in Chrome, Edge, Opera, and Node.js.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`V8_SRC`](FeatureAll.md#v8_src)

***

### WINDOW

> **WINDOW**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object self having the string representation "\[object Window\]".

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, and Opera. This feature is not available inside web workers.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`WINDOW`](FeatureAll.md#window)

## Methods

### areCompatible()

> **areCompatible**(...`features`): `boolean`

Determines whether the specified features are mutually compatible.

#### Parameters

##### features

...[`FeatureElement`](../type-aliases/FeatureElement.md)[]

#### Returns

`boolean`

`true` if the specified features are mutually compatible; otherwise, `false`.
If less than two features are specified, the return value is `true`.

#### Example

```js
// false: only one of "V8_SRC" or "IE_SRC" may be available.
JScrewIt.Feature.areCompatible("V8_SRC", "IE_SRC")
```

```js
// true
JScrewIt.Feature.areCompatible(JScrewIt.Feature.DEFAULT, JScrewIt.Feature.FILL)
```

***

### areEqual()

> **areEqual**(...`features`): `boolean`

Determines whether all of the specified features are equivalent.

Different features are considered equivalent if they include the same set of elementary
features, regardless of any other difference.

#### Parameters

##### features

...[`FeatureElementOrCompatibleArray`](../type-aliases/FeatureElementOrCompatibleArray.md)[]

#### Returns

`boolean`

`true` if all of the specified features are equivalent; otherwise, `false`.
If less than two arguments are specified, the return value is `true`.

#### Example

```js
// false
JScrewIt.Feature.areEqual(JScrewIt.Feature.CHROME, JScrewIt.Feature.FF)
```

```js
// true
JScrewIt.Feature.areEqual("DEFAULT", [])
```

***

### commonOf()

> **commonOf**(...`features`): [`CustomFeature`](CustomFeature.md) \| `null`

Creates a new feature object equivalent to the intersection of the specified features.

#### Parameters

##### features

...[`FeatureElementOrCompatibleArray`](../type-aliases/FeatureElementOrCompatibleArray.md)[]

#### Returns

[`CustomFeature`](CustomFeature.md) \| `null`

A feature object, or `null` if no arguments are specified.

#### Example

The following declaration creates a new feature object equivalent to
[\`NAME\`](#name).

```js
const newFeature = JScrewIt.Feature.commonOf(["AT", "NAME"], ["NAME", "WINDOW"]);
```

The following declaration creates a new feature object equivalent to [\`NO\_IE\_SRC\`](#no_ie_src).
This is because both [\`FF\_SRC\`](#ff_src) and [\`V8\_SRC\`](#v8_src) imply [\`NO\_IE\_SRC\`](#no_ie_src).

```js
const newFeature = JScrewIt.Feature.commonOf("FF_SRC", "V8_SRC");
```

***

### descriptionFor()

> **descriptionFor**(`name`): `string`

Returns a short description of a predefined feature in plain English.

#### Parameters

##### name

keyof [`FeatureAll`](FeatureAll.md)

A name or alias of a predefined feature.

#### Returns

`string`

#### Remarks

Different names or aliases of the same feature may have different descriptions.

#### Throws

An error is thrown if the specified argument is not a name or alias of a predefined feature.
