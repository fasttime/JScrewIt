# JScrewIt Feature Reference
## Feature List
This section lists all features along with their descriptions.
### `ANDRO400`
Features available in Android Browser 4.0 to 4.3.1.
### `ANDRO412`
Features available in Android Browser 4.1.2 to 4.3.1.
### `ANDRO442`
Features available in Android Browser 4.4.2 or later.
### `ANY_DOCUMENT`
Existence of the global object property document whose string representation starts with "\[object " and ends with "Document\]".
This feature is not available in Node.js. It is also not available inside web workers.
### `ANY_WINDOW`
Existence of the global object property self whose string representation starts with "\[object " and ends with "Window\]".
This feature is not available in Node.js. It is also not available inside web workers.
### `ARRAY_ITERATOR`
The property that the string representation of Array.prototype.entries\(\) starts with "\[object Array" and ends with "\]" at index 21 or 22.
This feature is available in Firefox, Chrome, Opera, and in Safari 7.1, Node.js 0.12 and later versions.
### `ATOB`
Existence of the global object functions atob and btoa.
This feature is not available in Internet Explorer versions prior to 11 and Node.js.
### `AUTO`
All features available in the current engine.
### `CAPITAL_HTML`
The property that the various string methods returning HTML code such as String.prototype.big or String.prototype.link have both the tag name and attributes written in capital letters.
This feature is only available in Internet Explorer.
### `CHROME41`
Features available in Chrome 41 and Opera 28 or later.
### `COMPACT`
All new browsers' features.
No support for Node.js and older browsers like Internet Explorer, Safari 7.0 or Android Browser
### `DEFAULT`
Minimun feature level, compatible with all supported engines.
### `DOCUMENT`
Existence of the global object property document having the string representation "\[object Document\]".
This feature is only available in Internet Explorer 9 and 10. It is not available inside web workers.
### `DOMWINDOW`
Existence of the global object property self having the string representation "\[object DOMWindow\]".
Only available in Android Browser versions prior to 4.4.2.
### `DOUBLE_QUOTE_ESC_HTML`
The property that double quote characters in the argument of String.prototype.fontcolor are escaped as "\&quot;".
This feature is not available in Internet Explorer.
### `EDGE`
Features available in Microsoft Edge.
### `ENTRIES`
The property that the string representation of Array.prototype.entries\(\) starts with "\[object ".
This feature is available in Firefox, Chrome, Opera, Microsoft Edge, and in Safari 7.1, Node.js 0.12 and later versions.
### `FF31`
Features available in Firefox 31 or later.
### `FF_SAFARI_SRC`
A string representation of native functions typically found in Firefox and Safari.
Remarkable traits are the lack of characters in the beginning of the string before "function" and a line feed with four whitespaces \("\\n    "\) before the "\[native code\]" sequence.
### `FILL`
Existence of the native function Array.prototype.fill.
Available in Firefox, Microsoft Edge, and in Safari 7.1 and later versions.
### `FROM_CODE_POINT`
Existence of the function String.fromCodePoint.
Available in Firefox, Chrome, Opera and Microsoft Edge.
### `GMT`
Presence of the text "GMT" after the first 25 characters in the string returned by Date\(\).
Although ECMAScript states that string representation of dates is implementation dependent, most engines align to the same format, making this feature available in all supported engines except Internet Explorer 9 and 10.
### `HTMLDOCUMENT`
Existence of the global object property document having the string representation "\[object HTMLDocument\]".
This feature is not available in Internet Explorer versions prior to 11 and Node.js. It is also not available inside web workers.
### `IE10`
Features available in Internet Explorer 10 or later.
### `IE11`
Features available in Internet Explorer 11.
### `IE9`
Features available in Internet Explorer 9 or later.
### `IE_SRC`
A string representation of native functions typical for Internet Explorer.
Remarkable traits are the presence of a line feed character \("\\n"\) in the beginning of the string before "function" and a line feed with four whitespaces \("\\n    "\) before the "\[native code\]" sequence.
### `LOCALE_INFINITY`
Language sensitive string representation of Infinity as "∞".
Available in Firefox, Chrome, Opera, Microsoft Edge, and in Android Browser 4.4.2, Node.js 0.12 and later versions.
### `NAME`
Existence of the name property for functions.
This feature is not available in Internet Explorer.
### `NODE`
_An alias for [`NODE010`](#node010)._
### `NODE010`
Features available in Node.js 0.10.26 or later.
Also compatible with Chrome, Opera and Android Browser 4.1.2 or later.
### `NODE012`
Features available in Node.js 0.12.
Also compatible with Chrome 38, Opera 25 and Android Browser 4.1.2 and later versions.
### `NO_IE_SRC`
A string representation of native functions typical for most browsers with the notable exception of Internet Explorer.
A remarkable trait for this feature is the lack of characters in the beginning of the string before "function".
### `NO_SAFARI_ARRAY_ITERATOR`
The property that the string representation of Array.prototype.entries\(\) evaluates to "\[object Array Iterator\]".
Available in Firefox, Chrome, Opera, and in Node.js 0.12 and later versions.
### `NO_SAFARI_LF`
A string representation of dynamically generated functions typical for most browsers with the notable exception of Safari.
More specifically, in this representation, the character at index 22 is a line feed \("\\n"\).
### `SAFARI70`
Features available in Safari 7.0.
### `SAFARI71`
Features available in Safari 7.1 or later.
### `SAFARI_ARRAY_ITERATOR`
The property that the string representation of Array.prototype.entries\(\) evaluates to "\[object ArrayIterator\]".
Available in Safari 7.1 and later versions.
### `SELF`
_An alias for [`ANY_WINDOW`](#any_window)._
### `SELF_OBJECT`
Existence of the global object property self whose string representation starts with "\[object ".
This feature is not available in Node.js. It is also not available inside web workers in Safari 8.0.
### `UNDEFINED`
The property that Object.prototype.toString.call\(\) evaluates to "\[object Undefined\]".
This behavior is defined by ECMAScript, and is supported by all engines except Android Browser versions prior to 4.1.2, where this feature is not available.
### `V8_SRC`
A string representation of native functions typically found in the V8 JavaScript engine.
V8 is used in Chrome, Opera, Android Browser and Node.js. Microsoft Edge, although not using V8, also has this feature available.
Remarkable traits are the lack of characters in the beginning of the string before "function" and a single whitespace before the "\[native code\]" sequence.
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
<li><a href="#any_document"><code>ANY_DOCUMENT</code></a> (implied by <a href="#htmldocument"><code>HTMLDOCUMENT</code></a>)
<li><a href="#any_window"><code>ANY_WINDOW</code></a> (implied by <a href="#window"><code>WINDOW</code></a>)
<li><a href="#array_iterator"><code>ARRAY_ITERATOR</code></a> (implied by <a href="#no_safari_array_iterator"><code>NO_SAFARI_ARRAY_ITERATOR</code></a>)
<li><a href="#atob"><code>ATOB</code></a>
<li><a href="#double_quote_esc_html"><code>DOUBLE_QUOTE_ESC_HTML</code></a>
<li><a href="#entries"><code>ENTRIES</code></a> (implied by <a href="#array_iterator"><code>ARRAY_ITERATOR</code></a> and <a href="#no_safari_array_iterator"><code>NO_SAFARI_ARRAY_ITERATOR</code></a>)
<li><a href="#ff_safari_src"><code>FF_SAFARI_SRC</code></a>
<li><a href="#fill"><code>FILL</code></a>
<li><a href="#from_code_point"><code>FROM_CODE_POINT</code></a>
<li><a href="#gmt"><code>GMT</code></a>
<li><a href="#htmldocument"><code>HTMLDOCUMENT</code></a>
<li><a href="#locale_infinity"><code>LOCALE_INFINITY</code></a>
<li><a href="#name"><code>NAME</code></a>
<li><a href="#no_ie_src"><code>NO_IE_SRC</code></a> (implied by <a href="#ff_safari_src"><code>FF_SAFARI_SRC</code></a>)
<li><a href="#no_safari_array_iterator"><code>NO_SAFARI_ARRAY_ITERATOR</code></a>
<li><a href="#no_safari_lf"><code>NO_SAFARI_LF</code></a>
<li><a href="#self_object"><code>SELF_OBJECT</code></a> (implied by <a href="#any_window"><code>ANY_WINDOW</code></a> and <a href="#window"><code>WINDOW</code></a>)
<li><a href="#undefined"><code>UNDEFINED</code></a>
<li><a href="#window"><code>WINDOW</code></a>
</ul>
</td>
</tr>
<tr>
<td>Chrome 41+, Opera 28+</td>
<td>
<ul>
<li><a href="#any_document"><code>ANY_DOCUMENT</code></a> (implied by <a href="#htmldocument"><code>HTMLDOCUMENT</code></a>)
<li><a href="#any_window"><code>ANY_WINDOW</code></a> (implied by <a href="#window"><code>WINDOW</code></a>)
<li><a href="#array_iterator"><code>ARRAY_ITERATOR</code></a> (implied by <a href="#no_safari_array_iterator"><code>NO_SAFARI_ARRAY_ITERATOR</code></a>)
<li><a href="#atob"><code>ATOB</code></a>
<li><a href="#double_quote_esc_html"><code>DOUBLE_QUOTE_ESC_HTML</code></a>
<li><a href="#entries"><code>ENTRIES</code></a> (implied by <a href="#array_iterator"><code>ARRAY_ITERATOR</code></a> and <a href="#no_safari_array_iterator"><code>NO_SAFARI_ARRAY_ITERATOR</code></a>)
<li><a href="#from_code_point"><code>FROM_CODE_POINT</code></a>
<li><a href="#gmt"><code>GMT</code></a>
<li><a href="#htmldocument"><code>HTMLDOCUMENT</code></a>
<li><a href="#locale_infinity"><code>LOCALE_INFINITY</code></a>
<li><a href="#name"><code>NAME</code></a>
<li><a href="#no_ie_src"><code>NO_IE_SRC</code></a> (implied by <a href="#v8_src"><code>V8_SRC</code></a>)
<li><a href="#no_safari_array_iterator"><code>NO_SAFARI_ARRAY_ITERATOR</code></a>
<li><a href="#no_safari_lf"><code>NO_SAFARI_LF</code></a>
<li><a href="#self_object"><code>SELF_OBJECT</code></a> (implied by <a href="#any_window"><code>ANY_WINDOW</code></a> and <a href="#window"><code>WINDOW</code></a>)
<li><a href="#undefined"><code>UNDEFINED</code></a>
<li><a href="#v8_src"><code>V8_SRC</code></a>
<li><a href="#window"><code>WINDOW</code></a>
</ul>
</td>
</tr>
<tr>
<td>Internet Explorer 9+</td>
<td>
<ul>
<li><a href="#any_document"><code>ANY_DOCUMENT</code></a> (implied by <a href="#document"><code>DOCUMENT</code></a> and <a href="#htmldocument"><code>HTMLDOCUMENT</code></a>)
<li><a href="#any_window"><code>ANY_WINDOW</code></a> (implied by <a href="#window"><code>WINDOW</code></a>)
<li><a href="#atob"><code>ATOB</code></a> (Internet Explorer 10+)
<li><a href="#capital_html"><code>CAPITAL_HTML</code></a>
<li><a href="#document"><code>DOCUMENT</code></a> (not in Internet Explorer 11)
<li><a href="#gmt"><code>GMT</code></a> (Internet Explorer 11)
<li><a href="#htmldocument"><code>HTMLDOCUMENT</code></a> (Internet Explorer 11)
<li><a href="#ie_src"><code>IE_SRC</code></a>
<li><a href="#no_safari_lf"><code>NO_SAFARI_LF</code></a>
<li><a href="#self_object"><code>SELF_OBJECT</code></a> (implied by <a href="#any_window"><code>ANY_WINDOW</code></a> and <a href="#window"><code>WINDOW</code></a>)
<li><a href="#undefined"><code>UNDEFINED</code></a>
<li><a href="#window"><code>WINDOW</code></a>
</ul>
</td>
</tr>
<tr>
<td>Safari 7.0+</td>
<td>
<ul>
<li><a href="#any_document"><code>ANY_DOCUMENT</code></a> (implied by <a href="#htmldocument"><code>HTMLDOCUMENT</code></a>)
<li><a href="#any_window"><code>ANY_WINDOW</code></a> (implied by <a href="#window"><code>WINDOW</code></a>)
<li><a href="#array_iterator"><code>ARRAY_ITERATOR</code></a> (implied by <a href="#safari_array_iterator"><code>SAFARI_ARRAY_ITERATOR</code></a>; Safari 7.1+)
<li><a href="#atob"><code>ATOB</code></a>
<li><a href="#double_quote_esc_html"><code>DOUBLE_QUOTE_ESC_HTML</code></a>
<li><a href="#entries"><code>ENTRIES</code></a> (implied by <a href="#array_iterator"><code>ARRAY_ITERATOR</code></a> and <a href="#safari_array_iterator"><code>SAFARI_ARRAY_ITERATOR</code></a>; Safari 7.1+)
<li><a href="#ff_safari_src"><code>FF_SAFARI_SRC</code></a>
<li><a href="#fill"><code>FILL</code></a> (Safari 7.1+)
<li><a href="#gmt"><code>GMT</code></a>
<li><a href="#htmldocument"><code>HTMLDOCUMENT</code></a>
<li><a href="#name"><code>NAME</code></a>
<li><a href="#no_ie_src"><code>NO_IE_SRC</code></a> (implied by <a href="#ff_safari_src"><code>FF_SAFARI_SRC</code></a>)
<li><a href="#safari_array_iterator"><code>SAFARI_ARRAY_ITERATOR</code></a> (Safari 7.1+)
<li><a href="#self_object"><code>SELF_OBJECT</code></a> (implied by <a href="#any_window"><code>ANY_WINDOW</code></a> and <a href="#window"><code>WINDOW</code></a>)
<li><a href="#undefined"><code>UNDEFINED</code></a>
<li><a href="#window"><code>WINDOW</code></a>
</ul>
</td>
</tr>
<tr>
<td>Microsoft Edge</td>
<td>
<ul>
<li><a href="#any_document"><code>ANY_DOCUMENT</code></a> (implied by <a href="#htmldocument"><code>HTMLDOCUMENT</code></a>)
<li><a href="#any_window"><code>ANY_WINDOW</code></a> (implied by <a href="#window"><code>WINDOW</code></a>)
<li><a href="#atob"><code>ATOB</code></a>
<li><a href="#double_quote_esc_html"><code>DOUBLE_QUOTE_ESC_HTML</code></a>
<li><a href="#entries"><code>ENTRIES</code></a>
<li><a href="#fill"><code>FILL</code></a>
<li><a href="#from_code_point"><code>FROM_CODE_POINT</code></a>
<li><a href="#gmt"><code>GMT</code></a>
<li><a href="#htmldocument"><code>HTMLDOCUMENT</code></a>
<li><a href="#locale_infinity"><code>LOCALE_INFINITY</code></a>
<li><a href="#name"><code>NAME</code></a>
<li><a href="#no_ie_src"><code>NO_IE_SRC</code></a> (implied by <a href="#v8_src"><code>V8_SRC</code></a>)
<li><a href="#no_safari_lf"><code>NO_SAFARI_LF</code></a>
<li><a href="#self_object"><code>SELF_OBJECT</code></a> (implied by <a href="#any_window"><code>ANY_WINDOW</code></a> and <a href="#window"><code>WINDOW</code></a>)
<li><a href="#undefined"><code>UNDEFINED</code></a>
<li><a href="#v8_src"><code>V8_SRC</code></a>
<li><a href="#window"><code>WINDOW</code></a>
</ul>
</td>
</tr>
<tr>
<td>Android Browser 4.0+</td>
<td>
<ul>
<li><a href="#any_document"><code>ANY_DOCUMENT</code></a> (implied by <a href="#htmldocument"><code>HTMLDOCUMENT</code></a>)
<li><a href="#any_window"><code>ANY_WINDOW</code></a> (implied by <a href="#domwindow"><code>DOMWINDOW</code></a> and <a href="#window"><code>WINDOW</code></a>)
<li><a href="#atob"><code>ATOB</code></a>
<li><a href="#domwindow"><code>DOMWINDOW</code></a> (not in Android Browser 4.4.2+)
<li><a href="#double_quote_esc_html"><code>DOUBLE_QUOTE_ESC_HTML</code></a>
<li><a href="#gmt"><code>GMT</code></a>
<li><a href="#htmldocument"><code>HTMLDOCUMENT</code></a>
<li><a href="#locale_infinity"><code>LOCALE_INFINITY</code></a> (Android Browser 4.4.2+)
<li><a href="#name"><code>NAME</code></a>
<li><a href="#no_ie_src"><code>NO_IE_SRC</code></a> (implied by <a href="#v8_src"><code>V8_SRC</code></a>)
<li><a href="#no_safari_lf"><code>NO_SAFARI_LF</code></a>
<li><a href="#self_object"><code>SELF_OBJECT</code></a> (implied by <a href="#any_window"><code>ANY_WINDOW</code></a> and <a href="#domwindow"><code>DOMWINDOW</code></a> and <a href="#window"><code>WINDOW</code></a>)
<li><a href="#undefined"><code>UNDEFINED</code></a> (Android Browser 4.1.2+)
<li><a href="#v8_src"><code>V8_SRC</code></a>
<li><a href="#window"><code>WINDOW</code></a> (Android Browser 4.4.2+)
</ul>
</td>
</tr>
<tr>
<td>Node.js 0.10.26+</td>
<td>
<ul>
<li><a href="#array_iterator"><code>ARRAY_ITERATOR</code></a> (implied by <a href="#no_safari_array_iterator"><code>NO_SAFARI_ARRAY_ITERATOR</code></a>; Node.js 0.12+)
<li><a href="#double_quote_esc_html"><code>DOUBLE_QUOTE_ESC_HTML</code></a>
<li><a href="#entries"><code>ENTRIES</code></a> (implied by <a href="#array_iterator"><code>ARRAY_ITERATOR</code></a> and <a href="#no_safari_array_iterator"><code>NO_SAFARI_ARRAY_ITERATOR</code></a>; Node.js 0.12+)
<li><a href="#gmt"><code>GMT</code></a>
<li><a href="#locale_infinity"><code>LOCALE_INFINITY</code></a> (Node.js 0.12+)
<li><a href="#name"><code>NAME</code></a>
<li><a href="#no_ie_src"><code>NO_IE_SRC</code></a> (implied by <a href="#v8_src"><code>V8_SRC</code></a>)
<li><a href="#no_safari_array_iterator"><code>NO_SAFARI_ARRAY_ITERATOR</code></a> (Node.js 0.12+)
<li><a href="#no_safari_lf"><code>NO_SAFARI_LF</code></a>
<li><a href="#undefined"><code>UNDEFINED</code></a>
<li><a href="#v8_src"><code>V8_SRC</code></a>
</ul>
</td>
</tr>
</table>
