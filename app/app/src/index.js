var page = require("page"),
    cookies = require("cookies"),
    request = require("request"),
    user = require("./user/user"),
    router = require("./router"),
    config = require("./config"),
    app = require("./app");


router.use(
    require("./render"),
    require("./i18n"),
    function(ctx, next) {
        var path = ctx.pathname;

        if (path !== "/sign_in" && path !== "/sign_up" && !app.cookies.has("apiToken")) {
            page.go("/sign_in");
        } else {
            next();
        }
    },
    function(ctx, next) {
        var apiToken = cookies.get("apiToken");

        function header() {
            ctx.render("#header", "src/application/templates/header.ejs", null, next);
        }

        if (apiToken) {
            if (!user.apiToken) {
                request.get(config.url + "/users/token/" + apiToken).then(
                    function(response) {
                        user.create(response.data);
                        header();
                    },
                    function() {
                        user.destroy();
                        next();
                    }
                );
            } else {
                header();
            }
        } else {
            next();
        }
    }
);

require("./application/index");
require("./projects/index");
require("./user/index");

router.use(
    function(ctx, next) {
        ctx.render("#content", "src/app/templates/404.ejs", null, next);
    },
    function(err, ctx, next) {
        throw err;
    }
);


console.log(router);


app.init();
