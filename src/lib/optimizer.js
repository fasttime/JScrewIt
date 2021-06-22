import { COMPLEX }                  from './definitions';
import { Encoder }                  from './encoder/encoder-base';
import { Feature }                  from './features';
import { assignNoEnum }             from './obj-utils';
import createCommaOptimizer         from './optimizers/comma-optimizer';
import createComplexOptimizer       from './optimizers/complex-optimizer';
import createSurrogatePairOptimizer from './optimizers/surrogate-pair-optimizer';
import createToStringOptimizer      from './optimizers/to-string-optimizer';

var FROM_CODE_POINT_MASK = Feature.FROM_CODE_POINT.mask;

function addOptimizer(optimizerList, optName, keyData, extraData)
{
    var optimizers = this.optimizers;
    var optKey = optName;
    if (keyData != null)
        optKey += ':' + keyData;
    var optimizer = optimizers[optKey];
    if (!optimizer)
    {
        optimizer = this.createOptimizer(optName, keyData, extraData);
        optimizers[optKey] = optimizer;
    }
    optimizerList.push(optimizer);
}

function createOptimizer(optName, keyData, extraData)
{
    var optimizer;
    switch (optName)
    {
    case 'comma':
        optimizer = createCommaOptimizer(this);
        break;
    case 'complex':
        optimizer = createComplexOptimizer(this, keyData, extraData);
        break;
    case 'surrogatePair':
        optimizer = createSurrogatePairOptimizer(this);
        break;
    case 'toString':
        optimizer = createToStringOptimizer(this);
        break;
    }
    return optimizer;
}

function getOptimizerList(str, optimize)
{
    var optimizerList = [];
    if (optimize)
    {
        var optimizeComma;
        var optimizeComplex;
        var optimizeSurrogatePair;
        var optimizeToString;
        if (typeof optimize === 'object')
        {
            var defaultOptValue = 'default' in optimize ? !!optimize.default : true;
            var normalizeOption =
            function (optName)
            {
                var optKey = optName + 'Opt';
                var optValue = optKey in optimize ? !!optimize[optKey] : defaultOptValue;
                return optValue;
            };
            optimizeComma           = normalizeOption('comma');
            optimizeComplex         = normalizeOption('complex');
            optimizeSurrogatePair   = normalizeOption('surrogatePair');
            optimizeToString        = normalizeOption('toString');
        }
        else
            optimizeComma = optimizeComplex = optimizeSurrogatePair = optimizeToString = true;
        if (optimizeComma)
        {
            if (str.indexOf(',') >= 0)
                this._addOptimizer(optimizerList, 'comma');
        }
        if (optimizeComplex)
        {
            for (var complex in COMPLEX)
            {
                var entry = COMPLEX[complex];
                if (this.hasFeatures(entry.mask) && str.indexOf(complex) >= 0)
                    this._addOptimizer(optimizerList, 'complex', complex, entry.definition);
            }
        }
        if (optimizeSurrogatePair)
        {
            if
            (this.hasFeatures(FROM_CODE_POINT_MASK) && /[\ud800-\udbff][\udc00-\udfff]/.test(str))
                this._addOptimizer(optimizerList, 'surrogatePair');
        }
        if (optimizeToString)
            this._addOptimizer(optimizerList, 'toString');
    }
    return optimizerList;
}

assignNoEnum
(
    Encoder.prototype,
    {
        _addOptimizer: addOptimizer,
        createOptimizer: createOptimizer,
        getOptimizerList: getOptimizerList,
    }
);
