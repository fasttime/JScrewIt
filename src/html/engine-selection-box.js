/* eslint-env browser */
/* global JScrewIt, art, setTabindex, showModalBox */

function createEngineSelectionBox()
{
    'use strict';

    var ENGINE_INFO_LIST =
    [
        {
            name: 'Chrome',
            versions:
            [
                { feature: 'CHROME59', number: '59+' },
            ]
        },
        {
            name: 'Edge',
            versions:
            [
                { feature: 'EDGE40', number: '40+' },
            ]
        },
        {
            name: 'Firefox',
            versions:
            [
                { feature: 'FF54', number: '54+' },
            ]
        },
        {
            name: 'Internet Explorer',
            versions:
            [
                { feature: 'IE9', number: '9' },
                { feature: 'IE10', number: '10' },
                { feature: 'IE11', number: '11' },
                { feature: 'IE11_WIN10', number: '11 (W10)' },
            ]
        },
        {
            name: 'Safari',
            versions:
            [
                { feature: 'SAFARI70', number: '7.0' },
                { feature: 'SAFARI71', number: '7.1–8.0' },
                { feature: 'SAFARI90', number: '9.0' },
                { feature: 'SAFARI100', number: '10.0' },
            ]
        },
        {
            name: 'Opera',
            versions:
            [
                { feature: 'CHROME59', number: '46+' },
            ]
        },
        {
            name: 'Android Browser',
            versions:
            [
                { feature: 'ANDRO40', number: '4.0' },
                { feature: 'ANDRO41', number: '4.1–4.3' },
                { feature: 'ANDRO44', number: '4.4' },
            ]
        },
        {
            name: 'Node.js',
            versions:
            [
                { feature: 'NODE010', number: '0.10' },
                { feature: 'NODE012', number: '0.12' },
                { feature: 'NODE40', number: '4' },
                { feature: 'NODE50', number: '5+' }
            ]
        }
    ];

    var FORCED_STRICT_MODE_CAPTION = 'Generate strict mode code';

    var FORCED_STRICT_MODE_HELP =
        '<p>The option <dfn>' + FORCED_STRICT_MODE_CAPTION + '</dfn> instructs JScrewIt to avoid ' +
        'optimizations that don\'t work in strict mode JavaScript code. Check this option only ' +
        'if your environment disallows non-strict code. You may want to do this for example in ' +
        'one of the following circumstances.' +
        '<ul>' +
        '<li>To encode a string or a number and embed it in a JavaScript file in a place where ' +
        'strict mode code is expected, like in a scope containing a use strict directive or in a ' +
        'class body.' +
        '<li>To encode a script and run it in Node.js with the option <code>--use_strict</code>.' +
        '<li>To encode an ECMAScript module. Note that module support in JSFuck is <em>very</em> ' +
        'limited, as <code>import</code> and <code>export</code> statements don\'t work at all. ' +
        'If your module doesn\'t contain these statements, you can encode it using this option.' +
        '</ul>' +
        '<p>In most other cases, this option is not required, even if your script contains a top ' +
        'level <code>"use strict"</code> statement.';

    var WEB_WORKER_CAPTION = 'Support web workers';

    var WEB_WORKER_HELP =
        '<p>Web workers are part of a standard HTML technology used to perform background tasks ' +
        'in JavaScript.' +
        '<p>Check the option <dfn>' + WEB_WORKER_CAPTION + '</dfn> only if your code needs to ' +
        'run inside a web worker. To create or use a web worker in your code, this option is not ' +
        'required.';

    var QUESTION_MARK_SIZE = '10.5pt';

    function createCheckBox(text, inputProps)
    {
        var checkBox =
            art(
                'LABEL',
                art('INPUT', { style: { margin: '0 .25em 0 0' }, type: 'checkbox' }, inputProps),
                text
            );
        return checkBox;
    }

    function createQuestionMark(innerHTML)
    {
        function showHelp()
        {
            showModalBox(contentBlock);
        }

        var contentBlock = art('DIV', { className: 'help-text' });
        contentBlock.innerHTML = innerHTML;
        var questionMark =
            art(
                'SPAN',
                {
                    className: 'focusable',
                    style:
                    {
                        background:     'black',
                        borderRadius:   '1em',
                        color:          'white',
                        cursor:         'pointer',
                        display:        'inline-block',
                        fontSize:       '8pt',
                        fontWeight:     'bold',
                        lineHeight:     QUESTION_MARK_SIZE,
                        position:       'relative',
                        textAlign:      'center',
                        top:            '-1.5pt',
                        width:          QUESTION_MARK_SIZE,
                        height:         QUESTION_MARK_SIZE
                    },
                    title: 'Learn more…'
                },
                '?',
                setTabindex,
                art.on('click', showHelp)
            );
        return questionMark;
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
        var forcedStrictModeField = createCheckBox(FORCED_STRICT_MODE_CAPTION);
        var webWorkerField = createCheckBox(WEB_WORKER_CAPTION);
        comp =
            art(
                'FIELDSET',
                { className: 'engine-selection-box' },
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
                    art('DIV', webWorkerField, ' ', createQuestionMark(WEB_WORKER_HELP)),
                    art(
                        'DIV',
                        forcedStrictModeField,
                        ' ',
                        createQuestionMark(FORCED_STRICT_MODE_HELP)
                    ),
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
                var engineFieldProps = engineIndex & 1 ? { className: 'even-field' } : null;
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
        forcedStrictModeInput = forcedStrictModeField.querySelector('INPUT');
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
        if (forcedStrictModeInput.checked)
            currentFeatureObj = currentFeatureObj.restrict('forced-strict-mode', featureObjs);
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
    var forcedStrictModeInput;
    var webWorkerInput;

    init();
    return comp;
}

art.css('.engine-selection-box', { background: '#f0f0f0' });
art.css('.engine-selection-box .even-field', { background: '#fff' });
art.css('.help-text', { 'font-size': '11pt', 'text-align': 'justify' });
art.css('.help-text code', { 'white-space': 'pre' });
art.css('.help-text dfn', { 'font-style': 'normal', 'font-weight': 'bold' });
art.css('.help-text li', { 'margin': '.5em 0' });
