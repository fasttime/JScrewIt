/* global Empty, array_prototype_push */

function createFigurator(protoFigures)
{
    function createFigure(value, sortLength)
    {
        var figure = Object(value);
        figure.sortLength = sortLength;
        return figure;
    }
    
    function figurator(index)
    {
        while (figures.length <= index)
        {
            parts.forEach(growFigures);
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
                    pushFigure(newValue, currentSortLength);
                }
            );
        }
    }
    
    function pushFigure(value, sortLength)
    {
        if (!(value in usedValueSet))
        {
            usedValueSet[value] = null;
            var figures = figureList[sortLength] || (figureList[sortLength] = []);
            var figure = createFigure(value, sortLength);
            figures.push(figure);
        }
    }
    
    var currentSortLength = 0;
    var figureList = [];
    var figures = [];
    var parts =
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
        createFigure('9', 47),
    ];
    var usedValueSet = new Empty();
    
    protoFigures.forEach(
        function (protoFigure)
        {
            pushFigure(protoFigure.value, protoFigure.sortLength);
        }
    );
    parts =
        parts.filter(
            function (part)
            {
                var result = !(part in usedValueSet);
                return result;
            }
        );
    return figurator;
}
