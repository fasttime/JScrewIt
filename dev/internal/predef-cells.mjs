/* ---------------------------------------------------------------------------------------------- *\

Cell analysis of predefinitions.

A cell is the set of feature combinations for which an encoding behaves exactly as it does at a node
visited by the feature analyzer: the combinations that include the feature of the node and none of
the groups of features that the encoding queried at that node and found unavailable (the
"negatives" of the cell).
Cells partition all valid feature combinations, and the optimal variants of a predefinition are the
same throughout a cell.

An entry of a definition list is relevant to a cell if it matches some feature combination in the
cell, i.e. if the union of the entry's features and the cell's feature is a valid feature that
includes none of the cell's negatives.
At runtime, the entry that determines the value for a feature combination is the last one matching
it.
An entry can be the last match for some combination in a cell if it is relevant to the cell and no
later relevant entry matches the union of the entry's features and the cell's feature.

\* ---------------------------------------------------------------------------------------------- */

import JScrewIt from '#jscrewit';
import Analyzer from './optimized-analyzer.mjs';

/** @import { Mask } from '~feature-hub' */

/**
 * A set of feature combinations for which an encoding behaves the same, along with the variants of
 * a predefinition that are optimal throughout it.
 *
 * @typedef {object} PredefCell
 *
 * @property {Mask} mask
 * The mask of the feature associated with the analyzer node the cell originates from.
 *
 * Every feature combination in the cell includes this mask.
 *
 * @property {Mask[]} negatives
 * The masks of the groups of features that the encoding queried and found unavailable.
 *
 * No feature combination in the cell includes any of these masks.
 *
 * @property {*[]} variants
 * The variants that yield the shortest output throughout the cell.
 */

const { Feature, debug: { featureFromMask, maskIncludes, maskUnion } } = JScrewIt;

/**
 * An entry of a definition list: the set of variants that are optimal for every feature combination
 * resolved by the entry, along with the mask of the features of the entry.
 *
 * Any of the variants is acceptable as the value of the entry.
 *
 * @extends {Set<*>}
 */
export class PredefEntry extends Set
{
    /**
     * The mask of the features of the entry.
     *
     * @type {Mask}
     */
    mask;

    /**
     * @param {Mask} mask
     * The mask of the features of the entry.
     *
     * @param {Iterable<*>} variants
     * The variants that are optimal for every feature combination resolved by the entry.
     */
    constructor(mask, variants)
    {
        super(variants);
        this.mask = mask;
    }
}

/**
 * Runs the feature analyzer on the encoding of all candidate variants of a predefinition and
 * returns the cells found.
 *
 * @param {object} predefTestData
 * The test data of the predefinition.
 *
 * @param {{ mask: Mask, definition: * }[]} predefTestData.availableEntries
 * The entries of the candidate variants.
 *
 * @param {(encoder: object, definition: *) => string} predefTestData.replaceVariant
 * A function that encodes a variant with a specified encoder and returns the result.
 *
 * @param {{ update(progress: number): void }} [bar]
 * A progress bar to update as the analysis proceeds.
 *
 * @returns {PredefCell[]}
 * The cells found, in analyzer visitation order.
 *
 * @throws {Error}
 * If no candidate variant is available for some feature combination.
 */
export function analyzeCells(predefTestData, bar)
{
    const { availableEntries, replaceVariant } = predefTestData;
    const cells = [];
    const analyzer = new Analyzer(Feature.DEFAULT);
    let encoder;
    while (encoder = analyzer.nextEncoder)
    {
        let optimalLength = Infinity;
        let variants = [];
        for (const { definition, mask } of availableEntries)
        {
            if (encoder.hasFeatures(mask))
            {
                const { length } = replaceVariant(encoder, definition);
                if (length <= optimalLength)
                {
                    if (length < optimalLength)
                    {
                        optimalLength = length;
                        variants = [];
                    }
                    variants.push(definition);
                }
            }
        }
        const { featureObj } = analyzer;
        if (!variants.length)
        {
            const message = `No definition available for ${featureObj}`;
            throw Error(message);
        }
        const negatives =
        analyzer.featureQueries.filter(({ included }) => !included).map(({ mask }) => mask);
        const cell = { mask: featureObj.mask, negatives, variants };
        cells.push(cell);
        if (bar)
            bar.update(analyzer.progress);
    }
    return cells;
}

export function createCellChecker(cells)
{
    const relevanceCache = new Map();

    function isRelevant(mask, cellIndex)
    {
        const key = String(mask);
        let relevances = relevanceCache.get(key);
        if (!relevances)
            relevanceCache.set(key, relevances = []);
        let relevance = relevances[cellIndex];
        if (relevance == null)
        {
            const cell = cells[cellIndex];
            const unionMask = maskUnion(mask, cell.mask);
            relevance =
            featureFromMask(unionMask) != null &&
            cell.negatives.every(negative => !maskIncludes(unionMask, negative));
            relevances[cellIndex] = relevance;
        }
        return relevance;
    }

    /**
     * Validates a definition list against all cells.
     *
     * A list is valid if, for every feature combination in every cell, the last entry matching the
     * combination admits a variant that is optimal for the cell.
     *
     * @param {PredefEntry[]} entries
     * The definition list, in definition order.
     *
     * @param {(cellIndex: number, entryIndex?: number) => void} [report]
     * A function called for each failure with the index of the cell and the index of the offending
     * entry, or `undefined` as the second argument if no entry matches the cell.
     *
     * If specified, the validation continues after a failure; otherwise, it stops at the first one.
     *
     * @returns {PredefEntry[]|undefined}
     * A copy of the list where the variants of each entry are narrowed down to those still
     * acceptable, if the list is valid; `undefined` otherwise.
     */
    function validate(entries, report)
    {
        let valid = true;
        const variantSets = entries.map(entry => new Set(entry));
        for (let cellIndex = cells.length; --cellIndex >= 0;)
        {
            const cell = cells[cellIndex];
            const relevantIndices = [];
            entries.forEach
            (
                ({ mask }, index) =>
                {
                    if (isRelevant(mask, cellIndex))
                        relevantIndices.push(index);
                },
            );
            if (!relevantIndices.length)
            {
                valid = false;
                if (!report)
                    return;
                report(cellIndex);
                continue;
            }
            for (const index of relevantIndices)
            {
                const unionMask = maskUnion(cell.mask, entries[index].mask);
                const overridden =
                relevantIndices.some
                (
                    laterIndex =>
                    laterIndex > index && maskIncludes(unionMask, entries[laterIndex].mask),
                );
                if (overridden)
                    continue;
                const variantSet = variantSets[index];
                const variants = new Set(cell.variants).intersection(variantSet);
                if (variants.size)
                    variantSets[index] = variants;
                else
                {
                    valid = false;
                    if (!report)
                        return;
                    report(cellIndex, index);
                }
            }
        }
        if (valid)
        {
            const narrowedEntries =
            entries.map(({ mask }, index) => new PredefEntry(mask, variantSets[index]));
            return narrowedEntries;
        }
    }

    return { isRelevant, validate };
}
