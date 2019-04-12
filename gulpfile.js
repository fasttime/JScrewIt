/* eslint-env node */

'use strict';

var gulp    = require('gulp');
var semver  = require('semver');

var legacyTask  = gulp.task;
var parallel    = gulp.parallel;
var series      = gulp.series;
var src         = gulp.src;

var task;
if (semver.satisfies(process.version, '>=8.0.0'))
{
    var dest = gulp.dest;

    task = legacyTask;
}
else
{
    task =
    function (taskName)
    {
        legacyTask
        (
            taskName,
            function (callback)
            {
                callback('Task not available in Node.js < 8');
            }
        );
    };
}

task
(
    'clean',
    function ()
    {
        var del = require('del');

        var patterns =
        [
            'Features.md',
            'Reference.md',
            'coverage',
            'html/**/*.js',
            'lib/**/*.js',
            'tmp-src',
        ];
        var promise = del(patterns);
        return promise;
    }
);

task
(
    'gherkin-lint',
    function ()
    {
        var gherkinlint = require('gulp-gherkin-lint');

        var stream = src('test/acceptance/**').pipe(gherkinlint());
        return stream;
    }
);

task
(
    'js-lint',
    function ()
    {
        var lint = require('gulp-fasttime-lint');

        var stream =
        lint
        (
            {
                src: 'src/**/*.js',
                parserOptions: { ecmaFeatures: { impliedStrict: true } },
                rules: { strict: 'off' },
            },
            {
                src: 'build/**/*.js',
                envs: 'node',
                parserOptions: { ecmaVersion: 8 },
            },
            {
                src: ['*.js', 'test/**/*.js', 'tools/**/*.js'],
                // process.exitCode is not supported in Node.js 0.10.
                rules: { 'no-process-exit': 'off' },
            }
        );
        return stream;
    }
);

task
(
    'concat',
    function ()
    {
        var concat = require('gulp-concat');
        var insert = require('gulp-insert');
        var pkg = require('./package.json');
        var replace = require('gulp-replace');

        var SRC =
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

        var stream =
        src(SRC)
        .pipe(replace(/^\/\*[^]*?\*\/\s*\n/, ''))
        .pipe(concat('jscrewit.js'))
        .pipe(insert.prepend('// JScrewIt ' + pkg.version + ' – ' + pkg.homepage + '\n\n'))
        .pipe(dest('lib'));
        return stream;
    }
);

legacyTask
(
    'feature-info',
    function (callback)
    {
        var chalk = require('chalk');
        var featureInfo = require('./test/feature-info');

        console.log();
        var anyMarked;
        var forcedStrictModeFeatureObj = featureInfo.forcedStrictModeFeatureObj;
        featureInfo.showFeatureSupport
        (
            function (label, featureNames, isCategoryMarked)
            {
                function formatFeatureName(featureName)
                {
                    var marked =
                    isCategoryMarked(featureName, 'forced-strict-mode', forcedStrictModeFeatureObj);
                    if (marked)
                        featureName += '¹';
                    anyMarked |= marked;
                    return featureName;
                }

                console.log(chalk.bold(label) + featureNames.map(formatFeatureName).join(', '));
            }
        );
        if (anyMarked)
            console.log('(¹) Feature excluded when strict mode is enforced.');
        console.log();
        callback();
    }
);

legacyTask
(
    'test',
    function ()
    {
        var mocha = require('gulp-spawn-mocha');

        var stream = src('test/**/*.spec.js').pipe(mocha({ istanbul: true }));
        return stream;
    }
);

task
(
    'uglify:lib',
    function ()
    {
        var rename = require('gulp-rename');
        var uglify = require('gulp-uglify');

        var uglifyOpts =
        {
            compress: { global_defs: { DEBUG: false } },
            output:
            {
                comments:
                function (node, comment)
                {
                    return comment.pos === 0;
                },
            },
        };
        var stream =
        src('lib/jscrewit.js')
        .pipe(uglify(uglifyOpts))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(dest('lib'));
        return stream;
    }
);

function makeArt(callback)
{
    var fs = require('fs');
    var makeArt = require('art-js');

    fs.mkdir
    (
        'tmp-src',
        function (error)
        {
            if (error && error.code !== 'EEXIST')
                callback(error);
            else
                makeArt.async('tmp-src/art.js', { css: true, off: true, on: true }, callback);
        }
    );
}

function makeWorker()
{
    var through = require('through2');
    var uglify = require('gulp-uglify');

    var stream =
    src('src/html/worker.js')
    .pipe(uglify())
    .pipe
    (
        through.obj
        (
            function (chunk, encoding, callback)
            {
                var contents =
                'var WORKER_SRC = ' + JSON.stringify(String(chunk.contents)) + ';\n';
                chunk.contents = Buffer.from(contents);
                callback(null, chunk);
            }
        )
    )
    .pipe(dest('tmp-src'));
    return stream;
}

function makeUI()
{
    var concat = require('gulp-concat');
    var uglify = require('gulp-uglify');

    var SRC =
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

    var stream = src(SRC).pipe(concat('ui.js')).pipe(uglify()).pipe(dest('html'));
    return stream;
}

task('uglify:html', series(parallel(makeArt, makeWorker), makeUI));

task
(
    'feature-doc',
    function (callback)
    {
        var fs = require('fs');
        var makeFeatureDoc = require('./build/make-feature-doc');

        var featureDoc = makeFeatureDoc();
        fs.writeFile('Features.md', featureDoc, callback);
    }
);

task
(
    'jsdoc2md',
    function ()
    {
        var fs          = require('fs');
        var jsdoc2md    = require('jsdoc-to-markdown');
        var util        = require('util');

        var writeFile = util.promisify(fs.writeFile);
        var promise =
        jsdoc2md.render({ files: 'lib/jscrewit.js' })
        .then
        (
            function (output)
            {
                var promise = writeFile('Reference.md', output);
                return promise;
            }
        );
        return promise;
    }
);

// The docs task is not executed by the default task because the files it generates are not included
// in the repository or in a distribution package.
task
(
    'docs',
    function ()
    {
        var jsdoc = require('gulp-jsdoc3');

        var stream =
        src('lib/jscrewit.js', { read: false })
        .pipe
        (
            jsdoc
            (
                {
                    opts: { access: 'all', destination: 'docs' },
                    plugins: ['plugins/markdown'],
                    tags: { allowUnknownTags: false },
                }
            )
        );
        return stream;
    }
);

task
(
    'default',
    series
    (
        parallel('clean', 'gherkin-lint', 'js-lint'),
        'concat',
        'feature-info',
        'test',
        parallel('uglify:html', 'uglify:lib', 'feature-doc', 'jsdoc2md')
    )
);
