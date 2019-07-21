/* eslint-env node */

'use strict';

require('expectations');
require('../tools/text-utils');
require('./helpers/feature-emulation.helpers');
require('./helpers/jscrewit-feature.helpers');
require('./helpers/matcher.helpers');
require('./helpers/maybe.helpers');
var postrequire = require('postrequire');

global.reloadJScrewIt =
function ()
{
    var newJScrewIt = postrequire('..');
    delete global.paths; // Not sure why global.paths is being defined in Node.js 0.10 and 0.12.
    return newJScrewIt;
};

var JScrewIt = require('..');
module.exports = JScrewIt;
