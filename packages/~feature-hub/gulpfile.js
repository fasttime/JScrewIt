import { fork }                                         from 'node:child_process';
import { createRequire }                                from 'node:module';
import { clean, lint, makeBrowserSpecRunner, makeLib }  from './dev/impl.js';
import { parallel, series }                             from 'gulp';

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

export { clean, lint, makeBrowserSpecRunner, makeLib };

export default series(clean, lint, test, parallel(makeLib, makeBrowserSpecRunner));
