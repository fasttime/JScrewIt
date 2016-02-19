/* global CODER_TEST_DATA_LIST */
/* jshint node: true */

'use strict';

var JScrewIt = require('../lib/jscrewit.js');
var kit = require('./verifier-kit.js');
var define              = kit.define;
var findOptimalFeatures = kit.findOptimalFeatures;
var getEntries          = JScrewIt.debug.getEntries;
var verifyComplex       = kit.verifyComplex;
var verifyDefinitions   = kit.verifyDefinitions;
require('../tools/text-utils.js');
require('../test/coder-test-helpers.js');
var timeUtils = require('../tools/time-utils.js');

function compareRoutineNames(name1, name2)
{
    var result = isCapital(name2) - isCapital(name1);
    if (result)
        return result;
    if (name1 > name2)
        return 1;
    if (name1 < name2)
        return -1;
    return 0;
}

function findCoderTestData(coderName)
{
    for (var index = 0;; ++index)
    {
        var coderTestData = CODER_TEST_DATA_LIST[index];
        if (coderTestData.coderName === coderName)
            return coderTestData;
    }
}

function isCapital(name)
{
    var capital = name.toUpperCase() === name;
    return capital;
}

function mismatchCallback()
{
    console.log.apply(console, arguments);
}

function verifyBase64Defs(entries, inputList)
{
    var result =
        function ()
        {
            verifyDefinitions(entries, inputList, mismatchCallback, 'replaceString');
        };
    return result;
}

function verifyCoder(coderName, rivalCoderName)
{
    var result =
        function ()
        {
            var coderTestData = findCoderTestData(coderName);
            var coders = JScrewIt.debug.getCoders();
            var coder = coders[coderName];
            var input = coderTestData.createInput(coder.MIN_INPUT_LENGTH);
            var replacer;
            if (rivalCoderName === undefined)
            {
                replacer =
                    function (encoder)
                    {
                        var inputData = Object(input);
                        var output = coder.call(encoder, inputData);
                        return output;
                    };
            }
            else
            {
                var rivalCoder = coders[rivalCoderName];
                replacer =
                    function (encoder)
                    {
                        var inputData = Object(input);
                        var output = coder.call(encoder, inputData);
                        var rivalOutput = rivalCoder.call(encoder, inputData);
                        if (output.length <= rivalOutput.length)
                            return output;
                    };
            }
            var optimalFeatureObjs = findOptimalFeatures(replacer);
            if (optimalFeatureObjs)
            {
                var featureObj = JScrewIt.Feature(coderTestData.features);
                var featureMatches =
                    function (optimalFeatureObj)
                    {
                        return JScrewIt.Feature.areEqual(optimalFeatureObj, featureObj);
                    };
                if (!optimalFeatureObjs.some(featureMatches))
                {
                    optimalFeatureObjs.forEach(
                        function (featureObj)
                        {
                            console.log(featureObj.toString());
                        }
                    );
                }
            }
            else
                console.log('No optimal features found.');
        };
    return result;
}

var verify = Object.create(null);

verify.Number =
    function ()
    {
        verifyComplex('Number', [define('Number["name"]', 'NAME')], mismatchCallback);
    };
verify.Object =
    function ()
    {
        verifyComplex('Object', [define('Object["name"]', 'NAME')], mismatchCallback);
    };
verify.RegExp =
    function ()
    {
        verifyComplex('RegExp', [define('RegExp["name"]', 'NAME')], mismatchCallback);
    };
verify.String =
    function ()
    {
        verifyComplex('String', [define('String["name"]', 'NAME')], mismatchCallback);
    };

verify['BASE64_ALPHABET_HI_4:0'] =
    verifyBase64Defs(
        getEntries('BASE64_ALPHABET_HI_4:0'),
        ['A', 'B', 'C', 'D']
    );

verify['BASE64_ALPHABET_HI_4:4'] =
    verifyBase64Defs(
        getEntries('BASE64_ALPHABET_HI_4:4'),
        ['Q', 'R', 'S', 'T']
    );

verify['BASE64_ALPHABET_HI_4:5'] =
    verifyBase64Defs(
        getEntries('BASE64_ALPHABET_HI_4:5'),
        ['U', 'V', 'W', 'X']
    );

verify['BASE64_ALPHABET_LO_4:1'] =
    verifyBase64Defs(
        getEntries('BASE64_ALPHABET_LO_4:1'),
        ['0B', '0R', '0h', '0x']
    );

verify['BASE64_ALPHABET_LO_4:3'] =
    verifyBase64Defs(
        getEntries('BASE64_ALPHABET_LO_4:3'),
        ['0D', '0T', '0j', '0z']
    );

verify.FROM_CHAR_CODE =
    function ()
    {
        verifyDefinitions(
                getEntries('FROM_CHAR_CODE'),
                [define('fromCharCode'), define('fromCodePoint', 'FROM_CODE_POINT')],
                mismatchCallback,
                'replaceString'
            );
    };

verify.byCharCodes = verifyCoder('byCharCodes');
verify.byCharCodesRadix4 = verifyCoder('byCharCodesRadix4');
verify.byDict = verifyCoder('byDict', 'byCharCodes');
verify.byDictRadix3 = verifyCoder('byDictRadix3');
verify.byDictRadix4 = verifyCoder('byDictRadix4');
verify.byDictRadix4AmendedBy1 = verifyCoder('byDictRadix4AmendedBy1');
verify.byDictRadix4AmendedBy2 = verifyCoder('byDictRadix4AmendedBy2');
verify.byDictRadix5AmendedBy3 = verifyCoder('byDictRadix5AmendedBy3', 'byDictRadix4AmendedBy2');
verify.byDblDict = verifyCoder('byDblDict');

verify.CREATE_PARSE_INT_ARG =
    function ()
    {
        function findAs(name, match)
        {
            var createParseIntArg;
            entries.some(
                function (entry)
                {
                    createParseIntArg = entry.definition;
                    if (String(createParseIntArg).indexOf(match) >= 0)
                        return true;
                }
            );
            createParseIntArg.toString =
                function ()
                {
                    return name;
                };
            return createParseIntArg;
        }
        
        var entries = getEntries('CREATE_PARSE_INT_ARG');
        var createParseIntArgByReduce       = findAs('createParseIntArgByReduce', '{return');
        var createParseIntArgByReduceArrow  = findAs('createParseIntArgByReduceArrow', '=>');
        var createParseIntArgDefault        = findAs('createParseIntArgDefault', 'replace(/');
        verifyDefinitions(
            entries,
            [
                define(createParseIntArgDefault),
                define(createParseIntArgByReduce),
                define(createParseIntArgByReduceArrow, 'ARROW')
            ],
            mismatchCallback,
            function (createParseIntArg)
            {
                var expr = createParseIntArg(3, 2);
                var replacement = this.replaceString(expr);
                return replacement;
            }
        );
    };

verify.OPTIMAL_B =
    function ()
    {
        verifyDefinitions(
            getEntries('OPTIMAL_B'),
            ['b', 'B'],
            mismatchCallback,
            'resolveCharacter'
        );
    };

var routineName = process.argv[2];
if (routineName != null)
{
    var routine = verify[routineName];
    if (routine)
    {
        var before = new Date();
        routine();
        var time = new Date() - before;
        var timeStr = timeUtils.formatDuration(time);
        console.log('Time elapsed: ' + timeStr);
        return;
    }
}
console.error(
    Object.keys(verify).sort(compareRoutineNames).reduce(
        function (str, routineName)
        {
            return str + '\n* ' + routineName;
        },
        'Please, specify one of the implemented verification routines:'
    )
);
