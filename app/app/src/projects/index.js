var utils = require("utils"),
    request = require("request"),
    user = require("../user/user"),
    router = require("../router"),
    config = require("../config");


router.route("/projects",
    function(ctx, next) {
        ctx.render("#content", "src/projects/templates/index.ejs", {
            projects: []
        }, function(err) {
            if (err) next(err);
        });
    }
);
