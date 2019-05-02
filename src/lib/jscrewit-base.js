/*
global
Encoder,
Feature,
_Error,
_String,
assignNoEnum,
createEmpty,
esToString,
maskNew,
module,
self,
trimJS,
validMaskFromArrayOrStringOrFeature,
wrapWithCall,
wrapWithEval,
*/

var JScrewIt;
var getValidFeatureMask;

(function ()
{
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
        var strategyNames = runAsData[1];
        if (options.trimCode)
            input = trimJS(input);
        var perfInfo = options.perfInfo;
        var encoder = getEncoder(features);
        var output = encoder.exec(input, wrapper, strategyNames, perfInfo);
        return output;
    }

    function filterRunAs(input, name)
    {
        var STRATEGY_NAMES_BOTH     = ['text', 'express'];
        var STRATEGY_NAMES_EXPRESS  = ['express'];
        var STRATEGY_NAMES_TEXT     = ['text'];

        if (input === undefined)
            return [wrapWithEval, STRATEGY_NAMES_BOTH];
        switch (_String(input))
        {
        case 'call':
            return [wrapWithCall, STRATEGY_NAMES_TEXT];
        case 'eval':
            return [wrapWithEval, STRATEGY_NAMES_TEXT];
        case 'express':
            return [, STRATEGY_NAMES_EXPRESS];
        case 'express-call':
            return [wrapWithCall, STRATEGY_NAMES_BOTH];
        case 'express-eval':
            return [wrapWithEval, STRATEGY_NAMES_BOTH];
        case 'none':
            return [, STRATEGY_NAMES_TEXT];
        }
        throw new _Error('Invalid value for option ' + name);
    }

    function getEncoder(features)
    {
        var mask = getValidFeatureMask(features);
        var encoder = encoders[mask];
        if (!encoder)
            encoders[mask] = encoder = new Encoder(mask);
        return encoder;
    }

    var encoders = createEmpty();

    JScrewIt = assignNoEnum({ }, { Feature: Feature, encode: encode });

    getValidFeatureMask =
    function (features)
    {
        var mask =
        features !== undefined ? validMaskFromArrayOrStringOrFeature(features) : maskNew();
        return mask;
    };

    if (typeof self !== 'undefined')
        self.JScrewIt = JScrewIt;

    // istanbul ignore else
    if (typeof module !== 'undefined')
        module.exports = JScrewIt;
}
)();
