module.exports = function (grunt) {
    grunt.initConfig({
        fixturesPath: "fixtures",

        htmlbuild: {
            dist: {
                src: './*.html',
                dest: './samples/',
                options: {
                    beautify: true,
                    //allowUnknownTags: true,
                    //parseTag: 'htmlbuild',
                    // keepTags: true,
                    relative: true,
                    processFiles: true,
                    scripts: {
                        bundle: [
                            '<%= fixturesPath %>/scripts/*.js',
                            '!**/main.js',
                        ],
                        bundle_remote: [
                            "//cdn.jsdelivr.net/jquery/2.1.0/jquery.min.js",
                            "//cdn.jsdelivr.net/bootstrap/3.1.1/js/bootstrap.min.js"
                        ],
                        inlineapp: '<%= fixturesPath %>/scripts/app.js',
                        main: '<%= fixturesPath %>/scripts/main.js'
                    },
                    styles: {
                        bundle: { 
                            cwd: '<%= fixturesPath %>',
                            files: [
                                'css/libs.css',
                                'css/dev.css',
                                'css/another.less'
                            ]
                        },
                        test: '<%= fixturesPath %>/css/inline.css',
                        pageSpecific: '<%= fixturesPath %>/css/$(filename).inline.css'
                    },
                    sections: {
                        views: '<%= fixturesPath %>/views/**/*.html',
                        templates: '<%= fixturesPath %>/templates/**/*.html',
                    },
                    data: {
                        version: "0.1.0",
                        title: "test",
                    },
                }
            }
        }
    });

    grunt.loadTasks('tasks');

    grunt.registerTask('default', ['htmlbuild']);
};