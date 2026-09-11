#!/usr/bin/env node

/* ---------------------------------------------------------------------------------------------- *\

Optimizes a list of predefined values against feature combinations.

This script prints an array of `define(...)` entries that can be copy-pasted into
`src/lib/definitions.js`.
Each entry consists of a value, or the index of a value in a list of available values, followed by a
list of features.
At runtime, `Encoder#findDefinition()` scans such entries from last to first and picks the first one
whose features are all available to the encoder.

The purpose of pre-optimized entries is to guarantee that every feature combination resolves to the
value that generates the shortest JSFuck code, without comparing all candidate values at runtime,
which would be slow.

The optimization proceeds in four steps.

1. Analysis: a feature analyzer (see `dev/internal/analyzer.mjs`) is run on the encoding of every
   candidate value.
   Every feature combination visited by the analyzer yields a cell (see
   `dev/internal/predef-cells.mjs`) along with the candidate values that yield the shortest output
   throughout the cell.
2. Selection: the cells are turned into entries in visitation order, which guarantees that the last
   entry matching a feature combination is the one of its cell.
   An entry is only kept if the earlier entries do not already resolve every combination in its
   cell to an optimal value.
3. Merging: pairs of entries with a common optimal value are repeatedly replaced by a single entry
   with the features common to both, as long as the resulting list remains valid for every feature
   combination.
4. Pruning: single features are repeatedly removed from entries, as long as the resulting list
   remains valid for every feature combination.
   Merging and pruning are alternated until the list no longer changes.
5. Sorting: entries are reordered so that entries with fewer features come first and entries with
   the same number of features are sorted by feature names, as far as the resulting list remains
   valid for every feature combination.

When the candidate values come from a list of available entries with their own feature requirements
(see `defineList` in `src/lib/definers.js`), those features are omitted from the printed entries,
because they are added back at runtime.

The predefinition to optimize can be passed as a command line argument; if omitted, the script
prompts for it.

\* ---------------------------------------------------------------------------------------------- */

import JScrewIt, { Feature }                            from '#jscrewit';
import choose                                           from './internal/choose.mjs';
import { PredefEntry, analyzeCells, createCellChecker } from './internal/predef-cells.mjs';
import PREDEF_TEST_DATA_MAP_OBJ                         from './internal/predef-test-data.mjs';
import progress                                         from './internal/progress.mjs';
import SolutionBookMap                                  from './internal/solution-book-map.mjs';

/** @import { PredefCell }  from './internal/predef-cells.mjs' */
/** @import { Mask }        from '~feature-hub' */

const LINE_LENGTH = 100;

const { featureFromMask, maskIncludes, maskUnion } = JScrewIt.debug;

/**
 * Compares two lists of feature names: shorter lists come first, and lists of the same length are
 * compared name by name.
 *
 * @param {string[]} featureNames1
 * The first list of feature names.
 *
 * @param {string[]} featureNames2
 * The second list of feature names.
 *
 * @returns {number}
 * A negative number if the first list comes first, a positive number if the second list comes
 * first, or 0 if the lists are equal.
 */
function compareFeatureNames(featureNames1, featureNames2)
{
    const { length } = featureNames1;
    {
        const diff = length - featureNames2.length;
        if (diff)
            return diff;
    }
    for (let index = 0; index < length; ++index)
    {
        const featureName1 = featureNames1[index];
        const featureName2 = featureNames2[index];
        if (featureName1 > featureName2)
            return 1;
        if (featureName1 < featureName2)
            return -1;
    }
    return 0;
}

function featureDifference(featureAll, featureSome)
{
    const elementaryNames =
    featureAll.elementaryNames.filter
    (
        elementaryName =>
        {
            const result = !featureSome.includes(elementaryName);
            return result;
        },
    );
    const featureComplement = Feature(elementaryNames);
    return featureComplement;
}

/**
 * Returns the names of the features of an entry as they are printed, i.e. without the features
 * required for the printed variant to be available.
 *
 * @param {PredefEntry} entry
 * The entry.
 *
 * @param {Map<*, Mask>} variantToMinMaskMap
 * A map from each variant to the mask of the features required for the variant to be available.
 *
 * @returns {string[]}
 * The canonical names of the printed features, in alphabetical order.
 */
function getPrintedFeatureNames(entry, variantToMinMaskMap)
{
    const { mask } = entry;
    const [variant] = entry;
    const minFeature = featureFromMask(variantToMinMaskMap.get(variant));
    const featureObj = featureDifference(featureFromMask(mask), minFeature);
    const { canonicalNames } = featureObj;
    return canonicalNames;
}

function maskIntersection(mask1, mask2)
{
    const feature2 = featureFromMask(mask2);
    const elementaryNames =
    featureFromMask(mask1).elementaryNames.filter
    (elementaryName => feature2.includes(elementaryName));
    const { mask } = Feature(elementaryNames);
    return mask;
}

/**
 * Repeatedly replaces two entries with a common variant by a single entry with the features common
 * to both, whenever the resulting list is still valid for every cell.
 *
 * @param {PredefEntry[]} entries
 * The list of entries to merge, in definition order.
 *
 * This array is not modified.
 *
 * @param {(entries: PredefEntry[]) => PredefEntry[]|undefined} validate
 * A function that validates a list of entries.
 *
 * It should return a copy of the list with the variants of each entry narrowed down if the entries
 * are valid for every cell, or `undefined` otherwise.
 *
 * @returns {PredefEntry[]}
 * The merged list of entries, in definition order.
 */
function mergeEntries(entries, validate)
{
    progress
    (
        'Merging definitions',
        bar =>
        {
            const initialCount = entries.length;
            for (let index2 = initialCount; --index2 >= 0;)
            {
                bar.update((initialCount - index2) / initialCount);
                let merged = false;
                for (let index1 = index2; --index1 >= 0;)
                {
                    const mergedEntries = tryMerge(entries, index1, index2, validate);
                    if (mergedEntries)
                    {
                        entries = mergedEntries;
                        merged = true;
                        break;
                    }
                }
                if (merged)
                    index2 = entries.length; // Start over with the reduced list.
            }
            bar.update(1);
        },
    );
    return entries;
}

function optimize(predefTestData)
{
    SolutionBookMap.load();
    let cells;
    progress
    (
        'Scanning definitions',
        bar =>
        {
            cells = analyzeCells(predefTestData, bar);
        },
    );
    const { isRelevant, validate } = createCellChecker(cells);
    let entries = selectEntries(cells, isRelevant);
    console.log('%d cell(s), %d selected definition(s).', cells.length, entries.length);
    const { variantToMinMaskMap } = predefTestData;
    for (;;)
    {
        entries = mergeEntries(entries, validate);
        const prunedEntries = pruneEntries(entries, validate, variantToMinMaskMap);
        if (prunedEntries === entries)
            break;
        entries = prunedEntries;
    }
    entries = sortEntries(entries, validate, variantToMinMaskMap);
    if (!validate(entries))
        throw Error('Internal error: the optimized definitions are not valid.');
    printDefinitions(entries, predefTestData);
}

function printDefinitions(entries, { indent, formatVariant, variantToMinMaskMap })
{
    const argsList = [];
    for (const entry of entries)
    {
        const [variant] = entry;
        const featureNames = getPrintedFeatureNames(entry, variantToMinMaskMap);
        const args = [formatVariant(variant), ...featureNames];
        argsList.push(args);
    }
    const indentStr = ' '.repeat(indent);
    console.log('\n---\n');
    const str = `[${argsList.map(args => `define(${args.join(', ')})`).join(', ')}]`;
    if (str.length <= LINE_LENGTH - indent)
        console.log('%s%s', indentStr, str);
    else
    {
        console.log('%s[', indentStr);
        for (const args of argsList)
        {
            let str = args.join(', ');
            const restLength = LINE_LENGTH - str.length - indent;
            if (restLength >= 13)
                str = `(${str})`;
            else if (restLength >= 7)
                str = `\n${indentStr}    (${str})`;
            else
            {
                str =
                `\n${indentStr}    (${args.map(arg => `\n${indentStr}        ${arg}`)}` +
                `\n${indentStr}    )`;
            }
            console.log('%s    define%s,', indentStr, str);
        }
        console.log('%s]', indentStr);
    }
    console.log('\n---\n');
    console.log('%d definition(s) listed.', argsList.length);
}

/**
 * Repeatedly removes single features from entries, whenever the resulting list is still valid for
 * every cell.
 *
 * @param {PredefEntry[]} entries
 * The list of entries to prune, in definition order.
 *
 * This array is not modified.
 *
 * @param {(entries: PredefEntry[]) => PredefEntry[]|undefined} validate
 * A function that validates a list of entries.
 *
 * It should return a copy of the list with the variants of each entry narrowed down if the entries
 * are valid for every cell, or `undefined` otherwise.
 *
 * @param {Map<*, Mask>} variantToMinMaskMap
 * A map from each variant to the mask of the features required for the variant to be available.
 *
 * @returns {PredefEntry[]}
 * The pruned list of entries, in definition order, or the same array that was passed in if no
 * feature could be removed.
 */
function pruneEntries(entries, validate, variantToMinMaskMap)
{
    progress
    (
        'Pruning features',
        bar =>
        {
            const { length } = entries;
            for (let index = length; --index >= 0;)
            {
                bar.update((length - 1 - index) / length);
                const { elementaryNames } = featureFromMask(entries[index].mask);
                for (const elementaryName of elementaryNames)
                {
                    const prunedEntries =
                    tryPrune(entries, index, elementaryName, validate, variantToMinMaskMap);
                    if (prunedEntries)
                        entries = prunedEntries;
                }
            }
            bar.update(1);
        },
    );
    return entries;
}

/**
 * Turns cells into entries in visitation order, keeping an entry only if the earlier entries do
 * not already resolve every feature combination in its cell to an optimal variant.
 * The variants of the earlier entries are narrowed down as needed.
 *
 * @param {PredefCell[]} cells
 * The cells to select entries from, in analyzer visitation order, as returned by `analyzeCells`.
 *
 * @param {(mask: Mask, cellIndex: number) => boolean} isRelevant
 * A function that determines whether an entry matches any feature combination in a cell.
 *
 * @returns {PredefEntry[]}
 * The selected entries, in definition order.
 */
function selectEntries(cells, isRelevant)
{
    const entries = [];
    cells.forEach
    (
        (cell, cellIndex) =>
        {
            const relevantIndices = [];
            entries.forEach
            (
                ({ mask }, index) =>
                {
                    if (isRelevant(mask, cellIndex))
                        relevantIndices.push(index);
                },
            );
            const updates = [];
            let covered = relevantIndices.length > 0;
            for (const index of relevantIndices)
            {
                const entry = entries[index];
                const unionMask = maskUnion(cell.mask, entry.mask);
                const overridden =
                relevantIndices.some
                (index2 => index2 > index && maskIncludes(unionMask, entries[index2].mask));
                if (overridden)
                    continue;
                const variants = new Set(cell.variants).intersection(entry);
                if (!variants.size)
                {
                    covered = false;
                    break;
                }
                updates.push({ index, variants });
            }
            if (covered)
            {
                for (const { index, variants } of updates)
                    entries[index] = new PredefEntry(entries[index].mask, variants);
            }
            else
            {
                const entry = new PredefEntry(cell.mask, cell.variants);
                entries.push(entry);
            }
        },
    );
    return entries;
}

/**
 * Reorders the entries so that entries with fewer printed features come first and entries with the
 * same number of features are sorted by feature names, as far as the list remains valid for every
 * cell.
 *
 * Each position is filled with the first entry in sorting order, among the remaining ones, that can
 * be moved there without invalidating the list.
 *
 * @param {PredefEntry[]} entries
 * The list of entries to sort, in definition order.
 *
 * This array is not modified.
 *
 * @param {(entries: PredefEntry[]) => PredefEntry[]|undefined} validate
 * A function that validates a list of entries.
 *
 * It should return a copy of the list with the variants of each entry narrowed down if the entries
 * are valid for every cell, or `undefined` otherwise.
 *
 * @param {Map<*, Mask>} variantToMinMaskMap
 * A map from each variant to the mask of the features required for the variant to be available.
 *
 * @returns {PredefEntry[]}
 * The sorted list of entries, in definition order.
 */
function sortEntries(entries, validate, variantToMinMaskMap)
{
    const compareEntries =
    (entry1, entry2) =>
    {
        const featureNames1 = getPrintedFeatureNames(entry1, variantToMinMaskMap);
        const featureNames2 = getPrintedFeatureNames(entry2, variantToMinMaskMap);
        const result = compareFeatureNames(featureNames1, featureNames2);
        return result;
    };

    const indexLimit = entries.length - 1;
    for (let index = 0; index < indexLimit; ++index)
    {
        const currentEntry = entries[index];
        const candidates = entries.slice(index).sort(compareEntries);
        for (const candidate of candidates)
        {
            if (candidate === currentEntry)
                break;
            const trialEntries =
            [
                ...entries.slice(0, index),
                candidate,
                ...entries.slice(index).filter(entry => entry !== candidate),
            ];
            const narrowedEntries = validate(trialEntries);
            if (narrowedEntries)
            {
                entries = narrowedEntries;
                break;
            }
        }
    }
    return entries;
}

/**
 * Attempts to replace the entries at the specified indices with a single entry that has the
 * features common to both and a variant that is optimal for both.
 *
 * @param {PredefEntry[]} entries
 * The current list of entries, in definition order.
 *
 * This array is not modified.
 *
 * @param {number} index1
 * The index of the earlier of the two entries to merge.
 *
 * @param {number} index2
 * The index of the later of the two entries to merge.
 *
 * This must be greater than `index1`.
 *
 * @param {(entries: PredefEntry[]) => PredefEntry[]|undefined} validate
 * A function that validates a list of entries.
 *
 * It should return a copy of the list with the variants of each entry narrowed down if the entries
 * are valid for every cell, or `undefined` otherwise.
 *
 * @returns {PredefEntry[]|undefined}
 * The resulting list if it is valid for every cell, or `undefined` otherwise.
 */
function tryMerge(entries, index1, index2, validate)
{
    const entry1 = entries[index1];
    const entry2 = entries[index2];
    const variants = entry1.intersection(entry2);
    if (!variants.size)
        return;
    const mask = maskIntersection(entry1.mask, entry2.mask);
    const mergedEntry = new PredefEntry(mask, variants);
    for (const survivorIndex of [index2, index1])
    {
        const trialEntries =
        entries.map
        (
            (entry, index) =>
            {
                if (index === survivorIndex)
                    return mergedEntry;
                if (index === index1 || index === index2)
                    return null;
                return entry;
            },
        )
        .filter(Boolean);
        const mergedEntries = validate(trialEntries);
        if (mergedEntries)
            return mergedEntries;
    }
}

/**
 * Attempts to remove a feature from the entry at the specified index.
 * Variants that require the removed feature are dropped from the entry.
 *
 * @param {PredefEntry[]} entries
 * The current list of entries, in definition order.
 *
 * This array is not modified.
 *
 * @param {number} index
 * The index of the entry to prune.
 *
 * @param {string} elementaryName
 * The name of the elementary feature to remove.
 *
 * @param {(entries: PredefEntry[]) => PredefEntry[]|undefined} validate
 * A function that validates a list of entries.
 *
 * It should return a copy of the list with the variants of each entry narrowed down if the entries
 * are valid for every cell, or `undefined` otherwise.
 *
 * @param {Map<*, Mask>} variantToMinMaskMap
 * A map from each variant to the mask of the features required for the variant to be available.
 *
 * @returns {PredefEntry[]|undefined}
 * The resulting list if the feature could be removed and the list is valid for every cell, or
 * `undefined` otherwise.
 */
function tryPrune(entries, index, elementaryName, validate, variantToMinMaskMap)
{
    const entry = entries[index];
    const elementaryNames =
    featureFromMask(entry.mask).elementaryNames.filter(name => name !== elementaryName);
    const { mask } = Feature(elementaryNames);
    // Removing a feature that is implied by the remaining ones does not change the mask.
    if (maskIncludes(mask, entry.mask))
        return;
    const variants =
    entry.values().filter(variant => maskIncludes(mask, variantToMinMaskMap.get(variant)));
    const prunedEntry = new PredefEntry(mask, variants);
    if (!prunedEntry.size)
        return;
    const trialEntries =
    entries.map
    ((currentEntry, currentIndex) => currentIndex === index ? prunedEntry : currentEntry);
    const prunedEntries = validate(trialEntries);
    return prunedEntries;
}

{
    const callback =
    predefName =>
    {
        const predefTestData = PREDEF_TEST_DATA_MAP_OBJ[predefName];
        if (!predefTestData)
            return `Unknown predefinitions ${predefName}.`;
        optimize(predefTestData);
    };
    const predefNames = Object.keys(PREDEF_TEST_DATA_MAP_OBJ);
    await choose(callback, 'Predefinitions to optimize', predefNames);
}
