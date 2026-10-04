/* eslint-env ebdd/ebdd */
/* global expect, module, require, self */

'use strict';

(function ()
{
    function createPlan(solutionCount, bond, forceString, weakCount)
    {
        var solutions = [];
        for (var index = 0; index < solutionCount; index++)
            solutions.push({ isWeak: index < weakCount });
        var plan = JScrewIt.debug.createClusteringPlan(solutions, bond, forceString);
        return plan;
    }

    var JScrewIt = typeof module !== 'undefined' ? require('../node-jscrewit-test') : self.JScrewIt;

    var SolutionType = JScrewIt.debug.SolutionType;

    describe
    (
        'JScrewIt.debug.createClusteringPlan',
        function ()
        {
            it
            (
                'works as expected when empty',
                function ()
                {
                    var plan = createPlan(10);
                    var bestClusters = plan.conclude();
                    expect(bestClusters).toEqual([]);
                }
            );
            it
            (
                'works as expected with one cluster',
                function ()
                {
                    var plan = createPlan(10);
                    var start   = 0;
                    var length  = 1;
                    var data    = 'foo';
                    plan.addCluster(start, length, data, 2, SolutionType.STRING);
                    var bestClusters = plan.conclude();
                    expect(bestClusters).toEqual([{ start: start, length: length, data: data }]);
                }
            );
            it
            (
                'updates a cluster with a lower saving',
                function ()
                {
                    var plan = createPlan(10);
                    var start   = 0;
                    var length  = 1;
                    var data1   = 'foo';
                    var data2   = 'bar';
                    plan.addCluster(start, length, data1, 2, SolutionType.STRING);
                    plan.addCluster(start, length, data2, 3, SolutionType.STRING);
                    var bestClusters = plan.conclude();
                    expect(bestClusters).toEqual([{ start: start, length: length, data: data2 }]);
                }
            );
            it
            (
                'does not update a cluster with an equal saving',
                function ()
                {
                    var plan = createPlan(10);
                    var start   = 0;
                    var length  = 1;
                    var data1   = 'foo';
                    var data2   = 'bar';
                    plan.addCluster(start, length, data1, 2, SolutionType.STRING);
                    plan.addCluster(start, length, data2, 2, SolutionType.STRING);
                    var bestClusters = plan.conclude();
                    expect(bestClusters).toEqual([{ start: start, length: length, data: data1 }]);
                }
            );
            it
            (
                'works as expected with two disjoint clusters',
                function ()
                {
                    var plan = createPlan(10);
                    var start1  = 1;
                    var length1 = 2;
                    var data1   = 'foo';
                    var start2  = 3;
                    var length2 = 4;
                    var data2   = 'bar';
                    plan.addCluster(start1, length1, data1, 5, SolutionType.STRING);
                    plan.addCluster(start2, length2, data2, 6, SolutionType.STRING);
                    var bestClusters = plan.conclude();
                    expect(bestClusters).toEqual
                    (
                        [
                            { start: start2, length: length2, data: data2 },
                            { start: start1, length: length1, data: data1 },
                        ]
                    );
                }
            );
            it
            (
                'works as expected with two clusters overlapping like ▀█▄',
                function ()
                {
                    var plan = createPlan(10);
                    var start1  = 0;
                    var length  = 2;
                    var data1   = 'foo';
                    var start2  = 1;
                    var data2   = 'bar';
                    plan.addCluster(start1, length, data1, 3, SolutionType.STRING);
                    plan.addCluster(start2, length, data2, 3, SolutionType.STRING);
                    var bestClusters = plan.conclude();
                    expect(bestClusters).toEqual([{ start: start2, length: length, data: data2 }]);
                }
            );
            it
            (
                'works as expected with two clusters overlapping like █▀',
                function ()
                {
                    var plan = createPlan(10);
                    var start  = 0;
                    var length1 = 2;
                    var data1   = 'foo';
                    var length2 = 1;
                    var data2   = 'bar';
                    plan.addCluster(start, length1, data1, 3, SolutionType.STRING);
                    plan.addCluster(start, length2, data2, 3, SolutionType.STRING);
                    var bestClusters = plan.conclude();
                    expect(bestClusters).toEqual([{ start: start, length: length2, data: data2 }]);
                }
            );
            it
            (
                'works as expected with two clusters overlapping like ▀█',
                function ()
                {
                    var plan = createPlan(10);
                    var start1  = 0;
                    var length1 = 3;
                    var data1   = 'foo';
                    var start2  = 1;
                    var length2 = 2;
                    var data2   = 'bar';
                    plan.addCluster(start1, length1, data1, 3, SolutionType.STRING);
                    plan.addCluster(start2, length2, data2, 4, SolutionType.STRING);
                    var bestClusters = plan.conclude();
                    expect(bestClusters).toEqual([{ start: start2, length: length2, data: data2 }]);
                }
            );
            it
            (
                'only returns non-overlapping clusters',
                function ()
                {
                    var plan = createPlan(10);
                    var clusters =
                    [
                        { length: 2, saving: 6 },
                        { length: 2, saving: 7 },
                        { length: 2, saving: 9 },
                        { length: 2, saving: 8 },
                        { length: 1, saving: 5 },
                    ];
                    clusters.forEach
                    (
                        function (cluster, start)
                        {
                            plan.addCluster
                            (start, cluster.length, start, cluster.saving, SolutionType.STRING);
                            cluster.start = cluster.data = start;
                            delete cluster.saving;
                        }
                    );
                    var bestClusters = plan.conclude();
                    expect(bestClusters).toEqual([clusters[4], clusters[2], clusters[0]]);
                }
            );
            it
            (
                'selects the clusters with the largest total saving',
                function ()
                {
                    var plan = createPlan(10);
                    plan.addCluster(0, 2, 'foo', 5, SolutionType.STRING);
                    plan.addCluster(1, 2, 'bar', 6, SolutionType.STRING);
                    plan.addCluster(2, 2, 'baz', 5, SolutionType.STRING);
                    var bestClusters = plan.conclude();
                    expect(bestClusters).toEqual
                    (
                        [
                            { start: 2, length: 2, data: 'baz' },
                            { start: 0, length: 2, data: 'foo' },
                        ]
                    );
                }
            );
            describe
            (
                '#addCluster',
                function ()
                {
                    it
                    (
                        'ignores a cluster whose saving is not positive',
                        function ()
                        {
                            var plan = createPlan(10);
                            plan.addCluster(1, 2, 'foo', 0, SolutionType.STRING);
                            plan.addCluster(3, 2, 'bar', -1, SolutionType.STRING);
                            var bestClusters = plan.conclude();
                            expect(bestClusters).toEqual([]);
                        }
                    );
                    it
                    (
                        'discounts the parentheses of a weak solution at the start of the group',
                        function ()
                        {
                            var plan;
                            var bestClusters;

                            // Saving not positive after the discount.
                            plan = createPlan(10, false, false, 1);
                            plan.addCluster(0, 2, 'foo', 2, SolutionType.STRING);
                            bestClusters = plan.conclude();
                            expect(bestClusters).toEqual([]);

                            // Saving positive after the discount.
                            plan = createPlan(10, false, false, 1);
                            plan.addCluster(0, 2, 'foo', 3, SolutionType.STRING);
                            bestClusters = plan.conclude();
                            expect(bestClusters).toEqual([{ start: 0, length: 2, data: 'foo' }]);

                            // Only the first solution is discounted.
                            plan = createPlan(10, false, false, 2);
                            plan.addCluster(0, 2, 'foo', 3, SolutionType.STRING);
                            bestClusters = plan.conclude();
                            expect(bestClusters).toEqual([{ start: 0, length: 2, data: 'foo' }]);

                            // Weak solution not at the start of the group.
                            plan = createPlan(10, false, false, 1);
                            plan.addCluster(1, 2, 'foo', 1, SolutionType.STRING);
                            bestClusters = plan.conclude();
                            expect(bestClusters).toEqual([{ start: 1, length: 2, data: 'foo' }]);

                            // Weak solution replaced by a weak cluster.
                            plan = createPlan(10, false, false, 1);
                            plan.addCluster(0, 2, 'foo', 1, SolutionType.WEAK_ALGEBRAIC);
                            bestClusters = plan.conclude();
                            expect(bestClusters).toEqual([{ start: 0, length: 2, data: 'foo' }]);
                        }
                    );
                    it
                    (
                        'subtracts the append length of an empty array from an integral ' +
                        'nonstring cluster when a string is forced',
                        function ()
                        {
                            var plan;
                            var bestClusters;

                            // Saving not positive after the subtraction.
                            plan = createPlan(2, false, true);
                            plan.addCluster(0, 2, 'foo', 3, SolutionType.OBJECT);
                            bestClusters = plan.conclude();
                            expect(bestClusters).toEqual([]);

                            // Saving positive after the subtraction.
                            plan = createPlan(2, false, true);
                            plan.addCluster(0, 2, 'foo', 4, SolutionType.OBJECT);
                            bestClusters = plan.conclude();
                            expect(bestClusters).toEqual([{ start: 0, length: 2, data: 'foo' }]);

                            // String cluster.
                            plan = createPlan(2, false, true);
                            plan.addCluster(0, 2, 'foo', 1, SolutionType.STRING);
                            bestClusters = plan.conclude();
                            expect(bestClusters).toEqual([{ start: 0, length: 2, data: 'foo' }]);

                            // Partial cluster.
                            plan = createPlan(3, false, true);
                            plan.addCluster(0, 2, 'foo', 1, SolutionType.OBJECT);
                            bestClusters = plan.conclude();
                            expect(bestClusters).toEqual([{ start: 0, length: 2, data: 'foo' }]);

                            // No string forcing.
                            plan = createPlan(2, false, false);
                            plan.addCluster(0, 2, 'foo', 1, SolutionType.OBJECT);
                            bestClusters = plan.conclude();
                            expect(bestClusters).toEqual([{ start: 0, length: 2, data: 'foo' }]);
                        }
                    );
                    it
                    (
                        'adds the length of the bonding parentheses to an integral nonloose ' +
                        'cluster when bonding is required',
                        function ()
                        {
                            var plan;
                            var bestClusters;

                            // Saving positive after the addition.
                            plan = createPlan(2, true, false);
                            plan.addCluster(0, 2, 'foo', -1, SolutionType.STRING);
                            bestClusters = plan.conclude();
                            expect(bestClusters).toEqual([{ start: 0, length: 2, data: 'foo' }]);

                            // Loose cluster.
                            plan = createPlan(2, true, false);
                            plan.addCluster(0, 2, 'foo', -1, SolutionType.COMBINED_STRING);
                            bestClusters = plan.conclude();
                            expect(bestClusters).toEqual([]);

                            // Nonstring cluster with string forcing: the empty array appended
                            // makes the group loose.
                            plan = createPlan(2, true, true);
                            plan.addCluster(0, 2, 'foo', 3, SolutionType.OBJECT);
                            bestClusters = plan.conclude();
                            expect(bestClusters).toEqual([]);

                            // Partial cluster.
                            plan = createPlan(3, true, false);
                            plan.addCluster(0, 2, 'foo', 0, SolutionType.STRING);
                            bestClusters = plan.conclude();
                            expect(bestClusters).toEqual([]);

                            // No bonding.
                            plan = createPlan(2, false, false);
                            plan.addCluster(0, 2, 'foo', 0, SolutionType.STRING);
                            bestClusters = plan.conclude();
                            expect(bestClusters).toEqual([]);
                        }
                    );
                }
            );
        }
    );
}
)();
