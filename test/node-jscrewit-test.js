/* eslint-env node */

'use strict';

require('expectations');
require('./helpers/feature-emulation.helpers');
require('./helpers/jscrewit-feature.helpers');
require('./helpers/matcher.helpers');
require('./helpers/text.helpers');
var postrequire = require('postrequire');

global.reloadJScrewIt =
function (stubs)
{
    var newJScrewIt = postrequire('#jscrewit', stubs);
    return newJScrewIt;
};

var JScrewIt = require('#jscrewit');
module.exports = JScrewIt;
