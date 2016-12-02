/* eslint-env node */
/* global repeat */

'use strict';

function createAntiRadix4TestString(variety, length)
{
    // The first 480 numbers between 0 and 65535 ordered by their canonical JSFuck length when
    // printed in base 4 in descending order.
    var CHAR_CODES =
    [
        65535, 65534, 64511, 65279, 65531, 49151, 65471, 61439, 65519, 63487, 57343, 65503,
        65023, 32767, 65533, 65527, 65407, 64510, 65515, 64507, 64495, 45055, 64447, 61438,
        65215, 61183, 64255, 65518, 65263, 65275, 65470, 65278, 65467, 61375, 65530, 48127,
        65455, 49147, 49135, 49087, 61423, 61435, 60415, 49150, 48895, 64767, 53247, 65532,
        65523, 65343, 65487, 62463, 32511, 63231, 65439, 65406, 65403, 47103, 49023, 65391,
        49119, 40959, 49143, 61407, 49149, 65463, 64959, 28671, 63999, 31743, 65529, 65469,
        65277, 65526, 65271, 56319, 61437, 48639, 65247, 63486, 61431, 57087, 32703, 65007,
        64383, 63483, 59391, 32751, 61311, 57279, 65019, 60927, 32763, 32766, 63471, 64479,
        65022, 64503, 65499, 64509, 65502, 63423, 65511, 65151, 57327, 57339, 57342, 65517,
        47871, 64239, 49131, 64251, 64254, 49134, 65451, 61359, 48891, 60159, 48894, 49146,
        65454, 48123, 60414, 65214, 48126, 65211, 61119, 44799, 61434, 65199, 64431, 48063,
        64443, 64446, 60399, 49071, 60351, 65466, 61422, 61374, 64491, 64494, 61371, 44031,
        64506, 49083, 49086, 60411, 48111, 65274, 61182, 64191, 61419, 65514, 45054, 61179,
        45051, 45039, 48879, 48831, 44991, 61167, 65262, 65259, 48383, 63743, 65507, 61436,
        65483, 49148, 65276, 48959, 65342, 61427, 60671, 65267, 64463, 64766, 65339, 65459,
        65516, 64763, 36863, 61247, 65327, 49103, 64499, 52223, 62462, 52991, 64508, 65468,
        46079, 53183, 62459, 65522, 53231, 62447, 64319, 61391, 65231, 65486, 62399, 64751,
        53243, 64703, 53246, 65528, 65087, 65423, 49139, 58367, 62207, 16383, 65375, 57311,
        32765, 32759, 57215, 32735, 32639, 56831, 32255, 64895, 57341, 30719, 62975, 57335,
        64991, 65399, 65405, 24575, 63485, 65015, 63479, 65021, 65525, 65495, 65501, 63455,
        63359, 55295, 40958, 65246, 63227, 49133, 65243, 32495, 63467, 32507, 32510, 63215,
        63470, 57071, 49142, 61430, 57083, 57086, 40955, 49145, 48887, 32687, 32699, 32702,
        61343, 61406, 64367, 65513, 64379, 64382, 48125, 40703, 47615, 48893, 65213, 48638,
        48575, 63167, 32747, 57263, 65207, 32750, 63422, 65453, 57275, 64415, 61310, 57278,
        28415, 48119, 28607, 64439, 28655, 64445, 28667, 61403, 48635, 61307, 32762, 28670,
        63407, 49007, 65183, 63935, 48095, 61295, 64475, 64478, 40943, 65402, 64487, 48767,
        63983, 64493, 47102, 63995, 63998, 64502, 65447, 64505, 47099, 49019, 47087, 31487,
        49022, 65510, 57323, 60863, 31679, 61181, 31727, 65150, 57326, 31739, 65147, 65390,
        31742, 40895, 45053, 49055, 45047, 47039, 61373, 45023, 61175, 57338, 65135, 65387,
        64127, 48623, 56063, 56255, 63482, 44927, 56303, 39935, 47999, 65465, 49079, 59135,
        44543, 59327, 59375, 61151, 61421, 63419, 49085, 65273, 59387, 59390, 65438, 48863,
        59903, 65270, 56315, 56318, 60287, 65498, 65435, 60383, 64943, 32447, 64955, 64958,
        63230, 60407, 61055, 49115, 60413, 65261, 49118, 61433, 65003, 65006, 64223, 57023,
        27647, 65018, 65255, 46847, 61367, 61415, 60926, 64247, 43007, 49127, 60923, 64253,
        65462, 60911, 44795, 65258, 65404, 65020, 65524, 65011, 65521, 49067, 61951, 60410,
        49070, 64975, 43775, 49082, 61103, 60398, 64235, 60395, 60350, 60347, 43967, 61418,
        60335, 44015, 44027, 49130, 44030, 61115, 63439, 65359, 60158, 60155, 60143, 65341,
        64831, 60095, 47867, 65500, 20479, 65335, 65491, 61118, 63475, 51199, 64765, 64238,
        64759, 47870, 65485, 64735, 62461, 63484, 65479, 52735, 61163, 44735, 29695, 44783,
        63295, 65395, 44798, 64639, 48122, 48890, 64250, 44975, 61166, 44987, 53119, 44990,
    ];
    
    var str = String.fromCharCode.apply(null, CHAR_CODES.slice(0, variety));
    str = repeatToFit(str, length);
    return str;
}

function createDictTestString(variety, length)
{
    var str = '';
    for (var index = 0; index < variety; ++index)
        str += String.fromCharCode(0xffff - index);
    str = repeatToFit(str, length);
    return str;
}

function data(features, createInput, coderName)
{
    var result = { features: features, createInput: createInput, coderName: coderName };
    return result;
}

function repeatToFit(str, length)
{
    var result = repeat(str, Math.ceil(length / str.length)).slice(0, length);
    return result;
}

module.exports =
[
    data(
        ['ATOB', 'CAPITAL_HTML', 'ENTRIES_OBJ', 'FILL', 'NO_IE_SRC', 'NO_V8_SRC'],
        repeat.bind(null, String.fromCharCode(59999)),
        'byCharCodes'
    ),
    data(
        ['ARROW', 'ATOB', 'CAPITAL_HTML', 'ENTRIES_PLAIN', 'FILL', 'NO_IE_SRC', 'NO_V8_SRC'],
        function (length)
        {
            var CHAR_CODES =
            [
                49989, 49988, 59989, 37889, 59988, 37888, 38999, 38998, 29989, 38997,
                37989, 59969, 58889, 57989, 58898, 58899, 19989
            ];
            var str = repeatToFit(String.fromCharCode.apply(null, CHAR_CODES), length);
            return str;
        },
        'byCharCodesRadix4'
    ),
    data(
        ['ARRAY_ITERATOR', 'ATOB', 'FILL', 'NO_IE_SRC', 'NO_V8_SRC', 'UNDEFINED'],
        repeat.bind(null, String.fromCharCode(59999)),
        'byDict'
    ),
    data(
        ['ARROW', 'ATOB', 'CAPITAL_HTML', 'ENTRIES_PLAIN', 'FILL', 'V8_SRC'],
        createDictTestString.bind(null, 125),
        'byDictRadix3'
    ),
    data(
        ['ARROW', 'ATOB', 'CAPITAL_HTML', 'ENTRIES_PLAIN', 'FILL', 'V8_SRC'],
        createDictTestString.bind(null, 88),
        'byDictRadix4'
    ),
    data(
        ['ARROW', 'ATOB', 'CAPITAL_HTML', 'ENTRIES_PLAIN', 'FILL', 'V8_SRC'],
        createDictTestString.bind(null, 129),
        'byDictRadix4AmendedBy1'
    ),
    data(
        ['ARROW', 'CAPITAL_HTML', 'ENTRIES_PLAIN', 'FILL', 'FROM_CODE_POINT', 'V8_SRC'],
        createDictTestString.bind(null, 364),
        'byDictRadix4AmendedBy2'
    ),
    data(
        [
            'ARROW',
            'BARPROP',
            'ENTRIES_PLAIN',
            'FILL',
            'FROM_CODE_POINT',
            'NAME',
            'NODECONSTRUCTOR',
            'V8_SRC'
        ],
        createAntiRadix4TestString.bind(null, 471),
        'byDictRadix5AmendedBy3'
    ),
    data(
        [
            'ARRAY_ITERATOR',
            'ARROW',
            'CAPITAL_HTML',
            'FILL',
            'FROM_CODE_POINT',
            'NO_IE_SRC',
            'NO_V8_SRC'
        ],
        createDictTestString.bind(null, 103),
        'byDblDict'
    )
];
