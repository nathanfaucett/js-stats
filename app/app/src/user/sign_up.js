var $ = require("jquery"),
    utils = require("utils"),
    request = require("request"),
    page = require("page"),
    cookies = require("cookies"),
    user = require("./user"),
    config = require("../config"),
    router = require("../router");


router.route("/sign_up",
    function(ctx, next) {
        if (user.apiToken && cookies.has("apiToken")) {
            page.back();
            return;
        }

        $("#header").empty();

        ctx.render("#content", "src/user/templates/sign_up.ejs", null, next);
    },
    function(ctx, next) {
        var $content = $("#content");

        $content.find("#submit").on("click", function(e) {
            var email = $content.find("#email").val(),
                password = $content.find("#password").val(),
                confirmPassword = $content.find("#confirm-password").val();

            if (confirmPassword !== password) return;

            request.post(config.url + "/users/sign_up", {
                email: email,
                password: password
            }).then(
                function(response) {
                    user.create(response.data);
                    page.go("/");
                },
                function(response) {
                    console.log(response);
                }
            );

            e.preventDefault();
        });
    }
);
