/* global module: false */
module.exports =
    function (grunt)
    {
        // Project configuration.
        grunt.initConfig(
            {
                // Task configuration.
                jasmine_node:
                {
                    all: ['jasmine/'],
                    coverage: { },
                    options: { forceExit: true }
                },
                jshint:
                {
                    options:
                    {
                        curly: true,
                        eqeqeq: true,
                        immed: true,
                        latedef: true,
                        newcap: false,
                        noarg: true,
                        quotmark: true,
                        trailing: true,
                        undef: true,
                        unused: true,
                        
                        boss: true,
                        eqnull: true,
                        evil: true,
                        validthis: true,
                        
                        node: true,
                        globals:
                        {
                            self: true,
                        }
                    },
                    gruntfile:
                    {
                        src: 'Gruntfile.js'
                    },
                    lib_test:
                    {
                        src: ['jasmine/**/*.js', 'jscrewit.js', 'test/**/*.js']
                    }
                },
                nodeunit:
                {
                    files: ['test/**/*_test.js']
                },
                watch:
                {
                    gruntfile:
                    {
                        files: '<%= jshint.gruntfile.src %>',
                        tasks: ['jshint:gruntfile']
                    },
                    lib_test:
                    {
                        files: '<%= jshint.lib_test.src %>',
                        tasks: ['jshint:lib_test', 'jasmine_node']
                    }
                }
            }
        );

        // These plugins provide necessary tasks.
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-contrib-watch');
        grunt.loadNpmTasks('grunt-jasmine-node-coverage');

        // Default task.
        grunt.registerTask('default', ['jshint', 'jasmine_node']);

    };
