
# JScrewIt

## Index

### Namespaces

* ["jscrewit"](README.md#export-assignment-jscrewit)

## Namespaces

### `Export assignment` "jscrewit"

• **"jscrewit"**:

###  CustomFeature

• **CustomFeature**:

###  Feature

• **Feature**: *[FeatureConstructor](README.md#featureconstructor)*

###  canonicalNames

• **canonicalNames**: *[ElementaryFeatureName](README.md#elementaryfeaturename)[]*

*Inherited from [CustomFeature](README.md#customfeature).[canonicalNames](README.md#canonicalnames)*

An array of all elementary feature names included in this feature object, without aliases
and implied features.

### `Optional` description

• **description**? : *undefined | string*

*Inherited from [CustomFeature](README.md#customfeature).[description](README.md#optional-description)*

A short description of this feature object in plain English.

All predefined features have a description.
If desired, custom features may be assigned a description, too.

###  elementary

• **elementary**: *false*

*Overrides [Feature](README.md#feature).[elementary](README.md#elementary)*

###  elementaryNames

• **elementaryNames**: *[ElementaryFeatureName](README.md#elementaryfeaturename)[]*

*Inherited from [CustomFeature](README.md#customfeature).[elementaryNames](README.md#elementarynames)*

An array of all elementary feature names included in this feature object, without
aliases.

### `Optional` name

• **name**? : *undefined | string*

*Inherited from [CustomFeature](README.md#customfeature).[name](README.md#optional-name)*

The primary name of this feature object, useful for identification purpose.

All predefined features have a name.
If desired, custom features may be assigned a name, too.

###  includes

▸ **includes**(...`features`: [Feature](README.md#feature) | "ANY_DOCUMENT" | "ANY_WINDOW" | "ARRAY_ITERATOR" | "ARROW" | "ATOB" | "BARPROP" | "CAPITAL_HTML" | "CONSOLE" | "DOCUMENT" | "DOMWINDOW" | "ESC_HTML_ALL" | "ESC_HTML_QUOT" | "ESC_HTML_QUOT_ONLY" | "ESC_REGEXP_LF" | "ESC_REGEXP_SLASH" | "EXTERNAL" | "FF_SRC" | "FILL" | "FLAT" | "FROM_CODE_POINT" | "FUNCTION_19_LF" | "FUNCTION_22_LF" | "GMT" | "HISTORY" | "HTMLAUDIOELEMENT" | "HTMLDOCUMENT" | "IE_SRC" | "INCR_CHAR" | "INTL" | "LOCALE_INFINITY" | "NAME" | "NODECONSTRUCTOR" | "NO_FF_SRC" | "NO_IE_SRC" | "NO_OLD_SAFARI_ARRAY_ITERATOR" | "NO_V8_SRC" | "SELF_OBJ" | "STATUS" | "UNDEFINED" | "UNEVAL" | "V8_SRC" | "WINDOW" | "ANDRO_4_0" | "ANDRO_4_1" | "ANDRO_4_4" | "AUTO" | "BROWSER" | "CHROME_73" | "COMPACT" | "DEFAULT" | "FF_62" | "IE_10" | "IE_11" | "IE_11_WIN_10" | "IE_9" | "NODE_0_10" | "NODE_0_12" | "NODE_10" | "NODE_11" | "NODE_12" | "NODE_4" | "NODE_5" | "SAFARI_10" | "SAFARI_12" | "SAFARI_7_0" | "SAFARI_7_1" | "SAFARI_9" | "CHROME" | "CHROME_PREV" | "FF" | "FF_ESR" | "SAFARI" | "SAFARI_8" | "SELF" | ReadonlyArray‹[Feature](README.md#feature) | "ANY_DOCUMENT" | "ANY_WINDOW" | "ARRAY_ITERATOR" | "ARROW" | "ATOB" | "BARPROP" | "CAPITAL_HTML" | "CONSOLE" | "DOCUMENT" | "DOMWINDOW" | "ESC_HTML_ALL" | "ESC_HTML_QUOT" | "ESC_HTML_QUOT_ONLY" | "ESC_REGEXP_LF" | "ESC_REGEXP_SLASH" | "EXTERNAL" | "FF_SRC" | "FILL" | "FLAT" | "FROM_CODE_POINT" | "FUNCTION_19_LF" | "FUNCTION_22_LF" | "GMT" | "HISTORY" | "HTMLAUDIOELEMENT" | "HTMLDOCUMENT" | "IE_SRC" | "INCR_CHAR" | "INTL" | "LOCALE_INFINITY" | "NAME" | "NODECONSTRUCTOR" | "NO_FF_SRC" | "NO_IE_SRC" | "NO_OLD_SAFARI_ARRAY_ITERATOR" | "NO_V8_SRC" | "SELF_OBJ" | "STATUS" | "UNDEFINED" | "UNEVAL" | "V8_SRC" | "WINDOW" | "ANDRO_4_0" | "ANDRO_4_1" | "ANDRO_4_4" | "AUTO" | "BROWSER" | "CHROME_73" | "COMPACT" | "DEFAULT" | "FF_62" | "IE_10" | "IE_11" | "IE_11_WIN_10" | "IE_9" | "NODE_0_10" | "NODE_0_12" | "NODE_10" | "NODE_11" | "NODE_12" | "NODE_4" | "NODE_5" | "SAFARI_10" | "SAFARI_12" | "SAFARI_7_0" | "SAFARI_7_1" | "SAFARI_9" | "CHROME" | "CHROME_PREV" | "FF" | "FF_ESR" | "SAFARI" | "SAFARI_8" | "SELF"›[]): *boolean*

*Inherited from [CustomFeature](README.md#customfeature).[includes](README.md#includes)*

Determines whether this feature object includes all of the specified features.

**Parameters:**

Name | Type |
------ | ------ |
`...features` | [Feature](README.md#feature) &#124; "ANY_DOCUMENT" &#124; "ANY_WINDOW" &#124; "ARRAY_ITERATOR" &#124; "ARROW" &#124; "ATOB" &#124; "BARPROP" &#124; "CAPITAL_HTML" &#124; "CONSOLE" &#124; "DOCUMENT" &#124; "DOMWINDOW" &#124; "ESC_HTML_ALL" &#124; "ESC_HTML_QUOT" &#124; "ESC_HTML_QUOT_ONLY" &#124; "ESC_REGEXP_LF" &#124; "ESC_REGEXP_SLASH" &#124; "EXTERNAL" &#124; "FF_SRC" &#124; "FILL" &#124; "FLAT" &#124; "FROM_CODE_POINT" &#124; "FUNCTION_19_LF" &#124; "FUNCTION_22_LF" &#124; "GMT" &#124; "HISTORY" &#124; "HTMLAUDIOELEMENT" &#124; "HTMLDOCUMENT" &#124; "IE_SRC" &#124; "INCR_CHAR" &#124; "INTL" &#124; "LOCALE_INFINITY" &#124; "NAME" &#124; "NODECONSTRUCTOR" &#124; "NO_FF_SRC" &#124; "NO_IE_SRC" &#124; "NO_OLD_SAFARI_ARRAY_ITERATOR" &#124; "NO_V8_SRC" &#124; "SELF_OBJ" &#124; "STATUS" &#124; "UNDEFINED" &#124; "UNEVAL" &#124; "V8_SRC" &#124; "WINDOW" &#124; "ANDRO_4_0" &#124; "ANDRO_4_1" &#124; "ANDRO_4_4" &#124; "AUTO" &#124; "BROWSER" &#124; "CHROME_73" &#124; "COMPACT" &#124; "DEFAULT" &#124; "FF_62" &#124; "IE_10" &#124; "IE_11" &#124; "IE_11_WIN_10" &#124; "IE_9" &#124; "NODE_0_10" &#124; "NODE_0_12" &#124; "NODE_10" &#124; "NODE_11" &#124; "NODE_12" &#124; "NODE_4" &#124; "NODE_5" &#124; "SAFARI_10" &#124; "SAFARI_12" &#124; "SAFARI_7_0" &#124; "SAFARI_7_1" &#124; "SAFARI_9" &#124; "CHROME" &#124; "CHROME_PREV" &#124; "FF" &#124; "FF_ESR" &#124; "SAFARI" &#124; "SAFARI_8" &#124; "SELF" &#124; ReadonlyArray‹[Feature](README.md#feature) &#124; "ANY_DOCUMENT" &#124; "ANY_WINDOW" &#124; "ARRAY_ITERATOR" &#124; "ARROW" &#124; "ATOB" &#124; "BARPROP" &#124; "CAPITAL_HTML" &#124; "CONSOLE" &#124; "DOCUMENT" &#124; "DOMWINDOW" &#124; "ESC_HTML_ALL" &#124; "ESC_HTML_QUOT" &#124; "ESC_HTML_QUOT_ONLY" &#124; "ESC_REGEXP_LF" &#124; "ESC_REGEXP_SLASH" &#124; "EXTERNAL" &#124; "FF_SRC" &#124; "FILL" &#124; "FLAT" &#124; "FROM_CODE_POINT" &#124; "FUNCTION_19_LF" &#124; "FUNCTION_22_LF" &#124; "GMT" &#124; "HISTORY" &#124; "HTMLAUDIOELEMENT" &#124; "HTMLDOCUMENT" &#124; "IE_SRC" &#124; "INCR_CHAR" &#124; "INTL" &#124; "LOCALE_INFINITY" &#124; "NAME" &#124; "NODECONSTRUCTOR" &#124; "NO_FF_SRC" &#124; "NO_IE_SRC" &#124; "NO_OLD_SAFARI_ARRAY_ITERATOR" &#124; "NO_V8_SRC" &#124; "SELF_OBJ" &#124; "STATUS" &#124; "UNDEFINED" &#124; "UNEVAL" &#124; "V8_SRC" &#124; "WINDOW" &#124; "ANDRO_4_0" &#124; "ANDRO_4_1" &#124; "ANDRO_4_4" &#124; "AUTO" &#124; "BROWSER" &#124; "CHROME_73" &#124; "COMPACT" &#124; "DEFAULT" &#124; "FF_62" &#124; "IE_10" &#124; "IE_11" &#124; "IE_11_WIN_10" &#124; "IE_9" &#124; "NODE_0_10" &#124; "NODE_0_12" &#124; "NODE_10" &#124; "NODE_11" &#124; "NODE_12" &#124; "NODE_4" &#124; "NODE_5" &#124; "SAFARI_10" &#124; "SAFARI_12" &#124; "SAFARI_7_0" &#124; "SAFARI_7_1" &#124; "SAFARI_9" &#124; "CHROME" &#124; "CHROME_PREV" &#124; "FF" &#124; "FF_ESR" &#124; "SAFARI" &#124; "SAFARI_8" &#124; "SELF"›[] |

**Returns:** *boolean*

`true` if this feature object includes all of the specified features; otherwise, `false`.
If no arguments are specified, the return value is `true`.

###  restrict

▸ **restrict**(`environment`: "forced-strict-mode" | "web-worker", `engineFeatureObjs?`: keyof PredefinedFeature[]): *[CustomFeature](README.md#customfeature)*

*Inherited from [CustomFeature](README.md#customfeature).[restrict](README.md#restrict)*

Creates a new feature object from this feature by removing elementary features that are
not available inside a particular environment.

This method is useful to selectively exclude features that are not available inside a web
worker.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`environment` | "forced-strict-mode" &#124; "web-worker" |   The environment to which this feature should be restricted. Two environments are currently supported.  <dl>  <dt><code>"forced-strict-mode"</code></dt> <dd> Removes features that are not available in environments that require strict mode code. </dd>  <dt><code>"web-worker"</code></dt> <dd>Removes features that are not available inside web workers.</dd>  </dl>  |
`engineFeatureObjs?` | keyof PredefinedFeature[] |   An array of predefined feature objects, each corresponding to a particular engine in which the restriction should be enacted. If this parameter is omitted, the restriction is enacted in all engines.  |

**Returns:** *[CustomFeature](README.md#customfeature)*

###  ElementaryFeature

• **ElementaryFeature**:

###  canonicalNames

• **canonicalNames**: *[ElementaryFeatureName](README.md#elementaryfeaturename)[]*

*Inherited from [CustomFeature](README.md#customfeature).[canonicalNames](README.md#canonicalnames)*

An array of all elementary feature names included in this feature object, without aliases
and implied features.

###  description

• **description**: *string*

*Inherited from [ElementaryFeature](README.md#elementaryfeature).[description](README.md#description)*

*Overrides [CustomFeature](README.md#customfeature).[description](README.md#optional-description)*

###  elementary

• **elementary**: *true*

*Overrides [Feature](README.md#feature).[elementary](README.md#elementary)*

###  elementaryNames

• **elementaryNames**: *[ElementaryFeatureName](README.md#elementaryfeaturename)[]*

*Inherited from [CustomFeature](README.md#customfeature).[elementaryNames](README.md#elementarynames)*

An array of all elementary feature names included in this feature object, without
aliases.

###  name

• **name**: *[ElementaryFeatureName](README.md#elementaryfeaturename)*

*Overrides [PredefinedFeature](README.md#predefinedfeature).[name](README.md#name)*

###  includes

▸ **includes**(...`features`: [Feature](README.md#feature) | "ANY_DOCUMENT" | "ANY_WINDOW" | "ARRAY_ITERATOR" | "ARROW" | "ATOB" | "BARPROP" | "CAPITAL_HTML" | "CONSOLE" | "DOCUMENT" | "DOMWINDOW" | "ESC_HTML_ALL" | "ESC_HTML_QUOT" | "ESC_HTML_QUOT_ONLY" | "ESC_REGEXP_LF" | "ESC_REGEXP_SLASH" | "EXTERNAL" | "FF_SRC" | "FILL" | "FLAT" | "FROM_CODE_POINT" | "FUNCTION_19_LF" | "FUNCTION_22_LF" | "GMT" | "HISTORY" | "HTMLAUDIOELEMENT" | "HTMLDOCUMENT" | "IE_SRC" | "INCR_CHAR" | "INTL" | "LOCALE_INFINITY" | "NAME" | "NODECONSTRUCTOR" | "NO_FF_SRC" | "NO_IE_SRC" | "NO_OLD_SAFARI_ARRAY_ITERATOR" | "NO_V8_SRC" | "SELF_OBJ" | "STATUS" | "UNDEFINED" | "UNEVAL" | "V8_SRC" | "WINDOW" | "ANDRO_4_0" | "ANDRO_4_1" | "ANDRO_4_4" | "AUTO" | "BROWSER" | "CHROME_73" | "COMPACT" | "DEFAULT" | "FF_62" | "IE_10" | "IE_11" | "IE_11_WIN_10" | "IE_9" | "NODE_0_10" | "NODE_0_12" | "NODE_10" | "NODE_11" | "NODE_12" | "NODE_4" | "NODE_5" | "SAFARI_10" | "SAFARI_12" | "SAFARI_7_0" | "SAFARI_7_1" | "SAFARI_9" | "CHROME" | "CHROME_PREV" | "FF" | "FF_ESR" | "SAFARI" | "SAFARI_8" | "SELF" | ReadonlyArray‹[Feature](README.md#feature) | "ANY_DOCUMENT" | "ANY_WINDOW" | "ARRAY_ITERATOR" | "ARROW" | "ATOB" | "BARPROP" | "CAPITAL_HTML" | "CONSOLE" | "DOCUMENT" | "DOMWINDOW" | "ESC_HTML_ALL" | "ESC_HTML_QUOT" | "ESC_HTML_QUOT_ONLY" | "ESC_REGEXP_LF" | "ESC_REGEXP_SLASH" | "EXTERNAL" | "FF_SRC" | "FILL" | "FLAT" | "FROM_CODE_POINT" | "FUNCTION_19_LF" | "FUNCTION_22_LF" | "GMT" | "HISTORY" | "HTMLAUDIOELEMENT" | "HTMLDOCUMENT" | "IE_SRC" | "INCR_CHAR" | "INTL" | "LOCALE_INFINITY" | "NAME" | "NODECONSTRUCTOR" | "NO_FF_SRC" | "NO_IE_SRC" | "NO_OLD_SAFARI_ARRAY_ITERATOR" | "NO_V8_SRC" | "SELF_OBJ" | "STATUS" | "UNDEFINED" | "UNEVAL" | "V8_SRC" | "WINDOW" | "ANDRO_4_0" | "ANDRO_4_1" | "ANDRO_4_4" | "AUTO" | "BROWSER" | "CHROME_73" | "COMPACT" | "DEFAULT" | "FF_62" | "IE_10" | "IE_11" | "IE_11_WIN_10" | "IE_9" | "NODE_0_10" | "NODE_0_12" | "NODE_10" | "NODE_11" | "NODE_12" | "NODE_4" | "NODE_5" | "SAFARI_10" | "SAFARI_12" | "SAFARI_7_0" | "SAFARI_7_1" | "SAFARI_9" | "CHROME" | "CHROME_PREV" | "FF" | "FF_ESR" | "SAFARI" | "SAFARI_8" | "SELF"›[]): *boolean*

*Inherited from [CustomFeature](README.md#customfeature).[includes](README.md#includes)*

Determines whether this feature object includes all of the specified features.

**Parameters:**

Name | Type |
------ | ------ |
`...features` | [Feature](README.md#feature) &#124; "ANY_DOCUMENT" &#124; "ANY_WINDOW" &#124; "ARRAY_ITERATOR" &#124; "ARROW" &#124; "ATOB" &#124; "BARPROP" &#124; "CAPITAL_HTML" &#124; "CONSOLE" &#124; "DOCUMENT" &#124; "DOMWINDOW" &#124; "ESC_HTML_ALL" &#124; "ESC_HTML_QUOT" &#124; "ESC_HTML_QUOT_ONLY" &#124; "ESC_REGEXP_LF" &#124; "ESC_REGEXP_SLASH" &#124; "EXTERNAL" &#124; "FF_SRC" &#124; "FILL" &#124; "FLAT" &#124; "FROM_CODE_POINT" &#124; "FUNCTION_19_LF" &#124; "FUNCTION_22_LF" &#124; "GMT" &#124; "HISTORY" &#124; "HTMLAUDIOELEMENT" &#124; "HTMLDOCUMENT" &#124; "IE_SRC" &#124; "INCR_CHAR" &#124; "INTL" &#124; "LOCALE_INFINITY" &#124; "NAME" &#124; "NODECONSTRUCTOR" &#124; "NO_FF_SRC" &#124; "NO_IE_SRC" &#124; "NO_OLD_SAFARI_ARRAY_ITERATOR" &#124; "NO_V8_SRC" &#124; "SELF_OBJ" &#124; "STATUS" &#124; "UNDEFINED" &#124; "UNEVAL" &#124; "V8_SRC" &#124; "WINDOW" &#124; "ANDRO_4_0" &#124; "ANDRO_4_1" &#124; "ANDRO_4_4" &#124; "AUTO" &#124; "BROWSER" &#124; "CHROME_73" &#124; "COMPACT" &#124; "DEFAULT" &#124; "FF_62" &#124; "IE_10" &#124; "IE_11" &#124; "IE_11_WIN_10" &#124; "IE_9" &#124; "NODE_0_10" &#124; "NODE_0_12" &#124; "NODE_10" &#124; "NODE_11" &#124; "NODE_12" &#124; "NODE_4" &#124; "NODE_5" &#124; "SAFARI_10" &#124; "SAFARI_12" &#124; "SAFARI_7_0" &#124; "SAFARI_7_1" &#124; "SAFARI_9" &#124; "CHROME" &#124; "CHROME_PREV" &#124; "FF" &#124; "FF_ESR" &#124; "SAFARI" &#124; "SAFARI_8" &#124; "SELF" &#124; ReadonlyArray‹[Feature](README.md#feature) &#124; "ANY_DOCUMENT" &#124; "ANY_WINDOW" &#124; "ARRAY_ITERATOR" &#124; "ARROW" &#124; "ATOB" &#124; "BARPROP" &#124; "CAPITAL_HTML" &#124; "CONSOLE" &#124; "DOCUMENT" &#124; "DOMWINDOW" &#124; "ESC_HTML_ALL" &#124; "ESC_HTML_QUOT" &#124; "ESC_HTML_QUOT_ONLY" &#124; "ESC_REGEXP_LF" &#124; "ESC_REGEXP_SLASH" &#124; "EXTERNAL" &#124; "FF_SRC" &#124; "FILL" &#124; "FLAT" &#124; "FROM_CODE_POINT" &#124; "FUNCTION_19_LF" &#124; "FUNCTION_22_LF" &#124; "GMT" &#124; "HISTORY" &#124; "HTMLAUDIOELEMENT" &#124; "HTMLDOCUMENT" &#124; "IE_SRC" &#124; "INCR_CHAR" &#124; "INTL" &#124; "LOCALE_INFINITY" &#124; "NAME" &#124; "NODECONSTRUCTOR" &#124; "NO_FF_SRC" &#124; "NO_IE_SRC" &#124; "NO_OLD_SAFARI_ARRAY_ITERATOR" &#124; "NO_V8_SRC" &#124; "SELF_OBJ" &#124; "STATUS" &#124; "UNDEFINED" &#124; "UNEVAL" &#124; "V8_SRC" &#124; "WINDOW" &#124; "ANDRO_4_0" &#124; "ANDRO_4_1" &#124; "ANDRO_4_4" &#124; "AUTO" &#124; "BROWSER" &#124; "CHROME_73" &#124; "COMPACT" &#124; "DEFAULT" &#124; "FF_62" &#124; "IE_10" &#124; "IE_11" &#124; "IE_11_WIN_10" &#124; "IE_9" &#124; "NODE_0_10" &#124; "NODE_0_12" &#124; "NODE_10" &#124; "NODE_11" &#124; "NODE_12" &#124; "NODE_4" &#124; "NODE_5" &#124; "SAFARI_10" &#124; "SAFARI_12" &#124; "SAFARI_7_0" &#124; "SAFARI_7_1" &#124; "SAFARI_9" &#124; "CHROME" &#124; "CHROME_PREV" &#124; "FF" &#124; "FF_ESR" &#124; "SAFARI" &#124; "SAFARI_8" &#124; "SELF"›[] |

**Returns:** *boolean*

`true` if this feature object includes all of the specified features; otherwise, `false`.
If no arguments are specified, the return value is `true`.

###  restrict

▸ **restrict**(`environment`: "forced-strict-mode" | "web-worker", `engineFeatureObjs?`: keyof PredefinedFeature[]): *[CustomFeature](README.md#customfeature)*

*Inherited from [CustomFeature](README.md#customfeature).[restrict](README.md#restrict)*

Creates a new feature object from this feature by removing elementary features that are
not available inside a particular environment.

This method is useful to selectively exclude features that are not available inside a web
worker.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`environment` | "forced-strict-mode" &#124; "web-worker" |   The environment to which this feature should be restricted. Two environments are currently supported.  <dl>  <dt><code>"forced-strict-mode"</code></dt> <dd> Removes features that are not available in environments that require strict mode code. </dd>  <dt><code>"web-worker"</code></dt> <dd>Removes features that are not available inside web workers.</dd>  </dl>  |
`engineFeatureObjs?` | keyof PredefinedFeature[] |   An array of predefined feature objects, each corresponding to a particular engine in which the restriction should be enacted. If this parameter is omitted, the restriction is enacted in all engines.  |

**Returns:** *[CustomFeature](README.md#customfeature)*

###  EncodeOptions

• **EncodeOptions**:

### `Optional` features

• **features**? : *[FeatureElement](README.md#featureelement) | [CompatibleFeatureArray](README.md#compatiblefeaturearray)*

Specifies the features available in the engines that evaluate the encoded output.

If this parameter is unspecified, <code>[JScrewIt.Feature.DEFAULT](README.md#default)</code> is
assumed: this ensures maximum compatibility but also generates the largest code.
To generate shorter code, specify all features available in all target engines
explicitly.

### `Optional` runAs

• **runAs**? : *"call" | "eval" | "express" | "express-call" | "express-eval" | "none"*

This option controls the type of code generated from the given input.
Allowed values are listed below.

<dl>

<dt><code>"call"</code></dt>
<dd>
Produces code evaluating to a call to a function whose body contains the specified input
string.
</dd>

<dt><code>"eval"</code></dt>
<dd>
Produces code evaluating to the result of invoking <code>eval</code> with the specified
input string as parameter.
</dd>

<dt><code>"express"</code></dt>
<dd>
Attempts to interpret the specified string as JavaScript code and produce functionally
equivalent JSFuck code.
Fails if the specified string cannot be expressed as JavaScript, or if no functionally
equivalent JSFuck code can be generated.
</dd>

<dt><code>"express-call"</code></dt>
<dd>
Applies the code generation process of both <code>"express"</code> and
<code>"call"</code> and returns the shortest output.
</dd>

<dt><code>"express-eval"</code> (default)</dt>
<dd>
Applies the code generation process of both <code>"express"</code> and
<code>"eval"</code> and returns the shortest output.
</dd>

<dt><code>"none"</code></dt>
<dd>
Produces JSFuck code that translates to the specified input string (except for trimmed
parts when used in conjunction with the option <code>trimCode</code>).
Unlike other methods, <code>"none"</code> does not generate executable code, but rather a
plain string.
</dd>

</dl>

### `Optional` trimCode

• **trimCode**? : *undefined | false | true*

If this parameter is truthy, lines in the beginning and in the end of the file containing
nothing but space characters and JavaScript comments are removed from the generated
output.
A newline terminator in the last preserved line is also removed.

This option is especially useful to strip banner comments and trailing newline characters
which are sometimes found in minified scripts.

Using this option may produce unexpected results if the input is not well-formed
JavaScript code.

### `Optional` wrapWith

• **wrapWith**? : *"call" | "eval" | "express" | "express-call" | "express-eval" | "none"*

An alias for `runAs`.

###  Feature

• **Feature**:

Objects of this type indicate which of the capabilities that JScrewIt can use to minimize the
length of its output are available in a particular JavaScript engine.

JScrewIt comes with a set of predefined feature objects exposed as property values of
`JScrewIt.Feature` or <code>[JScrewIt.Feature.ALL](README.md#all)</code>, where the property name is
the feature's name or an alias thereof.

Besides these predefined features, it is possible to construct custom features from the union
or intersection of other features.

Among the predefined features, there are some special ones called *elementary* features.
Elementary features either cannot be expressed as a union of any number of other features, or
they are different from such a union in that they exclude some other feature not excluded by
their elementary components.
All other features, called *composite* features, can be constructed as a union of zero or
more elementary features.
Two of the predefined composite features are particularly important: <code>[DEFAULT](README.md#default)</code>
is the empty feature, indicating that no elementary feature is available at all;
<code>[AUTO](README.md#auto)</code> is the union of all elementary features available in the current
engine.

Not all features can be available at the same time: some features are necessarily
incompatible, meaning that they mutually exclude each other, and thus their union cannot be
constructed.

###  canonicalNames

• **canonicalNames**: *[ElementaryFeatureName](README.md#elementaryfeaturename)[]*

An array of all elementary feature names included in this feature object, without aliases
and implied features.

### `Optional` description

• **description**? : *undefined | string*

A short description of this feature object in plain English.

All predefined features have a description.
If desired, custom features may be assigned a description, too.

###  elementary

• **elementary**: *boolean*

A boolean value indicating whether this is an elementary feature object.

###  elementaryNames

• **elementaryNames**: *[ElementaryFeatureName](README.md#elementaryfeaturename)[]*

An array of all elementary feature names included in this feature object, without
aliases.

### `Optional` name

• **name**? : *undefined | string*

The primary name of this feature object, useful for identification purpose.

All predefined features have a name.
If desired, custom features may be assigned a name, too.

###  includes

▸ **includes**(...`features`: [Feature](README.md#feature) | "ANY_DOCUMENT" | "ANY_WINDOW" | "ARRAY_ITERATOR" | "ARROW" | "ATOB" | "BARPROP" | "CAPITAL_HTML" | "CONSOLE" | "DOCUMENT" | "DOMWINDOW" | "ESC_HTML_ALL" | "ESC_HTML_QUOT" | "ESC_HTML_QUOT_ONLY" | "ESC_REGEXP_LF" | "ESC_REGEXP_SLASH" | "EXTERNAL" | "FF_SRC" | "FILL" | "FLAT" | "FROM_CODE_POINT" | "FUNCTION_19_LF" | "FUNCTION_22_LF" | "GMT" | "HISTORY" | "HTMLAUDIOELEMENT" | "HTMLDOCUMENT" | "IE_SRC" | "INCR_CHAR" | "INTL" | "LOCALE_INFINITY" | "NAME" | "NODECONSTRUCTOR" | "NO_FF_SRC" | "NO_IE_SRC" | "NO_OLD_SAFARI_ARRAY_ITERATOR" | "NO_V8_SRC" | "SELF_OBJ" | "STATUS" | "UNDEFINED" | "UNEVAL" | "V8_SRC" | "WINDOW" | "ANDRO_4_0" | "ANDRO_4_1" | "ANDRO_4_4" | "AUTO" | "BROWSER" | "CHROME_73" | "COMPACT" | "DEFAULT" | "FF_62" | "IE_10" | "IE_11" | "IE_11_WIN_10" | "IE_9" | "NODE_0_10" | "NODE_0_12" | "NODE_10" | "NODE_11" | "NODE_12" | "NODE_4" | "NODE_5" | "SAFARI_10" | "SAFARI_12" | "SAFARI_7_0" | "SAFARI_7_1" | "SAFARI_9" | "CHROME" | "CHROME_PREV" | "FF" | "FF_ESR" | "SAFARI" | "SAFARI_8" | "SELF" | ReadonlyArray‹[Feature](README.md#feature) | "ANY_DOCUMENT" | "ANY_WINDOW" | "ARRAY_ITERATOR" | "ARROW" | "ATOB" | "BARPROP" | "CAPITAL_HTML" | "CONSOLE" | "DOCUMENT" | "DOMWINDOW" | "ESC_HTML_ALL" | "ESC_HTML_QUOT" | "ESC_HTML_QUOT_ONLY" | "ESC_REGEXP_LF" | "ESC_REGEXP_SLASH" | "EXTERNAL" | "FF_SRC" | "FILL" | "FLAT" | "FROM_CODE_POINT" | "FUNCTION_19_LF" | "FUNCTION_22_LF" | "GMT" | "HISTORY" | "HTMLAUDIOELEMENT" | "HTMLDOCUMENT" | "IE_SRC" | "INCR_CHAR" | "INTL" | "LOCALE_INFINITY" | "NAME" | "NODECONSTRUCTOR" | "NO_FF_SRC" | "NO_IE_SRC" | "NO_OLD_SAFARI_ARRAY_ITERATOR" | "NO_V8_SRC" | "SELF_OBJ" | "STATUS" | "UNDEFINED" | "UNEVAL" | "V8_SRC" | "WINDOW" | "ANDRO_4_0" | "ANDRO_4_1" | "ANDRO_4_4" | "AUTO" | "BROWSER" | "CHROME_73" | "COMPACT" | "DEFAULT" | "FF_62" | "IE_10" | "IE_11" | "IE_11_WIN_10" | "IE_9" | "NODE_0_10" | "NODE_0_12" | "NODE_10" | "NODE_11" | "NODE_12" | "NODE_4" | "NODE_5" | "SAFARI_10" | "SAFARI_12" | "SAFARI_7_0" | "SAFARI_7_1" | "SAFARI_9" | "CHROME" | "CHROME_PREV" | "FF" | "FF_ESR" | "SAFARI" | "SAFARI_8" | "SELF"›[]): *boolean*

Determines whether this feature object includes all of the specified features.

**Parameters:**

Name | Type |
------ | ------ |
`...features` | [Feature](README.md#feature) &#124; "ANY_DOCUMENT" &#124; "ANY_WINDOW" &#124; "ARRAY_ITERATOR" &#124; "ARROW" &#124; "ATOB" &#124; "BARPROP" &#124; "CAPITAL_HTML" &#124; "CONSOLE" &#124; "DOCUMENT" &#124; "DOMWINDOW" &#124; "ESC_HTML_ALL" &#124; "ESC_HTML_QUOT" &#124; "ESC_HTML_QUOT_ONLY" &#124; "ESC_REGEXP_LF" &#124; "ESC_REGEXP_SLASH" &#124; "EXTERNAL" &#124; "FF_SRC" &#124; "FILL" &#124; "FLAT" &#124; "FROM_CODE_POINT" &#124; "FUNCTION_19_LF" &#124; "FUNCTION_22_LF" &#124; "GMT" &#124; "HISTORY" &#124; "HTMLAUDIOELEMENT" &#124; "HTMLDOCUMENT" &#124; "IE_SRC" &#124; "INCR_CHAR" &#124; "INTL" &#124; "LOCALE_INFINITY" &#124; "NAME" &#124; "NODECONSTRUCTOR" &#124; "NO_FF_SRC" &#124; "NO_IE_SRC" &#124; "NO_OLD_SAFARI_ARRAY_ITERATOR" &#124; "NO_V8_SRC" &#124; "SELF_OBJ" &#124; "STATUS" &#124; "UNDEFINED" &#124; "UNEVAL" &#124; "V8_SRC" &#124; "WINDOW" &#124; "ANDRO_4_0" &#124; "ANDRO_4_1" &#124; "ANDRO_4_4" &#124; "AUTO" &#124; "BROWSER" &#124; "CHROME_73" &#124; "COMPACT" &#124; "DEFAULT" &#124; "FF_62" &#124; "IE_10" &#124; "IE_11" &#124; "IE_11_WIN_10" &#124; "IE_9" &#124; "NODE_0_10" &#124; "NODE_0_12" &#124; "NODE_10" &#124; "NODE_11" &#124; "NODE_12" &#124; "NODE_4" &#124; "NODE_5" &#124; "SAFARI_10" &#124; "SAFARI_12" &#124; "SAFARI_7_0" &#124; "SAFARI_7_1" &#124; "SAFARI_9" &#124; "CHROME" &#124; "CHROME_PREV" &#124; "FF" &#124; "FF_ESR" &#124; "SAFARI" &#124; "SAFARI_8" &#124; "SELF" &#124; ReadonlyArray‹[Feature](README.md#feature) &#124; "ANY_DOCUMENT" &#124; "ANY_WINDOW" &#124; "ARRAY_ITERATOR" &#124; "ARROW" &#124; "ATOB" &#124; "BARPROP" &#124; "CAPITAL_HTML" &#124; "CONSOLE" &#124; "DOCUMENT" &#124; "DOMWINDOW" &#124; "ESC_HTML_ALL" &#124; "ESC_HTML_QUOT" &#124; "ESC_HTML_QUOT_ONLY" &#124; "ESC_REGEXP_LF" &#124; "ESC_REGEXP_SLASH" &#124; "EXTERNAL" &#124; "FF_SRC" &#124; "FILL" &#124; "FLAT" &#124; "FROM_CODE_POINT" &#124; "FUNCTION_19_LF" &#124; "FUNCTION_22_LF" &#124; "GMT" &#124; "HISTORY" &#124; "HTMLAUDIOELEMENT" &#124; "HTMLDOCUMENT" &#124; "IE_SRC" &#124; "INCR_CHAR" &#124; "INTL" &#124; "LOCALE_INFINITY" &#124; "NAME" &#124; "NODECONSTRUCTOR" &#124; "NO_FF_SRC" &#124; "NO_IE_SRC" &#124; "NO_OLD_SAFARI_ARRAY_ITERATOR" &#124; "NO_V8_SRC" &#124; "SELF_OBJ" &#124; "STATUS" &#124; "UNDEFINED" &#124; "UNEVAL" &#124; "V8_SRC" &#124; "WINDOW" &#124; "ANDRO_4_0" &#124; "ANDRO_4_1" &#124; "ANDRO_4_4" &#124; "AUTO" &#124; "BROWSER" &#124; "CHROME_73" &#124; "COMPACT" &#124; "DEFAULT" &#124; "FF_62" &#124; "IE_10" &#124; "IE_11" &#124; "IE_11_WIN_10" &#124; "IE_9" &#124; "NODE_0_10" &#124; "NODE_0_12" &#124; "NODE_10" &#124; "NODE_11" &#124; "NODE_12" &#124; "NODE_4" &#124; "NODE_5" &#124; "SAFARI_10" &#124; "SAFARI_12" &#124; "SAFARI_7_0" &#124; "SAFARI_7_1" &#124; "SAFARI_9" &#124; "CHROME" &#124; "CHROME_PREV" &#124; "FF" &#124; "FF_ESR" &#124; "SAFARI" &#124; "SAFARI_8" &#124; "SELF"›[] |

**Returns:** *boolean*

`true` if this feature object includes all of the specified features; otherwise, `false`.
If no arguments are specified, the return value is `true`.

###  restrict

▸ **restrict**(`environment`: "forced-strict-mode" | "web-worker", `engineFeatureObjs?`: keyof PredefinedFeature[]): *[CustomFeature](README.md#customfeature)*

Creates a new feature object from this feature by removing elementary features that are
not available inside a particular environment.

This method is useful to selectively exclude features that are not available inside a web
worker.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`environment` | "forced-strict-mode" &#124; "web-worker" |   The environment to which this feature should be restricted. Two environments are currently supported.  <dl>  <dt><code>"forced-strict-mode"</code></dt> <dd> Removes features that are not available in environments that require strict mode code. </dd>  <dt><code>"web-worker"</code></dt> <dd>Removes features that are not available inside web workers.</dd>  </dl>  |
`engineFeatureObjs?` | keyof PredefinedFeature[] |   An array of predefined feature objects, each corresponding to a particular engine in which the restriction should be enacted. If this parameter is omitted, the restriction is enacted in all engines.  |

**Returns:** *[CustomFeature](README.md#customfeature)*

###  FeatureAll

• **FeatureAll**:

###  ANDRO_4_0

• **ANDRO_4_0**: *[PredefinedFeature](README.md#predefinedfeature)*

Features available in Android Browser 4.0.

###  ANDRO_4_1

• **ANDRO_4_1**: *[PredefinedFeature](README.md#predefinedfeature)*

Features available in Android Browser 4.1 to 4.3.

###  ANDRO_4_4

• **ANDRO_4_4**: *[PredefinedFeature](README.md#predefinedfeature)*

Features available in Android Browser 4.4.

###  ANY_DOCUMENT

• **ANY_DOCUMENT**: *[ElementaryFeature](README.md#elementaryfeature)*

Existence of the global object document whose string representation starts with "\[object " and ends with "Document\]".

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers.

###  ANY_WINDOW

• **ANY_WINDOW**: *[ElementaryFeature](README.md#elementaryfeature)*

Existence of the global object self whose string representation starts with "\[object " and ends with "Window\]".

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers.

###  ARRAY_ITERATOR

• **ARRAY_ITERATOR**: *[ElementaryFeature](README.md#elementaryfeature)*

The property that the string representation of Array.prototype.entries\(\) starts with "\[object Array" and ends with "\]" at index 21 or 22.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Safari 7.1+, Opera and Node.js 0.12+.

###  ARROW

• **ARROW**: *[ElementaryFeature](README.md#elementaryfeature)*

Support for arrow functions.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Safari 10+, Opera and Node.js 4+.

###  ATOB

• **ATOB**: *[ElementaryFeature](README.md#elementaryfeature)*

Existence of the global functions atob and btoa.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer 10+, Safari, Opera and Android Browser. This feature is not available inside web workers in Safari before 10.

###  AUTO

• **AUTO**: *[PredefinedFeature](README.md#predefinedfeature)*

All features available in the current engine.

###  BARPROP

• **BARPROP**: *[ElementaryFeature](README.md#elementaryfeature)*

Existence of the global object statusbar having the string representation "\[object BarProp\]".

**`reamarks`** 

Available in Chrome, Edge, Firefox, Safari, Opera and Android Browser 4.4. This feature is not available inside web workers.

###  BROWSER

• **BROWSER**: *[PredefinedFeature](README.md#predefinedfeature)*

Features available in all browsers.

No support for Node.js.

###  CAPITAL_HTML

• **CAPITAL_HTML**: *[ElementaryFeature](README.md#elementaryfeature)*

The property that the various string methods returning HTML code such as String.prototype.big or String.prototype.link have both the tag name and attributes written in capital letters.

**`reamarks`** 

Available in Internet Explorer.

###  CHROME

• **CHROME**: *[PredefinedFeature](README.md#predefinedfeature)*

An alias for `CHROME_73`.

###  CHROME_73

• **CHROME_73**: *[PredefinedFeature](README.md#predefinedfeature)*

Features available in Chrome 73, Edge 79 and Opera 60 or later.

###  CHROME_PREV

• **CHROME_PREV**: *[PredefinedFeature](README.md#predefinedfeature)*

An alias for `CHROME_73`.

###  COMPACT

• **COMPACT**: *[PredefinedFeature](README.md#predefinedfeature)*

All new browsers' features.

No support for Node.js and older browsers like Internet Explorer, Safari 9 or Android Browser.

###  CONSOLE

• **CONSOLE**: *[ElementaryFeature](README.md#elementaryfeature)*

Existence of the global object console having the string representation "\[object Console\]".

This feature may become unavailable when certain browser extensions are active.

**`reamarks`** 

Available in Firefox, Internet Explorer 10+, Safari and Android Browser. This feature is not available inside web workers in Safari before 7.1 and Android Browser 4.4.

###  DEFAULT

• **DEFAULT**: *[PredefinedFeature](README.md#predefinedfeature)*

Minimum feature level, compatible with all supported engines in all environments.

###  DOCUMENT

• **DOCUMENT**: *[ElementaryFeature](README.md#elementaryfeature)*

Existence of the global object document having the string representation "\[object Document\]".

**`reamarks`** 

Available in Internet Explorer before 11. This feature is not available inside web workers.

###  DOMWINDOW

• **DOMWINDOW**: *[ElementaryFeature](README.md#elementaryfeature)*

Existence of the global object self having the string representation "\[object DOMWindow\]".

**`reamarks`** 

Available in Android Browser before 4.4. This feature is not available inside web workers.

###  ESC_HTML_ALL

• **ESC_HTML_ALL**: *[ElementaryFeature](README.md#elementaryfeature)*

The property that double quotation mark, less than and greater than characters in the argument of String.prototype.fontcolor are escaped into their respective HTML entities.

**`reamarks`** 

Available in Android Browser and Node.js before 0.12.

###  ESC_HTML_QUOT

• **ESC_HTML_QUOT**: *[ElementaryFeature](README.md#elementaryfeature)*

The property that double quotation marks in the argument of String.prototype.fontcolor are escaped as "\&quot;".

**`reamarks`** 

Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser and Node.js.

###  ESC_HTML_QUOT_ONLY

• **ESC_HTML_QUOT_ONLY**: *[ElementaryFeature](README.md#elementaryfeature)*

The property that only double quotation marks and no other characters in the argument of String.prototype.fontcolor are escaped into HTML entities.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Safari, Opera and Node.js 0.12+.

###  ESC_REGEXP_LF

• **ESC_REGEXP_LF**: *[ElementaryFeature](README.md#elementaryfeature)*

Having regular expressions created with the RegExp constructor use escape sequences starting with a backslash to format line feed characters \("\\n"\) in their string representation.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Node.js 12+.

###  ESC_REGEXP_SLASH

• **ESC_REGEXP_SLASH**: *[ElementaryFeature](README.md#elementaryfeature)*

Having regular expressions created with the RegExp constructor use escape sequences starting with a backslash to format slashes \("/"\) in their string representation.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Node.js 4+.

###  EXTERNAL

• **EXTERNAL**: *[ElementaryFeature](README.md#elementaryfeature)*

Existence of the global object sidebar having the string representation "\[object External\]".

**`reamarks`** 

Available in Firefox. This feature is not available inside web workers.

###  FF

• **FF**: *[PredefinedFeature](README.md#predefinedfeature)*

An alias for `FF_62`.

###  FF_62

• **FF_62**: *[PredefinedFeature](README.md#predefinedfeature)*

Features available in Firefox 62 or later.

###  FF_ESR

• **FF_ESR**: *[PredefinedFeature](README.md#predefinedfeature)*

An alias for `FF_62`.

###  FF_SRC

• **FF_SRC**: *[ElementaryFeature](README.md#elementaryfeature)*

A string representation of native functions typical for Firefox and Safari.

Remarkable traits are the lack of line feed characters at the beginning and at the end of the string and the presence of a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.

**`reamarks`** 

Available in Firefox and Safari.

###  FILL

• **FILL**: *[ElementaryFeature](README.md#elementaryfeature)*

Existence of the native function Array.prototype.fill.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Safari 7.1+, Opera and Node.js 4+.

###  FLAT

• **FLAT**: *[ElementaryFeature](README.md#elementaryfeature)*

Existence of the native function Array.prototype.flat.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Safari 12+, Opera and Node.js 11+.

###  FROM_CODE_POINT

• **FROM_CODE_POINT**: *[ElementaryFeature](README.md#elementaryfeature)*

Existence of the function String.fromCodePoint.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Safari 9+, Opera and Node.js 4+.

###  FUNCTION_19_LF

• **FUNCTION_19_LF**: *[ElementaryFeature](README.md#elementaryfeature)*

A string representation of dynamically generated functions where the character at index 19 is a line feed \("\\n"\).

**`reamarks`** 

Available in Chrome, Edge, Firefox, Opera and Node.js 10+.

###  FUNCTION_22_LF

• **FUNCTION_22_LF**: *[ElementaryFeature](README.md#elementaryfeature)*

A string representation of dynamically generated functions where the character at index 22 is a line feed \("\\n"\).

**`reamarks`** 

Available in Internet Explorer, Safari 9+, Android Browser and Node.js before 10.

###  GMT

• **GMT**: *[ElementaryFeature](README.md#elementaryfeature)*

Presence of the text "GMT" after the first 25 characters in the string returned by Date\(\).

The string representation of dates is implementation dependent, but most engines use a similar format, making this feature available in all supported engines except Internet Explorer 9 and 10.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari, Opera, Android Browser and Node.js.

###  HISTORY

• **HISTORY**: *[ElementaryFeature](README.md#elementaryfeature)*

Existence of the global object history having the string representation "\[object History\]".

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers.

###  HTMLAUDIOELEMENT

• **HTMLAUDIOELEMENT**: *[ElementaryFeature](README.md#elementaryfeature)*

Existence of the global object Audio whose string representation starts with "function HTMLAudioElement".

**`reamarks`** 

Available in Android Browser 4.4. This feature is not available inside web workers.

###  HTMLDOCUMENT

• **HTMLDOCUMENT**: *[ElementaryFeature](README.md#elementaryfeature)*

Existence of the global object document having the string representation "\[object HTMLDocument\]".

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari, Opera and Android Browser. This feature is not available inside web workers.

###  IE_10

• **IE_10**: *[PredefinedFeature](README.md#predefinedfeature)*

Features available in Internet Explorer 10.

###  IE_11

• **IE_11**: *[PredefinedFeature](README.md#predefinedfeature)*

Features available in Internet Explorer 11.

###  IE_11_WIN_10

• **IE_11_WIN_10**: *[PredefinedFeature](README.md#predefinedfeature)*

Features available in Internet Explorer 11 on Windows 10.

###  IE_9

• **IE_9**: *[PredefinedFeature](README.md#predefinedfeature)*

Features available in Internet Explorer 9.

###  IE_SRC

• **IE_SRC**: *[ElementaryFeature](README.md#elementaryfeature)*

A string representation of native functions typical for Internet Explorer.

Remarkable traits are the presence of a line feed character \("\\n"\) at the beginning and at the end of the string and a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.

**`reamarks`** 

Available in Internet Explorer.

###  INCR_CHAR

• **INCR_CHAR**: *[ElementaryFeature](README.md#elementaryfeature)*

The ability to use unary increment operators with string characters, like in \( ++"some string"\[0\] \): this will result in a TypeError in strict mode in ECMAScript compliant engines.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, Android Browser and Node.js. This feature is not available when strict mode is enforced in Chrome, Edge, Firefox, Internet Explorer 10+, Safari, Opera and Node.js 5+.

###  INTL

• **INTL**: *[ElementaryFeature](README.md#elementaryfeature)*

Existence of the global object Intl.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari 10+, Opera, Android Browser 4.4 and Node.js 0.12+.

###  LOCALE_INFINITY

• **LOCALE_INFINITY**: *[ElementaryFeature](README.md#elementaryfeature)*

Language sensitive string representation of Infinity as "∞".

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer 11 on Windows 10, Safari 10+, Opera, Android Browser 4.4 and Node.js 0.12+.

###  NAME

• **NAME**: *[ElementaryFeature](README.md#elementaryfeature)*

Existence of the name property for functions.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser and Node.js.

###  NODECONSTRUCTOR

• **NODECONSTRUCTOR**: *[ElementaryFeature](README.md#elementaryfeature)*

Existence of the global object Node having the string representation "\[object NodeConstructor\]".

**`reamarks`** 

Available in Safari before 10. This feature is not available inside web workers.

###  NODE_0_10

• **NODE_0_10**: *[PredefinedFeature](README.md#predefinedfeature)*

Features available in Node.js 0.10.

###  NODE_0_12

• **NODE_0_12**: *[PredefinedFeature](README.md#predefinedfeature)*

Features available in Node.js 0.12.

###  NODE_10

• **NODE_10**: *[PredefinedFeature](README.md#predefinedfeature)*

Features available in Node.js 10.

###  NODE_11

• **NODE_11**: *[PredefinedFeature](README.md#predefinedfeature)*

Features available in Node.js 11.

###  NODE_12

• **NODE_12**: *[PredefinedFeature](README.md#predefinedfeature)*

Features available in Node.js 12 or later.

###  NODE_4

• **NODE_4**: *[PredefinedFeature](README.md#predefinedfeature)*

Features available in Node.js 4.

###  NODE_5

• **NODE_5**: *[PredefinedFeature](README.md#predefinedfeature)*

Features available in Node.js 5 to 9.

###  NO_FF_SRC

• **NO_FF_SRC**: *[ElementaryFeature](README.md#elementaryfeature)*

A string representation of native functions typical for V8 or for Internet Explorer but not for Firefox and Safari.

**`reamarks`** 

Available in Chrome, Edge, Internet Explorer, Opera, Android Browser and Node.js.

###  NO_IE_SRC

• **NO_IE_SRC**: *[ElementaryFeature](README.md#elementaryfeature)*

A string representation of native functions typical for most engines with the notable exception of Internet Explorer.

A remarkable trait of this feature is the lack of line feed characters at the beginning and at the end of the string.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser and Node.js.

###  NO_OLD_SAFARI_ARRAY_ITERATOR

• **NO_OLD_SAFARI_ARRAY_ITERATOR**: *[ElementaryFeature](README.md#elementaryfeature)*

The property that the string representation of Array.prototype.entries\(\) evaluates to "\[object Array Iterator\]".

**`reamarks`** 

Available in Chrome, Edge, Firefox, Safari 9+, Opera and Node.js 0.12+.

###  NO_V8_SRC

• **NO_V8_SRC**: *[ElementaryFeature](README.md#elementaryfeature)*

A string representation of native functions typical for Firefox, Internet Explorer and Safari.

A most remarkable trait of this feature is the presence of a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.

**`reamarks`** 

Available in Firefox, Internet Explorer and Safari.

###  SAFARI

• **SAFARI**: *[PredefinedFeature](README.md#predefinedfeature)*

An alias for `SAFARI_12`.

###  SAFARI_10

• **SAFARI_10**: *[PredefinedFeature](README.md#predefinedfeature)*

Features available in Safari 10 or later.

###  SAFARI_12

• **SAFARI_12**: *[PredefinedFeature](README.md#predefinedfeature)*

Features available in Safari 12 or later.

###  SAFARI_7_0

• **SAFARI_7_0**: *[PredefinedFeature](README.md#predefinedfeature)*

Features available in Safari 7.0.

###  SAFARI_7_1

• **SAFARI_7_1**: *[PredefinedFeature](README.md#predefinedfeature)*

Features available in Safari 7.1 and Safari 8.

###  SAFARI_8

• **SAFARI_8**: *[PredefinedFeature](README.md#predefinedfeature)*

An alias for `SAFARI_7_1`.

###  SAFARI_9

• **SAFARI_9**: *[PredefinedFeature](README.md#predefinedfeature)*

Features available in Safari 9.

###  SELF

• **SELF**: *[ElementaryFeature](README.md#elementaryfeature)*

An alias for `ANY_WINDOW`.

###  SELF_OBJ

• **SELF_OBJ**: *[ElementaryFeature](README.md#elementaryfeature)*

Existence of the global object self whose string representation starts with "\[object ".

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers in Safari 7.1+ before 10.

###  STATUS

• **STATUS**: *[ElementaryFeature](README.md#elementaryfeature)*

Existence of the global string status.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers.

###  UNDEFINED

• **UNDEFINED**: *[ElementaryFeature](README.md#elementaryfeature)*

The property that Object.prototype.toString.call\(\) evaluates to "\[object Undefined\]".

This behavior is specified by ECMAScript, and is enforced by all engines except Android Browser versions prior to 4.1.2, where this feature is not available.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, Android Browser 4.1+ and Node.js.

###  UNEVAL

• **UNEVAL**: *[ElementaryFeature](README.md#elementaryfeature)*

Existence of the global function uneval.

**`reamarks`** 

Available in Firefox.

###  V8_SRC

• **V8_SRC**: *[ElementaryFeature](README.md#elementaryfeature)*

A string representation of native functions typical for the V8 engine.

Remarkable traits are the lack of line feed characters at the beginning and at the end of the string and the presence of a single whitespace before the "\[native code\]" sequence.

**`reamarks`** 

Available in Chrome, Edge, Opera, Android Browser and Node.js.

###  WINDOW

• **WINDOW**: *[ElementaryFeature](README.md#elementaryfeature)*

Existence of the global object self having the string representation "\[object Window\]".

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser 4.4. This feature is not available inside web workers.

###  FeatureConstructor

▸ (...`features`: [Feature](README.md#feature) | "ANY_DOCUMENT" | "ANY_WINDOW" | "ARRAY_ITERATOR" | "ARROW" | "ATOB" | "BARPROP" | "CAPITAL_HTML" | "CONSOLE" | "DOCUMENT" | "DOMWINDOW" | "ESC_HTML_ALL" | "ESC_HTML_QUOT" | "ESC_HTML_QUOT_ONLY" | "ESC_REGEXP_LF" | "ESC_REGEXP_SLASH" | "EXTERNAL" | "FF_SRC" | "FILL" | "FLAT" | "FROM_CODE_POINT" | "FUNCTION_19_LF" | "FUNCTION_22_LF" | "GMT" | "HISTORY" | "HTMLAUDIOELEMENT" | "HTMLDOCUMENT" | "IE_SRC" | "INCR_CHAR" | "INTL" | "LOCALE_INFINITY" | "NAME" | "NODECONSTRUCTOR" | "NO_FF_SRC" | "NO_IE_SRC" | "NO_OLD_SAFARI_ARRAY_ITERATOR" | "NO_V8_SRC" | "SELF_OBJ" | "STATUS" | "UNDEFINED" | "UNEVAL" | "V8_SRC" | "WINDOW" | "ANDRO_4_0" | "ANDRO_4_1" | "ANDRO_4_4" | "AUTO" | "BROWSER" | "CHROME_73" | "COMPACT" | "DEFAULT" | "FF_62" | "IE_10" | "IE_11" | "IE_11_WIN_10" | "IE_9" | "NODE_0_10" | "NODE_0_12" | "NODE_10" | "NODE_11" | "NODE_12" | "NODE_4" | "NODE_5" | "SAFARI_10" | "SAFARI_12" | "SAFARI_7_0" | "SAFARI_7_1" | "SAFARI_9" | "CHROME" | "CHROME_PREV" | "FF" | "FF_ESR" | "SAFARI" | "SAFARI_8" | "SELF" | ReadonlyArray‹[Feature](README.md#feature) | "ANY_DOCUMENT" | "ANY_WINDOW" | "ARRAY_ITERATOR" | "ARROW" | "ATOB" | "BARPROP" | "CAPITAL_HTML" | "CONSOLE" | "DOCUMENT" | "DOMWINDOW" | "ESC_HTML_ALL" | "ESC_HTML_QUOT" | "ESC_HTML_QUOT_ONLY" | "ESC_REGEXP_LF" | "ESC_REGEXP_SLASH" | "EXTERNAL" | "FF_SRC" | "FILL" | "FLAT" | "FROM_CODE_POINT" | "FUNCTION_19_LF" | "FUNCTION_22_LF" | "GMT" | "HISTORY" | "HTMLAUDIOELEMENT" | "HTMLDOCUMENT" | "IE_SRC" | "INCR_CHAR" | "INTL" | "LOCALE_INFINITY" | "NAME" | "NODECONSTRUCTOR" | "NO_FF_SRC" | "NO_IE_SRC" | "NO_OLD_SAFARI_ARRAY_ITERATOR" | "NO_V8_SRC" | "SELF_OBJ" | "STATUS" | "UNDEFINED" | "UNEVAL" | "V8_SRC" | "WINDOW" | "ANDRO_4_0" | "ANDRO_4_1" | "ANDRO_4_4" | "AUTO" | "BROWSER" | "CHROME_73" | "COMPACT" | "DEFAULT" | "FF_62" | "IE_10" | "IE_11" | "IE_11_WIN_10" | "IE_9" | "NODE_0_10" | "NODE_0_12" | "NODE_10" | "NODE_11" | "NODE_12" | "NODE_4" | "NODE_5" | "SAFARI_10" | "SAFARI_12" | "SAFARI_7_0" | "SAFARI_7_1" | "SAFARI_9" | "CHROME" | "CHROME_PREV" | "FF" | "FF_ESR" | "SAFARI" | "SAFARI_8" | "SELF"›[]): *[CustomFeature](README.md#customfeature)*

Creates a new feature object from the union of the specified features.

The constructor can be used with or without the `new` operator, e.g.
`new JScrewIt.Feature(feature1, feature2)` or `JScrewIt.Feature(feature1, feature2)`.
If no arguments are specified, the new feature object will be equivalent to
<code>[DEFAULT](README.md#default)</code>.

**`example`** 

The following statements are equivalent, and will all construct a new feature object
including both <code>[ANY_DOCUMENT](README.md#any_document)</code> and <code>[ANY_WINDOW](README.md#any_window)</code>.

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

**Parameters:**

Name | Type |
------ | ------ |
`...features` | [Feature](README.md#feature) &#124; "ANY_DOCUMENT" &#124; "ANY_WINDOW" &#124; "ARRAY_ITERATOR" &#124; "ARROW" &#124; "ATOB" &#124; "BARPROP" &#124; "CAPITAL_HTML" &#124; "CONSOLE" &#124; "DOCUMENT" &#124; "DOMWINDOW" &#124; "ESC_HTML_ALL" &#124; "ESC_HTML_QUOT" &#124; "ESC_HTML_QUOT_ONLY" &#124; "ESC_REGEXP_LF" &#124; "ESC_REGEXP_SLASH" &#124; "EXTERNAL" &#124; "FF_SRC" &#124; "FILL" &#124; "FLAT" &#124; "FROM_CODE_POINT" &#124; "FUNCTION_19_LF" &#124; "FUNCTION_22_LF" &#124; "GMT" &#124; "HISTORY" &#124; "HTMLAUDIOELEMENT" &#124; "HTMLDOCUMENT" &#124; "IE_SRC" &#124; "INCR_CHAR" &#124; "INTL" &#124; "LOCALE_INFINITY" &#124; "NAME" &#124; "NODECONSTRUCTOR" &#124; "NO_FF_SRC" &#124; "NO_IE_SRC" &#124; "NO_OLD_SAFARI_ARRAY_ITERATOR" &#124; "NO_V8_SRC" &#124; "SELF_OBJ" &#124; "STATUS" &#124; "UNDEFINED" &#124; "UNEVAL" &#124; "V8_SRC" &#124; "WINDOW" &#124; "ANDRO_4_0" &#124; "ANDRO_4_1" &#124; "ANDRO_4_4" &#124; "AUTO" &#124; "BROWSER" &#124; "CHROME_73" &#124; "COMPACT" &#124; "DEFAULT" &#124; "FF_62" &#124; "IE_10" &#124; "IE_11" &#124; "IE_11_WIN_10" &#124; "IE_9" &#124; "NODE_0_10" &#124; "NODE_0_12" &#124; "NODE_10" &#124; "NODE_11" &#124; "NODE_12" &#124; "NODE_4" &#124; "NODE_5" &#124; "SAFARI_10" &#124; "SAFARI_12" &#124; "SAFARI_7_0" &#124; "SAFARI_7_1" &#124; "SAFARI_9" &#124; "CHROME" &#124; "CHROME_PREV" &#124; "FF" &#124; "FF_ESR" &#124; "SAFARI" &#124; "SAFARI_8" &#124; "SELF" &#124; ReadonlyArray‹[Feature](README.md#feature) &#124; "ANY_DOCUMENT" &#124; "ANY_WINDOW" &#124; "ARRAY_ITERATOR" &#124; "ARROW" &#124; "ATOB" &#124; "BARPROP" &#124; "CAPITAL_HTML" &#124; "CONSOLE" &#124; "DOCUMENT" &#124; "DOMWINDOW" &#124; "ESC_HTML_ALL" &#124; "ESC_HTML_QUOT" &#124; "ESC_HTML_QUOT_ONLY" &#124; "ESC_REGEXP_LF" &#124; "ESC_REGEXP_SLASH" &#124; "EXTERNAL" &#124; "FF_SRC" &#124; "FILL" &#124; "FLAT" &#124; "FROM_CODE_POINT" &#124; "FUNCTION_19_LF" &#124; "FUNCTION_22_LF" &#124; "GMT" &#124; "HISTORY" &#124; "HTMLAUDIOELEMENT" &#124; "HTMLDOCUMENT" &#124; "IE_SRC" &#124; "INCR_CHAR" &#124; "INTL" &#124; "LOCALE_INFINITY" &#124; "NAME" &#124; "NODECONSTRUCTOR" &#124; "NO_FF_SRC" &#124; "NO_IE_SRC" &#124; "NO_OLD_SAFARI_ARRAY_ITERATOR" &#124; "NO_V8_SRC" &#124; "SELF_OBJ" &#124; "STATUS" &#124; "UNDEFINED" &#124; "UNEVAL" &#124; "V8_SRC" &#124; "WINDOW" &#124; "ANDRO_4_0" &#124; "ANDRO_4_1" &#124; "ANDRO_4_4" &#124; "AUTO" &#124; "BROWSER" &#124; "CHROME_73" &#124; "COMPACT" &#124; "DEFAULT" &#124; "FF_62" &#124; "IE_10" &#124; "IE_11" &#124; "IE_11_WIN_10" &#124; "IE_9" &#124; "NODE_0_10" &#124; "NODE_0_12" &#124; "NODE_10" &#124; "NODE_11" &#124; "NODE_12" &#124; "NODE_4" &#124; "NODE_5" &#124; "SAFARI_10" &#124; "SAFARI_12" &#124; "SAFARI_7_0" &#124; "SAFARI_7_1" &#124; "SAFARI_9" &#124; "CHROME" &#124; "CHROME_PREV" &#124; "FF" &#124; "FF_ESR" &#124; "SAFARI" &#124; "SAFARI_8" &#124; "SELF"›[] |

**Returns:** *[CustomFeature](README.md#customfeature)*

###  constructor

\+ **new FeatureConstructor**(...`features`: [Feature](README.md#feature) | "ANY_DOCUMENT" | "ANY_WINDOW" | "ARRAY_ITERATOR" | "ARROW" | "ATOB" | "BARPROP" | "CAPITAL_HTML" | "CONSOLE" | "DOCUMENT" | "DOMWINDOW" | "ESC_HTML_ALL" | "ESC_HTML_QUOT" | "ESC_HTML_QUOT_ONLY" | "ESC_REGEXP_LF" | "ESC_REGEXP_SLASH" | "EXTERNAL" | "FF_SRC" | "FILL" | "FLAT" | "FROM_CODE_POINT" | "FUNCTION_19_LF" | "FUNCTION_22_LF" | "GMT" | "HISTORY" | "HTMLAUDIOELEMENT" | "HTMLDOCUMENT" | "IE_SRC" | "INCR_CHAR" | "INTL" | "LOCALE_INFINITY" | "NAME" | "NODECONSTRUCTOR" | "NO_FF_SRC" | "NO_IE_SRC" | "NO_OLD_SAFARI_ARRAY_ITERATOR" | "NO_V8_SRC" | "SELF_OBJ" | "STATUS" | "UNDEFINED" | "UNEVAL" | "V8_SRC" | "WINDOW" | "ANDRO_4_0" | "ANDRO_4_1" | "ANDRO_4_4" | "AUTO" | "BROWSER" | "CHROME_73" | "COMPACT" | "DEFAULT" | "FF_62" | "IE_10" | "IE_11" | "IE_11_WIN_10" | "IE_9" | "NODE_0_10" | "NODE_0_12" | "NODE_10" | "NODE_11" | "NODE_12" | "NODE_4" | "NODE_5" | "SAFARI_10" | "SAFARI_12" | "SAFARI_7_0" | "SAFARI_7_1" | "SAFARI_9" | "CHROME" | "CHROME_PREV" | "FF" | "FF_ESR" | "SAFARI" | "SAFARI_8" | "SELF" | ReadonlyArray‹[Feature](README.md#feature) | "ANY_DOCUMENT" | "ANY_WINDOW" | "ARRAY_ITERATOR" | "ARROW" | "ATOB" | "BARPROP" | "CAPITAL_HTML" | "CONSOLE" | "DOCUMENT" | "DOMWINDOW" | "ESC_HTML_ALL" | "ESC_HTML_QUOT" | "ESC_HTML_QUOT_ONLY" | "ESC_REGEXP_LF" | "ESC_REGEXP_SLASH" | "EXTERNAL" | "FF_SRC" | "FILL" | "FLAT" | "FROM_CODE_POINT" | "FUNCTION_19_LF" | "FUNCTION_22_LF" | "GMT" | "HISTORY" | "HTMLAUDIOELEMENT" | "HTMLDOCUMENT" | "IE_SRC" | "INCR_CHAR" | "INTL" | "LOCALE_INFINITY" | "NAME" | "NODECONSTRUCTOR" | "NO_FF_SRC" | "NO_IE_SRC" | "NO_OLD_SAFARI_ARRAY_ITERATOR" | "NO_V8_SRC" | "SELF_OBJ" | "STATUS" | "UNDEFINED" | "UNEVAL" | "V8_SRC" | "WINDOW" | "ANDRO_4_0" | "ANDRO_4_1" | "ANDRO_4_4" | "AUTO" | "BROWSER" | "CHROME_73" | "COMPACT" | "DEFAULT" | "FF_62" | "IE_10" | "IE_11" | "IE_11_WIN_10" | "IE_9" | "NODE_0_10" | "NODE_0_12" | "NODE_10" | "NODE_11" | "NODE_12" | "NODE_4" | "NODE_5" | "SAFARI_10" | "SAFARI_12" | "SAFARI_7_0" | "SAFARI_7_1" | "SAFARI_9" | "CHROME" | "CHROME_PREV" | "FF" | "FF_ESR" | "SAFARI" | "SAFARI_8" | "SELF"›[]): *[CustomFeature](README.md#customfeature)*

Creates a new feature object from the union of the specified features.

The constructor can be used with or without the `new` operator, e.g.
`new JScrewIt.Feature(feature1, feature2)` or `JScrewIt.Feature(feature1, feature2)`.
If no arguments are specified, the new feature object will be equivalent to
<code>[DEFAULT](README.md#default)</code>.

**`example`** 

The following statements are equivalent, and will all construct a new feature object
including both <code>[ANY_DOCUMENT](README.md#any_document)</code> and <code>[ANY_WINDOW](README.md#any_window)</code>.

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

**Parameters:**

Name | Type |
------ | ------ |
`...features` | [Feature](README.md#feature) &#124; "ANY_DOCUMENT" &#124; "ANY_WINDOW" &#124; "ARRAY_ITERATOR" &#124; "ARROW" &#124; "ATOB" &#124; "BARPROP" &#124; "CAPITAL_HTML" &#124; "CONSOLE" &#124; "DOCUMENT" &#124; "DOMWINDOW" &#124; "ESC_HTML_ALL" &#124; "ESC_HTML_QUOT" &#124; "ESC_HTML_QUOT_ONLY" &#124; "ESC_REGEXP_LF" &#124; "ESC_REGEXP_SLASH" &#124; "EXTERNAL" &#124; "FF_SRC" &#124; "FILL" &#124; "FLAT" &#124; "FROM_CODE_POINT" &#124; "FUNCTION_19_LF" &#124; "FUNCTION_22_LF" &#124; "GMT" &#124; "HISTORY" &#124; "HTMLAUDIOELEMENT" &#124; "HTMLDOCUMENT" &#124; "IE_SRC" &#124; "INCR_CHAR" &#124; "INTL" &#124; "LOCALE_INFINITY" &#124; "NAME" &#124; "NODECONSTRUCTOR" &#124; "NO_FF_SRC" &#124; "NO_IE_SRC" &#124; "NO_OLD_SAFARI_ARRAY_ITERATOR" &#124; "NO_V8_SRC" &#124; "SELF_OBJ" &#124; "STATUS" &#124; "UNDEFINED" &#124; "UNEVAL" &#124; "V8_SRC" &#124; "WINDOW" &#124; "ANDRO_4_0" &#124; "ANDRO_4_1" &#124; "ANDRO_4_4" &#124; "AUTO" &#124; "BROWSER" &#124; "CHROME_73" &#124; "COMPACT" &#124; "DEFAULT" &#124; "FF_62" &#124; "IE_10" &#124; "IE_11" &#124; "IE_11_WIN_10" &#124; "IE_9" &#124; "NODE_0_10" &#124; "NODE_0_12" &#124; "NODE_10" &#124; "NODE_11" &#124; "NODE_12" &#124; "NODE_4" &#124; "NODE_5" &#124; "SAFARI_10" &#124; "SAFARI_12" &#124; "SAFARI_7_0" &#124; "SAFARI_7_1" &#124; "SAFARI_9" &#124; "CHROME" &#124; "CHROME_PREV" &#124; "FF" &#124; "FF_ESR" &#124; "SAFARI" &#124; "SAFARI_8" &#124; "SELF" &#124; ReadonlyArray‹[Feature](README.md#feature) &#124; "ANY_DOCUMENT" &#124; "ANY_WINDOW" &#124; "ARRAY_ITERATOR" &#124; "ARROW" &#124; "ATOB" &#124; "BARPROP" &#124; "CAPITAL_HTML" &#124; "CONSOLE" &#124; "DOCUMENT" &#124; "DOMWINDOW" &#124; "ESC_HTML_ALL" &#124; "ESC_HTML_QUOT" &#124; "ESC_HTML_QUOT_ONLY" &#124; "ESC_REGEXP_LF" &#124; "ESC_REGEXP_SLASH" &#124; "EXTERNAL" &#124; "FF_SRC" &#124; "FILL" &#124; "FLAT" &#124; "FROM_CODE_POINT" &#124; "FUNCTION_19_LF" &#124; "FUNCTION_22_LF" &#124; "GMT" &#124; "HISTORY" &#124; "HTMLAUDIOELEMENT" &#124; "HTMLDOCUMENT" &#124; "IE_SRC" &#124; "INCR_CHAR" &#124; "INTL" &#124; "LOCALE_INFINITY" &#124; "NAME" &#124; "NODECONSTRUCTOR" &#124; "NO_FF_SRC" &#124; "NO_IE_SRC" &#124; "NO_OLD_SAFARI_ARRAY_ITERATOR" &#124; "NO_V8_SRC" &#124; "SELF_OBJ" &#124; "STATUS" &#124; "UNDEFINED" &#124; "UNEVAL" &#124; "V8_SRC" &#124; "WINDOW" &#124; "ANDRO_4_0" &#124; "ANDRO_4_1" &#124; "ANDRO_4_4" &#124; "AUTO" &#124; "BROWSER" &#124; "CHROME_73" &#124; "COMPACT" &#124; "DEFAULT" &#124; "FF_62" &#124; "IE_10" &#124; "IE_11" &#124; "IE_11_WIN_10" &#124; "IE_9" &#124; "NODE_0_10" &#124; "NODE_0_12" &#124; "NODE_10" &#124; "NODE_11" &#124; "NODE_12" &#124; "NODE_4" &#124; "NODE_5" &#124; "SAFARI_10" &#124; "SAFARI_12" &#124; "SAFARI_7_0" &#124; "SAFARI_7_1" &#124; "SAFARI_9" &#124; "CHROME" &#124; "CHROME_PREV" &#124; "FF" &#124; "FF_ESR" &#124; "SAFARI" &#124; "SAFARI_8" &#124; "SELF"›[] |

**Returns:** *[CustomFeature](README.md#customfeature)*

###  ALL

• **ALL**: *[FeatureAll](README.md#featureall)*

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

###  ANDRO_4_0

• **ANDRO_4_0**: *[PredefinedFeature](README.md#predefinedfeature)*

*Inherited from [FeatureAll](README.md#featureall).[ANDRO_4_0](README.md#andro_4_0)*

Features available in Android Browser 4.0.

###  ANDRO_4_1

• **ANDRO_4_1**: *[PredefinedFeature](README.md#predefinedfeature)*

*Inherited from [FeatureAll](README.md#featureall).[ANDRO_4_1](README.md#andro_4_1)*

Features available in Android Browser 4.1 to 4.3.

###  ANDRO_4_4

• **ANDRO_4_4**: *[PredefinedFeature](README.md#predefinedfeature)*

*Inherited from [FeatureAll](README.md#featureall).[ANDRO_4_4](README.md#andro_4_4)*

Features available in Android Browser 4.4.

###  ANY_DOCUMENT

• **ANY_DOCUMENT**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[ANY_DOCUMENT](README.md#any_document)*

Existence of the global object document whose string representation starts with "\[object " and ends with "Document\]".

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers.

###  ANY_WINDOW

• **ANY_WINDOW**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[ANY_WINDOW](README.md#any_window)*

Existence of the global object self whose string representation starts with "\[object " and ends with "Window\]".

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers.

###  ARRAY_ITERATOR

• **ARRAY_ITERATOR**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[ARRAY_ITERATOR](README.md#array_iterator)*

The property that the string representation of Array.prototype.entries\(\) starts with "\[object Array" and ends with "\]" at index 21 or 22.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Safari 7.1+, Opera and Node.js 0.12+.

###  ARROW

• **ARROW**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[ARROW](README.md#arrow)*

Support for arrow functions.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Safari 10+, Opera and Node.js 4+.

###  ATOB

• **ATOB**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[ATOB](README.md#atob)*

Existence of the global functions atob and btoa.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer 10+, Safari, Opera and Android Browser. This feature is not available inside web workers in Safari before 10.

###  AUTO

• **AUTO**: *[PredefinedFeature](README.md#predefinedfeature)*

*Inherited from [FeatureAll](README.md#featureall).[AUTO](README.md#auto)*

All features available in the current engine.

###  BARPROP

• **BARPROP**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[BARPROP](README.md#barprop)*

Existence of the global object statusbar having the string representation "\[object BarProp\]".

**`reamarks`** 

Available in Chrome, Edge, Firefox, Safari, Opera and Android Browser 4.4. This feature is not available inside web workers.

###  BROWSER

• **BROWSER**: *[PredefinedFeature](README.md#predefinedfeature)*

*Inherited from [FeatureAll](README.md#featureall).[BROWSER](README.md#browser)*

Features available in all browsers.

No support for Node.js.

###  CAPITAL_HTML

• **CAPITAL_HTML**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[CAPITAL_HTML](README.md#capital_html)*

The property that the various string methods returning HTML code such as String.prototype.big or String.prototype.link have both the tag name and attributes written in capital letters.

**`reamarks`** 

Available in Internet Explorer.

###  CHROME

• **CHROME**: *[PredefinedFeature](README.md#predefinedfeature)*

*Inherited from [FeatureAll](README.md#featureall).[CHROME](README.md#chrome)*

An alias for `CHROME_73`.

###  CHROME_73

• **CHROME_73**: *[PredefinedFeature](README.md#predefinedfeature)*

*Inherited from [FeatureAll](README.md#featureall).[CHROME_73](README.md#chrome_73)*

Features available in Chrome 73, Edge 79 and Opera 60 or later.

###  CHROME_PREV

• **CHROME_PREV**: *[PredefinedFeature](README.md#predefinedfeature)*

*Inherited from [FeatureAll](README.md#featureall).[CHROME_PREV](README.md#chrome_prev)*

An alias for `CHROME_73`.

###  COMPACT

• **COMPACT**: *[PredefinedFeature](README.md#predefinedfeature)*

*Inherited from [FeatureAll](README.md#featureall).[COMPACT](README.md#compact)*

All new browsers' features.

No support for Node.js and older browsers like Internet Explorer, Safari 9 or Android Browser.

###  CONSOLE

• **CONSOLE**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[CONSOLE](README.md#console)*

Existence of the global object console having the string representation "\[object Console\]".

This feature may become unavailable when certain browser extensions are active.

**`reamarks`** 

Available in Firefox, Internet Explorer 10+, Safari and Android Browser. This feature is not available inside web workers in Safari before 7.1 and Android Browser 4.4.

###  DEFAULT

• **DEFAULT**: *[PredefinedFeature](README.md#predefinedfeature)*

*Inherited from [FeatureAll](README.md#featureall).[DEFAULT](README.md#default)*

Minimum feature level, compatible with all supported engines in all environments.

###  DOCUMENT

• **DOCUMENT**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[DOCUMENT](README.md#document)*

Existence of the global object document having the string representation "\[object Document\]".

**`reamarks`** 

Available in Internet Explorer before 11. This feature is not available inside web workers.

###  DOMWINDOW

• **DOMWINDOW**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[DOMWINDOW](README.md#domwindow)*

Existence of the global object self having the string representation "\[object DOMWindow\]".

**`reamarks`** 

Available in Android Browser before 4.4. This feature is not available inside web workers.

###  ELEMENTARY

• **ELEMENTARY**: *keyof ElementaryFeature[]*

An immutable array of all elementary feature objects ordered by name.

###  ESC_HTML_ALL

• **ESC_HTML_ALL**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[ESC_HTML_ALL](README.md#esc_html_all)*

The property that double quotation mark, less than and greater than characters in the argument of String.prototype.fontcolor are escaped into their respective HTML entities.

**`reamarks`** 

Available in Android Browser and Node.js before 0.12.

###  ESC_HTML_QUOT

• **ESC_HTML_QUOT**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[ESC_HTML_QUOT](README.md#esc_html_quot)*

The property that double quotation marks in the argument of String.prototype.fontcolor are escaped as "\&quot;".

**`reamarks`** 

Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser and Node.js.

###  ESC_HTML_QUOT_ONLY

• **ESC_HTML_QUOT_ONLY**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[ESC_HTML_QUOT_ONLY](README.md#esc_html_quot_only)*

The property that only double quotation marks and no other characters in the argument of String.prototype.fontcolor are escaped into HTML entities.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Safari, Opera and Node.js 0.12+.

###  ESC_REGEXP_LF

• **ESC_REGEXP_LF**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[ESC_REGEXP_LF](README.md#esc_regexp_lf)*

Having regular expressions created with the RegExp constructor use escape sequences starting with a backslash to format line feed characters \("\\n"\) in their string representation.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Node.js 12+.

###  ESC_REGEXP_SLASH

• **ESC_REGEXP_SLASH**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[ESC_REGEXP_SLASH](README.md#esc_regexp_slash)*

Having regular expressions created with the RegExp constructor use escape sequences starting with a backslash to format slashes \("/"\) in their string representation.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Node.js 4+.

###  EXTERNAL

• **EXTERNAL**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[EXTERNAL](README.md#external)*

Existence of the global object sidebar having the string representation "\[object External\]".

**`reamarks`** 

Available in Firefox. This feature is not available inside web workers.

###  FF

• **FF**: *[PredefinedFeature](README.md#predefinedfeature)*

*Inherited from [FeatureAll](README.md#featureall).[FF](README.md#ff)*

An alias for `FF_62`.

###  FF_62

• **FF_62**: *[PredefinedFeature](README.md#predefinedfeature)*

*Inherited from [FeatureAll](README.md#featureall).[FF_62](README.md#ff_62)*

Features available in Firefox 62 or later.

###  FF_ESR

• **FF_ESR**: *[PredefinedFeature](README.md#predefinedfeature)*

*Inherited from [FeatureAll](README.md#featureall).[FF_ESR](README.md#ff_esr)*

An alias for `FF_62`.

###  FF_SRC

• **FF_SRC**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[FF_SRC](README.md#ff_src)*

A string representation of native functions typical for Firefox and Safari.

Remarkable traits are the lack of line feed characters at the beginning and at the end of the string and the presence of a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.

**`reamarks`** 

Available in Firefox and Safari.

###  FILL

• **FILL**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[FILL](README.md#fill)*

Existence of the native function Array.prototype.fill.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Safari 7.1+, Opera and Node.js 4+.

###  FLAT

• **FLAT**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[FLAT](README.md#flat)*

Existence of the native function Array.prototype.flat.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Safari 12+, Opera and Node.js 11+.

###  FROM_CODE_POINT

• **FROM_CODE_POINT**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[FROM_CODE_POINT](README.md#from_code_point)*

Existence of the function String.fromCodePoint.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Safari 9+, Opera and Node.js 4+.

###  FUNCTION_19_LF

• **FUNCTION_19_LF**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[FUNCTION_19_LF](README.md#function_19_lf)*

A string representation of dynamically generated functions where the character at index 19 is a line feed \("\\n"\).

**`reamarks`** 

Available in Chrome, Edge, Firefox, Opera and Node.js 10+.

###  FUNCTION_22_LF

• **FUNCTION_22_LF**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[FUNCTION_22_LF](README.md#function_22_lf)*

A string representation of dynamically generated functions where the character at index 22 is a line feed \("\\n"\).

**`reamarks`** 

Available in Internet Explorer, Safari 9+, Android Browser and Node.js before 10.

###  GMT

• **GMT**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[GMT](README.md#gmt)*

Presence of the text "GMT" after the first 25 characters in the string returned by Date\(\).

The string representation of dates is implementation dependent, but most engines use a similar format, making this feature available in all supported engines except Internet Explorer 9 and 10.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari, Opera, Android Browser and Node.js.

###  HISTORY

• **HISTORY**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[HISTORY](README.md#history)*

Existence of the global object history having the string representation "\[object History\]".

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers.

###  HTMLAUDIOELEMENT

• **HTMLAUDIOELEMENT**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[HTMLAUDIOELEMENT](README.md#htmlaudioelement)*

Existence of the global object Audio whose string representation starts with "function HTMLAudioElement".

**`reamarks`** 

Available in Android Browser 4.4. This feature is not available inside web workers.

###  HTMLDOCUMENT

• **HTMLDOCUMENT**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[HTMLDOCUMENT](README.md#htmldocument)*

Existence of the global object document having the string representation "\[object HTMLDocument\]".

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari, Opera and Android Browser. This feature is not available inside web workers.

###  IE_10

• **IE_10**: *[PredefinedFeature](README.md#predefinedfeature)*

*Inherited from [FeatureAll](README.md#featureall).[IE_10](README.md#ie_10)*

Features available in Internet Explorer 10.

###  IE_11

• **IE_11**: *[PredefinedFeature](README.md#predefinedfeature)*

*Inherited from [FeatureAll](README.md#featureall).[IE_11](README.md#ie_11)*

Features available in Internet Explorer 11.

###  IE_11_WIN_10

• **IE_11_WIN_10**: *[PredefinedFeature](README.md#predefinedfeature)*

*Inherited from [FeatureAll](README.md#featureall).[IE_11_WIN_10](README.md#ie_11_win_10)*

Features available in Internet Explorer 11 on Windows 10.

###  IE_9

• **IE_9**: *[PredefinedFeature](README.md#predefinedfeature)*

*Inherited from [FeatureAll](README.md#featureall).[IE_9](README.md#ie_9)*

Features available in Internet Explorer 9.

###  IE_SRC

• **IE_SRC**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[IE_SRC](README.md#ie_src)*

A string representation of native functions typical for Internet Explorer.

Remarkable traits are the presence of a line feed character \("\\n"\) at the beginning and at the end of the string and a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.

**`reamarks`** 

Available in Internet Explorer.

###  INCR_CHAR

• **INCR_CHAR**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[INCR_CHAR](README.md#incr_char)*

The ability to use unary increment operators with string characters, like in \( ++"some string"\[0\] \): this will result in a TypeError in strict mode in ECMAScript compliant engines.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, Android Browser and Node.js. This feature is not available when strict mode is enforced in Chrome, Edge, Firefox, Internet Explorer 10+, Safari, Opera and Node.js 5+.

###  INTL

• **INTL**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[INTL](README.md#intl)*

Existence of the global object Intl.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari 10+, Opera, Android Browser 4.4 and Node.js 0.12+.

###  LOCALE_INFINITY

• **LOCALE_INFINITY**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[LOCALE_INFINITY](README.md#locale_infinity)*

Language sensitive string representation of Infinity as "∞".

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer 11 on Windows 10, Safari 10+, Opera, Android Browser 4.4 and Node.js 0.12+.

###  NAME

• **NAME**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[NAME](README.md#name)*

Existence of the name property for functions.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser and Node.js.

###  NODECONSTRUCTOR

• **NODECONSTRUCTOR**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[NODECONSTRUCTOR](README.md#nodeconstructor)*

Existence of the global object Node having the string representation "\[object NodeConstructor\]".

**`reamarks`** 

Available in Safari before 10. This feature is not available inside web workers.

###  NODE_0_10

• **NODE_0_10**: *[PredefinedFeature](README.md#predefinedfeature)*

*Inherited from [FeatureAll](README.md#featureall).[NODE_0_10](README.md#node_0_10)*

Features available in Node.js 0.10.

###  NODE_0_12

• **NODE_0_12**: *[PredefinedFeature](README.md#predefinedfeature)*

*Inherited from [FeatureAll](README.md#featureall).[NODE_0_12](README.md#node_0_12)*

Features available in Node.js 0.12.

###  NODE_10

• **NODE_10**: *[PredefinedFeature](README.md#predefinedfeature)*

*Inherited from [FeatureAll](README.md#featureall).[NODE_10](README.md#node_10)*

Features available in Node.js 10.

###  NODE_11

• **NODE_11**: *[PredefinedFeature](README.md#predefinedfeature)*

*Inherited from [FeatureAll](README.md#featureall).[NODE_11](README.md#node_11)*

Features available in Node.js 11.

###  NODE_12

• **NODE_12**: *[PredefinedFeature](README.md#predefinedfeature)*

*Inherited from [FeatureAll](README.md#featureall).[NODE_12](README.md#node_12)*

Features available in Node.js 12 or later.

###  NODE_4

• **NODE_4**: *[PredefinedFeature](README.md#predefinedfeature)*

*Inherited from [FeatureAll](README.md#featureall).[NODE_4](README.md#node_4)*

Features available in Node.js 4.

###  NODE_5

• **NODE_5**: *[PredefinedFeature](README.md#predefinedfeature)*

*Inherited from [FeatureAll](README.md#featureall).[NODE_5](README.md#node_5)*

Features available in Node.js 5 to 9.

###  NO_FF_SRC

• **NO_FF_SRC**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[NO_FF_SRC](README.md#no_ff_src)*

A string representation of native functions typical for V8 or for Internet Explorer but not for Firefox and Safari.

**`reamarks`** 

Available in Chrome, Edge, Internet Explorer, Opera, Android Browser and Node.js.

###  NO_IE_SRC

• **NO_IE_SRC**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[NO_IE_SRC](README.md#no_ie_src)*

A string representation of native functions typical for most engines with the notable exception of Internet Explorer.

A remarkable trait of this feature is the lack of line feed characters at the beginning and at the end of the string.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser and Node.js.

###  NO_OLD_SAFARI_ARRAY_ITERATOR

• **NO_OLD_SAFARI_ARRAY_ITERATOR**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[NO_OLD_SAFARI_ARRAY_ITERATOR](README.md#no_old_safari_array_iterator)*

The property that the string representation of Array.prototype.entries\(\) evaluates to "\[object Array Iterator\]".

**`reamarks`** 

Available in Chrome, Edge, Firefox, Safari 9+, Opera and Node.js 0.12+.

###  NO_V8_SRC

• **NO_V8_SRC**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[NO_V8_SRC](README.md#no_v8_src)*

A string representation of native functions typical for Firefox, Internet Explorer and Safari.

A most remarkable trait of this feature is the presence of a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.

**`reamarks`** 

Available in Firefox, Internet Explorer and Safari.

###  SAFARI

• **SAFARI**: *[PredefinedFeature](README.md#predefinedfeature)*

*Inherited from [FeatureAll](README.md#featureall).[SAFARI](README.md#safari)*

An alias for `SAFARI_12`.

###  SAFARI_10

• **SAFARI_10**: *[PredefinedFeature](README.md#predefinedfeature)*

*Inherited from [FeatureAll](README.md#featureall).[SAFARI_10](README.md#safari_10)*

Features available in Safari 10 or later.

###  SAFARI_12

• **SAFARI_12**: *[PredefinedFeature](README.md#predefinedfeature)*

*Inherited from [FeatureAll](README.md#featureall).[SAFARI_12](README.md#safari_12)*

Features available in Safari 12 or later.

###  SAFARI_7_0

• **SAFARI_7_0**: *[PredefinedFeature](README.md#predefinedfeature)*

*Inherited from [FeatureAll](README.md#featureall).[SAFARI_7_0](README.md#safari_7_0)*

Features available in Safari 7.0.

###  SAFARI_7_1

• **SAFARI_7_1**: *[PredefinedFeature](README.md#predefinedfeature)*

*Inherited from [FeatureAll](README.md#featureall).[SAFARI_7_1](README.md#safari_7_1)*

Features available in Safari 7.1 and Safari 8.

###  SAFARI_8

• **SAFARI_8**: *[PredefinedFeature](README.md#predefinedfeature)*

*Inherited from [FeatureAll](README.md#featureall).[SAFARI_8](README.md#safari_8)*

An alias for `SAFARI_7_1`.

###  SAFARI_9

• **SAFARI_9**: *[PredefinedFeature](README.md#predefinedfeature)*

*Inherited from [FeatureAll](README.md#featureall).[SAFARI_9](README.md#safari_9)*

Features available in Safari 9.

###  SELF

• **SELF**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[SELF](README.md#self)*

An alias for `ANY_WINDOW`.

###  SELF_OBJ

• **SELF_OBJ**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[SELF_OBJ](README.md#self_obj)*

Existence of the global object self whose string representation starts with "\[object ".

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers in Safari 7.1+ before 10.

###  STATUS

• **STATUS**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[STATUS](README.md#status)*

Existence of the global string status.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers.

###  UNDEFINED

• **UNDEFINED**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[UNDEFINED](README.md#undefined)*

The property that Object.prototype.toString.call\(\) evaluates to "\[object Undefined\]".

This behavior is specified by ECMAScript, and is enforced by all engines except Android Browser versions prior to 4.1.2, where this feature is not available.

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, Android Browser 4.1+ and Node.js.

###  UNEVAL

• **UNEVAL**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[UNEVAL](README.md#uneval)*

Existence of the global function uneval.

**`reamarks`** 

Available in Firefox.

###  V8_SRC

• **V8_SRC**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[V8_SRC](README.md#v8_src)*

A string representation of native functions typical for the V8 engine.

Remarkable traits are the lack of line feed characters at the beginning and at the end of the string and the presence of a single whitespace before the "\[native code\]" sequence.

**`reamarks`** 

Available in Chrome, Edge, Opera, Android Browser and Node.js.

###  WINDOW

• **WINDOW**: *[ElementaryFeature](README.md#elementaryfeature)*

*Inherited from [FeatureAll](README.md#featureall).[WINDOW](README.md#window)*

Existence of the global object self having the string representation "\[object Window\]".

**`reamarks`** 

Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser 4.4. This feature is not available inside web workers.

###  areCompatible

▸ **areCompatible**(...`features`: [FeatureElement](README.md#featureelement)[]): *boolean*

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

**Parameters:**

Name | Type |
------ | ------ |
`...features` | [FeatureElement](README.md#featureelement)[] |

**Returns:** *boolean*

`true` if the specified features are mutually compatible; otherwise, `false`.
If less than two features are specified, the return value is `true`.

###  areEqual

▸ **areEqual**(...`features`: [Feature](README.md#feature) | "ANY_DOCUMENT" | "ANY_WINDOW" | "ARRAY_ITERATOR" | "ARROW" | "ATOB" | "BARPROP" | "CAPITAL_HTML" | "CONSOLE" | "DOCUMENT" | "DOMWINDOW" | "ESC_HTML_ALL" | "ESC_HTML_QUOT" | "ESC_HTML_QUOT_ONLY" | "ESC_REGEXP_LF" | "ESC_REGEXP_SLASH" | "EXTERNAL" | "FF_SRC" | "FILL" | "FLAT" | "FROM_CODE_POINT" | "FUNCTION_19_LF" | "FUNCTION_22_LF" | "GMT" | "HISTORY" | "HTMLAUDIOELEMENT" | "HTMLDOCUMENT" | "IE_SRC" | "INCR_CHAR" | "INTL" | "LOCALE_INFINITY" | "NAME" | "NODECONSTRUCTOR" | "NO_FF_SRC" | "NO_IE_SRC" | "NO_OLD_SAFARI_ARRAY_ITERATOR" | "NO_V8_SRC" | "SELF_OBJ" | "STATUS" | "UNDEFINED" | "UNEVAL" | "V8_SRC" | "WINDOW" | "ANDRO_4_0" | "ANDRO_4_1" | "ANDRO_4_4" | "AUTO" | "BROWSER" | "CHROME_73" | "COMPACT" | "DEFAULT" | "FF_62" | "IE_10" | "IE_11" | "IE_11_WIN_10" | "IE_9" | "NODE_0_10" | "NODE_0_12" | "NODE_10" | "NODE_11" | "NODE_12" | "NODE_4" | "NODE_5" | "SAFARI_10" | "SAFARI_12" | "SAFARI_7_0" | "SAFARI_7_1" | "SAFARI_9" | "CHROME" | "CHROME_PREV" | "FF" | "FF_ESR" | "SAFARI" | "SAFARI_8" | "SELF" | ReadonlyArray‹[Feature](README.md#feature) | "ANY_DOCUMENT" | "ANY_WINDOW" | "ARRAY_ITERATOR" | "ARROW" | "ATOB" | "BARPROP" | "CAPITAL_HTML" | "CONSOLE" | "DOCUMENT" | "DOMWINDOW" | "ESC_HTML_ALL" | "ESC_HTML_QUOT" | "ESC_HTML_QUOT_ONLY" | "ESC_REGEXP_LF" | "ESC_REGEXP_SLASH" | "EXTERNAL" | "FF_SRC" | "FILL" | "FLAT" | "FROM_CODE_POINT" | "FUNCTION_19_LF" | "FUNCTION_22_LF" | "GMT" | "HISTORY" | "HTMLAUDIOELEMENT" | "HTMLDOCUMENT" | "IE_SRC" | "INCR_CHAR" | "INTL" | "LOCALE_INFINITY" | "NAME" | "NODECONSTRUCTOR" | "NO_FF_SRC" | "NO_IE_SRC" | "NO_OLD_SAFARI_ARRAY_ITERATOR" | "NO_V8_SRC" | "SELF_OBJ" | "STATUS" | "UNDEFINED" | "UNEVAL" | "V8_SRC" | "WINDOW" | "ANDRO_4_0" | "ANDRO_4_1" | "ANDRO_4_4" | "AUTO" | "BROWSER" | "CHROME_73" | "COMPACT" | "DEFAULT" | "FF_62" | "IE_10" | "IE_11" | "IE_11_WIN_10" | "IE_9" | "NODE_0_10" | "NODE_0_12" | "NODE_10" | "NODE_11" | "NODE_12" | "NODE_4" | "NODE_5" | "SAFARI_10" | "SAFARI_12" | "SAFARI_7_0" | "SAFARI_7_1" | "SAFARI_9" | "CHROME" | "CHROME_PREV" | "FF" | "FF_ESR" | "SAFARI" | "SAFARI_8" | "SELF"›[]): *boolean*

Determines whether all of the specified features are equivalent.

Different features are considered equivalent if they include the same set of elementary
features, regardless of any other difference.

**`example`** 

```js
// false
JScrewIt.Feature.areEqual(JScrewIt.Feature.CHROME, JScrewIt.Feature.FIREFOX)
```

```js
// true
JScrewIt.Feature.areEqual("DEFAULT", [])
```

**Parameters:**

Name | Type |
------ | ------ |
`...features` | [Feature](README.md#feature) &#124; "ANY_DOCUMENT" &#124; "ANY_WINDOW" &#124; "ARRAY_ITERATOR" &#124; "ARROW" &#124; "ATOB" &#124; "BARPROP" &#124; "CAPITAL_HTML" &#124; "CONSOLE" &#124; "DOCUMENT" &#124; "DOMWINDOW" &#124; "ESC_HTML_ALL" &#124; "ESC_HTML_QUOT" &#124; "ESC_HTML_QUOT_ONLY" &#124; "ESC_REGEXP_LF" &#124; "ESC_REGEXP_SLASH" &#124; "EXTERNAL" &#124; "FF_SRC" &#124; "FILL" &#124; "FLAT" &#124; "FROM_CODE_POINT" &#124; "FUNCTION_19_LF" &#124; "FUNCTION_22_LF" &#124; "GMT" &#124; "HISTORY" &#124; "HTMLAUDIOELEMENT" &#124; "HTMLDOCUMENT" &#124; "IE_SRC" &#124; "INCR_CHAR" &#124; "INTL" &#124; "LOCALE_INFINITY" &#124; "NAME" &#124; "NODECONSTRUCTOR" &#124; "NO_FF_SRC" &#124; "NO_IE_SRC" &#124; "NO_OLD_SAFARI_ARRAY_ITERATOR" &#124; "NO_V8_SRC" &#124; "SELF_OBJ" &#124; "STATUS" &#124; "UNDEFINED" &#124; "UNEVAL" &#124; "V8_SRC" &#124; "WINDOW" &#124; "ANDRO_4_0" &#124; "ANDRO_4_1" &#124; "ANDRO_4_4" &#124; "AUTO" &#124; "BROWSER" &#124; "CHROME_73" &#124; "COMPACT" &#124; "DEFAULT" &#124; "FF_62" &#124; "IE_10" &#124; "IE_11" &#124; "IE_11_WIN_10" &#124; "IE_9" &#124; "NODE_0_10" &#124; "NODE_0_12" &#124; "NODE_10" &#124; "NODE_11" &#124; "NODE_12" &#124; "NODE_4" &#124; "NODE_5" &#124; "SAFARI_10" &#124; "SAFARI_12" &#124; "SAFARI_7_0" &#124; "SAFARI_7_1" &#124; "SAFARI_9" &#124; "CHROME" &#124; "CHROME_PREV" &#124; "FF" &#124; "FF_ESR" &#124; "SAFARI" &#124; "SAFARI_8" &#124; "SELF" &#124; ReadonlyArray‹[Feature](README.md#feature) &#124; "ANY_DOCUMENT" &#124; "ANY_WINDOW" &#124; "ARRAY_ITERATOR" &#124; "ARROW" &#124; "ATOB" &#124; "BARPROP" &#124; "CAPITAL_HTML" &#124; "CONSOLE" &#124; "DOCUMENT" &#124; "DOMWINDOW" &#124; "ESC_HTML_ALL" &#124; "ESC_HTML_QUOT" &#124; "ESC_HTML_QUOT_ONLY" &#124; "ESC_REGEXP_LF" &#124; "ESC_REGEXP_SLASH" &#124; "EXTERNAL" &#124; "FF_SRC" &#124; "FILL" &#124; "FLAT" &#124; "FROM_CODE_POINT" &#124; "FUNCTION_19_LF" &#124; "FUNCTION_22_LF" &#124; "GMT" &#124; "HISTORY" &#124; "HTMLAUDIOELEMENT" &#124; "HTMLDOCUMENT" &#124; "IE_SRC" &#124; "INCR_CHAR" &#124; "INTL" &#124; "LOCALE_INFINITY" &#124; "NAME" &#124; "NODECONSTRUCTOR" &#124; "NO_FF_SRC" &#124; "NO_IE_SRC" &#124; "NO_OLD_SAFARI_ARRAY_ITERATOR" &#124; "NO_V8_SRC" &#124; "SELF_OBJ" &#124; "STATUS" &#124; "UNDEFINED" &#124; "UNEVAL" &#124; "V8_SRC" &#124; "WINDOW" &#124; "ANDRO_4_0" &#124; "ANDRO_4_1" &#124; "ANDRO_4_4" &#124; "AUTO" &#124; "BROWSER" &#124; "CHROME_73" &#124; "COMPACT" &#124; "DEFAULT" &#124; "FF_62" &#124; "IE_10" &#124; "IE_11" &#124; "IE_11_WIN_10" &#124; "IE_9" &#124; "NODE_0_10" &#124; "NODE_0_12" &#124; "NODE_10" &#124; "NODE_11" &#124; "NODE_12" &#124; "NODE_4" &#124; "NODE_5" &#124; "SAFARI_10" &#124; "SAFARI_12" &#124; "SAFARI_7_0" &#124; "SAFARI_7_1" &#124; "SAFARI_9" &#124; "CHROME" &#124; "CHROME_PREV" &#124; "FF" &#124; "FF_ESR" &#124; "SAFARI" &#124; "SAFARI_8" &#124; "SELF"›[] |

**Returns:** *boolean*

`true` if all of the specified features are equivalent; otherwise, `false`.
If less than two arguments are specified, the return value is `true`.

###  commonOf

▸ **commonOf**(...`features`: [Feature](README.md#feature) | "ANY_DOCUMENT" | "ANY_WINDOW" | "ARRAY_ITERATOR" | "ARROW" | "ATOB" | "BARPROP" | "CAPITAL_HTML" | "CONSOLE" | "DOCUMENT" | "DOMWINDOW" | "ESC_HTML_ALL" | "ESC_HTML_QUOT" | "ESC_HTML_QUOT_ONLY" | "ESC_REGEXP_LF" | "ESC_REGEXP_SLASH" | "EXTERNAL" | "FF_SRC" | "FILL" | "FLAT" | "FROM_CODE_POINT" | "FUNCTION_19_LF" | "FUNCTION_22_LF" | "GMT" | "HISTORY" | "HTMLAUDIOELEMENT" | "HTMLDOCUMENT" | "IE_SRC" | "INCR_CHAR" | "INTL" | "LOCALE_INFINITY" | "NAME" | "NODECONSTRUCTOR" | "NO_FF_SRC" | "NO_IE_SRC" | "NO_OLD_SAFARI_ARRAY_ITERATOR" | "NO_V8_SRC" | "SELF_OBJ" | "STATUS" | "UNDEFINED" | "UNEVAL" | "V8_SRC" | "WINDOW" | "ANDRO_4_0" | "ANDRO_4_1" | "ANDRO_4_4" | "AUTO" | "BROWSER" | "CHROME_73" | "COMPACT" | "DEFAULT" | "FF_62" | "IE_10" | "IE_11" | "IE_11_WIN_10" | "IE_9" | "NODE_0_10" | "NODE_0_12" | "NODE_10" | "NODE_11" | "NODE_12" | "NODE_4" | "NODE_5" | "SAFARI_10" | "SAFARI_12" | "SAFARI_7_0" | "SAFARI_7_1" | "SAFARI_9" | "CHROME" | "CHROME_PREV" | "FF" | "FF_ESR" | "SAFARI" | "SAFARI_8" | "SELF" | ReadonlyArray‹[Feature](README.md#feature) | "ANY_DOCUMENT" | "ANY_WINDOW" | "ARRAY_ITERATOR" | "ARROW" | "ATOB" | "BARPROP" | "CAPITAL_HTML" | "CONSOLE" | "DOCUMENT" | "DOMWINDOW" | "ESC_HTML_ALL" | "ESC_HTML_QUOT" | "ESC_HTML_QUOT_ONLY" | "ESC_REGEXP_LF" | "ESC_REGEXP_SLASH" | "EXTERNAL" | "FF_SRC" | "FILL" | "FLAT" | "FROM_CODE_POINT" | "FUNCTION_19_LF" | "FUNCTION_22_LF" | "GMT" | "HISTORY" | "HTMLAUDIOELEMENT" | "HTMLDOCUMENT" | "IE_SRC" | "INCR_CHAR" | "INTL" | "LOCALE_INFINITY" | "NAME" | "NODECONSTRUCTOR" | "NO_FF_SRC" | "NO_IE_SRC" | "NO_OLD_SAFARI_ARRAY_ITERATOR" | "NO_V8_SRC" | "SELF_OBJ" | "STATUS" | "UNDEFINED" | "UNEVAL" | "V8_SRC" | "WINDOW" | "ANDRO_4_0" | "ANDRO_4_1" | "ANDRO_4_4" | "AUTO" | "BROWSER" | "CHROME_73" | "COMPACT" | "DEFAULT" | "FF_62" | "IE_10" | "IE_11" | "IE_11_WIN_10" | "IE_9" | "NODE_0_10" | "NODE_0_12" | "NODE_10" | "NODE_11" | "NODE_12" | "NODE_4" | "NODE_5" | "SAFARI_10" | "SAFARI_12" | "SAFARI_7_0" | "SAFARI_7_1" | "SAFARI_9" | "CHROME" | "CHROME_PREV" | "FF" | "FF_ESR" | "SAFARI" | "SAFARI_8" | "SELF"›[]): *[CustomFeature](README.md#customfeature) | null*

Creates a new feature object equivalent to the intersection of the specified features.

**`example`** 

This will create a new feature object equivalent to <code>[NAME](README.md#name)</code>.

```js
const newFeature = JScrewIt.Feature.commonOf(["ATOB", "NAME"], ["NAME", "SELF"]);
```

This will create a new feature object equivalent to <code>[ANY_DOCUMENT](README.md#any_document)</code>.
This is because both <code>[HTMLDOCUMENT](README.md#htmldocument)</code> and <code>[DOCUMENT](README.md#document)</code> imply
<code>[ANY_DOCUMENT](README.md#any_document)</code>.

```js
const newFeature = JScrewIt.Feature.commonOf("HTMLDOCUMENT", "DOCUMENT");
```

**Parameters:**

Name | Type |
------ | ------ |
`...features` | [Feature](README.md#feature) &#124; "ANY_DOCUMENT" &#124; "ANY_WINDOW" &#124; "ARRAY_ITERATOR" &#124; "ARROW" &#124; "ATOB" &#124; "BARPROP" &#124; "CAPITAL_HTML" &#124; "CONSOLE" &#124; "DOCUMENT" &#124; "DOMWINDOW" &#124; "ESC_HTML_ALL" &#124; "ESC_HTML_QUOT" &#124; "ESC_HTML_QUOT_ONLY" &#124; "ESC_REGEXP_LF" &#124; "ESC_REGEXP_SLASH" &#124; "EXTERNAL" &#124; "FF_SRC" &#124; "FILL" &#124; "FLAT" &#124; "FROM_CODE_POINT" &#124; "FUNCTION_19_LF" &#124; "FUNCTION_22_LF" &#124; "GMT" &#124; "HISTORY" &#124; "HTMLAUDIOELEMENT" &#124; "HTMLDOCUMENT" &#124; "IE_SRC" &#124; "INCR_CHAR" &#124; "INTL" &#124; "LOCALE_INFINITY" &#124; "NAME" &#124; "NODECONSTRUCTOR" &#124; "NO_FF_SRC" &#124; "NO_IE_SRC" &#124; "NO_OLD_SAFARI_ARRAY_ITERATOR" &#124; "NO_V8_SRC" &#124; "SELF_OBJ" &#124; "STATUS" &#124; "UNDEFINED" &#124; "UNEVAL" &#124; "V8_SRC" &#124; "WINDOW" &#124; "ANDRO_4_0" &#124; "ANDRO_4_1" &#124; "ANDRO_4_4" &#124; "AUTO" &#124; "BROWSER" &#124; "CHROME_73" &#124; "COMPACT" &#124; "DEFAULT" &#124; "FF_62" &#124; "IE_10" &#124; "IE_11" &#124; "IE_11_WIN_10" &#124; "IE_9" &#124; "NODE_0_10" &#124; "NODE_0_12" &#124; "NODE_10" &#124; "NODE_11" &#124; "NODE_12" &#124; "NODE_4" &#124; "NODE_5" &#124; "SAFARI_10" &#124; "SAFARI_12" &#124; "SAFARI_7_0" &#124; "SAFARI_7_1" &#124; "SAFARI_9" &#124; "CHROME" &#124; "CHROME_PREV" &#124; "FF" &#124; "FF_ESR" &#124; "SAFARI" &#124; "SAFARI_8" &#124; "SELF" &#124; ReadonlyArray‹[Feature](README.md#feature) &#124; "ANY_DOCUMENT" &#124; "ANY_WINDOW" &#124; "ARRAY_ITERATOR" &#124; "ARROW" &#124; "ATOB" &#124; "BARPROP" &#124; "CAPITAL_HTML" &#124; "CONSOLE" &#124; "DOCUMENT" &#124; "DOMWINDOW" &#124; "ESC_HTML_ALL" &#124; "ESC_HTML_QUOT" &#124; "ESC_HTML_QUOT_ONLY" &#124; "ESC_REGEXP_LF" &#124; "ESC_REGEXP_SLASH" &#124; "EXTERNAL" &#124; "FF_SRC" &#124; "FILL" &#124; "FLAT" &#124; "FROM_CODE_POINT" &#124; "FUNCTION_19_LF" &#124; "FUNCTION_22_LF" &#124; "GMT" &#124; "HISTORY" &#124; "HTMLAUDIOELEMENT" &#124; "HTMLDOCUMENT" &#124; "IE_SRC" &#124; "INCR_CHAR" &#124; "INTL" &#124; "LOCALE_INFINITY" &#124; "NAME" &#124; "NODECONSTRUCTOR" &#124; "NO_FF_SRC" &#124; "NO_IE_SRC" &#124; "NO_OLD_SAFARI_ARRAY_ITERATOR" &#124; "NO_V8_SRC" &#124; "SELF_OBJ" &#124; "STATUS" &#124; "UNDEFINED" &#124; "UNEVAL" &#124; "V8_SRC" &#124; "WINDOW" &#124; "ANDRO_4_0" &#124; "ANDRO_4_1" &#124; "ANDRO_4_4" &#124; "AUTO" &#124; "BROWSER" &#124; "CHROME_73" &#124; "COMPACT" &#124; "DEFAULT" &#124; "FF_62" &#124; "IE_10" &#124; "IE_11" &#124; "IE_11_WIN_10" &#124; "IE_9" &#124; "NODE_0_10" &#124; "NODE_0_12" &#124; "NODE_10" &#124; "NODE_11" &#124; "NODE_12" &#124; "NODE_4" &#124; "NODE_5" &#124; "SAFARI_10" &#124; "SAFARI_12" &#124; "SAFARI_7_0" &#124; "SAFARI_7_1" &#124; "SAFARI_9" &#124; "CHROME" &#124; "CHROME_PREV" &#124; "FF" &#124; "FF_ESR" &#124; "SAFARI" &#124; "SAFARI_8" &#124; "SELF"›[] |

**Returns:** *[CustomFeature](README.md#customfeature) | null*

A feature object, or `null` if no arguments are specified.

###  PredefinedFeature

• **PredefinedFeature**:

###  Feature

• **Feature**: *[FeatureConstructor](README.md#featureconstructor)*

###  canonicalNames

• **canonicalNames**: *[ElementaryFeatureName](README.md#elementaryfeaturename)[]*

*Inherited from [CustomFeature](README.md#customfeature).[canonicalNames](README.md#canonicalnames)*

An array of all elementary feature names included in this feature object, without aliases
and implied features.

###  description

• **description**: *string*

*Overrides [CustomFeature](README.md#customfeature).[description](README.md#optional-description)*

###  elementary

• **elementary**: *boolean*

*Inherited from [Feature](README.md#feature).[elementary](README.md#elementary)*

A boolean value indicating whether this is an elementary feature object.

###  elementaryNames

• **elementaryNames**: *[ElementaryFeatureName](README.md#elementaryfeaturename)[]*

*Inherited from [CustomFeature](README.md#customfeature).[elementaryNames](README.md#elementarynames)*

An array of all elementary feature names included in this feature object, without
aliases.

###  name

• **name**: *[PredefinedFeatureName](README.md#predefinedfeaturename)*

*Overrides [CustomFeature](README.md#customfeature).[name](README.md#optional-name)*

###  includes

▸ **includes**(...`features`: [Feature](README.md#feature) | "ANY_DOCUMENT" | "ANY_WINDOW" | "ARRAY_ITERATOR" | "ARROW" | "ATOB" | "BARPROP" | "CAPITAL_HTML" | "CONSOLE" | "DOCUMENT" | "DOMWINDOW" | "ESC_HTML_ALL" | "ESC_HTML_QUOT" | "ESC_HTML_QUOT_ONLY" | "ESC_REGEXP_LF" | "ESC_REGEXP_SLASH" | "EXTERNAL" | "FF_SRC" | "FILL" | "FLAT" | "FROM_CODE_POINT" | "FUNCTION_19_LF" | "FUNCTION_22_LF" | "GMT" | "HISTORY" | "HTMLAUDIOELEMENT" | "HTMLDOCUMENT" | "IE_SRC" | "INCR_CHAR" | "INTL" | "LOCALE_INFINITY" | "NAME" | "NODECONSTRUCTOR" | "NO_FF_SRC" | "NO_IE_SRC" | "NO_OLD_SAFARI_ARRAY_ITERATOR" | "NO_V8_SRC" | "SELF_OBJ" | "STATUS" | "UNDEFINED" | "UNEVAL" | "V8_SRC" | "WINDOW" | "ANDRO_4_0" | "ANDRO_4_1" | "ANDRO_4_4" | "AUTO" | "BROWSER" | "CHROME_73" | "COMPACT" | "DEFAULT" | "FF_62" | "IE_10" | "IE_11" | "IE_11_WIN_10" | "IE_9" | "NODE_0_10" | "NODE_0_12" | "NODE_10" | "NODE_11" | "NODE_12" | "NODE_4" | "NODE_5" | "SAFARI_10" | "SAFARI_12" | "SAFARI_7_0" | "SAFARI_7_1" | "SAFARI_9" | "CHROME" | "CHROME_PREV" | "FF" | "FF_ESR" | "SAFARI" | "SAFARI_8" | "SELF" | ReadonlyArray‹[Feature](README.md#feature) | "ANY_DOCUMENT" | "ANY_WINDOW" | "ARRAY_ITERATOR" | "ARROW" | "ATOB" | "BARPROP" | "CAPITAL_HTML" | "CONSOLE" | "DOCUMENT" | "DOMWINDOW" | "ESC_HTML_ALL" | "ESC_HTML_QUOT" | "ESC_HTML_QUOT_ONLY" | "ESC_REGEXP_LF" | "ESC_REGEXP_SLASH" | "EXTERNAL" | "FF_SRC" | "FILL" | "FLAT" | "FROM_CODE_POINT" | "FUNCTION_19_LF" | "FUNCTION_22_LF" | "GMT" | "HISTORY" | "HTMLAUDIOELEMENT" | "HTMLDOCUMENT" | "IE_SRC" | "INCR_CHAR" | "INTL" | "LOCALE_INFINITY" | "NAME" | "NODECONSTRUCTOR" | "NO_FF_SRC" | "NO_IE_SRC" | "NO_OLD_SAFARI_ARRAY_ITERATOR" | "NO_V8_SRC" | "SELF_OBJ" | "STATUS" | "UNDEFINED" | "UNEVAL" | "V8_SRC" | "WINDOW" | "ANDRO_4_0" | "ANDRO_4_1" | "ANDRO_4_4" | "AUTO" | "BROWSER" | "CHROME_73" | "COMPACT" | "DEFAULT" | "FF_62" | "IE_10" | "IE_11" | "IE_11_WIN_10" | "IE_9" | "NODE_0_10" | "NODE_0_12" | "NODE_10" | "NODE_11" | "NODE_12" | "NODE_4" | "NODE_5" | "SAFARI_10" | "SAFARI_12" | "SAFARI_7_0" | "SAFARI_7_1" | "SAFARI_9" | "CHROME" | "CHROME_PREV" | "FF" | "FF_ESR" | "SAFARI" | "SAFARI_8" | "SELF"›[]): *boolean*

*Inherited from [CustomFeature](README.md#customfeature).[includes](README.md#includes)*

Determines whether this feature object includes all of the specified features.

**Parameters:**

Name | Type |
------ | ------ |
`...features` | [Feature](README.md#feature) &#124; "ANY_DOCUMENT" &#124; "ANY_WINDOW" &#124; "ARRAY_ITERATOR" &#124; "ARROW" &#124; "ATOB" &#124; "BARPROP" &#124; "CAPITAL_HTML" &#124; "CONSOLE" &#124; "DOCUMENT" &#124; "DOMWINDOW" &#124; "ESC_HTML_ALL" &#124; "ESC_HTML_QUOT" &#124; "ESC_HTML_QUOT_ONLY" &#124; "ESC_REGEXP_LF" &#124; "ESC_REGEXP_SLASH" &#124; "EXTERNAL" &#124; "FF_SRC" &#124; "FILL" &#124; "FLAT" &#124; "FROM_CODE_POINT" &#124; "FUNCTION_19_LF" &#124; "FUNCTION_22_LF" &#124; "GMT" &#124; "HISTORY" &#124; "HTMLAUDIOELEMENT" &#124; "HTMLDOCUMENT" &#124; "IE_SRC" &#124; "INCR_CHAR" &#124; "INTL" &#124; "LOCALE_INFINITY" &#124; "NAME" &#124; "NODECONSTRUCTOR" &#124; "NO_FF_SRC" &#124; "NO_IE_SRC" &#124; "NO_OLD_SAFARI_ARRAY_ITERATOR" &#124; "NO_V8_SRC" &#124; "SELF_OBJ" &#124; "STATUS" &#124; "UNDEFINED" &#124; "UNEVAL" &#124; "V8_SRC" &#124; "WINDOW" &#124; "ANDRO_4_0" &#124; "ANDRO_4_1" &#124; "ANDRO_4_4" &#124; "AUTO" &#124; "BROWSER" &#124; "CHROME_73" &#124; "COMPACT" &#124; "DEFAULT" &#124; "FF_62" &#124; "IE_10" &#124; "IE_11" &#124; "IE_11_WIN_10" &#124; "IE_9" &#124; "NODE_0_10" &#124; "NODE_0_12" &#124; "NODE_10" &#124; "NODE_11" &#124; "NODE_12" &#124; "NODE_4" &#124; "NODE_5" &#124; "SAFARI_10" &#124; "SAFARI_12" &#124; "SAFARI_7_0" &#124; "SAFARI_7_1" &#124; "SAFARI_9" &#124; "CHROME" &#124; "CHROME_PREV" &#124; "FF" &#124; "FF_ESR" &#124; "SAFARI" &#124; "SAFARI_8" &#124; "SELF" &#124; ReadonlyArray‹[Feature](README.md#feature) &#124; "ANY_DOCUMENT" &#124; "ANY_WINDOW" &#124; "ARRAY_ITERATOR" &#124; "ARROW" &#124; "ATOB" &#124; "BARPROP" &#124; "CAPITAL_HTML" &#124; "CONSOLE" &#124; "DOCUMENT" &#124; "DOMWINDOW" &#124; "ESC_HTML_ALL" &#124; "ESC_HTML_QUOT" &#124; "ESC_HTML_QUOT_ONLY" &#124; "ESC_REGEXP_LF" &#124; "ESC_REGEXP_SLASH" &#124; "EXTERNAL" &#124; "FF_SRC" &#124; "FILL" &#124; "FLAT" &#124; "FROM_CODE_POINT" &#124; "FUNCTION_19_LF" &#124; "FUNCTION_22_LF" &#124; "GMT" &#124; "HISTORY" &#124; "HTMLAUDIOELEMENT" &#124; "HTMLDOCUMENT" &#124; "IE_SRC" &#124; "INCR_CHAR" &#124; "INTL" &#124; "LOCALE_INFINITY" &#124; "NAME" &#124; "NODECONSTRUCTOR" &#124; "NO_FF_SRC" &#124; "NO_IE_SRC" &#124; "NO_OLD_SAFARI_ARRAY_ITERATOR" &#124; "NO_V8_SRC" &#124; "SELF_OBJ" &#124; "STATUS" &#124; "UNDEFINED" &#124; "UNEVAL" &#124; "V8_SRC" &#124; "WINDOW" &#124; "ANDRO_4_0" &#124; "ANDRO_4_1" &#124; "ANDRO_4_4" &#124; "AUTO" &#124; "BROWSER" &#124; "CHROME_73" &#124; "COMPACT" &#124; "DEFAULT" &#124; "FF_62" &#124; "IE_10" &#124; "IE_11" &#124; "IE_11_WIN_10" &#124; "IE_9" &#124; "NODE_0_10" &#124; "NODE_0_12" &#124; "NODE_10" &#124; "NODE_11" &#124; "NODE_12" &#124; "NODE_4" &#124; "NODE_5" &#124; "SAFARI_10" &#124; "SAFARI_12" &#124; "SAFARI_7_0" &#124; "SAFARI_7_1" &#124; "SAFARI_9" &#124; "CHROME" &#124; "CHROME_PREV" &#124; "FF" &#124; "FF_ESR" &#124; "SAFARI" &#124; "SAFARI_8" &#124; "SELF"›[] |

**Returns:** *boolean*

`true` if this feature object includes all of the specified features; otherwise, `false`.
If no arguments are specified, the return value is `true`.

###  restrict

▸ **restrict**(`environment`: "forced-strict-mode" | "web-worker", `engineFeatureObjs?`: keyof PredefinedFeature[]): *[CustomFeature](README.md#customfeature)*

*Inherited from [CustomFeature](README.md#customfeature).[restrict](README.md#restrict)*

Creates a new feature object from this feature by removing elementary features that are
not available inside a particular environment.

This method is useful to selectively exclude features that are not available inside a web
worker.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`environment` | "forced-strict-mode" &#124; "web-worker" |   The environment to which this feature should be restricted. Two environments are currently supported.  <dl>  <dt><code>"forced-strict-mode"</code></dt> <dd> Removes features that are not available in environments that require strict mode code. </dd>  <dt><code>"web-worker"</code></dt> <dd>Removes features that are not available inside web workers.</dd>  </dl>  |
`engineFeatureObjs?` | keyof PredefinedFeature[] |   An array of predefined feature objects, each corresponding to a particular engine in which the restriction should be enacted. If this parameter is omitted, the restriction is enacted in all engines.  |

**Returns:** *[CustomFeature](README.md#customfeature)*

###  CompatibleFeatureArray

Ƭ **CompatibleFeatureArray**: *keyof FeatureElement[]*

An array containing any number of feature objects or names or aliases of predefined features,
in no particular order.

All of the specified features need to be compatible, so that their union can be constructed.

**`remarks`** 

Methods that accept parameters of this type throw an error if the specified features are not
mutually compatible.

###  ElementaryFeatureName

Ƭ **ElementaryFeatureName**: *"ANY_DOCUMENT" | "ANY_WINDOW" | "ARRAY_ITERATOR" | "ARROW" | "ATOB" | "BARPROP" | "CAPITAL_HTML" | "CONSOLE" | "DOCUMENT" | "DOMWINDOW" | "ESC_HTML_ALL" | "ESC_HTML_QUOT" | "ESC_HTML_QUOT_ONLY" | "ESC_REGEXP_LF" | "ESC_REGEXP_SLASH" | "EXTERNAL" | "FF_SRC" | "FILL" | "FLAT" | "FROM_CODE_POINT" | "FUNCTION_19_LF" | "FUNCTION_22_LF" | "GMT" | "HISTORY" | "HTMLAUDIOELEMENT" | "HTMLDOCUMENT" | "IE_SRC" | "INCR_CHAR" | "INTL" | "LOCALE_INFINITY" | "NAME" | "NODECONSTRUCTOR" | "NO_FF_SRC" | "NO_IE_SRC" | "NO_OLD_SAFARI_ARRAY_ITERATOR" | "NO_V8_SRC" | "SELF_OBJ" | "STATUS" | "UNDEFINED" | "UNEVAL" | "V8_SRC" | "WINDOW"*

Name of an elementary feature.

###  FeatureElement

Ƭ **FeatureElement**: *[Feature](README.md#feature) | keyof FeatureAll*

A feature object or a name or alias of a predefined feature.

**`remarks`** 

Methods that accept parameters of this type throw an error if the specified value is neither
a feature object nor a name or alias of a predefined feature.

###  PredefinedFeatureName

Ƭ **PredefinedFeatureName**: *[ElementaryFeatureName](README.md#elementaryfeaturename) | "ANDRO_4_0" | "ANDRO_4_1" | "ANDRO_4_4" | "AUTO" | "BROWSER" | "CHROME_73" | "COMPACT" | "DEFAULT" | "FF_62" | "IE_10" | "IE_11" | "IE_11_WIN_10" | "IE_9" | "NODE_0_10" | "NODE_0_12" | "NODE_10" | "NODE_11" | "NODE_12" | "NODE_4" | "NODE_5" | "SAFARI_10" | "SAFARI_12" | "SAFARI_7_0" | "SAFARI_7_1" | "SAFARI_9"*

Name of a predefined feature.

### `Const` Feature

• **Feature**: *[FeatureConstructor](README.md#featureconstructor)*

###  encode

▸ **encode**(`input`: string, `options?`: [EncodeOptions](README.md#encodeoptions)): *string*

Encodes a given string into JSFuck.

**`throws`** 

An `Error` is thrown under the following circumstances.
 - The specified string cannot be encoded with the specified options.
 - Some unknown features were specified.
 - A combination of mutually incompatible features was specified.
 - The option `runAs` (or `wrapWith`) was specified with an invalid value.

Also, an out of memory condition may occur when processing very large data.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`input` | string |   The string to encode.  |
`options?` | [EncodeOptions](README.md#encodeoptions) |   An optional object specifying encoding options.  |

**Returns:** *string*

The encoded string.
