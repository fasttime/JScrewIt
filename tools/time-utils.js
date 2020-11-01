/* eslint-env node */
/* global Promise */

'use strict';

exports.formatDuration =
function (duration)
{
    var str = duration < 5e-3 ? '< 0.01 s' : duration.toFixed(2) + ' s';
    return str;
};

exports.timeThis =
function (fn)
{
    var begin = process.hrtime();
    fn();
    var time = process.hrtime(begin);
    var duration = time[0] + time[1] / 1e9;
    return duration;
};

exports.timeThisAsync =
function (fn)
{
    var begin = process.hrtime();
    var executor =
    function (resolve, reject)
    {
        fn()
        .then
        (
            function ()
            {
                var time = process.hrtime(begin);
                var duration = time[0] + time[1] / 1e9;
                resolve(duration);
            }
        )
        .catch(reject);
    };
    var promise = new Promise(executor);
    return promise;
};
