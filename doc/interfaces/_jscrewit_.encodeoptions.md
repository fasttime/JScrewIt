[JScrewIt](../README.md) › ["jscrewit"](../modules/_jscrewit_.md) › [EncodeOptions](_jscrewit_.encodeoptions.md)

# Interface: EncodeOptions

## Hierarchy

* **EncodeOptions**

## Index

### Properties

* [features](_jscrewit_.encodeoptions.md#optional-features)
* [runAs](_jscrewit_.encodeoptions.md#optional-runas)
* [trimCode](_jscrewit_.encodeoptions.md#optional-trimcode)
* [wrapWith](_jscrewit_.encodeoptions.md#optional-wrapwith)

## Properties

### `Optional` features

• **features**? : *[FeatureElement](../modules/_jscrewit_.md#featureelement) | [CompatibleFeatureArray](../modules/_jscrewit_.md#compatiblefeaturearray)*

*Defined in [encode.d.ts:15](https://github.com/fasttime/JScrewIt/blob/2.11.1/lib/encode.d.ts#L15)*

Specifies the features available in the engines that evaluate the encoded output.

If this parameter is unspecified, <code>[JScrewIt.Feature.DEFAULT](_jscrewit_.featureall.md#default)</code> is
assumed: this ensures maximum compatibility but also generates the largest code.
To generate shorter code, specify all features available in all target engines
explicitly.

___

### `Optional` runAs

• **runAs**? : *"call" | "eval" | "express" | "express-call" | "express-eval" | "none"*

*Defined in [encode.d.ts:65](https://github.com/fasttime/JScrewIt/blob/2.11.1/lib/encode.d.ts#L65)*

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

___

### `Optional` trimCode

• **trimCode**? : *undefined | false | true*

*Defined in [encode.d.ts:79](https://github.com/fasttime/JScrewIt/blob/2.11.1/lib/encode.d.ts#L79)*

If this parameter is truthy, lines in the beginning and in the end of the file containing
nothing but space characters and JavaScript comments are removed from the generated
output.
A newline terminator in the last preserved line is also removed.

This option is especially useful to strip banner comments and trailing newline characters
which are sometimes found in minified scripts.

Using this option may produce unexpected results if the input is not well-formed
JavaScript code.

___

### `Optional` wrapWith

• **wrapWith**? : *"call" | "eval" | "express" | "express-call" | "express-eval" | "none"*

*Defined in [encode.d.ts:82](https://github.com/fasttime/JScrewIt/blob/2.11.1/lib/encode.d.ts#L82)*

An alias for `runAs`.
