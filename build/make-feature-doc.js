/* jshint node: true */

'use strict';

var JScrewIt = require('../lib/jscrewit.js');

function escape(str)
{
    var result = str.replace(/[&\(\)[\\\]]/g, function (char) { return '\\' + char; });
    return result;
}

function formatFeature(feature)
{
    var result = '<a href="#' + feature.toLowerCase() + '"><code>' + feature + '</code></a>';
    return result;
}

function formatFeatureMD(feature)
{
    var result = '[`' + feature + '`](#' + feature.toLowerCase() + ')';
    return result;
}

function getImpliers(feature, assignmentMap)
{
    var impliers = [];
    for (var mapFeature in assignmentMap)
    {
        if (
            feature !== mapFeature &&
            JScrewIt.commonFeaturesOf(feature, mapFeature).indexOf(feature) >= 0)
        {
            impliers.push(mapFeature);
        }
    }
    if (impliers.length)
    {
        return impliers.sort();
    }
}

function getVersioningFor(feature, list)
{
    var firstAvail, firstUnavail;
    for (var index = 0; index < list.length; ++index)
    {
        var listFeature = list[index].feature;
        if (JScrewIt.commonFeaturesOf(feature, listFeature).indexOf(feature) >= 0)
        {
            if (firstAvail == null)
            {
                firstAvail = index;
            }
        }
        else
        {
            if (firstUnavail == null)
            {
                firstUnavail = index;
            }
        }
    }
    if (firstAvail == null)
    {
        return false;
    }
    if (firstAvail > 0)
    {
        return list[firstAvail].description;
    }
    if (firstUnavail == null)
    {
        return true;
    }
    return 'not in ' + list[firstUnavail].description;
}

function printRow(label, assignmentMap)
{
    var result =
        '<tr>\n' +
        '<td>' + label + '</td>\n' +
        '<td>\n' +
        '<ul>\n';
    var features = Object.keys(assignmentMap).sort();
    for (var index = 0; index < features.length; ++index)
    {
        var feature = features[index];
        result += '<li>' + formatFeature(feature);
        var assigments = assignmentMap[feature];
        var versioning = assigments.versioning;
        var impliers = assigments.impliers;
        if (versioning || impliers)
        {
            result += ' (';
            if (impliers)
            {
                result += 'implied by ' + impliers.map(formatFeature).join(' and ');
                if (versioning)
                {
                    result += '; ';
                }
            }
            if (versioning)
            {
                result += versioning;
            }
            result += ')';
        }
        result += '\n';
    }
    result +=
        '</ul>\n' +
        '</td>\n' +
        '</tr>\n';
    return result;
}

var LISTS =
[
    [
        { description: 'Firefox 31+', feature: 'FF31' }
    ],
    [
        { description: 'Chrome 41+, Opera 28+', feature: 'CHROME41' }
    ],
    [
        { description: 'Internet Explorer 9+', feature: 'IE9' },
        { description: 'Internet Explorer 10+', feature: 'IE10' },
        { description: 'Internet Explorer 11', feature: 'IE11' }
    ],
    [
        { description: 'Safari 7.0+', feature: 'SAFARI70' },
        { description: 'Safari 7.1+', feature: 'SAFARI71' }
    ],
    [
        { description: 'Microsoft Edge', feature: 'EDGE' }
    ],
    [
        { description: 'Android Browser 4.0+', feature: 'ANDRO400' },
        { description: 'Android Browser 4.1.2+', feature: 'ANDRO412' },
        { description: 'Android Browser 4.4.2+', feature: 'ANDRO442' }
    ],
    [
        { description: 'Node.js 0.10.26+', feature: 'NODE010' },
        { description: 'Node.js 0.12+', feature: 'NODE012' }
    ]
];

module.exports =
    function ()
    {
        var FEATURE_INFOS = JScrewIt.FEATURE_INFOS;
        
        var content =
            '# JScrewIt Feature Reference\n' +
            '## Feature List\n' +
            'This section lists all features along with their descriptions.\n';
        Object.keys(FEATURE_INFOS).sort().forEach(
            function (feature)
            {
                var subContent;
                var name = FEATURE_INFOS[feature].name;
                if (name === feature)
                {
                    var description = FEATURE_INFOS[feature].description;
                    subContent = escape(description);
                }
                else
                {
                    subContent = '_An alias for ' + formatFeatureMD(name) + '._';
                }
                content += '### `' + feature + '`\n' + subContent + '\n';
            }
        );
        content +=
            '## Engine Support\n' +
            'This table lists features available in the most common engines.\n' +
            '<table>\n' +
            '<tr>\n' +
            '<th>Target</th>\n' +
            '<th>Features</th>\n' +
            '</tr>\n';
        LISTS.forEach(
            function (list)
            {
                var assignmentMap = Object.create(null);
                var feature;
                for (feature in FEATURE_INFOS)
                {
                    if (FEATURE_INFOS[feature].name === feature)
                    {
                        var versioning = getVersioningFor(feature, list);
                        if (versioning)
                        {
                            var assignments = { };
                            if (typeof versioning === 'string')
                            {
                                assignments.versioning = versioning;
                            }
                            assignmentMap[feature] = assignments;
                        }
                    }
                }
                for (feature in assignmentMap)
                {
                    var impliers = getImpliers(feature, assignmentMap);
                    if (impliers)
                    {
                        assignmentMap[feature].impliers = impliers;
                    }
                }
                content += printRow(list[0].description, assignmentMap);
            }
        );
        content += '</table>\n';
        return content;
    };
