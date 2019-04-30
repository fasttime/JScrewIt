[JScrewIt](../README.md) > ["feature.d"](../modules/_feature_d_.md) > [FeatureConstructor](../interfaces/_feature_d_.featureconstructor.md)

# Interface: FeatureConstructor

## Hierarchy

 [FeatureAll](_feature_all_d_.featureall.md)

**↳ FeatureConstructor**

## Callable
▸ **__call**(...features: *(`string` \| [Feature](_feature_d_.feature.md) \| (`string` \| [Feature](_feature_d_.feature.md))[])[]*): [Feature](_feature_d_.feature.md)

*Defined in feature.d.ts:170*

Creates a new feature object from the union of the specified features.

The constructor can be used with or without the `new` operator, e.g. `new JScrewIt.Feature(feature1, feature2)` or `JScrewIt.Feature(feature1, feature2)`. If no arguments are specified, the new feature object will be equivalent to [`DEFAULT`](_feature_d_.featureall.md#DEFAULT).

*__example__*: The following statements are equivalent, and will all construct a new feature object including both [`ANY_DOCUMENT`](_feature_d_.featureall.md#ANY_DOCUMENT) and [`ANY_WINDOW`](_feature_d_.featureall.md#ANY_WINDOW).

```js
new JScrewIt.Feature("ANY_DOCUMENT", "ANY_WINDOW");
```

```js
new JScrewIt.Feature(JScrewIt.Feature.ANY_DOCUMENT, JScrewIt.Feature.ANY_WINDOW);
```

```js
new JScrewIt.Feature([JScrewIt.Feature.ANY_DOCUMENT, JScrewIt.Feature.ANY_WINDOW]);
```

*__remarks__*: An error is thrown if any of the specified arguments is neither a feature object nor a name or alias of a predefined feature, or if the specified features are not mutually compatible.

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` features | (`string` \| [Feature](_feature_d_.feature.md) \| (`string` \| [Feature](_feature_d_.feature.md))[])[] |

**Returns:** [Feature](_feature_d_.feature.md)

## Index

### Constructors

* [constructor](_feature_d_.featureconstructor.md#constructor)

### Properties

* [ALL](_feature_d_.featureconstructor.md#all)
* [ANDRO_4_0](_feature_d_.featureconstructor.md#andro_4_0)
* [ANDRO_4_1](_feature_d_.featureconstructor.md#andro_4_1)
* [ANDRO_4_4](_feature_d_.featureconstructor.md#andro_4_4)
* [ANY_DOCUMENT](_feature_d_.featureconstructor.md#any_document)
* [ANY_WINDOW](_feature_d_.featureconstructor.md#any_window)
* [ARRAY_ITERATOR](_feature_d_.featureconstructor.md#array_iterator)
* [ARROW](_feature_d_.featureconstructor.md#arrow)
* [ATOB](_feature_d_.featureconstructor.md#atob)
* [AUTO](_feature_d_.featureconstructor.md#auto)
* [BARPROP](_feature_d_.featureconstructor.md#barprop)
* [BROWSER](_feature_d_.featureconstructor.md#browser)
* [CAPITAL_HTML](_feature_d_.featureconstructor.md#capital_html)
* [CHROME](_feature_d_.featureconstructor.md#chrome)
* [CHROME_73](_feature_d_.featureconstructor.md#chrome_73)
* [CHROME_PREV](_feature_d_.featureconstructor.md#chrome_prev)
* [COMPACT](_feature_d_.featureconstructor.md#compact)
* [CONSOLE](_feature_d_.featureconstructor.md#console)
* [DEFAULT](_feature_d_.featureconstructor.md#default)
* [DOCUMENT](_feature_d_.featureconstructor.md#document)
* [DOMWINDOW](_feature_d_.featureconstructor.md#domwindow)
* [EDGE](_feature_d_.featureconstructor.md#edge)
* [EDGE_40](_feature_d_.featureconstructor.md#edge_40)
* [EDGE_PREV](_feature_d_.featureconstructor.md#edge_prev)
* [ELEMENTARY](_feature_d_.featureconstructor.md#elementary)
* [ESC_HTML_ALL](_feature_d_.featureconstructor.md#esc_html_all)
* [ESC_HTML_QUOT](_feature_d_.featureconstructor.md#esc_html_quot)
* [ESC_HTML_QUOT_ONLY](_feature_d_.featureconstructor.md#esc_html_quot_only)
* [ESC_REGEXP_LF](_feature_d_.featureconstructor.md#esc_regexp_lf)
* [ESC_REGEXP_SLASH](_feature_d_.featureconstructor.md#esc_regexp_slash)
* [EXTERNAL](_feature_d_.featureconstructor.md#external)
* [FF](_feature_d_.featureconstructor.md#ff)
* [FF_54](_feature_d_.featureconstructor.md#ff_54)
* [FF_62](_feature_d_.featureconstructor.md#ff_62)
* [FF_ESR](_feature_d_.featureconstructor.md#ff_esr)
* [FF_SRC](_feature_d_.featureconstructor.md#ff_src)
* [FILL](_feature_d_.featureconstructor.md#fill)
* [FLAT](_feature_d_.featureconstructor.md#flat)
* [FROM_CODE_POINT](_feature_d_.featureconstructor.md#from_code_point)
* [FUNCTION_19_LF](_feature_d_.featureconstructor.md#function_19_lf)
* [FUNCTION_22_LF](_feature_d_.featureconstructor.md#function_22_lf)
* [GMT](_feature_d_.featureconstructor.md#gmt)
* [HISTORY](_feature_d_.featureconstructor.md#history)
* [HTMLAUDIOELEMENT](_feature_d_.featureconstructor.md#htmlaudioelement)
* [HTMLDOCUMENT](_feature_d_.featureconstructor.md#htmldocument)
* [IE_10](_feature_d_.featureconstructor.md#ie_10)
* [IE_11](_feature_d_.featureconstructor.md#ie_11)
* [IE_11_WIN_10](_feature_d_.featureconstructor.md#ie_11_win_10)
* [IE_9](_feature_d_.featureconstructor.md#ie_9)
* [IE_SRC](_feature_d_.featureconstructor.md#ie_src)
* [INCR_CHAR](_feature_d_.featureconstructor.md#incr_char)
* [INTL](_feature_d_.featureconstructor.md#intl)
* [LOCALE_INFINITY](_feature_d_.featureconstructor.md#locale_infinity)
* [NAME](_feature_d_.featureconstructor.md#name)
* [NODECONSTRUCTOR](_feature_d_.featureconstructor.md#nodeconstructor)
* [NODE_0_10](_feature_d_.featureconstructor.md#node_0_10)
* [NODE_0_12](_feature_d_.featureconstructor.md#node_0_12)
* [NODE_10](_feature_d_.featureconstructor.md#node_10)
* [NODE_11](_feature_d_.featureconstructor.md#node_11)
* [NODE_12](_feature_d_.featureconstructor.md#node_12)
* [NODE_4](_feature_d_.featureconstructor.md#node_4)
* [NODE_5](_feature_d_.featureconstructor.md#node_5)
* [NO_FF_SRC](_feature_d_.featureconstructor.md#no_ff_src)
* [NO_IE_SRC](_feature_d_.featureconstructor.md#no_ie_src)
* [NO_OLD_SAFARI_ARRAY_ITERATOR](_feature_d_.featureconstructor.md#no_old_safari_array_iterator)
* [NO_V8_SRC](_feature_d_.featureconstructor.md#no_v8_src)
* [SAFARI](_feature_d_.featureconstructor.md#safari)
* [SAFARI_10](_feature_d_.featureconstructor.md#safari_10)
* [SAFARI_12](_feature_d_.featureconstructor.md#safari_12)
* [SAFARI_7_0](_feature_d_.featureconstructor.md#safari_7_0)
* [SAFARI_7_1](_feature_d_.featureconstructor.md#safari_7_1)
* [SAFARI_8](_feature_d_.featureconstructor.md#safari_8)
* [SAFARI_9](_feature_d_.featureconstructor.md#safari_9)
* [SELF](_feature_d_.featureconstructor.md#self)
* [SELF_OBJ](_feature_d_.featureconstructor.md#self_obj)
* [STATUS](_feature_d_.featureconstructor.md#status)
* [UNDEFINED](_feature_d_.featureconstructor.md#undefined)
* [UNEVAL](_feature_d_.featureconstructor.md#uneval)
* [V8_SRC](_feature_d_.featureconstructor.md#v8_src)
* [WINDOW](_feature_d_.featureconstructor.md#window)

### Methods

* [areCompatible](_feature_d_.featureconstructor.md#arecompatible)
* [areEqual](_feature_d_.featureconstructor.md#areequal)
* [commonOf](_feature_d_.featureconstructor.md#commonof)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new FeatureConstructor**(...features: *(`string` \| [Feature](_feature_d_.feature.md) \| (`string` \| [Feature](_feature_d_.feature.md))[])[]*): [Feature](_feature_d_.feature.md)

*Defined in feature.d.ts:137*

Creates a new feature object from the union of the specified features.

The constructor can be used with or without the `new` operator, e.g. `new JScrewIt.Feature(feature1, feature2)` or `JScrewIt.Feature(feature1, feature2)`. If no arguments are specified, the new feature object will be equivalent to [`DEFAULT`](_feature_d_.featureall.md#DEFAULT).

*__example__*: The following statements are equivalent, and will all construct a new feature object including both [`ANY_DOCUMENT`](_feature_d_.featureall.md#ANY_DOCUMENT) and [`ANY_WINDOW`](_feature_d_.featureall.md#ANY_WINDOW).

```js
JScrewIt.Feature("ANY_DOCUMENT", "ANY_WINDOW");
```

```js
JScrewIt.Feature(JScrewIt.Feature.ANY_DOCUMENT, JScrewIt.Feature.ANY_WINDOW);
```

```js
JScrewIt.Feature([JScrewIt.Feature.ANY_DOCUMENT, JScrewIt.Feature.ANY_WINDOW]);
```

*__remarks__*: An error is thrown if any of the specified arguments is neither a feature object nor a name or alias of a predefined feature, or if the specified features are not mutually compatible.

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` features | (`string` \| [Feature](_feature_d_.feature.md) \| (`string` \| [Feature](_feature_d_.feature.md))[])[] |

**Returns:** [Feature](_feature_d_.feature.md)

___

## Properties

<a id="all"></a>

###  ALL

**● ALL**: *[FeatureAll](_feature_all_d_.featureall.md)*

*Defined in feature.d.ts:134*

An immutable mapping of all predefined feature objects accessed by name or alias.

For an exhaustive list of all features, see the [Feature Reference](_feature_d_.featureall.md).

*__example__*: This will produce an array with the names and aliases of all predefined features.

```js
Object.keys(JScrewIt.Feature.ALL)
```

This will determine if a particular feature object is predefined or not.

```js
featureObj === JScrewIt.Feature.ALL[featureObj.name]
```

___
<a id="andro_4_0"></a>

###  ANDRO_4_0

**● ANDRO_4_0**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[ANDRO_4_0](_feature_all_d_.featureall.md#andro_4_0)*

*Defined in feature-all.d.ts:8*

Features available in Android Browser 4.0.

___
<a id="andro_4_1"></a>

###  ANDRO_4_1

**● ANDRO_4_1**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[ANDRO_4_1](_feature_all_d_.featureall.md#andro_4_1)*

*Defined in feature-all.d.ts:13*

Features available in Android Browser 4.1 to 4.3.

___
<a id="andro_4_4"></a>

###  ANDRO_4_4

**● ANDRO_4_4**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[ANDRO_4_4](_feature_all_d_.featureall.md#andro_4_4)*

*Defined in feature-all.d.ts:18*

Features available in Android Browser 4.4.

___
<a id="any_document"></a>

###  ANY_DOCUMENT

**● ANY_DOCUMENT**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[ANY_DOCUMENT](_feature_all_d_.featureall.md#any_document)*

*Defined in feature-all.d.ts:27*

Existence of the global object document whose string representation starts with "\[object " and ends with "Document\]".

*__reamarks__*: Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers.

___
<a id="any_window"></a>

###  ANY_WINDOW

**● ANY_WINDOW**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[ANY_WINDOW](_feature_all_d_.featureall.md#any_window)*

*Defined in feature-all.d.ts:36*

Existence of the global object self whose string representation starts with "\[object " and ends with "Window\]".

*__reamarks__*: Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers.

___
<a id="array_iterator"></a>

###  ARRAY_ITERATOR

**● ARRAY_ITERATOR**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[ARRAY_ITERATOR](_feature_all_d_.featureall.md#array_iterator)*

*Defined in feature-all.d.ts:45*

The property that the string representation of Array.prototype.entries() starts with "\[object Array" and ends with "\]" at index 21 or 22.

*__reamarks__*: Available in Chrome, Edge, Firefox, Safari 7.1+, Opera and Node.js 0.12+.

___
<a id="arrow"></a>

###  ARROW

**● ARROW**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[ARROW](_feature_all_d_.featureall.md#arrow)*

*Defined in feature-all.d.ts:54*

Support for arrow functions.

*__reamarks__*: Available in Chrome, Edge, Firefox, Safari 10+, Opera and Node.js 4+.

___
<a id="atob"></a>

###  ATOB

**● ATOB**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[ATOB](_feature_all_d_.featureall.md#atob)*

*Defined in feature-all.d.ts:63*

Existence of the global functions atob and btoa.

*__reamarks__*: Available in Chrome, Edge, Firefox, Internet Explorer 10+, Safari, Opera and Android Browser. This feature is not available inside web workers in Safari before 10.

___
<a id="auto"></a>

###  AUTO

**● AUTO**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[AUTO](_feature_all_d_.featureall.md#auto)*

*Defined in feature-all.d.ts:68*

All features available in the current engine.

___
<a id="barprop"></a>

###  BARPROP

**● BARPROP**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[BARPROP](_feature_all_d_.featureall.md#barprop)*

*Defined in feature-all.d.ts:77*

Existence of the global object statusbar having the string representation "\[object BarProp\]".

*__reamarks__*: Available in Chrome, Edge, Firefox, Safari, Opera and Android Browser 4.4. This feature is not available inside web workers.

___
<a id="browser"></a>

###  BROWSER

**● BROWSER**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[BROWSER](_feature_all_d_.featureall.md#browser)*

*Defined in feature-all.d.ts:84*

Features available in all browsers.

No support for Node.js.

___
<a id="capital_html"></a>

###  CAPITAL_HTML

**● CAPITAL_HTML**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[CAPITAL_HTML](_feature_all_d_.featureall.md#capital_html)*

*Defined in feature-all.d.ts:93*

The property that the various string methods returning HTML code such as String.prototype.big or String.prototype.link have both the tag name and attributes written in capital letters.

*__reamarks__*: Available in Internet Explorer.

___
<a id="chrome"></a>

###  CHROME

**● CHROME**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[CHROME](_feature_all_d_.featureall.md#chrome)*

*Defined in feature-all.d.ts:96*

An alias for `CHROME_73`.

___
<a id="chrome_73"></a>

###  CHROME_73

**● CHROME_73**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[CHROME_73](_feature_all_d_.featureall.md#chrome_73)*

*Defined in feature-all.d.ts:101*

Features available in Chrome 73 and Opera 60 or later.

___
<a id="chrome_prev"></a>

###  CHROME_PREV

**● CHROME_PREV**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[CHROME_PREV](_feature_all_d_.featureall.md#chrome_prev)*

*Defined in feature-all.d.ts:104*

An alias for `CHROME_73`.

___
<a id="compact"></a>

###  COMPACT

**● COMPACT**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[COMPACT](_feature_all_d_.featureall.md#compact)*

*Defined in feature-all.d.ts:111*

All new browsers' features.

No support for Node.js and older browsers like Internet Explorer, Safari 9 or Android Browser.

___
<a id="console"></a>

###  CONSOLE

**● CONSOLE**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[CONSOLE](_feature_all_d_.featureall.md#console)*

*Defined in feature-all.d.ts:122*

Existence of the global object console having the string representation "\[object Console\]".

This feature may become unavailable when certain browser extensions are active.

*__reamarks__*: Available in Firefox, Internet Explorer 10+, Safari and Android Browser. This feature is not available inside web workers in Safari before 7.1 and Android Browser 4.4.

___
<a id="default"></a>

###  DEFAULT

**● DEFAULT**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[DEFAULT](_feature_all_d_.featureall.md#default)*

*Defined in feature-all.d.ts:127*

Minimum feature level, compatible with all supported engines in all environments.

___
<a id="document"></a>

###  DOCUMENT

**● DOCUMENT**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[DOCUMENT](_feature_all_d_.featureall.md#document)*

*Defined in feature-all.d.ts:136*

Existence of the global object document having the string representation "\[object Document\]".

*__reamarks__*: Available in Internet Explorer before 11. This feature is not available inside web workers.

___
<a id="domwindow"></a>

###  DOMWINDOW

**● DOMWINDOW**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[DOMWINDOW](_feature_all_d_.featureall.md#domwindow)*

*Defined in feature-all.d.ts:145*

Existence of the global object self having the string representation "\[object DOMWindow\]".

*__reamarks__*: Available in Android Browser before 4.4. This feature is not available inside web workers.

___
<a id="edge"></a>

###  EDGE

**● EDGE**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[EDGE](_feature_all_d_.featureall.md#edge)*

*Defined in feature-all.d.ts:148*

An alias for `EDGE_40`.

___
<a id="edge_40"></a>

###  EDGE_40

**● EDGE_40**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[EDGE_40](_feature_all_d_.featureall.md#edge_40)*

*Defined in feature-all.d.ts:153*

Features available in Edge 40 or later.

___
<a id="edge_prev"></a>

###  EDGE_PREV

**● EDGE_PREV**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[EDGE_PREV](_feature_all_d_.featureall.md#edge_prev)*

*Defined in feature-all.d.ts:156*

An alias for `EDGE_40`.

___
<a id="elementary"></a>

###  ELEMENTARY

**● ELEMENTARY**: *[Feature](_feature_d_.feature.md)[]*

*Defined in feature.d.ts:137*

An immutable array of all elementary feature objects ordered by name.

___
<a id="esc_html_all"></a>

###  ESC_HTML_ALL

**● ESC_HTML_ALL**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[ESC_HTML_ALL](_feature_all_d_.featureall.md#esc_html_all)*

*Defined in feature-all.d.ts:165*

The property that double quotation mark, less than and greater than characters in the argument of String.prototype.fontcolor are escaped into their respective HTML entities.

*__reamarks__*: Available in Android Browser and Node.js before 0.12.

___
<a id="esc_html_quot"></a>

###  ESC_HTML_QUOT

**● ESC_HTML_QUOT**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[ESC_HTML_QUOT](_feature_all_d_.featureall.md#esc_html_quot)*

*Defined in feature-all.d.ts:174*

The property that double quotation marks in the argument of String.prototype.fontcolor are escaped as """.

*__reamarks__*: Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser and Node.js.

___
<a id="esc_html_quot_only"></a>

###  ESC_HTML_QUOT_ONLY

**● ESC_HTML_QUOT_ONLY**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[ESC_HTML_QUOT_ONLY](_feature_all_d_.featureall.md#esc_html_quot_only)*

*Defined in feature-all.d.ts:183*

The property that only double quotation marks and no other characters in the argument of String.prototype.fontcolor are escaped into HTML entities.

*__reamarks__*: Available in Chrome, Edge, Firefox, Safari, Opera and Node.js 0.12+.

___
<a id="esc_regexp_lf"></a>

###  ESC_REGEXP_LF

**● ESC_REGEXP_LF**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[ESC_REGEXP_LF](_feature_all_d_.featureall.md#esc_regexp_lf)*

*Defined in feature-all.d.ts:192*

Having regular expressions created with the RegExp constructor use escape sequences starting with a backslash to format line feed characters ("\\n") in their string representation.

*__reamarks__*: Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Node.js 12+.

___
<a id="esc_regexp_slash"></a>

###  ESC_REGEXP_SLASH

**● ESC_REGEXP_SLASH**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[ESC_REGEXP_SLASH](_feature_all_d_.featureall.md#esc_regexp_slash)*

*Defined in feature-all.d.ts:201*

Having regular expressions created with the RegExp constructor use escape sequences starting with a backslash to format slashes ("/") in their string representation.

*__reamarks__*: Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Node.js 4+.

___
<a id="external"></a>

###  EXTERNAL

**● EXTERNAL**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[EXTERNAL](_feature_all_d_.featureall.md#external)*

*Defined in feature-all.d.ts:210*

Existence of the global object sidebar having the string representation "\[object External\]".

*__reamarks__*: Available in Firefox. This feature is not available inside web workers.

___
<a id="ff"></a>

###  FF

**● FF**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[FF](_feature_all_d_.featureall.md#ff)*

*Defined in feature-all.d.ts:213*

An alias for `FF_62`.

___
<a id="ff_54"></a>

###  FF_54

**● FF_54**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[FF_54](_feature_all_d_.featureall.md#ff_54)*

*Defined in feature-all.d.ts:218*

Features available in Firefox 54 or later.

___
<a id="ff_62"></a>

###  FF_62

**● FF_62**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[FF_62](_feature_all_d_.featureall.md#ff_62)*

*Defined in feature-all.d.ts:223*

Features available in Firefox 62 or later.

___
<a id="ff_esr"></a>

###  FF_ESR

**● FF_ESR**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[FF_ESR](_feature_all_d_.featureall.md#ff_esr)*

*Defined in feature-all.d.ts:226*

An alias for `FF_54`.

___
<a id="ff_src"></a>

###  FF_SRC

**● FF_SRC**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[FF_SRC](_feature_all_d_.featureall.md#ff_src)*

*Defined in feature-all.d.ts:237*

A string representation of native functions typical for Firefox and Safari.

Remarkable traits are the lack of line feed characters at the beginning and at the end of the string and the presence of a line feed followed by four whitespaces ("\\n ") before the "\[native code\]" sequence.

*__reamarks__*: Available in Firefox and Safari.

___
<a id="fill"></a>

###  FILL

**● FILL**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[FILL](_feature_all_d_.featureall.md#fill)*

*Defined in feature-all.d.ts:246*

Existence of the native function Array.prototype.fill.

*__reamarks__*: Available in Chrome, Edge, Firefox, Safari 7.1+, Opera and Node.js 4+.

___
<a id="flat"></a>

###  FLAT

**● FLAT**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[FLAT](_feature_all_d_.featureall.md#flat)*

*Defined in feature-all.d.ts:255*

Existence of the native function Array.prototype.flat.

*__reamarks__*: Available in Chrome, Firefox 62+, Safari 12+, Opera and Node.js 11+.

___
<a id="from_code_point"></a>

###  FROM_CODE_POINT

**● FROM_CODE_POINT**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[FROM_CODE_POINT](_feature_all_d_.featureall.md#from_code_point)*

*Defined in feature-all.d.ts:264*

Existence of the function String.fromCodePoint.

*__reamarks__*: Available in Chrome, Edge, Firefox, Safari 9+, Opera and Node.js 4+.

___
<a id="function_19_lf"></a>

###  FUNCTION_19_LF

**● FUNCTION_19_LF**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[FUNCTION_19_LF](_feature_all_d_.featureall.md#function_19_lf)*

*Defined in feature-all.d.ts:273*

A string representation of dynamically generated functions where the character at index 19 is a line feed ("\\n").

*__reamarks__*: Available in Chrome, Edge, Firefox, Opera and Node.js 10+.

___
<a id="function_22_lf"></a>

###  FUNCTION_22_LF

**● FUNCTION_22_LF**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[FUNCTION_22_LF](_feature_all_d_.featureall.md#function_22_lf)*

*Defined in feature-all.d.ts:282*

A string representation of dynamically generated functions where the character at index 22 is a line feed ("\\n").

*__reamarks__*: Available in Internet Explorer, Safari 9+, Android Browser and Node.js before 10.

___
<a id="gmt"></a>

###  GMT

**● GMT**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[GMT](_feature_all_d_.featureall.md#gmt)*

*Defined in feature-all.d.ts:293*

Presence of the text "GMT" after the first 25 characters in the string returned by Date().

The string representation of dates is implementation dependent, but most engines use a similar format, making this feature available in all supported engines except Internet Explorer 9 and 10.

*__reamarks__*: Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari, Opera, Android Browser and Node.js.

___
<a id="history"></a>

###  HISTORY

**● HISTORY**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[HISTORY](_feature_all_d_.featureall.md#history)*

*Defined in feature-all.d.ts:302*

Existence of the global object history having the string representation "\[object History\]".

*__reamarks__*: Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers.

___
<a id="htmlaudioelement"></a>

###  HTMLAUDIOELEMENT

**● HTMLAUDIOELEMENT**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[HTMLAUDIOELEMENT](_feature_all_d_.featureall.md#htmlaudioelement)*

*Defined in feature-all.d.ts:311*

Existence of the global object Audio whose string representation starts with "function HTMLAudioElement".

*__reamarks__*: Available in Android Browser 4.4. This feature is not available inside web workers.

___
<a id="htmldocument"></a>

###  HTMLDOCUMENT

**● HTMLDOCUMENT**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[HTMLDOCUMENT](_feature_all_d_.featureall.md#htmldocument)*

*Defined in feature-all.d.ts:320*

Existence of the global object document having the string representation "\[object HTMLDocument\]".

*__reamarks__*: Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari, Opera and Android Browser. This feature is not available inside web workers.

___
<a id="ie_10"></a>

###  IE_10

**● IE_10**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[IE_10](_feature_all_d_.featureall.md#ie_10)*

*Defined in feature-all.d.ts:325*

Features available in Internet Explorer 10.

___
<a id="ie_11"></a>

###  IE_11

**● IE_11**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[IE_11](_feature_all_d_.featureall.md#ie_11)*

*Defined in feature-all.d.ts:330*

Features available in Internet Explorer 11.

___
<a id="ie_11_win_10"></a>

###  IE_11_WIN_10

**● IE_11_WIN_10**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[IE_11_WIN_10](_feature_all_d_.featureall.md#ie_11_win_10)*

*Defined in feature-all.d.ts:335*

Features available in Internet Explorer 11 on Windows 10.

___
<a id="ie_9"></a>

###  IE_9

**● IE_9**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[IE_9](_feature_all_d_.featureall.md#ie_9)*

*Defined in feature-all.d.ts:340*

Features available in Internet Explorer 9.

___
<a id="ie_src"></a>

###  IE_SRC

**● IE_SRC**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[IE_SRC](_feature_all_d_.featureall.md#ie_src)*

*Defined in feature-all.d.ts:351*

A string representation of native functions typical for Internet Explorer.

Remarkable traits are the presence of a line feed character ("\\n") at the beginning and at the end of the string and a line feed followed by four whitespaces ("\\n ") before the "\[native code\]" sequence.

*__reamarks__*: Available in Internet Explorer.

___
<a id="incr_char"></a>

###  INCR_CHAR

**● INCR_CHAR**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[INCR_CHAR](_feature_all_d_.featureall.md#incr_char)*

*Defined in feature-all.d.ts:360*

The ability to use unary increment operators with string characters, like in ( ++"some string"\[0\] ): this will result in a TypeError in strict mode in ECMAScript compliant engines.

*__reamarks__*: Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, Android Browser and Node.js. This feature is not available when strict mode is enforced in Chrome, Edge, Firefox, Internet Explorer 10+, Safari, Opera and Node.js 5+.

___
<a id="intl"></a>

###  INTL

**● INTL**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[INTL](_feature_all_d_.featureall.md#intl)*

*Defined in feature-all.d.ts:369*

Existence of the global object Intl.

*__reamarks__*: Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari 10+, Opera, Android Browser 4.4 and Node.js 0.12+.

___
<a id="locale_infinity"></a>

###  LOCALE_INFINITY

**● LOCALE_INFINITY**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[LOCALE_INFINITY](_feature_all_d_.featureall.md#locale_infinity)*

*Defined in feature-all.d.ts:378*

Language sensitive string representation of Infinity as "∞".

*__reamarks__*: Available in Chrome, Edge, Firefox, Internet Explorer 11 on Windows 10, Safari 10+, Opera, Android Browser 4.4 and Node.js 0.12+.

___
<a id="name"></a>

###  NAME

**● NAME**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[NAME](_feature_all_d_.featureall.md#name)*

*Defined in feature-all.d.ts:387*

Existence of the name property for functions.

*__reamarks__*: Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser and Node.js.

___
<a id="nodeconstructor"></a>

###  NODECONSTRUCTOR

**● NODECONSTRUCTOR**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[NODECONSTRUCTOR](_feature_all_d_.featureall.md#nodeconstructor)*

*Defined in feature-all.d.ts:396*

Existence of the global object Node having the string representation "\[object NodeConstructor\]".

*__reamarks__*: Available in Safari before 10. This feature is not available inside web workers.

___
<a id="node_0_10"></a>

###  NODE_0_10

**● NODE_0_10**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[NODE_0_10](_feature_all_d_.featureall.md#node_0_10)*

*Defined in feature-all.d.ts:401*

Features available in Node.js 0.10.

___
<a id="node_0_12"></a>

###  NODE_0_12

**● NODE_0_12**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[NODE_0_12](_feature_all_d_.featureall.md#node_0_12)*

*Defined in feature-all.d.ts:406*

Features available in Node.js 0.12.

___
<a id="node_10"></a>

###  NODE_10

**● NODE_10**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[NODE_10](_feature_all_d_.featureall.md#node_10)*

*Defined in feature-all.d.ts:411*

Features available in Node.js 10.

___
<a id="node_11"></a>

###  NODE_11

**● NODE_11**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[NODE_11](_feature_all_d_.featureall.md#node_11)*

*Defined in feature-all.d.ts:416*

Features available in Node.js 11.

___
<a id="node_12"></a>

###  NODE_12

**● NODE_12**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[NODE_12](_feature_all_d_.featureall.md#node_12)*

*Defined in feature-all.d.ts:421*

Features available in Node.js 12 or later.

___
<a id="node_4"></a>

###  NODE_4

**● NODE_4**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[NODE_4](_feature_all_d_.featureall.md#node_4)*

*Defined in feature-all.d.ts:426*

Features available in Node.js 4.

___
<a id="node_5"></a>

###  NODE_5

**● NODE_5**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[NODE_5](_feature_all_d_.featureall.md#node_5)*

*Defined in feature-all.d.ts:431*

Features available in Node.js 5 to 9.

___
<a id="no_ff_src"></a>

###  NO_FF_SRC

**● NO_FF_SRC**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[NO_FF_SRC](_feature_all_d_.featureall.md#no_ff_src)*

*Defined in feature-all.d.ts:440*

A string representation of native functions typical for V8 and Edge or for Internet Explorer but not for Firefox and Safari.

*__reamarks__*: Available in Chrome, Edge, Internet Explorer, Opera, Android Browser and Node.js.

___
<a id="no_ie_src"></a>

###  NO_IE_SRC

**● NO_IE_SRC**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[NO_IE_SRC](_feature_all_d_.featureall.md#no_ie_src)*

*Defined in feature-all.d.ts:451*

A string representation of native functions typical for most engines with the notable exception of Internet Explorer.

A remarkable trait of this feature is the lack of line feed characters at the beginning and at the end of the string.

*__reamarks__*: Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser and Node.js.

___
<a id="no_old_safari_array_iterator"></a>

###  NO_OLD_SAFARI_ARRAY_ITERATOR

**● NO_OLD_SAFARI_ARRAY_ITERATOR**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[NO_OLD_SAFARI_ARRAY_ITERATOR](_feature_all_d_.featureall.md#no_old_safari_array_iterator)*

*Defined in feature-all.d.ts:460*

The property that the string representation of Array.prototype.entries() evaluates to "\[object Array Iterator\]".

*__reamarks__*: Available in Chrome, Edge, Firefox, Safari 9+, Opera and Node.js 0.12+.

___
<a id="no_v8_src"></a>

###  NO_V8_SRC

**● NO_V8_SRC**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[NO_V8_SRC](_feature_all_d_.featureall.md#no_v8_src)*

*Defined in feature-all.d.ts:471*

A string representation of native functions typical for Firefox, Internet Explorer and Safari.

A most remarkable trait of this feature is the presence of a line feed followed by four whitespaces ("\\n ") before the "\[native code\]" sequence.

*__reamarks__*: Available in Firefox, Internet Explorer and Safari.

___
<a id="safari"></a>

###  SAFARI

**● SAFARI**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[SAFARI](_feature_all_d_.featureall.md#safari)*

*Defined in feature-all.d.ts:474*

An alias for `SAFARI_12`.

___
<a id="safari_10"></a>

###  SAFARI_10

**● SAFARI_10**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[SAFARI_10](_feature_all_d_.featureall.md#safari_10)*

*Defined in feature-all.d.ts:479*

Features available in Safari 10 or later.

___
<a id="safari_12"></a>

###  SAFARI_12

**● SAFARI_12**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[SAFARI_12](_feature_all_d_.featureall.md#safari_12)*

*Defined in feature-all.d.ts:484*

Features available in Safari 12 or later.

___
<a id="safari_7_0"></a>

###  SAFARI_7_0

**● SAFARI_7_0**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[SAFARI_7_0](_feature_all_d_.featureall.md#safari_7_0)*

*Defined in feature-all.d.ts:489*

Features available in Safari 7.0.

___
<a id="safari_7_1"></a>

###  SAFARI_7_1

**● SAFARI_7_1**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[SAFARI_7_1](_feature_all_d_.featureall.md#safari_7_1)*

*Defined in feature-all.d.ts:494*

Features available in Safari 7.1 and Safari 8.

___
<a id="safari_8"></a>

###  SAFARI_8

**● SAFARI_8**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[SAFARI_8](_feature_all_d_.featureall.md#safari_8)*

*Defined in feature-all.d.ts:497*

An alias for `SAFARI_7_1`.

___
<a id="safari_9"></a>

###  SAFARI_9

**● SAFARI_9**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[SAFARI_9](_feature_all_d_.featureall.md#safari_9)*

*Defined in feature-all.d.ts:502*

Features available in Safari 9.

___
<a id="self"></a>

###  SELF

**● SELF**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[SELF](_feature_all_d_.featureall.md#self)*

*Defined in feature-all.d.ts:505*

An alias for `ANY_WINDOW`.

___
<a id="self_obj"></a>

###  SELF_OBJ

**● SELF_OBJ**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[SELF_OBJ](_feature_all_d_.featureall.md#self_obj)*

*Defined in feature-all.d.ts:514*

Existence of the global object self whose string representation starts with "\[object ".

*__reamarks__*: Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers in Safari 7.1+ before 10.

___
<a id="status"></a>

###  STATUS

**● STATUS**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[STATUS](_feature_all_d_.featureall.md#status)*

*Defined in feature-all.d.ts:523*

Existence of the global string status.

*__reamarks__*: Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers.

___
<a id="undefined"></a>

###  UNDEFINED

**● UNDEFINED**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[UNDEFINED](_feature_all_d_.featureall.md#undefined)*

*Defined in feature-all.d.ts:534*

The property that Object.prototype.toString.call() evaluates to "\[object Undefined\]".

This behavior is specified by ECMAScript, and is enforced by all engines except Android Browser versions prior to 4.1.2, where this feature is not available.

*__reamarks__*: Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, Android Browser 4.1+ and Node.js.

___
<a id="uneval"></a>

###  UNEVAL

**● UNEVAL**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[UNEVAL](_feature_all_d_.featureall.md#uneval)*

*Defined in feature-all.d.ts:543*

Existence of the global function uneval.

*__reamarks__*: Available in Firefox.

___
<a id="v8_src"></a>

###  V8_SRC

**● V8_SRC**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[V8_SRC](_feature_all_d_.featureall.md#v8_src)*

*Defined in feature-all.d.ts:554*

A string representation of native functions typical for the V8 engine, but also found in Edge.

Remarkable traits are the lack of line feed characters at the beginning and at the end of the string and the presence of a single whitespace before the "\[native code\]" sequence.

*__reamarks__*: Available in Chrome, Edge, Opera, Android Browser and Node.js.

___
<a id="window"></a>

###  WINDOW

**● WINDOW**: *[Feature](_feature_d_.feature.md)*

*Inherited from [FeatureAll](_feature_all_d_.featureall.md).[WINDOW](_feature_all_d_.featureall.md#window)*

*Defined in feature-all.d.ts:563*

Existence of the global object self having the string representation "\[object Window\]".

*__reamarks__*: Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser 4.4. This feature is not available inside web workers.

___

## Methods

<a id="arecompatible"></a>

###  areCompatible

▸ **areCompatible**(features: *`Readonly`<[FeatureElement](../modules/_feature_d_.md#featureelement)[]>*): `boolean`

*Defined in feature.d.ts:225*

Determines whether the specified features are mutually compatible.

*__example__*: ```js
// false: only one of "V8_SRC" or "IE_SRC" may be available.
JScrewIt.Feature.areCompatible(["V8_SRC", "IE_SRC"])
```

```js
// true
JScrewIt.Feature.areCompatible([JScrewIt.Feature.DEFAULT, JScrewIt.Feature.FILL])
```

**Parameters:**

| Name | Type |
| ------ | ------ |
| features | `Readonly`<[FeatureElement](../modules/_feature_d_.md#featureelement)[]> |

**Returns:** `boolean`

`true` if the specified features are mutually compatible; otherwise, `false`.
If the array argument contains less than two features, the return value is `true`.

___
<a id="areequal"></a>

###  areEqual

▸ **areEqual**(...features: *(`string` \| [Feature](_feature_d_.feature.md) \| (`string` \| [Feature](_feature_d_.feature.md))[])[]*): `boolean`

*Defined in feature.d.ts:250*

Determines whether all of the specified features are equivalent.

Different features are considered equivalent if they include the same set of elementary features, regardless of any other difference.

*__example__*: ```js
// false
JScrewIt.Feature.areEqual(JScrewIt.Feature.CHROME, JScrewIt.Feature.FIREFOX)
```

```js
// true
JScrewIt.Feature.areEqual("DEFAULT", [])
```

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` features | (`string` \| [Feature](_feature_d_.feature.md) \| (`string` \| [Feature](_feature_d_.feature.md))[])[] |

**Returns:** `boolean`

`true` if all of the specified features are equivalent; otherwise, `false`.
If less than two arguments are specified, the return value is `true`.

___
<a id="commonof"></a>

###  commonOf

▸ **commonOf**(...features: *(`string` \| [Feature](_feature_d_.feature.md) \| (`string` \| [Feature](_feature_d_.feature.md))[])[]*): [Feature](_feature_d_.feature.md) \| `null`

*Defined in feature.d.ts:277*

Creates a new feature object equivalent to the intersection of the specified features.

*__example__*: This will create a new feature object equivalent to [`NAME`](_feature_d_.featureall.md#NAME).

```js
var newFeature = JScrewIt.Feature.commonOf(["ATOB", "NAME"], ["NAME", "SELF"]);
```

This will create a new feature object equivalent to [`ANY_DOCUMENT`](_feature_d_.featureall.md#ANY_DOCUMENT). This is because both [`HTMLDOCUMENT`](_feature_d_.featureall.md#HTMLDOCUMENT) and [`DOCUMENT`](_feature_d_.featureall.md#DOCUMENT) imply [`ANY_DOCUMENT`](_feature_d_.featureall.md#ANY_DOCUMENT).

```js
var newFeature = JScrewIt.Feature.commonOf("HTMLDOCUMENT", "DOCUMENT");
```

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` features | (`string` \| [Feature](_feature_d_.feature.md) \| (`string` \| [Feature](_feature_d_.feature.md))[])[] |

**Returns:** [Feature](_feature_d_.feature.md) \| `null`

A feature object, or `null` if no arguments are specified.

___

