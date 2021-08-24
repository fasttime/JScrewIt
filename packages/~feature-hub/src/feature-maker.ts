import { maskAreEqual, maskIncludes, maskIntersection, maskNew, maskNext, maskUnion }
from './mask';
import type { Mask }                    from './mask';
import { MaskSet }                      from './mask-index';
import type util                        from 'util';
import type { InspectOptionsStylized }  from 'util';

type AttributeMap = { readonly [AttributeName in string]: string | null; };

type CompatibleFeatureArray = readonly FeatureElement[];

interface Feature
{
    readonly canonicalNames:    string[];
    readonly mask:              Mask;
    readonly name?:             string;
    toString():                 string;
}

interface FeatureConstructor
{
    ():                                                                 Feature;

    readonly ALL:
    { readonly [FeatureName in string]: PredefinedFeature; };

    new ():                                                             Feature;
    areEqual(...features: (FeatureElement | CompatibleFeatureArray)[]): boolean;
    descriptionFor(name: string):                                       string | undefined;
}

type FeatureElement = Feature | string;

type FeatureInfo =
(
    {
        readonly aliasFor:      string;
    } |
    {
        readonly attributes?:   { readonly [AttributeName in string]: string | null | undefined; };
        readonly check?:        () => unknown;
        readonly excludes?:     readonly string[];
        readonly includes?:     readonly string[] | IncludeDifferenceMap;
        readonly inherits?:     string;
    }
) &
({ readonly description?: string; } | { readonly engine?: string; });

type IncludeDifferenceMap = { readonly [FeatureName in string]: boolean; };

interface PredefinedFeature extends Feature
{
    readonly attributes:    AttributeMap;
    readonly name:          string;
}

const _Array_isArray            = Array.isArray as (value: unknown) => value is readonly unknown[];
const _Error                    = Error;
const _JSON_stringify           = JSON.stringify;
const
{
    create:                     _Object_create,
    defineProperty:             _Object_defineProperty,
    freeze:                     _Object_freeze,
    getOwnPropertyDescriptor:   _Object_getOwnPropertyDescriptor,
    keys:                       _Object_keys,
} =
Object;
const _String                   = String;
const _TypeError                = TypeError;

function assignNoEnum(target: object, source: object): void
{
    const names = _Object_keys(source);
    for (const name of names)
    {
        const descriptor = _Object_getOwnPropertyDescriptor(source, name)!;
        descriptor.enumerable = false;
        _Object_defineProperty(target, name, descriptor);
    }
}

function createEngineFeatureDescription(engine: string): string
{
    const description = `Features available in ${engine}.`;
    return description;
}

const createMap = <T>(): { [Key in string]: T; } => _Object_create(null) as { };

function esToString(arg: unknown): string
{
    if (typeof arg === 'symbol')
        throw new _TypeError('Cannot convert a symbol to a string');
    const str = _String(arg);
    return str;
}

export function featuresToMask(featureObjs: readonly Feature[]): Mask
{
    const mask =
    featureObjs.reduce((mask, featureObj): Mask => maskUnion(mask, featureObj.mask), maskNew());
    return mask;
}

function initMask(featureObj: Feature, mask: Mask): void
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
 * {@link https://nodejs.org/api/util.html#util_custom_inspection_functions_on_objects} for further
 * information.
 */
function inspect(this: Feature, depth: never, opts?: InspectOptionsStylized): string
{
    let returnValue: string;
    const str = this.toString();
    if (opts !== undefined) // opts can be undefined in Node.js 0.10.0.
        returnValue = opts.stylize(str, 'special');
    else
        returnValue = str;
    return returnValue;
}

function isExcludingAttribute
(
    attributeCache: { [AttributeName in string]?: boolean; },
    attributeName: string,
    featureObjs: readonly PredefinedFeature[],
): boolean
{
    let returnValue = attributeCache[attributeName];
    if (returnValue === undefined)
    {
        attributeCache[attributeName] =
        returnValue =
        featureObjs.some((featureObj): boolean => attributeName in featureObj.attributes);
    }
    return returnValue;
}

export function makeFeatureClass
(featureInfos: { readonly [FeatureName in string]: FeatureInfo; }): FeatureConstructor
{
    const ALL                               = createMap<PredefinedFeature>();
    const DESCRIPTION_MAP                   = createMap<string | undefined>();
    const ELEMENTARY: PredefinedFeature[]   = [];
    const FEATURE_PROTOTYPE                 = Feature.prototype as object;
    const INCOMPATIBLE_MASK_LIST: Mask[]    = [];
    let PRISTINE_ELEMENTARY: PredefinedFeature[];

    function Feature(this: Feature, ...args: (FeatureElement | CompatibleFeatureArray)[]): Feature
    {
        const mask = validMaskFromArguments(args);
        const featureObj =
        this instanceof Feature ? this : _Object_create(FEATURE_PROTOTYPE) as Feature;
        initMask(featureObj, mask);
        return featureObj;
    }

    function _getValidFeatureMask(arg?: FeatureElement | CompatibleFeatureArray): Mask
    {
        const mask = arg !== undefined ? validMaskFromArrayOrStringOrFeature(arg) : maskNew();
        return mask;
    }

    function areCompatible(): boolean
    {
        let arg0: FeatureElement | CompatibleFeatureArray;
        const features =
        (
            arguments.length === 1 &&
            _Array_isArray(arg0 = arguments[0] as FeatureElement | CompatibleFeatureArray) ?
            arg0 : arguments
        ) as CompatibleFeatureArray;
        let compatible: boolean;
        if (features.length > 1)
        {
            const mask = featureArrayLikeToMask(features);
            compatible = isMaskCompatible(mask);
        }
        else
            compatible = true;
        return compatible;
    }

    function areEqual(...args: (FeatureElement | CompatibleFeatureArray)[]): boolean
    {
        let mask: Mask;
        const equal =
        args.every
        (
            (arg, index): boolean =>
            {
                let returnValue: boolean;
                const otherMask = validMaskFromArrayOrStringOrFeature(arg);
                if (index)
                    returnValue = maskAreEqual(otherMask, mask);
                else
                {
                    mask = otherMask;
                    returnValue = true;
                }
                return returnValue;
            },
        );
        return equal;
    }

    function commonOf(...args: (FeatureElement | CompatibleFeatureArray)[]): Feature | null
    {
        let featureObj: Feature | null;
        if (args.length)
        {
            let mask: Mask | undefined;
            for (const arg of args)
            {
                const otherMask = validMaskFromArrayOrStringOrFeature(arg);
                if (mask != null)
                    mask = maskIntersection(mask, otherMask);
                else
                    mask = otherMask;
            }
            featureObj = featureFromMask(mask!);
        }
        else
            featureObj = null;
        return featureObj;
    }

    function createFeature
    (
        name: string,
        mask: Mask,
        check: (() => boolean) | undefined,
        engine: string | undefined,
        attributes: AttributeMap,
        elementary?: unknown,
    ): PredefinedFeature
    {
        _Object_freeze(attributes);
        const descriptors: PropertyDescriptorMap =
        {
            attributes:     { value: attributes },
            check:          { value: check },
            engine:         { value: engine },
            name:           { value: name },
        };
        if (elementary)
            descriptors.elementary = { value: true };
        const featureObj = _Object_create(FEATURE_PROTOTYPE, descriptors) as PredefinedFeature;
        initMask(featureObj, mask);
        return featureObj;
    }

    function descriptionFor(name: string): string | undefined
    {
        name = esToString(name);
        if (!(name in DESCRIPTION_MAP))
            throwUnknownFeatureError(name);
        const description = DESCRIPTION_MAP[name];
        return description;
    }

    function featureArrayLikeToMask(arrayLike: CompatibleFeatureArray): Mask
    {
        let mask = maskNew();
        for (const feature of arrayLike)
        {
            const otherMask = maskFromStringOrFeature(feature);
            mask = maskUnion(mask, otherMask);
        }
        return mask;
    }

    function featureFromMask(mask: Mask): Feature
    {
        const featureObj = _Object_create(FEATURE_PROTOTYPE) as Feature;
        initMask(featureObj, mask);
        return featureObj;
    }

    function fromMask(mask: Mask): Feature | null
    {
        const featureObj = isMaskCompatible(mask) ? featureFromMask(mask) : null;
        return featureObj;
    }

    function isMaskCompatible(mask: Mask): boolean
    {
        const compatible =
        INCOMPATIBLE_MASK_LIST.every
        ((incompatibleMask): boolean => !maskIncludes(mask, incompatibleMask));
        return compatible;
    }

    function maskFromStringOrFeature(arg: FeatureElement): Mask
    {
        let mask: Mask;
        if (arg instanceof Feature)
            ({ mask } = arg as Feature);
        else
        {
            const name = esToString(arg);
            if (!(name in ALL))
                throwUnknownFeatureError(name);
            ({ mask } = ALL[name]);
        }
        return mask;
    }

    function validMaskFromArguments
    (args: readonly (FeatureElement | CompatibleFeatureArray)[]): Mask
    {
        let mask = maskNew();
        let validationNeeded = false;
        for (const arg of args)
        {
            let otherMask: Mask;
            if (_Array_isArray(arg))
            {
                otherMask = featureArrayLikeToMask(arg);
                validationNeeded ||= arg.length > 1;
            }
            else
                otherMask = maskFromStringOrFeature(arg);
            mask = maskUnion(mask, otherMask);
        }
        validationNeeded ||= args.length > 1;
        if (validationNeeded)
            validateMask(mask);
        return mask;
    }

    function validMaskFromArrayOrStringOrFeature(arg: FeatureElement | CompatibleFeatureArray): Mask
    {
        let mask: Mask;
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

    function validateMask(mask: Mask): void
    {
        if (!isMaskCompatible(mask))
            throw new _Error('Incompatible features');
    }

    assignNoEnum
    (
        FEATURE_PROTOTYPE,
        {
            get canonicalNames(): string[]
            {
                const { mask } = this as Feature;
                const names: string[] = [];
                let includedMask = maskNew();
                for (let index = PRISTINE_ELEMENTARY.length; index--;)
                {
                    const featureObj = PRISTINE_ELEMENTARY[index];
                    const featureMask = featureObj.mask;
                    if (maskIncludes(mask, featureMask) && !maskIncludes(includedMask, featureMask))
                    {
                        includedMask = maskUnion(includedMask, featureMask);
                        names.push(featureObj.name);
                    }
                }
                names.sort();
                return names;
            },

            elementary: false,

            get elementaryNames(): string[]
            {
                const names: string[] = [];
                const { mask } = this as Feature;
                for (const featureObj of ELEMENTARY)
                {
                    const included = maskIncludes(mask, featureObj.mask);
                    if (included)
                        names.push(featureObj.name);
                }
                return names;
            },

            includes(this: Feature, ...args: (FeatureElement | CompatibleFeatureArray)[]): boolean
            {
                const { mask } = this;
                const included =
                args.every
                (
                    (arg): boolean =>
                    {
                        const otherMask = validMaskFromArrayOrStringOrFeature(arg);
                        const returnValue = maskIncludes(mask, otherMask);
                        return returnValue;
                    },
                );
                return included;
            },

            inspect,

            name: undefined,

            restrict
            (this: Feature, environment: string, engineFeatureObjs?: readonly PredefinedFeature[]):
            Feature
            {
                let resultMask = maskNew();
                const thisMask = this.mask;
                const attributeCache = createMap() as { [AttributeName in string]?: boolean; };
                for (const featureObj of ELEMENTARY)
                {
                    const otherMask = featureObj.mask;
                    const included = maskIncludes(thisMask, otherMask);
                    if (included)
                    {
                        const { attributes } = featureObj;
                        if
                        (
                            !(environment in attributes) ||
                            engineFeatureObjs !== undefined &&
                            !isExcludingAttribute
                            (attributeCache, attributes[environment]!, engineFeatureObjs)
                        )
                            resultMask = maskUnion(resultMask, otherMask);
                    }
                }
                const returnValue = featureFromMask(resultMask);
                return returnValue;
            },

            toString(this: Feature): string
            {
                let { name } = this;
                if (name === undefined)
                    name = `{${this.canonicalNames.join(', ')}}`;
                const str = `[Feature ${name}]`;
                return str;
            },
        },
    );

    ((): void =>
    {
        function completeExclusions(): void
        {
            const incompatibleMaskSet = new MaskSet();
            for (const name of featureNames)
            {
                const { excludes } =
                featureInfos[name] as { readonly excludes?: readonly string[]; };
                if (excludes)
                {
                    const { mask } = ALL[name]!;
                    for (const exclude of excludes)
                    {
                        const excludeMask = completeFeature(exclude);
                        const incompatibleMask = maskUnion(mask, excludeMask);
                        if (!incompatibleMaskSet.has(incompatibleMask))
                        {
                            INCOMPATIBLE_MASK_LIST.push(incompatibleMask);
                            incompatibleMaskSet.add(incompatibleMask);
                        }
                    }
                }
            }
        }

        function completeFeature(name: string): Mask
        {
            let mask: Mask;
            if (name in ALL)
                ({ mask } = ALL[name]);
            else
            {
                let featureObj: PredefinedFeature;
                let description: string | undefined;
                const info = featureInfos[name];
                const { engine } = info as { readonly engine?: string; };
                if (engine == null)
                    ({ description } = info as { readonly description?: string; });
                else
                    description = createEngineFeatureDescription(engine);
                if ('aliasFor' in info)
                {
                    const { aliasFor } = info;
                    mask = completeFeature(aliasFor);
                    featureObj = ALL[aliasFor]!;
                    if (description == null)
                        description = DESCRIPTION_MAP[aliasFor]!;
                }
                else
                {
                    const { inherits } = info;
                    if (inherits != null)
                        completeFeature(inherits);
                    let wrappedCheck: (() => boolean) | undefined;
                    const { check } = info;
                    if (check)
                    {
                        mask = maskNext(unionMask);
                        unionMask = maskUnion(unionMask, mask);
                        wrappedCheck = wrapCheck(check);
                    }
                    else
                        mask = maskNew();
                    {
                        const { includes } = info;
                        const includeSet = includeSetMap[name] = createMap<null>();
                        if (_Array_isArray(includes))
                        {
                            for (const include of includes)
                                includeSet[include] = null;
                        }
                        else
                        {
                            const inheritedIncludeSet = includeSetMap[inherits!];
                            for (const include in inheritedIncludeSet)
                                includeSet[include] = null;
                            if (includes)
                            {
                                const includeDiffNames = _Object_keys(includes);
                                for (const include of includeDiffNames)
                                {
                                    if (includes[include])
                                        includeSet[include] = null;
                                    else
                                        delete includeSet[include];
                                }
                            }
                        }
                        for (const include in includeSet)
                        {
                            const includeMask = completeFeature(include);
                            mask = maskUnion(mask, includeMask);
                        }
                    }
                    const attributes = createMap<string | null>();
                    if (inherits != null)
                    {
                        const inheritedAttributes = ALL[inherits].attributes;
                        for (const attributeName in inheritedAttributes)
                            attributes[attributeName] = inheritedAttributes[attributeName];
                    }
                    {
                        const newAttributes = info.attributes;
                        if (newAttributes)
                        {
                            const attributeNames = _Object_keys(newAttributes);
                            for (const attributeName of attributeNames)
                            {
                                const attributeValue = newAttributes[attributeName];
                                if (attributeValue !== undefined)
                                    attributes[attributeName] = attributeValue;
                                else
                                    delete attributes[attributeName];
                            }
                        }
                    }
                    const elementary = wrappedCheck ?? info.excludes;
                    featureObj =
                    createFeature(name, mask, wrappedCheck, engine, attributes, elementary);
                    if (elementary)
                        ELEMENTARY.push(featureObj);
                }
                ALL[name] = featureObj;
                DESCRIPTION_MAP[name] = description;
            }
            return mask;
        }

        {
            const constructorSource =
            {
                ALL,
                ELEMENTARY,
                _getValidFeatureMask,
                areCompatible,
                areEqual,
                commonOf,
                descriptionFor,
                fromMask,
            };
            assignNoEnum(Feature, constructorSource);
        }
        {
            let inspectKey: symbol | undefined;
            try
            {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                inspectKey = (require('util') as typeof util).inspect.custom;
            }
            catch
            { }
            if (inspectKey)
            {
                _Object_defineProperty
                (
                    FEATURE_PROTOTYPE,
                    inspectKey,
                    { configurable: true, value: inspect, writable: true },
                );
            }
        }

        const featureNames = _Object_keys(featureInfos);
        const includeSetMap = createMap<{ readonly [FeatureName in string]: null; }>();
        let unionMask = maskNew();

        featureNames.forEach(completeFeature);
        completeExclusions();
        PRISTINE_ELEMENTARY = ELEMENTARY.slice();
        ELEMENTARY.sort((feature1, feature2): number => feature1.name < feature2.name ? -1 : 1);
        _Object_freeze(ELEMENTARY);
        _Object_freeze(ALL);
    }
    )();

    return Feature as FeatureConstructor;
}

function throwUnknownFeatureError(name: string): never
{
    throw new _Error(`Unknown feature ${_JSON_stringify(name)}`);
}

function wrapCheck(check: () => unknown): () => boolean
{
    const wrappedCheck = (): boolean => !!check();
    return wrappedCheck;
}
