# Interface: EncodeOptions

## Hierarchy

* **EncodeOptions**

## Table of contents

### Properties

- [features](encodeoptions.md#features)
- [runAs](encodeoptions.md#runas)
- [trimCode](encodeoptions.md#trimcode)
- [wrapWith](encodeoptions.md#wrapwith)

## Properties

### features

• `Optional` **features**: *undefined* \| [*Feature*](../README.md#feature) \| *ANDRO_4_0* \| *ANDRO_4_1* \| *ANDRO_4_4* \| *ANY_DOCUMENT* \| *ANY_WINDOW* \| *ARRAY_ITERATOR* \| *ARROW* \| *AT* \| *ATOB* \| *AUTO* \| *BARPROP* \| *BROWSER* \| *CAPITAL_HTML* \| *CHROME* \| *CHROME_86* \| *CHROME_PREV* \| *COMPACT* \| *CONSOLE* \| *DEFAULT* \| *DOCUMENT* \| *DOMWINDOW* \| *ESC_HTML_ALL* \| *ESC_HTML_QUOT* \| *ESC_HTML_QUOT_ONLY* \| *ESC_REGEXP_LF* \| *ESC_REGEXP_SLASH* \| *EXTERNAL* \| *FF* \| *FF_78* \| *FF_83* \| *FF_ESR* \| *FF_PREV* \| *FF_SRC* \| *FILL* \| *FLAT* \| *FROM_CODE_POINT* \| *FUNCTION_19_LF* \| *FUNCTION_22_LF* \| *GLOBAL_UNDEFINED* \| *GMT* \| *HISTORY* \| *HTMLAUDIOELEMENT* \| *HTMLDOCUMENT* \| *IE_10* \| *IE_11* \| *IE_11_WIN_10* \| *IE_9* \| *IE_SRC* \| *INCR_CHAR* \| *INTL* \| *LOCALE_INFINITY* \| *LOCALE_NUMERALS* \| *LOCALE_NUMERALS_EXT* \| *NAME* \| *NODECONSTRUCTOR* \| *NODE_0_10* \| *NODE_0_12* \| *NODE_10* \| *NODE_11* \| *NODE_12* \| *NODE_13* \| *NODE_15* \| *NODE_4* \| *NODE_5* \| *NO_FF_SRC* \| *NO_IE_SRC* \| *NO_OLD_SAFARI_ARRAY_ITERATOR* \| *NO_V8_SRC* \| *OBJECT_UNDEFINED* \| *PLAIN_INTL* \| *REGEXP_STRING_ITERATOR* \| *SAFARI* \| *SAFARI_10* \| *SAFARI_12* \| *SAFARI_13* \| *SAFARI_14_0_1* \| *SAFARI_7_0* \| *SAFARI_7_1* \| *SAFARI_8* \| *SAFARI_9* \| *SELF* \| *SELF_OBJ* \| *SHORT_LOCALES* \| *STATUS* \| *UNDEFINED* \| *V8_SRC* \| *WINDOW* \| [*CompatibleFeatureArray*](../README.md#compatiblefeaturearray)

Specifies the features available in the engines that evaluate the encoded output.

If this parameter is unspecified, [`JScrewIt.Feature.DEFAULT`](featureconstructor.md#default) is assumed: this
ensures maximum compatibility but also generates the largest code.
To generate shorter code, specify all features available in all target engines explicitly.

___

### runAs

• `Optional` **runAs**: *undefined* \| *call* \| *eval* \| *express* \| *express-call* \| *express-eval* \| *none*

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
Produces code evaluating to the result of invoking <code>eval</code> with the specified input
string as parameter.
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
Applies the code generation process of both <code>"express"</code> and <code>"call"</code>
and returns the shortest output.
</dd>

<dt><code>"express-eval"</code> (default)</dt>
<dd>
Applies the code generation process of both <code>"express"</code> and <code>"eval"</code>
and returns the shortest output.
</dd>

<dt><code>"none"</code></dt>
<dd>
Produces JSFuck code that translates to the specified input string (except for trimmed parts
when used in conjunction with the option <code>trimCode</code>).
Unlike other methods, <code>"none"</code> does not generate executable code, but rather a
plain string.
</dd>

</dl>

___

### trimCode

• `Optional` **trimCode**: *undefined* \| *boolean*

If this parameter is truthy, lines in the beginning and in the end of the file containing
nothing but space characters and JavaScript comments are removed from the generated output.
A newline terminator in the last preserved line is also removed.

This option is especially useful to strip banner comments and trailing newline characters
which are sometimes found in minified scripts.

Using this option may produce unexpected results if the input is not well-formed JavaScript
code.

___

### wrapWith

• `Optional` **wrapWith**: *undefined* \| *call* \| *eval* \| *express* \| *express-call* \| *express-eval* \| *none*

An alias for `runAs`.
