'use strict';

const chalk = require('chalk');

const COMPLETE_CHAR     = chalk.bgBlue(' ');
const INCOMPLETE_CHAR   = chalk.bgWhite(' ');
const BAR_WIDTH         = 20;

function deleteBars()
{
    if (bars.length > 1)
        stream.moveCursor(0, 1 - bars.length);
    stream.cursorTo(0);
    stream.clearScreenDown();
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

function writeBars()
{
    stream.cursorTo(0);
    stream.clearScreenDown();
    bars.forEach
    (
        (bar, index) =>
        {
            if (index)
                stream.moveCursor(0, 1);
            stream.cursorTo(0);
            stream.write(bar.lastDraw);
        },
    );
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
            stream.moveCursor(0, -bars.length);
            this.lastDraw = undefined;
            writeBars();
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
            // Compute the available space for the bar.
            const availableSpace = Math.max(0, stream.columns - str.replace('\0bar', '').length);
            const width = Math.min(BAR_WIDTH, availableSpace);
            const completeLength = Math.round(width * progress);
            const complete = COMPLETE_CHAR.repeat(completeLength);
            const incomplete = INCOMPLETE_CHAR.repeat(width - completeLength);

            // Fill in the actual progress bar.
            str = str.replace('\0bar', complete + incomplete);
        }

        if (this.lastDraw !== str)
        {
            if (bars.length > 1)
                stream.moveCursor(0, 1 - bars.length);
            if (this.lastDraw === undefined)
                bars.push(this);
            this.lastDraw = str;
            writeBars();
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
            deleteBars();
            value(...args);
            writeBars();
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
        deleteBars();
        bars.splice(0, Infinity);
        for (const [propertyName, value] of originalValues)
            console[propertyName] = value;
    }
}

module.exports = progress;
