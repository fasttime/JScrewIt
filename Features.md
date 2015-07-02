# JScrewIt Feature Reference
## Feature List
This section lists all features along with their descriptions.
### `ANDRO400`
Features available in Android Browser 4.0 to 4.3.1.
### `ANDRO412`
Features available in Android Browser 4.1.2 to 4.3.1.
### `ANDRO442`
Features available in Android Browser 4.4.2 or later.
### `ATOB`
Existence of the global object functions atob and btoa.
This feature is not available in Internet Explorer versions prior to 11 and Node.js.
### `AUTO`
All features available in the current engine.
### `CAPITAL_HTML`
The property that the various string methods returning HTML code such as String.prototype.big or String.prototype.link have both the tag name and attributes written in capital letters.
This feature is only available in Internet Explorer.
### `CHROME35`
Features available in Chrome 35 and Opera 22 or later.
### `CHROME38`
Features available in Chrome 38 and Opera 25 or later.
### `COMPACT`
All new browsers' features.
No support for Node.js and older browsers like Internet Explorer 10 or Android Browser 4.1.2.
### `DEFAULT`
Minimun feature level, compatible with all supported engines.
### `DOMWINDOW`
The property that the string representation of the global object evaluates to "\[object DOMWindow\]".
Only available in Android Browser versions prior to 4.4.2.
### `DOUBLE_QUOTE_ESC_HTML`
The property that double quote characters in the argument of String.prototype.fontcolor are escaped as "\&quot;".
This feature is not available in Internet Explorer.
### `EDGE`
Features available in Microsoft Edge.
### `ENTRIES`
The property that the string representation of Array.prototype.entries\(\) starts with "\[object Array".
This feature is available in Firefox and in Chrome 38, Opera 25, Safari 7.1, Node.js 0.12 and later versions.
### `FF30`
Features available in Firefox 30 or later.
### `FF31`
Features available in Firefox 31 or later.
### `FF_SAFARI_SRC`
A string representation of native functions typically found in Firefox and Safari.
Remarkable traits are the lack of characters in the beginning of the string before "function" and a line feed with four whitespaces \("\\n    "\) before the "\[native code\]" sequence.
### `FILL`
Existence of the native function Array.prototype.fill.
Available in Firefox 31, Safari 7.1 and later versions and in Microsoft Edge.
### `GMT`
Presence of the text "GMT" after the first 25 characters in the string returned by Date\(\).
Although ECMAScript states that string representation of dates is implementation dependent, most engines align to the same format, making this feature available in all supported engines except Internet Explorer 9 and 10.
### `IE10`
Features available in Internet Explorer 10 or later.
### `IE11`
Features available in Internet Explorer 11.
### `IE9`
Features available in Internet Explorer 9 or later.
### `IE_SRC`
A string representation of native functions typical for Internet Explorer.
Remarkable traits are the presence of a line feed character \("\\n"\) in the beginning of the string before "function" and a line feed with four whitespaces \("\\n    "\) before the "\[native code\]" sequence.
### `NAME`
Existence of the name property for functions.
This feature is not available in Internet Explorer.
### `NODE`
Features available in Node.js 0.10.26 or later.
Also compatible with Chrome, Opera and Android Browser 4.1.2 or later.
### `NODE010`
Features available in Node.js 0.10.26 or later.
Also compatible with Chrome, Opera and Android Browser 4.1.2 or later.
### `NODE012`
Features available in Node.js 0.12.
Also compatible with Chrome 38, Opera 25 and Android Browser 4.1.2 and later versions.
### `NO_IE`
Features available in all supported engines except Internet Explorer.
Includes features used by JSFuck with the exception of "UNDEFINED", which is not available in older Android Browser versions.
### `NO_IE_SRC`
A string representation of native functions typical for most browsers with the notable exception of Internet Explorer.
A remarkable trait for this feature is the lack of characters in the beginning of the string before "function".
### `NO_SAFARI_ARRAY_ITERATOR`
The property that the string representation of Array.prototype.entries\(\) evaluates to "\[object Array Iterator\]".
Available in Firefox, Chrome 38, Opera 25, Node.js 0.12 and later versions.
### `NO_SAFARI_LF`
A string representation of dynamically generated functions typical for most browsers with the notable exception of Safari.
More specifically, in this representation, the character at index 22 is a line feed \("\\n"\).
### `QUOTE`
Existence of the native function String.prototype.quote.
This feature is deprecated and not available in any engine.
Native support only exists in Firefox versions prior to 37.
### `SAFARI70`
Features available in Safari 7.0.
### `SAFARI71`
Features available in Safari 7.1 or later.
### `SAFARI_ARRAY_ITERATOR`
The property that the string representation of Array.prototype.entries\(\) evaluates to "\[object ArrayIterator\]".
Available in Safari 7.1 and later versions.
### `SELF`
Existence of the global object property self whose string representation starts with "\[object " and ends with "Window\]"
This feature is not available in Node.js. It is also not available inside web workers.
### `UNDEFINED`
The property that Object.prototype.toString.call\(\) evaluates to "\[object Undefined\]".
This behavior is defined by ECMAScript, but Android Browser prior to 4.1.2 does not comply with the specification and so this feature is not available in that browser.
### `V8_SRC`
A string representation of native functions typically found in the V8 JavaScript engine.
V8 is used in Chrome, Opera, Android Browser and Node.js. Microsoft Edge, although not using V8, also has this feature available.
Remarkable traits are the lack of characters in the beginning of the string before "function" and a single whitespace before the "\[native code\]" sequence.
### `WINDOW`
The property that the string representation of the global object evaluates to "\[object Window\]".
This feature is not available in Android Browser versions prior to 4.4.2 and Node.js. It is also not available inside web workers.
## Engine Support
This table lists features available in the most common engines.
<table>
<tr>
<th>Target</th>
<th>Features</th>
</tr>
<tr>
<td>Firefox 30+</td>
<td>
<ul>
<li><a href="#atob"><code>ATOB</code></a>
<li><a href="#double_quote_esc_html"><code>DOUBLE_QUOTE_ESC_HTML</code></a>
<li><a href="#entries"><code>ENTRIES</code></a> (implied by <a href="#no_safari_array_iterator"><code>NO_SAFARI_ARRAY_ITERATOR</code></a>)
<li><a href="#ff_safari_src"><code>FF_SAFARI_SRC</code></a>
<li><a href="#fill"><code>FILL</code></a> (Firefox 31+)
<li><a href="#gmt"><code>GMT</code></a>
<li><a href="#name"><code>NAME</code></a>
<li><a href="#no_ie_src"><code>NO_IE_SRC</code></a> (implied by <a href="#ff_safari_src"><code>FF_SAFARI_SRC</code></a>)
<li><a href="#no_safari_array_iterator"><code>NO_SAFARI_ARRAY_ITERATOR</code></a>
<li><a href="#no_safari_lf"><code>NO_SAFARI_LF</code></a>
<li><a href="#self"><code>SELF</code></a> (implied by <a href="#window"><code>WINDOW</code></a>)
<li><a href="#undefined"><code>UNDEFINED</code></a>
<li><a href="#window"><code>WINDOW</code></a>
</ul>
</td>
</tr>
<tr>
<td>Chrome 35+, Opera 22+</td>
<td>
<ul>
<li><a href="#atob"><code>ATOB</code></a>
<li><a href="#double_quote_esc_html"><code>DOUBLE_QUOTE_ESC_HTML</code></a>
<li><a href="#entries"><code>ENTRIES</code></a> (implied by <a href="#no_safari_array_iterator"><code>NO_SAFARI_ARRAY_ITERATOR</code></a>; Chrome 38+, Opera 25+)
<li><a href="#gmt"><code>GMT</code></a>
<li><a href="#name"><code>NAME</code></a>
<li><a href="#no_ie_src"><code>NO_IE_SRC</code></a> (implied by <a href="#v8_src"><code>V8_SRC</code></a>)
<li><a href="#no_safari_array_iterator"><code>NO_SAFARI_ARRAY_ITERATOR</code></a> (Chrome 38+, Opera 25+)
<li><a href="#no_safari_lf"><code>NO_SAFARI_LF</code></a>
<li><a href="#self"><code>SELF</code></a> (implied by <a href="#window"><code>WINDOW</code></a>)
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
<li><a href="#atob"><code>ATOB</code></a> (Internet Explorer 10+)
<li><a href="#capital_html"><code>CAPITAL_HTML</code></a>
<li><a href="#gmt"><code>GMT</code></a> (Internet Explorer 11)
<li><a href="#ie_src"><code>IE_SRC</code></a>
<li><a href="#no_safari_lf"><code>NO_SAFARI_LF</code></a>
<li><a href="#self"><code>SELF</code></a> (implied by <a href="#window"><code>WINDOW</code></a>)
<li><a href="#undefined"><code>UNDEFINED</code></a>
<li><a href="#window"><code>WINDOW</code></a>
</ul>
</td>
</tr>
<tr>
<td>Safari 7.0+</td>
<td>
<ul>
<li><a href="#atob"><code>ATOB</code></a>
<li><a href="#double_quote_esc_html"><code>DOUBLE_QUOTE_ESC_HTML</code></a>
<li><a href="#entries"><code>ENTRIES</code></a> (implied by <a href="#safari_array_iterator"><code>SAFARI_ARRAY_ITERATOR</code></a>; Safari 7.1+)
<li><a href="#ff_safari_src"><code>FF_SAFARI_SRC</code></a>
<li><a href="#fill"><code>FILL</code></a> (Safari 7.1+)
<li><a href="#gmt"><code>GMT</code></a>
<li><a href="#name"><code>NAME</code></a>
<li><a href="#no_ie_src"><code>NO_IE_SRC</code></a> (implied by <a href="#ff_safari_src"><code>FF_SAFARI_SRC</code></a>)
<li><a href="#safari_array_iterator"><code>SAFARI_ARRAY_ITERATOR</code></a> (Safari 7.1+)
<li><a href="#self"><code>SELF</code></a> (implied by <a href="#window"><code>WINDOW</code></a>)
<li><a href="#undefined"><code>UNDEFINED</code></a>
<li><a href="#window"><code>WINDOW</code></a>
</ul>
</td>
</tr>
<tr>
<td>Microsoft Edge</td>
<td>
<ul>
<li><a href="#atob"><code>ATOB</code></a>
<li><a href="#double_quote_esc_html"><code>DOUBLE_QUOTE_ESC_HTML</code></a>
<li><a href="#fill"><code>FILL</code></a>
<li><a href="#gmt"><code>GMT</code></a>
<li><a href="#name"><code>NAME</code></a>
<li><a href="#no_ie_src"><code>NO_IE_SRC</code></a> (implied by <a href="#v8_src"><code>V8_SRC</code></a>)
<li><a href="#no_safari_lf"><code>NO_SAFARI_LF</code></a>
<li><a href="#self"><code>SELF</code></a> (implied by <a href="#window"><code>WINDOW</code></a>)
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
<li><a href="#atob"><code>ATOB</code></a>
<li><a href="#domwindow"><code>DOMWINDOW</code></a> (not in Android Browser 4.4.2+)
<li><a href="#double_quote_esc_html"><code>DOUBLE_QUOTE_ESC_HTML</code></a>
<li><a href="#gmt"><code>GMT</code></a>
<li><a href="#name"><code>NAME</code></a>
<li><a href="#no_ie_src"><code>NO_IE_SRC</code></a> (implied by <a href="#v8_src"><code>V8_SRC</code></a>)
<li><a href="#no_safari_lf"><code>NO_SAFARI_LF</code></a>
<li><a href="#self"><code>SELF</code></a> (implied by <a href="#domwindow"><code>DOMWINDOW</code></a> and <a href="#window"><code>WINDOW</code></a>)
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
<li><a href="#double_quote_esc_html"><code>DOUBLE_QUOTE_ESC_HTML</code></a>
<li><a href="#entries"><code>ENTRIES</code></a> (implied by <a href="#no_safari_array_iterator"><code>NO_SAFARI_ARRAY_ITERATOR</code></a>; Node.js 0.12+)
<li><a href="#gmt"><code>GMT</code></a>
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
