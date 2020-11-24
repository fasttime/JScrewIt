**[JScrewIt](../README.md)**

# Interface: FeatureConstructor

## Hierarchy

* [FeatureAll](_jscrewit_.featureall.md)

  ↳ **FeatureConstructor**

## Callable

▸ (...`features`: ([FeatureElement](../modules/_jscrewit_.md#featureelement) \| [CompatibleFeatureArray](../modules/_jscrewit_.md#compatiblefeaturearray))[]): [CustomFeature](_jscrewit_.customfeature.md)

Creates a new feature object from the union of the specified features.

The constructor can be used with or without the `new` operator, e.g.
`new JScrewIt.Feature(feature1, feature2)` or `JScrewIt.Feature(feature1, feature2)`.
If no arguments are specified, the new feature object will be equivalent to
<code>[DEFAULT](_jscrewit_.featureconstructor.md#default)</code>.

**`example`** 

The following statements are equivalent, and will all construct a new feature object
including both <code>[ANY_DOCUMENT](_jscrewit_.featureconstructor.md#any_document)</code> and <code>[ANY_WINDOW](_jscrewit_.featureconstructor.md#any_window)</code>.

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

#### Parameters:

Name | Type |
------ | ------ |
`...features` | ([FeatureElement](../modules/_jscrewit_.md#featureelement) \| [CompatibleFeatureArray](../modules/_jscrewit_.md#compatiblefeaturearray))[] |

**Returns:** [CustomFeature](_jscrewit_.customfeature.md)

## Index

### Constructors

* [constructor](_jscrewit_.featureconstructor.md#constructor)

### Properties

* [ALL](_jscrewit_.featureconstructor.md#all)
* [ANDRO\_4\_0](_jscrewit_.featureconstructor.md#andro_4_0)
* [ANDRO\_4\_1](_jscrewit_.featureconstructor.md#andro_4_1)
* [ANDRO\_4\_4](_jscrewit_.featureconstructor.md#andro_4_4)
* [ANY\_DOCUMENT](_jscrewit_.featureconstructor.md#any_document)
* [ANY\_WINDOW](_jscrewit_.featureconstructor.md#any_window)
* [ARRAY\_ITERATOR](_jscrewit_.featureconstructor.md#array_iterator)
* [ARROW](_jscrewit_.featureconstructor.md#arrow)
* [ATOB](_jscrewit_.featureconstructor.md#atob)
* [AUTO](_jscrewit_.featureconstructor.md#auto)
* [BARPROP](_jscrewit_.featureconstructor.md#barprop)
* [BROWSER](_jscrewit_.featureconstructor.md#browser)
* [CAPITAL\_HTML](_jscrewit_.featureconstructor.md#capital_html)
* [CHROME](_jscrewit_.featureconstructor.md#chrome)
* [CHROME\_86](_jscrewit_.featureconstructor.md#chrome_86)
* [CHROME\_PREV](_jscrewit_.featureconstructor.md#chrome_prev)
* [COMPACT](_jscrewit_.featureconstructor.md#compact)
* [CONSOLE](_jscrewit_.featureconstructor.md#console)
* [DEFAULT](_jscrewit_.featureconstructor.md#default)
* [DOCUMENT](_jscrewit_.featureconstructor.md#document)
* [DOMWINDOW](_jscrewit_.featureconstructor.md#domwindow)
* [ELEMENTARY](_jscrewit_.featureconstructor.md#elementary)
* [ESC\_HTML\_ALL](_jscrewit_.featureconstructor.md#esc_html_all)
* [ESC\_HTML\_QUOT](_jscrewit_.featureconstructor.md#esc_html_quot)
* [ESC\_HTML\_QUOT\_ONLY](_jscrewit_.featureconstructor.md#esc_html_quot_only)
* [ESC\_REGEXP\_LF](_jscrewit_.featureconstructor.md#esc_regexp_lf)
* [ESC\_REGEXP\_SLASH](_jscrewit_.featureconstructor.md#esc_regexp_slash)
* [EXTERNAL](_jscrewit_.featureconstructor.md#external)
* [FF](_jscrewit_.featureconstructor.md#ff)
* [FF\_78](_jscrewit_.featureconstructor.md#ff_78)
* [FF\_ESR](_jscrewit_.featureconstructor.md#ff_esr)
* [FF\_PREV](_jscrewit_.featureconstructor.md#ff_prev)
* [FF\_SRC](_jscrewit_.featureconstructor.md#ff_src)
* [FILL](_jscrewit_.featureconstructor.md#fill)
* [FLAT](_jscrewit_.featureconstructor.md#flat)
* [FROM\_CODE\_POINT](_jscrewit_.featureconstructor.md#from_code_point)
* [FUNCTION\_19\_LF](_jscrewit_.featureconstructor.md#function_19_lf)
* [FUNCTION\_22\_LF](_jscrewit_.featureconstructor.md#function_22_lf)
* [GLOBAL\_UNDEFINED](_jscrewit_.featureconstructor.md#global_undefined)
* [GMT](_jscrewit_.featureconstructor.md#gmt)
* [HISTORY](_jscrewit_.featureconstructor.md#history)
* [HTMLAUDIOELEMENT](_jscrewit_.featureconstructor.md#htmlaudioelement)
* [HTMLDOCUMENT](_jscrewit_.featureconstructor.md#htmldocument)
* [IE\_10](_jscrewit_.featureconstructor.md#ie_10)
* [IE\_11](_jscrewit_.featureconstructor.md#ie_11)
* [IE\_11\_WIN\_10](_jscrewit_.featureconstructor.md#ie_11_win_10)
* [IE\_9](_jscrewit_.featureconstructor.md#ie_9)
* [IE\_SRC](_jscrewit_.featureconstructor.md#ie_src)
* [INCR\_CHAR](_jscrewit_.featureconstructor.md#incr_char)
* [INTL](_jscrewit_.featureconstructor.md#intl)
* [LOCALE\_INFINITY](_jscrewit_.featureconstructor.md#locale_infinity)
* [LOCALE\_NUMERALS](_jscrewit_.featureconstructor.md#locale_numerals)
* [NAME](_jscrewit_.featureconstructor.md#name)
* [NODECONSTRUCTOR](_jscrewit_.featureconstructor.md#nodeconstructor)
* [NODE\_0\_10](_jscrewit_.featureconstructor.md#node_0_10)
* [NODE\_0\_12](_jscrewit_.featureconstructor.md#node_0_12)
* [NODE\_10](_jscrewit_.featureconstructor.md#node_10)
* [NODE\_11](_jscrewit_.featureconstructor.md#node_11)
* [NODE\_12](_jscrewit_.featureconstructor.md#node_12)
* [NODE\_13](_jscrewit_.featureconstructor.md#node_13)
* [NODE\_15](_jscrewit_.featureconstructor.md#node_15)
* [NODE\_4](_jscrewit_.featureconstructor.md#node_4)
* [NODE\_5](_jscrewit_.featureconstructor.md#node_5)
* [NO\_FF\_SRC](_jscrewit_.featureconstructor.md#no_ff_src)
* [NO\_IE\_SRC](_jscrewit_.featureconstructor.md#no_ie_src)
* [NO\_OLD\_SAFARI\_ARRAY\_ITERATOR](_jscrewit_.featureconstructor.md#no_old_safari_array_iterator)
* [NO\_V8\_SRC](_jscrewit_.featureconstructor.md#no_v8_src)
* [PLAIN\_INTL](_jscrewit_.featureconstructor.md#plain_intl)
* [REGEXP\_STRING\_ITERATOR](_jscrewit_.featureconstructor.md#regexp_string_iterator)
* [SAFARI](_jscrewit_.featureconstructor.md#safari)
* [SAFARI\_10](_jscrewit_.featureconstructor.md#safari_10)
* [SAFARI\_12](_jscrewit_.featureconstructor.md#safari_12)
* [SAFARI\_13](_jscrewit_.featureconstructor.md#safari_13)
* [SAFARI\_14\_0\_1](_jscrewit_.featureconstructor.md#safari_14_0_1)
* [SAFARI\_7\_0](_jscrewit_.featureconstructor.md#safari_7_0)
* [SAFARI\_7\_1](_jscrewit_.featureconstructor.md#safari_7_1)
* [SAFARI\_8](_jscrewit_.featureconstructor.md#safari_8)
* [SAFARI\_9](_jscrewit_.featureconstructor.md#safari_9)
* [SELF](_jscrewit_.featureconstructor.md#self)
* [SELF\_OBJ](_jscrewit_.featureconstructor.md#self_obj)
* [SHORT\_LOCALES](_jscrewit_.featureconstructor.md#short_locales)
* [STATUS](_jscrewit_.featureconstructor.md#status)
* [UNDEFINED](_jscrewit_.featureconstructor.md#undefined)
* [V8\_SRC](_jscrewit_.featureconstructor.md#v8_src)
* [WINDOW](_jscrewit_.featureconstructor.md#window)

### Methods

* [areCompatible](_jscrewit_.featureconstructor.md#arecompatible)
* [areEqual](_jscrewit_.featureconstructor.md#areequal)
* [commonOf](_jscrewit_.featureconstructor.md#commonof)
* [descriptionFor](_jscrewit_.featureconstructor.md#descriptionfor)

## Constructors

### constructor

\+ **new FeatureConstructor**(...`features`: ([FeatureElement](../modules/_jscrewit_.md#featureelement) \| [CompatibleFeatureArray](../modules/_jscrewit_.md#compatiblefeaturearray))[]): [CustomFeature](_jscrewit_.customfeature.md)

Creates a new feature object from the union of the specified features.

The constructor can be used with or without the `new` operator, e.g.
`new JScrewIt.Feature(feature1, feature2)` or `JScrewIt.Feature(feature1, feature2)`.
If no arguments are specified, the new feature object will be equivalent to
<code>[DEFAULT](_jscrewit_.featureconstructor.md#default)</code>.

**`example`** 

The following statements are equivalent, and will all construct a new feature object
including both <code>[ANY_DOCUMENT](_jscrewit_.featureconstructor.md#any_document)</code> and <code>[ANY_WINDOW](_jscrewit_.featureconstructor.md#any_window)</code>.

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

#### Parameters:

Name | Type |
------ | ------ |
`...features` | ([FeatureElement](../modules/_jscrewit_.md#featureelement) \| [CompatibleFeatureArray](../modules/_jscrewit_.md#compatiblefeaturearray))[] |

**Returns:** [CustomFeature](_jscrewit_.customfeature.md)

## Properties

### ALL

• `Readonly` **ALL**: [FeatureAll](_jscrewit_.featureall.md)

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

•  **ANDRO\_4\_0**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ANDRO_4_0](_jscrewit_.featureall.md#andro_4_0)*

Features available in Android Browser 4.0.

___

### ANDRO\_4\_1

•  **ANDRO\_4\_1**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ANDRO_4_1](_jscrewit_.featureall.md#andro_4_1)*

Features available in Android Browser 4.1 to 4.3.

___

### ANDRO\_4\_4

•  **ANDRO\_4\_4**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ANDRO_4_4](_jscrewit_.featureall.md#andro_4_4)*

Features available in Android Browser 4.4.

___

### ANY\_DOCUMENT

•  **ANY\_DOCUMENT**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ANY_DOCUMENT](_jscrewit_.featureall.md#any_document)*

Existence of the global object document whose string representation starts with "\[object " and ends with "Document\]".

**`remarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser. This feature is not available inside web workers.

___

### ANY\_WINDOW

•  **ANY\_WINDOW**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ANY_WINDOW](_jscrewit_.featureall.md#any_window)*

Existence of the global object self whose string representation starts with "\[object " and ends with "Window\]".

**`remarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser. This feature is not available inside web workers.

___

### ARRAY\_ITERATOR

•  **ARRAY\_ITERATOR**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ARRAY_ITERATOR](_jscrewit_.featureall.md#array_iterator)*

The property that the string representation of Array.prototype.entries\(\) starts with "\[object Array" and ends with "\]" at index 21 or 22.

**`remarks`** 

Available in Chrome, Edge, Firefox, Safari 7.1+, Opera, and Node.js 0.12+.

___

### ARROW

•  **ARROW**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ARROW](_jscrewit_.featureall.md#arrow)*

Support for arrow functions.

**`remarks`** 

Available in Chrome, Edge, Firefox, Safari 10+, Opera, and Node.js 4+.

___

### ATOB

•  **ATOB**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ATOB](_jscrewit_.featureall.md#atob)*

Existence of the global functions atob and btoa.

**`remarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer 10+, Safari, Opera, and Android Browser. This feature is not available inside web workers in Safari before 10.

___

### AUTO

•  **AUTO**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[AUTO](_jscrewit_.featureall.md#auto)*

All features available in the current engine.

___

### BARPROP

•  **BARPROP**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[BARPROP](_jscrewit_.featureall.md#barprop)*

Existence of the global object statusbar having the string representation "\[object BarProp\]".

**`remarks`** 

Available in Chrome, Edge, Firefox, Safari, Opera, and Android Browser 4.4. This feature is not available inside web workers.

___

### BROWSER

•  **BROWSER**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[BROWSER](_jscrewit_.featureall.md#browser)*

Features available in all browsers.

No support for Node.js.

___

### CAPITAL\_HTML

•  **CAPITAL\_HTML**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[CAPITAL_HTML](_jscrewit_.featureall.md#capital_html)*

The property that the various string methods returning HTML code such as String.prototype.big or String.prototype.link have both the tag name and attributes written in capital letters.

**`remarks`** 

Available in Internet Explorer.

___

### CHROME

•  **CHROME**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[CHROME](_jscrewit_.featureall.md#chrome)*

Features available in the current stable versions of Chrome, Edge and Opera.

An alias for `CHROME_86`.

___

### CHROME\_86

•  **CHROME\_86**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[CHROME_86](_jscrewit_.featureall.md#chrome_86)*

Features available in Chrome 86, Edge 86 and Opera 72 or later.

**`remarks`** 

This feature may be replaced or removed in the near future when current browser versions become obsolete. Use `CHROME` or `CHROME_PREV` instead of `CHROME_86` for long term support.

**`see`** 

[Engine Support Policy](https://github.com/fasttime/JScrewIt#engine-support-policy)

___

### CHROME\_PREV

•  **CHROME\_PREV**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[CHROME_PREV](_jscrewit_.featureall.md#chrome_prev)*

Features available in the previous to current versions of Chrome and Edge.

An alias for `CHROME_86`.

___

### COMPACT

•  **COMPACT**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[COMPACT](_jscrewit_.featureall.md#compact)*

All new browsers' features.

No support for Node.js and older browsers like Internet Explorer, Safari 9 or Android Browser.

___

### CONSOLE

•  **CONSOLE**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[CONSOLE](_jscrewit_.featureall.md#console)*

Existence of the global object console having the string representation "\[object Console\]".

This feature may become unavailable when certain browser extensions are active.

**`remarks`** 

Available in Internet Explorer 10+, Safari, and Android Browser. This feature is not available inside web workers in Safari before 7.1 and Android Browser 4.4.

___

### DEFAULT

•  **DEFAULT**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[DEFAULT](_jscrewit_.featureall.md#default)*

Minimum feature level, compatible with all supported engines in all environments.

___

### DOCUMENT

•  **DOCUMENT**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[DOCUMENT](_jscrewit_.featureall.md#document)*

Existence of the global object document having the string representation "\[object Document\]".

**`remarks`** 

Available in Internet Explorer before 11. This feature is not available inside web workers.

___

### DOMWINDOW

•  **DOMWINDOW**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[DOMWINDOW](_jscrewit_.featureall.md#domwindow)*

Existence of the global object self having the string representation "\[object DOMWindow\]".

**`remarks`** 

Available in Android Browser before 4.4. This feature is not available inside web workers.

___

### ELEMENTARY

• `Readonly` **ELEMENTARY**: readonly [ElementaryFeature](_jscrewit_.elementaryfeature.md)[]

An immutable array of all elementary feature objects ordered by name.

___

### ESC\_HTML\_ALL

•  **ESC\_HTML\_ALL**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ESC_HTML_ALL](_jscrewit_.featureall.md#esc_html_all)*

The property that double quotation mark, less than and greater than characters in the argument of String.prototype.fontcolor are escaped into their respective HTML entities.

**`remarks`** 

Available in Android Browser and Node.js before 0.12.

___

### ESC\_HTML\_QUOT

•  **ESC\_HTML\_QUOT**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ESC_HTML_QUOT](_jscrewit_.featureall.md#esc_html_quot)*

The property that double quotation marks in the argument of String.prototype.fontcolor are escaped as "\&quot;".

**`remarks`** 

Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser, and Node.js.

___

### ESC\_HTML\_QUOT\_ONLY

•  **ESC\_HTML\_QUOT\_ONLY**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ESC_HTML_QUOT_ONLY](_jscrewit_.featureall.md#esc_html_quot_only)*

The property that only double quotation marks and no other characters in the argument of String.prototype.fontcolor are escaped into HTML entities.

**`remarks`** 

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js 0.12+.

___

### ESC\_REGEXP\_LF

•  **ESC\_REGEXP\_LF**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ESC_REGEXP_LF](_jscrewit_.featureall.md#esc_regexp_lf)*

Having regular expressions created with the RegExp constructor use escape sequences starting with a backslash to format line feed characters \("\\n"\) in their string representation.

**`remarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Node.js 12+.

___

### ESC\_REGEXP\_SLASH

•  **ESC\_REGEXP\_SLASH**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[ESC_REGEXP_SLASH](_jscrewit_.featureall.md#esc_regexp_slash)*

Having regular expressions created with the RegExp constructor use escape sequences starting with a backslash to format slashes \("/"\) in their string representation.

**`remarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Node.js 4+.

___

### EXTERNAL

•  **EXTERNAL**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[EXTERNAL](_jscrewit_.featureall.md#external)*

Existence of the global object sidebar having the string representation "\[object External\]".

**`remarks`** 

Available in Firefox. This feature is not available inside web workers.

___

### FF

•  **FF**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[FF](_jscrewit_.featureall.md#ff)*

Features available in the current stable version of Firefox.

An alias for `FF_78`.

___

### FF\_78

•  **FF\_78**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[FF_78](_jscrewit_.featureall.md#ff_78)*

Features available in Firefox 78 or later.

**`remarks`** 

This feature may be replaced or removed in the near future when current browser versions become obsolete. Use `FF`, `FF_ESR`, or `FF_PREV` instead of `FF_78` for long term support.

**`see`** 

[Engine Support Policy](https://github.com/fasttime/JScrewIt#engine-support-policy)

___

### FF\_ESR

•  **FF\_ESR**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[FF_ESR](_jscrewit_.featureall.md#ff_esr)*

Features available in the current version of Firefox ESR.

An alias for `FF_78`.

___

### FF\_PREV

•  **FF\_PREV**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[FF_PREV](_jscrewit_.featureall.md#ff_prev)*

Features available in the previous to current version of Firefox.

An alias for `FF_78`.

___

### FF\_SRC

•  **FF\_SRC**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[FF_SRC](_jscrewit_.featureall.md#ff_src)*

A string representation of native functions typical for Firefox and Safari.

Remarkable traits are the lack of line feed characters at the beginning and at the end of the string and the presence of a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.

**`remarks`** 

Available in Firefox and Safari.

___

### FILL

•  **FILL**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[FILL](_jscrewit_.featureall.md#fill)*

Existence of the native function Array.prototype.fill.

**`remarks`** 

Available in Chrome, Edge, Firefox, Safari 7.1+, Opera, and Node.js 4+.

___

### FLAT

•  **FLAT**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[FLAT](_jscrewit_.featureall.md#flat)*

Existence of the native function Array.prototype.flat.

**`remarks`** 

Available in Chrome, Edge, Firefox, Safari 12+, Opera, and Node.js 11+.

___

### FROM\_CODE\_POINT

•  **FROM\_CODE\_POINT**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[FROM_CODE_POINT](_jscrewit_.featureall.md#from_code_point)*

Existence of the function String.fromCodePoint.

**`remarks`** 

Available in Chrome, Edge, Firefox, Safari 9+, Opera, and Node.js 4+.

___

### FUNCTION\_19\_LF

•  **FUNCTION\_19\_LF**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[FUNCTION_19_LF](_jscrewit_.featureall.md#function_19_lf)*

A string representation of dynamically generated functions where the character at index 19 is a line feed \("\\n"\).

**`remarks`** 

Available in Chrome, Edge, Firefox, Opera, and Node.js 10+.

___

### FUNCTION\_22\_LF

•  **FUNCTION\_22\_LF**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[FUNCTION_22_LF](_jscrewit_.featureall.md#function_22_lf)*

A string representation of dynamically generated functions where the character at index 22 is a line feed \("\\n"\).

**`remarks`** 

Available in Internet Explorer, Safari 9+, Android Browser, and Node.js before 10.

___

### GLOBAL\_UNDEFINED

•  **GLOBAL\_UNDEFINED**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[GLOBAL_UNDEFINED](_jscrewit_.featureall.md#global_undefined)*

Having the global function toString return the string "\[object Undefined\]" when invoked without a binding.

**`remarks`** 

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js.

___

### GMT

•  **GMT**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[GMT](_jscrewit_.featureall.md#gmt)*

Presence of the text "GMT" after the first 25 characters in the string returned by Date\(\).

The string representation of dates is implementation dependent, but most engines use a similar format, making this feature available in all supported engines except Internet Explorer 9 and 10.

**`remarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari, Opera, Android Browser, and Node.js.

___

### HISTORY

•  **HISTORY**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[HISTORY](_jscrewit_.featureall.md#history)*

Existence of the global object history having the string representation "\[object History\]".

**`remarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser. This feature is not available inside web workers.

___

### HTMLAUDIOELEMENT

•  **HTMLAUDIOELEMENT**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[HTMLAUDIOELEMENT](_jscrewit_.featureall.md#htmlaudioelement)*

Existence of the global object Audio whose string representation starts with "function HTMLAudioElement".

**`remarks`** 

Available in Android Browser 4.4. This feature is not available inside web workers.

___

### HTMLDOCUMENT

•  **HTMLDOCUMENT**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[HTMLDOCUMENT](_jscrewit_.featureall.md#htmldocument)*

Existence of the global object document having the string representation "\[object HTMLDocument\]".

**`remarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari, Opera, and Android Browser. This feature is not available inside web workers.

___

### IE\_10

•  **IE\_10**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[IE_10](_jscrewit_.featureall.md#ie_10)*

Features available in Internet Explorer 10.

___

### IE\_11

•  **IE\_11**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[IE_11](_jscrewit_.featureall.md#ie_11)*

Features available in Internet Explorer 11.

___

### IE\_11\_WIN\_10

•  **IE\_11\_WIN\_10**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[IE_11_WIN_10](_jscrewit_.featureall.md#ie_11_win_10)*

Features available in Internet Explorer 11 on Windows 10.

___

### IE\_9

•  **IE\_9**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[IE_9](_jscrewit_.featureall.md#ie_9)*

Features available in Internet Explorer 9.

___

### IE\_SRC

•  **IE\_SRC**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[IE_SRC](_jscrewit_.featureall.md#ie_src)*

A string representation of native functions typical for Internet Explorer.

Remarkable traits are the presence of a line feed character \("\\n"\) at the beginning and at the end of the string and a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.

**`remarks`** 

Available in Internet Explorer.

___

### INCR\_CHAR

•  **INCR\_CHAR**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[INCR_CHAR](_jscrewit_.featureall.md#incr_char)*

The ability to use unary increment operators with string characters, like in \( ++"some string"\[0\] \): this will result in a TypeError in strict mode in ECMAScript compliant engines.

**`remarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, Android Browser, and Node.js. This feature is not available when strict mode is enforced in Chrome, Edge, Firefox, Internet Explorer 10+, Safari, Opera, and Node.js 5+.

___

### INTL

•  **INTL**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[INTL](_jscrewit_.featureall.md#intl)*

Existence of the global object Intl.

**`remarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari 10+, Opera, Android Browser 4.4, and Node.js 0.12+.

___

### LOCALE\_INFINITY

•  **LOCALE\_INFINITY**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[LOCALE_INFINITY](_jscrewit_.featureall.md#locale_infinity)*

Language sensitive string representation of Infinity as "∞".

**`remarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer 11 on Windows 10, Safari 10+, Opera, Android Browser 4.4, and Node.js 0.12+.

___

### LOCALE\_NUMERALS

•  **LOCALE\_NUMERALS**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[LOCALE_NUMERALS](_jscrewit_.featureall.md#locale_numerals)*

Features shared by all engines capable of localized number formatting, including output of Arabic digits, the Arabic decimal separator "٫", the first three letters of the Arabic string representation of NaN \("ليس"\), Persian digits and the Persian digit group separator "٬".

**`remarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari 10+, Opera, Android Browser 4.4, and Node.js 13+.

___

### NAME

•  **NAME**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NAME](_jscrewit_.featureall.md#name)*

Existence of the name property for functions.

**`remarks`** 

Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser, and Node.js.

___

### NODECONSTRUCTOR

•  **NODECONSTRUCTOR**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NODECONSTRUCTOR](_jscrewit_.featureall.md#nodeconstructor)*

Existence of the global object Node having the string representation "\[object NodeConstructor\]".

**`remarks`** 

Available in Safari before 10. This feature is not available inside web workers.

___

### NODE\_0\_10

•  **NODE\_0\_10**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NODE_0_10](_jscrewit_.featureall.md#node_0_10)*

Features available in Node.js 0.10.

___

### NODE\_0\_12

•  **NODE\_0\_12**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NODE_0_12](_jscrewit_.featureall.md#node_0_12)*

Features available in Node.js 0.12.

___

### NODE\_10

•  **NODE\_10**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NODE_10](_jscrewit_.featureall.md#node_10)*

Features available in Node.js 10.

___

### NODE\_11

•  **NODE\_11**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NODE_11](_jscrewit_.featureall.md#node_11)*

Features available in Node.js 11.

___

### NODE\_12

•  **NODE\_12**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NODE_12](_jscrewit_.featureall.md#node_12)*

Features available in Node.js 12.

___

### NODE\_13

•  **NODE\_13**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NODE_13](_jscrewit_.featureall.md#node_13)*

Features available in Node.js 13 and Node.js 14.

___

### NODE\_15

•  **NODE\_15**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NODE_15](_jscrewit_.featureall.md#node_15)*

Features available in Node.js 15 or later.

___

### NODE\_4

•  **NODE\_4**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NODE_4](_jscrewit_.featureall.md#node_4)*

Features available in Node.js 4.

___

### NODE\_5

•  **NODE\_5**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NODE_5](_jscrewit_.featureall.md#node_5)*

Features available in Node.js 5 to 9.

___

### NO\_FF\_SRC

•  **NO\_FF\_SRC**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NO_FF_SRC](_jscrewit_.featureall.md#no_ff_src)*

A string representation of native functions typical for V8 or for Internet Explorer but not for Firefox and Safari.

**`remarks`** 

Available in Chrome, Edge, Internet Explorer, Opera, Android Browser, and Node.js.

___

### NO\_IE\_SRC

•  **NO\_IE\_SRC**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NO_IE_SRC](_jscrewit_.featureall.md#no_ie_src)*

A string representation of native functions typical for most engines with the notable exception of Internet Explorer.

A remarkable trait of this feature is the lack of line feed characters at the beginning and at the end of the string.

**`remarks`** 

Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser, and Node.js.

___

### NO\_OLD\_SAFARI\_ARRAY\_ITERATOR

•  **NO\_OLD\_SAFARI\_ARRAY\_ITERATOR**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NO_OLD_SAFARI_ARRAY_ITERATOR](_jscrewit_.featureall.md#no_old_safari_array_iterator)*

The property that the string representation of Array.prototype.entries\(\) evaluates to "\[object Array Iterator\]".

**`remarks`** 

Available in Chrome, Edge, Firefox, Safari 9+, Opera, and Node.js 0.12+.

___

### NO\_V8\_SRC

•  **NO\_V8\_SRC**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[NO_V8_SRC](_jscrewit_.featureall.md#no_v8_src)*

A string representation of native functions typical for Firefox, Internet Explorer and Safari.

A most remarkable trait of this feature is the presence of a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.

**`remarks`** 

Available in Firefox, Internet Explorer, and Safari.

___

### PLAIN\_INTL

•  **PLAIN\_INTL**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[PLAIN_INTL](_jscrewit_.featureall.md#plain_intl)*

Existence of the global object Intl having the string representation "\[object Object\]"

**`remarks`** 

Available in Firefox, Internet Explorer 11, Safari 10+ before 14.0.1, Android Browser 4.4, and Node.js 0.12+ before 15.

___

### REGEXP\_STRING\_ITERATOR

•  **REGEXP\_STRING\_ITERATOR**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[REGEXP_STRING_ITERATOR](_jscrewit_.featureall.md#regexp_string_iterator)*

The property that the string representation of String.prototype.matchAll\(\) evaluates to "\[object RegExp String Iterator\]".

**`remarks`** 

Available in Chrome, Edge, Firefox, Safari 13+, Opera, and Node.js 12+.

___

### SAFARI

•  **SAFARI**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[SAFARI](_jscrewit_.featureall.md#safari)*

Features available in the current stable version of Safari.

An alias for `SAFARI_14_0_1`.

___

### SAFARI\_10

•  **SAFARI\_10**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[SAFARI_10](_jscrewit_.featureall.md#safari_10)*

Features available in Safari 10 and Safari 11.

___

### SAFARI\_12

•  **SAFARI\_12**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[SAFARI_12](_jscrewit_.featureall.md#safari_12)*

Features available in Safari 12.

___

### SAFARI\_13

•  **SAFARI\_13**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[SAFARI_13](_jscrewit_.featureall.md#safari_13)*

Features available in Safari 13 and Safari 14.0.0.

___

### SAFARI\_14\_0\_1

•  **SAFARI\_14\_0\_1**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[SAFARI_14_0_1](_jscrewit_.featureall.md#safari_14_0_1)*

Features available in Safari 14.0.1 or later.

___

### SAFARI\_7\_0

•  **SAFARI\_7\_0**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[SAFARI_7_0](_jscrewit_.featureall.md#safari_7_0)*

Features available in Safari 7.0.

___

### SAFARI\_7\_1

•  **SAFARI\_7\_1**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[SAFARI_7_1](_jscrewit_.featureall.md#safari_7_1)*

Features available in Safari 7.1 and Safari 8.

___

### SAFARI\_8

•  **SAFARI\_8**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[SAFARI_8](_jscrewit_.featureall.md#safari_8)*

An alias for `SAFARI_7_1`.

___

### SAFARI\_9

•  **SAFARI\_9**: [PredefinedFeature](_jscrewit_.predefinedfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[SAFARI_9](_jscrewit_.featureall.md#safari_9)*

Features available in Safari 9.

___

### SELF

•  **SELF**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[SELF](_jscrewit_.featureall.md#self)*

An alias for `ANY_WINDOW`.

___

### SELF\_OBJ

•  **SELF\_OBJ**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[SELF_OBJ](_jscrewit_.featureall.md#self_obj)*

Existence of the global object self whose string representation starts with "\[object ".

**`remarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser. This feature is not available inside web workers in Safari 7.1+ before 10.

___

### SHORT\_LOCALES

•  **SHORT\_LOCALES**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[SHORT_LOCALES](_jscrewit_.featureall.md#short_locales)*

Support for the two-letter locale name "ar".

**`remarks`** 

Available in Firefox, Internet Explorer 11, Safari 10+, Android Browser 4.4, and Node.js 13+.

___

### STATUS

•  **STATUS**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[STATUS](_jscrewit_.featureall.md#status)*

Existence of the global string status.

**`remarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser. This feature is not available inside web workers.

___

### UNDEFINED

•  **UNDEFINED**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[UNDEFINED](_jscrewit_.featureall.md#undefined)*

The property that Object.prototype.toString.call\(\) evaluates to "\[object Undefined\]".

This behavior is specified by ECMAScript, and is enforced by all engines except Android Browser versions prior to 4.1.2, where this feature is not available.

**`remarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, Android Browser 4.1+, and Node.js.

___

### V8\_SRC

•  **V8\_SRC**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[V8_SRC](_jscrewit_.featureall.md#v8_src)*

A string representation of native functions typical for the V8 engine.

Remarkable traits are the lack of line feed characters at the beginning and at the end of the string and the presence of a single whitespace before the "\[native code\]" sequence.

**`remarks`** 

Available in Chrome, Edge, Opera, Android Browser, and Node.js.

___

### WINDOW

•  **WINDOW**: [ElementaryFeature](_jscrewit_.elementaryfeature.md)

*Inherited from [FeatureAll](_jscrewit_.featureall.md).[WINDOW](_jscrewit_.featureall.md#window)*

Existence of the global object self having the string representation "\[object Window\]".

**`remarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser 4.4. This feature is not available inside web workers.

## Methods

### areCompatible

▸ **areCompatible**(...`features`: [FeatureElement](../modules/_jscrewit_.md#featureelement)[]): boolean

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

#### Parameters:

Name | Type |
------ | ------ |
`...features` | [FeatureElement](../modules/_jscrewit_.md#featureelement)[] |

**Returns:** boolean

`true` if the specified features are mutually compatible; otherwise, `false`.
If less than two features are specified, the return value is `true`.

___

### areEqual

▸ **areEqual**(...`features`: ([FeatureElement](../modules/_jscrewit_.md#featureelement) \| [CompatibleFeatureArray](../modules/_jscrewit_.md#compatiblefeaturearray))[]): boolean

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

#### Parameters:

Name | Type |
------ | ------ |
`...features` | ([FeatureElement](../modules/_jscrewit_.md#featureelement) \| [CompatibleFeatureArray](../modules/_jscrewit_.md#compatiblefeaturearray))[] |

**Returns:** boolean

`true` if all of the specified features are equivalent; otherwise, `false`.
If less than two arguments are specified, the return value is `true`.

___

### commonOf

▸ **commonOf**(...`features`: ([FeatureElement](../modules/_jscrewit_.md#featureelement) \| [CompatibleFeatureArray](../modules/_jscrewit_.md#compatiblefeaturearray))[]): [CustomFeature](_jscrewit_.customfeature.md) \| null

Creates a new feature object equivalent to the intersection of the specified features.

**`example`** 

This will create a new feature object equivalent to <code>[NAME](_jscrewit_.featureconstructor.md#name)</code>.

```js
const newFeature = JScrewIt.Feature.commonOf(["ATOB", "NAME"], ["NAME", "SELF"]);
```

This will create a new feature object equivalent to <code>[ANY_DOCUMENT](_jscrewit_.featureconstructor.md#any_document)</code>.
This is because both <code>[HTMLDOCUMENT](_jscrewit_.featureconstructor.md#htmldocument)</code> and <code>[DOCUMENT](_jscrewit_.featureconstructor.md#document)</code> imply
<code>[ANY_DOCUMENT](_jscrewit_.featureconstructor.md#any_document)</code>.

```js
const newFeature = JScrewIt.Feature.commonOf("HTMLDOCUMENT", "DOCUMENT");
```

#### Parameters:

Name | Type |
------ | ------ |
`...features` | ([FeatureElement](../modules/_jscrewit_.md#featureelement) \| [CompatibleFeatureArray](../modules/_jscrewit_.md#compatiblefeaturearray))[] |

**Returns:** [CustomFeature](_jscrewit_.customfeature.md) \| null

A feature object, or `null` if no arguments are specified.

___

### descriptionFor

▸ **descriptionFor**(`name`: keyof [FeatureAll](_jscrewit_.featureall.md)): string

Returns a short description of a predefined feature in plain English.

**`remarks`** 

Different names or aliases of the same feature may have different descriptions.

**`throws`** 

An error is thrown if the specified argument is not a name or alias of a predefined
feature.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`name` | keyof [FeatureAll](_jscrewit_.featureall.md) |   A name or alias of a predefined feature.  |

**Returns:** string
