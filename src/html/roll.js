/* eslint-env browser */
/* global art */

function createRoll()
{
    function init()
    {
        var container = art('DIV');
        containerStyle = container.style;
        containerStyle.display = 'none';
        comp = art('DIV', container);
        comp.container = container;
        Object.defineProperty
        (comp, 'rollTo', { configurable: true, value: rollTo, writable: true });
        compStyle = comp.style;
        compStyle.height = '0';
        compStyle.overflowY = 'hidden';
    }

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
        compStyle.height = opening === 1 ? '' : comp.scrollHeight * opening + 'px';
        containerStyle.display = opening === 0 ? 'none' : '';
    }

    function rollTo(newEndOpening)
    {
        if (newEndOpening === opening)
            stop();
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
                interval = setInterval(progress, 0);
        }
    }

    function stop()
    {
        clearInterval(interval);
        interval = null;
        openSign = 0;
    }

    var comp;
    var compStyle;
    var containerStyle;
    var endOpening;
    var interval;
    var openSign = 0;
    var opening = 0;
    var startOpening;
    var startTime;

    init();
    return comp;
}
