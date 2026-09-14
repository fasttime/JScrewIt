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
            function checkInsertionValueNotInFigures
            (figurator, insertionValueToLastIndexMap, insertionValue, lastIndex)
            {
                for
                (
                    var index = insertionValueToLastIndexMap[insertionValue] + 1 || 0;
                    index <= lastIndex;
                    index++
                )
                {
                    var figure = figurator(index);
                    expect(figure).not.toContain(insertionValue);
                    insertionValueToLastIndexMap[insertionValue] = index;
                }
            }

            it
            (
                'returns a usable figurator with non-empty start values and an empty joiner',
                function ()
                {
                    var figurator = JScrewIt.debug.createFigurator(['false', 'true'], '');
                    var minExpectedSortLength = 0;
                    var insertionValueToLastIndexMap = { __proto__: null };
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

                        var actualSortLength = figure.sortLength;
                        expect(actualSortLength).not.toBeLessThan(minExpectedSortLength);
                        minExpectedSortLength = actualSortLength;

                        var insertionValue = figurator.getInsertionValue(index);
                        if (insertionValue != null)
                        {
                            // Test that none of the figures so far contains this insertion value.
                            checkInsertionValueNotInFigures
                            (figurator, insertionValueToLastIndexMap, insertionValue, index);
                        }
                    }
                }
            );
            it
            (
                'returns a usable figurator an empty start value and a non-empty joiner',
                function ()
                {
                    var figurator = JScrewIt.debug.createFigurator([''], 'false');
                    var minExpectedSortLength = 0;
                    var insertionValueToLastIndexMap = { __proto__: null };
                    for (var index = 0; index < 0x10000; index++)
                    {
                        var figure = figurator(index);

                        expect(figure)
                        .not
                        .toContain('false', 'figure should not contain the joiner');

                        var actualSortLength = figure.sortLength;
                        expect(actualSortLength).not.toBeLessThan(minExpectedSortLength);
                        minExpectedSortLength = actualSortLength;

                        var insertionValue = figurator.getInsertionValue(index);
                        if (insertionValue != null)
                        {
                            // Test that none of the figures so far contains this insertion value.
                            checkInsertionValueNotInFigures
                            (figurator, insertionValueToLastIndexMap, insertionValue, index);
                        }
                    }
                }
            );
        }
    );
}
)();
