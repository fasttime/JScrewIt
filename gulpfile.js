/* eslint-env node */

'use strict';

var gulp = require('gulp');

gulp.task(
    'clean:char-defs-output',
    function ()
    {
        var del = require('del');
        
        var PATTERNS = ['char-map.json', 'output.txt'];
        var stream = del(PATTERNS);
        return stream;
    }
);

gulp.task(
    'clean:default',
    function ()
    {
        var del = require('del');
        
        var PATTERNS =
        [
            'Features.md',
            'Reference.md',
            'coverage',
            'html/**/*.js',
            'lib/**/*.js',
            'tmp-src'
        ];
        var stream = del(PATTERNS);
        return stream;
    }
);

gulp.task(
    'gherkin-lint',
    function ()
    {
        var gherkinlint = require('gulp-gherkin-lint');
        
        var stream = gulp.src('test/acceptance/**').pipe(gherkinlint());
        return stream;
    }
);

gulp.task(
    'lint:lib',
    function ()
    {
        var lint = require('gulp-fasttime-lint');
        
        var stream =
            gulp
            .src('src/lib/**/*.js')
            .pipe(lint({ parserOptions: { ecmaFeatures: { impliedStrict: true } } }));
        return stream;
    }
);

gulp.task(
    'lint:other',
    function ()
    {
        var lint = require('gulp-fasttime-lint');
        
        var SRC = ['*.js', 'build/**/*.js', 'src/html/**/*.js', 'test/**/*.js', 'tools/**/*.js'];
        var stream = gulp.src(SRC).pipe(lint());
        return stream;
    }
);

gulp.task(
    'concat',
    function ()
    {
        var concat = require('gulp-concat');
        var insert = require('gulp-insert');
        var pkg = require('./package.json');
        var replace = require('gulp-replace');
        
        var SRC =
        [
            'src/lib/preamble',
            'src/lib/obj-utils.js',
            'src/lib/mask.js',
            'src/lib/features.js',
            'src/lib/definers.js',
            'src/lib/solution.js',
            'src/lib/definitions.js',
            'src/lib/clustering-plan.js',
            'src/lib/figurator.js',
            'src/lib/screw-buffer.js',
            'src/lib/express-parse.js',
            'src/lib/optimizer.js',
            'src/lib/encoder-base.js',
            'src/lib/encoder-ext.js',
            'src/lib/trim-js.js',
            'src/lib/jscrewit-base.js',
            'src/lib/debug.js',
            'src/lib/postamble'
        ];
        var stream =
            gulp
            .src(SRC)
            .pipe(replace(/^\/\*[^]*?\*\/\s*\n/, ''))
            .pipe(concat('jscrewit.js'))
            .pipe(insert.prepend('// JScrewIt ' + pkg.version + ' – http://jscrew.it\n'))
            .pipe(gulp.dest('lib'));
        return stream;
    }
);

gulp.task(
    'feature-info',
    function ()
    {
        var gutil = require('gulp-util');
        var featureInfo = require('./test/feature-info');
        
        console.log();
        var anyMarked;
        var forcedStrictModeFeatureObj = featureInfo.forcedStrictModeFeatureObj;
        featureInfo.showFeatureSupport(
            function (label, featureNames, isCategoryMarked)
            {
                function formatFeatureName(featureName)
                {
                    var marked =
                        isCategoryMarked(
                            featureName,
                            'forced-strict-mode',
                            forcedStrictModeFeatureObj
                        );
                    if (marked)
                        featureName += '¹';
                    anyMarked |= marked;
                    return featureName;
                }
                
                console.log(
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

gulp.task(
    'test',
    function ()
    {
        var mocha = require('gulp-spawn-mocha');
        
        var stream = gulp.src('test/**/*.spec.js').pipe(mocha({ istanbul: true }));
        return stream;
    }
);

gulp.task(
    'scan-char-defs',
    function ()
    {
        var gutil = require('gulp-util');
        var runScan = require('./build/scan-char-defs');
        
        var colors = gutil.colors;
        var defsUnused = runScan();
        if (defsUnused)
        {
            var error =
                new gutil.PluginError(
                    module.filename,
                    'There are unused character definitions. See output.txt for details.'
                );
            error.toString =
                function ()
                {
                    return colors.red(this.message);
                };
            throw error;
        }
        gutil.log(colors.green('All character definitions used.'));
    }
);

gulp.task(
    'uglify:lib',
    function ()
    {
        var rename = require('gulp-rename');
        var uglify = require('gulp-uglify');
        
        var uglifyOpts =
        {
            compress:
            { collapse_vars: true, global_defs: { DEBUG: false }, hoist_vars: true },
            preserveComments: function (node, comment)
            {
                return comment.pos === 0;
            }
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

gulp.task(
    'make-art',
    function (callback)
    {
        var fs = require('fs');
        var makeArt = require('art-js');
        
        fs.mkdir(
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

gulp.task(
    'uglify:html',
    ['make-art'],
    function ()
    {
        var addsrc = require('gulp-add-src');
        var concat = require('gulp-concat');
        var uglify = require('gulp-uglify');
        
        var SRC =
        [
            'tmp-src/art.js',
            'src/html/button.js',
            'src/html/engine-selection-box.js',
            'src/html/modal-box.js',
            'src/html/result-format.js',
            'src/html/roll.js',
            'src/html/tabindex.js',
            'src/html/ui-main.js'
        ];
        var uglifyOpts = { compress: { collapse_vars: true, hoist_vars: true } };
        var stream =
            gulp
            .src(SRC)
            .pipe(concat('ui.js'))
            .pipe(addsrc('src/html/worker.js'))
            .pipe(uglify(uglifyOpts)).pipe(gulp.dest('html'));
        return stream;
    }
);

gulp.task(
    'jsdoc2md',
    function ()
    {
        var fsThen = require('fs-then-native');
        var jsdoc2md = require('jsdoc-to-markdown');
        
        var stream =
            jsdoc2md
            .render({ files: 'lib/jscrewit.js' })
            .then(
                function (output)
                {
                    var promise = fsThen.writeFile('Reference.md', output);
                    return promise;
                }
            );
        return stream;
    }
);

gulp.task(
    'feature-doc',
    function (callback)
    {
        var fs = require('fs');
        var makeFeatureDoc = require('./build/make-feature-doc');
        
        var featureDoc = makeFeatureDoc();
        fs.writeFile('Features.md', featureDoc, callback);
    }
);

gulp.task(
    'default',
    function (callback)
    {
        var runSequence = require('run-sequence');
        
        runSequence(
            ['clean:default', 'gherkin-lint', 'lint:lib', 'lint:other'],
            'concat',
            'feature-info',
            'test',
            ['feature-doc', 'jsdoc2md', 'uglify:html', 'uglify:lib'],
            callback
        );
    }
);

gulp.task(
    'full',
    function (callback)
    {
        var runSequence = require('run-sequence');
        
        runSequence(
            ['clean:char-defs-output', 'clean:default', 'gherkin-lint', 'lint:lib', 'lint:other'],
            'concat',
            'feature-info',
            'test',
            'scan-char-defs',
            ['feature-doc', 'jsdoc2md', 'uglify:html', 'uglify:lib'],
            callback
        );
    }
);
