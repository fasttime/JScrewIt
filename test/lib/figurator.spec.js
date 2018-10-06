/* eslint-env mocha */
/* global expect, module, require, self */

'use strict';

(function ()
{
    var JScrewIt = typeof module !== 'undefined' ? require('../node-jscrewit-test') : self.JScrewIt;

    describe(
        'JScrewIt.debug.createFigurator',
        function ()
        {
            it(
                'returns a figurator with usable joiners',
                function ()
                {
                    var startValues = [''];
                    for (; ;)
                    {
                        var figurator = JScrewIt.debug.createFigurator(startValues);
                        var joiner;
                        for (var index = 0; ; ++index)
                        {
                            var figure = figurator(index);
                            joiner = figure.joiner;
                            expect(joiner).not.toBe(figure.valueOf());
                            if (startValues.indexOf(joiner) < 0)
                                break;
                        }
                        if (joiner == null)
                            break;
                        expect(startValues).not.toContain(joiner);
                        startValues.push(joiner);
                    }
                }
            );
            it(
                'returns a figurator that filters start values from figures',
                function ()
                {
                    var figurator =
                        JScrewIt.debug.createFigurator(
                            [
                                '',
                                'false',
                                'true',
                                '0',
                                'undefined',
                                '1',
                                'NaN',
                                '2',
                                'f',
                                't',
                                '3',
                                'r',
                                'u',
                                'n',
                                'l',
                                '4',
                                'd',
                                's',
                                'e',
                                '5',
                                'i',
                                '6',
                                '7',
                                '8',
                                '9',
                            ]
                        );
                    for (var index = 0; ; ++index)
                    {
                        var figure = figurator(index);
                        var sortLength = figure.sortLength;
                        if (sortLength > 50)
                            break;
                        if (sortLength >= 50)
                            expect(figure.valueOf()).not.toBe('NaN');
                    }
                }
            );
        }
    );
}
)();
