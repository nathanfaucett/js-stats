var page = require("page"),
    //stats = require("../../../browser/src/index"),
    cookies = require("cookies"),
    request = require("request"),
    user = require("./user/user"),
    router = require("./router"),
    config = require("./config"),
    app = require("./app");


//stats.set("MZhLXvdaS2Cjf4OuNNtidkg359jeuJ1URKit7bV47DRNMHGJkIE47sEC6bMiexNu", 1, config.env);


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

        ctx.user = user;
        ctx.locale = user && user.locale || "en";

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
                    function(response) {
                        if (response.statusCode === 0) {
                            alert("Server Down");
                        } else {
                            user.destroy();
                            page.go("/sign_in");
                        }
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
        ctx.render("#content", "src/application/templates/404.ejs", null, next);
    },
    function(err, ctx, next) {
        throw err;
    }
);


app.init();
