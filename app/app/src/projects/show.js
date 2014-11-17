var $ = require("jquery"),
    qs = require("qs"),
    page = require("page"),
    request = require("request"),
    router = require("../router"),
    config = require("../config");


router.route("/projects/:id[0-9]",
    function(ctx, next) {
        request.get(config.url +"/projects/"+ ctx.params.id).then(
            function(response) {
                ctx.render("#content", "src/projects/templates/show.ejs", {
                    user: ctx.user,
                    project: response.data
                }, next);
            },
            function(response) {
                next(new Error(response.data));
            }
        );
    },
    function(ctx, next) {


        request.get(config.url +"/projects/"+ ctx.params.id +"/requests").then(
            function(response) {
                console.log(response);
            },
            function(response) {
                next(new Error(response.data));
            }
        );
    }
);
