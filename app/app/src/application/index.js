var utils = require("utils"),
    request = require("request"),
    page = require("page"),
    router = require("../router"),
    user = require("../user/user"),
    config = require("../config");


router.route(
    function(ctx, next) {
        ctx.render("#content", "src/application/templates/index.ejs", null, function(err) {
            if (err) next(err);
        });
    }
);

router.route("/sign_out",
    function(ctx, next) {
        request.delete(config.url + "/users/sign_out").then(
            function(response) {
                user.destroy();
                page.go("/sign_in");
            },
            function(response) {
                next(new Error(response.statusCode));
            }
        );
    }
);
