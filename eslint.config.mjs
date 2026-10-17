import { join }                             from 'node:path';
import eslintPluginJScrewIt                 from './dev/internal/eslint-plugin.mjs';
import gherkinParser                        from './dev/internal/gherkin-parser.mjs';
import { createConfig, noParserConfig }     from '@origin-1/eslint-config';
import eslintPluginOrigin1                  from '@origin-1/eslint-plugin';
import eslintPluginEBDD                     from 'eslint-plugin-ebdd';
import { EslintEnvProcessor }               from 'eslint-plugin-eslint-env';
import eslintPluginJSDoc                    from 'eslint-plugin-jsdoc';
import { globalIgnores, includeIgnoreFile } from 'eslint/config';
import globals                              from 'globals';

function allowImportsOnlyFrom(files, ...dirs)
{
    const alternation = dirs.map(RegExp.escape).join('|');
    const regex = `^(?!~[^/]+$|(?:${alternation})/[^/.][^/]*$)`;
    const message = `Only imports from ${dirs.join(', ')} or workspace packages are allowed here.`;
    const rules = { 'no-restricted-imports': ['error', { patterns: [{ regex, message }] }] };
    return { files, rules };
}

const ebddPlugins = { ebdd: eslintPluginEBDD };
const gitignoreFile = join(import.meta.dirname, '.gitignore');
const overrideConfig =
await createConfig
(
    includeIgnoreFile(gitignoreFile, { gitignoreResolution: true }),
    globalIgnores(['packages']),
    noParserConfig,
    {
        files:              ['src/**/*.js'],
        ignores:            ['src/ui/worker.js'],
        jsVersion:          5,
        languageOptions:    { ecmaVersion: 2015, globals: { atob: 'readonly', btoa: 'readonly' } },
        plugins:            { internal: eslintPluginJScrewIt },
        processor:          new EslintEnvProcessor(),
        rules:              { 'internal/sorted-definitions': 'error' },
    },
    allowImportsOnlyFrom(['src/lib/*.js'], '.'),
    allowImportsOnlyFrom(['src/lib/encoder/*.js'], '.', '..'),
    allowImportsOnlyFrom(['src/lib/optimizer/*.js'], '.', '..', '../encoder'),
    allowImportsOnlyFrom(['src/lib/jscrewit/*.js'], '.', '..', '../encoder', '../optimizer'),
    {
        files:              ['src/ui/worker.js'],
        jsVersion:          5,
        languageOptions:    { sourceType: 'commonjs' },
        processor:          new EslintEnvProcessor(),
    },
    {
        files:              ['*.js', 'test/patch-cov-source.js', 'tools/**/*.js'],
        jsVersion:          2025,
        languageOptions:    { globals: globals.node, sourceType: 'commonjs' },
    },
    {
        files:              ['*.mjs', 'dev/**/*.mjs'],
        ignores:            ['dev/internal/browser-assert-strict-polyfill.mjs'],
        jsVersion:          2025,
        languageOptions:    { globals: globals.nodeBuiltin },
    },
    {
        files:              ['dev/internal/browser-assert-strict-polyfill.mjs'],
        jsVersion:          5,
        languageOptions:    { globals: globals.nodeBuiltin, ecmaVersion: 2015 },
    },
    {
        files:              ['test/**/*.js'],
        jsVersion:          5,
        ignores:            ['test/patch-cov-source.js', 'test/tools/**/*.js'],
        languageOptions:    { sourceType: 'script' },
        plugins:            ebddPlugins,
        processor:          new EslintEnvProcessor({ plugins: ebddPlugins }),
    },
    {
        files:              ['test/tools/**/*.js'],
        jsVersion:          2025,
        languageOptions:
        { globals: { ...eslintPluginEBDD.globals, ...globals.node }, sourceType: 'commonjs' },
    },
    {
        files:              ['**/*.{js,mjs}'],
        plugins:            { jsdoc: eslintPluginJSDoc },
        rules:
        {
            'jsdoc/check-alignment':            'error',
            'jsdoc/check-param-names':          'error',
            'jsdoc/check-syntax':               'error',
            'jsdoc/check-tag-names':            'error',
            'jsdoc/empty-tags':                 'error',
            'jsdoc/no-blank-blocks':            'error',
            'jsdoc/no-multi-asterisks':         ['error', { allowWhitespace: true }],
            'jsdoc/no-undefined-types':         ['error', { definedTypes: ['Iterable'] }],
            'jsdoc/require-asterisk-prefix':    'error',
            'jsdoc/require-param-name':         'error',
        },
        settings:           { jsdoc: { mode: 'jsdoc' } },
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
    {
        files:              ['**/*.json'],
        jsonVersion:        'standard',
    },
    {
        files:              ['**/tsconfig.json'],
        language:           'json/jsonc',
        languageOptions:    { allowTrailingCommas: true },
    },
    {
        files:              ['**/package.json'],
        plugins:            { '@origin-1': eslintPluginOrigin1 },
        rules:              { '@origin-1/package-json-fields': 'error' },
    },
);

export default overrideConfig;
