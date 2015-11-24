/* jshint node: true */

'use strict';

var JScrewIt = require('../lib/jscrewit.js');

var ENGINE_ENTRIES =
[
    {
        name: 'Firefox',
        versions:
        [
            { description: '31+', feature: 'FF31' }
        ]
    },
    {
        name: ['Chrome', 'Opera'],
        versions:
        [
            { description: ['45+', '32+'], feature: 'CHROME45' }
        ]
    },
    {
        name: 'Internet Explorer',
        versions:
        [
            { description: '9+', feature: 'IE9' },
            { description: '10+', feature: 'IE10' },
            { description: '11', feature: 'IE11' },
            { description: '11 on Windows 10', feature: 'IE11_WIN10' }
        ]
    },
    {
        name: 'Safari',
        versions:
        [
            { description: '7.0+', feature: 'SAFARI70' },
            { description: '7.1+', feature: 'SAFARI71' },
            { description: '9.0+', feature: 'SAFARI90' }
        ]
    },
    {
        name: 'Microsoft Edge',
        versions:
        [
            { feature: 'EDGE' }
        ]
    },
    {
        name: 'Android Browser',
        versions:
        [
            { description: '4.0+', feature: 'ANDRO400' },
            { description: '4.1.2+', feature: 'ANDRO412' },
            { description: '4.4.2+', feature: 'ANDRO442' }
        ]
    },
    {
        name: 'Node.js',
        versions:
        [
            { description: '0.10.26+', feature: 'NODE010' },
            { description: '0.12+', feature: 'NODE012' },
            { description: '4+', feature: 'NODE40' }
        ]
    }
];

var ENGINE_REFS =
[
    { index: 0 },
    { index: 1, subIndex: 0 },
    { index: 2 },
    { index: 3 },
    { index: 1, subIndex: 1 },
    { index: 4 },
    { index: 5 },
    { index: 6 }
];

function calculateAvailabilityInfo(feature, engineEntry)
{
    var firstAvail, firstUnavail;
    var versions = engineEntry.versions;
    for (var versionIndex = 0, length = versions.length; versionIndex < length; ++versionIndex)
    {
        var otherFeatureName = versions[versionIndex].feature;
        if (JScrewIt.Feature[otherFeatureName].includes(feature))
        {
            if (firstAvail == null)
            {
                firstAvail = versionIndex;
            }
        }
        else
        {
            if (firstAvail != null && firstUnavail == null)
            {
                firstUnavail = versionIndex;
            }
        }
    }
    var availabilityInfo = { firstAvail: firstAvail, firstUnavail: firstUnavail };
    return availabilityInfo;
}

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

function formatAvailability(availability)
{
    var result;
    var length = availability.length;
    if (length)
    {
        result = 'Available in ';
        if (length === 1)
        {
            result += availability[0];
        }
        else
        {
            var lastAvailEntry = availability.pop();
            result += availability.join(', ') + ' and ' + lastAvailEntry;
        }
        result += '.';
    }
    else
    {
        result = 'This feature is not available in any of the supported engines.';
    }
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

function getAvailability(featureName)
{
    var availability =
        ENGINE_REFS.map(
            function (engineRef)
            {
                function getBySubIndex(obj)
                {
                    var result = subIndex == null ? obj : obj[subIndex];
                    return result;
                }
                
                function getDescription(versionIndex)
                {
                    var description = versions[versionIndex].description;
                    var result = getBySubIndex(description);
                    return result;
                }
                
                var engineEntry = ENGINE_ENTRIES[engineRef.index];
                var availabilityInfo = getAvailabilityInfo(featureName, engineEntry);
                var firstAvail = availabilityInfo.firstAvail;
                if (firstAvail != null)
                {
                    var versions = engineEntry.versions;
                    var subIndex = engineRef.subIndex;
                    var availEntry = getBySubIndex(engineEntry.name);
                    if (firstAvail)
                    {
                        availEntry += ' ' + getDescription(firstAvail);
                    }
                    var firstUnavail = availabilityInfo.firstUnavail;
                    if (firstUnavail)
                    {
                        availEntry += ' before ' + getDescription(firstUnavail);
                    }
                    return availEntry;
                }
            }
        ).filter(
            function (availEntry)
            {
                return availEntry != null;
            }
        );
    return availability;
}

function getAvailabilityInfo(featureName, engineEntry)
{
    var availabilityInfoCache =
        engineEntry.availabilityInfoCache ||
        (engineEntry.availabilityInfoCache = Object.create(null));
    var availabilityInfo =
        availabilityInfoCache[featureName] ||
        (availabilityInfoCache[featureName] = calculateAvailabilityInfo(featureName, engineEntry));
    return availabilityInfo;
}

function getCombinedDescription(engineEntry, versionIndex)
{
    function getVersionedName(name, description)
    {
        var result = description ? name + ' ' + description : name;
        return result;
    }
    
    var name = engineEntry.name;
    var versionEntry = engineEntry.versions[versionIndex];
    var description = versionEntry.description;
    var result =
        Array.isArray(name) ?
        name.map(
            function (name, subIndex)
            {
                var indexedDescription = description[subIndex];
                var result = getVersionedName(name, indexedDescription);
                return result;
            }
        ).join(', ') :
        getVersionedName(name, description);
    return result;
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

function getVersioningFor(featureName, engineEntry)
{
    var availabilityInfo = getAvailabilityInfo(featureName, engineEntry);
    var firstAvail = availabilityInfo.firstAvail;
    if (firstAvail != null)
    {
        var notes = [];
        if (firstAvail)
        {
            var availNote = getCombinedDescription(engineEntry, firstAvail);
            notes.push(availNote);
        }
        var firstUnavail = availabilityInfo.firstUnavail;
        if (firstUnavail)
        {
            var unavailNote = 'not in ' + getCombinedDescription(engineEntry, firstUnavail);
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
                    if (featureObj.check)
                    {
                        var availability = getAvailability(featureName);
                        subContent += '\n\n_' + formatAvailability(availability) + '_';
                    }
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
        ENGINE_ENTRIES.forEach(
            function (engineEntry)
            {
                var assignmentMap = Object.create(null);
                var featureName;
                for (featureName in allFeatureMap)
                {
                    var featureObj = Feature[featureName];
                    if (featureObj.check && featureObj.name === featureName)
                    {
                        var versioning = getVersioningFor(featureName, engineEntry);
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
                content += printRow(getCombinedDescription(engineEntry, 0), assignmentMap);
            }
        );
        content += '</table>\n';
        return content;
    };
