/* eslint-env worker */
/* global JScrewIt */

importScripts('../lib/jscrewit.min.js');

self.onmessage =
    function (evt)
    {
        'use strict';
        
        var inData = evt.data;
        var input = inData.input;
        var options = inData.options;
        
        var outData = { };
        try
        {
            outData.output = JScrewIt.encode(input, options);
        }
        catch (error)
        {
            outData.error = error + '';
        }
        postMessage(outData);
    };
