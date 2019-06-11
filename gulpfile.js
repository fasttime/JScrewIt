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
            'Features.md',
            'coverage',
            'doc',
            'html/**/*.js',
            'lib/**/*.js',
            'lib/feature-all.d.ts',
            'tmp-src',
        ];
        await del(patterns);
    },
);

task
(
    'lint',
    () =>
    {
        const lint = require('gulp-fasttime-lint');

        const stream =
        lint
        (
            {
                src: 'src/**/*.js',
                parserOptions: { ecmaFeatures: { impliedStrict: true } },
                rules: { strict: 'off' },
            },
            {
                src: ['gulpfile.js', 'build/**/*.js', '!build/legacy/**'],
                envs: 'node',
                parserOptions: { ecmaVersion: 9 },
            },
            {
                src: ['build/legacy/**/*.js', 'screw.js', 'test/**/*.js', 'tools/**/*.js'],
                // process.exitCode is not supported in Node.js 0.10.
                rules: { 'no-process-exit': 'off' },
            },
            {
                src: ['lib/**/*.ts', '!lib/feature-all.d.ts'],
                parserOptions: { project: 'tsconfig.json', sourceType: 'module' },
                rules:
                {
                    '@typescript-eslint/no-triple-slash-reference': 'off',
                    'spaced-comment': ['error', 'always', { markers: ['/'] }],
                },
            },
            { src: 'test/acceptance/**/*.feature' },
        );
        return stream;
    },
);

task
(
    'concat',
    () =>
    {
        const { homepage, version } = require('./package.json');
        const concat                = require('gulp-concat');
        const { prepend }           = require('gulp-insert');
        const replace               = require('gulp-replace');

        const srcGlobs =
        [
            'src/preamble',
            'src/lib/obj-utils.js',
            'src/lib/mask.js',
            'src/lib/features.js',
            'src/lib/definers.js',
            'src/lib/solution.js',
            'src/lib/definitions.js',
            'src/lib/clustering-plan.js',
            'src/lib/screw-buffer.js',
            'src/lib/express-parse.js',
            'src/lib/encoder-base.js',
            'src/lib/figurator.js',
            'src/lib/complex-optimizer.js',
            'src/lib/to-string-optimizer.js',
            'src/lib/encoder-ext.js',
            'src/lib/trim-js.js',
            'src/lib/jscrewit-base.js',
            'src/lib/debug.js',
            'src/postamble',
        ];
        const stream =
        src(srcGlobs)
        .pipe(replace(/^\/\*[^]*?\*\/\s*\n/, ''))
        .pipe(concat('jscrewit.js'))
        .pipe(prepend(`// JScrewIt ${version} – ${homepage}\n\n`))
        .pipe(dest('lib'));
        return stream;
    },
);

task
(
    'test',
    callback =>
    {
        const { fork } = require('child_process');

        const { resolve } = require;
        const nycPath = resolve('nyc/bin/nyc');
        const mochaPath = resolve('mocha/bin/mocha');
        const forkArgs =
        [
            '--include=lib',
            '--include=src',
            '--include=tools',
            '--reporter=html',
            '--reporter=text-summary',
            '--',
            mochaPath,
            'test/**/*.spec.js',
        ];
        const childProcess = fork(nycPath, forkArgs);
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
            compress: { global_defs: { DEBUG: false }, passes: 2 },
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

async function makeArt()
{
    const { promise }               = require('art-js');
    const { promises: { mkdir } }   = require('fs');

    await mkdir('tmp-src', { recursive: true });
    await promise('tmp-src/art.js', { css: true, off: true, on: true });
}

function makeWorker()
{
    const uglify    = require('gulp-uglify');
    const through   = require('through2');

    const stream =
    src('src/html/worker.js')
    .pipe(uglify())
    .pipe
    (
        through.obj
        (
            (chunk, encoding, callback) =>
            {
                const contents = `var WORKER_SRC = ${JSON.stringify(String(chunk.contents))};\n`;
                chunk.contents = Buffer.from(contents);
                callback(null, chunk);
            },
        ),
    )
    .pipe(dest('tmp-src'));
    return stream;
}

function makeUI()
{
    const concat    = require('gulp-concat');
    const uglify    = require('gulp-uglify');

    const srcGlobs =
    [
        'tmp-src/art.js',
        'src/html/result-format.js',
        'src/preamble',
        'tmp-src/worker.js',
        'src/html/button.js',
        'src/html/engine-selection-box.js',
        'src/html/modal-box.js',
        'src/html/roll.js',
        'src/html/tabindex.js',
        'src/html/ui-main.js',
        'src/postamble',
    ];
    const stream =
    src(srcGlobs)
    .pipe(concat('ui.js'))
    .pipe(uglify({ compress: { passes: 3 } }))
    .pipe(dest('html'));
    return stream;
}

task('minify:html', series(parallel(makeArt, makeWorker), makeUI));

task
(
    'feature-doc',
    async () =>
    {
        const makeFeatureDoc                = require('./build/make-feature-doc');
        const { promises: { writeFile } }   = require('fs');

        const { contentMd, contentTs } = makeFeatureDoc();
        const promiseMd = writeFile('Features.md', contentMd);
        const promiseTs = writeFile('lib/feature-all.d.ts', contentTs);
        await Promise.all([promiseMd, promiseTs]);
    },
);

task
(
    'typedoc',
    () =>
    {
        const { version }   = require('./package.json');
        const typedoc       = require('gulp-typedoc');

        const typedocOpts =
        {
            excludeExternals:       true,
            gitRevision:            version,
            includeDeclarations:    true,
            mode:                   'file',
            name:                   'JScrewIt',
            out:                    'doc',
            readme:                 'none',
            theme:                  'markdown',
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
        'concat',
        'test',
        parallel('minify:html', 'minify:lib', 'feature-doc'),
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
