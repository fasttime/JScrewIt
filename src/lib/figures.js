/* global Empty */

var getFigures;

(function ()
{
    'use strict';
    
    function createFigure(value, sortLength)
    {
        var figure = Object(value);
        figure.sortLength = sortLength;
        return figure;
    }
    
    function growFigure(figure)
    {
        var baseValue = figure.valueOf();
        var baseSortLength = figure.sortLength;
        UNITS.forEach(
            function (unit)
            {
                var value = baseValue + unit;
                if (!(value in usedNameSet))
                {
                    usedNameSet[value] = null;
                    var sortLength = baseSortLength + unit.sortLength;
                    var figure = createFigure(value, sortLength);
                    pushFigure(figure);
                }
            }
        );
    }
    
    function pushFigure(figure)
    {
        var sortLength = figure.sortLength;
        var figures = figureList[sortLength] || (figureList[sortLength] = []);
        figures.push(figure);
    }
    
    function useFigure(figure)
    {
        figures.push(figure);
    }
    
    var EMPTY_FIGURE = createFigure('', 0);
    
    var MIN_CHAIN_LENGTH = 5;
    
    var UNITS =
    [
        createFigure('true', 5),
        createFigure('0', 6),
        createFigure('undefined', 7),
        createFigure('1', 8),
        createFigure('NaN', 9),
        createFigure('2', 12),
        createFigure('f', 14),
        createFigure('t', 15),
        createFigure('a', 16),
        createFigure('3', 17),
        createFigure('N', 17),
        createFigure('r', 17),
        createFigure('u', 17),
        createFigure('n', 19),
        createFigure('l', 20),
        createFigure('4', 22),
        createFigure('d', 23),
        createFigure('s', 25),
        createFigure('e', 26),
        createFigure('5', 27),
        createFigure('i', 28),
        createFigure('6', 32),
        createFigure('7', 37),
        createFigure('8', 42),
    ];
    
    var figureIndex = 0;
    var figureList = [[EMPTY_FIGURE]];
    var figures = [EMPTY_FIGURE];
    var usedNameSet = new Empty();
    UNITS.forEach(
        function (unit)
        {
            usedNameSet[unit] = null;
            pushFigure(unit);
        }
    );
    
    getFigures =
        function (count)
        {
            while (figures.length < count)
            {
                var usedFigures = figureList[figureIndex];
                if (usedFigures)
                {
                    usedFigures.forEach(growFigure);
                    delete figureList[figureIndex];
                }
                var newFigures = figureList[figureIndex + MIN_CHAIN_LENGTH];
                newFigures.forEach(useFigure);
                ++figureIndex;
            }
            var result = figures.slice(0, count);
            return result;
        };
}
)();
