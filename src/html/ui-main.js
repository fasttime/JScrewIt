/*
global
alert,
compMenu,
controls,
createEngineSelectionBox,
createRoll,
encodeButton,
inputArea,
JScrewIt,
outputArea,
run,
stats,
wrapWithCallBox
*/
/* jshint browser: true */

(function ()
{
'use strict';

function createWorker()
{
    if (typeof Worker !== 'undefined')
    {
        try
        {
            worker = new Worker('html/worker.js');
        }
        catch (error)
        { }
    }
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
        updateError(error + '');
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
        queuedData = data;
    }
    else
    {
        worker.postMessage(data);
        resetOutput();
        setWaitingForWorker(true);
    }
    inputArea.onkeyup = null;
}

function getOptions()
{
    var compatibility = compMenu.options[compMenu.selectedIndex].value;
    var features =
        compatibility ?
        JScrewIt.commonFeaturesOf(compatibility) :
        engineSelectionBox.features;
    var wrapWith = wrapWithCallBox.checked ? 'call' : 'none';
    var options = { features: features, wrapWith: wrapWith };
    return options;
}

function handleInputAreaKeyUp(evt)
{
    if (evt.key !== 'Tab')
    {
        encodeAsync();
    }
}

function handleRunClick()
{
    var value;
    try
    {
        value = eval(outputArea.value);
    }
    catch (error)
    {
        alert(error);
        return false;
    }
    if (typeof value === 'string')
    {
        alert('"' + value + '"');
    }
    return false;
}

function handleWorkerMessage(evt)
{
    if (queuedData)
    {
        worker.postMessage(queuedData);
        queuedData = null;
    }
    else
    {
        var data = evt.data;
        var error = data.error;
        if (error)
        {
            updateError(data.error);
        }
        else
        {
            updateOutput(data.output);
        }
        setWaitingForWorker(false);
    }
}

function init()
{
    inputArea.value = inputArea.defaultValue;
    wrapWithCallBox.checked = wrapWithCallBox.defaultChecked;
    outputArea.oninput = updateStats;
    run.onclick = handleRunClick;
    roll = controls.appendChild(createRoll());
    var container = roll.appendChild(document.createElement('DIV'));
    container.className = 'frame';
    container.appendChild(document.createElement('SPAN')).textContent =
        'Custom Compatibility Selection';
    engineSelectionBox = container.appendChild(createEngineSelectionBox());
    engineSelectionBox.className = 'engineSelectionBox';
    var changeHandler;
    if (worker)
    {
        encodeButton.parentNode.removeChild(encodeButton);
        changeHandler = encodeAsync;
        worker.onmessage = handleWorkerMessage;
        encodeAsync();
    }
    else
    {
        encodeButton.onclick = encode;
        changeHandler = noEncode;
        outputArea.value = '';
    }
    inputArea.oninput = changeHandler;
    wrapWithCallBox.onchange = changeHandler;
    compMenu.selectedIndex = compMenu.previousIndex = 0;
    var compMenuHandler =
        function ()
        {
            var selectedIndex = compMenu.selectedIndex;
            if (selectedIndex !== compMenu.previousIndex)
            {
                compMenu.previousIndex = selectedIndex;
                changeHandler();
                var compatibility = compMenu.options[compMenu.selectedIndex].value;
                roll.rollTo(compatibility ? 0 : 1);
            }
        };
    compMenu.onchange = compMenuHandler;
    // Firefox does not always trigger a change event when an option is selected using the keyboard;
    // we must handle keydown events asynchronously, too.
    compMenu.onkeydown = setTimeout.bind(null, compMenuHandler);
    engineSelectionBox.addEventListener('change', changeHandler);
    if (inputArea.createTextRange)
    {
        var range = inputArea.createTextRange();
        range.move('textedit', 1);
        range.select();
    }
    else
    {
        inputArea.setSelectionRange(0x7fffffff, 0x7fffffff);
    }
    inputArea.focus();
}

function noEncode()
{
    if (outputSet)
    {
        updateStats(true);
    }
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
    alert(error);
}

function updateOutput(output)
{
    outputArea.value = output;
    updateStats();
}

function updateStats(outOfSync)
{
    var length = outputArea.value.length;
    var html = length === 1 ? '1 char' : length + ' chars';
    if (outOfSync)
    {
        if (worker)
        {
            inputArea.onkeyup = handleInputAreaKeyUp;
        }
        html += ' – <i>out of sync</i>';
    }
    outputSet = true;
    stats.innerHTML = html;
}

var engineSelectionBox;
var outputSet;
var queuedData;
var roll;
var waitingForWorker;
var worker;

window.onload = init;
createWorker();

})();
