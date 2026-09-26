/* eslint-env ebdd/ebdd */
/* global expect, module, require, self */

'use strict';

(function ()
{
    var JScrewIt = typeof module !== 'undefined' ? require('../node-jscrewit-test') : self.JScrewIt;

    describe
    (
        'JScrewIt.debug.createFigurator',
        function ()
        {
            function checkAltJoinerNotInFigures
            (figurator, altJoinerToLastIndexMap, altJoiner, lastIndex)
            {
                for
                (var index = altJoinerToLastIndexMap[altJoiner] + 1; index <= lastIndex; index++)
                {
                    var figure = figurator(index);
                    expect(figure).not.toContain(altJoiner);
                    altJoinerToLastIndexMap[altJoiner] = index;
                }
            }

            it
            (
                'returns a usable figurator with non-empty start values and an empty joiner',
                function ()
                {
                    var figurator = JScrewIt.debug.createFigurator(['false', 'true'], '');
                    var figureValueToIndexMap = { __proto__: null };
                    var minExpectedSortLength = 0;
                    var altJoinerToLastIndexMap = { __proto__: null };
                    for (var index = 0; index < 0x10000; index++)
                    {
                        var figure = figurator(index);

                        expect(figure)
                        .toMatch
                        (/^false|^true/, 'figure should start with one of the start values');

                        expect(figure)
                        .not
                        .toMatch
                        (
                            /.false|.true/,
                            'a start value may appear only at the start of the figure'
                        );

                        var lastIndex = figureValueToIndexMap[figure];
                        if (lastIndex != null)
                            expect(figure).fail('not to occur more than once');
                        figureValueToIndexMap[figure] = index;

                        var actualSortLength = figure.sortLength;
                        expect(actualSortLength).not.toBeLessThan(minExpectedSortLength);
                        minExpectedSortLength = actualSortLength;

                        var altJoiner = figurator.getAltJoiner(index);
                        if (altJoiner != null)
                        {
                            if (altJoinerToLastIndexMap[altJoiner] == null)
                            {
                                expect(altJoiner).not.toMatch
                                (
                                    /false|true/,
                                    'alternative joiner should not contain any start value'
                                );
                                altJoinerToLastIndexMap[altJoiner] = -1;
                            }

                            // Test that none of the figures so far contains this alternative
                            // joiner.
                            checkAltJoinerNotInFigures
                            (figurator, altJoinerToLastIndexMap, altJoiner, index);
                        }
                    }
                    var firstAltJoiner = figurator.getAltJoiner(0);
                    expect(firstAltJoiner).toBeDefined();
                }
            );
            it
            (
                'returns a usable figurator with an empty start value and a non-empty joiner',
                function ()
                {
                    var joiner = 'false';
                    var figurator = JScrewIt.debug.createFigurator([''], joiner);
                    var figureValueToIndexMap = { __proto__: null };
                    var minExpectedSortLength = 0;
                    var altJoinerToLastIndexMap = { __proto__: null };
                    for (var index = 0; index < 0x10000; index++)
                    {
                        var figure = figurator(index);

                        expect(figure)
                        .not
                        .toContain('false', 'figure should not contain the joiner');

                        var lastIndex = figureValueToIndexMap[figure];
                        if (lastIndex != null)
                            expect(figure).fail('not to occur more than once');
                        figureValueToIndexMap[figure] = index;

                        var actualSortLength = figure.sortLength;
                        expect(actualSortLength).not.toBeLessThan(minExpectedSortLength);
                        minExpectedSortLength = actualSortLength;

                        var altJoiner = figurator.getAltJoiner(index);
                        if (altJoiner != null)
                        {
                            if (altJoinerToLastIndexMap[altJoiner] == null)
                                altJoinerToLastIndexMap[altJoiner] = -1;

                            // Test that none of the figures so far contains this alternative
                            // joiner.
                            checkAltJoinerNotInFigures
                            (figurator, altJoinerToLastIndexMap, altJoiner, index);
                        }
                    }
                    var firstAltJoiner = figurator.getAltJoiner(0);
                    expect(firstAltJoiner).toBeDefined();
                }
            );
        }
    );
}
)();
