import { join }                         from 'node:path';
import { createConfig, noParserConfig } from '@origin-1/eslint-config';
import eslintPluginOrigin1              from '@origin-1/eslint-plugin';
import { globals as ebddGlobals }       from 'eslint-plugin-ebdd';
import { includeIgnoreFile }            from 'eslint/config';
import globals                          from 'globals';

const gitignoreFile = join(import.meta.dirname, '..', '..', '.gitignore');
const overrideConfig =
await createConfig
(
    includeIgnoreFile(gitignoreFile, { gitignoreResolution: true }),
    noParserConfig,
    {
        files:              ['src/**/*.ts', 'test/*.ts'],
        tsVersion:          '6.0.0',
    },
    {
        files:              ['test/spec/**/*.ts'],
        tsVersion:          '6.0.0',
        languageOptions:    { globals: { ...ebddGlobals, ...globals.nodeBuiltin } },
    },
    {
        files:              ['*.js', 'dev/**/*.js'],
        jsVersion:          2025,
        languageOptions:    { globals: globals.nodeBuiltin },
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
