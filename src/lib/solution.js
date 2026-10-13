import { _Object_defineProperty, assignNoEnum } from './obj-utils';
import { AbstractSolution }                     from '~solution';

export var DEFAULT_APPEND_EXTRA_LENGTH    = 1;
export var WEAK_APPEND_EXTRA_LENGTH       = 3;

assignNoEnum
(
    AbstractSolution.prototype,
    {
        get appendLength()
        {
            var extraLength = this.isWeak ? WEAK_APPEND_EXTRA_LENGTH : DEFAULT_APPEND_EXTRA_LENGTH;
            var appendLength = this.length + extraLength;
            return appendLength;
        },
        set appendLength(appendLength)
        {
            _Object_defineProperty(this, 'appendLength', { enumerable: true, value: appendLength });
        },
    }
);

export * from '~solution';
