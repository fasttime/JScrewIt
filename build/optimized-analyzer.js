'use strict';

const Analyzer = require('./analyzer');
const solutionBookMap = require('./solution-book-map');

function isSolutionApplicable({ masks }, analyzer, encoder)
{
    let applicable = false;
    for (const mask of masks)
    {
        // Must call hasFeatures with every mask of the provided solution, not stop on the first
        // match.
        if (encoder.hasFeatures(mask) && analyzer.doesNotExclude(mask))
            applicable = true;
    }
    return applicable;
}

module.exports =
class OptimizedAnalyzer extends Analyzer
{
    constructor()
    {
        super();
        this.usedCharSet = new Set();
    }

    missingCharacter()
    { }

    get nextEncoder()
    {
        const encoder = super.nextEncoder;
        if (encoder)
        {
            const { resolveCharacter } = encoder;
            encoder.resolveCharacter =
            char =>
            {
                this.usedCharSet.add(char);
                const solutionBook = solutionBookMap.get(char);
                if (solutionBook)
                {
                    let knownSolution = null;
                    let knownLength = Infinity;
                    let knownEntryIndex;
                    const { solutions } = solutionBook;
                    for (const solution of solutions)
                    {
                        const { entryIndex, length } = solution;
                        if
                        (
                            (
                                length < knownLength ||
                                length === knownLength && entryIndex <= knownEntryIndex
                            ) &&
                            isSolutionApplicable(solution, this, encoder)
                        )
                        {
                            if (length === knownLength && entryIndex === knownEntryIndex)
                                knownSolution = null;
                            else
                            {
                                knownSolution   = solution;
                                knownLength     = length;
                                knownEntryIndex = entryIndex;
                            }
                        }
                    }
                    if (!knownSolution)
                        knownSolution = resolveCharacter.call(encoder, char);
                    return knownSolution;
                }
                this.missingCharacter(char);
                const solution = resolveCharacter.call(encoder, char);
                return solution;
            };
        }
        return encoder;
    }
};
