#!/usr/bin/env node

import { constants as fsConstants, fstatSync, readFileSync }    from 'node:fs';
import { access, readFile }                                     from 'node:fs/promises';
import { dirname }                                              from 'node:path';
import { Readable }                                             from 'node:stream';
import { parseArgs }                                            from 'node:util';
import { Client }                                               from 'basic-ftp';

const JSCREWIT_MIN_PATH = 'lib/jscrewit.min.js';
const REMOTE_HOME = '/html';

{
    const pkgDir = dirname(import.meta.dirname);
    process.chdir(pkgDir);
}

if (!await deploy())
    process.exitCode = 1;

async function createIndex(compatibilityNotice)
{
    const input = await readFile('JScrewIt.html', 'utf-8');
    const { groups: { start, end } } = input.match(/^(?<start>.*)\n\n(?<end><body>.*)\n$/s);
    const bannerStyleMarkup =
    compatibilityNotice ?
    `
<!-- Compatibility notice banner style element inserted -->
<style>

body.hasBanner { padding-top: 40px; }

#compatibilityNotice
{
    align-items: center;
    background: #b3d8ff;
    border-bottom: thin solid #e0e0e0;
    color: black;
    display: none;
    font: 13.5pt sans-serif;
    height: 40px;
    justify-content: space-between;
    left: 0;
    padding: 4px 16px;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 1;
}

body.hasBanner #compatibilityNotice { display: flex; }

#compatibilityNotice a { color: black; text-decoration: underline; }

#compatibilityNotice button
{
    align-items: center;
    background: transparent;
    border: none;
    color: black;
    cursor: pointer;
    display: flex;
    font: 24px/24px sans-serif;
    justify-content: center;
    padding: 0;
    width: 24px;
}

#compatibilityNotice button:hover { opacity: .5; }

</style>
<!-- End of insertion -->` :
    '';
    const bannerHTML =
    compatibilityNotice ?
    `
<!-- Compatibility notice banner HTML inserted -->
<div id='compatibilityNotice'>
    <span>
    Compatibility with older engines has been removed.
    <a href='https://github.com/fasttime/JScrewIt?tab=readme-ov-file#compatibility'
    target='_blank'>Learn more…</a>
    </span>
    <button id='closeBannerButton'>×</button>
</div>
<script>
addEventListener
(
    'DOMContentLoaded',
    function ()
    {
        if (localStorage.getItem('bannerClosed'))
            return;
        var bodyClassList = document.body.classList;
        bodyClassList.add('hasBanner');
        closeBannerButton.onclick =
        function ()
        {
            localStorage.setItem('bannerClosed', '1');
            bodyClassList.remove('hasBanner');
        };
    }
);
</script>
<!-- End of insertion -->` :
    '';
    const output =
    `${start}${bannerStyleMarkup}
<!-- Fork me ribbon style element inserted -->
<style>

#forkmeongithub
{
    background: #00c;
    box-shadow: 0 3px 6px rgba(0, 0, 0, .333);
    color: white;
    display: none;
    font: bold 12.5px/36px sans-serif;
    position: fixed;
    right: calc(60px * (1 - 1.414) - 36px / 2 - (6px + 3px) * 1.414);
    text-align: center;
    text-decoration: none;
    top: calc(60px - 36px / 2);
    -ms-transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    -webkit-transition: font .25s;
    transition: font .25s;
    width: calc((60px + (6px + 3px)) * 2 * 1.414 + 36px);
}

body.hasBanner #forkmeongithub { top: calc(40px + 60px - 36px / 2); }

@media screen and (min-width: 800px) { #forkmeongithub { display: block; } }

#forkmeongithub::after { bottom: 1px; }

#forkmeongithub::before { top: 1px; }

#forkmeongithub::after, #forkmeongithub::before
{
    background: #eee;
    content: '';
    display: block;
    height: 1.33px;
    left: 0;
    position: absolute;
    right: 0;
}

#forkmeongithub:hover { font-size: 15px; }

#forkmeongithub:active:hover { background: #c60; }

</style>
<!-- End of insertion -->
${end}
<!-- Fork me ribbon HTML inserted -->
<a id='forkmeongithub' href='https://github.com/fasttime/JScrewIt'>Fork me on GitHub</a>
<!-- End of insertion -->${bannerHTML}
`;

    const readable = Readable.from([output]);
    return readable;
}

async function deploy()
{
    if (!await verifyBuild())
        return false;
    const { values: { 'compatibility-notice': compatibilityNotice, preview } } =
    parseArgs
    ({ options: { 'compatibility-notice': { type: 'boolean' }, preview: { type: 'boolean' } } });
    const readable = await createIndex(compatibilityNotice);
    if (preview)
    {
        readable.pipe(process.stdout);
        return true;
    }
    const ftpAccessOptions = readFTPAccessOptions();
    if (ftpAccessOptions == null)
        return false;
    const client = new Client();
    try
    {
        await client.access(ftpAccessOptions);

        await client.ensureDir(REMOTE_HOME);
        await client.uploadFrom(readable, 'index.html');

        await client.ensureDir('lib');
        await client.clearWorkingDir();
        await client.uploadFrom(JSCREWIT_MIN_PATH, 'jscrewit.min.js');

        await client.ensureDir('../ui');
        await client.clearWorkingDir();
        await client.uploadFromDir('ui');
    }
    finally
    {
        client.close();
    }
    return true;
}

function readFTPAccessOptions()
{
    let content;
    try
    {
        const { fd } = process.stdin;
        // Fail with code "EISDIR" on Windows if stdin is not ready.
        fstatSync(fd);
        // Fail with code "EAGAIN" on Unix if stdin is not ready.
        content = readFileSync(fd, 'utf-8');
    }
    catch (error)
    {
        const { code } = error;
        if (code === 'EISDIR' || code === 'EAGAIN')
        {
            console.error('Please, provide basic-ftp access options in JSON format through stdin.');
            return;
        }
        throw error;
    }
    const ftpAccessOptions = JSON.parse(content);
    return ftpAccessOptions;
}

async function verifyBuild()
{
    const promises = [verifyReadable(JSCREWIT_MIN_PATH), verifyReadable('ui/ui.js')];
    const results = await Promise.all(promises);
    const anyError = results.some(result => !result);
    if (anyError)
    {
        console.error('Please, run \'npm run build\' before deploying.');
        return false;
    }
    return true;
}

async function verifyReadable(filename)
{
    try
    {
        await access(filename, fsConstants.R_OK);
    }
    catch (error)
    {
        if (error.code === 'ENOENT')
        {
            console.error(`File '${filename}' not found in JScrewIt folder.`);
            return false;
        }
        throw error;
    }
    return true;
}
