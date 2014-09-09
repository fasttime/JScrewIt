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
                all: ['jasmine/**/*.js'],
                coverage: { },
                options: { forceExit: true }
            },
            jshint:
            {
                all: ['*.js', 'jasmine/**/*.js'],
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
                    globals: { self: true }
                }
            },
            watch:
            {
                files: ['*.js', 'jasmine/**/*.js'],
                tasks: ['jshint', 'jasmine_node'],
                options: { interrupt: true }
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
