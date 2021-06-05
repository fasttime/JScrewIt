// JScrewIt 2.27.0 – https://jscrew.it

(function () {
    'use strict';

    var _Array                           = Array;
    var _Array_isArray                   = _Array.isArray;
    var _Array_prototype                 = _Array.prototype;
    var _Array_prototype_every           = _Array_prototype.every;
    var _Array_prototype_forEach         = _Array_prototype.forEach;
    var _Array_prototype_map             = _Array_prototype.map;
    var _Array_prototype_push            = _Array_prototype.push;

    var _Date                            = Date;

    var _Error                           = Error;

    var _Function                        = Function;

    var _JSON_parse                      = JSON.parse;
    var _JSON_stringify                  = JSON.stringify;

    var _Math_abs                        = Math.abs;
    var _Math_max                        = Math.max;
    var _Math_pow                        = Math.pow;

    var _Object                          = Object;
    var _Object_create                   = _Object.create;
    var _Object_defineProperty           = _Object.defineProperty;
    var _Object_freeze                   = _Object.freeze;
    var _Object_getOwnPropertyDescriptor = _Object.getOwnPropertyDescriptor;
    var _Object_keys                     = _Object.keys;

    var _RegExp                          = RegExp;

    var _String                          = String;

    var _SyntaxError                     = SyntaxError;

    var _TypeError                       = TypeError;

    var _parseInt                        = parseInt;

    var _setTimeout                      = setTimeout;

    function assignNoEnum(target, source)
    {
        var names = _Object_keys(source);
        names.forEach
        (
            function (name)
            {
                var descriptor = _Object_getOwnPropertyDescriptor(source, name);
                descriptor.enumerable = false;
                _Object_defineProperty(target, name, descriptor);
            }
        );
        return target;
    }

    var createEmpty = _Object_create.bind(null, null, undefined);

    function esToString(arg)
    {
        if (typeof arg === 'symbol')
            throw new _TypeError('Cannot convert a symbol to a string');
        var str = _String(arg);
        return str;
    }

    function noProto(obj)
    {
        var result = createEmpty();
        _Object_keys(obj).forEach
        (
            function (name)
            {
                result[name] = obj[name];
            }
        );
        return result;
    }

    var noop = _Function();

    function addCluster(start, length, data, saving)
    {
        var startLink = getOrCreateStartLink(this.startLinks, start);
        var cluster = startLink[length];
        if (cluster)
        {
            if (cluster.saving < saving)
            {
                cluster.data    = data;
                cluster.saving  = saving;
            }
        }
        else
        {
            cluster = startLink[length] = { start: start, length: length, data: data, saving: saving };
            this.clusters.push(cluster);
        }
        if (this.maxLength < length)
            this.maxLength = length;
    }

    function compareClustersByQuality(cluster1, cluster2)
    {
        var diff =
        cluster1.saving - cluster2.saving ||
        cluster2.length - cluster1.length ||
        compareClustersByStart(cluster2, cluster1);
        return diff;
    }

    function compareClustersByStart(cluster1, cluster2)
    {
        var diff = cluster2.start - cluster1.start;
        return diff;
    }

    function conclude()
    {
        var bestClusters = [];
        var clusters = this.clusters;
        if (clusters.length)
        {
            clusters.sort(compareClustersByQuality);
            var cluster;
            while (cluster = pickBestCluster(this.startLinks, clusters, this.maxLength))
                bestClusters.push(cluster);
            bestClusters.sort(compareClustersByStart);
        }
        return bestClusters;
    }

    function getOrCreateStartLink(startLinks, start)
    {
        var startLink = startLinks[start] || (startLinks[start] = []);
        return startLink;
    }

    function pickBestCluster(startLinks, clusters, maxLength)
    {
        var cluster;
        while (cluster = clusters.pop())
        {
            if (cluster.saving != null)
            {
                unlinkClusters(startLinks, maxLength, cluster);
                return cluster;
            }
        }
    }

    function unlinkClusters(startLinks, maxLength, cluster)
    {
        var startLink;
        var start = cluster.start;
        var index = start;
        var end = start + cluster.length;
        do
        {
            startLink = startLinks[index];
            if (startLink)
            {
                unlinkClustersFromLength(startLink, 0);
                delete startLinks[index];
            }
        }
        while (++index < end);
        for (var length = 1; length < maxLength;)
        {
            startLink = startLinks[start - length++];
            if (startLink)
            {
                unlinkClustersFromLength(startLink, length);
                startLink.length = length;
            }
        }
    }

    function unlinkClustersFromLength(startLink, fromLength)
    {
        for (var length = startLink.length; length-- > fromLength;)
        {
            var cluster = startLink[length];
            if (cluster)
                delete cluster.saving;
        }
    }

    function createClusteringPlan()
    {
        var plan =
        {
            addCluster: addCluster,
            clusters:   [],
            conclude:   conclude,
            maxLength:  0,
            startLinks: createEmpty(),
        };
        return plan;
    }

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    // quinquaginta-duo 3.1.1 – https://github.com/fasttime/JScrewIt/tree/master/packages/quinquaginta-duo

    var BIN_POW_31 = 2147483648;
    var BIN_POW_32 = 4294967296;
    var BIN_POW_51 = 2251799813685248;
    var BIT_MASK_31 = 2147483647;
    var EMPTY_MASK = 0;
    /** Determines whether two specified masks are equal. */
    function maskAreEqual(mask1, mask2) {
        return mask1 === mask2;
    }
    /** Determines whether a specified mask includes another one. */
    function maskIncludes(includingMask, includedMask) {
        var includedLoValue;
        var includedHiValue;
        var returnValue = (includingMask &
            (includedLoValue = includedMask | 0)) ===
            includedLoValue &&
            (includingMask / BIN_POW_32 &
                (includedHiValue = includedMask / BIN_POW_32 | 0)) ===
                includedHiValue;
        return returnValue;
    }
    /** Returns a new mask that is the intersection of two specified masks. */
    function maskIntersection(mask1, mask2) {
        var intersectionMask = ((mask1 & mask2 & BIT_MASK_31) +
            (mask1 / BIN_POW_31 & mask2 / BIN_POW_31) * BIN_POW_31);
        return intersectionMask;
    }
    /** Returns a new empty mask. */
    function maskNew() {
        return EMPTY_MASK;
    }
    /**
     * Returns a new non-empty mask that does not intersect the specified mask.
     *
     * @throws If the specified mask is full, a `RangeError` is thrown.
     */
    function maskNext(mask) {
        var nextValue = 1;
        for (var checkValue = mask; checkValue & 1; checkValue /= 2)
            nextValue *= 2;
        if (nextValue > BIN_POW_51)
            throw RangeError('Mask full');
        return nextValue;
    }
    /** Returns a new mask that is the union of two specified masks. */
    function maskUnion(mask1, mask2) {
        var unionMask = (((mask1 | mask2) & BIT_MASK_31) +
            (mask1 / BIN_POW_31 | mask2 / BIN_POW_31) * BIN_POW_31);
        return unionMask;
    }

    var keyFor = function (mask) { return "_" + mask; };
    var MaskIndex = /** @class */ (function () {
        function MaskIndex() {
            this._index = Object.create(null);
            this._size = 0;
        }
        /** Determines whether the current collection contains an entry for a specified mask. */
        MaskIndex.prototype.has = function (mask) {
            var key = keyFor(mask);
            var returnValue = key in this._index;
            return returnValue;
        };
        Object.defineProperty(MaskIndex.prototype, "size", {
            /* The number of entries in the current collection. */
            get: function () {
                return this._size;
            },
            enumerable: false,
            configurable: true
        });
        MaskIndex.prototype._setEntry = function (mask, value) {
            var key = keyFor(mask);
            var _index = this._index;
            if (!(key in _index))
                ++this._size;
            _index[key] = value;
        };
        return MaskIndex;
    }());
    /** A data structure that maps masks to arbitrary values. */
    var MaskMap = /** @class */ (function (_super) {
        __extends(MaskMap, _super);
        function MaskMap() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Retrieves the value associated with a specified mask, or `undefined` if the mask has not been
         * set.
         */
        MaskMap.prototype.get = function (mask) {
            var key = keyFor(mask);
            var value = this._index[key];
            return value;
        };
        /**
         * Associates a specified value with a specified mask.
         * If the mask has already been set, the previous value will be overwritten.
         */
        MaskMap.prototype.set = function (mask, value) {
            this._setEntry(mask, value);
        };
        return MaskMap;
    }(MaskIndex));
    /** A data structure that stores unique masks. */
    var MaskSet = /** @class */ (function (_super) {
        __extends(MaskSet, _super);
        function MaskSet() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Adds a specified mask to the current `MaskSet` object.
         * If the mask has already been added, nothing is done.
         */
        MaskSet.prototype.add = function (mask) {
            this._setEntry(mask, undefined);
        };
        return MaskSet;
    }(MaskIndex));

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
        _Array_prototype_every.call
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

    function checkLocaleNumeral(locale, number, regExp)
    {
        var localizedNumeral = number.toLocaleString(locale);
        var returnValue = regExp.test(localizedNumeral);
        return returnValue;
    }

    function checkSelfFeature()
    {
        // self + '' throws an error inside a web worker in Safari 8 and 9.
        try
        {
            var str = self + '';
        }
        catch (error)
        {
            return false;
        }
        var available = this(str);
        return available;
    }

    function commonOf()
    {
        var returnValue;
        if (arguments.length)
        {
            var mask;
            _Array_prototype_forEach.call
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
        _Array_prototype_forEach.call
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

    function featuresToMask(featureObjs)
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

    function validateMask(mask)
    {
        if (!isMaskCompatible(mask))
            throw new _Error('Incompatible features');
    }

    function validMaskFromArguments(args)
    {
        var mask = maskNew();
        var validationNeeded = 0;
        _Array_prototype_forEach.call
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
                            _Array_prototype_push.apply(allIncludes, includes);
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
                _Array_prototype_every.call
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
                                !isExcludingAttribute(attributeCache, attributeValue, engineFeatureObjs)
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

    (function (featureInfos)
    {
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

        function registerFeature(name, description, featureObj)
        {
            var descriptor = { enumerable: true, value: featureObj };
            _Object_defineProperty(Feature, name, descriptor);
            ALL[name] = featureObj;
            DESCRIPTION_MAP[name] = description;
        }

        var constructorSource =
        {
            ALL:            ALL,
            ELEMENTARY:     ELEMENTARY,
            areCompatible:  areCompatible,
            areEqual:       areEqual,
            commonOf:       commonOf,
            descriptionFor: descriptionFor,
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
    })
    (
        {
            ANY_DOCUMENT:
            {
                description:
                'Existence of the global object document whose string representation starts with ' +
                '"[object " and ends with "Document]".',
                check:
                function ()
                {
                    var available =
                    typeof document === 'object' && /^\[object .*Document]$/.test(document + '');
                    return available;
                },
                attributes: { 'web-worker': 'web-worker-restriction' },
            },
            ANY_WINDOW:
            {
                description:
                'Existence of the global object self whose string representation starts with ' +
                '"[object " and ends with "Window]".',
                check:
                checkSelfFeature.bind
                (
                    function (str)
                    {
                        var available = /^\[object .*Window]$/.test(str);
                        return available;
                    }
                ),
                includes: ['SELF_OBJ'],
                attributes: { 'web-worker': 'web-worker-restriction' },
            },
            ARRAY_ITERATOR:
            {
                description:
                'The property that the string representation of Array.prototype.entries() starts ' +
                'with "[object Array" and ends with "]" at index 21 or 22.',
                check:
                function ()
                {
                    var available =
                    Array.prototype.entries && /^\[object Array.{8,9}]$/.test([].entries());
                    return available;
                },
            },
            ARROW:
            {
                description: 'Support for arrow functions.',
                check:
                function ()
                {
                    try
                    {
                        Function('()=>{}')();
                        return true;
                    }
                    catch (error)
                    { }
                },
            },
            AT:
            {
                description: 'Existence of the native function Array.prototype.at.',
                check:
                function ()
                {
                    var available = Array.prototype.at;
                    return available;
                },
            },
            ATOB:
            {
                description: 'Existence of the global functions atob and btoa.',
                check:
                function ()
                {
                    var available = typeof atob === 'function' && typeof btoa === 'function';
                    return available;
                },
                attributes: { 'web-worker': 'no-atob-in-web-worker' },
            },
            BARPROP:
            {
                description:
                'Existence of the global object statusbar having the string representation "[object ' +
                'BarProp]".',
                check:
                function ()
                {
                    var available =
                    typeof statusbar === 'object' && statusbar + '' === '[object BarProp]';
                    return available;
                },
                attributes: { 'web-worker': 'web-worker-restriction' },
            },
            CAPITAL_HTML:
            {
                description:
                'The property that the various string methods returning HTML code such as ' +
                'String.prototype.big or String.prototype.link have both the tag name and attributes ' +
                'written in capital letters.',
                check:
                function ()
                {
                    var available =
                    ''.big()            === '<BIG></BIG>'               &&
                    ''.fontcolor('')    === '<FONT COLOR=""></FONT>'    &&
                    ''.fontsize('')     === '<FONT SIZE=""></FONT>'     &&
                    ''.link('')         === '<A HREF=""></A>'           &&
                    ''.small()          === '<SMALL></SMALL>'           &&
                    ''.strike()         === '<STRIKE></STRIKE>'         &&
                    ''.sub()            === '<SUB></SUB>'               &&
                    ''.sup()            === '<SUP></SUP>';
                    return available;
                },
            },
            CONSOLE:
            {
                description:
                'Existence of the global object console having the string representation "[object ' +
                'Console]".\n' +
                'This feature may become unavailable when certain browser extensions are active.',
                check:
                function ()
                {
                    var available = typeof console === 'object' && console + '' === '[object Console]';
                    return available;
                },
                attributes: { 'web-worker': 'no-console-in-web-worker' },
            },
            DOCUMENT:
            {
                description:
                'Existence of the global object document having the string representation "[object ' +
                'Document]".',
                check:
                function ()
                {
                    var available =
                    typeof document === 'object' && document + '' === '[object Document]';
                    return available;
                },
                includes: ['ANY_DOCUMENT'],
                excludes: ['HTMLDOCUMENT'],
                attributes: { 'web-worker': 'web-worker-restriction' },
            },
            DOMWINDOW:
            {
                description:
                'Existence of the global object self having the string representation "[object ' +
                'DOMWindow]".',
                check:
                checkSelfFeature.bind
                (
                    function (str)
                    {
                        var available = str === '[object DOMWindow]';
                        return available;
                    }
                ),
                includes: ['ANY_WINDOW'],
                excludes: ['WINDOW'],
                attributes: { 'web-worker': 'web-worker-restriction' },
            },
            ESC_HTML_ALL:
            {
                description:
                'The property that double quotation mark, less than and greater than characters in ' +
                'the argument of String.prototype.fontcolor are escaped into their respective HTML ' +
                'entities.',
                check:
                function ()
                {
                    var available = ~''.fontcolor('"<>').indexOf('&quot;&lt;&gt;');
                    return available;
                },
                includes: ['ESC_HTML_QUOT'],
                excludes: ['ESC_HTML_QUOT_ONLY'],
            },
            ESC_HTML_QUOT:
            {
                description:
                'The property that double quotation marks in the argument of ' +
                'String.prototype.fontcolor are escaped as "&quot;".',
                check:
                function ()
                {
                    var available = ~''.fontcolor('"').indexOf('&quot;');
                    return available;
                },
            },
            ESC_HTML_QUOT_ONLY:
            {
                description:
                'The property that only double quotation marks and no other characters in the ' +
                'argument of String.prototype.fontcolor are escaped into HTML entities.',
                check:
                function ()
                {
                    var available = ~''.fontcolor('"<>').indexOf('&quot;<>');
                    return available;
                },
                includes: ['ESC_HTML_QUOT'],
                excludes: ['ESC_HTML_ALL'],
            },
            ESC_REGEXP_LF:
            {
                description:
                'Having regular expressions created with the RegExp constructor use escape sequences ' +
                'starting with a backslash to format line feed characters ("\\n") in their string ' +
                'representation.',
                check:
                function ()
                {
                    var available = (RegExp('\n') + '')[1] === '\\';
                    return available;
                },
            },
            ESC_REGEXP_SLASH:
            {
                description:
                'Having regular expressions created with the RegExp constructor use escape sequences ' +
                'starting with a backslash to format slashes ("/") in their string representation.',
                check:
                function ()
                {
                    var available = (RegExp('/') + '')[1] === '\\';
                    return available;
                },
            },
            EXTERNAL:
            {
                description:
                'Existence of the global object sidebar having the string representation "[object ' +
                'External]".',
                check:
                function ()
                {
                    var available = typeof sidebar === 'object' && sidebar + '' === '[object External]';
                    return available;
                },
                attributes: { 'web-worker': 'web-worker-restriction' },
            },
            FF_SRC:
            {
                description:
                'A string representation of native functions typical for Firefox and Safari.\n' +
                'Remarkable traits are the lack of line feed characters at the beginning and at the ' +
                'end of the string and the presence of a line feed followed by four whitespaces ' +
                '("\\n    ") before the "[native code]" sequence.',
                includes: ['NO_IE_SRC', 'NO_V8_SRC'],
                excludes: ['NO_FF_SRC'],
            },
            FILL:
            {
                description: 'Existence of the native function Array.prototype.fill.',
                check:
                function ()
                {
                    var available = Array.prototype.fill;
                    return available;
                },
            },
            FLAT:
            {
                description: 'Existence of the native function Array.prototype.flat.',
                check:
                function ()
                {
                    var available = Array.prototype.flat;
                    return available;
                },
            },
            FROM_CODE_POINT:
            {
                description: 'Existence of the function String.fromCodePoint.',
                check:
                function ()
                {
                    var available = String.fromCodePoint;
                    return available;
                },
            },
            FUNCTION_19_LF:
            {
                description:
                'A string representation of dynamically generated functions where the character at ' +
                'index 19 is a line feed ("\\n").',
                check:
                function ()
                {
                    var available = (Function() + '')[19] === '\n';
                    return available;
                },
            },
            FUNCTION_22_LF:
            {
                description:
                'A string representation of dynamically generated functions where the character at ' +
                'index 22 is a line feed ("\\n").',
                check:
                function ()
                {
                    var available = (Function() + '')[22] === '\n';
                    return available;
                },
            },
            GENERIC_ARRAY_TO_STRING:
            {
                description: 'Ability to call Array.prototype.toString with a non-array binding.',
                check:
                function ()
                {
                    try
                    {
                        Array.prototype.toString.call({ });
                        return true;
                    }
                    catch (error)
                    { }
                },
            },
            GLOBAL_UNDEFINED:
            {
                description:
                'Having the global function toString return the string "[object Undefined]" when ' +
                'invoked without a binding.',
                check:
                function ()
                {
                    var getToString = Function('return toString');
                    var available = getToString()() === '[object Undefined]';
                    return available;
                },
                includes: ['OBJECT_UNDEFINED'],
            },
            GMT:
            {
                description:
                'Presence of the text "GMT" after the first 25 characters in the string returned by ' +
                'Date().\n' +
                'The string representation of dates is implementation dependent, but most engines ' +
                'use a similar format, making this feature available in all supported engines except ' +
                'Internet Explorer 9 and 10.',
                check:
                function ()
                {
                    var available = /^.{25}GMT/.test(Date());
                    return available;
                },
            },
            HISTORY:
            {
                description:
                'Existence of the global object history having the string representation "[object ' +
                'History]".',
                check:
                function ()
                {
                    var available = typeof history === 'object' && history + '' === '[object History]';
                    return available;
                },
                attributes: { 'web-worker': 'web-worker-restriction' },
            },
            HTMLAUDIOELEMENT:
            {
                description:
                'Existence of the global object Audio whose string representation starts with ' +
                '"function HTMLAudioElement".',
                check:
                function ()
                {
                    var available =
                    typeof Audio !== 'undefined' && /^function HTMLAudioElement/.test(Audio);
                    return available;
                },
                includes: ['NO_IE_SRC'],
                attributes: { 'web-worker': 'web-worker-restriction' },
            },
            HTMLDOCUMENT:
            {
                description:
                'Existence of the global object document having the string representation "[object ' +
                'HTMLDocument]".',
                check:
                function ()
                {
                    var available =
                    typeof document === 'object' && document + '' === '[object HTMLDocument]';
                    return available;
                },
                includes: ['ANY_DOCUMENT'],
                excludes: ['DOCUMENT'],
                attributes: { 'web-worker': 'web-worker-restriction' },
            },
            IE_SRC:
            {
                description:
                'A string representation of native functions typical for Internet Explorer.\n' +
                'Remarkable traits are the presence of a line feed character ("\\n") at the ' +
                'beginning and at the end of the string and a line feed followed by four whitespaces ' +
                '("\\n    ") before the "[native code]" sequence.',
                includes: ['NO_FF_SRC', 'NO_V8_SRC'],
                excludes: ['NO_IE_SRC'],
            },
            INCR_CHAR:
            {
                description:
                'The ability to use unary increment operators with string characters, like in ( ' +
                '++"some string"[0] ): this will result in a TypeError in strict mode in ECMAScript ' +
                'compliant engines.',
                check:
                function ()
                {
                    return true;
                },
                attributes: { 'forced-strict-mode': 'char-increment-restriction' },
            },
            INTL:
            {
                description: 'Existence of the global object Intl.',
                check:
                function ()
                {
                    var available = typeof Intl === 'object';
                    return available;
                },
            },
            LOCALE_INFINITY:
            {
                description: 'Language sensitive string representation of Infinity as "∞".',
                check:
                function ()
                {
                    var available = Infinity.toLocaleString() === '∞';
                    return available;
                },
            },
            LOCALE_NUMERALS:
            {
                description:
                'Features shared by all engines capable of localized number formatting, including ' +
                'output of Arabic digits, the Arabic decimal separator "٫", the letters in the first ' +
                'word of the Arabic string representation of NaN ("ليس"), Persian digits and the ' +
                'Persian digit group separator "٬".',
                check:
                function ()
                {
                    var available =
                    Number.prototype.toLocaleString &&
                    checkLocaleNumeral('ar', NaN, /^ليس/) &&
                    checkLocaleNumeral('ar-td', 234567890.1, /^٢٣٤٬?٥٦٧٬?٨٩٠٫١/) &&
                    checkLocaleNumeral('fa', 1234567890, /^۱٬۲۳۴٬۵۶۷٬۸۹۰/);
                    return available;
                },
            },
            LOCALE_NUMERALS_EXT:
            {
                description:
                'Extended localized number formatting.\n' +
                'This includes all features of LOCALE_NUMERALS plus the output of the first three ' +
                'letters in the second word of the Arabic string representation of NaN ("رقم"), ' +
                'Bengali digits, the letters in the Russian string representation of NaN ("не\xa0' +
                'число") and the letters in the Persian string representation of NaN ("ناعدد").',
                check:
                function ()
                {
                    var available =
                    Number.prototype.toLocaleString &&
                    checkLocaleNumeral('ar', NaN, /^ليس.رقم/) &&
                    checkLocaleNumeral('ar-td', 234567890.1, /^٢٣٤٬?٥٦٧٬?٨٩٠٫١/) &&
                    checkLocaleNumeral('bn', 1234567890, /^১,২৩,৪৫,৬৭,৮৯০/) &&
                    checkLocaleNumeral('fa', 1234567890, /^۱٬۲۳۴٬۵۶۷٬۸۹۰/) &&
                    checkLocaleNumeral('fa', NaN, /^ناعد/) &&
                    checkLocaleNumeral('ru', NaN, /^не.число/);
                    return available;
                },
                includes: ['LOCALE_NUMERALS'],
            },
            LOCATION:
            {
                description:
                'Existence of the global object location with the property that ' +
                'Object.prototype.toString.call(location) evaluates to a string that starts with ' +
                '"[object " and ends with "Location]".',
                check:
                function ()
                {
                    var available =
                    typeof location === 'object' &&
                    /^\[object .*Location]$/.test(Object.prototype.toString.call(location));
                    return available;
                },
            },
            NAME:
            {
                description: 'Existence of the name property for functions.',
                check:
                function ()
                {
                    var available = 'name' in Function();
                    return available;
                },
            },
            NODECONSTRUCTOR:
            {
                description:
                'Existence of the global object Node having the string representation "[object ' +
                'NodeConstructor]".',
                check:
                function ()
                {
                    var available =
                    typeof Node !== 'undefined' && Node + '' === '[object NodeConstructor]';
                    return available;
                },
                attributes: { 'web-worker': 'web-worker-restriction' },
            },
            NO_FF_SRC:
            {
                description:
                'A string representation of native functions typical for V8 or for Internet Explorer ' +
                'but not for Firefox and Safari.',
                check:
                function ()
                {
                    var available = /^(\n?)function Object\(\) \{\1 +\[native code]\s\}/.test(Object);
                    return available;
                },
                excludes: ['FF_SRC'],
            },
            NO_IE_SRC:
            {
                description:
                'A string representation of native functions typical for most engines with the ' +
                'notable exception of Internet Explorer.\n' +
                'A remarkable trait of this feature is the lack of line feed characters at the ' +
                'beginning and at the end of the string.',
                check:
                function ()
                {
                    var available = /^function Object\(\) \{(\n   )? \[native code]\s\}/.test(Object);
                    return available;
                },
                excludes: ['IE_SRC'],
            },
            NO_OLD_SAFARI_ARRAY_ITERATOR:
            {
                description:
                'The property that the string representation of Array.prototype.entries() evaluates ' +
                'to "[object Array Iterator]" and that Array.prototype.entries().constructor is the ' +
                'global function Object.',
                check:
                function ()
                {
                    if (Array.prototype.entries)
                    {
                        var arrayIterator = [].entries();
                        var available =
                        arrayIterator + '' === '[object Array Iterator]' &&
                        arrayIterator.constructor === Object;
                        return available;
                    }
                },
                includes: ['ARRAY_ITERATOR'],
            },
            NO_V8_SRC:
            {
                description:
                'A string representation of native functions typical for Firefox, Internet Explorer ' +
                'and Safari.\n' +
                'A most remarkable trait of this feature is the presence of a line feed followed by ' +
                'four whitespaces ("\\n    ") before the "[native code]" sequence.',
                check:
                function ()
                {
                    var available = /^\n?function Object\(\) \{\n    \[native code]\s\}/.test(Object);
                    return available;
                },
                excludes: ['V8_SRC'],
            },
            OBJECT_UNDEFINED:
            {
                description:
                'Having the function Object.prototype.toString return the string "[object ' +
                'Undefined]" when invoked without a binding.',
                check:
                function ()
                {
                    var toString = Object.prototype.toString;
                    var available = toString() === '[object Undefined]';
                    return available;
                },
                includes: ['UNDEFINED'],
            },
            PLAIN_INTL:
            {
                description:
                'Existence of the global object Intl having the string representation "[object ' +
                'Object]"',
                check:
                function ()
                {
                    var available = typeof Intl === 'object' && Intl + '' === '[object Object]';
                    return available;
                },
                includes: ['INTL'],
            },
            REGEXP_STRING_ITERATOR:
            {
                description:
                'The property that the string representation of String.prototype.matchAll() ' +
                'evaluates to "[object RegExp String Iterator]".',
                check:
                function ()
                {
                    var available =
                    String.prototype.matchAll &&
                    ''.matchAll() + '' === '[object RegExp String Iterator]';
                    return available;
                },
            },
            SELF: { aliasFor: 'ANY_WINDOW' },
            SELF_OBJ:
            {
                description:
                'Existence of the global object self whose string representation starts with ' +
                '"[object ".',
                check:
                checkSelfFeature.bind
                (
                    function (str)
                    {
                        var available = /^\[object /.test(str);
                        return available;
                    }
                ),
                attributes: { 'web-worker': 'safari-bug-21820506' },
            },
            SHORT_LOCALES:
            {
                description:
                'Support for the two-letter locale name "ar" to format decimal numbers as Arabic ' +
                'numerals.',
                check:
                function ()
                {
                    var NUMBER = 9876430.125;

                    var localizedNumeral = NUMBER.toLocaleString('ar');
                    var available =
                    localizedNumeral === NUMBER.toLocaleString('ar-td') &&
                    localizedNumeral !== NUMBER.toLocaleString('en');
                    return available;
                },
                includes: ['LOCALE_NUMERALS'],
            },
            STATUS:
            {
                description: 'Existence of the global string status.',
                check:
                function ()
                {
                    var available = typeof status === 'string';
                    return available;
                },
                attributes: { 'web-worker': 'web-worker-restriction' },
            },
            UNDEFINED:
            {
                description:
                'The property that Object.prototype.toString.call() evaluates to "[object ' +
                'Undefined]".\n' +
                'This behavior is specified by ECMAScript, and is enforced by all engines except ' +
                'Android Browser versions prior to 4.1.2, where this feature is not available.',
                check:
                function ()
                {
                    var available = Object.prototype.toString.call() === '[object Undefined]';
                    return available;
                },
            },
            V8_SRC:
            {
                description:
                'A string representation of native functions typical for the V8 engine.\n' +
                'Remarkable traits are the lack of line feed characters at the beginning and at the ' +
                'end of the string and the presence of a single whitespace before the "[native ' +
                'code]" sequence.',
                includes: ['NO_FF_SRC', 'NO_IE_SRC'],
                excludes: ['NO_V8_SRC'],
            },
            WINDOW:
            {
                description:
                'Existence of the global object self having the string representation "[object ' +
                'Window]".',
                check:
                checkSelfFeature.bind
                (
                    function (str)
                    {
                        var available = str === '[object Window]';
                        return available;
                    }
                ),
                includes: ['ANY_WINDOW'],
                excludes: ['DOMWINDOW'],
                attributes: { 'web-worker': 'web-worker-restriction' },
            },

            DEFAULT:
            {
                description:
                'Minimum feature level, compatible with all supported engines in all environments.',
            },
            BROWSER:
            {
                description:
                'Features available in all browsers.\n' +
                'No support for Node.js.',
                includes: ['ANY_DOCUMENT', 'ANY_WINDOW', 'HISTORY', 'INCR_CHAR', 'STATUS'],
                attributes:
                {
                    'char-increment-restriction':   null,
                    'safari-bug-21820506':          null,
                    'web-worker-restriction':       null,
                },
            },
            COMPACT:
            {
                description:
                'All new browsers\' features.\n' +
                'No support for Node.js and older browsers like Internet Explorer, Safari 9 or ' +
                'Android Browser.',
                includes:
                [
                    'ARROW',
                    'ATOB',
                    'BARPROP',
                    'ESC_HTML_QUOT_ONLY',
                    'ESC_REGEXP_LF',
                    'ESC_REGEXP_SLASH',
                    'FILL',
                    'FLAT',
                    'FROM_CODE_POINT',
                    'GENERIC_ARRAY_TO_STRING',
                    'GLOBAL_UNDEFINED',
                    'GMT',
                    'HISTORY',
                    'HTMLDOCUMENT',
                    'INCR_CHAR',
                    'INTL',
                    'LOCALE_INFINITY',
                    'LOCALE_NUMERALS_EXT',
                    'LOCATION',
                    'NAME',
                    'NO_IE_SRC',
                    'NO_OLD_SAFARI_ARRAY_ITERATOR',
                    'REGEXP_STRING_ITERATOR',
                    'STATUS',
                    'WINDOW',
                ],
                attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
            },
            ANDRO_4_0:
            {
                engine: 'Android Browser 4.0',
                includes:
                [
                    'ATOB',
                    'CONSOLE',
                    'DOMWINDOW',
                    'ESC_HTML_ALL',
                    'FUNCTION_22_LF',
                    'GMT',
                    'HISTORY',
                    'HTMLDOCUMENT',
                    'INCR_CHAR',
                    'LOCATION',
                    'NAME',
                    'STATUS',
                    'V8_SRC',
                ],
            },
            ANDRO_4_1:
            {
                engine: 'Android Browser 4.1 to 4.3',
                includes:
                [
                    'ATOB',
                    'CONSOLE',
                    'DOMWINDOW',
                    'ESC_HTML_ALL',
                    'FUNCTION_22_LF',
                    'GENERIC_ARRAY_TO_STRING',
                    'GMT',
                    'HISTORY',
                    'HTMLDOCUMENT',
                    'INCR_CHAR',
                    'LOCATION',
                    'NAME',
                    'OBJECT_UNDEFINED',
                    'STATUS',
                    'V8_SRC',
                ],
            },
            ANDRO_4_4:
            {
                engine: 'Android Browser 4.4',
                includes:
                [
                    'ATOB',
                    'BARPROP',
                    'CONSOLE',
                    'ESC_HTML_ALL',
                    'FUNCTION_22_LF',
                    'GENERIC_ARRAY_TO_STRING',
                    'GMT',
                    'HISTORY',
                    'HTMLAUDIOELEMENT',
                    'HTMLDOCUMENT',
                    'INCR_CHAR',
                    'LOCALE_INFINITY',
                    'LOCALE_NUMERALS_EXT',
                    'LOCATION',
                    'NAME',
                    'OBJECT_UNDEFINED',
                    'PLAIN_INTL',
                    'SHORT_LOCALES',
                    'STATUS',
                    'V8_SRC',
                    'WINDOW',
                ],
                attributes: { 'no-console-in-web-worker': null, 'web-worker-restriction': null },
            },
            CHROME_PREV:
            {
                engine: 'the previous to current versions of Chrome and Edge',
                aliasFor: 'CHROME_86',
            },
            CHROME:
            {
                engine: 'the current stable versions of Chrome, Edge and Opera',
                aliasFor: 'CHROME_86',
            },
            CHROME_86:
            {
                engine: 'Chrome 86, Edge 86 and Opera 72 or later',
                includes:
                [
                    'ARROW',
                    'ATOB',
                    'BARPROP',
                    'ESC_HTML_QUOT_ONLY',
                    'ESC_REGEXP_LF',
                    'ESC_REGEXP_SLASH',
                    'FILL',
                    'FLAT',
                    'FROM_CODE_POINT',
                    'FUNCTION_19_LF',
                    'GENERIC_ARRAY_TO_STRING',
                    'GLOBAL_UNDEFINED',
                    'GMT',
                    'HISTORY',
                    'HTMLDOCUMENT',
                    'INCR_CHAR',
                    'INTL',
                    'LOCALE_INFINITY',
                    'LOCALE_NUMERALS_EXT',
                    'LOCATION',
                    'NAME',
                    'NO_OLD_SAFARI_ARRAY_ITERATOR',
                    'REGEXP_STRING_ITERATOR',
                    'STATUS',
                    'V8_SRC',
                    'WINDOW',
                ],
                attributes:
                {
                    'char-increment-restriction':   null,
                    'unstable':                     null,
                    'web-worker-restriction':       null,
                },
            },
            FF_ESR:
            {
                engine: 'the current version of Firefox ESR',
                aliasFor: 'FF_78',
            },
            FF_PREV:
            {
                engine: 'the previous to current version of Firefox',
                aliasFor: 'FF_78',
            },
            FF_78:
            {
                engine: 'Firefox 78 to 82',
                includes:
                [
                    'ARROW',
                    'ATOB',
                    'BARPROP',
                    'ESC_HTML_QUOT_ONLY',
                    'ESC_REGEXP_LF',
                    'ESC_REGEXP_SLASH',
                    'EXTERNAL',
                    'FF_SRC',
                    'FILL',
                    'FLAT',
                    'FROM_CODE_POINT',
                    'FUNCTION_19_LF',
                    'GENERIC_ARRAY_TO_STRING',
                    'GLOBAL_UNDEFINED',
                    'GMT',
                    'HISTORY',
                    'HTMLDOCUMENT',
                    'INCR_CHAR',
                    'LOCALE_INFINITY',
                    'LOCALE_NUMERALS_EXT',
                    'LOCATION',
                    'NAME',
                    'NO_OLD_SAFARI_ARRAY_ITERATOR',
                    'PLAIN_INTL',
                    'REGEXP_STRING_ITERATOR',
                    'SHORT_LOCALES',
                    'STATUS',
                    'WINDOW',
                ],
                attributes:
                {
                    'char-increment-restriction':   null,
                    'unstable':                     null,
                    'web-worker-restriction':       null,
                },
            },
            FF:
            {
                engine: 'the current stable version of Firefox',
                aliasFor: 'FF_83',
            },
            FF_83:
            {
                engine: 'Firefox 83 or later',
                includes:
                [
                    'ARROW',
                    'ATOB',
                    'BARPROP',
                    'ESC_HTML_QUOT_ONLY',
                    'ESC_REGEXP_LF',
                    'ESC_REGEXP_SLASH',
                    'EXTERNAL',
                    'FF_SRC',
                    'FILL',
                    'FLAT',
                    'FROM_CODE_POINT',
                    'FUNCTION_19_LF',
                    'GENERIC_ARRAY_TO_STRING',
                    'GLOBAL_UNDEFINED',
                    'GMT',
                    'HISTORY',
                    'HTMLDOCUMENT',
                    'INCR_CHAR',
                    'INTL',
                    'LOCALE_INFINITY',
                    'LOCALE_NUMERALS_EXT',
                    'LOCATION',
                    'NAME',
                    'NO_OLD_SAFARI_ARRAY_ITERATOR',
                    'REGEXP_STRING_ITERATOR',
                    'SHORT_LOCALES',
                    'STATUS',
                    'WINDOW',
                ],
                attributes:
                {
                    'char-increment-restriction':   null,
                    'unstable':                     null,
                    'web-worker-restriction':       null,
                },
            },
            IE_9:
            {
                engine: 'Internet Explorer 9',
                includes:
                [
                    'CAPITAL_HTML',
                    'DOCUMENT',
                    'ESC_REGEXP_LF',
                    'ESC_REGEXP_SLASH',
                    'FUNCTION_22_LF',
                    'GENERIC_ARRAY_TO_STRING',
                    'HISTORY',
                    'IE_SRC',
                    'INCR_CHAR',
                    'STATUS',
                    'UNDEFINED',
                    'WINDOW',
                ],
            },
            IE_10:
            {
                engine: 'Internet Explorer 10',
                includes:
                [
                    'ATOB',
                    'CAPITAL_HTML',
                    'CONSOLE',
                    'DOCUMENT',
                    'ESC_REGEXP_LF',
                    'ESC_REGEXP_SLASH',
                    'FUNCTION_22_LF',
                    'GENERIC_ARRAY_TO_STRING',
                    'HISTORY',
                    'IE_SRC',
                    'INCR_CHAR',
                    'OBJECT_UNDEFINED',
                    'STATUS',
                    'WINDOW',
                ],
                attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
            },
            IE_11:
            {
                engine: 'Internet Explorer 11',
                includes:
                [
                    'ATOB',
                    'CAPITAL_HTML',
                    'CONSOLE',
                    'ESC_REGEXP_LF',
                    'ESC_REGEXP_SLASH',
                    'FUNCTION_22_LF',
                    'GENERIC_ARRAY_TO_STRING',
                    'GMT',
                    'HISTORY',
                    'HTMLDOCUMENT',
                    'IE_SRC',
                    'INCR_CHAR',
                    'LOCALE_NUMERALS',
                    'OBJECT_UNDEFINED',
                    'PLAIN_INTL',
                    'SHORT_LOCALES',
                    'STATUS',
                    'WINDOW',
                ],
                attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
            },
            IE_11_WIN_10:
            {
                engine: 'Internet Explorer 11 on Windows 10',
                includes:
                [
                    'ATOB',
                    'CAPITAL_HTML',
                    'CONSOLE',
                    'ESC_REGEXP_LF',
                    'ESC_REGEXP_SLASH',
                    'FUNCTION_22_LF',
                    'GENERIC_ARRAY_TO_STRING',
                    'GMT',
                    'HISTORY',
                    'HTMLDOCUMENT',
                    'IE_SRC',
                    'INCR_CHAR',
                    'LOCALE_INFINITY',
                    'LOCALE_NUMERALS_EXT',
                    'OBJECT_UNDEFINED',
                    'PLAIN_INTL',
                    'SHORT_LOCALES',
                    'STATUS',
                    'WINDOW',
                ],
                attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
            },
            NODE_0_10:
            {
                engine: 'Node.js 0.10',
                includes:
                [
                    'ESC_HTML_ALL',
                    'FUNCTION_22_LF',
                    'GENERIC_ARRAY_TO_STRING',
                    'GLOBAL_UNDEFINED',
                    'GMT',
                    'INCR_CHAR',
                    'NAME',
                    'V8_SRC',
                ],
            },
            NODE_0_12:
            {
                engine: 'Node.js 0.12',
                includes:
                [
                    'ESC_HTML_QUOT_ONLY',
                    'FUNCTION_22_LF',
                    'GENERIC_ARRAY_TO_STRING',
                    'GLOBAL_UNDEFINED',
                    'GMT',
                    'INCR_CHAR',
                    'LOCALE_INFINITY',
                    'NAME',
                    'NO_OLD_SAFARI_ARRAY_ITERATOR',
                    'PLAIN_INTL',
                    'V8_SRC',
                ],
            },
            NODE_4:
            {
                engine: 'Node.js 4',
                includes:
                [
                    'ARROW',
                    'ESC_HTML_QUOT_ONLY',
                    'ESC_REGEXP_SLASH',
                    'FILL',
                    'FROM_CODE_POINT',
                    'FUNCTION_22_LF',
                    'GENERIC_ARRAY_TO_STRING',
                    'GLOBAL_UNDEFINED',
                    'GMT',
                    'INCR_CHAR',
                    'LOCALE_INFINITY',
                    'NAME',
                    'NO_OLD_SAFARI_ARRAY_ITERATOR',
                    'PLAIN_INTL',
                    'V8_SRC',
                ],
            },
            NODE_5:
            {
                engine: 'Node.js 5 to 9',
                includes:
                [
                    'ARROW',
                    'ESC_HTML_QUOT_ONLY',
                    'ESC_REGEXP_SLASH',
                    'FILL',
                    'FROM_CODE_POINT',
                    'FUNCTION_22_LF',
                    'GENERIC_ARRAY_TO_STRING',
                    'GLOBAL_UNDEFINED',
                    'GMT',
                    'INCR_CHAR',
                    'LOCALE_INFINITY',
                    'NAME',
                    'NO_OLD_SAFARI_ARRAY_ITERATOR',
                    'PLAIN_INTL',
                    'V8_SRC',
                ],
                attributes: { 'char-increment-restriction': null },
            },
            NODE_10:
            {
                engine: 'Node.js 10',
                includes:
                [
                    'ARROW',
                    'ESC_HTML_QUOT_ONLY',
                    'ESC_REGEXP_SLASH',
                    'FILL',
                    'FROM_CODE_POINT',
                    'FUNCTION_19_LF',
                    'GENERIC_ARRAY_TO_STRING',
                    'GLOBAL_UNDEFINED',
                    'GMT',
                    'INCR_CHAR',
                    'LOCALE_INFINITY',
                    'NAME',
                    'NO_OLD_SAFARI_ARRAY_ITERATOR',
                    'PLAIN_INTL',
                    'V8_SRC',
                ],
                attributes: { 'char-increment-restriction': null },
            },
            NODE_11:
            {
                engine: 'Node.js 11',
                includes:
                [
                    'ARROW',
                    'ESC_HTML_QUOT_ONLY',
                    'ESC_REGEXP_SLASH',
                    'FILL',
                    'FLAT',
                    'FROM_CODE_POINT',
                    'FUNCTION_19_LF',
                    'GENERIC_ARRAY_TO_STRING',
                    'GLOBAL_UNDEFINED',
                    'GMT',
                    'INCR_CHAR',
                    'LOCALE_INFINITY',
                    'NAME',
                    'NO_OLD_SAFARI_ARRAY_ITERATOR',
                    'PLAIN_INTL',
                    'V8_SRC',
                ],
                attributes: { 'char-increment-restriction': null },
            },
            NODE_12:
            {
                engine: 'Node.js 12',
                includes:
                [
                    'ARROW',
                    'ESC_HTML_QUOT_ONLY',
                    'ESC_REGEXP_LF',
                    'ESC_REGEXP_SLASH',
                    'FILL',
                    'FLAT',
                    'FROM_CODE_POINT',
                    'FUNCTION_19_LF',
                    'GENERIC_ARRAY_TO_STRING',
                    'GLOBAL_UNDEFINED',
                    'GMT',
                    'INCR_CHAR',
                    'LOCALE_INFINITY',
                    'NAME',
                    'NO_OLD_SAFARI_ARRAY_ITERATOR',
                    'PLAIN_INTL',
                    'REGEXP_STRING_ITERATOR',
                    'V8_SRC',
                ],
                attributes: { 'char-increment-restriction': null },
            },
            NODE_13:
            {
                engine: 'Node.js 13 and Node.js 14',
                includes:
                [
                    'ARROW',
                    'ESC_HTML_QUOT_ONLY',
                    'ESC_REGEXP_LF',
                    'ESC_REGEXP_SLASH',
                    'FILL',
                    'FLAT',
                    'FROM_CODE_POINT',
                    'FUNCTION_19_LF',
                    'GENERIC_ARRAY_TO_STRING',
                    'GLOBAL_UNDEFINED',
                    'GMT',
                    'INCR_CHAR',
                    'LOCALE_INFINITY',
                    'LOCALE_NUMERALS_EXT',
                    'NAME',
                    'NO_OLD_SAFARI_ARRAY_ITERATOR',
                    'PLAIN_INTL',
                    'REGEXP_STRING_ITERATOR',
                    'SHORT_LOCALES',
                    'V8_SRC',
                ],
                attributes: { 'char-increment-restriction': null },
            },
            NODE_15:
            {
                engine: 'Node.js 15',
                includes:
                [
                    'ARROW',
                    'ESC_HTML_QUOT_ONLY',
                    'ESC_REGEXP_LF',
                    'ESC_REGEXP_SLASH',
                    'FILL',
                    'FLAT',
                    'FROM_CODE_POINT',
                    'FUNCTION_19_LF',
                    'GENERIC_ARRAY_TO_STRING',
                    'GLOBAL_UNDEFINED',
                    'GMT',
                    'INCR_CHAR',
                    'INTL',
                    'LOCALE_INFINITY',
                    'LOCALE_NUMERALS_EXT',
                    'NAME',
                    'NO_OLD_SAFARI_ARRAY_ITERATOR',
                    'REGEXP_STRING_ITERATOR',
                    'SHORT_LOCALES',
                    'V8_SRC',
                ],
                attributes: { 'char-increment-restriction': null },
            },
            NODE_16:
            {
                engine: 'Node.js 16 or later',
                includes:
                [
                    'ARROW',
                    'ATOB',
                    'ESC_HTML_QUOT_ONLY',
                    'ESC_REGEXP_LF',
                    'ESC_REGEXP_SLASH',
                    'FILL',
                    'FLAT',
                    'FROM_CODE_POINT',
                    'FUNCTION_19_LF',
                    'GENERIC_ARRAY_TO_STRING',
                    'GLOBAL_UNDEFINED',
                    'GMT',
                    'INCR_CHAR',
                    'INTL',
                    'LOCALE_INFINITY',
                    'LOCALE_NUMERALS_EXT',
                    'NAME',
                    'NO_OLD_SAFARI_ARRAY_ITERATOR',
                    'REGEXP_STRING_ITERATOR',
                    'SHORT_LOCALES',
                    'V8_SRC',
                ],
                attributes: { 'char-increment-restriction': null },
            },
            SAFARI_7_0:
            {
                engine: 'Safari 7.0',
                includes:
                [
                    'ATOB',
                    'BARPROP',
                    'CONSOLE',
                    'ESC_HTML_QUOT_ONLY',
                    'ESC_REGEXP_LF',
                    'ESC_REGEXP_SLASH',
                    'FF_SRC',
                    'GENERIC_ARRAY_TO_STRING',
                    'GLOBAL_UNDEFINED',
                    'GMT',
                    'HISTORY',
                    'HTMLDOCUMENT',
                    'INCR_CHAR',
                    'LOCATION',
                    'NAME',
                    'NODECONSTRUCTOR',
                    'STATUS',
                    'WINDOW',
                ],
                attributes:
                {
                    'char-increment-restriction':   null,
                    'no-atob-in-web-worker':        null,
                    'no-console-in-web-worker':     null,
                    'web-worker-restriction':       null,
                },
            },
            SAFARI_7_1:
            {
                engine: 'Safari 7.1 and Safari 8',
                includes:
                [
                    'ARRAY_ITERATOR',
                    'ATOB',
                    'BARPROP',
                    'CONSOLE',
                    'ESC_HTML_QUOT_ONLY',
                    'ESC_REGEXP_LF',
                    'ESC_REGEXP_SLASH',
                    'FF_SRC',
                    'FILL',
                    'GENERIC_ARRAY_TO_STRING',
                    'GLOBAL_UNDEFINED',
                    'GMT',
                    'HISTORY',
                    'HTMLDOCUMENT',
                    'INCR_CHAR',
                    'LOCATION',
                    'NAME',
                    'NODECONSTRUCTOR',
                    'STATUS',
                    'WINDOW',
                ],
                attributes:
                {
                    'char-increment-restriction':   null,
                    'no-atob-in-web-worker':        null,
                    'safari-bug-21820506':          null,
                    'web-worker-restriction':       null,
                },
            },
            SAFARI_8: { aliasFor: 'SAFARI_7_1' },
            SAFARI_9:
            {
                engine: 'Safari 9',
                includes:
                [
                    'ATOB',
                    'BARPROP',
                    'CONSOLE',
                    'ESC_HTML_QUOT_ONLY',
                    'ESC_REGEXP_LF',
                    'ESC_REGEXP_SLASH',
                    'FF_SRC',
                    'FILL',
                    'FROM_CODE_POINT',
                    'FUNCTION_22_LF',
                    'GENERIC_ARRAY_TO_STRING',
                    'GLOBAL_UNDEFINED',
                    'GMT',
                    'HISTORY',
                    'HTMLDOCUMENT',
                    'INCR_CHAR',
                    'LOCATION',
                    'NAME',
                    'NODECONSTRUCTOR',
                    'NO_OLD_SAFARI_ARRAY_ITERATOR',
                    'STATUS',
                    'WINDOW',
                ],
                attributes:
                {
                    'char-increment-restriction':   null,
                    'no-atob-in-web-worker':        null,
                    'safari-bug-21820506':          null,
                    'web-worker-restriction':       null,
                },
            },
            SAFARI_10:
            {
                engine: 'Safari 10 and Safari 11',
                includes:
                [
                    'ARROW',
                    'ATOB',
                    'BARPROP',
                    'CONSOLE',
                    'ESC_HTML_QUOT_ONLY',
                    'ESC_REGEXP_LF',
                    'ESC_REGEXP_SLASH',
                    'FF_SRC',
                    'FILL',
                    'FROM_CODE_POINT',
                    'FUNCTION_22_LF',
                    'GENERIC_ARRAY_TO_STRING',
                    'GLOBAL_UNDEFINED',
                    'GMT',
                    'HISTORY',
                    'HTMLDOCUMENT',
                    'INCR_CHAR',
                    'LOCALE_INFINITY',
                    'LOCALE_NUMERALS_EXT',
                    'LOCATION',
                    'NAME',
                    'NO_OLD_SAFARI_ARRAY_ITERATOR',
                    'PLAIN_INTL',
                    'SHORT_LOCALES',
                    'STATUS',
                    'WINDOW',
                ],
                attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
            },
            SAFARI_12:
            {
                engine: 'Safari 12',
                includes:
                [
                    'ARROW',
                    'ATOB',
                    'BARPROP',
                    'CONSOLE',
                    'ESC_HTML_QUOT_ONLY',
                    'ESC_REGEXP_LF',
                    'ESC_REGEXP_SLASH',
                    'FF_SRC',
                    'FILL',
                    'FLAT',
                    'FROM_CODE_POINT',
                    'FUNCTION_22_LF',
                    'GENERIC_ARRAY_TO_STRING',
                    'GLOBAL_UNDEFINED',
                    'GMT',
                    'HISTORY',
                    'HTMLDOCUMENT',
                    'INCR_CHAR',
                    'LOCALE_INFINITY',
                    'LOCALE_NUMERALS_EXT',
                    'LOCATION',
                    'NAME',
                    'NO_OLD_SAFARI_ARRAY_ITERATOR',
                    'PLAIN_INTL',
                    'SHORT_LOCALES',
                    'STATUS',
                    'WINDOW',
                ],
                attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
            },
            SAFARI_13:
            {
                engine: 'Safari 13 and Safari 14.0.0',
                includes:
                [
                    'ARROW',
                    'ATOB',
                    'BARPROP',
                    'CONSOLE',
                    'ESC_HTML_QUOT_ONLY',
                    'ESC_REGEXP_LF',
                    'ESC_REGEXP_SLASH',
                    'FF_SRC',
                    'FILL',
                    'FLAT',
                    'FROM_CODE_POINT',
                    'FUNCTION_22_LF',
                    'GENERIC_ARRAY_TO_STRING',
                    'GLOBAL_UNDEFINED',
                    'GMT',
                    'HISTORY',
                    'HTMLDOCUMENT',
                    'INCR_CHAR',
                    'LOCALE_INFINITY',
                    'LOCALE_NUMERALS_EXT',
                    'LOCATION',
                    'NAME',
                    'NO_OLD_SAFARI_ARRAY_ITERATOR',
                    'PLAIN_INTL',
                    'REGEXP_STRING_ITERATOR',
                    'SHORT_LOCALES',
                    'STATUS',
                    'WINDOW',
                ],
                attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
            },
            SAFARI_14_0_1:
            {
                engine: 'Safari 14.0.1 to 14.0.3',
                includes:
                [
                    'ARROW',
                    'ATOB',
                    'BARPROP',
                    'CONSOLE',
                    'ESC_HTML_QUOT_ONLY',
                    'ESC_REGEXP_LF',
                    'ESC_REGEXP_SLASH',
                    'FF_SRC',
                    'FILL',
                    'FLAT',
                    'FROM_CODE_POINT',
                    'FUNCTION_22_LF',
                    'GENERIC_ARRAY_TO_STRING',
                    'GLOBAL_UNDEFINED',
                    'GMT',
                    'HISTORY',
                    'HTMLDOCUMENT',
                    'INCR_CHAR',
                    'INTL',
                    'LOCALE_INFINITY',
                    'LOCALE_NUMERALS_EXT',
                    'LOCATION',
                    'NAME',
                    'NO_OLD_SAFARI_ARRAY_ITERATOR',
                    'REGEXP_STRING_ITERATOR',
                    'SHORT_LOCALES',
                    'STATUS',
                    'WINDOW',
                ],
                attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
            },
            SAFARI:
            {
                engine: 'the current stable version of Safari',
                aliasFor: 'SAFARI_14_1',
            },
            SAFARI_14_1:
            {
                engine: 'Safari 14.1 or later',
                includes:
                [
                    'ARROW',
                    'ATOB',
                    'BARPROP',
                    'ESC_HTML_QUOT_ONLY',
                    'ESC_REGEXP_LF',
                    'ESC_REGEXP_SLASH',
                    'FF_SRC',
                    'FILL',
                    'FLAT',
                    'FROM_CODE_POINT',
                    'FUNCTION_22_LF',
                    'GENERIC_ARRAY_TO_STRING',
                    'GLOBAL_UNDEFINED',
                    'GMT',
                    'HISTORY',
                    'HTMLDOCUMENT',
                    'INCR_CHAR',
                    'INTL',
                    'LOCALE_INFINITY',
                    'LOCALE_NUMERALS_EXT',
                    'LOCATION',
                    'NAME',
                    'NO_OLD_SAFARI_ARRAY_ITERATOR',
                    'REGEXP_STRING_ITERATOR',
                    'SHORT_LOCALES',
                    'STATUS',
                    'WINDOW',
                ],
                attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
            },
        }
    );

    function callWithFeatures()
    {
        var args = arguments;
        var featureArgsIndex = args.length - 2;
        var featureArgs = args[featureArgsIndex];
        var featureStartIndex = args[featureArgsIndex + 1];
        var defineFnArgs = sliceArgs(args, 0, featureArgsIndex);
        var features = sliceArgs(featureArgs, featureStartIndex);
        _Array_prototype_push.apply(defineFnArgs, features);
        var entry = this.apply(null, defineFnArgs);
        return entry;
    }

    function createDefinitionEntry(definition, mask)
    {
        var entry = { definition: definition, mask: mask };
        return entry;
    }

    function define(definition)
    {
        var features = sliceArgs(arguments, 1);
        var mask = featuresToMask(features);
        var entry = createDefinitionEntry(definition, mask);
        return entry;
    }

    function defineList(availableEntries, indexEntries)
    {
        var effectiveEntries =
        indexEntries.map
        (
            function (indexEntry)
            {
                var availableEntry = availableEntries[indexEntry.definition];
                var definition = availableEntry.definition;
                var mask = maskUnion(indexEntry.mask, availableEntry.mask);
                var effectiveEntry = createDefinitionEntry(definition, mask);
                return effectiveEntry;
            }
        );
        effectiveEntries.available = availableEntries;
        return effectiveEntries;
    }

    function makeCallableWithFeatures(fn)
    {
        fn.$callWithFeatures = callWithFeatures;
    }

    function sliceArgs(args, startIndex, endIndex)
    {
        var array = _Array_prototype.slice.call(args, startIndex, endIndex);
        return array;
    }

    makeCallableWithFeatures(define);

    function extraZeros(count)
    {
        var extraZeros = _Array(count + 1).join('0');
        return extraZeros;
    }

    function initStaticEncoder(encoder)
    {
        staticEncoder = encoder;
    }

    function replaceStaticExpr(expr)
    {
        var solution = staticEncoder.replaceExpr(expr);
        return solution;
    }

    function replaceStaticString(str, options)
    {
        var replacement = staticEncoder.replaceString(str, options);
        return replacement;
    }

    function shortestOf(objs)
    {
        var shortestObj;
        var shortestLength = Infinity;
        objs.forEach
        (
            function (obj)
            {
                var length = obj.length;
                if (length < shortestLength)
                {
                    shortestObj = obj;
                    shortestLength = length;
                }
            }
        );
        return shortestObj;
    }

    var staticEncoder;

    // novem 2.0.1 – https://github.com/fasttime/JScrewIt/tree/master/packages/novem

    var INVALID_EXPR = {};
    function evalExpr$1(expr) {
        var value = tryEvalExpr(expr);
        if (value === INVALID_EXPR)
            throw SyntaxError("Invalid expression " + expr);
        return value;
    }
    function tryEvalExpr(expr) {
        var fn;
        try {
            fn = Function("return(" + expr + ");");
        }
        catch (_a) {
            return INVALID_EXPR;
        }
        var value = fn();
        return value;
    }

    var SolutionType;
    (function (SolutionType) {
        SolutionType[SolutionType["UNDEFINED"] = 1] = "UNDEFINED";
        SolutionType[SolutionType["ALGEBRAIC"] = 2] = "ALGEBRAIC";
        SolutionType[SolutionType["WEAK_ALGEBRAIC"] = 4] = "WEAK_ALGEBRAIC";
        SolutionType[SolutionType["OBJECT"] = 8] = "OBJECT";
        SolutionType[SolutionType["STRING"] = 16] = "STRING";
        SolutionType[SolutionType["PREFIXED_STRING"] = 32] = "PREFIXED_STRING";
        SolutionType[SolutionType["WEAK_PREFIXED_STRING"] = 64] = "WEAK_PREFIXED_STRING";
        SolutionType[SolutionType["COMBINED_STRING"] = 128] = "COMBINED_STRING";
    })(SolutionType || (SolutionType = {}));
    Object.freeze(SolutionType);
    var calculateSolutionType = function (replacement) {
        var value = evalExpr$1(replacement);
        if (value === undefined || value === null)
            return SolutionType.UNDEFINED;
        switch (typeof value) {
            case 'boolean':
                return SolutionType.ALGEBRAIC;
            case 'number':
                {
                    var type = isWeak$1(replacement, value) ? SolutionType.WEAK_ALGEBRAIC : SolutionType.ALGEBRAIC;
                    return type;
                }
            case 'object':
            case 'function':
                return SolutionType.OBJECT;
            case 'string':
                {
                    var type = isCombined(replacement, value) ?
                        isPrefixed(replacement, value) ?
                            isWeak$1(replacement, value) ?
                                SolutionType.WEAK_PREFIXED_STRING :
                                SolutionType.PREFIXED_STRING :
                            SolutionType.COMBINED_STRING :
                        SolutionType.STRING;
                    return type;
                }
        }
    };
    var isCombined = function (replacement, value) { return !value !== tryEvalExpr("!" + replacement); };
    var isPrefixed = function (replacement, value) { return "0" + value !== tryEvalExpr("0+" + replacement); };
    var isWeak$1 = function (replacement, value) { return "" + value !== tryEvalExpr("\"\"+" + replacement); };

    function createTypeSet() {
        var types = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            types[_i] = arguments[_i];
        }
        var typeSet = 0;
        for (var _a = 0, types_1 = types; _a < types_1.length; _a++) {
            var type = types_1[_a];
            typeSet |= type;
        }
        return typeSet;
    }
    var includesType = function (typeSet, type) { return (typeSet & type) !== 0; };
    var isLoose = makeIsAttr(SolutionType.WEAK_ALGEBRAIC, SolutionType.PREFIXED_STRING, SolutionType.WEAK_PREFIXED_STRING, SolutionType.COMBINED_STRING);
    var isString = makeIsAttr(SolutionType.STRING, SolutionType.PREFIXED_STRING, SolutionType.WEAK_PREFIXED_STRING, SolutionType.COMBINED_STRING);
    var isWeak = makeIsAttr(SolutionType.WEAK_ALGEBRAIC, SolutionType.WEAK_PREFIXED_STRING);
    function makeIsAttr() {
        var types = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            types[_i] = arguments[_i];
        }
        var typeSet = createTypeSet.apply(void 0, types);
        var is = function (type) { return includesType(typeSet, type); };
        return is;
    }

    var RULES = [
        // UNDEFINED
        {
            typeSetList: [
                createTypeSet(SolutionType.UNDEFINED),
                createTypeSet(SolutionType.UNDEFINED),
                createTypeSet(SolutionType.WEAK_ALGEBRAIC),
            ],
            replace: function (r1, r2, r3) { return r1 + "+(" + r2 + "+[" + r3 + "])"; },
            solutionType: SolutionType.PREFIXED_STRING,
        },
        {
            typeSetList: [
                createTypeSet(SolutionType.UNDEFINED),
                createTypeSet(SolutionType.UNDEFINED),
                createTypeSet(SolutionType.WEAK_PREFIXED_STRING),
            ],
            replace: function (r1, r2, r3) { return r1 + "+(" + r2 + "+(" + r3 + "))"; },
            solutionType: SolutionType.PREFIXED_STRING,
        },
        {
            typeSetList: [
                createTypeSet(SolutionType.UNDEFINED),
                createTypeSet(SolutionType.UNDEFINED),
                createTypeSet(SolutionType.OBJECT, SolutionType.STRING, SolutionType.COMBINED_STRING),
            ],
            replace: function (r1, r2, r3) { return r1 + "+(" + r2 + "+" + r3 + ")"; },
            solutionType: SolutionType.PREFIXED_STRING,
        },
        {
            typeSetList: [
                createTypeSet(SolutionType.UNDEFINED),
                createTypeSet(SolutionType.UNDEFINED),
            ],
            replace: function (r1, r2) { return "[]+" + r1 + "+" + r2; },
            solutionType: SolutionType.COMBINED_STRING,
        },
        {
            typeSetList: [
                createTypeSet(SolutionType.UNDEFINED),
                createTypeSet(SolutionType.ALGEBRAIC, SolutionType.WEAK_ALGEBRAIC),
            ],
            replace: function (r1, r2) { return r1 + "+[" + r2 + "]"; },
            solutionType: SolutionType.PREFIXED_STRING,
        },
        {
            typeSetList: [
                createTypeSet(SolutionType.UNDEFINED),
                createTypeSet(SolutionType.PREFIXED_STRING),
            ],
            replace: function (r1, r2) { return r1 + "+(" + r2 + ")"; },
            solutionType: SolutionType.PREFIXED_STRING,
        },
        {
            typeSetList: [createTypeSet(SolutionType.UNDEFINED)],
            replace: function (r1) { return r1; },
            solutionType: SolutionType.PREFIXED_STRING,
        },
        // ALGEBRAIC, PREFIXED_STRING
        {
            typeSetList: [
                createTypeSet(SolutionType.ALGEBRAIC),
                createTypeSet(SolutionType.UNDEFINED, SolutionType.ALGEBRAIC, SolutionType.PREFIXED_STRING),
            ],
            replace: function (r1, r2) { return "[" + r1 + "]+" + r2; },
            solutionType: SolutionType.COMBINED_STRING,
        },
        {
            typeSetList: [
                createTypeSet(SolutionType.ALGEBRAIC),
                createTypeSet(SolutionType.WEAK_ALGEBRAIC),
            ],
            replace: function (r1, r2) { return r1 + "+[" + r2 + "]"; },
            solutionType: SolutionType.PREFIXED_STRING,
        },
        {
            typeSetList: [createTypeSet(SolutionType.ALGEBRAIC, SolutionType.PREFIXED_STRING)],
            replace: function (r1) { return r1; },
            solutionType: SolutionType.PREFIXED_STRING,
        },
        // WEAK_ALGEBRAIC, WEAK_PREFIXED_STRING
        {
            typeSetList: [
                createTypeSet(SolutionType.WEAK_ALGEBRAIC),
                createTypeSet(SolutionType.UNDEFINED, SolutionType.ALGEBRAIC, SolutionType.PREFIXED_STRING),
            ],
            replace: function (r1, r2) { return "[" + r1 + "]+" + r2; },
            solutionType: SolutionType.COMBINED_STRING,
        },
        {
            typeSetList: [
                createTypeSet(SolutionType.WEAK_ALGEBRAIC),
                createTypeSet(SolutionType.WEAK_ALGEBRAIC),
            ],
            replace: function (r1, r2) { return r1 + "+[" + r2 + "]"; },
            solutionType: SolutionType.WEAK_PREFIXED_STRING,
        },
        {
            typeSetList: [createTypeSet(SolutionType.WEAK_ALGEBRAIC, SolutionType.WEAK_PREFIXED_STRING)],
            replace: function (r1) { return r1; },
            solutionType: SolutionType.WEAK_PREFIXED_STRING,
        },
        // OBJECT, STRING, COMBINED_STRING
        {
            typeSetList: [createTypeSet(SolutionType.OBJECT, SolutionType.STRING, SolutionType.COMBINED_STRING)],
            replace: function (r1) { return r1; },
            solutionType: SolutionType.COMBINED_STRING,
        },
    ];
    function findRule(solutions) {
        for (var _i = 0, RULES_1 = RULES; _i < RULES_1.length; _i++) {
            var rule = RULES_1[_i];
            if (matchSolutions(rule.typeSetList, solutions))
                return rule;
        }
    }
    function matchSolutions(typeSets, solutions) {
        if (typeSets.length > solutions.length)
            return false;
        var test = typeSets.every(function (typeSet, index) {
            var type = solutions[index].type;
            var test = includesType(typeSet, type);
            return test;
        });
        return test;
    }

    var AbstractSolution = /** @class */ (function () {
        function AbstractSolution() {
        }
        Object.defineProperty(AbstractSolution.prototype, "isLoose", {
            get: function () {
                return isLoose(this.type);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AbstractSolution.prototype, "isString", {
            get: function () {
                return isString(this.type);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AbstractSolution.prototype, "isWeak", {
            get: function () {
                return isWeak(this.type);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AbstractSolution.prototype, "length", {
            get: function () {
                return this.replacement.length;
            },
            enumerable: false,
            configurable: true
        });
        return AbstractSolution;
    }());
    var DynamicSolution = /** @class */ (function (_super) {
        __extends(DynamicSolution, _super);
        function DynamicSolution() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._solutions = [];
            return _this;
        }
        DynamicSolution.prototype.append = function (solution) {
            this._replacement = undefined;
            this._solutions.push(solution);
        };
        DynamicSolution.prototype.prepend = function (solution) {
            this._replacement = undefined;
            this._solutions.unshift(solution);
        };
        Object.defineProperty(DynamicSolution.prototype, "replacement", {
            get: function () {
                var _a;
                var replacement = (_a = this._replacement) !== null && _a !== void 0 ? _a : (this._replacement = calculateReplacement(this._solutions));
                return replacement;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DynamicSolution.prototype, "source", {
            get: function () {
                var sources = [];
                for (var _i = 0, _a = this._solutions; _i < _a.length; _i++) {
                    var source_1 = _a[_i].source;
                    if (source_1 === undefined)
                        return undefined;
                    sources.push(source_1);
                }
                var source = sources.join('');
                return source;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DynamicSolution.prototype, "type", {
            get: function () {
                var solutions = this._solutions;
                switch (solutions.length) {
                    case 0:
                        return EMPTY_SOLUTION.type;
                    case 1:
                        return solutions[0].type;
                    default:
                        {
                            var solutionType = findRule(solutions).solutionType;
                            return solutionType;
                        }
                }
            },
            enumerable: false,
            configurable: true
        });
        return DynamicSolution;
    }(AbstractSolution));
    var LazySolution = /** @class */ (function (_super) {
        __extends(LazySolution, _super);
        function LazySolution(source, createReplacement, type) {
            var _this = _super.call(this) || this;
            _this.source = source;
            _this.type = type;
            var get = function () {
                var replacement = createReplacement();
                this.defineReplacement({ value: replacement, writable: true });
                return replacement;
            };
            _this.defineReplacement({ get: get });
            return _this;
        }
        LazySolution.prototype.defineReplacement = function (attributes) {
            attributes.configurable = true;
            attributes.enumerable = true;
            Object.defineProperty(this, 'replacement', attributes);
        };
        return LazySolution;
    }(AbstractSolution));
    var SimpleSolution = /** @class */ (function (_super) {
        __extends(SimpleSolution, _super);
        function SimpleSolution(source, replacement, type) {
            var _this = _super.call(this) || this;
            _this.source = source;
            _this.replacement = replacement;
            _this.type = type;
            return _this;
        }
        return SimpleSolution;
    }(AbstractSolution));
    var EMPTY_SOLUTION = new SimpleSolution('', '[]', SolutionType.OBJECT);
    function calculateReplacement(solutions) {
        switch (solutions.length) {
            case 0:
                return EMPTY_SOLUTION.replacement;
            case 1:
                return solutions[0].replacement;
            default:
                {
                    var _a = findRule(solutions), replace = _a.replace, typeSetList = _a.typeSetList;
                    var typeSetCount = typeSetList.length;
                    var replacements = solutions.slice(typeSetCount).map(getAppendableReplacement);
                    var ruleReplacements = solutions.slice(0, typeSetCount).map(getReplacement);
                    var firstReplacement = replace.apply(void 0, ruleReplacements);
                    replacements.unshift(firstReplacement);
                    var replacement = replacements.join('');
                    return replacement;
                }
        }
    }
    var getAppendableReplacement = function (_a) {
        var replacement = _a.replacement, type = _a.type;
        return isWeak(type) ? "+(" + replacement + ")" : "+" + replacement;
    };
    var getReplacement = function (_a) {
        var replacement = _a.replacement;
        return replacement;
    };

    assignNoEnum
    (
        AbstractSolution.prototype,
        {
            get appendLength()
            {
                var extraLength = this.isWeak ? 3 : 1;
                var appendLength = this.length + extraLength;
                return appendLength;
            },
            set appendLength(appendLength)
            {
                _Object_defineProperty(this, 'appendLength', { enumerable: true, value: appendLength });
            },
        }
    );

    // As of version 2.1.0, definitions are interpreted using JScrewIt's own express parser, which can

    var AMENDINGS = ['true', 'undefined', 'NaN'];

    var JSFUCK_INFINITY = '1e1000';

    var R_PADDINGS =
    [
        'RP_0_S',
        'RP_1_WA',
        ,
        'RP_3_WA',
        'RP_4_A',
        'RP_5_A',
        'RP_6_S',
    ];

    var SIMPLE = createEmpty();

    var FROM_CHAR_CODE;
    var FROM_CHAR_CODE_CALLBACK_FORMATTER;
    var MAPPER_FORMATTER;
    var OPTIMAL_ARG_NAME;
    var OPTIMAL_B;
    var OPTIMAL_RETURN_STRING;

    var BASE64_ALPHABET_HI_2;
    var BASE64_ALPHABET_HI_4;
    var BASE64_ALPHABET_HI_6;
    var BASE64_ALPHABET_LO_2;
    var BASE64_ALPHABET_LO_4;
    var BASE64_ALPHABET_LO_6;

    var CHARACTERS;
    var COMPLEX;
    var CONSTANTS;
    var NATIVE_FUNCTION_INFOS;

    var FB_PADDING_ENTRIES_MAP = createEmpty();
    var FH_PADDING_ENTRIES_MAP = createEmpty();

    var FB_R_PADDING_SHIFTS;
    var FH_R_PADDING_SHIFTS;

    function backslashDefinition()
    {
        var replacement = this.$replaceCharByUnescape(0x5C);
        var solution = new SimpleSolution(undefined, replacement, SolutionType.STRING);
        return solution;
    }

    function chooseOtherArgName(argName)
    {
        var otherArgName = argName !== 'undefined' ? 'undefined' : 'falsefalse';
        return otherArgName;
    }

    function createCharAtFnPosDefinition(expr, index, paddingEntries)
    {
        function definitionFX(char)
        {
            var solution =
            this.resolveCharInExpr(char, expr, index, paddingEntries, FH_R_PADDING_SHIFTS);
            return solution;
        }

        return definitionFX;
    }

    function createCharInFBDefinition(offset)
    {
        function definitionFB(char)
        {
            var solution =
            this.$resolveCharInNativeFunction(char, offset, getFBPaddingEntries, FB_R_PADDING_SHIFTS);
            return solution;
        }

        return definitionFB;
    }

    function createCharInFHDefinition(offset)
    {
        function definitionFH(char)
        {
            var solution =
            this.$resolveCharInNativeFunction(char, offset, getFHPaddingEntries, FH_R_PADDING_SHIFTS);
            return solution;
        }

        return definitionFH;
    }

    function createLazySolution(source, expr, type)
    {
        var solution =
        new LazySolution
        (
            source,
            function ()
            {
                var replacement = replaceStaticExpr(expr);
                return replacement;
            },
            type
        );
        return solution;
    }

    function definePadding(block, shiftedIndex)
    {
        var padding = { block: block, shiftedIndex: shiftedIndex };
        var paddingEntry = define.$callWithFeatures(padding, arguments, 2);
        return paddingEntry;
    }

    function getFBPaddingEntries(index)
    {
        var paddingEntries = FB_PADDING_ENTRIES_MAP[index];
        if (!paddingEntries)
        {
            var AT          = Feature.AT;
            var FF_SRC      = Feature.FF_SRC;
            var IE_SRC      = Feature.IE_SRC;
            var NO_FF_SRC   = Feature.NO_FF_SRC;
            var NO_IE_SRC   = Feature.NO_IE_SRC;
            var NO_V8_SRC   = Feature.NO_V8_SRC;
            var V8_SRC      = Feature.V8_SRC;

            switch (index)
            {
            case 16:
                paddingEntries =
                [
                    definePadding('FBEP_4_S', '2 + FH_SHIFT_1'),
                    definePadding('FBP_5_S', 21, NO_FF_SRC),
                    definePadding('FBEP_4_S', 20, NO_IE_SRC),
                    definePadding('RP_0_S', '2 + FH_SHIFT_1', NO_V8_SRC),
                    define(0, FF_SRC),
                    define(0, IE_SRC),
                    define(4, V8_SRC),
                ];
                break;
            case 18:
            case 28:
                paddingEntries =
                [
                    definePadding('RP_5_A + [FBP_7_WA]', index + 12),
                    definePadding('RP_4_A + [FBP_8_WA]', index + 12, AT),
                    definePadding('[RP_3_WA] + FBP_9_U', index + 12, NO_FF_SRC),
                    definePadding('[RP_3_WA] + FBEP_9_U', index + 12, NO_IE_SRC),
                    definePadding('FBEP_4_S', index + 4, Feature.INCR_CHAR, NO_IE_SRC),
                    definePadding('RP_0_S', (index + 2) / 10 + ' + FH_SHIFT_3', NO_V8_SRC),
                    define(0, FF_SRC),
                    define(0, IE_SRC),
                    define(3, V8_SRC),
                ];
                break;
            case 20:
            case 30:
                paddingEntries =
                [
                    definePadding('RP_3_WA + [FBP_7_WA]', index + 10),
                    definePadding('FBEP_10_S', (index + 10) / 10 + ' + FH_SHIFT_1', AT),
                    definePadding('[RP_1_WA] + FBP_9_U', index + 10, NO_FF_SRC),
                    definePadding('FBEP_10_S', index + 10, NO_IE_SRC),
                    definePadding('RP_6_S', (index + 10) / 10 + ' + FH_SHIFT_1', NO_V8_SRC),
                    define(6, FF_SRC),
                    define(5, IE_SRC),
                    define(0, V8_SRC),
                ];
                break;
            case 21:
                paddingEntries =
                [
                    definePadding('FBEP_9_U', '3 + FH_SHIFT_1'),
                    definePadding('FBP_9_U', 30, NO_FF_SRC),
                    definePadding('FBEP_9_U', 30, NO_IE_SRC),
                    definePadding('RP_5_A', '3 + FH_SHIFT_1', NO_V8_SRC),
                    define(5, FF_SRC),
                    define(4, IE_SRC),
                    define(0, V8_SRC),
                ];
                break;
            case 23:
                paddingEntries =
                [
                    definePadding('FBP_7_WA', 30),
                    definePadding('FBP_9_U', 32, NO_FF_SRC),
                    definePadding('FBEP_9_U', 32, NO_IE_SRC),
                    definePadding('RP_3_WA', '3 + FH_SHIFT_1', NO_V8_SRC),
                    define(3, FF_SRC),
                    define(3, IE_SRC),
                    define(0, V8_SRC),
                ];
                break;
            case 25:
                paddingEntries =
                [
                    definePadding('FBP_7_WA', 32),
                    definePadding('FBP_5_S', 30, NO_FF_SRC),
                    definePadding('RP_1_WA + FBEP_4_S', 30, NO_IE_SRC),
                    definePadding('RP_1_WA', '3 + FH_SHIFT_1', NO_V8_SRC),
                    define(1, FF_SRC),
                    define(0, IE_SRC),
                    define(5, V8_SRC),
                ];
                break;
            case 32:
                paddingEntries =
                [
                    definePadding('FBP_8_WA', 40),
                    definePadding('FBP_9_U', 41, NO_FF_SRC),
                    definePadding('FBEP_9_U', 41, NO_IE_SRC),
                    definePadding('RP_4_A', '4 + FH_SHIFT_1', NO_V8_SRC),
                    define(4, FF_SRC),
                    define(3, IE_SRC),
                    define(0, V8_SRC),
                ];
                break;
            case 34:
                paddingEntries =
                [
                    definePadding('FBP_7_WA', 41),
                    definePadding('RP_1_WA + FBP_5_S', 40, NO_FF_SRC),
                    definePadding('FBEP_9_U', 43, NO_IE_SRC),
                    definePadding('RP_2_WS', '4 + FH_SHIFT_1', NO_V8_SRC),
                    define(3, FF_SRC),
                    define(1, IE_SRC),
                    define(6, V8_SRC),
                ];
                break;
            }
            FB_PADDING_ENTRIES_MAP[index] = paddingEntries;
        }
        return paddingEntries;
    }

    function getFHPaddingEntries(index)
    {
        var paddingEntries = FH_PADDING_ENTRIES_MAP[index];
        if (!paddingEntries)
        {
            var IE_SRC      = Feature.IE_SRC;
            var INCR_CHAR   = Feature.INCR_CHAR;
            var NO_IE_SRC   = Feature.NO_IE_SRC;

            switch (index)
            {
            case 3:
            case 13:
                paddingEntries =
                [
                    definePadding('RP_4_A + [FHP_3_WA]', index + 7),
                    definePadding('FHP_8_S', index + 8, INCR_CHAR),
                    define(6, IE_SRC),
                    define(0, NO_IE_SRC),
                ];
                break;
            case 6:
            case 16:
                paddingEntries =
                [
                    definePadding('FHP_5_A', index + 5),
                    define(3, IE_SRC),
                    define(4, NO_IE_SRC),
                ];
                break;
            case 8:
            case 18:
                paddingEntries =
                [
                    definePadding('FHP_3_WA', index + 3),
                    definePadding('RP_2_WS', (index + 2) / 10 + ' + FH_SHIFT_1', INCR_CHAR),
                    define(1, IE_SRC),
                    define(3, NO_IE_SRC),
                ];
                break;
            case 9:
            case 19:
                paddingEntries =
                [
                    definePadding('RP_1_WA', (index + 1) / 10 + ' + FH_SHIFT_1'),
                    define(0, IE_SRC),
                    define(1, NO_IE_SRC),
                ];
                break;
            case 11:
                paddingEntries =
                [
                    definePadding('RP_0_S', '1 + FH_SHIFT_2'),
                    define(0, IE_SRC),
                    define(0, NO_IE_SRC),
                ];
                break;
            case 12:
                paddingEntries =
                [
                    definePadding('FHP_8_S', 20),
                    define(0, IE_SRC),
                    define(0, NO_IE_SRC),
                ];
                break;
            case 14:
                paddingEntries =
                [
                    definePadding('[RP_1_WA] + FHP_5_A', 20),
                    define(5, IE_SRC),
                    define(6, NO_IE_SRC),
                ];
                break;
            case 15:
                paddingEntries =
                [
                    definePadding('FHP_5_A', 20),
                    define(4, IE_SRC),
                    define(5, NO_IE_SRC),
                ];
                break;
            case 17:
                paddingEntries =
                [
                    definePadding('FHP_3_WA', 20),
                    definePadding('RP_3_WA', 2 + ' + FH_SHIFT_1', INCR_CHAR),
                    define(3, IE_SRC),
                    define(3, NO_IE_SRC),
                ];
                break;
            }
            FH_PADDING_ENTRIES_MAP[index] = paddingEntries;
        }
        return paddingEntries;
    }

    (function ()
    {
        var ANY_DOCUMENT                    = Feature.ANY_DOCUMENT;
        var ANY_WINDOW                      = Feature.ANY_WINDOW;
        var ARRAY_ITERATOR                  = Feature.ARRAY_ITERATOR;
        var ARROW                           = Feature.ARROW;
        var AT                              = Feature.AT;
        var ATOB                            = Feature.ATOB;
        var BARPROP                         = Feature.BARPROP;
        var CAPITAL_HTML                    = Feature.CAPITAL_HTML;
        var CONSOLE                         = Feature.CONSOLE;
        var DOCUMENT                        = Feature.DOCUMENT;
        var DOMWINDOW                       = Feature.DOMWINDOW;
        var ESC_HTML_ALL                    = Feature.ESC_HTML_ALL;
        var ESC_HTML_QUOT                   = Feature.ESC_HTML_QUOT;
        var ESC_HTML_QUOT_ONLY              = Feature.ESC_HTML_QUOT_ONLY;
        var ESC_REGEXP_LF                   = Feature.ESC_REGEXP_LF;
        var ESC_REGEXP_SLASH                = Feature.ESC_REGEXP_SLASH;
        var EXTERNAL                        = Feature.EXTERNAL;
        var FF_SRC                          = Feature.FF_SRC;
        var FILL                            = Feature.FILL;
        var FLAT                            = Feature.FLAT;
        var FROM_CODE_POINT                 = Feature.FROM_CODE_POINT;
        var FUNCTION_19_LF                  = Feature.FUNCTION_19_LF;
        var FUNCTION_22_LF                  = Feature.FUNCTION_22_LF;
        var GENERIC_ARRAY_TO_STRING         = Feature.GENERIC_ARRAY_TO_STRING;
        var GLOBAL_UNDEFINED                = Feature.GLOBAL_UNDEFINED;
        var GMT                             = Feature.GMT;
        var HISTORY                         = Feature.HISTORY;
        var HTMLAUDIOELEMENT                = Feature.HTMLAUDIOELEMENT;
        var HTMLDOCUMENT                    = Feature.HTMLDOCUMENT;
        var IE_SRC                          = Feature.IE_SRC;
        var INCR_CHAR                       = Feature.INCR_CHAR;
        var INTL                            = Feature.INTL;
        var LOCALE_INFINITY                 = Feature.LOCALE_INFINITY;
        var LOCALE_NUMERALS                 = Feature.LOCALE_NUMERALS;
        var LOCALE_NUMERALS_EXT             = Feature.LOCALE_NUMERALS_EXT;
        var LOCATION                        = Feature.LOCATION;
        var NAME                            = Feature.NAME;
        var NODECONSTRUCTOR                 = Feature.NODECONSTRUCTOR;
        var NO_FF_SRC                       = Feature.NO_FF_SRC;
        var NO_IE_SRC                       = Feature.NO_IE_SRC;
        var NO_OLD_SAFARI_ARRAY_ITERATOR    = Feature.NO_OLD_SAFARI_ARRAY_ITERATOR;
        var NO_V8_SRC                       = Feature.NO_V8_SRC;
        var OBJECT_UNDEFINED                = Feature.OBJECT_UNDEFINED;
        var PLAIN_INTL                      = Feature.PLAIN_INTL;
        var REGEXP_STRING_ITERATOR          = Feature.REGEXP_STRING_ITERATOR;
        var SELF_OBJ                        = Feature.SELF_OBJ;
        var SHORT_LOCALES                   = Feature.SHORT_LOCALES;
        var STATUS                          = Feature.STATUS;
        var UNDEFINED                       = Feature.UNDEFINED;
        var V8_SRC                          = Feature.V8_SRC;
        var WINDOW                          = Feature.WINDOW;

        function createCharDefaultDefinition
        (atobOpt, charCodeOpt, escSeqOpt, unescapeOpt)
        {
            function charDefaultDefinition(char)
            {
                var charCode = char.charCodeAt();
                var solution =
                this.createCharDefaultSolution
                (char, charCode, atobOpt && charCode < 0x100, charCodeOpt, escSeqOpt, unescapeOpt);
                return solution;
            }

            return charDefaultDefinition;
        }

        function defineCharAtFnPos(expr, index)
        {
            var paddingEntries = getFHPaddingEntries(index);
            var definition = createCharAtFnPosDefinition(expr, index, paddingEntries);
            var entry = define.$callWithFeatures(definition, arguments, 2);
            return entry;
        }

        function defineCharDefault(opts)
        {
            function checkOpt(optName)
            {
                var opt = !(opts && optName in opts) || opts[optName];
                return opt;
            }

            var atobOpt     = checkOpt('atob');
            var charCodeOpt = checkOpt('charCode');
            var escSeqOpt   = checkOpt('escSeq');
            var unescapeOpt = checkOpt('unescape');
            var definition = createCharDefaultDefinition(atobOpt, charCodeOpt, escSeqOpt, unescapeOpt);
            var entry = define(definition);
            return entry;
        }

        function defineCharInFB(offset)
        {
            var definition = createCharInFBDefinition(offset);
            var entry = define(definition);
            return entry;
        }

        function defineCharInFH(offset)
        {
            var definition = createCharInFHDefinition(offset);
            var entry = define.$callWithFeatures(definition, arguments, 1);
            return entry;
        }

        function defineLocalizedNumeral(locale, number, index)
        {
            var expr = '(' + number + ')[TO_LOCALE_STRING](' + locale + ')';
            if (index != null)
                expr += '[' + index + ']';
            var entry = define.$callWithFeatures(expr, LOCALE_NUMERALS, arguments, 3);
            return entry;
        }

        function defineSimple(simple, expr, type)
        {
            SIMPLE[simple] = createLazySolution(simple, expr, type);
        }

        function replaceDigit(digit)
        {
            switch (digit)
            {
            case 0:
                return '+[]';
            case 1:
                return '+!![]';
            default:
                var replacement = '!![]';
                do
                    replacement += '+!![]';
                while (--digit > 1);
                return replacement;
            }
        }

        function useLocaleNumeralDefinition(char, locale, number, index)
        {
            CHARACTERS[char] =
            [
                defineLocalizedNumeral.$callWithFeatures(locale, number, index, arguments, 4),
                defineCharDefault(),
            ];
        }

        function useLocaleNumeralDigitDefinitions(locale, zeroCharCode)
        {
            var fromCharCode = _String.fromCharCode;
            for (var digit = 0; digit <= 9; ++digit)
            {
                var char = fromCharCode(zeroCharCode + digit);
                useLocaleNumeralDefinition
                .$callWithFeatures(char, locale, digit, undefined, arguments, 2);
            }
        }

        BASE64_ALPHABET_HI_2 = ['NaN', 'false', 'undefined', '0'];

        BASE64_ALPHABET_HI_4 =
        [
            [define('A'), define('C', CAPITAL_HTML), define('A', ARRAY_ITERATOR)],
            'F',
            'Infinity',
            'NaNfalse',
            [define('S'), define('R', CAPITAL_HTML), define('S', ARRAY_ITERATOR)],
            [define('W'), define('U', CAPITAL_HTML)],
            'a',
            'false',
            'i',
            'n',
            'r',
            'true',
            'y',
            '0',
            '4',
            '8',
        ];

        BASE64_ALPHABET_HI_6 =
        [
            'A',
            'B',
            'C',
            'D',
            'E',
            'F',
            'G',
            'H',
            'Infinity',
            'J',
            'K',
            'L',
            'M',
            'NaN',
            'O',
            'P',
            'Q',
            'R',
            'S',
            'T',
            'U',
            'V',
            'W',
            'X',
            'Y',
            'Z',
            'a',
            'b',
            'c',
            'd',
            'e',
            'false',
            'g',
            'h',
            'i',
            'j',
            'k',
            'l',
            'm',
            'n',
            'o',
            'p',
            'q',
            'r',
            's',
            'true',
            'undefined',
            'v',
            'w',
            'x',
            'y',
            'z',
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '+',
            '/',
        ];

        BASE64_ALPHABET_LO_2 = ['000', 'NaN', 'falsefalsefalse', '00f'];

        BASE64_ALPHABET_LO_4 =
        [
            '0A',
            [define('0B'), define('0R', CAPITAL_HTML), define('0B', ARRAY_ITERATOR)],
            '0i',
            [define('0j'), define('0T', CAPITAL_HTML), define('0j', ARRAY_ITERATOR)],
            '00',
            '01',
            '02',
            '03',
            '04',
            '05',
            '0a',
            '0r',
            '0s',
            '0t',
            'undefinedfalse',
            '0f',
        ];

        BASE64_ALPHABET_LO_6 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

        CHARACTERS =
        noProto
        ({
            '\t':
            [
                define('Function("return\\"" + ESCAPING_BACKSLASH + "true\\"")()[0]'),
                defineCharDefault({ escSeq: false }),
            ],
            '\n':
            [
                define('(RP_0_S + Function())[23]'),
                define('(RP_1_WA + Function())[20]', FUNCTION_19_LF),
                define('(RP_0_S + Function())[22]', FUNCTION_22_LF),
                define('(RP_0_S + ANY_FUNCTION)[0]', IE_SRC),
                defineCharInFH(13, NO_V8_SRC),
            ],

            '\f':
            [
                define('Function("return\\"" + ESCAPING_BACKSLASH + "false\\"")()[0]'),
                defineCharDefault({ escSeq: false }),
            ],
            '\r':
            [
                define('Function("return\\"" + ESCAPING_BACKSLASH + "r\\"")()'),
                defineCharDefault({ escSeq: false }),
            ],

            '\x1e':
            [
                define('(RP_5_A + atob("NaNfalse"))[10]', ATOB),
            ],

            ' ':
            [
                defineCharAtFnPos('ANY_FUNCTION', 8),
                define('(RP_3_WA + ARRAY_ITERATOR)[10]', ARRAY_ITERATOR),
                define('(RP_0_S + FILTER)[20]', FF_SRC),
                define('(+(RP_0_S + FILTER)[0] + FILTER)[22]', NO_FF_SRC),
                define('(RP_0_S + FILTER)[21]', NO_V8_SRC),
                define('(RP_1_WA + FILTER)[20]', V8_SRC),
                define('(RP_1_WA + AT)[20]', AT, NO_V8_SRC),
                define('(RP_5_A + AT)[20]', AT, V8_SRC),
                define('(+(RP_0_S + FILL)[0] + FILL)[20]', FILL, NO_FF_SRC),
                define('(RP_5_A + FILL)[20]', FILL, NO_IE_SRC),
                define('(RP_0_S + FILL)[20]', FILL, NO_V8_SRC),
                define('(+(RP_0_S + FLAT)[0] + FLAT)[20]', FLAT, NO_FF_SRC),
                define('(RP_5_A + FLAT)[20]', FLAT, NO_IE_SRC),
                define('(RP_0_S + FLAT)[20]', FLAT, NO_V8_SRC),
            ],
            // '!':    ,
            '"':
            [
                define('"".fontcolor()[12]'),
            ],
            '#':
            [
                define('document.nodeName[0]', ANY_DOCUMENT),
                defineCharDefault(),
            ],
            // '$':    ,
            '%':
            [
                define('escape(FILTER)[20]'),
                define('escape(0 + AT)[20]', AT),
                define('atob("000l")[2]', ATOB),
                define('escape(FILL)[21]', FILL),
                define('escape(FLAT)[21]', FLAT),
                define('escape(ANY_FUNCTION)[0]', IE_SRC),
            ],
            '&':
            [
                define('"".fontcolor("".italics())[22]', ESC_HTML_ALL),
                define('"".fontcolor("".sub())[20]', ESC_HTML_ALL),
                define('"".fontcolor("\\"")[13]', ESC_HTML_QUOT),
                define('"".fontcolor("".fontcolor([]))[31]', ESC_HTML_QUOT_ONLY),
                defineCharDefault(),
            ],
            // '\'':   ,
            '(':
            [
                defineCharInFH(9),
            ],
            ')':
            [
                defineCharInFH(10),
            ],
            // '*':    ,
            '+': '(1e100 + [])[2]',
            ',':
            [
                define('(RP_0_S + F_A_L_S_E)[1]'),
                define({ expr: '[[]].concat([[]])', solutionType: SolutionType.OBJECT }),
            ],
            '-': '(.0000001 + [])[2]',
            '.': '(11e20 + [])[1]',
            '/':
            [
                define('"0false".italics()[10]'),
                define('"true".sub()[10]'),
            ],
            // '0'…'9':
            ':':
            [
                define('(RP_0_S + RegExp())[3]'),
                defineCharDefault(),
            ],
            ';':
            [
                define('"".fontcolor("".italics())[21]', ESC_HTML_ALL),
                define('"".fontcolor(true + "".sub())[20]', ESC_HTML_ALL),
                define('"".fontcolor("NaN\\"")[21]', ESC_HTML_QUOT),
                define('"".fontcolor("".fontcolor())[30]', ESC_HTML_QUOT_ONLY),
                defineCharDefault(),
            ],
            '<':
            [
                define('"".italics()[0]'),
                define('"".sub()[0]'),
            ],
            '=':
            [
                define('"".fontcolor()[11]'),
            ],
            '>':
            [
                define('"".italics()[2]'),
                define('"".sub()[10]'),
            ],
            '?':
            [
                define('(RP_0_S + RegExp())[2]'),
                defineCharDefault(),
            ],
            // '@':    ,
            'A':
            [
                defineCharAtFnPos('Array', 9),
                define('(RP_3_WA + ARRAY_ITERATOR)[11]', ARRAY_ITERATOR),
            ],
            'B':
            [
                defineCharAtFnPos('Boolean', 9),
                define('"0".sub()[10]', CAPITAL_HTML),
            ],
            'C':
            [
                define('escape("".italics())[2]'),
                define('escape("".sub())[2]'),
                define('escape(F_A_L_S_E)[11]'),
                define('atob("00NaNfalse")[1]', ATOB),
                define('(RP_4_A + "".fontcolor())[10]', CAPITAL_HTML),
                define('(RP_3_WA + Function("return console")())[11]', CONSOLE),
                define('(RP_0_S + Node)[12]', NODECONSTRUCTOR),
            ],
            'D':
            [
                // • The escaped character may be either "]" or "}".
                define('escape((+("1000" + (RP_5_A + FILTER + 0)[40] + 0) + FILTER)[40])[2]'), // *
                define('escape("]")[2]'),
                define('escape("}")[2]'),
                define('(document + RP_0_S)[SLICE_OR_SUBSTR]("-10")[1]', ANY_DOCUMENT),
                define('escape((RP_4_A + [+("1000" + (AT + 0)[31] + 0)] + AT)[40])[2]', AT), // *
                define('btoa("00")[1]', ATOB),
                define('(RP_3_WA + document)[11]', DOCUMENT),
                define // *
                ('escape((NaN + [+("10" + [(RP_6_S + FILL)[40]] + "000")] + FILL)[40])[2]', FILL),
                define // *
                ('escape((NaN + [+("10" + [(RP_6_S + FLAT)[40]] + "000")] + FLAT)[40])[2]', FLAT),
                define('(RP_0_S + document)[12]', HTMLDOCUMENT),
                define('escape(ARRAY_ITERATOR)[30]', NO_OLD_SAFARI_ARRAY_ITERATOR),
                define('escape(FILTER)[50]', V8_SRC),
                define('(document + [RP_1_WA]).at("-10")', ANY_DOCUMENT, AT),
                define('escape(AT)[61]', AT, IE_SRC),
                define('escape([[]][+(RP_0_S + AT)[0]] + AT)[61]', AT, NO_FF_SRC), // *
                define('escape([NaN][+(RP_1_WA + AT)[20]] + AT)[61]', AT, NO_IE_SRC), // *
                define('escape(true + AT)[50]', AT, V8_SRC),
                define('escape(FILL)[60]', FF_SRC, FILL),
                define('escape(FLAT)[60]', FF_SRC, FLAT),
            ],
            'E':
            [
                defineCharAtFnPos('RegExp', 12),
                define('btoa("0NaN")[1]', ATOB),
                define('(RP_5_A + "".link())[10]', CAPITAL_HTML),
                define('(RP_3_WA + sidebar)[11]', EXTERNAL),
                define('(RP_3_WA + Audio)[21]', HTMLAUDIOELEMENT),
                define('(RP_0_S + REGEXP_STRING_ITERATOR)[11]', REGEXP_STRING_ITERATOR),
            ],
            'F':
            [
                defineCharAtFnPos('Function', 9),
                define('"".fontcolor()[1]', CAPITAL_HTML),
            ],
            'G':
            [
                define('btoa("0false")[1]', ATOB),
                define('"0".big()[10]', CAPITAL_HTML),
                define('(RP_5_A + Date())[30]', GMT),
            ],
            'H':
            [
                define('btoa(true)[1]', ATOB),
                define('"".link()[3]', CAPITAL_HTML),
                define
                ({ expr: '(RP_3_WA + Function("return history")())[11]', optimize: true }, HISTORY),
                define('(RP_1_WA + Audio)[10]', HTMLAUDIOELEMENT),
                define('(RP_3_WA + document)[11]', HTMLDOCUMENT),
            ],
            'I': '"Infinity"[0]',
            'J':
            [
                define('"j"[TO_UPPER_CASE]()'),
                define('btoa(true)[2]', ATOB),
                defineCharDefault({ atob: false }),
            ],
            'K':
            [
                define('(RP_5_A + "".strike())[10]', CAPITAL_HTML),
                defineCharDefault(),
            ],
            'L':
            [
                define('btoa(".")[0]', ATOB),
                define('(RP_3_WA + "".fontcolor())[11]', CAPITAL_HTML),
                define('(RP_0_S + Audio)[12]', HTMLAUDIOELEMENT),
                define('(RP_0_S + document)[11]', HTMLDOCUMENT),
                define
                (
                    {
                        expr: 'Function("return toString.call(location)")()[SLICE_OR_SUBSTR]("-10")[1]',
                        optimize: true,
                    },
                    LOCATION
                ),
                define
                (
                    {
                        expr: '(Function("return toString.call(location)")() + RP_1_WA).at("-10")',
                        optimize: true,
                    },
                    AT,
                    LOCATION
                ),
                define
                (
                    '[][TO_STRING].call(location)[SLICE_OR_SUBSTR]("-10")[1]',
                    GENERIC_ARRAY_TO_STRING,
                    LOCATION
                ),
                define
                (
                    '([][TO_STRING].call(location) + RP_1_WA).at("-10")',
                    AT,
                    GENERIC_ARRAY_TO_STRING,
                    LOCATION
                ),
            ],
            'M':
            [
                define('btoa(0)[0]', ATOB),
                define('"".small()[2]', CAPITAL_HTML),
                define('(RP_4_A + Date())[30]', GMT),
                define('(RP_0_S + Audio)[11]', HTMLAUDIOELEMENT),
                define('(RP_0_S + document)[10]', HTMLDOCUMENT),
            ],
            'N': '"NaN"[0]',
            'O':
            [
                defineCharAtFnPos('Object', 9),
                define('(RP_3_WA + PLAIN_OBJECT)[11]'),
                define('btoa(NaN)[3]', ATOB),
                define('"".fontcolor()[2]', CAPITAL_HTML),
                define('(RP_3_WA + Intl)[11]', PLAIN_INTL),
            ],
            'P':
            [
                define('String.fromCharCode("80")'),
                define('atob("01A")[1]', ATOB),
                define('btoa("".italics())[0]', ATOB),
                define('(RP_0_S + Function("return statusbar")())[11]', BARPROP),
                define('"0".sup()[10]', CAPITAL_HTML),
                defineCharDefault({ atob: false, charCode: false }),
            ],
            'Q':
            [
                define('"q"[TO_UPPER_CASE]()'),
                define('btoa(1)[1]', ATOB),
                defineCharDefault({ atob: false }),
            ],
            'R':
            [
                defineCharAtFnPos('RegExp', 9),
                define('btoa("0true")[2]', ATOB),
                define('"".fontcolor()[10]', CAPITAL_HTML),
                define('(RP_3_WA + REGEXP_STRING_ITERATOR)[11]', REGEXP_STRING_ITERATOR),
            ],
            'S':
            [
                defineCharAtFnPos('String', 9),
                define('"".sub()[1]', CAPITAL_HTML),
            ],
            'T':
            [
                define
                (
                    {
                        expr:
                        '(RP_0_S + ' +
                        'Function("try{undefined.false}catch(undefined){return undefined}")())[0]',
                        optimize: true,
                    }
                ),
                define('btoa(NaN)[0]', ATOB),
                define('"".fontcolor([])[20]', CAPITAL_HTML),
                define('(RP_3_WA + Date())[30]', GMT),
                define('(RP_0_S + Audio)[10]', HTMLAUDIOELEMENT),
                define('(RP_1_WA + document)[10]', HTMLDOCUMENT),
                defineCharDefault({ atob: false }),
            ],
            'U':
            [
                define('btoa("1NaN")[1]', ATOB),
                define('"".sub()[2]', CAPITAL_HTML),
                define('(RP_3_WA + Function("return toString")()())[11]', GLOBAL_UNDEFINED),
                define('(RP_3_WA + Function("return{}.toString")()())[11]', OBJECT_UNDEFINED),
                define('(RP_3_WA + PLAIN_OBJECT[TO_STRING].call())[11]', UNDEFINED),
                define('(RP_3_WA + ARRAY_ITERATOR[TO_STRING].call())[11]', ARRAY_ITERATOR, UNDEFINED),
                define('(RP_3_WA + Function("return Intl.toString")()())[11]', INTL, OBJECT_UNDEFINED),
                define('(RP_3_WA + Intl[TO_STRING].call())[11]', INTL, UNDEFINED),
            ],
            'V':
            [
                define('"v"[TO_UPPER_CASE]()'),
                define('(RP_0_S + document.createElement("video"))[12]', ANY_DOCUMENT),
                define('btoa(undefined)[10]', ATOB),
                defineCharDefault({ atob: false }),
            ],
            'W':
            [
                define('"w"[TO_UPPER_CASE]()'),
                define('(self + RP_4_A)[SLICE_OR_SUBSTR]("-11")[0]', ANY_WINDOW),
                define('btoa(undefined)[1]', ATOB),
                define('(RP_0_S + self)[11]', DOMWINDOW),
                define('(RP_3_WA + self)[11]', WINDOW),
                define('(self + RP_4_A).at("-11")', ANY_WINDOW, AT),
                defineCharDefault({ atob: false }),
            ],
            'X':
            [
                define('"x"[TO_UPPER_CASE]()'),
                define('btoa("1true")[1]', ATOB),
                defineCharDefault({ atob: false }),
            ],
            'Y':
            [
                define('"y"[TO_UPPER_CASE]()'),
                define('btoa("a")[0]', ATOB),
                defineCharDefault({ atob: false }),
            ],
            'Z':
            [
                define('btoa(false)[0]', ATOB),
                define('(RP_3_WA + "".fontsize())[11]', CAPITAL_HTML),
            ],
            '[':
            [
                defineCharInFB(14),
                define('(RP_0_S + ARRAY_ITERATOR)[0]', ARRAY_ITERATOR),
            ],
            '\\':
            [
                define('ESCAPING_BACKSLASH'),
                defineCharDefault({ atob: false, escSeq: false, unescape: false }),
            ],
            ']':
            [
                defineCharInFB(26),
                define('(RP_0_S + ARRAY_ITERATOR)[22]', NO_OLD_SAFARI_ARRAY_ITERATOR),
            ],
            '^':
            [
                define('atob("undefined0")[2]', ATOB),
            ],
            // '_':    ,
            // '`':    ,
            'a': '"false"[1]',
            'b':
            [
                defineCharAtFnPos('Number', 12),
                define('(RP_0_S + ARRAY_ITERATOR)[2]', ARRAY_ITERATOR),
            ],
            'c':
            [
                defineCharAtFnPos('ANY_FUNCTION', 3),
                define('(RP_5_A + ARRAY_ITERATOR)[10]', ARRAY_ITERATOR),
            ],
            'd': '"undefined"[2]',
            'e': '"true"[3]',
            'f': '"false"[0]',
            'g':
            [
                defineCharAtFnPos('String', 14),
            ],
            'h':
            [
                define('101[TO_STRING]("21")[1]'),
                define('btoa("0false")[3]', ATOB),
            ],
            'i': '([RP_5_A] + undefined)[10]',
            'j':
            [
                define('(RP_0_S + PLAIN_OBJECT)[10]'),
                define('(RP_0_S + ARRAY_ITERATOR)[3]', ARRAY_ITERATOR),
                define('(RP_0_S + Intl)[3]', INTL),
                define('(RP_0_S + Node)[3]', NODECONSTRUCTOR),
                define('(RP_0_S + Intl)[10]', PLAIN_INTL),
                define('(RP_0_S + self)[3]', SELF_OBJ),
            ],
            'k':
            [
                define('20[TO_STRING]("21")'),
                defineCharDefault(),
            ],
            'l': '"false"[2]',
            'm':
            [
                defineCharAtFnPos('Number', 11),
                define('(RP_6_S + Function())[20]'),
            ],
            'n': '"undefined"[1]',
            'o':
            [
                defineCharAtFnPos('ANY_FUNCTION', 6),
                define('(RP_0_S + ARRAY_ITERATOR)[1]', ARRAY_ITERATOR),
            ],
            'p':
            [
                define('211[TO_STRING]("31")[1]'),
                define('(RP_3_WA + btoa(undefined))[10]', ATOB),
            ],
            'q':
            [
                define('212[TO_STRING]("31")[1]'),
                define('"".fontcolor(0 + "".fontcolor())[30]', ESC_HTML_ALL),
                define('"".fontcolor("0false\\"")[20]', ESC_HTML_QUOT),
                define('"".fontcolor(true + "".fontcolor())[30]', ESC_HTML_QUOT_ONLY),
                defineCharDefault(),
            ],
            'r': '"true"[1]',
            's': '"false"[3]',
            't': '"true"[0]',
            'u': '"undefined"[0]',
            'v':
            [
                defineCharInFB(19),
            ],
            'w':
            [
                define('32[TO_STRING]("33")'),
                define('(self + RP_0_S)[SLICE_OR_SUBSTR]("-2")[0]', ANY_WINDOW),
                define('atob("undefined0")[1]', ATOB),
                define('(RP_4_A + self)[20]', DOMWINDOW),
                define('(RP_0_S + self)[13]', WINDOW),
                define('(self + RP_0_S).at("-2")', ANY_WINDOW, AT),
            ],
            'x':
            [
                define('101[TO_STRING]("34")[1]'),
                define('btoa("falsefalse")[10]', ATOB),
                define('(RP_1_WA + sidebar)[10]', EXTERNAL),
            ],
            'y': '(RP_3_WA + [Infinity])[10]',
            'z':
            [
                define('35[TO_STRING]("36")'),
                define('btoa("falsefalse")[11]', ATOB),
            ],
            '{':
            [
                defineCharInFH(12),
            ],
            // '|':    ,
            '}':
            [
                defineCharInFB(28),
            ],
            // '~':    ,

            '\x8a':
            [
                define('(RP_4_A + atob("NaNundefined"))[10]', ATOB),
            ],
            '\x8d':
            [
                define('atob("0NaN")[2]', ATOB),
            ],
            '\x96':
            [
                define('atob("00false")[3]', ATOB),
            ],
            '\x9e':
            [
                define('atob(true)[2]', ATOB),
            ],
            '£':
            [
                define('atob(NaN)[1]', ATOB),
            ],
            '¥':
            [
                define('atob("0false")[2]', ATOB),
            ],
            '§':
            [
                define('atob("00undefined")[2]', ATOB),
            ],
            '©':
            [
                define('atob("false0")[1]', ATOB),
            ],
            '±':
            [
                define('atob("0false")[3]', ATOB),
            ],
            '¶':
            [
                define('atob(true)[0]', ATOB),
            ],
            'º':
            [
                define('atob("undefined0")[0]', ATOB),
            ],
            '»':
            [
                define('atob(true)[1]', ATOB),
            ],
            'Ç':
            [
                define('atob("falsefalsefalse")[10]', ATOB),
            ],
            'Ú':
            [
                define('atob("0truefalse")[1]', ATOB),
            ],
            'Ý':
            [
                define('atob("0undefined")[2]', ATOB),
            ],
            'â':
            [
                define('atob("falsefalseundefined")[11]', ATOB),
            ],
            'é':
            [
                define('atob("0undefined")[1]', ATOB),
            ],
            'î':
            [
                define('atob("0truefalse")[2]', ATOB),
            ],
            'ö':
            [
                define('atob("0false")[1]', ATOB),
            ],
            'ø':
            [
                define('atob("undefinedundefined")[10]', ATOB),
            ],
            '∞':
            [
                define('Infinity[TO_LOCALE_STRING]()', LOCALE_INFINITY),
                defineCharDefault(),
            ],
        });

        COMPLEX =
        noProto
        ({
            Number:         define({ expr: 'Number.name', optimize: { complexOpt: false } }, NAME),
            Object:         define({ expr: 'Object.name', optimize: { complexOpt: false } }, NAME),
            RegExp:         define({ expr: 'RegExp.name', optimize: { complexOpt: false } }, NAME),
            String:         define('String.name', NAME),
            fromCharCo:
            define({ expr: '"from3har3o".split(3).join("C")', optimize: { complexOpt: false } }),
            mCh:            define('atob("bUNo")', Feature.ATOB),
        });

        CONSTANTS =
        noProto
        ({
            // JavaScript globals

            Array:
            [
                define('[].constructor'),
            ],
            Audio:
            [
                define('Function("return Audio")()', HTMLAUDIOELEMENT),
            ],
            Boolean:
            [
                define('false.constructor'),
            ],
            Date:
            [
                define('Function("return Date")()'),
            ],
            Function:
            [
                define('ANY_FUNCTION.constructor'),
            ],
            Intl:
            [
                define('Function("return Intl")()', INTL),
            ],
            Node:
            [
                define('Function("return Node")()', NODECONSTRUCTOR),
            ],
            Number:
            [
                define('0..constructor'),
            ],
            Object:
            [
                define('PLAIN_OBJECT.constructor'),
                define('Intl.constructor', INTL),
                define('[].entries().constructor', NO_OLD_SAFARI_ARRAY_ITERATOR),
            ],
            RegExp:
            [
                define('Function("return/false/")().constructor'),
            ],
            String:
            [
                define('"".constructor'),
            ],
            atob:
            [
                define('Function("return atob")()', ATOB),
            ],
            btoa:
            [
                define('Function("return btoa")()', ATOB),
            ],
            document:
            [
                define({ expr: 'Function("return document")()', optimize: true }, ANY_DOCUMENT),
            ],
            escape:
            [
                define({ expr: 'Function("return escape")()', optimize: true }),
            ],
            location:
            [
                define('Function("return location")()', LOCATION),
            ],
            self:
            [
                define('Function("return self")()', SELF_OBJ),
            ],
            sidebar:
            [
                define('Function("return sidebar")()', EXTERNAL),
            ],
            unescape:
            [
                define({ expr: 'Function("return unescape")()', optimize: true }),
            ],

            // Custom definitions

            ANY_FUNCTION:
            [
                define('FILTER'),
                define('AT', AT),
                define('FILL', FILL),
                define('FLAT', FLAT),
            ],
            ARRAY_ITERATOR:
            [
                define('[].entries()', ARRAY_ITERATOR),
            ],
            AT:
            [
                define('[].at', AT),
            ],
            ESCAPING_BACKSLASH:
            [
                define(backslashDefinition),
                define({ expr: 'atob("01y")[1]', solutionType: SolutionType.STRING }, ATOB),
                define
                (
                    { expr: '(RP_0_S + RegExp("\\n"))[1]', solutionType: SolutionType.STRING },
                    ESC_REGEXP_LF
                ),
                define
                (
                    { expr: '(RP_5_A + RegExp("".italics()))[10]', solutionType: SolutionType.STRING },
                    ESC_REGEXP_SLASH
                ),
                define
                (
                    { expr: '(RP_3_WA + RegExp("".sub()))[10]', solutionType: SolutionType.STRING },
                    ESC_REGEXP_SLASH
                ),
                define
                (
                    { expr: '(RP_0_S + RegExp(FILTER))[20]', solutionType: SolutionType.STRING },
                    ESC_REGEXP_LF,
                    FF_SRC
                ),
                define
                (
                    { expr: '(RP_0_S + RegExp(Function()))[20]', solutionType: SolutionType.STRING },
                    ESC_REGEXP_LF,
                    FUNCTION_19_LF
                ),
                define
                (
                    { expr: '(RP_5_A + RegExp(Function()))[30]', solutionType: SolutionType.STRING },
                    ESC_REGEXP_LF,
                    FUNCTION_22_LF
                ),
                define
                (
                    { expr: '(RP_0_S + RegExp(ANY_FUNCTION))[1]', solutionType: SolutionType.STRING },
                    ESC_REGEXP_LF,
                    IE_SRC
                ),
                define
                (
                    {
                        expr: '(+(RP_0_S + FILTER)[0] + RegExp(FILTER))[23]',
                        solutionType: SolutionType.STRING,
                    },
                    ESC_REGEXP_LF,
                    NO_V8_SRC
                ),
                define
                (
                    { expr: '(RP_4_A + RegExp(AT))[20]', solutionType: SolutionType.STRING },
                    AT,
                    ESC_REGEXP_LF,
                    FF_SRC
                ),
                define
                (
                    {
                        expr: '(RP_1_WA + [+(RP_0_S + AT)[0]] + RegExp(AT))[20]',
                        solutionType: SolutionType.STRING,
                    },
                    AT,
                    ESC_REGEXP_LF,
                    NO_V8_SRC
                ),
                define
                (
                    { expr: '(RP_3_WA + RegExp(FILL))[21]', solutionType: SolutionType.STRING },
                    ESC_REGEXP_LF,
                    FF_SRC,
                    FILL
                ),
                define
                (
                    { expr: '(RP_3_WA + RegExp(FLAT))[21]', solutionType: SolutionType.STRING },
                    ESC_REGEXP_LF,
                    FF_SRC,
                    FLAT
                ),
                define
                (
                    {
                        expr: '(+(RP_0_S + FILL)[0] + RegExp(FILL))[21]',
                        solutionType: SolutionType.STRING,
                    },
                    ESC_REGEXP_LF,
                    FILL,
                    NO_V8_SRC
                ),
                define
                (
                    {
                        expr: '(+(RP_0_S + FLAT)[0] + RegExp(FLAT))[21]',
                        solutionType: SolutionType.STRING,
                    },
                    ESC_REGEXP_LF,
                    FLAT,
                    NO_V8_SRC
                ),
            ],
            FILL:
            [
                define('[].fill', FILL),
            ],
            FILTER:
            [
                define('[].filter'),
            ],
            FLAT:
            [
                define('[].flat', FLAT),
            ],
            FROM_CHAR_CODE:
            [
                define
                (
                    {
                        expr: '"fromCharCode"',
                        optimize: true,
                        solutionType: SolutionType.COMBINED_STRING,
                    }
                ),
                define
                (
                    {
                        expr: '"fromCodePoint"',
                        optimize: true,
                        solutionType: SolutionType.COMBINED_STRING,
                    },
                    FROM_CODE_POINT
                ),
            ],
            F_A_L_S_E:
            [
                define('[][SLICE_OR_FLAT].call("false")'),
            ],
            LOCALE_AR:
            [
                define({ expr: '"ar-td"', solutionType: SolutionType.COMBINED_STRING }),
                define({ expr: '"ar"', solutionType: SolutionType.COMBINED_STRING }, SHORT_LOCALES),
            ],
            PLAIN_OBJECT:
            [
                define('Function("return{}")()'),
            ],
            REGEXP_STRING_ITERATOR:
            [
                define({ expr: '"".matchAll()', optimize: true }, REGEXP_STRING_ITERATOR),
            ],
            SLICE_OR_FLAT:
            [
                define({ expr: '"slice"', solutionType: SolutionType.COMBINED_STRING }),
                define({ expr: '"flat"', solutionType: SolutionType.COMBINED_STRING }, FLAT),
            ],
            SLICE_OR_SUBSTR:
            [
                define({ expr: '"slice"', solutionType: SolutionType.COMBINED_STRING }),
                define({ expr: '"substr"', solutionType: SolutionType.COMBINED_STRING }),
            ],
            TO_LOCALE_STRING:
            [
                define
                (
                    {
                        expr: '"toLocaleString"',
                        optimize: true,
                        solutionType: SolutionType.COMBINED_STRING,
                    }
                ),
            ],
            TO_STRING:
            [
                define
                (
                    {
                        expr: '"toString"',
                        optimize: { toStringOpt: false },
                        solutionType: SolutionType.COMBINED_STRING,
                    }
                ),
            ],
            TO_UPPER_CASE:
            [
                define
                (
                    {
                        expr: '"toUpperCase"',
                        optimize: true,
                        solutionType: SolutionType.COMBINED_STRING,
                    }
                ),
            ],

            // Function body extra padding blocks: prepended to a function to align the function's body
            // at the same position in different engines, assuming that the function header is aligned.
            // The number after "FBEP_" is the maximum character overhead.
            // The postfix that follows the maximum character overhead has the same meaning as in
            // regular padding blocks.

            FBEP_4_S:
            [
                define('[[true][+(RP_3_WA + FILTER)[30]]]'),
                define('[[true][+(RP_1_WA + AT)[30]]]', AT),
                define('[[true][+(RP_5_A + FILL)[30]]]', FILL),
                define('[[true][+(RP_5_A + FLAT)[30]]]', FLAT),
                define('[[true][+!!++(RP_0_S + FILTER)[20]]]', INCR_CHAR),
                define('[[true][+!!++(RP_1_WA + AT)[20]]]', AT, INCR_CHAR),
                define('[[true][+!!++(RP_0_S + FILL)[20]]]', FILL, INCR_CHAR),
                define('[[true][+!!++(RP_0_S + FLAT)[20]]]', FLAT, INCR_CHAR),
            ],
            FBEP_9_U:
            [
                define
                ({ expr: '[false][+(RP_0_S + FILTER)[20]]', solutionType: SolutionType.UNDEFINED }),
                define
                ({ expr: '[false][+(RP_1_WA + AT)[20]]', solutionType: SolutionType.UNDEFINED }, AT),
                define
                ({ expr: '[false][+(RP_0_S + FILL)[20]]', solutionType: SolutionType.UNDEFINED }, FILL),
                define
                ({ expr: '[false][+(RP_0_S + FLAT)[20]]', solutionType: SolutionType.UNDEFINED }, FLAT),
            ],
            FBEP_10_S:
            [
                define({ expr: '[RP_1_WA] + FBEP_9_U', solutionType: SolutionType.COMBINED_STRING }),
            ],

            // Function body padding blocks: prepended to a function to align the function's body at the
            // same position in different engines.
            // The number after "FBP_" is the maximum character overhead.
            // The postfix that follows the maximum character overhead has the same meaning as in
            // regular padding blocks.

            FBP_5_S:
            [
                define('[[false][+IS_IE_SRC_A]]', NO_FF_SRC),
            ],
            FBP_7_WA:
            [
                define
                (
                    {
                        expr: '+("10" + [(RP_4_A + FILTER)[40]] + "00000")',
                        solutionType: SolutionType.WEAK_ALGEBRAIC,
                    }
                ),
                define
                (
                    {
                        expr: '+("10" + [(RP_0_S + AT)[32]] + "00000")',
                        solutionType: SolutionType.WEAK_ALGEBRAIC,
                    },
                    AT
                ),
                define
                (
                    {
                        expr: '+("10" + [(RP_6_S + FILL)[40]] + "00000")',
                        solutionType: SolutionType.WEAK_ALGEBRAIC,
                    },
                    FILL
                ),
                define
                (
                    {
                        expr: '+("10" + [(RP_6_S + FLAT)[40]] + "00000")',
                        solutionType: SolutionType.WEAK_ALGEBRAIC,
                    },
                    FLAT
                ),
            ],
            FBP_8_WA:
            [
                define
                (
                    {
                        expr: '+("1000" + (RP_5_A + FILTER + 0)[40] + "000")',
                        solutionType: SolutionType.WEAK_ALGEBRAIC,
                    }
                ),
                define
                (
                    {
                        expr: '+("1000" + (AT + 0)[31] + "000")',
                        solutionType: SolutionType.WEAK_ALGEBRAIC,
                    },
                    AT
                ),
                define
                (
                    {
                        expr: '+("1000" + (FILL + 0)[33] + "000")',
                        solutionType: SolutionType.WEAK_ALGEBRAIC,
                    },
                    FILL
                ),
                define
                (
                    {
                        expr: '+("1000" + (FLAT + 0)[33] + "000")',
                        solutionType: SolutionType.WEAK_ALGEBRAIC,
                    },
                    FLAT
                ),
            ],
            FBP_9_U:
            [
                define
                (
                    {
                        expr: '[true][+(RP_0_S + ANY_FUNCTION)[0]]',
                        solutionType: SolutionType.UNDEFINED,
                    },
                    NO_FF_SRC
                ),
            ],

            // Function header shift: used to adjust an index to make it point to the same position in
            // the string representation of a function's header in different engines.
            // This evaluates to an array containing only the number 𝑛 - 1 or only the number 𝑛, where 𝑛
            // is the number after "FH_SHIFT_".

            FH_SHIFT_1:
            [
                define('[+IS_IE_SRC_A]'),
            ],
            FH_SHIFT_2:
            [
                define('[true + IS_IE_SRC_A]'),
            ],
            FH_SHIFT_3:
            [
                define('[2 + IS_IE_SRC_A]'),
            ],

            // Function header padding blocks: prepended to a function to align the function's header at
            // the same position in different engines.
            // The number after "FHP_" is the maximum character overhead.
            // The postfix that follows the maximum character overhead has the same meaning as in
            // regular padding blocks.

            FHP_3_WA:
            [
                define
                (
                    {
                        expr: '+(1 + [+(RP_0_S + ANY_FUNCTION)[0]])',
                        solutionType: SolutionType.WEAK_ALGEBRAIC,
                    }
                ),
                define
                (
                    {
                        expr: '+(++(RP_0_S + ANY_FUNCTION)[0] + [0])',
                        solutionType: SolutionType.WEAK_ALGEBRAIC,
                    },
                    INCR_CHAR
                ),
            ],
            FHP_5_A:
            [
                define({ expr: 'IS_IE_SRC_A', solutionType: SolutionType.ALGEBRAIC }),
            ],
            FHP_8_S:
            [
                define({ expr: '[RP_3_WA] + FHP_5_A', solutionType: SolutionType.COMBINED_STRING }),
            ],

            // Conditional padding blocks.
            //
            // true if feature IE_SRC is available; false otherwise.
            IS_IE_SRC_A:
            [
                define
                (
                    {
                        expr: '!![[]][+(RP_0_S + ANY_FUNCTION)[0]]',
                        solutionType: SolutionType.ALGEBRAIC,
                    }
                ),
                define
                (
                    { expr: '!!++(RP_0_S + ANY_FUNCTION)[0]', solutionType: SolutionType.ALGEBRAIC },
                    INCR_CHAR
                ),
            ],

            // Regular padding blocks.
            //
            // The number after "RP_" is the character overhead.
            // The postifx that follows it indicates the solution type.
            //
            // • "_U":  environment hybrid undefined and algebraic
            // • "_A":  algebraic
            // • "_WA": weak algebraic
            // • "_S":  object, prefixed string or combined string
            // • "_WS": weak prefixed string

            RP_0_S:     { expr: '[]',       solutionType: SolutionType.OBJECT },
            RP_1_WA:    { expr: '0',        solutionType: SolutionType.WEAK_ALGEBRAIC },
            RP_2_WS:    { expr: '"00"',     solutionType: SolutionType.WEAK_PREFIXED_STRING },
            RP_3_WA:    { expr: 'NaN',      solutionType: SolutionType.WEAK_ALGEBRAIC },
            RP_4_A:     { expr: 'true',     solutionType: SolutionType.ALGEBRAIC },
            RP_5_A:     { expr: 'false',    solutionType: SolutionType.ALGEBRAIC },
            RP_6_S:     { expr: '"0false"', solutionType: SolutionType.COMBINED_STRING },
        });

        FB_R_PADDING_SHIFTS = [define(4, FF_SRC), define(5, IE_SRC), define(0, V8_SRC)];

        FH_R_PADDING_SHIFTS = [define(1, IE_SRC), define(0, NO_IE_SRC)];

        FROM_CHAR_CODE =
        defineList
        (
            [define('fromCharCode'), define('fromCodePoint', FROM_CODE_POINT)],
            [
                define(0),
                define(1, ATOB),
                define(1, BARPROP),
                define(1, CAPITAL_HTML),
                define(0, ARRAY_ITERATOR, ATOB, CAPITAL_HTML, FROM_CODE_POINT),
            ]
        );

        FROM_CHAR_CODE_CALLBACK_FORMATTER =
        defineList
        (
            [
                define
                (
                    function (fromCharCode, arg)
                    {
                        var expr =
                        'function(undefined){return String.' + fromCharCode + '(' + arg + ')}';
                        return expr;
                    }
                ),
                define
                (
                    function (fromCharCode, arg)
                    {
                        var expr =
                        'function(undefined){return(isNaN+false).constructor.' + fromCharCode + '(' +
                        arg + ')}';
                        return expr;
                    }
                ),
                define
                (
                    function (fromCharCode, arg)
                    {
                        var expr = 'undefined=>String.' + fromCharCode + '(' + arg + ')';
                        return expr;
                    },
                    ARROW
                ),
                define
                (
                    function (fromCharCode, arg)
                    {
                        var expr =
                        'undefined=>(isNaN+false).constructor.' + fromCharCode + '(' + arg + ')';
                        return expr;
                    },
                    ARROW
                ),
                define
                (
                    function (fromCharCode, arg)
                    {
                        var expr =
                        'function(undefined){return status.constructor.' + fromCharCode + '(' + arg +
                        ')}';
                        return expr;
                    },
                    STATUS
                ),
                define
                (
                    function (fromCharCode, arg)
                    {
                        var expr = 'undefined=>status.constructor.' + fromCharCode + '(' + arg + ')';
                        return expr;
                    },
                    ARROW,
                    STATUS
                ),
            ],
            [
                define(1),
                define(3),
                define(0, ARRAY_ITERATOR, CAPITAL_HTML),
                define(1, ARRAY_ITERATOR, CAPITAL_HTML, FLAT),
                define(0, ARRAY_ITERATOR, CAPITAL_HTML, NO_V8_SRC),
                define(1, ARRAY_ITERATOR, AT, CAPITAL_HTML),
                define(1, ARRAY_ITERATOR, CAPITAL_HTML, FF_SRC, FLAT),
                define(1, ARRAY_ITERATOR, CAPITAL_HTML, FILL, IE_SRC),
                define(1, ARRAY_ITERATOR, CAPITAL_HTML, FILL, NO_IE_SRC),
                define(1, ARRAY_ITERATOR, CAPITAL_HTML, FLAT, IE_SRC),
                define(2, ARRAY_ITERATOR, CAPITAL_HTML),
                define(3, ARRAY_ITERATOR, AT, CAPITAL_HTML, IE_SRC),
                define(3, ARRAY_ITERATOR, AT, CAPITAL_HTML, NO_IE_SRC),
                define(4),
                define(5),
            ]
        );

        MAPPER_FORMATTER =
        defineList
        (
            [
                define
                (
                    function (argName, accessor)
                    {
                        var otherArgName = chooseOtherArgName(argName);
                        var mapper =
                        'Function("return function(' + otherArgName + '){return function(' + argName +
                        '){return ' + otherArgName + accessor + '}}")()';
                        return mapper;
                    }
                ),
                define
                (
                    function (argName, accessor)
                    {
                        var mapper =
                        'Function("return function(' + argName + '){return this' + accessor +
                        '}")().bind';
                        return mapper;
                    }
                ),
                define
                (
                    function (argName, accessor)
                    {
                        var otherArgName = chooseOtherArgName(argName);
                        var mapper =
                        'Function("return ' + otherArgName + '=>' + argName + '=>' + otherArgName +
                        accessor + '")()';
                        return mapper;
                    },
                    ARROW
                ),
            ],
            [
                define(0),
                define(1, ARRAY_ITERATOR, ATOB),
                define(0, NO_FF_SRC),
                define(0, NO_V8_SRC),
                define(1, ARRAY_ITERATOR, CAPITAL_HTML),
                define(0, ARRAY_ITERATOR, AT, ATOB),
                define(0, ARRAY_ITERATOR, AT, CAPITAL_HTML),
                define(0, ARRAY_ITERATOR, ATOB, FILL),
                define(0, ARRAY_ITERATOR, ATOB, FLAT),
                define(0, ARRAY_ITERATOR, ATOB, NO_IE_SRC),
                define(0, ARRAY_ITERATOR, CAPITAL_HTML, FILL),
                define(0, ARRAY_ITERATOR, CAPITAL_HTML, FLAT),
                define(0, ARRAY_ITERATOR, CAPITAL_HTML, IE_SRC),
                define(0, ARRAY_ITERATOR, CAPITAL_HTML, NO_IE_SRC),
                define(2),
            ]
        );

        NATIVE_FUNCTION_INFOS =
        [
            define({ expr: 'FILTER', shift: 6 }),
            define({ expr: 'FILL', shift: 4 }, FILL),
            define({ expr: 'FLAT', shift: 4 }, FLAT),
            define({ expr: 'AT', shift: 2 }, AT),
        ];

        OPTIMAL_ARG_NAME =
        defineList
        (
            [define('f'), define('undefined')],
            [
                define(0),
                define(1, AT),
                define(1, FILL, IE_SRC),
                define(1, FILL, NO_IE_SRC),
                define(0, FLAT),
            ]
        );

        OPTIMAL_B = defineList([define('B'), define('b')], [define(0), define(1, ARRAY_ITERATOR)]);

        OPTIMAL_RETURN_STRING =
        defineList
        (
            [
                define('return String'),
                define('return(isNaN+false).constructor'),
                define('return status.constructor', STATUS),
            ],
            [
                define(1),
                define(0, ARRAY_ITERATOR, CAPITAL_HTML),
                define(1, FLAT),
                define(0, ARRAY_ITERATOR, CAPITAL_HTML, NO_V8_SRC),
                define(1, ARRAY_ITERATOR, AT, CAPITAL_HTML),
                define(1, ARRAY_ITERATOR, CAPITAL_HTML, FF_SRC, FLAT),
                define(1, ARRAY_ITERATOR, CAPITAL_HTML, FILL, IE_SRC),
                define(1, ARRAY_ITERATOR, CAPITAL_HTML, FILL, NO_IE_SRC),
                define(1, ARRAY_ITERATOR, CAPITAL_HTML, FLAT, IE_SRC),
                define(2),
            ]
        );

        // Create simple constant solutions
        defineSimple('false',       '![]',              SolutionType.ALGEBRAIC);
        defineSimple('true',        '!![]',             SolutionType.ALGEBRAIC);
        defineSimple('undefined',   '[][[]]',           SolutionType.UNDEFINED);
        defineSimple('NaN',         '+[false]',         SolutionType.WEAK_ALGEBRAIC);
        defineSimple('Infinity',    JSFUCK_INFINITY,    SolutionType.WEAK_ALGEBRAIC);

        // Create definitions for digits
        for (var digit = 0; digit <= 9; ++digit)
        {
            var expr = replaceDigit(digit);
            CHARACTERS[digit] = { expr: expr, solutionType: SolutionType.WEAK_ALGEBRAIC };
        }

        makeCallableWithFeatures(defineLocalizedNumeral);
        makeCallableWithFeatures(useLocaleNumeralDefinition);

        // Localized numeral definitions
        useLocaleNumeralDigitDefinitions('LOCALE_AR', 0x0660);
        useLocaleNumeralDefinition('٫', 'LOCALE_AR', 0.1, 1);
        useLocaleNumeralDefinition('ل', '"ar"', NaN, 0);
        useLocaleNumeralDefinition('ي', '"ar"', NaN, 1);
        useLocaleNumeralDefinition('س', '"ar"', NaN, 2);
        useLocaleNumeralDefinition('ر', '"ar"', NaN, 4, LOCALE_NUMERALS_EXT);
        useLocaleNumeralDefinition('ق', '"ar"', NaN, 5, LOCALE_NUMERALS_EXT);
        useLocaleNumeralDefinition('م', '"ar"', NaN, 6, LOCALE_NUMERALS_EXT);
        useLocaleNumeralDigitDefinitions('"bn"', 0x09e6, LOCALE_NUMERALS_EXT);
        useLocaleNumeralDigitDefinitions('"fa"', 0x06f0);
        useLocaleNumeralDefinition('٬', '"fa"', 1000, 1);
        useLocaleNumeralDefinition('ن', '"fa"', NaN, 0, LOCALE_NUMERALS_EXT);
        useLocaleNumeralDefinition('ا', '"fa"', NaN, 1, LOCALE_NUMERALS_EXT);
        useLocaleNumeralDefinition('ع', '"fa"', NaN, 2, LOCALE_NUMERALS_EXT);
        useLocaleNumeralDefinition('د', '"fa"', NaN, 3, LOCALE_NUMERALS_EXT);
        useLocaleNumeralDefinition('н', '"ru"', NaN, 0, LOCALE_NUMERALS_EXT);
        useLocaleNumeralDefinition('е', '"ru"', NaN, 1, LOCALE_NUMERALS_EXT);
        useLocaleNumeralDefinition('ч', '"ru"', NaN, 3, LOCALE_NUMERALS_EXT);
        useLocaleNumeralDefinition('и', '"ru"', NaN, 4, LOCALE_NUMERALS_EXT);
        useLocaleNumeralDefinition('с', '"ru"', NaN, 5, LOCALE_NUMERALS_EXT);
        useLocaleNumeralDefinition('л', '"ru"', NaN, 6, LOCALE_NUMERALS_EXT);
        useLocaleNumeralDefinition('о', '"ru"', NaN, 7, LOCALE_NUMERALS_EXT);
    }
    )();

    var APPEND_LENGTH_OF_DIGIT_0     = 6;
    var APPEND_LENGTH_OF_DOT         = 73;
    var APPEND_LENGTH_OF_FALSE       = 4;
    var APPEND_LENGTH_OF_EMPTY       = 3; // Append length of the empty array.
    var APPEND_LENGTH_OF_MINUS       = 136;
    var APPEND_LENGTH_OF_PLUS_SIGN   = 71;
    var APPEND_LENGTH_OF_SMALL_E     = 26;

    var APPEND_LENGTH_OF_DIGITS = [APPEND_LENGTH_OF_DIGIT_0, 8, 12, 17, 22, 27, 32, 37, 42, 47];

    // Recognized syntax elements include:
    //
    // • The boolean literals "true" and "false"
    // • The pseudoconstant literals "undefined", "NaN" and "Infinity"
    // • ES5 strict mode numeric literals
    // • ES5 strict mode string literals with the line continuation extension
    // • Empty and singleton array literals
    // • ASCII identifiers
    // • ASCII property getters in dot notation
    // • Property getters in bracket notation
    // • Function calls without parameters and with one parameter
    // • The unary operators "!", "+", and to a limited extent "-" and "++" (prefix and postfix
    //   increment)
    // • The binary operators "+" and to a limited extent "-"
    // • Grouping parentheses
    // • White spaces and line terminators
    // • Semicolons
    // • Comments

    function appendGetOp(parseInfo, op)
    {
        var str = stringifyUnit(op);
        if (str != null)
            op.str = str;
        op.type = 'get';
        appendOp(parseInfo, op);
    }

    function appendOp(parseInfo, op)
    {
        var opsStack = parseInfo.opsStack;
        var ops = opsStack[opsStack.length - 1];
        ops.push(op);
    }

    function appendTerm(parseInfo, term)
    {
        var unit = popUnit(parseInfo);
        var mod = popMod(parseInfo);
        applyMod(term, mod);
        if (unit)
        {
            if (!finalizeUnit(term))
                return;
            var terms = unit.terms;
            if (terms && isUndecoratedUnit(unit))
            {
                terms.push(term);
                if (!term.arithmetic)
                    unit.arithmetic = false;
            }
            else
            {
                if (!finalizeUnit(unit))
                    return;
                var arithmetic = unit.arithmetic && term.arithmetic;
                unit = { arithmetic: arithmetic, ops: [], terms: [unit, term] };
            }
        }
        else
            unit = term;
        var binSign = read(parseInfo, /^(?:\+(?!\+)|-(?!-))/);
        if (!binSign)
        {
            var finalizer = popFinalizer(parseInfo);
            return finalizer(unit, parseInfo);
        }
        if (binSign === '-' && !unit.arithmetic)
            applyMod(unit, '+');
        mod = readMod(parseInfo, binSign === '+' ? '' : binSign);
        pushMod(parseInfo, mod);
        pushUnit(parseInfo, unit);
        return parsePrimaryExpr;
    }

    function applyMod(unit, mod)
    {
        if (!unit.mod && 'value' in unit && unit.arithmetic && !unit.pmod)
        {
            var value = unit.value;
            loop:
            for (var index = mod.length; index--;)
            {
                var thisMod = mod[index];
                switch (thisMod)
                {
                case '!':
                    value = !value;
                    break;
                case '+':
                    value = +value;
                    break;
                case '-':
                    value = -value;
                    break;
                case '#':
                    break loop;
                }
            }
            unit.value = value;
            mod = mod.slice(0, index + 1);
        }
        if (mod)
        {
            mod = joinMods(mod, unit.mod || '', unit.pmod);
            unit.mod = mod;
            unit.arithmetic = true;
        }
    }

    function defaultReadIdentifierData(parseInfo)
    {
        var rawIdentifier = read(parseInfo, rawIdentifierRegExp);
        if (rawIdentifier)
        {
            var identifier = _JSON_parse('"' + rawIdentifier + '"');
            if (/^[$A-Z_a-z][$\w]*$/.test(identifier))
            {
                var escaped = identifier.length < rawIdentifier.length;
                return { escaped: escaped, identifier: identifier };
            }
        }
    }

    function escapeMod(mod)
    {
        var escapedMod = mod.replace(/\+\+/g, '#');
        return escapedMod;
    }

    function evalExpr(expr)
    {
        var value = _Function('return ' + expr)();
        return value;
    }

    function finalizeArrayElement(unit, parseInfo)
    {
        if (finalizeUnit(unit) && readSquareBracketRight(parseInfo))
        {
            newOps(parseInfo, { value: [unit] });
            return parseNextOp;
        }
    }

    function finalizeGroup(unit, parseInfo)
    {
        if (readParenthesisRight(parseInfo))
        {
            newOps(parseInfo, unit);
            return parseNextOp;
        }
    }

    function finalizeIndexer(op, parseInfo)
    {
        if (finalizeUnit(op) && readSquareBracketRight(parseInfo))
        {
            appendGetOp(parseInfo, op);
            return parseNextOp;
        }
    }

    function finalizeParamCall(op, parseInfo)
    {
        if (finalizeUnit(op) && readParenthesisRight(parseInfo))
        {
            op.type = 'param-call';
            appendOp(parseInfo, op);
            return parseNextOp;
        }
    }

    function finalizeUnit(unit)
    {
        var mod = unit.mod || '';
        if (!/-/.test(mod) && (!/#$/.test(mod) || unit.ops.length))
        {
            unit.mod = unescapeMod(mod);
            return unit;
        }
    }

    function isReturnableIdentifier(identifier, escaped)
    {
        var returnable =
        UNRETURNABLE_WORDS.indexOf(identifier) < 0 &&
        (!escaped || INESCAPABLE_WORDS.indexOf(identifier) < 0);
        return returnable;
    }

    function isUndecoratedUnit(unit)
    {
        var undecorated = !(unit.mod || unit.ops.length);
        return undecorated;
    }

    function joinMods(mod1, mod2, trimTrailingPlus)
    {
        var mod =
        (mod1 + mod2)
        .replace(/\+\+|--/, '+')
        .replace(/\+-|-\+/, '-')
        .replace(/!-/, '!+')
        .replace(/\+#/, '#')
        .replace(/!\+!/, '!!')
        .replace('!!!', '!');
        if (trimTrailingPlus)
            mod = mod.replace(/\+$/, '');
        return mod;
    }

    function makeRegExp(richPattern)
    {
        var pattern = '^(?:' + replacePattern(richPattern) + ')';
        var regExp = _RegExp(pattern);
        return regExp;
    }

    function newOps(parseInfo, unit)
    {
        pushNewOps(parseInfo);
        pushUnit(parseInfo, unit);
    }

    function parse(parseInfo)
    {
        for (var next = parseUnit; typeof next === 'function'; next = next(parseInfo));
        return next;
    }

    function parseNextOp(parseInfo)
    {
        if (readParenthesisLeft(parseInfo))
        {
            if (readParenthesisRight(parseInfo))
            {
                appendOp(parseInfo, { type: 'call' });
                return parseNextOp;
            }
            pushFinalizer(parseInfo, finalizeParamCall);
            return parseUnit;
        }
        if (readSquareBracketLeft(parseInfo))
        {
            pushFinalizer(parseInfo, finalizeIndexer);
            return parseUnit;
        }
        if (read(parseInfo, /^\./))
        {
            var identifierData = defaultReadIdentifierData(parseInfo);
            if (!identifierData)
                return;
            appendGetOp(parseInfo, { ops: [], value: identifierData.identifier });
            return parseNextOp;
        }
        var unit = popUnit(parseInfo);
        var ops = popOps(parseInfo);
        if (ops.length)
        {
            unit.arithmetic = false;
            if (unit.mod || unit.pmod)
            {
                if (!finalizeUnit(unit))
                    return;
                unit = { terms: [unit] };
            }
        }
        unit.ops = ops = (unit.ops || []).concat(ops);
        if (ops.length && !unit.mod && !unit.pmod)
        {
            if (/^.*$/.test(parseInfo.separator))
            {
                var pmod = read(parseInfo, /^\+\+/);
                if (pmod)
                {
                    unit.pmod = pmod;
                    unit.arithmetic = true;
                }
            }
        }
        var next = appendTerm(parseInfo, unit);
        return next;
    }

    function parsePrimaryExpr(parseInfo)
    {
        var strExpr = read(parseInfo, strRegExp);
        if (strExpr)
        {
            var str = evalExpr(strExpr);
            newOps(parseInfo, { value: str });
            return parseNextOp;
        }
        var constValueExpr = read(parseInfo, constValueRegExp);
        if (constValueExpr)
        {
            var constValue = evalExpr(constValueExpr);
            newOps(parseInfo, { arithmetic: true, value: constValue });
            return parseNextOp;
        }
        if (readSquareBracketLeft(parseInfo))
        {
            if (readSquareBracketRight(parseInfo))
            {
                newOps(parseInfo, { value: [] });
                return parseNextOp;
            }
            pushFinalizer(parseInfo, finalizeArrayElement);
            return parseUnit;
        }
        if (readParenthesisLeft(parseInfo))
        {
            pushFinalizer(parseInfo, finalizeGroup);
            return parseUnit;
        }
        var identifierData = defaultReadIdentifierData(parseInfo);
        if (identifierData)
        {
            var identifier = identifierData.identifier;
            if (isReturnableIdentifier(identifier, identifierData.escaped))
            {
                newOps(parseInfo, { identifier: identifier });
                return parseNextOp;
            }
        }
    }

    function parseUnit(parseInfo)
    {
        var MAX_PARSABLE_NESTINGS = 1000;

        if (parseInfo.finalizerStack.length <= MAX_PARSABLE_NESTINGS)
        {
            var mod = readMod(parseInfo, '');
            pushMod(parseInfo, mod);
            pushUnit(parseInfo);
            return parsePrimaryExpr;
        }
    }

    function popFinalizer(parseInfo)
    {
        var ret = parseInfo.finalizerStack.pop();
        return ret;
    }

    function popMod(parseInfo)
    {
        var mod = parseInfo.modStack.pop();
        return mod;
    }

    function popOps(parseInfo)
    {
        var ops = parseInfo.opsStack.pop();
        return ops;
    }

    function popUnit(parseInfo)
    {
        var unit = parseInfo.unitStack.pop();
        return unit;
    }

    function pushFinalizer(parseInfo, finalizer)
    {
        parseInfo.finalizerStack.push(finalizer);
    }

    function pushMod(parseInfo, mod)
    {
        parseInfo.modStack.push(mod);
    }

    function pushNewOps(parseInfo)
    {
        parseInfo.opsStack.push([]);
    }

    function pushUnit(parseInfo, unit)
    {
        parseInfo.unitStack.push(unit);
    }

    function read(parseInfo, regExp)
    {
        var data = parseInfo.data;
        var matches = regExp.exec(data);
        if (matches)
        {
            var match = matches[0];
            data = data.slice(match.length);
            var separator = separatorRegExp.exec(data)[0];
            if (separator)
                data = data.slice(separator.length);
            parseInfo.data = data;
            parseInfo.separator = separator;
            return match;
        }
    }

    function readMod(parseInfo, mod)
    {
        var newMod;
        while (newMod = read(parseInfo, /^(?:!|\+\+?|-(?!-))/))
            mod = joinMods(mod, escapeMod(newMod));
        return mod;
    }

    function readParenthesisLeft(parseInfo)
    {
        var match = read(parseInfo, /^\(/);
        return match;
    }

    function readParenthesisRight(parseInfo)
    {
        var match = read(parseInfo, /^\)/);
        return match;
    }

    function readSeparatorOrColon(parseInfo)
    {
        parseInfo.data = parseInfo.data.replace(separatorOrColonRegExp, '');
    }

    function readSquareBracketLeft(parseInfo)
    {
        var match = read(parseInfo, /^\[/);
        return match;
    }

    function readSquareBracketRight(parseInfo)
    {
        var match = read(parseInfo, /^]/);
        return match;
    }

    function replaceAndGroupToken(unused, tokenName)
    {
        var replacement = '(?:' + replaceToken(tokenName) + ')';
        return replacement;
    }

    function replacePattern(richPattern)
    {
        var pattern = richPattern.replace(/#(\w+)/g, replaceAndGroupToken);
        return pattern;
    }

    function replaceToken(tokenName)
    {
        var replacement = tokenCache[tokenName];
        if (replacement == null)
        {
            var richPattern = tokens[tokenName];
            tokenCache[tokenName] = replacement = replacePattern(richPattern);
        }
        return replacement;
    }

    function stringifyUnit(unit)
    {
        var inArray = false;
        while ('value' in unit && isUndecoratedUnit(unit))
        {
            var value = unit.value;
            if (!_Array_isArray(value))
                return value == null && inArray ? '' : _String(value);
            unit = value[0];
            if (!unit)
                return '';
            inArray = true;
        }
    }

    function unescapeMod(mod)
    {
        var unescapedMod = mod.replace(/#/g, '++');
        return unescapedMod;
    }

    var tokens =
    {
        ConstIdentifier:        'Infinity|NaN|false|true|undefined',
        DecimalLiteral:         '(?:(?:0|[1-9]\\d*)(?:\\.\\d*)?|\\.\\d+)(?:[Ee][+-]?\\d+)?',
        DoubleQuotedString:     '"(?:#EscapeSequence|(?!["\\\\]).)*"',
        EscapeSequence:         '\\\\(?:u#HexDigit{4}|x#HexDigit{2}|0(?![0-7])|\r\n|[^0-7ux])',
        HexDigit:               '[0-9A-Fa-f]',
        HexIntegerLiteral:      '0[Xx]#HexDigit+',
        NumericLiteral:         '#HexIntegerLiteral|#DecimalLiteral',
        Separator:              '#SeparatorChar|//.*(?!.)|/\\*[\\s\\S]*?\\*/',
        // U+180E is recognized as a separator in older browsers.
        // U+FEFF is missed by /\s/ in Android Browser < 4.1.x.
        SeparatorChar:          '(?!\u180E)[\\s\uFEFF]',
        SingleQuotedString:     '\'(?:#EscapeSequence|(?![\'\\\\]).)*\'',
        UnicodeEscapeSequence:  '\\\\u#HexDigit{4}',
    };

    var tokenCache = createEmpty();

    // Reserved words and that cannot be written with escape sequences.
    var INESCAPABLE_WORDS = ['false', 'null', 'true'];

    // This list includes reserved words and identifiers that would cause a change in a script's
    // behavior when placed after a return statement inside a Function invocation.
    // Unwanted changes include producing a syntax error where none is expected or a difference in
    // evaluation.
    var UNRETURNABLE_WORDS =
    [
        'arguments',    // shadowed in function body
        'debugger',     // : debugger;
        'delete',       // : delete(x);
        'if',           // : if(x);
        'import',       // : import(x);
        'let',          // may be an identifier in non-strict mode
        'new',          // : new(x);
        'return',       // : return;
        'this',         // shadowed in function body
        'throw',        // : throw(x);
        'typeof',       // : typeof(x);
        'void',         // : void(x);
        'while',        // : while(x);
        'with',         // : with(x);
        'yield',        // may be an identifier in non-strict mode
    ];

    var constValueRegExp        = makeRegExp('(?:#NumericLiteral|#ConstIdentifier)');
    var rawIdentifierRegExp     = makeRegExp('(?:[$\\w]|#UnicodeEscapeSequence)+');
    var separatorOrColonRegExp  = makeRegExp('(?:#Separator|;)*');
    var separatorRegExp         = makeRegExp('#Separator*');
    var strRegExp               = makeRegExp('#SingleQuotedString|#DoubleQuotedString');

    function expressParse(input)
    {
        var parseInfo =
        { data: input, modStack: [], opsStack: [], finalizerStack: [finalizeUnit], unitStack: [] };
        readSeparatorOrColon(parseInfo);
        if (!parseInfo.data)
            return true;
        var unit = parse(parseInfo);
        if (unit)
        {
            readSeparatorOrColon(parseInfo);
            if (!parseInfo.data)
                return unit;
        }
    }

    var expressParseCached;

    if (typeof WeakRef !== 'function')
        expressParseCached = expressParse;
    else
    {
        var cache = new Map();
        var cleanup =
        new FinalizationRegistry
        (
            function (input)
            {
                var ref = cache.get(input);
                if (ref && !ref.deref())
                    cache.delete(input);
            }
        );
        expressParseCached =
        function (input)
        {
            var unit;
            var ref = cache.get(input);
            if (ref)
                unit = ref.deref();
            if (!unit)
            {
                unit = expressParse(input);
                if (unit && unit !== true)
                {
                    ref = new WeakRef(unit);
                    cache.set(input, ref);
                    cleanup.register(unit, input);
                }
            }
            return unit;
        };
    }

    var expressParseCached$1 = expressParseCached;

    var SCREW_NORMAL             = 0;
    var SCREW_AS_STRING          = 1;
    var SCREW_AS_BONDED_STRING   = 2;

    function gather(buffer, offset, count, groupBond, groupForceString)
    {
        var end = offset + count;
        var groupSolutions = buffer._solutions.slice(offset, end);
        var optimizerList = buffer._optimizerList;
        if (optimizerList.length)
            optimizeSolutions(optimizerList, groupSolutions, groupBond, groupForceString);
        var str = gatherGroup(groupSolutions, groupBond, groupForceString);
        return str;
    }

    function gatherGroup(solutions, bond, forceString)
    {
        var solution = new DynamicSolution();
        var count = solutions.length;
        if (count)
        {
            var index = 0;
            do
            {
                var subSolution = solutions[index];
                solution.append(subSolution);
            }
            while (++index < count);
        }
        else
            solution.append(EMPTY_SOLUTION);
        if (!solution.isString && forceString)
            solution.append(EMPTY_SOLUTION);
        var str = solution.replacement;
        if (bond && solution.isLoose)
            str = '(' + str + ')';
        return str;
    }

    function ScrewBuffer(screwMode, groupThreshold, optimizerList)
    {
        this._groupThreshold = groupThreshold;
        this._maxSolutionCount = _Math_pow(2, groupThreshold - 1);
        this._optimizerList = optimizerList;
        this._screwMode = screwMode;
        this._solutions = [];
        this._length = -APPEND_LENGTH_OF_EMPTY;
    }

    assignNoEnum
    (
        ScrewBuffer.prototype,
        {
            get length()
            {
                return this._length;
            },
            append:
            function (solution)
            {
                var solutions = this._solutions;
                if (solutions.length >= this._maxSolutionCount)
                    return false;
                solutions.push(solution);
                var appendLength = solution.appendLength;
                this._optimizerList.forEach
                (
                    function (optimizer)
                    {
                        var currentAppendLength = optimizer.appendLengthOf(solution);
                        if (currentAppendLength < appendLength)
                            appendLength = currentAppendLength;
                    }
                );
                this._length += appendLength;
                return true;
            },
            toString:
            function ()
            {
                function collectOut(offset, count, maxGroupCount, groupBond)
                {
                    var str;
                    if (count <= groupSize + 1)
                        str = gather(buffer, offset, count, groupBond);
                    else
                    {
                        maxGroupCount /= 2;
                        var halfCount = groupSize * maxGroupCount;
                        var capacity = 2 * halfCount - count;
                        var leftEndCount =
                        _Math_max
                        (
                            halfCount - capacity + capacity % (groupSize - 1),
                            (maxGroupCount / 2 ^ 0) * (groupSize + 1)
                        );
                        str =
                        collectOut(offset, leftEndCount, maxGroupCount) +
                        '+' +
                        collectOut(offset + leftEndCount, count - leftEndCount, maxGroupCount, true);
                        if (groupBond)
                            str = '(' + str + ')';
                    }
                    return str;
                }

                var str;
                var solutionCount = this._solutions.length;
                var groupThreshold = this._groupThreshold;
                var screwMode = this._screwMode;
                var bond = screwMode === SCREW_AS_BONDED_STRING;
                if (solutionCount <= groupThreshold)
                {
                    var forceString = screwMode !== SCREW_NORMAL;
                    str = gather(this, 0, solutionCount, bond, forceString);
                }
                else
                {
                    var groupSize = groupThreshold;
                    var maxGroupCount = 2;
                    for (;;)
                    {
                        --groupSize;
                        var maxSolutionCountForDepth = groupSize * maxGroupCount;
                        if (solutionCount <= maxSolutionCountForDepth)
                            break;
                        maxGroupCount *= 2;
                    }
                    var buffer = this;
                    str = collectOut(0, solutionCount, maxGroupCount, bond);
                }
                return str;
            },
        }
    );

    function optimizeSolutions(optimizerList, solutions, bond, forceString)
    {
        var plan = createClusteringPlan();
        optimizerList.forEach
        (
            function (optimizer)
            {
                optimizer.optimizeSolutions(plan, solutions, bond, forceString);
            }
        );
        var clusters = plan.conclude();
        clusters.forEach
        (
            function (cluster)
            {
                var clusterer = cluster.data;
                var solution = clusterer();
                solutions.splice(cluster.start, cluster.length, solution);
            }
        );
    }

    function findBase64AlphabetDefinition(encoder, element)
    {
        var definition;
        if (_Array_isArray(element))
            definition = encoder.findDefinition(element);
        else
            definition = element;
        return definition;
    }

    function replaceCharByAtob(charCode)
    {
        var param1 = BASE64_ALPHABET_LO_6[charCode >> 2] + BASE64_ALPHABET_HI_2[charCode & 0x03];
        var postfix1 = '(' + this.replaceString(param1) + ')';
        if (param1.length > 2)
            postfix1 += replaceIndexer(0);

        var param2Left = findBase64AlphabetDefinition(this, BASE64_ALPHABET_LO_4[charCode >> 4]);
        var param2Right = findBase64AlphabetDefinition(this, BASE64_ALPHABET_HI_4[charCode & 0x0f]);
        var param2 = param2Left + param2Right;
        var index2 = 1 + (param2Left.length - 2) / 4 * 3;
        var indexer2 = replaceIndexer(index2);
        var postfix2 = '(' + this.replaceString(param2) + ')' + indexer2;

        var param3Left = BASE64_ALPHABET_LO_2[charCode >> 6];
        var param3 = param3Left + BASE64_ALPHABET_HI_6[charCode & 0x3f];
        var index3 = 2 + (param3Left.length - 3) / 4 * 3;
        var indexer3 = replaceIndexer(index3);
        var postfix3 = '(' + this.replaceString(param3) + ')' + indexer3;

        var postfix = shortestOf([postfix1, postfix2, postfix3]);
        var replacement = this.resolveConstant('atob').replacement + postfix;
        return replacement;
    }

    function replaceIndexer(index)
    {
        var indexStr = _String(index);
        var replacement = '[' + replaceStaticString(indexStr) + ']';
        return replacement;
    }

    function replaceCharByCharCode(charCode)
    {
        var arg;
        if (charCode === 0)
            arg = '[]';
        else if (charCode === 1)
            arg = 'true';
        else if (charCode < 10)
            arg = charCode;
        else
            arg = '"' + charCode + '"';
        var replacement = this.replaceExpr('String[FROM_CHAR_CODE](' + arg + ')');
        return replacement;
    }

    var REPLACE_OPTIONS = { firstSolution: EMPTY_SOLUTION };

    var REPLACE_SMALL_B_OPTIONS =
    {
        firstSolution: EMPTY_SOLUTION,
        optimize: { commaOpt: false, complexOpt: false, toStringOpt: true },
    };

    function hexCodeOf(encoder, charCode, hexDigitCount)
    {
        var optimalB = encoder.findDefinition(OPTIMAL_B);
        var charCodeStr = charCode.toString(16);
        var extraZeroCount = hexDigitCount - charCodeStr.length;
        var hexCodeSmallB = extraZeros(extraZeroCount) + charCodeStr.replace(/fa?$/, 'false');
        var hexCode = hexCodeSmallB.replace(/b/g, optimalB);
        if (optimalB !== 'b' && /(?=.*b.*b)(?=.*c)|(?=.*b.*b.*b)/.test(charCodeStr))
        {
            // optimalB is not "b", but the character code is a candidate for toString
            // clustering, which only works with "b".
            var replacementSmallB = encoder.replaceString(hexCodeSmallB, REPLACE_SMALL_B_OPTIONS);
            var replacement = encoder.replaceString(hexCode, REPLACE_OPTIONS);
            if (replacementSmallB.length < replacement.length)
                hexCode = hexCodeSmallB;
        }
        return hexCode;
    }

    var LOW_UNICODE_ESC_SEQ_CODES;

    function replaceCharByEscSeq(charCode)
    {
        var escCode;
        var appendIndexer;
        var toStringOpt;
        if (charCode >= 0xfd || charCode in LOW_UNICODE_ESC_SEQ_CODES)
        {
            escCode = 'u' + hexCodeOf(this, charCode, 4);
            appendIndexer = escCode.length > 5;
            toStringOpt = true;
        }
        else
        {
            escCode = charCode.toString(8);
            appendIndexer = false;
            toStringOpt = false;
        }
        var expr = 'Function("return\\"" + ESCAPING_BACKSLASH + "' + escCode + '\\"")()';
        if (appendIndexer)
            expr += '[0]';
        var replacement =
        this.replaceExpr(expr, { commaOpt: false, complexOpt: false, toStringOpt: toStringOpt });
        return replacement;
    }

    LOW_UNICODE_ESC_SEQ_CODES = createEmpty();

    [
        0x0f, 0x1f, 0x2f, 0x3f, 0x6f, 0x7f, 0xaf, 0xdf, 0xef,
        0xf0, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xfa,
    ]
    .forEach
    (
        function (charCode)
        {
            LOW_UNICODE_ESC_SEQ_CODES[charCode] = null;
        }
    );

    function replaceCharByUnescape(charCode)
    {
        var hexCode;
        var appendIndexer;
        var toStringOpt;
        if (charCode < 0x100)
        {
            hexCode = hexCodeOf(this, charCode, 2);
            appendIndexer = hexCode.length > 2;
            toStringOpt = false;
        }
        else
        {
            hexCode = 'u' + hexCodeOf(this, charCode, 4);
            appendIndexer = hexCode.length > 5;
            toStringOpt = true;
        }
        var expr = 'unescape("%' + hexCode + '")';
        if (appendIndexer)
            expr += '[0]';
        var replacement =
        this.replaceExpr(expr, { commaOpt: false, complexOpt: false, toStringOpt: toStringOpt });
        return replacement;
    }

    var STATIC_CHAR_CACHE   = createEmpty();
    var STATIC_CONST_CACHE  = createEmpty();
    var STATIC_ENCODER      = new Encoder(maskNew());

    var BOND_STRENGTH_NONE      = 0;
    var BOND_STRENGTH_WEAK      = 1;
    var BOND_STRENGTH_STRONG    = 2;

    /** @class Encoder */

    function Encoder(mask)
    {
        this.mask       = mask;
        this.charCache  = _Object_create(STATIC_CHAR_CACHE);
        this.constCache = _Object_create(STATIC_CONST_CACHE);
        this.optimizers = createEmpty();
        this.stack      = [];
    }

    function callResolver(encoder, stackName, resolver)
    {
        var stack = encoder.stack;
        var stackIndex = stack.indexOf(stackName);
        stack.push(stackName);
        try
        {
            if (~stackIndex)
            {
                var chain = stack.slice(stackIndex);
                var feature = featureFromMask(encoder.mask);
                var message = 'Circular reference detected: ' + chain.join(' < ') + ' – ' + feature;
                var error = new _SyntaxError(message);
                assignNoEnum(error, { chain: chain, feature: feature });
                throw error;
            }
            resolver.call(encoder);
        }
        finally
        {
            stack.pop();
        }
    }

    function defaultResolveCharacter(encoder, char)
    {
        var charCode = char.charCodeAt();
        var atobOpt = charCode < 0x100;
        var solution = encoder.createCharDefaultSolution(char, charCode, atobOpt, true, true, true);
        return solution;
    }

    function evalNumber(preMantissa, lastDigit, exp)
    {
        var value = +(preMantissa + lastDigit + 'e' + exp);
        return value;
    }

    function findOptimalSolution(encoder, source, entries, defaultSolutionType)
    {
        var optimalSolution;
        entries.forEach
        (
            function (entry, entryIndex)
            {
                if (encoder.hasFeatures(entry.mask))
                {
                    var solution = encoder.resolve(entry.definition, source, defaultSolutionType);
                    if (!optimalSolution || optimalSolution.length > solution.length)
                    {
                        optimalSolution = solution;
                        if (optimalSolution.entryCode == null)
                            optimalSolution.entryCode = entryIndex;
                    }
                }
            },
            encoder
        );
        return optimalSolution;
    }

    function formatPositiveNumber(number)
    {
        function getMantissa()
        {
            var lastDigitIndex = usefulDigits - 1;
            var preMantissa = digits.slice(0, lastDigitIndex);
            var lastDigit = +digits[lastDigitIndex];
            var value = evalNumber(preMantissa, lastDigit, exp);
            for (;;)
            {
                var decreasedLastDigit = lastDigit - 1;
                var newValue = evalNumber(preMantissa, decreasedLastDigit, exp);
                if (newValue !== value)
                    break;
                lastDigit = decreasedLastDigit;
            }
            var mantissa = preMantissa + lastDigit;
            return mantissa;
        }

        var str;
        var match = /^(\d+)(?:\.(\d+))?(?:e(.+))?$/.exec(number);
        var digitsAfterDot = match[2] || '';
        var digits = (match[1] + digitsAfterDot).replace(/^0+/, '');
        var usefulDigits = digits.search(/0*$/);
        var exp = (match[3] | 0) - digitsAfterDot.length + digits.length - usefulDigits;
        var mantissa = getMantissa();
        if (exp >= 0)
        {
            if (exp < 10)
                str = mantissa + extraZeros(exp);
            else if (exp % 100 === 99 && (exp > 99 || mantissa[1]))
                str = mantissa.replace(/.$/, '.$&e') + (exp + 1);
            else
                str = mantissa + 'e' + exp;
        }
        else
        {
            if (exp >= -mantissa.length)
                str = mantissa.slice(0, exp) + '.' + mantissa.slice(exp);
            else
            {
                var extraZeroCount = -mantissa.length - exp;
                var extraLength = APPEND_LENGTH_OF_DOT + APPEND_LENGTH_OF_DIGIT_0 * extraZeroCount;
                str =
                replaceNegativeExponential(mantissa, exp, extraLength) ||
                '.' + extraZeros(extraZeroCount) + mantissa;
            }
        }
        return str;
    }

    function getMultiDigitLength(str)
    {
        var appendLength = 0;
        _Array_prototype_forEach.call
        (
            str,
            function (digit)
            {
                var digitAppendLength = APPEND_LENGTH_OF_DIGITS[digit];
                appendLength += digitAppendLength;
            }
        );
        return appendLength;
    }

    function getReplacers(optimize)
    {
        var replaceString =
        function (encoder, str, options)
        {
            options.optimize = optimize;
            var replacement = encoder.replaceString(str, options);
            if (!replacement)
                throwSyntaxError(encoder, 'String too complex');
            return replacement;
        };
        var strReplacer =
        function (encoder, str, screwMode)
        {
            var options = { screwMode: screwMode };
            var replacement = replaceString(encoder, str, options);
            return replacement;
        };
        var strAppender =
        function (encoder, str, firstSolution)
        {
            var options = { firstSolution: firstSolution, screwMode: SCREW_AS_STRING };
            var replacement = replaceString(encoder, str, options);
            return replacement;
        };
        var replacers =
        { appendString: strAppender, identifier: replaceIdentifier, string: strReplacer };
        return replacers;
    }

    function isStringUnit(unit)
    {
        var strUnit = typeof unit.value === 'string' && !unit.mod && !unit.pmod && !unit.ops.length;
        return strUnit;
    }

    function replaceIdentifier(encoder, identifier, bondStrength)
    {
        var solution;
        if (identifier in encoder.constantDefinitions)
            solution = encoder.resolveConstant(identifier);
        else
            solution = SIMPLE[identifier];
        if (!solution)
            throwSyntaxError(encoder, 'Undefined identifier ' + identifier);
        var groupingRequired =
        bondStrength && solution.isLoose ||
        bondStrength > BOND_STRENGTH_WEAK && solution.replacement[0] === '!';
        var replacement = solution.replacement;
        if (groupingRequired)
            replacement = '(' + replacement + ')';
        return replacement;
    }

    function replaceMultiDigitNumber(number)
    {
        var str = formatPositiveNumber(number);
        var replacement = replaceStaticString(str);
        return replacement;
    }

    function replaceNegativeExponential(mantissa, exp, rivalExtraLength)
    {
        var extraZeroCount;
        if (exp % 100 > 7 - 100)
        {
            if (exp % 10 > -7)
                extraZeroCount = 0;
            else
                extraZeroCount = 10 + exp % 10;
        }
        else
            extraZeroCount = 100 + exp % 100;
        mantissa += extraZeros(extraZeroCount);
        exp -= extraZeroCount;
        var extraLength =
        APPEND_LENGTH_OF_DIGIT_0 * extraZeroCount +
        APPEND_LENGTH_OF_SMALL_E +
        APPEND_LENGTH_OF_MINUS +
        getMultiDigitLength(_String(-exp));
        if (extraLength < rivalExtraLength)
        {
            var str = mantissa + 'e' + exp;
            return str;
        }
    }

    function replacePrimaryExpr(encoder, unit, bondStrength, unitIndices, maxLength, replacers)
    {
        var MIN_APPEND_LENGTH = 3;

        var output;
        var terms;
        var identifier;
        var strAppender = replacers.appendString;
        if (terms = unit.terms)
        {
            var count = terms.length;
            var maxCoreLength = maxLength - (bondStrength ? 2 : 0);
            var canAppendString = false;
            for (var index = 0; index < count; ++index)
            {
                var term = terms[index];
                var termUnitIndices = count > 1 ? unitIndices.concat(index) : unitIndices;
                if (strAppender && isStringUnit(term))
                {
                    var firstSolution;
                    if (output)
                    {
                        if (!canAppendString)
                        {
                            throwSyntaxError
                            (
                                encoder,
                                'Unsupported concatenation of a string to a potentially non-string ' +
                                'expression'
                            );
                        }
                        firstSolution =
                        new SimpleSolution(undefined, output, SolutionType.WEAK_PREFIXED_STRING);
                    }
                    else
                    {
                        firstSolution = undefined;
                        canAppendString = true;
                    }
                    output = strAppender(encoder, term.value, firstSolution);
                }
                else
                {
                    var maxTermLength =
                    maxCoreLength - (output ? output.length + 1 : 0) -
                    MIN_APPEND_LENGTH * (count - index - 1);
                    var termOutput =
                    encoder._replaceExpressUnit(term, index, termUnitIndices, maxTermLength, replacers);
                    if (!termOutput)
                        return;
                    if (output)
                        output += '+' + termOutput;
                    else
                        output = termOutput;
                }
            }
            if (bondStrength)
                output = '(' + output + ')';
        }
        else if (identifier = unit.identifier)
        {
            var identifierReplacer = replacers.identifier;
            output = identifierReplacer(encoder, identifier, bondStrength, unitIndices, maxLength);
        }
        else
        {
            var value = unit.value;
            if (typeof value === 'string')
            {
                var strReplacer = replacers.string;
                var screwMode = bondStrength ? SCREW_AS_BONDED_STRING : SCREW_AS_STRING;
                output = strReplacer(encoder, value, screwMode, unitIndices, maxLength);
            }
            else if (_Array_isArray(value))
            {
                if (value.length)
                {
                    var replacement =
                    encoder._replaceExpressUnit
                    (value[0], false, unitIndices, maxLength - 2, replacers);
                    if (replacement)
                        output = '[' + replacement + ']';
                }
                else if (!(maxLength < 2))
                    output = '[]';
            }
            else
            {
                if (typeof value === 'number' && value === value)
                {
                    var abs = _Math_abs(value);
                    var negative = value < 0 || 1 / value < 0;
                    var str;
                    if (abs === 0)
                        str = '0';
                    else if (abs === Infinity)
                        str = JSFUCK_INFINITY;
                    else
                        str = formatPositiveNumber(abs);
                    if (negative)
                        str = '-' + str;
                    output = replaceStaticString(str);
                    if (str.length > 1)
                        output = '+(' + output + ')';
                    if (bondStrength)
                        output = '(' + output + ')';
                }
                else
                    output = replaceIdentifier(STATIC_ENCODER, _String(value), bondStrength);
                if (output.length > maxLength)
                    return;
            }
        }
        return output;
    }

    function resolveCharByDefaultMethod(encoder, char, charCode, replaceChar, entryCode)
    {
        var replacement = replaceChar.call(encoder, charCode);
        var solution = new SimpleSolution(char, replacement, SolutionType.STRING);
        solution.entryCode = entryCode;
        return solution;
    }

    function throwSyntaxError(encoder, message)
    {
        var stack = encoder.stack;
        var stackLength = stack.length;
        if (stackLength)
            message += ' in the definition of ' + stack[stackLength - 1];
        throw new _SyntaxError(message);
    }

    var matchSimpleAt =
    (function ()
    {
        try
        {
            var pattern = _Object_keys(SIMPLE).join('|');
            var regExp = _RegExp(pattern, 'y');
            // In Android Browser 4.0, the RegExp constructor ignores the unrecognized flag instead of
            // throwing a SyntaxError.
            if (regExp.flags)
            {
                var matchSimpleAt =
                function (str, index)
                {
                    regExp.lastIndex = index;
                    var match = str.match(regExp);
                    if (match)
                        return match[0];
                };
                return matchSimpleAt;
            }
        }
        catch (error)
        { }
    }
    )() ||
    function (str, index)
    {
        for (var simple in SIMPLE)
        {
            var substr = str.substr(index, simple.length);
            if (substr === simple)
                return simple;
        }
    };

    assignNoEnum
    (
        Encoder.prototype,
        {
            $replaceCharByAtob: replaceCharByAtob,

            $replaceCharByCharCode: replaceCharByCharCode,

            $replaceCharByEscSeq: replaceCharByEscSeq,

            $replaceCharByUnescape: replaceCharByUnescape,

            $resolveCharInNativeFunction:
            function (char, offset, getPaddingEntries, paddingShifts)
            {
                var nativeFunctionInfo = this.nativeFunctionInfo;
                if (!nativeFunctionInfo)
                {
                    nativeFunctionInfo = this.findDefinition(NATIVE_FUNCTION_INFOS);
                    this.nativeFunctionInfo = nativeFunctionInfo;
                }
                var expr = nativeFunctionInfo.expr;
                var index = offset + nativeFunctionInfo.shift;
                var paddingEntries = getPaddingEntries(index);
                var solution = this.resolveCharInExpr(char, expr, index, paddingEntries, paddingShifts);
                return solution;
            },

            _replaceExpressUnit:
            function (unit, bond, unitIndices, maxLength, replacers)
            {
                var mod = unit.mod || '';
                var pmod = unit.pmod || '';
                var groupingRequired = bond && mod[0] === '+';
                var maxCoreLength =
                maxLength - (mod ? (groupingRequired ? 2 : 0) + mod.length : 0) - pmod.length;
                var ops = unit.ops;
                var opCount = ops.length;
                var primaryExprBondStrength =
                opCount || pmod ?
                BOND_STRENGTH_STRONG : bond || mod ? BOND_STRENGTH_WEAK : BOND_STRENGTH_NONE;
                var output =
                replacePrimaryExpr
                (this, unit, primaryExprBondStrength, unitIndices, maxCoreLength, replacers);
                if (output)
                {
                    for (var index = 0; index < opCount; ++index)
                    {
                        var op = ops[index];
                        var type = op.type;
                        if (type === 'call')
                        {
                            output += '()';
                            if (output.length > maxCoreLength)
                                return;
                        }
                        else
                        {
                            var opOutput;
                            var opUnitIndices = unitIndices.concat(index + 1);
                            var maxOpLength = maxCoreLength - output.length - 2;
                            var str = op.str;
                            if (str != null)
                            {
                                var strReplacer = replacers.string;
                                opOutput =
                                strReplacer(this, str, SCREW_NORMAL, opUnitIndices, maxOpLength);
                            }
                            else
                            {
                                opOutput =
                                this._replaceExpressUnit
                                (op, false, opUnitIndices, maxOpLength, replacers);
                            }
                            if (!opOutput)
                                return;
                            if (type === 'get')
                                output += '[' + opOutput + ']';
                            else
                                output += '(' + opOutput + ')';
                        }
                    }
                    output += pmod;
                    if (mod)
                    {
                        output = mod + output;
                        if (groupingRequired)
                            output = '(' + output + ')';
                    }
                }
                return output;
            },

            constantDefinitions: CONSTANTS,

            createCharDefaultSolution:
            function (char, charCode, atobOpt, charCodeOpt, escSeqOpt, unescapeOpt)
            {
                var solution;
                if (atobOpt && this.findDefinition(CONSTANTS.atob))
                {
                    solution =
                    resolveCharByDefaultMethod(this, char, charCode, replaceCharByAtob, 'atob');
                }
                else
                {
                    var solutions = [];
                    if (charCodeOpt)
                    {
                        solution =
                        resolveCharByDefaultMethod
                        (this, char, charCode, replaceCharByCharCode, 'char-code');
                        solutions.push(solution);
                    }
                    if (escSeqOpt)
                    {
                        solution =
                        resolveCharByDefaultMethod
                        (this, char, charCode, replaceCharByEscSeq, 'esc-seq');
                        solutions.push(solution);
                    }
                    if (unescapeOpt)
                    {
                        solution =
                        resolveCharByDefaultMethod
                        (this, char, charCode, replaceCharByUnescape, 'unescape');
                        solutions.push(solution);
                    }
                    solution = shortestOf(solutions);
                }
                return solution;
            },

            findDefinition:
            function (entries)
            {
                for (var entryIndex = entries.length; entryIndex--;)
                {
                    var entry = entries[entryIndex];
                    if (this.hasFeatures(entry.mask))
                        return entry.definition;
                }
            },

            getPaddingBlock:
            function (length)
            {
                var paddingBlock = R_PADDINGS[length];
                if (paddingBlock !== undefined)
                    return paddingBlock;
                throwSyntaxError(this, 'Undefined regular padding block with length ' + length);
            },

            hasFeatures:
            function (mask)
            {
                var included = maskIncludes(this.mask, mask);
                return included;
            },

            // The maximum value that can be safely used as the first group threshold of a ScrewBuffer.
            // "Safely" means such that the extreme decoding test is passed in all engines.
            // This value is typically limited by the free memory available on the stack, and since the
            // memory layout of the stack changes at runtime in an unstable way, the maximum safe value
            // cannot be determined exactly.
            // The lowest recorded value so far is 1844, measured in an Android Browser 4.2.2 running on
            // an Intel Atom emulator.
            // Internet Explorer on Windows Phone occasionally failed the extreme decoding test in a
            // non-reproducible manner, although the issue seems to be related to the output size rather
            // than the grouping threshold setting.
            maxGroupThreshold: 1800,

            replaceExpr:
            function (expr, optimize)
            {
                var unit = expressParseCached$1(expr);
                if (!unit || unit === true)
                    throwSyntaxError(this, 'Syntax error');
                var replacers = getReplacers(optimize);
                var replacement = this._replaceExpressUnit(unit, false, [], NaN, replacers);
                return replacement;
            },

            /**
             * Replaces a given string with equivalent JSFuck code.
             *
             * @function Encoder#replaceString
             *
             * @param {string} str
             * The string to replace.
             *
             * @param {object} [options={ }]
             * An optional object specifying replacement options.
             *
             * @param {SimpleSolution} [options.firstSolution]
             * An optional solution to be prepended to the replacement string.
             *
             * @param {number} [options.maxLength=(NaN)]
             * The maximum length of the replacement expression.
             *
             * If the replacement expression exceeds the specified length, the return value is
             * `undefined`.
             *
             * If this parameter is `NaN`, then no length limit is imposed.
             *
             * @param {boolean|object<string, boolean>} [options.optimize=false]
             * Specifies which optimizations should be attempted.
             *
             * Optimizations may reduce the length of the replacement string, but they also reduce the
             * performance and may lead to unwanted circular dependencies when resolving definitions.
             *
             * This parameter can be set to a boolean value in order to turn all optimizations on
             * (`true`) or off (`false`).
             * In order to turn specific optimizations on or off, specify an object that maps
             * optimization names with the suffix "Opt" to a boolean setting.
             * Currently supported settings are `commaOpt`, `complexOpt` and `toStringOpt`.
             * When an object is specified, undefined optimization settings default to `true`.
             *
             * @param {number} [options.screwMode=SCREW_NORMAL]
             * Specifies how the replacement will be used.
             *
             * <dl>
             *
             * <dt><code>SCREW_NORMAL</code></dt>
             * <dd>
             * Generates code suitable for being used as a function argument or indexer.
             * The generated replacement is not guaranteed to evaluate to a string but will have the
             * string representation specified by the input string.
             * </dd>
             *
             * <dt><code>SCREW_AS_STRING</code></dt>
             * <dd>
             * Generates code suitable for being used as a standalone string or as the start of a
             * concatenated string or as an argument to a function that expects a string.
             * </dd>
             *
             * <dt><code>SCREW_AS_BONDED_STRING</code></dt>
             * <dd>
             * Generates code suitable for being used with any unary operators, as a property access
             * target, or in concatenation with any expression.
             * </dd>
             *
             * </dl>
             *
             * @returns {string|undefined}
             * The replacement string or `undefined`.
             */

            replaceString:
            function (str, options)
            {
                options = options || { };
                var optimizerList = this.getOptimizerList(str, options.optimize);
                var screwMode = options.screwMode || SCREW_NORMAL;
                var buffer = new ScrewBuffer(screwMode, this.maxGroupThreshold, optimizerList);
                var firstSolution = options.firstSolution;
                var maxLength = options.maxLength;
                if (firstSolution)
                {
                    buffer.append(firstSolution);
                    if (buffer.length > maxLength)
                        return;
                }
                var length = str.length;
                for (var index = 0; index < length;)
                {
                    var solution;
                    var simple = matchSimpleAt(str, index);
                    if (simple)
                    {
                        index += simple.length;
                        solution = SIMPLE[simple];
                    }
                    else
                    {
                        var char = str[index++];
                        solution = this.resolveCharacter(char);
                    }
                    if (!buffer.append(solution) || buffer.length > maxLength)
                        return;
                }
                var replacement = _String(buffer);
                if (!(replacement.length > maxLength))
                    return replacement;
            },

            resolve:
            function (definition, source, defaultSolutionType)
            {
                var solution;
                var type = typeof definition;
                if (type === 'function')
                    solution = definition.call(this, source);
                else
                {
                    var expr;
                    var solutionType;
                    var optimize;
                    if (type === 'object')
                    {
                        expr            = definition.expr;
                        solutionType    = definition.solutionType;
                        optimize        = definition.optimize;
                    }
                    else
                        expr = definition;
                    var replacement = this.replaceExpr(expr, optimize);
                    if (solutionType == null)
                    {
                        solutionType =
                        defaultSolutionType != null ? defaultSolutionType : SolutionType.STRING;
                    }
                    solution = new SimpleSolution(source, replacement, solutionType);
                }
                return solution;
            },

            resolveCharInExpr:
            function (char, expr, index, paddingEntries, paddingShifts)
            {
                if (!paddingEntries)
                    throwSyntaxError(this, 'Missing padding entries for index ' + index);
                var padding = this.findDefinition(paddingEntries);
                var paddingBlock;
                var shiftedIndex;
                if (typeof padding === 'number')
                {
                    var paddingShift = this.findDefinition(paddingShifts);
                    paddingBlock = this.getPaddingBlock(padding);
                    shiftedIndex = index + padding + paddingShift;
                }
                else
                {
                    paddingBlock = padding.block;
                    shiftedIndex = padding.shiftedIndex;
                }
                var fullExpr = '(' + paddingBlock + '+' + expr + ')[' + shiftedIndex + ']';
                var replacement = this.replaceExpr(fullExpr);
                var solution = new SimpleSolution(char, replacement, SolutionType.STRING);
                return solution;
            },

            resolveCharacter:
            function (char)
            {
                var charCache = this.charCache;
                var solution = charCache[char];
                if (solution === undefined)
                {
                    callResolver
                    (
                        this,
                        _JSON_stringify(char),
                        function ()
                        {
                            var entries = CHARACTERS[char];
                            if (!entries || _Array_isArray(entries))
                            {
                                if (entries)
                                    solution = findOptimalSolution(this, char, entries);
                                if (!solution)
                                    solution = defaultResolveCharacter(this, char);
                            }
                            else
                            {
                                solution = STATIC_ENCODER.resolve(entries, char);
                                solution.entryCode = 'static';
                                charCache = STATIC_CHAR_CACHE;
                            }
                            charCache[char] = solution;
                        }
                    );
                }
                return solution;
            },

            resolveConstant:
            function (constant)
            {
                var constCache = this.constCache;
                var solution = constCache[constant];
                if (solution === undefined)
                {
                    callResolver
                    (
                        this,
                        constant,
                        function ()
                        {
                            var entries = this.constantDefinitions[constant];
                            if (_Array_isArray(entries))
                            {
                                solution =
                                findOptimalSolution(this, constant, entries, SolutionType.OBJECT);
                            }
                            else
                            {
                                solution =
                                STATIC_ENCODER.resolve(entries, undefined, SolutionType.OBJECT);
                                constCache = STATIC_CONST_CACHE;
                            }
                            constCache[constant] = solution;
                        }
                    );
                }
                return solution;
            },
        }
    );

    initStaticEncoder(STATIC_ENCODER);

    function createFigurator(startValues, joiner)
    {
        function createFigure(value, sortLength)
        {
            var figure = _Object(value);
            figure.sortLength = sortLength;
            return figure;
        }

        function createPart(value, sortLength, isJoiner)
        {
            var part = createFigure(value, sortLength);
            part.isJoiner = isJoiner;
            return part;
        }

        function figurator(index)
        {
            while (figures.length <= index)
            {
                appendableParts.forEach(growFigures);
                var newFigures = figureList[currentSortLength++];
                if (newFigures)
                    _Array_prototype_push.apply(figures, newFigures);
            }
            var figure = figures[index];
            return figure;
        }

        function growFigures(part)
        {
            var oldFigureSortLength = currentSortLength - part.sortLength;
            var oldFigures = figureList[oldFigureSortLength];
            if (oldFigures)
            {
                oldFigures.forEach
                (
                    function (oldFigure)
                    {
                        var newValue = oldFigure + part;
                        pushFigure(newValue, currentSortLength, part);
                    }
                );
            }
        }

        function pushFigure(value, sortLength, part)
        {
            if (!(value in usedValueSet))
            {
                usedValueSet[value] = null;
                var figures = figureList[sortLength] || (figureList[sortLength] = []);
                var figure = createFigure(value, sortLength);
                figures.push(figure);
                part.isJoiner = false;
                for (;; ++joinerIndex)
                {
                    var joinerPart = PARTS[joinerIndex];
                    if (!joinerPart)
                        break;
                    if (joinerPart.isJoiner)
                    {
                        figure.joiner = joinerPart.valueOf();
                        break;
                    }
                }
            }
        }

        var PARTS =
        [
            createPart('',          0,                          false),
            createPart('false',     4,                          true),
            createPart('true',      5,                          true),
            createPart('0',         APPEND_LENGTH_OF_DIGIT_0,   true),
            createPart('undefined', 7,                          true),
            createPart('1',         8,                          true),
            createPart('NaN',       9,                          true),
            createPart('2',         12,                         true),
            createPart('f',         14,                         false),
            createPart('t',         15,                         false),
            createPart('a',         16,                         false),
            createPart('3',         17,                         true),
            createPart('N',         17,                         false),
            createPart('r',         17,                         false),
            createPart('u',         17,                         false),
            createPart('n',         19,                         false),
            createPart('l',         20,                         false),
            createPart('4',         22,                         true),
            createPart('d',         23,                         false),
            createPart('s',         25,                         false),
            createPart('e',         APPEND_LENGTH_OF_SMALL_E,   false),
            createPart('5',         27,                         true),
            createPart('i',         28,                         false),
            createPart('6',         32,                         true),
            createPart('7',         37,                         true),
            createPart('8',         42,                         true),
            createPart('9',         47,                         true),
        ];

        var currentSortLength = 0;
        var figureList = [];
        var figures = [];
        var joinerIndex = 0;
        var usedValueSet = createEmpty();
        var appendableParts =
        PARTS.filter
        (
            function (part)
            {
                var value = part.valueOf();
                if (startValues.indexOf(value) >= 0)
                    pushFigure(value, part.sortLength, part);
                else if (value !== joiner)
                    return true;
            }
        );

        return figurator;
    }

    var FALSE_FREE_DELIMITER = { joiner: 'false', separator: 'false' };
    var FALSE_TRUE_DELIMITER = { joiner: '', separator: 'Function("return/(?=false|true)/")()' };

    var REPLACERS =
    {
        identifier:
        function (encoder, identifier, bondStrength, unitIndices, maxLength)
        {
            var unitPath = getUnitPath(unitIndices);
            var replacement =
            encodeAndWrapText(encoder, 'return ' + identifier, wrapWithCall, unitPath, maxLength);
            return replacement;
        },
        string:
        function (encoder, str, screwMode, unitIndices, maxLength)
        {
            var unitPath = getUnitPath(unitIndices);
            var replacement = encodeText(encoder, str, screwMode, unitPath, maxLength);
            return replacement;
        },
    };

    var STRATEGIES;

    function callStrategies(encoder, input, options, strategyNames, unitPath)
    {
        var output;
        var inputLength = input.length;
        var perfLog = encoder.perfLog;
        var perfInfoList = [];
        perfInfoList.name = unitPath;
        perfInfoList.inputLength = inputLength;
        perfLog.push(perfInfoList);
        var inputData = _Object(input);
        _Object_keys(options).forEach
        (
            function (optName)
            {
                inputData[optName] = options[optName];
            }
        );
        var usedPerfInfo;
        strategyNames.forEach
        (
            function (strategyName)
            {
                var strategy = STRATEGIES[strategyName];
                var perfInfo = { strategyName: strategyName };
                var perfStatus;
                if (inputLength < strategy.minInputLength)
                    perfStatus = 'skipped';
                else if (!encoder.hasFeatures(strategy.mask))
                    perfStatus = 'unsuited';
                else
                {
                    encoder.perfLog = perfInfo.perfLog = [];
                    var before = new _Date();
                    var maxLength = output != null ? output.length : NaN;
                    var newOutput = strategy.call(encoder, inputData, maxLength);
                    var time = new _Date() - before;
                    encoder.perfLog = perfLog;
                    perfInfo.time = time;
                    if (newOutput != null)
                    {
                        output = newOutput;
                        if (usedPerfInfo)
                            usedPerfInfo.status = 'superseded';
                        usedPerfInfo = perfInfo;
                        perfInfo.outputLength = newOutput.length;
                        perfStatus = 'used';
                    }
                    else
                        perfStatus = 'incomplete';
                }
                perfInfo.status = perfStatus;
                perfInfoList.push(perfInfo);
            }
        );
        return output;
    }

    function createCharKeyArrayString
    (encoder, input, charMap, insertions, substitutions, forceString, maxLength)
    {
        var charKeyArray =
        _Array_prototype_map.call
        (
            input,
            function (char)
            {
                var charKey = charMap[char];
                return charKey;
            }
        );
        var charKeyArrayStr =
        encoder.replaceStringArray(charKeyArray, insertions, substitutions, forceString, maxLength);
        return charKeyArrayStr;
    }

    function createJSFuckArrayMapping(encoder, arrayStr, mapper, legend)
    {
        var result =
        arrayStr + '[' + encoder.replaceString('map', { optimize: true }) + '](' +
        encoder.replaceExpr(mapper, true) + '(' + legend + '))';
        return result;
    }

    function createLongStrCodesOutput(encoder, strCodeArrayStr, fromCharCode, arg)
    {
        var formatter = encoder.findDefinition(FROM_CHAR_CODE_CALLBACK_FORMATTER);
        var formatterExpr = formatter(fromCharCode, arg);
        var output =
        strCodeArrayStr + '[' + encoder.replaceString('map', { optimize: true }) + '](' +
        encoder.replaceExpr('Function("return ' + formatterExpr + '")()', true) + ')[' +
        encoder.replaceString('join') + ']([])';
        return output;
    }

    function createReindexMap(count, radix, amendingCount, coerceToInt)
    {
        function getSortLength()
        {
            var length = 0;
            _Array_prototype_forEach.call
            (
                str,
                function (digit)
                {
                    length += digitAppendLengths[digit];
                }
            );
            return length;
        }

        var index;
        var digitAppendLengths = APPEND_LENGTH_OF_DIGITS.slice(0, radix);
        var regExp;
        var replacer;
        if (amendingCount)
        {
            var firstDigit = radix - amendingCount;
            var pattern = '[';
            for (index = 0; index < amendingCount; ++index)
            {
                var digit = firstDigit + index;
                digitAppendLengths[digit] = SIMPLE[AMENDINGS[index]].appendLength;
                pattern += digit;
            }
            pattern += ']';
            regExp = _RegExp(pattern, 'g');
            replacer =
            function (match)
            {
                return AMENDINGS[match - firstDigit];
            };
        }
        var range = [];
        for (index = 0; index < count; ++index)
        {
            var str = coerceToInt && !index ? '' : index.toString(radix);
            var reindexStr = amendingCount ? str.replace(regExp, replacer) : str;
            var reindex = range[index] = _Object(reindexStr);
            reindex.sortLength = getSortLength();
            reindex.index = index;
        }
        range.sort
        (
            function (reindex1, reindex2)
            {
                var result =
                reindex1.sortLength - reindex2.sortLength || reindex1.index - reindex2.index;
                return result;
            }
        );
        return range;
    }

    function createStrCodesEncoding(encoder, input, fromCharCode, splitter, radix, maxLength)
    {
        var strCodeArray = splitter(input, radix);
        var strCodeArrayStr = encoder.replaceFalseFreeArray(strCodeArray, maxLength);
        if (strCodeArrayStr)
        {
            var output;
            if (radix)
            {
                output =
                createLongStrCodesOutput
                (encoder, strCodeArrayStr, fromCharCode, 'parseInt(undefined,' + radix + ')');
            }
            else
            {
                var long = strCodeArray.length > encoder.maxDecodableArgs;
                if (long)
                {
                    output =
                    createLongStrCodesOutput(encoder, strCodeArrayStr, fromCharCode, 'undefined');
                }
                else
                {
                    var returnString = encoder.findDefinition(OPTIMAL_RETURN_STRING);
                    var str = returnString + '.' + fromCharCode + '(';
                    output =
                    encoder.resolveConstant('Function').replacement +
                    '(' +
                    encoder.replaceString(str, { optimize: true }) +
                    '+' +
                    strCodeArrayStr +
                    '+' +
                    encoder.resolveCharacter(')').replacement +
                    ')()';
                }
            }
            if (!(output.length > maxLength))
                return output;
        }
    }

    function encodeAndWrapText(encoder, input, wrapper, unitPath, maxLength)
    {
        var output;
        if (!wrapper || input)
        {
            var screwMode = !wrapper || wrapper.forceString ? SCREW_AS_STRING : SCREW_NORMAL;
            output = encodeText(encoder, input, screwMode, unitPath, maxLength);
            if (output == null)
                return;
        }
        else
            output = '';
        if (wrapper)
            output = wrapper.call(encoder, output);
        if (!(output.length > maxLength))
            return output;
    }

    function encodeByDblDict
    (
        encoder,
        initMinCharIndexArrayStrLength,
        figurator,
        getFigureLegendInsertions,
        keyFigureArrayInsertions,
        inputData,
        maxLength
    )
    {
        var input = inputData.valueOf();
        var freqList = getFrequencyList(inputData);
        var charMap = createEmpty();
        var minCharIndexArrayStrLength = initMinCharIndexArrayStrLength(input);
        var figures =
        freqList.map
        (
            function (freq, index)
            {
                var figure = figurator(index);
                charMap[freq.char] = figure;
                minCharIndexArrayStrLength += freq.count * figure.sortLength;
                return figure;
            }
        );
        var dictChars =
        freqList.map
        (
            function (freq)
            {
                return freq.char;
            }
        );
        var legend = encodeDictLegend(encoder, dictChars, maxLength - minCharIndexArrayStrLength);
        if (!legend)
            return;
        var figureLegendInsertions =
        encoder.callGetFigureLegendInsertions(getFigureLegendInsertions, figurator, figures);
        var figureMaxLength = maxLength - legend.length;
        var figureLegend =
        encoder.replaceStringArray
        (figures, figureLegendInsertions, null, true, figureMaxLength - minCharIndexArrayStrLength);
        if (!figureLegend)
            return;
        var keyFigureArrayStr =
        createCharKeyArrayString
        (
            encoder,
            input,
            charMap,
            keyFigureArrayInsertions,
            null,
            true,
            figureMaxLength - figureLegend.length
        );
        if (!keyFigureArrayStr)
            return;
        var formatter = encoder.findDefinition(MAPPER_FORMATTER);
        var argName = 'undefined';
        var accessor = '.indexOf(' + argName + ')';
        var mapper = formatter(argName, accessor);
        var charIndexArrayStr =
        createJSFuckArrayMapping(encoder, keyFigureArrayStr, mapper, figureLegend);
        var output = encoder.createDictEncoding(legend, charIndexArrayStr, maxLength);
        return output;
    }

    function encodeDictLegend(encoder, dictChars, maxLength)
    {
        if (!(maxLength < 0))
        {
            var input = dictChars.join('');
            var output =
            callStrategies
            (
                encoder,
                input,
                { screwMode: SCREW_AS_STRING },
                ['byCodePointsRadix4', 'byCharCodesRadix4', 'byCodePoints', 'byCharCodes', 'plain'],
                'legend'
            );
            if (output && !(output.length > maxLength))
                return output;
        }
    }

    function encodeText(encoder, input, screwMode, unitPath, maxLength)
    {
        var output =
        callStrategies
        (
            encoder,
            input,
            { screwMode: screwMode },
            [
                'byDenseFigures',
                'bySparseFigures',
                'byDictRadix5AmendedBy3',
                'byDictRadix4AmendedBy2',
                'byDictRadix4AmendedBy1',
                'byDictRadix5',
                'byDictRadix3AmendedBy1',
                'byDictRadix4',
                'byDict',
                'byCodePointsRadix4',
                'byCharCodesRadix4',
                'byCodePoints',
                'byCharCodes',
                'plain',
            ],
            unitPath
        );
        if (output != null && !(output.length > maxLength))
            return output;
    }

    function getDenseFigureLegendInsertions(figurator, figures)
    {
        var insertions = [FALSE_TRUE_DELIMITER];
        var lastFigure = figurator(figures.length - 1);
        var joiner = lastFigure.joiner;
        if (joiner != null)
            insertions.push({ joiner: joiner, separator: joiner });
        return insertions;
    }

    function getFrequencyList(inputData)
    {
        var freqList = inputData.freqList;
        if (!freqList)
        {
            var charMap = createEmpty();
            _Array_prototype_forEach.call
            (
                inputData,
                function (char)
                {
                    (
                        charMap[char] ||
                        (charMap[char] = { char: char, charCode: char.charCodeAt(), count: 0 })
                    )
                    .count++;
                }
            );
            var charList = _Object_keys(charMap);
            inputData.freqList =
            freqList =
            charList.map
            (
                function (char)
                {
                    var freq = charMap[char];
                    return freq;
                }
            )
            .sort
            (
                function (freq1, freq2)
                {
                    var diff = freq2.count - freq1.count || freq1.charCode - freq2.charCode;
                    return diff;
                }
            );
        }
        return freqList;
    }

    function getSparseFigureLegendInsertions()
    {
        var insertions = [FALSE_FREE_DELIMITER];
        return insertions;
    }

    // The unit path consists of the string of colon-separated unit indices.
    function getUnitPath(unitIndices)
    {
        var unitPath = unitIndices.length ? unitIndices.join(':') : '0';
        return unitPath;
    }

    function initMinFalseFreeCharIndexArrayStrLength(input)
    {
        var minCharIndexArrayStrLength = _Math_max((input.length - 1) * APPEND_LENGTH_OF_FALSE - 3, 0);
        return minCharIndexArrayStrLength;
    }

    function initMinFalseTrueCharIndexArrayStrLength()
    {
        return -1;
    }

    function splitIntoCharCodes(str, radix)
    {
        var cache = createEmpty();
        var strCodes =
        _Array_prototype_map.call
        (
            str,
            function (char)
            {
                var strCode = cache[char];
                if (strCode == null)
                    strCode = cache[char] = char.charCodeAt().toString(radix);
                return strCode;
            }
        );
        return strCodes;
    }

    function splitIntoCodePoints(str, radix)
    {
        var cache = createEmpty();
        var chars = str.match(/[\ud800-\udbff][\udc00-\udfff]|[^]/g);
        var strCodes =
        chars.map
        (
            function (char)
            {
                var strCode = cache[char];
                if (strCode == null)
                {
                    if (char.length === 1)
                        strCode = char.charCodeAt().toString(radix);
                    else
                    {
                        var highSurrogatePart   = char.charCodeAt(0) - 0xd800 << 10;
                        var lowSurrogatePart    = char.charCodeAt(1) - 0xdc00;
                        strCode = (highSurrogatePart + lowSurrogatePart + 0x10000).toString(radix);
                    }
                    cache[char] = strCode;
                }
                return strCode;
            }
        );
        return strCodes;
    }

    function undefinedAsString(replacement)
    {
        if (replacement === '[][[]]')
            replacement += '+[]';
        return replacement;
    }

    function wrapWithCall(str)
    {
        var output = this.resolveConstant('Function').replacement + '(' + str + ')()';
        return output;
    }

    wrapWithCall.forceString = false;

    function wrapWithEval(str)
    {
        var output = this.replaceExpr('Function("return eval")()') + '(' + str + ')';
        return output;
    }

    wrapWithEval.forceString = true;

    var falseFreeFigurator = createFigurator([''], 'false');
    var falseTrueFigurator = createFigurator(['false', 'true'], '');

    (function ()
    {
        function defineStrategy(strategy, minInputLength, expressionMode, featureObj)
        {
            strategy.minInputLength = minInputLength;
            if (expressionMode === undefined)
                expressionMode = false;
            strategy.expressionMode = expressionMode;
            if (featureObj === undefined)
                featureObj = Feature.DEFAULT;
            strategy.mask = featureObj.mask;
            return strategy;
        }

        STRATEGIES =
        {
            /* -------------------------------------------------------------------------------------- *\

            Encodes "NINE" as:

            Function("return String.fromCharCode(" + [78, 73, 78, 69] + ")")()

            (short version)

            Or:

            [78, 73, 78, 69].map(Function(
            "return function(undefined){return String.fromCharCode(undefined)}")()).join([])

            (long version)

            \* -------------------------------------------------------------------------------------- */

            byCharCodes:
            defineStrategy
            (
                function (inputData, maxLength)
                {
                    var input = inputData.valueOf();
                    var output = this.encodeByCharCodes(input, undefined, maxLength);
                    return output;
                },
                2
            ),

            /* -------------------------------------------------------------------------------------- *\

            Encodes "NINE" as:

            [1032, 1021, 1032, 1011].map(Function(
            "return function(undefined){return String.fromCharCode(parseInt(undefined,4))}")()).join([])

            \* -------------------------------------------------------------------------------------- */

            byCharCodesRadix4:
            defineStrategy
            (
                function (inputData, maxLength)
                {
                    var input = inputData.valueOf();
                    var output = this.encodeByCharCodes(input, 4, maxLength);
                    return output;
                },
                25
            ),

            /* -------------------------------------------------------------------------------------- *\

            Like byCharCodes, but uses String.fromCodePoint instead of String.fromCharCode and treats
            surrogate pairs as one character.
            Requires feature FROM_CODE_POINT.

            \* -------------------------------------------------------------------------------------- */

            byCodePoints:
            defineStrategy
            (
                function (inputData, maxLength)
                {
                    var input = inputData.valueOf();
                    var output = this.encodeByCodePoints(input, undefined, maxLength);
                    return output;
                },
                2,
                undefined,
                Feature.FROM_CODE_POINT
            ),

            /* -------------------------------------------------------------------------------------- *\

            Like byCharCodesRadix4, but uses String.fromCodePoint instead of String.fromCharCode and
            treats surrogate pairs as one character.
            Requires feature FROM_CODE_POINT.

            \* -------------------------------------------------------------------------------------- */

            byCodePointsRadix4:
            defineStrategy
            (
                function (inputData, maxLength)
                {
                    var input = inputData.valueOf();
                    var output = this.encodeByCodePoints(input, 4, maxLength);
                    return output;
                },
                38,
                undefined,
                Feature.FROM_CODE_POINT
            ),

            /* -------------------------------------------------------------------------------------- *\

            Encodes "NINE" as:

            ["false", "false0", "false", "true"].map(Function(
            "return function(undefined){return this.indexOf(undefined)}")().bind(["false", "true",
            "false0"])).map("".charAt.bind("NEI")).join([])

            \* -------------------------------------------------------------------------------------- */

            byDenseFigures:
            defineStrategy
            (
                function (inputData, maxLength)
                {
                    var output = this.encodeByDenseFigures(inputData, maxLength);
                    return output;
                },
                1888
            ),

            /* -------------------------------------------------------------------------------------- *\

            Encodes "NINE" as:

            "false2falsefalse1".split(false).map("".charAt.bind("NEI")).join([])

            (split strategy)

            Or:

            [0].concat(2).concat(0).concat(1).map("".charAt.bind("NEI")).join([])

            (concat strategy)

            \* -------------------------------------------------------------------------------------- */

            byDict:
            defineStrategy
            (
                function (inputData, maxLength)
                {
                    var output = this.encodeByDict(inputData, undefined, undefined, maxLength);
                    return output;
                },
                2
            ),

            /* -------------------------------------------------------------------------------------- *\

            Encodes "THREE" as:

            "10false0false1falsetruefalsetrue".split(true).join(2).split(false).map(Function(
            "return function(undefined){return this[parseInt(undefined,3)]}")().bind("HRET")).join([])

            (simple)

            Or:

            "10falsetruefalse1falsefalse".split(true).join(2).split(false).map(Function(
            "return function(undefined){return this[parseInt(+undefined,3)]}")().bind("ERHT")).join([])

            (with coercion)

            \* -------------------------------------------------------------------------------------- */

            byDictRadix3AmendedBy1:
            defineStrategy
            (
                function (inputData, maxLength)
                {
                    var output = this.encodeByDict(inputData, 3, 1, maxLength);
                    return output;
                },
                153
            ),

            /* -------------------------------------------------------------------------------------- *\

            Encodes "TWELVE" as:

            "2false3false0false1false10false0".split(false).map(Function(
            "return function(undefined){return this[parseInt(undefined,4)]}")().bind("ELTWV")).join([])

            (split strategy)

            Or:

            "2false3falsefalse1false10falsefalse".split(false).map(Function(
            "return function(undefined){return this[parseInt(+undefined,4)]}")().bind("ELTWV")).join([])

            (split strategy, with coercion)

            Or:

            [2].concat(3).concat(0).concat(1).concat("10").concat(0).map(Function(
            "return function(undefined){return this[parseInt(undefined,4)]}")().bind("ELTWV")).join([])

            (concat strategy)

            \* -------------------------------------------------------------------------------------- */

            byDictRadix4:
            defineStrategy
            (
                function (inputData, maxLength)
                {
                    var output = this.encodeByDict(inputData, 4, 0, maxLength);
                    return output;
                },
                160
            ),

            /* -------------------------------------------------------------------------------------- *\

            Encodes "TWELVE" as:

            "1false10falsetruefalse0false2falsetrue".split(true).join(3).split(false).map(Function(
            "return function(undefined){return this[parseInt(undefined,4)]}")().bind("LTVEW")).join([])

            (simple)

            Or:

            "1false10falsefalsetruefalse2false".split(true).join(3).split(false).map(Function(
            "return function(undefined){return this[parseInt(+undefined,4)]}")().bind("ETVLW")).join([])

            (with coercion)

            \* -------------------------------------------------------------------------------------- */

            byDictRadix4AmendedBy1:
            defineStrategy
            (
                function (inputData, maxLength)
                {
                    var output = this.encodeByDict(inputData, 4, 1, maxLength);
                    return output;
                },
                218
            ),

            /* -------------------------------------------------------------------------------------- *\

            Encodes "TWELVE" as:

            "undefinedfalse10falsetruefalse0false1falsetrue".split(true).join(2).split("undefined").join
            (3).split(false).map(Function(
            "return function(undefined){return this[parseInt(undefined,4)]}")().bind("LVETW")).join([])

            (simple)

            Or:

            "undefinedfalse10falsefalsetruefalse1false".split(true).join(2).split("undefined").join(3).
            split(false).map(Function("return function(undefined){return this[parseInt(+undefined,4)]}")
            ().bind("EVLTW")).join([])

            (with coercion)

            \* -------------------------------------------------------------------------------------- */

            byDictRadix4AmendedBy2:
            defineStrategy
            (
                function (inputData, maxLength)
                {
                    var output = this.encodeByDict(inputData, 4, 2, maxLength);
                    return output;
                },
                279
            ),

            /* -------------------------------------------------------------------------------------- *\

            Encodes "SIXTEEN" as:

            "10false1false4false3false0false0false2".split(false).map(Function(
            "return function(undefined){return this[parseInt(undefined,5)]}")().bind("EINTXS")).join([])

            (split strategy)

            Or:

            "10false1false4false3falsefalsefalse2".split(false).map(Function(
            "return function(undefined){return this[parseInt(+undefined,5)]}")().bind("EINTXS")).join([]
            )

            (split strategy, with coercion)

            Or:

            ["10"].concat(1).concat(4).concat(3).concat(0).concat(0).concat(2).map(Function(
            "return function(undefined){return this[parseInt(undefined,5)]}")().bind("EINTXS")).join([])

            (concat strategy)

            \* -------------------------------------------------------------------------------------- */

            byDictRadix5:
            defineStrategy
            (
                function (inputData, maxLength)
                {
                    var output = this.encodeByDict(inputData, 5, 0, maxLength);
                    return output;
                },
                223
            ),

            /* -------------------------------------------------------------------------------------- *\

            Encodes "SIXTEEN" as:

            "1false0false10falseNaNfalsetruefalsetruefalseundefined".split(true).join(2).split(
            "undefined").join(3).split(NaN).join(4).split(false).map(Function(
            "return function(undefined){return this[parseInt(undefined,5)]}")().bind("ISENTX")).join([])

            (simple)

            Or:

            "1falsetruefalse10falseNaNfalsefalsefalseundefined".split(true).join(2).split("undefined").
            join(3).split(NaN).join(4).split(false).map(Function(
            "return function(undefined){return this[parseInt(+undefined,5)]}")().bind("ESINTX")).join([]
            )

            (with coercion)

            \* -------------------------------------------------------------------------------------- */

            byDictRadix5AmendedBy3:
            defineStrategy
            (
                function (inputData, maxLength)
                {
                    var output = this.encodeByDict(inputData, 5, 3, maxLength);
                    return output;
                },
                602
            ),

            /* -------------------------------------------------------------------------------------- *\

            Encodes "NINE" as:

            ["", "0", "", "true"].map(Function(
            "return function(undefined){return this.indexOf(undefined)}")().bind(["", "true", "0"])).map
            ("".charAt.bind("NEI")).join([])

            \* -------------------------------------------------------------------------------------- */

            bySparseFigures:
            defineStrategy
            (
                function (inputData, maxLength)
                {
                    var output = this.encodeBySparseFigures(inputData, maxLength);
                    return output;
                },
                347
            ),

            /* -------------------------------------------------------------------------------------- *\

            Encodes any JavaScript expression recognized by the express parser.

            \* -------------------------------------------------------------------------------------- */

            express:
            defineStrategy
            (
                function (inputData, maxLength)
                {
                    var input = inputData.valueOf();
                    var output = this.encodeExpress(input, maxLength);
                    return output;
                },
                undefined,
                true
            ),

            /* -------------------------------------------------------------------------------------- *\

            Encodes any text as a string using only the mininal set of optimizations.

            \* -------------------------------------------------------------------------------------- */

            plain:
            defineStrategy
            (
                function (inputData, maxLength)
                {
                    var input = inputData.valueOf();
                    var options =
                    { maxLength: maxLength, optimize: true, screwMode: inputData.screwMode };
                    var output = this.replaceString(input, options);
                    return output;
                }
            ),

            /* -------------------------------------------------------------------------------------- *\

            Encodes any text by trying out all plausible strategies.

            \* -------------------------------------------------------------------------------------- */

            text:
            defineStrategy
            (
                function (inputData, maxLength)
                {
                    var input = inputData.valueOf();
                    var wrapper = inputData.wrapper;
                    var output = encodeAndWrapText(this, input, wrapper, undefined, maxLength);
                    return output;
                }
            ),
        };
    }
    )();

    assignNoEnum
    (
        Encoder.prototype,
        {
            callGetFigureLegendInsertions:
            function (getFigureLegendInsertions, figurator, figures)
            {
                var figureLegendInsertions = getFigureLegendInsertions(figurator, figures);
                return figureLegendInsertions;
            },

            createDictEncoding:
            function (legend, charIndexArrayStr, maxLength, radix, coerceToInt)
            {
                var mapper;
                if (radix)
                {
                    var formatter = this.findDefinition(MAPPER_FORMATTER);
                    var argName = this.findDefinition(OPTIMAL_ARG_NAME);
                    var parseIntArg = (coerceToInt ? '+' : '') + argName;
                    var accessor = '[parseInt(' + parseIntArg + ',' + radix + ')]';
                    mapper = formatter(argName, accessor);
                }
                else
                    mapper = '"".charAt.bind';
                var output =
                createJSFuckArrayMapping(this, charIndexArrayStr, mapper, legend) + '[' +
                this.replaceString('join') + ']([])';
                if (!(output.length > maxLength))
                    return output;
            },

            encodeByCharCodes:
            function (input, radix, maxLength)
            {
                var fromCharCode = this.findDefinition(FROM_CHAR_CODE);
                var output =
                createStrCodesEncoding(this, input, fromCharCode, splitIntoCharCodes, radix, maxLength);
                return output;
            },

            encodeByCodePoints:
            function (input, radix, maxLength)
            {
                var output =
                createStrCodesEncoding
                (this, input, 'fromCodePoint', splitIntoCodePoints, radix, maxLength);
                return output;
            },

            encodeByDenseFigures:
            function (inputData, maxLength)
            {
                var output =
                encodeByDblDict
                (
                    this,
                    initMinFalseTrueCharIndexArrayStrLength,
                    falseTrueFigurator,
                    getDenseFigureLegendInsertions,
                    [FALSE_TRUE_DELIMITER],
                    inputData,
                    maxLength
                );
                return output;
            },

            encodeByDict:
            function (inputData, radix, amendingCount, maxLength)
            {
                var input = inputData.valueOf();
                var freqList = getFrequencyList(inputData);
                var freqListLength = freqList.length;
                // Integer coercion is for free without a radix, otherwise it costs a replaced plus
                // sign.
                var coerceToInt =
                !radix ||
                freqListLength &&
                freqList[0].count * APPEND_LENGTH_OF_DIGIT_0 > APPEND_LENGTH_OF_PLUS_SIGN;
                var radixNum = radix || 10;
                var reindexMap = createReindexMap(freqListLength, radixNum, amendingCount, coerceToInt);
                var charMap = createEmpty();
                var minCharIndexArrayStrLength = initMinFalseFreeCharIndexArrayStrLength(input);
                var dictChars = [];
                freqList.forEach
                (
                    function (freq, index)
                    {
                        var reindex = reindexMap[index];
                        var char = freq.char;
                        charMap[char] = reindex;
                        minCharIndexArrayStrLength += freq.count * reindex.sortLength;
                        dictChars[reindex.index] = char;
                    }
                );
                var legend = encodeDictLegend(this, dictChars, maxLength - minCharIndexArrayStrLength);
                if (!legend)
                    return;
                if (amendingCount)
                {
                    var substitutions = [];
                    var firstDigit = radixNum - amendingCount;
                    for (var index = 0; index < amendingCount; ++index)
                    {
                        var separator = AMENDINGS[index];
                        var digit = firstDigit + index;
                        var joiner = _String(digit);
                        var substitution = { separator: separator, joiner: joiner };
                        substitutions.push(substitution);
                    }
                }
                var charIndexArrayStr =
                createCharKeyArrayString
                (
                    this,
                    input,
                    charMap,
                    [FALSE_FREE_DELIMITER],
                    substitutions,
                    false,
                    maxLength - legend.length
                );
                if (!charIndexArrayStr)
                    return;
                var output =
                this.createDictEncoding(legend, charIndexArrayStr, maxLength, radix, coerceToInt);
                return output;
            },

            encodeBySparseFigures:
            function (inputData, maxLength)
            {
                var output =
                encodeByDblDict
                (
                    this,
                    initMinFalseFreeCharIndexArrayStrLength,
                    falseFreeFigurator,
                    getSparseFigureLegendInsertions,
                    [FALSE_FREE_DELIMITER],
                    inputData,
                    maxLength
                );
                return output;
            },

            encodeExpress:
            function (input, maxLength)
            {
                var unit = expressParse(input);
                if (unit)
                {
                    var output;
                    if (unit === true)
                    {
                        if (!(maxLength < 0))
                            output = '';
                    }
                    else
                        output = this._replaceExpressUnit(unit, false, [], maxLength, REPLACERS);
                    return output;
                }
            },

            exec:
            function (input, wrapper, strategyNames, perfInfo)
            {
                var perfLog = this.perfLog = [];
                var output = callStrategies(this, input, { wrapper: wrapper }, strategyNames);
                if (perfInfo)
                    perfInfo.perfLog = perfLog;
                delete this.perfLog;
                if (output == null)
                    throw new _Error('Encoding failed');
                return output;
            },

            maxDecodableArgs: 65533, // Limit imposed by Internet Explorer.

            // Array elements may not contain the substring "false", because the value false could be
            // used as a separator in the encoding.
            replaceFalseFreeArray:
            function (array, maxLength)
            {
                var result =
                this.replaceStringArray(array, [FALSE_FREE_DELIMITER], null, false, maxLength);
                return result;
            },

            replaceJoinedArrayString:
            function (str, maxLength)
            {
                var options = { maxLength: maxLength, screwMode: SCREW_AS_BONDED_STRING };
                var replacement = replaceStaticString(str, options);
                return replacement;
            },

            /**
             * An object that exposes properties used to split a string into an array of strings or to
             * join array elements into a string.
             *
             * @typedef Delimiter
             *
             * @property {string} separator
             * An express-parsable expression used as an argument for `String.prototype.split` to split
             * a string into an array of strings.
             *
             * @property {number} joiner
             * The joiner can be any string. A joiner is inserted between adjacent strings in an array
             * in order to join them into a single string.
             */

            /**
             * Replaces a given array of strings with equivalent JSFuck code.
             *
             * Array elements may only contain characters with static definitions in their string
             * representations.
             *
             * @function Encoder#replaceStringArray
             *
             * @param {string[]} array
             * The string array to replace. Empty arrays are not supported.
             *
             * @param {Delimiter[]} insertions
             * An array of delimiters of which at most one will be used to compose a joined string and
             * split it into an array of strings.
             *
             * The encoder can pick an insertion and insert a joiner between any two adjacent elements
             * to mark the boundary between them. The separator is then used to split the concatenated
             * string back into its elements.
             *
             * @param {Delimiter[]|null} [substitutions]
             * An array of delimiters, specifying substitutions to be applied to the input elements.
             *
             * All substitutions are applied on each element of the input array, in the order they are
             * specified.
             *
             * Substitutions are expensive in two ways: they create additional overhead and prevent
             * certain optimizations for short arrays to be made. To allow all optimizations to be
             * performed, omit this argument or set it to null instead of specifying an empty array.
             *
             * @param {boolean} [forceString=false]
             * Indicates whether the elements in the replacement expression should evaluate to strings.
             *
             * If this argument is falsy, the elements in the replacement expression may not be equal to
             * those in the input array, but will have the same string representation.
             *
             * Regardless of this argument, the string representation of the value of the whole
             * replacement expression will be always the same as the string representation of the input
             * array.
             *
             * @param {number} [maxLength=(NaN)]
             * The maximum length of the replacement expression.
             *
             * If the replacement expression exceeds the specified length, the return value is
             * `undefined`.
             *
             * If this parameter is `NaN`, then no length limit is imposed.
             *
             * @returns {string|undefined}
             * The replacement string or `undefined`.
             */

            replaceStringArray:
            function (array, insertions, substitutions, forceString, maxLength)
            {
                var replacement;
                var count = array.length;
                // Don't even try the split approach for 3 or less elements if the concat approach can
                // be applied.
                if (substitutions || count > 3)
                {
                    var preReplacement =
                    function ()
                    {
                        // Length of the shortest string replacement "([]+[])".
                        var STRING_REPLACEMENT_MIN_LENGTH = 7;

                        // This is for the overhead of "[" + "](" + ")" plus the length of the shortest
                        // separator replacement "[]".
                        var SEPARATOR_MIN_OVERHEAD = 6;

                        // This is for the overhead of "[" + "](" + ")" plus the length of the shortest
                        // joiner replacement "[]".
                        var JOINER_MIN_OVERHEAD = 6;

                        var joinCount = substitutions ? substitutions.length : 0;
                        var splitCount = joinCount + 1;
                        var maxSplitReplacementLength =
                        (maxLength - STRING_REPLACEMENT_MIN_LENGTH) / splitCount -
                        SEPARATOR_MIN_OVERHEAD;
                        var splitReplacement =
                        this.replaceString
                        ('split', { maxLength: maxSplitReplacementLength, optimize: true });
                        if (!splitReplacement)
                            return;
                        var preReplacement = '';
                        if (joinCount)
                        {
                            var maxJoinReplacementLength =
                            (
                                maxLength - STRING_REPLACEMENT_MIN_LENGTH -
                                splitCount * (splitReplacement.length + SEPARATOR_MIN_OVERHEAD)
                            ) /
                            joinCount -
                            JOINER_MIN_OVERHEAD;
                            var joinReplacement =
                            this.replaceString('join', { maxLength: maxJoinReplacementLength });
                            if (!joinReplacement)
                                return;
                            substitutions.forEach
                            (
                                function (substitution)
                                {
                                    var separatorReplacement =
                                    undefinedAsString(this.replaceExpr(substitution.separator));
                                    var joinerReplacement =
                                    undefinedAsString(this.replaceString(substitution.joiner));
                                    preReplacement +=
                                    '[' + splitReplacement + '](' + separatorReplacement + ')[' +
                                    joinReplacement + '](' + joinerReplacement + ')';
                                },
                                this
                            );
                        }
                        preReplacement += '[' + splitReplacement + ']';
                        return preReplacement;
                    }
                    .call(this);
                }
                if (!substitutions && count > 1)
                {
                    var concatReplacement =
                    this.replaceString('concat', { maxLength: maxLength, optimize: true });
                }
                if (preReplacement)
                // Approach 1: (array[0] + joiner + array[1] + joiner + array[2]...).split(separator)
                {
                    // 2 is for the additional overhead of "(" + ")".
                    var maxBulkLength = maxLength - (preReplacement.length + 2);
                    var optimalStrReplacement;
                    var optimalSeparatorReplacement;
                    insertions.forEach
                    (
                        function (insertion)
                        {
                            var str = array.join(insertion.joiner);
                            var strReplacement = this.replaceJoinedArrayString(str, maxBulkLength);
                            if (!strReplacement)
                                return;
                            var separatorReplacement =
                            undefinedAsString(this.replaceExpr(insertion.separator));
                            var bulkLength = strReplacement.length + separatorReplacement.length;
                            if (!(bulkLength > maxBulkLength))
                            {
                                maxBulkLength = bulkLength;
                                optimalStrReplacement = strReplacement;
                                optimalSeparatorReplacement = separatorReplacement;
                            }
                        },
                        this
                    );
                    if (optimalStrReplacement)
                    {
                        replacement =
                        optimalStrReplacement + preReplacement + '(' + optimalSeparatorReplacement +
                        ')';
                        maxLength = replacement.length - 1;
                    }
                }
                if
                (
                    !substitutions &&
                    (
                        count <= 1 ||
                        concatReplacement &&
                        // 4 is the length of the shortest possible replacement "[[]]".
                        // 7 is the length of the shortest possible additional overhead for each
                        // following array element, as in "[" + "](+[])" or "[" + "](![])".
                        !(4 + (concatReplacement.length + 7) * (count - 1) > maxLength)
                    )
                )
                // Approach 2: [array[0]].concat(array[1]).concat(array[2])...
                {
                    var arrayReplacement;
                    var options = { screwMode: forceString ? SCREW_AS_STRING : SCREW_NORMAL };
                    if
                    (
                        !array.some
                        (
                            function (element)
                            {
                                var elementReplacement =
                                undefinedAsString(replaceStaticString(element, options));
                                if (arrayReplacement)
                                {
                                    if (elementReplacement === '[]')
                                        elementReplacement = '[[]]';
                                    arrayReplacement +=
                                    '[' + concatReplacement + '](' + elementReplacement + ')';
                                }
                                else
                                    arrayReplacement = '[' + elementReplacement + ']';
                                var result = arrayReplacement.length > maxLength;
                                return result;
                            }
                        )
                    )
                        replacement = arrayReplacement;
                }
                return replacement;
            },
        }
    );

    function appendLengthOf(solution)
    {
        if (solution.source === ',')
            return 0;
    }

    function countClusterableCommas(solutions, index)
    {
        var commaCount = 0;
        if (isSingleCharacterSolution(solutions[index]))
        {
            for
            (
                var end = solutions.length - 2;
                index < end &&
                solutions[++index].source === ',' &&
                isSingleCharacterSolution(solutions[++index]);
            )
                ++commaCount;
        }
        return commaCount;
    }

    function getCommaAppendLength(solutions, start, clusterLength)
    {
        var commaAppendLength = 0;
        for (var index = start + clusterLength; (index -= 2) > start;)
            commaAppendLength += solutions[index].appendLength;
        return commaAppendLength;
    }

    function isSingleCharacterSolution(solution)
    {
        var source = solution.source;
        var returnValue = source && source.length === 1;
        return returnValue;
    }

    function createCommaOptimizer (encoder)
    {
        function createClusterer(solutions, index, commaCount)
        {
            var bridgeSolutions = [];
            for (var limit = index + 2 * commaCount; index <= limit; index += 2)
            {
                var solution = solutions[index];
                bridgeSolutions.push(solution);
            }
            var clusterer =
            function ()
            {
                var bridgeChars =
                bridgeSolutions.map
                (
                    function (solution)
                    {
                        return solution.source;
                    }
                );
                var source = bridgeChars.join();
                var bridge = bridgeChars.join('');
                var bridgeReplacement =
                encoder.replaceString(bridge, { optimize: true, screwMode: SCREW_AS_STRING });
                var replacement = rampReplacement + '(' + bridgeReplacement + ')';
                var solution = new SimpleSolution(source, replacement, SolutionType.OBJECT);
                return solution;
            };
            return clusterer;
        }

        function optimizeSolutions(plan, solutions, bond, forceString)
        {
            function passFrom(index)
            {
                while (index < end)
                {
                    var commaCount = countClusterableCommas(solutions, index);
                    if (commaCount)
                    {
                        var clusterLength = 2 * commaCount + 1;
                        var saving =
                        getCommaAppendLength(solutions, index, clusterLength) - extraLength;
                        var singlePart = !index && clusterLength === solutionCount;
                        if (singlePart)
                        {
                            if (forceString)
                                saving -= 3; // "+[]"
                            else if (bond)
                                saving += 2; // "(" + ")"
                        }
                        if (index && solutions[index].isWeak)
                            saving += 2; // Save a pair of parentheses.
                        if (saving > 0)
                        {
                            var clusterer = createClusterer(solutions, index, commaCount);
                            plan.addCluster(index, clusterLength, clusterer, saving);
                        }
                        index += clusterLength + 1;
                    }
                    else
                        index += 2;
                }
            }

            var solutionCount = solutions.length;
            var end = solutionCount - 2;
            passFrom(0);
            passFrom(1);
        }

        var rampReplacement = encoder.replaceExpr('[][SLICE_OR_FLAT].call');
        // Adding 2 for "(" and ")" around the bridge.
        var extraLength = rampReplacement.length + 2;
        var optimizer = { appendLengthOf: appendLengthOf, optimizeSolutions: optimizeSolutions };
        return optimizer;
    }

    var BOND_EXTRA_LENGTH$1 = 2; // Extra length of bonding parentheses "(" and ")".
    var NOOP_OPTIMIZER = { appendLengthOf: noop, optimizeSolutions: noop };

    function createOptimizer$1
    (complex, complexSolution, charSet, optimizedCharAppendLength, appendLengthDiff)
    {
        function appendLengthOf(solution)
        {
            var source = solution.source;
            if (source != null && source in charSet)
                return optimizedCharAppendLength;
        }

        function clusterer()
        {
            return complexSolution;
        }

        function matchComplex(solutions, start)
        {
            for (var index = 0; index < complexLength; ++index)
            {
                var solutionIndex = start + index;
                var solution = solutions[solutionIndex];
                var complexChar = complex[index];
                if (solution.source !== complexChar)
                    return false;
            }
            return true;
        }

        function optimizeSolutions(plan, solutions, bond, forceString)
        {
            for (var index = 0, limit = solutions.length - complexLength; index <= limit; ++index)
            {
                if (matchComplex(solutions, index))
                {
                    var saving = appendLengthDiff;
                    if (!limit)
                    {
                        if (forceString && !complexSolution.isString)
                            saving -= APPEND_LENGTH_OF_EMPTY;
                        else if (bond)
                            saving += BOND_EXTRA_LENGTH$1;
                    }
                    if (saving > 0)
                        plan.addCluster(index, complexLength, clusterer, saving);
                }
            }
        }

        var complexLength = complex.length;
        var optimizer = { appendLengthOf: appendLengthOf, optimizeSolutions: optimizeSolutions };
        return optimizer;
    }

    function createCharSet(charInfos, index)
    {
        var charSet = createEmpty();
        var charInfo;
        while (charInfo = charInfos[index++])
            charSet[charInfo.char] = null;
        return charSet;
    }

    function createComplexOptimizer (encoder, complex, definition)
    {
        var optimizer;
        var discreteAppendLength = 0;
        var charMap = createEmpty();
        var charInfos = [];
        _Array_prototype_forEach.call
        (
            complex,
            function (char)
            {
                var charSolution = encoder.resolveCharacter(char);
                var charAppendLength = charSolution.appendLength;
                discreteAppendLength += charAppendLength;
                var charInfo = charMap[char];
                if (charInfo)
                    ++charInfo.count;
                else
                {
                    charInfo = charMap[char] =
                    { appendLength: charAppendLength, char: char, count: 1 };
                    charInfos.push(charInfo);
                }
            }
        );
        var complexSolution = encoder.resolve(definition, complex);
        var solutionAppendLength = complexSolution.appendLength;
        var appendLengthDiff = discreteAppendLength - solutionAppendLength;
        if (appendLengthDiff + BOND_EXTRA_LENGTH$1 > 0)
        {
            charInfos.sort
            (
                function (charInfo1, charInfo2)
                {
                    var result = charInfo1.appendLength - charInfo2.appendLength;
                    return result;
                }
            );
            var restLength = solutionAppendLength;
            var restCount = complex.length;
            for (var index = 0; restCount; ++index)
            {
                var charInfo = charInfos[index];
                var charAppendLength = charInfo.appendLength;
                if (charAppendLength * restCount > restLength)
                    break;
                var count = charInfo.count;
                restLength -= charAppendLength * count;
                restCount -= count;
            }
            var optimizedCharAppendLength = restLength / restCount | 0;
            var charSet = createCharSet(charInfos, index);
            optimizer =
            createOptimizer$1
            (complex, complexSolution, charSet, optimizedCharAppendLength, appendLengthDiff);
        }
        else
            optimizer = NOOP_OPTIMIZER;
        return optimizer;
    }

    // Optimized clusters take the form:

    var BOND_EXTRA_LENGTH = 2; // Extra length of bonding parentheses "(" and ")".
    var CLUSTER_EXTRA_LENGTHS = [];
    var DECIMAL_DIGIT_MAX_COUNTS = [];
    var MAX_RADIX = 36;
    var MAX_SAFE_INTEGER = 0x1fffffffffffff;
    var MIN_SOLUTION_SPAN = 2;
    var RADIX_REPLACEMENTS = [];

    function createOptimizer(toStringReplacement)
    {
        function appendLengthOf(solution)
        {
            var source = solution.source;
            if (source != null && /[bcghjkmopqvwxz]/.test(source))
            {
                var appendLength = appendLengthCache[source];
                if (appendLength == null)
                {
                    var minRadix = getMinRadix(source);
                    var clusterExtraLength = CLUSTER_EXTRA_LENGTHS[minRadix];
                    var decimalDigitMaxCount = DECIMAL_DIGIT_MAX_COUNTS[minRadix];
                    appendLength =
                    appendLengthCache[source] =
                    (clusterBaseLength + clusterExtraLength) / decimalDigitMaxCount | 0;
                }
                return appendLength;
            }
        }

        function createClusterer(decimalReplacement, radixReplacement)
        {
            var clusterer =
            function ()
            {
                var replacement =
                '(+(' + decimalReplacement + '))[' + toStringReplacement + '](' + radixReplacement +
                ')';
                var solution = new SimpleSolution(undefined, replacement, SolutionType.STRING);
                return solution;
            };
            return clusterer;
        }

        function isExpensive(solution)
        {
            var char = solution.source;
            var expensive = appendLengthCache[char] <= solution.appendLength;
            return expensive;
        }

        function optimizeCluster(plan, start, radix, discreteAppendLength, chars)
        {
            do
            {
                var decimal = _parseInt(chars, radix);
                if (decimal > MAX_SAFE_INTEGER)
                    return clusterAppendLength == null;
                var decimalReplacement = replaceMultiDigitNumber(decimal);
                // Adding 3 for leading "+(" and trailing ")".
                var decimalLength = decimalReplacement.length + 3;
                var radixReplacement = RADIX_REPLACEMENTS[radix];
                var radixLength = radixReplacement.length;
                var clusterAppendLength = clusterBaseLength + decimalLength + radixLength;
                var saving = discreteAppendLength - clusterAppendLength;
                if (saving > 0)
                {
                    var clusterer = createClusterer(decimalReplacement, radixReplacement);
                    plan.addCluster(start, chars.length, clusterer, saving);
                }
            }
            while (++radix <= MAX_RADIX);
        }

        function optimizeClusters(plan, solutions, start, maxSolutionSpan, bond)
        {
            var maxDigitChar = '';
            var discreteAppendLength = 0;
            var chars = '';
            var solutionSpan = 0;
            do
            {
                var solution = solutions[start + solutionSpan];
                discreteAppendLength += solution.appendLength;
                var char = solution.source;
                if (maxDigitChar < char)
                    maxDigitChar = char;
                chars += char;
                if (++solutionSpan >= MIN_SOLUTION_SPAN && discreteAppendLength > clusterBaseLength)
                {
                    var minRadix = getMinRadix(maxDigitChar);
                    // If a bonding is required, an integral cluster can save two additional characters
                    // by omitting a pair of parentheses.
                    if (bond && !start && solutionSpan === maxSolutionSpan)
                        discreteAppendLength += BOND_EXTRA_LENGTH;
                    var clusterTooLong =
                    optimizeCluster(plan, start, minRadix, discreteAppendLength, chars);
                    if (clusterTooLong)
                        break;
                }
            }
            while (solutionSpan < maxSolutionSpan);
        }

        function optimizeSequence(plan, solutions, start, end, bond)
        {
            for (;; ++start)
            {
                var maxSolutionSpan = end - start;
                if (solutions[start].source !== '0')
                    optimizeClusters(plan, solutions, start, maxSolutionSpan, bond);
                if (maxSolutionSpan <= MIN_SOLUTION_SPAN)
                    break;
            }
        }

        function optimizeSolutions(plan, solutions, bond)
        {
            var end;
            var expensive;
            for (var start = solutions.length; start > 0;)
            {
                var solution = solutions[--start];
                if (isClusterable(solution))
                {
                    if (!end)
                    {
                        end = start + 1;
                        expensive = false;
                    }
                    if (!expensive)
                        expensive = isExpensive(solution);
                    if (expensive && end - start >= MIN_SOLUTION_SPAN)
                        optimizeSequence(plan, solutions, start, end, bond);
                }
                else
                    end = undefined;
            }
        }

        // Adding 7 for "+(", ")[", "](" and ")".
        var clusterBaseLength = toStringReplacement.length + 7;
        var appendLengthCache = createEmpty();
        var optimizer = { appendLengthOf: appendLengthOf, optimizeSolutions: optimizeSolutions };
        return optimizer;
    }

    function getMinRadix(char)
    {
        var minRadix = _parseInt(char, MAX_RADIX) + 1;
        return minRadix;
    }

    function isClusterable(solution)
    {
        var char = solution.source;
        var clusterable = char != null && /[\da-z]/.test(char);
        return clusterable;
    }

    function createToStringOptimizer (encoder)
    {
        if (initialize)
        {
            initialize();
            initialize = null;
        }
        var toStringReplacement = encoder.resolveConstant('TO_STRING').replacement;
        var optimizer = createOptimizer(toStringReplacement);
        return optimizer;
    }

    var initialize =
    function ()
    {
        // DECIMAL_MIN_LENGTHS is indexed by decimalDigitMaxCount (the number of digits used to write
        // MAX_SAFE_INTEGER in base radix).
        // decimalDigitMaxCount may only range from 11 (for radix 36) to 15 (for radix 12).
        var DECIMAL_MIN_LENGTHS =
        [
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            48, // 1e10
            50, // 1e11
            54, // 1e12
            ,
            64, // 1e14
        ];

        var minLength = Infinity;
        for (var radix = MAX_RADIX; radix >= 12; --radix)
        {
            var replacement = replaceMultiDigitNumber(radix);
            var length = replacement.length;
            if (length < minLength)
                minLength = length;
            RADIX_REPLACEMENTS[radix] = replacement;
            var decimalDigitMaxCount = DECIMAL_DIGIT_MAX_COUNTS[radix] =
            MAX_SAFE_INTEGER.toString(radix).length;
            CLUSTER_EXTRA_LENGTHS[radix] = DECIMAL_MIN_LENGTHS[decimalDigitMaxCount] + minLength;
        }
    };

    function getOptimizerList(str, optimize)
    {
        var optimizerList = [];
        if (optimize)
        {
            var optimizeComma;
            var optimizeComplex;
            var optimizeToString;
            if (typeof optimize === 'object')
            {
                optimizeComma       = normalizeOption(optimize.commaOpt);
                optimizeComplex     = normalizeOption(optimize.complexOpt);
                optimizeToString    = normalizeOption(optimize.toStringOpt);
            }
            else
                optimizeComma = optimizeComplex = optimizeToString = true;
            var optimizers = this.optimizers;
            var optimizer;
            if (optimizeComma)
            {
                if (str.indexOf(',') >= 0)
                {
                    optimizer = optimizers.comma || (optimizers.comma = createCommaOptimizer(this));
                    optimizerList.push(optimizer);
                }
            }
            if (optimizeComplex)
            {
                var complexOptimizers = optimizers.complex;
                if (!complexOptimizers)
                    complexOptimizers = optimizers.complex = createEmpty();
                for (var complex in COMPLEX)
                {
                    var entry = COMPLEX[complex];
                    if (this.hasFeatures(entry.mask) && str.indexOf(complex) >= 0)
                    {
                        optimizer =
                        complexOptimizers[complex] ||
                        (
                            complexOptimizers[complex] =
                            createComplexOptimizer(this, complex, entry.definition)
                        );
                        optimizerList.push(optimizer);
                    }
                }
            }
            if (optimizeToString)
            {
                optimizer =
                optimizers.toString || (optimizers.toString = createToStringOptimizer(this));
                optimizerList.push(optimizer);
            }
        }
        return optimizerList;
    }

    function normalizeOption(inOpt)
    {
        var outOpt = inOpt === undefined || !!inOpt;
        return outOpt;
    }

    assignNoEnum(Encoder.prototype, { getOptimizerList: getOptimizerList });

    var trimJS;

    (function ()
    {
        var regExp =
        _RegExp
        ('(?:(?!.)\\s)+(?:\\s|\uFEFF|//(?:(?!\\*/|`).)*(?!.)|/\\*(?:(?!`)(?:[^*]|\\*[^/]))*?\\*/)*$');

        trimJS =
        function (str)
        {
            str = str.replace(/^(?:\s|\uFEFF|\/\/.*(?!.)|\/\*[\s\S]*?\*\/)*(?!.)\s/, '');
            var match = regExp.exec(str);
            if (match)
            {
                var index = match.index;
                if (str[index - 1] !== '\\')
                    str = str.slice(0, index);
            }
            return str;
        };
    }
    )();

    var trimJS$1 = trimJS;

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
            input = trimJS$1(input);
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

    function getValidFeatureMask(features)
    {
        var mask = features !== undefined ? validMaskFromArrayOrStringOrFeature(features) : maskNew();
        return mask;
    }

    function isEncoderInCache(features)
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

    var JScrewIt = assignNoEnum({ }, { Feature: Feature, encode: encode });

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

    if (typeof NO_DEBUG === 'undefined')
    {
        (function ()
        {
            function clone(obj)
            {
                if (typeof obj === 'object')
                {
                    var target = { };
                    var names = _Object_keys(obj);
                    names.forEach
                    (
                        function (name)
                        {
                            var value = clone(obj[name]);
                            target[name] = value;
                        }
                    );
                    return target;
                }
                return obj;
            }

            function cloneEntries(inputEntries)
            {
                var outputEntries;
                if (inputEntries)
                {
                    if (_Array_isArray(inputEntries))
                        outputEntries = inputEntries.map(clone);
                    else
                        outputEntries = [createEntryClone(inputEntries, EMPTY_MASK)];
                }
                return outputEntries;
            }

            function createEncoder(features)
            {
                var mask = getValidFeatureMask(features);
                var encoder = new Encoder(mask);
                encoder.perfLog = [];
                return encoder;
            }

            function createEntryClone(definition, mask)
            {
                definition = clone(definition);
                var entry = { definition: definition, mask: mask };
                return entry;
            }

            function createFeatureFromMask(mask)
            {
                var featureObj = isMaskCompatible(mask) ? featureFromMask(mask) : null;
                return featureObj;
            }

            function createScrewBuffer(screwMode, groupThreshold, optimizerList)
            {
                var buffer = new ScrewBuffer(screwMode, groupThreshold, optimizerList);
                return buffer;
            }

            function defineConstant(encoder, constant, definition)
            {
                constant = _String(constant);
                if (!/^[$A-Z_a-z][$\w]*$/.test(constant))
                    throw new _SyntaxError('Invalid identifier ' + _JSON_stringify(constant));
                if (!encoder.hasOwnProperty('constantDefinitions'))
                    encoder.constantDefinitions = _Object_create(CONSTANTS);
                var entries = [define(esToString(definition))];
                encoder.constantDefinitions[constant] = entries;
            }

            function getCharacterEntries(char)
            {
                var entries = cloneEntries(CHARACTERS[char]);
                return entries;
            }

            function getCharacters()
            {
                var chars = _Object_keys(CHARACTERS).sort();
                return chars;
            }

            function getComplexEntry(complex)
            {
                var entry = clone(COMPLEX[complex]);
                return entry;
            }

            function getComplexNames()
            {
                var names = _Object_keys(COMPLEX).sort();
                return names;
            }

            function getConstantEntries(constant)
            {
                var entries = cloneEntries(CONSTANTS[constant]);
                return entries;
            }

            function getConstantNames()
            {
                var names = _Object_keys(CONSTANTS).sort();
                return names;
            }

            function getEntries(name)
            {
                var entries = cloneEntries(ENTRIES[name]);
                return entries;
            }

            function getStrategies()
            {
                return STRATEGIES;
            }

            var EMPTY_MASK = maskNew();

            // Miscellaneous entries
            var ENTRIES = createEmpty();
            ENTRIES['BASE64_ALPHABET_HI_4:0']                       = BASE64_ALPHABET_HI_4[0];
            ENTRIES['BASE64_ALPHABET_HI_4:4']                       = BASE64_ALPHABET_HI_4[4];
            ENTRIES['BASE64_ALPHABET_HI_4:5']                       = BASE64_ALPHABET_HI_4[5];
            ENTRIES['BASE64_ALPHABET_LO_4:1']                       = BASE64_ALPHABET_LO_4[1];
            ENTRIES['BASE64_ALPHABET_LO_4:3']                       = BASE64_ALPHABET_LO_4[3];
            ENTRIES.FROM_CHAR_CODE                                  = FROM_CHAR_CODE;
            ENTRIES['FROM_CHAR_CODE:available']                     = FROM_CHAR_CODE.available;
            ENTRIES.FROM_CHAR_CODE_CALLBACK_FORMATTER               = FROM_CHAR_CODE_CALLBACK_FORMATTER;
            ENTRIES['FROM_CHAR_CODE_CALLBACK_FORMATTER:available']  =
            FROM_CHAR_CODE_CALLBACK_FORMATTER.available;
            ENTRIES.MAPPER_FORMATTER                                = MAPPER_FORMATTER;
            ENTRIES['MAPPER_FORMATTER:available']                   = MAPPER_FORMATTER.available;
            ENTRIES.OPTIMAL_ARG_NAME                                = OPTIMAL_ARG_NAME;
            ENTRIES['OPTIMAL_ARG_NAME:available']                   = OPTIMAL_ARG_NAME.available;
            ENTRIES.OPTIMAL_B                                       = OPTIMAL_B;
            ENTRIES['OPTIMAL_B:available']                          = OPTIMAL_B.available;
            ENTRIES.OPTIMAL_RETURN_STRING                           = OPTIMAL_RETURN_STRING;
            ENTRIES['OPTIMAL_RETURN_STRING:available']              = OPTIMAL_RETURN_STRING.available;

            var debug =
            assignNoEnum
            (
                { },
                {
                    DynamicSolution:            DynamicSolution,
                    MaskMap:                    MaskMap,
                    MaskSet:                    MaskSet,
                    Solution:                   SimpleSolution,
                    SolutionType:               SolutionType,
                    calculateSolutionType:      calculateSolutionType,
                    createClusteringPlan:       createClusteringPlan,
                    createCommaOptimizer:       createCommaOptimizer,
                    createComplexOptimizer:     createComplexOptimizer,
                    createEncoder:              createEncoder,
                    createFeatureFromMask:      createFeatureFromMask,
                    createFigurator:            createFigurator,
                    createReindexMap:           createReindexMap,
                    createScrewBuffer:          createScrewBuffer,
                    createToStringOptimizer:    createToStringOptimizer,
                    defineConstant:             defineConstant,
                    getCharacterEntries:        getCharacterEntries,
                    getCharacters:              getCharacters,
                    getComplexEntry:            getComplexEntry,
                    getComplexNames:            getComplexNames,
                    getConstantEntries:         getConstantEntries,
                    getConstantNames:           getConstantNames,
                    getEntries:                 getEntries,
                    getStrategies:              getStrategies,
                    isEncoderInCache:           isEncoderInCache,
                    maskAreEqual:               maskAreEqual,
                    maskIncludes:               maskIncludes,
                    maskNew:                    maskNew,
                    maskNext:                   maskNext,
                    maskUnion:                  maskUnion,
                    optimizeSolutions:          optimizeSolutions,
                    trimJS:                     trimJS$1,
                }
            );

            assignNoEnum(JScrewIt, { debug: debug });
        }
        )();
    }

}());
