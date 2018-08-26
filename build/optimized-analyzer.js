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
    missingCharacter()
    { }

    get nextEncoder()
    {
        const encoder = super.nextEncoder;
        if (encoder)
        {
            const analyzer = this;
            const { resolveCharacter } = encoder;
            encoder.resolveCharacter =
            char =>
            {
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
                            isSolutionApplicable(solution, analyzer, encoder)
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
                analyzer.missingCharacter(char);
                const solution = resolveCharacter.call(encoder, char);
                return solution;
            };
        }
        return encoder;
    }
};
