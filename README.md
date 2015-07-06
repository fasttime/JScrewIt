# JScrewIt

[![NPM](https://nodei.co/npm/jscrewit.png?compact=true)](https://nodei.co/npm/jscrewit/)

JScrewIt converts plain JavaScript into JSFuck code, which uses only six different characters to
write and run any code: `!` `(` `)` `+` `[` `]`

JScrewIt is a fork of [JSFuck](https://github.com/aemkei/jsfuck) that adds substantial enhancements
to the original implementation.
* Options to optimize code for a particular set of JavaScript engines or even just for your browser:
  the more specific your engine choice, the shorter the code you'll get.
* Support for all modern JavaScript engines.
* Neat large file encoding.

Play with it now at [**jscrew.it**](http://jscrew.it), or give a look at
[jQuery *Screwed*](https://github.com/fasttime/jquery-screwed) for a real example: a working version
of jQuery consisting of only six different characters.

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

To use JScrewIt in your project, download
[jscrewit.js](https://github.com/fasttime/JScrewIt/blob/master/lib/jscrewit.js) or
[jscrewit.min.js](https://github.com/fasttime/JScrewIt/blob/master/lib/jscrewit.min.js) from GitHub
and include it in your HTML file.

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
var output = JScrewIt.encode("alert(1)", { wrapWith: "call" });
eval(output);
```

Setting `wrapWith` to `"call"` in the second parameter of
[`JScrewIt.encode`](#jscrewitencodeinput-options) indicates that we would like the output to be
executable.

`wrapWith` should be omitted or set to `"none"` to encode a plain string instead of JavaScript code.

```js
var output = JScrewIt.encode("Hello, world!");
var input = eval(output); // input contains the string "Hello, world!".
```

#### Features

> _See also: [Feature Reference](Features.md)_

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
the value of the `features` option in the second parameter to `encode`.

For instance, the generic `alert(1)` example is 2084 chracters long.

```js
var options = { wrapWith: "call" };
var output = JScrewIt.encode("alert(1)", options); // output is 2084 characters
```

But if we specify that we are only interested in code that runs in an up to date Firefox browser,
the output length shrinks to less than a half:

```js
var options = { features: "FF31", wrapWith: "call" };
var output = JScrewIt.encode("alert(1)", options); // 972 characters now
```

You can specify more than one feature using an array, e.g.

```js
var input = "document.body.style.background='red'";
var options = { features: ["ATOB", "WINDOW"], wrapWith: "call" };
var output = JScrewIt.encode(input, options);
```

Keep in mind that each of the target engines needs to support every feature you specify.
So if you want your JSFuck code to run on both Internet Explorer and Firefox, this won't work.

```js
{ features: ["IE9", "FF31"] }
```

Instead, you have to specify features supported by both browsers.
These can be retrieved with [`JScrewIt.commonFeaturesOf`](#jscrewitcommonfeaturesoffeatures).

```js
{ features: JScrewIt.commonFeaturesOf("IE9", "FF31") }
```

The features turn out to be `"NO_SAFARI_LF"`, `"UNDEFINED"` and `"WINDOW"`; `"SELF"` and
`"SELF_OBJECT"` are both implied by `"WINDOW"`, so there is no need to specify them explicitly.
With this knowledge, the definition can be also written as below.

```js
{ features: ["NO_SAFARI_LF", "UNDEFINED", "WINDOW"] }
```

### Reference

#### <code>**JScrewIt.areFeaturesAvailable(*features*)**</code>

Returns `true` if all of the specified features are available in the current engine; otherwise,
`false`.

<dl>
<dt><code>features</code></dt>
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
<dt><code>features</code></dt>
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

#### <code>**JScrewIt.commonFeaturesOf(*features...*)**</code>

Gets an array of individual, not otherwise implied features shared by a specified group of features.

<dl>
<dt><code>features</code></dt>
<dd>
A string or array of strings specifying an element of the group of features whose common individual
features are to be retrieved.</dd>
</dl>

##### Examples

```js
JScrewIt.commonFeaturesOf("COMPACT", "IE9", "ANDRO412") // returns ["SELF", "UNDEFINED"]
```

```js
JScrewIt.commonFeaturesOf(["ATOB", "NAME"], ["NAME", "SELF"]) // returns ["NAME"]
```

##### Notes

If no arguments are specified, the return value is `undefined`.

This function throws a `ReferenceError` if some unknown features are specified.

#### <code>**JScrewIt.encode(*input*, *options*)**</code>

Encodes a given string into JSFuck. Returns the encoded string.

<dl>

<dt><code>input</code></dt>
<dd>The string to encode.</dd>

<dt><code>options</code></dt>
<dd>
An optional object specifying encoding options.

<dl>

<dt><code>options.features</code></dt>
<dd>
A string or array of strings specifying the feature(s) available on the engine that evaluates the
encoded output.
If this parameter is an empty array or <code>undefined</code>, <code>DEFAULT</code> is assumed: this
ensures maximum compatibility but also generates the largest code.
To generate shorter code, specify some features.</dd>

<dt><code>options.wrapWith</code></dt>
<dd>
This option controls the type of code generated from the given input.
Allowed values are listed below.

<dl>

<dt><code>"none"</code> (default)</dt>
<dd>
Produces a string matching the specified input string (except for trimmed parts when used in
conjunction with the option <code>trimCode</code>).</dd>

<dt><code>"call"</code></dt>
<dd>
Produces code evaluating to a call to a function whose body contains the specified input
string.</dd>

<dt><code>"eval"</code></dt>
<dd>
Produces code evaluating to the result of invoking <code>eval</code> with the specified input string
as parameter.</dd>

</dl>
</dd>

<dt><code>options.trimCode</code></dt>
<dd>
If this parameter is truthy, lines in the beginning and in the end of the file containing nothing
but space characters and JavaScript comments are removed from the generated output.
A newline terminator in the last preserved line is also removed.
This option is especially useful to strip banner comments and trailing newline characters which are
sometimes found in minified scripts.
Using this option may produce unexpected results if the input is not well-formed JavaScript
code.</dd>

</dl>
</dd>

</dl>

##### Notes

If the input string is too complex to be encoded, this function throws an `Error` with the message
"Encoding failed".
Also, an out of memory condition may occur when processing very large data.

If some unknown features are specified, a `ReferenceError` is thrown.

If the option `wrapWith` is specified with an invalid value, an `Error` with the message "Invalid
value for option wrapWith" is thrown.

#### <code>**JScrewIt.FEATURE_INFOS**</code>

This is a container mapping feature names to descriptors.
A feature descriptor is an object with a set of properties defining the feature.
Note that a feature descriptor can be mapped to by more than one name. 

##### Feature descriptor properties

<dl>

<dt><code>name</code></dt>
<dd>Primary name of the feature.</dd>

<dt><code>description</code></dt>
<dd>A short description of the feature in plain English.</dd>

<dt><code>available</code></dt>
<dd>
<code>true</code> if the specified feature is available on the current engine; otherwise,
<code>false</code>.</dd>

<dt><code>includes</code></dt>
<dd>
An array of feature names implied by this feature.
If a feature is available, its <code>includes</code> are, too.
If a feature is not available, other features including it are also not available.</dd>

<dt><code>excludes</code></dt>
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

* [JScrewIt](http://jscrew.it) online encoder
* Original discussion at [Sla.ckers.org](http://sla.ckers.org/forum/read.php?24,32930)
* JSFuck introduction and alternatives on [Esolang](http://esolangs.org/wiki/JSFuck)
