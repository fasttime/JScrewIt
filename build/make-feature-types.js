'use strict';

const { Feature }                                       = require('..');
const { ENGINE_ENTRIES, calculateEngineSupportInfo }    = require('./internal/engine-data');

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

function escape(str)
{
    const returnValue = str.replace(/[&()[\\\]]/g, '\\$&');
    return returnValue;
}

function escapeMultiline(str)
{
    const lines = escape(str).split('\n');
    return lines;
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

function formatDescriptionLines(descriptionLines)
{
    let formattedDescription;
    if (descriptionLines.length > 1)
    {
        const joinedLines =
        descriptionLines
        .map(descriptionLine => `         * ${descriptionLine}\n`)
        .join('         *\n');
        formattedDescription = `        /**\n${joinedLines}         */`;
    }
    else
        formattedDescription = `        /** ${descriptionLines[0]} */`;
    return formattedDescription;
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

function getAliasesOf(featureObj)
{
    const aliases =
    Object
    .keys(Feature.ALL)
    .filter(name => Feature.ALL[name] === featureObj && name !== featureObj.name)
    .sort();
    return aliases;
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
    const aliasFormatter = new Intl.ListFormat('en', { type: 'disjunction' });
    const engineSupportPolicyLink =
    'https://github.com/fasttime/JScrewIt#engine-support-policy';
    const compositeFeatureNames = [];
    const featureInfoList =
    Object.keys(Feature.ALL).sort().map
    (
        featureName =>
        {
            const descriptionLines = [];
            const featureObj = Feature.ALL[featureName];
            const { elementary, name: targetFeatureName } = featureObj;
            const featureDescription = Feature.descriptionFor(featureName);
            if (featureName === targetFeatureName)
            {
                descriptionLines.push(...escapeMultiline(featureDescription));
                if (elementary)
                {
                    const availability = reportAsList(featureName, getAvailabilityInfo);
                    const webWorkerReport = getWebWorkerReport(featureObj);
                    const forcedStrictModeReport = getForcedStrictModeReport(featureObj);
                    {
                        const formattedAvailability =
                        formatAvailability(availability, webWorkerReport, forcedStrictModeReport);
                        descriptionLines.push('@remarks', formattedAvailability);
                    }
                }
                else
                {
                    if ('unstable' in featureObj.attributes)
                    {
                        const formattedAliases =
                        aliasFormatter
                        .format(getAliasesOf(featureObj).map(alias => `\`${alias}\``));
                        const formattedFeatureName = `\`${featureName}\``;
                        descriptionLines.push
                        (
                            '@remarks',
                            'This feature may be replaced or removed in the near future when ' +
                            'current browser versions become obsolete. ' +
                            `Use ${formattedAliases} instead of ${formattedFeatureName} for long ` +
                            'term support.',
                            '@see',
                            `[Engine Support Policy](${engineSupportPolicyLink})`,
                        );
                    }
                    compositeFeatureNames.push(featureName);
                }
            }
            else
            {
                const targetDescription = Feature.descriptionFor(targetFeatureName);
                if (featureDescription !== targetDescription)
                    descriptionLines.push(...escapeMultiline(featureDescription));
                descriptionLines.push(`An alias for \`${targetFeatureName}\`.`);
            }
            const formattedDescription = formatDescriptionLines(descriptionLines);
            const typeName = elementary ? 'ElementaryFeature' : 'PredefinedFeature';
            const featureInfo = { featureName, formattedDescription, typeName };
            return featureInfo;
        },
    );
    const elementaryFeatureNames = Feature.ELEMENTARY.map(({ name }) => name);
    const context = { compositeFeatureNames, elementaryFeatureNames, featureInfoList };
    return context;
};
