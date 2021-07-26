/* eslint-env worker */
/* global JScrewIt */

'use strict';

importScripts('../lib/jscrewit.js');

var elementaryNames = JScrewIt.Feature.AUTO.elementaryNames;
if (typeof postMessage === 'function')
    postMessage(elementaryNames);
else
{
    onconnect =
    function (event)
    {
        var port = event.ports[0];
        port.postMessage(elementaryNames);
    };
}
