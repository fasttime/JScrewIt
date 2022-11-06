import { Feature } from '../../lib/jscrewit.js';

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
    availabilityInfoCache[featureName] ||=
    calculateAvailabilityInfo(family, engineFeatureObj => engineFeatureObj.includes(featureName));
    return availabilityInfo;
};

export function getDescription(compatibilities, compatibilityIndex, appendPlus)
{
    const { tag, version } = compatibilities[compatibilityIndex];
    let description = typeof version === 'string' ? version : version.from;
    if (tag != null)
        description += ` ${tag}`;
    if (appendPlus && !isLastVersion(compatibilities, compatibilityIndex))
        description += '+';
    return description;
}

function isLastVersion(compatibilities, index)
{
    const { version } = compatibilities[index];
    if (typeof version !== 'string')
        return false;
    const lastVersion = compatibilities.at(-1).version;
    const returnValue = version === lastVersion;
    return returnValue;
}
