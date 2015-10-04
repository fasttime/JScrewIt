/* jshint node: true */

'use strict';

var JScrewIt = require('../lib/jscrewit.js');

function escape(str)
{
    var result =
        str.replace(
            /[&\(\)[\\\]]/g,
            function (char)
            {
                return '\\' + char;
            }
        );
    return result;
}

function formatFeatureName(featureName)
{
    var result =
        '<a href="#' + getAnchorName(featureName) + '"><code>' + featureName + '</code></a>';
    return result;
}

function formatFeatureNameMD(featureName)
{
    var result = '[`' + featureName + '`](#' + getAnchorName(featureName) + ')';
    return result;
}

function getAnchorName(featureName)
{
    return featureName;
}

function getImpliers(featureName, assignmentMap)
{
    var impliers = [];
    for (var otherFeatureName in assignmentMap)
    {
        if (
            featureName !== otherFeatureName &&
            JScrewIt.Feature[otherFeatureName].includes(featureName))
        {
            impliers.push(otherFeatureName);
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
        var otherFeatureName = list[index].feature;
        if (JScrewIt.Feature[otherFeatureName].includes(feature))
        {
            if (firstAvail == null)
            {
                firstAvail = index;
            }
        }
        else
        {
            if (firstAvail != null && firstUnavail == null)
            {
                firstUnavail = index;
            }
        }
    }
    if (firstAvail != null)
    {
        var notes = [];
        if (firstAvail)
        {
            var availNote = list[firstAvail].description;
            notes.push(availNote);
        }
        if (firstUnavail != null)
        {
            var unavailNote = 'not in ' + list[firstUnavail].description;
            notes.push(unavailNote);
        }
        var versioning = notes.join(', ');
        return versioning;
    }
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
        var featureName = features[index];
        result += '<li>' + formatFeatureName(featureName);
        var assigments = assignmentMap[featureName];
        var versioning = assigments.versioning;
        var impliers = assigments.impliers;
        if (versioning || impliers)
        {
            result += ' (';
            if (impliers)
            {
                result += 'implied by ' + impliers.map(formatFeatureName).join(' and ');
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
        { description: 'Chrome 41+, Opera 28+', feature: 'CHROME41' },
        { description: 'Chrome 45+, Opera 32+', feature: 'CHROME45' }
    ],
    [
        { description: 'Internet Explorer 9+', feature: 'IE9' },
        { description: 'Internet Explorer 10+', feature: 'IE10' },
        { description: 'Internet Explorer 11', feature: 'IE11' }
    ],
    [
        { description: 'Safari 7.0+', feature: 'SAFARI70' },
        { description: 'Safari 7.1+', feature: 'SAFARI71' },
        { description: 'Safari 9.0+', feature: 'SAFARI90' }
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
        var Feature = JScrewIt.Feature;
        var allFeatureMap = Feature.ALL;
        
        var content =
            '# JScrewIt Feature Reference\n' +
            '## Feature List\n' +
            'This section lists all features along with their descriptions.\n';
        Object.keys(allFeatureMap).sort().forEach(
            function (featureName)
            {
                var subContent;
                var featureObj = allFeatureMap[featureName];
                var name = featureObj.name;
                if (name === featureName)
                {
                    var description = featureObj.description;
                    subContent = escape(description);
                }
                else
                {
                    subContent = '_An alias for ' + formatFeatureNameMD(name) + '._';
                }
                content +=
                    '<a name="' + getAnchorName(featureName) + '"></a>\n' +
                    '### `' + featureName + '`\n' + subContent + '\n';
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
                var featureName;
                for (featureName in allFeatureMap)
                {
                    var featureObj = Feature[featureName];
                    if (featureObj.check && featureObj.name === featureName)
                    {
                        var versioning = getVersioningFor(featureName, list);
                        if (versioning != null)
                        {
                            var assignments = { versioning: versioning };
                            assignmentMap[featureName] = assignments;
                        }
                    }
                }
                for (featureName in assignmentMap)
                {
                    if (Feature[featureName].check)
                    {
                        var impliers = getImpliers(featureName, assignmentMap);
                        if (impliers)
                        {
                            assignmentMap[featureName].impliers = impliers;
                        }
                    }
                }
                content += printRow(list[0].description, assignmentMap);
            }
        );
        content += '</table>\n';
        return content;
    };
