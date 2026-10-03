import { createEmpty } from './obj-utils';

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
 * If a candidate cluster with the same start and length has been already registered, only the one
 * with the largest saving is retained.
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
 * The number of characters saved by the cluster.
 *
 * Only candidate clusters with a positive saving should be registered.
 */
function addCluster(start, length, data, saving)
{
    var startLink = getOrCreateStartLink(this.startLinks, start);
    var cluster = startLink[length];
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
        cluster = startLink[length] = { start: start, length: length, data: data, saving: saving };
        this.clusters.push(cluster);
    }
}

function compareClustersByEnd(cluster1, cluster2)
{
    var diff =
    cluster1.start + cluster1.length - (cluster2.start + cluster2.length) ||
    cluster1.start - cluster2.start;
    return diff;
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
    var clusters = this.clusters;
    var clusterCount = clusters.length;
    if (clusterCount)
    {
        clusters.sort(compareClustersByEnd);
        // selections[index] is the best selection among the first index clusters.
        var selections = [{ saving: 0, span: 0 }];
        for (var index = 0; index < clusterCount; index++)
        {
            var cluster = clusters[index];
            var prevIndex = countClustersEndingBy(clusters, index, cluster.start);
            var prevSelection = selections[prevIndex];
            var saving = prevSelection.saving + cluster.saving;
            var span = prevSelection.span + cluster.length;
            var selection = selections[index];
            var diff = saving - selection.saving || selection.span - span;
            if (diff >= 0)
                selection = { saving: saving, span: span, cluster: cluster, prevIndex: prevIndex };
            selections.push(selection);
        }
        for
        (
            var bestSelection = selections[clusterCount];
            bestSelection.cluster;
            bestSelection = selections[bestSelection.prevIndex]
        )
        {
            var bestCluster = bestSelection.cluster;
            delete bestCluster.saving;
            bestClusters.push(bestCluster);
        }
    }
    return bestClusters;
}

/**
 * Returns the number of leading clusters in a list sorted by end that end at or before a specified
 * position.
 *
 * @param {object[]} clusters
 * A list of clusters sorted by end.
 *
 * @param {number} count
 * The number of leading clusters to consider.
 *
 * @param {number} position
 * The position to compare with the ends of the clusters.
 *
 * @returns {number}
 * The number of leading clusters ending at or before the specified position.
 */
function countClustersEndingBy(clusters, count, position)
{
    var low = 0;
    var high = count;
    while (low < high)
    {
        var middle = low + high >>> 1;
        var cluster = clusters[middle];
        if (cluster.start + cluster.length <= position)
            low = middle + 1;
        else
            high = middle;
    }
    return low;
}

function getOrCreateStartLink(startLinks, start)
{
    var startLink = startLinks[start] || (startLinks[start] = []);
    return startLink;
}

export default function createClusteringPlan()
{
    var plan =
    {
        addCluster: addCluster,
        clusters:   [],
        conclude:   conclude,
        startLinks: createEmpty(),
    };
    return plan;
}
