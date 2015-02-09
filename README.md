# JScrewIt

JScrewIt converts plain JavaScript into JSFuck code, which uses only six different characters to
write and execute any code: `[]()!+`.

JScrewIt is a fork of [JSFuck](https://github.com/aemkei/jsfuck) with the ability to optimize code
for a particular set of JavaScript engines and even just for your browser.

The more specific your engine choice, the shorter the code you'll get.

Demo: [jscrew.it](http://jscrew.it)

## Example

The following source will do an `alert(1)` in any browser, including Internet Explorer:

```js
[][(![]+[])[+[]]+([![]]+[][[]])[+!![]+[+[]]]+(![]+[])[!![]+!![]]+(!![]+[])[+[]]+
(!![]+[])[!![]+!![]+!![]]+(!![]+[])[+!![]]][(+(+!![]+[+([][(![]+[])[+[]]+([![]]+
[][[]])[+!![]+[+[]]]+(![]+[])[!![]+!![]]+(!![]+[])[+[]]+(!![]+[])[!![]+!![]+!![]
]+(!![]+[])[+!![]]]+[])[+[]]])+[!![]]+[][(![]+[])[+[]]+([![]]+[][[]])[+!![]+[+[]
]]+(![]+[])[!![]+!![]]+(!![]+[])[+[]]+(!![]+[])[!![]+!![]+!![]]+(!![]+[])[+!![]]
])[+!![]+[+[]]]+(!!(+([][(![]+[])[+[]]+([![]]+[][[]])[+!![]+[+[]]]+(![]+[])[!![]
+!![]]+(!![]+[])[+[]]+(!![]+[])[!![]+!![]+!![]]+(!![]+[])[+!![]]]+[])[+[]]+!![])
+[][(![]+[])[+[]]+([![]]+[][[]])[+!![]+[+[]]]+(![]+[])[!![]+!![]]+(!![]+[])[+[]]
+(!![]+[])[!![]+!![]+!![]]+(!![]+[])[+!![]]])[+!![]+[+!![]]]+([][[]]+[])[+!![]]+
(![]+[])[!![]+!![]+!![]]+(!![]+[])[+[]]+(!![]+[])[+!![]]+([][[]]+[])[+[]]+(+(+!!
[]+[+([][(![]+[])[+[]]+([![]]+[][[]])[+!![]+[+[]]]+(![]+[])[!![]+!![]]+(!![]+[])
[+[]]+(!![]+[])[!![]+!![]+!![]]+(!![]+[])[+!![]]]+[])[+[]]])+[!![]]+[][(![]+[])[
+[]]+([![]]+[][[]])[+!![]+[+[]]]+(![]+[])[!![]+!![]]+(!![]+[])[+[]]+(!![]+[])[!!
[]+!![]+!![]]+(!![]+[])[+!![]]])[+!![]+[+[]]]+(!![]+[])[+[]]+(!!(+([][(![]+[])[+
[]]+([![]]+[][[]])[+!![]+[+[]]]+(![]+[])[!![]+!![]]+(!![]+[])[+[]]+(!![]+[])[!![
]+!![]+!![]]+(!![]+[])[+!![]]]+[])[+[]]+!![])+[][(![]+[])[+[]]+([![]]+[][[]])[+!
![]+[+[]]]+(![]+[])[!![]+!![]]+(!![]+[])[+[]]+(!![]+[])[!![]+!![]+!![]]+(!![]+[]
)[+!![]]])[+!![]+[+!![]]]+(!![]+[])[+!![]]]((![]+[])[+!![]]+(![]+[])[!![]+!![]]+
(!![]+[])[!![]+!![]+!![]]+(!![]+[])[+!![]]+(!![]+[])[+[]]+(!!(+([][(![]+[])[+[]]
+([![]]+[][[]])[+!![]+[+[]]]+(![]+[])[!![]+!![]]+(!![]+[])[+[]]+(!![]+[])[!![]+!
![]+!![]]+(!![]+[])[+!![]]]+[])[+[]]+!![])+[][(![]+[])[+[]]+([![]]+[][[]])[+!![]
+[+[]]]+(![]+[])[!![]+!![]]+(!![]+[])[+[]]+(!![]+[])[!![]+!![]+!![]]+(!![]+[])[+
!![]]])[!![]+!![]+[+[]]]+[+!![]]+(!!(+([][(![]+[])[+[]]+([![]]+[][[]])[+!![]+[+[
]]]+(![]+[])[!![]+!![]]+(!![]+[])[+[]]+(!![]+[])[!![]+!![]+!![]]+(!![]+[])[+!![]
]]+[])[+[]]+!![])+[][(![]+[])[+[]]+([![]]+[][[]])[+!![]+[+[]]]+(![]+[])[!![]+!![
]]+(!![]+[])[+[]]+(!![]+[])[!![]+!![]+!![]]+(!![]+[])[+!![]]])[!![]+!![]+[+!![]]
])()
``` 

## Usage

### Installation

To use JScrewIt in your project, download [jscrewit.js]
(https://github.com/fasttime/JScrewIt/blob/master/lib/jscrewit.js) or [jscrewit.min.js]
(https://github.com/fasttime/JScrewIt/blob/master/lib/jscrewit.min.js) from GitHub and include it in
your HTML file.

```html
<script src="jscrewit.js"></script>
```

Alternatively, you can hotlink the online file.

```html
<script src="https://rawgithub.com/fasttime/JScrewIt/master/lib/jscrewit.min.js"></script>
```

If you are using Node.js, you can install JScrewIt with [npm](https://www.npmjs.org).

```
npm install jscrewit
```

Then you can include it in your code.

```js
var JScrewIt = require("jscrewit");
```

### Encoding

#### Basics

This will encode the `alert(1)` example shown above and run it using `eval`.

```js
var output = JScrewIt.encode("alert(1)", true);
eval(output);
```

The `true` passed as a second parameter indicates that we would like the output to be executable.

This parameter should be `false` to encode a plain string rather than JavaScript code.

```js
var output = JScrewIt.encode("Hello, world!", false);
var input = eval(output); // input contains the string "Hello, world!".
```

#### Features

JScrewIt has the ability to generate JSFuck code that is targeted for a particular set of JavaScript
engines (web browsers or Node.js).
This optimized code is shorter than generic JSFuck code but does not work everywhere.
To make use of this optimization, you have to specify which *features* the decoder engine is
expected to support.
In order to understand how this works consider the JavaScript functions `atob` and `btoa`.
Not all browsers support these functions: without any further information, JScrewIt will assume that
they are unavailable and will not be able to use them in generated code.
Anyway, if you know in advance that the browsers you plan to target do support `atob` and `btoa`
indeed, you can let JScrewIt create code that uses those functions whenever this would make the
output shorter.
The way to tell JScrewIt to use these features is by specifying a string (or array of strings) as
a third parameter to `encode`.

For instance, the generic `alert(1)` example is 2084 chracters long.

```js
var output = JScrewIt.encode("alert(1)", true); // output is 2084 characters
```

But if we specify that we are only interested in code that runs in an up to date Firefox browser,
the output length shrinks to less than a half:

```js
var output = JScrewIt.encode("alert(1)", true, "FF31"); // 972 characters now
```

You can specify more than one feature using an array, e.g.

```js
var input = "document.body.style.background='red'";
var features = ["ATOB", "WINDOW"];
var output = JScrewIt.encode(input, true, features);
```

This table lists individual features of some common browsers.

<table>
<tr>
<th>Target</th>
<th>Features</th>
</tr>
<tr>
<td>Firefox 30+</td>
<td>
<ul>
<li><code>ATOB</code>
<li><code>ENTRIES</code> (implied by <code>NO_SAFARI_ARRAY_ITERATOR</code>)
<li><code>FF_SAFARI_SRC</code>
<li><code>FILL</code> (Firefox 31+)
<li><code>GMT</code>
<li><code>LINK_DOUBLE_QUOTE_ESC</code>
<li><code>NAME</code>
<li><code>NO_IE_SRC</code> (implied by <code>FF_SAFARI_SRC</code>)
<li><code>NO_SAFARI_ARRAY_ITERATOR</code>
<li><code>NO_SAFARI_LF</code>
<li><code>SELF</code> (implied by <code>WINDOW</code>)
<li><code>UNDEFINED</code>
<li><code>WINDOW</code>
</td>
</tr>
<tr>
<td>
Google Chrome 35+, Opera 22+
</td>
<td>
<ul>
<li><code>ATOB</code>
<li><code>ENTRIES</code> (implied by <code>NO_SAFARI_ARRAY_ITERATOR</code>; Chrome 38+, Opera 25+)
<li><code>GMT</code>
<li><code>LINK_DOUBLE_QUOTE_ESC</code>
<li><code>NAME</code>
<li><code>NO_IE_SRC</code> (implied by <code>V8_SRC</code>)
<li><code>NO_SAFARI_ARRAY_ITERATOR</code> (Chrome 38+, Opera 25+)
<li><code>NO_SAFARI_LF</code>
<li><code>SELF</code> (implied by <code>WINDOW</code>)
<li><code>UNDEFINED</code>
<li><code>V8_SRC</code>
<li><code>WINDOW</code>
</ul>
</td>
</tr>
<tr>
<td>
Internet Explorer 9+
</td>
<td>
<ul>
<li><code>ATOB</code> (Internet Explorer 10+)
<li><code>GMT</code> (Internet Explorer 11)
<li><code>IE_SRC</code>
<li><code>NO_SAFARI_LF</code>
<li><code>SELF</code> (implied by <code>WINDOW</code>)
<li><code>UNDEFINED</code>
<li><code>WINDOW</code>
</ul>
</td>
</tr>
<tr>
<td>
Safari 7.0+
</td>
<td>
<ul>
<li><code>ATOB</code>
<li><code>ENTRIES</code> (implied by <code>SAFARI_ARRAY_ITERATOR</code>; Safari 7.1+)
<li><code>FF_SAFARI_SRC</code>
<li><code>FILL</code> (Safari 7.1+)
<li><code>GMT</code>
<li><code>LINK_DOUBLE_QUOTE_ESC</code>
<li><code>NAME</code>
<li><code>NO_IE_SRC</code> (implied by <code>FF_SAFARI_SRC</code>)
<li><code>SAFARI_ARRAY_ITERATOR</code> (Safari 7.1+)
<li><code>SELF</code> (implied by <code>WINDOW</code>)
<li><code>UNDEFINED</code>
<li><code>WINDOW</code>
</ul>
</td>
</tr>
<tr>
<td>
Android Browser 4.0+
</td>
<td>
<ul>
<li><code>ATOB</code>
<li><code>DOMWINDOW</code> (not in Android Browser 4.4.2+)
<li><code>GMT</code>
<li><code>LINK_DOUBLE_QUOTE_ESC</code>
<li><code>NAME</code>
<li><code>NO_IE_SRC</code> (implied by <code>V8_SRC</code>)
<li><code>NO_SAFARI_LF</code>
<li><code>SELF</code> (implied by <code>DOMWINDOW</code> and <code>WINDOW</code>)
<li><code>UNDEFINED</code> (Android Browser 4.1.2+)
<li><code>V8_SRC</code>
<li><code>WINDOW</code> (Android Browser 4.4.2+)
</ul>
</td>
</tr>
<tr>
<td>
Node.js 0.10.28+
</td>
<td>
<ul>
<li><code>ENTRIES</code> (implied by <code>NO_SAFARI_ARRAY_ITERATOR</code>; Node.js 0.12)
<li><code>GMT</code>
<li><code>LINK_DOUBLE_QUOTE_ESC</code>
<li><code>NAME</code>
<li><code>NO_IE_SRC</code> (implied by <code>V8_SRC</code>)
<li><code>NO_SAFARI_ARRAY_ITERATOR</code> (Node.js 0.12)
<li><code>NO_SAFARI_LF</code>
<li><code>UNDEFINED</code>
<li><code>V8_SRC</code>
</ul>
</td>
</tr>
</table>

Keep in mind that each of the target engines needs to support every feature you specify.
So if you want your JSFuck code to run on both Internet Explorer and Firefox, this won't work.

```js
var features = ["IE9", "FF31"];
```

Instead, you have to specify features supported by both browsers.
Those turn out out to be `"NO_SAFARI_LF"`, `"SELF"`, `"UNDEFINED"` and `"WINDOW"`.

```js
var features = ["NO_SAFARI_LF", "SELF", "UNDEFINED", "WINDOW"];
```

### Reference

#### <code>**JScrewIt.areFeaturesAvailable(*features*)**</code>

Returns `true` if all of the specified features are available in the current engine; otherwise,
`false`.

<dl>
<dt><code><strong><em>features</em></strong></code></dt>
<dd>A string or array of strings specifying the feature(s) to be tested.</dd>
</dl>

##### Examples

```js
JScrewIt.areFeaturesAvailable("NO_IE_SRC")
```

```js
JScrewIt.areFeaturesAvailable(["ATOB", "GMT", "NAME"])
```

##### Notes

If *`features`* is an empty array or `undefined`, the return value is `true`.

This function throws a `ReferenceError` if some unknown features are specified.

#### <code>**JScrewIt.areFeaturesCompatible(*features*)**</code>

Returns `true` if the specified features are compatible with each other.

<dl>
<dt><code><strong><em>features</em></strong></code></dt>
<dd>A string or array of strings specifying the feature(s) to be tested.</dd>
</dl>

##### Examples

```js
JScrewIt.areFeaturesCompatible(["V8_SRC", "IE_SRC"]) // returns false
```

```js
JScrewIt.areFeaturesCompatible(["DEFAULT", "FILL"]) // returns true
```

##### Notes

If *`features`* is an empty array or `undefined`, or if it only specifies one feature, the return
value is `true`.

This function throws a `ReferenceError` if some unknown features are specified.

#### <code>**JScrewIt.encode(*input*, *wrapWithEval*, *features*)**</code>

Encodes a given string into JSFuck. Returns the encoded string.

<dl>

<dt><code><strong><em>input</em></strong></code></dt>
<dd>The string to encode.</dd>

<dt><code><strong><em>wrapWithEval</em></strong></code></dt>
<dd>
If this parameter is truthy, the return value evaluates to a function that runs the specified string
as JavaScript code.
If this parameter is falsy, the return value evaluates to a string equivalent to the specified
input.</dd>

<dt><code><strong><em>features</em></strong></code></dt>
<dd>
A string or array of strings specifying the feature(s) available on the engine that evaluates the
encoded output.
If this parameter is an empty array or <code>undefined</code>, <code>DEFAULT</code> is assumed: this
ensures maximum compatibility but also generates the largest code.
To generate shorter code, specify some features.</dd>

</dl>

##### Notes

If the input string is too complex to be encoded, this function throws an `Error` with the message
"Encoding failed".
Also, an out of memory condition may occur when processing very large data.

If some unknown features are specified, a `ReferenceError` is thrown.

#### <code>**JScrewIt.FEATURE_INFOS**</code>

This is a container mapping feature names to descriptors.
A feature descriptor is an object with a set of properties defining the feature.
Note that a feature descriptor can be mapped to by more than one name. 

##### Feature descriptor properties

<dl>

<dt><code><strong>name</strong></code></dt>
<dd>Primary name of the feature.</dd>

<dt><code><strong>description</strong></code></dt>
<dd>A short description of the feature in plain English.</dd>

<dt><code><strong>available</strong></code></dt>
<dd>
<code>true</code> if the specified feature is available on the current engine; otherwise,
<code>false</code>.</dd>

<dt><code><strong>includes</strong></code></dt>
<dd>
An array of feature names implied by this feature.
If a feature is available, its <code>includes</code> are, too.
If a feature is not available, other features including it are also not available.</dd>

<dt><code><strong>excludes</strong></code></dt>
<dd>
An array of feature names not compatible with this feature.
If a feature is available, its <code>excludes</code> are not.</dd>

</dl>

##### Examples

This will return an array with the names of all features supported by JScrewIt:

```js
Object.keys(JScrewIt.FEATURE_INFOS)
```

## Links

* [JSFuck](http://www.jsfuck.com)
* Original discussion at [Sla.ckers.org](http://sla.ckers.org/forum/read.php?24,32930)
