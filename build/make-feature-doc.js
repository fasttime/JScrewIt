'use strict';

const { Feature } = require('..');

const ENGINE_ENTRIES =
[
    {
        name: ['Chrome', 'Edge', 'Opera'],
        versions:
        [
            { description: ['73+', '79+'], feature: 'CHROME_73' },
            { description: ['86+', '86+', '72+'], feature: 'CHROME_86' },
        ],
    },
    {
        name: 'Firefox',
        versions:
        [
            { description: '78+', feature: 'FF_78' },
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
            { description: '15+', feature: 'NODE_15' },
        ],
    },
];

const ENGINE_REFS =
[
    { index: 0, subIndex: 0 },
    { index: 0, subIndex: 1 },
    { index: 1 },
    { index: 2 },
    { index: 3 },
    { index: 0, subIndex: 2 },
    { index: 4 },
    { index: 5 },
];

function calculateEngineSupportInfo(engineEntry, filter)
{
    let firstAvail;
    let firstUnavail;
    engineEntry.versions.forEach
    (
        ({ feature }, versionIndex) =>
        {
            const engineFeatureObj = Feature[feature];
            if (filter(engineFeatureObj))
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
    const TARGET = 'api-doc/interfaces/_jscrewit_.featureall.md';

    const result = `<a href="${TARGET}#${featureName}"><code>${featureName}</code></a>`;
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

function getCombinedDescription(engineEntry, versionIndex = 0)
{
    function getIndexedDescription(mapDescription)
    {
        for (let index = versionIndex; ; ++index)
        {
            const description = mapDescription(versions[index].description);
            if (description)
                return description;
        }
    }

    function getVersionedName(name, description)
    {
        const versionedName = description ? `${name} ${description}` : name;
        return versionedName;
    }

    let combinedDescription;
    const { name, versions } = engineEntry;
    if (Array.isArray(name))
    {
        combinedDescription =
        name.map
        (
            (name, subIndex) =>
            {
                const description = getIndexedDescription(description => description[subIndex]);
                const versionedName = getVersionedName(name, description);
                return versionedName;
            },
        )
        .join(', ');
    }
    else
    {
        const description = getIndexedDescription(description => description);
        combinedDescription = getVersionedName(name, description);
    }
    return combinedDescription;
}

function getComponentEntries(assignmentMap)
{
    const componentEntries = [];
    const featureNames = Object.keys(assignmentMap).sort();
    for (const featureName of featureNames)
    {
        let componentEntry = formatFeatureName(featureName);
        const assigments = assignmentMap[featureName];
        const { impliers, versioning } = assigments;
        if (versioning || impliers)
        {
            componentEntry += ' (';
            if (impliers)
            {
                componentEntry += `implied by ${impliers.map(formatFeatureName).join(' and ')}`;
                if (versioning)
                    componentEntry += '; ';
            }
            if (versioning)
                componentEntry += versioning;
            componentEntry += ')';
        }
        componentEntries.push(componentEntry);
    }
    return componentEntries;
}

function getEngineSupportInfo(attributeName, engineEntry)
{
    const result =
    calculateEngineSupportInfo
    (engineEntry, engineFeatureObj => attributeName in engineFeatureObj.attributes);
    return result;
}

function getForcedStrictModeReport({ attributes: { 'forced-strict-mode': restriction } })
{
    const report = restriction !== undefined && reportAsList(restriction, getEngineSupportInfo);
    return report;
}

function getImpliers(featureName, assignmentMap)
{
    const impliers = [];
    for (const otherFeatureName in assignmentMap)
    {
        if (featureName !== otherFeatureName && Feature[otherFeatureName].includes(featureName))
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

function getWebWorkerReport({ attributes: { 'web-worker': restriction } })
{
    const report =
    restriction !== undefined &&
    (restriction === 'web-worker-restriction' || reportAsList(restriction, getEngineSupportInfo));
    return report;
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
                {
                    const description = getDescription(firstUnavail);
                    if (description)
                        availEntry += ` before ${description.replace(/\+$/, '')}`;
                }
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
    const compositeFeatureNames = [];
    const featureInfoList =
    Object.keys(Feature.ALL).sort().map
    (
        featureName =>
        {
            let formattedDescription;
            const featureObj = Feature.ALL[featureName];
            const { elementary, name } = featureObj;
            if (name === featureName)
            {
                formattedDescription =
                '        /**\n' +
                `         * ${escape(featureObj.description, '\n         *\n         * ')}\n`;
                if (elementary)
                {
                    const availability = reportAsList(featureName, getAvailabilityInfo);
                    const webWorkerReport = getWebWorkerReport(featureObj);
                    const forcedStrictModeReport = getForcedStrictModeReport(featureObj);
                    {
                        const formattedAvailability =
                        formatAvailability(availability, webWorkerReport, forcedStrictModeReport);
                        formattedDescription +=
                        '         *\n' +
                        '         * @remarks\n' +
                        '         *\n' +
                        `         * ${formattedAvailability}\n`;
                    }
                }
                else
                    compositeFeatureNames.push(featureName);
                formattedDescription += '         */';
            }
            else
                formattedDescription = `        /** An alias for \`${name}\`. */`;
            const typeName = elementary ? 'ElementaryFeature' : 'PredefinedFeature';
            const featureInfo = { featureName, formattedDescription, typeName };
            return featureInfo;
        },
    );
    const elementaryFeatureNames = Feature.ELEMENTARY.map(({ name }) => name);
    const contextTs = { compositeFeatureNames, elementaryFeatureNames, featureInfoList };
    const featureRowContentList =
    ENGINE_ENTRIES.map
    (
        engineEntry =>
        {
            const assignmentMap = { __proto__: null };
            Feature.ELEMENTARY.forEach
            (
                ({ name: featureName }) =>
                {
                    const versioning = getVersioningFor(featureName, engineEntry);
                    if (versioning != null)
                    {
                        const assignments = { versioning };
                        assignmentMap[featureName] = assignments;
                    }
                },
            );
            for (const featureName in assignmentMap)
            {
                const impliers = getImpliers(featureName, assignmentMap);
                if (impliers)
                    assignmentMap[featureName].impliers = impliers;
            }
            const label = getCombinedDescription(engineEntry);
            const componentEntries = getComponentEntries(assignmentMap);
            const featureRow = { label, componentEntries };
            return featureRow;
        },
    );
    const contextMd = { featureRowContentList };
    const returnValue = { contextMd, contextTs };
    return returnValue;
};
