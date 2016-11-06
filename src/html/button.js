/* eslint-env browser */
/* global art */

function createButton(text)
{
    'use strict';
    
    function deactivate()
    {
        button.className = 'button';
        art(document, art.off('mouseup', handleMouseUp), art.off('mouseout', handleMouseOut));
    }
    
    function filterClick(evt)
    {
        if (isDisabled())
            evt.stopPropagation();
    }
    
    function handleKeydown(evt)
    {
        if (evt.keyCode === 13) // Enter
        {
            button.click();
            evt.preventDefault();
        }
    }
    
    function handleKeyup(evt)
    {
        if (evt.keyCode === 32) // Space
        {
            button.click();
            evt.preventDefault();
        }
    }
    
    function handleMouseDown(evt)
    {
        if (evt.which === 1 && !isDisabled() && !/\bactive\b/.test(button.className))
        {
            button.className = 'active button';
            art(document, art.on('mouseup', handleMouseUp), art.on('mouseout', handleMouseOut));
        }
    }
    
    function handleMouseOut(evt)
    {
        var relatedTarget = evt.relatedTarget;
        if (!relatedTarget || relatedTarget === document.documentElement)
            deactivate();
    }
    
    function handleMouseUp(evt)
    {
        if (evt.which === 1)
            deactivate();
    }
    
    function isDisabled()
    {
        var value = !button.hasAttribute('tabindex');
        return value;
    }
    
    function makeUnselectable(element)
    {
        element.firstChild.setAttribute('unselectable', 'on');
    }
    
    function setTabindex()
    {
        button.setAttribute('tabindex', 0);
    }
    
    var button =
        art(
            'SPAN',
            { className: 'button' },
            art.on('click', filterClick, true),
            art.on('keydown', handleKeydown),
            art.on('keyup', handleKeyup),
            art('SPAN', text),
            art('SPAN')
        );
    setTabindex();
    if (button.msMatchesSelector)
        art(button, makeUnselectable, art.on('mousedown', handleMouseDown));
    Object.defineProperty(
        button,
        'disabled',
        {
            configurable: true,
            get: function ()
            {
                var value = isDisabled();
                return value;
            },
            set: function (value)
            {
                value = !!value;
                if (value !== isDisabled())
                {
                    // Make sure the class does change so a refresh is triggered in IE and Edge.
                    button.className = '';
                    if (value)
                    {
                        button.removeAttribute('tabindex');
                        deactivate();
                        button.blur();
                    }
                    else
                    {
                        setTabindex();
                        button.className = 'button';
                    }
                }
            }
        }
    );
    return button;
}

art.css(
    '.button',
    {
        background: '#e0e0e0',
        color:      '#212121',
        cursor:     'default',
        display:    'inline-block',
        outline:    'none',
        position:   'relative'
    }
);
art.css('.button, .button>:last-child', { 'border-radius': '.1em' });
art.css('.button.active, .button[tabindex]:active', { background: '#29b3e5' });
art.css(
    '.button.active>:first-child, .button[tabindex]:active>:first-child',
    { left: '.1em', top: '.1em' }
);
art.css(
    '.button.active>:last-child, .button[tabindex]:active>:last-child',
    { 'border-color': '#0088b6' }
);
art.css('.button:focus', { 'box-shadow': '0 0 2px 2px rgba(0, 127, 255, .75)' });
art.css('.button:not([tabindex])', { background: '#e9e9e9', color: '#707070' });
art.css('.button:not([tabindex])>:last-child', { 'border-color': '#bababa' });
art.css(
    '.button>:first-child',
    {
        display:                'inline-block',
        margin:                 '.15em .5em',
        position:               'relative',
        'user-select':          'none',
        '-moz-user-select':     'none',
        '-ms-user-select':      'none',
        '-webkit-user-select':  'none',
    }
);
art.css(
    '.button>:last-child',
    {
        'border-color': '#707070',
        'border-style': 'solid',
        'border-width': '1px',
        display:        'inline-block',
        position:       'absolute',
        left:           '0',
        right:          '0',
        top:            '0',
        bottom:         '0'
    }
);
art.css('.button[tabindex]:hover:not(.active):not(:active)', { background: '#a3f4ff' });
art.css(
    '.button[tabindex]:hover:not(.active):not(:active)>:last-child',
    { 'border-color': '#189fdd' }
);
