/* eslint-env browser */
/* global art */

import createButton     from './button';
import { setTabindex }  from './tabindex';

export default function showModalBox(content, callback)
{
    function close()
    {
        var body = document.body;
        body.removeChild(overlay);
        art(body, art.off('keydown', handleKeydown), art.off('focus', handleFocus, true));
        if (callback !== undefined)
            callback();
    }

    function grabFocus()
    {
        focusableContainer.focus();
    }

    function handleFocus(evt)
    {
        if (!focusableContainer.contains(evt.target))
            grabFocus();
    }

    function handleKeydown(evt)
    {
        var keyCode = evt.keyCode;
        if (keyCode === 13 || keyCode === 27) // Enter, Esc
        {
            var activeElement = document.activeElement;
            if (activeElement.contains(focusableContainer) || !activeElement.contains(evt.target))
            {
                close();
                evt.preventDefault();
            }
        }
    }

    var BOX_BORDER_RADIUS   = 23;
    var BOX_MARGIN          = 2;

    var focusableContainer =
    art
    (
        'DIV',
        {
            style:
            {
                borderRadius:   BOX_BORDER_RADIUS + BOX_MARGIN + 'px',
                display:        'inline-block',
                maxWidth:       '500px',
                width:          '100%',
            },
        },
        setTabindex,
        art
        (
            'DIV',
            {
                className: 'focusable',
                id: 'modalBox',
                style:
                {
                    background:     'whitesmoke',
                    border:         '10px solid blue',
                    borderRadius:   BOX_BORDER_RADIUS + 'px',
                    margin:         BOX_MARGIN + 'px',
                },
            },
            art
            (
                'DIV',
                { style: { margin: '1.5em 1.5em .25em', overflow: 'hidden' } },
                content,
                art
                (
                    'DIV',
                    { style: { margin: '1.25em 0' } },
                    art
                    (
                        createButton('OK'),
                        { style: { maxWidth: '5em', width: '100%' } },
                        art.on('click', close)
                    )
                )
            )
        )
    );
    var overlay =
    art
    (
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
                width:      '100%',
            },
        },
        art
        (
            'DIV',
            { style: { display: 'table', tableLayout: 'fixed', width: '100%', height: '100%' } },
            art
            (
                'DIV',
                { style: { display: 'table-cell', verticalAlign: 'middle' } },
                focusableContainer
            )
        )
    );
    art
    (document.body, overlay, art.on('focus', handleFocus, true), art.on('keydown', handleKeydown));
    setTimeout(grabFocus);
}

art.css('#modalBox p:first-child', { 'margin-top': '0' });
art.css('#modalBox p:last-child', { 'margin-bottom': '0' });
