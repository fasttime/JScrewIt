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
These can be retrieved with [`JScrewIt.Feature.commonOf`](Reference.md#JScrewIt.Feature.commonOf).

```js
{ features: JScrewIt.Features.commonOf("IE9", "FF31") }
```

The features turn out to be `"NO_SAFARI_LF"`, `"UNDEFINED"` and `"WINDOW"`; `"ANY_WINDOW"` and
`"SELF_OBJ"` are both implied by `"WINDOW"`, so there is no need to specify them explicitly.
With this knowledge, the definition can be also written as below.

```js
{ features: ["NO_SAFARI_LF", "UNDEFINED", "WINDOW"] }
```

### Further Reading

* *[API Reference](Reference.md)*
* *[Feature Reference](Features.md)*

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
