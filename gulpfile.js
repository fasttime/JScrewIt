'use strict';

const { dest, parallel, series, src, task } = require('gulp');

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

async function bundleUI()
{
    const inputOptions = { input: 'src/ui/ui-main.js' };
    await bundle(inputOptions, '.tmp-src/ui.js');
}

async function createFileFromTemplate(createContextModuleId, templateSrcPath, outputPath)
{
    const { promises: { writeFile } }   = require('fs');
    const Handlebars                    = require('handlebars');

    const promises = [import(createContextModuleId), readFileAsString(templateSrcPath)];
    const [{ default: createContext }, input] = await Promise.all(promises);
    const template = Handlebars.compile(input, { noEscape: true });
    const context = createContext();
    const output = template(context);
    await writeFile(outputPath, output);
}

async function makeArt()
{
    const { promise } = require('art-js');

    await promise('.tmp-src', { art: { css: true, off: true, on: true }, esModule: true });
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

function readFileAsString(inputPath)
{
    const { promises: { readFile } } = require('fs');

    const promise = readFile(inputPath, 'utf8');
    return promise;
}

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
            'test/spec-runner.html',
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
                src: ['dev/**/*.js', 'gulpfile.js', 'test/patch-cov-source.js', '!dev/legacy/**'],
                envs: 'node',
                parserOptions: { ecmaVersion: 2020 },
            },
            {
                src: ['dev/**/*.mjs'],
                envs: 'node',
                parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
            },
            {
                src:
                [
                    'dev/legacy/**/*.js',
                    'screw.js',
                    'src/ui/worker.js',
                    'test/**/*.js',
                    'tools/**/*.js',
                    '!test/patch-cov-source.js',
                ],
                plugins: 'ebdd',
                // process.exitCode is not supported in Node.js 0.10.
                rules: { 'no-process-exit': 'off' },
            },
            {
                src: ['lib/**/*.ts', '!lib/feature-all.d.ts'],
                parserOptions: { project: 'tsconfig.json', sourceType: 'module' },
                rules:
                {
                    // Type imports not available in TypeScript < 3.8.
                    '@typescript-eslint/consistent-type-imports':
                    ['error', { prefer: 'no-type-imports' }],
                },
            },
            { src: 'test/acceptance/**/*.feature' },
        );
        return stream;
    },
);

task
(
    'bundle:lib',
    async () =>
    {
        const { homepage, version } = require('./package.json');
        const { nodeResolve }       = require('@rollup/plugin-node-resolve');
        const cleanup               = require('rollup-plugin-cleanup');

        const inputOptions =
        {
            input: 'src/lib/jscrewit-main.js',
            plugins:
            [
                cleanup({ comments: [/^(?!\*\s*global\b)/], maxEmptyLines: -1 }),
                nodeResolve(),
            ],
        };
        await bundle(inputOptions, 'lib/jscrewit.js', `// JScrewIt ${version} – ${homepage}\n`);
    },
);

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
        const childProcess =
        fork(c8Path, forkArgs, { execArgv: ['--require=./test/patch-cov-source'] });
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
    'make-feature-doc',
    () =>
    createFileFromTemplate('./dev/make-feature-doc.mjs', 'src/Features.md.hbs', 'Features.md'),
);

task
(
    'make-feature-types',
    () =>
    createFileFromTemplate
    ('./dev/make-feature-types.mjs', 'src/lib/feature-all.d.ts.hbs', 'lib/feature-all.d.ts'),
);

task
(
    'make-spec-runner',
    async () =>
    {
        const { promises: { writeFile } }   = require('fs');
        const glob                          = require('glob');
        const Handlebars                    = require('handlebars');
        const { promisify }                 = require('util');

        async function getSpecs()
        {
            const specs = await promisify(glob)('**/*.spec.js', { cwd: 'test/lib' });
            return specs;
        }

        async function getTemplate()
        {
            const input = await readFileAsString('src/test/spec-runner.html.hbs');
            const template = Handlebars.compile(input);
            return template;
        }

        const promises = [getTemplate(), getSpecs()];
        const [template, specs] = await Promise.all(promises);
        const output = template({ specs });
        await writeFile('test/spec-runner.html', output);
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
            disableSources:         true,
            entryPoints:            'lib/jscrewit.d.ts',
            hideBreadcrumbs:        true,
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
        parallel
        (
            'minify:lib',
            'minify:ui',
            series('make-feature-types', 'typedoc'),
            'make-feature-doc',
            'make-spec-runner',
        ),
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
