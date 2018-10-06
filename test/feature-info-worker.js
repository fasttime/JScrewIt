/* eslint-env worker */
/* global JScrewIt */

'use strict';

importScripts('../lib/jscrewit.js');

var elementaryNames = JScrewIt.Feature.AUTO.elementaryNames;
postMessage(elementaryNames);
