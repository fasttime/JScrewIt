/* global art */
/* exported createRoll */
/* jshint browser: true */

function createRoll()
{
    'use strict';
    
    function progress()
    {
        var now = +new Date();
        var elapsed = now - startTime;
        opening = startOpening + elapsed * openSign / 250;
        if ((opening - endOpening) * openSign >= 0)
        {
            opening = endOpening;
            stop();
        }
        style.height = opening === 1 ? '' : comp.scrollHeight * opening + 'px';
    }
    
    function rollTo(newEndOpening)
    {
        if (newEndOpening === opening)
        {
            stop();
        }
        else
        {
            var newOpenSign = newEndOpening > opening ? 1 : -1;
            if (newOpenSign !== openSign)
            {
                startOpening = opening;
                startTime = +new Date();
                openSign = newOpenSign;
            }
            endOpening = newEndOpening;
            if (!interval)
            {
                interval = setInterval(progress, 0);
            }
        }
    }
    
    function stop()
    {
        clearInterval(interval);
        interval = null;
        openSign = 0;
    }
    
    var comp = art('DIV');
    Object.defineProperty(comp, 'rollTo', { configurable: true, value: rollTo, writable: true });
    var style = comp.style;
    style.height = '0';
    style.overflowY = 'hidden';
    var opening = 0;
    var openSign = 0;
    var startOpening;
    var endOpening;
    var startTime;
    var interval;
    
    return comp;
}
