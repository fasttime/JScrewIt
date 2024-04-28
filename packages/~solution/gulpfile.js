import { fork }                 from 'node:child_process';
import { createRequire }        from 'node:module';
import { clean, lint, make }    from './dev/impl.js';
import { series }               from 'gulp';

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

export { clean, lint, make };

export default series(clean, lint, test, make);
