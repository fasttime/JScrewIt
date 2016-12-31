/* global Empty, array_prototype_push */

function createFigurator(startValues, joiner)
{
    function createFigure(value, sortLength)
    {
        var figure = Object(value);
        figure.sortLength = sortLength;
        return figure;
    }
    
    function createPart(value, sortLength, isJoiner)
    {
        var part = createFigure(value, sortLength);
        part.isJoiner = isJoiner;
        return part;
    }
    
    function figurator(index)
    {
        while (figures.length <= index)
        {
            appendableParts.forEach(growFigures);
            var newFigures = figureList[currentSortLength++];
            if (newFigures)
                array_prototype_push.apply(figures, newFigures);
        }
        var figure = figures[index];
        return figure;
    }
    
    function growFigures(part)
    {
        var oldFigureSortLength = currentSortLength - part.sortLength;
        var oldFigures = figureList[oldFigureSortLength];
        if (oldFigures)
        {
            oldFigures.forEach(
                function (oldFigure)
                {
                    var newValue = oldFigure + part;
                    pushFigure(newValue, currentSortLength, part);
                }
            );
        }
    }
    
    function pushFigure(value, sortLength, part)
    {
        if (!(value in usedValueSet))
        {
            usedValueSet[value] = null;
            var figures = figureList[sortLength] || (figureList[sortLength] = []);
            var figure = createFigure(value, sortLength);
            figures.push(figure);
            part.isJoiner = false;
            for (; ; ++joinerIndex)
            {
                var joinerPart = PARTS[joinerIndex];
                if (!joinerPart)
                    break;
                if (joinerPart.isJoiner)
                {
                    figure.joiner = joinerPart.valueOf();
                    break;
                }
            }
        }
    }
    
    var PARTS =
    [
        createPart('',          0,  false),
        createPart('false',     4,  true),
        createPart('true',      5,  true),
        createPart('0',         6,  true),
        createPart('undefined', 7,  true),
        createPart('1',         8,  true),
        createPart('NaN',       9,  true),
        createPart('2',         12, true),
        createPart('f',         14, false),
        createPart('t',         15, false),
        createPart('a',         16, false),
        createPart('3',         17, true),
        createPart('N',         17, false),
        createPart('r',         17, false),
        createPart('u',         17, false),
        createPart('n',         19, false),
        createPart('l',         20, false),
        createPart('4',         22, true),
        createPart('d',         23, false),
        createPart('s',         25, false),
        createPart('e',         26, false),
        createPart('5',         27, true),
        createPart('i',         28, false),
        createPart('6',         32, true),
        createPart('7',         37, true),
        createPart('8',         42, true),
        createPart('9',         47, true),
    ];
    
    var currentSortLength = 0;
    var figureList = [];
    var figures = [];
    var joinerIndex = 0;
    var usedValueSet = new Empty();
    var appendableParts =
        PARTS.filter(
            function (part)
            {
                var value = part.valueOf();
                if (startValues.indexOf(value) >= 0)
                    pushFigure(value, part.sortLength, part);
                else if (value !== joiner)
                    return true;
            }
        );
    
    return figurator;
}
