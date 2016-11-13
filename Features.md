# JScrewIt Feature Reference
## Feature List
This section lists all features along with their descriptions.
<a name="ANDRO40"></a>
### `ANDRO40`
Features available in Android Browser 4.0 to 4.3.
<a name="ANDRO41"></a>
### `ANDRO41`
Features available in Android Browser 4.1 to 4.3.
<a name="ANDRO44"></a>
### `ANDRO44`
Features available in Android Browser 4.4 or later.
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

_Available in Chrome, Firefox, Safari 7.1+, Opera and Node.js 0.12+._
<a name="ARROW"></a>
### `ARROW`
Support for arrow functions.

_Available in Chrome, Edge, Firefox, Safari 10.0+, Opera and Node.js 4+._
<a name="ATOB"></a>
### `ATOB`
Existence of the global functions atob and btoa.

_Available in Chrome, Edge, Firefox, Internet Explorer 10+, Safari, Opera and Android Browser. This feature is not available inside web workers in Safari before 10.0+._
<a name="AUTO"></a>
### `AUTO`
All features available in the current engine.
<a name="BARPROP"></a>
### `BARPROP`
Existence of the global object statusbar having the string representation "\[object BarProp\]".

_Available in Chrome, Edge, Firefox, Safari, Opera and Android Browser 4.4+. This feature is not available inside web workers._
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
_An alias for [`CHROME52`](#CHROME52)._
<a name="CHROME52"></a>
### `CHROME52`
Features available in Chrome 52 and Opera 39 or later.
<a name="COMPACT"></a>
### `COMPACT`
All new browsers' features.<br>
No support for Node.js and older browsers like Internet Explorer, Safari 9 or Android Browser.
<a name="CONSOLE"></a>
### `CONSOLE`
Existence of the global object console having the string representation "\[object Console\]".<br>
This feature may become unavailable when Firebug or Firebug Lite is open and the console panel is enabled.

_Available in Edge, Firefox, Internet Explorer 10+, Safari and Android Browser. This feature is not available inside web workers in Safari before 7.1+ and Android Browser 4.4+._
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

_Available in Android Browser before 4.4+. This feature is not available inside web workers._
<a name="EDGE"></a>
### `EDGE`
Features available in Edge.
<a name="ENTRIES_OBJ"></a>
### `ENTRIES_OBJ`
The property that the string representation of Array.prototype.entries\(\) starts with "\[object ".

_Available in Chrome, Edge, Firefox, Safari 7.1+, Opera and Node.js 0.12+._
<a name="ENTRIES_PLAIN"></a>
### `ENTRIES_PLAIN`
The property that the string representation of Array.prototype.entries\(\) evaluates to "\[object Object\]".

_Available in Edge._
<a name="ESC_HTML_ALL"></a>
### `ESC_HTML_ALL`
The property that double quotation mark, less than and greater than characters in the argument of String.prototype.fontcolor are escaped into their respective HTML entities.

_Available in Android Browser and Node.js before 0.12+._
<a name="ESC_HTML_QUOT"></a>
### `ESC_HTML_QUOT`
The property that double quotation marks in the argument of String.prototype.fontcolor are escaped as "\&quot;".

_Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser and Node.js._
<a name="ESC_HTML_QUOT_ONLY"></a>
### `ESC_HTML_QUOT_ONLY`
The property that only double quotation marks and no other characters in the argument of String.prototype.fontcolor are escaped into HTML entities.

_Available in Chrome, Edge, Firefox, Safari, Opera and Node.js 0.12+._
<a name="FF"></a>
### `FF`
_An alias for [`FF31`](#FF31)._
<a name="FF31"></a>
### `FF31`
Features available in Firefox 31 or later.
<a name="FILL"></a>
### `FILL`
Existence of the native function Array.prototype.fill.

_Available in Chrome, Edge, Firefox, Safari 7.1+, Opera and Node.js 4+._
<a name="FROM_CODE_POINT"></a>
### `FROM_CODE_POINT`
Existence of the function String.fromCodePoint.

_Available in Chrome, Edge, Firefox, Safari 9.0+, Opera and Node.js 4+._
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

_Available in Chrome, Opera and Android Browser 4.4+. This feature is not available inside web workers._
<a name="HTMLDOCUMENT"></a>
### `HTMLDOCUMENT`
Existence of the global object document having the string representation "\[object HTMLDocument\]".

_Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari, Opera and Android Browser. This feature is not available inside web workers._
<a name="IE10"></a>
### `IE10`
Features available in Internet Explorer 10 or later.
<a name="IE11"></a>
### `IE11`
Features available in Internet Explorer 11.
<a name="IE11_WIN10"></a>
### `IE11_WIN10`
Features available in Internet Explorer 11 on Windows 10.
<a name="IE9"></a>
### `IE9`
Features available in Internet Explorer 9 or later.
<a name="IE_SRC"></a>
### `IE_SRC`
A string representation of native functions typical for Internet Explorer.<br>
Remarkable traits are the presence of a line feed character \("\\n"\) in the beginning of the string before "function" and a line feed with four whitespaces \("\\n    "\) before the "\[native code\]" sequence.

_Available in Internet Explorer._
<a name="INCR_CHAR"></a>
### `INCR_CHAR`
The ability to use unary increment operators with string characters, like in \( ++"some string"\[0\] \): this will result in a TypeError in strict mode in ECMAScript compliant engines.

_Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, Android Browser and Node.js. This feature is not available when strict mode is enforced in Chrome, Edge, Firefox, Internet Explorer 10+, Safari, Opera and Node.js 5+._
<a name="INTL"></a>
### `INTL`
Existence of the global object Intl.

_Available in Chrome, Edge, Firefox, Internet Explorer 11, Opera, Android Browser 4.4+ and Node.js 0.12+._
<a name="LOCALE_INFINITY"></a>
### `LOCALE_INFINITY`
Language sensitive string representation of Infinity as "∞".

_Available in Chrome, Edge, Firefox, Internet Explorer 11 on Windows 10, Opera, Android Browser 4.4+ and Node.js 0.12+._
<a name="NAME"></a>
### `NAME`
Existence of the name property for functions.

_Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser and Node.js._
<a name="NODE010"></a>
### `NODE010`
Features available in Node.js 0.10.
<a name="NODE012"></a>
### `NODE012`
Features available in Node.js 0.12 or later.
<a name="NODE40"></a>
### `NODE40`
Features available in Node.js 4.0 or later.
<a name="NODE50"></a>
### `NODE50`
Features available in Node.js 5.0 or later.
<a name="NODECONSTRUCTOR"></a>
### `NODECONSTRUCTOR`
Existence of the global object Node having the string representation "\[object NodeConstructor\]".

_Available in Safari before 10.0+. This feature is not available inside web workers._
<a name="NO_IE_SRC"></a>
### `NO_IE_SRC`
A string representation of native functions typical for most engines with the notable exception of Internet Explorer.<br>
A remarkable trait of this feature is the lack of extra characters in the beginning of the string before "function".

_Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser and Node.js._
<a name="NO_OLD_SAFARI_ARRAY_ITERATOR"></a>
### `NO_OLD_SAFARI_ARRAY_ITERATOR`
The property that the string representation of Array.prototype.entries\(\) evaluates to "\[object Array Iterator\]".

_Available in Chrome, Firefox, Safari 9.0+, Opera and Node.js 0.12+._
<a name="NO_OLD_SAFARI_LF"></a>
### `NO_OLD_SAFARI_LF`
A string representation of dynamically generated functions typical for most engines with the notable exception of Safari versions prior to 9.<br>
More specifically, in this representation, the character at index 22 is a line feed \("\\n"\).

_Available in Chrome, Edge, Firefox, Internet Explorer, Safari 9.0+, Opera, Android Browser and Node.js._
<a name="NO_V8_SRC"></a>
### `NO_V8_SRC`
A string representation of native functions typical for most engines except V8.<br>
A most remarkable trait of this feature is the presence of a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.

_Available in Firefox, Internet Explorer and Safari._
<a name="SAFARI100"></a>
### `SAFARI100`
Features available in Safari 10.
<a name="SAFARI70"></a>
### `SAFARI70`
Features available in Safari 7.0.
<a name="SAFARI71"></a>
### `SAFARI71`
Features available in Safari 7.1 and Safari 8.
<a name="SAFARI80"></a>
### `SAFARI80`
_An alias for [`SAFARI71`](#SAFARI71)._
<a name="SAFARI90"></a>
### `SAFARI90`
Features available in Safari 9.
<a name="SELF"></a>
### `SELF`
_An alias for [`ANY_WINDOW`](#ANY_WINDOW)._
<a name="SELF_OBJ"></a>
### `SELF_OBJ`
Existence of the global object self whose string representation starts with "\[object ".

_Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers in Safari 7.1+ before 10.0+._
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
Remarkable traits are the lack of characters in the beginning of the string before "function" and a single whitespace before the "\[native code\]" sequence.

_Available in Chrome, Edge, Opera, Android Browser and Node.js._
<a name="WINDOW"></a>
### `WINDOW`
Existence of the global object self having the string representation "\[object Window\]".

_Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser 4.4+. This feature is not available inside web workers._
## Engine Support
This table lists features available in the most common engines.
<table>
<tr>
<th>Target</th>
<th>Features</th>
</tr>
<tr>
<td>Chrome 52+, Opera 39+</td>
<td>
<ul>
<li><a href="#ANY_DOCUMENT"><code>ANY_DOCUMENT</code></a> (implied by <a href="#HTMLDOCUMENT"><code>HTMLDOCUMENT</code></a>)
<li><a href="#ANY_WINDOW"><code>ANY_WINDOW</code></a> (implied by <a href="#WINDOW"><code>WINDOW</code></a>)
<li><a href="#ARRAY_ITERATOR"><code>ARRAY_ITERATOR</code></a> (implied by <a href="#NO_OLD_SAFARI_ARRAY_ITERATOR"><code>NO_OLD_SAFARI_ARRAY_ITERATOR</code></a>)
<li><a href="#ARROW"><code>ARROW</code></a>
<li><a href="#ATOB"><code>ATOB</code></a>
<li><a href="#BARPROP"><code>BARPROP</code></a>
<li><a href="#ENTRIES_OBJ"><code>ENTRIES_OBJ</code></a> (implied by <a href="#ARRAY_ITERATOR"><code>ARRAY_ITERATOR</code></a> and <a href="#NO_OLD_SAFARI_ARRAY_ITERATOR"><code>NO_OLD_SAFARI_ARRAY_ITERATOR</code></a>)
<li><a href="#ESC_HTML_QUOT"><code>ESC_HTML_QUOT</code></a> (implied by <a href="#ESC_HTML_QUOT_ONLY"><code>ESC_HTML_QUOT_ONLY</code></a>)
<li><a href="#ESC_HTML_QUOT_ONLY"><code>ESC_HTML_QUOT_ONLY</code></a>
<li><a href="#FILL"><code>FILL</code></a>
<li><a href="#FROM_CODE_POINT"><code>FROM_CODE_POINT</code></a>
<li><a href="#GMT"><code>GMT</code></a>
<li><a href="#HISTORY"><code>HISTORY</code></a>
<li><a href="#HTMLAUDIOELEMENT"><code>HTMLAUDIOELEMENT</code></a>
<li><a href="#HTMLDOCUMENT"><code>HTMLDOCUMENT</code></a>
<li><a href="#INCR_CHAR"><code>INCR_CHAR</code></a>
<li><a href="#INTL"><code>INTL</code></a>
<li><a href="#LOCALE_INFINITY"><code>LOCALE_INFINITY</code></a>
<li><a href="#NAME"><code>NAME</code></a>
<li><a href="#NO_IE_SRC"><code>NO_IE_SRC</code></a> (implied by <a href="#HTMLAUDIOELEMENT"><code>HTMLAUDIOELEMENT</code></a> and <a href="#V8_SRC"><code>V8_SRC</code></a>)
<li><a href="#NO_OLD_SAFARI_ARRAY_ITERATOR"><code>NO_OLD_SAFARI_ARRAY_ITERATOR</code></a>
<li><a href="#NO_OLD_SAFARI_LF"><code>NO_OLD_SAFARI_LF</code></a>
<li><a href="#SELF_OBJ"><code>SELF_OBJ</code></a> (implied by <a href="#ANY_WINDOW"><code>ANY_WINDOW</code></a> and <a href="#WINDOW"><code>WINDOW</code></a>)
<li><a href="#UNDEFINED"><code>UNDEFINED</code></a>
<li><a href="#V8_SRC"><code>V8_SRC</code></a>
<li><a href="#WINDOW"><code>WINDOW</code></a>
</ul>
</td>
</tr>
<tr>
<td>Edge</td>
<td>
<ul>
<li><a href="#ANY_DOCUMENT"><code>ANY_DOCUMENT</code></a> (implied by <a href="#HTMLDOCUMENT"><code>HTMLDOCUMENT</code></a>)
<li><a href="#ANY_WINDOW"><code>ANY_WINDOW</code></a> (implied by <a href="#WINDOW"><code>WINDOW</code></a>)
<li><a href="#ARROW"><code>ARROW</code></a>
<li><a href="#ATOB"><code>ATOB</code></a>
<li><a href="#BARPROP"><code>BARPROP</code></a>
<li><a href="#CONSOLE"><code>CONSOLE</code></a>
<li><a href="#ENTRIES_OBJ"><code>ENTRIES_OBJ</code></a> (implied by <a href="#ENTRIES_PLAIN"><code>ENTRIES_PLAIN</code></a>)
<li><a href="#ENTRIES_PLAIN"><code>ENTRIES_PLAIN</code></a>
<li><a href="#ESC_HTML_QUOT"><code>ESC_HTML_QUOT</code></a> (implied by <a href="#ESC_HTML_QUOT_ONLY"><code>ESC_HTML_QUOT_ONLY</code></a>)
<li><a href="#ESC_HTML_QUOT_ONLY"><code>ESC_HTML_QUOT_ONLY</code></a>
<li><a href="#FILL"><code>FILL</code></a>
<li><a href="#FROM_CODE_POINT"><code>FROM_CODE_POINT</code></a>
<li><a href="#GMT"><code>GMT</code></a>
<li><a href="#HISTORY"><code>HISTORY</code></a>
<li><a href="#HTMLDOCUMENT"><code>HTMLDOCUMENT</code></a>
<li><a href="#INCR_CHAR"><code>INCR_CHAR</code></a>
<li><a href="#INTL"><code>INTL</code></a>
<li><a href="#LOCALE_INFINITY"><code>LOCALE_INFINITY</code></a>
<li><a href="#NAME"><code>NAME</code></a>
<li><a href="#NO_IE_SRC"><code>NO_IE_SRC</code></a> (implied by <a href="#V8_SRC"><code>V8_SRC</code></a>)
<li><a href="#NO_OLD_SAFARI_LF"><code>NO_OLD_SAFARI_LF</code></a>
<li><a href="#SELF_OBJ"><code>SELF_OBJ</code></a> (implied by <a href="#ANY_WINDOW"><code>ANY_WINDOW</code></a> and <a href="#WINDOW"><code>WINDOW</code></a>)
<li><a href="#UNDEFINED"><code>UNDEFINED</code></a>
<li><a href="#V8_SRC"><code>V8_SRC</code></a>
<li><a href="#WINDOW"><code>WINDOW</code></a>
</ul>
</td>
</tr>
<tr>
<td>Firefox 31+</td>
<td>
<ul>
<li><a href="#ANY_DOCUMENT"><code>ANY_DOCUMENT</code></a> (implied by <a href="#HTMLDOCUMENT"><code>HTMLDOCUMENT</code></a>)
<li><a href="#ANY_WINDOW"><code>ANY_WINDOW</code></a> (implied by <a href="#WINDOW"><code>WINDOW</code></a>)
<li><a href="#ARRAY_ITERATOR"><code>ARRAY_ITERATOR</code></a> (implied by <a href="#NO_OLD_SAFARI_ARRAY_ITERATOR"><code>NO_OLD_SAFARI_ARRAY_ITERATOR</code></a>)
<li><a href="#ARROW"><code>ARROW</code></a>
<li><a href="#ATOB"><code>ATOB</code></a>
<li><a href="#BARPROP"><code>BARPROP</code></a>
<li><a href="#CONSOLE"><code>CONSOLE</code></a>
<li><a href="#ENTRIES_OBJ"><code>ENTRIES_OBJ</code></a> (implied by <a href="#ARRAY_ITERATOR"><code>ARRAY_ITERATOR</code></a> and <a href="#NO_OLD_SAFARI_ARRAY_ITERATOR"><code>NO_OLD_SAFARI_ARRAY_ITERATOR</code></a>)
<li><a href="#ESC_HTML_QUOT"><code>ESC_HTML_QUOT</code></a> (implied by <a href="#ESC_HTML_QUOT_ONLY"><code>ESC_HTML_QUOT_ONLY</code></a>)
<li><a href="#ESC_HTML_QUOT_ONLY"><code>ESC_HTML_QUOT_ONLY</code></a>
<li><a href="#FILL"><code>FILL</code></a>
<li><a href="#FROM_CODE_POINT"><code>FROM_CODE_POINT</code></a>
<li><a href="#GMT"><code>GMT</code></a>
<li><a href="#HISTORY"><code>HISTORY</code></a>
<li><a href="#HTMLDOCUMENT"><code>HTMLDOCUMENT</code></a>
<li><a href="#INCR_CHAR"><code>INCR_CHAR</code></a>
<li><a href="#INTL"><code>INTL</code></a>
<li><a href="#LOCALE_INFINITY"><code>LOCALE_INFINITY</code></a>
<li><a href="#NAME"><code>NAME</code></a>
<li><a href="#NO_IE_SRC"><code>NO_IE_SRC</code></a>
<li><a href="#NO_OLD_SAFARI_ARRAY_ITERATOR"><code>NO_OLD_SAFARI_ARRAY_ITERATOR</code></a>
<li><a href="#NO_OLD_SAFARI_LF"><code>NO_OLD_SAFARI_LF</code></a>
<li><a href="#NO_V8_SRC"><code>NO_V8_SRC</code></a>
<li><a href="#SELF_OBJ"><code>SELF_OBJ</code></a> (implied by <a href="#ANY_WINDOW"><code>ANY_WINDOW</code></a> and <a href="#WINDOW"><code>WINDOW</code></a>)
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
<li><a href="#GMT"><code>GMT</code></a> (Internet Explorer 11)
<li><a href="#HISTORY"><code>HISTORY</code></a>
<li><a href="#HTMLDOCUMENT"><code>HTMLDOCUMENT</code></a> (Internet Explorer 11)
<li><a href="#IE_SRC"><code>IE_SRC</code></a>
<li><a href="#INCR_CHAR"><code>INCR_CHAR</code></a>
<li><a href="#INTL"><code>INTL</code></a> (Internet Explorer 11)
<li><a href="#LOCALE_INFINITY"><code>LOCALE_INFINITY</code></a> (Internet Explorer 11 on Windows 10)
<li><a href="#NO_OLD_SAFARI_LF"><code>NO_OLD_SAFARI_LF</code></a>
<li><a href="#NO_V8_SRC"><code>NO_V8_SRC</code></a> (implied by <a href="#IE_SRC"><code>IE_SRC</code></a>)
<li><a href="#SELF_OBJ"><code>SELF_OBJ</code></a> (implied by <a href="#ANY_WINDOW"><code>ANY_WINDOW</code></a> and <a href="#WINDOW"><code>WINDOW</code></a>)
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
<li><a href="#ARROW"><code>ARROW</code></a> (Safari 10.0+)
<li><a href="#ATOB"><code>ATOB</code></a>
<li><a href="#BARPROP"><code>BARPROP</code></a>
<li><a href="#CONSOLE"><code>CONSOLE</code></a>
<li><a href="#ENTRIES_OBJ"><code>ENTRIES_OBJ</code></a> (implied by <a href="#ARRAY_ITERATOR"><code>ARRAY_ITERATOR</code></a> and <a href="#NO_OLD_SAFARI_ARRAY_ITERATOR"><code>NO_OLD_SAFARI_ARRAY_ITERATOR</code></a>; Safari 7.1+)
<li><a href="#ESC_HTML_QUOT"><code>ESC_HTML_QUOT</code></a> (implied by <a href="#ESC_HTML_QUOT_ONLY"><code>ESC_HTML_QUOT_ONLY</code></a>)
<li><a href="#ESC_HTML_QUOT_ONLY"><code>ESC_HTML_QUOT_ONLY</code></a>
<li><a href="#FILL"><code>FILL</code></a> (Safari 7.1+)
<li><a href="#FROM_CODE_POINT"><code>FROM_CODE_POINT</code></a> (Safari 9.0+)
<li><a href="#GMT"><code>GMT</code></a>
<li><a href="#HISTORY"><code>HISTORY</code></a>
<li><a href="#HTMLDOCUMENT"><code>HTMLDOCUMENT</code></a>
<li><a href="#INCR_CHAR"><code>INCR_CHAR</code></a>
<li><a href="#NAME"><code>NAME</code></a>
<li><a href="#NODECONSTRUCTOR"><code>NODECONSTRUCTOR</code></a> (not in Safari 10.0+)
<li><a href="#NO_IE_SRC"><code>NO_IE_SRC</code></a>
<li><a href="#NO_OLD_SAFARI_ARRAY_ITERATOR"><code>NO_OLD_SAFARI_ARRAY_ITERATOR</code></a> (Safari 9.0+)
<li><a href="#NO_OLD_SAFARI_LF"><code>NO_OLD_SAFARI_LF</code></a> (Safari 9.0+)
<li><a href="#NO_V8_SRC"><code>NO_V8_SRC</code></a>
<li><a href="#SELF_OBJ"><code>SELF_OBJ</code></a> (implied by <a href="#ANY_WINDOW"><code>ANY_WINDOW</code></a> and <a href="#WINDOW"><code>WINDOW</code></a>)
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
<li><a href="#BARPROP"><code>BARPROP</code></a> (Android Browser 4.4+)
<li><a href="#CONSOLE"><code>CONSOLE</code></a>
<li><a href="#DOMWINDOW"><code>DOMWINDOW</code></a> (not in Android Browser 4.4+)
<li><a href="#ESC_HTML_ALL"><code>ESC_HTML_ALL</code></a>
<li><a href="#ESC_HTML_QUOT"><code>ESC_HTML_QUOT</code></a> (implied by <a href="#ESC_HTML_ALL"><code>ESC_HTML_ALL</code></a>)
<li><a href="#GMT"><code>GMT</code></a>
<li><a href="#HISTORY"><code>HISTORY</code></a>
<li><a href="#HTMLAUDIOELEMENT"><code>HTMLAUDIOELEMENT</code></a> (Android Browser 4.4+)
<li><a href="#HTMLDOCUMENT"><code>HTMLDOCUMENT</code></a>
<li><a href="#INCR_CHAR"><code>INCR_CHAR</code></a>
<li><a href="#INTL"><code>INTL</code></a> (Android Browser 4.4+)
<li><a href="#LOCALE_INFINITY"><code>LOCALE_INFINITY</code></a> (Android Browser 4.4+)
<li><a href="#NAME"><code>NAME</code></a>
<li><a href="#NO_IE_SRC"><code>NO_IE_SRC</code></a> (implied by <a href="#HTMLAUDIOELEMENT"><code>HTMLAUDIOELEMENT</code></a> and <a href="#V8_SRC"><code>V8_SRC</code></a>)
<li><a href="#NO_OLD_SAFARI_LF"><code>NO_OLD_SAFARI_LF</code></a>
<li><a href="#SELF_OBJ"><code>SELF_OBJ</code></a> (implied by <a href="#ANY_WINDOW"><code>ANY_WINDOW</code></a> and <a href="#DOMWINDOW"><code>DOMWINDOW</code></a> and <a href="#WINDOW"><code>WINDOW</code></a>)
<li><a href="#UNDEFINED"><code>UNDEFINED</code></a> (Android Browser 4.1+)
<li><a href="#V8_SRC"><code>V8_SRC</code></a>
<li><a href="#WINDOW"><code>WINDOW</code></a> (Android Browser 4.4+)
</ul>
</td>
</tr>
<tr>
<td>Node.js 0.10+</td>
<td>
<ul>
<li><a href="#ARRAY_ITERATOR"><code>ARRAY_ITERATOR</code></a> (implied by <a href="#NO_OLD_SAFARI_ARRAY_ITERATOR"><code>NO_OLD_SAFARI_ARRAY_ITERATOR</code></a>; Node.js 0.12+)
<li><a href="#ARROW"><code>ARROW</code></a> (Node.js 4+)
<li><a href="#ENTRIES_OBJ"><code>ENTRIES_OBJ</code></a> (implied by <a href="#ARRAY_ITERATOR"><code>ARRAY_ITERATOR</code></a> and <a href="#NO_OLD_SAFARI_ARRAY_ITERATOR"><code>NO_OLD_SAFARI_ARRAY_ITERATOR</code></a>; Node.js 0.12+)
<li><a href="#ESC_HTML_ALL"><code>ESC_HTML_ALL</code></a> (not in Node.js 0.12+)
<li><a href="#ESC_HTML_QUOT"><code>ESC_HTML_QUOT</code></a> (implied by <a href="#ESC_HTML_ALL"><code>ESC_HTML_ALL</code></a> and <a href="#ESC_HTML_QUOT_ONLY"><code>ESC_HTML_QUOT_ONLY</code></a>)
<li><a href="#ESC_HTML_QUOT_ONLY"><code>ESC_HTML_QUOT_ONLY</code></a> (Node.js 0.12+)
<li><a href="#FILL"><code>FILL</code></a> (Node.js 4+)
<li><a href="#FROM_CODE_POINT"><code>FROM_CODE_POINT</code></a> (Node.js 4+)
<li><a href="#GMT"><code>GMT</code></a>
<li><a href="#INCR_CHAR"><code>INCR_CHAR</code></a>
<li><a href="#INTL"><code>INTL</code></a> (Node.js 0.12+)
<li><a href="#LOCALE_INFINITY"><code>LOCALE_INFINITY</code></a> (Node.js 0.12+)
<li><a href="#NAME"><code>NAME</code></a>
<li><a href="#NO_IE_SRC"><code>NO_IE_SRC</code></a> (implied by <a href="#V8_SRC"><code>V8_SRC</code></a>)
<li><a href="#NO_OLD_SAFARI_ARRAY_ITERATOR"><code>NO_OLD_SAFARI_ARRAY_ITERATOR</code></a> (Node.js 0.12+)
<li><a href="#NO_OLD_SAFARI_LF"><code>NO_OLD_SAFARI_LF</code></a>
<li><a href="#UNDEFINED"><code>UNDEFINED</code></a>
<li><a href="#V8_SRC"><code>V8_SRC</code></a>
</ul>
</td>
</tr>
</table>
