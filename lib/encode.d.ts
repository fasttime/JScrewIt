import { FeatureElementOrCompatibleArray } from './feature';

export interface EncodeOptions
{
    /**
     * Specifies the features available in the engines that evaluate the encoded output.
     *
     * If this parameter is unspecified, [[DEFAULT|`JScrewIt.Feature.DEFAULT`]] is assumed: this
     * ensures maximum compatibility but also generates the largest code.
     * To generate shorter code, specify all features available in all target engines explicitly.
     */
    features?: FeatureElementOrCompatibleArray | undefined;

    /**
     * This option controls the type of code generated from the given input.
     * Allowed values are listed below.
     *
     * <dl>
     *
     * <dt><code>"call"</code></dt>
     * <dd>
     * Produces code evaluating to a call to a function whose body contains the specified input
     * string.
     * </dd>
     *
     * <dt><code>"eval"</code></dt>
     * <dd>
     * Produces code evaluating to the result of invoking <code>eval</code> with the specified input
     * string as parameter.
     * </dd>
     *
     * <dt><code>"express"</code></dt>
     * <dd>
     * Attempts to interpret the specified string as JavaScript code and produce functionally
     * equivalent JSFuck code.
     * Fails if the specified string cannot be expressed as JavaScript, or if no functionally
     * equivalent JSFuck code can be generated.
     * </dd>
     *
     * <dt><code>"express-call"</code></dt>
     * <dd>
     * Applies the code generation process of both <code>"express"</code> and <code>"call"</code>
     * and returns the shortest output.
     * </dd>
     *
     * <dt><code>"express-eval"</code> (default)</dt>
     * <dd>
     * Applies the code generation process of both <code>"express"</code> and <code>"eval"</code>
     * and returns the shortest output.
     * </dd>
     *
     * <dt><code>"none"</code></dt>
     * <dd>
     * Produces JSFuck code that translates to the specified input string (except for trimmed parts
     * when used in conjunction with the option <code>trimCode</code>).
     * Unlike other methods, <code>"none"</code> does not generate executable code, but rather a
     * plain string.
     * </dd>
     *
     * </dl>
     */
    runAs?: RunAs | undefined;

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
    trimCode?: boolean | undefined;

    /** An alias for `runAs`. */
    wrapWith?: RunAs | undefined;
}

/**
 * Values of this type control the type of code generated from a given input.
 * See <code>[[EncodeOptions.runAs]]</code> for the meaning of each possible value.
 */
type RunAs = 'call' | 'eval' | 'express' | 'express-call' | 'express-eval' | 'none';

interface encode
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
    (input: string, options?: EncodeOptions): string;

    /**
     * Determines whether all created encoders are cached permanently.
     *
     * An encoder is a structure used internally by JScrewIt to remember the result of certain
     * time-consuming operations performed when `encode` is called with some particular features.
     * Keeping encoders in the cache allows them to be reused when `encode` is called again later
     * with the same features, which can greatly improve performance.
     *
     * Whenever `encode` is called with new features, a new encoder is created.
     * If `encode` is called again with the same features specified in the very last call, the last
     * used encoder is reused.
     * By default, only the last used encoder is retained in the cache permanently, while other
     * encoders used in earlier calls to `encode` may be eventually discarded to free up memory, at
     * the discretion of JScrewIt.
     *
     * ```js
     * const r1 = encode("1", { features: "V8_SRC" }); // Encoder for feature "V8_SRC" is created.
     * const r2 = encode("2"); // Encoder for default feature is created.
     * const r3 = encode("3"); // Last used encoder is reused.
     * doSomething();
     * // Encoder for feature "V8_SRC" will be reused if still cached;
     * // otherwise, a new one will be created.
     * const r4 = encode("4", { features: "V8_SRC" });
     * ```
     *
     * By setting `encode.permanentCaching` to `true` it is possible to enforce that all created
     * encoders are kept in the cache, thus improving performance in certain situations, for example
     * when multiple calls to `encode` with the same features are alternated with calls to `encode`
     * where other features are specified.
     *
     * If you change this setting to `true`, don't forget to switch it back to `false` again when
     * you are finished encoding in order to allow the memory used by the encoders to be released.
     *
     * Unless you have a reason to change this setting, such as when `encode` is called repeatedly
     * with alternating features, it is recommended to keep the default setting of `false`.
     */
    permanentCaching: boolean;
}

export const encode: encode;
