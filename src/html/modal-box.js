/* eslint-env browser */
/* global art */

function showModalBox(content)
{
    'use strict';
    
    function close()
    {
        document.body.removeChild(overlay);
        document.documentElement.removeEventListener('keydown', handleKeydown, true);
    }
    
    function handleKeydown(evt)
    {
        var target = evt.target;
        if (evt.keyCode === 9)
        {
            if (target === document.body || target === document.documentElement)
            {
                box.focus();
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
                    background: 'white',
                    border: '.5em solid blue',
                    borderRadius: '1em',
                    display: 'inline-block',
                    padding: '1em',
                    maxWidth: '500px',
                    width: '100%'
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
                    display: 'table',
                    position: 'absolute',
                    textAlign: 'center',
                    left: '0',
                    right: '0',
                    top: '0',
                    bottom: '0',
                    width: '100%',
                    height: '100%'
                }
            },
            art('DIV', { style: { display: 'table-cell', verticalAlign: 'middle' } }, box)
        );
    art(document.body, overlay);
    art(document.documentElement, art.on('keydown', handleKeydown, true));
    box.focus();
}
