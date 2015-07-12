/* jshint node: true */

'use strict';

module.exports =
    function (grunt)
    {
        var JS_FILES = ['*.js', 'build/**/*.js', 'src/**/*.js', 'test/**/*.js'];
        
        // Project configuration.
        grunt.initConfig(
            {
                clean:
                {
                    default:
                    [
                        'coverage',
                        'Features.md',
                        'html/**/*.js',
                        'lib/**/*.js',
                        'output.txt'
                    ]
                },
                concat:
                {
                    default:
                    {
                        src:
                        [
                            'src/lib/preamble',
                            'src/lib/features.js',
                            'src/lib/definers.js',
                            'src/lib/definitions.js',
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
                        banner: '//! JScrewIt <%= pkg.version %> – <%= pkg.homepage %>\n',
                        separator: '\n',
                        stripBanners: true
                    }
                },
                jscs:
                {
                    default: JS_FILES,
                    options:
                    {
                        // Encourage use of abbreviations: "char", "obj", "str".
                        disallowIdentifierNames: ['character', 'object', 'string'],
                        disallowMixedSpacesAndTabs: true,
                        disallowSpaceAfterObjectKeys: true,
                        disallowSpaceAfterPrefixUnaryOperators: true,
                        disallowSpaceBeforePostfixUnaryOperators: true,
                        disallowSpacesInCallExpression: true,
                        disallowSpacesInFunctionDeclaration: { beforeOpeningRoundBrace: true },
                        disallowSpacesInNamedFunctionExpression: { beforeOpeningRoundBrace: true },
                        disallowSpacesInsideBrackets: true,
                        disallowSpacesInsideParentheses: true,
                        disallowTrailingWhitespace: 'ignoreEmptyLines',
                        disallowYodaConditions: true,
                        requireBlocksOnNewline: 1,
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
                            'switch',
                            'throw',
                            'try'
                        ],
                        requireLineBreakAfterVariableAssignment: true,
                        requireLineFeedAtFileEnd: true,
                        requirePaddingNewLinesAfterUseStrict: true,
                        requireSpaceAfterBinaryOperators: true,
                        requireSpaceAfterKeywords: true,
                        requireSpaceAfterLineComment: true,
                        requireSpaceBeforeBinaryOperators: true,
                        requireSpaceBeforeBlockStatements: true,
                        requireSpaceBeforeKeywords:
                        [
                            'delete',
                            'if',
                            'in',
                            'instanceof',
                            'return',
                            'while'
                        ],
                        requireSpaceBeforeObjectValues: true,
                        requireSpaceBetweenArguments: true,
                        requireSpacesInAnonymousFunctionExpression:
                        {
                            beforeOpeningRoundBrace: true
                        },
                        requireSpacesInConditionalExpression: true,
                        requireSpacesInForStatement: true,
                        requireSpacesInFunctionDeclaration: { beforeOpeningCurlyBrace: true },
                        requireSpacesInFunctionExpression: { beforeOpeningCurlyBrace: true },
                        requireSpacesInsideObjectBrackets: 'all',
                        validateAlignedFunctionParameters: true,
                        validateIndentation: 4,
                        validateParameterSeparator: ', '
                    }
                },
                jshint:
                {
                    default: JS_FILES,
                    options:
                    {
                        curly: true,
                        eqeqeq: true,
                        immed: true,
                        latedef: 'nofunc',
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
                        
                        boss: true,
                        elision: true,
                        eqnull: true,
                        evil: true,
                        validthis: true,
                        '-W018': true,
                    }
                },
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
                                'src/html/art.js',
                                'src/html/engine-selection-box.js',
                                'src/html/roll.js',
                                'src/html/ui-main.js'
                            ],
                            'html/worker.js': 'src/html/worker.js'
                        }
                    },
                    lib: { files: { 'lib/jscrewit.min.js': 'lib/jscrewit.js' } },
                    options:
                    {
                        compress: { global_defs: { DEBUG: false }, hoist_vars: true },
                        preserveComments: 'some'
                    }
                }
            }
        );
        
        // These plugins provide necessary tasks.
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-concat');
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
            'scan-char-defs',
            'Analyze all character encodings.',
            function ()
            {
                var runScan = require('./build/scan-char-defs.js');
                var unusedDefs = runScan();
                if (unusedDefs)
                {
                    grunt.warn(
                        'There are unused character definitions. See output.txt for details.'
                    );
                }
                else
                {
                    grunt.log.ok('Done. All character definitions used.');
                }
            }
        );
        
        // Default task.
        grunt.registerTask(
            'default',
            [
                'clean',
                'jshint',
                'jscs',
                'concat',
                'mocha_istanbul',
                'scan-char-defs',
                'uglify',
                'feature-doc'
            ]
        );
        
        // Quick build task.
        grunt.registerTask(
            'quick',
            [
                'clean',
                'jshint',
                'jscs',
                'concat',
                'mocha_istanbul',
                'uglify'
            ]
        );
        
        grunt.util.linefeed = '\n';
    };
