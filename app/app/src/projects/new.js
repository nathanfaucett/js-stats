var $ = require("jquery"),
    page = require("page"),
    request = require("request"),
    router = require("../router"),
    config = require("../config");


router.route("/projects/new",
    function(ctx, next) {
        ctx.render("#content", "src/projects/templates/new.ejs", null, function(err) {
            next(err);
        });
    },
    function(ctx, next) {
        $form = $("#form");

        $form.find("#submit").on("click", function(e) {
            var title = $form.find("#title").val(),
                description = $form.find("#description").val();

            request.post(config.url + "/projects", {
                title: title,
                description: description
            }).then(
                function(response) {
                    page.go("/projects");
                },
                function(response) {
                    throw new Error(response.data);
                }
            );

            e.preventDefault();
        });
    }
);
