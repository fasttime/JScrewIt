/// <reference path='feature.d.ts'/>

interface EncodeOptions
{
    /**
     * Specifies the features available in the engines that evaluate the encoded output.
     *
     * If this parameter is unspecified,
     * [`JScrewIt.Feature.DEFAULT`](featureconstructor.md#default) is assumed: this ensures maximum
     * compatibility but also generates the largest code.
     * To generate shorter code, specify all features available in all target engines explicitly.
     */
    features?: FeatureElement | CompatibleFeatureArray;

    /**
     * This option controls the type of code generated from the given input.
     * Allowed values are listed below.
     *
     * <dl>
     *
     * <dt><code>"call"</code></dt>
     * <dd>
     * Produces code evaluating to a call to a function whose body contains the specified input
     * string.</dd>
     *
     * <dt><code>"eval"</code></dt>
     * <dd>
     * Produces code evaluating to the result of invoking <code>eval</code> with the specified
     * input string as parameter.</dd>
     *
     * <dt><code>"express"</code></dt>
     * <dd>
     * Attempts to interpret the specified string as JavaScript code and produce functionally
     * equivalent JSFuck code.
     * Fails if the specified string cannot be expressed as JavaScript, or if no functionally
     * equivalent JSFuck code can be generated.</dd>
     *
     * <dt><code>"express-call"</code></dt>
     * <dd>
     * Applies the code generation process of both <code>"express"</code> and <code>"call"</code>
     * and returns the shortest output.</dd>
     *
     * <dt><code>"express-eval"</code> (default)</dt>
     * <dd>
     * Applies the code generation process of both <code>"express"</code> and <code>"eval"</code>
     * and returns the shortest output.</dd>
     *
     * <dt><code>"none"</code></dt>
     * <dd>
     * Produces JSFuck code that translates to the specified input string (except for trimmed parts
     * when used in conjunction with the option <code>trimCode</code>).
     * Unlike other methods, <code>"none"</code> does not generate executable code but just a plain
     * string.
     * </dd>
     *
     * </dl>
     */
    runAs?: 'call' | 'eval' | 'express' | 'express-call' | 'express-eval' | 'none';

    /**
     * If this parameter is truthy, lines in the beginning and in the end of the file containing
     * nothing but space characters and JavaScript comments are removed from the generated output.
     * A newline terminator in the last preserved line is also removed.
     *
     * This option is especially useful to strip banner comments and trailing newline characters
     * which are sometimes found in minified scripts.
     *
     * Using this option may produce unexpected results if the input is not well-formed JavaScript
     * code.
     */
    trimCode?: boolean;

    /** An alias for `runAs` */
    wrapWith?: 'call' | 'eval' | 'express' | 'express-call' | 'express-eval' | 'none';
}

interface JScrewIt
{
    /**
     * Encodes a given string into JSFuck.
     *
     * @param input
     *
     * The string to encode.
     *
     * @param options
     *
     * An optional object specifying encoding options.
     *
     * @returns
     *
     * The encoded string.
     *
     * @throws
     *
     * An `Error` is thrown under the following circumstances.
     *  - The specified string cannot be encoded with the specified options.
     *  - Some unknown features were specified.
     *  - A combination of mutually incompatible features was specified.
     *  - The option `runAs` (or `wrapWith`) was specified with an invalid value.
     *
     * Also, an out of memory condition may occur when processing very large data.
     */
    encode(input: string, options?: EncodeOptions): string;
}
