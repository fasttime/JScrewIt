/* exported createEngineSelectionBox */
/* global art, JScrewIt */
/* jshint browser: true */

function createEngineSelectionBox()
{
    'use strict';
    
    var ENGINE_INFO_LIST =
    [
        {
            name: 'Chrome',
            versions:
            [
                { feature: 'CHROME41', number: '41+' }
            ]
        },
        {
            name: 'Internet Explorer',
            versions:
            [
                { feature: 'IE9', number: '9' },
                { feature: 'IE10', number: '10' },
                { feature: 'IE11', number: '11' }
            ]
        },
        {
            name: 'Firefox',
            versions:
            [
                { feature: 'FF31', number: '31+' }
            ]
        },
        {
            name: 'Safari',
            versions:
            [
                { feature: 'SAFARI70', number: '7.0' },
                { feature: 'SAFARI71', number: '7.1' },
                { feature: 'SAFARI71', number: '8.0', notForWebWorker: ['SELF_OBJ'] }
            ]
        },
        {
            name: 'Opera',
            versions:
            [
                { feature: 'CHROME41', number: '28+' }
            ]
        },
        {
            name: 'Microsoft Edge',
            versions:
            [
                { feature: 'EDGE' }
            ]
        },
        {
            name: 'Android Browser',
            versions:
            [
                { feature: 'ANDRO400', number: '4.0.x' },
                { feature: 'ANDRO412', number: '4.1.x–4.3.x' },
                { feature: 'ANDRO442', number: '4.4.x' }
            ]
        },
        {
            name: 'Node.js',
            versions:
            [
                { feature: 'NODE010', number: '0.10.x' },
                { feature: 'NODE012', number: '0.12.x' }
            ]
        }
    ];
    
    function createCheckBox(text, props)
    {
        var checkBox =
            art(
                'LABEL',
                art('INPUT', { style: { marginLeft: '0' }, type: 'checkbox' }, props),
                text || null
            );
        return checkBox;
    }
    
    function dispatchInputEvent()
    {
        var evt = document.createEvent('Event');
        evt.initEvent('input', true, false);
        comp.dispatchEvent(evt);
    }
    
    function filterFeatures(featureObj, excludedFeatures)
    {
        var featureNameSet = Object.create(null);
        featureObj.individualNames.forEach(
            function (featureName)
            {
                featureNameSet[featureName] = null;
            }
        );
        excludedFeatures.forEach(
            function (featureName)
            {
                delete featureNameSet[featureName];
            }
        );
        featureObj = JScrewIt.Feature(Object.keys(featureNameSet));
        return featureObj;
    }
    
    function updateCurrentFeatureObj()
    {
        var featureNames = [];
        var allNotForWebWorker =
            ['ANY_DOCUMENT', 'ANY_WINDOW', 'DOCUMENT', 'DOMWINDOW', 'HTMLDOCUMENT', 'WINDOW'];
        Array.prototype.forEach.call(
            engineVersionInputs,
            function (input)
            {
                if (input.checked)
                {
                    var featureName = input.feature;
                    featureNames.push(featureName);
                    var notForWebWorker = input.notForWebWorker;
                    Array.prototype.push.apply(allNotForWebWorker, notForWebWorker);
                }
            }
        );
        var Feature = JScrewIt.Feature;
        var commonFeatureObj = Feature.commonOf.apply(null, featureNames) || Feature.DEFAULT;
        if (webWorkerInput.checked)
        {
            commonFeatureObj = filterFeatures(commonFeatureObj, allNotForWebWorker);
        }
        currentFeatureObj = commonFeatureObj;
    }
    
    function init()
    {
        var engineFieldBox = art('DIV', { style: { display: 'table' } });
        var webWorkerField = createCheckBox('Support web workers');
        comp =
            art(
                'FIELDSET',
                art(
                    'DIV',
                    art(
                        'P',
                        { style: { margin: '.25em 0 .75em' } },
                        'Select the engines you want your code to support.'
                    ),
                    engineFieldBox,
                    art('HR'),
                    webWorkerField,
                    art.on('change', updateStatus)
                )
            );
        Object.defineProperty(
            comp,
            'featureObj',
            {
                configurable: true,
                get: function ()
                {
                    return currentFeatureObj;
                }
            }
        );
        ENGINE_INFO_LIST.forEach(
            function (engineInfo)
            {
                var engineField =
                    art(
                        'DIV',
                        { style: { display: 'table-row' } },
                        art(
                            'DIV',
                            { style: { display: 'table-cell', paddingRight: '.5em' } },
                            engineInfo.name
                        )
                    );
                art(engineFieldBox, engineField);
                engineInfo.versions.forEach(
                    function (version)
                    {
                        var versionField =
                            createCheckBox(
                                version.number,
                                {
                                    checked: true,
                                    feature: version.feature,
                                    notForWebWorker: version.notForWebWorker
                                }
                            );
                        var style = versionField.style;
                        style.display = 'table-cell';
                        style.paddingLeft = '.5em';
                        style.width = '7.5em';
                        art(engineField, versionField);
                    }
                );
            }
        );
        engineVersionInputs = engineFieldBox.querySelectorAll('INPUT');
        webWorkerInput = webWorkerField.querySelector('INPUT');
        updateCurrentFeatureObj();
    }
    
    function updateStatus()
    {
        updateCurrentFeatureObj();
        dispatchInputEvent();
    }
    
    var comp;
    var currentFeatureObj;
    var engineVersionInputs;
    var webWorkerInput;
    
    init();
    
    return comp;
}
