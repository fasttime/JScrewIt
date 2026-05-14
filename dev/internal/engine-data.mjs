import { Feature } from '../../lib/jscrewit.js';

const AND_FORMATTER = new Intl.ListFormat('en');
const OR_FORMATTER  = new Intl.ListFormat('en', { type: 'disjunction' });

const availabilityInfoMap = { __proto__: null };

export function calculateAvailabilityInfo(family, filterFeature)
{
    let firstAvail;
    let firstUnavail;
    Feature.FAMILIES[family].forEach
    (
        ({ featureName }, compatibilityIndex) =>
        {
            const engineFeatureObj = Feature[featureName];
            if (filterFeature(engineFeatureObj))
                firstAvail ??= compatibilityIndex;
            else
            {
                if (firstAvail != null && firstUnavail == null)
                    firstUnavail = compatibilityIndex;
            }
        },
    );
    const availabilityInfo = { firstAvail, firstUnavail };
    return availabilityInfo;
}

export const getAvailabilityByFeature =
(featureName, family) =>
{
    const availabilityInfoCache = availabilityInfoMap[family] ??= { __proto__: null };
    const availabilityInfo =
    availabilityInfoCache[featureName] ??=
    calculateAvailabilityInfo(family, engineFeatureObj => engineFeatureObj.includes(featureName));
    return availabilityInfo;
};

export function getDescription(compatibilities, compatibilityIndex, appendPlus)
{
    const { tag, versions } = compatibilities[compatibilityIndex];
    const [firstVersion] = versions;
    let description = typeof firstVersion === 'string' ? firstVersion : firstVersion.from;
    if (isOldAndLatestVersion(versions))
    {
        if (typeof firstVersion !== 'string')
            description += `–${firstVersion.to}`;
        const lastVersion = versions.at(-1);
        description += ` and ${typeof lastVersion === 'string' ? lastVersion : lastVersion.from}`;
    }
    if (tag != null)
    {
        const taggableCompatibilities = compatibilities.slice(compatibilityIndex);
        const tags = taggableCompatibilities.map(({ tag }) => tag).filter(tag => tag != null);
        description += ` ${joinWithAnd(tags)}`;
    }
    if (appendPlus && !isLastVersion(compatibilities, compatibilityIndex))
        description += '+';
    return description;
}

function getLastVersionNumber(compatibilities, index)
{
    const { versions } = compatibilities.at(index);
    let version = versions.at(-1);
    if (typeof version !== 'string')
    {
        version = version.to;
        if (version !== null) return NaN;
    }
    return version;
}

function isLastVersion(compatibilities, compatibilityIndex)
{
    const versionNumber = getLastVersionNumber(compatibilities, compatibilityIndex);
    const lastVersionNumber = getLastVersionNumber(compatibilities, -1);
    const returnValue = versionNumber === lastVersionNumber;
    return returnValue;
}

function isOldAndLatestVersion(versions)
{
    if (versions.length === 1) return false;
    const lastVersion = versions.at(-1);
    return typeof lastVersion !== 'string' && lastVersion.to == null;
}

export function joinWithAnd(array)
{
    const returnValue = AND_FORMATTER.format(array);
    return returnValue;
}

export function joinWithOr(array)
{
    const returnValue = OR_FORMATTER.format(array);
    return returnValue;
}
