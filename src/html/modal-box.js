/* eslint-env browser */
/* global art */

function showModalBox(content, callback)
{
    'use strict';
    
    function close()
    {
        var body = document.body;
        body.removeChild(overlay);
        art(
            body,
            art.off('keydown', handleKeydown),
            art.off('focus', handleFocus, true)
        );
        if (callback !== void 0)
            callback();
    }
    
    function grabFocus()
    {
        box.focus();
    }
    
    function handleFocus(evt)
    {
        if (!box.contains(evt.target))
            grabFocus();
    }
    
    function handleKeydown(evt)
    {
        var keyCode = evt.keyCode;
        if (
            (keyCode === 13 || keyCode === 27) && // Enter, Esc
            !(evt.altKey || evt.ctrlKey || evt.metaKey || evt.shiftKey))
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
                id: 'modal-box',
                style:
                {
                    background:     'white',
                    border:         '10px solid blue',
                    borderRadius:   '20px',
                    display:        'inline-block',
                    maxWidth:       '500px',
                    outline:        'none',
                    padding:        '1em',
                    width:          '100%'
                },
                tabIndex: 0
            },
            art(
                'DIV',
                content,
                { style: { marginBottom: '1em', overflow: 'hidden' } }
            ),
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
    art(
        document.body,
        overlay,
        art.on('focus', handleFocus, true),
        art.on('keydown', handleKeydown)
    );
    setTimeout(grabFocus);
}

art.css('#modal-box:focus', { 'box-shadow': '0 0 0 3px rgba(255, 255, 255, .5)' });
