var maskAnd;
var maskAreEqual;
var maskIncludes;
var maskIsEmpty;
var maskNew;
var maskOr;
var maskUnion;

(function ()
{
    'use strict';
    
    maskAnd =
        function (thisMask, mask)
        {
            thisMask[0] &= mask[0];
            thisMask[1] &= mask[1];
        };
    
    maskAreEqual =
        function (mask1, mask2)
        {
            var equal = mask1[0] === mask2[0] && mask1[1] === mask2[1];
            return equal;
        };
    
    maskIncludes =
        function (thisMask, mask)
        {
            var mask0;
            var mask1;
            var included =
                ((mask0 = mask[0]) & thisMask[0]) === mask0 &&
                ((mask1 = mask[1]) & thisMask[1]) === mask1;
            return included;
        };
    
    maskIsEmpty =
        function (mask)
        {
            var empty = !(mask[0] | mask[1]);
            return empty;
        };
    
    maskNew =
        function ()
        {
            var mask = [0, 0];
            return mask;
        };
    
    maskOr =
        function (thisMask, mask)
        {
            thisMask[0] |= mask[0];
            thisMask[1] |= mask[1];
        };
    
    maskUnion =
        function (mask1, mask2)
        {
            var mask = [mask1[0] | mask2[0], mask1[1] | mask2[1]];
            return mask;
        };
}
)();
