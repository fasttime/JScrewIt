/* global Empty */

var getFigures;

(function ()
{
    'use strict';
    
    function createChain(figure, chainLength)
    {
        var chain = { figure: figure, chainLength: chainLength };
        return chain;
    }
    
    function growChain(chain)
    {
        var baseFigure = chain.figure;
        var baseChainLength = chain.chainLength;
        UNITS.forEach(
            function (unit)
            {
                var figure = baseFigure + unit.figure;
                if (!(figure in usedNameSet))
                {
                    usedNameSet[figure] = null;
                    var chainLength = baseChainLength + unit.chainLength;
                    var chain = createChain(figure, chainLength);
                    pushChain(chain);
                }
            }
        );
    }
    
    function pushChain(chain)
    {
        var chainLength = chain.chainLength;
        var chains = chainList[chainLength] || (chainList[chainLength] = []);
        chains.push(chain);
    }
    
    function useChain(chain)
    {
        var figure = chain.figure;
        figures.push(figure);
    }
    
    var MIN_CHAIN_LENGTH = 5;
    
    var UNITS =
    [
        createChain('true', 5),
        createChain('0', 6),
        createChain('undefined', 7),
        createChain('1', 8),
        createChain('NaN', 9),
        createChain('2', 12),
        createChain('f', 14),
        createChain('t', 15),
        createChain('a', 16),
        createChain('3', 17),
        createChain('N', 17),
        createChain('r', 17),
        createChain('u', 17),
        createChain('n', 19),
        createChain('l', 20),
        createChain('4', 22),
        createChain('d', 23),
        createChain('s', 25),
        createChain('e', 26),
        createChain('5', 27),
        createChain('i', 28),
        createChain('6', 32),
        createChain('7', 37),
        createChain('8', 42),
    ];
    
    var chainIndex = 0;
    var chainList = [[createChain('', 0)]];
    var figures = [''];
    var usedNameSet = new Empty();
    UNITS.forEach(
        function (unit)
        {
            usedNameSet[unit.figure] = null;
            pushChain(unit);
        }
    );
    
    getFigures =
        function (count)
        {
            while (figures.length < count)
            {
                var usedChains = chainList[chainIndex];
                if (usedChains)
                {
                    usedChains.forEach(growChain);
                    delete chainList[chainIndex];
                }
                var newChains = chainList[chainIndex + MIN_CHAIN_LENGTH];
                newChains.forEach(useChain);
                ++chainIndex;
            }
            var result = figures.slice(0, count);
            return result;
        };
}
)();
