import { Encoder }                  from './encoder/encoder-base';
import { assignNoEnum }             from './obj-utils';
import createCommaOptimizer         from './optimizers/comma-optimizer';
import createShortcutOptimizer      from './optimizers/shortcut-optimizer';
import createSurrogatePairOptimizer from './optimizers/surrogate-pair-optimizer';
import createToStringOptimizer      from './optimizers/to-string-optimizer';

/** @typedef {import('./solution').AbstractSolution}        AbstractSolution */
/** @typedef {import('./clustering-plan').ClusteringPlan}   ClusteringPlan */

/**
 * A function that produces the solution of a cluster.
 *
 * A clusterer is invoked at most once, and only if the cluster it belongs to is retained by the
 * clustering plan: the clusterers of candidate clusters that are discarded are never invoked.
 *
 * @callback Clusterer
 *
 * @returns {AbstractSolution}
 * The solution that replaces the clustered solutions in the group.
 *
 * The type of the solution must be the one specified when the cluster was registered.
 */

/**
 * An object that shortens the JSFuck code of a group of solutions by replacing sequences of
 * adjacent solutions with shorter equivalents called clusters.
 * A cluster that spans all solutions in a group is called an integral cluster, as opposed to a
 * partial cluster that spans only a part of the group.
 *
 * Optimizers are cached for the lifetime of an encoder, so that the same optimizer is reused for
 * any number of groups: an optimizer must not carry over state from one group to the next.
 *
 * @interface Optimizer
 *
 * @ignore
 */

/**
 * Estimates the append length that a solution will contribute to a group if this optimizer clusters
 * it.
 *
 * This method is called for each solution appended to a group, before any clustering takes place.
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
 * @returns {number | undefined}
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
 * The data argument passed to {@link ClusteringPlan#addCluster} must be a {@link Clusterer}.
 * The saving argument is the difference between the sum of the append lengths of the clustered
 * solutions and the append length of the solution of the cluster: the plan adjusts it for the
 * position of the cluster in the group and ignores candidates that are not worth applying, so an
 * optimizer should register every candidate cluster it finds, whatever its saving.
 *
 * @param {AbstractSolution[]} solutions
 * The solutions in the group, in append order.
 *
 * @returns {void}
 */

var CREATE_OPTIMIZER_MAP =
{
    __proto__:      null,
    comma:          createCommaOptimizer,
    shortcut:       createShortcutOptimizer,
    surrogatePair:  createSurrogatePairOptimizer,
    toString:       createToStringOptimizer,
};

function addOptimizer(optimizerList, createOptimizer, str, subKey)
{
    if (createOptimizer.matches(this, str, subKey))
    {
        var key = createOptimizer.key;
        var optimizer = this._getOptimizer(key, subKey);
        optimizerList.push(optimizer);
    }
}

function getOptimizer(key, subKey)
{
    var optimizers = this._optimizers;
    var optimizerKey = subKey != null ? key + ':' + subKey : key;
    var optimizer = optimizers[optimizerKey];
    if (!optimizer)
    {
        var createOptimizer = CREATE_OPTIMIZER_MAP[key];
        optimizer = createOptimizer(this, subKey);
        optimizers[optimizerKey] = optimizer;
    }
    return optimizer;
}

function getOptimizerList(str, optimize)
{
    var optimizerList = [];
    if (optimize)
    {
        var normalizeOption;
        if (typeof optimize === 'object')
        {
            var defaultOptValue = 'default' in optimize ? optimize.default : true;
            normalizeOption =
            function (key)
            {
                var optName = key + 'Opt';
                var optValue = optName in optimize ? optimize[optName] : defaultOptValue;
                return optValue;
            };
        }
        else
        {
            normalizeOption =
            function ()
            {
                return true;
            };
        }
        for (var key in CREATE_OPTIMIZER_MAP)
        {
            if (normalizeOption(key))
            {
                var createOptimizer = CREATE_OPTIMIZER_MAP[key];
                var addThisOptimizer = addOptimizer.bind(this, optimizerList, createOptimizer, str);
                var subKeys = createOptimizer.subKeys;
                if (subKeys)
                    subKeys.forEach(addThisOptimizer);
                else
                    addThisOptimizer();
            }
        }
    }
    return optimizerList;
}

assignNoEnum
(Encoder.prototype, { _getOptimizer: getOptimizer, _getOptimizerList: getOptimizerList });
