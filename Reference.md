## Objects
<dl>
<dt><a href="#JScrewIt">JScrewIt</a> : <code>object</code></dt>
<dd></dd>
</dl>
## Typedefs
<dl>
<dt><a href="#FeatureElement">FeatureElement</a> : <code><a href="#JScrewIt.Feature">Feature</a></code> | <code>string</code></dt>
<dd><p>A feature object or name or alias of a predefined feature.</p>
</dd>
<dt><a href="#CompatibleFeatureArray">CompatibleFeatureArray</a> : <code><a href="#FeatureElement">Array.&lt;FeatureElement&gt;</a></code></dt>
<dd><p>An array containing any number of feature objects or names or aliases of predefined features,
in no particular order.</p>
<p>All of the specified features need to be compatible, so that their union can be constructed.</p>
</dd>
</dl>
<a name="JScrewIt"></a>
## JScrewIt : <code>object</code>
**Kind**: global namespace  

* [JScrewIt](#JScrewIt) : <code>object</code>
  * [.Feature](#JScrewIt.Feature)
    * [new Feature([...feature])](#new_JScrewIt.Feature_new)
    * _instance_
      * [.canonicalNames](#JScrewIt.Feature+canonicalNames) : <code>Array.&lt;string&gt;</code>
      * [.description](#JScrewIt.Feature+description) : <code>string</code> &#124; <code>undefined</code>
      * [.elementaryNames](#JScrewIt.Feature+elementaryNames) : <code>Array.&lt;string&gt;</code>
      * [.name](#JScrewIt.Feature+name) : <code>string</code> &#124; <code>undefined</code>
      * [.includes([...feature])](#JScrewIt.Feature+includes) ⇒ <code>boolean</code>
      * [.toString()](#JScrewIt.Feature+toString) ⇒ <code>string</code>
    * _static_
      * [.ALL](#JScrewIt.Feature.ALL) : <code>object</code>
      * [.areCompatible([features])](#JScrewIt.Feature.areCompatible) ⇒ <code>boolean</code>
      * [.areEqual([...feature])](#JScrewIt.Feature.areEqual) ⇒ <code>boolean</code>
      * [.commonOf([...feature])](#JScrewIt.Feature.commonOf) ⇒ <code>[Feature](#JScrewIt.Feature)</code> &#124; <code>null</code>
  * [.encode(input, [options])](#JScrewIt.encode) ⇒ <code>string</code>

<a name="JScrewIt.Feature"></a>
### JScrewIt.Feature
Objects of this type indicate which of the capabilities that JScrewIt can use to minimize the
length of its output are available in a particular JavaScript engine.

JScrewIt comes with a set of predefined feature objects exposed as property values of
`JScrewIt.Feature` or [`JScrewIt.Feature.ALL`](#JScrewIt.Feature.ALL), where the property
name is the feature's name or an alias thereof.

Besides these predefined features, it is possible to construct custom features from the union
or intersection of other features.

Among the predefined features, there are some special ones called _elementary_ features that
cannot be expressed as a union of any number of other elementary features.
All other features, called _composite_ features, can be constructed as a union of zero or
more elementary features.
Two of the predefined composite features are particularly important:
[`DEFAULT`](Features.md#DEFAULT) is the empty feature, indicating that no elementary feature
is available at all; [`AUTO`](Features.md#AUTO) is the union of all elementary features
available in the current engine.

Not all features can be available at the same time: some features are necessarily
incompatible, meaning that they mutually exclude each other, and thus their union cannot be
constructed.

**Kind**: static class of <code>[JScrewIt](#JScrewIt)</code>  

* [.Feature](#JScrewIt.Feature)
  * [new Feature([...feature])](#new_JScrewIt.Feature_new)
  * _instance_
    * [.canonicalNames](#JScrewIt.Feature+canonicalNames) : <code>Array.&lt;string&gt;</code>
    * [.description](#JScrewIt.Feature+description) : <code>string</code> &#124; <code>undefined</code>
    * [.elementaryNames](#JScrewIt.Feature+elementaryNames) : <code>Array.&lt;string&gt;</code>
    * [.name](#JScrewIt.Feature+name) : <code>string</code> &#124; <code>undefined</code>
    * [.includes([...feature])](#JScrewIt.Feature+includes) ⇒ <code>boolean</code>
    * [.toString()](#JScrewIt.Feature+toString) ⇒ <code>string</code>
  * _static_
    * [.ALL](#JScrewIt.Feature.ALL) : <code>object</code>
    * [.areCompatible([features])](#JScrewIt.Feature.areCompatible) ⇒ <code>boolean</code>
    * [.areEqual([...feature])](#JScrewIt.Feature.areEqual) ⇒ <code>boolean</code>
    * [.commonOf([...feature])](#JScrewIt.Feature.commonOf) ⇒ <code>[Feature](#JScrewIt.Feature)</code> &#124; <code>null</code>

<a name="new_JScrewIt.Feature_new"></a>
#### new Feature([...feature])
Creates a new feature object from the union of the specified features.

The constructor can be used with or without the `new` operator, e.g.
`new JScrewIt.Feature(feature1, feature2)` or `JScrewIt.Feature(feature1, feature2)`.
If no arguments are specified, the new feature object will be equivalent to
[DEFAULT](Features.md#DEFAULT).

**Throws**:

- <code>ReferenceError</code> The specified features are not compatible with each other.


| Param | Type |
| --- | --- |
| [...feature] | <code>[FeatureElement](#FeatureElement)</code> &#124; <code>[CompatibleFeatureArray](#CompatibleFeatureArray)</code> | 

**Example**  
The following statements are equivalent, and will all construct a new feature object
including both [ANY_DOCUMENT](Features.md#ANY_DOCUMENT) and
[ANY_WINDOW](Features.md#ANY_WINDOW).

```js
new JScrewIt.Feature("ANY_DOCUMENT", "ANY_WINDOW");
```

```js
new JScrewIt.Feature(JScrewIt.Feature.ANY_DOCUMENT, JScrewIt.Feature.ANY_WINDOW);
```

```js
new JScrewIt.Feature([JScrewIt.Feature.ANY_DOCUMENT, JScrewIt.Feature.ANY_WINDOW]);
```
<a name="JScrewIt.Feature+canonicalNames"></a>
#### feature.canonicalNames : <code>Array.&lt;string&gt;</code>
An array of all elementary feature names included in this feature object, without aliases
and implied features.

**Kind**: instance property of <code>[Feature](#JScrewIt.Feature)</code>  
<a name="JScrewIt.Feature+description"></a>
#### feature.description : <code>string</code> &#124; <code>undefined</code>
A short description of this feature object in plain English.

All predefined features have a description.
If desired, custom features may be assigned a description, too.

**Kind**: instance property of <code>[Feature](#JScrewIt.Feature)</code>  
<a name="JScrewIt.Feature+elementaryNames"></a>
#### feature.elementaryNames : <code>Array.&lt;string&gt;</code>
An array of all elementary feature names included in this feature object, without
aliases.

**Kind**: instance property of <code>[Feature](#JScrewIt.Feature)</code>  
<a name="JScrewIt.Feature+name"></a>
#### feature.name : <code>string</code> &#124; <code>undefined</code>
The primary name of this feature object, useful for identification purpose.

All predefined features have a name.
If desired, custom features may be assigned a name, too.

**Kind**: instance property of <code>[Feature](#JScrewIt.Feature)</code>  
<a name="JScrewIt.Feature+includes"></a>
#### feature.includes([...feature]) ⇒ <code>boolean</code>
Determines whether this feature object includes all of the specified features.

**Kind**: instance method of <code>[Feature](#JScrewIt.Feature)</code>  
**Returns**: <code>boolean</code> - `true` if this feature object includes all of the specified features; otherwise, `false`.
If no arguments are specified, the return value is `true`.  

| Param | Type |
| --- | --- |
| [...feature] | <code>[FeatureElement](#FeatureElement)</code> &#124; <code>[CompatibleFeatureArray](#CompatibleFeatureArray)</code> | 

<a name="JScrewIt.Feature+toString"></a>
#### feature.toString() ⇒ <code>string</code>
Returns a string representation of this feature object.

**Kind**: instance method of <code>[Feature](#JScrewIt.Feature)</code>  
**Returns**: <code>string</code> - A string representation of this feature object.  
<a name="JScrewIt.Feature.ALL"></a>
#### Feature.ALL : <code>object</code>
A map of predefined feature objects accessed by name or alias.

For an exhaustive list of all features, see the [Feature Reference](Features.md).

**Kind**: static property of <code>[Feature](#JScrewIt.Feature)</code>  
**Example**  
This will produce an array with the names and aliases of all predefined features.

```js
Object.keys(JScrewIt.Feature.ALL)
```

This will determine if a particular feature object is predefined or not.

```js
featureObj === JScrewIt.Feature.ALL[featureObj.name]
```
<a name="JScrewIt.Feature.areCompatible"></a>
#### Feature.areCompatible([features]) ⇒ <code>boolean</code>
Determines whether the specified features are compatible with each other.

**Kind**: static method of <code>[Feature](#JScrewIt.Feature)</code>  
**Returns**: <code>boolean</code> - `true` if the specified features are compatible with each other; otherwise, `false`.
If the array argument contains less than two features, the return value is `true`.  

| Param | Type |
| --- | --- |
| [features] | <code>[Array.&lt;FeatureElement&gt;](#FeatureElement)</code> | 

**Example**  
```js
// false: only one of "V8_SRC" or "IE_SRC" may be available.
JScrewIt.Feature.areCompatible(["V8_SRC", "IE_SRC"])
```

```js
// true
JScrewIt.Feature.areCompatible([JScrewIt.Feature.DEFAULT, JScrewIt.Feature.FILL])
```
<a name="JScrewIt.Feature.areEqual"></a>
#### Feature.areEqual([...feature]) ⇒ <code>boolean</code>
Determines whether all of the specified features are equivalent.

**Kind**: static method of <code>[Feature](#JScrewIt.Feature)</code>  
**Returns**: <code>boolean</code> - `true` if all of the specified features are equivalent; otherwise, `false`.
If less than two arguments are specified, the return value is `true`.  

| Param | Type |
| --- | --- |
| [...feature] | <code>[FeatureElement](#FeatureElement)</code> &#124; <code>[CompatibleFeatureArray](#CompatibleFeatureArray)</code> | 

**Example**  
```js
// false
JScrewIt.Feature.areEqual(JScrewIt.Feature.CHROME, JScrewIt.Feature.FIREFOX)
```

```js
// true
JScrewIt.Feature.areEqual("DEFAULT", [])
```
<a name="JScrewIt.Feature.commonOf"></a>
#### Feature.commonOf([...feature]) ⇒ <code>[Feature](#JScrewIt.Feature)</code> &#124; <code>null</code>
Creates a new feature object equivalent to the intersection of the specified features.

**Kind**: static method of <code>[Feature](#JScrewIt.Feature)</code>  
**Returns**: <code>[Feature](#JScrewIt.Feature)</code> &#124; <code>null</code> - A feature object, or `null` if no arguments are specified.  

| Param | Type |
| --- | --- |
| [...feature] | <code>[FeatureElement](#FeatureElement)</code> &#124; <code>[CompatibleFeatureArray](#CompatibleFeatureArray)</code> | 

**Example**  
This will create a new feature object equivalent to [NAME](Features.md#NAME).

```js
var newFeature = JScrewIt.Feature.commonOf(["ATOB", "NAME"], ["NAME", "SELF"]);
```

This will create a new feature object equivalent to
[ANY_DOCUMENT](Features.md#ANY_DOCUMENT).
This is because both [HTMLDOCUMENT](Features.md#HTMLDOCUMENT) and
[DOCUMENT](Features.md#DOCUMENT) imply [ANY_DOCUMENT](Features.md#ANY_DOCUMENT).

```js
var newFeature = JScrewIt.Feature.commonOf("HTMLDOCUMENT", "DOCUMENT");
```
<a name="JScrewIt.encode"></a>
### JScrewIt.encode(input, [options]) ⇒ <code>string</code>
Encodes a given string into JSFuck.

**Kind**: static method of <code>[JScrewIt](#JScrewIt)</code>  
**Returns**: <code>string</code> - The encoded string.  
**Throws**:

- In the hypothetical case that the input string is too complex to be encoded, this function
throws an `Error` with the message "Encoding failed".
Also, an out of memory condition may occur when processing very large data.

If some unknown features are specified, a `ReferenceError` is thrown.

If the option `wrapWith` is specified with an invalid value, an `Error` with the message
"Invalid value for option wrapWith" is thrown.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| input | <code>string</code> |  | The string to encode. |
| [options] | <code>object</code> | <code>{ }</code> | An optional object specifying encoding options. |
| [options.features] | <code>[FeatureElement](#FeatureElement)</code> &#124; <code>[CompatibleFeatureArray](#CompatibleFeatureArray)</code> | <code>JScrewIt.Feature.DEFAULT</code> | Specifies the features available on the engines that evaluate the encoded output. If this parameter is an empty array or unspecified, `JScrewIt.Feature.DEFAULT` is assumed: this ensures maximum compatibility but also generates the largest code. To generate shorter code, specify all features available on all target engines explicitly. |
| [options.trimCode] | <code>boolean</code> | <code>false</code> | If this parameter is truthy, lines in the beginning and in the end of the file containing nothing but space characters and JavaScript comments are removed from the generated output. A newline terminator in the last preserved line is also removed. This option is especially useful to strip banner comments and trailing newline characters which are sometimes found in minified scripts. Using this option may produce unexpected results if the input is not well-formed JavaScript code. |
| [options.wrapWith] | <code>string</code> | <code>&quot;none&quot;</code> | This option controls the type of code generated from the given input. Allowed values are listed below. <dl> <dt><code>"none"</code> (default)</dt> <dd> Produces a string evaluating to specified input string (except for trimmed parts when used in conjunction with the option <code>trimCode</code>).</dd> <dt><code>"call"</code></dt> <dd> Produces code evaluating to a call to a function whose body contains the specified input string.</dd> <dt><code>"eval"</code></dt> <dd> Produces code evaluating to the result of invoking <code>eval</code> with the specified input string as parameter.</dd> </dl> |

<a name="FeatureElement"></a>
## FeatureElement : <code>[Feature](#JScrewIt.Feature)</code> &#124; <code>string</code>
A feature object or name or alias of a predefined feature.

**Kind**: global typedef  
**Throws**:

- <code>ReferenceError</code> The specified value is neither a feature object nor a name or alias of a predefined feature.

<a name="CompatibleFeatureArray"></a>
## CompatibleFeatureArray : <code>[Array.&lt;FeatureElement&gt;](#FeatureElement)</code>
An array containing any number of feature objects or names or aliases of predefined features,
in no particular order.

All of the specified features need to be compatible, so that their union can be constructed.

**Kind**: global typedef  
**Throws**:

- <code>ReferenceError</code> The specified features are not compatible with each other.

