/* eslint-env browser */

export function hasTabindex(element)
{
    var result = element.hasAttribute('tabindex');
    return result;
}

export function removeTabindex(element)
{
    element.removeAttribute('tabindex');
}

export function setTabindex(element)
{
    element.setAttribute('tabindex', 0);
}
