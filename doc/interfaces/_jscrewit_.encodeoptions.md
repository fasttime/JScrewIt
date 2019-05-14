[JScrewIt](../README.md) > ["jscrewit"](../modules/_jscrewit_.md) > [EncodeOptions](../interfaces/_jscrewit_.encodeoptions.md)

# Interface: EncodeOptions

## Hierarchy

**EncodeOptions**

## Index

### Properties

* [features](_jscrewit_.encodeoptions.md#features)
* [runAs](_jscrewit_.encodeoptions.md#runas)
* [trimCode](_jscrewit_.encodeoptions.md#trimcode)
* [wrapWith](_jscrewit_.encodeoptions.md#wrapwith)

---

## Properties

<a id="features"></a>

### `<Optional>` features

**● features**: *[FeatureElement](../modules/_jscrewit_.md#featureelement) \| [CompatibleFeatureArray](../modules/_jscrewit_.md#compatiblefeaturearray)*

*Defined in [encode.d.ts:16](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/encode.d.ts#L16)*

Specifies the features available in the engines that evaluate the encoded output.

If this parameter is unspecified, [`JScrewIt.Feature.DEFAULT`](_jscrewit_.featureconstructor.md#default) is assumed: this ensures maximum compatibility but also generates the largest code. To generate shorter code, specify all features available in all target engines explicitly.

___
<a id="runas"></a>

### `<Optional>` runAs

**● runAs**: *"call" \| "eval" \| "express" \| "express-call" \| "express-eval" \| "none"*

*Defined in [encode.d.ts:66](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/encode.d.ts#L66)*

This option controls the type of code generated from the given input. Allowed values are listed below.

`"call"`

Produces code evaluating to a call to a function whose body contains the specified input string.

`"eval"`

Produces code evaluating to the result of invoking `eval` with the specified input string as parameter.

`"express"`

Attempts to interpret the specified string as JavaScript code and produce functionally equivalent JSFuck code. Fails if the specified string cannot be expressed as JavaScript, or if no functionally equivalent JSFuck code can be generated.

`"express-call"`

Applies the code generation process of both `"express"` and `"call"` and returns the shortest output.

`"express-eval"` (default)

Applies the code generation process of both `"express"` and `"eval"` and returns the shortest output.

`"none"`

Produces JSFuck code that translates to the specified input string (except for trimmed parts when used in conjunction with the option `trimCode`). Unlike other methods, `"none"` does not generate executable code but just a plain string.

___
<a id="trimcode"></a>

### `<Optional>` trimCode

**● trimCode**: *`boolean`*

*Defined in [encode.d.ts:80](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/encode.d.ts#L80)*

If this parameter is truthy, lines in the beginning and in the end of the file containing nothing but space characters and JavaScript comments are removed from the generated output. A newline terminator in the last preserved line is also removed.

This option is especially useful to strip banner comments and trailing newline characters which are sometimes found in minified scripts.

Using this option may produce unexpected results if the input is not well-formed JavaScript code.

___
<a id="wrapwith"></a>

### `<Optional>` wrapWith

**● wrapWith**: *"call" \| "eval" \| "express" \| "express-call" \| "express-eval" \| "none"*

*Defined in [encode.d.ts:83](https://github.com/fasttime/JScrewIt/blob/2.9.6/lib/encode.d.ts#L83)*

An alias for `runAs`.

___

