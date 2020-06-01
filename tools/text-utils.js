/* global global, self */

'use strict';

(function (global)
{
    function padLeft(str, length)
    {
        str = String(str);
        var result = repeat(' ', length - str.length) + str;
        return result;
    }

    function padRight(str, length)
    {
        str = String(str);
        var result = str + repeat(' ', length - str.length);
        return result;
    }

    function repeat(str, count)
    {
        var result = Array(count + 1).join(str);
        return result;
    }

    var exports = { padLeft: padLeft, padRight: padRight, repeat: repeat };

    Object.keys(exports).forEach
    (
        function (name)
        {
            global[name] = exports[name];
        }
    );
}
)(typeof self === 'undefined' ? global : /* c8 ignore next */ self);
