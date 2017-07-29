/* eslint-env node */

'use strict';

var JScrewIt = require('../lib/jscrewit');

var ENGINE_ENTRIES =
[
    {
        name: ['Chrome', 'Opera'],
        versions:
        [
            { description: ['59+', '46+'], feature: 'CHROME59' }
        ]
    },
    {
        name: 'Edge',
        versions:
        [
            { description: '40+', feature: 'EDGE40' }
        ]
    },
    {
        name: 'Firefox',
        versions:
        [
            { description: '54+', feature: 'FF54' }
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
            { description: '8.0+', feature: 'SAFARI80' },
            { description: '9.0+', feature: 'SAFARI90' },
            { description: '10.0+', feature: 'SAFARI100' }
        ]
    },
    {
        name: 'Android Browser',
        versions:
        [
            { description: '4.0+', feature: 'ANDRO40' },
            { description: '4.1+', feature: 'ANDRO41' },
            { description: '4.4+', feature: 'ANDRO44' }
        ]
    },
    {
        name: 'Node.js',
        versions:
        [
            { description: '0.10+', feature: 'NODE010' },
            { description: '0.12+', feature: 'NODE012' },
            { description: '4+', feature: 'NODE40' },
            { description: '5+', feature: 'NODE50' }
        ]
    }
];

var ENGINE_REFS =
[
    { index: 0, subIndex: 0 },
    { index: 1 },
    { index: 2 },
    { index: 3 },
    { index: 4 },
    { index: 0, subIndex: 1 },
    { index: 5 },
    { index: 6 }
];

function calculateEngineSupportInfo(engineEntry, filter)
{
    var firstAvail;
    var firstUnavail;
    var versions = engineEntry.versions;
    for (var versionIndex = 0, length = versions.length; versionIndex < length; ++versionIndex)
    {
        var engineFeatureName = versions[versionIndex].feature;
        if (filter(JScrewIt.Feature[engineFeatureName]))
        {
            if (firstAvail == null)
                firstAvail = versionIndex;
        }
        else
        {
            if (firstAvail != null && firstUnavail == null)
                firstUnavail = versionIndex;
        }
    }
    var availabilityInfo = { firstAvail: firstAvail, firstUnavail: firstUnavail };
    return availabilityInfo;
}

function escape(str)
{
    var result =
        str
        .replace(
            /[\n&()[\\\]]/g,
            function (char)
            {
                if (char === '\n')
                    return '<br>\n';
                return '\\' + char;
            }
        );
    return result;
}

function formatAvailability(availability, webWorkerReport, forcedStrictModeReport)
{
    function appendNote(report, environmentDescription)
    {
        if (report)
        {
            result += ' This feature is not available ' + environmentDescription;
            if (report !== true)
                result += ' in ' + formatReport(report);
            result += '.';
        }
    }
    
    var result;
    var length = availability.length;
    if (length)
    {
        result = 'Available in ' + formatReport(availability) + '.';
        appendNote(webWorkerReport, 'inside web workers');
        appendNote(forcedStrictModeReport, 'when strict mode is enforced');
    }
    else
        result = 'This feature is not available in any of the supported engines.';
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

function formatReport(report)
{
    var result;
    if (report.length === 1)
        result = report[0];
    else
    {
        var lastEntry = report.pop();
        result = report.join(', ') + ' and ' + lastEntry;
    }
    return result;
}

function getAnchorName(featureName)
{
    return featureName;
}

function getAvailabilityInfo(featureName, engineEntry)
{
    var availabilityInfoCache =
        engineEntry.availabilityInfoCache ||
        (engineEntry.availabilityInfoCache = Object.create(null));
    var availabilityInfo =
        availabilityInfoCache[featureName] ||
        (
            availabilityInfoCache[featureName] =
            calculateEngineSupportInfo(
                engineEntry,
                function (engineFeatureObj)
                {
                    return engineFeatureObj.includes(featureName);
                }
            )
        );
    return availabilityInfo;
}

function getCombinedDescription(engineEntry, versionIndex)
{
    function formatVersionedNames(names)
    {
        var str =
            names.map(
                function (name, subIndex)
                {
                    var indexedDescription = description[subIndex];
                    var versionedName = getVersionedName(name, indexedDescription);
                    return versionedName;
                }
            ).join(', ');
        return str;
    }
    
    function getVersionedName(name, description)
    {
        var versionedName = description ? name + ' ' + description : name;
        return versionedName;
    }
    
    var name = engineEntry.name;
    var versionEntry = engineEntry.versions[versionIndex];
    var description = versionEntry.description;
    var combinedDescription =
        Array.isArray(name) ? formatVersionedNames(name) : getVersionedName(name, description);
    return combinedDescription;
}

function getEngineSupportInfo(attributeName, engineEntry)
{
    var result =
        calculateEngineSupportInfo(
            engineEntry,
            function (engineFeatureObj)
            {
                return attributeName in engineFeatureObj.attributes;
            }
        );
    return result;
}

function getForcedStrictModeReport(featureObj)
{
    var restriction = featureObj.attributes['forced-strict-mode'];
    var report = restriction !== undefined && reportAsList(restriction, getEngineSupportInfo);
    return report;
}

function getImpliers(featureName, assignmentMap)
{
    var impliers = [];
    for (var otherFeatureName in assignmentMap)
    {
        if (
            featureName !== otherFeatureName &&
            JScrewIt.Feature[otherFeatureName].includes(featureName))
            impliers.push(otherFeatureName);
    }
    if (impliers.length)
        return impliers.sort();
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

function getWebWorkerReport(featureObj)
{
    var restriction = featureObj.attributes['web-worker'];
    var report =
        restriction !== undefined &&
        (
            restriction === 'web-worker-restriction' ||
            reportAsList(restriction, getEngineSupportInfo)
        );
    return report;
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
                    result += '; ';
            }
            if (versioning)
                result += versioning;
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

function reportAsList(property, filter)
{
    var availability =
        ENGINE_REFS.map(
            function (engineRef)
            {
                var engineEntry = ENGINE_ENTRIES[engineRef.index];
                var availabilityInfo = filter(property, engineEntry);
                var firstAvail = availabilityInfo.firstAvail;
                if (firstAvail != null)
                {
                    var subIndex = engineRef.subIndex;
                    var getBySubIndex =
                        function (obj)
                        {
                            var result = subIndex == null ? obj : obj[subIndex];
                            return result;
                        };
                    var versions = engineEntry.versions;
                    var getDescription =
                        function (versionIndex)
                        {
                            var description = versions[versionIndex].description;
                            var result = getBySubIndex(description);
                            return result;
                        };
                    var availEntry = getBySubIndex(engineEntry.name);
                    if (firstAvail)
                        availEntry += ' ' + getDescription(firstAvail);
                    var firstUnavail = availabilityInfo.firstUnavail;
                    if (firstUnavail)
                        availEntry += ' before ' + getDescription(firstUnavail);
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
                        var availability = reportAsList(featureName, getAvailabilityInfo);
                        var webWorkerReport = getWebWorkerReport(featureObj);
                        var forcedStrictModeReport = getForcedStrictModeReport(featureObj);
                        subContent +=
                            '\n\n_' +
                            formatAvailability(
                                availability,
                                webWorkerReport,
                                forcedStrictModeReport
                            ) +
                            '_';
                    }
                }
                else
                    subContent = '_An alias for ' + formatFeatureNameMD(name) + '._';
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
                            assignmentMap[featureName].impliers = impliers;
                    }
                }
                content += printRow(getCombinedDescription(engineEntry, 0), assignmentMap);
            }
        );
        content += '</table>\n';
        return content;
    };
