module.exports = function(grunt) {
    var config = {
            liveReloadPort: 35729
        };

    grunt.initConfig({
        uglify: {
            compile: {
                files: {
                    "dest/index.js": [
                        "dest/index.js"
                    ]
                }
            }
        },
        jsbeautifier: {
            files: [
                "app/src/**/*.js",
                "!**/node_modules/**/*"
            ]
        },
        requirejs: {
            compile: {
                options: {
                    main: "app/src/index.js",
                    out: "app/index.js",
                    verbose: false
                }
            }
        },
        less: {
            production: {
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
            },
            development: {
				options: {
					compress: false,
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
        copy: {
            production: {
                files: [
                    {
                        expand: true,
                        cwd: "app",
                        src: [
                            "index.html",
                            "index.css",
                            "index.js",
                            "img/**/*",
                            "src/**/*.ejs",
                            "src/**/*.html",
                            "src/**/*.png",
                            "src/**/*.jpeg",
                            "src/**/*.jpg"
                        ],
                        dest: "dest"
                    }
                ]
            }
        },
        clean: {
            production: [
                "dest"
            ],
            development: [
                "app/index.html",
                "app/index.js",
                "app/index.css"
            ],
        },
        htmlmin: {
            production: {
                options: {
                    removeComments: true,
                    minifyJS: true,
                    minifyCSS: true,
                    collapseWhitespace: true
                },
                files: [
                    {
                        expand: true,
                        cwd: "dest",
                        src: [
                            "**/*.html",
                        ],
                        dest: "dest"
                    }
                ]
            }
        },
        ejs: {
            index_production: {
                options: {
                    data: {
                        development: false
                    },
                    template: "app/index.ejs",
                    out: "app/index.html"
                }
            },
            index_development: {
                options: {
                    data: {
                        development: true,
                        liveReloadPort: config.liveReloadPort
                    },
                    template: "app/index.ejs",
                    out: "app/index.html"
                }
            }
        },
        vulcanize: {
            "default": {
                options: {
                    inline: true,
                    excludes: {
                        styles: ["index.css"]
                    }
                },
                files: {
                    "app/index.html": "app/index.html"
                }
            }
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
                "app/src/**/*.js",
                "!**/node_modules/**/*"
            ]
        },
        watch: {
            options: {
                livereload: config.liveReloadPort
            },
            js: {
                files: [
                    "app/**/*.js",
                    "!app/index.js"
                ],
                tasks: ["requirejs"],
                options: {
                    spawn: false,
                }
            },
            less: {
                files: [
                    "app/**/*.less",
                    "!app/index.css"
                ],
                tasks: ["less:development"],
                options: {
                    spawn: false,
                }
            },
            html: {
                files: [
                    "app/**/*.html",
                    "!app/index.html"
                ],
                options: {
                    spawn: false,
                }
            },
            ejs: {
                files: [
                    "app/**/*.ejs",
                    "app/index.ejs"
                ],
                tasks: ["ejs:index_development"],
                options: {
                    spawn: false,
                }
            }
        }
    });

    grunt.registerMultiTask("ejs", "compile ejs templates", function() {
        var ejs = require("ejs"),
            fs = require("fs"),

            done = this.async(),
            options = this.options(),
            ejsOptions = {
                locals: options.data || (options.data = {}),
                settings: options.settings
            };

        if (options.functions) {
            for (var key in options.functions) {
                options.data[key] = options.functions[key]();
            }
        }

        ejsOptions.locals.env = process.env;

        ejs.render(options.template, ejsOptions, function(err, str) {
            if (err) {
                grunt.log.error(err);
                done();
                return;
            }

            fs.writeFile(options.out, str, function(err) {
                if (err) {
                    grunt.log.error(err);
                }
                done();
            });
        });
    });

    grunt.loadNpmTasks("grunt-jsbeautifier");
    grunt.loadNpmTasks("grunt-contrib-jshint");

    grunt.loadNpmTasks("grunt-require.js");
    grunt.loadNpmTasks("grunt-vulcanize");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-htmlmin");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-clean");

    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.registerTask("default", [
        "jsbeautifier",
        "jshint"
    ]);

    grunt.registerTask("production", [
        "clean:production",
        "ejs:index_production",
        "vulcanize",
        "requirejs",
        "less:production",
        "copy:production",
        "htmlmin",
        "uglify"
    ]);
    grunt.registerTask("prod", ["production"]);
    grunt.registerTask("build", ["production"]);

    grunt.registerTask("build:development", [
        "clean:development",
        "ejs:index_development",
        "requirejs",
        "less:development"
    ]);
    grunt.registerTask("build:dev", ["build:development"]);
    grunt.registerTask("development", [
        "build:development",
        "watch"
    ]);
    grunt.registerTask("dev", ["development"]);
};
