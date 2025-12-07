'use strict';

const { dest, parallel, series, src, task } = require('gulp');
const syncReadable                          = require('sync-readable');

async function bundle(inputOptions, outputFile, banner)
{
    const { parse }     = require('acorn');
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
        const { default: { red } } = await import('chalk');
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
    const { writeFile } = require('node:fs/promises');
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
    const { readFile } = require('node:fs/promises');

    const promise = readFile(inputPath, 'utf8');
    return promise;
}

task
(
    'clean',
    async () =>
    {
        const { deleteAsync } = await import('del');

        const patterns =
        [
            '.github/workflows/~*.yml',
            '.tmp-out',
            'Features.md',
            'api-doc',
            'coverage',
            'lib/**/*.js',
            'lib/feature-all.d.ts',
            'test/spec-runner.html',
            'ui/**/*.js',
        ];
        await deleteAsync(patterns);
    },
);

task
(
    'lint',
    syncReadable
    (
        async () =>
        {
            const eslintPluginJScrewIt              = require('./dev/internal/eslint-plugin');
            const gherkinParser                     = require('./dev/internal/gherkin-parser');
            const { createConfig, noParserConfig }  = require('@origin-1/eslint-config');
            const eslintPluginEBDD                  = require('eslint-plugin-ebdd');
            const { EslintEnvProcessor }            = require('eslint-plugin-eslint-env');
            const globals                           = require('globals');
            const gulpESLintNew                     = require('gulp-eslint-new');

            const ebddPlugins = { ebdd: eslintPluginEBDD };

            const overrideConfig =
            await createConfig
            (
                noParserConfig,
                {
                    files:              ['src/**/*.js'],
                    ignores:            ['src/ui/worker.js'],
                    jsVersion:          5,
                    languageOptions:    { ecmaVersion: 2015 },
                    plugins:            { internal: eslintPluginJScrewIt },
                    processor:          new EslintEnvProcessor(),
                    rules:              { 'internal/sorted-definitions': 'error' },
                },
                {
                    files:              ['dev/**/*.js', 'gulpfile.js', 'test/patch-cov-source.js'],
                    ignores:            ['dev/legacy'],
                    jsVersion:          2022,
                    languageOptions:    { globals: globals.node, sourceType: 'commonjs' },
                    rules:              { 'object-shorthand': 'error' },
                },
                {
                    files:              ['dev/**/*.mjs'],
                    jsVersion:          2022,
                    languageOptions:    { globals: globals.node },
                },
                {
                    files:
                    ['dev/legacy/**/*.js', 'screw.js', 'src/ui/worker.js', 'tools/**/*.js'],
                    jsVersion:          5,
                    languageOptions:    { sourceType: 'commonjs' },
                    processor:          new EslintEnvProcessor(),
                    rules:
                    {
                        // process.exitCode is not supported in Node.js 0.10.
                        'no-process-exit': 'off',
                    },
                },
                {
                    files:              ['test/**/*.js'],
                    jsVersion:          5,
                    ignores:            ['test/patch-cov-source.js'],
                    languageOptions:    { sourceType: 'script' },
                    plugins:            ebddPlugins,
                    processor:          new EslintEnvProcessor({ plugins: ebddPlugins }),
                    rules:              { '@origin-1/no-extra-new': 'off' },
                },
                {
                    files:              ['lib/**/*.ts'],
                    ignores:            ['lib/feature-all.d.ts'],
                    tsVersion:          'latest',
                },
                {
                    files:              ['test/acceptance/**/*.feature'],
                    languageOptions:    { parser: gherkinParser },
                },
            );
            const stream =
            src
            (
                [
                    '*.js',
                    '{dev,src,test}/**/*.{feature,js,mjs,ts}',
                    'lib/**/*.ts',
                    '!lib/feature-all.d.ts',
                ],
            )
            .pipe
            (
                gulpESLintNew
                (
                    {
                        configType:         'flat',
                        overrideConfig,
                        overrideConfigFile: true,
                        warnIgnored:        true,
                    },
                ),
            )
            .pipe(gulpESLintNew.format('compact'))
            .pipe(gulpESLintNew.failAfterError());
            return stream;
        },
    ),
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
                cleanup
                ({ comments: [/^(?!\*!|\*\s*global\b|\/\s*eslint-disable)/], maxEmptyLines: -1 }),
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
    async () =>
    {
        const [{ default: c8js }] =
        await Promise.all([import('c8js'), import('./test/patch-cov-source.js')]);
        const mochaPath = require.resolve('mocha/bin/mocha');
        await c8js
        (
            mochaPath,
            ['--check-leaks', '--ui=ebdd', 'test/**/*.spec.js'],
            {
                reporter:       ['html', 'text-summary'],
                useC8Config:    false,
                watermarks:
                {
                    branches:   [90, 100],
                    functions:  [90, 100],
                    lines:      [90, 100],
                    statements: [90, 100],
                },
            },
        );
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
            compress:   { global_defs: { NO_DEBUG: true }, hoist_funs: true, passes: 4 },
            mangle:     { properties: { regex: /^_/ } },
            output:     { comments: (node, comment) => comment.pos === 0 },
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
    'make-feature-types',
    () =>
    createFileFromTemplate
    ('./dev/make-feature-types.mjs', 'src/lib/feature-all.d.ts.hbs', 'lib/feature-all.d.ts'),
);

task
(
    'make-api-doc',
    async () =>
    {
        const { Application, TSConfigReader } = await import('typedoc');

        const options =
        {
            disableSources:     true,
            entryPoints:        ['lib/jscrewit.d.ts'],
            githubPages:        false,
            hideBreadcrumbs:    true,
            name:               'JScrewIt',
            out:                'api-doc',
            plugin:             ['typedoc-plugin-markdown'],
            readme:             'none',
            tsconfig:           'tsconfig.json',
        };
        const tsConfigReader = new TSConfigReader();
        const app = await Application.bootstrapWithPlugins(options, [tsConfigReader]);
        const project = await app.convert();
        app.validate(project);
        await app.generateOutputs(project);
        const { logger } = app;
        if (logger.hasErrors() || logger.hasWarnings())
            throw Error('Problems occurred while generating the documentation');
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
    'make-spec-runner',
    async () =>
    {
        const { writeFile } = require('node:fs/promises');
        const { glob }      = require('glob');
        const Handlebars    = require('handlebars');

        async function getSpecs()
        {
            const specs = await glob('**/*.spec.js', { cwd: 'test/lib' });
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
    'make-workflows',
    async () =>
    {
        const { writeFile } = require('node:fs/promises');
        const { join }      = require('node:path');
        const { glob }      = require('glob');
        const Handlebars    = require('handlebars');

        async function getTemplate()
        {
            const input = await readFileAsString('src/package.yml.hbs');
            const template = Handlebars.compile(input, { noEscape: true });
            return template;
        }

        async function writeWorkflow(pkgName)
        {
            const output = template({ package: pkgName });
            const path = join('.github/workflows', `${pkgName}.yml`);
            await writeFile(path, output);
        }

        const promises = [getTemplate(), glob('*', { cwd: 'packages', onlyDirectories: true })];
        const [template, pkgNames] = await Promise.all(promises);
        const writeWorkflowPromises = pkgNames.map(writeWorkflow);
        await Promise.all(writeWorkflowPromises);
    },
);

task
(
    'default',
    series
    (
        'clean',
        'lint',
        parallel('bundle:lib', 'bundle:ui'),
        'test',
        parallel
        (
            'minify:lib',
            'minify:ui',
            series('make-feature-types', 'make-api-doc'),
            'make-feature-doc',
            'make-spec-runner',
            'make-workflows',
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
                    opts:       { destination: 'jsdoc' },
                    plugins:    ['plugins/markdown'],
                    tags:       { allowUnknownTags: false },
                },
            ),
        );
        return stream;
    },
);
