import type util    from 'node:util';

import { MASK_EMPTY, type Mask, maskAreEqual, maskIncludes, maskIntersection, maskNext, maskUnion }
from './mask-impl';

import { MaskSet }  from './mask-index';

export type AttributeMap = Readonly<Record<string, string | null>>;

export interface CompatibilityInfo
{
    readonly family:        string;
    readonly featureName:   string;
    readonly version:       EngineVersion;
    readonly tag?:          string;
    readonly shortTag?:     string;
}

export interface EngineEntry
{
    readonly family:            string;
    readonly compatibilities:   readonly CompatibilityInfo[];
}

export type EngineVersion = string | Readonly<{ from: string; to?: string; dense: boolean; }>;

export interface Feature
{
    readonly canonicalNames:                                    string[];
    readonly elementary:                                        boolean;
    readonly elementaryNames:                                   string[];
    readonly mask:                                              Mask;
    name?:                                                      string;
    includes(...features: FeatureElementOrCompatibleArray[]):   boolean;
    toString():                                                 string;
}

export interface FeatureConstructor
{
    (...features: FeatureElementOrCompatibleArray[]):           Feature;

    readonly ALL:
    Readonly<Record<string, PredefinedFeature>>;

    readonly ELEMENTARY:                                        readonly PredefinedFeature[];

    readonly ENGINE:                                            readonly PredefinedFeature[];

    readonly FAMILIES:
    Readonly<Record<string, CompatibilityInfo[]>>;

    new (...features: FeatureElementOrCompatibleArray[]):       Feature;
    _fromMask(mask: Mask):                                      Feature | null;
    _getMask(feature?: FeatureElementOrCompatibleArray):        Mask;
    areCompatible(...features: FeatureElement[]):               boolean;

    /** @deprecated */
    areCompatible(features: readonly FeatureElement[]):         boolean;
    areEqual(...features: FeatureElementOrCompatibleArray[]):   boolean;
    commonOf(...features: FeatureElementOrCompatibleArray[]):   Feature | null;
    descriptionFor(name: string):                               string | undefined;
}

export type FeatureElement = Feature | string;

export type FeatureElementOrCompatibleArray = FeatureElement | readonly FeatureElement[];

export type FeatureInfo =
(
    {
        readonly aliasFor:      string;
    } |
    {
        readonly attributes?:   Readonly<Record<string, string | null | undefined>>;
        readonly check?:        () => unknown;
        readonly excludes?:     readonly string[];
        readonly includes?:     readonly string[] | IncludeDifferenceMap;
        readonly inherits?:     string;
    } &
    ({ } | { readonly families?: readonly string[]; readonly versions: readonly VersionInfo[]; }) &
    ({ } | { readonly compatibilityTag: string; readonly compatibilityShortTag: string; })
) &
{ readonly description?: string; };

export type IncludeDifferenceMap = Readonly<Record<string, boolean>>;

export interface PredefinedFeature extends Feature
{
    readonly attributes:    AttributeMap;
    readonly check:         (() => boolean) | null;
    readonly name:          string;
}

export type VersionInfo =
string | readonly [from: string, to?: string] | readonly [from: string, _: never, to?: string];

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

export function createFeatureClass
(
    featureInfos: Readonly<Record<string, FeatureInfo>>,
    formatEngineDescription?: (compatibilities: CompatibilityInfo[]) => string,
):
FeatureConstructor
{
    const ALL                               = createMap<PredefinedFeature>();
    const DESCRIPTION_MAP                   = createMap<string | undefined>();
    const ELEMENTARY: PredefinedFeature[]   = [];
    const ENGINE: PredefinedFeature[]       = [];
    const FAMILIES                          = createMap<CompatibilityInfo[]>();
    const FEATURE_PROTOTYPE                 = Feature.prototype as object;
    const INCOMPATIBLE_MASK_LIST: Mask[]    = [];
    let PRISTINE_ELEMENTARY: PredefinedFeature[];

    function Feature(this: Feature, ...features: FeatureElementOrCompatibleArray[]): Feature
    {
        let mask = MASK_EMPTY;
        for (const feature of features)
        {
            const otherMask = validMaskFromArrayOrStringOrFeature(feature);
            mask = maskUnion(mask, otherMask);
        }
        if (features.length > 1)
            validateMask(mask);
        const featureObj =
        this instanceof Feature ? this : _Object_create(FEATURE_PROTOTYPE) as Feature;
        initMask(featureObj, mask);
        return featureObj;
    }

    function _fromMask(mask: Mask): Feature | null
    {
        if (isMaskCompatible(mask))
        {
            let includedMask = MASK_EMPTY;
            for (const { mask: featureMask } of ELEMENTARY)
            {
                if (maskIncludes(mask, featureMask))
                    includedMask = maskUnion(includedMask, featureMask);
            }
            if (maskAreEqual(mask, includedMask))
            {
                const featureObj = featureFromMask(mask);
                return featureObj;
            }
        }
        return null;
    }

    function _getMask(feature?: FeatureElementOrCompatibleArray): Mask
    {
        const mask =
        feature !== undefined ? validMaskFromArrayOrStringOrFeature(feature) : MASK_EMPTY;
        return mask;
    }

    function areCompatible(): boolean
    {
        let arg0: FeatureElement | readonly FeatureElement[];
        const features: ArrayLike<FeatureElement> =
        arguments.length === 1 &&
        // eslint-disable-next-line prefer-rest-params
        _Array_isArray(arg0 = arguments[0] as FeatureElement | readonly FeatureElement[]) ?
        // eslint-disable-next-line prefer-rest-params
        arg0 : arguments as ArrayLike<FeatureElement>;
        const mask = featureArrayLikeToMask(features);
        const compatible = isMaskCompatible(mask);
        return compatible;
    }

    function areEqual(...features: FeatureElementOrCompatibleArray[]): boolean
    {
        let mask: Mask;
        const equal =
        features.every
        (
            (feature, index): boolean =>
            {
                let returnValue: boolean;
                const otherMask = validMaskFromArrayOrStringOrFeature(feature);
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

    function commonOf(...features: FeatureElementOrCompatibleArray[]): Feature | null
    {
        let featureObj: Feature | null;
        if (features.length)
        {
            let mask: Mask | undefined;
            for (const feature of features)
            {
                const otherMask = validMaskFromArrayOrStringOrFeature(feature);
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
        name:           string,
        mask:           Mask,
        check:          (() => boolean) | null,
        attributes:     AttributeMap,
        elementary?:    unknown,
    ):
    PredefinedFeature
    {
        _Object_freeze(attributes);
        const descriptors: PropertyDescriptorMap =
        { attributes: { value: attributes }, check: { value: check }, name: { value: name } };
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

    function featureArrayLikeToMask(features: ArrayLike<FeatureElement>): Mask
    {
        let mask = MASK_EMPTY;
        const { length } = features;
        for (let index = 0; index < length; ++index)
        {
            const feature = features[index];
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

    /**
     * Node.js custom inspection function.
     * Set on `Feature.prototype` with name `"inspect"` for Node.js ≤ 8.6.x and with symbol
     * `Symbol.for("nodejs.util.inspect.custom")` for Node.js ≥ 6.6.x.
     *
     * @see
     * {@link https://nodejs.org/api/util.html#util_custom_inspection_functions_on_objects} for
     * further information.
     */
    // opts can be undefined in Node.js 0.10.0.
    function inspect(this: Feature, depth: never, opts?: util.InspectOptionsStylized): string
    {
        const breakLength = opts?.breakLength ?? 80;
        const compact = opts?.compact ?? true;
        let { name } = this;
        if (name === undefined)
            name = joinParts(compact, '<', '', this.canonicalNames, ',', '>', breakLength - 3);
        const parts = [name];
        if (this.elementary)
            parts.push('(elementary)');
        if ((this as PredefinedFeature).check)
            parts.push('(check)');
        {
            const { attributes } = this as PredefinedFeature;
            if (typeof attributes === 'object')
            {
                const str = utilInspect!({ ...attributes }, opts);
                parts.push(str);
            }
        }
        const str = joinParts(compact, '[Feature', ' ', parts, '', ']', breakLength - 1);
        return str;
    }

    function isMaskCompatible(mask: Mask): boolean
    {
        const compatible =
        INCOMPATIBLE_MASK_LIST.every
        ((incompatibleMask): boolean => !maskIncludes(mask, incompatibleMask));
        return compatible;
    }

    function maskFromStringOrFeature(feature: FeatureElement): Mask
    {
        let featureObj: Feature;
        if (feature instanceof Feature)
            featureObj = feature;
        else
        {
            const name = esToString(feature);
            if (!(name in ALL))
                throwUnknownFeatureError(name);
            featureObj = ALL[name];
        }
        const { mask } = featureObj;
        return mask;
    }

    function validMaskFromArrayOrStringOrFeature(feature: FeatureElementOrCompatibleArray): Mask
    {
        let mask: Mask;
        if (_Array_isArray(feature))
        {
            mask = featureArrayLikeToMask(feature);
            if (feature.length > 1)
                validateMask(mask);
        }
        else
            mask = maskFromStringOrFeature(feature);
        return mask;
    }

    function validateMask(mask: Mask): void
    {
        if (!isMaskCompatible(mask))
            throw new _Error('Incompatible features');
    }

    let utilInspect: typeof util.inspect | undefined;
    try
    {
        /* eslint-disable @typescript-eslint/no-require-imports */

        utilInspect = (require('util') as typeof util).inspect;

        /* eslint-enable @typescript-eslint/no-require-imports */
    }
    catch
    { }

    {
        const protoSource =
        {
            get canonicalNames(): string[]
            {
                const { mask } = this;
                const names: string[] = [];
                let includedMask = MASK_EMPTY;
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
                const { mask } = this;
                for (const featureObj of ELEMENTARY)
                {
                    const included = maskIncludes(mask, featureObj.mask);
                    if (included)
                        names.push(featureObj.name);
                }
                return names;
            },

            includes(...features: FeatureElementOrCompatibleArray[]): boolean
            {
                const { mask } = this;
                const included =
                features.every
                (
                    (feature): boolean =>
                    {
                        const otherMask = validMaskFromArrayOrStringOrFeature(feature);
                        const returnValue = maskIncludes(mask, otherMask);
                        return returnValue;
                    },
                );
                return included;
            },

            name:       undefined,

            toString(): string
            {
                const name = this.name ?? `<${this.canonicalNames.join(', ')}>`;
                const str = `[Feature ${name}]`;
                return str;
            },
        } as Record<string, unknown> & ThisType<Feature>;
        if (utilInspect)
            protoSource.inspect = inspect;
        assignNoEnum(FEATURE_PROTOTYPE, protoSource);
    }

    ((): void =>
    {
        const compareFeatureNames =
        (feature1: PredefinedFeature, feature2: PredefinedFeature): number =>
        feature1.name < feature2.name ? -1 : 1;

        function completeExclusions(): void
        {
            const incompatibleMaskSet = new MaskSet();
            for (const name of featureNames)
            {
                const { excludes } =
                featureInfos[name] as { readonly excludes?: readonly string[]; };
                if (excludes)
                {
                    const { mask } = ALL[name];
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
                const info = featureInfos[name];
                const getInfoStringField =
                <FieldNameType extends string>(fieldName: FieldNameType): string | undefined =>
                fieldName in info ?
                esToString((info as Record<FieldNameType, unknown>)[fieldName]) : undefined;
                let description = getInfoStringField('description');
                let featureObj: PredefinedFeature;
                if ('aliasFor' in info)
                {
                    const aliasFor = esToString(info.aliasFor);
                    mask = completeFeature(aliasFor);
                    featureObj = ALL[aliasFor];
                    description ??= DESCRIPTION_MAP[aliasFor];
                }
                else
                {
                    const inherits = getInfoStringField('inherits');
                    if (inherits != null)
                        completeFeature(inherits);
                    let wrappedCheck: (() => boolean) | null;
                    let compatibilities: CompatibilityInfo[] | undefined;
                    const { check } = info;
                    if (check !== undefined)
                    {
                        mask = maskNext(unionMask);
                        unionMask = maskUnion(unionMask, mask);
                        wrappedCheck = wrapCheck(check);
                    }
                    else
                    {
                        mask = MASK_EMPTY;
                        wrappedCheck = null;
                    }
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
                            if (inherits != null)
                            {
                                const inheritedIncludeSet = includeSetMap[inherits];
                                for (const include in inheritedIncludeSet)
                                    includeSet[include] = null;
                            }
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
                    if ('versions' in info)
                    {
                        let { families } = info;
                        const { versions } = info;
                        if (inherits != null)
                            families ??= familiesMap[inherits];
                        familiesMap[name] = families!;
                        const tag = getInfoStringField('compatibilityTag');
                        const shortTag = getInfoStringField('compatibilityShortTag');
                        compatibilities =
                        families!.map
                        (
                            (family: string, index: number): CompatibilityInfo =>
                            {
                                family = esToString(family);
                                const versionInfo = versions[index];
                                let version: EngineVersion;
                                if (_Array_isArray(versionInfo))
                                {
                                    const { length } = versionInfo;
                                    const from = esToString(versionInfo[0]);
                                    const to =
                                    length < 2 ? undefined : esToString(versionInfo[length - 1]);
                                    const dense = versionInfo.length === 2;
                                    version = _Object_freeze({ from, to, dense });
                                }
                                else
                                    version = esToString(versionInfo);
                                const compatibility =
                                _Object_freeze
                                ({ family, featureName: name, version, tag, shortTag });
                                const familyCompatibilities =
                                (FAMILIES[family] as CompatibilityInfo[] | undefined) ??
                                (FAMILIES[family] = []);
                                familyCompatibilities.push(compatibility);
                                return compatibility;
                            },
                        );
                        description ??= formatEngineDescription?.(compatibilities);
                    }
                    const attributes = createMap<string | null>();
                    if (inherits != null)
                    {
                        const inheritedAttributes = ALL[inherits].attributes;
                        for (const attributeName in inheritedAttributes)
                            attributes[attributeName] = inheritedAttributes[attributeName];
                    }
                    {
                        const infoAttributes = info.attributes;
                        if (infoAttributes !== undefined)
                        {
                            const attributeNames = _Object_keys(infoAttributes);
                            for (const attributeName of attributeNames)
                            {
                                const attributeValue = infoAttributes[attributeName];
                                if (attributeValue !== undefined)
                                {
                                    attributes[attributeName] =
                                    typeof attributeValue === 'string' ? attributeValue : null;
                                }
                                else
                                    delete attributes[attributeName];
                            }
                        }
                    }
                    const elementary: unknown = wrappedCheck ?? info.excludes;
                    featureObj = createFeature(name, mask, wrappedCheck, attributes, elementary);
                    if (elementary)
                        ELEMENTARY.push(featureObj);
                    if (compatibilities)
                        ENGINE.push(featureObj);
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
                ENGINE,
                FAMILIES,
                _fromMask,
                _getMask,
                areCompatible,
                areEqual,
                commonOf,
                descriptionFor,
            };
            assignNoEnum(Feature, constructorSource);
        }
        if (utilInspect)
        {
            const inspectKey = utilInspect.custom as symbol | undefined;
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
        const includeSetMap = createMap<Readonly<Record<string, null>>>();
        const familiesMap = createMap<readonly string[]>();
        let unionMask = MASK_EMPTY;

        featureNames.forEach(completeFeature);
        completeExclusions();
        PRISTINE_ELEMENTARY = ELEMENTARY.slice();
        ELEMENTARY.sort(compareFeatureNames);
        _Object_freeze(ELEMENTARY);
        ENGINE.sort(compareFeatureNames);
        _Object_freeze(ENGINE);
        _Object_freeze(ALL);
        _Object_freeze(FAMILIES);
        for (const family in FAMILIES)
            _Object_freeze(FAMILIES[family]);
    }
    )();

    return Feature as FeatureConstructor;
}

const createMap = <T>(): Record<string, T> => _Object_create(null) as { };

function esToString(name: unknown): string
{
    if (typeof name === 'symbol')
        throw new _TypeError('Cannot convert a symbol to a string');
    const str = _String(name);
    return str;
}

export function featuresToMask(featureObjs: readonly Feature[]): Mask
{
    const mask =
    featureObjs.reduce((mask, featureObj): Mask => maskUnion(mask, featureObj.mask), MASK_EMPTY);
    return mask;
}

function indent(text: string): string
{
    const returnValue = text.replace(/^/gm, '  ');
    return returnValue;
}

function initMask(featureObj: Feature, mask: Mask): void
{
    _Object_defineProperty(featureObj, 'mask', { value: mask });
}

function joinParts
(
    compact:        boolean | number,
    intro:          string,
    preSeparator:   string,
    parts:          readonly string[],
    partSeparator:  string,
    outro:          string,
    maxLength:      number,
):
string
{
    function isMultiline(): boolean
    {
        let length =
        intro.length +
        preSeparator.length +
        (parts.length - 1) * (partSeparator.length + 1) +
        outro.length;
        for (const part of parts)
        {
            if (~part.indexOf('\n'))
                return true;
            length += part.replace(/\x1b\[\d+m/g, '').length;
            if (length > maxLength)
                return true;
        }
        return false;
    }

    const str =
    parts.length && (!compact || isMultiline()) ?
    `${intro}\n${indent(parts.join(`${partSeparator}\n`))}\n${outro}` :
    `${intro}${preSeparator}${parts.join(`${partSeparator} `)}${outro}`;
    return str;
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
