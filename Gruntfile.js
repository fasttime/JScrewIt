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
                coverage: { },
                files: ['jasmine/**/*.js']
            },
            jshint:
            {
                files: ['Gruntfile.js', 'jscrewit.js', 'fuck.js', 'jasmine/**/*.js'],
                options:
                {
                    curly: true,
                    eqeqeq: true,
                    immed: true,
                    latedef: true,
                    maxlen: 100,
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
            uglify:
            {
                options: { compress: { global_defs: { DEBUG: false } } },
                main: { files: { 'jscrewit.min.js': ['jscrewit.js'] } }
            }
        }
    );
    
    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jasmine-node-coverage');
    
    // Default task.
    grunt.registerTask('default', ['jshint', 'jasmine_node', 'uglify']);
};
