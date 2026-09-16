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
                    var index = insertionValueToLastIndexMap[insertionValue] + 1;
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
                    var figureValueToIndexMap = { __proto__: null };
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

                        var lastIndex = figureValueToIndexMap[figure];
                        if (lastIndex != null)
                            expect(figure).fail('not to occur more than once');
                        figureValueToIndexMap[figure] = index;

                        var actualSortLength = figure.sortLength;
                        expect(actualSortLength).not.toBeLessThan(minExpectedSortLength);
                        minExpectedSortLength = actualSortLength;

                        var insertionValue = figurator.getInsertionValue(index);
                        if (insertionValue != null)
                        {
                            if (insertionValueToLastIndexMap[insertionValue] == null)
                            {
                                expect(insertionValue).not.toMatch
                                (
                                    /false|true/,
                                    'insertion value should not contain any start value'
                                );
                                insertionValueToLastIndexMap[insertionValue] = -1;
                            }

                            // Test that none of the figures so far contains this insertion value.
                            checkInsertionValueNotInFigures
                            (figurator, insertionValueToLastIndexMap, insertionValue, index);
                        }
                    }
                    var firstInsertionValue = figurator.getInsertionValue(0);
                    expect(firstInsertionValue).toBeDefined();
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
                    var insertionValueToLastIndexMap = { __proto__: null };
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

                        var insertionValue = figurator.getInsertionValue(index);
                        if (insertionValue != null)
                        {
                            if (insertionValueToLastIndexMap[insertionValue] == null)
                                insertionValueToLastIndexMap[insertionValue] = -1;

                            // Test that none of the figures so far contains this insertion value.
                            checkInsertionValueNotInFigures
                            (figurator, insertionValueToLastIndexMap, insertionValue, index);
                        }
                    }
                    var firstInsertionValue = figurator.getInsertionValue(0);
                    expect(firstInsertionValue).toBeDefined();
                }
            );
        }
    );
}
)();
