var maskAreEqual;
var maskIncludes;
var maskIntersection;
var maskIsEmpty;
var maskNew;
var maskNewInverted;
var maskUnion;
var maskWithBit;

(function ()
{
    maskAreEqual =
    function (mask1, mask2)
    {
        var equal = mask1[0] === mask2[0] && mask1[1] === mask2[1];
        return equal;
    };

    maskIncludes =
    function (includingMask, includedMask)
    {
        var part0;
        var part1;
        var included =
        ((part0 = includedMask[0]) & includingMask[0]) === part0 &&
        ((part1 = includedMask[1]) & includingMask[1]) === part1;
        return included;
    };

    maskIntersection =
    function (mask1, mask2)
    {
        var mask = [mask1[0] & mask2[0], mask1[1] & mask2[1]];
        return mask;
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

    maskUnion =
    function (mask1, mask2)
    {
        var mask = [mask1[0] | mask2[0], mask1[1] | mask2[1]];
        return mask;
    };

    maskWithBit =
    function (bitIndex)
    {
        var mask = [0, 0];
        mask[bitIndex >> 5] |= 1 << bitIndex;
        return mask;
    };
}
)();
