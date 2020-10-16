import { COMPLEX }                      from './definitions';
import { Encoder }                      from './encoder-base';
import { assignNoEnum, createEmpty }    from './obj-utils';
import createCommaOptimizer             from './optimizers/comma-optimizer';
import createComplexOptimizer           from './optimizers/complex-optimizer';
import createToStringOptimizer          from './optimizers/to-string-optimizer';

(function ()
{
    var protoSource =
    {
        getOptimizerList:
        function (str, optimize)
        {
            var optimizerList = [];
            if (optimize)
            {
                var optimizeComma;
                var optimizeComplex;
                var optimizeToString;
                if (typeof optimize === 'object')
                {
                    optimizeComma       = !!optimize.commaOpt;
                    optimizeComplex     = !!optimize.complexOpt;
                    optimizeToString    = !!optimize.toStringOpt;
                }
                else
                    optimizeComma = optimizeComplex = optimizeToString = true;
                var optimizers = this.optimizers;
                var optimizer;
                if (optimizeComma)
                {
                    if (str.indexOf(',') >= 0)
                    {
                        optimizer =
                        optimizers.comma || (optimizers.comma = createCommaOptimizer(this));
                        optimizerList.push(optimizer);
                    }
                }
                if (optimizeComplex)
                {
                    var complexOptimizers = optimizers.complex;
                    if (!complexOptimizers)
                        complexOptimizers = optimizers.complex = createEmpty();
                    for (var complex in COMPLEX)
                    {
                        var entry = COMPLEX[complex];
                        if (this.hasFeatures(entry.mask) && str.indexOf(complex) >= 0)
                        {
                            optimizer =
                            complexOptimizers[complex] ||
                            (
                                complexOptimizers[complex] =
                                createComplexOptimizer(this, complex, entry.definition)
                            );
                            optimizerList.push(optimizer);
                        }
                    }
                }
                if (optimizeToString)
                {
                    optimizer =
                    optimizers.toString || (optimizers.toString = createToStringOptimizer(this));
                    optimizerList.push(optimizer);
                }
            }
            return optimizerList;
        },
    };

    assignNoEnum(Encoder.prototype, protoSource);
}
)();
