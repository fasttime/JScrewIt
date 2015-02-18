/* jshint node: true */

'use strict';

module.exports =
    function (grunt)
    {
        // Project configuration.
        grunt.initConfig(
            {
                clean: ['coverage', 'lib/**/*.min.js'],
                jscs:
                {
                    main: ['*.js', 'lib/**/*.js', 'test/**/*.js'],
                    options:
                    {
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
                        validateIndentation: 4,
                        validateParameterSeparator: ', '
                    }
                },
                jshint:
                {
                    main: ['*.js', 'lib/**/*.js', 'test/**/*.js'],
                    options:
                    {
                        curly: true,
                        eqeqeq: true,
                        immed: true,
                        latedef: true,
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
                mocha_istanbul: ['test/**/*.spec.js'],
                uglify:
                {
                    main: { files: { 'lib/jscrewit.min.js': 'lib/jscrewit.js' } },
                    options: { compress: { global_defs: { DEBUG: false }, hoist_vars: true } }
                }
            }
        );
        
        // These plugins provide necessary tasks.
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-jscs');
        grunt.loadNpmTasks('grunt-mocha-istanbul');
        
        // Default task.
        grunt.registerTask('default', ['clean', 'jshint', 'jscs', 'mocha_istanbul', 'uglify']);
    };
