# novem · [![npm version][npm badge]][npm url]

This is the solution framework used by [JScrewIt](https://github.com/fasttime/JScrewIt).
It is named after the word for the number nine in Latin, because in a prior draft of the project
there were nine solution types.

## Overview

A solution is a data structure that is filled with information used to convert a piece of JavaScript
into JSFuck.

### Replacement

The main property of a solution is a JSFuck expression, called the replacement expression.
All other properties can be derived from the replacement expression alone.

### Value

When the replacement is evaluated in a particular environment, it yields a value with some expected
characteristics: this is the value associated with the solution in the specified environment.
The expected characteristics of the value are often indicated in terms of identity to a specific
constant, such as `false`, 1, or `"a"`; but they can also consist in having a particular string
representation, for example, the string `","`, for which any expression equivalent to `[[],[]]`,
`Array(2)` or `","` would be suitable.
Other times the value is expected to be a function or the name of a function with a particular
behavior: for instance, the string methods `slice` and `substr` behave similarly in some situations,
and so JScrewIt defines solutions for both of their names, and then uses whichever solution has the
shortest replacement in the target environment.
Finally, some solutions are supposed to yield different values depending on the features of the
environment where the replacement is evaluated.

Despite its crucial importance, the value cannot be considered the defining property of a solution,
mainly because the same replacement can yield different values in different environments.
For the same reason, the value is not normally used directly or calculated at encoding time;
instead, characteristics of it are expressed through other properties.

### Source

Solutions with a constant value or string representation can have an additional source property.
The source contains the string representation of the solution, e.g. `"true"` for replacement `!![]`,
`"a"` for `(![]+[])[+!![]]`, etc.

### Type

Another property of solutions is the type.
The type captures aspects such as the data type of the value associated with a solution, and how
operators are to be appended or prepended to the replacement expression in order for it to preserve
its semantics inside a larger expression.
Currently, the following solution types are distinguished.

| **solution type**    | **examples**                 |
|----------------------|------------------------------|
| undefined            | `[][[]]`                     |
| algebraic            | `![]`, `!![]`, `[][[]]++`    |
| weak algebraic       | `+[]`, `+!![]`, `!![]+!![]`  |
| object               | `[]`                         |
| string               | `([]+![])[+[]]`              |
| prefixed string      | `![]+([]+![])[+[]]`          |
| weak prefixed string | `+[]+([]+![])[+[]]`          |
| combined string      | `([]+![])[+[]]+![]`, `[]+[]` |

## Compatibility

The same JavaScript engines supported by the latest version of JScrewIt are supported by novem.
See [here](https://github.com/fasttime/JScrewIt#compatibility).

[npm badge]: https://badge.fury.io/js/novem.svg
[npm url]: https://www.npmjs.com/package/novem
