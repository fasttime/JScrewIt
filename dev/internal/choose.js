'use strict';

const { formatDuration, timeThis }  = require('../../tools/time-utils');
const { prompt }                    = require('inquirer');
const Choices                       = require('inquirer/lib/objects/choices');

function compareChoices(choice1, choice2)
{
    const result = isCapital(choice2) - isCapital(choice1);
    if (result)
        return result;
    if (choice1 > choice2)
        return 1;
    if (choice1 < choice2)
        return -1;
    return 0;
}

function isCapital(name)
{
    const capital = name.toUpperCase() === name;
    return capital;
}

function runCallback(callback, choice)
{
    let errorMessage;
    const duration =
    timeThis
    (
        () =>
        {
            errorMessage = callback(choice);
        },
    );
    if (errorMessage)
        return errorMessage;
    const durationStr = formatDuration(duration);
    console.log('%s elapsed.', durationStr);
}

Choices.prototype.getChoice =
function (selector)
{
    const choice = typeof selector === 'number' ? this.realChoices[selector] : undefined;
    return choice;
};

module.exports =
function (callback, message, choices)
{
    const { argv } = process;
    const [,, choice] = argv;
    if (choice != null)
    {
        const errorMessage = runCallback(callback, choice);
        if (errorMessage != null)
        {
            const { basename } = require('path');

            const command = basename(argv[1]);
            const fullErrorMessage =
            `${errorMessage}\nRun ${command} without arguments for a list of available options.`;
            console.error(fullErrorMessage);
            process.exitCode = 1;
        }
    }
    else
    {
        choices.sort(compareChoices);
        const question =
        { choices, loop: false, message, name: 'choice', pageSize: Infinity, type: 'rawlist' };
        (async () =>
        {
            const { choice } = await prompt(question);
            runCallback(callback, choice);
        }
        )();
    }
};
