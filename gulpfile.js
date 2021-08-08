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
    const { nodeResolve } = require('@rollup/plugin-node-resolve');

    const inputOptions = { input: 'src/ui/ui-main.js', plugins: [nodeResolve()] };
    await bundle(inputOptions, '.tmp-out/ui.js');
}

async function createFileFromTemplate(createContextModuleId, templateSrcPath, outputPath)
{
    const { writeFile } = require('fs/promises');
    const Handlebars    = require('handlebars');

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

    await promise('.tmp-out', { art: { css: true, off: true, on: true }, esModule: true });
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
    .pipe(dest('.tmp-out'));
    return stream;
}

function readFileAsString(inputPath)
{
    const { readFile } = require('fs/promises');

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
            '.tmp-out',
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
    async () =>
    {
        const { lint } = require('@fasttime/lint');

        await
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
                parserOptions: { ecmaVersion: 2021 },
            },
            {
                src: ['dev/**/*.mjs'],
                envs: 'node',
                parser: '@babel/eslint-parser',
                parserOptions:
                {
                    babelOptions: { plugins: ['@babel/plugin-syntax-top-level-await'] },
                    ecmaVersion: 2021,
                    requireConfigFile: false,
                },
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
                plugins: ['ebdd'],
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
                cleanup({ comments: [/^(?!\*(?:!|\s*global\b))/], maxEmptyLines: -1 }),
                nodeResolve({ dedupe: ['tslib'] }),
            ],
        };
        const banner = `// JScrewIt ${version} – ${homepage}\n`;
        await bundle(inputOptions, 'lib/jscrewit.js', banner);
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
            compress: { global_defs: { NO_DEBUG: true }, hoist_funs: true, passes: 4 },
            mangle: { properties: { regex: /^_/ } },
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
        src('.tmp-out/ui.js')
        .pipe(uglify({ compress: { hoist_funs: true, passes: 3 } }))
        .pipe(dest('ui'));
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
        const fastGlob      = require('fast-glob');
        const { writeFile } = require('fs/promises');
        const Handlebars    = require('handlebars');

        async function getSpecs()
        {
            const specs = await fastGlob('**/*.spec.js', { cwd: 'test/lib' });
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
    'make-api-doc',
    async () =>
    {
        const { Application, TSConfigReader } = require('typedoc');

        const options =
        {
            disableSources:     true,
            entryPoints:        'lib/jscrewit.d.ts',
            hideBreadcrumbs:    true,
            name:               'JScrewIt',
            plugin:             'typedoc-plugin-markdown',
            readme:             'none',
            tsconfig:           'tsconfig.json',
        };
        const app = new Application();
        app.options.addReader(new TSConfigReader());
        app.bootstrap(options);
        const src = app.expandInputFiles(['lib']);
        const project = app.convert(src);
        await app.renderer.render(project, 'api-doc');
        if (app.logger.hasErrors())
            throw Error('API documentation could not be generated');
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
            series('make-feature-types', 'make-api-doc'),
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
