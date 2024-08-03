[**JScrewIt**](../README.md) • **Docs**

***

# Interface: FeatureAll

## Extended by

- [`FeatureConstructor`](FeatureConstructor.md)

## Properties

### ANDRO\_4\_0

> **ANDRO\_4\_0**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Android Browser 4.0.

***

### ANDRO\_4\_1

> **ANDRO\_4\_1**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Android Browser 4.1 to 4.3.

***

### ANDRO\_4\_4

> **ANDRO\_4\_4**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Android Browser 4.4.

***

### ANY\_DOCUMENT

> **ANY\_DOCUMENT**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object document whose string representation starts with "\[object " and ends with "Document\]".

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser. This feature is not available inside web workers.

***

### ANY\_WINDOW

> **ANY\_WINDOW**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object self whose string representation starts with "\[object " and ends with "Window\]".

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser. This feature is not available inside web workers.

***

### ARRAY\_ITERATOR

> **ARRAY\_ITERATOR**: [`ElementaryFeature`](ElementaryFeature.md)

The property that the string representation of Array.prototype.entries\(\) starts with "\[object Array" and ends with "\]" at index 21 or 22.

#### Remarks

Available in Chrome, Edge, Firefox, Safari 7.1+, Opera, and Node.js 0.12+.

***

### ARROW

> **ARROW**: [`ElementaryFeature`](ElementaryFeature.md)

Support for arrow functions.

#### Remarks

Available in Chrome, Edge, Firefox, Safari 10.0+, Opera, and Node.js 4+.

***

### ASYNC\_FUNCTION

> **ASYNC\_FUNCTION**: [`ElementaryFeature`](ElementaryFeature.md)

Support for async functions, which return Promise object.

#### Remarks

Available in Chrome, Edge, Firefox, Safari 10.1+, Opera, and Node.js 7.6+.

***

### AT

> **AT**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the native function Array.prototype.at.

#### Remarks

Available in Chrome, Edge, Firefox, Safari 15.4+, Opera, and Node.js 16.6+.

***

### ATOB

> **ATOB**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global functions atob and btoa.

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer 10+, Safari, Opera, Android Browser, and Node.js 16.0+. This feature is not available inside web workers in Safari before 10.0.

***

### AUTO

> **AUTO**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in the current environment.

***

### BARPROP

> **BARPROP**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object statusbar having the string representation "\[object BarProp\]".

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, and Android Browser 4.4. This feature is not available inside web workers.

***

### BROWSER

> **BROWSER**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in all browsers.

No support for Node.js.

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

No support for Node.js and older browsers like Internet Explorer, Safari 17.3 or Android Browser.

***

### CONSOLE

> **CONSOLE**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object console having the string representation "\[object Console\]".

This feature may become unavailable when certain browser extensions are active.

#### Remarks

Available in Internet Explorer 10+, Safari before 14.1, and Android Browser. This feature is not available inside web workers in Safari before 7.1 and Android Browser 4.4.

***

### DEFAULT

> **DEFAULT**: [`PredefinedFeature`](PredefinedFeature.md)

Minimum feature level, compatible with all supported engines in all environments.

***

### DOCUMENT

> **DOCUMENT**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object document having the string representation "\[object Document\]".

#### Remarks

Available in Internet Explorer before 11. This feature is not available inside web workers.

***

### DOMWINDOW

> **DOMWINDOW**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object self having the string representation "\[object DOMWindow\]".

#### Remarks

Available in Android Browser before 4.4. This feature is not available inside web workers.

***

### ESC\_HTML\_ALL

> **ESC\_HTML\_ALL**: [`ElementaryFeature`](ElementaryFeature.md)

The property that double quotation mark, less than and greater than characters in the argument of String.prototype.fontcolor are escaped into their respective HTML entities.

#### Remarks

Available in Android Browser and Node.js before 0.12.

***

### ESC\_HTML\_QUOT

> **ESC\_HTML\_QUOT**: [`ElementaryFeature`](ElementaryFeature.md)

The property that double quotation marks in the argument of String.prototype.fontcolor are escaped as "\&quot;".

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser, and Node.js.

***

### ESC\_HTML\_QUOT\_ONLY

> **ESC\_HTML\_QUOT\_ONLY**: [`ElementaryFeature`](ElementaryFeature.md)

The property that only double quotation marks and no other characters in the argument of String.prototype.fontcolor are escaped into HTML entities.

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js 0.12+.

***

### ESC\_REGEXP\_LF

> **ESC\_REGEXP\_LF**: [`ElementaryFeature`](ElementaryFeature.md)

Having regular expressions created with the RegExp constructor use escape sequences starting with a backslash to format line feed characters \("\\n"\) in their string representation.

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Node.js 12+.

***

### ESC\_REGEXP\_SLASH

> **ESC\_REGEXP\_SLASH**: [`ElementaryFeature`](ElementaryFeature.md)

Having regular expressions created with the RegExp constructor use escape sequences starting with a backslash to format slashes \("/"\) in their string representation.

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Node.js 4+.

***

### FF

> **FF**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in the current stable version of Firefox.

An alias for `FF_90`.

***

### FF\_90

> **FF\_90**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Firefox 90 or later.

#### Remarks

This feature may be replaced or removed in the near future when current browser versions become obsolete. Use `FF`, `FF_ESR`, or `FF_PREV` instead of `FF_90` for long term support.

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

An alias for `FF_90`.

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

Available in Chrome, Edge, Firefox, Safari 7.1+, Opera, and Node.js 4+.

***

### FLAT

> **FLAT**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the native function Array.prototype.flat.

#### Remarks

Available in Chrome, Edge, Firefox, Safari 12+, Opera, and Node.js 11+.

***

### FROM\_CODE\_POINT

> **FROM\_CODE\_POINT**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the function String.fromCodePoint.

#### Remarks

Available in Chrome, Edge, Firefox, Safari 9+, Opera, and Node.js 4+.

***

### FUNCTION\_19\_LF

> **FUNCTION\_19\_LF**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of dynamically generated functions where the character at index 19 is a line feed \("\\n"\).

#### Remarks

Available in Chrome, Edge, Firefox, Safari 17.4+, Opera, and Node.js 10+.

***

### FUNCTION\_22\_LF

> **FUNCTION\_22\_LF**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of dynamically generated functions where the character at index 22 is a line feed \("\\n"\).

#### Remarks

Available in Internet Explorer, Safari 9+ before 17.4, Android Browser, and Node.js before 10.

***

### GENERIC\_ARRAY\_TO\_STRING

> **GENERIC\_ARRAY\_TO\_STRING**: [`ElementaryFeature`](ElementaryFeature.md)

Ability to call Array.prototype.toString with a non-array binding.

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, Android Browser 4.1+, and Node.js.

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

Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari, Opera, Android Browser, and Node.js.

***

### HISTORY

> **HISTORY**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object history having the string representation "\[object History\]".

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser. This feature is not available inside web workers.

***

### HTMLAUDIOELEMENT

> **HTMLAUDIOELEMENT**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object Audio whose string representation starts with "function HTMLAudioElement".

#### Remarks

Available in Android Browser 4.4. This feature is not available inside web workers.

***

### HTMLDOCUMENT

> **HTMLDOCUMENT**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object document having the string representation "\[object HTMLDocument\]".

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari, Opera, and Android Browser. This feature is not available inside web workers.

***

### IE\_10

> **IE\_10**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Internet Explorer 10.

***

### IE\_11

> **IE\_11**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Internet Explorer 11.

***

### IE\_11\_WIN\_10

> **IE\_11\_WIN\_10**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Internet Explorer 11 on Windows 10.

***

### IE\_9

> **IE\_9**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Internet Explorer 9.

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

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, Android Browser, and Node.js. This feature is not available when strict mode is enforced in Chrome, Edge, Firefox, Internet Explorer 10+, Safari, Opera, and Node.js 5+.

***

### INTL

> **INTL**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object Intl.

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari 10.0+, Opera, Android Browser 4.4, and Node.js 0.12+.

***

### ITERATOR\_HELPER

> **ITERATOR\_HELPER**: [`ElementaryFeature`](ElementaryFeature.md)

Availability of iterator helpers.

#### Remarks

Available in Chrome, Edge, Opera, and Node.js 22+.

***

### JAPANESE\_INFINITY

> **JAPANESE\_INFINITY**: [`ElementaryFeature`](ElementaryFeature.md)

Japanese string representation of Infinity ending with "∞".

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari 10.0+, Opera, Android Browser 4.4, and Node.js 0.12+.

***

### LOCALE\_INFINITY

> **LOCALE\_INFINITY**: [`ElementaryFeature`](ElementaryFeature.md)

Language sensitive string representation of Infinity as "∞".

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer 11 on Windows 10, Safari 10.0+, Opera, Android Browser 4.4, and Node.js 0.12+.

***

### LOCALE\_NUMERALS

> **LOCALE\_NUMERALS**: [`ElementaryFeature`](ElementaryFeature.md)

Features shared by all engines capable of localized number formatting, including output of Arabic digits, the Arabic decimal separator "٫", the letters in the first word of the Arabic string representation of NaN \("ليس"\), Persian digits and the Persian digit group separator "٬".

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari 10.0+, Opera, Android Browser 4.4, and Node.js 13+.

***

### LOCALE\_NUMERALS\_EXT

> **LOCALE\_NUMERALS\_EXT**: [`ElementaryFeature`](ElementaryFeature.md)

Extended localized number formatting.

This includes all features of LOCALE_NUMERALS plus the output of the first three letters in the second word of the Arabic string representation of NaN \("رقم"\), Bengali digits, the letters in the Russian string representation of NaN \("не число"\) and the letters in the Persian string representation of NaN \("ناعدد"\).

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer 11 on Windows 10, Safari 10.0+, Opera, Android Browser 4.4, and Node.js 13+.

***

### LOCATION

> **LOCATION**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object location with the property that Object.prototype.toString.call\(location\) evaluates to a string that starts with "\[object " and ends with "Location\]".

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, and Android Browser.

***

### NAME

> **NAME**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the name property for functions.

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser, and Node.js.

***

### NODECONSTRUCTOR

> **NODECONSTRUCTOR**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object Node having the string representation "\[object NodeConstructor\]".

#### Remarks

Available in Safari before 10.0. This feature is not available inside web workers.

***

### NODE\_0\_10

> **NODE\_0\_10**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 0.10.

***

### NODE\_0\_12

> **NODE\_0\_12**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 0.12.

***

### NODE\_10

> **NODE\_10**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 10.

***

### NODE\_11

> **NODE\_11**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 11.

***

### NODE\_12

> **NODE\_12**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 12.

***

### NODE\_13

> **NODE\_13**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 13 and Node.js 14.

***

### NODE\_15

> **NODE\_15**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 15.

***

### NODE\_16\_0

> **NODE\_16\_0**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 16.0 to 16.5.

***

### NODE\_16\_6

> **NODE\_16\_6**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 16.6 to 21.

***

### NODE\_22

> **NODE\_22**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 22 or later.

***

### NODE\_4

> **NODE\_4**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 4.

***

### NODE\_5

> **NODE\_5**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 5 to 7.5.

***

### NODE\_7\_6

> **NODE\_7\_6**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Node.js 7.6 to 9.

***

### NO\_FF\_SRC

> **NO\_FF\_SRC**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of native functions typical for V8 or for Internet Explorer but not for Firefox and Safari.

#### Remarks

Available in Chrome, Edge, Internet Explorer, Opera, Android Browser, and Node.js.

***

### NO\_IE\_SRC

> **NO\_IE\_SRC**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of native functions typical for most engines with the notable exception of Internet Explorer.

A remarkable trait of this feature is the lack of line feed characters at the beginning and at the end of the string.

#### Remarks

Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser, and Node.js.

***

### NO\_OLD\_SAFARI\_ARRAY\_ITERATOR

> **NO\_OLD\_SAFARI\_ARRAY\_ITERATOR**: [`ElementaryFeature`](ElementaryFeature.md)

The property that the string representation of Array.prototype.entries\(\) evaluates to "\[object Array Iterator\]".

#### Remarks

Available in Chrome, Edge, Firefox, Safari 9+, Opera, and Node.js 0.12+.

***

### NO\_V8\_SRC

> **NO\_V8\_SRC**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of native functions typical for Firefox, Internet Explorer and Safari.

A most remarkable trait of this feature is the presence of a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.

#### Remarks

Available in Firefox, Internet Explorer, and Safari.

***

### OBJECT\_ARRAY\_ENTRIES\_CTOR

> **OBJECT\_ARRAY\_ENTRIES\_CTOR**: [`ElementaryFeature`](ElementaryFeature.md)

The property that the Array.prototype.entries\(\).constructor is the Object constructor.

#### Remarks

Available in Firefox, Safari 9+, and Node.js 0.12+ before 22.

***

### OBJECT\_L\_LOCATION\_CTOR

> **OBJECT\_L\_LOCATION\_CTOR**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global function location.constructor whose string representation starts with "\[object L".

#### Remarks

Available in Internet Explorer and Safari before 10.0. This feature is not available inside web workers.

***

### OBJECT\_UNDEFINED

> **OBJECT\_UNDEFINED**: [`ElementaryFeature`](ElementaryFeature.md)

Having the function Object.prototype.toString return the string "\[object Undefined\]" when invoked without a binding.

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer 10+, Safari, Opera, Android Browser 4.1+, and Node.js.

***

### OBJECT\_W\_CTOR

> **OBJECT\_W\_CTOR**: [`ElementaryFeature`](ElementaryFeature.md)

The property that the string representation of the global object constructor starts with "\[object W".

#### Remarks

Available in Internet Explorer and Safari before 10.0. This feature is not available inside web workers in Safari before 10.0.

***

### OLD\_SAFARI\_LOCATION\_CTOR

> **OLD\_SAFARI\_LOCATION\_CTOR**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object location.constructor whose string representation starts with "\[object " and ends with "LocationConstructor\]".

#### Remarks

Available in Safari before 10.0.

***

### PLAIN\_INTL

> **PLAIN\_INTL**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object Intl having the string representation "\[object Object\]".

#### Remarks

Available in Internet Explorer 11, Safari 10.0+ before 14.0.1, Android Browser 4.4, and Node.js 0.12+ before 15.

***

### REGEXP\_STRING\_ITERATOR

> **REGEXP\_STRING\_ITERATOR**: [`ElementaryFeature`](ElementaryFeature.md)

The property that the string representation of String.prototype.matchAll\(\) evaluates to "\[object RegExp String Iterator\]".

#### Remarks

Available in Chrome, Edge, Firefox, Safari 13+, Opera, and Node.js 12+.

***

### SAFARI

> **SAFARI**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in the current stable version of Safari.

An alias for `SAFARI_17_4`.

***

### SAFARI\_10\_0

> **SAFARI\_10\_0**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 10.0.

***

### SAFARI\_10\_1

> **SAFARI\_10\_1**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 10.1 and Safari 11.

***

### SAFARI\_12

> **SAFARI\_12**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 12.

***

### SAFARI\_13

> **SAFARI\_13**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 13 and Safari 14.0.0.

***

### SAFARI\_14\_0\_1

> **SAFARI\_14\_0\_1**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 14.0.1 to 14.0.3.

***

### SAFARI\_14\_1

> **SAFARI\_14\_1**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 14.1 to 15.3.

***

### SAFARI\_15\_4

> **SAFARI\_15\_4**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 15.4 to 17.3.

***

### SAFARI\_17\_4

> **SAFARI\_17\_4**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 17.4 or later.

***

### SAFARI\_7\_0

> **SAFARI\_7\_0**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 7.0.

***

### SAFARI\_7\_1

> **SAFARI\_7\_1**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 7.1 and Safari 8.

***

### SAFARI\_9

> **SAFARI\_9**: [`PredefinedFeature`](PredefinedFeature.md)

Features available in Safari 9.

***

### SELF

> **SELF**: [`ElementaryFeature`](ElementaryFeature.md)

An alias for `ANY_WINDOW`.

***

### SELF\_OBJ

> **SELF\_OBJ**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object self whose string representation starts with "\[object ".

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser. This feature is not available inside web workers in Safari 7.1+ before 10.0.

***

### SHORT\_LOCALES

> **SHORT\_LOCALES**: [`ElementaryFeature`](ElementaryFeature.md)

Support for the two-letter locale name "ar" to format decimal numbers as Arabic numerals.

#### Remarks

Available in Firefox, Internet Explorer 11, Safari 10.0+, Android Browser 4.4, and Node.js 13+.

***

### STATUS

> **STATUS**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global string status.

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser. This feature is not available inside web workers.

***

### UNDEFINED

> **UNDEFINED**: [`ElementaryFeature`](ElementaryFeature.md)

The property that Object.prototype.toString.call\(\) evaluates to "\[object Undefined\]".

This behavior is specified by ECMAScript, and is enforced by all engines except Android Browser versions prior to 4.1.2, where this feature is not available.

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, Android Browser 4.1+, and Node.js.

***

### V8\_SRC

> **V8\_SRC**: [`ElementaryFeature`](ElementaryFeature.md)

A string representation of native functions typical for the V8 engine.

Remarkable traits are the lack of line feed characters at the beginning and at the end of the string and the presence of a single whitespace before the "\[native code\]" sequence.

#### Remarks

Available in Chrome, Edge, Opera, Android Browser, and Node.js.

***

### WINDOW

> **WINDOW**: [`ElementaryFeature`](ElementaryFeature.md)

Existence of the global object self having the string representation "\[object Window\]".

#### Remarks

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser 4.4. This feature is not available inside web workers.
