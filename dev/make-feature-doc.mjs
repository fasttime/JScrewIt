import { Feature }                                  from '../lib/jscrewit.js';
import { getAvailabilityByFeature, getDescription } from './internal/engine-data.mjs';

function formatFeatureName(featureName)
{
    const TARGET = 'api-doc/interfaces/FeatureAll.md';

    const result = `<a href="${TARGET}#${featureName}"><code>${featureName}</code></a>`;
    return result;
}

function getCombinedDescription(families, compatibilityIndex = 0)
{
    function getVersionedName(name)
    {
        const compatibilities = Feature.FAMILIES[name];
        const description = getDescription(compatibilities, compatibilityIndex, true);
        const versionedName = description ? `${name} ${description}` : name;
        return versionedName;
    }

    const combinedDescription = families.map(getVersionedName).join(', ');
    return combinedDescription;
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

function getVersioningFor(featureName, families)
{
    const [anyFamily] = families;
    const availabilityInfo = getAvailabilityByFeature(featureName, anyFamily);
    const { firstAvail } = availabilityInfo;
    if (firstAvail != null)
    {
        const notes = [];
        if (firstAvail)
        {
            const availNote = getCombinedDescription(families, firstAvail);
            notes.push(availNote);
        }
        const { firstUnavail } = availabilityInfo;
        if (firstUnavail)
        {
            const unavailNote = `not in ${getCombinedDescription(families, firstUnavail)}`;
            notes.push(unavailNote);
        }
        const versioning = notes.join(', ');
        return versioning;
    }
}

export default
() =>
{
    const AND_FORMATTER = new Intl.ListFormat('en');

    const FAMILY_LISTS =
    [
        ['Chrome', 'Edge', 'Opera'],
        ['Firefox'],
        ['Internet Explorer'],
        ['Safari'],
        ['Android Browser'],
        ['Node.js'],
        ['Deno'],
    ];

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
                    const featureNameList =
                    AND_FORMATTER.format(impliers.map(formatFeatureName));
                    componentEntry += `implied by ${featureNameList}`;
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

    const featureRowContentList =
    FAMILY_LISTS
    .map
    (
        families =>
        {
            const assignmentMap = { __proto__: null };
            Feature.ELEMENTARY.forEach
            (
                ({ name: featureName }) =>
                {
                    const versioning = getVersioningFor(featureName, families);
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
            const label = getCombinedDescription(families);
            const componentEntries = getComponentEntries(assignmentMap);
            const featureRow = { label, componentEntries };
            return featureRow;
        },
    );
    const context = { featureRowContentList };
    return context;
};
