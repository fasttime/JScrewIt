import { basename }                 from 'node:path';
import { formatDuration, timeThis } from '../../tools/time-utils.js';
import rawlist                      from '@inquirer/rawlist';

function compareNames(name1, name2)
{
    const result = isCapital(name2) - isCapital(name1);
    if (result)
        return result;
    if (name1 > name2)
        return 1;
    if (name1 < name2)
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

export default async function (callback, message, names)
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
        const choices = names.toSorted(compareNames).map(name => ({ name, value: name }));
        const question = { choices, loop: false, message, name: 'choice' };
        let choice;
        try
        {
            choice = await rawlist(question);
        }
        catch (error)
        {
            if (error.name === 'ExitPromptError') return;
            throw error;
        }
        runCallback(callback, choice);
    }
}
