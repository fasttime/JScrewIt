/* eslint-env browser */
/* global art */

function showModalBox(content, callback)
{
    'use strict';
    
    function close()
    {
        var body = document.body;
        body.removeChild(overlay);
        art(body, art.off('keydown', handleKeydown), art.off('focus', handleFocus, true));
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
                    margin:         '3px',
                    outline:        'none'
                },
                tabIndex: 0
            },
            art(
                'DIV',
                { style: { margin: '1.5em 1.5em .25em', overflow: 'hidden' } },
                content,
                art(
                    'DIV',
                    { style: { margin: '1.25em 0' } },
                    art(
                        'SPAN',
                        { style: { background: 'buttonface' } },
                        art(
                            'BUTTON',
                            { style: { maxWidth: '5em', width: '100%' } },
                            'OK',
                            art.on('click', close)
                        )
                    )
                )
            )
        );
    var overlay =
        art(
            'DIV',
            {
                style:
                {
                    background: 'rgba(0, 0, 0, .25)',
                    overflow:   'auto',
                    position:   'fixed',
                    textAlign:  'center',
                    left:       '0',
                    top:        '0',
                    bottom:     '0',
                    width:      '100%'
                }
            },
            art(
                'DIV',
                {
                    style: { display: 'table', tableLayout: 'fixed', width: '100%', height: '100%' }
                },
                art(
                    'DIV',
                    { style: { display: 'table-cell', verticalAlign: 'middle' } },
                    art(
                        'DIV',
                        { style: { display: 'inline-block', maxWidth: '500px', width: '100%' } },
                        box
                    )
                )
            )
        );
    art(
        document.body,
        overlay,
        art.on('focus', handleFocus, true),
        art.on('keydown', handleKeydown)
    );
    setTimeout(grabFocus);
}

art.css('#modal-box p:first-child', { 'margin-top': '0' });
art.css('#modal-box p:last-child', { 'margin-bottom': '0' });
art.css('#modal-box:focus', { 'box-shadow': '0 0 3px 3px rgba(255, 255, 255, .75)' });
