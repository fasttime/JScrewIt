[**JScrewIt**](../README.md)

***

# Interface: FeatureAll

## Extended by

- [`FeatureConstructor`](FeatureConstructor.md)

## Properties

### ANY\_DOCUMENT

> **ANY\_DOCUMENT**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object document whose string representation starts with "\[object " and ends with "Document\]".

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, and Opera. This feature is not available inside web workers.

***

### ANY\_WINDOW

> **ANY\_WINDOW**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object self whose string representation starts with "\[object " and ends with "Window\]".

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, and Opera. This feature is not available inside web workers.

***

### ARRAY\_ITERATOR

> **ARRAY\_ITERATOR**: [`ElementaryFeature`](ElementaryFeature.md)

The property that the string representation of Array.prototype.entries\(\) starts with "\[object Array" and ends with "\]" at index 21 or 22.

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js.

***

### ARROW

> **ARROW**: [`ElementaryFeature`](ElementaryFeature.md)

Support for arrow functions.

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js.

***

### ASYNC\_FUNCTION

> **ASYNC\_FUNCTION**: [`ElementaryFeature`](ElementaryFeature.md)

Support for async functions, which return Promise object.

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js.

***

### AT

> **AT**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the native function Array.prototype.at.

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js.

***

### ATOB

> **ATOB**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global functions atob and btoa.

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Node.js.

***

### AUTO

> **AUTO**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in the current environment.

***

### BARPROP

> **BARPROP**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object statusbar having the string representation "\[object BarProp\]".

#### Remarks

Available in Chrome, Edge, Firefox, Safari, and Opera. This feature is not available inside web workers.

***

### BROWSER

> **BROWSER**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in all browsers.

No support for Node.js.

***

### CALL\_ON\_GLOBAL

> **CALL\_ON\_GLOBAL**: [`ElementaryFeature`](ElementaryFeature.md)

The ability to call a function on the global object when invoking Function.prototype.call without binding.

#### Remarks

This feature is not available in any of the supported engines.

***

### CAPITAL\_HTML

> **CAPITAL\_HTML**: [`ElementaryFeature`](ElementaryFeature.md)

The property that the various string methods returning HTML code such as String.prototype.big or String.prototype.link have both the tag name and attributes written in capital letters.

#### Remarks

Available in Internet Explorer.

***

### CHROME

> **CHROME**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in the current stable versions of Chrome, Edge and Opera.

An alias for `CHROME_122`.

***

### CHROME\_122

> **CHROME\_122**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Chrome 122, Edge 122 and Opera 108 or later.

#### Remarks

This feature may be replaced or removed in the near future when current browser versions become obsolete. Use `CHROME` or `CHROME_PREV` instead of `CHROME_122` for long term support.

#### See

[Engine Support Policy](https://github.com/fasttime/JScrewIt#engine-support-policy)

***

### CHROME\_PREV

> **CHROME\_PREV**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in the previous to current versions of Chrome and Edge.

An alias for `CHROME_122`.

***

### COMPACT

> **COMPACT**: [`PredefinedFeature`](PredefinedFeature.md)

All new browsers' features.

Not compatible with Node.js, Internet Explorer, and old versions of supported browsers.

***

### CONSOLE

> **CONSOLE**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object console having the string representation "\[object Console\]".

This feature may become unavailable when certain browser extensions are active.

#### Remarks

Available in Internet Explorer.

***

### CREATE\_ELEMENT

> **CREATE\_ELEMENT**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the function document.createElement.

An alias for `ANY_DOCUMENT`.

***

### DEFAULT

> **DEFAULT**: [`PredefinedFeature`](PredefinedFeature.md)

Minimum feature level, compatible with all supported engines in all environments.

***

### DOCUMENT

> **DOCUMENT**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object document having the string representation "\[object Document\]".

#### Remarks

This feature is not available in any of the supported engines.

***

### DOMWINDOW

> **DOMWINDOW**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object self having the string representation "\[object DOMWindow\]".

#### Remarks

This feature is not available in any of the supported engines.

***

### ESC\_HTML\_ALL

> **ESC\_HTML\_ALL**: [`ElementaryFeature`](ElementaryFeature.md)

The property that double quotation mark, less than and greater than characters in the argument of String.prototype.fontcolor are escaped into their respective HTML entities.

#### Remarks

This feature is not available in any of the supported engines.

***

### ESC\_HTML\_QUOT

> **ESC\_HTML\_QUOT**: [`ElementaryFeature`](ElementaryFeature.md)

The property that double quotation marks in the argument of String.prototype.fontcolor are escaped as "\&quot;".

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js.

***

### ESC\_HTML\_QUOT\_ONLY

> **ESC\_HTML\_QUOT\_ONLY**: [`ElementaryFeature`](ElementaryFeature.md)

The property that only double quotation marks and no other characters in the argument of String.prototype.fontcolor are escaped into HTML entities.

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js.

***

### ESC\_REGEXP\_LF

> **ESC\_REGEXP\_LF**: [`ElementaryFeature`](ElementaryFeature.md)

Having regular expressions created with the RegExp constructor use escape sequences starting with a backslash to format line feed characters \("\\n"\) in their string representation.

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Node.js.

***

### ESC\_REGEXP\_SLASH

> **ESC\_REGEXP\_SLASH**: [`ElementaryFeature`](ElementaryFeature.md)

Having regular expressions created with the RegExp constructor use escape sequences starting with a backslash to format slashes \("/"\) in their string representation.

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Node.js.

***

### FF

> **FF**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in the current stable version of Firefox.

An alias for `FF_134`.

***

### FF\_131

> **FF\_131**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Firefox 131 to 133.

#### Remarks

This feature may be replaced or removed in the near future when current browser versions become obsolete.

#### See

[Engine Support Policy](https://github.com/fasttime/JScrewIt#engine-support-policy)

***

### FF\_134

> **FF\_134**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Firefox 134 or later.

#### Remarks

This feature may be replaced or removed in the near future when current browser versions become obsolete. Use `FF` or `FF_PREV` instead of `FF_134` for long term support.

#### See

[Engine Support Policy](https://github.com/fasttime/JScrewIt#engine-support-policy)

***

### FF\_90

> **FF\_90**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Firefox 90 to 130.

#### Remarks

This feature may be replaced or removed in the near future when current browser versions become obsolete. Use `FF_ESR` instead of `FF_90` for long term support.

#### See

[Engine Support Policy](https://github.com/fasttime/JScrewIt#engine-support-policy)

***

### FF\_ESR

> **FF\_ESR**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in the current version of Firefox ESR.

An alias for `FF_90`.

***

### FF\_PREV

> **FF\_PREV**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in the previous to current version of Firefox.

An alias for `FF_134`.

***

### FF\_SRC

> **FF\_SRC**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of native functions typical for Firefox and Safari.

Remarkable traits are the lack of line feed characters at the beginning and at the end of the string and the presence of a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.

#### Remarks

Available in Firefox and Safari.

***

### FILL

> **FILL**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the native function Array.prototype.fill.

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js.

***

### FLAT

> **FLAT**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the native function Array.prototype.flat.

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js.

***

### FORMS

> **FORMS**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the object document.forms with string representation "\[object HTMLCollection\]".

An alias for `ANY_DOCUMENT`.

***

### FROM\_CODE\_POINT

> **FROM\_CODE\_POINT**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the function String.fromCodePoint.

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js.

***

### FUNCTION\_19\_LF

> **FUNCTION\_19\_LF**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of dynamically generated functions where the character at index 19 is a line feed \("\\n"\).

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js.

***

### FUNCTION\_22\_LF

> **FUNCTION\_22\_LF**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of dynamically generated functions where the character at index 22 is a line feed \("\\n"\).

#### Remarks

Available in Internet Explorer.

***

### GENERIC\_ARRAY\_TO\_STRING

> **GENERIC\_ARRAY\_TO\_STRING**: [`ElementaryFeature`](ElementaryFeature.md)

Ability to call Array.prototype.toString with a non-array binding.

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Node.js.

***

### GLOBAL\_UNDEFINED

> **GLOBAL\_UNDEFINED**: [`ElementaryFeature`](ElementaryFeature.md)

Having the global function toString return the string "\[object Undefined\]" when invoked without a binding.

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js.

***

### GMT

> **GMT**: [`ElementaryFeature`](ElementaryFeature.md)

Presence of the text "GMT" after the first 25 characters in the string returned by Date\(\).

The string representation of dates is implementation dependent, but most engines use a similar format, making this feature available in all supported engines except Internet Explorer 9 and 10.

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Node.js.

***

### HISTORY

> **HISTORY**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object history having the string representation "\[object History\]".

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, and Opera. This feature is not available inside web workers.

***

### HTMLAUDIOELEMENT

> **HTMLAUDIOELEMENT**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object Audio whose string representation starts with "function HTMLAudioElement".

#### Remarks

This feature is not available in any of the supported engines.

***

### IE\_11

> **IE\_11**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Internet Explorer 11.

***

### IE\_11\_WIN\_10

> **IE\_11\_WIN\_10**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Internet Explorer 11 on Windows 10.

***

### IE\_SRC

> **IE\_SRC**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of native functions typical for Internet Explorer.

Remarkable traits are the presence of a line feed character \("\\n"\) at the beginning and at the end of the string and a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.

#### Remarks

Available in Internet Explorer.

***

### INCR\_CHAR

> **INCR\_CHAR**: [`ElementaryFeature`](ElementaryFeature.md)

The ability to use unary increment operators with string characters, like in \( ++"some string"\[0\] \): this will result in a TypeError in strict mode in ECMAScript compliant engines.

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Node.js. This feature is not available when strict mode is enforced in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Node.js.

***

### INTL

> **INTL**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object Intl.

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Node.js.

***

### ITERATOR\_HELPER

> **ITERATOR\_HELPER**: [`ElementaryFeature`](ElementaryFeature.md)

Availability of iterator helpers.

#### Remarks

Available in Chrome, Edge, Firefox 131+, Safari 18.4+, Opera, and Node.js 22.0+.

***

### JAPANESE\_INFINITY

> **JAPANESE\_INFINITY**: [`ElementaryFeature`](ElementaryFeature.md)

Japanese string representation of Infinity ending with "∞".

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Node.js.

***

### LOCALE\_INFINITY

> **LOCALE\_INFINITY**: [`ElementaryFeature`](ElementaryFeature.md)

Language sensitive string representation of Infinity as "∞".

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer 11 on Windows 10, Safari, Opera, and Node.js.

***

### LOCALE\_NUMERALS

> **LOCALE\_NUMERALS**: [`ElementaryFeature`](ElementaryFeature.md)

Features shared by all engines capable of localized number formatting, including output of Arabic digits, the Arabic decimal separator "٫", the letters in the first word of the Arabic string representation of NaN \("ليس"\), Persian digits and the Persian digit group separator "٬".

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Node.js.

***

### LOCALE\_NUMERALS\_BN

> **LOCALE\_NUMERALS\_BN**: [`ElementaryFeature`](ElementaryFeature.md)

Localized number formatting for Bengali.

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer 11 on Windows 10, Safari before 18.4, Opera, and Node.js.

***

### LOCALE\_NUMERALS\_EXT

> **LOCALE\_NUMERALS\_EXT**: [`ElementaryFeature`](ElementaryFeature.md)

Extended localized number formatting.

This includes all features of LOCALE_NUMERALS plus the output of the first three letters in the second word of the Arabic string representation of NaN \("رقم"\), the letters in the Russian string representation of NaN \("не число"\) and the letters in the Persian string representation of NaN \("ناعدد"\).

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer 11 on Windows 10, Safari, Opera, and Node.js.

***

### LOCATION

> **LOCATION**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object location with the property that Object.prototype.toString.call\(location\) evaluates to a string that starts with "\[object " and ends with "Location\]".

#### Remarks

Available in Chrome, Edge, Firefox, Safari, and Opera.

***

### MOZILLA

> **MOZILLA**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of user agent string navigator.userAgent that starts with "Mozilla".

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, and Opera.

***

### NAME

> **NAME**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the name property for functions.

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js.

***

### NO\_FF\_SRC

> **NO\_FF\_SRC**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of native functions typical for V8 or for Internet Explorer but not for Firefox and Safari.

#### Remarks

Available in Chrome, Edge, Internet Explorer, Opera, and Node.js.

***

### NO\_IE\_SRC

> **NO\_IE\_SRC**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of native functions typical for most engines with the notable exception of Internet Explorer.

A remarkable trait of this feature is the lack of line feed characters at the beginning and at the end of the string.

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js.

***

### NO\_OLD\_SAFARI\_ARRAY\_ITERATOR

> **NO\_OLD\_SAFARI\_ARRAY\_ITERATOR**: [`ElementaryFeature`](ElementaryFeature.md)

The property that the string representation of Array.prototype.entries\(\) evaluates to "\[object Array Iterator\]".

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js.

***

### NO\_V8\_SRC

> **NO\_V8\_SRC**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of native functions typical for Firefox, Internet Explorer and Safari.

A most remarkable trait of this feature is the presence of a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.

#### Remarks

Available in Firefox, Internet Explorer, and Safari.

***

### NODE\_20

> **NODE\_20**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 20 to 21.

***

### NODE\_22

> **NODE\_22**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 22.0 to 22.11 and Node.js 23.0 to 23.2.

***

### NODE\_22\_12

> **NODE\_22\_12**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 22.12 to 22.14 and Node.js 23.3 or later.

***

### NODE\_NAME

> **NODE\_NAME**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the string document.nodeName that starts with a number sign \("#"\).

An alias for `ANY_DOCUMENT`.

***

### NODECONSTRUCTOR

> **NODECONSTRUCTOR**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object Node having the string representation "\[object NodeConstructor\]".

#### Remarks

This feature is not available in any of the supported engines.

***

### OBJECT\_ARRAY\_ENTRIES\_CTOR

> **OBJECT\_ARRAY\_ENTRIES\_CTOR**: [`ElementaryFeature`](ElementaryFeature.md)

The property that the Array.prototype.entries\(\).constructor is the Object constructor.

#### Remarks

Available in Firefox before 131, Safari before 18.4, and Node.js before 22.0.

***

### OBJECT\_L\_LOCATION\_CTOR

> **OBJECT\_L\_LOCATION\_CTOR**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global function location.constructor whose string representation starts with "\[object L".

#### Remarks

Available in Internet Explorer. This feature is not available inside web workers.

***

### OBJECT\_UNDEFINED

> **OBJECT\_UNDEFINED**: [`ElementaryFeature`](ElementaryFeature.md)

Having the function Object.prototype.toString return the string "\[object Undefined\]" when invoked without a binding.

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Node.js.

***

### OBJECT\_W\_SELF

> **OBJECT\_W\_SELF**: [`ElementaryFeature`](ElementaryFeature.md)

The property that the string representation of the global object self starts with "\[object W".

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, and Opera. This feature is not available inside web workers in Chrome, Edge, Firefox, Safari, and Opera.

***

### OLD\_SAFARI\_LOCATION\_CTOR

> **OLD\_SAFARI\_LOCATION\_CTOR**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object location.constructor whose string representation starts with "\[object " and ends with "LocationConstructor\]".

#### Remarks

This feature is not available in any of the supported engines.

***

### PLAIN\_INTL

> **PLAIN\_INTL**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object Intl having the string representation "\[object Object\]".

#### Remarks

Available in Internet Explorer.

***

### REGEXP\_STRING\_ITERATOR

> **REGEXP\_STRING\_ITERATOR**: [`ElementaryFeature`](ElementaryFeature.md)

The property that the string representation of String.prototype.matchAll\(\) evaluates to "\[object RegExp String Iterator\]".

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js.

***

### SAFARI

> **SAFARI**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in the current stable version of Safari.

An alias for `SAFARI_18_4`.

***

### SAFARI\_17\_4

> **SAFARI\_17\_4**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 17.4 to 17.6.

#### Remarks

This feature may be replaced or removed in the near future when current browser versions become obsolete. Use `SAFARI_PRE_PREV` instead of `SAFARI_17_4` for long term support.

#### See

[Engine Support Policy](https://github.com/fasttime/JScrewIt#engine-support-policy)

***

### SAFARI\_18\_0

> **SAFARI\_18\_0**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 18.0 to 18.3.

#### Remarks

This feature may be replaced or removed in the near future when current browser versions become obsolete.

#### See

[Engine Support Policy](https://github.com/fasttime/JScrewIt#engine-support-policy)

***

### SAFARI\_18\_4

> **SAFARI\_18\_4**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 18.4 or later.

#### Remarks

This feature may be replaced or removed in the near future when current browser versions become obsolete. Use `SAFARI` or `SAFARI_PREV` instead of `SAFARI_18_4` for long term support.

#### See

[Engine Support Policy](https://github.com/fasttime/JScrewIt#engine-support-policy)

***

### SAFARI\_PRE\_PREV

> **SAFARI\_PRE\_PREV**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in the previous to previous version of Safari.

An alias for `SAFARI_17_4`.

***

### SAFARI\_PREV

> **SAFARI\_PREV**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in the previous to current version of Safari.

An alias for `SAFARI_18_4`.

***

### SELF

> **SELF**: [`ElementaryFeature`](ElementaryFeature.md)

An alias for `ANY_WINDOW`.

***

### SELF\_OBJ

> **SELF\_OBJ**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object self whose string representation starts with "\[object ".

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, and Opera.

***

### SHORT\_LOCALES

> **SHORT\_LOCALES**: [`ElementaryFeature`](ElementaryFeature.md)

Support for the two-letter locale name "ar" to format decimal numbers as Arabic numerals.

#### Remarks

Available in Firefox before 134, Internet Explorer, Safari before 18.0, and Node.js before 22.12–22.14 and 23.3.

***

### STATUS

> **STATUS**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global string status.

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, and Opera. This feature is not available inside web workers.

***

### UNDEFINED

> **UNDEFINED**: [`ElementaryFeature`](ElementaryFeature.md)

The property that Object.prototype.toString.call\(\) evaluates to "\[object Undefined\]".

This behavior is specified by ECMAScript, and is enforced by all engines except Android Browser versions prior to 4.1.2, where this feature is not available.

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Node.js.

***

### V8\_SRC

> **V8\_SRC**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of native functions typical for the V8 engine.

Remarkable traits are the lack of line feed characters at the beginning and at the end of the string and the presence of a single whitespace before the "\[native code\]" sequence.

#### Remarks

Available in Chrome, Edge, Opera, and Node.js.

***

### WINDOW

> **WINDOW**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object self having the string representation "\[object Window\]".

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, and Opera. This feature is not available inside web workers.
