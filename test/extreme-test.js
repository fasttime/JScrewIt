/* eslint no-alert: off, no-undef: off */
/* eslint-env browser */

(function ()
{
    'use strict';
    
    function A003314(n)
    {
        var log2 = binLog(n);
        var result = n * (log2 + 2) - (1 << log2 + 1);
        return result;
    }
    
    function binLog(n)
    {
        for (var result = 0; n >>= 1; ++result);
        return result;
    }
    
    function disableForm(disabled)
    {
        var elements = form.elements;
        var callback =
            function (element)
            {
                element.disabled = disabled;
            };
        Array.prototype.forEach.call(elements, callback);
        form.className = disabled ? 'disabled' : '';
    }
    
    function handleLoad()
    {
        form.addEventListener('submit', handleSubmit);
        Array.prototype.forEach.call(
            document.querySelectorAll('.label'),
            function (label)
            {
                var input = label.querySelector('input');
                label.addEventListener(
                    'mousedown',
                    function (evt)
                    {
                        if (evt.target !== input)
                        {
                            evt.preventDefault();
                            input.focus();
                        }
                    }
                );
            }
        );
    }
    
    function handleSubmit(evt)
    {
        evt.preventDefault();
        var maxGroupThresholdField = form.maxGroupThreshold;
        var groupingsField = form.groupings;
        var callDepthField = form.callDepth;
        var maxGroupThreshold = parseInt(maxGroupThresholdField.value, 10);
        var groupings = parseInt(groupingsField.value, 10);
        var callDepth = parseInt(callDepthField.value, 10);
        if (isNaN(maxGroupThreshold) || maxGroupThreshold < 10 || maxGroupThreshold > 1000000)
        {
            alert('First group threshold must be an integer between 10 and one million.');
            return;
        }
        if (isNaN(groupings) || groupings < 1 || groupings > 1000000)
        {
            alert('Groupings must be an integer between 1 and one million.');
            return;
        }
        var maxGroupings = Math.pow(2, maxGroupThreshold - 1);
        if (groupings > maxGroupings)
        {
            alert(
                'A first group threshold of ' + maxGroupThreshold + ' only allows for up to ' +
                maxGroupings + ' groupings.'
            );
            return;
        }
        if (isNaN(callDepth) || callDepth < 0)
        {
            alert('Call depth must be a non-negative integer.');
            return;
        }
        maxGroupThresholdField.value = maxGroupThreshold;
        groupingsField.value = groupings;
        callDepthField.value = callDepth;
        var call =
            function ()
            {
                return runExtremeTest(maxGroupThreshold, groupings);
            };
        for (var index = 0; index < callDepth; ++index)
            call = Function.prototype.call.bind(call);
        disableForm(true);
        setTimeout(
            function ()
            {
                var ok = call();
                disableForm(false);
                log(maxGroupThreshold, groupings, callDepth, ok);
            },
            12
        );
    }
    
    function log(maxGroupThreshold, groupings, callDepth, ok)
    {
        var html =
            (ok ? '<span class="success">Success</span>' : '<span class="failed">Failed</span>') +
            ': FGT ' + maxGroupThreshold + ', groupings ' + groupings + ', call depth ' + callDepth;
        logger.insertBefore(document.createElement('DIV'), logger.firstChild).innerHTML = html;
    }
    
    function randomString(length)
    {
        var str = '';
        for (var index = 0; index < length; ++index)
        {
            var digit = Math.random() < 0.5 & 1;
            str += digit;
        }
        return str;
    }
    
    function runExtremeTest(maxGroupThreshold, groupings)
    {
        var encoder = JScrewIt.debug.createEncoder();
        encoder.maxGroupThreshold = maxGroupThreshold;
        var length = maxGroupThreshold * groupings - A003314(groupings);
        var input = '\uEA5F' + randomString(length - 1);
        var legend = encoder.replaceString(input, false, true);
        var charIndexArrayStr = encoder.replaceFalseFreeArray(['']);
        var output = encoder.createDictEncoding(legend, charIndexArrayStr, NaN, 5, 3, true);
        try
        {
            var actual = eval(output);
            return actual === '\uEA5F';
        }
        catch (error)
        {
            return false;
        }
    }
    
    addEventListener('load', handleLoad);
}
)();

