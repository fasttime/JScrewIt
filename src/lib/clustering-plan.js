import { createEmpty } from './obj-utils';

/**
 * An object that collects the candidate clusters of a group of solutions and determines which ones
 * are worth being applied.
 *
 * Candidate clusters are registered by the optimizers of a group with
 * {@link ClusteringPlan#addCluster}, and compete with each other: when the plan is concluded, only
 * a nonoverlapping selection of the most convenient candidates is retained.
 *
 * @interface ClusteringPlan
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
 * A cluster always spans two or more solutions.
 *
 * @param {Clusterer} data
 * The clusterer that produces the solution of the cluster.
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
    if (this.maxLength < length)
        this.maxLength = length;
}

function compareClustersByQuality(cluster1, cluster2)
{
    var diff =
    cluster1.saving - cluster2.saving ||
    cluster2.length - cluster1.length ||
    compareClustersByStart(cluster2, cluster1);
    return diff;
}

function compareClustersByStart(cluster1, cluster2)
{
    var diff = cluster2.start - cluster1.start;
    return diff;
}

function conclude()
{
    var bestClusters = [];
    var clusters = this.clusters;
    if (clusters.length)
    {
        clusters.sort(compareClustersByQuality);
        var cluster;
        while (cluster = pickBestCluster(this.startLinks, clusters, this.maxLength))
            bestClusters.push(cluster);
        bestClusters.sort(compareClustersByStart);
    }
    return bestClusters;
}

function getOrCreateStartLink(startLinks, start)
{
    var startLink = startLinks[start] || (startLinks[start] = []);
    return startLink;
}

function pickBestCluster(startLinks, clusters, maxLength)
{
    var cluster;
    while (cluster = clusters.pop())
    {
        if (cluster.saving != null)
        {
            unlinkClusters(startLinks, maxLength, cluster);
            return cluster;
        }
    }
}

function unlinkClusters(startLinks, maxLength, cluster)
{
    var startLink;
    var start = cluster.start;
    var index = start;
    var end = start + cluster.length;
    do
    {
        startLink = startLinks[index];
        if (startLink)
        {
            unlinkClustersFromLength(startLink, 0);
            delete startLinks[index];
        }
    }
    while (++index < end);
    for (var length = 1; length < maxLength;)
    {
        startLink = startLinks[start - length++];
        if (startLink)
        {
            unlinkClustersFromLength(startLink, length);
            startLink.length = length;
        }
    }
}

function unlinkClustersFromLength(startLink, fromLength)
{
    for (var length = startLink.length; length-- > fromLength;)
    {
        var cluster = startLink[length];
        if (cluster)
            delete cluster.saving;
    }
}

export default function createClusteringPlan()
{
    var plan =
    {
        addCluster: addCluster,
        clusters:   [],
        conclude:   conclude,
        maxLength:  0,
        startLinks: createEmpty(),
    };
    return plan;
}
