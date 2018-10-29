/* eslint-env worker */
/* global JScrewIt */

self.onmessage =
function (evt)
{
    'use strict';

    var inData = evt.data;
    var url = inData.url;
    if (url != null)
    {
        importScripts(url);
        URL.revokeObjectURL(url);
    }
    var input = inData.input;
    if (input != null)
    {
        var outData = { };
        try
        {
            outData.output = JScrewIt.encode(input, inData.options);
        }
        catch (error)
        {
            outData.error = error + '';
        }
        postMessage(outData);
    }
};
