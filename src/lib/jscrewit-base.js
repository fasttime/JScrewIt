/* global exports, module, self */

import './optimizer';

import { Encoder }                                                  from './encoder/encoder-base';
import { wrapWithCall, wrapWithEval }                               from './encoder/encoder-ext';
import { Feature, validMaskFromArrayOrStringOrFeature }             from './features';
import { _Error, _String, _setTimeout, assignNoEnum, esToString }   from './obj-utils';
import trimJS                                                       from './trim-js';
import { MaskMap, maskNew }                                         from 'quinquaginta-duo';

function cacheEncoder(encoder)
{
    encoderCache.set(encoder.mask, encoder);
}

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

function flushEncoderCache()
{
    timeout = undefined;
    if (!_permanentCaching)
    {
        resetEncoderCache();
        cacheEncoder(lastEncoder);
    }
}

function getEncoder(features)
{
    var mask = getValidFeatureMask(features);
    var encoder = encoderCache.get(mask);
    if (!encoder)
    {
        encoder = new Encoder(mask);
        cacheEncoder(encoder);
        scheduleFlush();
    }
    lastEncoder = encoder;
    return encoder;
}

export function getValidFeatureMask(features)
{
    var mask = features !== undefined ? validMaskFromArrayOrStringOrFeature(features) : maskNew();
    return mask;
}

export function isEncoderInCache(features)
{
    var mask = getValidFeatureMask(features);
    var returnValue = encoderCache.has(mask);
    return returnValue;
}

function resetEncoderCache()
{
    encoderCache = new MaskMap();
}

function scheduleFlush()
{
    if (!_permanentCaching && !timeout && encoderCache.size > 1)
        timeout = _setTimeout(flushEncoderCache);
}

export var JScrewIt = assignNoEnum({ }, { Feature: Feature, encode: encode });

var _permanentCaching = false;
var encoderCache;
var lastEncoder;
var timeout;

resetEncoderCache();

assignNoEnum
(
    encode,
    {
        get permanentCaching()
        {
            return _permanentCaching;
        },
        set permanentCaching(value)
        {
            _permanentCaching = !!value;
            scheduleFlush();
        },
    }
);

if (typeof self !== 'undefined')
    self.JScrewIt = JScrewIt;

if (typeof module !== 'undefined')
{
    module.exports = JScrewIt;

    // Dummy statements to allow named exports when JScrewIt is imported by ES modules.
    exports.Feature = null;
    exports.encode  = null;
}
