# JScrewIt

[![NPM](https://nodei.co/npm/jscrewit.png?compact=true)](https://nodei.co/npm/jscrewit/)

JScrewIt converts plain JavaScript into JSFuck code, which uses only six different characters to
write and run any code: `!` `(` `)` `+` `[` `]`

Play with it now at [**jscrew.it**](http://jscrew.it), or give a look at
[jQuery *Screwed*](https://github.com/fasttime/jquery-screwed) for a real example: a working version
of jQuery consisting of only six different characters.

JScrewIt is a fork of [JSFuck](https://github.com/aemkei/jsfuck) that adds substantial enhancements
to the original implementation.
* Options to optimize code for a particular set of JavaScript engines or even just for your browser:
  the more specific your engine choice, the shorter the code you'll get.
* Support for all modern JavaScript engines.
* Neat large file encoding.

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

## Setup Instructions

### In the Browser

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

### In Node.js

If you are using Node.js, you can install JScrewIt with [npm](https://www.npmjs.org).

```
npm install jscrewit
```

Then you can include it in your code.

```js
var JScrewIt = require("jscrewit");
```

## Usage

### Basics

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

### Features

JScrewIt is able to generate JSFuck code that is customized for a particular set of JavaScript
engines (web browsers or Node.js).
This optimized code is shorter than generic JSFuck code but does not work everywhere.
To make use of this optimization, you have to specify which *features* the decoder engine is
expected to support.

In order to understand how this works, let's consider the JavaScript functions `atob` and `btoa`.
Not all browsers support these functions: without any further information, JScrewIt will assume that
they are unavailable and will not use them to encode the input.
Anyway, if we know in advance that the browsers we plan to target do support `atob` and `btoa`
indeed, we can let JScrewIt create code that uses those functions whenever that makes the output
shorter.

The way to tell JScrewIt to use a particular set of features is by specifying a value for the
`features` option in the second parameter passed to `encode`.

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

Here we have used a particular feature: [`FF31`](Features.md#FF31).
This feature produces the shortest possible code that runs in current Firefox browsers.

We can specify more than one feature using an array, e.g.

```js
var input = "document.body.style.background='red'";
var options = { features: ["ATOB", "WINDOW"], wrapWith: "call" };
var output = JScrewIt.encode(input, options);
```

As opposed to the previous example, the features specified here refer to certain abilities that may
be supported by more than one particular class of browsers or JavaScript engines.
Specifically, [`ATOB`](Features.md#ATOB) indicates native support for the functions `atob` and
`btoa`, while [`WINDOW`](Features.md#WINDOW) refers to a particular string representation of the
global object `self`, where available.
The code generated by JScrewIt will run fine in engines that support both of these features.
In engines that don't support both features, the code may not work, and may produce unpredictable
results.
Most typically, it will throw some kind of error at runtime.

It's important to keep in mind that each of the target engines needs to support every feature we
specify.
So if we want our JSFuck code to run on both Internet Explorer and Firefox, this won't work.

```js
{ features: ["IE9", "FF31"] }
```

Instead, we have to specify features supported by both browsers.
These can be retrieved with [`JScrewIt.Feature.commonOf`](Reference.md#JScrewIt.Feature.commonOf).

```js
{ features: JScrewIt.Feature.commonOf("IE9", "FF31") }
```

The features turn out to be [`ANY_DOCUMENT`](Features.md#ANY_DOCUMENT),
[`NO_SAFARI_LF`](Features.md#NO_SAFARI_LF), [`UNDEFINED`](Features.md#UNDEFINED) and
[`WINDOW`](Features.md#WINDOW) (a quick way to see this is entering
`JScrewIt.Feature.commonOf("IE9", "FF31").toString()` in the browser's JavaScript console).
With this knowledge, we can rewrite the expression as follows.

```js
{ features: ["ANY_DOCUMENT", "NO_SAFARI_LF", "UNDEFINED", "WINDOW"] }
```

### Further Reading

* [API Reference](Reference.md)
* [Feature Reference](Features.md)

## Compatibility

JScrewIt itself and the code it generates are compatible with the JavaScript engines listed below.

- Chrome 41+
- Internet Explorer 9+
- Firefox 31+
- Safari 7.0+
- Opera 28+
- Microsoft Edge
- Android Browser 4.x
- Node.js 0.10.26+

## Links

* [JScrewIt](http://jscrew.it) online encoder
* JSFuck introduction and alternatives on [Esolang](http://esolangs.org/wiki/JSFuck)
