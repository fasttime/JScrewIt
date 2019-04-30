/**
 * An array containing any number of feature objects or names or aliases of predefined features, in
 * no particular order.
 *
 * All of the specified features need to be compatible, so that their union can be constructed.
 *
 * @remarks
 *
 * An error is thrown if the specified features are not mutually compatible.
 */
type CompatibleFeatureArray = Readonly<FeatureElement[]>;

/**
 * Objects of this type indicate which of the capabilities that JScrewIt can use to minimize the
 * length of its output are available in a particular JavaScript engine.
 *
 * JScrewIt comes with a set of predefined feature objects exposed as property values of
 * [[JScrewIt.Feature]] or `JScrewIt.Feature.ALL`, where the property name is the feature's name or
 * an alias thereof.
 *
 * Besides these predefined features, it is possible to construct custom features from the union
 * or intersection of other features.
 *
 * Among the predefined features, there are some special ones called *elementary* features.
 * Elementary features either cannot be expressed as a union of any number of other features, or
 * they are different from such a union in that they exclude some other feature not excluded by
 * their elementary components.
 * All other features, called *composite* features, can be constructed as a union of zero or more
 * elementary features.
 * Two of the predefined composite features are particularly important:
 * [`DEFAULT`](_feature_d_.featureall.md#DEFAULT) is the empty feature, indicating that no
 * elementary feature is available at all; [`AUTO`](_feature_d_.featureall.md#AUTO) is the union of
 * all elementary features available in the current engine.
 *
 * Not all features can be available at the same time: some features are necessarily incompatible,
 * meaning that they mutually exclude each other, and thus their union cannot be constructed.
 */
interface Feature
{
    /**
     * An array of all elementary feature names included in this feature object, without aliases and
     * implied features.
     */
    readonly canonicalNames: string[];

    /**
     * A short description of this feature object in plain English.
     *
     * All predefined features have a description.
     * If desired, custom features may be assigned a description, too.
     */
    description?: string;

    /** A boolean value indicating whether this is an elementary feature object. */
    elementary: boolean;

    /**
     * An array of all elementary feature names included in this feature object, without aliases.
     */
    readonly elementaryNames: string[];

    /**
     * The primary name of this feature object, useful for identification purpose.
     *
     * All predefined features have a name.
     * If desired, custom features may be assigned a name, too.
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
    includes(...features: (FeatureElement | CompatibleFeatureArray)[]): boolean;

    /**
     * Creates a new feature object from this feature by removing elementary features that are not
     * available inside a particular environment.
     *
     * This method is useful to selectively exclude features that are not available inside a web
     * worker.
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
     * Removes features that are not available in environments that require strict mode code.</dd>
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
    restrict(environment: string, engineFeatureObjs: Feature[]): Feature;
}

interface FeatureConstructor extends FeatureAll
{
    /**
     * An immutable mapping of all predefined feature objects accessed by name or alias.
     *
     * For an exhaustive list of all features, see the
     * [Feature Reference](_feature_d_.featureall.md).
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
    readonly ELEMENTARY: Feature[];

    /**
     * Creates a new feature object from the union of the specified features.
     *
     * The constructor can be used with or without the `new` operator, e.g.
     * `new JScrewIt.Feature(feature1, feature2)` or `JScrewIt.Feature(feature1, feature2)`.
     * If no arguments are specified, the new feature object will be equivalent to
     * [`DEFAULT`](_feature_d_.featureall.md#DEFAULT).
     *
     * @example
     *
     * The following statements are equivalent, and will all construct a new feature object
     * including both [`ANY_DOCUMENT`](_feature_d_.featureall.md#ANY_DOCUMENT) and
     * [`ANY_WINDOW`](_feature_d_.featureall.md#ANY_WINDOW).
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
     * @remarks
     *
     * An error is thrown if any of the specified arguments is neither a feature object nor a name
     * or alias of a predefined feature, or if the specified features are not mutually compatible.
     */
    new (...features: (FeatureElement | CompatibleFeatureArray)[]): Feature;

    /**
     * Creates a new feature object from the union of the specified features.
     *
     * The constructor can be used with or without the `new` operator, e.g.
     * `new JScrewIt.Feature(feature1, feature2)` or `JScrewIt.Feature(feature1, feature2)`.
     * If no arguments are specified, the new feature object will be equivalent to
     * [`DEFAULT`](_feature_d_.featureall.md#DEFAULT).
     *
     * @example
     *
     * The following statements are equivalent, and will all construct a new feature object
     * including both [`ANY_DOCUMENT`](_feature_d_.featureall.md#ANY_DOCUMENT) and
     * [`ANY_WINDOW`](_feature_d_.featureall.md#ANY_WINDOW).
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
     * @remarks
     *
     * An error is thrown if any of the specified arguments is neither a feature object nor a name
     * or alias of a predefined feature, or if the specified features are not mutually compatible.
     */
    (...features: (FeatureElement | CompatibleFeatureArray)[]): Feature;

    /**
     * Determines whether the specified features are mutually compatible.
     *
     * @returns
     *
     * `true` if the specified features are mutually compatible; otherwise, `false`.
     * If the array argument contains less than two features, the return value is `true`.
     *
     * @example
     *
     * ```js
     * // false: only one of "V8_SRC" or "IE_SRC" may be available.
     * JScrewIt.Feature.areCompatible(["V8_SRC", "IE_SRC"])
     * ```
     *
     * ```js
     * // true
     * JScrewIt.Feature.areCompatible([JScrewIt.Feature.DEFAULT, JScrewIt.Feature.FILL])
     * ```
     */
    areCompatible(features: Readonly<FeatureElement[]>): boolean;

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
     * JScrewIt.Feature.areEqual(JScrewIt.Feature.CHROME, JScrewIt.Feature.FIREFOX)
     * ```
     *
     * ```js
     * // true
     * JScrewIt.Feature.areEqual("DEFAULT", [])
     * ```
     */
    areEqual(...features: (FeatureElement | CompatibleFeatureArray)[]): boolean;

    /**
     * Creates a new feature object equivalent to the intersection of the specified features.
     *
     * @returns
     *
     * A feature object, or `null` if no arguments are specified.
     *
     * @example
     *
     * This will create a new feature object equivalent to [`NAME`](_feature_d_.featureall.md#NAME).
     *
     * ```js
     * var newFeature = JScrewIt.Feature.commonOf(["ATOB", "NAME"], ["NAME", "SELF"]);
     * ```
     *
     * This will create a new feature object equivalent to
     * [`ANY_DOCUMENT`](_feature_d_.featureall.md#ANY_DOCUMENT).
     * This is because both [`HTMLDOCUMENT`](_feature_d_.featureall.md#HTMLDOCUMENT) and
     * [`DOCUMENT`](_feature_d_.featureall.md#DOCUMENT) imply
     * [`ANY_DOCUMENT`](_feature_d_.featureall.md#ANY_DOCUMENT).
     *
     * ```js
     * var newFeature = JScrewIt.Feature.commonOf("HTMLDOCUMENT", "DOCUMENT");
     * ```
     */
    commonOf(...features: (FeatureElement | CompatibleFeatureArray)[]): Feature | null;
}

/**
 * A feature object or name or alias of a predefined feature.
 *
 * @remarks
 *
 * An error is thrown if the specified value is neither a feature object nor a name or alias of a
 * predefined feature.
 */
type FeatureElement = Feature | string;

interface JScrewIt { Feature: FeatureConstructor; }
