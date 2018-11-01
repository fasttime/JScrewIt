/* eslint-env worker */
/* global JScrewIt */

'use strict';

self.onmessage =
function (evt)
{
    var inData = evt.data;
    var url = inData.url;
    if (url != null)
        importScripts(url);
    var input = inData.input;
    if (input != null)
    {
        var outData;
        try
        {
            var output = JScrewIt.encode(input, inData.options);
            outData = { output: output };
        }
        catch (error)
        {
            var errorStr = String(error);
            outData = { error: errorStr };
        }
        postMessage(outData);
    }
};
