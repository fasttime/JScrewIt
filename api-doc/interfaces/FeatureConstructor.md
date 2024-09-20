[**JScrewIt**](../README.md) • **Docs**

***

# Interface: FeatureConstructor()

## Extends

- [`FeatureAll`](FeatureAll.md)

> **FeatureConstructor**(...`features`): [`CustomFeature`](CustomFeature.md)

Creates a new feature object from the union of the specified features.

The constructor can be used with or without the `new` operator, e.g.
`new JScrewIt.Feature(feature1, feature2)` or `JScrewIt.Feature(feature1, feature2)`.
If no arguments are specified, the new feature object will be equivalent to
[`DEFAULT`](FeatureAll.md#default).

## Parameters

• ...**features**: [`FeatureElementOrCompatibleArray`](../type-aliases/FeatureElementOrCompatibleArray.md)[]

## Returns

[`CustomFeature`](CustomFeature.md)

## Example

The following statements are equivalent, and will all construct a new feature object
including both [`ANY_DOCUMENT`](FeatureAll.md#any_document) and [`ANY_WINDOW`](FeatureConstructor.md#any_window).

```js
new JScrewIt.Feature("ANY_DOCUMENT", "ANY_WINDOW");
```

```js
new JScrewIt.Feature(JScrewIt.Feature.ANY_DOCUMENT, JScrewIt.Feature.ANY_WINDOW);
```

```js
new JScrewIt.Feature([JScrewIt.Feature.ANY_DOCUMENT, JScrewIt.Feature.ANY_WINDOW]);
```

## Throws

An error is thrown if any of the specified features are not mutually compatible.

## Constructors

### new FeatureConstructor()

> **new FeatureConstructor**(...`features`): [`CustomFeature`](CustomFeature.md)

Creates a new feature object from the union of the specified features.

The constructor can be used with or without the `new` operator, e.g.
`new JScrewIt.Feature(feature1, feature2)` or `JScrewIt.Feature(feature1, feature2)`.
If no arguments are specified, the new feature object will be equivalent to
[`DEFAULT`](FeatureAll.md#default).

#### Parameters

• ...**features**: [`FeatureElementOrCompatibleArray`](../type-aliases/FeatureElementOrCompatibleArray.md)[]

#### Returns

[`CustomFeature`](CustomFeature.md)

#### Example

The following statements are equivalent, and will all construct a new feature object
including both [`ANY_DOCUMENT`](FeatureAll.md#any_document) and [`ANY_WINDOW`](FeatureConstructor.md#any_window).

```js
JScrewIt.Feature("ANY_DOCUMENT", "ANY_WINDOW");
```

```js
JScrewIt.Feature(JScrewIt.Feature.ANY_DOCUMENT, JScrewIt.Feature.ANY_WINDOW);
```

```js
JScrewIt.Feature([JScrewIt.Feature.ANY_DOCUMENT, JScrewIt.Feature.ANY_WINDOW]);
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

### ANDRO\_4\_0

> **ANDRO\_4\_0**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Android Browser 4.0.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`ANDRO_4_0`](FeatureAll.md#andro_4_0)

***

### ANDRO\_4\_1

> **ANDRO\_4\_1**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Android Browser 4.1 to 4.3.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`ANDRO_4_1`](FeatureAll.md#andro_4_1)

***

### ANDRO\_4\_4

> **ANDRO\_4\_4**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Android Browser 4.4.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`ANDRO_4_4`](FeatureAll.md#andro_4_4)

***

### ANY\_DOCUMENT

> **ANY\_DOCUMENT**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object document whose string representation starts with "\[object " and ends with "Document\]".

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser. This feature is not available inside web workers.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`ANY_DOCUMENT`](FeatureAll.md#any_document)

***

### ANY\_WINDOW

> **ANY\_WINDOW**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object self whose string representation starts with "\[object " and ends with "Window\]".

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser. This feature is not available inside web workers.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`ANY_WINDOW`](FeatureAll.md#any_window)

***

### ARRAY\_ITERATOR

> **ARRAY\_ITERATOR**: [`ElementaryFeature`](ElementaryFeature.md)

The property that the string representation of Array.prototype.entries\(\) starts with "\[object Array" and ends with "\]" at index 21 or 22.

#### Remarks

Available in Chrome, Edge, Firefox, Safari 7.1+, Opera, and Node.js 0.12+.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`ARRAY_ITERATOR`](FeatureAll.md#array_iterator)

***

### ARROW

> **ARROW**: [`ElementaryFeature`](ElementaryFeature.md)

Support for arrow functions.

#### Remarks

Available in Chrome, Edge, Firefox, Safari 10.0+, Opera, and Node.js 4+.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`ARROW`](FeatureAll.md#arrow)

***

### ASYNC\_FUNCTION

> **ASYNC\_FUNCTION**: [`ElementaryFeature`](ElementaryFeature.md)

Support for async functions, which return Promise object.

#### Remarks

Available in Chrome, Edge, Firefox, Safari 10.1+, Opera, and Node.js 7.6+.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`ASYNC_FUNCTION`](FeatureAll.md#async_function)

***

### AT

> **AT**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the native function Array.prototype.at.

#### Remarks

Available in Chrome, Edge, Firefox, Safari 15.4+, Opera, and Node.js 16.6+.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`AT`](FeatureAll.md#at)

***

### ATOB

> **ATOB**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global functions atob and btoa.

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer 10+, Safari, Opera, Android Browser, and Node.js 16.0+. This feature is not available inside web workers in Safari before 10.0.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`ATOB`](FeatureAll.md#atob)

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

Available in Chrome, Edge, Firefox, Safari, Opera, and Android Browser 4.4. This feature is not available inside web workers.

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

### CALL\_ON\_GLOBAL

> **CALL\_ON\_GLOBAL**: [`ElementaryFeature`](ElementaryFeature.md)

The ability to call a function on the global object when invoking Function.prototype.call without binding.

#### Remarks

Available in Android Browser before 4.1.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`CALL_ON_GLOBAL`](FeatureAll.md#call_on_global)

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

No support for Node.js and older browsers like Internet Explorer, Safari 17.3 or Android Browser.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`COMPACT`](FeatureAll.md#compact)

***

### CONSOLE

> **CONSOLE**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object console having the string representation "\[object Console\]".

This feature may become unavailable when certain browser extensions are active.

#### Remarks

Available in Internet Explorer 10+, Safari before 14.1, and Android Browser. This feature is not available inside web workers in Safari before 7.1 and Android Browser 4.4.

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

Existence of the global object document having the string representation "\[object Document\]".

#### Remarks

Available in Internet Explorer before 11. This feature is not available inside web workers.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`DOCUMENT`](FeatureAll.md#document)

***

### DOMWINDOW

> **DOMWINDOW**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object self having the string representation "\[object DOMWindow\]".

#### Remarks

Available in Android Browser before 4.4. This feature is not available inside web workers.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`DOMWINDOW`](FeatureAll.md#domwindow)

***

### ELEMENTARY

> `readonly` **ELEMENTARY**: readonly [`ElementaryFeature`](ElementaryFeature.md)[]

An immutable array of all elementary feature objects ordered by name.

***

### ESC\_HTML\_ALL

> **ESC\_HTML\_ALL**: [`ElementaryFeature`](ElementaryFeature.md)

The property that double quotation mark, less than and greater than characters in the argument of String.prototype.fontcolor are escaped into their respective HTML entities.

#### Remarks

Available in Android Browser and Node.js before 0.12.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`ESC_HTML_ALL`](FeatureAll.md#esc_html_all)

***

### ESC\_HTML\_QUOT

> **ESC\_HTML\_QUOT**: [`ElementaryFeature`](ElementaryFeature.md)

The property that double quotation marks in the argument of String.prototype.fontcolor are escaped as "\&quot;".

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser, and Node.js.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`ESC_HTML_QUOT`](FeatureAll.md#esc_html_quot)

***

### ESC\_HTML\_QUOT\_ONLY

> **ESC\_HTML\_QUOT\_ONLY**: [`ElementaryFeature`](ElementaryFeature.md)

The property that only double quotation marks and no other characters in the argument of String.prototype.fontcolor are escaped into HTML entities.

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js 0.12+.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`ESC_HTML_QUOT_ONLY`](FeatureAll.md#esc_html_quot_only)

***

### ESC\_REGEXP\_LF

> **ESC\_REGEXP\_LF**: [`ElementaryFeature`](ElementaryFeature.md)

Having regular expressions created with the RegExp constructor use escape sequences starting with a backslash to format line feed characters \("\\n"\) in their string representation.

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Node.js 12+.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`ESC_REGEXP_LF`](FeatureAll.md#esc_regexp_lf)

***

### ESC\_REGEXP\_SLASH

> **ESC\_REGEXP\_SLASH**: [`ElementaryFeature`](ElementaryFeature.md)

Having regular expressions created with the RegExp constructor use escape sequences starting with a backslash to format slashes \("/"\) in their string representation.

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Node.js 4+.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`ESC_REGEXP_SLASH`](FeatureAll.md#esc_regexp_slash)

***

### FF

> **FF**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in the current stable version of Firefox.

An alias for `FF_90`.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`FF`](FeatureAll.md#ff)

***

### FF\_90

> **FF\_90**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Firefox 90 or later.

#### Remarks

This feature may be replaced or removed in the near future when current browser versions become obsolete. Use `FF`, `FF_ESR`, or `FF_PREV` instead of `FF_90` for long term support.

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

An alias for `FF_90`.

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

Available in Chrome, Edge, Firefox, Safari 7.1+, Opera, and Node.js 4+.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`FILL`](FeatureAll.md#fill)

***

### FLAT

> **FLAT**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the native function Array.prototype.flat.

#### Remarks

Available in Chrome, Edge, Firefox, Safari 12+, Opera, and Node.js 11+.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`FLAT`](FeatureAll.md#flat)

***

### FROM\_CODE\_POINT

> **FROM\_CODE\_POINT**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the function String.fromCodePoint.

#### Remarks

Available in Chrome, Edge, Firefox, Safari 9+, Opera, and Node.js 4+.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`FROM_CODE_POINT`](FeatureAll.md#from_code_point)

***

### FUNCTION\_19\_LF

> **FUNCTION\_19\_LF**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of dynamically generated functions where the character at index 19 is a line feed \("\\n"\).

#### Remarks

Available in Chrome, Edge, Firefox, Safari 17.4+, Opera, and Node.js 10+.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`FUNCTION_19_LF`](FeatureAll.md#function_19_lf)

***

### FUNCTION\_22\_LF

> **FUNCTION\_22\_LF**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of dynamically generated functions where the character at index 22 is a line feed \("\\n"\).

#### Remarks

Available in Internet Explorer, Safari 9+ before 17.4, Android Browser, and Node.js before 10.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`FUNCTION_22_LF`](FeatureAll.md#function_22_lf)

***

### GENERIC\_ARRAY\_TO\_STRING

> **GENERIC\_ARRAY\_TO\_STRING**: [`ElementaryFeature`](ElementaryFeature.md)

Ability to call Array.prototype.toString with a non-array binding.

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, Android Browser 4.1+, and Node.js.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`GENERIC_ARRAY_TO_STRING`](FeatureAll.md#generic_array_to_string)

***

### GLOBAL\_UNDEFINED

> **GLOBAL\_UNDEFINED**: [`ElementaryFeature`](ElementaryFeature.md)

Having the global function toString return the string "\[object Undefined\]" when invoked without a binding.

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`GLOBAL_UNDEFINED`](FeatureAll.md#global_undefined)

***

### GMT

> **GMT**: [`ElementaryFeature`](ElementaryFeature.md)

Presence of the text "GMT" after the first 25 characters in the string returned by Date\(\).

The string representation of dates is implementation dependent, but most engines use a similar format, making this feature available in all supported engines except Internet Explorer 9 and 10.

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari, Opera, Android Browser, and Node.js.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`GMT`](FeatureAll.md#gmt)

***

### HISTORY

> **HISTORY**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object history having the string representation "\[object History\]".

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser. This feature is not available inside web workers.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`HISTORY`](FeatureAll.md#history)

***

### HTMLAUDIOELEMENT

> **HTMLAUDIOELEMENT**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object Audio whose string representation starts with "function HTMLAudioElement".

#### Remarks

Available in Android Browser 4.4. This feature is not available inside web workers.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`HTMLAUDIOELEMENT`](FeatureAll.md#htmlaudioelement)

***

### IE\_10

> **IE\_10**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Internet Explorer 10.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`IE_10`](FeatureAll.md#ie_10)

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

### IE\_9

> **IE\_9**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Internet Explorer 9.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`IE_9`](FeatureAll.md#ie_9)

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

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, Android Browser, and Node.js. This feature is not available when strict mode is enforced in Chrome, Edge, Firefox, Internet Explorer 10+, Safari, Opera, and Node.js 5+.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`INCR_CHAR`](FeatureAll.md#incr_char)

***

### INTL

> **INTL**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object Intl.

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari 10.0+, Opera, Android Browser 4.4, and Node.js 0.12+.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`INTL`](FeatureAll.md#intl)

***

### ITERATOR\_HELPER

> **ITERATOR\_HELPER**: [`ElementaryFeature`](ElementaryFeature.md)

Availability of iterator helpers.

#### Remarks

Available in Chrome, Edge, Opera, and Node.js 22+.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`ITERATOR_HELPER`](FeatureAll.md#iterator_helper)

***

### JAPANESE\_INFINITY

> **JAPANESE\_INFINITY**: [`ElementaryFeature`](ElementaryFeature.md)

Japanese string representation of Infinity ending with "∞".

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari 10.0+, Opera, Android Browser 4.4, and Node.js 0.12+.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`JAPANESE_INFINITY`](FeatureAll.md#japanese_infinity)

***

### LOCALE\_INFINITY

> **LOCALE\_INFINITY**: [`ElementaryFeature`](ElementaryFeature.md)

Language sensitive string representation of Infinity as "∞".

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer 11 on Windows 10, Safari 10.0+, Opera, Android Browser 4.4, and Node.js 0.12+.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`LOCALE_INFINITY`](FeatureAll.md#locale_infinity)

***

### LOCALE\_NUMERALS

> **LOCALE\_NUMERALS**: [`ElementaryFeature`](ElementaryFeature.md)

Features shared by all engines capable of localized number formatting, including output of Arabic digits, the Arabic decimal separator "٫", the letters in the first word of the Arabic string representation of NaN \("ليس"\), Persian digits and the Persian digit group separator "٬".

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari 10.0+, Opera, Android Browser 4.4, and Node.js 13+.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`LOCALE_NUMERALS`](FeatureAll.md#locale_numerals)

***

### LOCALE\_NUMERALS\_EXT

> **LOCALE\_NUMERALS\_EXT**: [`ElementaryFeature`](ElementaryFeature.md)

Extended localized number formatting.

This includes all features of LOCALE_NUMERALS plus the output of the first three letters in the second word of the Arabic string representation of NaN \("رقم"\), Bengali digits, the letters in the Russian string representation of NaN \("не число"\) and the letters in the Persian string representation of NaN \("ناعدد"\).

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer 11 on Windows 10, Safari 10.0+, Opera, Android Browser 4.4, and Node.js 13+.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`LOCALE_NUMERALS_EXT`](FeatureAll.md#locale_numerals_ext)

***

### LOCATION

> **LOCATION**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object location with the property that Object.prototype.toString.call\(location\) evaluates to a string that starts with "\[object " and ends with "Location\]".

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, and Android Browser.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`LOCATION`](FeatureAll.md#location)

***

### MOZILLA

> **MOZILLA**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of user agent string navigator.userAgent that starts with "Mozilla".

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`MOZILLA`](FeatureAll.md#mozilla)

***

### NAME

> **NAME**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the name property for functions.

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser, and Node.js.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`NAME`](FeatureAll.md#name)

***

### NO\_FF\_SRC

> **NO\_FF\_SRC**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of native functions typical for V8 or for Internet Explorer but not for Firefox and Safari.

#### Remarks

Available in Chrome, Edge, Internet Explorer, Opera, Android Browser, and Node.js.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`NO_FF_SRC`](FeatureAll.md#no_ff_src)

***

### NO\_IE\_SRC

> **NO\_IE\_SRC**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of native functions typical for most engines with the notable exception of Internet Explorer.

A remarkable trait of this feature is the lack of line feed characters at the beginning and at the end of the string.

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser, and Node.js.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`NO_IE_SRC`](FeatureAll.md#no_ie_src)

***

### NO\_OLD\_SAFARI\_ARRAY\_ITERATOR

> **NO\_OLD\_SAFARI\_ARRAY\_ITERATOR**: [`ElementaryFeature`](ElementaryFeature.md)

The property that the string representation of Array.prototype.entries\(\) evaluates to "\[object Array Iterator\]".

#### Remarks

Available in Chrome, Edge, Firefox, Safari 9+, Opera, and Node.js 0.12+.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`NO_OLD_SAFARI_ARRAY_ITERATOR`](FeatureAll.md#no_old_safari_array_iterator)

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

### NODE\_0\_10

> **NODE\_0\_10**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 0.10.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`NODE_0_10`](FeatureAll.md#node_0_10)

***

### NODE\_0\_12

> **NODE\_0\_12**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 0.12.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`NODE_0_12`](FeatureAll.md#node_0_12)

***

### NODE\_10

> **NODE\_10**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 10.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`NODE_10`](FeatureAll.md#node_10)

***

### NODE\_11

> **NODE\_11**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 11.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`NODE_11`](FeatureAll.md#node_11)

***

### NODE\_12

> **NODE\_12**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 12.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`NODE_12`](FeatureAll.md#node_12)

***

### NODE\_13

> **NODE\_13**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 13 and Node.js 14.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`NODE_13`](FeatureAll.md#node_13)

***

### NODE\_15

> **NODE\_15**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 15.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`NODE_15`](FeatureAll.md#node_15)

***

### NODE\_16\_0

> **NODE\_16\_0**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 16.0 to 16.5.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`NODE_16_0`](FeatureAll.md#node_16_0)

***

### NODE\_16\_6

> **NODE\_16\_6**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 16.6 to 21.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`NODE_16_6`](FeatureAll.md#node_16_6)

***

### NODE\_22

> **NODE\_22**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 22 or later.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`NODE_22`](FeatureAll.md#node_22)

***

### NODE\_4

> **NODE\_4**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 4.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`NODE_4`](FeatureAll.md#node_4)

***

### NODE\_5

> **NODE\_5**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 5 to 7.5.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`NODE_5`](FeatureAll.md#node_5)

***

### NODE\_7\_6

> **NODE\_7\_6**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 7.6 to 9.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`NODE_7_6`](FeatureAll.md#node_7_6)

***

### NODECONSTRUCTOR

> **NODECONSTRUCTOR**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object Node having the string representation "\[object NodeConstructor\]".

#### Remarks

Available in Safari before 10.0. This feature is not available inside web workers.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`NODECONSTRUCTOR`](FeatureAll.md#nodeconstructor)

***

### OBJECT\_ARRAY\_ENTRIES\_CTOR

> **OBJECT\_ARRAY\_ENTRIES\_CTOR**: [`ElementaryFeature`](ElementaryFeature.md)

The property that the Array.prototype.entries\(\).constructor is the Object constructor.

#### Remarks

Available in Firefox, Safari 9+, and Node.js 0.12+ before 22.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`OBJECT_ARRAY_ENTRIES_CTOR`](FeatureAll.md#object_array_entries_ctor)

***

### OBJECT\_L\_LOCATION\_CTOR

> **OBJECT\_L\_LOCATION\_CTOR**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global function location.constructor whose string representation starts with "\[object L".

#### Remarks

Available in Internet Explorer and Safari before 10.0. This feature is not available inside web workers.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`OBJECT_L_LOCATION_CTOR`](FeatureAll.md#object_l_location_ctor)

***

### OBJECT\_UNDEFINED

> **OBJECT\_UNDEFINED**: [`ElementaryFeature`](ElementaryFeature.md)

Having the function Object.prototype.toString return the string "\[object Undefined\]" when invoked without a binding.

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer 10+, Safari, Opera, Android Browser 4.1+, and Node.js.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`OBJECT_UNDEFINED`](FeatureAll.md#object_undefined)

***

### OBJECT\_W\_SELF

> **OBJECT\_W\_SELF**: [`ElementaryFeature`](ElementaryFeature.md)

The property that the string representation of the global object self starts with "\[object W".

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser 4.4. This feature is not available inside web workers in Chrome, Edge, Firefox, Safari, Opera, and Android Browser 4.4.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`OBJECT_W_SELF`](FeatureAll.md#object_w_self)

***

### OLD\_SAFARI\_LOCATION\_CTOR

> **OLD\_SAFARI\_LOCATION\_CTOR**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object location.constructor whose string representation starts with "\[object " and ends with "LocationConstructor\]".

#### Remarks

Available in Safari before 10.0.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`OLD_SAFARI_LOCATION_CTOR`](FeatureAll.md#old_safari_location_ctor)

***

### PLAIN\_INTL

> **PLAIN\_INTL**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object Intl having the string representation "\[object Object\]".

#### Remarks

Available in Internet Explorer 11, Safari 10.0+ before 14.0.1, Android Browser 4.4, and Node.js 0.12+ before 15.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`PLAIN_INTL`](FeatureAll.md#plain_intl)

***

### REGEXP\_STRING\_ITERATOR

> **REGEXP\_STRING\_ITERATOR**: [`ElementaryFeature`](ElementaryFeature.md)

The property that the string representation of String.prototype.matchAll\(\) evaluates to "\[object RegExp String Iterator\]".

#### Remarks

Available in Chrome, Edge, Firefox, Safari 13+, Opera, and Node.js 12+.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`REGEXP_STRING_ITERATOR`](FeatureAll.md#regexp_string_iterator)

***

### SAFARI

> **SAFARI**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in the current stable version of Safari.

An alias for `SAFARI_17_4`.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`SAFARI`](FeatureAll.md#safari)

***

### SAFARI\_10\_0

> **SAFARI\_10\_0**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 10.0.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`SAFARI_10_0`](FeatureAll.md#safari_10_0)

***

### SAFARI\_10\_1

> **SAFARI\_10\_1**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 10.1 and Safari 11.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`SAFARI_10_1`](FeatureAll.md#safari_10_1)

***

### SAFARI\_12

> **SAFARI\_12**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 12.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`SAFARI_12`](FeatureAll.md#safari_12)

***

### SAFARI\_13

> **SAFARI\_13**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 13 and Safari 14.0.0.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`SAFARI_13`](FeatureAll.md#safari_13)

***

### SAFARI\_14\_0\_1

> **SAFARI\_14\_0\_1**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 14.0.1 to 14.0.3.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`SAFARI_14_0_1`](FeatureAll.md#safari_14_0_1)

***

### SAFARI\_14\_1

> **SAFARI\_14\_1**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 14.1 to 15.3.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`SAFARI_14_1`](FeatureAll.md#safari_14_1)

***

### SAFARI\_15\_4

> **SAFARI\_15\_4**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 15.4 to 17.3.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`SAFARI_15_4`](FeatureAll.md#safari_15_4)

***

### SAFARI\_17\_4

> **SAFARI\_17\_4**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 17.4 or later.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`SAFARI_17_4`](FeatureAll.md#safari_17_4)

***

### SAFARI\_7\_0

> **SAFARI\_7\_0**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 7.0.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`SAFARI_7_0`](FeatureAll.md#safari_7_0)

***

### SAFARI\_7\_1

> **SAFARI\_7\_1**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 7.1 and Safari 8.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`SAFARI_7_1`](FeatureAll.md#safari_7_1)

***

### SAFARI\_9

> **SAFARI\_9**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 9.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`SAFARI_9`](FeatureAll.md#safari_9)

***

### SELF

> **SELF**: [`ElementaryFeature`](ElementaryFeature.md)

An alias for `ANY_WINDOW`.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`SELF`](FeatureAll.md#self)

***

### SELF\_OBJ

> **SELF\_OBJ**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object self whose string representation starts with "\[object ".

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser. This feature is not available inside web workers in Safari 7.1+ before 10.0.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`SELF_OBJ`](FeatureAll.md#self_obj)

***

### SHORT\_LOCALES

> **SHORT\_LOCALES**: [`ElementaryFeature`](ElementaryFeature.md)

Support for the two-letter locale name "ar" to format decimal numbers as Arabic numerals.

#### Remarks

Available in Firefox, Internet Explorer 11, Safari 10.0+, Android Browser 4.4, and Node.js 13+.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`SHORT_LOCALES`](FeatureAll.md#short_locales)

***

### STATUS

> **STATUS**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global string status.

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser. This feature is not available inside web workers.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`STATUS`](FeatureAll.md#status)

***

### UNDEFINED

> **UNDEFINED**: [`ElementaryFeature`](ElementaryFeature.md)

The property that Object.prototype.toString.call\(\) evaluates to "\[object Undefined\]".

This behavior is specified by ECMAScript, and is enforced by all engines except Android Browser versions prior to 4.1.2, where this feature is not available.

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, Android Browser 4.1+, and Node.js.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`UNDEFINED`](FeatureAll.md#undefined)

***

### V8\_SRC

> **V8\_SRC**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of native functions typical for the V8 engine.

Remarkable traits are the lack of line feed characters at the beginning and at the end of the string and the presence of a single whitespace before the "\[native code\]" sequence.

#### Remarks

Available in Chrome, Edge, Opera, Android Browser, and Node.js.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`V8_SRC`](FeatureAll.md#v8_src)

***

### WINDOW

> **WINDOW**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object self having the string representation "\[object Window\]".

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser 4.4. This feature is not available inside web workers.

#### Inherited from

[`FeatureAll`](FeatureAll.md).[`WINDOW`](FeatureAll.md#window)

## Methods

### areCompatible()

> **areCompatible**(...`features`): `boolean`

Determines whether the specified features are mutually compatible.

#### Parameters

• ...**features**: [`FeatureElement`](../type-aliases/FeatureElement.md)[]

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

• ...**features**: [`FeatureElementOrCompatibleArray`](../type-aliases/FeatureElementOrCompatibleArray.md)[]

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

> **commonOf**(...`features`): `null` \| [`CustomFeature`](CustomFeature.md)

Creates a new feature object equivalent to the intersection of the specified features.

#### Parameters

• ...**features**: [`FeatureElementOrCompatibleArray`](../type-aliases/FeatureElementOrCompatibleArray.md)[]

#### Returns

`null` \| [`CustomFeature`](CustomFeature.md)

A feature object, or `null` if no arguments are specified.

#### Example

This will create a new feature object equivalent to [`NAME`](FeatureAll.md#name).

```js
const newFeature = JScrewIt.Feature.commonOf(["ATOB", "NAME"], ["NAME", "SELF"]);
```

This will create a new feature object equivalent to [FeatureConstructor.ANY_WINDOW | `ANY_WINDOW`](FeatureAll.md#any_window).
This is because both [`DOMWINDOW`](FeatureAll.md#domwindow) and [`WINDOW`](FeatureConstructor.md#window) imply [FeatureConstructor.ANY_WINDOW | `ANY_WINDOW`](FeatureAll.md#any_window).

```js
const newFeature = JScrewIt.Feature.commonOf("DOMWINDOW", "WINDOW");
```

***

### descriptionFor()

> **descriptionFor**(`name`): `string`

Returns a short description of a predefined feature in plain English.

#### Parameters

• **name**: keyof [`FeatureAll`](FeatureAll.md)

A name or alias of a predefined feature.

#### Returns

`string`

#### Remarks

Different names or aliases of the same feature may have different descriptions.

#### Throws

An error is thrown if the specified argument is not a name or alias of a predefined feature.
