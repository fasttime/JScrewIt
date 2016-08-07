/* eslint-env browser */
/* global JScrewIt, art */

function createEngineSelectionBox()
{
    'use strict';
    
    var ENGINE_INFO_LIST =
    [
        {
            name: 'Chrome',
            versions:
            [
                { feature: 'CHROME45', number: '45+' }
            ]
        },
        {
            name: 'Edge',
            versions:
            [
                { feature: 'EDGE' }
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
            name: 'Internet Explorer',
            versions:
            [
                { feature: 'IE9', number: '9' },
                { feature: 'IE10', number: '10' },
                { feature: 'IE11', number: '11' },
                { feature: 'IE11_WIN10', number: '11 (W10)' }
            ]
        },
        {
            name: 'Safari',
            versions:
            [
                { feature: 'SAFARI70', number: '7.0' },
                { feature: 'SAFARI71', number: '7.1–8.0' },
                { feature: 'SAFARI90', number: '9.0' }
            ]
        },
        {
            name: 'Opera',
            versions:
            [
                { feature: 'CHROME45', number: '32+' }
            ]
        },
        {
            name: 'Android Browser',
            versions:
            [
                { feature: 'ANDRO40', number: '4.0' },
                { feature: 'ANDRO41', number: '4.1–4.3' },
                { feature: 'ANDRO44', number: '4.4' }
            ]
        },
        {
            name: 'Node.js',
            versions:
            [
                { feature: 'NODE010', number: '0.10' },
                { feature: 'NODE012', number: '0.12' },
                { feature: 'NODE40', number: '4+' },
            ]
        }
    ];
    
    function createCheckBox(text, inputProps)
    {
        var checkBox =
            art(
                'LABEL',
                art('INPUT', { style: { margin: '0 .25em 0 0' }, type: 'checkbox' }, inputProps),
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
    
    function handleAllEngineChange()
    {
        var checked = allEngineInput.checked;
        Array.prototype.forEach.call(
            engineVersionInputs,
            function (input)
            {
                input.checked = checked;
            }
        );
    }
    
    function handleAllEngineChangeAsync()
    {
        setTimeout(
            function ()
            {
                if (!allEngineInput.indeterminate)
                    handleAllEngineChange();
            }
        );
    }
    
    function init()
    {
        var allEngineField =
            art(
                createCheckBox('Select/deselect all'),
                { style: { display: 'inline-block', margin: '0 0 .5em' } },
                art.on('change', handleAllEngineChange),
                art.on(['keyup', 'mouseup'], handleAllEngineChangeAsync)
            );
        var engineFieldBox = art('TABLE', { style: { borderSpacing: '0', width: '100%' } });
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
                    allEngineField,
                    engineFieldBox,
                    art('HR'),
                    webWorkerField,
                    art.on('change', updateStatus)
                ),
                {
                    get featureObj()
                    {
                        return currentFeatureObj;
                    }
                }
            );
        ENGINE_INFO_LIST.forEach(
            function (engineInfo, engineIndex)
            {
                var versions = engineInfo.versions;
                var engineField;
                var engineFieldProps = engineIndex & 1 ? { className: 'engineFieldEven' } : null;
                var rowSpan = (versions.length + 2) / 3 ^ 0;
                var cellCount = rowSpan * 3;
                for (var versionIndex = 0; versionIndex < cellCount; ++versionIndex)
                {
                    var version = versions[versionIndex];
                    if (!(versionIndex % 3))
                    {
                        engineField = art('TR', engineFieldProps);
                        if (!versionIndex)
                        {
                            art(
                                engineField,
                                art(
                                    'TD',
                                    { rowSpan: rowSpan, style: { padding: '0 .5em 0 0' } },
                                    engineInfo.name
                                )
                            );
                        }
                        art(engineFieldBox, engineField);
                    }
                    var versionCheckBox =
                        version ?
                        createCheckBox(
                            version.number,
                            { checked: true, feature: version.feature }
                        ) :
                        null;
                    art(
                        engineField,
                        art(
                            'TD',
                            { style: { padding: '0 0 0 .5em', width: '6em' } },
                            versionCheckBox
                        )
                    );
                }
            }
        );
        allEngineInput = allEngineField.querySelector('INPUT');
        engineVersionInputs = engineFieldBox.querySelectorAll('INPUT');
        webWorkerInput = webWorkerField.querySelector('INPUT');
        updateCurrentFeatureObj();
    }
    
    function updateCurrentFeatureObj()
    {
        var Feature = JScrewIt.Feature;
        var featureObjs =
            Array.prototype.filter.call(
                engineVersionInputs,
                function (input)
                {
                    return input.checked;
                }
            ).map(
                function (input)
                {
                    ++checkedCount;
                    return Feature[input.feature];
                }
            );
        var checkedCount = featureObjs.length;
        allEngineInput.checked = checkedCount;
        allEngineInput.indeterminate = checkedCount && checkedCount < engineVersionInputs.length;
        currentFeatureObj = Feature.commonOf.apply(null, featureObjs) || Feature.DEFAULT;
        if (webWorkerInput.checked)
            currentFeatureObj = currentFeatureObj.restrict('web-worker', featureObjs);
    }
    
    function updateStatus()
    {
        updateCurrentFeatureObj();
        dispatchInputEvent();
    }
    
    var allEngineInput;
    var comp;
    var currentFeatureObj;
    var engineVersionInputs;
    var webWorkerInput;
    
    init();
    return comp;
}
