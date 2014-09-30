# JScrewIt `[]()!+`

JScrewIt converts plain JavaScript into JSFuck code, which uses only six different characters to write and execute any code.

JScrewIt is a fork of [JSFuck](https://github.com/aemkei/jsfuck) with the ability to optimize code for a particular set of JavaScript engines and even just for your browser.

The more specific your engine choice, the shorter the code you'll get.

Demo: [jscrew.it](http://jscrew.it)

### Example

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

### API

#### Including in your project

To use JScrewIt from another project, just include the file jscrewit.js (or jscrewit.min.js) in your HTML file:

```html
<script src="jscrewit/jscrewit.js"></script>
```

or require it in Node.js:

```js
var JScrewIt = require("../jscrewit.js");
```

#### Reference

##### JScrewIt.areFeaturesAvailable(*features*)

Returns `true` if all of the specified features are available in the current engine; otherwise, `false`.

###### Parameters

***features*** (required): a string or array of strings specifying the feature(s) to be tested.

###### Examples

```js
JScrewIt.areFeaturesAvailable("NO_IE_SRC")
```

```js
JScrewIt.areFeaturesAvailable(["ATOB", "GMT", "NAME"])
```

###### Notes

If *features* is an empty array, the return value is `true`.

This function throws a `ReferenceError` if some unknown features are specified.

##### JScrewIt.areFeaturesCompatible(*features*)

Returns `true` if the specified features are compatible with each other.

###### Parameters

***features*** (required): a string or array of strings specifying the feature(s) to be tested.

###### Examples

```js
JScrewIt.areFeaturesCompatible(["V8_SRC", "IE_SRC"]) // returns false
```

```js
JScrewIt.areFeaturesCompatible(["DEFAULT", "FILL"]) // returns true
```

###### Notes

If *features* is an empty array, or if it only specifies one feature, the return value is `true`.

This function throws a `ReferenceError` if some unknown features are specified.

##### JScrewIt.encode(*input*, *wrapWithEval*, *features*)

Encodes a given string into JSFuck. Returns the encoded string.

###### Parameters

***input*** (required): the string to encode.

***wrapWithEval*** (optional): if this parameter is truthy, the return value evaluates to a function that runs the specified string as JavaScript code.
If this parameter is falsy, the return value evaluates to a string equivalent to the specified input.
The default is `false`.

***features*** (optional): a string or array of strings specifying the feature(s) available on the engine that evaluates the return value.
The default is `DEFAULT`: this generates the largest code and ensures compatibility with all supported engines.
To generate shorter code, specify some features.

###### Notes

This function throws a `ReferenceError` if some unknown features are specified.

##### JScrewIt.FEATURE_INFOS

This is a container mapping feature names to descriptors.
A feature descriptor is an object with a set of properties defining the feature.

###### Feature descriptor properties

***name***: Name of the feature.

***description***: A short description of the feature in plain English.

***available***: `true` if the specified feature is available on the current engine; otherwise, `false`.

***includes***: An array of feature names implied by this feature.
If a feature is available, its `includes` are, too.

***excludes***: An array of feature names not compatible with this feature.
If a feature is available, its `excludes` are not.

### Links

* [JSFuck](http://www.jsfuck.com) <br>
* Original discussion at [Sla.ckers.org](http://sla.ckers.org/forum/read.php?24,32930)
