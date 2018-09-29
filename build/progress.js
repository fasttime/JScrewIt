'use strict';

const ProgressBar = require('progress');
const chalk = require('chalk');

ProgressBar.prototype.hide =
function ()
{
    if (this.lastDraw)
    {
        const { stream } = this;
        stream.clearLine();
        stream.cursorTo(0);
        this.lastDraw = '';
    }
};

ProgressBar.prototype.terminate =
function ()
{
    if (this.clear)
        this.hide();
    else
    {
        this.stream.write('\n');
        this.lastDraw = '';
    }
};

function progress(label, fn)
{
    const propertyNames = ['error', 'info', 'log', 'warn'];
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
    const bar =
    new ProgressBar
    (
        `${label} :bar :percent :etas`,
        {
            clear:      true,
            complete:   chalk.bgBlue(' '),
            incomplete: chalk.bgWhite(' '),
            total:      Number.MAX_SAFE_INTEGER,
            width:      20,
        }
    );
    bar.render();
    try
    {
        const result = fn(bar);
        return result;
    }
    finally
    {
        bar.terminate();
        for (const [propertyName, value] of originalValues)
            console[propertyName] = value;
    }
}

module.exports = progress;
