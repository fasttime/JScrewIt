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
            {
                if (firstAvail == null)
                    firstAvail = compatibilityIndex;
            }
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
    const availabilityInfoCache =
    availabilityInfoMap[family] ?? (availabilityInfoMap[family] = { __proto__: null });
    const availabilityInfo =
    availabilityInfoCache[featureName] ||
    (
        availabilityInfoCache[featureName] =
        calculateAvailabilityInfo
        (family, engineFeatureObj => engineFeatureObj.includes(featureName))
    );
    return availabilityInfo;
};

export function getDescription(compatibilities, compatibilityIndex, appendPlus)
{
    const { version } = compatibilities[compatibilityIndex];
    let description = version.value ?? version.from;
    const { tag } = version;
    if (tag != null)
        description += ` ${tag}`;
    if (appendPlus && !isLastVersion(compatibilities, compatibilityIndex))
        description += '+';
    return description;
}

function isLastVersion(compatibilities, index)
{
    const { value } = compatibilities[index].version;
    if (value == null)
        return false;
    const lastValue = compatibilities.at(-1).version.value;
    const returnValue = value === lastValue;
    return returnValue;
}
