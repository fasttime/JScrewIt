'use strict';

const Analyzer = require('./analyzer');
const solutionBookMap = require('./solution-book-map');

function isSolutionApplicable({ masks }, analyzer, encoder)
{
    let applicable = false;
    for (const mask of masks)
    {
        // Must call hasFeatures with the mask of every solution with a viable length, not stop on
        // the first match.
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
                    let knownSolution;
                    let knownLength = Infinity;
                    const { solutions } = solutionBook;
                    for (const solution of solutions)
                    {
                        const { length } = solution;
                        if
                        (
                            length <= knownLength &&
                            isSolutionApplicable(solution, this, encoder)
                        )
                        {
                            if (length < knownLength)
                            {
                                knownSolution = solution;
                                knownLength = length;
                            }
                            else
                                knownSolution = null;
                        }
                    }
                    if (knownSolution == null)
                        throw new Error('No single determinate solution found.');
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
