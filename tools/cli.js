'use strict';

const { parseArgs } = require('node:util');
const timeUtils     = require('#tools/time-utils');

function byteCount(size, width)
{
    const str = `${String(size).padStart(width)}${size === 1 ? ' byte' : ' bytes'}`;
    return str;
}

function createDiagnosticReport(perfLog)
{
    const reportParts =
    perfLog.map(perfInfoList => formatPerfInfoList(perfInfoList, '', ['', '']));
    reportParts.unshift
    (`\nStrategy                    Status         Length  Time (ms)\n${'─'.repeat(60)}\n`);
    const report = reportParts.join('');
    return report;
}

function createReport(originalSize, screwedSize, encodingTime)
{
    const width = Math.max(widthOf(originalSize), widthOf(screwedSize));
    const expansionFactorStr = originalSize ? (screwedSize / originalSize).toFixed(2) : '-';
    const encodingTimeStr = timeUtils.formatDuration(encodingTime);
    const report =
    `Original size:    ${byteCount(originalSize, width)
    }\nScrewed size:     ${byteCount(screwedSize, width)
    }\nExpansion factor: ${expansionFactorStr
    }\nEncoding time:    ${encodingTimeStr}`;
    return report;
}

function formatCodingLog(perfLog, padding, nextCodingLog)
{
    padding += nextCodingLog ? '│' : ' ';
    let str = '';
    const count = perfLog.length;
    for (let index = 0; index < count; ++index)
    {
        const perfInfoList = perfLog[index];
        const nextPerfInfoList = index < count - 1;
        str += formatPerfInfoList(perfInfoList, padding, nextPerfInfoList ? '├│' : '└ ');
    }
    if (nextCodingLog)
        str += `${padding}\n`;
    return str;
}

function formatInt(int)
{
    const str = int === undefined ? '-' : String(int);
    return str;
}

function formatPerfInfoList(perfInfoList, padding, paddingChars)
{
    // In the current implementation, perfInfoList.name can be either undefined, a unit path or
    // "legend".
    let str = `${padding}${paddingChars[0]}${perfInfoList.name || '(default)'}\n`;
    padding += paddingChars[1];
    const count = perfInfoList.length;
    const paddingLength = padding.length;
    for (let index = 0; index < count; ++index)
    {
        const perfInfo = perfInfoList[index];
        const next = index < count - 1;
        str +=
        `${padding
        }${next ? '├' : '└'
        }${perfInfo.strategyName.padEnd(27 - paddingLength)
        }${perfInfo.status.padEnd(10)
        }${formatInt(perfInfo.outputLength).padStart(11)
        }${formatInt(perfInfo.time).padStart(11)
        }\n`;
        const { perfLog } = perfInfo;
        if (perfLog)
            str += formatCodingLog(perfLog, padding, next);
    }
    return str;
}

function parseCommandLine([,, ...args])
{
    const parsed =
    parseArgs
    (
        {
            args,
            options:
            {
                'call':         { type: 'boolean', short: 'c' },
                'diagnostic':   { type: 'boolean', short: 'd' },
                'eval-flag':    { type: 'boolean', short: 'e' },
                'express':      { type: 'boolean', short: 'x' },
                'features':     { type: 'string',  short: 'f' },
                'help':         { type: 'boolean' },
                'run-as':       { type: 'string',  short: 'r' },
                'trim-code':    { type: 'boolean', short: 't' },
                'version':      { type: 'boolean', short: 'v' },
                'wrap':         { type: 'boolean', short: 'w' },
            },
            allowPositionals:   true,
            strict:             true,
        },
    );
    const { values, positionals } = parsed;
    if (values.help)
        return 'help';
    if (values.version)
        return 'version';
    if (positionals.length > 2)
        throw Error(`Unexpected argument "${positionals[2]}"`);
    const [inputFileName, outputFileName] = positionals;
    const options = { };
    if (values.diagnostic)
        options.perfInfo = { };
    const { features } = values;
    if (features != null)
        options.features = features.trim().split(/(?:\s+|\s*,\s*)/);
    if (values['trim-code'])
        options.trimCode = true;
    const runAs = values['run-as'];
    if (runAs != null)
        options.runAs = runAs;
    else
    {
        const { express } = values;
        const wrapMode =
        values.call ?? values.wrap ? 'call' : values['eval-flag'] ? 'eval' : undefined;
        const runAs = (express ? ['express'] : []).concat(wrapMode ?? []).join('-');
        if (runAs)
            options.runAs = runAs;
    }
    return { inputFileName, outputFileName, options };
}

function widthOf(size)
{
    return String(size).length;
}

module.exports = { createDiagnosticReport, createReport, parseCommandLine };
