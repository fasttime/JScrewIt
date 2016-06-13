/* eslint-env worker */
/* global JScrewIt */

importScripts('../lib/jscrewit.js');

var elementaryNames = JScrewIt.Feature.AUTO.elementaryNames;
postMessage(elementaryNames);
