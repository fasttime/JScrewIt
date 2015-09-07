/* global JScrewIt, TestSuite, mocha, padLeft, padRight, repeat, screenX, screenY */
/* jshint browser: true */

(function ()
{
    'use strict';
    
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
            addBarButton(
                'View lengths',
                function ()
                {
                    if (outputWindow)
                    {
                        outputWindow.close();
                    }
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
            addBarButton(
                'Extreme test',
                function ()
                {
                    // Workaraoud for Android bug
                    // https://code.google.com/p/android/issues/detail?id=21061
                    if (!extremeTestWindow || extremeTestWindow.closed !== false)
                    {
                        extremeTestWindow =
                            popup('ExtremeTest.html', 'extremeTestWindow', 600, 600);
                    }
                    extremeTestWindow.focus();
                }
            );
        }
    }
    
    function addFeatureLists()
    {
        var info = document.querySelector('#featureList');
        listFeatures(info, 'Available features: ', TestSuite.listFeatures(true));
        listFeatures(info, 'Emulated features: ', TestSuite.listFeatures(false));
    }
    
    function createOutput(compatibilities)
    {
        function appendLengths(name, input)
        {
            result += '\n' + padRight(name, 4);
            compatibilities.forEach(
                function (compatibility)
                {
                    var content;
                    try
                    {
                        content = JScrewIt.encode(input, { features: compatibility }).length;
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
        compatibilities.forEach(
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
            'CAN',  'EM',   'SUB',  'ESC',  'FS',   'GS',   'RS',   'US'
        ];
        appendLengthsRange(
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
            'SOS',  'SGCI', 'SCI',  'CSI',  'ST',   'OSC',  'PM',   'APC'
        ];
        appendLengthsRange(
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
        addFeatureLists();
        addBarButtons();
        var runner = mocha.run();
        runner.on(
            'fail',
            function ()
            {
                if (runner.failures === 1)
                {
                    setFavicon('favicon-fail.ico');
                }
            }
        );
        runner.on(
            'end',
            function ()
            {
                if (!runner.failures)
                {
                    setFavicon('favicon-pass.ico');
                }
            }
        );
    }
    
    function listFeatures(info, label, features)
    {
        if (features.length)
        {
            var div = info.appendChild(document.createElement('DIV'));
            div.textContent = label;
            var span;
            features.forEach(
                function (feature, index)
                {
                    if (index)
                    {
                        span.appendChild(document.createTextNode(','));
                        div.appendChild(document.createTextNode(' '));
                    }
                    span = div.appendChild(document.createElement('SPAN'));
                    var code =
                        span.appendChild(document.createElement('SPAN')).appendChild(
                            document.createElement('CODE')
                        );
                    code.textContent = feature;
                    code.title = JScrewIt.Feature[feature].description;
                }
            );
        }
    }
    
    function padBoth(str, length)
    {
        str += '';
        var result = padRight(padLeft(str, length + str.length >> 1), length);
        return result;
    }
    
    function popup(url, name, width, height)
    {
        var left = screenX + 50;
        var top = screenY + 50;
        var features =
            'resizable,scrollbars,width=' + width + ',height=' + height + ',left=' + left +
            ',top=' + top;
        var window = open(url, name, features);
        return window;
    }
    
    function setFavicon(href)
    {
        document.querySelector('link[rel="icon"]').href = href;
    }
    
    mocha.setup('bdd');
    mocha.checkLeaks();
    TestSuite.init();
    addEventListener('load', handleLoad);
}
)();
