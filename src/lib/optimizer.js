import createComplexOptimizer           from './complex-optimizer';
import { COMPLEX }                      from './definitions';
import { Encoder }                      from './encoder-base';
import { assignNoEnum, createEmpty }    from './obj-utils';
import createToStringOptimizer          from './to-string-optimizer';

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
                var optimizeComplex;
                var optimizeToString;
                if (typeof optimize === 'object')
                {
                    optimizeComplex     = !!optimize.complexOpt;
                    optimizeToString    = !!optimize.toStringOpt;
                }
                else
                    optimizeComplex = optimizeToString = true;
                var optimizers = this.optimizers;
                var optimizer;
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
