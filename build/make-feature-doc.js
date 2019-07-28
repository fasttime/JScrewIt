'use strict';

const JScrewIt = require('..');

const ENGINE_ENTRIES =
[
    {
        name: ['Chrome', 'Opera'],
        versions:
        [
            { description: ['73+', '60+'], feature: 'CHROME_73' },
        ],
    },
    {
        name: 'Edge',
        versions:
        [
            { description: '40+', feature: 'EDGE_40' },
        ],
    },
    {
        name: 'Firefox',
        versions:
        [
            { description: '54+', feature: 'FF_54' },
            { description: '62+', feature: 'FF_62' },
        ],
    },
    {
        name: 'Internet Explorer',
        versions:
        [
            { description: '9+', feature: 'IE_9' },
            { description: '10+', feature: 'IE_10' },
            { description: '11', feature: 'IE_11' },
            { description: '11 on Windows 10', feature: 'IE_11_WIN_10' },
        ],
    },
    {
        name: 'Safari',
        versions:
        [
            { description: '7.0+', feature: 'SAFARI_7_0' },
            { description: '7.1+', feature: 'SAFARI_7_1' },
            { description: '8+', feature: 'SAFARI_8' },
            { description: '9+', feature: 'SAFARI_9' },
            { description: '10+', feature: 'SAFARI_10' },
            { description: '12+', feature: 'SAFARI_12' },
        ],
    },
    {
        name: 'Android Browser',
        versions:
        [
            { description: '4.0+', feature: 'ANDRO_4_0' },
            { description: '4.1+', feature: 'ANDRO_4_1' },
            { description: '4.4', feature: 'ANDRO_4_4' },
        ],
    },
    {
        name: 'Node.js',
        versions:
        [
            { description: '0.10+', feature: 'NODE_0_10' },
            { description: '0.12+', feature: 'NODE_0_12' },
            { description: '4+', feature: 'NODE_4' },
            { description: '5+', feature: 'NODE_5' },
            { description: '10+', feature: 'NODE_10' },
            { description: '11+', feature: 'NODE_11' },
            { description: '12+', feature: 'NODE_12' },
        ],
    },
];

const ENGINE_REFS =
[
    { index: 0, subIndex: 0 },
    { index: 1 },
    { index: 2 },
    { index: 3 },
    { index: 4 },
    { index: 0, subIndex: 1 },
    { index: 5 },
    { index: 6 },
];

function calculateEngineSupportInfo(engineEntry, filter)
{
    let firstAvail;
    let firstUnavail;
    const { versions } = engineEntry;
    versions.forEach
    (
        (version, versionIndex) =>
        {
            const engineFeatureName = version.feature;
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
        },
    );
    const availabilityInfo = { firstAvail, firstUnavail };
    return availabilityInfo;
}

function escape(str, newLineSeparator)
{
    const result =
    str.replace(/[\n&()[\\\]]/g, char => char === '\n' ? newLineSeparator : `\\${char}`);
    return result;
}

function formatAvailability(availability, webWorkerReport, forcedStrictModeReport)
{
    function appendNote(report, environmentDescription)
    {
        if (report)
        {
            result += ` This feature is not available ${environmentDescription}`;
            if (report !== true)
                result += ` in ${formatReport(report)}`;
            result += '.';
        }
    }

    let result;
    const { length } = availability;
    if (length)
    {
        result = `Available in ${formatReport(availability)}.`;
        appendNote(webWorkerReport, 'inside web workers');
        appendNote(forcedStrictModeReport, 'when strict mode is enforced');
    }
    else
        result = 'This feature is not available in any of the supported engines.';
    return result;
}

function formatFeatureName(featureName)
{
    const TARGET = 'doc/interfaces/_jscrewit_.featureall.md';

    const result =
    `<a href="${TARGET}#${getAnchorName(featureName)}"><code>${featureName}</code></a>`;
    return result;
}

function formatReport(report)
{
    let result;
    if (report.length === 1)
        [result] = report;
    else
    {
        const lastEntry = report.pop();
        result = `${report.join(', ')} and ${lastEntry}`;
    }
    return result;
}

function getAnchorName(featureName)
{
    return featureName;
}

function getAvailabilityInfo(featureName, engineEntry)
{
    const availabilityInfoCache =
    engineEntry.availabilityInfoCache || (engineEntry.availabilityInfoCache = { __proto__: null });
    const availabilityInfo =
    availabilityInfoCache[featureName] ||
    (
        availabilityInfoCache[featureName] =
        calculateEngineSupportInfo
        (engineEntry, engineFeatureObj => engineFeatureObj.includes(featureName))
    );
    return availabilityInfo;
}

function getCombinedDescription(engineEntry, versionIndex)
{
    function formatVersionedNames(names)
    {
        const str =
        names.map
        (
            (name, subIndex) =>
            {
                const indexedDescription = description[subIndex];
                const versionedName = getVersionedName(name, indexedDescription);
                return versionedName;
            },
        )
        .join(', ');
        return str;
    }

    function getVersionedName(name, description)
    {
        const versionedName = description ? `${name} ${description}` : name;
        return versionedName;
    }

    const { name } = engineEntry;
    const versionEntry = engineEntry.versions[versionIndex];
    const { description } = versionEntry;
    const combinedDescription =
    Array.isArray(name) ? formatVersionedNames(name) : getVersionedName(name, description);
    return combinedDescription;
}

function getEngineSupportInfo(attributeName, engineEntry)
{
    const result =
    calculateEngineSupportInfo
    (engineEntry, engineFeatureObj => attributeName in engineFeatureObj.attributes);
    return result;
}

function getForcedStrictModeReport(featureObj)
{
    const restriction = featureObj.attributes['forced-strict-mode'];
    const report = restriction !== undefined && reportAsList(restriction, getEngineSupportInfo);
    return report;
}

function getImpliers(featureName, assignmentMap)
{
    const impliers = [];
    for (const otherFeatureName in assignmentMap)
    {
        if
        (
            featureName !== otherFeatureName &&
            JScrewIt.Feature[otherFeatureName].includes(featureName)
        )
            impliers.push(otherFeatureName);
    }
    if (impliers.length)
        return impliers.sort();
}

function getVersioningFor(featureName, engineEntry)
{
    const availabilityInfo = getAvailabilityInfo(featureName, engineEntry);
    const { firstAvail } = availabilityInfo;
    if (firstAvail != null)
    {
        const notes = [];
        if (firstAvail)
        {
            const availNote = getCombinedDescription(engineEntry, firstAvail);
            notes.push(availNote);
        }
        const { firstUnavail } = availabilityInfo;
        if (firstUnavail)
        {
            const unavailNote = `not in ${getCombinedDescription(engineEntry, firstUnavail)}`;
            notes.push(unavailNote);
        }
        const versioning = notes.join(', ');
        return versioning;
    }
}

function getWebWorkerReport(featureObj)
{
    const restriction = featureObj.attributes['web-worker'];
    const report =
    restriction !== undefined &&
    (restriction === 'web-worker-restriction' || reportAsList(restriction, getEngineSupportInfo));
    return report;
}

function printRow(label, assignmentMap)
{
    let result = `<tr>\n<td>${label}</td>\n<td>\n<ul>\n`;
    const featureNames = Object.keys(assignmentMap).sort();
    for (const featureName of featureNames)
    {
        result += `<li>${formatFeatureName(featureName)}`;
        const assigments = assignmentMap[featureName];
        const { impliers, versioning } = assigments;
        if (versioning || impliers)
        {
            result += ' (';
            if (impliers)
            {
                result += `implied by ${impliers.map(formatFeatureName).join(' and ')}`;
                if (versioning)
                    result += '; ';
            }
            if (versioning)
                result += versioning;
            result += ')';
        }
        result += '\n';
    }
    result += '</ul>\n</td>\n</tr>\n';
    return result;
}

function reportAsList(property, filter)
{
    const availability =
    ENGINE_REFS.map
    (
        engineRef =>
        {
            const engineEntry = ENGINE_ENTRIES[engineRef.index];
            const availabilityInfo = filter(property, engineEntry);
            const { firstAvail } = availabilityInfo;
            if (firstAvail != null)
            {
                const { subIndex } = engineRef;
                const getBySubIndex = obj => subIndex == null ? obj : obj[subIndex];
                const { versions } = engineEntry;
                const getDescription =
                versionIndex =>
                {
                    const { description } = versions[versionIndex];
                    const result = getBySubIndex(description);
                    return result;
                };
                let availEntry = getBySubIndex(engineEntry.name);
                if (firstAvail)
                    availEntry += ` ${getDescription(firstAvail)}`;
                const { firstUnavail } = availabilityInfo;
                if (firstUnavail)
                    availEntry += ` before ${getDescription(firstUnavail).replace(/\+$/, '')}`;
                return availEntry;
            }
        },
    )
    .filter(availEntry => availEntry != null);
    return availability;
}

module.exports =
() =>
{
    const { Feature } = JScrewIt;
    const allFeatureMap = Feature.ALL;
    const elementaryFeatures = Feature.ELEMENTARY;
    const compositeFeatureNames = [];
    let contentTs =
    '/// <reference path=\'feature.d.ts\'/>\n' +
    '\n' +
    'declare module \'jscrewit\'\n' +
    '{\n' +
    '    interface FeatureAll\n' +
    '    {';
    Object.keys(allFeatureMap).sort().forEach
    (
        featureName =>
        {
            let subContentTs;
            const featureObj = allFeatureMap[featureName];
            const { elementary, name } = featureObj;
            if (name === featureName)
            {
                const { description, elementary } = featureObj;
                subContentTs =
                `\n         * ${escape(description, '\n         *\n         * ')}\n         `;
                if (elementary)
                {
                    const availability = reportAsList(featureName, getAvailabilityInfo);
                    const webWorkerReport = getWebWorkerReport(featureObj);
                    const forcedStrictModeReport = getForcedStrictModeReport(featureObj);
                    {
                        const formattedAvailability =
                        formatAvailability(availability, webWorkerReport, forcedStrictModeReport);
                        subContentTs +=
                        '*\n         * @reamarks\n         *\n' +
                        `         * ${formattedAvailability}\n         `;
                    }
                }
                else
                    compositeFeatureNames.push(featureName);
            }
            else
                subContentTs = ` An alias for \`${name}\`. `;
            const typeName = elementary ? 'ElementaryFeature' : 'PredefinedFeature';
            contentTs += `\n        /**${subContentTs}*/\n        ${featureName}: ${typeName};\n`;
        },
    );
    contentTs +=
    '    }\n' +
    '\n' +
    '    /** Name of an elementary feature. */\n' +
    '    type ElementaryFeatureName =\n' +
    `${Feature.ELEMENTARY.map(({ name }) => `    | '${name}'\n`).join('')}` +
    '    ;\n' +
    '\n' +
    '    /** Name of a predefined feature. */\n' +
    '    type PredefinedFeatureName =\n' +
    '    ElementaryFeatureName\n' +
    `${compositeFeatureNames.map(featureName => `    | '${featureName}'\n`).join('')}` +
    '    ;\n' +
    '}\n';
    let contentMd =
    '# JScrewIt Feature Reference\n' +
    'This table lists features available in the most common engines.\n' +
    '<table>\n' +
    '<tr>\n' +
    '<th>Target</th>\n' +
    '<th>Features</th>\n' +
    '</tr>\n';
    for (const engineEntry of ENGINE_ENTRIES)
    {
        const assignmentMap = { __proto__: null };
        let featureName;
        elementaryFeatures.forEach
        (
            featureObj =>
            {
                const featureName = featureObj.name;
                const versioning = getVersioningFor(featureName, engineEntry);
                if (versioning != null)
                {
                    const assignments = { versioning };
                    assignmentMap[featureName] = assignments;
                }
            },
        );
        for (featureName in assignmentMap)
        {
            const impliers = getImpliers(featureName, assignmentMap);
            if (impliers)
                assignmentMap[featureName].impliers = impliers;
        }
        contentMd += printRow(getCombinedDescription(engineEntry, 0), assignmentMap);
    }
    contentMd += '</table>\n';
    const returnValue = { contentMd, contentTs };
    return returnValue;
};
