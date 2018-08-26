/* eslint-env mocha */
/* global expect, module, require, self */

(function ()
{
    'use strict';

    var JScrewIt = typeof module !== 'undefined' ? require('../node-jscrewit-test') : self.JScrewIt;

    describe(
        'JScrewIt.debug.createClusteringPlan',
        function ()
        {
            it(
                'works as expected when empty',
                function ()
                {
                    var plan = JScrewIt.debug.createClusteringPlan();
                    var bestClusters = plan.conclude();
                    expect(bestClusters).toEqual([]);
                }
            );
            it(
                'works as expected with one cluster',
                function ()
                {
                    var plan = JScrewIt.debug.createClusteringPlan();
                    var start   = 0;
                    var length  = 1;
                    var data    = 'foo';
                    plan.addCluster(start, length, data, 2);
                    var bestClusters = plan.conclude();
                    expect(bestClusters).toEqual([{ start: start, length: length, data: data }]);
                }
            );
            it(
                'updates a cluster with a lower saving',
                function ()
                {
                    var plan = JScrewIt.debug.createClusteringPlan();
                    var start   = 0;
                    var length  = 1;
                    var data1   = 'foo';
                    var data2   = 'bar';
                    plan.addCluster(start, length, data1, 2);
                    plan.addCluster(start, length, data2, 3);
                    var bestClusters = plan.conclude();
                    expect(bestClusters).toEqual([{ start: start, length: length, data: data2 }]);
                }
            );
            it(
                'does not update a cluster with an equal saving',
                function ()
                {
                    var plan = JScrewIt.debug.createClusteringPlan();
                    var start   = 0;
                    var length  = 1;
                    var data1   = 'foo';
                    var data2   = 'bar';
                    plan.addCluster(start, length, data1, 2);
                    plan.addCluster(start, length, data2, 2);
                    var bestClusters = plan.conclude();
                    expect(bestClusters).toEqual([{ start: start, length: length, data: data1 }]);
                }
            );
            it(
                'works as expected with two disjoint clusters',
                function ()
                {
                    var plan = JScrewIt.debug.createClusteringPlan();
                    var start1  = 1;
                    var length1 = 2;
                    var data1   = 'foo';
                    var start2  = 3;
                    var length2 = 4;
                    var data2   = 'bar';
                    plan.addCluster(start1, length1, data1, 5);
                    plan.addCluster(start2, length2, data2, 6);
                    var bestClusters = plan.conclude();
                    expect(bestClusters).toEqual(
                        [
                            { start: start2, length: length2, data: data2 },
                            { start: start1, length: length1, data: data1 }
                        ]
                    );
                }
            );
            it(
                'works as expected with two clusters overlapping like ▀█▄',
                function ()
                {
                    var plan = JScrewIt.debug.createClusteringPlan();
                    var start1  = 0;
                    var length  = 2;
                    var data1   = 'foo';
                    var start2  = 1;
                    var data2   = 'bar';
                    plan.addCluster(start1, length, data1, 3);
                    plan.addCluster(start2, length, data2, 3);
                    var bestClusters = plan.conclude();
                    expect(bestClusters).toEqual([{ start: start2, length: length, data: data2 }]);
                }
            );
            it(
                'works as expected with two clusters overlapping like █▀',
                function ()
                {
                    var plan = JScrewIt.debug.createClusteringPlan();
                    var start  = 0;
                    var length1 = 2;
                    var data1   = 'foo';
                    var length2 = 1;
                    var data2   = 'bar';
                    plan.addCluster(start, length1, data1, 3);
                    plan.addCluster(start, length2, data2, 3);
                    var bestClusters = plan.conclude();
                    expect(bestClusters).toEqual([{ start: start, length: length2, data: data2 }]);
                }
            );
            it(
                'works as expected with two clusters overlapping like ▀█',
                function ()
                {
                    var plan = JScrewIt.debug.createClusteringPlan();
                    var start1  = 0;
                    var length1 = 3;
                    var data1   = 'foo';
                    var start2  = 1;
                    var length2 = 2;
                    var data2   = 'bar';
                    plan.addCluster(start1, length1, data1, 3);
                    plan.addCluster(start2, length2, data2, 4);
                    var bestClusters = plan.conclude();
                    expect(bestClusters).toEqual([{ start: start2, length: length2, data: data2 }]);
                }
            );
            it(
                'only returns non-overlapping clusters',
                function ()
                {
                    var plan = JScrewIt.debug.createClusteringPlan();
                    var clusters =
                    [
                        { length: 2, saving: 6 },
                        { length: 2, saving: 7 },
                        { length: 2, saving: 9 },
                        { length: 2, saving: 8 },
                        { length: 1, saving: 5 }
                    ];
                    clusters.forEach(
                        function (cluster, start)
                        {
                            plan.addCluster(start, cluster.length, start, cluster.saving);
                            cluster.start = cluster.data = start;
                            delete cluster.saving;
                        }
                    );
                    var bestClusters = plan.conclude();
                    expect(bestClusters).toEqual([clusters[4], clusters[2], clusters[0]]);
                }
            );
        }
    );
}
)();
