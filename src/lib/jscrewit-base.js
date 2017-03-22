/*
global
Empty,
Encoder,
Feature,
assignNoEnum,
esToString,
module,
self,
trimJS,
validMaskFromArrayOrStringOrFeature,
wrapWithCall,
wrapWithEval,
*/

var JScrewIt;
var getValidFeatureMask;
var setUp;

(function ()
{
    /**
     * Encodes a given string into JSFuck.
     *
     * @function JScrewIt.encode
     *
     * @param {string} input The string to encode.
     *
     * @param {object} [options={ }] An optional object specifying encoding options.
     *
     * @param {FeatureElement|CompatibleFeatureArray} [options.features=JScrewIt.Feature.DEFAULT]
     * <p>
     * Specifies the features available in the engines that evaluate the encoded output.</p>
     * <p>
     * If this parameter is unspecified, [`JScrewIt.Feature.DEFAULT`](Features.md#DEFAULT) is
     * assumed: this ensures maximum compatibility but also generates the largest code.
     * To generate shorter code, specify all features available in all target engines
     * explicitly.</p>
     *
     * @param {string} [options.runAs=express-eval]
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
     *
     * @param {boolean} [options.trimCode=false]
     * <p>
     * If this parameter is truthy, lines in the beginning and in the end of the file containing
     * nothing but space characters and JavaScript comments are removed from the generated output.
     * A newline terminator in the last preserved line is also removed.</p>
     * <p>
     * This option is especially useful to strip banner comments and trailing newline characters
     * which are sometimes found in minified scripts.</p>
     * <p>
     * Using this option may produce unexpected results if the input is not well-formed JavaScript
     * code.</p>
     *
     * @param {string} [options.wrapWith=express-eval] An alias for `runAs`.
     *
     * @returns {string} The encoded string.
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
    
    function encode(input, options)
    {
        input = esToString(input);
        options = options || { };
        var features = options.features;
        var runAsData;
        var runAs = options.runAs;
        if (runAs !== undefined)
            runAsData = filterRunAs(runAs, 'runAs');
        else
            runAsData = filterRunAs(options.wrapWith, 'wrapWith');
        var wrapper = runAsData[0];
        var coderNames = runAsData[1];
        if (options.trimCode)
            input = trimJS(input);
        var perfInfo = options.perfInfo;
        var encoder = getEncoder(features);
        var output = encoder.exec(input, wrapper, coderNames, perfInfo);
        return output;
    }
    
    function filterRunAs(input, name)
    {
        var CODER_NAMES_BOTH    = ['text', 'express'];
        var CODER_NAMES_EXPRESS = ['express'];
        var CODER_NAMES_TEXT    = ['text'];
        
        if (input === undefined)
            return [wrapWithEval, CODER_NAMES_BOTH];
        switch (input += '')
        {
        case 'call':
            return [wrapWithCall, CODER_NAMES_TEXT];
        case 'eval':
            return [wrapWithEval, CODER_NAMES_TEXT];
        case 'express':
            return [, CODER_NAMES_EXPRESS];
        case 'express-call':
            return [wrapWithCall, CODER_NAMES_BOTH];
        case 'express-eval':
            return [wrapWithEval, CODER_NAMES_BOTH];
        case 'none':
            return [, CODER_NAMES_TEXT];
        }
        throw new Error('Invalid value for option ' + name);
    }
    
    function getEncoder(features)
    {
        var mask = getValidFeatureMask(features);
        var encoder = encoders[mask];
        if (!encoder)
            encoders[mask] = encoder = new Encoder(mask);
        return encoder;
    }
    
    var encoders = new Empty();
    
    /** @namespace JScrewIt */
    JScrewIt = assignNoEnum({ }, { Feature: Feature, encode: encode });
    
    getValidFeatureMask =
        function (features)
        {
            var mask = features !== undefined ? validMaskFromArrayOrStringOrFeature(features) : 0;
            return mask;
        };
    
    setUp =
        function (self)
        {
            if (self != null)
                self.JScrewIt = JScrewIt;
        };
    
    setUp(typeof self !== 'undefined' ? /* istanbul ignore next */ self : null);
    
    // istanbul ignore else
    if (typeof module !== 'undefined')
        module.exports = JScrewIt;
}
)();
