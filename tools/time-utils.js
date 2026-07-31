'use strict';

const hrtimeBigint = process.hrtime.bigint;

exports.formatDuration =
function (duration)
{
    const str = duration < 5e-3 ? '< 0.01 s' : `${duration.toFixed(2)} s`;
    return str;
};

exports.timeThis =
function (fn)
{
    const begin = hrtimeBigint();
    fn();
    const end = hrtimeBigint();
    const duration = Number(end - begin) / 1e9;
    return duration;
};

exports.timeThisAsync =
async function (fn)
{
    const begin = hrtimeBigint();
    await fn();
    const end = hrtimeBigint();
    const duration = Number(end - begin) / 1e9;
    return duration;
};
