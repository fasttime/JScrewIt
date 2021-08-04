import { lint, makeBrowserSpecRunner, makeLib } from './dev/impl.js';
import { fork }                                 from 'child_process';
import { rm }                                   from 'fs/promises';
import gulp                                     from 'gulp';
import { createRequire }                        from 'module';

const { parallel, series } = gulp;

export async function clean()
{
    const paths =
    [
        '.nyc_output',
        '.tmp-out',
        'coverage',
        'lib',
        'test/browser-spec-runner.js',
        'test/node-legacy',
    ];
    const options = { force: true, recursive: true };
    await Promise.all(paths.map(path => rm(path, options)));
}

export function test(callback)
{
    const { resolve } = createRequire(import.meta.url);
    const nycPath = resolve('nyc/bin/nyc');
    const mochaPath = resolve('mocha/bin/mocha');
    const forkArgs =
    [
        '--include=src',
        '--reporter=html',
        '--reporter=text-summary',
        mochaPath,
        '--check-leaks',
        '--require=ts-node/register',
        '--ui=ebdd',
        'test/spec/**/*.spec.ts',
    ];
    const childProcess = fork(nycPath, forkArgs);
    childProcess.on('exit', code => callback(code && 'Test failed'));
}

export { lint, makeLib, makeBrowserSpecRunner };

export default series(parallel(clean, lint), test, parallel(makeLib, makeBrowserSpecRunner));
