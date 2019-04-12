# JScrewIt Feature Reference
## Feature List
This section lists all features along with their descriptions.
<a name="ANDRO_4_0"></a>
### `ANDRO_4_0`
Features available in Android Browser 4.0.
<a name="ANDRO_4_1"></a>
### `ANDRO_4_1`
Features available in Android Browser 4.1 to 4.3.
<a name="ANDRO_4_4"></a>
### `ANDRO_4_4`
Features available in Android Browser 4.4.
<a name="ANY_DOCUMENT"></a>
### `ANY_DOCUMENT`
Existence of the global object document whose string representation starts with "\[object " and ends with "Document\]".

_Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers._
<a name="ANY_WINDOW"></a>
### `ANY_WINDOW`
Existence of the global object self whose string representation starts with "\[object " and ends with "Window\]".

_Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers._
<a name="ARRAY_ITERATOR"></a>
### `ARRAY_ITERATOR`
The property that the string representation of Array.prototype.entries\(\) starts with "\[object Array" and ends with "\]" at index 21 or 22.

_Available in Chrome, Edge, Firefox, Safari 7.1+, Opera and Node.js 0.12+._
<a name="ARROW"></a>
### `ARROW`
Support for arrow functions.

_Available in Chrome, Edge, Firefox, Safari 10+, Opera and Node.js 4+._
<a name="ATOB"></a>
### `ATOB`
Existence of the global functions atob and btoa.

_Available in Chrome, Edge, Firefox, Internet Explorer 10+, Safari, Opera and Android Browser. This feature is not available inside web workers in Safari before 10._
<a name="AUTO"></a>
### `AUTO`
All features available in the current engine.
<a name="BARPROP"></a>
### `BARPROP`
Existence of the global object statusbar having the string representation "\[object BarProp\]".

_Available in Chrome, Edge, Firefox, Safari, Opera and Android Browser 4.4. This feature is not available inside web workers._
<a name="BROWSER"></a>
### `BROWSER`
Features available in all browsers.<br>
No support for Node.js.
<a name="CAPITAL_HTML"></a>
### `CAPITAL_HTML`
The property that the various string methods returning HTML code such as String.prototype.big or String.prototype.link have both the tag name and attributes written in capital letters.

_Available in Internet Explorer._
<a name="CHROME"></a>
### `CHROME`
_An alias for [`CHROME_73`](#CHROME_73)._
<a name="CHROME_69"></a>
### `CHROME_69`
Features available in Chrome 69 and Opera 56 or later.
<a name="CHROME_73"></a>
### `CHROME_73`
Features available in Chrome 73 and Opera 60 or later.
<a name="CHROME_PREV"></a>
### `CHROME_PREV`
_An alias for [`CHROME_69`](#CHROME_69)._
<a name="COMPACT"></a>
### `COMPACT`
All new browsers' features.<br>
No support for Node.js and older browsers like Internet Explorer, Safari 9 or Android Browser.
<a name="CONSOLE"></a>
### `CONSOLE`
Existence of the global object console having the string representation "\[object Console\]".<br>
This feature may become unavailable when certain browser extensions are active.

_Available in Firefox, Internet Explorer 10+, Safari and Android Browser. This feature is not available inside web workers in Safari before 7.1 and Android Browser 4.4._
<a name="DEFAULT"></a>
### `DEFAULT`
Minimum feature level, compatible with all supported engines in all environments.
<a name="DOCUMENT"></a>
### `DOCUMENT`
Existence of the global object document having the string representation "\[object Document\]".

_Available in Internet Explorer before 11. This feature is not available inside web workers._
<a name="DOMWINDOW"></a>
### `DOMWINDOW`
Existence of the global object self having the string representation "\[object DOMWindow\]".

_Available in Android Browser before 4.4. This feature is not available inside web workers._
<a name="EDGE"></a>
### `EDGE`
_An alias for [`EDGE_40`](#EDGE_40)._
<a name="EDGE_40"></a>
### `EDGE_40`
Features available in Edge 40 or later.
<a name="EDGE_PREV"></a>
### `EDGE_PREV`
_An alias for [`EDGE_40`](#EDGE_40)._
<a name="ESC_HTML_ALL"></a>
### `ESC_HTML_ALL`
The property that double quotation mark, less than and greater than characters in the argument of String.prototype.fontcolor are escaped into their respective HTML entities.

_Available in Android Browser and Node.js before 0.12._
<a name="ESC_HTML_QUOT"></a>
### `ESC_HTML_QUOT`
The property that double quotation marks in the argument of String.prototype.fontcolor are escaped as "\&quot;".

_Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser and Node.js._
<a name="ESC_HTML_QUOT_ONLY"></a>
### `ESC_HTML_QUOT_ONLY`
The property that only double quotation marks and no other characters in the argument of String.prototype.fontcolor are escaped into HTML entities.

_Available in Chrome, Edge, Firefox, Safari, Opera and Node.js 0.12+._
<a name="ESC_REGEXP_LF"></a>
### `ESC_REGEXP_LF`
Having regular expressions created with the RegExp constructor use escape sequences starting with a backslash to format line feed characters \("\\n"\) in their string representation.

_Available in Edge, Firefox, Internet Explorer and Safari._
<a name="ESC_REGEXP_SLASH"></a>
### `ESC_REGEXP_SLASH`
Having regular expressions created with the RegExp constructor use escape sequences starting with a backslash to format slashes \("/"\) in their string representation.

_Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Node.js 4+._
<a name="EXTERNAL"></a>
### `EXTERNAL`
Existence of the global object sidebar having the string representation "\[object External\]".

_Available in Firefox. This feature is not available inside web workers._
<a name="FF"></a>
### `FF`
_An alias for [`FF_62`](#FF_62)._
<a name="FF_54"></a>
### `FF_54`
Features available in Firefox 54 or later.
<a name="FF_62"></a>
### `FF_62`
Features available in Firefox 62 or later.
<a name="FF_ESR"></a>
### `FF_ESR`
_An alias for [`FF_54`](#FF_54)._
<a name="FF_SRC"></a>
### `FF_SRC`
A string representation of native functions typical for Firefox and Safari.<br>
Remarkable traits are the lack of line feed characters at the beginning and at the end of the string and the presence of a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.

_Available in Firefox and Safari._
<a name="FILL"></a>
### `FILL`
Existence of the native function Array.prototype.fill.

_Available in Chrome, Edge, Firefox, Safari 7.1+, Opera and Node.js 4+._
<a name="FLAT"></a>
### `FLAT`
Existence of the native function Array.prototype.flat.

_Available in Chrome, Firefox 62+, Safari 12+, Opera and Node.js 11+._
<a name="FROM_CODE_POINT"></a>
### `FROM_CODE_POINT`
Existence of the function String.fromCodePoint.

_Available in Chrome, Edge, Firefox, Safari 9+, Opera and Node.js 4+._
<a name="FUNCTION_19_LF"></a>
### `FUNCTION_19_LF`
A string representation of dynamically generated functions where the character at index 19 is a line feed \("\\n"\).

_Available in Chrome, Edge, Firefox, Opera and Node.js 10+._
<a name="FUNCTION_22_LF"></a>
### `FUNCTION_22_LF`
A string representation of dynamically generated functions where the character at index 22 is a line feed \("\\n"\).

_Available in Internet Explorer, Safari 9+, Android Browser and Node.js before 10._
<a name="GMT"></a>
### `GMT`
Presence of the text "GMT" after the first 25 characters in the string returned by Date\(\).<br>
The string representation of dates is implementation dependent, but most engines use a similar format, making this feature available in all supported engines except Internet Explorer 9 and 10.

_Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari, Opera, Android Browser and Node.js._
<a name="HISTORY"></a>
### `HISTORY`
Existence of the global object history having the string representation "\[object History\]".

_Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers._
<a name="HTMLAUDIOELEMENT"></a>
### `HTMLAUDIOELEMENT`
Existence of the global object Audio whose string representation starts with "function HTMLAudioElement".

_Available in Android Browser 4.4. This feature is not available inside web workers._
<a name="HTMLDOCUMENT"></a>
### `HTMLDOCUMENT`
Existence of the global object document having the string representation "\[object HTMLDocument\]".

_Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari, Opera and Android Browser. This feature is not available inside web workers._
<a name="IE_10"></a>
### `IE_10`
Features available in Internet Explorer 10.
<a name="IE_11"></a>
### `IE_11`
Features available in Internet Explorer 11.
<a name="IE_11_WIN_10"></a>
### `IE_11_WIN_10`
Features available in Internet Explorer 11 on Windows 10.
<a name="IE_9"></a>
### `IE_9`
Features available in Internet Explorer 9.
<a name="IE_SRC"></a>
### `IE_SRC`
A string representation of native functions typical for Internet Explorer.<br>
Remarkable traits are the presence of a line feed character \("\\n"\) at the beginning and at the end of the string and a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.

_Available in Internet Explorer._
<a name="INCR_CHAR"></a>
### `INCR_CHAR`
The ability to use unary increment operators with string characters, like in \( ++"some string"\[0\] \): this will result in a TypeError in strict mode in ECMAScript compliant engines.

_Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, Android Browser and Node.js. This feature is not available when strict mode is enforced in Chrome, Edge, Firefox, Internet Explorer 10+, Safari, Opera and Node.js 5+._
<a name="INTL"></a>
### `INTL`
Existence of the global object Intl.

_Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari 10+, Opera, Android Browser 4.4 and Node.js 0.12+._
<a name="LOCALE_INFINITY"></a>
### `LOCALE_INFINITY`
Language sensitive string representation of Infinity as "∞".

_Available in Chrome, Edge, Firefox, Internet Explorer 11 on Windows 10, Safari 10+, Opera, Android Browser 4.4 and Node.js 0.12+._
<a name="NAME"></a>
### `NAME`
Existence of the name property for functions.

_Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser and Node.js._
<a name="NODECONSTRUCTOR"></a>
### `NODECONSTRUCTOR`
Existence of the global object Node having the string representation "\[object NodeConstructor\]".

_Available in Safari before 10. This feature is not available inside web workers._
<a name="NODE_0_10"></a>
### `NODE_0_10`
Features available in Node.js 0.10.
<a name="NODE_0_12"></a>
### `NODE_0_12`
Features available in Node.js 0.12.
<a name="NODE_10"></a>
### `NODE_10`
Features available in Node.js 10.
<a name="NODE_11"></a>
### `NODE_11`
Features available in Node.js 11 or later.
<a name="NODE_4"></a>
### `NODE_4`
Features available in Node.js 4.
<a name="NODE_5"></a>
### `NODE_5`
Features available in Node.js 5 to 9.
<a name="NO_FF_SRC"></a>
### `NO_FF_SRC`
A string representation of native functions typical for V8 and Edge or for Internet Explorer but not for Firefox and Safari.

_Available in Chrome, Edge, Internet Explorer, Opera, Android Browser and Node.js._
<a name="NO_IE_SRC"></a>
### `NO_IE_SRC`
A string representation of native functions typical for most engines with the notable exception of Internet Explorer.<br>
A remarkable trait of this feature is the lack of line feed characters at the beginning and at the end of the string.

_Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser and Node.js._
<a name="NO_OLD_SAFARI_ARRAY_ITERATOR"></a>
### `NO_OLD_SAFARI_ARRAY_ITERATOR`
The property that the string representation of Array.prototype.entries\(\) evaluates to "\[object Array Iterator\]".

_Available in Chrome, Edge, Firefox, Safari 9+, Opera and Node.js 0.12+._
<a name="NO_V8_SRC"></a>
### `NO_V8_SRC`
A string representation of native functions typical for Firefox, Internet Explorer and Safari.<br>
A most remarkable trait of this feature is the presence of a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.

_Available in Firefox, Internet Explorer and Safari._
<a name="SAFARI"></a>
### `SAFARI`
_An alias for [`SAFARI_12`](#SAFARI_12)._
<a name="SAFARI_10"></a>
### `SAFARI_10`
Features available in Safari 10 or later.
<a name="SAFARI_12"></a>
### `SAFARI_12`
Features available in Safari 12 or later.
<a name="SAFARI_7_0"></a>
### `SAFARI_7_0`
Features available in Safari 7.0.
<a name="SAFARI_7_1"></a>
### `SAFARI_7_1`
Features available in Safari 7.1 and Safari 8.
<a name="SAFARI_8"></a>
### `SAFARI_8`
_An alias for [`SAFARI_7_1`](#SAFARI_7_1)._
<a name="SAFARI_9"></a>
### `SAFARI_9`
Features available in Safari 9.
<a name="SELF"></a>
### `SELF`
_An alias for [`ANY_WINDOW`](#ANY_WINDOW)._
<a name="SELF_OBJ"></a>
### `SELF_OBJ`
Existence of the global object self whose string representation starts with "\[object ".

_Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers in Safari 7.1+ before 10._
<a name="STATUS"></a>
### `STATUS`
Existence of the global string status.

_Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers._
<a name="UNDEFINED"></a>
### `UNDEFINED`
The property that Object.prototype.toString.call\(\) evaluates to "\[object Undefined\]".<br>
This behavior is specified by ECMAScript, and is enforced by all engines except Android Browser versions prior to 4.1.2, where this feature is not available.

_Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, Android Browser 4.1+ and Node.js._
<a name="UNEVAL"></a>
### `UNEVAL`
Existence of the global function uneval.

_Available in Firefox._
<a name="V8_SRC"></a>
### `V8_SRC`
A string representation of native functions typical for the V8 engine, but also found in Edge.<br>
Remarkable traits are the lack of line feed characters at the beginning and at the end of the string and the presence of a single whitespace before the "\[native code\]" sequence.

_Available in Chrome, Edge, Opera, Android Browser and Node.js._
<a name="WINDOW"></a>
### `WINDOW`
Existence of the global object self having the string representation "\[object Window\]".

_Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser 4.4. This feature is not available inside web workers._
## Engine Support
This table lists features available in the most common engines.
<table>
<tr>
<th>Target</th>
<th>Features</th>
</tr>
<tr>
<td>Chrome 69+, Opera 56+</td>
<td>
<ul>
<li><a href="#ANY_DOCUMENT"><code>ANY_DOCUMENT</code></a> (implied by <a href="#HTMLDOCUMENT"><code>HTMLDOCUMENT</code></a>)
<li><a href="#ANY_WINDOW"><code>ANY_WINDOW</code></a> (implied by <a href="#WINDOW"><code>WINDOW</code></a>)
<li><a href="#ARRAY_ITERATOR"><code>ARRAY_ITERATOR</code></a> (implied by <a href="#NO_OLD_SAFARI_ARRAY_ITERATOR"><code>NO_OLD_SAFARI_ARRAY_ITERATOR</code></a>)
<li><a href="#ARROW"><code>ARROW</code></a>
<li><a href="#ATOB"><code>ATOB</code></a>
<li><a href="#BARPROP"><code>BARPROP</code></a>
<li><a href="#ESC_HTML_QUOT"><code>ESC_HTML_QUOT</code></a> (implied by <a href="#ESC_HTML_QUOT_ONLY"><code>ESC_HTML_QUOT_ONLY</code></a>)
<li><a href="#ESC_HTML_QUOT_ONLY"><code>ESC_HTML_QUOT_ONLY</code></a>
<li><a href="#ESC_REGEXP_SLASH"><code>ESC_REGEXP_SLASH</code></a>
<li><a href="#FILL"><code>FILL</code></a>
<li><a href="#FLAT"><code>FLAT</code></a>
<li><a href="#FROM_CODE_POINT"><code>FROM_CODE_POINT</code></a>
<li><a href="#FUNCTION_19_LF"><code>FUNCTION_19_LF</code></a>
<li><a href="#GMT"><code>GMT</code></a>
<li><a href="#HISTORY"><code>HISTORY</code></a>
<li><a href="#HTMLDOCUMENT"><code>HTMLDOCUMENT</code></a>
<li><a href="#INCR_CHAR"><code>INCR_CHAR</code></a>
<li><a href="#INTL"><code>INTL</code></a>
<li><a href="#LOCALE_INFINITY"><code>LOCALE_INFINITY</code></a>
<li><a href="#NAME"><code>NAME</code></a>
<li><a href="#NO_FF_SRC"><code>NO_FF_SRC</code></a> (implied by <a href="#V8_SRC"><code>V8_SRC</code></a>)
<li><a href="#NO_IE_SRC"><code>NO_IE_SRC</code></a> (implied by <a href="#V8_SRC"><code>V8_SRC</code></a>)
<li><a href="#NO_OLD_SAFARI_ARRAY_ITERATOR"><code>NO_OLD_SAFARI_ARRAY_ITERATOR</code></a>
<li><a href="#SELF_OBJ"><code>SELF_OBJ</code></a> (implied by <a href="#ANY_WINDOW"><code>ANY_WINDOW</code></a> and <a href="#WINDOW"><code>WINDOW</code></a>)
<li><a href="#STATUS"><code>STATUS</code></a>
<li><a href="#UNDEFINED"><code>UNDEFINED</code></a>
<li><a href="#V8_SRC"><code>V8_SRC</code></a>
<li><a href="#WINDOW"><code>WINDOW</code></a>
</ul>
</td>
</tr>
<tr>
<td>Edge 40+</td>
<td>
<ul>
<li><a href="#ANY_DOCUMENT"><code>ANY_DOCUMENT</code></a> (implied by <a href="#HTMLDOCUMENT"><code>HTMLDOCUMENT</code></a>)
<li><a href="#ANY_WINDOW"><code>ANY_WINDOW</code></a> (implied by <a href="#WINDOW"><code>WINDOW</code></a>)
<li><a href="#ARRAY_ITERATOR"><code>ARRAY_ITERATOR</code></a> (implied by <a href="#NO_OLD_SAFARI_ARRAY_ITERATOR"><code>NO_OLD_SAFARI_ARRAY_ITERATOR</code></a>)
<li><a href="#ARROW"><code>ARROW</code></a>
<li><a href="#ATOB"><code>ATOB</code></a>
<li><a href="#BARPROP"><code>BARPROP</code></a>
<li><a href="#ESC_HTML_QUOT"><code>ESC_HTML_QUOT</code></a> (implied by <a href="#ESC_HTML_QUOT_ONLY"><code>ESC_HTML_QUOT_ONLY</code></a>)
<li><a href="#ESC_HTML_QUOT_ONLY"><code>ESC_HTML_QUOT_ONLY</code></a>
<li><a href="#ESC_REGEXP_LF"><code>ESC_REGEXP_LF</code></a>
<li><a href="#ESC_REGEXP_SLASH"><code>ESC_REGEXP_SLASH</code></a>
<li><a href="#FILL"><code>FILL</code></a>
<li><a href="#FROM_CODE_POINT"><code>FROM_CODE_POINT</code></a>
<li><a href="#FUNCTION_19_LF"><code>FUNCTION_19_LF</code></a>
<li><a href="#GMT"><code>GMT</code></a>
<li><a href="#HISTORY"><code>HISTORY</code></a>
<li><a href="#HTMLDOCUMENT"><code>HTMLDOCUMENT</code></a>
<li><a href="#INCR_CHAR"><code>INCR_CHAR</code></a>
<li><a href="#INTL"><code>INTL</code></a>
<li><a href="#LOCALE_INFINITY"><code>LOCALE_INFINITY</code></a>
<li><a href="#NAME"><code>NAME</code></a>
<li><a href="#NO_FF_SRC"><code>NO_FF_SRC</code></a> (implied by <a href="#V8_SRC"><code>V8_SRC</code></a>)
<li><a href="#NO_IE_SRC"><code>NO_IE_SRC</code></a> (implied by <a href="#V8_SRC"><code>V8_SRC</code></a>)
<li><a href="#NO_OLD_SAFARI_ARRAY_ITERATOR"><code>NO_OLD_SAFARI_ARRAY_ITERATOR</code></a>
<li><a href="#SELF_OBJ"><code>SELF_OBJ</code></a> (implied by <a href="#ANY_WINDOW"><code>ANY_WINDOW</code></a> and <a href="#WINDOW"><code>WINDOW</code></a>)
<li><a href="#STATUS"><code>STATUS</code></a>
<li><a href="#UNDEFINED"><code>UNDEFINED</code></a>
<li><a href="#V8_SRC"><code>V8_SRC</code></a>
<li><a href="#WINDOW"><code>WINDOW</code></a>
</ul>
</td>
</tr>
<tr>
<td>Firefox 54+</td>
<td>
<ul>
<li><a href="#ANY_DOCUMENT"><code>ANY_DOCUMENT</code></a> (implied by <a href="#HTMLDOCUMENT"><code>HTMLDOCUMENT</code></a>)
<li><a href="#ANY_WINDOW"><code>ANY_WINDOW</code></a> (implied by <a href="#WINDOW"><code>WINDOW</code></a>)
<li><a href="#ARRAY_ITERATOR"><code>ARRAY_ITERATOR</code></a> (implied by <a href="#NO_OLD_SAFARI_ARRAY_ITERATOR"><code>NO_OLD_SAFARI_ARRAY_ITERATOR</code></a>)
<li><a href="#ARROW"><code>ARROW</code></a>
<li><a href="#ATOB"><code>ATOB</code></a>
<li><a href="#BARPROP"><code>BARPROP</code></a>
<li><a href="#CONSOLE"><code>CONSOLE</code></a>
<li><a href="#ESC_HTML_QUOT"><code>ESC_HTML_QUOT</code></a> (implied by <a href="#ESC_HTML_QUOT_ONLY"><code>ESC_HTML_QUOT_ONLY</code></a>)
<li><a href="#ESC_HTML_QUOT_ONLY"><code>ESC_HTML_QUOT_ONLY</code></a>
<li><a href="#ESC_REGEXP_LF"><code>ESC_REGEXP_LF</code></a>
<li><a href="#ESC_REGEXP_SLASH"><code>ESC_REGEXP_SLASH</code></a>
<li><a href="#EXTERNAL"><code>EXTERNAL</code></a>
<li><a href="#FF_SRC"><code>FF_SRC</code></a>
<li><a href="#FILL"><code>FILL</code></a>
<li><a href="#FLAT"><code>FLAT</code></a> (Firefox 62+)
<li><a href="#FROM_CODE_POINT"><code>FROM_CODE_POINT</code></a>
<li><a href="#FUNCTION_19_LF"><code>FUNCTION_19_LF</code></a>
<li><a href="#GMT"><code>GMT</code></a>
<li><a href="#HISTORY"><code>HISTORY</code></a>
<li><a href="#HTMLDOCUMENT"><code>HTMLDOCUMENT</code></a>
<li><a href="#INCR_CHAR"><code>INCR_CHAR</code></a>
<li><a href="#INTL"><code>INTL</code></a>
<li><a href="#LOCALE_INFINITY"><code>LOCALE_INFINITY</code></a>
<li><a href="#NAME"><code>NAME</code></a>
<li><a href="#NO_IE_SRC"><code>NO_IE_SRC</code></a> (implied by <a href="#FF_SRC"><code>FF_SRC</code></a>)
<li><a href="#NO_OLD_SAFARI_ARRAY_ITERATOR"><code>NO_OLD_SAFARI_ARRAY_ITERATOR</code></a>
<li><a href="#NO_V8_SRC"><code>NO_V8_SRC</code></a> (implied by <a href="#FF_SRC"><code>FF_SRC</code></a>)
<li><a href="#SELF_OBJ"><code>SELF_OBJ</code></a> (implied by <a href="#ANY_WINDOW"><code>ANY_WINDOW</code></a> and <a href="#WINDOW"><code>WINDOW</code></a>)
<li><a href="#STATUS"><code>STATUS</code></a>
<li><a href="#UNDEFINED"><code>UNDEFINED</code></a>
<li><a href="#UNEVAL"><code>UNEVAL</code></a>
<li><a href="#WINDOW"><code>WINDOW</code></a>
</ul>
</td>
</tr>
<tr>
<td>Internet Explorer 9+</td>
<td>
<ul>
<li><a href="#ANY_DOCUMENT"><code>ANY_DOCUMENT</code></a> (implied by <a href="#DOCUMENT"><code>DOCUMENT</code></a> and <a href="#HTMLDOCUMENT"><code>HTMLDOCUMENT</code></a>)
<li><a href="#ANY_WINDOW"><code>ANY_WINDOW</code></a> (implied by <a href="#WINDOW"><code>WINDOW</code></a>)
<li><a href="#ATOB"><code>ATOB</code></a> (Internet Explorer 10+)
<li><a href="#CAPITAL_HTML"><code>CAPITAL_HTML</code></a>
<li><a href="#CONSOLE"><code>CONSOLE</code></a> (Internet Explorer 10+)
<li><a href="#DOCUMENT"><code>DOCUMENT</code></a> (not in Internet Explorer 11)
<li><a href="#ESC_REGEXP_LF"><code>ESC_REGEXP_LF</code></a>
<li><a href="#ESC_REGEXP_SLASH"><code>ESC_REGEXP_SLASH</code></a>
<li><a href="#FUNCTION_22_LF"><code>FUNCTION_22_LF</code></a>
<li><a href="#GMT"><code>GMT</code></a> (Internet Explorer 11)
<li><a href="#HISTORY"><code>HISTORY</code></a>
<li><a href="#HTMLDOCUMENT"><code>HTMLDOCUMENT</code></a> (Internet Explorer 11)
<li><a href="#IE_SRC"><code>IE_SRC</code></a>
<li><a href="#INCR_CHAR"><code>INCR_CHAR</code></a>
<li><a href="#INTL"><code>INTL</code></a> (Internet Explorer 11)
<li><a href="#LOCALE_INFINITY"><code>LOCALE_INFINITY</code></a> (Internet Explorer 11 on Windows 10)
<li><a href="#NO_FF_SRC"><code>NO_FF_SRC</code></a> (implied by <a href="#IE_SRC"><code>IE_SRC</code></a>)
<li><a href="#NO_V8_SRC"><code>NO_V8_SRC</code></a> (implied by <a href="#IE_SRC"><code>IE_SRC</code></a>)
<li><a href="#SELF_OBJ"><code>SELF_OBJ</code></a> (implied by <a href="#ANY_WINDOW"><code>ANY_WINDOW</code></a> and <a href="#WINDOW"><code>WINDOW</code></a>)
<li><a href="#STATUS"><code>STATUS</code></a>
<li><a href="#UNDEFINED"><code>UNDEFINED</code></a>
<li><a href="#WINDOW"><code>WINDOW</code></a>
</ul>
</td>
</tr>
<tr>
<td>Safari 7.0+</td>
<td>
<ul>
<li><a href="#ANY_DOCUMENT"><code>ANY_DOCUMENT</code></a> (implied by <a href="#HTMLDOCUMENT"><code>HTMLDOCUMENT</code></a>)
<li><a href="#ANY_WINDOW"><code>ANY_WINDOW</code></a> (implied by <a href="#WINDOW"><code>WINDOW</code></a>)
<li><a href="#ARRAY_ITERATOR"><code>ARRAY_ITERATOR</code></a> (implied by <a href="#NO_OLD_SAFARI_ARRAY_ITERATOR"><code>NO_OLD_SAFARI_ARRAY_ITERATOR</code></a>; Safari 7.1+)
<li><a href="#ARROW"><code>ARROW</code></a> (Safari 10+)
<li><a href="#ATOB"><code>ATOB</code></a>
<li><a href="#BARPROP"><code>BARPROP</code></a>
<li><a href="#CONSOLE"><code>CONSOLE</code></a>
<li><a href="#ESC_HTML_QUOT"><code>ESC_HTML_QUOT</code></a> (implied by <a href="#ESC_HTML_QUOT_ONLY"><code>ESC_HTML_QUOT_ONLY</code></a>)
<li><a href="#ESC_HTML_QUOT_ONLY"><code>ESC_HTML_QUOT_ONLY</code></a>
<li><a href="#ESC_REGEXP_LF"><code>ESC_REGEXP_LF</code></a>
<li><a href="#ESC_REGEXP_SLASH"><code>ESC_REGEXP_SLASH</code></a>
<li><a href="#FF_SRC"><code>FF_SRC</code></a>
<li><a href="#FILL"><code>FILL</code></a> (Safari 7.1+)
<li><a href="#FLAT"><code>FLAT</code></a> (Safari 12+)
<li><a href="#FROM_CODE_POINT"><code>FROM_CODE_POINT</code></a> (Safari 9+)
<li><a href="#FUNCTION_22_LF"><code>FUNCTION_22_LF</code></a> (Safari 9+)
<li><a href="#GMT"><code>GMT</code></a>
<li><a href="#HISTORY"><code>HISTORY</code></a>
<li><a href="#HTMLDOCUMENT"><code>HTMLDOCUMENT</code></a>
<li><a href="#INCR_CHAR"><code>INCR_CHAR</code></a>
<li><a href="#INTL"><code>INTL</code></a> (Safari 10+)
<li><a href="#LOCALE_INFINITY"><code>LOCALE_INFINITY</code></a> (Safari 10+)
<li><a href="#NAME"><code>NAME</code></a>
<li><a href="#NODECONSTRUCTOR"><code>NODECONSTRUCTOR</code></a> (not in Safari 10+)
<li><a href="#NO_IE_SRC"><code>NO_IE_SRC</code></a> (implied by <a href="#FF_SRC"><code>FF_SRC</code></a>)
<li><a href="#NO_OLD_SAFARI_ARRAY_ITERATOR"><code>NO_OLD_SAFARI_ARRAY_ITERATOR</code></a> (Safari 9+)
<li><a href="#NO_V8_SRC"><code>NO_V8_SRC</code></a> (implied by <a href="#FF_SRC"><code>FF_SRC</code></a>)
<li><a href="#SELF_OBJ"><code>SELF_OBJ</code></a> (implied by <a href="#ANY_WINDOW"><code>ANY_WINDOW</code></a> and <a href="#WINDOW"><code>WINDOW</code></a>)
<li><a href="#STATUS"><code>STATUS</code></a>
<li><a href="#UNDEFINED"><code>UNDEFINED</code></a>
<li><a href="#WINDOW"><code>WINDOW</code></a>
</ul>
</td>
</tr>
<tr>
<td>Android Browser 4.0+</td>
<td>
<ul>
<li><a href="#ANY_DOCUMENT"><code>ANY_DOCUMENT</code></a> (implied by <a href="#HTMLDOCUMENT"><code>HTMLDOCUMENT</code></a>)
<li><a href="#ANY_WINDOW"><code>ANY_WINDOW</code></a> (implied by <a href="#DOMWINDOW"><code>DOMWINDOW</code></a> and <a href="#WINDOW"><code>WINDOW</code></a>)
<li><a href="#ATOB"><code>ATOB</code></a>
<li><a href="#BARPROP"><code>BARPROP</code></a> (Android Browser 4.4)
<li><a href="#CONSOLE"><code>CONSOLE</code></a>
<li><a href="#DOMWINDOW"><code>DOMWINDOW</code></a> (not in Android Browser 4.4)
<li><a href="#ESC_HTML_ALL"><code>ESC_HTML_ALL</code></a>
<li><a href="#ESC_HTML_QUOT"><code>ESC_HTML_QUOT</code></a> (implied by <a href="#ESC_HTML_ALL"><code>ESC_HTML_ALL</code></a>)
<li><a href="#FUNCTION_22_LF"><code>FUNCTION_22_LF</code></a>
<li><a href="#GMT"><code>GMT</code></a>
<li><a href="#HISTORY"><code>HISTORY</code></a>
<li><a href="#HTMLAUDIOELEMENT"><code>HTMLAUDIOELEMENT</code></a> (Android Browser 4.4)
<li><a href="#HTMLDOCUMENT"><code>HTMLDOCUMENT</code></a>
<li><a href="#INCR_CHAR"><code>INCR_CHAR</code></a>
<li><a href="#INTL"><code>INTL</code></a> (Android Browser 4.4)
<li><a href="#LOCALE_INFINITY"><code>LOCALE_INFINITY</code></a> (Android Browser 4.4)
<li><a href="#NAME"><code>NAME</code></a>
<li><a href="#NO_FF_SRC"><code>NO_FF_SRC</code></a> (implied by <a href="#V8_SRC"><code>V8_SRC</code></a>)
<li><a href="#NO_IE_SRC"><code>NO_IE_SRC</code></a> (implied by <a href="#HTMLAUDIOELEMENT"><code>HTMLAUDIOELEMENT</code></a> and <a href="#V8_SRC"><code>V8_SRC</code></a>)
<li><a href="#SELF_OBJ"><code>SELF_OBJ</code></a> (implied by <a href="#ANY_WINDOW"><code>ANY_WINDOW</code></a> and <a href="#DOMWINDOW"><code>DOMWINDOW</code></a> and <a href="#WINDOW"><code>WINDOW</code></a>)
<li><a href="#STATUS"><code>STATUS</code></a>
<li><a href="#UNDEFINED"><code>UNDEFINED</code></a> (Android Browser 4.1+)
<li><a href="#V8_SRC"><code>V8_SRC</code></a>
<li><a href="#WINDOW"><code>WINDOW</code></a> (Android Browser 4.4)
</ul>
</td>
</tr>
<tr>
<td>Node.js 0.10+</td>
<td>
<ul>
<li><a href="#ARRAY_ITERATOR"><code>ARRAY_ITERATOR</code></a> (implied by <a href="#NO_OLD_SAFARI_ARRAY_ITERATOR"><code>NO_OLD_SAFARI_ARRAY_ITERATOR</code></a>; Node.js 0.12+)
<li><a href="#ARROW"><code>ARROW</code></a> (Node.js 4+)
<li><a href="#ESC_HTML_ALL"><code>ESC_HTML_ALL</code></a> (not in Node.js 0.12+)
<li><a href="#ESC_HTML_QUOT"><code>ESC_HTML_QUOT</code></a> (implied by <a href="#ESC_HTML_ALL"><code>ESC_HTML_ALL</code></a> and <a href="#ESC_HTML_QUOT_ONLY"><code>ESC_HTML_QUOT_ONLY</code></a>)
<li><a href="#ESC_HTML_QUOT_ONLY"><code>ESC_HTML_QUOT_ONLY</code></a> (Node.js 0.12+)
<li><a href="#ESC_REGEXP_SLASH"><code>ESC_REGEXP_SLASH</code></a> (Node.js 4+)
<li><a href="#FILL"><code>FILL</code></a> (Node.js 4+)
<li><a href="#FLAT"><code>FLAT</code></a> (Node.js 11+)
<li><a href="#FROM_CODE_POINT"><code>FROM_CODE_POINT</code></a> (Node.js 4+)
<li><a href="#FUNCTION_19_LF"><code>FUNCTION_19_LF</code></a> (Node.js 10+)
<li><a href="#FUNCTION_22_LF"><code>FUNCTION_22_LF</code></a> (not in Node.js 10+)
<li><a href="#GMT"><code>GMT</code></a>
<li><a href="#INCR_CHAR"><code>INCR_CHAR</code></a>
<li><a href="#INTL"><code>INTL</code></a> (Node.js 0.12+)
<li><a href="#LOCALE_INFINITY"><code>LOCALE_INFINITY</code></a> (Node.js 0.12+)
<li><a href="#NAME"><code>NAME</code></a>
<li><a href="#NO_FF_SRC"><code>NO_FF_SRC</code></a> (implied by <a href="#V8_SRC"><code>V8_SRC</code></a>)
<li><a href="#NO_IE_SRC"><code>NO_IE_SRC</code></a> (implied by <a href="#V8_SRC"><code>V8_SRC</code></a>)
<li><a href="#NO_OLD_SAFARI_ARRAY_ITERATOR"><code>NO_OLD_SAFARI_ARRAY_ITERATOR</code></a> (Node.js 0.12+)
<li><a href="#UNDEFINED"><code>UNDEFINED</code></a>
<li><a href="#V8_SRC"><code>V8_SRC</code></a>
</ul>
</td>
</tr>
</table>
