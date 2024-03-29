/* eslint-env browser */
/*
global
JScrewIt,
MochaBar,
forcedStrictModeFeatureObj,
mocha,
padLeft,
padRight,
repeat,
showFeatureSupport,
*/

'use strict';

(function ()
{
    function addBarButtons()
    {
        function addBarButton(caption, onclick)
        {
            var button = bar.appendChild(document.createElement('BUTTON'));
            button.textContent = caption;
            button.onclick = onclick;
        }

        var bar = document.querySelector('#buttonBar');
        if (bar)
        {
            var outputWindow;
            addBarButton
            (
                'View lengths',
                function ()
                {
                    if (outputWindow)
                        outputWindow.close();
                    outputWindow = popup('', 'outputWindow', 184, 300);
                    // Chrome won't always bring the new popup to the front automatically, so we
                    // better take care of that.
                    outputWindow.focus();
                    var outputDocument = outputWindow.document;
                    outputDocument.title = 'JScrewIt Encoding Lengths';
                    var outputBody = outputDocument.body;
                    outputBody.textContent = createOutput(['DEFAULT', 'AUTO']);
                    var outputBodyStyle = outputBody.style;
                    outputBodyStyle.font = '12px "Courier New",Monaco,monospace';
                    outputBodyStyle.margin = '8px 20px';
                    outputBodyStyle.whiteSpace = 'pre';
                }
            );
            var extremeTestWindow;
            addBarButton
            (
                'Extreme test',
                function ()
                {
                    // Workaraoud for Android bug
                    // https://code.google.com/p/android/issues/detail?id=21061
                    if (!extremeTestWindow || extremeTestWindow.closed !== false)
                    {
                        extremeTestWindow =
                        popup('extreme-test.html', 'extremeTestWindow', 600, 600);
                    }
                    extremeTestWindow.focus();
                }
            );
        }
    }

    function addFeatureLists()
    {
        var info = document.querySelector('#featureList');
        anyDaggers = false;
        showFeatureSupport(listFeatures.bind(null, info));
        var notice;
        var dedicatedWorkerFeature = workerFeatureData.Worker;
        var sharedWorkerFeature = workerFeatureData.SharedWorker;
        if (dedicatedWorkerFeature)
        {
            if (sharedWorkerFeature)
                notice = 'Dedicated workers and shared workers are supported.';
            else if (sharedWorkerFeature === null)
            {
                notice =
                'Dedicated workers are supported; shared workers are also supported, but not ' +
                'right here.';
            }
            else
                notice = 'Dedicated workers are supported, but shared workers are not.';
        }
        else if (dedicatedWorkerFeature === null)
        {
            if (sharedWorkerFeature)
            {
                notice =
                'Dedicated workers are supported, but not right here; shared workers are ' +
                'supported.';
            }
            else if (sharedWorkerFeature === null)
                notice = 'Dedicated workers and shared workers are supported, but not right here.';
            else
            {
                notice =
                'Dedicated workers are supported, but not right here; shared workers are not ' +
                'supported.';
            }
        }
        else
        {
            if (sharedWorkerFeature)
                notice = 'Dedicated workers are not supported, but shared workers are.';
            else if (sharedWorkerFeature === null)
            {
                notice =
                'Dedicated workers are not supported; shared workers are supported, but not ' +
                'right here.';
            }
            else
                notice = 'Dedicated workers and shared workers are not supported.';
        }
        if (dedicatedWorkerFeature || sharedWorkerFeature)
            notice += ' Features with the marker “*” are excluded inside web workers.';
        if (anyDaggers)
            notice += ' Features with the marker “†” are excluded when strict mode is enforced.';
        info.appendChild(document.createElement('I')).textContent = notice;
    }

    function createOutput(compatibilities)
    {
        function appendLengths(name, input)
        {
            result += '\n' + padRight(name, 4);
            compatibilities.forEach
            (
                function (compatibility)
                {
                    var content;
                    var options = { features: compatibility, runAs: 'none' };
                    try
                    {
                        content = JScrewIt.encode(input, options).length;
                    }
                    catch (error)
                    {
                        content = 'ERROR';
                    }
                    result += padLeft(content, 8);
                }
            );
        }

        function appendLengthsRange(min, max, namer)
        {
            namer =
            namer ||
            function ()
            {
                return '`' + String.fromCharCode(charCode) + '`';
            };
            for (var charCode = min; charCode <= max; ++charCode)
            {
                var name = namer(charCode);
                var char = String.fromCharCode(charCode);
                appendLengths(name, char);
            }
        }

        var result = '     ';
        compatibilities.forEach
        (
            function (compatibility)
            {
                result += padBoth(compatibility, 8);
            }
        );
        result = result.replace(/ +$/, '');
        result += '\n    ' + repeat(' -------', compatibilities.length);
        var C0_CONTROL_CODE_NAMES =
        [
            'NUL',  'SOH',  'STX',  'ETX',  'EOT',  'ENQ',  'ACK',  'BEL',
            'BS',   'HT',   'LF',   'VT',   'FF',   'CR',   'SO',   'SI',
            'DLE',  'DC1',  'DC2',  'DC3',  'DC4',  'NAK',  'SYN',  'ETB',
            'CAN',  'EM',   'SUB',  'ESC',  'FS',   'GS',   'RS',   'US',
        ];
        appendLengthsRange
        (
            0,
            31,
            function (charCode)
            {
                return C0_CONTROL_CODE_NAMES[charCode];
            }
        );
        appendLengthsRange(32, 126);
        appendLengths('DEL', '\x7f');
        var C1_CONTROL_CODE_NAMES =
        [
            'PAD',  'HOP',  'BPH',  'NBH',  'IND',  'NEL',  'SSA',  'ESA',
            'HTS',  'HTJ',  'VTS',  'PLD',  'PLU',  'RI',   'SS2',  'SS3',
            'DCS',  'PU1',  'PU2',  'STS',  'CCH',  'MW',   'SPA',  'EPA',
            'SOS',  'SGCI', 'SCI',  'CSI',  'ST',   'OSC',  'PM',   'APC',
        ];
        appendLengthsRange
        (
            128,
            159,
            function (charCode)
            {
                return C1_CONTROL_CODE_NAMES[charCode - 0x80];
            }
        );
        appendLengths('NBSP', '\xa0');
        appendLengthsRange(161, 172);
        appendLengths('SHY', '\xad');
        appendLengthsRange(174, 255);
        appendLengths('`∟`', '∟');
        appendLengths('`♥`', '♥');
        appendLengths('A…Z', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        return result;
    }

    function handleLoad()
    {
        if (!--waitCount)
            handleLoadAndWorkerMessage();
    }

    function handleLoadAndWorkerMessage()
    {
        addFeatureLists();
        addBarButtons();
        var runner = mocha.run();
        runner.on
        (
            'fail',
            function ()
            {
                if (runner.failures === 1)
                    setFavicon('favicon-fail.ico');
            }
        );
        runner.on
        (
            'end',
            function ()
            {
                if (!runner.failures)
                    setFavicon('favicon-pass.ico');
            }
        );
    }

    function initWorker(constructorName)
    {
        function handleWorkerMessage(evt)
        {
            var data = evt.data;
            if (data)
                workerFeatureData[constructorName] = JScrewIt.Feature(data);
            if (!--waitCount)
                handleLoadAndWorkerMessage();
        }

        if (!(constructorName in self))
            return false;
        workerFeatureData[constructorName] = null;
        var worker;
        try
        {
            worker = new self[constructorName]('./feature-info-worker.js');
        }
        catch (error)
        {
            return false;
        }
        var target = 'port' in worker ? worker.port : worker;
        worker.onerror = target.onmessage = handleWorkerMessage;
        return true;
    }

    function listFeatures(info, label, featureNames, isCategoryMarked)
    {
        var Feature = JScrewIt.Feature;
        var webWorkerFeatureObj;
        var dedicatedWorkerFeatureObj = workerFeatureData.Worker;
        var sharedWorkerFeatureObj = workerFeatureData.SharedWorker;
        if (dedicatedWorkerFeatureObj && sharedWorkerFeatureObj)
        {
            webWorkerFeatureObj =
            Feature.commonOf(dedicatedWorkerFeatureObj, sharedWorkerFeatureObj);
        }
        else if (dedicatedWorkerFeatureObj)
            webWorkerFeatureObj = dedicatedWorkerFeatureObj;
        else if (sharedWorkerFeatureObj)
            webWorkerFeatureObj = sharedWorkerFeatureObj;
        if (featureNames.length)
        {
            var div = info.appendChild(document.createElement('DIV'));
            div.textContent = label;
            var span;
            featureNames.forEach
            (
                function (featureName, index)
                {
                    function addMarker(marker, environment, environmentFeatureObj)
                    {
                        var marked =
                        isCategoryMarked(featureName, environment, environmentFeatureObj);
                        if (marked)
                            span.appendChild(document.createTextNode(marker));
                        return marked;
                    }

                    if (index)
                    {
                        span.appendChild(document.createTextNode(','));
                        div.appendChild(document.createTextNode(' '));
                    }
                    span = div.appendChild(document.createElement('SPAN'));
                    var code =
                    span.appendChild(document.createElement('SPAN')).appendChild
                    (document.createElement('CODE'));
                    var featureDescription = Feature.descriptionFor(featureName);
                    code.textContent = featureName;
                    code.title = featureDescription;
                    if (webWorkerFeatureObj)
                        addMarker('*', 'web-worker', webWorkerFeatureObj);
                    anyDaggers |= addMarker('†', 'forced-strict-mode', forcedStrictModeFeatureObj);
                }
            );
        }
    }

    function padBoth(str, length)
    {
        str = String(str);
        var result = padRight(padLeft(str, length + str.length >> 1), length);
        return result;
    }

    function popup(url, name, width, height)
    {
        var left = screenX + 50;
        var top = screenY + 50;
        var features =
        'resizable,scrollbars,width=' + width + ',height=' + height + ',left=' + left + ',top=' +
        top;
        var window = open(url, name, features);
        return window;
    }

    function setFavicon(href)
    {
        document.querySelector('link[rel="icon"]').href = href;
    }

    // In Internet Explorer 10, Mocha will occasionally set the globals $0, $1, $2, $3 and $4 and
    // recognize them as leaked while running unit tests.
    mocha.setup
    ({ globals: ['$0', '$1', '$2', '$3', '$4'], reporter: MochaBar, timeout: 20000, ui: 'ebdd' });
    mocha.checkLeaks();
    addEventListener('load', handleLoad);
    var anyDaggers;
    var workerFeatureData = { };
    var waitCount = 1 + initWorker('Worker') + initWorker('SharedWorker');
}
)();
