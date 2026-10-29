import { _Object_keys, createEmpty } from '../obj-utils';

/** @typedef {import('../solution').AbstractSolution}       AbstractSolution */
/** @typedef {import('../clustering-plan').ClusteringPlan}  ClusteringPlan */

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

var OPTIMIZER_MAP = createEmpty();

function addOptimizer(optimizerList, matches, str, key, subKey)
{
    if (matches(this, str, subKey))
    {
        var optimizer = this._getOptimizer(key, subKey);
        optimizerList.push(optimizer);
    }
}

export function getOptimizer(key, subKey)
{
    var optimizers = this._optimizers;
    var optimizerKey = subKey != null ? key + ':' + subKey : key;
    var optimizer = optimizers[optimizerKey];
    if (!optimizer)
    {
        var createOptimizer = OPTIMIZER_MAP[key]._create;
        optimizer = createOptimizer(this, subKey);
        optimizers[optimizerKey] = optimizer;
    }
    return optimizer;
}

export function getOptimizerList(str, optimize)
{
    var optimizerList = [];
    if (optimize)
    {
        var normalizeOption;
        if (typeof optimize === 'object')
        {
            var defaultOptValue = optimize.default;
            if (defaultOptValue == null)
                defaultOptValue = true;
            normalizeOption =
            function (key)
            {
                var optName = key + 'Opt';
                var optValue = optimize[optName];
                if (optValue == null)
                    optValue = defaultOptValue;
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
        if (!sortedKeys)
            sortedKeys = _Object_keys(OPTIMIZER_MAP).sort(); // Do not rely on registration order.
        sortedKeys.forEach
        (
            function (key)
            {
                if (normalizeOption(key))
                {
                    var entry = OPTIMIZER_MAP[key];
                    var addThisOptimizer =
                    addOptimizer.bind(this, optimizerList, entry._matches, str, key);
                    var subKeys = entry._subKeys;
                    if (subKeys)
                        subKeys.forEach(addThisOptimizer);
                    else
                        addThisOptimizer();
                }
            },
            this
        );
    }
    return optimizerList;
}

export function registerOptimizer(key, createOptimizer, matches, subKeys)
{
    OPTIMIZER_MAP[key] = { _create: createOptimizer, _matches: matches, _subKeys: subKeys };
    sortedKeys = undefined;
}

var sortedKeys;
