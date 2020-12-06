'use strict';

const chalk = require('chalk');

const COMPLETE_CHAR_PLACEHOLDER     = '\x01';
const INCOMPLETE_CHAR_PLACEHOLDER   = '\x02';
const COMPLETE_CHAR                 = chalk.bgBlue(' ');
const INCOMPLETE_CHAR               = chalk.bgWhite(' ');
const BAR_WIDTH                     = 20;

function deleteBars()
{
    stream.cork();
    if (bars.length > 1)
        stream.moveCursor(0, 1 - bars.length);
    stream.cursorTo(0);
    stream.clearScreenDown();
    stream.uncork();
}

function formatTime(millisecs)
{
    let str;
    const secs = millisecs / 1000;
    if (secs < 1)
        str = '< 1 s';
    else
    {
        const days = secs / (24 * 60 * 60);
        if (days < 1)
            str = `${secs | 0} s`;
        else if (days < 1000)
            str = `${days | 0} d`;
        else
            str = 'a long time';
    }
    return str;
}

function writeBars(dy)
{
    stream.cork();
    if (dy)
        stream.moveCursor(0, dy);
    const { columns } = stream;
    stream.cursorTo(0);
    stream.clearScreenDown();
    const lines =
    bars.map
    (
        ({ lastDraw }) =>
        lastDraw
        .slice(0, columns)
        .replaceAll(COMPLETE_CHAR_PLACEHOLDER, COMPLETE_CHAR)
        .replaceAll(INCOMPLETE_CHAR_PLACEHOLDER, INCOMPLETE_CHAR),
    )
    .join('\n');
    stream.write(lines);
    stream.uncork();
}

class ProgressBar
{
    constructor(label)
    {
        const prefix = label == null ? '' : `${String(label).replace(/[\0-\x08\x0a-\x1f]/g, '')} `;
        this.format     = `${prefix}\0bar \0percent / \0eta left`;
        this.lastDraw   = undefined;
        this.progress   = 0;
        this.start      = new Date();
        this.render();
    }

    hide()
    {
        if (!stream.isTTY)
            return;
        if (this.lastDraw)
        {
            bars.splice(bars.indexOf(this), 1);
            this.lastDraw = undefined;
            writeBars(-bars.length);
        }
    }

    render()
    {
        if (!stream.isTTY)
            return;
        const { progress } = this;
        const eta = (new Date() - this.start) * (1 / progress - 1);
        const percent = progress * 100;

        // Populate the bar template with percentages and timestamps.
        let str =
        this.format
        .replace('\0eta', formatTime(eta))
        .replace('\0percent', `${percent.toFixed(0)}%`);

        {
            const completeLength = Math.round(BAR_WIDTH * progress);
            const complete = COMPLETE_CHAR_PLACEHOLDER.repeat(completeLength);
            const incomplete = INCOMPLETE_CHAR_PLACEHOLDER.repeat(BAR_WIDTH - completeLength);

            // Fill in the actual progress bar.
            str = str.replace('\0bar', complete + incomplete);
        }

        if (this.lastDraw !== str)
        {
            const dy = Math.min(1 - bars.length, 0);
            if (this.lastDraw === undefined)
                bars.push(this);
            this.lastDraw = str;
            writeBars(dy);
        }
    }

    update(progress)
    {
        if (!(progress >= 0 && progress <= 1))
            return;
        this.progress = progress;
        this.render();
    }
}

const stream = process.stdout;
const bars = [];

async function progress(label, fn)
{
    if (fn === undefined)
    {
        fn = label;
        label = undefined;
    }
    // 'count', 'group', 'groupCollapsed', 'table', 'timeEnd' and 'timeLog' use 'log'.
    // 'trace' uses 'error'.
    // 'assert' uses 'warn'.
    const propertyNames = ['clear', 'debug', 'dir', 'dirxml', 'error', 'info', 'log', 'warn'];
    const originalValues = new Map();
    for (const propertyName of propertyNames)
    {
        const value = console[propertyName];
        originalValues.set(propertyName, value);
        console[propertyName] =
        (...args) =>
        {
            if (stream.isTTY)
            {
                deleteBars();
                value(...args);
                writeBars();
            }
            else
                value(...args);
        };
    }
    let indicator;
    if (label === undefined)
    {
        indicator =
        {
            newBar(label)
            {
                const bar = new ProgressBar(label);
                return bar;
            },
        };
    }
    else
        indicator = new ProgressBar(label);
    try
    {
        const result = await fn(indicator);
        return result;
    }
    finally
    {
        if (stream.isTTY)
            deleteBars();
        bars.splice(0, Infinity);
        for (const [propertyName, value] of originalValues)
            console[propertyName] = value;
    }
}

module.exports = progress;
