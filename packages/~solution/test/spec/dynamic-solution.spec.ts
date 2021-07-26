import { evalExpr }                             from '../../src/eval';
import { DynamicSolution, SimpleSolution }      from '../../src/solution';
import { SolutionType, calculateSolutionType }  from '../../src/solution-type';
import assert                                   from 'assert';
import type { ParamCollection }                 from 'ebdd';

type SolutionInfo = [string, string, SolutionType];

type SubSolution = [source: string, replacement: string, type: SolutionType];

interface MixedSolutionTestInfo
{
    readonly subSolutions:          readonly SubSolution[];
    readonly expectedReplacement:   string;
    readonly expectedType:          SolutionType;
}

const MIXED_SOLUTION_TEST_INFOS: ParamCollection<MixedSolutionTestInfo> =
[
    // No solutions
    {
        subSolutions: [],
        expectedType: SolutionType.OBJECT,
        expectedReplacement: '[]',
    },

    // Single solutions
    {
        subSolutions: [['undefined', '[][[]]', SolutionType.UNDEFINED]],
        expectedType: SolutionType.UNDEFINED,
        expectedReplacement: '[][[]]',
    },
    {
        subSolutions: [['true', '!![]', SolutionType.ALGEBRAIC]],
        expectedType: SolutionType.ALGEBRAIC,
        expectedReplacement: '!![]',
    },
    {
        subSolutions: [['1', '+!![]', SolutionType.WEAK_ALGEBRAIC]],
        expectedType: SolutionType.WEAK_ALGEBRAIC,
        expectedReplacement: '+!![]',
    },
    {
        subSolutions: [['', '[]', SolutionType.OBJECT]],
        expectedType: SolutionType.OBJECT,
        expectedReplacement: '[]',
    },
    {
        subSolutions: [['f', '([]+![])[+[]]', SolutionType.STRING]],
        expectedType: SolutionType.STRING,
        expectedReplacement: '([]+![])[+[]]',
    },
    {
        subSolutions: [['false0', '![]+[+[]]', SolutionType.PREFIXED_STRING]],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '![]+[+[]]',
    },
    {
        subSolutions: [['00', '+[]+[+[]]', SolutionType.WEAK_PREFIXED_STRING]],
        expectedType: SolutionType.WEAK_PREFIXED_STRING,
        expectedReplacement: '+[]+[+[]]',
    },
    {
        subSolutions: [['0false', '[+[]]+![]', SolutionType.COMBINED_STRING]],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[+[]]+![]',
    },

    // UNDEFINED + UNDEFINED
    {
        subSolutions:
        [
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[]+[][[]]+[][[]]+[][[]]',
    },
    {
        subSolutions:
        [
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['false', '![]', SolutionType.ALGEBRAIC],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[]+[][[]]+[][[]]+![]',
    },
    {
        subSolutions:
        [
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['0', '+[]', SolutionType.WEAK_ALGEBRAIC],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '[][[]]+([][[]]+[+[]])',
    },
    {
        subSolutions:
        [
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['true', '[!![]]', SolutionType.OBJECT],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '[][[]]+([][[]]+[!![]])',
    },
    {
        subSolutions:
        [
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['f', '([]+![])[+[]]', SolutionType.STRING],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '[][[]]+([][[]]+([]+![])[+[]])',
    },
    {
        subSolutions:
        [
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['undefined0', '[][[]]+[+[]]', SolutionType.PREFIXED_STRING],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[]+[][[]]+[][[]]+[][[]]+[+[]]',
    },
    {
        subSolutions:
        [
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['00', '+[]+[+[]]', SolutionType.WEAK_PREFIXED_STRING],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '[][[]]+([][[]]+(+[]+[+[]]))',
    },
    {
        subSolutions:
        [
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['f0', '([]+![])[+[]]+(+[])', SolutionType.COMBINED_STRING],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '[][[]]+([][[]]+([]+![])[+[]]+(+[]))',
    },

    // UNDEFINED
    {
        subSolutions:
        [
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[]+[][[]]+[][[]]',
    },
    {
        subSolutions:
        [
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['true', '!![]', SolutionType.ALGEBRAIC],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '[][[]]+[!![]]',
    },
    {
        subSolutions:
        [
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['2', '!![]+!![]', SolutionType.WEAK_ALGEBRAIC],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '[][[]]+[!![]+!![]]',
    },
    {
        subSolutions:
        [
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['1', '[+!![]]', SolutionType.OBJECT],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '[][[]]+[+!![]]',
    },
    {
        subSolutions:
        [
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['t', '([]+!![])[+[]]', SolutionType.STRING],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '[][[]]+([]+!![])[+[]]',
    },
    {
        subSolutions:
        [
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['true0', '!![]+[+[]]', SolutionType.PREFIXED_STRING],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '[][[]]+(!![]+[+[]])',
    },
    {
        subSolutions:
        [
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['10', '+!![]+[+[]]', SolutionType.WEAK_PREFIXED_STRING],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '[][[]]+(+!![]+[+[]])',
    },
    {
        subSolutions:
        [
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
            ['tfalse', '([]+!![])[+[]]+![]', SolutionType.COMBINED_STRING],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '[][[]]+([]+!![])[+[]]+![]',
    },

    // ALGEBRAIC
    {
        subSolutions:
        [
            ['true', '!![]', SolutionType.ALGEBRAIC],
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[!![]]+[][[]]',
    },
    {
        subSolutions:
        [
            ['false', '![]', SolutionType.ALGEBRAIC],
            ['true', '!![]', SolutionType.ALGEBRAIC],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[![]]+!![]',
    },
    {
        subSolutions:
        [
            ['0', '[+[]][+[]]', SolutionType.ALGEBRAIC],
            ['0', '+[]', SolutionType.WEAK_ALGEBRAIC],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '[+[]][+[]]+[+[]]',
    },
    {
        subSolutions:
        [
            ['false', '![]', SolutionType.ALGEBRAIC],
            ['0', '[+[]]', SolutionType.OBJECT],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '![]+[+[]]',
    },
    {
        subSolutions:
        [
            ['false', '![]', SolutionType.ALGEBRAIC],
            ['a', '([]+![])[+!![]]', SolutionType.STRING],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '![]+([]+![])[+!![]]',
    },
    {
        subSolutions:
        [
            ['false', '![]', SolutionType.ALGEBRAIC],
            ['falsefalse', '![]+[![]]', SolutionType.PREFIXED_STRING],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[![]]+![]+[![]]',
    },
    {
        subSolutions:
        [
            ['false', '![]', SolutionType.ALGEBRAIC],
            ['00', '+[]+[+[]]', SolutionType.WEAK_PREFIXED_STRING],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '![]+(+[]+[+[]])',
    },
    {
        subSolutions:
        [
            ['false', '![]', SolutionType.ALGEBRAIC],
            ['aa', '([]+![])[+!![]]+([]+![])[+!![]]', SolutionType.COMBINED_STRING],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '![]+([]+![])[+!![]]+([]+![])[+!![]]',
    },

    // WEAK_ALGEBRAIC
    {
        subSolutions:
        [
            ['0', '+[]', SolutionType.WEAK_ALGEBRAIC],
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[+[]]+[][[]]',
    },
    {
        subSolutions:
        [
            ['0', '+[]', SolutionType.WEAK_ALGEBRAIC],
            ['true', '!![]', SolutionType.ALGEBRAIC],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[+[]]+!![]',
    },
    {
        subSolutions:
        [
            ['1', '+!![]', SolutionType.WEAK_ALGEBRAIC],
            ['0', '+[]', SolutionType.WEAK_ALGEBRAIC],
        ],
        expectedType: SolutionType.WEAK_PREFIXED_STRING,
        expectedReplacement: '+!![]+[+[]]',
    },
    {
        subSolutions:
        [
            ['1', '+!![]', SolutionType.WEAK_ALGEBRAIC],
            ['0', '[+[]]', SolutionType.OBJECT],
        ],
        expectedType: SolutionType.WEAK_PREFIXED_STRING,
        expectedReplacement: '+!![]+[+[]]',
    },
    {
        subSolutions:
        [
            ['1', '+!![]', SolutionType.WEAK_ALGEBRAIC],
            ['f', '([]+![])[+[]]', SolutionType.STRING],
        ],
        expectedType: SolutionType.WEAK_PREFIXED_STRING,
        expectedReplacement: '+!![]+([]+![])[+[]]',
    },
    {
        subSolutions:
        [
            ['1', '+!![]', SolutionType.WEAK_ALGEBRAIC],
            ['false', '![]+[]', SolutionType.PREFIXED_STRING],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[+!![]]+![]+[]',
    },
    {
        subSolutions:
        [
            ['1', '+!![]', SolutionType.WEAK_ALGEBRAIC],
            ['00', '+[]+[+[]]', SolutionType.WEAK_PREFIXED_STRING],
        ],
        expectedType: SolutionType.WEAK_PREFIXED_STRING,
        expectedReplacement: '+!![]+(+[]+[+[]])',
    },
    {
        subSolutions:
        [
            ['1', '+!![]', SolutionType.WEAK_ALGEBRAIC],
            ['falsefalse', '[![]]+![]', SolutionType.COMBINED_STRING],
        ],
        expectedType: SolutionType.WEAK_PREFIXED_STRING,
        expectedReplacement: '+!![]+[![]]+![]',
    },

    // OBJECT
    {
        subSolutions:
        [
            ['1', '[+!![]]', SolutionType.OBJECT],
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[+!![]]+[][[]]',
    },
    {
        subSolutions:
        [
            ['false', '[![]]', SolutionType.OBJECT],
            ['false', '![]', SolutionType.ALGEBRAIC],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[![]]+![]',
    },
    {
        subSolutions:
        [
            ['false', '[![]]', SolutionType.OBJECT],
            ['2', '!![]+!![]', SolutionType.WEAK_ALGEBRAIC],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[![]]+(!![]+!![])',
    },
    {
        subSolutions:
        [
            ['false', '[![]]', SolutionType.OBJECT],
            ['true', '[!![]]', SolutionType.OBJECT],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[![]]+[!![]]',
    },
    {
        subSolutions:
        [
            ['0', '[+[]]', SolutionType.OBJECT],
            ['t', '(!![]+[])[+[]]', SolutionType.STRING],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[+[]]+(!![]+[])[+[]]',
    },
    {
        subSolutions:
        [
            ['0', '[+[]]', SolutionType.OBJECT],
            ['truefalse', '!![]+[![]]', SolutionType.PREFIXED_STRING],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[+[]]+!![]+[![]]',
    },
    {
        subSolutions:
        [
            ['0', '[+[]]', SolutionType.OBJECT],
            ['12', '+!![]+[!![]+!![]]', SolutionType.WEAK_PREFIXED_STRING],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[+[]]+(+!![]+[!![]+!![]])',
    },
    {
        subSolutions:
        [
            ['0', '[+[]]', SolutionType.OBJECT],
            ['12', '[+!![]]+(!![]+!![])', SolutionType.COMBINED_STRING],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[+[]]+[+!![]]+(!![]+!![])',
    },

    // STRING
    {
        subSolutions:
        [
            ['a', '(![]+[])[+!![]]', SolutionType.STRING],
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '(![]+[])[+!![]]+[][[]]',
    },
    {
        subSolutions:
        [
            ['a', '(![]+[])[+!![]]', SolutionType.STRING],
            ['0', '[[]][+[]]++', SolutionType.ALGEBRAIC],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '(![]+[])[+!![]]+[[]][+[]]++',
    },
    {
        subSolutions:
        [
            ['a', '(![]+[])[+!![]]', SolutionType.STRING],
            ['0', '+[]', SolutionType.WEAK_ALGEBRAIC],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '(![]+[])[+!![]]+(+[])',
    },
    {
        subSolutions:
        [
            ['a', '(![]+[])[+!![]]', SolutionType.STRING],
            ['0', '[+[]]', SolutionType.OBJECT],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '(![]+[])[+!![]]+[+[]]',
    },
    {
        subSolutions:
        [
            ['a', '(![]+[])[+!![]]', SolutionType.STRING],
            ['f', '(![]+[])[+[]]', SolutionType.STRING],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '(![]+[])[+!![]]+(![]+[])[+[]]',
    },
    {
        subSolutions:
        [
            ['a', '(![]+[])[+!![]]', SolutionType.STRING],
            ['false0', '![]+[+[]]', SolutionType.PREFIXED_STRING],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '(![]+[])[+!![]]+![]+[+[]]',
    },
    {
        subSolutions:
        [
            ['a', '(![]+[])[+!![]]', SolutionType.STRING],
            ['10', '+!![]+[+[]]', SolutionType.WEAK_PREFIXED_STRING],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '(![]+[])[+!![]]+(+!![]+[+[]])',
    },
    {
        subSolutions:
        [
            ['a', '(![]+[])[+!![]]', SolutionType.STRING],
            ['ff', '(![]+[])[+[]]+(![]+[])[+[]]', SolutionType.COMBINED_STRING],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '(![]+[])[+!![]]+(![]+[])[+[]]+(![]+[])[+[]]',
    },

    // PREFIXED_STRING
    {
        subSolutions:
        [
            ['true0', '!![]+[+[]]', SolutionType.PREFIXED_STRING],
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '!![]+[+[]]+[][[]]',
    },
    {
        subSolutions:
        [
            ['true0', '!![]+[+[]]', SolutionType.PREFIXED_STRING],
            ['true', '!![]', SolutionType.ALGEBRAIC],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '!![]+[+[]]+!![]',
    },
    {
        subSolutions:
        [
            ['true0', '!![]+[+[]]', SolutionType.PREFIXED_STRING],
            ['0', '+[]', SolutionType.WEAK_ALGEBRAIC],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '!![]+[+[]]+(+[])',
    },
    {
        subSolutions:
        [
            ['true0', '!![]+[+[]]', SolutionType.PREFIXED_STRING],
            ['', '[]', SolutionType.OBJECT],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '!![]+[+[]]+[]',
    },
    {
        subSolutions:
        [
            ['true0', '!![]+[+[]]', SolutionType.PREFIXED_STRING],
            ['', '[[]+[]][+[]]', SolutionType.STRING],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '!![]+[+[]]+[[]+[]][+[]]',
    },
    {
        subSolutions:
        [
            ['true0', '!![]+[+[]]', SolutionType.PREFIXED_STRING],
            ['false0', '![]+[+[]]', SolutionType.PREFIXED_STRING],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '!![]+[+[]]+![]+[+[]]',
    },
    {
        subSolutions:
        [
            ['true0', '!![]+[+[]]', SolutionType.PREFIXED_STRING],
            ['0false', '+[]+[![]]', SolutionType.WEAK_PREFIXED_STRING],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '!![]+[+[]]+(+[]+[![]])',
    },
    {
        subSolutions:
        [
            ['true0', '!![]+[+[]]', SolutionType.PREFIXED_STRING],
            ['', '[]+[]', SolutionType.COMBINED_STRING],
        ],
        expectedType: SolutionType.PREFIXED_STRING,
        expectedReplacement: '!![]+[+[]]+[]+[]',
    },

    // WEAK_PREFIXED_STRING
    {
        subSolutions:
        [
            ['00', '+[]+[+[]]', SolutionType.WEAK_PREFIXED_STRING],
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
        ],
        expectedType: SolutionType.WEAK_PREFIXED_STRING,
        expectedReplacement: '+[]+[+[]]+[][[]]',
    },
    {
        subSolutions:
        [
            ['00', '+[]+[+[]]', SolutionType.WEAK_PREFIXED_STRING],
            ['false', '![]', SolutionType.ALGEBRAIC],
        ],
        expectedType: SolutionType.WEAK_PREFIXED_STRING,
        expectedReplacement: '+[]+[+[]]+![]',
    },
    {
        subSolutions:
        [
            ['00', '+[]+[+[]]', SolutionType.WEAK_PREFIXED_STRING],
            ['0', '+[]', SolutionType.WEAK_ALGEBRAIC],
        ],
        expectedType: SolutionType.WEAK_PREFIXED_STRING,
        expectedReplacement: '+[]+[+[]]+(+[])',
    },
    {
        subSolutions:
        [
            ['00', '+[]+[+[]]', SolutionType.WEAK_PREFIXED_STRING],
            ['0', '[+[]]', SolutionType.OBJECT],
        ],
        expectedType: SolutionType.WEAK_PREFIXED_STRING,
        expectedReplacement: '+[]+[+[]]+[+[]]',
    },
    {
        subSolutions:
        [
            ['00', '+[]+[+[]]', SolutionType.WEAK_PREFIXED_STRING],
            ['f', '(![]+[])[+[]]', SolutionType.STRING],
        ],
        expectedType: SolutionType.WEAK_PREFIXED_STRING,
        expectedReplacement: '+[]+[+[]]+(![]+[])[+[]]',
    },
    {
        subSolutions:
        [
            ['00', '+[]+[+[]]', SolutionType.WEAK_PREFIXED_STRING],
            ['undefined0', '[][[]]+[+[]]', SolutionType.PREFIXED_STRING],
        ],
        expectedType: SolutionType.WEAK_PREFIXED_STRING,
        expectedReplacement: '+[]+[+[]]+[][[]]+[+[]]',
    },
    {
        subSolutions:
        [
            ['00', '+[]+[+[]]', SolutionType.WEAK_PREFIXED_STRING],
            ['10', '+!![]+[+[]]', SolutionType.WEAK_PREFIXED_STRING],
        ],
        expectedType: SolutionType.WEAK_PREFIXED_STRING,
        expectedReplacement: '+[]+[+[]]+(+!![]+[+[]])',
    },
    {
        subSolutions:
        [
            ['00', '+[]+[+[]]', SolutionType.WEAK_PREFIXED_STRING],
            ['00', '[+[]]+(+[])', SolutionType.COMBINED_STRING],
        ],
        expectedType: SolutionType.WEAK_PREFIXED_STRING,
        expectedReplacement: '+[]+[+[]]+[+[]]+(+[])',
    },

    // COMBINED_STRING
    {
        subSolutions:
        [
            ['0false', '[+[]]+![]', SolutionType.COMBINED_STRING],
            ['undefined', '[][[]]', SolutionType.UNDEFINED],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[+[]]+![]+[][[]]',
    },
    {
        subSolutions:
        [
            ['0false', '[+[]]+![]', SolutionType.COMBINED_STRING],
            ['false', '![]', SolutionType.ALGEBRAIC],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[+[]]+![]+![]',
    },
    {
        subSolutions:
        [
            ['0false', '[+[]]+![]', SolutionType.COMBINED_STRING],
            ['0', '+[]', SolutionType.WEAK_ALGEBRAIC],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[+[]]+![]+(+[])',
    },
    {
        subSolutions:
        [
            ['1true', '[+!![]]+!![]', SolutionType.COMBINED_STRING],
            ['0', '[+[]]', SolutionType.OBJECT],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[+!![]]+!![]+[+[]]',
    },
    {
        subSolutions:
        [
            ['', '[]+[]', SolutionType.COMBINED_STRING],
            ['f', '(![]+[])[+[]]', SolutionType.STRING],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[]+[]+(![]+[])[+[]]',
    },
    {
        subSolutions:
        [
            ['0undefined', '[+[]]+[][[]]', SolutionType.COMBINED_STRING],
            ['undefined0', '[][[]]+[+[]]', SolutionType.PREFIXED_STRING],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[+[]]+[][[]]+[][[]]+[+[]]',
    },
    {
        subSolutions:
        [
            ['0undefined', '[+[]]+[][[]]', SolutionType.COMBINED_STRING],
            ['10', '+!![]+[+[]]', SolutionType.WEAK_PREFIXED_STRING],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[+[]]+[][[]]+(+!![]+[+[]])',
    },
    {
        subSolutions:
        [
            ['00', '[+[]]+(+[])', SolutionType.COMBINED_STRING],
            ['00', '[+[]]+(+[])', SolutionType.COMBINED_STRING],
        ],
        expectedType: SolutionType.COMBINED_STRING,
        expectedReplacement: '[+[]]+(+[])+[+[]]+(+[])',
    },
];

describe
(
    'DynamicSolution',
    () =>
    {
        it
        (
            'when containing multiple solutions',
            () =>
            {
                const solution = new DynamicSolution();
                ['+![]', '+!![]', '!![]+!![]'].forEach
                (
                    (expr: string, index: number) =>
                    {
                        solution.append
                        (new SimpleSolution(String(index), expr, SolutionType.WEAK_ALGEBRAIC));
                    },
                );
                ['([]+!![])[+[]]', '([]+![])[+!![]]', '([]+![])[+[]]'].forEach
                (
                    (expr: string, index: number) =>
                    {
                        solution.prepend
                        (new SimpleSolution('taf'[index], expr, SolutionType.STRING));
                    },
                );
                const expectedReplacement =
                '([]+![])[+[]]+([]+![])[+!![]]+([]+!![])[+[]]+(+![])+(+!![])+(!![]+!![])';

                assert.strictEqual(solution.length, expectedReplacement.length);
                assert.strictEqual(solution.replacement, expectedReplacement);
                assert.strictEqual(solution.source, 'fat012');
                assert.strictEqual(solution.type, SolutionType.COMBINED_STRING);
            },
        );

        describe
        (
            'source',
            () =>
            {
                it
                (
                    'is a string when all contained solutions have a source',
                    () =>
                    {
                        const solution = new DynamicSolution();
                        solution
                        .append(new SimpleSolution('0', '+[]', SolutionType.WEAK_ALGEBRAIC));
                        solution.append(new SimpleSolution('', '[]', SolutionType.OBJECT));
                        assert.strictEqual(solution.source, '0');
                    },
                );

                it
                (
                    'is undefined when not all contained solutions have a source',
                    () =>
                    {
                        const solution = new DynamicSolution();
                        solution
                        .append(new SimpleSolution('0', '+[]', SolutionType.WEAK_ALGEBRAIC));
                        solution.append(new SimpleSolution(undefined, '[]', SolutionType.OBJECT));
                        assert.strictEqual(solution.source, undefined);
                    },
                );
            },
        );

        describe
        (
            'when containing mixed solutions',
            () =>
            {
                it.per
                (
                    MIXED_SOLUTION_TEST_INFOS,
                    (info: MixedSolutionTestInfo) =>
                    {
                        const title =
                        info
                        .subSolutions
                        .map(([,, type]: SolutionInfo) => SolutionType[type])
                        .join(' + ') ||
                        '(none)';
                        const returnValue = { ...info, title };
                        return returnValue;
                    },
                )
                (
                    '#.title',
                    ({ subSolutions, expectedReplacement, expectedType }: MixedSolutionTestInfo) =>
                    {
                        const solution = new DynamicSolution();
                        for (const [source, replacement, type] of subSolutions)
                        {
                            assert.strictEqual(calculateSolutionType(replacement), type);
                            solution.append(new SimpleSolution(source, replacement, type));
                        }

                        assert.strictEqual(solution.length, expectedReplacement.length);
                        assert.strictEqual(solution.replacement, expectedReplacement);
                        assert.strictEqual(solution.source, String(evalExpr(expectedReplacement)));
                        assert.strictEqual(solution.type, expectedType);
                        assert.strictEqual
                        (calculateSolutionType(solution.replacement), expectedType);
                    },
                );
            },
        );
    },
);
