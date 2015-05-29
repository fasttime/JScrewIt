/* jshint node: true */

'use strict';

function widthOf(size)
{
    return (size + '').length;
}

function byteCount(size, width)
{
    var str =
        Array(width - widthOf(size) + 1).join(' ') + (size === 1 ? '1 byte' : size + ' bytes');
    return str;
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

function quote(arg)
{
    return '"' + arg + '"';
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

module.exports = { createReport: createReport, parseCommandLine: parseCommandLine };
