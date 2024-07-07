import Analyzer         from './analyzer.js';
import SolutionBookMap  from './solution-book-map.mjs';

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

export default class OptimizedAnalyzer extends Analyzer
{
    constructor(ancestorFeatureObj, useReverseIteration = false)
    {
        super(ancestorFeatureObj);
        this.usedCharSet = new Set();
        this.useReverseIteration = useReverseIteration;
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
                const solutionBook = SolutionBookMap.get(char);
                if (solutionBook)
                {
                    let knownSolution = null;
                    let { solutions } = solutionBook;
                    if (this.useReverseIteration)
                        solutions = [...solutions].reverse();
                    for (const solution of solutions)
                    {
                        const comparison =
                        knownSolution ?
                        SolutionBookMap.compareSolutions(solution, knownSolution) : -1;
                        if (comparison <= 0 && isSolutionApplicable(solution, this, encoder))
                        {
                            if (comparison === 0)
                                knownSolution = null;
                            else
                                knownSolution = solution;
                        }
                    }
                    knownSolution ||= resolveCharacter.call(encoder, char);
                    return knownSolution;
                }
                this.missingCharacter(char);
                const solution = resolveCharacter.call(encoder, char);
                return solution;
            };
        }
        return encoder;
    }
}
