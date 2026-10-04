import { APPEND_LENGTH_OF_EMPTY }   from './append-lengths';
import { SolutionType }             from './solution';

/** @typedef {import('./solution').AbstractSolution}    AbstractSolution */
/** @typedef {import('./solution').SolutionType}        SolutionType */

// The difference between the append length and the length of a solution: the leading "+", and a
// pair of parentheses around a weak solution.
var APPEND_EXTRA_LENGTH         = 1;
var WEAK_APPEND_EXTRA_LENGTH    = 3;

var BOND_EXTRA_LENGTH = 2; // Extra length of bonding parentheses "(" and ")".

/**
 * A cluster selected by a clustering plan.
 *
 * @typedef Cluster
 *
 * @property {number} start
 * The index of the first solution in the group replaced by the cluster.
 *
 * @property {number} length
 * The number of adjacent solutions in the group replaced by the cluster.
 *
 * @property {*} data
 * The data associated with the cluster when it was registered.
 */

/**
 * An object that collects the candidate clusters of a group of solutions and determines which ones
 * are worth being applied.
 *
 * Candidate clusters are registered by the optimizers of a group with
 * {@link ClusteringPlan#addCluster}, and compete with each other: when the plan is concluded, only
 * a nonoverlapping selection of the most convenient candidates is retained.
 *
 * @interface ClusteringPlan
 *
 * @ignore
 */

/**
 * Registers a candidate cluster in this plan.
 *
 * The specified saving is adjusted for the position of the cluster in the group.
 * A cluster at the start of the group, like the solution it replaces there, contributes the length
 * of its solution rather than the append length.
 * An integral cluster also determines the type of the group: if the group must be a string but the
 * solution of the cluster is not, the append length of an empty array is subtracted; otherwise, if
 * the group must be bonded and the solution of the cluster is not loose, the length of the bonding
 * parentheses is added, since the concatenation of two or more solutions would need them.
 *
 * Candidate clusters whose adjusted saving is not positive are ignored.
 * If a candidate cluster with the same start and length has been already registered, only the one
 * with the largest adjusted saving is retained.
 *
 * @function ClusteringPlan#addCluster
 *
 * @param {number} start
 * The index of the first solution in the group replaced by the cluster.
 *
 * @param {number} length
 * The number of adjacent solutions in the group replaced by the cluster.
 *
 * @param {*} data
 * Additional data associated with the cluster.
 *
 * This value is returned as is by {@link ClusteringPlan#conclude}.
 *
 * @param {number} saving
 * The difference between the sum of the append lengths of the solutions replaced by the cluster and
 * the append length of the solution of the cluster.
 *
 * @param {SolutionType} solutionType
 * The type of the solution of the cluster.
 */
function addCluster(start, length, data, saving, solutionType)
{
    if (!start)
    {
        var solutions = this.solutions;
        saving -=
        getAppendExtraLength(solutions[0].isWeak) -
        getAppendExtraLength(SolutionType.isWeak(solutionType));
        if (length === solutions.length) // Integral cluster.
        {
            if (this.forceString && !SolutionType.isString(solutionType))
                saving -= APPEND_LENGTH_OF_EMPTY;
            else if (this.bond && !SolutionType.isLoose(solutionType))
                saving += BOND_EXTRA_LENGTH;
        }
    }
    if (saving > 0)
    {
        var clusterLists = this.clusterLists;
        var end = start + length;
        var clustersByLength = clusterLists[end] || (clusterLists[end] = []);
        var cluster = clustersByLength[length];
        if (cluster)
        {
            if (cluster.saving < saving)
            {
                cluster.data    = data;
                cluster.saving  = saving;
            }
        }
        else
        {
            cluster = { start: start, length: length, data: data, saving: saving };
            clustersByLength[length] = cluster;
        }
    }
}

/**
 * Concludes this plan by selecting the candidate clusters to be applied.
 *
 * The selected clusters do not overlap, and their total saving is the largest attainable.
 * Among selections with the same total saving, the one whose clusters span fewer solutions is
 * preferred, and remaining ties are broken in favor of clusters that end later.
 *
 * This method must be called at most once, and no candidate clusters may be registered afterwards.
 *
 * @function ClusteringPlan#conclude
 *
 * @returns {Cluster[]}
 * The selected clusters, sorted by decreasing start, so that the solutions in the group can be
 * replaced in order without affecting the indexes of the clusters still to be applied.
 */
function conclude()
{
    var bestClusters = [];
    var clusterLists = this.clusterLists;
    // selections[end] is the best selection among the clusters ending at or before end.
    var selections = [];
    var selection = { saving: 0, span: 0 };
    var clusterListCount = clusterLists.length;
    for (var end = 0; end < clusterListCount; end++)
    {
        var clustersByLength = clusterLists[end];
        if (clustersByLength)
        {
            for (var length in clustersByLength)
            {
                var cluster = clustersByLength[length];
                var prevSelection = selections[cluster.start];
                var saving = prevSelection.saving + cluster.saving;
                var span = prevSelection.span + cluster.length;
                var diff = saving - selection.saving || selection.span - span;
                if (diff >= 0)
                    selection = { saving: saving, span: span, cluster: cluster };
            }
        }
        selections[end] = selection;
    }
    for (; selection.cluster; selection = selections[selection.cluster.start])
    {
        var bestCluster = selection.cluster;
        delete bestCluster.saving;
        bestClusters.push(bestCluster);
    }
    return bestClusters;
}

/**
 * Creates a clustering plan for a group of solutions.
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
 *
 * @param {boolean} forceString
 * `true` if the replacement of the group must evaluate to a string.
 *
 * A group that does not evaluate to a string is turned into a string by concatenating it with an
 * empty array.
 *
 * @returns {ClusteringPlan}
 * A new clustering plan.
 */
export default function createClusteringPlan(solutions, bond, forceString)
{
    var plan =
    {
        addCluster:     addCluster,
        bond:           bond,
        clusterLists:   [],
        conclude:       conclude,
        forceString:    forceString,
        solutions:      solutions,
    };
    return plan;
}

function getAppendExtraLength(weak)
{
    var appendExtraLength = weak ? WEAK_APPEND_EXTRA_LENGTH : APPEND_EXTRA_LENGTH;
    return appendExtraLength;
}
