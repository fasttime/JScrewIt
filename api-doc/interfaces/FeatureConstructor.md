# Interface: FeatureConstructor

## Hierarchy

- [`FeatureAll`](FeatureAll.md)

  ↳ **`FeatureConstructor`**

## Callable

### FeatureConstructor

▸ **FeatureConstructor**(...`features`): [`CustomFeature`](CustomFeature.md)

Creates a new feature object from the union of the specified features.

The constructor can be used with or without the `new` operator, e.g.
`new JScrewIt.Feature(feature1, feature2)` or `JScrewIt.Feature(feature1, feature2)`.
If no arguments are specified, the new feature object will be equivalent to
<code>[DEFAULT](FeatureConstructor.md#default)</code>.

**`example`**

The following statements are equivalent, and will all construct a new feature object
including both <code>[ANY_DOCUMENT](FeatureConstructor.md#any_document)</code> and <code>[ANY_WINDOW](FeatureConstructor.md#any_window)</code>.

```js
new JScrewIt.Feature("ANY_DOCUMENT", "ANY_WINDOW");
```

```js
new JScrewIt.Feature(JScrewIt.Feature.ANY_DOCUMENT, JScrewIt.Feature.ANY_WINDOW);
```

```js
new JScrewIt.Feature([JScrewIt.Feature.ANY_DOCUMENT, JScrewIt.Feature.ANY_WINDOW]);
```

**`throws`**

An error is thrown if any of the specified features are not mutually compatible.

#### Parameters

| Name | Type |
| :------ | :------ |
| `...features` | [`FeatureElementOrCompatibleArray`](../README.md#featureelementorcompatiblearray)[] |

#### Returns

[`CustomFeature`](CustomFeature.md)

## Table of contents

### Constructors

- [constructor](FeatureConstructor.md#constructor)

### Properties

- [ALL](FeatureConstructor.md#all)
- [ANDRO\_4\_0](FeatureConstructor.md#andro_4_0)
- [ANDRO\_4\_1](FeatureConstructor.md#andro_4_1)
- [ANDRO\_4\_4](FeatureConstructor.md#andro_4_4)
- [ANY\_DOCUMENT](FeatureConstructor.md#any_document)
- [ANY\_WINDOW](FeatureConstructor.md#any_window)
- [ARRAY\_ITERATOR](FeatureConstructor.md#array_iterator)
- [ARROW](FeatureConstructor.md#arrow)
- [AT](FeatureConstructor.md#at)
- [ATOB](FeatureConstructor.md#atob)
- [AUTO](FeatureConstructor.md#auto)
- [BARPROP](FeatureConstructor.md#barprop)
- [BROWSER](FeatureConstructor.md#browser)
- [CAPITAL\_HTML](FeatureConstructor.md#capital_html)
- [CHROME](FeatureConstructor.md#chrome)
- [CHROME\_86](FeatureConstructor.md#chrome_86)
- [CHROME\_92](FeatureConstructor.md#chrome_92)
- [CHROME\_PREV](FeatureConstructor.md#chrome_prev)
- [COMPACT](FeatureConstructor.md#compact)
- [CONSOLE](FeatureConstructor.md#console)
- [DEFAULT](FeatureConstructor.md#default)
- [DOCUMENT](FeatureConstructor.md#document)
- [DOMWINDOW](FeatureConstructor.md#domwindow)
- [ELEMENTARY](FeatureConstructor.md#elementary)
- [ESC\_HTML\_ALL](FeatureConstructor.md#esc_html_all)
- [ESC\_HTML\_QUOT](FeatureConstructor.md#esc_html_quot)
- [ESC\_HTML\_QUOT\_ONLY](FeatureConstructor.md#esc_html_quot_only)
- [ESC\_REGEXP\_LF](FeatureConstructor.md#esc_regexp_lf)
- [ESC\_REGEXP\_SLASH](FeatureConstructor.md#esc_regexp_slash)
- [FF](FeatureConstructor.md#ff)
- [FF\_78](FeatureConstructor.md#ff_78)
- [FF\_83](FeatureConstructor.md#ff_83)
- [FF\_90](FeatureConstructor.md#ff_90)
- [FF\_ESR](FeatureConstructor.md#ff_esr)
- [FF\_PREV](FeatureConstructor.md#ff_prev)
- [FF\_SRC](FeatureConstructor.md#ff_src)
- [FILL](FeatureConstructor.md#fill)
- [FLAT](FeatureConstructor.md#flat)
- [FROM\_CODE\_POINT](FeatureConstructor.md#from_code_point)
- [FUNCTION\_19\_LF](FeatureConstructor.md#function_19_lf)
- [FUNCTION\_22\_LF](FeatureConstructor.md#function_22_lf)
- [GENERIC\_ARRAY\_TO\_STRING](FeatureConstructor.md#generic_array_to_string)
- [GLOBAL\_UNDEFINED](FeatureConstructor.md#global_undefined)
- [GMT](FeatureConstructor.md#gmt)
- [HISTORY](FeatureConstructor.md#history)
- [HTMLAUDIOELEMENT](FeatureConstructor.md#htmlaudioelement)
- [HTMLDOCUMENT](FeatureConstructor.md#htmldocument)
- [IE\_10](FeatureConstructor.md#ie_10)
- [IE\_11](FeatureConstructor.md#ie_11)
- [IE\_11\_WIN\_10](FeatureConstructor.md#ie_11_win_10)
- [IE\_9](FeatureConstructor.md#ie_9)
- [IE\_SRC](FeatureConstructor.md#ie_src)
- [INCR\_CHAR](FeatureConstructor.md#incr_char)
- [INTL](FeatureConstructor.md#intl)
- [LOCALE\_INFINITY](FeatureConstructor.md#locale_infinity)
- [LOCALE\_NUMERALS](FeatureConstructor.md#locale_numerals)
- [LOCALE\_NUMERALS\_EXT](FeatureConstructor.md#locale_numerals_ext)
- [LOCATION](FeatureConstructor.md#location)
- [NAME](FeatureConstructor.md#name)
- [NODECONSTRUCTOR](FeatureConstructor.md#nodeconstructor)
- [NODE\_0\_10](FeatureConstructor.md#node_0_10)
- [NODE\_0\_12](FeatureConstructor.md#node_0_12)
- [NODE\_10](FeatureConstructor.md#node_10)
- [NODE\_11](FeatureConstructor.md#node_11)
- [NODE\_12](FeatureConstructor.md#node_12)
- [NODE\_13](FeatureConstructor.md#node_13)
- [NODE\_15](FeatureConstructor.md#node_15)
- [NODE\_16\_0](FeatureConstructor.md#node_16_0)
- [NODE\_16\_6](FeatureConstructor.md#node_16_6)
- [NODE\_4](FeatureConstructor.md#node_4)
- [NODE\_5](FeatureConstructor.md#node_5)
- [NO\_FF\_SRC](FeatureConstructor.md#no_ff_src)
- [NO\_IE\_SRC](FeatureConstructor.md#no_ie_src)
- [NO\_OLD\_SAFARI\_ARRAY\_ITERATOR](FeatureConstructor.md#no_old_safari_array_iterator)
- [NO\_V8\_SRC](FeatureConstructor.md#no_v8_src)
- [OBJECT\_L\_LOCATION\_CTOR](FeatureConstructor.md#object_l_location_ctor)
- [OBJECT\_UNDEFINED](FeatureConstructor.md#object_undefined)
- [OBJECT\_W\_CTOR](FeatureConstructor.md#object_w_ctor)
- [OLD\_SAFARI\_LOCATION\_CTOR](FeatureConstructor.md#old_safari_location_ctor)
- [PLAIN\_INTL](FeatureConstructor.md#plain_intl)
- [REGEXP\_STRING\_ITERATOR](FeatureConstructor.md#regexp_string_iterator)
- [SAFARI](FeatureConstructor.md#safari)
- [SAFARI\_10](FeatureConstructor.md#safari_10)
- [SAFARI\_12](FeatureConstructor.md#safari_12)
- [SAFARI\_13](FeatureConstructor.md#safari_13)
- [SAFARI\_14\_0\_1](FeatureConstructor.md#safari_14_0_1)
- [SAFARI\_14\_1](FeatureConstructor.md#safari_14_1)
- [SAFARI\_7\_0](FeatureConstructor.md#safari_7_0)
- [SAFARI\_7\_1](FeatureConstructor.md#safari_7_1)
- [SAFARI\_8](FeatureConstructor.md#safari_8)
- [SAFARI\_9](FeatureConstructor.md#safari_9)
- [SELF](FeatureConstructor.md#self)
- [SELF\_OBJ](FeatureConstructor.md#self_obj)
- [SHORT\_LOCALES](FeatureConstructor.md#short_locales)
- [STATUS](FeatureConstructor.md#status)
- [UNDEFINED](FeatureConstructor.md#undefined)
- [V8\_SRC](FeatureConstructor.md#v8_src)
- [WINDOW](FeatureConstructor.md#window)

### Methods

- [areCompatible](FeatureConstructor.md#arecompatible)
- [areEqual](FeatureConstructor.md#areequal)
- [commonOf](FeatureConstructor.md#commonof)
- [descriptionFor](FeatureConstructor.md#descriptionfor)

## Constructors

### constructor

• **new FeatureConstructor**(...`features`)

Creates a new feature object from the union of the specified features.

The constructor can be used with or without the `new` operator, e.g.
`new JScrewIt.Feature(feature1, feature2)` or `JScrewIt.Feature(feature1, feature2)`.
If no arguments are specified, the new feature object will be equivalent to
<code>[DEFAULT](FeatureConstructor.md#default)</code>.

**`example`**

The following statements are equivalent, and will all construct a new feature object
including both <code>[ANY_DOCUMENT](FeatureConstructor.md#any_document)</code> and <code>[ANY_WINDOW](FeatureConstructor.md#any_window)</code>.

```js
JScrewIt.Feature("ANY_DOCUMENT", "ANY_WINDOW");
```

```js
JScrewIt.Feature(JScrewIt.Feature.ANY_DOCUMENT, JScrewIt.Feature.ANY_WINDOW);
```

```js
JScrewIt.Feature([JScrewIt.Feature.ANY_DOCUMENT, JScrewIt.Feature.ANY_WINDOW]);
```

**`throws`**

An error is thrown if any of the specified features are not mutually compatible.

#### Parameters

| Name | Type |
| :------ | :------ |
| `...features` | [`FeatureElementOrCompatibleArray`](../README.md#featureelementorcompatiblearray)[] |

#### Inherited from

FeatureAll.constructor

## Properties

### ALL

• `Readonly` **ALL**: [`FeatureAll`](FeatureAll.md)

An immutable mapping of all predefined feature objects accessed by name or alias.

**`example`**

This will produce an array with the names and aliases of all predefined features.

```js
Object.keys(JScrewIt.Feature.ALL)
```

This will determine if a particular feature object is predefined or not.

```js
featureObj === JScrewIt.Feature.ALL[featureObj.name]
```

___

### ANDRO\_4\_0

• **ANDRO\_4\_0**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Android Browser 4.0.

#### Inherited from

[FeatureAll](FeatureAll.md).[ANDRO_4_0](FeatureAll.md#andro_4_0)

___

### ANDRO\_4\_1

• **ANDRO\_4\_1**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Android Browser 4.1 to 4.3.

#### Inherited from

[FeatureAll](FeatureAll.md).[ANDRO_4_1](FeatureAll.md#andro_4_1)

___

### ANDRO\_4\_4

• **ANDRO\_4\_4**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Android Browser 4.4.

#### Inherited from

[FeatureAll](FeatureAll.md).[ANDRO_4_4](FeatureAll.md#andro_4_4)

___

### ANY\_DOCUMENT

• **ANY\_DOCUMENT**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object document whose string representation starts with "\[object " and ends with "Document\]".

**`remarks`**

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser. This feature is not available inside web workers.

#### Inherited from

[FeatureAll](FeatureAll.md).[ANY_DOCUMENT](FeatureAll.md#any_document)

___

### ANY\_WINDOW

• **ANY\_WINDOW**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object self whose string representation starts with "\[object " and ends with "Window\]".

**`remarks`**

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser. This feature is not available inside web workers.

#### Inherited from

[FeatureAll](FeatureAll.md).[ANY_WINDOW](FeatureAll.md#any_window)

___

### ARRAY\_ITERATOR

• **ARRAY\_ITERATOR**: [`ElementaryFeature`](ElementaryFeature.md)

The property that the string representation of Array.prototype.entries\(\) starts with "\[object Array" and ends with "\]" at index 21 or 22.

**`remarks`**

Available in Chrome, Edge, Firefox, Safari 7.1+, Opera, and Node.js 0.12+.

#### Inherited from

[FeatureAll](FeatureAll.md).[ARRAY_ITERATOR](FeatureAll.md#array_iterator)

___

### ARROW

• **ARROW**: [`ElementaryFeature`](ElementaryFeature.md)

Support for arrow functions.

**`remarks`**

Available in Chrome, Edge, Firefox, Safari 10+, Opera, and Node.js 4+.

#### Inherited from

[FeatureAll](FeatureAll.md).[ARROW](FeatureAll.md#arrow)

___

### AT

• **AT**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the native function Array.prototype.at.

**`remarks`**

Available in Chrome 92+, Edge 92+, Firefox 90+, Opera 78+, and Node.js 16.6+.

#### Inherited from

[FeatureAll](FeatureAll.md).[AT](FeatureAll.md#at)

___

### ATOB

• **ATOB**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global functions atob and btoa.

**`remarks`**

Available in Chrome, Edge, Firefox, Internet Explorer 10+, Safari, Opera, Android Browser, and Node.js 16.0+. This feature is not available inside web workers in Safari before 10.

#### Inherited from

[FeatureAll](FeatureAll.md).[ATOB](FeatureAll.md#atob)

___

### AUTO

• **AUTO**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in the current engine.

#### Inherited from

[FeatureAll](FeatureAll.md).[AUTO](FeatureAll.md#auto)

___

### BARPROP

• **BARPROP**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object statusbar having the string representation "\[object BarProp\]".

**`remarks`**

Available in Chrome, Edge, Firefox, Safari, Opera, and Android Browser 4.4. This feature is not available inside web workers.

#### Inherited from

[FeatureAll](FeatureAll.md).[BARPROP](FeatureAll.md#barprop)

___

### BROWSER

• **BROWSER**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in all browsers.

No support for Node.js.

#### Inherited from

[FeatureAll](FeatureAll.md).[BROWSER](FeatureAll.md#browser)

___

### CAPITAL\_HTML

• **CAPITAL\_HTML**: [`ElementaryFeature`](ElementaryFeature.md)

The property that the various string methods returning HTML code such as String.prototype.big or String.prototype.link have both the tag name and attributes written in capital letters.

**`remarks`**

Available in Internet Explorer.

#### Inherited from

[FeatureAll](FeatureAll.md).[CAPITAL_HTML](FeatureAll.md#capital_html)

___

### CHROME

• **CHROME**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in the current stable versions of Chrome, Edge and Opera.

An alias for `CHROME_92`.

#### Inherited from

[FeatureAll](FeatureAll.md).[CHROME](FeatureAll.md#chrome)

___

### CHROME\_86

• **CHROME\_86**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Chrome 86 to 91, Edge 86 to 91 and Opera 72 to 77.

**`remarks`**

This feature may be replaced or removed in the near future when current browser versions become obsolete. Use `CHROME_PREV` instead of `CHROME_86` for long term support.

**`see`**

[Engine Support Policy](https://github.com/fasttime/JScrewIt#engine-support-policy)

#### Inherited from

[FeatureAll](FeatureAll.md).[CHROME_86](FeatureAll.md#chrome_86)

___

### CHROME\_92

• **CHROME\_92**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Chrome 92, Edge 92 and Opera 78 or later.

**`remarks`**

This feature may be replaced or removed in the near future when current browser versions become obsolete. Use `CHROME` instead of `CHROME_92` for long term support.

**`see`**

[Engine Support Policy](https://github.com/fasttime/JScrewIt#engine-support-policy)

#### Inherited from

[FeatureAll](FeatureAll.md).[CHROME_92](FeatureAll.md#chrome_92)

___

### CHROME\_PREV

• **CHROME\_PREV**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in the previous to current versions of Chrome and Edge.

An alias for `CHROME_86`.

#### Inherited from

[FeatureAll](FeatureAll.md).[CHROME_PREV](FeatureAll.md#chrome_prev)

___

### COMPACT

• **COMPACT**: [`PredefinedFeature`](PredefinedFeature.md)

All new browsers' features.

No support for Node.js and older browsers like Internet Explorer, Safari 9 or Android Browser.

#### Inherited from

[FeatureAll](FeatureAll.md).[COMPACT](FeatureAll.md#compact)

___

### CONSOLE

• **CONSOLE**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object console having the string representation "\[object Console\]".

This feature may become unavailable when certain browser extensions are active.

**`remarks`**

Available in Internet Explorer 10+, Safari before 14.1, and Android Browser. This feature is not available inside web workers in Safari before 7.1 and Android Browser 4.4.

#### Inherited from

[FeatureAll](FeatureAll.md).[CONSOLE](FeatureAll.md#console)

___

### DEFAULT

• **DEFAULT**: [`PredefinedFeature`](PredefinedFeature.md)

Minimum feature level, compatible with all supported engines in all environments.

#### Inherited from

[FeatureAll](FeatureAll.md).[DEFAULT](FeatureAll.md#default)

___

### DOCUMENT

• **DOCUMENT**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object document having the string representation "\[object Document\]".

**`remarks`**

Available in Internet Explorer before 11. This feature is not available inside web workers.

#### Inherited from

[FeatureAll](FeatureAll.md).[DOCUMENT](FeatureAll.md#document)

___

### DOMWINDOW

• **DOMWINDOW**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object self having the string representation "\[object DOMWindow\]".

**`remarks`**

Available in Android Browser before 4.4. This feature is not available inside web workers.

#### Inherited from

[FeatureAll](FeatureAll.md).[DOMWINDOW](FeatureAll.md#domwindow)

___

### ELEMENTARY

• `Readonly` **ELEMENTARY**: readonly [`ElementaryFeature`](ElementaryFeature.md)[]

An immutable array of all elementary feature objects ordered by name.

___

### ESC\_HTML\_ALL

• **ESC\_HTML\_ALL**: [`ElementaryFeature`](ElementaryFeature.md)

The property that double quotation mark, less than and greater than characters in the argument of String.prototype.fontcolor are escaped into their respective HTML entities.

**`remarks`**

Available in Android Browser and Node.js before 0.12.

#### Inherited from

[FeatureAll](FeatureAll.md).[ESC_HTML_ALL](FeatureAll.md#esc_html_all)

___

### ESC\_HTML\_QUOT

• **ESC\_HTML\_QUOT**: [`ElementaryFeature`](ElementaryFeature.md)

The property that double quotation marks in the argument of String.prototype.fontcolor are escaped as "\&quot;".

**`remarks`**

Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser, and Node.js.

#### Inherited from

[FeatureAll](FeatureAll.md).[ESC_HTML_QUOT](FeatureAll.md#esc_html_quot)

___

### ESC\_HTML\_QUOT\_ONLY

• **ESC\_HTML\_QUOT\_ONLY**: [`ElementaryFeature`](ElementaryFeature.md)

The property that only double quotation marks and no other characters in the argument of String.prototype.fontcolor are escaped into HTML entities.

**`remarks`**

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js 0.12+.

#### Inherited from

[FeatureAll](FeatureAll.md).[ESC_HTML_QUOT_ONLY](FeatureAll.md#esc_html_quot_only)

___

### ESC\_REGEXP\_LF

• **ESC\_REGEXP\_LF**: [`ElementaryFeature`](ElementaryFeature.md)

Having regular expressions created with the RegExp constructor use escape sequences starting with a backslash to format line feed characters \("\\n"\) in their string representation.

**`remarks`**

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Node.js 12+.

#### Inherited from

[FeatureAll](FeatureAll.md).[ESC_REGEXP_LF](FeatureAll.md#esc_regexp_lf)

___

### ESC\_REGEXP\_SLASH

• **ESC\_REGEXP\_SLASH**: [`ElementaryFeature`](ElementaryFeature.md)

Having regular expressions created with the RegExp constructor use escape sequences starting with a backslash to format slashes \("/"\) in their string representation.

**`remarks`**

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Node.js 4+.

#### Inherited from

[FeatureAll](FeatureAll.md).[ESC_REGEXP_SLASH](FeatureAll.md#esc_regexp_slash)

___

### FF

• **FF**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in the current stable version of Firefox.

An alias for `FF_90`.

#### Inherited from

[FeatureAll](FeatureAll.md).[FF](FeatureAll.md#ff)

___

### FF\_78

• **FF\_78**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Firefox 78 to 82.

**`remarks`**

This feature may be replaced or removed in the near future when current browser versions become obsolete. Use `FF_ESR` instead of `FF_78` for long term support.

**`see`**

[Engine Support Policy](https://github.com/fasttime/JScrewIt#engine-support-policy)

#### Inherited from

[FeatureAll](FeatureAll.md).[FF_78](FeatureAll.md#ff_78)

___

### FF\_83

• **FF\_83**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Firefox 83 to 89.

**`remarks`**

This feature may be replaced or removed in the near future when current browser versions become obsolete. Use `FF_PREV` instead of `FF_83` for long term support.

**`see`**

[Engine Support Policy](https://github.com/fasttime/JScrewIt#engine-support-policy)

#### Inherited from

[FeatureAll](FeatureAll.md).[FF_83](FeatureAll.md#ff_83)

___

### FF\_90

• **FF\_90**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Firefox 90 or later.

**`remarks`**

This feature may be replaced or removed in the near future when current browser versions become obsolete. Use `FF` instead of `FF_90` for long term support.

**`see`**

[Engine Support Policy](https://github.com/fasttime/JScrewIt#engine-support-policy)

#### Inherited from

[FeatureAll](FeatureAll.md).[FF_90](FeatureAll.md#ff_90)

___

### FF\_ESR

• **FF\_ESR**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in the current version of Firefox ESR.

An alias for `FF_78`.

#### Inherited from

[FeatureAll](FeatureAll.md).[FF_ESR](FeatureAll.md#ff_esr)

___

### FF\_PREV

• **FF\_PREV**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in the previous to current version of Firefox.

An alias for `FF_83`.

#### Inherited from

[FeatureAll](FeatureAll.md).[FF_PREV](FeatureAll.md#ff_prev)

___

### FF\_SRC

• **FF\_SRC**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of native functions typical for Firefox and Safari.

Remarkable traits are the lack of line feed characters at the beginning and at the end of the string and the presence of a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.

**`remarks`**

Available in Firefox and Safari.

#### Inherited from

[FeatureAll](FeatureAll.md).[FF_SRC](FeatureAll.md#ff_src)

___

### FILL

• **FILL**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the native function Array.prototype.fill.

**`remarks`**

Available in Chrome, Edge, Firefox, Safari 7.1+, Opera, and Node.js 4+.

#### Inherited from

[FeatureAll](FeatureAll.md).[FILL](FeatureAll.md#fill)

___

### FLAT

• **FLAT**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the native function Array.prototype.flat.

**`remarks`**

Available in Chrome, Edge, Firefox, Safari 12+, Opera, and Node.js 11+.

#### Inherited from

[FeatureAll](FeatureAll.md).[FLAT](FeatureAll.md#flat)

___

### FROM\_CODE\_POINT

• **FROM\_CODE\_POINT**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the function String.fromCodePoint.

**`remarks`**

Available in Chrome, Edge, Firefox, Safari 9+, Opera, and Node.js 4+.

#### Inherited from

[FeatureAll](FeatureAll.md).[FROM_CODE_POINT](FeatureAll.md#from_code_point)

___

### FUNCTION\_19\_LF

• **FUNCTION\_19\_LF**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of dynamically generated functions where the character at index 19 is a line feed \("\\n"\).

**`remarks`**

Available in Chrome, Edge, Firefox, Opera, and Node.js 10+.

#### Inherited from

[FeatureAll](FeatureAll.md).[FUNCTION_19_LF](FeatureAll.md#function_19_lf)

___

### FUNCTION\_22\_LF

• **FUNCTION\_22\_LF**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of dynamically generated functions where the character at index 22 is a line feed \("\\n"\).

**`remarks`**

Available in Internet Explorer, Safari 9+, Android Browser, and Node.js before 10.

#### Inherited from

[FeatureAll](FeatureAll.md).[FUNCTION_22_LF](FeatureAll.md#function_22_lf)

___

### GENERIC\_ARRAY\_TO\_STRING

• **GENERIC\_ARRAY\_TO\_STRING**: [`ElementaryFeature`](ElementaryFeature.md)

Ability to call Array.prototype.toString with a non-array binding.

**`remarks`**

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, Android Browser 4.1+, and Node.js.

#### Inherited from

[FeatureAll](FeatureAll.md).[GENERIC_ARRAY_TO_STRING](FeatureAll.md#generic_array_to_string)

___

### GLOBAL\_UNDEFINED

• **GLOBAL\_UNDEFINED**: [`ElementaryFeature`](ElementaryFeature.md)

Having the global function toString return the string "\[object Undefined\]" when invoked without a binding.

**`remarks`**

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js.

#### Inherited from

[FeatureAll](FeatureAll.md).[GLOBAL_UNDEFINED](FeatureAll.md#global_undefined)

___

### GMT

• **GMT**: [`ElementaryFeature`](ElementaryFeature.md)

Presence of the text "GMT" after the first 25 characters in the string returned by Date\(\).

The string representation of dates is implementation dependent, but most engines use a similar format, making this feature available in all supported engines except Internet Explorer 9 and 10.

**`remarks`**

Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari, Opera, Android Browser, and Node.js.

#### Inherited from

[FeatureAll](FeatureAll.md).[GMT](FeatureAll.md#gmt)

___

### HISTORY

• **HISTORY**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object history having the string representation "\[object History\]".

**`remarks`**

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser. This feature is not available inside web workers.

#### Inherited from

[FeatureAll](FeatureAll.md).[HISTORY](FeatureAll.md#history)

___

### HTMLAUDIOELEMENT

• **HTMLAUDIOELEMENT**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object Audio whose string representation starts with "function HTMLAudioElement".

**`remarks`**

Available in Android Browser 4.4. This feature is not available inside web workers.

#### Inherited from

[FeatureAll](FeatureAll.md).[HTMLAUDIOELEMENT](FeatureAll.md#htmlaudioelement)

___

### HTMLDOCUMENT

• **HTMLDOCUMENT**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object document having the string representation "\[object HTMLDocument\]".

**`remarks`**

Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari, Opera, and Android Browser. This feature is not available inside web workers.

#### Inherited from

[FeatureAll](FeatureAll.md).[HTMLDOCUMENT](FeatureAll.md#htmldocument)

___

### IE\_10

• **IE\_10**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Internet Explorer 10.

#### Inherited from

[FeatureAll](FeatureAll.md).[IE_10](FeatureAll.md#ie_10)

___

### IE\_11

• **IE\_11**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Internet Explorer 11.

#### Inherited from

[FeatureAll](FeatureAll.md).[IE_11](FeatureAll.md#ie_11)

___

### IE\_11\_WIN\_10

• **IE\_11\_WIN\_10**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Internet Explorer 11 on Windows 10.

#### Inherited from

[FeatureAll](FeatureAll.md).[IE_11_WIN_10](FeatureAll.md#ie_11_win_10)

___

### IE\_9

• **IE\_9**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Internet Explorer 9.

#### Inherited from

[FeatureAll](FeatureAll.md).[IE_9](FeatureAll.md#ie_9)

___

### IE\_SRC

• **IE\_SRC**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of native functions typical for Internet Explorer.

Remarkable traits are the presence of a line feed character \("\\n"\) at the beginning and at the end of the string and a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.

**`remarks`**

Available in Internet Explorer.

#### Inherited from

[FeatureAll](FeatureAll.md).[IE_SRC](FeatureAll.md#ie_src)

___

### INCR\_CHAR

• **INCR\_CHAR**: [`ElementaryFeature`](ElementaryFeature.md)

The ability to use unary increment operators with string characters, like in \( ++"some string"\[0\] \): this will result in a TypeError in strict mode in ECMAScript compliant engines.

**`remarks`**

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, Android Browser, and Node.js. This feature is not available when strict mode is enforced in Chrome, Edge, Firefox, Internet Explorer 10+, Safari, Opera, and Node.js 5+.

#### Inherited from

[FeatureAll](FeatureAll.md).[INCR_CHAR](FeatureAll.md#incr_char)

___

### INTL

• **INTL**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object Intl.

**`remarks`**

Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari 10+, Opera, Android Browser 4.4, and Node.js 0.12+.

#### Inherited from

[FeatureAll](FeatureAll.md).[INTL](FeatureAll.md#intl)

___

### LOCALE\_INFINITY

• **LOCALE\_INFINITY**: [`ElementaryFeature`](ElementaryFeature.md)

Language sensitive string representation of Infinity as "∞".

**`remarks`**

Available in Chrome, Edge, Firefox, Internet Explorer 11 on Windows 10, Safari 10+, Opera, Android Browser 4.4, and Node.js 0.12+.

#### Inherited from

[FeatureAll](FeatureAll.md).[LOCALE_INFINITY](FeatureAll.md#locale_infinity)

___

### LOCALE\_NUMERALS

• **LOCALE\_NUMERALS**: [`ElementaryFeature`](ElementaryFeature.md)

Features shared by all engines capable of localized number formatting, including output of Arabic digits, the Arabic decimal separator "٫", the letters in the first word of the Arabic string representation of NaN \("ليس"\), Persian digits and the Persian digit group separator "٬".

**`remarks`**

Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari 10+, Opera, Android Browser 4.4, and Node.js 13+.

#### Inherited from

[FeatureAll](FeatureAll.md).[LOCALE_NUMERALS](FeatureAll.md#locale_numerals)

___

### LOCALE\_NUMERALS\_EXT

• **LOCALE\_NUMERALS\_EXT**: [`ElementaryFeature`](ElementaryFeature.md)

Extended localized number formatting.

This includes all features of LOCALE_NUMERALS plus the output of the first three letters in the second word of the Arabic string representation of NaN \("رقم"\), Bengali digits, the letters in the Russian string representation of NaN \("не число"\) and the letters in the Persian string representation of NaN \("ناعدد"\).

**`remarks`**

Available in Chrome, Edge, Firefox, Internet Explorer 11 on Windows 10, Safari 10+, Opera, Android Browser 4.4, and Node.js 13+.

#### Inherited from

[FeatureAll](FeatureAll.md).[LOCALE_NUMERALS_EXT](FeatureAll.md#locale_numerals_ext)

___

### LOCATION

• **LOCATION**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object location with the property that Object.prototype.toString.call\(location\) evaluates to a string that starts with "\[object " and ends with "Location\]".

**`remarks`**

Available in Chrome, Edge, Firefox, Safari, Opera, and Android Browser.

#### Inherited from

[FeatureAll](FeatureAll.md).[LOCATION](FeatureAll.md#location)

___

### NAME

• **NAME**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the name property for functions.

**`remarks`**

Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser, and Node.js.

#### Inherited from

[FeatureAll](FeatureAll.md).[NAME](FeatureAll.md#name)

___

### NODECONSTRUCTOR

• **NODECONSTRUCTOR**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object Node having the string representation "\[object NodeConstructor\]".

**`remarks`**

Available in Safari before 10. This feature is not available inside web workers.

#### Inherited from

[FeatureAll](FeatureAll.md).[NODECONSTRUCTOR](FeatureAll.md#nodeconstructor)

___

### NODE\_0\_10

• **NODE\_0\_10**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 0.10.

#### Inherited from

[FeatureAll](FeatureAll.md).[NODE_0_10](FeatureAll.md#node_0_10)

___

### NODE\_0\_12

• **NODE\_0\_12**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 0.12.

#### Inherited from

[FeatureAll](FeatureAll.md).[NODE_0_12](FeatureAll.md#node_0_12)

___

### NODE\_10

• **NODE\_10**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 10.

#### Inherited from

[FeatureAll](FeatureAll.md).[NODE_10](FeatureAll.md#node_10)

___

### NODE\_11

• **NODE\_11**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 11.

#### Inherited from

[FeatureAll](FeatureAll.md).[NODE_11](FeatureAll.md#node_11)

___

### NODE\_12

• **NODE\_12**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 12.

#### Inherited from

[FeatureAll](FeatureAll.md).[NODE_12](FeatureAll.md#node_12)

___

### NODE\_13

• **NODE\_13**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 13 and Node.js 14.

#### Inherited from

[FeatureAll](FeatureAll.md).[NODE_13](FeatureAll.md#node_13)

___

### NODE\_15

• **NODE\_15**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 15.

#### Inherited from

[FeatureAll](FeatureAll.md).[NODE_15](FeatureAll.md#node_15)

___

### NODE\_16\_0

• **NODE\_16\_0**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 16.0 to 16.5.

#### Inherited from

[FeatureAll](FeatureAll.md).[NODE_16_0](FeatureAll.md#node_16_0)

___

### NODE\_16\_6

• **NODE\_16\_6**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 16.6 or later.

#### Inherited from

[FeatureAll](FeatureAll.md).[NODE_16_6](FeatureAll.md#node_16_6)

___

### NODE\_4

• **NODE\_4**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 4.

#### Inherited from

[FeatureAll](FeatureAll.md).[NODE_4](FeatureAll.md#node_4)

___

### NODE\_5

• **NODE\_5**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 5 to 9.

#### Inherited from

[FeatureAll](FeatureAll.md).[NODE_5](FeatureAll.md#node_5)

___

### NO\_FF\_SRC

• **NO\_FF\_SRC**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of native functions typical for V8 or for Internet Explorer but not for Firefox and Safari.

**`remarks`**

Available in Chrome, Edge, Internet Explorer, Opera, Android Browser, and Node.js.

#### Inherited from

[FeatureAll](FeatureAll.md).[NO_FF_SRC](FeatureAll.md#no_ff_src)

___

### NO\_IE\_SRC

• **NO\_IE\_SRC**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of native functions typical for most engines with the notable exception of Internet Explorer.

A remarkable trait of this feature is the lack of line feed characters at the beginning and at the end of the string.

**`remarks`**

Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser, and Node.js.

#### Inherited from

[FeatureAll](FeatureAll.md).[NO_IE_SRC](FeatureAll.md#no_ie_src)

___

### NO\_OLD\_SAFARI\_ARRAY\_ITERATOR

• **NO\_OLD\_SAFARI\_ARRAY\_ITERATOR**: [`ElementaryFeature`](ElementaryFeature.md)

The property that the string representation of Array.prototype.entries\(\) evaluates to "\[object Array Iterator\]" and that Array.prototype.entries\(\).constructor is the global function Object.

**`remarks`**

Available in Chrome, Edge, Firefox, Safari 9+, Opera, and Node.js 0.12+.

#### Inherited from

[FeatureAll](FeatureAll.md).[NO_OLD_SAFARI_ARRAY_ITERATOR](FeatureAll.md#no_old_safari_array_iterator)

___

### NO\_V8\_SRC

• **NO\_V8\_SRC**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of native functions typical for Firefox, Internet Explorer and Safari.

A most remarkable trait of this feature is the presence of a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.

**`remarks`**

Available in Firefox, Internet Explorer, and Safari.

#### Inherited from

[FeatureAll](FeatureAll.md).[NO_V8_SRC](FeatureAll.md#no_v8_src)

___

### OBJECT\_L\_LOCATION\_CTOR

• **OBJECT\_L\_LOCATION\_CTOR**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global function location.constructor whose string representation starts with "\[object L"

**`remarks`**

Available in Internet Explorer and Safari before 10. This feature is not available inside web workers.

#### Inherited from

[FeatureAll](FeatureAll.md).[OBJECT_L_LOCATION_CTOR](FeatureAll.md#object_l_location_ctor)

___

### OBJECT\_UNDEFINED

• **OBJECT\_UNDEFINED**: [`ElementaryFeature`](ElementaryFeature.md)

Having the function Object.prototype.toString return the string "\[object Undefined\]" when invoked without a binding.

**`remarks`**

Available in Chrome, Edge, Firefox, Internet Explorer 10+, Safari, Opera, Android Browser 4.1+, and Node.js.

#### Inherited from

[FeatureAll](FeatureAll.md).[OBJECT_UNDEFINED](FeatureAll.md#object_undefined)

___

### OBJECT\_W\_CTOR

• **OBJECT\_W\_CTOR**: [`ElementaryFeature`](ElementaryFeature.md)

The property that the string representation of the global object constructor starts with "\[object W"

**`remarks`**

Available in Internet Explorer and Safari before 10. This feature is not available inside web workers in Safari before 10.

#### Inherited from

[FeatureAll](FeatureAll.md).[OBJECT_W_CTOR](FeatureAll.md#object_w_ctor)

___

### OLD\_SAFARI\_LOCATION\_CTOR

• **OLD\_SAFARI\_LOCATION\_CTOR**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object location.constructor whose string representation starts with "\[object " and ends with "LocationConstructor\]"

**`remarks`**

Available in Safari before 10.

#### Inherited from

[FeatureAll](FeatureAll.md).[OLD_SAFARI_LOCATION_CTOR](FeatureAll.md#old_safari_location_ctor)

___

### PLAIN\_INTL

• **PLAIN\_INTL**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object Intl having the string representation "\[object Object\]"

**`remarks`**

Available in Firefox before 83, Internet Explorer 11, Safari 10+ before 14.0.1, Android Browser 4.4, and Node.js 0.12+ before 15.

#### Inherited from

[FeatureAll](FeatureAll.md).[PLAIN_INTL](FeatureAll.md#plain_intl)

___

### REGEXP\_STRING\_ITERATOR

• **REGEXP\_STRING\_ITERATOR**: [`ElementaryFeature`](ElementaryFeature.md)

The property that the string representation of String.prototype.matchAll\(\) evaluates to "\[object RegExp String Iterator\]".

**`remarks`**

Available in Chrome, Edge, Firefox, Safari 13+, Opera, and Node.js 12+.

#### Inherited from

[FeatureAll](FeatureAll.md).[REGEXP_STRING_ITERATOR](FeatureAll.md#regexp_string_iterator)

___

### SAFARI

• **SAFARI**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in the current stable version of Safari.

An alias for `SAFARI_14_1`.

#### Inherited from

[FeatureAll](FeatureAll.md).[SAFARI](FeatureAll.md#safari)

___

### SAFARI\_10

• **SAFARI\_10**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 10 and Safari 11.

#### Inherited from

[FeatureAll](FeatureAll.md).[SAFARI_10](FeatureAll.md#safari_10)

___

### SAFARI\_12

• **SAFARI\_12**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 12.

#### Inherited from

[FeatureAll](FeatureAll.md).[SAFARI_12](FeatureAll.md#safari_12)

___

### SAFARI\_13

• **SAFARI\_13**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 13 and Safari 14.0.0.

#### Inherited from

[FeatureAll](FeatureAll.md).[SAFARI_13](FeatureAll.md#safari_13)

___

### SAFARI\_14\_0\_1

• **SAFARI\_14\_0\_1**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 14.0.1 to 14.0.3.

#### Inherited from

[FeatureAll](FeatureAll.md).[SAFARI_14_0_1](FeatureAll.md#safari_14_0_1)

___

### SAFARI\_14\_1

• **SAFARI\_14\_1**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 14.1 or later.

#### Inherited from

[FeatureAll](FeatureAll.md).[SAFARI_14_1](FeatureAll.md#safari_14_1)

___

### SAFARI\_7\_0

• **SAFARI\_7\_0**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 7.0.

#### Inherited from

[FeatureAll](FeatureAll.md).[SAFARI_7_0](FeatureAll.md#safari_7_0)

___

### SAFARI\_7\_1

• **SAFARI\_7\_1**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 7.1 and Safari 8.

#### Inherited from

[FeatureAll](FeatureAll.md).[SAFARI_7_1](FeatureAll.md#safari_7_1)

___

### SAFARI\_8

• **SAFARI\_8**: [`PredefinedFeature`](PredefinedFeature.md)

An alias for `SAFARI_7_1`.

#### Inherited from

[FeatureAll](FeatureAll.md).[SAFARI_8](FeatureAll.md#safari_8)

___

### SAFARI\_9

• **SAFARI\_9**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 9.

#### Inherited from

[FeatureAll](FeatureAll.md).[SAFARI_9](FeatureAll.md#safari_9)

___

### SELF

• **SELF**: [`ElementaryFeature`](ElementaryFeature.md)

An alias for `ANY_WINDOW`.

#### Inherited from

[FeatureAll](FeatureAll.md).[SELF](FeatureAll.md#self)

___

### SELF\_OBJ

• **SELF\_OBJ**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object self whose string representation starts with "\[object ".

**`remarks`**

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser. This feature is not available inside web workers in Safari 7.1+ before 10.

#### Inherited from

[FeatureAll](FeatureAll.md).[SELF_OBJ](FeatureAll.md#self_obj)

___

### SHORT\_LOCALES

• **SHORT\_LOCALES**: [`ElementaryFeature`](ElementaryFeature.md)

Support for the two-letter locale name "ar" to format decimal numbers as Arabic numerals.

**`remarks`**

Available in Firefox, Internet Explorer 11, Safari 10+, Android Browser 4.4, and Node.js 13+.

#### Inherited from

[FeatureAll](FeatureAll.md).[SHORT_LOCALES](FeatureAll.md#short_locales)

___

### STATUS

• **STATUS**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global string status.

**`remarks`**

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser. This feature is not available inside web workers.

#### Inherited from

[FeatureAll](FeatureAll.md).[STATUS](FeatureAll.md#status)

___

### UNDEFINED

• **UNDEFINED**: [`ElementaryFeature`](ElementaryFeature.md)

The property that Object.prototype.toString.call\(\) evaluates to "\[object Undefined\]".

This behavior is specified by ECMAScript, and is enforced by all engines except Android Browser versions prior to 4.1.2, where this feature is not available.

**`remarks`**

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, Android Browser 4.1+, and Node.js.

#### Inherited from

[FeatureAll](FeatureAll.md).[UNDEFINED](FeatureAll.md#undefined)

___

### V8\_SRC

• **V8\_SRC**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of native functions typical for the V8 engine.

Remarkable traits are the lack of line feed characters at the beginning and at the end of the string and the presence of a single whitespace before the "\[native code\]" sequence.

**`remarks`**

Available in Chrome, Edge, Opera, Android Browser, and Node.js.

#### Inherited from

[FeatureAll](FeatureAll.md).[V8_SRC](FeatureAll.md#v8_src)

___

### WINDOW

• **WINDOW**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object self having the string representation "\[object Window\]".

**`remarks`**

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser 4.4. This feature is not available inside web workers.

#### Inherited from

[FeatureAll](FeatureAll.md).[WINDOW](FeatureAll.md#window)

## Methods

### areCompatible

▸ **areCompatible**(...`features`): `boolean`

Determines whether the specified features are mutually compatible.

**`example`**

```js
// false: only one of "V8_SRC" or "IE_SRC" may be available.
JScrewIt.Feature.areCompatible("V8_SRC", "IE_SRC")
```

```js
// true
JScrewIt.Feature.areCompatible(JScrewIt.Feature.DEFAULT, JScrewIt.Feature.FILL)
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `...features` | [`FeatureElement`](../README.md#featureelement)[] |

#### Returns

`boolean`

`true` if the specified features are mutually compatible; otherwise, `false`.
If less than two features are specified, the return value is `true`.

___

### areEqual

▸ **areEqual**(...`features`): `boolean`

Determines whether all of the specified features are equivalent.

Different features are considered equivalent if they include the same set of elementary
features, regardless of any other difference.

**`example`**

```js
// false
JScrewIt.Feature.areEqual(JScrewIt.Feature.CHROME, JScrewIt.Feature.FF)
```

```js
// true
JScrewIt.Feature.areEqual("DEFAULT", [])
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `...features` | [`FeatureElementOrCompatibleArray`](../README.md#featureelementorcompatiblearray)[] |

#### Returns

`boolean`

`true` if all of the specified features are equivalent; otherwise, `false`.
If less than two arguments are specified, the return value is `true`.

___

### commonOf

▸ **commonOf**(...`features`): ``null`` \| [`CustomFeature`](CustomFeature.md)

Creates a new feature object equivalent to the intersection of the specified features.

**`example`**

This will create a new feature object equivalent to <code>[NAME](FeatureConstructor.md#name)</code>.

```js
const newFeature = JScrewIt.Feature.commonOf(["ATOB", "NAME"], ["NAME", "SELF"]);
```

This will create a new feature object equivalent to <code>[ANY_DOCUMENT](FeatureConstructor.md#any_document)</code>.
This is because both <code>[HTMLDOCUMENT](FeatureConstructor.md#htmldocument)</code> and <code>[DOCUMENT](FeatureConstructor.md#document)</code> imply
<code>[ANY_DOCUMENT](FeatureConstructor.md#any_document)</code>.

```js
const newFeature = JScrewIt.Feature.commonOf("HTMLDOCUMENT", "DOCUMENT");
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `...features` | [`FeatureElementOrCompatibleArray`](../README.md#featureelementorcompatiblearray)[] |

#### Returns

``null`` \| [`CustomFeature`](CustomFeature.md)

A feature object, or `null` if no arguments are specified.

___

### descriptionFor

▸ **descriptionFor**(`name`): `string`

Returns a short description of a predefined feature in plain English.

**`remarks`**

Different names or aliases of the same feature may have different descriptions.

**`throws`**

An error is thrown if the specified argument is not a name or alias of a predefined feature.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | keyof [`FeatureAll`](FeatureAll.md) | A name or alias of a predefined feature. |

#### Returns

`string`
