/* global CODER_TEST_DATA_LIST */
/* jshint node: true */

'use strict';

var JScrewIt = require('../lib/jscrewit.js');
var kit = require('./verifier-kit.js');
var define              = kit.define;
var findOptimalFeatures = kit.findOptimalFeatures;
var verifyComplex       = kit.verifyComplex;
var verifyDefinitions   = kit.verifyDefinitions;
require('../tools/text-utils.js');
require('../test/coder-test-helpers.js');

var createParseIntArgByReduce = JScrewIt.debug.createParseIntArgByReduce;
createParseIntArgByReduce.toString =
    function ()
    {
        return 'createParseIntArgByReduce';
    };
var createParseIntArgDefault = JScrewIt.debug.createParseIntArgDefault;
createParseIntArgDefault.toString =
    function ()
    {
        return 'createParseIntArgDefault';
    };

function findCoderTestData(coderName)
{
    for (var index = 0;; ++index)
    {
        var coderTestData = CODER_TEST_DATA_LIST[index];
        if (coderTestData.coderName === coderName)
            return coderTestData;
    }
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

verify['base64-1'] =
    verifyBase64Defs(
        JScrewIt.debug.BASE64_ALPHABET_HI_4[0],
        ['A', 'B', 'C', 'D']
    );

verify['base64-2'] =
    verifyBase64Defs(
        JScrewIt.debug.BASE64_ALPHABET_HI_4[4],
        ['Q', 'R', 'S', 'T']
    );

verify['base64-3'] =
    verifyBase64Defs(
        JScrewIt.debug.BASE64_ALPHABET_HI_4[5],
        ['U', 'V', 'W', 'X']
    );

verify['base64-4'] =
    verifyBase64Defs(
        JScrewIt.debug.BASE64_ALPHABET_LO_4[1],
        ['0B', '0R', '0h', '0x']
    );

verify['base64-5'] =
    verifyBase64Defs(
        JScrewIt.debug.BASE64_ALPHABET_LO_4[3],
        ['0D', '0T', '0j', '0z']
    );

verify.byCharCodes = verifyCoder('byCharCodes');
verify.byCharCodesRadix4 = verifyCoder('byCharCodesRadix4');
verify.byDict = verifyCoder('byDict', 'byCharCodes');
verify.byDictRadix3 = verifyCoder('byDictRadix3');
verify.byDictRadix4 = verifyCoder('byDictRadix4');
verify.byDictRadix4AmendedBy1 = verifyCoder('byDictRadix4AmendedBy1');
verify.byDictRadix4AmendedBy2 = verifyCoder('byDictRadix4AmendedBy2');
verify.byDictRadix5AmendedBy3 = verifyCoder('byDictRadix5AmendedBy3', 'byDictRadix4AmendedBy2');
verify.byDblDict = verifyCoder('byDblDict');

verify.parseIntArg =
    function ()
    {
        verifyDefinitions(
            JScrewIt.debug.CREATE_PARSE_INT_ARG,
            undefined,
            mismatchCallback,
            function (createParseIntArg)
            {
                var expr = createParseIntArg(3, 2);
                var replacement = this.replaceString(expr);
                return replacement;
            },
            createParseIntArgDefault
        );
    };

var routineName = process.argv[2];
if (routineName != null)
{
    var routine = verify[routineName];
    if (routine)
    {
        routine();
        return;
    }
}
console.error(
    Object.keys(verify).sort().reduce(
        function (str, routineName)
        {
            return str + '\n* ' + routineName;
        },
        'Please, specify one of the implemented verification routines:'
    )
);
