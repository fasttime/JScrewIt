import make                 from './dev/make-impl.js';
import { lint as lintImpl } from '@fasttime/lint';
import { fork }             from 'child_process';
import { rm }               from 'fs/promises';
import gulp                 from 'gulp';
import { createRequire }    from 'module';

const { parallel, series } = gulp;

export async function clean()
{
    const paths = ['.nyc_output', '.tmp-out', 'coverage', 'lib', 'test/node-legacy'];
    const options = { force: true, recursive: true };
    await Promise.all(paths.map(path => rm(path, options)));
}

export async function lint()
{
    await
    lintImpl
    (
        {
            src: 'src/**/*.ts',
            parserOptions: { project: 'tsconfig.json', sourceType: 'module' },
        },
        {
            src: 'test/spec/**/*.ts',
            envs: ['ebdd/ebdd', 'mocha'],
            parserOptions: { project: 'test/tsconfig.json', sourceType: 'module' },
            plugins: ['ebdd'],
        },
        {
            src: ['*.js', 'dev/**/*.js'],
            envs: ['node'],
            parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
        },
    );
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
        '--global=__coverage__',
        '--require=ts-node/register',
        '--ui=ebdd',
        'test/spec/**/*.spec.ts',
    ];
    const forkOpts =
    { env: { ...process.env, TS_NODE_COMPILER_OPTIONS: '{ "module": "CommonJS" }' } };
    const childProcess = fork(nycPath, forkArgs, forkOpts);
    childProcess.on('exit', code => callback(code && 'Test failed'));
}

export { make };

export default series(parallel(clean, lint), test, make);
