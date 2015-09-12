# JScrewIt Feature Reference
## Feature List
This section lists all features along with their descriptions.
<a name="ANDRO400"></a>
### `ANDRO400`
Features available in Android Browser 4.0 to 4.3.1.
<a name="ANDRO412"></a>
### `ANDRO412`
Features available in Android Browser 4.1.2 to 4.3.1.
<a name="ANDRO442"></a>
### `ANDRO442`
Features available in Android Browser 4.4.2 or later.
<a name="ANY_DOCUMENT"></a>
### `ANY_DOCUMENT`
Existence of the global object property document whose string representation starts with "\[object " and ends with "Document\]".
This feature is not available in Node.js. It is also not available inside web workers.
<a name="ANY_WINDOW"></a>
### `ANY_WINDOW`
Existence of the global object property self whose string representation starts with "\[object " and ends with "Window\]".
This feature is not available in Node.js. It is also not available inside web workers.
<a name="ARRAY_ITERATOR"></a>
### `ARRAY_ITERATOR`
The property that the string representation of Array.prototype.entries\(\) starts with "\[object Array" and ends with "\]" at index 21 or 22.
This feature is available in Firefox, Chrome, Opera, and in Safari 7.1, Node.js 0.12 and later versions.
<a name="ATOB"></a>
### `ATOB`
Existence of the global object functions atob and btoa.
This feature is not available in Internet Explorer versions prior to 11 and Node.js.
<a name="AUTO"></a>
### `AUTO`
All features available in the current engine.
<a name="CAPITAL_HTML"></a>
### `CAPITAL_HTML`
The property that the various string methods returning HTML code such as String.prototype.big or String.prototype.link have both the tag name and attributes written in capital letters.
This feature is only available in Internet Explorer.
<a name="CHROME"></a>
### `CHROME`
_An alias for [`CHROME41`](#CHROME41)._
<a name="CHROME41"></a>
### `CHROME41`
Features available in Chrome 41 and Opera 28 or later.
<a name="CHROME45"></a>
### `CHROME45`
Features available in Chrome 45 or later.
<a name="COMPACT"></a>
### `COMPACT`
All new browsers' features.
No support for Node.js and older browsers like Internet Explorer, Safari 7.0 or Android Browser
<a name="DEFAULT"></a>
### `DEFAULT`
Minimun feature level, compatible with all supported engines.
<a name="DOCUMENT"></a>
### `DOCUMENT`
Existence of the global object property document having the string representation "\[object Document\]".
This feature is only available in Internet Explorer 9 and 10. It is not available inside web workers.
<a name="DOMWINDOW"></a>
### `DOMWINDOW`
Existence of the global object property self having the string representation "\[object DOMWindow\]".
Only available in Android Browser versions prior to 4.4.2.
<a name="DOUBLE_QUOTE_ESC_HTML"></a>
### `DOUBLE_QUOTE_ESC_HTML`
The property that double quote characters in the argument of String.prototype.fontcolor are escaped as "\&quot;".
This feature is not available in Internet Explorer.
<a name="EDGE"></a>
### `EDGE`
Features available in Microsoft Edge.
<a name="ENTRIES_OBJ"></a>
### `ENTRIES_OBJ`
The property that the string representation of Array.prototype.entries\(\) starts with "\[object ".
This feature is available in Firefox, Chrome, Opera, Microsoft Edge, and in Safari 7.1, Node.js 0.12 and later versions.
<a name="ENTRIES_PLAIN"></a>
### `ENTRIES_PLAIN`
The property that the string representation of Array.prototype.entries\(\) evaluates to "\[object Object\]".
This feature is only available in Microsoft Edge.
<a name="FF31"></a>
### `FF31`
Features available in Firefox 31 or later.
<a name="FF_SAFARI_SRC"></a>
### `FF_SAFARI_SRC`
A string representation of native functions typically found in Firefox and Safari.
Remarkable traits are the lack of characters in the beginning of the string before "function" and a line feed with four whitespaces \("\\n    "\) before the "\[native code\]" sequence.
<a name="FILL"></a>
### `FILL`
Existence of the native function Array.prototype.fill.
Available in Firefox, Microsoft Edge, and in Chrome 45, Safari 7.1, Node.js 4.0 and later versions.
<a name="FROM_CODE_POINT"></a>
### `FROM_CODE_POINT`
Existence of the function String.fromCodePoint.
Available in Firefox, Chrome, Opera, Microsoft Edge, and in Node.js 4.0.
<a name="GMT"></a>
### `GMT`
Presence of the text "GMT" after the first 25 characters in the string returned by Date\(\).
Although ECMAScript states that string representation of dates is implementation dependent, most engines align to the same format, making this feature available in all supported engines except Internet Explorer 9 and 10.
<a name="HTMLDOCUMENT"></a>
### `HTMLDOCUMENT`
Existence of the global object property document having the string representation "\[object HTMLDocument\]".
This feature is not available in Internet Explorer versions prior to 11 and Node.js. It is also not available inside web workers.
<a name="IE10"></a>
### `IE10`
Features available in Internet Explorer 10 or later.
<a name="IE11"></a>
### `IE11`
Features available in Internet Explorer 11.
<a name="IE9"></a>
### `IE9`
Features available in Internet Explorer 9 or later.
<a name="IE_SRC"></a>
### `IE_SRC`
A string representation of native functions typical for Internet Explorer.
Remarkable traits are the presence of a line feed character \("\\n"\) in the beginning of the string before "function" and a line feed with four whitespaces \("\\n    "\) before the "\[native code\]" sequence.
<a name="LOCALE_INFINITY"></a>
### `LOCALE_INFINITY`
Language sensitive string representation of Infinity as "∞".
Available in Firefox, Chrome, Opera, Microsoft Edge, and in Android Browser 4.4.2, Node.js 0.12 and later versions.
<a name="NAME"></a>
### `NAME`
Existence of the name property for functions.
This feature is not available in Internet Explorer.
<a name="NODE"></a>
### `NODE`
_An alias for [`NODE010`](#NODE010)._
<a name="NODE010"></a>
### `NODE010`
Features available in Node.js 0.10.26 or later.
Also compatible with Chrome, Opera and Android Browser 4.1.2 or later.
<a name="NODE012"></a>
### `NODE012`
Features available in Node.js 0.12 or later.
Also compatible with Chrome 38, Opera 25 and Android Browser 4.1.2 or later.
<a name="NODE40"></a>
### `NODE40`
Features available in Node.js 4.0.
Also compatible with Chrome 45 or later.
<a name="NO_IE_SRC"></a>
### `NO_IE_SRC`
A string representation of native functions typical for most browsers with the notable exception of Internet Explorer.
A remarkable trait for this feature is the lack of characters in the beginning of the string before "function".
<a name="NO_SAFARI_ARRAY_ITERATOR"></a>
### `NO_SAFARI_ARRAY_ITERATOR`
The property that the string representation of Array.prototype.entries\(\) evaluates to "\[object Array Iterator\]".
Available in Firefox, Chrome, Opera, and in Node.js 0.12 and later versions.
<a name="NO_SAFARI_LF"></a>
### `NO_SAFARI_LF`
A string representation of dynamically generated functions typical for most browsers with the notable exception of Safari.
More specifically, in this representation, the character at index 22 is a line feed \("\\n"\).
<a name="SAFARI70"></a>
### `SAFARI70`
Features available in Safari 7.0.
<a name="SAFARI71"></a>
### `SAFARI71`
Features available in Safari 7.1 or later.
<a name="SAFARI_ARRAY_ITERATOR"></a>
### `SAFARI_ARRAY_ITERATOR`
The property that the string representation of Array.prototype.entries\(\) evaluates to "\[object ArrayIterator\]".
Available in Safari 7.1 and later versions.
<a name="SELF"></a>
### `SELF`
_An alias for [`ANY_WINDOW`](#ANY_WINDOW)._
<a name="SELF_OBJ"></a>
### `SELF_OBJ`
Existence of the global object property self whose string representation starts with "\[object ".
This feature is not available in Node.js. It is also not available inside web workers in Safari 8.0.
<a name="UNDEFINED"></a>
### `UNDEFINED`
The property that Object.prototype.toString.call\(\) evaluates to "\[object Undefined\]".
This behavior is defined by ECMAScript, and is supported by all engines except Android Browser versions prior to 4.1.2, where this feature is not available.
<a name="V8_SRC"></a>
### `V8_SRC`
A string representation of native functions typically found in the V8 JavaScript engine.
V8 is used in Chrome, Opera, Android Browser and Node.js. Microsoft Edge, although not using V8, also has this feature available.
Remarkable traits are the lack of characters in the beginning of the string before "function" and a single whitespace before the "\[native code\]" sequence.
<a name="WINDOW"></a>
### `WINDOW`
Existence of the global object property self having the string representation "\[object Window\]".
This feature is not available in Android Browser versions prior to 4.4.2 and Node.js. It is also not available inside web workers.
## Engine Support
This table lists features available in the most common engines.
<table>
<tr>
<th>Target</th>
<th>Features</th>
</tr>
<tr>
<td>Firefox 31+</td>
<td>
<ul>
<li><a href="#ANY_DOCUMENT"><code>ANY_DOCUMENT</code></a> (implied by <a href="#HTMLDOCUMENT"><code>HTMLDOCUMENT</code></a>)
<li><a href="#ANY_WINDOW"><code>ANY_WINDOW</code></a> (implied by <a href="#WINDOW"><code>WINDOW</code></a>)
<li><a href="#ARRAY_ITERATOR"><code>ARRAY_ITERATOR</code></a> (implied by <a href="#NO_SAFARI_ARRAY_ITERATOR"><code>NO_SAFARI_ARRAY_ITERATOR</code></a>)
<li><a href="#ATOB"><code>ATOB</code></a>
<li><a href="#DOUBLE_QUOTE_ESC_HTML"><code>DOUBLE_QUOTE_ESC_HTML</code></a>
<li><a href="#ENTRIES_OBJ"><code>ENTRIES_OBJ</code></a> (implied by <a href="#ARRAY_ITERATOR"><code>ARRAY_ITERATOR</code></a> and <a href="#NO_SAFARI_ARRAY_ITERATOR"><code>NO_SAFARI_ARRAY_ITERATOR</code></a>)
<li><a href="#FF_SAFARI_SRC"><code>FF_SAFARI_SRC</code></a>
<li><a href="#FILL"><code>FILL</code></a>
<li><a href="#FROM_CODE_POINT"><code>FROM_CODE_POINT</code></a>
<li><a href="#GMT"><code>GMT</code></a>
<li><a href="#HTMLDOCUMENT"><code>HTMLDOCUMENT</code></a>
<li><a href="#LOCALE_INFINITY"><code>LOCALE_INFINITY</code></a>
<li><a href="#NAME"><code>NAME</code></a>
<li><a href="#NO_IE_SRC"><code>NO_IE_SRC</code></a> (implied by <a href="#FF_SAFARI_SRC"><code>FF_SAFARI_SRC</code></a>)
<li><a href="#NO_SAFARI_ARRAY_ITERATOR"><code>NO_SAFARI_ARRAY_ITERATOR</code></a>
<li><a href="#NO_SAFARI_LF"><code>NO_SAFARI_LF</code></a>
<li><a href="#SELF_OBJ"><code>SELF_OBJ</code></a> (implied by <a href="#ANY_WINDOW"><code>ANY_WINDOW</code></a> and <a href="#WINDOW"><code>WINDOW</code></a>)
<li><a href="#UNDEFINED"><code>UNDEFINED</code></a>
<li><a href="#WINDOW"><code>WINDOW</code></a>
</ul>
</td>
</tr>
<tr>
<td>Chrome 41+, Opera 28+</td>
<td>
<ul>
<li><a href="#ANY_DOCUMENT"><code>ANY_DOCUMENT</code></a> (implied by <a href="#HTMLDOCUMENT"><code>HTMLDOCUMENT</code></a>)
<li><a href="#ANY_WINDOW"><code>ANY_WINDOW</code></a> (implied by <a href="#WINDOW"><code>WINDOW</code></a>)
<li><a href="#ARRAY_ITERATOR"><code>ARRAY_ITERATOR</code></a> (implied by <a href="#NO_SAFARI_ARRAY_ITERATOR"><code>NO_SAFARI_ARRAY_ITERATOR</code></a>)
<li><a href="#ATOB"><code>ATOB</code></a>
<li><a href="#DOUBLE_QUOTE_ESC_HTML"><code>DOUBLE_QUOTE_ESC_HTML</code></a>
<li><a href="#ENTRIES_OBJ"><code>ENTRIES_OBJ</code></a> (implied by <a href="#ARRAY_ITERATOR"><code>ARRAY_ITERATOR</code></a> and <a href="#NO_SAFARI_ARRAY_ITERATOR"><code>NO_SAFARI_ARRAY_ITERATOR</code></a>)
<li><a href="#FROM_CODE_POINT"><code>FROM_CODE_POINT</code></a>
<li><a href="#GMT"><code>GMT</code></a>
<li><a href="#HTMLDOCUMENT"><code>HTMLDOCUMENT</code></a>
<li><a href="#LOCALE_INFINITY"><code>LOCALE_INFINITY</code></a>
<li><a href="#NAME"><code>NAME</code></a>
<li><a href="#NO_IE_SRC"><code>NO_IE_SRC</code></a> (implied by <a href="#V8_SRC"><code>V8_SRC</code></a>)
<li><a href="#NO_SAFARI_ARRAY_ITERATOR"><code>NO_SAFARI_ARRAY_ITERATOR</code></a>
<li><a href="#NO_SAFARI_LF"><code>NO_SAFARI_LF</code></a>
<li><a href="#SELF_OBJ"><code>SELF_OBJ</code></a> (implied by <a href="#ANY_WINDOW"><code>ANY_WINDOW</code></a> and <a href="#WINDOW"><code>WINDOW</code></a>)
<li><a href="#UNDEFINED"><code>UNDEFINED</code></a>
<li><a href="#V8_SRC"><code>V8_SRC</code></a>
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
<li><a href="#DOCUMENT"><code>DOCUMENT</code></a> (not in Internet Explorer 11)
<li><a href="#GMT"><code>GMT</code></a> (Internet Explorer 11)
<li><a href="#HTMLDOCUMENT"><code>HTMLDOCUMENT</code></a> (Internet Explorer 11)
<li><a href="#IE_SRC"><code>IE_SRC</code></a>
<li><a href="#NO_SAFARI_LF"><code>NO_SAFARI_LF</code></a>
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
<li><a href="#ARRAY_ITERATOR"><code>ARRAY_ITERATOR</code></a> (implied by <a href="#SAFARI_ARRAY_ITERATOR"><code>SAFARI_ARRAY_ITERATOR</code></a>; Safari 7.1+)
<li><a href="#ATOB"><code>ATOB</code></a>
<li><a href="#DOUBLE_QUOTE_ESC_HTML"><code>DOUBLE_QUOTE_ESC_HTML</code></a>
<li><a href="#ENTRIES_OBJ"><code>ENTRIES_OBJ</code></a> (implied by <a href="#ARRAY_ITERATOR"><code>ARRAY_ITERATOR</code></a> and <a href="#SAFARI_ARRAY_ITERATOR"><code>SAFARI_ARRAY_ITERATOR</code></a>; Safari 7.1+)
<li><a href="#FF_SAFARI_SRC"><code>FF_SAFARI_SRC</code></a>
<li><a href="#FILL"><code>FILL</code></a> (Safari 7.1+)
<li><a href="#GMT"><code>GMT</code></a>
<li><a href="#HTMLDOCUMENT"><code>HTMLDOCUMENT</code></a>
<li><a href="#NAME"><code>NAME</code></a>
<li><a href="#NO_IE_SRC"><code>NO_IE_SRC</code></a> (implied by <a href="#FF_SAFARI_SRC"><code>FF_SAFARI_SRC</code></a>)
<li><a href="#SAFARI_ARRAY_ITERATOR"><code>SAFARI_ARRAY_ITERATOR</code></a> (Safari 7.1+)
<li><a href="#SELF_OBJ"><code>SELF_OBJ</code></a> (implied by <a href="#ANY_WINDOW"><code>ANY_WINDOW</code></a> and <a href="#WINDOW"><code>WINDOW</code></a>)
<li><a href="#UNDEFINED"><code>UNDEFINED</code></a>
<li><a href="#WINDOW"><code>WINDOW</code></a>
</ul>
</td>
</tr>
<tr>
<td>Microsoft Edge</td>
<td>
<ul>
<li><a href="#ANY_DOCUMENT"><code>ANY_DOCUMENT</code></a> (implied by <a href="#HTMLDOCUMENT"><code>HTMLDOCUMENT</code></a>)
<li><a href="#ANY_WINDOW"><code>ANY_WINDOW</code></a> (implied by <a href="#WINDOW"><code>WINDOW</code></a>)
<li><a href="#ATOB"><code>ATOB</code></a>
<li><a href="#DOUBLE_QUOTE_ESC_HTML"><code>DOUBLE_QUOTE_ESC_HTML</code></a>
<li><a href="#ENTRIES_OBJ"><code>ENTRIES_OBJ</code></a> (implied by <a href="#ENTRIES_PLAIN"><code>ENTRIES_PLAIN</code></a>)
<li><a href="#ENTRIES_PLAIN"><code>ENTRIES_PLAIN</code></a>
<li><a href="#FILL"><code>FILL</code></a>
<li><a href="#FROM_CODE_POINT"><code>FROM_CODE_POINT</code></a>
<li><a href="#GMT"><code>GMT</code></a>
<li><a href="#HTMLDOCUMENT"><code>HTMLDOCUMENT</code></a>
<li><a href="#LOCALE_INFINITY"><code>LOCALE_INFINITY</code></a>
<li><a href="#NAME"><code>NAME</code></a>
<li><a href="#NO_IE_SRC"><code>NO_IE_SRC</code></a> (implied by <a href="#V8_SRC"><code>V8_SRC</code></a>)
<li><a href="#NO_SAFARI_LF"><code>NO_SAFARI_LF</code></a>
<li><a href="#SELF_OBJ"><code>SELF_OBJ</code></a> (implied by <a href="#ANY_WINDOW"><code>ANY_WINDOW</code></a> and <a href="#WINDOW"><code>WINDOW</code></a>)
<li><a href="#UNDEFINED"><code>UNDEFINED</code></a>
<li><a href="#V8_SRC"><code>V8_SRC</code></a>
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
<li><a href="#DOMWINDOW"><code>DOMWINDOW</code></a> (not in Android Browser 4.4.2+)
<li><a href="#DOUBLE_QUOTE_ESC_HTML"><code>DOUBLE_QUOTE_ESC_HTML</code></a>
<li><a href="#GMT"><code>GMT</code></a>
<li><a href="#HTMLDOCUMENT"><code>HTMLDOCUMENT</code></a>
<li><a href="#LOCALE_INFINITY"><code>LOCALE_INFINITY</code></a> (Android Browser 4.4.2+)
<li><a href="#NAME"><code>NAME</code></a>
<li><a href="#NO_IE_SRC"><code>NO_IE_SRC</code></a> (implied by <a href="#V8_SRC"><code>V8_SRC</code></a>)
<li><a href="#NO_SAFARI_LF"><code>NO_SAFARI_LF</code></a>
<li><a href="#SELF_OBJ"><code>SELF_OBJ</code></a> (implied by <a href="#ANY_WINDOW"><code>ANY_WINDOW</code></a> and <a href="#DOMWINDOW"><code>DOMWINDOW</code></a> and <a href="#WINDOW"><code>WINDOW</code></a>)
<li><a href="#UNDEFINED"><code>UNDEFINED</code></a> (Android Browser 4.1.2+)
<li><a href="#V8_SRC"><code>V8_SRC</code></a>
<li><a href="#WINDOW"><code>WINDOW</code></a> (Android Browser 4.4.2+)
</ul>
</td>
</tr>
<tr>
<td>Node.js 0.10.26+</td>
<td>
<ul>
<li><a href="#ARRAY_ITERATOR"><code>ARRAY_ITERATOR</code></a> (implied by <a href="#NO_SAFARI_ARRAY_ITERATOR"><code>NO_SAFARI_ARRAY_ITERATOR</code></a>; Node.js 0.12+)
<li><a href="#DOUBLE_QUOTE_ESC_HTML"><code>DOUBLE_QUOTE_ESC_HTML</code></a>
<li><a href="#ENTRIES_OBJ"><code>ENTRIES_OBJ</code></a> (implied by <a href="#ARRAY_ITERATOR"><code>ARRAY_ITERATOR</code></a> and <a href="#NO_SAFARI_ARRAY_ITERATOR"><code>NO_SAFARI_ARRAY_ITERATOR</code></a>; Node.js 0.12+)
<li><a href="#GMT"><code>GMT</code></a>
<li><a href="#LOCALE_INFINITY"><code>LOCALE_INFINITY</code></a> (Node.js 0.12+)
<li><a href="#NAME"><code>NAME</code></a>
<li><a href="#NO_IE_SRC"><code>NO_IE_SRC</code></a> (implied by <a href="#V8_SRC"><code>V8_SRC</code></a>)
<li><a href="#NO_SAFARI_ARRAY_ITERATOR"><code>NO_SAFARI_ARRAY_ITERATOR</code></a> (Node.js 0.12+)
<li><a href="#NO_SAFARI_LF"><code>NO_SAFARI_LF</code></a>
<li><a href="#UNDEFINED"><code>UNDEFINED</code></a>
<li><a href="#V8_SRC"><code>V8_SRC</code></a>
</ul>
</td>
</tr>
</table>
