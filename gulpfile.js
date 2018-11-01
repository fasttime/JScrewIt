/* eslint-env node */

'use strict';

var gulp = require('gulp');

gulp.task
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
        var stream = del(patterns);
        return stream;
    }
);

gulp.task
(
    'gherkin-lint',
    function ()
    {
        var gherkinlint = require('gulp-gherkin-lint');

        var stream = gulp.src('test/acceptance/**').pipe(gherkinlint());
        return stream;
    }
);

gulp.task
(
    'lint:src',
    function ()
    {
        var lint = require('gulp-fasttime-lint');

        var lintOpts =
        { parserOptions: { ecmaFeatures: { impliedStrict: true } }, rules: { strict: 'off' } };
        var stream = gulp.src('src/**/*.js').pipe(lint(lintOpts));
        return stream;
    }
);

gulp.task
(
    'lint:build',
    function ()
    {
        var lint = require('gulp-fasttime-lint');

        var lintOpts = { envs: ['node'], parserOptions: { ecmaVersion: 6 } };
        var stream = gulp.src('build/**/*.js').pipe(lint(lintOpts));
        return stream;
    }
);

gulp.task
(
    'lint:other',
    function ()
    {
        var lint = require('gulp-fasttime-lint');

        var stream =
        gulp.src(['*.js', 'test/**/*.js', 'tools/**/*.js']).pipe(lint());
        return stream;
    }
);

gulp.task
(
    'concat',
    function ()
    {
        var concat = require('gulp-concat');
        var insert = require('gulp-insert');
        var pkg = require('./package.json');
        var replace = require('gulp-replace');

        var src =
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
        gulp
        .src(src)
        .pipe(replace(/^\/\*[^]*?\*\/\s*\n/, ''))
        .pipe(concat('jscrewit.js'))
        .pipe(insert.prepend('// JScrewIt ' + pkg.version + ' – https://jscrew.it\n'))
        .pipe(gulp.dest('lib'));
        return stream;
    }
);

gulp.task
(
    'feature-info',
    function ()
    {
        var gutil = require('gulp-util');
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

                console.log
                (
                    gutil.colors.bold(label) +
                    featureNames.map(formatFeatureName).join(', ')
                );
            }
        );
        if (anyMarked)
            console.log('(¹) Feature excluded when strict mode is enforced.');
        console.log();
    }
);

gulp.task
(
    'test',
    function ()
    {
        var mocha = require('gulp-spawn-mocha');

        var stream = gulp.src('test/**/*.spec.js').pipe(mocha({ istanbul: true }));
        return stream;
    }
);

gulp.task
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
        gulp
        .src('lib/jscrewit.js')
        .pipe(uglify(uglifyOpts))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest('lib'));
        return stream;
    }
);

gulp.task
(
    'make-art',
    function (callback)
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
);

gulp.task
(
    'make-worker',
    function ()
    {
        var through = require('through2');
        var uglify = require('gulp-uglify');

        var stream =
        gulp
        .src('src/html/worker.js')
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
        .pipe(gulp.dest('tmp-src'));
        return stream;
    }
);

gulp.task
(
    'uglify:html',
    ['make-art', 'make-worker'],
    function ()
    {
        var concat = require('gulp-concat');
        var uglify = require('gulp-uglify');

        var src =
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
        var stream = gulp.src(src).pipe(concat('ui.js')).pipe(uglify()).pipe(gulp.dest('html'));
        return stream;
    }
);

gulp.task
(
    'jsdoc2md',
    function ()
    {
        var fsThen = require('fs-then-native');
        var jsdoc2md = require('jsdoc-to-markdown');

        var stream =
        jsdoc2md
        .render({ files: 'lib/jscrewit.js' })
        .then
        (
            function (output)
            {
                var promise = fsThen.writeFile('Reference.md', output);
                return promise;
            }
        );
        return stream;
    }
);

gulp.task
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

gulp.task
(
    'default',
    function (callback)
    {
        var runSequence = require('run-sequence');

        runSequence
        (
            ['clean', 'gherkin-lint', 'lint:build', 'lint:src', 'lint:other'],
            'concat',
            'feature-info',
            'test',
            ['feature-doc', 'jsdoc2md', 'uglify:html', 'uglify:lib'],
            callback
        );
    }
);
