/* eslint-env worker */
/* global JScrewIt */

importScripts('../lib/jscrewit.min.js');

self.onmessage =
function (evt)
{
    'use strict';

    var inData = evt.data;
    var outData = { taskId: inData.taskId };
    try
    {
        outData.output = JScrewIt.encode(inData.input, inData.options);
    }
    catch (error)
    {
        outData.error = error + '';
    }
    postMessage(outData);
};
