'use strict';

const chalk = require('chalk');

const COMPLETE_CHAR     = chalk.bgBlue(' ');
const INCOMPLETE_CHAR   = chalk.bgWhite(' ');
const BAR_WIDTH         = 20;

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

class ProgressBar
{
    constructor(fmt)
    {
        this.fmt        = fmt;
        this.stream     = process.stdout;
        this.progress   = 0;
        this.lastDraw   = '';
        this.start      = new Date();
    }

    hide()
    {
        const { stream } = this;
        if (!stream.isTTY)
            return;
        if (this.lastDraw)
        {
            stream.clearLine();
            stream.cursorTo(0);
            this.lastDraw = '';
        }
    }

    render()
    {
        const { stream } = this;
        if (!stream.isTTY)
            return;
        const { progress } = this;
        const eta = (new Date() - this.start) * (1 / progress - 1);
        const percent = progress * 100;

        // Populate the bar template with percentages and timestamps.
        let str =
        this.fmt.replace('\0eta', formatTime(eta)).replace('\0percent', `${percent.toFixed(0)}%`);

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
            stream.clearLine();
            stream.cursorTo(0);
            stream.write(str);
            this.lastDraw = str;
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

function progress(label, fn)
{
    label = String(label).replace(/[\0-\x08\x0a-\x1f]/g, '');
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
            bar.hide();
            value(...args);
            bar.render();
        };
    }
    const bar = new ProgressBar(`${label} \0bar \0percent / \0eta left`);
    bar.render();
    try
    {
        const result = fn(bar);
        return result;
    }
    finally
    {
        bar.hide();
        for (const [propertyName, value] of originalValues)
            console[propertyName] = value;
    }
}

module.exports = progress;
