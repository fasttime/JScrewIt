/* global padLeft, padRight, repeat */
/* jshint node: true */

'use strict';

require('./text-utils.js');

function byteCount(size, width)
{
    var str = padLeft(size, width) + (size === 1 ? ' byte' : ' bytes');
    return str;
}

function createDiagnosticReport(codingLog)
{
    var report =
        '\nCoder                     Status         Length  Time (ms)\n' +
        repeat('─', 58) + '\n' +
        codingLog.reduce(
            function (report, perfInfoList)
            {
                report += formatPerfInfoList(perfInfoList, ['', '']);
                return report;
            },
            ''
        );
    return report;
}

function createReport(originalSize, screwedSize, encodingTime)
{
    var width = Math.max(widthOf(originalSize), widthOf(screwedSize));
    var encodingTimeStr = encodingTime < 5 ? '< 0.01 s' : (encodingTime / 1000).toFixed(2) + ' s';
    var report =
        'Original size:    ' + byteCount(originalSize, width) +
        '\nScrewed size:     ' + byteCount(screwedSize, width) +
        '\nExpansion factor: ' + (screwedSize / originalSize).toFixed(2) +
        '\nEncoding time:    ' + encodingTimeStr;
    return report;
}

function formatCodingLog(codingLog, margin)
{
    var result = '';
    var count = codingLog.length;
    for (var index = 0; index < count; ++index)
    {
        var perfInfoList = codingLog[index];
        result +=
            '│' +
            formatPerfInfoList(
                perfInfoList,
                index < count - 1 ? ['├', '││'] : ['└', '│ ', margin]
            );
    }
    return result;
}

function formatInt(int)
{
    var result = int != null ? int : '-' ;
    return result;
}

function formatPerfInfoList(perfInfoList, paddingData)
{
    var result = paddingData[0] + (perfInfoList.name || '(default)') + '\n';
    var count = perfInfoList.length;
    var padding = paddingData[1];
    var paddingLength = padding.length;
    for (var index = 0; index < count; ++index)
    {
        var perfInfo = perfInfoList[index];
        var next = index < count - 1;
        result += padding + (next ? '├' : '└') +
            padRight(perfInfo.coderName, 25 - paddingLength) + padRight(perfInfo.status, 10) +
            padLeft(formatInt(perfInfo.outputLength), 11) + padLeft(formatInt(perfInfo.time), 11) +
            '\n';
        var codingLog = perfInfo.codingLog;
        if (codingLog)
        {
            result += formatCodingLog(codingLog, next);
        }
    }
    if (paddingData[2])
    {
        result += padding.replace(/ +$/, '') + '\n';
    }
    return result;
}

function parseCommandLine(argv)
{
    function parseFeatures()
    {
        var arg2 = argv[++index];
        if (arg2 === undefined)
        {
            throw Error('option ' + quote(arg) + ' requires an argument');
        }
        options.features = arg2.trim().split(/(?:\s+|\s*\,\s*)/);
    }
    
    function parseFlag(char)
    {
        switch (char)
        {
        case 'c':
        case 'w':
            options.wrapWith = 'call';
            break;
        case 'd':
            options.perfInfo = { };
            break;
        case 'e':
            options.wrapWith = 'eval';
            break;
        case 't':
            options.trimCode = true;
            break;
        default:
            throw Error('unrecognized flag ' + quote(char));
        }
    }
    
    var inputFileName;
    var outputFileName;
    var options = { };
    var arg;
    
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
            case 'trim-code':
                options.trimCode = true;
                break;
            case 'wrap-with-call':
                options.wrapWith = 'call';
                break;
            case 'wrap-with-eval':
                options.wrapWith = 'eval';
                break;
            default:
                throw Error('unrecognized option ' + quote(arg));
            }
        }
        else if (/^-/.test(arg))
        {
            flag = arg.slice(1);
            if (flag === 'f')
            {
                parseFeatures();
            }
            else
            {
                flag.split('').forEach(parseFlag);
            }
        }
        else
        {
            if (outputFileName != null)
            {
                throw Error('unexpected argument ' + quote(arg));
            }
            if (inputFileName != null)
            {
                outputFileName = arg;
            }
            else
            {
                inputFileName = arg;
            }
        }
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
    parseCommandLine:       parseCommandLine
};
