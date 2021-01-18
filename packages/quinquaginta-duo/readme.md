# quinquaginta-duo · [![npm version][npm badge]][npm url]

This package provides the implementation of boolean vectors (masks) used by
[JScrewIt](https://github.com/fasttime/JScrewIt) to represent features.
It is named after the word for the number fifty-two in Latin, which is the maximum number of
boolean elements that masks can handle in this implementation.

## Overview

A mask is an immutable, serializable, transparent data structure used to operate on multiple boolean
values at once.
Masks should only be accessed using the mask functions provided by quinquaginta-duo.
Do not make any assumptions about the internal representation of masks, their type or truthiness.
For performance reasons, mask functions do not check that their arguments are valid masks.
Passing anything other than a mask as an argument to a mask function results in undefined
behavior.

## Compatibility

The same JavaScript engines supported by the latest version of JScrewIt are supported by
quinquaginta-duo.
See [here](https://github.com/fasttime/JScrewIt#compatibility).

[npm badge]: https://badge.fury.io/js/quinquaginta-duo.svg
[npm url]: https://www.npmjs.com/package/quinquaginta-duo
