import { lint as lintImpl } from '@fasttime/lint';
import { fork }             from 'child_process';
import { rm }               from 'fs/promises';
import gulp                 from 'gulp';
import gulpTypescript       from 'gulp-typescript';
import mergeStream          from 'merge-stream';
import { createRequire }    from 'module';
import { rollup }           from 'rollup';
import rollupPluginCleanup  from 'rollup-plugin-cleanup';

const { dest, parallel, series, src } = gulp;

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

export function compile()
{
    const { dts, js } = src('src/**/*.ts').pipe(gulpTypescript.createProject('tsconfig.json')());
    const stream = mergeStream(dts.pipe(dest('lib')), js.pipe(dest('.tmp-out')));
    return stream;
}

export async function bundle()
{
    const require = createRequire(import.meta.url);
    const { homepage, version } = require('./package.json');

    const inputOptions =
    {
        external: ['tslib'],
        input: '.tmp-out/quinquaginta-duo.js',
        onwarn(warning)
        {
            if (warning.code !== 'THIS_IS_UNDEFINED')
                console.error(warning.message);
        },
        plugins: [rollupPluginCleanup({ comments: /^(?!\/ *(?:@ts-|eslint-disable-line ))/ })],
    };
    const outputOptions =
    {
        banner: `// quinquaginta-duo ${version} – ${homepage}\n`,
        file:   'lib/quinquaginta-duo.js',
        format: 'esm',
    };
    const bundle = await rollup(inputOptions);
    await bundle.write(outputOptions);
}

export default series(parallel(clean, lint), test, compile, bundle);
