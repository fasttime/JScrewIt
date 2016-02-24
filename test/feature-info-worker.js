/* global JScrewIt */
/* jshint worker: true */

importScripts('../lib/jscrewit.js');

var elementaryNames = JScrewIt.Feature.AUTO.elementaryNames;
postMessage(elementaryNames);
