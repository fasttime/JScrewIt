/* exported createEngineSelectionBox */
/* global JScrewIt */
/* jshint browser: true */

function createEngineSelectionBox()
{
    'use strict';
    
    var ENGINE_INFO_LIST =
    [
        {
            name: 'Firefox',
            versions:
            [
                { feature: 'FF30', number: '30' },
                { feature: 'FF31', number: '31+' }
            ]
        },
        {
            name: 'Chrome',
            versions:
            [
                { feature: 'CHROME35', number: '35 - 37' },
                { feature: 'CHROME38', number: '38+' }
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
            name: 'Safari',
            versions:
            [
                { feature: 'SAFARI70', number: '7.0' },
                { feature: 'SAFARI71', number: '7.1' },
                { feature: 'SAFARI71', number: '8.0', notForWebWorker: ['SELF_OBJECT'] }
            ]
        },
        {
            name: 'Opera',
            versions:
            [
                { feature: 'CHROME35', number: '22 - 24' },
                { feature: 'CHROME38', number: '25+' }
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
                { feature: 'ANDRO412', number: '4.1.x - 4.3.x' },
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
    
    function areEqualArrays(array1, array2)
    {
        var index = array1.length;
        if (index !== array2.length)
        {
            return false;
        }
        while (index--)
        {
            var item1 = array1[index];
            var item2 = array2[index];
            if (item1 !== item2)
            {
                return false;
            }
        }
        return true;
    }
    
    function createCheckBox(text, props)
    {
        var label = document.createElement('LABEL');
        var input = label.appendChild(document.createElement('INPUT'));
        input.type = 'checkbox';
        if (text)
        {
            label.appendChild(document.createTextNode(text));
        }
        for (var prop in props)
        {
            var value = props[prop];
            input[prop] = value;
        }
        return label;
    }
    
    function dispatchChangeEvent()
    {
        var evt = document.createEvent('Event');
        evt.initEvent('change', true, false);
        comp.dispatchEvent(evt);
    }
    
    function filterFeatures(features, excludedFeatures)
    {
        function putFeature(feature)
        {
            featureSet[feature] = true;
            JScrewIt.FEATURE_INFOS[feature].includes.forEach(putFeature);
        }
        
        var featureSet = { };
        features.forEach(putFeature);
        excludedFeatures.forEach(
            function (feature)
            {
                delete featureSet[feature];
            }
        );
        var result = JScrewIt.commonFeaturesOf.call(null, Object.keys(featureSet));
        return result;
    }
    
    function getFeatures()
    {
        var features = [];
        var allNotForWebWorker = ['DOMWINDOW', 'SELF', 'WINDOW'];
        Array.prototype.forEach.call(
            engineVersionInputs,
            function (input)
            {
                if (input.checked)
                {
                    var feature = input.feature;
                    features.push(feature);
                    var notForWebWorker = input.notForWebWorker;
                    Array.prototype.push.apply(allNotForWebWorker, notForWebWorker);
                }
            }
        );
        var commonFeatures = JScrewIt.commonFeaturesOf.apply(null, features) || [];
        if (webWorkerInput.checked)
        {
            commonFeatures = filterFeatures(commonFeatures, allNotForWebWorker);
        }
        return commonFeatures;
    }
    
    function init()
    {
        comp = document.createElement('FIELDSET');
        Object.defineProperty(
            comp,
            'features',
            { configurable: true, get: function () { return currentFeatures; } }
        );
        var container = comp.appendChild(document.createElement('DIV'));
        var engineFieldBox = container.appendChild(document.createElement('DIV'));
        engineFieldBox.style.display = 'table';
        ENGINE_INFO_LIST.forEach(
            function (engineInfo)
            {
                var engineField = engineFieldBox.appendChild(document.createElement('DIV'));
                engineField.style.display = 'table-row';
                var captionField = engineField.appendChild(document.createElement('DIV'));
                captionField.style.display = 'table-cell';
                captionField.textContent = engineInfo.name;
                engineInfo.versions.forEach(
                    function (version)
                    {
                        var versionField = engineField.appendChild(document.createElement('DIV'));
                        var style = versionField.style;
                        style.display = 'table-cell';
                        style.paddingLeft = '.5em';
                        style.minWidth = '6.5em';
                        versionField.appendChild(
                            createCheckBox(
                                version.number,
                                {
                                    checked: true,
                                    feature: version.feature,
                                    notForWebWorker: version.notForWebWorker
                                }
                            )
                        );
                    }
                );
            }
        );
        container.appendChild(document.createElement('HR'));
        var webWorkerField = container.appendChild(document.createElement('DIV'));
        webWorkerField.appendChild(createCheckBox('Support web workers', { }));
        container.addEventListener('change', updateStatus);
        engineVersionInputs = engineFieldBox.querySelectorAll('INPUT');
        webWorkerInput = webWorkerField.querySelector('INPUT');
        currentFeatures = getFeatures();
    }
    
    function updateStatus(evt)
    {
        var newFeatures = getFeatures();
        if (!areEqualArrays(currentFeatures, newFeatures))
        {
            currentFeatures = newFeatures;
            dispatchChangeEvent();
        }
        evt.stopPropagation();
    }
    
    var comp;
    var currentFeatures;
    var engineVersionInputs;
    var webWorkerInput;
    
    init();
    
    return comp;
}
