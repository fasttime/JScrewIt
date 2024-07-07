import { fork, spawn }          from 'node:child_process';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { createRequire }        from 'node:module';
import { EOL }                  from 'node:os';
import { join }                 from 'node:path';

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
    await mkdir(NODE_LEGACY_DIR, { recursive: true });
    const pkg = { dependencies: { ebdd: '*', mocha: '3' }, private: true };
    const contents = JSON.stringify(pkg, null, 2) + EOL;
    const path = join(NODE_LEGACY_DIR, 'package.json');
    await writeFile(path, contents);
    const childProcess =
    // Option "shell" is required on Windows.
    spawn('npm', ['install', '--silent'], { cwd: NODE_LEGACY_DIR, shell: true, stdio: 'inherit' });
    await endOf(childProcess);
}

async function tsc()
{
    const tscPath = createRequire(import.meta.url).resolve('typescript/bin/tsc');
    const childProcess = fork(tscPath, ['--outDir', 'test/node-legacy']);
    await endOf(childProcess);
}

await rm(NODE_LEGACY_DIR, { force: true, recursive: true });
await Promise.all([tsc(), npmInstall()]);
