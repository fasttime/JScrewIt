/* global CODER_TEST_DATA_LIST */
/* jshint node: true */

'use strict';

var JScrewIt = require('../lib/jscrewit.js');
var kit = require('./verifier-kit.js');
var define              = kit.define;
var findOptimalFeatures = kit.findOptimalFeatures;
var verifyDefinitions   = kit.verifyDefinitions;
require('../tools/text-utils.js');
require('../test/coder-test-helpers.js');

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

verify['base64-1'] =
    verifyBase64Defs(
        [
            define('A'),
            define('C', 'CAPITAL_HTML'),
            define('B', 'CAPITAL_HTML', 'ENTRIES_OBJ'),
            define('A', 'ARRAY_ITERATOR')
        ],
        ['A', 'B', 'C', 'D']
    );

verify['base64-2'] =
    verifyBase64Defs(
        [
            define('S'),
            define('R', 'CAPITAL_HTML'),
            define('S', 'CAPITAL_HTML', 'ENTRIES_OBJ')
        ],
        ['Q', 'R', 'S', 'T']
    );

verify['base64-3'] =
    verifyBase64Defs(
        [
            define('U'),
            define('V', 'ATOB'),
            define('W', 'ANY_WINDOW'),
            define('V', 'ATOB', 'ENTRIES_OBJ'),
            define('W', 'ATOB', 'DOMWINDOW', 'ENTRIES_OBJ'),
            define('W', 'ATOB', 'ENTRIES_OBJ', 'WINDOW'),
            define('U', 'CAPITAL_HTML')
        ],
        ['U', 'V', 'W', 'X']
    );

verify['base64-4'] =
    verifyBase64Defs(
        [
            define('0B'),
            define('0R', 'CAPITAL_HTML'),
            define('0B', 'ENTRIES_OBJ')
        ],
        ['0B', '0R', '0h', '0x']
    );

verify['base64-5'] =
    verifyBase64Defs(
        [
            define('0j'),
            define('0T', 'CAPITAL_HTML'),
            define('0j', 'ENTRIES_OBJ')
        ],
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
