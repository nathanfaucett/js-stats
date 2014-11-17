var $ = require("jquery"),
    request = require("request"),
    page = require("page"),
    utils = require("utils"),
    helpers = require("../helpers"),
    router = require("../router"),
    config = require("../config");


router.route("/projects",
    function(ctx, next) {
        request.get(config.url +"/projects").then(
            function(response) {
                ctx.projects = response.data;

                ctx.render("#content", "src/projects/templates/index.ejs", {
                    projects: response.data
                }, next);
            },
            function(response) {
                next(new Error(response.statusCode));
            }
        );
    },
    function(ctx, next) {
        var $items = $(".list .item");

        function destroyProject(id) {
            request.delete(config.url + "/projects/"+ id).then(
                function(response) {
                    var projects = ctx.projects,
                        project = helpers.whereId(projects, id);

                    if (project) {
                        utils.remove(projects, project);
                    }

                    ctx.render("#content", "src/projects/templates/index.ejs", {
                        projects: projects
                    });
                },
                function(response) {

                }
            );
        }

        $items.find(".project-delete").on("click", function(e) {
            var $this = $(this),
                id = +$this.attr("id");

            if (id) {
                destroyProject(id);
            }

            e.preventDefault();
        });
    }
);


require("./show");
require("./new");
