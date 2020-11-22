'use strict';

const { Feature } = require('../..');

function calculateAvailabilityInfo(engineEntry, filterFeature)
{
    let firstAvail;
    let firstUnavail;
    engineEntry.versions.forEach
    (
        ({ feature }, versionIndex) =>
        {
            const engineFeatureObj = Feature[feature];
            if (filterFeature(engineFeatureObj))
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

exports.calculateAvailabilityInfo = calculateAvailabilityInfo;

exports.getAvailabilityByFeature =
(featureName, engineEntry) =>
{
    const availabilityInfoCache =
    engineEntry.availabilityInfoCache || (engineEntry.availabilityInfoCache = { __proto__: null });
    const availabilityInfo =
    availabilityInfoCache[featureName] ||
    (
        availabilityInfoCache[featureName] =
        calculateAvailabilityInfo
        (engineEntry, engineFeatureObj => engineFeatureObj.includes(featureName))
    );
    return availabilityInfo;
};

exports.getEngineEntries =
() =>
{
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
                { description: '13+', feature: 'SAFARI_13' },
                { description: '14.0.1+', feature: 'SAFARI_14_0_1' },
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
                { description: '13+', feature: 'NODE_13' },
                { description: '15+', feature: 'NODE_15' },
            ],
        },
    ];

    return ENGINE_ENTRIES;
};
