/* jshint node: true */

'use strict';

var JSCS_OPTIONS =
{
    disallowEmptyBlocks: true,
    // Encourage use of abbreviations: "char", "obj", "str".
    disallowIdentifierNames: ['character', 'object', 'string'],
    disallowMultipleLineBreaks: true,
    disallowMultipleVarDecl: true,
    disallowNamedUnassignedFunctions: true,
    disallowSpaceAfterObjectKeys: true,
    disallowSpaceAfterPrefixUnaryOperators: true,
    disallowSpaceBeforeComma: { allExcept: ['sparseArrays'] },
    disallowSpaceBeforePostfixUnaryOperators: true,
    disallowSpaceBeforeSemicolon: true,
    disallowSpacesInCallExpression: true,
    disallowSpacesInFunctionDeclaration: { beforeOpeningRoundBrace: true },
    disallowSpacesInNamedFunctionExpression: { beforeOpeningRoundBrace: true },
    disallowSpacesInsideBrackets: true,
    disallowSpacesInsideParentheses: true,
    disallowTabs: true,
    disallowTrailingWhitespace: 'ignoreEmptyLines',
    disallowYodaConditions: true,
    requireAlignedMultilineParams: true,
    requireBlocksOnNewline: true,
    requireEarlyReturn: true,
    requireKeywordsOnNewLine:
    [
        'break',
        'case',
        'catch',
        'continue',
        'default',
        'do',
        'else',
        'finally',
        'for',
        'return',
        'switch',
        'throw',
        'try',
        'while'
    ],
    requireLineBreakAfterVariableAssignment: true,
    requireLineFeedAtFileEnd: true,
    requireNewlineBeforeBlockStatements: true,
    requireObjectKeysOnNewLine: { allExcept: ['sameLine'] },
    requirePaddingNewLinesAfterUseStrict: true,
    requireSpaceAfterBinaryOperators: true,
    requireSpaceAfterComma: true,
    requireSpaceAfterKeywords: true,
    requireSpaceAfterLineComment: true,
    requireSpaceBeforeBinaryOperators: true,
    requireSpaceBeforeBlockStatements: true,
    requireSpaceBeforeKeywords: ['delete', 'if', 'in', 'instanceof'],
    requireSpaceBeforeObjectValues: true,
    requireSpacesInConditionalExpression: true,
    requireSpacesInForStatement: true,
    requireSpacesInsideObjectBrackets: 'all',
    validateAlignedFunctionParameters: true,
    validateIndentation: { includeEmptyLines: true, value: 4 }
};

var JSHINT_OPTIONS =
{
    // Enforcing options
    eqeqeq: true,
    immed: true,
    maxlen: 100,
    newcap: false,
    noarg: true,
    noempty: true,
    quotmark: true,
    singleGroups: true,
    strict: true,
    trailing: true,
    undef: true,
    unused: true,
    
    // Relaxing options
    boss: true,
    elision: true,
    eqnull: true,
    evil: true,
    validthis: true,
    '-W018': true,
};

module.exports =
    function (grunt)
    {
        var JS_FILES =
        {
            default: ['*.js', 'build/**/*.js', 'src/**/*.js', 'test/**/*.js', 'tools/**/*.js'],
            html: 'src/html/**/*.js',
            lib: ['src/lib/**/*.js', 'test/**/*.js']
        };
        
        // Project configuration.
        grunt.initConfig(
            {
                clean:
                {
                    build: ['Features.md', 'Reference.md', 'char-map.json', 'output.txt'],
                    html: 'html/**/*.js',
                    lib: ['coverage', 'lib/**/*.js']
                },
                concat:
                {
                    lib:
                    {
                        src:
                        [
                            'src/lib/preamble',
                            'src/lib/obj-utils.js',
                            'src/lib/mask.js',
                            'src/lib/features.js',
                            'src/lib/definers.js',
                            'src/lib/definitions.js',
                            'src/lib/figures.js',
                            'src/lib/screw-buffer.js',
                            'src/lib/encoder.js',
                            'src/lib/trim-js.js',
                            'src/lib/jscrewit-base.js',
                            'src/lib/debug.js',
                            'src/lib/postamble'
                        ],
                        dest: 'lib/jscrewit.js'
                    },
                    options:
                    {
                        banner: '// JScrewIt <%= pkg.version %> – <%= pkg.homepage %>\n',
                        stripBanners: true
                    }
                },
                jscs:
                {
                    default: JS_FILES.default,
                    html: JS_FILES.html,
                    lib: JS_FILES.lib,
                    options: JSCS_OPTIONS
                },
                jsdoc2md: { default: { dest: 'Reference.md', src: 'lib/jscrewit.js' } },
                jshint:
                {
                    default: JS_FILES.default,
                    html: JS_FILES.html,
                    lib: JS_FILES.lib,
                    options: JSHINT_OPTIONS
                },
                mocha_istanbul:
                {
                    default: 'test/**/*.spec.js',
                    lib: { options: { root: 'lib' }, src: 'test/**/jscrewit.spec.js' }
                },
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
                        compress: { global_defs: { DEBUG: false }, hoist_vars: true }
                    }
                }
            }
        );
        
        // These plugins provide necessary tasks.
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-jsdoc-to-markdown');
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-jscs');
        grunt.loadNpmTasks('grunt-mocha-istanbul');
        
        grunt.registerTask(
            'feature-doc',
            'Create Feature Reference documentation.',
            function ()
            {
                grunt.file.write('Features.md', require('./build/make-feature-doc.js')());
                grunt.log.ok('Done.');
            }
        );
        
        grunt.registerTask(
            'feature-info',
            'Show feature support information for the JavaScript engine in use.',
            function ()
            {
                var showFeatureSupport = require('./test/feature-info.js');
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
                var timeUtils = require('./tools/time-utils.js');
                var defsUnused;
                var time;
                try
                {
                    time =
                        timeUtils.timeThis(
                            function ()
                            {
                                var runScan = require('./build/scan-char-defs.js');
                                defsUnused = runScan();
                            }
                        );
                }
                catch (error)
                {
                    grunt.warn(error);
                    return;
                }
                var timeStr = timeUtils.formatDuration(time);
                grunt.log.writeln(timeStr + ' elapsed.');
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
                'clean',
                'jshint:default',
                'jscs:default',
                'concat',
                'feature-info',
                'mocha_istanbul:default',
                'scan-char-defs',
                'uglify',
                'feature-doc',
                'jsdoc2md'
            ]
        );
        
        grunt.registerTask('html', ['clean:html', 'jshint:html', 'jscs:html', 'uglify:html']);
        
        grunt.registerTask(
            'lib',
            [
                'clean:lib',
                'jshint:lib',
                'jscs:lib',
                'concat',
                'feature-info',
                'mocha_istanbul:lib',
                'uglify:lib'
            ]
        );
        
        grunt.util.linefeed = '\n';
    };
