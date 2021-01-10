# Interface: PredefinedFeature

## Hierarchy

* [*Feature*](../README.md#feature)

  ↳ **PredefinedFeature**

  ↳↳ [*ElementaryFeature*](elementaryfeature.md)

## Table of contents

### Properties

- [canonicalNames](predefinedfeature.md#canonicalnames)
- [elementary](predefinedfeature.md#elementary)
- [elementaryNames](predefinedfeature.md#elementarynames)
- [name](predefinedfeature.md#name)

### Methods

- [includes](predefinedfeature.md#includes)
- [restrict](predefinedfeature.md#restrict)

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

• `Readonly` **name**: [*PredefinedFeatureName*](../README.md#predefinedfeaturename)

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
