/* eslint-env node */

'use strict';

exports.formatDuration =
    function (duration)
    {
        var str = duration < 5e-3 ? '< 0.01 s' : duration.toFixed(2) + ' s';
        return str;
    };

var timeThis;
var process;
try
{
    process = require('process');
}
catch (error)
{ }

if (process)
{
    timeThis =
        function (callback)
        {
            var begin = process.hrtime();
            callback();
            var time = process.hrtime(begin);
            var duration = time[0] + time[1] / 1e9;
            return duration;
        };
}
else
{
    timeThis =
        function (callback)
        {
            var begin = new Date();
            callback();
            var duration = (new Date() - begin) / 1000;
            return duration;
        };
}

exports.timeThis = timeThis;
