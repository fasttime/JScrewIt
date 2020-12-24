/* eslint-env browser */
/*
global
JScrewIt,
compMenu,
controls,
formatValue,
formatValueType,
inputArea,
outputArea,
stats,
*/

import './result-format';

import art                      from '../../.tmp-out/art';
import WORKER_SRC               from '../../.tmp-out/worker';
import createButton             from './button';
import createEngineSelectionBox from './engine-selection-box';
import showModalBox             from './modal-box';
import createRoll               from './roll';

var JS_MIME_TYPE = 'application/javascript';

function createWorker()
{
    worker = new Worker(workerURL);
    worker.onmessage = handleWorkerMessage;
}

function destroyWorkerURL()
{
    URL.revokeObjectURL(workerURL);
    workerURL = undefined;
}

function encode()
{
    var output;
    var options = getOptions();
    try
    {
        output = JScrewIt.encode(inputArea.value, options);
    }
    catch (error)
    {
        resetOutput();
        updateError(String(error));
        return;
    }
    updateOutput(output);
}

function encodeAsync()
{
    var options = getOptions();
    var data = { input: inputArea.value, options: options };
    if (waitingForWorker)
    {
        worker.terminate();
        createWorker();
        data.url = jscrewitURL;
    }
    worker.postMessage(data);
    resetOutput();
    setWaitingForWorker(true);
    inputArea.onkeyup = null;
}

function getOptions()
{
    var options = { features: currentFeature.canonicalNames };
    return options;
}

function handleCompInput()
{
    var selectedIndex = compMenu.selectedIndex;
    var compatibility = compMenu.options[selectedIndex].value;
    // If the option "Custom…" is not selected, the feature object can be determined directly from
    // the selected option; otherwise, it must be retrieved from the engineSelectionBox.
    var feature = compatibility ? Feature[compatibility] : engineSelectionBox.feature;
    if (outOfSync || !Feature.areEqual(feature, currentFeature))
    {
        currentFeature = feature;
        this();
    }
    if (selectedIndex !== compMenu.previousIndex)
    {
        compMenu.previousIndex = selectedIndex;
        roll.rollTo(+!compatibility);
    }
}

function handleInputAreaKeyUp(evt)
{
    if (evt.keyCode !== 9) // Tab
        encodeAsync();
}

function handleOutputAreaMouseDown(evt)
{
    if (ignoreRepeatedMainMouseButtonEvent(evt))
    {
        var outputLength = outputArea.value.length;
        if (outputArea.selectionStart !== 0 || outputArea.selectionEnd !== outputLength)
        {
            outputArea.selectionStart = 0;
            outputArea.selectionEnd = outputLength;
            if ('scrollTopMax' in outputArea) // Hack for Firefox
            {
                var scrollTop = outputArea.scrollTop;
                art
                (
                    outputArea,
                    art.on
                    (
                        'scroll',
                        function ()
                        {
                            outputArea.scrollTop = scrollTop;
                        },
                        { once: true }
                    )
                );
            }
        }
    }
}

function handleReaderLoadEnd()
{
    loadFileButton.disabled = false;
    var result = this.result;
    if (result != null)
        inputArea.value = result;
    inputArea.oninput();
    inputArea.disabled = false;
}

function handleRun()
{
    var content;
    var value;
    try
    {
        value = (0, eval)(outputArea.value);
    }
    catch (error)
    {
        content = art('P', String(error));
    }
    if (value !== undefined)
    {
        var text = formatValue(value);
        var valueType = formatValueType(value);
        if (text)
        {
            var intro =
            valueType ? 'Evaluation result is ' + valueType + ':' : 'Evaluation result is';
            content =
            art
            (
                'DIV',
                art('P', intro),
                art
                (
                    'P',
                    { style: { overflowX: 'auto' } },
                    art
                    (
                        'DIV',
                        {
                            style:
                            { display: 'inline-block', textAlign: 'left', whiteSpace: 'pre' },
                        },
                        text
                    )
                )
            );
        }
        else
            content = art('DIV', art('P', 'Evaluation result is ' + valueType + '.'));
    }
    if (content != null)
    {
        var runThisButton = this;
        showModalBox
        (
            content,
            function ()
            {
                runThisButton.focus();
            }
        );
    }
}

function handleWorkerMessage(evt)
{
    var data = evt.data;
    var error = data.error;
    if (error)
        updateError(error);
    else
        updateOutput(data.output);
    setWaitingForWorker(false);
}

function ignoreRepeatedMainMouseButtonEvent(evt)
{
    var repeated;
    var target = evt.target;
    if ('runtimeStyle' in target) // Hack for Internet Explorer
    {
        var lastMainMouseButtonEventTimeStamp = target.lastMainMouseButtonEventTimeStamp;
        var currentTimeStamp = evt.button === 0 ? evt.timeStamp : undefined;
        target.lastMainMouseButtonEventTimeStamp = currentTimeStamp;
        repeated = currentTimeStamp - lastMainMouseButtonEventTimeStamp <= 500;
    }
    else
        repeated = evt.detail >= 2 && evt.button === 0;
    if (repeated)
        evt.preventDefault();
    return repeated;
}

function init()
{
    document.querySelector('main>div').style.display = 'block';
    inputArea.value = inputArea.defaultValue;
    art
    (
        outputArea,
        art.on('mousedown', handleOutputAreaMouseDown),
        art.on('mouseup', ignoreRepeatedMainMouseButtonEvent),
        art.on('input', updateStats)
    );
    art
    (
        stats.parentNode,
        art
        (
            createButton('Run this'),
            { style: { bottom: '0', fontSize: '10pt', position: 'absolute', right: '0' } },
            art.on('click', handleRun)
        )
    );
    (function ()
    {
        var COMPACT = Feature.COMPACT;
        if (Feature.AUTO.includes(COMPACT))
            currentFeature = COMPACT;
        else
            currentFeature = Feature.BROWSER;
        compMenu.value = currentFeature.name;
        compMenu.previousIndex = compMenu.selectedIndex;
    }
    )();
    var changeHandler;
    if (worker)
    {
        changeHandler = encodeAsync;
        encodeAsync();
    }
    else
    {
        var encodeButton = art(createButton('Encode'), art.on('click', encode));
        art(controls, encodeButton);
        changeHandler = noEncode;
        outputArea.value = '';
    }
    if (typeof File !== 'undefined')
    {
        var loadFileInput =
        art
        (
            'INPUT',
            { accept: '.js', style: { display: 'none' }, type: 'file' },
            art.on('change', loadFile)
        );
        // In older Android Browser versions, HTMLElement objects don't have a "click" property;
        // HTMLInputElement objects do.
        var openLoadFileDialog = HTMLInputElement.prototype.click.bind(loadFileInput);
        loadFileButton =
        art(createButton('Load file…'), art.on('click', openLoadFileDialog));
        art(controls, loadFileButton, loadFileInput);
    }
    inputArea.oninput = changeHandler;
    var compHandler = handleCompInput.bind(changeHandler);
    art(compMenu, art.on('change', compHandler));
    engineSelectionBox = art(createEngineSelectionBox(), art.on('input', compHandler));
    roll = createRoll();
    art
    (
        roll.container,
        art
        (
            'DIV',
            { className: 'frame' },
            art('SPAN', 'Custom Compatibility Selection'),
            engineSelectionBox
        )
    );
    art(controls.parentNode, roll);
    inputArea.selectionStart = 0x7fffffff;
    inputArea.focus();
}

function initLater()
{
    document.addEventListener('DOMContentLoaded', init);
}

function loadFile()
{
    var file = this.files[0];
    if (file)
    {
        inputArea.disabled = true;
        inputArea.value = '';
        loadFileButton.disabled = true;
        var reader = new FileReader();
        reader.addEventListener('loadend', handleReaderLoadEnd);
        reader.readAsText(file);
    }
}

function noEncode()
{
    if (outputSet)
        updateStats(true);
}

function resetOutput()
{
    outputSet = false;
    outputArea.value = '';
    stats.textContent = '…';
}

function setWaitingForWorker(value)
{
    waitingForWorker = value;
    outputArea.disabled = value;
}

function updateError(error)
{
    showModalBox(art('P', error));
}

function updateOutput(output)
{
    outputArea.value = output;
    updateStats();
}

function updateStats(newOutOfSync)
{
    var length = outputArea.value.length;
    var html = length === 1 ? '1 char' : length + ' chars';
    outOfSync = !!newOutOfSync;
    if (newOutOfSync)
    {
        if (worker)
            inputArea.onkeyup = handleInputAreaKeyUp;
        html += ' – <i>out of sync</i>';
    }
    outputSet = true;
    stats.innerHTML = html;
}

var Feature = JScrewIt.Feature;

var currentFeature;
var engineSelectionBox;
var jscrewitURL;
var loadFileButton;
var outOfSync;
var outputSet;
var roll;
var waitingForWorker;
var worker;
var workerURL;

(function ()
{
    var request;
    try
    {
        request = new XMLHttpRequest();
        request.open('GET', 'lib/jscrewit.min.js', true);
    }
    catch (error)
    {
        request = undefined;
    }
    // In older versions of Safari, typeof Worker is "object".
    if (request && typeof Worker !== 'undefined')
    {
        workerURL = URL.createObjectURL(new Blob([WORKER_SRC], { type: JS_MIME_TYPE }));
        try
        {
            createWorker();
        }
        catch (error)
        {
            destroyWorkerURL();
        }
    }
    if (worker)
    {
        request.onerror =
        function ()
        {
            worker.terminate();
            worker = undefined;
            destroyWorkerURL();
        };
        request.onload =
        function ()
        {
            if (request.status < 400)
            {
                jscrewitURL = URL.createObjectURL(request.response);
                worker.postMessage({ url: jscrewitURL });
            }
            else
                this.onerror();
        };
        request.onloadend =
        function ()
        {
            if (document.readyState === 'loading')
                initLater();
            else
                init();
        };
        request.overrideMimeType(JS_MIME_TYPE);
        request.responseType = 'blob';
        request.send();
    }
    else
        initLater();
}
)();
