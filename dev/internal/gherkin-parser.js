'use strict';

const { AstBuilder, GherkinClassicTokenMatcher, Parser } = require('@cucumber/gherkin');

function createGherkinParser(options)
{
    const builder = new AstBuilder(String);
    const tokenMatcher = new GherkinClassicTokenMatcher(options.defaultDialectName);
    const parser = new Parser(builder, tokenMatcher);
    return parser;
}

module.exports =
{
    parse(text, options)
    {
        const parser = createGherkinParser(options);
        try
        {
            const ast = parser.parse(text);
            ast.body = [];
            ast.loc = { };
            ast.range = [,,];
            ast.tokens = [];
            ast.type = 'Program';
            return ast;
        }
        catch (error)
        {
            const [subError] = error.errors;
            if (subError)
            {
                const { location } = subError;
                error.lineNumber    = location.line;
                error.column        = location.column;
            }
            throw error;
        }
    },
};
