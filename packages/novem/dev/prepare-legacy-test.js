#!/usr/bin/env node

import { fork, spawn }      from 'child_process';
import { promises }         from 'fs';
import { createRequire }    from 'module';
import { EOL }              from 'os';
import { dirname, join }    from 'path';
import { fileURLToPath }    from 'url';

const NODE_LEGACY_DIR = 'test/node-legacy';

function endOf(childProcess)
{
    const executor =
    (resolve, reject) => childProcess.on('exit', (code => code ? reject : resolve)());
    const promise = new Promise(executor);
    return promise;
}

async function npmInstall()
{
    await promises.mkdir(NODE_LEGACY_DIR, { recursive: true });
    const pkg = { dependencies: { ebdd: '*', mocha: '3.5.3' }, private: true };
    const contents = JSON.stringify(pkg, null, 2) + EOL;
    const path = join(NODE_LEGACY_DIR, 'package.json');
    await promises.writeFile(path, contents);
    const childProcess = spawn('npm', ['install'], { cwd: NODE_LEGACY_DIR, stdio: 'inherit' });
    await endOf(childProcess);
}

async function tsc(url)
{
    const tscPath = createRequire(url).resolve('typescript/bin/tsc');
    const childProcess = fork(tscPath, ['--build', 'test/tsconfig.json']);
    await endOf(childProcess);
}

(async () =>
{
    try
    {
        const { url } = import.meta;
        const directory = dirname(dirname(fileURLToPath(url)));
        process.chdir(directory);
        await promises.rmdir(NODE_LEGACY_DIR, { recursive: true });
        await Promise.all([tsc(url), npmInstall()]);
    }
    catch (error)
    {
        console.error(error);
    }
}
)();
