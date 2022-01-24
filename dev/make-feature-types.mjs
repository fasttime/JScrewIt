import { Feature } from '../lib/jscrewit.js';

import { calculateAvailabilityInfo, getAvailabilityByFeature, getDescription }
from './internal/engine-data.mjs';

const INDENT = '    ';

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

function formatDescriptionLines(descriptionLines)
{
    let formattedDescription;
    if (descriptionLines.length > 1)
    {
        const joinedLines =
        descriptionLines
        .map(descriptionLine => `${INDENT} * ${descriptionLine}\n`)
        .join(`${INDENT} *\n`);
        formattedDescription = `${INDENT}/**\n${joinedLines}${INDENT} */`;
    }
    else
        formattedDescription = `${INDENT}/** ${descriptionLines[0]} */`;
    return formattedDescription;
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

function getAvailabilityByRestriction(attributeName, family)
{
    const availabilityInfo =
    calculateAvailabilityInfo
    (family, engineFeatureObj => attributeName in engineFeatureObj.attributes);
    return availabilityInfo;
}

export default
() =>
{
    const AND_FORMATTER = new Intl.ListFormat('en');
    const OR_FORMATTER  = new Intl.ListFormat('en', { type: 'disjunction' });

    const FAMILIES =
    [
        'Chrome',
        'Edge',
        'Firefox',
        'Internet Explorer',
        'Safari',
        'Opera',
        'Android Browser',
        'Node.js',
        'Deno',
    ];

    const ENGINE_SUPPORT_POLICY_LINK =
    'https://github.com/fasttime/JScrewIt#engine-support-policy';

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

    function formatReport(report)
    {
        const formattedReport = AND_FORMATTER.format(report);
        return formattedReport;
    }

    function getForcedStrictModeReport({ attributes: { 'forced-strict-mode': restriction } })
    {
        const report =
        restriction !== undefined && reportAsList(restriction, getAvailabilityByRestriction);
        return report;
    }

    function getWebWorkerReport({ attributes: { 'web-worker': restriction } })
    {
        const report =
        restriction !== undefined &&
        (
            restriction === 'web-worker-restriction' ||
            reportAsList(restriction, getAvailabilityByRestriction)
        );
        return report;
    }

    function reportAsList(property, filter)
    {
        const availability =
        FAMILIES.map
        (
            family =>
            {
                const availabilityInfo = filter(property, family);
                const { firstAvail } = availabilityInfo;
                if (firstAvail != null)
                {
                    const compatibilities = Feature.FAMILIES[family];
                    let availEntry = family;
                    if (firstAvail)
                    {
                        const description = getDescription(compatibilities, firstAvail, true);
                        availEntry += ` ${description}`;
                    }
                    const { firstUnavail } = availabilityInfo;
                    if (firstUnavail)
                    {
                        const description = getDescription(compatibilities, firstUnavail, false);
                        if (description)
                            availEntry += ` before ${description}`;
                    }
                    return availEntry;
                }
            },
        )
        .filter(availEntry => availEntry != null);
        return availability;
    }

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
                    const availability = reportAsList(featureName, getAvailabilityByFeature);
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
                        let remarks =
                        'This feature may be replaced or removed in the near future when current ' +
                        'browser versions become obsolete.';
                        const aliases = getAliasesOf(featureObj);
                        if (aliases.length)
                        {
                            const formattedAliases =
                            OR_FORMATTER.format(aliases.map(alias => `\`${alias}\``));
                            const formattedFeatureName = `\`${featureName}\``;
                            remarks +=
                            ` Use ${formattedAliases} instead of ${formattedFeatureName} for ` +
                            'long term support.';
                        }
                        descriptionLines.push
                        (
                            '@remarks',
                            remarks,
                            '@see',
                            `[Engine Support Policy](${ENGINE_SUPPORT_POLICY_LINK})`,
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
