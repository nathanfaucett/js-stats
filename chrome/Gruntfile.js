module.exports = function(grunt) {

    grunt.initConfig({
        jsbeautifier: {
            files: [
                "**/*.js",
                "!**/node_modules/**/*"
            ]
        },
        jshint: {
            options: {
                es3: true,
                unused: true,
                curly: false,
                eqeqeq: true,
                expr: true,
                eqnull: true
            },
            files: [
                "**/*.js",
                "!**/node_modules/**/*"
            ]
        },
        requirejs: {
            compile: {
                options: {
                    main: "app/js/index.js",
                    out: "app/index.js",
                    verbose: false
                }
            }
        },
        less: {
            compile: {
                options: {
                    compress: true,
                    optimization: 0,
                    ieCompat: true
                },
                files: {
                    "app/index.css": [
                        "app/css/index.less"
                    ]
                }
            }
        },
        watch: {
            options: {
                livereload: 35729
            },
            less: {
                files: [
                    "app/css**/*"
                ],
                tasks: ["less"],
                options: {
                    spawn: false,
                },
            },
            js: {
                files: [
                    "app/js/**/*"
                ],
                tasks: ["requirejs"],
                options: {
                    spawn: false,
                },
            },
            html: {
                files: [
                    "app/index.html"
                ],
                options: {
                    spawn: false,
                },
            }
        }
    });

    grunt.loadNpmTasks("grunt-jsbeautifier");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-require.js");

    grunt.registerTask("default", ["watch"]);
    grunt.registerTask("js", ["jsbeautifier", "jshint"]);
    grunt.registerTask("build", ["js", "requirejs", "less"]);
};
