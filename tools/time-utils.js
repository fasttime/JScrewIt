/* jshint node: true */

'use strict';

exports.formatDuration =
    function (duration)
    {
        var str = duration < 5 ? '< 0.01 s' : (duration / 1000).toFixed(2) + ' s';
        return str;
    };
