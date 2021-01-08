# Interface: Feature

Objects of this type indicate which of the capabilities that JScrewIt can use to minimize the
length of its output are available in a particular JavaScript engine.

JScrewIt comes with a set of predefined feature objects exposed as property values of
`JScrewIt.Feature` or [`JScrewIt.Feature.ALL`](featureconstructor.md#all), where the property name is the feature's
name or alias.

Besides these predefined features, it is possible to construct custom features from the union or
intersection of other features.

Among the predefined features, there are some special ones called *elementary* features.
Elementary features either cannot be expressed as a union of any number of other features, or
they are different from such a union in that they exclude some other feature not excluded by
their elementary components.
All other features, called *composite* features, can be constructed as a union of zero or more
elementary features.
Two of the predefined composite features are particularly important: <code>[DEFAULT](featureconstructor.md#default)</code> is
the empty feature, indicating that no elementary feature is available at all;
<code>[AUTO](featureconstructor.md#auto)</code> is the union of all elementary features available in the current engine.

Not all features can be available at the same time: some features are necessarily incompatible,
meaning that they mutually exclude each other, and thus their union cannot be constructed.

## Hierarchy

* **Feature**

## Index

### Properties

* [canonicalNames](feature.md#canonicalnames)
* [elementary](feature.md#elementary)
* [elementaryNames](feature.md#elementarynames)
* [name](feature.md#name)

### Methods

* [includes](feature.md#includes)
* [restrict](feature.md#restrict)

## Properties

### canonicalNames

• `Readonly` **canonicalNames**: [*ElementaryFeatureName*](../README.md#elementaryfeaturename)[]

An array of all elementary feature names included in this feature object, without aliases and
implied features.

___

### elementary

• `Readonly` **elementary**: *boolean*

A boolean value indicating whether this is an elementary feature object.

___

### elementaryNames

• `Readonly` **elementaryNames**: [*ElementaryFeatureName*](../README.md#elementaryfeaturename)[]

An array of all elementary feature names included in this feature object, without aliases.

___

### name

• `Optional` **name**: *undefined* \| *string*

The primary name of this feature object, useful for identification purpose.

All predefined features have a name; custom features may be optionally assigned a name, too.
If a name is assigned, it will be used when the feature is converted into a string.

## Methods

### includes

▸ **includes**(...`features`: ([*Feature*](../README.md#feature) \| *ANDRO_4_0* \| *ANDRO_4_1* \| *ANDRO_4_4* \| *ANY_DOCUMENT* \| *ANY_WINDOW* \| *ARRAY_ITERATOR* \| *ARROW* \| *ATOB* \| *AUTO* \| *BARPROP* \| *BROWSER* \| *CAPITAL_HTML* \| *CHROME* \| *CHROME_86* \| *CHROME_PREV* \| *COMPACT* \| *CONSOLE* \| *DEFAULT* \| *DOCUMENT* \| *DOMWINDOW* \| *ESC_HTML_ALL* \| *ESC_HTML_QUOT* \| *ESC_HTML_QUOT_ONLY* \| *ESC_REGEXP_LF* \| *ESC_REGEXP_SLASH* \| *EXTERNAL* \| *FF* \| *FF_78* \| *FF_83* \| *FF_ESR* \| *FF_PREV* \| *FF_SRC* \| *FILL* \| *FLAT* \| *FROM_CODE_POINT* \| *FUNCTION_19_LF* \| *FUNCTION_22_LF* \| *GLOBAL_UNDEFINED* \| *GMT* \| *HISTORY* \| *HTMLAUDIOELEMENT* \| *HTMLDOCUMENT* \| *IE_10* \| *IE_11* \| *IE_11_WIN_10* \| *IE_9* \| *IE_SRC* \| *INCR_CHAR* \| *INTL* \| *LOCALE_INFINITY* \| *LOCALE_NUMERALS* \| *LOCALE_NUMERALS_EXT* \| *NAME* \| *NODECONSTRUCTOR* \| *NODE_0_10* \| *NODE_0_12* \| *NODE_10* \| *NODE_11* \| *NODE_12* \| *NODE_13* \| *NODE_15* \| *NODE_4* \| *NODE_5* \| *NO_FF_SRC* \| *NO_IE_SRC* \| *NO_OLD_SAFARI_ARRAY_ITERATOR* \| *NO_V8_SRC* \| *OBJECT_UNDEFINED* \| *PLAIN_INTL* \| *REGEXP_STRING_ITERATOR* \| *SAFARI* \| *SAFARI_10* \| *SAFARI_12* \| *SAFARI_13* \| *SAFARI_14_0_1* \| *SAFARI_7_0* \| *SAFARI_7_1* \| *SAFARI_8* \| *SAFARI_9* \| *SELF* \| *SELF_OBJ* \| *SHORT_LOCALES* \| *STATUS* \| *UNDEFINED* \| *V8_SRC* \| *WINDOW* \| [*CompatibleFeatureArray*](../README.md#compatiblefeaturearray))[]): *boolean*

Determines whether this feature object includes all of the specified features.

#### Parameters:

Name | Type |
------ | ------ |
`...features` | ([*Feature*](../README.md#feature) \| *ANDRO_4_0* \| *ANDRO_4_1* \| *ANDRO_4_4* \| *ANY_DOCUMENT* \| *ANY_WINDOW* \| *ARRAY_ITERATOR* \| *ARROW* \| *ATOB* \| *AUTO* \| *BARPROP* \| *BROWSER* \| *CAPITAL_HTML* \| *CHROME* \| *CHROME_86* \| *CHROME_PREV* \| *COMPACT* \| *CONSOLE* \| *DEFAULT* \| *DOCUMENT* \| *DOMWINDOW* \| *ESC_HTML_ALL* \| *ESC_HTML_QUOT* \| *ESC_HTML_QUOT_ONLY* \| *ESC_REGEXP_LF* \| *ESC_REGEXP_SLASH* \| *EXTERNAL* \| *FF* \| *FF_78* \| *FF_83* \| *FF_ESR* \| *FF_PREV* \| *FF_SRC* \| *FILL* \| *FLAT* \| *FROM_CODE_POINT* \| *FUNCTION_19_LF* \| *FUNCTION_22_LF* \| *GLOBAL_UNDEFINED* \| *GMT* \| *HISTORY* \| *HTMLAUDIOELEMENT* \| *HTMLDOCUMENT* \| *IE_10* \| *IE_11* \| *IE_11_WIN_10* \| *IE_9* \| *IE_SRC* \| *INCR_CHAR* \| *INTL* \| *LOCALE_INFINITY* \| *LOCALE_NUMERALS* \| *LOCALE_NUMERALS_EXT* \| *NAME* \| *NODECONSTRUCTOR* \| *NODE_0_10* \| *NODE_0_12* \| *NODE_10* \| *NODE_11* \| *NODE_12* \| *NODE_13* \| *NODE_15* \| *NODE_4* \| *NODE_5* \| *NO_FF_SRC* \| *NO_IE_SRC* \| *NO_OLD_SAFARI_ARRAY_ITERATOR* \| *NO_V8_SRC* \| *OBJECT_UNDEFINED* \| *PLAIN_INTL* \| *REGEXP_STRING_ITERATOR* \| *SAFARI* \| *SAFARI_10* \| *SAFARI_12* \| *SAFARI_13* \| *SAFARI_14_0_1* \| *SAFARI_7_0* \| *SAFARI_7_1* \| *SAFARI_8* \| *SAFARI_9* \| *SELF* \| *SELF_OBJ* \| *SHORT_LOCALES* \| *STATUS* \| *UNDEFINED* \| *V8_SRC* \| *WINDOW* \| [*CompatibleFeatureArray*](../README.md#compatiblefeaturearray))[] |

**Returns:** *boolean*

`true` if this feature object includes all of the specified features; otherwise, `false`.
If no arguments are specified, the return value is `true`.

___

### restrict

▸ **restrict**(`environment`: *forced-strict-mode* \| *web-worker*, `engineFeatureObjs?`: readonly [*PredefinedFeature*](predefinedfeature.md)[]): [*CustomFeature*](customfeature.md)

Creates a new feature object from this feature by removing elementary features that are not
available inside a particular environment.

This method is useful to selectively exclude features that are not available inside a web
worker.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`environment` | *forced-strict-mode* \| *web-worker* |   The environment to which this feature should be restricted. Two environments are currently supported.  <dl>  <dt><code>"forced-strict-mode"</code></dt> <dd> Removes features that are not available in environments that require strict mode code. </dd>  <dt><code>"web-worker"</code></dt> <dd>Removes features that are not available inside web workers.</dd>  </dl>    |
`engineFeatureObjs?` | readonly [*PredefinedFeature*](predefinedfeature.md)[] |   An array of predefined feature objects, each corresponding to a particular engine in which the restriction should be enacted. If this parameter is omitted, the restriction is enacted in all engines.    |

**Returns:** [*CustomFeature*](customfeature.md)
