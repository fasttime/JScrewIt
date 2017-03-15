/* eslint-env node */
/* global padLeft, padRight, repeat */

'use strict';

require('./text-utils');
var timeUtils = require('./time-utils');

function byteCount(size, width)
{
    var str = padLeft(size, width) + (size === 1 ? ' byte' : ' bytes');
    return str;
}

function createDiagnosticReport(codingLog)
{
    var report =
        '\nCoder                       Status         Length  Time (ms)\n' +
        repeat('─', 60) + '\n' +
        codingLog.reduce(
            function (str, perfInfoList)
            {
                str += formatPerfInfoList(perfInfoList, '', ['', '']);
                return str;
            },
            ''
        );
    return report;
}

function createReport(originalSize, screwedSize, encodingTime)
{
    var width = Math.max(widthOf(originalSize), widthOf(screwedSize));
    var expansionFactorStr = originalSize ? (screwedSize / originalSize).toFixed(2) : '-';
    var encodingTimeStr = timeUtils.formatDuration(encodingTime);
    var report =
        'Original size:    ' + byteCount(originalSize, width) +
        '\nScrewed size:     ' + byteCount(screwedSize, width) +
        '\nExpansion factor: ' + expansionFactorStr +
        '\nEncoding time:    ' + encodingTimeStr;
    return report;
}

function formatCodingLog(codingLog, padding, nextCodingLog)
{
    padding += nextCodingLog ? '│' : ' ';
    var str = '';
    var count = codingLog.length;
    for (var index = 0; index < count; ++index)
    {
        var perfInfoList = codingLog[index];
        var nextPerfInfoList = index < count - 1;
        str += formatPerfInfoList(perfInfoList, padding, nextPerfInfoList ? '├│' : '└ ');
    }
    if (nextCodingLog)
        str += padding + '\n';
    return str;
}

function formatInt(int)
{
    var str = int === undefined ? '-' : int;
    return str;
}

function formatPerfInfoList(perfInfoList, padding, paddingChars)
{
    var str = padding + paddingChars[0] + (perfInfoList.name || '(default)') + '\n';
    padding += paddingChars[1];
    var count = perfInfoList.length;
    var paddingLength = padding.length;
    var codingLog;
    for (var index = 0; index < count; ++index)
    {
        var perfInfo = perfInfoList[index];
        var next = index < count - 1;
        str +=
            padding + (next ? '├' : '└') +
            padRight(perfInfo.coderName, 27 - paddingLength) +
            padRight(perfInfo.status, 10) +
            padLeft(formatInt(perfInfo.outputLength), 11) +
            padLeft(formatInt(perfInfo.time), 11) +
            '\n';
        codingLog = perfInfo.codingLog;
        if (codingLog)
            str += formatCodingLog(codingLog, padding, next);
    }
    return str;
}

function parseCommandLine(argv)
{
    function parseFeatures()
    {
        var arg2 = argv[++index];
        if (arg2 === undefined)
            throw Error('option ' + quote(arg) + ' requires an argument');
        options.features = arg2.trim().split(/(?:\s+|\s*,\s*)/);
    }
    
    function parseFlag(char)
    {
        switch (char)
        {
        case 'c':
        case 'w':
            wrapMode = 'call';
            break;
        case 'd':
            options.perfInfo = { };
            break;
        case 'e':
            wrapMode = 'eval';
            break;
        case 't':
            options.trimCode = true;
            break;
        case 'x':
            express = true;
            break;
        default:
            throw Error('unrecognized flag ' + quote(char));
        }
    }
    
    function parseRunAs()
    {
        var arg2 = argv[++index];
        if (arg2 === undefined)
            throw Error('option ' + quote(arg) + ' requires an argument');
        options.runAs = arg2;
    }
    
    var inputFileName;
    var outputFileName;
    var options = { };
    var arg;
    var express;
    var wrapMode;
    
    for (var index = 2; index < argv.length; ++index)
    {
        arg = argv[index];
        var flag;
        if (/^--/.test(arg))
        {
            flag = arg.slice(2);
            switch (flag)
            {
            case 'diagnostic':
                options.perfInfo = { };
                break;
            case 'features':
                parseFeatures();
                break;
            case 'help':
            case 'version':
                return flag;
            case 'run-as':
            case 'wrap-with':
                parseRunAs();
                break;
            case 'trim-code':
                options.trimCode = true;
                break;
            default:
                throw Error('unrecognized option ' + quote(arg));
            }
        }
        else if (/^-/.test(arg))
        {
            flag = arg.slice(1);
            if (flag === 'f')
                parseFeatures();
            else if (flag === 'r')
                parseRunAs();
            else
                flag.split('').forEach(parseFlag);
        }
        else
        {
            if (outputFileName != null)
                throw Error('unexpected argument ' + quote(arg));
            if (inputFileName != null)
                outputFileName = arg;
            else
                inputFileName = arg;
        }
    }
    if (!options.runAs)
    {
        var runAs = (express ? ['express'] : []).concat(wrapMode || []).join('-');
        if (runAs)
            options.runAs = runAs;
    }
    var result = { inputFileName: inputFileName, outputFileName: outputFileName, options: options };
    return result;
}

function quote(arg)
{
    return '"' + arg + '"';
}

function widthOf(size)
{
    return (size + '').length;
}

module.exports =
{
    createDiagnosticReport: createDiagnosticReport,
    createReport:           createReport,
    parseCommandLine:       parseCommandLine,
};
