/*
global
alert,
art,
compMenu,
controls,
createEngineSelectionBox,
createRoll,
inputArea,
JScrewIt,
outputArea,
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
        var wrapWith = wrapWithCallBox.checked ? 'call' : 'none';
        var options = { features: currentFeatureObj.canonicalNames, wrapWith: wrapWith };
        return options;
    }
    
    function handleCompInput()
    {
        var selectedIndex = compMenu.selectedIndex;
        var compatibility = compMenu.options[selectedIndex].value;
        var Feature = JScrewIt.Feature;
        var featureObj =
            compatibility ? Feature[compatibility] : engineSelectionBox.featureObj;
        if (outOfSync || !Feature.areEqual(featureObj, currentFeatureObj))
        {
            currentFeatureObj = featureObj;
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
        if (evt.key !== 'Tab')
        {
            encodeAsync();
        }
    }
    
    function handleRun()
    {
        var value;
        try
        {
            value = eval(outputArea.value);
        }
        catch (error)
        {
            alert(error);
        }
        if (typeof value === 'string')
        {
            alert('"' + value + '"');
        }
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
        document.querySelector('body>*>div').style.display = 'block';
        inputArea.value = inputArea.defaultValue;
        wrapWithCallBox.checked = wrapWithCallBox.defaultChecked;
        outputArea.oninput = updateStats;
        art(
            stats.parentNode,
            art(
                'BUTTON',
                'Run this',
                { style: { float: 'right', fontSize: '10pt' } },
                art.on('click', handleRun)
            )
        );
        var changeHandler;
        var encodeButton = controls.querySelector('button');
        if (worker)
        {
            controls.removeChild(encodeButton);
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
        var compHandler = handleCompInput.bind(changeHandler);
        compMenu.onchange = compHandler;
        // Firefox does not always trigger a change event when an option is selected using the
        // keyboard; we must handle keydown events asynchronously, too.
        compMenu.onkeydown = setTimeout.bind(null, compHandler);
        engineSelectionBox =
            art(
                createEngineSelectionBox(),
                { className: 'engineSelectionBox' },
                art.on('input', compHandler)
            );
        roll = createRoll();
        art(
            roll.container,
            art(
                'DIV',
                { className: 'frame' },
                art('SPAN', 'Custom Compatibility Selection'),
                engineSelectionBox
            )
        );
        art(controls.parentNode, roll);
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
    
    function updateStats(newOutOfSync)
    {
        var length = outputArea.value.length;
        var html = length === 1 ? '1 char' : length + ' chars';
        outOfSync = !!newOutOfSync;
        if (newOutOfSync)
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
    
    var currentFeatureObj = JScrewIt.Feature.DEFAULT;
    var engineSelectionBox;
    var outOfSync;
    var outputSet;
    var queuedData;
    var roll;
    var waitingForWorker;
    var worker;
    
    document.addEventListener('DOMContentLoaded', init);
    createWorker();
}
)();
