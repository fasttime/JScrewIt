# ~feature-hub

This package provides the framwork used by [JScrewIt](https://github.com/fasttime/JScrewIt) to
operate with engine features.
It supersedes the former packages *quinquaginta-duo* and *~mask* previously used as mask
providers, and extends them with the ability to create feature classes.

## Masks

A mask is an immutable, serializable, transparent data structure used to operate on multiple boolean
values at once.
It is conceptually similar to a boolean vector, except that the boolean elements have no numeric
index associated to them, and can only be accessed using other previously computed masks.
Masks should only be accessed using the mask functions provided by this package.
An exception to this rule is that a mask can be safely compared to undefined or null, because any
valid mask is different from undefined or null.
Apart from that, do not make any assumptions about the internal representation of masks, their type
or truthiness.
For performance reasons, mask functions do not check that their arguments are valid masks.
Passing anything other than a mask as an argument to a mask function results in undefined behavior.
