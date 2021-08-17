/* global require */

import
{
    _Array_isArray,
    _Array_prototype_every_call,
    _Array_prototype_forEach_call,
    _Array_prototype_push_apply,
    _Error,
    _JSON_stringify,
    _Object_create,
    _Object_defineProperty,
    _Object_freeze,
    _Object_keys,
    assignNoEnum,
    createEmpty,
    esToString,
}
from './obj-utils';
import { MaskSet, maskAreEqual, maskIncludes, maskIntersection, maskNew, maskNext, maskUnion }
from '~mask';

export default function (featureInfos)
{
    var ALL                     = createEmpty();
    var DESCRIPTION_MAP         = createEmpty();
    var ELEMENTARY              = [];
    var FEATURE_PROTOTYPE       = Feature.prototype;
    var INCLUDES_MAP            = createEmpty();
    var INCOMPATIBLE_MASK_LIST  = [];

    function Feature()
    {
        var mask = validMaskFromArguments(arguments);
        var featureObj = this instanceof Feature ? this : _Object_create(FEATURE_PROTOTYPE);
        initMask(featureObj, mask);
        return featureObj;
    }

    function areCompatible()
    {
        var arg0;
        var features =
        arguments.length === 1 && _Array_isArray(arg0 = arguments[0]) ? arg0 : arguments;
        var compatible;
        if (features.length > 1)
        {
            var mask = featureArrayLikeToMask(features);
            compatible = isMaskCompatible(mask);
        }
        else
            compatible = true;
        return compatible;
    }

    function areEqual()
    {
        var mask;
        var equal =
        _Array_prototype_every_call
        (
            arguments,
            function (arg, index)
            {
                var returnValue;
                var otherMask = validMaskFromArrayOrStringOrFeature(arg);
                if (index)
                    returnValue = maskAreEqual(otherMask, mask);
                else
                {
                    mask = otherMask;
                    returnValue = true;
                }
                return returnValue;
            }
        );
        return equal;
    }

    function commonOf()
    {
        var returnValue;
        if (arguments.length)
        {
            var mask;
            _Array_prototype_forEach_call
            (
                arguments,
                function (arg)
                {
                    var otherMask = validMaskFromArrayOrStringOrFeature(arg);
                    if (mask != null)
                        mask = maskIntersection(mask, otherMask);
                    else
                        mask = otherMask;
                }
            );
            returnValue = featureFromMask(mask);
        }
        else
            returnValue = null;
        return returnValue;
    }

    function completeExclusions()
    {
        var incompatibleMaskSet = new MaskSet();
        featureNames.forEach
        (
            function (name)
            {
                var info = featureInfos[name];
                var excludes = info.excludes;
                if (excludes)
                {
                    var featureObj = ALL[name];
                    var mask = featureObj.mask;
                    excludes.forEach
                    (
                        function (exclude)
                        {
                            var excludeMask = completeFeature(exclude);
                            var incompatibleMask = maskUnion(mask, excludeMask);
                            if (!incompatibleMaskSet.has(incompatibleMask))
                            {
                                INCOMPATIBLE_MASK_LIST.push(incompatibleMask);
                                incompatibleMaskSet.add(incompatibleMask);
                            }
                        }
                    );
                }
            }
        );
    }

    function completeFeature(name)
    {
        var mask;
        var featureObj = ALL[name];
        if (featureObj)
            mask = featureObj.mask;
        else
        {
            var description;
            var info = featureInfos[name];
            var engine = info.engine;
            if (engine == null)
                description = info.description;
            else
                description = createEngineFeatureDescription(engine);
            var aliasFor = info.aliasFor;
            if (aliasFor != null)
            {
                mask = completeFeature(aliasFor);
                featureObj = ALL[aliasFor];
                if (description == null)
                    description = DESCRIPTION_MAP[aliasFor];
            }
            else
            {
                var check = info.check;
                if (check)
                {
                    mask = maskNext(unionMask);
                    unionMask = maskUnion(unionMask, mask);
                    if (check())
                        autoMask = maskUnion(autoMask, mask);
                    check = wrapCheck(check);
                }
                else
                    mask = maskNew();
                var includes = INCLUDES_MAP[name] = info.includes || [];
                includes.forEach
                (
                    function (include)
                    {
                        var includeMask = completeFeature(include);
                        mask = maskUnion(mask, includeMask);
                    }
                );
                var elementary = check || info.excludes;
                featureObj = createFeature(name, mask, check, engine, info.attributes, elementary);
                if (elementary)
                    ELEMENTARY.push(featureObj);
            }
            registerFeature(name, description, featureObj);
        }
        return mask;
    }

    function createEngineFeatureDescription(engine)
    {
        var description = 'Features available in ' + engine + '.';
        return description;
    }

    function createFeature(name, mask, check, engine, attributes, elementary)
    {
        attributes = _Object_freeze(attributes || { });
        var descriptors =
        {
            attributes:     { value: attributes },
            check:          { value: check },
            engine:         { value: engine },
            name:           { value: name },
        };
        if (elementary)
            descriptors.elementary = { value: true };
        var featureObj = _Object_create(FEATURE_PROTOTYPE, descriptors);
        initMask(featureObj, mask);
        return featureObj;
    }

    function descriptionFor(name)
    {
        name = esToString(name);
        var description = DESCRIPTION_MAP[name];
        if (description == null)
            throw new _Error('Unknown feature ' + _JSON_stringify(name));
        return description;
    }

    function featureArrayLikeToMask(arrayLike)
    {
        var mask = maskNew();
        _Array_prototype_forEach_call
        (
            arrayLike,
            function (feature)
            {
                var otherMask = maskFromStringOrFeature(feature);
                mask = maskUnion(mask, otherMask);
            }
        );
        return mask;
    }

    function featureFromMask(mask)
    {
        var featureObj = _Object_create(FEATURE_PROTOTYPE);
        initMask(featureObj, mask);
        return featureObj;
    }

    function fromMask(mask)
    {
        var featureObj = isMaskCompatible(mask) ? featureFromMask(mask) : null;
        return featureObj;
    }

    function getValidFeatureMask(arg)
    {
        var mask = arg !== undefined ? validMaskFromArrayOrStringOrFeature(arg) : maskNew();
        return mask;
    }

    function isMaskCompatible(mask)
    {
        var compatible =
        INCOMPATIBLE_MASK_LIST.every
        (
            function (incompatibleMask)
            {
                var returnValue = !maskIncludes(mask, incompatibleMask);
                return returnValue;
            }
        );
        return compatible;
    }

    function maskFromStringOrFeature(arg)
    {
        var mask;
        if (arg instanceof Feature)
            mask = arg.mask;
        else
        {
            var name = esToString(arg);
            var featureObj = ALL[name];
            if (!featureObj)
                throw new _Error('Unknown feature ' + _JSON_stringify(name));
            mask = featureObj.mask;
        }
        return mask;
    }

    function registerFeature(name, description, featureObj)
    {
        var descriptor = { enumerable: true, value: featureObj };
        _Object_defineProperty(Feature, name, descriptor);
        ALL[name] = featureObj;
        DESCRIPTION_MAP[name] = description;
    }

    function validMaskFromArguments(args)
    {
        var mask = maskNew();
        var validationNeeded = 0;
        _Array_prototype_forEach_call
        (
            args,
            function (arg)
            {
                var otherMask;
                if (_Array_isArray(arg))
                {
                    otherMask = featureArrayLikeToMask(arg);
                    validationNeeded |= arg.length > 1;
                }
                else
                    otherMask = maskFromStringOrFeature(arg);
                mask = maskUnion(mask, otherMask);
            }
        );
        validationNeeded |= args.length > 1;
        if (validationNeeded)
            validateMask(mask);
        return mask;
    }

    function validMaskFromArrayOrStringOrFeature(arg)
    {
        var mask;
        if (_Array_isArray(arg))
        {
            mask = featureArrayLikeToMask(arg);
            if (arg.length > 1)
                validateMask(mask);
        }
        else
            mask = maskFromStringOrFeature(arg);
        return mask;
    }

    function validateMask(mask)
    {
        if (!isMaskCompatible(mask))
            throw new _Error('Incompatible features');
    }

    assignNoEnum
    (
        FEATURE_PROTOTYPE,
        {
            get canonicalNames()
            {
                var mask = this.mask;
                var featureNameSet = createEmpty();
                var allIncludes = [];
                ELEMENTARY.forEach
                (
                    function (featureObj)
                    {
                        var included = maskIncludes(mask, featureObj.mask);
                        if (included)
                        {
                            var name = featureObj.name;
                            featureNameSet[name] = null;
                            var includes = INCLUDES_MAP[name];
                            _Array_prototype_push_apply(allIncludes, includes);
                        }
                    }
                );
                allIncludes.forEach
                (
                    function (name)
                    {
                        delete featureNameSet[name];
                    }
                );
                var names = _Object_keys(featureNameSet).sort();
                return names;
            },

            elementary: false,

            get elementaryNames()
            {
                var names = [];
                var mask = this.mask;
                ELEMENTARY.forEach
                (
                    function (featureObj)
                    {
                        var included = maskIncludes(mask, featureObj.mask);
                        if (included)
                            names.push(featureObj.name);
                    }
                );
                return names;
            },

            includes:
            function ()
            {
                var mask = this.mask;
                var included =
                _Array_prototype_every_call
                (
                    arguments,
                    function (arg)
                    {
                        var otherMask = validMaskFromArrayOrStringOrFeature(arg);
                        var returnValue = maskIncludes(mask, otherMask);
                        return returnValue;
                    }
                );
                return included;
            },

            inspect: inspect,

            name: undefined,

            restrict:
            function (environment, engineFeatureObjs)
            {
                var resultMask = maskNew();
                var thisMask = this.mask;
                var attributeCache = createEmpty();
                ELEMENTARY.forEach
                (
                    function (featureObj)
                    {
                        var otherMask = featureObj.mask;
                        var included = maskIncludes(thisMask, otherMask);
                        if (included)
                        {
                            var attributeValue = featureObj.attributes[environment];
                            if
                            (
                                attributeValue === undefined ||
                                engineFeatureObjs !== undefined &&
                                !isExcludingAttribute
                                (attributeCache, attributeValue, engineFeatureObjs)
                            )
                                resultMask = maskUnion(resultMask, otherMask);
                        }
                    }
                );
                var returnValue = featureFromMask(resultMask);
                return returnValue;
            },

            toString:
            function ()
            {
                var name = this.name;
                if (name === undefined)
                    name = '{' + this.canonicalNames.join(', ') + '}';
                var str = '[Feature ' + name + ']';
                return str;
            },
        }
    );

    var constructorSource =
    {
        ALL:                    ALL,
        ELEMENTARY:             ELEMENTARY,
        areCompatible:          areCompatible,
        areEqual:               areEqual,
        commonOf:               commonOf,
        descriptionFor:         descriptionFor,
        fromMask:               fromMask,
        getValidFeatureMask:    getValidFeatureMask,
    };
    assignNoEnum(Feature, constructorSource);

    try
    {
        var inspectKey = require('util').inspect.custom;
    }
    catch (error)
    { }
    if (inspectKey)
    {
        _Object_defineProperty
        (FEATURE_PROTOTYPE, inspectKey, { configurable: true, value: inspect, writable: true });
    }

    var autoMask = maskNew();
    var unionMask = maskNew();

    var featureNames = _Object_keys(featureInfos);
    featureNames.forEach(completeFeature);
    completeExclusions();
    ELEMENTARY.sort
    (
        function (feature1, feature2)
        {
            var returnValue = feature1.name < feature2.name ? -1 : 1;
            return returnValue;
        }
    );
    _Object_freeze(ELEMENTARY);
    var autoFeatureObj = createFeature('AUTO', autoMask);
    registerFeature('AUTO', 'All features available in the current engine.', autoFeatureObj);
    _Object_freeze(ALL);

    return Feature;
}

export function featuresToMask(featureObjs)
{
    var mask = maskNew();
    featureObjs.forEach
    (
        function (featureObj)
        {
            mask = maskUnion(mask, featureObj.mask);
        }
    );
    return mask;
}

function initMask(featureObj, mask)
{
    _Object_defineProperty(featureObj, 'mask', { value: mask });
}

/**
 * Node.js custom inspection function.
 * Set on `Feature.prototype` with name `"inspect"` for Node.js ≤ 8.6.x and with symbol
 * `Symbol.for("nodejs.util.inspect.custom")` for Node.js ≥ 6.6.x.
 *
 * @function inspect
 *
 * @see
 * {@link https://tiny.cc/j4wz9y|Custom inspection functions on Objects} for further information.
 */
function inspect(depth, opts)
{
    var returnValue;
    var str = this.toString();
    if (opts !== undefined) // opts can be undefined in Node.js 0.10.0.
        returnValue = opts.stylize(str, 'jscrewit-feature');
    else
        returnValue = str;
    return returnValue;
}

function isExcludingAttribute(attributeCache, attributeName, featureObjs)
{
    var returnValue = attributeCache[attributeName];
    if (returnValue === undefined)
    {
        attributeCache[attributeName] =
        returnValue =
        featureObjs.some
        (
            function (featureObj)
            {
                return attributeName in featureObj.attributes;
            }
        );
    }
    return returnValue;
}

function wrapCheck(check)
{
    var returnValue =
    function ()
    {
        var available = !!check();
        return available;
    };
    return returnValue;
}
