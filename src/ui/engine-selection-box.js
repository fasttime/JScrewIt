/* eslint-env browser */
/* global JScrewIt */

import art              from '../../.tmp-out/art';
import showModalBox     from './modal-box';
import { setTabindex }  from './tabindex';

export default function createEngineSelectionBox()
{
    var ENGINE_FAMILY_LIST =
    [
        'Chrome',
        'Edge',
        'Firefox',
        'Internet Explorer',
        'Safari',
        'Opera',
        'Android Browser',
        'Node.js',
    ];

    var FORCED_STRICT_MODE_CAPTION = 'Generate strict mode code';

    var FORCED_STRICT_MODE_HELP =
    '<p>The option <dfn>' + FORCED_STRICT_MODE_CAPTION + '</dfn> instructs JScrewIt to avoid ' +
    'optimizations that don\'t work in strict mode JavaScript code. Check this option only if ' +
    'your environment disallows non-strict code. You may want to do this for example in one of ' +
    'the following circumstances.' +
    '<ul>' +
    '<li>To encode a string or a number and embed it in a JavaScript file in a place where ' +
    'strict mode code is expected, like in a scope containing a <code>"use strict"</code> ' +
    'statement or in a class body.' +
    '<li>To encode a script and run it in Node.js with the option <code>--use_strict</code>.' +
    '<li>To encode an ECMAScript module. Note that module support in JSFuck is <em>very</em> ' +
    'limited, as <code>import</code> and <code>export</code> statements don\'t work at all. ' +
    'If your module doesn\'t contain these statements, you can encode it using this option.' +
    '</ul>' +
    '<p>In most other cases, this option is not required, not even to encode a script that ' +
    'contains a top level <code>"use strict"</code> statement.';

    var WEB_WORKER_CAPTION = 'Support web workers';

    var WEB_WORKER_HELP =
    '<p>Web workers are part of a standard HTML technology used to perform background tasks in ' +
    'JavaScript.' +
    '<p>Check the option <dfn>' + WEB_WORKER_CAPTION + '</dfn> only if your code needs to run ' +
    'inside a web worker. To create or use a web worker in your code, this option is not required.';

    var QUESTION_MARK_SIZE = '10.5pt';

    function createCheckBox(text, inputProps)
    {
        var checkBox =
        art
        (
            'LABEL',
            { style: { display: 'inline-table' } },
            art
            (
                'SPAN',
                { style: { display: 'table-cell', verticalAlign: 'middle' } },
                art('INPUT', { style: { margin: '0 .25em 0 0' }, type: 'checkbox' }, inputProps)
            ),
            art('SPAN', { style: { display: 'table-cell' } }, text)
        );
        return checkBox;
    }

    function createQuestionMark(innerHTML)
    {
        function showHelp()
        {
            showModalBox(contentBlock);
        }

        // Older Android Browser versions have problems in mixing elements with display style
        // 'inline-block' and 'inline-table' in the same line, so we'll stick to 'inline-table'
        // here.
        var DISPLAY_STYLE = 'inline-table';

        var contentBlock = art('DIV', { className: 'help-text' });
        contentBlock.innerHTML = innerHTML;
        var questionMark =
        art
        (
            'SPAN',
            {
                className:  'focusable',
                style:
                {
                    background:     'black',
                    borderRadius:   '1em',
                    color:          'white',
                    cursor:         'pointer',
                    display:        DISPLAY_STYLE,
                    fontSize:       '8pt',
                    fontWeight:     'bold',
                    lineHeight:     QUESTION_MARK_SIZE,
                    position:       'relative',
                    textAlign:      'center',
                    top:            '-1.5pt',
                    width:          QUESTION_MARK_SIZE,
                },
                title:      'Learn more…',
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
        Array.prototype.forEach.call
        (
            engineVersionInputs,
            function (input)
            {
                input.checked = checked;
            }
        );
    }

    function handleAllEngineChangeAsync()
    {
        setTimeout
        (
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
        art
        (
            createCheckBox('Select/deselect all'),
            { style: { margin: '0 0 .5em' } },
            art.on('change', handleAllEngineChange),
            art.on(['keyup', 'mouseup'], handleAllEngineChangeAsync)
        );
        var engineFieldBox = art('TABLE', { style: { borderSpacing: '0', width: '100%' } });
        var forcedStrictModeField = createCheckBox(FORCED_STRICT_MODE_CAPTION);
        var webWorkerField = createCheckBox(WEB_WORKER_CAPTION);
        comp =
        art
        (
            'FIELDSET',
            {
                className: 'engine-selection-box',
                get feature()
                {
                    return currentFeature;
                },
            },
            art
            (
                'DIV',
                art
                (
                    'P',
                    { style: { margin: '.25em 0 .75em' } },
                    'Select the engines you want your code to support.'
                ),
                allEngineField,
                engineFieldBox,
                art('HR'),
                art('DIV', webWorkerField, ' ', createQuestionMark(WEB_WORKER_HELP)),
                art('DIV', forcedStrictModeField, ' ', createQuestionMark(FORCED_STRICT_MODE_HELP)),
                art.on('change', updateStatus)
            )
        );
        ENGINE_FAMILY_LIST.forEach
        (
            function (family, familyIndex)
            {
                var compatibilities = JScrewIt.Feature.FAMILIES[family];
                var engineField;
                var engineFieldProps = familyIndex & 1 ? { className: 'even-field' } : null;
                var rowSpan = (compatibilities.length + 2) / 3 ^ 0;
                var cellCount = rowSpan * 3;
                for
                (var compatibilityIndex = 0; compatibilityIndex < cellCount; ++compatibilityIndex)
                {
                    var compatibility = compatibilities[compatibilityIndex];
                    if (!(compatibilityIndex % 3))
                    {
                        engineField = art('TR', engineFieldProps);
                        if (!compatibilityIndex)
                        {
                            art
                            (
                                engineField,
                                art
                                (
                                    'TD',
                                    { rowSpan: rowSpan, style: { padding: '0 .5em 0 0' } },
                                    family
                                )
                            );
                        }
                        art(engineFieldBox, engineField);
                    }
                    var versionCheckBox = null;
                    if (compatibility)
                    {
                        var version = compatibility.version;
                        if (typeof version !== 'string')
                        {
                            var from = version.from;
                            var to = version.to;
                            version = to == null ? from + '+' : from + '–' + to;
                        }
                        var shortTag = compatibility.shortTag;
                        if (shortTag != null)
                            version += ' (' + shortTag + ')';
                        versionCheckBox =
                        createCheckBox
                        (version, { checked: true, featureName: compatibility.featureName });
                    }
                    art
                    (
                        engineField,
                        art
                        ('TD', { style: { padding: '0 0 0 .5em', width: '6em' } }, versionCheckBox)
                    );
                }
            }
        );
        allEngineInput = allEngineField.querySelector('INPUT');
        engineVersionInputs = engineFieldBox.querySelectorAll('INPUT');
        forcedStrictModeInput = forcedStrictModeField.querySelector('INPUT');
        webWorkerInput = webWorkerField.querySelector('INPUT');
        updateCurrentFeature();
    }

    function updateCurrentFeature()
    {
        var Feature = JScrewIt.Feature;
        var features =
        Array.prototype.filter.call
        (
            engineVersionInputs,
            function (input)
            {
                return input.checked;
            }
        )
        .map
        (
            function (input)
            {
                ++checkedCount;
                return Feature[input.featureName];
            }
        );
        var checkedCount = features.length;
        allEngineInput.checked = checkedCount;
        allEngineInput.indeterminate = checkedCount && checkedCount < engineVersionInputs.length;
        currentFeature = Feature.commonOf.apply(null, features) || Feature.DEFAULT;
        if (webWorkerInput.checked)
            currentFeature = currentFeature.restrict('web-worker', features);
        if (forcedStrictModeInput.checked)
            currentFeature = currentFeature.restrict('forced-strict-mode', features);
    }

    function updateStatus()
    {
        updateCurrentFeature();
        dispatchInputEvent();
    }

    var allEngineInput;
    var comp;
    var currentFeature;
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
