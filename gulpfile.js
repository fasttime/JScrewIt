'use strict';

const { dest, parallel, series, src, task } = require('gulp');

task
(
    'clean',
    async () =>
    {
        const del = require('del');

        const patterns =
        [
            '.tmp-src',
            'Features.md',
            'api-doc',
            'coverage',
            'lib/**/*.js',
            'lib/feature-all.d.ts',
            'ui/**/*.js',
        ];
        await del(patterns);
    },
);

task
(
    'lint',
    () =>
    {
        const lint = require('@fasttime/gulp-lint');

        const stream =
        lint
        (
            {
                src: ['src/**/*.js', '!src/ui/worker.js'],
                parserOptions: { sourceType: 'module' },
                rules:
                {
                    'lines-around-comment':
                    [
                        'error',
                        {
                            allowBlockStart: true,
                            allowObjectStart: true,
                            ignorePattern: '^\\s*c8 ignore next\\b',
                        },
                    ],
                },
            },
            {
                src: ['gulpfile.js', 'build/**/*.js', '!build/legacy/**'],
                envs: 'node',
                parserOptions: { ecmaVersion: 9 },
            },
            {
                src:
                [
                    'build/legacy/**/*.js',
                    'screw.js',
                    'src/ui/worker.js',
                    'test/**/*.js',
                    'tools/**/*.js',
                ],
                plugins: 'ebdd',
                // process.exitCode is not supported in Node.js 0.10.
                rules: { 'no-process-exit': 'off' },
            },
            {
                src: ['lib/**/*.ts', '!lib/feature-all.d.ts'],
                parserOptions: { project: 'tsconfig.json', sourceType: 'module' },
                rules:
                { '@typescript-eslint/triple-slash-reference': ['error', { path: 'always' }] },
            },
            { src: 'test/acceptance/**/*.feature' },
        );
        return stream;
    },
);

async function bundle(inputOptions, outputFile, banner)
{
    const { parse }     = require('acorn');
    const { red }       = require('chalk');
    const { rollup }    = require('rollup');

    const bundle = await rollup(inputOptions);
    const outputOptions = { banner, file: outputFile, format: 'iife' };
    const { output: [{ code }] } = await bundle.write(outputOptions);
    try
    {
        parse(code, { ecmaVersion: 5 });
    }
    catch (error)
    {
        console.error(red('The file \'%s\' is not a valid ECMAScript 5 script.'), outputFile);
        error.showStack = false;
        throw error;
    }
}

task
(
    'bundle:lib',
    async () =>
    {
        const { homepage, version } = require('./package.json');
        const cleanup               = require('rollup-plugin-cleanup');

        const inputOptions =
        {
            input: 'src/lib/jscrewit-main.js',
            plugins: [cleanup({ comments: [/^(?!\*\s*global\b)/], maxEmptyLines: -1 })],
        };
        await bundle(inputOptions, 'lib/jscrewit.js', `// JScrewIt ${version} – ${homepage}\n`);
    },
);

async function makeArt()
{
    const { promise }               = require('art-js');
    const { promises: { mkdir } }   = require('fs');

    await mkdir('.tmp-src', { recursive: true });
    await promise('.tmp-src/art.js', { css: true, off: true, on: true });
}

function makeWorker()
{
    const tap       = require('gulp-tap');
    const uglify    = require('gulp-uglify');

    const stream =
    src('src/ui/worker.js')
    .pipe(uglify())
    .pipe
    (
        tap
        (
            chunk =>
            {
                const str = `export default ${JSON.stringify(String(chunk.contents))};\n`;
                chunk.contents = Buffer.from(str);
            },
        ),
    )
    .pipe(dest('.tmp-src'));
    return stream;
}

async function bundleUI()
{
    const inputOptions = { input: 'src/ui/ui-main.js' };
    await bundle(inputOptions, '.tmp-src/ui.js');
}

task('bundle:ui', series(parallel(makeArt, makeWorker), bundleUI));

task
(
    'test',
    callback =>
    {
        const { fork } = require('child_process');

        const { resolve } = require;
        const c8Path = resolve('c8/bin/c8');
        const mochaPath = resolve('mocha/bin/mocha');
        const forkArgs =
        [
            '--reporter=html',
            '--reporter=text-summary',
            mochaPath,
            '--check-leaks',
            '--ui=ebdd',
            'test/**/*.spec.js',
        ];
        const childProcess = fork(c8Path, forkArgs);
        childProcess.on('exit', code => callback(code && 'Test failed'));
    },
);

task
(
    'minify:lib',
    () =>
    {
        const rename = require('gulp-rename');
        const uglify = require('gulp-uglify');

        const uglifyOpts =
        {
            compress: { global_defs: { DEBUG: false }, passes: 3 },
            output: { comments: (node, comment) => comment.pos === 0 },
        };
        const stream =
        src('lib/jscrewit.js')
        .pipe(uglify(uglifyOpts))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(dest('lib'));
        return stream;
    },
);

task
(
    'minify:ui',
    () =>
    {
        const uglify = require('gulp-uglify');

        const stream =
        src('.tmp-src/ui.js').pipe(uglify({ compress: { passes: 3 } })).pipe(dest('ui'));
        return stream;
    },
);

task
(
    'feature-doc',
    async () =>
    {
        const makeFeatureDoc                        = require('./build/make-feature-doc');
        const { promises: { readFile, writeFile } } = require('fs');
        const Handlebars                            = require('handlebars');

        async function writeOutput(inputPath, context, outputPath)
        {
            const input = await readFile(inputPath, 'utf8');
            const template = Handlebars.compile(input, { noEscape: true });
            const output = template(context);
            await writeFile(outputPath, output);
        }

        const { contextMd, contextTs } = makeFeatureDoc();
        const promiseTs =
        writeOutput('src/lib/feature-all.d.ts.hbs', contextTs, 'lib/feature-all.d.ts');
        const promiseMd =
        writeOutput('src/Features.md.hbs', contextMd, 'Features.md');
        await Promise.all([promiseMd, promiseTs]);
    },
);

task
(
    'typedoc',
    () =>
    {
        const typedoc = require('gulp-typedoc');

        const typedocOpts =
        {
            excludeExternals:       true,
            hideBreadcrumbs:        true,
            hideSources:            true,
            includeDeclarations:    true,
            mode:                   'file',
            name:                   'JScrewIt',
            out:                    'api-doc',
            plugin:                 'typedoc-plugin-markdown',
            readme:                 'none',
            tsconfig:               'tsconfig.json',
        };
        const stream = src('lib', { read: false }).pipe(typedoc(typedocOpts));
        return stream;
    },
);

task
(
    'default',
    series
    (
        parallel('clean', 'lint'),
        parallel('bundle:lib', 'bundle:ui'),
        'test',
        parallel('minify:lib', 'minify:ui', 'feature-doc'),
        'typedoc',
    ),
);

// The docs task is not executed by the default task because the files it generates are not included
// in the repository or in a distribution package.
task
(
    'jsdoc',
    () =>
    {
        const jsdoc = require('gulp-jsdoc3');

        const stream =
        src('lib/jscrewit.js', { read: false })
        .pipe
        (
            jsdoc
            (
                {
                    opts: { destination: 'jsdoc' },
                    plugins: ['plugins/markdown'],
                    tags: { allowUnknownTags: false },
                },
            ),
        );
        return stream;
    },
);
