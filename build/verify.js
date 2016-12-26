#!/usr/bin/env node

/* eslint-env node */

'use strict';

var JScrewIt = require('../lib/jscrewit');
var chalk = require('chalk');
var kit = require('./verifier-kit');

var define              = kit.define;
var findOptimalFeatures = kit.findOptimalFeatures;
var getEntries          = JScrewIt.debug.getEntries;
var verifyComplex       = kit.verifyComplex;
var verifyDefinitions   = kit.verifyDefinitions;
require('../tools/text-utils');
var timeUtils = require('../tools/time-utils');

function checkCoderFeatureOptimality(
    createInput,
    coders,
    coder,
    minLength,
    progressCallback)
{
    var input = createInput(minLength);
    var replacer =
        function (encoder)
        {
            var inputData = Object(input);
            var output = coder.call(encoder, inputData);
            return output;
        };
    var rivalReplacer =
        function (encoder, maxLength)
        {
            var inputData = Object(input);
            for (var coderName in coders)
            {
                if (isRivalCoderName(coderName))
                {
                    var rivalCoder = coders[coderName];
                    if (rivalCoder !== coder)
                    {
                        var output = rivalCoder.call(encoder, inputData, maxLength);
                        if (output !== void 0)
                            return output;
                    }
                }
            }
        };
    var optimalFeatureObjs = findOptimalFeatures(replacer, rivalReplacer, progressCallback);
    return optimalFeatureObjs;
}

function checkMinInputLength(features, createInput, coders, coder, minLength)
{
    function findBestCoder(inputData)
    {
        var bestCoderName;
        var bestLength = Infinity;
        coderNames.forEach(
            function (coderName)
            {
                var thisCoder = coders[coderName];
                if (thisCoder !== coder)
                {
                    var output = thisCoder.call(encoder, inputData);
                    var length = output.length;
                    if (length < bestLength)
                    {
                        bestCoderName = coderName;
                        bestLength = length;
                    }
                }
            }
        );
        var result = { coderName: bestCoderName, length: bestLength };
        return result;
    }
    
    var encoder = JScrewIt.debug.createEncoder(features);
    var inputDataShort = Object(createInput(minLength - 1));
    var inputDataFit = Object(createInput(minLength));
    var coderNames = Object.keys(coders).filter(isRivalCoderName);
    var ok = true;
    var outputFit = coder.call(encoder, inputDataFit);
    var bestDataFit = findBestCoder(inputDataFit);
    if (bestDataFit.length <= outputFit.length)
    {
        ok = false;
        logWarn('MIN_INPUT_LENGTH is too small for ' + bestDataFit.coderName + '.');
    }
    var outputShort = coder.call(encoder, inputDataShort);
    var bestDataShort = findBestCoder(inputDataShort);
    if (bestDataShort.length > outputShort.length)
    {
        ok = false;
        logWarn('MIN_INPUT_LENGTH is too large for ' + bestDataShort.coderName + '.');
    }
    if (ok)
        logOk('MIN_INPUT_LENGTH is ok.');
}

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
    var CODER_TEST_DATA_LIST = require('./coder-test-data');
    
    for (var index = 0; ; ++index)
    {
        var coderTestData = CODER_TEST_DATA_LIST[index];
        if (coderTestData.coderName === coderName)
            return coderTestData;
    }
}

function findFirstDefinedEntry(entries)
{
    var entry;
    while (entry = entries.shift())
    {
        if (entry.definition)
            return entry;
    }
}

function findFunctionInEntries(entries, name, match)
{
    var fn;
    entries.some(
        function (entry)
        {
            fn = entry.definition;
            if (~String(fn).indexOf(match))
                return true;
        }
    );
    fn.toString =
        function ()
        {
            return name;
        };
    return fn;
}

function isCapital(name)
{
    var capital = name.toUpperCase() === name;
    return capital;
}

function isRivalCoderName(coderName)
{
    return coderName !== 'express' && coderName !== 'text';
}

function logOk(str)
{
    console.log(chalk.green(str));
}

function logWarn(str)
{
    console.log(chalk.yellow(str));
}

function main()
{
    var routineName = process.argv[2];
    if (routineName != null)
    {
        var routine = verify[routineName];
        if (routine)
        {
            var duration = timeUtils.timeThis(routine);
            var durationStr = timeUtils.formatDuration(duration);
            console.log(durationStr + ' elapsed.');
            return;
        }
    }
    printHelpMessage();
}

function mismatchCallback()
{
    Array.prototype.forEach.call(
        arguments,
        function (arg)
        {
            logWarn(arg);
        }
    );
}

function printHelpMessage()
{
    console.error(
        Object.keys(verify).sort(compareRoutineNames).reduce(
            function (str, routineName)
            {
                return str + '\n* ' + routineName;
            },
            'Please, specify one of the implemented verification routines:'
        )
    );
}

function printOptimalFeatureReport(features, optimalFeatureObjs)
{
    if (optimalFeatureObjs)
    {
        var featureObj = JScrewIt.Feature(features);
        var featureMatches =
            function (optimalFeatureObj)
            {
                return JScrewIt.Feature.areEqual(optimalFeatureObj, featureObj);
            };
        if (optimalFeatureObjs.some(featureMatches))
            logOk('Preset features are optimal.');
        else
        {
            var output = 'Preset features are suboptimal. Optimal features are:';
            optimalFeatureObjs.forEach(
                function (optimalFeatureObj)
                {
                    output += '\n' + String(optimalFeatureObj);
                }
            );
            logWarn(output);
        }
    }
    else
        logWarn('No optimal features found.');
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

function verifyCoder(coderName)
{
    var result =
        function ()
        {
            var coderTestData = findCoderTestData(coderName);
            var features = coderTestData.features;
            var createInput = coderTestData.createInput;
            var coders = JScrewIt.debug.getCoders();
            var coder = coders[coderName];
            var minLength = coder.MIN_INPUT_LENGTH;
            checkMinInputLength(features, createInput, coders, coder, minLength);
            var optimalFeatureObjs;
            var ProgressBar = require('progress');
            var bar =
                new ProgressBar(
                    'scanning preset features [:bar] :percent :etas',
                    {
                        complete:   '=',
                        incomplete: ' ',
                        width:      20,
                        total:      100
                    }
                );
            var progressCallback =
                function (progress)
                {
                    bar.update(progress);
                };
            try
            {
                optimalFeatureObjs =
                    checkCoderFeatureOptimality(
                        createInput,
                        coders,
                        coder,
                        minLength,
                        progressCallback
                    );
            }
            finally
            {
                bar.terminate();
            }
            printOptimalFeatureReport(features, optimalFeatureObjs);
        };
    return result;
}

var verify = Object.create(null);

verify.mCh = verifyComplex.bind(null, 'mCh', [define('atob("bUNo")', 'ATOB')], mismatchCallback);

JScrewIt.debug.getComplexNames().forEach(
    function (complexName)
    {
        if (!verify[complexName])
        {
            var entries = JScrewIt.debug.getComplexEntries(complexName);
            var firstDefinedEntry = findFirstDefinedEntry(entries);
            verify[complexName] =
                verifyComplex.bind(null, complexName, [firstDefinedEntry], mismatchCallback);
        }
    }
);

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

verify.CREATE_PARSE_INT_ARG =
    function ()
    {
        var entries = getEntries('CREATE_PARSE_INT_ARG');
        var availableEntries = getEntries('CREATE_PARSE_INT_ARG:available');
        verifyDefinitions(
            entries,
            availableEntries,
            mismatchCallback,
            function (createParseIntArg)
            {
                var expr = createParseIntArg(3, 2);
                var replacement = this.replaceString(expr);
                return replacement;
            }
        );
    };

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

verify.FROM_CHAR_CODE_CALLBACK_FORMATTER =
    function ()
    {
        function findAs(name, match)
        {
            return findFunctionInEntries(entries, name, match);
        }
        
        var entries = getEntries('FROM_CHAR_CODE_CALLBACK_FORMATTER');
        var fromCharCodeCallbackFormatterArrow =
            findAs('fromCharCodeCallbackFormatterArrow', '=>');
        var fromCharCodeCallbackFormatterDefault =
            findAs('fromCharCodeCallbackFormatterDefault', 'return');
        verifyDefinitions(
            entries,
            [
                define(fromCharCodeCallbackFormatterDefault),
                define(fromCharCodeCallbackFormatterArrow, 'ARROW')
            ],
            mismatchCallback,
            function (formatter)
            {
                var str = formatter('0');
                var replacement = this.replaceString(str);
                return replacement;
            }
        );
    };

verify.MAPPER_FORMATTER =
    function ()
    {
        function findAs(name, match)
        {
            return findFunctionInEntries(entries, name, match);
        }
        
        var entries = getEntries('MAPPER_FORMATTER');
        var mapperFormatterDblArrow = findAs('mapperFormatterDblArrow', '=>');
        var mapperFormatterDefault  = findAs('mapperFormatterDefault', 'function');
        verifyDefinitions(
            entries,
            [define(mapperFormatterDefault), define(mapperFormatterDblArrow, 'ARROW')],
            mismatchCallback,
            function (formatter)
            {
                var expr = formatter('[undefined]');
                var replacement = this.replaceExpr(expr);
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

verify.byCharCodes = verifyCoder('byCharCodes');
verify.byCharCodesRadix4 = verifyCoder('byCharCodesRadix4');
verify.byDenseFigures = verifyCoder('byDenseFigures');
verify.byDict = verifyCoder('byDict', 'byCharCodes');
verify.byDictRadix3 = verifyCoder('byDictRadix3');
verify.byDictRadix4 = verifyCoder('byDictRadix4');
verify.byDictRadix4AmendedBy1 = verifyCoder('byDictRadix4AmendedBy1');
verify.byDictRadix4AmendedBy2 = verifyCoder('byDictRadix4AmendedBy2');
verify.byDictRadix5AmendedBy3 = verifyCoder('byDictRadix5AmendedBy3');
verify.bySparseFigures = verifyCoder('bySparseFigures');

main();
