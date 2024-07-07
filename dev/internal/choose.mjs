import { basename }                 from 'node:path';
import { formatDuration, timeThis } from '../../tools/time-utils.js';
import inquirer                     from 'inquirer';

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

export default async function (callback, message, choices)
{
    const { argv } = process;
    const [,, choice] = argv;
    if (choice != null)
    {
        const errorMessage = runCallback(callback, choice);
        if (errorMessage != null)
        {
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
        const { choice } = await inquirer.prompt(question);
        runCallback(callback, choice);
    }
}
