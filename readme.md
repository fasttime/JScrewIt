# JScrewIt · [![npm version][npm badge]][npm url]

Use **JScrewIt** to convert your JavaScript code into
[JSFuck](https://en.wikipedia.org/wiki/JSFuck).
JSFuck is an encoding technique that uses only the six characters `!` `(` `)` `+` `[` `]` to produce
syntactically correct JavaScript that can still run in a browser or another JavaScript engine
without any additional software.

Play now with [**jscrew.it**](https://jscrew.it), or give a look at
[jQuery *Screwed*](https://github.com/fasttime/jquery-screwed) for a true example: a working version
of jQuery consisting of only six different characters.

JScrewIt was born as a fork of [aemkei's JSFuck](https://github.com/aemkei/jsfuck) and has
developed into one of the most powerful JSFuck encoders on the web, including a number of unique
features.
* Options to optimize code for a particular set of JavaScript engines or even just for your browser:
  the more specific your engine choice, the shorter the code you'll get.
* Support for all modern JavaScript engines (and a few older ones, too).
* Neatly optimized large file encoding.
* Encode-as-you-type browser interface.

### Example

The following source will do an `alert(1)` in any browser, including Internet Explorer:

```
[][(![]+[])[+[]]+([![]]+[][[]])[+!![]+[+[]]]+(![]+[])[!![]+!![]]+(!![]+[])[+[]]+
(!![]+[])[!![]+!![]+!![]]+(!![]+[])[+!![]]][(+(+!![]+[+([][(![]+[])[+[]]+([![]]+
[][[]])[+!![]+[+[]]]+(![]+[])[!![]+!![]]+(!![]+[])[+[]]+(!![]+[])[!![]+!![]+!![]
]+(!![]+[])[+!![]]]+[])[+[]]])+[!![]]+[][(![]+[])[+[]]+([![]]+[][[]])[+!![]+[+[]
]]+(![]+[])[!![]+!![]]+(!![]+[])[+[]]+(!![]+[])[!![]+!![]+!![]]+(!![]+[])[+!![]]
])[+!![]+[+[]]]+(!!++([][(![]+[])[+[]]+([![]]+[][[]])[+!![]+[+[]]]+(![]+[])[!![]
+!![]]+(!![]+[])[+[]]+(!![]+[])[!![]+!![]+!![]]+(!![]+[])[+!![]]]+[])[+[]]+[][(!
[]+[])[+[]]+([![]]+[][[]])[+!![]+[+[]]]+(![]+[])[!![]+!![]]+(!![]+[])[+[]]+(!![]
+[])[!![]+!![]+!![]]+(!![]+[])[+!![]]])[+!![]+[+!![]]]+([][[]]+[])[+!![]]+(![]+[
])[!![]+!![]+!![]]+(!![]+[])[+[]]+(!![]+[])[+!![]]+([][[]]+[])[+[]]+(+(+!![]+[+(
[][(![]+[])[+[]]+([![]]+[][[]])[+!![]+[+[]]]+(![]+[])[!![]+!![]]+(!![]+[])[+[]]+
(!![]+[])[!![]+!![]+!![]]+(!![]+[])[+!![]]]+[])[+[]]])+[!![]]+[][(![]+[])[+[]]+(
[![]]+[][[]])[+!![]+[+[]]]+(![]+[])[!![]+!![]]+(!![]+[])[+[]]+(!![]+[])[!![]+!![
]+!![]]+(!![]+[])[+!![]]])[+!![]+[+[]]]+(!![]+[])[+[]]+(!!++([][(![]+[])[+[]]+([
![]]+[][[]])[+!![]+[+[]]]+(![]+[])[!![]+!![]]+(!![]+[])[+[]]+(!![]+[])[!![]+!![]
+!![]]+(!![]+[])[+!![]]]+[])[+[]]+[][(![]+[])[+[]]+([![]]+[][[]])[+!![]+[+[]]]+(
![]+[])[!![]+!![]]+(!![]+[])[+[]]+(!![]+[])[!![]+!![]+!![]]+(!![]+[])[+!![]]])[+
!![]+[+!![]]]+(!![]+[])[+!![]]]((!![]+[])[+!![]]+(!![]+[])[!![]+!![]+!![]]+(!![]
+[])[+[]]+([][[]]+[])[+[]]+(!![]+[])[+!![]]+([][[]]+[])[+!![]]+(+(+!![]+[+([][(!
[]+[])[+[]]+([![]]+[][[]])[+!![]+[+[]]]+(![]+[])[!![]+!![]]+(!![]+[])[+[]]+(!![]
+[])[!![]+!![]+!![]]+(!![]+[])[+!![]]]+[])[+[]]])+[][(![]+[])[+[]]+([![]]+[][[]]
)[+!![]+[+[]]]+(![]+[])[!![]+!![]]+(!![]+[])[+[]]+(!![]+[])[!![]+!![]+!![]]+(!![
]+[])[+!![]]])[+!![]+[+!![]]]+(![]+[])[+!![]]+(![]+[])[!![]+!![]]+(!![]+[])[!![]
+!![]+!![]]+(!![]+[])[+!![]]+(!![]+[])[+[]])()(+!![])
```

## Setup Instructions

### In the Browser

To use JScrewIt in your project, download
[jscrewit.js](https://raw.githubusercontent.com/fasttime/JScrewIt/master/lib/jscrewit.js) or
[jscrewit.min.js](https://raw.githubusercontent.com/fasttime/JScrewIt/master/lib/jscrewit.min.js)
from GitHub and include it in your HTML file.

```html
<script src="jscrewit.js"></script>
```

Alternatively, you can hotlink the latest version using a CDN of your choice.

```html
<script src="https://cdn.statically.io/gh/fasttime/JScrewIt/master/lib/jscrewit.min.js"></script>
```

### In Node.js

If you are using Node.js, you can install JScrewIt with [npm](https://www.npmjs.org).

```console
npm install jscrewit
```

Then you can import it in your code in the usual way.

```js
const JScrewIt = require("jscrewit"); // CommonJS syntax
```
or
```js
import JScrewIt from "jscrewit"; // ECMAScript module syntax
```

JScrewIt comes with bundled TypeScript declarations: you can use it in TypeScript without installing
any additional packages.

## Usage

### Basics

This will encode the `alert(1)` example shown above and run it using `eval`.

```js
const output = JScrewIt.encode("alert(1)");
eval(output);
```

To encode just a plain string rather than an executable script, enclose the text in double or simple
quotes, like when introducing a string literal in JavaScript code.

```js
const output = JScrewIt.encode("'Hello, world!'");
const input = eval(output); // input contains the string "Hello, world!".
```

We can also use escape sequences to encode newlines and other characters.
Note that the initial backslash in an escape sequence must be escaped with another backslash when
writing a "sting in a string".


```js
const output = JScrewIt.encode("\"1.\\n2.\\n\\u263A\"");
/*
1.
2.
☺
*/
```

`JScrewIt.encode` also accepts an optional second parameter containing options that control various
aspects of the encoding.
These are covered in detail in the
[relative section](api-doc/interfaces/_jscrewit_.encodeoptions.md) in the API Reference.

### Features

One peculiarity of JScrewIt is the ability to generate JSFuck code that is customized for a
particular set of JavaScript engines (web browsers or Node.js).
This optimized code is shorter than generic JSFuck code but does not work everywhere.
To make use of this optimization, we have to specify which *features* the decoder engine is expected
to support.

In order to understand how this works, let's consider the JavaScript functions `atob` and `btoa`.
Not all browsers support these functions: without any further information, JScrewIt will assume that
they are unavailable and will not use them to encode the input.
Anyway, if we know in advance that the browsers we plan to target do support `atob` and `btoa`
indeed, we can let JScrewIt create code that uses those functions whenever that makes the output
shorter.

The way to tell JScrewIt to use a particular set of features is by specifying a value for the
`features` option in the second parameter passed to `encode`.

For instance, a generic `alert(1)` example for an unspecified environment is 1905 chracters long.

```js
const output = JScrewIt.encode("alert(1)"); // output is 1905 characters
```

We can save a few characters by indicating that our code is only supposed to run in a browser.
We do this using the feature [`BROWSER`](api-doc/interfaces/_jscrewit_.featureall.md#BROWSER):

```js
const options = { features: "BROWSER" };
const output = JScrewIt.encode("alert(1)", options); // 1890 characters
```

But if we are only interested in code that runs in an up to date Firefox browser, the output length
shrinks to less than 50%:
```js
const options = { features: "FF" };
const output = JScrewIt.encode("alert(1)", options); // 858 characters now
```

Here we have used another feature: [`FF`](api-doc/interfaces/_jscrewit_.featureall.md#FF).
This feature produces the shortest possible code that runs in current Firefox browsers.

We can specify more than one feature using an array, e.g.
```js
const input = "document.body.style.background='red'";
const options = { features: ["ATOB", "WINDOW"] };
const output = JScrewIt.encode(input, options);
```

As opposed to the previous example, the features specified here refer to certain abilities that may
be supported by more than one particular class of browsers or JavaScript engines.
Specifically, [`ATOB`](api-doc/interfaces/_jscrewit_.featureall.md#ATOB) indicates native support
for the functions `atob` and `btoa`, while
[`WINDOW`](api-doc/interfaces/_jscrewit_.featureall.md#WINDOW) refers to a particular string
representation of the global object `self`, where available.
The code generated by JScrewIt will run fine in engines that support both of these features.
In engines that don't support both features, the code may not work, and may produce unpredictable
results.
Most typically, it will throw some kind of error at runtime.

It's important to keep in mind that each of the target engines needs to support every feature we
specify.
So if we want our JSFuck code to run in Android Browser 4.4, Safari 7.0 and Node.js 10+, we can only
specify features supported by all of these engines.
These features can be retrieved with
[`JScrewIt.Feature.commonOf`](api-doc/interfaces/_jscrewit_.featureconstructor.md#commonof).

```js
{ features: JScrewIt.Feature.commonOf("ANDRO_4_4", "NODE_10", "SAFARI_7_0") }
```

The features turn out to be
[`ESC_HTML_QUOT`](api-doc/interfaces/_jscrewit_.featureall.md#ESC_HTML_QUOT),
[`GMT`](api-doc/interfaces/_jscrewit_.featureall.md#GMT),
[`INCR_CHAR`](api-doc/interfaces/_jscrewit_.featureall.md#INCR_CHAR),
[`NAME`](api-doc/interfaces/_jscrewit_.featureall.md#NAME),
[`NO_IE_SRC`](api-doc/interfaces/_jscrewit_.featureall.md#NO_IE_SRC) and
[`OBJECT_UNDEFINED`](api-doc/interfaces/_jscrewit_.featureall.md#OBJECT_UNDEFINED) (a quick way to
see this is entering `JScrewIt.Feature.commonOf("ANDRO_4_4", "NODE_10", "SAFARI_7_0").toString()` in
the browser's console).
With this knowledge, we could also rewrite the expression above as follows.

```js
{ features: ["ESC_HTML_QUOT", "GMT", "INCR_CHAR", "NAME", "NO_IE_SRC", "OBJECT_UNDEFINED"] }
```

Finally, note that simply specifying an array of engine features will not achieve the desired
effect, as it will result in the union of the features available in every engine rather than in
their intersection.

```diff
- { features: ["ANDRO_4_4", "NODE_10", "SAFARI_7_0"] }
```

### Further Reading

* [API Reference](api-doc/modules/_jscrewit_.md)
* [Feature Reference](Features.md)

## Compatibility

JScrewIt itself and the code it generates are compatible with the JavaScript engines listed below.

 ![Chrome](https://api.iconify.design/mdi:google-chrome.svg) Chrome 86+
<br>
 ![Safari](https://api.iconify.design/mdi:apple-safari.svg) Safari 7.0+
<br>
 ![Edge](https://api.iconify.design/mdi:microsoft-edge.svg) Edge 86+
<br>
 ![Firefox](https://api.iconify.design/mdi:firefox.svg) Firefox 78+
<br>
 ![Opera](https://api.iconify.design/mdi:opera.svg) Opera 72+
<br>
 ![Internet Explorer](https://api.iconify.design/mdi:microsoft-internet-explorer.svg) Internet
Explorer 9+
<br>
 ![Android Browser](https://api.iconify.design/mdi:android.svg) Android Browser 4.x
<br>
 ![Node.js](https://api.iconify.design/mdi:nodejs.svg) Node.js (all versions)

### Engine Support Policy

Only the most recent stable version of Chrome, Edge, Firefox and Opera are guaranteed to be
supported at any time, as detailed below.
- Chrome: (Current - 1) and Current
- Edge: (Current - 1) and Current
- Firefox: (Current - 1) and Current, ESR
- Opera: Current

Expect compatibility with these browsers to change in future releases of JScrewIt, while the current
browser versions become replaced by newer ones.

Compatibility with older versions of Internet Explorer, Safari, Android Browser and Node.js is
stable and not expected to change until the next major release of JScrewIt.

## Interesting Links

* [JScrewIt](https://jscrew.it) online encoder
* [JSFuck](https://en.wikipedia.org/wiki/JSFuck) on Wikipedia
* [JSFuck](https://esolangs.org/wiki/JSFuck) on Esolang
* [jsfuck.com](http://www.jsfuck.com)
* [jQuery *Screwed*](https://github.com/fasttime/jquery-screwed)

[npm badge]: https://badge.fury.io/js/jscrewit.svg
[npm url]: https://www.npmjs.com/package/jscrewit
