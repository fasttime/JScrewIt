/* eslint-env browser */
/* global art */

function showModalBox(content, callback)
{
    'use strict';
    
    function close()
    {
        var body = document.body;
        body.removeChild(overlay);
        body.removeEventListener('keydown', handleKeydown);
        body.removeEventListener('focus', handleFocus, true);
        if (callback !== void 0)
            callback();
    }
    
    function handleFocus(evt)
    {
        if (!box.contains(evt.target))
            box.focus();
    }
    
    function handleKeydown(evt)
    {
        var keyCode = evt.keyCode;
        if (keyCode === 13 || keyCode === 27) // Enter, Esc
        {
            var activeElement = document.activeElement;
            if (activeElement.contains(box) || !activeElement.contains(evt.target))
            {
                close();
                evt.preventDefault();
            }
        }
    }
    
    var box =
        art(
            'DIV',
            {
                style:
                {
                    background:     'white',
                    border:         '.5em solid blue',
                    borderRadius:   '1em',
                    display:        'inline-block',
                    maxWidth:       '500px',
                    outline:        'none',
                    padding:        '1em',
                    width:          '100%'
                },
                tabIndex: 0
            },
            art('DIV', content, { style: { marginBottom: '1em' } }),
            art('BUTTON', 'Ok', art.on('click', close))
        );
    var overlay =
        art(
            'DIV',
            {
                style:
                {
                    background: 'rgba(0, 0, 0, .25)',
                    display:    'table',
                    position:   'fixed',
                    textAlign:  'center',
                    left:       '0',
                    top:        '0',
                    width:      '100%',
                    height:     '100%'
                }
            },
            art('DIV', { style: { display: 'table-cell', verticalAlign: 'middle' } }, box)
        );
    var body = document.body;
    body.addEventListener('focus', handleFocus, true);
    body.addEventListener('keydown', handleKeydown);
    art(body, overlay);
    setTimeout(
        function ()
        {
            box.focus();
        }
    );
}
