import { maskAreEqual, maskIncludes, maskIntersection, maskNew, maskNext, maskUnion }
from './mask';
import type { Mask }                    from './mask';
import { MaskSet }                      from './mask-index';
import type util                        from 'util';
import type { InspectOptionsStylized }  from 'util';

interface AttributeMap
{
    readonly [key: string]: string | null | undefined;
}

type CompatibleFeatureArray = readonly FeatureElement[];

interface Feature
{
    readonly attributes?:       AttributeMap;
    readonly canonicalNames:    string[];
    readonly mask:              Mask;
    readonly name?:             string;
    toString():                 string;
}

interface FeatureConstructor
{
    ():     Feature;
    ALL:    { [featureName: string]: Feature | undefined; };
    new (): Feature;
}

type FeatureElement = Feature | string;

interface FeatureInfo
{
    readonly aliasFor?:     string;
    readonly attributes:    AttributeMap;
    readonly check?:        () => unknown;
    readonly description?:  string;
    readonly engine?:       string;
    readonly excludes?:     readonly string[];
    readonly includes?:     readonly string[];
}

const _Array_isArray            = Array.isArray;
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

const createMap = <T>(): { [key: string]: T | undefined; } => _Object_create(null) as { };

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
    attributeCache: { [key: string]: boolean | undefined; },
    attributeName: string,
    featureObjs: readonly Feature[],
): boolean
{
    let returnValue = attributeCache[attributeName];
    if (returnValue === undefined)
    {
        attributeCache[attributeName] =
        returnValue =
        featureObjs.some((featureObj): boolean => attributeName in featureObj.attributes!);
    }
    return returnValue;
}

export function makeFeatureClass
(featureInfos: { readonly [name: string]: FeatureInfo; }): FeatureConstructor
{
    const ALL                               = createMap<Feature>();
    const DESCRIPTION_MAP                   = createMap<string>();
    const ELEMENTARY: Feature[]             = [];
    const FEATURE_PROTOTYPE                 = Feature.prototype as object;
    const INCLUDES_MAP                      = createMap<readonly string[]>();
    const INCOMPATIBLE_MASK_LIST: Mask[]    = [];

    function Feature(this: Feature, ...args: (FeatureElement | CompatibleFeatureArray)[]): Feature
    {
        const mask = validMaskFromArguments(args);
        const featureObj =
        this instanceof Feature ? this : _Object_create(FEATURE_PROTOTYPE) as Feature;
        initMask(featureObj, mask);
        return featureObj;
    }

    function areCompatible(): boolean
    {
        let arg0: CompatibleFeatureArray;
        const features =
        (
            arguments.length === 1 &&
            _Array_isArray(arg0 = arguments[0] as CompatibleFeatureArray) ?
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
        check?: () => boolean,
        engine?: string,
        attributes = { },
        elementary?: unknown,
    ): Feature
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
        const featureObj = _Object_create(FEATURE_PROTOTYPE, descriptors) as Feature;
        initMask(featureObj, mask);
        return featureObj;
    }

    function descriptionFor(name: string): string
    {
        name = esToString(name);
        const description = DESCRIPTION_MAP[name];
        if (description == null)
            throwUnknownFeatureError(name);
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

    function getValidFeatureMask(arg?: FeatureElement | CompatibleFeatureArray): Mask
    {
        const mask = arg !== undefined ? validMaskFromArrayOrStringOrFeature(arg) : maskNew();
        return mask;
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
            const featureObj = ALL[name];
            if (!featureObj)
                throwUnknownFeatureError(name);
            ({ mask } = featureObj);
        }
        return mask;
    }

    function registerFeature(name: string, description: string, featureObj: Feature): void
    {
        const descriptor = { enumerable: true, value: featureObj };
        _Object_defineProperty(Feature, name, descriptor);
        ALL[name] = featureObj;
        DESCRIPTION_MAP[name] = description;
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
                otherMask = maskFromStringOrFeature(arg as FeatureElement);
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
            mask = maskFromStringOrFeature(arg as FeatureElement);
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
                const featureNameSet = createMap<null>();
                const allIncludes: string[] = [];
                for (const featureObj of ELEMENTARY)
                {
                    const included = maskIncludes(mask, featureObj.mask);
                    if (included)
                    {
                        const name = featureObj.name!;
                        featureNameSet[name] = null;
                        const includes = INCLUDES_MAP[name];
                        allIncludes.push(...includes!);
                    }
                }
                for (const name of allIncludes)
                    delete featureNameSet[name];
                const names = _Object_keys(featureNameSet).sort();
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
                        names.push(featureObj.name!);
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
            (this: Feature, environment: string, engineFeatureObjs?: readonly Feature[]): Feature
            {
                let resultMask = maskNew();
                const thisMask = this.mask;
                const attributeCache = createMap() as { [key: string]: boolean | undefined; };
                for (const featureObj of ELEMENTARY)
                {
                    const otherMask = featureObj.mask;
                    const included = maskIncludes(thisMask, otherMask);
                    if (included)
                    {
                        const attributeValue = featureObj.attributes![environment];
                        if
                        (
                            attributeValue === undefined ||
                            engineFeatureObjs !== undefined &&
                            !isExcludingAttribute
                            (attributeCache, attributeValue!, engineFeatureObjs)
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
                const { excludes } = featureInfos[name];
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
            let featureObj = ALL[name];
            if (featureObj)
                ({ mask } = featureObj);
            else
            {
                let description: string | undefined;
                const info = featureInfos[name];
                const { aliasFor, engine } = info;
                if (engine == null)
                    ({ description } = info);
                else
                    description = createEngineFeatureDescription(engine);
                if (aliasFor != null)
                {
                    mask = completeFeature(aliasFor);
                    featureObj = ALL[aliasFor]!;
                    if (description == null)
                        description = DESCRIPTION_MAP[aliasFor]!;
                }
                else
                {
                    let { check } = info;
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
                    const includes = INCLUDES_MAP[name] = info.includes ?? [];
                    for (const include of includes)
                    {
                        const includeMask = completeFeature(include);
                        mask = maskUnion(mask, includeMask);
                    }
                    const elementary = check ?? info.excludes;
                    featureObj =
                    createFeature
                    (
                        name,
                        mask,
                        check as (() => boolean) | undefined,
                        engine,
                        info.attributes,
                        elementary,
                    );
                    if (elementary)
                        ELEMENTARY.push(featureObj);
                }
                registerFeature(name, description!, featureObj);
            }
            return mask;
        }

        {
            const constructorSource =
            {
                ALL,
                ELEMENTARY,
                areCompatible,
                areEqual,
                commonOf,
                descriptionFor,
                fromMask,
                getValidFeatureMask,
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
        let autoMask = maskNew();
        let unionMask = maskNew();

        const featureNames = _Object_keys(featureInfos);
        featureNames.forEach(completeFeature);
        completeExclusions();
        ELEMENTARY.sort((feature1, feature2): number => feature1.name! < feature2.name! ? -1 : 1);
        _Object_freeze(ELEMENTARY);
        const autoFeatureObj = createFeature('AUTO', autoMask);
        registerFeature('AUTO', 'All features available in the current engine.', autoFeatureObj);
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
