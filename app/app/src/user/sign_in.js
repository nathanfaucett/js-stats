var $ = require("jquery"),
    utils = require("utils"),
    request = require("request"),
    cookies = require("cookies"),
    user = require("./user"),
    page = require("page"),
    router = require("../router"),
    config = require("../config");


router.route("/sign_in",
    function(ctx, next) {
        if (user.apiToken && cookies.has("apiToken")) {
            page.back();
            return;
        }

        $("#header").empty();

        ctx.render("#content", "src/user/templates/sign_in.ejs", null, next);
    },
    function(ctx, next) {
        var $content = $("#content");

        $content.find("#submit").on("click", function(e) {
            var email = $content.find("#email").val(),
                password = $content.find("#password").val();

            request.post(config.url + "/users/sign_in", {
                email: email,
                password: password
            }).then(
                function(response) {
                    user.create(response.data);
                    page.go("/");
                },
                function(response) {
                    // handle errors
                    console.log(response);
                }
            );

            e.preventDefault();
        });
    }
);
