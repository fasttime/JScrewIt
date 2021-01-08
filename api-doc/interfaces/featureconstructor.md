# Interface: FeatureConstructor

## Hierarchy

* [*FeatureAll*](featureall.md)

  ↳ **FeatureConstructor**

## Callable

▸ **FeatureConstructor**(...`features`: ([*Feature*](../README.md#feature) \| *ANDRO_4_0* \| *ANDRO_4_1* \| *ANDRO_4_4* \| *ANY_DOCUMENT* \| *ANY_WINDOW* \| *ARRAY_ITERATOR* \| *ARROW* \| *ATOB* \| *AUTO* \| *BARPROP* \| *BROWSER* \| *CAPITAL_HTML* \| *CHROME* \| *CHROME_86* \| *CHROME_PREV* \| *COMPACT* \| *CONSOLE* \| *DEFAULT* \| *DOCUMENT* \| *DOMWINDOW* \| *ESC_HTML_ALL* \| *ESC_HTML_QUOT* \| *ESC_HTML_QUOT_ONLY* \| *ESC_REGEXP_LF* \| *ESC_REGEXP_SLASH* \| *EXTERNAL* \| *FF* \| *FF_78* \| *FF_83* \| *FF_ESR* \| *FF_PREV* \| *FF_SRC* \| *FILL* \| *FLAT* \| *FROM_CODE_POINT* \| *FUNCTION_19_LF* \| *FUNCTION_22_LF* \| *GLOBAL_UNDEFINED* \| *GMT* \| *HISTORY* \| *HTMLAUDIOELEMENT* \| *HTMLDOCUMENT* \| *IE_10* \| *IE_11* \| *IE_11_WIN_10* \| *IE_9* \| *IE_SRC* \| *INCR_CHAR* \| *INTL* \| *LOCALE_INFINITY* \| *LOCALE_NUMERALS* \| *LOCALE_NUMERALS_EXT* \| *NAME* \| *NODECONSTRUCTOR* \| *NODE_0_10* \| *NODE_0_12* \| *NODE_10* \| *NODE_11* \| *NODE_12* \| *NODE_13* \| *NODE_15* \| *NODE_4* \| *NODE_5* \| *NO_FF_SRC* \| *NO_IE_SRC* \| *NO_OLD_SAFARI_ARRAY_ITERATOR* \| *NO_V8_SRC* \| *OBJECT_UNDEFINED* \| *PLAIN_INTL* \| *REGEXP_STRING_ITERATOR* \| *SAFARI* \| *SAFARI_10* \| *SAFARI_12* \| *SAFARI_13* \| *SAFARI_14_0_1* \| *SAFARI_7_0* \| *SAFARI_7_1* \| *SAFARI_8* \| *SAFARI_9* \| *SELF* \| *SELF_OBJ* \| *SHORT_LOCALES* \| *STATUS* \| *UNDEFINED* \| *V8_SRC* \| *WINDOW* \| [*CompatibleFeatureArray*](../README.md#compatiblefeaturearray))[]): [*CustomFeature*](customfeature.md)

Creates a new feature object from the union of the specified features.

The constructor can be used with or without the `new` operator, e.g.
`new JScrewIt.Feature(feature1, feature2)` or `JScrewIt.Feature(feature1, feature2)`.
If no arguments are specified, the new feature object will be equivalent to
<code>[DEFAULT](featureconstructor.md#default)</code>.

**`example`** 

The following statements are equivalent, and will all construct a new feature object
including both <code>[ANY_DOCUMENT](featureconstructor.md#any_document)</code> and <code>[ANY_WINDOW](featureconstructor.md#any_window)</code>.

```js
new JScrewIt.Feature("ANY_DOCUMENT", "ANY_WINDOW");
```

```js
new JScrewIt.Feature(JScrewIt.Feature.ANY_DOCUMENT, JScrewIt.Feature.ANY_WINDOW);
```

```js
new JScrewIt.Feature([JScrewIt.Feature.ANY_DOCUMENT, JScrewIt.Feature.ANY_WINDOW]);
```

**`throws`** 

An error is thrown if any of the specified features are not mutually compatible.

#### Parameters:

Name | Type |
------ | ------ |
`...features` | ([*Feature*](../README.md#feature) \| *ANDRO_4_0* \| *ANDRO_4_1* \| *ANDRO_4_4* \| *ANY_DOCUMENT* \| *ANY_WINDOW* \| *ARRAY_ITERATOR* \| *ARROW* \| *ATOB* \| *AUTO* \| *BARPROP* \| *BROWSER* \| *CAPITAL_HTML* \| *CHROME* \| *CHROME_86* \| *CHROME_PREV* \| *COMPACT* \| *CONSOLE* \| *DEFAULT* \| *DOCUMENT* \| *DOMWINDOW* \| *ESC_HTML_ALL* \| *ESC_HTML_QUOT* \| *ESC_HTML_QUOT_ONLY* \| *ESC_REGEXP_LF* \| *ESC_REGEXP_SLASH* \| *EXTERNAL* \| *FF* \| *FF_78* \| *FF_83* \| *FF_ESR* \| *FF_PREV* \| *FF_SRC* \| *FILL* \| *FLAT* \| *FROM_CODE_POINT* \| *FUNCTION_19_LF* \| *FUNCTION_22_LF* \| *GLOBAL_UNDEFINED* \| *GMT* \| *HISTORY* \| *HTMLAUDIOELEMENT* \| *HTMLDOCUMENT* \| *IE_10* \| *IE_11* \| *IE_11_WIN_10* \| *IE_9* \| *IE_SRC* \| *INCR_CHAR* \| *INTL* \| *LOCALE_INFINITY* \| *LOCALE_NUMERALS* \| *LOCALE_NUMERALS_EXT* \| *NAME* \| *NODECONSTRUCTOR* \| *NODE_0_10* \| *NODE_0_12* \| *NODE_10* \| *NODE_11* \| *NODE_12* \| *NODE_13* \| *NODE_15* \| *NODE_4* \| *NODE_5* \| *NO_FF_SRC* \| *NO_IE_SRC* \| *NO_OLD_SAFARI_ARRAY_ITERATOR* \| *NO_V8_SRC* \| *OBJECT_UNDEFINED* \| *PLAIN_INTL* \| *REGEXP_STRING_ITERATOR* \| *SAFARI* \| *SAFARI_10* \| *SAFARI_12* \| *SAFARI_13* \| *SAFARI_14_0_1* \| *SAFARI_7_0* \| *SAFARI_7_1* \| *SAFARI_8* \| *SAFARI_9* \| *SELF* \| *SELF_OBJ* \| *SHORT_LOCALES* \| *STATUS* \| *UNDEFINED* \| *V8_SRC* \| *WINDOW* \| [*CompatibleFeatureArray*](../README.md#compatiblefeaturearray))[] |

**Returns:** [*CustomFeature*](customfeature.md)

## Index

### Constructors

* [constructor](featureconstructor.md#constructor)

### Properties

* [ALL](featureconstructor.md#all)
* [ANDRO\_4\_0](featureconstructor.md#andro_4_0)
* [ANDRO\_4\_1](featureconstructor.md#andro_4_1)
* [ANDRO\_4\_4](featureconstructor.md#andro_4_4)
* [ANY\_DOCUMENT](featureconstructor.md#any_document)
* [ANY\_WINDOW](featureconstructor.md#any_window)
* [ARRAY\_ITERATOR](featureconstructor.md#array_iterator)
* [ARROW](featureconstructor.md#arrow)
* [ATOB](featureconstructor.md#atob)
* [AUTO](featureconstructor.md#auto)
* [BARPROP](featureconstructor.md#barprop)
* [BROWSER](featureconstructor.md#browser)
* [CAPITAL\_HTML](featureconstructor.md#capital_html)
* [CHROME](featureconstructor.md#chrome)
* [CHROME\_86](featureconstructor.md#chrome_86)
* [CHROME\_PREV](featureconstructor.md#chrome_prev)
* [COMPACT](featureconstructor.md#compact)
* [CONSOLE](featureconstructor.md#console)
* [DEFAULT](featureconstructor.md#default)
* [DOCUMENT](featureconstructor.md#document)
* [DOMWINDOW](featureconstructor.md#domwindow)
* [ELEMENTARY](featureconstructor.md#elementary)
* [ESC\_HTML\_ALL](featureconstructor.md#esc_html_all)
* [ESC\_HTML\_QUOT](featureconstructor.md#esc_html_quot)
* [ESC\_HTML\_QUOT\_ONLY](featureconstructor.md#esc_html_quot_only)
* [ESC\_REGEXP\_LF](featureconstructor.md#esc_regexp_lf)
* [ESC\_REGEXP\_SLASH](featureconstructor.md#esc_regexp_slash)
* [EXTERNAL](featureconstructor.md#external)
* [FF](featureconstructor.md#ff)
* [FF\_78](featureconstructor.md#ff_78)
* [FF\_83](featureconstructor.md#ff_83)
* [FF\_ESR](featureconstructor.md#ff_esr)
* [FF\_PREV](featureconstructor.md#ff_prev)
* [FF\_SRC](featureconstructor.md#ff_src)
* [FILL](featureconstructor.md#fill)
* [FLAT](featureconstructor.md#flat)
* [FROM\_CODE\_POINT](featureconstructor.md#from_code_point)
* [FUNCTION\_19\_LF](featureconstructor.md#function_19_lf)
* [FUNCTION\_22\_LF](featureconstructor.md#function_22_lf)
* [GLOBAL\_UNDEFINED](featureconstructor.md#global_undefined)
* [GMT](featureconstructor.md#gmt)
* [HISTORY](featureconstructor.md#history)
* [HTMLAUDIOELEMENT](featureconstructor.md#htmlaudioelement)
* [HTMLDOCUMENT](featureconstructor.md#htmldocument)
* [IE\_10](featureconstructor.md#ie_10)
* [IE\_11](featureconstructor.md#ie_11)
* [IE\_11\_WIN\_10](featureconstructor.md#ie_11_win_10)
* [IE\_9](featureconstructor.md#ie_9)
* [IE\_SRC](featureconstructor.md#ie_src)
* [INCR\_CHAR](featureconstructor.md#incr_char)
* [INTL](featureconstructor.md#intl)
* [LOCALE\_INFINITY](featureconstructor.md#locale_infinity)
* [LOCALE\_NUMERALS](featureconstructor.md#locale_numerals)
* [LOCALE\_NUMERALS\_EXT](featureconstructor.md#locale_numerals_ext)
* [NAME](featureconstructor.md#name)
* [NODECONSTRUCTOR](featureconstructor.md#nodeconstructor)
* [NODE\_0\_10](featureconstructor.md#node_0_10)
* [NODE\_0\_12](featureconstructor.md#node_0_12)
* [NODE\_10](featureconstructor.md#node_10)
* [NODE\_11](featureconstructor.md#node_11)
* [NODE\_12](featureconstructor.md#node_12)
* [NODE\_13](featureconstructor.md#node_13)
* [NODE\_15](featureconstructor.md#node_15)
* [NODE\_4](featureconstructor.md#node_4)
* [NODE\_5](featureconstructor.md#node_5)
* [NO\_FF\_SRC](featureconstructor.md#no_ff_src)
* [NO\_IE\_SRC](featureconstructor.md#no_ie_src)
* [NO\_OLD\_SAFARI\_ARRAY\_ITERATOR](featureconstructor.md#no_old_safari_array_iterator)
* [NO\_V8\_SRC](featureconstructor.md#no_v8_src)
* [OBJECT\_UNDEFINED](featureconstructor.md#object_undefined)
* [PLAIN\_INTL](featureconstructor.md#plain_intl)
* [REGEXP\_STRING\_ITERATOR](featureconstructor.md#regexp_string_iterator)
* [SAFARI](featureconstructor.md#safari)
* [SAFARI\_10](featureconstructor.md#safari_10)
* [SAFARI\_12](featureconstructor.md#safari_12)
* [SAFARI\_13](featureconstructor.md#safari_13)
* [SAFARI\_14\_0\_1](featureconstructor.md#safari_14_0_1)
* [SAFARI\_7\_0](featureconstructor.md#safari_7_0)
* [SAFARI\_7\_1](featureconstructor.md#safari_7_1)
* [SAFARI\_8](featureconstructor.md#safari_8)
* [SAFARI\_9](featureconstructor.md#safari_9)
* [SELF](featureconstructor.md#self)
* [SELF\_OBJ](featureconstructor.md#self_obj)
* [SHORT\_LOCALES](featureconstructor.md#short_locales)
* [STATUS](featureconstructor.md#status)
* [UNDEFINED](featureconstructor.md#undefined)
* [V8\_SRC](featureconstructor.md#v8_src)
* [WINDOW](featureconstructor.md#window)

### Methods

* [areCompatible](featureconstructor.md#arecompatible)
* [areEqual](featureconstructor.md#areequal)
* [commonOf](featureconstructor.md#commonof)
* [descriptionFor](featureconstructor.md#descriptionfor)

## Constructors

### constructor

\+ **new FeatureConstructor**(...`features`: ([*Feature*](../README.md#feature) \| *ANDRO_4_0* \| *ANDRO_4_1* \| *ANDRO_4_4* \| *ANY_DOCUMENT* \| *ANY_WINDOW* \| *ARRAY_ITERATOR* \| *ARROW* \| *ATOB* \| *AUTO* \| *BARPROP* \| *BROWSER* \| *CAPITAL_HTML* \| *CHROME* \| *CHROME_86* \| *CHROME_PREV* \| *COMPACT* \| *CONSOLE* \| *DEFAULT* \| *DOCUMENT* \| *DOMWINDOW* \| *ESC_HTML_ALL* \| *ESC_HTML_QUOT* \| *ESC_HTML_QUOT_ONLY* \| *ESC_REGEXP_LF* \| *ESC_REGEXP_SLASH* \| *EXTERNAL* \| *FF* \| *FF_78* \| *FF_83* \| *FF_ESR* \| *FF_PREV* \| *FF_SRC* \| *FILL* \| *FLAT* \| *FROM_CODE_POINT* \| *FUNCTION_19_LF* \| *FUNCTION_22_LF* \| *GLOBAL_UNDEFINED* \| *GMT* \| *HISTORY* \| *HTMLAUDIOELEMENT* \| *HTMLDOCUMENT* \| *IE_10* \| *IE_11* \| *IE_11_WIN_10* \| *IE_9* \| *IE_SRC* \| *INCR_CHAR* \| *INTL* \| *LOCALE_INFINITY* \| *LOCALE_NUMERALS* \| *LOCALE_NUMERALS_EXT* \| *NAME* \| *NODECONSTRUCTOR* \| *NODE_0_10* \| *NODE_0_12* \| *NODE_10* \| *NODE_11* \| *NODE_12* \| *NODE_13* \| *NODE_15* \| *NODE_4* \| *NODE_5* \| *NO_FF_SRC* \| *NO_IE_SRC* \| *NO_OLD_SAFARI_ARRAY_ITERATOR* \| *NO_V8_SRC* \| *OBJECT_UNDEFINED* \| *PLAIN_INTL* \| *REGEXP_STRING_ITERATOR* \| *SAFARI* \| *SAFARI_10* \| *SAFARI_12* \| *SAFARI_13* \| *SAFARI_14_0_1* \| *SAFARI_7_0* \| *SAFARI_7_1* \| *SAFARI_8* \| *SAFARI_9* \| *SELF* \| *SELF_OBJ* \| *SHORT_LOCALES* \| *STATUS* \| *UNDEFINED* \| *V8_SRC* \| *WINDOW* \| [*CompatibleFeatureArray*](../README.md#compatiblefeaturearray))[]): [*CustomFeature*](customfeature.md)

Creates a new feature object from the union of the specified features.

The constructor can be used with or without the `new` operator, e.g.
`new JScrewIt.Feature(feature1, feature2)` or `JScrewIt.Feature(feature1, feature2)`.
If no arguments are specified, the new feature object will be equivalent to
<code>[DEFAULT](featureconstructor.md#default)</code>.

**`example`** 

The following statements are equivalent, and will all construct a new feature object
including both <code>[ANY_DOCUMENT](featureconstructor.md#any_document)</code> and <code>[ANY_WINDOW](featureconstructor.md#any_window)</code>.

```js
JScrewIt.Feature("ANY_DOCUMENT", "ANY_WINDOW");
```

```js
JScrewIt.Feature(JScrewIt.Feature.ANY_DOCUMENT, JScrewIt.Feature.ANY_WINDOW);
```

```js
JScrewIt.Feature([JScrewIt.Feature.ANY_DOCUMENT, JScrewIt.Feature.ANY_WINDOW]);
```

**`throws`** 

An error is thrown if any of the specified features are not mutually compatible.

#### Parameters:

Name | Type |
------ | ------ |
`...features` | ([*Feature*](../README.md#feature) \| *ANDRO_4_0* \| *ANDRO_4_1* \| *ANDRO_4_4* \| *ANY_DOCUMENT* \| *ANY_WINDOW* \| *ARRAY_ITERATOR* \| *ARROW* \| *ATOB* \| *AUTO* \| *BARPROP* \| *BROWSER* \| *CAPITAL_HTML* \| *CHROME* \| *CHROME_86* \| *CHROME_PREV* \| *COMPACT* \| *CONSOLE* \| *DEFAULT* \| *DOCUMENT* \| *DOMWINDOW* \| *ESC_HTML_ALL* \| *ESC_HTML_QUOT* \| *ESC_HTML_QUOT_ONLY* \| *ESC_REGEXP_LF* \| *ESC_REGEXP_SLASH* \| *EXTERNAL* \| *FF* \| *FF_78* \| *FF_83* \| *FF_ESR* \| *FF_PREV* \| *FF_SRC* \| *FILL* \| *FLAT* \| *FROM_CODE_POINT* \| *FUNCTION_19_LF* \| *FUNCTION_22_LF* \| *GLOBAL_UNDEFINED* \| *GMT* \| *HISTORY* \| *HTMLAUDIOELEMENT* \| *HTMLDOCUMENT* \| *IE_10* \| *IE_11* \| *IE_11_WIN_10* \| *IE_9* \| *IE_SRC* \| *INCR_CHAR* \| *INTL* \| *LOCALE_INFINITY* \| *LOCALE_NUMERALS* \| *LOCALE_NUMERALS_EXT* \| *NAME* \| *NODECONSTRUCTOR* \| *NODE_0_10* \| *NODE_0_12* \| *NODE_10* \| *NODE_11* \| *NODE_12* \| *NODE_13* \| *NODE_15* \| *NODE_4* \| *NODE_5* \| *NO_FF_SRC* \| *NO_IE_SRC* \| *NO_OLD_SAFARI_ARRAY_ITERATOR* \| *NO_V8_SRC* \| *OBJECT_UNDEFINED* \| *PLAIN_INTL* \| *REGEXP_STRING_ITERATOR* \| *SAFARI* \| *SAFARI_10* \| *SAFARI_12* \| *SAFARI_13* \| *SAFARI_14_0_1* \| *SAFARI_7_0* \| *SAFARI_7_1* \| *SAFARI_8* \| *SAFARI_9* \| *SELF* \| *SELF_OBJ* \| *SHORT_LOCALES* \| *STATUS* \| *UNDEFINED* \| *V8_SRC* \| *WINDOW* \| [*CompatibleFeatureArray*](../README.md#compatiblefeaturearray))[] |

**Returns:** [*CustomFeature*](customfeature.md)

## Properties

### ALL

• `Readonly` **ALL**: [*FeatureAll*](featureall.md)

An immutable mapping of all predefined feature objects accessed by name or alias.

**`example`** 

This will produce an array with the names and aliases of all predefined features.

```js
Object.keys(JScrewIt.Feature.ALL)
```

This will determine if a particular feature object is predefined or not.

```js
featureObj === JScrewIt.Feature.ALL[featureObj.name]
```

___

### ANDRO\_4\_0

• **ANDRO\_4\_0**: [*PredefinedFeature*](predefinedfeature.md)

Features available in Android Browser 4.0.

Inherited from: [FeatureAll](featureall.md).[ANDRO_4_0](featureall.md#andro_4_0)

___

### ANDRO\_4\_1

• **ANDRO\_4\_1**: [*PredefinedFeature*](predefinedfeature.md)

Features available in Android Browser 4.1 to 4.3.

Inherited from: [FeatureAll](featureall.md).[ANDRO_4_1](featureall.md#andro_4_1)

___

### ANDRO\_4\_4

• **ANDRO\_4\_4**: [*PredefinedFeature*](predefinedfeature.md)

Features available in Android Browser 4.4.

Inherited from: [FeatureAll](featureall.md).[ANDRO_4_4](featureall.md#andro_4_4)

___

### ANY\_DOCUMENT

• **ANY\_DOCUMENT**: [*ElementaryFeature*](elementaryfeature.md)

Existence of the global object document whose string representation starts with "\[object " and ends with "Document\]".

**`remarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser. This feature is not available inside web workers.

Inherited from: [FeatureAll](featureall.md).[ANY_DOCUMENT](featureall.md#any_document)

___

### ANY\_WINDOW

• **ANY\_WINDOW**: [*ElementaryFeature*](elementaryfeature.md)

Existence of the global object self whose string representation starts with "\[object " and ends with "Window\]".

**`remarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser. This feature is not available inside web workers.

Inherited from: [FeatureAll](featureall.md).[ANY_WINDOW](featureall.md#any_window)

___

### ARRAY\_ITERATOR

• **ARRAY\_ITERATOR**: [*ElementaryFeature*](elementaryfeature.md)

The property that the string representation of Array.prototype.entries\(\) starts with "\[object Array" and ends with "\]" at index 21 or 22.

**`remarks`** 

Available in Chrome, Edge, Firefox, Safari 7.1+, Opera, and Node.js 0.12+.

Inherited from: [FeatureAll](featureall.md).[ARRAY_ITERATOR](featureall.md#array_iterator)

___

### ARROW

• **ARROW**: [*ElementaryFeature*](elementaryfeature.md)

Support for arrow functions.

**`remarks`** 

Available in Chrome, Edge, Firefox, Safari 10+, Opera, and Node.js 4+.

Inherited from: [FeatureAll](featureall.md).[ARROW](featureall.md#arrow)

___

### ATOB

• **ATOB**: [*ElementaryFeature*](elementaryfeature.md)

Existence of the global functions atob and btoa.

**`remarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer 10+, Safari, Opera, and Android Browser. This feature is not available inside web workers in Safari before 10.

Inherited from: [FeatureAll](featureall.md).[ATOB](featureall.md#atob)

___

### AUTO

• **AUTO**: [*PredefinedFeature*](predefinedfeature.md)

All features available in the current engine.

Inherited from: [FeatureAll](featureall.md).[AUTO](featureall.md#auto)

___

### BARPROP

• **BARPROP**: [*ElementaryFeature*](elementaryfeature.md)

Existence of the global object statusbar having the string representation "\[object BarProp\]".

**`remarks`** 

Available in Chrome, Edge, Firefox, Safari, Opera, and Android Browser 4.4. This feature is not available inside web workers.

Inherited from: [FeatureAll](featureall.md).[BARPROP](featureall.md#barprop)

___

### BROWSER

• **BROWSER**: [*PredefinedFeature*](predefinedfeature.md)

Features available in all browsers.

No support for Node.js.

Inherited from: [FeatureAll](featureall.md).[BROWSER](featureall.md#browser)

___

### CAPITAL\_HTML

• **CAPITAL\_HTML**: [*ElementaryFeature*](elementaryfeature.md)

The property that the various string methods returning HTML code such as String.prototype.big or String.prototype.link have both the tag name and attributes written in capital letters.

**`remarks`** 

Available in Internet Explorer.

Inherited from: [FeatureAll](featureall.md).[CAPITAL_HTML](featureall.md#capital_html)

___

### CHROME

• **CHROME**: [*PredefinedFeature*](predefinedfeature.md)

Features available in the current stable versions of Chrome, Edge and Opera.

An alias for `CHROME_86`.

Inherited from: [FeatureAll](featureall.md).[CHROME](featureall.md#chrome)

___

### CHROME\_86

• **CHROME\_86**: [*PredefinedFeature*](predefinedfeature.md)

Features available in Chrome 86, Edge 86 and Opera 72 or later.

**`remarks`** 

This feature may be replaced or removed in the near future when current browser versions become obsolete. Use `CHROME` or `CHROME_PREV` instead of `CHROME_86` for long term support.

**`see`** 

[Engine Support Policy](https://github.com/fasttime/JScrewIt#engine-support-policy)

Inherited from: [FeatureAll](featureall.md).[CHROME_86](featureall.md#chrome_86)

___

### CHROME\_PREV

• **CHROME\_PREV**: [*PredefinedFeature*](predefinedfeature.md)

Features available in the previous to current versions of Chrome and Edge.

An alias for `CHROME_86`.

Inherited from: [FeatureAll](featureall.md).[CHROME_PREV](featureall.md#chrome_prev)

___

### COMPACT

• **COMPACT**: [*PredefinedFeature*](predefinedfeature.md)

All new browsers' features.

No support for Node.js and older browsers like Internet Explorer, Safari 9 or Android Browser.

Inherited from: [FeatureAll](featureall.md).[COMPACT](featureall.md#compact)

___

### CONSOLE

• **CONSOLE**: [*ElementaryFeature*](elementaryfeature.md)

Existence of the global object console having the string representation "\[object Console\]".

This feature may become unavailable when certain browser extensions are active.

**`remarks`** 

Available in Internet Explorer 10+, Safari, and Android Browser. This feature is not available inside web workers in Safari before 7.1 and Android Browser 4.4.

Inherited from: [FeatureAll](featureall.md).[CONSOLE](featureall.md#console)

___

### DEFAULT

• **DEFAULT**: [*PredefinedFeature*](predefinedfeature.md)

Minimum feature level, compatible with all supported engines in all environments.

Inherited from: [FeatureAll](featureall.md).[DEFAULT](featureall.md#default)

___

### DOCUMENT

• **DOCUMENT**: [*ElementaryFeature*](elementaryfeature.md)

Existence of the global object document having the string representation "\[object Document\]".

**`remarks`** 

Available in Internet Explorer before 11. This feature is not available inside web workers.

Inherited from: [FeatureAll](featureall.md).[DOCUMENT](featureall.md#document)

___

### DOMWINDOW

• **DOMWINDOW**: [*ElementaryFeature*](elementaryfeature.md)

Existence of the global object self having the string representation "\[object DOMWindow\]".

**`remarks`** 

Available in Android Browser before 4.4. This feature is not available inside web workers.

Inherited from: [FeatureAll](featureall.md).[DOMWINDOW](featureall.md#domwindow)

___

### ELEMENTARY

• `Readonly` **ELEMENTARY**: readonly [*ElementaryFeature*](elementaryfeature.md)[]

An immutable array of all elementary feature objects ordered by name.

___

### ESC\_HTML\_ALL

• **ESC\_HTML\_ALL**: [*ElementaryFeature*](elementaryfeature.md)

The property that double quotation mark, less than and greater than characters in the argument of String.prototype.fontcolor are escaped into their respective HTML entities.

**`remarks`** 

Available in Android Browser and Node.js before 0.12.

Inherited from: [FeatureAll](featureall.md).[ESC_HTML_ALL](featureall.md#esc_html_all)

___

### ESC\_HTML\_QUOT

• **ESC\_HTML\_QUOT**: [*ElementaryFeature*](elementaryfeature.md)

The property that double quotation marks in the argument of String.prototype.fontcolor are escaped as "\&quot;".

**`remarks`** 

Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser, and Node.js.

Inherited from: [FeatureAll](featureall.md).[ESC_HTML_QUOT](featureall.md#esc_html_quot)

___

### ESC\_HTML\_QUOT\_ONLY

• **ESC\_HTML\_QUOT\_ONLY**: [*ElementaryFeature*](elementaryfeature.md)

The property that only double quotation marks and no other characters in the argument of String.prototype.fontcolor are escaped into HTML entities.

**`remarks`** 

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js 0.12+.

Inherited from: [FeatureAll](featureall.md).[ESC_HTML_QUOT_ONLY](featureall.md#esc_html_quot_only)

___

### ESC\_REGEXP\_LF

• **ESC\_REGEXP\_LF**: [*ElementaryFeature*](elementaryfeature.md)

Having regular expressions created with the RegExp constructor use escape sequences starting with a backslash to format line feed characters \("\\n"\) in their string representation.

**`remarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Node.js 12+.

Inherited from: [FeatureAll](featureall.md).[ESC_REGEXP_LF](featureall.md#esc_regexp_lf)

___

### ESC\_REGEXP\_SLASH

• **ESC\_REGEXP\_SLASH**: [*ElementaryFeature*](elementaryfeature.md)

Having regular expressions created with the RegExp constructor use escape sequences starting with a backslash to format slashes \("/"\) in their string representation.

**`remarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Node.js 4+.

Inherited from: [FeatureAll](featureall.md).[ESC_REGEXP_SLASH](featureall.md#esc_regexp_slash)

___

### EXTERNAL

• **EXTERNAL**: [*ElementaryFeature*](elementaryfeature.md)

Existence of the global object sidebar having the string representation "\[object External\]".

**`remarks`** 

Available in Firefox. This feature is not available inside web workers.

Inherited from: [FeatureAll](featureall.md).[EXTERNAL](featureall.md#external)

___

### FF

• **FF**: [*PredefinedFeature*](predefinedfeature.md)

Features available in the current stable version of Firefox.

An alias for `FF_83`.

Inherited from: [FeatureAll](featureall.md).[FF](featureall.md#ff)

___

### FF\_78

• **FF\_78**: [*PredefinedFeature*](predefinedfeature.md)

Features available in Firefox 78 to 82.

**`remarks`** 

This feature may be replaced or removed in the near future when current browser versions become obsolete. Use `FF_ESR` or `FF_PREV` instead of `FF_78` for long term support.

**`see`** 

[Engine Support Policy](https://github.com/fasttime/JScrewIt#engine-support-policy)

Inherited from: [FeatureAll](featureall.md).[FF_78](featureall.md#ff_78)

___

### FF\_83

• **FF\_83**: [*PredefinedFeature*](predefinedfeature.md)

Features available in Firefox 83 or later.

**`remarks`** 

This feature may be replaced or removed in the near future when current browser versions become obsolete. Use `FF` instead of `FF_83` for long term support.

**`see`** 

[Engine Support Policy](https://github.com/fasttime/JScrewIt#engine-support-policy)

Inherited from: [FeatureAll](featureall.md).[FF_83](featureall.md#ff_83)

___

### FF\_ESR

• **FF\_ESR**: [*PredefinedFeature*](predefinedfeature.md)

Features available in the current version of Firefox ESR.

An alias for `FF_78`.

Inherited from: [FeatureAll](featureall.md).[FF_ESR](featureall.md#ff_esr)

___

### FF\_PREV

• **FF\_PREV**: [*PredefinedFeature*](predefinedfeature.md)

Features available in the previous to current version of Firefox.

An alias for `FF_78`.

Inherited from: [FeatureAll](featureall.md).[FF_PREV](featureall.md#ff_prev)

___

### FF\_SRC

• **FF\_SRC**: [*ElementaryFeature*](elementaryfeature.md)

A string representation of native functions typical for Firefox and Safari.

Remarkable traits are the lack of line feed characters at the beginning and at the end of the string and the presence of a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.

**`remarks`** 

Available in Firefox and Safari.

Inherited from: [FeatureAll](featureall.md).[FF_SRC](featureall.md#ff_src)

___

### FILL

• **FILL**: [*ElementaryFeature*](elementaryfeature.md)

Existence of the native function Array.prototype.fill.

**`remarks`** 

Available in Chrome, Edge, Firefox, Safari 7.1+, Opera, and Node.js 4+.

Inherited from: [FeatureAll](featureall.md).[FILL](featureall.md#fill)

___

### FLAT

• **FLAT**: [*ElementaryFeature*](elementaryfeature.md)

Existence of the native function Array.prototype.flat.

**`remarks`** 

Available in Chrome, Edge, Firefox, Safari 12+, Opera, and Node.js 11+.

Inherited from: [FeatureAll](featureall.md).[FLAT](featureall.md#flat)

___

### FROM\_CODE\_POINT

• **FROM\_CODE\_POINT**: [*ElementaryFeature*](elementaryfeature.md)

Existence of the function String.fromCodePoint.

**`remarks`** 

Available in Chrome, Edge, Firefox, Safari 9+, Opera, and Node.js 4+.

Inherited from: [FeatureAll](featureall.md).[FROM_CODE_POINT](featureall.md#from_code_point)

___

### FUNCTION\_19\_LF

• **FUNCTION\_19\_LF**: [*ElementaryFeature*](elementaryfeature.md)

A string representation of dynamically generated functions where the character at index 19 is a line feed \("\\n"\).

**`remarks`** 

Available in Chrome, Edge, Firefox, Opera, and Node.js 10+.

Inherited from: [FeatureAll](featureall.md).[FUNCTION_19_LF](featureall.md#function_19_lf)

___

### FUNCTION\_22\_LF

• **FUNCTION\_22\_LF**: [*ElementaryFeature*](elementaryfeature.md)

A string representation of dynamically generated functions where the character at index 22 is a line feed \("\\n"\).

**`remarks`** 

Available in Internet Explorer, Safari 9+, Android Browser, and Node.js before 10.

Inherited from: [FeatureAll](featureall.md).[FUNCTION_22_LF](featureall.md#function_22_lf)

___

### GLOBAL\_UNDEFINED

• **GLOBAL\_UNDEFINED**: [*ElementaryFeature*](elementaryfeature.md)

Having the global function toString return the string "\[object Undefined\]" when invoked without a binding.

**`remarks`** 

Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js.

Inherited from: [FeatureAll](featureall.md).[GLOBAL_UNDEFINED](featureall.md#global_undefined)

___

### GMT

• **GMT**: [*ElementaryFeature*](elementaryfeature.md)

Presence of the text "GMT" after the first 25 characters in the string returned by Date\(\).

The string representation of dates is implementation dependent, but most engines use a similar format, making this feature available in all supported engines except Internet Explorer 9 and 10.

**`remarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari, Opera, Android Browser, and Node.js.

Inherited from: [FeatureAll](featureall.md).[GMT](featureall.md#gmt)

___

### HISTORY

• **HISTORY**: [*ElementaryFeature*](elementaryfeature.md)

Existence of the global object history having the string representation "\[object History\]".

**`remarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser. This feature is not available inside web workers.

Inherited from: [FeatureAll](featureall.md).[HISTORY](featureall.md#history)

___

### HTMLAUDIOELEMENT

• **HTMLAUDIOELEMENT**: [*ElementaryFeature*](elementaryfeature.md)

Existence of the global object Audio whose string representation starts with "function HTMLAudioElement".

**`remarks`** 

Available in Android Browser 4.4. This feature is not available inside web workers.

Inherited from: [FeatureAll](featureall.md).[HTMLAUDIOELEMENT](featureall.md#htmlaudioelement)

___

### HTMLDOCUMENT

• **HTMLDOCUMENT**: [*ElementaryFeature*](elementaryfeature.md)

Existence of the global object document having the string representation "\[object HTMLDocument\]".

**`remarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari, Opera, and Android Browser. This feature is not available inside web workers.

Inherited from: [FeatureAll](featureall.md).[HTMLDOCUMENT](featureall.md#htmldocument)

___

### IE\_10

• **IE\_10**: [*PredefinedFeature*](predefinedfeature.md)

Features available in Internet Explorer 10.

Inherited from: [FeatureAll](featureall.md).[IE_10](featureall.md#ie_10)

___

### IE\_11

• **IE\_11**: [*PredefinedFeature*](predefinedfeature.md)

Features available in Internet Explorer 11.

Inherited from: [FeatureAll](featureall.md).[IE_11](featureall.md#ie_11)

___

### IE\_11\_WIN\_10

• **IE\_11\_WIN\_10**: [*PredefinedFeature*](predefinedfeature.md)

Features available in Internet Explorer 11 on Windows 10.

Inherited from: [FeatureAll](featureall.md).[IE_11_WIN_10](featureall.md#ie_11_win_10)

___

### IE\_9

• **IE\_9**: [*PredefinedFeature*](predefinedfeature.md)

Features available in Internet Explorer 9.

Inherited from: [FeatureAll](featureall.md).[IE_9](featureall.md#ie_9)

___

### IE\_SRC

• **IE\_SRC**: [*ElementaryFeature*](elementaryfeature.md)

A string representation of native functions typical for Internet Explorer.

Remarkable traits are the presence of a line feed character \("\\n"\) at the beginning and at the end of the string and a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.

**`remarks`** 

Available in Internet Explorer.

Inherited from: [FeatureAll](featureall.md).[IE_SRC](featureall.md#ie_src)

___

### INCR\_CHAR

• **INCR\_CHAR**: [*ElementaryFeature*](elementaryfeature.md)

The ability to use unary increment operators with string characters, like in \( ++"some string"\[0\] \): this will result in a TypeError in strict mode in ECMAScript compliant engines.

**`remarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, Android Browser, and Node.js. This feature is not available when strict mode is enforced in Chrome, Edge, Firefox, Internet Explorer 10+, Safari, Opera, and Node.js 5+.

Inherited from: [FeatureAll](featureall.md).[INCR_CHAR](featureall.md#incr_char)

___

### INTL

• **INTL**: [*ElementaryFeature*](elementaryfeature.md)

Existence of the global object Intl.

**`remarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari 10+, Opera, Android Browser 4.4, and Node.js 0.12+.

Inherited from: [FeatureAll](featureall.md).[INTL](featureall.md#intl)

___

### LOCALE\_INFINITY

• **LOCALE\_INFINITY**: [*ElementaryFeature*](elementaryfeature.md)

Language sensitive string representation of Infinity as "∞".

**`remarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer 11 on Windows 10, Safari 10+, Opera, Android Browser 4.4, and Node.js 0.12+.

Inherited from: [FeatureAll](featureall.md).[LOCALE_INFINITY](featureall.md#locale_infinity)

___

### LOCALE\_NUMERALS

• **LOCALE\_NUMERALS**: [*ElementaryFeature*](elementaryfeature.md)

Features shared by all engines capable of localized number formatting, including output of Arabic digits, the Arabic decimal separator "٫", the letters in the first word of the Arabic string representation of NaN \("ليس"\), Persian digits and the Persian digit group separator "٬".

**`remarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari 10+, Opera, Android Browser 4.4, and Node.js 13+.

Inherited from: [FeatureAll](featureall.md).[LOCALE_NUMERALS](featureall.md#locale_numerals)

___

### LOCALE\_NUMERALS\_EXT

• **LOCALE\_NUMERALS\_EXT**: [*ElementaryFeature*](elementaryfeature.md)

Extended localized number formatting.

This includes all features of LOCALE_NUMERALS plus the output of the first three letters in the second word of the Arabic string representation of NaN \("رقم"\), Bengali digits and the letters in the Russian string representation of NaN \("не число"\).

**`remarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer 11 on Windows 10, Safari 10+, Opera, Android Browser 4.4, and Node.js 13+.

Inherited from: [FeatureAll](featureall.md).[LOCALE_NUMERALS_EXT](featureall.md#locale_numerals_ext)

___

### NAME

• **NAME**: [*ElementaryFeature*](elementaryfeature.md)

Existence of the name property for functions.

**`remarks`** 

Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser, and Node.js.

Inherited from: [FeatureAll](featureall.md).[NAME](featureall.md#name)

___

### NODECONSTRUCTOR

• **NODECONSTRUCTOR**: [*ElementaryFeature*](elementaryfeature.md)

Existence of the global object Node having the string representation "\[object NodeConstructor\]".

**`remarks`** 

Available in Safari before 10. This feature is not available inside web workers.

Inherited from: [FeatureAll](featureall.md).[NODECONSTRUCTOR](featureall.md#nodeconstructor)

___

### NODE\_0\_10

• **NODE\_0\_10**: [*PredefinedFeature*](predefinedfeature.md)

Features available in Node.js 0.10.

Inherited from: [FeatureAll](featureall.md).[NODE_0_10](featureall.md#node_0_10)

___

### NODE\_0\_12

• **NODE\_0\_12**: [*PredefinedFeature*](predefinedfeature.md)

Features available in Node.js 0.12.

Inherited from: [FeatureAll](featureall.md).[NODE_0_12](featureall.md#node_0_12)

___

### NODE\_10

• **NODE\_10**: [*PredefinedFeature*](predefinedfeature.md)

Features available in Node.js 10.

Inherited from: [FeatureAll](featureall.md).[NODE_10](featureall.md#node_10)

___

### NODE\_11

• **NODE\_11**: [*PredefinedFeature*](predefinedfeature.md)

Features available in Node.js 11.

Inherited from: [FeatureAll](featureall.md).[NODE_11](featureall.md#node_11)

___

### NODE\_12

• **NODE\_12**: [*PredefinedFeature*](predefinedfeature.md)

Features available in Node.js 12.

Inherited from: [FeatureAll](featureall.md).[NODE_12](featureall.md#node_12)

___

### NODE\_13

• **NODE\_13**: [*PredefinedFeature*](predefinedfeature.md)

Features available in Node.js 13 and Node.js 14.

Inherited from: [FeatureAll](featureall.md).[NODE_13](featureall.md#node_13)

___

### NODE\_15

• **NODE\_15**: [*PredefinedFeature*](predefinedfeature.md)

Features available in Node.js 15 or later.

Inherited from: [FeatureAll](featureall.md).[NODE_15](featureall.md#node_15)

___

### NODE\_4

• **NODE\_4**: [*PredefinedFeature*](predefinedfeature.md)

Features available in Node.js 4.

Inherited from: [FeatureAll](featureall.md).[NODE_4](featureall.md#node_4)

___

### NODE\_5

• **NODE\_5**: [*PredefinedFeature*](predefinedfeature.md)

Features available in Node.js 5 to 9.

Inherited from: [FeatureAll](featureall.md).[NODE_5](featureall.md#node_5)

___

### NO\_FF\_SRC

• **NO\_FF\_SRC**: [*ElementaryFeature*](elementaryfeature.md)

A string representation of native functions typical for V8 or for Internet Explorer but not for Firefox and Safari.

**`remarks`** 

Available in Chrome, Edge, Internet Explorer, Opera, Android Browser, and Node.js.

Inherited from: [FeatureAll](featureall.md).[NO_FF_SRC](featureall.md#no_ff_src)

___

### NO\_IE\_SRC

• **NO\_IE\_SRC**: [*ElementaryFeature*](elementaryfeature.md)

A string representation of native functions typical for most engines with the notable exception of Internet Explorer.

A remarkable trait of this feature is the lack of line feed characters at the beginning and at the end of the string.

**`remarks`** 

Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser, and Node.js.

Inherited from: [FeatureAll](featureall.md).[NO_IE_SRC](featureall.md#no_ie_src)

___

### NO\_OLD\_SAFARI\_ARRAY\_ITERATOR

• **NO\_OLD\_SAFARI\_ARRAY\_ITERATOR**: [*ElementaryFeature*](elementaryfeature.md)

The property that the string representation of Array.prototype.entries\(\) evaluates to "\[object Array Iterator\]".

**`remarks`** 

Available in Chrome, Edge, Firefox, Safari 9+, Opera, and Node.js 0.12+.

Inherited from: [FeatureAll](featureall.md).[NO_OLD_SAFARI_ARRAY_ITERATOR](featureall.md#no_old_safari_array_iterator)

___

### NO\_V8\_SRC

• **NO\_V8\_SRC**: [*ElementaryFeature*](elementaryfeature.md)

A string representation of native functions typical for Firefox, Internet Explorer and Safari.

A most remarkable trait of this feature is the presence of a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.

**`remarks`** 

Available in Firefox, Internet Explorer, and Safari.

Inherited from: [FeatureAll](featureall.md).[NO_V8_SRC](featureall.md#no_v8_src)

___

### OBJECT\_UNDEFINED

• **OBJECT\_UNDEFINED**: [*ElementaryFeature*](elementaryfeature.md)

Having the function Object.prototype.toString return the string "\[object Undefined\]" when invoked without a binding.

**`remarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer 10+, Safari, Opera, Android Browser 4.1+, and Node.js.

Inherited from: [FeatureAll](featureall.md).[OBJECT_UNDEFINED](featureall.md#object_undefined)

___

### PLAIN\_INTL

• **PLAIN\_INTL**: [*ElementaryFeature*](elementaryfeature.md)

Existence of the global object Intl having the string representation "\[object Object\]"

**`remarks`** 

Available in Firefox before 83, Internet Explorer 11, Safari 10+ before 14.0.1, Android Browser 4.4, and Node.js 0.12+ before 15.

Inherited from: [FeatureAll](featureall.md).[PLAIN_INTL](featureall.md#plain_intl)

___

### REGEXP\_STRING\_ITERATOR

• **REGEXP\_STRING\_ITERATOR**: [*ElementaryFeature*](elementaryfeature.md)

The property that the string representation of String.prototype.matchAll\(\) evaluates to "\[object RegExp String Iterator\]".

**`remarks`** 

Available in Chrome, Edge, Firefox, Safari 13+, Opera, and Node.js 12+.

Inherited from: [FeatureAll](featureall.md).[REGEXP_STRING_ITERATOR](featureall.md#regexp_string_iterator)

___

### SAFARI

• **SAFARI**: [*PredefinedFeature*](predefinedfeature.md)

Features available in the current stable version of Safari.

An alias for `SAFARI_14_0_1`.

Inherited from: [FeatureAll](featureall.md).[SAFARI](featureall.md#safari)

___

### SAFARI\_10

• **SAFARI\_10**: [*PredefinedFeature*](predefinedfeature.md)

Features available in Safari 10 and Safari 11.

Inherited from: [FeatureAll](featureall.md).[SAFARI_10](featureall.md#safari_10)

___

### SAFARI\_12

• **SAFARI\_12**: [*PredefinedFeature*](predefinedfeature.md)

Features available in Safari 12.

Inherited from: [FeatureAll](featureall.md).[SAFARI_12](featureall.md#safari_12)

___

### SAFARI\_13

• **SAFARI\_13**: [*PredefinedFeature*](predefinedfeature.md)

Features available in Safari 13 and Safari 14.0.0.

Inherited from: [FeatureAll](featureall.md).[SAFARI_13](featureall.md#safari_13)

___

### SAFARI\_14\_0\_1

• **SAFARI\_14\_0\_1**: [*PredefinedFeature*](predefinedfeature.md)

Features available in Safari 14.0.1 or later.

Inherited from: [FeatureAll](featureall.md).[SAFARI_14_0_1](featureall.md#safari_14_0_1)

___

### SAFARI\_7\_0

• **SAFARI\_7\_0**: [*PredefinedFeature*](predefinedfeature.md)

Features available in Safari 7.0.

Inherited from: [FeatureAll](featureall.md).[SAFARI_7_0](featureall.md#safari_7_0)

___

### SAFARI\_7\_1

• **SAFARI\_7\_1**: [*PredefinedFeature*](predefinedfeature.md)

Features available in Safari 7.1 and Safari 8.

Inherited from: [FeatureAll](featureall.md).[SAFARI_7_1](featureall.md#safari_7_1)

___

### SAFARI\_8

• **SAFARI\_8**: [*PredefinedFeature*](predefinedfeature.md)

An alias for `SAFARI_7_1`.

Inherited from: [FeatureAll](featureall.md).[SAFARI_8](featureall.md#safari_8)

___

### SAFARI\_9

• **SAFARI\_9**: [*PredefinedFeature*](predefinedfeature.md)

Features available in Safari 9.

Inherited from: [FeatureAll](featureall.md).[SAFARI_9](featureall.md#safari_9)

___

### SELF

• **SELF**: [*ElementaryFeature*](elementaryfeature.md)

An alias for `ANY_WINDOW`.

Inherited from: [FeatureAll](featureall.md).[SELF](featureall.md#self)

___

### SELF\_OBJ

• **SELF\_OBJ**: [*ElementaryFeature*](elementaryfeature.md)

Existence of the global object self whose string representation starts with "\[object ".

**`remarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser. This feature is not available inside web workers in Safari 7.1+ before 10.

Inherited from: [FeatureAll](featureall.md).[SELF_OBJ](featureall.md#self_obj)

___

### SHORT\_LOCALES

• **SHORT\_LOCALES**: [*ElementaryFeature*](elementaryfeature.md)

Support for the two-letter locale name "ar" to format decimal numbers as Arabic numerals.

**`remarks`** 

Available in Firefox, Internet Explorer 11, Safari 10+, Android Browser 4.4, and Node.js 13+.

Inherited from: [FeatureAll](featureall.md).[SHORT_LOCALES](featureall.md#short_locales)

___

### STATUS

• **STATUS**: [*ElementaryFeature*](elementaryfeature.md)

Existence of the global string status.

**`remarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser. This feature is not available inside web workers.

Inherited from: [FeatureAll](featureall.md).[STATUS](featureall.md#status)

___

### UNDEFINED

• **UNDEFINED**: [*ElementaryFeature*](elementaryfeature.md)

The property that Object.prototype.toString.call\(\) evaluates to "\[object Undefined\]".

This behavior is specified by ECMAScript, and is enforced by all engines except Android Browser versions prior to 4.1.2, where this feature is not available.

**`remarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, Android Browser 4.1+, and Node.js.

Inherited from: [FeatureAll](featureall.md).[UNDEFINED](featureall.md#undefined)

___

### V8\_SRC

• **V8\_SRC**: [*ElementaryFeature*](elementaryfeature.md)

A string representation of native functions typical for the V8 engine.

Remarkable traits are the lack of line feed characters at the beginning and at the end of the string and the presence of a single whitespace before the "\[native code\]" sequence.

**`remarks`** 

Available in Chrome, Edge, Opera, Android Browser, and Node.js.

Inherited from: [FeatureAll](featureall.md).[V8_SRC](featureall.md#v8_src)

___

### WINDOW

• **WINDOW**: [*ElementaryFeature*](elementaryfeature.md)

Existence of the global object self having the string representation "\[object Window\]".

**`remarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser 4.4. This feature is not available inside web workers.

Inherited from: [FeatureAll](featureall.md).[WINDOW](featureall.md#window)

## Methods

### areCompatible

▸ **areCompatible**(...`features`: [*FeatureElement*](../README.md#featureelement)[]): *boolean*

Determines whether the specified features are mutually compatible.

**`example`** 

```js
// false: only one of "V8_SRC" or "IE_SRC" may be available.
JScrewIt.Feature.areCompatible("V8_SRC", "IE_SRC")
```

```js
// true
JScrewIt.Feature.areCompatible(JScrewIt.Feature.DEFAULT, JScrewIt.Feature.FILL)
```

#### Parameters:

Name | Type |
------ | ------ |
`...features` | [*FeatureElement*](../README.md#featureelement)[] |

**Returns:** *boolean*

`true` if the specified features are mutually compatible; otherwise, `false`.
If less than two features are specified, the return value is `true`.

___

### areEqual

▸ **areEqual**(...`features`: ([*Feature*](../README.md#feature) \| *ANDRO_4_0* \| *ANDRO_4_1* \| *ANDRO_4_4* \| *ANY_DOCUMENT* \| *ANY_WINDOW* \| *ARRAY_ITERATOR* \| *ARROW* \| *ATOB* \| *AUTO* \| *BARPROP* \| *BROWSER* \| *CAPITAL_HTML* \| *CHROME* \| *CHROME_86* \| *CHROME_PREV* \| *COMPACT* \| *CONSOLE* \| *DEFAULT* \| *DOCUMENT* \| *DOMWINDOW* \| *ESC_HTML_ALL* \| *ESC_HTML_QUOT* \| *ESC_HTML_QUOT_ONLY* \| *ESC_REGEXP_LF* \| *ESC_REGEXP_SLASH* \| *EXTERNAL* \| *FF* \| *FF_78* \| *FF_83* \| *FF_ESR* \| *FF_PREV* \| *FF_SRC* \| *FILL* \| *FLAT* \| *FROM_CODE_POINT* \| *FUNCTION_19_LF* \| *FUNCTION_22_LF* \| *GLOBAL_UNDEFINED* \| *GMT* \| *HISTORY* \| *HTMLAUDIOELEMENT* \| *HTMLDOCUMENT* \| *IE_10* \| *IE_11* \| *IE_11_WIN_10* \| *IE_9* \| *IE_SRC* \| *INCR_CHAR* \| *INTL* \| *LOCALE_INFINITY* \| *LOCALE_NUMERALS* \| *LOCALE_NUMERALS_EXT* \| *NAME* \| *NODECONSTRUCTOR* \| *NODE_0_10* \| *NODE_0_12* \| *NODE_10* \| *NODE_11* \| *NODE_12* \| *NODE_13* \| *NODE_15* \| *NODE_4* \| *NODE_5* \| *NO_FF_SRC* \| *NO_IE_SRC* \| *NO_OLD_SAFARI_ARRAY_ITERATOR* \| *NO_V8_SRC* \| *OBJECT_UNDEFINED* \| *PLAIN_INTL* \| *REGEXP_STRING_ITERATOR* \| *SAFARI* \| *SAFARI_10* \| *SAFARI_12* \| *SAFARI_13* \| *SAFARI_14_0_1* \| *SAFARI_7_0* \| *SAFARI_7_1* \| *SAFARI_8* \| *SAFARI_9* \| *SELF* \| *SELF_OBJ* \| *SHORT_LOCALES* \| *STATUS* \| *UNDEFINED* \| *V8_SRC* \| *WINDOW* \| [*CompatibleFeatureArray*](../README.md#compatiblefeaturearray))[]): *boolean*

Determines whether all of the specified features are equivalent.

Different features are considered equivalent if they include the same set of elementary
features, regardless of any other difference.

**`example`** 

```js
// false
JScrewIt.Feature.areEqual(JScrewIt.Feature.CHROME, JScrewIt.Feature.FF)
```

```js
// true
JScrewIt.Feature.areEqual("DEFAULT", [])
```

#### Parameters:

Name | Type |
------ | ------ |
`...features` | ([*Feature*](../README.md#feature) \| *ANDRO_4_0* \| *ANDRO_4_1* \| *ANDRO_4_4* \| *ANY_DOCUMENT* \| *ANY_WINDOW* \| *ARRAY_ITERATOR* \| *ARROW* \| *ATOB* \| *AUTO* \| *BARPROP* \| *BROWSER* \| *CAPITAL_HTML* \| *CHROME* \| *CHROME_86* \| *CHROME_PREV* \| *COMPACT* \| *CONSOLE* \| *DEFAULT* \| *DOCUMENT* \| *DOMWINDOW* \| *ESC_HTML_ALL* \| *ESC_HTML_QUOT* \| *ESC_HTML_QUOT_ONLY* \| *ESC_REGEXP_LF* \| *ESC_REGEXP_SLASH* \| *EXTERNAL* \| *FF* \| *FF_78* \| *FF_83* \| *FF_ESR* \| *FF_PREV* \| *FF_SRC* \| *FILL* \| *FLAT* \| *FROM_CODE_POINT* \| *FUNCTION_19_LF* \| *FUNCTION_22_LF* \| *GLOBAL_UNDEFINED* \| *GMT* \| *HISTORY* \| *HTMLAUDIOELEMENT* \| *HTMLDOCUMENT* \| *IE_10* \| *IE_11* \| *IE_11_WIN_10* \| *IE_9* \| *IE_SRC* \| *INCR_CHAR* \| *INTL* \| *LOCALE_INFINITY* \| *LOCALE_NUMERALS* \| *LOCALE_NUMERALS_EXT* \| *NAME* \| *NODECONSTRUCTOR* \| *NODE_0_10* \| *NODE_0_12* \| *NODE_10* \| *NODE_11* \| *NODE_12* \| *NODE_13* \| *NODE_15* \| *NODE_4* \| *NODE_5* \| *NO_FF_SRC* \| *NO_IE_SRC* \| *NO_OLD_SAFARI_ARRAY_ITERATOR* \| *NO_V8_SRC* \| *OBJECT_UNDEFINED* \| *PLAIN_INTL* \| *REGEXP_STRING_ITERATOR* \| *SAFARI* \| *SAFARI_10* \| *SAFARI_12* \| *SAFARI_13* \| *SAFARI_14_0_1* \| *SAFARI_7_0* \| *SAFARI_7_1* \| *SAFARI_8* \| *SAFARI_9* \| *SELF* \| *SELF_OBJ* \| *SHORT_LOCALES* \| *STATUS* \| *UNDEFINED* \| *V8_SRC* \| *WINDOW* \| [*CompatibleFeatureArray*](../README.md#compatiblefeaturearray))[] |

**Returns:** *boolean*

`true` if all of the specified features are equivalent; otherwise, `false`.
If less than two arguments are specified, the return value is `true`.

___

### commonOf

▸ **commonOf**(...`features`: ([*Feature*](../README.md#feature) \| *ANDRO_4_0* \| *ANDRO_4_1* \| *ANDRO_4_4* \| *ANY_DOCUMENT* \| *ANY_WINDOW* \| *ARRAY_ITERATOR* \| *ARROW* \| *ATOB* \| *AUTO* \| *BARPROP* \| *BROWSER* \| *CAPITAL_HTML* \| *CHROME* \| *CHROME_86* \| *CHROME_PREV* \| *COMPACT* \| *CONSOLE* \| *DEFAULT* \| *DOCUMENT* \| *DOMWINDOW* \| *ESC_HTML_ALL* \| *ESC_HTML_QUOT* \| *ESC_HTML_QUOT_ONLY* \| *ESC_REGEXP_LF* \| *ESC_REGEXP_SLASH* \| *EXTERNAL* \| *FF* \| *FF_78* \| *FF_83* \| *FF_ESR* \| *FF_PREV* \| *FF_SRC* \| *FILL* \| *FLAT* \| *FROM_CODE_POINT* \| *FUNCTION_19_LF* \| *FUNCTION_22_LF* \| *GLOBAL_UNDEFINED* \| *GMT* \| *HISTORY* \| *HTMLAUDIOELEMENT* \| *HTMLDOCUMENT* \| *IE_10* \| *IE_11* \| *IE_11_WIN_10* \| *IE_9* \| *IE_SRC* \| *INCR_CHAR* \| *INTL* \| *LOCALE_INFINITY* \| *LOCALE_NUMERALS* \| *LOCALE_NUMERALS_EXT* \| *NAME* \| *NODECONSTRUCTOR* \| *NODE_0_10* \| *NODE_0_12* \| *NODE_10* \| *NODE_11* \| *NODE_12* \| *NODE_13* \| *NODE_15* \| *NODE_4* \| *NODE_5* \| *NO_FF_SRC* \| *NO_IE_SRC* \| *NO_OLD_SAFARI_ARRAY_ITERATOR* \| *NO_V8_SRC* \| *OBJECT_UNDEFINED* \| *PLAIN_INTL* \| *REGEXP_STRING_ITERATOR* \| *SAFARI* \| *SAFARI_10* \| *SAFARI_12* \| *SAFARI_13* \| *SAFARI_14_0_1* \| *SAFARI_7_0* \| *SAFARI_7_1* \| *SAFARI_8* \| *SAFARI_9* \| *SELF* \| *SELF_OBJ* \| *SHORT_LOCALES* \| *STATUS* \| *UNDEFINED* \| *V8_SRC* \| *WINDOW* \| [*CompatibleFeatureArray*](../README.md#compatiblefeaturearray))[]): *null* \| [*CustomFeature*](customfeature.md)

Creates a new feature object equivalent to the intersection of the specified features.

**`example`** 

This will create a new feature object equivalent to <code>[NAME](featureconstructor.md#name)</code>.

```js
const newFeature = JScrewIt.Feature.commonOf(["ATOB", "NAME"], ["NAME", "SELF"]);
```

This will create a new feature object equivalent to <code>[ANY_DOCUMENT](featureconstructor.md#any_document)</code>.
This is because both <code>[HTMLDOCUMENT](featureconstructor.md#htmldocument)</code> and <code>[DOCUMENT](featureconstructor.md#document)</code> imply
<code>[ANY_DOCUMENT](featureconstructor.md#any_document)</code>.

```js
const newFeature = JScrewIt.Feature.commonOf("HTMLDOCUMENT", "DOCUMENT");
```

#### Parameters:

Name | Type |
------ | ------ |
`...features` | ([*Feature*](../README.md#feature) \| *ANDRO_4_0* \| *ANDRO_4_1* \| *ANDRO_4_4* \| *ANY_DOCUMENT* \| *ANY_WINDOW* \| *ARRAY_ITERATOR* \| *ARROW* \| *ATOB* \| *AUTO* \| *BARPROP* \| *BROWSER* \| *CAPITAL_HTML* \| *CHROME* \| *CHROME_86* \| *CHROME_PREV* \| *COMPACT* \| *CONSOLE* \| *DEFAULT* \| *DOCUMENT* \| *DOMWINDOW* \| *ESC_HTML_ALL* \| *ESC_HTML_QUOT* \| *ESC_HTML_QUOT_ONLY* \| *ESC_REGEXP_LF* \| *ESC_REGEXP_SLASH* \| *EXTERNAL* \| *FF* \| *FF_78* \| *FF_83* \| *FF_ESR* \| *FF_PREV* \| *FF_SRC* \| *FILL* \| *FLAT* \| *FROM_CODE_POINT* \| *FUNCTION_19_LF* \| *FUNCTION_22_LF* \| *GLOBAL_UNDEFINED* \| *GMT* \| *HISTORY* \| *HTMLAUDIOELEMENT* \| *HTMLDOCUMENT* \| *IE_10* \| *IE_11* \| *IE_11_WIN_10* \| *IE_9* \| *IE_SRC* \| *INCR_CHAR* \| *INTL* \| *LOCALE_INFINITY* \| *LOCALE_NUMERALS* \| *LOCALE_NUMERALS_EXT* \| *NAME* \| *NODECONSTRUCTOR* \| *NODE_0_10* \| *NODE_0_12* \| *NODE_10* \| *NODE_11* \| *NODE_12* \| *NODE_13* \| *NODE_15* \| *NODE_4* \| *NODE_5* \| *NO_FF_SRC* \| *NO_IE_SRC* \| *NO_OLD_SAFARI_ARRAY_ITERATOR* \| *NO_V8_SRC* \| *OBJECT_UNDEFINED* \| *PLAIN_INTL* \| *REGEXP_STRING_ITERATOR* \| *SAFARI* \| *SAFARI_10* \| *SAFARI_12* \| *SAFARI_13* \| *SAFARI_14_0_1* \| *SAFARI_7_0* \| *SAFARI_7_1* \| *SAFARI_8* \| *SAFARI_9* \| *SELF* \| *SELF_OBJ* \| *SHORT_LOCALES* \| *STATUS* \| *UNDEFINED* \| *V8_SRC* \| *WINDOW* \| [*CompatibleFeatureArray*](../README.md#compatiblefeaturearray))[] |

**Returns:** *null* \| [*CustomFeature*](customfeature.md)

A feature object, or `null` if no arguments are specified.

___

### descriptionFor

▸ **descriptionFor**(`name`: *ANDRO_4_0* \| *ANDRO_4_1* \| *ANDRO_4_4* \| *ANY_DOCUMENT* \| *ANY_WINDOW* \| *ARRAY_ITERATOR* \| *ARROW* \| *ATOB* \| *AUTO* \| *BARPROP* \| *BROWSER* \| *CAPITAL_HTML* \| *CHROME* \| *CHROME_86* \| *CHROME_PREV* \| *COMPACT* \| *CONSOLE* \| *DEFAULT* \| *DOCUMENT* \| *DOMWINDOW* \| *ESC_HTML_ALL* \| *ESC_HTML_QUOT* \| *ESC_HTML_QUOT_ONLY* \| *ESC_REGEXP_LF* \| *ESC_REGEXP_SLASH* \| *EXTERNAL* \| *FF* \| *FF_78* \| *FF_83* \| *FF_ESR* \| *FF_PREV* \| *FF_SRC* \| *FILL* \| *FLAT* \| *FROM_CODE_POINT* \| *FUNCTION_19_LF* \| *FUNCTION_22_LF* \| *GLOBAL_UNDEFINED* \| *GMT* \| *HISTORY* \| *HTMLAUDIOELEMENT* \| *HTMLDOCUMENT* \| *IE_10* \| *IE_11* \| *IE_11_WIN_10* \| *IE_9* \| *IE_SRC* \| *INCR_CHAR* \| *INTL* \| *LOCALE_INFINITY* \| *LOCALE_NUMERALS* \| *LOCALE_NUMERALS_EXT* \| *NAME* \| *NODECONSTRUCTOR* \| *NODE_0_10* \| *NODE_0_12* \| *NODE_10* \| *NODE_11* \| *NODE_12* \| *NODE_13* \| *NODE_15* \| *NODE_4* \| *NODE_5* \| *NO_FF_SRC* \| *NO_IE_SRC* \| *NO_OLD_SAFARI_ARRAY_ITERATOR* \| *NO_V8_SRC* \| *OBJECT_UNDEFINED* \| *PLAIN_INTL* \| *REGEXP_STRING_ITERATOR* \| *SAFARI* \| *SAFARI_10* \| *SAFARI_12* \| *SAFARI_13* \| *SAFARI_14_0_1* \| *SAFARI_7_0* \| *SAFARI_7_1* \| *SAFARI_8* \| *SAFARI_9* \| *SELF* \| *SELF_OBJ* \| *SHORT_LOCALES* \| *STATUS* \| *UNDEFINED* \| *V8_SRC* \| *WINDOW*): *string*

Returns a short description of a predefined feature in plain English.

**`remarks`** 

Different names or aliases of the same feature may have different descriptions.

**`throws`** 

An error is thrown if the specified argument is not a name or alias of a predefined feature.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`name` | *ANDRO_4_0* \| *ANDRO_4_1* \| *ANDRO_4_4* \| *ANY_DOCUMENT* \| *ANY_WINDOW* \| *ARRAY_ITERATOR* \| *ARROW* \| *ATOB* \| *AUTO* \| *BARPROP* \| *BROWSER* \| *CAPITAL_HTML* \| *CHROME* \| *CHROME_86* \| *CHROME_PREV* \| *COMPACT* \| *CONSOLE* \| *DEFAULT* \| *DOCUMENT* \| *DOMWINDOW* \| *ESC_HTML_ALL* \| *ESC_HTML_QUOT* \| *ESC_HTML_QUOT_ONLY* \| *ESC_REGEXP_LF* \| *ESC_REGEXP_SLASH* \| *EXTERNAL* \| *FF* \| *FF_78* \| *FF_83* \| *FF_ESR* \| *FF_PREV* \| *FF_SRC* \| *FILL* \| *FLAT* \| *FROM_CODE_POINT* \| *FUNCTION_19_LF* \| *FUNCTION_22_LF* \| *GLOBAL_UNDEFINED* \| *GMT* \| *HISTORY* \| *HTMLAUDIOELEMENT* \| *HTMLDOCUMENT* \| *IE_10* \| *IE_11* \| *IE_11_WIN_10* \| *IE_9* \| *IE_SRC* \| *INCR_CHAR* \| *INTL* \| *LOCALE_INFINITY* \| *LOCALE_NUMERALS* \| *LOCALE_NUMERALS_EXT* \| *NAME* \| *NODECONSTRUCTOR* \| *NODE_0_10* \| *NODE_0_12* \| *NODE_10* \| *NODE_11* \| *NODE_12* \| *NODE_13* \| *NODE_15* \| *NODE_4* \| *NODE_5* \| *NO_FF_SRC* \| *NO_IE_SRC* \| *NO_OLD_SAFARI_ARRAY_ITERATOR* \| *NO_V8_SRC* \| *OBJECT_UNDEFINED* \| *PLAIN_INTL* \| *REGEXP_STRING_ITERATOR* \| *SAFARI* \| *SAFARI_10* \| *SAFARI_12* \| *SAFARI_13* \| *SAFARI_14_0_1* \| *SAFARI_7_0* \| *SAFARI_7_1* \| *SAFARI_8* \| *SAFARI_9* \| *SELF* \| *SELF_OBJ* \| *SHORT_LOCALES* \| *STATUS* \| *UNDEFINED* \| *V8_SRC* \| *WINDOW* |   A name or alias of a predefined feature.    |

**Returns:** *string*
