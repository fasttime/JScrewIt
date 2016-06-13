/* eslint-env node */

'use strict';

var ESLINT_RULES =
{
    /* Possible Errors */
    'comma-dangle':                     ['error', 'only-multiline'],
    'no-cond-assign':                   'off',
    'no-console':                       'off',
    'no-constant-condition':            'error',
    'no-control-regex':                 'error',
    'no-debugger':                      'error',
    'no-dupe-args':                     'error',
    'no-dupe-keys':                     'error',
    'no-duplicate-case':                'error',
    'no-empty':                         ['error', { allowEmptyCatch: true }],
    'no-empty-character-class':         'error',
    'no-ex-assign':                     'error',
    'no-extra-boolean-cast':            'error',
    'no-extra-parens':                  'error',
    'no-extra-semi':                    'error',
    'no-func-assign':                   'error',
    'no-inner-declarations':            'error',
    'no-invalid-regexp':                'error',
    'no-irregular-whitespace':          'error',
    'no-negated-in-lhs':                'error',
    'no-obj-calls':                     'error',
    'no-prototype-builtins':            'off',
    'no-regex-spaces':                  'off',
    'no-sparse-arrays':                 'off',
    'no-unexpected-multiline':          'off',
    'no-unreachable':                   'error',
    'no-unsafe-finally':                'error',
    'use-isnan':                        'error',
    'valid-jsdoc':                      'error',
    'valid-typeof':                     'error',
    
    /* Best Practices */
    'accessor-pairs':                   'error',
    'array-callback-return':            'off',
    'block-scoped-var':                 'off',
    'complexity':                       'error',
    'consistent-return':                'off',
    'curly':                            ['error', 'multi-or-nest'],
    'default-case':                     'off',
    'dot-location':                     ['error', 'property'],
    'dot-notation':                     'error',
    'eqeqeq':                           ['error', 'allow-null'],
    'guard-for-in':                     'off',
    'no-alert':                         'off',
    'no-caller':                        'error',
    'no-case-declarations':             'error',
    'no-div-regex':                     'error',
    'no-else-return':                   'off',
    'no-empty-function':                'off',
    'no-empty-pattern':                 'error',
    'no-eq-null':                       'off',
    'no-eval':                          'off',
    'no-extend-native':                 'error',
    'no-extra-bind':                    'error',
    'no-extra-label':                   'error',
    'no-fallthrough':                   'error',
    'no-floating-decimal':              'error',
    'no-implicit-coercion':             'off',
    'no-implicit-globals':              'off',
    'no-implied-eval':                  'error',
    'no-invalid-this':                  'off',
    'no-iterator':                      'error',
    'no-labels':                        'error',
    'no-lone-blocks':                   'error',
    'no-loop-func':                     'error',
    'no-magic-numbers':                 'off',
    'no-multi-spaces':                  'off',
    'no-multi-str':                     'error',
    'no-native-reassign':               'error',
    'no-new':                           'off',
    'no-new-func':                      'off',
    'no-new-wrappers':                  'error',
    'no-octal':                         'error',
    'no-octal-escape':                  'error',
    'no-param-reassign':                'off',
    'no-proto':                         'error',
    'no-redeclare':                     'error',
    'no-return-assign':                 'error',
    'no-script-url':                    'error',
    'no-self-assign':                   'error',
    'no-self-compare':                  'error',
    'no-sequences':                     'error',
    'no-throw-literal':                 'error',
    'no-unmodified-loop-condition':     'error',
    'no-unused-expressions':            'error',
    'no-unused-labels':                 'error',
    'no-useless-call':                  'error',
    'no-useless-concat':                'error',
    'no-useless-escape':                'error',
    'no-void':                          'off',
    'no-warning-comments':              'error',
    'no-with':                          'error',
    'radix':                            'error',
    'vars-on-top':                      'off',
    'wrap-iife':                        'off',
    'yoda':                             'error',
    
    /* Strict Mode */
    'strict':                           ['error', 'safe'],
    
    /* Variables */
    'init-declarations':                'off',
    'no-catch-shadow':                  'error',
    'no-delete-var':                    'error',
    'no-label-var':                     'error',
    'no-restricted-globals':            'error',
    'no-shadow':                        'off',
    'no-shadow-restricted-names':       'error',
    'no-undef':                         'error',
    'no-undef-init':                    'error',
    'no-undefined':                     'error',
    'no-unused-vars':                   ['error', { vars: 'local' }],
    'no-use-before-define':             'off',
    
    /* Node.js and CommonJS */
    'callback-return':                  'off',
    'global-require':                   'off',
    'handle-callback-err':              'error',
    'no-mixed-requires':                'error',
    'no-new-require':                   'error',
    'no-path-concat':                   'error',
    'no-process-env':                   'error',
    'no-process-exit':                  'error',
    'no-restricted-modules':            'error',
    'no-sync':                          'off',
    
    /* Stylistic Issues */
    'array-bracket-spacing':            'error',
    'block-spacing':                    'error',
    'brace-style':                      ['error', 'allman'],
    'camelcase':                        'off',
    'comma-spacing':                    'error',
    'comma-style':
    ['error', 'last', { exceptions: { ArrayExpression: true } }],
    'computed-property-spacing':        'error',
    'consistent-this':                  'off',
    'eol-last':                         'error',
    'func-names':                       'off',
    'func-style':                       'off',
    'id-blacklist':                     'off',
    'id-length':                        'off',
    // Encourage use of abbreviations: "char", "obj", "str".
    'id-match':                         ['error', '^(?!(character|object|string)(?![_a-z]))'],
    'indent':                           ['error', 4, { VariableDeclarator: 0 }],
    'jsx-quotes':                       'error',
    'key-spacing':                      ['error', { mode: 'minimum' }],
    'keyword-spacing':                  'error',
    'linebreak-style':                  'error',
    'lines-around-comment':
    ['error', { allowBlockStart: true, allowObjectStart: true }],
    'max-depth':                        'off',
    'max-len':                          ['error', { code: 100 }],
    'max-lines':                        'off',
    'max-nested-callbacks':             'error',
    'max-params':                       'off',
    'max-statements':                   'off',
    'max-statements-per-line':          'error',
    'new-cap':                          ['error', { capIsNew: false }],
    'new-parens':                       'error',
    'newline-after-var':                'off',
    'newline-before-return':            'off',
    'newline-per-chained-call':         'off',
    'no-array-constructor':             'error',
    'no-bitwise':                       'off',
    'no-continue':                      'off',
    'no-inline-comments':               'off',
    'no-lonely-if':                     'off',
    'no-mixed-operators':               'off',
    'no-mixed-spaces-and-tabs':         'off',
    'no-multiple-empty-lines':          ['error', { max: 1 }],
    'no-negated-condition':             'off',
    'no-nested-ternary':                'off',
    'no-new-object':                    'error',
    'no-plusplus':                      'off',
    'no-restricted-syntax':             'error',
    'no-spaced-func':                   'off',
    'no-ternary':                       'off',
    'no-trailing-spaces':               ['error', { skipBlankLines: true }],
    'no-underscore-dangle':             'off',
    'no-unneeded-ternary':              'error',
    'no-whitespace-before-property':    'error',
    'object-curly-newline':             'off',
    'object-curly-spacing':             ['error', 'always'],
    'object-property-newline':          ['error', { allowMultiplePropertiesPerLine: true }],
    'one-var':                          ['error', 'never'],
    'one-var-declaration-per-line':     'error',
    'operator-assignment':              'error',
    'operator-linebreak':               ['error', 'after'],
    'padded-blocks':                    ['error', 'never'],
    'quote-props':                      'off',
    'quotes':                           ['error', 'single'],
    'require-jsdoc':                    'off',
    'semi':                             'error',
    'semi-spacing':                     'error',
    'sort-vars':                        'off',
    'space-before-blocks':              'error',
    'space-before-function-paren':      ['error', { anonymous: 'always', named: 'never' }],
    'space-in-parens':                  'error',
    'space-infix-ops':                  'error',
    'space-unary-ops':                  'error',
    'spaced-comment':                   'error',
    'unicode-bom':                      'error',
    'wrap-regex':                       'off',
};

var JSCS_OPTIONS =
{
    disallowNamedUnassignedFunctions: true,
    disallowSpacesInCallExpression: true,
    disallowTabs: true,
    requireAlignedMultilineParams: true,
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
    requirePaddingNewLinesAfterUseStrict: true,
    requireSpaceBeforeKeywords: ['delete', 'if', 'in', 'instanceof'],
};

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
                    lib:
                    {
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
                eslint:
                {
                    lib:
                    {
                        options: { parserOptions: { ecmaFeatures: { impliedStrict: true } } },
                        src: 'src/lib/**/*.js'
                    },
                    other:
                    ['*.js', 'build/**/*.js', 'src/html/**/*.js', 'test/**/*.js', 'tools/**/*.js'],
                    options: { rules: ESLINT_RULES }
                },
                jscs:
                {
                    default:
                    ['*.js', 'build/**/*.js', 'src/**/*.js', 'test/**/*.js', 'tools/**/*.js'],
                    options: JSCS_OPTIONS
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
                        {
                            collapse_vars: true,
                            global_defs: { DEBUG: false },
                            hoist_vars: true
                        }
                    }
                }
            }
        );
        
        // These plugins provide necessary tasks.
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-eslint');
        grunt.loadNpmTasks('grunt-jscs');
        grunt.loadNpmTasks('grunt-jsdoc-to-markdown');
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
                'clean:default',
                'eslint',
                'jscs',
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
                'clean',
                'eslint',
                'jscs',
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
