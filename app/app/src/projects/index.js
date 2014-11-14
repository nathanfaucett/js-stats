var request = require("request"),
    router = require("../router"),
    config = require("../config");


router.route("/projects",
    function(ctx, next) {
        request.get(config.url +"/projects").then(
            function(response) {
                ctx.render("#content", "src/projects/templates/index.ejs", {
                    projects: response.data
                }, function(err) {
                    if (err) next(err);
                });
            },
            function(response) {
                next(new Error(response.statusCode));
            }
        );
    }
);


require("./create");
