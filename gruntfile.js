/* eslint-env node */

'use strict';

module.exports =
    function (grunt)
    {
        // Project configuration.
        grunt.initConfig(
            {
                clean:
                {
                    default:
                    ['Features.md', 'Reference.md', 'coverage', 'html/**/*.js', 'lib/**/*.js'],
                    'char-defs-output': ['char-map.json', 'output.txt']
                },
                concat:
                {
                    default:
                    {
                        dest: 'lib/jscrewit.js',
                        options:
                        {
                            banner: '// JScrewIt <%= pkg.version %> – <%= pkg.homepage %>\n',
                            stripBanners: true
                        },
                        src:
                        [
                            'src/lib/preamble',
                            'src/lib/obj-utils.js',
                            'src/lib/mask.js',
                            'src/lib/features.js',
                            'src/lib/definers.js',
                            'src/lib/levels.js',
                            'src/lib/definitions.js',
                            'src/lib/figures.js',
                            'src/lib/screw-buffer.js',
                            'src/lib/express-parse.js',
                            'src/lib/encoder-base.js',
                            'src/lib/encoder-ext.js',
                            'src/lib/trim-js.js',
                            'src/lib/jscrewit-base.js',
                            'src/lib/debug.js',
                            'src/lib/postamble'
                        ]
                    }
                },
                fasttime_lint:
                {
                    lib:
                    {
                        options: { parserOptions: { ecmaFeatures: { impliedStrict: true } } },
                        src: 'src/lib/**/*.js'
                    },
                    other:
                    {
                        src:
                        [
                            '*.js',
                            'build/**/*.js',
                            'src/html/**/*.js',
                            'test/**/*.js',
                            'tools/**/*.js'
                        ]
                    }
                },
                jsdoc2md: { default: { dest: 'Reference.md', src: 'lib/jscrewit.js' } },
                mocha_istanbul: { default: 'test/**/*.spec.js' },
                pkg: grunt.file.readJSON('package.json'),
                uglify:
                {
                    html:
                    {
                        files:
                        {
                            'html/ui.js':
                            [
                                'node_modules/art-js/lib/art.js',
                                'node_modules/art-js/lib/art.on.js',
                                'src/html/engine-selection-box.js',
                                'src/html/roll.js',
                                'src/html/ui-main.js'
                            ],
                            'html/worker.js': 'src/html/worker.js'
                        }
                    },
                    lib:
                    {
                        files: { 'lib/jscrewit.min.js': 'lib/jscrewit.js' },
                        options:
                        {
                            preserveComments: function (node, comment)
                            {
                                return comment.pos === 0;
                            }
                        }
                    },
                    options:
                    {
                        compress:
                        { collapse_vars: true, global_defs: { DEBUG: false }, hoist_vars: true }
                    }
                }
            }
        );
        
        // These plugins provide necessary tasks.
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-fasttime-lint');
        grunt.loadNpmTasks('grunt-jsdoc-to-markdown');
        grunt.loadNpmTasks('grunt-mocha-istanbul');
        
        grunt.registerTask(
            'feature-doc',
            'Create Feature Reference documentation.',
            function ()
            {
                grunt.file.write('Features.md', require('./build/make-feature-doc')());
                grunt.log.ok('Done.');
            }
        );
        
        grunt.registerTask(
            'feature-info',
            'Show feature support information for the JavaScript engine in use.',
            function ()
            {
                var showFeatureSupport = require('./test/feature-info');
                showFeatureSupport(
                    function (label, features)
                    {
                        grunt.log.writeln(label.bold + features.join(', '));
                    }
                );
            }
        );
        
        grunt.registerTask(
            'scan-char-defs',
            'Analyze all character encodings.',
            function ()
            {
                var timeUtils = require('./tools/time-utils');
                var defsUnused;
                var duration;
                try
                {
                    duration =
                        timeUtils.timeThis(
                            function ()
                            {
                                var runScan = require('./build/scan-char-defs');
                                defsUnused = runScan();
                            }
                        );
                }
                catch (error)
                {
                    grunt.warn(error);
                    return;
                }
                var durationStr = timeUtils.formatDuration(duration);
                grunt.log.writeln(durationStr + ' elapsed.');
                if (defsUnused)
                {
                    grunt.warn(
                        'There are unused character definitions. See output.txt for details.'
                    );
                }
                else
                    grunt.log.ok('Done. All character definitions used.');
            }
        );
        
        // Default task.
        grunt.registerTask(
            'default',
            [
                'fasttime_lint',
                'clean:default',
                'concat',
                'feature-info',
                'mocha_istanbul',
                'uglify',
                'feature-doc',
                'jsdoc2md'
            ]
        );
        
        grunt.registerTask(
            'full',
            [
                'fasttime_lint',
                'clean',
                'concat',
                'feature-info',
                'mocha_istanbul',
                'scan-char-defs',
                'uglify',
                'feature-doc',
                'jsdoc2md'
            ]
        );
        
        grunt.util.linefeed = '\n';
    };
