import type { ElementaryFeatureName, FeatureAll, PredefinedFeatureName } from './feature-all';

export interface CustomFeature extends Feature
{
    readonly elementary: false;
}

export interface ElementaryFeature extends PredefinedFeature
{
    readonly elementary:    true;
    readonly name:          ElementaryFeatureName;
}

/**
 * Objects of this type indicate which of the capabilities that JScrewIt can use to minimize the
 * length of its output are available in a particular JavaScript engine.
 *
 * JScrewIt comes with a set of predefined feature objects exposed as property values of
 * `JScrewIt.Feature` or [[ALL|`JScrewIt.Feature.ALL`]], where the property name is the feature's
 * name or alias.
 *
 * Besides these predefined features, it is possible to construct custom features from the union or
 * intersection of other features.
 *
 * Among the predefined features, there are some special ones called *elementary* features.
 * Elementary features either cannot be expressed as a union of any number of other features, or
 * they are different from such a union in that they exclude some other feature not excluded by
 * their elementary components.
 * All other features, called *composite* features, can be constructed as a union of zero or more
 * elementary features.
 * Two of the predefined composite features are particularly important: <code>[[DEFAULT]]</code> is
 * the empty feature, indicating that no elementary feature is available at all;
 * <code>[[AUTO]]</code> is the union of all elementary features available in the current
 * environment.
 *
 * Not all features can be available at the same time: some features are necessarily incompatible,
 * meaning that they mutually exclude each other, and thus their union cannot be constructed.
 */
export interface Feature
{
    /**
     * An array of all elementary feature names included in this feature object, without aliases and
     * implied features.
     */
    readonly canonicalNames: ElementaryFeatureName[];

    /** A boolean value indicating whether this is an elementary feature object. */
    readonly elementary: boolean;

    /**
     * An array of all elementary feature names included in this feature object, without aliases.
     */
    readonly elementaryNames: ElementaryFeatureName[];

    /**
     * The primary name of this feature object, useful for identification purpose.
     *
     * All predefined features have a name; custom features may be optionally assigned a name, too.
     * If a name is assigned, it will be used when the feature is converted into a string.
     */
    name?: string;

    /**
     * Determines whether this feature object includes all of the specified features.
     *
     * @returns
     *
     * `true` if this feature object includes all of the specified features; otherwise, `false`.
     * If no arguments are specified, the return value is `true`.
     */
    includes(...features: FeatureElementOrCompatibleArray[]): boolean;

    /**
     * Creates a new feature object from this feature by removing elementary features that are not
     * available inside a particular environment.
     *
     * This method is useful to selectively exclude features that are not available in environments
     * that require strict mode code, or inside web workers.
     *
     * @param environment
     *
     * The environment to which this feature should be restricted.
     * Two environments are currently supported.
     *
     * <dl>
     *
     * <dt><code>"forced-strict-mode"</code></dt>
     * <dd>
     * Removes features that are not available in environments that require strict mode code.
     * </dd>
     *
     * <dt><code>"web-worker"</code></dt>
     * <dd>Removes features that are not available inside web workers.</dd>
     *
     * </dl>
     *
     * @param engineFeatureObjs
     *
     * An array of predefined feature objects, each corresponding to a particular engine in which
     * the restriction should be enacted.
     * If this parameter is omitted, the restriction is enacted in all engines.
     */
    restrict
    (
        environment:        'forced-strict-mode' | 'web-worker',
        engineFeatureObjs?: readonly PredefinedFeature[],
    ):
    CustomFeature;
}

export const Feature: FeatureConstructor;

export interface FeatureConstructor extends FeatureAll
{

    /**
     * Creates a new feature object from the union of the specified features.
     *
     * The constructor can be used with or without the `new` operator, e.g.
     * `new JScrewIt.Feature(feature1, feature2)` or `JScrewIt.Feature(feature1, feature2)`.
     * If no arguments are specified, the new feature object will be equivalent to
     * <code>[[DEFAULT]]</code>.
     *
     * @example
     *
     * The following statements are equivalent, and will all construct a new feature object
     * including both <code>[[ANY_DOCUMENT]]</code> and <code>[[ANY_WINDOW]]</code>.
     *
     * ```js
     * new JScrewIt.Feature("ANY_DOCUMENT", "ANY_WINDOW");
     * ```
     *
     * ```js
     * new JScrewIt.Feature(JScrewIt.Feature.ANY_DOCUMENT, JScrewIt.Feature.ANY_WINDOW);
     * ```
     *
     * ```js
     * new JScrewIt.Feature([JScrewIt.Feature.ANY_DOCUMENT, JScrewIt.Feature.ANY_WINDOW]);
     * ```
     *
     * @throws
     *
     * An error is thrown if any of the specified features are not mutually compatible.
     */
    (...features: FeatureElementOrCompatibleArray[]): CustomFeature;

    /**
     * An immutable mapping of all predefined feature objects accessed by name or alias.
     *
     * @example
     *
     * This will produce an array with the names and aliases of all predefined features.
     *
     * ```js
     * Object.keys(JScrewIt.Feature.ALL)
     * ```
     *
     * This will determine if a particular feature object is predefined or not.
     *
     * ```js
     * featureObj === JScrewIt.Feature.ALL[featureObj.name]
     * ```
     */
    readonly ALL: FeatureAll;

    /** An immutable array of all elementary feature objects ordered by name. */
    readonly ELEMENTARY: readonly ElementaryFeature[];

    /**
     * Creates a new feature object from the union of the specified features.
     *
     * The constructor can be used with or without the `new` operator, e.g.
     * `new JScrewIt.Feature(feature1, feature2)` or `JScrewIt.Feature(feature1, feature2)`.
     * If no arguments are specified, the new feature object will be equivalent to
     * <code>[[DEFAULT]]</code>.
     *
     * @example
     *
     * The following statements are equivalent, and will all construct a new feature object
     * including both <code>[[ANY_DOCUMENT]]</code> and <code>[[ANY_WINDOW]]</code>.
     *
     * ```js
     * JScrewIt.Feature("ANY_DOCUMENT", "ANY_WINDOW");
     * ```
     *
     * ```js
     * JScrewIt.Feature(JScrewIt.Feature.ANY_DOCUMENT, JScrewIt.Feature.ANY_WINDOW);
     * ```
     *
     * ```js
     * JScrewIt.Feature([JScrewIt.Feature.ANY_DOCUMENT, JScrewIt.Feature.ANY_WINDOW]);
     * ```
     *
     * @throws
     *
     * An error is thrown if any of the specified features are not mutually compatible.
     */
    new (...features: FeatureElementOrCompatibleArray[]): CustomFeature;

    /**
     * Determines whether the specified features are mutually compatible.
     *
     * @returns
     *
     * `true` if the specified features are mutually compatible; otherwise, `false`.
     * If less than two features are specified, the return value is `true`.
     *
     * @example
     *
     * ```js
     * // false: only one of "V8_SRC" or "IE_SRC" may be available.
     * JScrewIt.Feature.areCompatible("V8_SRC", "IE_SRC")
     * ```
     *
     * ```js
     * // true
     * JScrewIt.Feature.areCompatible(JScrewIt.Feature.DEFAULT, JScrewIt.Feature.FILL)
     * ```
     */
    areCompatible(...features: FeatureElement[]): boolean;

    /**
     * Determines whether all of the specified features are equivalent.
     *
     * Different features are considered equivalent if they include the same set of elementary
     * features, regardless of any other difference.
     *
     * @returns
     *
     * `true` if all of the specified features are equivalent; otherwise, `false`.
     * If less than two arguments are specified, the return value is `true`.
     *
     * @example
     *
     * ```js
     * // false
     * JScrewIt.Feature.areEqual(JScrewIt.Feature.CHROME, JScrewIt.Feature.FF)
     * ```
     *
     * ```js
     * // true
     * JScrewIt.Feature.areEqual("DEFAULT", [])
     * ```
     */
    areEqual(...features: FeatureElementOrCompatibleArray[]): boolean;

    /**
     * Creates a new feature object equivalent to the intersection of the specified features.
     *
     * @returns
     *
     * A feature object, or `null` if no arguments are specified.
     *
     * @example
     *
     * This will create a new feature object equivalent to <code>[[NAME]]</code>.
     *
     * ```js
     * const newFeature = JScrewIt.Feature.commonOf(["ATOB", "NAME"], ["NAME", "SELF"]);
     * ```
     *
     * This will create a new feature object equivalent to <code>[[ANY_DOCUMENT]]</code>.
     * This is because both <code>[[HTMLDOCUMENT]]</code> and <code>[[DOCUMENT]]</code> imply
     * <code>[[ANY_DOCUMENT]]</code>.
     *
     * ```js
     * const newFeature = JScrewIt.Feature.commonOf("HTMLDOCUMENT", "DOCUMENT");
     * ```
     */
    commonOf(...features: FeatureElementOrCompatibleArray[]): CustomFeature | null;

    /**
     * Returns a short description of a predefined feature in plain English.
     *
     * @param name
     *
     * A name or alias of a predefined feature.
     *
     * @remarks
     *
     * Different names or aliases of the same feature may have different descriptions.
     *
     * @throws
     *
     * An error is thrown if the specified argument is not a name or alias of a predefined feature.
     */
    descriptionFor(name: keyof FeatureAll): string;
}

/**
 * A feature object or a name or alias of a predefined feature.
 *
 * @remarks
 *
 * Methods that accept parameters of this type throw an error if the specified value is neither a
 * feature object nor a name or alias of a predefined feature.
 */
export type FeatureElement = Feature | keyof FeatureAll;

/**
 * A feature object, a name or alias of a predefined feature, or an array of such values that
 * defines a union of mutually compatible features.
 *
 * @remarks
 *
 * Methods that accept parameters of this type throw an error if the specified value is neither a
 * feature object nor a name or alias of a predefined feature, or if it is an array of values that
 * does not define a union of mutually compatible features.
 */
export type FeatureElementOrCompatibleArray = FeatureElement | readonly FeatureElement[];

export interface PredefinedFeature extends Feature
{
    readonly name: PredefinedFeatureName;
}
