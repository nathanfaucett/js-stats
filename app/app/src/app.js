var page = require("page"),
    utils = require("utils"),
    each = require("each"),
    request = require("request"),
    cookies = require("cookies"),
    config = require("./config"),
    router = require("./router");


request.defaults.headers["Content-Type"] = "application/json";


var app = module.exports;


app.cookies = cookies;
app.request = request;
app.page = page;
app.router = router;
app.config = config;

app.locals = {
    utils: utils,
    each: each,
    config: config
};

page.html5Mode(config.html5Mode);
page.base("/html5/node/stats/app/app/");

page.on("request", function(ctx) {

    ctx.app = app;
    ctx.page = page;
    ctx.locals = app.locals;

    router.handler(ctx);
});


app.init = function() {

    page.init();
};
