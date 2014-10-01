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

## API

### Including in your project

To use JScrewIt from another project, just include the file jscrewit.js (or jscrewit.min.js) in your
HTML file:

```html
<script src="jscrewit/jscrewit.js"></script>
```

or require it in Node.js:

```js
var JScrewIt = require("jscrewit/jscrewit.js");
```

### Reference

#### <code>JScrewIt.areFeaturesAvailable(*features*)</code>

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

#### <code>JScrewIt.areFeaturesCompatible(*features*)</code>

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

#### <code>JScrewIt.encode(*input*, *wrapWithEval*, *features*)</code>

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

This function throws a `ReferenceError` if some unknown features are specified.

#### <code>JScrewIt.FEATURE_INFOS</code>

This is a container mapping feature names to descriptors.
A feature descriptor is an object with a set of properties defining the feature.

##### Feature descriptor properties

<dl>

<dt><code><strong>name</strong></code></dt>
<dd>Name of the feature.</dd>

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
Object.getOwnPropertyNames(JScrewIt.FEATURE_INFOS)
```

## Links

* [JSFuck](http://www.jsfuck.com)
* Original discussion at [Sla.ckers.org](http://sla.ckers.org/forum/read.php?24,32930)
