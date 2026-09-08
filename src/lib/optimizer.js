import { COMPLEX }                  from './definitions';
import { Encoder }                  from './encoder/encoder-base';
import { Feature }                  from './features';
import { assignNoEnum }             from './obj-utils';
import createCommaOptimizer         from './optimizers/comma-optimizer';
import createComplexOptimizer       from './optimizers/complex-optimizer';
import createSurrogatePairOptimizer from './optimizers/surrogate-pair-optimizer';
import createToStringOptimizer      from './optimizers/to-string-optimizer';

var FROM_CODE_POINT_MASK = Feature.FROM_CODE_POINT.mask;

/**
 * A function that produces the solution of a cluster.
 *
 * A clusterer is invoked at most once, and only if the cluster it belongs to is retained by the
 * clustering plan: the clusterers of candidate clusters that are discarded are never invoked.
 * Because of this, it is convenient to defer any expensive computation of a cluster replacement to
 * the clusterer.
 *
 * @callback Clusterer
 *
 * @returns {AbstractSolution}
 * The solution that replaces the clustered solutions in the group.
 */

/**
 * An object that shortens the JSFuck code of a group of solutions by replacing sequences of
 * adjacent solutions with shorter equivalents called clusters.
 * A cluster that spans all solutions in a group is called an integral cluster, as opposed to a
 * partial cluster that spans only a part of the group.
 *
 * Optimizers are created by {@link Encoder#_createOptimizer} and cached by
 * {@link Encoder#_addOptimizer} for the lifetime of an encoder, so that the same optimizer is
 * reused for any number of groups: an optimizer must not carry over state from one group to the
 * next.
 *
 * @interface Optimizer
 */

/**
 * Estimates the append length that a solution will contribute to a group if this optimizer clusters
 * it.
 *
 * This method is called by {@link ScrewBuffer#append} for each solution appended to a group, before
 * any clustering takes place.
 * The smallest value returned by the optimizers of a group is used in place of the append length of
 * the solution to keep track of the length of the group.
 *
 * Since a cluster spans two or more solutions, the estimated append length of a solution is
 * typically obtained by apportioning the length of the cluster the solution may become part of
 * among the clustered solutions.
 * The returned value must never exceed the append length that the solution will actually contribute
 * to the optimized group: the estimated length of a group is used to discard replacements that
 * exceed a maximum length, so overestimating may discard usable replacements, while underestimating
 * only results in less accurate estimates.
 *
 * @function Optimizer#appendLengthOf
 *
 * @param {AbstractSolution} solution
 * The solution being appended to the group.
 *
 * @returns {number|undefined}
 * The estimated append length of the specified solution, or `undefined` if this optimizer cannot
 * optimize the specified solution.
 */

/**
 * Determines which sequences of adjacent solutions in a group can be replaced with shorter
 * equivalents, and registers them as candidate clusters in the clustering plan.
 *
 * This method is called once per group, when the replacement of the group is generated, after all
 * solutions have been appended.
 * The candidate clusters registered by all optimizers of a group compete with each other, and only
 * a nonoverlapping selection of them is applied by the caller.
 * Because of this, an implementation must not modify the specified solutions.
 *
 * @function Optimizer#optimizeSolutions
 *
 * @param {ClusteringPlan} plan
 * The clustering plan of the group, where candidate clusters are registered with
 * {@link ClusteringPlan#addCluster}.
 *
 * @param {AbstractSolution[]} solutions
 * The solutions in the group, in append order.
 *
 * @param {boolean} bond
 * `true` if the replacement of the group must be bonded, i.e. usable with any unary operator, as a
 * property access target, or as an operand of a concatenation, without further parentheses.
 *
 * A loose expression is bonded by wrapping it in a pair of parentheses, whereas an expression that
 * is not loose is bonded as it is.
 * Since the concatenation of two or more solutions is always loose, those parentheses can only be
 * spared by an integral cluster whose solution is not loose: this extra saving must be added by the
 * optimizer.
 *
 * @param {boolean} forceString
 * `true` if the replacement of the group must evaluate to a string.
 *
 * A group that does not evaluate to a string is turned into a string by concatenating it with an
 * empty array.
 * Since the concatenation of two or more solutions is always a string, this only concerns an
 * integral cluster whose solution is not a string: the append length of the empty array must be
 * subtracted by the optimizer.
 *
 * @returns {void}
 */

function addOptimizer(optimizerList, optName, keyData, extraData)
{
    var optimizers = this._optimizers;
    var optKey = optName;
    if (keyData != null)
        optKey += ':' + keyData;
    var optimizer = optimizers[optKey];
    if (!optimizer)
    {
        optimizer = this._createOptimizer(optName, keyData, extraData);
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
        _addOptimizer:      addOptimizer,
        _createOptimizer:   createOptimizer,
        _getOptimizerList:  getOptimizerList,
    }
);
