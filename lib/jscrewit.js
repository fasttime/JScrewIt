// JScrewIt 2.17.1 – https://jscrew.it

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
    var _Object_defineProperties         = _Object.defineProperties;
    var _Object_defineProperty           = _Object.defineProperty;
    var _Object_freeze                   = _Object.freeze;
    var _Object_getOwnPropertyDescriptor = _Object.getOwnPropertyDescriptor;
    var _Object_keys                     = _Object.keys;

    var _RegExp                          = RegExp;

    var _String                          = String;

    var _SyntaxError                     = SyntaxError;

    var _TypeError                       = TypeError;

    var _parseInt                        = parseInt;

    function assignNoEnum(target, source)
    {
        var descriptors = { };
        var names = _Object_keys(source);
        names.forEach
        (
            function (name)
            {
                var descriptor = _Object_getOwnPropertyDescriptor(source, name);
                descriptor.enumerable = false;
                descriptors[name] = descriptor;
            }
        );
        _Object_defineProperties(target, descriptors);
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

    function maskAreEqual(mask1, mask2)
    {
        var equal = mask1[0] === mask2[0] && mask1[1] === mask2[1];
        return equal;
    }

    function maskIncludes(includingMask, includedMask)
    {
        var part0;
        var part1;
        var included =
        ((part0 = includedMask[0]) & includingMask[0]) === part0 &&
        ((part1 = includedMask[1]) & includingMask[1]) === part1;
        return included;
    }

    function maskIntersection(mask1, mask2)
    {
        var mask = [mask1[0] & mask2[0], mask1[1] & mask2[1]];
        return mask;
    }

    function maskIsEmpty(mask)
    {
        var empty = !(mask[0] | mask[1]);
        return empty;
    }

    function maskNew()
    {
        var mask = [0, 0];
        return mask;
    }

    function maskUnion(mask1, mask2)
    {
        var mask = [mask1[0] | mask2[0], mask1[1] | mask2[1]];
        return mask;
    }

    function maskWithBit(bitIndex)
    {
        var mask = [0, 0];
        mask[bitIndex >> 5] |= 1 << bitIndex;
        return mask;
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

    var Feature;

    var featureFromMask;
    var isMaskCompatible;
    var validMaskFromArrayOrStringOrFeature;

    (function ()
    {
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

        function checkSelfFeature()
        {
            // self + '' throws an error inside a web worker in Safari 8 and 9.
            var str;
            try
            {
                str = self + '';
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

        function completeExclusions(name)
        {
            var info = FEATURE_INFOS[name];
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
                        incompatibleMaskMap[incompatibleMask] = incompatibleMask;
                    }
                );
            }
        }

        function completeFeature(name)
        {
            var mask;
            var featureObj = ALL[name];
            if (featureObj)
                mask = featureObj.mask;
            else
            {
                var info = FEATURE_INFOS[name];
                if (typeof info === 'string')
                {
                    mask = completeFeature(info);
                    featureObj = ALL[info];
                }
                else
                {
                    var check = info.check;
                    if (check)
                    {
                        mask = maskWithBit(bitIndex++);
                        if (check())
                            autoMask = maskUnion(autoMask, mask);
                        check = wrapCheck(check);
                    }
                    else
                        mask = maskNew();
                    var includes = includesMap[name] = info.includes || [];
                    includes.forEach
                    (
                        function (include)
                        {
                            var includeMask = completeFeature(include);
                            mask = maskUnion(mask, includeMask);
                        }
                    );
                    var description;
                    var engine = info.engine;
                    if (engine == null)
                        description = info.description;
                    else
                        description = createEngineFeatureDescription(engine);
                    var elementary = check || info.excludes;
                    featureObj =
                    createFeature(name, description, mask, check, engine, info.attributes, elementary);
                    if (elementary)
                        ELEMENTARY.push(featureObj);
                }
                registerFeature(name, featureObj);
            }
            return mask;
        }

        function createEngineFeatureDescription(engine)
        {
            var description = 'Features available in ' + engine + '.';
            return description;
        }

        function createFeature(name, description, mask, check, engine, attributes, elementary)
        {
            attributes = _Object_freeze(attributes || { });
            var descriptors =
            {
                attributes:     { value: attributes },
                check:          { value: check },
                description:    { value: description },
                engine:         { value: engine },
                name:           { value: name },
            };
            if (elementary)
                descriptors.elementary = { value: true };
            var featureObj = _Object_create(featurePrototype, descriptors);
            initMask(featureObj, mask);
            return featureObj;
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

        function initMask(featureObj, mask)
        {
            _Object_defineProperty(featureObj, 'mask', { value: _Object_freeze(mask) });
        }

        /**
         * Node.js custom inspection function.
         * Set on `Feature.prototype` with name `"inspect"` for Node.js ≤ 8.6.x and with symbol
         * `Symbol.for("nodejs.util.inspect.custom")` for Node.js ≥ 6.6.x.
         *
         * @function inspect
         *
         * @see
         * {@link https://tiny.cc/j4wz9y|Custom inspection functions on Objects} for further
         * information.
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

        function registerFeature(name, featureObj)
        {
            var descriptor = { enumerable: true, value: featureObj };
            _Object_defineProperty(Feature, name, descriptor);
            ALL[name] = featureObj;
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

        var ALL = createEmpty();
        var ELEMENTARY = [];

        var FEATURE_INFOS =
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
                    /* c8 ignore next 2 */
                    catch (error)
                    { }
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
                'to "[object Array Iterator]".',
                check:
                function ()
                {
                    var available =
                    Array.prototype.entries && [].entries() + '' === '[object Array Iterator]';
                    return available;
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
            SELF: 'ANY_WINDOW',
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
                    'char-increment-restriction': null,
                    'safari-bug-21820506': null,
                    'web-worker-restriction': null,
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
                    'GMT',
                    'HISTORY',
                    'HTMLDOCUMENT',
                    'INCR_CHAR',
                    'INTL',
                    'LOCALE_INFINITY',
                    'NAME',
                    'NO_IE_SRC',
                    'NO_OLD_SAFARI_ARRAY_ITERATOR',
                    'STATUS',
                    'UNDEFINED',
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
                    'GMT',
                    'HISTORY',
                    'HTMLDOCUMENT',
                    'INCR_CHAR',
                    'NAME',
                    'STATUS',
                    'UNDEFINED',
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
                    'GMT',
                    'HISTORY',
                    'HTMLAUDIOELEMENT',
                    'HTMLDOCUMENT',
                    'INCR_CHAR',
                    'INTL',
                    'LOCALE_INFINITY',
                    'NAME',
                    'STATUS',
                    'UNDEFINED',
                    'V8_SRC',
                    'WINDOW',
                ],
                attributes: { 'no-console-in-web-worker': null, 'web-worker-restriction': null },
            },
            CHROME_PREV: 'CHROME_73',
            CHROME: 'CHROME_73',
            CHROME_73:
            {
                engine: 'Chrome 73, Edge 79 and Opera 60 or later',
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
                    'GMT',
                    'HISTORY',
                    'HTMLDOCUMENT',
                    'INCR_CHAR',
                    'INTL',
                    'LOCALE_INFINITY',
                    'NAME',
                    'NO_OLD_SAFARI_ARRAY_ITERATOR',
                    'STATUS',
                    'UNDEFINED',
                    'V8_SRC',
                    'WINDOW',
                ],
                attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
            },
            FF_ESR: 'FF_78',
            FF_PREV: 'FF_78',
            FF: 'FF_78',
            FF_78:
            {
                engine: 'Firefox 78 or later',
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
                    'GMT',
                    'HISTORY',
                    'HTMLDOCUMENT',
                    'INCR_CHAR',
                    'INTL',
                    'LOCALE_INFINITY',
                    'NAME',
                    'NO_OLD_SAFARI_ARRAY_ITERATOR',
                    'STATUS',
                    'UNDEFINED',
                    'WINDOW',
                ],
                attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
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
                    'HISTORY',
                    'IE_SRC',
                    'INCR_CHAR',
                    'STATUS',
                    'UNDEFINED',
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
                    'GMT',
                    'HISTORY',
                    'HTMLDOCUMENT',
                    'IE_SRC',
                    'INCR_CHAR',
                    'INTL',
                    'STATUS',
                    'UNDEFINED',
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
                    'GMT',
                    'HISTORY',
                    'HTMLDOCUMENT',
                    'IE_SRC',
                    'INCR_CHAR',
                    'INTL',
                    'LOCALE_INFINITY',
                    'STATUS',
                    'UNDEFINED',
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
                    'GMT',
                    'INCR_CHAR',
                    'NAME',
                    'UNDEFINED',
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
                    'GMT',
                    'INCR_CHAR',
                    'INTL',
                    'LOCALE_INFINITY',
                    'NAME',
                    'NO_OLD_SAFARI_ARRAY_ITERATOR',
                    'UNDEFINED',
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
                    'GMT',
                    'INCR_CHAR',
                    'INTL',
                    'LOCALE_INFINITY',
                    'NAME',
                    'NO_OLD_SAFARI_ARRAY_ITERATOR',
                    'UNDEFINED',
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
                    'GMT',
                    'INCR_CHAR',
                    'INTL',
                    'LOCALE_INFINITY',
                    'NAME',
                    'NO_OLD_SAFARI_ARRAY_ITERATOR',
                    'UNDEFINED',
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
                    'GMT',
                    'INCR_CHAR',
                    'INTL',
                    'LOCALE_INFINITY',
                    'NAME',
                    'NO_OLD_SAFARI_ARRAY_ITERATOR',
                    'UNDEFINED',
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
                    'GMT',
                    'INCR_CHAR',
                    'INTL',
                    'LOCALE_INFINITY',
                    'NAME',
                    'NO_OLD_SAFARI_ARRAY_ITERATOR',
                    'UNDEFINED',
                    'V8_SRC',
                ],
                attributes: { 'char-increment-restriction': null },
            },
            NODE_12:
            {
                engine: 'Node.js 12 or later',
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
                    'GMT',
                    'INCR_CHAR',
                    'INTL',
                    'LOCALE_INFINITY',
                    'NAME',
                    'NO_OLD_SAFARI_ARRAY_ITERATOR',
                    'UNDEFINED',
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
                    'GMT',
                    'HISTORY',
                    'HTMLDOCUMENT',
                    'INCR_CHAR',
                    'NAME',
                    'NODECONSTRUCTOR',
                    'STATUS',
                    'UNDEFINED',
                    'WINDOW',
                ],
                attributes:
                {
                    'char-increment-restriction': null,
                    'no-atob-in-web-worker': null,
                    'no-console-in-web-worker': null,
                    'web-worker-restriction': null,
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
                    'GMT',
                    'HISTORY',
                    'HTMLDOCUMENT',
                    'INCR_CHAR',
                    'NAME',
                    'NODECONSTRUCTOR',
                    'STATUS',
                    'UNDEFINED',
                    'WINDOW',
                ],
                attributes:
                {
                    'char-increment-restriction': null,
                    'no-atob-in-web-worker': null,
                    'safari-bug-21820506': null,
                    'web-worker-restriction': null,
                },
            },
            SAFARI_8: 'SAFARI_7_1',
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
                    'GMT',
                    'HISTORY',
                    'HTMLDOCUMENT',
                    'INCR_CHAR',
                    'NAME',
                    'NODECONSTRUCTOR',
                    'NO_OLD_SAFARI_ARRAY_ITERATOR',
                    'STATUS',
                    'UNDEFINED',
                    'WINDOW',
                ],
                attributes:
                {
                    'char-increment-restriction': null,
                    'no-atob-in-web-worker': null,
                    'safari-bug-21820506': null,
                    'web-worker-restriction': null,
                },
            },
            SAFARI_10:
            {
                engine: 'Safari 10 or later',
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
                    'GMT',
                    'HISTORY',
                    'HTMLDOCUMENT',
                    'INCR_CHAR',
                    'INTL',
                    'LOCALE_INFINITY',
                    'NAME',
                    'NO_OLD_SAFARI_ARRAY_ITERATOR',
                    'STATUS',
                    'UNDEFINED',
                    'WINDOW',
                ],
                attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
            },
            SAFARI: 'SAFARI_12',
            SAFARI_12:
            {
                engine: 'Safari 12 or later',
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
                    'GMT',
                    'HISTORY',
                    'HTMLDOCUMENT',
                    'INCR_CHAR',
                    'INTL',
                    'LOCALE_INFINITY',
                    'NAME',
                    'NO_OLD_SAFARI_ARRAY_ITERATOR',
                    'STATUS',
                    'UNDEFINED',
                    'WINDOW',
                ],
                attributes: { 'char-increment-restriction': null, 'web-worker-restriction': null },
            },
        };

        Feature =
        function ()
        {
            var mask = validMaskFromArguments(arguments);
            var featureObj = this instanceof Feature ? this : _Object_create(featurePrototype);
            initMask(featureObj, mask);
            return featureObj;
        };

        var constructorSource =
        {
            ALL:            ALL,
            ELEMENTARY:     ELEMENTARY,
            areCompatible:  areCompatible,
            areEqual:       areEqual,
            commonOf:       commonOf,
        };

        assignNoEnum(Feature, constructorSource);

        var featurePrototype = Feature.prototype;

        var protoSource =
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
                            var includes = includesMap[name];
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

            description: undefined,

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
        };

        assignNoEnum(featurePrototype, protoSource);
        try
        {
            var inspectKey = require('util').inspect.custom;
        }
        /* c8 ignore next 2 */
        catch (error)
        { }
        if (inspectKey)
        {
            _Object_defineProperty
            (featurePrototype, inspectKey, { configurable: true, value: inspect, writable: true });
        }

        featureFromMask =
        function (mask)
        {
            var featureObj = _Object_create(featurePrototype);
            initMask(featureObj, mask);
            return featureObj;
        };

        isMaskCompatible =
        function (mask)
        {
            var compatible =
            incompatibleMaskList.every
            (
                function (incompatibleMask)
                {
                    var returnValue = !maskIncludes(mask, incompatibleMask);
                    return returnValue;
                }
            );
            return compatible;
        };

        validMaskFromArrayOrStringOrFeature =
        function (arg)
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
        };

        var autoMask = maskNew();
        var bitIndex = 0;
        var includesMap = createEmpty();
        var incompatibleMaskMap = createEmpty();

        var featureNames = _Object_keys(FEATURE_INFOS);
        featureNames.forEach(completeFeature);
        featureNames.forEach(completeExclusions);
        var incompatibleMaskList =
        _Object_keys(incompatibleMaskMap).map
        (
            function (key)
            {
                var mask = incompatibleMaskMap[key];
                return mask;
            }
        );
        ELEMENTARY.sort
        (
            function (feature1, feature2)
            {
                var returnValue = feature1.name < feature2.name ? -1 : 1;
                return returnValue;
            }
        );
        _Object_freeze(ELEMENTARY);
        var autoFeatureObj =
        createFeature('AUTO', 'All features available in the current engine.', autoMask);
        registerFeature('AUTO', autoFeatureObj);
        _Object_freeze(ALL);
    }
    )();

    function createDefinitionEntry(definition, mask)
    {
        var entry = { definition: definition, mask: mask };
        return entry;
    }

    function define(definition)
    {
        var entry = defineWithArrayLike(definition, arguments, 1);
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

    function defineWithArrayLike(definition, featureArgs, startIndex)
    {
        var features = _Array_prototype.slice.call(featureArgs, startIndex);
        var mask = featuresToMask(features);
        var entry = createDefinitionEntry(definition, mask);
        return entry;
    }

    // novem 1.1.0 – https://github.com/fasttime/novem

    var INVALID_EXPR = {};
    function doEval(expr) {
        var value = tryEval(expr);
        if (value === INVALID_EXPR)
            throw SyntaxError("Invalid expression " + expr);
        return value;
    }
    function tryEval(expr) {
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
        var value = doEval(replacement);
        if (value === undefined || value === null)
            return SolutionType.UNDEFINED;
        switch (typeof value) {
            case 'boolean':
                return SolutionType.ALGEBRAIC;
            case 'number':
                {
                    var type = isWeak(replacement, value) ? SolutionType.WEAK_ALGEBRAIC : SolutionType.ALGEBRAIC;
                    return type;
                }
            case 'object':
            case 'function':
                return SolutionType.OBJECT;
            case 'string':
                {
                    var type = isCombined(replacement, value) ?
                        isPrefixed(replacement, value) ?
                            isWeak(replacement, value) ?
                                SolutionType.WEAK_PREFIXED_STRING :
                                SolutionType.PREFIXED_STRING :
                            SolutionType.COMBINED_STRING :
                        SolutionType.STRING;
                    return type;
                }
        }
    };
    var isCombined = function (replacement, value) { return !value !== tryEval("!" + replacement); };
    var isPrefixed = function (replacement, value) { return "0" + value !== tryEval("0+" + replacement); };
    var isWeak = function (replacement, value) { return "" + value !== tryEval("\"\"+" + replacement); };

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
    var isWeak$1 = makeIsAttr(SolutionType.WEAK_ALGEBRAIC, SolutionType.WEAK_PREFIXED_STRING);
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

    var __extends =  (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
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
                return isWeak$1(this.type);
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
            var _this = _super.call(this) || this;
            Object.defineProperty(_this, "_replacement", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(_this, "_solutions", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: []
            });
            return _this;
        }
        Object.defineProperty(DynamicSolution.prototype, "append", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function (solution) {
                this._replacement = undefined;
                this._solutions.push(solution);
            }
        });
        Object.defineProperty(DynamicSolution.prototype, "prepend", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function (solution) {
                this._replacement = undefined;
                this._solutions.unshift(solution);
            }
        });
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
    var
    LazySolution = /** @class */ (function (_super) {
        __extends(LazySolution, _super);
        function LazySolution(source, createReplacement, type) {
            var _this = _super.call(this) || this;
            Object.defineProperty(_this, "source", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: source
            });
            Object.defineProperty(_this, "type", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: type
            });
            var get = function () {
                var replacement = createReplacement();
                this.defineReplacement({ value: replacement, writable: true });
                return replacement;
            };
            _this.defineReplacement({ get: get });
            return _this;
        }
        Object.defineProperty(LazySolution.prototype, "defineReplacement", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function (attributes) {
                attributes.configurable = true;
                attributes.enumerable = true;
                Object.defineProperty(this, 'replacement', attributes);
            }
        });
        return LazySolution;
    }(AbstractSolution));
    var SimpleSolution = /** @class */ (function (_super) {
        __extends(SimpleSolution, _super);
        function SimpleSolution(source, replacement, type) {
            var _this = _super.call(this) || this;
            Object.defineProperty(_this, "source", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: source
            });
            Object.defineProperty(_this, "replacement", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: replacement
            });
            Object.defineProperty(_this, "type", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: type
            });
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
        return isWeak$1(type) ? "+(" + replacement + ")" : "+" + replacement;
    };
    var getReplacement = function (_a) {
        var replacement = _a.replacement;
        return replacement;
    };

    var protoSource =
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
    };

    assignNoEnum(AbstractSolution.prototype, protoSource);

    // As of version 2.1.0, definitions are interpreted using JScrewIt's own express parser, which can

    var AMENDINGS = ['true', 'undefined', 'NaN'];

    var JSFUCK_INFINITY = '1e1000';

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

    var FB_EXPR_INFOS;
    var FB_PADDING_INFOS;
    var FH_PADDING_INFOS;
    var PADDING_ENTRIES_MAP;

    function backslashDefinition()
    {
        var replacement = this.replaceCharByUnescape(0x5C);
        var solution = new SimpleSolution(undefined, replacement, SolutionType.STRING);
        return solution;
    }

    function createCharAtDefinitionFB(offset)
    {
        function definitionFB(char)
        {
            var functionDefinition = this.findDefinition(FB_EXPR_INFOS);
            var expr = functionDefinition.expr;
            var index = offset + functionDefinition.shift;
            var paddingEntries = PADDING_ENTRIES_MAP[index];
            var solution = this.resolveExprAt(char, expr, index, paddingEntries, FB_PADDING_INFOS);
            return solution;
        }

        return definitionFB;
    }

    function createCharAtDefinitionFH(expr, index, entries)
    {
        function definitionFH(char)
        {
            var solution = this.resolveExprAt(char, expr, index, entries, FH_PADDING_INFOS);
            return solution;
        }

        return definitionFH;
    }

    var initReplaceStaticExpr;

    (function ()
    {
        var ANY_DOCUMENT                    = Feature.ANY_DOCUMENT;
        var ANY_WINDOW                      = Feature.ANY_WINDOW;
        var ARRAY_ITERATOR                  = Feature.ARRAY_ITERATOR;
        var ARROW                           = Feature.ARROW;
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
        var GMT                             = Feature.GMT;
        var HISTORY                         = Feature.HISTORY;
        var HTMLAUDIOELEMENT                = Feature.HTMLAUDIOELEMENT;
        var HTMLDOCUMENT                    = Feature.HTMLDOCUMENT;
        var IE_SRC                          = Feature.IE_SRC;
        var INCR_CHAR                       = Feature.INCR_CHAR;
        var INTL                            = Feature.INTL;
        var LOCALE_INFINITY                 = Feature.LOCALE_INFINITY;
        var NAME                            = Feature.NAME;
        var NODECONSTRUCTOR                 = Feature.NODECONSTRUCTOR;
        var NO_FF_SRC                       = Feature.NO_FF_SRC;
        var NO_IE_SRC                       = Feature.NO_IE_SRC;
        var NO_OLD_SAFARI_ARRAY_ITERATOR    = Feature.NO_OLD_SAFARI_ARRAY_ITERATOR;
        var NO_V8_SRC                       = Feature.NO_V8_SRC;
        var SELF_OBJ                        = Feature.SELF_OBJ;
        var STATUS                          = Feature.STATUS;
        var UNDEFINED                       = Feature.UNDEFINED;
        var V8_SRC                          = Feature.V8_SRC;
        var WINDOW                          = Feature.WINDOW;

        var FB_NO_FF_PADDINGS =
        [
            ,
            ,
            ,
            ,
            ,
            'FBP_5_S',
            'RP_1_NO + FBP_5_S',
            ,
            ,
            'FBP_9_U',
            '[RP_1_NO] + FBP_9_U',
            ,
            '[RP_3_NO] + FBP_9_U',
        ];

        var FB_NO_IE_PADDINGS =
        [
            ,
            ,
            ,
            ,
            ,
            'RP_1_NO + FBEP_4_S',
            ,
            'RP_3_NO + FBEP_4_S',
            ,
            'FBEP_9_U',
            '[RP_1_NO] + FBEP_9_U',
            ,
            '[RP_3_NO] + FBEP_9_U',
        ];

        var FB_PADDINGS =
        [
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            'FBP_7_NO',
            'FBP_8_NO',
            ,
            'RP_3_NO + [FBP_7_NO]',
            ,
            'RP_5_N + [FBP_7_NO]',
        ];

        var FH_PADDINGS =
        [
            ,
            ,
            ,
            'FHP_3_NO',
            ,
            'FHP_5_N',
            'FHP_5_N + [RP_1_NO]',
            'FHP_3_NO + [RP_4_N]',
            'FHP_8_S',
            'FHP_5_N + [RP_4_N]',
        ];

        var R_PADDINGS =
        [
            'RP_0_S',
            'RP_1_NO',
            ,
            'RP_3_NO',
            'RP_4_N',
            'RP_5_N',
            'RP_6_SO',
        ];

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
            var entry = defineWithArrayLike(definition, arguments, 2);
            return entry;
        }

        function defineFBCharAt(offset)
        {
            var definition = createCharAtDefinitionFB(offset);
            var entry = define(definition);
            return entry;
        }

        function defineFHCharAt(expr, index)
        {
            var entries;
            switch (index)
            {
            case 3:
            case 13:
                entries =
                [
                    define(7),
                    define(0, NO_IE_SRC),
                    define(6, IE_SRC),
                ];
                break;
            case 6:
            case 16:
                entries =
                [
                    define(5),
                    define(4, NO_IE_SRC),
                    define(3, IE_SRC),
                ];
                break;
            case 8:
            case 18:
                entries =
                [
                    define(3),
                    define(1, IE_SRC),
                ];
                break;
            case 9:
            case 19:
                entries =
                [
                    define({ block: 'RP_1_NO', indexer: (index + 1) / 10 + ' + FH_SHIFT_1' }),
                    define(1, NO_IE_SRC),
                    define(0, IE_SRC),
                ];
                break;
            case 11:
                entries =
                [
                    define(9),
                    define(0, NO_IE_SRC),
                    define(0, IE_SRC),
                ];
                break;
            case 12:
                entries =
                [
                    define(8),
                    define(0, NO_IE_SRC),
                    define(0, IE_SRC),
                ];
                break;
            case 14:
                entries =
                [
                    define(6),
                    define(5, IE_SRC),
                ];
                break;
            case 15:
                entries =
                [
                    define(5),
                    define(4, IE_SRC),
                ];
                break;
            case 17:
                entries =
                [
                    define(3),
                ];
                break;
            }
            var definition = createCharAtDefinitionFH(expr, index, entries);
            var entry = defineWithArrayLike(definition, arguments, 2);
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
                define('(Function() + [])[23]'),
                define('(RP_1_NO + Function())[20]', FUNCTION_19_LF),
                define('(Function() + [])[22]', FUNCTION_22_LF),
                define('(ANY_FUNCTION + [])[0]', IE_SRC),
                defineFHCharAt('FILTER', 19, NO_V8_SRC),
                defineFHCharAt('FILL', 17, FILL, NO_V8_SRC),
                defineFHCharAt('FLAT', 17, FLAT, NO_V8_SRC),
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
                define('(RP_5_N + atob("NaNfalse"))[10]', ATOB),
            ],

            ' ':
            [
                defineFHCharAt('ANY_FUNCTION', 8),
                define('(RP_3_NO + ARRAY_ITERATOR)[10]', ARRAY_ITERATOR),
                define('(FILTER + [])[20]', FF_SRC),
                define('(+(ANY_FUNCTION + [])[0] + FILTER)[22]', NO_FF_SRC),
                define('(FILTER + [])[21]', NO_V8_SRC),
                define('(RP_1_NO + FILTER)[20]', V8_SRC),
                define('(+(ANY_FUNCTION + [])[0] + FILL)[20]', FILL, NO_FF_SRC),
                define('(RP_5_N + FILL)[20]', FILL, NO_IE_SRC),
                define('(FILL + [])[20]', FILL, NO_V8_SRC),
                define('(+(ANY_FUNCTION + [])[0] + FLAT)[20]', FLAT, NO_FF_SRC),
                define('(RP_5_N + FLAT)[20]', FLAT, NO_IE_SRC),
                define('(FLAT + [])[20]', FLAT, NO_V8_SRC),
            ],
            // '!':    ,
            '"':
            [
                define('"".fontcolor()[12]'),
            ],
            // '#':    ,
            // '$':    ,
            '%':
            [
                define('escape(FILTER)[20]'),
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
                defineFHCharAt('FILTER', 15),
                defineFHCharAt('FILL', 13, FILL),
                defineFHCharAt('FLAT', 13, FLAT),
            ],
            ')':
            [
                defineFHCharAt('FILTER', 16),
                defineFHCharAt('FILL', 14, FILL),
                defineFHCharAt('FLAT', 14, FLAT),
            ],
            // '*':    ,
            '+': '(1e100 + [])[2]',
            ',':
            [
                define('([][SLICE_OR_FLAT].call("false") + [])[1]'),
                define({ expr: '[[]].concat([[]])', solutionType: SolutionType.OBJECT }),
            ],
            '-': '(+".0000001" + [])[2]',
            '.': '(+"11e20" + [])[1]',
            '/':
            [
                define('"0false".italics()[10]'),
                define('"true".sub()[10]'),
            ],
            // '0'…'9':
            ':':
            [
                define('(RegExp() + [])[3]'),
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
                define('(RegExp() + [])[2]'),
                defineCharDefault(),
            ],
            // '@':    ,
            'A':
            [
                defineFHCharAt('Array', 9),
                define('(RP_3_NO + ARRAY_ITERATOR)[11]', ARRAY_ITERATOR),
            ],
            'B':
            [
                defineFHCharAt('Boolean', 9),
                define('"".sub()[3]', CAPITAL_HTML),
            ],
            'C':
            [
                define('escape("".italics())[2]'),
                define('escape("".sub())[2]'),
                define('atob("00NaNfalse")[1]', ATOB),
                define('(RP_4_N + "".fontcolor())[10]', CAPITAL_HTML),
                define('(RP_3_NO + Function("return console")())[11]', CONSOLE),
                define('(Node + [])[12]', NODECONSTRUCTOR),
            ],
            'D':
            [
                // * The escaped character may be either "]" or "}".
                define('escape((+("1000" + (RP_5_N + FILTER + 0)[40] + 0) + FILTER)[40])[2]'), // *
                define('escape("]")[2]'),
                define('escape("}")[2]'),
                define('(document + [])[SLICE_OR_SUBSTR]("-10")[1]', ANY_DOCUMENT),
                define('btoa("00")[1]', ATOB),
                define('(RP_3_NO + document)[11]', DOCUMENT),
                define // *
                ('escape((RP_3_NO + [+("10" + [(RP_6_SO + FILL)[40]] + "000")] + FILL)[40])[2]', FILL),
                define // *
                ('escape((RP_3_NO + [+("10" + [(RP_6_SO + FLAT)[40]] + "000")] + FLAT)[40])[2]', FLAT),
                define('(document + [])[12]', HTMLDOCUMENT),
                define('escape(ARRAY_ITERATOR)[30]', NO_OLD_SAFARI_ARRAY_ITERATOR),
                define('escape(FILTER)[50]', V8_SRC),
                define('escape(FILL)[60]', FF_SRC, FILL),
                define('escape(FLAT)[60]', FF_SRC, FLAT),
            ],
            'E':
            [
                defineFHCharAt('RegExp', 12),
                define('btoa("0NaN")[1]', ATOB),
                define('(RP_5_N + "".link())[10]', CAPITAL_HTML),
                define('(RP_3_NO + sidebar)[11]', EXTERNAL),
                define('(RP_3_NO + Audio)[21]', HTMLAUDIOELEMENT),
            ],
            'F':
            [
                defineFHCharAt('Function', 9),
                define('"".fontcolor()[1]', CAPITAL_HTML),
            ],
            'G':
            [
                define('btoa("0false")[1]', ATOB),
                define('"0".big()[10]', CAPITAL_HTML),
                define('(RP_5_N + Date())[30]', GMT),
            ],
            'H':
            [
                define('btoa(true)[1]', ATOB),
                define('"".link()[3]', CAPITAL_HTML),
                define
                ({ expr: '(RP_3_NO + Function("return history")())[11]', optimize: true }, HISTORY),
                define('(RP_1_NO + Audio)[10]', HTMLAUDIOELEMENT),
                define('(RP_3_NO + document)[11]', HTMLDOCUMENT),
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
                define('(RP_5_N + "".strike())[10]', CAPITAL_HTML),
                defineCharDefault(),
            ],
            'L':
            [
                define('btoa(".")[0]', ATOB),
                define('(RP_3_NO + "".fontcolor())[11]', CAPITAL_HTML),
                define('(Audio + [])[12]', HTMLAUDIOELEMENT),
                define('(document + [])[11]', HTMLDOCUMENT),
            ],
            'M':
            [
                define('btoa(0)[0]', ATOB),
                define('"".small()[2]', CAPITAL_HTML),
                define('(RP_4_N + Date())[30]', GMT),
                define('(Audio + [])[11]', HTMLAUDIOELEMENT),
                define('(document + [])[10]', HTMLDOCUMENT),
            ],
            'N': '"NaN"[0]',
            'O':
            [
                define('(RP_3_NO + PLAIN_OBJECT)[11]'),
                define('btoa(NaN)[3]', ATOB),
                define('"".fontcolor()[2]', CAPITAL_HTML),
            ],
            'P':
            [
                define('Function("return\\"" + ESCAPING_BACKSLASH + "120\\"")()'),
                define('atob("01A")[1]', ATOB),
                define('btoa("".italics())[0]', ATOB),
                define('(Function("return statusbar")() + [])[11]', BARPROP),
                define('"0".sup()[10]', CAPITAL_HTML),
                defineCharDefault({ atob: false, charCode: false, escSeq: false }),
            ],
            'Q':
            [
                define('"q"[TO_UPPER_CASE]()'),
                define('btoa(1)[1]', ATOB),
                defineCharDefault({ atob: false }),
            ],
            'R':
            [
                defineFHCharAt('RegExp', 9),
                define('btoa("0true")[2]', ATOB),
                define('"".fontcolor()[10]', CAPITAL_HTML),
            ],
            'S':
            [
                defineFHCharAt('String', 9),
                define('"".sub()[1]', CAPITAL_HTML),
            ],
            'T':
            [
                define
                (
                    {
                        expr:
                        '(Function("try{undefined.false}catch(undefined){return undefined}")() + ' +
                        '[])[0]',
                        optimize: true,
                    }
                ),
                define('btoa(NaN)[0]', ATOB),
                define('"".fontcolor([])[20]', CAPITAL_HTML),
                define('(RP_3_NO + Date())[30]', GMT),
                define('(Audio + [])[10]', HTMLAUDIOELEMENT),
                define('(RP_1_NO + document)[10]', HTMLDOCUMENT),
                defineCharDefault({ atob: false }),
            ],
            'U':
            [
                define('btoa("1NaN")[1]', ATOB),
                define('"".sub()[2]', CAPITAL_HTML),
                define('(RP_3_NO + PLAIN_OBJECT[TO_STRING].call())[11]', UNDEFINED),
                define('(RP_3_NO + ARRAY_ITERATOR[TO_STRING].call())[11]', ARRAY_ITERATOR, UNDEFINED),
            ],
            'V':
            [
                define('"v"[TO_UPPER_CASE]()'),
                define('(document.createElement("video") + [])[12]', ANY_DOCUMENT),
                define('btoa(undefined)[10]', ATOB),
                defineCharDefault({ atob: false }),
            ],
            'W':
            [
                define('"w"[TO_UPPER_CASE]()'),
                define('(self + RP_4_N)[SLICE_OR_SUBSTR]("-11")[0]', ANY_WINDOW),
                define('btoa(undefined)[1]', ATOB),
                define('(self + [])[11]', DOMWINDOW),
                define('(RP_3_NO + self)[11]', WINDOW),
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
                define('(RP_3_NO + "".fontsize())[11]', CAPITAL_HTML),
            ],
            '[':
            [
                defineFBCharAt(14),
                define('(ARRAY_ITERATOR + [])[0]', ARRAY_ITERATOR),
            ],
            '\\':
            [
                define('ESCAPING_BACKSLASH'),
                defineCharDefault({ atob: false, escSeq: false, unescape: false }),
            ],
            ']':
            [
                defineFBCharAt(26),
                define('(ARRAY_ITERATOR + [])[22]', NO_OLD_SAFARI_ARRAY_ITERATOR),
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
                defineFHCharAt('Number', 12),
                define('(ARRAY_ITERATOR + [])[2]', ARRAY_ITERATOR),
            ],
            'c':
            [
                defineFHCharAt('ANY_FUNCTION', 3),
                define('(RP_5_N + ARRAY_ITERATOR)[10]', ARRAY_ITERATOR),
            ],
            'd': '"undefined"[2]',
            'e': '"true"[3]',
            'f': '"false"[0]',
            'g':
            [
                defineFHCharAt('String', 14),
            ],
            'h':
            [
                define('101[TO_STRING]("21")[1]'),
                define('btoa("0false")[3]', ATOB),
            ],
            'i': '([RP_5_N] + undefined)[10]',
            'j':
            [
                define('(PLAIN_OBJECT + [])[10]'),
                define('(ARRAY_ITERATOR + [])[3]', ARRAY_ITERATOR),
                define('(Node + [])[3]', NODECONSTRUCTOR),
                define('(self + [])[3]', SELF_OBJ),
            ],
            'k':
            [
                define('20[TO_STRING]("21")'),
                defineCharDefault(),
            ],
            'l': '"false"[2]',
            'm':
            [
                defineFHCharAt('Number', 11),
                define('(RP_6_SO + Function())[20]'),
            ],
            'n': '"undefined"[1]',
            'o':
            [
                defineFHCharAt('ANY_FUNCTION', 6),
                define('(ARRAY_ITERATOR + [])[1]', ARRAY_ITERATOR),
            ],
            'p':
            [
                define('211[TO_STRING]("31")[1]'),
                define('(RP_3_NO + btoa(undefined))[10]', ATOB),
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
                defineFBCharAt(19),
            ],
            'w':
            [
                define('32[TO_STRING]("33")'),
                define('(self + [])[SLICE_OR_SUBSTR]("-2")[0]', ANY_WINDOW),
                define('atob("undefined0")[1]', ATOB),
                define('(RP_4_N + self)[20]', DOMWINDOW),
                define('(self + [])[13]', WINDOW),
            ],
            'x':
            [
                define('101[TO_STRING]("34")[1]'),
                define('btoa("falsefalse")[10]', ATOB),
                define('(RP_1_NO + sidebar)[10]', EXTERNAL),
            ],
            'y': '(RP_3_NO + [Infinity])[10]',
            'z':
            [
                define('35[TO_STRING]("36")'),
                define('btoa("falsefalse")[11]', ATOB),
            ],
            '{':
            [
                defineFHCharAt('FILTER', 18),
                defineFHCharAt('FILL', 16, FILL),
                defineFHCharAt('FLAT', 16, FLAT),
            ],
            // '|':    ,
            '}':
            [
                defineFBCharAt(28),
            ],
            // '~':    ,

            '\x8a':
            [
                define('(RP_4_N + atob("NaNundefined"))[10]', ATOB),
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
                define
                (
                    { expr: 'Infinity.toLocaleString()', optimize: true },
                    LOCALE_INFINITY
                ),
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
                define('FILL', FILL),
                define('FLAT', FLAT),
            ],
            ARRAY_ITERATOR:
            [
                define('[].entries()', ARRAY_ITERATOR),
            ],
            ESCAPING_BACKSLASH:
            [
                define({ expr: 'atob("01y")[1]', solutionType: SolutionType.STRING }, ATOB),
                define
                ({ expr: '(RegExp("\\n") + [])[1]', solutionType: SolutionType.STRING }, ESC_REGEXP_LF),
                define
                (
                    { expr: '(RP_5_N + RegExp("".italics()))[10]', solutionType: SolutionType.STRING },
                    ESC_REGEXP_SLASH
                ),
                define
                (
                    { expr: '(RP_3_NO + RegExp("".sub()))[10]', solutionType: SolutionType.STRING },
                    ESC_REGEXP_SLASH
                ),
                define
                (
                    { expr: '(RegExp(FILTER) + [])[20]', solutionType: SolutionType.STRING },
                    ESC_REGEXP_LF,
                    FF_SRC
                ),
                define
                (
                    { expr: '(RegExp(Function()) + [])[20]', solutionType: SolutionType.STRING },
                    ESC_REGEXP_LF,
                    FUNCTION_19_LF
                ),
                define
                (
                    { expr: '(RP_5_N + RegExp(Function()))[30]', solutionType: SolutionType.STRING },
                    ESC_REGEXP_LF,
                    FUNCTION_22_LF
                ),
                define
                (
                    { expr: '(RegExp(ANY_FUNCTION) + [])[1]', solutionType: SolutionType.STRING },
                    ESC_REGEXP_LF,
                    IE_SRC
                ),
                define
                (
                    {
                        expr: '(+(ANY_FUNCTION + [])[0] + RegExp(FILTER))[23]',
                        solutionType: SolutionType.STRING,
                    },
                    ESC_REGEXP_LF,
                    NO_V8_SRC
                ),
                define
                (
                    { expr: '(RP_3_NO + RegExp(FILL))[21]', solutionType: SolutionType.STRING },
                    ESC_REGEXP_LF,
                    FF_SRC,
                    FILL
                ),
                define
                (
                    { expr: '(RP_3_NO + RegExp(FLAT))[21]', solutionType: SolutionType.STRING },
                    ESC_REGEXP_LF,
                    FF_SRC,
                    FLAT
                ),
                define
                (
                    {
                        expr: '(+(ANY_FUNCTION + [])[0] + RegExp(FILL))[21]',
                        solutionType: SolutionType.STRING,
                    },
                    ESC_REGEXP_LF,
                    FILL,
                    NO_V8_SRC
                ),
                define
                (
                    {
                        expr: '(+(ANY_FUNCTION + [])[0] + RegExp(FLAT))[21]',
                        solutionType: SolutionType.STRING,
                    },
                    ESC_REGEXP_LF,
                    FLAT,
                    NO_V8_SRC
                ),
                define(backslashDefinition),
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
            PLAIN_OBJECT:
            [
                define('Function("return{}")()'),
                define('Function("return Intl")()', INTL),
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
            // The number after "FBEP_" is the maximum character overhead. The letters after the last
            // underscore have the same meaning as in regular padding blocks.

            FBEP_4_S:
            [
                define('[[true][+(RP_3_NO + FILTER)[30]]]'),
                define('[[true][+(RP_5_N + FILL)[30]]]', FILL),
                define('[[true][+(RP_5_N + FLAT)[30]]]', FLAT),
            ],
            FBEP_9_U:
            [
                define
                ({ expr: '[false][+(ANY_FUNCTION + [])[20]]', solutionType: SolutionType.UNDEFINED }),
            ],

            // Function body padding blocks: prepended to a function to align the function's body at the
            // same position in different engines.
            // The number after "FBP_" is the maximum character overhead. The letters after the last
            // underscore have the same meaning as in regular padding blocks.

            FBP_5_S:
            [
                define('[[false][+IS_IE_SRC_N]]', NO_FF_SRC),
            ],
            FBP_7_NO:
            [
                define
                (
                    {
                        expr: '+("10" + [(RP_4_N + FILTER)[40]] + "00000")',
                        solutionType: SolutionType.WEAK_ALGEBRAIC,
                    }
                ),
                define
                (
                    {
                        expr: '+("10" + [(RP_6_SO + FILL)[40]] + "00000")',
                        solutionType: SolutionType.WEAK_ALGEBRAIC,
                    },
                    FILL
                ),
                define
                (
                    {
                        expr: '+("10" + [(RP_6_SO + FLAT)[40]] + "00000")',
                        solutionType: SolutionType.WEAK_ALGEBRAIC,
                    },
                    FLAT
                ),
            ],
            FBP_8_NO:
            [
                define
                (
                    {
                        expr: '+("1000" + (RP_5_N + FILTER + 0)[40] + "000")',
                        solutionType: SolutionType.WEAK_ALGEBRAIC,
                    }
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
                    { expr: '[true][+(ANY_FUNCTION + [])[0]]', solutionType: SolutionType.UNDEFINED },
                    NO_FF_SRC
                ),
            ],

            // Function header shift: used to adjust an indexer to make it point to the same position in
            // the string representation of a function's header in different engines.
            // This evaluates to an array containing only the number 𝑛 - 1 or only the number 𝑛, where 𝑛
            // is the number after "FH_SHIFT_".

            FH_SHIFT_1:
            [
                define('[+IS_IE_SRC_N]'),
            ],
            FH_SHIFT_3:
            [
                define('[2 + IS_IE_SRC_N]'),
            ],

            // Function header padding blocks: prepended to a function to align the function's header at
            // the same position in different engines.
            // The number after "FHP_" is the maximum character overhead.
            // The letters after the last underscore have the same meaning as in regular padding blocks.

            FHP_3_NO:
            [
                define
                (
                    {
                        expr: '+(1 + [+(ANY_FUNCTION + [])[0]])',
                        solutionType: SolutionType.WEAK_ALGEBRAIC,
                    }
                ),
                define
                (
                    {
                        expr: '+(++(ANY_FUNCTION + [])[0] + [0])',
                        solutionType: SolutionType.WEAK_ALGEBRAIC,
                    },
                    INCR_CHAR
                ),
            ],
            FHP_5_N:
            [
                define({ expr: 'IS_IE_SRC_N', solutionType: SolutionType.ALGEBRAIC }),
            ],
            FHP_8_S:
            [
                define({ expr: '[FHP_3_NO] + RP_5_N', solutionType: SolutionType.COMBINED_STRING }),
                define
                (
                    { expr: 'FHP_5_N + [RP_3_NO]', solutionType: SolutionType.PREFIXED_STRING },
                    INCR_CHAR
                ),
            ],

            // Conditional padding blocks.
            //
            // true if feature IE_SRC is available; false otherwise.
            IS_IE_SRC_N:
            [
                define
                ({ expr: '!!(+(ANY_FUNCTION + [])[0] + true)', solutionType: SolutionType.ALGEBRAIC }),
                define
                (
                    { expr: '!!++(ANY_FUNCTION + [])[0]', solutionType: SolutionType.ALGEBRAIC },
                    INCR_CHAR
                ),
            ],

            // Regular padding blocks.
            //
            // The number after "RP_" is the character overhead.
            // The postifx "_S" in the name indicates that the constant always evaluates to a string or
            // an array.
            // The postfix "_N" in the name indicates that the constant does not always evaluate to a
            // string or an array, but it never evaluates to undefined.
            // The postfix "_U" in the name indicates that the constant can evaluate to undefined.
            // A trailing "O" as in "_NO" and "_SO" is appended to the name if the constant resolves to
            // an expression containing a plus sign ("+") out of brackets not preceded by an exclamation
            // mark ("!"). When concatenating such a constant with other expressions, the outer plus
            // constant should be placed in the beginning whenever possible in order to save an extra
            // pair of brackets in the resolved expressions.

            RP_0_S:     { expr: '[]',       solutionType: SolutionType.OBJECT },
            RP_1_NO:    { expr: '0',        solutionType: SolutionType.WEAK_ALGEBRAIC },
            RP_2_SO:    { expr: '"00"',     solutionType: SolutionType.WEAK_PREFIXED_STRING },
            RP_3_NO:    { expr: 'NaN',      solutionType: SolutionType.WEAK_ALGEBRAIC },
            RP_4_N:     { expr: 'true',     solutionType: SolutionType.ALGEBRAIC },
            RP_5_N:     { expr: 'false',    solutionType: SolutionType.ALGEBRAIC },
            RP_6_SO:    { expr: '"0false"', solutionType: SolutionType.COMBINED_STRING },
        });

        FB_EXPR_INFOS =
        [
            define({ expr: 'FILTER', shift: 6 }),
            define({ expr: 'FILL', shift: 4 }, FILL),
            define({ expr: 'FLAT', shift: 4 }, FLAT),
        ];

        FB_PADDING_INFOS =
        [
            define({ blocks: FB_PADDINGS, shift: 0 }),
            define({ blocks: FB_NO_FF_PADDINGS, shift: 0 }, NO_FF_SRC),
            define({ blocks: FB_NO_IE_PADDINGS, shift: 0 }, NO_IE_SRC),
            define(null, NO_V8_SRC),
            define({ blocks: R_PADDINGS, shift: 0 }, V8_SRC),
            define({ blocks: R_PADDINGS, shift: 5 }, IE_SRC),
            define({ blocks: R_PADDINGS, shift: 4 }, FF_SRC),
        ];

        FH_PADDING_INFOS =
        [
            define({ blocks: FH_PADDINGS, shift: 0 }),
            define({ blocks: R_PADDINGS, shift: 0 }, NO_IE_SRC),
            define({ blocks: R_PADDINGS, shift: 1 }, IE_SRC),
        ];

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
                define(1, ARRAY_ITERATOR, CAPITAL_HTML, FF_SRC, FLAT),
                define(1, ARRAY_ITERATOR, CAPITAL_HTML, FILL, IE_SRC),
                define(1, ARRAY_ITERATOR, CAPITAL_HTML, FILL, NO_IE_SRC),
                define(1, ARRAY_ITERATOR, CAPITAL_HTML, FLAT, IE_SRC),
                define(2, ARRAY_ITERATOR, CAPITAL_HTML),
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
                        var otherArgName = argName !== 'undefined' ? 'undefined' : 'falsefalse';
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
                        var otherArgName = argName !== 'undefined' ? 'undefined' : 'falsefalse';
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

        OPTIMAL_ARG_NAME =
        defineList
        (
            [define('f'), define('undefined')],
            [define(0), define(1, FILL, IE_SRC), define(1, FILL, NO_IE_SRC), define(0, FLAT)]
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
                define(1, ARRAY_ITERATOR, CAPITAL_HTML, FF_SRC, FLAT),
                define(1, ARRAY_ITERATOR, CAPITAL_HTML, FILL, IE_SRC),
                define(1, ARRAY_ITERATOR, CAPITAL_HTML, FILL, NO_IE_SRC),
                define(1, ARRAY_ITERATOR, CAPITAL_HTML, FLAT, IE_SRC),
                define(2),
            ]
        );

        PADDING_ENTRIES_MAP =
        {
            18:
            [
                define(12),
                define({ block: 'RP_0_S', indexer: '2 + FH_SHIFT_3' }, NO_V8_SRC),
                define(3, V8_SRC),
                define(0, IE_SRC),
                define(0, FF_SRC),
            ],
            20:
            [
                define(10),
                define({ block: 'RP_6_SO', indexer: 3 + ' + FH_SHIFT_1' }, NO_V8_SRC),
                define(0, V8_SRC),
                define(5, IE_SRC),
                define(6, FF_SRC),
            ],
            23:
            [
                define(7),
                define(9, NO_FF_SRC),
                define({ block: 'RP_3_NO', indexer: '3 + FH_SHIFT_1' }, NO_V8_SRC),
                define(0, V8_SRC),
                define(3, IE_SRC),
                define(3, FF_SRC),
            ],
            25:
            [
                define(7),
                define(5, NO_FF_SRC),
                define(5, NO_IE_SRC),
                define({ block: 'RP_1_NO', indexer: '3 + FH_SHIFT_1' }, NO_V8_SRC),
                define(0, IE_SRC),
                define(1, FF_SRC),
            ],
            30:
            [
                define(10),
                define({ block: 'RP_6_SO', indexer: 4 + ' + FH_SHIFT_1' }, NO_V8_SRC),
                define(0, V8_SRC),
                define(5, IE_SRC),
                define(6, FF_SRC),
            ],
            32:
            [
                define(8),
                define(9, NO_FF_SRC),
                define(9, NO_IE_SRC),
                define({ block: 'RP_4_N', indexer: '4 + FH_SHIFT_1' }, NO_V8_SRC),
                define(0, V8_SRC),
                define(3, IE_SRC),
                define(4, FF_SRC),
            ],
            34:
            [
                define(7),
                define(9, NO_FF_SRC),
                define(6, INCR_CHAR, NO_FF_SRC),
                define(9, NO_IE_SRC),
                define({ block: 'RP_2_SO', indexer: '4 + FH_SHIFT_1' }, NO_V8_SRC),
                define(6, V8_SRC),
                define(1, IE_SRC),
                define(3, FF_SRC),
            ],
        };

        var replaceStaticExpr;

        initReplaceStaticExpr =
        function (value)
        {
            initReplaceStaticExpr = null;
            replaceStaticExpr = value;
        };

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
    // * The boolean literals "true" and "false"
    // * The pseudoconstant literals "undefined", "NaN" and "Infinity"
    // * ES5 strict mode numeric literals
    // * ES5 strict mode string literals with the line continuation extension
    // * Empty and singleton array literals
    // * ASCII identifiers
    // * ASCII property getters in dot notation
    // * Property getters in bracket notation
    // * Function calls without parameters and with one parameter
    // * The unary operators "!", "+", and to a limited extent "-" and "++" (prefix and postfix
    //   increment)
    // * The binary operators "+" and to a limited extent "-"
    // * Grouping parentheses
    // * White spaces and line terminators
    // * Semicolons
    // * Comments

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

    var SCREW_NORMAL             = 0;
    var SCREW_AS_STRING          = 1;
    var SCREW_AS_BONDED_STRING   = 2;

    var ScrewBuffer;

    var optimizeSolutions;

    (function ()
    {
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

        ScrewBuffer =
        function (screwMode, groupThreshold, optimizerList)
        {
            function gather(offset, count, groupBond, groupForceString)
            {
                var end = offset + count;
                var groupSolutions = solutions.slice(offset, end);
                if (optimizerList.length)
                    optimizeSolutions(optimizerList, groupSolutions, groupBond, groupForceString);
                var str = gatherGroup(groupSolutions, groupBond, groupForceString);
                return str;
            }

            var length = -APPEND_LENGTH_OF_EMPTY;
            var maxSolutionCount = _Math_pow(2, groupThreshold - 1);
            var solutions = [];
            var bond = screwMode === SCREW_AS_BONDED_STRING;
            var forceString = screwMode !== SCREW_NORMAL;

            assignNoEnum
            (
                this,
                {
                    append:
                    function (solution)
                    {
                        if (solutions.length >= maxSolutionCount)
                            return false;
                        solutions.push(solution);
                        var appendLength = solution.appendLength;
                        optimizerList.forEach
                        (
                            function (optimizer)
                            {
                                var currentAppendLength = optimizer.appendLengthOf(solution);
                                if (currentAppendLength < appendLength)
                                    appendLength = currentAppendLength;
                            }
                        );
                        length += appendLength;
                        return true;
                    },
                    get length()
                    {
                        return length;
                    },
                    toString:
                    function ()
                    {
                        function collectOut(offset, count, maxGroupCount, groupBond)
                        {
                            var str;
                            if (count <= groupSize + 1)
                                str = gather(offset, count, groupBond);
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
                                collectOut
                                (offset + leftEndCount, count - leftEndCount, maxGroupCount, true);
                                if (groupBond)
                                    str = '(' + str + ')';
                            }
                            return str;
                        }

                        var str;
                        var solutionCount = solutions.length;
                        if (solutionCount <= groupThreshold)
                            str = gather(0, solutionCount, bond, forceString);
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
                            str = collectOut(0, solutionCount, maxGroupCount, bond);
                        }
                        return str;
                    },
                }
            );
        };

        optimizeSolutions =
        function (optimizerList, solutions, bond, forceString)
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
        };
    }
    )();

    /** @class Encoder */

    var Encoder;

    var replaceMultiDigitNumber;
    var replaceStaticString;

    (function ()
    {
        function evalNumber(preMantissa, lastDigit, exp)
        {
            var value = +(preMantissa + lastDigit + 'e' + exp);
            return value;
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
                    str = mantissa + getExtraZeros(exp);
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
                    '.' + getExtraZeros(extraZeroCount) + mantissa;
                }
            }
            return str;
        }

        function getExtraZeros(count)
        {
            var extraZeros = _Array(count + 1).join('0');
            return extraZeros;
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
                    encoder.throwSyntaxError('String too complex');
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
                encoder.throwSyntaxError('Undefined identifier ' + identifier);
            var groupingRequired =
            bondStrength && solution.isLoose ||
            bondStrength > BOND_STRENGTH_WEAK && solution.replacement[0] === '!';
            var replacement = solution.replacement;
            if (groupingRequired)
                replacement = '(' + replacement + ')';
            return replacement;
        }

        function replaceIndexer(index)
        {
            var replacement = '[' + replaceStaticString(_String(index)) + ']';
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
            mantissa += getExtraZeros(extraZeroCount);
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

        function replaceStaticExpr(expr)
        {
            var solution = STATIC_ENCODER.replaceExpr(expr);
            return solution;
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

        var STATIC_CHAR_CACHE = createEmpty();
        var STATIC_CONST_CACHE = createEmpty();

        var quoteString = _JSON_stringify;

        Encoder =
        function (mask)
        {
            this.mask       = mask;
            this.charCache  = _Object_create(STATIC_CHAR_CACHE);
            this.constCache = _Object_create(STATIC_CONST_CACHE);
            this.optimizers = createEmpty();
            this.stack      = [];
        };

        var protoSource =
        {
            callResolver:
            function (stackName, resolver)
            {
                var stack = this.stack;
                var stackIndex = stack.indexOf(stackName);
                stack.push(stackName);
                try
                {
                    if (~stackIndex)
                    {
                        var chain = stack.slice(stackIndex);
                        var feature = featureFromMask(this.mask);
                        var message =
                        'Circular reference detected: ' + chain.join(' < ') + ' – ' + feature;
                        var error = new _SyntaxError(message);
                        assignNoEnum(error, { chain: chain, feature: feature });
                        throw error;
                    }
                    resolver.call(this);
                }
                finally
                {
                    stack.pop();
                }
            },

            constantDefinitions: CONSTANTS,

            createCharDefaultSolution:
            function (char, charCode, atobOpt, charCodeOpt, escSeqOpt, unescapeOpt)
            {
                var replacement;
                if (atobOpt && this.findDefinition(CONSTANTS.atob))
                    replacement = this.replaceCharByAtob(charCode);
                else
                {
                    var replacements = [];
                    if (charCodeOpt)
                    {
                        replacement = this.replaceCharByCharCode(charCode);
                        replacements.push(replacement);
                    }
                    if (escSeqOpt)
                    {
                        replacement = this.replaceCharByEscSeq(charCode);
                        replacements.push(replacement);
                    }
                    if (unescapeOpt)
                    {
                        replacement = this.replaceCharByUnescape(charCode);
                        replacements.push(replacement);
                    }
                    replacement = shortestOf(replacements);
                }
                var solution = new SimpleSolution(char, replacement, SolutionType.STRING);
                return solution;
            },

            defaultResolveCharacter:
            function (char)
            {
                var charCode = char.charCodeAt();
                var atobOpt = charCode < 0x100;
                var solution =
                this.createCharDefaultSolution(char, charCode, atobOpt, true, true, true);
                return solution;
            },

            expressParse:
            function (expr)
            {
                var unit = expressParse(expr);
                return unit;
            },

            findBase64AlphabetDefinition:
            function (element)
            {
                var definition;
                if (_Array_isArray(element))
                    definition = this.findDefinition(element);
                else
                    definition = element;
                return definition;
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

            findOptimalSolution:
            function (source, entries, defaultSolutionType)
            {
                var result;
                entries.forEach
                (
                    function (entry, entryIndex)
                    {
                        if (this.hasFeatures(entry.mask))
                        {
                            var solution = this.resolve(entry.definition, source, defaultSolutionType);
                            if (!result || result.length > solution.length)
                            {
                                result = solution;
                                solution.entryIndex = entryIndex;
                            }
                        }
                    },
                    this
                );
                return result;
            },

            getPaddingBlock:
            function (paddingInfo, length)
            {
                var paddingBlock = paddingInfo.blocks[length];
                if (paddingBlock !== undefined)
                    return paddingBlock;
                this.throwSyntaxError('Undefined padding block with length ' + length);
            },

            hasFeatures:
            function (mask)
            {
                var included = maskIncludes(this.mask, mask);
                return included;
            },

            hexCodeOf:
            function (charCode, hexDigitCount)
            {
                var optimalB = this.findDefinition(OPTIMAL_B);
                var charCodeStr = charCode.toString(16);
                var hexCodeSmallB =
                getExtraZeros(hexDigitCount - charCodeStr.length) +
                charCodeStr.replace(/fa?$/, 'false');
                var hexCode = hexCodeSmallB.replace(/b/g, optimalB);
                if (optimalB !== 'b' && /(?=.*b.*b)(?=.*c)|(?=.*b.*b.*b)/.test(charCodeStr))
                {
                    // optimalB is not "b", but the character code is a candidate for toString
                    // clustering, which only works with "b".
                    var replacementSmallB = this.replaceString('f' + hexCodeSmallB, { optimize: true });
                    var replacement = this.replaceString('f' + hexCode);
                    if (replacementSmallB.length < replacement.length)
                        hexCode = hexCodeSmallB;
                }
                return hexCode;
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

            replaceCharByAtob:
            function (charCode)
            {
                var param1 =
                BASE64_ALPHABET_LO_6[charCode >> 2] + BASE64_ALPHABET_HI_2[charCode & 0x03];
                var postfix1 = '(' + this.replaceString(param1) + ')';
                if (param1.length > 2)
                    postfix1 += replaceIndexer(0);

                var param2Left = this.findBase64AlphabetDefinition(BASE64_ALPHABET_LO_4[charCode >> 4]);
                var param2Right =
                this.findBase64AlphabetDefinition(BASE64_ALPHABET_HI_4[charCode & 0x0f]);
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
            },

            replaceCharByCharCode:
            function (charCode)
            {
                var arg =
                charCode < 2 ?
                ['[]', 'true'][charCode] : charCode < 10 ? charCode : '"' + charCode + '"';
                var replacement = this.replaceExpr('String[FROM_CHAR_CODE](' + arg + ')');
                return replacement;
            },

            replaceCharByEscSeq:
            function (charCode)
            {
                var escCode;
                var appendIndexer;
                var optimize;
                if (charCode >= 0xfd || charCode in LOW_UNICODE_ESC_SEQ_CODES)
                {
                    escCode = 'u' + this.hexCodeOf(charCode, 4);
                    appendIndexer = escCode.length > 5;
                    optimize = true;
                }
                else
                {
                    escCode = charCode.toString(8);
                    appendIndexer = false;
                    optimize = false;
                }
                var expr = 'Function("return\\"" + ESCAPING_BACKSLASH + "' + escCode + '\\"")()';
                if (appendIndexer)
                    expr += '[0]';
                var replacement = this.replaceExpr(expr, { toStringOpt: optimize });
                return replacement;
            },

            replaceCharByUnescape:
            function (charCode)
            {
                var hexCode;
                var appendIndexer;
                var optimize;
                if (charCode < 0x100)
                {
                    hexCode = this.hexCodeOf(charCode, 2);
                    appendIndexer = hexCode.length > 2;
                    optimize = false;
                }
                else
                {
                    hexCode = 'u' + this.hexCodeOf(charCode, 4);
                    appendIndexer = hexCode.length > 5;
                    optimize = true;
                }
                var expr = 'unescape("%' + hexCode + '")';
                if (appendIndexer)
                    expr += '[0]';
                var replacement = this.replaceExpr(expr, { toStringOpt: optimize });
                return replacement;
            },

            replaceExpr:
            function (expr, optimize)
            {
                var unit = this.expressParse(expr);
                if (!unit)
                    this.throwSyntaxError('Syntax error');
                var replacers = getReplacers(optimize);
                var replacement = this.replaceExpressUnit(unit, false, [], NaN, replacers);
                return replacement;
            },

            replaceExpressUnit:
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
                this.replacePrimaryExpr
                (unit, primaryExprBondStrength, unitIndices, maxCoreLength, replacers);
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
                                this.replaceExpressUnit
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

            replacePrimaryExpr:
            function (unit, bondStrength, unitIndices, maxLength, replacers)
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
                    var minOutputType = SolutionType.UNDEFINED;
                    for (var index = 0; index < count; ++index)
                    {
                        var term = terms[index];
                        var termUnitIndices = count > 1 ? unitIndices.concat(index) : unitIndices;
                        if (strAppender && isStringUnit(term))
                        {
                            var firstSolution =
                            output ? new SimpleSolution(undefined, output, minOutputType) : undefined;
                            output = strAppender(this, term.value, firstSolution);
                            minOutputType = SolutionType.WEAK_PREFIXED_STRING;
                        }
                        else
                        {
                            var maxTermLength =
                            maxCoreLength - (output ? output.length + 1 : 0) -
                            MIN_APPEND_LENGTH * (count - index - 1);
                            var termOutput =
                            this.replaceExpressUnit
                            (term, index, termUnitIndices, maxTermLength, replacers);
                            if (!termOutput)
                                return;
                            if (output)
                            {
                                output += '+' + termOutput;
                                if (minOutputType === SolutionType.UNDEFINED)
                                    minOutputType = SolutionType.WEAK_ALGEBRAIC;
                            }
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
                    output = identifierReplacer(this, identifier, bondStrength, unitIndices, maxLength);
                }
                else
                {
                    var value = unit.value;
                    if (typeof value === 'string')
                    {
                        var strReplacer = replacers.string;
                        var screwMode = bondStrength ? SCREW_AS_BONDED_STRING : SCREW_AS_STRING;
                        output = strReplacer(this, value, screwMode, unitIndices, maxLength);
                    }
                    else if (_Array_isArray(value))
                    {
                        if (value.length)
                        {
                            var replacement =
                            this.replaceExpressUnit
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
                var match;
                var regExp = _RegExp(STR_TOKEN_PATTERN, 'g');
                while (match = regExp.exec(str))
                {
                    var token;
                    var solution;
                    if (token = match[2])
                        solution = this.resolveCharacter(token);
                    else
                    {
                        token = match[1];
                        solution = SIMPLE[token];
                    }
                    if (!buffer.append(solution) || buffer.length > maxLength)
                        return;
                }
                var result = _String(buffer);
                if (!(result.length > maxLength))
                    return result;
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

            resolveCharacter:
            function (char)
            {
                var charCache = this.charCache;
                var solution = charCache[char];
                if (solution === undefined)
                {
                    this.callResolver
                    (
                        quoteString(char),
                        function ()
                        {
                            var entries = CHARACTERS[char];
                            if (!entries || _Array_isArray(entries))
                            {
                                if (entries)
                                    solution = this.findOptimalSolution(char, entries);
                                if (!solution)
                                    solution = this.defaultResolveCharacter(char);
                            }
                            else
                            {
                                solution = STATIC_ENCODER.resolve(entries, char);
                                solution.entryIndex = 'static';
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
                    this.callResolver
                    (
                        constant,
                        function ()
                        {
                            var entries = this.constantDefinitions[constant];
                            if (_Array_isArray(entries))
                            {
                                solution =
                                this.findOptimalSolution(constant, entries, SolutionType.OBJECT);
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

            resolveExprAt:
            function (char, expr, index, entries, paddingInfos)
            {
                if (!entries)
                    this.throwSyntaxError('Missing padding entries for index ' + index);
                var paddingDefinition = this.findDefinition(entries);
                var paddingBlock;
                var indexer;
                if (typeof paddingDefinition === 'number')
                {
                    var paddingInfo = this.findDefinition(paddingInfos);
                    paddingBlock = this.getPaddingBlock(paddingInfo, paddingDefinition);
                    indexer = index + paddingDefinition + paddingInfo.shift;
                }
                else
                {
                    paddingBlock = paddingDefinition.block;
                    indexer = paddingDefinition.indexer;
                }
                var fullExpr = '(' + paddingBlock + '+' + expr + ')[' + indexer + ']';
                var replacement = this.replaceExpr(fullExpr);
                var solution = new SimpleSolution(char, replacement, SolutionType.STRING);
                return solution;
            },

            throwSyntaxError:
            function (message)
            {
                var stack = this.stack;
                var stackLength = stack.length;
                if (stackLength)
                    message += ' in the definition of ' + stack[stackLength - 1];
                throw new _SyntaxError(message);
            },
        };

        assignNoEnum(Encoder.prototype, protoSource);

        var BOND_STRENGTH_NONE      = 0;
        var BOND_STRENGTH_WEAK      = 1;
        var BOND_STRENGTH_STRONG    = 2;

        var LOW_UNICODE_ESC_SEQ_CODES = createEmpty();

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

        var STATIC_ENCODER = new Encoder(maskNew());

        var STR_TOKEN_PATTERN = '(' + _Object_keys(SIMPLE).join('|') + ')|([\\s\\S])';

        replaceMultiDigitNumber =
        function (number)
        {
            var str = formatPositiveNumber(number);
            var replacement = replaceStaticString(str);
            return replacement;
        };

        replaceStaticString =
        function (str, options)
        {
            var replacement = STATIC_ENCODER.replaceString(str, options);
            return replacement;
        };

        initReplaceStaticExpr(replaceStaticExpr);
    }
    )();

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
                for (; ; ++joinerIndex)
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

    var STRATEGIES;

    var createReindexMap;

    (function ()
    {
        function defineStrategy(strategy, minInputLength)
        {
            strategy.MIN_INPUT_LENGTH = minInputLength;
            return strategy;
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
            var minCharIndexArrayStrLength =
            _Math_max((input.length - 1) * APPEND_LENGTH_OF_FALSE - 3, 0);
            return minCharIndexArrayStrLength;
        }

        function initMinFalseTrueCharIndexArrayStrLength()
        {
            return -1;
        }

        function undefinedAsString(replacement)
        {
            if (replacement === '[][[]]')
                replacement += '+[]';
            return replacement;
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
                    var MAX_DECODABLE_ARGS = 65533; // limit imposed by Internet Explorer

                    var input = inputData.valueOf();
                    var long = input.length > MAX_DECODABLE_ARGS;
                    var output = this.encodeByCharCodes(input, long, undefined, maxLength);
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
                    var output = this.encodeByCharCodes(input, undefined, 4, maxLength);
                    return output;
                },
                31
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
                2370
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
                182
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
                178
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
                229
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
                305
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
                224
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
                646
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
                392
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
                }
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
                    var output = this.encodeAndWrapText(input, wrapper, undefined, maxLength);
                    return output;
                }
            ),
        };

        var protoSource =
        {
            callGetFigureLegendInsertions:
            function (getFigureLegendInsertions, figurator, figures)
            {
                var figureLegendInsertions = getFigureLegendInsertions(figurator, figures);
                return figureLegendInsertions;
            },

            callStrategies:
            function (input, options, strategyNames, unitPath)
            {
                var output;
                var inputLength = input.length;
                var perfLog = this.perfLog;
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
                        if (inputLength < strategy.MIN_INPUT_LENGTH)
                            perfStatus = 'skipped';
                        else
                        {
                            this.perfLog = perfInfo.perfLog = [];
                            var before = new _Date();
                            var maxLength = output != null ? output.length : NaN;
                            var newOutput = strategy.call(this, inputData, maxLength);
                            var time = new _Date() - before;
                            this.perfLog = perfLog;
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
                    },
                    this
                );
                return output;
            },

            createCharCodesEncoding:
            function (charCodeArrayStr, long, radix)
            {
                var output;
                var fromCharCode = this.findDefinition(FROM_CHAR_CODE);
                if (radix)
                {
                    output =
                    this.createLongCharCodesOutput
                    (charCodeArrayStr, fromCharCode, 'parseInt(undefined,' + radix + ')');
                }
                else
                {
                    if (long)
                    {
                        output =
                        this.createLongCharCodesOutput(charCodeArrayStr, fromCharCode, 'undefined');
                    }
                    else
                    {
                        var returnString = this.findDefinition(OPTIMAL_RETURN_STRING);
                        var str = returnString + '.' + fromCharCode + '(';
                        output =
                        this.resolveConstant('Function').replacement +
                        '(' +
                        this.replaceString(str, { optimize: true }) +
                        '+' +
                        charCodeArrayStr +
                        '+' +
                        this.resolveCharacter(')').replacement +
                        ')()';
                    }
                }
                return output;
            },

            createCharKeyArrayString:
            function (input, charMap, insertions, substitutions, forceString, maxLength)
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
                this.replaceStringArray
                (charKeyArray, insertions, substitutions, forceString, maxLength);
                return charKeyArrayStr;
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
                this.createJSFuckArrayMapping(charIndexArrayStr, mapper, legend) + '[' +
                this.replaceString('join') + ']([])';
                if (!(output.length > maxLength))
                    return output;
            },

            createJSFuckArrayMapping:
            function (arrayStr, mapper, legend)
            {
                var result =
                arrayStr + '[' + this.replaceString('map', { optimize: true }) + '](' +
                this.replaceExpr(mapper, true) + '(' + legend + '))';
                return result;
            },

            createLongCharCodesOutput:
            function (charCodeArrayStr, fromCharCode, arg)
            {
                var formatter = this.findDefinition(FROM_CHAR_CODE_CALLBACK_FORMATTER);
                var formatterExpr = formatter(fromCharCode, arg);
                var output =
                charCodeArrayStr + '[' + this.replaceString('map', { optimize: true }) + '](' +
                this.replaceExpr('Function("return ' + formatterExpr + '")()', true) + ')[' +
                this.replaceString('join') + ']([])';
                return output;
            },

            encodeAndWrapText:
            function (input, wrapper, unitPath, maxLength)
            {
                var output;
                if (!wrapper || input)
                {
                    var screwMode = !wrapper || wrapper.forceString ? SCREW_AS_STRING : SCREW_NORMAL;
                    output = this.encodeText(input, screwMode, unitPath, maxLength);
                    if (output == null)
                        return;
                }
                else
                    output = '';
                if (wrapper)
                    output = wrapper.call(this, output);
                if (!(output.length > maxLength))
                    return output;
            },

            encodeByCharCodes:
            function (input, long, radix, maxLength)
            {
                var cache = createEmpty();
                var charCodeArray =
                _Array_prototype_map.call
                (
                    input,
                    function (char)
                    {
                        var charCode = cache[char] || (cache[char] = char.charCodeAt().toString(radix));
                        return charCode;
                    }
                );
                var charCodeArrayStr = this.replaceFalseFreeArray(charCodeArray, maxLength);
                if (charCodeArrayStr)
                {
                    var output = this.createCharCodesEncoding(charCodeArrayStr, long, radix);
                    if (!(output.length > maxLength))
                        return output;
                }
            },

            encodeByDblDict:
            function
            (
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
                var legend = this.encodeDictLegend(dictChars, maxLength - minCharIndexArrayStrLength);
                if (!legend)
                    return;
                var figureLegendInsertions =
                this.callGetFigureLegendInsertions(getFigureLegendInsertions, figurator, figures);
                var figureMaxLength = maxLength - legend.length;
                var figureLegend =
                this.replaceStringArray
                (
                    figures,
                    figureLegendInsertions,
                    null,
                    true,
                    figureMaxLength - minCharIndexArrayStrLength
                );
                if (!figureLegend)
                    return;
                var keyFigureArrayStr =
                this.createCharKeyArrayString
                (
                    input,
                    charMap,
                    keyFigureArrayInsertions,
                    null,
                    true,
                    figureMaxLength - figureLegend.length
                );
                if (!keyFigureArrayStr)
                    return;
                var formatter = this.findDefinition(MAPPER_FORMATTER);
                var argName = 'undefined';
                var accessor = '.indexOf(' + argName + ')';
                var mapper = formatter(argName, accessor);
                var charIndexArrayStr =
                this.createJSFuckArrayMapping(keyFigureArrayStr, mapper, figureLegend);
                var output = this.createDictEncoding(legend, charIndexArrayStr, maxLength);
                return output;
            },

            encodeByDenseFigures:
            function (inputData, maxLength)
            {
                var output =
                this.encodeByDblDict
                (
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
                var legend = this.encodeDictLegend(dictChars, maxLength - minCharIndexArrayStrLength);
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
                this.createCharKeyArrayString
                (
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
                this.encodeByDblDict
                (
                    initMinFalseFreeCharIndexArrayStrLength,
                    falseFreeFigurator,
                    getSparseFigureLegendInsertions,
                    [FALSE_FREE_DELIMITER],
                    inputData,
                    maxLength
                );
                return output;
            },

            encodeDictLegend:
            function (dictChars, maxLength)
            {
                if (!(maxLength < 0))
                {
                    var input = dictChars.join('');
                    var output =
                    this.callStrategies
                    (
                        input,
                        { screwMode: SCREW_AS_STRING },
                        ['byCharCodesRadix4', 'byCharCodes', 'plain'],
                        'legend'
                    );
                    if (output && !(output.length > maxLength))
                        return output;
                }
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
                        output = this.replaceExpressUnit(unit, false, [], maxLength, REPLACERS);
                    return output;
                }
            },

            encodeText:
            function (input, screwMode, unitPath, maxLength)
            {
                var output =
                this.callStrategies
                (
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
                        'byCharCodesRadix4',
                        'byCharCodes',
                        'plain',
                    ],
                    unitPath
                );
                if (output != null && !(output.length > maxLength))
                    return output;
            },

            exec:
            function (input, wrapper, strategyNames, perfInfo)
            {
                var perfLog = this.perfLog = [];
                var output = this.callStrategies(input, { wrapper: wrapper }, strategyNames);
                if (perfInfo)
                    perfInfo.perfLog = perfLog;
                delete this.perfLog;
                if (output == null)
                    throw new _Error('Encoding failed');
                return output;
            },

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
        };

        assignNoEnum(Encoder.prototype, protoSource);

        var FALSE_FREE_DELIMITER = { joiner: 'false', separator: 'false' };

        var FALSE_TRUE_DELIMITER = { joiner: '', separator: 'Function("return/(?=false|true)/")()' };

        var REPLACERS =
        {
            identifier:
            function (encoder, identifier, bondStrength, unitIndices, maxLength)
            {
                var unitPath = getUnitPath(unitIndices);
                var replacement =
                encoder.encodeAndWrapText('return ' + identifier, wrapWithCall, unitPath, maxLength);
                return replacement;
            },
            string:
            function (encoder, str, screwMode, unitIndices, maxLength)
            {
                var unitPath = getUnitPath(unitIndices);
                var replacement = encoder.encodeText(str, screwMode, unitPath, maxLength);
                return replacement;
            },
        };

        var falseFreeFigurator = createFigurator([''], 'false');
        var falseTrueFigurator = createFigurator(['false', 'true'], '');

        createReindexMap =
        function (count, radix, amendingCount, coerceToInt)
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
        };
    }
    )();

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

    var BOND_EXTRA_LENGTH = 2; // Extra length of bonding parentheses "(" and ")".
    var NOOP_OPTIMIZER = { appendLengthOf: noop, optimizeSolutions: noop };

    function createOptimizer
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
                            saving += BOND_EXTRA_LENGTH;
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
        if (appendLengthDiff + BOND_EXTRA_LENGTH > 0)
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
            createOptimizer
            (complex, complexSolution, charSet, optimizedCharAppendLength, appendLengthDiff);
        }
        else
            optimizer = NOOP_OPTIMIZER;
        return optimizer;
    }

    // Optimized clusters take the form:

    var BOND_EXTRA_LENGTH$1 = 2; // Extra length of bonding parentheses "(" and ")".
    var CLUSTER_EXTRA_LENGTHS = [];
    var DECIMAL_DIGIT_MAX_COUNTS = [];
    var MAX_RADIX = 36;
    var MAX_SAFE_INTEGER = 0x1fffffffffffff;
    var MIN_SOLUTION_SPAN = 2;
    var RADIX_REPLACEMENTS = [];

    function createOptimizer$1(toStringReplacement)
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
                        discreteAppendLength += BOND_EXTRA_LENGTH$1;
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
        var optimizer = createOptimizer$1(toStringReplacement);
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

    function getEncoder(features)
    {
        var mask = getValidFeatureMask(features);
        var encoder = encoders[mask];
        if (!encoder)
            encoders[mask] = encoder = new Encoder(mask);
        return encoder;
    }

    var encoders = createEmpty();

    var JScrewIt = assignNoEnum({ }, { Feature: Feature, encode: encode });

    function getValidFeatureMask(features)
    {
        var mask = features !== undefined ? validMaskFromArrayOrStringOrFeature(features) : maskNew();
        return mask;
    }

    if (typeof self !== 'undefined')
        self.JScrewIt = JScrewIt;

    if (typeof module !== 'undefined')
        module.exports = JScrewIt;

    if (typeof DEBUG === 'undefined' || /* c8 ignore next */ DEBUG)
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
                        outputEntries = inputEntries.map(cloneEntry);
                    else
                        outputEntries = [createEntryClone(inputEntries, EMPTY_MASK)];
                }
                return outputEntries;
            }

            function cloneEntry(entry)
            {
                entry = createEntryClone(entry.definition, entry.mask);
                return entry;
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
                var entry = { definition: definition, mask: _Object_freeze(mask) };
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

            function getComplexEntry(complex)
            {
                var entry = cloneEntry(COMPLEX[complex]);
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
                    getComplexEntry:            getComplexEntry,
                    getComplexNames:            getComplexNames,
                    getConstantEntries:         getConstantEntries,
                    getConstantNames:           getConstantNames,
                    getEntries:                 getEntries,
                    getStrategies:              getStrategies,
                    maskIncludes:               maskIncludes,
                    maskIsEmpty:                maskIsEmpty,
                    maskNew:                    maskNew,
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
