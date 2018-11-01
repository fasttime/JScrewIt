/* eslint-env browser */

function hasTabindex(element)
{
    var result = element.hasAttribute('tabindex');
    return result;
}

function removeTabindex(element)
{
    element.removeAttribute('tabindex');
}

function setTabindex(element)
{
    element.setAttribute('tabindex', 0);
}
